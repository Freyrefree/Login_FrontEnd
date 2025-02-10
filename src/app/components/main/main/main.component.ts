import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  constructor(private http: HttpClient) {}



  redirectToSystem() {
    const token = localStorage.getItem('token');
    if (token) {
      const redirectUrl = `http://localhost:65156?token=${token}`; // URL del segundo frontend con el token como parámetro

      // Redirigir al usuario al segundo frontend
      window.location.href = redirectUrl;
    } else {
      console.error('No se encontró el token en el localStorage.');
    }
  
    // if (token) {
    //   const postUrl = 'http://localhost:65156'; // URL del sistema de destino
    //   const redirectUrl = `${postUrl}`; // URL a la que redirigir después del POST
  
    //   // Enviar el token mediante POST
    //   this.http.post(postUrl, { token }).subscribe(
    //     response => {
    //       console.log('Token enviado exitosamente:', response);
    //       // Redirigir al usuario al sistema de destino después de enviar el token
    //       window.location.href = redirectUrl;
    //     },
    //     error => {
    //       console.error('Error al enviar el token:', error);
    //     }
    //   );
    // } else {
    //   console.error('No se encontró el token en el localStorage.');
    // }
  }
  


}
