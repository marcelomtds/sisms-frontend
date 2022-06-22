import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaAtendimento } from 'src/app/core/model/model/categoria-atendimento.model';
import { DiaSemana } from 'src/app/core/model/model/dia-semana.model';
import { Periodo } from 'src/app/core/model/model/periodo.model';
import { Reserva } from 'src/app/core/model/model/reserva.model';
import { CategoriaAtendimentoService } from 'src/app/core/services/categoria-atendimento.service';
import { DiaSemanaService } from 'src/app/core/services/dia-semana.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PeriodoService } from 'src/app/core/services/periodo.service';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { Messages } from 'src/app/shared/messages/messages';
import Util from 'src/app/shared/util/util';

@Component({
  selector: 'app-reserva-form',
  templateUrl: './reserva-form.component.html'
})
export class ReservaFormComponent implements OnInit {

  public dados = new Array<Reserva>();
  categoriasAtendimento = new Array<CategoriaAtendimento>();
  periodos = new Array<Periodo>();
  diasSemana = new Array<DiaSemana>();
  public form: FormGroup;
  public isInvalidForm = false;

  public constructor(
    private formBuilder: FormBuilder,
    private service: ReservaService,
    private messageService: MessageService,
    private categoriaAtendimentoService: CategoriaAtendimentoService,
    private periodoService: PeriodoService,
    private diaSemanaService: DiaSemanaService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
    const id = +this.route.snapshot.params.id;
    if (id) {
      this.findById(id);
    }
  }

  private onLoadCombos(): void {
    this.categoriaAtendimentoService.findAll().subscribe(response => {
      this.categoriasAtendimento = response.result;
    });
    this.periodoService.findAll().subscribe(response => {
      this.periodos = response.result;
    });
    this.diaSemanaService.findAll().subscribe(response => {
      this.diasSemana = response.result;
    });
  }

  private async findById(id): Promise<void> {
    this.messageService.clearAllMessages();
    const response = await this.service.findById(id).toPromise();
    this.form.setValue({
      id: response.result.id,
      pacienteNomeCompleto: response.result.pacienteNomeCompleto,
      telefone: response.result.telefone,
      categoriaAtendimentoId: response.result.categoriaAtendimentoId,
      periodoId: response.result.periodoId,
      horario: response.result.horario,
      diaSemanaId: response.result.diaSemanaId,
      observacao: response.result.observacao
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      pacienteNomeCompleto: [null, Validators.required],
      telefone: [null],
      categoriaAtendimentoId: [null],
      periodoId: [null],
      horario: [null],
      diaSemanaId: [null],
      observacao: [null]
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      const horario = this.form.controls.horario.value;
      if (horario && !Util.isHorarioValido(horario)) {
        this.messageService.sendMessageError(Messages.MSG0089);
        return;
      }
      const formValue: Reserva = {
        ...this.form.value
      };
      if (formValue.id) {
        this.service.update(formValue.id, formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.router.navigate(['/reserva']);
        });
      } else {
        this.service.create(formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.router.navigate(['/reserva']);
        });
      }
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

  public onClickCancelar(): void {
    this.messageService.clearAllMessages();
    window.history.back();
  }

  getPhoneNumberMask(): string {
    return Util.getPhoneNumberMask(this.form.controls.telefone);
  }
}
