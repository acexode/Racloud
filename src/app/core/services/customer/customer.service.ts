import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { baseEndpoints } from '../../configs/endpoints';
import { CountriesService } from '../countries/countries.service';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private reqS: RequestService) {
  }
  getCustomers() {
    return this.reqS.get<any>(baseEndpoints.customers);
  }
}
