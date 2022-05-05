import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RelatorioAtendimentoPeriodoFilter } from '../model/filter/relatorio-atendimento-periodo.filter';
import { RelatorioAtendimentoSerie } from '../model/interface/relatorio-atendimento-serie.interface';
import { Response } from '../model/model/response.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService extends BaseService<{}, {}> {

  public constructor(http: HttpClient) {
    super(http, '/api/relatorio');
  }

  reportServiceByFilter(filter: RelatorioAtendimentoPeriodoFilter): Observable<Response<RelatorioAtendimentoSerie[]>> {
    return this.http.post<Response<RelatorioAtendimentoSerie[]>>(`${this.apiBaseUrl}/reportServiceByFilter`, filter);
  }

}
