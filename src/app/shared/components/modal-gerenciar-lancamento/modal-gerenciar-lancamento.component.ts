import { formatCurrency } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { FormaPagamentoEnum } from "src/app/core/model/enum/forma-pagamento.enum";
import { OpcaoUtilizacaoCreditoEnum } from "src/app/core/model/enum/opcao-utilizacao-credito.enum";
import { PerfilEnum } from "src/app/core/model/enum/perfil.enum";
import { TipoAtendimentoEnum } from "src/app/core/model/enum/tipo-atendimento.enum";
import { TipoLancamentoEnum } from "src/app/core/model/enum/tipo-lancamento.enum";
import { LancamentoFilter } from "src/app/core/model/filter/lancamento.filter";
import { FormaPagamento } from "src/app/core/model/model/forma-pagamento.model";
import { Lancamento } from "src/app/core/model/model/lancamento.model";
import Page from "src/app/core/model/model/page.model";
import { Usuario } from "src/app/core/model/model/usuario.model";
import { AtendimentoService } from "src/app/core/services/atendimento.service";
import { FormaPagamentoService } from "src/app/core/services/forma-pagamento.service";
import { LancamentoService } from "src/app/core/services/lancamento.service";
import { MessageService } from "src/app/core/services/message.service";
import { PacoteService } from "src/app/core/services/pacote.service";
import { SharedService } from "src/app/core/services/shared.service";
import { Messages } from "../../messages/messages";
import { ModalConfirmacaoComponent } from "../../modais/modal-confirmacao/modal-confirmacao.component";
import Util from "../../util/util";
import { Pagination } from "../pagination/pagination";

@Component({
    selector: 'app-modal-gerenciar-lancamento',
    templateUrl: './modal-gerenciar-lancamento.component.html'
})
export class ModalGerenciarLancamentoComponent extends Pagination<LancamentoFilter>  {

    readonly OPCAO_UTILIZACAO_CREDITO_TOTAL = OpcaoUtilizacaoCreditoEnum.TOTAL;
    readonly OPCAO_UTILIZACAO_CREDITO_PARCIAL = OpcaoUtilizacaoCreditoEnum.PARCIAL;

    dadosGrid = new Page<Array<Lancamento>>();
    form: FormGroup;
    formasPagamento = new Array<FormaPagamento>();
    isInvalidForm = false;
    showNoRecords = false;
    valorSelecionado = 0;
    saldo = 0;
    currentUser = new Usuario();
    valorParcial = 0;
    opcaoUtilizacaoCredito = OpcaoUtilizacaoCreditoEnum.TOTAL;
    dados: any;

    constructor(
        private bsModalRef: BsModalRef,
        private service: LancamentoService,
        private sharedService: SharedService,
        private formaPagamentoService: FormaPagamentoService,
        private pacoteService: PacoteService,
        private atendimentoService: AtendimentoService,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        messageService: MessageService,

    ) {
        super(messageService);
    }

    ngOnInit(): void {
        this.onCreateForm();
        this.searchByFilter();
        this.onLoadComboFormaPagamento();
        this.getCurrentUser();
        this.initOrderBy();
    }

    get isAdministrador(): boolean {
        return this.currentUser.perfilRole === PerfilEnum.ADMINISTRADOR;
    }

    get isPacote(): boolean {
        return !this.isAtendimento;
    }

    get isAtendimento(): boolean {
        return this.dados.tipoAtendimentoId === TipoAtendimentoEnum.SESSAO;
    }

    onClickFormSubmit(): void {
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


    onClickExcluir(id: number): void {
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

    getCreditLabel(): string {
        return `O paciente possui um crédito/saldo no valor de ${formatCurrency(this.saldo, 'pt-BR', 'R$')}. Utilizar:`;
    }

    onClickUseCredit(): void {
        this.messageService.clearAllMessages();
        if (this.opcaoUtilizacaoCredito === this.OPCAO_UTILIZACAO_CREDITO_PARCIAL && !this.valorParcial) {
            this.messageService.sendMessageError(Messages.MSG0085);
        } else if (this.opcaoUtilizacaoCredito === this.OPCAO_UTILIZACAO_CREDITO_PARCIAL && this.valorParcial > this.saldo) {
            this.messageService.sendMessageError(Messages.MSG0084);
        } else {
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

    }

    showEditButton(lancamento: Lancamento): boolean {
        return this.form.controls.id.value !== lancamento.id;
    }

    getDataAtual(): void {
        this.messageService.clearAllMessages();
        if (!this.form.controls.data.value) {
            this.form.controls.data.setValue(new Date().toLocaleDateString());
        }
    }

    onClickCancelar(): void {
        this.messageService.clearAllMessages();
        this.onLoadComboFormaPagamento();
        this.resetarCampos();
    }

    onClickCloseModal(): void {
        this.bsModalRef.hide();
    }

    onClickEditar(lancamento: Lancamento): void {
        this.messageService.clearAllMessages();
        this.resetarCampos();
        this.valorSelecionado = lancamento.valor;
        this.service.findById(lancamento.id).subscribe(response => {
            this.form.setValue({
                id: response.result.id,
                data: Util.convertDateToString(response.result.data),
                valor: response.result.valor,
                observacao: response.result.observacao || null,
                pacoteId: response.result.pacoteId || null,
                atendimentoId: response.result.atendimentoId || null,
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

    searchByFilter(): void {
        this.filtro = {
            ...this.filtro,
            filter: {
                pacoteId: this.isPacote ? this.dados.id : null,
                atendimentoId: this.isAtendimento ? this.dados.id : null
            }
        };
        this.service.findByFilter(this.filtro).subscribe(response => {
            this.showNoRecords = true;
            this.dadosGrid = response.result;
            this.findPatientBalance();
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

    private findPatientBalance(): void {
        this.service.findPatientBalance(this.dados.pacienteId).subscribe(response => {
            this.saldo = response.result;
        });
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

    private initOrderBy(): void {
        this.filtro.orderBy = 'data';
        this.filtro.direction = 'ASC';
    }

    private getCurrentUser(): void {
        this.currentUser = this.sharedService.getUserSession();
    }

    private onUpdate(): void {
        this.searchByFilter();
        this.findById();
        this.service.setLancamento();
        this.resetarCampos();
        this.onLoadComboFormaPagamento();
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

    private onCreateForm(): void {
        this.form = this.formBuilder.group({
            id: [null],
            data: [null, Validators.required],
            valor: [0, Validators.required],
            observacao: [null],
            pacoteId: [this.isPacote ? this.dados.id : null],
            atendimentoId: [this.isAtendimento ? this.dados.id : null],
            formaPagamentoId: [null, Validators.required],
            tipoLancamentoId: [TipoLancamentoEnum.ENTRADA, Validators.required],
            pacienteId: [this.dados.pacienteId, Validators.required],
            tipoAtendimentoId: [this.isPacote ? TipoAtendimentoEnum.PACOTE : TipoAtendimentoEnum.SESSAO, Validators.required]
        });
        if (this.isPacote) {
            this.form.controls.pacoteId.setValidators(Validators.required);
            this.form.controls.pacoteId.updateValueAndValidity();
        } else {
            this.form.controls.atendimentoId.setValidators(Validators.required);
            this.form.controls.atendimentoId.updateValueAndValidity();
        }
    }

    private findById(): void {
        if (this.isPacote) {
            this.pacoteService.findById(this.dados.id).subscribe(response => {
                this.dados = response.result;
            });
        } else {
            this.atendimentoService.findById(this.dados.id).subscribe(response => {
                this.dados = response.result;
            });
        }
    }
}
