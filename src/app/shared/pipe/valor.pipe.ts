import { formatCurrency } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'valor'
})
export class ValorPipe implements PipeTransform {

    public transform(valor: number): string {
        return formatCurrency(valor || 0, 'pt-BR', 'R$');
    }
}
