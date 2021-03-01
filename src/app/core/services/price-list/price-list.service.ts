import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { catchError, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { CompanyPriceList, CompanyPriceListData } from 'src/app/price-lists/models/company-pricelist-interface';
import { CreatePriceListModel } from 'src/app/price-lists/models/create-price-list-model';
import { PriceListModel } from 'src/app/price-lists/models/price-list-model';
import { PriceListProductManagerModel } from 'src/app/price-lists/models/price-list-product-manager.model';
import { ProductModel } from 'src/app/products/models/products.model';
import { baseEndpoints, priceListEndpoints } from '../../configs/endpoints';
import { uuid } from '../../helpers/uuid';
import { CustomStorageService } from '../custom-storage/custom-storage.service';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {
  priceListProductManager: BehaviorSubject<Array<PriceListProductManagerModel>>
    = new BehaviorSubject<Array<PriceListProductManagerModel>>(
      []
    );
  toEditPriceListProductManager: BehaviorSubject<PriceListProductManagerModel>
    = new BehaviorSubject<PriceListProductManagerModel>(null);
  product$: Subscription;
  products: BehaviorSubject<Array<ProductModel>> = new BehaviorSubject<Array<ProductModel>>(null);
  buttonLoadingStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  initialState: CompanyPriceList = {
    init: false,
    data: null,
  };
  companyPriceList: BehaviorSubject<CompanyPriceList> = new BehaviorSubject(
    this.initialState
  );

  constructor(
    private reqS: RequestService, private storeS: CustomStorageService
  ) {
    // Load account state from local/session/cookie storage.
    this.storeS
      .getItem('companyPricelist')
      .subscribe((data: CompanyPriceListData) => {
        if (data !== null) {
          this.companyPriceList.next({
            init: true,
            data,
          });
        } else {
          this.companyPriceList.next({ ...this.initialState, ...{ init: true } });
        }
      });
  }
  getPriceLists(): Observable<Array<PriceListModel>> {
    return this.reqS.get<Array<PriceListModel>>(baseEndpoints.priceLists);
  }
  getPriceList(id: any): Observable<PriceListModel> {
    const query = `${ baseEndpoints.priceLists }/${ id }`;
    return this.reqS.get<PriceListModel>(query);
  }
  deletePriceList(id: any): Observable<PriceListModel> {
    const query = `${ baseEndpoints.priceLists }/${ id }`;
    return this.reqS.delete<PriceListModel>(query);
  }
  updatePriceList(id: any, data: PriceListModel): Observable<PriceListModel> {
    const query = `${ baseEndpoints.priceLists }/${ id }`;
    return this.reqS.put<PriceListModel>(query, data);
  }
  createPriceList(data: CreatePriceListModel): Observable<PriceListModel> {
    return this.reqS.post<PriceListModel>(priceListEndpoints.create, data);
  }
  addProductToPriceListingProductManager(data: any): void {
    if (this.products.value) {
      const prod = this.products.value.find((p: ProductModel) => p.id === data.productId);
      const nD: PriceListProductManagerModel = {
        ...data,
        uuid: uuid(),
        application: prod.application.name,
        product: prod.name,
        productType: prod.productType,
      };
      const d = [
        ...this.priceListProductManager.value,
        {
          // id: uuid(),
          ...nD
        }
      ];
      this.priceListProductManager.next(d);
    } else {
      this.priceListProductManager.next([]);
    }

  }
  removeProductToPriceListingProductManager(id: string | number): void {
    const dd = this.priceListProductManager.value.filter(d => d.id !== id);
    this.priceListProductManager.next(dd);
  }
  toEditProductToPriceListingProductManager(data: any): void {
    this.toEditPriceListProductManager.next(data);
  }
  updateProductToPriceListingProductManager(data: any): void {
    const d = [...this.priceListProductManager.value];
    // perform deep find Index
    const prodIndex = d.findIndex(dd => dd.uuid === data.uuid);
    d[prodIndex] = data;
    this.priceListProductManager.next(d);
  }
  nullEditState(): void {
    this.toEditPriceListProductManager.next(null);
  }
  nullProductState(): void {
    this.priceListProductManager.next([]);
  }
  getpriceListProductManagerState(): Observable<Array<PriceListProductManagerModel>> {
    return this.priceListProductManager.asObservable();
  }
  getEdittablePriceListProductManagerState(): Observable<PriceListProductManagerModel> {
    return this.toEditPriceListProductManager.asObservable();
  }
  getProductsForPriceListing(): Observable<Array<ProductModel>> {
    return this.products.asObservable();
  }
  getLoadingButtonStatus(): Observable<boolean> {
    return this.buttonLoadingStatus.asObservable();
  }
  updateButtonLoadingStatus(d: boolean): void {
    this.buttonLoadingStatus.next(d);
  }
  getCompanyPriceList(id: any): Observable<CompanyPriceListData> {
    return this.reqS.get<CompanyPriceListData>(`${ priceListEndpoints.currency }/${ id }`).pipe(
      switchMap((val) => {
        return this.processCompanyPriceListing(val ? val : null);
      }),
      catchError(_err => {
        return of(null);
      }),
    );
  }
  processCompanyPriceListing(data: CompanyPriceListData) {
    return this.storeS.setItem('companyPricelist', data).pipe(
      tap((d) => {
        this.companyPriceList.next({
          init: true,
          data: d,
        });
      }),
    );
  }
  getCompanyPriceListNow(): Observable<any> {
    return this.companyPriceList.pipe(
      filter((val: any) => val && val.hasOwnProperty('init') && val.init),
      distinctUntilChanged(),
    );
  }
  clearCompanyPriceLisiting() {
    this.storeS.removeItem('companyPricelist');
    this.companyPriceList.next({ ...this.initialState, ...{ init: true } });
  }
}
