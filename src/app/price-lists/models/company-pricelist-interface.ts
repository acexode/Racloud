export interface CompanyPriceList {
    init: boolean,
    data: {
        currency?: string;
        priceList?: string;
        priceListId?: number;
    }
}
export interface CompanyPriceListData {
    currency?: string;
    priceList?: string;
    priceListId?: number;
}