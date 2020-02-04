import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CategoriaLancamento } from '../model/model/categoria-lancamento.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaLancamentoService extends BaseService<CategoriaLancamento, {}> {

  public subject = new Subject<void>();

  public constructor(http: HttpClient) {
    super(http, '/api/categoriaLancamento');
  }

  public setCategoriaLancamento(): void {
    this.subject.next();
  }

  public getCategoriaLancamento(): Observable<void> {
    return this.subject.asObservable();
  }

}