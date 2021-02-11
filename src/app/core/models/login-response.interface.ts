export interface LoginResponse {
  token: string;
  expiration: string | Date;
  code?: string;
  message?: string;
  user?: User;
}

export interface User {
  email?: string;
  firstname?: string;
  id?: string;
  lastname?: string;
}
