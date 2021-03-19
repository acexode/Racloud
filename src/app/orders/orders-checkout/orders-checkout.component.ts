import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';
import { OrderService } from '../service.service';
import { Location } from '@angular/common';
import { ShopService } from 'src/app/shop/shop.service';
@Component({
  selector: 'app-orders-checkout',
  templateUrl: './orders-checkout.component.html',
  styleUrls: ['./orders-checkout.component.scss']
})
export class OrdersCheckoutComponent implements OnInit {
  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/orders';
  checkoutDetails;
  customerDetails;
  containerConfig: PageContainerConfig = {
    closeButton: true,
    theme: 'transparent',
    shadow: false,
    panelClasses: {
      header: 'd-none',
      body: 'no-shadow',
    },
  };
  rows = [];
  discountTypes = [
    { title: 'Percentage', name: 'button1' },
    { title: 'Fixed', name: 'button2' },
  ];
  selectedDiscountBtn = this.discountTypes[0];
  rowData: Array<any> = [];
  tableData: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  addedProducts = [];
  allProducts = [];
  customers;
  savedCompanyId = null;
  disableCustomer = false;
  controlStore: { [key: string]: AbstractControl; } = {};
  isDropup: boolean;
  routeId: any;
  paymentMethod = [
    { title: 'Bank Transfer', name: 'BankTransfer', isDisabled: false },
    { title: 'Credit Card', name: 'CreditCard', isDisabled: true },
  ];
  orderId;
  totalValue;
  paymentMethodBtn = this.paymentMethod[0];
  noProduct: boolean;
  constructor(
    private msgS: MessagesService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private service: OrderService,
    private shopS: ShopService,
  ) { }

  ngOnInit(): void {
    this.orderId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.service.getSingleOrder(this.orderId).subscribe((e: any) => {
      console.log(e);
      this.checkoutDetails = e;
      this.addedProducts = e.OrderItems;
      this.totalValue = this.addedProducts.map(product => product.TotalValue).reduce((total, num) => total + num);
      this.service.getOneCustomers(e.CompanyId).subscribe((obj: any) => {
        this.customerDetails = obj.customer;
      });
    });
  }
  selectPaymentMethod(event, button) {
    event.preventDefault();
    if (button === this.paymentMethodBtn) {
      this.paymentMethodBtn = undefined;
    } else {
      this.paymentMethodBtn = button;
    }
  }
  sendOrder() {
    const obj = {
      paymentMethod: this.paymentMethodBtn.name
    };
    this.service.sendOrder(this.orderId, obj).subscribe(e => {
      this.shopS.cartStore.next([]);
      this.shopS.cartId.next(false)
      this.router.navigate(['orders']);
    }, (err) => {
      this.displayMsg(err.error, 'danger');
    });
  }
  navigateBack() {
    this._location.back();
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
}
