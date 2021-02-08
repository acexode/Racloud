export interface Account {
  username: string;
  image: string;
  company?: {
    companyName?: string;
    companyType?: string;
    id?: Number | string;
  };
  roles?: Array<string> | string;
}
