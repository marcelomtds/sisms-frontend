import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PacienteUsuarioFilter } from '../model/filter/paciente-usuario.filter';
import { Senha } from '../model/model/senha.model';
import { Usuario } from '../model/model/usuario.model';
import { Response } from '../pageable/response.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseService<Usuario, PacienteUsuarioFilter> {

  public subject = new Subject<Usuario>();

  public constructor(http: HttpClient) {
    super(http, '/api/usuario');
  }

  public setUsuario(usuario: Usuario): void {
    this.subject.next(usuario);
  }

  public getUsuario(): Observable<Usuario> {
    return this.subject.asObservable();
  }

  public updatePassword(formValue: Senha): Observable<Response<Usuario>> {
    return this.http.put<Response<Usuario>>(`${this.apiBaseUrl}/updatePassword`, formValue);
  }

  public findAllBirthdaysMonth(): Observable<Response<Array<Usuario>>> {
    return this.http.get<Response<Array<Usuario>>>(`${this.apiBaseUrl}/findAllBirthdaysMonth`);
  }

}
