import { NgModule } from '@angular/core';
import { CustomerComponent } from './customer.component';
import { Routes, RouterModule } from '@angular/router';
import { CreateEditCustomerComponent } from './create-edit-customer/create-edit-customer.component';

const routes: Routes = [
    {
        path: '',
        component: CustomerComponent,
    },
    {
        path: 'create',
        component: CreateEditCustomerComponent,
        data: { title: 'Create Customer' },
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class CustomerRoutingModule { }