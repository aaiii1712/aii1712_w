// import jqueryValidation from 'jquery-validation';
// import 'jquery-validation/dist/localization/messages_ru.min';
// window.jqueryValidation = jqueryValidation;

// import moment from 'moment';
// import 'moment/locale/ru.js';
// window.moment = moment;
//список модулей для свайпера https://swiperjs.com/swiper-api#using-js-modules
// import Swiper, {Navigation, Pagination,} from 'swiper';
// Swiper.use([Navigation, Pagination]);

// import tippy from 'tippy.js';

export const mac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
isSafari && document.documentElement.classList.add('is-safari');

export function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar";

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);
    return widthNoScroll - widthWithScroll;
}

// let radioValue = number_format($(this).val(), 0, ',', ' ');
export function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + (Math.round(n * k) / k)
                .toFixed(prec);
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
        .split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '')
        .length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1)
            .join('0');
    }
    return s.join(dec);
}

export const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

export function modalOpenMac() {
    if ( mac ) {
        if ($(document).height() > $(window).height() && !$("html").hasClass("apple-fix")) {
            var scrollTop = ($('html').scrollTop()) ? $('html').scrollTop() : $('body').scrollTop(); // Works for Chrome, Firefox, IE...
            $('html').css('top',-scrollTop);
            document.documentElement.classList.add("apple-fix");
        }
    }
}

export function modalCloseMac() {
    if (mac) {
        var scrollTop = parseInt($('html').css('top'));
        document.documentElement.classList.remove("apple-fix");
        $('html,body').scrollTop(-scrollTop);
    }
}

// проверка на боковой скролл
export function hasScrollbar() {
    return $(document).height() > $(window).height();
}

export function checkScrollTopBot(block,inner) {
    // block - height: 600px;
    // inner - width: 100%; height: 100%; overflow: auto;
    if (!block || !inner) {
        return false;
    }
    let currentScroll = inner.scrollTop;
    let maxScroll = inner.scrollHeight - inner.clientHeight;
    if ( currentScroll > 0 && currentScroll + 20 < maxScroll) {
        block.classList.add('shadow-top', 'shadow-bottom');
    } else if ( currentScroll + 20 >= maxScroll ) {
        block.classList.remove('shadow-bottom');
    } else {
        block.classList.add('shadow-bottom');
        block.classList.remove('shadow-top');
    }
}
// window.checkScrollTopBot = checkScrollTopBot;
export function scrollInTo(block,elem) {
    $(block).animate({
        scrollTop: elem.offsetTop
    });
}
// window.scrollInTo = scrollInTo;

export const getCookie = (name) => {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
export const setCookie = (name, value, options = {}) => {

    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

// tippy.setDefaultProps({
//     placement: 'auto'
// });
// tippy(document.querySelectorAll('[data-tippy-content]'), {
//     allowHTML: true,
//     appendTo: () => document.body,
//     interactive: true,
//     // theme: 'infoIcon',
//     // interactiveBorder: 15,
//     // offset: [-18,1]
// });