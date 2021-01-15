import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  currenciesJsonDataUrl = './assets/currencies.json';
  constructor(private reqS: RequestService) { }
  getCurrencies(): Observable<any> {
    return this.reqS.get(this.currenciesJsonDataUrl);
  }
}
