var scrollPosition;

/* global document, $*/
function handleDragEnter(e) {
	e.stopPropagation();
    e.preventDefault();
	e.dataTransfer.dropEffect = "copy";
	//e.dataTransfer.effectAllowed = "copy";
	//$("#dropZone").removeClass('hidden');
	$('#dropZone-1').addClass('modal').removeClass('hidden');
	document.getElementById("dropZone-1").addEventListener('dragleave', handleDragLeave, true);

}
function handleDragLeave(e) {
	e.preventDefault();
	e.stopPropagation();
	$("#dropZone-1").removeClass('modal').addClass('hidden');
	document.getElementById("wrapper").classList.remove('locked');

}
function handleDrop(e) {
	e.stopPropagation();
    e.preventDefault();
	$("#dropZone-1").removeClass('modal').addClass('hidden');
	var files = e.dataTransfer.files;
	if (files.length > 0) {
		handleFiles(files);
		/*for (var i=0; i<files.length; i++) {
			readFile(files[i]).then(createFile);
			/*var file = files[i];
			var reader = new FileReader();
			reader.readAsDataURL(file);*/
		//}
	}
}
function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
}

document.addEventListener('dragenter', handleDragEnter, true);
if (document.getElementById("dropZone-1")) {document.getElementById("dropZone-1").addEventListener('dragleave', handleDragLeave, true);}
document.addEventListener('dragover', handleDragOver, false);
document.addEventListener('drop', handleDrop, false);
$("#savePreview").click(handleSavePreview);
$("#closePreview").click(handleClosePreview);
$("#uploadFiles").click(handleUploadFilesClick);

function handleClosePreview(e) {
	$('.pr').addClass("willClose");
	$('.pr .preview').removeClass('focal line full rect point');
	//$('.focalPoint').removeAttr('style');
	$('.focalRect').removeAttr('style');
	$('#focalPointToggle').removeClass('active');
	$('#focalRectToggle').removeClass('active');
	$('.purposes-container .purpose .purpose-img').removeAttr('style');
	$('.ct .file').find('button').css('display', '');
	e.target.classList.remove('modal', 'willClose');
	e.target.classList.add('hidden');
	$('#wrapper').removeClass('overflow');
	//deselectAll();
}
function handleSavePreview(e) {

}
function closeEditScreen() {
	$('.pr').addClass("willClose");
	$('.pr .preview').removeClass('focal line full rect point');
	//$('.focalPoint').removeAttr('style');
	$('.focalRect').removeAttr('style');
	$('#focalPointToggle').removeClass('active');
	$('#focalRectToggle').removeClass('active');
	$('.purposes-container .purpose .purpose-img').removeAttr('style');
	$('.ct .file').find('button').css('display', '');
	//deselectAll();
	e.target.classList.remove('modal', 'willClose');
	e.target.classList.add('hidden');
	$('#wrapper').removeClass('overflow');
}
function closeModal() {
	$('.modal').addClass('hidden').removeClass('modal');
	$('#wrapper').removeClass('overflow');
}

function handleUploadFilesClick(e) {
	var filesInput = document.getElementById("filesInput");
    if (!filesInput) {
    	filesInput = document.createElement("input");
        filesInput.type = "file";
        filesInput.multiple = "true";
        filesInput.hidden = true;
        filesInput.accept = "image/*, audio/*, video/*";
        filesInput.id = "filesInput";
        filesInput.addEventListener("change", function(e) {
				console.log(e.target.files);
               handleFiles(e.target.files);
            });
        document.body.appendChild(filesInput);
    }
    filesInput.click();
}

$('#searchField').focus(function(e) {e.target.parentNode.classList.add('active');});
$('#searchField').blur(function(e) {
	if ($('#filterMenu').hasClass('hidden')) {
		e.target.parentNode.classList.remove('active');
	}
});

/*$('.fm-toogle').click(function(e) {
	e.stopPropagation();
	var section = e.target.parentNode.parentNode;
	var filterName = section.id;
	var
	var query = $('searchField').val();

})*/
$('.lm li').click(function(e) {
	$('.lm li').removeClass('open');
	$('.lm li ul').removeClass('open');

	$(e.target).addClass('open');
	$(e.target).children('ul').addClass('open');

	/*if (subItems.length > 0) {
		$('.lm li').removeClass('open');

		for (var i=0; i<subItems.length; i++) {
			var subItem = subItems[i];
			subItem.classList.toggle('open');
			$(e.target).toggleClass('open');
		}
	}*/
});
$('#menuToggle').click(function(e) {
	$('.lm').toggleClass('open');
	$('.ct').toggleClass('locked');
});
$('.lm > .close, .lm > .logo').click(function(e) {
	$('.lm').toggleClass('open');
	$('.ct').toggleClass('locked');
});

$('.al, .ct').click(function(e) {
	if ($('.lm').hasClass('open')) {
		$('.lm').toggleClass('open');
		$('#wrapper').removeClass('locked');
	}
});

/*$('.al .file').each(function(i, el) {
	var duration = Math.floor(Math.random()*50)/10,
		delay = Math.floor(Math.random()*15)/10;

	console.log(duration, delay);
	console.log(el.classList);
	el.style.anumationDuration = duration.toString + "s";
	el.style.animationDelay = delay.toString + "s";
});*/

$('.progressBar .loaded').animate({width: "100%"},
	2300,
	'linear',
	function() {this.parentNode.classList.add('hidden');}
);


/* Select control */
function openSelect(e) {
	$(e.target).toggleClass('open');
}
function setSelect(e) {
	var select = $(e.target).parent().parent(),
		item = $(e.target),
		spanString = select.children('span').text();

	if (select.hasClass('multiple')) {
		if (item.hasClass('active')) {
			item.removeClass('active');
			var searchString = itemText + ", ";
			var index = spanString.slice(spanString.search(searchString));
			var newSpan = spanString();
		}
		$(e.target).toggleClass('active');
		var string;
		select.children('span').text();

	} else {
		select = e.target.parentNode.parentNode;
		var span = select.getElementsByTagName('span')[0];
		span.innerHTML = e.target.innerHTML;
		select.classList.add('selected');
		select.classList.remove('open');
		var items = select.getElementsByTagName('li');
		for (var i=0; i<items.length; i++) {
			items[i].classList.remove('active');
		}
		e.target.classList.add('active');
	}
	//console.log(select.parent());
	if ($(select).parent().hasClass('file-purpose')) {
		if ($('.ct .file.selected').length > 0) {
			$('.ct .file.selected .select').addClass('selected');
			$('.ct .file.selected .select span').text(e.target.innerHTML);
			deselectAll();
		}
	}
	dataChanged = true;
}
$('.select').click(openSelect);
$('.select li').click(setSelect);
$('*').not('.select li, .select').click(function(e) {
	if ($('.select').hasClass('open')) {
		$('.select').removeClass('open');
	}
});

/* Multiselect control */
$('.multiSelect').not('.tag').click(function(e) {
	e.target.classList.add('open');
});
$('.multiSelect li').click(function(e) {
	var select = $(e.target).parent().parent(),
		item = $(e.target),
		tag = $('<div></div>').addClass('tag').text(item.text()),
		tagDelete = $('<div></div>').addClass('tag__delete').text('✕').on('click', function(e) {
			$(e.target).parents('.tag').remove();
		});

	tag.append(tagDelete);
	select.append(tag);
	select.children('span').text('');
	dataChanged = true;
});
$('.multiSelect > .tag').click(function(e) {
	e.target.parentNode.removeChild(e.target);
});

$('*').not('.multiSelect li, .multiSelect').click(function(e) {
	if ($('.multiSelect').hasClass('open')) {
		$('.multiSelect').removeClass('open');
	}
});

/*Bulk Remove */
$('#bulkRemove').click(function() {
	$('#deleteFiles').toggleClass('modal hidden');
	$('.ct .file.selected').addClass('sbr');
});

/*Close Delete Prompt */
$('#cancelPrompt').click(function () {
	$('#deleteFiles').toggleClass('modal hidden');
	deselectAll();
});

/* Delete ConfirmationPrompt */
$('#deleteConf').click(function () {
	$('#deleteFiles').toggleClass('modal hidden');

	var filesToBeDeleted = $('.ct .files .file.sbr');
	filesToBeDeleted.each(function(i, el) {
		var fileIndex;
	});

	$('.ct .file.sbr').detach();
	deselectAll();

	if ($('#al')) {
		$('.file .section').each(function(i, el) {
			if ($(el).children('.file').length === 0) {
				$(el).detach();
			}
		});
		if ($('.file .section').length === 1) {
			$('.file .section .section-title').addClass('hidden');
		}
	}
	normalizeIndex();
});

/* Bulk Set Use */
$('#bulkSetUse').click(function(e) {
	$(e.target).toggleClass('open');

});
$('#bulkSetUse li').click(function(e) {
	$('#bulkSetUse').removeClass('open');
	$('.ct .file.selected .select').addClass('selected');
	$('.ct .file.selected .select span').text(e.target.innerHTML);
	deselectAll();

});
$('*').not('.bulkSelect, .bulkSelect li').click(function(e) {
	if ($('.bulkSelect').hasClass('open')) {
		$('.bulkSelect').removeClass('open');
	}
});

/*Focal Point Edit*/
$('#focalPointToggle').click(function(e) {
	if ($(e.target).hasClass('active')) {
		$('.pr > .preview').removeClass('focal line point');
		$(e.target).removeClass('active');
		e.target.removeAttribute("style");
	} else {
		$('.pr > .preview').addClass('focal line point');
		$('.pr > .preview').removeClass('rect');
		$('#focalRectToggle').removeClass('active');
		$(e.target).addClass('active');

		setPurposePagination();
	}
});
function dragStop(e, ui) {
	var img = $('#previewImg'),
		iWidth = img.width(),
		iHeight = img.height(),
		iOffset = img.offset(),

		pWidth = $(e.target).width(),
		pHeight = $(e.target).height(),
		pOffset = $(e.target).offset(),

		fTop = Math.round((pOffset.top - iOffset.top + pHeight/2)*100 / iHeight);
		fLeft = Math.round((pOffset.left - iOffset.left + pWidth/2) * 100 / iWidth);

	//console.log(fTop, fLeft);
	$('.purposes-container .purpose .purpose-img').css('background-position', fLeft.toString() + '% ' + fTop.toString() + '%');
	dataChanged = true;
}

/*Previews scroll */
$('#scrollLeft').click(function(e) {
	$('#purposeWrapper').animate( { scrollLeft: '-=460' }, 800);
});
$('#scrollRight').click(function(e) {
	$('#purposeWrapper').animate( { scrollLeft: '+=460' }, 800);
});


/* Handle Purposes scroll */
$('#purposeWrapper').scroll(function() {
	setPurposePagination();
});
/* Init Purpose Paginator */

