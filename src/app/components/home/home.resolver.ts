import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AgendaService } from 'src/app/core/services/agenda.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Injectable()
export class HomeResolver implements Resolve<Observable<any>> {

    constructor(
        private pacienteService: PacienteService,
        private agendaService: AgendaService,
        private usuarioService: UsuarioService
    ) { }

    resolve(): Observable<any> {
        return forkJoin([
            this.pacienteService.findAllBirthdaysMonth(),
            this.usuarioService.findAllBirthdaysMonth(),
            this.agendaService.findAll()
        ]);
    }

}
