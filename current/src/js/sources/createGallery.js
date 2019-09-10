// Create DOM element for File from data
function createFileElement(f) {
    var fileData = f.fileData;
    //create basic element
    var file = $('<div></div>').addClass('file file_type_img file--withArragement'),
        fileIndex = $('<div></div>').addClass('hidden file__id').text(fileData.id),

        fileArragement = $('<div></div>').addClass('file__arragement'),
        fileArragementInput = $('<div></div>').addClass('file__aragement-input'), //.on('change', handleIndexFieldChange),
        fileArragementSettings = $('<div><i class="fa fa-ellipsis-v"></i></div>')
                                    .addClass('file__aragement-settings'),
                                    //.click(showRearrangeMenu),

        fileImg = $('<div></div>')
                    .addClass('file__img')
                    .css('background-image', 'url(' + fileData.url + ')'),
        fileControls = $('<div></div>').addClass('file__controls').click(toggleFileSelect),
        fileCheckmark = $('<div></div>').addClass('file__checkmark').click(toggleFileSelect),
        fileDelete = $('<div></div>').addClass('file__delete').click(handleDeleteClick),
        fileType = $('<div><i class="fa fa-camera"></i></div>').addClass('file__type'),
        fileEdit = $('<button>Edit</button>').addClass('button button_style_outline-white').click(handleFiledEditButtonClick),

        fileTitle = $('<div></div>').addClass('file__title').text(fileData.title),

        fileCaption = $('<div></div>').addClass('file__caption'),
        fileCaptionTitle = $('<div></div>').addClass('file__caption-title').text('Gallery caption'),
        fileCaptionTextarea = $('<textarea></textarea>')
                                .addClass('file__caption-textarea input')
                                .attr('data-label', 'Gallery Caption')
                                .val(f.caption)
                                .on('blur input', handleCaptionEdit)
                                .on('focus', handleCaptionStartEditing),

        //fileCaptionToggle = $('<div></div>').addClass('file__caption-toggle'),
        //fileCaptionToggle_Toggle = $('<input type="checkbox" />').addClass('toggle switch').click(handleCaptionToggleClick).prop('checked', function() {return f.caption? false : true;}),
        //fileCaptionToggle_Label = $('<label>Keep metadata caption</label>'),

        coverToggle = $('<button></button>')
            .addClass('button button_style_outline-gray u-noMargin button--small js-fileCoverToggle')
            .text('Make a cover')
            .click(handleCoverClick),

        fileEditButton = $('<button>Edit</button>').addClass('button button_style_outline-gray u-visible-xs u-noMargin u-right').click(handleFiledEditButtonClick);


    fileArragement.append(fileArragementInput);

    fileControls.append(fileCheckmark, fileDelete, fileType, fileEdit);
    fileImg.append(fileControls);

    //fileCaptionToggle.append(fileCaptionToggle_Toggle, fileCaptionToggle_Label);

    fileCaption.append(fileCaptionTitle, fileCaptionTextarea);

    file.append(fileIndex, fileArragement, fileImg, fileTitle, fileCaption, coverToggle, fileEditButton);

    return file;
}

function addFile(file) {
    var fileSection = $('.files .section__files');

    if (fileSection.hasClass('section__files_view_grid')) {
        file.addClass('file_view_grid');
    }
    if (fileSection.hasClass('section__files_view_list')) {
        file.addClass('file_view_list');
    }
    fileSection.append(file);
}

function handleCoverClick(e) {
    var newFileId = $(e.target).parents('.file').find('.file__id').text(),
		newFile = fileById(newFileId, galleryObjects);
    window.imagePlaceholders[0].setImage(newFile);
}

function updateGallery(scrollIndex) {
    singleselect = false;
    var justUploaded = false;

    // Remember position and selection of files
    $('.js-content .files .file').each(function(index, el) {
        var file = galleryObjects.filter(function(f) {
            return f.fileData.id === $(el).find('.file__id').text();
        })[0];
        if (file) {
            file.position = index;
            file.selected = $(el).hasClass('selected');
        }
    });

    //Clear files section
    $('.js-content .files .file').remove();

    //Sort array acording files position
    galleryObjects.sort(function(a, b) {
        return a.position - b.position;
    });
    if (galleryObjects.length > 0) {
        $('.files .section__files').find('.c-EmptyPlaceholder').remove();
        //Create files from data and add them to the page
        for (var i = 0; i<galleryObjects.length; i++ ) {
            var f = galleryObjects[i],
                file = createFileElement(f);

            if (f.selected) {file.addClass('selected');}
            if (f.justUploaded) {
                file.addClass('justUploaded');
                f.justUploaded = false;
                justUploaded = true;
            }
            addFile(file);
        }

        /*if (justUploaded) {
            var filesElements = $('.js-content .files .file.justUploaded');
        	var files = [];

        	//Obtain files data for files that should be edited
        	filesElements.each(function(i, el) {
        		var file = galleryObjects.filter(function(f) {
                    return f.fileData.id === $(el).find('.file__id').text();
                })[0];
        		files.push(file);
        	});

        	editFiles(files);
        }*/
        if (scrollIndex) {
            var scrollTop = $('.js-content .files .file').last().offset().top;
            $('body').animate({
                scrollTop: scrollTop
            }, 400);
        }
    }
    else {
        var fileSection = $('.files .section__files'),
            placeholder = $('<div></div>').addClass('c-EmptyPlaceholder').click(handleUploadFilesClick);

        fileSection.append(placeholder);
    }
    normalizeSelecteion();
    normalizeAssetsCount();
    normalizeIndex();
}
