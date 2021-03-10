import { AuthService } from 'src/app/core/services/auth/auth.service';
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
  preselectedRows : any[] = []
  isEdit = false;
  savedCompanyUserId
  currentLicense
  userLabel = 'Select'
  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/licenses';
  companyUsers
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
      shortName: 'info',
      template: 'firstTab',
      isSelected: false,
      defaultSelected: true,
    },
    {
      name: 'Options',
      shortName: 'optionList',
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
  fieldsPermission: any;
  licenseOptionPermission: any;
  licenseOptionAction: any;
  actionPermission: any;
  tabPermission: any;
  constructor(private fb: FormBuilder, private cdref: ChangeDetectorRef,
    private service: LicenseServiceService,
    private router: Router,
    private authS: AuthService,
    private http: HttpClient, private route: ActivatedRoute,) { }
  inputConfig(
    label: string,
    type: string = 'text',
    placeholder: string = '',
    prefixIcon: boolean = false,
    isDisabled: boolean = false,
    )
    : InputConfig {
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
  selectionConfig(label: string): SelectConfig {
    return {
      selectLabel: {
        text: label || '',
      },
    };
  }
  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10)
    this.initForm();
    if(id){
      this.isEdit = true
      this.service.getOneLicense(id).subscribe((obj:any) =>{
        const data = obj.license
        this.currentLicense = data
        this.tabPermission = obj.schema.license.tabs
        const filtered = []
        for (const key in this.tabPermission) {
          if(this.tabPermission[key] === 'full'){
            this.tabs.forEach(tab =>{
              if(tab.shortName === key){
                filtered.push(tab)
              }
            })
          }
        }
        this.tabs = [this.tabs[0], ...filtered]
        this.fieldsPermission = obj.schema.license.fields

        // to be replaced with BE
        this.licenseOptionPermission = obj.schema.options.fields

        this.licenseOptionAction = obj.schema.options.actions
        this.actionPermission = obj.schema.license.actions
        console.log(obj)
        this.service.getCompanyUsers(data.companyId).subscribe((users:any) =>{
          this.companyUsers = users.map(user => user.user)
        })
        console.log(data)
        this.preselectedRows = data?.licenseOptions
        this.getOptions()
        const selectedP = data.isPartnerLicense ? 'Yes' : 'No'
        const selectedR = data.renewByUserCompany ? 'Yes' : 'No'
        const isAssigned = data.iAssigned ? 'Yes' : 'No'
        this.selectedPartnerLicenseBtn = this.setBoolean( selectedP );
        this.selectedRenewBtn = this.setBoolean( selectedR );
        const exp = new Date(data.expirationDate).toLocaleDateString()
        const purchase = new Date(data.purchaseDate).toLocaleDateString()
        this.savedCompanyUserId = data.user?.userId
        this.infoForm.patchValue({
          productName: data.product.name,
          partner: data.ispartnerLicense,
          purchased: purchase,
          customer: data.company.companyName,
          expires: exp,
          userId: this.savedCompanyUserId,
          renew: data.renewByUserCompany,
          isAssigned,
          userCompany: data.companyUser || '',
        });
        this.onChange(data.licenseStatus)
        this.cdref.detectChanges()
      });
    }
  }
  getOptions(){
    this.service.getOption().subscribe((options: any) =>{
      console.log(options)
      // const sorted = this.preselectedRows.sort((a,b)=> a.optionId > b.optionId ? 1 : (b.optionId > a.optionId) ? -1 : 0)
      this.optionList = options.map((obj:any) =>{
        const index = this.preselectedRows.findIndex(idx => obj.Id === idx.optionId)
        if (index > -1) {
          const optIdx = options.findIndex(idx => idx.Id === this.preselectedRows[index].optionId)
          const item = options[optIdx]
          if(item.OptionType === 'Boolean'){
            item.ValueBoolean = this.preselectedRows[index].valueBoolean
          } else if(item.OptionType === 'String'){
            item.ValueString = this.preselectedRows[index].valueString
          } else if(item.OptionType === 'ValueList'){
            const arr = this.preselectedRows[index].valueListItems.map( v =>{
              return {
                Name: v.name,
                Value: v.value,
                Id: v.id
              }
            })
            item.ValueList = arr
            console.log(item)
          }
          return {
            ...item,
            PartnerAccess: this.preselectedRows[index].partnerAccess,
            UserAccess: this.preselectedRows[index].userAccess,
            selected: true
          }
        }else{
          return {
            ...obj,
            UserAccess: 'Hidden',
            PartnerAccess: 'Hidden',
            selected: false
          }
        }
      })
      const sorted = this.optionList.sort((a,b)=> b.selected - a.selected)
      console.log(sorted)
      
    })
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
      userId: [
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
  compareFn(c1: any, c2:any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  setUserId(option, field) {
    this.savedCompanyUserId = option
    this.userLabel = option
    this.infoForm.get(field).patchValue(option)

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
        const obj: any = {
          optionId: item.Id,
          userAccess: item.UserAccess,
          partnerAccess: item.PartnerAccess
        }
        if(item.OptionType === 'ValueList'){
          const valueItems = []
          item.ValueList.forEach(x =>{
            if(x.selected){
              valueItems.push({
                id: x.Id
              })
            }
          })
          if(this.isEdit){
            obj.valueListItems = valueItems
          }else{
            obj.valueList = valueItems
          }
          obj.valueString = ''
        }
        if(item.OptionType === 'String'){
          obj.valueString = item.ValueString
          if(this.isEdit){
            obj.valueListItems = []
          }else{
            obj.valueList = []
          }
        }
        if(item.OptionType === 'Boolean'){
          obj.valueString = ''
          if(this.isEdit){
            obj.valueListItems = []
          }else{
            obj.valueList = []
          }
        }
        resArr.push(obj);
      }
      return null;
    });
    if(this.isEdit){
      const editObj = {
        id: parseInt(id, 10),
        isPartnerLicense: selectedP,
        userId: this.savedCompanyUserId,
        licenseStatus: values.status,
        userCompany: values.userCompany,
        licenseOptions: resArr
      }
      this.service.updateLicense(id, editObj).subscribe(e =>{
        this.router.navigate(['licenses'])
      })
    }
  }
  getRow(row){
    this.selectedRows = row.selected
  }
  setDisplay(permission){
    if(permission === 'hidden'){
      return false
    }else{
      return true
    }
  }

}

