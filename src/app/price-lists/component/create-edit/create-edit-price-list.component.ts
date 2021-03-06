import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { get } from 'lodash';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency/currency.service';
import { PriceListService } from 'src/app/core/services/price-list/price-list.service';
import { ProductModel } from 'src/app/products/models/products.model';
import { ProductServiceService } from 'src/app/products/product-service.service';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { TableFilterConfig } from 'src/app/shared/table/models/table-filter-config.interface';
import { TableFilterType } from 'src/app/shared/table/models/table-filter-types';
import { TableI } from 'src/app/shared/table/models/table.interface';
import { TableService } from 'src/app/shared/table/services/table.service';
import { CreatePriceListModel } from '../../models/create-price-list-model';
import { PriceListProductManagerModel } from '../../models/price-list-product-manager.model';
import { getUTCdate } from 'src/app/core/helpers/dateHelpers';
import { formatPrice } from 'src/app/core/helpers/formatNumber';
@Component({
  selector: 'app-create-edit-price-list',
  templateUrl: './create-edit-price-list.component.html',
})
export class CreateEditPriceListComponent implements OnInit, OnDestroy {
  @Input() editableData: any;
  @Output() priceListFormDataEmitter = new EventEmitter(null);
  removeNotInUse = true;
  mockData = './assets/price-lists-create-table.json';
  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/price-lists';
  containerConfig: PageContainerConfig = {
    closeButton: true,
    theme: 'transparent',
    shadow: false,
    panelClasses: {
      header: 'd-none',
      body: 'no-shadow',
    },
  };

  componentForm: FormGroup;

  controlStore: { [key: string]: AbstractControl; } = {};

