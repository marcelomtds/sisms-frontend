import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Perfil } from '../model/model/perfil.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilService extends BaseService<Perfil, {}> {

  constructor(http: HttpClient) {
    super(http, '/api/perfil');
  }

}
