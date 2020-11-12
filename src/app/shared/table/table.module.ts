import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TableFilterComponent } from './component/table-filter/table-filter.component';
import { TableComponent } from './component/table/table.component';
import { TableService } from './services/table.service';

@NgModule({
  declarations: [TableComponent, TableFilterComponent],
  imports: [
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    AngularSvgIconModule,
    BsDatepickerModule,
  ],
  exports: [TableComponent],
  providers: [TableService],
})
export class TableModule {}
