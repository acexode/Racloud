export interface LoginResponse {
  token: string;
  expiration: string | Date;
  code?: string;
  message?: string;
  user?: User;
  company?: Company;
  roles?: Array<any> | string;
}

export interface User {
  email?: string;
  firstname?: string;
  id?: string;
  lastname?: string;
}

export interface Company {
  companyName?: string;
  companyType?: string;
  id?: number | string;
}
