import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {
  languageJsonDataUrl = './assets/languages.json';
  constructor(private reqS: RequestService) { }
  getLanguages() { 
    return this.reqS.get(this.languageJsonDataUrl).pipe(
      map(lang => {
        return Object.keys(lang).map((key: any) => {
          return {
            id: lang[key].name.toLowerCase(),
            option: lang[key].name.split(',')[0], // return only one from the comma seperate names
          };
        });
      }),
      // tap(d => console.log(d))
    );
  }
}
