import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservaFormComponent } from './form/reserva-form.component';
import { ReservaListComponent } from './list/reserva-list.component';

const routes: Routes = [
  {
    path: '',
    component: ReservaListComponent
  },
  {
    path: 'incluir',
    component: ReservaFormComponent
  },
  {
    path: 'alterar/:id',
    component: ReservaFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservaRoutingModule { }
