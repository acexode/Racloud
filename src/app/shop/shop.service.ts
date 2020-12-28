import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { shopEndpoints } from '../core/configs/endpoints';
import { RequestService } from '../core/services/request/request.service';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  shopStore: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  constructor(private reqS: RequestService) {
    this.getShops();
  }

  getShops(){
    this.reqS.get(shopEndpoints.getShops).subscribe((e:[]) =>{  
      this.shopStore.next(e);
    })
  }
}
