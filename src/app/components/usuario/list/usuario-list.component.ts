import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { AuthGuard } from '../../security/auth.guard';
import { SharedService } from '../../security/service/shared.service';
import { ModalConfirmacaoComponent } from '../../shared/modais/modal-confirmacao/modal-confirmacao.component';
import { ModalVisualizarPacienteUsuarioComponent } from '../../shared/modais/modal-visualizar-paciente-usuario/modal-visualizar-paciente-usuario.component';
import { PerfilEnum } from '../../shared/model/enum/perfil.enum';
import { SexoEnum } from '../../shared/model/enum/sexo.enum';
import { PageableFilter } from '../../shared/model/filter/filter.filter';
import { PacienteUsuarioFilter } from '../../shared/model/filter/paciente-usuario.filter';
import { Sexo } from '../../shared/model/model/sexo.model';
import { Usuario } from '../../shared/model/model/usuario.model';
import Page from '../../shared/pagination/pagination';
import { MessageService } from '../../shared/services/message.service';
import { SexoService } from '../../shared/services/sexo.service';
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html'
})
export class UsuarioListComponent implements OnInit {

  public sexos = new Array<Sexo>();
  public dados = new Page<Array<Usuario>>();
  public form: FormGroup;
  public filtro = new PageableFilter<PacienteUsuarioFilter>();
  public currentUser = new Usuario();
  public permissaoAdministrador = PerfilEnum.administrador;
  public showNoRecords = false;

  public constructor(
    private modalService: BsModalService,
    private service: UsuarioService,
    private sharedService: SharedService,
    private sexoService: SexoService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public authGuardService: AuthGuard
  ) {
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
      filter: {
        ...this.form.value
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

  public onClickOrderBy(descricao: string): void {
    this.messageService.clearAllMessages();
    this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
    this.filtro.orderBy = descricao;
    this.searchByFilter();
  }

}
