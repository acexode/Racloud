import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { PriceListProductManagerModel } from 'src/app/price-lists/models/price-list-product-manager.model';
import { ProductServiceService } from 'src/app/products/product-service.service';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { get } from 'lodash';
@Component({
  selector: 'app-add-product-form-step',
  templateUrl: './add-product-form-step.component.html',
  styleUrls: ['./add-product-form-step.component.scss']
})
export class AddProductFormStepComponent implements OnInit, OnDestroy {
  @Output() productFormEmitter = new EventEmitter<PriceListProductManagerModel>(null);
  @Output() closeModalStateEmitter = new EventEmitter<boolean>(false);
  @Input() editableData!: Observable<any>;
  @Input() products: any;
  @Input() currency: string;
  displayFormModal = true;
  displayModal$: Subscription;
  caretLeftIcon = 'assets/images/caret-left.svg';
  inEditMode = false;
  editItem: any = null;
  componentForm = this.fb.group({
    productId: [
      null,
      [
        Validators.required,
      ],
    ],
    value: [
      '',
      [
        Validators.required,
      ],
    ],
    renewalValue: [
      '',
      [
        Validators.required,
      ],
    ],
    supportHours: [
      '',
      [
        Validators.required,
      ],
    ],
  });
  constructor(private fb: FormBuilder, private pS: ProductServiceService) { }
  inputConfig(
    label: string,
    type: string = 'text',
    placeholder: string = 'Type here',
    prefixIcon: boolean = false,
    isDisabled: boolean = false,
  ): InputConfig {
    return {
      inputLabel: {
        text: label || '',
      },
      type: type || 'text',
      placeholder: placeholder || '',
      prefixIcon: prefixIcon || false,
      formStatus: {
        isDisabled,
      },
      currency: this.currency,
    };
  }
  selectConfig(
    label: string,
    placeholder: string = 'Select',
    searchable: boolean = false,
    idKey: string = 'id',
    labelKey: string = 'option',
  ): SelectConfig {
    return {
      selectLabel: {
        text: label,
      },
      placeholder,
      idKey,
      labelKey,
      searchable,
    };
  }
  ngOnInit(): void {
    console.log(this.currency);
    this.editableData.subscribe(
      d => {
        if (d !== null) {
          // update form Data
          this.updateValueForForm(d);
          this.editIdManager(true, d);
        }
      }
    );
    this.displayModal$ = this.pS.getAddProductFormStepModalDisplayStatus().subscribe(status => {
      this.displayFormModal = status;
      this.closeModalStateEmitter.next(!status);
    });
  }
  updateValueForForm(data: any) {
    if (typeof data !== 'undefined') {
      // get data
      const d = {
        productId: get(data, 'productId', null),
        value: get(data, 'value', ''),
        renewalValue: get(data, 'renewalValue', ''),
        supportHours: get(data, 'supportHours', ''),
      };
      this.componentForm.setValue({ ...d });
    }
  }
  closeModal(): void {
    this.componentForm.reset();
    this.closeModalStateEmitter.next(true);
    this.editIdManager();
    this.pS.closeAddProductFormStepModal();
  }
  stopModalPropagation(event: Event): void {
    event.stopPropagation();
  }
  emitPriceListFormData() {
    if (this.inEditMode && this.editItem !== 'none') {
      this.productFormEmitter.emit({ ...this.editItem, ...this.componentForm.value });
    } else {
      this.productFormEmitter.emit(this.componentForm.value);
    }
    this.closeModal();
  }
  editIdManager(status: boolean = false, data: any = ''): void {
    this.inEditMode = true;
    this.editItem = data || 'none';
  }
  ngOnDestroy(): void {
    this.displayModal$.unsubscribe();
  }

}
