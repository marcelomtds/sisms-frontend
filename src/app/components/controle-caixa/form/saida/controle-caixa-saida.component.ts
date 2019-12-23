import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/components/shared/message/messages';
import { ModalGerenciarCategoriaLancamentoComponent } from 'src/app/components/shared/modais/modal-gerenciar-categoria-lancamento/modal-gerenciar-categoria-lancamento.component';
import { CategoriaLancamentoService } from 'src/app/components/shared/services/categoria-lancamento.service';
import { FormaPagamentoService } from 'src/app/components/shared/services/forma-pagamento.service';
import Util from 'src/app/components/shared/util/util';
import { LancamentoService } from '../../service/lancamento.service';

@Component({
  selector: 'app-controle-caixa-saida',
  templateUrl: './controle-caixa-saida.component.html'
})
export class ControleCaixaSaidaComponent implements OnInit {

  isEdit = false;
  form: FormGroup;
  categoriaList: any = [];
  formaPagamentoList: any = [];
  modalRef: BsModalRef;

  constructor(
    private formBuilder: FormBuilder,
    private lancamentoService: LancamentoService,
    private messageService: ToastrService,
    private modalService: BsModalService,
    private categoriaLancamentoService: CategoriaLancamentoService,
    private formaPagamentoService: FormaPagamentoService
  ) { }

  ngOnInit() {
    this.onCreateForm();
    this.onLoadComboCategoriaLancamento();
    this.onLoadComboFormaPagamento();
  }

  private onLoadComboCategoriaLancamento(): void {
    this.categoriaLancamentoService.findAll().subscribe(dados => {
      this.categoriaList = dados;
    });
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
      'tipoLancamento': ['S', Validators.required],
      'observacao': [null],
      'pacote': {
        'id': null
      },
      'atendimento': {
        'id': null
      },
      'categoriaLancamento': this.formBuilder.group({
        'id': [null, Validators.required]
      }),
      'formaPagamento': this.formBuilder.group({
        'id': [null, Validators.required]
      })
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
        data: Util.convertStringToDate(this.form.value.data)
      };
      this.createOrUpdate(obj);
    } else {
      this.messageService.error(Messages.MSG0004, 'Erro');
    }
  }

  private createOrUpdate(obj: any): void {
    this.lancamentoService.createOrUpdate(obj).subscribe(() => {
      this.messageService.success(this.isEdit ? Messages.SUCESSO_EDICAO : Messages.SUCESSO_CRIACAO, 'Sucesso');
      this.initValues();
    });
  }

  onClickCancelar(): void {
    this.messageService.clear();
    this.initValues();
  }

  private initValues(): void {
    this.onCreateForm();
    this.isEdit = false;
  }

  onClickOpenModalGerenciarCategoriaLancamento(): void {
    this.modalRef = this.modalService.show(ModalGerenciarCategoriaLancamentoComponent, { keyboard: false, backdrop: 'static' });
    this.modalRef.content.onClose.subscribe(() => {
      this.onLoadComboCategoriaLancamento();
    });
  }

}