function setPurposePagination() {
	var scrollOffset = $('#purposeWrapper').scrollLeft();
	var width = document.getElementById('purposeWrapper').getBoundingClientRect().width;
	var firstIndex = Math.floor(scrollOffset/140) + 1;
	var lastIndex = firstIndex + Math.round(width/140) - 1;
	var count = $('#purposeWrapper .purpose').length;

	lastIndex = lastIndex < count ? lastIndex : count;

	$('#p-paginator').text(firstIndex + ' — ' + lastIndex + ' of ' + count);
}

/* Searchfield filter */
$('.filterIcon').click(function(e) {
	e.stopPropagation();
	var searchField = $(e.target).parent();
	searchField.addClass('active');
	searchField.children('.filter').toggleClass('open');
});
$('*').not('.searchField, searchField > input, .filter, .filter > .section, .filter > .section-title, .filter > .section-options, .filter .toggle, .filter label, .filterIcon').click(function(e) {

	e.stopPropagation();
	if (!e.target.classList.contains('toggle') && !e.target.classList.contains('toggle-label') && e.target.id !== 'searchField') {
		$('.searchField').removeClass('active');
		$('.filter').removeClass('open');
	}
});

/* Close Modal Window */
$('.modal').click(function(e) {
	//e.target.classList.add('willClose');
	e.target.classList.remove('modal', 'willClose');
	e.target.classList.add('hidden');
	$('#wrapper').removeClass('overflow');
});
$('.modal > .close').click(function(e) {
	//e.target.parentNode.classList.add('willClose');
	e.target.classList.remove('modal', 'willClose');
	e.target.classList.add('hidden');
	$('#wrapper').removeClass('overflow');
});

document.addEventListener('animationend', function (e) {
	if (e.animationName == "modal-fade-out" && e.target.classList.contains('modal')) {
		e.target.classList.remove('modal', 'willClose');
		e.target.classList.add('hidden');
		$('#wrapper').removeClass('overflow');
	}
});

/*Addable field */
$('.addableField > .add').click(addFiled);
$('.addableField > .remove').click(removeField);
function addFiled(e) {
	var addableField = e.target.parentNode;
	addableField.classList.add('multiple');
	var newField = addableField.cloneNode(true);
	newField.getElementsByTagName('input')[0].value = '';
	addableField.parentNode.appendChild(newField);
	$(newField).children('.add').click(addFiled);
	$(newField).children('.remove').click(removeField);
}
function removeField(e) {
	var section = e.target.parentNode.parentNode;
	section.removeChild(e.target.parentNode);
	var sectionFields = section.getElementsByClassName('addableField');
	if (sectionFields.length <= 1) {
		sectionFields[0].classList.remove('multiple');
	}
}

$('.tabs .nav li').click(function(e) {
	var tabId = $(e.target).attr('data-tab');
	$('.tabs .nav li').removeClass('active');
	$(e.target).addClass('active');
	$(e.target).parent().removeClass('open');
	$('.tabs .nav > .mobileNav').text($(e.target).text().replace(/\d/g, ''));
	$('.tab').removeClass('active');
	$(tabId).addClass('active');
});
$('.tabs .nav > .mobileNav').click(function(e) {
	$(e.target).parent().children('ul').toggleClass('open');
});

/* Radio Toggle */
$('.radioToggle li').click(function(e) {
	$(e.target).parent().children('.active').removeClass('active');
	$(e.target).addClass('active');
	if (e.target.innerHTML === "Web Series") {
		$('#reg-sc-duration, #prog-timeframe').addClass('hidden');
	} else if (e.target.innerHTML === "TV Series") {
		$('#reg-sc-duration, #prog-timeframe').removeClass('hidden');
	}
});

/*Auto resize text area */
//autosize($('textarea'));
//autosize.update($('textarea'));

/* Dashboard */
$('.shortcuts').sortable({
	placeholder: 'placeholder'
});
$('.shortcuts').disableSelection();

$('#dash').sortable({

});
$('#dash').disableSelection();

$('.set').click(function(e) {
	$(e.target).toggleClass('open');
});

$('.pannel .shortcut').draggable({
	connectToSortable: '.shortcuts',
	stop: function( e, ui ) {e.target.removeAttribute("style");}
});
/*$( ".shortcut" ).on( "sortstop", function( event, ui ) {
	e.target.removeAttr('style');
});*/

$('*').not('.pannel, .pannel > .shortcut, .set').click(function() {
	//if (!$(e.target).hasClass('set')) {
		$('.set').removeClass('open');
	//}

});

/* Prompts */
$('#removeDraft').click(function() {
	$('#removeDraftPrompt').toggleClass('modal hidden');
});
$('#removeDraftPrompt .button').click(function() {
	$('#removeDraftPrompt').toggleClass('modal hidden');
});

$('#publishDraft').click(function() {
	$('#publishDraftPrompt').toggleClass('modal hidden');
});
$('#publishDraftPrompt .button').click(function() {
	$('#publishDraftPrompt').toggleClass('modal hidden');
});



$('#cancelChangesPrompt .button.cancel').click(function() {
	$('#cancelChangesPrompt').toggleClass('modal hidden');
});
$('#cancelChangesPrompt .button.ok').click(function() {
	$('#cancelChangesPrompt').toggleClass('modal hidden');
	closeEditScreen();
});


/*Evengt type */
$('#event-type li').click(function(e) {
	if (e.target.innerHTML === "Movie") {
		$('#release-year, #channel-original, #air-times').removeClass('hidden');
	} else {
		$('#release-year, #channel-original, #air-times').addClass('hidden');
	}
});

/* Datapicker */
$('.datapicker').datepicker();
$('.ct .section-files').sortable({
	placeholder: 'file__placeholder',
	cursor: '-webkit-grabbing',
	helper: 'clone',
	opacity: 0.5
});

