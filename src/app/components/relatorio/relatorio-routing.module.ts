import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RelatorioAtendimentoPeriodoComponent } from './atendimento-periodo/relatorio-atendimento-periodo.component';


const routes: Routes = [
  {
    path: 'atendimento-periodo',
    component: RelatorioAtendimentoPeriodoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatorioRoutingModule { }
