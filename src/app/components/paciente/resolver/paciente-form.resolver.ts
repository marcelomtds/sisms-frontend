import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Localidade } from 'src/app/core/model/model/localidade.model';
import { Paciente } from 'src/app/core/model/model/paciente.model';
import { Response } from 'src/app/core/model/model/response.model';
import { LocalidadeService } from 'src/app/core/services/localidade.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { ProfissaoService } from 'src/app/core/services/profissao.service';
import { SexoService } from 'src/app/core/services/sexo.service';
import { UfService } from 'src/app/core/services/uf.service';

@Injectable()
export class PacienteFormResolver implements Resolve<any> {

    constructor(
        private pacienteService: PacienteService,
        private sexoService: SexoService,
        private profissaoService: ProfissaoService,
        private ufService: UfService,
        private localidadeService: LocalidadeService
    ) { }

    async resolve(route: ActivatedRouteSnapshot): Promise<any> {
        const id = +route.params.id;
        let paciente = new Response<Paciente>();
        let localidades = new Response<Array<Localidade>>();
        if (id) {
            paciente = await (await this.pacienteService.findById(id).toPromise());
            localidades = await (await this.localidadeService.findByUfId(paciente.result.enderecoLocalidadeUFId).toPromise());
        }
        return {
            paciente: paciente,
            sexos: await this.sexoService.findAll().toPromise(),
            profissoes: await this.profissaoService.findAll().toPromise(),
            ufs: await this.ufService.findAll().toPromise(),
            localidades: localidades
        };
    }


}
