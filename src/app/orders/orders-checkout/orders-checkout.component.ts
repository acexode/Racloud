import { Component, OnInit } from '@angular/core';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';

@Component({
  selector: 'app-orders-checkout',
  templateUrl: './orders-checkout.component.html',
  styleUrls: ['./orders-checkout.component.scss']
})
export class OrdersCheckoutComponent implements OnInit {
  caretLeftIcon = '../assets/images/caret-left.svg';
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
  constructor(private msgS: MessagesService) { }

  ngOnInit(): void {
    this.msgS.addMessage({
      text: 'You will receive a proforma invoice with all the data necessary to make the bank transfer by email.',
      type: 'info',
      dismissible: true,
      customClass: 'mt-32',
      hasIcon: true,
    });
  }

}
