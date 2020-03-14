import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PerfilEnum } from 'src/app/core/model/enum/perfil.enum';
import { TipoAtendimentoEnum } from 'src/app/core/model/enum/tipo-atendimento.enum';
import { AtendimentoFilter } from 'src/app/core/model/filter/atendimento.filter';
import { PageableFilter } from 'src/app/core/model/filter/filter.filter';
import { Atendimento } from 'src/app/core/model/model/atendimento.model';
import { CategoriaAtendimentoRouting } from 'src/app/core/model/model/categoria-atendimento-routing.model';
import { Response } from 'src/app/core/model/model/response.model';
import { Usuario } from 'src/app/core/model/model/usuario.model';
import { LancamentoService } from 'src/app/core/services/lancamento.service';
import { MessageService } from 'src/app/core/services/message.service';
import { Pagination } from 'src/app/shared/components/pagination/pagination';
import { Messages } from 'src/app/shared/messages/messages';
import { ModalVisualizarAtendimentoComponent } from 'src/app/shared/modais/modal-visualizar-atendimento/modal-visualizar-atendimento.component';
import Util from 'src/app/shared/util/util';
import { Paciente } from '../../../core/model/model/paciente.model';
import Page from '../../../core/model/model/page.model';
import { TipoAtendimento } from '../../../core/model/model/tipo-atendimento.model';
import { AtendimentoService } from '../../../core/services/atendimento.service';
import { ModalGerenciarLancamentoPacoteComponent } from '../../controle-caixa/modal/gerenciar-lancamento-pacote/modal-gerenciar-lancamento-pacote.component';
import { ModalGerenciarLancamentoSessaoComponent } from '../../controle-caixa/modal/gerenciar-lancamento-sessao/modal-gerenciar-lancamento-sessao.component';
import { PacoteService } from 'src/app/core/services/pacote.service';

@Component({
  selector: 'app-atendimento-list',
  templateUrl: './atendimento-list.component.html'
})
export class AtendimentoListComponent extends Pagination<AtendimentoFilter> implements OnInit {

  public pacientes = new Array<Paciente>();
  public usuarios = new Array<Usuario>();
  public tiposAtendimento = new Array<TipoAtendimento>();
  public categoriaAtendimentoRouting = new CategoriaAtendimentoRouting();
  public dados = new Page<Array<Atendimento>>();
  public currentUser = new Usuario();
  public permissaoAdministrador = PerfilEnum.ADMINISTRADOR;
  public form: FormGroup;
  public showNoRecords = false;
  public subscription: Subscription;

  public constructor(
    private formBuilder: FormBuilder,
    private service: AtendimentoService,
    messageService: MessageService,
    private route: ActivatedRoute,
    private pacoteService: PacoteService,
    private router: Router,
    public authGuardService: AuthGuard,
    private modalService: BsModalService,
    private lancamentoService: LancamentoService,
  ) {
    super(messageService);
    this.subscription = this.lancamentoService.getLancamento().subscribe(() => {
      this.searchByFilter();
    });
  }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
    this.onLoadCategoriaAtendimento();
  }

  public isSessao(value: number): boolean {
    return TipoAtendimentoEnum.SESSAO === value;
  }

  public isPacote(value: number): boolean {
    return TipoAtendimentoEnum.PACOTE === value;
  }

  public calcularTempo(dataInicio: any, dataFim: any): string {
    return Util.calcularTempoHorasMinutos(dataInicio, dataFim);
  }

  private onLoadCategoriaAtendimento(): void {
    this.route.data.subscribe((response: CategoriaAtendimentoRouting) => {
      this.categoriaAtendimentoRouting = response;
      this.form.controls.categoriaAtendimentoId.setValue(response.id);
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      tipoAtendimentoId: [null],
      pacienteId: [null],
      usuarioId: [null],
      preAtendimentoData: [null],
      posAtendimentoData: [null],
      aberto: null,
      categoriaAtendimentoId: [null]
    });
  }

  private onLoadCombos(): void {
    this.route.data.subscribe(response => {
      this.pacientes = response.resolve.pacientes.result;
    });
    this.route.data.subscribe(response => {
      this.usuarios = response.resolve.usuarios.result;
    });
    this.route.data.subscribe(response => {
      this.tiposAtendimento = response.resolve.tiposAtendimento.result;
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    const dataInicio = this.form.value.preAtendimentoData;
    const dataFim = this.form.value.posAtendimentoData;
    if (dataInicio && !Util.isDataHoraValida(dataInicio)) {
      this.messageService.sendMessageError(Messages.MSG0016);
      return;
    }
    if (dataFim && !Util.isDataHoraValida(dataFim)) {
      this.messageService.sendMessageError(Messages.MSG0017);
      return;
    }
    this.filtro = new PageableFilter<AtendimentoFilter>();
    this.filtro = {
      ...this.filtro,
      orderBy: 'preAtendimento.data',
      direction: 'DESC',
      filter: {
        ...this.form.value,
        preAtendimentoData: Util.convertStringToDateTime(dataInicio),
        posAtendimentoData: Util.convertStringToDateTime(dataFim)
      }
    };
    this.searchByFilter();
  }

  public searchByFilter(): void {
    this.service.findByFilter(this.filtro).subscribe(response => {
      this.showNoRecords = true;
      this.dados = response.result;
    });
  }

  public onClickLimparCampos(): void {
    this.messageService.clearAllMessages();
    this.onCreateForm();
    this.dados = new Page<Array<Atendimento>>();
    this.filtro = new PageableFilter<AtendimentoFilter>();
    this.form.controls.categoriaAtendimentoId.setValue(this.categoriaAtendimentoRouting.id);
    this.showNoRecords = false;
  }

  public onClickEditar(id: number): void {
    this.messageService.clearAllMessages();
    this.router.navigate([`/atendimento/${this.categoriaAtendimentoRouting.rota}/alterar/${id}`]);
  }

  public async onClickOpenModalVisualizar(id: number): Promise<void> {
    const atendimento: Response<Atendimento> = await this.service.findById(id).toPromise();
    this.messageService.clearAllMessages();
    const initialState = {
      atendimento: atendimento.result
    };
    this.modalService.show(ModalVisualizarAtendimentoComponent, { initialState, class: 'gray modal-lg', backdrop: 'static' });
  }

  public async onClickOpenModalGerenciarLancamentoSessao(id: number): Promise<void> {
    this.messageService.clearAllMessages();
    const initialState = {
      atendimento: (await this.service.findById(id).toPromise()).result
    };
    this.modalService.show(ModalGerenciarLancamentoSessaoComponent, { initialState, class: 'gray modal-lg', backdrop: 'static' });
  }

  public async onClickOpenModalGerenciarLancamentoPacote(id: number): Promise<void> {
    this.messageService.clearAllMessages();
    const initialState = {
      pacote: (await this.pacoteService.findById(id).toPromise()).result
    };
    this.modalService.show(ModalGerenciarLancamentoPacoteComponent, { initialState, class: 'gray modal-lg', backdrop: 'static' });
  }

}
