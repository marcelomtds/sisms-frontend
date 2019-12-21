import { Contato } from './contato.model';
import { Endereco } from './endereco.model';
import { Profissao } from './profissao.model';
import { Sexo } from './sexo.model';

export class Paciente {

    constructor(
        public id?: number,
        public nomeCompleto?: string,
        public dataNascimento?: string,
        public rg?: string,
        public cpf?: string,
        public ativo?: boolean,
        public sexo?: Sexo,
        public profissao?: Profissao,
        public endereco?: Endereco,
        public contato?: Contato
    ) { }

}
