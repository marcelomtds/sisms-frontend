import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Usuario } from '../../shared/model/model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public subject = new Subject<boolean>();

  public isLoggedIn(): boolean {
    return sessionStorage.getItem('token') && sessionStorage.getItem('usuario') ? true : false;
  }

  public updateTemplateGet(): Observable<boolean> {
    return this.subject.asObservable();
  }

  public updateTemplateSet(showTemplate: boolean): void {
    this.subject.next(showTemplate);
  }

  public getUserSession(): Usuario {
    return JSON.parse(sessionStorage.getItem('usuario'));
  }

  public setUserAndTokenSession(usuario: Usuario, token: string): void {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
  }

  public setUserSession(usuario: Usuario): void {
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
  }

  public removeUserAndTokenSession(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    this.updateTemplateSet(false);
  }

}
