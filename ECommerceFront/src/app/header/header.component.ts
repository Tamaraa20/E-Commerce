import { Component, ElementRef, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { NavigationItem } from '../models/navigationItem';
import { NavigationService } from '../services/navigation.service';
import { UserAuthenticationService } from '../services/user-authentication.service';
import { CartService } from '../services/cart.service';
import { Category } from '../models/category';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  implements OnInit{

  @ViewChild('modalTitle') modalTitle!: ElementRef;
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  cartItem: number = 0;

  navigationList: NavigationItem[] = []

  constructor(
    private navigationService: NavigationService,
    public userAuthentication: UserAuthenticationService,
    public cartService: CartService) { }

    ngOnInit(): void {
      this.navigationService.getCategoryList().subscribe((list: Category[]) => {
        for (let item of list) {
          let present = false;
          for (let navItem of this.navigationList) {
            if (navItem.category === item.category) {
              navItem.subcategories.push(item.subCategory);
              present = true
            }
          }
          if (!present) {
            this.navigationList.push({
              category: item.category,
              subcategories: [item.subCategory]
            })
          }
        }
      });
     // cart
     if (this.userAuthentication.isLoggedIn()) {
      this.navigationService.getActiveCartOfUser
        (this.userAuthentication.getUser().id)
        .subscribe((res: any) => {
          this.cartItem = res.cartItems.length
        });
    }
    this.cartService.changeCart.subscribe((res: any) => {
      if (parseInt(res) === 0) {
        this.cartItem = 0
      }
      else {
        this.cartItem += parseInt(res);
      }

    });
    let cartData = localStorage.getItem('localCart')
    if (cartData) {
      this.cartItem = JSON.parse(cartData).length
    }
  }

  openModal(name: string) {
    this.container.clear();

    let componentType!: Type<any>;
    if (name === 'login') {
      componentType = LoginComponent;
      this.modalTitle.nativeElement.textContent = 'Enter Login Information'
    }
    if (name === 'register') {
      componentType = RegisterComponent;
      this.modalTitle.nativeElement.textContent = 'Enter Registration Information'
    }
    this.container.createComponent(componentType)
  }
}
