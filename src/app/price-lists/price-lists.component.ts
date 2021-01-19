import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timeStamp } from 'console';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { baseEndpoints } from '../core/configs/endpoints';
import { getUTCdate } from '../core/helpers/dateHelpers';
import { PriceListService } from '../core/services/price-list/price-list.service';
import { RequestService } from '../core/services/request/request.service';
import { PageContainerConfig } from '../shared/container/models/page-container-config.interface';
import { omnBsConfig } from '../shared/date-picker/data/omn-bsConfig';
import { MessagesService } from '../shared/messages/services/messages.service';
import { TableFilterConfig } from '../shared/table/models/table-filter-config.interface';
import { TableFilterType } from '../shared/table/models/table-filter-types';
import { TableI } from '../shared/table/models/table.interface';
import { TableService } from '../shared/table/services/table.service';
import { PriceListModel } from './models/price-list-model';

@Component({
  selector: 'app-price-lists',
  templateUrl: './price-lists.component.html',
  styleUrls: ['./price-lists.component.scss']
})
export class PriceListsComponent implements OnInit, OnDestroy {
  isDropup = true;
  @ViewChild('hoverDetailTpl', { static: true }) hoverDetailTpl: TemplateRef<any>;
  @ViewChild('actionDropdown', { static: true }) actionDropdown;
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
    action: true,
    noFiltering: true,
  };
  priceList$: Subscription;
  deletePriceList$: Subscription;
  constructor(
    private tS: TableService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private PriceListS: PriceListService,
    private route: ActivatedRoute,
    private msgS: MessagesService,
  ) { }
  ngOnInit(): void {
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = [
      {
        identifier: 'name',
        label: 'Name',
        sortable: true,
        minWidth: 160,
        width: 100,
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
        identifier: 'currency',
        label: 'Currency',
        sortable: true,
        minWidth: 250,
        width: 100,
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
        identifier: 'created',
        label: 'Created',
        sortable: true,
        minWidth: 200,
        width: 100,
        sortIconPosition: 'left',
        labelPosition: 'right',
        cellContentPosition: 'right',
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'noOfProducts',
        label: 'No. Of Products',
        sortable: true,
        minWidth: 200,
        width: 200,
        sortIconPosition: 'left',
        labelPosition: 'right',
        cellContentPosition: 'right',
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
        minWidth: 40,
        noGrow: true,
        headerHasFilterIcon: false,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
        cellTemplate: this.actionDropdown
      },
    ];

    this.tableConfig.loadingIndicator = true;
    // load pricelists
    this.loadPriceList();
  }
  filterTable(filterObj: TableFilterConfig) {
    const newRows = this.tS.filterRowInputs(
      this.tableConfig?.columns,
      this.rowData,
      filterObj
    );
    this.tableData.next(newRows);
  }

  loadPriceList() {
    this.priceList$ = this.PriceListS.getPriceLists().subscribe(
      (res: Array<PriceListModel>) => {
        if (res) {
          const data = res.map(
            (r: any) => {
              return {
                ...r,
                created: getUTCdate(r.createDate),
              };
            });
          this.rowData = data;
          this.tableData.next(data);
          this.tableConfig.loadingIndicator = false;
        }
      },
      _err => { }
    );
  }
  removeRow(data: any) {
    this.deletePriceList$ = this.PriceListS.deletePriceList(data.id).subscribe(
      res => {
        this.msgS.addMessage({
          text: res.name + ' Pricelist Successfully Deleted',
          type: 'success',
          dismissible: true,
          customClass: 'mt-32',
          hasIcon: true,
          timeout: 5000,
        });
        this.loadPriceList();
      },
      err => {
        this.msgS.addMessage({
          text: err.error || 'Please check your network and try again. We are unable to delete the Price list at this time',
          type: 'danger',
          dismissible: true,
          customClass: 'mt-32',
          hasIcon: true,
        });
      }
    );
  }
  manageSub(data: any) {
    this.router.navigate(['edit', data.id], { relativeTo: this.route });
  }
  renewSub(id: any) { }

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
  ngOnDestroy(): void {
    this.priceList$.unsubscribe();
    if (this.deletePriceList$) {
      this.deletePriceList$.unsubscribe();
    }
  }

}

