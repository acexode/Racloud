import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppOverlayComponent } from './app-overlay/app-overlay.component';



@NgModule({
  declarations: [AppOverlayComponent],
  imports: [
    CommonModule
  ],
  exports: [AppOverlayComponent],
})
export class AppOverlayModule { }
