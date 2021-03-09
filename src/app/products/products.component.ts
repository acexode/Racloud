import { ProductServiceService } from './product-service.service';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, HostListener, OnInit, ViewChild, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FooterService } from '../core/services/footer/footer.service';
import { PageContainerConfig } from '../shared/container/models/page-container-config.interface';
import { omnBsConfig } from '../shared/date-picker/data/omn-bsConfig';
import { TableFilterConfig } from '../shared/table/models/table-filter-config.interface';
import { TableFilterType } from '../shared/table/models/table-filter-types';
import { TableI } from '../shared/table/models/table.interface';
import { TableService } from '../shared/table/services/table.service';
import { ProductModel } from './models/products.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MessagesService } from '../shared/messages/services/messages.service';

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
  @ViewChild('descriptionTemplate', { static: true }) descriptionTemplate: TemplateRef<any>;

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
  modalRef: BsModalRef;
  temporaryRowData: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    private tS: TableService,
    private productS: ProductServiceService,
    private router: Router,
    private modalService: BsModalService,
    private msgS: MessagesService
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
        minWidth: 200,
        labelPosition: 'left',
        cellContentPosition: 'left',
      },
      {
        identifier: 'name',
        label: 'Product Name',
        sortable: true,
        minWidth: 250,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
      },
      {
        identifier: 'description',
        label: 'Description',
        sortable: true,
        minWidth: 300,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        cellTemplate: this.descriptionTemplate,
      },
      {
        identifier: 'productType',
        label: 'Type',
        sortable: true,
        minWidth: 150,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        hasFilter: true,
      },
      {
        identifier: 'action',
        label: '',
        sortable: true,
        minWidth: 40,
        headerHasFilterIcon: false,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
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
    this.productS.deleteProducts(data.id).subscribe(
      _res => {
        this.msgS.addMessage({
          text: 'Product Successfully Removed',
          type: 'success',
          dismissible: true,
          customClass: 'mt-32',
          hasIcon: true,
        });
        this.getProducts();
      },
      err => {
        this.msgS.addMessage({
          text: err.error,
          type: 'danger',
          dismissible: true,
          customClass: 'mt-32',
          hasIcon: true,
        });
      }
    );
  }
  manageSub(data: any) {
    this.router.navigate(['products/edit-product', { id: data.id }]);
    console.log(data);
  }
  openModal(template: TemplateRef<any>, rowData: any) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.temporaryRowData.next(rowData);
  }
  confirm(): void {
    this.modalRef.hide();
    if (this.temporaryRowData.value) {
      this.removeRow(this.temporaryRowData.value);
    } else {
      this.msgS.addMessage({
        text: 'Looks like there is a technical error. Please contact Engineer to resolve it (Error: 00RA1)',
        type: 'danger',
        dismissible: true,
        customClass: 'mt-32',
        hasIcon: true,
      });
    }
  }

  decline(): void {
    this.modalRef.hide();
  }
  resetTemporaryRowData() {
    this.temporaryRowData.next(null);
  };

}
