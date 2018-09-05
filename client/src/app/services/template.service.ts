import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class TemplateService {

  constructor(private http:Http) { }
  searchByName(name) {
    let headers = new Headers();
    const token = localStorage.getItem('id_token');
    headers.append('Authorization', token);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3001/api/search?name='+name ,{headers: headers})
      .map(res => res.json());
  }

}
