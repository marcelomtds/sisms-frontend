import { NgModule } from '@angular/core';
import { SismsCommonsModule } from '../sisms-commons.module';
import { AcessoNegadoRoutingModule } from './acesso-negado-routing.module';
import { AcessoNegadoComponent } from './acesso-negado.component';

@NgModule({
  declarations: [
    AcessoNegadoComponent
  ],
  imports: [
    AcessoNegadoRoutingModule,
    SismsCommonsModule
  ]
})
export class AcessoNegadoModule { }
