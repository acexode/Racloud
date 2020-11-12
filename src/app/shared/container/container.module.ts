import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from '../card/card.module';
import { PageContainerComponent } from './components/page-container/page-container.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [PageContainerComponent],
  imports: [CommonModule, CardModule, AngularSvgIconModule],
  exports: [PageContainerComponent],
})
export class ContainerModule {}
