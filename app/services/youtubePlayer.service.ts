import {Component, Injectable} from 'angular2/core';


@Injectable()
export class YoutubePlayerService {
    public player;

    addYoutubeScriptTag() {
        // 2. This code loads the IFrame Player API code asynchronously.
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        if ((document.getElementsByTagName('script')[0].src !== tag.src) && (document.getElementsByTagName('script')[1].src !== tag.src)) {
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
        let _this = this;
        
        window.onYouTubeIframeAPIReady = function(z,b,c){
            if(this){
                
            }else{
                
            }
        }
        
        window.onYouTubeIframeAPIReady.call(this);
    }

    onYouTubeIframeAPIReady() {
        let _this = this;
        this.player = new YT.Player('editor-player', {
            height: '390',
            width: '640',
            videoId: 'M7lc1UVf-VE',
            events: {
                'onReady': _this._onPlayerReady,
                'onStateChange': _this._onPlayerStateChange
            }
        })
    }
    
    private _onPlayerReady(){
        debugger;
    }
    private _onPlayerStateChange(){
        debugger;
    }
}