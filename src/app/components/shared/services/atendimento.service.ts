import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AtendimentoFilter } from '../model/filter/atendimento.filter';
import { Atendimento } from '../model/model/atendimento.model';
import { Response } from '../pageable/response.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService extends BaseService<Atendimento, AtendimentoFilter> {

  constructor(http: HttpClient) {
    super(http, '/api/atendimento');
  }

  public findTotalBySession(pacienteId: number, categoriaAtendimentoId: number): Observable<Response<number>> {
    return this.http.get<Response<number>>(`${this.apiBaseUrl}/findTotalBySession/${pacienteId}/${categoriaAtendimentoId}`);
  }

  public findTotalByPackage(pacienteId: number, pacoteId: number, categoriaAtendimentoId: number): Observable<Response<number>> {
    return this.http.get<Response<number>>(`${this.apiBaseUrl}/findTotalByPackage/${pacienteId}/${pacoteId}/${categoriaAtendimentoId}`);
  }

  public findByPackage(pacoteId: number): Observable<Response<Array<Atendimento>>> {
    return this.http.get<Response<Array<Atendimento>>>(`${this.apiBaseUrl}/findByPackage/${pacoteId}`);
  }



}
