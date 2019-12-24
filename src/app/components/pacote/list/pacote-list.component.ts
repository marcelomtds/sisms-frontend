import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { PacienteService } from '../../paciente/service/paciente.service';
import { AuthGuard } from '../../security/auth.guard';
import { SharedService } from '../../security/service/shared.service';
import { Messages } from '../../shared/message/messages';
import { ModalConfirmacaoComponent } from '../../shared/modais/modal-confirmacao/modal-confirmacao.component';
import { ModalVisualizarPacoteComponent } from '../../shared/modais/modal-visualizar-pacote/modal-visualizar-pacote.component';
import { PerfilEnum } from '../../shared/model/enum/perfil.enum';
import { PageableFilter } from '../../shared/model/filter/filter.filter';
import { PacoteFilter } from '../../shared/model/filter/pacote.filter';
import { CategoriaAtendimento } from '../../shared/model/model/categoria-atendimento.model';
import { Paciente } from '../../shared/model/model/paciente.model';
import { Pacote } from '../../shared/model/model/pacote.model';
import { Usuario } from '../../shared/model/model/usuario.model';
import { OrderBy } from '../../shared/page-order-by/orderby';
import Page from '../../shared/pagination/page';
import { CategoriaAtendimentoService } from '../../shared/services/categoria-atendimento.service';
import { MessageService } from '../../shared/services/message.service';
import { PacoteService } from '../../shared/services/pacote.service';
import Util from '../../shared/util/util';
import { UsuarioService } from '../../usuario/service/usuario.service';

@Component({
  selector: 'app-pacote-list',
  templateUrl: './pacote-list.component.html'
})
export class PacoteListComponent implements OnInit, OrderBy {

  public pacientes = new Array<Paciente>();
  public usuarios = new Array<Usuario>();
  public categoriasAtendimento = new Array<CategoriaAtendimento>();
  public filtro = new PageableFilter<PacoteFilter>();
  public dados = new Page<Array<Pacote>>();
  public currentUser = new Usuario();
  public permissaoAdministrador = PerfilEnum.administrador;
  public form: FormGroup;
  public showNoRecords = false;

  public constructor(
    private formBuilder: FormBuilder,
    private service: PacoteService,
    public messageService: MessageService,
    private pacienteService: PacienteService,
    private modalService: BsModalService,
    private categoriaAtendimentoService: CategoriaAtendimentoService,
    private usuarioService: UsuarioService,
    private sharedService: SharedService,
    public authGuardService: AuthGuard
  ) { }

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

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    const dataInicio = this.form.value.dataInicio;
    const dataFim = this.form.value.dataFim;
    if (dataInicio && !Util.isDataValida(dataInicio)) {
      this.messageService.sendMessageError(Messages.DATA_INICIO_INVALIDA);
      return;
    }
    if (dataFim && !Util.isDataValida(dataFim)) {
      this.messageService.sendMessageError(Messages.DATA_FIM_INVALIDA);
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
    this.messageService.clearAllMessages();
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

  public onClickOrderBy(descricao: string): void {
    this.messageService.clearAllMessages();
    this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
    this.filtro.orderBy = descricao;
    this.searchByFilter();
  }

}
