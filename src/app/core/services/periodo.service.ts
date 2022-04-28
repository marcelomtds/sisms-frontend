import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Periodo } from '../model/model/periodo.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService extends BaseService<Periodo, {}> {

  public constructor(http: HttpClient) {
    super(http, '/api/periodo');
  }
}
