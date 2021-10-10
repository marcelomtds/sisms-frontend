export class LancamentoFilter {

    constructor(
        public atendimentoId?: number,
        public pacoteId?: number,
        public categoriaAtendimentoId?: number,
        public formaPagamentoId?: number,
        public tipoLancamentoId?: number,
        public tipoAtendimentoId?: number,
        public pacienteId?: number,
        public usuarioId?: number,
        public categoriaLancamentoId?: number,
        public dataInicio?: string,
        public dataFim?: string,
        public credito?: boolean
    ) { }

}
