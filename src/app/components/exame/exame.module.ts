import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SismsCommonsModule } from '../sisms-commons.module';
import { ExameRoutingModule } from './exame-routing.module';
import { ExameFormComponent } from './form/exame-form.component';
import { ExameListComponent } from './list/exame-list.component';

@NgModule({
  declarations: [
    ExameListComponent,
    ExameFormComponent
  ],
  imports: [
    CommonModule,
    SismsCommonsModule,
    ExameRoutingModule,
    SharedModule
  ]
})
export class ExameModule { }
