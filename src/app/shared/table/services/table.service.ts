import { formatDate } from '@angular/common';
import { RequestService } from './../../../core/services/request/request.service';
import { Injectable } from '@angular/core';
import { TableFilterConfig } from '../models/table-filter-config.interface';
import { TableColumnI } from '../models/table.interface';
import { TableFilterType } from '../models/table-filter-types';

export interface DateFilter {
  columnId: string;
  startDate: string;
  endDate: string;
}

@Injectable()
export class TableService {
  constructor(private reqS: RequestService) {}

  filterRowInputs(
    tableConfigs: Array<TableColumnI>,
    rowData: Array<any>,
    filterConfig: TableFilterConfig
  ): Array<any> {
    const cacheStore = {};
    const props = Object.keys(filterConfig);
    if (props.length) {
      return rowData.filter((val) =>
        this.filterOp(val, tableConfigs, filterConfig, cacheStore)
      );
    } else {
      return rowData;
    }
  }

  filterOp(value, tableConfigs, filterConfigs, cacheStore) {
    let filterResFalse = 0;
    Object.keys(filterConfigs).forEach((key) => {
      const tableFKey = 'tableF_' + key;
      let tableConfig = cacheStore[tableFKey];
      if (!tableConfig) {
        tableConfig = tableConfigs.find((tC) => tC.identifier === key);
      }
      if (!tableConfig) {
        filterResFalse++;
      } else {
        cacheStore[tableFKey] = tableConfig;
        const filterType =
          tableConfig.filterConfig && tableConfig.filterConfig.filterType
            ? tableConfig.filterConfig.filterType
            : TableFilterType.TEXT;

        const filterItemRes = this.doFilterItem(
          value,
          tableConfig.identifier,
          filterConfigs[tableConfig.identifier],
          filterType
        );
        if (!filterItemRes) {
          filterResFalse++;
        }
      }
    });
    return filterResFalse === 0;
  }

  doFilterItem(
    valueObj: any,
    identifier: string,
    filterValue: any,
    filterType: TableFilterType = TableFilterType.TEXT
  ) {
    if (!valueObj.hasOwnProperty(identifier)) {
      return false;
    }
    const vO = valueObj[identifier];
    switch (filterType) {
      case TableFilterType.TEXT:
        try {
          return valueObj[identifier]
            .toString()
            .toLowerCase()
            .includes(filterValue.data.toLowerCase());
        } catch (err) {
          return false;
        }
      case TableFilterType.SELECT:
        try {
          if (!filterValue.data) {
            return true;
          }
          return vO === filterValue.data;
        } catch (err) {
          return false;
        }
      case TableFilterType.DATE_RANGE:
        try {
          if (!filterValue.data) {
            return true;
          }
          const startDate = new Date(filterValue.data[0]);
          const endDate = new Date(filterValue.data[1]);

          const dateParts = vO.split('-');
          const first = dateParts[0].split('.');
          const second = dateParts[1].split(':');
          let date = null;
          if (second) {
            date = new Date(+first[2], first[1] - 1, +first[0], second[2], second[1], second[0]);
          }
          return date >= startDate && date <= endDate;
        } catch (err) {
          return false;
        }
      default:
        return true;
    }
  }

  filterData(
    filterObj: TableFilterConfig,
    baseUrl: string,
    filterOptions?: string,
    orderByOptions?: any
  ) {
    const columns = Object.keys(filterObj);
    let urlOptions = {};
    const filters = [];
    columns.forEach((el) => {
      const value = filterObj[el];
      switch (value.filterType) {
        case 0: {
          if (value.data) {
            const splitted = el.split('.');
            if (el === splitted[0]) {
              const filt = 'contains(' + el + ',\'' + value.data + '\')';
              filters.push(filt);
            } else {
              const filt =
                'contains(' +
                splitted[0] +
                '/' +
                splitted[1] +
                ',\'' +
                value.data +
                '\')';
              filters.push(filt);
            }
            break;
          } else {
            break;
          }
        }
        case 1: {
          if (value.data) {
            if (value.data === 'true' || value.data === 'false') {
              const filt = el + ' eq ' + value.data;
              filters.push(filt);
              break;
            } else {
              const filt = 'contains(' + el + ',\'' + value.data + '\')';
              filters.push(filt);
              break;
            }
          } else {
            break;
          }
        }
        case 4: {
          if (value.data) {
            const filt =
              el +
              ' gt ' +
              new Date(
                new Date(value.data[0]).setHours(0, 0, 0)
              ).toISOString() +
              ' and ' +
              el +
              ' lt ' +
              new Date(
                new Date(value.data[1]).setHours(23, 59, 59)
              ).toISOString();
            filters.push(filt);
          }
          break;
        }
        case 5: {
          if (value.data) {
            const filt = el + ' eq ' + value.data;
            filters.push(filt);
          }
          break;
        }
        default:
          break;
      }
    });
    if (filterOptions) {
      filters.push(filterOptions);
    }
    const filterArr = filters.join(' and ');
    if (filterArr) {
      urlOptions = {
        params: {
          $filter: filterArr,
          $orderby: orderByOptions ? orderByOptions : '',
        },
      };
    } else {
      urlOptions = {
        params: {
          $orderby: orderByOptions ? orderByOptions : '',
        },
      };
    }
    return this.reqS.get<Array<any>>(baseUrl, urlOptions);
  }

  filterLinqData(
    filterObj: TableFilterConfig,
    baseUrl: string,
    filterOptions?: string,
    orderByOptions?: any,
    pageNo?: number
  ) {
    const columns = Object.keys(filterObj);
    const filters = [];
    let start = '';
    let end = '';
    let currentDateFilterField = '';
    const dateObj: Array<DateFilter> = [];
    columns.forEach((el) => {
      const value = filterObj[el];
      switch (value.filterType) {
        case 0: {
          if (value.data) {
            const splitted = el.split('.');
            if (el === splitted[0]) {
              const filt =
                el + ' !=null && ' + el + '.contains("' + value.data + '")';
              filters.push(filt);
            } else {
              const filt =
                splitted[0] +
                '.' +
                splitted[1] +
                '.contains("' +
                value.data +
                '")';
              filters.push(filt);
            }
            break;
          } else {
            break;
          }
        }
        case 1: {
          if (value.data) {
            if (value.data === 'true' || value.data === 'false') {
              const filt = el + ' == ' + value.data;
              filters.push(filt);
              break;
            } else {
              const filt = el + ' == "' + value.data + '"';
              filters.push(filt);
              break;
            }
          } else {
            break;
          }
        }
        case 4: {
          currentDateFilterField = el;
          if (value.data) {
            start = new Date(
              new Date(value.data[0]).setHours(0, 0, 0)
            ).toLocaleString();
            end = new Date(
              new Date(value.data[1]).setHours(23, 59, 59)
            ).toLocaleString();
          } else {
            start = '';
            end = '';
          }
          const filterInfo: DateFilter = {
            columnId: currentDateFilterField,
            startDate: start,
            endDate: end,
          };
          dateObj.push(filterInfo);
          break;
        }
        case 5: {
          if (value.data) {
            const filt = el + ' == ' + value.data;
            filters.push(filt);
          }
          break;
        }
        default:
          break;
      }
    });
    if (filterOptions) {
      filters.push(filterOptions);
    }
    const filterArr = filters.join(' and ');
    const filterObject = {
      filterString: filterArr,
      startDate: start,
      endDate: end,
      dateFilterObj: dateObj,
    };
    return filterObject;
  }
}
