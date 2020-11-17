import { InputConfig } from '../models/Input-config';

export const configWithFocus = (): InputConfig => {
    return {
        inputLabel: {
            text: 'Label'
        },
        type: 'text',
        placeholder: 'Default',
        prefix: false,
        inputStatus: {
            isFocus: true
        }
    };
};