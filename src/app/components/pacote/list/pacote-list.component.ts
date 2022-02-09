import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { LancamentoService } from 'src/app/core/services/lancamento.service';
import { Pagination } from 'src/app/shared/components/pagination/pagination';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PerfilEnum } from '../../../core/model/enum/perfil.enum';
import { PageableFilter } from '../../../core/model/filter/filter.filter';
import { PacoteFilter } from '../../../core/model/filter/pacote.filter';
import { CategoriaAtendimento } from '../../../core/model/model/categoria-atendimento.model';
import { Paciente } from '../../../core/model/model/paciente.model';
import { Pacote } from '../../../core/model/model/pacote.model';
import Page from '../../../core/model/model/page.model';
import { Usuario } from '../../../core/model/model/usuario.model';
import { CategoriaAtendimentoService } from '../../../core/services/categoria-atendimento.service';
import { MessageService } from '../../../core/services/message.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { PacoteService } from '../../../core/services/pacote.service';
import { SharedService } from '../../../core/services/shared.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Messages } from '../../../shared/messages/messages';
import { ModalConfirmacaoComponent } from '../../../shared/modais/modal-confirmacao/modal-confirmacao.component';
import { ModalVisualizarPacoteComponent } from '../../../shared/modais/modal-visualizar-pacote/modal-visualizar-pacote.component';
import Util from '../../../shared/util/util';
import { ModalGerenciarLancamentoPacoteComponent } from '../../controle-caixa/modal/gerenciar-lancamento-pacote/modal-gerenciar-lancamento-pacote.component';

@Component({
  selector: 'app-pacote-list',
  templateUrl: './pacote-list.component.html'
})
export class PacoteListComponent extends Pagination<PacoteFilter> implements OnInit {

  public pacientes = new Array<Paciente>();
  public usuarios = new Array<Usuario>();
  public categoriasAtendimento = new Array<CategoriaAtendimento>();
  public dados = new Page<Array<Pacote>>();
  public currentUser = new Usuario();
  public permissaoAdministrador = PerfilEnum.ADMINISTRADOR;
  public form: FormGroup;
  public showNoRecords = false;
  public subscription: Subscription;

  public constructor(
    private formBuilder: FormBuilder,
    private service: PacoteService,
    messageService: MessageService,
    private pacienteService: PacienteService,
    private modalService: BsModalService,
    private categoriaAtendimentoService: CategoriaAtendimentoService,
    private usuarioService: UsuarioService,
    private sharedService: SharedService,
    public authGuardService: AuthGuard,
    private lancamentoService: LancamentoService
  ) {
    super(messageService);
    this.subscription = this.lancamentoService.getLancamento().subscribe(() => {
      this.searchByFilter();
    });
  }

  public ngOnInit(): void {
    this.onCreateForm();
    this.getCurrentUser();
    this.onLoadCombos();
  }

  private getCurrentUser(): void {
    this.currentUser = this.sharedService.getUserSession();
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      categoriaAtendimentoId: [null],
      pacienteId: [null],
      usuarioId: [null],
      aberto: [null],
      lancamentoPendente: [null],
      dataInicio: [null],
      dataFim: [null]
    });
  }

  private onLoadCombos(): void {
    this.pacienteService.findAll().subscribe(response => {
      this.pacientes = response.result;
    });
    this.categoriaAtendimentoService.findAll().subscribe(response => {
      this.categoriasAtendimento = response.result;
    });
    if (this.currentUser.perfilRole === this.permissaoAdministrador) {
      this.usuarioService.findAll().subscribe(response => {
        this.usuarios = response.result;
      });
    }
  }

  public onClickClosePacote(id: number): void {
    this.messageService.clearAllMessages();
    const modalRef = this.modalService.show(ModalConfirmacaoComponent, { backdrop: 'static' });
    modalRef.content.titulo = 'Confirmação de Encerramento de Pacote';
    modalRef.content.corpo = 'Ao encerrar o pacote não será possível cadastrar atendimento ao mesmo. Deseja continuar?';
    modalRef.content.onClose.subscribe(ressult => {
      if (ressult) {
        this.service.closePackage(id).subscribe(response => {
          this.searchByFilter();
          this.messageService.sendMessageSuccess(response.message);
        });
      }
    });
  }

  public onClickFormSubmit(avoidShowMessage?: boolean): void {
    if (!avoidShowMessage) {
      this.messageService.clearAllMessages();
    }
    const dataInicio = this.form.value.dataInicio;
    const dataFim = this.form.value.dataFim;
    if (dataInicio && !Util.isDataValida(dataInicio)) {
      this.messageService.sendMessageError(Messages.MSG0013);
      return;
    }
    if (dataFim && !Util.isDataValida(dataFim)) {
      this.messageService.sendMessageError(Messages.MSG0014);
      return;
    }
    this.filtro = new PageableFilter<PacoteFilter>();
    this.filtro = {
      ...this.filtro,
      orderBy: 'dataCriacao',
      direction: 'DESC',
      filter: {
        ...this.form.value,
        dataInicio: Util.convertStringToDate(dataInicio),
        dataFim: Util.convertStringToDate(dataFim)
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
    this.dados = new Page<Array<Pacote>>();
    this.filtro = new PageableFilter<PacoteFilter>();
    this.showNoRecords = false;
  }

  public onClickOpenModalVisualizar(pacote: Pacote): void {
    this.messageService.clearAllMessages();
    const initialState = {
      dados: pacote
    };
    this.modalService.show(ModalVisualizarPacoteComponent, { initialState, backdrop: 'static', class: 'gray modal-lg' });
  }

  public async onClickOpenModalGerenciarLancamentos(id: number): Promise<void> {
    this.messageService.clearAllMessages();
    const initialState = {
      dados: (await this.service.findById(id).toPromise()).result
    };
    this.modalService.show(ModalGerenciarLancamentoPacoteComponent, { initialState, class: 'gray modal-lg', backdrop: 'static' });
  }

  public onClickExcluir(id: number): void {
    this.messageService.clearAllMessages();
    const modalRef = this.modalService.show(ModalConfirmacaoComponent, { backdrop: 'static' });
    modalRef.content.titulo = 'Confirmação de Exclusão';
    modalRef.content.corpo = 'Deseja excluir esse registro?';
    modalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.service.delete(id).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.onClickFormSubmit(true);
        });
      }
    });
  }
}
