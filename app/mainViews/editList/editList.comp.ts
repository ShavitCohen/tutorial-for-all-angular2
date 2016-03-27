import {Component, OnInit, AfterViewInit, OnDestroy} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {AuthorizationService} from '../../services/authorization.service';
import {BackendService} from '../../services/backend.service';
import {List, Content} from '../../types/types';
import {ContentSettingsForm} from './forms/contentSettingsForm/contentSettings.form';




@Component({
    selector: "edit-list",
    templateUrl: "app/mainViews/editList/editList.tpl.html",
    directives: [ContentSettingsForm],
    pipes:[],
    providers: []
})
export class EditListComponent implements OnInit, AfterViewInit {
    constructor(
        public authorization: AuthorizationService,
        private _routeParams: RouteParams,
        private _backendService: BackendService
    ) { }
    thisList: List
    showNewContentForm: boolean = false;
    newContent: Content;
    private _contentsUL

    ngOnInit() {
        this.thisList = this.authorization.getCurrentEditor().lists.find(l => l.id.toString() == this._routeParams.get('id'))
    }

    ngAfterViewInit() {
        this._handleSortingContent();
    }
    
    private _handleSortingContent() {
        let _this = this;
        _this._contentsUL = $("#sortable");
        _this._contentsUL.sortable({
            handle: '.reorder',
            update: function(event, ui) {
                let sortedArr = _this._contentsUL.sortable("toArray");
                updateContentAfterSorting(sortedArr);
            }
        });
        _this._contentsUL.disableSelection();

        function updateContentAfterSorting(sortedArr: Array<string>) {
            for (let i = 0; i < _this.thisList.contents.length; i++) {
                let content: Content = _this.thisList.contents[i];
                let index = sortedArr.findIndex(isSameId);
                content.order = index;
                function isSameId(item): boolean {
                    return item == content.id.toString()

                }
            }
            _this._backendService.updateContentsOrder(_this.thisList);
            
        }
    }

    toggleNewVideo() {
        this.showNewContentForm = !this.showNewContentForm;
        if (this.showNewContentForm) {
            let id = new Date().getTime()
            this.newContent = new Content(id, "", "", "", 0, null, 'video');
        }
    }

    cancelSaveNewContent() {
        this.showNewContentForm = false;
    }

    saveNewContent(content: Content) {
        let _this = this;
        this._backendService.addNewContent(content, this.thisList)
            .then(function(content) {
                _this.showNewContentForm = false;
            })
    }
}
