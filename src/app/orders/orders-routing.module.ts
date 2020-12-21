import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdersRoutingModule { }
