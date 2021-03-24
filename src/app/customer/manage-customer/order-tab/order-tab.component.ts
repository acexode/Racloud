import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FooterService } from 'src/app/core/services/footer/footer.service';
import { OrderService } from 'src/app/orders/service.service';
import { omnBsConfig } from 'src/app/shared/date-picker/data/omn-bsConfig';
import { TableFilterConfig } from 'src/app/shared/table/models/table-filter-config.interface';
import { TableFilterType } from 'src/app/shared/table/models/table-filter-types';
import { TableI } from 'src/app/shared/table/models/table.interface';
import { TableService } from 'src/app/shared/table/services/table.service';

@Component({
  selector: 'app-order-tab',
  templateUrl: './order-tab.component.html',
  styleUrls: ['./order-tab.component.scss']
})
export class OrderTabComponent implements OnInit, OnDestroy {
  isDropup = true;
  @ViewChild('hoverDetailTpl', { static: true }) hoverDetailTpl: TemplateRef<any>;
  @ViewChild('actionDropdown', { static: true }) actionDropdown: TemplateRef<any>;
  @ViewChild('valueTemplate', { static: true }) valueTemplate: TemplateRef<any>;
  @ViewChild('discountTemplate', { static: true }) discountTemplate: TemplateRef<any>;
  @ViewChild('selectT', { static: true }) selectT;
  @ViewChild('dateTemplate', { static: true }) dateTemplate;
  @ViewChild('statusTemplate', { static: true }) statusTemplate;
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
    removeExportBtn: true,
    action: true
  };
  route$: Subscription;
  constructor(
    private tS: TableService,
    private footerS: FooterService,
    private http: HttpClient,
    private ref: ChangeDetectorRef,
    private orderS: OrderService,
    public route: ActivatedRoute,
    public router: Router,
  ) { }
  ngOnInit(): void {
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = [
      {
        identifier: 'id',
        label: 'Number',
        sortable: true,
        minWidth: 183,
        width: 90,
        noGrow: true,
        sortIconPosition: 'left',
        labelPosition: 'right',
        cellContentPosition: 'right',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          placeholder: 'Search'
        },
      },
      {
        identifier: 'createDate',
        label: 'Date',
        sortable: true,
        minWidth: 182,
        width: 100,
        sortIconPosition: 'left',
        labelPosition: 'right',
        cellContentPosition: 'right',
        cellTemplate: this.dateTemplate,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'orderStatus',
        label: 'Status',
        sortable: true,
        minWidth: 193,
        width: 300,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        cellTemplate: this.statusTemplate,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'value',
        label: 'Value',
        sortable: true,
        minWidth: 183,
        noGrow: true,
        sortIconPosition: 'left',
        labelPosition: 'right',
        cellContentPosition: 'right',
        cellTemplate: this.valueTemplate,
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'discountPrc',
        label: 'Discount',
        sortable: true,
        minWidth: 182,
        noGrow: true,
        sortIconPosition: 'left',
        labelPosition: 'right',
        cellContentPosition: 'right',
        cellTemplate: this.discountTemplate,
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'totalValue',
        label: 'Total value',
        sortable: true,
        minWidth: 183,
        noGrow: true,
        sortIconPosition: 'left',
        labelPosition: 'right',
        cellContentPosition: 'right',
        cellTemplate: this.valueTemplate,
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        }
      },
      {
        identifier: 'action',
        label: '',
        sortable: false,
        minWidth: 60,
        noGrow: true,
        headerHasFilterIcon: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: false,
        cellTemplate: this.actionDropdown
      },
    ];
    this.loadOrders();
  }
  public loadOrders() {
    this.route$ = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.orderS.getCustomerOrders(id).subscribe((orders: any[]) => {
        if (orders) {
          this.tableConfig.loadingIndicator = true;
          this.rowData = orders;
          const cloneData = orders.map((v) => {
            return { ...v };
          });
          this.tableData.next(cloneData);
          this.tableConfig.loadingIndicator = false;
        }
      });
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
  removeRow(row) {
    this.orderS.deleteOrder(row.id).subscribe(e => {
      this.loadOrders();
    });
  }
  manageSub(data: any) {
    this.router.navigate(['../../orders/orders-details', data.id]);
  }
  ngOnDestroy(): void {
    this.route$.unsubscribe();
  }
}
