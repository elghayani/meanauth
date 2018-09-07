import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private navigationService : NavigationService
  ) { }

  ngOnInit() {
    this.route.params.subscribe( (params) => {
      this.navigationService.currrentId = params['id'];
    });
  }

}
