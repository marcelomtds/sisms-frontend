import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AtendimentoService } from 'src/app/components/shared/services/atendimento.service';
import { SharedService } from 'src/app/components/security/service/shared.service';
import { Messages } from 'src/app/components/shared/message/messages';
import { ModalConfirmacaoComponent } from 'src/app/components/shared/modais/modal-confirmacao/modal-confirmacao.component';
import { PerfilEnum } from 'src/app/components/shared/model/enum/perfil.enum';
import { PageableFilter } from 'src/app/components/shared/model/filter/filter.filter';
import { LancamentoFilter } from 'src/app/components/shared/model/filter/lancamento.filter';
import { Atendimento } from 'src/app/components/shared/model/model/atendimento.model';
import { FormaPagamento } from 'src/app/components/shared/model/model/forma-pagamento.model';
import { Lancamento } from 'src/app/components/shared/model/model/lancamento.model';
import { Usuario } from 'src/app/components/shared/model/model/usuario.model';
import { IActionOrderBy } from 'src/app/components/shared/page-order-by/iaction-orderby';
import Page from 'src/app/components/shared/pagination/page';
import { FormaPagamentoService } from 'src/app/components/shared/services/forma-pagamento.service';
import { MessageService } from 'src/app/components/shared/services/message.service';
import Util from 'src/app/components/shared/util/util';
import { LancamentoService } from '../../../shared/services/lancamento.service';

@Component({
  selector: 'app-modal-gerenciar-lancamento-sessao',
  templateUrl: './modal-gerenciar-lancamento-sessao.component.html'
})
export class ModalGerenciarLancamentoSessaoComponent implements OnInit, IActionOrderBy {

  public dados = new Page<Array<Lancamento>>();
  public form: FormGroup;
  public atendimento = new Atendimento();
  public formasPagamento = new Array<FormaPagamento>();
  public filtro = new PageableFilter<LancamentoFilter>();
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
    private messageService: MessageService,
    private sharedService: SharedService
  ) { }

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
        this.messageService.sendMessageError(Messages.DATA_INVALIDA);
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
    return this.currentUser.perfilRole === PerfilEnum.Administrador;
  }

  private onUpdate(): void {
    this.onCreateForm();
    this.searchByFilter();
    this.onLoadAtendimento();
    this.service.setLancamento();
    this.showNoRecords = false;
    this.isInvalidForm = false;
  }

  public onClickEditar(lancamento: Lancamento): void {
    this.messageService.clearAllMessages();
    this.form.setValue({
      id: lancamento.id,
      data: Util.convertDateToString(lancamento.data),
      valor: lancamento.valor,
      observacao: lancamento.observacao || null,
      atendimentoId: lancamento.atendimentoId,
      formaPagamentoId: lancamento.formaPagamentoId
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
