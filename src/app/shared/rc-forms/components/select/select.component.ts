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
  private vConfig: SelectConfig;
  @Input()
  set config(c: SelectConfig) {
    this.vConfig = c;
    this.updateItems();
  }
  get config() {
    return this.vConfig;
  }
  @Input() set options(opts: Array<any>) {
    this.opts = opts ? opts : [];
    this.updateItems();
  }
  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) { }

  items: BehaviorSubject<
    Array<any>
  > = new BehaviorSubject([]);
  private opts: Array<any> = [];

  formGroup = this.fb.group({
    select: this.fb.control(null),
  });

  onChange: (_: any) => void;
  onTouched: () => void;
  value: any;

  compareWithFn = (o1, o2) => {
    if (o1 && o2 && has(o1, 'id') && has(o2, 'id')) {
      try {
        return o1.id.toString() === o2.id.toString();
      } catch (err) {
        return false;
      }
    } else {
      try {
        return o1.toString() === o2.toString();
      } catch (err) {
        return false;
      }
    }
  };

  getFieldValue() {
    const field = this.formGroup.get('select');
    return field ? field.value : null;
  }

  ngOnInit() {
    this.formGroup.valueChanges.subscribe((vals) => {
      if (this.onChange) {
        this.onChange(this.getFieldValue());
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      }
    });
    if (this.isDisable) {
      this.formGroup.disable();
    }

  }
  get isDisable() {
    return get(this.config?.formStatus, 'isDisabled', false);
  }

  selectChange() {
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  updateItems() {
    const labelK = get(this.config, 'labelKey', 'option');
    const idK = get(this.config, 'idKey', 'id');
    this.opts = this.opts.length !== 0 ? this.opts : [{ id: 'id', option: 'Default', isSelected: true }];
    const items = this.opts
      .map((v) => {
        return {
          id: get(v, idK, null),
          option: get(v, labelK, null),
          isSelected: v.isSelected ? v.isSelected : false,
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

  // This fixes a bug in ion-select,
  // where update doesn't propagate after options are updated.
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
  }

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
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  filterValues(obj: any) {
    return obj;
  }

  registerOnChange(fn) {
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

  get selectField() {
    return this.formGroup.get('select');
  }

}
