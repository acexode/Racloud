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
  isEdit = false;
  isLoading = false;
  product: any;
  selectedRows: any[] = [];
  preselectedRows: any[] = [];
  productOptions: any[] = [];
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
  partnerLicense = [
    { title: 'Yes', name: 'button1' },
    { title: 'No', name: 'button2' },
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
    if (id) {
      this.isEdit = true;
      this.productS.getProducts().subscribe((obj: any) => {
        console.log(obj);
        this.productOptions = obj;
        const data = obj.filter(e => e.id.toString() === id)[0];
        this.product = data;
        console.log(data);
        this.preselectedRows = data.productOptions;
        this.productForm.patchValue({
          application: data.application?.name,
          name: data.name,
          productType: data.productType,
          description: data.description
        });
      });
    } else {
      this.productS.getProducts().subscribe((obj: any) => {
        this.productOptions = obj;
      });
    }
    this.service.getOption().subscribe((options: any) => {
      this.optionList = options.map((obj: any) => {
        const index = this.preselectedRows.findIndex(idx => obj.Id === idx.optionId);
        if (index > -1) {
          const item = options[index];
          return {
            ...item,
            PartnerAccess: this.preselectedRows[index].partnerAccess,
            UserAccess: this.preselectedRows[index].userAccess,
            selected: true
          };
        } else {
          return {
            ...obj,
            UserAccess: 'Hidden',
            PartnerAccess: 'Hidden',
            selected: false
          };
        }
      });
    });
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
    this.productForm.get(field).patchValue(option);
  }
  get selectedOptions() {
    return this.productForm.get('selectedOptions') as FormArray;
  }
  submitForm() {
    this.isLoading = true;
    const productValues = this.productForm.value;
    const resArr = [];
    console.log(this.selectedRows);
    this.selectedRows.reverse().filter(item => {
      const i = resArr.findIndex(x => x.optionId === item.Id);
      if (i <= -1) {
        const obj: any = {
          optionId: item.Id,
          userAccess: item.UserAccess,
          partnerAccess: item.PartnerAccess
        };
        if (item.OptionType === 'ValueList') {
          const valueItems = [];
          item.ValueList.forEach(x => {
            if (x.selected) {
              valueItems.push({
                id: x.Id
              });
            }
          });
          if (this.isEdit) {
            obj.valueListItems = valueItems;
          } else {
            obj.valueList = valueItems;
          }
          obj.valueString = '';
        }
        if (item.OptionType === 'String') {
          obj.valueString = item.ValueString;
          if (this.isEdit) {
            obj.valueListItems = [];
          } else {
            obj.valueList = [];
          }
        }
        if (item.OptionType === 'Boolean') {
          obj.valueString = '';
          if (this.isEdit) {
            obj.valueListItems = [];
          } else {
            obj.valueList = [];
          }
        }
        resArr.push(obj);
      }
      return null;
    });
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    console.log(resArr);
    if (this.isEdit) {
      productValues.productOptions = resArr;
      productValues.id = id;
      console.log(productValues);
      this.productS.updateProducts(id, productValues).subscribe(e => {
        this.isLoading = false;
        this.router.navigate(['products']);
      });
    } else {
      productValues.selectedOptions = resArr;
      this.productS.createProducts(productValues).subscribe(e => {
        this.isLoading = false;
        this.router.navigate(['products']);
      });
    }
  }
  getRow(row) {
    this.selectedRows = row.selected;
  }
}