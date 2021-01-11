import { ActivatedRoute, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { shopEndpoints } from '../core/configs/endpoints';
import { RequestService } from '../core/services/request/request.service';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  shopStore: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  buyStore: BehaviorSubject<any> = new BehaviorSubject({});
  constructor(private reqS: RequestService) {
    this.getShops();
  }

  getShops(){
    this.reqS.get(shopEndpoints.getShops).subscribe((e:[]) =>{
      this.shopStore.next(e);
    })
  }
  getSingleShop(){
    return this.reqS.get(shopEndpoints.getSingleShop)
  }
  buy(shop){    
    return this.buyStore.next(shop)

  }
}
