import {Injectable} from 'angular2/core';
import {BackendService} from './backend.service';
import {Editor} from '../types/types';

@Injectable()
export class AuthorizationService {
    constructor(
        private _backendService: BackendService
    ) { }


    initSertivce() {
        let _this = this;
        this.getCurrentEditor()
            .then(function(currentEditor) {
                _this._backendService.currentEditor = currentEditor;
            })
            .catch(function(){
                //editor does not exists
            })
    }

    getCurrentEditor(): Promise<Editor> {
        let authData: FirebaseAuthData = this.isAuthenticated();

        if (authData) {
            return this._backendService.getEditor(authData)
        } else {
            let p = new Promise(function(resolve, reject) {
                reject(null);
            })
            return p;
        }
    }



    logIn(source: string): Promise<Editor> {
        let _this = this;
        let p = new Promise(function(resolve, reject) {
            _this._backendService.logIn(source)
                .then(function(editor: Editor) {
                    _this._backendService.currentEditor = editor;
                    resolve(editor);
                })
        })
        return p;

    }

    logOut(): Promise<{}> {
        let _this = this;
        let p = new Promise(function(resolve, reject) {
            _this._backendService.logOut()
                .then(function() {
                    _this._backendService.currentEditor = null;
                    resolve();
                })
        })
        return p;
    }

    isAuthenticated(): FirebaseAuthData {
        return this._backendService.isAuthenticated();
    }

}
