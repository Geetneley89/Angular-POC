import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {User} from './models/user';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if (!sessionStorage.getItem("username") || route.data.role != sessionStorage.getItem("typeOfUser")) {
            this.router.navigate(['login']);
            sessionStorage.clear();
            return false;
        }
        return true;
    }


}
