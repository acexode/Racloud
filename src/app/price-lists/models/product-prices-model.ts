import { ProductModel } from "src/app/products/models/products.model";

export interface ProductPrices {
    discount?: number;
    discountPrc?: number;
    id?: number;
    priceListId?: number;
    productId?: number;
    renewalValue?: number;
    supportHours?: number;
    value?: number;
    product?: ProductModel;
}