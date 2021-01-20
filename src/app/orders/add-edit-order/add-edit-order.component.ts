import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';

@Component({
  selector: 'app-add-edit-order',
  templateUrl: './add-edit-order.component.html',
  styleUrls: ['./add-edit-order.component.scss']
})
export class AddEditOrderComponent implements OnInit {

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
  orderNumberConfig: InputConfig = {
    inputLabel: {
      text: 'Order Number'
    },
    type: 'text',
    placeholder: 'Type here',
  };
  valueConfig: InputConfig = {
    inputLabel: {
      text: 'Value'
    },
    type: 'text',
    placeholder: '$',
  };
  totalValueConfig: InputConfig = {
    inputLabel: {
      text: 'Total Value'
    },
    type: 'text',
    placeholder: '$',
  };
  createDateConfig: InputConfig = {
    inputLabel: {
      text: 'Order Date'
    },
    type: 'date',
    placeholder: 'Type here',
  };
  orderStatusConfig: InputConfig = {
    inputLabel: {
      text: 'Status'
    },
    type: 'text',
    placeholder: 'Status',
  };
  discountConfig: InputConfig = {
    inputLabel: {
      text: 'Discount'
    },
    type: 'text',
    placeholder: '%',
  };
  customerConfig: SelectConfig = {
    selectLabel: {
      text: 'Company'
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
      orderNumber: [
        '',
        [
          Validators.required,
        ],
      ],
      customer: [
        '',
        [
          Validators.required,
        ],
      ],
      value: [
        '',
        [
          Validators.required,
        ],
      ],
      createDate: [
        '',
        [
          Validators.required,
        ],
      ],
      orderStatus: [
        '',
        [
          Validators.required,
        ],
      ],
      discount: [
        '',
        [
          Validators.required,
        ],
      ],
      orderItems: [
        '',
      ],
      totalValue: [
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
