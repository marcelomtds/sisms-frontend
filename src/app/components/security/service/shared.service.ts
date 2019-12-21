import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Usuario } from '../../shared/model/model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  subject = new Subject<any>();

  constructor() {
  }

  isLoggedIn(): boolean {
    if (sessionStorage.getItem('token') == null && sessionStorage.getItem('usuario') == null) {
      return false;
    }
    return true;
  }

  updateTemplateGet(): Observable<any> {
    return this.subject.asObservable();
  }

  updateTemplateSet(showTemplate: boolean): any {
    this.subject.next(showTemplate);
  }

  getUserSession(): Usuario {
    return JSON.parse(sessionStorage.getItem('usuario'));
  }

  setUserAndTokenSession(usuario: any, token: any): void {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
  }

  setUserSession(usuario: any): void {
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
  }

  removeUserAndTokenSession(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    this.updateTemplateSet(false);
  }
}
