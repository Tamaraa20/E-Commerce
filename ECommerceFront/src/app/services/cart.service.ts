import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { UserAuthenticationService } from './user-authentication.service';
import { NavigationService } from './navigation.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Cart } from '../models/cart';
import { Payment } from '../models/payment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  changeCart = new Subject();

  constructor(private jwt: JwtHelperService,
    public userAuthentication: UserAuthenticationService,
    private navigationService: NavigationService) { }

  applyDiscount(price: number, discount: number): number {
    let finalPrice: number = price - price * (discount / 100);
    return finalPrice;
  }

  addToCart(product: Product) {
    let productid = product.productId
    let userid = this.userAuthentication.getUser().id;

    this.navigationService.addToCart(userid, productid).subscribe((res) => {
      if (res.toString() === 'inserted') this.changeCart.next(1)
    })
  }

  calculatePayment(cart: Cart, payment: Payment) {
    payment.totalAmount = 0;
    payment.amountPaid = 0;
    payment.amountReduced = 0;

    for (const cartItem of cart.cartItems) {
      payment.totalAmount += cartItem.product.price;

      payment.amountReduced +=
        cartItem.product.price -
        this.applyDiscount(
          cartItem.product.price,
          cartItem.product.offer.discount
        );
      payment.amountPaid += this.applyDiscount(
        cartItem.product.price,
        cartItem.product.offer.discount
      );
    }
    if (payment.amountPaid > 50000) {
      payment.shipingCharges = 2000
    }
    else if (payment.amountPaid > 20000) {
      payment.shipingCharges = 1000
    } else if (payment.amountPaid > 5000) {
      payment.shipingCharges = 500
    }
    else {
      payment.shipingCharges = 200
    }
  }

  calculatePrice(cart: Cart) {
    let pricepaid = 0;
    for (let cartItem of cart.cartItems) {
      pricepaid += this.applyDiscount(
        cartItem.product.price,
        cartItem.product.offer.discount
      )

    }
    return pricepaid
  }

  private cartDataSubject = new BehaviorSubject<any>(null);
  setCartData(cartData: any) {
    this.cartDataSubject.next(cartData);
  }

  getCartData(): Observable<any> {
    return this.cartDataSubject.asObservable();
  }

}
