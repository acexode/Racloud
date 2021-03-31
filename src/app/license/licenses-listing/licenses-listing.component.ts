import { CustomStorageService } from './../../core/services/custom-storage/custom-storage.service';
import { Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { TableFilterConfig } from 'src/app/shared/table/models/table-filter-config.interface';
import { TableFilterType } from 'src/app/shared/table/models/table-filter-types';
import { TableI } from 'src/app/shared/table/models/table.interface';
import { TableService } from 'src/app/shared/table/services/table.service';
import { LicenseServiceService } from '../license-service.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { get } from 'lodash';

@Component({
  selector: 'app-licenses-listing',
  templateUrl: './licenses-listing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./licenses-listing.component.scss'],
})
export class LicensesListingComponent implements OnInit {
  isDropup = true;
  @ViewChild('renewByUserCompanyTemplate', { static: true })
  renewByUserCompanyTemplate: TemplateRef<any>;
  @ViewChild('partnerLicenseTemplate', { static: true })
  partnerLicenseTemplate: TemplateRef<any>;
  @ViewChild('purchaseTemplate', { static: true })
  purchaseTemplate: TemplateRef<any>;
  @ViewChild('expireTemplate', { static: true })
  expireTemplate: TemplateRef<any>;
  @ViewChild('hoverDetailTpl', { static: true })
  hoverDetailTpl: TemplateRef<any>;
  @ViewChild('actionDropdown', { static: true }) actionDropdown;
  @ViewChild('selectT', { static: true }) selectT: any;

  @ViewChild('expiredIconTemplate', { static: true })
  expiredIconTemplate: TemplateRef<any>;
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
  canBuy = false;
  rows = [];
  showOwnLicenses = false;
  rowDetailIcons = [
    '../../assets/images/Edit.svg',
    '../../assets/images/Log.svg',
  ];
  tableConfig: TableI = {
    selectable: false,
    selectDetail: false,
    hoverDetail: true,
    columns: [],
    externalPaging: false,
    externalSorting: false,
    loadingIndicator: true,
    action: true,
    removeExportBtn: true,
  };
  fieldsPermission: any;
  actionPermission: any;
  authS$: Subscription;
  isFabricator: boolean;
  isRoleUser: boolean;

