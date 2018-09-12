import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from './services/navigation.service';
import { ConfService } from './services/conf.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private navigationService : NavigationService,
    private configService : ConfService
  ) { }

  ngOnInit() {
    this.route.params.subscribe( (params) => {
      //this.navigationService.currrentId = params['id'];
      // let views = params['viewName'].split('-');
      // if(views.every(this.configService.isValidView)){
      //}
      console.log(params);
      this.navigationService.getEnvironnement(params.id, (err, env) => {
        if(err || !env) return;

      })
    });
  }
 

}
