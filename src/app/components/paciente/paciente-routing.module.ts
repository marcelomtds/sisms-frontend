import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacienteFormComponent } from './form/paciente-form.component';
import { PacienteListComponent } from './list/paciente-list.component';
import { PacienteFormResolver } from './resolver/paciente-form.resolver';

const routes: Routes = [
  {
    path: '',
    component: PacienteListComponent
  },
  {
    path: 'incluir',
    component: PacienteFormComponent,
    resolve: {
      resolve: PacienteFormResolver
    }
  },
  {
    path: 'alterar/:id',
    component: PacienteFormComponent,
    resolve: {
      resolve: PacienteFormResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [PacienteFormResolver]
})
export class PacienteRoutingModule { }
