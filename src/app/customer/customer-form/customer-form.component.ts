import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { get } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompanyTypes } from 'src/app/core/enum/companyTypes';
import { CompanyParentsService } from 'src/app/core/services/companyParents/company-parents.service';
import { CountriesService } from 'src/app/core/services/countries/countries.service';
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

export class CustomerFormComponent implements OnInit, OnChanges {
  @Input() formEditMode: boolean;
  defaultToButtons: any = {
    buttonA: 'Button A',
    buttonB: 'Button B',
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
    companyEmail: [
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
    language: [
      null,
      [
        Validators.required,
      ],
    ],
    priceListId: [
      null,
      [
        Validators.required,
      ],
    ],
  });
  textAreaConfig: TextAreaConfig = {
    textAreaLabel: {
      text: 'Address'
    },
    placeholder: 'Type Here'
  };
  countryOptions$: Observable<any>;
  customerParentOptions$: Observable<any>;
  languageOptions$: Observable<any>;
  priceListOptions$: Observable<any>;
  constructor(
    private fb: FormBuilder,
    private cS: CountriesService,
    private parentS: CompanyParentsService,
    private lgS: LanguagesService,
    private priceService: PriceListService
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
    // update form Data
    this.updateValueForForm();
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

    const data = this.editableData;

    if (typeof data !== 'undefined') {

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
        companyEmail: get(data, 'companyEmail', ''),
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
    }
  }
  updateData(): CustomerModel {
    const d = this.componentForm.value;
    const newData: CustomerModel = {
      ...d,
      parentId: Number(get(d, 'parentId', 0)),
      priceListId: Number(get(d, 'priceListId', 0)),
      // anniversaryDate: convertDateBackToUTCDate(get(d, 'anniversaryDate', '')),
      subscriptionFee: Number(get(d, 'subscriptionFee', 0)),
      supportHoursContract: Number(get(d, 'supportHoursContract', 0)),
      supportHoursAvailable: Number(get(d, 'supportHoursAvailable', 0)),
    };
    // handle full by the backend: remove if you are to create new user
    if (!this.editMode) {
      delete newData?.priceListId;
    }
    return newData;

  }
  getValue(): void {
    this.customerFormEmitter.emit(this.updateData());
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
}

