import { TableModule } from './shared/table/table.module';
import { ContainerModule } from './shared/container/container.module';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CoreModule } from './core/core.module';
import { CardModule } from './shared/card/card.module';
import { ErrorMessagesModule } from './shared/error-messages/error-messages.module';
import { MessagesModule } from './shared/messages/messages.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { JwtInterceptor } from './core/interceptors/JWTInterceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { OmnDatePickerModule } from './shared/date-picker/date-picker.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { StyleGuideComponent } from './style-guide/style-guide.component';
import { RcFormsModule } from './shared/rc-forms/rc-forms.module';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { TabsModule } from './shared/tabs/tabs.module';
import { ProductsComponent } from './products/products.component';
import { RaLogoComponent } from './shared/ra-logo/ra-logo.component';
import { SignupComponent } from './signup/signup.component';

import { ShopComponent } from './shop/shop.component';
import { CustomerModule } from './customer/customer.module';
import { LoaderModule } from './shared/loader/loader.module';
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    HomeComponent,
    NotFoundComponent,
    StyleGuideComponent,
    AccessDeniedComponent,
    ProductsComponent,
    RaLogoComponent,
    SignupComponent,
    ShopComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    MessagesModule,
    AppRoutingModule,
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    NgxDatatableModule,
    CardModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ErrorMessagesModule,
    RouterModule,
    OmnDatePickerModule,
    TooltipModule.forRoot(),
    NgSelectModule,
    BsDropdownModule.forRoot(),
    ContainerModule,
    TableModule,
    RcFormsModule,
    TabsModule,
    CustomerModule,
    LoaderModule,
    ModalModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
  bootstrap: [AppComponent],
  schemas: [],
})
export class AppModule { }
