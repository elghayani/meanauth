import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../layouts/header.service';
declare var $: any;

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.css']
})
export class AnimationComponent implements OnInit {

  palyAnimation :boolean;
  isWebpSupport = false;
  timeOutAnnimation1 = null;
  timeOutAnnimation2 = null;
  img1 = '';

  constructor(
    private router : Router, 
    private headerService : HeaderService) {
    this.headerService.displayHeader = false;
    this.isWebpSupport = this.ifSupportWebP();
    //this.settings  = Meteor.settings.public;
    this.palyAnimation = true;
    this.img1 = this.isWebpSupport ? 'assets/images/animation/1.webp' : 'assets/images/animation/1.jpg'; 
  }

  ngOnInit() {
    if (this.palyAnimation ) {
      this.timeOutAnnimation1 = setTimeout( () => {            
          $(".animation-image").css('right', 'calc( 50% - '+ 33 +'px )');
          $(".animation-image").css('top',  'calc( 50% - '+ 32.5 +'px )');
          $(".animation-image").css('width',' 66px ');
          $(".animation-image").css('height','63px ');

          this.timeOutAnnimation2 = setTimeout( () => {
            $('img.one').fadeOut(2000, () => {
                $('img.two').fadeOut(2000, () => {
                    $('.start-animation').fadeOut(3000, () => {
                        this.exitAnimation();
                        this.palyAnimation = false;
                    });
                });
            });
          }, 8000);
      },500);
    }
  }
  ngOnDestroy(){
    this.headerService.displayHeader = true;
  }

  skipAnimation(){
    if(this.timeOutAnnimation1){
    clearTimeout(this.timeOutAnnimation1);
    }
    if(this.timeOutAnnimation2){
    clearTimeout(this.timeOutAnnimation1); 
    }
    this.exitAnimation();    
    this.palyAnimation = false;
  };

  exitAnimation(){
    // let settings = Meteor.settings.public;
    this.router.navigate(['dashboard']) ;  
  }

  ifSupportWebP() {
    var elem = document.createElement('canvas');
    if (!!(elem.getContext && elem.getContext('2d'))) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
    }
    else {
        return false;
    }
  }
}
