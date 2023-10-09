import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationService } from '../services/navigation.service';
import { UserAuthenticationService } from '../services/user-authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message = ''

  constructor(
    private fb: FormBuilder,
    private navigationService: NavigationService,
    public userAuthentication: UserAuthenticationService,
    ) { }


    ngOnInit(): void {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        pwd: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(15)
          ]
        ],

      })
    }
    get Email(): FormControl {
      return this.loginForm.get('email') as FormControl
    }
    get PWD(): FormControl {
      return this.loginForm.get('pwd') as FormControl
    }
    login() {
      this.navigationService
        .loginUser(this.Email.value, this.PWD.value)
        .subscribe((res: any) => {
          if (res.toString() !== 'invalid') {
            this.message = 'Logged In Successfully.';
            this.userAuthentication.setUser(res.toString());
            console.log(this.userAuthentication.getUser());
          } else {
            this.message = 'Invalid Credentials!';
          }
        });
    }
}
