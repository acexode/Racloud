
import { OptionListComponent } from './option-list/option-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OptionsRoutingModule } from './options-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ContainerModule } from '../shared/container/container.module';
import { RcFormsModule } from '../shared/rc-forms/rc-forms.module';
import { TableModule } from '../shared/table/table.module';
import { TabsModule } from '../shared/tabs/tabs.module';
import { OptionsAddEditComponent } from './options-add-edit/options-add-edit.component';


@NgModule({
  declarations: [OptionListComponent, OptionsAddEditComponent],
  imports: [
    CommonModule,
    CommonModule,
    ContainerModule,
    RcFormsModule,
    TableModule,
    TabsModule,
    AngularSvgIconModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    OptionsRoutingModule
  ]
})
export class OptionsModule { }
