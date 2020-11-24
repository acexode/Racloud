import { InputConfig } from '../../models/input/input-config';

export const InputConfigFilledWithPrefix = (): InputConfig => {
    return {
        inputLabel: {
            text: 'Label'
        },
        type: 'text',
        placeholder: 'Default',
        prefixIcon: true,
        formStatus: {
            isFilled: true
        }
    };
};