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
    public containerBrain;
    public thoughts: any;
    public confBrain;
    public colorLinks;
    public colorHoverLinks;
    public strokeStyle;
    public strokeStyleHover;
    public timeAnnimation;

    public displayedEnv;
    public urlImage;
    public posThoughts;
    public oldShownSiblings = [];
    public subscription;
    public eventMouseOut;

    public timeOutResize = null;
    public nbPageChildren;
    public nbPageParents;
    public nbPageJumps;

    public scrollChildren;
    public scrollJumps;
    public scrollParents;
    public scrollSiblings;

    public mouseOverUnlink = false;
    public inContextMenu;
    public widthwindow = 0;
    public nbParentsDraw = 0;
    public nbSibDraw     = 0;
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
        this.eventMouseOut     = false;
        this.containerBrain    = "BrainContainer";
        this.colorLinks        = "#F26521";//"#9a8406";
        this.colorHoverLinks   = "#FFDD15";
        this.confBrain         = null;
        this.timeAnnimation    = 400;
        this.urlImage          = 'http://apple-time.fr';
        this.oldShownSiblings  = [];
        this.strokeStyle       = 1;
        this.strokeStyleHover  = 1.6;
        this.posThoughts  = {
            'main'     :   [],
            'parents'  :   [],
            'children' :   [],
            'siblings' :   []
        };
        this.displayedEnv = {
            'children' :   [],
            'parents'  :   [],
            'jumps'    :   [],
            'siblings' :   []
        };
        this.nbPageChildren  = 0;
        this.nbPageParents   = 0;
        this.nbPageJumps     = 0;
        this.scrollChildren  = null;
        this.scrollSiblings  = null;
        
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
    }

    ngOnInit() {
       this.nbParentsDraw = 0;
       this.nbSibDraw     = 0;
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
            this.thoughts = this.navigationService.currentThought;
            this.drawBrain();
        }.bind(this));
       });
    }
    
    drawBrain() {
      this.displayedEnv.children = this.returnShownChildren();
      this.displayedEnv.parents  = this.returnShownParents();
      this.displayedEnv.siblings = this.returnShownSiblings();
      this.displayedEnv.jumps = this.returnShownJumps();

      this.startDrawing();
    }
    
    drawBrainElementCenter(objet, typeElement, row, col) {
        let user ;
        let canvasCoord = this.brainService.canvasCoord(
            this.stage, 
            this.confBrain.staticSectionsMeseaures.main, 
            this.confBrain.staticSectionsMeseaures.buttonCoef, 
            col,
            row
        );

      let positionCss = this.brainService.positionCss(canvasCoord);
      if(this.widthwindow > 768 && this.thoughts.parents.length > 0){
        positionCss.bottom.y -= 6;
        positionCss.top.y    += 3;
      }else{
        positionCss.top.y    -= 3;
      }
      this.posThoughts[typeElement].push({
          thoughtElement : objet.id,
          name : objet.name,
          icon : objet.icon !='' ? this.confService.pathOfImages+objet.icon :'',
          points         : positionCss,
          canvasCoord : canvasCoord,
          isSystem       : objet.isSystem,
          owner          : objet.owner,
          id             : objet.id,
          type           : typeElement//objet.type
      }); 


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

    drawBrainElementChildren(objet, typeElement, row, col, origin) {
         let indexElement = 0;
        let pos = this.brainService.canvasCoord(
            this.stage, 
            this.confBrain.staticSectionsMeseaures.children, 
            this.confBrain.staticSectionsMeseaures.buttonCoef, 
            col,
            row
        );
        let pointsCurrentElement = this.brainService.positionCss(pos);
        indexElement =  this.posThoughts[typeElement].push({
            thoughtElement : objet._id,
            name : objet.name,
            icon : '',
            points         : pointsCurrentElement,
            canvasCoord     : pos,
            isSystem       : objet.isSystem,
            owner          : objet.owner,
            id             : objet._id,
            type           : typeElement//objet.type
        });
        this.drawChildrenlink(this.posThoughts.main[0],this.posThoughts[typeElement][indexElement - 1]);
    }

    drawCenter() {
        let mainElement = this.thoughts;
        //this.drawBrainElement(mainElement, 'main', 0, 0, mainElement.origin);
        this.drawBrainElementCenter(mainElement, 'main', 0, 0)
      }

    drawJumps() {
        let jumps = this.displayedEnv.jumps.jumps;
        if (jumps) {
            jumps = jumps[0];
            for (let i = 0; i < jumps.length; i++) {
                if (jumps[i] != 0) {
                    this.drawBrainElement(jumps[i], 'jumps', i, 0, jumps[i].origin);
                }
            }
        }
    }

    drawSiblings() {
        let siblings = this.displayedEnv.siblings.siblings;        
        siblings = siblings[0];
        for (let i = 0; i < siblings.length; i++) {
            if (siblings[i] != 0) {
                this.drawBrainElement(siblings[i], 'siblings', i, 0, siblings[i].origin);
            }
        }    
    }


    drawChildrens() {
        if (this.displayedEnv && this.displayedEnv.children && this.displayedEnv.children.children) {
            for (let i = 0; i < this.displayedEnv.children.children.length; i++) {
                if (this.displayedEnv.children.children[i][0] != 0) {
                    for (let j = 0; j < this.displayedEnv.children.children[i].length; j++) {
                        this.drawBrainElementChildren(this.displayedEnv.children.children[i][j], 'children', j, i, this.displayedEnv.children.children[i][j].origin);
                    }
                }
            }
        }
    }

    drawTheBrain() {
        this.canvas.nativeElement.height = window.innerHeight;
        this.canvas.nativeElement.width  = window.innerWidth;
        this.stage.width  = window.innerWidth;
        this.stage.heigth = window.innerHeight;
        this.drawCenter();
        this.drawChildrens();
        this.drawParents();
        this.drawJumps();
        this.drawSiblings();
    }

   

    startDrawing() {
      this.prepareTheBrain();
      this.drawTheBrain();
    }

    prepareTheBrain() {
        this.oldShownSiblings = [];
        this.animatedLinks = [];
        this.registerLinks = [];
        this.nbParentsDraw = 0;
        this.nbSibDraw     = 0;

        this.posThoughts.main = [];
        this.posThoughts.children = [];
        this.posThoughts.parents = [];
        this.posThoughts.jumps = [];
        this.posThoughts.siblings = [];

        $('#BrainContainer').empty();
        this.clearContainers();
    }

    clearContainers() {
      this.stage.removeAllChildren();
      this.stage.removeAllEventListeners();
      // container link parents
      this.parentLinksContainer.removeAllChildren();
      this.parentLinksContainer.removeAllEventListeners();
      // container link children
      this.childrenLinksContainer.removeAllChildren();
      this.childrenLinksContainer.removeAllEventListeners();
      // container link jumps
      this.jumpsLinksContainer.removeAllChildren();
      this.jumpsLinksContainer.removeAllEventListeners();
      // container links siblings
      this.siblingsLinksContainer.removeAllChildren();
      this.siblingsLinksContainer.removeAllEventListeners();

      this.stage.update();
    }

    drawLink(toStart, toEnd, p1, p2, container, src, dst, typeLink) {
        let top = 0;
        let user ;
        let line = new createjs.Graphics();
        line.setStrokeStyle(this.strokeStyle).beginStroke(this.colorLinks);
        line.moveTo(toStart.x, toStart.y + top);
        line.bezierCurveTo(p1.x, (p1.y - 5) + top, p2.x, (p2.y - 50) + top, toEnd.x, toEnd.y + top).endStroke();
        let shape: any = new createjs.Shape(line);
        if(dst && dst.id && dst.id)
            dst.id = dst.id;
        if(src && src.id && src.id)
            src.id = src.id;
        shape.xStarter = toStart.x;
        shape.yStarter = toStart.y + top;
        shape.xEnd     = toEnd.x;
        shape.yEnd     = toEnd.y + top;
        shape.xP1      = p1.x;
        shape.yP1      = p1.y + top;
        shape.xP2      = p2.x;
        shape.yP2      = p2.y + top;
        shape.unlink   = (src && src.owner && (!dst.isSystem || (user && dst.id == user.personalThought))) ? true : false;
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
    
    drawBrainElement(objet, typeElement, row, col, origin) {
        let indexElement = 0;
        let user;// = <any> Meteor.user();        
        if (typeof objet.name != "string") {
            objet.name = objet.name.toString();
        }
        if (objet.name.length > 0)
            this.getParamsThought(typeElement, row, col, function (pos) {
                let pointsCurrentElement;
                if (typeElement != "main") {
                    if (typeElement == "siblings") {
                        let parents = [objet.parent];
                        pointsCurrentElement = this.calculatePoints(pos.x, pos.y, pos.buttonHeight, pos.buttonWidth, pos.heightStep, pos.widthStep);
                        indexElement =  this.posThoughts[typeElement].push({
                                            thoughtElement        : objet.id,
                                            thoughtParentsElement : parents,
                                            points                : pointsCurrentElement,
                                            isSystem              : objet.isSystem,
                                            owner                 : objet.owner,
                                            id                    : objet.id,
                                            type                  : objet.type
                                        });
                        this.nbSibDraw++;
                        this.verifyDrawedParentAndSibligns();
                    } else {
                        pointsCurrentElement = this.calculatePoints(pos.x, pos.y, pos.buttonHeight, pos.buttonWidth, pos.heightStep, pos.widthStep);
                        indexElement =  this.posThoughts[typeElement].push({
                                            thoughtElement : (objet.id || objet.id),
                                            points         : pointsCurrentElement,
                                            isSystem       : objet.isSystem,
                                            owner          : objet.owner,
                                            id             : (objet.id || objet.id),
                                            type           : objet.type
                                        });
                    }
                } else {
                    pointsCurrentElement = this.calculatePoints(pos.x, pos.y, pos.buttonHeight, pos.buttonWidth, pos.heightStep, pos.widthStep);
                    if(this.widthwindow > 768 && this.thoughts.parents.parents.length > 0){
                        pointsCurrentElement.bottom.y -= 6;
                        pointsCurrentElement.top.y    += 3;
                    }else{
                        pointsCurrentElement.top.y    -= 3;
                    }
                    indexElement =  this.posThoughts[typeElement].push({
                                        thoughtElement : objet.id,
                                        points         : pointsCurrentElement,
                                        isSystem       : objet.isSystem,
                                        owner          : objet.owner,
                                        id             : objet.id,
                                        type           : objet.type
                                    });
                }
                let classBrain = "brainElement-rightSection ";
                let stylep = ""
                let classSpan = " brainSpanaElement";
                let widthBtn = "width:" + pos.buttonWidth + "px;";
                let imageHtml = "";
                let brainClassText = "brainText";
                let classImage = "imageBrain";
                let classContainer = '';
                if (typeElement == "main") {
                    widthBtn        = "";
                    classSpan       = "mainSpan";
                    brainClassText  = "brainTextMain";
                    classBrain     += "brainMainThought";
                    classImage      = "imageMainBrain";
                }
                if (objet.icon && objet.icon != "" && this.widthwindow > 500) {
                    if(user && objet.id == user.personalThought && this.cropService.getcropData() !== undefined){
                        objet.icon = this.cropService.getcropData();
                    }
                    imageHtml = `<img class="` + classImage + `" src="` + objet.icon + `">`;
                    stylep += "padding-right:1px;";
                }
                let nameThought = "";
                let tooltip = "";
                nameThought = objet.name;
                if (objet.name && objet.name.replace) {
                    if (typeElement != "main" && nameThought.length > this.maxLengthTextBrain) {
                        tooltip = `<span class="tooltiptextBrain tooltip-bottom">` + nameThought + `</span>`;
                        nameThought = nameThought.slice(0, this.maxLengthTextBrain) + "...";
                    }
                    else if(typeElement == "main" && nameThought.length > this.maxLengthTextMain){
                        tooltip = `<span class="tooltiptextBrain tooltip-bottom">` + nameThought + `</span>`;
                        nameThought = nameThought.slice(0, this.maxLengthTextMain) + "...";
                    }
                }
                nameThought     = $('<div />').text(nameThought).html();
                let brainButton = $(`<div id="` + typeElement + '-' + objet.id + `" data-placement="left"  node-type="` + typeElement + `" class="brainElement brainCon  animated zoomIn noselect" style="height: ` + pos.buttonHeight + `px; top: ` + pos.y + `px; left: ` + pos.x + `px; ` + widthBtn + `">
                                        <div class="` + classBrain + ` tooltipBrain" style="width : 100%;">
                                            <span class="brainSpana ` + classSpan + ` ">
                                                ` + imageHtml + `
                                                <p class=" brainText-desktop ` + brainClassText + `" style="` + stylep + `">
                                                    ` + nameThought + `
                                                </p>
                                            </span>
                                            ` + tooltip + `
                                        </div>
                                    </div>`);
                $('#' + this.containerBrain).append(brainButton);
                if(typeElement == "children"){
                    this.drawChildrenlink(this.posThoughts.main[0],this.posThoughts[typeElement][indexElement - 1]);
                }else if(typeElement == "parents"){
                    this.nbParentsDraw ++;
                    this.verifyDrawedParentAndSibligns();
                    let posT = this.posThoughts.main[0];
                    this.drawParentLink(this.posThoughts.main[0],this.posThoughts[typeElement][indexElement - 1]);
                }                
                brainButton.click(function (event: any) {
                    if($(event.target)[0].className.search('brainElement') == -1){
                        let secondView = this.superpositionService.returnActiveSecondView();
                        if (secondView == "mosaic"  && !objet.hasmosaic) {
                            secondView = "hexaBank";
                        }
                        if ((secondView == "hexaBank" || secondView == "squareBank" || secondView == "imageBank")  && objet.hasmosaic) {
                            secondView = "mosaic";
                        }
                        if (!secondView) {
                            secondView = "";
                        } else {
                            secondView = "-" + secondView;
                        }
                        if (this.brainMode == 'nav'){
                            let mainThought = this.navigationService.returnThoughts().mainThought;
                            if(objet.id == mainThought.id){
                                this.clickInCanvas();
                            }else{
                                $(".brainClick").removeClass('brainClick');
                                $(event.currentTarget).find('span').addClass('brainClick');
                                this.router.navigate(['/navigation/brain' + secondView + '/' + objet.type + '/' + objet.id]);
                            }
                        }
                    }
                }.bind(this));
                if(user){
                    brainButton.on("dragover", function(event) {
                        event.preventDefault();  
                        event.stopPropagation();
                        if(objet.owner && (!objet.isSystem || objet.id == user.personalThought) ){
                            brainButton.addClass('dropingImg');
                        }else{
                            brainButton.addClass('warnDroping');
                        }
                    }.bind(this));
                    brainButton.on("dragleave", function(event) {
                        event.preventDefault();  
                        event.stopPropagation();
                        brainButton.removeClass('dropingImg warnDroping');
                    });
                    // brainButton.on("drop", function(event) {
                    //     event.preventDefault();
                    //     event.stopPropagation();
                    //     brainButton.removeClass('dropingImg warnDroping');
                    //     if(objet.owner && !objet.isSystem){
                    //         let files = event.originalEvent.dataTransfer ? event.originalEvent.dataTransfer.files : event.originalEvent.target.files;
                    //         let url;
                    //         if(event.originalEvent.dataTransfer && event.originalEvent.dataTransfer.getData('text/html')){
                    //             let imageUrl = event.originalEvent.dataTransfer.getData('text/html');
                    //             let rex = /src="?([^"\s]+)"?\s*/;
                    //             url = rex.exec(imageUrl);
                    //         }
                    //         if((url && url[1]) || (files && files.length > 0)){
                    //             this.config.data.type         = 1;
                    //             this.config.data.title        = "Upload Photos";
                    //             this.config.data.accept       = "image/*";
                    //             this.config.data.store        = "photos";
                    //             this.config.data.idThought    = objet.id;
                    //             this.config.data.dataTransfer = event.originalEvent.dataTransfer;
                    //             let dialogRef = this.dialog.open(UploadAttachement,this.config);
                    //             dialogRef.afterClosed().subscribe(result => {});
                    //         }
                    //     }
                    // }.bind(this));
                }
                brainButton.find('span').mouseenter(function(event){
                    let idChoose    = objet.id || objet.id;   
                    let animated    = [];
                    let tagsLink    = this.registerLinks.filter(function(link){
                        if(idChoose == link.srcId || idChoose == link.dstId || (link.srcId && idChoose == link.srcId) || (link.dstId && idChoose == link.dstId))
                            return true;
                        return false;
                    }.bind(this));
                    for (let i = 0; i < tagsLink.length; i++) {
                        let container = this.getContainerType(tagsLink[i].type);
                        let element   = undefined;
                        if(container) element = container.getChildAt(tagsLink[i].linkId);
                        if(element){
                            animated.push(element);
                        }
                    }
                    this.animatedLinks = animated;
                    this.animateLinks(animated,true);
                }.bind(this));

                brainButton.find('span').mouseleave(function(event){
                    this.animateLinks(this.animatedLinks,false);
                }.bind(this));

                if(objet.icon && objet.icon != ""){
                    brainButton.find("img").mouseover(function(event){
                        this.eventMouseOut = false;
                        this.showImage($(event.target),objet.icon);
                    }.bind(this)).mouseout(function(event){
                        this.imgToLoad.onload = null;
                        this.eventMouseOut = true;
                        $('#brainElementInfoBulle').remove();
                        $('#brainElementInfoBulleCadre').remove();
                    }.bind(this));    
                }
                let posMainTopx = this.posThoughts.main[0].points.top.x;
                if (typeElement == "main") {
                    let xImage = 0;
                    if (objet.icon && objet.icon != "") {
                        xImage = 7;
                    }
                    let widthMain = 0;
                    let selectElement = $("#" + typeElement + '-' + objet.id)[0];
                    if(selectElement)
                        widthMain = selectElement.offsetWidth;
                    pointsCurrentElement.rigth.x = this.posThoughts.main[0].points.top.x + (widthMain / 2)  ;
                    pointsCurrentElement.left.x = (this.posThoughts.main[0].points.top.x - (widthMain / 2) );
                    brainButton.css({
                        'left': pointsCurrentElement.left.x + 'px'
                    });
                    // $("#main-Click").css({
                    //     'left': pointsCurrentElement.left.x + 'px',
                    //     'top' : pos.y
                    // });
                    if(objet.type == "personal" && objet.owner){
                        this.drawPlus(pointsCurrentElement,objet.id,objet);
                    }
                    if(objet.type == "public" && user){
                        
                        let ifExistPin = user.pins.filter( (element) => {
                            return (element.id_thought == objet.id);
                        });

                        if(ifExistPin.length > 0){
                            this.notInPins = false;
                        }else{
                            this.notInPins = true;
                        }
                    }else{
                        this.notInPins = false;
                    }
                    if (objet.icon && objet.icon != "" && this.widthwindow > 500) {
                        let image = new Image();
                        image.src = objet.icon;
                        console.log(pointsCurrentElement);
                        //  if()
                        this.changePosMenu(pointsCurrentElement.rigth,objet.name,objet.owner,objet.isSystem,objet.icon,user && (objet.id == user.personalThought),pointsCurrentElement.left);
                        image.onload = function(image){
                            let objetThought = $("#" + typeElement + '-' + objet.id)[0];
                            if(objetThought){
                                let widthMain                = objetThought.offsetWidth;
                                pointsCurrentElement.rigth.x = this.posThoughts.main[0].points.top.x + (widthMain / 2);
                                pointsCurrentElement.left.x  = (this.posThoughts.main[0].points.top.x - (widthMain / 2));
                                brainButton.css({
                                    'left': pointsCurrentElement.left.x + 'px'
                                });
                                $(".brain-plus").remove();
                                if(objet.type == "personal" && objet.owner){
                                    this.drawPlus(pointsCurrentElement,objet.id,objet);
                                }
                                // this.drawJumps();
                                this.changePosMenu(pointsCurrentElement.rigth,objet.name,objet.owner,objet.isSystem,objet.icon,user && (objet.id == user.personalThought),pointsCurrentElement.left);
                            }
                        }.bind(this);
                    }
                    this.changePosMenu(pointsCurrentElement.rigth,objet.name,objet.owner,objet.isSystem,objet.icon,user && (objet.id == user.personalThought),pointsCurrentElement.left);
                } else if (typeElement == "jumps") {
                    for (let i = 0; i < this.posThoughts[typeElement].length; i++) {
                        if (this.posThoughts[typeElement][i].thoughtElement == objet.id) {
                            this.posThoughts[typeElement][i].points.rigth.x = brainButton[0].offsetLeft + brainButton[0].children[0].children[0].offsetWidth + brainButton[0].children[0].children[0].offsetLeft + 9;
                            this.drawJumpLink(this.posThoughts[typeElement][i],this.posThoughts.main[0]);
                        }
                    }
                }
                if (typeElement == 'main' && this.brainMode == 'add') {
                    let Elementtop = $(brainButton)[0].offsetTop;
                    let elementLeft = $(brainButton)[0].offsetLeft;
                    let top = Elementtop - 54;
                    let left = elementLeft + 50 + $(brainButton)[0].offsetWidth / 2;
                    let bottom = window.innerHeight - $(brainButton)[0].offsetTop - 10;
                    let right = window.innerWidth - $(brainButton)[0].offsetLeft - 5 + 50;
                    let rightText = 100;
                    if(window.innerWidth < 700){
                        rightText = -265;
                    }
                    let nameBtn = this.navigationService.getStatePbrain();
                    let styleBtn = "";
                    
                    if (this.addBrainConf.crop) {
                        let image = this.addBrainConf.data ? this.addBrainConf.data : (this.confService.returnImagesPath()+ this.addBrainConf.dataSelection[0].image.replace('1000','250'));
                        if(nameBtn == "déplacer"){
                            styleBtn =  "left: calc(50% - 21px);";
                        }else{
                            styleBtn = "left: calc(50% - 17px);";
                        }
                         var wrapper =                            
                            '<p class="textPBrain" id="textPbrain" style="bottom : ' + (bottom + 40) + 'px; right:' + (right + rightText) + 'px;">Choose a thought on your map and click on ' + nameBtn + '</p>' +
                            '<div id="brain-infosBull-wrapperID" class="brain-infosBull-wrapper " style="bottom : ' + bottom + 'px; right:' + right + 'px;" >' +
                            '<img src = "' + image  + '" style="width: 150px;position:relative;top:0;display:block; padding: 10px;"/>' +
                            '<button style="' + styleBtn + '" class="btnCopierPbrain">' + nameBtn + '</button>' +
                            // '<img id="image-calc-Id" src = "/images/brain/send-to.png" style="width:105px;position:absolute;top:0;"/>' +
                            // '<img id="pbrainFleche" src="/images/brain/send-to-fleche.png" style="position:fixed;display:none;transform: rotate(-20deg);bottom : ' + (bottom + 50) + 'px;right : ' + right + 'px;"' +
                            '</div>';
                    } else {
                        if(nameBtn == "déplacer"){
                            styleBtn =  "left: calc(50% - 43px);";
                        }else{
                            styleBtn = "left: calc(50% - 35px);";
                        }
                        if(this.addBrainConf.selection){
                            var images = '';
                            
                            for(let i=1,j=3;i<this.addBrainConf.dataSelection.length && i<4;i++,j+=3){
                                images += '<img class="" src = "' +this.confService.returnImagesPath() + this.addBrainConf.dataSelection[i].image + '" style="height : 130px; width:100px;position:absolute;top:'+j+'px;left:'+j+'px;display:block;"/>';
                            }                            

                            let sendToImage = '/images/brain/send-to-photos.png';
                            if(objet.origin == 'friends')
                                sendToImage = '/images/brain/send-to-photos-friends.png';
                            
                            var wrapper =
                                '<p class="textPBrain" id="textPbrain" style="bottom : ' + (bottom + 40) + 'px; right:' + (right + rightText) + 'px;">Choose a thought on your map and click on ' + nameBtn + '</p>' +                                
                                '<div id="brain-infosBull-wrapperID" class="brain-infosBull-wrapper" style="bottom : ' + bottom + 'px; right:' + right + 'px;width: auto;" >' +
                                '<img class="" src = "' +this.confService.returnImagesPath() + this.addBrainConf.dataSelection[0].image + '" style="height : 130px; width:100px;position:relative;top:0;display:block;"/>' +
                                '<button style="' + styleBtn + '" class="btnCopierPbrain">' + nameBtn + '</button>' +
                                // '<img id="send-to-photos" src="'+sendToImage+'" style=" width:60px;height:auto;position:absolute;z-index:2;display:block;left: calc(50% - 31px);top: calc(50% - 46px);" />' +
                                // '<img id="pbrainFleche" src="/images/brain/send-to-fleche.png" style="position:fixed;display:none;transform: rotate(-20deg);bottom : ' + (bottom + 65) + 'px;right : ' + right + 'px;"/>' +
                                images +
                                '</div>';       
                        }
                    }
                    $('#' + this.containerBrain).append(wrapper);
                    $('.pbrainAnimate').css('animation', 'pbrainanimate 0.7s');
                    let wrapperHeight = this.addBrainConf.crop ? 100 : 130;
                    
                    let rightToAdd = (window.innerWidth-$(brainButton)[0].offsetLeft ) -($(brainButton)[0].offsetWidth/2) ;
                    this.pbrainAnnimation = setInterval(() => {
                        $('#pbrainFleche').css('transform',' rotate(-20deg)');
                        $('.pbrainAnimate').css('animation', '');
                        $('#pbrainFleche').css({ 'bottom': (bottom + wrapperHeight/2) + 'px', 'right': right + 'px'});
                        $('#pbrainFleche').fadeIn();
                        $('#pbrainFleche').animate({
                            bottom: bottom-30+'px',
                            right:   rightToAdd +'px',
                        }, {
                                duration: 1000,
                                specialEasing: {bottom: 'easeInQuad', right: 'easeOutQuad'},
                                progress : ( animation,  progress, remainingMs)=>{                                    
                                    if(progress > 0.3 && progress < 0.39)
                                        $('#pbrainFleche').css('transform',' rotate(5deg)');
                                    else if(progress > 0.4 && progress < 0.49)
                                        $('#pbrainFleche').css('transform',' rotate(10deg)');
                                    else if(progress > 0.5 && progress < 0.59)
                                        $('#pbrainFleche').css('transform',' rotate(20deg)');
                                    else if(progress > 0.6 && progress < 0.69)
                                        $('#pbrainFleche').css('transform',' rotate(30deg)');
                                    else if(progress > 0.7 && progress < 0.79)
                                        $('#pbrainFleche').css('transform',' rotate(40deg)');
                                    else if(progress > 0.8 )
                                        $('#pbrainFleche').css('transform',' rotate(50deg)');
                                },
                                complete:  ()=> {
                                    $(brainButton).css('animation','scaleAnimation 0.5s');
                                    $('#pbrainFleche').css('display', 'none');
                                    $('#pbrainFleche').css('transform',' rotate(-20deg)');
                                    
                                    $('.pbrainAnimate').css('animation', 'pbrainanimate 0.7s');
                                    setTimeout(function() {
                                        $(brainButton).css('animation','none');                   
                                    },500);
                                }
                            });
                    }, 2200);
                    $('#brain-infosBull-wrapperID').on('mouseover', function (event) {
                        if (this.addBrainConf.crop)
                            $('#image-calc-Id').attr('src', '/images/brain/send-to-valid.png');                            
                        else{
                             if(objet.origin == 'friends' )
                                $('#send-to-photos').attr('src', '/images/brain/send-to-photos-valid-friends.png');
                             else 
                                $('#send-to-photos').attr('src', '/images/brain/send-to-photos-valid.png');         
                        }
                    }.bind(this));

                    $('#brain-infosBull-wrapperID').on('mouseout', function (event) {
                        if (this.addBrainConf.crop)
                            $('#image-calc-Id').attr('src', '/images/brain/send-to.png');                            
                        else{
                             if(objet.origin == 'friends' )
                                $('#send-to-photos').attr('src', '/images/brain/send-to-photos-friends.png');
                             else 
                                $('#send-to-photos').attr('src', '/images/brain/send-to-photos.png');         
                        }
                    }.bind(this));

                    $('#closeBtn').on('click', function (event) {
                        $('.container-pbrain-help').remove();
                    }.bind(this));

                    $('#brain-infosBull-wrapperID').on('click', function (event) {
                        this.savePBrainContent(objet);
                    }.bind(this));
                }
            }.bind(this));
    }

    changePosMenu(posR,name,owner,isSystem,icon,personal,posL){        
        this.posMenu    = (this.posMenu != 0 && !owner) ? 22 : 5;
        let marginTop   = owner ? 20 : 13;
        let marginRight = -2;
        ((!isSystem || personal) && owner && icon) && (marginRight = 5);
        ((!isSystem || personal) && owner && icon) && (marginTop -= 3);
        
        
        $("#divMenuT").css({top:posR.y - marginTop + 1 ,left:posR.x  + this.posMenu - marginRight -2 });
        $("#divMenuLeft").css({top:posL.y - 23 ,left:posL.x  + this.posMenu - 20});
        this.posMenu = 0;
    }

    changePosViews(pos){
        $("#divNavigate").css({top:pos.y - 30  ,left:pos.x - 15});
    }


    returnShownChildren() {
        let children;
        let childrenState;
        children = this.navigationService.returnDisplayedChildren(this.thoughts);
        childrenState = this.navigationService.getBlocState("children");
        let cl, ll, len = children.length;
        let ch = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        if (len == 0) {
            cl = 0;
            ll = 0;
        } else {
            let cfg = this.confBrain.staticSectionsMeseaures.children.drawingPattern;
            ch = JSON.parse(JSON.stringify(cfg[0].matrix.slice()));
            cl = cfg[0].col;
            for (let i = 1; i < cfg.length; i++) {
                if (cfg[i].cond != -1 && len <= cfg[i].cond) {
                    ch = JSON.parse(JSON.stringify(cfg[i].matrix.slice()));
                    cl = cfg[i].col;
                    i = cfg.length;
                }
            }
            ll = Math.ceil(len / cl);
        }

        for (let i = 0, k = 0; i < ch.length; i++) {
            if (ch[i].length == 0) {
                for (let j = 0; j < ll; j += 1) {
                    if (k < children.length) {
                        ch[i].push(children[k]);
                        k += 1;
                    } else {
                        break;
                    }
                }
            }
        }
        return {
            children: ch,
            index: childrenState.index,
            capacity: childrenState.capacity,
            totalLength: childrenState.total
        }
    }

    returnShownSiblings() {
        let pars;
        let nbActiveS = 0;
        pars = this.navigationService.returnDisplayedParents(this.thoughts);
        let stateSib = this.navigationService.getBlocState('siblings');
        let sbls = [];
        pars.forEach(function (doc) {
            if (doc.children) {
                sbls = sbls.concat(doc.children);                
                doc.children.forEach(function (child) {
                    child.parent = doc;
                });
            }
        });
        let sbsNoSiblings = sbls.filter( (obj) => {
            if (this.oldShownSiblings)
                return (this.oldShownSiblings.map(function (e) {
                    return e.id;
                }).indexOf(obj.id) == -1);
            else
                return [];
        });
        this.oldShownSiblings = this.oldShownSiblings.concat(sbsNoSiblings);
        sbls = sbls.slice((stateSib.index * stateSib.capacity),((stateSib.index+1) * stateSib.capacity) );
        nbActiveS = sbls.length;
        let emptyness = this.confBrain.staticSectionsMeseaures.siblings.nodesCapacity - sbls.length;
        let diff;
        let temp;
        if (emptyness > 0) {
            diff = Math.ceil(emptyness / 2);
            temp = [];
            for (let i = 0; i < diff; i++) {
                temp.push(0);
            }
            for (let i = 0; i < sbls.length; i++) {
                temp.push(sbls[i]);
            }
            sbls = temp;
        }
        sbls = [sbls];
        return {
            siblings: sbls,
            index: stateSib.index,
            capacity: stateSib.capacity,
            totalLength: stateSib.total,
            nbActiveS : nbActiveS
        };
    }
    
    returnDisplayedCenter() {
        return this.thoughts.mainThought;
    }

    returnShownJumps() {
        let jmps;
        let jumpsState;
        jmps = this.navigationService.returnDisplayedJumps(this.thoughts);
        jumpsState = this.navigationService.getBlocState("jumps");
        let emptyness = jumpsState.capacity - jmps.length;
        if (emptyness > 0) {
            let diff = Math.ceil(emptyness / 2);
            let temp = [];
            for (let i = 0; i < diff; i++) {
                temp.push(0);
            }
            for (let i = 0; i < jmps.length; i++) {
                temp.push(jmps[i]);
            }
            jmps = temp;
        }
        jmps = [jmps];
        return {
            jumps: jmps,
            index: jumpsState.index,
            capacity: jumpsState.capacity,
            totalLength: jumpsState.total
        }
    }

    returnShownParents() {
        let par, parState;
        par = this.navigationService.returnDisplayedParents(this.thoughts);
        parState = this.navigationService.getBlocState("parents");

        let cl, ll, len = par.length;
        let ch = [
            [],
            [],
            []
        ];
        if (len == 0) {
            cl = 0;
            ll = 0;
        } else {
            let cfg = this.confBrain.staticSectionsMeseaures.parents.drawingPattern;
            ch = JSON.parse(JSON.stringify(cfg[0].matrix.slice()));
            cl = cfg[0].col;
            for (let i = 1; i < cfg.length; i++) {
                if (cfg[i].cond != -1 && len == cfg[i].cond) {
                    ch = JSON.parse(JSON.stringify(cfg[i].matrix.slice()));
                    cl = cfg[i].col;
                    i = cfg.length;
                }
            }
            ll = Math.ceil(len / cl);
        }

        for (let i = 0, k = 0; i < ch.length; i++) {
            if (ch[i].length == 0) {
                for (let j = 0; j < ll; j += 1) {
                    if (k < par.length) {
                        ch[i].push(par[k]);
                        k += 1;
                    } else {
                        break;
                    }
                }
            }
        }

        return {
            parents: ch,
            index: parState.index,
            capacity: parState.capacity,
            totalLength: parState.total,
            nbActiveP: par.length
        };
    }
    
    drawChildrenlink(posThoughtsMain, posThoughtsChildren){
        let ch = this.displayedEnv.children.children;
        let mainDiv = $('[node-type="main"]')[0];
        if (this.posThoughts && this.posThoughts.main && this.posThoughts.main.length > 0 && mainDiv) {
            posThoughtsMain.points.left.x = mainDiv.offsetLeft - 5;
        }
        let P1, P2;
        let p1 = {
            x: posThoughtsMain.points.bottom.x,
            y: posThoughtsChildren.points.top.y - 3
        };
        let p2 = {
            x: posThoughtsChildren.points.top.x,
            y: posThoughtsChildren.points.top.y + 3
        };
        this.drawLink(posThoughtsMain.points.bottom, posThoughtsChildren.points.top, p1, p2, this.childrenLinksContainer, posThoughtsMain, posThoughtsChildren, 'children');
        let point1 = this.drawPoint(posThoughtsMain.points.bottom.x, posThoughtsMain.points.bottom.y, 2, this.colorLinks);
        let point2 = this.drawPoint(posThoughtsChildren.points.top.x, posThoughtsChildren.points.top.y, 2, this.colorLinks);
        this.childrenLinksContainer.addChild(point1);
        this.childrenLinksContainer.addChild(point2);
        this.childrenLinksContainer.on("mouseover", function (event: any) {
            this.mouseOverUnlink = event.target.unlink ? {typeLink: event.target.typeLink, srcId: event.target.srcId, dstId: event.target.dstId, dstType: event.target.dstType } : false;
            $('#children-' + event.target.dstId + ' > div.brainElement-rightSection > span').addClass('selectedElements');
            $('#main-' + event.target.srcId + ' > div.brainElement-rightSection ').addClass('selectedElements');
            event.target.graphics.clear();
            event
                .target
                .graphics
                .setStrokeStyle(2)
                .beginStroke(this.colorHoverLinks)
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
        }.bind(this));

        this.childrenLinksContainer.on("mouseout", function (event: any) {
            if(!this.inContextMenu){
                this.mouseOverUnlink = null;            
            }
            $('#children-' + event.target.dstId + ' > div.brainElement-rightSection > span').removeClass('selectedElements');
            $('#main-' + event.target.srcId + ' > div.brainElement-rightSection ').removeClass('selectedElements');
            event.target.graphics.clear();
            event
                .target
                .graphics
                .setStrokeStyle(this.strokeStyle)
                .beginStroke(this.colorLinks)
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
            this.stage.update();
        }.bind(this));
        this.stage.addChild(this.childrenLinksContainer);
        this.stage.update();
    }

    calculatePoints(x, y, h, w, steph, stepw) {
        return {
            top: {
                x: x + (w / 2),
                y: y
            },
            bottom: {
                x: x + (w / 2),
                y: y + h
            },
            left: {
                x: x - (w / 2),
                y: y + (h / 2)
            },
            rigth: {
                x: x + (w / 2),
                y: y + (h / 2)
            }
        }
    }
    

    returnPoints(id, type) {
        for (let i = 0; i < this.posThoughts[type].length; i++) {
            if (this.posThoughts[type][i].thoughtElement == id) {
                return this.posThoughts[type][i].points;
            }
        }
        return {};
    }

    returnMainPoints() {
        return this.returnPoints(this.thoughts.mainThought.id, 'main');
    }

    drawPoint(x, y, r, color) {
        let point = new createjs.Graphics();
        point.setStrokeStyle(this.strokeStyle);
        point.beginFill(color);
        point.drawCircle(x, y, 3);
        let ret = new createjs.Shape(point);
        return ret;
    }

    drawParents() {
        let parents = this.displayedEnv.parents.parents;
        if (parents) {
            for (let i = 0; i < parents.length; i++) {
                if (parents[i][0] != 0) {
                    for (let j = 0; j < parents[i].length; j++) {
                        this.drawBrainElement(parents[i][j], 'parents', j, i, parents[i][j].origin);
                    }
                }
            }
        }
    }

    drawParentLink(posThoughtsMain,posThoughtsParent) {
        let P1, P2, linkIndex;        
        if(this.thoughts.parents.length == 1){            
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
            
            let point2 = this.drawPoint(posThoughtsParent.points.bottom.x, posThoughtsParent.points.bottom.y, 2, this.colorLinks);
            let point1 = this.drawPoint(posThoughtsMain.points.top.x, posThoughtsMain.points.top.y, 2, this.colorLinks);
            this.parentLinksContainer.addChild(point1);
            this.parentLinksContainer.addChild(point2);
            this.parentLinksContainer.addEventListener("mouseover", function (event: any) {
            this.mouseOverUnlink = event.target.unlink ? {typeLink: event.target.typeLink, srcId: event.target.srcId, dstId: event.target.dstId, dstType: event.target.dstType } : false;
                $('#parents-' + event.target.dstId + ' > .brainElement-rightSection > span').addClass('selectedElements');
                $('#main-' + event.target.srcId + ' > .brainElement-rightSection').addClass('selectedElements');
                event.target.graphics.clear();                        
                let parentLinkxDefor = (this.widthwindow > 768 ) ? 15 : 10;
                let parentLinkyDefor = (this.widthwindow > 768 ) ? 50 : 2;
                event.target.graphics
                .setStrokeStyle(this.strokeStyleHover)
                .beginStroke(this.colorHoverLinks)               
                .moveTo(event.target.xStarter, event.target.yStarter)
                .bezierCurveTo(
                    event.target.xP1,
                    event.target.yP1 - parentLinkxDefor,
                    event.target.xP2,
                    event.target.yP2 - parentLinkyDefor,
                    event.target.xEnd,
                    event.target.yEnd)
                .endStroke();
                event.target.cursor = 'pointer';
                     this.stage.update();
            }.bind(this));

            this.parentLinksContainer.addEventListener("mouseout", function (event: any) {
                if(!this.inContextMenu){
                    this.mouseOverUnlink = null;            
                }
                 $('#parents-' + event.target.dstId + ' > .brainElement-rightSection > span').removeClass('selectedElements');
                $('#main-' + event.target.srcId + ' > .brainElement-rightSection').removeClass('selectedElements');
                let parentLinkxDefor = (this.widthwindow > 768 ) ? 15 : 10;
                let parentLinkyDefor = (this.widthwindow > 768 ) ? 50 : 2;
            
                event.target.graphics.clear();
                event.target.graphics
                .setStrokeStyle(this.strokeStyle)
                .beginStroke(this.colorLinks)
                .moveTo(event.target.xStarter, event.target.yStarter)
                .bezierCurveTo(
                    event.target.xP1,
                    event.target.yP1 - parentLinkxDefor,
                    event.target.xP2,
                    event.target.yP2 - parentLinkyDefor,
                    event.target.xEnd,
                    event.target.yEnd)
                .endStroke();
                this.stage.update();
            }.bind(this));
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
            let point1 = this.drawPoint(posThoughtsMain.points.top.x, posThoughtsMain.points.top.y, 2, this.colorLinks);
            let point2 = this.drawPoint(posThoughtsParent.points.bottom.x, posThoughtsParent.points.bottom.y, 2, this.colorLinks);
            this.parentLinksContainer.addChild(point1);
            this.parentLinksContainer.addChild(point2);
        }
        this.parentLinksContainer.addEventListener("mouseover", function (event: any) {
            this.mouseOverUnlink = event.target.unlink ? {typeLink: event.target.typeLink, srcId: event.target.srcId, dstId: event.target.dstId, dstType: event.target.dstType } : false;
            $('#parents-' + event.target.dstId + ' > .brainElement-rightSection > span').addClass('selectedElements');
            $('#main-' + event.target.srcId + ' > .brainElement-rightSection').addClass('selectedElements');
            let parentLinkxDefor = (this.widthwindow > 768 ) ? 15 : 10;
            let parentLinkyDefor = (this.widthwindow > 768 ) ? 50 : 2;
            event.target.graphics.clear();
            event.target.graphics
            .setStrokeStyle(this.strokeStyleHover)
            .beginStroke(this.colorHoverLinks)
             .moveTo(event.target.xStarter, event.target.yStarter)
            .bezierCurveTo(
                event.target.xP1,
                event.target.yP1 - parentLinkxDefor,
                event.target.xP2,
                event.target.yP2 - parentLinkyDefor,
                event.target.xEnd,
                event.target.yEnd)
            .endStroke();
            event.target.cursor = 'pointer';
                 this.stage.update();
        }.bind(this));

        this.parentLinksContainer.addEventListener("mouseout", function (event: any) {
            if(!this.inContextMenu){
                this.mouseOverUnlink = null;            
            }
            $('#parents-' + event.target.dstId + ' > .brainElement-rightSection > span').removeClass('selectedElements');
            $('#main-' + event.target.srcId + ' > .brainElement-rightSection').removeClass('selectedElements');
            event.target.graphics.clear();
            event.target.graphics
            .setStrokeStyle(this.strokeStyle)
            .beginStroke(this.colorLinks)
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
        }.bind(this));

        this.stage.addChild(this.parentLinksContainer);   
        this.stage.update();     
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
        let point1 = this.drawPoint(posThoughtsMain.points.left.x, posThoughtsMain.points.left.y, 2, this.colorLinks);
        let point2 = this.drawPoint(posThoughtsJump.points.rigth.x, posThoughtsJump.points.rigth.y, 2, this.colorLinks);
        this.jumpsLinksContainer.addChild(point1);
        this.jumpsLinksContainer.addChild(point2);
        this.jumpsLinksContainer.addEventListener("mouseover", function (event: any) {
            this.mouseOverUnlink = event.target.unlink ? {typeLink: event.target.typeLink, srcId: event.target.srcId, dstId: event.target.dstId, dstType: event.target.dstType } : false;            
            event.target.graphics.clear();
            event.target.graphics
            .setStrokeStyle(this.strokeStyleHover)
            .beginStroke(this.colorHoverLinks)
            .moveTo(event.target.xStarter, event.target.yStarter)
            .bezierCurveTo(
                event.target.xP1,
                event.target.yP1 - 5,
                event.target.xP2,
                event.target.yP2 - 50,
                event.target.xEnd,
                event.target.yEnd)
            .endStroke();
            event.target.cursor = 'pointer';
                 this.stage.update();
        }.bind(this));
        this.jumpsLinksContainer.addEventListener("mouseout", function (event: any) {
            if(!this.inContextMenu){
                this.mouseOverUnlink = null;            
            }
            event.target.graphics.clear();
            event.target.graphics
            .setStrokeStyle(this.strokeStyle)
            .beginStroke(this.colorLinks)
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
        }.bind(this));
        this.stage.addChild(this.jumpsLinksContainer);
        this.stage.update();
    }

    drawSiblingsLink() {
        let P1, P2, linkIndex;
        for (let i = 0; i < this.posThoughts.siblings.length; i++) {
            let posParents = this.recupPosParents(this.posThoughts.siblings[i].thoughtParentsElement[0].id);            
            if (posParents) {
                P1 = {
                    x: posParents.points.bottom.x,
                    y: this.posThoughts.siblings[i].points.top.y
                };
                P2 = {
                    x: this.posThoughts.siblings[i].points.top.x,
                    y: posParents.points.bottom.y + 35
                };
                this.drawLink(posParents.points.bottom, this.posThoughts.siblings[i].points.top, P1, P2, this.siblingsLinksContainer, this.posThoughts.siblings[i].thoughtParentsElement[0], this.posThoughts.siblings[i], 'sibligns');
                let point1 = this.drawPoint(posParents.points.bottom.x, posParents.points.bottom.y, 2, this.colorLinks);
                let point2 = this.drawPoint(this.posThoughts.siblings[i].points.top.x, this.posThoughts.siblings[i].points.top.y, 2, this.colorLinks);
                this.siblingsLinksContainer.addChild(point2);
            }
        }
        this.siblingsLinksContainer.addEventListener("mouseover", function (event: any) {
            this.mouseOverUnlink = event.target.unlink ? {typeLink: event.target.typeLink, srcId: event.target.srcId, dstId: event.target.dstId, dstType: event.target.dstType } : false;            
            $('#siblings-' + event.target.dstId + ' > .brainElement-rightSection > span').addClass('selectedElements');
            $('#parents-' + event.target.srcId  + ' > .brainElement-rightSection > span').addClass('selectedElements');
            event.target.graphics.clear();
            event
                .target
                .graphics
                .setStrokeStyle(this.strokeStyleHover)
                .beginStroke(this.colorHoverLinks)
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
        }.bind(this));
        this.siblingsLinksContainer.addEventListener("mouseout", function (event: any) {
            if(!this.inContextMenu){
                this.mouseOverUnlink = null;            
            }
            $('#siblings-' + event.target.dstId + ' > .brainElement-rightSection > span').removeClass('selectedElements');
            $('#parents-' + event.target.srcId + ' > .brainElement-rightSection > span').removeClass('selectedElements');
            event.target.graphics.clear();
            event
                .target
                .graphics
                .setStrokeStyle(this.strokeStyle)
                .beginStroke(this.colorLinks)
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
        }.bind(this));
        this.stage.addChild(this.siblingsLinksContainer);
        this.stage.update();
    }

    recupPosParents(idParent) {
        let posPoints = [];
        for (let j = 0; j < this.posThoughts.parents.length; j++) {
            if (idParent == this.posThoughts.parents[j].thoughtElement) {
                return this.posThoughts.parents[j];
            }
        }
        return null;
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
        let strokeChoose = bol ? this.strokeStyleHover : this.strokeStyle;
        let colorChoose  = bol ? this.colorHoverLinks  : this.colorLinks;
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

  	getParamsThought(type,row, col,callback){
      var handleParamsThought = (type,row, col,callback) =>{
        let infos = null;
        let vendor = this.confBrain.staticSectionsMeseaures;
        if(type 		== "main"){
          infos = vendor.main;
        }else if(type == "parents"){
          infos = vendor.parents;
        }else if(type == "children"){
          infos = vendor.children;
        }else if(type == "jumps"){
          infos = vendor.jumps;
        }else if(type == "siblings"){
          infos = vendor.siblings;
        }else{
          infos = {};
        }
        let screenWidth  = window.innerWidth;
        let screenHeight = window.innerHeight;
        let pos = {
          x : (screenWidth/100) * (infos.x + col * (infos.horizontallyStep +  infos.width)),
          y : (screenHeight/100) * (infos.y + row * (infos.height + infos.verticallyStep) ),
          widthStep : (infos.scrollSquadLeft * screenWidth / 100),
          heightStep : infos.scrollSquadTop * screenHeight / 100,
          buttonWidth : (infos.width * screenWidth / 100) * vendor.buttonCoef,
          buttonHeight : (screenWidth < 1100 && screenWidth > 767) ? 51 : infos.height * screenHeight / 100
        };          
        callback(pos);     
      }
      if(this.confBrain == null){
          this.confService.returnConf(window.innerWidth,(result) => {
            this.confBrain = result;
            handleParamsThought(type,row, col,callback);
          });
      }else{
          handleParamsThought(type,row, col,callback);
      }
  }

  getWidthOfBloc(type,callback){
    var handleParamsThought = (type,callback) => {
        let infos = null;
        let vendor = this.confBrain.staticSectionsMeseaures;
        if(type     == "main"){
          infos = vendor.main;
        }else if(type == "parents"){
          infos = vendor.parents;
        }else if(type == "children"){
          infos = vendor.children;
        }else if(type == "jumps"){
          infos = vendor.jumps;
        }else if(type == "sibligns"){
          infos = vendor.sibligns;
        }else{
          infos = {};
        }
        let screenWidth  = window.innerWidth;
        let screenHeight = window.innerHeight;
        let widthStep = (infos.scrollSquadLeft * screenWidth / 100);
        callback(widthStep);     
      }
      if(this.confBrain == null){
          this.confService.returnConf(window.innerWidth,function(result){
            this.confBrain = result;
            handleParamsThought(type,callback);
          });
      }else{
          handleParamsThought(type,callback);
      }
  }
  verifyDrawedParentAndSibligns(){
    if(this.nbParentsDraw == this.displayedEnv.parents.nbActiveP  && this.nbSibDraw == this.displayedEnv.siblings.nbActiveS){            
        this.drawSiblingsLink();
        this.stage.update();
    }
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
                                this.prepareTheBrain();
                                this.startDrawing();
                            }.bind(this),300);
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