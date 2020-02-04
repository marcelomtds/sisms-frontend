import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { Messages } from '../../../shared/messages/messages';
import { ModalConfirmacaoComponent } from '../../../shared/modais/modal-confirmacao/modal-confirmacao.component';
import { DiaSemanaEnum } from '../../../core/model/enum/dia-semana.enum';
import { Agenda } from '../../../core/model/model/agenda.model';
import { CategoriaAtendimento } from '../../../core/model/model/categoria-atendimento.model';
import { DiaSemana } from '../../../core/model/model/dia-semana.model';
import { Paciente } from '../../../core/model/model/paciente.model';
import { Tabset } from '../../../core/model/model/tabset.model';
import { TipoAtendimento } from '../../../core/model/model/tipo-atendimento.model';
import { AgendaService } from '../../../core/services/agenda.service';
import { CategoriaAtendimentoService } from '../../../core/services/categoria-atendimento.service';
import { DiaSemanaService } from '../../../core/services/dia-semana.service';
import { MessageService } from '../../../core/services/message.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { TipoAtendimentoService } from '../../../core/services/tipo-atendimento.service';
import Util from '../../../shared/util/util';

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
  public tabset: Tabset[] = [
    {
      titulo: 'Segunda - Feira',
      diaSemanaId: DiaSemanaEnum.SEGUNDA_FEIRA
    },
    {
      titulo: 'Terça - Feira',
      diaSemanaId: DiaSemanaEnum.TERCA_FEIRA
    },
    {
      titulo: 'Quarta - Feira',
      diaSemanaId: DiaSemanaEnum.QUARTA_FEIRA
    },
    {
      titulo: 'Quinta - Feira',
      diaSemanaId: DiaSemanaEnum.QUINTA_FEIRA
    },
    {
      titulo: 'Sexta - Feira',
      diaSemanaId: DiaSemanaEnum.SEXTA_FEIRA
    },
    {
      titulo: 'Sábado',
      diaSemanaId: DiaSemanaEnum.SABADO
    },
    {
      titulo: 'Domingo',
      diaSemanaId: DiaSemanaEnum.DOMINGO
    },
  ];

  public constructor(
    private formBuilder: FormBuilder,
    private service: AgendaService,
    private messageService: MessageService,
    private pacienteService: PacienteService,
    private categoriaAtendimentoService: CategoriaAtendimentoService,
    private tipoAtendimentoService: TipoAtendimentoService,
    private modalService: BsModalService,
    private diaSemanaService: DiaSemanaService
  ) { }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
    this.findAll();
  }

  public getDados(diaSemana: number): Array<Agenda> {
    return this.dados.filter(x => x.diaSemanaId === diaSemana);
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
      this.orderWeekDay();
    });
  }

  private orderWeekDay(): void {
    this.diasSemana.push(this.diasSemana[0]);
    this.diasSemana.splice(0, 1);
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      if (!Util.isHorarioValido(this.form.controls.horarioInicio.value)) {
        this.messageService.sendMessageError(Messages.MSG00062);
        return;
      }
      if (!Util.isHorarioValido(this.form.controls.horarioFim.value)) {
        this.messageService.sendMessageError(Messages.MSG00063);
        return;
      }
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

  public onClickCancel(): void {
    this.onUpdate();
  }

}
