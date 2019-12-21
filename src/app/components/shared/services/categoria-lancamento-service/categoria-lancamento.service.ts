import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPoint } from '../../endpoint/endpoint';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriaLancamentoService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<any> {
    return this.http.get(`${EndPoint.URL}/api/categoriaLancamento`);
  }

  findByFilter(filter: any): Observable<any> {
    return this.http.post(`${EndPoint.URL}/api/categoriaLancamento/findByFilter`, filter);
  }

  create(form: any): Observable<any> {
    return this.http.post(`${EndPoint.URL}/api/categoriaLancamento`, form);
  }

  update(form: any): Observable<any> {
    return this.http.put(`${EndPoint.URL}/api/categoriaLancamento`, form);
  }
}
