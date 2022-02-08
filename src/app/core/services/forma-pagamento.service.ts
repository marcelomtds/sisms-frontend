import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormaPagamento } from '../model/model/forma-pagamento.model';
import { Response } from '../model/model/response.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class FormaPagamentoService extends BaseService<FormaPagamento, {}> {

  public constructor(http: HttpClient) {
    super(http, '/api/formaPagamento');
  }

  public findAllIgnoringIds(ids: number[]): Observable<Response<FormaPagamento[]>> {
    return this.findAll()
      .pipe(
        map(response => {
          return { ...response, result: response.result.filter(it => !ids.includes(it.id)) }
        })
      );
  }
}
