'use strict'

class LikeModule {
    constructor(getLoginInstance) {
        /*this.getLoginInstance = getLoginInstance;
        this.contractAddress = '0x...';
        this.abi = [];
        /*this.getLoginInstance.setClientAbi(this.abi);
        this.getLoginInstance.setOnLogout(_ => {
            console.log('logout');
        });*/
        this.urlParams = new URLSearchParams(window.location.search);
        // todo check is enough data in urlParams
    }

    init() {
        if (window && window._onLikeModuleLoaded) {
            window._onLikeModuleLoaded(this);
            delete window._onLikeModuleLoaded;
        }
    }

    _onLikeClick() {
        alert('Click')
    }

    /*draw(params) {
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

        // todo check and inject getlogin iframe. One iframe per page

        const likeIframe = document.createElement('iframe');
        likeIframe.setAttribute('style', 'border: 0');
        likeIframe.src = './module.html';
        element.appendChild(likeIframe);
    }*/
}

// todo load getlogin plugin, then load like module
(new LikeModule({
    /*test: 123,
    setClientAbi: () => {
    },
    setOnLogout: () => {
    }*/
})).init();
