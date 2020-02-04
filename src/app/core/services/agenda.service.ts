import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agenda } from '../model/model/agenda.model';
import { Response } from '../model/model/response.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AgendaService extends BaseService<Agenda, {}> {

  public constructor(http: HttpClient) {
    super(http, '/api/agenda');
  }

  public findAllByWeekDay(): Observable<Response<Array<Agenda>>> {
    return this.http.get<Response<Array<Agenda>>>(`${this.apiBaseUrl}/findAllByWeekDay`);
  }

}
