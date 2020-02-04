import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OutraMedida } from '../model/model/outra-medida.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class OutraMedidaService extends BaseService<OutraMedida, {}> {

  public subject = new Subject<void>();

  constructor(http: HttpClient) {
    super(http, '/api/outraMedida');
  }

  public setOutrasMedidas(): void {
    this.subject.next();
  }

  public getOutrasMedidas(): Observable<void> {
    return this.subject.asObservable();
  }

}
