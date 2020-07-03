'use strict'

import LikeLogicAbi from './LikeLogicAbi.json';
import LikeStorageAbi from './LikeStorageAbi.json';

class LikeInjector {
    likeStorageAddress = LikeStorageAbi.address;
    likeStorageAbi = LikeStorageAbi.abi;
    likeLogicAbi = LikeLogicAbi.abi;
    likeLogicAddress = null;
    getLoginInstance = null;
    onLike = {};
    onUnlike = {};
    moduleId = 1;
    iframes = {};
    isAppAllowed = false;
    allowAppUrl = null;
    appId = 3;

    emptyHash = '0x000000000000000000000000000000000000000000000000000000';
    emptyWallet = '0x0000000000000000000000000000000000000000';

    init() {
        let getLoginApiUrl = "https://localhost:3000/api/last.js";
        let getLoginUrl = 'https://localhost:3000/bzz:/getlogin.eth/';
        let redirectUrl = 'https://localhost:1234/token.html';
        let accessToken = localStorage.getItem('access_token');
        if (process.env.NODE_ENV === 'production') {
            getLoginApiUrl = 'https://swarm-gateways.net/bzz:/getlogin.eth/api/last.js';
            getLoginUrl = 'https://swarm-gateways.net/bzz:/getlogin.eth/';
            redirectUrl = window.location.href
                .replace(window.location.hash, '')
                .replace(window.location.search, '');
            const exploded = redirectUrl.split('/');
            redirectUrl = redirectUrl.replace(exploded[exploded.length - 1], '') + 'token.html';
        }

        if (window._onLikeInjectorPreLoaded) {
            window._onLikeInjectorPreLoaded(this);
            delete window._onLikeInjectorPreLoaded;
        }

        window._onGetLoginApiLoaded = async (instance) => {
            console.log('GetLogin loaded', instance);
            const data = await instance.init(this.appId, getLoginUrl, redirectUrl, accessToken)
            console.log('GetLogin init data', data);
            this.isAppAllowed = data.data.is_client_allowed;
            if (this.isAppAllowed) {
                console.log('App allowed!');
            } else {
                this.allowAppUrl = instance.getAuthorizeUrl();
                console.log('App not allowed! Allow app url', this.allowAppUrl);
            }

            this.getLoginInstance = instance;
            this.getLoginInstance.setClientAbi(this.likeStorageAbi);
            this.getLoginInstance.setOnLogout(_ => {
                console.log('implement logout event here');
            });
            this.likeLogicAddress = await this.getLoginInstance.callContractMethod(this.likeStorageAddress, 'logicAddress');
            this.getLoginInstance.setClientAbi(this.likeLogicAbi);
            if (window._onLikeInjectorLoaded) {
                window._onLikeInjectorLoaded(this);
                delete window._onLikeInjectorLoaded;
            }
        };

        // inject getlogin script
        const script = document.createElement('script');
        script.src = getLoginApiUrl;
        document.head.appendChild(script);

        // subscribe to messages from child iframes
        window.addEventListener("message", (e) => {
            // todo check is other apps can send here fake messages
            // todo check origin?
            console.log(e.data);
            const id = e.data.id;
            const requestId = e.data.requestId;
            const type = e.data.type;
            const event = e.data.event;
            const data = e.data.data;
            if (type === 'like-module-get') {
                if (event === 'getUserStatisticsUrl') {
                    this._getUserStatisticsUrl(data)
                        .then(data => {
                            this.iframes[id].contentWindow.postMessage({
                                id: requestId,
                                result: data
                            }, '*');
                        });
                }
            } else if (type === 'like-module') {
                if (event === 'like' && this.onLike[id]) {
                    this._sendLike(id, data).then();
                } else if (event === 'unlike' && this.onUnlike[id]) {
                    this._sendUnlike(id, data).then();
                } else if (event === 'allowApp') {
                    // todo after success login - update params in LikeModule about url allowed (check LS access_token or wait window close)
                    window.open(this.allowAppUrl);
                }
            }
        }, false);
    }

    async _getUserStatisticsUrl(data) {
        const urlHash = await this.getLoginInstance.keccak256(data);
        let usernameHash = (await this.getLoginInstance.getUserInfo())['usernameHash'];
        // set hash for not logged users
        if (!usernameHash) {
            usernameHash = this.emptyHash;
        }
        //console.log(urlHash, usernameHash);
        return this.getLoginInstance.callContractMethod(this.likeLogicAddress, 'getUserStatisticsUrl', usernameHash, urlHash);
    }

    async _sendLike(id, data) {
        this.sendEventsAll('lock-blockchain-actions', {id});
        this.onLike[id](data);
        const urlHash = await this.getLoginInstance.keccak256(data.url)
        const response = await this.getLoginInstance.sendTransaction(this.likeLogicAddress, 'likeUrl', [urlHash, this.emptyWallet], {resolveMethod: 'mined'})
        this.sendEventsAll('unlock-blockchain-actions', {id, data: response});
    }

    async _sendUnlike(id, data) {
        this.sendEventsAll('lock-blockchain-actions', {id});
        this.onUnlike[id](data);
        const urlHash = await this.getLoginInstance.keccak256(data.url)
        const response = await this.getLoginInstance.sendTransaction(this.likeLogicAddress, 'unlikeUrl', [urlHash], {resolveMethod: 'mined'})
        this.sendEventsAll('unlock-blockchain-actions', {id, data: response});
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

        if (params.onUnlike) {
            this.onUnlike[this.moduleId] = params.onUnlike;
        }

        const iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'border: 0');
        iframe.src = `./module.html?id=${this.moduleId}&mode=${mode}&resourceType=${params.resourceType ? params.resourceType : ''}&resourceId=${params.resourceId ? params.resourceId : ''}&isAppAllowed=${this.isAppAllowed}&url=${encodeURIComponent(params.likeUrl)}`;
        element.appendChild(iframe);

        this.iframes[this.moduleId] = iframe;

        this.moduleId++;
    }

    sendEventsAll(event, data = {}) {
        const keys = Object.keys(this.iframes);
        keys.forEach(key => {
            this.iframes[key].contentWindow.postMessage({
                id: key,
                type: 'like-module-event',
                event,
                data
            }, '*');
        });
    }
}

(new LikeInjector()).init();
