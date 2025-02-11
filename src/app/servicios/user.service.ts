import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaz para los datos del empleado
import { Empleado } from '../interfaces/empleado.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // BehaviorSubject para almacenar y emitir la claveEmpledado
  private claveEmpledadoSource = new BehaviorSubject<string>('');
  claveEmpledado$ = this.claveEmpledadoSource.asObservable();

  // BehaviorSubject para almacenar y emitir los datos del empleado
  private datosEmpleadoSource = new BehaviorSubject<Empleado | null>(null);
  datosEmpleado$ = this.datosEmpleadoSource.asObservable();

  private apiUrl = 'https://g-mc.mx:8105/api/EmpleadosByClaveNomina';

  constructor(private http: HttpClient) {
    // Recuperar la claveEmpledado desde localStorage al iniciar el servicio
    const storedClave = localStorage.getItem('claveEmpledado');
    if (storedClave) {
      this.claveEmpledadoSource.next(storedClave);
    }

    // Recuperar los datos del empleado desde localStorage al iniciar el servicio
    const storedEmpleado = localStorage.getItem('datosEmpleado');
    if (storedEmpleado) {
      this.datosEmpleadoSource.next(JSON.parse(storedEmpleado));
    }
  }

  // Método para actualizar la claveEmpledado y obtener los datos del empleado
  setClaveEmpledado(clave: string): void {
    this.claveEmpledadoSource.next(clave); // Actualizar la claveEmpledado
    localStorage.setItem('claveEmpledado', clave); // Guardar en localStorage
    this.obtenerDatosEmpleado(clave); // Obtener los datos del empleado
  }

  // Método para obtener la claveEmpledado actual
  getClaveEmpledado(): string {
    return this.claveEmpledadoSource.value;
  }

  // Método para obtener los datos del empleado desde la API
  private obtenerDatosEmpleado(claveEmpleado: string): void {
    const formData = new FormData();
    formData.append('claveEmpleado', claveEmpleado);

    this.http.post<Empleado[]>(this.apiUrl, formData)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener los datos del empleado:', error);
          return []; // Retornar un arreglo vacío en caso de error
        })
      )
      .subscribe((data: Empleado[]) => {
        if (data.length > 0) {
          this.datosEmpleadoSource.next(data[0]); // Almacenar los datos del empleado
          localStorage.setItem('datosEmpleado', JSON.stringify(data[0])); // Guardar en localStorage
        } else {
          this.datosEmpleadoSource.next(null); // No hay datos del empleado
          localStorage.removeItem('datosEmpleado'); // Eliminar del localStorage si no hay datos
        }
      });
  }

  // Método para obtener los datos del empleado actual
  getDatosEmpleado(): Empleado | null {
    return this.datosEmpleadoSource.value;
  }

  // Método para limpiar los datos del empleado (por ejemplo, al cerrar sesión)
  clearDatosEmpleado(): void {
    this.claveEmpledadoSource.next(''); // Limpiar la claveEmpledado
    this.datosEmpleadoSource.next(null); // Limpiar los datos del empleado
    localStorage.removeItem('claveEmpledado'); // Eliminar la claveEmpledado del localStorage
    localStorage.removeItem('datosEmpleado'); // Eliminar los datos del empleado del localStorage
  }
}