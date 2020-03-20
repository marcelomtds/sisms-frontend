import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PerfilEnum } from '../../core/model/enum/perfil.enum';
import { UsuarioFormComponent } from './form/usuario-form.component';
import { UsuarioListComponent } from './list/usuario-list.component';
import { PreCadastroComponent } from './pre-cadastro/pre-cadastro.component';
import { UsuarioResolver } from './resolver/usuario.resolver';


const routes: Routes = [
  {
    path: '',
    component: UsuarioListComponent,
    data: {
      role: PerfilEnum.ADMINISTRADOR
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'incluir',
    component: PreCadastroComponent,
    data: {
      role: PerfilEnum.ADMINISTRADOR
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'alterar/:id',
    component: UsuarioFormComponent,
    resolve: {
      resolve: UsuarioResolver
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'completar-cadastro/:id',
    component: UsuarioFormComponent,
    resolve: {
      resolve: UsuarioResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [UsuarioResolver]
})
export class UsuarioRoutingModule { }
