import { Component, Input, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { Product } from '../models/product';
import { Category } from '../models/category';

@Component({
  selector: 'app-new-arrivals',
  templateUrl: './new-arrivals.component.html',
  styleUrls: ['./new-arrivals.component.css']
})
export class NewArrivalsComponent implements OnInit {

  @Input() category: Category = {
    id: 0,
    category: '',
    subCategory: ''
  }

  @Input() count: number = 3;
  products: Product[] = []

  constructor(private navigationService: NavigationService) { }


  ngOnInit(): void {
    this.navigationService
    .getProducts(
      this.category.category,
      this.category.subCategory,
      this.count
    )
    .subscribe((res: any[]) => {
      for (let product of res) {
        this.products.push(product);
      }
    });
  }
}
