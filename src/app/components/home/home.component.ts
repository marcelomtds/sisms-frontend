import { Component, OnInit } from '@angular/core';
import { Paciente } from '../shared/model/model/paciente.model';
import { PacienteService } from '../shared/services/paciente.service';
import Util from '../shared/util/util';
import { UsuarioService } from '../shared/services/usuario.service';
import { Usuario } from '../shared/model/model/usuario.model';
import { Agenda } from '../shared/model/model/agenda.model';
import { AgendaService } from '../shared/services/agenda.service';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public pacientes = new Array<Paciente>();
  public usuarios = new Array<Usuario>();
  public dadosAgenda = new Array<Agenda>();
  public mes: string;
  public interval;

  public constructor(
    private pacienteService: PacienteService,
    private agendaService: AgendaService,
    private usuarioService: UsuarioService
  ) {
    this.interval = setInterval(() => {
    }, 1000);
  }

  public ngOnInit(): void {
    this.findAllBirthdaysMonth();
    this.getMes();
    this.findAgenda();
  }

  private findAgenda(): void {
    this.agendaService.findAllByWeekDay().subscribe(response => {
      this.dadosAgenda = response.result;
    });
  }

  private findAllBirthdaysMonth(): void {
    this.pacienteService.findAllBirthdaysMonth().subscribe(response => {
      this.pacientes = response.result;
    });
    this.usuarioService.findAllBirthdaysMonth().subscribe(response => {
      this.usuarios = response.result;
    });
  }

  private getMes(): void {
    this.mes = Util.mesesAno(new Date().getMonth() + 1);
  }

  public getColor(horarioInicial: string, horarioFinal: string): any {
    if (this.isAfter(horarioInicial, horarioFinal)) {
      return 'blue';
    } else if (this.isBetween(horarioInicial, horarioFinal)) {
      return 'green';
    } else {
      return 'red';
    }
  }

  public getStatus(horarioInicial: string, horarioFinal: string): any {
    if (this.isAfter(horarioInicial, horarioFinal)) {
      return 'Encerrado';
    } else if (this.isBetween(horarioInicial, horarioFinal)) {
      return 'Em Atendimento';
    } else {
      return 'À Atender';
    }
  }

  private isBetween(horarioInicial: string, horarioFinal: string): boolean {
    return moment().isBetween(`${moment(new Date()).format('YYYY-MM-DD')}T${horarioInicial}`,
      `${moment(new Date()).format('YYYY-MM-DD')}T${horarioFinal}`);
  }

  private isAfter(horarioInicial: string, horarioFinal: string): boolean {
    return moment().isAfter(`${moment(new Date()).format('YYYY-MM-DD')}T${horarioInicial}`)
      && moment().isAfter(`${moment(new Date()).format('YYYY-MM-DD')}T${horarioFinal}`);
  }

}
