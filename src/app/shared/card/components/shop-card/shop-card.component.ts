import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { CardItem } from 'src/app/shared/rc-forms/models/card-item-model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-shop-card',
  templateUrl: './shop-card.component.html',
  styleUrls: ['./shop-card.component.scss']
})
export class ShopCardComponent implements OnInit {
  @Input() item!: CardItem;
  buyStore: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  itemType
  acronym: string
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
    const str = this.item?.product?.name;
    if(str){
      this.acronym = str.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')
    }
    console.log(this.item)
  }
  get itemStatus() {
    return (this.item?.value || this.item?.renewalValue) ? true : false;
  }
  get theCardType(): any {
    if (typeof this.item?.product.productType === 'undefined' || typeof this.item?.product.productType === null) {
      return this.cardTypes.wl;
    } else {
      if (this.item?.product.productType === 'pn') {
        this.setCardTypeproduct(this.item?.product.productType);
      }
      return this.cardTypes[this.item?.product.productType];
    }
  }
  setCardTypeproduct(type: any) {
    this.cardTypes[type].productName = this.item?.product.name || 'product name';
    this.cardTypes[type].productVersion = this.item?.product.version || '& version';
  }
  buy(){
    this
  }
}
