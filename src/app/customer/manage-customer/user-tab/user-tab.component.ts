import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { omnBsConfig } from 'src/app/shared/date-picker/data/omn-bsConfig';
import { TableFilterConfig } from 'src/app/shared/table/models/table-filter-config.interface';
import { TableI } from 'src/app/shared/table/models/table.interface';
import { TableService } from 'src/app/shared/table/services/table.service';
import { CustomerModel } from '../../model/customer.model';

@Component({
  selector: 'app-user-tab',
  templateUrl: './user-tab.component.html',
  styleUrls: ['./user-tab.component.scss']
})

export class UserTabComponent implements OnInit, OnDestroy {
  isDropup = true;
  @Input() customerId: CustomerModel['id'];
  @ViewChild('hoverDetailTpl', { static: true }) hoverDetailTpl: TemplateRef<any>;
  @ViewChild('actionDropdown', { static: true }) actionDropdown: TemplateRef<any>;
  @ViewChild('selectT', { static: true }) selectT;

  rowData: Array<any> = [];
  tableData: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
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
    selectable: true,
    selectDetail: false,
    hoverDetail: true,
    columns: [],
    externalPaging: false,
    externalSorting: false,
    action: true
  };
  getCustomerUsers$: Subscription;
  constructor(
    private tS: TableService,
    private ref: ChangeDetectorRef,
    private customerS: CustomerService
  ) { }
  ngOnInit(): void {
    console.log(this.customerId);
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = [
      {
        identifier: 'firstname',
        label: 'First Name',
        sortable: true,
        minWidth: 200,
        width: 90,
        noGrow: true
      },
      {
        identifier: 'lastname',
        label: 'Last Name',
        sortable: true,
        minWidth: 150,
        width: 100,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right'
      },
      {
        identifier: 'email',
        label: 'Email',
        sortable: true,
        minWidth: 150,
        width: 300,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right'
      },
      {
        identifier: 'role',
        label: 'Role',
        sortable: true,
        minWidth: 250,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true
      },
      {
        identifier: 'action',
        label: '',
        sortable: true,
        minWidth: 60,
        noGrow: true,
        headerHasFilterIcon: false,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
        cellTemplate: this.actionDropdown
      },
    ];
    this.getCustomerUsers$ = this.customerS.getCustomerUsers(this.customerId).subscribe((data) => {
      if (data) {
        this.tableConfig.loadingIndicator = true;
        const d = data.map((v: any) => {
          return { ...v?.user, role: v?.role?.name ?? '-' };
        }).reverse();
        this.rowData = d;
        this.tableData.next(d);
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
  removeRow(id) {
    console.log(id);
  }
  manageSub(id) {
    console.log(id);
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
  ngOnDestroy(): void {
    this.getCustomerUsers$.unsubscribe();
  }
}
