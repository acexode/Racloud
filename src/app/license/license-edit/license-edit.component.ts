import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { LicenseServiceService } from '../license-service.service';

@Component({
  selector: 'app-license-edit',
  templateUrl: './license-edit.component.html',
  styleUrls: ['./license-edit.component.scss']
})
export class LicenseEditComponent implements OnInit, AfterViewInit {
  @ViewChild('firstTab', { read: TemplateRef }) firstTab: TemplateRef<any>;
  @ViewChild('secondTab', { read: TemplateRef }) secondTab: TemplateRef<any>;
  @ViewChild('thirdTab', { read: TemplateRef }) thirdTab: TemplateRef<any>;
  optionList = [];
  selectedRows = [];
  isEdit = false;
  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/customer';
  containerConfig: PageContainerConfig = {
    closeButton: true,
    theme: 'transparent',
    shadow: false,
    panelClasses: {
      header: 'd-none',
      body: 'no-shadow',
    },
  };
  tabSwitch: any;
  tabMarked = {
    left: '0px',
    width: '0px',
  };
  tabs = [
    {
      name: 'Info',
      template: 'firstTab',
      isSelected: false,
      defaultSelected: true,
    },
    {
      name: 'Options',
      template: 'secondTab',
      isSelected: false,
      defaultSelected: false,
    }
  ];
  infoForm: FormGroup;
  partnerLicense= [
    {title: 'Yes', name: 'button1'},
    {title: 'No', name: 'button2'},
  ];
  selectedPartnerLicenseBtn;
  selectedRenewBtn;
  selectedStatus = ''
  controlStore: { [key: string]: AbstractControl; } = {};
  constructor(private fb: FormBuilder, private cdref: ChangeDetectorRef,
    private service: LicenseServiceService,
    private router: Router,
    private http: HttpClient, private route: ActivatedRoute,) { }
  inputConfig(
    label: string,
    type: string = 'text',
    placeholder: string = '',
    prefixIcon: boolean = false)
    : InputConfig {
    return {
      inputLabel: {
        text: label || '',
      },
      type: type || 'text',
      placeholder: placeholder || '',
      prefixIcon: prefixIcon || false,
    };
  }
  selectionConfig(label: string): SelectConfig {
    return {
      selectLabel: {
        text: label || '',
      },
    };
  }
  ngOnInit(): void {
    this.service.getOption().subscribe((e: any) =>{
      this.optionList = e.map(obj =>{
        return {
          ...obj,
          UserAccess: 'Hidden',
          PartnerAccess: 'Hidden'
        }
      })
    })
    const id = this.route.snapshot.paramMap.get('id');
    this.initForm();
    if(id){
      this.isEdit = true
      this.service.getOneLicense(id).subscribe((data:any) =>{
        console.log(data)
        // const data = obj.filter(e => e.id === id)[0];
        const selectedP = data.isPartnerLicense ? 'Yes' : 'No'
        const selectedR = data.isPartnerLicense ? 'Yes' : 'No'
        const isAssigned = data.iAssigned ? 'Yes' : 'No'
        this.selectedPartnerLicenseBtn = this.setBoolean( selectedP );
        this.selectedRenewBtn = this.setBoolean( selectedR );
        const exp = new Date(data.expirationDate).toLocaleDateString()
        const purchase = new Date(data.purchaseDate).toLocaleDateString()
        this.infoForm.patchValue({
          productName: data.product.name,
          partner: data.ispartnerLicense,
          purchased: purchase,
          userCompany: data.companyUser,
          renew: data.renewByUserCompany,
          expires: exp,
          isAssigned,
          customer: data.company.companyName
        });
        this.onChange(data.LicenseStatus)
      });
    }
  }
  initForm() {
    this.infoForm = this.fb.group({
      productName: [
        '',
        [
          Validators.required,
        ],
      ],
      partner: [
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
      userCompany: [
        '',
        [
          Validators.required,
          Validators.email
        ],
      ],
      purchased: [
        '',
        [
          Validators.required,
        ],
      ],
      renew: [
        '',
        [
          Validators.required,
        ],
      ],
      expires: [
        '',
        [
          Validators.required,
        ],
      ],
      isAssigned: [
        '',
        [
          Validators.required,
        ],
      ],
      status: [
        '',
        [
          Validators.required,
        ],
      ],
      assignedTo: [
        '',
        [
          Validators.required,
        ],
      ]
    });
  }
  ngAfterViewInit() {
    this.showDefaultTab();
    this.cdref.detectChanges();
  }
  showDefaultTab() {
    this.tabSwitch = this.firstTab;
  }
  switchTab(event: any, tabName: string, index: number) {
    this.tabSwitch = this[tabName];
    this.ressetTabSelectStatus();
    // set as active
    this.tabMarked = {
      left: `${ event.target.offsetLeft }px`,
      width: `${ event.target.offsetWidth }px`
    };
    this.tabs[index].isSelected = true;
  }
  ressetTabSelectStatus() {
    for (const tab of this.tabs) {
      tab.isSelected = false;
      tab.defaultSelected = false;
    }
  }
  isPartnerLicense(event, button) {
    event.preventDefault();
    if (button === this.selectedPartnerLicenseBtn) {
      this.setFormValue('partner',button.title);
      this.selectedPartnerLicenseBtn = undefined;
    } else {
      this.setFormValue('partner', button.title);
      this.selectedPartnerLicenseBtn = button;
    }
  }
  renewbyUserCompany(event, button) {
    event.preventDefault();
    if (button === this.selectedRenewBtn) {
      this.selectedRenewBtn = undefined;
      this.setFormValue('renew',button.title);
    } else {
      this.setFormValue('renew', button.title);
      this.selectedRenewBtn = button;
    }
  }
  onChange(option) {
    this.selectedStatus =option;
    this.setFormValue('status',option);
    this.cdref.detectChanges();
  }
  setFormValue(field,value){
    this.infoForm.get(field).patchValue(value, {
      onlySelf: false
    });
  }
  setBoolean(data){
    return this.partnerLicense.filter(e => e.title === data)[0];
  }
  submitForm(){
    const id = this.route.snapshot.paramMap.get('id');
    const values = this.infoForm.value
    const selectedP = values.partner === 'Yes' ? true : false
    const selectedR = values.renew === 'Yes' ? true : false
    const resArr = []
    this.selectedRows.reverse().filter(item =>{
      const i = resArr.findIndex(x => x.optionId === item.Id);
      if(i <= -1){
        resArr.push(
          {
            optionId: item.Id,
            userAccess: item.UserAccess,
            partnerAccess: item.PartnerAccess
          }
          );
      }
      return null;
    });
    if(this.isEdit){
      const editObj = {
        id: parseInt(id, 10),
        isPartnerLicense: selectedP,
        licenseStatus: values.status,
        licenseOptions: resArr
      }
      console.log(editObj)
      this.service.updateLicense(id, editObj).subscribe(e =>{
        this.router.navigate(['licenses'])
      })
    }
  }
  getRow(row){
    this.selectedRows = row.selected
  }
}

