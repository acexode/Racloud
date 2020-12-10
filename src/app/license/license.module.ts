import { TabsModule } from './../shared/tabs/tabs.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LicenseRoutingModule } from './license-routing.module';
import { LicenseEditComponent } from './license-edit/license-edit.component';
import { LicensesListingComponent } from './licenses-listing/licenses-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CustomerRoutingModule } from '../customer/customer-routing.module';
import { ContainerModule } from '../shared/container/container.module';
import { RcFormsModule } from '../shared/rc-forms/rc-forms.module';
import { TableModule } from '../shared/table/table.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


@NgModule({
  declarations: [LicenseEditComponent, LicensesListingComponent],
  imports: [
    CommonModule,
    LicenseRoutingModule,
    CommonModule,
    CustomerRoutingModule,
    ContainerModule,
    RcFormsModule,
    TableModule,
    TabsModule,
    AngularSvgIconModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
  ]
})
export class LicenseModule { }
