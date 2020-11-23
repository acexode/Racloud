import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RcFormsModule } from '../rc-forms/rc-forms.module';
import { CardGroupComponent } from './components/card-group/card-group.component';
import { CardComponent } from './components/card/card.component';
import { ShopCardComponent } from './components/shop-card/shop-card.component';

@NgModule({
  declarations: [CardComponent, CardGroupComponent, ShopCardComponent],
  imports: [CommonModule, RcFormsModule],
  exports: [CardComponent, CardGroupComponent, ShopCardComponent],
})
export class CardModule {}
