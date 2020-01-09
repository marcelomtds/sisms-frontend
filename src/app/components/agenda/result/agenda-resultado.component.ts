import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Agenda } from '../../shared/model/model/agenda.model';

@Component({
  selector: 'app-agenda-resultado',
  templateUrl: './agenda-resultado.component.html'
})
export class AgendaResultadoComponent {

  @Input() dados: Array<Agenda>;
  @Input() form: FormGroup;
  @Input() diaSemana: number;
  @Output() editEmitter = new EventEmitter<Agenda>();

  public onClickEditar(value: Agenda): void {
    this.editEmitter.emit(value);
  }

  public get getDados(): Array<Agenda> {
    return this.dados.filter(x => x.diaSemanaId === this.diaSemana);
  }

}
