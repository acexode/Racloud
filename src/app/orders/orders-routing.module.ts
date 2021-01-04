import { OrdersComponent } from './orders.component';
import { AddEditOrderComponent } from './add-edit-order/add-edit-order.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    data: {
      title: 'Orders'
    }
  },
  {
    path: 'add-order',
    component: AddEditOrderComponent,
    data: {
      title: 'Add Order'
    }
  },
  {
    path: 'edit-order',
    component: AddEditOrderComponent,
    data: {
      title: 'Edit Order'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
