import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'statusAtendimento'
})
export class StatusAtendimentoPipe implements PipeTransform {

    public transform(valor: boolean): string {
        return valor ? 'Em Aberto' : 'Encerrado';
    }
}
