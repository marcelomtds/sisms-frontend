import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormaPagamentoEnum } from 'src/app/core/model/enum/forma-pagamento.enum';
import { OpcaoUtilizacaoCreditoEnum } from 'src/app/core/model/enum/opcao-utilizacao-credito.enum';
import { PerfilEnum } from 'src/app/core/model/enum/perfil.enum';
import { SexoEnum } from 'src/app/core/model/enum/sexo.enum';
import { TipoAtendimentoEnum } from 'src/app/core/model/enum/tipo-atendimento.enum';
import { TipoLancamentoEnum } from 'src/app/core/model/enum/tipo-lancamento.enum';
import { LancamentoFilter } from 'src/app/core/model/filter/lancamento.filter';
import { FormaPagamento } from 'src/app/core/model/model/forma-pagamento.model';
import { Lancamento } from 'src/app/core/model/model/lancamento.model';
import { Pacote } from 'src/app/core/model/model/pacote.model';
import Page from 'src/app/core/model/model/page.model';
import { Usuario } from 'src/app/core/model/model/usuario.model';
import { FormaPagamentoService } from 'src/app/core/services/forma-pagamento.service';
import { LancamentoService } from 'src/app/core/services/lancamento.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PacoteService } from 'src/app/core/services/pacote.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { Pagination } from 'src/app/shared/components/pagination/pagination';
import { Messages } from 'src/app/shared/messages/messages';
import { ModalConfirmacaoComponent } from 'src/app/shared/modais/modal-confirmacao/modal-confirmacao.component';
import Util from 'src/app/shared/util/util';

@Component({
  selector: 'app-modal-gerenciar-lancamento-pacote',
  templateUrl: './modal-gerenciar-lancamento-pacote.component.html'
})
export class ModalGerenciarLancamentoPacoteComponent extends Pagination<LancamentoFilter> implements OnInit {

  readonly OPCAO_UTILIZACAO_CREDITO_TOTAL = OpcaoUtilizacaoCreditoEnum.TOTAL;
  readonly OPCAO_UTILIZACAO_CREDITO_PARCIAL = OpcaoUtilizacaoCreditoEnum.PARCIAL;

  public dados = new Page<Array<Lancamento>>();
  public form: FormGroup;
  public pacote = new Pacote();
  public formasPagamento = new Array<FormaPagamento>();
  public isInvalidForm = false;
  public showNoRecords = false;
  public valorSelecionado = 0;
  public saldo = 0;
  public currentUser = new Usuario();
  valorParcial = 0;
  opcaoUtilizacaoCredito = OpcaoUtilizacaoCreditoEnum.TOTAL;


  public constructor(
    private bsModalRef: BsModalRef,
    private service: LancamentoService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private formaPagamentoService: FormaPagamentoService,
    private pacoteService: PacoteService,
    private modalService: BsModalService,
    messageService: MessageService
  ) {
    super(messageService);
  }

  public ngOnInit(): void {
    this.onCreateForm();
    this.searchByFilter();
    this.onLoadComboFormaPagamento();
    this.getCurrentUser();
    this.initOrderBy();
  }

  private initOrderBy(): void {
    this.filtro.orderBy = 'data';
    this.filtro.direction = 'ASC';
  }

  private getCurrentUser(): void {
    this.currentUser = this.sharedService.getUserSession();
  }

  public get isAdministrador(): boolean {
    return this.currentUser.perfilRole === PerfilEnum.ADMINISTRADOR;
  }

  private findPatientBalance(): void {
    this.service.findPatientBalance(this.pacote.pacienteId).subscribe(response => {
      this.saldo = response.result;
    });
  }

