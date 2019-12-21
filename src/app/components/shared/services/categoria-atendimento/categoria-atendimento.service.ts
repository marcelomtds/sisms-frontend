import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriaAtendimento } from '../../model/model/categoriaAtendimento.model';
import { BaseService } from '../base-service/base.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaAtendimentoService extends BaseService<CategoriaAtendimento, {}> {

  constructor(http: HttpClient) {
    super(http, '/api/categoriaAtendimento');
  }


}
