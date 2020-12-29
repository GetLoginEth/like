# Like

### Description

Last uploaded version to swarm (31.05.20). Swarm hash: ```96d84e31f04fcf8265c3f887f912a0b29a5651adac75a6e1e269bdee8db39c66```

This project uses [GetLogin](https://github.com/GetLoginEth/login) for interaction with blockchain.

You can try Chrome Extension to like any page: [Like Chrome Extension](https://github.com/GetLoginEth/like-chrome).

Example with integrated Like module: https://swarm-gateways.net/bzz:/[HASH]/example.html


### General description

Like module is a plug-in javascript that embeds an iframe with a like button for every element that can be like on the page.

In addition to these iframes, an iframe getlogin is connected to the page to carry out operations (reading the number of likes and recording new ones).

In addition to the fact that iframe getlogin helps to carry out operations with the blockchain, it is responsible for checking the correctness of the page like module.

Attempts to carry out operations from unknown pages will be blocked. The correct pages can be configured on the getlogin management page.


### Integration
Add code before footer. This code will be launched immediately after the login system initialization.

```
window._onLikeInjectorLoaded = (instance) => {
    console.log('Example like plugin loaded');
    instance.draw({
        selector: '#like1',
        likeUrl: "https://www.youtube.com/watch?v=vX3F4QyQRw8",
        onLike: (data) => {
            console.log('Liked 1', data);
        },
        onUnlike: (data) => {
            console.log('Disliked 1', data);
        }
    });

    instance.draw({
        selector: '#like2',
        likeUrl: "https://www.youtube.com/watch?v=j23HnORQXvs",
        onLike: (data) => {
            console.log('Liked 2', data);
        },
        onUnlike: (data) => {
            console.log('Disliked 2', data);
        }
    });
};
```

With ```instance.draw``` you can draw Like iframe anywhere specified in ```selector``` (any css selector is applicable).

```onLike``` event will call when user like content.

```onUnlike``` event will call when user unlike liked content.

Add script to site footer. This script create one iframe for GetLogin and one iframe per `draw()` calling.
```
<script src="https://swarm-gateways.net/bzz:/[HASH]/LikeInjector.js"></script>
```

Html example:

```
<p>Like one here</p>
<div id="like1"></div>

<p>Like two here</p>
<div id="like2"></div>
```

### Auto deploy contracts

```node ./smart-deploy/deploy.js```

This command will compile the contracts, publish them on the rinkeby network, create an ABI file, and fill in the addresses of the contracts.

Information about already published contracts is stored in ```./web/LikeLogicAbi.json``` and ```./web/LikeStorageAbi.json```
