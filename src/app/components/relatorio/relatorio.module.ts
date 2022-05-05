import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SismsCommonsModule } from '../sisms-commons.module';
import { SharedModule } from './../../shared/shared.module';
import { RelatorioAtendimentoPeriodoComponent } from './atendimento-periodo/relatorio-atendimento-periodo.component';
import { RelatorioRoutingModule } from './relatorio-routing.module';


@NgModule({
  declarations: [
    RelatorioAtendimentoPeriodoComponent
  ],
  imports: [
    CommonModule,
    SismsCommonsModule,
    RelatorioRoutingModule,
    SharedModule,
    NgxChartsModule
  ]
})
export class RelatorioModule { }
