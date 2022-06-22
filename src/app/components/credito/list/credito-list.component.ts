import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { PerfilEnum } from 'src/app/core/model/enum/perfil.enum';
import { TipoAtendimentoEnum } from 'src/app/core/model/enum/tipo-atendimento.enum';
import { TipoLancamentoEnum } from 'src/app/core/model/enum/tipo-lancamento.enum';
import { Lancamento } from 'src/app/core/model/model/lancamento.model';
import { Paciente } from 'src/app/core/model/model/paciente.model';
import { Usuario } from 'src/app/core/model/model/usuario.model';
import { AtendimentoService } from 'src/app/core/services/atendimento.service';
import { LancamentoService } from 'src/app/core/services/lancamento.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { PacoteService } from 'src/app/core/services/pacote.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { Messages } from 'src/app/shared/messages/messages';
import { ModalConfirmacaoComponent } from 'src/app/shared/modais/modal-confirmacao/modal-confirmacao.component';
import Util from 'src/app/shared/util/util';
import { ModalGerenciarLancamentoComponent } from 'src/app/shared/components/modal-gerenciar-lancamento/modal-gerenciar-lancamento.component';

@Component({
  selector: 'app-credito-list',
  templateUrl: './credito-list.component.html'
})
export class CreditoListComponent implements OnInit {

  public currentUser = new Usuario();
  public dados = new Array<Lancamento>();
  public pacientes = new Array<Paciente>();
  public showNoRecords = false;
  public form: FormGroup;
  public subscription: Subscription;
  isInvalidForm = false;
  saldo = 0;

  constructor(
    private service: LancamentoService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private pacienteService: PacienteService,
    private messageService: MessageService,
    private atendimentoService: AtendimentoService,
    private pacoteService: PacoteService,
    private modalService: BsModalService,
    private router: Router
  ) {
    this.subscription = this.service.getLancamento().subscribe(() => {
      if (this.form.controls.pacienteId.value) {
        this.onLoadExtract();
      }
    });
  }

  ngOnInit() {
    this.getCurrentUser();
    this.onCreateForm();
    this.onLoadPacientes();
  }

  private onLoadPacientes(): void {
    this.pacienteService.findAll().subscribe(response => {
      this.pacientes = response.result;
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      pacienteId: [null, Validators.required]
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    const dataInicio = this.form.value.dataInicio;
    const dataFim = this.form.value.dataFim;
    if (this.form.valid) {
      if (dataInicio && !Util.isDataValida(dataInicio)) {
        this.messageService.sendMessageError(Messages.MSG0013);
        return;
      }
      if (dataFim && !Util.isDataValida(dataFim)) {
        this.messageService.sendMessageError(Messages.MSG0014);
        return;
      }
      this.onLoadExtract();
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

  private onLoadExtract(): void {
    this.service.findExtractByPatient(this.form.controls.pacienteId.value).subscribe(response => {
      this.dados = response.result;
      this.dados.forEach(it => { it.valor = it.tipoLancamentoId === TipoLancamentoEnum.UTILIZACAO_CREDITO ? it.valor * -1 : it.valor });
      this.service.findPatientBalance(this.form.controls.pacienteId.value).subscribe(response => {
        this.saldo = response.result;
      });
      this.showNoRecords = true;
    });
  }

  showDeleteButton(lancamento: Lancamento): boolean {
    return lancamento.tipoLancamentoId === TipoLancamentoEnum.ENTRADA_CREDITO;
  }

  private getCurrentUser(): void {
    this.currentUser = this.sharedService.getUserSession();
  }

  public get isAdministrador(): boolean {
    return this.currentUser.perfilRole === PerfilEnum.ADMINISTRADOR;
  }

  getRowStyle(lancamento: Lancamento): any {
    return { color: lancamento.tipoLancamentoId === TipoLancamentoEnum.ENTRADA_CREDITO ? 'green' : 'red' }
  }

  onClickLimparCampos(): void {
    this.messageService.clearAllMessages();
    this.dados = new Array<Lancamento>();
    this.showNoRecords = false;
    this.onCreateForm();
    this.isInvalidForm = false;
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
          this.onLoadExtract();
        });
      }
    });
  }

  public async onClickEdit(lancamento: Lancamento): Promise<void> {
    this.messageService.clearAllMessages();
    let initialState;
    if (lancamento.tipoLancamentoId === TipoLancamentoEnum.UTILIZACAO_CREDITO && lancamento.tipoAtendimentoId === TipoAtendimentoEnum.SESSAO) {
      initialState = {
        dados: (await this.atendimentoService.findById(lancamento.atendimentoId).toPromise()).result
      };
      this.modalService.show(ModalGerenciarLancamentoComponent, { initialState, class: 'gray modal-lg', backdrop: 'static' });
    } else if (lancamento.tipoLancamentoId === TipoLancamentoEnum.UTILIZACAO_CREDITO && lancamento.tipoAtendimentoId === TipoAtendimentoEnum.PACOTE) {
      initialState = {
        dados: (await this.pacoteService.findById(lancamento.pacoteId).toPromise()).result
      };
      this.modalService.show(ModalGerenciarLancamentoComponent, { initialState, class: 'gray modal-lg', backdrop: 'static' });
    } else if (lancamento.tipoLancamentoId === TipoLancamentoEnum.ENTRADA_CREDITO) {
      this.router.navigate([`/credito/alterar/${lancamento.id}`]);
    }
  }
}
