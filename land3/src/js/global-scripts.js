// import $ from 'jquery';
// window.jQuery = $;
// window.$ = $;

//pureJS polyfills IE
(function() {

    if (!Element.prototype.closest) {// проверяем поддержку closest
        Element.prototype.closest = function(css) {
            var node = this;

            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        };
    }

    if (!Element.prototype.matches) {// проверяем поддержку matches
        Element.prototype.matches = Element.prototype.matchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector;

    }

})();

export function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

class NoScroll {
    constructor(fixedElements) {
        this.fixForIOS12 = true;
        this.gsapScrollTrigger = typeof ScrollTrigger !== 'undefined';

        this.html = document.querySelector('html');
        this.body = document.body;
        this.scrollTop = 0;
        this.scrollWidth = this.getScrollWidth();
        this.fixedElements = document.querySelectorAll(fixedElements);

        this.isScrollOffFlag = false;

        this.createCss();
    }
    createCss() {
        if (this.fixForIOS12) {
            //position: fixed; для запрета скрола при открытии модалок в ios 12 и ниже
            this.css = `
                .noScroll {
                    position: fixed;
                    overflow: hidden;
                }
            `;
        } else {
            this.css = `
            .noScroll {
                overflow: hidden;
            }
        `;
        }

        this.head = document.head || document.getElementsByTagName('head')[0];
        this.style = document.createElement('style');
        this.body.insertBefore(this.style, this.body.childNodes[0]);
        this.style.appendChild(document.createTextNode(this.css));
    }
    getScrollWidth() {
        if ( document.body.scrollHeight <= window.innerHeight ) return 0;
        let outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar";

        this.body.appendChild(outer);

        let widthNoScroll = outer.offsetWidth;
        outer.style.overflow = "scroll";

        let inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        let widthWithScroll = inner.offsetWidth;

        outer.parentNode.removeChild(outer);
        return widthNoScroll - widthWithScroll;
    }

    isScrollOff() {
        return this.isScrollOffFlag;
    }

    disableScroll() {

        if (this.fixForIOS12 && this.gsapScrollTrigger) {
            ScrollTrigger.getAll().forEach(st => st.disable());
        }

        this.scrollTop = this.html.scrollTop ? this.html.scrollTop : this.body.scrollTop;
        this.scrollWidth = this.getScrollWidth();

        this.html.classList.add('noScroll');
        this.html.style.top = -this.scrollTop+'px';
        this.html.style.marginRight = this.scrollWidth+'px';
        this.html.style.width = 'calc(100% - '+this.scrollWidth+'px';
        this.isScrollOffFlag = true;


        if (this.fixedElements[0]) {
            [].forEach.call(this.fixedElements, (el, i)=> {
                let elWidth = el.clientWidth;
                let pos = getComputedStyle(el).position;
                let cssWidth = elWidth + this.scrollWidth >= window.innerWidth ? elWidth - this.scrollWidth + 'px' : '';
                if (pos === 'fixed') {
                    el.style.width = cssWidth;
                    el.style.marginRight = this.scrollWidth+'px';
                }
            });
        }
    }
    enableScroll() {
        this.html.classList.remove('noScroll');
        this.html.style.top = '';
        this.html.style.marginRight = '';
        this.html.style.width = '';


        if (this.fixedElements[0]) {
            [].forEach.call(this.fixedElements, (el, i)=> {
                el.style.width = '';
                el.style.marginRight = '';
            });
        }
        this.html.scrollTop = this.scrollTop;
        this.body.scrollTop = this.scrollTop;//fix for ios 12
        this.scrollTop = 0;
        this.isScrollOffFlag = false;

        if (this.fixForIOS12 && this.gsapScrollTrigger) {
            ScrollTrigger.getAll().forEach(st => st.enable());
        }
    }
}
const noScroll = new NoScroll();
// const noScroll = new NoScroll('.header__inner');//'.header__inner, .catalog-video'
window.noScroll = noScroll;

const PubSub = {
    channels: {},
    subscribe(channelName, listener) {
        if (!this.channels[channelName]) {
            this.channels[channelName] = []
        }
        this.channels[channelName].push(listener)
    },

    publish(channelName, data) {
        const channel = this.channels[channelName]
        if (!channel || !channel.length) {
            return
        }

        channel.forEach(listener => listener(data))
    },
}
window.CHANNEL_NAMES = {}
window.PubSub = PubSub

function setCSSVarVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setCSSVarVH();
window.addEventListener('resize', debounce(setCSSVarVH, 160));

[...document.querySelectorAll('.is-default-hidden')].forEach(function(el) {
    el.classList.remove('is-default-hidden');
});