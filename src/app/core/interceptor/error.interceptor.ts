import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
// import { SnackbarService } from "../services/snackbar.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                let toastMessage = '';

                // if (error.status === 401 || error.status === 403) this.authService.logout();

                if (error.status === 403 && error.error.detail === 'Not authenticated' ||
                    error.status === 401 && error.error.detail === 'Could not validate credentials'
                ) this.authService.logout();

                if (error.status === 401 && error.error.detail === 'Token expired')
                    return this.authService.handleUpdateAccessToken(req, next);

                if (error.error instanceof ErrorEvent) {
                    errorMessage = `ClientSide Error: ${error.error}`;
                } else {
                    console.error('Server Error');
                    console.log(error);
                    errorMessage = error.error.Message;
                }

                if (error.status === 403) {
                    toastMessage = 'You are not authorized to access this resource.';
                } else if (error.status === 404) {
                    toastMessage = 'Oops! Something went wrong. Please try again later.';
                } else if (error.status === 0 || error.status === 500) {
                    toastMessage = 'A server error occurred. Please try again later.';
                } else if (error.status === 400 || error.status === 409) {
                    if (error.error.Message)
                        toastMessage = error.error.Message;
                    if (error.error.detail)
                        toastMessage = error.error.detail;
                    else toastMessage = 'Something went wrong. Please try again later.';
                } else toastMessage = 'Something went wrong. Please try again later.';

                // Show toast
                if (toastMessage) {
                    // this.snackbar.openSnackbar(toastMessage, 'error');
                    return throwError(() => new Error(toastMessage));
                } else return throwError(() => new Error(errorMessage))

                // console.log(errorMessage);

            })
        )
    }
}