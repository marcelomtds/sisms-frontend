import { RelatorioAtendimentoItemSerie } from "./relatorio-atendimento-item-serie.interface";

export interface RelatorioAtendimentoSerie {
    name: string;
    series: RelatorioAtendimentoItemSerie[];
}
