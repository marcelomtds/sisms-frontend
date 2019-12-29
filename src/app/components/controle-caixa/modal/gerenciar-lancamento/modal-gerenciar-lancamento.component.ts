import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/components/shared/message/messages';
import { ModalConfirmacaoComponent } from 'src/app/components/shared/modais/modal-confirmacao/modal-confirmacao.component';
import Pageable from 'src/app/components/shared/pageable/pageable';
import Page from 'src/app/components/shared/pagination/page';
import { FormaPagamentoService } from 'src/app/components/shared/services/forma-pagamento.service';
import Util from 'src/app/components/shared/util/util';
import { LancamentoService } from '../../service/lancamento.service';

@Component({
  selector: 'app-modal-gerenciar-lancamento',
  templateUrl: './modal-gerenciar-lancamento.component.html'
})
export class ModalGerenciarLancamentoComponent implements OnInit {

  lancamentoList = new Page();
  isEdit = false;
  form: FormGroup;
  filtro = new Pageable();
  filtroControleCaixa: any;
  formaPagamentoList: any = [];
  valorSelecionado: 0;

  constructor(
    public bsModalRef: BsModalRef,
    private formaPagamentoService: FormaPagamentoService,
    private bsModalRefConfirmacaoExclusao: BsModalRef,
    private bsModalRefConfirmacaoValorExcedido: BsModalRef,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private lancamentoService: LancamentoService,
    private messageService: ToastrService
  ) { }

  ngOnInit() {
    this.onCreateForm();
    this.loadLancamentos();
    this.onLoadComboFormaPagamento();
  }

  private onLoadComboFormaPagamento(): void {
    this.formaPagamentoService.findAll().subscribe(dados => {
      this.formaPagamentoList = dados;
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      'id': [null],
      'data': [null, Validators.required],
      'valor': [0, Validators.required],
      'pacote': this.formBuilder.group({
        'id': [this.filtroControleCaixa.pacote.id]
      }),
      'atendimento': this.formBuilder.group({
        'id': [this.filtroControleCaixa.atendimento.id]
      }),
      'formaPagamento': this.formBuilder.group({
        'id': [null, Validators.required]
      }),
      'categoriaAtendimento': this.formBuilder.group({
        'id': [this.filtroControleCaixa.dados.categoriaAtendimento.id]
      }),
      'paciente': this.formBuilder.group({
        'id': [this.filtroControleCaixa.dados.paciente.id]
      }),
      'tipoLancamento': ['E', Validators.required],
      'observacao': [null]
    });
  }

  getDataAtual(): void {
    if (!this.form.value.data) {
      this.form.get('data').setValue(new Date().toLocaleDateString());
    }
  }

  onClickFormSubmit(): void {
    this.messageService.clear();
    if (this.form.valid && this.form.value.valor > 0) {
      if (!Util.validarData(this.form.value.data)) {
        this.messageService.error(Messages.DATA_INVALIDA, 'Erro');
        return;
      }
      const obj = {
        ...this.form.value,
        data: Util.convertStringToDate(this.form.value.data),
        tipoAtendimento: this.filtroControleCaixa.pacote.id ? 'P' : 'S'
      };
      const valor = this.filtroControleCaixa.valorPago + this.form.value.valor - (this.isEdit ? this.valorSelecionado : 0);
      if (valor > this.filtroControleCaixa.dados.valorPacote && this.form.value.pacote.id) {
        this.openModalConfirmacaoValorExcedido(obj);
      } else {
        this.createOrUpdate(obj);
      }
    } else {
      this.messageService.error(Messages.MSG0004, 'Erro');
    }
  }

  private openModalConfirmacaoValorExcedido(obj: any): void {
    this.bsModalRefConfirmacaoValorExcedido = this.modalService.show(ModalConfirmacaoComponent, { keyboard: false, backdrop: 'static' });
    this.bsModalRefConfirmacaoValorExcedido.content.titulo = `Confirmação de ${this.isEdit ? 'alteração' : 'inclusão'}`;
    this.bsModalRefConfirmacaoValorExcedido.content.corpo = 'O valor total pago excede o valor do pacote. Deseja continuar?';
    this.bsModalRefConfirmacaoValorExcedido.content.onClose.subscribe((result) => {
      if (result) {
        this.createOrUpdate(obj);
      }
    });
  }