  rows = [];
  rowDetailIcons = [
    '../../assets/images/Edit.svg',
    '../../assets/images/Log.svg',
  ];
  isDropup = true;
  @ViewChild('hoverDetailTpl', { static: true }) hoverDetailTpl: TemplateRef<any>;
  @ViewChild('actionDropdown', { static: true }) actionDropdown: TemplateRef<any>;
  @ViewChild('optionTemplate', { static: true }) optionTemplate: TemplateRef<any>;
  @ViewChild('valueTemplate', { static: true }) valueTemplate: TemplateRef<any>;
  rowData: Array<any> = [];
  tableData: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  tableConfig: TableI = {
    selectable: false,
    selectDetail: false,
    hoverDetail: true,
    columns: [],
    externalPaging: false,
    externalSorting: false,
    loadingIndicator: true,
    action: true,
    noFiltering: true,
    limit: 10,
    removeExportBtn: true,
    removePageCounter: true,
  };
  products: Array<ProductModel>;
  currenciesOptions$: Observable<any>;
  proccessPriceListProducts$: Subscription;
  getPriceListProducts$: Subscription;
  getProducts$: Subscription;
  button$: Subscription;
  toEditProduct: Observable<PriceListProductManagerModel>;
  isLoading = false;
  currency: string;
  currencySymbol: string;
  componentFormValueChange$: Subscription;
  constructor(
    private fb: FormBuilder,
    private tS: TableService,
    private productS: ProductServiceService,
    private msgS: MessagesService,
    private currencyS: CurrencyService,
    private priceListS: PriceListService,
  ) { }
  inputConfig(
    label: string,
    type: string = 'text',
    placeholder: string = 'Type here',
    prefixIcon: boolean = false,
    isDisabled: boolean = false
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
  selectConfig(
    label: string,
    placeholder: string = 'Select',
    searchable: boolean = false,
    idKey: string = 'id',
    labelKey: string = 'option',
  ): SelectConfig {
    return {
      selectLabel: {
        text: label,
      },
      placeholder,
      idKey,
      labelKey,
      searchable,
    };
  }
  ngOnInit(): void {
    this.initForm();
    this.componentFormValueChange$ = this.componentForm.valueChanges.subscribe(d => {
      // setCurrency
      this.setCurrency(d);
    });

    this.getProducts$ = this.priceListS.getProductsForPriceListing().subscribe(
      res => {
        this.products = res;
      }
    );
    this.button$ = this.priceListS.getLoadingButtonStatus().subscribe(
      (res: boolean) => {
        this.isLoading = res;
      }
    );
    this.currenciesOptions$ = this.currencyS.getCurrencies();
    this.toEditProduct = this.priceListS.getEdittablePriceListProductManagerState();
    // initialize table
    this.onInitTable();
    this.updateValueForForm(this.editableData);
  }

  initForm() {
    this.componentForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      currency: [
        null,
        [
          Validators.required,
        ],
      ],
      createDate: [
        '',
      ],
    });
  }

  onInitTable(): void {
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = [
      {
        identifier: 'application',
        label: 'Application',
        sortable: true,
        minWidth: 247,
        width: 247,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          placeholder: 'Search'
        },
      },
      {
        identifier: 'product',
        label: 'Product',
        sortable: true,
        minWidth: 245,
        width: 245,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'productType',
        label: 'Product Type',
        sortable: true,
        minWidth: 163,
        width: 163,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'value',
        label: 'Initial Fee',
        sortable: true,
        minWidth: 130,
        width: 130,
        noGrow: true,
        sortIconPosition: 'left',
        labelPosition: 'right',
        cellContentPosition: 'right',
        cellTemplate: this.valueTemplate,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'renewalValue',
        label: 'Subscription Fee',
        sortable: true,
        minWidth: 150,
        width: 150,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'right',
        cellContentPosition: 'right',
        cellTemplate: this.valueTemplate,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'supportHours',
        label: 'Support Hours',
        sortable: true,
        minWidth: 120,
        width: 120,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'right',
        cellContentPosition: 'right',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'action',
        label: '',
        minWidth: 40,
        noGrow: true,
        headerHasFilterIcon: false,
        sortIconPosition: 'left',
        labelPosition: 'left',
        cellContentPosition: 'right',
        cellTemplate: this.optionTemplate
      },
      {
        identifier: 'action',
        label: '',
        sortable: true,
        minWidth: 40,
        noGrow: true,
        headerHasFilterIcon: false,
        sortIconPosition: 'left',
        labelPosition: 'left',
        cellContentPosition: 'left',
        hasFilter: true,
        cellTemplate: this.actionDropdown
      },
    ];
    // load Products From PriceList ProductManager
    this.loadProductsFromPriceListProductManager();

  }
  loadProductsFromPriceListProductManager(): void {
    this.getPriceListProducts$ = this.priceListS.getpriceListProductManagerState().pipe(
      map(
        (d: Array<PriceListProductManagerModel>) => {
          return d.map(
            (v) => {
              return {
                ...v,
              };
            }
          ).reverse();
        })
    ).subscribe((data) => {
      if (data !== null || data.length < 0) {
        this.tableConfig.loadingIndicator = true;
        this.rowData = data;
        const cloneData = data.map((v: any) => {
          return { ...v };
        });
        this.tableData.next(cloneData);
        this.tableConfig.loadingIndicator = false;
      }
    });
  }
  filterTable(filterObj: TableFilterConfig) {
    const newRows = this.tS.filterRowInputs(
      this.tableConfig?.columns,
      this.rowData,
      filterObj
    );
    this.tableData.next(newRows);
  }
  isLoadingStatus() {
    this.isLoading = !this.isLoading;
  }
  addProductToPriceListProductManager(data: PriceListProductManagerModel) {
    if (data.hasOwnProperty('uuid')) {
      this.priceListS.updateProductToPriceListingProductManager(data);
    } else {
      this.priceListS.addProductToPriceListingProductManager(data);
    }
  }
  removeProductFromPriceListProductManager(data: PriceListProductManagerModel) {
    this.priceListS.removeProductToPriceListingProductManager(data.id);
  }
  toEditProductFromPriceListProductManager(data: PriceListProductManagerModel) {
    /* note product Id is included */
    this.priceListS.toEditProductToPriceListingProductManager(data);
    this.openAddProductFormModal();
  }
  setEditStateToNull(status: boolean) {
    if (status) {
      this.priceListS.nullEditState();
    }
  }
  openAddProductFormModal(): void {
    if (this.products && this.currency) {
      this.productS.openAddProductFormStepModal();
    } else {
      this.displayMsg(
        'You can not add product at this current time please check your newtowrk and try again.',
        'danger');
    }
  }
  getProductAvailabilityStatus() {
    return this.products !== null || this.products !== undefined ? true : false;
  }
  savePriceList() {
    // loading
    this.isLoadingStatus();
    // start processing
    this.proccessPriceListProducts$ = this.priceListS.getpriceListProductManagerState().pipe(
      map(
        (d: Array<PriceListProductManagerModel>) => {
          return d.map(
            (v) => {
              const dd = {
                productId: Number(get(v, 'productId', 0)),
                value: Number(get(v, 'value', 0)),
                renewalValue: Number(get(v, 'renewalValue', 0)),
                discount: Number(get(v, 'discount', '')),
                supportHours: Number(get(v, 'supportHours', 0)),
              };
              if (v.hasOwnProperty('id')) {
                return {
                  ...dd,
                  id: Number(v.id),
                };
              }
              return dd;
            }
          );
        })
    ).subscribe(
      (data) => {
        if (data.length < 1) {
          this.displayMsg(
            'Please add a product','info');
          // loading
          this.isLoadingStatus();
        } else {
          const { name, currency } = this.componentForm.value;
          if (name !== '') {
            if (currency !== null) {
              const d: CreatePriceListModel = {
                name,
                currency,
                productPrices: data,
              };
              this.priceListFormDataEmitter.emit(d);
            } else {
              this.displayMsg(
                'Please Select a currency',
                'info');
              this.isLoadingStatus();
            }
          } else {
            this.displayMsg(
              'Price List name field is empty',
              'info');
            this.isLoadingStatus();
          }
        }
      }
    );
  }
  updateValueForForm(data: any) {
    if (typeof data !== 'undefined' || typeof data !== null) {

      // get data
      const d = {
        name: get(data, 'name', ''),
        currency: get(data, 'currency', null),
        createDate: getUTCdate(get(data, 'createDate', ''))
      };
      // setCurrency
      this.setCurrency(data);
      this.componentForm.setValue({ ...d });
    }
  }
  formatThePrice(price: number) {
    return formatPrice(price);
  }
  loadCurrencySymbol(code: string): string {
    return this.currencyS.getCurrencySymbol(code);
  }
  setCurrency(data: any) {
    this.currency = get(data, 'currency', '');
    this.currencySymbol = this.loadCurrencySymbol(this.currency);
  }
  displayMsg(msg, type){
    this.msgS.addMessage({
      text: msg,
      type,
      dismissible: true,
      customClass: 'mt-32',
      hasIcon: true,
    });
    setTimeout(()=> {
      this.msgS.clearMessages()
    },5000)
  }
  ngOnDestroy(): void {
    this.getProducts$.unsubscribe();
    this.getPriceListProducts$.unsubscribe();
    this.componentFormValueChange$.unsubscribe();
    if (this.proccessPriceListProducts$) {
      this.proccessPriceListProducts$.unsubscribe();
    }
    // clear product state;
    this.priceListS.nullProductState();
  }
}
