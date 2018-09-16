import { 
  Directive, 
  ElementRef, 
  Inject, 
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appBrainElement]'
})
export class BrainElementDirective {
  @Input() element: any;
  @Output() someEvent : EventEmitter <boolean>= new EventEmitter();

  constructor(
    private elementRef: ElementRef, 
    @Inject(DOCUMENT) private document
  ) { 

  }

  ngAfterViewInit() {
    let node = this.elementRef.nativeElement;
    if(this.element.type == 'main'){
      let widthMain = node.offsetWidth;
      this.element.points.rigth.x = this.element.points.top.x + (widthMain / 2)  ;
      this.element.points.left.x = (this.element.points.top.x - (widthMain / 2) );
      node.style.left = this.element.points.left.x+'px';
      this.someEvent.next(true);
    }else if(this.element.type == 'jumps'){
      this.element.points.rigth.x = node.offsetLeft + node.children[0].children[0].offsetWidth + node.children[0].children[0].offsetLeft + 9;
      //this.someEvent.next(true);
    } 
  }
}
