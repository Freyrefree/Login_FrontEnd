import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

// Servicios 
import { ApiAuthTokenUserService } from 'src/app/servicios/api-auth-token-user.service';

//*** Interfaces */


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  form: FormGroup;
  isLoading = false;
  password: string = ''; // Variable para almacenar la contraseña
  showPassword: boolean = false;


  constructor(
    private fb: FormBuilder,
    private authService: ApiAuthTokenUserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      employeeNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password: ['', [Validators.required]]
    });
  }





  onSubmit(): void {
    if (this.form.valid) {
      const usuario = this.form.get('employeeNumber')?.value;
      const password = this.form.get('password')?.value;
  
      this.showLoading(); // Mostrar indicador de carga
  
      this.authService.login(usuario, password).subscribe(
        (response) => {
          this.hideLoading(); // Ocultar indicador de carga
          if (this.authService.isAuthenticated()) {
            console.log('Login exitoso y token almacenado en localStorage.');


  
            this.router.navigateByUrl('/main');
  

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
  
  
  
  // *********************************** otras funciones dle componente ***************************************

  private showLoading() {
    this.isLoading = true;
  }

  private hideLoading() {
    this.isLoading = false;
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}
