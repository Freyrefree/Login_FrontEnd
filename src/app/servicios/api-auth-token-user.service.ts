import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthTokenUserService {

  private apiUrl = 'https://g-mc.mx:8105/api/Auth';

  constructor(private httpClient: HttpClient) { }

  token(usuario: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('usuario', usuario);
    formData.append('password', password);

    return this.httpClient.post(this.apiUrl, formData).pipe(
      tap((response: any) => {
        // Asumiendo que la respuesta tiene el token bajo la propiedad 'token'
        const token = response.token;
        if (token) {
          this.saveToken(token);
        }
      })
    );
  }

  private saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
