import { NgModule } from '@angular/core';
import { CustomerComponent } from './customer.component';
import { Routes, RouterModule } from '@angular/router';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { ManageCustomerComponent } from './manage-customer/manage-customer.component';

const routes: Routes = [
    {
        path: '',
        component: CustomerComponent,
    },
    {
        path: 'create',
        component: CreateCustomerComponent,
        data: { title: 'Create Customer' },
    },
    {
        path: 'manage/:id',
        component: ManageCustomerComponent,
        data: { title: 'Create Customer' },
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class CustomerRoutingModule { }