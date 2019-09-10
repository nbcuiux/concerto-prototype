var editedFilesData = [],
    editedFileData = {},
    classList = [],
    dataChanged = false, //Changes when user make any changes on edit screen;
    lastSelected = null; //Index of last Selected element for multi select;

$(document).ready(function() {
    var draggableImages;

    updateGallery();
    updateAL();

    $('.ct .section__files').sortable({
    	placeholder: 'img__placeholder',
    	cursor: '-webkit-grabbing',
        start: function(e, ui) {
            var selectedImages = $('.ct .files .file.selected');
            if (selectedImages.length > 0 ) {
                draggableImages = $('.ct .files .file.selected').not(ui.item).clone(true);
                selectedImages = $('.ct .files .file.selected').not(ui.item).clone(true);

                var targetFile_1 = ui.item.clone(true);
                var targetFile_2 = ui.item.clone(true);
                draggableImages = targetFile_1.add(draggableImages); //.add(targetFile_1);
                selectedImages = selectedImages.add(targetFile_2);
                selectedImages.find('.file__arragement, .file__controls, .file__title, .file__caption').remove();

                selectedImages
                    .removeClass('file_view_grid')
                    .css('width', 250)
                    .css('height', 170);

                selectedImages.each(function(i, el) {
                    $(el).css('transform', 'rotate(' + Math.floor(Math.random()*60 - 60)/10 + 'deg) translate(' + Math.floor(Math.random()*200 - 200)/10 + 'px, ' + Math.floor(Math.random()*200 - 200)/10 + 'px)' );
                });

                $('.ct .files .file.selected').not(ui.item).remove();

                draggableImages.addClass('file_dragging');

                ui.item.removeClass('file').addClass('dragFilesWrapper');
                ui.item.empty();
                ui.item.append(selectedImages);

                $('.ct .section__files').sortable( "refresh" );

                //ui.item.addClass('file_helper').prepend(draggableImages.clone());

            } else {
                ui.item.addClass('file_helper');
            }
        },
        stop: function(e, ui) {
            //console.log(ui.helper);
            if (ui.item.hasClass('dragFilesWrapper')) {
                ui.item.after(draggableImages.removeAttr('style'));//.insertAfter(ui.item);
                ui.item.remove();

                $(".selected").removeClass("file_dragging");
            } else {

            }
            $('.files .section__files .file').removeAttr('style');
            ui.item.removeClass('file_helper');
            /*console.log(ui.item);
            ui.item.children().not('.file:last').remove();
            console.log(ui.item);
            ui.item.unwrap();
            console.log(ui.item);
            */
            //draggableImages.insertAfter(ui.item);
            normalizeIndex();
        }
    });



// Grid/list view switchers
    $('#gridView').click(setGridView);
    $('#listView').click(setListView);

    //Edit files handlers
    $('.file .file__controls .button').click(handleFiledEditButtonClick);
    $('#multiEdit').click(handleMultiEditButtonClick);

    //Edit form change actions;
    $('#title').on('input', function(e) {saveTitle();});
    $('#caption').on('input', function(e) {saveCaption();});
    $('#description').on('input', function(e) {saveDescription();});
    $('#resolution').on('change', function(e) {saveResolution();});
    $('#altText').on('input', function(e) {saveAltText();});
    //$('#credit').on('input', function(e) {saveCredit();});
    //$('#copyright').on('input', function(e) {saveCopyright();});
    //$('#source').on('input', function(e) {saveSource();});

    //FocalPoint adjustment
    $('#focalPoint').draggable({
        containment: "#previewImg",
        scroll: false ,
        stop: function(e) {
            adjustFocalPoint();
            adjustPurpose($(e.target));
            dataChanged = true;
        }
    });

    //Select All button
    $('#selectAll').click(function(e) {
    	if ($(e.target).hasClass('empty')) {
    		selectAll();
    	} else {
    		deselectAll();
    	}
    });

    //Save button
    $('#saveChanges').click(function() {
    	var emptyFields = checkFields('.pr label.requiered');
    	if (emptyFields) {
            showNotification('The change in the metadata is saved in the Asset Library.');

    		editedFilesData.forEach(function(fd) {
    			galleryObjects.forEach(function(f) {
                    if (f.fileData.id === fd.fileData.id) {
                        f = fd;
                        f.selected = false;
                    }
                });
    		});
            window.setTimeout(function() {closeEditScreen();}, 2000);
    		updateGallery();
            deselectAll();
            normalizeSelecteion();

    	}
    });

    //Save Draft button Click
    $('#saveDraft').click(function() {
        showNotification('The draft is saved.');
    });

    //tagField
    $('.tagfield').click(focusTagField);

    //Set menu click action
    $('.lm li a').click(handleMenuClick);

    //Cancel Draft redirect to dashboard


    $('.pr input').on('change', function() {dataChanged = true;});

});