function createALElement(fileData) {

    //create basic element
    var file = $('<div></div>').addClass('file file_view_modal file_type_img'),
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

function addAlElement(file) {
    var fileSection = $('.al .files .section-files');
    fileSection.prepend(file);
}
function updateAL() {
    $('.al .files .section-files').empty();
    assetLibraryObjects.forEach(function(f, i) {
        addAlElement(createALElement(f, i));
    });
}

function addSelectedFiles() {
    var selectedFiles = $('.al .files .section-files .file.selected');

    if (selectedFiles.length > 0) {
        selectedFiles.each(function(i, el) {
            var fileId = $(el).find('.file__id').text();
                file = assetLibraryObjects.filter(function(f) {
                    return f.id === fileId;
                })[0];
            if (!fileById(galleryObjects, fileId)) {
                galleryObjects.push({
                    fileData: file,
                    selected: false,
                    position: 1000,
                    caption: '',
                    galleryCaption: false,
                    justUploaded: false
                });
            }

        });
        updateGallery(galleryObjects.length);
    }
}

function closeAssetLibrary() {
    lastSelected = null;
    $('.al .files .section-files .file.selected').removeClass('selected');
    deselectAll();
    $('.modal').addClass('hidden').removeClass('modal');
    $('#wrapper').removeClass('overflow');
}

// Create DOM element for File from data
function createFileElement(f) {
    var fileData = f.fileData;
    //create basic element
    var file = $('<div></div>').addClass('file file_type_img'),
        fileIndex = $('<div></div>').addClass('hidden file__id').text(fileData.id),

        fileArragement = $('<div></div>').addClass('file__arragement'),
        fileArragementInput = $('<input type="text" />').addClass('file__aragement-input').on('change', handleIndexFieldChange),
        fileArragementSettings = $('<div><i class="fa fa-ellipsis-v"></i></div>')
                                    .addClass('file__aragement-settings')
                                    .click(showRearrangeMenu),

        fileImg = $('<div></div>')
                    .addClass('file__img')
                    .css('background-image', 'url(' + fileData.url + ')'),
        fileControls = $('<div></div>').addClass('file__controls').click(toggleFileSelect),
        fileCheckmark = $('<div></div>').addClass('file__checkmark').click(toggleFileSelect),
        fileDelete = $('<div></div>').addClass('file__delete').click(deleteFile),
        fileType = $('<div><i class="fa fa-camera"></i></div>').addClass('file__type'),
        fileEdit = $('<button>Edit</button>').addClass('button whiteOutline').click(handleFiledEditButtonClick),

        fileTitle = $('<div></div>').addClass('file__title').text(fileData.title),

        fileCaption = $('<div></div>').addClass('file__caption'),
        fileCaptionTitle = $('<div></div>').addClass('file__caption-title').text('Gallery caption'),
        fileCaptionTextarea = $('<textarea></textarea>')
                                .addClass('file__caption-textarea')
                                .val(f.caption ? f.caption : fileData.caption)
                                .on('blur input', handleCaptionEdit)
                                .on('focus', handleCaptionStartEditing),

        fileCaptionToggle = $('<div></div>').addClass('file__caption-toggle'),
        fileCaptionToggle_Toggle = $('<input type="checkbox" />').addClass('toggle switch').click(handleCaptionToggleClick).prop('checked', function() {return f.caption? false : true;}),
        fileCaptionToggle_Label = $('<label>Keep metadata caption</label>'),

        fileEditButton = $('<button>Edit</button>').addClass('button grayOutline').click(handleFiledEditButtonClick);

    if (!fileData.caption) {
        fileCaptionToggle.addClass('disabled');
        fileCaptionToggle_Toggle.prop('checked', false).prop('disabled', true);

        if (fileCaptionTextarea.val()) {
            fileCaptionTextarea.attr('placeholder', 'Don\'t have metadata caption');
        }
    }

    fileArragement.append(fileArragementInput, fileArragementSettings);

    fileControls.append(fileCheckmark, fileDelete, fileType, fileEdit);
    fileImg.append(fileControls);

    fileCaptionToggle.append(fileCaptionToggle_Toggle, fileCaptionToggle_Label);
    fileCaption.append(fileCaptionTitle, fileCaptionTextarea, fileCaptionToggle, fileEditButton);

    file.append(fileIndex, fileArragement, fileImg, fileTitle, fileCaption);

    /*if (option) {
        var fileCaptions = $('<div></div>').addClass('file__captions'),
            originalCaption = $('<div></div>').addClass('file__caption file__caption_original'),
            originalCaption_Title = $('<div></div>').addClass('file__caption-title').text('Original caption'),
            originalCaption_Caption = $('<div></div>').addClass('file__caption-text').text(fileData.caption),

            galleryCaption_Title = $('<div></div>').addClass('file__caption-title').text('Caption for Gallery');

        fileCaptionToggle_Toggle.prop('checked', false);
        originalCaption.append(originalCaption_Title, originalCaption_Caption);
        fileCaption.empty().append(fileCaptionToggle, galleryCaption_Title, fileCaptionTextarea);
        fileCaptions.append(originalCaption, fileCaption);

        file.append(fileCaptions);
    } else {
        file.append(fileCaption);
    }*/
    //file.append(fileEditButton);

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
    /*if (index) {
        file.detach().insertBefore(fileSection.find('.file').eq(index));
    }*/

    normalizeIndex();
}


function setGridView(e) {
    $(e.target).parent().children().removeClass('active');
    $(e.target).addClass('active');

    $('.files .section__files')
        .addClass('section__files_view_grid')
        .removeClass('section__files_view_list');

    $('.files .section__files .file')
        .addClass('file_view_grid')
        .removeClass('file_view_list');
}
function setListView(e) {
    $(e.target).parent().children().removeClass('active');
    $(e.target).addClass('active');

    console.log($('.files .section__files'));
    $('.files .section__files')
        .addClass('section__files_view_list')
        .removeClass('section__files_view_grid');

    $('.files .section__files .file')
        .addClass('file_view_list')
        .removeClass('file_view_grid');
}
function normalizeAssetsCount() {
    $('#assets-count').text(galleryObjects.length ? galleryObjects.length + ' Assets total' : '');
}

function updateGallery() {
    var justUploaded = false, scrollIndex = 0;

    // Remember position and selection of files
    $('.ct .files .file').each(function(index, el) {
        var file = galleryObjects.filter(function(f) {
            return f.fileData.id === $(el).find('.file__id').text();
        })[0];
        file.position = index;
        file.selected = $(el).hasClass('selected');
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
            file.addClass('selected');
            f.justUploaded = false;
            justUploaded = true;
        }
        addFile(file);
    }

    normalizeSelecteion();
    normalizeAssetsCount();
    normalizeIndex();

    if (justUploaded) {editFiles($('.ct .files .file.selected'));}
    if (scrollIndex) {
        var scrollTop = $('.ct .files .file').last().offset().top;
        console.log(scrollTop);
        $('.ct').animate({
            scrollTop: scrollTop
        }, 400);
    }
}

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

// Asset Library buttons
    $('#addFromALButton').click(function(){
        lastSelected = null;
        addSelectedFiles();
        closeAssetLibrary();
    });
    $('#alCloseButton').click(function(e) {
        closeAssetLibrary();
    });
    $('#assetLibrary').click(function(e) {
    	$('#al').removeClass('hidden');
    	$('#al').addClass('modal');
    	$('#wrapper').addClass('overflow');
    });
    $('#al').click(function(e) {
        $('#al .files .file.selected').removeClass('selected');
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
    //Cancel edit button
    $('#cancelChanges').click(function() {
        console.log(dataChanged);
    	if (dataChanged) {
            $('#cancelChangesPrompt').toggleClass('dialog hidden');
        } else {
            closeEditScreen();
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
    $('#cancelDraft').click(function() {window.location.href="dashboard.html";});

    $('.pr input').on('change', function() {dataChanged = true;});

});

/*Quick Edit File Title and Info */
function editFileTitle(e) {
	if (!$('.al').hasClass('modal')) {
		var fileInfo = e.target;
		var fileInfoText = fileInfo.innerHTML;
		var input = document.createElement('input');
		input.type = 'text';
		input.value = fileInfoText;

		input.addEventListener('blur', function(e) {
			var input = e.target;
			fileInfo = input.parentNode;
			fileInfo.removeChild(input);
			fileInfo.classList.remove('edit');
			fileInfo.innerHTML = input.value;
		});
		input.addEventListener('keypress', function(e) {
			if (e.keyCode == 13 || e.which == 13) {
				var input = e.target;
			fileInfo = input.parentNode;
			fileInfo.removeChild(input);
			fileInfo.classList.remove('edit');
			fileInfo.innerHTML = input.value;
			}
		});

		fileInfo.innerHTML = '';
		fileInfo.appendChild(input);
		fileInfo.classList.add('edit');
		input.focus();
	}
}
function editFileCaption(e) {
	if (!$('.al').hasClass('modal')) {
		var fileInfo = e.target;
		var fileInfoText = fileInfo.innerHTML;
		var input = document.createElement('textarea');
		//input.type = 'text'
		input.value = fileInfoText;

		input.addEventListener('blur', function(e) {
			var input = e.target;
			fileInfo = input.parentNode;
			fileInfo.removeChild(input);
			fileInfo.classList.remove('edit');
			fileInfo.innerHTML = input.value;
		});
		input.addEventListener('keypress', function(e) {
			if (e.keyCode == 13 || e.which == 13) {
				var input = e.target;
			fileInfo = input.parentNode;
			fileInfo.removeChild(input);
			fileInfo.classList.remove('edit');
			fileInfo.innerHTML = input.value;
			}

		});

		fileInfo.innerHTML = '';
		fileInfo.appendChild(input);
		fileInfo.classList.add('edit');
		input.focus();
	}
}

/* File Delete */
function deleteFile(e) {
    $(e.target).parents('.file').addClass('sbr');
    $('.ct .file.selected').addClass('sbr');
    $('#deleteFiles').toggleClass('modal hidden');
}


$('.file-title').click(editFileTitle);
$('.file-caption').click(editFileCaption);

$('.file .close, .file__delete').click(deleteFile);

$('.file-controls, .file__controls').click(toggleFileSelect);
$('.file-controls .checkmark, .file__checkmark').click(toggleFileSelect);

$('.al .file-img, .al .file-title').click(function (e) {
	if ($('.al').hasClass('modal')) {
		e.target.parentNode.classList.toggle('selected');
	}
});

function loadFile(file) {
	var fileData = file.fileData;
	//set image and focal point
	$('.pr .img > .img-wrapper > img').attr('src', fileData.url);
	$('.pr .purpose-img').css("background-image", 'url(' + fileData.url + ')');
	adjustFocalPoint(fileData.focalPoint);
	adjustFocalRect(fileData.focalPoint);

	//set Title
	adjustTitle(fileData.title);
	adjustCaption(fileData.caption);
	adjustDescription(fileData.description);
	adjustResolution(fileData.highResolution);
	adjustAltText(fileData.altText);
}

//Function to set Title to the title field or, save title if title argument empty
function adjustTitle(title) {
	$('#title').val(title);
}
//Function to set Title to the title field or, save title if title argument empty
function saveTitle() {
	editedFileData.fileData.title = $('#title').val();
	dataChanged = true;
}
//Function to set Caption to the caption field or, save caption if caption argument empty
function adjustCaption(caption) {
	$('#caption').val(caption);
}
//Function to set Description to the caption field or, save caption if caption argument empty
function saveCaption() {
	editedFileData.fileData.caption = $('#caption').val();
	dataChanged = true;
}
function adjustDescription(description) {
	$('#description').val(description);
}
//Function to set Description to the caption field or, save caption if caption argument empty
function saveDescription() {
	editedFileData.fileData.description = $('#description').val();
	dataChanged = true;
}
function adjustResolution(resolution) {
	$('#resolution').prop('checked', resolution);
}
//Function to set Description to the caption field or, save caption if caption argument empty
function saveResolution() {
	editedFileData.fileData.highResolution = $('#resolution').prop('checked');
	dataChanged = true;
}
function adjustAltText(altText) {
	$('#altText').val(altText);
}
//Function to set Description to the caption field or, save caption if caption argument empty
function saveAltText() {
	editedFileData.fileData.altText = $('#altText').val();
	dataChanged = true;
}
function adjustAltText(altText) {
	$('#altText').val(altText);
}
//Function to set Description to the caption field or, save caption if caption argument empty
function saveAltText() {
	editedFileData.fileData.altText = $('#altText').val();
	dataChanged = true;
}
//Function to set FocalPoint coordinates or, save focal pint if focalpoint argument empty
function adjustFocalPoint(focalPoint) {
	var fp = $('#focalPoint');
	var img = $('#previewImg');
	if (focalPoint) {
		var left = focalPoint.left * img.width() - fp.width()/2,
			top = focalPoint.top * img.height() - fp.height()/2;

		left = left === 0 ? '50%' : left;
		top = top === 0 ? '50%' : top;
		fp.css('left', left).css('top', top);

	} else {
		editedFileData.fileData.focalPoint = {
			left: ((fp.position().left + fp.width()/2)/img.width()),
			top: ((fp.position().top + fp.height()/2)/img.height())
		};
	}
	fp.css('position', 'absolute');
}

//Function to set FocalRect coordinates or, save focal pint if focalpoint argument empty
function adjustFocalRect(focalPoint) {
	var fr = $('#focalRect');
	var img = $('previewImg');
	if (focalPoint) {
		var left = focalPoint.left * img.width() - fr.width()/2,
			top = focalPoint.top * img.height() - fr.height()/2;

		left = left < 0 ? 0 : left > img.width() ? img.width() - fr.width()/2 : left;
		top = top < 0 ? 0 : top > img.height() ? img.height() - fr.height()/2 : top;

		fr.css('left', left)
			.css('top', top);
	} else {
		editedFileData.fileData.focalPoint = {
			left: ((fp.position().left + fp.width()/2)/img.width()),
			top: ((fp.position().top + fp.height()/2)/img.height())
		};
	}
}


function showFiles(files) {
	dataChanged = false;
	//Show initial edit screen for single image.
	$('.pr').removeClass('hidden video bulk')
			.addClass('modal');
	$('#wrapper').addClass('overflow');

	//Remove all multiple images style attributes
	$('.pr .preview').removeClass('preview_style_multi hidden');
	$('.pr .ip').removeClass('ip_style_multi');
	$('#saveChanges').text('Save');
	//$('#ip__title').addClass('hidden');
	$('.pr .images').addClass('hidden');

	if (files.length > 1) {
		var imgContainer = $('.pr .images__container');
		imgContainer.empty();

		//Add images previes to the container
		files.forEach(function(f) {
			//console.log(f, i)
			var	image = $('<div></div>').addClass('image image_style_multi').click(switchImage),
				fileIndex = $('<div></div>').addClass('hidden file__id').text(f.fileData.id);
			image.css('background-image', 'url(' + f.fileData.url + ')').append(fileIndex);
			//}
			imgContainer.append(image);
		});

		//Add active state to the preview of the first image
		var firstImage = $('.images__container .image').first();
		firstImage.addClass('image_active');

		$('.pr .images').addClass('images_style_multi').removeClass('hidden');

		$('.pr .preview').removeClass('hidden').addClass('preview_style_multi');
		$('.pr .ip').addClass('ip_style_multi');

		//Adjust image previews container
		$('#images__wrapper').scrollLeft(0);
		var imagesWrapperWidth = $('.images__wrapper').width();
			imagesWidth = $('.images__container .image').length * 120;
			console.log(imagesWrapperWidth, imagesWidth);
		if (imagesWrapperWidth > imagesWidth) {
			$('.images__scroll-left, .images__scroll-right').css('visibility', 'hidden');
		} else {
			$('.images__container').css('width', imagesWidth.toString() + 'px');
			$('.images__scroll-left, .images__scroll-right').css('visibility', 'visible');
		}
		//Add actions to scroll buttons
		$('.images__scroll-left').click(function(e) {
			$('#images__wrapper').animate( { scrollLeft: '-=460' }, 800);
		});
		$('.images__scroll-right').click(function(e) {
			$('#images__wrapper').animate( { scrollLeft: '+=460' }, 800);
		});
	}
	hideLoader();

}

function editFiles(files) {
	editedFilesData = []; //Clear files data that possibly could be here

	//Obtain files data for files that should be edited
	files.each(function(i, el) {
		var file = galleryObjects.filter(function(f) {
            return f.fileData.id === $(el).find('.file__id').text();
        })[0];
		editedFilesData.push(file);
	});

	if (editedFilesData.length > 0) {
		editedFileData = editedFilesData[0];
		loadFile(editedFileData);
		showFiles(editedFilesData);
	}
}

function fileById(files, id) {
	filesFiltered = files.filter(function(f) {
		return f.fileData.id === id;
	});
	return filesFiltered[0];
}
function saveFile(files, file) {
	files.forEach(function(f) {
		if (f.fileData.id === file.fileData.id) {
			f = file;
		}
	});
}

function switchImage(e) {
	var newFileId = $(e.target).find('.file__id').text(),
		newFile = fileById(editedFilesData, newFileId);

	saveFile(editedFilesData, editedFileData);

	editedFileData = newFile;
	loadFile(editedFileData);

	$('.image').removeClass('image_active');
	$(e.target).addClass('image_active');

	adjustRect($('.purposes-container .purpose-img').first());
	$('#purposeWrapper').animate( { scrollLeft: '0' }, 800);
}


//Function for handle Edit Button clicks
function handleFiledEditButtonClick(e) {
	e.stopPropagation();
	var file = $(e.target).parents('.file');
	editFiles(file);
}
function handleMultiEditButtonClick(e) {
	var files = $('.ct .files .file.selected');
	editFiles(files);
}


/*$('#saveChangesPrompt .button').click(function() {
	$('#saveChangesPrompt').toggleClass('modal hidden');
	closeEditScreen();
});*/


function handleFiles(files) {
	showLoader();
	var filesOutput = [];
	if (files && files.length >0) {
		for (var i=0; i< files.length; i++) {
			filesOutput.push(files[i]);
		}
		var uploadedFiles = filesOutput.map(function(f) {
			return fileToObject(f).then(function(res) {
				galleryObjects.push({
					fileData: res,
					selected: false,
					position: 1000,
					caption: '',
					galleryCaption: false,
					justUploaded: true
				});
			});
		});
		Promise.all(uploadedFiles).then(function(res) {updateGallery(galleryObjects.length);});
	}
}

//COnvert uploaded files to elements
function fileToMarkup(file) {
	return readFile(file).then(function(result) {
		var fileNode = $('<div></div>').addClass('file'),

			fileImg = $('<div></div>').addClass('file-img').css('background-image', 'url(' + result.src + ')'),

			fileControls = $('<div></div>').addClass('file-controls').click(toggleFileSelect),
			checkmark = $('<div></div>').addClass('checkmark').click(toggleFileSelect),
			close = $('<div></div>').addClass('close').click(deleteFile),
			edit = $('<button>Edit</button>').addClass('button whiteOutline').click(editFile),

			fileTitle = $('<div></div>').addClass('file__title'),
			fileTypeIcon = $('<i class="fa fa-camera"></i>').css('margin-right', '2px'),
			fileTitleInput = $('<input type="text" />').val(result.name),

			/*<div class="file__title">
				<i class="fa fa-camera"></i>
				<input type="text" value="Blindspot S03 Promo" />
			</div>*/
			fileCaption = $('<div></div>').addClass('file-caption').text(result.name).click(editFileCaption),
			fileInfo = $('<div></div>').addClass('file-info').text(result.info),

			filePurpose = $('<div></div>').addClass('file-purpose'),
			filePurposeSelect = $('<div></div>').addClass('select').click(openSelect),
			selectSpan = $('<span>Select use</span>'),
			selectUl = $('<ul></ul>'),
			selectLi1 = $('<li>Cover</li>').click(setSelect),
			selectLi2 = $('<li>Primary</li>').click(setSelect),
			selectLi3 = $('<li>Secondary</li>').click(setSelect);

		fileTitle.append(fileTypeIcon, fileTitleInput);
		selectUl.append(selectLi1, selectLi2, selectLi3);
		filePurposeSelect.append(selectSpan, selectUl);

		filePurpose.append(filePurposeSelect);
		fileControls.append(checkmark, close, edit);
		fileImg.append(fileControls);

		fileNode.append(fileImg, fileTitle, fileCaption, fileInfo, filePurpose);

		return fileNode;
	});
}

//Convert uploaded file to object
function fileToObject(file) {
	return readFile(file).then(function(result) {
		return {
	        url: result.src,
	        focalPoint: {
	            left: 0.5,
	            top: 0.5
	        },
			id: result.name + ' ' + new Date(),
	        color: fileImgColors[Math.floor(Math.random()*fileImgColors.length)],
	        title: result.name,
	        caption: '',
	        description: '',
	        highResolution: false,
	        categories: '',
	        tags: '',
	        altText: '',
	        credit: '',
	        copyright: '',
	        reference: {
	            series: '',
	            season: '',
	            episode: ''
	        }
	    };
	});
}
function readFile(file) {
	return new Promise(
		function(res, rej) {
			var reader = new FileReader();
			reader.onload = function(e) {
				res({src: e.target.result,
					name: file.name,
					info: file.type + ', ' + Math.round(file.size/1024).toString() + ' Kb'});
			};
			reader.onerror = function() {
				rej(this);
			};
			reader.readAsDataURL(file);
		}
	);
}

function showLoader() {
	var modal = $('<div></div>').addClass('modal').attr('id', 'loaderModal'),
		loader = $('<div></div>').addClass('loader');

	modal.append(loader);
	$('body').append(modal);
}
function hideLoader() {
	$('#loaderModal').remove();
}

function adjustRect(el) {
	var imgWidth = $('#previewImg').width(),
		imgHeight = $('#previewImg').height(),
		imgOffset = $('#previewImg').offset(),
		imgRatio = imgWidth/imgHeight,

		elH = el.outerHeight(),
		elW = el.outerWidth(),
		elO = el.offset(),
		elRatio = elW/elH,
		elBackgroundPosition = el.css('background-position').split(' ');

	console.log(elH, elW, elBackgroundPosition);

	rHeight = imgRatio > elRatio ? imgHeight : imgWidth/elRatio;
	rWidth = imgRatio > elRatio ? imgHeight * elRatio : imgWidth;
	rOffset = {left: 0, top: 0};

	if (elBackgroundPosition.length === 2) {
		if (elBackgroundPosition[0].indexOf('%')) {
			var bgLeftPersent = elBackgroundPosition[0].slice(0,-1),
				bgLeftPixel = Math.round(imgWidth * bgLeftPersent/100) - rWidth/2;

			console.log(elBackgroundPosition[0], bgLeftPersent, bgLeftPixel, imgWidth, (bgLeftPixel + rWidth));

			if ((bgLeftPixel) < 0) {bgLeftPixel = 0;}
			if ((bgLeftPixel + rWidth) > imgWidth) {bgLeftPixel = imgWidth - rWidth;}

			console.log(bgLeftPixel, imgWidth, (bgLeftPixel + rWidth/2));

			rOffset.left = imgRatio > elRatio ? bgLeftPixel : 0;
		}
		if (elBackgroundPosition[1].indexOf('%')) {
			var bgTopPersent = elBackgroundPosition[1].slice(0,-1),
				bgTopPixel = Math.round(imgHeight*bgTopPersent/100) - rHeight/2;

			if ((bgTopPixel) < 0) {bgTopPixel = 0;}
			if ((bgTopPixel + rHeight) > imgHeight) {bgTopPixel = imgHeight - rHeight;}

			rOffset.top = imgRatio > elRatio ? 0 : bgTopPixel;
		}
	}

	$('.focalRect').removeAttr('style');

	$('.focalRect').css('width', rWidth.toString() + 'px')
							   .css('height', rHeight.toString() + 'px')
							   .css('left', rOffset.left.toString() + 'px')
							   .css('top', rOffset.top.toString() + 'px')
							   .draggable({
							   		axis: imgRatio > elRatio ? 'x' : 'y',
							   		start: function(e, ui) {
								    	el.css('transition', 'none');
								    },
							   		stop: function(e, ui) {
							   			el.css('transition', '0.3s ease-out');
								        adjustPurpose($(e.target), el);
								    }
							   	});

	$('.purposes-container .purpose').removeClass('active');
	el.parent().addClass('active');


}
function adjustPurpose(focalItem, purposeImg) {

		var img = $('#previewImg'),
		iWidth = img.width(),
		iHeight = img.height(),
		iOffset = img.offset(),

		pWidth = focalItem.outerWidth(),
		pHeight = focalItem.outerHeight(),
		pOffset = focalItem.offset(),

		fTop = Math.round((pOffset.top - iOffset.top + pHeight/2)*100 / iHeight);
		fLeft = Math.round((pOffset.left - iOffset.left + pWidth/2) * 100 / iWidth);

	//console.log(fTop, fLeft);
	if (purposeImg) {
		purposeImg.css('background-position', fLeft.toString() + '% ' + fTop.toString() + '%');
	}
	else {
		$('.purposes-container .purpose .purpose-img').css('background-position', fLeft.toString() + '% ' + fTop.toString() + '%');
	}

}

$('#focalRectToggle').click(function(e) {
	if ($(e.target).hasClass('active')) {
		$('.pr > .preview').removeClass('focal line rect');
		$(e.target).removeClass('active');
	} else {
		$('.pr > .preview').addClass('focal line rect');
		$('.pr > .preview').removeClass('point');
		$('#focalPointToggle').removeClass('active');
		$(e.target).addClass('active');


		//$('.focalRect').resizable({handles: "all", containment: "#previewImg"});
		adjustRect($('.purposes-container .purpose-img').first());
		$('.focalRect').draggable({ containment: "#previewImg", scroll: false });

		$('.purposes-container .purpose-img').unbind().click(function(e) {
			adjustRect($(e.target));
		});
		//$('.img-wrapper').css('max-width', '90%');
		setPurposePagination();
	}
});

var originalDivStyle, originalImgStyle, imageRatio;

/*Bulk Delete - which used to be bulkRemove */
$('#bulkDelete').click(function() {
	//if ($('#al')) {
		$('#deleteFiles').toggleClass('modal hidden');
		$('.ct .file.selected').addClass('sbr');

});
/* Click on Add Styles */
$('#addStyles').click(function(e) {
	$('#as').removeClass('hidden');
	$('#as').addClass('modal'); //as
	$('#wrapper').addClass('overflow');
	$('.effect').detach();
	$('#viewAll').addClass('hidden');
	updateFilters();
});
/* Close Add Styles */
$('.as > .close, .as > .controls, .as > .controls .button').click(function() {
	$('.as').addClass('willClose');
	$('.ct .selected').removeClass('selected');
	$('#selectAll').addClass('empty').removeClass('all');
});


function transformDiv(el, filters) {
	var div = document.getElementById(el.attr('id')),
		img = div.getElementsByTagName('img')[0],
		im = $(img);


	console.log(img, i, imgWidth, imgHeight);




	if (!originalDivStyle) {
		originalDivStyle = div.style;
	} else {
		div.style = originalDivStyle;
	}
	if (!originalImgStyle) {
		originalImgStyle = img.style;
	} else {
		img.style = originalImgStyle;
	}
	el.removeAttr('style');
	im.removeAttr('style');

	var imgWidth = img.clientWidth,//getBoundingClientRect.width;
		imgHeight = img.clientHeight;//getBoundingClientRect.height;
		//imageRatio = imgWidth/imgHeight;

	//console.log(el.attr('style'), originalStyle);
	for (var i=0; i< filters.length; i++) {
		var filter = filters[i];

		switch(filter.name) {
			case 'desaturate':
				im.css('-webkit-filter', 'grayscale(' + filter.value.saturation/100 + ')');
				break;

			case 'scale':
				im.css('width', filter.value.width);
				im.css('height', filter.value.height);
				if (!filter.value.ratio) {
					el.css('background-size', '100% 100%');
				}
				break;

			case 'crop':
				var w = el.width(),
					h = el.height(),
					size = w.toString() + 'px ' + h.toString()+ 'px';
				el.css('width', filter.value.width);
				el.css('height', filter.value.height);
				el.css('background-position', 'center');
				el.css('background-size', size);
				im.css('max-height', 'none');
				im.css('max-width', 'none');
				im.css('height', imgHeight);
				im.css('width', imgWidth);
				break;

			case 'rotate': {
				el.css('transform', 'rotate(' + filter.value.angle + 'deg)');
				if (filter.value.random && !filter.value.angle) {
					el.css('transform', 'rotate(' + (Math.random()*10 - 5) + 'deg)');
				}
				break;
			}


		}
	}
}
function disableFilter(e) {
	$(e.target).parent().parent().toggleClass('disabled');
	console.log($('.effect .switch:checked').length, $('.effect .switch').length);
	if ($('.effect .switch:checked').length === 0) {
		$('#viewAllToggle').prop('checked', false);
	}
	if ($('.effect .switch:checked').length === $('.effect .switch').length) {
		$('#viewAllToggle').prop('checked', true);
	}
	updateFilters();
}

function updateFilters(e) {

	var filters = [];
	//$('.filter').each()
	$.each($('.effect').not('.hidden, .disabled'), function(i, el) {
		var filter = {};
		filter.name = el.getElementsByClassName('title')[0].innerHTML.toLowerCase();

		filter.value = {};
		var inputs = el.getElementsByClassName('values')[0].getElementsByTagName('input');
		for (var i = 0; i<inputs.length; i++) {
			var input = inputs[i];
			var inputName = input.id.split('-')[1];
			filter.value[inputName] = parseFloat(input.value.split(' ')[0]);
			console.log(filter);
		}

		filters.push(filter);
		console.log(el, $(el).children('.title'), filter, filters);
	});
	transformDiv($('#img'), filters);

	/*if (e.target) {
		var type = e.target.id.split('-')[1];

		switch(type) {
			case 'width':
				console.log(e.target.value);
				e.target.value = e.target.value.toString() + ' px';
				console.log(e.target.value);
				break;
		}
	}*/
}
//$('.filter input').change(updateFilters);
function handleStartEditing(e) {
	console.log(e.target);
	if (e.target.type === 'text') {
		e.target.value = e.target.value.split(' ')[0];
		e.target.type = 'number';
	}
}
function handleEndEditing(e) {
	var type = e.target.id.split('-')[1];
	console.log(e.target.type, e.target.value, type);
	e.target.type='text';
	console.log(e.target.type, e.target.value, type);
	if (e.target.value) {
		switch (type) {
			case 'width':
				e.target.value = e.target.value + ' px';
				break;

			case 'height':
				e.target.value = e.target.value + ' px';
				break;

			case 'saturation':
				e.target.value = e.target.value + ' %';
				break;

			case 'angle':
				e.target.value = e.target.value + ' °';
				break;
		}
	}
}
function handleEditing(e) {
	var ratio = e.target.parentNode.getElementsByClassName('ratio')[0],
		targetType = e.target.id.split('-')[1],
		targetId = e.target.id.split('-'),
		otherField, id;

	if (ratio.checked && imageRatio) {

		if (targetType === 'width') {
			id = targetId[0] + '-height-' + targetId[2];
			otherField = document.getElementById(id);
			otherField.value = Math.round(e.target.value / imageRatio).toString() + ' px';
		}
		else if (targetType === 'height') {
			id = targetId[0] + '-width-' + targetId[2];
			otherField = document.getElementById(id);
			otherField.value = Math.round(e.target.value * imageRatio).toString() + ' px';
		}
	}
	updateFilters(e);
}
function handleRatioToggle(e) {
	var image = document.getElementById('img').getElementsByTagName('img')[0];
		imageRatio = image.offsetWidth/image.offsetHeight;
}


/* when you select an effect, it's going to be replaced with another set of input fields */
$('#addEffect').click(function(e) {
	$(e.target).parent().addClass('open');
});
$('#select_new_effect li').click(function(e) {
	var select = $(e.target).parent().parent(),
		item = $(e.target),
		spanString = select.children('span').text();

	if (!imageRatio) {
		var image = document.getElementById('img').getElementsByTagName('img')[0];
		imageRatio = image.offsetWidth/image.offsetHeight;
	}

	select.removeClass('open');
	$('#viewAll').removeClass('hidden');

	var title = $('<div></div>').addClass('title').text(item.text()).click(collapsePannel),
		toggle = $('<input type="checkbox" checked/>').addClass('switch').change(disableFilter),
		close = $('<div></div>').addClass('close').click(removeEffect),
		header = $('<div></div>').addClass('header').append(toggle, title, close).click(collapsePannel),
		values = $('<div></div>').addClass('values')
		filter = $('<div></div>').addClass('effect open').append(header, values);

		fCount = $('.effect').length + 1;

		switch(item.text().toLowerCase()) {

			case 'desaturate': {
				var saturation = $('<input type="number"/>')
							.attr('id', item.text().toLowerCase() + '-saturation-' + fCount)
							.attr('placeholder', 'Desaturation, %')
							.css('width', 'calc(60% - 25px)')
							.css('margin-right', '10px')
							.on('input', updateFilters)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing);

				values.append(saturation);
				break;
			}

			case 'resize': {
				var width = $('<input type="text"/>')
							.attr('id', item.text().toLowerCase() + '-width-' + fCount)
							.attr('placeholder', 'Width')
							.css('width', 'calc(50% - 30px)')
							.css('margin-right', '23px')
							.on('input', handleEditing)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing),

					height = $('<input type="text"/>')
							.attr('id', item.text().toLowerCase() + '-height-' + fCount)
							.attr('placeholder', 'Height')
							.css('width', 'calc(50% - 30px)')
							.on('input', handleEditing)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing),

					ratio = $('<input type="checkbox" tabindex="-1"/>')
							.attr('id', item.text().toLowerCase() + '-ratio-' + fCount)
							.addClass('ratio')
							.change(handleRatioToggle);

				values.append(width, ratio, height);
				break;
			}

			case 'crop': {
				var width = $('<input type="text"/>')
							.attr('id', item.text().toLowerCase() + '-width-' + fCount)
							.attr('placeholder', 'Width')
							.css('width', 'calc(50% - 30px)')
							.css('margin-right', '23px')
							.on('input', handleEditing)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing),

					height = $('<input type="text"/>')
							.attr('id', item.text().toLowerCase() + '-height-' + fCount)
							.attr('placeholder', 'Height')
							.css('width', 'calc(50% - 30px)')
							.on('input', handleEditing)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing),

					ratio = $('<input type="checkbox" tabindex="-1"/>')
							.attr('id', item.text().toLowerCase() + '-ratio-' + fCount)
							.addClass('ratio')
							.change(handleRatioToggle);

				values.append(width, ratio, height);
				break;
			}
			case 'scale': {
				var width = $('<input type="text"/>')
							.attr('id', item.text().toLowerCase() + '-width-' + fCount)
							.attr('placeholder', 'Width')
							.css('width', 'calc(50% - 30px)')
							.css('margin-right', '23px')
							.on('input', handleEditing)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing),

					height = $('<input type="text"/>')
							.attr('id', item.text().toLowerCase() + '-height-' + fCount)
							.attr('placeholder', 'Height')
							.css('width', 'calc(50% - 30px)')
							.on('input', handleEditing)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing),

					ratio = $('<input type="checkbox" tabindex="-1"/>')
							.attr('id', item.text().toLowerCase() + '-ratio-' + fCount)
							.addClass('ratio')
							.change(handleRatioToggle);

				values.append(width, ratio, height);
				break;
			}

			case 'rotate': {
				var angle = $('<input type="text"/>')
							.attr('id', item.text().toLowerCase() + '-angle-' + fCount)
							.attr('placeholder', 'Angle, deg')
							.css('width', 'calc(50% - 25px)')
							.css('margin-right', '10px')
							.on('input', updateFilters)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing),

					random = $('<input type="checkbox"/>')
							.attr('id', item.text().toLowerCase() + '-random-' + fCount)
							.change(updateFilters);

				values.append(angle);
				break;
			}
		}

		$('#effect_list').append(filter);
});
$('#effect_list').sortable();

