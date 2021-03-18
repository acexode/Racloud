import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerModel } from 'src/app/customer/model/customer.model';
import { baseEndpoints, customersEndpoints } from '../../configs/endpoints';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private reqS: RequestService) {
  }
  getCustomers(): Observable<any> {
    return this.reqS.get<Array<CustomerModel>>(baseEndpoints.allCustomers);
  }
  getCustomerCustomers(id: any): Observable<any> {
    return this.reqS.get<Array<CustomerModel>>(baseEndpoints.allCustomers + '?customerId='+ id);
  }
  disableCustomer(id: number) {
    const customerDisapbleEndpoint = `${ baseEndpoints.customers }/${ id }/disable-customer`;
    return this.reqS.put<any>(customerDisapbleEndpoint, { id });
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
  getCustomerProfile(): Observable<CustomerModel> {
    return this.reqS.get<CustomerModel>(customersEndpoints.profile);
  }
}
