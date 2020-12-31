import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompanyTypes } from 'src/app/core/models/companyTypes';
import { CompanyParentsService } from 'src/app/core/services/companyParents/company-parents.service';
import { CountriesService } from 'src/app/core/services/countries/countries.service';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
@Component({
  selector: 'app-edit-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {
  formButtonConfig: any = {
    buttonA: 'Update',
    buttonB: 'Cancle',
  }
  isLoading = false;
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
  typeOptions = Object.keys(CompanyTypes).map(companyType => {
    return {
      id: companyType,
      option: CompanyTypes[companyType]
    };
  });
  countryOptions: any;
  customerParentOptions: any;
  countryOptions$: Subscription;
  customerParentOptions$: Subscription;

  componentForm: FormGroup;

  controlStore: { [key: string]: AbstractControl; } = {};
  constructor(
    private fb: FormBuilder,
    private cS: CountriesService,
    private parentS: CompanyParentsService
  ) { }

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
  }

  initForm() {
    this.componentForm = this.fb.group({
      companyName: [
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
      parentId: [
        '',
        [
          Validators.required,
        ],
      ],
      country: [
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

  submitData(data: any) {
    console.log(data);
  }

  ngOnDestroy(): void {
    this.countryOptions$.unsubscribe();
    this.customerParentOptions$.unsubscribe();
  }


}
