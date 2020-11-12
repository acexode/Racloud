import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardGroupComponent } from './components/card-group/card-group.component';
import { CardComponent } from './components/card/card.component';

@NgModule({
  declarations: [CardComponent, CardGroupComponent],
  imports: [CommonModule],
  exports: [CardComponent, CardGroupComponent],
})
export class CardModule {}
