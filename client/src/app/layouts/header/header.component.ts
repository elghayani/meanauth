import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SearchService } from '../search.service';

import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
//import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers : [SearchService]
})
export class HeaderComponent implements OnInit {

  searchIsOpen : boolean = false;  
  searchText : string = '';
  searchResult : Array<any> = [];
  pathOfImage = 'http://apple-time.fr/';

  constructor(
    private authService: AuthService,
    private searchService : SearchService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    /*public headerService : HeaderService*/) {
     }
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
    this.searchService.searchTemplateByName(this.searchText).subscribe(data => {
      this.searchResult = data;
    });
   
  }
  emptySearch(){
    this.searchResult = [];
    this.searchText   = "";
  }

}
