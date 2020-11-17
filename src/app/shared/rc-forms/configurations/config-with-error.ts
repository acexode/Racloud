import { InputConfig } from '../models/Input-config';

export const configWithError = (): InputConfig => {
    return {
        inputLabel: {
            text: 'Label'
        },
        type: 'text',
        placeholder: 'Default',
        prefixIcon: false,
        inputStatus: {
            isError: true
        }
    }
}