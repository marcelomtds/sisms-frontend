import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../model/model/response.model';
import { TipoLancamento } from '../model/model/tipo-lancamento.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TipoLancamentoService extends BaseService<TipoLancamento, {}> {

  constructor(http: HttpClient) {
    super(http, '/api/tipoLancamento');
  }

  public findAllIgnoringIds(ids: number[]): Observable<Response<TipoLancamento[]>> {
    return this.findAll()
      .pipe(
        map(response => {
          return { ...response, result: response.result.filter(it => !ids.includes(it.id)) }
        })
      );
  }

}
