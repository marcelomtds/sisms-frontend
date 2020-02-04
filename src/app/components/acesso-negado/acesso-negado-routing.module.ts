import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcessoNegadoComponent } from './acesso-negado.component';


const routes: Routes = [
  {
    path: '',
    component: AcessoNegadoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcessoNegadoRoutingModule { }
