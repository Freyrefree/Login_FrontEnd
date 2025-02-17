import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//*****
import { MatSnackBar } from '@angular/material/snack-bar';

//****************** Servicios ***********
import { ApiGetSistemasPorEmpleadoService } from 'src/app/servicios/api-get-sistemas-por-empleado.service';
import { ApiAuthTokenUserService } from 'src/app/servicios/api-auth-token-user.service';

// ******* Interfaces ***************
import { Empleado, Sistema } from 'src/app/interfaces/empleado.model';
import { EmpleadoSistemas } from 'src/app/interfaces/empleado.model';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  claveEmpledado: string = ''; // Variable para almacenar la clave del empleado
  datosEmpleado: Empleado | null = null; // Variable para almacenar los datos del empleado
  sistemasEmpleado: Sistema[] = []; // Array para almacenar los sistemas del empleado



  constructor(
    private http: HttpClient,
    private userService: ApiAuthTokenUserService,
    private apiService: ApiGetSistemasPorEmpleadoService, // Inyecta el servicio API
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    // Suscribirse a la claveEmpledado
    this.userService.claveEmpledado$.subscribe((clave) => {
      this.claveEmpledado = clave;
      console.log('Clave del empleado:', this.claveEmpledado);
    });

    // Suscribirse a los datos del empleado
    this.userService.datosEmpleado$.subscribe((data) => {
      this.datosEmpleado = data;
      console.log('Datos del empleado:', this.datosEmpleado);
    });

    // Obtener la claveEmpledado actual (opcional)
    this.claveEmpledado = this.userService.getClaveEmpledado();
    this.ObtenerSistemas(this.claveEmpledado);

  }

  // Obtener Sistemas 

  ObtenerSistemas(usuario: string) {
    // Después de login exitoso, consumimos la API para obtener los sistemas del empleado
    this.apiService.getSistemasPorEmpleado(usuario).subscribe(
      (empleadoSistemas: EmpleadoSistemas) => {
        console.log('Sistemas del empleado:', empleadoSistemas);
  
        // Almacenar los sistemas en la propiedad sistemasEmpleado
        this.sistemasEmpleado = empleadoSistemas.sistemas;
  
      },
      (error) => {
        console.error('Error al obtener los sistemas del empleado:', error);
        this.snackBar.open('Error al obtener los sistemas del empleado. Intenta nuevamente.', 'Cerrar', {
          duration: 3000,
        });
      }
    );
  }
  

  redirectToSystem(sistema: string) {
    const token = localStorage.getItem('token');
  
    // Verifica si el token existe y es válido
    if (token && this.userService.isTokenValid(token)) {
      const redirectUrl = `${sistema}?token=${token}`; // Usar la URL proporcionada
      window.location.href = redirectUrl; // Redirigir al usuario
    } else {
      console.error('Token no válido o no encontrado.');
      this.userService.logout(); // Limpiar el token y redirigir al login
      this.snackBar.open('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'Cerrar', {
        duration: 3000,
      });
    }
  }
  



}