import { LoaderModule } from './../shared/loader/loader.module';
import { SharedModuleModule } from './../SharedModule/shared-module/shared-module.module';



import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { ContainerModule } from '../shared/container/container.module';
import { RcFormsModule } from '../shared/rc-forms/rc-forms.module';
import { TableModule } from '../shared/table/table.module';
import { TabsModule } from '../shared/tabs/tabs.module';

import { OptionsModule } from '../options/options.module';
import { CoreModule } from '../core/core.module';



@NgModule({
  declarations: [AddEditProductComponent],
  imports: [
    CommonModule,
    CommonModule,
    ContainerModule,
    RcFormsModule,
    TableModule,
    TabsModule,
    AngularSvgIconModule,
    FormsModule,
    SharedModuleModule,
    LoaderModule,
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    ProductsRoutingModule,
    OptionsModule,
    CoreModule
  ]
})
export class ProductsModule { }
