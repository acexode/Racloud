import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseEndpoints } from '../../configs/endpoints';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(private reqS: RequestService) { }
  getCountries(): Observable<any> {
    return this.reqS.get(baseEndpoints.countries);
  }
}
