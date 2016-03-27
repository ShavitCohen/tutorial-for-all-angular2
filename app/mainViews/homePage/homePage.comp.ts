import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
import {AuthorizationService} from '../../services/authorization.service';
import {Editor} from '../../types/types';


@Component({
    selector: 'home-page',
    templateUrl: 'app/mainViews/homePage/homePage.tpl.html',
    directives: [],
    providers: []
})
export class HomePageComponent {

    constructor(
        private _authorizationService: AuthorizationService,
        private _router:Router
        ) { }

    logIn(source: string) {
        var _this = this;
        this._authorizationService.logIn(source)
            .then(function(ediotr: Editor) {
                   _this._router.navigate(['EditorPortal']);
            })
    }

    logOut() {
        this._authorizationService.logOut()
            .then(function(val: any) {

            })
    }

}
