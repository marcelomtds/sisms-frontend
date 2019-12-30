import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { AtendimentoService } from 'src/app/components/atendimento/service/atendimento.service';
import { PacienteService } from 'src/app/components/paciente/service/paciente.service';
import { AuthGuard } from 'src/app/components/security/auth.guard';
import { Messages } from 'src/app/components/shared/message/messages';
import { PerfilEnum } from 'src/app/components/shared/model/enum/perfil.enum';
import { TipoAtendimentoEnum } from 'src/app/components/shared/model/enum/tipo-atendimento.enum';
import { AtendimentoFilter } from 'src/app/components/shared/model/filter/atendimento.filter';
import { PageableFilter } from 'src/app/components/shared/model/filter/filter.filter';
import { Atendimento } from 'src/app/components/shared/model/model/atendimento.model';
import { CategoriaAtendimento } from 'src/app/components/shared/model/model/categoria-atendimento.model';
import { Paciente } from 'src/app/components/shared/model/model/paciente.model';
import { Usuario } from 'src/app/components/shared/model/model/usuario.model';
import Page from 'src/app/components/shared/pagination/page';
import { CategoriaAtendimentoService } from 'src/app/components/shared/services/categoria-atendimento.service';
import { MessageService } from 'src/app/components/shared/services/message.service';
import Util from 'src/app/components/shared/util/util';
import { UsuarioService } from 'src/app/components/usuario/service/usuario.service';
import { ModalGerenciarLancamentoSessaoComponent } from '../../../modal/gerenciar-lancamento/gerenciar-lancamento-sessao/modal-gerenciar-lancamento-sessao.component';
import { LancamentoService } from '../../../service/lancamento.service';

@Component({
  selector: 'app-controle-caixa-entrada-sessao',
  templateUrl: './controle-caixa-entrada-sessao.component.html'
})
export class ControleCaixaEntradaSessaoComponent implements OnInit {

  public pacientes = new Array<Paciente>();
  public usuarios = new Array<Usuario>();
  public categoriasAtendimento = new Array<CategoriaAtendimento>();
  public filtro = new PageableFilter<AtendimentoFilter>();
  public dados = new Page<Array<Atendimento>>();
  public currentUser = new Usuario();
  public permissaoAdministrador = PerfilEnum.administrador;
  public form: FormGroup;
  public showNoRecords = false;
  public subscription: Subscription;

  public constructor(
    private formBuilder: FormBuilder,
    private service: AtendimentoService,
    public messageService: MessageService,
    private lancamentoService: LancamentoService,
    private pacienteService: PacienteService,
    private categoriaAtendimentoService: CategoriaAtendimentoService,
    private usuarioService: UsuarioService,
    public authGuardService: AuthGuard,
    private modalService: BsModalService
  ) {
    this.subscription = this.lancamentoService.getLancamento().subscribe(() => {
      this.searchByFilter();
    });
  }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
  }

  public calcularTempo(dataInicio: any, dataFim: any): string {
    return Util.calcularTempoHorasMinutos(dataInicio, dataFim);
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      tipoAtendimentoId: [TipoAtendimentoEnum.SESSAO],
      pacienteId: [null],
      usuarioId: [null],
      preAtendimentoData: [null],
      posAtendimentoData: [null],
      aberto: null,
      categoriaAtendimentoId: [null]
    });
  }

  private onLoadCombos(): void {
    this.pacienteService.findAll().subscribe(response => {
      this.pacientes = response.result;
    });
    if (this.authGuardService.isPermitido(this.permissaoAdministrador)) {
      this.usuarioService.findAll().subscribe(response => {
        this.usuarios = response.result;
      });
    }
    this.categoriaAtendimentoService.findAll().subscribe(response => {
      this.categoriasAtendimento = response.result;
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    const dataInicio = this.form.value.preAtendimentoData;
    const dataFim = this.form.value.posAtendimentoData;
    if (dataInicio && !Util.isDataHoraValida(dataInicio)) {
      this.messageService.sendMessageError(Messages.DATA_HORA_PRE_ATENDIMENTO_INVALIDA);
      return;
    }
    if (dataFim && !Util.isDataHoraValida(dataFim)) {
      this.messageService.sendMessageError(Messages.DATA_HORA_POS_ATENDIMENTO_INVALIDA);
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
    this.showNoRecords = false;
  }

  public onClickOpenModalGerenciarLancamentos(id: number): void {
    this.messageService.clearAllMessages();
    const initialState = {
      atendimentoId: id
    };
    this.modalService.show(ModalGerenciarLancamentoSessaoComponent, { initialState, class: 'gray modal-lg', backdrop: 'static' });
  }

  public onClickOrderBy(descricao: string): void {
    this.messageService.clearAllMessages();
    if (this.filtro.orderBy === descricao) {
      this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
    } else {
      this.filtro.direction = 'ASC';
    }
    this.filtro.orderBy = descricao;
    this.searchByFilter();
  }

  public getIconOrderBy(param: string): string {
    if (this.filtro.direction === 'ASC' && this.filtro.orderBy === param) {
      return 'fa fa-sort-asc';
    } else if (this.filtro.direction === 'DESC' && this.filtro.orderBy === param) {
      return 'fa fa-sort-desc';
    } else {
      return 'fa fa-sort';
    }
  }

}
