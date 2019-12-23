import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PacoteFilter } from '../model/filter/pacote.filter';
import { Pacote } from '../model/model/pacote.model';
import { Response } from '../model/model/response.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PacoteService extends BaseService<Pacote, PacoteFilter> {

  constructor(http: HttpClient) {
    super(http, '/api/pacote');
  }

  public closePackage(id: number): Observable<Response<Pacote>> {
    return this.http.get<Response<Pacote>>(`${this.apiBaseUrl}/closePackage/${id}`);
  }

  public findLastOpen(categoriaAtendimentoId: number, pacienteId: number): Observable<Response<Pacote>> {
    return this.http.get<Response<Pacote>>(`${this.apiBaseUrl}/findLastOpen/${categoriaAtendimentoId}/${pacienteId}`);
  }

}
