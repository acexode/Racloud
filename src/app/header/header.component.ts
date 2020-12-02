import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { TitleService } from '../core/services/title/title.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  raLogoType = 'group2';
  pageTitle$ = this.titleService.titleStore;
  constructor(
    private titleService: TitleService,
    private authS: AuthService,
  ) {}

  ngOnInit(): void {
  }

  userLogOut() {
    this.authS.logout();
  }

}
