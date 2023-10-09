import { Directive, HostListener, Input } from '@angular/core';
import { Category } from '../models/category';
import { Router } from '@angular/router';

@Directive({
  selector: '[OpenProducts]'
})
export class OpenProductsDirective {

  @Input() category: Category = {
    id: 0,
    category: '',
    subCategory: ''
  }

  @HostListener('click') openProduct() {
    this.router.navigate(['/products'], {
      queryParams: {
        category: this.category.category,
        subCategory: this.category.subCategory
      }
    })
  }

  constructor(private router: Router) { }

}
