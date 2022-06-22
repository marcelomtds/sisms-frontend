import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { FormaPagamentoEnum } from 'src/app/core/model/enum/forma-pagamento.enum';
import { TipoAtendimentoEnum } from 'src/app/core/model/enum/tipo-atendimento.enum';
import { AtendimentoService } from 'src/app/core/services/atendimento.service';
import { PacoteService } from 'src/app/core/services/pacote.service';
import { Pagination } from 'src/app/shared/components/pagination/pagination';
import { Messages } from 'src/app/shared/messages/messages';
import { ModalConfirmacaoComponent } from 'src/app/shared/modais/modal-confirmacao/modal-confirmacao.component';
import { TipoLancamentoEnum } from '../../../core/model/enum/tipo-lancamento.enum';
import { PageableFilter } from '../../../core/model/filter/filter.filter';
import { LancamentoFilter } from '../../../core/model/filter/lancamento.filter';
import { CategoriaAtendimento } from '../../../core/model/model/categoria-atendimento.model';
import { CategoriaLancamento } from '../../../core/model/model/categoria-lancamento.model';
import { FormaPagamento } from '../../../core/model/model/forma-pagamento.model';
import { LancamentoTotal } from '../../../core/model/model/lancamento-total.model';
import { Lancamento } from '../../../core/model/model/lancamento.model';
import { Paciente } from '../../../core/model/model/paciente.model';
import Page from '../../../core/model/model/page.model';
import { PeriodoData } from '../../../core/model/model/periodo-data.model';
import { TipoAtendimento } from '../../../core/model/model/tipo-atendimento.model';
import { TipoLancamento } from '../../../core/model/model/tipo-lancamento.model';
import { Usuario } from '../../../core/model/model/usuario.model';
import { CategoriaAtendimentoService } from '../../../core/services/categoria-atendimento.service';
import { CategoriaLancamentoService } from '../../../core/services/categoria-lancamento.service';
import { FormaPagamentoService } from '../../../core/services/forma-pagamento.service';
import { LancamentoService } from '../../../core/services/lancamento.service';
import { MessageService } from '../../../core/services/message.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { TipoAtendimentoService } from '../../../core/services/tipo-atendimento.service';
import { TipoLancamentoService } from '../../../core/services/tipo-lancamento.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import Util from '../../../shared/util/util';
import { ModalGerenciarLancamentoComponent } from 'src/app/shared/components/modal-gerenciar-lancamento/modal-gerenciar-lancamento.component';

@Component({
  selector: 'app-controle-caixa-list',
  templateUrl: './controle-caixa-list.component.html'
})
export class ControleCaixaListComponent extends Pagination<LancamentoFilter> implements OnInit, OnDestroy {

  public pacientes = new Array<Paciente>();
  public usuarios = new Array<Usuario>();
  public tiposLancamento = new Array<TipoLancamento>();
  public tiposAtendimento = new Array<TipoAtendimento>();
  public categoriasLancamento = new Array<CategoriaLancamento>();
  public categoriasAtendimento = new Array<CategoriaAtendimento>();
  public formasPagamento = new Array<FormaPagamento>();
  public mesAnoList = new Array<PeriodoData>();
  public form: FormGroup;
  public dados = new Page<Array<Lancamento>>();
  public showNoRecords = false;
  public lancamentoTotal = new LancamentoTotal;
  public mesAno: PeriodoData;
  public subscription: Subscription;

  public constructor(
    private formBuilder: FormBuilder,
    private categoriaAtendimentoService: CategoriaAtendimentoService,
    private categoriaLancamentoService: CategoriaLancamentoService,
    private formaPagamentoService: FormaPagamentoService,
    private pacienteService: PacienteService,
    private usuarioService: UsuarioService,
    private tipoLancamentoService: TipoLancamentoService,
    private tipoAtendimentoService: TipoAtendimentoService,
    private pacoteService: PacoteService,
    private atendimentoService: AtendimentoService,
    private service: LancamentoService,
    private router: Router,
    messageService: MessageService,
    private modalService: BsModalService
  ) {
    super(messageService);
    this.subscription = this.categoriaLancamentoService.getCategoriaLancamento().subscribe(() => {
      this.onLoadComboCategoriaLancamento();
    });
    this.subscription = this.service.getLancamento().subscribe(() => {
      this.searchByFilter();
    });
  }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
    this.getDatas();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onCreateForm(): void {
    this.form = this.formBuilder.group({
      tipoLancamentoId: [null],
      tipoAtendimentoId: [null],
      categoriaAtendimentoId: [null],
      pacienteId: [null],
      usuarioId: [null],
      formaPagamentoId: [null],
      categoriaLancamentoId: [null],
      dataInicio: [null],
      dataFim: [null]
    });
  }

  public get isEntrada(): boolean {
    return this.form.controls.tipoLancamentoId.value === TipoLancamentoEnum.ENTRADA || !this.form.controls.tipoLancamentoId.value;
  }

  public get isSaida(): boolean {
    return this.form.controls.tipoLancamentoId.value === TipoLancamentoEnum.SAIDA || !this.form.controls.tipoLancamentoId.value;
  }

  public onChangeTipoLancamento(): void {
    const tipoLancamentoId = this.form.controls.tipoLancamentoId.value;
    this.onCreateForm();
    this.form.controls.tipoLancamentoId.setValue(tipoLancamentoId);
    this.mesAno = null;
  }

