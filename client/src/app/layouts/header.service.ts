import { Injectable } from '@angular/core';

@Injectable()
export class HeaderService {
  private _displayHeader : boolean = true;
  public get displayHeader() : boolean {
    return this._displayHeader;
  }
  public set displayHeader(v : boolean) {
    this._displayHeader = v;
  }
  constructor() { }

}
