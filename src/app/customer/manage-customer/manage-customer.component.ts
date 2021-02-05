import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';

@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit, AfterViewInit, OnDestroy {
  route$: Subscription;
  fetch$: Subscription;
  detailsData$: BehaviorSubject<any> = new BehaviorSubject({});
  /* for tab */
  @ViewChild('detailsTab', { read: TemplateRef }) detailsTab: TemplateRef<any>;
  @ViewChild('loaderTemplate', { read: TemplateRef }) loaderTemplate: TemplateRef<any>;
  @ViewChild('licenseTab', { read: TemplateRef }) licenseTab: TemplateRef<any>;
  @ViewChild('userTab', { read: TemplateRef }) userTab: TemplateRef<any>;
  @ViewChild('ordersTab', { read: TemplateRef }) ordersTab: TemplateRef<any>;
  @ViewChild('customersTab', { read: TemplateRef }) customersTab: TemplateRef<any>;
  tabMarked = {
    left: '0px',
    width: '0px',
  };
  tabSwitch: any;
  tabs = [
    {
      name: 'Details',
      template: 'detailsTab',
      isSelected: false,
      defaultSelected: true,
    },
    {
      name: 'License',
      template: 'licenseTab',
      isSelected: false,
      defaultSelected: false,
    },
    {
      name: 'Users',
      template: 'userTab',
      isSelected: false,
      defaultSelected: false,
    },
    {
      name: 'Orders',
      template: 'ordersTab',
      isSelected: false,
      defaultSelected: false,
    },
    {
      name: 'Customers',
      template: 'customersTab',
      isSelected: false,
      defaultSelected: false,
    },
  ];
  /*  */
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
  constructor(
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private msgS: MessagesService,
    private customerS: CustomerService
  ) { }

  ngOnInit(): void {
    this.route$ = this.route.paramMap.subscribe(
      params => {
        const id: any = params.get('id');
        this.fetch$ = this.customerS.getCustomerById(id).subscribe(
          (res: any) => {
            if (res) {
              this.detailsData$.next(res);
              this.showTab(this.detailsTab);
            }
          },
          _err => {
            this.msgS.addMessage({
              text: 'Unable to get customer Data at this current time please check your newtowrk and try again.',
              type: 'danger',
              dismissible: true,
              customClass: 'mt-32',
              hasIcon: true
            });
          }
        );
      }
    );
    this.cdref.markForCheck();
  }
  /* tab */
  ngAfterViewInit() {
    this.showTab();
    this.cdref.detectChanges();
  }

  showTab(tabTemplate: TemplateRef<any> = this.loaderTemplate) {
    this.tabSwitch = tabTemplate;
  }

  switchTab(event: any, tabName: string, index: number) {
    this.tabSwitch = this[tabName];
    this.ressetTabSelectStatus();
    // set as active
    this.tabMarked = {
      left: `${ event.target.offsetLeft }px`,
      width: `${ event.target.offsetWidth }px`
    };
    this.tabs[index].isSelected = true;
  }
  ressetTabSelectStatus() {
    for (const tab of this.tabs) {
      tab.isSelected = false;
      tab.defaultSelected = false;
    }
  }
  /*  */
  ngOnDestroy(): void {
    this.route$.unsubscribe();
    this.fetch$.unsubscribe();
  }

}
