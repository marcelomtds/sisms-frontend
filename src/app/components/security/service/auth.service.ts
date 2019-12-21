import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EndPoint } from '../../shared/endpoint/endpoint';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(form: any): Observable<any> {
    return this.http.post(`${EndPoint.URL}/api/auth`, form);
  }

  verifyCurrentUser(form: any): Observable<any> {
    return this.http.post(`${EndPoint.URL}/api/auth/verifyCurrentUser`, form);
  }


}
