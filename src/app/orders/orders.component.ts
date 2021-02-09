import { Order } from './../core/models/order.interface';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FooterService } from '../core/services/footer/footer.service';
import { PageContainerConfig } from '../shared/container/models/page-container-config.interface';
import { omnBsConfig } from '../shared/date-picker/data/omn-bsConfig';
import { TableFilterConfig } from '../shared/table/models/table-filter-config.interface';
import { TableFilterType } from '../shared/table/models/table-filter-types';
import { TableI } from '../shared/table/models/table.interface';
import { TableService } from '../shared/table/services/table.service';
import { OrderService } from './service.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { get } from 'lodash';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  isDropup = false;
  @ViewChild('dateTemplate', { static: true }) dateTemplate;
  @ViewChild('hoverDetailTpl', { static: true }) hoverDetailTpl;
  @ViewChild('actionDropdown', { static: true }) actionDropdown;
  @ViewChild('valueTemplate', { static: true }) valueTemplate: TemplateRef<any>;
  @ViewChild('discountTemplate', { static: true }) discountTemplate: TemplateRef<any>;
  @ViewChild('selectT', { static: true }) selectT: any;
  @ViewChild('statusTemplate', { static: true }) statusTemplate: TemplateRef<any>;
  @ViewChild(DatatableComponent)      // import {DatatableComponent} from '@swimlane/ngx-datatable';
  private readonly table: DatatableComponent;
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
  routeData$: Subscription;
  constructor(
    private tS: TableService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private service: OrderService
  ) { }
  ngOnInit(): void {
    this.routeData$ = this.route.data.subscribe(
      res => {
        const data = get(res, 'data', null);
        if (!data?.showScreen) {
          this.router.navigate(['/access-denied']);
        }
      }
    );
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = [
      {
        identifier: 'Id',
        label: 'Number',
        sortable: true,
        minWidth: 125,
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
        identifier: 'CompanyName',
        label: 'Customer',
        sortable: true,
        minWidth: 273,
        width: 90,
        noGrow: true,
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
        identifier: 'CreateDate',
        label: 'Date',
        sortable: true,
        minWidth: 100,
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
        identifier: 'OrderStatus',
        label: 'Status',
        sortable: true,
        minWidth: 270,
        width: 300,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        cellTemplate: this.statusTemplate,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'Value',
        label: 'Value',
        sortable: true,
        minWidth: 111,
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
        identifier: 'Discount',
        label: 'Discount',
        sortable: true,
        minWidth: 111,
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
        identifier: 'TotalValue',
        label: 'Total value',
        sortable: true,
        minWidth: 111,
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
        minWidth: 40,
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
  loadOrders() {
    this.service.getorders().subscribe((data: any) => {
      if (data) {
        this.tableConfig.loadingIndicator = true;
        this.rowData = data;
        const cloneData = data.map((v) => {
          return { ...v };
        });
        this.tableData.next(cloneData);
        this.tableConfig.loadingIndicator = false;
      }
    });
  }
  public getJSON(): Observable<any> {
    return this.http.get('./assets/orders.json');
  }
  filterTable(filterObj: TableFilterConfig) {
    const newRows = this.tS.filterRowInputs(
      this.tableConfig?.columns,
      this.rowData,
      filterObj
    );
    this.tableData.next(newRows);
  }
  generateOrder() {
    this.service.generateOrder().subscribe((e: any) => {
      console.log(e);
      this.router.navigate(['orders-details', e.id], { relativeTo: this.route });
    });
  }
  removeRow(row) {
    console.log(row);
    this.service.deleteOrder(row.Id).subscribe(e => {
      this.loadOrders();
    });
  }
  manageSub(data: any) {
    console.log(data);
    this.router.navigate(['orders-details', data.Id], { relativeTo: this.route });
  }
  ngOnDestroy(): void {
    this.routeData$.unsubscribe();
  }
}
