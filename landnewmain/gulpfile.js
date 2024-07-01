/* global exports process console __dirname Buffer */
"use strict";
const isProd = process.env.NODE_ENV === 'production';

const { series, parallel, src, dest, watch, lastRun } = require('gulp');
const fs = require('fs');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const debug = require('gulp-debug');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const TerserPlugin = require('terser-webpack-plugin');
const postcss = require('gulp-postcss');
const atImport = require("postcss-import");
const autoprefixer = require("autoprefixer");
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const notify = require("gulp-notify");
const del = require('del');

// Глобальные настройки этого запуска
const st = {};
st.config = require('./config.js');
const dir = st.config.dir;
st.scssImportsList = []; // список импортов стилей
// Сообщение для компилируемых файлов
let doNotEditMsg = '\n ВНИМАНИЕ! Этот файл генерируется автоматически.\n Любые изменения этого файла будут потеряны при следующей компиляции.\n Любое изменение проекта без возможности компиляции ДОЛЬШЕ И ДОРОЖЕ в 2-5 раз.\n\n';
// Список и настройки плагинов postCSS
let postCssPlugins = [
    autoprefixer({grid: true}),
    // mqpacker({
    //     sort: true
    // }),
    atImport(),
    // inlineSVG(),
    // objectFitImages(),
];

function generateSvgSprite(cb) {
    let spriteSvgPath = `${dir.src}img/sprite-svg/`;
    if(fileExist(spriteSvgPath)) {
        return src(spriteSvgPath + '*.svg')
            .pipe(svgmin(function () {
                return {
                    plugins: [
                        { cleanupIDs: { minify: true } },
                        { removeViewBox: false },
                        { removeAttrs: { attrs: '(fill|stroke)' } }
                        ]
                }
            }))
            .pipe(svgstore({ inlineSvg: true }))
            .pipe(rename('sprite.svg'))
            .pipe(dest(`${dir.src}img/`));
    }
    else {
        cb();
    }
}
exports.generateSvgSprite = generateSvgSprite;

function writePugMixinsFile(cb) {
    let pugMixins = '//-' + doNotEditMsg.replace(/\n /gm,'\n  ');
    let allBlocksWithPugFiles = getDirectories('pug',dir.comp);
    allBlocksWithPugFiles.forEach(function(blockName) {
        pugMixins += `include ${dir.comp.replace(dir.src,'../')}${blockName}/${blockName}.pug\n`;
    });
    fs.writeFileSync(`${dir.src}pug/mixins.pug`, pugMixins);
    cb();
}
exports.writePugMixinsFile = writePugMixinsFile;

function compilePugFast() {
    const fileList = [
        `src/pages/**/*.pug`
    ];
    return src(fileList, { since: lastRun(compilePugFast) })
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err.message);
                this.emit('end');
            }
        }))
        .pipe(debug({title: 'Compiles '}))
        .pipe(pug({ pretty: true }).on('error', notify.onError()))
        .pipe(replace(/^(\s*)(<button.+?>)(.*)(<\/button>)/gm, '$1$2\n$1  $3\n$1$4'))
        .pipe(replace(/^( *)(<.+?>)(<script>)([\s\S]*)(<\/script>)/gm, '$1$2\n$1$3\n$4\n$1$5\n'))
        .pipe(replace(/^( *)(<.+?>)(<script\s+src.+>)(?:[\s\S]*)(<\/script>)/gm, '$1$2\n$1$3$4'))
        .pipe(dest('dist/'));
}
exports.compilePugFast = compilePugFast;

