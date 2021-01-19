import { ProductModel } from 'src/app/products/models/products.model';

export interface PriceListProductManagerModel {
    renewalValue: number | string;
    supportHours: number | string;
    value: number | string;
    productId: number | string;
    product?: ProductModel | string;
    id: string; /* introduced to make the product distict */
    application?: null | string;
    productType?: null | string,
    uuid?: string;
}