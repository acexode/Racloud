import { LicenseEditComponent } from './license-edit/license-edit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LicensesListingComponent } from './licenses-listing/licenses-listing.component';


const routes: Routes = [
  {
    path: '',
    component: LicensesListingComponent,
    data: { title: 'Licenses' }
  },
  {
    path: 'license-edit',
    component: LicenseEditComponent,
    data: { title: 'Licenses' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicenseRoutingModule { }
