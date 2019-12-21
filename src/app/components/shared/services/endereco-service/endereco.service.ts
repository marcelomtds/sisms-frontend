import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPoint } from '../../endpoint/endpoint';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {

  constructor(private http: HttpClient) { }

  findByCep(cep: any) {
    return this.http.get(`${EndPoint.URL_VIA_CEP}/${cep}/json`);
  }
}
