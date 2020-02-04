import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SismsCommonsModule } from '../sisms-commons.module';
import { AlterarSenhaRoutingModule } from './alterar-senha-routing.module';
import { AlterarSenhaComponent } from './alterar-senha.component';

@NgModule({
  declarations: [
    AlterarSenhaComponent
  ],
  imports: [
    CommonModule,
    AlterarSenhaRoutingModule,
    SharedModule,
    SismsCommonsModule
  ]
})
export class AlterarSenhaModule { }
