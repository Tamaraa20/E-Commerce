import { Component, OnInit } from '@angular/core';
import { PaymentMethod } from '../models/paymentMethod';
import { FormControl } from '@angular/forms';
import { Cart } from '../models/cart';
import { Payment } from '../models/payment';
import { NavigationService } from '../services/navigation.service';
import { Router } from '@angular/router';
import { UserAuthenticationService } from '../services/user-authentication.service';
import { CartService } from '../services/cart.service';
import { Order } from '../models/order';
import { timer } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  selectedPaymentMethodName = '';
  selectedPaymentMethod = new FormControl('0');

  address = '';
  mobileNumber = '';
  displaySpinner = false;
  message = ''

  paymentMethods: PaymentMethod[] = [];

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
  classname: string;

  constructor(
    private navigationService: NavigationService,
    public userAuthentication: UserAuthenticationService,
    public cartService: CartService,
    private router: Router
  ) { }


  ngOnInit(): void {

    this.navigationService.getPaymentMethods().subscribe((res) => {
      this.paymentMethods = res
    })

    this.selectedPaymentMethod.valueChanges.subscribe((res: any) => {
      if (res === '0') {
        this.selectedPaymentMethodName = '';
      }
      else {
        this.selectedPaymentMethodName = res.toString();
      }
    });


    this.navigationService.getActiveCartOfUser
      (this.userAuthentication.getUser().id)
      .subscribe((res: any) => {
        this.usersCart = res;
        this.cartService.calculatePayment(res, this.userPaymentInfo)
      });


    this.address = this.userAuthentication.getUser().address;
    this.mobileNumber = this.userAuthentication.getUser().mobile;

  }

  getPaymentMethod(id: string) {
    let x = this.paymentMethods.find((v) =>
      v.id === parseInt(id))
    return x?.type + ' - ' + x?.provider
  }

  placeOrder() {
    this.displaySpinner = true;
    let isPaymentSuccessfull = this.payMoney()

    if (!isPaymentSuccessfull) {
      this.displaySpinner = false;
      this.message = 'Something went wrong'
      this.classname = 'text-danger'
      return
    }

    let step = 0;
    let count = timer(0, 300).subscribe((res) => {
      step++;
      if (step === 1) {
        this.message = 'processing payment'
        this.classname = 'text-primary'
      }
      if (step === 2) {
        this.message = 'payment successfull, order is being placed'
        this.storeOrder()

      }
      if (step === 3) {
        this.message = 'your order has been placed'
        this.displaySpinner = false
      }
      if (step === 4) {
        this.router.navigateByUrl('/home')
        count.unsubscribe()

      }
    })
  }

  payMoney() {
    return true;
  }
  storeOrder() {
    let payment: Payment;
    let pmid = 0;
    if (this.selectedPaymentMethod.value) {
      pmid = parseInt(this.selectedPaymentMethod.value)
    }

    payment = {
      id: 0,
      paymentMethod: {
        id: pmid,
        type: '',
        provider: '',
        available: false,
        reason: ''
      },
      user: this.userAuthentication.getUser(),
      totalAmount: this.userPaymentInfo.totalAmount,
      shipingCharges: this.userPaymentInfo.shipingCharges,
      amountReduced: this.userPaymentInfo.amountReduced,
      amountPaid: this.userPaymentInfo.amountPaid,
      createdAt: ''
    }
    this.navigationService
      .insertPayment(payment)
      .subscribe((paymentResponse: any) => {
        payment.id = parseInt(paymentResponse)
        let order: Order = {
          id: 0,
          user: this.userAuthentication.getUser(),
          cart: this.usersCart,
          payment: payment,
          createdAt: ''
        }
        this.navigationService.insertOrder(order).subscribe((orderResponse)=>{
          this.cartService.changeCart.next(0)
        })
      })
  }



}
