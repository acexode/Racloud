import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})
export class OrdersDetailsComponent implements OnInit {

  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/customer';
  containerConfig: PageContainerConfig = {
    closeButton: true,
    theme: 'transparent',
    shadow: false,
    panelClasses: {
      header: 'd-none',
      body: 'no-shadow',
    },
  };

  componentForm: FormGroup;

  controlStore: { [key: string]: AbstractControl; } = {};
  constructor(private fb: FormBuilder) { }

  selectionConfig(label: string): SelectConfig {
    return {
      selectLabel: {
        text: label || '',
      },
    };
  }
  inputConfig(
    label: string,
    type: string = 'text',
    placeholder: string = '',
    prefixIcon: boolean = false)
    : InputConfig {
    return {
      inputLabel: {
        text: label || '',
      },
      type: type || 'text',
      placeholder: placeholder || '',
      prefixIcon: prefixIcon || false,
    };
  }

  setType(e) {
    this.type.setValue(e.target.value, {
      onlySelf: true
    });
  }
  get type() {
    return this.componentForm.get('type');
  }
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.componentForm = this.fb.group({
      orderNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      customer: [
        '',
        [
          Validators.required,
        ],
      ],
      orderDate: [
        '',
        [
          Validators.required,
        ],
      ],
      status: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      value: [
        '',
        [
          Validators.required,
        ],
      ],
      discount: [
        '',
        [
          Validators.required,
          Validators.email
        ],
      ],
      totalValue: [
        '',
        [
          Validators.required,
        ],
      ],
    });
  }

}
