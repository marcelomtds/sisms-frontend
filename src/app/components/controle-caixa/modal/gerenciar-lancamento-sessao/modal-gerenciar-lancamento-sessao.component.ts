import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { PerfilEnum } from 'src/app/core/model/enum/perfil.enum';
import { LancamentoFilter } from 'src/app/core/model/filter/lancamento.filter';
import { Atendimento } from 'src/app/core/model/model/atendimento.model';
import { FormaPagamento } from 'src/app/core/model/model/forma-pagamento.model';
import { Lancamento } from 'src/app/core/model/model/lancamento.model';
import Page from 'src/app/core/model/model/page.model';
import { Usuario } from 'src/app/core/model/model/usuario.model';
import { AtendimentoService } from 'src/app/core/services/atendimento.service';
import { FormaPagamentoService } from 'src/app/core/services/forma-pagamento.service';
import { MessageService } from 'src/app/core/services/message.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { Pagination } from 'src/app/shared/components/pagination/pagination';
import { Messages } from 'src/app/shared/messages/messages';
import { ModalConfirmacaoComponent } from 'src/app/shared/modais/modal-confirmacao/modal-confirmacao.component';
import Util from 'src/app/shared/util/util';
import { LancamentoService } from '../../../../core/services/lancamento.service';

@Component({
  selector: 'app-modal-gerenciar-lancamento-sessao',
  templateUrl: './modal-gerenciar-lancamento-sessao.component.html'
})
export class ModalGerenciarLancamentoSessaoComponent extends Pagination<LancamentoFilter> implements OnInit {

  public dados = new Page<Array<Lancamento>>();
  public form: FormGroup;
  public atendimento = new Atendimento();
  public formasPagamento = new Array<FormaPagamento>();
  public isInvalidForm = false;
  public showNoRecords = false;
  public atendimentoId: number;
  public currentUser = new Usuario();

  public constructor(
    private bsModalRef: BsModalRef,
    private service: LancamentoService,
    private formBuilder: FormBuilder,
    private formaPagamentoService: FormaPagamentoService,
    private atendimentoService: AtendimentoService,
    private modalService: BsModalService,
    messageService: MessageService,
    private sharedService: SharedService
  ) {
    super(messageService);
  }

  public ngOnInit(): void {
    this.onCreateForm();
    this.searchByFilter();
    this.onLoadComboFormaPagamento();
    this.onLoadAtendimento();
    this.getCurrentUser();
  }

  private onLoadAtendimento(): void {
    this.atendimentoService.findById(this.atendimentoId).subscribe(response => {
      this.atendimento = response.result;
    });
  }

  private onLoadComboFormaPagamento(): void {
    this.formaPagamentoService.findAll().subscribe(response => {
      this.formasPagamento = response.result;
    });
  }

  public calcularTempo(dataInicio: any, dataFim: any): string {
    return Util.calcularTempoHorasMinutos(dataInicio, dataFim);
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      data: [null, Validators.required],
      valor: [0, Validators.required],
      observacao: [null],
      atendimentoId: [this.atendimentoId, Validators.required],
      formaPagamentoId: [null, Validators.required]
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
        data: Util.convertStringToDate(this.form.controls.data.value)
      };
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
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

  private getCurrentUser(): void {
    this.currentUser = this.sharedService.getUserSession();
  }

  public get isAdministrador(): boolean {
    return this.currentUser.perfilRole === PerfilEnum.ADMINISTRADOR;
  }

  private onUpdate(): void {
    this.onCreateForm();
    this.searchByFilter();
    this.onLoadAtendimento();
    this.service.setLancamento();
    this.showNoRecords = false;
    this.isInvalidForm = false;
  }

  public onClickEditar(id: number): void {
    this.messageService.clearAllMessages();
    this.service.findById(id).subscribe(response => {
      this.form.setValue({
        id: response.result.id,
        data: Util.convertDateToString(response.result.data),
        valor: response.result.valor,
        observacao: response.result.observacao || null,
        atendimentoId: response.result.atendimentoId,
        formaPagamentoId: response.result.formaPagamentoId
      });
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
        atendimentoId: this.atendimentoId
      }
    };
    this.service.findByFilter(this.filtro).subscribe(response => {
      this.showNoRecords = true;
      this.dados = response.result;
    });
  }

  public onClickCancelar(): void {
    this.messageService.clearAllMessages();
    this.showNoRecords = false;
    this.isInvalidForm = false;
    this.onCreateForm();
  }

  public onClickCloseModal(): void {
    this.bsModalRef.hide();
  }

}
