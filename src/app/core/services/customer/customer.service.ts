import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomerModel } from 'src/app/customer/model/customer.model';
import { baseEndpoints } from '../../configs/endpoints';
import { CountriesService } from '../countries/countries.service';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private reqS: RequestService) {
  }
  getCustomers(): Observable<any> {
    return this.reqS.get<Array<CustomerModel>>(baseEndpoints.customers);
  }
  disableCustomers(id: number | string) {
    const d = {
      id,
    };
    const customerDisapbleEndpoint = baseEndpoints.customers + '/' + id + '/disable-customer';
    return this.reqS.put<any>(customerDisapbleEndpoint, d);
  }
  getCustomerById(id: any): Observable<CustomerModel> {
    const queryEndpoint = `${ baseEndpoints.customers }/${ id }`;
    return this.reqS.get<CustomerModel>(queryEndpoint);
  }
  getCustomerUsers(id: any): Observable<Array<CustomerModel>> {
    const queryEndpoint = `${ baseEndpoints.customers }/${ id }/users`;
    return this.reqS.get<Array<CustomerModel>>(queryEndpoint);
  }
  updateCustomerData(id: any, data: any): Observable<CustomerModel> {
    const queryEndpoint = `${ baseEndpoints.customers }/${ id }`;
    return this.reqS.put<CustomerModel>(queryEndpoint, data);
  }
}
