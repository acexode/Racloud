import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { ContainerModule } from '../shared/container/container.module';
import { RcFormsModule } from '../shared/rc-forms/rc-forms.module';
import { TableModule } from '../shared/table/table.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { ManageCustomerComponent } from './manage-customer/manage-customer.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from '../shared/tabs/tabs.module';
import { LoaderComponent } from '../shared/loader/loader.component';
import { LoaderModule } from '../shared/loader/loader.module';



@NgModule({
  declarations: [CustomerComponent, CreateCustomerComponent, ManageCustomerComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ContainerModule,
    RcFormsModule,
    TableModule,
    AngularSvgIconModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    LoaderModule
  ]
})
export class CustomerModule { }
