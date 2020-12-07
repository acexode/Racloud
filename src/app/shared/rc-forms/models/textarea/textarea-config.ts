import { FormStatus } from '../form-status';
import { LabelConfig } from '../label-config';

export interface TextAreaConfig {
    textAreaLabel?: LabelConfig;
    placeholder?: string;
    formStatus?: FormStatus;
}
