import { ProductPrices } from './product-prices-model';

export interface PriceListModel {
    createDate?: string | Date;
    currency?: string;
    id?: number;
    name?: string;
    noOfProducts?: number;
    productPrices?: Array<ProductPrices>;
}
