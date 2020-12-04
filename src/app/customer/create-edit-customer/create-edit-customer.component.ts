import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
@Component({
  selector: 'app-create-edit-customer',
  templateUrl: './create-edit-customer.component.html',
  styleUrls: ['./create-edit-customer.component.scss']
})
export class CreateEditCustomerComponent implements OnInit {

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
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      type: [
        '',
        [
          Validators.required,
        ],
      ],
      parent: [
        '',
        [
          Validators.required,
        ],
      ],
      city: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ],
      ],
      anniversaryDate: [
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
      supportHoursContract: [
        '',
        [
          Validators.required,
        ],
      ],
      supportHoursAvailable: [
        '',
        [
          Validators.required,
        ],
      ],
    });
  }


}
