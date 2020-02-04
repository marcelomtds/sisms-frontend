import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExameFormComponent } from './form/exame-form.component';
import { ExameListComponent } from './list/exame-list.component';


const routes: Routes = [
  {
    path: '',
    component: ExameListComponent
  },
  {
    path: 'incluir',
    component: ExameFormComponent
  },
  {
    path: 'alterar/:id',
    component: ExameFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExameRoutingModule { }
