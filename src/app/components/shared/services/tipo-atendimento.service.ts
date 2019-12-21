import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoAtendimento } from '../model/model/tipo-atendimento.model';
import { BaseService } from './base-service/base.service';

@Injectable({
  providedIn: 'root'
})
export class TipoAtendimentoService extends BaseService<TipoAtendimento, {}> {

  constructor(http: HttpClient) {
    super(http, '/api/tipoAtendimento');
  }
}
