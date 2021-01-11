import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseEndpoints } from '../../configs/endpoints';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  constructor(private reqS: RequestService) { }
  getPriceLists(): Observable<any> {
    return this.reqS.get<any>(baseEndpoints.priceLists);
  }
}
