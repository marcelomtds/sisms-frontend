import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DiaSemana } from '../model/model/dia-semana.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class DiaSemanaService extends BaseService<DiaSemana, {}> {

  public constructor(http: HttpClient) {
    super(http, '/api/diaSemana');
  }
}
