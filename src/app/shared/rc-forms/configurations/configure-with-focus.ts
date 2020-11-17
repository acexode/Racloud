import { InputConfig } from '../models/Input-config';

export const configWithFocus = (): InputConfig => {
    return {
        inputLabel: {
            text: 'Label'
        },
        type: 'text',
        placeholder: 'Default',
        prefixIcon: false,
        inputStatus: {
            isFocus: true
        }
    };
};