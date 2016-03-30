import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Content} from '../../../types/types';

@Component({
    selector:"list-item",
    templateUrl:"app/mainViews/editList/listItem/listItem.comp.tpl.html",
    directives:[],
    providers:[]
})
export class ListItemComponent{
      @Input('content') content : Content;
      @Input('isSelectedItem') isSelectedItem: boolean;
      @Output() itemClicked = new EventEmitter();
      
      itemClick(event){
          event.preventDefault();
          this.itemClicked.emit(this.content);
      }
}