  private createOrUpdate(obj: any): void {
   /*  this.lancamentoService.createOrUpdate(obj).subscribe(() => {
      this.messageService.success(this.isEdit ? Messages.SUCESSO_EDICAO : Messages.SUCESSO_CRIACAO, 'Sucesso');
      this.loadLancamentos();
      this.initValues();
    }); */
  }

  onClickEditar(lancamento: any): void {
    this.messageService.clear();
    this.isEdit = true;
    this.valorSelecionado = lancamento.valor;
    this.form.setValue({
      'id': lancamento.id ? lancamento.id : null,
      'valor': lancamento.valor ? lancamento.valor : null,
      'data': lancamento.data ? new Date(lancamento.data).toLocaleDateString() : null,
      'formaPagamento': {
        'id': lancamento.formaPagamento ? lancamento.formaPagamento.id : null,
      },
      'pacote': {
        'id': this.filtroControleCaixa.pacote.id
      },
      'paciente': {
        'id': this.filtroControleCaixa.dados.paciente.id
      },
      'atendimento': {
        'id': this.filtroControleCaixa.atendimento.id
      },
      'categoriaAtendimento': {
        'id': this.filtroControleCaixa.dados.categoriaAtendimento.id
      },
      'tipoLancamento': 'E',
      'observacao': lancamento.observacao ? lancamento.observacao : null
    });
  }

  loadLancamentos(): void {
    const filter = {
      ...this.filtro,
      idAtendimento: this.filtroControleCaixa.atendimento.id,
      idPacote: this.filtroControleCaixa.pacote.id
    };
    this.lancamentoService.findByFilter(filter).subscribe(lancamentos => {
      let valorPago = 0;
      if (lancamentos.result && lancamentos.result.content) {
        lancamentos.result.content.forEach(element => {
          //TODO verificar
          //valorPago += element;
        });
        this.filtroControleCaixa.valorPago = valorPago;
        this.filtroControleCaixa.valorPagar = this.filtroControleCaixa.dados.valorPacote - valorPago;
      }
      this.lancamentoList = lancamentos.result;
    });
  }

  onClickCancelar(): void {
    this.messageService.clear();
    this.initValues();
  }

  private initValues(): void {
    this.onCreateForm();
    this.isEdit = false;
    this.valorSelecionado = 0;
  }

  onClickRemover(id: any): void {
    this.messageService.clear();
    this.bsModalRefConfirmacaoExclusao = this.modalService.show(ModalConfirmacaoComponent, { keyboard: false, backdrop: 'static' });
    this.bsModalRefConfirmacaoExclusao.content.titulo = Messages.TITULO_EXCLUSAO;
    this.bsModalRefConfirmacaoExclusao.content.corpo = 'Deseja excluir esse lançamento?';
    this.bsModalRefConfirmacaoExclusao.content.onClose.subscribe((result) => {
      if (result) {
        this.lancamentoService.delete(id).subscribe(() => {
          this.initValues();
          this.loadLancamentos();
          this.messageService.success(Messages.SUCESSO_EXCLUSAO, 'Sucesso');
        });
      }
    });
  }

  setNextPage(event: any): void {
    event.preventDefault();
    if (this.filtro.currentPage + 1 < this.lancamentoList.totalPages) {
      this.filtro.currentPage += 1;
      this.loadLancamentos();
    }
  }

  setPreviousPage(event: any): void {
    event.preventDefault();
    if (this.filtro.currentPage > 0) {
      this.filtro.currentPage -= 1;
      this.loadLancamentos();
    }
  }

  showInfo(): string {
    return (`Página ${this.filtro.currentPage + 1} de ${this.lancamentoList.totalPages} - Total de ${this.lancamentoList.totalElements} registros.`);
  }

  onChangePageSize(size: any): void {
    this.filtro.pageSize = parseInt(size);
    this.loadLancamentos();
  }

  onClickOrderBy(descricao: string): void {
    this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
    this.filtro.orderBy = descricao;
    this.loadLancamentos();
  }

}
