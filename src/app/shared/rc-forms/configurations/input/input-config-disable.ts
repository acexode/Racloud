import { InputConfig } from '../../models/input/input-config';

export const InputConfigDisabled = (): InputConfig => {
    return {
        inputLabel: {
            text: 'Label'
        },
        type: 'text',
        placeholder: 'Default',
        prefixIcon: false,
        formStatus: {
            isDisabled: true
        }
    };
};