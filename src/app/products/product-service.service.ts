import { productEndpoints } from './../core/configs/endpoints';
import { Injectable } from '@angular/core';
import { RequestService } from '../core/services/request/request.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  displayAddProductModal: BehaviorSubject<boolean> = new BehaviorSubject(false);
  displayAddProductFormStepModal: BehaviorSubject<boolean> = new BehaviorSubject(false);
  modifiedOptionList = new BehaviorSubject<[]>([]);
  constructor(private reqS: RequestService) { }

  getProducts() {
    return this.reqS.get(productEndpoints.getProducts);
  }
  createProducts(product) {
    return this.reqS.post(productEndpoints.createProduct, product);
  }
  updateProducts(id, product) {
    return this.reqS.put(productEndpoints.updateProduct + id, product);
  }
  public get GetOptionList(): Observable<[]> {
    return this.modifiedOptionList.asObservable();
  }
  SetOptionList(data: []) {
    this.modifiedOptionList.next(data);
  }
  getAddProductModalDisplayStatus(): Observable<boolean> {
    return this.displayAddProductModal.asObservable();
  }
  openAddProductModal(): void {
    this.displayAddProductModal.next(true);
  }
  closeAddProductModal(): void {
    this.displayAddProductModal.next(false);
  }
  getAddProductFormStepModalDisplayStatus(): Observable<boolean> {
    return this.displayAddProductFormStepModal.asObservable();
  }
  openAddProductFormStepModal(): void {
    this.displayAddProductFormStepModal.next(true);
  }
  closeAddProductFormStepModal(): void {
    this.displayAddProductFormStepModal.next(false);
  }
}
