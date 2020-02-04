export class PacienteUsuarioFilter {

    constructor(
        public nomeCompleto?: string,
        public cpf?: string,
        public ativo?: boolean,
        public sexoId?: number,
        public LocalidadeId?: number,
        public ufId?: number,
        public celular?: string,
        public celularRecado?: string,
        public residencial?: string,
        public comercial?: string
    ) { }

}
