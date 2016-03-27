import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Content} from '../../../../types/types';

@Component({
    selector:"content-settings-form",
    templateUrl:"app/mainViews/editList/forms/ContentSettingsForm/contentSettings.form.tpl.html",
    directives:[],
    providers:[]
})
export class ContentSettingsForm{
    @Input('content') content : Content;
    @Input('action') action: string;
    @Output() canceled = new EventEmitter();
    @Output() submited = new EventEmitter();
    
     submit() {
        this.submited.emit(this.content);
    }

    cancel() {
        this.canceled.emit(null);
    }
    
}