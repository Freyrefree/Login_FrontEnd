import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Empleado } from '../interfaces/empleado.model';

@Injectable({
  providedIn: 'root',
})
export class ApiAuthTokenUserService {
  private apiUrl = 'https://g-mc.mx:8105/api/Auth';
  private apiUrlEmpleado = 'https://g-mc.mx:8105/api/EmpleadosByClaveNomina';

  private claveEmpledadoSource = new BehaviorSubject<string>('');
  claveEmpledado$ = this.claveEmpledadoSource.asObservable();

  private datosEmpleadoSource = new BehaviorSubject<Empleado | null>(null);
  datosEmpleado$ = this.datosEmpleadoSource.asObservable();

  constructor(private httpClient: HttpClient, private router: Router) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const storedClave = localStorage.getItem('claveEmpledado');
    if (storedClave) {
      this.claveEmpledadoSource.next(storedClave);
    }

    const storedEmpleado = localStorage.getItem('datosEmpleado');
    if (storedEmpleado) {
      this.datosEmpleadoSource.next(JSON.parse(storedEmpleado));
    }
  }

  login(usuario: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('usuario', usuario);
    formData.append('password', password);

    return this.httpClient.post(this.apiUrl, formData).pipe(
      tap((response: any) => {
        const token = response.token;
        if (token) {
          this.saveToken(token);
          const sub = this.getSubFromToken(token);
          if (sub) {
            this.claveEmpledadoSource.next(sub);
            localStorage.setItem('claveEmpledado', sub);
            this.obtenerDatosEmpleado(sub);
          }
        }
      }),
      catchError((error) => {
        console.error('Error durante el login:', error);
        throw error;
      })
    );
  }

  private saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private getSubFromToken(token: string): string | null {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub;
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && this.isTokenValid(token);
  }

  isTokenValid(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const expirationDate = decodedToken.exp * 1000;
      return Date.now() < expirationDate;
    } catch (error) {
      console.error('Token inválido:', error);
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('claveEmpledado');
    localStorage.removeItem('datosEmpleado');
    this.claveEmpledadoSource.next('');
    this.datosEmpleadoSource.next(null);
    this.router.navigate(['/login']); // Usar Router para redirección
  }

  private obtenerDatosEmpleado(claveEmpleado: string): void {
    const formData = new FormData();
    formData.append('claveEmpleado', claveEmpleado);

    this.httpClient.post<Empleado[]>(this.apiUrlEmpleado, formData)
      .pipe(
        catchError((error) => {
          console.error('Error obteniendo datos del empleado:', error);
          return [];
        })
      )
      .subscribe((data: Empleado[]) => {
        if (data.length > 0) {
          this.datosEmpleadoSource.next(data[0]);
          localStorage.setItem('datosEmpleado', JSON.stringify(data[0]));
        } else {
          this.datosEmpleadoSource.next(null);
          localStorage.removeItem('datosEmpleado');
        }
      });
  }

  getClaveEmpledado(): string {
    return this.claveEmpledadoSource.value;
  }
}