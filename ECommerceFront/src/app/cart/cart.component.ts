import { Component } from '@angular/core';
import { Cart } from '../models/cart';
import { Payment } from '../models/payment';
import { NavigationService } from '../services/navigation.service';
import { Router } from '@angular/router';
import { UserAuthenticationService } from '../services/user-authentication.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  usersCart: Cart = {
    id: 0,
    user: this.userAuthentication.getUser(),
    cartItems: [],
    ordered: false,
    orderedOn: ''
  }

  userPaymentInfo: Payment = {
    id: 0,
    user: this.userAuthentication.getUser(),
    paymentMethod: {
      id: 0,
      type: '',
      provider: '',
      available: false,
      reason: ''
    },
    totalAmount: 0,
    shipingCharges: 0,
    amountReduced: 0,
    amountPaid: 0,
    createdAt: ''
  }
  usersPreviousCarts: Cart[] = [];
  data: any;

  constructor(
    public navigationService: NavigationService,
    public userAuthentication: UserAuthenticationService,
    public cartService: CartService
  ) { }


  ngOnInit(): void {

    // getcart
    this.navigationService.getActiveCartOfUser(this.userAuthentication.getUser().id)
      .subscribe((res: any) => {
        this.usersCart = res;

        // calculate payment
        this.cartService.calculatePayment(
          this.usersCart, this.userPaymentInfo
        )
      });
    // get previus carts
    this.navigationService.getAllPreviousCarts(this.userAuthentication.getUser().id)
      .subscribe((res: any) => {
        this.usersPreviousCarts = res;
      })
  }

  deleteCartItem(cartItemId: number): void {
    this.navigationService.deleteCartItem(cartItemId).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
    window.location.reload();
  }

}
