import { productEndpoints } from './../core/configs/endpoints';
import { Injectable } from '@angular/core';
import { RequestService } from '../core/services/request/request.service';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  constructor(private reqS: RequestService) { }

  getProducts(){
    return this.reqS.get(productEndpoints.getProducts)
  }
  createProducts(product){
    return this.reqS.post(productEndpoints.createProduct, product)
  }
}
