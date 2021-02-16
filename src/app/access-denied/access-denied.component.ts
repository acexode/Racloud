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
      if (pagePermissions.shops) {
        this.userPermissionTooLow = false;
      } else {
        this.userPermissionTooLow = true;
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
