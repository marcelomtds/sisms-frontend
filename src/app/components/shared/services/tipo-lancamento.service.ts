import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoLancamento } from '../model/model/tipo-lancamento.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TipoLancamentoService extends BaseService<TipoLancamento, {}> {

  constructor(http: HttpClient) {
    super(http, '/api/tipoLancamento');
  }

}
