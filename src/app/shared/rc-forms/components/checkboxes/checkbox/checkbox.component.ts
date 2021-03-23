import { CheckboxConfig } from './../../../models/checkbox/checkbox-config';
import { Component, ElementRef, forwardRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
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
  @ViewChild('input', {static: true, read: ElementRef})
  inputElementRef: ElementRef;

  checked = this.config.checked
  constructor(private _renderer: Renderer2) { }


  onInputChange = () => {
    const value = this.inputElementRef.nativeElement.checked;
    this.onChange(value)
    console.log(value)
  };

  onTouched = () => { };
  onChange = _ => {};

  writeValue(value: any): void {
    console.log(value)
    this._renderer.setProperty(this.inputElementRef.nativeElement, 'value', value);
    // this.checked = value ? value : false
  }

  registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }

  registerOnTouched(fn: () => {}): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this.inputElementRef.nativeElement, 'disabled', isDisabled);
  }

  ngOnInit(): void {
    console.log(this.config)
  }


}
