import { ShopService } from './../../shop/shop.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
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
import { get } from 'lodash';
import { getOrderDetailsPagePermissions } from 'src/app/core/permission/order/order.details.permission';
@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})
export class OrdersDetailsComponent implements OnInit, OnDestroy {

  caretLeftIcon = '../assets/images/caret-left.svg';
  orderId = '';
  addProduct = false;
  Currency;
  backUrl = '/orders';
  disableForm = false;
  noProduct = true;
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
  @ViewChild('dropdown', { static: true }) dropdown: TemplateRef<any>;
  @ViewChild('applicationTemplate', { static: true }) applicationTemplate: TemplateRef<any>;
  @ViewChild('productTemplate', { static: true }) productTemplate: TemplateRef<any>;
  rows = [];
  autoClose = false;
  discountTypes = [
    { title: 'Percentage', name: 'button1' },
    { title: 'Fixed', name: 'button2' },
  ];
  selectedDiscountBtn = this.discountTypes[0];

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
  addedProducts = [];
  allProducts = [];
  customers;
  // searchText = '';
  filteredCustomer;
  customerLabel = 'Select';
  savedCompanyId = 'Select';
  disableCustomer = false;
  controlStore: { [key: string]: AbstractControl; } = {};
  isDropup: boolean;
  routeId: any;
  OrderStatus: any;
  routeData$: Subscription;
  getSingleOrder$: Subscription;
  getShops$: Subscription;
  permissions: any;
  companyCurrencyCode: any;
  constructor(
    private fb: FormBuilder,
    private tS: TableService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private service: OrderService,
    private shopS: ShopService,
    private modalService: BsModalService,
    private msgS: MessagesService,
  ) { }

