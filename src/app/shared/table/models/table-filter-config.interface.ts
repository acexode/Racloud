import { TableFilterType } from './table-filter-types';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

export interface TableFilterConfigItem {
  data: any;
  config?: {
    selectConfig?: {
      emptyLabel: string;
      options: Array<{ key: any; label: string; }>;
    };
    bsConfig?: BsDatepickerConfig;
    bsPlacement?: string;
  };
  filterType: TableFilterType;
  noIcon?: boolean;
  placeholder?: string;
}
export interface TableFilterConfig {
  [filterKey: string]: TableFilterConfigItem;
}