function compilePug() {
    const fileList = [
        `src/pages/**/*.pug`
    ];
    return src(fileList)
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err.message);
                this.emit('end');
            }
        }))
        .pipe(debug({title: 'Compiles '}))
        .pipe(pug({ pretty: true }).on('error', notify.onError()))
        .pipe(replace(/^(\s*)(<button.+?>)(.*)(<\/button>)/gm, '$1$2\n$1  $3\n$1$4'))
        .pipe(replace(/^( *)(<.+?>)(<script>)([\s\S]*)(<\/script>)/gm, '$1$2\n$1$3\n$4\n$1$5\n'))
        .pipe(replace(/^( *)(<.+?>)(<script\s+src.+>)(?:[\s\S]*)(<\/script>)/gm, '$1$2\n$1$3$4'))
        .pipe(dest('dist/'));
}
exports.compilePug = compilePug;

function copyImg() {
    return src(st.config.addAssets)
        .pipe(dest(`${dir.build}img/`));
}
exports.copyImg = copyImg;

function writeSassImportsFile(cb) {
    let msg = `\n/*!*${doNotEditMsg.replace(/\n /gm,'\n * ').replace(/\n\n$/,'\n */\n\n')}`;
    let styleImports = msg;
    const newScssImportsList = [];
    // Подключаем из конфига scss, который будет подключен 1-м
    st.config.addStyleBefore.forEach(function(src) {
        newScssImportsList.push(src);
    });
    // Подключаем миксины
    const mixinsScss = getDirectories('scss', dir.comp);
    mixinsScss.forEach(function (blockName) {
        newScssImportsList.push(`${dir.comp}${blockName}/${blockName}.scss`)
    });

    // let libsInclude =  st.config.blocksInclude;
    // libsInclude.forEach(function(blockWithScssFile){
    //     let splitPath = blockWithScssFile.split('/');
    //     let name = splitPath[splitPath.length - 1];
    //
    //     let url = `${dir.src}${blockWithScssFile}/${name}.scss`;
    //     if (newScssImportsList.indexOf(url) > -1) return;
    //     newScssImportsList.push(url);
    // });
    // Подключаем папку blocks
    let allBlocksWithScssFiles = getDirectories('scss', dir.blocks);
    allBlocksWithScssFiles.forEach(function (blockWithScssFile) {
        let url = `${dir.blocks}${blockWithScssFile}/${blockWithScssFile}.scss`;
        if (newScssImportsList.indexOf(url) > -1) return;
        newScssImportsList.push(url);
    });
    // Подключаем из конфига scss, который будет подключен последним
    st.config.addStyleAfter.forEach(function(src) {
        newScssImportsList.push(src);
    });

    let diff = getArraysDiff(newScssImportsList, st.scssImportsList);
    if (diff.length) {
        newScssImportsList.forEach(function(src) {
            styleImports += `@import "${src}";\n`;
        });
        styleImports += msg;
        fs.writeFileSync(`${dir.src}scss/style.scss`, styleImports);
        console.log('---------- Write new style.scss');
        st.scssImportsList = newScssImportsList;
    }
    cb();
}
exports.writeSassImportsFile = writeSassImportsFile;

function compileSass() {
    const fileList = [
        `${dir.src}scss/style.scss`,
    ];
    return src(fileList, { sourcemaps: true })
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err.message);
                this.emit('end');
            }
        }))
        .pipe(debug({title: 'Compiles:'}))
        .pipe(sass({includePaths: [__dirname+'/','node_modules']})).on('error', notify.onError())
        .pipe(postcss(postCssPlugins))
        // .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8']))
        .pipe(cssnano({ zindex: false, colormin: false, autoprefixer: false , discardComments: {removeAll: true}}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(`${dir.build}/css`, { sourcemaps: '.' }))
        .pipe(browserSync.stream());
}
exports.compileSass = compileSass;

