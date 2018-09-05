import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TemplateService } from '../../services/template.service';

import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers : [TemplateService]
})
export class NavbarComponent implements OnInit {

  searchIsOpen : boolean = false;  
  searchText : string = '';
  searchResult : Array<any> = [];
  pathOfImage = 'http://apple-time.fr/';

  constructor(
    private authService: AuthService,
    private templateService : TemplateService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }
  onLogoutClick() {
    this.authService.logout();
    this.flashMessage.show('You are logged out', {
      cssClass: 'alert-success', timeout: 3000
    });
    this.router.navigate(['/login']);
    return false;
  }
  onSearchHandler(){
    if(this.searchText == '') return this.searchResult = [];
    this.templateService.searchByName(this.searchText).subscribe(data => {
      this.searchResult = data;
    });
   
  }
  emptySearch(){
    this.searchResult = [];
    this.searchText   = "";
    this.searchIsOpen = false;
  }
 
}
