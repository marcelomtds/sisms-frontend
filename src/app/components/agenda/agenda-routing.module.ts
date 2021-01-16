import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilEnum } from '../../core/model/enum/perfil.enum';
import { AgendaFormResolver } from './resolver/agenda-form.resolver';
import { AgendaFormComponent } from './form/agenda-form.component';

const routes: Routes = [
  {
    path: 'gerenciar',
    component: AgendaFormComponent,
    data: { role: PerfilEnum.ADMINISTRADOR },
    resolve: {
      resolve: AgendaFormResolver
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AgendaFormResolver
  ]
})
export class AgendaRoutingModule { }
