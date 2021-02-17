import { Account } from './account.interface';

export interface AuthState {
  init: boolean;
  account?: Account;
  authToken?: string;
  expiryDate?: string | Date;
  impersonatorId?: string;
}
