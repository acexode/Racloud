import { Injectable } from '@angular/core';
import { orderEndpoints } from '../core/configs/endpoints';
import { RequestService } from '../core/services/request/request.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private reqS: RequestService) { }

  generateOrder(companyId){
    return this.reqS.post(orderEndpoints.generateOrder,companyId)
  }
  getSingleOrder(id){
    return this.reqS.get(orderEndpoints.getSingleOrder +'/'+id)
  }
  getorders(){
    return this.reqS.get(orderEndpoints.getOrders)
  }
}
