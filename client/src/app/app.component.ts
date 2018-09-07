import { Component } from '@angular/core';
import { HeaderService } from './layouts/header.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public headerService : HeaderService){}
}
