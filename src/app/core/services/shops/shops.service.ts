import { RequestService } from './../request/request.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {
  buyStore: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  constructor(private reqS: RequestService) { }

  getShops(){
    return this.reqS.get('./assets/shops.json')
  }
  buy(shop){
    this.buyStore.next(shop)
  }
}
