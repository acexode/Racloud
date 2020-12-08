import { HttpHeaders } from '@angular/common/http';
import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { authEndpoints } from '../core/configs/endpoints';
import { RequestService } from '../core/services/request/request.service';
import { MustMatch } from '../shared/rc-forms/helpers/must-match-validator';
import { InputConfig } from '../shared/rc-forms/models/input/input-config';
import { TextAreaConfig } from '../shared/rc-forms/models/textarea/textarea-config';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
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
    Email: ['', [Validators.required, Validators.email]],
    Password: ['', Validators.required],
    ConfirmPassword: ['', Validators.required],
    FirstName: ['', Validators.required],
    LastName: ['', Validators.required],
    CompanyName: ['', Validators.required],
    PhoneNumber: ['', Validators.required],
    CompanyEmail: ['', Validators.required],
    Address: ['', Validators.required],
    Country: ['', Validators.required],
    Language: ['', Validators.required],
  }, {
    validator: MustMatch('Password', 'ConfirmPassword')
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
  submitForm(): void {
    console.log(this.signUpForm.value, authEndpoints.customersSignUp);
    const data = {
      Address: '100, test streeet',
      Country: 'Test',
      CompanyName: 'Test',
      CompanyType: 'Fabricator',
      ConfirmPassword: 'test',
      CompanyEmail: 'test',
      Email: 'test@gmail.com',
      FirstName: 'Test',
      Language: 'Eng',
      LastName: 'Test',
      Password: 'test',
      PhoneNumber: '123456789',
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      })
    };
    this.reqS.post<any>(authEndpoints.customersSignUp, data, httpOptions)
      .subscribe(
        res => console.log(res),
        error => console.log(error)
      );

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

