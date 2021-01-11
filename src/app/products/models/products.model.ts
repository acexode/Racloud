export interface ProductModel {
    id: number;
    name: string;
    description: string;
    application: string;
    productType: string;
    productOptions: Array<ProductOption>;
    productPrices: string | null;
    version: number;
}

export interface ProductOption {
    id: number;
    optionId: number;
    userAccess: string;
    partnerAccess: string;
}