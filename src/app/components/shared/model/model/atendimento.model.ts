import { ImagemAtendimento } from './imagem-atendimento.model';
import { PosAtendimentoOutraMedida } from './pos-atendimento-outra-medida.model';
import { PreAtendimentoOutraMedida } from './pre-atendimento-outra-medida.model';

export class Atendimento {

    constructor(
        public id?: number,
        public pacoteId?: number,
        public pacoteNumero?: number,
        public usuarioId?: number,
        public usuarioNomeCompleto?: string,
        public pacienteId?: number,
        public pacienteNomeCompleto?: string,
        public preAtendimentoId?: number,
        public preAtendimentoData?: string,
        public preAtendimentoPressaoArterial?: number,
        public preAtendimentoPeso?: number,
        public preAtendimentoSupraUmbilical?: number,
        public preAtendimentoLinhaUmbilical?: number,
        public preAtendimentoInfraUmbilical?: number,
        public preAtendimentoObservacao?: string,
        public preAtendimentoOutrasMedidas?: Array<PreAtendimentoOutraMedida>,
        public posAtendimentoId?: number,
        public posAtendimentoData?: string,
        public posAtendimentoPressaoArterial?: string,
        public posAtendimentoPeso?: number,
        public posAtendimentoSupraUmbilical?: number,
        public posAtendimentoLinhaUmbilical?: number,
        public posAtendimentoInfraUmbilical?: number,
        public posAtendimentoObservacao?: string,
        public posAtendimentoOutrasMedidas?: Array<PosAtendimentoOutraMedida>,
        public categoriaAtendimentoId?: number,
        public categoriaAtendimentoDescricao?: string,
        public tipoAtendimentoId?: number,
        public tipoAtendimentoDescricao?: string,
        public imagens?: Array<ImagemAtendimento>,
        public numero?: number,
        public aberto?: boolean,
        public conduta?: string,
    ) { }

}
