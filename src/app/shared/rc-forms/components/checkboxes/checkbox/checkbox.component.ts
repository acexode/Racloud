import { CheckboxConfig } from './../../../models/checkbox/checkbox-config';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { config } from 'rxjs';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements OnInit, ControlValueAccessor {
  @Input() config: CheckboxConfig = {};
  // @Input() checked: boolean;
  // @Input() multiple: boolean;
  checked = this.config.checked
  onChange = (_: any) => { 
    console.log(this.checked)
  };

  onTouched = () => { };

  constructor() { }

  writeValue(value: any): void {
    console.log(value)
    this.checked = value ? value : false
    // this._renderer.setProperty(this.input.nativeElement, 'checked', value);
  }

  registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }

  registerOnTouched(fn: () => {}): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    // this._renderer.setProperty(this.input.nativeElement, 'disabled', isDisabled);
  }

  ngOnInit(): void {
    console.log(this.config)
  }

  // get isChecked() {
  //   return this.checked ?? false;
  // }

}
