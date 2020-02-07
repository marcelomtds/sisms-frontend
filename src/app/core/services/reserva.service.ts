import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reserva } from '../model/model/reserva.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ReservaService extends BaseService<Reserva, {}> {

  public constructor(http: HttpClient) {
    super(http, '/api/reserva');
  }

}
