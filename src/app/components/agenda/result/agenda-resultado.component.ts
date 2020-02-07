import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Agenda } from '../../../core/model/model/agenda.model';

@Component({
  selector: 'app-agenda-resultado',
  templateUrl: './agenda-resultado.component.html'
})
export class AgendaResultadoComponent {

  @Input() dados: Array<Agenda>;
  @Input() form: FormGroup;
  @Output() editEmitter = new EventEmitter<number>();
  @Output() removeEmitter = new EventEmitter<number>();

  public onClickEditar(id: number): void {
    this.editEmitter.emit(id);
  }

  public onClickExcluir(value: number): void {
    this.removeEmitter.emit(value);
  }

}
