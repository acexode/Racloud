import { ProductServiceService } from './product-service.service';
import { Router } from '@angular/router';
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
import { ProductModel } from './models/products.model';

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

  rowData: ProductModel[] = [];
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
    loadingIndicator: true,
    columns: [],
    externalPaging: false,
    externalSorting: false,
    action: true
  };
  constructor(
    private tS: TableService,
    private footerS: FooterService,
    private productS: ProductServiceService,
    private http: HttpClient,
    private ref: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.rowData.length) {
      const dBody = document.querySelector('.datatable-body') as HTMLElement;
      dBody.style.minHeight = 'auto';
    }
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = [
      {
        identifier: 'application.name',
        label: 'Application Name',
        sortable: true,
        minWidth: 160,
        noGrow: true,
        labelPosition: 'left',
        cellContentPosition: 'left',
      },
      {
        identifier: 'name',
        label: 'Product Name',
        sortable: true,
        minWidth: 237,
        width: 150,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
      },
      {
        identifier: 'description',
        label: 'Description',
        sortable: true,
        width: 499,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
      },
      {
        identifier: 'productType',
        label: 'Type',
        sortable: true,
        minWidth: 100,
        noGrow: false,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        hasFilter: true,
      },
      {
        identifier: '',
        label: '',
        sortable: true,
        width: 60,
        noGrow: true,
        headerHasFilterIcon: false,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        hasFilter: false,
        cellTemplate: this.actionDropdown
      },
    ];
    this.getProducts();
  }
  public getProducts() {
    this.productS.getProducts().subscribe((data) => {
      if (data) {
        this.tableConfig.loadingIndicator = true;
        this.rowData = data;
        const cloneData = data.map((v) => {
          return { ...v };
        }).reverse();
        this.tableData.next(cloneData);
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

  removeRow(data) {
    this.productS.deleteProducts(data.id).subscribe(e => {
      this.getProducts();
    });
  }
  manageSub(data: any) {
    this.router.navigate(['products/edit-product', { id: data.id }]);
    console.log(data);
  }

}
