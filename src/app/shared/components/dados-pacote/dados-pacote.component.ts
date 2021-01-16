import { formatCurrency } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pacote } from 'src/app/core/model/model/pacote.model';

@Component({
  selector: 'app-dados-pacote',
  templateUrl: './dados-pacote.component.html'
})
export class DadosPacoteComponent implements OnInit {

  @Input() pacote: Pacote;
  @Input() showButtonCreatePackage = false;
  @Output() onOpenModalCriarPacote = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  getStyle(): any {
    return {
      color: this.pacote.totalPago < this.pacote.valor ? 'red' : 'green'
    };
  }

  clickedCriarPacoteNovo(): void {
    this.onOpenModalCriarPacote.emit(false);
  }

}
