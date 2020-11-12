import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { fakeBackendProvider } from './interceptors/fake-backend';
import { AuthService } from './services/auth/auth.service';
import { ConfigService } from './services/config/config.service';
import { CustomStorageService } from './services/custom-storage/custom-storage.service';
import { FooterService } from './services/footer/footer.service';
import { RequestService } from './services/request/request.service';
import { TitleService } from './services/title/title.service';
import { PasswordDirective } from './validators/password-validator/password.directive';

@NgModule({
  declarations: [PasswordDirective],
  imports: [CommonModule, HttpClientModule],
  providers: [
    fakeBackendProvider,
    RequestService,
    ConfigService,
    AuthService,
    CustomStorageService,
    TitleService,
    FooterService,
  ],
})
export class CoreModule {}
