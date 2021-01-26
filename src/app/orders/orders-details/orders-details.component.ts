import { ShopService } from './../../shop/shop.service';
import { Order } from './../../core/models/order.interface';
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
import { OrderService } from '../service.service';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';
@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})
export class OrdersDetailsComponent implements OnInit {

  caretLeftIcon = '../assets/images/caret-left.svg';
  orderId = ''
  backUrl = '/orders';
  disableForm = false;
  noProduct = true
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
  discountTypes =  [
    {title: 'Percentage', name: 'button1'},
    {title: 'Fixed', name: 'button2'},
  ];
  selectedDiscountBtn = this.discountTypes[0]

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
    hoverDetail: false,
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
  discountForm: FormGroup;
  addedProducts = []
  allProducts = []
  customers
  savedCompanyId = 'Select'
  disableCustomer = false
  controlStore: { [key: string]: AbstractControl; } = {};
  isDropup: boolean;
  routeId:any
  constructor(
    private fb: FormBuilder,
    private tS: TableService,
    private http: HttpClient,
    private ref: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private service: OrderService,
    private shopS: ShopService,
    private modalService: BsModalService,
    private msgS: MessagesService
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
      placeholder ,
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
    this.loadOrder()
    this.service.getcustomers().subscribe(e =>{
      this.customers = e
    })
    this.routeId = parseInt(this.route.snapshot.paramMap.get('id'), 10)
    this.shopS.buyStore.subscribe((e:any) =>{
      const orderId = this.routeId
      console.log(e.hasOwnProperty('id'))
      if(e.hasOwnProperty('id')){
        const companyId = this.componentForm.get('companyId').value || this.savedCompanyId
        const obj: any = {
          orderId,
          productPriceId: e.id
        }
        console.log(this.addedProducts)
          if(companyId !== null){
            obj.companyId = companyId
            this.componentForm.get('companyId').disable()
            this.ref.detectChanges()
          }else{
            this.displayMsg('Please select a customer', 'info')
          }
          console.log(obj)
        this.service.addOrderToCart(orderId, obj).subscribe(res =>{
          this.loadOrder()
        },(err)=>{
          this.displayMsg(err.error, 'danger')
        })
        this.onInitTable()
      }
    })
    this.initForm();
    this.loadOrder()
    this.onInitTable();
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
  loadOrder(){
    const id = this.route.snapshot.paramMap.get('id');
    this.orderId = id
    if(id){
      const idx = parseInt(id,10)
      this.service.getSingleOrder(idx).subscribe((e: any) =>{
        if(e.CompanyId !== null){
          this.savedCompanyId = e.CompanyId
          this.componentForm.get('companyId').disable()
          this.disableCustomer = true
          this.ref.detectChanges()
        }
        const orderItems: any[] = e.OrderItems
        this.service.getShops().subscribe((shop:any[]) =>{
          this.addedProducts = []
          shop.forEach(s =>{
              const index = orderItems.findIndex((item:any) => item.ProductId === s.product.id )
              if(index > -1){
                this.noProduct = false
                this.addedProducts.push({
                  quantity: orderItems[index].Quantity,
                  value: orderItems[index].Value,
                  discount: orderItems[index].Discount,
                  totalValue: orderItems[index].TotalValue,
                  application: s.product.name,
                  productType: s.product.productType,
                  priceListId: s.id,
                  supportHours: s.supportHours,
                  renewalValue: s.renewalValue,
                  orderItemId: orderItems[index].Id
                })
              }else{
                return null
              }
          })
          const uniqueArray = this.addedProducts.filter((v,i) =>{
            return this.addedProducts.indexOf(v) === i
          })
          this.rowData = this.addedProducts;
          const cloneData = this.addedProducts.map((v) => {
            return { ...v };
          });
          this.tableData.next(cloneData);
          if(this.addedProducts.length < 1){
            this.noProduct = true
          }
          const dBody = document.querySelector('.datatable-body') as HTMLElement;
          dBody.style.minHeight = 'auto';
          dBody.style.height = 'auto';
        })
        console.log(e)
        const discountPrc = e.DiscountPrc.toFixed(2)
        this.componentForm.patchValue({
          orderNumber: e.Id,
          companyId: e.CompanyId,
          status: e.OrderStatus,
          value: e.Value,
          discount: discountPrc,
          totalValue: e.TotalValue.toFixed(2)
        })
        this.componentForm.get('orderDate').patchValue(this.formatDate(new Date(e.CreateDate)));
        if(e.OrderStatus === 'WaitingPaymentConfirmation'){
          this.disableForm = true;
          this.componentForm.disable()
          this.ref.detectChanges()
        }
      })
    }
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
      companyId: [
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
        identifier: 'application',
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
        identifier: 'productType',
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
        // this.tableConfig.loadingIndicator = true;
        this.noProduct = false
        this.rowData = this.addedProducts;
        const cloneData = this.addedProducts.map((v) => {
          return { ...v };
        });
        this.tableData.next(cloneData);
        this.tableConfig.loadingIndicator = false;
      }else{
        this.tableConfig.loadingIndicator = false
        this.noProduct = true
        const empty = document.getElementsByClassName('empty-row') as HTMLCollectionOf<HTMLElement>
        if(empty.length !== 0){
          empty[0].style.display = 'none'
        }
      }
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
    const companyId = this.componentForm.get('companyId').value
    this.router.navigate(['orders/orders-checkout', { id: this.routeId }]);
  }
  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  openModal(template: TemplateRef<any>) {
    this.shopS.shopStore.subscribe(e =>{
      this.allProducts = e
    })
    this.modalRef = this.modalService.show(template,  Object.assign({}, { class: 'gray modal-lg' }));
  }
  openDiscountModal(template: TemplateRef<any>, row) {
    this.discountForm = this.fb.group({
      orderItemId: [
        row.orderItemId,
        [
          Validators.required,
        ],
      ],
      discountType: [
        'Percentage',
        [
          Validators.required,
        ],
      ],
      value: [
        0,
      ],
      vat: [
        0,
      ],
    })
    this.modalRef = this.modalService.show(template,  Object.assign({}, { class: 'gray' }));
  }
  openOrderDiscountModal(template: TemplateRef<any>, row) {
    this.discountForm = this.fb.group({
      orderId: [
        this.routeId,
        [
          Validators.required,
        ],
      ],
      discountType: [
        'Percentage',
        [
          Validators.required,
        ],
      ],
      value: [
        0,
      ]
    })
    this.modalRef = this.modalService.show(template,  Object.assign({}, { class: 'gray' }));
  }
  changeQuantity(type,row){
    this.addedProducts = this.addedProducts.map(e =>{
      if(e.orderItemId === row.orderItemId && type === 'inc'){
        const obj = {
          orderId: this.routeId,
          productPriceId: e.priceListId,
          companyId: this.savedCompanyId
        }
        this.service.addOrderToCart(this.routeId, obj).subscribe(res =>{
          this.loadOrder()
        },(err) => this.displayMsg(err.error, 'danger'))
        return e
      }
      else if(e.orderItemId === row.orderItemId && type === 'dec'){
        const obj = {
          orderItemId: e.orderItemId,
        }
        this.service.reduceCartItem(e.orderItemId, obj).subscribe(res =>{
          this.loadOrder()
        },err => {
          this.displayMsg(err.error, 'danger')
          console.log(err)
        })
        return e;
      }
      return e
    })
    this.ref.detectChanges()
    this.tableData.next(this.addedProducts)
  }
  submitForm(){
    const values = this.componentForm.value
  }
  onChange(option, field) {
    this.componentForm.get(field).patchValue(option)
  }
  cancelOrder(){
    const id = this.route.snapshot.paramMap.get('id');
    this.service.cancelOrder(id).subscribe(e =>{
      this.router.navigate(['orders'])
    })
  }
  payOrder(){
    const id = this.route.snapshot.paramMap.get('id');
    this.service.payOrder(id).subscribe(e =>{
      this.router.navigate(['orders'])
    })
  }
  deleteItem(row){
    const obj = {
      orderItemId: row.orderItemId,
      orderId: this.routeId
    }
    this.service.deleteCartItem(row.orderItemId, obj).subscribe(e =>{
      this.loadOrder()
    },err => {
      if(err.status === 200){
        console.log(err.status)
        this.loadOrder()
      }
      this.displayMsg(err.error, 'danger')
    })
  }
  setDiscountType(event, button) {
    event.preventDefault();
    this.discountForm.patchValue({
      value: 0
    },{onlySelf:true});
    if (button === this.selectedDiscountBtn) {
      this.setFormValue('discountType',button.title);
      this.selectedDiscountBtn = undefined;
    } else {
      this.setFormValue('discountType', button.title);
      this.selectedDiscountBtn = button;
    }
  }
  setFormValue(field,value){
    this.discountForm.get(field).patchValue(value, {
      onlySelf: false
    });
  }
  submitDiscountForm(){
    const values = this.discountForm.value
    if(values.discountType === 'Fixed'){
      values.discountInValue = parseInt(values.value,10)
      values.discountInPercentage = 0
      values.discountType = 'FixedValue'
    }else{
      values.discountInValue = 0
      values.discountInPercentage = parseInt(values.value,10)
    }
    delete values.value
    this.service.applyDiscount(values.orderItemId, values).subscribe(e =>{
      this.loadOrder()
      this.modalService.hide(1)
    },(err)=>{
      this.modalRef.hide()
      this.displayMsg(err.error, 'danger')
    })
  }
  submitOrderDiscountForm(){
    const values = this.discountForm.value
    console.log(values)
    const obj = {
      orderId: this.routeId,
      discountPrc: values.value
    }
    this.service.orderDiscount(this.routeId, obj).subscribe(e =>{
      this.loadOrder()
      this.modalService.hide(1)
    },(err)=>{
      this.modalRef.hide()
      this.displayMsg(err.error, 'danger')
    })
  }
}
