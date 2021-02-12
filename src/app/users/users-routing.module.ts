import { CreateUserComponent } from './create-user/create-user.component';
import { UsersComponent } from './users.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasicPageRouteResolver } from '../core/resolver/basic.page.route.resolver';


const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    data: { title: 'Users' },
    resolve: { data: BasicPageRouteResolver },
  },
  {
    path: 'create-user',
    component: CreateUserComponent,
    data: { title: 'Create User' },
  },
  {
    path: 'edit-user',
    component: CreateUserComponent,
    data: { title: 'Licenses' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
