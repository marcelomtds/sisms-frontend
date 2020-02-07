import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Atendimento } from 'src/app/core/model/model/atendimento.model';
import { Response } from 'src/app/core/model/model/response.model';
import { AtendimentoService } from 'src/app/core/services/atendimento.service';
import { Messages } from 'src/app/shared/messages/messages';
import { MessageService } from 'src/app/core/services/message.service';

@Injectable()
export class AtendimentoResolver implements Resolve<Promise<Response<Atendimento>>> {

    constructor(
        private atendimentoService: AtendimentoService,
        private messageService: MessageService,
        private router: Router
    ) { }

    async resolve(route: ActivatedRouteSnapshot): Promise<Response<Atendimento>> {
        const id = +route.params.id;
        const categoriaAtendimentoId = +route.data.id;
        const response: Response<Atendimento> = await this.atendimentoService.findById(id).toPromise();
        if (categoriaAtendimentoId !== response.result.categoriaAtendimentoId) {
            this.messageService.sendMessageError(Messages.MSG0027);
            this.router.navigate(['/home']);
            return;
        }
        return response;
    }


}
