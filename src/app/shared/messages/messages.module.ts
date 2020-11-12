import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { MessagesComponent } from './components/messages/messages.component';

@NgModule({
  declarations: [MessagesComponent],
  imports: [CommonModule, AlertModule.forRoot()],
  exports: [MessagesComponent],
})
export class MessagesModule {}
