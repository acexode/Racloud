import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { TextAreaConfig } from 'src/app/shared/rc-forms/models/textarea/textarea-config';
import { get } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { CountriesService } from 'src/app/core/services/countries/countries.service';
import { CompanyParentsService } from 'src/app/core/services/companyParents/company-parents.service';
import { CompanyTypes } from 'src/app/core/models/companyTypes';
import { RequestService } from 'src/app/core/services/request/request.service';
import { baseEndpoints } from 'src/app/core/configs/endpoints';
import { convertDateBackToUTCDate, getUTCLongMonthDate } from 'src/app/core/helpers/dateHelpers';
@Component({
  selector: 'app-details-tab',
  templateUrl: './details-tab.component.html',
  styleUrls: ['./details-tab.component.scss']
})
export class DetailsTabComponent implements OnInit, OnDestroy {
  dd = '1970-01-01T00:00:00.000Z';
  isLoading = false;
  @Input() detailsData: any;
  textAreaConfig: TextAreaConfig = {
    textAreaLabel: {
      text: 'Address'
    },
    placeholder: ''
  };

  typeOptions = Object.keys(CompanyTypes).map(companyType => {
    return {
      id: companyType,
      option: CompanyTypes[companyType]
    };
  });
  componentForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(50),
      ],
    ],
    firstName: [
      '',
      Validators.required,
    ],
    lastName: [
      '',
      Validators.required,
    ],
    companyType: [
      '',
      [
        Validators.required,
      ],
    ],
    parentId: [
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
  countryOptions: any;
  customerParentOptions: any;
  countryOptions$: Subscription;
  customerParentOptions$: Subscription;
  updateProfile$: Subscription;
  detailsId: any;
  constructor(
    private fb: FormBuilder,
    private reqS: RequestService,
    private cS: CountriesService,
    private parentS: CompanyParentsService
  ) { }
  isLoadingStatus() {
    this.isLoading = !this.isLoading;
  }
  ngOnInit(): void {
    // get country option
    this.countryOptions$ = this.cS.getCountries().subscribe(
      (res: { code: string, name: string; }) => {
        this.countryOptions = res;
      },
      err => { }
    );
    // get customer parent options
    this.customerParentOptions$ = this.parentS.getParents().subscribe(
      (res: any) => {
        this.customerParentOptions = res;
      },
      err => { }
    );
    // get details ID
    this.detailsId = get(this.detailsData, 'id', null);

    // update form Data
    console.log(getUTCLongMonthDate(get(this.detailsData, 'anniversaryDate', null)));
    this.updateValueForForm(this.detailsData);
    convertDateBackToUTCDate('1 January, 2020');

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
  updateValueForForm(data: any) {
    const d = {
      name: get(data, 'companyName', ''),
      firstName: get(data, 'firstName', ''),
      lastName: get(data, 'lastName', ''),
      companyType: get(data, 'companyType', 'Fabricator').toLowerCase(),
      parentId: get(get(data, 'parent', ''), 'id', ''),
      address: get(data, 'address', ''),
      country: get(data, 'country', ''),
      phoneNumber: get(data, 'phoneNumber', ''),
      email: get(data, 'email', ''),
      anniversaryDate: getUTCLongMonthDate(get(data, 'anniversaryDate', '')),
      subscriptionFee: get(data, 'subscriptionFee', ''),
      supportHoursContract: get(data, 'supportHoursContract', ''),
      supportHoursAvailable: get(data, 'supportHoursAvailable', ''),
    };
    this.componentForm.setValue({ ...d });
  }
  getUpdatedData(): Observable<any> {
    const d = this.componentForm.value;
    const newData = {
      ...d,
      anniversaryDate: convertDateBackToUTCDate(get(d, 'anniversaryDate', '')),
      id: this.detailsId,
      contactPersonName: get(d, 'firstName', 'empty'),
      language: get(this.detailsData, 'language', ''),
      companyEmail: get(this.detailsData, 'companyEmail', ''),
      companyName: get(this.detailsData, 'companyName', ''),
    };
    const queryEndpoint = `${ baseEndpoints.customers }/${ this.detailsId }`;
    return this.reqS.put(queryEndpoint, newData);
  }
  updateProfile(): void {
    // loadingIndicator
    this.isLoadingStatus();
    this.updateProfile$ = this.getUpdatedData().subscribe(
      res => {
        // sucessfully updated
        alert('Sucessfully updated profile');
        // stop loading
        this.isLoadingStatus();
      },
      err => {
        console.log(err);
        // stop loading
        this.isLoadingStatus();
      }
    );
  }
  ngOnDestroy(): void {
    this.countryOptions$.unsubscribe();
    this.customerParentOptions$.unsubscribe();
  }
}
