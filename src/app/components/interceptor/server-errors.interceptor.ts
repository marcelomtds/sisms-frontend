import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Messages } from '../shared/message/messages';
import { Response } from '../shared/pageable/response.model';
import { MessageService } from '../shared/services/message.service';
import { SharedService } from '../shared/services/shared.service';


@Injectable()
export class ServerErrorsInterceptor implements HttpInterceptor {
    constructor(
        private messageService: MessageService,
        private route: Router,
        private sharedService: SharedService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((response) => {
                    switch (response.status) {
                        case 400:
                            this.showMessages(response.error);
                            break;
                        case 401:
                            this.showMessages(response.error);
                            this.sharedService.removeUserAndTokenSession();
                            this.route.navigate(['/login']);
                            break;
                        case 403:
                            this.route.navigate(['/acesso-negado']);
                            break;
                        case 404:
                            this.messageService.sendMessageError(Messages.MSG00019);
                            break;
                        case 500:
                            this.messageService.sendMessageError(Messages.MSG00019);
                            break;
                        case 0:
                            this.messageService.sendMessageError(Messages.MSG00026);
                            break;
                        default:
                            break;
                    }
                    return EMPTY;
                })
            );
    }

    private showMessages(response: Response<any>): void {
        if (response && response.errors.length) {
            this.messageService.sendMessageError(response.errors[0]);
        } else if (response && response.message) {
            this.messageService.sendMessageError(response.message);
        }
    }

}
