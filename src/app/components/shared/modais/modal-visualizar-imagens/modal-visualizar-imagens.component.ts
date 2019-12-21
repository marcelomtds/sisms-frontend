import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-visualizar-imagens',
  templateUrl: './modal-visualizar-imagens.component.html'
})
export class ModalVisualizarImagensComponent {

  constructor(private modalRef: BsModalRef) { }

  imagens: string[] = [];

  public onClickCloseModal(): void {
    this.modalRef.hide();
  }

}
