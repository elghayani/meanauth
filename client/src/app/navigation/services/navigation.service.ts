import { Injectable } from '@angular/core';

@Injectable()
export class NavigationService {
  
  private _currrentId : string;
  public get currrentId() : string {
    return this._currrentId;
  }
  public set currrentId(v : string) {
    this._currrentId = v;
  }
  
  constructor() { }

}
