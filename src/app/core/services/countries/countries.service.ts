import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, switchMap, filter, distinctUntilChanged } from 'rxjs/operators';
import { baseEndpoints } from '../../configs/endpoints';
import { CountriesModel, CountryData } from '../../models/countries-model';
import { CustomStorageService } from '../custom-storage/custom-storage.service';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  initialState: CountriesModel = {
    init: false,
    data: null,
  };
  countriesData: BehaviorSubject<CountriesModel> = new BehaviorSubject(
    this.initialState
  );

  constructor(private reqS: RequestService, private storeS: CustomStorageService,) {
    // Load account state from local/session/cookie storage.
    this.storeS
      .getItem('countries')
      .subscribe((countries: Array<CountryData>) => {
        if (countries !== null) {
          this.countriesData.next({
            init: true,
            data: [
              ...countries
              ]
          });
        } else {
          this.countriesData.next({ ...this.initialState, ...{ init: true } });
        }
      });
  }
  processCountriesWebServiceResponse(countries: Array<CountryData>) {
    return this.storeS.setItem('countries', countries).pipe(
      tap(() => {
        this.countriesData.next({
          init: true,
          data: [
            ...countries
          ]
        });
      }),
      map((v) => countries)
    );
  }
  getCountries(): Observable<any> {
    return this.reqS.get(baseEndpoints.countries);
  }
  getCountriesState() {
    return this.countriesData.pipe(
      filter((val: CountriesModel) => val && val.hasOwnProperty('init') && val.init),
      distinctUntilChanged()
    );
  }
  loadCountries(): Observable<any> {
    return this.getCountries().pipe(
      switchMap((val) => {
        return this.processCountriesWebServiceResponse(val);
      })
    );
  }
}