function writeJsRequiresFile(cb) {
    const jsRequiresList = [];
    // Подключаем из конфига js, который будет подключен 1-м
    st.config.addJsBefore.forEach(function(src) {
        jsRequiresList.push(src);
    });
    // Подключаем миксины
    const mixinsJs = getDirectories('js',dir.comp);
    mixinsJs.forEach(function (blockName) {
        jsRequiresList.push(`../components/${blockName}/${blockName}.js`)
    });
    // Подключаем папку blocks
    const allBlocksWithJsFiles = getDirectories('js',dir.blocks);
    allBlocksWithJsFiles.forEach(function(blockName){
        let src = `../blocks/${blockName}/${blockName}.js`
        if (jsRequiresList.indexOf(src) > -1) return;
        jsRequiresList.push(src);
    });
    // Подключаем из конфига js, который будет подключен последним
    st.config.addJsAfter.forEach(function(src) {
        jsRequiresList.push(src);
    });
    let msg = ``;
    let jsRequires = msg + '/* global require */\n\n';
    jsRequiresList.forEach(function(src) {
        jsRequires += `require('${src}');\n`;
    });
    // jsRequires += msg;
    fs.writeFileSync(`${dir.src}js/entry.js`, jsRequires);
    console.log('---------- Write new entry.js');
    cb();
}
exports.writeJsRequiresFile = writeJsRequiresFile;

function buildJs() {
    const entryList = {
        'bundle': `./${dir.src}js/entry.js`,
    };
    return src(`./${dir.src}js/entry.js`)
        .pipe(plumber())
        .pipe(webpackStream({
            mode: !isProd?'development':'production',
            performance: {
                // hints: false,
                maxAssetSize: 1000000,
                maxEntrypointSize: 1000000,
            },
            entry: entryList,
            output: {
                // filename: '[name].js',
                filename: 'scripts.min.js',
            },
            devtool: !isProd?'source-map':false,
            module: {
                rules: [
                    {
                        test: /\.(js)$/,
                        exclude: /(node_modules)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }
                ]
            },
            optimization: {
                minimize: isProd,
                minimizer: [
                    new TerserPlugin({
                        terserOptions: {
                            format: {
                                comments: false,
                            },
                        },
                        extractComments: false,
                    }),
                ],
            },
            // externals: {
            //   jquery: 'jQuery'
            // }
        },webpack))
        .pipe(dest(`${dir.build}js`));
}
exports.buildJs = buildJs;

function copyStatic() {
    return src([
        'src/static/**/*',
    ])
        .pipe(dest('dist/'));
}
exports.copyStatic = copyStatic;

function clearBuildDir() {
    return del([
        `${dir.build}**/*`,
        `!${dir.build}readme.md`,
    ]);
}
exports.clearBuildDir = clearBuildDir;

