
export class Lancamento {

    constructor(
        public id?: number,
        public data?: string,
        public Valor?: number,
        public observacao?: string,
        public usuarioId?: number,
        public usuarioDescricao?: string,
        public atendimentoId?: number,
        public pacoteId?: number,
        public categoriaLancamentoId?: number,
        public atendimentoPacienteNomeCompleto?: string,
        public categoriaLancamentoDescricao?: string,
        public formaPagamentoId?: number,
        public formaPagamentoDescricao?: string,
        public tipoLancamentoId?: number,
        public tipoLancamentoDescricao?: string
    ) { }

}
