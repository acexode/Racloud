import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop-card',
  templateUrl: './shop-card.component.html',
  styleUrls: ['./shop-card.component.scss']
})
export class ShopCardComponent implements OnInit {
  @Input() item: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  buy(data: any) {
    this.router.navigate(['licenses/license-edit', { id: data.id }]);
    console.log(data)
  }

}
