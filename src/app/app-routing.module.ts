import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { LoginGuard } from './core/guards/login/login.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { StyleGuideComponent } from './style-guide/style-guide.component';
import { CustomerListingComponent } from './customer-listing/customer-listing.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/style'
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: HomeComponent,
    data: {
      title: 'Home'
    },
  },
  {
    path: 'login',
    data: { title: 'Login' },
    canActivate: [LoginGuard],
    component: LoginComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: { title: 'Not found' },
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
    data: { title: 'Access Denied' },
  },
  {
    path: 'style',
    component: StyleGuideComponent,
    data: { title: 'style guide' },
  },
  {
    path: 'customer-listing',
    component: CustomerListingComponent,
    data: { title: 'Customer Listing' },
  },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
