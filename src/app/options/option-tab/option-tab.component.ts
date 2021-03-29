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
    console.log(this.optionList)
    if (this.optionList) {
      this.optionList = this.optionList.map(e => {
        if(e.OptionType === 'ValueList'){
          const filt = e.ValueList.filter(f => f.optionSelected)
          const displayValue =  filt.map(fe => fe.Name).slice(0,3).join(', ');
          console.log(filt)
          if(filt.length){
            e.displayValue = displayValue
          }else{
            e.displayValue = 'No value selected'
          }
          const arrObj = e.ValueList.map(val => {
            return {
              ...val,
              selected: true
            }
          })
          return {
            ...e,
            ValueList: arrObj
          }
        }
        return e
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

  removeRow(row) {}
  manageSub(id: any) {}
  renewSub(id: any) {}

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
    // console.log(arr)
    const str =   arr.filter(v =>v.optionSelected).map(e => e.Name).slice(0,3).join(', ');
    if(arr.length > 3){
      return str + '...'
    }else{
      console.log(str)
      return str.length ? str : 'No value selected'
    }
  }
  getRow(item){
    this.rowValue = item.selected[0]
    this.selectedRows.emit(item)
  }
  setPartnerAccess(row, access){
    this.optionList = this.optionList.map(obj =>{
      if(obj.Id === row.Id){
        return {
          ...obj,
          PartnerAccess: access,
          selected: true
        }
      }
      return obj
    })
    // console.log(this.optionList)
    this.reInitData(this.optionList)
  }
  setUserAccess(row, access){
    this.optionList = this.optionList.map(obj =>{
      if(obj.Id === row.Id){
        return {
          ...obj,
          UserAccess: access,
          selected: true
        }
      }
      return obj
    })
    this.ref.detectChanges()
    this.reInitData(this.optionList)
  }
  reInitData(data: []){
    this.rowData = data
    const cloneData = data.map((v: any) => {
        return { ...v };
    });
    this.productS.SetOptionList(data)
    this.tableData.next(cloneData);
    this.ref.detectChanges()
  }
  onCheckValueBoolean($event, row){
    const checked = $event.target.checked
    console.log(checked)
    this.checkedValueList = this.optionList.map(obj => {
      if(obj.Id === row.Id){
        obj.ValueBoolean = checked
        obj.selected = true
        return obj
      }
      return obj
    })
    console.log(this.optionList)
    this.reInitData(this.optionList)
  }
  onCheckValueList($event, row, valueId){
    const checked = $event.target.checked
    this.optionList = this.optionList.map(e => {
      if(e.Id === row.Id){
        if(e.OptionType === 'ValueList'){
          const arrObj = e.ValueList.map(val => {
            if(val.Id === valueId){
              val.selected = checked
              val.optionSelected = checked
            }
            return val
          })
          console.log(arrObj)
          const filt = arrObj.filter(f => f.optionSelected)
          const displayValue =  filt.map(e => e.Name).slice(0,3).join(', ');
          console.log(filt)
          if(filt.length){
            e.displayValue = displayValue
          }else{
            e.displayValue = 'No value selected'
          }
          console.log(e)
          return {
            ...e,
            selected: true,
            ValueList: arrObj
          }
        }
        return e
      }
      return e
    })
    console.log(this.optionList)
    this.reInitData(this.optionList)
    this.ref.detectChanges()
  }
  updateValue(event, cell, rowIndex) {
    const idx = this.optionList.findIndex(e => e.Id === rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.optionList[idx][cell] = event.target.value;
    this.optionList[idx].selected = true
    console.log(this.optionList[idx])
    this.optionList = [...this.optionList];
    this.reInitData(this.optionList)
  }
}