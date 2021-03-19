import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductServiceService } from 'src/app/products/product-service.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, OnDestroy {
  @Input() products: any;
  items: any[];
  centerModal = true;
  displayModal = false;
  displayModal$: Subscription;
  constructor(private pS: ProductServiceService) {
    this.displayModal$ = this.pS.getAddProductModalDisplayStatus().subscribe(status => this.displayModal = status);
  }

  ngOnInit(): void { }
  closeModal(): void {
    this.pS.closeAddProductModal();
  }
  stopModalPropagation(event: Event): void {
    event.stopPropagation();
  }
  ngOnDestroy(): void {
    this.displayModal$.unsubscribe();
  }
  getClickedProduct(emittedProduct: any): void {}

}
