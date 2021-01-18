import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PriceListService } from 'src/app/core/services/price-list/price-list.service';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';
import { PriceListModel } from '../models/price-list-model';

@Component({
  selector: 'app-edit-price-lists',
  templateUrl: './edit-price-lists.component.html',
  styleUrls: ['./edit-price-lists.component.scss']
})
export class EditPriceListsComponent implements OnInit {
  route$: Subscription;
  fetch$: Subscription;
  requestedData: PriceListModel;
  constructor(
    private route: ActivatedRoute,
    private priceListS: PriceListService,
    private cdref: ChangeDetectorRef,
    private msgS: MessagesService,
    ) { }

  ngOnInit(): void {
    this.route$ = this.route.paramMap.subscribe(
      params => {
        const id: any = params.get('id');
        this.fetch$ = this.priceListS.getPriceList(id).subscribe(
          (res: PriceListModel) => {
            console.log(res);
            this.requestedData = res;
          },
          err => {
            this.msgS.addMessage({
              text: 'Unable to get customer Data at this current time please check your newtowrk and try again.',
              type: 'danger',
              dismissible: true,
              customClass: 'mt-32',
              hasIcon: true
            });
          }
        );
      }
    );
    this.cdref.markForCheck();
  }

}
