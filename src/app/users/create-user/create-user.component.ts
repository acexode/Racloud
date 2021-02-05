import { CustomStorageService } from './../../core/services/custom-storage/custom-storage.service';
import { UsersService } from './../users.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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
  userForm: FormGroup;
  loggedInUser = null;
  canChangePassword = false
  changePasswordForm: FormGroup;
  modalRef: BsModalRef;
  changePasswordError = ''
  inputConfig(
    label: string,
    type: string = 'text',
    placeholder: string = '',
    prefixIcon: boolean = false,
    Icon: string = '',
    )
    : InputConfig {
    return {
      inputLabel: {
        text: label ,
      },
      type: type || 'text',
      placeholder ,
      prefixIcon: prefixIcon || false,
      IconType: Icon,
    };
  }
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
  filteredOptions = []
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
  autoClose: boolean;
  componentForm: any;
  filteredCustomer: any;
  customers: any;
  ref: any;
  savedCompanyId: any;
  constructor(private fb: FormBuilder, private router : Router,
    private route: ActivatedRoute, private service: UsersService,
    private modalService: BsModalService, private cStorage: CustomStorageService) { }

  ngOnInit(): void {
    this.cStorage.getItem('token').subscribe(data =>{
      console.log(data.user)
      this.loggedInUser = data.user
    })
    this.service.getRoles().subscribe((res:any[]) =>{
      console.log(res)
      this.roleOptions = res[0]
      this.companyOptions = res[1]
      this.filteredOptions = res[1]
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
        if(this.user.email === this.loggedInUser.email){
          this.canChangePassword = true
        }
        this.userForm.patchValue({
          firstName: data.user?.firstname,
          lastName: data.user?.lastname,
          email: data.user?.email,
          roleId: data.role?.id,
          companyId: data.company?.id,
        });
        if(this.companyOptions.length){
          const company = this.companyOptions.filter(e => e.id.toString() === data.company.id)[0]
          this.companyLabel = company?.companyName || 'Select';
        }
        this.roleLabel = data.role?.name;
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
      ],
      searchText: [
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
  setClose(){
    this.autoClose = false
  }
  setCustomer(company, id){
    this.autoClose = true
    this.componentForm.get('companyId').setValue(id);
  }
  onSearchChange(customer:string){
     this.autoClose = false
    this.filteredOptions = this.companyOptions.filter(e => e.companyName.toLowerCase().includes(customer.toLowerCase()))
    // this.ref.detectChanges()
  }
  setCompany(company, id){
    this.autoClose = true
    this.userForm.get('companyId').setValue(id);
    this.companyLabel = company;
    this.savedCompanyId = id
    this.filteredOptions = this.companyOptions
    this.userForm.get('searchText').patchValue('')
    // this.ref.detectChanges()
  }
  setRole(role, id){
    this.userForm.get('roleId').setValue(id);
    this.roleLabel = role;
  }
  openModal(template: TemplateRef<any>, type) {
    this.changePasswordError = ''
    this.modalRef = this.modalService.show(template,  Object.assign({}, { class: 'gray modal-md' }));
    if(type === 'send'){
      console.log(type)
    }else if(type === 'change'){
      this.changePasswordForm = this.fb.group({
        Email : [
          this.user.email,
          [
            Validators.required,
          ],
        ],
        OldPassword : [
          '',
          [
            Validators.required,
          ],
        ],
        NewPassword : [
          '',
          [
            Validators.required,
          ],
        ],
        ConfirmPassword : [
          '',
          [
            Validators.required,
          ],
        ],
      })

    }
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
  changePassword(){
    console.log(this.changePasswordForm.value)
    const value = this.changePasswordForm.value
    this.service.changePassword(value).subscribe(e =>{
      console.log(e)
      // this.modalRef.hide()
    }, (err) =>{
      this.changePasswordError = err.error
    })
  }
  sendResetPassword(){
    const obj = {
      email: this.user.email
    }
    this.service.sendResetPassword(obj).subscribe(e =>{
      console.log(e)
    })
  }
}
