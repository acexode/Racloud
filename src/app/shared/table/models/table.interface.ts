import { TemplateRef } from '@angular/core';
import { TableFilterConfigItem } from './table-filter-config.interface';

export interface TableColumnI {
  identifier: string;
  label: string;
  resizeable?: boolean;
  headerHasFilterIcon?: boolean;
  customHeaderIcon?: string;
  showExpandIcon?: boolean;
  headerIconPosition?: 'left' | 'right';
  labelPosition?: 'left' | 'right';
  cellContentPosition?: 'left' | 'right';
  hasFilter?: boolean;
  sortable?: boolean;
  sortIconPosition?: 'left' | 'right';
  cellTemplate?: TemplateRef<any>;
  filterConfig?: TableFilterConfigItem;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  noGrow?: boolean;
  sorting?: boolean;
  isDesc?: boolean;
}

export interface TableI {
  limit?: number;
  count?: number;
  rowHeight?: number | 'auto' | ((row: any) => number);
  footerHeight?: number;
  selectable?: boolean;
  selectDetail?: boolean;
  expand?: boolean;
  selectDetailTemplate?: TemplateRef<any>;
  columns: Array<TableColumnI>;
  hoverDetail?: boolean;
  hoverDetailTemplate?: TemplateRef<any>;
  externalPaging?: boolean;
  externalSorting?: boolean;
  loadingIndicator?: boolean;
  action?: boolean;
}
