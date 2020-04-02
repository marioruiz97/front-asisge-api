import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response {
  status: string | number;
  message: string;
  errors?: string[];
  body?: any;
}

@Injectable()
export class AppService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Basic ' + btoa('user:clave123') })
  };
  private httpOptionsImage = {
    headers: new HttpHeaders({ enctype: 'multipart/form-data', Authorization: 'Basic ' + btoa('user:clave123') })
  };
  private API_ENDPOINT = 'http://localhost:8080/api/v1';

  constructor(private httpClient: HttpClient) { }

  postRequest(path: string, data: any): Promise<Response> {
    return this.httpClient.post(`${this.API_ENDPOINT}/${path}`, data, this.httpOptions).pipe(
      map(result => result as Response)
    ).toPromise();
  }

  patchRequest(path: string, data: any): Promise<Response> {
    return this.httpClient.patch(`${this.API_ENDPOINT}/${path}`, data, this.httpOptions).pipe(
      map(result => result as Response)
    ).toPromise();
  }

  getRequest(path: string): Observable<Response> {
    return this.httpClient.get(`${this.API_ENDPOINT}/${path}`, this.httpOptions).pipe(
      map(result => result as Response)
    );
  }

  deleteRequest(path: string): Promise<Response> {
    return this.httpClient.delete(`${this.API_ENDPOINT}/${path}`, this.httpOptions).pipe(
      map(result => result as Response)
    ).toPromise();
  }

}
