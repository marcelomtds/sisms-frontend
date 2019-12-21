import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-confirmacao',
  templateUrl: './modal-confirmacao.component.html'
})
export class ModalConfirmacaoComponent {

  public onClose = new Subject<boolean>();
  public titulo = '';
  public corpo = '';

  public constructor(private modalRef: BsModalRef) { }

  public onClickCloseModal(value: boolean): void {
    this.onClose.next(value);
    this.modalRef.hide();
  }

}
