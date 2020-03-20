import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Usuario } from '../model/model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public subject = new Subject<boolean>();

  public isLoggedIn(): boolean {
    return this.getUserSession() !== null && this.getTokenSession() !== null;
  }

  public isCadastroCompleto(): boolean {
    return this.getUserSession().cadastroCompleto;
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

  public getTokenSession(): string {
    return sessionStorage.getItem('token');
  }

  public setTokenSession(token: string): void {
    sessionStorage.setItem('token', token);
  }

  public setUserSession(usuario: Usuario): void {
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
  }

  public removeUserAndTokenSession(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }

}
