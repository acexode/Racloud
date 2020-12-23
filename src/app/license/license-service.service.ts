import { licenseEndpoints } from './../core/configs/endpoints';

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
  getOption(){
    return this.reqS.get(optionEndpoints.getOptions)
  }
  getLicenses(){
    return this.reqS.get(licenseEndpoints.getLicenses)
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
}
