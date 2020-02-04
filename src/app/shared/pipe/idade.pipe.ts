import { Pipe, PipeTransform } from '@angular/core';
import Util from '../util/util';

@Pipe({
    name: 'idade'
})
export class IdadePipe implements PipeTransform {

    transform(date: Date): string {
        const mes = Util.calcularIdadeMes(date);
        if (mes < 12) {
            return mes > 1 ? `${mes} meses` : `${mes} mês`;
        } else {
            const ano = Util.calcularIdadeAno(date);
            return ano > 1 ? `${ano} anos` : `${ano} ano`;
        }
    }

}