$('*').not('.select_effect li, .select_effect, .select_effect .button').click(function(e) {
	if ($('.select_effect').hasClass('open')) {
		$('.select_effect').removeClass('open');
	}
});

/* Remove Effect */
function removeEffect(e) {
	$(e.target).parent().parent().remove();
	updateFilters();
}

/* effect all button controls all the buttons */
$('#viewAllToggle').change(function(e) {
	$('.effect .header .switch').prop('checked', e.target.checked);
	if (e.target.checked) {$('.effect').removeClass('disabled');}
	else {$('.effect').addClass('disabled');}
	updateFilters();
});

$('.purpose .close').click(function(e) {

	if ($('.ct .purpose.selected').length > 0) {
		$('#deleteFiles').toggleClass('modal hidden');
		$('.ct .purpose.selected').addClass('sbr');
	} else {
		$('#deleteFiles').toggleClass('modal hidden');
		e.target.parentNode.parentNode.parentNode.classList.add('sbr');
	}
});
$('.purpose-controls').click(function(e) {
	e.target.parentNode.parentNode.classList.toggle('selected');
	if ($('.ct .purpose.selected').length === $('.ct .purpose').length) {
		$('#selectAll').toggleClass('all empty');
	} else if ($('.ct .purpose.selected').length > 0 && $('.ct .purpose.selected').length !== $('.ct .purpose')) {
		$('#selectAll').removeClass('all empty');
	} else if ($('.ct .purpose.selected').length === 0) {
		$('#selectAll').addClass('empty');
	}
});

