import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacienteFormComponent } from './form/paciente-form.component';
import { PacienteListComponent } from './list/paciente-list.component';


const routes: Routes = [
  {
    path: '',
    component: PacienteListComponent
  },
  {
    path: 'incluir',
    component: PacienteFormComponent
  },
  {
    path: 'alterar/:id',
    component: PacienteFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteRoutingModule { }
