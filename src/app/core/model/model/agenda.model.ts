export interface Agenda {
    id?: number;
    diaSemanaId?: number;
    diaSemanaDescricao?: string;
    horarioInicio?: string;
    horarioFim?: string;
    pacienteId?: number;
    pacienteNomeCompleto?: string;
    tipoAtendimentoId?: number;
    tipoAtendimentoDescricao?: string;
    categoriaAtendimentoId?: number;
    categoriaAtendimentoDescricao?: string;
}
