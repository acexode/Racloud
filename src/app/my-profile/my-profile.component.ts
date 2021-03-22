import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { get } from 'lodash';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { PageContainerConfig } from '../shared/container/models/page-container-config.interface';
import { MessagesService } from '../shared/messages/services/messages.service';
import { InputConfig } from '../shared/rc-forms/models/input/input-config';
import { SelectConfig } from '../shared/rc-forms/models/select/select-config';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})

export class MyProfileComponent implements OnInit {
  authS$: Subscription;
  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/users';
  disableCustomerSelectField = false;
  userForm: FormGroup;
  containerConfig: PageContainerConfig = {
    closeButton: true,
    theme: 'transparent',
    shadow: false,
    panelClasses: {
      header: 'd-none',
      body: 'no-shadow',
    },
  };
  companyLabel = 'Select';
  roleLabel = 'Select'
    ;
  companyOptions = [];
  filteredOptions = [];
  roleOptions = [];
  roleConfig: SelectConfig = {
    selectLabel: {
      text: 'Role'
    },
    placeholder: 'Select'
  };
  currentCompany: string;
  userId: string;
  userCompanyId: number;
  constructor(
    private fb: FormBuilder,
    private userS: UsersService,
    private msgS: MessagesService,
    private router: Router,
  ) { }

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

  ngOnInit(): void {
    this.initForm();
    this.userS.getUserProfile().subscribe(
      (data: any) => {
        this.roleLabel = get(get(data, 'role', ''), 'name', '');
        this.companyLabel = get(get(data, 'company', ''), 'companyName', '');
        this.currentCompany = get(get(data, 'company', ''), 'companyName', '');
        this.userId = get(get(data, 'user', ''), 'id', null);
        this.userCompanyId = get(get(data, 'company', ''), 'id', null);
        this.disableCustomerSelectField = true;
        this.userForm.patchValue({
          firstName: data.user?.firstname,
          lastName: data.user?.lastname,
          email: data.user?.email,
          roleId: data.role?.id,
          companyId: data.company?.id,
        });
      },
      _error => {
        this.displayMsg('Error while trying to get your profile. Please Try again', 'danger');
      }
    );

  }
  initForm() {
    this.userForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
        ],
      ],
      lastName: [
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
      companyId: [
        '',
        [
          Validators.required,
        ],
      ],
      roleId: [
        '',
        [
          Validators.required,
        ],
      ],
      searchCompany: [
        '',
        [
          Validators.required,
        ],
      ]
    });
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
  get companyId() {
    return this.userForm.get('companyId').value;
  }
  get roleId() {
    return this.userForm.get('roleId').value;
  }
  get user() {
    return {
      firstName: this.userForm.get('firstName').value,
      lastName: this.userForm.get('lastName').value,
    };
  }
  routeToUserEdit() {
    this.router.navigate(['/users/edit-user', { id: this.userId, companyId: this.userCompanyId, backUrl: '/my-profile' }]);
  }
}

