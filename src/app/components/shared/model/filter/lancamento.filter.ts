export class LancamentoFilter {

    constructor(
        public atendimentoId?: number,
        public pacoteId?: number,
        public categoriaLancamentoId?: number,
        public formaPagamentoId?: number,
        public tipoLancamentoId?: number,
        public tipoAtendimentoId?: number,
        public pacienteId?: number,
        public dataInicio?: string,
        public dataFim?: string
    ) { }

}
