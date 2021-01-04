import { optionEndpoints } from './../core/configs/endpoints';
import { Injectable } from '@angular/core';
import { RequestService } from '../core/services/request/request.service';

@Injectable({
  providedIn: 'root'
})
export class LicenseServiceService {

  constructor(private reqS: RequestService) { }

  createOption(obj){
    return this.reqS.post(optionEndpoints.createOption,obj)
  }
  getOption(){
    return this.reqS.get(optionEndpoints.getOptions)
  }
  deleteOption(id){
    return this.reqS.delete(optionEndpoints.getOptions +'/'+id)
  }
}