  public onLoadCombos(): void {
    this.usuarioService.findAll().subscribe(response => {
      this.usuarios = response.result;
    });
    this.tipoLancamentoService.findAllIgnoringIds([TipoLancamentoEnum.ENTRADA_CREDITO, TipoLancamentoEnum.UTILIZACAO_CREDITO]).subscribe(response => {
      this.tiposLancamento = response.result;
    });
    this.tipoAtendimentoService.findAll().subscribe(response => {
      this.tiposAtendimento = response.result;
    });
    this.categoriaAtendimentoService.findAll().subscribe(response => {
      this.categoriasAtendimento = response.result;
    });
    this.pacienteService.findAll().subscribe(response => {
      this.pacientes = response.result;
    });
    this.formaPagamentoService.findAllIgnoringIds([FormaPagamentoEnum.UTILIZACAO_CREDITO]).subscribe(response => {
      this.formasPagamento = response.result;
    });
    this.onLoadComboCategoriaLancamento();
  }

  public onLoadComboCategoriaLancamento(): void {
    this.categoriaLancamentoService.findAll().subscribe(response => {
      this.categoriasLancamento = response.result;
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    const dataInicio = this.form.controls.dataInicio.value;
    const dataFim = this.form.controls.dataFim.value;
    if (dataInicio && !Util.isDataValida(dataInicio)) {
      this.messageService.sendMessageError(Messages.MSG0013);
      return;
    }
    if (dataFim && !Util.isDataValida(dataFim)) {
      this.messageService.sendMessageError(Messages.MSG0014);
      return;
    }
    this.filtro = new PageableFilter();
    this.filtro.orderBy = 'data';
    this.filtro.direction = 'DESC';
    this.filtro = {
      ...this.filtro,
      filter: {
        ...this.form.value,
        tipoLancamentoIds: this.getTiposLancamento(),
        dataInicio: Util.convertStringToDate(dataInicio),
        dataFim: Util.convertStringToDate(dataFim)
      },
    };
    this.searchByFilter();
  }

  private getTiposLancamento(): number[] {
    if (!this.form.controls.tipoLancamentoId.value) {
      return [TipoLancamentoEnum.ENTRADA, TipoLancamentoEnum.SAIDA, TipoLancamentoEnum.ENTRADA_CREDITO]
    } else if (this.form.controls.tipoLancamentoId.value === TipoLancamentoEnum.ENTRADA) {
      return [TipoLancamentoEnum.ENTRADA, TipoLancamentoEnum.ENTRADA_CREDITO]
    } else if (this.form.controls.tipoLancamentoId.value === TipoLancamentoEnum.SAIDA) {
      return [TipoLancamentoEnum.SAIDA]
    }
  }

  public searchByFilter(): void {
    this.showNoRecords = true;
    this.service.findByFilter(this.filtro).subscribe(response => {
      this.dados = response.result;
      this.service.findTotalByFilter(this.filtro).subscribe(response => {
        this.lancamentoTotal = response.result;
      });
    });
  }

  public onClickLimparCampos(): void {
    this.messageService.clearAllMessages();
    this.onCreateForm();
    this.dados = new Page<Array<Paciente>>();
    this.filtro = new PageableFilter<LancamentoFilter>();
    this.lancamentoTotal = new LancamentoTotal();
    this.showNoRecords = false;
    this.mesAno = null;
  }

  public onChangeComboMesAno(periodo: PeriodoData): void {
    this.messageService.clearAllMessages();
    if (periodo) {
      this.form.controls.dataInicio.setValue(periodo.dataInicio.toLocaleDateString());
      this.form.controls.dataFim.setValue(periodo.dataFim.toLocaleDateString());
    } else {
      this.form.controls.dataInicio.setValue(null);
      this.form.controls.dataFim.setValue(null);
    }
  }

  private getDatas(): void {
    this.mesAnoList = Util.mesAno();
  }

  exibirBotaExcluir(lancamento: Lancamento): boolean {
    return lancamento.tipoLancamentoId === TipoLancamentoEnum.SAIDA;
  }

  onClickExcluir(id: number): void {
    this.messageService.clearAllMessages();
    const modalRef = this.modalService.show(ModalConfirmacaoComponent, { backdrop: 'static' });
    modalRef.content.titulo = 'Confirmação de Exclusão';
    modalRef.content.corpo = 'Deseja excluir esse registro?';
    modalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.service.delete(id).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.searchByFilter();
        });
      }
    });
  }

  public async onClickEdit(lancamento: Lancamento): Promise<void> {
    this.messageService.clearAllMessages();
    let initialState;
    if (lancamento.tipoLancamentoId === TipoLancamentoEnum.ENTRADA_CREDITO) {
      this.router.navigate([`/credito/alterar/${lancamento.id}`]);
    } else if (lancamento.tipoLancamentoId === TipoLancamentoEnum.SAIDA) {
      this.router.navigate([`/controle-caixa/saida/alterar/${lancamento.id}`]);
    } else if (lancamento.tipoAtendimentoId === TipoAtendimentoEnum.SESSAO) {
      initialState = {
        dados: (await this.atendimentoService.findById(lancamento.atendimentoId).toPromise()).result
      };
      this.modalService.show(ModalGerenciarLancamentoComponent, { initialState, class: 'gray modal-lg', backdrop: 'static' });
    } else if (lancamento.tipoAtendimentoId === TipoAtendimentoEnum.PACOTE) {
      initialState = {
        dados: (await this.pacoteService.findById(lancamento.pacoteId).toPromise()).result
      };
      this.modalService.show(ModalGerenciarLancamentoComponent, { initialState, class: 'gray modal-lg', backdrop: 'static' });
    }
  }
}
