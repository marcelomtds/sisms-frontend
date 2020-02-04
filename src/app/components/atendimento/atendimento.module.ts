import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SismsCommonsModule } from '../sisms-commons.module';
import { AtendimentoRoutingModule } from './atendimento-routing.module';
import { AtendimentoFormComponent } from './form/atendimento-form.component';
import { AtendimentoListComponent } from './list/atendimento-list.component';

@NgModule({
  declarations: [
    AtendimentoListComponent,
    AtendimentoFormComponent
  ],
  imports: [
    CommonModule,
    AtendimentoRoutingModule,
    SismsCommonsModule,
    SharedModule
  ]
})
export class AtendimentoModule { }
