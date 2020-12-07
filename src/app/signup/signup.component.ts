import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { InputConfig } from '../shared/rc-forms/models/input/input-config';
import { MessagesService } from './../shared/messages/services/messages.service';
import { TextAreaConfig } from '../shared/rc-forms/models/textarea/textarea-config';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  raLogoType = 'group1';
  emailInputConfig: InputConfig = {
    inputLabel: {
      text: 'Email'
    },
    type: 'email',
    placeholder: 'Type Here',
  };

  passwordInputConfig: InputConfig = {
    inputLabel: {
      text: 'Password'
    },
    type: 'password',
    placeholder: 'Type Here',
  };

  signUpForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    companyName: ['', Validators.required],
    companyPhone: ['', Validators.required],
    address: ['', Validators.required],
    country: ['', Validators.required],
  });
  classes = {
    body: 'p-0 d-flex justify-content-center flex-column no-gutters',
    header: 'd-none',
    footer: 'd-none',
  };
  returnUrl: '/';
  loginSubs: Subscription;

  loginUrl = '/login';
  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private aRoute: ActivatedRoute,
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

  textAreaConfig: TextAreaConfig = {
    textAreaLabel: {
      text: 'Address'
    },
    placeholder: 'Type Here'
  };

  submitForm(): void {
  }
  resetSubs() {
    if (this.loginSubs) {
      this.loginSubs.unsubscribe();
    }
  }
  ngOnDestroy(): void {
    this.resetSubs();
  }
}

