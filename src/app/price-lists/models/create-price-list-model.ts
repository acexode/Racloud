import { ProductPrices } from './product-prices-model';

export interface CreatePriceListModel {
    name?: string;
    currency?: string;
    productPrices?: Array<ProductPrices>;
}