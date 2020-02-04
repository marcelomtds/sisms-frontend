import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { Pacote } from '../../../core/model/model/pacote.model';
import { MessageService } from '../../../core/services/message.service';
import { PacoteService } from '../../../core/services/pacote.service';
import { ModalConfirmacaoComponent } from '../modal-confirmacao/modal-confirmacao.component';

@Component({
  selector: 'app-modal-criar-pacote',
  templateUrl: './modal-criar-pacote.component.html'
})
export class ModalCriarPacoteComponent implements OnInit {

  public dados = new Pacote();
  public form: FormGroup;
  public onClose = new Subject<boolean>();

  public constructor(
    private bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private service: PacoteService,
    private modalService: BsModalService
  ) { }

  public ngOnInit(): void {
    this.onCreateForm();
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      categoriaAtendimentoId: [this.dados.categoriaAtendimentoId, Validators.required],
      pacienteId: [this.dados.pacienteId, Validators.required],
      valor: [0, Validators.required]
    });
  }

  public onClickCloseModal(isUpdate: boolean): void {
    this.onClose.next(isUpdate);
    this.bsModalRef.hide();
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    const formValue: Pacote = {
      ...this.form.value,
      pacienteId: this.form.controls.pacienteId.value,
      categoriaAtendimentoId: this.form.controls.categoriaAtendimentoId.value
    };
    const modalRef = this.modalService.show(ModalConfirmacaoComponent, { backdrop: 'static' });
    modalRef.content.titulo = 'Confirmação de Criação de Pacote';
    modalRef.content.corpo = 'Ao criar um novo pacote o anterior será encerrado automaticamente. Deseja continuar?';
    modalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.service.create(formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.onCreateForm();
          this.onClickCloseModal(result);
        });
      }
    });
  }


}
