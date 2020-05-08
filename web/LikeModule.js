'use strict'

class LikeModule {
    constructor(getLoginInstance) {
        this.getLoginInstance = getLoginInstance;
        this.contractAddress = '0x...';
        this.abi = [];
        this.getLoginInstance.setClientAbi(this.abi);
        this.getLoginInstance.setOnLogout(_ => {
            console.log('logout');
        });
    }

    init() {
        if (window && window.onLikeModuleLoaded) {
            window.onLikeModuleLoaded(this);
        }
    }

    _onLikeClick() {
        alert('Click')
    }

    draw(selector, likeUrl = null, resourceType = null, resourceId = null) {
        const modes = {url: 'url', resource: 'resource'};
        let mode;
        if (likeUrl) {
            mode = modes.url;
        } else if (resourceType && resourceId) {
            mode = modes.resource;
        } else {
            throw new Error('Incorrect params')
        }

        const element = document.querySelector(selector);
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
        iframe.src = './module.html';
        /*iframe._likeModuleInstance = () => {
            console.log('yep, _likeModuleInstance');
        }*/

        element.appendChild(iframe);
    }
}

// todo load getlogin plugin, then load like module
(new LikeModule({
    test: 123, setClientAbi: () => {
    }, setOnLogout: () => {
    }
})).init();
