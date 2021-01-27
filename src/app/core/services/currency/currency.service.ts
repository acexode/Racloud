import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  appUsedcurrencies = [
    {
      code: 'EUR',
      name: 'Euro',
      name_plural: 'euros',
      symbol: '€',
      symbol_native: '€',
      decimal_digits: 2,
      rounding: 0
    },
    {
      code: 'USD',
      name: 'US Dollar',
      name_plural: 'US dollars',
      symbol: '$',
      symbol_native: '$',
      decimal_digits: 2,
      rounding: 0
    },
    {
      code: 'CAD',
      name: 'Canadian Dollar',
      name_plural: 'Canadian dollars',
      symbol: 'CA$',
      symbol_native: '$',
      decimal_digits: 2,
      rounding: 0
    },
    {
      code: 'GBP',
      name: 'British Pound Sterling',
      name_plural: 'British pounds sterling',
      symbol: '£',
      symbol_native: '£',
      decimal_digits: 2,
      rounding: 0
    },
    {
      code: 'CHF',
      name: 'Swiss Franc',
      name_plural: 'Swiss francs',
      symbol: 'CHF',
      symbol_native: 'CHF',
      decimal_digits: 2,
      rounding: 0
    },
    {
      code: 'JPY',
      name: 'Japanese Yen',
      name_plural: 'Japanese yen',
      symbol: '¥',
      symbol_native: '￥',
      decimal_digits: 0,
      rounding: 0
    },
  ];
  constructor() { }
  getCurrencies(): Observable<any> {
    return of(this.appUsedcurrencies).pipe(
      map(v => {
        return v.map(currency => {
          return {
            ...currency,
            name: `${ currency.name } - (${ currency.code })`,
          };
        });
      })
    );
  }
}