  selectionConfig(label: string, isDisabled: boolean = false): SelectConfig {
    return {
      selectLabel: {
        text: label,
      },
      formStatus: {
        isDisabled,
      }
    };
  }
  inputConfig(
    label: string,
    type: string = 'text',
    placeholder: string = '',
    prefixIcon: boolean = false,
    Icon: string = '',
    isDisabled: boolean = false,
  )
    : InputConfig {
    const icon = Icon === 'Currency' ? this.Currency : '%';
    return {
      inputLabel: {
        text: label,
      },
      type: type || 'text',
      placeholder,
      prefixIcon: prefixIcon || false,
      IconType: icon || '$',
      formStatus: {
        isDisabled,
      },
      currency: this.getTheCompanyCurrencyCode
    };
  }
  get getTheCompanyCurrencyCode() {
    return this.companyCurrencyCode ?? '';
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
    this.routeData$ = this.route.data.subscribe(
      res => {
        const data = get(res, 'data', null);
        if (!data?.accessDetailsScreen) {
          this.router.navigate(['/access-denied']);
        } else {
          const auth = get(data, 'auth', null);
          this.permissions = getOrderDetailsPagePermissions(auth);
          this.ngOnInitIt();
          this.setFormDisableAccess();
          this.componentForm.get('searchCompany').enable();
        }
      }
    );
  }
  ngOnInitIt(): void {
    this.loadOrder();
    this.initForm();
    this.service.getcustomers().subscribe((e: any) => {
      this.customers = e.customers;
      this.filteredCustomer = e.customers;
    });
    this.routeId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.shopS.buyStore.subscribe((e: any) => {
      const orderId = this.routeId;
      if (e.hasOwnProperty('id') && !e.fromStore) {
        const companyId = this.componentForm.get('companyId').value || this.savedCompanyId;
        const obj: any = {
          orderId,
          productPriceId: e.id
        };
        if (companyId !== null && companyId !== 'Select') {
          obj.companyId = companyId;
          this.componentForm.get('companyId').disable();
          this.service.addOrderToCart(orderId, obj).subscribe(res => {
            this.loadOrder();
          }, (err) => {
            this.displayMsg(err.error, 'danger');
          });
          this.ref.detectChanges();
        } else {
          this.displayMsg('Please select a customer', 'info');
        }
        this.onInitTable();
      }
    });
    this.loadOrder();
    this.onInitTable();
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
  loadOrder() {
    const id = this.route.snapshot.paramMap.get('id');
    this.orderId = id;
    if (id) {
      const idx = parseInt(id, 10);
      this.getSingleOrder$ = this.service.getSingleOrder(idx).subscribe((e: any) => {
        this.OrderStatus = e.OrderStatus;
        if (e.CompanyId !== null) {
          this.companyCurrencyCode = get(e, 'Currency', '');
          this.savedCompanyId = e.CompanyId;
          this.componentForm.get('companyId').disable();
          this.disableCustomer = true;
          this.ref.detectChanges();
        }
        const orderItems: any[] = e.OrderItems;
        this.getShops$ = this.service.getShops().subscribe((shop: any[]) => {
          console.log(shop);
          this.addedProducts = [];
          shop.forEach(s => {
            const index = orderItems.findIndex((item: any) => item.ProductId === s.product.id);
            if (index > -1) {
              this.noProduct = false;
              this.addedProducts.push({
                quantity: orderItems[index].Quantity,
                value: orderItems[index].Value,
                discount: orderItems[index].Discount,
                DiscountPrc: orderItems[index].DiscountPrc,
                totalValue: orderItems[index].TotalValue,
                application: s.product.name,
                productType: s.product.productType,
                priceListId: s.id,
                supportHours: s.supportHours,
                renewalValue: s.renewalValue,
                orderItemId: orderItems[index].Id
              });
            } else {
              return null;
            }
          });
          const uniqueArray = this.addedProducts.filter((v, i) => {
            return this.addedProducts.indexOf(v) === i;
          });
          this.shopS.cartStore.next(this.addedProducts);
          this.rowData = this.addedProducts;
          const cloneData = this.addedProducts.map((v) => {
            return { ...v };
          });
          this.tableData.next(cloneData);
          if (this.addedProducts.length < 1) {
            this.noProduct = true;
          }
          this.ref.detectChanges();
          const dBody = document.querySelector('.datatable-body') as HTMLElement;
          if (dBody) {
            dBody.style.minHeight = 'auto';
            dBody.style.height = 'auto';
          }

        });
        const discountPrc = e.DiscountPrc.toFixed(2);
        this.Currency = e.Currency;
        this.componentForm.patchValue({
          orderNumber: e.Id,
          companyId: e.CompanyId,
          status: e.OrderStatus,
          value: e.Value,
          discount: discountPrc,
          totalValue: e.TotalValue.toFixed(2)
        });
        this.componentForm.get('orderDate').patchValue(this.formatDate(new Date(e.CreateDate)));
        if (e.OrderStatus === 'WaitingPaymentConfirmation') {
          this.disableForm = true;
          this.componentForm.disable();
          this.ref.detectChanges();
        }
      },err =>{
        console.log(err)
        this.displayMsg(err.error, 'info')
        setTimeout(()=>{
          this.router.navigate(['/orders/'])
        }, 5000)
      });
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
      searchCompany: [
        '',
        [
          Validators.required,
        ],
      ],
    });
  }
  onInitTable(): void {
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = this.getTableColumns();
    if (this.addedProducts.length) {
      // this.tableConfig.loadingIndicator = true;
      this.noProduct = false;
      this.rowData = this.addedProducts;
      const cloneData = this.addedProducts.map((v) => {
        return { ...v };
      });
      this.tableData.next(cloneData);
      this.tableConfig.loadingIndicator = false;
    } else {
      this.tableConfig.loadingIndicator = false;
      this.noProduct = true;
      const empty = document.getElementsByClassName('empty-row') as HTMLCollectionOf<HTMLElement>;
      if (empty.length !== 0) {
        empty[0].style.display = 'none';
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
  checkout(OrderStatus) {
    if (OrderStatus === 'WaitingPaymentConfirmation' || OrderStatus === 'Paid') {
      return;
    } else {
      const companyId = this.componentForm.get('companyId').value;
      this.router.navigate(['orders/orders-checkout', { id: this.routeId }]);
    }
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
  openModal(template: TemplateRef<any>, OrderStatus) {
    if (OrderStatus === 'WaitingPaymentConfirmation' || OrderStatus === 'Paid') {
      return;
    } else {
      if (this.savedCompanyId === 'Select' || this.savedCompanyId === null) {
        this.displayMsg('To add a product you must be select customer', 'info');
      } else {
        this.shopS.shopStore.subscribe(e => {
          this.allProducts = e;
        });
        this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
      }
    }
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
      ]
    });
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray' }));
  }
  openOrderDiscountModal(template: TemplateRef<any>, row) {
    if (this.fieldsAccessStatus.discount) {
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
      });
      this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray' }));
    }
  }
  changeQuantity(type, row) {
    this.addedProducts = this.addedProducts.map(e => {
      if (e.orderItemId === row.orderItemId && type === 'inc') {
        const obj = {
          orderId: this.routeId,
          productPriceId: e.priceListId,
          companyId: this.savedCompanyId
        };
        this.service.addOrderToCart(this.routeId, obj).subscribe(res => {
          this.loadOrder();
        }, (err) => this.displayMsg(err.error, 'danger'));
        return e;
      }
      else if (e.orderItemId === row.orderItemId && type === 'dec') {
        const obj = {
          orderItemId: e.orderItemId,
        };
        this.service.reduceCartItem(e.orderItemId, obj).subscribe(res => {
          this.loadOrder();
        }, err => {
          this.displayMsg(err.error, 'danger');
        });
        return e;
      }
      return e;
    });
    this.ref.detectChanges();
    this.tableData.next(this.addedProducts);
  }
  submitForm() {
    const values = this.componentForm.value;
  }
  onChange(option, field) {
    this.savedCompanyId = option;
    this.customerLabel = option;
    this.componentForm.get(field).patchValue(option);

  }
  setClose() {
    this.autoClose = false;
    // if(this.autoClose){
    // }else{
    //   this.autoClose = true
    // }
  }
  setCustomer(company, id) {
    this.autoClose = true;
    this.componentForm.get('companyId').setValue(id);
    this.customerLabel = company;
    this.savedCompanyId = id;
    this.filteredCustomer = this.customers;
    this.componentForm.get('searchCompany').patchValue('');
    this.ref.detectChanges();
  }
  onSearchChange(customer: string) {
    this.autoClose = false;
    this.filteredCustomer = this.customers.filter(e => e.companyName.toLowerCase().includes(customer.toLowerCase()));
    this.ref.detectChanges();
  }
  cancelOrder() {
    const id = this.route.snapshot.paramMap.get('id');
    this.service.cancelOrder(id).subscribe(e => {
      this.router.navigate(['orders']);
    });
  }
  payOrder() {
    const id = this.route.snapshot.paramMap.get('id');
    this.service.payOrder(id).subscribe(e => {
      this.router.navigate(['orders']);
    });
  }
  deleteItem(row) {
    const obj = {
      orderItemId: row.orderItemId,
      orderId: this.routeId
    };
    this.service.deleteCartItem(row.orderItemId, obj).subscribe(e => {
      this.loadOrder();
    }, err => {
      if (err.status === 200) {
        this.loadOrder();
      }
      this.displayMsg(err.error, 'danger');
    });
  }
  setDiscountType(event, button) {
    event.preventDefault();
    this.discountForm.patchValue({
      value: 0
    }, { onlySelf: true });
    if (button === this.selectedDiscountBtn) {
      this.setFormValue('discountType', button.title);
      this.selectedDiscountBtn = undefined;
    } else {
      this.setFormValue('discountType', button.title);
      this.selectedDiscountBtn = button;
    }
  }
  setFormValue(field, value) {
    this.discountForm.get(field).patchValue(value, {
      onlySelf: false
    });
  }
  submitDiscountForm() {
    const values = this.discountForm.value;
    if (values.discountType === 'Fixed') {
      values.discountInValue = parseInt(values.value, 10);
      values.discountInPercentage = 0;
      values.discountType = 'FixedValue';
    } else {
      values.discountInValue = 0;
      values.discountInPercentage = parseInt(values.value, 10);
    }
    delete values.value;
    this.service.applyDiscount(values.orderItemId, values).subscribe(e => {
      this.loadOrder();
      this.modalService.hide(1);
      this.selectedDiscountBtn = this.discountTypes[0];
    }, (err) => {
      this.modalRef.hide();
      this.displayMsg(err.error, 'danger');
    });
  }
  submitOrderDiscountForm() {
    const values = this.discountForm.value;
    const obj = {
      orderId: this.routeId,
      discountPrc: values.value
    };
    this.service.orderDiscount(this.routeId, obj).subscribe(e => {
      this.loadOrder();
      this.modalService.hide(1);
      this.selectedDiscountBtn = this.discountTypes[0];
    }, (err) => {
      this.modalRef.hide();
      this.displayMsg(err.error, 'danger');
    });
  }
  get fieldsHiddenStatus() {
    const field = get(this.permissions, 'fields', null);
    if (field) {
      return {
        orderNumber: field.orderNumber === 'hidden' ? true : false,
        companyId: field.companyId === 'hidden' ? true : false,
        status: field.status === 'hidden' ? true : false,
        orderDate: field.orderDate === 'hidden' ? true : false,
        value: field.value === 'hidden' ? true : false,
        discount: field.discount === 'hidden' ? true : false,
        totalValue: field.totalValue === 'hidden' ? true : false,
      };
    }
  }
  get fieldsReadOnlyStatus() {
    const field = get(this.permissions, 'fields', null);
    if (field) {
      return {
        orderNumber: field.orderNumber === 'readonly' ? true : false,
        companyId: field.companyId === 'readonly' ? true : false,
        status: field.status === 'readonly' ? true : false,
        orderDate: field.orderDate === 'readonly' ? true : false,
        value: field.value === 'readonly' ? true : false,
        discount: field.discount === 'readonly' ? true : false,
        totalValue: field.totalValue === 'readonly' ? true : false,
      };
    }
  }
  get fieldsAccessStatus() {
    const field = get(this.permissions, 'fields', null);
    if (field) {
      return {
        orderNumber: field.orderNumber === 'full' ? true : false,
        companyId: field.companyId === 'full' ? true : false,
        status: field.status === 'full' ? true : false,
        orderDate: field.orderDate === 'full' ? true : false,
        value: field.value === 'full' ? true : false,
        discount: field.discount === 'full' ? true : false,
        totalValue: field.totalValue === 'full' ? true : false,
      };
    }
  }
  get totalFieldHiddenAccess() {
    const orderNumber = get(this.fieldsHiddenStatus, 'orderNumber', false);
    const companyId = get(this.fieldsHiddenStatus, 'companyId', false);
    const status = get(this.fieldsHiddenStatus, 'status', false);
    const orderDate = get(this.fieldsHiddenStatus, 'orderDate', false);
    const value = get(this.fieldsHiddenStatus, 'value', false);
    const discount = get(this.fieldsHiddenStatus, 'discount', false);
    const totalValue = get(this.fieldsHiddenStatus, 'totalValue', false);
    return (orderNumber && companyId && status && orderDate && value && discount && totalValue)
      ? true
      : false;
  }
  setFormDisableAccess() {
    const orderNumber = get(this.fieldsAccessStatus, 'orderNumber', false);
    const companyId = get(this.fieldsAccessStatus, 'companyId', false);
    const status = get(this.fieldsAccessStatus, 'status', false);
    const orderDate = get(this.fieldsAccessStatus, 'orderDate', false);
    const value = get(this.fieldsAccessStatus, 'value', false);
    const discount = get(this.fieldsAccessStatus, 'discount', false);
    const totalValue = get(this.fieldsAccessStatus, 'totalValue', false);
    (orderNumber && companyId && status && orderDate && value && discount && totalValue)
      ? this.componentForm.disable()
      : this.componentForm.enable();
  }
  get gridColumnsReadOnlyAccessStatus() {
    const field = get(this.permissions, 'gridColumns', null);
    return {
      productType: field.productType === 'readonly' ? true : false,
      quantity: field.productType === 'readonly' ? true : false,
      value: field.productType === 'readonly' ? true : false,
      discount: field.productType === 'readonly' ? true : false,
      totalValue: field.productType === 'readonly' ? true : false,
    };
  }
  get gridColumnsIsTotallyReadonly() {
    const gridC = this.gridColumnsReadOnlyAccessStatus;
    return (
      gridC.discount &&
      gridC.totalValue &&
      gridC.quantity &&
      gridC.value) ? true : false;
  }
  get displayOptions() {
    const optionsStatus = get(get(this.permissions, 'actions', null), 'options', null);
    return optionsStatus === 'full' ? true : false;
  }
  getTableColumns(permission: any = this.permissions): Array<any> {
    const applicationColumn = {
      identifier: 'application',
      label: 'Application',
      sortable: true,
      minWidth: 280,
      noGrow: true,
      sortIconPosition: 'right',
      labelPosition: 'left',
      cellContentPosition: 'left',
      cellTemplate: this.applicationTemplate,
      filterConfig: {
        data: null,
        filterType: TableFilterType.TEXT,
        placeholder: 'Search'
      },
    };
    const umColumn = {
      identifier: 'um',
      label: 'UM?',
      sortable: true,
      minWidth: 160,
      noGrow: true,
      sortIconPosition: 'right',
      labelPosition: 'left',
      cellContentPosition: 'left',
      filterConfig: {
        data: null,
        filterType: TableFilterType.TEXT,
        noIcon: true
      },
    };
    const columns = [
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
        cellTemplate: this.productTemplate,
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
    ];
    const action = {
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
    };
    const tempColumn = [];
    const columnsPermission = get(permission, 'gridColumns', null);
    for (const columnKey in columnsPermission) {
      if (columnsPermission[columnKey] === 'full' || columnsPermission[columnKey] === 'readonly') {
        const d = columns.find(column => column.identifier.toLowerCase() === columnKey.toLowerCase());
        if (d) {
          tempColumn.push(d);
        }
      }
    }
    tempColumn.unshift(applicationColumn);
    tempColumn.splice(2, 0, umColumn);
    /*  && !this.gridColumnsIsTotallyReadonly */
    if (tempColumn.length !== 0) {
      tempColumn.push(action);
    }
    return tempColumn;
  }
  ngOnDestroy() {
    this.routeData$.unsubscribe();
    if (this.getSingleOrder$) {
      this.getSingleOrder$.unsubscribe();
    }
    if (this.getShops$) {
      this.getShops$.unsubscribe();
    }
  }
}
