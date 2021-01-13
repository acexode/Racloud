export interface Product {
    id: string;
    name: string;
    application: string;
    description: string;
    productType: string;
    edition: string;
    version: number;
    softwareAssurance: string;
    productOptions: [
        {
            id: number;
            productId: number;
            optionId: number;
            userAccess: string;
            partnerAccess: string;
            option?: string;
        }
    ],
    productPrices?: string;
}