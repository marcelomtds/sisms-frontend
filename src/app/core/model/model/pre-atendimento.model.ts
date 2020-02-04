import { PreAtendimentoOutraMedida } from './pre-atendimento-outra-medida.model';

export class PreAtendimento {

    constructor(
        public id?: number,
        public data?: string,
        public pressaoArterial?: string,
        public peso?: number,
        public supraUmbilical?: number,
        public linhaUmbilical?: number,
        public infraUmbilical?: number,
        public observacao?: string,
        public preAtendimentoOutrasMedidas?: Array<PreAtendimentoOutraMedida>

    ) { }

}
