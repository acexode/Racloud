import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JwtInterceptor } from './interceptors/JWTInterceptor';
import { TruncatePipe } from './pipe/truncate.pipe';
import { AuthService } from './services/auth/auth.service';
import { ConfigService } from './services/config/config.service';
import { CustomStorageService } from './services/custom-storage/custom-storage.service';
import { FooterService } from './services/footer/footer.service';
import { RequestService } from './services/request/request.service';
import { TitleService } from './services/title/title.service';
import { PasswordDirective } from './validators/password-validator/password.directive';

@NgModule({
  declarations: [PasswordDirective, TruncatePipe],
  imports: [CommonModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    RequestService,
    ConfigService,
    AuthService,
    CustomStorageService,
    TitleService,
    FooterService,
  ],
  exports: [TruncatePipe]
})
export class CoreModule { }
