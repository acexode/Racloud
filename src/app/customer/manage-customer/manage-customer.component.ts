import { RequestService } from './../../core/services/request/request.service';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { baseEndpoints } from 'src/app/core/configs/endpoints';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';
import { CustomerModel } from '../model/customer.model';

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
      defaultSelected: true,
    },
    {
      name: 'License',
      template: 'licenseTab',
      shortName: 'licences',
      isSelected: false,
      defaultSelected: false,
    },
    {
      name: 'Users',
      template: 'userTab',
      shortName: 'users',
      isSelected: false,
      defaultSelected: false,
    },
    {
      name: 'Orders',
      template: 'ordersTab',
      isSelected: false,
      shortName: 'orders',
      defaultSelected: false,
    },
    {
      name: 'Customers',
      template: 'customersTab',
      shortName: 'customers',
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
    public route: ActivatedRoute,
    private msgS: MessagesService,
    private reqS: RequestService,
    private customerS: CustomerService,

  ) { }

  ngOnInit(): void {
    this.route$ = this.route.paramMap.subscribe(
      params => {
        const id: any = params.get('id');
        this.fetch$ = this.customerS.getCustomerById(id).subscribe(
          (res: any) => {
            if (res) {
              console.log(res)
              this.detailsData$.next(res);
              this.reqS.get('../../../assets/main-admin-customer-details.json').subscribe((e: any) => {
                console.log(e)
                this.tabPermission = e.tabs
                this.fieldPermission = e.fields
                const filtered = []
                for (const key in this.tabPermission) {
                  if(this.tabPermission[key] === 'full'){
                    console.log(key)
                    this.tabs.forEach(e =>{
                      if(e.shortName === key){
                        filtered.push(e)
                      }
                    })
                  }
                }
                console.log(filtered)
                this.tabs = [this.tabs[0], ...filtered]
                this.fieldPermission = e.fields

              })

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
  get UserTab() {
    return this.tabs.find(tab => tab.template === 'userTab');
  }
  /*  */
  ngOnDestroy(): void {
    this.route$.unsubscribe();
    this.fetch$.unsubscribe();
  }

}
