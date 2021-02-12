import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasicDetailsPageRouteResolver } from '../core/resolver/basic.details.page.route.resolver';
import { BasicPageRouteResolver } from '../core/resolver/basic.page.route.resolver';
import { OrdersCheckoutComponent } from './orders-checkout/orders-checkout.component';
import { OrdersDetailsComponent } from './orders-details/orders-details.component';
import { OrdersComponent } from './orders.component';


const routes: Routes = [
    {
        path: '',
        component: OrdersComponent,
        data: { title: 'orders' },
        resolve: { data: BasicPageRouteResolver },
    },
    {
        path: 'orders-details/:id',
        component: OrdersDetailsComponent,
        data: { title: 'orders details' },
        resolve: { data: BasicDetailsPageRouteResolver },
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
