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
import { InputConfig } from '../shared/inputs/models/Input-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {

  config: InputConfig = {
    inputLabel: {
      text: 'label'
    },
    type: 'text',
    placeholder: 'Default'
  };
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  classes = {
    body: 'p-0 d-flex justify-content-center flex-column',
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

  submitForm() {
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
          res => console.log('HTTP response', res),
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
          },
          () => console.log('HTTP request completed.')
        );
    } else {
      this.loginForm.updateValueAndValidity();
      this.cdRef.markForCheck();
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
