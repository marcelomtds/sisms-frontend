export class AtendimentoFilter {

    constructor(
        public tipoAtendimentoId?: number,
        public pacienteId?: number,
        public pacienteAtivo?: boolean,
        public usuarioId?: number,
        public usuarioAtivo?: boolean,
        public preAtendimentoData?: string,
        public posAtendimentoData?: string,
        public aberto?: boolean,
        public categoriaAtendimentoId?: number
    ) { }

}
