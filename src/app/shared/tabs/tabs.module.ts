import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';
import { TabBarComponent } from './components/tab-bar/tab-bar.component';
import { TabButtonComponent } from './components/tab-button/tab-button.component';
import { RcFormsModule } from '../rc-forms/rc-forms.module';



@NgModule({
  declarations: [TabsComponent, TabBarComponent, TabButtonComponent],
  exports: [TabsComponent, TabBarComponent, TabButtonComponent],
  imports: [
    CommonModule,
    RcFormsModule
  ]
})
export class TabsModule { }
