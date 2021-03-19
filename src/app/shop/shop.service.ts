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
  cartStore: BehaviorSubject<any> = new BehaviorSubject([]);
  cartId: BehaviorSubject<Boolean> = new BehaviorSubject(false);
  constructor(private reqS: RequestService) {
    this.getShops();
  }

  getShops(){
    this.reqS.get(shopEndpoints.getShops).subscribe((e:[]) =>{
      this.shopStore.next(e);
    })
  }
  getAllShops(){
    return this.reqS.get(shopEndpoints.getShops)
  }
  getSingleShop(){
    return this.reqS.get(shopEndpoints.getSingleShop)
  }
  buy(shop){
    return this.buyStore.next(shop)
  }
}
