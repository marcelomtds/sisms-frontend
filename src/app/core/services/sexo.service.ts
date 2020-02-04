import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sexo } from '../model/model/sexo.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SexoService extends BaseService<Sexo, {}> {

  public constructor(http: HttpClient) {
    super(http, '/api/sexo');
  }

}
