import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { authEndpoints } from '../core/configs/endpoints';
import { LoginResponse } from '../core/models/login-response.interface';
import { CountriesService } from '../core/services/countries/countries.service';
import { LanguagesService } from '../core/services/languages/languages.service';
import { RequestService } from '../core/services/request/request.service';
import { PasswordValidator } from '../core/validators/password-validator/password-validator';
import { MessagesService } from '../shared/messages/services/messages.service';
import { InputConfig } from '../shared/rc-forms/models/input/input-config';
import { SelectConfig } from '../shared/rc-forms/models/select/select-config';
import { TextAreaConfig } from '../shared/rc-forms/models/textarea/textarea-config';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  raLogoType = 'group1';
  textAreaConfig: TextAreaConfig = {
    textAreaLabel: {
      text: 'Address'
    },
    placeholder: 'Type Here'
  };

  companyTypeOptions = [
    {
      id: 1,
      option: 'Partner'
    },
    {
      id: 2,
      option: 'Reseller'
    },
    {
      id: 3,
      option: 'Fabricator'
    }
  ];

  signUpForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    companyName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    companyEmail: ['', Validators.required],
    /*  companyType: 'Fabricator', */
    address: ['', Validators.required],
    country: [null, Validators.required],
    language: [null, Validators.required],
  }, {
    validator: PasswordValidator.mismatchedPasswords('password', 'confirmPassword')
  });
  classes = {
    body: 'p-0 d-flex justify-content-center flex-column no-gutters',
    header: 'd-none',
    footer: 'd-none',
  };
  returnUrl: '/';
  signUpSubs: Subscription;

  loginUrl = '/login';
  languageOptions$: Observable<any>;
  countryOptions$: Observable<any>;
  constructor(
    private fb: FormBuilder,
    private reqS: RequestService,
    private msgS: MessagesService,
    private cdRef: ChangeDetectorRef,
    private routerS: Router,
    private cS: CountriesService,
    private lgS: LanguagesService,
  ) { }

  ngOnInit(): void {
    this.countryOptions$ = this.cS.getCountriesState().pipe(
      map(d => d.data),
    );

    this.languageOptions$ = this.lgS.getLanguages();
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

  isLoadingStatus() {
    this.isLoading = !this.isLoading;
  }
  submitForm(): void {
    /* loading */
    this.isLoadingStatus();
    /*  */
    const data = {
      ...this.signUpForm.value,
    };
    this.reqS.post<LoginResponse>(authEndpoints.customersSignUp, data)
      .subscribe(
        res => {
          this.displayMsg(res.message,'success');
          // reset form
          this.signUpForm.reset();
          /* loading */
          this.isLoadingStatus();
          /*  */
          // redirect to login page
          this.routerS.navigateByUrl('/login');
        },
        err => {
          this.displayMsg(err.error,'danger');
          this.signUpForm.markAllAsTouched();
          this.signUpForm.updateValueAndValidity();
          this.cdRef.markForCheck();
          /* loading */
          this.isLoadingStatus();
          /*  */
        },
        () => console.log('HTTP request completed.')
      );

  }
  resetSubs() {
    if (this.signUpSubs) {
      this.signUpSubs.unsubscribe();
    }
  }
  displayMsg(msg, type){
    this.msgS.addMessage({
      text: msg,
      type,
      dismissible: true,
      customClass: 'mt-32',
      hasIcon: true,
    });
    setTimeout(()=> {
      this.msgS.clearMessages()
    },5000)
  }
  ngOnDestroy(): void {
    this.resetSubs();
  }
}

