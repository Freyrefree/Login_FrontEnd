import { RouterModule,Routes } from '@angular/router';
import { LoginComponent } from './components/home/login.component';
import { MainComponent } from './components/main/main/main.component';

// Importar el Auth Guard
import { AuthGuard } from './guards/auth.guard';


const APP_ROUTES: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'main', component: MainComponent, canActivate: [AuthGuard]}, // Ruta protegida
    {path: '**',pathMatch: 'full', redirectTo: 'login'}

];

export const  APP_ROUTING = RouterModule.forRoot(APP_ROUTES);

