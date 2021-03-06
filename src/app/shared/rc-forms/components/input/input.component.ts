import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormBuilder } from '@angular/forms';
import { InputConfig } from './../../models/input/input-config';
import { get } from 'lodash';
import { Subscription } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency/currency.service';
import { PriceListService } from 'src/app/core/services/price-list/price-list.service';
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements OnInit, ControlValueAccessor, OnDestroy {
  @Input() config: InputConfig;
  onChange: (_: any) => void;
  onTouched: () => void;
  value: any;
  formGroup = this.fb.group({
    input: this.fb.control(null),
  });
  companyCurrencyCode: any = null;
  priceListS$: Subscription;
  constructor(
    private fb: FormBuilder,
    private currencyS: CurrencyService,
    private priceListS: PriceListService
  ) { }
  writeValue(obj: any): void {
    this.value = obj;
    this.formGroup.setValue({ input: obj });
    this.formGroup.updateValueAndValidity();
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
  }
  getFieldValue() {
    const field = this.formGroup.get('input');
    return field ? field.value : null;
  }
  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe((vals) => {
      if (this.onChange) {
        this.onChange(this.getFieldValue());
      }
    });
    if (this.isDisable) {
      this.formGroup.disable();
    }
    if (!this.currency) {
      this.priceListS$ = this.priceListS.getCompanyPriceListNow().subscribe(
        d => {
          if (d) {
            this.companyCurrencyCode = d?.data?.currency ? d?.data?.currency : null;
          }
        });
    }
  }

  get isDisable() {
    return get(this.config?.formStatus, 'isDisabled', false);
  }
  get currency() {
    return get(this.config, 'currency', '');
  }
  loadCurrencySymbol(code: string): string {
    return this.currencyS.getCurrencySymbol(code);
  }
  get thePrefix() {
    if (this.currency) {
      return this.currency;
    } else {
      return this.companyCurrencyCode || 'USD';
    }
  }
  ngOnDestroy() {
    if (this.priceListS$) {
      this.priceListS$.unsubscribe();
    }
  }
}
