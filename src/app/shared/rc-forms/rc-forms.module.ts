import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './components/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './components/select/select.component';
import { ButtonComponent } from './components/button/button.component';



@NgModule({
  declarations: [InputComponent, SelectComponent, ButtonComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [InputComponent, SelectComponent, ButtonComponent],
})
export class RcFormsModule { }
