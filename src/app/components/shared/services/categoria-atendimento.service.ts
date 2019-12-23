import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriaAtendimento } from '../model/model/categoria-atendimento.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaAtendimentoService extends BaseService<CategoriaAtendimento, {}> {

  public constructor(http: HttpClient) {
    super(http, '/api/categoriaAtendimento');
  }


}
