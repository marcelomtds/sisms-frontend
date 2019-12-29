import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Messages } from 'src/app/components/shared/message/messages';
import { PageableFilter } from 'src/app/components/shared/model/filter/filter.filter';
import { LancamentoFilter } from 'src/app/components/shared/model/filter/lancamento.filter';
import { FormaPagamento } from 'src/app/components/shared/model/model/forma-pagamento.model';
import { Lancamento } from 'src/app/components/shared/model/model/lancamento.model';
import { IActionOrderBy } from 'src/app/components/shared/page-order-by/iaction-orderby';
import Page from 'src/app/components/shared/pagination/page';
import { FormaPagamentoService } from 'src/app/components/shared/services/forma-pagamento.service';
import { MessageService } from 'src/app/components/shared/services/message.service';
import Util from 'src/app/components/shared/util/util';
import { LancamentoService } from '../../../service/lancamento.service';

@Component({
  selector: 'app-modal-gerenciar-lancamento-sessao',
  templateUrl: './modal-gerenciar-lancamento-sessao.component.html'
})
export class ModalGerenciarLancamentoSessaoComponent implements OnInit, IActionOrderBy {

  public dados = new Page<Array<Lancamento>>();
  public form: FormGroup;
  public formasPagamento = new Array<FormaPagamento>();
  public filtro = new PageableFilter<LancamentoFilter>();
  public isInvalidForm = false;
  public showNoRecords = false;
  public atendimentoId: number;

  public constructor(
    private bsModalRef: BsModalRef,
    private service: LancamentoService,
    private formBuilder: FormBuilder,
    private formaPagamentoService: FormaPagamentoService,
    private messageService: MessageService
  ) { }

  public ngOnInit(): void {
    this.onCreateForm();
    this.searchByFilter();
    this.onLoadComboFormaPagamento();
  }

  private onLoadComboFormaPagamento(): void {
    this.formaPagamentoService.findAll().subscribe(response => {
      this.formasPagamento = response.result;
    });
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

  private onUpdate(): void {
    this.onCreateForm();
    this.searchByFilter();
    this.showNoRecords = false;
    this.isInvalidForm = false;
  }

  public onClickEditar(lancamento: Lancamento): void {
    this.messageService.clearAllMessages();
    this.form.patchValue(lancamento);
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
