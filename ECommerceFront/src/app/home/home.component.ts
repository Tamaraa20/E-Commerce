import { Component, OnInit } from '@angular/core';
import { TrendingProducts } from '../models/trendingProducts';
import { NewArrivals } from '../models/newArrivals';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  trendingProducts: TrendingProducts[] = [
    {
      category: {
        id: 0,
        category: 'electronics',
        subCategory: 'mobiles'
      }

    }

  ]

  newArrivals: NewArrivals[] = [
    {
      category: {
        id: 0,
        category: 'furniture',
        subCategory: 'tables'
      }
    }

  ]

  constructor(private router: Router) { }
  ngOnInit(): void {

  }

  onButtonClickMobiles() {
    this.router.navigate(['/products'], {
      queryParams: {
        category: 'electronics',
        subCategory: 'mobiles',
      },
    });
  }

  onButtonClickLaptops() {
    this.router.navigate(['/products'], {
      queryParams: {
        category: 'electronics',
        subCategory: 'laptops',
      },
    });
  }

  onButtonClickChairs() {
    this.router.navigate(['/products'], {
      queryParams: {
        category: 'furniture',
        subCategory: 'chairs'
      }
    });
  }

}
