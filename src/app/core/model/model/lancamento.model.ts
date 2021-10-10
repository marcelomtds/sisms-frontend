
export class Lancamento {

    constructor(
        public id?: number,
        public data?: string,
        public valor?: number,
        public observacao?: string,
        public usuarioId?: number,
        public usuarioNomeCompleto?: string,
        public atendimentoId?: number,
        public atendimentoPacienteNomeCompleto?: string,
        public pacotePacienteNomeCompleto?: string,
        public pacoteId?: number,
        public categoriaLancamentoId?: number,
        public categoriaLancamentoDescricao?: string,
        public formaPagamentoId?: number,
        public formaPagamentoDescricao?: string,
        public tipoLancamentoId?: number,
        public tipoLancamentoDescricao?: string,
        public tipoAtendimentoId?: number,
        public tipoAtendimentoDescricao?: string,
        public pacienteId?: number,
        public pacienteNomeCompleto?: string,
        public atendimentoCategoriaAtendimentoDescricao?: string,
        public pacoteCategoriaAtendimentoDescricao?: string,
        public credito?: boolean
    ) { }

}
