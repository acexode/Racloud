import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseEndpoints } from '../../configs/endpoints';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyParentsService {

  constructor(private reqS: RequestService) { }
  getParents(): Observable<any> {
    return this.reqS.get(baseEndpoints.customerparent);
  }
}
