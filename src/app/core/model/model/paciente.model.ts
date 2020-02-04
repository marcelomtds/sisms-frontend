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
        public sexoId?: number,
        public sexoDescricao?: string,
        public profissaoId?: number,
        public profissaoDescricao?: string,
        public enderecoId?: number,
        public enderecoCep?: string,
        public enderecoLogradouro?: string,
        public enderecoNumero?: string,
        public enderecoComplemento?: string,
        public enderecoBairro?: string,
        public enderecoPontoReferencia?: string,
        public enderecoLocalidadeId?: number,
        public enderecoLocalidadeDescricao?: string,
        public enderecoLocalidadeUFId?: number,
        public enderecoLocalidadeUFDescricao?: string,
        public contatoId?: number,
        public contatoCelular?: string,
        public contatoCelularRecado?: string,
        public contatoResidencial?: string,
        public contatoComercial?: string,
        public contatoEmail?: string
    ) { }

}