function reload(done) {
    browserSync.reload();
    done();
}
function serve() {
    browserSync.init({
        server: 'dist',
        port: 8080,
        startPath: 'index.html',
        open: false,
        notify: true,
    });

    /*
    * PUG
    */
    // Страницы: изменение, добавление
    watch([`src/pages/**/*.pug`], { events: ['change', 'add'], delay: 100 }, series(
        compilePugFast,
        parallel(writeSassImportsFile, writeJsRequiresFile),
        parallel(compileSass, buildJs),
        reload
    ));

    // Страницы: удаление
    // watch([`${dir.src}pages/**/*.pug`], { delay: 100 })
    //     // TODO попробовать с events: ['unlink']
    //     .on('unlink', function(path) {
    //         let filePathInBuildDir = path.replace(`${dir.src}pages/`, dir.build).replace('.pug', '.html');
    //         fs.unlink(filePathInBuildDir, (err) => {
    //             if (err) throw err;
    //             console.log(`---------- Delete:  ${filePathInBuildDir}`);
    //         });
    //     });

    // Миксины для pug: все события
    watch([`${dir.comp}**/*.pug`], { delay: 100 }, series(
        writePugMixinsFile,
        compilePug,
        parallel(writeSassImportsFile, writeJsRequiresFile),
        parallel(compileSass, buildJs),
        reload,
    ));
    // Шаблоны pug: все события
    watch([`${dir.src}pug/**/*.pug`, `!${dir.src}pug/mixins.pug`], { delay: 100 }, series(
        compilePug,
        parallel(writeSassImportsFile, writeJsRequiresFile),
        parallel(compileSass, buildJs),
        reload,
    ));
    // Разметка Блоков: добавление
    watch([`${dir.blocks}**/*.pug`], { events: ['add'], delay: 100 }, series(
        compilePug,
        reload
    ));
    // Разметка Блоков: изменение
    watch([`${dir.blocks}**/*.pug`], { events: ['change'], delay: 100 }, series(
        compilePug,
        reload
    ));

    /*
    * SCSS
    */
    // Стили Блоков: добавление
    watch([`${dir.blocks}**/*.scss`], { events: ['add'], delay: 100 }, series(
        writeSassImportsFile,
        compileSass,
    ));
    // Стили Блоков: изменение
    watch([`${dir.blocks}**/*.scss`], { events: ['change'], delay: 100 }, series(
        compileSass,
    ));
    // Миксины для scss: все события
    watch([`${dir.comp}**/*.scss`], { delay: 100 }, series(
        writeSassImportsFile,
        compileSass,
    ));
    // Стилевые глобальные файлы: все события
    watch([`${dir.src}scss/**/*.scss`, `!${dir.src}scss/style.scss`], { events: ['all'], delay: 100 }, series(
        compileSass,
    ));

    /*
    * JS
    */
    // Скриптовые глобальные файлы: все события
    watch([`${dir.src}js/global-scripts.js`, `${dir.blocks}**/*.js`, `${dir.comp}**/*.js`], { events: ['all'], delay: 100 }, series(
        writeJsRequiresFile,
        buildJs,
        reload
    ));

    /*
    * Images
    */
    // Спрайт SVG
    watch([`${dir.src}img/sprite-svg/*.svg`], { events: ['all'], delay: 100 }, series(
        generateSvgSprite,
        copyImg,
        reload,
    ));
    // Картинки: все события
    watch(st.config.addAssets, { events: ['all'], delay: 100 }, series(
        copyImg,
        reload
    ));
    /*
    * Статичные файлы
    */
    watch([`${dir.src}static/**/*`], { events: ['all'], delay: 100 }, series(
        copyStatic,
        reload,
    ));
}

exports.build = series(
    parallel(clearBuildDir, writePugMixinsFile),
    parallel(compilePugFast, generateSvgSprite),
    parallel(copyStatic, copyImg, writeSassImportsFile, writeJsRequiresFile),
    parallel(compileSass, buildJs),
);

exports.default = series(
    parallel(clearBuildDir, writePugMixinsFile),
    parallel(compilePugFast, generateSvgSprite),
    parallel(copyStatic, copyImg, writeSassImportsFile, writeJsRequiresFile),
    parallel(compileSass, buildJs),
    serve,
);


// Функции, не являющиеся задачами Gulp ----------------------------------------
/**
 * Проверка существования файла или папки
 * @param  {string} path      Путь до файла или папки
 * @return {boolean}
 */
function fileExist(filepath){
    let flag = true;
    try{
        fs.accessSync(filepath, fs.F_OK);
    }catch(e){
        flag = false;
    }
    return flag;
}
/**
 * Получение разницы между двумя массивами.
 * @param  {array} a1 Первый массив
 * @param  {array} a2 Второй массив
 * @return {array}    Элементы, которые отличаются
 */
function getArraysDiff(a1, a2) {
    return a1.filter(i=>!a2.includes(i)).concat(a2.filter(i=>!a1.includes(i)))
}
/**
 * Получение всех названий поддиректорий, содержащих файл указанного расширения, совпадающий по имени с поддиректорией
 * @param  {string} ext    Расширение файлов, которое проверяется
 * @return {array}         Массив из имён блоков
 */
function getDirectories(ext,dist) {
    // let source = dir.blocks;
    let source = dist
    let res = fs.readdirSync(source)
        .filter(item => fs.lstatSync(source + item).isDirectory())
        .filter(item => fileExist(source + item + '/' + item + '.' + ext));
    return res;
}