import { Component, OnInit } from '@angular/core';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  shops = []
  constructor(public shopService: ShopService) { }

  ngOnInit(): void {
    this.shopService.shopStore.pipe().subscribe((e:any) =>{
      console.log(e)
      this.shops = e
    })
  }

}
