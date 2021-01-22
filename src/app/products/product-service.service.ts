import { productEndpoints,ApplicationEndpoints } from './../core/configs/endpoints';
import { Injectable } from '@angular/core';
import { RequestService } from '../core/services/request/request.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductModel } from './models/products.model';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  displayAddProductModal: BehaviorSubject<boolean> = new BehaviorSubject(false);
  displayAddProductFormStepModal: BehaviorSubject<boolean> = new BehaviorSubject(false);
  modifiedOptionList = new BehaviorSubject<[]>([]);
  modifiedTableData: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(private reqS: RequestService) { }

  getProducts(): Observable<Array<ProductModel>> {
    return this.reqS.get(productEndpoints.getProducts);
  }
  createProducts(product) {
    return this.reqS.post(productEndpoints.createProduct, product);
  }
  updateProducts(id, product) {
    return this.reqS.put(productEndpoints.updateProduct + id, product);
  }
  deleteProducts(id){
    return this.reqS.delete(productEndpoints.updateProduct + id)
  }
  public get GetOptionList(): Observable<[]>{
    return this.modifiedOptionList.asObservable();
  }
  SetOptionList(data: []) {
    this.modifiedOptionList.next(data);
  }
  modifiedDT(data: []){
    this.modifiedTableData.next(data);
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
  getApplications() {
    return this.reqS.get(ApplicationEndpoints.getApplications );
  }
  getSingleProduct(id) {
    return this.reqS.get(productEndpoints.updateProduct + id);
  }
  getSingleProductOption(id) {
    return this.reqS.get(productEndpoints.updateProduct + id + '/options');
  }
}
