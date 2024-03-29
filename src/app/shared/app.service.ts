import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthData } from '../auth/auth-data.model';

export interface Response {
  status: string | number;
  message: string;
  errors?: string[];
  body?: any;
}

@Injectable()
export class AppService {

  private httpOptionsImage = {
    headers: new HttpHeaders({ enctype: 'multipart/form-data' })
  };
  private loginHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded', Authorization: environment.authorization
  });

  private API_ENDPOINT = environment.api_endpoint;
  private LOGIN_PATH = environment.token_path;
  constructor(private httpClient: HttpClient) { }


  loginRequest(authData: AuthData): Promise<any> {
    const params = new URLSearchParams();
    params.set('grant_type', environment.grant_type);
    params.set('username', authData.email);
    params.set('password', authData.password);
    return this.httpClient.post(`${this.API_ENDPOINT}/${this.LOGIN_PATH}`, params.toString(), { headers: this.loginHeaders }).toPromise();
  }

  postRequest(path: string, data: any): Promise<Response> {
    return this.httpClient.post(`${this.API_ENDPOINT}/${path}`, data).pipe(
      map(result => result as Response)
    ).toPromise();
  }

  patchRequest(path: string, data: any): Promise<Response> {
    return this.httpClient.patch(`${this.API_ENDPOINT}/${path}`, data).pipe(
      map(result => result as Response)
    ).toPromise();
  }

  getRequest(path: string): Observable<Response> {
    return this.httpClient.get(`${this.API_ENDPOINT}/${path}`).pipe(
      map(result => result as Response)
    );
  }

  deleteRequest(path: string): Promise<Response> {
    return this.httpClient.delete(`${this.API_ENDPOINT}/${path}`).pipe(
      map(result => result as Response)
    ).toPromise();
  }

  uploadFile(archivo: File, path: string, idRegistro: number = null) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    if (idRegistro) { formData.append('id', idRegistro.toString()); }
    return this.httpClient.put(`${this.API_ENDPOINT}/${path}`, formData, this.httpOptionsImage);
  }

}
