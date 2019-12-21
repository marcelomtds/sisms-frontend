import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cep'
})
export class CepPipe implements PipeTransform {

    public transform(cep: string): string {
        if (cep && cep.length === 8) {
            return `${cep.slice(0, 2)}.${cep.slice(2, 5)}-${cep.slice(5, 8)}`;
        } else {
            return '-';
        }
    }
}
