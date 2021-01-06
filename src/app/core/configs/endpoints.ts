import { environment } from '../../../environments/environment';

export const serverBaseUrl = environment.serverUrl + '/api';

export const baseEndpoints = {
  auth: serverBaseUrl + '/auth',
  customers: serverBaseUrl + '/customers',
  priceLists: serverBaseUrl + '/pricelists',
  countries: serverBaseUrl + '/countries',
  customerparent: serverBaseUrl + '/parents',
};

export const authEndpoints = {
  login: baseEndpoints.auth + '/login',
  signout: baseEndpoints.auth + '/sign-out',
  customersSignUp: baseEndpoints.customers + '/signup',
};

export const customersEndpoints = {
  addCustomer: baseEndpoints.customers + '/add-customer'
}
export const productEndpoints = {
  getProducts: serverBaseUrl + '/products',
  createProduct: serverBaseUrl + '/products/create',
  updateProduct: serverBaseUrl + '/products/'
};
export const optionEndpoints = {
  createOption: serverBaseUrl + '/options/create',
  getOptions: serverBaseUrl + '/options'
};
export const shopEndpoints = {
  getShops: serverBaseUrl + '/shop',
  getSingleShop: serverBaseUrl + '/shop'
};
export const orderEndpoints = {
  generateOrder: serverBaseUrl + '/orders/generate-order',
  getOrders: serverBaseUrl + '/orders',
  getSingleOrder: serverBaseUrl + '/orders'
};

