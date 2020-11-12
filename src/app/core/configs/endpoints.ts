import { environment } from '../../../environments/environment';

export const serverBaseUrl = environment.serverUrl  + '/api';

export const authEndpoints = {
  login: serverBaseUrl + '/login',
};
