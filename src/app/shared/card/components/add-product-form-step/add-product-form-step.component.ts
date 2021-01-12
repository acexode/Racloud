import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PriceListProductManagerModel } from 'src/app/price-lists/models/price-list-product-manager.model';
import { ProductServiceService } from 'src/app/products/product-service.service';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';

@Component({
  selector: 'app-add-product-form-step',
  templateUrl: './add-product-form-step.component.html',
  styleUrls: ['./add-product-form-step.component.scss']
})
export class AddProductFormStepComponent implements OnInit, OnDestroy {
  @Output() productFormEmitter = new EventEmitter<PriceListProductManagerModel>(null);
  @Input() products: any;
  displayFormModal = true;
  displayModal$: Subscription;
  caretLeftIcon = 'assets/images/caret-left.svg';
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
      }
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
    this.displayModal$ = this.pS.getAddProductFormStepModalDisplayStatus().subscribe(status => this.displayFormModal = status);
  }
  closeModal(): void {
    this.pS.closeAddProductFormStepModal();
  }
  stopModalPropagation(event: Event): void {
    event.stopPropagation();
  }
  emitPriceListFormData() {
    this.productFormEmitter.emit(this.componentForm.value);
    this.componentForm.reset();
    this.closeModal();
  }
  ngOnDestroy(): void {
    this.displayModal$.unsubscribe();
  }

}
