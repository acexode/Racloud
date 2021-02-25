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
  addCustomer: baseEndpoints.customers + '/add-customer',
  getCustomers: serverBaseUrl + '/customers',
  getCompanyUsers: serverBaseUrl + '/customers/',
};
export const productEndpoints = {
  getProducts: serverBaseUrl + '/products',
  createProduct: serverBaseUrl + '/products/create',
  updateProduct: serverBaseUrl + '/products/'
};
export const optionEndpoints = {
  createOption: serverBaseUrl + '/options/create',
  getOptions: serverBaseUrl + '/options',
  isOptionInUse: serverBaseUrl + '/IsOptionInUse/'
};
export const orderEndpoints = {
  generateOrder: serverBaseUrl + '/orders/generate-order',
  getOrders: serverBaseUrl + '/orders',
  getSingleOrder: serverBaseUrl + '/orders',
  getCustomerOrders: serverBaseUrl + '/orders/customer/',
  addToCart: serverBaseUrl + '/orders/add-item-to-cart/',
  reduceCartItem: serverBaseUrl + '/orders/reduce-item-quantity-in-cart/',
  deleteCartItem: serverBaseUrl + '/orders/remove-item-from-cart/',
  applyDiscount: serverBaseUrl + '/orders/discount/apply/',
  orderDiscount: serverBaseUrl + '/orders/order-discount/apply/'
};
export const licenseEndpoints = {
  createLicense: serverBaseUrl + '/licenses/purchase',
  getLicenses: serverBaseUrl + '/licenses',
  getOwnLicenses: serverBaseUrl + '/loggedcustomer/licenses',
  getCustomerLicenses: serverBaseUrl + '/loggedcustomer/licenses',
  getOneLicense: serverBaseUrl + '/licenses/'
};
export const userEndpoints = {
  getCreateUpdateUser: serverBaseUrl + '/users',
  getUsers: serverBaseUrl + '/users/logged-in-company-users',
  changePassword: serverBaseUrl + '/account/changepassword',
  sendResetPassword: serverBaseUrl + '/send-password-reset-email',
  resetPassword: serverBaseUrl + '/account/resetpassword',
  userPermissionPerPage: serverBaseUrl + '/user-permission-per-page',
  impersonate: serverBaseUrl + '/auth/impersonate',
  stopImpersonate: serverBaseUrl + '/auth/stop-impersonate',
};
export const roleEndpoints = {
  getRoles: serverBaseUrl + '/roles',
  createRole: serverBaseUrl + '/admin/create-role'
};

export const shopEndpoints = {
  getShops: serverBaseUrl + '/shop/company/products',
  getSingleShop: serverBaseUrl + '/shop'
};
export const priceListEndpoints = {
  create: baseEndpoints.priceLists + '/create',
};
export const ApplicationEndpoints = {
  getApplications: serverBaseUrl + '/applications',
};
