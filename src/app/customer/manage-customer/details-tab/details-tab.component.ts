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
@Component({
  selector: 'app-details-tab',
  templateUrl: './details-tab.component.html',
  styleUrls: ['./details-tab.component.scss']
})
export class DetailsTabComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  @Input() detailsData: any;
  textAreaConfig: TextAreaConfig = {
    textAreaLabel: {
      text: 'Address'
    },
    placeholder: ''
  };
  updateProfile$: Subscription;
  detailsId: any;
  constructor(
    private fb: FormBuilder,
    private reqS: RequestService,
    private msgS: MessagesService,
    private cdref: ChangeDetectorRef,
  ) { }
  ngOnInit(): void {
    // get details ID
    this.detailsId = get(this.detailsData, 'id', null);
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
  getUpdatedData(newData: any): Observable<any> {
    const queryEndpoint = `${ baseEndpoints.customers }/${ this.detailsId }`;
    return this.reqS.put(queryEndpoint, newData);
  }
  updateProfile(data: any): void {
    // loadingIndicator
    this.isLoadingStatus();
    console.log('called', this.isLoading, data);
    this.updateProfile$ = this.getUpdatedData(data).subscribe(
      res => {
        // sucessfully updated
        alert('Sucessfully updated profile');
        // stop loading
        this.isLoadingStatus();
      },
      err => {
        console.log(err);
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
