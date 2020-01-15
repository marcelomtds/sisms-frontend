import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SharedService } from 'src/app/components/shared/services/shared.service';
import { Messages } from 'src/app/components/shared/message/messages';
import { ModalConfirmacaoComponent } from 'src/app/components/shared/modais/modal-confirmacao/modal-confirmacao.component';
import { PerfilEnum } from 'src/app/components/shared/model/enum/perfil.enum';
import { PageableFilter } from 'src/app/components/shared/pageable/filter.filter';
import { LancamentoFilter } from 'src/app/components/shared/model/filter/lancamento.filter';
import { FormaPagamento } from 'src/app/components/shared/model/model/forma-pagamento.model';
import { Lancamento } from 'src/app/components/shared/model/model/lancamento.model';
import { Pacote } from 'src/app/components/shared/model/model/pacote.model';
import { Usuario } from 'src/app/components/shared/model/model/usuario.model';
import Page from 'src/app/components/shared/pageable/page';
import { FormaPagamentoService } from 'src/app/components/shared/services/forma-pagamento.service';
import { LancamentoService } from 'src/app/components/shared/services/lancamento.service';
import { MessageService } from 'src/app/components/shared/services/message.service';
import { PacoteService } from 'src/app/components/shared/services/pacote.service';
import Util from 'src/app/components/shared/util/util';
import { IActionOrderBy } from 'src/app/components/shared/page-order-by/iaction-orderby';

@Component({
  selector: 'app-modal-gerenciar-lancamento-pacote',
  templateUrl: './modal-gerenciar-lancamento-pacote.component.html'
})
export class ModalGerenciarLancamentoPacoteComponent implements OnInit, IActionOrderBy {

  public dados = new Page<Array<Lancamento>>();
  public form: FormGroup;
  public pacote = new Pacote();
  public formasPagamento = new Array<FormaPagamento>();
  public filtro = new PageableFilter<LancamentoFilter>();
  public isInvalidForm = false;
  public showNoRecords = false;
  public pacoteId: number;
  public valorSelecionado = 0;
  public currentUser = new Usuario();

  public constructor(
    private bsModalRef: BsModalRef,
    private service: LancamentoService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private formaPagamentoService: FormaPagamentoService,
    private pacoteService: PacoteService,
    private modalService: BsModalService,
    private messageService: MessageService
  ) { }

  public ngOnInit(): void {
    this.onCreateForm();
    this.searchByFilter();
    this.onLoadComboFormaPagamento();
    this.onLoadPacote();
    this.getCurrentUser();
  }

  private onLoadPacote(): void {
    this.pacoteService.findById(this.pacoteId).subscribe(response => {
      this.pacote = response.result;
    });
  }

  private getCurrentUser(): void {
    this.currentUser = this.sharedService.getUserSession();
  }

  public get isAdministrador(): boolean {
    return this.currentUser.perfilRole === PerfilEnum.ADMINISTRADOR;
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
      pacoteId: [this.pacoteId, Validators.required],
      formaPagamentoId: [null, Validators.required]
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      if (!Util.isDataValida(this.form.controls.data.value)) {
        this.messageService.sendMessageError(Messages.MSG00015);
        return;
      }
      const formValue: Lancamento = {
        ...this.form.value,
        data: Util.convertStringToDate(this.form.controls.data.value)
      };
      const valor = this.form.controls.valor.value + this.pacote.totalPago - (this.form.controls.id.value ? this.valorSelecionado : 0);
      if (valor > this.pacote.valor) {
        this.openModalConfirmacaoValorExcedido(formValue);
      } else {
        this.createOrUpdate(formValue);
      }
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

  private openModalConfirmacaoValorExcedido(obj: any): void {
    const bsModalRefConfirmacaoValorExcedido = this.modalService.show(ModalConfirmacaoComponent, { backdrop: 'static' });
    bsModalRefConfirmacaoValorExcedido.content.titulo = `Confirmação de ${this.form.controls.id.value ? 'Alteração' : 'Inclusão'}`;
    bsModalRefConfirmacaoValorExcedido.content.corpo = 'O valor total pago excede o valor do pacote. Deseja continuar?';
    bsModalRefConfirmacaoValorExcedido.content.onClose.subscribe((result) => {
      if (result) {
        this.createOrUpdate(obj);
      }
    });
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
    this.onCreateForm();
    this.searchByFilter();
    this.onLoadPacote();
    this.service.setLancamento();
    this.valorSelecionado = 0;
    this.showNoRecords = false;
    this.isInvalidForm = false;
  }

  public onClickEditar(lancamento: Lancamento): void {
    this.messageService.clearAllMessages();
    this.valorSelecionado = lancamento.valor;
    this.service.findById(lancamento.id).subscribe(response => {
      this.form.setValue({
        id: response.result.id,
        data: Util.convertDateToString(response.result.data),
        valor: response.result.valor,
        observacao: response.result.observacao || null,
        pacoteId: response.result.pacoteId,
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
        pacoteId: this.pacoteId
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
    this.valorSelecionado = 0;
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