/* Effect pane */
function collapsePannel(e) {
	if ($(e.target).hasClass('title')) {
		$(e.target).parent().parent().toggleClass('open');
	} else {
		$(e.target).parent().toggleClass('open');
	}
}

function closeEditScreen() {
    $('.pr').removeClass('modal').addClass('hidden');
	$('.pr .preview').removeClass('focal line full rect point');
	$('.focalPoint').removeAttr('style');
	$('.focalRect').removeAttr('style');
	$('#focalPointToggle').removeClass('active');
	$('#focalRectToggle').removeClass('active');
	$('.purposes-container .purpose .purpose-img').removeAttr('style');
	$('.ct .file').find('button').css('display', '');
	deselectAll();
	$('#wrapper').removeClass('overflow');
}

function showModalPrompt(title, text, confirmText, confirmAction, cancelText, cancelAction) {
    var modal = $('<div></div>').addClass(op, modal);
}

function showNotification(text, top) {
    var notification = $('.notification'),
        notificationText = $('.notification__text');

    if (notification.length === 0) {
        notification = $('<div></div>').addClass('notification');
        notificationText = $('<div></div>').addClass('notification__text');
        notification.append(notificationText);
    }

    if ($('.modal .preview').length > 0) {
        $('.modal .preview').append(notification);
    } else if($('.ct').length > 0) {
        $('.ct').append(notification);
    } else {
        $('body').append(notification);
    }

    if (top) {notification.css('top', top);}
    notificationText.text(text);
    window.setTimeout(function() {
        notification.remove();
    }, 4000);
}

