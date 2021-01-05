
import { Injectable } from '@angular/core';
import { optionEndpoints } from '../core/configs/endpoints';
import { RequestService } from '../core/services/request/request.service';

@Injectable({
  providedIn: 'root'
})
export class LicenseServiceService {

  constructor(private reqS: RequestService) { }

  createOption(obj){
    return this.reqS.post(optionEndpoints.createOption,obj)
  }
  updateOption(id, obj){
    return this.reqS.put(optionEndpoints.getOptions +'/'+id,obj)
  }
  getOption(){
    return this.reqS.get(optionEndpoints.getOptions)
  }
  deleteOption(id){
    return this.reqS.delete(optionEndpoints.getOptions +'/'+id)
  }
}
