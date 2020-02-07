import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SismsCommonsModule } from '../sisms-commons.module';
import { ReservaFormComponent } from './form/reserva-form.component';
import { ReservaRoutingModule } from './reserva-routing.module';
import { ReservaListComponent } from './list/reserva-list.component';

@NgModule({
  declarations: [
    ReservaFormComponent,
    ReservaListComponent
  ],
  imports: [
    CommonModule,
    ReservaRoutingModule,
    SismsCommonsModule,
    SharedModule
  ]
})
export class ReservaModule { }
