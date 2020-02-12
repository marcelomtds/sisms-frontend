import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilEnum } from 'src/app/core/model/enum/perfil.enum';
import { ControleCaixaSaidaComponent } from './form/controle-caixa-saida.component';
import { ControleCaixaListComponent } from './list/controle-caixa-list.component';

const routes: Routes = [
  {
    path: '',
    component: ControleCaixaListComponent,
    data: { role: PerfilEnum.ADMINISTRADOR },
  },
  {
    path: 'saida',
    component: ControleCaixaSaidaComponent,
    data: { role: PerfilEnum.ADMINISTRADOR },
  },
  {
    path: 'saida/alterar/:id',
    component: ControleCaixaSaidaComponent,
    data: { role: PerfilEnum.ADMINISTRADOR },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControleCaixaRoutingModule { }
