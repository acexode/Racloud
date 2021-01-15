import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RcFormsModule } from '../rc-forms/rc-forms.module';
import { CardGroupComponent } from './components/card-group/card-group.component';
import { CardComponent } from './components/card/card.component';
import { ShopCardComponent } from './components/shop-card/shop-card.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { AddProductFormStepComponent } from './components/add-product-form-step/add-product-form-step.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { LoaderModule } from '../loader/loader.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CardComponent,
    CardGroupComponent,
    ShopCardComponent,
    ProductCardComponent,
    AddProductComponent,
    AddProductFormStepComponent
  ],
  imports: [
    CommonModule,
    RcFormsModule,
    AngularSvgIconModule,
    LoaderModule,
    ModalModule,
    ReactiveFormsModule,
  ],
  exports: [
    CardComponent,
    CardGroupComponent,
    ShopCardComponent,
    ProductCardComponent,
    AddProductComponent,
    AddProductFormStepComponent
  ],
})
export class CardModule {}
