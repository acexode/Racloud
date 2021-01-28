import { MessagesService } from './../../shared/messages/services/messages.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FooterService } from 'src/app/core/services/footer/footer.service';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { omnBsConfig } from 'src/app/shared/date-picker/data/omn-bsConfig';
import { TableFilterConfig } from 'src/app/shared/table/models/table-filter-config.interface';
import { TableFilterType } from 'src/app/shared/table/models/table-filter-types';
import { TableI } from 'src/app/shared/table/models/table.interface';
import { TableService } from 'src/app/shared/table/services/table.service';
import { LicenseServiceService } from 'src/app/license/license-service.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-option-list',
  templateUrl: './option-list.component.html',
  styleUrls: ['./option-list.component.scss']
})
export class OptionListComponent implements OnInit {

  @ViewChild('optionType', { static: true }) optionType: TemplateRef<any>;
  @ViewChild('hoverDetailTpl', { static: true }) hoverDetailTpl: TemplateRef<any>;
  @ViewChild('selectDetailTemplate', { static: true }) selectDetailTemplate: TemplateRef<any>;
  @ViewChild('actionDropdown', { static: true }) actionDropdown: any;
  @ViewChild('selectT', { static: true }) selectT: any;

  @ViewChild('expiredIconTemplate', { static: true }) expiredIconTemplate: TemplateRef<any>;


  rowData: Array<any> = [];
  rowToDelete  = null
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
    expand: true,
    columns: [],
    externalPaging: false,
    externalSorting: true,
    loadingIndicator: true,
    action: true
  };
  isDropup: boolean;
  modalRef: BsModalRef;
  constructor(
    private tS: TableService,
    private footerS: FooterService,
    private http: HttpClient,
    private router: Router,
    private service: LicenseServiceService,
    private ref: ChangeDetectorRef,
    private msgS: MessagesService,
    private modalService: BsModalService,
  ) { }
  ngOnInit(): void {
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.selectDetailTemplate = this.selectDetailTemplate;
    this.tableConfig.columns = [
      {
        identifier: 'Name',
        label: 'Option Name',
        sortable: true,
        minWidth: 276,
        width: 276,
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
        identifier: 'Id',
        label: 'Option Type',
        sortable: true,
        width: 169,
        minWidth: 169,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        cellTemplate: this.optionType,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'OptionType',
        label: 'Value',
        sortable: false,
        minWidth: 611,
        width: 611,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
        cellTemplate: this.expiredIconTemplate,
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
        minWidth: 90,
        width: 90,
        noGrow: true,
        headerHasFilterIcon: true,
        sortIconPosition: 'right',
        labelPosition: 'right',
        cellContentPosition: 'right',
        hasFilter: true,
        cellTemplate: this.actionDropdown
      },
    ];
    this.getJSON()
  }
  public getJSON() {
    this.service.getOption().subscribe((data:any) => {
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
  filterTable(filterObj: TableFilterConfig) {
    const newRows = this.tS.filterRowInputs(
      this.tableConfig?.columns,
      this.rowData,
      filterObj
    );
    this.tableData.next(newRows);
  }

  removeRow(row) {
    this.modalRef.hide()
    this.service.deleteOption(row.Id).subscribe(e =>{
      this.getJSON()
      this.displayMsg('Option removed Successfully', 'success')
    },(err)=>{
      this.displayMsg(err.error, 'info')
    })
  }
  manageSub(data: any) {
    this.router.navigate(['options/option-edit', { id: data.Id }]);
  }
  renewSub(row: any) {}

  setDropUp(rowIndex, row) {
    // const idx = this.rowData.findIndex(e => e.Id === row.Id) + 1;
    const idx = rowIndex + 1;
    const mod = idx % 10 === 0 ? 10 : idx % 10;
    if (mod < 6) {
      this.isDropup = false;
    } else {
      this.isDropup = true;
    }
    this.ref.detectChanges();
  }
  toString(arr: any[]) {
    const str =   arr.map(e => e.Name).slice(0,5).join(', ');
    if(arr.length > 5){
      return str + '...'
    }else{
      return str
    }

  }
  openModal(template: TemplateRef<any>, row) {
    this.rowToDelete = row
    console.log(row)
    this.modalRef = this.modalService.show(template,  Object.assign({}, { class: 'gray' }));
  }
  deleteRow(){

  }
  displayMsg(msg, type){
    this.msgS.addMessage({
      text: msg,
      type,
      dismissible: true,
      customClass: 'mt-32',
      hasIcon: true,
    });
    setTimeout(()=> {
      this.msgS.clearMessages()
    },5000)
  }
}