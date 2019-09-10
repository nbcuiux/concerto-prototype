// Create DOM element for File from data
function createFileElement(f) {
    var fileData = f.fileData;
    //create basic element
    var file = $('<div></div>').addClass('file file_type_img file_view_grid'),
        fileIndex = $('<div></div>').addClass('hidden file__id').text(fileData.id),

        fileImg = $('<div></div>')
                    .addClass('file__img')
                    .css('background-image', 'url(' + fileData.url + ')'),
        fileControls = $('<div></div>').addClass('file__controls').click(toggleFileSelect),
        fileCheckmark = $('<div></div>').addClass('file__checkmark').click(toggleFileSelect),
        fileDelete = $('<div></div>').addClass('file__delete').click(handleDeleteClick),
        fileType = $('<div><i class="fa fa-camera"></i></div>').addClass('file__type'),
        fileEdit = $('<button>Edit</button>').addClass('button button button_style_outline-white').click(handleFiledEditButtonClick),

        fileTitle = $('<div></div>').addClass('file__title file__title--media-card').text(fileData.title),

        //fileCaption = $('<textarea></textarea>').addClass('file__caption file__caption_main').val(fileData.caption),

        filePurpose = $('<div></div>').addClass('file__purpose'),
        filePurposeSelect = $('<div></div>');

        fileEditButton = $('<button>Edit</button>').addClass('button button button_style_outline-gray u-visible-xs u-noMargin').click(handleFiledEditButtonClick);

    fileControls.append(fileCheckmark, fileDelete, fileType, fileEdit);
    fileImg.append(fileControls);

    filePurpose.append(filePurposeSelect, fileEditButton);
    purposeSelect = new Selectbox(filePurposeSelect.get(0), {
        label: 'Usage',
        placeholder: 'Select Usage',
        items: ['Primary Key art', 'Secondary Key art', 'Logo','Background', 'Trailer', 'Full Episode', 'Promo'].sort()
    });

    file.append(fileIndex, fileImg, fileTitle, filePurpose, fileEditButton);

    return file;
}

function addFile(file) {
    var fileSection = $('.files .section__files').get(0);

    $(fileSection).append(file);
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
    $('.files .section__files').empty();

    //Sort array acording files position
    galleryObjects.sort(function(a, b) {
        return a.position - b.position;
    });

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

    normalizeSelecteion();
    normalizeIndex();

    /*if (justUploaded) {
        editFiles($('.js-content .files .file.justUploaded'));
    }*/
    if (scrollIndex) {
        var scrollTop = $('.js-content .files .file').last().offset().top;
        $('body').animate({
            scrollTop: scrollTop
        }, 400);
    }
}
