import { InputConfig } from '../../models/input/input-config';

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