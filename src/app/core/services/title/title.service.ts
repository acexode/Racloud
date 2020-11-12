import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { CustomRouterService } from '../custom-router/custom-router.service';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  baseTitle = 'Omniasig';
  initTitle = '';
  titleStore: BehaviorSubject<string> = new BehaviorSubject(this.initTitle);

  constructor(
    private titleService: Title,
    private routerS: CustomRouterService,
    private aRoute: ActivatedRoute
  ) {
    this.titleStore
      .pipe(distinctUntilChanged())
      .subscribe((title) =>
        this.titleService.setTitle(this.baseTitle + ' | ' + title)
      );
  }

  handleNavigationTitle() {
    return this.routerS
      .getNavigationEndEvent()
      .pipe(
        map(() => {
          let titleVal = this.routerS.processChildData(this.aRoute, 'title');
          if (titleVal) {
            const replacements = titleVal.match(/({{\w+}})/g);
            if (replacements && replacements.length) {
              replacements.forEach((rep) => {
                const rstr = rep.replace(/{{|}}/g, '');
                if (rstr) {
                  const paramReplacement = this.routerS.processChildParams(
                    this.aRoute,
                    rstr
                  );
                  if (paramReplacement) {
                    titleVal = titleVal.replace(rep, paramReplacement);
                  } else {
                    titleVal = titleVal.replace(rep, '');
                  }
                }
              });
            }
          }
          this.titleStore.next(titleVal);
          return titleVal;
        })
      );
  }

  updateTitle(title: string) {
    this.titleStore.next(title);
  }

  getTitle() {
    return this.titleStore.getValue();
  }
}
