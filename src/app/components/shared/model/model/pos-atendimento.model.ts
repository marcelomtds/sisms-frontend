import { PosAtendimentoOutraMedida } from './pos-atendimento-outra-medida.model';

export class PosAtendimento {

    constructor(
        public id?: number,
        public data?: string,
        public pressaoArterial?: string,
        public peso?: number,
        public supraUmbilical?: number,
        public linhaUmbilical?: number,
        public infraUmbilical?: number,
        public observacao?: string,
        public posAtendimentoOutrasMedidas?: Array<PosAtendimentoOutraMedida>

    ) { }

}
