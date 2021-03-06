import { ProductApplication, ProductModel } from 'src/app/products/models/products.model';

export interface PriceListProductManagerModel {
    renewalValue: number;
    supportHours: number;
    value: number;
    productId: number;
    product?: ProductModel | string;
    id: string; /* introduced to make the product distict */
    application?: ProductApplication;
    productType?: null | string,
    uuid?: string;
}