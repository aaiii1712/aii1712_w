/* eslint-disable */
'use strict';

// Генератор файлов блока или компонента

// Использование: node create.js [имя блока] [доп. расширения через пробел] [ключ]
// ключ --c сгенерирует компонент

const fs = require('fs');
const projectConfig = require('./config.js');

const dir = projectConfig.dir;
const mkdirp = require('mkdirp');
const isComponent = process.argv.indexOf('--c') !== -1;
const blockName = process.argv[2];
const defaultExtensions = !isComponent ? ['scss','pug','js'] : ['scss','pug']; // расширения по умолчанию
const extensions = uniqueArray(defaultExtensions.concat(process.argv.slice(3)));

// Если есть имя блока
if (blockName) {
    const dirPath = `${!isComponent ? dir.blocks : dir.comp}${blockName}/`; // полный путь к создаваемой папке блока

    const made = mkdirp.sync(dirPath);
    console.log(`----- Создание папки: ${made}`);

    // Обходим массив расширений и создаем файлы, если они еще не созданы
    extensions.forEach((extension) => {
        const filePath = `${dirPath + blockName}.${extension}`; // полный путь к создаваемому файлу
        let fileContent = '';                                   // будущий контент файла
        let fileCreateMsg = '';                                 // будущее сообщение в консоли при создании файла

        if (extension.match('--')) return;

        if (extension === 'scss') {

        }

        else if (extension === 'js') {

        }

        else if (extension === 'md') {
            fileContent = '';
        }

        else if (extension === 'pug') {

        }

        else if (extension === 'img') {
            const imgFolder = `${dirPath}img/`;
            if (fileExist(imgFolder) === false) {
                const made = mkdirp.sync(imgFolder);
                console.log(`----- Создание папки: ${made}`);
            } else {
                console.log(`----- Папка ${imgFolder} НЕ создана (уже существует) `);
            }
        }

        else if (extension === 'bg-img') {
            const imgFolder = `${dirPath}bg-img/`;
            if (fileExist(imgFolder) === false) {
                const made = mkdirp.sync(imgFolder);
                console.log(`----- Создание папки: ${made}`);
            } else {
                console.log(`----- Папка ${imgFolder} НЕ создана (уже существует) `);
            }
        }

        if (fileExist(filePath) === false && extension !== 'img' && extension !== 'bg-img' && extension !== 'md') {
            fs.writeFile(filePath, fileContent, (err) => {
                if (err) {
                    return console.log(`----- Файл НЕ создан: ${err}`);
                }
                console.log(`----- Файл создан: ${filePath}`);
                if (fileCreateMsg) {
                    console.warn(fileCreateMsg);
                }
            });
        }
        else if (extension !== 'img' && extension !== 'bg-img' && extension !== 'md') {
            console.log(`----- Файл НЕ создан: ${filePath} (уже существует)`);
        }
        else if (extension === 'md') {
            fs.writeFile(`${dirPath}readme.md`, fileContent, (err) => {
                if (err) {
                    return console.log(`----- Файл НЕ создан: ${err}`);
                }
                console.log(`----- Файл создан: ${dirPath}readme.md`);
                if (fileCreateMsg) {
                    console.warn(fileCreateMsg);
                }
            });
        }
    });
} else {
    console.log('----- Отмена операции: не указан блок');
}



function uniqueArray(arr) {
    const objectTemp = {};
    for (let i = 0; i < arr.length; i++) {
        const str = arr[i];
        objectTemp[str] = true;
    }
    return Object.keys(objectTemp);
}

function fileExist(path) {
    const fs = require('fs');
    try {
        fs.statSync(path);
    } catch (err) {
        return !(err && err.code === 'ENOENT');
    }
}
