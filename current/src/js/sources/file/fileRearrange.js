// Change element indexes to an actual ones
function normalizeIndex() {
    var files = $('.js-files .section__files .file');

    files.each(function(index, el) {
        $(el).find('.file__aragement-input').text(index + 1);
    });
}

function handleIndexFieldChange(e) {
    var length = $('.js-files .section__files .file').length,
        index = parseInt($(e.target).val()) - 1,
        file = $(e.target).parents('.file');

    if (index + 1 >= length) {
        putBottom(file);
    } else {
        file.detach().insertBefore($('.js-files .section__files .file').slice(index, index+1));

    }
    normalizeIndex();
    //updateGallery(index);
}

function putBottom(file) {
    file.detach().insertAfter($('.js-files .section__files .file').last());
    normalizeIndex();
    //updateGallery(galleryObjects.length);
}
function putTop(file) {
    file.detach().insertBefore($('.js-files .section__files .file').first());
    normalizeIndex();
    //updateGallery(0);
}

function handleSendToTopClick(e) {
    var files = $('.js-content .files .file.selected');
    if (files.length > 0) {
        putTop(files);
    }
    putTop($(e.target).parents('.file'));
    closeMenu($(e.target).parents('select__menu'));
}
function handleSendToBottomClick(e) {
    var files = $('.js-content .files .file.selected');
    if (files.length > 0) {
        putBottom(files);
    }
    putBottom($(e.target).parents('.file'));
    closeMenu($(e.target).parents('select__menu'));
}
