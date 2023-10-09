import { Injectable } from '@angular/core';
import { NavigationService } from './navigation.service';
import { User } from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationService {


  constructor(private jwt: JwtHelperService,
    private navigationService: NavigationService,) { }


  isLoggedIn() {
    return localStorage.getItem('user') ? true : false;
  }

  loggoutUser() {
    localStorage.removeItem('user')
  }

  getUser(): User {
    let token = this.jwt.decodeToken();
    let user: User = {
      id: token.id,
      firstName: token.firstName,
      lastName: token.lastName,
      email: token.email,
      address: token.address,
      mobile: token.mobile,
      password: '',
      createdAt: token.createdAt,
      modifiedAt: token.modifiedAt,
    };
    return user;
  }

  setUser(token: string) {
    localStorage.setItem('user', token)
  }
}
