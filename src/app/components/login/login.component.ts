import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { jwtDecode } from 'jwt-decode';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Servicios 
import { ApiAuthTokenUserService } from 'src/app/servicios/api-auth-token-user.service';
import { ApiGetSistemasPorEmpleadoService } from 'src/app/servicios/api-get-sistemas-por-empleado.service';
import { UserService } from 'src/app/servicios/user.service';

//*** Interfaces */
import { EmpleadoSistemas } from 'src/app/interfaces/empleado.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  form: FormGroup;
  isLoading = false;
  password: string = ''; // Variable para almacenar la contraseña

  constructor(
    private fb: FormBuilder,
    private authService: ApiAuthTokenUserService,
    private apiService: ApiGetSistemasPorEmpleadoService, // Inyecta el servicio API
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      employeeNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {

    const token = localStorage.getItem('token');
    if (this.isTokenValid(token)) {
      // El token es válido
      console.log('Token válido');
    } else {
      // El token ha expirado
      console.log('Token expirado');
    }

  }


  // Método para verificar si el token es válido
  isTokenValid(token: string | null): boolean {
    if (!token) return false;

    try {
      // Decodificar el token
      const decodedToken: any = jwtDecode(token);

      // Obtener la fecha de expiración
      const expirationDate = decodedToken.exp;
      console.log("fecha de expiracion: ", expirationDate);

      // Convertir la fecha de expiración a milisegundos
      const expirationDateTime = expirationDate * 1000;

      // Verificar si la fecha de expiración es mayor que la hora actual
      return Date.now() < expirationDateTime;
    } catch (error) {
      // Si hay algún error en la decodificación, asumir que el token no es válido
      return false;
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const usuario = this.form.get('employeeNumber')?.value;
      const password = this.form.get('password')?.value;
  
      this.showLoading(); // Mostrar indicador de carga
  
      this.authService.token(usuario, password).subscribe(
        (response) => {
          this.hideLoading(); // Ocultar indicador de carga
          if (this.authService.isAuthenticated()) {
            console.log('Login exitoso y token almacenado en localStorage.');
  
            // Después de login exitoso, consumimos la API para obtener los sistemas del empleado
            this.apiService.getSistemasPorEmpleado(usuario).subscribe(
              (empleadoSistemas: EmpleadoSistemas) => {
                console.log('Sistemas del empleado:', empleadoSistemas);
  
                // Almacenar la claveEmpledado en el UserService
                this.userService.setClaveEmpledado(empleadoSistemas.claveEmpledado);
  
                this.router.navigateByUrl('/main');
              },
              (error) => {
                console.error('Error al obtener los sistemas del empleado:', error);
                this.snackBar.open('Error al obtener los sistemas del empleado. Intenta nuevamente.', 'Cerrar', {
                  duration: 3000,
                });
              }
            );
          }
        },
        (error) => {
          this.hideLoading(); // Ocultar indicador de carga en caso de error
          console.error('Error al iniciar sesión:', error);
          this.snackBar.open('Error al iniciar sesión. Por favor, verifica tus credenciales.', 'Cerrar', {
            duration: 3000,
          });
        }
      );
    } else {
      this.snackBar.open('Por favor, completa todos los campos correctamente.', 'Cerrar', {
        duration: 3000,
      });
    }
  }
  
  
  
  

  private showLoading() {
    this.isLoading = true;
  }

  private hideLoading() {
    this.isLoading = false;
  }
}
