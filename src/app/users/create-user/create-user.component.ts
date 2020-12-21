import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/users';
  isEdit = false;
  user = {}
  containerConfig: PageContainerConfig = {
    closeButton: true,
    theme: 'transparent',
    shadow: false,
    panelClasses: {
      header: 'd-none',
      body: 'no-shadow',
    },
  }
  companyLabel = 'Select';
  roleLabel = 'Select'
  ;
  companyOptions = [
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
  roleOptions = [
    {
      id: 'user',
      option: 'User'
    },
    {
      id: 'administrator',
      option: 'Administrator'
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
  constructor(private fb: FormBuilder, private router : Router,
    private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.initForm();
    if(id){
      this.isEdit = true;
      this.http.get('./assets/role.json').subscribe((obj:any) =>{
        const data = obj.filter(e => e.id.toString() === id)[0];
        this.user = data;
        this.userForm.patchValue({
          firstname: data.first_name,
          lastname: data.last_name,
          email: data.email,
          role: data.role,
          company: data.company,
        });
        this.companyLabel = data?.company || 'Select';
        this.roleLabel = data.role;
      });
    }
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
  addCompany(){
      this.router.navigate(['/users']);
  }
  setCompany(company){
    this.userForm.get('company').setValue(company);
    this.companyLabel = company;
  }
  setRole(role){
    this.userForm.get('company').setValue(role);
    this.companyLabel = role;
  }
  submit(){
    console.log(this.userForm.value)
  }

}
