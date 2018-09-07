import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class NavigationService {
  
  private _currrentId : string;
  public get currrentId() : string {
    return this._currrentId;
  }
  public set currrentId(v : string) {
    this._currrentId = v;
  }
  
  private _currentThought : string;
  public get currentThought() : string {
    return this._currentThought;
  }
  public set currentThought(v : string) {
    this._currentThought = v;
  }
  
  constructor(private http : Http) { }
  private pathOfServer = 'http://localhost:3001';

  getEnv(_id){
    return this.http.get(this.pathOfServer+'/api/navigation/env?id='+_id)
    .map(res => res.json());
  }
  
}
