import {Component, OnInit, OnDestroy} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {AuthorizationService} from '../../services/authorization.service';
import {BackendService} from '../../services/backend.service';
import {listPropertiesFormComponent} from './forms/listPropertiesForm/listProperties.form.comp';
import {List,Editor} from '../../types/types';

@Component({
    selector: 'editor-portal',
    templateUrl: 'app/mainViews/editorPortal/editorPortal.tpl.html',
    directives: [ROUTER_DIRECTIVES, listPropertiesFormComponent],
    providers: []
})
export class EditorPortalComponent implements OnInit {
    public currentEditor:Editor;

    constructor(
        public authorizationService: AuthorizationService,
        private _backendService:BackendService,
        private _router:Router 
    ) { }
    newList: List;
    showNewListForm: boolean = false;

    ngOnInit() {
        let _this = this;
        this.authorizationService.getCurrentEditor()
        .then(function(editor:Editor){
            _this.currentEditor = editor;
        })
        .catch(function(){
             //no authorization
             _this._router.navigate(['HomePage']);
        })
    }

    

    toggleNewList() {
        this.showNewListForm = !this.showNewListForm;
        if (this.showNewListForm) {
            let id = new Date().getTime();
            this.newList = new List(id, '', '', '', false, []);
        }
    }

    saveNewList(list:List) {
         let _this = this;
         _this._backendService.addNewList(list)
         .then(function(list:List){
             _this._router.navigate(['EditList',{id:list.id}]);
         })
    }
    
    cancelSaveNewList(arg){
        this.showNewListForm = false;
    }


}
