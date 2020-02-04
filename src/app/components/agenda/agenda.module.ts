import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SismsCommonsModule } from '../sisms-commons.module';
import { AgendaRoutingModule } from './agenda-routing.module';
import { AgendaFormComponent } from './form/agenda-form.component';
import { AgendaResultadoComponent } from './result/agenda-resultado.component';

@NgModule({
  declarations: [
    AgendaFormComponent,
    AgendaResultadoComponent
  ],
  imports: [
    CommonModule,
    SismsCommonsModule,
    AgendaRoutingModule,
    SharedModule
  ]
})
export class AgendaModule { }
