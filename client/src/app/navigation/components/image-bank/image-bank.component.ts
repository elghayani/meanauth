import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ImageBankService } from '../../services/image-bank.service';
import { NavigationService } from '../../services/navigation.service';

declare let $ : any;

@Component({
  selector: 'app-image-bank',
  templateUrl: './image-bank.component.html',
  styleUrls: ['./image-bank.component.css'],
  providers : [ImageBankService]
})
export class ImageBankComponent implements OnInit {

  @HostListener('window:scroll',['$event']) onScroll(event) {
    var dist = 0;
    if ($(window).scrollTop() >= $(document).height() - $(window).height() - dist && this.lastIndex<this.total  ){
      this.lastIndex += this.capacityToShow;
    }
  }
  title   : string = '' ;
  total   : number = 0 ;
  lastIndex : number = 0;
  images : any;
  pathOfImage = 'http://apple-time.fr/';
  capacityToShow : number = 20;
  private subRoute  : any;

  constructor ( 
    private route: ActivatedRoute,
    private navigationService : NavigationService,
    private imageBankService : ImageBankService
   ) { }

  ngOnInit() { 

    $('#waterfall').NewWaterfall({
        width: 170,
        delay: 100,
    });
    this.imageBankService.getImages(this.navigationService.currrentId)
    .subscribe(data => {
      this.title = data.name;
      this.total = data.artworks.length+data.photos.length;
      data.artworks.map((a)=>a.type = 'artwork');
      data.photos.map((a)=>a.type = 'photo');
      this.images = data.artworks.concat(data.photos);
      this.lastIndex = Math.min(this.capacityToShow,this.total);
    }, err => {
      console.log(err);
      return false;
    });
  }
  ngOnDestroy() {
    if(this.subRoute) this.subRoute.unsubscribe();
  }
  ngOnChanges(){
    console.log('here')
  }

}
