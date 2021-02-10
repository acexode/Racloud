import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { TextAreaConfig } from 'src/app/shared/rc-forms/models/textarea/textarea-config';
import { get } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { RequestService } from 'src/app/core/services/request/request.service';
import { baseEndpoints } from 'src/app/core/configs/endpoints';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';
import { CustomerModel } from '../../model/customer.model';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
@Component({
  selector: 'app-details-tab',
  templateUrl: './details-tab.component.html',
  styleUrls: ['./details-tab.component.scss']
})
export class DetailsTabComponent implements OnInit, OnDestroy {
  formEditMode = true;
  isLoading: boolean;
  @Input() detailsData
  @Input() fieldPermission
  textAreaConfig: TextAreaConfig = {
    textAreaLabel: {
      text: 'Address'
    },
    placeholder: ''
  };
  updateProfile$: Subscription;
  detailsId: any;
  formButtonConfig: any = {
    buttonA: 'Update profile',
    buttonB: {
      name: 'Renew Subscription',
      link: '/customer'
    }
  };
  constructor(
    private msgS: MessagesService,
    private cdref: ChangeDetectorRef,
    private customerS: CustomerService
  ) { }
  ngOnInit(): void {
    // get details ID    
    this.detailsId = get(this.detailsData.customer, 'id', null);
    this.isLoading = false;
    this.cdref.detectChanges();
  }
  isLoadingStatus() {
    this.isLoading = !this.isLoading;
  }
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
    prefixIcon: boolean = false,
    isDisabled: boolean = false,
  ): InputConfig {
    return {
      inputLabel: {
        text: label || '',
      },
      type: type || 'text',
      placeholder: placeholder || '',
      prefixIcon: prefixIcon || false,
      formStatus: {
        isDisabled,
      }
    };
  }
  updateProfile(data: any): void {
    const profileData = {
      ...data,
      id: this.detailsId,
    };
    // loadingIndicator
    this.isLoadingStatus();
    this.updateProfile$ = this.customerS.updateCustomerData(this.detailsId, profileData).subscribe(
      _res => {
        // sucessfully updated
        this.msgS.addMessage({
          text: 'Sucessfully updated profile',
          type: 'success',
          dismissible: true,
          timeout: 3000,
          customClass: 'mt-32',
          hasIcon: true
        });
        // stop loading
        this.isLoadingStatus();
      },
      err => {
        this.msgS.addMessage({
          text: err.error,
          type: 'danger',
          dismissible: true,
          customClass: 'mt-32',
          hasIcon: true
        });
        // stop loading
        this.isLoadingStatus();
      }
    );
  }
  ngOnDestroy(): void {
    if (this.updateProfile$) {
      this.updateProfile$.unsubscribe();
    }
  }
}
