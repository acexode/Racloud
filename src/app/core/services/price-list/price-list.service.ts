import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PriceListModel } from 'src/app/price-lists/models/price-list-model';
import { PriceListProductManagerModel } from 'src/app/price-lists/models/price-list-product-manager.model';
import { baseEndpoints } from '../../configs/endpoints';
import { uuid } from '../../helpers/uuid';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  priceListProductManager: BehaviorSubject<Array<PriceListProductManagerModel>>
    = new BehaviorSubject<Array<PriceListProductManagerModel>>(
      []
    );
  toEditPriceListProductManager: BehaviorSubject<PriceListProductManagerModel>
    = new BehaviorSubject<PriceListProductManagerModel>(null);
  constructor(private reqS: RequestService) { }
  getPriceLists(): Observable<Array<PriceListModel>> {
    return this.reqS.get<Array<PriceListModel>>(baseEndpoints.priceLists);
  }
  addProductToPriceListingProductManager(data: any): void {
    const d = [
      ...this.priceListProductManager.value,
      {
        id: uuid(),
        ...data
      }
    ];
    console.log(d);
    this.priceListProductManager.next(d);
  }
  removeProductToPriceListingProductManager(id: string | number): void {
    const dd = this.priceListProductManager.value.filter(d => d.id !== id);
    this.priceListProductManager.next(dd);
  }
  toEditProductToPriceListingProductManager(data: any): void {
    this.toEditPriceListProductManager.next(data);
  }
  updateProductToPriceListingProductManager(data: any): void {
    const d = [...this.priceListProductManager.value];
    // perform deep find Index
    const prodIndex = d.findIndex(dd => dd.id === data.id);
    d[prodIndex] = data;
    this.priceListProductManager.next(d);
  }
  nullEditState():void {
    this.toEditPriceListProductManager.next(null);
  }
  getpriceListProductManagerState(): Observable<Array<PriceListProductManagerModel>> {
    return this.priceListProductManager.asObservable();
  }
  getEdittablePriceListProductManagerState(): Observable<PriceListProductManagerModel> {
    return this.toEditPriceListProductManager.asObservable();
  }
}
