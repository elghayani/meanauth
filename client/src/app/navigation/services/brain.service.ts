import { Injectable } from '@angular/core';
// import { ConfService } from "./conf.service";

@Injectable()
export class BrainService {
  
  constructor( 
    //   public confService: ConfService,
    ) { }

  positionCss(coord) {
    return {
        top: {
            x: coord.x + (coord.buttonWidth / 2),
            y: coord.y
        },
        bottom: {
            x: coord.x + (coord.buttonWidth / 2),
            y: coord.y + coord.buttonHeight
        },
        left: {
            x: coord.x - (coord.buttonWidth / 2),
            y: coord.y + (coord.buttonHeight / 2)
        },
        rigth: {
            x: coord.x + (coord.buttonWidth / 2),
            y: coord.y + (coord.buttonHeight / 2)
        }
    }
  }
  canvasCoord(stage, defaultCoord, buttonCoef, col, row){
    return {
      x : (stage.width/100) * (defaultCoord.x + col  * (defaultCoord.horizontallyStep +  defaultCoord.width)),
      y : (stage.heigth/100) * (defaultCoord.y + row * (defaultCoord.height + defaultCoord.verticallyStep) ),
      widthStep : (defaultCoord.scrollSquadLeft * stage.width / 100),
      heightStep : defaultCoord.scrollSquadTop * stage.heigth / 100,
      buttonWidth : (defaultCoord.width * stage.width / 100) * buttonCoef,
      buttonHeight : (stage.width < 1100 && stage.width > 767) ? 51 : defaultCoord.height * stage.heigth / 100
    };  
  }
  
    brainSchema(conf) {        
        let schema =
        {
            mainThought: {},
            parents: {
                thoughts: [],
                total: 0,
                pageIndex: 0,
                pageCapacity: conf.parents.limitTo,
                active: conf.parents.active,
                saturate : false
            },
            children: {
                thoughts: [],
                total: 0,
                pageIndex: 0,
                pageCapacity: conf.children.limitTo,
                active: conf.children.active,
                saturate : false
            },
            jumps: {
                thoughts: [],
                total: 0,
                pageIndex: 0,
                pageCapacity: conf.jumps.limitTo,
                active: conf.jumps.active,
                saturate : false
            },
            siblings: {
                thoughts: [],
                total: 0,
                pageIndex: 0,
                pageCapacity: conf.siblings.limitTo,
                active: conf.siblings.active,
                saturate : false
            }
        };
        return schema;
    }

    childrenMatrixBrain(conf, totalChildren){
        let column =0,  row = 0;
        let matrixBrain = [ ];

        if(totalChildren>0){
            let cfg = conf.staticSectionsMeseaures.children.drawingPattern;
            let i = cfg.findIndex((a)=>{return totalChildren<=a.cond});
            i = i > -1 ? i : 0;
            column = cfg[i].col;
            matrixBrain = cfg[i].matrix; //JSON.parse(JSON.stringify(cfg[i].matrix.slice())
            row = Math.ceil(totalChildren / column);
            let k = 0;
            matrixBrain.filter(e=>{return e.length==0}).map((e)=>{
               for(let j=0; j < row && k<totalChildren;j++, k++){
                   e.push(k+1); // +1 because the empty column equal 0
               }
            })
        }
        return matrixBrain;
    }
    parentsMatrixBrain(conf, total) {
        let column =0,  row = 0;
        let matrixBrain = [ ];

        if(total>0){
            let cfg = conf.staticSectionsMeseaures.parents.drawingPattern;
            let i = cfg.findIndex((a)=>{return total<=a.cond});
            i = i > -1 ? i : 0;
            column = cfg[i].col;
            matrixBrain = cfg[i].matrix; //JSON.parse(JSON.stringify(cfg[i].matrix.slice())
            row = Math.ceil(total / column);
            let k = 0;
            matrixBrain.filter(e=>{return e.length==0}).map((e)=>{
               for(let j=0; j < row && k<total;j++, k++){
                   e.push(k+1); // +1 because the empty column equal 0
               }
            })
        }
        return matrixBrain;
     
    }
    jumpsMatrixBrain(total, capacity){
        let matrixBrain = [];
        let emptyness = capacity - total;
        if (emptyness > 0) {
            let diff = Math.ceil(emptyness / 2);
            for (let i = 0; i < diff; i++) {
                matrixBrain.push(0);
            }

            for (let i = 0; i < total; i++) {
                matrixBrain.push(i+1);
            }
        }
       return matrixBrain;
    }
    siblignsMatrixBrain(conf, siblings){
        let nbr = 0;
        siblings.map(e=>{return nbr+= e.children.length});
        let nbActiveS = nbr;
        let emptyness = conf.staticSectionsMeseaures.siblings.nodesCapacity - nbr;
        let diff = Math.ceil(emptyness / 2);
        if (emptyness > 0) {
            let i=diff;
            siblings.map(e=> {
                e.children.map(_e=> {
                    _e.col = i;
                    _e.idParent = e._idT;
                    i++;
                })
            })
        }
       return nbActiveS;
    }

}
