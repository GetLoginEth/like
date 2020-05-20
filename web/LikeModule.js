'use strict'

class LikeModule {
    constructor() {
        this.urlParams = new URLSearchParams(window.location.search);
        //this.params=Object.fromEntries(this.urlParams);
        this.isAppAllowed = this.urlParams.get('isAppAllowed') === 'true';
        this.id = this.urlParams.get('id');
        this.mode = this.urlParams.get('mode');
        this.url = this.urlParams.get('url');
        this.resourceType = this.urlParams.get('resourceType');
        this.resourceId = this.urlParams.get('resourceId');

        if (this.mode === 'url' && !this.url) {
            throw new Error('Incorrect url data');
        } else if (this.mode === 'resource' && (!this.resourceType || !this.resourceId)) {
            throw new Error('Incorrect resource data');
        }

        this.likeInfo = {};
        // when likes count changed
        this.onLikesChanged = null;
        // when status of transaction changed
        this.onTxProgressChanged = null;
        this.getLoginInstance = null;
    }

    init() {
        if (window && window._onLikeModuleLoaded) {
            window._onLikeModuleLoaded(this);
            delete window._onLikeModuleLoaded;
        }
    }

    onLike() {
        this.sendEvent('like', {
            mode: this.mode,
            url: this.url,
            resourceType: this.resourceType,
            resourceId: this.resourceId
        });
    }

    onDislike() {
        this.sendEvent('dislike', {
            mode: this.mode,
            url: this.url,
            resourceType: this.resourceType,
            resourceId: this.resourceId
        });
    }

    onAllowApp() {
        this.sendEvent('allowApp', {
            mode: this.mode,
            url: this.url,
            resourceType: this.resourceType,
            resourceId: this.resourceId
        });
    }

    sendEvent(event, data) {
        parent.postMessage({id: this.id, type: 'like-module', event, data}, "*");
    }

    setGetLoginInstance(getLoginInstance) {
        this.getLoginInstance = getLoginInstance;
    }

    setLikes(likes, isLiked) {
        this.likeInfo = {likes: likes, isLiked: isLiked};
        if (this.onLikesChanged) {
            this.onLikesChanged(likes, isLiked);
        }
    }

    async toggleLike() {
        this.checkGetLoginInstance();
        if (!this.isAppAllowed) {
            this.onAllowApp();
            return;
        }

        const newIsLiked = !this.likeInfo.isLiked;
        if (this.likeInfo.isLiked) {
            this.setLikes(this.likeInfo.likes - 1, newIsLiked);
            this.onDislike();
        } else {
            this.setLikes(this.likeInfo.likes + 1, newIsLiked);
            this.onLike();
        }

        // todo send tx to blockchain
        // todo wait until mined, update actual like info
        if (this.onTxProgressChanged) {
            this.onTxProgressChanged(true);
            setTimeout(_ => {
                this.onTxProgressChanged(false);
            }, 2000);
        }
    }

    async updateLikeInfo() {
        this.checkGetLoginInstance();
        // todo receive info from blockchain and set
        this.setLikes(3, false);
    }

    checkGetLoginInstance() {
        if (!this.getLoginInstance) {
            throw new Error('getLoginInstance not found');
        }
    }
}

(new LikeModule()).init();
