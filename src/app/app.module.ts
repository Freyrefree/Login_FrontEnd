import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule



//Rutas
import { APP_ROUTING } from './app.routes';
//Servicios

//Componenetes
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './components/main/main/main.component';

///servicios
import { ApiAuthTokenUserService } from './servicios/api-auth-token-user.service';
import { AuthGuard } from './guards/auth.guard';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, // Agrega FormsModule aquí
    ReactiveFormsModule, // Agrega ReactiveFormsModule a los imports,
    MatSnackBarModule,
    APP_ROUTING,
    BrowserAnimationsModule
  ],
  providers: [

    ApiAuthTokenUserService,
    AuthGuard

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
