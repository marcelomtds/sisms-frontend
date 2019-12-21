
export class Pacote {

    constructor(
        public id?: number,
        public dataCriacao?: string,
        public valor?: number,
        public pacienteId?: number,
        public pacienteNomeCompleto?: number,
        public usuarioId?: number,
        public usuarioNomeCompleto?: string,
        public categoriaAtendimentoId?: number,
        public categoriaAtendimentoDescricao?: string,
        public numero?: number,
        public aberto?: boolean,
        public quantidadeAtendimentos?: number,
    ) { }

}
