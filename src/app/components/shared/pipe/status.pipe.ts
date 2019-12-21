import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'status'
})
export class StatusPipe implements PipeTransform {

    transform(status: string): any {
        if (status) {
            switch (status.toUpperCase()) {
                case 'A': return 'Em Aberto';
                case 'E': return 'Encerrado';
                default: return '-';
            }
        }
    }

}
