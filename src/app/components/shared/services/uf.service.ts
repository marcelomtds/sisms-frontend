import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PageableFilter } from '../model/filter/filter.filter';
import { UF } from '../model/model/uf.model';
import { BaseService } from './base-service/base.service';

@Injectable({
  providedIn: 'root'
})
export class UfService extends BaseService<UF, {}> {

  public subject = new Subject();

  constructor(http: HttpClient) {
    super(http, '/api/uf');
  }

  public setUF(): void {
    this.subject.next();
  }

  public getUF(): Observable<any> {
    return this.subject.asObservable();
  }

}
