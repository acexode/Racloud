import { ProductServiceService } from './../product-service.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
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
  selectedRows : any[] = []
  productOptions: any[] = []
  @ViewChild('firstTab', { read: TemplateRef }) firstTab: TemplateRef<any>;
  @ViewChild('secondTab', { read: TemplateRef }) secondTab: TemplateRef<any>;
  @ViewChild('thirdTab', { read: TemplateRef }) thirdTab: TemplateRef<any>;

  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/products';
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
  textAreaConfig: TextAreaConfig = {
    textAreaLabel: {
      text: 'Description'
    },
    placeholder: ''
  };
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
  constructor(private fb: FormBuilder, private cdref: ChangeDetectorRef,
    private productS: ProductServiceService, private service: LicenseServiceService,
     private route: ActivatedRoute,) { }

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
      this.productS.getProducts().subscribe((obj:any) =>{
        this.productOptions = obj
        const data = obj.filter(e => e.Id.toString() === id)[0];
        this.product = data
        this.productForm.patchValue({
          application: data.Application,
          name: data.Name,
          productType: data.ProductType,
          description: data.Description
        });
      });
    }else{
      this.productS.getProducts().subscribe((obj:any) =>{
        this.productOptions = obj
      })
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
      ],
      selectedOptions: this.fb.array([])
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
  onChange(option, field) {
    this.productForm.get(field).patchValue(option)
  }
  get selectedOptions() {
    return this.productForm.get('selectedOptions') as FormArray;
  }
  submitForm(){
  const obj = this.productForm.value
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
  console.log(resArr)
  obj.selectedOptions = resArr
  const id = this.route.snapshot.paramMap.get('id');
  if(this.isEdit){
    obj.id =  id
  }
  this.productS.createProducts(obj).subscribe(e =>{
    console.log(e)
  })
  }
  getRow(row){
    this.selectedRows = row.selected
  }
}