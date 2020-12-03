import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { CreateEditCustomerComponent } from './create-edit-customer/create-edit-customer.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { ContainerModule } from '../shared/container/container.module';
import { RcFormsModule } from '../shared/rc-forms/rc-forms.module';
import { TableModule } from '../shared/table/table.module';



@NgModule({
  declarations: [CustomerComponent, CreateEditCustomerComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ContainerModule,
    RcFormsModule,
    TableModule
  ]
})
export class CustomerModule { }
