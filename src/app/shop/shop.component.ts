import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {
  shops = [];
  shopsSub$: Subscription;
  constructor(public shopService: ShopService) { }
  ngOnInit(): void {
    this.shopsSub$ = this.shopService.getAllShops().subscribe((e: any) => {
      this.shops = e;
    });
  }
  get shopsStatus(): boolean {
    return (this.shops === undefined || this.shops.length === 0) ? true : false;
  }
  ngOnDestroy(): void {
    this.shopsSub$.unsubscribe();
  }
}
