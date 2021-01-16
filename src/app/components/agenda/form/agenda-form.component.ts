import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { DiaSemanaEnum } from '../../../core/model/enum/dia-semana.enum';
import { Agenda } from '../../../core/model/model/agenda.model';
import { CategoriaAtendimento } from '../../../core/model/model/categoria-atendimento.model';
import { DiaSemana } from '../../../core/model/model/dia-semana.model';
import { Paciente } from '../../../core/model/model/paciente.model';
import { Tabset } from '../../../core/model/model/tabset.model';
import { TipoAtendimento } from '../../../core/model/model/tipo-atendimento.model';
import { AgendaService } from '../../../core/services/agenda.service';
import { MessageService } from '../../../core/services/message.service';
import { Messages } from '../../../shared/messages/messages';
import { ModalConfirmacaoComponent } from '../../../shared/modais/modal-confirmacao/modal-confirmacao.component';
import Util from '../../../shared/util/util';

@Component({
  selector: 'app-agenda-form',
  templateUrl: './agenda-form.component.html'
})
export class AgendaFormComponent implements OnInit {

  pacientes = new Array<Paciente>();
  dados = new Array<Agenda>();
  categoriasAtendimento = new Array<CategoriaAtendimento>();
  tiposAtendimento = new Array<TipoAtendimento>();
  diasSemana = new Array<DiaSemana>();
  form: FormGroup;
  isInvalidForm = false;
  tabset: Tabset[] = [
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

  constructor(
    private formBuilder: FormBuilder,
    private service: AgendaService,
    private messageService: MessageService,
    private modalService: BsModalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.onCreateForm();
    this.onLoadData();
  }

  getDados(diaSemana: number): Array<Agenda> {
    return this.dados.filter(x => x.diaSemanaId === diaSemana);
  }

  onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      if (!Util.isHorarioValido(this.form.controls.horarioInicio.value)) {
        this.messageService.sendMessageError(Messages.MSG0062);
        return;
      }
      if (!Util.isHorarioValido(this.form.controls.horarioFim.value)) {
        this.messageService.sendMessageError(Messages.MSG0063);
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

  onClickCancel(): void {
    this.messageService.clearAllMessages();
    this.onUpdate();
  }

  onClickEditar(id: number): void {
    this.messageService.clearAllMessages();
    this.service.findById(id).subscribe(response => {
      this.form.setValue({
        id: response.result.id,
        diaSemanaId: response.result.diaSemanaId,
        horarioInicio: response.result.horarioInicio,
        horarioFim: response.result.horarioFim,
        pacienteId: response.result.pacienteId,
        tipoAtendimentoId: response.result.tipoAtendimentoId,
        categoriaAtendimentoId: response.result.categoriaAtendimentoId
      });
    });
  }

  onClickExcluir(id: number): void {
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

  private onLoadData(): void {
    this.route.data.subscribe(response => {
      this.dados = response.resolve[0].result;
      this.pacientes = response.resolve[1].result;
      this.categoriasAtendimento = response.resolve[2].result;
      this.tiposAtendimento = response.resolve[3].result;
      this.diasSemana = response.resolve[4].result;
      this.orderWeekDay();
    });
  }

  private findAll(): void {
    this.service.findAll().subscribe(response => {
      this.dados = response.result;
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

  private orderWeekDay(): void {
    this.diasSemana.push(this.diasSemana[0]);
    this.diasSemana.splice(0, 1);
  }

  private onUpdate(): void {
    this.onCreateForm();
    this.findAll();
    this.isInvalidForm = false;
  }
}
