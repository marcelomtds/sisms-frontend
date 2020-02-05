import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SismsCommonsModule } from '../sisms-commons.module';
import { ControleCaixaRoutingModule } from './controle-caixa-routing.module';
import { ControleCaixaEntradaPacoteComponent } from './form/entrada/pacote/controle-caixa-entrada-pacote.component';
import { ControleCaixaEntradaSessaoComponent } from './form/entrada/sessao/controle-caixa-entrada-sessao.component';
import { ControleCaixaSaidaComponent } from './form/saida/controle-caixa-saida.component';
import { ControleCaixaListComponent } from './list/controle-caixa-list.component';

@NgModule({
  declarations: [
    ControleCaixaSaidaComponent,
    ControleCaixaListComponent,
    ControleCaixaEntradaPacoteComponent,
    ControleCaixaEntradaSessaoComponent
  ],
  imports: [
    CommonModule,
    ControleCaixaRoutingModule,
    SharedModule,
    SismsCommonsModule
  ]
})
export class ControleCaixaModule { }
