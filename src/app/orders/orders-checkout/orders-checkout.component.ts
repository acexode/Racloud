import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';
import { OrderService } from '../service.service';

@Component({
  selector: 'app-orders-checkout',
  templateUrl: './orders-checkout.component.html',
  styleUrls: ['./orders-checkout.component.scss']
})
export class OrdersCheckoutComponent implements OnInit {
  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/customer';
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
  paymentMethod= [
    {title: 'Bank Transfer', name: 'button1'},
    {title: 'Credit Card', name: 'button2'},
  ];
  orderId
  paymentMethodBtn = this.paymentMethod[0]
  constructor(private msgS: MessagesService, private route: ActivatedRoute,
    private service: OrderService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.checkoutDetails = params;
      this.orderId = params.orderId
      this.service.getOneCustomers(params.id).subscribe(e =>{
        this.customerDetails = e
      })
    });
    const msg = 'You will receive a proforma invoice with all the data necessary to make the bank transfer by email.'
    this.displayMsg(msg, 'info')
  }
  selectPaymentMethod(event,button){
    event.preventDefault();
    if (button === this.paymentMethodBtn) {
      // this.setFormValue('partner',button.title);
      this.paymentMethodBtn = undefined;
    } else {
      // this.setFormValue('partner', button.title);
      this.paymentMethodBtn = button;
    }
  }
  sendOrder(){
    console.log(this.orderId)
    this.service.sendOrder(this.orderId).subscribe(e =>{
      console.log(e)
    },(err) =>{
      console.log(err)
      this.displayMsg(err.error, 'danger');
    })
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
