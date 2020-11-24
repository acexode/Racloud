import { InputConfig } from '../../models/input/input-config';

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