import { Component, ViewChild, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as createjs from 'createjs-module';

import { NavigationService } from "../../services/navigation.service";
import { ConfService } from "../../services/conf.service";
import { BrainService } from "../../services/brain.service";

declare var $;

import "./brain.component.css";


@Component({
  selector: 'app-brain',
  templateUrl: './brain.component.html',
  styleUrls: ['./brain.component.css'],
  providers : [
    BrainService
  ]
})
export class BrainComponent  {

    public stage;
    public thoughts: any;
    public confBrain;
    public posThoughts;
    private paramsBrain =  {
        colorLinks : '#F26521',
        colorHoverLinks : '#FFDD15',
        strokeStyle : 1,
        strokeStyleHover : 1.6
    };

    public oldShownSiblings = [];
    public subscription;

    public timeOutResize = null;
    public nbPageChildren;
    public nbPageParents;
    public nbPageJumps;

    public scrollChildren;
    public scrollJumps;
    public scrollParents;
    public scrollSiblings;

    public mouseOverUnlink  :any = false;
    public inContextMenu;
    public widthwindow = 0;
    public registerLinks;
    public animatedLinks;

    public posMenu;
    public config;
    public notInPins;
    public maxLengthTextBrain;
    public maxLengthTextMain;

    public parentLinksContainer = new createjs.Container();
    public childrenLinksContainer = new createjs.Container();
    public jumpsLinksContainer = new createjs.Container();
    public siblingsLinksContainer = new createjs.Container();

    public brainMode: string ='nav';
    public imageHover : any = undefined;

    @ViewChild('myCanvas') canvas;

    constructor(
        public navigationService: NavigationService,
        public confService: ConfService,
        private brainService : BrainService,
        public route: ActivatedRoute,
        public router: Router,

      ) {
        this.registerLinks     = [];
        this.animatedLinks     = [];
        this.confBrain         = null;
        this.oldShownSiblings  = [];
        this.posThoughts  = {};
        this.posMenu         = 6;
        this.config = {
            data: {
              message     : '',
              option1     : '',
              option2     : '',
              title       : '',
              input       : false,
              optionInput : '',
              type        : 0,
              accept      : ''
            }
        };
        this.notInPins = true;

        this.posThoughts.main = [];
        this.posThoughts.children = [];
        this.posThoughts.parents = [];
        this.posThoughts.jumps = [];
        this.posThoughts.siblings = [];
    }
  
   
    ngOnInit() {
       

       this.widthwindow   = window.innerWidth;

       if(this.widthwindow > 768){
           this.maxLengthTextBrain =  22;
           this.maxLengthTextMain  =  22;
       }else if(this.widthwindow > 400){
           this.maxLengthTextBrain =  18;
           this.maxLengthTextMain  =  20;           
       }else{
           this.maxLengthTextBrain =  15;
           this.maxLengthTextMain  =  19;
       }
      this.navigationService.envirement$.subscribe((changed)=>{
        if(!changed) return;
        this.stage = new createjs.Stage('brainCanvas');          
        this.confService.returnConf(window.innerWidth, function (conf) {
            this.confBrain = conf;
            this.thoughts /*= this.navigationService.currentThought*/ = this.setThoughts();
            this.setMatrixBrain();
            this.drawBrainElements();
        }.bind(this));
       });
    }
    setThoughts() {
        let thoughts = this.brainService.brainSchema(this.confService.brainCapacity);//this.navigationService.currentThought;
        thoughts.mainThought = this.navigationService.currentThought.main;

        thoughts.children.total = this.navigationService.currentThought.totalChildren;
        thoughts.parents.total  = this.navigationService.currentThought.totalParents;
        thoughts.siblings.total = this.navigationService.currentThought.totalSiblings;
        thoughts.jumps.total    = this.navigationService.currentThought.totalJumps;

        thoughts.children.thoughts  = this.navigationService.currentThought.children.sort(function(a,b) {return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);} ); ;
        thoughts.parents.thoughts   = this.navigationService.currentThought.parents.sort(function(a,b) {return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);} ); ;
        thoughts.jumps.thoughts     = this.navigationService.currentThought.jumps.sort(function(a,b) {return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);} );;
        thoughts.siblings.thoughts  = this.navigationService.currentThought.siblings;

        console.log(thoughts)
        //thoughts.parents.subPageCapacity = this.confService.brainCapacity.siblings.limitTO;
        return thoughts;
    }
    setMatrixBrain(){
        this.thoughts.children.matrixBrain = this.brainService.childrenMatrixBrain(this.confBrain,  this.thoughts.children.thoughts.length);
        this.thoughts.parents.matrixBrain  = this.brainService.parentsMatrixBrain(this.confBrain, this.thoughts.parents.thoughts.length);
        this.brainService.siblignsMatrixBrain(this.confBrain, this.thoughts.siblings.thoughts);
        this.thoughts.jumps.matrixBrain = this.brainService.jumpsMatrixBrain(this.thoughts.jumps.thoughts.length, this.thoughts.jumps.pageCapacity);
    }

    drawBrainElements() {
        this.stage.heigth = this.canvas.nativeElement.height = window.innerHeight;
        this.stage.width = this.canvas.nativeElement.width  = window.innerWidth;
        this.stage.enableMouseOver(1000);
        this.clearStage();
        this.drawCenter();
        this.drawChildrens();
        this.drawParents();
        this.drawJumps();
        this.drawSiblings();
        //console.log(this.posThoughts)
    }

    drawCenter() {
        this.brainElement(this.thoughts.mainThought, 'main', 0, 0)
    }

    drawChildrens() {
        if( this.thoughts.children.matrixBrain && this.thoughts.children.thoughts.length > 0 ){
            this.thoughts.children.matrixBrain.map((_e, i)=>{
                if (_e[0] == 0) return;
                for (let j = 0; j < _e.length; j++) {
                    let element = this.brainElement(this.thoughts.children.thoughts[_e[j]-1], 'children', j, i);
                    this.drawChildrenlink(this.posThoughts.main[0], element);
                }
            });
            let point1 = this.drawPoint(this.posThoughts.main[0].points.bottom.x, this.posThoughts.main[0].points.bottom.y, 2, this.paramsBrain.colorLinks);
            this.childrenLinksContainer.addChild(point1);    
            this.stage.addChild(this.childrenLinksContainer);
            this.childrenLinksContainer.on("mouseover",   this.mouseOverLink);
            this.childrenLinksContainer.on("mouseout", this.mouseOutLink);
            this.stage.update();
        }
    }
    
    drawParents() {
        if( this.thoughts.parents.matrixBrain && this.thoughts.parents.thoughts.length > 0){
            this.thoughts.parents.matrixBrain.map((_e, i)=>{
                if (_e[0] == 0) return;
                for (let j = 0; j < _e.length; j++) {
                    let element = this.brainElement(this.thoughts.parents.thoughts[_e[j]-1], 'parents', j, i);
                    this.drawParentLink(this.posThoughts.main[0],element);                 
               
                }
            });
            let point1 = this.drawPoint(this.posThoughts.main[0].points.top.x, this.posThoughts.main[0].points.top.y, 2, this.paramsBrain.colorLinks);
            this.parentLinksContainer.addChild(point1);
            
            this.stage.addChild(this.parentLinksContainer);   
            this.parentLinksContainer.addEventListener("mouseover", this.mouseOverLink);
            this.parentLinksContainer.addEventListener("mouseout", this.mouseOutLink);  
            this.stage.update();   
        }
    }
      
    drawJumps() {
        if( this.thoughts.jumps.matrixBrain){
            this.thoughts.jumps.matrixBrain.map((e,i)=>{
                if(e !== 0) {
                    this.brainElement(this.thoughts.jumps.thoughts[e-1], 'jumps', i, 0);
                }
            })
        }
    }

    drawSiblings() {  
        this.thoughts.siblings.thoughts.map(e=> {
            e.children.map(_e=> {
                let element : any = this.brainElement(_e, 'siblings', _e.col, 0);
                element.parent  =  {id :_e.idParent};
            })
        });
        this.drawSiblingsLink();
        this.stage.addChild(this.siblingsLinksContainer);
        this.stage.update();
    }

    brainElement(data, typeElement, row, col){
        let canvasCoord = this.brainService.canvasCoord(
            this.stage, 
            this.confBrain.staticSectionsMeseaures[typeElement], 
            this.confBrain.staticSectionsMeseaures.buttonCoef, 
            col,
            row
        );
        let positionCss = this.brainService.positionCss(canvasCoord);
        let icon = '';
        if(typeElement == 'main'){
            if(this.widthwindow > 768 && this.thoughts.parents.total){
                positionCss.bottom.y -= 6;
                positionCss.top.y    += 3;
              }else{
                positionCss.top.y    -= 3;
              }
            icon = data.icon !='' ? this.confService.pathOfImages+data.icon : '';
        }
        else{
            icon = (data.images && data.images.length>0) ? this.confService.pathOfImages+data.images[0] : '';
        }
        // if(user && objet.id == user.personalThought && this.cropService.getcropData() !== undefined){
        //     objet.icon = this.cropService.getcropData();
        // } //for all thought
        let element = {
            name : data.name,
            icon : icon,
            points         : positionCss,
            canvasCoord : canvasCoord,
            isSystem       : data.isSystem,
            owner          : data.owner,
            id             : (data.id || data._id ),
            type           : typeElement
        };  
        this.posThoughts[typeElement].push(element);
        return element;    
    }

    drawChildrenlink(posThoughtsMain, posThoughtsChildren){
       
        let p1 = {
            x: posThoughtsMain.points.bottom.x,
            y: posThoughtsChildren.points.top.y - 3
        };
        let p2 = {
            x: posThoughtsChildren.points.top.x,
            y: posThoughtsChildren.points.top.y + 3
        };
        this.drawLink(posThoughtsMain.points.bottom, posThoughtsChildren.points.top, p1, p2, this.childrenLinksContainer, posThoughtsMain, posThoughtsChildren, 'children');
        let point2 = this.drawPoint(posThoughtsChildren.points.top.x, posThoughtsChildren.points.top.y, 2, this.paramsBrain.colorLinks);
        this.childrenLinksContainer.addChild(point2);
    }

    drawParentLink(posThoughtsMain,posThoughtsParent) {
        let P1, P2, linkIndex;        
        if(this.thoughts.parents.thoughts.length == 1){            
            posThoughtsMain.points.bottom.y += 5;
            P1 = {
                x: posThoughtsMain.points.top.x    + 35,
                y: posThoughtsMain.points.bottom.y - 100
            };
            P2 = {
                x: posThoughtsParent.points.bottom.x - 35,
                y: posThoughtsParent.points.bottom.y + 100
            };
            this.drawLink(posThoughtsMain.points.top, posThoughtsParent.points.bottom, P1, P2, this.parentLinksContainer, posThoughtsMain, posThoughtsParent, 'parents');
            
            let point2 = this.drawPoint(posThoughtsParent.points.bottom.x, posThoughtsParent.points.bottom.y, 2, this.paramsBrain.colorLinks);
            this.parentLinksContainer.addChild(point2);
        }else{        
            P1 = {
                x: posThoughtsMain.points.top.x,
                y: posThoughtsParent.points.bottom.y
            };
            P2 = {
                x: posThoughtsParent.points.bottom.x,
                y: posThoughtsMain.points.top.y
            };
            linkIndex  = this.drawLink(posThoughtsMain.points.top, posThoughtsParent.points.bottom, P1, P2, this.parentLinksContainer, posThoughtsMain, posThoughtsParent, 'parents');
            let point2 = this.drawPoint(posThoughtsParent.points.bottom.x, posThoughtsParent.points.bottom.y, 2, this.paramsBrain.colorLinks);
            this.parentLinksContainer.addChild(point2);
        }
    }    

    drawJumpLink(posThoughtsJump,posThoughtsMain) {
        let P1, P2, linkIndex;
        let currentJump;
        let xLinkCurve = (this.widthwindow > 768) ? 40 : 65;
        P1 = {
            x: posThoughtsMain.points.left.x - 25,
            y: posThoughtsJump.points.rigth.y + xLinkCurve
        };
        P2 = {
            x: posThoughtsJump.points.rigth.x + 25,
            y: posThoughtsMain.points.left.y
        };
        this.drawLink(posThoughtsMain.points.left, posThoughtsJump.points.rigth, P1, P2, this.jumpsLinksContainer, posThoughtsMain, posThoughtsJump, 'jumps');
        let point1 = this.drawPoint(posThoughtsMain.points.left.x, posThoughtsMain.points.left.y, 2, this.paramsBrain.colorLinks);
        let point2 = this.drawPoint(posThoughtsJump.points.rigth.x, posThoughtsJump.points.rigth.y, 2, this.paramsBrain.colorLinks);
        this.jumpsLinksContainer.addChild(point1);
        this.jumpsLinksContainer.addChild(point2);
    }
    drawJumpsLink(event){
        if(!event) return;
        if(this.posThoughts['jumps'].length>0){
            for(let i=0; i<this.posThoughts['jumps'].length;i++){
                this.drawJumpLink(this.posThoughts['jumps'][i],this.posThoughts.main[0]);
            }
            this.stage.addChild(this.jumpsLinksContainer);
            this.jumpsLinksContainer.on("mouseover",   this.mouseOverLink);
            this.jumpsLinksContainer.on("mouseout", this.mouseOutLink);
            this.stage.update();
        }
    }
    drawSiblingsLink() {
        let P1, P2;
        for (let i = 0; i < this.posThoughts.siblings.length; i++) {
            let posParents = this.ptParent(this.posThoughts.siblings[i].parent.id);            
            if (posParents) {
                P1 = {
                    x: posParents.points.bottom.x,
                    y: this.posThoughts.siblings[i].points.top.y
                };
                P2 = {
                    x: this.posThoughts.siblings[i].points.top.x,
                    y: posParents.points.bottom.y + 35
                };
                this.drawLink(posParents.points.bottom, this.posThoughts.siblings[i].points.top, P1, P2, this.siblingsLinksContainer, this.posThoughts.siblings[i].parent, this.posThoughts.siblings[i], 'sibligns');
                let point2 = this.drawPoint(this.posThoughts.siblings[i].points.top.x, this.posThoughts.siblings[i].points.top.y, 2, this.paramsBrain.colorLinks);
                this.siblingsLinksContainer.addChild(point2);
            }
        }
        this.siblingsLinksContainer.addEventListener('mouseover', this.mouseOverLink);
        this.siblingsLinksContainer.addEventListener('mouseout', this.mouseOutLink);
    }

    
    mouseOverLink = (event) => {
        this.mouseOverUnlink = event.target.unlink ? {typeLink: event.target.typeLink, srcId: event.target.srcId, dstId: event.target.dstId, dstType: event.target.dstType } : false;
        if(this.mouseOverUnlink){
            $('#'+this.mouseOverUnlink.dstType+'-' + this.mouseOverUnlink.dstId + ' > div.brainElement-rightSection > span').addClass('selectedElements');
            if(this.mouseOverUnlink.typeLink == 'sibligns'){
                $('#parents-' + this.mouseOverUnlink.srcId + ' > div.brainElement-rightSection > span').addClass('selectedElements');           
            } else{
                $('#main-' + this.mouseOverUnlink.srcId + ' > div.brainElement-rightSection').addClass('selectedElements');           
            }
        }
        event.target.graphics.clear();      
        event
            .target
            .graphics
            .setStrokeStyle(2)
            .beginStroke(this.paramsBrain.colorHoverLinks)
            .moveTo(event.target.xStarter, event.target.yStarter)
            .bezierCurveTo(
                event.target.xP1,
                event.target.yP1 - 5,
                event.target.xP2,
                event.target.yP2 - 50,
                event.target.xEnd,
                event.target.yEnd
            )
            .endStroke();
        event.target.cursor = 'pointer';
        this.stage.update();
    }

    mouseOutLink = (event) => {
        if(this.mouseOverUnlink){
            $('#'+this.mouseOverUnlink.dstType+'-' + this.mouseOverUnlink.dstId + ' > .brainElement-rightSection > span').removeClass('selectedElements');
            if(this.mouseOverUnlink.typeLink == 'sibligns'){
                $('#parents-' + this.mouseOverUnlink.srcId + ' > div.brainElement-rightSection > span').removeClass('selectedElements');           
            } else{
                $('#main-' + this.mouseOverUnlink.srcId + ' > div.brainElement-rightSection').removeClass('selectedElements');           
            }
        }
        if(!this.inContextMenu) this.mouseOverUnlink = null;  
        event.target.graphics.clear();
        event.target.graphics
        .setStrokeStyle(this.paramsBrain.strokeStyle)
        .beginStroke(this.paramsBrain.colorLinks)
        .moveTo(event.target.xStarter, event.target.yStarter)
        .bezierCurveTo(
            event.target.xP1,
            event.target.yP1 - 5,
            event.target.xP2,
            event.target.yP2 - 50,
            event.target.xEnd,
            event.target.yEnd)
        .endStroke();
        this.stage.update();
    }

    mouseEnter(id){
        let idChoose    = id;   
        let animated    = [];
        let tagsLink    = this.registerLinks.filter(link => {
            return (idChoose == link.srcId || idChoose == link.dstId || (link.srcId && idChoose == link.srcId) || (link.dstId && idChoose == link.dstId));
        });
        for (let i = 0; i < tagsLink.length; i++) {
            let container = this.getContainerType(tagsLink[i].type);
            if(container){
                let element = container.getChildAt(tagsLink[i].linkId);
                if(element){
                    animated.push(element);
                }
            }
            
        }
        this.animatedLinks = animated;
        this.animateLinks(animated,true);
    }
    mouseLeave(){
        this.animateLinks(this.animatedLinks,false);
    }
    mouseOverImage(event, img){
        var viewportW = Math.max(document.documentElement.clientWidth, window.innerWidth   || 0);
        var viewportH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var newstr = img.replace( "\/32\/", "\/500\/");
        let imgToLoad = new Image();
        imgToLoad.src = newstr;
        
        imgToLoad.onload = () => {
            let left =  Math.max(Math.min(event.target.x - imgToLoad.width/2, viewportW - imgToLoad.width),0)
            let top  =  Math.max(Math.min(event.target.y - imgToLoad.height/2, viewportH - imgToLoad.height),0)
        
            this.imageHover = {
                top : top,
                left : left,
                image : newstr,
            }
        };
    }
   
    getImgMarginTop(img) {
        return img.style.marginTop - img.clientHeight
      }
    

    startDrawing() {
      this.clearStage();
      this.drawBrainElements();
    }

    clearStage() {
        
        
        this.oldShownSiblings = [];
        this.animatedLinks = [];
        this.registerLinks = [];

        this.posThoughts.main = [];
        this.posThoughts.children = [];
        this.posThoughts.parents = [];
        this.posThoughts.jumps = [];
        this.posThoughts.siblings = [];

        
        this.stage.removeAllChildren();
        this.stage.removeAllEventListeners();
        
        this.parentLinksContainer.removeAllChildren();
        this.parentLinksContainer.removeAllEventListeners();
        
        this.childrenLinksContainer.removeAllChildren();
        this.childrenLinksContainer.removeAllEventListeners();

        this.jumpsLinksContainer.removeAllChildren();
        this.jumpsLinksContainer.removeAllEventListeners();

        this.siblingsLinksContainer.removeAllChildren();
        this.siblingsLinksContainer.removeAllEventListeners();
  
        this.stage.update();
    }


    drawLink(toStart, toEnd, p1, p2, container, src, dst, typeLink) {
        let top = 0;
        let user ;
        let line = new createjs.Graphics();
        line.setStrokeStyle(this.paramsBrain.strokeStyle).beginStroke(this.paramsBrain.colorLinks);
        line.moveTo(toStart.x, toStart.y + top);
        line.bezierCurveTo(p1.x, (p1.y - 5) + top, p2.x, (p2.y - 50) + top, toEnd.x, toEnd.y + top).endStroke();
        let shape: any = new createjs.Shape(line);
        shape.xStarter = toStart.x;
        shape.yStarter = toStart.y + top;
        shape.xEnd     = toEnd.x;
        shape.yEnd     = toEnd.y + top;
        shape.xP1      = p1.x;
        shape.yP1      = p1.y + top;
        shape.xP2      = p2.x;
        shape.yP2      = p2.y + top;
        shape.unlink   = true;//(src && src.owner && (!dst.isSystem || (user && dst.id == user.personalThought))) ? true : false;
        shape.srcId    = src ? src.id   : null;
        shape.dstId    = dst ? dst.id   : null;
        shape.dstType  = dst ? dst.type : null;
        shape.typeLink = typeLink;
        container.addChild(shape);
        let link =  { 
                      linkId : container.getChildIndex(shape),
                      srcId : shape.srcId,
                      dstId : shape.dstId,
                      type  : typeLink
                    };        
        this.registerLinks.push(link);
        return link;
    }
    drawPoint(x, y, r, color) {
        let point = new createjs.Graphics();
        point.setStrokeStyle(this.paramsBrain.strokeStyle);
        point.beginFill(color);
        point.drawCircle(x, y, 3);
        let ret = new createjs.Shape(point);
        return ret;
    }
    

   ptParent(idParent){
       return this.posThoughts.parents.find((e)=>{return e.id == idParent})
   }
   
    getContainerType(blocName){
          if(blocName == "children")
            return this.childrenLinksContainer;
          if(blocName == "jumps")
            return this.jumpsLinksContainer;
          if(blocName == "parents")
            return this.parentLinksContainer;
          if(blocName == "sibligns")
            return this.siblingsLinksContainer;
    }

    animateLinks(links , bol){
        let strokeChoose = bol ? this.paramsBrain.strokeStyleHover : this.paramsBrain.strokeStyle;
        let colorChoose  = bol ? this.paramsBrain.colorHoverLinks  : this.paramsBrain.colorLinks;
        for (let i = 0; i < links.length; i++) {
            if(links[i]){
                links[i].graphics.clear();       
                links[i].graphics
                .setStrokeStyle(strokeChoose)
                .beginStroke(colorChoose)
                .moveTo( links[i].xStarter,links[i].yStarter)
                .bezierCurveTo(
                    links[i].xP1,
                    links[i].yP1 - 5,
                    links[i].xP2,
                    links[i].yP2 - 50,
                    links[i].xEnd,
                    links[i].yEnd
                )
                .endStroke();
            } 
        }
        this.stage.update();
    }
    resizeBrain($event) {
        this.canvas.nativeElement.height = window.innerHeight;
        this.canvas.nativeElement.width  = window.innerWidth;
        this.stage.width  = window.innerWidth;
        this.stage.heigth = window.innerHeight;
        this.stage.update();
        if(this.timeOutResize){
            clearTimeout(this.timeOutResize);
            this.timeOutResize = null;
        }
        this.timeOutResize =    setTimeout(function(){
                                    this.clearStage();
                                    this.startDrawing();
                                }.bind(this),300);
    }

    drawBrainElementCenter(objet, typeElement, row, col) {

        // if(objet.type == "personal" && objet.owner){
     //     this.drawPlus(positionCss,objet.id,objet);
     // }
     // if(objet.type == "public" && user){
         
     //     let ifExistPin = user.pins.filter( (element) => {
     //         return (element.id_thought == objet.id);
     //     });

     //     if(ifExistPin.length > 0){
     //         this.notInPins = false;
     //     }else{
     //         this.notInPins = true;
     //     }
     // }else{
     //     this.notInPins = false;
     // }
     // if (objet.icon && objet.icon != "" && this.widthwindow > 500) {
     //     let image = new Image();
     //     image.src = objet.icon;
     //     this.changePosMenu(positionCss.rigth,objet.name,objet.owner,objet.isSystem,objet.icon,user && (objet.id == user.personalThought),positionCss.left);
     //     image.onload = function(image){
     //         let objetThought = $("#" + typeElement + '-' + objet.id)[0];
     //         if(objetThought){
     //             let widthMain                = objetThought.offsetWidth;
     //             positionCss.rigth.x = this.posThoughts.main[0].points.top.x + (widthMain / 2);
     //             positionCss.left.x  = (this.posThoughts.main[0].points.top.x - (widthMain / 2));
     //             // brainButton.css({
     //             //     'left': positionCss.left.x + 'px'
     //             // });
     //             $(".brain-plus").remove();
     //             if(objet.type == "personal" && objet.owner){
     //                 this.drawPlus(positionCss,objet.id,objet);
     //             }
     //             // this.drawJumps();
     //             this.changePosMenu(positionCss.rigth,objet.name,objet.owner,objet.isSystem,objet.icon,user && (objet.id == user.personalThought),positionCss.left);
     //         }
     //     }.bind(this);
     // }
     // this.changePosMenu(positionCss.rigth,objet.name,objet.owner,objet.isSystem,objet.icon,user && (objet.id == user.personalThought),positionCss.left);

 }
  
}




//   constructor(
//     private navigationService : NavigationService,
//     private route: ActivatedRoute,
//     private router : Router
//   ) { }


//   close(){
//     this.router.navigate(['.', {outlets: {v: null}}], { relativeTo: this.route.parent });
//   }