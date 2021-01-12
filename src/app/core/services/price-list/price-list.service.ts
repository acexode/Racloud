import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PriceListModel } from 'src/app/price-lists/models/price-list-model';
import { baseEndpoints } from '../../configs/endpoints';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  constructor(private reqS: RequestService) { }
  getPriceListings(): Observable<PriceListModel> {
    return this.reqS.get(baseEndpoints.priceLists);
  }
}
