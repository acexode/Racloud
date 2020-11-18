import { InputConfig } from '../../models/input/Input-config';

export const InputConfigWithError = (): InputConfig => {
    return {
        inputLabel: {
            text: 'Label'
        },
        type: 'text',
        placeholder: 'Default',
        prefixIcon: false,
        formStatus: {
            isError: true
        }
    }
}