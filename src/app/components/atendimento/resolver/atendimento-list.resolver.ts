import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { PerfilEnum } from 'src/app/core/model/enum/perfil.enum';
import { IAtendimentoListResolver } from 'src/app/core/model/interface/atendimento-resolver.interface';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { TipoAtendimentoService } from 'src/app/core/services/tipo-atendimento.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Injectable()
export class AtendimentoListResolver implements Resolve<Observable<IAtendimentoListResolver>> {

    constructor(
        private pacienteService: PacienteService,
        private tipoAtendimentoService: TipoAtendimentoService,
        private usuarioService: UsuarioService,
        private sharedService: SharedService
    ) { }

    resolve(): Observable<IAtendimentoListResolver> {
        const services: IAtendimentoListResolver = {
            pacientes: this.pacienteService.findAllActive(),
            tiposAtendimento: this.tipoAtendimentoService.findAll()
        }
        if (this.isAdministrador()) {
            services.usuarios = this.usuarioService.findAll();
        }
        return forkJoin(services);
    }

    private isAdministrador(): boolean {
        return this.sharedService.getUserSession().perfilRole === PerfilEnum.ADMINISTRADOR;
    }

}
