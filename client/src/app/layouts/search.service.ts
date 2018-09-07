import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class SearchService {

  pathOfServer = 'http://localhost:3001/';

  constructor(private http:Http) { }
  searchTemplateByName(name) {
    let headers = new Headers();
    const token = localStorage.getItem('id_token');
    if(token){
      headers.append('Authorization', token);
      headers.append('Content-Type', 'application/json');
      return this.http.get(this.pathOfServer+'api/search/template-private?name='+name ,{headers: headers})
        .map(res => res.json());
    }
    else{
      return this.http.get(this.pathOfServer+'api/search/template?name='+name ,{headers: headers})
      .map(res => res.json());
    }
  }
}
