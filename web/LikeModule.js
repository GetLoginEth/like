'use strict'

class LikeModule {
    constructor() {
        this.urlParams = new URLSearchParams(window.location.search);
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
        this.sendMessageTimeout = 60;
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
        this.sendEvent('unlike', {
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

    _randomUid() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    sendEvent(event, data) {
        parent.postMessage({id: this.id, type: 'like-module', event, data}, "*");
    }

    async callMethod(method, data) {
        const id = this._randomUid();
        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                reject('Timeout error');
            }, this.sendMessageTimeout * 1000);

            const listener = (event) => {
                if (typeof event.data !== 'object' || event.data.id !== id) {
                    return;
                }

                clearTimeout(timeout);
                window.removeEventListener('message', listener);

                if (event.data.result) {
                    resolve(event.data.result);
                } else {
                    reject(event.data.error ? event.data.error : 'Unknown error');
                }
            };

            window.addEventListener('message', listener);
            const message = {
                id: this.id,
                requestId: id,
                type: 'like-module-get',
                event: method,
                data
            };

            parent.postMessage(message, "*");
        });
    }

    /*setGetLoginInstance(getLoginInstance) {
        this.getLoginInstance = getLoginInstance;
    }*/

    setLikes(likes, isLiked) {
        this.likeInfo = {likes: likes, isLiked: isLiked};
        if (this.onLikesChanged) {
            this.onLikesChanged(likes, isLiked);
        }
    }

    async toggleLike() {
        //this.checkGetLoginInstance();
        if (!this.isAppAllowed) {
            this.onAllowApp();
            return;
        }

        const newIsLiked = !this.likeInfo.isLiked;
        const likes = Number(this.likeInfo.likes);
        if (this.likeInfo.isLiked) {
            this.setLikes(likes - 1, newIsLiked);
            this.onDislike();
        } else {
            this.setLikes(likes + 1, newIsLiked);
            this.onLike();
        }

        // todo wait until mined, update actual like info
        if (this.onTxProgressChanged) {
            this.onTxProgressChanged(true);
            setTimeout(_ => {
                this.onTxProgressChanged(false);
            }, 2000);
        }
    }

    async updateLikeInfo() {
        //this.checkGetLoginInstance();
        const data = await this.callMethod('getUserStatisticsUrl', this.url)
        this.setLikes(data.resourceStatistics.reactions, data.isLiked);
    }

    /*checkGetLoginInstance() {
        if (!this.getLoginInstance) {
            throw new Error('getLoginInstance not found');
        }
    }*/
}

(new LikeModule()).init();
