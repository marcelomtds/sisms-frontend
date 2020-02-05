import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacoteFormComponent } from './form/pacote-form.component';
import { PacoteListComponent } from './list/pacote-list.component';


const routes: Routes = [
  {
    path: '',
    component: PacoteListComponent
  },
  {
    path: 'incluir',
    component: PacoteFormComponent
  },
  {
    path: 'alterar/:id',
    component: PacoteFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacoteRoutingModule { }
