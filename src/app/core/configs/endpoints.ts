import { environment } from '../../../environments/environment';

export const serverBaseUrl = environment.serverUrl + '/api';

export const baseEndpoints = {
  customers: '/customers',
};

export const authEndpoints = {
  login: serverBaseUrl + '/auth/login',
  customersSignUp: serverBaseUrl + baseEndpoints.customers + '/signup'
};
export const optionEndpoints = {
  createOption: serverBaseUrl + '/options/create',
  getOptions: serverBaseUrl + '/options'
};

