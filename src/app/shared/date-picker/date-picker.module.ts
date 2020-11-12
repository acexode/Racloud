import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { roLocaleCustom } from './data/roLocale';

defineLocale('ro', roLocaleCustom());

@NgModule({
  declarations: [],
  imports: [CommonModule, BsDatepickerModule.forRoot()],
  exports: [BsDatepickerModule],
})
export class OmnDatePickerModule {
  constructor(private localeService: BsLocaleService) {
    this.localeService.use('ro');
  }
}
