import { Injectable } from '@angular/core';
import { userEndpoints, roleEndpoints, customersEndpoints } from '../core/configs/endpoints';
import { RequestService } from '../core/services/request/request.service';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { CustomStorageService } from '../core/services/custom-storage/custom-storage.service';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { UserPagePermissions, UserPagePermissionsModel } from '../core/permission/user/user.page.permission.interface';
import { UserProfileUpdateModel } from './models/update-user-model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  initialState: UserPagePermissionsModel = {
    init: false,
    data: null,
  };
  pagePermissionData: BehaviorSubject<UserPagePermissionsModel> = new BehaviorSubject(
    this.initialState
  );

  constructor(private reqS: RequestService, private storeS: CustomStorageService) {
    // Load account state from local/session/cookie storage.
    this.storeS
      .getItem('pagePermission')
      .subscribe((data: UserPagePermissions) => {
        if (data !== null) {
          this.pagePermissionData.next({
            init: true,
            data,
          });
        } else {
          this.pagePermissionData.next({ ...this.initialState, ...{ init: true } });
        }
      });
  }

  createUser(obj) {
    return this.reqS.post(userEndpoints.getCreateUpdateUser, obj);
  }
  updateUser(id: string, obj: any) {
    return this.reqS.put(userEndpoints.getCreateUpdateUser + '/' + id, obj);
  }
  getRoles() {
    const roles = this.reqS.get(roleEndpoints.getRoles);
    // const companies = this.reqS.get(customersEndpoints.getCustomers);
    // return forkJoin([roles, companies]);
    return roles;
  }
  getUsers() {
    return this.reqS.get(userEndpoints.getUsers);
  }
  getUser(id) {
    return this.reqS.get(userEndpoints.getCreateUpdateUser + '/' + id);
  }
  deleteUser(id) {
    return this.reqS.delete(userEndpoints.getCreateUpdateUser + '/' + id);
  }
  getUserPermissionsPerPage(): Observable<UserPagePermissions> {
    return this.reqS.get<UserPagePermissions>(userEndpoints.userPermissionPerPage).pipe(
      switchMap((val) => {
        return this.processUserPermissionResponse(val);
      })
    );
  }
  processUserPermissionResponse(data: UserPagePermissions) {
    return this.storeS.setItem('pagePermission', data).pipe(
      tap((d) => {
        this.pagePermissionData.next({
          init: true,
          data: d,
        });
      }),
    );
  }
  getUserPagePermissions(): Observable<any> {
    return this.pagePermissionData.pipe(
      filter((val: UserPagePermissionsModel) => val && val.hasOwnProperty('init') && val.init),
      distinctUntilChanged(),
    );
  }
  clearUserPermission() {
    this.storeS.removeItem('pagePermission');
    this.pagePermissionData.next({ ...this.initialState, ...{ init: true } });
  }
  changePassword(obj) {
    return this.reqS.post(userEndpoints.changePassword, obj);
  }
  changePasswordAdmin(obj) {
    return this.reqS.post(userEndpoints.changePasswordAdmin, obj);
  }
  sendResetPassword(obj) {
    return this.reqS.post(userEndpoints.sendResetPassword, obj);
  }
  resetPassword(obj) {
    return this.reqS.post(userEndpoints.resetPassword, obj);
  }
  impersonate(obj) {
    return this.reqS.post(userEndpoints.impersonate, obj);
  }
  stopImpersonate(obj) {
    return this.reqS.post(userEndpoints.stopImpersonate, obj);
  }
  getUserProfile() {
    return this.reqS.get(userEndpoints.profile);
  }
  updateUserProfile(data: UserProfileUpdateModel) {
    return this.reqS.put<UserProfileUpdateModel>(userEndpoints.updateProfile, data);
  }
}
