import { AnexoExame } from './anexo-exame.model';

export class Exame {

    constructor(
        public id?: number,
        public data?: string,
        public pacienteId?: number,
        public pacienteNomeCompleto?: string,
        public categoriaExameId?: number,
        public categoriaExameDescricao?: string,
        public anexos?: Array<AnexoExame>,
        public observacao?: string
    ) { }

}
