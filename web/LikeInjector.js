'use strict'

class LikeInjector {
    constructor(getLoginInstance) {
        this.getLoginInstance = getLoginInstance;
        this.contractAddress = '0x...';
        this.abi = [];
        /*this.getLoginInstance.setClientAbi(this.abi);
        this.getLoginInstance.setOnLogout(_ => {
            console.log('logout');
        });*/
    }

    init() {
        // todo inject getlogin
        if (window && window._onLikeInjectorLoaded) {
            window._onLikeInjectorLoaded(this);
            delete window._onLikeInjectorLoaded;
        }

        window.addEventListener("message", (e) => {
            // todo check is other apps can send here messages
            const event = e.data.event;
            const data = e.data.data;
            console.log('received message', event, data);
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

        if (mode === modes.url) {
            // todo set action to like url hash
        } else {
            // todo set action to like contentType + contentId hash
        }

        const iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'border: 0');
        iframe.src = `./module.html?mode=${mode}&resourceType=${params.resourceType ? params.resourceType : ''}&resourceId=${params.resourceId ? params.resourceId : ''}`;
        element.appendChild(iframe);
    }
}


(new LikeInjector()).init();
