import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiAuthTokenUserService } from '../servicios/api-auth-token-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: ApiAuthTokenUserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // Redirigir al usuario a la página de login si no está autenticado
      return this.router.createUrlTree(['/home']);
    }
  }
  
}
