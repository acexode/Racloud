import { ProductServiceService } from './../product-service.service';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
export class AddEditProductComponent implements OnInit, AfterViewInit {
  optionList = [];
  isEdit = false
  isLoading = false
  ApplicationList = []
  product: any;
  productType = ['RAWorkShopLite']
  selectedRows : any[] = []
  preselectedRows : any[] = []
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
     private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.initForm();
    this.productS.getApplications().subscribe((app:[]) =>{
      this.ApplicationList = app
    })
    if(id){
      this.isEdit = true
      this.productS.getSingleProductOption(id).subscribe((opt:any) =>{
        this.preselectedRows = opt
        this.cdref.detectChanges()
      })
      this.productS.getSingleProduct(id).subscribe((obj:any) =>{
        const data = obj
        this.product = data
        this.productForm.patchValue({
          applicationId: data.Application.id,
          name: data.Name,
          productType: data.ProductType,
          description: data.Description
        });
      });
      this.service.getOption().subscribe((options: any) =>{
        this.optionList = options.map((obj:any) =>{
          const index = this.preselectedRows.findIndex(idx => obj.Id === idx.OptionId)
          if (index > -1) {
            const item = options[index]
            const rawList = this.preselectedRows[index].ValueListItems
            const formattedList = item.ValueList.map((e,i) =>{
              const rawListIndex = rawList.findIndex(idx => e.Value === idx.value)
              if(rawListIndex > -1){
                console.log(rawList)
                return {
                  Id: rawList[rawListIndex]?.id,
                  Name: rawList[rawListIndex]?.name,
                  OptionId: item.Id,
                  Value: rawList[rawListIndex]?.value,
                  checked: true
                }
              }else{
                return e
              }
            })
            console.log(formattedList)
            const retObj = {
              ...item,
              Name: this.preselectedRows[index].option.name,
              OptionType: this.preselectedRows[index].option.optionType,
              ValueBoolean: this.preselectedRows[index].ValueBoolean,
              ValueString: this.preselectedRows[index].ValueString,
              ValueList: formattedList,
              PartnerAccess: this.preselectedRows[index].PartnerAccess,
              UserAccess: this.preselectedRows[index].UserAccess,
              selected: true
            }
            console.log(retObj)
            return retObj
          }else{
            return {
              ...obj,
              UserAccess: 'Hidden',
              PartnerAccess: 'Hidden',
              selected: false
            }
          }
        })
        console.log(this.optionList)
      })
    }else{
      this.service.getOption().subscribe((options: any) =>{
        console.log(options)
        this.optionList = options.map((obj:any) =>{
            return {
              ...obj,
              UserAccess: 'Hidden',
              PartnerAccess: 'Hidden',
              selected: false
            }
        })
        console.log(this.optionList)
      })
    }
  }
  initForm() {
    this.productForm = this.fb.group({
      applicationId: [
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
    console.log(tabName)
    console.log(this.productForm.value)
    console.log(this.selectedRows)
    this.preselectedRows = this.selectedRows
    this.cdref.detectChanges()
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
    this.isLoading = true
  const productValues = this.productForm.value
  console.log(productValues)
  const resArr = []
  console.log(this.selectedRows)
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
  const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
  console.log(resArr)
  if(this.isEdit){
    productValues.productOptions = resArr
    productValues.id =  id
    console.log(productValues)
    this.productS.updateProducts(id, productValues).subscribe(e =>{
      this.isLoading = false
      this.router.navigate(['products'])
    });
  }else{
    productValues.selectedOptions = resArr
    this.productS.createProducts(productValues).subscribe(e =>{
      this.isLoading = false
      this.router.navigate(['products'])
    });
  }
  }
  getRow(row){
    this.selectedRows = row.selected
    this.preselectedRows = this.selectedRows
    console.log(this.selectedRows)
  }
}