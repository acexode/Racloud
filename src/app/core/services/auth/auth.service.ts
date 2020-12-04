import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { BehaviorSubject, of } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { authEndpoints } from '../../configs/endpoints';
import { AuthState } from '../../models/auth-state.interface';
import { LoginResponse } from '../../models/login-response.interface';
import { Login } from '../../models/login.interface';
import { CustomStorageService } from '../custom-storage/custom-storage.service';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  initialState: AuthState = {
    init: false,
    account: null,
    authToken: '',
    expiryDate: null,
  };
  authState: BehaviorSubject<AuthState> = new BehaviorSubject(
    this.initialState
  );
  constructor(
    private storeS: CustomStorageService,
    private routerS: Router,
    private reqS: RequestService
  ) {
    // Load account state from local/session/cookie storage.
    this.storeS
      .getItem('token')
      .subscribe((tokenData: { token: string; exp: string, username: string; }) => {
        if (tokenData !== null) {
          this.authState.next({
            init: true,
            authToken: tokenData.token,
            expiryDate: tokenData.exp,
            account: {
              username: tokenData.username,
              image: null
            }
          });
        } else {
          this.authState.next({ ...this.initialState, ...{ init: true } });
        }
      });
  }

  updateState(newState: AuthState) {
    this.authState.next(newState);
  }

  getAuthState() {
    return this.authState.pipe(
      filter((val: AuthState) => val && val.hasOwnProperty('init') && val.init),
      distinctUntilChanged()
    );
  }

  getAccountData() {
    return this.getAuthState().pipe(
      map((val: AuthState) => {
        if (this.isTokenExpired(val.expiryDate)) {
          return null;
        } else {
          return val.authToken;
        }
      })
    );
  }

  getUsername() {
    return this.getAuthState().pipe(
      map((val: AuthState) => {
        if (val && val.account && val.account.username) {
          return val.account.username;
        } else {
          return null;
        }
      })
    );
  }

  login(loginData: {
    email: string;
    password: string;
    aRoute: ActivatedRoute;
  }) {
    const reqData: Login = {
      email: loginData.email,
      password: loginData.password,
    };
    return this.reqS.post<LoginResponse>(authEndpoints.login, reqData).pipe(
      switchMap((val) => {
        return this.processAuthResponse(val, loginData.email);
      }),
      tap((value) => {
        const redirectUrl = this.redirectUrlTree(
          loginData.aRoute ? loginData.aRoute.snapshot : null
        );
        Promise.resolve(this.routerS.navigateByUrl(redirectUrl));
      })
    );
  }

  processAuthResponse(data: LoginResponse, email: string) {
    const account = {
      username: email,
      image: null,
      user: data?.user || null,
    };
    const tokenData = data.token;
    const expirationDate = data.expiration;
    const auth = {
      token: tokenData,
      exp: expirationDate || null,
      username: email,
      user: data?.user || null,
    };
    return this.storeS.setItem('token', auth).pipe(
      tap(() => {
        this.authState.next({
          init: true,
          account,
          authToken: tokenData,
          expiryDate: expirationDate || null,
        });
      }),
      map((v) => data)
    );
  }

  redirectUrlTree(snapshot: ActivatedRouteSnapshot): UrlTree {
    if (snapshot) {
      const qP = snapshot.queryParams;
      const rUk = 'returnUrl';
      if (qP.hasOwnProperty(rUk) && qP[rUk]) {
        return this.routerS.createUrlTree([qP[rUk]]);
      }
    }
    return this.routerS.createUrlTree(['/']);
  }

  logout() {
    // remove token from local storage to log user out
    this.storeS.removeItem('token');
    this.authState.next({ ...this.initialState, ...{ init: true } });
    return this.routerS.navigateByUrl('/login');
  }

  isTokenExpired(date?: string | Date): boolean {
    if (date === undefined) {
      return false;
    }
    try {
      const expDate = new Date(date);
      const boolVal = !(expDate.valueOf() > new Date().valueOf());
      return boolVal;
    } catch (e) {
      return null;
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  handleRoles(token: string, statePermissions?: Array<string>) {
    let userPermissions = [];
    const tokenInfo = this.getDecodedAccessToken(token);
    if (tokenInfo) {
      userPermissions = tokenInfo['ApiCenter/Permission']
        ? tokenInfo['ApiCenter/Permission']
        : [];
    }
    if (statePermissions instanceof Array) {
      return (
        statePermissions.findIndex((sP) => {
          return userPermissions instanceof Array
            ? userPermissions.findIndex((uP) => uP === sP) !== -1
            : false;
        }) !== -1
      );
    } else {
      return true;
    }
  }
}
