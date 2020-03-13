import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { ProfissaoService } from 'src/app/core/services/profissao.service';
import { SexoService } from 'src/app/core/services/sexo.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { UfService } from 'src/app/core/services/uf.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Injectable()
export class UsuarioResolver implements Resolve<any> {

    constructor(
        private usuarioService: UsuarioService,
        private router: Router,
        private profissaoService: ProfissaoService,
        private ufService: UfService,
        private sexoService: SexoService,
        private sharedService: SharedService
    ) { }

    async resolve(route: ActivatedRouteSnapshot): Promise<any> {
        const id = +route.params.id;
        if (id !== this.sharedService.getUserSession().id) {
            this.router.navigate(['/acesso-negado']);
        }
        return {
            usuario: await this.usuarioService.findById(id),
            profissoes: await this.profissaoService.findAll().toPromise(),
            sexos: await this.sexoService.findAll().toPromise(),
            ufs: await this.ufService.findAll().toPromise(),
        };
    }

}
