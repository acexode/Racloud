import { InputConfig } from '../../models/input/Input-config';

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