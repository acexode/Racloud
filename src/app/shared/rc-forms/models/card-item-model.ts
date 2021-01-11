export interface CardItem {
    id?: string | number;    
    value?: string | number;
    productId?: number;
    priceListId?: number;
    renewalValue?: string | number;
    discount: number
    discountPrc: number
    supportHours: number
    product?: {
        id: string;
        name: string;
        description: string,
        version: number,
        productType: string
    };
};