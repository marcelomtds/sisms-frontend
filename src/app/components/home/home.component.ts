import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Agenda } from '../../core/model/model/agenda.model';
import { Paciente } from '../../core/model/model/paciente.model';
import { Usuario } from '../../core/model/model/usuario.model';
import Util from '../../shared/util/util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  pacientes = new Array<Paciente>();
  usuarios = new Array<Usuario>();
  dadosAgenda = new Array<Agenda>();
  mes: string;
  interval;

  constructor(
    private route: ActivatedRoute
  ) {
    this.interval = setInterval(() => {
    }, 1000);
  }

  ngOnInit(): void {
    this.getMes();
    this.onLoadData();
  }

  ngOnDestroy(): void {
    this.interval = null;
  }

  getColor(horarioInicial: string, horarioFinal: string): any {
    if (this.isAfter(horarioInicial, horarioFinal)) {
      return 'blue';
    } else if (this.isBetween(horarioInicial, horarioFinal)) {
      return 'green';
    } else {
      return '#ff8115';
    }
  }

  getStatus(horarioInicial: string, horarioFinal: string): any {
    if (this.isAfter(horarioInicial, horarioFinal)) {
      return 'Encerrado';
    } else if (this.isBetween(horarioInicial, horarioFinal)) {
      return 'Em Atedimento';
    } else {
      return 'Não Iniciado';
    }
  }

  get getWeekDay(): string {
    return `Agenda para ${Util.diaSemana(new Date().getDay())}`;
  }

  private onLoadData(): void {
    this.route.data.subscribe(response => {
      this.pacientes = response.resolve[0].result;
      this.usuarios = response.resolve[1].result;
      this.dadosAgenda = response.resolve[2].result;
    });
  }

  private isBetween(horarioInicial: string, horarioFinal: string): boolean {
    return moment().isBetween(`${moment(new Date()).format('YYYY-MM-DD')}T${horarioInicial}`,
      `${moment(new Date()).format('YYYY-MM-DD')}T${horarioFinal}`);
  }

  private isAfter(horarioInicial: string, horarioFinal: string): boolean {
    return moment().isAfter(`${moment(new Date()).format('YYYY-MM-DD')}T${horarioInicial}`)
      && moment().isAfter(`${moment(new Date()).format('YYYY-MM-DD')}T${horarioFinal}`);
  }

  private getMes(): void {
    this.mes = Util.mesesAno(new Date().getMonth() + 1);
  }

}
