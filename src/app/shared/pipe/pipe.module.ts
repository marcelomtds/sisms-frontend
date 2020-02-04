import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CepPipe } from './cep.pipe';
import { CpfPipe } from './cpf.pipe';
import { HorarioPipe } from './horario.pipe';
import { IdadePipe } from './idade.pipe';
import { TelefonePipe } from './telefone.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HorarioPipe,
    IdadePipe,
    CpfPipe,
    CepPipe,
    TelefonePipe
  ],
  exports: [
    HorarioPipe,
    IdadePipe,
    CpfPipe,
    CepPipe,
    TelefonePipe
  ]
})
export class PipeModule { }
