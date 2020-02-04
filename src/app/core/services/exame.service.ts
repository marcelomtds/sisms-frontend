import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExameFilter } from '../model/filter/exame.filter';
import { Exame } from '../model/model/exame.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ExameService extends BaseService<Exame, ExameFilter> {

  public constructor(http: HttpClient) {
    super(http, '/api/exame');
  }

}
