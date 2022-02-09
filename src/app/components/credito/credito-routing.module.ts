import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditoFormComponent } from './form/credito-form.component';
import { CreditoListComponent } from './list/credito-list.component';


const routes: Routes = [
  {
    path: '',
    component: CreditoListComponent
  },
  {
    path: 'incluir',
    component: CreditoFormComponent
  },
  {
    path: 'alterar/:id',
    component: CreditoFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditoRoutingModule { }
