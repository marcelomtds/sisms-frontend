
export class Agenda {

    constructor(
        public id?: number,
        public diaSemanaId?: number,
        public diaSemanaDescricao?: string,
        public horarioInicio?: string,
        public horarioFim?: string,
        public pacienteId?: number,
        public pacienteNomeCompleto?: string,
        public tipoAtendimentoId?: number,
        public tipoAtendimentoDescricao?: string,
        public categoriaAtendimentoId?: number,
        public categoriaAtendimentoDescricao?: string
    ) { }

}
