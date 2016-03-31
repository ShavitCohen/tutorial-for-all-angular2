import {Component, OnInit, OnDestroy} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';
import {AuthorizationService} from '../../services/authorization.service';
import {BackendService} from '../../services/backend.service';
import {YoutubePlayerService} from '../../services/youtubePlayer.service';
import {List, Content} from '../../types/types';
import {ContentSettingsForm} from './forms/contentSettingsForm/contentSettings.form';
import {ListItemComponent} from './listItem/listItem.comp';
import {SecondsToMinutesPipe} from '../../pipes/secondsToMinutes.pipe';




@Component({
    selector: "edit-list",
    templateUrl: "app/mainViews/editList/editList.tpl.html",
    styleUrls: ["app/mainViews/editList/editList.css"],
    directives: [ContentSettingsForm, ListItemComponent],
    pipes: [SecondsToMinutesPipe],
    providers: [YoutubePlayerService]
})
export class EditListComponent implements OnInit {
    constructor(
        public authorization: AuthorizationService,
        private _routeParams: RouteParams,
        private _backendService: BackendService,
        private _youtubePlayerService: YoutubePlayerService,
        private _router: Router
    ) { }
    thisList: List
    showNewContentForm: boolean = false;
    newContent: Content;
    private _contentsUL
    selectedContent: Content;
    public startTime:Number;
    public endTime:Number;

    ngOnInit() {
        let _thiss = this;
        _thiss.authorization.getCurrentEditor()
            .then(function(currentEditor) {
                _thiss.thisList = currentEditor.lists.find(l => l.id.toString() == _thiss._routeParams.get('id'));
                setTimeout(function() {
                    //waiting for the DOM to be rendered
                    _thiss._triggerPageScripts();
                });
            })
            .catch(function() {
                //no authorization
                _thiss._router.navigate(['HomePage']);
            })
    }

    _triggerPageScripts() {
        this._handleSortingContent();
        let _this = this;
        this._youtubePlayerService.initiateYoutubePlayer()
            .then(function() {
                _this._youtubePlayerService.playVideo(_this.thisList.contents[0])
                .then(function(obj:any){
                    _this.thisList.contents[0].setDuration(obj.duration);
                })
            })
    }
    
    private _setSlider (content:Content){
        let _this = this;
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: Number(content.duration),
            values: [content.startTime, content.endTime ? content.endTime : Number(content.duration)],
            slide: function(event, ui) {
                let startTime = ui.values[0];
                let endTime = ui.values[1];
                
                _this.startTime = startTime;
                _this.endTime = endTime;
            }
        });
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

    selectItemFromTheList(content: Content) {
        this.selectedContent = content;
        let _this = this;
        this._youtubePlayerService.playVideo(content)        
        .then(function(obj:any){
            content.setDuration(obj.duration);
            _this._setSlider(content);
        })
    }
}
