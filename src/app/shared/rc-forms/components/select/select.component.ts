import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { get, has } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { SelectConfig } from '../../models/select/select-config';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectComponent,
      multi: true,
    },
  ],
})
export class SelectComponent implements OnInit, ControlValueAccessor {

  @Input() config: SelectConfig;
  @Input() set options(opts: Array<any>) {
    this.opts = opts ? opts : [];
    this.updateItems();
  };
  items: BehaviorSubject<
    Array<{
      id: any;
      option: string;
    }>
  > = new BehaviorSubject([]);
  private opts: Array<any> = [];
  @Input() formControl: FormControl;
  @Input() formControlName: string;
  value: any;
  onChange: (_: any) => void;
  onTouched: () => void;
  formGroup = this.fb.group({
    select: this.fb.control(null),
  });
  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef, public controlContainer: ControlContainer) { }
  writeValue(obj: any): void {
    let value = this.value;
    this.value = obj;
    const force = this.config
      ? get(this.config, 'forceListItems', false)
      : false;
    if (force) {
      value = this.filterValues(obj);
    } else {
      value = obj;
    }
    this.formGroup.setValue({ select: obj });
    this.formGroup.updateValueAndValidity();
    this.setCustomError();
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }
  setCustomError() {
    const hasErr = this.parentControl
      ? !get(this.parentControl, 'valid', true)
      : false;
    if (hasErr) {
      this.inputControl.setErrors({ INVALID_INPUT: true });
    }
  }
  filterValues(obj: any) {
    return obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled || this.inputReadonly) {
      this.formGroup.disable({ emitEvent: true });
    } else {
      this.formGroup.enable({ emitEvent: true });
    }
    this.setCustomError();
    this.cdRef.markForCheck();
  }

  updateItems() {
    const labelK = get(this.config, 'labelKey', 'option');
    const idK = get(this.config, 'idKey', 'id');
    const items = this.opts
      .map((v) => {
        return {
          id: get(v, idK, null),
          option: get(v, labelK, null),
        };
      })
      .filter((vv) => {
        return get(vv, 'id', null) !== null;
      });
    this.items.next(items);
    this.afterOptionsUpdate();
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    if (this.inputReadonly) {
      this.inputControl.disable();
    }
    this.formGroup.valueChanges.subscribe((vals) => {
      if (this.onChange) {
        this.onChange(this.getFieldValue());
        this.setCustomError();
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      }
    });
  }
  getFieldValue() {
    const field = this.formGroup.get('select');
    return field ? field.value : null;
  }
  afterOptionsUpdate() {
    if (this.selectField) {
      this.selectField.patchValue(null, {
        onlySelf: true,
        emitEvent: false,
      });
      this.selectField.patchValue(this.value, {
        onlySelf: true,
        emitEvent: false,
      });
    }
    this.setCustomError();
  }
  selectChange(value: any) {
    this.setCustomError();
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }
  compareWithFn = (o1, o2) => {
    if (o1 && o2 && has(o1, 'id') && has(o2, 'id')) {
      try {
        return (
          o1.id.toString().toLowerCase().trim() ===
          o2.id.toString().toLowerCase().trim()
        );
      } catch (err) {
        return false;
      }
    } else {
      try {
        return (
          o1.toString().toLowerCase().trim() ===
          o2.toString().toLowerCase().trim()
        );
      } catch (err) {
        return false;
      }
    }
  };
  // get ahold of FormControl instance no matter formControl or formControlName is given.;
  // If formControlName is given, then controlContainer.control is the parent FormGroup/FormArray instance.
  get parentControl() {
    return (
      this.formControl ||
      this.controlContainer.control.get(this.formControlName)
    );
  }

  get inputControl() {
    return this.formGroup.get('select');
  }

  get inputReadonly() {
    return (
      get(this.config, 'readonly', false) ||
      get(this.parentControl, 'readonly', false)
    );
  }
  get selectField() {
    return this.formGroup.get('select');
  }
  getVal(event) {}
}
