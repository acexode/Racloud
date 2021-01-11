import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';

@Component({
  selector: 'app-add-product-form-step',
  templateUrl: './add-product-form-step.component.html',
  styleUrls: ['./add-product-form-step.component.scss']
})
export class AddProductFormStepComponent implements OnInit {
  displayFormModal = true;
  isLoading = false;
  caretLeftIcon = 'assets/images/caret-left.svg';
  componentForm = this.fb.group({
    initialFee: [
      '',
      [
        Validators.required,
      ],
    ],
    subscriptionFee: [
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
  constructor(private fb: FormBuilder) { }
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

  ngOnInit(): void {
  }
  closeModal(): void {
  }
  stopModalPropagation(event: Event): void {
    event.stopPropagation();
  }

}