/*var jArray= <?php echo json_encode(array(
    'label' => 'New style',
    'effects' => array(
      1 => array(
        'name' => 'image_crop',
        'data' => array(
          'width' => 300,
          'height' => 400,
          'anchor' => 'left-top',
        ),
        'weight' => 1,
      ),
      2 => array(
        'name' => 'image_desaturate',
        'data' => array(),
        'weight' => 2,
      ),
      3 => array(
        'name' => 'image_resize',
        'data' => array(
          'width' => 200,
          'height' => 200,
        ),
        'weight' => 3,
      ),
      4 => array(
        'name' => 'image_scale',
        'data' => array(
          'width' => 180,
          'height' => 180,
          'upscale' => 0,
        ),
        'weight' => 4,
      ),
      5 => array(
        'name' => 'image_scale_and_crop',
        'data' => array(
          'width' => 150,
          'height' => 100,
        ),
        'weight' => 5,
      ),
    ),
  )); ?>

  console.log(jArray);*/
$('#purposeToggle').click(function(e) {
	if ($(e.target).children('span').text() === ' View all') {
		showAllPreviews();
	} else {
		collapseAllPreviews();
	}
});

$('#showPreview').click(showAllPreviews);

function showAllPreviews() {
    $('.preview.focal').addClass('full').removeClass('line');
    $('#purposeToggle').children('span').text(' Hide Preview');
    $('#purposeToggle').children('.fa').addClass('fa-arrow-down').removeClass('fa-arrow-up');
    $('.purposes .purpose-img').unbind('click').click(handlePurposeClick);
    scrollPosition = $('#purposeWrapper').scrollLeft();

}

function collapseAllPreviews() {
    $('.preview.focal').addClass('line').removeClass('full');
    $('#purposeToggle').children('span').text(' View all');
    $('#purposeToggle').children('.fa').addClass('fa-arrow-up').removeClass('fa-arrow-down');
    $('.purposes .purpose-img').unbind('click').click(function(e) {
        adjustRect($(e.target));
    });
}

/* Click on Purpose */
function handlePurposeClick(e) {
	console.log(scrollPosition);
	var purpose = $(e.target).parent(),
		purposeWrapper = $('#purposeWrapper');

	var index = purpose.parent().children('.purpose').index(purpose),
		scrollOffset = index * 140;

	var scrollDelta = scrollOffset - scrollPosition,
		sds = scrollDelta > 0 ? '+=' + scrollDelta : '-=' + Math.abs(scrollDelta);

		console.log(sds);

	$('.preview.focal').toggleClass('line full');
	$('#purposeWrapper').scrollLeft(scrollPosition);
	$('#purposeToggle').children('.fa').toggleClass('fa-arrow-up fa-arrow-down');
	$('#purposeToggle').children('span').text(' View all');
	$('#purposeWrapper').animate( { scrollLeft: scrollOffset }, 600);
    $('.purposes-container .purpose').removeClass('active');
    purpose.addClass('active');
    $('.purposes .purpose-img').unbind().click(function(e) {
        adjustRect($(e.target));
    });
}

function checkField(field) {
    if ($(field).val() === '') {
        return false;}
    return true;
}
function markFieldAsRequired(field) {
    $(field).addClass('emptyField');
    if ($(field).parent().children('.errMsg').length === 0) {
        var msg = $('<div></div>').addClass('errMsg').text("This field couldn't be empty");
        $(field).parent().append(msg);
    }
}
function markFieldAsNormal(field) {
    $(field).removeClass('emptyField');
    $(field).parent().children('.errMsg').remove();
}

function checkFields(selector) {
    var fields = $(selector).parent().children('input');
    var result = true;
    var firstIndex = -1;
    fields.each(function(index, el) {
        console.log(el);
        if (checkField(el)) {
            markFieldAsNormal(el);
        } else {
            markFieldAsRequired(el);
            result = false;
            if (firstIndex < 0) {
                firstIndex = index;
                el.focus();
            }
        }
    });

    return result;
}

$('label.requiered').parent().children('input').on('blur', function(e) {
    if (checkField(e.target)) {
        markFieldAsNormal(e.target);
    } else {
        markFieldAsRequired(e.target);
    }
});


function toggleFileSelect(e) {
	e.stopPropagation();
	e.preventDefault();
	var file = $(e.target).parents('.file'),
		filesSection = file.parent(),
		files = filesSection.children('.file');
		selectedFiles = filesSection.children('.file.selected');



	//Check if user hold Shift Key
	if (e.shiftKey) {
		if (file.hasClass('selected')) {
			file.removeClass('selected');
		}
		else {
			if (selectedFiles) {
				var fileIndex = file.index(),
					filesToBeSelect = files.slice(lastSelected, fileIndex + 1);

				if (lastSelected > fileIndex) {
					filesToBeSelect = files.slice(fileIndex, lastSelected);
				}
				filesToBeSelect.addClass('selected');
			}
			else {
				file.toggleClass('selected');
			}
		}
	}
	else {
		file.toggleClass('selected');
	}
	lastSelected = file.index();
	normalizeSelecteion();
}
function normalizeSelecteion() {
	var bulkDeleteButton = $('#bulkRemove'),
		bulkEditButton = $('#bulkEdit'),
		multiEditButton = $('#multiEdit'),

		selectAllButton = $('#selectAll'),
		selectAllLabel = $('#selectAllLabel'),

		deleteButtons = $('.ct .files .file .file__delete'),
		editButtons = $('.ct .files .file .button'),
		arrangements = $('.ct .files .file .file__arragement'),
		arrangementInputs = $('.ct .files .file .file__arragement').find('input'),

		selectedDeleteButton = $('.ct .files .file.selected .file__delete'),
		selectedEditButton = $('.ct .files .file.selected .button'),
		selectedArrangement = $('.ct .files .file.selected .file__arragement'),
		selectedArrangementInput = $('.ct .files .file.selected .file__arragement').find('input'),

		numberOfFiles = $('.ct .files .file').length,
		numberOfSelectedFiles = $('.ct .files .file.selected').length;

	//No selected files
	if (numberOfSelectedFiles === 0) {
		selectAllButton.removeClass('all').addClass('empty');
		selectAllLabel.text('Select all');
		bulkDeleteButton.addClass('disabled');
		bulkEditButton.addClass('disabled');
		multiEditButton.addClass('disabled');

		editButtons.removeClass('hidden');
		deleteButtons.removeClass('hidden');
		arrangements.removeClass('disabled');
		arrangementInputs.prop('disabled', false);
	}
	//Some files are selected
	else if (numberOfSelectedFiles > 0) {
		selectAllButton.removeClass('empty all');
		selectAllLabel.text('Deselect all');
		bulkDeleteButton.removeClass('disabled');
		bulkEditButton.removeClass('disabled');
		multiEditButton.removeClass('disabled');

		editButtons.addClass('hidden');
		deleteButtons.addClass('hidden');
		arrangements.addClass('disabled');
		arrangementInputs.prop('disabled', true);

		//Only one file selected
		if (numberOfSelectedFiles === 1) {
			bulkEditButton.addClass('disabled');
			multiEditButton.addClass('disabled');

			selectedEditButton.removeClass('hidden');
			selectedDeleteButton.removeClass('hidden');
			selectedArrangement.removeClass('disabled');
			selectedArrangementInput.prop('disabled', false);
		}
		//All files are selected
		if (numberOfSelectedFiles === numberOfFiles) {
			selectAllButton.removeClass('empty').addClass('all');
		}
	}
}
function selectAll() {
	$('.ct .file').addClass('selected');
	$('#selectAll').addClass('all').removeClass('empty');
	normalizeSelecteion();
}
function deselectAll() {
	$('.ct .file.selected').removeClass('selected');
	$('#selectAll').addClass('empty').removeClass('all');
	normalizeSelecteion();
}

function openMenu(el, data) {
    console.log(el);

    var width = $(el).find('input').outerWidth(),
        height = $(el).height(),
        offset = $(el).offset(),
        documentHeight = $(document).height(),
        bottomspace = documentHeight - offset.top - height - 200;

        bottom = bottomspace > 0 ? true : false,

        //console.log(offset.top, height, documentHeight, bottom, (offset.top + height + 200 - documentHeight));

        dropdown = $('<div></div>')
                    .addClass('dropdown__menu')
                    .addClass(function() {return bottom ? 'dropdown__menu_bottom' : 'dropdown__menu_up';})
                    .css('width', width)
                    .css('height', function() {return bottom ? bottomspace + 200 : 300;})
                    .attr('id', 'dropdownList'),
        search = $('<input type="text" placeholder="Show, season, episode or event"/>').addClass('dropdown__search').on('input', function(e) {filterList(e, data);}),
        list = $('<div></div').addClass('dropdown__list'),
        listUl = $('<ul></ul>');

    if (data) {
        for (var i = 0; i < data.length; i++) {
            var item = $('<li></li>').text(data[i]).click(itemSelect);
            listUl.append(item);
        }
    }

    list.append(listUl);
    dropdown.append(search, list);
    $(el).append(dropdown);//.unbind('click').click(closeDropDown);
    search.focus();
    $('*').click(closeDropDown);
}

function closeDropDown(e) {
    $('*').unbind('click', closeDropDown);
    $('#dropdownList').parents('.dropdown').blur();
    $('#dropdownList').remove();
    //$('.dropdown').click(function(event) {openMenu(event.target, showList);});
}

$('.dropdown').click(function(e) {openMenu(e.target, showList);});

