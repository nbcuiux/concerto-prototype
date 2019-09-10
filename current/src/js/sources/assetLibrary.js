function createAssetLibraryFile(fileData) {

    //create basic element
    var file = $('<div></div>').addClass('file file--modal file_type_img file_view_grid'),
        fileIndex = $('<div></div>').addClass('hidden file__id').text(fileData.id),

        fileImg = $('<div></div>').addClass('file__img').css('background-image', 'url(' + fileData.url + ')'),
        fileControls = $('<div></div>').addClass('file__controls').click(toggleFileSelect),
        fileCheckmark = $('<div></div>').addClass('file__checkmark').click(toggleFileSelect),
        fileType = $('<div><i class="fa fa-camera"></i></div>').addClass('file__type'),

        fileTitle = $('<div></div>').addClass('file__title').text(fileData.title);

    fileControls.append(fileCheckmark, fileType);
    fileImg.append(fileControls);

    file.append(fileIndex, fileImg, fileTitle);
    return file;
}

function updateAssetLibrary() {
    var assetLibrary = $('.al .files .section__files');
    assetLibrary.empty();
    assetLibraryObjects.forEach(function(f) {
        assetLibrary.prepend(createAssetLibraryFile(f));
    });
}

function addSelectedFiles() {
    var selectedFiles = $('.al .files .section__files .file.selected');

    if (selectedFiles.length > 0) {
        selectedFiles.each(function(i, el) {
            var fileId = $(el).find('.file__id').text();
                file = assetLibraryObjects.filter(function(f) {
                    return f.id === fileId;
                })[0];
            //if (!fileById(fileId, galleryObjects)) {
                galleryObjects.push({
                    fileData: file,
                    selected: false,
                    position: 1000,
                    caption: '',
                    galleryCaption: false,
                    justUploaded: false
                });
            //}

        });
        updateGallery(galleryObjects.length);
    }
}
