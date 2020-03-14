import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PerfilEnum } from 'src/app/core/model/enum/perfil.enum';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { TipoAtendimentoService } from 'src/app/core/services/tipo-atendimento.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Injectable()
export class AtendimentoListResolver implements Resolve<any> {

    constructor(
        private pacienteService: PacienteService,
        private tipoAtendimentoService: TipoAtendimentoService,
        private usuarioService: UsuarioService,
        private sharedService: SharedService
    ) { }

    async resolve(): Promise<any> {
        return {
            pacientes: await this.pacienteService.findAllActive().toPromise(),
            usuarios: this.isAdministrador() ? await this.usuarioService.findAll().toPromise() : null,
            tiposAtendimento: await this.tipoAtendimentoService.findAll().toPromise(),
        };
    }

    private isAdministrador(): boolean {
        return this.sharedService.getUserSession().perfilRole === PerfilEnum.ADMINISTRADOR;
    }


}
