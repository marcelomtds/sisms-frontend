import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPoint } from '../../endpoint/endpoint';

@Injectable({
  providedIn: 'root'
})
export class EstadoCivilService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<any> {
    return this.http.get(`${EndPoint.URL}/api/estadoCivil`);
  }
}
