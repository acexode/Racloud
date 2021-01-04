import { OrdersComponent } from './orders/orders.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { LoginGuard } from './core/guards/login/login.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { StyleGuideComponent } from './style-guide/style-guide.component';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { SignupComponent } from './signup/signup.component';
import { PriceListsComponent } from './price-lists/price-lists.component';

import { ShopComponent } from './shop/shop.component';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'style'
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
    path: 'orders',
    loadChildren: () =>
      import('./orders/orders.module').then(
        (m) => m.OrdersModule
      ),
    canActivate: [AuthGuard],
    data: { title: 'Order Listing' }
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.module').then(
        (m) => m.UsersModule
      ),
    data: { title: 'User Listing' },
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./products/products.module').then(
        (m) => m.ProductsModule
      ),
    // canActivate: [AuthGuard],
    data: { title: 'Product Listing' }
  },
  {
    path: 'login',
    data: { title: 'Login' },
    canActivate: [LoginGuard],
    component: LoginComponent,
  },
  {
    path: 'signup',
    canActivate: [LoginGuard],
    data: { title: 'signup' },
    component: SignupComponent,
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
    path: 'customer',
    loadChildren: () =>
      import('./customer/customer.module').then(
        (m) => m.CustomerModule
      ),
    canActivate: [AuthGuard],
    data: { title: 'Customer Listing' },
  },
  {
    path: 'licenses',
    loadChildren: () =>
      import('./license/license.module').then(
        (m) => m.LicenseModule
      ),
    data: { title: 'Licenses Listing' },
  },
  {
    path: 'options',
    loadChildren: () =>
      import('./options/options.module').then(
        (m) => m.OptionsModule
      ),
    data: { title: 'Options Listing' },
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.module').then(
        (m) => m.UsersModule
      ),
    data: { title: 'Users Listing' },
  },
  {
    path: 'shop',
    component: ShopComponent,
    data: { title: 'Shop' },
  },
  {
    path: 'price-list',
    component: PriceListsComponent,
    data: { title: 'Price List' },
  },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
