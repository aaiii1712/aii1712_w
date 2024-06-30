/* global module */
let config = {
    'addStyleBefore': [
        // "swiper/swiper-bundle.css",
        // "swiper/css/swiper.min.css",//old version
        // "flickity/dist/flickity.css",
        // "flickity-fade/flickity-fade.css",
        // "slick-carousel/slick/slick.css",
        // "@fancyapps/fancybox/dist/jquery.fancybox.min.css",
        // "malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css",
        // "daterangepicker/daterangepicker.css",
        // "pickmeup/css/pickmeup.css",
        // "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css",
        // "bootstrap-datepicker/dist/css/bootstrap-datepicker.standalone.min.css",
        // "src/libs/bootstrap-datepicker.standalone-theme-orange.css",
        // "jquery-ui-dist/jquery-ui.min.css",
        // "nouislider/distribute/nouislider.min.css",
        // "rateyo/min/jquery.rateyo.min.css"
        //" tippy.js/dist/tippy.css",
        // "tippy.js/dist/backdrop.css",
        // "tippy.js/dist/border.css",
        // "tippy.js/dist/svg-arrow.css",
        // "tippy.js/themes/light.css",
        // "tippy.js/animations/perspective.css",
        'src/scss/fonts',
        'src/scss/variables.scss',
        'src/scss/mixins.scss',
        'src/scss/scafolding.scss',
        'src/scss/global.scss',
        // 'somePackage/dist/somePackage.css', // для 'node_modules/somePackage/dist/somePackage.css',
    ],
    'addStyleAfter': [
        // 'src/scss/print.scss',
    ],
    'addJsBefore': [
        'what-input/dist/what-input.js',
        '../img/sprite-svg/sprite-svg.js',
        '../js/global-scripts.js',
        // '../blocks/header/header.js', // относительно папки src/js
        // 'somePackage/dist/somePackage.js', // для 'node_modules/somePackage/dist/somePackage.js',
    ],
    'addJsAfter': [
        // './script.js',
    ],
    'addAssets': [
        `src/img/**/*.{png,svg,jpg,jpeg,gif,webp}`,
        `!src/img/sprite-svg/**`,
    ],
    'dir': {
        'src': 'src/',
        'build': 'dist/',
        'blocks': 'src/blocks/',
        'comp': 'src/components/'
    }
};

module.exports = config;