function filterList(e, data) {
    var ul = $(e.target).parents('.dropdown').find('ul');
    ul.empty();
    filteredData = data;
    if ($(e.target).val()) {
        filteredData = data.filter(function(d) {
            console.log(d, $(e.target).val(), d.indexOf($(e.target).val()));
            return d.indexOf($(e.target).val()) > -1;
        });
    }
    console.log(filteredData, data, $(e.target).val());
    if (filteredData) {
        for (var i = 0; i < data.length; i++) {
            var item = $('<li></li>').text(data[i]).click(itemSelect);
            ul.append(item);
        }
    }
}
function itemSelect(e) {
    var dropdown = $(e.target).parents('.dropdown'),
        input = dropdown.find('input');
    input.val($(e.target).text());
    dataChanged = true;
}

var showList = [
    'Alcatraz',
    'Alcatraz S01',
    'Alcatraz S01 E01',
    'Alcatraz S01 E02',
    'Alcatraz S01 E03',
    'Alcatraz S01 E04',
    'Alcatraz S01 E05',
    'Alcatraz S01 E06',
    'Alcatraz S01 E07',
    'Alcatraz S01 E08',
    'Alcatraz S01 E09',
    'Alcatraz S01 E10',
    'Alcatraz S01 E11',
    'Alcatraz S01 E12',
    'Alcatraz S01 E13',
    'Alcatraz S01 E14',
    'Alcatraz S01 E15',
    'Alcatraz S01 E16',
    'Alcatraz S01 E17',
    'Alcatraz S01 E18',
    'Alcatraz S01 E19',
    'Alcatraz S01 E20',

    'Blindspot',
    'Blindspot S01',
    'Blindspot S01 E01',
    'Blindspot S01 E02',
    'Blindspot S01 E03',
    'Blindspot S01 E04',
    'Blindspot S01 E05',
    'Blindspot S01 E06',
    'Blindspot S01 E07',
    'Blindspot S01 E08',
    'Blindspot S01 E09',
    'Blindspot S01 E10',
    'Blindspot S01 E11',
    'Blindspot S01 E12',
    'Blindspot S02',
    'Blindspot S02 E01',
    'Blindspot S02 E02',
    'Blindspot S02 E03',
    'Blindspot S02 E04',
    'Blindspot S02 E05',
    'Blindspot S02 E06',
    'Blindspot S02 E07',
    'Blindspot S02 E08',
    'Blindspot S02 E09',
    'Blindspot S02 E10',
    'Blindspot S02 E11',
    'Blindspot S02 E12',
    'Haven',
    'Haven S01',
    'Haven S01 E01',
    'Haven S01 E02',
    'Haven S01 E03',
    'Haven S01 E04',
    'Haven S01 E05',
    'Haven S01 E06',
    'Haven S01 E07',
    'Haven S01 E08',
    'Haven S01 E09',
    'Haven S01 E10',
    'Haven S01 E11',
    'Haven S01 E12',
];

var actors = [
    'Adam Copeland',
    'Emily Rose',
    'Eric Balfour',
    'John Dunsworth',
    'Laura Mennell',
    'Lucas Bryant',
    'Richard Donat',
];

function focusTagField(e) {
    e.stopPropagation();
    var tagfield = $(e.target).hasClass('tagfield') ? $(e.target) : $(e.target).parents('tagfield');
        input = tagfield.find('input'),
        span = tagfield.find('span'),
        menu = tagfield.find('.tagfield__menu');

    tagfield
        .addClass('tagfield_active')
        .unbind('click', focusTagField);

    if (tagfield.find('input').length === 0) {
        input = $('<input type="text" placeholder="type tag..."/>').addClass('tagfield__input').on('input focus', filterList);
        tagfield.append(input);}

    if (tagfield.find('.tagfield__menu').length === 0) {
        menu = $('<div></div>').addClass('tagfield__menu');
        var ul = $('<ul></ul>');

        actors.forEach(function(a) {
        ul.append($('<li></li>').text(a).click(handleTagMenuItemClick));
        });
        menu.append(ul);
        tagfield.append(menu);
    }

    span.addClass('hidden');
    input.focus();
    $('*')
        .not(tagfield)
        .not(menu)
        .not(input)
        .not('.tagfield__menu ul, .tagfield__menu li')
        .click(unfocusTagfield);
}
function handleTagMenuItemClick(e) {
    e.stopPropagation();
    console.log(e.target);
    var item = $(e.target),
        tagfield = item.parents('.tagfield'),
        input = tagfield.find('.tagfield__input'),
		tag = $('<div></div>').addClass('tag').text(item.text()),
		tagDelete = $('<div></div>').addClass('tag__delete').text('✕').on('click', deleteTag);

	tag.append(tagDelete);
	tag.insertBefore(input);
    input.focus();
    dataChanged = true;
}
function deleteTag(e) {
    e.stopPropagation();
    var tag = $(e.target).parents('.tag'),
        input = tag.parent().find('input');

    tag.remove();
    input.val('').focus();
}
function filterList(e) {
    var input = $(e.target),
        tagfield = input.parents('.tagfield'),
        ul = tagfield.find('ul');

    var filteredList = actors.filter(function(a) {
        return a.toLowerCase().indexOf(input.val()) >= 0;
    });
    ul.empty();
    filteredList.forEach(function(a) {
        ul.append($('<li></li>').text(a).click(handleTagMenuItemClick));
    });

    if (input.val().slice(-1) === ',') {
        var tag = $('<div></div>').addClass('tag').text(input.val().slice(0, -1)),
		    tagDelete = $('<div></div>').addClass('tag__delete').text('✕').on('click', deleteTag);

        input.val('');
        tag.append(tagDelete);
        tag.insertBefore(input);
        input.focus();
    }
}

function unfocusTagfield(e) {
    console.log(e);
    var tagfield = $('.tagfield'),
        input = tagfield.find('input'),
        span = tagfield.find('span'),
        menu = tagfield.find('.tagfield__menu'),
        tags = tagfield.find('.tag');

    tagfield.removeClass('tagfield_active').click(focusTagField);
    menu.remove();
    input.remove();

    if (tags.length === 0) {span.removeClass('hidden');}
    $('*').unbind('click', unfocusTagfield);
}

function createTooltip(target, text) {
    var tooltip = $('<div></div>').addClass('tooltip').click(closeTooltip),
        tooltipText = $('<div></div>').addClass('tooltip__text').text(text),
        tooltipToggle = $('<div></div>').addClass('tooltip__toggle'),
        tooltipToggle_Toggle = $('<input type="checkbox" id="neverShowTooltip" />'),//.on('change', neverShowTooltip),
        tooltipToggle_Label = $('<label for="neverShowTooltip">Got it, don\'t show me this again</label>');

    tooltipToggle.append(tooltipToggle_Toggle, tooltipToggle_Label);
    tooltipToggle.bind('focus click change', neverShowTooltip);
    tooltip.append(tooltipText, tooltipToggle);
    $(target).parent().append(tooltip);

    tooltip.width(target.width());
    //console.log($('body').width() - target.o().left - target.width() - target.width() - 20, $('body').width());
    if ($('body').width() - target.offset().left - target.width() - target.width() - 20 > 0 ) {
        tooltip.css('left', target.position().left + target.width() + 10);
    } else {
        tooltip.css('left', target.position().left - target.width() - 10);
    }

            //.css('top', target.position().top + target.height());

    $('html').click(closeTooltip);
}

function neverShowTooltip(e) {
    e.stopPropagation();
    console.log('never show', e.target);
    window.localStorage.setItem('tooltip', true);
    closeTooltip();
}

function closeTooltip(e) {
    //console.log('closetooltip', e);
    $(document).unbind('click', closeTooltip);
    var tooltips = $('.tooltip');
    window.setTimeout(function() {
        tooltips.remove();
    }, 300);


}

var galleryCaptions = {};

function handleCaptionEdit(e) {
    var fileElement = $(e.target).parents('.file'),
        fileId = fileElement.find('.file__id').text(),
        toggle = fileElement.find('.file__caption-toggle .toggle'),
        file = galleryObjects.filter(function(f) {
            return f.fileData.id === fileId;
        })[0],

        toggleChecked = $(e.target).val() === file.fileData.caption && file.fileData.caption; //If textfield equals the file caption and file caption not empty

    //Save caption to galleryCaptions
    file.caption = $(e.target).val();

    //console.log(file.find('.file__index').text());
    toggle.prop('checked', toggleChecked);
    closeTooltip();
}
function handleCaptionToggleClick(e) {
    //e.stopPropagation();
    var file = $(e.target).parents('.file'),
        fileIndex = parseInt(file.find('.file__index').text()),
        textarea = file.find('.file__caption-textarea'),
        originalCaption = galleryObjects[fileIndex].caption;

    if ($(e.target).prop('checked')) {
        textarea.val(originalCaption);
    } else {
        textarea.focus();
    }
}
function handleCaptionStartEditing(e) {
    var tooltipText = 'This caption will only apply to your gallery and not to the image asset.';
    if (!window.localStorage.getItem('tooltip')) {
        createTooltip($(e.target), tooltipText);
    }
}

$('.file__caption-textarea').on('blur input', handleCaptionEdit);
$('.file__caption-textarea').on('focus', handleCaptionStartEditing);
$('.file__caption-toggle .toggle').click(handleCaptionToggleClick);

// Change element indexes to an actual ones
function normalizeIndex() {
    var files = $('.tab .files .section__files .file');

    files.each(function(index, el) {
        $(el).find('.file__aragement-input').val(index + 1);
    });
}

function handleIndexFieldChange(e) {
    var length = $('.tab .files .section__files .file').length,
        index = parseInt($(e.target).val()) - 1,
        file = $(e.target).parents('.file');

    if (index + 1 >= length) {
        putBottom(file);
    } else {
        file.detach().insertBefore($('.tab .files .section__files .file').slice(index, index+1));

    }
    normalizeIndex();
    //updateGallery(index);
}

function putBottom(file) {
    file.detach().insertAfter($('.tab .files .section__files .file').last());
    normalizeIndex();
    //updateGallery(galleryObjects.length);
}
function putTop(file) {
    file.detach().insertBefore($('.tab .files .section__files .file').first());
    normalizeIndex();
    //updateGallery(0);
}

function handleSendToTopClick(e) {
    putTop($(e.target).parents('.file'));
    //closeMenu($(e.target).parents('select__menu'));
}
function handleSendToBottomClick(e) {
    putBottom($(e.target).parents('.file'));
    //closeMenu($(e.target).parents('select__menu'));
}
function closeMenu(e) {
    console.log('closeMenu');
    $('.select__menu').detach();
    $('body').unbind('click', closeMenu);
}

function showRearrangeMenu(e) {
    console.log('rearrange menu', e.target);
    //e.stopPropagation();
    if ($(e.target).parents('.file__arragement').find('.select__menu').length <= 0) {
        var menu = $('<div></div>').addClass('select__menu'),
            ul = $('<ul></ul>'),
            item1 = $('<li>Send to Top</li>').click(handleSendToTopClick),
            item2 = $('<li>Send to Bottom</li>').click(handleSendToBottomClick);

        ul.append(item1, item2);
        menu.append(ul);
        $(e.target).append(menu);
        $(document).on('click', closeMenu);

    } else {
        closeMenu();
    }

}

