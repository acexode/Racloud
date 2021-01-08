import { UsersService } from './../users.service';
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
  user = null;
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
  companyOptions = [];
  roleOptions = [];
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
    private route: ActivatedRoute, private service: UsersService) { }

  ngOnInit(): void {
    this.service.getRoles().subscribe((res:any[]) =>{
      console.log(res)
      this.roleOptions = res[0]
      this.companyOptions = res[1]
    })
    const id = this.route.snapshot.paramMap.get('id');
    this.initForm();
    if(id){
      this.isEdit = true;
      const idx = parseInt(id, 10)
      this.service.getUser(id).subscribe((data:any) =>{
        // const data = obj.filter(e => e.user.id.toString() === id)[0];
        console.log(data)
        this.user = data.user;
        this.userForm.patchValue({
          firstName: data.user.firstname,
          lastName: data.user.lastname,
          email: data.user.email,
          roleId: data.role.id,
          companyId: data.company.id,
        });
        if(this.companyOptions.length){
          const company = this.companyOptions.filter(e => e.id.toString() === data.company.id)[0]
          this.companyLabel = company?.companyName || 'Select';
        }
        this.roleLabel = data.role.name;
      });
    }
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
      ]
    });
  }
  addCompany(){
      this.router.navigate(['/users']);
  }
  setCompany(company, id){
    this.userForm.get('companyId').setValue(id);
    this.companyLabel = company;
  }
  setRole(role, id){
    this.userForm.get('roleId').setValue(id);
    this.roleLabel = role;
  }
  submit(){
    const user = this.userForm.value
    const id = this.route.snapshot.paramMap.get('id');
    if(this.isEdit){
      console.log(id)
      user.id = id
      this.service.updateUser(id,user).subscribe(e =>{
        this.router.navigate(['users'])
      })
    }else{
      this.service.createUser(user).subscribe(e =>{
        this.router.navigate(['users'])
      })
    }
    console.log(this.userForm.value)
  }

}
