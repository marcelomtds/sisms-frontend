import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtendimentoFormComponent } from './form/atendimento-form.component';
import { AtendimentoListComponent } from './list/atendimento-list.component';
import { AtendimentoResolver } from './resolver/atendimento.resolver';

const routes: Routes = [
  {
    path: 'drenagem',
    component: AtendimentoListComponent,
    data: {
      id: 1,
      descricao: 'Drenagem Linfática',
      rota: 'drenagem'
    }
  },
  {
    path: 'drenagem/incluir',
    data: {
      id: 1,
      descricao: 'Drenagem Linfática',
      rota: 'drenagem'
    },
    component: AtendimentoFormComponent
  },
  {
    path: 'drenagem/alterar/:id',
    data: {
      id: 1,
      descricao: 'Drenagem Linfática',
      rota: 'drenagem'
    },
    resolve: {
      resolve: AtendimentoResolver
    },
    component: AtendimentoFormComponent
  },
  {
    path: 'fisioterapia',
    data: {
      id: 2,
      descricao: 'Fisioterapia',
      rota: 'fisioterapia'
    },
    component: AtendimentoListComponent
  },
  {
    path: 'fisioterapia/incluir',
    data: {
      id: 2,
      descricao: 'Fisioterapia',
      rota: 'fisioterapia'
    },
    component: AtendimentoFormComponent
  },
  {
    path: 'fisioterapia/alterar/:id',
    data: {
      id: 2,
      descricao: 'Fisioterapia',
      rota: 'fisioterapia'
    },
    resolve: {
      resolve: AtendimentoResolver
    },
    component: AtendimentoFormComponent
  },
  {
    path: 'rpg',
    data: {
      id: 3,
      descricao: 'Reeducação Postural Global',
      rota: 'rpg'
    },
    component: AtendimentoListComponent
  },
  {
    path: 'rpg/incluir',
    data: {
      id: 3,
      descricao: 'Reeducação Postural Global',
      rota: 'rpg'
    },
    component: AtendimentoFormComponent
  },
  {
    path: 'rpg/alterar/:id',
    data: {
      id: 3,
      descricao: 'Reeducação Postural Global',
      rota: 'rpg'
    },
    resolve: {
      resolve: AtendimentoResolver
    },
    component: AtendimentoFormComponent
  },
  {
    path: 'pilates',
    data: {
      id: 4,
      descricao: 'Pilates',
      rota: 'pilates'
    },
    component: AtendimentoListComponent
  },
  {
    path: 'pilates/incluir',
    data: {
      id: 4,
      descricao: 'Pilates',
      rota: 'pilates'
    },
    component: AtendimentoFormComponent
  },
  {
    path: 'pilates/alterar/:id',
    data: {
      id: 4,
      descricao: 'Pilates',
      rota: 'pilates'
    },
    resolve: {
      resolve: AtendimentoResolver
    },
    component: AtendimentoFormComponent
  },
  {
    path: 'massagem-relaxante',
    data: {
      id: 5,
      descricao: 'Massagem Relaxante',
      rota: 'massagem-relaxante'
    },
    component: AtendimentoListComponent
  },
  {
    path: 'massagem-relaxante/incluir',
    data: {
      id: 5,
      descricao: 'Massagem Relaxante',
      rota: 'massagem-relaxante'
    },
    component: AtendimentoFormComponent
  },
  {
    path: 'massagem-relaxante/alterar/:id',
    data: {
      id: 5,
      descricao: 'Massagem Relaxante',
      rota: 'massagem-relaxante'
    },
    resolve: {
      resolve: AtendimentoResolver
    },
    component: AtendimentoFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AtendimentoResolver]
})
export class AtendimentoRoutingModule { }
