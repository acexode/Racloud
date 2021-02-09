import { UsersComponent } from './users.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { CreateUserComponent } from './create-user/create-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ContainerModule } from '../shared/container/container.module';
import { RcFormsModule } from '../shared/rc-forms/rc-forms.module';
import { TableModule } from '../shared/table/table.module';
import { TabsModule } from '../shared/tabs/tabs.module';
// import { AccessDeniedModule } from '../access-denied/access-denied.module';


@NgModule({
  declarations: [CreateUserComponent,UsersComponent],
  imports: [
    CommonModule,
    CommonModule,
    ContainerModule,
    RcFormsModule,
    TableModule,
    TabsModule,
    AngularSvgIconModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    UsersRoutingModule,
    // AccessDeniedModule
  ]
})
export class UsersModule { }
