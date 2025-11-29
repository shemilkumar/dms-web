import { Injectable } from '@angular/core';
// import { KeycloakService } from 'keycloak-angular';
import { ApiService } from './api.service';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from "rxjs";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private isRefreshing: boolean = false;
    private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    constructor(private api: ApiService, private router: Router, private dialog: MatDialog) { }

    handleUpdateAccessToken(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.refreshToken().pipe(
                switchMap((tokenData: any) => {
                    const token = tokenData.data.access_token;
                    this.isRefreshing = false;
                    localStorage.setItem('access_token', token);
                    this.refreshTokenSubject.next(token);

                    // Retry the failed request with the new token
                    return next.handle(this.addToken(request, token));
                }),
                catchError((err) => {
                    this.isRefreshing = false;
                    // Optionally log out or navigate to login page if refresh fails
                    this.logout(); // Or handle accordingly
                    return throwError(err);
                })
            );
        } else {
            // If refreshing is already in progress, wait for the new token
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => {
                    return next.handle(this.addToken(request, token));
                })
            );
        }
    }

    private addToken(request: HttpRequest<any>, token: string | null) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    }

    refreshToken(): Observable<any> {
        const refreshToken = { "refresh_token": this.getRefreshToken() }
        return this.api.post('auth/refresh', refreshToken)
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // this.api.post('/logout', {}).subscribe()
        this.dialog.closeAll();
        this.router.navigate(['/login']);
    }
}
