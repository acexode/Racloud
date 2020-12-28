import { MessagesService } from './../shared/messages/services/messages.service';
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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  raLogoType = 'group1';
  signUpUrl = '/signup';
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

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  classes = {
    body: 'p-0 d-flex justify-content-center flex-column no-gutters',
    header: 'd-none',
    footer: 'd-none',
  };
  returnUrl: '/';
  loginSubs: Subscription;
  constructor(
    private fb: FormBuilder,
    private authS: AuthService,
    private cdRef: ChangeDetectorRef,
    private aRoute: ActivatedRoute,
    private msgS: MessagesService,
  ) { }

  ngOnInit(): void { }
  isLoadingStatus() {
    this.isLoading = !this.isLoading;
  }
  submitForm() {
    /* loading */
    this.isLoadingStatus();
    /*  */
    const formV = this.loginForm.value;

    if (this.loginForm.valid) {
      this.resetSubs();
      this.loginSubs = this.authS
        .login({
          email: formV.email,
          password: formV.password,
          aRoute: this.aRoute,
        })
        .subscribe(
          res => {
            console.log('HTTP response', res);
            this.isLoadingStatus();
          },
          err => {
            this.msgS.addMessage({
              text: 'Date de autentificare incorecte! Va rugam sa reincercati.',
              type: 'danger',
              dismissible: true,
              timeout: 3000,
              customClass: 'mt-32'
            });
            this.loginForm.markAllAsTouched();
            this.loginForm.updateValueAndValidity();
            this.cdRef.markForCheck();
            this.isLoadingStatus();
          },
          () => console.log('HTTP request completed.')
        );
    } else {
      this.loginForm.updateValueAndValidity();
      this.cdRef.markForCheck();
      this.isLoadingStatus();
    }
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
