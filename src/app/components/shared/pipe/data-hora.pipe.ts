import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dataHora'
})
export class DataHoraPipe implements PipeTransform {

    transform(dataHora: any, option: number): any {
        if (dataHora) {
            if (option === 1) {
                return new Date(dataHora).toLocaleString().substring(0, 10);
            } else if (option === 2) {
                return new Date(dataHora).toLocaleString().substring(0, 16);
            }
        } else {
            return '-';
        }
    }
}