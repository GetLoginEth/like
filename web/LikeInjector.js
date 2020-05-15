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
    }

    init() {
        let scriptUrl = "https://localhost:3000/api/last.js";
        let appUrl = 'https://localhost:3000/bzz:/getlogin.eth/';

        // todo check double-init
        // todo inject getlogin, wait init and then init this module

        window._onGetLoginApiLoaded = (instance) => {
            console.log('Get login loaded', instance);

            if (window && window._onLikeInjectorLoaded) {
                window._onLikeInjectorLoaded(this);
                delete window._onLikeInjectorLoaded;
            }
        };

        const script = document.createElement('script');
        script.src = scriptUrl;
        document.head.appendChild(script);

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
        iframe.src = `./module.html?id=${this.moduleId}&mode=${mode}&resourceType=${params.resourceType ? params.resourceType : ''}&resourceId=${params.resourceId ? params.resourceId : ''}&url=${encodeURIComponent(params.likeUrl)}`;
        element.appendChild(iframe);

        this.moduleId++;
    }
}


(new LikeInjector()).init();
