import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  HostListener,
} from '@angular/core';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { Subject, Subscription, timer } from 'rxjs';
import { debounce, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { TableFilterConfig } from '../../models/table-filter-config.interface';
import { TableFilterType } from '../../models/table-filter-types';
import { TableI } from './../../models/table.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  vReset;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @Input() rows: any;
  @Input() scrollH: boolean;
  @Input() preselectedRows: [];
  @Input() config: TableI;
  @Input() rowDetailConfig: any;
  @Input() updateListener: Subject<any>;
  @Input() set reset(v) {
    this.vReset = v;
    this.handleResize();
  }
  @Output() selectedRows: EventEmitter<any> = new EventEmitter();
  @Output() filterData: EventEmitter<any> = new EventEmitter();
  @Output() pagingData: EventEmitter<any> = new EventEmitter();
  @Output() sortingData: EventEmitter<any> = new EventEmitter();


  filterInputData: TableFilterConfig = {};
  actualData: any;

  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  contentFilterSubj: Subject<{
    key: string;
    inputData: any;
    filterType: TableFilterType;
    throttle?: boolean;
  }> = new Subject();
  contentFilterSubs: Subscription;
  filterTypes = TableFilterType;
  filterModelStore: {
    [key: string]: any;
  } = {};
  defaultFilterIcon = '../assets/images/filtru.svg';
  defaultSortIcon = '../assets/images/up.svg';
  selectableClass = '';
  resizeListener = new Subject();

  rowClass = (row) => {
    return {
      'position-relative': true,
    };
  };

  constructor(private cdRef: ChangeDetectorRef) {
    const rsS = this.resizeListener
      .pipe(debounceTime(120), distinctUntilChanged())
      .subscribe(() => this.handleResize());
  }

  ngOnInit(): void {
    const selectedrows = this.rows.filter(obj => obj.selected === true);
    this.selected = [...selectedrows];
    this.cdRef.detectChanges();
    this.doFilterActions();
    this.selectableClass =
      '' +
      (this.config.selectDetail ? 'has-select-detail ' : '') +
      (this.config.selectable ? 'has-selectable' : '');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const width =
      event &&
        event.hasOwnProperty('target') &&
        event.target.hasOwnProperty('innerWidth')
        ? event.target.innerWidth
        : 0;
    this.resizeListener.next(width);
  }

  handleResize() {
    if (this.table) {
      this.table.recalculateColumns();
      this.table.recalculate();
    }
  }
  onSelect(selectedObj) {
    console.log(selectedObj);
    const { selected } = selectedObj;
    const lastItem = selected[selected.length - 1];
    lastItem.selected = !lastItem.selected;
    selected[selected.length - 1] = lastItem;
    const uniq = [];
    selected.reverse().forEach(e => {
      const index = uniq.findIndex(obj => obj.Id === e.Id);
      if (index <= -1) {
        uniq.push(e);
      }
    });
    selectedObj.selected = uniq;
    this.selected = uniq;
    this.selectedRows.subscribe(e => {
      console.log(e);
    });
    this.selectedRows.emit(selectedObj);
  }

  onActivate(event) { }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  updateFilter(
    columnKey,
    inputData,
    filterType: TableFilterType = TableFilterType.TEXT
  ) {
    switch (filterType) {
      case TableFilterType.TEXT:
        this.contentFilterSubj.next({
          key: columnKey,
          inputData,
          filterType,
          throttle: true,
        });
        break;
      default:
        this.contentFilterSubj.next({
          key: columnKey,
          inputData,
          filterType,
          throttle: false,
        });
        break;
    }
  }

  doFilterActions() {
    this.contentFilterSubs = this.contentFilterSubj
      // Throttle input for text input case.
      .pipe(debounce((val) => timer(val.throttle ? 120 : 0)))
      .subscribe((config) => {
        this.filterInputData[config.key] = {
          filterType: config.filterType,
          data: config.inputData,
        };
        this.filterData.emit(this.filterInputData);
      });
  }

  updatePagination(event) {
    this.pagingData.emit(event);
  }

  updateSorting(column) {
    console.log(column);
    column.sorting = true;
    column.isDesc = !column.isDesc;
    this.sortingData.emit(column);
  }
  isArray(row) {
    return row.ValueList.length;
  }
}
