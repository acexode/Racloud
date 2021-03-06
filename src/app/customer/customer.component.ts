import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
        label: 'Ultima s??pt??m??n??',
      },
      {
        value: [
          new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          new Date(new Date().getFullYear(), new Date().getMonth(), 0),
        ],
        label: 'Ultima lun??',
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
    removeExportBtn: true,
    action: true,
  };
  isDropup: boolean;
  customErrorMsg = 'There is an issue with your network. Please Refresh your network';
  disableTheCustomer$: Subscription;
  fieldsPermission: any;
  actionPermission: any;
  routeData$: Subscription;
  modalRef: BsModalRef;
  temporaryRowData: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    private tS: TableService,
    private router: Router,
    private route: ActivatedRoute,
    private customerS: CustomerService,
    private countriesS: CountriesService,
    private msgS: MessagesService,
    private modalService: BsModalService,
    private cdref: ChangeDetectorRef,
  ) { }
  ngOnInit(): void {
    this.routeData$ = this.route.data.subscribe(
      res => {
        const data = get(res, 'data', null);
        if (!data?.showScreen) {
          // user have no access so redirect to shop
          this.router.navigate(['/access-denied']);
        } else {
          this.ngOnInitIt();
        }
      }
    );
    this.cdref.detectChanges();
  }
  ngOnInitIt(): void {
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = [
      {
        identifier: 'companyName',
        index: 1,
        label: 'Name',
        sortable: true,
        minWidth: 280,
        noGrow: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          placeholder: 'Search here'
        },
      },
      {
        identifier: 'country',
        index: 2,
        label: 'Country',
        sortable: true,
        minWidth: 150,
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
        identifier: 'companyType',
        label: 'Type',
        index: 3,
        sortable: true,
        minWidth: 200,
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
        identifier: 'parent',
        label: 'Parent',
        index: 4,
        sortable: true,
        minWidth: 280,
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
        index: 5,
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
        index: 6,
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
        index: 7,
        label: '',
        sortable: true,
        minWidth: 60,
        width: 60,
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
        this.displayMsg(err.error || this.customErrorMsg, 'danger');
      }
    );

  };
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
  loadCustomers(): void {
    this.loadCustomers$ = this.customerS.getCustomers().subscribe(
      res => {
        if (res) {
          const data = res.customers.map((v: any) => {
            return {
              ...v,
              country: this.getCountryForCutomer(v.country),
              anniversaryDate: getUTCdate(v.anniversaryDate),
              parent: v?.parent?.companyName,
            };
          }).reverse();
          const filteredColumns = [];
          this.fieldsPermission = res.schema.fields;
          this.actionPermission = res.schema.actions;
          for (const key in this.fieldsPermission) {
            if (this.fieldsPermission[key] === 'full') {
              this.tableConfig.columns.forEach(column => {
                if (column.identifier === key) {
                  filteredColumns.push(column);
                }
              });
            } else if (typeof this.fieldsPermission[key] === 'object') {
              this.tableConfig.columns.forEach(column => {
                if (column.identifier === key) {
                  filteredColumns.push(column);
                }
              });
            }
          }
          const sorted = filteredColumns.sort((a, b) => (a.index > b.index) ? 1 : (b.index > a.index) ? -1 : 0);
          this.tableConfig.columns = [...filteredColumns, this.tableConfig.columns[this.tableConfig.columns.length - 1]];
          // this.tableConfig.columns = filteredColumns;
          this.tableConfig.loadingIndicator = true;
          this.rowData = data;
          this.tableData.next(data);
          this.tableConfig.loadingIndicator = false;
        }
      },
      err => {
        this.displayMsg(err.error || this.customErrorMsg, 'danger');
      }
    );
  };
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
    this.disableTheCustomer$ = this.customerS.disableCustomer(rData.id).subscribe(
      _res => {
        this.displayMsg('Successfully disabled customer', 'danger');
        // reset resetTemporaryRowData
        this.resetTemporaryRowData();
        this.loadCustomers();
      },
      err => {
        // reset resetTemporaryRowData
        this.resetTemporaryRowData();
        // display msg
        this.displayMsg(err.error || this.customErrorMsg, 'danger');
      }
    );
  }
  manageSub(data: any) {
    this.router.navigate(['manage', data.id, 'tab', 'details'], { relativeTo: this.route });
  }
  resetTemporaryRowData() {
    this.temporaryRowData.next(null);
  };
  openModal(template: TemplateRef<any>, rowData: any) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.temporaryRowData.next(rowData);
  }
  confirm(): void {
    this.modalRef.hide();
    if (this.temporaryRowData.value) {
      console.log(this.temporaryRowData.value);
      this.customerS.deleteCustomer(this.temporaryRowData.value.id).subscribe(res => {
        this.displayMsg(
          'Customer deleted sucessfully',
          'success',
        );
        this.loadCustomers();
      }, err => {
        console.log(err);
        this.displayMsg(
          err.error,
          'danger',
        );
      });
      // this.removeRow(this.temporaryRowData.value);
    } else {
      this.displayMsg(
        'Looks like there is a technical error. Please contact Engineer to resolve it (Error: 00RA2)',
        'danger',
      );
    }
  }
  decline(): void {
    this.modalRef.hide();
  }
  ngOnDestroy(): void {
    if (this.loadCountries$) {
      this.loadCountries$.unsubscribe();
    }
    if (this.loadCustomers$) {
      this.loadCustomers$.unsubscribe();
    }
    if (this.disableTheCustomer$) {
      this.disableTheCustomer$.unsubscribe();
    }
    this.routeData$.unsubscribe();
  }

}
