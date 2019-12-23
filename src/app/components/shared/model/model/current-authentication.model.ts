import { Usuario } from './usuario.model';

export class CurrentAuthentication {

    constructor(
        public token?: string,
        public usuario?: Usuario
    ) { }

}
