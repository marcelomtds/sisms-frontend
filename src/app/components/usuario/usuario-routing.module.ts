import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilEnum } from '../../core/model/enum/perfil.enum';
import { UsuarioFormComponent } from './form/usuario-form.component';
import { UsuarioListComponent } from './list/usuario-list.component';


const routes: Routes = [
  {
    path: '',
    component: UsuarioListComponent,
    data: { role: PerfilEnum.ADMINISTRADOR }
  },
  {
    path: 'incluir',
    component: UsuarioFormComponent,
    data: { role: PerfilEnum.ADMINISTRADOR }
  },
  {
    path: 'alterar/:id',
    component: UsuarioFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
