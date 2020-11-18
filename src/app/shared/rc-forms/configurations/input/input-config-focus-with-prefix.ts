import { InputConfig } from '../../models/input/Input-config';

export const InputConfigFocusWithPrefix = (): InputConfig => {
    return {
        inputLabel: {
            text: 'Label'
        },
        type: 'text',
        placeholder: 'Default',
        prefixIcon: true,
        formStatus: {
            isFocus: true
        }
    };
};