import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { FormaPagamentoEnum } from 'src/app/core/model/enum/forma-pagamento.enum';
import { TipoLancamentoEnum } from 'src/app/core/model/enum/tipo-lancamento.enum';
import { FormaPagamento } from 'src/app/core/model/model/forma-pagamento.model';
import { Lancamento } from 'src/app/core/model/model/lancamento.model';
import { Paciente } from 'src/app/core/model/model/paciente.model';
import { FormaPagamentoService } from 'src/app/core/services/forma-pagamento.service';
import { LancamentoService } from 'src/app/core/services/lancamento.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { Messages } from 'src/app/shared/messages/messages';
import Util from 'src/app/shared/util/util';

@Component({
  selector: 'app-credito-form',
  templateUrl: './credito-form.component.html'
})
export class CreditoFormComponent implements OnInit {

  form: FormGroup;
  isInvalidForm = false;
  pacientes = new Array<Paciente>();
  formasPagamento = new Array<FormaPagamento>();

  constructor(
    private service: LancamentoService,
    private formBuilder: FormBuilder,
    private formaPagamentoService: FormaPagamentoService,
    private modalService: BsModalService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.params.id;
    if (id) {
      this.findById(id);
    }
    this.onCreateForm();
    this.onLoadCombos();
  }

  private onLoadCombos(): void {
    this.formaPagamentoService.findAllIgnoringIds([FormaPagamentoEnum.UTILIZACAO_CREDITO]).subscribe(response => {
      this.formasPagamento = response.result;
    });
    this.pacienteService.findAllActive().subscribe(response => {
      this.pacientes = response.result;
    });
  }

  private findById(id: number): void {
    this.service.findById(id).subscribe(response => {
      this.form.setValue({
        id: response.result.id,
        data: Util.convertDateToString(response.result.data),
        valor: response.result.valor,
        formaPagamentoId: response.result.formaPagamentoId,
        pacienteId: response.result.pacienteId,
        observacao: response.result.observacao || null,
        tipoLancamentoId: response.result.tipoLancamentoId
      });
    });
  }

  onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      data: [null, Validators.required],
      valor: [0, [Validators.required, Validators.min(0.01), Validators.max(999999.99)]],
      formaPagamentoId: [null, Validators.required],
      pacienteId: [null, Validators.required],
      observacao: [null],
      tipoLancamentoId: [TipoLancamentoEnum.ENTRADA_CREDITO, Validators.required]
    });
  }

  getDataAtual(): void {
    this.messageService.clearAllMessages();
    if (!this.form.controls.data.value) {
      this.form.controls.data.setValue(new Date().toLocaleDateString());
    }
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
      };
      if (formValue.id) {
        this.service.update(formValue.id, formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.router.navigate(['/credito']);
        });
      } else {
        this.service.create(formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.router.navigate(['/credito']);
        });
      }
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

  onClickCancelar(): void {
    this.messageService.clearAllMessages();
    window.history.back();
  }

}
