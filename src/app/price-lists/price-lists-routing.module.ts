import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatePriceListsComponent } from './create-price-lists/create-price-lists.component';
import { PriceListsComponent } from './price-lists.component';


const routes: Routes = [
  {
    path: '',
    component: PriceListsComponent,
    data: { title: 'Price lists' },
  },
  {
    path: 'create',
    component: CreatePriceListsComponent,
    data: { title: 'Add price lists' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceListsRoutingModule { }
