export interface TableFilter {
  type: 'text' | 'select' | 'date';
  innerProp?: string;
  defaultValue?: any;
  selectOptions?: Array<any>;
  customFieldConfigs?: any;
}
