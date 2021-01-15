import { productEndpoints } from './../core/configs/endpoints';
import { Injectable } from '@angular/core';
import { RequestService } from '../core/services/request/request.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  modifiedOptionList = new BehaviorSubject<[]>([]);
  modifiedTableData: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(private reqS: RequestService) { }

  getProducts(){
    return this.reqS.get(productEndpoints.getProducts)
  }
  createProducts(product){
    return this.reqS.post(productEndpoints.createProduct, product)
  }
  updateProducts(id, product){
    return this.reqS.put(productEndpoints.updateProduct + id, product)
  }
  public get GetOptionList(): Observable<[]>{
    return this.modifiedOptionList.asObservable();
  }
  SetOptionList(data: []){
    this.modifiedOptionList.next(data);
  }
  modifiedDT(data: []){
    this.modifiedTableData.next(data);
  }
}
