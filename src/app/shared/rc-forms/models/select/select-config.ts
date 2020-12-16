import { FormStatus } from '../form-status';
import { LabelConfig } from '../label-config';

export interface SelectConfig {
    selectLabel?: LabelConfig;
    multiple?: boolean;
    placeholder?: string;
    idKey?: string;
    labelKey?: string;
    disabled?: boolean;
    searchable?: boolean;
    formStatus?: FormStatus;
}