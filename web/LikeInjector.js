'use strict'

class LikeInjector {
    likeStorageAddress = '0x6A7c14bD5384e2eb8515a5B7298cF1ec5d63aD59';
    likeLogicAddress = null;
    storageAbi = [
        {
            "inputs": [],
            "name": "decrementResourceId",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "resourceType",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "resourceIdHash",
                    "type": "bytes32"
                }
            ],
            "name": "emitEventLikeResource",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "urlHash",
                    "type": "bytes32"
                }
            ],
            "name": "emitEventLikeUrl",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_logicAddress",
                    "type": "address"
                }
            ],
            "name": "setLogicAddress",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_address",
                    "type": "address"
                }
            ],
            "name": "setOwner",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "resourceType",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "resourceIdHash",
                    "type": "bytes32"
                }
            ],
            "name": "EventLikeResource",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "urlHash",
                    "type": "bytes32"
                }
            ],
            "name": "EventLikeUrl",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "incrementResourceId",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "key",
                    "type": "bytes32"
                },
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "resourceTypeId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "resourceIdHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "urlHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "uint256",
                            "name": "reactions",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "donates",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "isActive",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct LikeStorage.ResourceIdStatistics",
                    "name": "value",
                    "type": "tuple"
                }
            ],
            "name": "setResourceIdStatistics",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "key",
                    "type": "uint256"
                },
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "title",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "url",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "reactions",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "donates",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "ownerUsernameHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bool",
                            "name": "isActive",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct LikeStorage.ResourceType",
                    "name": "value",
                    "type": "tuple"
                }
            ],
            "name": "setResourceType",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "key",
                    "type": "bytes32"
                },
                {
                    "internalType": "bool",
                    "name": "value",
                    "type": "bool"
                }
            ],
            "name": "setUserLike",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "key",
                    "type": "bytes32"
                }
            ],
            "name": "getResourceIdStatistics",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "resourceTypeId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "resourceIdHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "urlHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "uint256",
                            "name": "reactions",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "donates",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "isActive",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct LikeStorage.ResourceIdStatistics",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "key",
                    "type": "uint256"
                }
            ],
            "name": "getResourceType",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "title",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "url",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "reactions",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "donates",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "ownerUsernameHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bool",
                            "name": "isActive",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct LikeStorage.ResourceType",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "key",
                    "type": "bytes32"
                }
            ],
            "name": "getUserLike",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "logicAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "newResourceId",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "name": "resourceIdStatistics",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "resourceTypeId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "resourceIdHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "urlHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "uint256",
                    "name": "reactions",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "donates",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isActive",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "resources",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "url",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "reactions",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "donates",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "ownerUsernameHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bool",
                    "name": "isActive",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "name": "userLike",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    logicAbi = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "url",
                    "type": "string"
                }
            ],
            "name": "createResourceType",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "resourceTypeId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "resourceIdHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "address payable",
                    "name": "donateAddress",
                    "type": "address"
                }
            ],
            "name": "like",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "urlHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "address payable",
                    "name": "donateAddress",
                    "type": "address"
                }
            ],
            "name": "likeUrl",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "contract GetLoginStorage",
                    "name": "_storageAddress",
                    "type": "address"
                }
            ],
            "name": "setGLStorage",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "contract LikeStorage",
                    "name": "_storageAddress",
                    "type": "address"
                }
            ],
            "name": "setLikeStorage",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_address",
                    "type": "address"
                }
            ],
            "name": "setOwner",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "contract LikeStorage",
                    "name": "_likeStorage",
                    "type": "address"
                },
                {
                    "internalType": "contract GetLoginStorage",
                    "name": "_GLStorage",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "resourceTypeId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "resourceIdHash",
                    "type": "bytes32"
                }
            ],
            "name": "unlike",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_address",
                    "type": "address"
                }
            ],
            "name": "getGLUsernameHash",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "resourceTypeId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "resourceIdHash",
                    "type": "bytes32"
                }
            ],
            "name": "getResourceIdKey",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "resourceTypeId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "resourceIdHash",
                    "type": "bytes32"
                }
            ],
            "name": "getResourceIdStatistics",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "resourceTypeId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "resourceIdHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "urlHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "uint256",
                            "name": "reactions",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "donates",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "isActive",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct LikeStorage.ResourceIdStatistics",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "urlHash",
                    "type": "bytes32"
                }
            ],
            "name": "getResourceIdStatisticsUrl",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "resourceTypeId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "resourceIdHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "urlHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "uint256",
                            "name": "reactions",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "donates",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "isActive",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct LikeStorage.ResourceIdStatistics",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "urlHash",
                    "type": "bytes32"
                }
            ],
            "name": "getUrlHashKey",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "usernameHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "uint256",
                    "name": "resourceTypeId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "resourceIdHash",
                    "type": "bytes32"
                }
            ],
            "name": "getUserLikeResourceKey",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "usernameHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "urlHash",
                    "type": "bytes32"
                }
            ],
            "name": "getUserLikeUrlKey",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "GLStorage",
            "outputs": [
                {
                    "internalType": "contract GetLoginStorage",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "likeStorage",
            "outputs": [
                {
                    "internalType": "contract LikeStorage",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "key",
                    "type": "uint256"
                }
            ],
            "name": "validateGetResourceType",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "title",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "url",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "reactions",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "donates",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "ownerUsernameHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bool",
                            "name": "isActive",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct LikeStorage.ResourceType",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    getLoginInstance = null;
    onLike = {};
    onDislike = {};
    moduleId = 1;
    iframes = {};
    isAppAllowed = false;
    allowAppUrl = null;

    constructor() {
    }

    init() {
        let appId = 3;
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

        window._onGetLoginApiLoaded = async (instance) => {
            console.log('GetLogin loaded', instance);
            const data = await instance.init(appId, getLoginUrl, redirectUrl, accessToken)
            console.log('GetLogin init data', data);
            this.isAppAllowed = data.data.is_client_allowed;
            if (this.isAppAllowed) {
                console.log('App allowed!');
            } else {
                this.allowAppUrl = instance.getAuthorizeUrl();
                console.log('App not allowed! Allow app url', this.allowAppUrl);
            }

            this.getLoginInstance = instance;
            this.getLoginInstance.setClientAbi(this.storageAbi);
            this.getLoginInstance.setOnLogout(_ => {
                console.log('implement logout event here');
            });
            this.likeLogicAddress = await this.getLoginInstance.callContractMethod(this.likeStorageAddress, 'logicAddress', null);
            this.getLoginInstance.setClientAbi(this.logicAbi);
            if (window && window._onLikeInjectorLoaded) {
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
            const id = e.data.id;
            const requestId = e.data.requestId;
            const type = e.data.type;
            const event = e.data.event;
            const data = e.data.data;
            if (type === 'like-module-get') {
                if (event === 'getResourceIdStatisticsUrl') {
                    const receiveInfo = async () => {
                        const urlHash = await this.getLoginInstance.keccak256(data);
                        return this.getLoginInstance.callContractMethod(this.likeLogicAddress, event, urlHash);
                    };
                    receiveInfo()
                        .then(data => {
                            //console.log(data)
                            this.iframes[id].contentWindow.postMessage({
                                id: requestId,
                                //result: 'hello world (' + event + ') + ' + data
                                result: data
                            }, '*');
                        });

                    //console.log('like-module-get OK');
                    //console.log(this.iframes);

                    return;
                }
            }

            if (type !== 'like-module') {
                return;
            }

            if (event === 'like' && this.onLike[id]) {
                this.onLike[id](data);
                console.log('data', data.url);
                this.getLoginInstance.keccak256(data.url)
                    .then(urlHash => {
                        console.log('urlHash', urlHash);
                        this.getLoginInstance.sendTransaction(this.likeLogicAddress, 'likeUrl', [urlHash, '0x0000000000000000000000000000000000000000'], {});
                    });
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

        this.iframes[this.moduleId] = iframe;

        this.moduleId++;
    }
}


(new LikeInjector()).init();
