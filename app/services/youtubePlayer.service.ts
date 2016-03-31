import {Component, Injectable} from 'angular2/core';
import {Content} from '../types/types';

@Injectable()
export class YoutubePlayerService {
    public player;
    public videoDuration: Number;
    public setEvent = {
        onStop: null,
        onPouse: null,
        onPlay: null
    }
    private _interval;
    private _player;

    private _addYoutubeAPIScriptTag() {
        // 2. This code loads the IFrame Player API code asynchronously.
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        if ((document.getElementsByTagName('script')[0].src !== tag.src) && (document.getElementsByTagName('script')[1].src !== tag.src)) {
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }
    initiateYoutubePlayer(): Promise<any> {
        let _this = this;
        var p = new Promise(function(resolve, reject) {
            let _thiss = _this;
            _this._addYoutubeAPIScriptTag();
            _this._interval = setInterval(function() {
                if (window.YT) {
                    _this._player = new YT.Player("editor-player", {
                        height: '100%',
                        width: '100%',
                        events: {
                            'onStateChange': function(event){
                                
                            },
                            'onReady': function() {
                                resolve();
                            }
                        }
                    });
                    clearInterval(_this._interval);
                }
            }, 500);
        })
        return p;
    }

    playVideo(content: Content): Promise<JSON> {
        let _this = this;
        var p = new Promise(function(resolve, reject) {
            _this._player.loadVideoById(content.getVideoSettings());
            setTimeout(function() {
                _this._player.pauseVideo();
                setTimeout(function() {
                    _this._player.playVideo();
                    setTimeout(function() {
                        resolve({
                            duration: _this._player.getDuration()
                        })
                    });
                }, 500);

            }, 1500);
        })
        return p
    }

    Duration() {
        this.videoDuration = this._player.getDuration();
    }



    private _onPlayerStateChange(event) {
        console.log(event);
    }

}