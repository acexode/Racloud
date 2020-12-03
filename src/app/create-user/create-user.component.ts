import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PageContainerConfig } from '../shared/container/models/page-container-config.interface';
import { InputConfig } from '../shared/rc-forms/models/input/input-config';
import { SelectConfig } from '../shared/rc-forms/models/select/select-config';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/users';
  containerConfig: PageContainerConfig = {
    closeButton: true,
    theme: 'transparent',
    shadow: false,
    panelClasses: {
      header: 'd-none',
      body: 'no-shadow',
    },
  }

  companyOptions = [
    {
      id: '',
      option: 'Select'
    },
    {
      id: 'new',
      option: 'Add new Company'
    },
    {
      id: 'pyramid',
      option: 'Pyramid'
    },
    {
      id: 'superwindows',
      option: 'Superwindows'
    },
    {
      id: 'abracadabra',
      option: 'Abracadabra SRL'
    }
  ];
  firstnameConfig: InputConfig = {
    inputLabel: {
      text: 'First Name'
    },
    type: 'text',
    placeholder: 'Type here',
  };
  lastnameConfig: InputConfig = {
    inputLabel: {
      text: 'Last Name'
    },
    type: 'text',
    placeholder: 'Type here',
  };
  emailConfig: InputConfig = {
    inputLabel: {
      text: 'Email'
    },
    type: 'email',
    placeholder: 'Type here',
  };
  companyConfig: SelectConfig = {
    selectLabel: {
      text: 'Company'
    },
    placeholder: 'Select'
  };
  roleConfig: SelectConfig = {
    selectLabel: {
      text: 'Role'
    },
    placeholder: 'Select'
  };
  userForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm()
  }
  initForm() {
    this.userForm = this.fb.group({
      firstname: [
        '',
        [
          Validators.required,
        ],
      ],
      lastname: [
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
      company: [
        '',
        [
          Validators.required,  
        ],
      ],
      role: [
        '',
        [
          Validators.required, 
        ],
      ]
    });
  }
}
