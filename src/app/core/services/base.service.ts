import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageableFilter } from '../model/filter/filter.filter';
import Page from '../model/model/page.model';
import { Response } from '../model/model/response.model';

export abstract class BaseService<M, F> {

  protected apiBaseUrl: string;
  protected http: HttpClient;

  public constructor(http: HttpClient, url: string) {
    this.http = http;
    this.apiBaseUrl = environment.apiBaseUrl + url;
  }

  public findAll(): Observable<Response<M[]>> {
    return this.http.get<Response<M[]>>(this.apiBaseUrl);
  }

  public findAllActive(): Observable<Response<M[]>> {
    return this.http.get<Response<M[]>>(`${this.apiBaseUrl}/findAllActive`);
  }

  public findById(id: number): Observable<Response<M>> {
    return this.http.get<Response<M>>(`${this.apiBaseUrl}/${id}`);
  }

  public delete(id: number): Observable<Response<M>> {
    return this.http.delete<Response<M>>(`${this.apiBaseUrl}/${id}`);
  }

  public findByFilter(filter: PageableFilter<F>): Observable<Response<Page<M[]>>> {
    return this.http.post<Response<Page<M[]>>>(`${this.apiBaseUrl}/findByFilter`, filter);
  }

  public activeOrInative(id: number): Observable<Response<M>> {
    return this.http.post<Response<M>>(`${this.apiBaseUrl}/activeOrInative/${id}`, {});
  }

  public update(id: number, body: M): Observable<Response<M>> {
    return this.http.put<Response<M>>(`${this.apiBaseUrl}/${id}`, body);
  }

  public create(body: M): Observable<Response<M>> {
    return this.http.post<Response<M>>(`${this.apiBaseUrl}`, body);
  }

}
