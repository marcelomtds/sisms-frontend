import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/shared/components/pagination/pagination';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PerfilEnum } from '../../../core/model/enum/perfil.enum';
import { SexoEnum } from '../../../core/model/enum/sexo.enum';
import { PageableFilter } from '../../../core/model/filter/filter.filter';
import { PacienteUsuarioFilter } from '../../../core/model/filter/paciente-usuario.filter';
import Page from '../../../core/model/model/page.model';
import { Sexo } from '../../../core/model/model/sexo.model';
import { Usuario } from '../../../core/model/model/usuario.model';
import { MessageService } from '../../../core/services/message.service';
import { SexoService } from '../../../core/services/sexo.service';
import { SharedService } from '../../../core/services/shared.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ModalConfirmacaoComponent } from '../../../shared/modais/modal-confirmacao/modal-confirmacao.component';
import { ModalVisualizarPacienteUsuarioComponent } from '../../../shared/modais/modal-visualizar-paciente-usuario/modal-visualizar-paciente-usuario.component';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html'
})
export class UsuarioListComponent extends Pagination<PacienteUsuarioFilter> implements OnInit {

  public sexos = new Array<Sexo>();
  public dados = new Page<Array<Usuario>>();
  public form: FormGroup;
  public currentUser = new Usuario();
  public permissaoAdministrador = PerfilEnum.ADMINISTRADOR;
  public showNoRecords = false;

  public constructor(
    private modalService: BsModalService,
    private service: UsuarioService,
    private sharedService: SharedService,
    private sexoService: SexoService,
    private formBuilder: FormBuilder,
    messageService: MessageService,
    public authGuardService: AuthGuard
  ) {
    super(messageService);
  }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
    this.getUserSession();
  }

  private getUserSession(): void {
    this.currentUser = this.sharedService.getUserSession();
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      cpf: [null],
      nomeCompleto: [null],
      sexoId: [null],
      ativo: [null],
    });
  }

  private onLoadCombos(): void {
    this.sexoService.findAll().subscribe(response => {
      this.sexos = response.result;
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    this.filtro = new PageableFilter<PacienteUsuarioFilter>();
    this.filtro = {
      ...this.filtro,
      orderBy: 'nomeCompleto',
      direction: 'ASC',
      filter: {
        ...this.form.value
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
    this.onCreateForm();
    this.dados = new Page<Array<Usuario>>();
    this.filtro = new PageableFilter<PacienteUsuarioFilter>();
    this.showNoRecords = false;
  }

  public onClickUpdateStatus(usuario: Usuario): void {
    this.messageService.clearAllMessages();
    const modalRef = this.modalService.show(ModalConfirmacaoComponent, { backdrop: 'static' });
    const status = usuario.ativo ? 'desativar' : 'ativar';
    const sexo = usuario.sexoId === SexoEnum.MASCULINO ? 'o' : 'a';
    modalRef.content.titulo = 'Confirmação de Ativação/Inativação de Usuário';
    modalRef.content.corpo = `Deseja ${status} ${sexo} usuári${sexo} ${usuario.nomeCompleto}?`;
    modalRef.content.onClose.subscribe(result => {
      if (result) {
        this.service.activeOrInative(usuario.id).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.searchByFilter();
        });
      }
    });
  }

  public async  onClickOpenModalVisualizar(id: number): Promise<void> {
    this.messageService.clearAllMessages();
    const initialState = {
      dados: (await this.service.findById(id).toPromise()).result
    };
    this.modalService.show(ModalVisualizarPacienteUsuarioComponent, { initialState, backdrop: 'static', class: 'gray modal-lg' });
  }

}
