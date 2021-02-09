import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'lodash';
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
  customerId: any;
  tabs = [
    {
      name: 'Details',
      template: 'detailsTab',
      isSelected: false,
      defaultSelected: false,
      showTab: true,
    },
    {
      name: 'License',
      template: 'licenseTab',
      isSelected: false,
      defaultSelected: false,
      showTab: true,
    },
    {
      name: 'Users',
      template: 'userTab',
      isSelected: false,
      defaultSelected: false,
      showTab: true,
    },
    {
      name: 'Orders',
      template: 'ordersTab',
      isSelected: false,
      defaultSelected: false,
      showTab: true,
    },
    {
      name: 'Customers',
      template: 'customersTab',
      isSelected: false,
      defaultSelected: false,
      showTab: true,
    },
  ];
  /*  */
  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/customer';
  routeData$: Subscription;
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
    public route: ActivatedRoute,
    private msgS: MessagesService,
    private customerS: CustomerService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.routeData$ = this.route.data.subscribe(
      res => {
        const data = get(res, 'data', null);
        if (!data?.accessDetailsScreen) {
          this.router.navigate(['/access-denied']);
        }
      }
    );
    this.route$ = this.route.paramMap.subscribe(
      params => {
        const id: any = params.get('id');
        const tab: any = params.get('tab');
        this.customerId = id;
        this.fetch$ = this.customerS.getCustomerById(id).subscribe(
          (res: any) => {
            if (res) {
              this.detailsData$.next(res);
              this.setTab(tab);
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
    // update route
    this.router.navigate(['/customer/manage', this.customerId, 'tab', this.tabs[index].name.toLowerCase()]);
  }
  ressetTabSelectStatus() {
    for (const tab of this.tabs) {
      tab.isSelected = false;
      tab.defaultSelected = false;
    }
  }
  get UserTab() {
    return this.tabs.find(tab => tab.template === 'userTab');
  }
  setTab(tabName: any) {
    const tabIndex = this.tabs.findIndex(tab => tab.name.toLowerCase() === tabName.toLowerCase());
    this.ressetTabSelectStatus();
    if (tabIndex > -1) {
      const tab = this.tabs[tabIndex].template;
      this.tabSwitch = this[tab];
      this.tabs[tabIndex].defaultSelected = true;
      this.tabs[tabIndex].isSelected = true;
    } else {
      this.tabs[0].defaultSelected = true;
      this.tabs[0].isSelected = true;
      this.showTab(this.detailsTab);
    }
  }
  /*  */
  ngOnDestroy(): void {
    this.route$.unsubscribe();
    this.fetch$.unsubscribe();
    this.routeData$.unsubscribe();
  }

}
