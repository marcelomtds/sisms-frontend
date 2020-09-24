import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { InputTrimModule } from 'ng2-trim-directive';
import { CarouselModule, ModalModule, TabsModule } from 'ngx-bootstrap';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { NgxUpperCaseDirectiveModule } from 'ngx-upper-case-directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InputTrimModule,
    NgxUpperCaseDirectiveModule,
    NgSelectModule,
    NgxSpinnerModule,
    NgxCurrencyModule,
    TabsModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    NgxMaskModule.forRoot(),
    PaginationModule.forRoot()
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InputTrimModule,
    NgxUpperCaseDirectiveModule,
    NgSelectModule,
    NgxSpinnerModule,
    NgxCurrencyModule,
    TabsModule,
    CarouselModule,
    ModalModule,
    NgxMaskModule,
    ToastrModule,
    PaginationModule
  ]
})
export class SismsCommonsModule { }
