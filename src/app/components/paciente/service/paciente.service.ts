import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PacienteUsuarioFilter } from '../../shared/model/filter/paciente-usuario.filter';
import { Paciente } from '../../shared/model/model/paciente.model';
import { BaseService } from '../../shared/services/base-service/base.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService extends BaseService<Paciente, PacienteUsuarioFilter> {

  public constructor(http: HttpClient) {
    super(http, '/api/paciente');
  }

}
