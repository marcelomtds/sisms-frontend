import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CepPipe } from './cep.pipe';
import { CpfPipe } from './cpf.pipe';
import { HorarioPipe } from './horario.pipe';
import { IdadePipe } from './idade.pipe';
import { TelefonePipe } from './telefone.pipe';
import { ValorPipe } from './valor.pipe';
import { StatusAtendimentoPipe } from './valor.pipe copy';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HorarioPipe,
    IdadePipe,
    CpfPipe,
    CepPipe,
    TelefonePipe,
    ValorPipe,
    StatusAtendimentoPipe
  ],
  exports: [
    HorarioPipe,
    IdadePipe,
    CpfPipe,
    CepPipe,
    TelefonePipe,
    ValorPipe,
    StatusAtendimentoPipe
  ]
})
export class PipeModule { }
