import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './components/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './components/select/select.component';



@NgModule({
  declarations: [InputComponent, SelectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [InputComponent, SelectComponent],
})
export class RcFormsModule { }
