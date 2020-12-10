import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { authEndpoints } from '../core/configs/endpoints';
import { LoginResponse } from '../core/models/login-response.interface';
import { RequestService } from '../core/services/request/request.service';
import { MessagesService } from '../shared/messages/services/messages.service';
import { MustMatch } from '../shared/rc-forms/helpers/must-match-validator';
import { InputConfig } from '../shared/rc-forms/models/input/input-config';
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
    country: ['', Validators.required],
    language: ['', Validators.required],
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
  constructor(
    private fb: FormBuilder,
    private reqS: RequestService,
    private msgS: MessagesService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void { }
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
    const data = this.signUpForm.value;
    this.reqS.post<LoginResponse>(authEndpoints.customersSignUp, data)
      .subscribe(
        res => {
          this.msgS.addMessage({
            text: res.message,
            type: 'success',
            dismissible: true,
            timeout: 3000,
            customClass: 'mt-32'
          });
          // reset form
          this.signUpForm.reset();
        },
        err => {
          this.msgS.addMessage({
            text: err.error,
            type: 'danger',
            dismissible: true,
            timeout: 3000,
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

