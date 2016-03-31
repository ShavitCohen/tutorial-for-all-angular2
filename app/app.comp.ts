import {bootstrap} from 'angular2/platform/browser';
import {Component, OnInit, provide} from 'angular2/core';
import {FooterComponent} from './footer/footer.comp';
import {HeaderComponent} from './header/header.comp';
import {HomePageComponent} from './mainViews/homePage/homePage.comp';
import {EditListComponent} from './mainViews/editList/editList.comp';
import {EditorPortalComponent} from './mainViews/editorPortal/editorPortal.comp';
import {BackendService} from './services/backend.service';
import {AuthorizationService} from './services/authorization.service';
import {ROUTER_PROVIDERS,ROUTER_DIRECTIVES, RouteConfig, Location, LocationStrategy,HashLocationStrategy} from 'angular2/router';

@Component({
    selector: 'app',
    templateUrl: 'app/app.tpl.html',
    directives: [
      HeaderComponent,
      FooterComponent,
      ROUTER_DIRECTIVES
    ],
    providers: [
      ROUTER_PROVIDERS,
      BackendService,
      AuthorizationService                  
    ]
})
@RouteConfig([
  {path:'/home', name:"HomePage", component:HomePageComponent, useAsDefault:true},
  {path:'/editorPortal', name:'EditorPortal', component:EditorPortalComponent},
  {path:'/editList', name:'EditList', component:EditListComponent}
])
export class AppComponent implements OnInit{
    constructor(
        private _authorizationService:AuthorizationService,
        location: Location
        ){
             
        }
    ngOnInit(){
        this._authorizationService.initSertivce();
    }
}


bootstrap(AppComponent, [
  provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