var assetLibraryObjects = [
    {
        url: 'img/doodle/aztec_temple.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'aztec_temple.png 48392 342',
        color: '#B0DEDA',
        title: 'Haven_gallery_518FunFacts_01.jpg',
        caption: 'Writer, Brian Millikin, a man about Haven, takes us behind the scenes of this episode and gives us a few teases about the Season that we can\'t wait to see play out! This is the first episode of Haven not filmed in or around Chester, Nova Scotia. Beginning here, the show and its stages relocated to Halifax.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Brian Millikin',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/big_ben.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'big_ben.png 43defqwe',
        color: '#FDBD00',
        title: 'Haven_gallery_518FunFacts_02.jpg',
        caption: 'Charlotte lays out her plan for the first time in this episode: to build a new Barn, one that will cure Troubles without killing Troubled people in the process. Her plan, and what parts it requires, will continue to play a more and more important role as the season goes along.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/christ_the_redeemer.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'christ_the_redeemer.png 092nlxnc',
        color: '#ED412D',
        title: 'Haven_gallery_518FunFacts_03.jpg',
        caption: 'Lost time plays an even more important role in this episode than ever before— as it’s revealed that it’s a weapon the great evil from The Void has been using against us, all season long. Which goes back to the cave under the lighthouse in beginning of the Season 5 premiere.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Lost time',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/colosseum.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'colosseum.png -4rjxnsk',
        color: '#32A4B7',
        title: 'Haven_gallery_518FunFacts_04.jpg',
        caption: 'The “aether core” that Charlotte and Audrey make presented an important design choice. The writers wanted it to look organic but also designed— like the technology of an advanced culture from a different dimension, capable of doing things that we might perceive as magic but which is just science to them. The various depictions of Kryptonian science in various Superman stories was one inspiration.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte and Audrey',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/easter_island.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'easter_island.png nln4nka0',
        color: '#D3ECEC',
        title: 'Haven_gallery_518FunFacts_05.jpg',
        caption: 'This is the first episode in Season 5 in which we’ve lost one of our heroes. It was important to happen as we head into the home stretch of the show and as the stakes in Haven have never been more dire. As a result, it won’t be the last loss we\'ll suffer this season…',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Wild Card',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/pyramids.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'pyramids.png fdby64',
        color: '#2A7C91',
        title: 'Haven_gallery_518FunFacts_06.jpg',
        caption: 'The challenge in Charlotte\'s final confrontation was that the show couldn’t reveal her attacker’s appearance to the audience, so the darkness was necessitated.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },

    {
        url: 'img/doodle/san_franciso_bridge.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'san_franciso_bridge.png 4234ff52',
        color: '#967840',
        title: 'Haven_gallery_518Recap_01.jpg',
        caption: 'Warning: If you don\'t want to know what happened in this episode, don\'t read this photo recap! Dave just had another vision and this time, he\'s being proactive about it. He and Vince dash out of the house to save the latest victims of Croatoan, a.k.a the No Marks Killer.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/stone_henge.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'stone_henge.png 490mnmabd',
        color: '#566F78',
        title: 'Haven_gallery_518Recap_02.jpg',
        caption: 'Meanwhile, Dwight and Nathan go downtown to investigate what they think is a drunken man causing a disturbance but it turns out that the guy is cursed. There is a roman numeral on his wrist and, as they watch, invisible horses trample him. Later, Nathan and Dwight find another man who appears to have been struck by lightening – but there had been no recent storm in town – and dropped from a skyscraper. Skyscrapers in Haven? Absurd. And the guy also has a mysterious Roman numeral tattoo on his wrist. Nathan and Dwight find a list of names in the guy\'s pocket that leads them to a local fortune teller, Lainey.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/sydney_opera_house.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'sydney_opera_house.png 0sed67h',
        color: '#2E1D07',
        title: 'Haven_gallery_518Recap_03.jpg',
        caption: 'By following the clues from Dave\'s vision, he and Vince find the scene of the No Mark Killer\'s most recent crime. They also find a survivor. Unfortunately, she can\'t remember anything. Her memory has been wiped, which gets them to thinking about who may be next on Croatoan\'s list.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/taj_mahal.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'taj_mahal.png 943nbka',
        color: '#00445F',
        title: 'Haven_gallery_518Recap_04.jpg',
        caption: 'On their way to meet with Lainey, Nathan breaks his tire iron while trying to fix a flat tire. Tough break. And then Dwight gets a shooting pain in his side with a gnarly bruise to match, even tougher break. And then both guys notice that they now have Roman numeral tattoos on their wrists. The number X for Nathan and XII for Dwight.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/windmill.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'windmill.png jerl34',
        color: '#2F3837',
        title: 'Haven_gallery_518Recap_05.jpg',
        caption: 'In the mineshaft, Charlotte and Audrey have taken on the task of collecting all of the aether to create an aether core. This is the first step they need to create a new Barn where Trouble people can step inside and then be "cured" of their Troubles when they step out. Sounds easy enough but they\'re having trouble corralling all the aether into a giant ball. Unsurprisingly, the swirling black goo isn\'t willfully cooperating.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/tree_1.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'tree_1.png',
        color: '#63624C',
        title: 'Haven_gallery_518Recap_06.jpg',
        caption: 'As if the aether wasn\'t enough of a problem to tackle, Charlotte feels herself getting weaker by the minute and then Audrey starts to lose her eyesight. They look at their wrists and notice that the Roman number problem has now affected them too, the numbers II for Audrey and VIII for Charlotte.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/tree_2.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'tree_2.png',
        color: '#4A504E',
        title: 'Haven_gallery_518Recap_07.jpg',
        caption: 'In North Carolina, Duke and Seth sit with a local man who claims to be able to remove the "black tar" from Duke\'s soul. After an elaborate performance, Duke realizes that the guy is a fake. The rattled guy who doesn\'t want any trouble from Duke tells them that Walter Farady will have the real answers to Duke\'s questions. When they go looking for Walter, they find him … and his headstone that has a familiar marking on it, the symbol for The Guard. What gives? Just as Duke is about to give up he gets a visit from Walter\'s ghost who promises to give him answers to all of the questions …via the next episode of course. Cliffhanger!',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/tree_3.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'tree_3.png',
        color: '#DD9F00',
        title: 'Haven_gallery_518Recap_08.jpg',
        caption: 'After some prodding, Dwight and Nathan find that Lainey got a visit from Croatoan and "lost time". She doesn\'t remembering drawing cards for any of them. Nathan has her draw new cards and a hesitant Lainey does. Dwight is given a bondage fate and is later shackled by chains to a gate, Charlotte will be reunited with her true love (hmm…) and Audrey is aligned with the moon. Not perfect fates, but it\'s enough to get everyone out of the pickles their currently in.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/tree_4.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'tree_4.png',
        color: '#8FC99B',
        title: 'Haven_gallery_518Recap_09.jpg',
        caption: 'With their strength regained, Audrey and Charlotte are able to create the aether core they need. Charlotte instructs Audrey to go and hide it some place safe. In the interim, Charlotte kisses Dwight goodbye and gives him the ring she once used to slip into The Void. Later, with her moon alignment causing Audrey to disappear and Dwight still shackled, Lainey pulls another card for the entire group, a judgment card, which she reads to mean that as along as their intentions are pure they can all overcome any obstacles. This is great news for everyone except...',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/tree_5.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        id: 'tree_5.png',
        color: '#BFC9A2',
        title: 'Haven_gallery_518Recap_10.jpg',
        caption: 'Charlotte. Croatoan pays her a visit in her apartment to tell her that he\'s pissed that she\'s "one of them now" and that she chose Audrey over Mara. Croatoan wastes no time in killing Charlotte and she clings to life for just enough time to be found by Audrey so she can give her the most shocking news of the season: Croatoan is Audrey\'s father and he\'s got "plans" for her!',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    }
];

var fileImgColors = [
    '#4DD0E1',
    '#80DEEA',
    '#FFD54F',
    '#FFE082',
    '#FF7043',
    '#FF7043',
    '#80CBC4',
    '#D3ECEC',
    '#55AECA',
    '#FFC600'
];

function handleMenuClick(e) {
    console.log($('#leavePagePrompt').length);
    if ($('#leavePagePrompt').length > 0) {
        e.stopPropagation();
        e.preventDefault();

        var linkText = $(e.target).text(),
            linkSrc = e.target.href;

        console.log(linkText, linkSrc);

        //Inbund actons from buttons
        $('#leavePagePrompt .buttons').unbind('click');

        //Set confirmation button
        $('#leavePage').text('Go to ' + linkText).click(function() {window.location.href = linkSrc;});

        //Set cancelation button
        $('#cancelLeavePage').click(function() {$('#leavePagePrompt').toggleClass('hidden modal');});

        //Show confirmation prompt
        $('#leavePagePrompt').toggleClass('hidden modal');
    }
}


var galleryObjects = [/*
    {
        url: 'img/doodle/Alex.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#B0DEDA',
        title: 'Haven_gallery_518FunFacts_01.jpg',
        caption: 'Writer, Brian Millikin, a man about Haven, takes us behind the scenes of this episode and gives us a few teases about the Season that we can\'t wait to see play out! This is the first episode of Haven not filmed in or around Chester, Nova Scotia. Beginning here, the show and its stages relocated to Halifax.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Brian Millikin',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/Cyntia.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#FDBD00',
        title: 'Haven_gallery_518FunFacts_02.jpg',
        caption: 'Charlotte lays out her plan for the first time in this episode: to build a new Barn, one that will cure Troubles without killing Troubled people in the process. Her plan, and what parts it requires, will continue to play a more and more important role as the season goes along.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/Garry.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#ED412D',
        title: 'Haven_gallery_518FunFacts_03.jpg',
        caption: 'Lost time plays an even more important role in this episode than ever before— as it’s revealed that it’s a weapon the great evil from The Void has been using against us, all season long. Which goes back to the cave under the lighthouse in beginning of the Season 5 premiere.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Lost time',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/Helen.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#32A4B7',
        title: 'Haven_gallery_518FunFacts_04.jpg',
        caption: 'The “aether core” that Charlotte and Audrey make presented an important design choice. The writers wanted it to look organic but also designed— like the technology of an advanced culture from a different dimension, capable of doing things that we might perceive as magic but which is just science to them. The various depictions of Kryptonian science in various Superman stories was one inspiration.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte and Audrey',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/John.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#D3ECEC',
        title: 'Haven_gallery_518FunFacts_05.jpg',
        caption: 'This is the first episode in Season 5 in which we’ve lost one of our heroes. It was important to happen as we head into the home stretch of the show and as the stakes in Haven have never been more dire. As a result, it won’t be the last loss we\'ll suffer this season…',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Wild Card',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/doodle/Monica.png',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#2A7C91',
        title: 'Haven_gallery_518FunFacts_06.jpg',
        caption: 'The challenge in Charlotte\'s final confrontation was that the show couldn’t reveal her attacker’s appearance to the audience, so the darkness was necessitated.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    }*/
];
