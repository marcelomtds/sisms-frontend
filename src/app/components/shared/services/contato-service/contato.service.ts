import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPoint } from '../../endpoint/endpoint';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  constructor(private http: HttpClient) { }

  checkExistingEmail(email: string): Observable<any> {
    return this.http.get(`${EndPoint.URL}/api/contato/checkExistingEmail/${email}`);
  }
}
