import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UF } from '../model/model/uf.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UfService extends BaseService<UF, {}> {

  public subject = new Subject<void>();

  public constructor(http: HttpClient) {
    super(http, '/api/uf');
  }

  public setUF(): void {
    this.subject.next();
  }

  public getUF(): Observable<void> {
    return this.subject.asObservable();
  }

}
