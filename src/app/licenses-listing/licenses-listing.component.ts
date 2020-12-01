import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FooterService } from '../core/services/footer/footer.service';
import { PageContainerConfig } from '../shared/container/models/page-container-config.interface';
import { omnBsConfig } from '../shared/date-picker/data/omn-bsConfig';
import { TableFilterConfig } from '../shared/table/models/table-filter-config.interface';
import { TableFilterType } from '../shared/table/models/table-filter-types';
import { TableI } from '../shared/table/models/table.interface';
import { TableService } from '../shared/table/services/table.service';

@Component({
  selector: 'app-licenses-listing',
  templateUrl: './licenses-listing.component.html',
  styleUrls: ['./licenses-listing.component.scss']
})
export class LicensesListingComponent implements OnInit {
  @ViewChild('hoverDetailTpl', { static: true }) hoverDetailTpl: TemplateRef<any>;
  @ViewChild('actionDropdown', { static: true }) actionDropdown: any;
  @ViewChild('selectT', { static: true }) selectT: any;

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
    action: true
  };
  constructor(
    private tS: TableService,
    private footerS: FooterService,
    private http: HttpClient
  ) { }
  ngOnInit(): void {
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = [
      {
        identifier: 'product-name',
        label: 'Product Name',
        sortable: true,
        minWidth: 237,
        width: 100,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
        },
      },
      {
        identifier: 'purchased',
        label: 'Purchased',
        sortable: true,
        minWidth: 160,
        width: 100,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
        },
      },
      {
        identifier: 'expires',
        label: 'Expires',
        sortable: true,
        minWidth: 160,
        width: 300,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
        },
      },
      {
        identifier: 'status',
        label: 'Status',
        sortable: true,
        minWidth: 161,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
        },
      },
      {
        identifier: 'partner-license',
        label: 'Partner license',
        sortable: true,
        minWidth: 160,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
        },
      },
      {
        identifier: 'renew',
        label: 'Renew by User Company',
        sortable: true,
        minWidth: 220,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
        },
      },
    ];
    this.getJSON().subscribe((data) => {
      if (data) {
        this.tableConfig.loadingIndicator = true;
        this.rowData = data;
        const cloneData = data.map((v: any) => {
          return { ...v };
        });
        this.tableData.next(cloneData);
        this.tableConfig.loadingIndicator = false;
      }
    });
  }
  public getJSON(): Observable<any> {
    return this.http.get('./assets/ra-table-license.json');
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
