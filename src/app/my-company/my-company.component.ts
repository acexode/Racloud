import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomerService } from '../core/services/customer/customer.service';
import { PageContainerConfig } from '../shared/container/models/page-container-config.interface';
import { MessagesService } from '../shared/messages/services/messages.service';

@Component({
  selector: 'app-my-company',
  templateUrl: './my-company.component.html',
  styleUrls: ['./my-company.component.scss']
})
export class MyCompanyComponent implements OnInit {
  route$: Subscription;
  fetchComapany$: Subscription;
  containerConfig: PageContainerConfig = {
    closeButton: true,
    theme: 'transparent',
    shadow: false,
    panelClasses: {
      header: 'd-none',
      body: 'no-shadow',
    },
  };
  constructor(
    public route: ActivatedRoute,
    private msgS: MessagesService,
    private customerS: CustomerService
  ) { }

  ngOnInit(): void {
    this.route$ = this.route.paramMap.subscribe(
      params => {
        const id: any = params.get('id');
        const routeTab: any = params.get('tab');
        this.fetchComapany$ = this.customerS.getCustomerById(id).subscribe(
          (res: any) => {
            console.log(res);
            if (res) {
            }
          },
          _err => { }
        );
      }
    );

  }

}
