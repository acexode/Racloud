import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PriceListService } from 'src/app/core/services/price-list/price-list.service';
import { ProductServiceService } from 'src/app/products/product-service.service';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';
import { PriceListModel } from '../models/price-list-model';

@Component({
  selector: 'app-create-price-lists',
  templateUrl: './create-price-lists.component.html',
  styleUrls: ['./create-price-lists.component.scss']
})
export class CreatePriceListsComponent implements OnInit, OnDestroy {
  createPriceList$: Subscription;
  product$: Subscription;
  constructor(
    private priceListS: PriceListService,
    private msgS: MessagesService,
    private router: Router,
    private productS: ProductServiceService,
  ) {}
  ngOnInit(): void {
    this.product$ = this.productS.getProducts().subscribe(
      res => {
        this.priceListS.products.next(res);
      },
      _err => {
        this.msgS.addMessage({
          text: 'unable to load products at this time. Please refresh your browser',
          type: 'danger',
          dismissible: true,
          customClass: 'mt-32',
          hasIcon: true,
        });
      },
    );
  }
  saveData(data: any) {
    this.createPriceList$ = this.priceListS.createPriceList(data).subscribe(
      (_res: PriceListModel) => {
        this.msgS.addMessage({
          text: 'Pricelist created Successfully',
          type: 'success',
          dismissible: true,
          customClass: 'mt-32',
          hasIcon: true,
          timeout: 5000,
        });
        this.priceListS.updateButtonLoadingStatus(true);
        this.router.navigateByUrl('/price-lists');
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
        this.priceListS.updateButtonLoadingStatus(true);
      }
    );
  }
  ngOnDestroy(): void {
    if (this.createPriceList$) {
      this.createPriceList$.unsubscribe();
    }
  }
}
