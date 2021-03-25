import { CheckboxConfig } from './../../shared/rc-forms/models/checkbox/checkbox-config';
import { get } from 'lodash';
import { CustomStorageService } from './../../core/services/custom-storage/custom-storage.service';
import { UsersService } from './../users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  authS$: Subscription;
  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/users';
  isEdit = false;
  disableCustomerSelectField = false;
  user = null;
  userForm: FormGroup;
  loggedInUser = null;
  canImpersonate = false;
  canChangePassword = false;
  changePasswordForm: FormGroup;
  modalRef: BsModalRef;
  changePasswordError = '';
  autoClose: boolean;
  componentForm: any;
  filteredCustomer: any;
  customers: any;
  userInfo;
  ref: any;
  savedCompanyId: any;
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
  currentCompany;
  roleLabel = 'Select'
    ;
  companyOptions = [];
  filteredOptions = [];
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
  notifyConfig: CheckboxConfig = {
    placeholder: 'Notify via email',
    checked: false
  };
  loggedInUserRole: any;
  impersonatorId: any;
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
        text: label,
      },
      type: type || 'text',
      placeholder,
      prefixIcon: prefixIcon || false,
      IconType: Icon,
    };
  }
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: UsersService,
    private msgS: MessagesService,
    private modalService: BsModalService,
    private cStorage: CustomStorageService,
    private authS: AuthService,
    private customerS: CustomerService,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const companyID = this.route.snapshot.paramMap.get('companyId');
    this.backUrl = this.route.snapshot.paramMap.get('backUrl') || '/users';
    this.cStorage.getItem('token').subscribe(data => {
      this.loggedInUser = data.user;
      this.loggedInUserRole = data.roles[0];
    });
    this.initForm();
    this.setCustomerField();
    this.service.getRoles().subscribe((res: any[]) => {
      this.roleOptions = res;
    });
    if (id) {
      this.isEdit = true;
      const idx = parseInt(id, 10);
      this.service.getUser(id).subscribe((data: any) => {
        // const data = obj.filter(e => e.user.id.toString() === id)[0];
        this.user = data.user;
        this.userInfo = data;
        this.roleLabel = get(get(data, 'role', null), 'name', null);
        this.companyLabel = get(get(data, 'company', null), 'companyName', null);
        this.currentCompany = get(get(data, 'company', null), 'companyName', null);
        if (this.user?.email === this.loggedInUser.email || this.loggedInUserRole === 'systemadmin' || this.loggedInUserRole === 'admin') {
          this.canChangePassword = true;
        }
        if (this.loggedInUserRole === 'systemadmin' && this.user.email !== this.loggedInUser.email) {
          this.canImpersonate = true;
        }
        this.userForm.patchValue({
          firstName: data.user?.firstname,
          lastName: data.user?.lastname,
          email: data.user?.email,
          roleId: data.role?.id,
          companyId: data.company?.id,
        });
      });
    }

  }
  setCustomerField(): void {
    this.authS$ = this.authS.getAuthState().subscribe(
      e => {
        const account = get(e, 'account', null);
        const company = get(account, 'company', null);
        this.companyLabel = get(company, 'companyName', null);
        const companyType = get(company, 'companyType', '');
        this.processCustomers(company.id);
        if (companyType === 'Main') {
          this.customerS.getCustomers().subscribe(
            res => {
              this.companyOptions = get(res, 'customers', []);
              this.filteredOptions = this.companyOptions;
              if (this.companyOptions.length < 0) {
                this.disableCustomerSelectField = true;
              } else {
                this.disableCustomerSelectField = false;
              }
            },
            _err => {
              console.log('an error');
              this.disableCustomerSelectField = true;

            }
          );
        } else {
          this.disableCustomerSelectField = true;
        }
      }
    );
  }
  processCustomers(companyID: any): void {
    if (companyID) {
      this.savedCompanyId = companyID;
      this.userForm.patchValue({
        companyId: companyID,
      });
    }
  }
  get companyId() {
    return this.userForm.get('companyId');
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
  setCompanyLabelById(id: number | string) {
    const company = this.companyOptions.filter(e => Number(e.id) === Number(id))[0];
    this.companyLabel = company?.companyName || 'Select';
    this.userForm.get('companyId').setValue(id);
  }
  addCompany() {
    this.router.navigate(['/users']);
  }
  setClose() {
    this.autoClose = false;
  }
  setCustomer(company, id) {
    this.autoClose = true;
    this.componentForm.get('companyId').setValue(id);
  }
  onSearchChange(customer: string) {
    this.autoClose = false;
    this.filteredOptions = this.companyOptions.filter(e => e.companyName.toLowerCase().includes(customer.toLowerCase()));
    // this.ref.detectChanges()
  }
  setCompany(company, id) {
    this.autoClose = true;
    this.userForm.get('companyId').setValue(id);
    this.companyLabel = company;
    this.savedCompanyId = id;
    this.filteredOptions = this.companyOptions;
    this.userForm.get('searchCompany').patchValue('');
    // this.ref.detectChanges()
  }
  setRole(role, id) {
    this.userForm.get('roleId').setValue(id);
    this.roleLabel = role;
  }
  openModal(template: TemplateRef<any>, type) {
    this.changePasswordError = '';
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-md' }));
    if (type === 'send') {
    } else if (type === 'change') {
      this.changePasswordForm = this.fb.group({
        email: [
          this.user.email,
          [
            Validators.required,
          ],
        ],
        oldPassword: [
          '',
          [
            Validators.required,
          ],
        ],
        newPassword: [
          '',
          [
            Validators.required,
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
          ],
        ],
        notify: [
          false,
        ],
      });
      console.log(this.loggedInUserRole)
      if(this.loggedInUserRole === 'systemadmin' || this.loggedInUserRole === 'admin'){
        this.changePasswordForm.get('oldPassword').clearValidators();
        this.changePasswordForm.get('oldPassword').updateValueAndValidity()
      }
    }
  }
  submit() {
    const user = this.userForm.value;
    const id = this.route.snapshot.paramMap.get('id');
    if (this.isEdit) {
      user.id = id;
      this.service.updateUser(id, user).subscribe(
        _res => {
          this.router.navigate([this.backUrl]);
        },
        err => {
          console.log('err: ', err);
          this.displayMsg(err.error, 'danger')
        }
      );
    } else {
      this.service.createUser(user).subscribe(e => {
        this.router.navigate([this.backUrl]);
      },err => {
        console.log('err: ', err);
        this.displayMsg(err.error, 'danger')
      });
    }
  }
  changePassword() {
    const value = this.changePasswordForm.value;
    console.log(value)
    if(this.loggedInUserRole === 'systemadmin' || this.loggedInUserRole === 'admin'){
      this.service.changePasswordAdmin(value).subscribe((res: any) =>{
        console.log(res)
        this.displayMsg(res.message, 'success');
        this.modalRef.hide();
      }, (err) => {
        console.log(err);
        this.changePasswordError = err.error;
      })
    }else{
      this.service.changePassword(value).subscribe((e: any) => {
        this.displayMsg(e.message, 'success');
        this.modalRef.hide();
      }, (err) => {
        console.log(err);
        this.changePasswordError = err.error;
      });
    }
  }
  sendResetPassword() {
    const obj = {
      email: this.user.email
    };
    this.service.sendResetPassword(obj).subscribe((e: any) => {
      this.modalRef.hide();
      this.displayMsg(e.message, 'info');
    });
  }
  displayMsg(msg, type) {
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
  impersonate() {
    if (this.impersonatorId) {
      console.log(this.impersonatorId);
    } else {

      const id = this.route.snapshot.paramMap.get('id');
      const obj = {
        userId: id
      };
      this.service.impersonate(obj).subscribe((res: any) => {
        this.displayMsg(`You are now logged in as ${ this.user.firstname }`, 'info');
        this.cStorage.getItem('token').subscribe(e => {
          this.cStorage.setItem('oldToken', e);
        });
        const currCmp = this.userInfo.company
        const userCompany = this.filteredOptions.filter(cmp => cmp.id === currCmp.id).map(company =>{
          return{
            ...currCmp,
            companyType: company.companyType
          }
        })[0]
        const account = {
          username: this.userInfo.user.email,
          image: null,
          user: this.userInfo.user || null,
          company: userCompany,
          roles: this.userInfo.role.name,
        };
        const currentUser = {
          company: userCompany,
          exp: res.expiration,
          roles: [this.userInfo.role.name],
          user: this.userInfo.user,
          token: res.token,
          username: this.userInfo.user.email,
          impersonatorId: res.impersonatorId
        };
        this.cStorage.setItem('token', currentUser).pipe(
          tap(() => {
            this.authS.authState.next({
              init: true,
              account,
              authToken: res.token,
              impersonatorId: res.impersonatorId,
              expiryDate: res.expiration || null,
            });
            this.impersonatorId = res.impersonatorId;
          })).subscribe(() => {
            this.authS.getAuthState().subscribe(e => {
              const idX = get(e, 'impersonatorId', null);
              if (idX === null) {
                this.impersonatorId = null;
              }
              this.service.getUserPermissionsPerPage().subscribe(p => console.log(p));
            });
          });
      }, err => {
        this.displayMsg(err.error, 'danger');
      });
    }
  }
}
