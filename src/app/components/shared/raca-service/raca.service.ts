import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EndPoint } from '../endpoint/endpoint';

@Injectable({
  providedIn: 'root'
})
export class RacaService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<any> {
    return this.http.get(`${EndPoint.URL}/api/raca/findAll`);
  }
}
