import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtendimentoFormComponent } from './components/atendimento/atendimento/form/atendimento-form.component';
import { AtendimentoListComponent } from './components/atendimento/atendimento/list/atendimento-list.component';
import { ControleCaixaFormComponent } from './components/controle-caixa/form/controle-caixa-form.component';
import { ControleCaixaListComponent } from './components/controle-caixa/list/controle-caixa-list.component';
import { HomeComponent } from './components/home/home.component';
import { PacienteFormComponent } from './components/paciente/form/paciente-form.component';
import { PacienteListComponent } from './components/paciente/list/paciente-list.component';
import { AuthGuard } from './components/security/auth.guard';
import { LoginComponent } from './components/security/login/login.component';
import { UsuarioFormComponent } from './components/usuario/form/usuario-form.component';
import { UsuarioListComponent } from './components/usuario/list/usuario-list.component';
import { AlterarSenhaComponent } from './components/usuario/password/alterar-senha.component';
import { AcessoNegadoComponent } from './components/acesso-negado/acesso-negado.component';
import { PacoteListComponent } from './components/pacote/list/pacote-list.component';
import { PacoteFormComponent } from './components/pacote/form/pacote-form.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'acesso-negado',
    component: AcessoNegadoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'usuario-list',
    component: UsuarioListComponent, data: { role: 'ROLE_ADMINISTRADOR' },
    canActivate: [AuthGuard]
  },
  {
    path: 'usuario-form',
    component: UsuarioFormComponent, data: { role: 'ROLE_ADMINISTRADOR' },
    canActivate: [AuthGuard]
  },
  {
    path: 'usuario-form/:id',
    component: UsuarioFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'paciente-list',
    component: PacienteListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'paciente-form',
    component: PacienteFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'paciente-form/:id',
    component: PacienteFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'atendimento-list/drenagem',
    data: {
      id: 1,
      descricao: 'Drenagem',
      rota: 'drenagem'
    },
    component: AtendimentoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'atendimento-form/drenagem',
    data: {
      id: 1,
      descricao: 'Drenagem',
      rota: 'drenagem'
    },
    component: AtendimentoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'atendimento-form/drenagem/:id',
    data: {
      id: 1,
      descricao: 'Drenagem',
      rota: 'drenagem'
    },
    component: AtendimentoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'atendimento-list/fisioterapia',
    data: {
      id: 2,
      descricao: 'Fisioterapia',
      rota: 'fisioterapia'
    },
    component: AtendimentoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'atendimento-form/fisioterapia',
    data: {
      id: 2,
      descricao: 'Fisioterapia',
      rota: 'fisioterapia'
    },
    component: AtendimentoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'atendimento-form/fisioterapia/:id',
    data: {
      id: 2,
      descricao: 'Fisioterapia',
      rota: 'fisioterapia'
    },
    component: AtendimentoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'atendimento-list/rpg',
    data: {
      id: 3,
      descricao: 'Reeducação Postural Global',
      rota: 'rpg'
    },
    component: AtendimentoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'atendimento-form/rpg',
    data: {
      id: 3,
      descricao: 'Reeducação Postural Global',
      rota: 'rpg'
    },
    component: AtendimentoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'atendimento-form/rpg/:id',
    data: {
      id: 3,
      descricao: 'Reeducação Postural Global',
      rota: 'rpg'
    },
    component: AtendimentoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'atendimento-list/pilates',
    data: {
      id: 4,
      descricao: 'Pilates',
      rota: 'pilates'
    },
    component: AtendimentoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'atendimento-form/pilates',
    data: {
      id: 3,
      descricao: 'Pilates',
      rota: 'pilates'
    },
    component: AtendimentoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'atendimento-form/pilates/:id',
    data: {
      id: 3,
      descricao: 'Pilates',
      rota: 'pilates'
    },
    component: AtendimentoFormComponent,
    canActivate: [AuthGuard]
  },


  {
    path: 'atendimento-list/massagem-relaxante',
    data: {
      id: 4,
      descricao: 'Massagem Relaxante',
      rota: 'massagem-relaxante'
    },
    component: AtendimentoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'atendimento-form/massagem-relaxante',
    data: {
      id: 4,
      descricao: 'Massagem Relaxante',
      rota: 'massagem-relaxante'
    },
    component: AtendimentoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'atendimento-form/massagem-relaxante/:id',
    data: {
      id: 4,
      descricao: 'Massagem Relaxante',
      rota: 'massagem-relaxante'
    },
    component: AtendimentoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pacote-list',
    component: PacoteListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pacote-form',
    component: PacoteFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pacote-form/:id',
    component: PacoteFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'controle-caixa-list',
    component: ControleCaixaListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'controle-caixa-form',
    component: ControleCaixaFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'controle-caixa-form/:id',
    component: ControleCaixaFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'alterar-senha',
    component: AlterarSenhaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
