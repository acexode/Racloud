import { ProductServiceService } from './../product-service.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { TextAreaConfig } from 'src/app/shared/rc-forms/models/textarea/textarea-config';
import { LicenseServiceService } from 'src/app/license/license-service.service';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})
export class AddEditProductComponent implements OnInit {
  optionList = [];
  isEdit = false
  product: any;
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
  productForm: FormGroup;
  partnerLicense= [
    {title: 'Yes', name: 'button1'},
    {title: 'No', name: 'button2'},
  ];
  selectedPartnerLicenseBtn;
  selectedRenewBtn;

  controlStore: { [key: string]: AbstractControl; } = {};
  constructor(private fb: FormBuilder, private cdref: ChangeDetectorRef,
    private productS: ProductServiceService, private service: LicenseServiceService,
     private route: ActivatedRoute,) { }
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
  textAreaConfig: TextAreaConfig = {
    textAreaLabel: {
      text: 'Description'
    },
    placeholder: ''
  };
  ngOnInit(): void {
    this.service.getOption().subscribe((e: any) =>{
      this.optionList = e
    })
    const id = this.route.snapshot.paramMap.get('id');
    this.initForm();
    if(id){
      this.isEdit = true
      this.productS.getProducts().subscribe((obj:any) =>{
        const data = obj.filter(e => e.Id.toString() === id)[0];
        console.log(data)
        this.product = data
        this.productForm.patchValue({
          application: data.Application,
          name: data.Name,
          productType: data.ProductType,
          description: data.Description
        });
      });
    }
  }
  initForm() {
    this.productForm = this.fb.group({
      application: [
        '',
        [
          Validators.required,
        ],
      ],
      name: [
        '',
        [
          Validators.required,
        ],
      ],
      productType: [
        '',
        [
          Validators.required,
        ],
      ],
      description: [
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
  submitForm(){
  console.log(this.productForm.value);
    this.productS.createProducts(this.productForm.value)
  }
  getRow(row){
    console.log(row)
  }
}