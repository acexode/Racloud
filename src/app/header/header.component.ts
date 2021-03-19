import { OrderService } from 'src/app/orders/service.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomStorageService } from './../core/services/custom-storage/custom-storage.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { TitleService } from '../core/services/title/title.service';
import { UsersService } from '../users/users.service';
import { get } from 'lodash';
import { Subscription } from 'rxjs';
import { PriceListService } from '../core/services/price-list/price-list.service';
import { ShopService } from '../shop/shop.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  raLogoType = 'group2';
  pageTitle$ = this.titleService.titleStore;
  user: any;
  impersonatorId: any;
  company: any;
  role;
  authS$: Subscription;
  totalOrder;
  constructor(
    private titleService: TitleService,
    private authS: AuthService,
    private userS: UsersService,
    private orderS: OrderService,
    private shopS: ShopService,
    private router: Router,
    private CStore: CustomStorageService
  ) { }

  ngOnInit(): void {
    this.shopS.cartStore.subscribe(cart => {
      if (cart.length > 0) {
        this.getCartCount();
      } else {
        this.totalOrder = 0;
      }
    });
    this.authS$ = this.authS.getAuthState().subscribe(e => {
      const account = get(e, 'account', null);
      this.company = get(account, 'company', null) || 'No company';
      console.log(this.company);
      const firstname = get(get(account, 'user', null), 'firstname', null) || 'firstname';
      const lastname = get(get(account, 'user', null), 'lastname', null) || 'lastname';
      const id = get(get(account, 'user', null), 'id', null) || get(e, 'impersonatorId', null);
      this.impersonatorId = get(e, 'impersonatorId', null);
      this.user = {
        firstname,
        lastname,
        id
      };
      this.getCartCount();
    });
    this.CStore.getItem('token').subscribe(e => {
      this.impersonatorId = e.impersonatorId;
    });
  }
  navigate(id: any, route: any) {
    if (route === 'user') {
      this.router.navigate(['/my-profile']);
    } else if (route === 'company') {
      this.router.navigate(['/my-company']);
    } else {
      return null;
    }
  }
  getCartCount() {
    this.orderS.cartTotal().subscribe((res: any) => {
      // const order:any = orders.orderItems.filter((ord:any) => ord.orderStatus === 'Cart' )[0]
      this.totalOrder = res.numberOfProductsInCart;
      console.log(res);
    });
  }
  userLogOut() {
    this.authS.logout();
  }
  stopImpersonation() {
    const obj = {
      impersonatorId: this.impersonatorId
    };
    this.CStore.getItem('oldToken').subscribe(e => {
      const userInfo = e;
      const account = {
        username: userInfo.user.email,
        image: null,
        user: userInfo.user || null,
        company: userInfo.company,
        roles: userInfo.roles[0],
      };
      this.authS.authState.next({
        init: true,
        account,
        authToken: e.token,
        expiryDate: e.exp || null,
      });
      this.CStore.setItem('token', userInfo).subscribe(t => {
        this.userS.getUserPermissionsPerPage();
        this.CStore.removeItem('oldToken');

      });
    });
  }
  ngOnDestroy() {
    this.authS$.unsubscribe();
  }
}
