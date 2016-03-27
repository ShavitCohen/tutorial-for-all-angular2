import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {List} from '../../../../types/types';

@Component({
    selector: "list-properties-form",
    templateUrl: "app/mainViews/editorPortal/forms/listPropertiesForm/listProperties.form.tpl.html",
    directives: [],
    providers: []
})

export class listPropertiesFormComponent implements OnInit {
    @Input('list') list: List;
    @Input('action') action: string;
    
    @Output() canceled = new EventEmitter();
    @Output() submited = new EventEmitter();

    ngOnInit() {

    }

    submit() {
        this.submited.emit(this.list);
    }

    cancel() {
        this.canceled.emit(null);
    }
}