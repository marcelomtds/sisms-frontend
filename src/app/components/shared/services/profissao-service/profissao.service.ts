import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PageableFilter } from '../../model/filter/filter.filter';
import { Profissao } from '../../model/model/profissao.model';
import { BaseService } from '../base-service/base.service';

@Injectable({
  providedIn: 'root'
})
export class ProfissaoService extends BaseService<Profissao, {}> {

  subject = new Subject();

  public constructor(http: HttpClient) {
    super(http, '/api/profissao');
  }

  public setProfissao(): void {
    this.subject.next();
  }

  public getProfissao(): Observable<any> {
    return this.subject.asObservable();
  }

}
