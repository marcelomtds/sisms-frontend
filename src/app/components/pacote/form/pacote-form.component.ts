import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { PacienteService } from '../../../core/services/paciente.service';
import { Messages } from '../../../shared/messages/messages';
import { ModalConfirmacaoComponent } from '../../../shared/modais/modal-confirmacao/modal-confirmacao.component';
import { CategoriaAtendimento } from '../../../core/model/model/categoria-atendimento.model';
import { Paciente } from '../../../core/model/model/paciente.model';
import { Pacote } from '../../../core/model/model/pacote.model';
import { CategoriaAtendimentoService } from '../../../core/services/categoria-atendimento.service';
import { MessageService } from '../../../core/services/message.service';
import { PacoteService } from '../../../core/services/pacote.service';

@Component({
  selector: 'app-pacote-form',
  templateUrl: './pacote-form.component.html'
})
export class PacoteFormComponent implements OnInit {

  public pacientes = new Array<Paciente>();
  public categoriasAtendimento = new Array<CategoriaAtendimento>();
  public form: FormGroup;
  public isInvalidForm = false;

  public constructor(
    private formBuilder: FormBuilder,
    private service: PacoteService,
    private router: Router,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private pacienteService: PacienteService,
    private categoriaAtendimentoService: CategoriaAtendimentoService,
  ) { }

  public ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    if (id) {
      this.findById(id);
    }
    this.onCreateForm();
    this.onLoadCombos();
  }

  private findById(id: number): void {
    this.service.findById(id).subscribe(response => {
      this.form.patchValue(response.result);
      this.form.controls.categoriaAtendimentoId.disable();
      this.form.controls.categoriaAtendimentoId.updateValueAndValidity();
      this.form.controls.pacienteId.disable();
      this.form.controls.pacienteId.updateValueAndValidity();
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      categoriaAtendimentoId: [null, Validators.required],
      pacienteId: [null, Validators.required],
      valor: [0, Validators.required]
    });
  }

  private onLoadCombos(): void {
    this.pacienteService.findAllActive().subscribe(response => {
      this.pacientes = response.result;
    });
    this.categoriaAtendimentoService.findAll().subscribe(response => {
      this.categoriasAtendimento = response.result;
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      const formValue: Pacote = {
        ...this.form.value,
        pacienteId: this.form.controls.pacienteId.value,
        categoriaAtendimentoId: this.form.controls.categoriaAtendimentoId.value
      };
      if (formValue.id) {
        this.service.update(formValue.id, formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.onCreateForm();
          this.router.navigate(['/pacote']);
        });
      } else {
        const modalRef = this.modalService.show(ModalConfirmacaoComponent, { backdrop: 'static' });
        modalRef.content.titulo = 'Confirmação de Criação de Pacote';
        modalRef.content.corpo = 'Ao criar um novo pacote o anterior será encerrado automaticamente. Deseja continuar?';
        modalRef.content.onClose.subscribe(result => {
          if (result) {
            this.service.create(formValue).subscribe(response => {
              this.messageService.sendMessageSuccess(response.message);
              this.onCreateForm();
              this.router.navigate(['/pacote']);
            });
          }
        });
      }
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

}
