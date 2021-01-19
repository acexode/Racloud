export interface CardItem {
    id?: string | number;
    type?: string;
    productId?: number;
    priceListId?: number;
    productName?: string;
    productVersion?: string;
    discount?: number;
    discountPrc?: number;
    supportHours?: number;
    value?: string | number;
    renewalValue?: string | number;
    product?: {
        id?: number;
        name?: string;
        description?: string;
    };
};