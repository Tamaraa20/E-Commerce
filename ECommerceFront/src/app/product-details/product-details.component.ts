import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { FormControl } from '@angular/forms';
import { Review } from '../models/review';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { UserAuthenticationService } from '../services/user-authentication.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent  implements OnInit{

  imageIndex: number = 1;
   product !: Product;
  reviewControl = new FormControl('');
  showError = false;
  rewievSaved = false;
  otherReviews: Review[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private navigationService: NavigationService,
    public userAuthentication: UserAuthenticationService,
    public cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      let id = params.id;
      this.navigationService.getProduct(id).subscribe((res: any) => {
        this.product = res;
        this.fetchAllReviews();
      })
    })

  }

  submitReview() {
    let review = this.reviewControl.value;
    if (review === '' || review === null) {
      this.showError = true
      return
    }
    let userid = this.userAuthentication.getUser().id;
    let productid = this.product.productId;

    this.navigationService.submitReview(userid, productid, review).subscribe((res) => {
      this.rewievSaved = true;
      this.fetchAllReviews();
      this.reviewControl.setValue("");
    })
  }

  fetchAllReviews() {
    this.otherReviews = [];
    this.navigationService.
      getAllReviewsOfProduct(this.product.productId)
      .subscribe((res: any) => {
        for (const review of res) {
          this.otherReviews.push(review);
        }
      })

  }

  productData:undefined | Product;
  productQuantity:number=1;
  removeCart=false;
  cartData:Product|undefined;

}
