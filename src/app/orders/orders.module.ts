import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { RcFormsModule } from '../shared/rc-forms/rc-forms.module';
import { TableModule } from '../shared/table/table.module';
import { ContainerModule } from '../shared/container/container.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersDetailsComponent } from './orders-details/orders-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { OrdersCheckoutComponent } from './orders-checkout/orders-checkout.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CardModule } from '../shared/card/card.module';
import { CoreModule } from '../core/core.module';


@NgModule({
  declarations: [OrdersComponent, OrdersDetailsComponent, OrdersCheckoutComponent],
  imports: [
    CommonModule,
    RcFormsModule,
    FormsModule,
    TableModule,
    ContainerModule,
    CardModule,
    BsDropdownModule.forRoot(),
    OrdersRoutingModule,
    ReactiveFormsModule,
    AngularSvgIconModule.forRoot(),
    ModalModule.forRoot(),
    CoreModule
  ]
})
export class OrdersModule { }
