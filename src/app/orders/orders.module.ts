import { OrdersComponent } from './orders.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ContainerModule } from '../shared/container/container.module';
import { RcFormsModule } from '../shared/rc-forms/rc-forms.module';
import { TableModule } from '../shared/table/table.module';
import { TabsModule } from '../shared/tabs/tabs.module';
import { AddEditOrderComponent } from './add-edit-order/add-edit-order.component';


@NgModule({
  declarations: [AddEditOrderComponent, OrdersComponent],
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
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
