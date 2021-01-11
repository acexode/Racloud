import { ShopService } from './../../shop/shop.service';
import { Order } from './../../core/models/order.interface';
import { OrderService } from './../service.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { TableFilterConfig } from 'src/app/shared/table/models/table-filter-config.interface';
import { TableFilterType } from 'src/app/shared/table/models/table-filter-types';
import { TableI } from 'src/app/shared/table/models/table.interface';
import { TableService } from 'src/app/shared/table/services/table.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})
export class OrdersDetailsComponent implements OnInit {

  caretLeftIcon = '../assets/images/caret-left.svg';
  orderId = ''
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
  @ViewChild('hoverDetailTpl', { static: true }) hoverDetailTpl: TemplateRef<any>;
  @ViewChild('actionDropdown', { static: true }) actionDropdown: TemplateRef<any>;
  @ViewChild('valueTemplate', { static: true }) valueTemplate: TemplateRef<any>;
  @ViewChild('quantityTemplate', { static: true }) quantityTemplate: TemplateRef<any>;
  @ViewChild('discountTemplate', { static: true }) discountTemplate: TemplateRef<any>;
  rows = [];
  modalRef: BsModalRef;
  rowDetailIcons = [
    '../../assets/images/Edit.svg',
    '../../assets/images/Log.svg',
  ];
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
  componentForm: FormGroup;
  addedProducts = []
  allProducts = []
  controlStore: { [key: string]: AbstractControl; } = {};
  isDropup: boolean;
  constructor(
    private fb: FormBuilder,
    private tS: TableService,
    private http: HttpClient,
    private ref: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private service: OrderService,
    private shopS: ShopService,
    private modalService: BsModalService
  ) { }

  selectionConfig(label: string): SelectConfig {
    return {
      selectLabel: {
        text: label ,
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
        text: label ,
      },
      type: type || 'text',
      placeholder: placeholder ,
      prefixIcon: prefixIcon || false,
    };
  }

  setType(e) {
    this.type.setValue(e.target.value, {
      onlySelf: true
    });
  }
  get type() {
    return this.componentForm.get('type');
  }
  ngOnInit(): void {
    this.shopS.buyStore.subscribe((e:any) =>{
      console.log(e.hasOwnProperty('id'))
      if(e.hasOwnProperty('id')){
        e.quantity = 1
        e.totalValue = e.quantity * e.value
        this.addedProducts.push(e)
        this.onInitTable()

      }
    })
    this.initForm();
    this.service.getShops().subscribe((e:Order[]) =>{
      console.log(e)
      this.allProducts = e
    })
    const id = this.route.snapshot.paramMap.get('id');
    this.orderId = id
    if(id){
      const idx = parseInt(id,10)
      this.service.getSingleOrder(idx).subscribe((e: Order) =>{
        console.log(e)
        this.componentForm.patchValue({
          orderNumber: e.Id,
          customer: e.Company,
          status: e.OrderStatus,
          value: e.Value,
          discount: e.Discount,
          totalValue: e.TotalValue
        })
        this.componentForm.get('orderDate').patchValue(this.formatDate(new Date(e.CreateDate)));
      }) 
    }
    this.onInitTable();
  }

  initForm() {
    this.componentForm = this.fb.group({
      orderNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      customer: [
        '',
        [
          Validators.required,
        ],
      ],
      orderDate: [
        '',
        [
          Validators.required,
        ],
      ],
      status: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      value: [
        '',
        [
          Validators.required,
        ],
      ],
      discount: [
        '',
        [
          Validators.required,
          Validators.email
        ],
      ],
      totalValue: [
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
        identifier: 'product.productType',
        label: 'Application',
        sortable: true,
        minWidth: 226,
        width: 90,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          placeholder: 'Search'
        },
      },
      {
        identifier: 'product.name',
        label: 'Product',
        sortable: true,
        minWidth: 226,
        width: 90,
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
        identifier: 'um',
        label: 'UM?',
        sortable: true,
        minWidth: 160,
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
        identifier: 'quantity',
        label: 'Quantity',
        sortable: true,
        minWidth: 97,
        noGrow: true,
        sortIconPosition: 'left',
        labelPosition: 'right',
        cellContentPosition: 'right',
        cellTemplate: this.quantityTemplate,
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'value',
        label: 'Value',
        sortable: true,
        minWidth: 120,
        noGrow: true,
        sortIconPosition: 'left',
        labelPosition: 'right',
        cellContentPosition: 'right',
        cellTemplate: this.valueTemplate,
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'discount',
        label: 'Discount',
        sortable: true,
        minWidth: 120,
        noGrow: true,
        sortIconPosition: 'left',
        labelPosition: 'right',
        cellContentPosition: 'right',
        cellTemplate: this.discountTemplate,
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        }
      },
      {
        identifier: 'totalValue',
        label: 'Total Value',
        sortable: true,
        minWidth: 120,
        noGrow: true,
        sortIconPosition: 'left',
        labelPosition: 'right',
        cellContentPosition: 'right',
        cellTemplate: this.valueTemplate,
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        }
      },
      {
        identifier: 'action',
        label: '',
        sortable: false,
        minWidth: 40,
        noGrow: true,
        headerHasFilterIcon: false,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: false,
        cellTemplate: this.actionDropdown
      },
    ];
    
      if (this.addedProducts.length) {
        this.tableConfig.loadingIndicator = true;
        this.rowData = this.addedProducts;
        const cloneData = this.addedProducts.map((v) => {
          return { ...v };
        });
        this.tableData.next(cloneData);
        this.tableConfig.loadingIndicator = false;
      }
    
  }
  public getJSON(): Observable<any> {
    return this.http.get('./assets/order-details.json');
  }
  filterTable(filterObj: TableFilterConfig) {
    const newRows = this.tS.filterRowInputs(
      this.tableConfig?.columns,
      this.rowData,
      filterObj
    );
    this.tableData.next(newRows);
  }
  checkout() {
    this.router.navigate(['orders', 'orders-checkout']);
  }
  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    console.log([year, month, day].join('-'))
    return [year, month, day].join('-');
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,  Object.assign({}, { class: 'gray modal-lg' }));
  }
  changeQuantity(type,row){
    console.log(row)
    
      this.addedProducts = this.addedProducts.map(e =>{
        if(e.id == row.id && type == 'inc'){
          e.quantity = e.quantity + 1
          e.totalValue = e.quantity * e.value
          return e
        }
        else if(e.id == row.id && type == 'dec'){
          if(e.quantity > 1){
            e.quantity = e.quantity - 1
            e.totalValue = e.quantity * e.value
          }
          return e
        }
        return e
      })
      console.log(this.addedProducts)
      this.tableData.next(this.addedProducts)
    

  }
}
