import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { get } from 'lodash';
import { Observable } from 'rxjs';
import { userPagePermission } from '../core/permission/user/user.page';
import { AuthService } from '../core/services/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class UsersRouteResolver implements Resolve<any> {
    constructor(private authS: AuthService) { }
    async resolve(): Promise<Observable<any> | Promise<any> | any> {
        const auth = this.authS.authState.value;
        const authAccount = get(auth, 'account', null);
        const role = get(authAccount, 'roles', null);
        return {
            auth,
            role,
            showScreen: role.toLowerCase() === 'admin' ? true : false
        };
    }
}
