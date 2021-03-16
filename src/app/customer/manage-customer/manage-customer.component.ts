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
  tabPermission: any;
  fieldPermission: any;
  tabs = [
    {
      name: 'Details',
      shortName: 'details',
      template: 'detailsTab',
      isSelected: false,
      defaultSelected: false,
      showTab: true,
    },
    {
      name: 'License',
      template: 'licenseTab',
      shortName: 'licences',
      isSelected: false,
      defaultSelected: false,
      showTab: false,
    },
    {
      name: 'Users',
      template: 'userTab',
      shortName: 'users',
      isSelected: false,
      defaultSelected: false,
      showTab: false,
    },
    {
      name: 'Orders',
      template: 'ordersTab',
      shortName: 'orders',
      isSelected: false,
      defaultSelected: false,
      showTab: false,
    },
    {
      name: 'Customers',
      template: 'customersTab',
      shortName: 'customers',
      isSelected: false,
      defaultSelected: false,
      showTab: false,
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
  routeData$: Subscription;
  customerId: any;
  constructor(
    private cdref: ChangeDetectorRef,
    public route: ActivatedRoute,
    private msgS: MessagesService,
    private customerS: CustomerService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.routeData$ = this.route.data.subscribe(
      response => {
        const data = get(response, 'data', null);
        if (!data?.accessDetailsScreen) {
          this.router.navigate(['/access-denied']);
        } else {
          this.route$ = this.route.paramMap.subscribe(
            params => {
              const id: any = params.get('id');
              const routeTab: any = params.get('tab');
              this.fetch$ = this.customerS.getCustomerById(id).subscribe(
                (res: any) => {
                  if (res) {
                    this.customerId = id;
                    this.detailsData$.next(res);
                    this.tabPermission = res.schema.tabs;
                    this.fieldPermission = res.schema.fields;
                    for (const key in this.tabPermission) {
                      if (this.tabPermission[key] === 'full') {
                        this.tabs.forEach(tab => {
                          if (tab.shortName === key) {
                            tab.showTab = true;
                          }
                        });
                      }
                    }
                    this.setTab(routeTab);
                  }
                },
                _err => {
                  this.displayMsg(
                    'Unable to get customer Data at this current time please check your newtowrk and try again.',
                    'danger',
                    );
                }
              );
            }
          );
          this.cdref.markForCheck();
        }
      }
    );

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
