import { environment } from '../../../environments/environment';

export const serverBaseUrl = environment.serverUrl + '/api';

export const baseEndpoints = {
  customers: serverBaseUrl + '/customers',
};

export const authEndpoints = {
  login: serverBaseUrl + '/auth/login',
  customersSignUp: baseEndpoints.customers + '/signup'
};

