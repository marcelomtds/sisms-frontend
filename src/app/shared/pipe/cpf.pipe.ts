import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cpf'
})
export class CpfPipe implements PipeTransform {

    public transform(cpf: string): string {
        if (cpf && cpf.length === 11) {
            return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
        } else {
            return '-';
        }
    }
}
