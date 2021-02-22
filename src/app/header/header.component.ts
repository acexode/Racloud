import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomStorageService } from './../core/services/custom-storage/custom-storage.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { TitleService } from '../core/services/title/title.service';
import { UsersService } from '../users/users.service';
import { get } from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  raLogoType = 'group2';
  pageTitle$ = this.titleService.titleStore;
  user: any;
  impersonatorId: any;
  company: any;
  authS$: Subscription;
  constructor(
    private titleService: TitleService,
    private authS: AuthService,
    private userS: UsersService,
    private router: Router,
    private CStore: CustomStorageService,

  ) { }

  ngOnInit(): void {
    this.authS$ = this.authS.getAuthState().subscribe(e => {
      const account = get(e, 'account', null);
      this.company = get(account, 'company', null) || 'No company';
      const firstname = get(get(account, 'user', null), 'firstname', null) || 'firstname';
      const lastname = get(get(account, 'user', null), 'lastname', null) || 'lastname';
      this.impersonatorId = get(e, 'impersonatorId', null);
      this.user = {
        firstname,
        lastname,
      };
    });
    this.CStore.getItem('token').subscribe(e =>{
      this.impersonatorId = e.impersonatorId
    })
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
  stopImpersonation() {
    const obj = {
      impersonatorId: this.impersonatorId
    }
    this.userS.stopImpersonate(obj).subscribe((res: any) =>{
      this.CStore.getItem('oldToken').subscribe(e =>{
        const userInfo = e
        const newToken = {
          ...e,
          token: res.token,
          exp: res.expiration
        }
        const account = {
          username: userInfo.user.email,
          image: null,
          user: userInfo.user || null,
          company: userInfo.company,
          roles: userInfo.roles[0],
        };
        this.authS.authState.next({
          init: true,
          account,
          authToken: res.token,
          expiryDate: res.expiration || null,
        });
        this.CStore.setItem('token', newToken).subscribe(t =>{
          this.userS.getUserPermissionsPerPage();
          this.CStore.removeItem('oldToken')

        })
      })
    })
  }
  ngOnDestroy() {
    this.authS$.unsubscribe();
  }
}
