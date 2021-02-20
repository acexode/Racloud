import { Component, OnDestroy, OnInit } from '@angular/core';
import { get } from 'lodash';
import { Subscription } from 'rxjs';
import { UserPagePermissionsModel } from '../core/permission/user/user.page.permission.interface';
import { AuthService } from '../core/services/auth/auth.service';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent implements OnInit, OnDestroy {
  getUserPagePermissions$: Subscription;
  bactToLink = '/shop';
  userPermissionTooLow = false;
  constructor(private userS: UsersService, private authS: AuthService) { }

  ngOnInit(): void {
    this.getUserPagePermissions$ = this.userS.getUserPagePermissions().subscribe((res: UserPagePermissionsModel) => {
      const pagePermissions = get(res, 'data', null);
      let redirectTo = null;
      for (const permission in pagePermissions) {
        if (pagePermissions[permission]) {
          redirectTo = `/${permission}`;
          break;
        }
      }
      if (typeof redirectTo === null) {
        this.userPermissionTooLow = true;
      } else {
        this.userPermissionTooLow = false;
        this.bactToLink = redirectTo;
      }

    });
  }
  userLogOut() {
    this.authS.logout();
  }
  ngOnDestroy(): void {
    this.getUserPagePermissions$.unsubscribe();
  }
}
