import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CategoriaExame } from '../model/model/categoria-exame.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaExameService extends BaseService<CategoriaExame, {}> {

  public subject = new Subject<void>();

  public constructor(http: HttpClient) {
    super(http, '/api/categoriaExame');
  }

  public setCategoriaExame(): void {
    this.subject.next();
  }

  public getCategoriaExame(): Observable<void> {
    return this.subject.asObservable();
  }

}
