import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autenticacao } from '../model/model/autenticacao.model';
import { CurrentAuthentication } from '../model/model/current-authentication.model';
import { Response } from '../model/model/response.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService<Autenticacao, {}> {

  constructor(http: HttpClient) {
    super(http, '/api/auth');
  }

  public login(form: Autenticacao): Observable<Response<CurrentAuthentication>> {
    return this.http.post<Response<CurrentAuthentication>>(this.apiBaseUrl, form);
  }

}
