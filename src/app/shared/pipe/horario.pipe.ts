import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'horario'
})
export class HorarioPipe implements PipeTransform {

    public transform(horario: string): string {
        return horario ? horario.slice(0, 5) : '-';
    }

}

