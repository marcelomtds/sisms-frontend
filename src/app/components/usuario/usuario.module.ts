import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SismsCommonsModule } from '../sisms-commons.module';
import { UsuarioFormComponent } from './form/usuario-form.component';
import { UsuarioListComponent } from './list/usuario-list.component';
import { PreCadastroComponent } from './pre-cadastro/pre-cadastro.component';
import { UsuarioRoutingModule } from './usuario-routing.module';

@NgModule({
  declarations: [
    UsuarioListComponent,
    UsuarioFormComponent,
    PreCadastroComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    SismsCommonsModule,
    SharedModule
  ]
})
export class UsuarioModule { }
