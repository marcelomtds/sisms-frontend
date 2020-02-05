import { Localidade } from './localidade.model';

export class Endereco {

    constructor(
        public id?: number,
        public cep?: string,
        public logradouro?: string,
        public numero?: string,
        public complemento?: string,
        public bairro?: string,
        public pontoReferencia?: string,
        public localidade?: Localidade
    ) { }

}
