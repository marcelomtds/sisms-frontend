import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SismsCommonsModule } from '../sisms-commons.module';
import { PacienteFormComponent } from './form/paciente-form.component';
import { PacienteListComponent } from './list/paciente-list.component';
import { PacienteRoutingModule } from './paciente-routing.module';

@NgModule({
  declarations: [
    PacienteListComponent,
    PacienteFormComponent
  ],
  imports: [
    CommonModule,
    SismsCommonsModule,
    SharedModule,
    PacienteRoutingModule
  ]
})
export class PacienteModule { }
