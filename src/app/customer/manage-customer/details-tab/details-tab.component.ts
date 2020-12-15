import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { baseEndpoints } from 'src/app/core/configs/endpoints';
import { RequestService } from 'src/app/core/services/request/request.service';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { TextAreaConfig } from 'src/app/shared/rc-forms/models/textarea/textarea-config';
import { get } from 'lodash';
@Component({
  selector: 'app-details-tab',
  templateUrl: './details-tab.component.html',
  styleUrls: ['./details-tab.component.scss']
})
export class DetailsTabComponent implements OnInit, OnDestroy {
  @Input() detailsData: any;
  textAreaConfig: TextAreaConfig = {
    textAreaLabel: {
      text: 'Address'
    },
    placeholder: ''
  };

  typeOptions = [
    {
      id: 'fabricator',
      option: 'Fabricator'
    },
    {
      id: 'reseller',
      option: 'Reseller'
    },
    {
      id: 'partner',
      option: 'Partner'
    }
  ];
  parentOptions = [
    {
      id: 'mock',
      option: 'Mock'
    },
    {
      id: 'softescu',
      option: 'Softescu'

    },
    {
      id: 'pyramid',
      option: 'Pyramid'
    }
  ];
  countryOptions = [
    {
      id: 'mock',
      option: 'Mock'
    },
    {
      id: 'netherlands',
      option: 'Netherlands'
    }
  ];
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
    companyType: [
      '',
      [
        Validators.required,
      ],
    ],
    companyName: [
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
    phoneNumber: [
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
  route$: Subscription;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private reqS: RequestService) { }

  ngOnInit(): void {
    this.route$ = this.route.params.subscribe(
      params => {
        const id = params.id;
        this.reqS.get<any>(`${ baseEndpoints.customers }/${ id }`).subscribe(res => {
          console.log(res);
          this.updateValueForForm(res);
        });
      }
    );
  }
  selectionConfig(label: string): SelectConfig {
    return {
      selectLabel: {
        text: label
      },
      idKey: 'id',
      labelKey: 'option',
      formStatus: {
        isFilled: true,
      }
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
      // ...data,
      name: get(data, 'firstName', ''),
      contactPerson: get(data, 'contactPerson', ''),
      companyType: get(data, 'companyType', 'Fabricator').toLowerCase(),
      companyName: get(data, 'companyName', ''),
      address: get(data, 'address', ''),
      country: get(data, 'country', ''),
      phoneNumber: get(data, 'phoneNumber', ''),
      email: get(data, 'email', ''),
      anniversaryDate: get(data, 'anniversaryDate', ''),
      subscriptionFee: get(data, 'subscriptionFee', ''),
      supportHoursContract: get(data, 'supportHoursContract', ''),
      supportHoursAvailable: get(data, 'supportHoursAvailable', ''),
    });
  }
  updateProfile() {
    console.log(this.componentForm.value);
  }
  ngOnDestroy(): void {
    this.route$.unsubscribe();
  }
}
