import { Component } from '@angular/core';
import { AuthService } from './core/services/auth/auth.service';
import { TitleService } from './core/services/title/title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ra-cloud';
  account = this.authS.getAccountData();

  constructor(private authS: AuthService, private titleService: TitleService) {
    this.titleService.handleNavigationTitle();
  }
}
