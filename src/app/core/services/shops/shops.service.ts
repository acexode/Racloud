import { RequestService } from './../request/request.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {

  constructor(private reqS: RequestService) { }

  getShops(){
    return this.reqS.get('./assets/shops.json')
  }
}
