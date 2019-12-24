import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Localidade } from '../model/model/localidade.model';
import { Response } from '../pageable/response.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class LocalidadeService extends BaseService<Localidade, {}> {

  public subject = new Subject<void>();

  constructor(http: HttpClient) {
    super(http, '/api/localidade');
  }

  public findByUfId(id: number): Observable<Response<Array<Localidade>>> {
    return this.http.get<Response<Array<Localidade>>>(`${this.apiBaseUrl}/findByUfId/${id}`);
  }

  public setLocalidade(): void {
    this.subject.next();
  }

  public getLocalidade(): Observable<void> {
    return this.subject.asObservable();
  }

}
