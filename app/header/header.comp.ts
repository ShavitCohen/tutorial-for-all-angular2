import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  selector:"app-header",
  templateUrl:"app/header/header.tpl.html",
  directives:[ROUTER_DIRECTIVES],
  providers:[]
})
export class HeaderComponent{

}
