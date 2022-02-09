import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SismsCommonsModule } from '../sisms-commons.module';
import { CreditoRoutingModule } from './credito-routing.module';
import { CreditoFormComponent } from './form/credito-form.component';
import { CreditoListComponent } from './list/credito-list.component';

@NgModule({
  declarations: [CreditoFormComponent, CreditoListComponent],
  imports: [
    CommonModule,
    CreditoRoutingModule,
    SismsCommonsModule,
    SharedModule
  ]
})
export class CreditoModule { }
