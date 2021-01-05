export interface CustomerModel {
    address?: string;
    anniversaryDate?: string | Date;
    companyEmail: string;
    companyName: string;
    companyType: string;
    contactPersonFirstName?: string | null;
    contactPersonLastName?: string | null;
    country: string;
    currency?: string;
    disabled?: boolean;
    email: string;
    firstName: string;
    id?: string;
    language?: string;
    lastLoginDate?: string;
    lastName: string;
    parent?: CustomerParentModel;
    parentId?: string;
    phoneNumber: string | number;
    registrationDate?: string | Date;
    subscriptionFee?: number;
    supportHoursAvailable?: number;
    supportHoursContract?: number;
}

export interface CustomerParentModel {
    id?: string;
    companyName?: string;
}