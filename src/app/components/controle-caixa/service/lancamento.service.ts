import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageableFilter } from '../../shared/model/filter/filter.filter';
import { LancamentoFilter } from '../../shared/model/filter/lancamento.filter';
import { Lancamento } from '../../shared/model/model/lancamento.model';
import { BaseService } from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService extends BaseService<Lancamento, LancamentoFilter> {

  public constructor(http: HttpClient) {
    super(http, '/api/lancamento');
  }

  public findLancamentoTotal(filter: PageableFilter<LancamentoFilter>): Observable<any> {
    return null;
   // return this.http.post<>(`${this.apiBaseUrl}/findLancamentoTotal`, filter);
  }

}
