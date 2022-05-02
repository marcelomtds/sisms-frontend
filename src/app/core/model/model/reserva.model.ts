
export class Reserva {

    constructor(
        public id?: number,
        public pacienteNomeCompleto?: string,
        public telefone?: string,
        public categoriaAtendimentoId?: number,
        public categoriaAtendimentoDescricao?: string,
        public periodoId?: number,
        public periodoDescricao?: string,
        public horario?: string,
        public diaSemanaId?: number,
        public diaSemanaDescricao?: string,
        public observacao?: string
    ) { }

}
