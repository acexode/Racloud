export interface Product {
    Id: string;
    Name: string;
    Application: string;
    Description: string;
    ProductType: string;
    Edition: string;
    Version: number;
    SoftwareAssurance: string;
    ProductOptions: [
        {
            Id: number;
            ProductId: number;
            OptionId: number;
            UserAccess: string;
            PartnerAccess: string;
            Option?: string;
        }
    ],
    ProductPrices?: string;
}