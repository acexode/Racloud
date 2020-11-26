import { InputConfig } from '../../models/input/input-config';

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