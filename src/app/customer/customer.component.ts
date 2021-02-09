import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { getUTCdate } from '../core/helpers/dateHelpers';
import { CountriesModel } from '../core/models/countries-model';
import { CountriesService } from '../core/services/countries/countries.service';
import { CustomerService } from '../core/services/customer/customer.service';
import { PageContainerConfig } from '../shared/container/models/page-container-config.interface';
import { omnBsConfig } from '../shared/date-picker/data/omn-bsConfig';
import { MessagesService } from '../shared/messages/services/messages.service';
import { TableFilterConfig } from '../shared/table/models/table-filter-config.interface';
import { TableFilterType } from '../shared/table/models/table-filter-types';
import { TableI } from '../shared/table/models/table.interface';
import { TableService } from '../shared/table/services/table.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, OnDestroy {
  @ViewChild('hoverDetailTpl', { static: true }) hoverDetailTpl: TemplateRef<any>;
  @ViewChild('subFeeTemplate', { static: true }) subFeeTemplate: TemplateRef<any>;
  @ViewChild('actionDropdown', { static: true }) actionDropdown: any;
  @ViewChild('selectT', { static: true }) selectT: any;
  countriesData: CountriesModel;
  loadCountries$: Subscription;
  loadCustomers$: Subscription;
  rowData: Array<any> = [];
  tableData: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
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
  rowDetailIcons = [
    '../../assets/images/Edit.svg',
    '../../assets/images/Log.svg',
  ];
  bsConfig = omnBsConfig({
    ranges: [
      {
        value: [new Date(), new Date()],
        label: 'Azi',
      },
      {
        value: [
          new Date(new Date().setDate(new Date().getDate() - 7)),
          new Date(),
        ],
        label: 'Ultima săptămână',
      },
      {
        value: [
          new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          new Date(new Date().getFullYear(), new Date().getMonth(), 0),
        ],
        label: 'Ultima lună',
      },
    ],
  });
  tableConfig: TableI = {
    selectable: false,
    selectDetail: false,
    hoverDetail: true,
    columns: [],
    externalPaging: false,
    externalSorting: false,
    loadingIndicator: true,
    action: true
  };
  isDropup: boolean;
  customErrorMsg = 'There is an issue with your network. Please Refresh your network';
  disableCustomer$: Subscription;
  routeData$: Subscription;
  accessDetailsScreen$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    private tS: TableService,
    private router: Router,
    private route: ActivatedRoute,
    private customerS: CustomerService,
    private countriesS: CountriesService,
    private msgS: MessagesService,
  ) { }
  ngOnInit(): void {
    this.routeData$ = this.route.data.subscribe(
      res => {
        const data = get(res, 'data', null);
        console.log(data);
        if (data?.accessDetailsScreen) {
          this.accessDetailsScreen$.next(true);
        }
      }
    );
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = [
      {
        identifier: 'companyName',
        label: 'Name',
        sortable: true,
        minWidth: 200,
        width: 90,
        noGrow: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          placeholder: 'Search here'
        },
      },
      {
        identifier: 'country',
        label: 'Country',
        sortable: true,
        minWidth: 150,
        width: 100,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'phoneNumber',
        label: 'Phone',
        sortable: true,
        minWidth: 150,
        width: 300,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'email',
        label: 'Email',
        sortable: true,
        minWidth: 250,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'companyType',
        label: 'Type',
        sortable: true,
        minWidth: 130,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'companyName',
        label: 'Parent',
        sortable: true,
        minWidth: 130,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'anniversaryDate',
        label: 'Anniv-date',
        sortable: true,
        minWidth: 130,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'subscriptionFee',
        label: 'Sub.fee',
        sortable: true,
        minWidth: 130,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        cellTemplate: this.subFeeTemplate,
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'action',
        label: '',
        sortable: true,
        minWidth: 60,
        noGrow: true,
        headerHasFilterIcon: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
        cellTemplate: this.actionDropdown
      },
    ];
    this.loadCountries$ = this.countriesS.getCountriesState().subscribe(
      (countries) => {
        this.countriesData = countries;
        // get data for table
        this.loadCustomers();
      },
      err => {
        this.msgS.addMessage({
          text: err.error || this.customErrorMsg,
          type: 'danger',
          dismissible: true,
          customClass: 'mt-32',
          hasIcon: true
        });
      }
    );

  }
  loadCustomers(): void {
    this.loadCustomers$ = this.customerS.getCustomers().subscribe(
      res => {
        if (res) {
          const data = res.map((v: any) => {
            return {
              ...v,
              country: this.getCountryForCutomer(v.country),
              anniversaryDate: getUTCdate(v.anniversaryDate),
              parent: v?.parent?.companyName,
            };
          }).reverse();
          this.tableConfig.loadingIndicator = true;
          this.rowData = data;
          this.tableData.next(data);
          this.tableConfig.loadingIndicator = false;
        }
      },
      err => {
        this.msgS.addMessage({
          text: err.error || this.customErrorMsg,
          type: 'danger',
          dismissible: true,
          customClass: 'mt-32',
          hasIcon: true
        });
      }
    );
  }
  getCountryForCutomer(code: string) {
    const getCountry = this.countriesData.data.find(country => country.code === code);
    if (typeof getCountry !== 'undefined') {
      return getCountry.name;
    } else {
      return code;
    }
  }
  filterTable(filterObj: TableFilterConfig) {
    const newRows = this.tS.filterRowInputs(
      this.tableConfig?.columns,
      this.rowData,
      filterObj
    );
    this.tableData.next(newRows);
  }
  removeRow(rData: any) {
    this.disableCustomer$ = this.customerS.disableCustomers(rData.id).subscribe(
      _res => {
        this.loadCustomers();
        this.msgS.addMessage({
          text: 'Successfully disabled customer',
          type: 'danger',
          dismissible: true,
          customClass: 'mt-32',
          hasIcon: true
        });
      },
      err => {
        this.msgS.addMessage({
          text: err.error || this.customErrorMsg,
          type: 'danger',
          dismissible: true,
          customClass: 'mt-32',
          hasIcon: true
        });
      }
    );
  }
  manageSub(data: any) {
    this.router.navigate(['manage', data.id, 'tab', 'details'], { relativeTo: this.route });
  }
  renewSub(id: any) { }
  ngOnDestroy(): void {
    this.loadCountries$.unsubscribe();
    this.loadCustomers$.unsubscribe();
    if (this.disableCustomer$) {
      this.disableCustomer$.unsubscribe();
    }
  }

}
