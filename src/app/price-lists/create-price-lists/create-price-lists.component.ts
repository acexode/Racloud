import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { baseEndpoints } from 'src/app/core/configs/endpoints';
import { CurrencyService } from 'src/app/core/services/currency/currency.service';
import { PriceListService } from 'src/app/core/services/price-list/price-list.service';
import { RequestService } from 'src/app/core/services/request/request.service';
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
import { PriceListProductManagerModel } from '../models/price-list-product-manager.model';

@Component({
  selector: 'app-create-price-lists',
  templateUrl: './create-price-lists.component.html',
  styleUrls: ['./create-price-lists.component.scss']
})
export class CreatePriceListsComponent implements OnInit, OnDestroy {
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
  product$: Subscription;
  toEditProduct: Observable<PriceListProductManagerModel>;
  constructor(
    private fb: FormBuilder,
    private tS: TableService,
    private http: HttpClient,
    private router: Router,
    private ref: ChangeDetectorRef,
    private reqS: RequestService,
    private productS: ProductServiceService,
    private msgS: MessagesService,
    private currencyS: CurrencyService,
    private priceListS: PriceListService,
  ) { }
  inputConfig(
    label: string,
    type: string = 'text',
    placeholder: string = 'Type here',
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
    this.currenciesOptions$ = this.currencyS.getCurrencies();
    this.toEditProduct = this.priceListS.getEdittablePriceListProductManagerState();
    this.product$ = this.productS.getProducts().subscribe(
      res => {
        this.products = res;
        this.onInitTable();
      },
      _err => {
        this.msgS.addMessage({
          text: 'unable to load products at this time. Please refresh your browser',
          type: 'danger',
          dismissible: true,
          customClass: 'mt-32',
          hasIcon: true,
        });
      },
    );
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
      dateCreated: [
        '',
        [
          Validators.required,
        ],
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
    this.priceListS.getpriceListProductManagerState().pipe(
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
      if (data) {
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
  public getJSON(url: string): Observable<any> {
    return this.http.get(url);
  }
  filterTable(filterObj: TableFilterConfig) {
    const newRows = this.tS.filterRowInputs(
      this.tableConfig?.columns,
      this.rowData,
      filterObj
    );
    this.tableData.next(newRows);
  }

  removeRow(id: any) { }
  manageSub(data: any) {
    this.router.navigate(['licenses/license-edit', { id: data.id }]);
  }
  renewSub(id: any) { }

  setDropUp(row) {
    const idx = this.rowData.findIndex(e => e.id === row.id) + 1;
    const mod = idx % 10 === 0 ? 10 : idx % 10;
    if (mod < 6) {
      this.isDropup = false;
    } else {
      this.isDropup = true;
    }
    this.ref.detectChanges();
  }
  addProductToPriceListProductManager(data: PriceListProductManagerModel) {
    const prod = this.products.find((p: ProductModel) => p.id === data.productId);
    const nD: PriceListProductManagerModel = {
      ...data,
      application: prod.application,
      product: prod.name,
      productType: prod.productType,
    }
    if (nD.hasOwnProperty('id')) {
      this.priceListS.updateProductToPriceListingProductManager(nD);
    } else {
      this.priceListS.addProductToPriceListingProductManager(nD);
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

  submit(): void {
    const d = {
      ...this.componentForm.value
    };
    this.reqS.get<any>(baseEndpoints.priceLists).subscribe(res => {
      console.log('adad', res);
    });
  }
  openAddProductFormModal(): void {
    this.productS.openAddProductFormStepModal();
  }
  getProductAvailabilityStatus() {
    return this.products !== null || this.products !== undefined ? true : false;
  }
  ngOnDestroy(): void {
    this.product$.unsubscribe();
    // this.currenciesOptions$.unsubscribe();
  }
}
