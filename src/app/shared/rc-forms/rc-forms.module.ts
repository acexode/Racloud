import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './components/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './components/select/select.component';
import { ButtonComponent } from './components/button/button.component';
import { ChipsComponent } from './components/chips/chips.component';
import { CheckboxComponent } from './components/checkboxes/checkbox/checkbox.component';
import { CheckboxesComponent } from './components/checkboxes/checkboxes.component';
import { RadioComponent } from './components/radio/radio.component';
import { ToggleComponent } from './components/toggle/toggle.component';
import { TextareaComponent } from './components/textarea/textarea.component';



@NgModule({
  declarations: [
    InputComponent,
    SelectComponent,
    ButtonComponent,
    ChipsComponent,
    CheckboxComponent,
    CheckboxesComponent,
    RadioComponent,
    ToggleComponent,
    TextareaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    InputComponent,
    SelectComponent,
    ButtonComponent,
    ChipsComponent,
    CheckboxComponent,
    CheckboxesComponent,
    RadioComponent,
    ToggleComponent,
    TextareaComponent
  ],
})
export class RcFormsModule { }
