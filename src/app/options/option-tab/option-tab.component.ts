import { ProductServiceService } from './../../products/product-service.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FooterService } from 'src/app/core/services/footer/footer.service';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { omnBsConfig } from 'src/app/shared/date-picker/data/omn-bsConfig';
import { TableFilterConfig } from 'src/app/shared/table/models/table-filter-config.interface';
import { TableFilterType } from 'src/app/shared/table/models/table-filter-types';
import { TableI } from 'src/app/shared/table/models/table.interface';
import { TableService } from 'src/app/shared/table/services/table.service';


@Component({
  selector: 'app-option-tab',
  templateUrl: './option-tab.component.html',
  styleUrls: ['./option-tab.component.scss']
})
export class OptionTabComponent implements OnInit {

  @ViewChild('colmunDropDownTemplate', { static: true }) colmunDropDownTemplate: TemplateRef<any>;
  @ViewChild('hoverDetailTpl', { static: true }) hoverDetailTpl: TemplateRef<any>;
  @ViewChild('selectDetailTemplate', { static: true }) selectDetailTemplate: TemplateRef<any>;
  @ViewChild('UserAccess', { static: true }) UserAccess: any;
  @ViewChild('PartnerAccess', { static: true }) PartnerAccess: any;
  @ViewChild('selectT', { static: true }) selectT: any;

  @ViewChild('expiredIconTemplate', { static: true }) expiredIconTemplate: TemplateRef<any>;
  @Input() optionList
  @Input() preselectedRows
  @Output() selectedRows: EventEmitter<any> = new EventEmitter();
  rowData: Array<any> = [];
  tableData: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  modifiedTableData: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  checkedValueList = []
  editing = {};
  containerConfig: PageContainerConfig = {
    closeButton: true,
    theme: 'transparent',
    shadow: false,
    panelClasses: {
      header: 'd-none',
      body: 'no-shadow',
    },
  };
  access = ['Editable', 'Hidden', 'Read Only']
  rows = [];
  rowValue = null;
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
    selectDetail: true,
    hoverDetail: true,
    expand: false,
    columns: [],
    externalPaging: false,
    externalSorting: true,
    loadingIndicator: true,
    action: true
  };
  isDropup: boolean;
  constructor(
    private tS: TableService,
    private footerS: FooterService,
    private http: HttpClient,
    private productS: ProductServiceService,

    private ref: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    console.log(this.preselectedRows)
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.selectDetailTemplate = this.selectDetailTemplate;
    this.tableConfig.columns = [
      {
        identifier: 'Name',
        label: 'Option Name',
        sortable: true,
        minWidth: 276,
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
        identifier: 'OptionType',
        label: 'Option Type',
        sortable: true,
        minWidth: 169,
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
        identifier: '',
        label: 'Value',
        sortable: false,
        minWidth: 427,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        cellTemplate: this.colmunDropDownTemplate,
        hasFilter: true,
        filterConfig: {
          data: null,
          filterType: TableFilterType.TEXT,
          noIcon: true
        },
      },
      {
        identifier: 'PartnerAccess',
        label: 'Partner Access',
        sortable: true,
        minWidth: 152,
        width: 112,
        noGrow: true,
        headerHasFilterIcon: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
        cellTemplate: this.PartnerAccess
      },
      {
        identifier: 'UserAccess',
        label: 'User Access',
        sortable: true,
        minWidth: 152,
        width: 112,
        noGrow: true,
        headerHasFilterIcon: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
        cellTemplate: this.UserAccess
      }
    ];
    if (this.optionList) {
      this.optionList.forEach(e => {
        if(e.OptionType === 'ValueList'){
          let obj = {
            id: e.Id,  
            values: e.ValueList
          }
          this.checkedValueList.push(obj)
        }else if(e.OptionType === 'Boolean'){
          let obj = {
            id: e.Id,  
            valueBoolean: e.ValueBoolean
          }
          this.checkedValueList.push(obj)
        }
      })
      this.tableConfig.loadingIndicator = true;
      this.rowData = this.optionList;
      const cloneData = this.optionList.map((v: any) => {
        return { ...v };
      });
      this.tableData.next(cloneData);
      this.tableConfig.loadingIndicator = false;
    }
    // this.getJSON().subscribe((data) => {
    // });
  }
  initTableData(){

  }
  public getJSON(): Observable<any> {
    return this.http.get('./assets/option-list.json');
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
    console.log(row);
  }
  manageSub(id: any) {
    console.log(id);
  }
  renewSub(id: any) {
    console.log(id);
  }

  setDropUp(row) {
    const idx = this.rowData.findIndex(e => e.Id === row.Id) + 1;
    const mod = idx % 10 === 0 ? 10 : idx % 10;
    if (mod < 6) {
      this.isDropup = false;
    } else {
      this.isDropup = true;
    }
    this.ref.detectChanges();
  }
  isArray(value){
    return Array.isArray(value);
  }
  isString(value) {
    return typeof value === 'string';
  }
  toString(arr: any[]) {;
    const str =   arr.map(e => e.Name).slice(0,3).join(', ');
    if(arr.length > 3){
      return str + '...'
    }else{
      return str
    }
  }
  getRow(item){
    this.rowValue = item.selected[0]
    //console.log(item)
    this.selectedRows.emit(item)
  }
  setPartnerAccess(row, access){
    this.optionList = this.optionList.map(obj =>{
      if(obj.Id === row.Id){
        console.log(true)
        return {
          ...obj,
          PartnerAccess: access
        }
      }
      return obj
    })
    this.reInitData(this.optionList)
  }
  setUserAccess(row, access){
    this.optionList = this.optionList.map(obj =>{
      if(obj.Id === row.Id){
        return {
          ...obj,
          UserAccess: access
        }
      }
      return obj
    })
    this.reInitData(this.optionList)
  }
  reInitData(data: []){
    this.rowData = data
    const cloneData = data.map((v: any) => {
        return { ...v };
    });
    this.productS.SetOptionList(data)
    this.tableData.next(cloneData);
  }
  onCheckValueBoolean($event, row){
    const checked = $event.target.checked
    this.checkedValueList = this.checkedValueList.map(e => {
      if(e.id === row.Id){
        e.valueBoolean = checked
        return e
      }
      return e
    })
    this.modifiedTableData.next(this.checkedValueList)
  }
  onCheckValueList($event, row){
    const checked = $event.target.checked
    const value = $event.target.value
    this.checkedValueList = this.checkedValueList.map(e => {
      if(e.id === row.Id){
        if(checked){
          const filtered = row.ValueList.filter(val => val.Name === value)[0]
          e.values.push(filtered)
        }else {
          const filtered = e.values.filter(val => val.Name !== value)
          e.values = filtered
        }
        return e
      }
      return e
    })
    console.log(this.checkedValueList)
    this.modifiedTableData.next(this.checkedValueList)
  }
  updateValue(event, cell, rowIndex) {
    const idx = rowIndex -1;
    this.editing[rowIndex + '-' + cell] = false;
    this.optionList[idx][cell] = event.target.value;
    this.optionList = [...this.optionList];
    this.reInitData(this.optionList)
  }
}