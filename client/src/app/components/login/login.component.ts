import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }
  onLoginSubmit() {
    this.authService.authenticateUser( {
        username: this.username,
        password: this.password
      }).subscribe( (data) => {
        this.authService.storeUserData(data.token, data.user);
        this.flashMessage.show('You are now logged in', {cssClass: 'alert-success', timeout: 5000});
        this.router.navigate(['profile']);
      },  error => {
        console.log(error)
        this.flashMessage.show(error.json().msg, {cssClass: 'alert-danger', timeout: 5000});
        this.router.navigate(['login']);
      }
    );
  }
}
