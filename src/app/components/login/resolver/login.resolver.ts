import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { SharedService } from 'src/app/core/services/shared.service';

@Injectable()
export class LoginResolver implements Resolve<any> {

    constructor(
        private router: Router,
        private sharedService: SharedService
    ) { }

    resolve(): any {
        if (this.sharedService.isLoggedIn()) {
            this.router.navigate(['/home']);
            return;
        }
    }

}
