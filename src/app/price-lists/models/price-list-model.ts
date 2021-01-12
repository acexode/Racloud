import { ProductPrices } from "./product-prices-model";

export interface PriceListModel {
    CreateDate: string | Date;
    Currency: string;
    Id: number;
    Name: string;
    NoOfProducts: number;
    ProductPrices: ProductPrices;
}