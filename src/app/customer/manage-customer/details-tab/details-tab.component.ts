import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { TextAreaConfig } from 'src/app/shared/rc-forms/models/textarea/textarea-config';
import { get } from 'lodash';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
  countryJsonDataUrl = './assets/list-of-countries.json';
  countryOptions$: Observable<any>;
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
    parentCompanyName: [
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
  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.countryOptions$ = this.getJSON(this.countryJsonDataUrl);
    this.updateValueForForm(this.detailsData);
  }
  getJSON(urlPath: string): Observable<any> {
    return this.http.get(urlPath);
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
    const d = {
      name: get(data, 'companyName', ''),
      contactPerson: `${ get(data, 'firstName', '') } ${ get(data, 'firstName', '') }`,
      companyType: get(data, 'companyType', 'Fabricator').toLowerCase(),
      parentCompanyName: get(get(data, 'parent', ''), 'companyName', ''),
      address: get(data, 'address', ''),
      country: get(data, 'country', ''),
      phoneNumber: get(data, 'phoneNumber', ''),
      email: get(data, 'email', ''),
      anniversaryDate: get(data, 'anniversaryDate', ''),
      subscriptionFee: get(data, 'subscriptionFee', ''),
      supportHoursContract: get(data, 'supportHoursContract', ''),
      supportHoursAvailable: get(data, 'supportHoursAvailable', ''),
    };
    console.log(d);
    this.componentForm.setValue({...d});
  }
}
