import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { get } from 'lodash';
import { Subscription } from 'rxjs';
import { customersEndpoints } from 'src/app/core/configs/endpoints';
import { RequestService } from 'src/app/core/services/request/request.service';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { CreateCustomer } from '../model/create-customer.model';
import { CustomerModel } from '../model/customer.model';
@Component({
  selector: 'app-edit-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit, OnDestroy {
  formEditMode = false;
  formButtonConfig: any = {
    buttonA: 'Save',
    buttonB: {
      name: 'Cancel',
      link: '/customer'
    }
  };
  isLoading = false;
  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/customer';
  containerConfig: PageContainerConfig = {
    closeButton: true,
    theme: 'transparent',
    shadow: false,
    panelClasses: {
      header: 'd-none',
      body: 'no-shadow',
    },
  };
  addCustomer$: Subscription;
  constructor(
    private reqS: RequestService,
    private msgS: MessagesService,
    private routerS: Router
  ) { }

  selectConfig(
    label: string,
    placeholder: string = 'Select',
    searchable: boolean = false,
    idKey: string = 'id',
    labelKey: string = 'option',
  ): SelectConfig {
    return {
      selectLabel: {
        text: label,
      },
      placeholder,
      idKey,
      labelKey,
      searchable,
    };
  }
  inputConfig(
    label: string,
    type: string = 'text',
    placeholder: string = '',
    prefixIcon: boolean = false)
    : InputConfig {
    return {
      inputLabel: {
        text: label || '',
      },
      type: type || 'text',
      placeholder: placeholder || '',
      prefixIcon: prefixIcon || false,
    };
  }
  isLoadingStatus() {
    this.isLoading = !this.isLoading;
  }
  ngOnInit(): void { }
  submitData(data: CustomerModel) {
    const toSendData: CreateCustomer = {
      firstName: get(data, 'firstName', ''),
      lastName: get(data, 'lastName', ''),
      companyType: get(data, 'companyType', ''),
      companyEmail: get(data, 'email', ''),
      parentId: get(data, 'parentId', 0),
      companyName: get(data, 'companyName', ''),
      address: get(data, 'address', ''),
      country: get(data, 'country', null),
      language: get(data, 'language', null),
      phoneNumber: get(data, 'phoneNumber', 1234567890),
    };
    const priceListId: number = get(data, 'priceListId', 0);
    if (priceListId) {
      toSendData.priceListId = priceListId;
    }
    // loadingIndicator
    this.isLoadingStatus();
    const queryEndpoint = `${ customersEndpoints.addCustomer }`;
    this.addCustomer$ = this.reqS.post<CustomerModel>(queryEndpoint, toSendData).subscribe(
      res => {
        this.displayMsg('Sucessfully updated profile','success');
        // loadingIndicator
        this.isLoadingStatus();
        // redirect to login page
        this.routerS.navigateByUrl('/customer');
      },
      err => {
        console.log(err);
        this.displayMsg(err.error,'danger');
        // loadingIndicator
        this.isLoadingStatus();
      }
    );
  }
  displayMsg(msg, type){
    this.msgS.addMessage({
      text: msg,
      type,
      dismissible: true,
      customClass: 'mt-32',
      hasIcon: true,
    });
    setTimeout(()=> {
      this.msgS.clearMessages()
    },5000)
  }
  ngOnDestroy(): void { }


}
