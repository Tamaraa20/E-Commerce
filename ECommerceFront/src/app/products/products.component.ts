import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { UserAuthenticationService } from '../services/user-authentication.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  view: 'grid' | 'list' = 'list';
  sortby: 'default' | 'htl' | 'lth' = 'default';
  products: Product[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private navigationService: NavigationService,
    public cartService: CartService,
   ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      let category = params.category;
      let subCategory = params.subCategory;

      if (category && subCategory) {
        this.navigationService.getProducts(category, subCategory, 10).subscribe((res: any) => {
          this.products = res
        })
      }
    })
  }


  sortByPrice(sortkey: string) {
    this.products.sort((a, b) => {
      if (sortkey === 'default') {
        return a.productId > b.productId ? 1 : -1;
      }
      return (
        (sortkey === 'htl' ? 1 : -1) *
        (this.cartService.applyDiscount(a.price, a.offer.discount) >
          this.cartService.applyDiscount(b.price, b.offer.discount) ? -1 : 1)
      );
    });
  }


}
