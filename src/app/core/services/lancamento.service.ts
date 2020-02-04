import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PageableFilter } from '../model/filter/filter.filter';
import { LancamentoFilter } from '../model/filter/lancamento.filter';
import { LancamentoTotal } from '../model/model/lancamento-total.model';
import { Lancamento } from '../model/model/lancamento.model';
import { Response } from '../model/model/response.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService extends BaseService<Lancamento, LancamentoFilter> {

  public subject = new Subject<void>();

  public constructor(http: HttpClient) {
    super(http, '/api/lancamento');
  }

  public setLancamento(): void {
    this.subject.next();
  }

  public getLancamento(): Observable<void> {
    return this.subject.asObservable();
  }

  public findTotalByFilter(filter: PageableFilter<LancamentoFilter>): Observable<Response<LancamentoTotal>> {
    return this.http.post<Response<LancamentoTotal>>(`${this.apiBaseUrl}/findTotalByFilter`, filter);
  }

}
