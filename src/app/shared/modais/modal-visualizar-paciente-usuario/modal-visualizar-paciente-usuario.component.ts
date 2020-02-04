import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Usuario } from '../../../core/model/model/usuario.model';
import { Paciente } from '../../../core/model/model/paciente.model';

@Component({
  selector: 'app-modal-visualizar-paciente-usuario',
  templateUrl: './modal-visualizar-paciente-usuario.component.html'
})
export class ModalVisualizarPacienteUsuarioComponent {

  public dados: any;

  constructor(
    private bsModalRef: BsModalRef
  ) { }

  public onClickCloseModal(): void {
    this.bsModalRef.hide();
  }

}
