import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PacienteUsuarioFilter } from '../model/filter/paciente-usuario.filter';
import { Paciente } from '../model/model/paciente.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService extends BaseService<Paciente, PacienteUsuarioFilter> {

  public constructor(http: HttpClient) {
    super(http, '/api/paciente');
  }

}
