'use strict'

class LikeInjector {
    constructor() {
        this.contractAddress = '0x...';
        this.abi = [];
        /*this.getLoginInstance.setClientAbi(this.abi);
        this.getLoginInstance.setOnLogout(_ => {
            console.log('logout');
        });*/
        this.onLike = {};
        this.onDislike = {};
        this.moduleId = 1;

        this.isAppAllowed = false;
        this.allowAppUrl = null;
    }

    init() {
        let appId = 3;
        let scriptUrl = "https://localhost:3000/api/last.js";
        let appUrl = 'https://localhost:3000/bzz:/getlogin.eth/';
        let redirectUrl = 'https://localhost:1234/token.html';
        let accessToken = localStorage.getItem('access_token');

        window._onGetLoginApiLoaded = (instance) => {
            console.log('Get login loaded', instance);
            instance.init(appId, appUrl, redirectUrl, accessToken)
                .then(data => {
                    console.log('Getlogin init data', data);
                    this.isAppAllowed = data.data.is_client_allowed;
                    if (this.isAppAllowed) {
                        console.log('App allowed!');
                    } else {
                        this.allowAppUrl = instance.getAuthorizeUrl();
                        console.log('App not allowed! Allow app url', this.allowAppUrl);
                    }

                    if (window && window._onLikeInjectorLoaded) {
                        window._onLikeInjectorLoaded(this);
                        delete window._onLikeInjectorLoaded;
                    }
                });
        };

        // inject getlogin script
        const script = document.createElement('script');
        script.src = scriptUrl;
        document.head.appendChild(script);

        // subscribe to messages from child iframes
        window.addEventListener("message", (e) => {
            // todo check is other apps can send here fake messages
            const id = e.data.id;
            const type = e.data.type;
            const event = e.data.event;
            const data = e.data.data;
            if (type !== 'like-module') {
                return;
            }

            if (event === 'like' && this.onLike[id]) {
                this.onLike[id](data);
            } else if (event === 'dislike' && this.onDislike[id]) {
                this.onDislike[id](data);
            } else if (event === 'allowApp') {
                const newWindow = window.open(this.allowAppUrl);
                console.log('newWindow', newWindow);
            }

            //console.log('received message', id, event, data);
        }, false);
    }

    draw(params) {
        const modes = {url: 'url', resource: 'resource'};
        let mode;
        if (params.likeUrl) {
            mode = modes.url;
        } else if (params.resourceType && params.resourceId) {
            mode = modes.resource;
        } else {
            throw new Error('Incorrect params')
        }

        const element = document.querySelector(params.selector);
        if (!element) {
            throw new Error('Element not found');
        }

        if (params.onLike) {
            this.onLike[this.moduleId] = params.onLike;
        }

        if (params.onDislike) {
            this.onDislike[this.moduleId] = params.onDislike;
        }

        const iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'border: 0');
        iframe.src = `./module.html?id=${this.moduleId}&mode=${mode}&resourceType=${params.resourceType ? params.resourceType : ''}&resourceId=${params.resourceId ? params.resourceId : ''}&isAppAllowed=${this.isAppAllowed}&url=${encodeURIComponent(params.likeUrl)}`;
        element.appendChild(iframe);

        this.moduleId++;
    }
}


(new LikeInjector()).init();
