import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiAuthTokenUserService } from './servicios/api-auth-token-user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: ApiAuthTokenUserService, // Inyecta el servicio
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Usa el servicio para verificar si el usuario está autenticado y si el token está vigente
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token != null) {
      if (!this.authService.isTokenValid(token)) {
        // Si el token no es válido, redirigir al login
        this.authService.logout();
        this.router.navigate(['/login']); // Ajusta la ruta según tu aplicación
        return throwError(() => new Error('Token expirado o no válido'));
      }}
    } else {
      // Si no está autenticado, redirigir al login
      this.authService.logout();
      this.router.navigate(['/login']); // Ajusta la ruta según tu aplicación
      return throwError(() => new Error('Usuario no autenticado'));
    }

    // Clonar la solicitud y agregar el token en el encabezado de autorización
    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });

    // Continuar con la solicitud HTTP
    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejar errores de la solicitud HTTP
        if (error.status === 401) {
          // Si el servidor responde con un 401 (No autorizado), redirigir al login
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}