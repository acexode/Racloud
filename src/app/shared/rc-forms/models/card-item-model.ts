export interface CardItem {
    Id?: string | number;    
    type?: string;
    Product?: {
        Id: string;
        Name: string;
        Description: string,
        Version: number,
        ProductType: string
    };    
    ProductId?: number;
    Value?: string | number;
    RenewalValue?: string | number;
    SupportHours: number
    Discount: number
    DiscountPrc: number
};