  private onLoadComboFormaPagamento(): void {
    if (this.form.controls.tipoLancamentoId.value === TipoLancamentoEnum.UTILIZACAO_CREDITO) {
      this.formaPagamentoService.findAll().subscribe(response => {
        this.formasPagamento = response.result;
      });
    } else {
      this.formaPagamentoService.findAllIgnoringIds([FormaPagamentoEnum.UTILIZACAO_CREDITO]).subscribe(response => {
        this.formasPagamento = response.result;
      });
    }
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      data: [null, Validators.required],
      valor: [0, Validators.required],
      observacao: [null],
      pacoteId: [this.pacote.id, Validators.required],
      formaPagamentoId: [null, Validators.required],
      tipoLancamentoId: [TipoLancamentoEnum.ENTRADA, Validators.required],
      pacienteId: [this.pacote.pacienteId, Validators.required],
      tipoAtendimentoId: [TipoAtendimentoEnum.PACOTE, Validators.required]
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      if (!Util.isDataValida(this.form.controls.data.value)) {
        this.messageService.sendMessageError(Messages.MSG0015);
        return;
      }
      const formValue: Lancamento = {
        ...this.form.value,
        data: Util.convertStringToDate(this.form.controls.data.value),
        valor: this.form.controls.valor.value,
        formaPagamentoId: this.form.controls.formaPagamentoId.value
      };
      this.createOrUpdate(formValue);
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

  private createOrUpdate(formValue: Lancamento): void {
    if (formValue.id) {
      this.service.update(formValue.id, formValue).subscribe(response => {
        this.messageService.sendMessageSuccess(response.message);
        this.onUpdate();
      });
    } else {
      this.service.create(formValue).subscribe(response => {
        this.messageService.sendMessageSuccess(response.message);
        this.onUpdate();
      });
    }
  }

  private onUpdate(): void {
    this.searchByFilter();
    this.findById();
    this.service.setLancamento();
    this.resetarCampos();
    this.onLoadComboFormaPagamento();
  }

  private resetarCampos(): void {
    this.showNoRecords = false;
    this.isInvalidForm = false;
    this.valorSelecionado = 0;
    this.form.controls.valor.enable();
    this.form.controls.valor.updateValueAndValidity();
    this.form.controls.formaPagamentoId.enable();
    this.form.controls.formaPagamentoId.updateValueAndValidity();
    this.valorParcial = 0;
    this.opcaoUtilizacaoCredito = this.OPCAO_UTILIZACAO_CREDITO_TOTAL;
    this.onCreateForm();
  }

  public onClickEditar(lancamento: Lancamento): void {
    this.messageService.clearAllMessages();
    this.resetarCampos();
    this.valorSelecionado = lancamento.valor;
    this.service.findById(lancamento.id).subscribe(response => {
      this.form.setValue({
        id: response.result.id,
        data: Util.convertDateToString(response.result.data),
        valor: response.result.valor,
        observacao: response.result.observacao || null,
        pacoteId: response.result.pacoteId,
        formaPagamentoId: response.result.formaPagamentoId,
        tipoLancamentoId: response.result.tipoLancamentoId,
        pacienteId: response.result.pacienteId,
        tipoAtendimentoId: response.result.tipoAtendimentoId
      });
      if (this.form.controls.tipoLancamentoId.value === TipoLancamentoEnum.UTILIZACAO_CREDITO) {
        this.form.controls.formaPagamentoId.disable();
        this.form.controls.formaPagamentoId.updateValueAndValidity();
      }
      this.onLoadComboFormaPagamento();
    });
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
          this.onUpdate();
        });
      }
    });
  }

  public getCreditLabel(): string {
    const sexo = this.pacote.pacienteSexoId === SexoEnum.MASCULINO ? 'O' : 'A';
    return `${sexo} paciente ${this.pacote.pacienteNomeCompleto} possui um crédito/saldo no valor de ${formatCurrency(this.saldo, 'pt-BR', 'R$')}. Utilizar:`;
  }

  onClickUseCredit(): void {
    this.messageService.clearAllMessages();
    if (this.opcaoUtilizacaoCredito === this.OPCAO_UTILIZACAO_CREDITO_PARCIAL && !this.valorParcial) {
      this.messageService.sendMessageError(Messages.MSG0085);
      return;
    }
    if (this.valorParcial > this.saldo) {
      this.messageService.sendMessageError(Messages.MSG0084);
      return;
    }
    if (this.opcaoUtilizacaoCredito === this.OPCAO_UTILIZACAO_CREDITO_TOTAL) {
      this.form.controls.valor.setValue(this.saldo);
    } else {
      this.form.controls.valor.setValue(this.valorParcial);
    }
    this.form.controls.valor.disable();
    this.form.controls.valor.updateValueAndValidity();
    this.form.controls.formaPagamentoId.setValue(FormaPagamentoEnum.UTILIZACAO_CREDITO);
    this.form.controls.formaPagamentoId.disable();
    this.form.controls.formaPagamentoId.updateValueAndValidity();
    this.form.controls.tipoLancamentoId.setValue(TipoLancamentoEnum.UTILIZACAO_CREDITO);
    this.onLoadComboFormaPagamento();
  }

  showEditButton(lancamento: Lancamento): boolean {
    return this.form.controls.id.value !== lancamento.id;
  }

  public getDataAtual(): void {
    this.messageService.clearAllMessages();
    if (!this.form.controls.data.value) {
      this.form.controls.data.setValue(new Date().toLocaleDateString());
    }
  }

  public searchByFilter(): void {
    this.filtro = {
      ...this.filtro,
      filter: {
        pacoteId: this.pacote.id
      }
    };
    this.service.findByFilter(this.filtro).subscribe(response => {
      this.showNoRecords = true;
      this.dados = response.result;
      this.findPatientBalance();
    });
  }

  private findById(): void {
    this.pacoteService.findById(this.pacote.id).subscribe(response => {
      this.pacote = response.result;
    });
  }

  public onClickCancelar(): void {
    this.messageService.clearAllMessages();
    this.onLoadComboFormaPagamento();
    this.resetarCampos();
  }

  public onClickCloseModal(): void {
    this.bsModalRef.hide();
  }

}
