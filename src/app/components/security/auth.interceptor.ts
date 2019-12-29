import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SharedService } from './service/shared.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private totalRequests = 0;

    constructor(private spinnerService: NgxSpinnerService, private sharedService: SharedService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.totalRequests++;
        //this.spinnerService.show();
        let authRequest: any;
        if (this.sharedService.isLoggedIn()) {
            authRequest = req.clone({
                setHeaders: {
                    'Authorization': sessionStorage.getItem('token')
                }
            });
            return next.handle(authRequest).pipe(
                tap(res => {
                    if (res instanceof HttpResponse) {
                        this.decreaseRequests();
                    }
                }),
                catchError(err => {
                    this.decreaseRequests();
                    throw err;
                })
            );

        }
        return next.handle(req).pipe(
            tap(res => {
                if (res instanceof HttpResponse) {
                    this.decreaseRequests();
                }
            }),
            catchError(err => {
                this.decreaseRequests();
                throw err;
            })
        );
    }

    private decreaseRequests() {
        this.totalRequests--;
        if (this.totalRequests === 0) {
            this.spinnerService.hide();
        }
    }

}