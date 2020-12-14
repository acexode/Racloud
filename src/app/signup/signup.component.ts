import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { authEndpoints } from '../core/configs/endpoints';
import { LoginResponse } from '../core/models/login-response.interface';
import { RequestService } from '../core/services/request/request.service';
import { MessagesService } from '../shared/messages/services/messages.service';
import { MustMatch } from '../shared/rc-forms/helpers/must-match-validator';
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
    validator: MustMatch('password', 'confirmPassword')
  });
  classes = {
    body: 'p-0 d-flex justify-content-center flex-column no-gutters',
    header: 'd-none',
    footer: 'd-none',
  };
  returnUrl: '/';
  signUpSubs: Subscription;

  loginUrl = '/login';
  languageJsonDataUrl = './assets/languages.json';
  languageOptions$: Observable<any>;
  countryJsonDataUrl = './assets/list-of-countries.json';
  countryOptions$: Observable<any>;
  // countryOptions$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  constructor(
    private fb: FormBuilder,
    private reqS: RequestService,
    private msgS: MessagesService,
    private cdRef: ChangeDetectorRef,
    private routerS: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.countryOptions$ = this.getJSON(this.countryJsonDataUrl);

    this.languageOptions$ = this.getJSON(this.languageJsonDataUrl)
      .pipe(
        map(lang => Object.keys(lang).map(langKey => lang[langKey])),
      );
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
  getJSON(urlPath: string): Observable<any> {
    return this.http.get(urlPath);
  }
  submitForm(): void {
    /* loading */
    this.isLoadingStatus();
    /*  */
    const data = this.signUpForm.value;
    this.reqS.post<LoginResponse>(authEndpoints.customersSignUp, data)
      .subscribe(
        res => {
          this.msgS.addMessage({
            text: res.message,
            type: 'success',
            dismissible: true,
            timeout: 5000,
            customClass: 'mt-32'
          });
          // reset form
          this.signUpForm.reset();
          // redirect to login page
          this.routerS.navigateByUrl('/login');
        },
        err => {
          this.msgS.addMessage({
            text: err.error,
            type: 'danger',
            dismissible: true,
            timeout: 5000,
            customClass: 'mt-32'
          });
          this.signUpForm.markAllAsTouched();
          this.signUpForm.updateValueAndValidity();
          this.cdRef.markForCheck();
        },
        () => console.log('HTTP request completed.')
      );
    /* loading */
    this.isLoadingStatus();
    /*  */
  }
  resetSubs() {
    if (this.signUpSubs) {
      this.signUpSubs.unsubscribe();
    }
  }
  ngOnDestroy(): void {
    this.resetSubs();
  }
}

