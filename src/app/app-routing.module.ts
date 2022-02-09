import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    redirectTo: 'home'
  },
  {
    path: 'home',
    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'usuario',
    loadChildren: () => import('./components/usuario/usuario.module').then(m => m.UsuarioModule)
  },
  {
    path: 'acesso-negado',
    loadChildren: () => import('./components/acesso-negado/acesso-negado.module').then(m => m.AcessoNegadoModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'agenda',
    loadChildren: () => import('./components/agenda/agenda.module').then(m => m.AgendaModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'paciente',
    loadChildren: () => import('./components/paciente/paciente.module').then(m => m.PacienteModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'exame',
    loadChildren: () => import('./components/exame/exame.module').then(m => m.ExameModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pacote',
    loadChildren: () => import('./components/pacote/pacote.module').then(m => m.PacoteModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'atendimento',
    loadChildren: () => import('./components/atendimento/atendimento.module').then(m => m.AtendimentoModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'controle-caixa',
    loadChildren: () => import('./components/controle-caixa/controle-caixa.module').then(m => m.ControleCaixaModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'alterar-senha',
    loadChildren: () => import('./components/password/alterar-senha.module').then(m => m.AlterarSenhaModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reserva',
    loadChildren: () => import('./components/reserva/reserva.module').then(m => m.ReservaModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'credito',
    loadChildren: () => import('./components/credito/credito.module').then(m => m.CreditoModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    canActivate: [AuthGuard],
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES, { scrollPositionRestoration: 'enabled', useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
