import { Injectable } from '@angular/core';
import { orderEndpoints, shopEndpoints } from '../core/configs/endpoints';
import { RequestService } from '../core/services/request/request.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private reqS: RequestService) { }

  generateOrder(){
    const obj = {
      "companyId": ""
    }
    return this.reqS.post(orderEndpoints.generateOrder, obj)
  }
  getSingleOrder(id){
    return this.reqS.get(orderEndpoints.getSingleOrder +'/' + id)
  }
  getorders(){
    return this.reqS.get(orderEndpoints.getOrders)
  }
  cancelOrder(id){
    return this.reqS.get(orderEndpoints.getOrders+'/' + id + '/cancel')
  }
  getShops(){
    return this.reqS.get(shopEndpoints.getShops)
  }
}
