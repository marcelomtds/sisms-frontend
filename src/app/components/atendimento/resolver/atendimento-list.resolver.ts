import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { PerfilEnum } from 'src/app/core/model/enum/perfil.enum';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { TipoAtendimentoService } from 'src/app/core/services/tipo-atendimento.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Injectable()
export class AtendimentoListResolver implements Resolve<Observable<any>> {

    constructor(
        private pacienteService: PacienteService,
        private tipoAtendimentoService: TipoAtendimentoService,
        private usuarioService: UsuarioService,
        private sharedService: SharedService
    ) { }

    resolve(): Observable<any> {
        return forkJoin([
            this.pacienteService.findAllActive(),
            this.isAdministrador() ? this.usuarioService.findAll() : null,
            this.tipoAtendimentoService.findAll()
        ]);
    }

    private isAdministrador(): boolean {
        return this.sharedService.getUserSession().perfilRole === PerfilEnum.ADMINISTRADOR;
    }

}
