import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from '../../shared/message/messages';
import { Agenda } from '../../shared/model/model/agenda.model';
import { CategoriaAtendimento } from '../../shared/model/model/categoria-atendimento.model';
import { DiaSemana } from '../../shared/model/model/dia-semana.model';
import { Paciente } from '../../shared/model/model/paciente.model';
import { TipoAtendimento } from '../../shared/model/model/tipo-atendimento.model';
import { AgendaService } from '../../shared/services/agenda.service';
import { CategoriaAtendimentoService } from '../../shared/services/categoria-atendimento.service';
import { DiaSemanaService } from '../../shared/services/dia-semana.service';
import { MessageService } from '../../shared/services/message.service';
import { PacienteService } from '../../shared/services/paciente.service';
import { TipoAtendimentoService } from '../../shared/services/tipo-atendimento.service';

@Component({
  selector: 'app-agenda-form',
  templateUrl: './agenda-form.component.html'
})
export class AgendaFormComponent implements OnInit {

  public pacientes = new Array<Paciente>();
  public dados = new Array<Agenda>();
  public categoriasAtendimento = new Array<CategoriaAtendimento>();
  public tiposAtendimento = new Array<TipoAtendimento>();
  public diasSemana = new Array<DiaSemana>();
  public form: FormGroup;
  public isInvalidForm = false;
  
  //public readonly segundaFeira = DiaSemanaEnum.

  public constructor(
    private formBuilder: FormBuilder,
    private service: AgendaService,
    private messageService: MessageService,
    private pacienteService: PacienteService,
    private categoriaAtendimentoService: CategoriaAtendimentoService,
    private tipoAtendimentoService: TipoAtendimentoService,
    private diaSemanaService: DiaSemanaService
  ) { }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
    this.findAll();
  }

  private findAll(): void {
    this.service.findAll().subscribe(response => {
      this.dados = response.result;
    });
  }

  public onClickEditar(row: Agenda): void {
    this.messageService.clearAllMessages();
    this.form.setValue({
      id: row.id,
      diaSemanaId: row.diaSemanaId,
      horarioInicio: row.horarioInicio,
      horarioFim: row.horarioFim,
      pacienteId: row.pacienteId,
      tipoAtendimentoId: row.tipoAtendimentoId,
      categoriaAtendimentoId: row.categoriaAtendimentoId
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      diaSemanaId: [null, Validators.required],
      horarioInicio: [null, Validators.required],
      horarioFim: [null, Validators.required],
      pacienteId: [null, Validators.required],
      tipoAtendimentoId: [null, Validators.required],
      categoriaAtendimentoId: [null, Validators.required]
    });
  }

  private onLoadCombos(): void {
    this.pacienteService.findAllActive().subscribe(response => {
      this.pacientes = response.result;
    });
    this.categoriaAtendimentoService.findAll().subscribe(response => {
      this.categoriasAtendimento = response.result;
    });
    this.tipoAtendimentoService.findAll().subscribe(response => {
      this.tiposAtendimento = response.result;
    });
    this.diaSemanaService.findAll().subscribe(response => {
      this.diasSemana = response.result;
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      const formValue: Agenda = {
        ...this.form.value
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
    this.findAll();
    this.isInvalidForm = false;
  }

}
