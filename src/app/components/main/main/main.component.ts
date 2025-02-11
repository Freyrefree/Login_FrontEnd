import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//****************** Servicios ***********
import { UserService } from 'src/app/servicios/user.service';
// ******* Interfaces ***************
import { Empleado } from 'src/app/interfaces/empleado.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  claveEmpledado: string = ''; // Variable para almacenar la clave del empleado
  datosEmpleado: Empleado | null = null; // Variable para almacenar los datos del empleado


  constructor(private http: HttpClient, private userService: UserService) {}

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
  }

  redirectToSystem() {
    const token = localStorage.getItem('token');
    if (token) {
      const redirectUrl = `http://localhost:65156?token=${token}`; // URL del segundo frontend con el token como parámetro

      // Redirigir al usuario al segundo frontend
      window.location.href = redirectUrl;
    } else {
      console.error('No se encontró el token en el localStorage.');
    }
  }
}