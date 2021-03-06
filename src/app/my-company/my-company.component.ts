import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { get } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompanyTypes } from '../core/enum/companyTypes';
import { AuthService } from '../core/services/auth/auth.service';
import { CountriesService } from '../core/services/countries/countries.service';
import { CustomerService } from '../core/services/customer/customer.service';
import { LanguagesService } from '../core/services/languages/languages.service';
import { AdminCompanyProfileUpdateModel } from '../customer/model/admin-company-profile-update';
import { CustomerModel } from '../customer/model/customer.model';
import { PageContainerConfig } from '../shared/container/models/page-container-config.interface';
import { MessagesService } from '../shared/messages/services/messages.service';
import { InputConfig } from '../shared/rc-forms/models/input/input-config';
import { SelectConfig } from '../shared/rc-forms/models/select/select-config';
import { TextAreaConfig } from '../shared/rc-forms/models/textarea/textarea-config';

@Component({
  selector: 'app-my-company',
  templateUrl: './my-company.component.html',
  styleUrls: ['./my-company.component.scss']
})
export class MyCompanyComponent implements OnInit, OnDestroy {
  isNotInEditMode = true;
  isLoading = false;
  edittableFields = ['firstName', 'lastName', 'email', 'companyName', 'address', 'country', 'phoneNumber'];
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
    ],
    parentId: [
      null,
    ],
    address: [
      '',
    ],
    country: [
      null,
      [
        Validators.required,
      ],
    ],
    phoneNumber: [
      '',
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ],
    ],
    anniversaryDate: [
      new Date(),
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
    ],
    priceListId: [
      null,
    ],
  });
  countryOptions$: Observable<any>;
  languageOptions$: Observable<any>;
  auth$: Subscription;
  route$: Subscription;
  fetchCompany$: Subscription;
  containerConfig: PageContainerConfig = {
    closeButton: true,
    theme: 'transparent',
    shadow: false,
    panelClasses: {
      header: 'd-none',
      body: 'no-shadow',
    },
  };
  disableField = true;
  priceListName: string;
  companyName: string;
  constructor(
    private fb: FormBuilder,
    private cS: CountriesService,
    private lgS: LanguagesService,
    private authS: AuthService,
    private customerS: CustomerService,
    private router: Router,
    private msgS: MessagesService,
  ) { } ngOnInit(): void {
    this.fetchCompany$ = this.customerS.getCustomerProfile()
      .subscribe(
        d => {
          // update form Data
          this.updateValueForForm(d);
        }
      );
    // get country option
    this.countryOptions$ = this.cS.getCountriesState().pipe(
      map(d => d.data),
    );
    // languages options
    this.languageOptions$ = this.lgS.getLanguages();
  }
  textAreaConfig(
    isDisabled: boolean = false,
  ): TextAreaConfig {
    return {
      textAreaLabel: {
        text: 'Address'
      },
      placeholder: 'Type Here',
      formStatus: {
        isDisabled,
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
      }
    };
  }
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
  updateValueForForm(data: any) {
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
        anniversaryDate: get(data, 'anniversaryDate', ''),
        subscriptionFee: get(data, 'subscriptionFee', ''),
        supportHoursContract: get(data, 'supportHoursContract', ''),
        supportHoursAvailable: get(data, 'supportHoursAvailable', ''),
        language: get(data, 'language', ''),
        priceListId: Number(get(get(data, 'priceList', {}), 'id', 0)),
      };
      this.componentForm.setValue({ ...d });
      this.setCompanyAndPriceListName(data);
    }
  }
  setCompanyAndPriceListName(data: any) {
    this.priceListName = get(get(data, 'priceList', ''), 'name', '');
    this.companyName = get(get(data, 'parent', ''), 'companyName', '');
  }
  get priceListId() {
    return this.componentForm.get('priceListId').value;
  }
  get parentId() {
    return this.componentForm.get('parentId').value;
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
  get theFormControl() {
    return this.componentForm.controls;
  }
  setDisplay(permission) {
    if (permission === 'hidden') {
      return false;
    } else {
      return true;
    }
  }
  ngOnDestroy() {
    if (this.auth$) {
      this.auth$.unsubscribe();
    }
  }
  get isAdmin() {
    const auth = this.authS.authState.value;
    const authAccount = get(auth, 'account', null);
    const role = get(authAccount, 'roles', null);
    if (role !== null || role !== '') {
      return (role.toLowerCase() === 'systemadmin' || role.toLowerCase() === 'admin')
        ? true : false;
    } else {
      return false;
    }
  }

  routeToCustomerDetailsEdit() {
    this.router.navigate(['/customer', 'manage', this.parentId, 'tab', 'details']);
  }
  enableFields() {
    this.edittableFields.forEach(field => {
      this.componentForm.get(field).enable();
    });
  }
  disableFields() {
    this.edittableFields.forEach(field => {
      this.componentForm.get(field).disable();
    });
  }
  editProfile() {
    this.enableFields();
    this.isNotInEditMode = false;
  }
  cancleProfileEditing() {
    this.disableFields();
    this.isNotInEditMode = true;
  }
  updateCompanyProfile() {
    this.isLoadingStatus();
    const d: AdminCompanyProfileUpdateModel = {
      firstName: this.componentForm.get('firstName').value,
      lastName: this.componentForm.get('lastName').value,
      email: this.componentForm.get('email').value,
      companyName: this.componentForm.get('companyName').value,
      address: this.componentForm.get('address').value,
      country: this.componentForm.get('country').value,
      phoneNumber: this.componentForm.get('phoneNumber').value,
    };
    this.customerS.updateCustomerProfile(d).subscribe(
      _resp => {
        // start porocess
        this.isLoadingStatus();
        this.displayMsg('Profile Successfully updated', 'success');
        this.cancleProfileEditing();
      },
      error => {
        this.displayMsg(error.error, 'danger');
        // start porocess
        this.isLoadingStatus();
      }
    );
  }
  isLoadingStatus() {
    this.isLoading = !this.isLoading;
  }
  displayMsg(msg: string, type: string) {
    this.msgS.addMessage({
      text: msg,
      type,
      dismissible: true,
      customClass: 'mt-32',
      hasIcon: true,
    });
    setTimeout(() => {
      this.msgS.clearMessages();
    }, 5000);
  }
}


