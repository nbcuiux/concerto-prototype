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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHNjcm9sbFBvc2l0aW9uO1xuXG4vKiBnbG9iYWwgZG9jdW1lbnQsICQqL1xuZnVuY3Rpb24gaGFuZGxlRHJhZ0VudGVyKGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImNvcHlcIjtcblx0Ly9lLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gXCJjb3B5XCI7XG5cdC8vJChcIiNkcm9wWm9uZVwiKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdCQoJyNkcm9wWm9uZS0xJykuYWRkQ2xhc3MoJ21vZGFsJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRyb3Bab25lLTFcIikuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgaGFuZGxlRHJhZ0xlYXZlLCB0cnVlKTtcblxufVxuZnVuY3Rpb24gaGFuZGxlRHJhZ0xlYXZlKGUpIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHQkKFwiI2Ryb3Bab25lLTFcIikucmVtb3ZlQ2xhc3MoJ21vZGFsJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndyYXBwZXJcIikuY2xhc3NMaXN0LnJlbW92ZSgnbG9ja2VkJyk7XG5cbn1cbmZ1bmN0aW9uIGhhbmRsZURyb3AoZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0JChcIiNkcm9wWm9uZS0xXCIpLnJlbW92ZUNsYXNzKCdtb2RhbCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0dmFyIGZpbGVzID0gZS5kYXRhVHJhbnNmZXIuZmlsZXM7XG5cdGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0aGFuZGxlRmlsZXMoZmlsZXMpO1xuXHRcdC8qZm9yICh2YXIgaT0wOyBpPGZpbGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRyZWFkRmlsZShmaWxlc1tpXSkudGhlbihjcmVhdGVGaWxlKTtcblx0XHRcdC8qdmFyIGZpbGUgPSBmaWxlc1tpXTtcblx0XHRcdHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcdFx0cmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7Ki9cblx0XHQvL31cblx0fVxufVxuZnVuY3Rpb24gaGFuZGxlRHJhZ092ZXIoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBoYW5kbGVEcmFnRW50ZXIsIHRydWUpO1xuaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZHJvcFpvbmUtMVwiKSkge2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZHJvcFpvbmUtMVwiKS5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBoYW5kbGVEcmFnTGVhdmUsIHRydWUpO31cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgaGFuZGxlRHJhZ092ZXIsIGZhbHNlKTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBoYW5kbGVEcm9wLCBmYWxzZSk7XG4kKFwiI3NhdmVQcmV2aWV3XCIpLmNsaWNrKGhhbmRsZVNhdmVQcmV2aWV3KTtcbiQoXCIjY2xvc2VQcmV2aWV3XCIpLmNsaWNrKGhhbmRsZUNsb3NlUHJldmlldyk7XG4kKFwiI3VwbG9hZEZpbGVzXCIpLmNsaWNrKGhhbmRsZVVwbG9hZEZpbGVzQ2xpY2spO1xuXG5mdW5jdGlvbiBoYW5kbGVDbG9zZVByZXZpZXcoZSkge1xuXHQkKCcucHInKS5hZGRDbGFzcyhcIndpbGxDbG9zZVwiKTtcblx0JCgnLnByIC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ2ZvY2FsIGxpbmUgZnVsbCByZWN0IHBvaW50Jyk7XG5cdC8vJCgnLmZvY2FsUG9pbnQnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuXHQkKCcuZm9jYWxSZWN0JykucmVtb3ZlQXR0cignc3R5bGUnKTtcblx0JCgnI2ZvY2FsUG9pbnRUb2dnbGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdCQoJyNmb2NhbFJlY3RUb2dnbGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdCQoJy5wdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UgLnB1cnBvc2UtaW1nJykucmVtb3ZlQXR0cignc3R5bGUnKTtcblx0JCgnLmN0IC5maWxlJykuZmluZCgnYnV0dG9uJykuY3NzKCdkaXNwbGF5JywgJycpO1xuXHRlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbCcsICd3aWxsQ2xvc2UnKTtcblx0ZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdCQoJyN3cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ292ZXJmbG93Jyk7XG5cdC8vZGVzZWxlY3RBbGwoKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZVNhdmVQcmV2aWV3KGUpIHtcblxufVxuZnVuY3Rpb24gY2xvc2VFZGl0U2NyZWVuKCkge1xuXHQkKCcucHInKS5hZGRDbGFzcyhcIndpbGxDbG9zZVwiKTtcblx0JCgnLnByIC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ2ZvY2FsIGxpbmUgZnVsbCByZWN0IHBvaW50Jyk7XG5cdC8vJCgnLmZvY2FsUG9pbnQnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuXHQkKCcuZm9jYWxSZWN0JykucmVtb3ZlQXR0cignc3R5bGUnKTtcblx0JCgnI2ZvY2FsUG9pbnRUb2dnbGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdCQoJyNmb2NhbFJlY3RUb2dnbGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdCQoJy5wdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UgLnB1cnBvc2UtaW1nJykucmVtb3ZlQXR0cignc3R5bGUnKTtcblx0JCgnLmN0IC5maWxlJykuZmluZCgnYnV0dG9uJykuY3NzKCdkaXNwbGF5JywgJycpO1xuXHQvL2Rlc2VsZWN0QWxsKCk7XG5cdGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsJywgJ3dpbGxDbG9zZScpO1xuXHRlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0JCgnI3dyYXBwZXInKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3cnKTtcbn1cbmZ1bmN0aW9uIGNsb3NlTW9kYWwoKSB7XG5cdCQoJy5tb2RhbCcpLmFkZENsYXNzKCdoaWRkZW4nKS5yZW1vdmVDbGFzcygnbW9kYWwnKTtcblx0JCgnI3dyYXBwZXInKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3cnKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlVXBsb2FkRmlsZXNDbGljayhlKSB7XG5cdHZhciBmaWxlc0lucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlc0lucHV0XCIpO1xuICAgIGlmICghZmlsZXNJbnB1dCkge1xuICAgIFx0ZmlsZXNJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgZmlsZXNJbnB1dC50eXBlID0gXCJmaWxlXCI7XG4gICAgICAgIGZpbGVzSW5wdXQubXVsdGlwbGUgPSBcInRydWVcIjtcbiAgICAgICAgZmlsZXNJbnB1dC5oaWRkZW4gPSB0cnVlO1xuICAgICAgICBmaWxlc0lucHV0LmFjY2VwdCA9IFwiaW1hZ2UvKiwgYXVkaW8vKiwgdmlkZW8vKlwiO1xuICAgICAgICBmaWxlc0lucHV0LmlkID0gXCJmaWxlc0lucHV0XCI7XG4gICAgICAgIGZpbGVzSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGUudGFyZ2V0LmZpbGVzKTtcbiAgICAgICAgICAgICAgIGhhbmRsZUZpbGVzKGUudGFyZ2V0LmZpbGVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZpbGVzSW5wdXQpO1xuICAgIH1cbiAgICBmaWxlc0lucHV0LmNsaWNrKCk7XG59XG5cbiQoJyNzZWFyY2hGaWVsZCcpLmZvY3VzKGZ1bmN0aW9uKGUpIHtlLnRhcmdldC5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO30pO1xuJCgnI3NlYXJjaEZpZWxkJykuYmx1cihmdW5jdGlvbihlKSB7XG5cdGlmICgkKCcjZmlsdGVyTWVudScpLmhhc0NsYXNzKCdoaWRkZW4nKSkge1xuXHRcdGUudGFyZ2V0LnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdH1cbn0pO1xuXG4vKiQoJy5mbS10b29nbGUnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdHZhciBzZWN0aW9uID0gZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuXHR2YXIgZmlsdGVyTmFtZSA9IHNlY3Rpb24uaWQ7XG5cdHZhclxuXHR2YXIgcXVlcnkgPSAkKCdzZWFyY2hGaWVsZCcpLnZhbCgpO1xuXG59KSovXG4kKCcubG0gbGknKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdCQoJy5sbSBsaScpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG5cdCQoJy5sbSBsaSB1bCcpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG5cblx0JChlLnRhcmdldCkuYWRkQ2xhc3MoJ29wZW4nKTtcblx0JChlLnRhcmdldCkuY2hpbGRyZW4oJ3VsJykuYWRkQ2xhc3MoJ29wZW4nKTtcblxuXHQvKmlmIChzdWJJdGVtcy5sZW5ndGggPiAwKSB7XG5cdFx0JCgnLmxtIGxpJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblxuXHRcdGZvciAodmFyIGk9MDsgaTxzdWJJdGVtcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIHN1Ykl0ZW0gPSBzdWJJdGVtc1tpXTtcblx0XHRcdHN1Ykl0ZW0uY2xhc3NMaXN0LnRvZ2dsZSgnb3BlbicpO1xuXHRcdFx0JChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcblx0XHR9XG5cdH0qL1xufSk7XG4kKCcjbWVudVRvZ2dsZScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0JCgnLmxtJykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcblx0JCgnLmN0JykudG9nZ2xlQ2xhc3MoJ2xvY2tlZCcpO1xufSk7XG4kKCcubG0gPiAuY2xvc2UsIC5sbSA+IC5sb2dvJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHQkKCcubG0nKS50b2dnbGVDbGFzcygnb3BlbicpO1xuXHQkKCcuY3QnKS50b2dnbGVDbGFzcygnbG9ja2VkJyk7XG59KTtcblxuJCgnLmFsLCAuY3QnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdGlmICgkKCcubG0nKS5oYXNDbGFzcygnb3BlbicpKSB7XG5cdFx0JCgnLmxtJykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcblx0XHQkKCcjd3JhcHBlcicpLnJlbW92ZUNsYXNzKCdsb2NrZWQnKTtcblx0fVxufSk7XG5cbi8qJCgnLmFsIC5maWxlJykuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuXHR2YXIgZHVyYXRpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqNTApLzEwLFxuXHRcdGRlbGF5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjE1KS8xMDtcblxuXHRjb25zb2xlLmxvZyhkdXJhdGlvbiwgZGVsYXkpO1xuXHRjb25zb2xlLmxvZyhlbC5jbGFzc0xpc3QpO1xuXHRlbC5zdHlsZS5hbnVtYXRpb25EdXJhdGlvbiA9IGR1cmF0aW9uLnRvU3RyaW5nICsgXCJzXCI7XG5cdGVsLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gZGVsYXkudG9TdHJpbmcgKyBcInNcIjtcbn0pOyovXG5cbiQoJy5wcm9ncmVzc0JhciAubG9hZGVkJykuYW5pbWF0ZSh7d2lkdGg6IFwiMTAwJVwifSxcblx0MjMwMCxcblx0J2xpbmVhcicsXG5cdGZ1bmN0aW9uKCkge3RoaXMucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTt9XG4pO1xuXG5cbi8qIFNlbGVjdCBjb250cm9sICovXG5mdW5jdGlvbiBvcGVuU2VsZWN0KGUpIHtcblx0JChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbn1cbmZ1bmN0aW9uIHNldFNlbGVjdChlKSB7XG5cdHZhciBzZWxlY3QgPSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKSxcblx0XHRpdGVtID0gJChlLnRhcmdldCksXG5cdFx0c3BhblN0cmluZyA9IHNlbGVjdC5jaGlsZHJlbignc3BhbicpLnRleHQoKTtcblxuXHRpZiAoc2VsZWN0Lmhhc0NsYXNzKCdtdWx0aXBsZScpKSB7XG5cdFx0aWYgKGl0ZW0uaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG5cdFx0XHRpdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdHZhciBzZWFyY2hTdHJpbmcgPSBpdGVtVGV4dCArIFwiLCBcIjtcblx0XHRcdHZhciBpbmRleCA9IHNwYW5TdHJpbmcuc2xpY2Uoc3BhblN0cmluZy5zZWFyY2goc2VhcmNoU3RyaW5nKSk7XG5cdFx0XHR2YXIgbmV3U3BhbiA9IHNwYW5TdHJpbmcoKTtcblx0XHR9XG5cdFx0JChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdHZhciBzdHJpbmc7XG5cdFx0c2VsZWN0LmNoaWxkcmVuKCdzcGFuJykudGV4dCgpO1xuXG5cdH0gZWxzZSB7XG5cdFx0c2VsZWN0ID0gZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuXHRcdHZhciBzcGFuID0gc2VsZWN0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzcGFuJylbMF07XG5cdFx0c3Bhbi5pbm5lckhUTUwgPSBlLnRhcmdldC5pbm5lckhUTUw7XG5cdFx0c2VsZWN0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG5cdFx0c2VsZWN0LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcblx0XHR2YXIgaXRlbXMgPSBzZWxlY3QuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJyk7XG5cdFx0Zm9yICh2YXIgaT0wOyBpPGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR9XG5cdFx0ZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdH1cblx0Ly9jb25zb2xlLmxvZyhzZWxlY3QucGFyZW50KCkpO1xuXHRpZiAoJChzZWxlY3QpLnBhcmVudCgpLmhhc0NsYXNzKCdmaWxlLXB1cnBvc2UnKSkge1xuXHRcdGlmICgkKCcuY3QgLmZpbGUuc2VsZWN0ZWQnKS5sZW5ndGggPiAwKSB7XG5cdFx0XHQkKCcuY3QgLmZpbGUuc2VsZWN0ZWQgLnNlbGVjdCcpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0JCgnLmN0IC5maWxlLnNlbGVjdGVkIC5zZWxlY3Qgc3BhbicpLnRleHQoZS50YXJnZXQuaW5uZXJIVE1MKTtcblx0XHRcdGRlc2VsZWN0QWxsKCk7XG5cdFx0fVxuXHR9XG5cdGRhdGFDaGFuZ2VkID0gdHJ1ZTtcbn1cbiQoJy5zZWxlY3QnKS5jbGljayhvcGVuU2VsZWN0KTtcbiQoJy5zZWxlY3QgbGknKS5jbGljayhzZXRTZWxlY3QpO1xuJCgnKicpLm5vdCgnLnNlbGVjdCBsaSwgLnNlbGVjdCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0aWYgKCQoJy5zZWxlY3QnKS5oYXNDbGFzcygnb3BlbicpKSB7XG5cdFx0JCgnLnNlbGVjdCcpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG5cdH1cbn0pO1xuXG4vKiBNdWx0aXNlbGVjdCBjb250cm9sICovXG4kKCcubXVsdGlTZWxlY3QnKS5ub3QoJy50YWcnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcbn0pO1xuJCgnLm11bHRpU2VsZWN0IGxpJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHR2YXIgc2VsZWN0ID0gJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCksXG5cdFx0aXRlbSA9ICQoZS50YXJnZXQpLFxuXHRcdHRhZyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3RhZycpLnRleHQoaXRlbS50ZXh0KCkpLFxuXHRcdHRhZ0RlbGV0ZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3RhZ19fZGVsZXRlJykudGV4dCgn4pyVJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0JChlLnRhcmdldCkucGFyZW50cygnLnRhZycpLnJlbW92ZSgpO1xuXHRcdH0pO1xuXG5cdHRhZy5hcHBlbmQodGFnRGVsZXRlKTtcblx0c2VsZWN0LmFwcGVuZCh0YWcpO1xuXHRzZWxlY3QuY2hpbGRyZW4oJ3NwYW4nKS50ZXh0KCcnKTtcblx0ZGF0YUNoYW5nZWQgPSB0cnVlO1xufSk7XG4kKCcubXVsdGlTZWxlY3QgPiAudGFnJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRlLnRhcmdldC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGUudGFyZ2V0KTtcbn0pO1xuXG4kKCcqJykubm90KCcubXVsdGlTZWxlY3QgbGksIC5tdWx0aVNlbGVjdCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0aWYgKCQoJy5tdWx0aVNlbGVjdCcpLmhhc0NsYXNzKCdvcGVuJykpIHtcblx0XHQkKCcubXVsdGlTZWxlY3QnKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuXHR9XG59KTtcblxuLypCdWxrIFJlbW92ZSAqL1xuJCgnI2J1bGtSZW1vdmUnKS5jbGljayhmdW5jdGlvbigpIHtcblx0JCgnI2RlbGV0ZUZpbGVzJykudG9nZ2xlQ2xhc3MoJ21vZGFsIGhpZGRlbicpO1xuXHQkKCcuY3QgLmZpbGUuc2VsZWN0ZWQnKS5hZGRDbGFzcygnc2JyJyk7XG59KTtcblxuLypDbG9zZSBEZWxldGUgUHJvbXB0ICovXG4kKCcjY2FuY2VsUHJvbXB0JykuY2xpY2soZnVuY3Rpb24gKCkge1xuXHQkKCcjZGVsZXRlRmlsZXMnKS50b2dnbGVDbGFzcygnbW9kYWwgaGlkZGVuJyk7XG5cdGRlc2VsZWN0QWxsKCk7XG59KTtcblxuLyogRGVsZXRlIENvbmZpcm1hdGlvblByb21wdCAqL1xuJCgnI2RlbGV0ZUNvbmYnKS5jbGljayhmdW5jdGlvbiAoKSB7XG5cdCQoJyNkZWxldGVGaWxlcycpLnRvZ2dsZUNsYXNzKCdtb2RhbCBoaWRkZW4nKTtcblxuXHR2YXIgZmlsZXNUb0JlRGVsZXRlZCA9ICQoJy5jdCAuZmlsZXMgLmZpbGUuc2JyJyk7XG5cdGZpbGVzVG9CZURlbGV0ZWQuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuXHRcdHZhciBmaWxlSW5kZXg7XG5cdH0pO1xuXG5cdCQoJy5jdCAuZmlsZS5zYnInKS5kZXRhY2goKTtcblx0ZGVzZWxlY3RBbGwoKTtcblxuXHRpZiAoJCgnI2FsJykpIHtcblx0XHQkKCcuZmlsZSAuc2VjdGlvbicpLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcblx0XHRcdGlmICgkKGVsKS5jaGlsZHJlbignLmZpbGUnKS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0JChlbCkuZGV0YWNoKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0aWYgKCQoJy5maWxlIC5zZWN0aW9uJykubGVuZ3RoID09PSAxKSB7XG5cdFx0XHQkKCcuZmlsZSAuc2VjdGlvbiAuc2VjdGlvbi10aXRsZScpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHR9XG5cdH1cblx0bm9ybWFsaXplSW5kZXgoKTtcbn0pO1xuXG4vKiBCdWxrIFNldCBVc2UgKi9cbiQoJyNidWxrU2V0VXNlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHQkKGUudGFyZ2V0KS50b2dnbGVDbGFzcygnb3BlbicpO1xuXG59KTtcbiQoJyNidWxrU2V0VXNlIGxpJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHQkKCcjYnVsa1NldFVzZScpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG5cdCQoJy5jdCAuZmlsZS5zZWxlY3RlZCAuc2VsZWN0JykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdCQoJy5jdCAuZmlsZS5zZWxlY3RlZCAuc2VsZWN0IHNwYW4nKS50ZXh0KGUudGFyZ2V0LmlubmVySFRNTCk7XG5cdGRlc2VsZWN0QWxsKCk7XG5cbn0pO1xuJCgnKicpLm5vdCgnLmJ1bGtTZWxlY3QsIC5idWxrU2VsZWN0IGxpJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRpZiAoJCgnLmJ1bGtTZWxlY3QnKS5oYXNDbGFzcygnb3BlbicpKSB7XG5cdFx0JCgnLmJ1bGtTZWxlY3QnKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuXHR9XG59KTtcblxuLypGb2NhbCBQb2ludCBFZGl0Ki9cbiQoJyNmb2NhbFBvaW50VG9nZ2xlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG5cdFx0JCgnLnByID4gLnByZXZpZXcnKS5yZW1vdmVDbGFzcygnZm9jYWwgbGluZSBwb2ludCcpO1xuXHRcdCQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRlLnRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcblx0fSBlbHNlIHtcblx0XHQkKCcucHIgPiAucHJldmlldycpLmFkZENsYXNzKCdmb2NhbCBsaW5lIHBvaW50Jyk7XG5cdFx0JCgnLnByID4gLnByZXZpZXcnKS5yZW1vdmVDbGFzcygncmVjdCcpO1xuXHRcdCQoJyNmb2NhbFJlY3RUb2dnbGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0JChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cdFx0c2V0UHVycG9zZVBhZ2luYXRpb24oKTtcblx0fVxufSk7XG5mdW5jdGlvbiBkcmFnU3RvcChlLCB1aSkge1xuXHR2YXIgaW1nID0gJCgnI3ByZXZpZXdJbWcnKSxcblx0XHRpV2lkdGggPSBpbWcud2lkdGgoKSxcblx0XHRpSGVpZ2h0ID0gaW1nLmhlaWdodCgpLFxuXHRcdGlPZmZzZXQgPSBpbWcub2Zmc2V0KCksXG5cblx0XHRwV2lkdGggPSAkKGUudGFyZ2V0KS53aWR0aCgpLFxuXHRcdHBIZWlnaHQgPSAkKGUudGFyZ2V0KS5oZWlnaHQoKSxcblx0XHRwT2Zmc2V0ID0gJChlLnRhcmdldCkub2Zmc2V0KCksXG5cblx0XHRmVG9wID0gTWF0aC5yb3VuZCgocE9mZnNldC50b3AgLSBpT2Zmc2V0LnRvcCArIHBIZWlnaHQvMikqMTAwIC8gaUhlaWdodCk7XG5cdFx0ZkxlZnQgPSBNYXRoLnJvdW5kKChwT2Zmc2V0LmxlZnQgLSBpT2Zmc2V0LmxlZnQgKyBwV2lkdGgvMikgKiAxMDAgLyBpV2lkdGgpO1xuXG5cdC8vY29uc29sZS5sb2coZlRvcCwgZkxlZnQpO1xuXHQkKCcucHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlIC5wdXJwb3NlLWltZycpLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbicsIGZMZWZ0LnRvU3RyaW5nKCkgKyAnJSAnICsgZlRvcC50b1N0cmluZygpICsgJyUnKTtcblx0ZGF0YUNoYW5nZWQgPSB0cnVlO1xufVxuXG4vKlByZXZpZXdzIHNjcm9sbCAqL1xuJCgnI3Njcm9sbExlZnQnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdCQoJyNwdXJwb3NlV3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogJy09NDYwJyB9LCA4MDApO1xufSk7XG4kKCcjc2Nyb2xsUmlnaHQnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdCQoJyNwdXJwb3NlV3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogJys9NDYwJyB9LCA4MDApO1xufSk7XG5cblxuLyogSGFuZGxlIFB1cnBvc2VzIHNjcm9sbCAqL1xuJCgnI3B1cnBvc2VXcmFwcGVyJykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuXHRzZXRQdXJwb3NlUGFnaW5hdGlvbigpO1xufSk7XG4vKiBJbml0IFB1cnBvc2UgUGFnaW5hdG9yICovXG5cbmZ1bmN0aW9uIHNldFB1cnBvc2VQYWdpbmF0aW9uKCkge1xuXHR2YXIgc2Nyb2xsT2Zmc2V0ID0gJCgnI3B1cnBvc2VXcmFwcGVyJykuc2Nyb2xsTGVmdCgpO1xuXHR2YXIgd2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHVycG9zZVdyYXBwZXInKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcblx0dmFyIGZpcnN0SW5kZXggPSBNYXRoLmZsb29yKHNjcm9sbE9mZnNldC8xNDApICsgMTtcblx0dmFyIGxhc3RJbmRleCA9IGZpcnN0SW5kZXggKyBNYXRoLnJvdW5kKHdpZHRoLzE0MCkgLSAxO1xuXHR2YXIgY291bnQgPSAkKCcjcHVycG9zZVdyYXBwZXIgLnB1cnBvc2UnKS5sZW5ndGg7XG5cblx0bGFzdEluZGV4ID0gbGFzdEluZGV4IDwgY291bnQgPyBsYXN0SW5kZXggOiBjb3VudDtcblxuXHQkKCcjcC1wYWdpbmF0b3InKS50ZXh0KGZpcnN0SW5kZXggKyAnIOKAlCAnICsgbGFzdEluZGV4ICsgJyBvZiAnICsgY291bnQpO1xufVxuXG4vKiBTZWFyY2hmaWVsZCBmaWx0ZXIgKi9cbiQoJy5maWx0ZXJJY29uJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR2YXIgc2VhcmNoRmllbGQgPSAkKGUudGFyZ2V0KS5wYXJlbnQoKTtcblx0c2VhcmNoRmllbGQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRzZWFyY2hGaWVsZC5jaGlsZHJlbignLmZpbHRlcicpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG59KTtcbiQoJyonKS5ub3QoJy5zZWFyY2hGaWVsZCwgc2VhcmNoRmllbGQgPiBpbnB1dCwgLmZpbHRlciwgLmZpbHRlciA+IC5zZWN0aW9uLCAuZmlsdGVyID4gLnNlY3Rpb24tdGl0bGUsIC5maWx0ZXIgPiAuc2VjdGlvbi1vcHRpb25zLCAuZmlsdGVyIC50b2dnbGUsIC5maWx0ZXIgbGFiZWwsIC5maWx0ZXJJY29uJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdGlmICghZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b2dnbGUnKSAmJiAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b2dnbGUtbGFiZWwnKSAmJiBlLnRhcmdldC5pZCAhPT0gJ3NlYXJjaEZpZWxkJykge1xuXHRcdCQoJy5zZWFyY2hGaWVsZCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHQkKCcuZmlsdGVyJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0fVxufSk7XG5cbi8qIENsb3NlIE1vZGFsIFdpbmRvdyAqL1xuJCgnLm1vZGFsJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHQvL2UudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3dpbGxDbG9zZScpO1xuXHRlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbCcsICd3aWxsQ2xvc2UnKTtcblx0ZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdCQoJyN3cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ292ZXJmbG93Jyk7XG59KTtcbiQoJy5tb2RhbCA+IC5jbG9zZScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0Ly9lLnRhcmdldC5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3dpbGxDbG9zZScpO1xuXHRlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbCcsICd3aWxsQ2xvc2UnKTtcblx0ZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdCQoJyN3cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ292ZXJmbG93Jyk7XG59KTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgZnVuY3Rpb24gKGUpIHtcblx0aWYgKGUuYW5pbWF0aW9uTmFtZSA9PSBcIm1vZGFsLWZhZGUtb3V0XCIgJiYgZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbCcpKSB7XG5cdFx0ZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwnLCAnd2lsbENsb3NlJyk7XG5cdFx0ZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0JCgnI3dyYXBwZXInKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3cnKTtcblx0fVxufSk7XG5cbi8qQWRkYWJsZSBmaWVsZCAqL1xuJCgnLmFkZGFibGVGaWVsZCA+IC5hZGQnKS5jbGljayhhZGRGaWxlZCk7XG4kKCcuYWRkYWJsZUZpZWxkID4gLnJlbW92ZScpLmNsaWNrKHJlbW92ZUZpZWxkKTtcbmZ1bmN0aW9uIGFkZEZpbGVkKGUpIHtcblx0dmFyIGFkZGFibGVGaWVsZCA9IGUudGFyZ2V0LnBhcmVudE5vZGU7XG5cdGFkZGFibGVGaWVsZC5jbGFzc0xpc3QuYWRkKCdtdWx0aXBsZScpO1xuXHR2YXIgbmV3RmllbGQgPSBhZGRhYmxlRmllbGQuY2xvbmVOb2RlKHRydWUpO1xuXHRuZXdGaWVsZC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW5wdXQnKVswXS52YWx1ZSA9ICcnO1xuXHRhZGRhYmxlRmllbGQucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChuZXdGaWVsZCk7XG5cdCQobmV3RmllbGQpLmNoaWxkcmVuKCcuYWRkJykuY2xpY2soYWRkRmlsZWQpO1xuXHQkKG5ld0ZpZWxkKS5jaGlsZHJlbignLnJlbW92ZScpLmNsaWNrKHJlbW92ZUZpZWxkKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZUZpZWxkKGUpIHtcblx0dmFyIHNlY3Rpb24gPSBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG5cdHNlY3Rpb24ucmVtb3ZlQ2hpbGQoZS50YXJnZXQucGFyZW50Tm9kZSk7XG5cdHZhciBzZWN0aW9uRmllbGRzID0gc2VjdGlvbi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhZGRhYmxlRmllbGQnKTtcblx0aWYgKHNlY3Rpb25GaWVsZHMubGVuZ3RoIDw9IDEpIHtcblx0XHRzZWN0aW9uRmllbGRzWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ211bHRpcGxlJyk7XG5cdH1cbn1cblxuJCgnLnRhYnMgLm5hdiBsaScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0dmFyIHRhYklkID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YWInKTtcblx0JCgnLnRhYnMgLm5hdiBsaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0JChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHQkKGUudGFyZ2V0KS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuXHQkKCcudGFicyAubmF2ID4gLm1vYmlsZU5hdicpLnRleHQoJChlLnRhcmdldCkudGV4dCgpLnJlcGxhY2UoL1xcZC9nLCAnJykpO1xuXHQkKCcudGFiJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHQkKHRhYklkKS5hZGRDbGFzcygnYWN0aXZlJyk7XG59KTtcbiQoJy50YWJzIC5uYXYgPiAubW9iaWxlTmF2JykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHQkKGUudGFyZ2V0KS5wYXJlbnQoKS5jaGlsZHJlbigndWwnKS50b2dnbGVDbGFzcygnb3BlbicpO1xufSk7XG5cbi8qIFJhZGlvIFRvZ2dsZSAqL1xuJCgnLnJhZGlvVG9nZ2xlIGxpJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHQkKGUudGFyZ2V0KS5wYXJlbnQoKS5jaGlsZHJlbignLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0JChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRpZiAoZS50YXJnZXQuaW5uZXJIVE1MID09PSBcIldlYiBTZXJpZXNcIikge1xuXHRcdCQoJyNyZWctc2MtZHVyYXRpb24sICNwcm9nLXRpbWVmcmFtZScpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0fSBlbHNlIGlmIChlLnRhcmdldC5pbm5lckhUTUwgPT09IFwiVFYgU2VyaWVzXCIpIHtcblx0XHQkKCcjcmVnLXNjLWR1cmF0aW9uLCAjcHJvZy10aW1lZnJhbWUnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdH1cbn0pO1xuXG4vKkF1dG8gcmVzaXplIHRleHQgYXJlYSAqL1xuLy9hdXRvc2l6ZSgkKCd0ZXh0YXJlYScpKTtcbi8vYXV0b3NpemUudXBkYXRlKCQoJ3RleHRhcmVhJykpO1xuXG4vKiBEYXNoYm9hcmQgKi9cbiQoJy5zaG9ydGN1dHMnKS5zb3J0YWJsZSh7XG5cdHBsYWNlaG9sZGVyOiAncGxhY2Vob2xkZXInXG59KTtcbiQoJy5zaG9ydGN1dHMnKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cbiQoJyNkYXNoJykuc29ydGFibGUoe1xuXG59KTtcbiQoJyNkYXNoJykuZGlzYWJsZVNlbGVjdGlvbigpO1xuXG4kKCcuc2V0JykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHQkKGUudGFyZ2V0KS50b2dnbGVDbGFzcygnb3BlbicpO1xufSk7XG5cbiQoJy5wYW5uZWwgLnNob3J0Y3V0JykuZHJhZ2dhYmxlKHtcblx0Y29ubmVjdFRvU29ydGFibGU6ICcuc2hvcnRjdXRzJyxcblx0c3RvcDogZnVuY3Rpb24oIGUsIHVpICkge2UudGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO31cbn0pO1xuLyokKCBcIi5zaG9ydGN1dFwiICkub24oIFwic29ydHN0b3BcIiwgZnVuY3Rpb24oIGV2ZW50LCB1aSApIHtcblx0ZS50YXJnZXQucmVtb3ZlQXR0cignc3R5bGUnKTtcbn0pOyovXG5cbiQoJyonKS5ub3QoJy5wYW5uZWwsIC5wYW5uZWwgPiAuc2hvcnRjdXQsIC5zZXQnKS5jbGljayhmdW5jdGlvbigpIHtcblx0Ly9pZiAoISQoZS50YXJnZXQpLmhhc0NsYXNzKCdzZXQnKSkge1xuXHRcdCQoJy5zZXQnKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuXHQvL31cblxufSk7XG5cbi8qIFByb21wdHMgKi9cbiQoJyNyZW1vdmVEcmFmdCcpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHQkKCcjcmVtb3ZlRHJhZnRQcm9tcHQnKS50b2dnbGVDbGFzcygnbW9kYWwgaGlkZGVuJyk7XG59KTtcbiQoJyNyZW1vdmVEcmFmdFByb21wdCAuYnV0dG9uJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdCQoJyNyZW1vdmVEcmFmdFByb21wdCcpLnRvZ2dsZUNsYXNzKCdtb2RhbCBoaWRkZW4nKTtcbn0pO1xuXG4kKCcjcHVibGlzaERyYWZ0JykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdCQoJyNwdWJsaXNoRHJhZnRQcm9tcHQnKS50b2dnbGVDbGFzcygnbW9kYWwgaGlkZGVuJyk7XG59KTtcbiQoJyNwdWJsaXNoRHJhZnRQcm9tcHQgLmJ1dHRvbicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHQkKCcjcHVibGlzaERyYWZ0UHJvbXB0JykudG9nZ2xlQ2xhc3MoJ21vZGFsIGhpZGRlbicpO1xufSk7XG5cblxuXG4kKCcjY2FuY2VsQ2hhbmdlc1Byb21wdCAuYnV0dG9uLmNhbmNlbCcpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHQkKCcjY2FuY2VsQ2hhbmdlc1Byb21wdCcpLnRvZ2dsZUNsYXNzKCdtb2RhbCBoaWRkZW4nKTtcbn0pO1xuJCgnI2NhbmNlbENoYW5nZXNQcm9tcHQgLmJ1dHRvbi5vaycpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHQkKCcjY2FuY2VsQ2hhbmdlc1Byb21wdCcpLnRvZ2dsZUNsYXNzKCdtb2RhbCBoaWRkZW4nKTtcblx0Y2xvc2VFZGl0U2NyZWVuKCk7XG59KTtcblxuXG4vKkV2ZW5ndCB0eXBlICovXG4kKCcjZXZlbnQtdHlwZSBsaScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0aWYgKGUudGFyZ2V0LmlubmVySFRNTCA9PT0gXCJNb3ZpZVwiKSB7XG5cdFx0JCgnI3JlbGVhc2UteWVhciwgI2NoYW5uZWwtb3JpZ2luYWwsICNhaXItdGltZXMnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdH0gZWxzZSB7XG5cdFx0JCgnI3JlbGVhc2UteWVhciwgI2NoYW5uZWwtb3JpZ2luYWwsICNhaXItdGltZXMnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdH1cbn0pO1xuXG4vKiBEYXRhcGlja2VyICovXG4kKCcuZGF0YXBpY2tlcicpLmRhdGVwaWNrZXIoKTtcbiQoJy5jdCAuc2VjdGlvbi1maWxlcycpLnNvcnRhYmxlKHtcblx0cGxhY2Vob2xkZXI6ICdmaWxlX19wbGFjZWhvbGRlcicsXG5cdGN1cnNvcjogJy13ZWJraXQtZ3JhYmJpbmcnLFxuXHRoZWxwZXI6ICdjbG9uZScsXG5cdG9wYWNpdHk6IDAuNVxufSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUFMRWxlbWVudChmaWxlRGF0YSkge1xuXG4gICAgLy9jcmVhdGUgYmFzaWMgZWxlbWVudFxuICAgIHZhciBmaWxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZSBmaWxlX3ZpZXdfbW9kYWwgZmlsZV90eXBlX2ltZycpLFxuICAgICAgICBmaWxlSW5kZXggPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdoaWRkZW4gZmlsZV9faWQnKS50ZXh0KGZpbGVEYXRhLmlkKSxcblxuICAgICAgICBmaWxlSW1nID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9faW1nJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgZmlsZURhdGEudXJsICsgJyknKSxcbiAgICAgICAgZmlsZUNvbnRyb2xzID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fY29udHJvbHMnKS5jbGljayh0b2dnbGVGaWxlU2VsZWN0KSxcbiAgICAgICAgZmlsZUNoZWNrbWFyayA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2NoZWNrbWFyaycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuICAgICAgICBmaWxlVHlwZSA9ICQoJzxkaXY+PGkgY2xhc3M9XCJmYSBmYS1jYW1lcmFcIj48L2k+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3R5cGUnKSxcblxuICAgICAgICBmaWxlVGl0bGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190aXRsZScpLnRleHQoZmlsZURhdGEudGl0bGUpO1xuXG4gICAgZmlsZUNvbnRyb2xzLmFwcGVuZChmaWxlQ2hlY2ttYXJrLCBmaWxlVHlwZSk7XG4gICAgZmlsZUltZy5hcHBlbmQoZmlsZUNvbnRyb2xzKTtcblxuICAgIGZpbGUuYXBwZW5kKGZpbGVJbmRleCwgZmlsZUltZywgZmlsZVRpdGxlKTtcbiAgICByZXR1cm4gZmlsZTtcbn1cblxuZnVuY3Rpb24gYWRkQWxFbGVtZW50KGZpbGUpIHtcbiAgICB2YXIgZmlsZVNlY3Rpb24gPSAkKCcuYWwgLmZpbGVzIC5zZWN0aW9uLWZpbGVzJyk7XG4gICAgZmlsZVNlY3Rpb24ucHJlcGVuZChmaWxlKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUFMKCkge1xuICAgICQoJy5hbCAuZmlsZXMgLnNlY3Rpb24tZmlsZXMnKS5lbXB0eSgpO1xuICAgIGFzc2V0TGlicmFyeU9iamVjdHMuZm9yRWFjaChmdW5jdGlvbihmLCBpKSB7XG4gICAgICAgIGFkZEFsRWxlbWVudChjcmVhdGVBTEVsZW1lbnQoZiwgaSkpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTZWxlY3RlZEZpbGVzKCkge1xuICAgIHZhciBzZWxlY3RlZEZpbGVzID0gJCgnLmFsIC5maWxlcyAuc2VjdGlvbi1maWxlcyAuZmlsZS5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBzZWxlY3RlZEZpbGVzLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICAgICAgIHZhciBmaWxlSWQgPSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgZmlsZSA9IGFzc2V0TGlicmFyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGYuaWQgPT09IGZpbGVJZDtcbiAgICAgICAgICAgICAgICB9KVswXTtcbiAgICAgICAgICAgIGlmICghZmlsZUJ5SWQoZ2FsbGVyeU9iamVjdHMsIGZpbGVJZCkpIHtcbiAgICAgICAgICAgICAgICBnYWxsZXJ5T2JqZWN0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZURhdGE6IGZpbGUsXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IDEwMDAsXG4gICAgICAgICAgICAgICAgICAgIGNhcHRpb246ICcnLFxuICAgICAgICAgICAgICAgICAgICBnYWxsZXJ5Q2FwdGlvbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGp1c3RVcGxvYWRlZDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICAgICAgdXBkYXRlR2FsbGVyeShnYWxsZXJ5T2JqZWN0cy5sZW5ndGgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2xvc2VBc3NldExpYnJhcnkoKSB7XG4gICAgbGFzdFNlbGVjdGVkID0gbnVsbDtcbiAgICAkKCcuYWwgLmZpbGVzIC5zZWN0aW9uLWZpbGVzIC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgZGVzZWxlY3RBbGwoKTtcbiAgICAkKCcubW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJykucmVtb3ZlQ2xhc3MoJ21vZGFsJyk7XG4gICAgJCgnI3dyYXBwZXInKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3cnKTtcbn1cblxuLy8gQ3JlYXRlIERPTSBlbGVtZW50IGZvciBGaWxlIGZyb20gZGF0YVxuZnVuY3Rpb24gY3JlYXRlRmlsZUVsZW1lbnQoZikge1xuICAgIHZhciBmaWxlRGF0YSA9IGYuZmlsZURhdGE7XG4gICAgLy9jcmVhdGUgYmFzaWMgZWxlbWVudFxuICAgIHZhciBmaWxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZSBmaWxlX3R5cGVfaW1nJyksXG4gICAgICAgIGZpbGVJbmRleCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2hpZGRlbiBmaWxlX19pZCcpLnRleHQoZmlsZURhdGEuaWQpLFxuXG4gICAgICAgIGZpbGVBcnJhZ2VtZW50ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fYXJyYWdlbWVudCcpLFxuICAgICAgICBmaWxlQXJyYWdlbWVudElucHV0ID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgLz4nKS5hZGRDbGFzcygnZmlsZV9fYXJhZ2VtZW50LWlucHV0Jykub24oJ2NoYW5nZScsIGhhbmRsZUluZGV4RmllbGRDaGFuZ2UpLFxuICAgICAgICBmaWxlQXJyYWdlbWVudFNldHRpbmdzID0gJCgnPGRpdj48aSBjbGFzcz1cImZhIGZhLWVsbGlwc2lzLXZcIj48L2k+PC9kaXY+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnZmlsZV9fYXJhZ2VtZW50LXNldHRpbmdzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jbGljayhzaG93UmVhcnJhbmdlTWVudSksXG5cbiAgICAgICAgZmlsZUltZyA9ICQoJzxkaXY+PC9kaXY+JylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdmaWxlX19pbWcnKVxuICAgICAgICAgICAgICAgICAgICAuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgZmlsZURhdGEudXJsICsgJyknKSxcbiAgICAgICAgZmlsZUNvbnRyb2xzID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fY29udHJvbHMnKS5jbGljayh0b2dnbGVGaWxlU2VsZWN0KSxcbiAgICAgICAgZmlsZUNoZWNrbWFyayA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2NoZWNrbWFyaycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuICAgICAgICBmaWxlRGVsZXRlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fZGVsZXRlJykuY2xpY2soZGVsZXRlRmlsZSksXG4gICAgICAgIGZpbGVUeXBlID0gJCgnPGRpdj48aSBjbGFzcz1cImZhIGZhLWNhbWVyYVwiPjwvaT48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdHlwZScpLFxuICAgICAgICBmaWxlRWRpdCA9ICQoJzxidXR0b24+RWRpdDwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24gd2hpdGVPdXRsaW5lJykuY2xpY2soaGFuZGxlRmlsZWRFZGl0QnV0dG9uQ2xpY2spLFxuXG4gICAgICAgIGZpbGVUaXRsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3RpdGxlJykudGV4dChmaWxlRGF0YS50aXRsZSksXG5cbiAgICAgICAgZmlsZUNhcHRpb24gPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19jYXB0aW9uJyksXG4gICAgICAgIGZpbGVDYXB0aW9uVGl0bGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19jYXB0aW9uLXRpdGxlJykudGV4dCgnR2FsbGVyeSBjYXB0aW9uJyksXG4gICAgICAgIGZpbGVDYXB0aW9uVGV4dGFyZWEgPSAkKCc8dGV4dGFyZWE+PC90ZXh0YXJlYT4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2ZpbGVfX2NhcHRpb24tdGV4dGFyZWEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudmFsKGYuY2FwdGlvbiA/IGYuY2FwdGlvbiA6IGZpbGVEYXRhLmNhcHRpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbignYmx1ciBpbnB1dCcsIGhhbmRsZUNhcHRpb25FZGl0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2ZvY3VzJywgaGFuZGxlQ2FwdGlvblN0YXJ0RWRpdGluZyksXG5cbiAgICAgICAgZmlsZUNhcHRpb25Ub2dnbGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19jYXB0aW9uLXRvZ2dsZScpLFxuICAgICAgICBmaWxlQ2FwdGlvblRvZ2dsZV9Ub2dnbGUgPSAkKCc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgLz4nKS5hZGRDbGFzcygndG9nZ2xlIHN3aXRjaCcpLmNsaWNrKGhhbmRsZUNhcHRpb25Ub2dnbGVDbGljaykucHJvcCgnY2hlY2tlZCcsIGZ1bmN0aW9uKCkge3JldHVybiBmLmNhcHRpb24/IGZhbHNlIDogdHJ1ZTt9KSxcbiAgICAgICAgZmlsZUNhcHRpb25Ub2dnbGVfTGFiZWwgPSAkKCc8bGFiZWw+S2VlcCBtZXRhZGF0YSBjYXB0aW9uPC9sYWJlbD4nKSxcblxuICAgICAgICBmaWxlRWRpdEJ1dHRvbiA9ICQoJzxidXR0b24+RWRpdDwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24gZ3JheU91dGxpbmUnKS5jbGljayhoYW5kbGVGaWxlZEVkaXRCdXR0b25DbGljayk7XG5cbiAgICBpZiAoIWZpbGVEYXRhLmNhcHRpb24pIHtcbiAgICAgICAgZmlsZUNhcHRpb25Ub2dnbGUuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAgIGZpbGVDYXB0aW9uVG9nZ2xlX1RvZ2dsZS5wcm9wKCdjaGVja2VkJywgZmFsc2UpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKGZpbGVDYXB0aW9uVGV4dGFyZWEudmFsKCkpIHtcbiAgICAgICAgICAgIGZpbGVDYXB0aW9uVGV4dGFyZWEuYXR0cigncGxhY2Vob2xkZXInLCAnRG9uXFwndCBoYXZlIG1ldGFkYXRhIGNhcHRpb24nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbGVBcnJhZ2VtZW50LmFwcGVuZChmaWxlQXJyYWdlbWVudElucHV0LCBmaWxlQXJyYWdlbWVudFNldHRpbmdzKTtcblxuICAgIGZpbGVDb250cm9scy5hcHBlbmQoZmlsZUNoZWNrbWFyaywgZmlsZURlbGV0ZSwgZmlsZVR5cGUsIGZpbGVFZGl0KTtcbiAgICBmaWxlSW1nLmFwcGVuZChmaWxlQ29udHJvbHMpO1xuXG4gICAgZmlsZUNhcHRpb25Ub2dnbGUuYXBwZW5kKGZpbGVDYXB0aW9uVG9nZ2xlX1RvZ2dsZSwgZmlsZUNhcHRpb25Ub2dnbGVfTGFiZWwpO1xuICAgIGZpbGVDYXB0aW9uLmFwcGVuZChmaWxlQ2FwdGlvblRpdGxlLCBmaWxlQ2FwdGlvblRleHRhcmVhLCBmaWxlQ2FwdGlvblRvZ2dsZSwgZmlsZUVkaXRCdXR0b24pO1xuXG4gICAgZmlsZS5hcHBlbmQoZmlsZUluZGV4LCBmaWxlQXJyYWdlbWVudCwgZmlsZUltZywgZmlsZVRpdGxlLCBmaWxlQ2FwdGlvbik7XG5cbiAgICAvKmlmIChvcHRpb24pIHtcbiAgICAgICAgdmFyIGZpbGVDYXB0aW9ucyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2NhcHRpb25zJyksXG4gICAgICAgICAgICBvcmlnaW5hbENhcHRpb24gPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19jYXB0aW9uIGZpbGVfX2NhcHRpb25fb3JpZ2luYWwnKSxcbiAgICAgICAgICAgIG9yaWdpbmFsQ2FwdGlvbl9UaXRsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2NhcHRpb24tdGl0bGUnKS50ZXh0KCdPcmlnaW5hbCBjYXB0aW9uJyksXG4gICAgICAgICAgICBvcmlnaW5hbENhcHRpb25fQ2FwdGlvbiA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2NhcHRpb24tdGV4dCcpLnRleHQoZmlsZURhdGEuY2FwdGlvbiksXG5cbiAgICAgICAgICAgIGdhbGxlcnlDYXB0aW9uX1RpdGxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fY2FwdGlvbi10aXRsZScpLnRleHQoJ0NhcHRpb24gZm9yIEdhbGxlcnknKTtcblxuICAgICAgICBmaWxlQ2FwdGlvblRvZ2dsZV9Ub2dnbGUucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgb3JpZ2luYWxDYXB0aW9uLmFwcGVuZChvcmlnaW5hbENhcHRpb25fVGl0bGUsIG9yaWdpbmFsQ2FwdGlvbl9DYXB0aW9uKTtcbiAgICAgICAgZmlsZUNhcHRpb24uZW1wdHkoKS5hcHBlbmQoZmlsZUNhcHRpb25Ub2dnbGUsIGdhbGxlcnlDYXB0aW9uX1RpdGxlLCBmaWxlQ2FwdGlvblRleHRhcmVhKTtcbiAgICAgICAgZmlsZUNhcHRpb25zLmFwcGVuZChvcmlnaW5hbENhcHRpb24sIGZpbGVDYXB0aW9uKTtcblxuICAgICAgICBmaWxlLmFwcGVuZChmaWxlQ2FwdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGUuYXBwZW5kKGZpbGVDYXB0aW9uKTtcbiAgICB9Ki9cbiAgICAvL2ZpbGUuYXBwZW5kKGZpbGVFZGl0QnV0dG9uKTtcblxuICAgIHJldHVybiBmaWxlO1xufVxuXG5mdW5jdGlvbiBhZGRGaWxlKGZpbGUpIHtcbiAgICB2YXIgZmlsZVNlY3Rpb24gPSAkKCcuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzJyk7XG5cbiAgICBpZiAoZmlsZVNlY3Rpb24uaGFzQ2xhc3MoJ3NlY3Rpb25fX2ZpbGVzX3ZpZXdfZ3JpZCcpKSB7XG4gICAgICAgIGZpbGUuYWRkQ2xhc3MoJ2ZpbGVfdmlld19ncmlkJyk7XG4gICAgfVxuICAgIGlmIChmaWxlU2VjdGlvbi5oYXNDbGFzcygnc2VjdGlvbl9fZmlsZXNfdmlld19saXN0JykpIHtcbiAgICAgICAgZmlsZS5hZGRDbGFzcygnZmlsZV92aWV3X2xpc3QnKTtcbiAgICB9XG4gICAgZmlsZVNlY3Rpb24uYXBwZW5kKGZpbGUpO1xuICAgIC8qaWYgKGluZGV4KSB7XG4gICAgICAgIGZpbGUuZGV0YWNoKCkuaW5zZXJ0QmVmb3JlKGZpbGVTZWN0aW9uLmZpbmQoJy5maWxlJykuZXEoaW5kZXgpKTtcbiAgICB9Ki9cblxuICAgIG5vcm1hbGl6ZUluZGV4KCk7XG59XG5cblxuZnVuY3Rpb24gc2V0R3JpZFZpZXcoZSkge1xuICAgICQoZS50YXJnZXQpLnBhcmVudCgpLmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICQoJy5maWxlcyAuc2VjdGlvbl9fZmlsZXMnKVxuICAgICAgICAuYWRkQ2xhc3MoJ3NlY3Rpb25fX2ZpbGVzX3ZpZXdfZ3JpZCcpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnc2VjdGlvbl9fZmlsZXNfdmlld19saXN0Jyk7XG5cbiAgICAkKCcuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlJylcbiAgICAgICAgLmFkZENsYXNzKCdmaWxlX3ZpZXdfZ3JpZCcpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnZmlsZV92aWV3X2xpc3QnKTtcbn1cbmZ1bmN0aW9uIHNldExpc3RWaWV3KGUpIHtcbiAgICAkKGUudGFyZ2V0KS5wYXJlbnQoKS5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICBjb25zb2xlLmxvZygkKCcuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzJykpO1xuICAgICQoJy5maWxlcyAuc2VjdGlvbl9fZmlsZXMnKVxuICAgICAgICAuYWRkQ2xhc3MoJ3NlY3Rpb25fX2ZpbGVzX3ZpZXdfbGlzdCcpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnc2VjdGlvbl9fZmlsZXNfdmlld19ncmlkJyk7XG5cbiAgICAkKCcuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlJylcbiAgICAgICAgLmFkZENsYXNzKCdmaWxlX3ZpZXdfbGlzdCcpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnZmlsZV92aWV3X2dyaWQnKTtcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZUFzc2V0c0NvdW50KCkge1xuICAgICQoJyNhc3NldHMtY291bnQnKS50ZXh0KGdhbGxlcnlPYmplY3RzLmxlbmd0aCA/IGdhbGxlcnlPYmplY3RzLmxlbmd0aCArICcgQXNzZXRzIHRvdGFsJyA6ICcnKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlR2FsbGVyeSgpIHtcbiAgICB2YXIganVzdFVwbG9hZGVkID0gZmFsc2UsIHNjcm9sbEluZGV4ID0gMDtcblxuICAgIC8vIFJlbWVtYmVyIHBvc2l0aW9uIGFuZCBzZWxlY3Rpb24gb2YgZmlsZXNcbiAgICAkKCcuY3QgLmZpbGVzIC5maWxlJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgdmFyIGZpbGUgPSBnYWxsZXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuICAgICAgICAgICAgcmV0dXJuIGYuZmlsZURhdGEuaWQgPT09ICQoZWwpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcbiAgICAgICAgfSlbMF07XG4gICAgICAgIGZpbGUucG9zaXRpb24gPSBpbmRleDtcbiAgICAgICAgZmlsZS5zZWxlY3RlZCA9ICQoZWwpLmhhc0NsYXNzKCdzZWxlY3RlZCcpO1xuICAgIH0pO1xuXG4gICAgLy9DbGVhciBmaWxlcyBzZWN0aW9uXG4gICAgJCgnLmZpbGVzIC5zZWN0aW9uX19maWxlcycpLmVtcHR5KCk7XG5cbiAgICAvL1NvcnQgYXJyYXkgYWNvcmRpbmcgZmlsZXMgcG9zaXRpb25cbiAgICBnYWxsZXJ5T2JqZWN0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEucG9zaXRpb24gLSBiLnBvc2l0aW9uO1xuICAgIH0pO1xuXG4gICAgLy9DcmVhdGUgZmlsZXMgZnJvbSBkYXRhIGFuZCBhZGQgdGhlbSB0byB0aGUgcGFnZVxuICAgIGZvciAodmFyIGkgPSAwOyBpPGdhbGxlcnlPYmplY3RzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICB2YXIgZiA9IGdhbGxlcnlPYmplY3RzW2ldLFxuICAgICAgICAgICAgZmlsZSA9IGNyZWF0ZUZpbGVFbGVtZW50KGYpO1xuXG4gICAgICAgIGlmIChmLnNlbGVjdGVkKSB7ZmlsZS5hZGRDbGFzcygnc2VsZWN0ZWQnKTt9XG4gICAgICAgIGlmIChmLmp1c3RVcGxvYWRlZCkge1xuICAgICAgICAgICAgZmlsZS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgIGYuanVzdFVwbG9hZGVkID0gZmFsc2U7XG4gICAgICAgICAgICBqdXN0VXBsb2FkZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGFkZEZpbGUoZmlsZSk7XG4gICAgfVxuXG4gICAgbm9ybWFsaXplU2VsZWN0ZWlvbigpO1xuICAgIG5vcm1hbGl6ZUFzc2V0c0NvdW50KCk7XG4gICAgbm9ybWFsaXplSW5kZXgoKTtcblxuICAgIGlmIChqdXN0VXBsb2FkZWQpIHtlZGl0RmlsZXMoJCgnLmN0IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpKTt9XG4gICAgaWYgKHNjcm9sbEluZGV4KSB7XG4gICAgICAgIHZhciBzY3JvbGxUb3AgPSAkKCcuY3QgLmZpbGVzIC5maWxlJykubGFzdCgpLm9mZnNldCgpLnRvcDtcbiAgICAgICAgY29uc29sZS5sb2coc2Nyb2xsVG9wKTtcbiAgICAgICAgJCgnLmN0JykuYW5pbWF0ZSh7XG4gICAgICAgICAgICBzY3JvbGxUb3A6IHNjcm9sbFRvcFxuICAgICAgICB9LCA0MDApO1xuICAgIH1cbn1cblxudmFyIGVkaXRlZEZpbGVzRGF0YSA9IFtdLFxuICAgIGVkaXRlZEZpbGVEYXRhID0ge30sXG4gICAgY2xhc3NMaXN0ID0gW10sXG4gICAgZGF0YUNoYW5nZWQgPSBmYWxzZSwgLy9DaGFuZ2VzIHdoZW4gdXNlciBtYWtlIGFueSBjaGFuZ2VzIG9uIGVkaXQgc2NyZWVuO1xuICAgIGxhc3RTZWxlY3RlZCA9IG51bGw7IC8vSW5kZXggb2YgbGFzdCBTZWxlY3RlZCBlbGVtZW50IGZvciBtdWx0aSBzZWxlY3Q7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIHZhciBkcmFnZ2FibGVJbWFnZXM7XG5cbiAgICB1cGRhdGVHYWxsZXJ5KCk7XG4gICAgdXBkYXRlQUwoKTtcblxuICAgICQoJy5jdCAuc2VjdGlvbl9fZmlsZXMnKS5zb3J0YWJsZSh7XG4gICAgXHRwbGFjZWhvbGRlcjogJ2ltZ19fcGxhY2Vob2xkZXInLFxuICAgIFx0Y3Vyc29yOiAnLXdlYmtpdC1ncmFiYmluZycsXG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbihlLCB1aSkge1xuICAgICAgICAgICAgdmFyIHNlbGVjdGVkSW1hZ2VzID0gJCgnLmN0IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpO1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkSW1hZ2VzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlSW1hZ2VzID0gJCgnLmN0IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpLm5vdCh1aS5pdGVtKS5jbG9uZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZEltYWdlcyA9ICQoJy5jdCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKS5ub3QodWkuaXRlbSkuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0RmlsZV8xID0gdWkuaXRlbS5jbG9uZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0RmlsZV8yID0gdWkuaXRlbS5jbG9uZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGVJbWFnZXMgPSB0YXJnZXRGaWxlXzEuYWRkKGRyYWdnYWJsZUltYWdlcyk7IC8vLmFkZCh0YXJnZXRGaWxlXzEpO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkSW1hZ2VzID0gc2VsZWN0ZWRJbWFnZXMuYWRkKHRhcmdldEZpbGVfMik7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJbWFnZXMuZmluZCgnLmZpbGVfX2FycmFnZW1lbnQsIC5maWxlX19jb250cm9scywgLmZpbGVfX3RpdGxlLCAuZmlsZV9fY2FwdGlvbicpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJbWFnZXNcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdmaWxlX3ZpZXdfZ3JpZCcpXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoJ3dpZHRoJywgMjUwKVxuICAgICAgICAgICAgICAgICAgICAuY3NzKCdoZWlnaHQnLCAxNzApO1xuXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJbWFnZXMuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgICAgICAgICAgICAgICAkKGVsKS5jc3MoJ3RyYW5zZm9ybScsICdyb3RhdGUoJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSo2MCAtIDYwKS8xMCArICdkZWcpIHRyYW5zbGF0ZSgnICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjIwMCAtIDIwMCkvMTAgKyAncHgsICcgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMjAwIC0gMjAwKS8xMCArICdweCknICk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkKCcuY3QgLmZpbGVzIC5maWxlLnNlbGVjdGVkJykubm90KHVpLml0ZW0pLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlSW1hZ2VzLmFkZENsYXNzKCdmaWxlX2RyYWdnaW5nJyk7XG5cbiAgICAgICAgICAgICAgICB1aS5pdGVtLnJlbW92ZUNsYXNzKCdmaWxlJykuYWRkQ2xhc3MoJ2RyYWdGaWxlc1dyYXBwZXInKTtcbiAgICAgICAgICAgICAgICB1aS5pdGVtLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgdWkuaXRlbS5hcHBlbmQoc2VsZWN0ZWRJbWFnZXMpO1xuXG4gICAgICAgICAgICAgICAgJCgnLmN0IC5zZWN0aW9uX19maWxlcycpLnNvcnRhYmxlKCBcInJlZnJlc2hcIiApO1xuXG4gICAgICAgICAgICAgICAgLy91aS5pdGVtLmFkZENsYXNzKCdmaWxlX2hlbHBlcicpLnByZXBlbmQoZHJhZ2dhYmxlSW1hZ2VzLmNsb25lKCkpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVpLml0ZW0uYWRkQ2xhc3MoJ2ZpbGVfaGVscGVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN0b3A6IGZ1bmN0aW9uKGUsIHVpKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHVpLmhlbHBlcik7XG4gICAgICAgICAgICBpZiAodWkuaXRlbS5oYXNDbGFzcygnZHJhZ0ZpbGVzV3JhcHBlcicpKSB7XG4gICAgICAgICAgICAgICAgdWkuaXRlbS5hZnRlcihkcmFnZ2FibGVJbWFnZXMucmVtb3ZlQXR0cignc3R5bGUnKSk7Ly8uaW5zZXJ0QWZ0ZXIodWkuaXRlbSk7XG4gICAgICAgICAgICAgICAgdWkuaXRlbS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICQoXCIuc2VsZWN0ZWRcIikucmVtb3ZlQ2xhc3MoXCJmaWxlX2RyYWdnaW5nXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCgnLmZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZScpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICAgICAgICAgICB1aS5pdGVtLnJlbW92ZUNsYXNzKCdmaWxlX2hlbHBlcicpO1xuICAgICAgICAgICAgLypjb25zb2xlLmxvZyh1aS5pdGVtKTtcbiAgICAgICAgICAgIHVpLml0ZW0uY2hpbGRyZW4oKS5ub3QoJy5maWxlOmxhc3QnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVpLml0ZW0pO1xuICAgICAgICAgICAgdWkuaXRlbS51bndyYXAoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVpLml0ZW0pO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIC8vZHJhZ2dhYmxlSW1hZ2VzLmluc2VydEFmdGVyKHVpLml0ZW0pO1xuICAgICAgICAgICAgbm9ybWFsaXplSW5kZXgoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4vLyBBc3NldCBMaWJyYXJ5IGJ1dHRvbnNcbiAgICAkKCcjYWRkRnJvbUFMQnV0dG9uJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgbGFzdFNlbGVjdGVkID0gbnVsbDtcbiAgICAgICAgYWRkU2VsZWN0ZWRGaWxlcygpO1xuICAgICAgICBjbG9zZUFzc2V0TGlicmFyeSgpO1xuICAgIH0pO1xuICAgICQoJyNhbENsb3NlQnV0dG9uJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgICBjbG9zZUFzc2V0TGlicmFyeSgpO1xuICAgIH0pO1xuICAgICQoJyNhc3NldExpYnJhcnknKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgXHQkKCcjYWwnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgXHQkKCcjYWwnKS5hZGRDbGFzcygnbW9kYWwnKTtcbiAgICBcdCQoJyN3cmFwcGVyJykuYWRkQ2xhc3MoJ292ZXJmbG93Jyk7XG4gICAgfSk7XG4gICAgJCgnI2FsJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgICAkKCcjYWwgLmZpbGVzIC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgfSk7XG5cbi8vIEdyaWQvbGlzdCB2aWV3IHN3aXRjaGVyc1xuICAgICQoJyNncmlkVmlldycpLmNsaWNrKHNldEdyaWRWaWV3KTtcbiAgICAkKCcjbGlzdFZpZXcnKS5jbGljayhzZXRMaXN0Vmlldyk7XG5cbiAgICAvL0VkaXQgZmlsZXMgaGFuZGxlcnNcbiAgICAkKCcuZmlsZSAuZmlsZV9fY29udHJvbHMgLmJ1dHRvbicpLmNsaWNrKGhhbmRsZUZpbGVkRWRpdEJ1dHRvbkNsaWNrKTtcbiAgICAkKCcjbXVsdGlFZGl0JykuY2xpY2soaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2spO1xuXG4gICAgLy9FZGl0IGZvcm0gY2hhbmdlIGFjdGlvbnM7XG4gICAgJCgnI3RpdGxlJykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVUaXRsZSgpO30pO1xuICAgICQoJyNjYXB0aW9uJykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVDYXB0aW9uKCk7fSk7XG4gICAgJCgnI2Rlc2NyaXB0aW9uJykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVEZXNjcmlwdGlvbigpO30pO1xuICAgICQoJyNyZXNvbHV0aW9uJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtzYXZlUmVzb2x1dGlvbigpO30pO1xuICAgICQoJyNhbHRUZXh0Jykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVBbHRUZXh0KCk7fSk7XG4gICAgLy8kKCcjY3JlZGl0Jykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVDcmVkaXQoKTt9KTtcbiAgICAvLyQoJyNjb3B5cmlnaHQnKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKSB7c2F2ZUNvcHlyaWdodCgpO30pO1xuICAgIC8vJCgnI3NvdXJjZScpLm9uKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtzYXZlU291cmNlKCk7fSk7XG5cbiAgICAvL0ZvY2FsUG9pbnQgYWRqdXN0bWVudFxuICAgICQoJyNmb2NhbFBvaW50JykuZHJhZ2dhYmxlKHtcbiAgICAgICAgY29udGFpbm1lbnQ6IFwiI3ByZXZpZXdJbWdcIixcbiAgICAgICAgc2Nyb2xsOiBmYWxzZSAsXG4gICAgICAgIHN0b3A6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGFkanVzdEZvY2FsUG9pbnQoKTtcbiAgICAgICAgICAgIGFkanVzdFB1cnBvc2UoJChlLnRhcmdldCkpO1xuICAgICAgICAgICAgZGF0YUNoYW5nZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvL1NlbGVjdCBBbGwgYnV0dG9uXG4gICAgJCgnI3NlbGVjdEFsbCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICBcdGlmICgkKGUudGFyZ2V0KS5oYXNDbGFzcygnZW1wdHknKSkge1xuICAgIFx0XHRzZWxlY3RBbGwoKTtcbiAgICBcdH0gZWxzZSB7XG4gICAgXHRcdGRlc2VsZWN0QWxsKCk7XG4gICAgXHR9XG4gICAgfSk7XG5cbiAgICAvL1NhdmUgYnV0dG9uXG4gICAgJCgnI3NhdmVDaGFuZ2VzJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgXHR2YXIgZW1wdHlGaWVsZHMgPSBjaGVja0ZpZWxkcygnLnByIGxhYmVsLnJlcXVpZXJlZCcpO1xuICAgIFx0aWYgKGVtcHR5RmllbGRzKSB7XG4gICAgICAgICAgICBzaG93Tm90aWZpY2F0aW9uKCdUaGUgY2hhbmdlIGluIHRoZSBtZXRhZGF0YSBpcyBzYXZlZCBpbiB0aGUgQXNzZXQgTGlicmFyeS4nKTtcblxuICAgIFx0XHRlZGl0ZWRGaWxlc0RhdGEuZm9yRWFjaChmdW5jdGlvbihmZCkge1xuICAgIFx0XHRcdGdhbGxlcnlPYmplY3RzLmZvckVhY2goZnVuY3Rpb24oZikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZi5maWxlRGF0YS5pZCA9PT0gZmQuZmlsZURhdGEuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBmZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGYuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgIFx0XHR9KTtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge2Nsb3NlRWRpdFNjcmVlbigpO30sIDIwMDApO1xuICAgIFx0XHR1cGRhdGVHYWxsZXJ5KCk7XG4gICAgICAgICAgICBkZXNlbGVjdEFsbCgpO1xuICAgICAgICAgICAgbm9ybWFsaXplU2VsZWN0ZWlvbigpO1xuXG4gICAgXHR9XG4gICAgfSk7XG4gICAgLy9DYW5jZWwgZWRpdCBidXR0b25cbiAgICAkKCcjY2FuY2VsQ2hhbmdlcycpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhQ2hhbmdlZCk7XG4gICAgXHRpZiAoZGF0YUNoYW5nZWQpIHtcbiAgICAgICAgICAgICQoJyNjYW5jZWxDaGFuZ2VzUHJvbXB0JykudG9nZ2xlQ2xhc3MoJ2RpYWxvZyBoaWRkZW4nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsb3NlRWRpdFNjcmVlbigpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvL1NhdmUgRHJhZnQgYnV0dG9uIENsaWNrXG4gICAgJCgnI3NhdmVEcmFmdCcpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBzaG93Tm90aWZpY2F0aW9uKCdUaGUgZHJhZnQgaXMgc2F2ZWQuJyk7XG4gICAgfSk7XG5cbiAgICAvL3RhZ0ZpZWxkXG4gICAgJCgnLnRhZ2ZpZWxkJykuY2xpY2soZm9jdXNUYWdGaWVsZCk7XG5cbiAgICAvL1NldCBtZW51IGNsaWNrIGFjdGlvblxuICAgICQoJy5sbSBsaSBhJykuY2xpY2soaGFuZGxlTWVudUNsaWNrKTtcblxuICAgIC8vQ2FuY2VsIERyYWZ0IHJlZGlyZWN0IHRvIGRhc2hib2FyZFxuICAgICQoJyNjYW5jZWxEcmFmdCcpLmNsaWNrKGZ1bmN0aW9uKCkge3dpbmRvdy5sb2NhdGlvbi5ocmVmPVwiZGFzaGJvYXJkLmh0bWxcIjt9KTtcblxuICAgICQoJy5wciBpbnB1dCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtkYXRhQ2hhbmdlZCA9IHRydWU7fSk7XG5cbn0pO1xuXG4vKlF1aWNrIEVkaXQgRmlsZSBUaXRsZSBhbmQgSW5mbyAqL1xuZnVuY3Rpb24gZWRpdEZpbGVUaXRsZShlKSB7XG5cdGlmICghJCgnLmFsJykuaGFzQ2xhc3MoJ21vZGFsJykpIHtcblx0XHR2YXIgZmlsZUluZm8gPSBlLnRhcmdldDtcblx0XHR2YXIgZmlsZUluZm9UZXh0ID0gZmlsZUluZm8uaW5uZXJIVE1MO1xuXHRcdHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cdFx0aW5wdXQudHlwZSA9ICd0ZXh0Jztcblx0XHRpbnB1dC52YWx1ZSA9IGZpbGVJbmZvVGV4dDtcblxuXHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgaW5wdXQgPSBlLnRhcmdldDtcblx0XHRcdGZpbGVJbmZvID0gaW5wdXQucGFyZW50Tm9kZTtcblx0XHRcdGZpbGVJbmZvLnJlbW92ZUNoaWxkKGlucHV0KTtcblx0XHRcdGZpbGVJbmZvLmNsYXNzTGlzdC5yZW1vdmUoJ2VkaXQnKTtcblx0XHRcdGZpbGVJbmZvLmlubmVySFRNTCA9IGlucHV0LnZhbHVlO1xuXHRcdH0pO1xuXHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAxMyB8fCBlLndoaWNoID09IDEzKSB7XG5cdFx0XHRcdHZhciBpbnB1dCA9IGUudGFyZ2V0O1xuXHRcdFx0ZmlsZUluZm8gPSBpbnB1dC5wYXJlbnROb2RlO1xuXHRcdFx0ZmlsZUluZm8ucmVtb3ZlQ2hpbGQoaW5wdXQpO1xuXHRcdFx0ZmlsZUluZm8uY2xhc3NMaXN0LnJlbW92ZSgnZWRpdCcpO1xuXHRcdFx0ZmlsZUluZm8uaW5uZXJIVE1MID0gaW5wdXQudmFsdWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSAnJztcblx0XHRmaWxlSW5mby5hcHBlbmRDaGlsZChpbnB1dCk7XG5cdFx0ZmlsZUluZm8uY2xhc3NMaXN0LmFkZCgnZWRpdCcpO1xuXHRcdGlucHV0LmZvY3VzKCk7XG5cdH1cbn1cbmZ1bmN0aW9uIGVkaXRGaWxlQ2FwdGlvbihlKSB7XG5cdGlmICghJCgnLmFsJykuaGFzQ2xhc3MoJ21vZGFsJykpIHtcblx0XHR2YXIgZmlsZUluZm8gPSBlLnRhcmdldDtcblx0XHR2YXIgZmlsZUluZm9UZXh0ID0gZmlsZUluZm8uaW5uZXJIVE1MO1xuXHRcdHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG5cdFx0Ly9pbnB1dC50eXBlID0gJ3RleHQnXG5cdFx0aW5wdXQudmFsdWUgPSBmaWxlSW5mb1RleHQ7XG5cblx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIGlucHV0ID0gZS50YXJnZXQ7XG5cdFx0XHRmaWxlSW5mbyA9IGlucHV0LnBhcmVudE5vZGU7XG5cdFx0XHRmaWxlSW5mby5yZW1vdmVDaGlsZChpbnB1dCk7XG5cdFx0XHRmaWxlSW5mby5jbGFzc0xpc3QucmVtb3ZlKCdlZGl0Jyk7XG5cdFx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSBpbnB1dC52YWx1ZTtcblx0XHR9KTtcblx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMTMgfHwgZS53aGljaCA9PSAxMykge1xuXHRcdFx0XHR2YXIgaW5wdXQgPSBlLnRhcmdldDtcblx0XHRcdGZpbGVJbmZvID0gaW5wdXQucGFyZW50Tm9kZTtcblx0XHRcdGZpbGVJbmZvLnJlbW92ZUNoaWxkKGlucHV0KTtcblx0XHRcdGZpbGVJbmZvLmNsYXNzTGlzdC5yZW1vdmUoJ2VkaXQnKTtcblx0XHRcdGZpbGVJbmZvLmlubmVySFRNTCA9IGlucHV0LnZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0fSk7XG5cblx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSAnJztcblx0XHRmaWxlSW5mby5hcHBlbmRDaGlsZChpbnB1dCk7XG5cdFx0ZmlsZUluZm8uY2xhc3NMaXN0LmFkZCgnZWRpdCcpO1xuXHRcdGlucHV0LmZvY3VzKCk7XG5cdH1cbn1cblxuLyogRmlsZSBEZWxldGUgKi9cbmZ1bmN0aW9uIGRlbGV0ZUZpbGUoZSkge1xuICAgICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJykuYWRkQ2xhc3MoJ3NicicpO1xuICAgICQoJy5jdCAuZmlsZS5zZWxlY3RlZCcpLmFkZENsYXNzKCdzYnInKTtcbiAgICAkKCcjZGVsZXRlRmlsZXMnKS50b2dnbGVDbGFzcygnbW9kYWwgaGlkZGVuJyk7XG59XG5cblxuJCgnLmZpbGUtdGl0bGUnKS5jbGljayhlZGl0RmlsZVRpdGxlKTtcbiQoJy5maWxlLWNhcHRpb24nKS5jbGljayhlZGl0RmlsZUNhcHRpb24pO1xuXG4kKCcuZmlsZSAuY2xvc2UsIC5maWxlX19kZWxldGUnKS5jbGljayhkZWxldGVGaWxlKTtcblxuJCgnLmZpbGUtY29udHJvbHMsIC5maWxlX19jb250cm9scycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpO1xuJCgnLmZpbGUtY29udHJvbHMgLmNoZWNrbWFyaywgLmZpbGVfX2NoZWNrbWFyaycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpO1xuXG4kKCcuYWwgLmZpbGUtaW1nLCAuYWwgLmZpbGUtdGl0bGUnKS5jbGljayhmdW5jdGlvbiAoZSkge1xuXHRpZiAoJCgnLmFsJykuaGFzQ2xhc3MoJ21vZGFsJykpIHtcblx0XHRlLnRhcmdldC5wYXJlbnROb2RlLmNsYXNzTGlzdC50b2dnbGUoJ3NlbGVjdGVkJyk7XG5cdH1cbn0pO1xuXG5mdW5jdGlvbiBsb2FkRmlsZShmaWxlKSB7XG5cdHZhciBmaWxlRGF0YSA9IGZpbGUuZmlsZURhdGE7XG5cdC8vc2V0IGltYWdlIGFuZCBmb2NhbCBwb2ludFxuXHQkKCcucHIgLmltZyA+IC5pbWctd3JhcHBlciA+IGltZycpLmF0dHIoJ3NyYycsIGZpbGVEYXRhLnVybCk7XG5cdCQoJy5wciAucHVycG9zZS1pbWcnKS5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsICd1cmwoJyArIGZpbGVEYXRhLnVybCArICcpJyk7XG5cdGFkanVzdEZvY2FsUG9pbnQoZmlsZURhdGEuZm9jYWxQb2ludCk7XG5cdGFkanVzdEZvY2FsUmVjdChmaWxlRGF0YS5mb2NhbFBvaW50KTtcblxuXHQvL3NldCBUaXRsZVxuXHRhZGp1c3RUaXRsZShmaWxlRGF0YS50aXRsZSk7XG5cdGFkanVzdENhcHRpb24oZmlsZURhdGEuY2FwdGlvbik7XG5cdGFkanVzdERlc2NyaXB0aW9uKGZpbGVEYXRhLmRlc2NyaXB0aW9uKTtcblx0YWRqdXN0UmVzb2x1dGlvbihmaWxlRGF0YS5oaWdoUmVzb2x1dGlvbik7XG5cdGFkanVzdEFsdFRleHQoZmlsZURhdGEuYWx0VGV4dCk7XG59XG5cbi8vRnVuY3Rpb24gdG8gc2V0IFRpdGxlIHRvIHRoZSB0aXRsZSBmaWVsZCBvciwgc2F2ZSB0aXRsZSBpZiB0aXRsZSBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gYWRqdXN0VGl0bGUodGl0bGUpIHtcblx0JCgnI3RpdGxlJykudmFsKHRpdGxlKTtcbn1cbi8vRnVuY3Rpb24gdG8gc2V0IFRpdGxlIHRvIHRoZSB0aXRsZSBmaWVsZCBvciwgc2F2ZSB0aXRsZSBpZiB0aXRsZSBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gc2F2ZVRpdGxlKCkge1xuXHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS50aXRsZSA9ICQoJyN0aXRsZScpLnZhbCgpO1xuXHRkYXRhQ2hhbmdlZCA9IHRydWU7XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBDYXB0aW9uIHRvIHRoZSBjYXB0aW9uIGZpZWxkIG9yLCBzYXZlIGNhcHRpb24gaWYgY2FwdGlvbiBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gYWRqdXN0Q2FwdGlvbihjYXB0aW9uKSB7XG5cdCQoJyNjYXB0aW9uJykudmFsKGNhcHRpb24pO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgRGVzY3JpcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlQ2FwdGlvbigpIHtcblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuY2FwdGlvbiA9ICQoJyNjYXB0aW9uJykudmFsKCk7XG5cdGRhdGFDaGFuZ2VkID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGFkanVzdERlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKSB7XG5cdCQoJyNkZXNjcmlwdGlvbicpLnZhbChkZXNjcmlwdGlvbik7XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBEZXNjcmlwdGlvbiB0byB0aGUgY2FwdGlvbiBmaWVsZCBvciwgc2F2ZSBjYXB0aW9uIGlmIGNhcHRpb24gYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIHNhdmVEZXNjcmlwdGlvbigpIHtcblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuZGVzY3JpcHRpb24gPSAkKCcjZGVzY3JpcHRpb24nKS52YWwoKTtcblx0ZGF0YUNoYW5nZWQgPSB0cnVlO1xufVxuZnVuY3Rpb24gYWRqdXN0UmVzb2x1dGlvbihyZXNvbHV0aW9uKSB7XG5cdCQoJyNyZXNvbHV0aW9uJykucHJvcCgnY2hlY2tlZCcsIHJlc29sdXRpb24pO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgRGVzY3JpcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlUmVzb2x1dGlvbigpIHtcblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuaGlnaFJlc29sdXRpb24gPSAkKCcjcmVzb2x1dGlvbicpLnByb3AoJ2NoZWNrZWQnKTtcblx0ZGF0YUNoYW5nZWQgPSB0cnVlO1xufVxuZnVuY3Rpb24gYWRqdXN0QWx0VGV4dChhbHRUZXh0KSB7XG5cdCQoJyNhbHRUZXh0JykudmFsKGFsdFRleHQpO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgRGVzY3JpcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlQWx0VGV4dCgpIHtcblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuYWx0VGV4dCA9ICQoJyNhbHRUZXh0JykudmFsKCk7XG5cdGRhdGFDaGFuZ2VkID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGFkanVzdEFsdFRleHQoYWx0VGV4dCkge1xuXHQkKCcjYWx0VGV4dCcpLnZhbChhbHRUZXh0KTtcbn1cbi8vRnVuY3Rpb24gdG8gc2V0IERlc2NyaXB0aW9uIHRvIHRoZSBjYXB0aW9uIGZpZWxkIG9yLCBzYXZlIGNhcHRpb24gaWYgY2FwdGlvbiBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gc2F2ZUFsdFRleHQoKSB7XG5cdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmFsdFRleHQgPSAkKCcjYWx0VGV4dCcpLnZhbCgpO1xuXHRkYXRhQ2hhbmdlZCA9IHRydWU7XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBGb2NhbFBvaW50IGNvb3JkaW5hdGVzIG9yLCBzYXZlIGZvY2FsIHBpbnQgaWYgZm9jYWxwb2ludCBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gYWRqdXN0Rm9jYWxQb2ludChmb2NhbFBvaW50KSB7XG5cdHZhciBmcCA9ICQoJyNmb2NhbFBvaW50Jyk7XG5cdHZhciBpbWcgPSAkKCcjcHJldmlld0ltZycpO1xuXHRpZiAoZm9jYWxQb2ludCkge1xuXHRcdHZhciBsZWZ0ID0gZm9jYWxQb2ludC5sZWZ0ICogaW1nLndpZHRoKCkgLSBmcC53aWR0aCgpLzIsXG5cdFx0XHR0b3AgPSBmb2NhbFBvaW50LnRvcCAqIGltZy5oZWlnaHQoKSAtIGZwLmhlaWdodCgpLzI7XG5cblx0XHRsZWZ0ID0gbGVmdCA9PT0gMCA/ICc1MCUnIDogbGVmdDtcblx0XHR0b3AgPSB0b3AgPT09IDAgPyAnNTAlJyA6IHRvcDtcblx0XHRmcC5jc3MoJ2xlZnQnLCBsZWZ0KS5jc3MoJ3RvcCcsIHRvcCk7XG5cblx0fSBlbHNlIHtcblx0XHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5mb2NhbFBvaW50ID0ge1xuXHRcdFx0bGVmdDogKChmcC5wb3NpdGlvbigpLmxlZnQgKyBmcC53aWR0aCgpLzIpL2ltZy53aWR0aCgpKSxcblx0XHRcdHRvcDogKChmcC5wb3NpdGlvbigpLnRvcCArIGZwLmhlaWdodCgpLzIpL2ltZy5oZWlnaHQoKSlcblx0XHR9O1xuXHR9XG5cdGZwLmNzcygncG9zaXRpb24nLCAnYWJzb2x1dGUnKTtcbn1cblxuLy9GdW5jdGlvbiB0byBzZXQgRm9jYWxSZWN0IGNvb3JkaW5hdGVzIG9yLCBzYXZlIGZvY2FsIHBpbnQgaWYgZm9jYWxwb2ludCBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gYWRqdXN0Rm9jYWxSZWN0KGZvY2FsUG9pbnQpIHtcblx0dmFyIGZyID0gJCgnI2ZvY2FsUmVjdCcpO1xuXHR2YXIgaW1nID0gJCgncHJldmlld0ltZycpO1xuXHRpZiAoZm9jYWxQb2ludCkge1xuXHRcdHZhciBsZWZ0ID0gZm9jYWxQb2ludC5sZWZ0ICogaW1nLndpZHRoKCkgLSBmci53aWR0aCgpLzIsXG5cdFx0XHR0b3AgPSBmb2NhbFBvaW50LnRvcCAqIGltZy5oZWlnaHQoKSAtIGZyLmhlaWdodCgpLzI7XG5cblx0XHRsZWZ0ID0gbGVmdCA8IDAgPyAwIDogbGVmdCA+IGltZy53aWR0aCgpID8gaW1nLndpZHRoKCkgLSBmci53aWR0aCgpLzIgOiBsZWZ0O1xuXHRcdHRvcCA9IHRvcCA8IDAgPyAwIDogdG9wID4gaW1nLmhlaWdodCgpID8gaW1nLmhlaWdodCgpIC0gZnIuaGVpZ2h0KCkvMiA6IHRvcDtcblxuXHRcdGZyLmNzcygnbGVmdCcsIGxlZnQpXG5cdFx0XHQuY3NzKCd0b3AnLCB0b3ApO1xuXHR9IGVsc2Uge1xuXHRcdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmZvY2FsUG9pbnQgPSB7XG5cdFx0XHRsZWZ0OiAoKGZwLnBvc2l0aW9uKCkubGVmdCArIGZwLndpZHRoKCkvMikvaW1nLndpZHRoKCkpLFxuXHRcdFx0dG9wOiAoKGZwLnBvc2l0aW9uKCkudG9wICsgZnAuaGVpZ2h0KCkvMikvaW1nLmhlaWdodCgpKVxuXHRcdH07XG5cdH1cbn1cblxuXG5mdW5jdGlvbiBzaG93RmlsZXMoZmlsZXMpIHtcblx0ZGF0YUNoYW5nZWQgPSBmYWxzZTtcblx0Ly9TaG93IGluaXRpYWwgZWRpdCBzY3JlZW4gZm9yIHNpbmdsZSBpbWFnZS5cblx0JCgnLnByJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbiB2aWRlbyBidWxrJylcblx0XHRcdC5hZGRDbGFzcygnbW9kYWwnKTtcblx0JCgnI3dyYXBwZXInKS5hZGRDbGFzcygnb3ZlcmZsb3cnKTtcblxuXHQvL1JlbW92ZSBhbGwgbXVsdGlwbGUgaW1hZ2VzIHN0eWxlIGF0dHJpYnV0ZXNcblx0JCgnLnByIC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ3ByZXZpZXdfc3R5bGVfbXVsdGkgaGlkZGVuJyk7XG5cdCQoJy5wciAuaXAnKS5yZW1vdmVDbGFzcygnaXBfc3R5bGVfbXVsdGknKTtcblx0JCgnI3NhdmVDaGFuZ2VzJykudGV4dCgnU2F2ZScpO1xuXHQvLyQoJyNpcF9fdGl0bGUnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdCQoJy5wciAuaW1hZ2VzJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdGlmIChmaWxlcy5sZW5ndGggPiAxKSB7XG5cdFx0dmFyIGltZ0NvbnRhaW5lciA9ICQoJy5wciAuaW1hZ2VzX19jb250YWluZXInKTtcblx0XHRpbWdDb250YWluZXIuZW1wdHkoKTtcblxuXHRcdC8vQWRkIGltYWdlcyBwcmV2aWVzIHRvIHRoZSBjb250YWluZXJcblx0XHRmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdC8vY29uc29sZS5sb2coZiwgaSlcblx0XHRcdHZhclx0aW1hZ2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZSBpbWFnZV9zdHlsZV9tdWx0aScpLmNsaWNrKHN3aXRjaEltYWdlKSxcblx0XHRcdFx0ZmlsZUluZGV4ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaGlkZGVuIGZpbGVfX2lkJykudGV4dChmLmZpbGVEYXRhLmlkKTtcblx0XHRcdGltYWdlLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIGYuZmlsZURhdGEudXJsICsgJyknKS5hcHBlbmQoZmlsZUluZGV4KTtcblx0XHRcdC8vfVxuXHRcdFx0aW1nQ29udGFpbmVyLmFwcGVuZChpbWFnZSk7XG5cdFx0fSk7XG5cblx0XHQvL0FkZCBhY3RpdmUgc3RhdGUgdG8gdGhlIHByZXZpZXcgb2YgdGhlIGZpcnN0IGltYWdlXG5cdFx0dmFyIGZpcnN0SW1hZ2UgPSAkKCcuaW1hZ2VzX19jb250YWluZXIgLmltYWdlJykuZmlyc3QoKTtcblx0XHRmaXJzdEltYWdlLmFkZENsYXNzKCdpbWFnZV9hY3RpdmUnKTtcblxuXHRcdCQoJy5wciAuaW1hZ2VzJykuYWRkQ2xhc3MoJ2ltYWdlc19zdHlsZV9tdWx0aScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblxuXHRcdCQoJy5wciAucHJldmlldycpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKS5hZGRDbGFzcygncHJldmlld19zdHlsZV9tdWx0aScpO1xuXHRcdCQoJy5wciAuaXAnKS5hZGRDbGFzcygnaXBfc3R5bGVfbXVsdGknKTtcblxuXHRcdC8vQWRqdXN0IGltYWdlIHByZXZpZXdzIGNvbnRhaW5lclxuXHRcdCQoJyNpbWFnZXNfX3dyYXBwZXInKS5zY3JvbGxMZWZ0KDApO1xuXHRcdHZhciBpbWFnZXNXcmFwcGVyV2lkdGggPSAkKCcuaW1hZ2VzX193cmFwcGVyJykud2lkdGgoKTtcblx0XHRcdGltYWdlc1dpZHRoID0gJCgnLmltYWdlc19fY29udGFpbmVyIC5pbWFnZScpLmxlbmd0aCAqIDEyMDtcblx0XHRcdGNvbnNvbGUubG9nKGltYWdlc1dyYXBwZXJXaWR0aCwgaW1hZ2VzV2lkdGgpO1xuXHRcdGlmIChpbWFnZXNXcmFwcGVyV2lkdGggPiBpbWFnZXNXaWR0aCkge1xuXHRcdFx0JCgnLmltYWdlc19fc2Nyb2xsLWxlZnQsIC5pbWFnZXNfX3Njcm9sbC1yaWdodCcpLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCgnLmltYWdlc19fY29udGFpbmVyJykuY3NzKCd3aWR0aCcsIGltYWdlc1dpZHRoLnRvU3RyaW5nKCkgKyAncHgnKTtcblx0XHRcdCQoJy5pbWFnZXNfX3Njcm9sbC1sZWZ0LCAuaW1hZ2VzX19zY3JvbGwtcmlnaHQnKS5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuXHRcdH1cblx0XHQvL0FkZCBhY3Rpb25zIHRvIHNjcm9sbCBidXR0b25zXG5cdFx0JCgnLmltYWdlc19fc2Nyb2xsLWxlZnQnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHQkKCcjaW1hZ2VzX193cmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiAnLT00NjAnIH0sIDgwMCk7XG5cdFx0fSk7XG5cdFx0JCgnLmltYWdlc19fc2Nyb2xsLXJpZ2h0JykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0JCgnI2ltYWdlc19fd3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogJys9NDYwJyB9LCA4MDApO1xuXHRcdH0pO1xuXHR9XG5cdGhpZGVMb2FkZXIoKTtcblxufVxuXG5mdW5jdGlvbiBlZGl0RmlsZXMoZmlsZXMpIHtcblx0ZWRpdGVkRmlsZXNEYXRhID0gW107IC8vQ2xlYXIgZmlsZXMgZGF0YSB0aGF0IHBvc3NpYmx5IGNvdWxkIGJlIGhlcmVcblxuXHQvL09idGFpbiBmaWxlcyBkYXRhIGZvciBmaWxlcyB0aGF0IHNob3VsZCBiZSBlZGl0ZWRcblx0ZmlsZXMuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuXHRcdHZhciBmaWxlID0gZ2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgIHJldHVybiBmLmZpbGVEYXRhLmlkID09PSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG4gICAgICAgIH0pWzBdO1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5wdXNoKGZpbGUpO1xuXHR9KTtcblxuXHRpZiAoZWRpdGVkRmlsZXNEYXRhLmxlbmd0aCA+IDApIHtcblx0XHRlZGl0ZWRGaWxlRGF0YSA9IGVkaXRlZEZpbGVzRGF0YVswXTtcblx0XHRsb2FkRmlsZShlZGl0ZWRGaWxlRGF0YSk7XG5cdFx0c2hvd0ZpbGVzKGVkaXRlZEZpbGVzRGF0YSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZmlsZUJ5SWQoZmlsZXMsIGlkKSB7XG5cdGZpbGVzRmlsdGVyZWQgPSBmaWxlcy5maWx0ZXIoZnVuY3Rpb24oZikge1xuXHRcdHJldHVybiBmLmZpbGVEYXRhLmlkID09PSBpZDtcblx0fSk7XG5cdHJldHVybiBmaWxlc0ZpbHRlcmVkWzBdO1xufVxuZnVuY3Rpb24gc2F2ZUZpbGUoZmlsZXMsIGZpbGUpIHtcblx0ZmlsZXMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0aWYgKGYuZmlsZURhdGEuaWQgPT09IGZpbGUuZmlsZURhdGEuaWQpIHtcblx0XHRcdGYgPSBmaWxlO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHN3aXRjaEltYWdlKGUpIHtcblx0dmFyIG5ld0ZpbGVJZCA9ICQoZS50YXJnZXQpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKSxcblx0XHRuZXdGaWxlID0gZmlsZUJ5SWQoZWRpdGVkRmlsZXNEYXRhLCBuZXdGaWxlSWQpO1xuXG5cdHNhdmVGaWxlKGVkaXRlZEZpbGVzRGF0YSwgZWRpdGVkRmlsZURhdGEpO1xuXG5cdGVkaXRlZEZpbGVEYXRhID0gbmV3RmlsZTtcblx0bG9hZEZpbGUoZWRpdGVkRmlsZURhdGEpO1xuXG5cdCQoJy5pbWFnZScpLnJlbW92ZUNsYXNzKCdpbWFnZV9hY3RpdmUnKTtcblx0JChlLnRhcmdldCkuYWRkQ2xhc3MoJ2ltYWdlX2FjdGl2ZScpO1xuXG5cdGFkanVzdFJlY3QoJCgnLnB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZS1pbWcnKS5maXJzdCgpKTtcblx0JCgnI3B1cnBvc2VXcmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiAnMCcgfSwgODAwKTtcbn1cblxuXG4vL0Z1bmN0aW9uIGZvciBoYW5kbGUgRWRpdCBCdXR0b24gY2xpY2tzXG5mdW5jdGlvbiBoYW5kbGVGaWxlZEVkaXRCdXR0b25DbGljayhlKSB7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdHZhciBmaWxlID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKTtcblx0ZWRpdEZpbGVzKGZpbGUpO1xufVxuZnVuY3Rpb24gaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2soZSkge1xuXHR2YXIgZmlsZXMgPSAkKCcuY3QgLmZpbGVzIC5maWxlLnNlbGVjdGVkJyk7XG5cdGVkaXRGaWxlcyhmaWxlcyk7XG59XG5cblxuLyokKCcjc2F2ZUNoYW5nZXNQcm9tcHQgLmJ1dHRvbicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHQkKCcjc2F2ZUNoYW5nZXNQcm9tcHQnKS50b2dnbGVDbGFzcygnbW9kYWwgaGlkZGVuJyk7XG5cdGNsb3NlRWRpdFNjcmVlbigpO1xufSk7Ki9cblxuXG5mdW5jdGlvbiBoYW5kbGVGaWxlcyhmaWxlcykge1xuXHRzaG93TG9hZGVyKCk7XG5cdHZhciBmaWxlc091dHB1dCA9IFtdO1xuXHRpZiAoZmlsZXMgJiYgZmlsZXMubGVuZ3RoID4wKSB7XG5cdFx0Zm9yICh2YXIgaT0wOyBpPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0ZmlsZXNPdXRwdXQucHVzaChmaWxlc1tpXSk7XG5cdFx0fVxuXHRcdHZhciB1cGxvYWRlZEZpbGVzID0gZmlsZXNPdXRwdXQubWFwKGZ1bmN0aW9uKGYpIHtcblx0XHRcdHJldHVybiBmaWxlVG9PYmplY3QoZikudGhlbihmdW5jdGlvbihyZXMpIHtcblx0XHRcdFx0Z2FsbGVyeU9iamVjdHMucHVzaCh7XG5cdFx0XHRcdFx0ZmlsZURhdGE6IHJlcyxcblx0XHRcdFx0XHRzZWxlY3RlZDogZmFsc2UsXG5cdFx0XHRcdFx0cG9zaXRpb246IDEwMDAsXG5cdFx0XHRcdFx0Y2FwdGlvbjogJycsXG5cdFx0XHRcdFx0Z2FsbGVyeUNhcHRpb246IGZhbHNlLFxuXHRcdFx0XHRcdGp1c3RVcGxvYWRlZDogdHJ1ZVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdFByb21pc2UuYWxsKHVwbG9hZGVkRmlsZXMpLnRoZW4oZnVuY3Rpb24ocmVzKSB7dXBkYXRlR2FsbGVyeShnYWxsZXJ5T2JqZWN0cy5sZW5ndGgpO30pO1xuXHR9XG59XG5cbi8vQ09udmVydCB1cGxvYWRlZCBmaWxlcyB0byBlbGVtZW50c1xuZnVuY3Rpb24gZmlsZVRvTWFya3VwKGZpbGUpIHtcblx0cmV0dXJuIHJlYWRGaWxlKGZpbGUpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG5cdFx0dmFyIGZpbGVOb2RlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZScpLFxuXG5cdFx0XHRmaWxlSW1nID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZS1pbWcnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyByZXN1bHQuc3JjICsgJyknKSxcblxuXHRcdFx0ZmlsZUNvbnRyb2xzID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZS1jb250cm9scycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuXHRcdFx0Y2hlY2ttYXJrID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2hlY2ttYXJrJykuY2xpY2sodG9nZ2xlRmlsZVNlbGVjdCksXG5cdFx0XHRjbG9zZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2Nsb3NlJykuY2xpY2soZGVsZXRlRmlsZSksXG5cdFx0XHRlZGl0ID0gJCgnPGJ1dHRvbj5FZGl0PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbiB3aGl0ZU91dGxpbmUnKS5jbGljayhlZGl0RmlsZSksXG5cblx0XHRcdGZpbGVUaXRsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3RpdGxlJyksXG5cdFx0XHRmaWxlVHlwZUljb24gPSAkKCc8aSBjbGFzcz1cImZhIGZhLWNhbWVyYVwiPjwvaT4nKS5jc3MoJ21hcmdpbi1yaWdodCcsICcycHgnKSxcblx0XHRcdGZpbGVUaXRsZUlucHV0ID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgLz4nKS52YWwocmVzdWx0Lm5hbWUpLFxuXG5cdFx0XHQvKjxkaXYgY2xhc3M9XCJmaWxlX190aXRsZVwiPlxuXHRcdFx0XHQ8aSBjbGFzcz1cImZhIGZhLWNhbWVyYVwiPjwvaT5cblx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCJCbGluZHNwb3QgUzAzIFByb21vXCIgLz5cblx0XHRcdDwvZGl2PiovXG5cdFx0XHRmaWxlQ2FwdGlvbiA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUtY2FwdGlvbicpLnRleHQocmVzdWx0Lm5hbWUpLmNsaWNrKGVkaXRGaWxlQ2FwdGlvbiksXG5cdFx0XHRmaWxlSW5mbyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUtaW5mbycpLnRleHQocmVzdWx0LmluZm8pLFxuXG5cdFx0XHRmaWxlUHVycG9zZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUtcHVycG9zZScpLFxuXHRcdFx0ZmlsZVB1cnBvc2VTZWxlY3QgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdzZWxlY3QnKS5jbGljayhvcGVuU2VsZWN0KSxcblx0XHRcdHNlbGVjdFNwYW4gPSAkKCc8c3Bhbj5TZWxlY3QgdXNlPC9zcGFuPicpLFxuXHRcdFx0c2VsZWN0VWwgPSAkKCc8dWw+PC91bD4nKSxcblx0XHRcdHNlbGVjdExpMSA9ICQoJzxsaT5Db3ZlcjwvbGk+JykuY2xpY2soc2V0U2VsZWN0KSxcblx0XHRcdHNlbGVjdExpMiA9ICQoJzxsaT5QcmltYXJ5PC9saT4nKS5jbGljayhzZXRTZWxlY3QpLFxuXHRcdFx0c2VsZWN0TGkzID0gJCgnPGxpPlNlY29uZGFyeTwvbGk+JykuY2xpY2soc2V0U2VsZWN0KTtcblxuXHRcdGZpbGVUaXRsZS5hcHBlbmQoZmlsZVR5cGVJY29uLCBmaWxlVGl0bGVJbnB1dCk7XG5cdFx0c2VsZWN0VWwuYXBwZW5kKHNlbGVjdExpMSwgc2VsZWN0TGkyLCBzZWxlY3RMaTMpO1xuXHRcdGZpbGVQdXJwb3NlU2VsZWN0LmFwcGVuZChzZWxlY3RTcGFuLCBzZWxlY3RVbCk7XG5cblx0XHRmaWxlUHVycG9zZS5hcHBlbmQoZmlsZVB1cnBvc2VTZWxlY3QpO1xuXHRcdGZpbGVDb250cm9scy5hcHBlbmQoY2hlY2ttYXJrLCBjbG9zZSwgZWRpdCk7XG5cdFx0ZmlsZUltZy5hcHBlbmQoZmlsZUNvbnRyb2xzKTtcblxuXHRcdGZpbGVOb2RlLmFwcGVuZChmaWxlSW1nLCBmaWxlVGl0bGUsIGZpbGVDYXB0aW9uLCBmaWxlSW5mbywgZmlsZVB1cnBvc2UpO1xuXG5cdFx0cmV0dXJuIGZpbGVOb2RlO1xuXHR9KTtcbn1cblxuLy9Db252ZXJ0IHVwbG9hZGVkIGZpbGUgdG8gb2JqZWN0XG5mdW5jdGlvbiBmaWxlVG9PYmplY3QoZmlsZSkge1xuXHRyZXR1cm4gcmVhZEZpbGUoZmlsZSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcblx0XHRyZXR1cm4ge1xuXHQgICAgICAgIHVybDogcmVzdWx0LnNyYyxcblx0ICAgICAgICBmb2NhbFBvaW50OiB7XG5cdCAgICAgICAgICAgIGxlZnQ6IDAuNSxcblx0ICAgICAgICAgICAgdG9wOiAwLjVcblx0ICAgICAgICB9LFxuXHRcdFx0aWQ6IHJlc3VsdC5uYW1lICsgJyAnICsgbmV3IERhdGUoKSxcblx0ICAgICAgICBjb2xvcjogZmlsZUltZ0NvbG9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqZmlsZUltZ0NvbG9ycy5sZW5ndGgpXSxcblx0ICAgICAgICB0aXRsZTogcmVzdWx0Lm5hbWUsXG5cdCAgICAgICAgY2FwdGlvbjogJycsXG5cdCAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuXHQgICAgICAgIGhpZ2hSZXNvbHV0aW9uOiBmYWxzZSxcblx0ICAgICAgICBjYXRlZ29yaWVzOiAnJyxcblx0ICAgICAgICB0YWdzOiAnJyxcblx0ICAgICAgICBhbHRUZXh0OiAnJyxcblx0ICAgICAgICBjcmVkaXQ6ICcnLFxuXHQgICAgICAgIGNvcHlyaWdodDogJycsXG5cdCAgICAgICAgcmVmZXJlbmNlOiB7XG5cdCAgICAgICAgICAgIHNlcmllczogJycsXG5cdCAgICAgICAgICAgIHNlYXNvbjogJycsXG5cdCAgICAgICAgICAgIGVwaXNvZGU6ICcnXG5cdCAgICAgICAgfVxuXHQgICAgfTtcblx0fSk7XG59XG5mdW5jdGlvbiByZWFkRmlsZShmaWxlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShcblx0XHRmdW5jdGlvbihyZXMsIHJlaikge1xuXHRcdFx0dmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cdFx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRyZXMoe3NyYzogZS50YXJnZXQucmVzdWx0LFxuXHRcdFx0XHRcdG5hbWU6IGZpbGUubmFtZSxcblx0XHRcdFx0XHRpbmZvOiBmaWxlLnR5cGUgKyAnLCAnICsgTWF0aC5yb3VuZChmaWxlLnNpemUvMTAyNCkudG9TdHJpbmcoKSArICcgS2InfSk7XG5cdFx0XHR9O1xuXHRcdFx0cmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmVqKHRoaXMpO1xuXHRcdFx0fTtcblx0XHRcdHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuXHRcdH1cblx0KTtcbn1cblxuZnVuY3Rpb24gc2hvd0xvYWRlcigpIHtcblx0dmFyIG1vZGFsID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWwnKS5hdHRyKCdpZCcsICdsb2FkZXJNb2RhbCcpLFxuXHRcdGxvYWRlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2xvYWRlcicpO1xuXG5cdG1vZGFsLmFwcGVuZChsb2FkZXIpO1xuXHQkKCdib2R5JykuYXBwZW5kKG1vZGFsKTtcbn1cbmZ1bmN0aW9uIGhpZGVMb2FkZXIoKSB7XG5cdCQoJyNsb2FkZXJNb2RhbCcpLnJlbW92ZSgpO1xufVxuXG5mdW5jdGlvbiBhZGp1c3RSZWN0KGVsKSB7XG5cdHZhciBpbWdXaWR0aCA9ICQoJyNwcmV2aWV3SW1nJykud2lkdGgoKSxcblx0XHRpbWdIZWlnaHQgPSAkKCcjcHJldmlld0ltZycpLmhlaWdodCgpLFxuXHRcdGltZ09mZnNldCA9ICQoJyNwcmV2aWV3SW1nJykub2Zmc2V0KCksXG5cdFx0aW1nUmF0aW8gPSBpbWdXaWR0aC9pbWdIZWlnaHQsXG5cblx0XHRlbEggPSBlbC5vdXRlckhlaWdodCgpLFxuXHRcdGVsVyA9IGVsLm91dGVyV2lkdGgoKSxcblx0XHRlbE8gPSBlbC5vZmZzZXQoKSxcblx0XHRlbFJhdGlvID0gZWxXL2VsSCxcblx0XHRlbEJhY2tncm91bmRQb3NpdGlvbiA9IGVsLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbicpLnNwbGl0KCcgJyk7XG5cblx0Y29uc29sZS5sb2coZWxILCBlbFcsIGVsQmFja2dyb3VuZFBvc2l0aW9uKTtcblxuXHRySGVpZ2h0ID0gaW1nUmF0aW8gPiBlbFJhdGlvID8gaW1nSGVpZ2h0IDogaW1nV2lkdGgvZWxSYXRpbztcblx0cldpZHRoID0gaW1nUmF0aW8gPiBlbFJhdGlvID8gaW1nSGVpZ2h0ICogZWxSYXRpbyA6IGltZ1dpZHRoO1xuXHRyT2Zmc2V0ID0ge2xlZnQ6IDAsIHRvcDogMH07XG5cblx0aWYgKGVsQmFja2dyb3VuZFBvc2l0aW9uLmxlbmd0aCA9PT0gMikge1xuXHRcdGlmIChlbEJhY2tncm91bmRQb3NpdGlvblswXS5pbmRleE9mKCclJykpIHtcblx0XHRcdHZhciBiZ0xlZnRQZXJzZW50ID0gZWxCYWNrZ3JvdW5kUG9zaXRpb25bMF0uc2xpY2UoMCwtMSksXG5cdFx0XHRcdGJnTGVmdFBpeGVsID0gTWF0aC5yb3VuZChpbWdXaWR0aCAqIGJnTGVmdFBlcnNlbnQvMTAwKSAtIHJXaWR0aC8yO1xuXG5cdFx0XHRjb25zb2xlLmxvZyhlbEJhY2tncm91bmRQb3NpdGlvblswXSwgYmdMZWZ0UGVyc2VudCwgYmdMZWZ0UGl4ZWwsIGltZ1dpZHRoLCAoYmdMZWZ0UGl4ZWwgKyByV2lkdGgpKTtcblxuXHRcdFx0aWYgKChiZ0xlZnRQaXhlbCkgPCAwKSB7YmdMZWZ0UGl4ZWwgPSAwO31cblx0XHRcdGlmICgoYmdMZWZ0UGl4ZWwgKyByV2lkdGgpID4gaW1nV2lkdGgpIHtiZ0xlZnRQaXhlbCA9IGltZ1dpZHRoIC0gcldpZHRoO31cblxuXHRcdFx0Y29uc29sZS5sb2coYmdMZWZ0UGl4ZWwsIGltZ1dpZHRoLCAoYmdMZWZ0UGl4ZWwgKyByV2lkdGgvMikpO1xuXG5cdFx0XHRyT2Zmc2V0LmxlZnQgPSBpbWdSYXRpbyA+IGVsUmF0aW8gPyBiZ0xlZnRQaXhlbCA6IDA7XG5cdFx0fVxuXHRcdGlmIChlbEJhY2tncm91bmRQb3NpdGlvblsxXS5pbmRleE9mKCclJykpIHtcblx0XHRcdHZhciBiZ1RvcFBlcnNlbnQgPSBlbEJhY2tncm91bmRQb3NpdGlvblsxXS5zbGljZSgwLC0xKSxcblx0XHRcdFx0YmdUb3BQaXhlbCA9IE1hdGgucm91bmQoaW1nSGVpZ2h0KmJnVG9wUGVyc2VudC8xMDApIC0gckhlaWdodC8yO1xuXG5cdFx0XHRpZiAoKGJnVG9wUGl4ZWwpIDwgMCkge2JnVG9wUGl4ZWwgPSAwO31cblx0XHRcdGlmICgoYmdUb3BQaXhlbCArIHJIZWlnaHQpID4gaW1nSGVpZ2h0KSB7YmdUb3BQaXhlbCA9IGltZ0hlaWdodCAtIHJIZWlnaHQ7fVxuXG5cdFx0XHRyT2Zmc2V0LnRvcCA9IGltZ1JhdGlvID4gZWxSYXRpbyA/IDAgOiBiZ1RvcFBpeGVsO1xuXHRcdH1cblx0fVxuXG5cdCQoJy5mb2NhbFJlY3QnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuXG5cdCQoJy5mb2NhbFJlY3QnKS5jc3MoJ3dpZHRoJywgcldpZHRoLnRvU3RyaW5nKCkgKyAncHgnKVxuXHRcdFx0XHRcdFx0XHQgICAuY3NzKCdoZWlnaHQnLCBySGVpZ2h0LnRvU3RyaW5nKCkgKyAncHgnKVxuXHRcdFx0XHRcdFx0XHQgICAuY3NzKCdsZWZ0Jywgck9mZnNldC5sZWZ0LnRvU3RyaW5nKCkgKyAncHgnKVxuXHRcdFx0XHRcdFx0XHQgICAuY3NzKCd0b3AnLCByT2Zmc2V0LnRvcC50b1N0cmluZygpICsgJ3B4Jylcblx0XHRcdFx0XHRcdFx0ICAgLmRyYWdnYWJsZSh7XG5cdFx0XHRcdFx0XHRcdCAgIFx0XHRheGlzOiBpbWdSYXRpbyA+IGVsUmF0aW8gPyAneCcgOiAneScsXG5cdFx0XHRcdFx0XHRcdCAgIFx0XHRzdGFydDogZnVuY3Rpb24oZSwgdWkpIHtcblx0XHRcdFx0XHRcdFx0XHQgICAgXHRlbC5jc3MoJ3RyYW5zaXRpb24nLCAnbm9uZScpO1xuXHRcdFx0XHRcdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdFx0XHQgICBcdFx0c3RvcDogZnVuY3Rpb24oZSwgdWkpIHtcblx0XHRcdFx0XHRcdFx0ICAgXHRcdFx0ZWwuY3NzKCd0cmFuc2l0aW9uJywgJzAuM3MgZWFzZS1vdXQnKTtcblx0XHRcdFx0XHRcdFx0XHQgICAgICAgIGFkanVzdFB1cnBvc2UoJChlLnRhcmdldCksIGVsKTtcblx0XHRcdFx0XHRcdFx0XHQgICAgfVxuXHRcdFx0XHRcdFx0XHQgICBcdH0pO1xuXG5cdCQoJy5wdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdGVsLnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuXG59XG5mdW5jdGlvbiBhZGp1c3RQdXJwb3NlKGZvY2FsSXRlbSwgcHVycG9zZUltZykge1xuXG5cdFx0dmFyIGltZyA9ICQoJyNwcmV2aWV3SW1nJyksXG5cdFx0aVdpZHRoID0gaW1nLndpZHRoKCksXG5cdFx0aUhlaWdodCA9IGltZy5oZWlnaHQoKSxcblx0XHRpT2Zmc2V0ID0gaW1nLm9mZnNldCgpLFxuXG5cdFx0cFdpZHRoID0gZm9jYWxJdGVtLm91dGVyV2lkdGgoKSxcblx0XHRwSGVpZ2h0ID0gZm9jYWxJdGVtLm91dGVySGVpZ2h0KCksXG5cdFx0cE9mZnNldCA9IGZvY2FsSXRlbS5vZmZzZXQoKSxcblxuXHRcdGZUb3AgPSBNYXRoLnJvdW5kKChwT2Zmc2V0LnRvcCAtIGlPZmZzZXQudG9wICsgcEhlaWdodC8yKSoxMDAgLyBpSGVpZ2h0KTtcblx0XHRmTGVmdCA9IE1hdGgucm91bmQoKHBPZmZzZXQubGVmdCAtIGlPZmZzZXQubGVmdCArIHBXaWR0aC8yKSAqIDEwMCAvIGlXaWR0aCk7XG5cblx0Ly9jb25zb2xlLmxvZyhmVG9wLCBmTGVmdCk7XG5cdGlmIChwdXJwb3NlSW1nKSB7XG5cdFx0cHVycG9zZUltZy5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24nLCBmTGVmdC50b1N0cmluZygpICsgJyUgJyArIGZUb3AudG9TdHJpbmcoKSArICclJyk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0JCgnLnB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZSAucHVycG9zZS1pbWcnKS5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24nLCBmTGVmdC50b1N0cmluZygpICsgJyUgJyArIGZUb3AudG9TdHJpbmcoKSArICclJyk7XG5cdH1cblxufVxuXG4kKCcjZm9jYWxSZWN0VG9nZ2xlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG5cdFx0JCgnLnByID4gLnByZXZpZXcnKS5yZW1vdmVDbGFzcygnZm9jYWwgbGluZSByZWN0Jyk7XG5cdFx0JChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHR9IGVsc2Uge1xuXHRcdCQoJy5wciA+IC5wcmV2aWV3JykuYWRkQ2xhc3MoJ2ZvY2FsIGxpbmUgcmVjdCcpO1xuXHRcdCQoJy5wciA+IC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ3BvaW50Jyk7XG5cdFx0JCgnI2ZvY2FsUG9pbnRUb2dnbGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0JChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cblx0XHQvLyQoJy5mb2NhbFJlY3QnKS5yZXNpemFibGUoe2hhbmRsZXM6IFwiYWxsXCIsIGNvbnRhaW5tZW50OiBcIiNwcmV2aWV3SW1nXCJ9KTtcblx0XHRhZGp1c3RSZWN0KCQoJy5wdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UtaW1nJykuZmlyc3QoKSk7XG5cdFx0JCgnLmZvY2FsUmVjdCcpLmRyYWdnYWJsZSh7IGNvbnRhaW5tZW50OiBcIiNwcmV2aWV3SW1nXCIsIHNjcm9sbDogZmFsc2UgfSk7XG5cblx0XHQkKCcucHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlLWltZycpLnVuYmluZCgpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRcdGFkanVzdFJlY3QoJChlLnRhcmdldCkpO1xuXHRcdH0pO1xuXHRcdC8vJCgnLmltZy13cmFwcGVyJykuY3NzKCdtYXgtd2lkdGgnLCAnOTAlJyk7XG5cdFx0c2V0UHVycG9zZVBhZ2luYXRpb24oKTtcblx0fVxufSk7XG5cbnZhciBvcmlnaW5hbERpdlN0eWxlLCBvcmlnaW5hbEltZ1N0eWxlLCBpbWFnZVJhdGlvO1xuXG4vKkJ1bGsgRGVsZXRlIC0gd2hpY2ggdXNlZCB0byBiZSBidWxrUmVtb3ZlICovXG4kKCcjYnVsa0RlbGV0ZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHQvL2lmICgkKCcjYWwnKSkge1xuXHRcdCQoJyNkZWxldGVGaWxlcycpLnRvZ2dsZUNsYXNzKCdtb2RhbCBoaWRkZW4nKTtcblx0XHQkKCcuY3QgLmZpbGUuc2VsZWN0ZWQnKS5hZGRDbGFzcygnc2JyJyk7XG5cbn0pO1xuLyogQ2xpY2sgb24gQWRkIFN0eWxlcyAqL1xuJCgnI2FkZFN0eWxlcycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0JCgnI2FzJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHQkKCcjYXMnKS5hZGRDbGFzcygnbW9kYWwnKTsgLy9hc1xuXHQkKCcjd3JhcHBlcicpLmFkZENsYXNzKCdvdmVyZmxvdycpO1xuXHQkKCcuZWZmZWN0JykuZGV0YWNoKCk7XG5cdCQoJyN2aWV3QWxsJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHR1cGRhdGVGaWx0ZXJzKCk7XG59KTtcbi8qIENsb3NlIEFkZCBTdHlsZXMgKi9cbiQoJy5hcyA+IC5jbG9zZSwgLmFzID4gLmNvbnRyb2xzLCAuYXMgPiAuY29udHJvbHMgLmJ1dHRvbicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHQkKCcuYXMnKS5hZGRDbGFzcygnd2lsbENsb3NlJyk7XG5cdCQoJy5jdCAuc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblx0JCgnI3NlbGVjdEFsbCcpLmFkZENsYXNzKCdlbXB0eScpLnJlbW92ZUNsYXNzKCdhbGwnKTtcbn0pO1xuXG5cbmZ1bmN0aW9uIHRyYW5zZm9ybURpdihlbCwgZmlsdGVycykge1xuXHR2YXIgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWwuYXR0cignaWQnKSksXG5cdFx0aW1nID0gZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbWcnKVswXSxcblx0XHRpbSA9ICQoaW1nKTtcblxuXG5cdGNvbnNvbGUubG9nKGltZywgaSwgaW1nV2lkdGgsIGltZ0hlaWdodCk7XG5cblxuXG5cblx0aWYgKCFvcmlnaW5hbERpdlN0eWxlKSB7XG5cdFx0b3JpZ2luYWxEaXZTdHlsZSA9IGRpdi5zdHlsZTtcblx0fSBlbHNlIHtcblx0XHRkaXYuc3R5bGUgPSBvcmlnaW5hbERpdlN0eWxlO1xuXHR9XG5cdGlmICghb3JpZ2luYWxJbWdTdHlsZSkge1xuXHRcdG9yaWdpbmFsSW1nU3R5bGUgPSBpbWcuc3R5bGU7XG5cdH0gZWxzZSB7XG5cdFx0aW1nLnN0eWxlID0gb3JpZ2luYWxJbWdTdHlsZTtcblx0fVxuXHRlbC5yZW1vdmVBdHRyKCdzdHlsZScpO1xuXHRpbS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuXG5cdHZhciBpbWdXaWR0aCA9IGltZy5jbGllbnRXaWR0aCwvL2dldEJvdW5kaW5nQ2xpZW50UmVjdC53aWR0aDtcblx0XHRpbWdIZWlnaHQgPSBpbWcuY2xpZW50SGVpZ2h0Oy8vZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmhlaWdodDtcblx0XHQvL2ltYWdlUmF0aW8gPSBpbWdXaWR0aC9pbWdIZWlnaHQ7XG5cblx0Ly9jb25zb2xlLmxvZyhlbC5hdHRyKCdzdHlsZScpLCBvcmlnaW5hbFN0eWxlKTtcblx0Zm9yICh2YXIgaT0wOyBpPCBmaWx0ZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGZpbHRlciA9IGZpbHRlcnNbaV07XG5cblx0XHRzd2l0Y2goZmlsdGVyLm5hbWUpIHtcblx0XHRcdGNhc2UgJ2Rlc2F0dXJhdGUnOlxuXHRcdFx0XHRpbS5jc3MoJy13ZWJraXQtZmlsdGVyJywgJ2dyYXlzY2FsZSgnICsgZmlsdGVyLnZhbHVlLnNhdHVyYXRpb24vMTAwICsgJyknKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgJ3NjYWxlJzpcblx0XHRcdFx0aW0uY3NzKCd3aWR0aCcsIGZpbHRlci52YWx1ZS53aWR0aCk7XG5cdFx0XHRcdGltLmNzcygnaGVpZ2h0JywgZmlsdGVyLnZhbHVlLmhlaWdodCk7XG5cdFx0XHRcdGlmICghZmlsdGVyLnZhbHVlLnJhdGlvKSB7XG5cdFx0XHRcdFx0ZWwuY3NzKCdiYWNrZ3JvdW5kLXNpemUnLCAnMTAwJSAxMDAlJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgJ2Nyb3AnOlxuXHRcdFx0XHR2YXIgdyA9IGVsLndpZHRoKCksXG5cdFx0XHRcdFx0aCA9IGVsLmhlaWdodCgpLFxuXHRcdFx0XHRcdHNpemUgPSB3LnRvU3RyaW5nKCkgKyAncHggJyArIGgudG9TdHJpbmcoKSsgJ3B4Jztcblx0XHRcdFx0ZWwuY3NzKCd3aWR0aCcsIGZpbHRlci52YWx1ZS53aWR0aCk7XG5cdFx0XHRcdGVsLmNzcygnaGVpZ2h0JywgZmlsdGVyLnZhbHVlLmhlaWdodCk7XG5cdFx0XHRcdGVsLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbicsICdjZW50ZXInKTtcblx0XHRcdFx0ZWwuY3NzKCdiYWNrZ3JvdW5kLXNpemUnLCBzaXplKTtcblx0XHRcdFx0aW0uY3NzKCdtYXgtaGVpZ2h0JywgJ25vbmUnKTtcblx0XHRcdFx0aW0uY3NzKCdtYXgtd2lkdGgnLCAnbm9uZScpO1xuXHRcdFx0XHRpbS5jc3MoJ2hlaWdodCcsIGltZ0hlaWdodCk7XG5cdFx0XHRcdGltLmNzcygnd2lkdGgnLCBpbWdXaWR0aCk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlICdyb3RhdGUnOiB7XG5cdFx0XHRcdGVsLmNzcygndHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgZmlsdGVyLnZhbHVlLmFuZ2xlICsgJ2RlZyknKTtcblx0XHRcdFx0aWYgKGZpbHRlci52YWx1ZS5yYW5kb20gJiYgIWZpbHRlci52YWx1ZS5hbmdsZSkge1xuXHRcdFx0XHRcdGVsLmNzcygndHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgKE1hdGgucmFuZG9tKCkqMTAgLSA1KSArICdkZWcpJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblxuXHRcdH1cblx0fVxufVxuZnVuY3Rpb24gZGlzYWJsZUZpbHRlcihlKSB7XG5cdCQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRjb25zb2xlLmxvZygkKCcuZWZmZWN0IC5zd2l0Y2g6Y2hlY2tlZCcpLmxlbmd0aCwgJCgnLmVmZmVjdCAuc3dpdGNoJykubGVuZ3RoKTtcblx0aWYgKCQoJy5lZmZlY3QgLnN3aXRjaDpjaGVja2VkJykubGVuZ3RoID09PSAwKSB7XG5cdFx0JCgnI3ZpZXdBbGxUb2dnbGUnKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuXHR9XG5cdGlmICgkKCcuZWZmZWN0IC5zd2l0Y2g6Y2hlY2tlZCcpLmxlbmd0aCA9PT0gJCgnLmVmZmVjdCAuc3dpdGNoJykubGVuZ3RoKSB7XG5cdFx0JCgnI3ZpZXdBbGxUb2dnbGUnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG5cdH1cblx0dXBkYXRlRmlsdGVycygpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVGaWx0ZXJzKGUpIHtcblxuXHR2YXIgZmlsdGVycyA9IFtdO1xuXHQvLyQoJy5maWx0ZXInKS5lYWNoKClcblx0JC5lYWNoKCQoJy5lZmZlY3QnKS5ub3QoJy5oaWRkZW4sIC5kaXNhYmxlZCcpLCBmdW5jdGlvbihpLCBlbCkge1xuXHRcdHZhciBmaWx0ZXIgPSB7fTtcblx0XHRmaWx0ZXIubmFtZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RpdGxlJylbMF0uaW5uZXJIVE1MLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRmaWx0ZXIudmFsdWUgPSB7fTtcblx0XHR2YXIgaW5wdXRzID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndmFsdWVzJylbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0Jyk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGk8aW5wdXRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaW5wdXQgPSBpbnB1dHNbaV07XG5cdFx0XHR2YXIgaW5wdXROYW1lID0gaW5wdXQuaWQuc3BsaXQoJy0nKVsxXTtcblx0XHRcdGZpbHRlci52YWx1ZVtpbnB1dE5hbWVdID0gcGFyc2VGbG9hdChpbnB1dC52YWx1ZS5zcGxpdCgnICcpWzBdKTtcblx0XHRcdGNvbnNvbGUubG9nKGZpbHRlcik7XG5cdFx0fVxuXG5cdFx0ZmlsdGVycy5wdXNoKGZpbHRlcik7XG5cdFx0Y29uc29sZS5sb2coZWwsICQoZWwpLmNoaWxkcmVuKCcudGl0bGUnKSwgZmlsdGVyLCBmaWx0ZXJzKTtcblx0fSk7XG5cdHRyYW5zZm9ybURpdigkKCcjaW1nJyksIGZpbHRlcnMpO1xuXG5cdC8qaWYgKGUudGFyZ2V0KSB7XG5cdFx0dmFyIHR5cGUgPSBlLnRhcmdldC5pZC5zcGxpdCgnLScpWzFdO1xuXG5cdFx0c3dpdGNoKHR5cGUpIHtcblx0XHRcdGNhc2UgJ3dpZHRoJzpcblx0XHRcdFx0Y29uc29sZS5sb2coZS50YXJnZXQudmFsdWUpO1xuXHRcdFx0XHRlLnRhcmdldC52YWx1ZSA9IGUudGFyZ2V0LnZhbHVlLnRvU3RyaW5nKCkgKyAnIHB4Jztcblx0XHRcdFx0Y29uc29sZS5sb2coZS50YXJnZXQudmFsdWUpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH0qL1xufVxuLy8kKCcuZmlsdGVyIGlucHV0JykuY2hhbmdlKHVwZGF0ZUZpbHRlcnMpO1xuZnVuY3Rpb24gaGFuZGxlU3RhcnRFZGl0aW5nKGUpIHtcblx0Y29uc29sZS5sb2coZS50YXJnZXQpO1xuXHRpZiAoZS50YXJnZXQudHlwZSA9PT0gJ3RleHQnKSB7XG5cdFx0ZS50YXJnZXQudmFsdWUgPSBlLnRhcmdldC52YWx1ZS5zcGxpdCgnICcpWzBdO1xuXHRcdGUudGFyZ2V0LnR5cGUgPSAnbnVtYmVyJztcblx0fVxufVxuZnVuY3Rpb24gaGFuZGxlRW5kRWRpdGluZyhlKSB7XG5cdHZhciB0eXBlID0gZS50YXJnZXQuaWQuc3BsaXQoJy0nKVsxXTtcblx0Y29uc29sZS5sb2coZS50YXJnZXQudHlwZSwgZS50YXJnZXQudmFsdWUsIHR5cGUpO1xuXHRlLnRhcmdldC50eXBlPSd0ZXh0Jztcblx0Y29uc29sZS5sb2coZS50YXJnZXQudHlwZSwgZS50YXJnZXQudmFsdWUsIHR5cGUpO1xuXHRpZiAoZS50YXJnZXQudmFsdWUpIHtcblx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdGNhc2UgJ3dpZHRoJzpcblx0XHRcdFx0ZS50YXJnZXQudmFsdWUgPSBlLnRhcmdldC52YWx1ZSArICcgcHgnO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAnaGVpZ2h0Jzpcblx0XHRcdFx0ZS50YXJnZXQudmFsdWUgPSBlLnRhcmdldC52YWx1ZSArICcgcHgnO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAnc2F0dXJhdGlvbic6XG5cdFx0XHRcdGUudGFyZ2V0LnZhbHVlID0gZS50YXJnZXQudmFsdWUgKyAnICUnO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAnYW5nbGUnOlxuXHRcdFx0XHRlLnRhcmdldC52YWx1ZSA9IGUudGFyZ2V0LnZhbHVlICsgJyDCsCc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxufVxuZnVuY3Rpb24gaGFuZGxlRWRpdGluZyhlKSB7XG5cdHZhciByYXRpbyA9IGUudGFyZ2V0LnBhcmVudE5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncmF0aW8nKVswXSxcblx0XHR0YXJnZXRUeXBlID0gZS50YXJnZXQuaWQuc3BsaXQoJy0nKVsxXSxcblx0XHR0YXJnZXRJZCA9IGUudGFyZ2V0LmlkLnNwbGl0KCctJyksXG5cdFx0b3RoZXJGaWVsZCwgaWQ7XG5cblx0aWYgKHJhdGlvLmNoZWNrZWQgJiYgaW1hZ2VSYXRpbykge1xuXG5cdFx0aWYgKHRhcmdldFR5cGUgPT09ICd3aWR0aCcpIHtcblx0XHRcdGlkID0gdGFyZ2V0SWRbMF0gKyAnLWhlaWdodC0nICsgdGFyZ2V0SWRbMl07XG5cdFx0XHRvdGhlckZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXHRcdFx0b3RoZXJGaWVsZC52YWx1ZSA9IE1hdGgucm91bmQoZS50YXJnZXQudmFsdWUgLyBpbWFnZVJhdGlvKS50b1N0cmluZygpICsgJyBweCc7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHRhcmdldFR5cGUgPT09ICdoZWlnaHQnKSB7XG5cdFx0XHRpZCA9IHRhcmdldElkWzBdICsgJy13aWR0aC0nICsgdGFyZ2V0SWRbMl07XG5cdFx0XHRvdGhlckZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXHRcdFx0b3RoZXJGaWVsZC52YWx1ZSA9IE1hdGgucm91bmQoZS50YXJnZXQudmFsdWUgKiBpbWFnZVJhdGlvKS50b1N0cmluZygpICsgJyBweCc7XG5cdFx0fVxuXHR9XG5cdHVwZGF0ZUZpbHRlcnMoZSk7XG59XG5mdW5jdGlvbiBoYW5kbGVSYXRpb1RvZ2dsZShlKSB7XG5cdHZhciBpbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWcnKS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW1nJylbMF07XG5cdFx0aW1hZ2VSYXRpbyA9IGltYWdlLm9mZnNldFdpZHRoL2ltYWdlLm9mZnNldEhlaWdodDtcbn1cblxuXG4vKiB3aGVuIHlvdSBzZWxlY3QgYW4gZWZmZWN0LCBpdCdzIGdvaW5nIHRvIGJlIHJlcGxhY2VkIHdpdGggYW5vdGhlciBzZXQgb2YgaW5wdXQgZmllbGRzICovXG4kKCcjYWRkRWZmZWN0JykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHQkKGUudGFyZ2V0KS5wYXJlbnQoKS5hZGRDbGFzcygnb3BlbicpO1xufSk7XG4kKCcjc2VsZWN0X25ld19lZmZlY3QgbGknKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdHZhciBzZWxlY3QgPSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKSxcblx0XHRpdGVtID0gJChlLnRhcmdldCksXG5cdFx0c3BhblN0cmluZyA9IHNlbGVjdC5jaGlsZHJlbignc3BhbicpLnRleHQoKTtcblxuXHRpZiAoIWltYWdlUmF0aW8pIHtcblx0XHR2YXIgaW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1nJykuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltZycpWzBdO1xuXHRcdGltYWdlUmF0aW8gPSBpbWFnZS5vZmZzZXRXaWR0aC9pbWFnZS5vZmZzZXRIZWlnaHQ7XG5cdH1cblxuXHRzZWxlY3QucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0JCgnI3ZpZXdBbGwnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cblx0dmFyIHRpdGxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygndGl0bGUnKS50ZXh0KGl0ZW0udGV4dCgpKS5jbGljayhjb2xsYXBzZVBhbm5lbCksXG5cdFx0dG9nZ2xlID0gJCgnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQvPicpLmFkZENsYXNzKCdzd2l0Y2gnKS5jaGFuZ2UoZGlzYWJsZUZpbHRlciksXG5cdFx0Y2xvc2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjbG9zZScpLmNsaWNrKHJlbW92ZUVmZmVjdCksXG5cdFx0aGVhZGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaGVhZGVyJykuYXBwZW5kKHRvZ2dsZSwgdGl0bGUsIGNsb3NlKS5jbGljayhjb2xsYXBzZVBhbm5lbCksXG5cdFx0dmFsdWVzID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygndmFsdWVzJylcblx0XHRmaWx0ZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdlZmZlY3Qgb3BlbicpLmFwcGVuZChoZWFkZXIsIHZhbHVlcyk7XG5cblx0XHRmQ291bnQgPSAkKCcuZWZmZWN0JykubGVuZ3RoICsgMTtcblxuXHRcdHN3aXRjaChpdGVtLnRleHQoKS50b0xvd2VyQ2FzZSgpKSB7XG5cblx0XHRcdGNhc2UgJ2Rlc2F0dXJhdGUnOiB7XG5cdFx0XHRcdHZhciBzYXR1cmF0aW9uID0gJCgnPGlucHV0IHR5cGU9XCJudW1iZXJcIi8+Jylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgaXRlbS50ZXh0KCkudG9Mb3dlckNhc2UoKSArICctc2F0dXJhdGlvbi0nICsgZkNvdW50KVxuXHRcdFx0XHRcdFx0XHQuYXR0cigncGxhY2Vob2xkZXInLCAnRGVzYXR1cmF0aW9uLCAlJylcblx0XHRcdFx0XHRcdFx0LmNzcygnd2lkdGgnLCAnY2FsYyg2MCUgLSAyNXB4KScpXG5cdFx0XHRcdFx0XHRcdC5jc3MoJ21hcmdpbi1yaWdodCcsICcxMHB4Jylcblx0XHRcdFx0XHRcdFx0Lm9uKCdpbnB1dCcsIHVwZGF0ZUZpbHRlcnMpXG5cdFx0XHRcdFx0XHRcdC5vbignZm9jdXMnLCBoYW5kbGVTdGFydEVkaXRpbmcpXG5cdFx0XHRcdFx0XHRcdC5vbignYmx1cicsIGhhbmRsZUVuZEVkaXRpbmcpO1xuXG5cdFx0XHRcdHZhbHVlcy5hcHBlbmQoc2F0dXJhdGlvbik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlICdyZXNpemUnOiB7XG5cdFx0XHRcdHZhciB3aWR0aCA9ICQoJzxpbnB1dCB0eXBlPVwidGV4dFwiLz4nKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignaWQnLCBpdGVtLnRleHQoKS50b0xvd2VyQ2FzZSgpICsgJy13aWR0aC0nICsgZkNvdW50KVxuXHRcdFx0XHRcdFx0XHQuYXR0cigncGxhY2Vob2xkZXInLCAnV2lkdGgnKVxuXHRcdFx0XHRcdFx0XHQuY3NzKCd3aWR0aCcsICdjYWxjKDUwJSAtIDMwcHgpJylcblx0XHRcdFx0XHRcdFx0LmNzcygnbWFyZ2luLXJpZ2h0JywgJzIzcHgnKVxuXHRcdFx0XHRcdFx0XHQub24oJ2lucHV0JywgaGFuZGxlRWRpdGluZylcblx0XHRcdFx0XHRcdFx0Lm9uKCdmb2N1cycsIGhhbmRsZVN0YXJ0RWRpdGluZylcblx0XHRcdFx0XHRcdFx0Lm9uKCdibHVyJywgaGFuZGxlRW5kRWRpdGluZyksXG5cblx0XHRcdFx0XHRoZWlnaHQgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIi8+Jylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgaXRlbS50ZXh0KCkudG9Mb3dlckNhc2UoKSArICctaGVpZ2h0LScgKyBmQ291bnQpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdwbGFjZWhvbGRlcicsICdIZWlnaHQnKVxuXHRcdFx0XHRcdFx0XHQuY3NzKCd3aWR0aCcsICdjYWxjKDUwJSAtIDMwcHgpJylcblx0XHRcdFx0XHRcdFx0Lm9uKCdpbnB1dCcsIGhhbmRsZUVkaXRpbmcpXG5cdFx0XHRcdFx0XHRcdC5vbignZm9jdXMnLCBoYW5kbGVTdGFydEVkaXRpbmcpXG5cdFx0XHRcdFx0XHRcdC5vbignYmx1cicsIGhhbmRsZUVuZEVkaXRpbmcpLFxuXG5cdFx0XHRcdFx0cmF0aW8gPSAkKCc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdGFiaW5kZXg9XCItMVwiLz4nKVxuXHRcdFx0XHRcdFx0XHQuYXR0cignaWQnLCBpdGVtLnRleHQoKS50b0xvd2VyQ2FzZSgpICsgJy1yYXRpby0nICsgZkNvdW50KVxuXHRcdFx0XHRcdFx0XHQuYWRkQ2xhc3MoJ3JhdGlvJylcblx0XHRcdFx0XHRcdFx0LmNoYW5nZShoYW5kbGVSYXRpb1RvZ2dsZSk7XG5cblx0XHRcdFx0dmFsdWVzLmFwcGVuZCh3aWR0aCwgcmF0aW8sIGhlaWdodCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlICdjcm9wJzoge1xuXHRcdFx0XHR2YXIgd2lkdGggPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIi8+Jylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgaXRlbS50ZXh0KCkudG9Mb3dlckNhc2UoKSArICctd2lkdGgtJyArIGZDb3VudClcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3BsYWNlaG9sZGVyJywgJ1dpZHRoJylcblx0XHRcdFx0XHRcdFx0LmNzcygnd2lkdGgnLCAnY2FsYyg1MCUgLSAzMHB4KScpXG5cdFx0XHRcdFx0XHRcdC5jc3MoJ21hcmdpbi1yaWdodCcsICcyM3B4Jylcblx0XHRcdFx0XHRcdFx0Lm9uKCdpbnB1dCcsIGhhbmRsZUVkaXRpbmcpXG5cdFx0XHRcdFx0XHRcdC5vbignZm9jdXMnLCBoYW5kbGVTdGFydEVkaXRpbmcpXG5cdFx0XHRcdFx0XHRcdC5vbignYmx1cicsIGhhbmRsZUVuZEVkaXRpbmcpLFxuXG5cdFx0XHRcdFx0aGVpZ2h0ID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIvPicpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdpZCcsIGl0ZW0udGV4dCgpLnRvTG93ZXJDYXNlKCkgKyAnLWhlaWdodC0nICsgZkNvdW50KVxuXHRcdFx0XHRcdFx0XHQuYXR0cigncGxhY2Vob2xkZXInLCAnSGVpZ2h0Jylcblx0XHRcdFx0XHRcdFx0LmNzcygnd2lkdGgnLCAnY2FsYyg1MCUgLSAzMHB4KScpXG5cdFx0XHRcdFx0XHRcdC5vbignaW5wdXQnLCBoYW5kbGVFZGl0aW5nKVxuXHRcdFx0XHRcdFx0XHQub24oJ2ZvY3VzJywgaGFuZGxlU3RhcnRFZGl0aW5nKVxuXHRcdFx0XHRcdFx0XHQub24oJ2JsdXInLCBoYW5kbGVFbmRFZGl0aW5nKSxcblxuXHRcdFx0XHRcdHJhdGlvID0gJCgnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHRhYmluZGV4PVwiLTFcIi8+Jylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgaXRlbS50ZXh0KCkudG9Mb3dlckNhc2UoKSArICctcmF0aW8tJyArIGZDb3VudClcblx0XHRcdFx0XHRcdFx0LmFkZENsYXNzKCdyYXRpbycpXG5cdFx0XHRcdFx0XHRcdC5jaGFuZ2UoaGFuZGxlUmF0aW9Ub2dnbGUpO1xuXG5cdFx0XHRcdHZhbHVlcy5hcHBlbmQod2lkdGgsIHJhdGlvLCBoZWlnaHQpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGNhc2UgJ3NjYWxlJzoge1xuXHRcdFx0XHR2YXIgd2lkdGggPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIi8+Jylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgaXRlbS50ZXh0KCkudG9Mb3dlckNhc2UoKSArICctd2lkdGgtJyArIGZDb3VudClcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3BsYWNlaG9sZGVyJywgJ1dpZHRoJylcblx0XHRcdFx0XHRcdFx0LmNzcygnd2lkdGgnLCAnY2FsYyg1MCUgLSAzMHB4KScpXG5cdFx0XHRcdFx0XHRcdC5jc3MoJ21hcmdpbi1yaWdodCcsICcyM3B4Jylcblx0XHRcdFx0XHRcdFx0Lm9uKCdpbnB1dCcsIGhhbmRsZUVkaXRpbmcpXG5cdFx0XHRcdFx0XHRcdC5vbignZm9jdXMnLCBoYW5kbGVTdGFydEVkaXRpbmcpXG5cdFx0XHRcdFx0XHRcdC5vbignYmx1cicsIGhhbmRsZUVuZEVkaXRpbmcpLFxuXG5cdFx0XHRcdFx0aGVpZ2h0ID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIvPicpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdpZCcsIGl0ZW0udGV4dCgpLnRvTG93ZXJDYXNlKCkgKyAnLWhlaWdodC0nICsgZkNvdW50KVxuXHRcdFx0XHRcdFx0XHQuYXR0cigncGxhY2Vob2xkZXInLCAnSGVpZ2h0Jylcblx0XHRcdFx0XHRcdFx0LmNzcygnd2lkdGgnLCAnY2FsYyg1MCUgLSAzMHB4KScpXG5cdFx0XHRcdFx0XHRcdC5vbignaW5wdXQnLCBoYW5kbGVFZGl0aW5nKVxuXHRcdFx0XHRcdFx0XHQub24oJ2ZvY3VzJywgaGFuZGxlU3RhcnRFZGl0aW5nKVxuXHRcdFx0XHRcdFx0XHQub24oJ2JsdXInLCBoYW5kbGVFbmRFZGl0aW5nKSxcblxuXHRcdFx0XHRcdHJhdGlvID0gJCgnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHRhYmluZGV4PVwiLTFcIi8+Jylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgaXRlbS50ZXh0KCkudG9Mb3dlckNhc2UoKSArICctcmF0aW8tJyArIGZDb3VudClcblx0XHRcdFx0XHRcdFx0LmFkZENsYXNzKCdyYXRpbycpXG5cdFx0XHRcdFx0XHRcdC5jaGFuZ2UoaGFuZGxlUmF0aW9Ub2dnbGUpO1xuXG5cdFx0XHRcdHZhbHVlcy5hcHBlbmQod2lkdGgsIHJhdGlvLCBoZWlnaHQpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSAncm90YXRlJzoge1xuXHRcdFx0XHR2YXIgYW5nbGUgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIi8+Jylcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ2lkJywgaXRlbS50ZXh0KCkudG9Mb3dlckNhc2UoKSArICctYW5nbGUtJyArIGZDb3VudClcblx0XHRcdFx0XHRcdFx0LmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0FuZ2xlLCBkZWcnKVxuXHRcdFx0XHRcdFx0XHQuY3NzKCd3aWR0aCcsICdjYWxjKDUwJSAtIDI1cHgpJylcblx0XHRcdFx0XHRcdFx0LmNzcygnbWFyZ2luLXJpZ2h0JywgJzEwcHgnKVxuXHRcdFx0XHRcdFx0XHQub24oJ2lucHV0JywgdXBkYXRlRmlsdGVycylcblx0XHRcdFx0XHRcdFx0Lm9uKCdmb2N1cycsIGhhbmRsZVN0YXJ0RWRpdGluZylcblx0XHRcdFx0XHRcdFx0Lm9uKCdibHVyJywgaGFuZGxlRW5kRWRpdGluZyksXG5cblx0XHRcdFx0XHRyYW5kb20gPSAkKCc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIvPicpXG5cdFx0XHRcdFx0XHRcdC5hdHRyKCdpZCcsIGl0ZW0udGV4dCgpLnRvTG93ZXJDYXNlKCkgKyAnLXJhbmRvbS0nICsgZkNvdW50KVxuXHRcdFx0XHRcdFx0XHQuY2hhbmdlKHVwZGF0ZUZpbHRlcnMpO1xuXG5cdFx0XHRcdHZhbHVlcy5hcHBlbmQoYW5nbGUpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkKCcjZWZmZWN0X2xpc3QnKS5hcHBlbmQoZmlsdGVyKTtcbn0pO1xuJCgnI2VmZmVjdF9saXN0Jykuc29ydGFibGUoKTtcblxuJCgnKicpLm5vdCgnLnNlbGVjdF9lZmZlY3QgbGksIC5zZWxlY3RfZWZmZWN0LCAuc2VsZWN0X2VmZmVjdCAuYnV0dG9uJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRpZiAoJCgnLnNlbGVjdF9lZmZlY3QnKS5oYXNDbGFzcygnb3BlbicpKSB7XG5cdFx0JCgnLnNlbGVjdF9lZmZlY3QnKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuXHR9XG59KTtcblxuLyogUmVtb3ZlIEVmZmVjdCAqL1xuZnVuY3Rpb24gcmVtb3ZlRWZmZWN0KGUpIHtcblx0JChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlKCk7XG5cdHVwZGF0ZUZpbHRlcnMoKTtcbn1cblxuLyogZWZmZWN0IGFsbCBidXR0b24gY29udHJvbHMgYWxsIHRoZSBidXR0b25zICovXG4kKCcjdmlld0FsbFRvZ2dsZScpLmNoYW5nZShmdW5jdGlvbihlKSB7XG5cdCQoJy5lZmZlY3QgLmhlYWRlciAuc3dpdGNoJykucHJvcCgnY2hlY2tlZCcsIGUudGFyZ2V0LmNoZWNrZWQpO1xuXHRpZiAoZS50YXJnZXQuY2hlY2tlZCkgeyQoJy5lZmZlY3QnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTt9XG5cdGVsc2UgeyQoJy5lZmZlY3QnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTt9XG5cdHVwZGF0ZUZpbHRlcnMoKTtcbn0pO1xuXG4kKCcucHVycG9zZSAuY2xvc2UnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cblx0aWYgKCQoJy5jdCAucHVycG9zZS5zZWxlY3RlZCcpLmxlbmd0aCA+IDApIHtcblx0XHQkKCcjZGVsZXRlRmlsZXMnKS50b2dnbGVDbGFzcygnbW9kYWwgaGlkZGVuJyk7XG5cdFx0JCgnLmN0IC5wdXJwb3NlLnNlbGVjdGVkJykuYWRkQ2xhc3MoJ3NicicpO1xuXHR9IGVsc2Uge1xuXHRcdCQoJyNkZWxldGVGaWxlcycpLnRvZ2dsZUNsYXNzKCdtb2RhbCBoaWRkZW4nKTtcblx0XHRlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdzYnInKTtcblx0fVxufSk7XG4kKCcucHVycG9zZS1jb250cm9scycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0ZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC50b2dnbGUoJ3NlbGVjdGVkJyk7XG5cdGlmICgkKCcuY3QgLnB1cnBvc2Uuc2VsZWN0ZWQnKS5sZW5ndGggPT09ICQoJy5jdCAucHVycG9zZScpLmxlbmd0aCkge1xuXHRcdCQoJyNzZWxlY3RBbGwnKS50b2dnbGVDbGFzcygnYWxsIGVtcHR5Jyk7XG5cdH0gZWxzZSBpZiAoJCgnLmN0IC5wdXJwb3NlLnNlbGVjdGVkJykubGVuZ3RoID4gMCAmJiAkKCcuY3QgLnB1cnBvc2Uuc2VsZWN0ZWQnKS5sZW5ndGggIT09ICQoJy5jdCAucHVycG9zZScpKSB7XG5cdFx0JCgnI3NlbGVjdEFsbCcpLnJlbW92ZUNsYXNzKCdhbGwgZW1wdHknKTtcblx0fSBlbHNlIGlmICgkKCcuY3QgLnB1cnBvc2Uuc2VsZWN0ZWQnKS5sZW5ndGggPT09IDApIHtcblx0XHQkKCcjc2VsZWN0QWxsJykuYWRkQ2xhc3MoJ2VtcHR5Jyk7XG5cdH1cbn0pO1xuXG4vKiBFZmZlY3QgcGFuZSAqL1xuZnVuY3Rpb24gY29sbGFwc2VQYW5uZWwoZSkge1xuXHRpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ3RpdGxlJykpIHtcblx0XHQkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS50b2dnbGVDbGFzcygnb3BlbicpO1xuXHR9IGVsc2Uge1xuXHRcdCQoZS50YXJnZXQpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY2xvc2VFZGl0U2NyZWVuKCkge1xuICAgICQoJy5wcicpLnJlbW92ZUNsYXNzKCdtb2RhbCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0JCgnLnByIC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ2ZvY2FsIGxpbmUgZnVsbCByZWN0IHBvaW50Jyk7XG5cdCQoJy5mb2NhbFBvaW50JykucmVtb3ZlQXR0cignc3R5bGUnKTtcblx0JCgnLmZvY2FsUmVjdCcpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG5cdCQoJyNmb2NhbFBvaW50VG9nZ2xlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHQkKCcjZm9jYWxSZWN0VG9nZ2xlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHQkKCcucHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlIC5wdXJwb3NlLWltZycpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG5cdCQoJy5jdCAuZmlsZScpLmZpbmQoJ2J1dHRvbicpLmNzcygnZGlzcGxheScsICcnKTtcblx0ZGVzZWxlY3RBbGwoKTtcblx0JCgnI3dyYXBwZXInKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3cnKTtcbn1cblxuZnVuY3Rpb24gc2hvd01vZGFsUHJvbXB0KHRpdGxlLCB0ZXh0LCBjb25maXJtVGV4dCwgY29uZmlybUFjdGlvbiwgY2FuY2VsVGV4dCwgY2FuY2VsQWN0aW9uKSB7XG4gICAgdmFyIG1vZGFsID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcyhvcCwgbW9kYWwpO1xufVxuXG5mdW5jdGlvbiBzaG93Tm90aWZpY2F0aW9uKHRleHQsIHRvcCkge1xuICAgIHZhciBub3RpZmljYXRpb24gPSAkKCcubm90aWZpY2F0aW9uJyksXG4gICAgICAgIG5vdGlmaWNhdGlvblRleHQgPSAkKCcubm90aWZpY2F0aW9uX190ZXh0Jyk7XG5cbiAgICBpZiAobm90aWZpY2F0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBub3RpZmljYXRpb24gPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdub3RpZmljYXRpb24nKTtcbiAgICAgICAgbm90aWZpY2F0aW9uVGV4dCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ25vdGlmaWNhdGlvbl9fdGV4dCcpO1xuICAgICAgICBub3RpZmljYXRpb24uYXBwZW5kKG5vdGlmaWNhdGlvblRleHQpO1xuICAgIH1cblxuICAgIGlmICgkKCcubW9kYWwgLnByZXZpZXcnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICQoJy5tb2RhbCAucHJldmlldycpLmFwcGVuZChub3RpZmljYXRpb24pO1xuICAgIH0gZWxzZSBpZigkKCcuY3QnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICQoJy5jdCcpLmFwcGVuZChub3RpZmljYXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQobm90aWZpY2F0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAodG9wKSB7bm90aWZpY2F0aW9uLmNzcygndG9wJywgdG9wKTt9XG4gICAgbm90aWZpY2F0aW9uVGV4dC50ZXh0KHRleHQpO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBub3RpZmljYXRpb24ucmVtb3ZlKCk7XG4gICAgfSwgNDAwMCk7XG59XG5cbi8qdmFyIGpBcnJheT0gPD9waHAgZWNobyBqc29uX2VuY29kZShhcnJheShcbiAgICAnbGFiZWwnID0+ICdOZXcgc3R5bGUnLFxuICAgICdlZmZlY3RzJyA9PiBhcnJheShcbiAgICAgIDEgPT4gYXJyYXkoXG4gICAgICAgICduYW1lJyA9PiAnaW1hZ2VfY3JvcCcsXG4gICAgICAgICdkYXRhJyA9PiBhcnJheShcbiAgICAgICAgICAnd2lkdGgnID0+IDMwMCxcbiAgICAgICAgICAnaGVpZ2h0JyA9PiA0MDAsXG4gICAgICAgICAgJ2FuY2hvcicgPT4gJ2xlZnQtdG9wJyxcbiAgICAgICAgKSxcbiAgICAgICAgJ3dlaWdodCcgPT4gMSxcbiAgICAgICksXG4gICAgICAyID0+IGFycmF5KFxuICAgICAgICAnbmFtZScgPT4gJ2ltYWdlX2Rlc2F0dXJhdGUnLFxuICAgICAgICAnZGF0YScgPT4gYXJyYXkoKSxcbiAgICAgICAgJ3dlaWdodCcgPT4gMixcbiAgICAgICksXG4gICAgICAzID0+IGFycmF5KFxuICAgICAgICAnbmFtZScgPT4gJ2ltYWdlX3Jlc2l6ZScsXG4gICAgICAgICdkYXRhJyA9PiBhcnJheShcbiAgICAgICAgICAnd2lkdGgnID0+IDIwMCxcbiAgICAgICAgICAnaGVpZ2h0JyA9PiAyMDAsXG4gICAgICAgICksXG4gICAgICAgICd3ZWlnaHQnID0+IDMsXG4gICAgICApLFxuICAgICAgNCA9PiBhcnJheShcbiAgICAgICAgJ25hbWUnID0+ICdpbWFnZV9zY2FsZScsXG4gICAgICAgICdkYXRhJyA9PiBhcnJheShcbiAgICAgICAgICAnd2lkdGgnID0+IDE4MCxcbiAgICAgICAgICAnaGVpZ2h0JyA9PiAxODAsXG4gICAgICAgICAgJ3Vwc2NhbGUnID0+IDAsXG4gICAgICAgICksXG4gICAgICAgICd3ZWlnaHQnID0+IDQsXG4gICAgICApLFxuICAgICAgNSA9PiBhcnJheShcbiAgICAgICAgJ25hbWUnID0+ICdpbWFnZV9zY2FsZV9hbmRfY3JvcCcsXG4gICAgICAgICdkYXRhJyA9PiBhcnJheShcbiAgICAgICAgICAnd2lkdGgnID0+IDE1MCxcbiAgICAgICAgICAnaGVpZ2h0JyA9PiAxMDAsXG4gICAgICAgICksXG4gICAgICAgICd3ZWlnaHQnID0+IDUsXG4gICAgICApLFxuICAgICksXG4gICkpOyA/PlxuXG4gIGNvbnNvbGUubG9nKGpBcnJheSk7Ki9cbiQoJyNwdXJwb3NlVG9nZ2xlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRpZiAoJChlLnRhcmdldCkuY2hpbGRyZW4oJ3NwYW4nKS50ZXh0KCkgPT09ICcgVmlldyBhbGwnKSB7XG5cdFx0c2hvd0FsbFByZXZpZXdzKCk7XG5cdH0gZWxzZSB7XG5cdFx0Y29sbGFwc2VBbGxQcmV2aWV3cygpO1xuXHR9XG59KTtcblxuJCgnI3Nob3dQcmV2aWV3JykuY2xpY2soc2hvd0FsbFByZXZpZXdzKTtcblxuZnVuY3Rpb24gc2hvd0FsbFByZXZpZXdzKCkge1xuICAgICQoJy5wcmV2aWV3LmZvY2FsJykuYWRkQ2xhc3MoJ2Z1bGwnKS5yZW1vdmVDbGFzcygnbGluZScpO1xuICAgICQoJyNwdXJwb3NlVG9nZ2xlJykuY2hpbGRyZW4oJ3NwYW4nKS50ZXh0KCcgSGlkZSBQcmV2aWV3Jyk7XG4gICAgJCgnI3B1cnBvc2VUb2dnbGUnKS5jaGlsZHJlbignLmZhJykuYWRkQ2xhc3MoJ2ZhLWFycm93LWRvd24nKS5yZW1vdmVDbGFzcygnZmEtYXJyb3ctdXAnKTtcbiAgICAkKCcucHVycG9zZXMgLnB1cnBvc2UtaW1nJykudW5iaW5kKCdjbGljaycpLmNsaWNrKGhhbmRsZVB1cnBvc2VDbGljayk7XG4gICAgc2Nyb2xsUG9zaXRpb24gPSAkKCcjcHVycG9zZVdyYXBwZXInKS5zY3JvbGxMZWZ0KCk7XG5cbn1cblxuZnVuY3Rpb24gY29sbGFwc2VBbGxQcmV2aWV3cygpIHtcbiAgICAkKCcucHJldmlldy5mb2NhbCcpLmFkZENsYXNzKCdsaW5lJykucmVtb3ZlQ2xhc3MoJ2Z1bGwnKTtcbiAgICAkKCcjcHVycG9zZVRvZ2dsZScpLmNoaWxkcmVuKCdzcGFuJykudGV4dCgnIFZpZXcgYWxsJyk7XG4gICAgJCgnI3B1cnBvc2VUb2dnbGUnKS5jaGlsZHJlbignLmZhJykuYWRkQ2xhc3MoJ2ZhLWFycm93LXVwJykucmVtb3ZlQ2xhc3MoJ2ZhLWFycm93LWRvd24nKTtcbiAgICAkKCcucHVycG9zZXMgLnB1cnBvc2UtaW1nJykudW5iaW5kKCdjbGljaycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgYWRqdXN0UmVjdCgkKGUudGFyZ2V0KSk7XG4gICAgfSk7XG59XG5cbi8qIENsaWNrIG9uIFB1cnBvc2UgKi9cbmZ1bmN0aW9uIGhhbmRsZVB1cnBvc2VDbGljayhlKSB7XG5cdGNvbnNvbGUubG9nKHNjcm9sbFBvc2l0aW9uKTtcblx0dmFyIHB1cnBvc2UgPSAkKGUudGFyZ2V0KS5wYXJlbnQoKSxcblx0XHRwdXJwb3NlV3JhcHBlciA9ICQoJyNwdXJwb3NlV3JhcHBlcicpO1xuXG5cdHZhciBpbmRleCA9IHB1cnBvc2UucGFyZW50KCkuY2hpbGRyZW4oJy5wdXJwb3NlJykuaW5kZXgocHVycG9zZSksXG5cdFx0c2Nyb2xsT2Zmc2V0ID0gaW5kZXggKiAxNDA7XG5cblx0dmFyIHNjcm9sbERlbHRhID0gc2Nyb2xsT2Zmc2V0IC0gc2Nyb2xsUG9zaXRpb24sXG5cdFx0c2RzID0gc2Nyb2xsRGVsdGEgPiAwID8gJys9JyArIHNjcm9sbERlbHRhIDogJy09JyArIE1hdGguYWJzKHNjcm9sbERlbHRhKTtcblxuXHRcdGNvbnNvbGUubG9nKHNkcyk7XG5cblx0JCgnLnByZXZpZXcuZm9jYWwnKS50b2dnbGVDbGFzcygnbGluZSBmdWxsJyk7XG5cdCQoJyNwdXJwb3NlV3JhcHBlcicpLnNjcm9sbExlZnQoc2Nyb2xsUG9zaXRpb24pO1xuXHQkKCcjcHVycG9zZVRvZ2dsZScpLmNoaWxkcmVuKCcuZmEnKS50b2dnbGVDbGFzcygnZmEtYXJyb3ctdXAgZmEtYXJyb3ctZG93bicpO1xuXHQkKCcjcHVycG9zZVRvZ2dsZScpLmNoaWxkcmVuKCdzcGFuJykudGV4dCgnIFZpZXcgYWxsJyk7XG5cdCQoJyNwdXJwb3NlV3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogc2Nyb2xsT2Zmc2V0IH0sIDYwMCk7XG4gICAgJCgnLnB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICBwdXJwb3NlLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCcucHVycG9zZXMgLnB1cnBvc2UtaW1nJykudW5iaW5kKCkuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgICBhZGp1c3RSZWN0KCQoZS50YXJnZXQpKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY2hlY2tGaWVsZChmaWVsZCkge1xuICAgIGlmICgkKGZpZWxkKS52YWwoKSA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO31cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uIG1hcmtGaWVsZEFzUmVxdWlyZWQoZmllbGQpIHtcbiAgICAkKGZpZWxkKS5hZGRDbGFzcygnZW1wdHlGaWVsZCcpO1xuICAgIGlmICgkKGZpZWxkKS5wYXJlbnQoKS5jaGlsZHJlbignLmVyck1zZycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB2YXIgbXNnID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZXJyTXNnJykudGV4dChcIlRoaXMgZmllbGQgY291bGRuJ3QgYmUgZW1wdHlcIik7XG4gICAgICAgICQoZmllbGQpLnBhcmVudCgpLmFwcGVuZChtc2cpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1hcmtGaWVsZEFzTm9ybWFsKGZpZWxkKSB7XG4gICAgJChmaWVsZCkucmVtb3ZlQ2xhc3MoJ2VtcHR5RmllbGQnKTtcbiAgICAkKGZpZWxkKS5wYXJlbnQoKS5jaGlsZHJlbignLmVyck1zZycpLnJlbW92ZSgpO1xufVxuXG5mdW5jdGlvbiBjaGVja0ZpZWxkcyhzZWxlY3Rvcikge1xuICAgIHZhciBmaWVsZHMgPSAkKHNlbGVjdG9yKS5wYXJlbnQoKS5jaGlsZHJlbignaW5wdXQnKTtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICB2YXIgZmlyc3RJbmRleCA9IC0xO1xuICAgIGZpZWxkcy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICBjb25zb2xlLmxvZyhlbCk7XG4gICAgICAgIGlmIChjaGVja0ZpZWxkKGVsKSkge1xuICAgICAgICAgICAgbWFya0ZpZWxkQXNOb3JtYWwoZWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWFya0ZpZWxkQXNSZXF1aXJlZChlbCk7XG4gICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChmaXJzdEluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIGZpcnN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICBlbC5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4kKCdsYWJlbC5yZXF1aWVyZWQnKS5wYXJlbnQoKS5jaGlsZHJlbignaW5wdXQnKS5vbignYmx1cicsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoY2hlY2tGaWVsZChlLnRhcmdldCkpIHtcbiAgICAgICAgbWFya0ZpZWxkQXNOb3JtYWwoZS50YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1hcmtGaWVsZEFzUmVxdWlyZWQoZS50YXJnZXQpO1xuICAgIH1cbn0pO1xuXG5cbmZ1bmN0aW9uIHRvZ2dsZUZpbGVTZWxlY3QoZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdHZhciBmaWxlID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKSxcblx0XHRmaWxlc1NlY3Rpb24gPSBmaWxlLnBhcmVudCgpLFxuXHRcdGZpbGVzID0gZmlsZXNTZWN0aW9uLmNoaWxkcmVuKCcuZmlsZScpO1xuXHRcdHNlbGVjdGVkRmlsZXMgPSBmaWxlc1NlY3Rpb24uY2hpbGRyZW4oJy5maWxlLnNlbGVjdGVkJyk7XG5cblxuXG5cdC8vQ2hlY2sgaWYgdXNlciBob2xkIFNoaWZ0IEtleVxuXHRpZiAoZS5zaGlmdEtleSkge1xuXHRcdGlmIChmaWxlLmhhc0NsYXNzKCdzZWxlY3RlZCcpKSB7XG5cdFx0XHRmaWxlLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmIChzZWxlY3RlZEZpbGVzKSB7XG5cdFx0XHRcdHZhciBmaWxlSW5kZXggPSBmaWxlLmluZGV4KCksXG5cdFx0XHRcdFx0ZmlsZXNUb0JlU2VsZWN0ID0gZmlsZXMuc2xpY2UobGFzdFNlbGVjdGVkLCBmaWxlSW5kZXggKyAxKTtcblxuXHRcdFx0XHRpZiAobGFzdFNlbGVjdGVkID4gZmlsZUluZGV4KSB7XG5cdFx0XHRcdFx0ZmlsZXNUb0JlU2VsZWN0ID0gZmlsZXMuc2xpY2UoZmlsZUluZGV4LCBsYXN0U2VsZWN0ZWQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGZpbGVzVG9CZVNlbGVjdC5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRmaWxlLnRvZ2dsZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRlbHNlIHtcblx0XHRmaWxlLnRvZ2dsZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHR9XG5cdGxhc3RTZWxlY3RlZCA9IGZpbGUuaW5kZXgoKTtcblx0bm9ybWFsaXplU2VsZWN0ZWlvbigpO1xufVxuZnVuY3Rpb24gbm9ybWFsaXplU2VsZWN0ZWlvbigpIHtcblx0dmFyIGJ1bGtEZWxldGVCdXR0b24gPSAkKCcjYnVsa1JlbW92ZScpLFxuXHRcdGJ1bGtFZGl0QnV0dG9uID0gJCgnI2J1bGtFZGl0JyksXG5cdFx0bXVsdGlFZGl0QnV0dG9uID0gJCgnI211bHRpRWRpdCcpLFxuXG5cdFx0c2VsZWN0QWxsQnV0dG9uID0gJCgnI3NlbGVjdEFsbCcpLFxuXHRcdHNlbGVjdEFsbExhYmVsID0gJCgnI3NlbGVjdEFsbExhYmVsJyksXG5cblx0XHRkZWxldGVCdXR0b25zID0gJCgnLmN0IC5maWxlcyAuZmlsZSAuZmlsZV9fZGVsZXRlJyksXG5cdFx0ZWRpdEJ1dHRvbnMgPSAkKCcuY3QgLmZpbGVzIC5maWxlIC5idXR0b24nKSxcblx0XHRhcnJhbmdlbWVudHMgPSAkKCcuY3QgLmZpbGVzIC5maWxlIC5maWxlX19hcnJhZ2VtZW50JyksXG5cdFx0YXJyYW5nZW1lbnRJbnB1dHMgPSAkKCcuY3QgLmZpbGVzIC5maWxlIC5maWxlX19hcnJhZ2VtZW50JykuZmluZCgnaW5wdXQnKSxcblxuXHRcdHNlbGVjdGVkRGVsZXRlQnV0dG9uID0gJCgnLmN0IC5maWxlcyAuZmlsZS5zZWxlY3RlZCAuZmlsZV9fZGVsZXRlJyksXG5cdFx0c2VsZWN0ZWRFZGl0QnV0dG9uID0gJCgnLmN0IC5maWxlcyAuZmlsZS5zZWxlY3RlZCAuYnV0dG9uJyksXG5cdFx0c2VsZWN0ZWRBcnJhbmdlbWVudCA9ICQoJy5jdCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQgLmZpbGVfX2FycmFnZW1lbnQnKSxcblx0XHRzZWxlY3RlZEFycmFuZ2VtZW50SW5wdXQgPSAkKCcuY3QgLmZpbGVzIC5maWxlLnNlbGVjdGVkIC5maWxlX19hcnJhZ2VtZW50JykuZmluZCgnaW5wdXQnKSxcblxuXHRcdG51bWJlck9mRmlsZXMgPSAkKCcuY3QgLmZpbGVzIC5maWxlJykubGVuZ3RoLFxuXHRcdG51bWJlck9mU2VsZWN0ZWRGaWxlcyA9ICQoJy5jdCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKS5sZW5ndGg7XG5cblx0Ly9ObyBzZWxlY3RlZCBmaWxlc1xuXHRpZiAobnVtYmVyT2ZTZWxlY3RlZEZpbGVzID09PSAwKSB7XG5cdFx0c2VsZWN0QWxsQnV0dG9uLnJlbW92ZUNsYXNzKCdhbGwnKS5hZGRDbGFzcygnZW1wdHknKTtcblx0XHRzZWxlY3RBbGxMYWJlbC50ZXh0KCdTZWxlY3QgYWxsJyk7XG5cdFx0YnVsa0RlbGV0ZUJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRidWxrRWRpdEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRtdWx0aUVkaXRCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cblx0XHRlZGl0QnV0dG9ucy5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0ZGVsZXRlQnV0dG9ucy5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0YXJyYW5nZW1lbnRzLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdGFycmFuZ2VtZW50SW5wdXRzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHR9XG5cdC8vU29tZSBmaWxlcyBhcmUgc2VsZWN0ZWRcblx0ZWxzZSBpZiAobnVtYmVyT2ZTZWxlY3RlZEZpbGVzID4gMCkge1xuXHRcdHNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnZW1wdHkgYWxsJyk7XG5cdFx0c2VsZWN0QWxsTGFiZWwudGV4dCgnRGVzZWxlY3QgYWxsJyk7XG5cdFx0YnVsa0RlbGV0ZUJ1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRidWxrRWRpdEJ1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRtdWx0aUVkaXRCdXR0b24ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cblx0XHRlZGl0QnV0dG9ucy5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0ZGVsZXRlQnV0dG9ucy5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0YXJyYW5nZW1lbnRzLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdGFycmFuZ2VtZW50SW5wdXRzLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cblx0XHQvL09ubHkgb25lIGZpbGUgc2VsZWN0ZWRcblx0XHRpZiAobnVtYmVyT2ZTZWxlY3RlZEZpbGVzID09PSAxKSB7XG5cdFx0XHRidWxrRWRpdEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdG11bHRpRWRpdEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblxuXHRcdFx0c2VsZWN0ZWRFZGl0QnV0dG9uLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRcdHNlbGVjdGVkRGVsZXRlQnV0dG9uLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRcdHNlbGVjdGVkQXJyYW5nZW1lbnQucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHRzZWxlY3RlZEFycmFuZ2VtZW50SW5wdXQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0fVxuXHRcdC8vQWxsIGZpbGVzIGFyZSBzZWxlY3RlZFxuXHRcdGlmIChudW1iZXJPZlNlbGVjdGVkRmlsZXMgPT09IG51bWJlck9mRmlsZXMpIHtcblx0XHRcdHNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnZW1wdHknKS5hZGRDbGFzcygnYWxsJyk7XG5cdFx0fVxuXHR9XG59XG5mdW5jdGlvbiBzZWxlY3RBbGwoKSB7XG5cdCQoJy5jdCAuZmlsZScpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXHQkKCcjc2VsZWN0QWxsJykuYWRkQ2xhc3MoJ2FsbCcpLnJlbW92ZUNsYXNzKCdlbXB0eScpO1xuXHRub3JtYWxpemVTZWxlY3RlaW9uKCk7XG59XG5mdW5jdGlvbiBkZXNlbGVjdEFsbCgpIHtcblx0JCgnLmN0IC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdCQoJyNzZWxlY3RBbGwnKS5hZGRDbGFzcygnZW1wdHknKS5yZW1vdmVDbGFzcygnYWxsJyk7XG5cdG5vcm1hbGl6ZVNlbGVjdGVpb24oKTtcbn1cblxuZnVuY3Rpb24gb3Blbk1lbnUoZWwsIGRhdGEpIHtcbiAgICBjb25zb2xlLmxvZyhlbCk7XG5cbiAgICB2YXIgd2lkdGggPSAkKGVsKS5maW5kKCdpbnB1dCcpLm91dGVyV2lkdGgoKSxcbiAgICAgICAgaGVpZ2h0ID0gJChlbCkuaGVpZ2h0KCksXG4gICAgICAgIG9mZnNldCA9ICQoZWwpLm9mZnNldCgpLFxuICAgICAgICBkb2N1bWVudEhlaWdodCA9ICQoZG9jdW1lbnQpLmhlaWdodCgpLFxuICAgICAgICBib3R0b21zcGFjZSA9IGRvY3VtZW50SGVpZ2h0IC0gb2Zmc2V0LnRvcCAtIGhlaWdodCAtIDIwMDtcblxuICAgICAgICBib3R0b20gPSBib3R0b21zcGFjZSA+IDAgPyB0cnVlIDogZmFsc2UsXG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyhvZmZzZXQudG9wLCBoZWlnaHQsIGRvY3VtZW50SGVpZ2h0LCBib3R0b20sIChvZmZzZXQudG9wICsgaGVpZ2h0ICsgMjAwIC0gZG9jdW1lbnRIZWlnaHQpKTtcblxuICAgICAgICBkcm9wZG93biA9ICQoJzxkaXY+PC9kaXY+JylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdkcm9wZG93bl9fbWVudScpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhmdW5jdGlvbigpIHtyZXR1cm4gYm90dG9tID8gJ2Ryb3Bkb3duX19tZW51X2JvdHRvbScgOiAnZHJvcGRvd25fX21lbnVfdXAnO30pXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoJ3dpZHRoJywgd2lkdGgpXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoJ2hlaWdodCcsIGZ1bmN0aW9uKCkge3JldHVybiBib3R0b20gPyBib3R0b21zcGFjZSArIDIwMCA6IDMwMDt9KVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignaWQnLCAnZHJvcGRvd25MaXN0JyksXG4gICAgICAgIHNlYXJjaCA9ICQoJzxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiU2hvdywgc2Vhc29uLCBlcGlzb2RlIG9yIGV2ZW50XCIvPicpLmFkZENsYXNzKCdkcm9wZG93bl9fc2VhcmNoJykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge2ZpbHRlckxpc3QoZSwgZGF0YSk7fSksXG4gICAgICAgIGxpc3QgPSAkKCc8ZGl2PjwvZGl2JykuYWRkQ2xhc3MoJ2Ryb3Bkb3duX19saXN0JyksXG4gICAgICAgIGxpc3RVbCA9ICQoJzx1bD48L3VsPicpO1xuXG4gICAgaWYgKGRhdGEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9ICQoJzxsaT48L2xpPicpLnRleHQoZGF0YVtpXSkuY2xpY2soaXRlbVNlbGVjdCk7XG4gICAgICAgICAgICBsaXN0VWwuYXBwZW5kKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGlzdC5hcHBlbmQobGlzdFVsKTtcbiAgICBkcm9wZG93bi5hcHBlbmQoc2VhcmNoLCBsaXN0KTtcbiAgICAkKGVsKS5hcHBlbmQoZHJvcGRvd24pOy8vLnVuYmluZCgnY2xpY2snKS5jbGljayhjbG9zZURyb3BEb3duKTtcbiAgICBzZWFyY2guZm9jdXMoKTtcbiAgICAkKCcqJykuY2xpY2soY2xvc2VEcm9wRG93bik7XG59XG5cbmZ1bmN0aW9uIGNsb3NlRHJvcERvd24oZSkge1xuICAgICQoJyonKS51bmJpbmQoJ2NsaWNrJywgY2xvc2VEcm9wRG93bik7XG4gICAgJCgnI2Ryb3Bkb3duTGlzdCcpLnBhcmVudHMoJy5kcm9wZG93bicpLmJsdXIoKTtcbiAgICAkKCcjZHJvcGRvd25MaXN0JykucmVtb3ZlKCk7XG4gICAgLy8kKCcuZHJvcGRvd24nKS5jbGljayhmdW5jdGlvbihldmVudCkge29wZW5NZW51KGV2ZW50LnRhcmdldCwgc2hvd0xpc3QpO30pO1xufVxuXG4kKCcuZHJvcGRvd24nKS5jbGljayhmdW5jdGlvbihlKSB7b3Blbk1lbnUoZS50YXJnZXQsIHNob3dMaXN0KTt9KTtcblxuZnVuY3Rpb24gZmlsdGVyTGlzdChlLCBkYXRhKSB7XG4gICAgdmFyIHVsID0gJChlLnRhcmdldCkucGFyZW50cygnLmRyb3Bkb3duJykuZmluZCgndWwnKTtcbiAgICB1bC5lbXB0eSgpO1xuICAgIGZpbHRlcmVkRGF0YSA9IGRhdGE7XG4gICAgaWYgKCQoZS50YXJnZXQpLnZhbCgpKSB7XG4gICAgICAgIGZpbHRlcmVkRGF0YSA9IGRhdGEuZmlsdGVyKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGQsICQoZS50YXJnZXQpLnZhbCgpLCBkLmluZGV4T2YoJChlLnRhcmdldCkudmFsKCkpKTtcbiAgICAgICAgICAgIHJldHVybiBkLmluZGV4T2YoJChlLnRhcmdldCkudmFsKCkpID4gLTE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhmaWx0ZXJlZERhdGEsIGRhdGEsICQoZS50YXJnZXQpLnZhbCgpKTtcbiAgICBpZiAoZmlsdGVyZWREYXRhKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSAkKCc8bGk+PC9saT4nKS50ZXh0KGRhdGFbaV0pLmNsaWNrKGl0ZW1TZWxlY3QpO1xuICAgICAgICAgICAgdWwuYXBwZW5kKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gaXRlbVNlbGVjdChlKSB7XG4gICAgdmFyIGRyb3Bkb3duID0gJChlLnRhcmdldCkucGFyZW50cygnLmRyb3Bkb3duJyksXG4gICAgICAgIGlucHV0ID0gZHJvcGRvd24uZmluZCgnaW5wdXQnKTtcbiAgICBpbnB1dC52YWwoJChlLnRhcmdldCkudGV4dCgpKTtcbiAgICBkYXRhQ2hhbmdlZCA9IHRydWU7XG59XG5cbnZhciBzaG93TGlzdCA9IFtcbiAgICAnQWxjYXRyYXonLFxuICAgICdBbGNhdHJheiBTMDEnLFxuICAgICdBbGNhdHJheiBTMDEgRTAxJyxcbiAgICAnQWxjYXRyYXogUzAxIEUwMicsXG4gICAgJ0FsY2F0cmF6IFMwMSBFMDMnLFxuICAgICdBbGNhdHJheiBTMDEgRTA0JyxcbiAgICAnQWxjYXRyYXogUzAxIEUwNScsXG4gICAgJ0FsY2F0cmF6IFMwMSBFMDYnLFxuICAgICdBbGNhdHJheiBTMDEgRTA3JyxcbiAgICAnQWxjYXRyYXogUzAxIEUwOCcsXG4gICAgJ0FsY2F0cmF6IFMwMSBFMDknLFxuICAgICdBbGNhdHJheiBTMDEgRTEwJyxcbiAgICAnQWxjYXRyYXogUzAxIEUxMScsXG4gICAgJ0FsY2F0cmF6IFMwMSBFMTInLFxuICAgICdBbGNhdHJheiBTMDEgRTEzJyxcbiAgICAnQWxjYXRyYXogUzAxIEUxNCcsXG4gICAgJ0FsY2F0cmF6IFMwMSBFMTUnLFxuICAgICdBbGNhdHJheiBTMDEgRTE2JyxcbiAgICAnQWxjYXRyYXogUzAxIEUxNycsXG4gICAgJ0FsY2F0cmF6IFMwMSBFMTgnLFxuICAgICdBbGNhdHJheiBTMDEgRTE5JyxcbiAgICAnQWxjYXRyYXogUzAxIEUyMCcsXG5cbiAgICAnQmxpbmRzcG90JyxcbiAgICAnQmxpbmRzcG90IFMwMScsXG4gICAgJ0JsaW5kc3BvdCBTMDEgRTAxJyxcbiAgICAnQmxpbmRzcG90IFMwMSBFMDInLFxuICAgICdCbGluZHNwb3QgUzAxIEUwMycsXG4gICAgJ0JsaW5kc3BvdCBTMDEgRTA0JyxcbiAgICAnQmxpbmRzcG90IFMwMSBFMDUnLFxuICAgICdCbGluZHNwb3QgUzAxIEUwNicsXG4gICAgJ0JsaW5kc3BvdCBTMDEgRTA3JyxcbiAgICAnQmxpbmRzcG90IFMwMSBFMDgnLFxuICAgICdCbGluZHNwb3QgUzAxIEUwOScsXG4gICAgJ0JsaW5kc3BvdCBTMDEgRTEwJyxcbiAgICAnQmxpbmRzcG90IFMwMSBFMTEnLFxuICAgICdCbGluZHNwb3QgUzAxIEUxMicsXG4gICAgJ0JsaW5kc3BvdCBTMDInLFxuICAgICdCbGluZHNwb3QgUzAyIEUwMScsXG4gICAgJ0JsaW5kc3BvdCBTMDIgRTAyJyxcbiAgICAnQmxpbmRzcG90IFMwMiBFMDMnLFxuICAgICdCbGluZHNwb3QgUzAyIEUwNCcsXG4gICAgJ0JsaW5kc3BvdCBTMDIgRTA1JyxcbiAgICAnQmxpbmRzcG90IFMwMiBFMDYnLFxuICAgICdCbGluZHNwb3QgUzAyIEUwNycsXG4gICAgJ0JsaW5kc3BvdCBTMDIgRTA4JyxcbiAgICAnQmxpbmRzcG90IFMwMiBFMDknLFxuICAgICdCbGluZHNwb3QgUzAyIEUxMCcsXG4gICAgJ0JsaW5kc3BvdCBTMDIgRTExJyxcbiAgICAnQmxpbmRzcG90IFMwMiBFMTInLFxuICAgICdIYXZlbicsXG4gICAgJ0hhdmVuIFMwMScsXG4gICAgJ0hhdmVuIFMwMSBFMDEnLFxuICAgICdIYXZlbiBTMDEgRTAyJyxcbiAgICAnSGF2ZW4gUzAxIEUwMycsXG4gICAgJ0hhdmVuIFMwMSBFMDQnLFxuICAgICdIYXZlbiBTMDEgRTA1JyxcbiAgICAnSGF2ZW4gUzAxIEUwNicsXG4gICAgJ0hhdmVuIFMwMSBFMDcnLFxuICAgICdIYXZlbiBTMDEgRTA4JyxcbiAgICAnSGF2ZW4gUzAxIEUwOScsXG4gICAgJ0hhdmVuIFMwMSBFMTAnLFxuICAgICdIYXZlbiBTMDEgRTExJyxcbiAgICAnSGF2ZW4gUzAxIEUxMicsXG5dO1xuXG52YXIgYWN0b3JzID0gW1xuICAgICdBZGFtIENvcGVsYW5kJyxcbiAgICAnRW1pbHkgUm9zZScsXG4gICAgJ0VyaWMgQmFsZm91cicsXG4gICAgJ0pvaG4gRHVuc3dvcnRoJyxcbiAgICAnTGF1cmEgTWVubmVsbCcsXG4gICAgJ0x1Y2FzIEJyeWFudCcsXG4gICAgJ1JpY2hhcmQgRG9uYXQnLFxuXTtcblxuZnVuY3Rpb24gZm9jdXNUYWdGaWVsZChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB2YXIgdGFnZmllbGQgPSAkKGUudGFyZ2V0KS5oYXNDbGFzcygndGFnZmllbGQnKSA/ICQoZS50YXJnZXQpIDogJChlLnRhcmdldCkucGFyZW50cygndGFnZmllbGQnKTtcbiAgICAgICAgaW5wdXQgPSB0YWdmaWVsZC5maW5kKCdpbnB1dCcpLFxuICAgICAgICBzcGFuID0gdGFnZmllbGQuZmluZCgnc3BhbicpLFxuICAgICAgICBtZW51ID0gdGFnZmllbGQuZmluZCgnLnRhZ2ZpZWxkX19tZW51Jyk7XG5cbiAgICB0YWdmaWVsZFxuICAgICAgICAuYWRkQ2xhc3MoJ3RhZ2ZpZWxkX2FjdGl2ZScpXG4gICAgICAgIC51bmJpbmQoJ2NsaWNrJywgZm9jdXNUYWdGaWVsZCk7XG5cbiAgICBpZiAodGFnZmllbGQuZmluZCgnaW5wdXQnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgaW5wdXQgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cInR5cGUgdGFnLi4uXCIvPicpLmFkZENsYXNzKCd0YWdmaWVsZF9faW5wdXQnKS5vbignaW5wdXQgZm9jdXMnLCBmaWx0ZXJMaXN0KTtcbiAgICAgICAgdGFnZmllbGQuYXBwZW5kKGlucHV0KTt9XG5cbiAgICBpZiAodGFnZmllbGQuZmluZCgnLnRhZ2ZpZWxkX19tZW51JykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG1lbnUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCd0YWdmaWVsZF9fbWVudScpO1xuICAgICAgICB2YXIgdWwgPSAkKCc8dWw+PC91bD4nKTtcblxuICAgICAgICBhY3RvcnMuZm9yRWFjaChmdW5jdGlvbihhKSB7XG4gICAgICAgIHVsLmFwcGVuZCgkKCc8bGk+PC9saT4nKS50ZXh0KGEpLmNsaWNrKGhhbmRsZVRhZ01lbnVJdGVtQ2xpY2spKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG1lbnUuYXBwZW5kKHVsKTtcbiAgICAgICAgdGFnZmllbGQuYXBwZW5kKG1lbnUpO1xuICAgIH1cblxuICAgIHNwYW4uYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgIGlucHV0LmZvY3VzKCk7XG4gICAgJCgnKicpXG4gICAgICAgIC5ub3QodGFnZmllbGQpXG4gICAgICAgIC5ub3QobWVudSlcbiAgICAgICAgLm5vdChpbnB1dClcbiAgICAgICAgLm5vdCgnLnRhZ2ZpZWxkX19tZW51IHVsLCAudGFnZmllbGRfX21lbnUgbGknKVxuICAgICAgICAuY2xpY2sodW5mb2N1c1RhZ2ZpZWxkKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZVRhZ01lbnVJdGVtQ2xpY2soZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc29sZS5sb2coZS50YXJnZXQpO1xuICAgIHZhciBpdGVtID0gJChlLnRhcmdldCksXG4gICAgICAgIHRhZ2ZpZWxkID0gaXRlbS5wYXJlbnRzKCcudGFnZmllbGQnKSxcbiAgICAgICAgaW5wdXQgPSB0YWdmaWVsZC5maW5kKCcudGFnZmllbGRfX2lucHV0JyksXG5cdFx0dGFnID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygndGFnJykudGV4dChpdGVtLnRleHQoKSksXG5cdFx0dGFnRGVsZXRlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygndGFnX19kZWxldGUnKS50ZXh0KCfinJUnKS5vbignY2xpY2snLCBkZWxldGVUYWcpO1xuXG5cdHRhZy5hcHBlbmQodGFnRGVsZXRlKTtcblx0dGFnLmluc2VydEJlZm9yZShpbnB1dCk7XG4gICAgaW5wdXQuZm9jdXMoKTtcbiAgICBkYXRhQ2hhbmdlZCA9IHRydWU7XG59XG5mdW5jdGlvbiBkZWxldGVUYWcoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdmFyIHRhZyA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy50YWcnKSxcbiAgICAgICAgaW5wdXQgPSB0YWcucGFyZW50KCkuZmluZCgnaW5wdXQnKTtcblxuICAgIHRhZy5yZW1vdmUoKTtcbiAgICBpbnB1dC52YWwoJycpLmZvY3VzKCk7XG59XG5mdW5jdGlvbiBmaWx0ZXJMaXN0KGUpIHtcbiAgICB2YXIgaW5wdXQgPSAkKGUudGFyZ2V0KSxcbiAgICAgICAgdGFnZmllbGQgPSBpbnB1dC5wYXJlbnRzKCcudGFnZmllbGQnKSxcbiAgICAgICAgdWwgPSB0YWdmaWVsZC5maW5kKCd1bCcpO1xuXG4gICAgdmFyIGZpbHRlcmVkTGlzdCA9IGFjdG9ycy5maWx0ZXIoZnVuY3Rpb24oYSkge1xuICAgICAgICByZXR1cm4gYS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoaW5wdXQudmFsKCkpID49IDA7XG4gICAgfSk7XG4gICAgdWwuZW1wdHkoKTtcbiAgICBmaWx0ZXJlZExpc3QuZm9yRWFjaChmdW5jdGlvbihhKSB7XG4gICAgICAgIHVsLmFwcGVuZCgkKCc8bGk+PC9saT4nKS50ZXh0KGEpLmNsaWNrKGhhbmRsZVRhZ01lbnVJdGVtQ2xpY2spKTtcbiAgICB9KTtcblxuICAgIGlmIChpbnB1dC52YWwoKS5zbGljZSgtMSkgPT09ICcsJykge1xuICAgICAgICB2YXIgdGFnID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygndGFnJykudGV4dChpbnB1dC52YWwoKS5zbGljZSgwLCAtMSkpLFxuXHRcdCAgICB0YWdEZWxldGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCd0YWdfX2RlbGV0ZScpLnRleHQoJ+KclScpLm9uKCdjbGljaycsIGRlbGV0ZVRhZyk7XG5cbiAgICAgICAgaW5wdXQudmFsKCcnKTtcbiAgICAgICAgdGFnLmFwcGVuZCh0YWdEZWxldGUpO1xuICAgICAgICB0YWcuaW5zZXJ0QmVmb3JlKGlucHV0KTtcbiAgICAgICAgaW5wdXQuZm9jdXMoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVuZm9jdXNUYWdmaWVsZChlKSB7XG4gICAgY29uc29sZS5sb2coZSk7XG4gICAgdmFyIHRhZ2ZpZWxkID0gJCgnLnRhZ2ZpZWxkJyksXG4gICAgICAgIGlucHV0ID0gdGFnZmllbGQuZmluZCgnaW5wdXQnKSxcbiAgICAgICAgc3BhbiA9IHRhZ2ZpZWxkLmZpbmQoJ3NwYW4nKSxcbiAgICAgICAgbWVudSA9IHRhZ2ZpZWxkLmZpbmQoJy50YWdmaWVsZF9fbWVudScpLFxuICAgICAgICB0YWdzID0gdGFnZmllbGQuZmluZCgnLnRhZycpO1xuXG4gICAgdGFnZmllbGQucmVtb3ZlQ2xhc3MoJ3RhZ2ZpZWxkX2FjdGl2ZScpLmNsaWNrKGZvY3VzVGFnRmllbGQpO1xuICAgIG1lbnUucmVtb3ZlKCk7XG4gICAgaW5wdXQucmVtb3ZlKCk7XG5cbiAgICBpZiAodGFncy5sZW5ndGggPT09IDApIHtzcGFuLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTt9XG4gICAgJCgnKicpLnVuYmluZCgnY2xpY2snLCB1bmZvY3VzVGFnZmllbGQpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUb29sdGlwKHRhcmdldCwgdGV4dCkge1xuICAgIHZhciB0b29sdGlwID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygndG9vbHRpcCcpLmNsaWNrKGNsb3NlVG9vbHRpcCksXG4gICAgICAgIHRvb2x0aXBUZXh0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygndG9vbHRpcF9fdGV4dCcpLnRleHQodGV4dCksXG4gICAgICAgIHRvb2x0aXBUb2dnbGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCd0b29sdGlwX190b2dnbGUnKSxcbiAgICAgICAgdG9vbHRpcFRvZ2dsZV9Ub2dnbGUgPSAkKCc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJuZXZlclNob3dUb29sdGlwXCIgLz4nKSwvLy5vbignY2hhbmdlJywgbmV2ZXJTaG93VG9vbHRpcCksXG4gICAgICAgIHRvb2x0aXBUb2dnbGVfTGFiZWwgPSAkKCc8bGFiZWwgZm9yPVwibmV2ZXJTaG93VG9vbHRpcFwiPkdvdCBpdCwgZG9uXFwndCBzaG93IG1lIHRoaXMgYWdhaW48L2xhYmVsPicpO1xuXG4gICAgdG9vbHRpcFRvZ2dsZS5hcHBlbmQodG9vbHRpcFRvZ2dsZV9Ub2dnbGUsIHRvb2x0aXBUb2dnbGVfTGFiZWwpO1xuICAgIHRvb2x0aXBUb2dnbGUuYmluZCgnZm9jdXMgY2xpY2sgY2hhbmdlJywgbmV2ZXJTaG93VG9vbHRpcCk7XG4gICAgdG9vbHRpcC5hcHBlbmQodG9vbHRpcFRleHQsIHRvb2x0aXBUb2dnbGUpO1xuICAgICQodGFyZ2V0KS5wYXJlbnQoKS5hcHBlbmQodG9vbHRpcCk7XG5cbiAgICB0b29sdGlwLndpZHRoKHRhcmdldC53aWR0aCgpKTtcbiAgICAvL2NvbnNvbGUubG9nKCQoJ2JvZHknKS53aWR0aCgpIC0gdGFyZ2V0Lm8oKS5sZWZ0IC0gdGFyZ2V0LndpZHRoKCkgLSB0YXJnZXQud2lkdGgoKSAtIDIwLCAkKCdib2R5Jykud2lkdGgoKSk7XG4gICAgaWYgKCQoJ2JvZHknKS53aWR0aCgpIC0gdGFyZ2V0Lm9mZnNldCgpLmxlZnQgLSB0YXJnZXQud2lkdGgoKSAtIHRhcmdldC53aWR0aCgpIC0gMjAgPiAwICkge1xuICAgICAgICB0b29sdGlwLmNzcygnbGVmdCcsIHRhcmdldC5wb3NpdGlvbigpLmxlZnQgKyB0YXJnZXQud2lkdGgoKSArIDEwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0b29sdGlwLmNzcygnbGVmdCcsIHRhcmdldC5wb3NpdGlvbigpLmxlZnQgLSB0YXJnZXQud2lkdGgoKSAtIDEwKTtcbiAgICB9XG5cbiAgICAgICAgICAgIC8vLmNzcygndG9wJywgdGFyZ2V0LnBvc2l0aW9uKCkudG9wICsgdGFyZ2V0LmhlaWdodCgpKTtcblxuICAgICQoJ2h0bWwnKS5jbGljayhjbG9zZVRvb2x0aXApO1xufVxuXG5mdW5jdGlvbiBuZXZlclNob3dUb29sdGlwKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnNvbGUubG9nKCduZXZlciBzaG93JywgZS50YXJnZXQpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9vbHRpcCcsIHRydWUpO1xuICAgIGNsb3NlVG9vbHRpcCgpO1xufVxuXG5mdW5jdGlvbiBjbG9zZVRvb2x0aXAoZSkge1xuICAgIC8vY29uc29sZS5sb2coJ2Nsb3NldG9vbHRpcCcsIGUpO1xuICAgICQoZG9jdW1lbnQpLnVuYmluZCgnY2xpY2snLCBjbG9zZVRvb2x0aXApO1xuICAgIHZhciB0b29sdGlwcyA9ICQoJy50b29sdGlwJyk7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRvb2x0aXBzLnJlbW92ZSgpO1xuICAgIH0sIDMwMCk7XG5cblxufVxuXG52YXIgZ2FsbGVyeUNhcHRpb25zID0ge307XG5cbmZ1bmN0aW9uIGhhbmRsZUNhcHRpb25FZGl0KGUpIHtcbiAgICB2YXIgZmlsZUVsZW1lbnQgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpLFxuICAgICAgICBmaWxlSWQgPSBmaWxlRWxlbWVudC5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCksXG4gICAgICAgIHRvZ2dsZSA9IGZpbGVFbGVtZW50LmZpbmQoJy5maWxlX19jYXB0aW9uLXRvZ2dsZSAudG9nZ2xlJyksXG4gICAgICAgIGZpbGUgPSBnYWxsZXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuICAgICAgICAgICAgcmV0dXJuIGYuZmlsZURhdGEuaWQgPT09IGZpbGVJZDtcbiAgICAgICAgfSlbMF0sXG5cbiAgICAgICAgdG9nZ2xlQ2hlY2tlZCA9ICQoZS50YXJnZXQpLnZhbCgpID09PSBmaWxlLmZpbGVEYXRhLmNhcHRpb24gJiYgZmlsZS5maWxlRGF0YS5jYXB0aW9uOyAvL0lmIHRleHRmaWVsZCBlcXVhbHMgdGhlIGZpbGUgY2FwdGlvbiBhbmQgZmlsZSBjYXB0aW9uIG5vdCBlbXB0eVxuXG4gICAgLy9TYXZlIGNhcHRpb24gdG8gZ2FsbGVyeUNhcHRpb25zXG4gICAgZmlsZS5jYXB0aW9uID0gJChlLnRhcmdldCkudmFsKCk7XG5cbiAgICAvL2NvbnNvbGUubG9nKGZpbGUuZmluZCgnLmZpbGVfX2luZGV4JykudGV4dCgpKTtcbiAgICB0b2dnbGUucHJvcCgnY2hlY2tlZCcsIHRvZ2dsZUNoZWNrZWQpO1xuICAgIGNsb3NlVG9vbHRpcCgpO1xufVxuZnVuY3Rpb24gaGFuZGxlQ2FwdGlvblRvZ2dsZUNsaWNrKGUpIHtcbiAgICAvL2Uuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdmFyIGZpbGUgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpLFxuICAgICAgICBmaWxlSW5kZXggPSBwYXJzZUludChmaWxlLmZpbmQoJy5maWxlX19pbmRleCcpLnRleHQoKSksXG4gICAgICAgIHRleHRhcmVhID0gZmlsZS5maW5kKCcuZmlsZV9fY2FwdGlvbi10ZXh0YXJlYScpLFxuICAgICAgICBvcmlnaW5hbENhcHRpb24gPSBnYWxsZXJ5T2JqZWN0c1tmaWxlSW5kZXhdLmNhcHRpb247XG5cbiAgICBpZiAoJChlLnRhcmdldCkucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgIHRleHRhcmVhLnZhbChvcmlnaW5hbENhcHRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHRhcmVhLmZvY3VzKCk7XG4gICAgfVxufVxuZnVuY3Rpb24gaGFuZGxlQ2FwdGlvblN0YXJ0RWRpdGluZyhlKSB7XG4gICAgdmFyIHRvb2x0aXBUZXh0ID0gJ1RoaXMgY2FwdGlvbiB3aWxsIG9ubHkgYXBwbHkgdG8geW91ciBnYWxsZXJ5IGFuZCBub3QgdG8gdGhlIGltYWdlIGFzc2V0Lic7XG4gICAgaWYgKCF3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rvb2x0aXAnKSkge1xuICAgICAgICBjcmVhdGVUb29sdGlwKCQoZS50YXJnZXQpLCB0b29sdGlwVGV4dCk7XG4gICAgfVxufVxuXG4kKCcuZmlsZV9fY2FwdGlvbi10ZXh0YXJlYScpLm9uKCdibHVyIGlucHV0JywgaGFuZGxlQ2FwdGlvbkVkaXQpO1xuJCgnLmZpbGVfX2NhcHRpb24tdGV4dGFyZWEnKS5vbignZm9jdXMnLCBoYW5kbGVDYXB0aW9uU3RhcnRFZGl0aW5nKTtcbiQoJy5maWxlX19jYXB0aW9uLXRvZ2dsZSAudG9nZ2xlJykuY2xpY2soaGFuZGxlQ2FwdGlvblRvZ2dsZUNsaWNrKTtcblxuLy8gQ2hhbmdlIGVsZW1lbnQgaW5kZXhlcyB0byBhbiBhY3R1YWwgb25lc1xuZnVuY3Rpb24gbm9ybWFsaXplSW5kZXgoKSB7XG4gICAgdmFyIGZpbGVzID0gJCgnLnRhYiAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlJyk7XG5cbiAgICBmaWxlcy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAkKGVsKS5maW5kKCcuZmlsZV9fYXJhZ2VtZW50LWlucHV0JykudmFsKGluZGV4ICsgMSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUluZGV4RmllbGRDaGFuZ2UoZSkge1xuICAgIHZhciBsZW5ndGggPSAkKCcudGFiIC5maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKS5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gcGFyc2VJbnQoJChlLnRhcmdldCkudmFsKCkpIC0gMSxcbiAgICAgICAgZmlsZSA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJyk7XG5cbiAgICBpZiAoaW5kZXggKyAxID49IGxlbmd0aCkge1xuICAgICAgICBwdXRCb3R0b20oZmlsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsZS5kZXRhY2goKS5pbnNlcnRCZWZvcmUoJCgnLnRhYiAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlJykuc2xpY2UoaW5kZXgsIGluZGV4KzEpKTtcblxuICAgIH1cbiAgICBub3JtYWxpemVJbmRleCgpO1xuICAgIC8vdXBkYXRlR2FsbGVyeShpbmRleCk7XG59XG5cbmZ1bmN0aW9uIHB1dEJvdHRvbShmaWxlKSB7XG4gICAgZmlsZS5kZXRhY2goKS5pbnNlcnRBZnRlcigkKCcudGFiIC5maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKS5sYXN0KCkpO1xuICAgIG5vcm1hbGl6ZUluZGV4KCk7XG4gICAgLy91cGRhdGVHYWxsZXJ5KGdhbGxlcnlPYmplY3RzLmxlbmd0aCk7XG59XG5mdW5jdGlvbiBwdXRUb3AoZmlsZSkge1xuICAgIGZpbGUuZGV0YWNoKCkuaW5zZXJ0QmVmb3JlKCQoJy50YWIgLmZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZScpLmZpcnN0KCkpO1xuICAgIG5vcm1hbGl6ZUluZGV4KCk7XG4gICAgLy91cGRhdGVHYWxsZXJ5KDApO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVTZW5kVG9Ub3BDbGljayhlKSB7XG4gICAgcHV0VG9wKCQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJykpO1xuICAgIC8vY2xvc2VNZW51KCQoZS50YXJnZXQpLnBhcmVudHMoJ3NlbGVjdF9fbWVudScpKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZVNlbmRUb0JvdHRvbUNsaWNrKGUpIHtcbiAgICBwdXRCb3R0b20oJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKSk7XG4gICAgLy9jbG9zZU1lbnUoJChlLnRhcmdldCkucGFyZW50cygnc2VsZWN0X19tZW51JykpO1xufVxuZnVuY3Rpb24gY2xvc2VNZW51KGUpIHtcbiAgICBjb25zb2xlLmxvZygnY2xvc2VNZW51Jyk7XG4gICAgJCgnLnNlbGVjdF9fbWVudScpLmRldGFjaCgpO1xuICAgICQoJ2JvZHknKS51bmJpbmQoJ2NsaWNrJywgY2xvc2VNZW51KTtcbn1cblxuZnVuY3Rpb24gc2hvd1JlYXJyYW5nZU1lbnUoZSkge1xuICAgIGNvbnNvbGUubG9nKCdyZWFycmFuZ2UgbWVudScsIGUudGFyZ2V0KTtcbiAgICAvL2Uuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKCQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlX19hcnJhZ2VtZW50JykuZmluZCgnLnNlbGVjdF9fbWVudScpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgIHZhciBtZW51ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnc2VsZWN0X19tZW51JyksXG4gICAgICAgICAgICB1bCA9ICQoJzx1bD48L3VsPicpLFxuICAgICAgICAgICAgaXRlbTEgPSAkKCc8bGk+U2VuZCB0byBUb3A8L2xpPicpLmNsaWNrKGhhbmRsZVNlbmRUb1RvcENsaWNrKSxcbiAgICAgICAgICAgIGl0ZW0yID0gJCgnPGxpPlNlbmQgdG8gQm90dG9tPC9saT4nKS5jbGljayhoYW5kbGVTZW5kVG9Cb3R0b21DbGljayk7XG5cbiAgICAgICAgdWwuYXBwZW5kKGl0ZW0xLCBpdGVtMik7XG4gICAgICAgIG1lbnUuYXBwZW5kKHVsKTtcbiAgICAgICAgJChlLnRhcmdldCkuYXBwZW5kKG1lbnUpO1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCBjbG9zZU1lbnUpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2xvc2VNZW51KCk7XG4gICAgfVxuXG59XG5cbnZhciBhc3NldExpYnJhcnlPYmplY3RzID0gW1xuICAgIHtcbiAgICAgICAgdXJsOiAnaW1nL2Rvb2RsZS9henRlY190ZW1wbGUucG5nJyxcbiAgICAgICAgZm9jYWxQb2ludDoge1xuICAgICAgICAgICAgbGVmdDogMC41LFxuICAgICAgICAgICAgdG9wOiAwLjVcbiAgICAgICAgfSxcbiAgICAgICAgaWQ6ICdhenRlY190ZW1wbGUucG5nIDQ4MzkyIDM0MicsXG4gICAgICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMS5qcGcnLFxuICAgICAgICBjYXB0aW9uOiAnV3JpdGVyLCBCcmlhbiBNaWxsaWtpbiwgYSBtYW4gYWJvdXQgSGF2ZW4sIHRha2VzIHVzIGJlaGluZCB0aGUgc2NlbmVzIG9mIHRoaXMgZXBpc29kZSBhbmQgZ2l2ZXMgdXMgYSBmZXcgdGVhc2VzIGFib3V0IHRoZSBTZWFzb24gdGhhdCB3ZSBjYW5cXCd0IHdhaXQgdG8gc2VlIHBsYXkgb3V0ISBUaGlzIGlzIHRoZSBmaXJzdCBlcGlzb2RlIG9mIEhhdmVuIG5vdCBmaWxtZWQgaW4gb3IgYXJvdW5kIENoZXN0ZXIsIE5vdmEgU2NvdGlhLiBCZWdpbm5pbmcgaGVyZSwgdGhlIHNob3cgYW5kIGl0cyBzdGFnZXMgcmVsb2NhdGVkIHRvIEhhbGlmYXguJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICAgICAgY2F0ZWdvcmllczogJycsXG4gICAgICAgIHRhZ3M6ICcnLFxuICAgICAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgICAgICBjcmVkaXQ6ICcnLFxuICAgICAgICBjb3B5cmlnaHQ6ICcnLFxuICAgICAgICByZWZlcmVuY2U6IHtcbiAgICAgICAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICAgICAgICBzZWFzb246IDUsXG4gICAgICAgICAgICBlcGlzb2RlOiAxOFxuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIHVybDogJ2ltZy9kb29kbGUvYmlnX2Jlbi5wbmcnLFxuICAgICAgICBmb2NhbFBvaW50OiB7XG4gICAgICAgICAgICBsZWZ0OiAwLjUsXG4gICAgICAgICAgICB0b3A6IDAuNVxuICAgICAgICB9LFxuICAgICAgICBpZDogJ2JpZ19iZW4ucG5nIDQzZGVmcXdlJyxcbiAgICAgICAgY29sb3I6ICcjRkRCRDAwJyxcbiAgICAgICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAyLmpwZycsXG4gICAgICAgIGNhcHRpb246ICdDaGFybG90dGUgbGF5cyBvdXQgaGVyIHBsYW4gZm9yIHRoZSBmaXJzdCB0aW1lIGluIHRoaXMgZXBpc29kZTogdG8gYnVpbGQgYSBuZXcgQmFybiwgb25lIHRoYXQgd2lsbCBjdXJlIFRyb3VibGVzIHdpdGhvdXQga2lsbGluZyBUcm91YmxlZCBwZW9wbGUgaW4gdGhlIHByb2Nlc3MuIEhlciBwbGFuLCBhbmQgd2hhdCBwYXJ0cyBpdCByZXF1aXJlcywgd2lsbCBjb250aW51ZSB0byBwbGF5IGEgbW9yZSBhbmQgbW9yZSBpbXBvcnRhbnQgcm9sZSBhcyB0aGUgc2Vhc29uIGdvZXMgYWxvbmcuJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICAgICAgY2F0ZWdvcmllczogJycsXG4gICAgICAgIHRhZ3M6ICcnLFxuICAgICAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICAgICAgY3JlZGl0OiAnJyxcbiAgICAgICAgY29weXJpZ2h0OiAnJyxcbiAgICAgICAgcmVmZXJlbmNlOiB7XG4gICAgICAgICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgICAgICAgc2Vhc29uOiA1LFxuICAgICAgICAgICAgZXBpc29kZTogMThcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICB1cmw6ICdpbWcvZG9vZGxlL2NocmlzdF90aGVfcmVkZWVtZXIucG5nJyxcbiAgICAgICAgZm9jYWxQb2ludDoge1xuICAgICAgICAgICAgbGVmdDogMC41LFxuICAgICAgICAgICAgdG9wOiAwLjVcbiAgICAgICAgfSxcbiAgICAgICAgaWQ6ICdjaHJpc3RfdGhlX3JlZGVlbWVyLnBuZyAwOTJubHhuYycsXG4gICAgICAgIGNvbG9yOiAnI0VENDEyRCcsXG4gICAgICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMy5qcGcnLFxuICAgICAgICBjYXB0aW9uOiAnTG9zdCB0aW1lIHBsYXlzIGFuIGV2ZW4gbW9yZSBpbXBvcnRhbnQgcm9sZSBpbiB0aGlzIGVwaXNvZGUgdGhhbiBldmVyIGJlZm9yZeKAlCBhcyBpdOKAmXMgcmV2ZWFsZWQgdGhhdCBpdOKAmXMgYSB3ZWFwb24gdGhlIGdyZWF0IGV2aWwgZnJvbSBUaGUgVm9pZCBoYXMgYmVlbiB1c2luZyBhZ2FpbnN0IHVzLCBhbGwgc2Vhc29uIGxvbmcuIFdoaWNoIGdvZXMgYmFjayB0byB0aGUgY2F2ZSB1bmRlciB0aGUgbGlnaHRob3VzZSBpbiBiZWdpbm5pbmcgb2YgdGhlIFNlYXNvbiA1IHByZW1pZXJlLicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgICAgICB0YWdzOiAnJyxcbiAgICAgICAgYWx0VGV4dDogJ0xvc3QgdGltZScsXG4gICAgICAgIGNyZWRpdDogJycsXG4gICAgICAgIGNvcHlyaWdodDogJycsXG4gICAgICAgIHJlZmVyZW5jZToge1xuICAgICAgICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgICAgICAgIHNlYXNvbjogNSxcbiAgICAgICAgICAgIGVwaXNvZGU6IDE4XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgdXJsOiAnaW1nL2Rvb2RsZS9jb2xvc3NldW0ucG5nJyxcbiAgICAgICAgZm9jYWxQb2ludDoge1xuICAgICAgICAgICAgbGVmdDogMC41LFxuICAgICAgICAgICAgdG9wOiAwLjVcbiAgICAgICAgfSxcbiAgICAgICAgaWQ6ICdjb2xvc3NldW0ucG5nIC00cmp4bnNrJyxcbiAgICAgICAgY29sb3I6ICcjMzJBNEI3JyxcbiAgICAgICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzA0LmpwZycsXG4gICAgICAgIGNhcHRpb246ICdUaGUg4oCcYWV0aGVyIGNvcmXigJ0gdGhhdCBDaGFybG90dGUgYW5kIEF1ZHJleSBtYWtlIHByZXNlbnRlZCBhbiBpbXBvcnRhbnQgZGVzaWduIGNob2ljZS4gVGhlIHdyaXRlcnMgd2FudGVkIGl0IHRvIGxvb2sgb3JnYW5pYyBidXQgYWxzbyBkZXNpZ25lZOKAlCBsaWtlIHRoZSB0ZWNobm9sb2d5IG9mIGFuIGFkdmFuY2VkIGN1bHR1cmUgZnJvbSBhIGRpZmZlcmVudCBkaW1lbnNpb24sIGNhcGFibGUgb2YgZG9pbmcgdGhpbmdzIHRoYXQgd2UgbWlnaHQgcGVyY2VpdmUgYXMgbWFnaWMgYnV0IHdoaWNoIGlzIGp1c3Qgc2NpZW5jZSB0byB0aGVtLiBUaGUgdmFyaW91cyBkZXBpY3Rpb25zIG9mIEtyeXB0b25pYW4gc2NpZW5jZSBpbiB2YXJpb3VzIFN1cGVybWFuIHN0b3JpZXMgd2FzIG9uZSBpbnNwaXJhdGlvbi4nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgICAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICAgICAgdGFnczogJycsXG4gICAgICAgIGFsdFRleHQ6ICdDaGFybG90dGUgYW5kIEF1ZHJleScsXG4gICAgICAgIGNyZWRpdDogJycsXG4gICAgICAgIGNvcHlyaWdodDogJycsXG4gICAgICAgIHJlZmVyZW5jZToge1xuICAgICAgICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgICAgICAgIHNlYXNvbjogNSxcbiAgICAgICAgICAgIGVwaXNvZGU6IDE4XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgdXJsOiAnaW1nL2Rvb2RsZS9lYXN0ZXJfaXNsYW5kLnBuZycsXG4gICAgICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgICAgICAgIGxlZnQ6IDAuNSxcbiAgICAgICAgICAgIHRvcDogMC41XG4gICAgICAgIH0sXG4gICAgICAgIGlkOiAnZWFzdGVyX2lzbGFuZC5wbmcgbmxuNG5rYTAnLFxuICAgICAgICBjb2xvcjogJyNEM0VDRUMnLFxuICAgICAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDUuanBnJyxcbiAgICAgICAgY2FwdGlvbjogJ1RoaXMgaXMgdGhlIGZpcnN0IGVwaXNvZGUgaW4gU2Vhc29uIDUgaW4gd2hpY2ggd2XigJl2ZSBsb3N0IG9uZSBvZiBvdXIgaGVyb2VzLiBJdCB3YXMgaW1wb3J0YW50IHRvIGhhcHBlbiBhcyB3ZSBoZWFkIGludG8gdGhlIGhvbWUgc3RyZXRjaCBvZiB0aGUgc2hvdyBhbmQgYXMgdGhlIHN0YWtlcyBpbiBIYXZlbiBoYXZlIG5ldmVyIGJlZW4gbW9yZSBkaXJlLiBBcyBhIHJlc3VsdCwgaXQgd29u4oCZdCBiZSB0aGUgbGFzdCBsb3NzIHdlXFwnbGwgc3VmZmVyIHRoaXMgc2Vhc29u4oCmJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICAgICAgY2F0ZWdvcmllczogJycsXG4gICAgICAgIHRhZ3M6ICcnLFxuICAgICAgICBhbHRUZXh0OiAnV2lsZCBDYXJkJyxcbiAgICAgICAgY3JlZGl0OiAnJyxcbiAgICAgICAgY29weXJpZ2h0OiAnJyxcbiAgICAgICAgcmVmZXJlbmNlOiB7XG4gICAgICAgICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgICAgICAgc2Vhc29uOiA1LFxuICAgICAgICAgICAgZXBpc29kZTogMThcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICB1cmw6ICdpbWcvZG9vZGxlL3B5cmFtaWRzLnBuZycsXG4gICAgICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgICAgICAgIGxlZnQ6IDAuNSxcbiAgICAgICAgICAgIHRvcDogMC41XG4gICAgICAgIH0sXG4gICAgICAgIGlkOiAncHlyYW1pZHMucG5nIGZkYnk2NCcsXG4gICAgICAgIGNvbG9yOiAnIzJBN0M5MScsXG4gICAgICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wNi5qcGcnLFxuICAgICAgICBjYXB0aW9uOiAnVGhlIGNoYWxsZW5nZSBpbiBDaGFybG90dGVcXCdzIGZpbmFsIGNvbmZyb250YXRpb24gd2FzIHRoYXQgdGhlIHNob3cgY291bGRu4oCZdCByZXZlYWwgaGVyIGF0dGFja2Vy4oCZcyBhcHBlYXJhbmNlIHRvIHRoZSBhdWRpZW5jZSwgc28gdGhlIGRhcmtuZXNzIHdhcyBuZWNlc3NpdGF0ZWQuJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICAgICAgY2F0ZWdvcmllczogJycsXG4gICAgICAgIHRhZ3M6ICcnLFxuICAgICAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICAgICAgY3JlZGl0OiAnJyxcbiAgICAgICAgY29weXJpZ2h0OiAnJyxcbiAgICAgICAgcmVmZXJlbmNlOiB7XG4gICAgICAgICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgICAgICAgc2Vhc29uOiA1LFxuICAgICAgICAgICAgZXBpc29kZTogMThcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHVybDogJ2ltZy9kb29kbGUvc2FuX2ZyYW5jaXNvX2JyaWRnZS5wbmcnLFxuICAgICAgICBmb2NhbFBvaW50OiB7XG4gICAgICAgICAgICBsZWZ0OiAwLjUsXG4gICAgICAgICAgICB0b3A6IDAuNVxuICAgICAgICB9LFxuICAgICAgICBpZDogJ3Nhbl9mcmFuY2lzb19icmlkZ2UucG5nIDQyMzRmZjUyJyxcbiAgICAgICAgY29sb3I6ICcjOTY3ODQwJyxcbiAgICAgICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAxLmpwZycsXG4gICAgICAgIGNhcHRpb246ICdXYXJuaW5nOiBJZiB5b3UgZG9uXFwndCB3YW50IHRvIGtub3cgd2hhdCBoYXBwZW5lZCBpbiB0aGlzIGVwaXNvZGUsIGRvblxcJ3QgcmVhZCB0aGlzIHBob3RvIHJlY2FwISBEYXZlIGp1c3QgaGFkIGFub3RoZXIgdmlzaW9uIGFuZCB0aGlzIHRpbWUsIGhlXFwncyBiZWluZyBwcm9hY3RpdmUgYWJvdXQgaXQuIEhlIGFuZCBWaW5jZSBkYXNoIG91dCBvZiB0aGUgaG91c2UgdG8gc2F2ZSB0aGUgbGF0ZXN0IHZpY3RpbXMgb2YgQ3JvYXRvYW4sIGEuay5hIHRoZSBObyBNYXJrcyBLaWxsZXIuJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICAgICAgY2F0ZWdvcmllczogJycsXG4gICAgICAgIHRhZ3M6ICcnLFxuICAgICAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICAgICAgY3JlZGl0OiAnJyxcbiAgICAgICAgY29weXJpZ2h0OiAnJyxcbiAgICAgICAgcmVmZXJlbmNlOiB7XG4gICAgICAgICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgICAgICAgc2Vhc29uOiA1LFxuICAgICAgICAgICAgZXBpc29kZTogMThcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICB1cmw6ICdpbWcvZG9vZGxlL3N0b25lX2hlbmdlLnBuZycsXG4gICAgICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgICAgICAgIGxlZnQ6IDAuNSxcbiAgICAgICAgICAgIHRvcDogMC41XG4gICAgICAgIH0sXG4gICAgICAgIGlkOiAnc3RvbmVfaGVuZ2UucG5nIDQ5MG1ubWFiZCcsXG4gICAgICAgIGNvbG9yOiAnIzU2NkY3OCcsXG4gICAgICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wMi5qcGcnLFxuICAgICAgICBjYXB0aW9uOiAnTWVhbndoaWxlLCBEd2lnaHQgYW5kIE5hdGhhbiBnbyBkb3dudG93biB0byBpbnZlc3RpZ2F0ZSB3aGF0IHRoZXkgdGhpbmsgaXMgYSBkcnVua2VuIG1hbiBjYXVzaW5nIGEgZGlzdHVyYmFuY2UgYnV0IGl0IHR1cm5zIG91dCB0aGF0IHRoZSBndXkgaXMgY3Vyc2VkLiBUaGVyZSBpcyBhIHJvbWFuIG51bWVyYWwgb24gaGlzIHdyaXN0IGFuZCwgYXMgdGhleSB3YXRjaCwgaW52aXNpYmxlIGhvcnNlcyB0cmFtcGxlIGhpbS4gTGF0ZXIsIE5hdGhhbiBhbmQgRHdpZ2h0IGZpbmQgYW5vdGhlciBtYW4gd2hvIGFwcGVhcnMgdG8gaGF2ZSBiZWVuIHN0cnVjayBieSBsaWdodGVuaW5nIOKAkyBidXQgdGhlcmUgaGFkIGJlZW4gbm8gcmVjZW50IHN0b3JtIGluIHRvd24g4oCTIGFuZCBkcm9wcGVkIGZyb20gYSBza3lzY3JhcGVyLiBTa3lzY3JhcGVycyBpbiBIYXZlbj8gQWJzdXJkLiBBbmQgdGhlIGd1eSBhbHNvIGhhcyBhIG15c3RlcmlvdXMgUm9tYW4gbnVtZXJhbCB0YXR0b28gb24gaGlzIHdyaXN0LiBOYXRoYW4gYW5kIER3aWdodCBmaW5kIGEgbGlzdCBvZiBuYW1lcyBpbiB0aGUgZ3V5XFwncyBwb2NrZXQgdGhhdCBsZWFkcyB0aGVtIHRvIGEgbG9jYWwgZm9ydHVuZSB0ZWxsZXIsIExhaW5leS4nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgICAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICAgICAgdGFnczogJycsXG4gICAgICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgICAgICBjcmVkaXQ6ICcnLFxuICAgICAgICBjb3B5cmlnaHQ6ICcnLFxuICAgICAgICByZWZlcmVuY2U6IHtcbiAgICAgICAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICAgICAgICBzZWFzb246IDUsXG4gICAgICAgICAgICBlcGlzb2RlOiAxOFxuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIHVybDogJ2ltZy9kb29kbGUvc3lkbmV5X29wZXJhX2hvdXNlLnBuZycsXG4gICAgICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgICAgICAgIGxlZnQ6IDAuNSxcbiAgICAgICAgICAgIHRvcDogMC41XG4gICAgICAgIH0sXG4gICAgICAgIGlkOiAnc3lkbmV5X29wZXJhX2hvdXNlLnBuZyAwc2VkNjdoJyxcbiAgICAgICAgY29sb3I6ICcjMkUxRDA3JyxcbiAgICAgICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAzLmpwZycsXG4gICAgICAgIGNhcHRpb246ICdCeSBmb2xsb3dpbmcgdGhlIGNsdWVzIGZyb20gRGF2ZVxcJ3MgdmlzaW9uLCBoZSBhbmQgVmluY2UgZmluZCB0aGUgc2NlbmUgb2YgdGhlIE5vIE1hcmsgS2lsbGVyXFwncyBtb3N0IHJlY2VudCBjcmltZS4gVGhleSBhbHNvIGZpbmQgYSBzdXJ2aXZvci4gVW5mb3J0dW5hdGVseSwgc2hlIGNhblxcJ3QgcmVtZW1iZXIgYW55dGhpbmcuIEhlciBtZW1vcnkgaGFzIGJlZW4gd2lwZWQsIHdoaWNoIGdldHMgdGhlbSB0byB0aGlua2luZyBhYm91dCB3aG8gbWF5IGJlIG5leHQgb24gQ3JvYXRvYW5cXCdzIGxpc3QuJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICAgICAgY2F0ZWdvcmllczogJycsXG4gICAgICAgIHRhZ3M6ICcnLFxuICAgICAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICAgICAgY3JlZGl0OiAnJyxcbiAgICAgICAgY29weXJpZ2h0OiAnJyxcbiAgICAgICAgcmVmZXJlbmNlOiB7XG4gICAgICAgICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgICAgICAgc2Vhc29uOiA1LFxuICAgICAgICAgICAgZXBpc29kZTogMThcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICB1cmw6ICdpbWcvZG9vZGxlL3Rhal9tYWhhbC5wbmcnLFxuICAgICAgICBmb2NhbFBvaW50OiB7XG4gICAgICAgICAgICBsZWZ0OiAwLjUsXG4gICAgICAgICAgICB0b3A6IDAuNVxuICAgICAgICB9LFxuICAgICAgICBpZDogJ3Rhal9tYWhhbC5wbmcgOTQzbmJrYScsXG4gICAgICAgIGNvbG9yOiAnIzAwNDQ1RicsXG4gICAgICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNC5qcGcnLFxuICAgICAgICBjYXB0aW9uOiAnT24gdGhlaXIgd2F5IHRvIG1lZXQgd2l0aCBMYWluZXksIE5hdGhhbiBicmVha3MgaGlzIHRpcmUgaXJvbiB3aGlsZSB0cnlpbmcgdG8gZml4IGEgZmxhdCB0aXJlLiBUb3VnaCBicmVhay4gQW5kIHRoZW4gRHdpZ2h0IGdldHMgYSBzaG9vdGluZyBwYWluIGluIGhpcyBzaWRlIHdpdGggYSBnbmFybHkgYnJ1aXNlIHRvIG1hdGNoLCBldmVuIHRvdWdoZXIgYnJlYWsuIEFuZCB0aGVuIGJvdGggZ3V5cyBub3RpY2UgdGhhdCB0aGV5IG5vdyBoYXZlIFJvbWFuIG51bWVyYWwgdGF0dG9vcyBvbiB0aGVpciB3cmlzdHMuIFRoZSBudW1iZXIgWCBmb3IgTmF0aGFuIGFuZCBYSUkgZm9yIER3aWdodC4nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgICAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICAgICAgdGFnczogJycsXG4gICAgICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgICAgICBjcmVkaXQ6ICcnLFxuICAgICAgICBjb3B5cmlnaHQ6ICcnLFxuICAgICAgICByZWZlcmVuY2U6IHtcbiAgICAgICAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICAgICAgICBzZWFzb246IDUsXG4gICAgICAgICAgICBlcGlzb2RlOiAxOFxuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIHVybDogJ2ltZy9kb29kbGUvd2luZG1pbGwucG5nJyxcbiAgICAgICAgZm9jYWxQb2ludDoge1xuICAgICAgICAgICAgbGVmdDogMC41LFxuICAgICAgICAgICAgdG9wOiAwLjVcbiAgICAgICAgfSxcbiAgICAgICAgaWQ6ICd3aW5kbWlsbC5wbmcgamVybDM0JyxcbiAgICAgICAgY29sb3I6ICcjMkYzODM3JyxcbiAgICAgICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA1LmpwZycsXG4gICAgICAgIGNhcHRpb246ICdJbiB0aGUgbWluZXNoYWZ0LCBDaGFybG90dGUgYW5kIEF1ZHJleSBoYXZlIHRha2VuIG9uIHRoZSB0YXNrIG9mIGNvbGxlY3RpbmcgYWxsIG9mIHRoZSBhZXRoZXIgdG8gY3JlYXRlIGFuIGFldGhlciBjb3JlLiBUaGlzIGlzIHRoZSBmaXJzdCBzdGVwIHRoZXkgbmVlZCB0byBjcmVhdGUgYSBuZXcgQmFybiB3aGVyZSBUcm91YmxlIHBlb3BsZSBjYW4gc3RlcCBpbnNpZGUgYW5kIHRoZW4gYmUgXCJjdXJlZFwiIG9mIHRoZWlyIFRyb3VibGVzIHdoZW4gdGhleSBzdGVwIG91dC4gU291bmRzIGVhc3kgZW5vdWdoIGJ1dCB0aGV5XFwncmUgaGF2aW5nIHRyb3VibGUgY29ycmFsbGluZyBhbGwgdGhlIGFldGhlciBpbnRvIGEgZ2lhbnQgYmFsbC4gVW5zdXJwcmlzaW5nbHksIHRoZSBzd2lybGluZyBibGFjayBnb28gaXNuXFwndCB3aWxsZnVsbHkgY29vcGVyYXRpbmcuJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICAgICAgY2F0ZWdvcmllczogJycsXG4gICAgICAgIHRhZ3M6ICcnLFxuICAgICAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICAgICAgY3JlZGl0OiAnJyxcbiAgICAgICAgY29weXJpZ2h0OiAnJyxcbiAgICAgICAgcmVmZXJlbmNlOiB7XG4gICAgICAgICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgICAgICAgc2Vhc29uOiA1LFxuICAgICAgICAgICAgZXBpc29kZTogMThcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICB1cmw6ICdpbWcvZG9vZGxlL3RyZWVfMS5wbmcnLFxuICAgICAgICBmb2NhbFBvaW50OiB7XG4gICAgICAgICAgICBsZWZ0OiAwLjUsXG4gICAgICAgICAgICB0b3A6IDAuNVxuICAgICAgICB9LFxuICAgICAgICBpZDogJ3RyZWVfMS5wbmcnLFxuICAgICAgICBjb2xvcjogJyM2MzYyNEMnLFxuICAgICAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDYuanBnJyxcbiAgICAgICAgY2FwdGlvbjogJ0FzIGlmIHRoZSBhZXRoZXIgd2FzblxcJ3QgZW5vdWdoIG9mIGEgcHJvYmxlbSB0byB0YWNrbGUsIENoYXJsb3R0ZSBmZWVscyBoZXJzZWxmIGdldHRpbmcgd2Vha2VyIGJ5IHRoZSBtaW51dGUgYW5kIHRoZW4gQXVkcmV5IHN0YXJ0cyB0byBsb3NlIGhlciBleWVzaWdodC4gVGhleSBsb29rIGF0IHRoZWlyIHdyaXN0cyBhbmQgbm90aWNlIHRoYXQgdGhlIFJvbWFuIG51bWJlciBwcm9ibGVtIGhhcyBub3cgYWZmZWN0ZWQgdGhlbSB0b28sIHRoZSBudW1iZXJzIElJIGZvciBBdWRyZXkgYW5kIFZJSUkgZm9yIENoYXJsb3R0ZS4nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgICAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICAgICAgdGFnczogJycsXG4gICAgICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgICAgICBjcmVkaXQ6ICcnLFxuICAgICAgICBjb3B5cmlnaHQ6ICcnLFxuICAgICAgICByZWZlcmVuY2U6IHtcbiAgICAgICAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICAgICAgICBzZWFzb246IDUsXG4gICAgICAgICAgICBlcGlzb2RlOiAxOFxuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIHVybDogJ2ltZy9kb29kbGUvdHJlZV8yLnBuZycsXG4gICAgICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgICAgICAgIGxlZnQ6IDAuNSxcbiAgICAgICAgICAgIHRvcDogMC41XG4gICAgICAgIH0sXG4gICAgICAgIGlkOiAndHJlZV8yLnBuZycsXG4gICAgICAgIGNvbG9yOiAnIzRBNTA0RScsXG4gICAgICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNy5qcGcnLFxuICAgICAgICBjYXB0aW9uOiAnSW4gTm9ydGggQ2Fyb2xpbmEsIER1a2UgYW5kIFNldGggc2l0IHdpdGggYSBsb2NhbCBtYW4gd2hvIGNsYWltcyB0byBiZSBhYmxlIHRvIHJlbW92ZSB0aGUgXCJibGFjayB0YXJcIiBmcm9tIER1a2VcXCdzIHNvdWwuIEFmdGVyIGFuIGVsYWJvcmF0ZSBwZXJmb3JtYW5jZSwgRHVrZSByZWFsaXplcyB0aGF0IHRoZSBndXkgaXMgYSBmYWtlLiBUaGUgcmF0dGxlZCBndXkgd2hvIGRvZXNuXFwndCB3YW50IGFueSB0cm91YmxlIGZyb20gRHVrZSB0ZWxscyB0aGVtIHRoYXQgV2FsdGVyIEZhcmFkeSB3aWxsIGhhdmUgdGhlIHJlYWwgYW5zd2VycyB0byBEdWtlXFwncyBxdWVzdGlvbnMuIFdoZW4gdGhleSBnbyBsb29raW5nIGZvciBXYWx0ZXIsIHRoZXkgZmluZCBoaW0g4oCmIGFuZCBoaXMgaGVhZHN0b25lIHRoYXQgaGFzIGEgZmFtaWxpYXIgbWFya2luZyBvbiBpdCwgdGhlIHN5bWJvbCBmb3IgVGhlIEd1YXJkLiBXaGF0IGdpdmVzPyBKdXN0IGFzIER1a2UgaXMgYWJvdXQgdG8gZ2l2ZSB1cCBoZSBnZXRzIGEgdmlzaXQgZnJvbSBXYWx0ZXJcXCdzIGdob3N0IHdobyBwcm9taXNlcyB0byBnaXZlIGhpbSBhbnN3ZXJzIHRvIGFsbCBvZiB0aGUgcXVlc3Rpb25zIOKApnZpYSB0aGUgbmV4dCBlcGlzb2RlIG9mIGNvdXJzZS4gQ2xpZmZoYW5nZXIhJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICAgICAgY2F0ZWdvcmllczogJycsXG4gICAgICAgIHRhZ3M6ICcnLFxuICAgICAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICAgICAgY3JlZGl0OiAnJyxcbiAgICAgICAgY29weXJpZ2h0OiAnJyxcbiAgICAgICAgcmVmZXJlbmNlOiB7XG4gICAgICAgICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgICAgICAgc2Vhc29uOiA1LFxuICAgICAgICAgICAgZXBpc29kZTogMThcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICB1cmw6ICdpbWcvZG9vZGxlL3RyZWVfMy5wbmcnLFxuICAgICAgICBmb2NhbFBvaW50OiB7XG4gICAgICAgICAgICBsZWZ0OiAwLjUsXG4gICAgICAgICAgICB0b3A6IDAuNVxuICAgICAgICB9LFxuICAgICAgICBpZDogJ3RyZWVfMy5wbmcnLFxuICAgICAgICBjb2xvcjogJyNERDlGMDAnLFxuICAgICAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDguanBnJyxcbiAgICAgICAgY2FwdGlvbjogJ0FmdGVyIHNvbWUgcHJvZGRpbmcsIER3aWdodCBhbmQgTmF0aGFuIGZpbmQgdGhhdCBMYWluZXkgZ290IGEgdmlzaXQgZnJvbSBDcm9hdG9hbiBhbmQgXCJsb3N0IHRpbWVcIi4gU2hlIGRvZXNuXFwndCByZW1lbWJlcmluZyBkcmF3aW5nIGNhcmRzIGZvciBhbnkgb2YgdGhlbS4gTmF0aGFuIGhhcyBoZXIgZHJhdyBuZXcgY2FyZHMgYW5kIGEgaGVzaXRhbnQgTGFpbmV5IGRvZXMuIER3aWdodCBpcyBnaXZlbiBhIGJvbmRhZ2UgZmF0ZSBhbmQgaXMgbGF0ZXIgc2hhY2tsZWQgYnkgY2hhaW5zIHRvIGEgZ2F0ZSwgQ2hhcmxvdHRlIHdpbGwgYmUgcmV1bml0ZWQgd2l0aCBoZXIgdHJ1ZSBsb3ZlIChobW3igKYpIGFuZCBBdWRyZXkgaXMgYWxpZ25lZCB3aXRoIHRoZSBtb29uLiBOb3QgcGVyZmVjdCBmYXRlcywgYnV0IGl0XFwncyBlbm91Z2ggdG8gZ2V0IGV2ZXJ5b25lIG91dCBvZiB0aGUgcGlja2xlcyB0aGVpciBjdXJyZW50bHkgaW4uJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICAgICAgY2F0ZWdvcmllczogJycsXG4gICAgICAgIHRhZ3M6ICcnLFxuICAgICAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICAgICAgY3JlZGl0OiAnJyxcbiAgICAgICAgY29weXJpZ2h0OiAnJyxcbiAgICAgICAgcmVmZXJlbmNlOiB7XG4gICAgICAgICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgICAgICAgc2Vhc29uOiA1LFxuICAgICAgICAgICAgZXBpc29kZTogMThcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICB1cmw6ICdpbWcvZG9vZGxlL3RyZWVfNC5wbmcnLFxuICAgICAgICBmb2NhbFBvaW50OiB7XG4gICAgICAgICAgICBsZWZ0OiAwLjUsXG4gICAgICAgICAgICB0b3A6IDAuNVxuICAgICAgICB9LFxuICAgICAgICBpZDogJ3RyZWVfNC5wbmcnLFxuICAgICAgICBjb2xvcjogJyM4RkM5OUInLFxuICAgICAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDkuanBnJyxcbiAgICAgICAgY2FwdGlvbjogJ1dpdGggdGhlaXIgc3RyZW5ndGggcmVnYWluZWQsIEF1ZHJleSBhbmQgQ2hhcmxvdHRlIGFyZSBhYmxlIHRvIGNyZWF0ZSB0aGUgYWV0aGVyIGNvcmUgdGhleSBuZWVkLiBDaGFybG90dGUgaW5zdHJ1Y3RzIEF1ZHJleSB0byBnbyBhbmQgaGlkZSBpdCBzb21lIHBsYWNlIHNhZmUuIEluIHRoZSBpbnRlcmltLCBDaGFybG90dGUga2lzc2VzIER3aWdodCBnb29kYnllIGFuZCBnaXZlcyBoaW0gdGhlIHJpbmcgc2hlIG9uY2UgdXNlZCB0byBzbGlwIGludG8gVGhlIFZvaWQuIExhdGVyLCB3aXRoIGhlciBtb29uIGFsaWdubWVudCBjYXVzaW5nIEF1ZHJleSB0byBkaXNhcHBlYXIgYW5kIER3aWdodCBzdGlsbCBzaGFja2xlZCwgTGFpbmV5IHB1bGxzIGFub3RoZXIgY2FyZCBmb3IgdGhlIGVudGlyZSBncm91cCwgYSBqdWRnbWVudCBjYXJkLCB3aGljaCBzaGUgcmVhZHMgdG8gbWVhbiB0aGF0IGFzIGFsb25nIGFzIHRoZWlyIGludGVudGlvbnMgYXJlIHB1cmUgdGhleSBjYW4gYWxsIG92ZXJjb21lIGFueSBvYnN0YWNsZXMuIFRoaXMgaXMgZ3JlYXQgbmV3cyBmb3IgZXZlcnlvbmUgZXhjZXB0Li4uJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICAgICAgY2F0ZWdvcmllczogJycsXG4gICAgICAgIHRhZ3M6ICcnLFxuICAgICAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICAgICAgY3JlZGl0OiAnJyxcbiAgICAgICAgY29weXJpZ2h0OiAnJyxcbiAgICAgICAgcmVmZXJlbmNlOiB7XG4gICAgICAgICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgICAgICAgc2Vhc29uOiA1LFxuICAgICAgICAgICAgZXBpc29kZTogMThcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICB1cmw6ICdpbWcvZG9vZGxlL3RyZWVfNS5wbmcnLFxuICAgICAgICBmb2NhbFBvaW50OiB7XG4gICAgICAgICAgICBsZWZ0OiAwLjUsXG4gICAgICAgICAgICB0b3A6IDAuNVxuICAgICAgICB9LFxuICAgICAgICBpZDogJ3RyZWVfNS5wbmcnLFxuICAgICAgICBjb2xvcjogJyNCRkM5QTInLFxuICAgICAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMTAuanBnJyxcbiAgICAgICAgY2FwdGlvbjogJ0NoYXJsb3R0ZS4gQ3JvYXRvYW4gcGF5cyBoZXIgYSB2aXNpdCBpbiBoZXIgYXBhcnRtZW50IHRvIHRlbGwgaGVyIHRoYXQgaGVcXCdzIHBpc3NlZCB0aGF0IHNoZVxcJ3MgXCJvbmUgb2YgdGhlbSBub3dcIiBhbmQgdGhhdCBzaGUgY2hvc2UgQXVkcmV5IG92ZXIgTWFyYS4gQ3JvYXRvYW4gd2FzdGVzIG5vIHRpbWUgaW4ga2lsbGluZyBDaGFybG90dGUgYW5kIHNoZSBjbGluZ3MgdG8gbGlmZSBmb3IganVzdCBlbm91Z2ggdGltZSB0byBiZSBmb3VuZCBieSBBdWRyZXkgc28gc2hlIGNhbiBnaXZlIGhlciB0aGUgbW9zdCBzaG9ja2luZyBuZXdzIG9mIHRoZSBzZWFzb246IENyb2F0b2FuIGlzIEF1ZHJleVxcJ3MgZmF0aGVyIGFuZCBoZVxcJ3MgZ290IFwicGxhbnNcIiBmb3IgaGVyIScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgICAgICB0YWdzOiAnJyxcbiAgICAgICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgICAgIGNyZWRpdDogJycsXG4gICAgICAgIGNvcHlyaWdodDogJycsXG4gICAgICAgIHJlZmVyZW5jZToge1xuICAgICAgICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgICAgICAgIHNlYXNvbjogNSxcbiAgICAgICAgICAgIGVwaXNvZGU6IDE4XG4gICAgICAgIH1cbiAgICB9XG5dO1xuXG52YXIgZmlsZUltZ0NvbG9ycyA9IFtcbiAgICAnIzRERDBFMScsXG4gICAgJyM4MERFRUEnLFxuICAgICcjRkZENTRGJyxcbiAgICAnI0ZGRTA4MicsXG4gICAgJyNGRjcwNDMnLFxuICAgICcjRkY3MDQzJyxcbiAgICAnIzgwQ0JDNCcsXG4gICAgJyNEM0VDRUMnLFxuICAgICcjNTVBRUNBJyxcbiAgICAnI0ZGQzYwMCdcbl07XG5cbmZ1bmN0aW9uIGhhbmRsZU1lbnVDbGljayhlKSB7XG4gICAgY29uc29sZS5sb2coJCgnI2xlYXZlUGFnZVByb21wdCcpLmxlbmd0aCk7XG4gICAgaWYgKCQoJyNsZWF2ZVBhZ2VQcm9tcHQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB2YXIgbGlua1RleHQgPSAkKGUudGFyZ2V0KS50ZXh0KCksXG4gICAgICAgICAgICBsaW5rU3JjID0gZS50YXJnZXQuaHJlZjtcblxuICAgICAgICBjb25zb2xlLmxvZyhsaW5rVGV4dCwgbGlua1NyYyk7XG5cbiAgICAgICAgLy9JbmJ1bmQgYWN0b25zIGZyb20gYnV0dG9uc1xuICAgICAgICAkKCcjbGVhdmVQYWdlUHJvbXB0IC5idXR0b25zJykudW5iaW5kKCdjbGljaycpO1xuXG4gICAgICAgIC8vU2V0IGNvbmZpcm1hdGlvbiBidXR0b25cbiAgICAgICAgJCgnI2xlYXZlUGFnZScpLnRleHQoJ0dvIHRvICcgKyBsaW5rVGV4dCkuY2xpY2soZnVuY3Rpb24oKSB7d2luZG93LmxvY2F0aW9uLmhyZWYgPSBsaW5rU3JjO30pO1xuXG4gICAgICAgIC8vU2V0IGNhbmNlbGF0aW9uIGJ1dHRvblxuICAgICAgICAkKCcjY2FuY2VsTGVhdmVQYWdlJykuY2xpY2soZnVuY3Rpb24oKSB7JCgnI2xlYXZlUGFnZVByb21wdCcpLnRvZ2dsZUNsYXNzKCdoaWRkZW4gbW9kYWwnKTt9KTtcblxuICAgICAgICAvL1Nob3cgY29uZmlybWF0aW9uIHByb21wdFxuICAgICAgICAkKCcjbGVhdmVQYWdlUHJvbXB0JykudG9nZ2xlQ2xhc3MoJ2hpZGRlbiBtb2RhbCcpO1xuICAgIH1cbn1cblxudmFyIGdhbGxlcnlPYmplY3RzID0gWy8qXG4gICAge1xuICAgICAgICB1cmw6ICdpbWcvZG9vZGxlL0FsZXgucG5nJyxcbiAgICAgICAgZm9jYWxQb2ludDoge1xuICAgICAgICAgICAgbGVmdDogMC41LFxuICAgICAgICAgICAgdG9wOiAwLjVcbiAgICAgICAgfSxcbiAgICAgICAgY29sb3I6ICcjQjBERURBJyxcbiAgICAgICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAxLmpwZycsXG4gICAgICAgIGNhcHRpb246ICdXcml0ZXIsIEJyaWFuIE1pbGxpa2luLCBhIG1hbiBhYm91dCBIYXZlbiwgdGFrZXMgdXMgYmVoaW5kIHRoZSBzY2VuZXMgb2YgdGhpcyBlcGlzb2RlIGFuZCBnaXZlcyB1cyBhIGZldyB0ZWFzZXMgYWJvdXQgdGhlIFNlYXNvbiB0aGF0IHdlIGNhblxcJ3Qgd2FpdCB0byBzZWUgcGxheSBvdXQhIFRoaXMgaXMgdGhlIGZpcnN0IGVwaXNvZGUgb2YgSGF2ZW4gbm90IGZpbG1lZCBpbiBvciBhcm91bmQgQ2hlc3RlciwgTm92YSBTY290aWEuIEJlZ2lubmluZyBoZXJlLCB0aGUgc2hvdyBhbmQgaXRzIHN0YWdlcyByZWxvY2F0ZWQgdG8gSGFsaWZheC4nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgICAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICAgICAgdGFnczogJycsXG4gICAgICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgICAgIGNyZWRpdDogJycsXG4gICAgICAgIGNvcHlyaWdodDogJycsXG4gICAgICAgIHJlZmVyZW5jZToge1xuICAgICAgICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgICAgICAgIHNlYXNvbjogNSxcbiAgICAgICAgICAgIGVwaXNvZGU6IDE4XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgdXJsOiAnaW1nL2Rvb2RsZS9DeW50aWEucG5nJyxcbiAgICAgICAgZm9jYWxQb2ludDoge1xuICAgICAgICAgICAgbGVmdDogMC41LFxuICAgICAgICAgICAgdG9wOiAwLjVcbiAgICAgICAgfSxcbiAgICAgICAgY29sb3I6ICcjRkRCRDAwJyxcbiAgICAgICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAyLmpwZycsXG4gICAgICAgIGNhcHRpb246ICdDaGFybG90dGUgbGF5cyBvdXQgaGVyIHBsYW4gZm9yIHRoZSBmaXJzdCB0aW1lIGluIHRoaXMgZXBpc29kZTogdG8gYnVpbGQgYSBuZXcgQmFybiwgb25lIHRoYXQgd2lsbCBjdXJlIFRyb3VibGVzIHdpdGhvdXQga2lsbGluZyBUcm91YmxlZCBwZW9wbGUgaW4gdGhlIHByb2Nlc3MuIEhlciBwbGFuLCBhbmQgd2hhdCBwYXJ0cyBpdCByZXF1aXJlcywgd2lsbCBjb250aW51ZSB0byBwbGF5IGEgbW9yZSBhbmQgbW9yZSBpbXBvcnRhbnQgcm9sZSBhcyB0aGUgc2Vhc29uIGdvZXMgYWxvbmcuJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICAgICAgY2F0ZWdvcmllczogJycsXG4gICAgICAgIHRhZ3M6ICcnLFxuICAgICAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICAgICAgY3JlZGl0OiAnJyxcbiAgICAgICAgY29weXJpZ2h0OiAnJyxcbiAgICAgICAgcmVmZXJlbmNlOiB7XG4gICAgICAgICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgICAgICAgc2Vhc29uOiA1LFxuICAgICAgICAgICAgZXBpc29kZTogMThcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICB1cmw6ICdpbWcvZG9vZGxlL0dhcnJ5LnBuZycsXG4gICAgICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgICAgICAgIGxlZnQ6IDAuNSxcbiAgICAgICAgICAgIHRvcDogMC41XG4gICAgICAgIH0sXG4gICAgICAgIGNvbG9yOiAnI0VENDEyRCcsXG4gICAgICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMy5qcGcnLFxuICAgICAgICBjYXB0aW9uOiAnTG9zdCB0aW1lIHBsYXlzIGFuIGV2ZW4gbW9yZSBpbXBvcnRhbnQgcm9sZSBpbiB0aGlzIGVwaXNvZGUgdGhhbiBldmVyIGJlZm9yZeKAlCBhcyBpdOKAmXMgcmV2ZWFsZWQgdGhhdCBpdOKAmXMgYSB3ZWFwb24gdGhlIGdyZWF0IGV2aWwgZnJvbSBUaGUgVm9pZCBoYXMgYmVlbiB1c2luZyBhZ2FpbnN0IHVzLCBhbGwgc2Vhc29uIGxvbmcuIFdoaWNoIGdvZXMgYmFjayB0byB0aGUgY2F2ZSB1bmRlciB0aGUgbGlnaHRob3VzZSBpbiBiZWdpbm5pbmcgb2YgdGhlIFNlYXNvbiA1IHByZW1pZXJlLicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgICAgICB0YWdzOiAnJyxcbiAgICAgICAgYWx0VGV4dDogJ0xvc3QgdGltZScsXG4gICAgICAgIGNyZWRpdDogJycsXG4gICAgICAgIGNvcHlyaWdodDogJycsXG4gICAgICAgIHJlZmVyZW5jZToge1xuICAgICAgICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgICAgICAgIHNlYXNvbjogNSxcbiAgICAgICAgICAgIGVwaXNvZGU6IDE4XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgdXJsOiAnaW1nL2Rvb2RsZS9IZWxlbi5wbmcnLFxuICAgICAgICBmb2NhbFBvaW50OiB7XG4gICAgICAgICAgICBsZWZ0OiAwLjUsXG4gICAgICAgICAgICB0b3A6IDAuNVxuICAgICAgICB9LFxuICAgICAgICBjb2xvcjogJyMzMkE0QjcnLFxuICAgICAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDQuanBnJyxcbiAgICAgICAgY2FwdGlvbjogJ1RoZSDigJxhZXRoZXIgY29yZeKAnSB0aGF0IENoYXJsb3R0ZSBhbmQgQXVkcmV5IG1ha2UgcHJlc2VudGVkIGFuIGltcG9ydGFudCBkZXNpZ24gY2hvaWNlLiBUaGUgd3JpdGVycyB3YW50ZWQgaXQgdG8gbG9vayBvcmdhbmljIGJ1dCBhbHNvIGRlc2lnbmVk4oCUIGxpa2UgdGhlIHRlY2hub2xvZ3kgb2YgYW4gYWR2YW5jZWQgY3VsdHVyZSBmcm9tIGEgZGlmZmVyZW50IGRpbWVuc2lvbiwgY2FwYWJsZSBvZiBkb2luZyB0aGluZ3MgdGhhdCB3ZSBtaWdodCBwZXJjZWl2ZSBhcyBtYWdpYyBidXQgd2hpY2ggaXMganVzdCBzY2llbmNlIHRvIHRoZW0uIFRoZSB2YXJpb3VzIGRlcGljdGlvbnMgb2YgS3J5cHRvbmlhbiBzY2llbmNlIGluIHZhcmlvdXMgU3VwZXJtYW4gc3RvcmllcyB3YXMgb25lIGluc3BpcmF0aW9uLicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgICAgICB0YWdzOiAnJyxcbiAgICAgICAgYWx0VGV4dDogJ0NoYXJsb3R0ZSBhbmQgQXVkcmV5JyxcbiAgICAgICAgY3JlZGl0OiAnJyxcbiAgICAgICAgY29weXJpZ2h0OiAnJyxcbiAgICAgICAgcmVmZXJlbmNlOiB7XG4gICAgICAgICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgICAgICAgc2Vhc29uOiA1LFxuICAgICAgICAgICAgZXBpc29kZTogMThcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICB1cmw6ICdpbWcvZG9vZGxlL0pvaG4ucG5nJyxcbiAgICAgICAgZm9jYWxQb2ludDoge1xuICAgICAgICAgICAgbGVmdDogMC41LFxuICAgICAgICAgICAgdG9wOiAwLjVcbiAgICAgICAgfSxcbiAgICAgICAgY29sb3I6ICcjRDNFQ0VDJyxcbiAgICAgICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzA1LmpwZycsXG4gICAgICAgIGNhcHRpb246ICdUaGlzIGlzIHRoZSBmaXJzdCBlcGlzb2RlIGluIFNlYXNvbiA1IGluIHdoaWNoIHdl4oCZdmUgbG9zdCBvbmUgb2Ygb3VyIGhlcm9lcy4gSXQgd2FzIGltcG9ydGFudCB0byBoYXBwZW4gYXMgd2UgaGVhZCBpbnRvIHRoZSBob21lIHN0cmV0Y2ggb2YgdGhlIHNob3cgYW5kIGFzIHRoZSBzdGFrZXMgaW4gSGF2ZW4gaGF2ZSBuZXZlciBiZWVuIG1vcmUgZGlyZS4gQXMgYSByZXN1bHQsIGl0IHdvbuKAmXQgYmUgdGhlIGxhc3QgbG9zcyB3ZVxcJ2xsIHN1ZmZlciB0aGlzIHNlYXNvbuKApicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgICAgICB0YWdzOiAnJyxcbiAgICAgICAgYWx0VGV4dDogJ1dpbGQgQ2FyZCcsXG4gICAgICAgIGNyZWRpdDogJycsXG4gICAgICAgIGNvcHlyaWdodDogJycsXG4gICAgICAgIHJlZmVyZW5jZToge1xuICAgICAgICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgICAgICAgIHNlYXNvbjogNSxcbiAgICAgICAgICAgIGVwaXNvZGU6IDE4XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgdXJsOiAnaW1nL2Rvb2RsZS9Nb25pY2EucG5nJyxcbiAgICAgICAgZm9jYWxQb2ludDoge1xuICAgICAgICAgICAgbGVmdDogMC41LFxuICAgICAgICAgICAgdG9wOiAwLjVcbiAgICAgICAgfSxcbiAgICAgICAgY29sb3I6ICcjMkE3QzkxJyxcbiAgICAgICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzA2LmpwZycsXG4gICAgICAgIGNhcHRpb246ICdUaGUgY2hhbGxlbmdlIGluIENoYXJsb3R0ZVxcJ3MgZmluYWwgY29uZnJvbnRhdGlvbiB3YXMgdGhhdCB0aGUgc2hvdyBjb3VsZG7igJl0IHJldmVhbCBoZXIgYXR0YWNrZXLigJlzIGFwcGVhcmFuY2UgdG8gdGhlIGF1ZGllbmNlLCBzbyB0aGUgZGFya25lc3Mgd2FzIG5lY2Vzc2l0YXRlZC4nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgICAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICAgICAgdGFnczogJycsXG4gICAgICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgICAgICBjcmVkaXQ6ICcnLFxuICAgICAgICBjb3B5cmlnaHQ6ICcnLFxuICAgICAgICByZWZlcmVuY2U6IHtcbiAgICAgICAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICAgICAgICBzZWFzb246IDUsXG4gICAgICAgICAgICBlcGlzb2RlOiAxOFxuICAgICAgICB9XG4gICAgfSovXG5dOyJdLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
