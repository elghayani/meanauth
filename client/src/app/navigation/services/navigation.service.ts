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

  getEnvironnement(_id){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.id_token)
    return this.http.get(this.pathOfServer+'/api/navigation/environnement?id='+_id, {headers: headers})
    .map(res => res.json());
  }
  
}
