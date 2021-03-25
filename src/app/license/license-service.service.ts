import { licenseEndpoints, customersEndpoints, optionEndpoints } from './../core/configs/endpoints';
import { Injectable } from '@angular/core';
import { RequestService } from '../core/services/request/request.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LicenseServiceService {
  optionStore: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  constructor(private reqS: RequestService) {
   }

  createOption(obj){
    return this.reqS.post(optionEndpoints.createOption,obj)
  }
  updateOption(id, obj){
    return this.reqS.put(optionEndpoints.getOptions +'/'+id,obj)
  }

  getOption(){
    return this.reqS.get(optionEndpoints.getOptions)
  }
  getAllOption(){
    return this.reqS.get(optionEndpoints.getOptions)
  }
  getLicenses(){
    return this.reqS.get(licenseEndpoints.getLicenses)
  }
  getCustomerLicenses(id){
    return this.reqS.get(licenseEndpoints.getCustomerLicenses + id)
  }
  getCompanyUsers(id){
    return this.reqS.get(customersEndpoints.getCompanyUsers + id +'/users')
  }
  getOwnLicenses(){
    return this.reqS.get(licenseEndpoints.getOwnLicenses)
  }
  createLicenses(obj){
    return this.reqS.post(licenseEndpoints.createLicense, obj);
  }
  getOneLicense(id){
    return this.reqS.get(licenseEndpoints.getOneLicense + id)
  }
  updateLicense(id,obj){
    return this.reqS.put(licenseEndpoints.getOneLicense + id, obj)
  }
  deleteOption(id){
    return this.reqS.delete(optionEndpoints.getOptions +'/'+id)
  }
  isOptionInUse(id){
    return this.reqS.get(optionEndpoints.isOptionInUse + id)
  }
}
