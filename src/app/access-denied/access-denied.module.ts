import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessDeniedComponent } from './access-denied.component';



@NgModule({
  declarations: [AccessDeniedComponent],
  imports: [
    CommonModule
  ],
  exports: [AccessDeniedComponent]
})
export class AccessDeniedModule { }
