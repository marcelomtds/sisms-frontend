import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImagemAtendimento } from '../model/model/imagem-atendimento.model';
import { Response } from '../model/model/response.model';
import { BaseService } from './base-service/base.service';

@Injectable({
  providedIn: 'root'
})
export class ImagemAtendimentoService extends BaseService<ImagemAtendimento, {}> {

  constructor(http: HttpClient) {
    super(http, '/api/imagemAtendimento');
  }

  public findByAtendimento(id: number): Observable<Response<Array<ImagemAtendimento>>> {
    return this.http.get<Response<Array<ImagemAtendimento>>>(`${this.apiBaseUrl}/findByAtendimento/${id}`);
  }

}
