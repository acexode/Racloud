import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductServiceService } from 'src/app/products/product-service.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, OnDestroy {
  items: any[];
  centerModal = true;
  displayModal = false;
  displayModal$: Subscription;
  constructor(private pS: ProductServiceService) {
    this.displayModal$ = this.pS.getAddProductModalDisplayStatus().subscribe(status => this.displayModal = status);
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.displayModal$.unsubscribe();
  }
  closeModal(): void {
    this.pS.closeAddProductModal();
  }
  stopModalPropagation(event: Event): void {
    event.stopPropagation();
  }

}
