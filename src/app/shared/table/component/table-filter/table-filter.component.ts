import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TableFilterConfigItem } from '../../models/table-filter-config.interface';
import { TableFilterType } from '../../models/table-filter-types';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss'],
})
export class TableFilterComponent implements OnInit {
  @Input() identificator: string;
  @Input() filterConfig: TableFilterConfigItem;
  @Output() filterChange: EventEmitter<any> = new EventEmitter();

  searchIcon = '../assets/images/search.svg';
  calendarIcon = '../assets/images/Calendar.svg';
  fieldModel = null;
  filterType = TableFilterType;
  constructor() {}

  ngOnInit(): void {
    console.log(this.filterConfig)
  }

  outputFilter() {
    this.filterChange.emit(this.fieldModel);
  }
}
