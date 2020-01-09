import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Agenda } from '../../shared/model/model/agenda.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AgendaService extends BaseService<Agenda, {}> {

  public constructor(http: HttpClient) {
    super(http, '/api/agenda');
  }
}
