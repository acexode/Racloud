export interface CardItem {
    id?: string | number;
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
        productType?: string;
        productCode?: string;
    };
    priceList?: {
        currency: string;
    };
};