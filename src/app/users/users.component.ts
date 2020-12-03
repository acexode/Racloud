import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FooterService } from '../core/services/footer/footer.service';
import { PageContainerConfig } from '../shared/container/models/page-container-config.interface';
import { omnBsConfig } from '../shared/date-picker/data/omn-bsConfig';
import { TableFilterConfig } from '../shared/table/models/table-filter-config.interface';
import { TableFilterType } from '../shared/table/models/table-filter-types';
import { TableI } from '../shared/table/models/table.interface';
import { TableService } from '../shared/table/services/table.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  isDropup = true;
  @ViewChild('hoverDetailTpl', { static: true }) hoverDetailTpl;
  @ViewChild('actionDropdown', { static: true }) actionDropdown;
  @ViewChild('selectT', { static: true }) selectT;

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
    selectable: true,
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
    private http: HttpClient,
    private ref: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = [
      {
        identifier: 'first_name',
        label: 'First Name',
        sortable: true,
        minWidth: 200,
        width: 90,
        noGrow: true
      },
      {
        identifier: 'last_name',
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
    this.getJSON().subscribe((data) => {
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
    return this.http.get('./assets/role.json');
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
  if(mod < 6) {
    this.isDropup = false;
  }else {
    this.isDropup = true;
  }
  this.ref.detectChanges();
}
removeRow(id){
  console.log(id);
}
manageSub(id){
  console.log(id);
}


}
