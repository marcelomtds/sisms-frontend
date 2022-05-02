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

  public onClickEditar(agenda: Agenda): void {
    window.scroll(0, 0);
    this.editEmitter.emit(agenda.id);
  }

  public onClickExcluir(id: number): void {
    this.removeEmitter.emit(id);
  }

}
