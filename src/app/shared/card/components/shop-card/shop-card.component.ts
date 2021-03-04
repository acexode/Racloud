import { get } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { CardItem } from 'src/app/shared/rc-forms/models/card-item-model';
import { BehaviorSubject } from 'rxjs';
import { ShopService } from 'src/app/shop/shop.service';
import { OrderService } from 'src/app/orders/service.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CurrencyService } from 'src/app/core/services/currency/currency.service';
import { CustomStorageService } from 'src/app/core/services/custom-storage/custom-storage.service';
import { TokenInterface } from 'src/app/core/models/token.interface';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-shop-card',
  templateUrl: './shop-card.component.html',
  styleUrls: ['./shop-card.component.scss']
})
export class ShopCardComponent implements OnInit {
  @Input() item!: CardItem;
  companyId
  acronym;
  cardTypes = {
    wl: {
      initTitle: 'WL',
      productName: 'RA Workshop',
      productVersion: 'Lite',
      bgColor: 'rc-accent-blue-bg',
    },
    we: {
      initTitle: 'WE',
      productName: 'RA Workshop',
      productVersion: 'Express',
      bgColor: 'rc-accent-blue-bg',
    },
    wp: {
      initTitle: 'WP',
      productName: 'RA Workshop',
      productVersion: 'Professional',
      bgColor: 'rc-accent-blue-bg',
    },
    cnc: {
      initTitle: 'CNC',
      productName: 'RA Workshop',
      productVersion: 'CNC Add-on',
      bgColor: 'rc-accent-blue-bg',
    },
    wcs: {
      initTitle: 'WCS',
      productName: 'RA Workshop',
      productVersion: 'Client Server',
      bgColor: 'rc-accent-blue-bg',
    },
    shp: {
      initTitle: 'WCS',
      productName: 'RA Workshop',
      productVersion: '12 Support hours pack',
      bgColor: 'rc-accent-blue-160-bg',
    },
    pn: {
      initTitle: 'PN',
      productName: '',
      productVersion: '',
      bgColor: 'rc-grey-bg',
    },
    etc: {
      initTitle: 'ETC',
      productName: '',
      productVersion: '',
      bgColor: 'rc-black-bg',
    },
  };
  constructor(
    private orderS: OrderService,
    private route: ActivatedRoute,
    private currencyS: CurrencyService,
    private authS: AuthService,
    private router: Router,
    private service: ShopService,
    private modalService: BsModalService,
    private storeS: CustomStorageService
  ) { }

  ngOnInit(): void {
    this.authS.authState.subscribe(data =>{
      console.log(data)
      this.companyId = data.account?.company.id
      console.log(this.companyId)

    })
    const str = this.item?.product?.name;
    if (str) {
      this.acronym = str.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
    }
  }
  get itemStatus() {
    return (this.item?.value || this.item?.renewalValue) ? true : false;
  }
  get theCardType(): any {
    if (typeof this.item?.product.productType === 'undefined' || typeof this.item?.product.productType === null) {
      return this.cardTypes.wl;
    } else {
      if (this.item?.product.productType === 'pn') {
        this.setCardTypeProduct(this.item?.product.productType);
      }
      return this.cardTypes[this.item?.product.productType];
    }
  }
  setCardTypeProduct(type: any) {
    this.cardTypes[type].productName = this.item?.product.name || 'Product name';
    this.cardTypes[type].productVersion = this.item?.productVersion || '& version';
  }
  buy(item) {
    console.log(item)
    const {productId} = item
    console.log(productId)
    if (this.router.url.includes('shop')) {
      console.log('HEY')
      item.fromStore = true
      this.service.buyStore.next(item);
      this.orderS.generateOrder().subscribe((e: any) => {
        const obj: any = {
          orderId: e.id,
          productPriceId: productId,
          companyId: this.companyId
        };
        this.orderS.addOrderToCart(e.id, obj).subscribe((res: any) => {
          console.log(res)
          this.service.cartStore.next(res.OrderItems)
          // this.router.navigateByUrl('orders/orders-details/' + e.id);
        })
      });
    } else {
      item.fromStore = false
      this.service.buyStore.next(item);
      this.modalService.hide(1);
    }
  }
  getCurrencySymbol(code: string): string {
    return this.currencyS.getCurrencySymbol(code);
  }
  get cardCurrencySymbol() {
    return this.getCurrencySymbol(this.item?.priceList?.currency) || '$';
  }
}
