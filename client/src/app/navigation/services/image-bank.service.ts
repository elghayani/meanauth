import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class ImageBankService {

  constructor(private http : Http) { }
  private pathOfServer = 'http://localhost:3001';
  
  getImages(_id){
    return this.http.get(this.pathOfServer+'/api/imageBank/list?id='+_id)
    .map(res => res.json());
  }
}
