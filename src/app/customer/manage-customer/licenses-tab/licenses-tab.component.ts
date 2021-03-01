import { ActivatedRoute } from '@angular/router';
import { LicenseServiceService } from 'src/app/license/license-service.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { omnBsConfig } from 'src/app/shared/date-picker/data/omn-bsConfig';
import { TableFilterConfig } from 'src/app/shared/table/models/table-filter-config.interface';
import { TableFilterType } from 'src/app/shared/table/models/table-filter-types';
import { TableI } from 'src/app/shared/table/models/table.interface';
import { TableService } from 'src/app/shared/table/services/table.service';

@Component({
  selector: 'app-licenses-tab',
  templateUrl: './licenses-tab.component.html',
  styleUrls: ['./licenses-tab.component.scss']
})
export class LicensesTabComponent implements OnInit {
  @ViewChild('hoverDetailTpl', { static: true }) hoverDetailTpl: TemplateRef<any>;
  @ViewChild('actionDropdown', { static: true }) actionDropdown: TemplateRef<any>;
  @ViewChild('selectT', { static: true }) selectT: any;

  @ViewChild('statusIconTemplate', { static: true }) statusIconTemplate: TemplateRef<any>;
  @ViewChild('renewByUserCompanyTemplate', { static: true })
  renewByUserCompanyTemplate: TemplateRef<any>;
  @ViewChild('partnerLicenseTemplate', { static: true })
  partnerLicenseTemplate: TemplateRef<any>;
  @ViewChild('purchaseTemplate', { static: true })
  purchaseTemplate: TemplateRef<any>;
  @ViewChild('expireTemplate', { static: true })
  expireTemplate: TemplateRef<any>;
  @ViewChild('hoverDetailTpl', { static: true })

  rowData: Array<any> = [];
  tableData: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  rows = [];
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
    action: true
  };
  isDropup: boolean;
  constructor(
    private tS: TableService,
    private http: HttpClient,
    private services: LicenseServiceService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = [
      {
        identifier: 'productName',
        label: 'Product Name',
        sortable: true,
        minWidth: 237,
        // width: 100,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          placeholder: 'Search'
        },
      },
      {
        identifier: 'customer',
        label: 'Customer',
        sortable: true,
        minWidth: 260,
        // width: 100,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'PurchaseDate',
        label: 'Purchased',
        sortable: true,
        minWidth: 200,
        // width: 100,
        sortIconPosition: 'left',
        labelPosition: 'left',
        cellContentPosition: 'right',
        cellTemplate: this.purchaseTemplate,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'ExpirationDate',
        label: 'Expires',
        sortable: true,
        minWidth: 160,
        // width: 300,
        sortIconPosition: 'left',
        labelPosition: 'left',
        cellContentPosition: 'right',
        cellTemplate: this.expireTemplate,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'LicenseStatus',
        label: 'Status',
        sortable: true,
        minWidth: 161,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        cellTemplate: this.statusIconTemplate,
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'IsPartnerLicense',
        label: 'Partner license',
        sortable: true,
        minWidth: 91,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        cellTemplate: this.partnerLicenseTemplate,
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'RenewByUserCompany',
        label: 'Renew by User Company',
        sortable: true,
        minWidth: 131,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        cellTemplate: this.renewByUserCompanyTemplate,
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
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10)
    console.log(id)
    this.services.getCustomerLicenses(id).subscribe((data: any) => {
      console.log(data)
      if (data) {
        const formattedData = data.map((e: any) => {
          return {
            ...e,
            productName: e.Product.Name,
            companyName: e.Company.CompanyName,
            customer: e.Company.CompanyName,
          };
        });
        this.tableConfig.loadingIndicator = true;
        this.rowData = formattedData;
        const cloneData = formattedData.map((v: any) => {
          return { ...v };
        });
        this.tableData.next(cloneData);
        this.tableConfig.loadingIndicator = false;
      }
    });
  }
  public getJSON(): Observable<any> {
    return this.http.get('./assets/manage-license.json');
  }
  filterTable(filterObj: TableFilterConfig) {
    const newRows = this.tS.filterRowInputs(
      this.tableConfig?.columns,
      this.rowData,
      filterObj
    );
    this.tableData.next(newRows);
  }

  removeRow(id: any) {
    console.log(id);
  }
  manageSub(id: any) {
    console.log(id);
  }
  renewSub(id: any) {
    console.log(id);
  }

}

