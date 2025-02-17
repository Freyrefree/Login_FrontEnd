import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EmpleadoSistemas } from '../interfaces/empleado.model';

@Injectable({
  providedIn: 'root',
})
export class ApiGetSistemasPorEmpleadoService {
  private apiUrl = 'https://g-mc.mx:8105/api/SAITSistemasPorEmpleado';

  constructor(private http: HttpClient) {}

  getSistemasPorEmpleado(claveEmpleado: string): Observable<EmpleadoSistemas> {
    const formData = new FormData();
    formData.append('claveEmpleado', claveEmpleado);

    return this.http.post<EmpleadoSistemas>(this.apiUrl, formData).pipe(
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        return throwError(error);
      })
    );
  }
}