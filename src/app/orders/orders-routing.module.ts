import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersCheckoutComponent } from './orders-checkout/orders-checkout.component';
import { OrdersDetailsComponent } from './orders-details/orders-details.component';
import { OrdersComponent } from './orders.component';


const routes: Routes = [
    {
        path: '',
        component: OrdersComponent,
        data: { title: 'orders' }
    },
    {
        path: 'orders-details/:id',
        component: OrdersDetailsComponent,
        data: { title: 'orders details' }
    },
    {
        path: 'orders-checkout',
        component: OrdersCheckoutComponent,
        data: { title: 'orders checkout' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdersRoutingModule { }
