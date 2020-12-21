import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { serverBaseUrl } from '../configs/endpoints';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const externalUrl = request.url.startsWith(serverBaseUrl);
    const currentUser = this.authenticationService.getAuthState();
    if (currentUser && externalUrl) {
      let token = '';
      currentUser.subscribe((user) => (token = user.authToken));
      console.log(token)
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}
