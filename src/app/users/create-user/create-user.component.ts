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
  };
  companyLabel = 'Select';
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
  userForm: FormGroup;
  autoClose: boolean;
  componentForm: any;
  filteredCustomer: any;
  customers: any;
  ref: any;
  savedCompanyId: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: UsersService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.service.getRoles().subscribe((res: any[]) => {
      this.roleOptions = res[0];
      this.companyOptions = res[1];
      this.filteredOptions = res[1];

      const id = this.route.snapshot.paramMap.get('id');
      const companyId = this.route.snapshot.paramMap.get('companyId');
      const backUrl = this.route.snapshot.paramMap.get('backUrl');
      if (backUrl) {
        this.backUrl = backUrl;
      }
      if (companyId) {
        this.setCompanyLabelById(companyId);
      }
      if (id) {
        this.isEdit = true;
        // const idx = parseInt(id, 10);
        this.service.getUser(id).subscribe((data: any) => {
          // const data = obj.filter(e => e.user.id.toString() === id)[0];
          console.log(data);
          this.user = data.user;
          this.userForm.patchValue({
            firstName: data.user?.firstname,
            lastName: data.user?.lastname,
            email: data.user?.email,
            roleId: data.role?.id,
            companyId: data.company?.id,
          });
          if (this.companyOptions.length) {
            this.setCompanyLabelById(data.company.id);
          }
          this.roleLabel = data.role?.name;
        });
      }


    });
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
    this.userForm.get('searchText').patchValue('');
    // this.ref.detectChanges()
  }
  setRole(role, id) {
    this.userForm.get('roleId').setValue(id);
    this.roleLabel = role;
  }
  submit() {
    const user = this.userForm.value;
    const id = this.route.snapshot.paramMap.get('id');
    if (this.isEdit) {
      user.id = id;
      console.log(id, user);
      this.service.updateUser(id, user).subscribe(
        _res => {
          this.router.navigate(['/users']);
        },
        err => {
          console.log('err: ', err);
        }
      );
    } else {
      this.service.createUser(user).subscribe(e => {
        this.router.navigate([this.backUrl]);
      });
    }
    console.log(this.userForm.value);
  }

}
