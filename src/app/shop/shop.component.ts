import { Component, OnInit } from '@angular/core';
import { ShopsService } from '../core/services/shops/shops.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  shops = []
  constructor(private shopService: ShopsService) { }

  ngOnInit(): void {
    this.shopService.getShops().subscribe((e:any) =>{
      this.shops = e
    })
  }

}
