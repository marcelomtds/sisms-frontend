import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../shared/services/shared.service';

@Injectable()
export class AuthGuard implements CanActivate {

    public constructor(
        private router: Router,
        private sharedService: SharedService
    ) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (!this.sharedService.isLoggedIn()) {
            this.sharedService.removeUserAndTokenSession();
            this.router.navigate(['/login']);
            return false;
        }
        if (route.data.role && !this.isPermitido(route.data.role)) {
            this.router.navigate(['/acesso-negado']);
            return false;
        }
        return true;
    }

    public isPermitido(role: string): boolean {
        return this.sharedService.getUserSession() && this.sharedService.getUserSession().perfilRole === role;
    }
}
