import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { UserAuthenticationService } from '../services/user-authentication.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent  implements OnInit{

  @Input() view: 'grid' | 'list' | 'currcartitem' | 'prevcartitem' = 'list';

  @Input() product:Product={
    productId: 0,
    title: '',
    description: '',
    price: 0,
    quantity: 0,
    productCategory: {
      id: 1,
      category: '',
      subCategory: ''
    },
    offer: {
      offerId: 1,
      title: '',
      discount: 0
    },
    imageName: '',
  }

  constructor(public userAuthentication: UserAuthenticationService,
    public cartService: CartService) { }

  ngOnInit(): void {

  }

}
