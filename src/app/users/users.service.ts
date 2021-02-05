import { Injectable } from '@angular/core';
import { userEndpoints, roleEndpoints,customersEndpoints } from '../core/configs/endpoints';
import { RequestService } from '../core/services/request/request.service';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private reqS: RequestService) { }

  createUser(obj){
    return this.reqS.post(userEndpoints.getCreateUpdateUser,obj)
  }
  updateUser(id, obj){
    return this.reqS.put(userEndpoints.getCreateUpdateUser +'/'+id,obj)
  }
  getRoles(){
    const roles = this.reqS.get(roleEndpoints.getRoles);
    const companies = this.reqS.get(customersEndpoints.getCustomers);
    return forkJoin([roles, companies])
  }
  getUsers(){
    return this.reqS.get(userEndpoints.getUsers)
  }
  getUser(id){
    return this.reqS.get(userEndpoints.getCreateUpdateUser +'/'+id)
  }
  deleteUser(id){
    return this.reqS.delete(userEndpoints.getCreateUpdateUser +'/'+id)
  }
}
