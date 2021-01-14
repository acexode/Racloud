import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductModel } from 'src/app/products/models/products.model';
import { CardItem } from 'src/app/shared/rc-forms/models/card-item-model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Output() productDetailsEmitter = new EventEmitter<ProductModel>(null);
  @Input() product: any;
  acronym = 'ERE';
  item: CardItem = {
    product: {
      name: 'ERE',
      description: 'Ra Workshop Professional is the ultimate production edition. This edition includes everything from estimation to production. It is confi-gured to have the best performance and a maximum return of your investment.'
    }
  };
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
  constructor() { }

  ngOnInit(): void {
    /* const str = this.item?.Product?.Name;
    if (str) {
      this.acronym = str.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
    } */
  }
  get itemStatus() {
    return (this.item?.product?.description) ? true : false;
  }
  get theCardType(): any {
    if (typeof this.item?.type === 'undefined' || typeof this.item?.type === null) {
      return this.cardTypes.wl;
    } else {
      if (this.item?.type === 'pn') {
        this.setCardTypeProduct(this.item?.type);
      }
      return this.cardTypes[this.item?.type];
    }
  }
  setCardTypeProduct(type: any) {
    this.cardTypes[type].productName = this.item?.product.name || 'Product name';
    this.cardTypes[type].productVersion = this.item?.productVersion || '& version';
  }
  emitProductDetails() {
    this.productDetailsEmitter.emit(this.product);
  }
}

