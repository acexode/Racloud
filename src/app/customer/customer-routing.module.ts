import { NgModule } from '@angular/core';
import { CustomerComponent } from './customer.component';
import { Routes, RouterModule } from '@angular/router';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { ManageCustomerComponent } from './manage-customer/manage-customer.component';
import { BasicDetailsPageRouteResolver } from '../core/resolver/basic.details.page.route.resolver';
import { BasicPageRouteResolver } from '../core/resolver/basic.page.route.resolver';

const routes: Routes = [
    {
        path: '',
        component: CustomerComponent,
        resolve: { data: BasicPageRouteResolver },
    },
    {
        path: 'create',
        component: CreateCustomerComponent,
        data: { title: 'Create Customer' },
    },
    {
        path: 'manage/:id/tab/:tab',
        component: ManageCustomerComponent,
        data: { title: 'Create Customer' },
        resolve: { data: BasicDetailsPageRouteResolver },
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class CustomerRoutingModule { }