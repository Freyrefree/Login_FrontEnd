import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//*****
import { MatSnackBar } from '@angular/material/snack-bar';

//****************** Servicios ***********
import { UserService } from 'src/app/servicios/user.service';
import { ApiGetSistemasPorEmpleadoService } from 'src/app/servicios/api-get-sistemas-por-empleado.service';

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
    private userService: UserService,
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
  
        // Almacenar la claveEmpledado en el UserService (si es necesario)
        // this.userService.setClaveEmpledado(empleadoSistemas.claveEmpledado);
      },
      (error) => {
        console.error('Error al obtener los sistemas del empleado:', error);
        this.snackBar.open('Error al obtener los sistemas del empleado. Intenta nuevamente.', 'Cerrar', {
          duration: 3000,
        });
      }
    );
  }
  

  redirectToSystem() {
    const token = localStorage.getItem('token');
    if (token) {
      const redirectUrl = `http://localhost:61399?token=${token}`; // URL del segundo frontend con el token como parámetro

      // Redirigir al usuario al segundo frontend
      window.location.href = redirectUrl;
    } else {
      console.error('No se encontró el token en el localStorage.');
    }
  }
}