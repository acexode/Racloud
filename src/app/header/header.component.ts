import { Router } from '@angular/router';
import { RequestService } from './../core/services/request/request.service';
import { userEndpoints } from './../core/configs/endpoints';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { TitleService } from '../core/services/title/title.service';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  raLogoType = 'group2';
  pageTitle$ = this.titleService.titleStore;
  user;
  company;
  constructor(
    private titleService: TitleService,
    private authS: AuthService,
    private userS: UsersService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.authS.getAccountData().subscribe(e => {
      const token = this.authS.getDecodedAccessToken(e);
      this.userS.getUser(token.id).subscribe((user: any) => {
        this.user = user.user;
        this.company = user.company;
      });
    });
  }
  navigate(id, route) {
    if (route === 'user') {
      this.router.navigate(['users/edit-user', { id }]);
    } else if (route === 'company') {
      this.router.navigate(['customer/manage', id]);
    } else {
      return null;
    }
  }

  userLogOut() {
    this.authS.logout();
  }

}
