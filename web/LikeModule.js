'use strict'

class LikeModule {
    urlParams;
    isAppAllowed;
    id;
    mode;
    url;
    resourceType;
    resourceId;
    likeInfo = {};
    // when likes count changed
    onLikesChanged = null;
    // when status of transaction changed
    onTxProgressChanged = null;
    sendMessageTimeout = 60;

    constructor() {
        this.urlParams = new URLSearchParams(window.location.search);
        this.isAppAllowed = this.urlParams.get('isAppAllowed') === 'true';
        this.id = Number(this.urlParams.get('id'));
        this.mode = this.urlParams.get('mode');
        this.url = this.urlParams.get('url');
        this.resourceType = this.urlParams.get('resourceType');
        this.resourceId = this.urlParams.get('resourceId');

        if (this.mode === 'url' && !this.url) {
            throw new Error('Incorrect url data');
        } else if (this.mode === 'resource' && (!this.resourceType || !this.resourceId)) {
            throw new Error('Incorrect resource data');
        }
    }

    _randomUid() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    _likeListener = (e) => {
        if (typeof e.data !== 'object' || Number(e.data.id) !== this.id || e.data.type !== 'like-module-event') {
            return;
        }

        // todo check here e.origin
        console.log(e);
        const event = e.data.event;
        const data = e.data.data;
        if (event === 'lock-blockchain-actions') {
            if (Number(data.id) === this.id) {
                if (this.onTxProgressChanged) {
                    this.onTxProgressChanged(true);
                }
            }

            const list = document.body.classList;
            list.remove('body-unlocked')
            list.add('body-locked');
        } else if (event === 'unlock-blockchain-actions') {
            if (Number(data.id) === this.id) {
                if (this.onTxProgressChanged) {
                    this.onTxProgressChanged(false);
                }
            }

            const list = document.body.classList;
            list.remove('body-locked')
            list.add('body-unlocked');
        }
    }

    init() {
        window.addEventListener('message', this._likeListener);
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

    setLikes(likes, isLiked) {
        this.likeInfo = {likes: likes, isLiked: isLiked};
        if (this.onLikesChanged) {
            this.onLikesChanged(likes, isLiked);
        }
    }

    async toggleLike() {
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
    }

    async updateLikeInfo() {
        try {
            const data = await this.callMethod('getUserStatisticsUrl', this.url)
            this.setLikes(data.resourceStatistics.reactions, data.isLiked);
        } catch (e) {

        }
    }
}

(new LikeModule()).init();
