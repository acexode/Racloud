import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { get } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompanyTypes } from 'src/app/core/enum/companyTypes';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CompanyParentsService } from 'src/app/core/services/companyParents/company-parents.service';
import { CountriesService } from 'src/app/core/services/countries/countries.service';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { LanguagesService } from 'src/app/core/services/languages/languages.service';
import { PriceListService } from 'src/app/core/services/price-list/price-list.service';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { TextAreaConfig } from 'src/app/shared/rc-forms/models/textarea/textarea-config';
import { CustomerModel } from '../model/customer.model';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CustomerFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() formEditMode: boolean;
  defaultToButtons: any = {
    buttonA: 'Button A',
    buttonB: {
      name: 'Button B',
      link: '/customer'
    }
  };
  @Input() buttonConfig: {
    buttonA: string;
    buttonB: string;
  };
  @Output() customerFormEmitter = new EventEmitter();
  isLoading: boolean;
  @Input() set loadingStatus(status: boolean) {
    this.isLoading = status;
  };
  @Input() editableData!: any;
  fieldsPermission: any;
  actionPermission: any;
  backUrl = '/customer';

  typeOptions = Object.keys(CompanyTypes).map(companyType => {
    return {
      id: companyType,
      option: CompanyTypes[companyType]
    };
  });
  componentForm = this.fb.group({
    companyName: [
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
      null,
      [
        Validators.required,
      ],
    ],
    parentId: [
      null,
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
      null,
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
    ],
    subscriptionFee: [
      '',
    ],
    supportHoursContract: [
      '',
    ],
    supportHoursAvailable: [
      '',
    ],
    language: [
      null,
      [
        Validators.required,
      ],
    ],
    priceListId: [
      null,
    ],
  });
  countryOptions$: Observable<any>;
  customerParentOptions$: Observable<any>;
  languageOptions$: Observable<any>;
  priceListOptions$: Observable<any>;
  auth$: Subscription;

  getCustomerPriceList$: Subscription;
  constructor(
    private fb: FormBuilder,
    private cS: CountriesService,
    private parentS: CompanyParentsService,
    private lgS: LanguagesService,
    private priceService: PriceListService,
    private authS: AuthService,
    private customerS: CustomerService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    // this.componentForm.valueChanges.subscribe(d => {});
  }
  ngOnInit(): void {
    // get country option
    this.countryOptions$ = this.cS.getCountriesState().pipe(
      map(d => d.data),
    );
    // get customer parent options
    this.customerParentOptions$ = this.parentS.getParents();
    // languages options
    this.languageOptions$ = this.lgS.getLanguages();
    // price listing options
    this.priceListOptions$ = this.priceService.getPriceLists();
    if (typeof this.editableData !== 'undefined') {
      console.log(this.editableData.schema.fields);
      this.fieldsPermission = this.editableData.schema.fields;
      this.actionPermission = this.editableData.schema.actions;
    }
    // update form Data
    this.updateValueForForm();
  }
  textAreaConfig(
    isDisabled: boolean = false,
    formControl: AbstractControl = null
  ): TextAreaConfig {
    return {
      textAreaLabel: {
        text: 'Address'
      },
      placeholder: 'Type Here',
      formStatus: {
        isDisabled,
        isError: this.checkStatusOfForm(formControl),
      }
    };
  }
  selectConfig(
    label: string,
    placeholder: string = 'Select',
    searchable: boolean = false,
    idKey: string = 'id',
    labelKey: string = 'option',
    isDisabled: boolean = false,
    formControl: AbstractControl = null,
  ): SelectConfig {
    return {
      selectLabel: {
        text: label,
      },
      placeholder,
      idKey,
      labelKey,
      searchable,
      formStatus: {
        isDisabled,
        isError: this.checkStatusOfForm(formControl),
      }
    };
  }
  inputConfig(
    label: string,
    type: string = 'text',
    placeholder: string = 'Type here',
    prefixIcon: boolean = false,
    isDisabled: boolean = false,
    formControl: AbstractControl = null,
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
        isError: this.checkStatusOfForm(formControl),
      }
    };
  }
  get editMode() {
    return this.formEditMode || false;
  }
  updateValueForForm() {
    if (typeof this.editableData !== 'undefined') {
      const data = this.editableData.customer;
      // get data
      const d: CustomerModel = {
        companyName: get(data, 'companyName', ''),
        firstName: get(data, 'firstName', ''),
        lastName: get(data, 'lastName', ''),
        email: get(data, 'email', ''),
        companyType: get(data, 'companyType', 'Fabricator').toLowerCase() || 'fabricator',
        parentId: get(get(data, 'parent', ''), 'id', ''),
        address: get(data, 'address', ''),
        country: get(data, 'country', ''),
        phoneNumber: get(data, 'phoneNumber', ''),
        // anniversaryDate: getUTCLongMonthDate(get(data, 'anniversaryDate', '')),
        anniversaryDate: get(data, 'anniversaryDate', ''),
        subscriptionFee: get(data, 'subscriptionFee', ''),
        supportHoursContract: get(data, 'supportHoursContract', ''),
        supportHoursAvailable: get(data, 'supportHoursAvailable', ''),
        language: get(data, 'language', ''),
        priceListId: Number(get(get(data, 'priceList', {}), 'id', 0)),
      };
      this.componentForm.setValue({ ...d });
      this.componentForm.markAllAsTouched();
      this.componentForm.updateValueAndValidity();
    } else {
      // set companyType to fabricator
      this.setCompanyType('fabricator');
      // get details from authorization
      this.auth$ = this.authS.getAuthState().subscribe(e => {
        const account = get(e, 'account', null);
        const company = get(account, 'company', null);
        const companyParentId = get(company, 'id', null);
        if (companyParentId) {
          // set parent
          this.setParent(companyParentId);
          // for pricelist
          this.getCustomerPriceList$ = this.customerS.getCustomerById(companyParentId).subscribe(
            resp => {
              const customer = get(resp, 'customer', null);
              const priceList = get(customer, 'priceList', null);
              const priceListId: number = get(priceList, 'id', null);
              if (priceListId) {
                this.setPriceList(priceListId);
              }
            },
          );
        }
      });
    }
  }
  setCompanyType(companyType: string) {
    this.componentForm.get('companyType').setValue(companyType);
  }
  setParent(parentId: number) {
    this.componentForm.get('parentId').setValue(parentId);
  }
  setPriceList(priceListId: number) {
    this.componentForm.get('priceListId').setValue(priceListId);
  }
  get priceListPlaceHolder() {
    return this.formEditMode ? 'Select Price List' : 'Price List Defaulfted to Parent';
  }
  updateData(): CustomerModel {
    const d = this.componentForm.value;
    const newData: CustomerModel = {
      ...d,
      parentId: Number(get(d, 'parentId', 0)),
      priceListId: Number(get(d, 'priceListId', 0)),
      companyEmail: get(d, 'email', ''),
      // anniversaryDate: convertDateBackToUTCDate(get(d, 'anniversaryDate', '')),
      subscriptionFee: Number(get(d, 'subscriptionFee', 0)),
      supportHoursContract: Number(get(d, 'supportHoursContract', 0)),
      supportHoursAvailable: Number(get(d, 'supportHoursAvailable', 0)),
    };
    // handle full by the backend: remove if you are to create new user
    /*  i commented this out (the client requested that they should be able to change pricelist on customer creation)
    if (!this.editMode) {
      delete newData?.priceListId;
    } */
    return newData;

  }
  getValue(): void {
    if (this.componentForm.valid) {
      this.customerFormEmitter.emit(this.updateData());
    } else {
      this.componentForm.markAllAsTouched();
      this.markDirty();
      this.componentForm.updateValueAndValidity();
    }

  }

  get buttons() {
    if (typeof this.buttonConfig === 'undefined') {
      return this.defaultToButtons;
    } else {
      return this.buttonConfig;
    }
  }
  get theFormControl() {
    return this.componentForm.controls;
  }
  checkStatusOfForm(passedInFormControl: any) {
    return this.editMode ?
      ((passedInFormControl.invalid && passedInFormControl.touched) ? true : false)
      :
      ((passedInFormControl.invalid && passedInFormControl.dirty) ? true : false);
  }
  markDirty() {
    this.markGroupDirty(this.componentForm);
  }
  markGroupDirty(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      switch (formGroup.get(key).constructor.name) {
        case 'FormGroup':
          this.markGroupDirty(formGroup.get(key) as FormGroup);
          break;
        case 'FormArray':
          this.markArrayDirty(formGroup.get(key) as FormArray);
          break;
        case 'FormControl':
          this.markControlDirty(formGroup.get(key) as FormControl);
          break;
      }
    });
  }
  markArrayDirty(formArray: FormArray) {
    formArray.controls.forEach(control => {
      switch (control.constructor.name) {
        case 'FormGroup':
          this.markGroupDirty(control as FormGroup);
          break;
        case 'FormArray':
          this.markArrayDirty(control as FormArray);
          break;
        case 'FormControl':
          this.markControlDirty(control as FormControl);
          break;
      }
    });
  }
  markControlDirty(formControl: FormControl) {
    formControl.markAsDirty();
  }
  setDisplay(permission) {
    if (permission === 'hidden') {
      return false;
    } else {
      return true;
    }
  }
  get activateBtn() {
    if (this.formEditMode && this.actionPermission) {
      return this.actionPermission?.update !== 'full' ? true : false;
    } else {
      // user want to create
      return this.formEditMode;
    }
  }
  ngOnDestroy() {
    if (this.auth$) {
      this.auth$.unsubscribe();
    }
    if (this.getCustomerPriceList$) {
      this.getCustomerPriceList$.unsubscribe();
    }
  }
}

