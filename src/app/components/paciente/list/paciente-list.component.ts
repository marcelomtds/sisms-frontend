import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { Pagination } from 'src/app/shared/components/pagination/pagination';
import { PageableFilter } from '../../../core/model/filter/filter.filter';
import { PacienteUsuarioFilter } from '../../../core/model/filter/paciente-usuario.filter';
import { Localidade } from '../../../core/model/model/localidade.model';
import { Paciente } from '../../../core/model/model/paciente.model';
import Page from '../../../core/model/model/page.model';
import { Sexo } from '../../../core/model/model/sexo.model';
import { UF } from '../../../core/model/model/uf.model';
import { LocalidadeService } from '../../../core/services/localidade.service';
import { MessageService } from '../../../core/services/message.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { SexoService } from '../../../core/services/sexo.service';
import { UfService } from '../../../core/services/uf.service';
import { Messages } from '../../../shared/messages/messages';
import { ModalConfirmacaoComponent } from '../../../shared/modais/modal-confirmacao/modal-confirmacao.component';
import { ModalVisualizarPacienteUsuarioComponent } from '../../../shared/modais/modal-visualizar-paciente-usuario/modal-visualizar-paciente-usuario.component';

@Component({
  selector: 'app-paciente-list',
  templateUrl: './paciente-list.component.html'
})
export class PacienteListComponent extends Pagination<PacienteUsuarioFilter> implements OnInit, OnDestroy {

  public sexos = new Array<Sexo>();
  public localidades = new Array<Localidade>();
  public ufs = new Array<UF>();
  public dados = new Page<Array<Paciente>>();
  public form: FormGroup;
  public subscription: Subscription;
  public showNoRecords = false;

  public constructor(
    private modalService: BsModalService,
    private service: PacienteService,
    private sexoService: SexoService,
    private localidadeService: LocalidadeService,
    private ufService: UfService,
    private formBuilder: FormBuilder,
    messageService: MessageService
  ) {
    super(messageService);
    this.subscription = this.ufService.getUF().subscribe(() => {
      this.onLoadComboUF();
    });
    this.subscription = this.localidadeService.getLocalidade().subscribe(() => {
      this.onChangeUf();
    });
  }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onLoadCombos(): void {
    this.onLoadSexo();
    this.onLoadComboUF();
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      cpf: [null],
      nomeCompleto: [null],
      sexoId: [null],
      localidadeId: [null],
      ufId: [null],
      celular: [null],
      celularRecado: [null],
      residencial: [null],
      comercial: [null],
      ativo: [null],
    });
  }

  private onLoadSexo(): void {
    this.sexoService.findAll().subscribe(response => {
      this.sexos = response.result;
    });
  }

  private onLoadComboUF(): void {
    this.ufService.findAll().subscribe(response => {
      this.ufs = response.result;
    });
  }

  public onClickLocalidade(): void {
    this.messageService.clearAllMessages();
    if (!this.form.controls.ufId.value) {
      this.messageService.sendMessageWarning(Messages.MSG0010);
    }
  }

  public onChangeUf(isclearAllMessages?: boolean): void {
    if (isclearAllMessages) {
      this.messageService.clearAllMessages();
    }
    const id = this.form.controls.ufId.value;
    if (id) {
      this.localidadeService.findByUfId(id).subscribe(response => {
        this.localidades = response.result;
        if (this.form.value.localidadeId && !this.localidades.find(x => x.id === this.form.value.localidadeId)) {
          this.form.controls.localidadeId.setValue(null);
        }
      });
    } else {
      this.localidades = new Array<Localidade>();
      this.form.controls.localidadeId.setValue(null);
    }
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
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
    this.messageService.clearAllMessages();
    this.onCreateForm();
    this.dados = new Page<Array<Paciente>>();
    this.filtro = new PageableFilter<PacienteUsuarioFilter>();
    this.showNoRecords = false;
  }

  public onClickUpdateStatus(paciente: Paciente): void {
    this.messageService.clearAllMessages();
    const modalRef = this.modalService.show(ModalConfirmacaoComponent, { backdrop: 'static' });
    const status = paciente.ativo ? 'desativar' : 'ativar';
    const sexo = paciente.sexoId === 1 ? 'o' : 'a';
    modalRef.content.titulo = 'Confirmação de Alteração de Status';
    modalRef.content.corpo = `Deseja ${status} ${sexo} paciente ${paciente.nomeCompleto}?`;
    modalRef.content.onClose.subscribe(result => {
      if (result) {
        this.service.activeOrInative(paciente.id).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.searchByFilter();
        });
      }
    });
  }

  public onClickOpenModalVisualizar(paciente: Paciente): void {
    this.messageService.clearAllMessages();
    const initialState = {
      dados: paciente
    };
    this.modalService.show(ModalVisualizarPacienteUsuarioComponent, { initialState, backdrop: 'static', class: 'gray modal-lg' });
  }

}
