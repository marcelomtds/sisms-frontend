import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormaPagamento } from '../model/model/forma-pagamento.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class FormaPagamentoService extends BaseService<FormaPagamento, {}> {

  public constructor(http: HttpClient) {
    super(http, '/api/formaPagamento');
  }
}
