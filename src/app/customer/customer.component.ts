import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseEndpoints } from '../core/configs/endpoints';
import { getUTCdate } from '../core/helpers/dateHelpers';
import { RequestService } from '../core/services/request/request.service';
import { PageContainerConfig } from '../shared/container/models/page-container-config.interface';
import { omnBsConfig } from '../shared/date-picker/data/omn-bsConfig';
import { TableFilterConfig } from '../shared/table/models/table-filter-config.interface';
import { TableFilterType } from '../shared/table/models/table-filter-types';
import { TableI } from '../shared/table/models/table.interface';
import { TableService } from '../shared/table/services/table.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  @ViewChild('hoverDetailTpl', { static: true }) hoverDetailTpl: TemplateRef<any>;
  @ViewChild('subFeeTemplate', { static: true }) subFeeTemplate: TemplateRef<any>;
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
    loadingIndicator: true,
    action: true
  };
  isDropup: boolean;
  constructor(
    private tS: TableService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private reqS: RequestService,
  ) { }
  ngOnInit(): void {
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = [
      {
        identifier: 'name',
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
        identifier: 'companyEmail',
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
    // get data for table
    this.getJSON();
  }
  public getJSON(): void {
    this.reqS.get<any>(baseEndpoints.customers).subscribe(res => {
      if (res) {
        const data = res.map((v: any) => {
          return {
            ...v,
            name: `${ v.firstName } ${ v.lastName }`,
            anniversaryDate: getUTCdate(v.anniversaryDate),
          };
        });
        this.tableConfig.loadingIndicator = true;
        this.rowData = data;
        this.tableData.next(data);
        this.tableConfig.loadingIndicator = false;
      }
    });
  }
  filterTable(filterObj: TableFilterConfig) {
    const newRows = this.tS.filterRowInputs(
      this.tableConfig?.columns,
      this.rowData,
      filterObj
    );
    this.tableData.next(newRows);
  }
  setDropUp(row) {
    const idx = this.rowData.findIndex(e => e.id === row.id) + 1;
    const mod = idx % 10 === 0 ? 10 : idx % 10;
    if (mod < 6) {
      this.isDropup = false;
    } else {
      this.isDropup = true;
    }
    this.ref.detectChanges();
  }
  removeRow(id: any) {
    console.log(id);
  }
  manageSub(data: any) {
    console.log(data);
    this.router.navigate(['manage', data.id], { relativeTo: this.route });
  }
  renewSub(id: any) {
    console.log(id);
  }

}
