import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SismsCommonsModule } from '../sisms-commons.module';
import { ControleCaixaRoutingModule } from './controle-caixa-routing.module';
import { ControleCaixaSaidaComponent } from './form/controle-caixa-saida.component';
import { ControleCaixaListComponent } from './list/controle-caixa-list.component';

@NgModule({
  declarations: [
    ControleCaixaSaidaComponent,
    ControleCaixaListComponent
  ],
  imports: [
    CommonModule,
    ControleCaixaRoutingModule,
    SharedModule,
    SismsCommonsModule
  ]
})
export class ControleCaixaModule { }
