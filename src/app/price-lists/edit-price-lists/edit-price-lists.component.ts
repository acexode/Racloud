import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { get } from 'lodash';
import { Subscription } from 'rxjs';
import { PriceListService } from 'src/app/core/services/price-list/price-list.service';
import { ProductServiceService } from 'src/app/products/product-service.service';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';
import { PriceListModel } from '../models/price-list-model';
import { ProductPrices } from '../models/product-prices-model';

@Component({
  selector: 'app-edit-price-lists',
  templateUrl: './edit-price-lists.component.html',
  styleUrls: ['./edit-price-lists.component.scss']
})
export class EditPriceListsComponent implements OnInit, OnDestroy {
  route$: Subscription;
  fetch$: Subscription;
  updatePriceList$: Subscription;
  requestedData: PriceListModel;
  priceListId: any = null;
  constructor(
    private route: ActivatedRoute,
    private priceListS: PriceListService,
    private cdref: ChangeDetectorRef,
    private msgS: MessagesService,
  ) {
    this.priceListS.loadProductsForPriceListing();
  }

  ngOnInit(): void {
    this.route$ = this.route.paramMap.subscribe(
      params => {
        this.priceListId = params.get('id');
        this.fetch$ = this.priceListS.getPriceList(this.priceListId).subscribe(
          (res: PriceListModel) => {
            const productLists: Array<PriceListModel> = get(res, 'productPrices', []);
            this.pushResponseDataProductIntoPriceLisitingProductManager(productLists);
            this.requestedData = res;
          },
          _err => {
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
  pushResponseDataProductIntoPriceLisitingProductManager(productLists: Array<ProductPrices>) {
    if (productLists.length > 0) {
      for (const productList of productLists) {
        this.priceListS.addProductToPriceListingProductManager(productList);
      }
    }
  }
  updateData(data: any) {
    console.log(data);
    const eData = {
      ...data,
      id: this.priceListId,
    };
    this.updatePriceList$ = this.priceListS.updatePriceList(this.priceListId, eData).subscribe(
      (_res: PriceListModel) => {
        this.msgS.addMessage({
          text: 'Pricelist created Successfully',
          type: 'success',
          dismissible: true,
          customClass: 'mt-32',
          hasIcon: true,
          timeout: 5000,
        });
        this.priceListS.updateButtonLoadingStatus(false);
      },
      err => {
        const msgErr = typeof err.error !== 'string'
          ? (err?.error?.currency || 'Error while trying to update price list')
          : (err.error || 'Please check your network');
        this.msgS.addMessage({
          text: msgErr,
          type: 'danger',
          dismissible: true,
          customClass: 'mt-32',
          hasIcon: true,
        });
        this.priceListS.updateButtonLoadingStatus(false);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.updatePriceList$) {
      this.updatePriceList$.unsubscribe();
    }
  }

}
