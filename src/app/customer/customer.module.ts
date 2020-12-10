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
import { LoaderModule } from '../shared/loader/loader.module';
import { UserTabComponent } from './manage-customer/user-tab/user-tab.component';
import { OrderTabComponent } from './manage-customer/order-tab/order-tab.component';
import { CustomerTabComponent } from './manage-customer/customer-tab/customer-tab.component';
import { LicensesTabComponent } from './manage-customer/licenses-tab/licenses-tab.component';
import { DetailsTabComponent } from './manage-customer/details-tab/details-tab.component';



@NgModule({
  declarations: [
    CustomerComponent,
    CreateCustomerComponent,
    ManageCustomerComponent,
    LicensesTabComponent,
    DetailsTabComponent,
    UserTabComponent,
    OrderTabComponent,
    CustomerTabComponent
  ],
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
