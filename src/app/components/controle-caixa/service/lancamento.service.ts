import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPoint } from '../../shared/endpoint/endpoint';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  constructor(private http: HttpClient) { }

  findByFilter(filter: any): Observable<any> {
    return this.http.post(`${EndPoint.URL}/api/lancamento/findByFilter`, filter);
  }

  findLancamentoTotal(filter: any): Observable<any> {
    return this.http.post(`${EndPoint.URL}/api/lancamento/findLancamentoTotal`, filter);
  }

  createOrUpdate(form: any): Observable<any> {
    return this.http.post(`${EndPoint.URL}/api/lancamento/createOrUpdate`, form);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${EndPoint.URL}/api/lancamento/delete/${id}`);
  }
}
