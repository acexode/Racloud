export interface Account {
  username: string;
  image: string;
  company?: {
    companyName?: string;
    companyType?: string;
    id?: number | string;
  };
  roles?: Array<string> | string;
  user?: {
    id?: any;
    firstname?: string;
    lastname?: string;
    email?: string;
  };
}
