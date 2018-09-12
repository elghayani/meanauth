import { Injectable } from '@angular/core';

@Injectable()
export class ConfService {

  public pathOfImages = 'http://apple-time.fr/';

  configurationBrain  = {
    "mobileConf" : {
      "mainThought" : "59ef77ab7dc226649220ecb0",
      "mainThoughtType" : "personal",		      
      "staticSectionsMeseaures" : {
        "buttonCoef" : 4,
        "main" : {
         "x" : 43,
          "y" : 30,
          "width" : 5,
          "height" : 5,
          "verticallyStep" : 0,
          "horizontallyStep" : 0,
          "scrollSquadTop" : 2.8,
          "scrollSquadLeft" : 3.2		          
        },
        "parents" : {
          "x" : 0,
          "y" : 13,
          "width" : 7.5,
          "height" : 5,
          "nodesCapacity" : 2,
          "verticallyStep" : 1.5,
          "horizontallyStep" : 5.75,
          "scrollSquadTop" : 1,
          "scrollSquadLeft" : 3,
          "scrollX" : 50,
          "scrollY" : 30,
          "drawingPattern" : [
            { "cond" : -1, "matrix" : [[0],[0],[],[0],[],[0],[0]], "col" : 2},
            { "cond" : 1, "matrix" : [[0],[0],[0],[],[0],[0],[0]], "col" : 1},
            { "cond" : 2, "matrix" : [[0],[0],[],[0],[],[0],[0]], "col" : 2}		            
          ]
        },
        "siblings" : {
          "x" : 75,
          "y" : 19,
          "width" : 5.3,
          "height" : 5.5,
          "nodesCapacity" : 3,
          "verticallyStep" :  1,
          "horizontallyStep" : 5,
          "scrollSquadTop" : 2,
          "scrollSquadLeft" : 1,
          "scrollX" : 0,
          "scrollY" : 0
        },
        "jumps" : {
          "x" : 8,
          "y" : 29,
          "width" : 5.5,
          "height" : 5.2,
          "nodesCapacity" : 2,
          "verticallyStep" :  0.7,
          "horizontallyStep" : 5,
          "scrollSquadTop" : 2,
          "scrollSquadLeft" : 1,
          "scrollX" : 0,
          "scrollY" : 0
        },
        "children" : {
          "x" : 2.7,
          "y" : 43,
          "width" : 5.5,
          "height" : 5.5,
          "nodesCapacity" : 5,
          "verticallyStep" : 1.4,
          "horizontallyStep" : 3.8,
          "scrollSquadTop" : 2,
          "scrollSquadLeft" : 1.2,
          "scrollX" : 0,
          "scrollY" : 0,
          "drawingPattern" : [
            { "cond" : -1, "matrix" : [[0],[],[0],[0],[],[0],[0],[],[0],[0],[],[0],[0]],  "col" : 3},
            { "cond" : 12, "matrix" : [[0],[],[0],[0],[0],[0],[0],[],[0],[0],[0],[0],[0]], "col" : 2},
            { "cond" : 18, "matrix" : [[0],[],[0],[0],[],[0],[0],[],[0],[0],[],[0],[0]],  "col" : 3}
          ]
        }
      }
    },
    "defaultConf" : {
      "mainThought" : "59ef77ab7dc226649220ecb0",
      "mainThoughtType" : "personal",
      "staticSectionsMeseaures" : {
        "buttonCoef" : 2.7,
        "main" : {
          "x" : 45,
          "y" : 34,
          "width" : 5,
          "height" : 8,
          "verticallyStep" : 0,
          "horizontallyStep" : 0,
          "scrollSquadTop" : 2.8,
          "scrollSquadLeft" : 2.2
        },
        "parents" : {
          "x" : 35,
          "y" : 14,
          "width" : 4.5,
          "height" : 5,
          "nodesCapacity" : 4,
          "verticallyStep" : 0.8,
          "horizontallyStep" : 5,
          "scrollSquadTop" : 1,
          "scrollSquadLeft" : 1,
          "scrollX" : 50,
          "scrollY" : 40,
          "drawingPattern" : [
            { "cond" : -1, "matrix" : [[],[0],[]], "col" : 2},
            { "cond" : 1, "matrix" : [[0],[],[0]], "col" : 1},
            { "cond" : 2, "matrix" : [[],[0],[]], "col" : 2}		            
          ]
        },
        "siblings" : {
          "x" : 77,
          "y" : 16,
          "width" : 5.5,
          "height" : 5,
          "nodesCapacity" : 5,
          "verticallyStep" :  0.7,
          "horizontallyStep" : 5,
          "scrollSquadTop" : 2,
          "scrollSquadLeft" : 1,
          "scrollX" : 0,
          "scrollY" : 0
        },
        "jumps" : {
          "x" : 9,
          "y" : 21,
          "width" : 5.5,
          "height" : 5,
          "nodesCapacity" : 4,
          "verticallyStep" : 3,
          "horizontallyStep" : 5,
          "scrollSquadTop" : 2,
          "scrollSquadLeft" : 2,
          "scrollX" : 0,
          "scrollY" : 0
        },
        "children" : {
          "x" : 6,
          "y" : 49,
          "width" :5,
          "height" : 4.6,
          "nodesCapacity" : 48,
          "verticallyStep" : 0.2,
          "horizontallyStep" : 2,
          "scrollSquadTop" : 2,
          "scrollSquadLeft" : 1.2,
          "scrollX" : 0,
          "scrollY": 0,
          "drawingPattern" : [
            { "cond" : -1, "matrix" : [[],[0],[],[0],[],[0],[0],[],[0],[],[0],[],[0]], "col" : 6},
            { "cond" : 10, "matrix" : [[0],[0],[0],[],[0],[0],[0],[0],[],[0],[0],[0],[0]], "col" : 2},		            
            { "cond" : 20, "matrix" : [[0],[],[0],[],[0],[0],[0],[0],[],[0],[],[0],[0]],  "col" : 4}		           
          ]
        }
      }
    }
  };

  constructor() { }

  // isValidView = (view)=>{
  //   return (this.views.indexOf(view) >=0);
  // }
  returnConf(widthWindow,callback){
    if(window.innerWidth > 500){
      callback(this.configurationBrain.defaultConf);
    }else{
      callback(this.configurationBrain.mobileConf);
    }
  }

  
}
