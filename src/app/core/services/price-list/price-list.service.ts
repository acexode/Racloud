import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreatePriceListModel } from 'src/app/price-lists/models/create-price-list-model';
import { PriceListModel } from 'src/app/price-lists/models/price-list-model';
import { baseEndpoints } from '../../configs/endpoints';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  toCreateData: BehaviorSubject<CreatePriceListModel> = new BehaviorSubject<CreatePriceListModel>({});
  constructor(private reqS: RequestService) { }
  getPriceLists(): Observable<Array<PriceListModel>> {
    return this.reqS.get<Array<PriceListModel>>(baseEndpoints.priceLists);
  }
}
