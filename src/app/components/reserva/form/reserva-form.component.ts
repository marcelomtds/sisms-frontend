import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Paciente } from 'src/app/core/model/model/paciente.model';
import { Reserva } from 'src/app/core/model/model/reserva.model';
import { MessageService } from 'src/app/core/services/message.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { Messages } from 'src/app/shared/messages/messages';

@Component({
  selector: 'app-reserva-form',
  templateUrl: './reserva-form.component.html'
})
export class ReservaFormComponent implements OnInit {

  public pacientes = new Array<Paciente>();
  public dados = new Array<Reserva>();
  public form: FormGroup;
  public isInvalidForm = false;

  public constructor(
    private formBuilder: FormBuilder,
    private service: ReservaService,
    private messageService: MessageService,
    private pacienteService: PacienteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadPacientes();
    const id = +this.route.snapshot.params.id;
    if (id) {
      this.findById(id);
    }
  }

  private async findById(id): Promise<void> {
    this.messageService.clearAllMessages();
    const response = await this.service.findById(id).toPromise();
    this.form.setValue({
      id: response.result.id,
      pacienteId: response.result.pacienteId,
      observacao: response.result.observacao
    });
    if (!this.pacientes.find(x => x.id === response.result.pacienteId)) {
      this.pacientes.push(((await this.pacienteService.findById(response.result.pacienteId).toPromise()).result));
      this.pacientes = [...this.pacientes];
    }
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      pacienteId: [null, Validators.required],
      observacao: [null]
    });
  }

  private onLoadPacientes(): void {
    this.pacienteService.findAllWithoutBondWithReservation().subscribe(response => {
      this.pacientes = response.result;
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
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

}