  constructor(
    private tS: TableService,
    private router: Router,
    private authS: AuthService,
    private ref: ChangeDetectorRef,
    private service: LicenseServiceService,
    private cStore: CustomStorageService
  ) { }
  ngOnInit(): void {
    // check If Fabricator Or User
    this.checkIfFabricatorOrUser();
    // continue process
    this.cStore.getItem('pagePermission').subscribe(page => {
      this.canBuy = page.shop;
    });
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.service.getLicenses().subscribe((data: any) => {
      // load table columns
      this.tableConfig.columns = this.getTableColumns(data.schema);
      // this. loadTableData
      this.loadTableData(data);
    });
  };
  loadTableData(data) {
    if (data) {
      console.log(data);
      const formattedData = data.licenses.map((e: any) => {
        return {
          ...e,
          productName: e.product.name,
          companyName: e.company.companyName,
          customer: e.company.companyName,
          status: e.licenseStatus,
        };
      });
      const filteredColumns = [];
      this.fieldsPermission = data.schema.columns;
      this.actionPermission = data.schema.actions;
      this.fieldsPermission.licenseStatus = this.fieldsPermission.status;
      this.fieldsPermission.companyName = this.fieldsPermission.customer;
      for (const key in this.fieldsPermission) {
        if (this.fieldsPermission[key] === 'full') {
          this.tableConfig.columns.forEach((column) => {
            if (column.identifier.toLowerCase() === key.toLowerCase()) {
              filteredColumns.push(column);
            }
          });
        }
      }
      const sorted = filteredColumns.sort((a, b) =>
        a.index > b.index ? 1 : b.index > a.index ? -1 : 0
      );
      this.tableConfig.columns = [
        ...filteredColumns,
        this.tableConfig.columns[this.tableConfig.columns.length - 1],
      ];

      this.tableConfig.loadingIndicator = true;
      this.rowData = formattedData;
      const cloneData = formattedData.map((v: any) => {
        return { ...v };
      });
      this.tableData.next(cloneData);
      this.tableConfig.loadingIndicator = false;
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
  toggle() {
    this.tableData.next([]);
    this.tableConfig.loadingIndicator = true;
    if (this.showOwnLicenses) {
      this.service.getOwnLicenses().subscribe((data: any) => {
        this.loadTableData(data);
      });
    } else {
      this.service.getLicenses().subscribe((data: any) => {
        this.loadTableData(data);
      });
    }
  }

  removeRow(id: any) { }

  manageSub(data: any) {
    this.router.navigate(['licenses/license-edit', { id: data.id }]);
  }
  renewSub(id: any) { }
  get hasOwnLicense() {
    if (this.isFabricator || this.isRoleUser) {
      return false;
    } else {
      return true;
    }
  }
  checkIfFabricatorOrUser() {
    this.authS$ = this.authS.getAuthState().subscribe(e => {
      const companyType = get(get(get(e, 'account', null), 'company', null), 'companyType', null);
      const roles = get(get(e, 'account', null), 'roles', null);
      if (companyType) {
        if (companyType.toLowerCase() === 'fabricator') {
          this.isFabricator = true;
        }
        if (roles.toLowerCase() === 'user') {
          this.isRoleUser = true;
        }
      } else {
        this.isFabricator = false;
        this.isRoleUser = false;
      }
    });
  }
  getTableColumns(permission: any = this.actionPermission): Array<any> {
    const action = {
      identifier: 'action',
      index: 9,
      label: '',
      sortable: true,
      minWidth: 40,
      noGrow: true,
      headerHasFilterIcon: true,
      sortIconPosition: 'right',
      labelPosition: 'left',
      cellContentPosition: 'right',
      hasFilter: true,
      cellTemplate: this.actionDropdown,
    };
    const columns = [
      {
        identifier: 'productName',
        index: 1,
        label: 'Product Name',
        sortable: true,
        minWidth: 360,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          placeholder: 'Search',
        },
      },
      {
        identifier: 'orderId',
        index: 2,
        label: 'Order ID',
        sortable: true,
        minWidth: 100,
        sortIconPosition: 'left',
        labelPosition: 'right',
        cellContentPosition: 'right',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true,
        },
      },
      {
        identifier: 'customer',
        index: 3,
        label: 'Customer',
        sortable: true,
        minWidth: 200,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true,
        },
      },
      {
        identifier: 'purchaseDate',
        index: 4,
        label: 'Purchased',
        sortable: true,
        minWidth: 130,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        cellTemplate: this.purchaseTemplate,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true,
        },
      },
      {
        identifier: 'expirationDate',
        index: 5,
        label: 'Expires',
        sortable: true,
        minWidth: 100,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        cellTemplate: this.expireTemplate,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true,
        },
      },
      {
        identifier: 'status',
        index: 6,
        label: 'Status',
        sortable: true,
        minWidth: 100,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        cellTemplate: this.expiredIconTemplate,
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true,
        },
      },
      {
        identifier: 'isPartnerLicense',
        index: 7,
        label: 'Partner license',
        sortable: true,
        minWidth: 100,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        cellTemplate: this.partnerLicenseTemplate,
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true,
        },
      },
      {
        identifier: 'renewByUserCompany',
        index: 8,
        label: 'Renew by User Company',
        sortable: true,
        minWidth: 136,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        cellTemplate: this.renewByUserCompanyTemplate,
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true,
        },
      }
    ];
    const tempColumn = [];
    const columnsPermission = get(permission, 'columns', null);
    for (const columnKey in columnsPermission) {
      if (columnsPermission[columnKey] === 'full' || columnsPermission[columnKey] === 'readonly') {
        const d = columns.find(column => column.identifier.toLowerCase() === columnKey.toLowerCase());
        if (d) {
          tempColumn.push(d);
        }
      }
    }
    const actionPermission = get(permission, 'actions', null);
    if (actionPermission.manageUpdate === 'full' && actionPermission.hasOwnProperty('manageUpdate')) {
      tempColumn.push(action);
    }
    return tempColumn;
  }
}
