import { InputConfig } from '../../models/input/Input-config';

export const InputConfigWithPrefix = (): InputConfig => {
    return {
        inputLabel: {
            text: 'Label'
        },
        type: 'text',
        placeholder: 'Default',
        prefixIcon: true,
    };
};