import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Exame } from '../../model/model/exame.model';

@Component({
  selector: 'app-modal-visualizar-exame',
  templateUrl: './modal-visualizar-exame.component.html'
})
export class ModalVisualizarExameComponent {

  public dados: Exame;

  public constructor(
    private bsModalRef: BsModalRef
  ) { }

  public onClickCloseModal(): void {
    this.bsModalRef.hide();
  }

}
