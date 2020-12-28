import { environment } from '../../../environments/environment';

export const serverBaseUrl = environment.serverUrl + '/api';

export const baseEndpoints = {
  auth: serverBaseUrl + '/auth',
  customers: serverBaseUrl + '/customers',
  countries: serverBaseUrl + '/countries',
  customerparent: serverBaseUrl + '/parents',
};

export const authEndpoints = {
  login: baseEndpoints.auth + '/login',
  signout: baseEndpoints.auth + '/sign-out',
  customersSignUp: baseEndpoints.customers + '/signup'
};
export const productEndpoints = {
  getProducts: serverBaseUrl + '/products',
  createProduct: serverBaseUrl + '/products/create',
  updateProduct: serverBaseUrl + '/products/'
}
export const optionEndpoints = {
  createOption: serverBaseUrl + '/options/create',
  getOptions: serverBaseUrl + '/options'
};
export const licenseEndpoints = {
  createLicense: serverBaseUrl + '/licenses/purchase',
  getLicenses: serverBaseUrl + '/licenses',
  getOneLicense: serverBaseUrl + '/licenses/'
};

