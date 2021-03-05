import { MessagesService } from 'src/app/shared/messages/services/messages.service';
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
import { get } from 'lodash';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})
export class AddEditProductComponent implements OnInit, AfterViewInit {
  optionList = [];
  isEdit = false;
  tabChange = false;
  isLoading = false;
  product: any;
  selectedRows: any[] = [];
  preselectedRows: any[] = [];
  productOptions: any[] = [];
  selectedproductType;
  @ViewChild('infoTab', { read: TemplateRef }) infoTab: TemplateRef<any>;
  @ViewChild('optionsTab', { read: TemplateRef }) optionsTab: TemplateRef<any>;
  @ViewChild('thirdTab', { read: TemplateRef }) thirdTab: TemplateRef<any>;

  @ViewChild('loaderTemplate', { read: TemplateRef }) loaderTemplate: TemplateRef<any>;
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
      name: 'Options',
      template: 'optionsTab',
      isSelected: false,
      defaultSelected: true,
    },
    {
      name: 'Info',
      template: 'infoTab',
      isSelected: false,
      defaultSelected: false,
    }
  ];
  productForm: FormGroup;
  productType = [
    {
      id: 'RAWorkShopLite',
      option: 'RAWorkShopLite'
    }
  ];
  selectedapplicationId: any = 'Select';
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
  ApplicationList: any;
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
    private route: ActivatedRoute, private msgS: MessagesService,
    private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.initForm();
    this.productS.getApplications().subscribe((app: []) => {
      this.ApplicationList = app;
    });
    if (id) {
      this.isEdit = true;
      this.productS.getProducts().subscribe((obj: any) => {
        this.productOptions = obj;
        const data = obj.filter(e => e.id.toString() === id)[0];
        this.product = data;
        this.preselectedRows = data.productOptions;
        this.updateForm(data);
      });
    } else {
      this.productS.getProducts().subscribe((obj: any) => {
        this.productOptions = obj;
      });
    }
    this.service.getOption().subscribe((options: any) => {
      this.optionList = options.map((obj: any, idx) => {
        const index = this.preselectedRows.findIndex(x => obj.Id === x.optionId);
        if (index > -1) {
          const item = options[idx];
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
      this.selectedRows = this.optionList.filter(op => op.selected === true);
      this.setTab('Options');
    });
  }
  updateForm(data) {
    this.productForm.patchValue({
      applicationId: data.applicationId,
      name: data.name,
      productType: data.productType,
      description: data.description,
      productUrl: get(data, 'productUrl', ''),
      productCode: get(data, 'productCode', ''),
    });
    this.selectedproductType = data.productType;
    this.selectedapplicationId = parseInt(data.applicationId, 10);
  }
  initForm() {
    this.productForm = this.fb.group({
      applicationId: [
        null,
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
        null,
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
      productCode: [
        '',
        [
          Validators.required,
        ],
      ],
      productUrl: [
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
  }
  showDefaultTab() {
    this.tabSwitch = this.loaderTemplate;
  }
  switchTab(event: any, tabName: string, index: number) {
    this.tabSwitch = this[tabName];
    this.tabChange = true;
    this.ressetTabSelectStatus();
    // set as active
    this.tabMarked = {
      left: `${ event.target.offsetLeft }px`,
      width: `${ event.target.offsetWidth }px`
    };
    this.tabs[index].isSelected = true;
    const data = this.productForm.value;
    this.updateForm(data);
    this.cdref.detectChanges();
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
  submitIt() {
    console.log();
    if (this.productForm.valid) {
      this.submitForm();
    } else {
      this.displayMsg('Please fill the product info and then try again', 'info');
    }
  }
  submitForm() {
    this.isLoading = true;
    const productValues = this.productForm.value;
    const resArr = [];
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
      if (resArr.length === 0) {
        this.isLoading = false;
        this.displayMsg('Options must be selected', 'info');
      } else {
        this.productS.updateProducts(id, productValues).subscribe(e => {
          this.isLoading = false;
          this.router.navigate(['products']);
        });
      }
    } else {
      productValues.selectedOptions = resArr;
      if (resArr.length === 0) {
        this.isLoading = false;
        this.displayMsg('Options must be selected', 'info');
      } else {
        this.productS.createProducts(productValues).subscribe(e => {
          this.isLoading = false;
          this.router.navigate(['products']);
        });
      }
    }
  }
  getRow(row) {
    this.selectedRows = row.selected;
    this.updateList(row.selected);
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
  updateList(preselected: any) {
    this.resetPriceList();
    preselected.forEach((dd: any) => {
      const idx = this.optionList.findIndex(x => x.Id === dd.Id);
      if (idx > -1) {
        this.optionList[idx].partnerAccess = dd.partnerAccess;
        this.optionList[idx].partnerAccess = dd.userAccess;
        this.optionList[idx].selected = true;
      }
    });
    this.optionList.sort((a, b) => b.selected - a.selected);
    this.selectedRows = this.optionList.filter(op => op.selected === true);
  }
  resetPriceList() {
    this.optionList.forEach(d => {
      d.selected = false;
    });
  }
  selectConfig(
    label: string,
    placeholder: string = 'Select',
    searchable: boolean = false,
    idKey: string = 'id',
    labelKey: string = 'option',
    isDisabled: boolean = false,
  ): SelectConfig {
    return {
      selectLabel: {
        text: label,
      },
      placeholder,
      idKey,
      labelKey,
      searchable,
      formStatus: {
        isDisabled,
      }
    };
  }
  setTab(tabName: any) {
    const tabIndex = this.tabs.findIndex(tab => tab.name.toLowerCase() === tabName.toLowerCase());
    this.ressetTabSelectStatus();
    if (tabIndex > -1) {
      const tab = this.tabs[tabIndex].template;
      this.tabSwitch = this[tab];
      this.tabs[tabIndex].defaultSelected = true;
      this.tabs[tabIndex].isSelected = true;
    } else {
      this.tabs[0].defaultSelected = true;
      this.tabs[0].isSelected = true;
    }
  }
}