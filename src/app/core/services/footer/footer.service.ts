import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  public templateStore: BehaviorSubject<
    Array<{
      id: string;
      tRef: TemplateRef<any>;
      tContext: any;
    }>
  > = new BehaviorSubject([]);

  constructor() {}

  addComponentToStore(id: string, template: TemplateRef<any>, context: any) {
    let currentValues = this.templateStore.value
      ? this.templateStore.value
      : [];
    if (currentValues) {
      const existing = currentValues.find((cv) => cv.id === id);
      if (existing) {
        existing.tRef = template;
        existing.tContext = context;
      } else {
        currentValues.push({
          id,
          tRef: template,
          tContext: context,
        });
      }
    } else {
      currentValues = [];
      currentValues.push({
        id,
        tRef: template,
        tContext: context,
      });
    }
    if (currentValues && currentValues.length) {
      this.templateStore.next(
        currentValues.map((v) => {
          return { ...v };
        })
      );
    }
  }

  removeComponentFromStore(id: string) {
    const currentValues = this.templateStore.value
      ? this.templateStore.value
      : [];
    if (currentValues) {
      const existingI = currentValues.findIndex((cv) => cv.id === id);
      if (existingI > -1) {
        currentValues.splice(existingI, 1);
        this.templateStore.next(
          currentValues.map((v) => {
            return { ...v };
          })
        );
      }
    }
  }
}
