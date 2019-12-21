import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tipoLancamento'
})
export class TipoLancamentoPipe implements PipeTransform {

    transform(value: string): any {
        if (value) {
            switch (value.toUpperCase()) {
                case 'E': return 'Entrada';
                case 'S': return 'Saída';
                default: return '-';
            }
        }
    }

}
