import { Component, OnInit } from '@angular/core';
import { Paciente } from '../shared/model/model/paciente.model';
import { PacienteService } from '../shared/services/paciente.service';
import Util from '../shared/util/util';
import { UsuarioService } from '../shared/services/usuario.service';
import { Usuario } from '../shared/model/model/usuario.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public pacientes = new Array<Paciente>();
  public usuarios = new Array<Usuario>();
  public mes: string;

  public constructor(
    private pacienteService: PacienteService,
    private usuarioService: UsuarioService
  ) { }

  public ngOnInit(): void {
    this.findAllBirthdaysMonth();
    this.getMes();
  }

  private findAllBirthdaysMonth(): void {
    this.pacienteService.findAllBirthdaysMonth().subscribe(response => {
      this.pacientes = response.result;
    });
    this.usuarioService.findAllBirthdaysMonth().subscribe(response => {
      this.usuarios = response.result;
    });
  }

  private getMes(): void {
    this.mes = Util.mesesAno(new Date().getMonth() + 1);
  }

}
