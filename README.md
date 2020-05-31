# Like

### Description

Last uploaded version to swarm (31.05.20). Swarm hash: ```96d84e31f04fcf8265c3f887f912a0b29a5651adac75a6e1e269bdee8db39c66```

This project uses [GetLogin](https://github.com/GetLoginEth/login) for interaction with blockchain.

Example with integrated Like module: https://swarm-gateways.net/bzz:/[HASH]/example.html


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
