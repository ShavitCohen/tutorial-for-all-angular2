import {Component,Injectable} from 'angular2/core';

@Injectable()
export class DataService{
  getArray<Array>(){
    return [
      "aaa",
      "vvv",
      "ccc"
    ]
  }
}
