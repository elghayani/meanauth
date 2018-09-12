import { Injectable } from '@angular/core';

@Injectable()
export class BrainService {

  constructor() { }

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

}
