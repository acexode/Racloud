import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseEndpoints } from 'src/app/core/configs/endpoints';
import { RequestService } from 'src/app/core/services/request/request.service';
import { ProductServiceService } from 'src/app/products/product-service.service';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { TableFilterConfig } from 'src/app/shared/table/models/table-filter-config.interface';
import { TableFilterType } from 'src/app/shared/table/models/table-filter-types';
import { TableI } from 'src/app/shared/table/models/table.interface';
import { TableService } from 'src/app/shared/table/services/table.service';

@Component({
  selector: 'app-create-price-lists',
  templateUrl: './create-price-lists.component.html',
  styleUrls: ['./create-price-lists.component.scss']
})
export class CreatePriceListsComponent implements OnInit, OnDestroy {
  mockData = './assets/price-lists-create-table.json';
  currency = './assets/currency.json';

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
  products: any;
  constructor(
    private fb: FormBuilder,
    private tS: TableService,
    private http: HttpClient,
    private router: Router,
    private ref: ChangeDetectorRef,
    private reqS: RequestService,
    private productS: ProductServiceService,
    private msgS: MessagesService,
  ) { }

  selectionConfig(label: string): SelectConfig {
    return {
      selectLabel: {
        text: label || '',
      },
    };
  }
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
  ngOnInit(): void {
    this.initForm();
    this.onInitTable();
    this.productS.getProducts().subscribe(
      res => {
        this.products = res;
      },
      err => {
        this.msgS.addMessage({
          text: err.error || 'unable to load products at this time. Please refresh your browser',
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
        '',
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
        minWidth: 200,
        width: 200,
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
        width: 246,
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
        minWidth: 160,
        width: 160,
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
        identifier: 'initFee',
        label: 'Initial Fee',
        sortable: true,
        minWidth: 130,
        width: 130,
        sortIconPosition: 'left',
        labelPosition: 'right',
        cellContentPosition: 'right',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'subscriptionFee',
        label: 'Subscription Fee',
        sortable: true,
        minWidth: 120,
        width: 120,
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
        identifier: 'supportHours',
        label: 'Support Hours',
        sortable: true,
        minWidth: 100,
        width: 100,
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
        sortable: true,
        minWidth: 40,
        noGrow: true,
        headerHasFilterIcon: false,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
        cellTemplate: this.optionTemplate
      },
      {
        identifier: 'action',
        label: '',
        sortable: true,
        minWidth: 40,
        noGrow: true,
        headerHasFilterIcon: false,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
        cellTemplate: this.actionDropdown
      },
    ];
    this.getJSON(this.mockData).subscribe((data) => {
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
    console.log(data);
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

  submit(): void {
    const d = {
      name: 'string',
      currency: 'FRA'
    };
    this.reqS.get<any>(baseEndpoints.priceLists).subscribe(res => {
      console.log('adad', res);
    });
  }
  openAddProductModal(): void {
    this.productS.openAddProductModal();
  }
  ngOnDestroy(): void {
  }
}
