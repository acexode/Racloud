import { MessagesService } from './../shared/messages/services/messages.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { InputConfig } from '../shared/rc-forms/models/input/input-config';
import { UsersService } from '../users/users.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  resetLoading = false;
  raLogoType = 'group1';
  signUpUrl = '/signup';
  modalRef: BsModalRef;
  resetEmail = new FormControl('', [Validators.required, Validators.email]);
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
    private service: UsersService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {}
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
            this.isLoadingStatus();
          },
          err => {
            this.displayMsg('Incorrect authentication! Please try again.','danger');
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
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,  Object.assign({}, { class: 'gray modal-md' }));
  }
  sendResetPassword(){
    this.resetLoading = true
    if(this.resetEmail.valid){
      const obj = {
        email: this.resetEmail.value
      }
      this.service.sendResetPassword(obj).subscribe((e: any) =>{
        console.log(e)
        this.modalRef.hide()
        this.resetLoading = false
        this.displayMsg(e.message, 'info')
      })
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
}
