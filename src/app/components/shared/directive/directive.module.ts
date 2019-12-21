import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { paDirective } from './pa.directive';
import { pesoDirective } from './peso.directive';
import { medidaDirective } from './medida.directive';
import { OnlyNumberDirectivie } from './onlynumber.directive';

@NgModule({
  imports: [
    CommonModule
  ], exports: [paDirective, pesoDirective, medidaDirective, OnlyNumberDirectivie],
  declarations: [paDirective, pesoDirective, medidaDirective, OnlyNumberDirectivie]
})
export class DirectiveModule { }
