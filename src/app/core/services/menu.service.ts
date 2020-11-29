import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Menu } from '../model/model/menu.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends BaseService<Menu, {}> {

  public subject = new Subject<void>();

  constructor(http: HttpClient) {
    super(http, '/api/menu');
  }

  public setMenu(): void {
    this.subject.next();
  }

  public getMenu(): Observable<void> {
    return this.subject.asObservable();
  }
}
