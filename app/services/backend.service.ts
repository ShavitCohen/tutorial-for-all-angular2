import {Injectable} from 'angular2/core';
import {Editor, List, Content, FirebaseBackend} from '../types/types';

@Injectable()
export class BackendService {
    private _currentAuth: FirebaseAuthData;
    public currentEditor: Editor;
    _firebaseRef: Firebase;

    constructor() {
        let FIREBASE_URL = "https://my-videos-place.firebaseio.com";
        this._firebaseRef = new FirebaseBackend(FIREBASE_URL).ref;
    }

    logIn(source: string): Promise<Editor> {
        let scope = (source == 'github') ? 'user:email' : 'email';
        let _this = this;

        return _this._firebaseRef.authWithOAuthPopup(source, { scope: scope })
            .then(registerEditorIfNotExists)

        function registerEditorIfNotExists(userAuth: FirebaseAuthData) {
            _this._currentAuth = userAuth;
            return _this.getEditor(userAuth)
                .then(function(editor) {
                    return editor;
                })
                .catch(function(authUser: FirebaseAuthData) {
                    return createNewEditor(userAuth);
                })
        }

        function createNewEditor(userAuth: FirebaseAuthData): Editor {
            let editor: Editor;
            editor = new Editor(userAuth[source].displayName, userAuth[source].email, userAuth[source].profileImageURL);
            //registering the new editor to the db
            _this._firebaseRef.child("users").child(userAuth.uid).set(editor.getRegistrationData());
            return editor;
        }
    }


    getEditor(userAuth: FirebaseAuthData): Promise<Editor> {
        let _this = this;
        let p = new Promise(function(resolve, reject) {
            if (_this.currentEditor && userAuth[userAuth.provider].email == _this.currentEditor.email) {
                resolve(_this.currentEditor);
            } else {
                _this._firebaseRef.child("users").child(userAuth.uid).once("value")
                    .then(function(snapshot: FirebaseDataSnapshot) {
                        var editor: Editor;
                        if (snapshot.val()) {
                            var data = snapshot.val();
                            editor = new Editor(data.name, data.email, data.imageUrl, data.lists);
                            resolve(editor);
                        } else {
                            reject(userAuth)
                        }
                    })
            }
        })

        return p;
    }


    logOut(): Promise<{}> {
        let _this = this;
        let p = new Promise(function(resolve, reject) {
            _this._firebaseRef.unauth();
            resolve();
        })
        return p;
    }

    isAuthenticated(): FirebaseAuthData {
        this._currentAuth = this._firebaseRef.getAuth();
        return this._currentAuth;
    }

    addNewList(list: List): Promise<any> {
        let _this = this;
        var p = new Promise(function(resolve, reject) {

            _this._firebaseRef.child("users").child(_this._currentAuth.uid).child("lists").once("child_added", _afterAdd);
            _this._firebaseRef.child("users").child(_this._currentAuth.uid).child("lists").child(list.id.toString()).set(list.getDataForSavingList());

            function _afterAdd(listSnapshot: FirebaseDataSnapshot) {
                _this.currentEditor.lists.push(list);
                resolve(list);
            }
        })
        return p;
    }

    updateList(list: List): Promise<any> {
        let _this = this;
        var p = new Promise(function(resolve, reject) {
            _this._firebaseRef.child("users").child(_this._currentAuth.uid).child(list.id.toString()).update(list.getDataForSavingList(), _afterUpdate)

            function _afterUpdate(error) {
                if (error) {
                    reject(error)
                } else {

                    resolve(list);
                }
            }
        })


        return p;
    }



    addNewContent(content: Content, list: List): Promise<any> {
        let _this = this;
        var p = new Promise(function(resolve, reject) {

            _this._firebaseRef.child("users").child(_this._currentAuth.uid).child("lists").child(list.id.toString()).child("contents").once("child_added", _afterAdd);
            _this._firebaseRef.child("users").child(_this._currentAuth.uid).child("lists").child(list.id.toString()).child("contents").child(content.id.toString()).set(content.getDataForSaving());

            function _afterAdd(contentSnapshot: FirebaseDataSnapshot) {
                list.contents.push(content);
                resolve(list);
            }
        })
        return p;
    }

    updateContent(content: Content, list: List): Promise<any> {
        let _this = this;
        var p = new Promise(function(resolve, reject) {
            _this._firebaseRef.child("users").child(_this._currentAuth.uid).child(list.id.toString()).child("contents").child(content.id.toString()).update(content.getDataForSaving(), _afterUpdate);

            function _afterUpdate(error) {
                if (error) {
                    reject(error)
                } else {
                    resolve(content);
                }
            }
        })


        return p;
    }

    updateContentsOrder(list: List) {
        let updateContentData = {};
        let listPath = "users/" + this._currentAuth.uid + "/lists/" + list.id + "/contents/";
        for (let i = 0; i < list.contents.length; i++) {
            let content = list.contents[i];
            updateContentData[listPath + content.id + "/order"] = content.order;
        }
        this._firebaseRef.update(updateContentData, function(error) {

        })
    }


}
