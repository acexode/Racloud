import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authS: AuthService,
    private routerS: Router,
    private msgS: MessagesService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authS.getAccountData().pipe(
      map((val: string) => {
        let permissions = null;
        if (next.data) {
          permissions = next.data.permissions;
        }

        return val
          ? this.handleRoles(val, permissions)
          : this.routerS.createUrlTree(['/login'], {
              queryParams: { returnUrl: state.url },
            });
      })
    );
  }

  handleRoles(token: string, permissions) {
    const access = this.authS.handleRoles(token, permissions);
    if (!access) {
      this.msgS.addMessage({
        text: 'Accesul interzis! Nu aveti acces la aceasta resursa!',
        type: 'danger',
        dismissible: true,
        timeout: 5000,
      });
      // TODO: 403 page.
      return this.routerS.createUrlTree(['/']);
    }
    return access;
  }
}
