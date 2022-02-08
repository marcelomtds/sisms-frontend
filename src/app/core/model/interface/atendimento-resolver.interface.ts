import { Observable } from "rxjs";
import { Paciente } from "../model/paciente.model";
import { Response } from "../model/response.model";
import { TipoAtendimento } from "../model/tipo-atendimento.model";
import { Usuario } from "../model/usuario.model";

export interface IAtendimentoListResolver {
    pacientes: Observable<Response<Paciente[]>>;
    tiposAtendimento: Observable<Response<TipoAtendimento[]>>;
    usuarios?: Observable<Response<Usuario[]>>;
}