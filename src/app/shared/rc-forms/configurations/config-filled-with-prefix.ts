import { InputConfig } from '../models/Input-config';

export const configFilledWithPrefix = (): InputConfig => {
    return {
        inputLabel: {
            text: 'Label'
        },
        type: 'text',
        placeholder: 'Default',
        prefixIcon: true,
        inputStatus: {
            isFilled: true
        }
    };
};