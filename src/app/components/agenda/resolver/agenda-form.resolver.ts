import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AgendaService } from 'src/app/core/services/agenda.service';
import { CategoriaAtendimentoService } from 'src/app/core/services/categoria-atendimento.service';
import { DiaSemanaService } from 'src/app/core/services/dia-semana.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { TipoAtendimentoService } from 'src/app/core/services/tipo-atendimento.service';

@Injectable()
export class AgendaFormResolver implements Resolve<Observable<any>> {

    constructor(
        private pacienteService: PacienteService,
        private agendaService: AgendaService,
        private diaSemanaService: DiaSemanaService,
        private categoriaAtendimentoService: CategoriaAtendimentoService,
        private tipoAtendimentoService: TipoAtendimentoService,
    ) { }

    resolve(): Observable<any> {
        return forkJoin([
            this.agendaService.findAll(),
            this.pacienteService.findAllActive(),
            this.categoriaAtendimentoService.findAll(),
            this.tipoAtendimentoService.findAll(),
            this.diaSemanaService.findAll()
        ]);
    }

}
