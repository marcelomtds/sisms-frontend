import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Atendimento } from 'src/app/core/model/model/atendimento.model';
import { Response } from 'src/app/core/model/model/response.model';
import { AtendimentoService } from 'src/app/core/services/atendimento.service';
import { MessageService } from 'src/app/core/services/message.service';
import { OutraMedidaService } from 'src/app/core/services/outra-medida.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { TipoAtendimentoService } from 'src/app/core/services/tipo-atendimento.service';
import { Messages } from 'src/app/shared/messages/messages';

@Injectable()
export class AtendimentoFormResolver implements Resolve<any> {

    constructor(
        private atendimentoService: AtendimentoService,
        private messageService: MessageService,
        private router: Router,
        private pacienteService: PacienteService,
        private tipoAtendimentoService: TipoAtendimentoService,
        private outraMedidaService: OutraMedidaService
    ) { }

    async resolve(route: ActivatedRouteSnapshot): Promise<any> {
        const id = route.params.id;
        let atendimento = new Response<Atendimento>();
        if (id) {
            const categoriaAtendimentoId = +route.data.id;
            atendimento = await this.atendimentoService.findById(+id).toPromise();
            if (categoriaAtendimentoId !== atendimento.result.categoriaAtendimentoId) {
                this.messageService.sendMessageError(Messages.MSG0027);
                this.router.navigate(['/home']);
            }
        }
        return {
            atendimento: atendimento,
            pacientes: await this.pacienteService.findAllActive().toPromise(),
            outrasMedidas: await this.outraMedidaService.findAll().toPromise(),
            tiposAtendimento: await this.tipoAtendimentoService.findAll().toPromise(),
        };
    }

}
