import { environment } from '../../../environments/environment';

export const serverBaseUrl = environment.serverUrl + '/api';

export const baseEndpoints = {
  auth: serverBaseUrl + '/auth',
  customer: serverBaseUrl + '/customer',
  customers: serverBaseUrl + '/customers',
  allCustomers: serverBaseUrl + '/allcustomers',
  priceLists: serverBaseUrl + '/pricelists',
  countries: serverBaseUrl + '/countries',
  customerparent: serverBaseUrl + '/parents',
  user: serverBaseUrl + '/user',
};

export const authEndpoints = {
  login: baseEndpoints.auth + '/login',
  signout: baseEndpoints.auth + '/sign-out',
  customersSignUp: baseEndpoints.customers + '/signup',
};

export const customersEndpoints = {
  addCustomer: baseEndpoints.customers + '/add-customer',
  getCustomers: serverBaseUrl + '/allcustomers',
  getOneCustomers: serverBaseUrl + '/customers',
  getCompanyUsers: serverBaseUrl + '/customers/',
  profile: baseEndpoints.customer + '/profile'
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
  orderDiscount: serverBaseUrl + '/orders/order-discount/apply/',
  cartTotal: serverBaseUrl + '/orders/GetProductsCountInCart'
};
export const licenseEndpoints = {
  createLicense: serverBaseUrl + '/licenses/purchase',
  getLicenses: serverBaseUrl + '/licenses',
  getOwnLicenses: serverBaseUrl + '/loggedcustomer/licenses',
  getCustomerLicenses: serverBaseUrl + '/licenses/customer/',
  getOneLicense: serverBaseUrl + '/licenses/'
};
export const userEndpoints = {
  getCreateUpdateUser: serverBaseUrl + '/users',
  getUsers: serverBaseUrl + '/users/logged-in-company-users',
  changePassword: serverBaseUrl + '/account/changepassword',
  changePasswordAdmin: serverBaseUrl + '/account/ChangePasswordWithoutOldPassword',
  sendResetPassword: serverBaseUrl + '/send-password-reset-email',
  resetPassword: serverBaseUrl + '/account/resetpassword',
  userPermissionPerPage: serverBaseUrl + '/user-permission-per-page',
  impersonate: serverBaseUrl + '/auth/impersonate',
  stopImpersonate: serverBaseUrl + '/auth/stop-impersonate',
  profile: baseEndpoints.user + '/profile',
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
  currency: baseEndpoints.priceLists + '/currency/company' // currency/company/{companyId}
};
export const ApplicationEndpoints = {
  getApplications: serverBaseUrl + '/applications',
};