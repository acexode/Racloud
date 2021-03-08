import { SharedModuleModule } from './../SharedModule/shared-module/shared-module.module';
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
import { OptionsModule } from '../options/options.module';
import { LicenseOptionsComponent } from './license-options/license-options.component'


@NgModule({
  declarations: [LicenseEditComponent, LicensesListingComponent, LicenseOptionsComponent],
  imports: [
    CommonModule,
    LicenseRoutingModule,
    CommonModule,
    CustomerRoutingModule,
    ContainerModule,
    RcFormsModule,
    TableModule,
    SharedModuleModule,
    TabsModule,
    AngularSvgIconModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    OptionsModule
  ]
})
export class LicenseModule { }
