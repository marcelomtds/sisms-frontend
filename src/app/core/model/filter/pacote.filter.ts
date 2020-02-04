export class PacoteFilter {

    constructor(
        public categoriaAtendimentoId?: number,
        public pacienteId?: number,
        public usuarioId?: number,
        public aberto?: boolean,
        public dataInicio?: string,
        public dataFim?: string
    ) { }

}
