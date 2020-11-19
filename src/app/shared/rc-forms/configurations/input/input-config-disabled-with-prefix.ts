import { InputConfig } from '../../models/input/Input-config';

export const InputConfigDisabledWithPrefix = (): InputConfig => {
    return {
        inputLabel: {
            text: 'Label'
        },
        type: 'text',
        placeholder: 'Default',
        prefixIcon: true,
        formStatus: {
            isDisabled: true
        }
    };
};