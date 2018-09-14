import { 
  Directive, 
  ElementRef, 
  Renderer2, 
  Inject, 
  Input
} from '@angular/core';

import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appBrainElement]'
})
export class BrainElementDirective {
  @Input() element: any;
  private maxLengthTextMain : number;
  private maxLengthTextBrain : number;

  constructor(
    private elementRef: ElementRef, 
    private renderer: Renderer2, 
    @Inject(DOCUMENT) private document
  ) { 
    if(window.innerWidth > 768){
        this.maxLengthTextBrain =  22;
        this.maxLengthTextMain  =  22;
    }else if(window.innerWidth > 400){
        this.maxLengthTextBrain =  18;
        this.maxLengthTextMain  =  20;           
    }else{
        this.maxLengthTextBrain =  15;
        this.maxLengthTextMain  =  19;
    }

  }

  ngOnInit() {
    let hasImg = false;
    let node = document.createElement('div');
    node.id = this.element.type+'-'+this.element.id;
    node.setAttribute('data-placement','left');
    node.setAttribute('node-type',this.element.type);
    node.className = 'brainElement brainCon  animated zoomIn noselect';
    node.style.height = this.element.canvasCoord.buttonHeight+'px';
    node.style.top = this.element.canvasCoord.y+'px';
    node.style.left = this.element.canvasCoord.x+'px';
    if(this.element.type != 'main')  node.style.width = this.element.canvasCoord.buttonWidth+'px';
    
    let child = document.createElement('div');
    child.className ='brainElement-rightSection tooltipBrain';
    if(this.element.type == 'main') child.classList.add('brainMainThought');
    child.style.width = "100%";    
    node.appendChild(child);

    let content = document.createElement('span');
    content.className = 'brainSpana';
    if(this.element.type == 'main'){
      content.classList.add('mainSpan');
    } else{
      content.classList.add('brainSpanaElement');
    }
    if (this.element.icon && this.element.icon != "" /*&& window.innerWidth > 500*/) {
      let img = document.createElement('img');
      img.classList.add(this.element.type == 'main' ? 'imageMainBrain' : 'imageBrain');
      img.src = this.element.icon;
      content.appendChild(img);
      hasImg = true;
    }
    let p = document.createElement('p');
    p.className = 'brainText-desktop';
    p.classList.add(this.element.type == 'main' ? 'brainTextMain' : 'brainText');
    if(hasImg) p.style.paddingRight = "1px";
    content.appendChild(p);
    child.appendChild(content);

    let nameThought = this.element.name;
    let maxLength = this.element.type == 'main' ? this.maxLengthTextMain : this.maxLengthTextBrain;

    if (nameThought && nameThought.length > maxLength) {
      let tooltip = this.document.createElement('span');
      tooltip.className = 'tooltiptextBrain tooltip-bottom';
      tooltip.textContent = nameThought;
      child.appendChild(tooltip);
      nameThought = nameThought.slice(0, maxLength) + "...";      
    }
    p.textContent = nameThought;
    this.renderer.appendChild(this.elementRef.nativeElement, node);
    if(this.element.type == 'main'){
      let widthMain = node.offsetWidth;
      this.element.points.rigth.x = this.element.points.top.x + (widthMain / 2)  ;
      this.element.points.left.x = (this.element.points.top.x - (widthMain / 2) );
      node.style.left = this.element.points.left.x+'px';
    }
  }
}
