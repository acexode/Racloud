import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { InputConfig } from '../shared/rc-forms/models/input/input-config';
import { SelectConfig } from '../shared/rc-forms/models/select/select-config';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
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
          Validators.minLength(10),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
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
      ],
    });
  }


}
