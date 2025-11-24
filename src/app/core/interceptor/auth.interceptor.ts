import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const tokenExemptUrls = ['amazonaws.com'];

        const accessToken = this.authService.getAccessToken();

        // Clone the request and attach the Authorization header with the access token
        let authReq = req;

        if (accessToken && (!tokenExemptUrls.some(url => req.url.includes(url)))) {
            authReq = this.addToken(req, accessToken);
        }

        // Return the modified request to the next handler in the chain
        return next.handle(authReq);
    }

    private addToken(request: HttpRequest<any>, token: string) {
        // Clone the request and add the access token to the Authorization header
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
