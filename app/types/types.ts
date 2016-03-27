
export class FirebaseBackend {
    ref: Firebase;
    constructor(url) {
        this.ref = new Firebase(url);
    }
}

export class Editor {
    constructor(
        public name: string,
        public email: string,
        public imageUrl: string,
        public lists?: List[]
    ) {
        if (this.lists) {
            let listKeys = Object.keys(this.lists);
            let arr: List[] = [];
            for (let i = 0; i < listKeys.length; i++) {
                let obj = this.lists[listKeys[i]];
                obj.id = listKeys[i];
                let listItem: List = new List(obj.id, obj.name, obj.description, obj.topic, obj.publish, obj.contents);
                arr.push(listItem);
            }
            this.lists = arr;
        } else {
            this.lists = [];
        }
    }
    getRegistrationData() {
        return {
            name: this.name,
            email: this.email,
            imageUrl: this.imageUrl
        }
    }
}

export class List {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public topic: string,
        public publish: boolean,
        public contents: Content[]
    ) {
        if (this.contents) {
            let contentKeys = Object.keys(this.contents);
            let arr: Content[] = [];
            for (let i = 0; i < contentKeys.length; i++) {
                let obj = this.contents[contentKeys[i]];
                obj.id = contentKeys[i];
                let contentItem: Content = new Content(obj.id, obj.name, obj.description, obj.contentUrl, obj.startTime, obj.endTime, obj.contentType,obj.order);
                arr.push(contentItem);
            }
            arr.sort(function(a,b) {return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0);} ); 

            this.contents = arr;
        } else {
            this.contents = [];
        }
    }
    getDataForSavingList() {
        return {
            name: this.name,
            description: this.description,
            topic: this.topic,
            publish: this.publish
        }
    }
}

export class Content {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public contentUrl: string,
        public startTime: number,
        public endTime: number,
        public contentType: string,
        public order?:number
    ) { }
    
    getDataForSaving(){
        return {
            name:this.name,
            description:this.description,
            contentUrl:this.contentUrl,
            startTime:this.startTime,
            endTime:this.endTime,
            contentType:this.contentType,
            order:this.order || this.id // if we creating new item, it will be the last one for sure
        }
    }
    
    getYoutubeVideoID() {
        return getYouTubeIdFromURL(this.contentUrl);
        function getYouTubeIdFromURL(url) {
                 var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[7].length == 11) {
                return match[7];
            }
        }
    }
    
    getYoutubeEmbedURL(){
        let videoId = this.getYoutubeVideoID();
        return "https://www.youtube.com/embed/" + videoId;
    }
    
    getYoutubeImage(){
        let videoId = this.getYoutubeVideoID();
        return "http://img.youtube.com/vi/" + videoId + "/0.jpg";
    }
    
    getVideoSettings(){
        return {
            videoId:this.getYoutubeVideoID(),
            startTime:this.startTime,
            endTime:this.endTime
        }
    }
}
