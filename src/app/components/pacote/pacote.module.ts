import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SismsCommonsModule } from '../sisms-commons.module';
import { PacoteFormComponent } from './form/pacote-form.component';
import { PacoteListComponent } from './list/pacote-list.component';
import { PacoteRoutingModule } from './pacote-routing.module';

@NgModule({
  declarations: [
    PacoteListComponent,
    PacoteFormComponent
  ],
  imports: [
    CommonModule,
    SismsCommonsModule,
    PacoteRoutingModule,
    SharedModule
  ]
})
export class PacoteModule { }
