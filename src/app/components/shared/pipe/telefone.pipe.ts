import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'telefone'
})
export class TelefonePipe implements PipeTransform {

    public transform(numero: string): string {
        if (numero && numero.length === 10) {
            return `(${numero.slice(0, 2)}) ${numero.slice(2, 6)}-${numero.slice(6, 10)}`;
        } else if (numero && numero.length === 11) {
            return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7, 11)}`;
        } else {
            return '-';
        }
    }
}

