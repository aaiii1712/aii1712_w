// .upload-file-block
//     .upload-file-block__list
//     label.upload-file-block__area
//         input(type='file' name='userfile[]' multiple accept="image/*").upload-file-block__input
//         .upload-file-block__btn
//             svg(width="24" height="24" viewBox="0 0 24 24")
//                 use(xlink:href="img/sprite.svg#clip-2")
//             span Загрузить изображение

let arrFiles = [];
function getFormData(fd,inputFileName) {
    fd.delete(inputFileName);
    if (arrFiles.length) {
        arrFiles.forEach(function(file) {
            fd.append(inputFileName, file, file.name);
        });
    }
    return fd;
}
window.getFormData = getFormData;

function decimalAdjust(type, value, exp) {
    // Если степень не определена, либо равна нулю...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // Если значение не является числом, либо степень не является целым числом...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Сдвиг разрядов
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Обратный сдвиг
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Предварительный просмотр файла
function previewFile(file,block) {
    // block - .upload-file-block
    // расширение файла
    // let expansion = file.name.slice(file.name.lastIndexOf('.') + 1);
    // if (!file.type.match('image'))
    // if (expansion === 'docx' || expansion === 'doc' || expansion === 'pdf' || expansion === 'txt')
    // размер файла в MB
    let filesSize = decimalAdjust('ceil', file.size / 1048576, -2);
    if (block.querySelector('.upload-file-block__input').hasAttribute('data-max-size')) {
        if (filesSize > block.querySelector('.upload-file-block__input').dataset.maxSize) {
            console.log('more');
            return false;
        }
    }
    arrFiles.push(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (ev) {
        const src = ev.target.result;
        block.querySelector('.upload-file-block__list').insertAdjacentHTML('beforeend',`
                <div class="upload-file-block__item">
                    <p class="upload-file-block__file-name" data-file-name="${file.name}">${file.name}</p>
                    <img class="upload-file-block__img" src="${src}" alt="${file.name}" />
                    <span class="upload-file-block__size">${filesSize} Мб</span>
                    <div class="upload-file-block__remove">Удалить</div>
                </div>
                `);
    }
}

export function initUploadFileBlock() {
    let uploadFileBlock = document.querySelectorAll('.upload-file-block');
    if (uploadFileBlock.length) {
        let uploadAreaList = document.querySelectorAll('.upload-file-block__area');
        let uploadFileInput = document.querySelectorAll('.upload-file-block__input');
        // убираем стандартно поведение перетаскивания по умолчанию
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        // Выделение области при перетаскивани
        ['dragenter', 'dragover'].forEach(function (eventName) {
            uploadAreaList.forEach(function(el) {
                el.addEventListener(eventName, function(e) {
                    preventDefaults(e);
                    this.classList.add('highlight');
                });
            });
        });
        uploadAreaList.forEach(function(el) {
            // Выделение области после перетаскивани
            el.addEventListener('dragleave', function(e) {
                preventDefaults(e);
                this.classList.remove('highlight');
            });
            // Обработка закинутых файлов
            el.addEventListener('drop', function(e){
                let block = this.closest('.upload-file-block');
                let dt = e.dataTransfer;
                let files = dt.files;
                files = Array.prototype.slice.call(files);
                files.forEach(function(elem) {
                    if (!block.querySelector(`.upload-file-block__file-name[data-file-name='${elem.name}']`)) {
                        previewFile(elem,block);
                    }
                });
            });
        });
        // загрузка файла через инпут
        uploadFileInput.forEach(function(el) {
            el.addEventListener('change', function() {
                let block = this.closest('.upload-file-block');
                for (let i = 0; i < this.files.length; i++) {
                    let thisFile = this.files[i];
                    if (!block.querySelector(`.upload-file-block__file-name[data-file-name='${thisFile.name}']`)) {
                        previewFile(thisFile,block);
                    }
                }
            });
        });
        // удаление файла
        uploadFileBlock.forEach(function(el) {
            el.addEventListener('click', function(e) {
                if (e.target.classList.contains('upload-file-block__remove')) {
                    let name = e.target.closest('.upload-file-block__item').querySelector('.upload-file-block__file-name').dataset.fileName;
                    arrFiles.forEach(function (item, i) {
                        if (item.name === name) {
                            arrFiles.splice(i, 1);
                        }
                    });
                    if (!arrFiles.length) {
                        e.target.closest('.upload-file-block').querySelector('.upload-file-block__input').value = '';
                    }
                    e.target.closest('.upload-file-block__item').remove();
                }
            });
        });
    }
}