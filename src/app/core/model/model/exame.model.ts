
export class Exame {

    constructor(
        public id?: number,
        public data?: string,
        public pacienteId?: number,
        public pacienteNomeCompleto?: string,
        public categoriaExameId?: number,
        public categoriaExameDescricao?: string,
        public imagens?: Array<string>,
        public observacao?: string
    ) { }

}
