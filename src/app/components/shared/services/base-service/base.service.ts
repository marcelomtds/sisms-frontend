import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Response } from '../../model/model/response.model';
import Page from '../../pagination/pagination';
import { PageableFilter } from '../../model/filter/filter.filter';

export class BaseService<R, F> {

  protected apiBaseUrl: string;
  protected http: HttpClient;

  public constructor(http: HttpClient, url: string) {
    this.http = http;
    this.apiBaseUrl = environment.apiBaseUrl + url;
  }

  public findAll(): Observable<Response<R[]>> {
    return this.http.get<Response<R[]>>(this.apiBaseUrl);
  }

  public findAllActive(): Observable<Response<R[]>> {
    return this.http.get<Response<R[]>>(`${this.apiBaseUrl}/findAllActive`);
  }

  public findById(id: number): Observable<Response<R>> {
    return this.http.get<Response<R>>(`${this.apiBaseUrl}/${id}`);
  }

  public findByFilter(filter: PageableFilter<F>): Observable<Response<Page<R[]>>> {
    return this.http.post<Response<Page<R[]>>>(`${this.apiBaseUrl}/findByFilter`, filter);
  }

  public activeOrInative(id: number): Observable<Response<R>> {
    return this.http.post<Response<R>>(`${this.apiBaseUrl}/activeOrInative/${id}`, {});
  }

  public update(id: number, body: any): Observable<Response<R>> {
    return this.http.put<Response<R>>(`${this.apiBaseUrl}/${id}`, body);
  }

  public create(body: R): Observable<Response<R>> {
    return this.http.post<Response<R>>(`${this.apiBaseUrl}`, body);
  }

}
