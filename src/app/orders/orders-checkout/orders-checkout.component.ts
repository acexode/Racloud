import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';
import { TableFilterType } from 'src/app/shared/table/models/table-filter-types';
import { TableI } from 'src/app/shared/table/models/table.interface';
import { OrderService } from '../service.service';
import {Location} from '@angular/common';
@Component({
  selector: 'app-orders-checkout',
  templateUrl: './orders-checkout.component.html',
  styleUrls: ['./orders-checkout.component.scss']
})
export class OrdersCheckoutComponent implements OnInit {
  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/orders';
  checkoutDetails
  customerDetails
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
  addedProducts = []
  allProducts = []
  customers
  savedCompanyId = null
  disableCustomer = false
  controlStore: { [key: string]: AbstractControl; } = {};
  isDropup: boolean;
  routeId:any
  paymentMethod= [
    {title: 'Bank Transfer', name: 'BankTransfer'},
    {title: 'Credit Card', name: 'CreditCard'},
  ];
  orderId
  totalValue
  paymentMethodBtn = this.paymentMethod[0]
  noProduct: boolean;
  constructor(private msgS: MessagesService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private service: OrderService) { }

  ngOnInit(): void {
    this.orderId = parseInt(this.route.snapshot.paramMap.get('id'), 10)
    this.service.getSingleOrder(this.orderId).subscribe((e:any) =>{
      this.checkoutDetails = e
      this.addedProducts = e.OrderItems
      this.totalValue = this.addedProducts.map(product => product.TotalValue).reduce((total,num) => total + num)
      this.service.getOneCustomers(e.CompanyId).subscribe(customer =>{
        this.customerDetails = customer
      })
    })
  }
  onInitTable(): void {
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = [
      {
        identifier: 'quantity',
        label: '',
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
        identifier: 'ProductName',
        label: '',
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
        identifier: 'TotalValue',
        label: '',
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
      }
    ];
      if (this.addedProducts.length) {
        // this.tableConfig.loadingIndicator = true;
        console.log(this.addedProducts)
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
          console.log(empty)
          empty[0].style.display = 'none'
        }
      }
  }
  selectPaymentMethod(event,button){
    event.preventDefault();
    if (button === this.paymentMethodBtn) {
      this.paymentMethodBtn = undefined;
    } else {
      this.paymentMethodBtn = button;
    }
  }
  sendOrder(){
    const obj = {
      paymentMethod: this.paymentMethodBtn.name
    }
    this.service.sendOrder(this.orderId, obj).subscribe(e =>{
      this.router.navigate(['orders'])
    },(err) =>{
      this.displayMsg(err.error, 'danger');
    })
  }
  navigateBack(){
    this._location.back()
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
}
