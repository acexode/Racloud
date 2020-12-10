import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { TextAreaConfig } from 'src/app/shared/rc-forms/models/textarea/textarea-config';

@Component({
  selector: 'app-details-tab',
  templateUrl: './details-tab.component.html',
  styleUrls: ['./details-tab.component.scss']
})
export class DetailsTabComponent implements OnInit {
  @Input() detailsData: any;
  textAreaConfig: TextAreaConfig = {
    textAreaLabel: {
      text: 'Address'
    },
    placeholder: ''
  };
  componentForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(50),
      ],
    ],
    contactPerson: [
      '',
      Validators.required,
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
    address: [
      '',
      [
        Validators.required,
      ],
    ],
    country: [
      '',
      [
        Validators.required,
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
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.updateValueForForm(this.detailsData);
    console.log(this.componentForm.value);
  }
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
  updateValueForForm(data: any) {
    this.componentForm.setValue({
      ...data
    });
  }

}
