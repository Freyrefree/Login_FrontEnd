import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//**** */ Servicios *****
import { ApiAuthTokenUserService } from 'src/app/servicios/api-auth-token-user.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  nombreUsuario: string = 'Invitado'; // Valor por defecto
  userImageSrc: string = ''; // Propiedad para la imagen aleatoria

  constructor(
    private router: Router,
    private authService: ApiAuthTokenUserService
  ) {}

  ngOnInit(): void {
    // Generar la ruta de la imagen aleatoria
    this.userImageSrc = this.getRandomUserImage();

    // Suscribirse a los datos del empleado
    this.authService.datosEmpleado$.subscribe((data) => {
      if (data) {
        this.nombreUsuario = data.nombreCompleto; // Actualizar el nombre del usuario
      } else {
        this.nombreUsuario = 'Invitado'; // Valor por defecto si no hay datos
      }
    });
  }

  // Función para generar la ruta de la imagen aleatoria
  private getRandomUserImage(): string {
    const randomUser = Math.floor(Math.random() * 5) + 1; // Número aleatorio entre 1 y 5
    return `assets/img/users/user${randomUser}.jpg`; // Ruta de la imagen
  }

  cerrarSesion(): void {
    this.authService.logout(); // Llama a la función de logout
  }
}
