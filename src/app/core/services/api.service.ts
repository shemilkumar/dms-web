import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fromEvent, map, merge, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private BASE_URL = environment.dataApiUrl;
  online$: Observable<any>;

  constructor(
    private http: HttpClient,
    private snackbar: SnackbarService,
  ) {
    this.online$ = merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    );
    this.online$.subscribe((data) => {
      if (!data) {
        this.snackbar.openSnackbar('No Internet Connection, check your network', 'error');
      } else {
        this.snackbar.openSnackbar('Internet Connection is restored', 'success');
      }
    });
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.BASE_URL}/${endpoint}`);
  }

  post<T>(endpoint: string, payload: any): Observable<T> {
    return this.http.post<T>(`${this.BASE_URL}/${endpoint}`, payload);
  }

  put<T>(endpoint: string, payload: any): Observable<T> {
    return this.http.put<T>(`${this.BASE_URL}/${endpoint}`, payload);
  }

  patch<T>(endpoint: string, payload: any): Observable<T> {
    return this.http.patch<T>(`${this.BASE_URL}/${endpoint}`, payload);
  }

  delete<T>(endpoint: string, payload: any = {}): Observable<T> {
    return this.http.delete<T>(`${this.BASE_URL}/${endpoint}`, { body: payload });
  }

  s3Upload<T>(endpoint: string, payload: any, options: any): Observable<HttpEvent<T>> {
    return this.http.put<T>(endpoint, payload, options);
  }

  s3Download(endpoint: string): Observable<Blob> {
    return this.http.get(endpoint, { responseType: 'blob' });
  }

  getPostalDetails<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${endpoint}`);
  }

  getTimezoneDetails<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${endpoint}`);
  }
}
