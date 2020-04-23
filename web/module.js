'use strict'

class LikeModule {
    constructor() {
    }

    init() {
        if (window && window.onLikeModuleLoaded) {
            window.onLikeModuleLoaded(this);
        }
    }

    onLikeClick() {
        // todo if integrate without iframe - external js in embedded page can call this method or fake click
        alert('Click')
    }

    draw(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.log('Element not found');
            return;
        }

        // todo create iframe where inject this script?
        const p = document.createElement('p');
        p.innerText = 'RED LIKES HERE';
        p.style.color = 'red';
        p.onclick = this.onLikeClick;
        element.appendChild(p);
    }
}

(new LikeModule()).init()
