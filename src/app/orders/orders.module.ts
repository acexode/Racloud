import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { RcFormsModule } from '../shared/rc-forms/rc-forms.module';
import { TableModule } from '../shared/table/table.module';
import { ContainerModule } from '../shared/container/container.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersDetailsComponent } from './orders-details/orders-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { OrdersCheckoutComponent } from './orders-checkout/orders-checkout.component';



@NgModule({
  declarations: [OrdersComponent, OrdersDetailsComponent, OrdersCheckoutComponent],
  imports: [
    CommonModule,
    RcFormsModule,
    TableModule,
    ContainerModule,
    BsDropdownModule.forRoot(),
    OrdersRoutingModule,
    ReactiveFormsModule,
    AngularSvgIconModule.forRoot(),
  ]
})
export class OrdersModule { }
