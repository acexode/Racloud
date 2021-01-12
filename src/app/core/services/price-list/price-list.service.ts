import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PriceListModel } from 'src/app/price-lists/models/price-list-model';
import { PriceListProductManagerModel } from 'src/app/price-lists/models/price-list-product-manager.model';
import { baseEndpoints } from '../../configs/endpoints';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  priceListProductManager: BehaviorSubject<Array<PriceListProductManagerModel>>
    = new BehaviorSubject<Array<PriceListProductManagerModel>>(
      [
        {
        productId: 2,
        renewalValue: '4',
        supportHours: '43',
        value: '324'
        }
      ]
  );
  constructor(private reqS: RequestService) { }
  getPriceLists(): Observable<Array<PriceListModel>> {
    return this.reqS.get<Array<PriceListModel>>(baseEndpoints.priceLists);
  }
  addProductToPriceListingProductManager(data: any): void {
    const d = [
      ...this.priceListProductManager.value,
    ];
    d.push(data);
    this.priceListProductManager.next(d);
  }
  removeProductToPriceListingProductManager(id: string | number): void {
    const dd = this.priceListProductManager.value.filter(d => d.productId !== id);
    this.priceListProductManager.next(dd);
  }
  getpriceListProductManagerState(): Observable<Array<PriceListProductManagerModel>> {
    return this.priceListProductManager.asObservable();
  }
}
