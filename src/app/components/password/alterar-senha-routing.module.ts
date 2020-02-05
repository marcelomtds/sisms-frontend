import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlterarSenhaComponent } from './alterar-senha.component';

const routes: Routes = [
  {
    path: '',
    component: AlterarSenhaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlterarSenhaRoutingModule { }
