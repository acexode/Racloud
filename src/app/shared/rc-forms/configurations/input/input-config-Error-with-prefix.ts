import { InputConfig } from '../../models/input/Input-config';

export const InputConfigErrorWithPrefix = (): InputConfig => {
    return {
        inputLabel: {
            text: 'Label'
        },
        type: 'text',
        placeholder: 'Default',
        prefixIcon: true,
        formStatus: {
            isError: true
        }
    };
};