import { InputConfig } from '../../models/input/Input-config';

export const InputConfigFilled = (): InputConfig => {
    return {
        inputLabel: {
            text: 'Label'
        },
        type: 'text',
        placeholder: 'Default',
        prefixIcon: false,
    };
};