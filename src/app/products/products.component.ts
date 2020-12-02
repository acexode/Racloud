import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, HostListener, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FooterService } from '../core/services/footer/footer.service';
import { PageContainerConfig } from '../shared/container/models/page-container-config.interface';
import { omnBsConfig } from '../shared/date-picker/data/omn-bsConfig';
import { TableFilterConfig } from '../shared/table/models/table-filter-config.interface';
import { TableFilterType } from '../shared/table/models/table-filter-types';
import { TableI } from '../shared/table/models/table.interface';
import { TableService } from '../shared/table/services/table.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
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
    document.addEventListener('scroll', (e) =>{
      console.log(e.target)
    })
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = [
      {
        identifier: 'name',
        label: 'Name',
        sortable: true,
        minWidth: 200,
        width: 90,
        noGrow: true,
      },
      {
        identifier: 'currency',
        label: 'Currency',
        sortable: true,
        minWidth: 150,
        width: 150,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
      },
      {
        identifier: 'created',
        label: 'Created',
        sortable: true,
        minWidth: 100,
        width: 100,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
      },
      {
        identifier: 'num_products',
        label: 'No. of products',
        sortable: true,
        minWidth: 150,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'right',
        cellContentPosition: 'right',
        hasFilter: true,
      },
      {
        identifier: '',
        label: '',
        sortable: true,
        minWidth: 60,
        noGrow: true,
        headerHasFilterIcon: false,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: false,
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
    return this.http.get('./assets/products.json');
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
  const idx = this.rowData.findIndex(e => e.id == row.id) + 1;
  const mod = idx % 10 == 0 ? 10 : idx % 10;
  console.log(idx)
  console.log(mod)
  if(mod < 6) {
    this.isDropup = false;
  }else {
    this.isDropup = true;
  }
  this.ref.detectChanges()
  console.log(this.isDropup)
}
removeRow(id){
  console.log(id);
}
manageSub(id){
  console.log(id);
}

}
