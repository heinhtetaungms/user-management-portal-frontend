import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthenticationService} from "../service/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard  {

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  boolean {
    return this.isUserLoggedIn();
  }

  private isUserLoggedIn(): boolean {
    if (this.authenticationService.isUserLoggedIn()) {
       return true;
    }
    this.router.navigate(['/login'])
    //TODO: Send notification to user
    return false;
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AuthenticationGuard).canActivate(next, state)
}
