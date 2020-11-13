import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
  CachedItem,
  DedicatedInstanceFactory,
  Driver,
  NgForage,
  NgForageCache,
} from 'ngforage';

@Injectable({
  providedIn: 'root',
})
export class CustomStorageService {
  private readonly ngf: NgForage;
  private readonly cache: NgForageCache;
  constructor(dif: DedicatedInstanceFactory) {
    const conf = {
      name: 'app-auth',
      driver: [
        // defaults to indexedDB -> webSQL -> localStorage
        Driver.INDEXED_DB,
        Driver.LOCAL_STORAGE,
      ],
    };
    this.ngf = dif.createNgForage(conf);
    this.cache = dif.createCache(conf);
  }

  public getItem<T = any>(key: string, ngf = this.ngf): Observable<T> {
    return from(ngf.getItem<T>(key));
  }

  public getCachedItem<T = any>(
    key: string,
    ngc = this.cache
  ): Observable<T | null> {
    return from(
      ngc.getCached<T>(key).then((r: CachedItem<T>) => {
        if (!r.hasData || r.expired) {
          return null;
        }
        return r.data;
      })
    );
  }
  public setItem<T = any>(key: string, data: T, ngf = this.ngf): Observable<T> {
    return from(ngf.setItem<T>(key, data));
  }

  public setCachedItem<T = any>(
    key: string,
    data: T,
    cacheTime?: number,
    ngc = this.cache
  ): Observable<T | null> {
    return from(ngc.setCached<T>(key, data, cacheTime));
  }

  public removeCached(key: string, ngc = this.cache) {
    ngc.removeCached(key);
  }

  public removeItem(key: string, s = this.ngf) {
    s.removeItem(key);
  }

  public keys(s = this.ngf): Observable<string[]> {
    return from(s.keys());
  }

  public clear(s = this.ngf): Observable<void> {
    return from(s.clear());
  }
}
