import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceListsRoutingModule } from './price-lists-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ContainerModule } from '../shared/container/container.module';
import { LoaderModule } from '../shared/loader/loader.module';
import { RcFormsModule } from '../shared/rc-forms/rc-forms.module';
import { TableModule } from '../shared/table/table.module';
import { TabsModule } from '../shared/tabs/tabs.module';
import { PriceListsComponent } from './price-lists.component';
import { CreatePriceListsComponent } from './create-price-lists/create-price-lists.component';
import { CardModule } from '../shared/card/card.module';
import { EditPriceListsComponent } from './edit-price-lists/edit-price-lists.component';
import { CreateEditPriceListComponent } from './component/create-edit/create-edit-price-list.component';


@NgModule({
  declarations: [PriceListsComponent, CreatePriceListsComponent, EditPriceListsComponent, CreateEditPriceListComponent],
  imports: [
    CommonModule,
    PriceListsRoutingModule,
    ContainerModule,
    RcFormsModule,
    TableModule,
    AngularSvgIconModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    LoaderModule,
    CardModule,
  ]
})
export class PriceListsModule { }
