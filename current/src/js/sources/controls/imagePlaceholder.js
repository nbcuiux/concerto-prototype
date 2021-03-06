function ImagePlaceholder(el, file) {
    this.el = el;
    this.file = file;

    this._init();
    this._initEvents();
}

ImagePlaceholder.prototype._init = function() {
    this.options = {
        name: this.el.dataset.name
    };
    this.options.id = this.el.id + '-placeholder';

    //Wrapp placeholder
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('c-ImagePlaceholder');
    if (!this.file) {this.wrapper.classList.add('is-empty');}
    this.wrapper.id = this.options.id;

    //Placeholder Image
    this.image = document.createElement('div');
    this.image.classList.add('c-ImagePlaceholder-img');
    if (this.file) {this.image.style.backgroundImage = this.file.fileData.url;}
    this.wrapper.appendChild(this.image);

    //Placeholder controls
    this.controls = $('<div></div>').addClass('image-placeholder__controls').get(0);
    this.controlsUpload = $('<div></div>').addClass('image-placeholder__controls-button').get(0);
    this.controlsUploadIcon = $('<i class="fa fa-upload"></i>').addClass('image-placeholder__controls-button-icon').get(0);
    this.controlsUploadText = $('<div></div>').addClass('image-placeholder__controls-button-text').text('Upload from your computer').get(0);
    this.controlsUpload.appendChild(this.controlsUploadIcon);
    this.controlsUpload.appendChild(this.controlsUploadText);

    this.controlsDivider = $('<div></div>').addClass('image-placeholder__controls-divider').get(0);

    this.controlsLibrary = $('<div></div>').addClass('image-placeholder__controls-button').get(0);
    this.controlsLibraryIcon = $('<i class="fa fa-folder-open"></i>').addClass('image-placeholder__controls-button-icon').get(0);
    this.controlsLibraryText = $('<div></div>').addClass('image-placeholder__controls-button-text').text('Add from asset library').get(0);
    this.controlsLibrary.appendChild(this.controlsLibraryIcon);
    this.controlsLibrary.appendChild(this.controlsLibraryText);

    this.controls.appendChild(this.controlsUpload);
    this.controls.appendChild(this.controlsDivider);
    this.controls.appendChild(this.controlsLibrary);
    this.image.appendChild(this.controls);

    //Clear button
    this.delete = document.createElement('div');
    this.delete.classList.add('c-ImagePlaceholder-delete');
    this.image.appendChild(this.delete);

    //Edit button
    this.edit = document.createElement('button');
    this.edit.classList.add('button', 'button_style_outline-white', 'c-ImagePlaceholder-edit');
    this.edit.innerHTML = 'Edit';
    this.image.appendChild(this.edit);

    //File name
    this.fileName = document.createElement('div');
    this.fileName.classList.add('c-ImagePlaceholder-fileName');
    this.fileName.innerHTML = this.file ? this.file.fileData.title : '';
    this.wrapper.appendChild(this.fileName);

    //Placeholder Title
    this.title = document.createElement('div');
    this.title.classList.add('c-ImagePlaceholder-title');
    this.title.innerHTML = this.options.name || 'Cover';
    this.wrapper.appendChild(this.title);

    //Fileinput to handle click to upload image
    this.fileInput = document.createElement("input");
    this.fileInput.type = "file";
    this.fileInput.multiple = false;
    this.fileInput.hidden = true;
    this.fileInput.accept = "image/*, video/*";

    this.wrapper.appendChild(this.fileInput);

    this.el.parentNode.insertBefore(this.wrapper, this.el);
    this.el.parentNode.removeChild(this.el);

};

ImagePlaceholder.prototype._initEvents = function() {
    var self = this;

    function clear(e) {
        e.stopPropagation();
        self.file = undefined;
        self._update();
    }

    function openLibrary() {
        scrollPosition = $('body').scrollTop();
        updateAssetLibrary();
        $('#al').removeClass('hidden');
        $('#al').addClass('modal');
        $('#wrapper').addClass('overflow');
        singleselect = true;

        $('#addFromALButton').text('Set Cover');

        $('#addFromALButton').click(function(){
            lastSelected = null;
            setSelectedFile();
            closeAssetLibrary();
            singleselect = false;
            $('body').scrollTop(scrollPosition);
        });
    }

    function closeAssetLibrary() {
        lastSelected = null;
        $('.al .files .section__files .file.selected').removeClass('selected');
        deselectAll();
        $('.modal').addClass('hidden').removeClass('modal');
        $('#wrapper').removeClass('overflow');
        $('#addFromALButton').unbind('click');
        $('body').scrollTop(scrollPosition);
        document.removeEventListener('keydown', handleEscKeydown);
        document.removeEventListener('keydown', handleEnterKeydown);
    }

    function setSelectedFile() {
        var selectedFile = $('.al .files .section__files .file.selected'),
            fileId = $(selectedFile).find('.file__id').text(),
            file = assetLibraryObjects.filter(function(f) {
                return f.id === fileId;
            })[0];

        self.file = {
            fileData: file
        };
        self._update();
    }


    self.fileInput.addEventListener('change', function(e) {
        fileToObject(e.target.files[0]).then(function(res) {
            self.file = {
                fileData: res,
                selected: false,
                position: 1000,
                caption: '',
                galleryCaption: false,
                justUploaded: true
            };
            self._update();
        });
    });

    self.controlsUpload.addEventListener('click', function(e) {
        if (!self.file) {
            self.fileInput.click();
        }
    });
    self.delete.addEventListener('click', clear);
    self.edit.addEventListener('click', function(e) {
        editFiles([self.file]);
    });

    self.controlsLibrary.addEventListener('click', openLibrary);
};
ImagePlaceholder.prototype._update = function() {
    if (this.file) {
        this.wrapper.classList.remove('is-empty');
        this.image.style.backgroundImage = 'url(' + this.file.fileData.url + ')';
        this.fileName.innerHTML = this.file.fileData.title;
    }
    else {
        this.wrapper.classList.add('is-empty');
        this.image.style.backgroundImage = 'none';
        this.fileName.innerHTML = '';
    }
};

ImagePlaceholder.prototype.setImage = function(file) {
    this.file = file;
    this._update();
};

function initImagePlaceholders() {
    var imagePlaceholders = [];
    [].slice.call(document.querySelectorAll('.js-imagePlaceholder')).forEach(function(el) {
        imagePlaceholders.push(new ImagePlaceholder(el));
    });
    return imagePlaceholders;
}
