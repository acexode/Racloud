export interface CreateCustomer {
    firstName: string;
    lastName: string;
    companyType: string;
    companyEmail: string;
    parentId: string | number;
    companyName: string;
    address: string;
    country: string;
    language: string;
    phoneNumber: string | number;
    priceListId?: number | string;
}