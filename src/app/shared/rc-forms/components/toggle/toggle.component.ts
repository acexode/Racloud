import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ToggleComponent,
      multi: true,
    },
  ],
})
export class ToggleComponent implements OnInit {

  formGroup = this.fb.group({
    toggle: this.fb.control(null),
  });

  onChange: (_: any) => void;
  onTouched: () => void;
  value: any;


  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) { }

  writeValue(obj: any): void {
    this.value = obj;
    this.formGroup.setValue({ radio: obj });
    this.formGroup.updateValueAndValidity();
    this.cdRef.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable({ emitEvent: true });
    } else {
      this.formGroup.enable({ emitEvent: true });
    }
    this.cdRef.markForCheck();
  }

  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe((vals) => {
      if (this.onChange) {
        this.onChange(this.getFieldValue());
      }
    });
  }
  getFieldValue() {
    const field = this.formGroup.get('toggle');
    return field ? field.value : null;
  }

}
