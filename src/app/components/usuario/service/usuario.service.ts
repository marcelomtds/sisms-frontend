import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PacienteUsuarioFilter } from '../../shared/model/filter/paciente-usuario.filter';
import { Response } from '../../shared/model/model/response.model';
import { Usuario } from '../../shared/model/model/usuario.model';
import { BaseService } from '../../shared/services/base.service';

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

  public updatePassword(formValue: any): Observable<Response<Usuario>> {
    return this.http.put<Response<Usuario>>(`${this.apiBaseUrl}/updatePassword`, formValue);
  }

}
