import { Injectable } from '@angular/core';
import { orderEndpoints, shopEndpoints, customersEndpoints } from '../core/configs/endpoints';
import { RequestService } from '../core/services/request/request.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private reqS: RequestService) { }

  generateOrder(){
    const obj = {
      companyId: ''
    }
    return this.reqS.post(orderEndpoints.generateOrder, obj)
  }
  getSingleOrder(id){
    return this.reqS.get(orderEndpoints.getSingleOrder +'/' + id)
  }
  getorders(){
    return this.reqS.get(orderEndpoints.getOrders)
  }
  getcustomers(){
    return this.reqS.get(customersEndpoints.getCustomers)
  }
  cancelOrder(id){
    return this.reqS.get(orderEndpoints.getOrders+'/' + id + '/cancel')
  }
  addOrderToCart(id,obj){
    return this.reqS.put(orderEndpoints.addToCart + id,obj)
  }
  reduceCartItem(id,obj){
    return this.reqS.put(orderEndpoints.reduceCartItem + id,obj)
  }
  deleteCartItem(id,obj){
    return this.reqS.put(orderEndpoints.deleteCartItem + id,obj)
  }
  getShops(){
    return this.reqS.get(shopEndpoints.getShops)
  }
}
