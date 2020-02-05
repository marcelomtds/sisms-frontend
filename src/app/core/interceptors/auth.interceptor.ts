import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SharedService } from '../services/shared.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    public constructor(private sharedService: SharedService) {
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authRequest: HttpRequest<any>;
        if (this.sharedService.isLoggedIn()) {
            authRequest = req.clone({
                setHeaders: {
                    'Authorization': this.sharedService.getTokenSession()
                }
            });
            return next.handle(authRequest).pipe(
                tap()
            );
        }
        return next.handle(req).pipe(
            tap()
        );
    }

}
