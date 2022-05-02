
export class Usuario {

    constructor(
        public id?: number,
        public senha?: string,
        public senhaConfirmacao?: string,
        public nomeCompleto?: string,
        public dataNascimento?: string,
        public dataCadastro?: string,
        public rg?: string,
        public cpf?: string,
        public ativo?: boolean,
        public imagem?: string,
        public sexoId?: number,
        public sexoDescricao?: string,
        public profissaoId?: number,
        public profissaoDescricao?: string,
        public perfilId?: number,
        public perfilDescricao?: string,
        public perfilRole?: string,
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
        public contatoTelefone1?: string,
        public contatoTelefone2?: string,
        public contatoTelefone3?: string,
        public contatoTelefone4?: string,
        public contatoEmail?: string,
        public cadastroCompleto?: boolean
        ) { }

}
