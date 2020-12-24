import { ProductsComponent } from './products.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';


const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    data: {
      title: 'Products'
    }
  },
  {
    path: 'add-product',
    component: AddEditProductComponent,
    data: {
      title: 'Products'
    }
  },
  {
    path: 'edit-product',
    component: AddEditProductComponent,
    data: {
      title: 'Products'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
