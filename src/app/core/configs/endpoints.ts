import { environment } from '../../../environments/environment';

export const serverBaseUrl = environment.serverUrl + '/api';

export const baseEndpoints = {
  customers: '/customers',
};

export const authEndpoints = {
  login: serverBaseUrl + '/auth/login',
};

