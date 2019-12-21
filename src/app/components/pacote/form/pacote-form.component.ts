import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { PacienteService } from '../../paciente/service/paciente.service';
import { ModalConfirmacaoComponent } from '../../shared/modais/modal-confirmacao/modal-confirmacao.component';
import { CategoriaAtendimento } from '../../shared/model/model/categoriaAtendimento.model';
import { Paciente } from '../../shared/model/model/paciente.model';
import { Pacote } from '../../shared/model/model/pacote.model';
import { CategoriaAtendimentoService } from '../../shared/services/categoria-atendimento/categoria-atendimento.service';
import { MessageService } from '../../shared/services/message.service';
import { PacoteService } from '../../shared/services/pacote-service/pacote.service';

@Component({
  selector: 'app-pacote-form',
  templateUrl: './pacote-form.component.html'
})
export class PacoteFormComponent implements OnInit {

  public pacientes = new Array<Paciente>();
  public categoriasAtendimento = new Array<CategoriaAtendimento>();
  public form: FormGroup;

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
      this.form.setValue({
        id: response.result.id,
        categoriaAtendimentoId: response.result.categoriaAtendimentoId,
        pacienteId: response.result.pacienteId,
        valor: response.result.valor
      });
      this.form.controls.categoriaAtendimentoId.disable();
      this.form.controls.categoriaAtendimentoId.updateValueAndValidity();
      this.form.controls.pacienteId.disable();
      this.form.controls.pacienteId.updateValueAndValidity();
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      categoriaAtendimentoId: [null],
      pacienteId: [null],
      valor: [0]
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
    const formValue: Pacote = {
      ...this.form.value,
      pacienteId: this.form.controls.pacienteId.value,
      categoriaAtendimentoId: this.form.controls.categoriaAtendimentoId.value
    };
    if (formValue.id) {
      this.service.update(formValue.id, formValue).subscribe(response => {
        this.messageService.sendMessageSuccess(response.message);
        this.onCreateForm();
        this.router.navigate(['/pacote-list']);
      });
    } else {
      const modalRef = this.modalService.show(ModalConfirmacaoComponent, { keyboard: false, backdrop: 'static' });
      modalRef.content.titulo = 'Confirmação de Criação de Pacote';
      modalRef.content.corpo = 'Ao criar um novo pacote o anterior será encerrado automaticamente. Deseja continuar?';
      modalRef.content.onClose.subscribe(() => {
        this.service.create(formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.onCreateForm();
          this.router.navigate(['/pacote-list']);
        });
      });
    }
  }

}
