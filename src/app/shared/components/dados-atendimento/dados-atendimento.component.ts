import { Component, Input, OnInit } from '@angular/core';
import { Atendimento } from 'src/app/core/model/model/atendimento.model';
import Util from '../../util/util';

@Component({
  selector: 'app-dados-atendimento',
  templateUrl: './dados-atendimento.component.html'
})
export class DadosAtendimentoComponent implements OnInit {

  @Input() atendimento: Atendimento;

  constructor() { }

  ngOnInit() {
  }

  calcularTempo(dataInicio: any, dataFim: any): string {
    return Util.calcularTempoHorasMinutos(dataInicio, dataFim);
  }

}
