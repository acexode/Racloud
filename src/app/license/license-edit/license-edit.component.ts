import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';

@Component({
  selector: 'app-license-edit',
  templateUrl: './license-edit.component.html',
  styleUrls: ['./license-edit.component.scss']
})
export class LicenseEditComponent implements OnInit {
  @ViewChild('firstTab', { read: TemplateRef }) firstTab: TemplateRef<any>;
  @ViewChild('secondTab', { read: TemplateRef }) secondTab: TemplateRef<any>;
  @ViewChild('thirdTab', { read: TemplateRef }) thirdTab: TemplateRef<any>;

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
  tabs = [
    {
      name: 'Info',
      template: 'firstTab',
      isSelected: true
    },
    {
      name: 'Options',
      template: 'secondTab',
      isSelected: false
    }
    
  ];
  infoForm: FormGroup;
  partnerLicense= [
    {title: "Yes", name: "button1"},
    {title: "No", name: "button2"},
  ]
  selectedPartnerLicenseBtn;
  selectedRenewBtn;

  controlStore: { [key: string]: AbstractControl; } = {};
  constructor(private fb: FormBuilder, private cdref: ChangeDetectorRef) { }
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
    this.initForm();
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
  switchTab(tabName: string, index: number) {
    this.tabSwitch = this[tabName];
    this.ressetTabSelectStatus();
    // set as active
    this.tabs[index].isSelected = true;
  }
  ressetTabSelectStatus() {
    for (const tab of this.tabs) {
      tab.isSelected = false;
    }
  }
  isPartnerLicense(button) {
    if (button === this.selectedPartnerLicenseBtn) {
      this.setFormValue('partner',button.title);
      this.selectedPartnerLicenseBtn = undefined;
    } else {
      this.setFormValue('partner', button.title);
      this.selectedPartnerLicenseBtn = button;
    }
  }
  renewbyUserCompany(button) {
    if (button === this.selectedRenewBtn) {
      this.selectedRenewBtn = undefined;
      this.setFormValue('renew',button.title);
    } else {
      this.setFormValue('renew', button.title);
      this.selectedRenewBtn = button;
    }
  }
setFormValue(field,value){
  this.infoForm.get(field).patchValue(value, {
    onlySelf: false
  });
}
submitForm(){
  console.log(this.infoForm.value);
}


}

