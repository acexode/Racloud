import { OptionsAddEditComponent } from './options-add-edit/options-add-edit.component';
import { OptionListComponent } from './option-list/option-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: OptionListComponent,
    data: { title: 'Licenses' }
  },
  {
    path: 'option-add',
    component: OptionsAddEditComponent,
    data: { title: 'Licenses' }
  },
  {
    path: 'option-edit',
    component: OptionsAddEditComponent,
    data: { title: 'Licenses' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OptionsRoutingModule { }
