import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormaPagamentoEnum } from 'src/app/core/model/enum/forma-pagamento.enum';
import { TipoLancamentoEnum } from 'src/app/core/model/enum/tipo-lancamento.enum';
import { CategoriaLancamento } from 'src/app/core/model/model/categoria-lancamento.model';
import { FormaPagamento } from 'src/app/core/model/model/forma-pagamento.model';
import { Lancamento } from 'src/app/core/model/model/lancamento.model';
import { CategoriaLancamentoService } from 'src/app/core/services/categoria-lancamento.service';
import { FormaPagamentoService } from 'src/app/core/services/forma-pagamento.service';
import { MessageService } from 'src/app/core/services/message.service';
import { Messages } from 'src/app/shared/messages/messages';
import Util from 'src/app/shared/util/util';
import { LancamentoService } from '../../../core/services/lancamento.service';

@Component({
  selector: 'app-controle-caixa-saida',
  templateUrl: './controle-caixa-saida.component.html'
})
export class ControleCaixaSaidaComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public categoriasLancamento = new Array<CategoriaLancamento>();
  public formasPagamento = new Array<FormaPagamento>();
  public isInvalidForm = false;
  public subscription: Subscription;

  public constructor(
    private formBuilder: FormBuilder,
    private service: LancamentoService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private categoriaLancamentoService: CategoriaLancamentoService,
    private formaPagamentoService: FormaPagamentoService
  ) {
    this.subscription = this.categoriaLancamentoService.getCategoriaLancamento().subscribe(() => {
      this.onLoadComboCategoriaLancamento();
    });
  }

  public ngOnInit(): void {
    const id = +this.route.snapshot.params.id;
    if (id) {
      this.findById(id);
    }
    this.onCreateForm();
    this.onLoadComboCategoriaLancamento();
    this.onLoadComboFormaPagamento();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onClickCancelar(): void {
    this.messageService.clearAllMessages();
    window.history.back();
  }

  private onLoadComboCategoriaLancamento(): void {
    this.categoriaLancamentoService.findAll().subscribe(response => {
      this.categoriasLancamento = response.result;
    });
  }

  private onLoadComboFormaPagamento(): void {
    this.formaPagamentoService.findAllIgnoringIds([FormaPagamentoEnum.UTILIZACAO_CREDITO]).subscribe(response => {
      this.formasPagamento = response.result;
    });
  }

  private findById(id: number): void {
    this.service.findById(id).subscribe(response => {
      this.form.setValue({
        id: response.result.id,
        data: Util.convertDateToString(response.result.data),
        valor: response.result.valor,
        observacao: response.result.observacao || null,
        categoriaLancamentoId: response.result.categoriaLancamentoId,
        formaPagamentoId: response.result.formaPagamentoId,
        tipoLancamentoId: response.result.tipoLancamentoId,
      });
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      data: [null, Validators.required],
      valor: [0, Validators.required],
      observacao: [null],
      categoriaLancamentoId: [null, Validators.required],
      formaPagamentoId: [null, Validators.required],
      tipoLancamentoId: [TipoLancamentoEnum.SAIDA, Validators.required]
    });
  }

  public getDataAtual(): void {
    this.messageService.clearAllMessages();
    if (!this.form.controls.data.value) {
      this.form.controls.data.setValue(new Date().toLocaleDateString());
    }
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
          this.router.navigate(['/controle-caixa']);
        });
      } else {
        this.service.create(formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.router.navigate(['/controle-caixa']);
        });
      }
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

}
