import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class NavigationService {

  public envirement$ = new BehaviorSubject(false);

  private _currrentId : string;
  public get currrentId() : string {
    return this._currrentId;
  }
  public set currrentId(v : string) {
    this._currrentId = v;
  }
  
  private _currentThought : any;
  public get currentThought() : any {
    return this._currentThought;
  }
  public set currentThought(v : any) {
    this._currentThought = v;
  }
  
  constructor(private http : Http) { }
  private pathOfServer = 'http://localhost:3001';

  getEnvironnement(_id, callback){
    if(_id == this.currrentId) return callback(null, true);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.id_token)
    return this.http.get(this.pathOfServer+'/api/navigation/environnement?id='+_id, {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      this.currrentId = data.id;
      this.currentThought = data;
      console.log(this.currentThought)
      this.envirement$.next(true);
      return callback(null, true);
    }, error => {
      return callback(error);
    });
  }

  returnDisplayedJumps(thoughts:any) {
    let displayJumps = thoughts.jumps;//.jumps.slice(thoughts.jumps.pageIndex * thoughts.jumps.pageCapacity, (thoughts.jumps.pageIndex + 1) * thoughts.jumps.pageCapacity );
    if(displayJumps && displayJumps.length > 1){
        displayJumps = displayJumps.sort(function(a,b) {return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);} );
    }
    return displayJumps;
}

  returnDisplayedParents(thoughts:any) {
      let displayParents = thoughts.parents;//.slice(thoughts.parents.pageIndex * thoughts.parents.pageCapacity, (thoughts.parents.pageIndex + 1) * thoughts.parents.pageCapacity );
      if(displayParents && displayParents.length > 1){
          displayParents = displayParents.sort(function(a,b) {return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);} ); 
      }
      return displayParents;
  }

  returnDisplayedChildren(thoughts:any) {
    let displayChildren = thoughts.children.slice(0,40);
    if(displayChildren && displayChildren.length > 1){
        displayChildren = displayChildren.sort(function(a,b) {return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);} ); 
    }
    return displayChildren;
  }
  getBlocState(bloc) {
    if (bloc == "siblings") {
        let sbTotal = 0;
        this.currentThought.parents.forEach(function(p) {
            
            if (p && p.children )
                sbTotal += p.children.length;
        });
        return {
            index: 0,
            capacity: 100,
            total: sbTotal
        };
    }
    return {
        index: 0,
        capacity: 100,
        total: 100
    };
}
  
}
