import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { LoginGuard } from './core/guards/login/login.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { StyleGuideComponent } from './style-guide/style-guide.component';
import { SignupComponent } from './signup/signup.component';

import { ShopComponent } from './shop/shop.component';
import { UsersRouteResolver } from './users/users.route.resolver';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'customer'
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
    data: {
      title: 'Order'
    }
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.module').then(
        (m) => m.UsersModule
      ),
    canActivate: [AuthGuard],
    data: { title: 'User Listing' },
    resolve: { data: UsersRouteResolver},
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./products/products.module').then(
        (m) => m.ProductsModule
      ),
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
  },
  {
    path: 'options',
    loadChildren: () =>
      import('./options/options.module').then(
        (m) => m.OptionsModule
      ),
    data: { title: 'Options Listing' },
    canActivate: [AuthGuard],
  },
  {
    path: 'shop',
    component: ShopComponent,
    data: { title: 'Shop' },
    canActivate: [AuthGuard],
  },
  {
    path: 'price-lists',
    loadChildren: () => import('./price-lists/price-lists.module').then(m => m.PriceListsModule),
    canActivate: [AuthGuard],
    data: { title: 'Price List' },
  },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
