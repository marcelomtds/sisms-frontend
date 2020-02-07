import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilEnum } from '../../core/model/enum/perfil.enum';
import { AgendaFormComponent } from './form/agenda-form.component';

const routes: Routes = [
  {
    path: 'gerenciar',
    component: AgendaFormComponent,
    data: { role: PerfilEnum.ADMINISTRADOR },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaRoutingModule { }
