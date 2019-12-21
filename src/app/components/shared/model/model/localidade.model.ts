import { UF } from './uf.model';

export class Localidade {

    constructor(
        public id?: number,
        public descricao?: string,
        public uf?: UF
    ) { }

}
