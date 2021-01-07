import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RcFormsModule } from '../rc-forms/rc-forms.module';
import { CardGroupComponent } from './components/card-group/card-group.component';
import { CardComponent } from './components/card/card.component';
import { ShopCardComponent } from './components/shop-card/shop-card.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { AppOverlayModule } from '../app-overlay/app-overlay.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [CardComponent, CardGroupComponent, ShopCardComponent, ProductCardComponent, AddProductComponent],
  imports: [CommonModule, RcFormsModule, AppOverlayModule, ModalModule.forRoot() ],
  exports: [CardComponent, CardGroupComponent, ShopCardComponent, ProductCardComponent, AddProductComponent],
})
export class CardModule {}
