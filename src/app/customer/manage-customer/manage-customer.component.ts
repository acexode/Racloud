import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { baseEndpoints } from 'src/app/core/configs/endpoints';
import { RequestService } from 'src/app/core/services/request/request.service';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';

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
    private reqS: RequestService,
  ) { }

  ngOnInit(): void {
    this.route$ = this.route.paramMap.subscribe(
      params => {
        const id: any = params.get('id');
        this.fetchDataForDetails(id).subscribe(
          (res: any) => {
            if (res) {
              this.detailsData$.next(res);
              this.showTab(this.detailsTab);
            }
          },
          err => { }
        );
      }
    );
    this.cdref.markForCheck();
  }

  fetchDataForDetails(id: any) {
    const queryEndpoint = `${ baseEndpoints.customers }/${ id }`;
    return this.reqS.get(queryEndpoint);
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
  }

}
