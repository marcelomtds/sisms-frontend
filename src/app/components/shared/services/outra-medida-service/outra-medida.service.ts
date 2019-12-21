import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OutraMedida } from '../../model/model/outra-medida.model';
import { BaseService } from '../base-service/base.service';

@Injectable({
  providedIn: 'root'
})
export class OutraMedidaService extends BaseService<OutraMedida, {}> {

  public subject = new Subject<any>();

  constructor(http: HttpClient) {
    super(http, '/api/outraMedida');
  }

  setOutrasMedidas(): any {
    this.subject.next();
  }

  getOutrasMedidas(): Observable<any> {
    return this.subject.asObservable();
  }

}
