export interface CardItem {
    Id?: string | number;
    type?: string;
    ProductId: number;
    PriceListId: number;
    productName?: string;
    productVersion?: string;
    Discount: number;
    DiscountPrc: number;
    SupportHours: number;
    Value?: string | number;
    RenewalValue?: string | number;
    Product: {
        Id: number;
        Name: string;
        Description:string;
    }
};