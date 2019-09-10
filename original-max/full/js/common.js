//Menu
function normilizeMenu() {
  var pageName = window.location.href.split('/').pop(),
  menuItems = $('.js-menu .js-menuItem');
  activeMenuItem = $('[data-target="' + pageName + '"]');

  menuItems.removeClass('is-active').click(handleMenuItemClick);
  activeMenuItem.addClass('is-active');
  activeMenuItem.parents('.menu__item').addClass('is-open');
}
function handleMenuItemClick(e) {
  if ($(e.target).attr('data-target')) {
    if (window.location.href.indexOf('create') >= 0 && !draftIsSaved && $('.js-content .file, .js-content .js-hasValue').length > 0) {
      new Modal({
        title: 'Leave Page?',
        text: 'You will lose all the unsaved changes. Are you sure you want to leave this page?',
        confirmText: 'Leave Page',
        confirmAction: function() {
          window.location.href = $(e.target).attr('data-target');
        }
      });
    } else {
      window.location.href = $(e.target).attr('data-target');
    }
  } else {
    if ($(e.target).parents('.menu__item').hasClass('is-open')) {
      $(e.target).parents('.menu__item').removeClass('is-open');
    } else {
      $('.menu__item').removeClass('is-open');
      $(e.target).parents('.menu__item').addClass('is-open');
    }
  }
}

$('#menuToggle').click(openMenu);
$('.js-menu > .js-close').click(closeMenu);

function openMenu(e) {
  $('.js-menu').addClass('is-open');
  window.addEventListener('mousedown', closeMenu);
}
function closeMenu(e) {
  if ($(e.target).parents('.menu__list').length === 0) {
    $('.js-menu').removeClass('is-open');
    window.removeEventListener('mousedown', closeMenu);
  }
}

//selection

function toggleFileSelect(e) {
	e.stopPropagation();
	e.preventDefault();
	var file = $(e.target).parents('.file'),
		filesSection = file.parent(),
		files = filesSection.children('.file'),
		selectedFiles = filesSection.children('.file.selected'),
		single = singleselect || false;

	if (single) {
		if (file.hasClass('selected')) {
			file.removeClass('selected');
		} else {
			filesSection.find('.file').removeClass('selected');
			file.addClass('selected');
		}
	} else {
		//Check if user hold Shift Key
		if (e.shiftKey) {
			if (file.hasClass('selected')) {
				file.removeClass('selected');
			}
			else {
				if (selectedFiles) {
					var fileIndex = file.index('.file'),
						filesToBeSelect = files.slice(lastSelected, fileIndex + 1);

					if (lastSelected > fileIndex) {
						filesToBeSelect = files.slice(fileIndex, lastSelected);
					}
					filesToBeSelect.addClass('selected');
					filesToBeSelect.removeClass('is-preselected');
				}
				else {
					file.toggleClass('selected is-preselected');
				}
			}
		}
		else {
			file.toggleClass('selected');
		}
		lastSelected = file.index();
		normalizeSelecteion();
	}
}
function normalizeSelecteion() {
	var bulkDeleteButton = $('#bulkRemove'),
		bulkEditButton = $('#bulkEdit'),
		multiEditButton = $('#multiEdit'),
		moreActionsButton = $('#moreActions'),

		selectAllButton = $('#selectAll'),
		selectAllLabel = $('#selectAllLabel'),

		deselectAllButton = $('#deselectAll'),
		deselectAllLabel = $('#deselectAllLabel'),

		deleteButtons = $('.js-content .files .file .file__delete'),
		editButtons = $('.js-content .files .file .button').not('.c-File-coverTogle'),
		arrangements = $('.js-content .files .file .file__arragement'),
		arrangementInputs = $('.js-content .files .file .file__arragement').find('input'),
		setCoverButtons = $('.js-content .files .file button.c-File-coverTogle'),

		selectedDeleteButton = $('.js-content .files .file.selected .file__delete'),
		selectedEditButton = $('.js-content .files .file.selected .button'),
		selectedArrangement = $('.js-content .files .file.selected .file__arragement'),
		selectedArrangementInput = $('.js-content .files .file.selected .file__arragement').find('input'),
		selectedSetCoverButtons = $('.js-content .files .file.selected button.c-File-coverTogle'),

		numberOfFiles = $('.js-content .files .file').length,
		numberOfSelectedFiles = $('.js-content .files .file.selected').length,
		numberOfSelectedImages = $('.js-content .files .file.js-imgFileType.selected').length,
		numberOfSelectedVideos = $('.js-content .files .file.js-videoFileType.selected').length;

		unselectedFiles = $('.js-content .files .file').not('.selected');

	//No selected files
	if (numberOfSelectedFiles === 0) {
		selectAllButton.removeClass('all disabled').addClass('empty');
		selectAllLabel.text('Select All').removeClass('disabled');

		deselectAllButton.removeClass('is-all').addClass('is-empty disabled');
		deselectAllLabel.addClass('disabled');

		bulkDeleteButton.addClass('disabled').prop('disabled', true);
		bulkEditButton.addClass('disabled').prop('disabled', true);
		bulkEditButton.find('.button__warning').addClass('is-hidden');
		multiEditButton.addClass('disabled').prop('disabled', true);
		moreActionsButton.addClass('disabled').prop('disabled', true);

		editButtons.removeClass('hidden');
		deleteButtons.removeClass('hidden');
		arrangements.removeClass('disabled');
		arrangementInputs.prop('disabled', false);
		setCoverButtons.prop('disabled', false).removeClass('is-disabled');

		unselectedFiles.removeClass('is-preselected');

		if ($('#assets-count').length > 0) {normalizeAssetsCount();}

		if (numberOfFiles === 0) {
			selectAllButton.addClass('disabled');
			selectAllLabel.addClass('disabled');

			deselectAllButton.addClass('disabled');
			deselectAllLabel.addClass('disabled');
		}
	}
	//Some files are selected
	else if (numberOfSelectedFiles > 0) {
		selectAllButton.removeClass('empty all');
		selectAllLabel.text('Deselect All');

		deselectAllButton.removeClass('is-empty is-all disabled');
		deselectAllLabel.removeClass('disabled');


		bulkDeleteButton.removeClass('disabled').prop('disabled', false);
		bulkEditButton.removeClass('disabled').prop('disabled', false);
		multiEditButton.removeClass('disabled').prop('disabled', false);
		moreActionsButton.removeClass('disabled').prop('disabled', false);

		editButtons.addClass('hidden');
		deleteButtons.addClass('hidden');
		arrangements.addClass('disabled');
		arrangementInputs.prop('disabled', true);
		setCoverButtons.prop('disabled', true).addClass('is-disabled');

		unselectedFiles.addClass('is-preselected');

		if ($('#assets-count').length > 0) {
			$('#assets-count').text(numberOfSelectedFiles.toString() + ' of ' + galleryObjects.length + ' selected');
		}

		if (numberOfSelectedVideos && numberOfSelectedImages) {
			bulkEditButton.find('.button__warning').removeClass('is-hidden');
			multiEditButton.find('.button__warning').removeClass('is-hidden');
		} else {
			bulkEditButton.find('.button__warning').addClass('is-hidden');
			multiEditButton.find('.button__warning').addClass('is-hidden');
		}

		//Only one file selected
		if (numberOfSelectedFiles === 1) {
			bulkEditButton.addClass('disabled').prop('disabled', true);
			multiEditButton.addClass('disabled').prop('disabled', true);
			//moreActionsButton.addClass('disabled').prop('disabled', true);

			selectedEditButton.removeClass('hidden');
			selectedDeleteButton.removeClass('hidden');
			selectedArrangement.removeClass('disabled');
			selectedArrangementInput.prop('disabled', false);
			selectedSetCoverButtons.prop('disabled', false).removeClass('is-disabled');
		}
		//All files are selected
		if (numberOfSelectedFiles === numberOfFiles) {
			selectAllButton.removeClass('empty').addClass('all');
			deselectAllButton.removeClass('is-empty').addClass('is-all');
		}
	}
}
function selectAll() {
	$('.js-content .file').addClass('selected');
	normalizeSelecteion();
}
function deselectAll() {
	$('.js-content .file.selected').removeClass('selected');
	normalizeSelecteion();
}

function normalizeAssetsCount() {
	if (galleryObjects.length) {
		$('#assets-count').text(galleryObjects.length + ' assets').removeClass('is-hidden');
	} else {
		$('#assets-count').text('').addClass('is-hidden');
	}
}

//Notifications
function showNotification(text, top) {
    var notification = $('.notification'),
        notificationText = $('.notification__text');

    if (notification.length === 0) {
        notification = $('<div></div>').addClass('notification');
        notificationText = $('<div></div>').addClass('notification__text');
        notification.append(notificationText);
    }

    if ($('.modal').length > 0) {
        if (!$('.modal .preview').hasClass('hidden')) {
            $('.modal .preview').append(notification);
        } else {
            $('.modal').append(notification);
        }

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

//File functions
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

    toggle.prop('checked', toggleChecked);
    closeTooltip();
}
function handleCaptionToggleClick(e) {
    e.stopPropagation();
    var file = $(e.target).parents('.file'),
        fileId = file.find('.file__id').text(),
        textarea = file.find('.file__caption-textarea'),
        originalFile = fileById(fileId, galleryObjects);

    if ($(e.target).prop('checked')) {
        textarea.val(originalFile.fileData.caption);
    } else {
        textarea.focus();
    }
}
function handleCaptionStartEditing(e) {
    e.stopPropagation();
    var tooltipText = 'This caption will only apply to your gallery and not to the image asset.';
    if (!window.localStorage.getItem('tooltip')) {
        createTooltip($(e.target), tooltipText);
    }
}
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
function loadFile(file) {
	var fileData = file.fileData;

	switch (fileData.type) {
		case 'image':

		//Hide video related elements
		$('#videoPlay').addClass('hidden');
		$('#videoMetadata').addClass('hidden');

		//Show all image related elements
		$('#previewControls').removeClass('hidden');
		$('#imageMetadata').removeClass('hidden');
		$('#focalPoint').removeClass('hidden');

		if (!file.bulkEdit) {
			$('#previewImg').attr('src', fileData.url);
			$('.pr .purpose-img').css("background-image", 'url(' + fileData.url + ')');
			adjustFocalPoint(fileData.focalPoint);
		}

		//set Title
		adjustTitle(fileData.title);
		adjustCaption(fileData.caption);
		adjustDescription(fileData.description);
		adjustResolution(fileData.highResolution);
		adjustAltText(fileData.altText);

		break;

		case 'video':

		//Hide all image related elements
		$('#previewControls').addClass('hidden');
		$('#imageMetadata').addClass('hidden');
		$('#focalPoint').addClass('hidden');

		//Show video related elements
		$('#videoPlay').removeClass('hidden');
		$('#videoMetadata').removeClass('hidden');

		if (file.bulkEdit) {
			$('#fielEdit-videoMetadata').addClass('hidden');
		} else {
			$('#fielEdit-videoMetadata').removeClass('hidden');

			$('#previewImg').attr('src', fileData.url);
			$('#videoTitle').text(fileData.title);
			$('#videoDescription').text(fileData.description);
			$('#videoAuthor').text(fileData.author);
			$('#videoGuid').text(fileData.guid);
			$('#videoKeywords').text(fileData.keywords);
		}

		break;
	}
}

//Function to set Title to the title field or, save title if title argument empty
function adjustTitle(title) {
	$('#title').val(title).change();
	var event = new UIEvent('change');
	document.getElementById('title').dispatchEvent(event);
}
//Function to set Title to the title field or, save title if title argument empty
function saveTitle(e) {
	var currentImage = $('.image.image_style_multi .file__id[data-id="' + editedFileData.fileData.id + '"]').parents('.image');

	editedFileData.fileData.title = $('#title').val();

	if ($('#title').val() === '') {
		currentImage.addClass('has-emptyRequiredField');
	} else {
		currentImage.removeClass('has-emptyRequiredField');
	}

	dataChanged = true;
	if (editedFileData.bulkEdit) {
		editedFilesData.forEach(function(f) {
			f.fileData.title = $('#title').val();
		});
	}
}
//Function to set Caption to the caption field or, save caption if caption argument empty
function adjustCaption(caption) {
	$('#caption').val(caption).change();
	var event = new UIEvent('change');
	document.getElementById('caption').dispatchEvent(event);
}
//Function to set Description to the caption field or, save caption if caption argument empty
function saveCaption() {
	editedFileData.fileData.caption = $('#caption').val();
	dataChanged = true;
	if (editedFileData.bulkEdit) {
		editedFilesData.forEach(function(f) {
			f.fileData.caption = $('#caption').val();
		});
	}
}
function adjustDescription(description) {
	$('#description').val(description).change();
	var event = new UIEvent('change');
	document.getElementById('description').dispatchEvent(event);
}
//Function to set Description to the caption field or, save caption if caption argument empty
function saveDescription() {
	editedFileData.fileData.description = $('#description').val();
	dataChanged = true;
	if (editedFileData.bulkEdit) {
		editedFilesData.forEach(function(f) {
			f.fileData.description = $('#description').val();
		});
	}
}
function adjustResolution(resolution) {
	$('#resolution').prop('checked', resolution);
}
//Function to set Description to the caption field or, save caption if caption argument empty
function saveResolution() {
	editedFileData.fileData.highResolution = $('#resolution').prop('checked');
	dataChanged = true;
	if (editedFileData.bulkEdit) {
		editedFilesData.forEach(function(f) {
			f.fileData.highResolution = $('#resolution').prop('checked');
		});
	}
}
function adjustAltText(altText) {
	$('#altText').val(altText).change();
	var event = new UIEvent('change');
	document.getElementById('altText').dispatchEvent(event);
}
//Function to set Description to the caption field or, save caption if caption argument empty
function saveAltText() {
	editedFileData.fileData.altText = $('#altText').val();
	dataChanged = true;
	if (editedFileData.bulkEdit) {
		editedFilesData.forEach(function(f) {
			f.fileData.altText = $('#altText').val();
		});
	}
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
	scrollPosition = $('body').scrollTop();
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
	$('#title').parent().removeClass('hidden');
	$('#title').parent().children('label').addClass('requiered');
	$('#title').prop('required', true);

	function resizeImageWrapper() {
		var imagesWrapperWidth = $('.images__wrapper').width();
		imagesWidth = window.innerWidth < 600 ? $('.images__container .image').length * 100 : $('.images__container .image').length * 120;
		if (imagesWrapperWidth > imagesWidth) {
			$('.images__scroll-left, .images__scroll-right').css('visibility', 'hidden');
		} else {
			$('.images__container').css('width', imagesWidth.toString() + 'px');
			$('.images__scroll-left, .images__scroll-right').css('visibility', 'visible');
		}
	}

	if (files.length > 1) {
		var imgContainer = $('.pr .images__container');
		imgContainer.empty();

		//Add images previes to the container
		files.forEach(function(f) {
			var	image = $('<div></div>').addClass('image image_style_multi').click(handleImageSwitch),
			requiredMark = $('<div></div>').addClass('image__required-mark'),
			fileIndex = $('<div></div>').addClass('hidden file__id').text(f.fileData.id).attr('data-id', f.fileData.id);
			image.css('background-image', 'url(' + f.fileData.url + ')').append(requiredMark, fileIndex);
			imgContainer.append(image);
		});

		//Add active state to the preview of the first image
		var firstImage = $('.images__container .image').first();
		firstImage.addClass('is-active');

		$('.pr .images').addClass('images_style_multi').removeClass('hidden images_style_bulk');

		$('.pr .preview').removeClass('hidden').addClass('preview_style_multi');
		$('.pr .ip').addClass('ip_style_multi');

		//Adjust image previews container
		$('#images__wrapper').scrollLeft(0);
		$(window).resize(resizeImageWrapper);
		resizeImageWrapper();

		//Add actions to scroll buttons
		$('.images__scroll-left').unbind('click').click(function(e) {
			e.stopPropagation();
			$('#images__wrapper').animate( { scrollLeft: '-=480' }, 600);
		});
		$('.images__scroll-right').unbind('click').click(function(e) {
			e.stopPropagation();
			$('#images__wrapper').animate( { scrollLeft: '+=480' }, 600);
		});
	}
	hideLoader();
	setModalKeyboardActions(saveImageEdit, cancelImageEdit);

}
function editFiles(files) {
	editedFilesData = [].concat(files);

	if (editedFilesData.length > 0) {
		editedFileData = editedFilesData[0];
		loadFile(editedFileData);
		showFiles(editedFilesData);
	}
}


//Bulk Edit
function bulkEditFiles(files, type) {
	var clonedGalleryObjects = JSON.parse(JSON.stringify(galleryObjects));
	var filesType;
	editedFilesData = []; //Clear files data that possibly could be here

	//Obtain files data for files that should be edited
	files.each(function(i, el) {
		var file = clonedGalleryObjects.filter(function(f) {
			return f.fileData.id === $(el).find('.file__id').text();
		})[0];
		editedFilesData.push(file);
	});

	if (editedFilesData.length > 0) {
		switch (editedFilesData[0].fileData.type) {
			case 'image':
			editedFileData = {
				fileData: {
					url: '',
					focalPoint: {
						left: 0.5,
						top: 0.5
					},
					id: '',
					color: '',//fileImgColors[Math.floor(Math.random()*fileImgColors.length)],
					title: '',
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
					},
					type: 'image'
				},
				bulkEdit: true
			};
			break;

			case 'video':
			editedFileData = {
				fileData: {
					url: '',
					player: '',
					type: 'video'
				},
				bulkEdit: true
			};
			break;

		}

		loadFile(editedFileData);
		showBulkFiles(editedFilesData);

	}
}
function showBulkFiles(files) {
	dataChanged = false;
	scrollPosition = $('body').scrollTop();
	//Show initial edit screen for single image.
	$('.pr').removeClass('hidden video')
	.addClass('modal bulk');
	$('#wrapper').addClass('overflow');

	//Remove all multiple images style attributes
	$('.pr .preview').removeClass('preview_style_multi hidden');
	$('.pr .ip').removeClass('ip_style_multi');
	$('#saveChanges').text('Save');
	$('#title').parent().addClass('hidden');
	$('#title').removeProp('required');
	$('#title').parent().children('label').removeClass('requiered');

	var imgContainer = $('.pr .images__container');
	imgContainer.empty();

	//Add images previes to the container
	files.forEach(function(f) {
		var	image = $('<div></div>').addClass('image image_style_bulk'),
		fileIndex = $('<div></div>').addClass('hidden file__id').text(f.fileData.id);
		image.css('background-image', 'url(' + f.fileData.url + ')').append(fileIndex);
		imgContainer.append(image);
	});

	$('.pr .images').addClass('images_style_bulk').removeClass('hidden images_style_multi');
	$('.pr .preview').addClass('hidden');

	hideLoader();
	setModalKeyboardActions(saveImageEdit, cancelImageEdit);
}

function handleBulkEditButtonClick(e) {
	$(e.target).blur();
	var files = $('.js-content .files .file.selected'),
	numberOfSelectedImages = $('.js-content .files .file.js-imgFileType.selected').length,
	numberOfSelectedVideos = $('.js-content .files .file.js-videoFileType.selected').length;

	if (numberOfSelectedImages && numberOfSelectedVideos) {
		new Modal({
			title: 'You can\'t bulk edit images and videos',
			text: 'You can\'t bulk edit images and videos at once. Please select files of the same type and try again.',
			confirmText: 'Ok',
			onlyConfirm: true
		});
	}
	else {
		if (numberOfSelectedVideos) {
			bulkEditFiles(files, 'videos');
		} else if(numberOfSelectedImages) {
			bulkEditFiles(files, 'images');
		}
	}
}

//Help function
function fileById(id, files) {
	filesFiltered = files.filter(function(f) {
		return f.fileData.id === id;
	});
	return filesFiltered[0];
}

//Save file
function saveFile(files, file) {
	files.forEach(function(f) {
		if (f.fileData.id === file.fileData.id) {
			f = file;
		}
	});
}

function switchImage(image) {
	$('.img-wrapper').removeClass('is-slidingLeft is-slidingRight');
	var newFileId = image.find('.file__id').text(),
	newFile = fileById(newFileId, editedFilesData),
	newIndex = image.index(),
	currentImage = $('.image.is-active'),
	currentIndex = currentImage.index(),
	currentFile = fileById(currentImage.find('.file__id').text(), editedFilesData),
	backImage = $('#previewImgBack'),
	previewImage = $('#previewImg');

	saveFile(editedFilesData, editedFileData);
	editedFileData = newFile;
	loadFile(editedFileData);

	/*backImage.addClass('is-visible')
	.attr('src', currentFile.fileData.url)
	.css('width', previewImage.width())
	.css('height', previewImage.height())
	.css('left', previewImage.offset().left)
	.css('top', previewImage.offset().top);

	*/

	currentImage.removeClass('is-active');
	image.addClass('is-active');

	if (currentIndex > newIndex) {
		$('.img-wrapper').addClass('is-slidingLeft');
	} else {
		$('.img-wrapper').addClass('is-slidingRight');
	}

	var imageContainer = image.parents('.images__container'),
	imageWrapper = image.parents('.images__wrapper'),
	imageLeftEnd = imageContainer.position().left + image.position().left,
	imageRightEnd = imageContainer.position().left + image.position().left + image.width();

	if (imageLeftEnd < 0) {
		$('#images__wrapper').animate( { scrollLeft: image.position().left - 30}, 400);
	} else if (imageRightEnd > imageWrapper.width()) {
		$('#images__wrapper').animate( { scrollLeft: image.position().left + image.width() - imageWrapper.width() + 50}, 400);
	}

	//adjustRect($('.purposes-container .purpose-img').first());
	//$('#purposeWrapper').animate( { scrollLeft: '0' }, 800);
}
function handleImageSwitch(e) {
	switchImage($(e.target));
}

//Function for handle Edit Button clicks
function handleFiledEditButtonClick(e) {
	e.stopPropagation();
	var fileElement = $(e.target).parents('.file');

	var file = galleryObjects.filter(function(f) {
		return f.fileData.id === $(fileElement).find('.file__id').text();
	});

	editFiles(file);
}
function handleMultiEditButtonClick(e) {
	$(e.target).blur();
	var filesElements = $('.js-content .files .file.selected'),
	clonedGalleryObjects = JSON.parse(JSON.stringify(galleryObjects)),
	files = [],
	numberOfSelectedImages = $('.js-content .files .file.js-imgFileType.selected').length,
	numberOfSelectedVideos = $('.js-content .files .file.js-videoFileType.selected').length;

	if (numberOfSelectedImages && numberOfSelectedVideos) {
		new Modal({
			title: 'You can\'t multi edit images and videos',
			text: 'You can\'t multi edit images and videos at once. Please select files of the same type and try again.',
			confirmText: 'Ok',
			onlyConfirm: true
		});
	}
	else {
		//Obtain files data for files that should be edited
		filesElements.each(function(i, el) {
			var file = [].concat(clonedGalleryObjects.filter(function(f) {
				return f.fileData.id === $(el).find('.file__id').text();
			}))[0];
			files.push(file);
		});

		editFiles(files);
	}
}


function cancelImageEdit() {
	if (dataChanged) {
		new Modal({
			dialog: true,
			title: 'Cancel Changes?',
			text: 'Any unsaved changes you made will be lost. Are you sure you want to cancel?',
			confirmText: 'Cancel',
			confirmAction: function() {
				closeEditScreen();
				document.removeEventListener('keydown', handleEscKeydown);
				document.removeEventListener('keydown', handleEnterKeydown);
			},
			cancelAction: setModalKeyboardActions(saveImageEdit, cancelImageEdit)
		});
	} else {
		closeEditScreen();
		document.removeEventListener('keydown', handleEscKeydown);
		document.removeEventListener('keydown', handleEnterKeydown);
	}
}
function saveImageEdit() {
	var emptyRequiredField = false,
	emptyImage;
	var emptyFields = checkFields('.pr label.requiered');
	if (emptyFields || editedFileData.fileData.type === 'video') {
		editedFilesData.forEach(function(fd) {
			if (fd.fileData.title === '' && !emptyRequiredField) {
				emptyRequiredField = true;
				emptyImage = $('.image.image_style_multi .file__id[data-id="' + fd.fileData.id + '"]').parents('.image');
			}
		});

		if (emptyRequiredField) {
			switchImage(emptyImage);
			$('.js-required').not('.js-hasValue').first().addClass('input_state_err is-blinking').focus();
			window.addEventListener('animationend', function(e) {
				if (e.animationName === 'textfield-focus-blink') {$(e.target).parent().find('.is-blinking').removeClass('is-blinking');}
			});

		} else {
			var clonedEditedFiles = JSON.parse(JSON.stringify(editedFilesData));
			clonedEditedFiles.forEach(function(fd) {
				var file = galleryObjects.filter(function(f) {
					return f.fileData.id === fd.fileData.id;
				})[0];
				var fileIndex = galleryObjects.indexOf(file);

				galleryObjects = galleryObjects.slice(0, fileIndex).concat([fd]).concat(galleryObjects.slice(fileIndex + 1));

				/*galleryObjects.forEach(function(f) {
				if (f.fileData.id === fd.fileData.id) {
				f = fd;
				f.selected = false;
			}
		});*/
	});
	showNotification('The change in the metadata is saved to the asset.');
	document.removeEventListener('keydown', handleEscKeydown);
	document.removeEventListener('keydown', handleEnterKeydown);
	window.setTimeout(function() {closeEditScreen();}, 2000);
	console.log(galleryObjects);
	deselectAll();
	updateGallery();
}

}
}
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


function deleteFile(file, files) {
	files = files.splice(files.indexOf(file), 1);
}
function deleteFileById(id, files) {
	var file = fileById(id, files);
	deleteFile(file, files);
}

function handleDeleteClick(e) {
	var itemName = $('.menu .is-active').text().toLowerCase();
	new Modal({
        title: 'Remove Asset?',
        text: 'Selected asset will be removed from this ' + itemName + '. Don’t worry, it won’t be removed from the Asset Library.',
        confirmText: 'Remove',
        confirmAction: function() {
            var fileId = $(e.target).parents('.file').find('.file__id').text();
            deleteFileById(fileId, galleryObjects);
            updateGallery();
        }
    });
}

$('.file-title').click(editFileTitle);
$('.file-caption').click(editFileCaption);

//File upload
function handleFiles(files) {
	var filesOutput = [];
	if (files && files.length >0) {
		for (var i=0; i< files.length; i++) {
			filesOutput.push(files[i]);
		}
		//showLoader();
		var uploadedFiles = filesOutput.map(function(f) {
			return fileToObject(f).then(function(res) {
				galleryObjects.push({
					fileData: res,
					selected: false,
					position: 1000,
					caption: '',
					galleryCaption: false,
					justUploaded: true,
					loading: true
				});
			});
		});
		Promise.all(uploadedFiles).then(function(res) {updateGallery(galleryObjects.length);});
	}
}

//Convert uploaded files to elements
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
			dateCreated: new Date(),
	        color: '',//fileImgColors[Math.floor(Math.random()*fileImgColors.length)],
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
	        },
			type: 'image'
	    };
	});
}

//Read file and return promise
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

//Loaders
function showLoader() {
	var modal = $('<div></div>').addClass('modal').attr('id', 'loaderModal'),
		loader = $('<div></div>').addClass('loader');

	modal.append(loader);
	$('body').append(modal);
}
function hideLoader() {
	$('#loaderModal').remove();
}

//Drag and drop files
function handleDragEnter(e) {
	e.stopPropagation();
    e.preventDefault();
	e.dataTransfer.dropEffect = "copy";
	$('#dropZone').addClass('modal').removeClass('hidden');
	document.getElementById("dropZone").addEventListener('dragleave', handleDragLeave, true);
}
function handleDragLeave(e) {
	e.preventDefault();
	e.stopPropagation();
	$("#dropZone").removeClass('modal').addClass('hidden');
	document.getElementById("wrapper").classList.remove('locked');
}
function handleDrop(e) {
	e.stopPropagation();
    e.preventDefault();
	$("#dropZone").removeClass('modal').addClass('hidden');
	var files = e.dataTransfer.files;
	if (files.length > 0) {
		handleFiles(files);
	}
}
function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
}

//Upload file from "Upload File" Button
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
               handleFiles(e.target.files);
            });
        document.body.appendChild(filesInput);
    }
    filesInput.click();
}

//Tooltip
function createTooltip(target, text) {
    var tooltip = $('<div></div>').addClass('tooltip'),
        tooltipText = $('<div></div>').addClass('tooltip__text').text(text),
        tooltipToggle = $('<div></div>').addClass('tooltip__toggle'),
        tooltipToggle_Toggle = $('<input type="checkbox" id="neverShowTooltip" />'),//.on('change', neverShowTooltip),
        tooltipToggle_Label = $('<label for="neverShowTooltip">Got it, don\'t show me this again</label>');

    tooltipToggle.append(tooltipToggle_Toggle, tooltipToggle_Label);
    tooltipToggle.bind('focus click change', neverShowTooltip);
    tooltip.append(tooltipText, tooltipToggle);
    $('.file__caption-textarea').removeAttr('id');
    $(target).parent().append(tooltip);
    target.attr('id', 'active-caption-textarea');

    tooltip.width(target.width());
    if ($('body').width() - target.offset().left - target.width() - target.width() - 20 > 0 ) {
        tooltip.css('left', target.position().left + target.width() + 10);
    } else {
        tooltip.css('left', target.position().left - target.width() - 10);
    }
    //var notInclude = tooltip.add(tooltipText).add(tooltipToggle).add(tooltipToggle_Label).add(tooltipToggle_Toggle).add(target);
    console.log($('#active-caption-textarea'));
    $('.ct, .menu').on(closeTooltip).find('#active-caption-textarea, .tooltip, .tooltip input, .tooltip label').on('click', function(e) {e.stopPropagation();});
}

function neverShowTooltip(e) {
    e.stopPropagation();
    window.localStorage.setItem('tooltip', true);
    closeTooltip();
}

function closeTooltip(e) {
    if (e) {e.stopPropagation();}

    console.log('closetooltip', e);
    $('.ct, .menu').unbind('click', closeTooltip);
    var tooltips = $('.tooltip');
    window.setTimeout(function() {
        tooltips.remove();
    }, 300);
}

//Modal Prompts and Windows
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
  $('body').scrollTop(scrollPosition);
}

function showModalPrompt(options) {
  var modalClass = options.dialog ? 'modal modal--prompt modal--dialog' : 'modal modal--prompt',
  secButtonClass = options.dialog ? 'button button_style_outline-gray' : 'button button_style_outline-white',
  close = $('<div></div>').addClass('modal__close').click(options.cancelAction),
  modal = $('<div></div>').addClass(modalClass),
  title = options.title ? $('<div></div>').addClass('modal__title').text(options.title) : null,
  text = options.text ? $('<div></div>').addClass('modal__text').text(options.text) : null,
  controls = options.confirmAction || options.cancelAction ? $('<div></div>').addClass('modal__controls') : null,
  confirmButton = options.confirmAction ? $('<button></button>').addClass('button  button_style_outline-accent').text(options.confirmText || 'Ok').click(options.confirmAction) : null,
  cancelButton = options.cancelAction ? $('<button></button>').addClass(secButtonClass).text(options.cancelText || 'Nevermind').click(options.cancelAction) : null;

  controls.append(confirmButton, cancelButton);
  modal.append(close, title, text, controls);
  $('body').append(modal);
  setModalKeyboardActions(options.confirmAction, options.cancelAction);
}

function hideModalPrompt() {
  $('.op.modal, .op.dialog, .modal.modal--prompt').remove();
  $(document).unbind('keydown');
}
function setModalKeyboardActions(enter, close) {
  handleEscKeydown = function(e) {
    e.stopPropagation();
    if (e.target === document.body && e.keyCode === 27) {close();}
  };
  handleEnterKeydown = function(e) {
    e.stopPropagation();
    if (e.target === document.body && e.keyCode === 13) {enter();}
  };

  document.addEventListener('keydown', handleEscKeydown);
  document.addEventListener('keydown', handleEnterKeydown);
}
function handleEscKeydown(e) {
  e.stopPropagation();
  //if (e.target === document.body && e.keyCode === 27) {close();}
}
function handleEnterKeydown(e) {
  e.stopPropagation();
  //if (e.target === document.body && e.keyCode === 13) {enter();}
}

function Modal(options) {
  this.options = options;

  this._init();
  this._initEvents();
}

Modal.prototype._init = function() {
  this.modal = $('<div></div>').addClass(this.options.dialog ? 'modal modal--prompt modal--dialog' : 'modal modal--prompt modal--full');

  this.closeButton = $('<div></div>').addClass('modal__close');
  this.title = this.options.title ? $('<div></div>').addClass('modal__title').text(this.options.title) : null;
  this.text = this.options.text ? $('<div></div>').addClass('modal__text').text(this.options.text) : null;

  this.controls = $('<div></div>').addClass('modal__controls');
  if (!this.options.onlyCancel) {
    this.confirmButton = $('<button />').addClass('button button_style_outline-accent').text(this.options.confirmText || 'Ok');
    this.controls.append(this.confirmButton);
  }
  if (!this.options.onlyConfirm) {
    this.cancelButton = $('<button />').addClass(this.options.dialog ? 'button button_style_outline-gray' : 'button button_style_outline-white').text(this.options.cancelText || 'Nevermind');
    this.controls.append(this.cancelButton);
  }

  this.modal.append(this.closeButton, this.title, this.text, this.controls);
  $('body').append(this.modal);
};

Modal.prototype._initEvents = function() {
  var self = this;
  document.removeEventListener('keydown', handleEscKeydown);
  document.removeEventListener('keydown', handleEnterKeydown);

  function handleConfirmation() {
    if (self.options.confirmAction) {self.options.confirmAction();}
    self.modal.remove();
    document.removeEventListener('keydown', self.handleKeyDown, true);
  }
  function handleCancelation() {
    if (self.options.cancelAction) {self.options.cancelAction();}
    self.modal.remove();
    document.removeEventListener('keydown', self.handleKeyDown, true);
  }

  self.handleKeyDown = function(e) {
    e.stopPropagation();
    if (!self.options.onlyCancel) {
      if (e.keyCode === 13) {handleCancelation();}
    }
    if (e.keyCode === 13) {handleConfirmation();}
    if (e.keyCode === 27) {handleCancelation();}
  };

  if (self.cancelButton) {self.cancelButton.click(handleCancelation);}
  if (self.confirmButton) {self.confirmButton.click(handleConfirmation);}
  self.closeButton.click(handleCancelation);
  document.addEventListener('keydown', self.handleKeyDown, true);
};

//Asset library
var assetLibraryObjects = [
  {
    url: 'img/real/slasher-image-2.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'slasher-image-2.jpg 48392 342',
    dateCreated: new Date(2015, 9, 18),
    color: '#B0DEDA',
    title: 'slasher-image-2.jpg',
    caption: '05. Don\'t Get Lost',
    description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett, a young woman who returns to the small town where she was born, only to find herself the centerpiece in a series of horrifying copycat murders based on the widely known, grisly killings of her parents.',
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
    },
    type: 'image'
  },
  {
    url: 'img/real/slasher-image-3.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'slasher-image-3.jpg 48392 342',
    dateCreated: new Date(2015, 9, 18),
    color: '#B0DEDA',
    title: 'slasher-image-3.jpg',
    caption: '02. The Man in the Shadows',
    description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett, a young woman who returns to the small town where she was born, only to find herself the centerpiece in a series of horrifying copycat murders based on the widely known, grisly killings of her parents.',
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
    },
    type: 'image'
  },
  {
    url: 'img/real/slasher-image-4.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'slasher-image-4.jpg 48392 342',
    dateCreated: new Date(2015, 9, 18),
    color: '#B0DEDA',
    title: 'slasher-image-4.jpg',
    caption: '03. The First Slice',
    description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett, a young woman who returns to the small town where she was born, only to find herself the centerpiece in a series of horrifying copycat murders based on the widely known, grisly killings of her parents.',
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
    },
    type: 'image'
  },
  {
    url: 'img/real/slasher-episode-5.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'slasher-episode-5.jpg 48392 342',
    dateCreated: new Date(2015, 9, 18),
    color: '#B0DEDA',
    title: 'slasher-episode-5.jpg',
    caption: '01. A New Visitor',
    description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett, a young woman who returns to the small town where she was born, only to find herself the centerpiece in a series of horrifying copycat murders based on the widely known, grisly killings of her parents.',
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
    },
    type: 'image'
  },
  {
    url: 'img/real/slasher-image-5.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'slasher-image-5.jpg 48392 342',
    dateCreated: new Date(2015, 9, 18),
    color: '#B0DEDA',
    title: 'slasher-image-5.jpg',
    caption: '04. The Blood Moon',
    description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett, a young woman who returns to the small town where she was born, only to find herself the centerpiece in a series of horrifying copycat murders based on the widely known, grisly killings of her parents.',
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
    },
    type: 'image'
  },
  {
    url: 'img/real/slasher-image-10.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'slasher-image-10.jpg 48392 342',
    dateCreated: new Date(2015, 9, 18),
    color: '#B0DEDA',
    title: 'slasher-image-10.jpg',
    caption: '03. The First Slice',
    description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett, a young woman who returns to the small town where she was born, only to find herself the centerpiece in a series of horrifying copycat murders based on the widely known, grisly killings of her parents.',
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
    },
    type: 'image'
  },
  {
    url: 'img/real/slasher-image-13.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'slasher-image-13.jpg 48392 342',
    dateCreated: new Date(2015, 9, 18),
    color: '#B0DEDA',
    title: 'slasher-image-13.jpg',
    caption: '01. A New Visitor',
    description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett, a young woman who returns to the small town where she was born, only to find herself the centerpiece in a series of horrifying copycat murders based on the widely known, grisly killings of her parents.',
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
    },
    type: 'image'
  },
  {
    url: 'img/real/slasher-image-15.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'slasher-image-15.jpg 48392 342',
    dateCreated: new Date(2015, 9, 18),
    color: '#B0DEDA',
    title: 'slasher-image-15.jpg',
    caption: '01. A New Visitor',
    description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett, a young woman who returns to the small town where she was born, only to find herself the centerpiece in a series of horrifying copycat murders based on the widely known, grisly killings of her parents.',
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
    },
    type: 'image'
  },
  {
    url: 'img/real/slasher-image-11.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'slasher-image-11.jpg 48392 342',
    dateCreated: new Date(2015, 9, 18),
    color: '#B0DEDA',
    title: 'slasher-image-11.jpg',
    caption: '06. All Alone',
    description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett, a young woman who returns to the small town where she was born, only to find herself the centerpiece in a series of horrifying copycat murders based on the widely known, grisly killings of her parents.',
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
    },
    type: 'image'
  },
  {
    url: 'img/real/slasher-image-9.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'slasher-image-9.jpg 48392 342',
    dateCreated: new Date(2015, 9, 18),
    color: '#B0DEDA',
    title: 'slasher-image-9.jpg',
    caption: '04. The Blood Moon',
    description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett, a young woman who returns to the small town where she was born, only to find herself the centerpiece in a series of horrifying copycat murders based on the widely known, grisly killings of her parents.',
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
    },
    type: 'image'
  },
  {
    url: 'img/real/slasher-image-8.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'slasher-image-8.jpg 48392 342',
    dateCreated: new Date(2015, 9, 18),
    color: '#B0DEDA',
    title: 'slasher-image-8.jpg',
    caption: '04. The Blood Moon',
    description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett, a young woman who returns to the small town where she was born, only to find herself the centerpiece in a series of horrifying copycat murders based on the widely known, grisly killings of her parents.',
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
    },
    type: 'image'
  },
  {
    url: 'img/real/slasher-image-6.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'slasher-image-6.jpg 48392 342',
    dateCreated: new Date(2015, 9, 18),
    color: '#B0DEDA',
    title: 'slasher-image-6.jpg',
    caption: '06. All Alone',
    description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett, a young woman who returns to the small town where she was born, only to find herself the centerpiece in a series of horrifying copycat murders based on the widely known, grisly killings of her parents.',
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
    },
    type: 'image'
  },
  {
    url: 'img/real/Haven_gallery_518FunFacts_01.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'aztec_temple.png 48392 342',
    dateCreated: new Date(2015, 9, 18),
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
    },
    type: 'image'
  },
  {
    url: 'img/real/Haven_gallery_518FunFacts_02.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'big_ben.png 43defqwe',
    dateCreated: new Date(2015, 9, 18),
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
    },
    type: 'image'
  },
  {
    url: 'img/real/Haven_gallery_518FunFacts_03.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'christ_the_redeemer.png 092nlxnc',
    dateCreated: new Date(2015, 9, 18),
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
    },
    type: 'image'
  },
  {
    url: 'img/real/Haven_gallery_518FunFacts_04.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'colosseum.png -4rjxnsk',
    dateCreated: new Date(2015, 9, 18),
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
    },
    type: 'image'
  },
  {
    url: 'img/real/Haven_gallery_518FunFacts_05.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'easter_island.png nln4nka0',
    dateCreated: new Date(2015, 10, 25),
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
    },
    type: 'image'
  },
  {
    url: 'img/real/Haven_gallery_518FunFacts_06.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'pyramids.png fdby64',
    dateCreated: new Date(2015, 10, 25),
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
    },
    type: 'image'
  },

  {
    url: 'img/real/Haven_gallery_518Recap_01.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'san_franciso_bridge.png 4234ff52',
    dateCreated: new Date(2015, 10, 25),
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
    },
    type: 'image'
  },
  {
    url: 'img/real/Haven_gallery_518Recap_02.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'stone_henge.png 490mnmabd',
    dateCreated: new Date(2015, 10, 25),
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
    },
    type: 'image'
  },
  {
    url: 'img/real/Haven_gallery_518Recap_03.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'sydney_opera_house.png 0sed67h',
    dateCreated: new Date(2015, 10, 25),
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
    },
    type: 'image'
  },
  {
    url: 'img/real/Haven_gallery_518Recap_04.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'taj_mahal.png 943nbka',
    dateCreated: new Date(2015, 10, 25),
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
    },
    type: 'image'
  },
  {
    url: 'img/real/Haven_gallery_518Recap_05.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'windmill.png jerl34',
    dateCreated: new Date(2015, 11, 11),
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
    },
    type: 'image'
  },
  {
    url: 'img/real/Haven_gallery_518Recap_06.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'tree_1.png',
    dateCreated: new Date(2015, 11, 14),
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
    },
    type: 'image'
  },
  {
    url: 'img/real/Haven_gallery_518Recap_07.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'tree_2.png',
    dateCreated: new Date(2015, 11, 14),
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
    },
    type: 'image'
  },
  {
    url: 'img/real/Haven_gallery_518Recap_08.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'tree_3.png',
    dateCreated: new Date(2015, 11, 14),
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
    },
    type: 'image'
  },
  {
    url: 'img/real/Haven_gallery_518Recap_09.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'tree_4.png',
    dateCreated: new Date(2015, 11, 14),
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
    },
    type: 'image'
  },
  {
    url: 'img/real/Haven_gallery_518Recap_10.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'tree_5.png',
    dateCreated: new Date(2015, 11, 14),
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
    },
    type: 'image'
  },
  {
    url: 'img/real/s05_e0513_01_CC_1920x1080.jpg',
    id: 'video__123',
    dateCreated: new Date(2015, 11, 14),
    color: '#BFC9A2',
    title: 's05_e0513_01_CC_1920x1080',
    description: 'Now that Dr. Cross has revealed her true identity, everyone has lots of feelings. Dwight can\'t get over feeling like she duped him, Audrey thinks Dr. Cross must care more about Mara than she does about her and Nathan is happy that there is someone else in town who he can feel.',
    type: 'video',
    player: 'Brand VOD Player',
    episodeNumber: '10',
    keywords: 'The Expance, Salvage, Miller, Julie Mao, Holden, Trailer',

    addedByUserId: 3448723,
    author: 'Jason Long',
    expirationDate: '2015-03-23 10:57:04',
    guid: '0D660BD6-0968-4F72-7ABC-472157DFACAB',
    link: 'canonicalurl70fa62fc6b',
    linkUrl: 'http://prod.publisher7.com/file/7806'
  },
  {
    url: 'img/real/Bitten_gallery_204Recap_06.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'Bitten_gallery_204Recap_06.png',
    dateCreated: new Date(2016, 01, 14),
    color: '#BFC9A2',
    title: 'Bitten_gallery_204Recap_06.jpg',
    caption: 'Aleister continues his charming corruption of Savannah, telling her she\'s kept locked in her room to keep her safe from her new werewolf neighbor and encouraging her to use her left hand when wielding her abilities. Savannah\'s getting more powerful every day.',
    description: '',
    highResolution: true,
    categories: '',
    tags: '',
    altText: '',
    credit: '',
    copyright: '',
    reference: {
      series: 'Bitten',
      season: 5,
      episode: 18
    },
    type: 'image'
  }/*,
  {
  url: 'img/real/Bitten_gallery_204Recap_07.jpg',
  focalPoint: {
  left: 0.5,
  top: 0.5
},
id: 'Bitten_gallery_204Recap_07.png',
dateCreated: new Date(2016, 01, 14),
color: '#BFC9A2',
title: 'Bitten_gallery_204Recap_07.jpg',
caption: 'Meanwhile, Logan has infiltrated the compound and finds his beloved Rachel. He manages to free her ... but how far will they get?',
description: '',
highResolution: true,
categories: '',
tags: '',
altText: '',
credit: '',
copyright: '',
reference: {
series: 'Bitten',
season: 5,
episode: 18
},
type: 'image'
},
{
url: 'img/real/Bitten_gallery_204Recap_17.jpg',
focalPoint: {
left: 0.5,
top: 0.5
},
id: 'Bitten_gallery_204Recap_17.png',
dateCreated: new Date(2016, 01, 14),
color: '#BFC9A2',
title: 'Bitten_gallery_204Recap_17.jpg',
caption: 'Elena wakes up to find herself in a new cell ...',
description: '',
highResolution: true,
categories: '',
tags: '',
altText: '',
credit: '',
copyright: '',
reference: {
series: 'Bitten',
season: 5,
episode: 18
},
type: 'image'
},
{
url: 'img/real/Bitten_gallery_204Recap_18.jpg',
focalPoint: {
left: 0.5,
top: 0.5
},
id: 'Bitten_gallery_204Recap_18.png',
dateCreated: new Date(2016, 01, 14),
color: '#BFC9A2',
title: 'Bitten_gallery_204Recap_18.jpg',
caption: '... and Richard, the mutt she interrogated in Episode 1, in another. Richard is enraged that Elena gave him up to these "sadistic bastards" and all too willing to engage in Sondra\'s experiment to "observe combat": in theory, Elena will have to turn into a wolf to defend herself against Richard\'s attack.',
description: '',
highResolution: true,
categories: '',
tags: '',
altText: '',
credit: '',
copyright: '',
reference: {
series: 'Bitten',
season: 5,
episode: 18
},
type: 'image'
},
{
url: 'img/real/Bitten_gallery_204Recap_21.jpg',
focalPoint: {
left: 0.5,
top: 0.5
},
id: 'Bitten_gallery_204Recap_21.png',
dateCreated: new Date(2016, 01, 14),
color: '#BFC9A2',
title: 'Bitten_gallery_204Recap_21.jpg',
caption: 'On higher ground, Rachel and Logan are making a run for it, though the symbol on Rachel\'s neck starts to smoke ...',
description: '',
highResolution: true,
categories: '',
tags: '',
altText: '',
credit: '',
copyright: '',
reference: {
series: 'Bitten',
season: 5,
episode: 18
},
type: 'image'
},
{
url: 'img/real/Bitten_gallery_204Recap_22.jpg',
focalPoint: {
left: 0.5,
top: 0.5
},
id: 'Bitten_gallery_204Recap_22.png',
dateCreated: new Date(2016, 01, 14),
color: '#BFC9A2',
title: 'Bitten_gallery_204Recap_22.jpg',
caption: '... which also slows down Elena, after Richard-wolf suffers the same bloody fate as Nate Parker did in Episode 1. Rachel, Elena and Logan are re-captured.',
description: '',
highResolution: true,
categories: '',
tags: '',
altText: '',
credit: '',
copyright: '',
reference: {
series: 'Bitten',
season: 5,
episode: 18
},
type: 'image'
},
{
url: 'img/real/Bitten_gallery_204Recap_25.jpg',
focalPoint: {
left: 0.5,
top: 0.5
},
id: 'Bitten_gallery_204Recap_25.png',
dateCreated: new Date(2016, 01, 14),
color: '#BFC9A2',
title: 'Bitten_gallery_204Recap_25.jpg',
caption: 'Elena gives in, and a shocked Rachel learns a little something new about her old friend.',
description: '',
highResolution: true,
categories: '',
tags: '',
altText: '',
credit: '',
copyright: '',
reference: {
series: 'Bitten',
season: 5,
episode: 18
},
type: 'image'
},
{
url: 'img/real/Blindspot_07_NUP_170317_0308.jpg',
focalPoint: {
left: 0.5,
top: 0.5
},
id: 'Blindspot_07_NUP_170317_0308.png',
dateCreated: new Date(2016, 01, 16),
color: '#BFC9A2',
title: 'Blindspot_07_NUP_170317_0308.jpg',
caption: 'BLINDSPOT -- "Bone May Rot" Episode 104 -- Pictured: (l-r) Jaimie Alexander as Jane Doe, Sullivan Stapleton as Kurt Weller -- (Photo by: Christopher Saunders/NBC)',
description: '',
highResolution: true,
categories: '',
tags: '',
altText: '',
credit: '',
copyright: '',
reference: {
series: 'Blindspot',
season: 5,
episode: 18
},
type: 'image'
},
{
url: 'img/real/Blindspot_08_NUP_170503_0283.jpg',
focalPoint: {
left: 0.5,
top: 0.5
},
id: 'Blindspot_08_NUP_170503_0283.png',
dateCreated: new Date(2016, 01, 16),
color: '#BFC9A2',
title: 'Blindspot_08_NUP_170503_0283.jpg',
caption: 'BLINDSPOT -- "Bone May Rot" Episode 104 -- Pictured: Jaimie Alexander as Jane Doe -- (Photo by: Giovanni Rufino/NBC)',
description: '',
highResolution: true,
categories: '',
tags: '',
altText: '',
credit: '',
copyright: '',
reference: {
series: 'Blindspot',
season: 5,
episode: 18
},
type: 'image'
},
{
url: 'img/real/Blindspot_15_NUP_170503_0203.jpg',
focalPoint: {
left: 0.5,
top: 0.5
},
id: 'Blindspot_15_NUP_170503_0203.png',
dateCreated: new Date(2016, 01, 16),
color: '#BFC9A2',
title: 'Blindspot_15_NUP_170503_0203.jpg',
caption: 'BLINDSPOT -- "Bone May Rot" Episode 104 -- Pictured: Jaimie Alexander as Jane Doe -- (Photo by: Giovanni Rufino/NBC)',
description: '',
highResolution: true,
categories: '',
tags: '',
altText: '',
credit: '',
copyright: '',
reference: {
series: 'Blindspot',
season: 5,
episode: 18
},
type: 'image'
},
{
url: 'img/real/screen_shot_2015-10-09_at_5.20.14_pm.png',
focalPoint: {
left: 0.5,
top: 0.5
},
id: 'screen_shot_2015-10-09_at_5.20.14_pm.png',
dateCreated: new Date(2016, 01, 16),
color: '#BFC9A2',
title: 'screen_shot_2015-10-09_at_5.20.14_pm.png',
caption: '“Mondays got me like…” - @jimmyfallon',
description: '',
highResolution: true,
categories: '',
tags: '',
altText: '',
credit: '',
copyright: '',
reference: {
series: 'The Tonight Show',
season: 5,
episode: 18
},
type: 'image'
},
{
url: 'img/real/screen_shot_2015-10-09_at_5.19.19_pm.png',
focalPoint: {
left: 0.5,
top: 0.5
},
id: 'screen_shot_2015-10-09_at_5.19.19_pm.png',
dateCreated: new Date(2016, 01, 16),
color: '#BFC9A2',
title: 'screen_shot_2015-10-09_at_5.19.19_pm.png',
caption: '“Tonight I was the musical guest on The Tonight Show With Jimmy Fallon. My first time on the show I was 14 years old and never thought I\'d be back to perform my first single. Love you long time Jimmy! Thanks for having me. :) PS I met the legendary Lady Gaga and am so inspired by her words of wisdom. #HAIZonFALLON #LoveMyself” - @haileesteinfeld',
description: '',
highResolution: true,
categories: '',
tags: '',
altText: '',
credit: '',
copyright: '',
reference: {
series: 'The Tonight Show',
season: 5,
episode: 18
},
type: 'image'
},
{
url: 'img/real/screen_shot_2015-10-09_at_5.20.15_pm.png',
focalPoint: {
left: 0.5,
top: 0.5
},
id: 'screen_shot_2015-10-09_at_5.20.15_pm.png',
dateCreated: new Date(2016, 01, 16),
color: '#BFC9A2',
title: 'screen_shot_2015-10-09_at_5.20.15_pm.png',
caption: '“Mondays got me like…” - @jimmyfallon',
description: '',
highResolution: true,
categories: '',
tags: '',
altText: '',
credit: '',
copyright: '',
reference: {
series: 'The Tonight Show',
season: 5,
episode: 18
},
type: 'image'
}*/
];
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

//Required fields check
function checkField(field) {
    if ($(field).val() === '' && $(field).attr('display') !== 'none') {
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
        if (checkField(el)) {
            //markFieldAsNormal(el);
        } else {
            //markFieldAsRequired(el);
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
        //markFieldAsNormal(e.target);
    } else {
        //markFieldAsRequired(e.target);
    }
});


//Focal rectangle and point
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


//textfields
//;(function(window) {
//    'use strict';

function Textfield(el, options) {
  this.el = el;
  this.options = options;

  this._init();
  this._initEvents();
}

Textfield.prototype._init = function() {
  var self = this;
  this.el.placeholder = '';

  this.fieldWrapper = document.createElement('div');
  this.fieldWrapper.classList.add('input__wrapper');
  this.el.parentNode.insertBefore(this.fieldWrapper, this.el);
  this.fieldWrapper.appendChild(this.el);
  this.el.classList.remove('js-input');
  this.el.classList.add('input__field');

  if (this.el.value !== '') {
    this.el.classList.add('input_state_not-empty', 'js-hasValue');
    normalizeRequiredCount();
    this._toggleAddable();
  }

  if (this.el.type === 'textarea') {this._autosize();}
  if (this.options.autocomplete) {this.el.classList.add('has-autocomplete');}
  if (this.el.classList.contains('js-datepicker')) {
    var id = 'datePicker' + Math.round(Math.random()*10000);
    this.el.id = id;
    $(this.el).datepicker({
      onSelect: function() {
        $('#' + id).addClass('input_state_not-empty js-hasValue');
        self._toggleAddable();
      },
      changeMonth: true,
      changeYear: true
      /*monthNamesShort: [ "Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December" ]*/
    });
  }
  if (this.el.id === 'startDate') {
    $(this.el).datepicker({
      onSelect: function(dateString, datepicker) {
        $('#startDate').addClass('input_state_not-empty js-hasValue');
        startDate = dateString;
        self._toggleAddable();
      },
      changeMonth: true,
      changeYear: true
      /*monthNamesShort: [ "Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December" ]*/
    });
  }
  if (this.el.id === 'endDate') {
    $(this.el).datepicker({
      onSelect: function(dateString, datepicker) {
        $('#endDate').addClass('input_state_not-empty js-hasValue');
        self._toggleAddable();
      },
      beforeShow: function(element, datepicker) {
        $('#endDate').datepicker('option', 'defaultDate', startDate);
      },
      changeMonth: true,
      changeYear: true
      /*monthNamesShort: [ "Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December" ]*/
    });
  }

  if (this.options.label) {
    this.label = document.createElement('label');
    this.label.innerHTML = this.options.label;
    this.label.classList.add('input__label');
    this.label.for = this.el.id;
    this.fieldWrapper.appendChild(this.label);
  }

  this.blink = document.createElement('div'); //Use as a helper to make blink animation on focus field
  this.blink.classList.add('input__blink');
  this.fieldWrapper.appendChild(this.blink);

  if (this.options.helpText) {
    this.helpText = document.createElement('div');
    this.helpText.innerHTML = this.options.helpText;
    this.helpText.classList.add('input__help-text');
    this.fieldWrapper.appendChild(this.helpText);
  }
  if (this.options.errMsg) {
    this.errMsg = document.createElement('div');
    this.errMsg.innerHTML = this.options.errMsg;
    this.errMsg.classList.add('input__err-msg');
    this.fieldWrapper.appendChild(this.errMsg);
  }
};

Textfield.prototype._initEvents = function() {
  var self = this;
  //Check if field is empty or not and change class accordingly
  $(this.el).on('blur', function(e) {
    e.target.classList.remove('input_state_err');
    if (e.target.value !== '') {
      e.target.classList.add('input_state_not-empty', 'js-hasValue');
    } else {
      e.target.classList.remove('input_state_not-empty', 'js-hasValue');
    }
    e.target.placeholder = '';
    if (e.target.required && !e.target.value) {
      e.target.classList.add('input_state_err');
    }
    if (self.list) {
      window.setTimeout(function() {self.list.remove();}, 150);
    }
    self._toggleAddable();
    normalizeRequiredCount();
  });

  //On focus event
  $(this.el).on('focus', function(e) {
    if (self.options.placeholder) {
      e.target.placeholder = self.options.placeholder;
    }
    if (self.options.autocomplete) {
      self.list = renderAutocompleteList(self.options.autocomplete, handleAutocompleteItemClick);
      placeAutocompleteList(self.list, $(self.fieldWrapper));
    }
  });

  //On change event
  $(this.el).on('change', function(e) {
    e.target.classList.remove('input_state_err');
    if (e.target.value !== '') {
      e.target.classList.add('input_state_not-empty', 'js-hasValue');
    } else {
      e.target.classList.remove('input_state_not-empty', 'js-hasValue');
    }
    e.target.placeholder = '';
    if (self.options.onChange) {
      self.options.onChange(e);
    }
    self._toggleAddable();
    normalizeRequiredCount();
  });

  //On input event
  $(self.el).on('input', function(e) {
    e.target.classList.remove('input_state_err');
    if (e.target.value !== '') {
      e.target.classList.add('input_state_not-empty', 'js-hasValue');
    } else {
      e.target.classList.remove('input_state_not-empty', 'js-hasValue');
    }
    e.target.placeholder = '';
    if (self.options.onInput) {
      self.options.onInput(e);
    }
    if (self.options.autocomplete) {
      var data = self.options.autocomplete.filter(function(item) {
        return item.toLowerCase().includes(self.el.value.toLowerCase());
      })
      updateAutocompleteList(self.list, data, handleAutocompleteItemClick);
    }
    self._toggleAddable();
    normalizeRequiredCount();
  });
  $(self.el).on('keydown', handleKeyDown);

  function handleKeyDown(e) {
    e.stopPropagation();
    var index, length;
    switch (e.keyCode) {
      case 13:
      if (self.list && self.list.find('is-hightlighted').length > 0) {
        selectItem(self.list.find('is-hightlighted').get(0));
      } else {
        closeList();
      }
      break;

      case 27:
      closeList();
      break;

      case 38:
      if (self.list && self.list.find('is-hightlighted').length > 0) {

        index = $(self.list).find('.is-hightlighted').index();
        length = $(self.list).find('li').length;

        if (index > 0) {
          $(self.list).find('li').removeClass('is-hightlighted');
          $(self.list).find('li').eq(index - 1).addClass('is-hightlighted');

          if (index < length - 1) {
            if ($(self.list).find('li').eq(index + 1).position().top < 50) {
              $(self.list).animate({
                scrollTop: $(self.list).scrollTop() - $(self.list).height() > 0 ? $(self.list).scrollTop() - $(self.list).height() : 0
              }, 400);
            }
          }
          if (index === 1) {
            $(self.list).animate({
              scrollTop: 0
            }, 400);
          }
        }
      }
      break;

      case 40:
      if (self.list && self.list.find('is-hightlighted').length > 0) {
        index = $(self.list).find('.is-hightlighted').index();
        length = $(self.list).find('li').length;

        if (index < length - 1) {
          $(self.list).find('li').removeClass('is-hightlighted');
          $(self.list).find('li').eq(index + 1).addClass('is-hightlighted');

          if ($(self.list).height() < $(self.list).find('li').eq(index + 1).position().top + $(self.list).find('li').eq(index + 1).outerHeight()) {
            $(self.list).animate({
              scrollTop: $(self.list).scrollTop() + $(self.list).find('li').eq(index + 1).position().top +  $(self.list).find('li').eq(index + 1).outerHeight()
            }, 400);
          }
        }
        if (index === length) {
          $(self.list).animate({
            scrollTop: $(self.list).scrollTop() + $(self.list).find('li').eq(index).position().top + $(self.list).find('li').eq(index).height()
          }, 400);
        }
      }
      break;
    }
  }

  function renderAutocompleteList(data, callback) {
    var list = $('<ul />').addClass('autocomplete')

    data.forEach(function(item) {
      list.append(renderAutocompleteItem(item, callback));
    });
    return list;
  }
  function placeAutocompleteList(list, parent) {
    parent.append(list);

    var parentBCR = parent.get(0).getBoundingClientRect(),
    parentOffsetTop = parent.get(0).offsetTop,
    listBCR = list.get(0).getBoundingClientRect(),

    heightCheck = window.innerHeight - parentBCR.top - parentBCR.height - listBCR.height;

    list.get(0).style.top = heightCheck > 0 ? parentOffsetTop + parentBCR.height + 5 + 'px' : parentOffsetTop - listBCR.height - 10 + 'px';
  }
  function updateAutocompleteList (list, data, callback) {
    list.empty();
    data.forEach(function(item) {
      list.append(renderAutocompleteItem(item, callback));
    });
  }
  function renderAutocompleteItem(item, callback) {
    return $('<li />').addClass('autocomplete__item').click(callback).on('mouseover', handleItemMouseOver).text(item);
  }

  function handleAutocompleteItemClick(e) {
    selectItem(e.target);
  }
  function handleItemMouseOver(e) {
      $(self.list).find('li').removeClass('is-hightlighted');
      $(e.target).addClass('is-hightlighted');
  }
  function selectItem(item) {
    self.el.value = item.innerHTML;
    self.el.classList.add('input_state_not-empty', 'js-hasValue');
    closeAutocomplete();
  }
  function closeAutocomplete() {
    self.list.remove();
  }
};

//Autoresize textarea
Textfield.prototype._autosize = function() {
  if (this.el.value === '') {this.el.rows = 1;}
  else {
    var width = this.el.getBoundingClientRect().width,
    span = document.createElement('span'),
    textWidth = this.el.value.length * 7,
    re = /[\n\r]/ig;
    lineBrakes = this.el.value.match(re);
    row = Math.ceil(textWidth / width);

    row = row <= 0 ? 1 : row;
    row = this.options.maxHeight && row > this.options.maxHeight ? this.options.maxHeight : row;

    if (lineBrakes) {
      row += lineBrakes.length;
    }

    this.el.rows = row;
  }
};

Textfield.prototype._toggleAddable = function() {
  if ($(this.el).parents('.js-addableWrapper').length > 0) {
    console.log($(this.el).hasClass('js-hasValue'));
    if ($(this.el).hasClass('js-hasValue')) {
      $(this.el).parents('.js-addableWrapper').addClass('js-hasValue');
    } else {
      $(this.el).parents('.js-addableWrapper').removeClass('js-hasValue');
    }
  }
};

function initTextfields() {
  [].slice.call(document.querySelectorAll('.js-input')).forEach(function(el) {
    new Textfield(el, {
      label: el.dataset.label,
      helpText: el.dataset.helpText,
      errMsg: el.dataset.errMsg,
      placeholder: el.placeholder,
      mask: el.dataset.mask,
      maxHeight: el.dataset.maxHeight
    });
  });
}

initTextfields();

//selectbox
//;(function(window) {
    //'use strict';

    function Selectbox(el, options) {
        this.el = el;
        this.options = options;


        this._init();
        this._initEvents();
    }

    Selectbox.prototype._init = function() {
        this.activeItem = this.options.items.indexOf(this.options.selectedItem);
        this.options.unselect = this.options.unselect !== -1 ? '— None —' : this.options.unselect;

        this.selectWrapper = document.createElement('div');
        this.selectWrapper.classList.add('select__wrapper');
        this.el.parentNode.insertBefore(this.selectWrapper, this.el);
        this.selectWrapper.appendChild(this.el);
        this.el.classList.remove('js-selectbox');
        this.el.classList.add('selectbox__field');

        if (this.activeItem >= 0) {
            this.el.classList.add('selectbox_state_not-empty', 'js-hasValue');
            this.el.innerHTML = this.options.items[this.activeItem];
            this._toggleAddable();
        }

        if (this.options.label) {
            this.label = document.createElement('label');
            this.label.innerHTML = this.options.label;
            this.label.classList.add('selectbox__label');
            this.label.for = this.el.id;
            this.selectWrapper.appendChild(this.label);
        }
        if (this.options.helpText) {
            this.helpText = document.createElement('div');
            this.helpText.innerHTML = this.options.helpText;
            this.helpText.classList.add('selectbox__help-text');
            this.selectWrapper.appendChild(this.helpText);
        }
        if (this.options.errMsg) {
            this.errMsg = document.createElement('div');
            this.errMsg.innerHTML = this.options.errMsg;
            this.errMsg.classList.add('selectbox__err-msg');
            this.selectWrapper.appendChild(this.errMsg);
        }
    };

    Selectbox.prototype._initEvents = function() {
        var self = this;

        //Close list helper
        function closeList() {
            self.el.classList.remove('selectbox_state_open');
            if (self.list) {
                self.selectWrapper.removeChild(self.list);
                self.list = undefined;
            }
            if (self.searchField && self.searchField.parentNode === self.el) {
                self.el.removeChild(self.searchField);
            }
            if (self.inputField && self.inputField.parentNode === self.el) {
                self.el.removeChild(self.inputField);
            }
            if (self.activeItem < 0) {
                self.el.innerHTML = '';
            } else {
                self.el.innerHTML = self.options.items[self.activeItem];
            }
            document.removeEventListener('mousedown', handleSelectDocClick);
        }

        //Create list helper
        function createList(items, activeItem, searchText) {
            if (self.list) {
                self.list.parentNode.removeChild(self.list);
            }

            self.list = document.createElement('ul');
            self.list.classList.add('selectbox__list');

            function listItem(item, index) {
                var itemClass = self.options.complexItems ? 'selectbox__list-item selectbox__list-item--complex' : 'selectbox__list-item selectbox__list-item--text',
                    itemElement = $('<li></li>').addClass(itemClass).text(item),
                    listHelper = $('<div></div>')
                                    .addClass('selectbox__list-item')
                                    .css('position', 'absolute')
                                    .css('z-index', '-1')
                                    .css('opacity', 0)
                                    .css('pointer-events', 'none')
                                    .css('overflow', 'visible')
                                    .css('white-space', 'nowrap')
                                    .text(item);

                self.selectWrapper.appendChild(listHelper.get(0));

                if (index > -1) {
                    itemElement.attr('data-index', index);
                }

                if (self.options.complexItems) {
                    itemElement.get(0).innerHTML = item;
                }

                if (searchText && !self.options.complexItems) {
                    itemElement.get(0).innerHTML = listItemText(item, searchText, $(self.list).width() < listHelper.width());
                }

                itemElement.on('mousedown', handleItemClick);
                itemElement.on('mouseover', handleItemMouseOver);

                listHelper.remove();
                return itemElement;
            }
            function listItemText(itemString, text, long) {
                var outputString = itemString;
                if (long) {
                    var words = itemString.split(' '),
                        searchIndex = words.reduce(function(currentIndex, word, index) {
                            outputString = word.toLowerCase().indexOf(text) > -1 && currentIndex === -1 ? index : currentIndex;
                        }, -1);

                    if (searchIndex >= 3) {
                        var stringEnd = words.slice(searchIndex).reduce(function(str, word) {
                            return str + ' ' + word;
                        });
                        var reg = /\.$/;
                        if (words[0].match(reg)) {
                            outputString = words[0] + ' ' + words[1] + ' ... ' + stringEnd;
                        } else {
                            outputString = words[0] + ' ... ' + stringEnd;
                        }
                    }
                }

                var startTextIndex = outputString.toLowerCase().indexOf(text.toLowerCase()),
                    endTextIndex = startTextIndex + text.length,
                    start = outputString.slice(0, startTextIndex),
                    middle = outputString.slice(startTextIndex, endTextIndex),
                    end = outputString.slice(endTextIndex),
                    item = document.createElement('div');

                item.appendChild(document.createTextNode(start));
                item.appendChild($('<span></span>').addClass('selectbox__list-highlight').text(middle).get(0));
                item.appendChild(document.createTextNode(end));

                return item.innerHTML;

            }
            function divider() {
                return $('<li></li>').addClass('selectbox__list-divider');
            }

            self.selectWrapper.appendChild(self.list);

            if (self.options.unselect !== -1 && !searchText) {
                var newItem = listItem(self.options.unselect).addClass('is-hightlighted selectbox__list-unselect');
                self.list.appendChild(newItem.get(0));
                self.list.appendChild(divider().get(0));
            }

            items.forEach(function(item, i) {
                var newItem = listItem(item, self.options.items.indexOf(item));

                if (i === 0 && self.list.children.length === 0) {
                    newItem.addClass('is-hightlighted');
                }
                if (activeItem === i) {
                    newItem.addClass('is-active');
                }

                self.list.appendChild(newItem.get(0));
            });

            var fieldRect = self.el.getBoundingClientRect(),
                fieldOffsetTop = self.el.offsetTop,
                windowHeight = window.innerHeight,
                menuRect = self.list.getBoundingClientRect(),

                heightCheck = windowHeight - fieldRect.top - fieldRect.height - menuRect.height;

            self.list.style.top = heightCheck > 0 ? fieldOffsetTop + fieldRect.height + 5 + 'px' : fieldOffsetTop - menuRect.height - 10 + 'px';
        }

        function selectItem(item) {
            if (self.options.unselect && item.innerHTML === self.options.unselect) {
                self.activeItem = -1;
                self.el.classList.remove('selectbox_state_not-empty', 'js-hasValue');
            }
            else {
                self.activeItem = item.dataset.index;
                self.el.classList.add('selectbox_state_not-empty', 'js-hasValue');
            }
            self._toggleAddable();
            closeList();
            normalizeRequiredCount();
            if (self.options.itemCallback) {
                self.options.itemCallback(item, self);
            }
        }

        //Select click
        function handleSelectClick(e) {
            if (self.list) {
                closeList();
                if (!self.activeItem) {
                    self.el.innerHTML = '';
                }
            } else {

                if (self.options.items) {
                    //Check if there is any selected item. If not set the placeholder text
                    if (self.activeItem < 0) {
                        self.el.innerHTML = self.placeholder || 'Select';
                    }

                    //Check if search option is on or there is more than 10 items. If yes, add searcfield
                    if (self.options.search || self.options.items.length > 7) {
                        if (!self.searchField) {
                            self.searchField = document.createElement('input');
                            self.searchField.type = 'text';
                            self.searchField.classList.add('selectbox__searchfield');
                            self.searchField.placeholder = self.options.searchPlaceholder || 'Search...';
                            self.searchField.addEventListener('input', handleSearchFieldInput);
                            self.searchField.addEventListener('keydown', handleKeyDown);
                        } else {
                            self.el.addEventListener('keydown', handleKeyDown);
                        }
                        self.el.innerHTML = '';
                        self.el.appendChild(self.searchField);
                        self.searchField.value = '';
                        self.searchField.focus();
                    } else {
                        self.inputField = document.createElement('input');
                        self.inputField.type = 'text';
                        self.inputField.style.opacity = 0;
                        self.inputField.style.position = 'absolute';
                        //self.searchField.addEventListener('input', handleSearchFieldInput);
                        self.inputField.addEventListener('keydown', handleKeyDown);
                        self.el.appendChild(self.inputField);
                        self.inputField.focus();
                    }
                    self.el.classList.add('selectbox_state_open');
                    createList(self.options.items, self.activeItem);
                    window.setTimeout(function(){document.addEventListener('mousedown', handleSelectDocClick);}, 100);
                }
            }
        }
        //Select item handler
        function handleItemClick(e) {
            e.stopPropagation();
            selectItem(e.target);
        }
        function handleItemMouseOver(e) {
            $(self.list).find('li').removeClass('is-hightlighted');
            $(e.target).addClass('is-hightlighted');
        }
        function handleSelectDocClick() {
            closeList();
        }

        //Fulter function for searcfield
        function handleSearchFieldInput(e) {
            var fItems = self.options.items.filter(function(i) {
                return i.toLowerCase().includes(e.target.value.toLowerCase());
            });
            createList(fItems, self.activeItem, e.target.value.toLowerCase());
        }

        function handleKeyDown(e) {
            e.stopPropagation();
            var index, length;
            switch (e.keyCode) {
                case 13:
                    if (self.list && self.list.getElementsByClassName('is-hightlighted').length > 0) {
                        selectItem(self.list.getElementsByClassName('is-hightlighted')[0]);
                    } else {
                        closeList();
                    }
                    break;

                case 27:
                    closeList();
                    break;

                case 38:
                    if (self.list && self.list.getElementsByClassName('is-hightlighted').length > 0) {

                        index = $(self.list).find('.is-hightlighted').index();
                        length = $(self.list).find('li').length;

                        if (index > 0) {
                            $(self.list).find('li').removeClass('is-hightlighted');
                            $(self.list).find('li').eq(index - 1).addClass('is-hightlighted');

                            if (index < length - 1) {
                                if ($(self.list).find('li').eq(index + 1).position().top < 50) {
                                    $(self.list).animate({
                                        scrollTop: $(self.list).scrollTop() - $(self.list).height() > 0 ? $(self.list).scrollTop() - $(self.list).height() : 0
                                    }, 400);
                                }
                            }
                            if (index === 1) {
                                $(self.list).animate({
                                    scrollTop: 0
                                }, 400);
                            }
                        }
                    }
                    break;

                case 40:
                    if (self.list && self.list.getElementsByClassName('is-hightlighted').length > 0) {
                        index = $(self.list).find('.is-hightlighted').index();
                        length = $(self.list).find('li').length;

                        if (index < length - 1) {
                            $(self.list).find('li').removeClass('is-hightlighted');
                            $(self.list).find('li').eq(index + 1).addClass('is-hightlighted');

                            if ($(self.list).height() < $(self.list).find('li').eq(index + 1).position().top + $(self.list).find('li').eq(index + 1).outerHeight()) {
                                $(self.list).animate({
                                    scrollTop: $(self.list).scrollTop() + $(self.list).find('li').eq(index + 1).position().top +  $(self.list).find('li').eq(index + 1).outerHeight()
                                }, 400);
                            }
                        }
                        if (index === length) {
                            $(self.list).animate({
                                scrollTop: $(self.list).scrollTop() + $(self.list).find('li').eq(index).position().top + $(self.list).find('li').eq(index).height()
                            }, 400);
                        }
                    }
                    break;
            }
        }
        //Check if field is empty or not and change class accordingly
        $(self.el).on('click', handleSelectClick);
    };

    Selectbox.prototype._toggleAddable = function() {
        if ($(this.el).parents('.js-addableWrapper').length > 0) {
            if ($(this.el).hasClass('js-hasValue')) {
                $(this.el).parents('.js-addableWrapper').addClass('js-hasValue');
            } else {
                $(this.el).parents('.js-addableWrapper').removeClass('js-hasValue');
            }
        }
    };

    Selectbox.prototype.clear = function() {
        this.el.classList.remove('selectbox_state_not-empty', 'js-hasValue');
        this.el.innerHTML = '';
        this.activeItem = -1;
    };

    function initSelectboxes() {
        [].slice.call(document.querySelectorAll('.js-selectbox')).forEach(function(el) {
            new Selectbox(el, {
                label: el.dataset.label,
                helpText: el.dataset.helpText,
                errMsg: el.dataset.errMsg,
                placeholder: el.dataset.placeholder,
                items: JSON.parse(el.dataset.items),
                search: el.dataset.search,
                searchPlaceholder:el.dataset.searchPlaceholder,
                required: el.dataset.required,
                selectedItem: el.dataset.selectedItem,
                unselect: el.dataset.unselect
            });
        });
    }

    initSelectboxes();


//})(window);

//Tagfields
//;(function(window) {
    //'use strict';

    function Tagfield(el, options) {
        this.el = el;
        this.options = options;

        this._init();
        this._initEvents();
    }

    Tagfield.prototype._init = function() {
        var self = this;

        this.items = this.options.initialItems || [];

        this.tagfieldWrapper = document.createElement('div');
        this.tagfieldWrapper.classList.add('tagfield__wrapper');
        this.el.parentNode.insertBefore(this.tagfieldWrapper, this.el);
        this.tagfieldWrapper.appendChild(this.el);
        this.el.classList.remove('js-tagfield');
        this.el.classList.add('tagfield__field');

        if (this.options.label) {
            this.label = document.createElement('label');
            this.label.innerHTML = this.options.label;
            this.label.classList.add('tagfield__label');
            this.label.for = this.el.id;
            this.tagfieldWrapper.appendChild(this.label);
        }
        if (this.options.helpText) {
            this.helpText = document.createElement('div');
            this.helpText.innerHTML = this.options.helpText;
            this.helpText.classList.add('tagfield__help-text');
            this.tagfieldWrapper.appendChild(this.helpText);
        }
        if (this.options.errMsg) {
            this.errMsg = document.createElement('div');
            this.errMsg.innerHTML = this.options.errMsg;
            this.errMsg.classList.add('tagfield__err-msg');
            this.tagfieldWrapper.appendChild(this.errMsg);
        }

        if (this.items.length > 0) {
            self.el.classList.add('tagfield_state_not-empty', 'js-hasValue');
            self.items.forEach(function(item) {
                self.el.appendChild(self._createTag(item));
            });
            self._toggleAddable();
        }
    };

    Tagfield.prototype._initEvents = function() {
        var self = this;

        //Close list helper
        function closeList() {
            self.el.classList.remove('tagfield_state_open');
            if (self.list) {
                self.list.parentNode.removeChild(self.list);
                self.list = undefined;
            }
            if (self.searchField) {
                self.el.removeChild(self.searchField);
            }
            if (self.helperField && self.helperField.parentNode === self.el) {
                self.el.removeChild(self.helperField);
            }
            if (self.el.getElementsByClassName('tagfield__tag').length === 0) {
                self.el.classList.remove('tagfield_state_not-empty', 'js-hasValue');
                self.el.innerHTML = '';
            }
            document.removeEventListener('mousedown', handleTagfieldDocClick);
            normalizeRequiredCount();
            self._toggleAddable();
        }

        //Create list helper
        function createList(items, activeItem, searchText) {
            if (self.list) {
                self.list.parentNode.removeChild(self.list);
            }

            self.list = document.createElement('ul');
            self.list.classList.add('selectbox__list');

            self.listHelper = $('<div></div>')
                                .addClass('selectbox__list-item')
                                .css('position', 'absolute')
                                .css('z-index', '-1')
                                .css('opacity', 0)
                                .css('pointer-events', 'none')
                                .css('overflow', 'visible');

            self.tagfieldWrapper.appendChild(self.listHelper.get(0));

            items.forEach(function(item, i) {
                var itemElement = document.createElement('li');
                itemElement.classList.add('selectbox__list-item');
                itemElement.innerHTML = item;
                itemElement.id = 'listItem-' + i;
                self.listHelper.text(item);

                function listItemText(itemString, text) {
                    var words = itemString.split(' '),
                        searchIndex = words.reduce(function(currentIndex, word, index) {
                            return word.toLowerCase().indexOf(text) > -1 && currentIndex === -1 ? index : currentIndex;
                        }, -1);

                    if (searchIndex < 3) {
                        return itemString;
                    } else {
                        var stringEnd = words.slice(searchIndex).reduce(function(str, word) {
                            return str + ' ' + word;
                        });
                        var reg = /\.$/;
                        if (words[0].match(reg)) {
                            return words[0] + ' ' + words[1] + ' ... ' + stringEnd;
                        } else {
                            return words[0] + ' ... ' + stringEnd;
                        }
                    }
                }

                if (searchText && $(self.selectWrapper).width() < self.listHelper.width()) {
                    itemElement.innerHTML = listItemText(item, searchText);
                }
                if (i === 0) {
                    itemElement.classList.add('is-hightlighted');
                }
                if (activeItem === i) {
                    itemElement.classList.add('is-active');
                }
                itemElement.addEventListener('mousedown', handleItemClick);
                itemElement.addEventListener('mouseover', handleItemMouseOver);
                self.list.appendChild(itemElement);
            });

            self.tagfieldWrapper.appendChild(self.list);


            var fieldRect = self.el.getBoundingClientRect(),
                fieldOffsetTop = self.el.offsetTop,
                windowHeight = window.innerHeight,
                menuRect = self.list.getBoundingClientRect(),

                heightCheck = windowHeight - fieldRect.top - fieldRect.height - menuRect.height;

            self.list.style.top = heightCheck > 0 ? fieldOffsetTop + fieldRect.height + 5 + 'px' : fieldOffsetTop - menuRect.height - 10 + 'px';
        }

        //Select click
        function handleTagfieldClick(e) {
            //e.stopPropagation();
            if (self.list) {
                //closeList();
            } else {
                if (self.options.items) {
                    //Create Searchfield
                    if (self.options.search || self.options.items.length > 7 || self.options.createTags) {
                        if (!self.searchField) {
                            self.searchField = document.createElement('input');
                            self.searchField.type = 'text';
                            self.searchField.classList.add('tagfield__searchfield');
                            self.searchField.placeholder = self.options.searchPlaceholder || 'Search...';
                            self.searchField.addEventListener('input', handleSearchFieldInput);
                            self.searchField.addEventListener('keydown', handleKeyDown);
                        }
                        self.el.appendChild(self.searchField);
                        self.searchField.focus();
                        self.searchField.value = '';

                    } else {
                        if (self.el.getElementsByClassName('tagfield__tag').length === 0) {
                            self.el.innerHTML = self.options.placefolder || 'Select from the list';
                        }
                        self.helperField = document.createElement('input');
                        self.helperField.type = 'text';
                        self.helperField.classList.add('js-helperInput');
                        self.helperField.style.opacity = 0;
                        self.helperField.style.zIndex = -1;
                        self.helperField.style.position = 'absolute';
                        //self.searchField.addEventListener('input', handleSearchFieldInput);
                        self.helperField.addEventListener('keydown', handleKeyDown);
                        self.el.appendChild(self.helperField);
                        self.helperField.focus();
                    }

                    self.el.classList.add('tagfield_state_open');
                    createList(self.options.items, self.activeItem);
                    window.setTimeout(function(){document.addEventListener('mousedown', handleTagfieldDocClick);}, 100);
                }
            }

        }
        //Select item handler
        function selectTag(el) {
            if (self.el.getElementsByClassName('tagfield__tag').length === 0) {
                if (self.el.getElementsByClassName('tagfield__searchfield').length === 1) {
                    self.el.innerHTML = '';
                    self.el.appendChild(self.searchField);
                } else if (self.el.getElementsByClassName('js-helperInput').length === 1) {
                    self.el.innerHTML = '';
                    self.el.appendChild(self.helperField);
                } else {
                    self.el.innerHTML = '';
                }
            }


            if (self.searchField) {
                self.el.insertBefore(self._createTag(el.innerHTML), self.searchField);
            } else {
                self.el.appendChild(self._createTag(el.innerHTML));
            }
            self.items.push(el.innerHTML);

            self.el.classList.add('tagfield_state_not-empty', 'js-hasValue');

            if (self.searchField) {
                self.searchField.value = '';
                self.searchField.focus();
                createList(self.options.items);
            } else if (self.helperField) {
                self.helperField.value = '';
                self.helperField.focus();
                createList(self.options.items);
            }
            self._toggleAddable();
            normalizeRequiredCount();

            if (self.options.itemCallback) {
                self.options.itemCallback(el, self);
            }
        }
        function handleItemClick(e) {
            e.stopPropagation();
            selectTag(e.target);
        }
        function handleItemMouseOver(e) {
            $(self.list).find('li').removeClass('is-hightlighted');
            $(e.target).addClass('is-hightlighted');
        }
        function handleTagfieldDocClick(e) {
            closeList();
        }

        //Fulter function for searcfield
        function handleSearchFieldInput(e) {
            var fItems = self.options.items.filter(function(i) {
                return i.toLowerCase().includes(e.target.value.toLowerCase());
            });
            createList(fItems, self.activeItem, e.target.value.toLowerCase());

            if (e.target.value.slice(-1) === ',' && self.options.createTags) {
                self.el.insertBefore(self._createTag(e.target.value.slice(0, -1)), self.searchField);
                self.el.classList.add('tagfield_state_not-empty', 'js-hasValue');
                e.target.value = '';
                e.target.focus();
                createList(self.options.items);
                self._toggleAddable();
            }
        }

        function handleKeyDown(e) {
            e.stopPropagation();
            var index, length;
            switch (e.keyCode) {
                case 13:
                    if (self.list && self.list.getElementsByClassName('is-hightlighted').length > 0) {
                        selectTag(self.list.getElementsByClassName('is-hightlighted')[0]);
                    } else if (e.target.value !== '' && self.options.createTags) {
                        self.el.insertBefore(self._createTag(e.target.value), self.searchField);
                        e.target.value = '';
                        e.target.focus();
                        createList(self.options.items);
                    } else {
                        closeList();
                    }
                    break;

                case 27:
                    closeList();
                    break;

                case 38:
                    if (self.list && self.list.getElementsByClassName('is-hightlighted').length > 0) {

                        index = $(self.list).find('.is-hightlighted').index();
                        length = $(self.list).find('li').length;

                        if (index > 0) {
                            $(self.list).find('li').removeClass('is-hightlighted');
                            $(self.list).find('li').eq(index - 1).addClass('is-hightlighted');

                            if ($(self.list).find('li').eq(index + 1).position().top < 50) {
                                $(self.list).animate({
                                    scrollTop: $(self.list).scrollTop() - $(self.list).height() > 0 ? $(self.list).scrollTop() - $(self.list).height() : 0
                                }, 400);
                            }
                            if (index === 1) {
                                $(self.list).animate({
                                    scrollTop: 0
                                }, 400);
                            }
                        }
                    }
                    break;

                case 40:
                    if (self.list && self.list.getElementsByClassName('is-hightlighted').length > 0) {
                        index = $(self.list).find('.is-hightlighted').index();
                        length = $(self.list).find('li').length;

                        if (index < length - 1) {
                            $(self.list).find('li').removeClass('is-hightlighted');
                            $(self.list).find('li').eq(index + 1).addClass('is-hightlighted');

                            if ($(self.list).height() < $(self.list).find('li').eq(index + 1).position().top + $(self.list).find('li').eq(index + 1).outerHeight()) {
                                $(self.list).animate({
                                    scrollTop: $(self.list).scrollTop() + $(self.list).find('li').eq(index + 1).position().top + $(self.list).find('li').eq(index + 1).outerHeight()
                                }, 400);
                            }
                        }
                    }
                    break;
            }
        }

        //Delete tag handle
        function handleDeleteTag(e) {
            e.stopPropagation();
            var tag = e.target.parentNode;

            tag.removeChild(e.target);
            var tagTitle = tag.innerHTML,
                tagIndex = self.items.indexOf(tagTitle);
            if (tagIndex > -1) {
                self.items = [].concat(self.items.slice(0, tagIndex), self.items.slice(tagIndex + 1));
            }

            self.el.removeChild(tag);

            if (self.el.getElementsByClassName('tagfield__tag').length === 0) {
                self.el.classList.remove('tagfield_state_not-empty', 'js-hasValue');
                if (self.el.classList.contains('tagfield_state_open')) {
                    self.el.innerHTML = self.options.placefolder || 'Select from the list';
                }
            }
            self._toggleAddable();


        }

        //Check if field is empty or not and change class accordingly
        $(this.tagfieldWrapper).on('click', '.tagfield__field', handleTagfieldClick);
        normalizeRequiredCount();

    };

    //Autoresize textarea
    Tagfield.prototype._autosize = function() {
        if (this.el.value === '') {this.el.rows = 1;}
        else {
            var width = this.el.getBoundingClientRect().width,
                span = document.createElement('span'),
                textWidth = this.el.value.length * 7,
                row = Math.ceil(textWidth / width);

            row = row <= 0 ? 1 : row;
            row = this.options.maxHeight && row > this.options.maxHeight ? this.options.maxHeight : row;

            this.el.rows = row;
        }
    };

    //Create Tag Helper
    Tagfield.prototype._createTag = function(tagName) {
        var self = this;
        var tag = document.createElement('div'),
            delTag = document.createElement('div');

        tag.classList.add('tagfield__tag');
        tag.innerHTML = tagName;

        delTag.classList.add('tagfield__tag-delete');
        delTag.innerHTML = '✕';
        delTag.addEventListener('click', function(e) {
            e.stopPropagation();
            self._deleteTag(e.target.parentNode);
        });

        tag.appendChild(delTag);

        return tag;
    };

    Tagfield.prototype._deleteTag = function(tag) {
        this.el.removeChild(tag);

        $(tag).find('.tagfield__tag-delete').remove();
        var tagTitle = tag.innerHTML,
            tagIndex = this.items.indexOf(tagTitle);
        if (tagIndex > -1) {
            this.items = [].concat(this.items.slice(0, tagIndex), this.items.slice(tagIndex + 1));
        }

        if (this.el.getElementsByClassName('tagfield__tag').length === 0) {
            this.el.classList.remove('tagfield_state_not-empty', 'js-hasValue');
            if (this.el.classList.contains('tagfield_state_open')) {
                this.el.innerHTML = self.options.placefolder || 'Select from the list';
            }
        }
        this._toggleAddable();

        if (this.options.deleteTagCallback) {
            this.options.deleteTagCallback(tag, this);
        }
    };
    Tagfield.prototype._toggleAddable = function() {
        if ($(this.el).parents('.js-addableWrapper').length > 0) {
            if ($(this.el).hasClass('js-hasValue')) {
                $(this.el).parents('.js-addableWrapper').addClass('js-hasValue');
            } else {
                $(this.el).parents('.js-addableWrapper').removeClass('js-hasValue');
            }
        }
    };

    Tagfield.prototype.clear = function() {
        this.items = [];
        $(this.el).find('.tagfield__tag').remove();
        this.el.classList.remove('tagfield_state_not-empty', 'js-hasValue');
        this._toggleAddable();
    };

    function initTagfields() {
        [].slice.call(document.querySelectorAll('.js-tagfield')).forEach(function(el) {
            new Tagfield(el, {
                label: el.dataset.label,
                helpText: el.dataset.helpText,
                errMsg: el.dataset.errMsg,
                placeholder: el.dataset.placeholder,
                items: JSON.parse(el.dataset.items),
                search: el.dataset.search,
                searchPlaceholder: el.dataset.searchPlaceholder,
                createTags: el.dataset.createNewTag,
                initialItems: el.dataset.selectedItems ? JSON.parse(el.dataset.selectedItems) : ''
            });
        });
    }

    initTagfields();


//})(window);

//Addablefiels
//;(function(window) {
    //'use strict';

    function Addable(el, options) {
        this.el = el;
        this.options = options || {sortable: true};

        this._init();
    }

    Addable.prototype._init = function() {
        var self = this;

        self.addableWrapper = $('<div></div>').addClass('js-addableWrapper');
        self.addableWrapper.insertBefore(self.el);

        self.el.removeClass('js-addable');
        self.el.addClass('js-addableItem c-Addable-item');

        self.addableRow = $('<div></div>').addClass('js-addableRow c-Addable-row');

        if (self.options.sortable) {
            self.addableRowDragHandler = $('<div></div>').addClass('c-Addable-row-dragHandler');
            self.addableRow.append(self.addableRowDragHandler);

            self.addableWrapper.sortable({
                placeholder: self.options ? self.options.placeholder || 'c-Addable-rowPlaceholder' : 'c-Addable-rowPlaceholder',
                start: function(e, ui) {
                    ui.item.addClass('is-dragging');
                    $(e.target).css('height', $(e.target).height());
                    $('body').css('height', $('body').height());
                },
                stop: function(e, ui) {
                    ui.item.removeClass('is-dragging');
                    $(e.target).css('height', '');
                    $('body').css('height', '');
                }
            });
        }

        self.addButton = $('<button></button>').addClass('button--round button_style_outline-gray button--add c-Addable-row-addButton').click(handleAddRow);

        self.removeButton = $('<button></button>').addClass('button--round button_style_outline-gray button--remove js-addableRemoveButton').click(handleRemoveRow);

        self.addableRow.append(self.el.clone(true, true), this.removeButton, this.addButton);
        self.originalEl = self.el.clone(true, true);
        self.el.detach();

        self.addableWrapper.append(this.addableRow.clone(true, true));

        function handleAddRow(e) {
            //Check if there are more than 1 child and change class
            if (self.addableWrapper.children().length > 1) {
                self.addableWrapper.addClass('has-multipleRows');
            } else {
                self.addableWrapper.removeClass('has-multipleRows');
            }
            //self.addableWrapper.append(self.addableRow.clone(true, true));
            self._addItem(self.originalEl.clone(true, true), self.options? self.options.beforeAdd : null);
        }
        function handleRemoveRow(e) {
        	$(e.target).parents('.js-addableRow').remove();

            switch (self.addableWrapper.children('.js-addableRow').length) {
                case 0:
                    self._addItem(self.originalEl.clone(true, true), self.options? self.options.beforeAdd : null);
                    self.addableWrapper.removeClass('js-hasValue');
                    break;

                case 1:
                    self.addableWrapper.removeClass('has-multipleRows');
                    break;

                default:
                    break;
            }
        }

        self._addItem = function(el, beforeAdd) {
            if (beforeAdd) {
                beforeAdd(el);
            }
            var addableRow = $('<div></div>').addClass('js-addableRow c-Addable-row'),
                addButton = $('<button></button>').addClass('button--round button_style_outline-gray button--add c-Addable-row-addButton').click(handleAddRow),
                removeButton = $('<button></button>').addClass('button--round button_style_outline-gray button--remove js-addableRemoveButton').click(handleRemoveRow);

            el.addClass('js-addableItem c-Addable-item');
            if (self.options.sortable) {
                var addableRowDragHandler = $('<div></div>').addClass('c-Addable-row-dragHandler');
                addableRow.append(addableRowDragHandler);
            }
            addableRow.append(el, removeButton, addButton);
            self.addableWrapper.append(addableRow);

            if (self.addableWrapper.children().length > 1) {
                self.addableWrapper.addClass('has-multipleRows');
            } else {
                self.addableWrapper.removeClass('has-multipleRows');
            }
            if (self.options.afterAdd) {
                self.options.afterAdd(el);
            }

            //Auto scroll page when adding row below screen bottom edge
            var rowBottomEnd = addableRow.get(0).getBoundingClientRect().top + addableRow.height();
            if (rowBottomEnd + 60 > $(window).height()) {
                $('body').animate( { scrollTop: '+=' + Math.round(rowBottomEnd + 60 - $(window).height()).toString() }, 400);
            }

            return self.addableWrapper;
        };
        self.removeItem = function(index) {
            self.addableWrapper.children().slice(index, index+1).remove();
            if (self.addableWrapper.children('.js-addableRow').length <= 1) {
        		self.addableWrapper.removeClass('has-multipleRows');
        	}
        };
    };

    function initAddableFields() {
        [].slice.call(document.querySelectorAll('.js-addable')).forEach(function(el) {
            new Addable($(el));
        });
    }


//})(window);

//Utilities

//Throttle Scroll events
;(function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle ("scroll", "optimizedScroll");
    throttle ("resize", "optimizedResize");
})();

//Sticky topbar
function StickyTopbar() {
    this._init();
}

StickyTopbar.prototype._init = function() {
    var self = this;
    self.lastScrollPos = $(window).scrollTop();
    self.topbarTransition = false;


    window.addEventListener("optimizedScroll", function(e) {
        var scrollPos = $(window).scrollTop();

        if (scrollPos >= 55 && !$('.c-Header-title').hasClass('is-stuck')) {
            $('.c-Header-title').addClass('is-stuck');
        } else if (scrollPos < 55 && $('.c-Header-title').hasClass('is-stuck')) {
            $('.c-Header-title').removeClass('is-stuck');
        }

        if ($('.c-Header-controls').hasClass('c-Header-controls--center')) {
            if (scrollPos >= 55 && !$('.c-Header-controls').hasClass('is-stuck')) {
                $('.c-Header-controls--center').addClass('is-stuck');
            } else if (scrollPos < 55 && $('.c-Header-controls').hasClass('is-stuck')) {
                $('.c-Header-controls--center').removeClass('is-stuck');
            }
        }

        if ($('.c-Header-controls').hasClass('header__controls--filter')) {
            if (scrollPos >= 55 && !$('.c-Header-controls').hasClass('is-stuck')) {
                $('.header__controls--filter').addClass('is-stuck');
            } else if (scrollPos < 55 && $('.c-Header-controls').hasClass('is-stuck')) {
                $('.header__controls--filter').removeClass('is-stuck');
            }
        }

        if ($('.c-Header').hasClass('c-Header--controls')) {
            if (scrollPos >= 145 && !$('.c-Header').hasClass('is-stuck')) {
                $('.c-Header').addClass('is-stuck');
            } else if (scrollPos < 145 && $('.c-Header').hasClass('is-stuck')) {
                $('.c-Header').removeClass('is-stuck');
            }
        } else if ($('.c-Header').hasClass('header--filter')) {
            if (scrollPos >= 70 && !$('.c-Header').hasClass('is-stuck')) {
                $('.c-Header').addClass('is-stuck');
            } else if (scrollPos < 70 && $('.c-Header').hasClass('is-stuck')) {
                $('.c-Header').removeClass('is-stuck');
            }
        }
        else {
            if (scrollPos >= 85 && !$('.c-Header').hasClass('is-stuck')) {
                $('.c-Header').addClass('is-stuck');
            } else if (scrollPos < 85 && $('.c-Header').hasClass('is-stuck')) {
                $('.c-Header').removeClass('is-stuck');
            }
        }

        if ($('.library__header').length > 0) {
            if (scrollPos >= 70 && !$('.library__header').hasClass('is-stuck')) {
                $('.library__header').addClass('is-stuck');
            } else if (scrollPos < 70 && $('.library__header').hasClass('is-stuck')) {
                $('.library__header').removeClass('is-stuck');
            }
        }

        if ($('.content__controls--library').length > 0) {
            if (window.innerWidth >= 930) {
                if (scrollPos >= 55 && !$('.content__controls--library').hasClass('is-stuck')) {
                    $('.content__controls--library').addClass('is-stuck');
                } else if (scrollPos < 55 && $('.content__controls--library').hasClass('is-stuck')) {
                    $('.content__controls--library').removeClass('is-stuck');
                }
            } else {
                if (scrollPos >= 10 && !$('.content__controls--library').hasClass('is-stuck')) {
                    $('.content__controls--library').addClass('is-stuck');
                } else if (scrollPos < 10 && $('.content__controls--library').hasClass('is-stuck')) {
                    $('.content__controls--library').removeClass('is-stuck');
                }
            }
        }

    });
};

//ScrollSpyNav
;(function(window) {
    //'use strict';

    function ScrollSpyNav(el) {
        this.el = el;

        this._init();
        this._initEvents();
    }

    ScrollSpyNav.prototype._init = function() {
        this.options = {
            offset: this.el.dataset.topOffset
        };

        this.items = [].slice.call(this.el.getElementsByTagName('li')).map(function(el) {
            var itemId = el.dataset.href;
            return {navItem: el,
                    item: document.getElementById(itemId)};
        });
    };

    ScrollSpyNav.prototype._initEvents = function() {
        var self = this;

        window.addEventListener("optimizedScroll", function(e) {
            if (!self.scrollingToItem) {
                var mainItems = self.items.filter(function(item) {
                    var elBCR = item.item.getBoundingClientRect();
                    return elBCR.top > self.options.offset && elBCR.top < window.innerHeight / 2;
                });

                if (mainItems.length > 0 && (!self.mainItem || self.mainItem !== mainItems[0])) {
                    self.mainItem = mainItems[0];
                    self.items.forEach(function(i) {
                        i.navItem.classList.remove(self.options.activeClass || 'is-active');
                    });
                    self.mainItem.navItem.classList.add(self.options.activeClass || 'is-active');
                }
            }
        });

        self.items.forEach(function(item) {
            item.navItem.addEventListener('click', function(e) {
                var href = '#' + e.target.dataset.href;
                var offsetTop = href === "#" ? 0 : $(href).offset().top - self.options.offset - 30;
                self.scrollingToItem = true;
                self.items.forEach(function(i) {
                    i.item.classList.remove(self.options.activeClass || 'is-active');
                    i.navItem.classList.remove(self.options.activeClass || 'is-active');
                });
                $(e.target).addClass(self.options.activeClass || 'is-active');


                $('html, body').stop().animate({
                    scrollTop: offsetTop
                }, 300, function() {
                    self.scrollingToItem = false;
                    $(href).addClass(self.options.activeClass || 'is-active');

                });
            });
        });
    };

    function initScrollSpyNav() {
        [].slice.call(document.querySelectorAll('.js-scrollSpyNav')).forEach(function(el) {
            new ScrollSpyNav(el);
        });
    }
    initScrollSpyNav();

})(window);

//Dropdown
function Dropdown(el, options) {
    this.el = el;
    this.options = options;

    this._init();
    this._initEvents();
}

Dropdown.prototype._init = function() {
    this.dropdownWrapper = document.createElement('div');
    this.dropdownWrapper.classList.add('js-dropdownWrapper');
    this.el.parentNode.insertBefore(this.dropdownWrapper, this.el);
    this.dropdownWrapper.appendChild(this.el);
    this.el.classList.remove('js-dropdown');
    this.el.classList.add('js-dropdownItem');
};

Dropdown.prototype._initEvents = function() {
    var self = this;

    //Close list helper
    function closeList() {
        self.el.classList.remove('is-open');
        if (self.list) {
            self.dropdownWrapper.removeChild(self.list);
            self.list = undefined;
        }
        document.removeEventListener('mousedown', handleOutsideClick);
    }
    //Handle outside dropdown click
    function handleOutsideClick(e) {
        closeList();
    }

    //Handle dropdown click
    function handleDropdownClick(e) {

        //e.stopPropagation();
        if (self.el.classList.contains('is-open')) {closeList();}
        else {
            if (self.options.items) {
                self.el.classList.add('is-open');

                self.list = document.createElement('ul');
                self.list.classList.add('c-Dropdown-list');

                self.options.items.forEach(function(item, i) {
                    var itemElement = document.createElement('li');
                    if (item.divider) {
                        itemElement.classList.add('dropdown__divider');
                    } else {
                        itemElement.classList.add('dropdown__list-item');
                        itemElement.innerHTML = item.innerHTML || item.text;
                        itemElement.addEventListener('mousedown', function(e) {
                            e.stopPropagation();
                            item.callback(e);
                            closeList();
                        });
                        if (item.disabled) {
                            if (item.disabled()) {
                                itemElement.classList.add('disabled');
                            }
                        }
                        if (item.warning) {
                            if (item.warning()) {
                                itemElement.classList.add('has-warning');
                            }
                        }
                    }
                    self.list.appendChild(itemElement);
                });

                self.dropdownWrapper.appendChild(self.list);

                var listRect = self.list.getBoundingClientRect();

                if (listRect.left + listRect.width > window.innerWidth) {
                    self.list.style.right = 0;
                } else {
                    self.list.style.left = 0;
                }
                if (listRect.top + listRect.height > window.innerHeight) {
                    self.list.style.bottom = '100%';
                } else {
                    self.list.style.top = '100%';
                }
                window.setTimeout(function(){document.addEventListener('mousedown', handleOutsideClick);}, 100);
            }
        }
    }

    self.el.addEventListener('click', handleDropdownClick);
};

//Image Placeholders
//This class creates a palceholder for image files. It handle both click to load and also select from asset library action.

function ImagePlaceholder(el, file, options) {
  this.el = el;
  this.file = file;
  this.options = options || {};

  this._init();
  this._initEvents();
}

ImagePlaceholder.prototype._init = function() {
  this.options.name = this.options.name || this.el.dataset.name;
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

    $('#addFromALButton').text(self.options.alButton || 'Set Cover');

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

/*
 * Initializations
 */
//Cast $ Credit import
// data
var castAndCredit = {
    cast: [
        {
            person: 'Sullivan Stapleton',
            role: ['Kurt Weller']
        },
        {
            person: 'Jaimie Alexander',
            role: ['Jane Doe']
        },
        {
            person: 'Marianne Jean-Baptiste',
            role: ['Bethany Mayfair']
        },
        {
            person: 'Rob Brown',
            role: ['Edgar Reade']
        },
        {
            person: 'Audrey Esparza',
            role: ['Tasha Zapata']
        },
        {
            person: 'Ashley Johnson',
            role: ['Patterson']
        },
        {
            person: 'Ukweli Roach',
            role: ['Dr. Borden']
        }
    ],
    credit: [
        {
            role: 'Series Premiere',
            names: 'September 21, 2015'
        },
        {
            role: 'Starring',
            names: 'Sullivan Stapleton, Jaimie Alexander, Marianne Jean-Baptiste, Rob Brown, Audrey Esparza, Ashley Johnson, Ukweli Roach'
        },
        {
            role: 'Created By',
            names: 'Martin Gero'
        },
        {
            role: 'Written By (Pilot)',
            names: 'Martin Gero'
        },
        {
            role: 'Executive Producers',
            names: 'Greg Berlanti, Martin Gero, Sarah Schechter, Mark Pellington, Marcos Siega'
        },
        {
            role: 'Co-Executive Producer',
            names: 'Christina Kim'
        },
        {
            role: 'Supervising Producer',
            names: 'Alex Berger'
        },
        {
            role: 'Producer',
            names: 'Brendan Gall'
        },
        {
            role: 'Line Producer',
            names: 'Harvey Waldman'
        },
        {
            role: 'Co-Producers',
            names: 'Ryan Johnson, Peter Lalayanis, Jennifer Lence, Carl Ogawa'
        },
        {
            role: 'Director (Pilot)',
            names: 'Mark Pellington'
        },
        {
            role: 'Directors of Photography',
            names: 'David Tuttman, David Johnson'
        },
        {
            role: 'Editors',
            names: 'Finnian Murray, Joel Pashby, Kristin Windell'
        }
    ]
};
var characters = [
    'Angela Moss',
    'Aram Mojtabai',
    'Arlene',
    'Bethany Mayfair',
    'Carlos Espada',
    'Cristina Santos',
    'Darlene',
    'Dembe Zuma',
    'Donald Ressler',
    'Dr. Borden',
    'Edgar Reade',
    'Elliot Alderson',
    'Elizabeth "Liz" Keen',
    'Harlee Santos',
    'Harold Cooper',
    'Jane Doe',
    'Kurt Weller',
    'Marcus Tufo',
    'Matt Wozniak',
    'Michael Loman',
    'Mr. Robot',
    'Patterson',
    'Raymond "Red" Reddington',
    'Robert Stahl',
    'Samar Navabi',
    'Stuart Saperstein',
    'Tasha Zapata',
    'Tess Nazario',
    'Tom Keen',
    'Tyrell Wellick',
    'Timothy Clark',
    'Jessica Parker',
    'Father Andrews',
    'Lisa Jones',
    'Iain Vaughn',
    'Cam Henry',
    'Dylan Bennett',
    'Sarah Bennett'
];
var persons = [
    'Adam Levine',
    'Amir Arison',
    'Ashley Johnson',
    'Audrey Esparza',
    'Blake Shelton',
    'Carly Chaikin',
    'Carson Daly',
    'Christian Slater',
    'Christina Aguilera',
    'Dayo Okeniyi',
    'Diego Klattenhoff',
    'Drea de Matteo',
    'Hampton Fluker',
    'Harry Lennix',
    'Hisham Tawfiq',
    'Jaimie Alexander',
    'James Spader',
    'Jennifer Lopez',
    'Marianne Jean-Baptiste',
    'Martin Wallström',
    'Megan Boone',
    'Mozhan Marnò',
    'Pharrell Williams',
    'Portia Doubleday',
    'Rami Malek',
    'Ray Liotta',
    'Rob Brown',
    'Ryan Eggold',
    'Sarah Jeffery',
    'Sullivan Stapleton',
    'Ukweli Roach',
    'Vincent Laresca',
    'Warren Kole',
    'Katie McGrath',
    'Brandon Jay McLaren',
    'Steve Byers',
    'Dean McDermott',
    'Enuka Okuma',
    'Rob Stewart',
    'Erin Karpluk',
    'Christopher Jacot'    
];

function importCast() {
  var creditSection = $('#creditSection'),
  castSection = $('#castSection'),
  seasonHasCast = creditSection.find('.js-hasValue').length > 0 || castSection.find('.js-hasValue').length > 0; //CHeck if credit section or cast section have filled fields or selectboxes or tagfields

  if (seasonHasCast) {
    new Modal({
      title: 'Import Cast & Credit?',
      text: 'The new Cast & Credit will overwrite and replace the existing Cast & Credit information. Are you sure you would like to import?',
      confirmText: 'Import',
      confirmAction: loadCast,
      dialog: true
    });
  } else {
    loadCast();
  }
}

function loadCast() {
  var castSection = $('#castSection'),
  castSectionBody = castSection.find('.controls__group'),
  creditSection = $('#creditSection'),
  creditSectionBody = creditSection.find('.controls__group'),
  cast = castAndCredit.cast,
  credit = castAndCredit.credit;

  castSectionBody.empty();
  creditSectionBody.empty();

  createCastSection(cast, castSectionBody);
  createCreditSection(credit, creditSectionBody);

  hideCastImport();
}

function createCreditSection(credit, section) {
  var addableRow = createCreditRow({role: '', names: ''});
  function beforeAddCredit(el) {
    new Textfield(el.find('input.js-input').get(0), {
      label: 'Title',
      helpText: 'e.g Producer, Costume'
    });

    new Textfield(el.find('textarea.js-input').get(0), {label: 'Name(s)'});
    el.find('textarea').elastic();
  }

  section.append(addableRow);
  addableObject = new Addable(addableRow, {beforeAdd: beforeAddCredit, sortable: true});
  addableObject.removeItem(0);

  credit.forEach(function(c) {
    addableObject._addItem(createCreditRow(c));
  });

  function createCreditRow(c) {
    var creditRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),
    roleWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
    roleField = $('<input type="text"/>').addClass('js-input input_style_light').val(c.role),
    namesField = $('<textarea></textarea>').addClass('js-input input_style_light').val(c.names),
    namesWrapper = $('<div></div>').addClass('cg__control cg__control_style_row');

    //namesField.elastic();
    roleWrapper.append(roleField);
    namesWrapper.append(namesField);
    creditRow.append(roleWrapper, namesWrapper);

    return creditRow;
  }
}

function initCreditSection(section) {
  function beforeAddCredit(el) {
    if (el.find('input.js-input').get(0)) {
      new Textfield(el.find('input.js-input').get(0), {
        label: 'Title',
        helpText: 'e.g Producer, Costume'
      });
    }
    if (el.find('textarea.js-input').get(0)) {
      new Textfield(el.find('textarea.js-input').get(0), {label: 'Name(s)'});
    }

    el.find('textarea').elastic();
  }
  var addableRow = createCreditRow();

  section.append(addableRow);
  addableObject = new Addable(addableRow, {afterAdd: beforeAddCredit, sortable: true});
  addableObject.removeItem(0);
  addableObject._addItem(createCreditRow(), beforeAddCredit);

}
function createCreditRow(credit) {
  var creditRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),
  roleWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
  roleField = $('<input type="text"/>').addClass('js-input input_style_light').val(credit ? credit.role : ''),
  namesField = $('<textarea></textarea>').addClass('js-input input_style_light').val(credit ? credit.names : ''),
  namesWrapper = $('<div></div>').addClass('cg__control cg__control_style_row');

  roleWrapper.append(roleField);
  namesWrapper.append(namesField);
  creditRow.append(roleWrapper, namesWrapper);

  return creditRow;
}

function createCastSection(cast, section) {
  var addableObject = initCastSection(section);
  addableObject.removeItem(0);

  cast.forEach(function(c) {
    addableObject._addItem(createCastRow(c));
  });

  function createCastRow(c) {
    var castRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),

    personWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
    personSelect = $('<div></div>').addClass('js-selectbox'),

    characterWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
    characterTagfield = $('<div></div>').addClass('js-tagfield'),

    asText = $('<span></span>').addClass('cast__textDivider').text('as'),
    roles = persons.concat(characters).sort();

    personWrapper.append(personSelect);
    characterWrapper.append(characterTagfield);
    castRow.append(personWrapper, asText, characterWrapper);

    var personSelectItem = new Selectbox(personSelect.get(0), {
      label: 'Person',
      placeholder: 'Select person',
      items: persons.sort(),
      selectedItem: c.person,
      unselect: '— None —'
    });

    var characterTagfieldItem = new Tagfield(characterTagfield.get(0), {
      label: 'Role(s)',
      placeholder: 'Select Role(s)',
      items: roles,
      createTags: false,
      initialItems: c.role
    });

    return castRow;
  }
}

function initCastSection(section) {
  function beforeAddCast(el) {
    //Create selectbox
    var personSelectItem = new Selectbox(el.find('.js-selectbox').get(0), {
      label: 'Person',
      placeholder: 'Select person',
      items: persons.sort(),
      unselect: '— None —'
    });

    //Create Tagfield
    var characterTagfieldItem = new Tagfield(el.find('.js-tagfield').get(0), {
      label: 'Role(s)',
      placeholder: 'Role(s)',
      items: persons.concat(characters).sort(),
      createTags: false
    });
  }
  function createEmptyCastRow () {
    var castRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),
    personWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
    personSelect = $('<div></div>').addClass('js-selectbox'),
    characterWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
    characterTagfield = $('<div></div>').addClass('js-tagfield'),
    asText = $('<span></span>').addClass('cast__textDivider').text('as');

    personWrapper.append(personSelect);
    characterWrapper.append(characterTagfield);
    castRow.append(personWrapper, asText, characterWrapper);

    return castRow;
  }

  var castRow = createEmptyCastRow();
  section.append(castRow);
  var addableObject = new Addable(castRow, {beforeAdd: beforeAddCast, sortable: true});
  addableObject.removeItem(0);
  addableObject._addItem(createEmptyCastRow(), beforeAddCast);

  return addableObject;
}

function showCastImport() {
  $('#importCastSection').removeClass('hidden');
}
function hideCastImport() {
  $('#importCastSection').addClass('hidden');
}

//Collection initialization
// data
var collectionItems = [
    {
        title: 'Evil Handmade Instrument',
        id: 1,
        description: 'Photo from the episode "Evil Handmade Instrument"',
        type: 'gallery',
        series: 'Blindspot',
        subtitle: 'Gallery | Blindspot',
        img: 'img/doodle/aztec_temple.png',
        target: 'create-gallery.html'
    },
    {
        title: 'Authentic Flirt',
        id: 2,
        description: 'Photo from the episode "Authentic Flirt"',
        type: 'gallery',
        series: 'Blindspot',
        subtitle: 'Gallery | Blindspot',
        img: 'img/doodle/big_ben.png',
        target: 'create-gallery.html'
    },
    {
        title: 'Persecute Envoys',
        id: 3,
        description: 'Photo from the episode "Persecute Envoys"',
        type: 'gallery',
        series: 'Blindspot',
        subtitle: 'Gallery | Blindspot',
        img: 'img/doodle/christ_the_redeemer.png',
        target: 'create-gallery.html'
    },
    {
        title: 'Sent on Tour',
        id: 4,
        description: 'Photo from the episode "Sent on Tour"',
        type: 'gallery',
        series: 'Blindspot',
        subtitle: 'Gallery | Blindspot',
        img: 'img/doodle/colosseum.png',
        target: 'create-gallery.html'
    },
    {
        title: 'Cede Your Soul',
        id: 5,
        description: 'Photo from the episode "Cede Your Soul"',
        type: 'gallery',
        series: 'Blindspot',
        subtitle: 'Gallery | Blindspot',
        img: 'img/doodle/easter_island.png',
        target: 'create-gallery.html'
    },
    {
        title: 'Split The Law',
        id: 6,
        description: 'Photo from the episode "Split The Law"',
        type: 'gallery',
        series: 'Blindspot',
        subtitle: 'Gallery',
        img: 'img/doodle/pyramids.png',
        target: 'create-gallery.html'
    },
    {
        title: 'Bone May Rot',
        id: 7,
        description: 'Photo from the episode "Bone May Rot"',
        type: 'gallery',
        series: 'Blindspot',
        subtitle: 'Gallery | Blindspot',
        img: 'img/doodle/san_franciso_bridge.png',
        target: 'create-gallery.html'
    },
    {
        title: 'Eight Slim Grins',
        id: 8,
        description: 'Photo from the episode "Eight Slim Grins"',
        type: 'gallery',
        series: 'Blindspot',
        subtitle: 'Gallery | Blindspot',
        img: 'img/doodle/stone_henge.png',
        target: 'create-gallery.html'
    },
    {
        title: 'A Stray Howl',
        id: 9,
        description: 'Photo from the episode "A Stray Howl"',
        type: 'gallery',
        series: 'Blindspot',
        subtitle: 'Gallery | Blindspot',
        img: 'img/doodle/sydney_opera_house.png',
        target: 'create-gallery.html'
    },
    {
        title: 'A Stray Howl',
        id: 10,
        type: 'episode',
        subtype: 'episode',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: 'img/doodle/taj_mahal.png',
        target: 'create-episode.html'
    },
    {
        title: 'Eight Slim Grins',
        id: 11,
        type: 'episode',
        subtype: 'episode',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: 'img/doodle/windmill.png',
        target: 'create-episode.html'
    },
    {
        title: 'Bone May Rot',
        id: 12,
        type: 'episode',
        subtype: 'episode',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: 'img/doodle/tree_1.png',
        target: 'create-episode.html'
    },
    {
        title: 'Split The Law',
        id: 13,
        type: 'episode',
        subtype: 'episode',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: 'img/doodle/tree_2.png',
        target: 'create-episode.html'
    },
    {
        title: 'Jane\'s Tattoo Backstory: Episode 10',
        id: 14,
        type: 'video',
        subtype: 'web exclusive',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: 'img/doodle/tree_3.png',
        target: 'create-episode.html'
    },
    {
        title: 'Jane\'s Tattoo Backstory: Episode 9',
        id: 15,
        type: 'video',
        subtype: 'web exclusive',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: 'img/doodle/tree_4.png',
        target: 'create-episode.html'
    },
    {
        title: 'Jane\'s Tattoo Backstory: Episode 8',
        id: 16,
        type: 'video',
        subtype: 'web exclusive',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: 'img/doodle/tree_5.png',
        target: 'create-episode.html'
    },
    {
        title: 'Jane\'s Tattoo Backstory: Episode 7',
        id: 17,
        type: 'video',
        subtype: 'web exclusive',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: 'img/doodle/tree_6.png',
        target: 'create-episode.html'
    },

    //Episodes
    {
        title: '1. Series Premiere',
        id: 18,
        description: 'A beautiful, naked amnesiac is found in a bag in Times Square, covered in fresh tattoos - one of which is the name of FBI Special Agent Kurt Weller.',
        type: 'episode',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: '',
        target: 'create-episode.html'
    },
    {
        title: '2. A Stray Howl',
        id: 19,
        description: 'While a tattoo sends the team after a drone pilot gone crazy, Weller seeks to confirm that Jane Doe is a missing person from his childhood.',
        type: 'episode',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: '',
        target: 'create-episode.html'
    },
    {
        title: '3. Eight Slim Grins',
        id: 20,
        description: 'After a run-in with the mysterious bearded man, Jane\'s SEAL tattoo leads to a violent gang of thieves - can they tell her who she is?',
        type: 'episode',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: '',
        target: 'create-episode.html'
    },
    {
        title: '4. Bone May Rot',
        id: 21,
        description: 'Matters of trust come to a head while while the team tries to prevent a global pandemic at the CDC; test results put Jane\'s identity in question.',
        type: 'episode',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: '',
        target: 'create-episode.html'
    },
    {
        title: '5. Split The Law',
        id: 22,
        description: 'The FBI faces off with the CIA while hunting a dirty bomber; Jane remembers a disturbing childhood memory.',
        type: 'episode',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: '',
        target: 'create-episode.html'
    },
    {
        title: '6. Cede Your Soul',
        id: 23,
        description: 'Jane and Weller struggle to keep their relationship professional while chasing a teen hacker who\'s created a killer app.',
        type: 'episode',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: '',
        target: 'create-episode.html'
    },
    {
        title: '7. Sent on Tour',
        id: 24,
        description: 'Mayfair\'s secrets begin to unravel as the team takes on a secessionist militia guarding Saúl Guerrero. Lou Diamond Phillips guest stars.',
        type: 'episode',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: '',
        target: 'create-episode.html'
    },
    {
        title: '8. Persecute Envoys',
        id: 25,
        description: 'Mayfair comes clean about Daylight; one of Jane\'s tattoos sets the team after a Brooklyn cop killer.',
        type: 'episode',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: '',
        target: 'create-episode.html'
    },
    {
        title: '9. Authentic Flirt',
        id: 26,
        description: 'Mayfair struggles to keep Daylight under wraps as Jane and Weller go undercover as man and wife.',
        type: 'episode',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: '',
        target: 'create-episode.html'
    },
    {
        title: '10. Evil Handmade Instrument',
        id: 27,
        description: 'The hunt for David\'s murderer wakens a horde of Russian sleeper agents.',
        type: 'episode',
        series: 'Blindspot',
        subtitle: 'Episode | Blindspot',
        img: '',
        target: 'create-episode.html'
    },

    // Slasher content
    {
        title: 'Slasher_hero_1.png',
        id: 28,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'image',
        series: 'Slasher',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher_hero_2.png',
        id: 29,
        description: 'Brandon Jay McLaren (Graceland) stars as Dylan.',
        type: 'image',
        series: 'Slasher',
        img: 'img/doodle/Alex.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher_hero_3.png',
        id: 30,
        description: 'Wendy Crewson (Revenge) stars as Brenda Merritt.',
        type: 'image',
        series: 'Slasher',
        img: 'img/doodle/aztec_temple.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher-sneakpeek',
        id: 31,
        description: 'Slasher-sneakpeek video for series premiere.',
        type: 'video',
        series: 'Slasher',
        img: 'img/doodle/Garry.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher-cast',
        id: 32,
        description: 'Cast collection for Slasher season 1.',
        type: 'cast',
        series: 'Slasher',
        img: '',
        target: 'create-gallery.html'
    },
    {
        title: 'Slasher-preview-gallery',
        id: 33,
        description: 'Photo from the episode series premiere.',
        type: 'gallery',
        series: 'Slasher',
        img: 'img/doodle/pyramids.png',
        target: 'create-gallery.html'
    },
    {
        title: 'Slasher-trailer',
        id: 34,
        description: 'Slasher: New Series Coming Soon',
        type: 'video',
        series: 'Slasher',
        img: 'img/doodle/easter_island_2.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher - Episode 2',
        id: 28,
        description: 'See a sneak preview of next weeks episode',
        type: 'image',
        series: 'Slasher',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher - Meet The Cast',
        id: 28,
        description: 'See brand new videos of the full Slasher cast behind the scenes!',
        type: 'image',
        series: 'Slasher',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher - Episode 4',
        id: 28,
        description: 'Watch the latest episode of Slasher on your computer and mobile devices.',
        type: 'image',
        series: 'Slasher',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },

    // Haven episodes

];

var collections = [
    {
        title: 'Blindspot — header 1',
        id: 101,
        description: 'Header images for Blindspot',
        type: 'collection',
        assets: 3,
        target: 'create-collection.html'
    },
    {
        title: 'Blindspot — middle page',
        id: 102,
        description: 'Middle part collection for Blindspot series',
        type: 'collection',
        assets: 8,
        target: 'create-collection.html'
    },
    {
        title: 'Blindspot — hero collection',
        id: 103,
        description: 'This is the collection for hero carousel for Blindspot',
        type: 'collection',
        assets: 4,
        target: 'create-collection.html'
    },
    {
        title: 'Blindspot — hero collection - 2',
        id: 104,
        description: 'This is the collection for hero carousel for Blindspot #2',
        type: 'collection',
        assets: 2,
        target: 'create-collection.html'
    },
    {
        title: 'Blindspot — hero collection - 3',
        id: 105,
        description: 'This is the collection for hero carousel for Blindspot #3',
        type: 'collection',
        assets: 8,
        target: 'create-collection.html'
    },
    {
        title: 'Slasher Hero Carousel',
        id: 106,
        description: ' A carousel of 3 images for Slasher’s hero spot.',
        type: 'collection',
        assets: 3,
        target: 'create-collection.html'
    },
    {
        title: 'Slasher Body content',
        id: 107,
        description: 'A curated collection for promoted contents on the main page of Slasher.',
        type: 'collection',
        assets: 4,
        target: 'create-collection.html'
    },
    {
        title: 'Jane\'s tattoo backstory',
        id: 108,
        description: 'Collection of videos with Jane\'s tattoos.',
        type: 'collection',
        assets: 4,
        target: 'create-collection.html'
    },
    {
        title: 'Inside The Expanse: Episode 8',
        id: 109,
        description: 'The cast and showrunners talk Season 1, Episode 8.',
        type: 'collection',
        assets: 6,
        target: 'create-collection.html'
    },
    {
        title: 'Inside the Expanse: Episode 7',
        id: 110,
        description: 'The cast and showrunners talk Season 1, Episode 7.',
        type: 'collection',
        assets: 6,
        target: 'create-collection.html'
    },
    {
        title: 'Inside the Expanse: Episode 6',
        id: 111,
        description: 'The cast and showrunners talk Season 1, Episode 6.',
        type: 'collection',
        assets: 6,
        target: 'create-collection.html'
    },
    {
        title: 'Magicians Hero',
        id: 112,
        type: 'collection',
        assets: 3,
        target: 'create-collection.html'
    },
    {
        title: 'Magicians backstage',
        id: 113,
        description: 'Magicians backstage photos, cast talks and videos.',
        type: 'collection',
        assets: 10,
        target: 'create-collection.html'
    },
    {
        title: 'Bitten Series Hero',
        id: 114,
        type: 'collection',
        assets: 3,
        target: 'create-collection.html'
    },
    {
        title: 'Bitten Season 3 Hero',
        id: 115,
        type: 'collection',
        assets: 3,
        target: 'create-collection.html'
    },
    {
        title: 'Bitten Season 3 footer',
        id: 116,
        type: 'collection',
        assets: 8,
        target: 'create-collection.html'
    },
    {
        title: 'Bitten Season 2 Hero',
        id: 117,
        type: 'collection',
        assets: 3,
        target: 'create-collection.html'
    },
    {
        title: 'Bitten Season 2 footer',
        id: 118,
        type: 'collection',
        assets: 8,
        target: 'create-collection.html'
    },
    {
        title: 'Bitten Season 1 Hero',
        id: 119,
        type: 'collection',
        assets: 3,
        target: 'create-collection.html'
    },
    {
        title: 'Bitten Season 1 footer',
        id: 119,
        type: 'collection',
        assets: 8,
        target: 'create-collection.html'
    },

    // Haven
    {
        title: 'Haven Series Hero',
        id: 120,
        type: 'collection',
        assets: 3,
        target: 'create-collection.html'
    },
    {
        title: 'Haven Season 5 Hero',
        id: 121,
        type: 'collection',
        assets: 3,
        target: 'create-collection.html'
    },
    {
        title: 'Haven Season 5 left side',
        id: 122,
        type: 'collection',
        assets: 5,
        target: 'create-collection.html'
    },
    {
        title: 'Haven Season 4 Hero',
        id: 123,
        type: 'collection',
        assets: 3,
        target: 'create-collection.html'
    },
    {
        title: 'Haven Season 4 left side',
        id: 124,
        type: 'collection',
        assets: 6,
        target: 'create-collection.html'
    },
    {
        title: 'Haven Season 3 Hero',
        id: 125,
        type: 'collection',
        assets: 3,
        target: 'create-collection.html'
    },
    {
        title: 'Haven Season 3 left side',
        id: 126,
        type: 'collection',
        assets: 4,
        target: 'create-collection.html'
    },
    {
        title: 'Haven Season 2 Hero',
        id: 127,
        type: 'collection',
        assets: 3,
        target: 'create-collection.html'
    },
    {
        title: 'Haven Season 2 left side',
        id: 128,
        type: 'collection',
        assets: 5,
        target: 'create-collection.html'
    },
    {
        title: 'Haven Season 1 Hero',
        id: 129,
        type: 'collection',
        assets: 3,
        target: 'create-collection.html'
    },
    {
        title: 'Haven Season 1 left side',
        id: 130,
        type: 'collection',
        assets: 4,
        target: 'create-collection.html'
    }
];

var pageCollections = [
    {
        title: 'Blindspot Series Page',
        id: 1001,
        description: 'Collection for Blindspot\' series page: hero, left-side and footer',
        type: 'collection group',
        assets: 3,
        target: 'create-masterCollection.html'
    },
    {
        title: 'Blindspot Season Page',
        id: 1002,
        description: 'Collection for Blindspot\' season page: hero and footer.',
        type: 'collection group',
        assets: 2,
        target: 'create-masterCollection.html'
    },
    {
        title: 'The Blacklist Series Page',
        id: 1003,
        description: 'Collection for The Blacklist\' series page: hero and left-side.',
        type: 'collection group',
        assets: 2,
        target: 'create-masterCollection.html'
    },
    {
        title: 'The Blacklist Episode Page',
        id: 1004,
        description: 'Collection for The Blacklist\' episode page: hero, left-side and footer.',
        type: 'collection group',
        assets: 3,
        target: 'create-masterCollection.html'
    },
    {
        title: 'Slasher Page',
        id: 1005,
        description: 'Collection for Slasher’s series main page.',
        type: 'collection group',
        assets: 2,
        target: 'create-masterCollection.html'
    },
    {
        title: 'Haven Page',
        id: 1006,
        description: 'Collection for Haven\'s series main page.',
        type: 'collection group',
        assets: 3,
        target: 'create-masterCollection.html'
    },
    {
        title: 'Haven Episode Page',
        id: 1007,
        description: 'Collection for Haven\' episode page',
        type: 'collection group',
        assets: 4,
        target: 'create-masterCollection.html'
    },
    {
        title: 'Suits Page',
        id: 1008,
        description: 'Collection for Suits\'s series main page.',
        type: 'collection group',
        assets: 3,
        target: 'create-masterCollection.html'
    },
    {
        title: 'Colony Page',
        id: 1009,
        description: 'Collection for Colony\'s series main page.',
        type: 'collection group',
        assets: 3,
        target: 'create-masterCollection.html'
    },
    {
        title: 'Girlfriends Guide to Divorce Page',
        id: 1010,
        description: 'Collection for Girlfriends Guide to Divorce\'s series main page.',
        type: 'collection group',
        assets: 3,
        target: 'create-masterCollection.html'
    }
];

function createItemRow(c) {
    var itemRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),
        itemWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
        itemSelect = $('<div></div>').addClass('js-selectbox');

    itemWrapper.append(itemSelect);
    itemRow.append(itemWrapper);
    var collectionSelectItem = itemSelectbox(itemSelect.get(0));
    return itemRow;
}

function itemSelectbox(el, data, callback, itemLabel) {
    var itemsData = data || collectionItems,
        itemCallback = callback || handleItemmClick;

    return new Selectbox(el, {
        label: itemLabel || 'Item',
        placeholder: itemLabel ? 'Select ' + itemLabel : 'Select Item',
        items: itemsData
            .sort(function(a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
            })
            .map(createListItem),
        complexItems: true,
        sideNav: true,
        itemCallback: itemCallback,
        data: itemsData,
        search: true
    });
}

function handleItemmClick(item, selectbox) {
    var id = parseInt($(item).find('.selectbox__list-item-title').attr('id').split('-')[1]),
        data = selectbox.options.data || collectionItems;
    var collectionItem = createCollectionItem(data.filter(function(item) {
            return item.id === id;
        })[0]);
    var addableItem = $(selectbox.selectWrapper).parents('.c-Addable-item');
    addableItem.empty().append(collectionItem);
    collectionItem.parents('.c-Addable-row').addClass('c-Addable-row--collection');
}

function createCollectionItem(item) {
    var collItem = $('<div></div>').addClass('collection-item is-appearing js-hasValue'),
        collItemWrapper = $('<div></div>').addClass('collection-item__wrapper'),
        //collItemImage = $('<div></div>').addClass('collection-item__image is-empty'),
        collItemTitle = $('<div></div>').addClass('collection-item__title').text(item.title),
        itemInfo = item.type.charAt(0).toUpperCase() + item.type.slice(1),
        collItemInfo = $('<div></div>').addClass('collection-item__info'),
        collItemDescription = $('<div></div>').addClass('collection-item__description'),
        collItemEditButton = $('<button></button>').addClass('button button_style_outline-gray collection-item__edit').text('Edit');

    /*if (item.img) {
        collItemImage.css('background-image', 'url(' + item.img + ')').removeClass('is-empty');
    }*/
    /*switch (item.type) {
        case 'video':
            collItemTypeIcon = $('<div><i class="fa fa-video-camera"></i></div>').addClass('collection-item__type');
            collItemImage.append(collItemTypeIcon);
            break;
        case 'gallery':
            collItemTypeIcon = $('<div><i class="fa fa-picture-o"></i></div>').addClass('collection-item__type');
            collItemImage.append(collItemTypeIcon);
            break;
        case 'episode':
            collItemTypeIcon = $('<div></div>').addClass('collection-item__type collection-item__type--image collection-item__type--episode');
            collItemImage.append(collItemTypeIcon);
            break;

        case 'cast':
            collItemTypeIcon = $('<div><i class="fa fa-users"></i></div>').addClass('collection-item__type');
            collItemImage.append(collItemTypeIcon);
            break;

        case 'collection':
            collItemImage = undefined;
            if (item.assets) {itemInfo = itemInfo + ' | ' + item.assets.toString() + ' assets';}
            break;

        case 'collection group':
            collItemImage = undefined;
            if (item.assets) {itemInfo = itemInfo + ' | ' + item.assets.toString() + ' collections';}
            break;

        default:
            break;
    }
    collItem.append(collItemImage);*/

    collItemWrapper.append(collItemTitle);

    /*if (item.description) {
        collItemDescription.text(item.description);
        collItemWrapper.append(collItemDescription);
    }*/

    /*if (item.subtype) {
        itemInfo = itemInfo + ' (' + item.subtype + ')';
    }
    if (item.series) {
        itemInfo = itemInfo + ' | ' + item.series;
    }*/
    collItemInfo.text(itemInfo);
    collItemWrapper.append(collItemInfo);
    collItem.append(collItemWrapper);

    /*if (item.target) {
        collItemEditButton.click(function(e) {
            window.open(item.target,'_blank');
        });
        collItem.append(collItemEditButton);
    }*/

    return collItem;
}

function createListItem(item) {
    var listItem = $('<div></div>'),
        itemSubtitle = item.type.charAt(0).toUpperCase() + item.type.slice(1),
        listItemTitle = $('<div></div>').addClass('selectbox__list-item-title').text(item.title).attr('id', 'collectionItem-' + item.id),
        listItemSubtitle = $('<div></div>').addClass('selectbox__list-item-subtitle'),
        listItemTypeIcon;

    /*switch (item.type) {
        case 'video':
            listItemTypeIcon = $('<div><i class="fa fa-video-camera"></i></div>').addClass('selectbox__list-item-type');
            listItem.append(listItemTypeIcon);
            break;

        case 'gallery':
            listItemTypeIcon = $('<div><i class="fa fa-picture-o"></i></div>').addClass('selectbox__list-item-type');
            listItem.append(listItemTypeIcon);
            break;

        case 'episode':
            listItemTypeIcon = $('<div><i class="fa fa-file-video-o"></i></div>').addClass('selectbox__list-item-type');
            listItem.append(listItemTypeIcon);
            break;

        case 'image':
            listItemTypeIcon = $('<div><i class="fa fa-camera"></i></div>').addClass('selectbox__list-item-type');
            listItem.append(listItemTypeIcon);
            break;

        case 'cast':
            listItemTypeIcon = $('<div><i class="fa fa-users"></i></div>').addClass('selectbox__list-item-type');
            listItem.append(listItemTypeIcon);
            break;

        default:
            break;
    }*/

    /*if (item.subtype) {
        itemSubtitle = itemSubtitle + ' (' + item.subtype + ')';
    }*/
    /*if (item.series) {
        itemSubtitle = itemSubtitle + ' | ' + item.series;
    }
    if (item.assets) {
        itemSubtitle = itemSubtitle + ' | ' + item.assets.toString();
        if (item.type === 'collection group') {itemSubtitle = itemSubtitle + ' collections';}
        else {itemSubtitle = itemSubtitle + ' assets';}
    }*/
    listItemSubtitle.text(itemSubtitle);
    listItem.append(listItemTitle, listItemSubtitle);



    /*if (item.img) {
        var listItemImage = $('<div></div>').addClass('selectbox__list-item-image').css('background-image', 'url(' + item.img + ')');



        listItem.append(listItemImage);
    }*/

    return listItem.get(0).innerHTML;
}

function initCollSection(section, data, itemLabel) {
    function beforeAddCollection(el) {
        var collectionSelectItem = itemSelectbox(el.find('.js-selectbox').get(0), data, null, itemLabel);
    }

    function createEmptyCollRow () {
        var itemRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),
            itemWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
            itemSelect = $('<div></div>').addClass('js-selectbox');

            itemWrapper.append(itemSelect);
            return itemRow.append(itemWrapper);
    }

    var collRow = createEmptyCollRow();
    section.append(collRow);
    var addableObject = new Addable(collRow, {beforeAdd: beforeAddCollection, placeholder: 'c-Addable-rowPlaceholder--collection', sortable: true});
    addableObject.removeItem(0);
    addableObject._addItem(createEmptyCollRow(), beforeAddCollection);

    return addableObject;
}

function replaceSelectboxWithCollectionRow(item, selectbox) {
    var id = parseInt($(item).find('.selectbox__list-item-title').attr('id').split('-')[1]),
        data = selectbox.options.data || collectionItems,
        collectionItem = createCollectionItem(data.filter(function(item) {
            return item.id === id;
        })[0]);

    //Create DOM elements
    var collectionRow = $('<div></div>').addClass('collection-row js-collectionRow'),
        collectionItemWrapper = $('<div></div>').addClass('collection-row__item-wrapper'),
        collectionRemoveButton = $('<button></button>').addClass('button--round button_style_outline-gray button--remove collection-row__button js-collectionRemoveButton').click(handleRemoveCollectionRow);

    collectionItemWrapper.append(collectionItem);
    collectionRow.append(collectionItemWrapper, collectionRemoveButton);

    //Insert new elements in DOM and remove list
    collectionRow.insertBefore(selectbox.selectWrapper);
    selectbox.selectWrapper.remove();
}

function handleRemoveCollectionRow(e) {
    var collectionRow = $(e.target).parents('.js-collectionRow'),
        collectionSelect = $('<div></div>').addClass('js-selectbox');

    collectionSelect.insertBefore(collectionRow);
    collectionRow.remove();

    var collectionSelectItem = new Selectbox(collectionSelect.get(0), {
        label: 'Collection',
        placeholder: 'Select Collection',
        items: pageCollections
            .sort(function(a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
            })
            .map(createListItem),
        complexItems: true,
        sideNav: true,
        itemCallback: replaceSelectboxWithCollectionRow,
        data: pageCollections,
        search: true
    });
}

function initOneCollectionSection(section, data, label) {
    var collectionSelect = $('<div></div>').addClass('js-selectbox');
    var items = data || pageCollections;
    section.append(collectionSelect);

    var collectionSelectItem = new Selectbox(collectionSelect.get(0), {
        label: label || 'Collection Group',
        items: items
            .sort(function(a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
            })
            .map(createListItem),
        complexItems: true,
        sideNav: true,
        itemCallback: replaceSelectboxWithCollectionRow,
        data: items,
        search: true,
        unselect: -1
    });
}

//Association initialization
// data
var dataSeries = [
    //Syfy
    '12 Monkeys',
    'Battlestar Galactica',
    'Bitten',
    'Channel Zero: Candle Cove',
    'Childhoods End',
    'Close Up Kings',
    'Dark Matter',
    'Defiance',
    'Dominion',
    'Face Off',
    'Ghost Hunters',
    'Haunting',
    'Haven',
    'Hunters',
    'Killjoys',
    'Lavalantula',
    'Lost Girl',
    'Olympus',
    'Paranormal Witness',
    'Sharknado',
    'Sharknado 2',
    'Sharknado 3',
    'The Expanse',
    'The Internet Ruined My Life',
    'The Magicians',
    'Troy: Street Magic',
    'Van Helsing',
    'Wynonna Earp',
    'Z Nation',

    //Chiller
    'Slasher',

    //NBC
    'Blindspot',
    'The Blacklist'
];

var dataSeasons = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07'
];

var dataEpisodes = [
    '1. A New Visitor',
    '2. The Man in the Shadows',
    '3. The First Slice',
    '4. The Blood Moon',
    '5. Don’t Get Lost',
    '6. All Alone'
];

function importSeries() {
  var creditSection = $('#creditSection'),
  castSection = $('#castSection'),
  seasonHasCast = creditSection.find('.js-hasValue').length > 0 || castSection.find('.js-hasValue').length > 0; //CHeck if credit section or cast section have filled fields or selectboxes or tagfields

  if (seasonHasCast) {
    new Modal({
      title: 'Import Cast & Credit?',
      text: 'The new Cast & Credit will overwrite and replace the existing Cast & Credit information. Are you sure you would like to import?',
      confirmText: 'Import',
      confirmAction: loadCast,
      dialog: true
    });
  } else {
    loadSeries();
  }
}

function loadSeries() {
  var castSection = $('#castSection'),
  castSectionBody = castSection.find('.controls__group'),
  creditSection = $('#creditSection'),
  creditSectionBody = creditSection.find('.controls__group'),
  cast = castAndCredit.cast,
  credit = castAndCredit.credit;

  castSectionBody.empty();
  creditSectionBody.empty();

  createCastSection(cast, castSectionBody);
  createCreditSection(credit, creditSectionBody);

  hideCastImport();
}

function createPageSection(credit, section) {
  var addableRow = createPageRow({Link: ''});

  section.append(addableRow);
  addableObject = new Addable(addableRow);
  addableObject.removeItem(0);

  credit.forEach(function(c) {
    addableObject._addItem(createPageRow(c));
  });

  function createPageRow(c) {
    var creditRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),
    roleWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
    roleField = $('<input type="text"/>').addClass('input_style_light').val(c.role),
    namesField = $('<textarea></textarea>').addClass('input_style_light').val(c.names),
    namesWrapper = $('<div></div>').addClass('cg__control cg__control_style_row');

    //namesField.elastic();
    roleWrapper.append(roleField);
    namesWrapper.append(namesField);
    creditRow.append(roleWrapper, namesWrapper);
    new Textfield(roleField.get(0), {
      label: 'Title',
      helpText: 'e.g Producer, Costume'
    });
    new Textfield(namesField.get(0), {label: 'Name(s)'});
    $(namesWrapper).find('textarea').elastic();

    return creditRow;
  }
}

function initPageSection(section, data) {
  var addableRow = createPageLinkRow('');
  section.append(addableRow);
  addableObject = new Addable(addableRow);
}

function createPageLinkRow(link) {
  var pageRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),
  pageWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
  linkField = $('<input type="text"/>').addClass('input_style_light').val(link);

  pageWrapper.append(linkField);
  pageRow.append(pageWrapper);
  new Textfield(linkField.get(0), {
    label: 'Link',
    helpText: 'Fusce sodales finibus auctor. Nunc ipsum turpis, porttitor non sem id, luctus tincidunt diam.'
  });

  return pageRow;
}

function initSeriesSection(section) {
  function beforeAddSeries(el) {
    //Create selectbox
    var seriesSelectItem = new Selectbox(el.find('.js-selectbox.js-seriesSelect').get(0), {
      label: 'Series or Event',
      placeholder: 'Select Series or Event',
      items: dataSeries.sort(),
      unselect: '— None —'
    });

    var seasonSelectItem = new Selectbox(el.find('.js-selectbox.js-seasonSelect').get(0), {
      label: 'Season',
      placeholder: 'Select Season',
      items: dataSeasons.sort(function(a, b) {
        return a < b ? 1 : a > b ? -1 : 0;
      }),
      unselect: '— None —'
    });

    var episodeSelectItem = new Selectbox(el.find('.js-selectbox.js-episodeSelect').get(0), {
      label: 'Episode',
      placeholder: 'Select Episode',
      items: dataEpisodes.sort(function(a, b) {
        return a < b ? 1 : a > b ? -1 : 0;
      }),
      unselect: '— None —'
    });
  }

  function createEmptySeriesRow () {
    var seriesRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),

    seriesWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
    seriesSelect = $('<div></div>').addClass('js-selectbox js-seriesSelect').css('min-width', '100px'),

    seasonWrapper = $('<div></div>').addClass('cg__control cg__control_style_row').css('max-width', 60),
    seasonSelect = $('<div></div>').addClass('js-selectbox js-seasonSelect'),

    episodeWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
    episodeSelect = $('<div></div>').addClass('js-selectbox js-episodeSelect').css('min-width', '90px');

    seriesWrapper.append(seriesSelect);
    seasonWrapper.append(seasonSelect);
    episodeWrapper.append(episodeSelect);
    seriesRow.append(seriesWrapper, seasonWrapper, episodeWrapper);

    return seriesRow;
  }

  var seriesRow = createEmptySeriesRow();
  section.append(seriesRow);
  var addableObject = new Addable(seriesRow, {beforeAdd: beforeAddSeries});
  addableObject.removeItem(0);
  addableObject._addItem(createEmptySeriesRow(), beforeAddSeries);

  return addableObject;
}


//Stickable
function Stickable(el, options) {
    this.el = el;
    this.options = options;

    this._init();
}

Stickable.prototype._init = function() {
    var self = this;
    self.boundary = self.options.boundary ? self.options.boundary === true ? self.el.parentNode : document.querySelector(self.options.boundary) : undefined;
    self.offset = self.options.offset || 0;

    function handleScroll() {
        var elementRect = self.el.getBoundingClientRect(),
            elementBottomOffset = elementRect.top + elementRect.height;


        if ((self.options.maxWidth && window.innerWidth <= self.options.maxWidth) || !self.options.maxWidth) {
            if (!self.el.classList.contains('is-stuck')) {
                if (elementRect.top - self.options.offset < 0) {
                    self.elementOffsetParent = self.el.offsetParent;
                    self.initialOffset = self.el.offsetTop;
                    self.el.classList.add(self.options.class || 'is-stuck');
                    self.el.style.position = 'fixed';
                    self.el.style.top = self.offset.toString() + 'px';

                }
            } else {
                var elementOffsetParentRect = self.elementOffsetParent.getBoundingClientRect();
                if (self.boundary) {
                    var boundaryRect = self.boundary.getBoundingClientRect(),
                        boundaryBottomOffset = boundaryRect.top + boundaryRect.height;

                    if (elementBottomOffset > boundaryBottomOffset || elementRect.top < self.options.offset) {
                        self.el.style.top = Math.round(boundaryBottomOffset - elementRect.height).toString() + 'px';
                    } else if (elementRect.top > self.offset) {
                        self.el.style.top = self.offset.toString() + 'px';
                    }
                }
                if (self.offset < self.initialOffset + elementOffsetParentRect.top) {
                    self.el.classList.remove('is-stuck');
                    self.el.style.position = '';
                    self.el.style.top = '';
                }
            }

        }
    }

    function handleResize() {
        if (window.innerWidth > self.options.maxWidth) {
            self.el.classList.remove('is-stuck');
            self.el.style.position = '';
            self.el.style.top = '';
        } else {
            handleScroll();
        }
    }

    window.addEventListener("optimizedScroll", handleScroll);
    window.addEventListener("optimizedResize", handleResize);
};

//Required Fields
function normalizeRequiredCount() {
    $('.js-requiredCount').each(function(index, el) {
        var card = $(el).parents('.card'),
            cardId = card.attr('id'),
            emptyRequiredFieldsCount = card.find('.js-required').length - card.find('.js-required.js-hasValue').length,
            navItem = $('.js-scrollSpyNav .js-scrollNavItem[data-href="' + cardId + '"]');

        if (emptyRequiredFieldsCount > 0) {
            navItem.addClass('is-required');
            $(el).text(emptyRequiredFieldsCount);
        } else {
            navItem.removeClass('is-required');
            $(el).text('');
        }
    });
}


//Pagination
function Pagination(el, store, updateFunction) {
    this.el = el;
    this.store = store;
    this.update = updateFunction;

    this._init();
}

Pagination.prototype._init = function() {
    var self = this;
    renderPagination();

    function handlePageClick(e) {
        var target = e.target.dataset.target || e.target.parentNode.dataset.target;
        switch (target) {
            case 'prev':
                self.store.setPage(self.store.page - 1 < 0 ? 0 : self.store.page - 1);
                break;
            case 'next':
                self.store.setPage(self.store.page + 1 === self.store.pagesNumber() ? self.store.pagesNumber() - 1 : self.store.page + 1);
                break;
        }

        self.update($('#libraryBody'), self.store, renderContentRow);
        renderPagination();
    }

    function renderPagination() {
        var links = $('<ul></ul>').addClass('pagination__list');
        self.el.empty();

        console.log(self.store.pagesNumber());

        if (self.store.pagesNumber() > 1) {
            //Prev
            var prevLink = $('<li><i class="fa fa-angle-left"></i></li>').addClass('pagination__prev').attr('data-target', 'prev').click(handlePageClick);
            if (self.store.page === 0) {prevLink.addClass('is-disabled');}
            links.append(prevLink);

            //Current page indicator
            //var currentPage = $('<li></li>').addClass('pagination__current').text(self.store.page + 1);
            //links.append(currentPage);

            //Next
            var nextLink = $('<li><i class="fa fa-angle-right"></i></li>').addClass('pagination__next').attr('data-target', 'next').click(handlePageClick);
            if (self.store.page === self.store.pagesNumber() - 1) {nextLink.addClass('is-disabled');}
            links.append(nextLink);

            self.el.append(links);
        }

        return self.el;
    }

};

//Post
function initPostList(el) {
  el.append(renderPostList());

  el.find('textarea').elastic();
  normilizeSection();
}

//Render
function renderPostList() {
  var list = $('<div />').addClass('sections-list'),
      addIcon = $('<i class="fa fa-plus-circle" />'),
      addText = $('<span> Add Section</span>'),
      addSection = $('<button />').addClass('button button_style_transparent-gray sections-list__add-section').click(handleAddSection).append(addIcon, addText),
      section = renderSection(1)

  return list.append(section, addSection);
}

function renderSection(index, data) {
  var section = $('<div />').addClass('list__section'),
      sectionIndex = $('<div />').addClass('section__index').text('Section ' + index),
      sectionRemove = $('<div />').addClass('section__remove is-hidden').click(handleRemoveSection),
      sectionHandler = $('<div />').addClass('section__handler');

  return section.append(sectionHandler, sectionIndex, sectionRemove, renderSectionContent(index, data))
}

function renderSectionContent(index, data) {
  var content = $('<div />').addClass('section__content'),
      title = $('<input type="text" />'),
      description = $('<textarea />'),
      toggleLabel = $('<label>Media Type</label>').addClass('c-label c-label--top'),
      toggleItem1 = $('<li data-target="link" data-index="'+ index+ '">Embeded Link</li>').addClass('active').click(handleAssetToggle),
      toggleItem2 = $('<li data-target="file" data-index="'+ index+ '">Add / Upload</li>').click(handleAssetToggle)
      toggleGroup = $('<ul data-section=' + index + '></ul>').addClass('radioToggle').append(toggleItem1, toggleItem2),
      link = $('<input type="text"/>'),
      placeholder = $('<div />').addClass('section__placeholder').attr('data-name', 'File');

  content.append(title.wrap('<div class="controls__group"></div>').parent(), description.wrap('<div class="controls__group"></div>').parent(), toggleLabel.wrap('<div class="controls__group controls__group--asset-toggle"></div>').parent().append(toggleGroup), link.wrap('<div class="controls__group"  id="sectionLink' + index + '"></div>').parent(), placeholder.wrap('<div class="controls__group controls__group--placeholder hidden" id="sectionPlaceholder' + index + '"></div>').parent());

  var setionTitleInput = new Textfield(title.get(0), {
    label: 'Section Title'
  });
  var setionDescriptionInput = new Textfield(description.get(0), {
    label: 'Section Text'
  });
  description.elastic();

  var setionLinkInput = new Textfield(link.get(0), {
    label: 'Embeded Link',
    placeholder: 'http://'
  });

  placeholderControl = new ImagePlaceholder(placeholder.get(0), null, {alButton: 'Add File'})

  return content;
}


//Handler
function handleAddSection(e) {
  var index = $(e.target).parents('.sections-list').find('.list__section').length + 1;
  var section = renderSection(index);
  $(e.target).before(section);
  section.find('textarea').elastic();
  normilizeSection();

}
function handleRemoveSection(e) {
  $(e.target).parent('.list__section').remove();
  normilizeSection();
}
function normilizeSection() {
  var length = $('.list__section').length;
  if (length >= 2) {
    $('.section__remove').removeClass('is-hidden')
  } else {
    $('.section__remove').addClass('is-hidden')
  }
  $('.list__section').each(function(index, el) {
    $(el).find('.section__index').text('Section ' + Math.round(index + 1))
  })
}

function handleAssetToggle(e) {
  $(e.target).parent().children().removeClass('active');
  $(e.target).addClass('active');
  switch (e.target.dataset.target) {
    case 'link':
      $('#sectionLink'+ e.target.dataset.index).removeClass('hidden');
      $('#sectionPlaceholder'+ e.target.dataset.index).addClass('hidden');
      break;

    case 'file':
      $('#sectionLink'+ e.target.dataset.index).addClass('hidden');
      $('#sectionPlaceholder'+ e.target.dataset.index).removeClass('hidden');
      break;
  }
}
//Page
function initPageList(el) {
  el.append(renderPageList());

  el.find('textarea').elastic();
  normilizeSection();
}

//Render
function renderPageList() {
  var list = $('<div />').addClass('sections-list'),
      addIcon = $('<i class="fa fa-plus-circle" />'),
      addText = $('<span> Add Section</span>'),
      addSection = $('<button />').addClass('button button_style_transparent-gray sections-list__add-section').click(handleAddPageSection).append(addIcon, addText),
      section = renderPageSection(1)

  return list.append(section, addSection);
}

function renderPageSection(index, data) {
  var section = $('<div />').addClass('list__section'),
      sectionIndex = $('<div />').addClass('section__index').text('Section ' + index),
      sectionRemove = $('<div />').addClass('section__remove is-hidden').click(handleRemovePageSection),
      sectionHandler = $('<div />').addClass('section__handler');

  return section.append(sectionHandler, sectionIndex, sectionRemove, renderPageSectionContent(index, data))
}

function renderPageSectionContent(index, data) {
  var content = $('<div />').addClass('section__content'),
      title = $('<input type="text" />'),
      description = $('<textarea />');

  content.append(title.wrap('<div class="controls__group"></div>').parent(), description.wrap('<div class="controls__group"></div>').parent());

  var setionTitleInput = new Textfield(title.get(0), {
    label: 'Section Title'
  });
  var setionDescriptionInput = new Textfield(description.get(0), {
    label: 'Section Text'
  });
  description.elastic();

  return content;
}


//Handler
function handleAddPageSection(e) {
  var index = $(e.target).parents('.sections-list').find('.list__section').length + 1;
  var section = renderPageSection(index);
  $(e.target).before(section);
  section.find('textarea').elastic();
  normilizeSection();

}
function handleRemovePageSection(e) {
  $(e.target).parent('.list__section').remove();
  normilizeSection();
}
function normilizeSection() {
  var length = $('.list__section').length;
  if (length >= 2) {
    $('.section__remove').removeClass('is-hidden')
  } else {
    $('.section__remove').addClass('is-hidden')
  }
  $('.list__section').each(function(index, el) {
    $(el).find('.section__index').text('Section ' + Math.round(index + 1))
  })
}

function handleAssetToggle(e) {
  $(e.target).parent().children().removeClass('active');
  $(e.target).addClass('active');
  switch (e.target.dataset.target) {
    case 'link':
      $('#sectionLink'+ e.target.dataset.index).removeClass('hidden');
      $('#sectionPlaceholder'+ e.target.dataset.index).addClass('hidden');
      break;

    case 'file':
      $('#sectionLink'+ e.target.dataset.index).addClass('hidden');
      $('#sectionPlaceholder'+ e.target.dataset.index).removeClass('hidden');
      break;
  }
}

//Global variables
var editedFilesData = [],
editedFileData = {},
classList = [],
dataChanged = false, //Changes when user make any changes on edit screen;
lastSelected = null, //Index of last Selected element for multi select;
galleryObjects = [],
draftIsSaved = false;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy9NZW51XG5mdW5jdGlvbiBub3JtaWxpemVNZW51KCkge1xuICB2YXIgcGFnZU5hbWUgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnLycpLnBvcCgpLFxuICBtZW51SXRlbXMgPSAkKCcuanMtbWVudSAuanMtbWVudUl0ZW0nKTtcbiAgYWN0aXZlTWVudUl0ZW0gPSAkKCdbZGF0YS10YXJnZXQ9XCInICsgcGFnZU5hbWUgKyAnXCJdJyk7XG5cbiAgbWVudUl0ZW1zLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKS5jbGljayhoYW5kbGVNZW51SXRlbUNsaWNrKTtcbiAgYWN0aXZlTWVudUl0ZW0uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICBhY3RpdmVNZW51SXRlbS5wYXJlbnRzKCcubWVudV9faXRlbScpLmFkZENsYXNzKCdpcy1vcGVuJyk7XG59XG5mdW5jdGlvbiBoYW5kbGVNZW51SXRlbUNsaWNrKGUpIHtcbiAgaWYgKCQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFyZ2V0JykpIHtcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignY3JlYXRlJykgPj0gMCAmJiAhZHJhZnRJc1NhdmVkICYmICQoJy5qcy1jb250ZW50IC5maWxlLCAuanMtY29udGVudCAuanMtaGFzVmFsdWUnKS5sZW5ndGggPiAwKSB7XG4gICAgICBuZXcgTW9kYWwoe1xuICAgICAgICB0aXRsZTogJ0xlYXZlIFBhZ2U/JyxcbiAgICAgICAgdGV4dDogJ1lvdSB3aWxsIGxvc2UgYWxsIHRoZSB1bnNhdmVkIGNoYW5nZXMuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBsZWF2ZSB0aGlzIHBhZ2U/JyxcbiAgICAgICAgY29uZmlybVRleHQ6ICdMZWF2ZSBQYWdlJyxcbiAgICAgICAgY29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhcmdldCcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhcmdldCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoJChlLnRhcmdldCkucGFyZW50cygnLm1lbnVfX2l0ZW0nKS5oYXNDbGFzcygnaXMtb3BlbicpKSB7XG4gICAgICAkKGUudGFyZ2V0KS5wYXJlbnRzKCcubWVudV9faXRlbScpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJy5tZW51X19pdGVtJykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICAgICQoZS50YXJnZXQpLnBhcmVudHMoJy5tZW51X19pdGVtJykuYWRkQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICB9XG4gIH1cbn1cblxuJCgnI21lbnVUb2dnbGUnKS5jbGljayhvcGVuTWVudSk7XG4kKCcuanMtbWVudSA+IC5qcy1jbG9zZScpLmNsaWNrKGNsb3NlTWVudSk7XG5cbmZ1bmN0aW9uIG9wZW5NZW51KGUpIHtcbiAgJCgnLmpzLW1lbnUnKS5hZGRDbGFzcygnaXMtb3BlbicpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2xvc2VNZW51KTtcbn1cbmZ1bmN0aW9uIGNsb3NlTWVudShlKSB7XG4gIGlmICgkKGUudGFyZ2V0KS5wYXJlbnRzKCcubWVudV9fbGlzdCcpLmxlbmd0aCA9PT0gMCkge1xuICAgICQoJy5qcy1tZW51JykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2xvc2VNZW51KTtcbiAgfVxufVxuXG4vL3NlbGVjdGlvblxuXG5mdW5jdGlvbiB0b2dnbGVGaWxlU2VsZWN0KGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR2YXIgZmlsZSA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJyksXG5cdFx0ZmlsZXNTZWN0aW9uID0gZmlsZS5wYXJlbnQoKSxcblx0XHRmaWxlcyA9IGZpbGVzU2VjdGlvbi5jaGlsZHJlbignLmZpbGUnKSxcblx0XHRzZWxlY3RlZEZpbGVzID0gZmlsZXNTZWN0aW9uLmNoaWxkcmVuKCcuZmlsZS5zZWxlY3RlZCcpLFxuXHRcdHNpbmdsZSA9IHNpbmdsZXNlbGVjdCB8fCBmYWxzZTtcblxuXHRpZiAoc2luZ2xlKSB7XG5cdFx0aWYgKGZpbGUuaGFzQ2xhc3MoJ3NlbGVjdGVkJykpIHtcblx0XHRcdGZpbGUucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZpbGVzU2VjdGlvbi5maW5kKCcuZmlsZScpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0ZmlsZS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Ly9DaGVjayBpZiB1c2VyIGhvbGQgU2hpZnQgS2V5XG5cdFx0aWYgKGUuc2hpZnRLZXkpIHtcblx0XHRcdGlmIChmaWxlLmhhc0NsYXNzKCdzZWxlY3RlZCcpKSB7XG5cdFx0XHRcdGZpbGUucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKHNlbGVjdGVkRmlsZXMpIHtcblx0XHRcdFx0XHR2YXIgZmlsZUluZGV4ID0gZmlsZS5pbmRleCgnLmZpbGUnKSxcblx0XHRcdFx0XHRcdGZpbGVzVG9CZVNlbGVjdCA9IGZpbGVzLnNsaWNlKGxhc3RTZWxlY3RlZCwgZmlsZUluZGV4ICsgMSk7XG5cblx0XHRcdFx0XHRpZiAobGFzdFNlbGVjdGVkID4gZmlsZUluZGV4KSB7XG5cdFx0XHRcdFx0XHRmaWxlc1RvQmVTZWxlY3QgPSBmaWxlcy5zbGljZShmaWxlSW5kZXgsIGxhc3RTZWxlY3RlZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZpbGVzVG9CZVNlbGVjdC5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHRcdFx0XHRmaWxlc1RvQmVTZWxlY3QucmVtb3ZlQ2xhc3MoJ2lzLXByZXNlbGVjdGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ZmlsZS50b2dnbGVDbGFzcygnc2VsZWN0ZWQgaXMtcHJlc2VsZWN0ZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGZpbGUudG9nZ2xlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0fVxuXHRcdGxhc3RTZWxlY3RlZCA9IGZpbGUuaW5kZXgoKTtcblx0XHRub3JtYWxpemVTZWxlY3RlaW9uKCk7XG5cdH1cbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZVNlbGVjdGVpb24oKSB7XG5cdHZhciBidWxrRGVsZXRlQnV0dG9uID0gJCgnI2J1bGtSZW1vdmUnKSxcblx0XHRidWxrRWRpdEJ1dHRvbiA9ICQoJyNidWxrRWRpdCcpLFxuXHRcdG11bHRpRWRpdEJ1dHRvbiA9ICQoJyNtdWx0aUVkaXQnKSxcblx0XHRtb3JlQWN0aW9uc0J1dHRvbiA9ICQoJyNtb3JlQWN0aW9ucycpLFxuXG5cdFx0c2VsZWN0QWxsQnV0dG9uID0gJCgnI3NlbGVjdEFsbCcpLFxuXHRcdHNlbGVjdEFsbExhYmVsID0gJCgnI3NlbGVjdEFsbExhYmVsJyksXG5cblx0XHRkZXNlbGVjdEFsbEJ1dHRvbiA9ICQoJyNkZXNlbGVjdEFsbCcpLFxuXHRcdGRlc2VsZWN0QWxsTGFiZWwgPSAkKCcjZGVzZWxlY3RBbGxMYWJlbCcpLFxuXG5cdFx0ZGVsZXRlQnV0dG9ucyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZSAuZmlsZV9fZGVsZXRlJyksXG5cdFx0ZWRpdEJ1dHRvbnMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUgLmJ1dHRvbicpLm5vdCgnLmMtRmlsZS1jb3ZlclRvZ2xlJyksXG5cdFx0YXJyYW5nZW1lbnRzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlIC5maWxlX19hcnJhZ2VtZW50JyksXG5cdFx0YXJyYW5nZW1lbnRJbnB1dHMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUgLmZpbGVfX2FycmFnZW1lbnQnKS5maW5kKCdpbnB1dCcpLFxuXHRcdHNldENvdmVyQnV0dG9ucyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZSBidXR0b24uYy1GaWxlLWNvdmVyVG9nbGUnKSxcblxuXHRcdHNlbGVjdGVkRGVsZXRlQnV0dG9uID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkIC5maWxlX19kZWxldGUnKSxcblx0XHRzZWxlY3RlZEVkaXRCdXR0b24gPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQgLmJ1dHRvbicpLFxuXHRcdHNlbGVjdGVkQXJyYW5nZW1lbnQgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQgLmZpbGVfX2FycmFnZW1lbnQnKSxcblx0XHRzZWxlY3RlZEFycmFuZ2VtZW50SW5wdXQgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQgLmZpbGVfX2FycmFnZW1lbnQnKS5maW5kKCdpbnB1dCcpLFxuXHRcdHNlbGVjdGVkU2V0Q292ZXJCdXR0b25zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkIGJ1dHRvbi5jLUZpbGUtY292ZXJUb2dsZScpLFxuXG5cdFx0bnVtYmVyT2ZGaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZScpLmxlbmd0aCxcblx0XHRudW1iZXJPZlNlbGVjdGVkRmlsZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKS5sZW5ndGgsXG5cdFx0bnVtYmVyT2ZTZWxlY3RlZEltYWdlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5qcy1pbWdGaWxlVHlwZS5zZWxlY3RlZCcpLmxlbmd0aCxcblx0XHRudW1iZXJPZlNlbGVjdGVkVmlkZW9zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLXZpZGVvRmlsZVR5cGUuc2VsZWN0ZWQnKS5sZW5ndGg7XG5cblx0XHR1bnNlbGVjdGVkRmlsZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUnKS5ub3QoJy5zZWxlY3RlZCcpO1xuXG5cdC8vTm8gc2VsZWN0ZWQgZmlsZXNcblx0aWYgKG51bWJlck9mU2VsZWN0ZWRGaWxlcyA9PT0gMCkge1xuXHRcdHNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnYWxsIGRpc2FibGVkJykuYWRkQ2xhc3MoJ2VtcHR5Jyk7XG5cdFx0c2VsZWN0QWxsTGFiZWwudGV4dCgnU2VsZWN0IEFsbCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXG5cdFx0ZGVzZWxlY3RBbGxCdXR0b24ucmVtb3ZlQ2xhc3MoJ2lzLWFsbCcpLmFkZENsYXNzKCdpcy1lbXB0eSBkaXNhYmxlZCcpO1xuXHRcdGRlc2VsZWN0QWxsTGFiZWwuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cblx0XHRidWxrRGVsZXRlQnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0YnVsa0VkaXRCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRidWxrRWRpdEJ1dHRvbi5maW5kKCcuYnV0dG9uX193YXJuaW5nJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHRcdG11bHRpRWRpdEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdG1vcmVBY3Rpb25zQnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cblx0XHRlZGl0QnV0dG9ucy5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0ZGVsZXRlQnV0dG9ucy5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0YXJyYW5nZW1lbnRzLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdGFycmFuZ2VtZW50SW5wdXRzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdHNldENvdmVyQnV0dG9ucy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcblxuXHRcdHVuc2VsZWN0ZWRGaWxlcy5yZW1vdmVDbGFzcygnaXMtcHJlc2VsZWN0ZWQnKTtcblxuXHRcdGlmICgkKCcjYXNzZXRzLWNvdW50JykubGVuZ3RoID4gMCkge25vcm1hbGl6ZUFzc2V0c0NvdW50KCk7fVxuXG5cdFx0aWYgKG51bWJlck9mRmlsZXMgPT09IDApIHtcblx0XHRcdHNlbGVjdEFsbEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdHNlbGVjdEFsbExhYmVsLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXG5cdFx0XHRkZXNlbGVjdEFsbEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdGRlc2VsZWN0QWxsTGFiZWwuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0fVxuXHR9XG5cdC8vU29tZSBmaWxlcyBhcmUgc2VsZWN0ZWRcblx0ZWxzZSBpZiAobnVtYmVyT2ZTZWxlY3RlZEZpbGVzID4gMCkge1xuXHRcdHNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnZW1wdHkgYWxsJyk7XG5cdFx0c2VsZWN0QWxsTGFiZWwudGV4dCgnRGVzZWxlY3QgQWxsJyk7XG5cblx0XHRkZXNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnaXMtZW1wdHkgaXMtYWxsIGRpc2FibGVkJyk7XG5cdFx0ZGVzZWxlY3RBbGxMYWJlbC5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblxuXG5cdFx0YnVsa0RlbGV0ZUJ1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRidWxrRWRpdEJ1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRtdWx0aUVkaXRCdXR0b24ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0bW9yZUFjdGlvbnNCdXR0b24ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cblx0XHRlZGl0QnV0dG9ucy5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0ZGVsZXRlQnV0dG9ucy5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0YXJyYW5nZW1lbnRzLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdGFycmFuZ2VtZW50SW5wdXRzLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0c2V0Q292ZXJCdXR0b25zLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSkuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG5cblx0XHR1bnNlbGVjdGVkRmlsZXMuYWRkQ2xhc3MoJ2lzLXByZXNlbGVjdGVkJyk7XG5cblx0XHRpZiAoJCgnI2Fzc2V0cy1jb3VudCcpLmxlbmd0aCA+IDApIHtcblx0XHRcdCQoJyNhc3NldHMtY291bnQnKS50ZXh0KG51bWJlck9mU2VsZWN0ZWRGaWxlcy50b1N0cmluZygpICsgJyBvZiAnICsgZ2FsbGVyeU9iamVjdHMubGVuZ3RoICsgJyBzZWxlY3RlZCcpO1xuXHRcdH1cblxuXHRcdGlmIChudW1iZXJPZlNlbGVjdGVkVmlkZW9zICYmIG51bWJlck9mU2VsZWN0ZWRJbWFnZXMpIHtcblx0XHRcdGJ1bGtFZGl0QnV0dG9uLmZpbmQoJy5idXR0b25fX3dhcm5pbmcnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG5cdFx0XHRtdWx0aUVkaXRCdXR0b24uZmluZCgnLmJ1dHRvbl9fd2FybmluZycpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YnVsa0VkaXRCdXR0b24uZmluZCgnLmJ1dHRvbl9fd2FybmluZycpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcblx0XHRcdG11bHRpRWRpdEJ1dHRvbi5maW5kKCcuYnV0dG9uX193YXJuaW5nJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHRcdH1cblxuXHRcdC8vT25seSBvbmUgZmlsZSBzZWxlY3RlZFxuXHRcdGlmIChudW1iZXJPZlNlbGVjdGVkRmlsZXMgPT09IDEpIHtcblx0XHRcdGJ1bGtFZGl0QnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0XHRtdWx0aUVkaXRCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRcdC8vbW9yZUFjdGlvbnNCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblxuXHRcdFx0c2VsZWN0ZWRFZGl0QnV0dG9uLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRcdHNlbGVjdGVkRGVsZXRlQnV0dG9uLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRcdHNlbGVjdGVkQXJyYW5nZW1lbnQucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHRzZWxlY3RlZEFycmFuZ2VtZW50SW5wdXQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0XHRzZWxlY3RlZFNldENvdmVyQnV0dG9ucy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcblx0XHR9XG5cdFx0Ly9BbGwgZmlsZXMgYXJlIHNlbGVjdGVkXG5cdFx0aWYgKG51bWJlck9mU2VsZWN0ZWRGaWxlcyA9PT0gbnVtYmVyT2ZGaWxlcykge1xuXHRcdFx0c2VsZWN0QWxsQnV0dG9uLnJlbW92ZUNsYXNzKCdlbXB0eScpLmFkZENsYXNzKCdhbGwnKTtcblx0XHRcdGRlc2VsZWN0QWxsQnV0dG9uLnJlbW92ZUNsYXNzKCdpcy1lbXB0eScpLmFkZENsYXNzKCdpcy1hbGwnKTtcblx0XHR9XG5cdH1cbn1cbmZ1bmN0aW9uIHNlbGVjdEFsbCgpIHtcblx0JCgnLmpzLWNvbnRlbnQgLmZpbGUnKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcblx0bm9ybWFsaXplU2VsZWN0ZWlvbigpO1xufVxuZnVuY3Rpb24gZGVzZWxlY3RBbGwoKSB7XG5cdCQoJy5qcy1jb250ZW50IC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdG5vcm1hbGl6ZVNlbGVjdGVpb24oKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQXNzZXRzQ291bnQoKSB7XG5cdGlmIChnYWxsZXJ5T2JqZWN0cy5sZW5ndGgpIHtcblx0XHQkKCcjYXNzZXRzLWNvdW50JykudGV4dChnYWxsZXJ5T2JqZWN0cy5sZW5ndGggKyAnIGFzc2V0cycpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcblx0fSBlbHNlIHtcblx0XHQkKCcjYXNzZXRzLWNvdW50JykudGV4dCgnJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHR9XG59XG5cbi8vTm90aWZpY2F0aW9uc1xuZnVuY3Rpb24gc2hvd05vdGlmaWNhdGlvbih0ZXh0LCB0b3ApIHtcbiAgICB2YXIgbm90aWZpY2F0aW9uID0gJCgnLm5vdGlmaWNhdGlvbicpLFxuICAgICAgICBub3RpZmljYXRpb25UZXh0ID0gJCgnLm5vdGlmaWNhdGlvbl9fdGV4dCcpO1xuXG4gICAgaWYgKG5vdGlmaWNhdGlvbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbm90aWZpY2F0aW9uID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbm90aWZpY2F0aW9uJyk7XG4gICAgICAgIG5vdGlmaWNhdGlvblRleHQgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdub3RpZmljYXRpb25fX3RleHQnKTtcbiAgICAgICAgbm90aWZpY2F0aW9uLmFwcGVuZChub3RpZmljYXRpb25UZXh0KTtcbiAgICB9XG5cbiAgICBpZiAoJCgnLm1vZGFsJykubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoISQoJy5tb2RhbCAucHJldmlldycpLmhhc0NsYXNzKCdoaWRkZW4nKSkge1xuICAgICAgICAgICAgJCgnLm1vZGFsIC5wcmV2aWV3JykuYXBwZW5kKG5vdGlmaWNhdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcubW9kYWwnKS5hcHBlbmQobm90aWZpY2F0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgfSBlbHNlIGlmKCQoJy5jdCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJCgnLmN0JykuYXBwZW5kKG5vdGlmaWNhdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnYm9keScpLmFwcGVuZChub3RpZmljYXRpb24pO1xuICAgIH1cblxuICAgIGlmICh0b3ApIHtub3RpZmljYXRpb24uY3NzKCd0b3AnLCB0b3ApO31cbiAgICBub3RpZmljYXRpb25UZXh0LnRleHQodGV4dCk7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIG5vdGlmaWNhdGlvbi5yZW1vdmUoKTtcbiAgICB9LCA0MDAwKTtcbn1cblxuLy9GaWxlIGZ1bmN0aW9uc1xudmFyIGdhbGxlcnlDYXB0aW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBoYW5kbGVDYXB0aW9uRWRpdChlKSB7XG4gICAgdmFyIGZpbGVFbGVtZW50ID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKSxcbiAgICAgICAgZmlsZUlkID0gZmlsZUVsZW1lbnQuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpLFxuICAgICAgICB0b2dnbGUgPSBmaWxlRWxlbWVudC5maW5kKCcuZmlsZV9fY2FwdGlvbi10b2dnbGUgLnRvZ2dsZScpLFxuICAgICAgICBmaWxlID0gZ2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgIHJldHVybiBmLmZpbGVEYXRhLmlkID09PSBmaWxlSWQ7XG4gICAgICAgIH0pWzBdLFxuXG4gICAgICAgIHRvZ2dsZUNoZWNrZWQgPSAkKGUudGFyZ2V0KS52YWwoKSA9PT0gZmlsZS5maWxlRGF0YS5jYXB0aW9uICYmIGZpbGUuZmlsZURhdGEuY2FwdGlvbjsgLy9JZiB0ZXh0ZmllbGQgZXF1YWxzIHRoZSBmaWxlIGNhcHRpb24gYW5kIGZpbGUgY2FwdGlvbiBub3QgZW1wdHlcblxuICAgIC8vU2F2ZSBjYXB0aW9uIHRvIGdhbGxlcnlDYXB0aW9uc1xuICAgIGZpbGUuY2FwdGlvbiA9ICQoZS50YXJnZXQpLnZhbCgpO1xuXG4gICAgdG9nZ2xlLnByb3AoJ2NoZWNrZWQnLCB0b2dnbGVDaGVja2VkKTtcbiAgICBjbG9zZVRvb2x0aXAoKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZUNhcHRpb25Ub2dnbGVDbGljayhlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB2YXIgZmlsZSA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJyksXG4gICAgICAgIGZpbGVJZCA9IGZpbGUuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpLFxuICAgICAgICB0ZXh0YXJlYSA9IGZpbGUuZmluZCgnLmZpbGVfX2NhcHRpb24tdGV4dGFyZWEnKSxcbiAgICAgICAgb3JpZ2luYWxGaWxlID0gZmlsZUJ5SWQoZmlsZUlkLCBnYWxsZXJ5T2JqZWN0cyk7XG5cbiAgICBpZiAoJChlLnRhcmdldCkucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgIHRleHRhcmVhLnZhbChvcmlnaW5hbEZpbGUuZmlsZURhdGEuY2FwdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dGFyZWEuZm9jdXMoKTtcbiAgICB9XG59XG5mdW5jdGlvbiBoYW5kbGVDYXB0aW9uU3RhcnRFZGl0aW5nKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHZhciB0b29sdGlwVGV4dCA9ICdUaGlzIGNhcHRpb24gd2lsbCBvbmx5IGFwcGx5IHRvIHlvdXIgZ2FsbGVyeSBhbmQgbm90IHRvIHRoZSBpbWFnZSBhc3NldC4nO1xuICAgIGlmICghd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b29sdGlwJykpIHtcbiAgICAgICAgY3JlYXRlVG9vbHRpcCgkKGUudGFyZ2V0KSwgdG9vbHRpcFRleHQpO1xuICAgIH1cbn1cbi8vIENoYW5nZSBlbGVtZW50IGluZGV4ZXMgdG8gYW4gYWN0dWFsIG9uZXNcbmZ1bmN0aW9uIG5vcm1hbGl6ZUluZGV4KCkge1xuICAgIHZhciBmaWxlcyA9ICQoJy5qcy1maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKTtcblxuICAgIGZpbGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICQoZWwpLmZpbmQoJy5maWxlX19hcmFnZW1lbnQtaW5wdXQnKS50ZXh0KGluZGV4ICsgMSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUluZGV4RmllbGRDaGFuZ2UoZSkge1xuICAgIHZhciBsZW5ndGggPSAkKCcuanMtZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlJykubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IHBhcnNlSW50KCQoZS50YXJnZXQpLnZhbCgpKSAtIDEsXG4gICAgICAgIGZpbGUgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpO1xuXG4gICAgaWYgKGluZGV4ICsgMSA+PSBsZW5ndGgpIHtcbiAgICAgICAgcHV0Qm90dG9tKGZpbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGUuZGV0YWNoKCkuaW5zZXJ0QmVmb3JlKCQoJy5qcy1maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKS5zbGljZShpbmRleCwgaW5kZXgrMSkpO1xuXG4gICAgfVxuICAgIG5vcm1hbGl6ZUluZGV4KCk7XG4gICAgLy91cGRhdGVHYWxsZXJ5KGluZGV4KTtcbn1cblxuZnVuY3Rpb24gcHV0Qm90dG9tKGZpbGUpIHtcbiAgICBmaWxlLmRldGFjaCgpLmluc2VydEFmdGVyKCQoJy5qcy1maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKS5sYXN0KCkpO1xuICAgIG5vcm1hbGl6ZUluZGV4KCk7XG4gICAgLy91cGRhdGVHYWxsZXJ5KGdhbGxlcnlPYmplY3RzLmxlbmd0aCk7XG59XG5mdW5jdGlvbiBwdXRUb3AoZmlsZSkge1xuICAgIGZpbGUuZGV0YWNoKCkuaW5zZXJ0QmVmb3JlKCQoJy5qcy1maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKS5maXJzdCgpKTtcbiAgICBub3JtYWxpemVJbmRleCgpO1xuICAgIC8vdXBkYXRlR2FsbGVyeSgwKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlU2VuZFRvVG9wQ2xpY2soZSkge1xuICAgIHZhciBmaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpO1xuICAgIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHB1dFRvcChmaWxlcyk7XG4gICAgfVxuICAgIHB1dFRvcCgkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpKTtcbiAgICBjbG9zZU1lbnUoJChlLnRhcmdldCkucGFyZW50cygnc2VsZWN0X19tZW51JykpO1xufVxuZnVuY3Rpb24gaGFuZGxlU2VuZFRvQm90dG9tQ2xpY2soZSkge1xuICAgIHZhciBmaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpO1xuICAgIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHB1dEJvdHRvbShmaWxlcyk7XG4gICAgfVxuICAgIHB1dEJvdHRvbSgkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpKTtcbiAgICBjbG9zZU1lbnUoJChlLnRhcmdldCkucGFyZW50cygnc2VsZWN0X19tZW51JykpO1xufVxuZnVuY3Rpb24gbG9hZEZpbGUoZmlsZSkge1xuXHR2YXIgZmlsZURhdGEgPSBmaWxlLmZpbGVEYXRhO1xuXG5cdHN3aXRjaCAoZmlsZURhdGEudHlwZSkge1xuXHRcdGNhc2UgJ2ltYWdlJzpcblxuXHRcdC8vSGlkZSB2aWRlbyByZWxhdGVkIGVsZW1lbnRzXG5cdFx0JCgnI3ZpZGVvUGxheScpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHQkKCcjdmlkZW9NZXRhZGF0YScpLmFkZENsYXNzKCdoaWRkZW4nKTtcblxuXHRcdC8vU2hvdyBhbGwgaW1hZ2UgcmVsYXRlZCBlbGVtZW50c1xuXHRcdCQoJyNwcmV2aWV3Q29udHJvbHMnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0JCgnI2ltYWdlTWV0YWRhdGEnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0JCgnI2ZvY2FsUG9pbnQnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cblx0XHRpZiAoIWZpbGUuYnVsa0VkaXQpIHtcblx0XHRcdCQoJyNwcmV2aWV3SW1nJykuYXR0cignc3JjJywgZmlsZURhdGEudXJsKTtcblx0XHRcdCQoJy5wciAucHVycG9zZS1pbWcnKS5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsICd1cmwoJyArIGZpbGVEYXRhLnVybCArICcpJyk7XG5cdFx0XHRhZGp1c3RGb2NhbFBvaW50KGZpbGVEYXRhLmZvY2FsUG9pbnQpO1xuXHRcdH1cblxuXHRcdC8vc2V0IFRpdGxlXG5cdFx0YWRqdXN0VGl0bGUoZmlsZURhdGEudGl0bGUpO1xuXHRcdGFkanVzdENhcHRpb24oZmlsZURhdGEuY2FwdGlvbik7XG5cdFx0YWRqdXN0RGVzY3JpcHRpb24oZmlsZURhdGEuZGVzY3JpcHRpb24pO1xuXHRcdGFkanVzdFJlc29sdXRpb24oZmlsZURhdGEuaGlnaFJlc29sdXRpb24pO1xuXHRcdGFkanVzdEFsdFRleHQoZmlsZURhdGEuYWx0VGV4dCk7XG5cblx0XHRicmVhaztcblxuXHRcdGNhc2UgJ3ZpZGVvJzpcblxuXHRcdC8vSGlkZSBhbGwgaW1hZ2UgcmVsYXRlZCBlbGVtZW50c1xuXHRcdCQoJyNwcmV2aWV3Q29udHJvbHMnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0JCgnI2ltYWdlTWV0YWRhdGEnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0JCgnI2ZvY2FsUG9pbnQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cblx0XHQvL1Nob3cgdmlkZW8gcmVsYXRlZCBlbGVtZW50c1xuXHRcdCQoJyN2aWRlb1BsYXknKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0JCgnI3ZpZGVvTWV0YWRhdGEnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cblx0XHRpZiAoZmlsZS5idWxrRWRpdCkge1xuXHRcdFx0JCgnI2ZpZWxFZGl0LXZpZGVvTWV0YWRhdGEnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoJyNmaWVsRWRpdC12aWRlb01ldGFkYXRhJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0XHQkKCcjcHJldmlld0ltZycpLmF0dHIoJ3NyYycsIGZpbGVEYXRhLnVybCk7XG5cdFx0XHQkKCcjdmlkZW9UaXRsZScpLnRleHQoZmlsZURhdGEudGl0bGUpO1xuXHRcdFx0JCgnI3ZpZGVvRGVzY3JpcHRpb24nKS50ZXh0KGZpbGVEYXRhLmRlc2NyaXB0aW9uKTtcblx0XHRcdCQoJyN2aWRlb0F1dGhvcicpLnRleHQoZmlsZURhdGEuYXV0aG9yKTtcblx0XHRcdCQoJyN2aWRlb0d1aWQnKS50ZXh0KGZpbGVEYXRhLmd1aWQpO1xuXHRcdFx0JCgnI3ZpZGVvS2V5d29yZHMnKS50ZXh0KGZpbGVEYXRhLmtleXdvcmRzKTtcblx0XHR9XG5cblx0XHRicmVhaztcblx0fVxufVxuXG4vL0Z1bmN0aW9uIHRvIHNldCBUaXRsZSB0byB0aGUgdGl0bGUgZmllbGQgb3IsIHNhdmUgdGl0bGUgaWYgdGl0bGUgYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIGFkanVzdFRpdGxlKHRpdGxlKSB7XG5cdCQoJyN0aXRsZScpLnZhbCh0aXRsZSkuY2hhbmdlKCk7XG5cdHZhciBldmVudCA9IG5ldyBVSUV2ZW50KCdjaGFuZ2UnKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlJykuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBUaXRsZSB0byB0aGUgdGl0bGUgZmllbGQgb3IsIHNhdmUgdGl0bGUgaWYgdGl0bGUgYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIHNhdmVUaXRsZShlKSB7XG5cdHZhciBjdXJyZW50SW1hZ2UgPSAkKCcuaW1hZ2UuaW1hZ2Vfc3R5bGVfbXVsdGkgLmZpbGVfX2lkW2RhdGEtaWQ9XCInICsgZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuaWQgKyAnXCJdJykucGFyZW50cygnLmltYWdlJyk7XG5cblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEudGl0bGUgPSAkKCcjdGl0bGUnKS52YWwoKTtcblxuXHRpZiAoJCgnI3RpdGxlJykudmFsKCkgPT09ICcnKSB7XG5cdFx0Y3VycmVudEltYWdlLmFkZENsYXNzKCdoYXMtZW1wdHlSZXF1aXJlZEZpZWxkJyk7XG5cdH0gZWxzZSB7XG5cdFx0Y3VycmVudEltYWdlLnJlbW92ZUNsYXNzKCdoYXMtZW1wdHlSZXF1aXJlZEZpZWxkJyk7XG5cdH1cblxuXHRkYXRhQ2hhbmdlZCA9IHRydWU7XG5cdGlmIChlZGl0ZWRGaWxlRGF0YS5idWxrRWRpdCkge1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdGYuZmlsZURhdGEudGl0bGUgPSAkKCcjdGl0bGUnKS52YWwoKTtcblx0XHR9KTtcblx0fVxufVxuLy9GdW5jdGlvbiB0byBzZXQgQ2FwdGlvbiB0byB0aGUgY2FwdGlvbiBmaWVsZCBvciwgc2F2ZSBjYXB0aW9uIGlmIGNhcHRpb24gYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIGFkanVzdENhcHRpb24oY2FwdGlvbikge1xuXHQkKCcjY2FwdGlvbicpLnZhbChjYXB0aW9uKS5jaGFuZ2UoKTtcblx0dmFyIGV2ZW50ID0gbmV3IFVJRXZlbnQoJ2NoYW5nZScpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FwdGlvbicpLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgRGVzY3JpcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlQ2FwdGlvbigpIHtcblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuY2FwdGlvbiA9ICQoJyNjYXB0aW9uJykudmFsKCk7XG5cdGRhdGFDaGFuZ2VkID0gdHJ1ZTtcblx0aWYgKGVkaXRlZEZpbGVEYXRhLmJ1bGtFZGl0KSB7XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdFx0Zi5maWxlRGF0YS5jYXB0aW9uID0gJCgnI2NhcHRpb24nKS52YWwoKTtcblx0XHR9KTtcblx0fVxufVxuZnVuY3Rpb24gYWRqdXN0RGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcblx0JCgnI2Rlc2NyaXB0aW9uJykudmFsKGRlc2NyaXB0aW9uKS5jaGFuZ2UoKTtcblx0dmFyIGV2ZW50ID0gbmV3IFVJRXZlbnQoJ2NoYW5nZScpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzY3JpcHRpb24nKS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cbi8vRnVuY3Rpb24gdG8gc2V0IERlc2NyaXB0aW9uIHRvIHRoZSBjYXB0aW9uIGZpZWxkIG9yLCBzYXZlIGNhcHRpb24gaWYgY2FwdGlvbiBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gc2F2ZURlc2NyaXB0aW9uKCkge1xuXHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5kZXNjcmlwdGlvbiA9ICQoJyNkZXNjcmlwdGlvbicpLnZhbCgpO1xuXHRkYXRhQ2hhbmdlZCA9IHRydWU7XG5cdGlmIChlZGl0ZWRGaWxlRGF0YS5idWxrRWRpdCkge1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdGYuZmlsZURhdGEuZGVzY3JpcHRpb24gPSAkKCcjZGVzY3JpcHRpb24nKS52YWwoKTtcblx0XHR9KTtcblx0fVxufVxuZnVuY3Rpb24gYWRqdXN0UmVzb2x1dGlvbihyZXNvbHV0aW9uKSB7XG5cdCQoJyNyZXNvbHV0aW9uJykucHJvcCgnY2hlY2tlZCcsIHJlc29sdXRpb24pO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgRGVzY3JpcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlUmVzb2x1dGlvbigpIHtcblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuaGlnaFJlc29sdXRpb24gPSAkKCcjcmVzb2x1dGlvbicpLnByb3AoJ2NoZWNrZWQnKTtcblx0ZGF0YUNoYW5nZWQgPSB0cnVlO1xuXHRpZiAoZWRpdGVkRmlsZURhdGEuYnVsa0VkaXQpIHtcblx0XHRlZGl0ZWRGaWxlc0RhdGEuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0XHRmLmZpbGVEYXRhLmhpZ2hSZXNvbHV0aW9uID0gJCgnI3Jlc29sdXRpb24nKS5wcm9wKCdjaGVja2VkJyk7XG5cdFx0fSk7XG5cdH1cbn1cbmZ1bmN0aW9uIGFkanVzdEFsdFRleHQoYWx0VGV4dCkge1xuXHQkKCcjYWx0VGV4dCcpLnZhbChhbHRUZXh0KS5jaGFuZ2UoKTtcblx0dmFyIGV2ZW50ID0gbmV3IFVJRXZlbnQoJ2NoYW5nZScpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWx0VGV4dCcpLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgRGVzY3JpcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlQWx0VGV4dCgpIHtcblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuYWx0VGV4dCA9ICQoJyNhbHRUZXh0JykudmFsKCk7XG5cdGRhdGFDaGFuZ2VkID0gdHJ1ZTtcblx0aWYgKGVkaXRlZEZpbGVEYXRhLmJ1bGtFZGl0KSB7XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdFx0Zi5maWxlRGF0YS5hbHRUZXh0ID0gJCgnI2FsdFRleHQnKS52YWwoKTtcblx0XHR9KTtcblx0fVxufVxuXG4vL0Z1bmN0aW9uIHRvIHNldCBGb2NhbFBvaW50IGNvb3JkaW5hdGVzIG9yLCBzYXZlIGZvY2FsIHBpbnQgaWYgZm9jYWxwb2ludCBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gYWRqdXN0Rm9jYWxQb2ludChmb2NhbFBvaW50KSB7XG5cdHZhciBmcCA9ICQoJyNmb2NhbFBvaW50Jyk7XG5cdHZhciBpbWcgPSAkKCcjcHJldmlld0ltZycpO1xuXHRpZiAoZm9jYWxQb2ludCkge1xuXHRcdHZhciBsZWZ0ID0gZm9jYWxQb2ludC5sZWZ0ICogaW1nLndpZHRoKCkgLSBmcC53aWR0aCgpLzIsXG5cdFx0dG9wID0gZm9jYWxQb2ludC50b3AgKiBpbWcuaGVpZ2h0KCkgLSBmcC5oZWlnaHQoKS8yO1xuXG5cdFx0bGVmdCA9IGxlZnQgPT09IDAgPyAnNTAlJyA6IGxlZnQ7XG5cdFx0dG9wID0gdG9wID09PSAwID8gJzUwJScgOiB0b3A7XG5cdFx0ZnAuY3NzKCdsZWZ0JywgbGVmdCkuY3NzKCd0b3AnLCB0b3ApO1xuXG5cdH0gZWxzZSB7XG5cdFx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuZm9jYWxQb2ludCA9IHtcblx0XHRcdGxlZnQ6ICgoZnAucG9zaXRpb24oKS5sZWZ0ICsgZnAud2lkdGgoKS8yKS9pbWcud2lkdGgoKSksXG5cdFx0XHR0b3A6ICgoZnAucG9zaXRpb24oKS50b3AgKyBmcC5oZWlnaHQoKS8yKS9pbWcuaGVpZ2h0KCkpXG5cdFx0fTtcblx0fVxuXHRmcC5jc3MoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG5cbn1cblxuLy9GdW5jdGlvbiB0byBzZXQgRm9jYWxSZWN0IGNvb3JkaW5hdGVzIG9yLCBzYXZlIGZvY2FsIHBpbnQgaWYgZm9jYWxwb2ludCBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gYWRqdXN0Rm9jYWxSZWN0KGZvY2FsUG9pbnQpIHtcblx0dmFyIGZyID0gJCgnI2ZvY2FsUmVjdCcpO1xuXHR2YXIgaW1nID0gJCgncHJldmlld0ltZycpO1xuXHRpZiAoZm9jYWxQb2ludCkge1xuXHRcdHZhciBsZWZ0ID0gZm9jYWxQb2ludC5sZWZ0ICogaW1nLndpZHRoKCkgLSBmci53aWR0aCgpLzIsXG5cdFx0dG9wID0gZm9jYWxQb2ludC50b3AgKiBpbWcuaGVpZ2h0KCkgLSBmci5oZWlnaHQoKS8yO1xuXG5cdFx0bGVmdCA9IGxlZnQgPCAwID8gMCA6IGxlZnQgPiBpbWcud2lkdGgoKSA/IGltZy53aWR0aCgpIC0gZnIud2lkdGgoKS8yIDogbGVmdDtcblx0XHR0b3AgPSB0b3AgPCAwID8gMCA6IHRvcCA+IGltZy5oZWlnaHQoKSA/IGltZy5oZWlnaHQoKSAtIGZyLmhlaWdodCgpLzIgOiB0b3A7XG5cblx0XHRmci5jc3MoJ2xlZnQnLCBsZWZ0KVxuXHRcdC5jc3MoJ3RvcCcsIHRvcCk7XG5cdH0gZWxzZSB7XG5cdFx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuZm9jYWxQb2ludCA9IHtcblx0XHRcdGxlZnQ6ICgoZnAucG9zaXRpb24oKS5sZWZ0ICsgZnAud2lkdGgoKS8yKS9pbWcud2lkdGgoKSksXG5cdFx0XHR0b3A6ICgoZnAucG9zaXRpb24oKS50b3AgKyBmcC5oZWlnaHQoKS8yKS9pbWcuaGVpZ2h0KCkpXG5cdFx0fTtcblx0fVxufVxuXG5cbmZ1bmN0aW9uIHNob3dGaWxlcyhmaWxlcykge1xuXHRkYXRhQ2hhbmdlZCA9IGZhbHNlO1xuXHRzY3JvbGxQb3NpdGlvbiA9ICQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcblx0Ly9TaG93IGluaXRpYWwgZWRpdCBzY3JlZW4gZm9yIHNpbmdsZSBpbWFnZS5cblx0JCgnLnByJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbiB2aWRlbyBidWxrJylcblx0LmFkZENsYXNzKCdtb2RhbCcpO1xuXHQkKCcjd3JhcHBlcicpLmFkZENsYXNzKCdvdmVyZmxvdycpO1xuXG5cdC8vUmVtb3ZlIGFsbCBtdWx0aXBsZSBpbWFnZXMgc3R5bGUgYXR0cmlidXRlc1xuXHQkKCcucHIgLnByZXZpZXcnKS5yZW1vdmVDbGFzcygncHJldmlld19zdHlsZV9tdWx0aSBoaWRkZW4nKTtcblx0JCgnLnByIC5pcCcpLnJlbW92ZUNsYXNzKCdpcF9zdHlsZV9tdWx0aScpO1xuXHQkKCcjc2F2ZUNoYW5nZXMnKS50ZXh0KCdTYXZlJyk7XG5cdC8vJCgnI2lwX190aXRsZScpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0JCgnLnByIC5pbWFnZXMnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdCQoJyN0aXRsZScpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0JCgnI3RpdGxlJykucGFyZW50KCkuY2hpbGRyZW4oJ2xhYmVsJykuYWRkQ2xhc3MoJ3JlcXVpZXJlZCcpO1xuXHQkKCcjdGl0bGUnKS5wcm9wKCdyZXF1aXJlZCcsIHRydWUpO1xuXG5cdGZ1bmN0aW9uIHJlc2l6ZUltYWdlV3JhcHBlcigpIHtcblx0XHR2YXIgaW1hZ2VzV3JhcHBlcldpZHRoID0gJCgnLmltYWdlc19fd3JhcHBlcicpLndpZHRoKCk7XG5cdFx0aW1hZ2VzV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCA8IDYwMCA/ICQoJy5pbWFnZXNfX2NvbnRhaW5lciAuaW1hZ2UnKS5sZW5ndGggKiAxMDAgOiAkKCcuaW1hZ2VzX19jb250YWluZXIgLmltYWdlJykubGVuZ3RoICogMTIwO1xuXHRcdGlmIChpbWFnZXNXcmFwcGVyV2lkdGggPiBpbWFnZXNXaWR0aCkge1xuXHRcdFx0JCgnLmltYWdlc19fc2Nyb2xsLWxlZnQsIC5pbWFnZXNfX3Njcm9sbC1yaWdodCcpLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCgnLmltYWdlc19fY29udGFpbmVyJykuY3NzKCd3aWR0aCcsIGltYWdlc1dpZHRoLnRvU3RyaW5nKCkgKyAncHgnKTtcblx0XHRcdCQoJy5pbWFnZXNfX3Njcm9sbC1sZWZ0LCAuaW1hZ2VzX19zY3JvbGwtcmlnaHQnKS5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuXHRcdH1cblx0fVxuXG5cdGlmIChmaWxlcy5sZW5ndGggPiAxKSB7XG5cdFx0dmFyIGltZ0NvbnRhaW5lciA9ICQoJy5wciAuaW1hZ2VzX19jb250YWluZXInKTtcblx0XHRpbWdDb250YWluZXIuZW1wdHkoKTtcblxuXHRcdC8vQWRkIGltYWdlcyBwcmV2aWVzIHRvIHRoZSBjb250YWluZXJcblx0XHRmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdHZhclx0aW1hZ2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZSBpbWFnZV9zdHlsZV9tdWx0aScpLmNsaWNrKGhhbmRsZUltYWdlU3dpdGNoKSxcblx0XHRcdHJlcXVpcmVkTWFyayA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlX19yZXF1aXJlZC1tYXJrJyksXG5cdFx0XHRmaWxlSW5kZXggPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdoaWRkZW4gZmlsZV9faWQnKS50ZXh0KGYuZmlsZURhdGEuaWQpLmF0dHIoJ2RhdGEtaWQnLCBmLmZpbGVEYXRhLmlkKTtcblx0XHRcdGltYWdlLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIGYuZmlsZURhdGEudXJsICsgJyknKS5hcHBlbmQocmVxdWlyZWRNYXJrLCBmaWxlSW5kZXgpO1xuXHRcdFx0aW1nQ29udGFpbmVyLmFwcGVuZChpbWFnZSk7XG5cdFx0fSk7XG5cblx0XHQvL0FkZCBhY3RpdmUgc3RhdGUgdG8gdGhlIHByZXZpZXcgb2YgdGhlIGZpcnN0IGltYWdlXG5cdFx0dmFyIGZpcnN0SW1hZ2UgPSAkKCcuaW1hZ2VzX19jb250YWluZXIgLmltYWdlJykuZmlyc3QoKTtcblx0XHRmaXJzdEltYWdlLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblxuXHRcdCQoJy5wciAuaW1hZ2VzJykuYWRkQ2xhc3MoJ2ltYWdlc19zdHlsZV9tdWx0aScpLnJlbW92ZUNsYXNzKCdoaWRkZW4gaW1hZ2VzX3N0eWxlX2J1bGsnKTtcblxuXHRcdCQoJy5wciAucHJldmlldycpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKS5hZGRDbGFzcygncHJldmlld19zdHlsZV9tdWx0aScpO1xuXHRcdCQoJy5wciAuaXAnKS5hZGRDbGFzcygnaXBfc3R5bGVfbXVsdGknKTtcblxuXHRcdC8vQWRqdXN0IGltYWdlIHByZXZpZXdzIGNvbnRhaW5lclxuXHRcdCQoJyNpbWFnZXNfX3dyYXBwZXInKS5zY3JvbGxMZWZ0KDApO1xuXHRcdCQod2luZG93KS5yZXNpemUocmVzaXplSW1hZ2VXcmFwcGVyKTtcblx0XHRyZXNpemVJbWFnZVdyYXBwZXIoKTtcblxuXHRcdC8vQWRkIGFjdGlvbnMgdG8gc2Nyb2xsIGJ1dHRvbnNcblx0XHQkKCcuaW1hZ2VzX19zY3JvbGwtbGVmdCcpLnVuYmluZCgnY2xpY2snKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0JCgnI2ltYWdlc19fd3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogJy09NDgwJyB9LCA2MDApO1xuXHRcdH0pO1xuXHRcdCQoJy5pbWFnZXNfX3Njcm9sbC1yaWdodCcpLnVuYmluZCgnY2xpY2snKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0JCgnI2ltYWdlc19fd3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogJys9NDgwJyB9LCA2MDApO1xuXHRcdH0pO1xuXHR9XG5cdGhpZGVMb2FkZXIoKTtcblx0c2V0TW9kYWxLZXlib2FyZEFjdGlvbnMoc2F2ZUltYWdlRWRpdCwgY2FuY2VsSW1hZ2VFZGl0KTtcblxufVxuZnVuY3Rpb24gZWRpdEZpbGVzKGZpbGVzKSB7XG5cdGVkaXRlZEZpbGVzRGF0YSA9IFtdLmNvbmNhdChmaWxlcyk7XG5cblx0aWYgKGVkaXRlZEZpbGVzRGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0ZWRpdGVkRmlsZURhdGEgPSBlZGl0ZWRGaWxlc0RhdGFbMF07XG5cdFx0bG9hZEZpbGUoZWRpdGVkRmlsZURhdGEpO1xuXHRcdHNob3dGaWxlcyhlZGl0ZWRGaWxlc0RhdGEpO1xuXHR9XG59XG5cblxuLy9CdWxrIEVkaXRcbmZ1bmN0aW9uIGJ1bGtFZGl0RmlsZXMoZmlsZXMsIHR5cGUpIHtcblx0dmFyIGNsb25lZEdhbGxlcnlPYmplY3RzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShnYWxsZXJ5T2JqZWN0cykpO1xuXHR2YXIgZmlsZXNUeXBlO1xuXHRlZGl0ZWRGaWxlc0RhdGEgPSBbXTsgLy9DbGVhciBmaWxlcyBkYXRhIHRoYXQgcG9zc2libHkgY291bGQgYmUgaGVyZVxuXG5cdC8vT2J0YWluIGZpbGVzIGRhdGEgZm9yIGZpbGVzIHRoYXQgc2hvdWxkIGJlIGVkaXRlZFxuXHRmaWxlcy5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG5cdFx0dmFyIGZpbGUgPSBjbG9uZWRHYWxsZXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuXHRcdFx0cmV0dXJuIGYuZmlsZURhdGEuaWQgPT09ICQoZWwpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcblx0XHR9KVswXTtcblx0XHRlZGl0ZWRGaWxlc0RhdGEucHVzaChmaWxlKTtcblx0fSk7XG5cblx0aWYgKGVkaXRlZEZpbGVzRGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0c3dpdGNoIChlZGl0ZWRGaWxlc0RhdGFbMF0uZmlsZURhdGEudHlwZSkge1xuXHRcdFx0Y2FzZSAnaW1hZ2UnOlxuXHRcdFx0ZWRpdGVkRmlsZURhdGEgPSB7XG5cdFx0XHRcdGZpbGVEYXRhOiB7XG5cdFx0XHRcdFx0dXJsOiAnJyxcblx0XHRcdFx0XHRmb2NhbFBvaW50OiB7XG5cdFx0XHRcdFx0XHRsZWZ0OiAwLjUsXG5cdFx0XHRcdFx0XHR0b3A6IDAuNVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aWQ6ICcnLFxuXHRcdFx0XHRcdGNvbG9yOiAnJywvL2ZpbGVJbWdDb2xvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmZpbGVJbWdDb2xvcnMubGVuZ3RoKV0sXG5cdFx0XHRcdFx0dGl0bGU6ICcnLFxuXHRcdFx0XHRcdGNhcHRpb246ICcnLFxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiAnJyxcblx0XHRcdFx0XHRoaWdoUmVzb2x1dGlvbjogZmFsc2UsXG5cdFx0XHRcdFx0Y2F0ZWdvcmllczogJycsXG5cdFx0XHRcdFx0dGFnczogJycsXG5cdFx0XHRcdFx0YWx0VGV4dDogJycsXG5cdFx0XHRcdFx0Y3JlZGl0OiAnJyxcblx0XHRcdFx0XHRjb3B5cmlnaHQ6ICcnLFxuXHRcdFx0XHRcdHJlZmVyZW5jZToge1xuXHRcdFx0XHRcdFx0c2VyaWVzOiAnJyxcblx0XHRcdFx0XHRcdHNlYXNvbjogJycsXG5cdFx0XHRcdFx0XHRlcGlzb2RlOiAnJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dHlwZTogJ2ltYWdlJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRidWxrRWRpdDogdHJ1ZVxuXHRcdFx0fTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlICd2aWRlbyc6XG5cdFx0XHRlZGl0ZWRGaWxlRGF0YSA9IHtcblx0XHRcdFx0ZmlsZURhdGE6IHtcblx0XHRcdFx0XHR1cmw6ICcnLFxuXHRcdFx0XHRcdHBsYXllcjogJycsXG5cdFx0XHRcdFx0dHlwZTogJ3ZpZGVvJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRidWxrRWRpdDogdHJ1ZVxuXHRcdFx0fTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdFx0bG9hZEZpbGUoZWRpdGVkRmlsZURhdGEpO1xuXHRcdHNob3dCdWxrRmlsZXMoZWRpdGVkRmlsZXNEYXRhKTtcblxuXHR9XG59XG5mdW5jdGlvbiBzaG93QnVsa0ZpbGVzKGZpbGVzKSB7XG5cdGRhdGFDaGFuZ2VkID0gZmFsc2U7XG5cdHNjcm9sbFBvc2l0aW9uID0gJCgnYm9keScpLnNjcm9sbFRvcCgpO1xuXHQvL1Nob3cgaW5pdGlhbCBlZGl0IHNjcmVlbiBmb3Igc2luZ2xlIGltYWdlLlxuXHQkKCcucHInKS5yZW1vdmVDbGFzcygnaGlkZGVuIHZpZGVvJylcblx0LmFkZENsYXNzKCdtb2RhbCBidWxrJyk7XG5cdCQoJyN3cmFwcGVyJykuYWRkQ2xhc3MoJ292ZXJmbG93Jyk7XG5cblx0Ly9SZW1vdmUgYWxsIG11bHRpcGxlIGltYWdlcyBzdHlsZSBhdHRyaWJ1dGVzXG5cdCQoJy5wciAucHJldmlldycpLnJlbW92ZUNsYXNzKCdwcmV2aWV3X3N0eWxlX211bHRpIGhpZGRlbicpO1xuXHQkKCcucHIgLmlwJykucmVtb3ZlQ2xhc3MoJ2lwX3N0eWxlX211bHRpJyk7XG5cdCQoJyNzYXZlQ2hhbmdlcycpLnRleHQoJ1NhdmUnKTtcblx0JCgnI3RpdGxlJykucGFyZW50KCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHQkKCcjdGl0bGUnKS5yZW1vdmVQcm9wKCdyZXF1aXJlZCcpO1xuXHQkKCcjdGl0bGUnKS5wYXJlbnQoKS5jaGlsZHJlbignbGFiZWwnKS5yZW1vdmVDbGFzcygncmVxdWllcmVkJyk7XG5cblx0dmFyIGltZ0NvbnRhaW5lciA9ICQoJy5wciAuaW1hZ2VzX19jb250YWluZXInKTtcblx0aW1nQ29udGFpbmVyLmVtcHR5KCk7XG5cblx0Ly9BZGQgaW1hZ2VzIHByZXZpZXMgdG8gdGhlIGNvbnRhaW5lclxuXHRmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHR2YXJcdGltYWdlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UgaW1hZ2Vfc3R5bGVfYnVsaycpLFxuXHRcdGZpbGVJbmRleCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2hpZGRlbiBmaWxlX19pZCcpLnRleHQoZi5maWxlRGF0YS5pZCk7XG5cdFx0aW1hZ2UuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgZi5maWxlRGF0YS51cmwgKyAnKScpLmFwcGVuZChmaWxlSW5kZXgpO1xuXHRcdGltZ0NvbnRhaW5lci5hcHBlbmQoaW1hZ2UpO1xuXHR9KTtcblxuXHQkKCcucHIgLmltYWdlcycpLmFkZENsYXNzKCdpbWFnZXNfc3R5bGVfYnVsaycpLnJlbW92ZUNsYXNzKCdoaWRkZW4gaW1hZ2VzX3N0eWxlX211bHRpJyk7XG5cdCQoJy5wciAucHJldmlldycpLmFkZENsYXNzKCdoaWRkZW4nKTtcblxuXHRoaWRlTG9hZGVyKCk7XG5cdHNldE1vZGFsS2V5Ym9hcmRBY3Rpb25zKHNhdmVJbWFnZUVkaXQsIGNhbmNlbEltYWdlRWRpdCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUJ1bGtFZGl0QnV0dG9uQ2xpY2soZSkge1xuXHQkKGUudGFyZ2V0KS5ibHVyKCk7XG5cdHZhciBmaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpLFxuXHRudW1iZXJPZlNlbGVjdGVkSW1hZ2VzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLWltZ0ZpbGVUeXBlLnNlbGVjdGVkJykubGVuZ3RoLFxuXHRudW1iZXJPZlNlbGVjdGVkVmlkZW9zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLXZpZGVvRmlsZVR5cGUuc2VsZWN0ZWQnKS5sZW5ndGg7XG5cblx0aWYgKG51bWJlck9mU2VsZWN0ZWRJbWFnZXMgJiYgbnVtYmVyT2ZTZWxlY3RlZFZpZGVvcykge1xuXHRcdG5ldyBNb2RhbCh7XG5cdFx0XHR0aXRsZTogJ1lvdSBjYW5cXCd0IGJ1bGsgZWRpdCBpbWFnZXMgYW5kIHZpZGVvcycsXG5cdFx0XHR0ZXh0OiAnWW91IGNhblxcJ3QgYnVsayBlZGl0IGltYWdlcyBhbmQgdmlkZW9zIGF0IG9uY2UuIFBsZWFzZSBzZWxlY3QgZmlsZXMgb2YgdGhlIHNhbWUgdHlwZSBhbmQgdHJ5IGFnYWluLicsXG5cdFx0XHRjb25maXJtVGV4dDogJ09rJyxcblx0XHRcdG9ubHlDb25maXJtOiB0cnVlXG5cdFx0fSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0aWYgKG51bWJlck9mU2VsZWN0ZWRWaWRlb3MpIHtcblx0XHRcdGJ1bGtFZGl0RmlsZXMoZmlsZXMsICd2aWRlb3MnKTtcblx0XHR9IGVsc2UgaWYobnVtYmVyT2ZTZWxlY3RlZEltYWdlcykge1xuXHRcdFx0YnVsa0VkaXRGaWxlcyhmaWxlcywgJ2ltYWdlcycpO1xuXHRcdH1cblx0fVxufVxuXG4vL0hlbHAgZnVuY3Rpb25cbmZ1bmN0aW9uIGZpbGVCeUlkKGlkLCBmaWxlcykge1xuXHRmaWxlc0ZpbHRlcmVkID0gZmlsZXMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcblx0XHRyZXR1cm4gZi5maWxlRGF0YS5pZCA9PT0gaWQ7XG5cdH0pO1xuXHRyZXR1cm4gZmlsZXNGaWx0ZXJlZFswXTtcbn1cblxuLy9TYXZlIGZpbGVcbmZ1bmN0aW9uIHNhdmVGaWxlKGZpbGVzLCBmaWxlKSB7XG5cdGZpbGVzLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdGlmIChmLmZpbGVEYXRhLmlkID09PSBmaWxlLmZpbGVEYXRhLmlkKSB7XG5cdFx0XHRmID0gZmlsZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzd2l0Y2hJbWFnZShpbWFnZSkge1xuXHQkKCcuaW1nLXdyYXBwZXInKS5yZW1vdmVDbGFzcygnaXMtc2xpZGluZ0xlZnQgaXMtc2xpZGluZ1JpZ2h0Jyk7XG5cdHZhciBuZXdGaWxlSWQgPSBpbWFnZS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCksXG5cdG5ld0ZpbGUgPSBmaWxlQnlJZChuZXdGaWxlSWQsIGVkaXRlZEZpbGVzRGF0YSksXG5cdG5ld0luZGV4ID0gaW1hZ2UuaW5kZXgoKSxcblx0Y3VycmVudEltYWdlID0gJCgnLmltYWdlLmlzLWFjdGl2ZScpLFxuXHRjdXJyZW50SW5kZXggPSBjdXJyZW50SW1hZ2UuaW5kZXgoKSxcblx0Y3VycmVudEZpbGUgPSBmaWxlQnlJZChjdXJyZW50SW1hZ2UuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpLCBlZGl0ZWRGaWxlc0RhdGEpLFxuXHRiYWNrSW1hZ2UgPSAkKCcjcHJldmlld0ltZ0JhY2snKSxcblx0cHJldmlld0ltYWdlID0gJCgnI3ByZXZpZXdJbWcnKTtcblxuXHRzYXZlRmlsZShlZGl0ZWRGaWxlc0RhdGEsIGVkaXRlZEZpbGVEYXRhKTtcblx0ZWRpdGVkRmlsZURhdGEgPSBuZXdGaWxlO1xuXHRsb2FkRmlsZShlZGl0ZWRGaWxlRGF0YSk7XG5cblx0LypiYWNrSW1hZ2UuYWRkQ2xhc3MoJ2lzLXZpc2libGUnKVxuXHQuYXR0cignc3JjJywgY3VycmVudEZpbGUuZmlsZURhdGEudXJsKVxuXHQuY3NzKCd3aWR0aCcsIHByZXZpZXdJbWFnZS53aWR0aCgpKVxuXHQuY3NzKCdoZWlnaHQnLCBwcmV2aWV3SW1hZ2UuaGVpZ2h0KCkpXG5cdC5jc3MoJ2xlZnQnLCBwcmV2aWV3SW1hZ2Uub2Zmc2V0KCkubGVmdClcblx0LmNzcygndG9wJywgcHJldmlld0ltYWdlLm9mZnNldCgpLnRvcCk7XG5cblx0Ki9cblxuXHRjdXJyZW50SW1hZ2UucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRpbWFnZS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cblx0aWYgKGN1cnJlbnRJbmRleCA+IG5ld0luZGV4KSB7XG5cdFx0JCgnLmltZy13cmFwcGVyJykuYWRkQ2xhc3MoJ2lzLXNsaWRpbmdMZWZ0Jyk7XG5cdH0gZWxzZSB7XG5cdFx0JCgnLmltZy13cmFwcGVyJykuYWRkQ2xhc3MoJ2lzLXNsaWRpbmdSaWdodCcpO1xuXHR9XG5cblx0dmFyIGltYWdlQ29udGFpbmVyID0gaW1hZ2UucGFyZW50cygnLmltYWdlc19fY29udGFpbmVyJyksXG5cdGltYWdlV3JhcHBlciA9IGltYWdlLnBhcmVudHMoJy5pbWFnZXNfX3dyYXBwZXInKSxcblx0aW1hZ2VMZWZ0RW5kID0gaW1hZ2VDb250YWluZXIucG9zaXRpb24oKS5sZWZ0ICsgaW1hZ2UucG9zaXRpb24oKS5sZWZ0LFxuXHRpbWFnZVJpZ2h0RW5kID0gaW1hZ2VDb250YWluZXIucG9zaXRpb24oKS5sZWZ0ICsgaW1hZ2UucG9zaXRpb24oKS5sZWZ0ICsgaW1hZ2Uud2lkdGgoKTtcblxuXHRpZiAoaW1hZ2VMZWZ0RW5kIDwgMCkge1xuXHRcdCQoJyNpbWFnZXNfX3dyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6IGltYWdlLnBvc2l0aW9uKCkubGVmdCAtIDMwfSwgNDAwKTtcblx0fSBlbHNlIGlmIChpbWFnZVJpZ2h0RW5kID4gaW1hZ2VXcmFwcGVyLndpZHRoKCkpIHtcblx0XHQkKCcjaW1hZ2VzX193cmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiBpbWFnZS5wb3NpdGlvbigpLmxlZnQgKyBpbWFnZS53aWR0aCgpIC0gaW1hZ2VXcmFwcGVyLndpZHRoKCkgKyA1MH0sIDQwMCk7XG5cdH1cblxuXHQvL2FkanVzdFJlY3QoJCgnLnB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZS1pbWcnKS5maXJzdCgpKTtcblx0Ly8kKCcjcHVycG9zZVdyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6ICcwJyB9LCA4MDApO1xufVxuZnVuY3Rpb24gaGFuZGxlSW1hZ2VTd2l0Y2goZSkge1xuXHRzd2l0Y2hJbWFnZSgkKGUudGFyZ2V0KSk7XG59XG5cbi8vRnVuY3Rpb24gZm9yIGhhbmRsZSBFZGl0IEJ1dHRvbiBjbGlja3NcbmZ1bmN0aW9uIGhhbmRsZUZpbGVkRWRpdEJ1dHRvbkNsaWNrKGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0dmFyIGZpbGVFbGVtZW50ID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKTtcblxuXHR2YXIgZmlsZSA9IGdhbGxlcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG5cdFx0cmV0dXJuIGYuZmlsZURhdGEuaWQgPT09ICQoZmlsZUVsZW1lbnQpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcblx0fSk7XG5cblx0ZWRpdEZpbGVzKGZpbGUpO1xufVxuZnVuY3Rpb24gaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2soZSkge1xuXHQkKGUudGFyZ2V0KS5ibHVyKCk7XG5cdHZhciBmaWxlc0VsZW1lbnRzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkJyksXG5cdGNsb25lZEdhbGxlcnlPYmplY3RzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShnYWxsZXJ5T2JqZWN0cykpLFxuXHRmaWxlcyA9IFtdLFxuXHRudW1iZXJPZlNlbGVjdGVkSW1hZ2VzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLWltZ0ZpbGVUeXBlLnNlbGVjdGVkJykubGVuZ3RoLFxuXHRudW1iZXJPZlNlbGVjdGVkVmlkZW9zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLXZpZGVvRmlsZVR5cGUuc2VsZWN0ZWQnKS5sZW5ndGg7XG5cblx0aWYgKG51bWJlck9mU2VsZWN0ZWRJbWFnZXMgJiYgbnVtYmVyT2ZTZWxlY3RlZFZpZGVvcykge1xuXHRcdG5ldyBNb2RhbCh7XG5cdFx0XHR0aXRsZTogJ1lvdSBjYW5cXCd0IG11bHRpIGVkaXQgaW1hZ2VzIGFuZCB2aWRlb3MnLFxuXHRcdFx0dGV4dDogJ1lvdSBjYW5cXCd0IG11bHRpIGVkaXQgaW1hZ2VzIGFuZCB2aWRlb3MgYXQgb25jZS4gUGxlYXNlIHNlbGVjdCBmaWxlcyBvZiB0aGUgc2FtZSB0eXBlIGFuZCB0cnkgYWdhaW4uJyxcblx0XHRcdGNvbmZpcm1UZXh0OiAnT2snLFxuXHRcdFx0b25seUNvbmZpcm06IHRydWVcblx0XHR9KTtcblx0fVxuXHRlbHNlIHtcblx0XHQvL09idGFpbiBmaWxlcyBkYXRhIGZvciBmaWxlcyB0aGF0IHNob3VsZCBiZSBlZGl0ZWRcblx0XHRmaWxlc0VsZW1lbnRzLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcblx0XHRcdHZhciBmaWxlID0gW10uY29uY2F0KGNsb25lZEdhbGxlcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG5cdFx0XHRcdHJldHVybiBmLmZpbGVEYXRhLmlkID09PSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG5cdFx0XHR9KSlbMF07XG5cdFx0XHRmaWxlcy5wdXNoKGZpbGUpO1xuXHRcdH0pO1xuXG5cdFx0ZWRpdEZpbGVzKGZpbGVzKTtcblx0fVxufVxuXG5cbmZ1bmN0aW9uIGNhbmNlbEltYWdlRWRpdCgpIHtcblx0aWYgKGRhdGFDaGFuZ2VkKSB7XG5cdFx0bmV3IE1vZGFsKHtcblx0XHRcdGRpYWxvZzogdHJ1ZSxcblx0XHRcdHRpdGxlOiAnQ2FuY2VsIENoYW5nZXM/Jyxcblx0XHRcdHRleHQ6ICdBbnkgdW5zYXZlZCBjaGFuZ2VzIHlvdSBtYWRlIHdpbGwgYmUgbG9zdC4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGNhbmNlbD8nLFxuXHRcdFx0Y29uZmlybVRleHQ6ICdDYW5jZWwnLFxuXHRcdFx0Y29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNsb3NlRWRpdFNjcmVlbigpO1xuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG5cdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFbnRlcktleWRvd24pO1xuXHRcdFx0fSxcblx0XHRcdGNhbmNlbEFjdGlvbjogc2V0TW9kYWxLZXlib2FyZEFjdGlvbnMoc2F2ZUltYWdlRWRpdCwgY2FuY2VsSW1hZ2VFZGl0KVxuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdGNsb3NlRWRpdFNjcmVlbigpO1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcblx0fVxufVxuZnVuY3Rpb24gc2F2ZUltYWdlRWRpdCgpIHtcblx0dmFyIGVtcHR5UmVxdWlyZWRGaWVsZCA9IGZhbHNlLFxuXHRlbXB0eUltYWdlO1xuXHR2YXIgZW1wdHlGaWVsZHMgPSBjaGVja0ZpZWxkcygnLnByIGxhYmVsLnJlcXVpZXJlZCcpO1xuXHRpZiAoZW1wdHlGaWVsZHMgfHwgZWRpdGVkRmlsZURhdGEuZmlsZURhdGEudHlwZSA9PT0gJ3ZpZGVvJykge1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGZkKSB7XG5cdFx0XHRpZiAoZmQuZmlsZURhdGEudGl0bGUgPT09ICcnICYmICFlbXB0eVJlcXVpcmVkRmllbGQpIHtcblx0XHRcdFx0ZW1wdHlSZXF1aXJlZEZpZWxkID0gdHJ1ZTtcblx0XHRcdFx0ZW1wdHlJbWFnZSA9ICQoJy5pbWFnZS5pbWFnZV9zdHlsZV9tdWx0aSAuZmlsZV9faWRbZGF0YS1pZD1cIicgKyBmZC5maWxlRGF0YS5pZCArICdcIl0nKS5wYXJlbnRzKCcuaW1hZ2UnKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChlbXB0eVJlcXVpcmVkRmllbGQpIHtcblx0XHRcdHN3aXRjaEltYWdlKGVtcHR5SW1hZ2UpO1xuXHRcdFx0JCgnLmpzLXJlcXVpcmVkJykubm90KCcuanMtaGFzVmFsdWUnKS5maXJzdCgpLmFkZENsYXNzKCdpbnB1dF9zdGF0ZV9lcnIgaXMtYmxpbmtpbmcnKS5mb2N1cygpO1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0aWYgKGUuYW5pbWF0aW9uTmFtZSA9PT0gJ3RleHRmaWVsZC1mb2N1cy1ibGluaycpIHskKGUudGFyZ2V0KS5wYXJlbnQoKS5maW5kKCcuaXMtYmxpbmtpbmcnKS5yZW1vdmVDbGFzcygnaXMtYmxpbmtpbmcnKTt9XG5cdFx0XHR9KTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgY2xvbmVkRWRpdGVkRmlsZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGVkaXRlZEZpbGVzRGF0YSkpO1xuXHRcdFx0Y2xvbmVkRWRpdGVkRmlsZXMuZm9yRWFjaChmdW5jdGlvbihmZCkge1xuXHRcdFx0XHR2YXIgZmlsZSA9IGdhbGxlcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGYuZmlsZURhdGEuaWQgPT09IGZkLmZpbGVEYXRhLmlkO1xuXHRcdFx0XHR9KVswXTtcblx0XHRcdFx0dmFyIGZpbGVJbmRleCA9IGdhbGxlcnlPYmplY3RzLmluZGV4T2YoZmlsZSk7XG5cblx0XHRcdFx0Z2FsbGVyeU9iamVjdHMgPSBnYWxsZXJ5T2JqZWN0cy5zbGljZSgwLCBmaWxlSW5kZXgpLmNvbmNhdChbZmRdKS5jb25jYXQoZ2FsbGVyeU9iamVjdHMuc2xpY2UoZmlsZUluZGV4ICsgMSkpO1xuXG5cdFx0XHRcdC8qZ2FsbGVyeU9iamVjdHMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0XHRcdGlmIChmLmZpbGVEYXRhLmlkID09PSBmZC5maWxlRGF0YS5pZCkge1xuXHRcdFx0XHRmID0gZmQ7XG5cdFx0XHRcdGYuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9KTsqL1xuXHR9KTtcblx0c2hvd05vdGlmaWNhdGlvbignVGhlIGNoYW5nZSBpbiB0aGUgbWV0YWRhdGEgaXMgc2F2ZWQgdG8gdGhlIGFzc2V0LicpO1xuXHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG5cdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFbnRlcktleWRvd24pO1xuXHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtjbG9zZUVkaXRTY3JlZW4oKTt9LCAyMDAwKTtcblx0Y29uc29sZS5sb2coZ2FsbGVyeU9iamVjdHMpO1xuXHRkZXNlbGVjdEFsbCgpO1xuXHR1cGRhdGVHYWxsZXJ5KCk7XG59XG5cbn1cbn1cbi8qUXVpY2sgRWRpdCBGaWxlIFRpdGxlIGFuZCBJbmZvICovXG5mdW5jdGlvbiBlZGl0RmlsZVRpdGxlKGUpIHtcblx0aWYgKCEkKCcuYWwnKS5oYXNDbGFzcygnbW9kYWwnKSkge1xuXHRcdHZhciBmaWxlSW5mbyA9IGUudGFyZ2V0O1xuXHRcdHZhciBmaWxlSW5mb1RleHQgPSBmaWxlSW5mby5pbm5lckhUTUw7XG5cdFx0dmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblx0XHRpbnB1dC50eXBlID0gJ3RleHQnO1xuXHRcdGlucHV0LnZhbHVlID0gZmlsZUluZm9UZXh0O1xuXG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciBpbnB1dCA9IGUudGFyZ2V0O1xuXHRcdFx0ZmlsZUluZm8gPSBpbnB1dC5wYXJlbnROb2RlO1xuXHRcdFx0ZmlsZUluZm8ucmVtb3ZlQ2hpbGQoaW5wdXQpO1xuXHRcdFx0ZmlsZUluZm8uY2xhc3NMaXN0LnJlbW92ZSgnZWRpdCcpO1xuXHRcdFx0ZmlsZUluZm8uaW5uZXJIVE1MID0gaW5wdXQudmFsdWU7XG5cdFx0fSk7XG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDEzIHx8IGUud2hpY2ggPT0gMTMpIHtcblx0XHRcdFx0dmFyIGlucHV0ID0gZS50YXJnZXQ7XG5cdFx0XHRmaWxlSW5mbyA9IGlucHV0LnBhcmVudE5vZGU7XG5cdFx0XHRmaWxlSW5mby5yZW1vdmVDaGlsZChpbnB1dCk7XG5cdFx0XHRmaWxlSW5mby5jbGFzc0xpc3QucmVtb3ZlKCdlZGl0Jyk7XG5cdFx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSBpbnB1dC52YWx1ZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGZpbGVJbmZvLmlubmVySFRNTCA9ICcnO1xuXHRcdGZpbGVJbmZvLmFwcGVuZENoaWxkKGlucHV0KTtcblx0XHRmaWxlSW5mby5jbGFzc0xpc3QuYWRkKCdlZGl0Jyk7XG5cdFx0aW5wdXQuZm9jdXMoKTtcblx0fVxufVxuZnVuY3Rpb24gZWRpdEZpbGVDYXB0aW9uKGUpIHtcblx0aWYgKCEkKCcuYWwnKS5oYXNDbGFzcygnbW9kYWwnKSkge1xuXHRcdHZhciBmaWxlSW5mbyA9IGUudGFyZ2V0O1xuXHRcdHZhciBmaWxlSW5mb1RleHQgPSBmaWxlSW5mby5pbm5lckhUTUw7XG5cdFx0dmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcblx0XHQvL2lucHV0LnR5cGUgPSAndGV4dCdcblx0XHRpbnB1dC52YWx1ZSA9IGZpbGVJbmZvVGV4dDtcblxuXHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgaW5wdXQgPSBlLnRhcmdldDtcblx0XHRcdGZpbGVJbmZvID0gaW5wdXQucGFyZW50Tm9kZTtcblx0XHRcdGZpbGVJbmZvLnJlbW92ZUNoaWxkKGlucHV0KTtcblx0XHRcdGZpbGVJbmZvLmNsYXNzTGlzdC5yZW1vdmUoJ2VkaXQnKTtcblx0XHRcdGZpbGVJbmZvLmlubmVySFRNTCA9IGlucHV0LnZhbHVlO1xuXHRcdH0pO1xuXHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAxMyB8fCBlLndoaWNoID09IDEzKSB7XG5cdFx0XHRcdHZhciBpbnB1dCA9IGUudGFyZ2V0O1xuXHRcdFx0ZmlsZUluZm8gPSBpbnB1dC5wYXJlbnROb2RlO1xuXHRcdFx0ZmlsZUluZm8ucmVtb3ZlQ2hpbGQoaW5wdXQpO1xuXHRcdFx0ZmlsZUluZm8uY2xhc3NMaXN0LnJlbW92ZSgnZWRpdCcpO1xuXHRcdFx0ZmlsZUluZm8uaW5uZXJIVE1MID0gaW5wdXQudmFsdWU7XG5cdFx0XHR9XG5cblx0XHR9KTtcblxuXHRcdGZpbGVJbmZvLmlubmVySFRNTCA9ICcnO1xuXHRcdGZpbGVJbmZvLmFwcGVuZENoaWxkKGlucHV0KTtcblx0XHRmaWxlSW5mby5jbGFzc0xpc3QuYWRkKCdlZGl0Jyk7XG5cdFx0aW5wdXQuZm9jdXMoKTtcblx0fVxufVxuXG5cbmZ1bmN0aW9uIGRlbGV0ZUZpbGUoZmlsZSwgZmlsZXMpIHtcblx0ZmlsZXMgPSBmaWxlcy5zcGxpY2UoZmlsZXMuaW5kZXhPZihmaWxlKSwgMSk7XG59XG5mdW5jdGlvbiBkZWxldGVGaWxlQnlJZChpZCwgZmlsZXMpIHtcblx0dmFyIGZpbGUgPSBmaWxlQnlJZChpZCwgZmlsZXMpO1xuXHRkZWxldGVGaWxlKGZpbGUsIGZpbGVzKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlRGVsZXRlQ2xpY2soZSkge1xuXHR2YXIgaXRlbU5hbWUgPSAkKCcubWVudSAuaXMtYWN0aXZlJykudGV4dCgpLnRvTG93ZXJDYXNlKCk7XG5cdG5ldyBNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAnUmVtb3ZlIEFzc2V0PycsXG4gICAgICAgIHRleHQ6ICdTZWxlY3RlZCBhc3NldCB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGlzICcgKyBpdGVtTmFtZSArICcuIERvbuKAmXQgd29ycnksIGl0IHdvbuKAmXQgYmUgcmVtb3ZlZCBmcm9tIHRoZSBBc3NldCBMaWJyYXJ5LicsXG4gICAgICAgIGNvbmZpcm1UZXh0OiAnUmVtb3ZlJyxcbiAgICAgICAgY29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZmlsZUlkID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG4gICAgICAgICAgICBkZWxldGVGaWxlQnlJZChmaWxlSWQsIGdhbGxlcnlPYmplY3RzKTtcbiAgICAgICAgICAgIHVwZGF0ZUdhbGxlcnkoKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4kKCcuZmlsZS10aXRsZScpLmNsaWNrKGVkaXRGaWxlVGl0bGUpO1xuJCgnLmZpbGUtY2FwdGlvbicpLmNsaWNrKGVkaXRGaWxlQ2FwdGlvbik7XG5cbi8vRmlsZSB1cGxvYWRcbmZ1bmN0aW9uIGhhbmRsZUZpbGVzKGZpbGVzKSB7XG5cdHZhciBmaWxlc091dHB1dCA9IFtdO1xuXHRpZiAoZmlsZXMgJiYgZmlsZXMubGVuZ3RoID4wKSB7XG5cdFx0Zm9yICh2YXIgaT0wOyBpPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0ZmlsZXNPdXRwdXQucHVzaChmaWxlc1tpXSk7XG5cdFx0fVxuXHRcdC8vc2hvd0xvYWRlcigpO1xuXHRcdHZhciB1cGxvYWRlZEZpbGVzID0gZmlsZXNPdXRwdXQubWFwKGZ1bmN0aW9uKGYpIHtcblx0XHRcdHJldHVybiBmaWxlVG9PYmplY3QoZikudGhlbihmdW5jdGlvbihyZXMpIHtcblx0XHRcdFx0Z2FsbGVyeU9iamVjdHMucHVzaCh7XG5cdFx0XHRcdFx0ZmlsZURhdGE6IHJlcyxcblx0XHRcdFx0XHRzZWxlY3RlZDogZmFsc2UsXG5cdFx0XHRcdFx0cG9zaXRpb246IDEwMDAsXG5cdFx0XHRcdFx0Y2FwdGlvbjogJycsXG5cdFx0XHRcdFx0Z2FsbGVyeUNhcHRpb246IGZhbHNlLFxuXHRcdFx0XHRcdGp1c3RVcGxvYWRlZDogdHJ1ZSxcblx0XHRcdFx0XHRsb2FkaW5nOiB0cnVlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0UHJvbWlzZS5hbGwodXBsb2FkZWRGaWxlcykudGhlbihmdW5jdGlvbihyZXMpIHt1cGRhdGVHYWxsZXJ5KGdhbGxlcnlPYmplY3RzLmxlbmd0aCk7fSk7XG5cdH1cbn1cblxuLy9Db252ZXJ0IHVwbG9hZGVkIGZpbGVzIHRvIGVsZW1lbnRzXG5mdW5jdGlvbiBmaWxlVG9NYXJrdXAoZmlsZSkge1xuXHRyZXR1cm4gcmVhZEZpbGUoZmlsZSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcblx0XHR2YXIgZmlsZU5vZGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlJyksXG5cblx0XHRcdGZpbGVJbWcgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlLWltZycpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIHJlc3VsdC5zcmMgKyAnKScpLFxuXG5cdFx0XHRmaWxlQ29udHJvbHMgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlLWNvbnRyb2xzJykuY2xpY2sodG9nZ2xlRmlsZVNlbGVjdCksXG5cdFx0XHRjaGVja21hcmsgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjaGVja21hcmsnKS5jbGljayh0b2dnbGVGaWxlU2VsZWN0KSxcblx0XHRcdGNsb3NlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2xvc2UnKS5jbGljayhkZWxldGVGaWxlKSxcblx0XHRcdGVkaXQgPSAkKCc8YnV0dG9uPkVkaXQ8L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uIHdoaXRlT3V0bGluZScpLmNsaWNrKGVkaXRGaWxlKSxcblxuXHRcdFx0ZmlsZVRpdGxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdGl0bGUnKSxcblx0XHRcdGZpbGVUeXBlSWNvbiA9ICQoJzxpIGNsYXNzPVwiZmEgZmEtY2FtZXJhXCI+PC9pPicpLmNzcygnbWFyZ2luLXJpZ2h0JywgJzJweCcpLFxuXHRcdFx0ZmlsZVRpdGxlSW5wdXQgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIiAvPicpLnZhbChyZXN1bHQubmFtZSksXG5cblx0XHRcdGZpbGVDYXB0aW9uID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZS1jYXB0aW9uJykudGV4dChyZXN1bHQubmFtZSkuY2xpY2soZWRpdEZpbGVDYXB0aW9uKSxcblx0XHRcdGZpbGVJbmZvID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZS1pbmZvJykudGV4dChyZXN1bHQuaW5mbyksXG5cblx0XHRcdGZpbGVQdXJwb3NlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZS1wdXJwb3NlJyksXG5cdFx0XHRmaWxlUHVycG9zZVNlbGVjdCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3NlbGVjdCcpLmNsaWNrKG9wZW5TZWxlY3QpLFxuXHRcdFx0c2VsZWN0U3BhbiA9ICQoJzxzcGFuPlNlbGVjdCB1c2U8L3NwYW4+JyksXG5cdFx0XHRzZWxlY3RVbCA9ICQoJzx1bD48L3VsPicpLFxuXHRcdFx0c2VsZWN0TGkxID0gJCgnPGxpPkNvdmVyPC9saT4nKS5jbGljayhzZXRTZWxlY3QpLFxuXHRcdFx0c2VsZWN0TGkyID0gJCgnPGxpPlByaW1hcnk8L2xpPicpLmNsaWNrKHNldFNlbGVjdCksXG5cdFx0XHRzZWxlY3RMaTMgPSAkKCc8bGk+U2Vjb25kYXJ5PC9saT4nKS5jbGljayhzZXRTZWxlY3QpO1xuXG5cdFx0ZmlsZVRpdGxlLmFwcGVuZChmaWxlVHlwZUljb24sIGZpbGVUaXRsZUlucHV0KTtcblx0XHRzZWxlY3RVbC5hcHBlbmQoc2VsZWN0TGkxLCBzZWxlY3RMaTIsIHNlbGVjdExpMyk7XG5cdFx0ZmlsZVB1cnBvc2VTZWxlY3QuYXBwZW5kKHNlbGVjdFNwYW4sIHNlbGVjdFVsKTtcblxuXHRcdGZpbGVQdXJwb3NlLmFwcGVuZChmaWxlUHVycG9zZVNlbGVjdCk7XG5cdFx0ZmlsZUNvbnRyb2xzLmFwcGVuZChjaGVja21hcmssIGNsb3NlLCBlZGl0KTtcblx0XHRmaWxlSW1nLmFwcGVuZChmaWxlQ29udHJvbHMpO1xuXG5cdFx0ZmlsZU5vZGUuYXBwZW5kKGZpbGVJbWcsIGZpbGVUaXRsZSwgZmlsZUNhcHRpb24sIGZpbGVJbmZvLCBmaWxlUHVycG9zZSk7XG5cblx0XHRyZXR1cm4gZmlsZU5vZGU7XG5cdH0pO1xufVxuXG4vL0NvbnZlcnQgdXBsb2FkZWQgZmlsZSB0byBvYmplY3RcbmZ1bmN0aW9uIGZpbGVUb09iamVjdChmaWxlKSB7XG5cdHJldHVybiByZWFkRmlsZShmaWxlKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuXHRcdHJldHVybiB7XG5cdCAgICAgICAgdXJsOiByZXN1bHQuc3JjLFxuXHQgICAgICAgIGZvY2FsUG9pbnQ6IHtcblx0ICAgICAgICAgICAgbGVmdDogMC41LFxuXHQgICAgICAgICAgICB0b3A6IDAuNVxuXHQgICAgICAgIH0sXG5cdFx0XHRpZDogcmVzdWx0Lm5hbWUgKyAnICcgKyBuZXcgRGF0ZSgpLFxuXHRcdFx0ZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKCksXG5cdCAgICAgICAgY29sb3I6ICcnLC8vZmlsZUltZ0NvbG9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqZmlsZUltZ0NvbG9ycy5sZW5ndGgpXSxcblx0ICAgICAgICB0aXRsZTogcmVzdWx0Lm5hbWUsXG5cdCAgICAgICAgY2FwdGlvbjogJycsXG5cdCAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuXHQgICAgICAgIGhpZ2hSZXNvbHV0aW9uOiBmYWxzZSxcblx0ICAgICAgICBjYXRlZ29yaWVzOiAnJyxcblx0ICAgICAgICB0YWdzOiAnJyxcblx0ICAgICAgICBhbHRUZXh0OiAnJyxcblx0ICAgICAgICBjcmVkaXQ6ICcnLFxuXHQgICAgICAgIGNvcHlyaWdodDogJycsXG5cdCAgICAgICAgcmVmZXJlbmNlOiB7XG5cdCAgICAgICAgICAgIHNlcmllczogJycsXG5cdCAgICAgICAgICAgIHNlYXNvbjogJycsXG5cdCAgICAgICAgICAgIGVwaXNvZGU6ICcnXG5cdCAgICAgICAgfSxcblx0XHRcdHR5cGU6ICdpbWFnZSdcblx0ICAgIH07XG5cdH0pO1xufVxuXG4vL1JlYWQgZmlsZSBhbmQgcmV0dXJuIHByb21pc2VcbmZ1bmN0aW9uIHJlYWRGaWxlKGZpbGUpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKFxuXHRcdGZ1bmN0aW9uKHJlcywgcmVqKSB7XG5cdFx0XHR2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0XHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdHJlcyh7c3JjOiBlLnRhcmdldC5yZXN1bHQsXG5cdFx0XHRcdFx0bmFtZTogZmlsZS5uYW1lLFxuXHRcdFx0XHRcdGluZm86IGZpbGUudHlwZSArICcsICcgKyBNYXRoLnJvdW5kKGZpbGUuc2l6ZS8xMDI0KS50b1N0cmluZygpICsgJyBLYid9KTtcblx0XHRcdH07XG5cdFx0XHRyZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZWoodGhpcyk7XG5cdFx0XHR9O1xuXHRcdFx0cmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG5cdFx0fVxuXHQpO1xufVxuXG4vL0xvYWRlcnNcbmZ1bmN0aW9uIHNob3dMb2FkZXIoKSB7XG5cdHZhciBtb2RhbCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsJykuYXR0cignaWQnLCAnbG9hZGVyTW9kYWwnKSxcblx0XHRsb2FkZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdsb2FkZXInKTtcblxuXHRtb2RhbC5hcHBlbmQobG9hZGVyKTtcblx0JCgnYm9keScpLmFwcGVuZChtb2RhbCk7XG59XG5mdW5jdGlvbiBoaWRlTG9hZGVyKCkge1xuXHQkKCcjbG9hZGVyTW9kYWwnKS5yZW1vdmUoKTtcbn1cblxuLy9EcmFnIGFuZCBkcm9wIGZpbGVzXG5mdW5jdGlvbiBoYW5kbGVEcmFnRW50ZXIoZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0ZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwiY29weVwiO1xuXHQkKCcjZHJvcFpvbmUnKS5hZGRDbGFzcygnbW9kYWwnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZHJvcFpvbmVcIikuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgaGFuZGxlRHJhZ0xlYXZlLCB0cnVlKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZURyYWdMZWF2ZShlKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0JChcIiNkcm9wWm9uZVwiKS5yZW1vdmVDbGFzcygnbW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid3JhcHBlclwiKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2NrZWQnKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZURyb3AoZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0JChcIiNkcm9wWm9uZVwiKS5yZW1vdmVDbGFzcygnbW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdHZhciBmaWxlcyA9IGUuZGF0YVRyYW5zZmVyLmZpbGVzO1xuXHRpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuXHRcdGhhbmRsZUZpbGVzKGZpbGVzKTtcblx0fVxufVxuZnVuY3Rpb24gaGFuZGxlRHJhZ092ZXIoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufVxuXG4vL1VwbG9hZCBmaWxlIGZyb20gXCJVcGxvYWQgRmlsZVwiIEJ1dHRvblxuZnVuY3Rpb24gaGFuZGxlVXBsb2FkRmlsZXNDbGljayhlKSB7XG5cdHZhciBmaWxlc0lucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlc0lucHV0XCIpO1xuICAgIGlmICghZmlsZXNJbnB1dCkge1xuICAgIFx0ZmlsZXNJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgZmlsZXNJbnB1dC50eXBlID0gXCJmaWxlXCI7XG4gICAgICAgIGZpbGVzSW5wdXQubXVsdGlwbGUgPSBcInRydWVcIjtcbiAgICAgICAgZmlsZXNJbnB1dC5oaWRkZW4gPSB0cnVlO1xuICAgICAgICBmaWxlc0lucHV0LmFjY2VwdCA9IFwiaW1hZ2UvKiwgYXVkaW8vKiwgdmlkZW8vKlwiO1xuICAgICAgICBmaWxlc0lucHV0LmlkID0gXCJmaWxlc0lucHV0XCI7XG4gICAgICAgIGZpbGVzSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICBoYW5kbGVGaWxlcyhlLnRhcmdldC5maWxlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmaWxlc0lucHV0KTtcbiAgICB9XG4gICAgZmlsZXNJbnB1dC5jbGljaygpO1xufVxuXG4vL1Rvb2x0aXBcbmZ1bmN0aW9uIGNyZWF0ZVRvb2x0aXAodGFyZ2V0LCB0ZXh0KSB7XG4gICAgdmFyIHRvb2x0aXAgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCd0b29sdGlwJyksXG4gICAgICAgIHRvb2x0aXBUZXh0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygndG9vbHRpcF9fdGV4dCcpLnRleHQodGV4dCksXG4gICAgICAgIHRvb2x0aXBUb2dnbGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCd0b29sdGlwX190b2dnbGUnKSxcbiAgICAgICAgdG9vbHRpcFRvZ2dsZV9Ub2dnbGUgPSAkKCc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJuZXZlclNob3dUb29sdGlwXCIgLz4nKSwvLy5vbignY2hhbmdlJywgbmV2ZXJTaG93VG9vbHRpcCksXG4gICAgICAgIHRvb2x0aXBUb2dnbGVfTGFiZWwgPSAkKCc8bGFiZWwgZm9yPVwibmV2ZXJTaG93VG9vbHRpcFwiPkdvdCBpdCwgZG9uXFwndCBzaG93IG1lIHRoaXMgYWdhaW48L2xhYmVsPicpO1xuXG4gICAgdG9vbHRpcFRvZ2dsZS5hcHBlbmQodG9vbHRpcFRvZ2dsZV9Ub2dnbGUsIHRvb2x0aXBUb2dnbGVfTGFiZWwpO1xuICAgIHRvb2x0aXBUb2dnbGUuYmluZCgnZm9jdXMgY2xpY2sgY2hhbmdlJywgbmV2ZXJTaG93VG9vbHRpcCk7XG4gICAgdG9vbHRpcC5hcHBlbmQodG9vbHRpcFRleHQsIHRvb2x0aXBUb2dnbGUpO1xuICAgICQoJy5maWxlX19jYXB0aW9uLXRleHRhcmVhJykucmVtb3ZlQXR0cignaWQnKTtcbiAgICAkKHRhcmdldCkucGFyZW50KCkuYXBwZW5kKHRvb2x0aXApO1xuICAgIHRhcmdldC5hdHRyKCdpZCcsICdhY3RpdmUtY2FwdGlvbi10ZXh0YXJlYScpO1xuXG4gICAgdG9vbHRpcC53aWR0aCh0YXJnZXQud2lkdGgoKSk7XG4gICAgaWYgKCQoJ2JvZHknKS53aWR0aCgpIC0gdGFyZ2V0Lm9mZnNldCgpLmxlZnQgLSB0YXJnZXQud2lkdGgoKSAtIHRhcmdldC53aWR0aCgpIC0gMjAgPiAwICkge1xuICAgICAgICB0b29sdGlwLmNzcygnbGVmdCcsIHRhcmdldC5wb3NpdGlvbigpLmxlZnQgKyB0YXJnZXQud2lkdGgoKSArIDEwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0b29sdGlwLmNzcygnbGVmdCcsIHRhcmdldC5wb3NpdGlvbigpLmxlZnQgLSB0YXJnZXQud2lkdGgoKSAtIDEwKTtcbiAgICB9XG4gICAgLy92YXIgbm90SW5jbHVkZSA9IHRvb2x0aXAuYWRkKHRvb2x0aXBUZXh0KS5hZGQodG9vbHRpcFRvZ2dsZSkuYWRkKHRvb2x0aXBUb2dnbGVfTGFiZWwpLmFkZCh0b29sdGlwVG9nZ2xlX1RvZ2dsZSkuYWRkKHRhcmdldCk7XG4gICAgY29uc29sZS5sb2coJCgnI2FjdGl2ZS1jYXB0aW9uLXRleHRhcmVhJykpO1xuICAgICQoJy5jdCwgLm1lbnUnKS5vbihjbG9zZVRvb2x0aXApLmZpbmQoJyNhY3RpdmUtY2FwdGlvbi10ZXh0YXJlYSwgLnRvb2x0aXAsIC50b29sdGlwIGlucHV0LCAudG9vbHRpcCBsYWJlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtlLnN0b3BQcm9wYWdhdGlvbigpO30pO1xufVxuXG5mdW5jdGlvbiBuZXZlclNob3dUb29sdGlwKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9vbHRpcCcsIHRydWUpO1xuICAgIGNsb3NlVG9vbHRpcCgpO1xufVxuXG5mdW5jdGlvbiBjbG9zZVRvb2x0aXAoZSkge1xuICAgIGlmIChlKSB7ZS5zdG9wUHJvcGFnYXRpb24oKTt9XG5cbiAgICBjb25zb2xlLmxvZygnY2xvc2V0b29sdGlwJywgZSk7XG4gICAgJCgnLmN0LCAubWVudScpLnVuYmluZCgnY2xpY2snLCBjbG9zZVRvb2x0aXApO1xuICAgIHZhciB0b29sdGlwcyA9ICQoJy50b29sdGlwJyk7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRvb2x0aXBzLnJlbW92ZSgpO1xuICAgIH0sIDMwMCk7XG59XG5cbi8vTW9kYWwgUHJvbXB0cyBhbmQgV2luZG93c1xuZnVuY3Rpb24gY2xvc2VFZGl0U2NyZWVuKCkge1xuICAkKCcucHInKS5yZW1vdmVDbGFzcygnbW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICQoJy5wciAucHJldmlldycpLnJlbW92ZUNsYXNzKCdmb2NhbCBsaW5lIGZ1bGwgcmVjdCBwb2ludCcpO1xuICAkKCcuZm9jYWxQb2ludCcpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICQoJy5mb2NhbFJlY3QnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAkKCcjZm9jYWxQb2ludFRvZ2dsZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJCgnI2ZvY2FsUmVjdFRvZ2dsZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJCgnLnB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZSAucHVycG9zZS1pbWcnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAkKCcuY3QgLmZpbGUnKS5maW5kKCdidXR0b24nKS5jc3MoJ2Rpc3BsYXknLCAnJyk7XG4gIGRlc2VsZWN0QWxsKCk7XG4gICQoJyN3cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ292ZXJmbG93Jyk7XG4gICQoJ2JvZHknKS5zY3JvbGxUb3Aoc2Nyb2xsUG9zaXRpb24pO1xufVxuXG5mdW5jdGlvbiBzaG93TW9kYWxQcm9tcHQob3B0aW9ucykge1xuICB2YXIgbW9kYWxDbGFzcyA9IG9wdGlvbnMuZGlhbG9nID8gJ21vZGFsIG1vZGFsLS1wcm9tcHQgbW9kYWwtLWRpYWxvZycgOiAnbW9kYWwgbW9kYWwtLXByb21wdCcsXG4gIHNlY0J1dHRvbkNsYXNzID0gb3B0aW9ucy5kaWFsb2cgPyAnYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXknIDogJ2J1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS13aGl0ZScsXG4gIGNsb3NlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX2Nsb3NlJykuY2xpY2sob3B0aW9ucy5jYW5jZWxBY3Rpb24pLFxuICBtb2RhbCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MobW9kYWxDbGFzcyksXG4gIHRpdGxlID0gb3B0aW9ucy50aXRsZSA/ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX190aXRsZScpLnRleHQob3B0aW9ucy50aXRsZSkgOiBudWxsLFxuICB0ZXh0ID0gb3B0aW9ucy50ZXh0ID8gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX3RleHQnKS50ZXh0KG9wdGlvbnMudGV4dCkgOiBudWxsLFxuICBjb250cm9scyA9IG9wdGlvbnMuY29uZmlybUFjdGlvbiB8fCBvcHRpb25zLmNhbmNlbEFjdGlvbiA/ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX19jb250cm9scycpIDogbnVsbCxcbiAgY29uZmlybUJ1dHRvbiA9IG9wdGlvbnMuY29uZmlybUFjdGlvbiA/ICQoJzxidXR0b24+PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbiAgYnV0dG9uX3N0eWxlX291dGxpbmUtYWNjZW50JykudGV4dChvcHRpb25zLmNvbmZpcm1UZXh0IHx8ICdPaycpLmNsaWNrKG9wdGlvbnMuY29uZmlybUFjdGlvbikgOiBudWxsLFxuICBjYW5jZWxCdXR0b24gPSBvcHRpb25zLmNhbmNlbEFjdGlvbiA/ICQoJzxidXR0b24+PC9idXR0b24+JykuYWRkQ2xhc3Moc2VjQnV0dG9uQ2xhc3MpLnRleHQob3B0aW9ucy5jYW5jZWxUZXh0IHx8ICdOZXZlcm1pbmQnKS5jbGljayhvcHRpb25zLmNhbmNlbEFjdGlvbikgOiBudWxsO1xuXG4gIGNvbnRyb2xzLmFwcGVuZChjb25maXJtQnV0dG9uLCBjYW5jZWxCdXR0b24pO1xuICBtb2RhbC5hcHBlbmQoY2xvc2UsIHRpdGxlLCB0ZXh0LCBjb250cm9scyk7XG4gICQoJ2JvZHknKS5hcHBlbmQobW9kYWwpO1xuICBzZXRNb2RhbEtleWJvYXJkQWN0aW9ucyhvcHRpb25zLmNvbmZpcm1BY3Rpb24sIG9wdGlvbnMuY2FuY2VsQWN0aW9uKTtcbn1cblxuZnVuY3Rpb24gaGlkZU1vZGFsUHJvbXB0KCkge1xuICAkKCcub3AubW9kYWwsIC5vcC5kaWFsb2csIC5tb2RhbC5tb2RhbC0tcHJvbXB0JykucmVtb3ZlKCk7XG4gICQoZG9jdW1lbnQpLnVuYmluZCgna2V5ZG93bicpO1xufVxuZnVuY3Rpb24gc2V0TW9kYWxLZXlib2FyZEFjdGlvbnMoZW50ZXIsIGNsb3NlKSB7XG4gIGhhbmRsZUVzY0tleWRvd24gPSBmdW5jdGlvbihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmJvZHkgJiYgZS5rZXlDb2RlID09PSAyNykge2Nsb3NlKCk7fVxuICB9O1xuICBoYW5kbGVFbnRlcktleWRvd24gPSBmdW5jdGlvbihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmJvZHkgJiYgZS5rZXlDb2RlID09PSAxMykge2VudGVyKCk7fVxuICB9O1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG59XG5mdW5jdGlvbiBoYW5kbGVFc2NLZXlkb3duKGUpIHtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgLy9pZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmJvZHkgJiYgZS5rZXlDb2RlID09PSAyNykge2Nsb3NlKCk7fVxufVxuZnVuY3Rpb24gaGFuZGxlRW50ZXJLZXlkb3duKGUpIHtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgLy9pZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmJvZHkgJiYgZS5rZXlDb2RlID09PSAxMykge2VudGVyKCk7fVxufVxuXG5mdW5jdGlvbiBNb2RhbChvcHRpb25zKSB7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgdGhpcy5faW5pdCgpO1xuICB0aGlzLl9pbml0RXZlbnRzKCk7XG59XG5cbk1vZGFsLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm1vZGFsID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuZGlhbG9nID8gJ21vZGFsIG1vZGFsLS1wcm9tcHQgbW9kYWwtLWRpYWxvZycgOiAnbW9kYWwgbW9kYWwtLXByb21wdCBtb2RhbC0tZnVsbCcpO1xuXG4gIHRoaXMuY2xvc2VCdXR0b24gPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fY2xvc2UnKTtcbiAgdGhpcy50aXRsZSA9IHRoaXMub3B0aW9ucy50aXRsZSA/ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX190aXRsZScpLnRleHQodGhpcy5vcHRpb25zLnRpdGxlKSA6IG51bGw7XG4gIHRoaXMudGV4dCA9IHRoaXMub3B0aW9ucy50ZXh0ID8gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX3RleHQnKS50ZXh0KHRoaXMub3B0aW9ucy50ZXh0KSA6IG51bGw7XG5cbiAgdGhpcy5jb250cm9scyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX19jb250cm9scycpO1xuICBpZiAoIXRoaXMub3B0aW9ucy5vbmx5Q2FuY2VsKSB7XG4gICAgdGhpcy5jb25maXJtQnV0dG9uID0gJCgnPGJ1dHRvbiAvPicpLmFkZENsYXNzKCdidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtYWNjZW50JykudGV4dCh0aGlzLm9wdGlvbnMuY29uZmlybVRleHQgfHwgJ09rJyk7XG4gICAgdGhpcy5jb250cm9scy5hcHBlbmQodGhpcy5jb25maXJtQnV0dG9uKTtcbiAgfVxuICBpZiAoIXRoaXMub3B0aW9ucy5vbmx5Q29uZmlybSkge1xuICAgIHRoaXMuY2FuY2VsQnV0dG9uID0gJCgnPGJ1dHRvbiAvPicpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5kaWFsb2cgPyAnYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXknIDogJ2J1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS13aGl0ZScpLnRleHQodGhpcy5vcHRpb25zLmNhbmNlbFRleHQgfHwgJ05ldmVybWluZCcpO1xuICAgIHRoaXMuY29udHJvbHMuYXBwZW5kKHRoaXMuY2FuY2VsQnV0dG9uKTtcbiAgfVxuXG4gIHRoaXMubW9kYWwuYXBwZW5kKHRoaXMuY2xvc2VCdXR0b24sIHRoaXMudGl0bGUsIHRoaXMudGV4dCwgdGhpcy5jb250cm9scyk7XG4gICQoJ2JvZHknKS5hcHBlbmQodGhpcy5tb2RhbCk7XG59O1xuXG5Nb2RhbC5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG4gIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFbnRlcktleWRvd24pO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNvbmZpcm1hdGlvbigpIHtcbiAgICBpZiAoc2VsZi5vcHRpb25zLmNvbmZpcm1BY3Rpb24pIHtzZWxmLm9wdGlvbnMuY29uZmlybUFjdGlvbigpO31cbiAgICBzZWxmLm1vZGFsLnJlbW92ZSgpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBzZWxmLmhhbmRsZUtleURvd24sIHRydWUpO1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZUNhbmNlbGF0aW9uKCkge1xuICAgIGlmIChzZWxmLm9wdGlvbnMuY2FuY2VsQWN0aW9uKSB7c2VsZi5vcHRpb25zLmNhbmNlbEFjdGlvbigpO31cbiAgICBzZWxmLm1vZGFsLnJlbW92ZSgpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBzZWxmLmhhbmRsZUtleURvd24sIHRydWUpO1xuICB9XG5cbiAgc2VsZi5oYW5kbGVLZXlEb3duID0gZnVuY3Rpb24oZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKCFzZWxmLm9wdGlvbnMub25seUNhbmNlbCkge1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtoYW5kbGVDYW5jZWxhdGlvbigpO31cbiAgICB9XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtoYW5kbGVDb25maXJtYXRpb24oKTt9XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gMjcpIHtoYW5kbGVDYW5jZWxhdGlvbigpO31cbiAgfTtcblxuICBpZiAoc2VsZi5jYW5jZWxCdXR0b24pIHtzZWxmLmNhbmNlbEJ1dHRvbi5jbGljayhoYW5kbGVDYW5jZWxhdGlvbik7fVxuICBpZiAoc2VsZi5jb25maXJtQnV0dG9uKSB7c2VsZi5jb25maXJtQnV0dG9uLmNsaWNrKGhhbmRsZUNvbmZpcm1hdGlvbik7fVxuICBzZWxmLmNsb3NlQnV0dG9uLmNsaWNrKGhhbmRsZUNhbmNlbGF0aW9uKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHNlbGYuaGFuZGxlS2V5RG93biwgdHJ1ZSk7XG59O1xuXG4vL0Fzc2V0IGxpYnJhcnlcbnZhciBhc3NldExpYnJhcnlPYmplY3RzID0gW1xuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS0yLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0yLmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtMi5qcGcnLFxuICAgIGNhcHRpb246ICcwNS4gRG9uXFwndCBHZXQgTG9zdCcsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS0zLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0zLmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtMy5qcGcnLFxuICAgIGNhcHRpb246ICcwMi4gVGhlIE1hbiBpbiB0aGUgU2hhZG93cycsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS00LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS00LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtNC5qcGcnLFxuICAgIGNhcHRpb246ICcwMy4gVGhlIEZpcnN0IFNsaWNlJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWVwaXNvZGUtNS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItZXBpc29kZS01LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItZXBpc29kZS01LmpwZycsXG4gICAgY2FwdGlvbjogJzAxLiBBIE5ldyBWaXNpdG9yJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTUuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTUuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS01LmpwZycsXG4gICAgY2FwdGlvbjogJzA0LiBUaGUgQmxvb2QgTW9vbicsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS0xMC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtMTAuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS0xMC5qcGcnLFxuICAgIGNhcHRpb246ICcwMy4gVGhlIEZpcnN0IFNsaWNlJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTEzLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0xMy5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTEzLmpwZycsXG4gICAgY2FwdGlvbjogJzAxLiBBIE5ldyBWaXNpdG9yJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTE1LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0xNS5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTE1LmpwZycsXG4gICAgY2FwdGlvbjogJzAxLiBBIE5ldyBWaXNpdG9yJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTExLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0xMS5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTExLmpwZycsXG4gICAgY2FwdGlvbjogJzA2LiBBbGwgQWxvbmUnLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtOS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtOS5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTkuanBnJyxcbiAgICBjYXB0aW9uOiAnMDQuIFRoZSBCbG9vZCBNb29uJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTguanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTguanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS04LmpwZycsXG4gICAgY2FwdGlvbjogJzA0LiBUaGUgQmxvb2QgTW9vbicsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS02LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS02LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtNi5qcGcnLFxuICAgIGNhcHRpb246ICcwNi4gQWxsIEFsb25lJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAxLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnYXp0ZWNfdGVtcGxlLnBuZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDEuanBnJyxcbiAgICBjYXB0aW9uOiAnV3JpdGVyLCBCcmlhbiBNaWxsaWtpbiwgYSBtYW4gYWJvdXQgSGF2ZW4sIHRha2VzIHVzIGJlaGluZCB0aGUgc2NlbmVzIG9mIHRoaXMgZXBpc29kZSBhbmQgZ2l2ZXMgdXMgYSBmZXcgdGVhc2VzIGFib3V0IHRoZSBTZWFzb24gdGhhdCB3ZSBjYW5cXCd0IHdhaXQgdG8gc2VlIHBsYXkgb3V0ISBUaGlzIGlzIHRoZSBmaXJzdCBlcGlzb2RlIG9mIEhhdmVuIG5vdCBmaWxtZWQgaW4gb3IgYXJvdW5kIENoZXN0ZXIsIE5vdmEgU2NvdGlhLiBCZWdpbm5pbmcgaGVyZSwgdGhlIHNob3cgYW5kIGl0cyBzdGFnZXMgcmVsb2NhdGVkIHRvIEhhbGlmYXguJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDIuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdiaWdfYmVuLnBuZyA0M2RlZnF3ZScsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNGREJEMDAnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMi5qcGcnLFxuICAgIGNhcHRpb246ICdDaGFybG90dGUgbGF5cyBvdXQgaGVyIHBsYW4gZm9yIHRoZSBmaXJzdCB0aW1lIGluIHRoaXMgZXBpc29kZTogdG8gYnVpbGQgYSBuZXcgQmFybiwgb25lIHRoYXQgd2lsbCBjdXJlIFRyb3VibGVzIHdpdGhvdXQga2lsbGluZyBUcm91YmxlZCBwZW9wbGUgaW4gdGhlIHByb2Nlc3MuIEhlciBwbGFuLCBhbmQgd2hhdCBwYXJ0cyBpdCByZXF1aXJlcywgd2lsbCBjb250aW51ZSB0byBwbGF5IGEgbW9yZSBhbmQgbW9yZSBpbXBvcnRhbnQgcm9sZSBhcyB0aGUgc2Vhc29uIGdvZXMgYWxvbmcuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAzLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnY2hyaXN0X3RoZV9yZWRlZW1lci5wbmcgMDkybmx4bmMnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjRUQ0MTJEJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDMuanBnJyxcbiAgICBjYXB0aW9uOiAnTG9zdCB0aW1lIHBsYXlzIGFuIGV2ZW4gbW9yZSBpbXBvcnRhbnQgcm9sZSBpbiB0aGlzIGVwaXNvZGUgdGhhbiBldmVyIGJlZm9yZeKAlCBhcyBpdOKAmXMgcmV2ZWFsZWQgdGhhdCBpdOKAmXMgYSB3ZWFwb24gdGhlIGdyZWF0IGV2aWwgZnJvbSBUaGUgVm9pZCBoYXMgYmVlbiB1c2luZyBhZ2FpbnN0IHVzLCBhbGwgc2Vhc29uIGxvbmcuIFdoaWNoIGdvZXMgYmFjayB0byB0aGUgY2F2ZSB1bmRlciB0aGUgbGlnaHRob3VzZSBpbiBiZWdpbm5pbmcgb2YgdGhlIFNlYXNvbiA1IHByZW1pZXJlLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdMb3N0IHRpbWUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wNC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ2NvbG9zc2V1bS5wbmcgLTRyanhuc2snLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjMzJBNEI3JyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDQuanBnJyxcbiAgICBjYXB0aW9uOiAnVGhlIOKAnGFldGhlciBjb3Jl4oCdIHRoYXQgQ2hhcmxvdHRlIGFuZCBBdWRyZXkgbWFrZSBwcmVzZW50ZWQgYW4gaW1wb3J0YW50IGRlc2lnbiBjaG9pY2UuIFRoZSB3cml0ZXJzIHdhbnRlZCBpdCB0byBsb29rIG9yZ2FuaWMgYnV0IGFsc28gZGVzaWduZWTigJQgbGlrZSB0aGUgdGVjaG5vbG9neSBvZiBhbiBhZHZhbmNlZCBjdWx0dXJlIGZyb20gYSBkaWZmZXJlbnQgZGltZW5zaW9uLCBjYXBhYmxlIG9mIGRvaW5nIHRoaW5ncyB0aGF0IHdlIG1pZ2h0IHBlcmNlaXZlIGFzIG1hZ2ljIGJ1dCB3aGljaCBpcyBqdXN0IHNjaWVuY2UgdG8gdGhlbS4gVGhlIHZhcmlvdXMgZGVwaWN0aW9ucyBvZiBLcnlwdG9uaWFuIHNjaWVuY2UgaW4gdmFyaW91cyBTdXBlcm1hbiBzdG9yaWVzIHdhcyBvbmUgaW5zcGlyYXRpb24uJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZSBhbmQgQXVkcmV5JyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDUuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdlYXN0ZXJfaXNsYW5kLnBuZyBubG40bmthMCcsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDEwLCAyNSksXG4gICAgY29sb3I6ICcjRDNFQ0VDJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDUuanBnJyxcbiAgICBjYXB0aW9uOiAnVGhpcyBpcyB0aGUgZmlyc3QgZXBpc29kZSBpbiBTZWFzb24gNSBpbiB3aGljaCB3ZeKAmXZlIGxvc3Qgb25lIG9mIG91ciBoZXJvZXMuIEl0IHdhcyBpbXBvcnRhbnQgdG8gaGFwcGVuIGFzIHdlIGhlYWQgaW50byB0aGUgaG9tZSBzdHJldGNoIG9mIHRoZSBzaG93IGFuZCBhcyB0aGUgc3Rha2VzIGluIEhhdmVuIGhhdmUgbmV2ZXIgYmVlbiBtb3JlIGRpcmUuIEFzIGEgcmVzdWx0LCBpdCB3b27igJl0IGJlIHRoZSBsYXN0IGxvc3Mgd2VcXCdsbCBzdWZmZXIgdGhpcyBzZWFzb27igKYnLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnV2lsZCBDYXJkJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDYuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdweXJhbWlkcy5wbmcgZmRieTY0JyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTAsIDI1KSxcbiAgICBjb2xvcjogJyMyQTdDOTEnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wNi5qcGcnLFxuICAgIGNhcHRpb246ICdUaGUgY2hhbGxlbmdlIGluIENoYXJsb3R0ZVxcJ3MgZmluYWwgY29uZnJvbnRhdGlvbiB3YXMgdGhhdCB0aGUgc2hvdyBjb3VsZG7igJl0IHJldmVhbCBoZXIgYXR0YWNrZXLigJlzIGFwcGVhcmFuY2UgdG8gdGhlIGF1ZGllbmNlLCBzbyB0aGUgZGFya25lc3Mgd2FzIG5lY2Vzc2l0YXRlZC4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcblxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wMS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3Nhbl9mcmFuY2lzb19icmlkZ2UucG5nIDQyMzRmZjUyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTAsIDI1KSxcbiAgICBjb2xvcjogJyM5Njc4NDAnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wMS5qcGcnLFxuICAgIGNhcHRpb246ICdXYXJuaW5nOiBJZiB5b3UgZG9uXFwndCB3YW50IHRvIGtub3cgd2hhdCBoYXBwZW5lZCBpbiB0aGlzIGVwaXNvZGUsIGRvblxcJ3QgcmVhZCB0aGlzIHBob3RvIHJlY2FwISBEYXZlIGp1c3QgaGFkIGFub3RoZXIgdmlzaW9uIGFuZCB0aGlzIHRpbWUsIGhlXFwncyBiZWluZyBwcm9hY3RpdmUgYWJvdXQgaXQuIEhlIGFuZCBWaW5jZSBkYXNoIG91dCBvZiB0aGUgaG91c2UgdG8gc2F2ZSB0aGUgbGF0ZXN0IHZpY3RpbXMgb2YgQ3JvYXRvYW4sIGEuay5hIHRoZSBObyBNYXJrcyBLaWxsZXIuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAyLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc3RvbmVfaGVuZ2UucG5nIDQ5MG1ubWFiZCcsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDEwLCAyNSksXG4gICAgY29sb3I6ICcjNTY2Rjc4JyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDIuanBnJyxcbiAgICBjYXB0aW9uOiAnTWVhbndoaWxlLCBEd2lnaHQgYW5kIE5hdGhhbiBnbyBkb3dudG93biB0byBpbnZlc3RpZ2F0ZSB3aGF0IHRoZXkgdGhpbmsgaXMgYSBkcnVua2VuIG1hbiBjYXVzaW5nIGEgZGlzdHVyYmFuY2UgYnV0IGl0IHR1cm5zIG91dCB0aGF0IHRoZSBndXkgaXMgY3Vyc2VkLiBUaGVyZSBpcyBhIHJvbWFuIG51bWVyYWwgb24gaGlzIHdyaXN0IGFuZCwgYXMgdGhleSB3YXRjaCwgaW52aXNpYmxlIGhvcnNlcyB0cmFtcGxlIGhpbS4gTGF0ZXIsIE5hdGhhbiBhbmQgRHdpZ2h0IGZpbmQgYW5vdGhlciBtYW4gd2hvIGFwcGVhcnMgdG8gaGF2ZSBiZWVuIHN0cnVjayBieSBsaWdodGVuaW5nIOKAkyBidXQgdGhlcmUgaGFkIGJlZW4gbm8gcmVjZW50IHN0b3JtIGluIHRvd24g4oCTIGFuZCBkcm9wcGVkIGZyb20gYSBza3lzY3JhcGVyLiBTa3lzY3JhcGVycyBpbiBIYXZlbj8gQWJzdXJkLiBBbmQgdGhlIGd1eSBhbHNvIGhhcyBhIG15c3RlcmlvdXMgUm9tYW4gbnVtZXJhbCB0YXR0b28gb24gaGlzIHdyaXN0LiBOYXRoYW4gYW5kIER3aWdodCBmaW5kIGEgbGlzdCBvZiBuYW1lcyBpbiB0aGUgZ3V5XFwncyBwb2NrZXQgdGhhdCBsZWFkcyB0aGVtIHRvIGEgbG9jYWwgZm9ydHVuZSB0ZWxsZXIsIExhaW5leS4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDMuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzeWRuZXlfb3BlcmFfaG91c2UucG5nIDBzZWQ2N2gnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMCwgMjUpLFxuICAgIGNvbG9yOiAnIzJFMUQwNycsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAzLmpwZycsXG4gICAgY2FwdGlvbjogJ0J5IGZvbGxvd2luZyB0aGUgY2x1ZXMgZnJvbSBEYXZlXFwncyB2aXNpb24sIGhlIGFuZCBWaW5jZSBmaW5kIHRoZSBzY2VuZSBvZiB0aGUgTm8gTWFyayBLaWxsZXJcXCdzIG1vc3QgcmVjZW50IGNyaW1lLiBUaGV5IGFsc28gZmluZCBhIHN1cnZpdm9yLiBVbmZvcnR1bmF0ZWx5LCBzaGUgY2FuXFwndCByZW1lbWJlciBhbnl0aGluZy4gSGVyIG1lbW9yeSBoYXMgYmVlbiB3aXBlZCwgd2hpY2ggZ2V0cyB0aGVtIHRvIHRoaW5raW5nIGFib3V0IHdobyBtYXkgYmUgbmV4dCBvbiBDcm9hdG9hblxcJ3MgbGlzdC4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDQuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd0YWpfbWFoYWwucG5nIDk0M25ia2EnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMCwgMjUpLFxuICAgIGNvbG9yOiAnIzAwNDQ1RicsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA0LmpwZycsXG4gICAgY2FwdGlvbjogJ09uIHRoZWlyIHdheSB0byBtZWV0IHdpdGggTGFpbmV5LCBOYXRoYW4gYnJlYWtzIGhpcyB0aXJlIGlyb24gd2hpbGUgdHJ5aW5nIHRvIGZpeCBhIGZsYXQgdGlyZS4gVG91Z2ggYnJlYWsuIEFuZCB0aGVuIER3aWdodCBnZXRzIGEgc2hvb3RpbmcgcGFpbiBpbiBoaXMgc2lkZSB3aXRoIGEgZ25hcmx5IGJydWlzZSB0byBtYXRjaCwgZXZlbiB0b3VnaGVyIGJyZWFrLiBBbmQgdGhlbiBib3RoIGd1eXMgbm90aWNlIHRoYXQgdGhleSBub3cgaGF2ZSBSb21hbiBudW1lcmFsIHRhdHRvb3Mgb24gdGhlaXIgd3Jpc3RzLiBUaGUgbnVtYmVyIFggZm9yIE5hdGhhbiBhbmQgWElJIGZvciBEd2lnaHQuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA1LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnd2luZG1pbGwucG5nIGplcmwzNCcsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxMSksXG4gICAgY29sb3I6ICcjMkYzODM3JyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDUuanBnJyxcbiAgICBjYXB0aW9uOiAnSW4gdGhlIG1pbmVzaGFmdCwgQ2hhcmxvdHRlIGFuZCBBdWRyZXkgaGF2ZSB0YWtlbiBvbiB0aGUgdGFzayBvZiBjb2xsZWN0aW5nIGFsbCBvZiB0aGUgYWV0aGVyIHRvIGNyZWF0ZSBhbiBhZXRoZXIgY29yZS4gVGhpcyBpcyB0aGUgZmlyc3Qgc3RlcCB0aGV5IG5lZWQgdG8gY3JlYXRlIGEgbmV3IEJhcm4gd2hlcmUgVHJvdWJsZSBwZW9wbGUgY2FuIHN0ZXAgaW5zaWRlIGFuZCB0aGVuIGJlIFwiY3VyZWRcIiBvZiB0aGVpciBUcm91YmxlcyB3aGVuIHRoZXkgc3RlcCBvdXQuIFNvdW5kcyBlYXN5IGVub3VnaCBidXQgdGhleVxcJ3JlIGhhdmluZyB0cm91YmxlIGNvcnJhbGxpbmcgYWxsIHRoZSBhZXRoZXIgaW50byBhIGdpYW50IGJhbGwuIFVuc3VycHJpc2luZ2x5LCB0aGUgc3dpcmxpbmcgYmxhY2sgZ29vIGlzblxcJ3Qgd2lsbGZ1bGx5IGNvb3BlcmF0aW5nLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3RyZWVfMS5wbmcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTQpLFxuICAgIGNvbG9yOiAnIzYzNjI0QycsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA2LmpwZycsXG4gICAgY2FwdGlvbjogJ0FzIGlmIHRoZSBhZXRoZXIgd2FzblxcJ3QgZW5vdWdoIG9mIGEgcHJvYmxlbSB0byB0YWNrbGUsIENoYXJsb3R0ZSBmZWVscyBoZXJzZWxmIGdldHRpbmcgd2Vha2VyIGJ5IHRoZSBtaW51dGUgYW5kIHRoZW4gQXVkcmV5IHN0YXJ0cyB0byBsb3NlIGhlciBleWVzaWdodC4gVGhleSBsb29rIGF0IHRoZWlyIHdyaXN0cyBhbmQgbm90aWNlIHRoYXQgdGhlIFJvbWFuIG51bWJlciBwcm9ibGVtIGhhcyBub3cgYWZmZWN0ZWQgdGhlbSB0b28sIHRoZSBudW1iZXJzIElJIGZvciBBdWRyZXkgYW5kIFZJSUkgZm9yIENoYXJsb3R0ZS4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDcuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd0cmVlXzIucG5nJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDE0KSxcbiAgICBjb2xvcjogJyM0QTUwNEUnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNy5qcGcnLFxuICAgIGNhcHRpb246ICdJbiBOb3J0aCBDYXJvbGluYSwgRHVrZSBhbmQgU2V0aCBzaXQgd2l0aCBhIGxvY2FsIG1hbiB3aG8gY2xhaW1zIHRvIGJlIGFibGUgdG8gcmVtb3ZlIHRoZSBcImJsYWNrIHRhclwiIGZyb20gRHVrZVxcJ3Mgc291bC4gQWZ0ZXIgYW4gZWxhYm9yYXRlIHBlcmZvcm1hbmNlLCBEdWtlIHJlYWxpemVzIHRoYXQgdGhlIGd1eSBpcyBhIGZha2UuIFRoZSByYXR0bGVkIGd1eSB3aG8gZG9lc25cXCd0IHdhbnQgYW55IHRyb3VibGUgZnJvbSBEdWtlIHRlbGxzIHRoZW0gdGhhdCBXYWx0ZXIgRmFyYWR5IHdpbGwgaGF2ZSB0aGUgcmVhbCBhbnN3ZXJzIHRvIER1a2VcXCdzIHF1ZXN0aW9ucy4gV2hlbiB0aGV5IGdvIGxvb2tpbmcgZm9yIFdhbHRlciwgdGhleSBmaW5kIGhpbSDigKYgYW5kIGhpcyBoZWFkc3RvbmUgdGhhdCBoYXMgYSBmYW1pbGlhciBtYXJraW5nIG9uIGl0LCB0aGUgc3ltYm9sIGZvciBUaGUgR3VhcmQuIFdoYXQgZ2l2ZXM/IEp1c3QgYXMgRHVrZSBpcyBhYm91dCB0byBnaXZlIHVwIGhlIGdldHMgYSB2aXNpdCBmcm9tIFdhbHRlclxcJ3MgZ2hvc3Qgd2hvIHByb21pc2VzIHRvIGdpdmUgaGltIGFuc3dlcnMgdG8gYWxsIG9mIHRoZSBxdWVzdGlvbnMg4oCmdmlhIHRoZSBuZXh0IGVwaXNvZGUgb2YgY291cnNlLiBDbGlmZmhhbmdlciEnLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDguanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd0cmVlXzMucG5nJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDE0KSxcbiAgICBjb2xvcjogJyNERDlGMDAnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wOC5qcGcnLFxuICAgIGNhcHRpb246ICdBZnRlciBzb21lIHByb2RkaW5nLCBEd2lnaHQgYW5kIE5hdGhhbiBmaW5kIHRoYXQgTGFpbmV5IGdvdCBhIHZpc2l0IGZyb20gQ3JvYXRvYW4gYW5kIFwibG9zdCB0aW1lXCIuIFNoZSBkb2VzblxcJ3QgcmVtZW1iZXJpbmcgZHJhd2luZyBjYXJkcyBmb3IgYW55IG9mIHRoZW0uIE5hdGhhbiBoYXMgaGVyIGRyYXcgbmV3IGNhcmRzIGFuZCBhIGhlc2l0YW50IExhaW5leSBkb2VzLiBEd2lnaHQgaXMgZ2l2ZW4gYSBib25kYWdlIGZhdGUgYW5kIGlzIGxhdGVyIHNoYWNrbGVkIGJ5IGNoYWlucyB0byBhIGdhdGUsIENoYXJsb3R0ZSB3aWxsIGJlIHJldW5pdGVkIHdpdGggaGVyIHRydWUgbG92ZSAoaG1t4oCmKSBhbmQgQXVkcmV5IGlzIGFsaWduZWQgd2l0aCB0aGUgbW9vbi4gTm90IHBlcmZlY3QgZmF0ZXMsIGJ1dCBpdFxcJ3MgZW5vdWdoIHRvIGdldCBldmVyeW9uZSBvdXQgb2YgdGhlIHBpY2tsZXMgdGhlaXIgY3VycmVudGx5IGluLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wOS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3RyZWVfNC5wbmcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTQpLFxuICAgIGNvbG9yOiAnIzhGQzk5QicsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA5LmpwZycsXG4gICAgY2FwdGlvbjogJ1dpdGggdGhlaXIgc3RyZW5ndGggcmVnYWluZWQsIEF1ZHJleSBhbmQgQ2hhcmxvdHRlIGFyZSBhYmxlIHRvIGNyZWF0ZSB0aGUgYWV0aGVyIGNvcmUgdGhleSBuZWVkLiBDaGFybG90dGUgaW5zdHJ1Y3RzIEF1ZHJleSB0byBnbyBhbmQgaGlkZSBpdCBzb21lIHBsYWNlIHNhZmUuIEluIHRoZSBpbnRlcmltLCBDaGFybG90dGUga2lzc2VzIER3aWdodCBnb29kYnllIGFuZCBnaXZlcyBoaW0gdGhlIHJpbmcgc2hlIG9uY2UgdXNlZCB0byBzbGlwIGludG8gVGhlIFZvaWQuIExhdGVyLCB3aXRoIGhlciBtb29uIGFsaWdubWVudCBjYXVzaW5nIEF1ZHJleSB0byBkaXNhcHBlYXIgYW5kIER3aWdodCBzdGlsbCBzaGFja2xlZCwgTGFpbmV5IHB1bGxzIGFub3RoZXIgY2FyZCBmb3IgdGhlIGVudGlyZSBncm91cCwgYSBqdWRnbWVudCBjYXJkLCB3aGljaCBzaGUgcmVhZHMgdG8gbWVhbiB0aGF0IGFzIGFsb25nIGFzIHRoZWlyIGludGVudGlvbnMgYXJlIHB1cmUgdGhleSBjYW4gYWxsIG92ZXJjb21lIGFueSBvYnN0YWNsZXMuIFRoaXMgaXMgZ3JlYXQgbmV3cyBmb3IgZXZlcnlvbmUgZXhjZXB0Li4uJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzEwLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAndHJlZV81LnBuZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxNCksXG4gICAgY29sb3I6ICcjQkZDOUEyJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMTAuanBnJyxcbiAgICBjYXB0aW9uOiAnQ2hhcmxvdHRlLiBDcm9hdG9hbiBwYXlzIGhlciBhIHZpc2l0IGluIGhlciBhcGFydG1lbnQgdG8gdGVsbCBoZXIgdGhhdCBoZVxcJ3MgcGlzc2VkIHRoYXQgc2hlXFwncyBcIm9uZSBvZiB0aGVtIG5vd1wiIGFuZCB0aGF0IHNoZSBjaG9zZSBBdWRyZXkgb3ZlciBNYXJhLiBDcm9hdG9hbiB3YXN0ZXMgbm8gdGltZSBpbiBraWxsaW5nIENoYXJsb3R0ZSBhbmQgc2hlIGNsaW5ncyB0byBsaWZlIGZvciBqdXN0IGVub3VnaCB0aW1lIHRvIGJlIGZvdW5kIGJ5IEF1ZHJleSBzbyBzaGUgY2FuIGdpdmUgaGVyIHRoZSBtb3N0IHNob2NraW5nIG5ld3Mgb2YgdGhlIHNlYXNvbjogQ3JvYXRvYW4gaXMgQXVkcmV5XFwncyBmYXRoZXIgYW5kIGhlXFwncyBnb3QgXCJwbGFuc1wiIGZvciBoZXIhJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zMDVfZTA1MTNfMDFfQ0NfMTkyMHgxMDgwLmpwZycsXG4gICAgaWQ6ICd2aWRlb19fMTIzJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDE0KSxcbiAgICBjb2xvcjogJyNCRkM5QTInLFxuICAgIHRpdGxlOiAnczA1X2UwNTEzXzAxX0NDXzE5MjB4MTA4MCcsXG4gICAgZGVzY3JpcHRpb246ICdOb3cgdGhhdCBEci4gQ3Jvc3MgaGFzIHJldmVhbGVkIGhlciB0cnVlIGlkZW50aXR5LCBldmVyeW9uZSBoYXMgbG90cyBvZiBmZWVsaW5ncy4gRHdpZ2h0IGNhblxcJ3QgZ2V0IG92ZXIgZmVlbGluZyBsaWtlIHNoZSBkdXBlZCBoaW0sIEF1ZHJleSB0aGlua3MgRHIuIENyb3NzIG11c3QgY2FyZSBtb3JlIGFib3V0IE1hcmEgdGhhbiBzaGUgZG9lcyBhYm91dCBoZXIgYW5kIE5hdGhhbiBpcyBoYXBweSB0aGF0IHRoZXJlIGlzIHNvbWVvbmUgZWxzZSBpbiB0b3duIHdobyBoZSBjYW4gZmVlbC4nLFxuICAgIHR5cGU6ICd2aWRlbycsXG4gICAgcGxheWVyOiAnQnJhbmQgVk9EIFBsYXllcicsXG4gICAgZXBpc29kZU51bWJlcjogJzEwJyxcbiAgICBrZXl3b3JkczogJ1RoZSBFeHBhbmNlLCBTYWx2YWdlLCBNaWxsZXIsIEp1bGllIE1hbywgSG9sZGVuLCBUcmFpbGVyJyxcblxuICAgIGFkZGVkQnlVc2VySWQ6IDM0NDg3MjMsXG4gICAgYXV0aG9yOiAnSmFzb24gTG9uZycsXG4gICAgZXhwaXJhdGlvbkRhdGU6ICcyMDE1LTAzLTIzIDEwOjU3OjA0JyxcbiAgICBndWlkOiAnMEQ2NjBCRDYtMDk2OC00RjcyLTdBQkMtNDcyMTU3REZBQ0FCJyxcbiAgICBsaW5rOiAnY2Fub25pY2FsdXJsNzBmYTYyZmM2YicsXG4gICAgbGlua1VybDogJ2h0dHA6Ly9wcm9kLnB1Ymxpc2hlcjcuY29tL2ZpbGUvNzgwNidcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzA2LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDYucG5nJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE0KSxcbiAgICBjb2xvcjogJyNCRkM5QTInLFxuICAgIHRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDYuanBnJyxcbiAgICBjYXB0aW9uOiAnQWxlaXN0ZXIgY29udGludWVzIGhpcyBjaGFybWluZyBjb3JydXB0aW9uIG9mIFNhdmFubmFoLCB0ZWxsaW5nIGhlciBzaGVcXCdzIGtlcHQgbG9ja2VkIGluIGhlciByb29tIHRvIGtlZXAgaGVyIHNhZmUgZnJvbSBoZXIgbmV3IHdlcmV3b2xmIG5laWdoYm9yIGFuZCBlbmNvdXJhZ2luZyBoZXIgdG8gdXNlIGhlciBsZWZ0IGhhbmQgd2hlbiB3aWVsZGluZyBoZXIgYWJpbGl0aWVzLiBTYXZhbm5haFxcJ3MgZ2V0dGluZyBtb3JlIHBvd2VyZnVsIGV2ZXJ5IGRheS4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdCaXR0ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfS8qLFxuICB7XG4gIHVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzA3LmpwZycsXG4gIGZvY2FsUG9pbnQ6IHtcbiAgbGVmdDogMC41LFxuICB0b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDcucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDcuanBnJyxcbmNhcHRpb246ICdNZWFud2hpbGUsIExvZ2FuIGhhcyBpbmZpbHRyYXRlZCB0aGUgY29tcG91bmQgYW5kIGZpbmRzIGhpcyBiZWxvdmVkIFJhY2hlbC4gSGUgbWFuYWdlcyB0byBmcmVlIGhlciAuLi4gYnV0IGhvdyBmYXIgd2lsbCB0aGV5IGdldD8nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzE3LmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTcucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTcuanBnJyxcbmNhcHRpb246ICdFbGVuYSB3YWtlcyB1cCB0byBmaW5kIGhlcnNlbGYgaW4gYSBuZXcgY2VsbCAuLi4nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzE4LmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTgucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTguanBnJyxcbmNhcHRpb246ICcuLi4gYW5kIFJpY2hhcmQsIHRoZSBtdXR0IHNoZSBpbnRlcnJvZ2F0ZWQgaW4gRXBpc29kZSAxLCBpbiBhbm90aGVyLiBSaWNoYXJkIGlzIGVucmFnZWQgdGhhdCBFbGVuYSBnYXZlIGhpbSB1cCB0byB0aGVzZSBcInNhZGlzdGljIGJhc3RhcmRzXCIgYW5kIGFsbCB0b28gd2lsbGluZyB0byBlbmdhZ2UgaW4gU29uZHJhXFwncyBleHBlcmltZW50IHRvIFwib2JzZXJ2ZSBjb21iYXRcIjogaW4gdGhlb3J5LCBFbGVuYSB3aWxsIGhhdmUgdG8gdHVybiBpbnRvIGEgd29sZiB0byBkZWZlbmQgaGVyc2VsZiBhZ2FpbnN0IFJpY2hhcmRcXCdzIGF0dGFjay4nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzIxLmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjEucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjEuanBnJyxcbmNhcHRpb246ICdPbiBoaWdoZXIgZ3JvdW5kLCBSYWNoZWwgYW5kIExvZ2FuIGFyZSBtYWtpbmcgYSBydW4gZm9yIGl0LCB0aG91Z2ggdGhlIHN5bWJvbCBvbiBSYWNoZWxcXCdzIG5lY2sgc3RhcnRzIHRvIHNtb2tlIC4uLicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCaXR0ZW4nLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjIuanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yMi5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNCksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yMi5qcGcnLFxuY2FwdGlvbjogJy4uLiB3aGljaCBhbHNvIHNsb3dzIGRvd24gRWxlbmEsIGFmdGVyIFJpY2hhcmQtd29sZiBzdWZmZXJzIHRoZSBzYW1lIGJsb29keSBmYXRlIGFzIE5hdGUgUGFya2VyIGRpZCBpbiBFcGlzb2RlIDEuIFJhY2hlbCwgRWxlbmEgYW5kIExvZ2FuIGFyZSByZS1jYXB0dXJlZC4nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzI1LmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjUucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjUuanBnJyxcbmNhcHRpb246ICdFbGVuYSBnaXZlcyBpbiwgYW5kIGEgc2hvY2tlZCBSYWNoZWwgbGVhcm5zIGEgbGl0dGxlIHNvbWV0aGluZyBuZXcgYWJvdXQgaGVyIG9sZCBmcmllbmQuJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JpdHRlbicsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CbGluZHNwb3RfMDdfTlVQXzE3MDMxN18wMzA4LmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQmxpbmRzcG90XzA3X05VUF8xNzAzMTdfMDMwOC5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNiksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCbGluZHNwb3RfMDdfTlVQXzE3MDMxN18wMzA4LmpwZycsXG5jYXB0aW9uOiAnQkxJTkRTUE9UIC0tIFwiQm9uZSBNYXkgUm90XCIgRXBpc29kZSAxMDQgLS0gUGljdHVyZWQ6IChsLXIpIEphaW1pZSBBbGV4YW5kZXIgYXMgSmFuZSBEb2UsIFN1bGxpdmFuIFN0YXBsZXRvbiBhcyBLdXJ0IFdlbGxlciAtLSAoUGhvdG8gYnk6IENocmlzdG9waGVyIFNhdW5kZXJzL05CQyknLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQmxpbmRzcG90JyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JsaW5kc3BvdF8wOF9OVVBfMTcwNTAzXzAyODMuanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCbGluZHNwb3RfMDhfTlVQXzE3MDUwM18wMjgzLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE2KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JsaW5kc3BvdF8wOF9OVVBfMTcwNTAzXzAyODMuanBnJyxcbmNhcHRpb246ICdCTElORFNQT1QgLS0gXCJCb25lIE1heSBSb3RcIiBFcGlzb2RlIDEwNCAtLSBQaWN0dXJlZDogSmFpbWllIEFsZXhhbmRlciBhcyBKYW5lIERvZSAtLSAoUGhvdG8gYnk6IEdpb3Zhbm5pIFJ1Zmluby9OQkMpJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JsaW5kc3BvdCcsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CbGluZHNwb3RfMTVfTlVQXzE3MDUwM18wMjAzLmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQmxpbmRzcG90XzE1X05VUF8xNzA1MDNfMDIwMy5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNiksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCbGluZHNwb3RfMTVfTlVQXzE3MDUwM18wMjAzLmpwZycsXG5jYXB0aW9uOiAnQkxJTkRTUE9UIC0tIFwiQm9uZSBNYXkgUm90XCIgRXBpc29kZSAxMDQgLS0gUGljdHVyZWQ6IEphaW1pZSBBbGV4YW5kZXIgYXMgSmFuZSBEb2UgLS0gKFBob3RvIGJ5OiBHaW92YW5uaSBSdWZpbm8vTkJDKScsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCbGluZHNwb3QnLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjIwLjE0X3BtLnBuZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjIwLjE0X3BtLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE2KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4yMC4xNF9wbS5wbmcnLFxuY2FwdGlvbjogJ+KAnE1vbmRheXMgZ290IG1lIGxpa2XigKbigJ0gLSBAamltbXlmYWxsb24nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnVGhlIFRvbmlnaHQgU2hvdycsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9zY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMTkuMTlfcG0ucG5nJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdzY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMTkuMTlfcG0ucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTYpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjE5LjE5X3BtLnBuZycsXG5jYXB0aW9uOiAn4oCcVG9uaWdodCBJIHdhcyB0aGUgbXVzaWNhbCBndWVzdCBvbiBUaGUgVG9uaWdodCBTaG93IFdpdGggSmltbXkgRmFsbG9uLiBNeSBmaXJzdCB0aW1lIG9uIHRoZSBzaG93IEkgd2FzIDE0IHllYXJzIG9sZCBhbmQgbmV2ZXIgdGhvdWdodCBJXFwnZCBiZSBiYWNrIHRvIHBlcmZvcm0gbXkgZmlyc3Qgc2luZ2xlLiBMb3ZlIHlvdSBsb25nIHRpbWUgSmltbXkhIFRoYW5rcyBmb3IgaGF2aW5nIG1lLiA6KSBQUyBJIG1ldCB0aGUgbGVnZW5kYXJ5IExhZHkgR2FnYSBhbmQgYW0gc28gaW5zcGlyZWQgYnkgaGVyIHdvcmRzIG9mIHdpc2RvbS4gI0hBSVpvbkZBTExPTiAjTG92ZU15c2VsZuKAnSAtIEBoYWlsZWVzdGVpbmZlbGQnLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnVGhlIFRvbmlnaHQgU2hvdycsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9zY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMjAuMTVfcG0ucG5nJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdzY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMjAuMTVfcG0ucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTYpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjIwLjE1X3BtLnBuZycsXG5jYXB0aW9uOiAn4oCcTW9uZGF5cyBnb3QgbWUgbGlrZeKApuKAnSAtIEBqaW1teWZhbGxvbicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdUaGUgVG9uaWdodCBTaG93JyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSovXG5dO1xuZnVuY3Rpb24gY3JlYXRlQXNzZXRMaWJyYXJ5RmlsZShmaWxlRGF0YSkge1xuXG4gICAgLy9jcmVhdGUgYmFzaWMgZWxlbWVudFxuICAgIHZhciBmaWxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZSBmaWxlLS1tb2RhbCBmaWxlX3R5cGVfaW1nIGZpbGVfdmlld19ncmlkJyksXG4gICAgICAgIGZpbGVJbmRleCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2hpZGRlbiBmaWxlX19pZCcpLnRleHQoZmlsZURhdGEuaWQpLFxuXG4gICAgICAgIGZpbGVJbWcgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19pbWcnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyBmaWxlRGF0YS51cmwgKyAnKScpLFxuICAgICAgICBmaWxlQ29udHJvbHMgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19jb250cm9scycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuICAgICAgICBmaWxlQ2hlY2ttYXJrID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fY2hlY2ttYXJrJykuY2xpY2sodG9nZ2xlRmlsZVNlbGVjdCksXG4gICAgICAgIGZpbGVUeXBlID0gJCgnPGRpdj48aSBjbGFzcz1cImZhIGZhLWNhbWVyYVwiPjwvaT48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdHlwZScpLFxuXG4gICAgICAgIGZpbGVUaXRsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3RpdGxlJykudGV4dChmaWxlRGF0YS50aXRsZSk7XG5cbiAgICBmaWxlQ29udHJvbHMuYXBwZW5kKGZpbGVDaGVja21hcmssIGZpbGVUeXBlKTtcbiAgICBmaWxlSW1nLmFwcGVuZChmaWxlQ29udHJvbHMpO1xuXG4gICAgZmlsZS5hcHBlbmQoZmlsZUluZGV4LCBmaWxlSW1nLCBmaWxlVGl0bGUpO1xuICAgIHJldHVybiBmaWxlO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVBc3NldExpYnJhcnkoKSB7XG4gICAgdmFyIGFzc2V0TGlicmFyeSA9ICQoJy5hbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzJyk7XG4gICAgYXNzZXRMaWJyYXJ5LmVtcHR5KCk7XG4gICAgYXNzZXRMaWJyYXJ5T2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgYXNzZXRMaWJyYXJ5LnByZXBlbmQoY3JlYXRlQXNzZXRMaWJyYXJ5RmlsZShmKSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFNlbGVjdGVkRmlsZXMoKSB7XG4gICAgdmFyIHNlbGVjdGVkRmlsZXMgPSAkKCcuYWwgLmZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZS5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBzZWxlY3RlZEZpbGVzLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICAgICAgIHZhciBmaWxlSWQgPSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgZmlsZSA9IGFzc2V0TGlicmFyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGYuaWQgPT09IGZpbGVJZDtcbiAgICAgICAgICAgICAgICB9KVswXTtcbiAgICAgICAgICAgIC8vaWYgKCFmaWxlQnlJZChmaWxlSWQsIGdhbGxlcnlPYmplY3RzKSkge1xuICAgICAgICAgICAgICAgIGdhbGxlcnlPYmplY3RzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBmaWxlRGF0YTogZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgY2FwdGlvbjogJycsXG4gICAgICAgICAgICAgICAgICAgIGdhbGxlcnlDYXB0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAganVzdFVwbG9hZGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy99XG5cbiAgICAgICAgfSk7XG4gICAgICAgIHVwZGF0ZUdhbGxlcnkoZ2FsbGVyeU9iamVjdHMubGVuZ3RoKTtcbiAgICB9XG59XG5cbi8vUmVxdWlyZWQgZmllbGRzIGNoZWNrXG5mdW5jdGlvbiBjaGVja0ZpZWxkKGZpZWxkKSB7XG4gICAgaWYgKCQoZmllbGQpLnZhbCgpID09PSAnJyAmJiAkKGZpZWxkKS5hdHRyKCdkaXNwbGF5JykgIT09ICdub25lJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7fVxuICAgIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gbWFya0ZpZWxkQXNSZXF1aXJlZChmaWVsZCkge1xuICAgICQoZmllbGQpLmFkZENsYXNzKCdlbXB0eUZpZWxkJyk7XG4gICAgaWYgKCQoZmllbGQpLnBhcmVudCgpLmNoaWxkcmVuKCcuZXJyTXNnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHZhciBtc2cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdlcnJNc2cnKS50ZXh0KFwiVGhpcyBmaWVsZCBjb3VsZG4ndCBiZSBlbXB0eVwiKTtcbiAgICAgICAgJChmaWVsZCkucGFyZW50KCkuYXBwZW5kKG1zZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gbWFya0ZpZWxkQXNOb3JtYWwoZmllbGQpIHtcbiAgICAkKGZpZWxkKS5yZW1vdmVDbGFzcygnZW1wdHlGaWVsZCcpO1xuICAgICQoZmllbGQpLnBhcmVudCgpLmNoaWxkcmVuKCcuZXJyTXNnJykucmVtb3ZlKCk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRmllbGRzKHNlbGVjdG9yKSB7XG4gICAgdmFyIGZpZWxkcyA9ICQoc2VsZWN0b3IpLnBhcmVudCgpLmNoaWxkcmVuKCdpbnB1dCcpO1xuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgIHZhciBmaXJzdEluZGV4ID0gLTE7XG4gICAgZmllbGRzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgIGlmIChjaGVja0ZpZWxkKGVsKSkge1xuICAgICAgICAgICAgLy9tYXJrRmllbGRBc05vcm1hbChlbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL21hcmtGaWVsZEFzUmVxdWlyZWQoZWwpO1xuICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoZmlyc3RJbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICBmaXJzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgZWwuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuJCgnbGFiZWwucmVxdWllcmVkJykucGFyZW50KCkuY2hpbGRyZW4oJ2lucHV0Jykub24oJ2JsdXInLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGNoZWNrRmllbGQoZS50YXJnZXQpKSB7XG4gICAgICAgIC8vbWFya0ZpZWxkQXNOb3JtYWwoZS50YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vbWFya0ZpZWxkQXNSZXF1aXJlZChlLnRhcmdldCk7XG4gICAgfVxufSk7XG5cblxuLy9Gb2NhbCByZWN0YW5nbGUgYW5kIHBvaW50XG5mdW5jdGlvbiBhZGp1c3RSZWN0KGVsKSB7XG5cdHZhciBpbWdXaWR0aCA9ICQoJyNwcmV2aWV3SW1nJykud2lkdGgoKSxcblx0XHRpbWdIZWlnaHQgPSAkKCcjcHJldmlld0ltZycpLmhlaWdodCgpLFxuXHRcdGltZ09mZnNldCA9ICQoJyNwcmV2aWV3SW1nJykub2Zmc2V0KCksXG5cdFx0aW1nUmF0aW8gPSBpbWdXaWR0aC9pbWdIZWlnaHQsXG5cblx0XHRlbEggPSBlbC5vdXRlckhlaWdodCgpLFxuXHRcdGVsVyA9IGVsLm91dGVyV2lkdGgoKSxcblx0XHRlbE8gPSBlbC5vZmZzZXQoKSxcblx0XHRlbFJhdGlvID0gZWxXL2VsSCxcblx0XHRlbEJhY2tncm91bmRQb3NpdGlvbiA9IGVsLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbicpLnNwbGl0KCcgJyk7XG5cblx0Y29uc29sZS5sb2coZWxILCBlbFcsIGVsQmFja2dyb3VuZFBvc2l0aW9uKTtcblxuXHRySGVpZ2h0ID0gaW1nUmF0aW8gPiBlbFJhdGlvID8gaW1nSGVpZ2h0IDogaW1nV2lkdGgvZWxSYXRpbztcblx0cldpZHRoID0gaW1nUmF0aW8gPiBlbFJhdGlvID8gaW1nSGVpZ2h0ICogZWxSYXRpbyA6IGltZ1dpZHRoO1xuXHRyT2Zmc2V0ID0ge2xlZnQ6IDAsIHRvcDogMH07XG5cblx0aWYgKGVsQmFja2dyb3VuZFBvc2l0aW9uLmxlbmd0aCA9PT0gMikge1xuXHRcdGlmIChlbEJhY2tncm91bmRQb3NpdGlvblswXS5pbmRleE9mKCclJykpIHtcblx0XHRcdHZhciBiZ0xlZnRQZXJzZW50ID0gZWxCYWNrZ3JvdW5kUG9zaXRpb25bMF0uc2xpY2UoMCwtMSksXG5cdFx0XHRcdGJnTGVmdFBpeGVsID0gTWF0aC5yb3VuZChpbWdXaWR0aCAqIGJnTGVmdFBlcnNlbnQvMTAwKSAtIHJXaWR0aC8yO1xuXG5cdFx0XHRjb25zb2xlLmxvZyhlbEJhY2tncm91bmRQb3NpdGlvblswXSwgYmdMZWZ0UGVyc2VudCwgYmdMZWZ0UGl4ZWwsIGltZ1dpZHRoLCAoYmdMZWZ0UGl4ZWwgKyByV2lkdGgpKTtcblxuXHRcdFx0aWYgKChiZ0xlZnRQaXhlbCkgPCAwKSB7YmdMZWZ0UGl4ZWwgPSAwO31cblx0XHRcdGlmICgoYmdMZWZ0UGl4ZWwgKyByV2lkdGgpID4gaW1nV2lkdGgpIHtiZ0xlZnRQaXhlbCA9IGltZ1dpZHRoIC0gcldpZHRoO31cblxuXHRcdFx0Y29uc29sZS5sb2coYmdMZWZ0UGl4ZWwsIGltZ1dpZHRoLCAoYmdMZWZ0UGl4ZWwgKyByV2lkdGgvMikpO1xuXG5cdFx0XHRyT2Zmc2V0LmxlZnQgPSBpbWdSYXRpbyA+IGVsUmF0aW8gPyBiZ0xlZnRQaXhlbCA6IDA7XG5cdFx0fVxuXHRcdGlmIChlbEJhY2tncm91bmRQb3NpdGlvblsxXS5pbmRleE9mKCclJykpIHtcblx0XHRcdHZhciBiZ1RvcFBlcnNlbnQgPSBlbEJhY2tncm91bmRQb3NpdGlvblsxXS5zbGljZSgwLC0xKSxcblx0XHRcdFx0YmdUb3BQaXhlbCA9IE1hdGgucm91bmQoaW1nSGVpZ2h0KmJnVG9wUGVyc2VudC8xMDApIC0gckhlaWdodC8yO1xuXG5cdFx0XHRpZiAoKGJnVG9wUGl4ZWwpIDwgMCkge2JnVG9wUGl4ZWwgPSAwO31cblx0XHRcdGlmICgoYmdUb3BQaXhlbCArIHJIZWlnaHQpID4gaW1nSGVpZ2h0KSB7YmdUb3BQaXhlbCA9IGltZ0hlaWdodCAtIHJIZWlnaHQ7fVxuXG5cdFx0XHRyT2Zmc2V0LnRvcCA9IGltZ1JhdGlvID4gZWxSYXRpbyA/IDAgOiBiZ1RvcFBpeGVsO1xuXHRcdH1cblx0fVxuXG5cdCQoJy5mb2NhbFJlY3QnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuXG5cdCQoJy5mb2NhbFJlY3QnKS5jc3MoJ3dpZHRoJywgcldpZHRoLnRvU3RyaW5nKCkgKyAncHgnKVxuXHRcdFx0XHRcdFx0XHQgICAuY3NzKCdoZWlnaHQnLCBySGVpZ2h0LnRvU3RyaW5nKCkgKyAncHgnKVxuXHRcdFx0XHRcdFx0XHQgICAuY3NzKCdsZWZ0Jywgck9mZnNldC5sZWZ0LnRvU3RyaW5nKCkgKyAncHgnKVxuXHRcdFx0XHRcdFx0XHQgICAuY3NzKCd0b3AnLCByT2Zmc2V0LnRvcC50b1N0cmluZygpICsgJ3B4Jylcblx0XHRcdFx0XHRcdFx0ICAgLmRyYWdnYWJsZSh7XG5cdFx0XHRcdFx0XHRcdCAgIFx0XHRheGlzOiBpbWdSYXRpbyA+IGVsUmF0aW8gPyAneCcgOiAneScsXG5cdFx0XHRcdFx0XHRcdCAgIFx0XHRzdGFydDogZnVuY3Rpb24oZSwgdWkpIHtcblx0XHRcdFx0XHRcdFx0XHQgICAgXHRlbC5jc3MoJ3RyYW5zaXRpb24nLCAnbm9uZScpO1xuXHRcdFx0XHRcdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdFx0XHQgICBcdFx0c3RvcDogZnVuY3Rpb24oZSwgdWkpIHtcblx0XHRcdFx0XHRcdFx0ICAgXHRcdFx0ZWwuY3NzKCd0cmFuc2l0aW9uJywgJzAuM3MgZWFzZS1vdXQnKTtcblx0XHRcdFx0XHRcdFx0XHQgICAgICAgIGFkanVzdFB1cnBvc2UoJChlLnRhcmdldCksIGVsKTtcblx0XHRcdFx0XHRcdFx0XHQgICAgfVxuXHRcdFx0XHRcdFx0XHQgICBcdH0pO1xuXG5cdCQoJy5wdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdGVsLnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuXG59XG5mdW5jdGlvbiBhZGp1c3RQdXJwb3NlKGZvY2FsSXRlbSwgcHVycG9zZUltZykge1xuXG5cdFx0dmFyIGltZyA9ICQoJyNwcmV2aWV3SW1nJyksXG5cdFx0aVdpZHRoID0gaW1nLndpZHRoKCksXG5cdFx0aUhlaWdodCA9IGltZy5oZWlnaHQoKSxcblx0XHRpT2Zmc2V0ID0gaW1nLm9mZnNldCgpLFxuXG5cdFx0cFdpZHRoID0gZm9jYWxJdGVtLm91dGVyV2lkdGgoKSxcblx0XHRwSGVpZ2h0ID0gZm9jYWxJdGVtLm91dGVySGVpZ2h0KCksXG5cdFx0cE9mZnNldCA9IGZvY2FsSXRlbS5vZmZzZXQoKSxcblxuXHRcdGZUb3AgPSBNYXRoLnJvdW5kKChwT2Zmc2V0LnRvcCAtIGlPZmZzZXQudG9wICsgcEhlaWdodC8yKSoxMDAgLyBpSGVpZ2h0KTtcblx0XHRmTGVmdCA9IE1hdGgucm91bmQoKHBPZmZzZXQubGVmdCAtIGlPZmZzZXQubGVmdCArIHBXaWR0aC8yKSAqIDEwMCAvIGlXaWR0aCk7XG5cblx0Ly9jb25zb2xlLmxvZyhmVG9wLCBmTGVmdCk7XG5cdGlmIChwdXJwb3NlSW1nKSB7XG5cdFx0cHVycG9zZUltZy5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24nLCBmTGVmdC50b1N0cmluZygpICsgJyUgJyArIGZUb3AudG9TdHJpbmcoKSArICclJyk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0JCgnLnB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZSAucHVycG9zZS1pbWcnKS5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24nLCBmTGVmdC50b1N0cmluZygpICsgJyUgJyArIGZUb3AudG9TdHJpbmcoKSArICclJyk7XG5cdH1cblxufVxuXG4kKCcjZm9jYWxSZWN0VG9nZ2xlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG5cdFx0JCgnLnByID4gLnByZXZpZXcnKS5yZW1vdmVDbGFzcygnZm9jYWwgbGluZSByZWN0Jyk7XG5cdFx0JChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHR9IGVsc2Uge1xuXHRcdCQoJy5wciA+IC5wcmV2aWV3JykuYWRkQ2xhc3MoJ2ZvY2FsIGxpbmUgcmVjdCcpO1xuXHRcdCQoJy5wciA+IC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ3BvaW50Jyk7XG5cdFx0JCgnI2ZvY2FsUG9pbnRUb2dnbGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0JChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cblx0XHQvLyQoJy5mb2NhbFJlY3QnKS5yZXNpemFibGUoe2hhbmRsZXM6IFwiYWxsXCIsIGNvbnRhaW5tZW50OiBcIiNwcmV2aWV3SW1nXCJ9KTtcblx0XHRhZGp1c3RSZWN0KCQoJy5wdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UtaW1nJykuZmlyc3QoKSk7XG5cdFx0JCgnLmZvY2FsUmVjdCcpLmRyYWdnYWJsZSh7IGNvbnRhaW5tZW50OiBcIiNwcmV2aWV3SW1nXCIsIHNjcm9sbDogZmFsc2UgfSk7XG5cblx0XHQkKCcucHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlLWltZycpLnVuYmluZCgpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRcdGFkanVzdFJlY3QoJChlLnRhcmdldCkpO1xuXHRcdH0pO1xuXHRcdC8vJCgnLmltZy13cmFwcGVyJykuY3NzKCdtYXgtd2lkdGgnLCAnOTAlJyk7XG5cdFx0c2V0UHVycG9zZVBhZ2luYXRpb24oKTtcblx0fVxufSk7XG5cblxuLy90ZXh0ZmllbGRzXG4vLzsoZnVuY3Rpb24od2luZG93KSB7XG4vLyAgICAndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFRleHRmaWVsZChlbCwgb3B0aW9ucykge1xuICB0aGlzLmVsID0gZWw7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgdGhpcy5faW5pdCgpO1xuICB0aGlzLl9pbml0RXZlbnRzKCk7XG59XG5cblRleHRmaWVsZC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLmVsLnBsYWNlaG9sZGVyID0gJyc7XG5cbiAgdGhpcy5maWVsZFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy5maWVsZFdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaW5wdXRfX3dyYXBwZXInKTtcbiAgdGhpcy5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmZpZWxkV3JhcHBlciwgdGhpcy5lbCk7XG4gIHRoaXMuZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2pzLWlucHV0Jyk7XG4gIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnaW5wdXRfX2ZpZWxkJyk7XG5cbiAgaWYgKHRoaXMuZWwudmFsdWUgIT09ICcnKSB7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gICAgdGhpcy5fdG9nZ2xlQWRkYWJsZSgpO1xuICB9XG5cbiAgaWYgKHRoaXMuZWwudHlwZSA9PT0gJ3RleHRhcmVhJykge3RoaXMuX2F1dG9zaXplKCk7fVxuICBpZiAodGhpcy5vcHRpb25zLmF1dG9jb21wbGV0ZSkge3RoaXMuZWwuY2xhc3NMaXN0LmFkZCgnaGFzLWF1dG9jb21wbGV0ZScpO31cbiAgaWYgKHRoaXMuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1kYXRlcGlja2VyJykpIHtcbiAgICB2YXIgaWQgPSAnZGF0ZVBpY2tlcicgKyBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqMTAwMDApO1xuICAgIHRoaXMuZWwuaWQgPSBpZDtcbiAgICAkKHRoaXMuZWwpLmRhdGVwaWNrZXIoe1xuICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcjJyArIGlkKS5hZGRDbGFzcygnaW5wdXRfc3RhdGVfbm90LWVtcHR5IGpzLWhhc1ZhbHVlJyk7XG4gICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VNb250aDogdHJ1ZSxcbiAgICAgIGNoYW5nZVllYXI6IHRydWVcbiAgICAgIC8qbW9udGhOYW1lc1Nob3J0OiBbIFwiSmFudWFyXCIsIFwiRmVicnVhclwiLCBcIk1hcnRzXCIsIFwiQXByaWxcIiwgXCJNYWpcIiwgXCJKdW5pXCIsIFwiSnVsaVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9rdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCIgXSovXG4gICAgfSk7XG4gIH1cbiAgaWYgKHRoaXMuZWwuaWQgPT09ICdzdGFydERhdGUnKSB7XG4gICAgJCh0aGlzLmVsKS5kYXRlcGlja2VyKHtcbiAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbihkYXRlU3RyaW5nLCBkYXRlcGlja2VyKSB7XG4gICAgICAgICQoJyNzdGFydERhdGUnKS5hZGRDbGFzcygnaW5wdXRfc3RhdGVfbm90LWVtcHR5IGpzLWhhc1ZhbHVlJyk7XG4gICAgICAgIHN0YXJ0RGF0ZSA9IGRhdGVTdHJpbmc7XG4gICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VNb250aDogdHJ1ZSxcbiAgICAgIGNoYW5nZVllYXI6IHRydWVcbiAgICAgIC8qbW9udGhOYW1lc1Nob3J0OiBbIFwiSmFudWFyXCIsIFwiRmVicnVhclwiLCBcIk1hcnRzXCIsIFwiQXByaWxcIiwgXCJNYWpcIiwgXCJKdW5pXCIsIFwiSnVsaVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9rdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCIgXSovXG4gICAgfSk7XG4gIH1cbiAgaWYgKHRoaXMuZWwuaWQgPT09ICdlbmREYXRlJykge1xuICAgICQodGhpcy5lbCkuZGF0ZXBpY2tlcih7XG4gICAgICBvblNlbGVjdDogZnVuY3Rpb24oZGF0ZVN0cmluZywgZGF0ZXBpY2tlcikge1xuICAgICAgICAkKCcjZW5kRGF0ZScpLmFkZENsYXNzKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHkganMtaGFzVmFsdWUnKTtcbiAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgfSxcbiAgICAgIGJlZm9yZVNob3c6IGZ1bmN0aW9uKGVsZW1lbnQsIGRhdGVwaWNrZXIpIHtcbiAgICAgICAgJCgnI2VuZERhdGUnKS5kYXRlcGlja2VyKCdvcHRpb24nLCAnZGVmYXVsdERhdGUnLCBzdGFydERhdGUpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZU1vbnRoOiB0cnVlLFxuICAgICAgY2hhbmdlWWVhcjogdHJ1ZVxuICAgICAgLyptb250aE5hbWVzU2hvcnQ6IFsgXCJKYW51YXJcIiwgXCJGZWJydWFyXCIsIFwiTWFydHNcIiwgXCJBcHJpbFwiLCBcIk1halwiLCBcIkp1bmlcIiwgXCJKdWxpXCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2t0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIiBdKi9cbiAgICB9KTtcbiAgfVxuXG4gIGlmICh0aGlzLm9wdGlvbnMubGFiZWwpIHtcbiAgICB0aGlzLmxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICB0aGlzLmxhYmVsLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5sYWJlbDtcbiAgICB0aGlzLmxhYmVsLmNsYXNzTGlzdC5hZGQoJ2lucHV0X19sYWJlbCcpO1xuICAgIHRoaXMubGFiZWwuZm9yID0gdGhpcy5lbC5pZDtcbiAgICB0aGlzLmZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcbiAgfVxuXG4gIHRoaXMuYmxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsgLy9Vc2UgYXMgYSBoZWxwZXIgdG8gbWFrZSBibGluayBhbmltYXRpb24gb24gZm9jdXMgZmllbGRcbiAgdGhpcy5ibGluay5jbGFzc0xpc3QuYWRkKCdpbnB1dF9fYmxpbmsnKTtcbiAgdGhpcy5maWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5ibGluayk7XG5cbiAgaWYgKHRoaXMub3B0aW9ucy5oZWxwVGV4dCkge1xuICAgIHRoaXMuaGVscFRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmhlbHBUZXh0LmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5oZWxwVGV4dDtcbiAgICB0aGlzLmhlbHBUZXh0LmNsYXNzTGlzdC5hZGQoJ2lucHV0X19oZWxwLXRleHQnKTtcbiAgICB0aGlzLmZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmhlbHBUZXh0KTtcbiAgfVxuICBpZiAodGhpcy5vcHRpb25zLmVyck1zZykge1xuICAgIHRoaXMuZXJyTXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5lcnJNc2cuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmVyck1zZztcbiAgICB0aGlzLmVyck1zZy5jbGFzc0xpc3QuYWRkKCdpbnB1dF9fZXJyLW1zZycpO1xuICAgIHRoaXMuZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZXJyTXNnKTtcbiAgfVxufTtcblxuVGV4dGZpZWxkLnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIC8vQ2hlY2sgaWYgZmllbGQgaXMgZW1wdHkgb3Igbm90IGFuZCBjaGFuZ2UgY2xhc3MgYWNjb3JkaW5nbHlcbiAgJCh0aGlzLmVsKS5vbignYmx1cicsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dF9zdGF0ZV9lcnInKTtcbiAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfVxuICAgIGUudGFyZ2V0LnBsYWNlaG9sZGVyID0gJyc7XG4gICAgaWYgKGUudGFyZ2V0LnJlcXVpcmVkICYmICFlLnRhcmdldC52YWx1ZSkge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnaW5wdXRfc3RhdGVfZXJyJyk7XG4gICAgfVxuICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge3NlbGYubGlzdC5yZW1vdmUoKTt9LCAxNTApO1xuICAgIH1cbiAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuICB9KTtcblxuICAvL09uIGZvY3VzIGV2ZW50XG4gICQodGhpcy5lbCkub24oJ2ZvY3VzJywgZnVuY3Rpb24oZSkge1xuICAgIGlmIChzZWxmLm9wdGlvbnMucGxhY2Vob2xkZXIpIHtcbiAgICAgIGUudGFyZ2V0LnBsYWNlaG9sZGVyID0gc2VsZi5vcHRpb25zLnBsYWNlaG9sZGVyO1xuICAgIH1cbiAgICBpZiAoc2VsZi5vcHRpb25zLmF1dG9jb21wbGV0ZSkge1xuICAgICAgc2VsZi5saXN0ID0gcmVuZGVyQXV0b2NvbXBsZXRlTGlzdChzZWxmLm9wdGlvbnMuYXV0b2NvbXBsZXRlLCBoYW5kbGVBdXRvY29tcGxldGVJdGVtQ2xpY2spO1xuICAgICAgcGxhY2VBdXRvY29tcGxldGVMaXN0KHNlbGYubGlzdCwgJChzZWxmLmZpZWxkV3JhcHBlcikpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy9PbiBjaGFuZ2UgZXZlbnRcbiAgJCh0aGlzLmVsKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0X3N0YXRlX2VycicpO1xuICAgIGlmIChlLnRhcmdldC52YWx1ZSAhPT0gJycpIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICB9XG4gICAgZS50YXJnZXQucGxhY2Vob2xkZXIgPSAnJztcbiAgICBpZiAoc2VsZi5vcHRpb25zLm9uQ2hhbmdlKSB7XG4gICAgICBzZWxmLm9wdGlvbnMub25DaGFuZ2UoZSk7XG4gICAgfVxuICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gIH0pO1xuXG4gIC8vT24gaW5wdXQgZXZlbnRcbiAgJChzZWxmLmVsKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKSB7XG4gICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5wdXRfc3RhdGVfZXJyJyk7XG4gICAgaWYgKGUudGFyZ2V0LnZhbHVlICE9PSAnJykge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIH1cbiAgICBlLnRhcmdldC5wbGFjZWhvbGRlciA9ICcnO1xuICAgIGlmIChzZWxmLm9wdGlvbnMub25JbnB1dCkge1xuICAgICAgc2VsZi5vcHRpb25zLm9uSW5wdXQoZSk7XG4gICAgfVxuICAgIGlmIChzZWxmLm9wdGlvbnMuYXV0b2NvbXBsZXRlKSB7XG4gICAgICB2YXIgZGF0YSA9IHNlbGYub3B0aW9ucy5hdXRvY29tcGxldGUuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWxmLmVsLnZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgfSlcbiAgICAgIHVwZGF0ZUF1dG9jb21wbGV0ZUxpc3Qoc2VsZi5saXN0LCBkYXRhLCBoYW5kbGVBdXRvY29tcGxldGVJdGVtQ2xpY2spO1xuICAgIH1cbiAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuICB9KTtcbiAgJChzZWxmLmVsKS5vbigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUtleURvd24oZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdmFyIGluZGV4LCBsZW5ndGg7XG4gICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgIGNhc2UgMTM6XG4gICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5maW5kKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGVjdEl0ZW0oc2VsZi5saXN0LmZpbmQoJ2lzLWhpZ2h0bGlnaHRlZCcpLmdldCgwKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDI3OlxuICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICBicmVhaztcblxuICAgICAgY2FzZSAzODpcbiAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmZpbmQoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcblxuICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggLSAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICBpZiAoaW5kZXggPCBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCA8IDUwKSB7XG4gICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA+IDAgPyAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgOiAwXG4gICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxUb3A6IDBcbiAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgICAgY2FzZSA0MDpcbiAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmZpbmQoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICBpZiAoaW5kZXggPCBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5oZWlnaHQoKSA8ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLm91dGVySGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKVxuICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4ID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4KS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4KS5oZWlnaHQoKVxuICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlckF1dG9jb21wbGV0ZUxpc3QoZGF0YSwgY2FsbGJhY2spIHtcbiAgICB2YXIgbGlzdCA9ICQoJzx1bCAvPicpLmFkZENsYXNzKCdhdXRvY29tcGxldGUnKVxuXG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIGxpc3QuYXBwZW5kKHJlbmRlckF1dG9jb21wbGV0ZUl0ZW0oaXRlbSwgY2FsbGJhY2spKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuICBmdW5jdGlvbiBwbGFjZUF1dG9jb21wbGV0ZUxpc3QobGlzdCwgcGFyZW50KSB7XG4gICAgcGFyZW50LmFwcGVuZChsaXN0KTtcblxuICAgIHZhciBwYXJlbnRCQ1IgPSBwYXJlbnQuZ2V0KDApLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgIHBhcmVudE9mZnNldFRvcCA9IHBhcmVudC5nZXQoMCkub2Zmc2V0VG9wLFxuICAgIGxpc3RCQ1IgPSBsaXN0LmdldCgwKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcblxuICAgIGhlaWdodENoZWNrID0gd2luZG93LmlubmVySGVpZ2h0IC0gcGFyZW50QkNSLnRvcCAtIHBhcmVudEJDUi5oZWlnaHQgLSBsaXN0QkNSLmhlaWdodDtcblxuICAgIGxpc3QuZ2V0KDApLnN0eWxlLnRvcCA9IGhlaWdodENoZWNrID4gMCA/IHBhcmVudE9mZnNldFRvcCArIHBhcmVudEJDUi5oZWlnaHQgKyA1ICsgJ3B4JyA6IHBhcmVudE9mZnNldFRvcCAtIGxpc3RCQ1IuaGVpZ2h0IC0gMTAgKyAncHgnO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZUF1dG9jb21wbGV0ZUxpc3QgKGxpc3QsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgbGlzdC5lbXB0eSgpO1xuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICBsaXN0LmFwcGVuZChyZW5kZXJBdXRvY29tcGxldGVJdGVtKGl0ZW0sIGNhbGxiYWNrKSk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gcmVuZGVyQXV0b2NvbXBsZXRlSXRlbShpdGVtLCBjYWxsYmFjaykge1xuICAgIHJldHVybiAkKCc8bGkgLz4nKS5hZGRDbGFzcygnYXV0b2NvbXBsZXRlX19pdGVtJykuY2xpY2soY2FsbGJhY2spLm9uKCdtb3VzZW92ZXInLCBoYW5kbGVJdGVtTW91c2VPdmVyKS50ZXh0KGl0ZW0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQXV0b2NvbXBsZXRlSXRlbUNsaWNrKGUpIHtcbiAgICBzZWxlY3RJdGVtKGUudGFyZ2V0KTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVJdGVtTW91c2VPdmVyKGUpIHtcbiAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgfVxuICBmdW5jdGlvbiBzZWxlY3RJdGVtKGl0ZW0pIHtcbiAgICBzZWxmLmVsLnZhbHVlID0gaXRlbS5pbm5lckhUTUw7XG4gICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICBjbG9zZUF1dG9jb21wbGV0ZSgpO1xuICB9XG4gIGZ1bmN0aW9uIGNsb3NlQXV0b2NvbXBsZXRlKCkge1xuICAgIHNlbGYubGlzdC5yZW1vdmUoKTtcbiAgfVxufTtcblxuLy9BdXRvcmVzaXplIHRleHRhcmVhXG5UZXh0ZmllbGQucHJvdG90eXBlLl9hdXRvc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5lbC52YWx1ZSA9PT0gJycpIHt0aGlzLmVsLnJvd3MgPSAxO31cbiAgZWxzZSB7XG4gICAgdmFyIHdpZHRoID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCxcbiAgICBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpLFxuICAgIHRleHRXaWR0aCA9IHRoaXMuZWwudmFsdWUubGVuZ3RoICogNyxcbiAgICByZSA9IC9bXFxuXFxyXS9pZztcbiAgICBsaW5lQnJha2VzID0gdGhpcy5lbC52YWx1ZS5tYXRjaChyZSk7XG4gICAgcm93ID0gTWF0aC5jZWlsKHRleHRXaWR0aCAvIHdpZHRoKTtcblxuICAgIHJvdyA9IHJvdyA8PSAwID8gMSA6IHJvdztcbiAgICByb3cgPSB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0ICYmIHJvdyA+IHRoaXMub3B0aW9ucy5tYXhIZWlnaHQgPyB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0IDogcm93O1xuXG4gICAgaWYgKGxpbmVCcmFrZXMpIHtcbiAgICAgIHJvdyArPSBsaW5lQnJha2VzLmxlbmd0aDtcbiAgICB9XG5cbiAgICB0aGlzLmVsLnJvd3MgPSByb3c7XG4gIH1cbn07XG5cblRleHRmaWVsZC5wcm90b3R5cGUuX3RvZ2dsZUFkZGFibGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykubGVuZ3RoID4gMCkge1xuICAgIGNvbnNvbGUubG9nKCQodGhpcy5lbCkuaGFzQ2xhc3MoJ2pzLWhhc1ZhbHVlJykpO1xuICAgIGlmICgkKHRoaXMuZWwpLmhhc0NsYXNzKCdqcy1oYXNWYWx1ZScpKSB7XG4gICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmFkZENsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLnJlbW92ZUNsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gaW5pdFRleHRmaWVsZHMoKSB7XG4gIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWlucHV0JykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICBuZXcgVGV4dGZpZWxkKGVsLCB7XG4gICAgICBsYWJlbDogZWwuZGF0YXNldC5sYWJlbCxcbiAgICAgIGhlbHBUZXh0OiBlbC5kYXRhc2V0LmhlbHBUZXh0LFxuICAgICAgZXJyTXNnOiBlbC5kYXRhc2V0LmVyck1zZyxcbiAgICAgIHBsYWNlaG9sZGVyOiBlbC5wbGFjZWhvbGRlcixcbiAgICAgIG1hc2s6IGVsLmRhdGFzZXQubWFzayxcbiAgICAgIG1heEhlaWdodDogZWwuZGF0YXNldC5tYXhIZWlnaHRcbiAgICB9KTtcbiAgfSk7XG59XG5cbmluaXRUZXh0ZmllbGRzKCk7XG5cbi8vc2VsZWN0Ym94XG4vLzsoZnVuY3Rpb24od2luZG93KSB7XG4gICAgLy8ndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBTZWxlY3Rib3goZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgICAgICB0aGlzLl9pbml0RXZlbnRzKCk7XG4gICAgfVxuXG4gICAgU2VsZWN0Ym94LnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSB0aGlzLm9wdGlvbnMuaXRlbXMuaW5kZXhPZih0aGlzLm9wdGlvbnMuc2VsZWN0ZWRJdGVtKTtcbiAgICAgICAgdGhpcy5vcHRpb25zLnVuc2VsZWN0ID0gdGhpcy5vcHRpb25zLnVuc2VsZWN0ICE9PSAtMSA/ICfigJTCoE5vbmUg4oCUJyA6IHRoaXMub3B0aW9ucy51bnNlbGVjdDtcblxuICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdF9fd3JhcHBlcicpO1xuICAgICAgICB0aGlzLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuc2VsZWN0V3JhcHBlciwgdGhpcy5lbCk7XG4gICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdqcy1zZWxlY3Rib3gnKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2ZpZWxkJyk7XG5cbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlSXRlbSA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLml0ZW1zW3RoaXMuYWN0aXZlSXRlbV07XG4gICAgICAgICAgICB0aGlzLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxhYmVsKSB7XG4gICAgICAgICAgICB0aGlzLmxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmxhYmVsO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2xhYmVsJyk7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmZvciA9IHRoaXMuZWwuaWQ7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5sYWJlbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWxwVGV4dCkge1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuaGVscFRleHQ7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9faGVscC10ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5oZWxwVGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lcnJNc2cpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0aGlzLmVyck1zZy5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuZXJyTXNnO1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19lcnItbXNnJyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lcnJNc2cpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFNlbGVjdGJveC5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8vQ2xvc2UgbGlzdCBoZWxwZXJcbiAgICAgICAgZnVuY3Rpb24gY2xvc2VMaXN0KCkge1xuICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3Rib3hfc3RhdGVfb3BlbicpO1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0V3JhcHBlci5yZW1vdmVDaGlsZChzZWxmLmxpc3QpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLnNlYXJjaEZpZWxkICYmIHNlbGYuc2VhcmNoRmllbGQucGFyZW50Tm9kZSA9PT0gc2VsZi5lbCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwucmVtb3ZlQ2hpbGQoc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5pbnB1dEZpZWxkICYmIHNlbGYuaW5wdXRGaWVsZC5wYXJlbnROb2RlID09PSBzZWxmLmVsKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5yZW1vdmVDaGlsZChzZWxmLmlucHV0RmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuYWN0aXZlSXRlbSA8IDApIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IHNlbGYub3B0aW9ucy5pdGVtc1tzZWxmLmFjdGl2ZUl0ZW1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlU2VsZWN0RG9jQ2xpY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9DcmVhdGUgbGlzdCBoZWxwZXJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlTGlzdChpdGVtcywgYWN0aXZlSXRlbSwgc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYubGlzdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYubGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgICAgICBzZWxmLmxpc3QuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19saXN0Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RJdGVtKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1DbGFzcyA9IHNlbGYub3B0aW9ucy5jb21wbGV4SXRlbXMgPyAnc2VsZWN0Ym94X19saXN0LWl0ZW0gc2VsZWN0Ym94X19saXN0LWl0ZW0tLWNvbXBsZXgnIDogJ3NlbGVjdGJveF9fbGlzdC1pdGVtIHNlbGVjdGJveF9fbGlzdC1pdGVtLS10ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQgPSAkKCc8bGk+PC9saT4nKS5hZGRDbGFzcyhpdGVtQ2xhc3MpLnRleHQoaXRlbSksXG4gICAgICAgICAgICAgICAgICAgIGxpc3RIZWxwZXIgPSAkKCc8ZGl2PjwvZGl2PicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1pdGVtJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3otaW5kZXgnLCAnLTEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnb3BhY2l0eScsIDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ292ZXJmbG93JywgJ3Zpc2libGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnd2hpdGUtc3BhY2UnLCAnbm93cmFwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KGl0ZW0pO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKGxpc3RIZWxwZXIuZ2V0KDApKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmF0dHIoJ2RhdGEtaW5kZXgnLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5jb21wbGV4SXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuZ2V0KDApLmlubmVySFRNTCA9IGl0ZW07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaFRleHQgJiYgIXNlbGYub3B0aW9ucy5jb21wbGV4SXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuZ2V0KDApLmlubmVySFRNTCA9IGxpc3RJdGVtVGV4dChpdGVtLCBzZWFyY2hUZXh0LCAkKHNlbGYubGlzdCkud2lkdGgoKSA8IGxpc3RIZWxwZXIud2lkdGgoKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQub24oJ21vdXNlZG93bicsIGhhbmRsZUl0ZW1DbGljayk7XG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQub24oJ21vdXNlb3ZlcicsIGhhbmRsZUl0ZW1Nb3VzZU92ZXIpO1xuXG4gICAgICAgICAgICAgICAgbGlzdEhlbHBlci5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbUVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0SXRlbVRleHQoaXRlbVN0cmluZywgdGV4dCwgbG9uZykge1xuICAgICAgICAgICAgICAgIHZhciBvdXRwdXRTdHJpbmcgPSBpdGVtU3RyaW5nO1xuICAgICAgICAgICAgICAgIGlmIChsb25nKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3b3JkcyA9IGl0ZW1TdHJpbmcuc3BsaXQoJyAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaEluZGV4ID0gd29yZHMucmVkdWNlKGZ1bmN0aW9uKGN1cnJlbnRJbmRleCwgd29yZCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTdHJpbmcgPSB3b3JkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0KSA+IC0xICYmIGN1cnJlbnRJbmRleCA9PT0gLTEgPyBpbmRleCA6IGN1cnJlbnRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIC0xKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VhcmNoSW5kZXggPj0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0cmluZ0VuZCA9IHdvcmRzLnNsaWNlKHNlYXJjaEluZGV4KS5yZWR1Y2UoZnVuY3Rpb24oc3RyLCB3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0ciArICcgJyArIHdvcmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWcgPSAvXFwuJC87XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZHNbMF0ubWF0Y2gocmVnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN0cmluZyA9IHdvcmRzWzBdICsgJyAnICsgd29yZHNbMV0gKyAnIC4uLiAnICsgc3RyaW5nRW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTdHJpbmcgPSB3b3Jkc1swXSArICcgLi4uICcgKyBzdHJpbmdFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRUZXh0SW5kZXggPSBvdXRwdXRTdHJpbmcudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQudG9Mb3dlckNhc2UoKSksXG4gICAgICAgICAgICAgICAgICAgIGVuZFRleHRJbmRleCA9IHN0YXJ0VGV4dEluZGV4ICsgdGV4dC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gb3V0cHV0U3RyaW5nLnNsaWNlKDAsIHN0YXJ0VGV4dEluZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgbWlkZGxlID0gb3V0cHV0U3RyaW5nLnNsaWNlKHN0YXJ0VGV4dEluZGV4LCBlbmRUZXh0SW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICBlbmQgPSBvdXRwdXRTdHJpbmcuc2xpY2UoZW5kVGV4dEluZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdGFydCkpO1xuICAgICAgICAgICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQoJCgnPHNwYW4+PC9zcGFuPicpLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtaGlnaGxpZ2h0JykudGV4dChtaWRkbGUpLmdldCgwKSk7XG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShlbmQpKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlubmVySFRNTDtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gZGl2aWRlcigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJCgnPGxpPjwvbGk+JykuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1kaXZpZGVyJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZChzZWxmLmxpc3QpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnVuc2VsZWN0ICE9PSAtMSAmJiAhc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdJdGVtID0gbGlzdEl0ZW0oc2VsZi5vcHRpb25zLnVuc2VsZWN0KS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkIHNlbGVjdGJveF9fbGlzdC11bnNlbGVjdCcpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChuZXdJdGVtLmdldCgwKSk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LmFwcGVuZENoaWxkKGRpdmlkZXIoKS5nZXQoMCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3SXRlbSA9IGxpc3RJdGVtKGl0ZW0sIHNlbGYub3B0aW9ucy5pdGVtcy5pbmRleE9mKGl0ZW0pKTtcblxuICAgICAgICAgICAgICAgIGlmIChpID09PSAwICYmIHNlbGYubGlzdC5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3SXRlbS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtID09PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0l0ZW0uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChuZXdJdGVtLmdldCgwKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGZpZWxkUmVjdCA9IHNlbGYuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICAgICAgZmllbGRPZmZzZXRUb3AgPSBzZWxmLmVsLm9mZnNldFRvcCxcbiAgICAgICAgICAgICAgICB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgbWVudVJlY3QgPSBzZWxmLmxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG5cbiAgICAgICAgICAgICAgICBoZWlnaHRDaGVjayA9IHdpbmRvd0hlaWdodCAtIGZpZWxkUmVjdC50b3AgLSBmaWVsZFJlY3QuaGVpZ2h0IC0gbWVudVJlY3QuaGVpZ2h0O1xuXG4gICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUudG9wID0gaGVpZ2h0Q2hlY2sgPiAwID8gZmllbGRPZmZzZXRUb3AgKyBmaWVsZFJlY3QuaGVpZ2h0ICsgNSArICdweCcgOiBmaWVsZE9mZnNldFRvcCAtIG1lbnVSZWN0LmhlaWdodCAtIDEwICsgJ3B4JztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdEl0ZW0oaXRlbSkge1xuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy51bnNlbGVjdCAmJiBpdGVtLmlubmVySFRNTCA9PT0gc2VsZi5vcHRpb25zLnVuc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hY3RpdmVJdGVtID0gLTE7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3Rib3hfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFjdGl2ZUl0ZW0gPSBpdGVtLmRhdGFzZXQuaW5kZXg7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuaXRlbUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLml0ZW1DYWxsYmFjayhpdGVtLCBzZWxmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vU2VsZWN0IGNsaWNrXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNlbGVjdENsaWNrKGUpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuYWN0aXZlSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgdGhlcmUgaXMgYW55IHNlbGVjdGVkIGl0ZW0uIElmIG5vdCBzZXQgdGhlIHBsYWNlaG9sZGVyIHRleHRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuYWN0aXZlSXRlbSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gc2VsZi5wbGFjZWhvbGRlciB8fCAnU2VsZWN0JztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgc2VhcmNoIG9wdGlvbiBpcyBvbiBvciB0aGVyZSBpcyBtb3JlIHRoYW4gMTAgaXRlbXMuIElmIHllcywgYWRkIHNlYXJjZmllbGRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5zZWFyY2ggfHwgc2VsZi5vcHRpb25zLml0ZW1zLmxlbmd0aCA+IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2VsZi5zZWFyY2hGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fc2VhcmNoZmllbGQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnBsYWNlaG9sZGVyID0gc2VsZi5vcHRpb25zLnNlYXJjaFBsYWNlaG9sZGVyIHx8ICdTZWFyY2guLi4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBoYW5kbGVTZWFyY2hGaWVsZElucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBoYW5kbGVTZWFyY2hGaWVsZElucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuaW5wdXRGaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9zdGF0ZV9vcGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zLCBzZWxmLmFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZVNlbGVjdERvY0NsaWNrKTt9LCAxMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL1NlbGVjdCBpdGVtIGhhbmRsZXJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlSXRlbUNsaWNrKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBzZWxlY3RJdGVtKGUudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVJdGVtTW91c2VPdmVyKGUpIHtcbiAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTZWxlY3REb2NDbGljaygpIHtcbiAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9GdWx0ZXIgZnVuY3Rpb24gZm9yIHNlYXJjZmllbGRcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2VhcmNoRmllbGRJbnB1dChlKSB7XG4gICAgICAgICAgICB2YXIgZkl0ZW1zID0gc2VsZi5vcHRpb25zLml0ZW1zLmZpbHRlcihmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhlLnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY3JlYXRlTGlzdChmSXRlbXMsIHNlbGYuYWN0aXZlSXRlbSwgZS50YXJnZXQudmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVLZXlEb3duKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB2YXIgaW5kZXgsIGxlbmd0aDtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0SXRlbShzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJylbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDI3OlxuICAgICAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4IC0gMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCA8IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPiAwID8gJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpIC0gJChzZWxmLmxpc3QpLmhlaWdodCgpIDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmhlaWdodCgpIDwgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXgpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXgpLmhlaWdodCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL0NoZWNrIGlmIGZpZWxkIGlzIGVtcHR5IG9yIG5vdCBhbmQgY2hhbmdlIGNsYXNzIGFjY29yZGluZ2x5XG4gICAgICAgICQoc2VsZi5lbCkub24oJ2NsaWNrJywgaGFuZGxlU2VsZWN0Q2xpY2spO1xuICAgIH07XG5cbiAgICBTZWxlY3Rib3gucHJvdG90eXBlLl90b2dnbGVBZGRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMuZWwpLmhhc0NsYXNzKCdqcy1oYXNWYWx1ZScpKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5hZGRDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5yZW1vdmVDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBTZWxlY3Rib3gucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0Ym94X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSAtMTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaW5pdFNlbGVjdGJveGVzKCkge1xuICAgICAgICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1zZWxlY3Rib3gnKSkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbmV3IFNlbGVjdGJveChlbCwge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBlbC5kYXRhc2V0LmxhYmVsLFxuICAgICAgICAgICAgICAgIGhlbHBUZXh0OiBlbC5kYXRhc2V0LmhlbHBUZXh0LFxuICAgICAgICAgICAgICAgIGVyck1zZzogZWwuZGF0YXNldC5lcnJNc2csXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IGVsLmRhdGFzZXQucGxhY2Vob2xkZXIsXG4gICAgICAgICAgICAgICAgaXRlbXM6IEpTT04ucGFyc2UoZWwuZGF0YXNldC5pdGVtcyksXG4gICAgICAgICAgICAgICAgc2VhcmNoOiBlbC5kYXRhc2V0LnNlYXJjaCxcbiAgICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcjplbC5kYXRhc2V0LnNlYXJjaFBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBlbC5kYXRhc2V0LnJlcXVpcmVkLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkSXRlbTogZWwuZGF0YXNldC5zZWxlY3RlZEl0ZW0sXG4gICAgICAgICAgICAgICAgdW5zZWxlY3Q6IGVsLmRhdGFzZXQudW5zZWxlY3RcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0U2VsZWN0Ym94ZXMoKTtcblxuXG4vL30pKHdpbmRvdyk7XG5cbi8vVGFnZmllbGRzXG4vLzsoZnVuY3Rpb24od2luZG93KSB7XG4gICAgLy8ndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBUYWdmaWVsZChlbCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgICAgICB0aGlzLl9pbml0RXZlbnRzKCk7XG4gICAgfVxuXG4gICAgVGFnZmllbGQucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB0aGlzLml0ZW1zID0gdGhpcy5vcHRpb25zLmluaXRpYWxJdGVtcyB8fCBbXTtcblxuICAgICAgICB0aGlzLnRhZ2ZpZWxkV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLnRhZ2ZpZWxkV3JhcHBlci5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fd3JhcHBlcicpO1xuICAgICAgICB0aGlzLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMudGFnZmllbGRXcmFwcGVyLCB0aGlzLmVsKTtcbiAgICAgICAgdGhpcy50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnanMtdGFnZmllbGQnKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fZmllbGQnKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxhYmVsKSB7XG4gICAgICAgICAgICB0aGlzLmxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmxhYmVsO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuZm9yID0gdGhpcy5lbC5pZDtcbiAgICAgICAgICAgIHRoaXMudGFnZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGVscFRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmhlbHBUZXh0O1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9faGVscC10ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLnRhZ2ZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmhlbHBUZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVyck1zZykge1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5lcnJNc2c7XG4gICAgICAgICAgICB0aGlzLmVyck1zZy5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fZXJyLW1zZycpO1xuICAgICAgICAgICAgdGhpcy50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lcnJNc2cpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIHNlbGYuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLl9jcmVhdGVUYWcoaXRlbSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgVGFnZmllbGQucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAvL0Nsb3NlIGxpc3QgaGVscGVyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlTGlzdCgpIHtcbiAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgndGFnZmllbGRfc3RhdGVfb3BlbicpO1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYubGlzdCk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuc2VhcmNoRmllbGQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLnJlbW92ZUNoaWxkKHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuaGVscGVyRmllbGQgJiYgc2VsZi5oZWxwZXJGaWVsZC5wYXJlbnROb2RlID09PSBzZWxmLmVsKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5yZW1vdmVDaGlsZChzZWxmLmhlbHBlckZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZ2ZpZWxkX190YWcnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVUYWdmaWVsZERvY0NsaWNrKTtcbiAgICAgICAgICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgICAgICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vQ3JlYXRlIGxpc3QgaGVscGVyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUxpc3QoaXRlbXMsIGFjdGl2ZUl0ZW0sIHNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzZWxmLmxpc3QpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgc2VsZi5saXN0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fbGlzdCcpO1xuXG4gICAgICAgICAgICBzZWxmLmxpc3RIZWxwZXIgPSAkKCc8ZGl2PjwvZGl2PicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWl0ZW0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdwb3NpdGlvbicsICdhYnNvbHV0ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3otaW5kZXgnLCAnLTEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ292ZXJmbG93JywgJ3Zpc2libGUnKTtcblxuICAgICAgICAgICAgc2VsZi50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VsZi5saXN0SGVscGVyLmdldCgwKSk7XG5cbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19saXN0LWl0ZW0nKTtcbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5pbm5lckhUTUwgPSBpdGVtO1xuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmlkID0gJ2xpc3RJdGVtLScgKyBpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdEhlbHBlci50ZXh0KGl0ZW0pO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gbGlzdEl0ZW1UZXh0KGl0ZW1TdHJpbmcsIHRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdvcmRzID0gaXRlbVN0cmluZy5zcGxpdCgnICcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoSW5kZXggPSB3b3Jkcy5yZWR1Y2UoZnVuY3Rpb24oY3VycmVudEluZGV4LCB3b3JkLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3b3JkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0KSA+IC0xICYmIGN1cnJlbnRJbmRleCA9PT0gLTEgPyBpbmRleCA6IGN1cnJlbnRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIC0xKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VhcmNoSW5kZXggPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdHJpbmdFbmQgPSB3b3Jkcy5zbGljZShzZWFyY2hJbmRleCkucmVkdWNlKGZ1bmN0aW9uKHN0ciwgd29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHIgKyAnICcgKyB3b3JkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gL1xcLiQvO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRzWzBdLm1hdGNoKHJlZykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd29yZHNbMF0gKyAnICcgKyB3b3Jkc1sxXSArICcgLi4uICcgKyBzdHJpbmdFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3b3Jkc1swXSArICcgLi4uICcgKyBzdHJpbmdFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VhcmNoVGV4dCAmJiAkKHNlbGYuc2VsZWN0V3JhcHBlcikud2lkdGgoKSA8IHNlbGYubGlzdEhlbHBlci53aWR0aCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmlubmVySFRNTCA9IGxpc3RJdGVtVGV4dChpdGVtLCBzZWFyY2hUZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtID09PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVJdGVtQ2xpY2spO1xuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGhhbmRsZUl0ZW1Nb3VzZU92ZXIpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChpdGVtRWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2VsZi50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VsZi5saXN0KTtcblxuXG4gICAgICAgICAgICB2YXIgZmllbGRSZWN0ID0gc2VsZi5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgICAgICBmaWVsZE9mZnNldFRvcCA9IHNlbGYuZWwub2Zmc2V0VG9wLFxuICAgICAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgICAgICAgICBtZW51UmVjdCA9IHNlbGYubGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcblxuICAgICAgICAgICAgICAgIGhlaWdodENoZWNrID0gd2luZG93SGVpZ2h0IC0gZmllbGRSZWN0LnRvcCAtIGZpZWxkUmVjdC5oZWlnaHQgLSBtZW51UmVjdC5oZWlnaHQ7XG5cbiAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS50b3AgPSBoZWlnaHRDaGVjayA+IDAgPyBmaWVsZE9mZnNldFRvcCArIGZpZWxkUmVjdC5oZWlnaHQgKyA1ICsgJ3B4JyA6IGZpZWxkT2Zmc2V0VG9wIC0gbWVudVJlY3QuaGVpZ2h0IC0gMTAgKyAncHgnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9TZWxlY3QgY2xpY2tcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGFnZmllbGRDbGljayhlKSB7XG4gICAgICAgICAgICAvL2Uuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgLy9jbG9zZUxpc3QoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICAvL0NyZWF0ZSBTZWFyY2hmaWVsZFxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnNlYXJjaCB8fCBzZWxmLm9wdGlvbnMuaXRlbXMubGVuZ3RoID4gNyB8fCBzZWxmLm9wdGlvbnMuY3JlYXRlVGFncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmLnNlYXJjaEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC50eXBlID0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX3NlYXJjaGZpZWxkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5wbGFjZWhvbGRlciA9IHNlbGYub3B0aW9ucy5zZWFyY2hQbGFjZWhvbGRlciB8fCAnU2VhcmNoLi4uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaGFuZGxlU2VhcmNoRmllbGRJbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC52YWx1ZSA9ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWdmaWVsZF9fdGFnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBzZWxmLm9wdGlvbnMucGxhY2Vmb2xkZXIgfHwgJ1NlbGVjdCBmcm9tIHRoZSBsaXN0JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC50eXBlID0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5jbGFzc0xpc3QuYWRkKCdqcy1oZWxwZXJJbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuc3R5bGUuekluZGV4ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuaGVscGVyRmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9zdGF0ZV9vcGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zLCBzZWxmLmFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZVRhZ2ZpZWxkRG9jQ2xpY2spO30sIDEwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgLy9TZWxlY3QgaXRlbSBoYW5kbGVyXG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdFRhZyhlbCkge1xuICAgICAgICAgICAgaWYgKHNlbGYuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFnZmllbGRfX3RhZycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZ2ZpZWxkX19zZWFyY2hmaWVsZCcpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1oZWxwZXJJbnB1dCcpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuaGVscGVyRmllbGQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmIChzZWxmLnNlYXJjaEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5pbnNlcnRCZWZvcmUoc2VsZi5fY3JlYXRlVGFnKGVsLmlubmVySFRNTCksIHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuX2NyZWF0ZVRhZyhlbC5pbm5lckhUTUwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuaXRlbXMucHVzaChlbC5pbm5lckhUTUwpO1xuXG4gICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5zZWFyY2hGaWVsZCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgY3JlYXRlTGlzdChzZWxmLm9wdGlvbnMuaXRlbXMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLmhlbHBlckZpZWxkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBjcmVhdGVMaXN0KHNlbGYub3B0aW9ucy5pdGVtcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgICAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuaXRlbUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLml0ZW1DYWxsYmFjayhlbCwgc2VsZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlSXRlbUNsaWNrKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBzZWxlY3RUYWcoZS50YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUl0ZW1Nb3VzZU92ZXIoZSkge1xuICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVRhZ2ZpZWxkRG9jQ2xpY2soZSkge1xuICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL0Z1bHRlciBmdW5jdGlvbiBmb3Igc2VhcmNmaWVsZFxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTZWFyY2hGaWVsZElucHV0KGUpIHtcbiAgICAgICAgICAgIHZhciBmSXRlbXMgPSBzZWxmLm9wdGlvbnMuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjcmVhdGVMaXN0KGZJdGVtcywgc2VsZi5hY3RpdmVJdGVtLCBlLnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpKTtcblxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlLnNsaWNlKC0xKSA9PT0gJywnICYmIHNlbGYub3B0aW9ucy5jcmVhdGVUYWdzKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5pbnNlcnRCZWZvcmUoc2VsZi5fY3JlYXRlVGFnKGUudGFyZ2V0LnZhbHVlLnNsaWNlKDAsIC0xKSksIHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgZS50YXJnZXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICBlLnRhcmdldC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGNyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zKTtcbiAgICAgICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVLZXlEb3duKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB2YXIgaW5kZXgsIGxlbmd0aDtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0VGFnKHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnICYmIHNlbGYub3B0aW9ucy5jcmVhdGVUYWdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmluc2VydEJlZm9yZShzZWxmLl9jcmVhdGVUYWcoZS50YXJnZXQudmFsdWUpLCBzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUudGFyZ2V0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnRhcmdldC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTGlzdChzZWxmLm9wdGlvbnMuaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDI3OlxuICAgICAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4IC0gMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgPCA1MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA+IDAgPyAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPCAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vRGVsZXRlIHRhZyBoYW5kbGVcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlRGVsZXRlVGFnKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB2YXIgdGFnID0gZS50YXJnZXQucGFyZW50Tm9kZTtcblxuICAgICAgICAgICAgdGFnLnJlbW92ZUNoaWxkKGUudGFyZ2V0KTtcbiAgICAgICAgICAgIHZhciB0YWdUaXRsZSA9IHRhZy5pbm5lckhUTUwsXG4gICAgICAgICAgICAgICAgdGFnSW5kZXggPSBzZWxmLml0ZW1zLmluZGV4T2YodGFnVGl0bGUpO1xuICAgICAgICAgICAgaWYgKHRhZ0luZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gW10uY29uY2F0KHNlbGYuaXRlbXMuc2xpY2UoMCwgdGFnSW5kZXgpLCBzZWxmLml0ZW1zLnNsaWNlKHRhZ0luZGV4ICsgMSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmVsLnJlbW92ZUNoaWxkKHRhZyk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZ2ZpZWxkX190YWcnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmVsLmNsYXNzTGlzdC5jb250YWlucygndGFnZmllbGRfc3RhdGVfb3BlbicpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gc2VsZi5vcHRpb25zLnBsYWNlZm9sZGVyIHx8ICdTZWxlY3QgZnJvbSB0aGUgbGlzdCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuXG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vQ2hlY2sgaWYgZmllbGQgaXMgZW1wdHkgb3Igbm90IGFuZCBjaGFuZ2UgY2xhc3MgYWNjb3JkaW5nbHlcbiAgICAgICAgJCh0aGlzLnRhZ2ZpZWxkV3JhcHBlcikub24oJ2NsaWNrJywgJy50YWdmaWVsZF9fZmllbGQnLCBoYW5kbGVUYWdmaWVsZENsaWNrKTtcbiAgICAgICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuXG4gICAgfTtcblxuICAgIC8vQXV0b3Jlc2l6ZSB0ZXh0YXJlYVxuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5fYXV0b3NpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuZWwudmFsdWUgPT09ICcnKSB7dGhpcy5lbC5yb3dzID0gMTt9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCxcbiAgICAgICAgICAgICAgICBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpLFxuICAgICAgICAgICAgICAgIHRleHRXaWR0aCA9IHRoaXMuZWwudmFsdWUubGVuZ3RoICogNyxcbiAgICAgICAgICAgICAgICByb3cgPSBNYXRoLmNlaWwodGV4dFdpZHRoIC8gd2lkdGgpO1xuXG4gICAgICAgICAgICByb3cgPSByb3cgPD0gMCA/IDEgOiByb3c7XG4gICAgICAgICAgICByb3cgPSB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0ICYmIHJvdyA+IHRoaXMub3B0aW9ucy5tYXhIZWlnaHQgPyB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0IDogcm93O1xuXG4gICAgICAgICAgICB0aGlzLmVsLnJvd3MgPSByb3c7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy9DcmVhdGUgVGFnIEhlbHBlclxuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5fY3JlYXRlVGFnID0gZnVuY3Rpb24odGFnTmFtZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIGRlbFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgIHRhZy5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fdGFnJyk7XG4gICAgICAgIHRhZy5pbm5lckhUTUwgPSB0YWdOYW1lO1xuXG4gICAgICAgIGRlbFRhZy5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fdGFnLWRlbGV0ZScpO1xuICAgICAgICBkZWxUYWcuaW5uZXJIVE1MID0gJ+KclSc7XG4gICAgICAgIGRlbFRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBzZWxmLl9kZWxldGVUYWcoZS50YXJnZXQucGFyZW50Tm9kZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRhZy5hcHBlbmRDaGlsZChkZWxUYWcpO1xuXG4gICAgICAgIHJldHVybiB0YWc7XG4gICAgfTtcblxuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5fZGVsZXRlVGFnID0gZnVuY3Rpb24odGFnKSB7XG4gICAgICAgIHRoaXMuZWwucmVtb3ZlQ2hpbGQodGFnKTtcblxuICAgICAgICAkKHRhZykuZmluZCgnLnRhZ2ZpZWxkX190YWctZGVsZXRlJykucmVtb3ZlKCk7XG4gICAgICAgIHZhciB0YWdUaXRsZSA9IHRhZy5pbm5lckhUTUwsXG4gICAgICAgICAgICB0YWdJbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZih0YWdUaXRsZSk7XG4gICAgICAgIGlmICh0YWdJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zID0gW10uY29uY2F0KHRoaXMuaXRlbXMuc2xpY2UoMCwgdGFnSW5kZXgpLCB0aGlzLml0ZW1zLnNsaWNlKHRhZ0luZGV4ICsgMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFnZmllbGRfX3RhZycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmVsLmNsYXNzTGlzdC5jb250YWlucygndGFnZmllbGRfc3RhdGVfb3BlbicpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSBzZWxmLm9wdGlvbnMucGxhY2Vmb2xkZXIgfHwgJ1NlbGVjdCBmcm9tIHRoZSBsaXN0JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90b2dnbGVBZGRhYmxlKCk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWxldGVUYWdDYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRlbGV0ZVRhZ0NhbGxiYWNrKHRhZywgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5fdG9nZ2xlQWRkYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzLmVsKS5oYXNDbGFzcygnanMtaGFzVmFsdWUnKSkge1xuICAgICAgICAgICAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykuYWRkQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgVGFnZmllbGQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICAgICAgJCh0aGlzLmVsKS5maW5kKCcudGFnZmllbGRfX3RhZycpLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICB0aGlzLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRUYWdmaWVsZHMoKSB7XG4gICAgICAgIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXRhZ2ZpZWxkJykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIG5ldyBUYWdmaWVsZChlbCwge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBlbC5kYXRhc2V0LmxhYmVsLFxuICAgICAgICAgICAgICAgIGhlbHBUZXh0OiBlbC5kYXRhc2V0LmhlbHBUZXh0LFxuICAgICAgICAgICAgICAgIGVyck1zZzogZWwuZGF0YXNldC5lcnJNc2csXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IGVsLmRhdGFzZXQucGxhY2Vob2xkZXIsXG4gICAgICAgICAgICAgICAgaXRlbXM6IEpTT04ucGFyc2UoZWwuZGF0YXNldC5pdGVtcyksXG4gICAgICAgICAgICAgICAgc2VhcmNoOiBlbC5kYXRhc2V0LnNlYXJjaCxcbiAgICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcjogZWwuZGF0YXNldC5zZWFyY2hQbGFjZWhvbGRlcixcbiAgICAgICAgICAgICAgICBjcmVhdGVUYWdzOiBlbC5kYXRhc2V0LmNyZWF0ZU5ld1RhZyxcbiAgICAgICAgICAgICAgICBpbml0aWFsSXRlbXM6IGVsLmRhdGFzZXQuc2VsZWN0ZWRJdGVtcyA/IEpTT04ucGFyc2UoZWwuZGF0YXNldC5zZWxlY3RlZEl0ZW1zKSA6ICcnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdFRhZ2ZpZWxkcygpO1xuXG5cbi8vfSkod2luZG93KTtcblxuLy9BZGRhYmxlZmllbHNcbi8vOyhmdW5jdGlvbih3aW5kb3cpIHtcbiAgICAvLyd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIEFkZGFibGUoZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHtzb3J0YWJsZTogdHJ1ZX07XG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgIH1cblxuICAgIEFkZGFibGUucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtYWRkYWJsZVdyYXBwZXInKTtcbiAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5pbnNlcnRCZWZvcmUoc2VsZi5lbCk7XG5cbiAgICAgICAgc2VsZi5lbC5yZW1vdmVDbGFzcygnanMtYWRkYWJsZScpO1xuICAgICAgICBzZWxmLmVsLmFkZENsYXNzKCdqcy1hZGRhYmxlSXRlbSBjLUFkZGFibGUtaXRlbScpO1xuXG4gICAgICAgIHNlbGYuYWRkYWJsZVJvdyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLWFkZGFibGVSb3cgYy1BZGRhYmxlLXJvdycpO1xuXG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMuc29ydGFibGUpIHtcbiAgICAgICAgICAgIHNlbGYuYWRkYWJsZVJvd0RyYWdIYW5kbGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnYy1BZGRhYmxlLXJvdy1kcmFnSGFuZGxlcicpO1xuICAgICAgICAgICAgc2VsZi5hZGRhYmxlUm93LmFwcGVuZChzZWxmLmFkZGFibGVSb3dEcmFnSGFuZGxlcik7XG5cbiAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuc29ydGFibGUoe1xuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBzZWxmLm9wdGlvbnMgPyBzZWxmLm9wdGlvbnMucGxhY2Vob2xkZXIgfHwgJ2MtQWRkYWJsZS1yb3dQbGFjZWhvbGRlcicgOiAnYy1BZGRhYmxlLXJvd1BsYWNlaG9sZGVyJyxcbiAgICAgICAgICAgICAgICBzdGFydDogZnVuY3Rpb24oZSwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgdWkuaXRlbS5hZGRDbGFzcygnaXMtZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgJChlLnRhcmdldCkuY3NzKCdoZWlnaHQnLCAkKGUudGFyZ2V0KS5oZWlnaHQoKSk7XG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5jc3MoJ2hlaWdodCcsICQoJ2JvZHknKS5oZWlnaHQoKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdG9wOiBmdW5jdGlvbihlLCB1aSkge1xuICAgICAgICAgICAgICAgICAgICB1aS5pdGVtLnJlbW92ZUNsYXNzKCdpcy1kcmFnZ2luZycpO1xuICAgICAgICAgICAgICAgICAgICAkKGUudGFyZ2V0KS5jc3MoJ2hlaWdodCcsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmNzcygnaGVpZ2h0JywgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5hZGRCdXR0b24gPSAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24tLXJvdW5kIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXkgYnV0dG9uLS1hZGQgYy1BZGRhYmxlLXJvdy1hZGRCdXR0b24nKS5jbGljayhoYW5kbGVBZGRSb3cpO1xuXG4gICAgICAgIHNlbGYucmVtb3ZlQnV0dG9uID0gJCgnPGJ1dHRvbj48L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uLS1yb3VuZCBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5IGJ1dHRvbi0tcmVtb3ZlIGpzLWFkZGFibGVSZW1vdmVCdXR0b24nKS5jbGljayhoYW5kbGVSZW1vdmVSb3cpO1xuXG4gICAgICAgIHNlbGYuYWRkYWJsZVJvdy5hcHBlbmQoc2VsZi5lbC5jbG9uZSh0cnVlLCB0cnVlKSwgdGhpcy5yZW1vdmVCdXR0b24sIHRoaXMuYWRkQnV0dG9uKTtcbiAgICAgICAgc2VsZi5vcmlnaW5hbEVsID0gc2VsZi5lbC5jbG9uZSh0cnVlLCB0cnVlKTtcbiAgICAgICAgc2VsZi5lbC5kZXRhY2goKTtcblxuICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLmFwcGVuZCh0aGlzLmFkZGFibGVSb3cuY2xvbmUodHJ1ZSwgdHJ1ZSkpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUFkZFJvdyhlKSB7XG4gICAgICAgICAgICAvL0NoZWNrIGlmIHRoZXJlIGFyZSBtb3JlIHRoYW4gMSBjaGlsZCBhbmQgY2hhbmdlIGNsYXNzXG4gICAgICAgICAgICBpZiAoc2VsZi5hZGRhYmxlV3JhcHBlci5jaGlsZHJlbigpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLmFkZENsYXNzKCdoYXMtbXVsdGlwbGVSb3dzJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ2hhcy1tdWx0aXBsZVJvd3MnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vc2VsZi5hZGRhYmxlV3JhcHBlci5hcHBlbmQoc2VsZi5hZGRhYmxlUm93LmNsb25lKHRydWUsIHRydWUpKTtcbiAgICAgICAgICAgIHNlbGYuX2FkZEl0ZW0oc2VsZi5vcmlnaW5hbEVsLmNsb25lKHRydWUsIHRydWUpLCBzZWxmLm9wdGlvbnM/IHNlbGYub3B0aW9ucy5iZWZvcmVBZGQgOiBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVSZW1vdmVSb3coZSkge1xuICAgICAgICBcdCQoZS50YXJnZXQpLnBhcmVudHMoJy5qcy1hZGRhYmxlUm93JykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoc2VsZi5hZGRhYmxlV3JhcHBlci5jaGlsZHJlbignLmpzLWFkZGFibGVSb3cnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2FkZEl0ZW0oc2VsZi5vcmlnaW5hbEVsLmNsb25lKHRydWUsIHRydWUpLCBzZWxmLm9wdGlvbnM/IHNlbGYub3B0aW9ucy5iZWZvcmVBZGQgOiBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5yZW1vdmVDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ2hhcy1tdWx0aXBsZVJvd3MnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuX2FkZEl0ZW0gPSBmdW5jdGlvbihlbCwgYmVmb3JlQWRkKSB7XG4gICAgICAgICAgICBpZiAoYmVmb3JlQWRkKSB7XG4gICAgICAgICAgICAgICAgYmVmb3JlQWRkKGVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhZGRhYmxlUm93ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtYWRkYWJsZVJvdyBjLUFkZGFibGUtcm93JyksXG4gICAgICAgICAgICAgICAgYWRkQnV0dG9uID0gJCgnPGJ1dHRvbj48L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uLS1yb3VuZCBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5IGJ1dHRvbi0tYWRkIGMtQWRkYWJsZS1yb3ctYWRkQnV0dG9uJykuY2xpY2soaGFuZGxlQWRkUm93KSxcbiAgICAgICAgICAgICAgICByZW1vdmVCdXR0b24gPSAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24tLXJvdW5kIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXkgYnV0dG9uLS1yZW1vdmUganMtYWRkYWJsZVJlbW92ZUJ1dHRvbicpLmNsaWNrKGhhbmRsZVJlbW92ZVJvdyk7XG5cbiAgICAgICAgICAgIGVsLmFkZENsYXNzKCdqcy1hZGRhYmxlSXRlbSBjLUFkZGFibGUtaXRlbScpO1xuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5zb3J0YWJsZSkge1xuICAgICAgICAgICAgICAgIHZhciBhZGRhYmxlUm93RHJhZ0hhbmRsZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjLUFkZGFibGUtcm93LWRyYWdIYW5kbGVyJyk7XG4gICAgICAgICAgICAgICAgYWRkYWJsZVJvdy5hcHBlbmQoYWRkYWJsZVJvd0RyYWdIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZGFibGVSb3cuYXBwZW5kKGVsLCByZW1vdmVCdXR0b24sIGFkZEJ1dHRvbik7XG4gICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLmFwcGVuZChhZGRhYmxlUm93KTtcblxuICAgICAgICAgICAgaWYgKHNlbGYuYWRkYWJsZVdyYXBwZXIuY2hpbGRyZW4oKS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5hZGRDbGFzcygnaGFzLW11bHRpcGxlUm93cycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLnJlbW92ZUNsYXNzKCdoYXMtbXVsdGlwbGVSb3dzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmFmdGVyQWRkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLmFmdGVyQWRkKGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9BdXRvIHNjcm9sbCBwYWdlIHdoZW4gYWRkaW5nIHJvdyBiZWxvdyBzY3JlZW4gYm90dG9tIGVkZ2VcbiAgICAgICAgICAgIHZhciByb3dCb3R0b21FbmQgPSBhZGRhYmxlUm93LmdldCgwKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBhZGRhYmxlUm93LmhlaWdodCgpO1xuICAgICAgICAgICAgaWYgKHJvd0JvdHRvbUVuZCArIDYwID4gJCh3aW5kb3cpLmhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoIHsgc2Nyb2xsVG9wOiAnKz0nICsgTWF0aC5yb3VuZChyb3dCb3R0b21FbmQgKyA2MCAtICQod2luZG93KS5oZWlnaHQoKSkudG9TdHJpbmcoKSB9LCA0MDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5hZGRhYmxlV3JhcHBlcjtcbiAgICAgICAgfTtcbiAgICAgICAgc2VsZi5yZW1vdmVJdGVtID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuY2hpbGRyZW4oKS5zbGljZShpbmRleCwgaW5kZXgrMSkucmVtb3ZlKCk7XG4gICAgICAgICAgICBpZiAoc2VsZi5hZGRhYmxlV3JhcHBlci5jaGlsZHJlbignLmpzLWFkZGFibGVSb3cnKS5sZW5ndGggPD0gMSkge1xuICAgICAgICBcdFx0c2VsZi5hZGRhYmxlV3JhcHBlci5yZW1vdmVDbGFzcygnaGFzLW11bHRpcGxlUm93cycpO1xuICAgICAgICBcdH1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaW5pdEFkZGFibGVGaWVsZHMoKSB7XG4gICAgICAgIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWFkZGFibGUnKSkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbmV3IEFkZGFibGUoJChlbCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuLy99KSh3aW5kb3cpO1xuXG4vL1V0aWxpdGllc1xuXG4vL1Rocm90dGxlIFNjcm9sbCBldmVudHNcbjsoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRocm90dGxlID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgb2JqKSB7XG4gICAgICAgIG9iaiA9IG9iaiB8fCB3aW5kb3c7XG4gICAgICAgIHZhciBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHZhciBmdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAocnVubmluZykgeyByZXR1cm47IH1cbiAgICAgICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG9iai5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChuYW1lKSk7XG4gICAgICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIG9iai5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGZ1bmMpO1xuICAgIH07XG5cbiAgICAvKiBpbml0IC0geW91IGNhbiBpbml0IGFueSBldmVudCAqL1xuICAgIHRocm90dGxlIChcInNjcm9sbFwiLCBcIm9wdGltaXplZFNjcm9sbFwiKTtcbiAgICB0aHJvdHRsZSAoXCJyZXNpemVcIiwgXCJvcHRpbWl6ZWRSZXNpemVcIik7XG59KSgpO1xuXG4vL1N0aWNreSB0b3BiYXJcbmZ1bmN0aW9uIFN0aWNreVRvcGJhcigpIHtcbiAgICB0aGlzLl9pbml0KCk7XG59XG5cblN0aWNreVRvcGJhci5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5sYXN0U2Nyb2xsUG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgIHNlbGYudG9wYmFyVHJhbnNpdGlvbiA9IGZhbHNlO1xuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9wdGltaXplZFNjcm9sbFwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBzY3JvbGxQb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA1NSAmJiAhJCgnLmMtSGVhZGVyLXRpdGxlJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICQoJy5jLUhlYWRlci10aXRsZScpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDU1ICYmICQoJy5jLUhlYWRlci10aXRsZScpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAkKCcuYy1IZWFkZXItdGl0bGUnKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnYy1IZWFkZXItY29udHJvbHMtLWNlbnRlcicpKSB7XG4gICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDU1ICYmICEkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlci1jb250cm9scy0tY2VudGVyJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDU1ICYmICQoJy5jLUhlYWRlci1jb250cm9scycpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyLWNvbnRyb2xzLS1jZW50ZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnaGVhZGVyX19jb250cm9scy0tZmlsdGVyJykpIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gNTUgJiYgISQoJy5jLUhlYWRlci1jb250cm9scycpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmhlYWRlcl9fY29udHJvbHMtLWZpbHRlcicpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCA1NSAmJiAkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5oZWFkZXJfX2NvbnRyb2xzLS1maWx0ZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnYy1IZWFkZXItLWNvbnRyb2xzJykpIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gMTQ1ICYmICEkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlcicpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCAxNDUgJiYgJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaGVhZGVyLS1maWx0ZXInKSkge1xuICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA3MCAmJiAhJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXInKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgNzAgJiYgJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gODUgJiYgISQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDg1ICYmICQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyJykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJCgnLmxpYnJhcnlfX2hlYWRlcicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gNzAgJiYgISQoJy5saWJyYXJ5X19oZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5saWJyYXJ5X19oZWFkZXInKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgNzAgJiYgJCgnLmxpYnJhcnlfX2hlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmxpYnJhcnlfX2hlYWRlcicpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSA5MzApIHtcbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDU1ICYmICEkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDU1ICYmICQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSAxMCAmJiAhJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCAxMCAmJiAkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0pO1xufTtcblxuLy9TY3JvbGxTcHlOYXZcbjsoZnVuY3Rpb24od2luZG93KSB7XG4gICAgLy8ndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBTY3JvbGxTcHlOYXYoZWwpIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuXG4gICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICAgICAgdGhpcy5faW5pdEV2ZW50cygpO1xuICAgIH1cblxuICAgIFNjcm9sbFNweU5hdi5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLmVsLmRhdGFzZXQudG9wT2Zmc2V0XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdLnNsaWNlLmNhbGwodGhpcy5lbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKSkubWFwKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICB2YXIgaXRlbUlkID0gZWwuZGF0YXNldC5ocmVmO1xuICAgICAgICAgICAgcmV0dXJuIHtuYXZJdGVtOiBlbCxcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaXRlbUlkKX07XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBTY3JvbGxTcHlOYXYucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9wdGltaXplZFNjcm9sbFwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoIXNlbGYuc2Nyb2xsaW5nVG9JdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1haW5JdGVtcyA9IHNlbGYuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsQkNSID0gaXRlbS5pdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxCQ1IudG9wID4gc2VsZi5vcHRpb25zLm9mZnNldCAmJiBlbEJDUi50b3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1haW5JdGVtcy5sZW5ndGggPiAwICYmICghc2VsZi5tYWluSXRlbSB8fCBzZWxmLm1haW5JdGVtICE9PSBtYWluSXRlbXNbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubWFpbkl0ZW0gPSBtYWluSXRlbXNbMF07XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpLm5hdkl0ZW0uY2xhc3NMaXN0LnJlbW92ZShzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tYWluSXRlbS5uYXZJdGVtLmNsYXNzTGlzdC5hZGQoc2VsZi5vcHRpb25zLmFjdGl2ZUNsYXNzIHx8ICdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBpdGVtLm5hdkl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhyZWYgPSAnIycgKyBlLnRhcmdldC5kYXRhc2V0LmhyZWY7XG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldFRvcCA9IGhyZWYgPT09IFwiI1wiID8gMCA6ICQoaHJlZikub2Zmc2V0KCkudG9wIC0gc2VsZi5vcHRpb25zLm9mZnNldCAtIDMwO1xuICAgICAgICAgICAgICAgIHNlbGYuc2Nyb2xsaW5nVG9JdGVtID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZWxmLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICAgICAgICBpLml0ZW0uY2xhc3NMaXN0LnJlbW92ZShzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICBpLm5hdkl0ZW0uY2xhc3NMaXN0LnJlbW92ZShzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKHNlbGYub3B0aW9ucy5hY3RpdmVDbGFzcyB8fCAnaXMtYWN0aXZlJyk7XG5cblxuICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogb2Zmc2V0VG9wXG4gICAgICAgICAgICAgICAgfSwgMzAwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zY3JvbGxpbmdUb0l0ZW0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgJChocmVmKS5hZGRDbGFzcyhzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRTY3JvbGxTcHlOYXYoKSB7XG4gICAgICAgIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXNjcm9sbFNweU5hdicpKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBuZXcgU2Nyb2xsU3B5TmF2KGVsKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGluaXRTY3JvbGxTcHlOYXYoKTtcblxufSkod2luZG93KTtcblxuLy9Ecm9wZG93blxuZnVuY3Rpb24gRHJvcGRvd24oZWwsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMuX2luaXQoKTtcbiAgICB0aGlzLl9pbml0RXZlbnRzKCk7XG59XG5cbkRyb3Bkb3duLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZHJvcGRvd25XcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5kcm9wZG93bldyYXBwZXIuY2xhc3NMaXN0LmFkZCgnanMtZHJvcGRvd25XcmFwcGVyJyk7XG4gICAgdGhpcy5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmRyb3Bkb3duV3JhcHBlciwgdGhpcy5lbCk7XG4gICAgdGhpcy5kcm9wZG93bldyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdqcy1kcm9wZG93bicpO1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnanMtZHJvcGRvd25JdGVtJyk7XG59O1xuXG5Ecm9wZG93bi5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvL0Nsb3NlIGxpc3QgaGVscGVyXG4gICAgZnVuY3Rpb24gY2xvc2VMaXN0KCkge1xuICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLW9wZW4nKTtcbiAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgc2VsZi5kcm9wZG93bldyYXBwZXIucmVtb3ZlQ2hpbGQoc2VsZi5saXN0KTtcbiAgICAgICAgICAgIHNlbGYubGlzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVPdXRzaWRlQ2xpY2spO1xuICAgIH1cbiAgICAvL0hhbmRsZSBvdXRzaWRlIGRyb3Bkb3duIGNsaWNrXG4gICAgZnVuY3Rpb24gaGFuZGxlT3V0c2lkZUNsaWNrKGUpIHtcbiAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgfVxuXG4gICAgLy9IYW5kbGUgZHJvcGRvd24gY2xpY2tcbiAgICBmdW5jdGlvbiBoYW5kbGVEcm9wZG93bkNsaWNrKGUpIHtcblxuICAgICAgICAvL2Uuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChzZWxmLmVsLmNsYXNzTGlzdC5jb250YWlucygnaXMtb3BlbicpKSB7Y2xvc2VMaXN0KCk7fVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuaXRlbXMpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ2lzLW9wZW4nKTtcblxuICAgICAgICAgICAgICAgIHNlbGYubGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LmNsYXNzTGlzdC5hZGQoJ2MtRHJvcGRvd24tbGlzdCcpO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5kaXZpZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkcm9wZG93bl9fZGl2aWRlcicpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZHJvcGRvd25fX2xpc3QtaXRlbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuaW5uZXJIVE1MID0gaXRlbS5pbm5lckhUTUwgfHwgaXRlbS50ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jYWxsYmFjayhlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ud2FybmluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLndhcm5pbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoYXMtd2FybmluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3QuYXBwZW5kQ2hpbGQoaXRlbUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5kcm9wZG93bldyYXBwZXIuYXBwZW5kQ2hpbGQoc2VsZi5saXN0KTtcblxuICAgICAgICAgICAgICAgIHZhciBsaXN0UmVjdCA9IHNlbGYubGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgIGlmIChsaXN0UmVjdC5sZWZ0ICsgbGlzdFJlY3Qud2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUucmlnaHQgPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS5sZWZ0ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RSZWN0LnRvcCArIGxpc3RSZWN0LmhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUuYm90dG9tID0gJzEwMCUnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS50b3AgPSAnMTAwJSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlT3V0c2lkZUNsaWNrKTt9LCAxMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VsZi5lbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZURyb3Bkb3duQ2xpY2spO1xufTtcblxuLy9JbWFnZSBQbGFjZWhvbGRlcnNcbi8vVGhpcyBjbGFzcyBjcmVhdGVzIGEgcGFsY2Vob2xkZXIgZm9yIGltYWdlIGZpbGVzLiBJdCBoYW5kbGUgYm90aCBjbGljayB0byBsb2FkIGFuZCBhbHNvIHNlbGVjdCBmcm9tIGFzc2V0IGxpYnJhcnkgYWN0aW9uLlxuXG5mdW5jdGlvbiBJbWFnZVBsYWNlaG9sZGVyKGVsLCBmaWxlLCBvcHRpb25zKSB7XG4gIHRoaXMuZWwgPSBlbDtcbiAgdGhpcy5maWxlID0gZmlsZTtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB0aGlzLl9pbml0KCk7XG4gIHRoaXMuX2luaXRFdmVudHMoKTtcbn1cblxuSW1hZ2VQbGFjZWhvbGRlci5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5vcHRpb25zLm5hbWUgPSB0aGlzLm9wdGlvbnMubmFtZSB8fCB0aGlzLmVsLmRhdGFzZXQubmFtZTtcbiAgdGhpcy5vcHRpb25zLmlkID0gdGhpcy5lbC5pZCArICctcGxhY2Vob2xkZXInO1xuXG4gIC8vV3JhcHAgcGxhY2Vob2xkZXJcbiAgdGhpcy53cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRoaXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjLUltYWdlUGxhY2Vob2xkZXInKTtcbiAgaWYgKCF0aGlzLmZpbGUpIHt0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaXMtZW1wdHknKTt9XG4gIHRoaXMud3JhcHBlci5pZCA9IHRoaXMub3B0aW9ucy5pZDtcblxuICAvL1BsYWNlaG9sZGVyIEltYWdlXG4gIHRoaXMuaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy5pbWFnZS5jbGFzc0xpc3QuYWRkKCdjLUltYWdlUGxhY2Vob2xkZXItaW1nJyk7XG4gIGlmICh0aGlzLmZpbGUpIHt0aGlzLmltYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IHRoaXMuZmlsZS5maWxlRGF0YS51cmw7fVxuICB0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5pbWFnZSk7XG5cbiAgLy9QbGFjZWhvbGRlciBjb250cm9sc1xuICB0aGlzLmNvbnRyb2xzID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzJykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzVXBsb2FkID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbicpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc1VwbG9hZEljb24gPSAkKCc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbi1pY29uJykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzVXBsb2FkVGV4dCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1idXR0b24tdGV4dCcpLnRleHQoJ1VwbG9hZCBmcm9tIHlvdXIgY29tcHV0ZXInKS5nZXQoMCk7XG4gIHRoaXMuY29udHJvbHNVcGxvYWQuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc1VwbG9hZEljb24pO1xuICB0aGlzLmNvbnRyb2xzVXBsb2FkLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNVcGxvYWRUZXh0KTtcblxuICB0aGlzLmNvbnRyb2xzRGl2aWRlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1kaXZpZGVyJykuZ2V0KDApO1xuXG4gIHRoaXMuY29udHJvbHNMaWJyYXJ5ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbicpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc0xpYnJhcnlJY29uID0gJCgnPGkgY2xhc3M9XCJmYSBmYS1mb2xkZXItb3BlblwiPjwvaT4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbi1pY29uJykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzTGlicmFyeVRleHQgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMtYnV0dG9uLXRleHQnKS50ZXh0KCdBZGQgZnJvbSBhc3NldCBsaWJyYXJ5JykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzTGlicmFyeS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzTGlicmFyeUljb24pO1xuICB0aGlzLmNvbnRyb2xzTGlicmFyeS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzTGlicmFyeVRleHQpO1xuXG4gIHRoaXMuY29udHJvbHMuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc1VwbG9hZCk7XG4gIHRoaXMuY29udHJvbHMuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc0RpdmlkZXIpO1xuICB0aGlzLmNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNMaWJyYXJ5KTtcbiAgdGhpcy5pbWFnZS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzKTtcblxuICAvL0NsZWFyIGJ1dHRvblxuICB0aGlzLmRlbGV0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLmRlbGV0ZS5jbGFzc0xpc3QuYWRkKCdjLUltYWdlUGxhY2Vob2xkZXItZGVsZXRlJyk7XG4gIHRoaXMuaW1hZ2UuYXBwZW5kQ2hpbGQodGhpcy5kZWxldGUpO1xuXG4gIC8vRWRpdCBidXR0b25cbiAgdGhpcy5lZGl0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIHRoaXMuZWRpdC5jbGFzc0xpc3QuYWRkKCdidXR0b24nLCAnYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnLCAnYy1JbWFnZVBsYWNlaG9sZGVyLWVkaXQnKTtcbiAgdGhpcy5lZGl0LmlubmVySFRNTCA9ICdFZGl0JztcbiAgdGhpcy5pbWFnZS5hcHBlbmRDaGlsZCh0aGlzLmVkaXQpO1xuXG4gIC8vRmlsZSBuYW1lXG4gIHRoaXMuZmlsZU5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy5maWxlTmFtZS5jbGFzc0xpc3QuYWRkKCdjLUltYWdlUGxhY2Vob2xkZXItZmlsZU5hbWUnKTtcbiAgdGhpcy5maWxlTmFtZS5pbm5lckhUTUwgPSB0aGlzLmZpbGUgPyB0aGlzLmZpbGUuZmlsZURhdGEudGl0bGUgOiAnJztcbiAgdGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZmlsZU5hbWUpO1xuXG4gIC8vUGxhY2Vob2xkZXIgVGl0bGVcbiAgdGhpcy50aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLnRpdGxlLmNsYXNzTGlzdC5hZGQoJ2MtSW1hZ2VQbGFjZWhvbGRlci10aXRsZScpO1xuICB0aGlzLnRpdGxlLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5uYW1lIHx8ICdDb3Zlcic7XG4gIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLnRpdGxlKTtcblxuICAvL0ZpbGVpbnB1dCB0byBoYW5kbGUgY2xpY2sgdG8gdXBsb2FkIGltYWdlXG4gIHRoaXMuZmlsZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICB0aGlzLmZpbGVJbnB1dC50eXBlID0gXCJmaWxlXCI7XG4gIHRoaXMuZmlsZUlucHV0Lm11bHRpcGxlID0gZmFsc2U7XG4gIHRoaXMuZmlsZUlucHV0LmhpZGRlbiA9IHRydWU7XG4gIHRoaXMuZmlsZUlucHV0LmFjY2VwdCA9IFwiaW1hZ2UvKiwgdmlkZW8vKlwiO1xuXG4gIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmZpbGVJbnB1dCk7XG5cbiAgdGhpcy5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLndyYXBwZXIsIHRoaXMuZWwpO1xuICB0aGlzLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5lbCk7XG5cbn07XG5cbkltYWdlUGxhY2Vob2xkZXIucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBmdW5jdGlvbiBjbGVhcihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBzZWxmLmZpbGUgPSB1bmRlZmluZWQ7XG4gICAgc2VsZi5fdXBkYXRlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBvcGVuTGlicmFyeSgpIHtcbiAgICBzY3JvbGxQb3NpdGlvbiA9ICQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcbiAgICB1cGRhdGVBc3NldExpYnJhcnkoKTtcbiAgICAkKCcjYWwnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgJCgnI2FsJykuYWRkQ2xhc3MoJ21vZGFsJyk7XG4gICAgJCgnI3dyYXBwZXInKS5hZGRDbGFzcygnb3ZlcmZsb3cnKTtcbiAgICBzaW5nbGVzZWxlY3QgPSB0cnVlO1xuXG4gICAgJCgnI2FkZEZyb21BTEJ1dHRvbicpLnRleHQoc2VsZi5vcHRpb25zLmFsQnV0dG9uIHx8ICdTZXQgQ292ZXInKTtcblxuICAgICQoJyNhZGRGcm9tQUxCdXR0b24nKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgbGFzdFNlbGVjdGVkID0gbnVsbDtcbiAgICAgIHNldFNlbGVjdGVkRmlsZSgpO1xuICAgICAgY2xvc2VBc3NldExpYnJhcnkoKTtcbiAgICAgIHNpbmdsZXNlbGVjdCA9IGZhbHNlO1xuICAgICAgJCgnYm9keScpLnNjcm9sbFRvcChzY3JvbGxQb3NpdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZUFzc2V0TGlicmFyeSgpIHtcbiAgICBsYXN0U2VsZWN0ZWQgPSBudWxsO1xuICAgICQoJy5hbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgZGVzZWxlY3RBbGwoKTtcbiAgICAkKCcubW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJykucmVtb3ZlQ2xhc3MoJ21vZGFsJyk7XG4gICAgJCgnI3dyYXBwZXInKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3cnKTtcbiAgICAkKCcjYWRkRnJvbUFMQnV0dG9uJykudW5iaW5kKCdjbGljaycpO1xuICAgICQoJ2JvZHknKS5zY3JvbGxUb3Aoc2Nyb2xsUG9zaXRpb24pO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFNlbGVjdGVkRmlsZSgpIHtcbiAgICB2YXIgc2VsZWN0ZWRGaWxlID0gJCgnLmFsIC5maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKSxcbiAgICBmaWxlSWQgPSAkKHNlbGVjdGVkRmlsZSkuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpLFxuICAgIGZpbGUgPSBhc3NldExpYnJhcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG4gICAgICByZXR1cm4gZi5pZCA9PT0gZmlsZUlkO1xuICAgIH0pWzBdO1xuXG4gICAgc2VsZi5maWxlID0ge1xuICAgICAgZmlsZURhdGE6IGZpbGVcbiAgICB9O1xuICAgIHNlbGYuX3VwZGF0ZSgpO1xuICB9XG5cblxuICBzZWxmLmZpbGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgZmlsZVRvT2JqZWN0KGUudGFyZ2V0LmZpbGVzWzBdKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgc2VsZi5maWxlID0ge1xuICAgICAgICBmaWxlRGF0YTogcmVzLFxuICAgICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgIHBvc2l0aW9uOiAxMDAwLFxuICAgICAgICBjYXB0aW9uOiAnJyxcbiAgICAgICAgZ2FsbGVyeUNhcHRpb246IGZhbHNlLFxuICAgICAgICBqdXN0VXBsb2FkZWQ6IHRydWVcbiAgICAgIH07XG4gICAgICBzZWxmLl91cGRhdGUoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgc2VsZi5jb250cm9sc1VwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoIXNlbGYuZmlsZSkge1xuICAgICAgc2VsZi5maWxlSW5wdXQuY2xpY2soKTtcbiAgICB9XG4gIH0pO1xuICBzZWxmLmRlbGV0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsZWFyKTtcbiAgc2VsZi5lZGl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGVkaXRGaWxlcyhbc2VsZi5maWxlXSk7XG4gIH0pO1xuXG4gIHNlbGYuY29udHJvbHNMaWJyYXJ5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlbkxpYnJhcnkpO1xufTtcbkltYWdlUGxhY2Vob2xkZXIucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuZmlsZSkge1xuICAgIHRoaXMud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdpcy1lbXB0eScpO1xuICAgIHRoaXMuaW1hZ2Uuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybCgnICsgdGhpcy5maWxlLmZpbGVEYXRhLnVybCArICcpJztcbiAgICB0aGlzLmZpbGVOYW1lLmlubmVySFRNTCA9IHRoaXMuZmlsZS5maWxlRGF0YS50aXRsZTtcbiAgfVxuICBlbHNlIHtcbiAgICB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaXMtZW1wdHknKTtcbiAgICB0aGlzLmltYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICdub25lJztcbiAgICB0aGlzLmZpbGVOYW1lLmlubmVySFRNTCA9ICcnO1xuICB9XG59O1xuXG5JbWFnZVBsYWNlaG9sZGVyLnByb3RvdHlwZS5zZXRJbWFnZSA9IGZ1bmN0aW9uKGZpbGUpIHtcbiAgdGhpcy5maWxlID0gZmlsZTtcbiAgdGhpcy5fdXBkYXRlKCk7XG59O1xuXG5mdW5jdGlvbiBpbml0SW1hZ2VQbGFjZWhvbGRlcnMoKSB7XG4gIHZhciBpbWFnZVBsYWNlaG9sZGVycyA9IFtdO1xuICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1pbWFnZVBsYWNlaG9sZGVyJykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICBpbWFnZVBsYWNlaG9sZGVycy5wdXNoKG5ldyBJbWFnZVBsYWNlaG9sZGVyKGVsKSk7XG4gIH0pO1xuICByZXR1cm4gaW1hZ2VQbGFjZWhvbGRlcnM7XG59XG5cbi8qXG4gKiBJbml0aWFsaXphdGlvbnNcbiAqL1xuLy9DYXN0ICQgQ3JlZGl0IGltcG9ydFxuLy8gZGF0YVxudmFyIGNhc3RBbmRDcmVkaXQgPSB7XG4gICAgY2FzdDogW1xuICAgICAgICB7XG4gICAgICAgICAgICBwZXJzb246ICdTdWxsaXZhbiBTdGFwbGV0b24nLFxuICAgICAgICAgICAgcm9sZTogWydLdXJ0IFdlbGxlciddXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBlcnNvbjogJ0phaW1pZSBBbGV4YW5kZXInLFxuICAgICAgICAgICAgcm9sZTogWydKYW5lIERvZSddXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBlcnNvbjogJ01hcmlhbm5lIEplYW4tQmFwdGlzdGUnLFxuICAgICAgICAgICAgcm9sZTogWydCZXRoYW55IE1heWZhaXInXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwZXJzb246ICdSb2IgQnJvd24nLFxuICAgICAgICAgICAgcm9sZTogWydFZGdhciBSZWFkZSddXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBlcnNvbjogJ0F1ZHJleSBFc3BhcnphJyxcbiAgICAgICAgICAgIHJvbGU6IFsnVGFzaGEgWmFwYXRhJ11cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcGVyc29uOiAnQXNobGV5IEpvaG5zb24nLFxuICAgICAgICAgICAgcm9sZTogWydQYXR0ZXJzb24nXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwZXJzb246ICdVa3dlbGkgUm9hY2gnLFxuICAgICAgICAgICAgcm9sZTogWydEci4gQm9yZGVuJ11cbiAgICAgICAgfVxuICAgIF0sXG4gICAgY3JlZGl0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJvbGU6ICdTZXJpZXMgUHJlbWllcmUnLFxuICAgICAgICAgICAgbmFtZXM6ICdTZXB0ZW1iZXIgMjEsIDIwMTUnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJvbGU6ICdTdGFycmluZycsXG4gICAgICAgICAgICBuYW1lczogJ1N1bGxpdmFuIFN0YXBsZXRvbiwgSmFpbWllIEFsZXhhbmRlciwgTWFyaWFubmUgSmVhbi1CYXB0aXN0ZSwgUm9iIEJyb3duLCBBdWRyZXkgRXNwYXJ6YSwgQXNobGV5IEpvaG5zb24sIFVrd2VsaSBSb2FjaCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcm9sZTogJ0NyZWF0ZWQgQnknLFxuICAgICAgICAgICAgbmFtZXM6ICdNYXJ0aW4gR2VybydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcm9sZTogJ1dyaXR0ZW4gQnkgKFBpbG90KScsXG4gICAgICAgICAgICBuYW1lczogJ01hcnRpbiBHZXJvJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICByb2xlOiAnRXhlY3V0aXZlIFByb2R1Y2VycycsXG4gICAgICAgICAgICBuYW1lczogJ0dyZWcgQmVybGFudGksIE1hcnRpbiBHZXJvLCBTYXJhaCBTY2hlY2h0ZXIsIE1hcmsgUGVsbGluZ3RvbiwgTWFyY29zIFNpZWdhJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICByb2xlOiAnQ28tRXhlY3V0aXZlIFByb2R1Y2VyJyxcbiAgICAgICAgICAgIG5hbWVzOiAnQ2hyaXN0aW5hIEtpbSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcm9sZTogJ1N1cGVydmlzaW5nIFByb2R1Y2VyJyxcbiAgICAgICAgICAgIG5hbWVzOiAnQWxleCBCZXJnZXInXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJvbGU6ICdQcm9kdWNlcicsXG4gICAgICAgICAgICBuYW1lczogJ0JyZW5kYW4gR2FsbCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcm9sZTogJ0xpbmUgUHJvZHVjZXInLFxuICAgICAgICAgICAgbmFtZXM6ICdIYXJ2ZXkgV2FsZG1hbidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcm9sZTogJ0NvLVByb2R1Y2VycycsXG4gICAgICAgICAgICBuYW1lczogJ1J5YW4gSm9obnNvbiwgUGV0ZXIgTGFsYXlhbmlzLCBKZW5uaWZlciBMZW5jZSwgQ2FybCBPZ2F3YSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcm9sZTogJ0RpcmVjdG9yIChQaWxvdCknLFxuICAgICAgICAgICAgbmFtZXM6ICdNYXJrIFBlbGxpbmd0b24nXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJvbGU6ICdEaXJlY3RvcnMgb2YgUGhvdG9ncmFwaHknLFxuICAgICAgICAgICAgbmFtZXM6ICdEYXZpZCBUdXR0bWFuLCBEYXZpZCBKb2huc29uJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICByb2xlOiAnRWRpdG9ycycsXG4gICAgICAgICAgICBuYW1lczogJ0Zpbm5pYW4gTXVycmF5LCBKb2VsIFBhc2hieSwgS3Jpc3RpbiBXaW5kZWxsJ1xuICAgICAgICB9XG4gICAgXVxufTtcbnZhciBjaGFyYWN0ZXJzID0gW1xuICAgICdBbmdlbGEgTW9zcycsXG4gICAgJ0FyYW0gTW9qdGFiYWknLFxuICAgICdBcmxlbmUnLFxuICAgICdCZXRoYW55IE1heWZhaXInLFxuICAgICdDYXJsb3MgRXNwYWRhJyxcbiAgICAnQ3Jpc3RpbmEgU2FudG9zJyxcbiAgICAnRGFybGVuZScsXG4gICAgJ0RlbWJlIFp1bWEnLFxuICAgICdEb25hbGQgUmVzc2xlcicsXG4gICAgJ0RyLiBCb3JkZW4nLFxuICAgICdFZGdhciBSZWFkZScsXG4gICAgJ0VsbGlvdCBBbGRlcnNvbicsXG4gICAgJ0VsaXphYmV0aCBcIkxpelwiIEtlZW4nLFxuICAgICdIYXJsZWUgU2FudG9zJyxcbiAgICAnSGFyb2xkIENvb3BlcicsXG4gICAgJ0phbmUgRG9lJyxcbiAgICAnS3VydCBXZWxsZXInLFxuICAgICdNYXJjdXMgVHVmbycsXG4gICAgJ01hdHQgV296bmlhaycsXG4gICAgJ01pY2hhZWwgTG9tYW4nLFxuICAgICdNci4gUm9ib3QnLFxuICAgICdQYXR0ZXJzb24nLFxuICAgICdSYXltb25kIFwiUmVkXCIgUmVkZGluZ3RvbicsXG4gICAgJ1JvYmVydCBTdGFobCcsXG4gICAgJ1NhbWFyIE5hdmFiaScsXG4gICAgJ1N0dWFydCBTYXBlcnN0ZWluJyxcbiAgICAnVGFzaGEgWmFwYXRhJyxcbiAgICAnVGVzcyBOYXphcmlvJyxcbiAgICAnVG9tIEtlZW4nLFxuICAgICdUeXJlbGwgV2VsbGljaycsXG4gICAgJ1RpbW90aHkgQ2xhcmsnLFxuICAgICdKZXNzaWNhIFBhcmtlcicsXG4gICAgJ0ZhdGhlciBBbmRyZXdzJyxcbiAgICAnTGlzYSBKb25lcycsXG4gICAgJ0lhaW4gVmF1Z2huJyxcbiAgICAnQ2FtIEhlbnJ5JyxcbiAgICAnRHlsYW4gQmVubmV0dCcsXG4gICAgJ1NhcmFoIEJlbm5ldHQnXG5dO1xudmFyIHBlcnNvbnMgPSBbXG4gICAgJ0FkYW0gTGV2aW5lJyxcbiAgICAnQW1pciBBcmlzb24nLFxuICAgICdBc2hsZXkgSm9obnNvbicsXG4gICAgJ0F1ZHJleSBFc3BhcnphJyxcbiAgICAnQmxha2UgU2hlbHRvbicsXG4gICAgJ0Nhcmx5IENoYWlraW4nLFxuICAgICdDYXJzb24gRGFseScsXG4gICAgJ0NocmlzdGlhbiBTbGF0ZXInLFxuICAgICdDaHJpc3RpbmEgQWd1aWxlcmEnLFxuICAgICdEYXlvIE9rZW5peWknLFxuICAgICdEaWVnbyBLbGF0dGVuaG9mZicsXG4gICAgJ0RyZWEgZGUgTWF0dGVvJyxcbiAgICAnSGFtcHRvbiBGbHVrZXInLFxuICAgICdIYXJyeSBMZW5uaXgnLFxuICAgICdIaXNoYW0gVGF3ZmlxJyxcbiAgICAnSmFpbWllIEFsZXhhbmRlcicsXG4gICAgJ0phbWVzIFNwYWRlcicsXG4gICAgJ0plbm5pZmVyIExvcGV6JyxcbiAgICAnTWFyaWFubmUgSmVhbi1CYXB0aXN0ZScsXG4gICAgJ01hcnRpbiBXYWxsc3Ryw7ZtJyxcbiAgICAnTWVnYW4gQm9vbmUnLFxuICAgICdNb3poYW4gTWFybsOyJyxcbiAgICAnUGhhcnJlbGwgV2lsbGlhbXMnLFxuICAgICdQb3J0aWEgRG91YmxlZGF5JyxcbiAgICAnUmFtaSBNYWxlaycsXG4gICAgJ1JheSBMaW90dGEnLFxuICAgICdSb2IgQnJvd24nLFxuICAgICdSeWFuIEVnZ29sZCcsXG4gICAgJ1NhcmFoIEplZmZlcnknLFxuICAgICdTdWxsaXZhbiBTdGFwbGV0b24nLFxuICAgICdVa3dlbGkgUm9hY2gnLFxuICAgICdWaW5jZW50IExhcmVzY2EnLFxuICAgICdXYXJyZW4gS29sZScsXG4gICAgJ0thdGllIE1jR3JhdGgnLFxuICAgICdCcmFuZG9uIEpheSBNY0xhcmVuJyxcbiAgICAnU3RldmUgQnllcnMnLFxuICAgICdEZWFuIE1jRGVybW90dCcsXG4gICAgJ0VudWthIE9rdW1hJyxcbiAgICAnUm9iIFN0ZXdhcnQnLFxuICAgICdFcmluIEthcnBsdWsnLFxuICAgICdDaHJpc3RvcGhlciBKYWNvdCcgICAgXG5dO1xuXG5mdW5jdGlvbiBpbXBvcnRDYXN0KCkge1xuICB2YXIgY3JlZGl0U2VjdGlvbiA9ICQoJyNjcmVkaXRTZWN0aW9uJyksXG4gIGNhc3RTZWN0aW9uID0gJCgnI2Nhc3RTZWN0aW9uJyksXG4gIHNlYXNvbkhhc0Nhc3QgPSBjcmVkaXRTZWN0aW9uLmZpbmQoJy5qcy1oYXNWYWx1ZScpLmxlbmd0aCA+IDAgfHwgY2FzdFNlY3Rpb24uZmluZCgnLmpzLWhhc1ZhbHVlJykubGVuZ3RoID4gMDsgLy9DSGVjayBpZiBjcmVkaXQgc2VjdGlvbiBvciBjYXN0IHNlY3Rpb24gaGF2ZSBmaWxsZWQgZmllbGRzIG9yIHNlbGVjdGJveGVzIG9yIHRhZ2ZpZWxkc1xuXG4gIGlmIChzZWFzb25IYXNDYXN0KSB7XG4gICAgbmV3IE1vZGFsKHtcbiAgICAgIHRpdGxlOiAnSW1wb3J0IENhc3QgJiBDcmVkaXQ/JyxcbiAgICAgIHRleHQ6ICdUaGUgbmV3IENhc3QgJiBDcmVkaXQgd2lsbCBvdmVyd3JpdGUgYW5kIHJlcGxhY2UgdGhlIGV4aXN0aW5nIENhc3QgJiBDcmVkaXQgaW5mb3JtYXRpb24uIEFyZSB5b3Ugc3VyZSB5b3Ugd291bGQgbGlrZSB0byBpbXBvcnQ/JyxcbiAgICAgIGNvbmZpcm1UZXh0OiAnSW1wb3J0JyxcbiAgICAgIGNvbmZpcm1BY3Rpb246IGxvYWRDYXN0LFxuICAgICAgZGlhbG9nOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbG9hZENhc3QoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBsb2FkQ2FzdCgpIHtcbiAgdmFyIGNhc3RTZWN0aW9uID0gJCgnI2Nhc3RTZWN0aW9uJyksXG4gIGNhc3RTZWN0aW9uQm9keSA9IGNhc3RTZWN0aW9uLmZpbmQoJy5jb250cm9sc19fZ3JvdXAnKSxcbiAgY3JlZGl0U2VjdGlvbiA9ICQoJyNjcmVkaXRTZWN0aW9uJyksXG4gIGNyZWRpdFNlY3Rpb25Cb2R5ID0gY3JlZGl0U2VjdGlvbi5maW5kKCcuY29udHJvbHNfX2dyb3VwJyksXG4gIGNhc3QgPSBjYXN0QW5kQ3JlZGl0LmNhc3QsXG4gIGNyZWRpdCA9IGNhc3RBbmRDcmVkaXQuY3JlZGl0O1xuXG4gIGNhc3RTZWN0aW9uQm9keS5lbXB0eSgpO1xuICBjcmVkaXRTZWN0aW9uQm9keS5lbXB0eSgpO1xuXG4gIGNyZWF0ZUNhc3RTZWN0aW9uKGNhc3QsIGNhc3RTZWN0aW9uQm9keSk7XG4gIGNyZWF0ZUNyZWRpdFNlY3Rpb24oY3JlZGl0LCBjcmVkaXRTZWN0aW9uQm9keSk7XG5cbiAgaGlkZUNhc3RJbXBvcnQoKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ3JlZGl0U2VjdGlvbihjcmVkaXQsIHNlY3Rpb24pIHtcbiAgdmFyIGFkZGFibGVSb3cgPSBjcmVhdGVDcmVkaXRSb3coe3JvbGU6ICcnLCBuYW1lczogJyd9KTtcbiAgZnVuY3Rpb24gYmVmb3JlQWRkQ3JlZGl0KGVsKSB7XG4gICAgbmV3IFRleHRmaWVsZChlbC5maW5kKCdpbnB1dC5qcy1pbnB1dCcpLmdldCgwKSwge1xuICAgICAgbGFiZWw6ICdUaXRsZScsXG4gICAgICBoZWxwVGV4dDogJ2UuZyBQcm9kdWNlciwgQ29zdHVtZSdcbiAgICB9KTtcblxuICAgIG5ldyBUZXh0ZmllbGQoZWwuZmluZCgndGV4dGFyZWEuanMtaW5wdXQnKS5nZXQoMCksIHtsYWJlbDogJ05hbWUocyknfSk7XG4gICAgZWwuZmluZCgndGV4dGFyZWEnKS5lbGFzdGljKCk7XG4gIH1cblxuICBzZWN0aW9uLmFwcGVuZChhZGRhYmxlUm93KTtcbiAgYWRkYWJsZU9iamVjdCA9IG5ldyBBZGRhYmxlKGFkZGFibGVSb3csIHtiZWZvcmVBZGQ6IGJlZm9yZUFkZENyZWRpdCwgc29ydGFibGU6IHRydWV9KTtcbiAgYWRkYWJsZU9iamVjdC5yZW1vdmVJdGVtKDApO1xuXG4gIGNyZWRpdC5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcbiAgICBhZGRhYmxlT2JqZWN0Ll9hZGRJdGVtKGNyZWF0ZUNyZWRpdFJvdyhjKSk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUNyZWRpdFJvdyhjKSB7XG4gICAgdmFyIGNyZWRpdFJvdyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NnX19jb250cm9scyBjZ19fY29udHJvbHNfc3R5bGVfcm93JyksXG4gICAgcm9sZVdyYXBwZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjZ19fY29udHJvbCBjZ19fY29udHJvbF9zdHlsZV9yb3cnKSxcbiAgICByb2xlRmllbGQgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIi8+JykuYWRkQ2xhc3MoJ2pzLWlucHV0IGlucHV0X3N0eWxlX2xpZ2h0JykudmFsKGMucm9sZSksXG4gICAgbmFtZXNGaWVsZCA9ICQoJzx0ZXh0YXJlYT48L3RleHRhcmVhPicpLmFkZENsYXNzKCdqcy1pbnB1dCBpbnB1dF9zdHlsZV9saWdodCcpLnZhbChjLm5hbWVzKSxcbiAgICBuYW1lc1dyYXBwZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjZ19fY29udHJvbCBjZ19fY29udHJvbF9zdHlsZV9yb3cnKTtcblxuICAgIC8vbmFtZXNGaWVsZC5lbGFzdGljKCk7XG4gICAgcm9sZVdyYXBwZXIuYXBwZW5kKHJvbGVGaWVsZCk7XG4gICAgbmFtZXNXcmFwcGVyLmFwcGVuZChuYW1lc0ZpZWxkKTtcbiAgICBjcmVkaXRSb3cuYXBwZW5kKHJvbGVXcmFwcGVyLCBuYW1lc1dyYXBwZXIpO1xuXG4gICAgcmV0dXJuIGNyZWRpdFJvdztcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0Q3JlZGl0U2VjdGlvbihzZWN0aW9uKSB7XG4gIGZ1bmN0aW9uIGJlZm9yZUFkZENyZWRpdChlbCkge1xuICAgIGlmIChlbC5maW5kKCdpbnB1dC5qcy1pbnB1dCcpLmdldCgwKSkge1xuICAgICAgbmV3IFRleHRmaWVsZChlbC5maW5kKCdpbnB1dC5qcy1pbnB1dCcpLmdldCgwKSwge1xuICAgICAgICBsYWJlbDogJ1RpdGxlJyxcbiAgICAgICAgaGVscFRleHQ6ICdlLmcgUHJvZHVjZXIsIENvc3R1bWUnXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGVsLmZpbmQoJ3RleHRhcmVhLmpzLWlucHV0JykuZ2V0KDApKSB7XG4gICAgICBuZXcgVGV4dGZpZWxkKGVsLmZpbmQoJ3RleHRhcmVhLmpzLWlucHV0JykuZ2V0KDApLCB7bGFiZWw6ICdOYW1lKHMpJ30pO1xuICAgIH1cblxuICAgIGVsLmZpbmQoJ3RleHRhcmVhJykuZWxhc3RpYygpO1xuICB9XG4gIHZhciBhZGRhYmxlUm93ID0gY3JlYXRlQ3JlZGl0Um93KCk7XG5cbiAgc2VjdGlvbi5hcHBlbmQoYWRkYWJsZVJvdyk7XG4gIGFkZGFibGVPYmplY3QgPSBuZXcgQWRkYWJsZShhZGRhYmxlUm93LCB7YWZ0ZXJBZGQ6IGJlZm9yZUFkZENyZWRpdCwgc29ydGFibGU6IHRydWV9KTtcbiAgYWRkYWJsZU9iamVjdC5yZW1vdmVJdGVtKDApO1xuICBhZGRhYmxlT2JqZWN0Ll9hZGRJdGVtKGNyZWF0ZUNyZWRpdFJvdygpLCBiZWZvcmVBZGRDcmVkaXQpO1xuXG59XG5mdW5jdGlvbiBjcmVhdGVDcmVkaXRSb3coY3JlZGl0KSB7XG4gIHZhciBjcmVkaXRSb3cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjZ19fY29udHJvbHMgY2dfX2NvbnRyb2xzX3N0eWxlX3JvdycpLFxuICByb2xlV3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NnX19jb250cm9sIGNnX19jb250cm9sX3N0eWxlX3JvdycpLFxuICByb2xlRmllbGQgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIi8+JykuYWRkQ2xhc3MoJ2pzLWlucHV0IGlucHV0X3N0eWxlX2xpZ2h0JykudmFsKGNyZWRpdCA/IGNyZWRpdC5yb2xlIDogJycpLFxuICBuYW1lc0ZpZWxkID0gJCgnPHRleHRhcmVhPjwvdGV4dGFyZWE+JykuYWRkQ2xhc3MoJ2pzLWlucHV0IGlucHV0X3N0eWxlX2xpZ2h0JykudmFsKGNyZWRpdCA/IGNyZWRpdC5uYW1lcyA6ICcnKSxcbiAgbmFtZXNXcmFwcGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2wgY2dfX2NvbnRyb2xfc3R5bGVfcm93Jyk7XG5cbiAgcm9sZVdyYXBwZXIuYXBwZW5kKHJvbGVGaWVsZCk7XG4gIG5hbWVzV3JhcHBlci5hcHBlbmQobmFtZXNGaWVsZCk7XG4gIGNyZWRpdFJvdy5hcHBlbmQocm9sZVdyYXBwZXIsIG5hbWVzV3JhcHBlcik7XG5cbiAgcmV0dXJuIGNyZWRpdFJvdztcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2FzdFNlY3Rpb24oY2FzdCwgc2VjdGlvbikge1xuICB2YXIgYWRkYWJsZU9iamVjdCA9IGluaXRDYXN0U2VjdGlvbihzZWN0aW9uKTtcbiAgYWRkYWJsZU9iamVjdC5yZW1vdmVJdGVtKDApO1xuXG4gIGNhc3QuZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgYWRkYWJsZU9iamVjdC5fYWRkSXRlbShjcmVhdGVDYXN0Um93KGMpKTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gY3JlYXRlQ2FzdFJvdyhjKSB7XG4gICAgdmFyIGNhc3RSb3cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjZ19fY29udHJvbHMgY2dfX2NvbnRyb2xzX3N0eWxlX3JvdycpLFxuXG4gICAgcGVyc29uV3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NnX19jb250cm9sIGNnX19jb250cm9sX3N0eWxlX3JvdycpLFxuICAgIHBlcnNvblNlbGVjdCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLXNlbGVjdGJveCcpLFxuXG4gICAgY2hhcmFjdGVyV3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NnX19jb250cm9sIGNnX19jb250cm9sX3N0eWxlX3JvdycpLFxuICAgIGNoYXJhY3RlclRhZ2ZpZWxkID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtdGFnZmllbGQnKSxcblxuICAgIGFzVGV4dCA9ICQoJzxzcGFuPjwvc3Bhbj4nKS5hZGRDbGFzcygnY2FzdF9fdGV4dERpdmlkZXInKS50ZXh0KCdhcycpLFxuICAgIHJvbGVzID0gcGVyc29ucy5jb25jYXQoY2hhcmFjdGVycykuc29ydCgpO1xuXG4gICAgcGVyc29uV3JhcHBlci5hcHBlbmQocGVyc29uU2VsZWN0KTtcbiAgICBjaGFyYWN0ZXJXcmFwcGVyLmFwcGVuZChjaGFyYWN0ZXJUYWdmaWVsZCk7XG4gICAgY2FzdFJvdy5hcHBlbmQocGVyc29uV3JhcHBlciwgYXNUZXh0LCBjaGFyYWN0ZXJXcmFwcGVyKTtcblxuICAgIHZhciBwZXJzb25TZWxlY3RJdGVtID0gbmV3IFNlbGVjdGJveChwZXJzb25TZWxlY3QuZ2V0KDApLCB7XG4gICAgICBsYWJlbDogJ1BlcnNvbicsXG4gICAgICBwbGFjZWhvbGRlcjogJ1NlbGVjdCBwZXJzb24nLFxuICAgICAgaXRlbXM6IHBlcnNvbnMuc29ydCgpLFxuICAgICAgc2VsZWN0ZWRJdGVtOiBjLnBlcnNvbixcbiAgICAgIHVuc2VsZWN0OiAn4oCUIE5vbmUg4oCUJ1xuICAgIH0pO1xuXG4gICAgdmFyIGNoYXJhY3RlclRhZ2ZpZWxkSXRlbSA9IG5ldyBUYWdmaWVsZChjaGFyYWN0ZXJUYWdmaWVsZC5nZXQoMCksIHtcbiAgICAgIGxhYmVsOiAnUm9sZShzKScsXG4gICAgICBwbGFjZWhvbGRlcjogJ1NlbGVjdCBSb2xlKHMpJyxcbiAgICAgIGl0ZW1zOiByb2xlcyxcbiAgICAgIGNyZWF0ZVRhZ3M6IGZhbHNlLFxuICAgICAgaW5pdGlhbEl0ZW1zOiBjLnJvbGVcbiAgICB9KTtcblxuICAgIHJldHVybiBjYXN0Um93O1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRDYXN0U2VjdGlvbihzZWN0aW9uKSB7XG4gIGZ1bmN0aW9uIGJlZm9yZUFkZENhc3QoZWwpIHtcbiAgICAvL0NyZWF0ZSBzZWxlY3Rib3hcbiAgICB2YXIgcGVyc29uU2VsZWN0SXRlbSA9IG5ldyBTZWxlY3Rib3goZWwuZmluZCgnLmpzLXNlbGVjdGJveCcpLmdldCgwKSwge1xuICAgICAgbGFiZWw6ICdQZXJzb24nLFxuICAgICAgcGxhY2Vob2xkZXI6ICdTZWxlY3QgcGVyc29uJyxcbiAgICAgIGl0ZW1zOiBwZXJzb25zLnNvcnQoKSxcbiAgICAgIHVuc2VsZWN0OiAn4oCUIE5vbmUg4oCUJ1xuICAgIH0pO1xuXG4gICAgLy9DcmVhdGUgVGFnZmllbGRcbiAgICB2YXIgY2hhcmFjdGVyVGFnZmllbGRJdGVtID0gbmV3IFRhZ2ZpZWxkKGVsLmZpbmQoJy5qcy10YWdmaWVsZCcpLmdldCgwKSwge1xuICAgICAgbGFiZWw6ICdSb2xlKHMpJyxcbiAgICAgIHBsYWNlaG9sZGVyOiAnUm9sZShzKScsXG4gICAgICBpdGVtczogcGVyc29ucy5jb25jYXQoY2hhcmFjdGVycykuc29ydCgpLFxuICAgICAgY3JlYXRlVGFnczogZmFsc2VcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVFbXB0eUNhc3RSb3cgKCkge1xuICAgIHZhciBjYXN0Um93ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2xzIGNnX19jb250cm9sc19zdHlsZV9yb3cnKSxcbiAgICBwZXJzb25XcmFwcGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2wgY2dfX2NvbnRyb2xfc3R5bGVfcm93JyksXG4gICAgcGVyc29uU2VsZWN0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtc2VsZWN0Ym94JyksXG4gICAgY2hhcmFjdGVyV3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NnX19jb250cm9sIGNnX19jb250cm9sX3N0eWxlX3JvdycpLFxuICAgIGNoYXJhY3RlclRhZ2ZpZWxkID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtdGFnZmllbGQnKSxcbiAgICBhc1RleHQgPSAkKCc8c3Bhbj48L3NwYW4+JykuYWRkQ2xhc3MoJ2Nhc3RfX3RleHREaXZpZGVyJykudGV4dCgnYXMnKTtcblxuICAgIHBlcnNvbldyYXBwZXIuYXBwZW5kKHBlcnNvblNlbGVjdCk7XG4gICAgY2hhcmFjdGVyV3JhcHBlci5hcHBlbmQoY2hhcmFjdGVyVGFnZmllbGQpO1xuICAgIGNhc3RSb3cuYXBwZW5kKHBlcnNvbldyYXBwZXIsIGFzVGV4dCwgY2hhcmFjdGVyV3JhcHBlcik7XG5cbiAgICByZXR1cm4gY2FzdFJvdztcbiAgfVxuXG4gIHZhciBjYXN0Um93ID0gY3JlYXRlRW1wdHlDYXN0Um93KCk7XG4gIHNlY3Rpb24uYXBwZW5kKGNhc3RSb3cpO1xuICB2YXIgYWRkYWJsZU9iamVjdCA9IG5ldyBBZGRhYmxlKGNhc3RSb3csIHtiZWZvcmVBZGQ6IGJlZm9yZUFkZENhc3QsIHNvcnRhYmxlOiB0cnVlfSk7XG4gIGFkZGFibGVPYmplY3QucmVtb3ZlSXRlbSgwKTtcbiAgYWRkYWJsZU9iamVjdC5fYWRkSXRlbShjcmVhdGVFbXB0eUNhc3RSb3coKSwgYmVmb3JlQWRkQ2FzdCk7XG5cbiAgcmV0dXJuIGFkZGFibGVPYmplY3Q7XG59XG5cbmZ1bmN0aW9uIHNob3dDYXN0SW1wb3J0KCkge1xuICAkKCcjaW1wb3J0Q2FzdFNlY3Rpb24nKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG59XG5mdW5jdGlvbiBoaWRlQ2FzdEltcG9ydCgpIHtcbiAgJCgnI2ltcG9ydENhc3RTZWN0aW9uJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xufVxuXG4vL0NvbGxlY3Rpb24gaW5pdGlhbGl6YXRpb25cbi8vIGRhdGFcbnZhciBjb2xsZWN0aW9uSXRlbXMgPSBbXG4gICAge1xuICAgICAgICB0aXRsZTogJ0V2aWwgSGFuZG1hZGUgSW5zdHJ1bWVudCcsXG4gICAgICAgIGlkOiAxLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1Bob3RvIGZyb20gdGhlIGVwaXNvZGUgXCJFdmlsIEhhbmRtYWRlIEluc3RydW1lbnRcIicsXG4gICAgICAgIHR5cGU6ICdnYWxsZXJ5JyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdHYWxsZXJ5IHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9henRlY190ZW1wbGUucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWdhbGxlcnkuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdBdXRoZW50aWMgRmxpcnQnLFxuICAgICAgICBpZDogMixcbiAgICAgICAgZGVzY3JpcHRpb246ICdQaG90byBmcm9tIHRoZSBlcGlzb2RlIFwiQXV0aGVudGljIEZsaXJ0XCInLFxuICAgICAgICB0eXBlOiAnZ2FsbGVyeScsXG4gICAgICAgIHNlcmllczogJ0JsaW5kc3BvdCcsXG4gICAgICAgIHN1YnRpdGxlOiAnR2FsbGVyeSB8IEJsaW5kc3BvdCcsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvYmlnX2Jlbi5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZ2FsbGVyeS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1BlcnNlY3V0ZSBFbnZveXMnLFxuICAgICAgICBpZDogMyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdQaG90byBmcm9tIHRoZSBlcGlzb2RlIFwiUGVyc2VjdXRlIEVudm95c1wiJyxcbiAgICAgICAgdHlwZTogJ2dhbGxlcnknLFxuICAgICAgICBzZXJpZXM6ICdCbGluZHNwb3QnLFxuICAgICAgICBzdWJ0aXRsZTogJ0dhbGxlcnkgfCBCbGluZHNwb3QnLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL2NocmlzdF90aGVfcmVkZWVtZXIucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWdhbGxlcnkuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdTZW50IG9uIFRvdXInLFxuICAgICAgICBpZDogNCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdQaG90byBmcm9tIHRoZSBlcGlzb2RlIFwiU2VudCBvbiBUb3VyXCInLFxuICAgICAgICB0eXBlOiAnZ2FsbGVyeScsXG4gICAgICAgIHNlcmllczogJ0JsaW5kc3BvdCcsXG4gICAgICAgIHN1YnRpdGxlOiAnR2FsbGVyeSB8IEJsaW5kc3BvdCcsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvY29sb3NzZXVtLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1nYWxsZXJ5Lmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnQ2VkZSBZb3VyIFNvdWwnLFxuICAgICAgICBpZDogNSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdQaG90byBmcm9tIHRoZSBlcGlzb2RlIFwiQ2VkZSBZb3VyIFNvdWxcIicsXG4gICAgICAgIHR5cGU6ICdnYWxsZXJ5JyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdHYWxsZXJ5IHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9lYXN0ZXJfaXNsYW5kLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1nYWxsZXJ5Lmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU3BsaXQgVGhlIExhdycsXG4gICAgICAgIGlkOiA2LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1Bob3RvIGZyb20gdGhlIGVwaXNvZGUgXCJTcGxpdCBUaGUgTGF3XCInLFxuICAgICAgICB0eXBlOiAnZ2FsbGVyeScsXG4gICAgICAgIHNlcmllczogJ0JsaW5kc3BvdCcsXG4gICAgICAgIHN1YnRpdGxlOiAnR2FsbGVyeScsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvcHlyYW1pZHMucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWdhbGxlcnkuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdCb25lIE1heSBSb3QnLFxuICAgICAgICBpZDogNyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdQaG90byBmcm9tIHRoZSBlcGlzb2RlIFwiQm9uZSBNYXkgUm90XCInLFxuICAgICAgICB0eXBlOiAnZ2FsbGVyeScsXG4gICAgICAgIHNlcmllczogJ0JsaW5kc3BvdCcsXG4gICAgICAgIHN1YnRpdGxlOiAnR2FsbGVyeSB8IEJsaW5kc3BvdCcsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvc2FuX2ZyYW5jaXNvX2JyaWRnZS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZ2FsbGVyeS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0VpZ2h0IFNsaW0gR3JpbnMnLFxuICAgICAgICBpZDogOCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdQaG90byBmcm9tIHRoZSBlcGlzb2RlIFwiRWlnaHQgU2xpbSBHcmluc1wiJyxcbiAgICAgICAgdHlwZTogJ2dhbGxlcnknLFxuICAgICAgICBzZXJpZXM6ICdCbGluZHNwb3QnLFxuICAgICAgICBzdWJ0aXRsZTogJ0dhbGxlcnkgfCBCbGluZHNwb3QnLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL3N0b25lX2hlbmdlLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1nYWxsZXJ5Lmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnQSBTdHJheSBIb3dsJyxcbiAgICAgICAgaWQ6IDksXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnUGhvdG8gZnJvbSB0aGUgZXBpc29kZSBcIkEgU3RyYXkgSG93bFwiJyxcbiAgICAgICAgdHlwZTogJ2dhbGxlcnknLFxuICAgICAgICBzZXJpZXM6ICdCbGluZHNwb3QnLFxuICAgICAgICBzdWJ0aXRsZTogJ0dhbGxlcnkgfCBCbGluZHNwb3QnLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL3N5ZG5leV9vcGVyYV9ob3VzZS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZ2FsbGVyeS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0EgU3RyYXkgSG93bCcsXG4gICAgICAgIGlkOiAxMCxcbiAgICAgICAgdHlwZTogJ2VwaXNvZGUnLFxuICAgICAgICBzdWJ0eXBlOiAnZXBpc29kZScsXG4gICAgICAgIHNlcmllczogJ0JsaW5kc3BvdCcsXG4gICAgICAgIHN1YnRpdGxlOiAnRXBpc29kZSB8IEJsaW5kc3BvdCcsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvdGFqX21haGFsLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1lcGlzb2RlLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnRWlnaHQgU2xpbSBHcmlucycsXG4gICAgICAgIGlkOiAxMSxcbiAgICAgICAgdHlwZTogJ2VwaXNvZGUnLFxuICAgICAgICBzdWJ0eXBlOiAnZXBpc29kZScsXG4gICAgICAgIHNlcmllczogJ0JsaW5kc3BvdCcsXG4gICAgICAgIHN1YnRpdGxlOiAnRXBpc29kZSB8IEJsaW5kc3BvdCcsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvd2luZG1pbGwucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdCb25lIE1heSBSb3QnLFxuICAgICAgICBpZDogMTIsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc3VidHlwZTogJ2VwaXNvZGUnLFxuICAgICAgICBzZXJpZXM6ICdCbGluZHNwb3QnLFxuICAgICAgICBzdWJ0aXRsZTogJ0VwaXNvZGUgfCBCbGluZHNwb3QnLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL3RyZWVfMS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NwbGl0IFRoZSBMYXcnLFxuICAgICAgICBpZDogMTMsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc3VidHlwZTogJ2VwaXNvZGUnLFxuICAgICAgICBzZXJpZXM6ICdCbGluZHNwb3QnLFxuICAgICAgICBzdWJ0aXRsZTogJ0VwaXNvZGUgfCBCbGluZHNwb3QnLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL3RyZWVfMi5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0phbmVcXCdzIFRhdHRvbyBCYWNrc3Rvcnk6IEVwaXNvZGUgMTAnLFxuICAgICAgICBpZDogMTQsXG4gICAgICAgIHR5cGU6ICd2aWRlbycsXG4gICAgICAgIHN1YnR5cGU6ICd3ZWIgZXhjbHVzaXZlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS90cmVlXzMucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdKYW5lXFwncyBUYXR0b28gQmFja3N0b3J5OiBFcGlzb2RlIDknLFxuICAgICAgICBpZDogMTUsXG4gICAgICAgIHR5cGU6ICd2aWRlbycsXG4gICAgICAgIHN1YnR5cGU6ICd3ZWIgZXhjbHVzaXZlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS90cmVlXzQucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdKYW5lXFwncyBUYXR0b28gQmFja3N0b3J5OiBFcGlzb2RlIDgnLFxuICAgICAgICBpZDogMTYsXG4gICAgICAgIHR5cGU6ICd2aWRlbycsXG4gICAgICAgIHN1YnR5cGU6ICd3ZWIgZXhjbHVzaXZlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS90cmVlXzUucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdKYW5lXFwncyBUYXR0b28gQmFja3N0b3J5OiBFcGlzb2RlIDcnLFxuICAgICAgICBpZDogMTcsXG4gICAgICAgIHR5cGU6ICd2aWRlbycsXG4gICAgICAgIHN1YnR5cGU6ICd3ZWIgZXhjbHVzaXZlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS90cmVlXzYucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuXG4gICAgLy9FcGlzb2Rlc1xuICAgIHtcbiAgICAgICAgdGl0bGU6ICcxLiBTZXJpZXMgUHJlbWllcmUnLFxuICAgICAgICBpZDogMTgsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQSBiZWF1dGlmdWwsIG5ha2VkIGFtbmVzaWFjIGlzIGZvdW5kIGluIGEgYmFnIGluIFRpbWVzIFNxdWFyZSwgY292ZXJlZCBpbiBmcmVzaCB0YXR0b29zIC0gb25lIG9mIHdoaWNoIGlzIHRoZSBuYW1lIG9mIEZCSSBTcGVjaWFsIEFnZW50IEt1cnQgV2VsbGVyLicsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICcyLiBBIFN0cmF5IEhvd2wnLFxuICAgICAgICBpZDogMTksXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnV2hpbGUgYSB0YXR0b28gc2VuZHMgdGhlIHRlYW0gYWZ0ZXIgYSBkcm9uZSBwaWxvdCBnb25lIGNyYXp5LCBXZWxsZXIgc2Vla3MgdG8gY29uZmlybSB0aGF0IEphbmUgRG9lIGlzIGEgbWlzc2luZyBwZXJzb24gZnJvbSBoaXMgY2hpbGRob29kLicsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICczLiBFaWdodCBTbGltIEdyaW5zJyxcbiAgICAgICAgaWQ6IDIwLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0FmdGVyIGEgcnVuLWluIHdpdGggdGhlIG15c3RlcmlvdXMgYmVhcmRlZCBtYW4sIEphbmVcXCdzIFNFQUwgdGF0dG9vIGxlYWRzIHRvIGEgdmlvbGVudCBnYW5nIG9mIHRoaWV2ZXMgLSBjYW4gdGhleSB0ZWxsIGhlciB3aG8gc2hlIGlzPycsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICc0LiBCb25lIE1heSBSb3QnLFxuICAgICAgICBpZDogMjEsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnTWF0dGVycyBvZiB0cnVzdCBjb21lIHRvIGEgaGVhZCB3aGlsZSB3aGlsZSB0aGUgdGVhbSB0cmllcyB0byBwcmV2ZW50IGEgZ2xvYmFsIHBhbmRlbWljIGF0IHRoZSBDREM7IHRlc3QgcmVzdWx0cyBwdXQgSmFuZVxcJ3MgaWRlbnRpdHkgaW4gcXVlc3Rpb24uJyxcbiAgICAgICAgdHlwZTogJ2VwaXNvZGUnLFxuICAgICAgICBzZXJpZXM6ICdCbGluZHNwb3QnLFxuICAgICAgICBzdWJ0aXRsZTogJ0VwaXNvZGUgfCBCbGluZHNwb3QnLFxuICAgICAgICBpbWc6ICcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJzUuIFNwbGl0IFRoZSBMYXcnLFxuICAgICAgICBpZDogMjIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIEZCSSBmYWNlcyBvZmYgd2l0aCB0aGUgQ0lBIHdoaWxlIGh1bnRpbmcgYSBkaXJ0eSBib21iZXI7IEphbmUgcmVtZW1iZXJzIGEgZGlzdHVyYmluZyBjaGlsZGhvb2QgbWVtb3J5LicsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICc2LiBDZWRlIFlvdXIgU291bCcsXG4gICAgICAgIGlkOiAyMyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdKYW5lIGFuZCBXZWxsZXIgc3RydWdnbGUgdG8ga2VlcCB0aGVpciByZWxhdGlvbnNoaXAgcHJvZmVzc2lvbmFsIHdoaWxlIGNoYXNpbmcgYSB0ZWVuIGhhY2tlciB3aG9cXCdzIGNyZWF0ZWQgYSBraWxsZXIgYXBwLicsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICc3LiBTZW50IG9uIFRvdXInLFxuICAgICAgICBpZDogMjQsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnTWF5ZmFpclxcJ3Mgc2VjcmV0cyBiZWdpbiB0byB1bnJhdmVsIGFzIHRoZSB0ZWFtIHRha2VzIG9uIGEgc2VjZXNzaW9uaXN0IG1pbGl0aWEgZ3VhcmRpbmcgU2HDumwgR3VlcnJlcm8uIExvdSBEaWFtb25kIFBoaWxsaXBzIGd1ZXN0IHN0YXJzLicsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICc4LiBQZXJzZWN1dGUgRW52b3lzJyxcbiAgICAgICAgaWQ6IDI1LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ01heWZhaXIgY29tZXMgY2xlYW4gYWJvdXQgRGF5bGlnaHQ7IG9uZSBvZiBKYW5lXFwncyB0YXR0b29zIHNldHMgdGhlIHRlYW0gYWZ0ZXIgYSBCcm9va2x5biBjb3Aga2lsbGVyLicsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICc5LiBBdXRoZW50aWMgRmxpcnQnLFxuICAgICAgICBpZDogMjYsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnTWF5ZmFpciBzdHJ1Z2dsZXMgdG8ga2VlcCBEYXlsaWdodCB1bmRlciB3cmFwcyBhcyBKYW5lIGFuZCBXZWxsZXIgZ28gdW5kZXJjb3ZlciBhcyBtYW4gYW5kIHdpZmUuJyxcbiAgICAgICAgdHlwZTogJ2VwaXNvZGUnLFxuICAgICAgICBzZXJpZXM6ICdCbGluZHNwb3QnLFxuICAgICAgICBzdWJ0aXRsZTogJ0VwaXNvZGUgfCBCbGluZHNwb3QnLFxuICAgICAgICBpbWc6ICcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJzEwLiBFdmlsIEhhbmRtYWRlIEluc3RydW1lbnQnLFxuICAgICAgICBpZDogMjcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGh1bnQgZm9yIERhdmlkXFwncyBtdXJkZXJlciB3YWtlbnMgYSBob3JkZSBvZiBSdXNzaWFuIHNsZWVwZXIgYWdlbnRzLicsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuXG4gICAgLy8gU2xhc2hlciBjb250ZW50XG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXJfaGVyb18xLnBuZycsXG4gICAgICAgIGlkOiAyOCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dC4nLFxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICBzZXJpZXM6ICdTbGFzaGVyJyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9UZXJlc2EucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdTbGFzaGVyX2hlcm9fMi5wbmcnLFxuICAgICAgICBpZDogMjksXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQnJhbmRvbiBKYXkgTWNMYXJlbiAoR3JhY2VsYW5kKSBzdGFycyBhcyBEeWxhbi4nLFxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICBzZXJpZXM6ICdTbGFzaGVyJyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9BbGV4LnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1lcGlzb2RlLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU2xhc2hlcl9oZXJvXzMucG5nJyxcbiAgICAgICAgaWQ6IDMwLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1dlbmR5IENyZXdzb24gKFJldmVuZ2UpIHN0YXJzIGFzIEJyZW5kYSBNZXJyaXR0LicsXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXG4gICAgICAgIHNlcmllczogJ1NsYXNoZXInLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL2F6dGVjX3RlbXBsZS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXItc25lYWtwZWVrJyxcbiAgICAgICAgaWQ6IDMxLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1NsYXNoZXItc25lYWtwZWVrIHZpZGVvIGZvciBzZXJpZXMgcHJlbWllcmUuJyxcbiAgICAgICAgdHlwZTogJ3ZpZGVvJyxcbiAgICAgICAgc2VyaWVzOiAnU2xhc2hlcicsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvR2FycnkucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdTbGFzaGVyLWNhc3QnLFxuICAgICAgICBpZDogMzIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQ2FzdCBjb2xsZWN0aW9uIGZvciBTbGFzaGVyIHNlYXNvbiAxLicsXG4gICAgICAgIHR5cGU6ICdjYXN0JyxcbiAgICAgICAgc2VyaWVzOiAnU2xhc2hlcicsXG4gICAgICAgIGltZzogJycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1nYWxsZXJ5Lmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU2xhc2hlci1wcmV2aWV3LWdhbGxlcnknLFxuICAgICAgICBpZDogMzMsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnUGhvdG8gZnJvbSB0aGUgZXBpc29kZSBzZXJpZXMgcHJlbWllcmUuJyxcbiAgICAgICAgdHlwZTogJ2dhbGxlcnknLFxuICAgICAgICBzZXJpZXM6ICdTbGFzaGVyJyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9weXJhbWlkcy5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZ2FsbGVyeS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXItdHJhaWxlcicsXG4gICAgICAgIGlkOiAzNCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdTbGFzaGVyOiBOZXcgU2VyaWVzIENvbWluZyBTb29uJyxcbiAgICAgICAgdHlwZTogJ3ZpZGVvJyxcbiAgICAgICAgc2VyaWVzOiAnU2xhc2hlcicsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvZWFzdGVyX2lzbGFuZF8yLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1lcGlzb2RlLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU2xhc2hlciAtIEVwaXNvZGUgMicsXG4gICAgICAgIGlkOiAyOCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdTZWUgYSBzbmVhayBwcmV2aWV3IG9mIG5leHQgd2Vla3MgZXBpc29kZScsXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXG4gICAgICAgIHNlcmllczogJ1NsYXNoZXInLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL1RlcmVzYS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXIgLSBNZWV0IFRoZSBDYXN0JyxcbiAgICAgICAgaWQ6IDI4LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1NlZSBicmFuZCBuZXcgdmlkZW9zIG9mIHRoZSBmdWxsIFNsYXNoZXIgY2FzdCBiZWhpbmQgdGhlIHNjZW5lcyEnLFxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICBzZXJpZXM6ICdTbGFzaGVyJyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9UZXJlc2EucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdTbGFzaGVyIC0gRXBpc29kZSA0JyxcbiAgICAgICAgaWQ6IDI4LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1dhdGNoIHRoZSBsYXRlc3QgZXBpc29kZSBvZiBTbGFzaGVyIG9uIHlvdXIgY29tcHV0ZXIgYW5kIG1vYmlsZSBkZXZpY2VzLicsXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXG4gICAgICAgIHNlcmllczogJ1NsYXNoZXInLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL1RlcmVzYS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG5cbiAgICAvLyBIYXZlbiBlcGlzb2Rlc1xuXG5dO1xuXG52YXIgY29sbGVjdGlvbnMgPSBbXG4gICAge1xuICAgICAgICB0aXRsZTogJ0JsaW5kc3BvdCDigJQgaGVhZGVyIDEnLFxuICAgICAgICBpZDogMTAxLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0hlYWRlciBpbWFnZXMgZm9yIEJsaW5kc3BvdCcsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0JsaW5kc3BvdCDigJQgbWlkZGxlIHBhZ2UnLFxuICAgICAgICBpZDogMTAyLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ01pZGRsZSBwYXJ0IGNvbGxlY3Rpb24gZm9yIEJsaW5kc3BvdCBzZXJpZXMnLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogOCxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdCbGluZHNwb3Qg4oCUIGhlcm8gY29sbGVjdGlvbicsXG4gICAgICAgIGlkOiAxMDMsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyB0aGUgY29sbGVjdGlvbiBmb3IgaGVybyBjYXJvdXNlbCBmb3IgQmxpbmRzcG90JyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDQsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnQmxpbmRzcG90IOKAlCBoZXJvIGNvbGxlY3Rpb24gLSAyJyxcbiAgICAgICAgaWQ6IDEwNCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdUaGlzIGlzIHRoZSBjb2xsZWN0aW9uIGZvciBoZXJvIGNhcm91c2VsIGZvciBCbGluZHNwb3QgIzInLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogMixcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdCbGluZHNwb3Qg4oCUIGhlcm8gY29sbGVjdGlvbiAtIDMnLFxuICAgICAgICBpZDogMTA1LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgdGhlIGNvbGxlY3Rpb24gZm9yIGhlcm8gY2Fyb3VzZWwgZm9yIEJsaW5kc3BvdCAjMycsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiA4LFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXIgSGVybyBDYXJvdXNlbCcsXG4gICAgICAgIGlkOiAxMDYsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnIEEgY2Fyb3VzZWwgb2YgMyBpbWFnZXMgZm9yIFNsYXNoZXLigJlzIGhlcm8gc3BvdC4nLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogMyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdTbGFzaGVyIEJvZHkgY29udGVudCcsXG4gICAgICAgIGlkOiAxMDcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQSBjdXJhdGVkIGNvbGxlY3Rpb24gZm9yIHByb21vdGVkIGNvbnRlbnRzIG9uIHRoZSBtYWluIHBhZ2Ugb2YgU2xhc2hlci4nLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogNCxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdKYW5lXFwncyB0YXR0b28gYmFja3N0b3J5JyxcbiAgICAgICAgaWQ6IDEwOCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdDb2xsZWN0aW9uIG9mIHZpZGVvcyB3aXRoIEphbmVcXCdzIHRhdHRvb3MuJyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDQsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnSW5zaWRlIFRoZSBFeHBhbnNlOiBFcGlzb2RlIDgnLFxuICAgICAgICBpZDogMTA5LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBjYXN0IGFuZCBzaG93cnVubmVycyB0YWxrIFNlYXNvbiAxLCBFcGlzb2RlIDguJyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDYsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnSW5zaWRlIHRoZSBFeHBhbnNlOiBFcGlzb2RlIDcnLFxuICAgICAgICBpZDogMTEwLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBjYXN0IGFuZCBzaG93cnVubmVycyB0YWxrIFNlYXNvbiAxLCBFcGlzb2RlIDcuJyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDYsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnSW5zaWRlIHRoZSBFeHBhbnNlOiBFcGlzb2RlIDYnLFxuICAgICAgICBpZDogMTExLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBjYXN0IGFuZCBzaG93cnVubmVycyB0YWxrIFNlYXNvbiAxLCBFcGlzb2RlIDYuJyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDYsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnTWFnaWNpYW5zIEhlcm8nLFxuICAgICAgICBpZDogMTEyLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogMyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdNYWdpY2lhbnMgYmFja3N0YWdlJyxcbiAgICAgICAgaWQ6IDExMyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdNYWdpY2lhbnMgYmFja3N0YWdlIHBob3RvcywgY2FzdCB0YWxrcyBhbmQgdmlkZW9zLicsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiAxMCxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdCaXR0ZW4gU2VyaWVzIEhlcm8nLFxuICAgICAgICBpZDogMTE0LFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogMyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdCaXR0ZW4gU2Vhc29uIDMgSGVybycsXG4gICAgICAgIGlkOiAxMTUsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0JpdHRlbiBTZWFzb24gMyBmb290ZXInLFxuICAgICAgICBpZDogMTE2LFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogOCxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdCaXR0ZW4gU2Vhc29uIDIgSGVybycsXG4gICAgICAgIGlkOiAxMTcsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0JpdHRlbiBTZWFzb24gMiBmb290ZXInLFxuICAgICAgICBpZDogMTE4LFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogOCxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdCaXR0ZW4gU2Vhc29uIDEgSGVybycsXG4gICAgICAgIGlkOiAxMTksXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0JpdHRlbiBTZWFzb24gMSBmb290ZXInLFxuICAgICAgICBpZDogMTE5LFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogOCxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuXG4gICAgLy8gSGF2ZW5cbiAgICB7XG4gICAgICAgIHRpdGxlOiAnSGF2ZW4gU2VyaWVzIEhlcm8nLFxuICAgICAgICBpZDogMTIwLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogMyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdIYXZlbiBTZWFzb24gNSBIZXJvJyxcbiAgICAgICAgaWQ6IDEyMSxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDMsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnSGF2ZW4gU2Vhc29uIDUgbGVmdCBzaWRlJyxcbiAgICAgICAgaWQ6IDEyMixcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDUsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnSGF2ZW4gU2Vhc29uIDQgSGVybycsXG4gICAgICAgIGlkOiAxMjMsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0hhdmVuIFNlYXNvbiA0IGxlZnQgc2lkZScsXG4gICAgICAgIGlkOiAxMjQsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiA2LFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0hhdmVuIFNlYXNvbiAzIEhlcm8nLFxuICAgICAgICBpZDogMTI1LFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogMyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdIYXZlbiBTZWFzb24gMyBsZWZ0IHNpZGUnLFxuICAgICAgICBpZDogMTI2LFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogNCxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdIYXZlbiBTZWFzb24gMiBIZXJvJyxcbiAgICAgICAgaWQ6IDEyNyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDMsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnSGF2ZW4gU2Vhc29uIDIgbGVmdCBzaWRlJyxcbiAgICAgICAgaWQ6IDEyOCxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDUsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnSGF2ZW4gU2Vhc29uIDEgSGVybycsXG4gICAgICAgIGlkOiAxMjksXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0hhdmVuIFNlYXNvbiAxIGxlZnQgc2lkZScsXG4gICAgICAgIGlkOiAxMzAsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiA0LFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH1cbl07XG5cbnZhciBwYWdlQ29sbGVjdGlvbnMgPSBbXG4gICAge1xuICAgICAgICB0aXRsZTogJ0JsaW5kc3BvdCBTZXJpZXMgUGFnZScsXG4gICAgICAgIGlkOiAxMDAxLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbGxlY3Rpb24gZm9yIEJsaW5kc3BvdFxcJyBzZXJpZXMgcGFnZTogaGVybywgbGVmdC1zaWRlIGFuZCBmb290ZXInLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbiBncm91cCcsXG4gICAgICAgIGFzc2V0czogMyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLW1hc3RlckNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdCbGluZHNwb3QgU2Vhc29uIFBhZ2UnLFxuICAgICAgICBpZDogMTAwMixcbiAgICAgICAgZGVzY3JpcHRpb246ICdDb2xsZWN0aW9uIGZvciBCbGluZHNwb3RcXCcgc2Vhc29uIHBhZ2U6IGhlcm8gYW5kIGZvb3Rlci4nLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbiBncm91cCcsXG4gICAgICAgIGFzc2V0czogMixcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLW1hc3RlckNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdUaGUgQmxhY2tsaXN0IFNlcmllcyBQYWdlJyxcbiAgICAgICAgaWQ6IDEwMDMsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQ29sbGVjdGlvbiBmb3IgVGhlIEJsYWNrbGlzdFxcJyBzZXJpZXMgcGFnZTogaGVybyBhbmQgbGVmdC1zaWRlLicsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uIGdyb3VwJyxcbiAgICAgICAgYXNzZXRzOiAyLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtbWFzdGVyQ29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1RoZSBCbGFja2xpc3QgRXBpc29kZSBQYWdlJyxcbiAgICAgICAgaWQ6IDEwMDQsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQ29sbGVjdGlvbiBmb3IgVGhlIEJsYWNrbGlzdFxcJyBlcGlzb2RlIHBhZ2U6IGhlcm8sIGxlZnQtc2lkZSBhbmQgZm9vdGVyLicsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uIGdyb3VwJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtbWFzdGVyQ29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXIgUGFnZScsXG4gICAgICAgIGlkOiAxMDA1LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbGxlY3Rpb24gZm9yIFNsYXNoZXLigJlzIHNlcmllcyBtYWluIHBhZ2UuJyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24gZ3JvdXAnLFxuICAgICAgICBhc3NldHM6IDIsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1tYXN0ZXJDb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnSGF2ZW4gUGFnZScsXG4gICAgICAgIGlkOiAxMDA2LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbGxlY3Rpb24gZm9yIEhhdmVuXFwncyBzZXJpZXMgbWFpbiBwYWdlLicsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uIGdyb3VwJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtbWFzdGVyQ29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0hhdmVuIEVwaXNvZGUgUGFnZScsXG4gICAgICAgIGlkOiAxMDA3LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbGxlY3Rpb24gZm9yIEhhdmVuXFwnIGVwaXNvZGUgcGFnZScsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uIGdyb3VwJyxcbiAgICAgICAgYXNzZXRzOiA0LFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtbWFzdGVyQ29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1N1aXRzIFBhZ2UnLFxuICAgICAgICBpZDogMTAwOCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdDb2xsZWN0aW9uIGZvciBTdWl0c1xcJ3Mgc2VyaWVzIG1haW4gcGFnZS4nLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbiBncm91cCcsXG4gICAgICAgIGFzc2V0czogMyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLW1hc3RlckNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdDb2xvbnkgUGFnZScsXG4gICAgICAgIGlkOiAxMDA5LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbGxlY3Rpb24gZm9yIENvbG9ueVxcJ3Mgc2VyaWVzIG1haW4gcGFnZS4nLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbiBncm91cCcsXG4gICAgICAgIGFzc2V0czogMyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLW1hc3RlckNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdHaXJsZnJpZW5kcyBHdWlkZSB0byBEaXZvcmNlIFBhZ2UnLFxuICAgICAgICBpZDogMTAxMCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdDb2xsZWN0aW9uIGZvciBHaXJsZnJpZW5kcyBHdWlkZSB0byBEaXZvcmNlXFwncyBzZXJpZXMgbWFpbiBwYWdlLicsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uIGdyb3VwJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtbWFzdGVyQ29sbGVjdGlvbi5odG1sJ1xuICAgIH1cbl07XG5cbmZ1bmN0aW9uIGNyZWF0ZUl0ZW1Sb3coYykge1xuICAgIHZhciBpdGVtUm93ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2xzIGNnX19jb250cm9sc19zdHlsZV9yb3cnKSxcbiAgICAgICAgaXRlbVdyYXBwZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjZ19fY29udHJvbCBjZ19fY29udHJvbF9zdHlsZV9yb3cnKSxcbiAgICAgICAgaXRlbVNlbGVjdCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLXNlbGVjdGJveCcpO1xuXG4gICAgaXRlbVdyYXBwZXIuYXBwZW5kKGl0ZW1TZWxlY3QpO1xuICAgIGl0ZW1Sb3cuYXBwZW5kKGl0ZW1XcmFwcGVyKTtcbiAgICB2YXIgY29sbGVjdGlvblNlbGVjdEl0ZW0gPSBpdGVtU2VsZWN0Ym94KGl0ZW1TZWxlY3QuZ2V0KDApKTtcbiAgICByZXR1cm4gaXRlbVJvdztcbn1cblxuZnVuY3Rpb24gaXRlbVNlbGVjdGJveChlbCwgZGF0YSwgY2FsbGJhY2ssIGl0ZW1MYWJlbCkge1xuICAgIHZhciBpdGVtc0RhdGEgPSBkYXRhIHx8IGNvbGxlY3Rpb25JdGVtcyxcbiAgICAgICAgaXRlbUNhbGxiYWNrID0gY2FsbGJhY2sgfHwgaGFuZGxlSXRlbW1DbGljaztcblxuICAgIHJldHVybiBuZXcgU2VsZWN0Ym94KGVsLCB7XG4gICAgICAgIGxhYmVsOiBpdGVtTGFiZWwgfHwgJ0l0ZW0nLFxuICAgICAgICBwbGFjZWhvbGRlcjogaXRlbUxhYmVsID8gJ1NlbGVjdCAnICsgaXRlbUxhYmVsIDogJ1NlbGVjdCBJdGVtJyxcbiAgICAgICAgaXRlbXM6IGl0ZW1zRGF0YVxuICAgICAgICAgICAgLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLnRpdGxlID4gYi50aXRsZSA/IDEgOiBhLnRpdGxlIDwgYi50aXRsZSA/IC0xIDogMDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubWFwKGNyZWF0ZUxpc3RJdGVtKSxcbiAgICAgICAgY29tcGxleEl0ZW1zOiB0cnVlLFxuICAgICAgICBzaWRlTmF2OiB0cnVlLFxuICAgICAgICBpdGVtQ2FsbGJhY2s6IGl0ZW1DYWxsYmFjayxcbiAgICAgICAgZGF0YTogaXRlbXNEYXRhLFxuICAgICAgICBzZWFyY2g6IHRydWVcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlSXRlbW1DbGljayhpdGVtLCBzZWxlY3Rib3gpIHtcbiAgICB2YXIgaWQgPSBwYXJzZUludCgkKGl0ZW0pLmZpbmQoJy5zZWxlY3Rib3hfX2xpc3QtaXRlbS10aXRsZScpLmF0dHIoJ2lkJykuc3BsaXQoJy0nKVsxXSksXG4gICAgICAgIGRhdGEgPSBzZWxlY3Rib3gub3B0aW9ucy5kYXRhIHx8IGNvbGxlY3Rpb25JdGVtcztcbiAgICB2YXIgY29sbGVjdGlvbkl0ZW0gPSBjcmVhdGVDb2xsZWN0aW9uSXRlbShkYXRhLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5pZCA9PT0gaWQ7XG4gICAgICAgIH0pWzBdKTtcbiAgICB2YXIgYWRkYWJsZUl0ZW0gPSAkKHNlbGVjdGJveC5zZWxlY3RXcmFwcGVyKS5wYXJlbnRzKCcuYy1BZGRhYmxlLWl0ZW0nKTtcbiAgICBhZGRhYmxlSXRlbS5lbXB0eSgpLmFwcGVuZChjb2xsZWN0aW9uSXRlbSk7XG4gICAgY29sbGVjdGlvbkl0ZW0ucGFyZW50cygnLmMtQWRkYWJsZS1yb3cnKS5hZGRDbGFzcygnYy1BZGRhYmxlLXJvdy0tY29sbGVjdGlvbicpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb2xsZWN0aW9uSXRlbShpdGVtKSB7XG4gICAgdmFyIGNvbGxJdGVtID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY29sbGVjdGlvbi1pdGVtIGlzLWFwcGVhcmluZyBqcy1oYXNWYWx1ZScpLFxuICAgICAgICBjb2xsSXRlbVdyYXBwZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjb2xsZWN0aW9uLWl0ZW1fX3dyYXBwZXInKSxcbiAgICAgICAgLy9jb2xsSXRlbUltYWdlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY29sbGVjdGlvbi1pdGVtX19pbWFnZSBpcy1lbXB0eScpLFxuICAgICAgICBjb2xsSXRlbVRpdGxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY29sbGVjdGlvbi1pdGVtX190aXRsZScpLnRleHQoaXRlbS50aXRsZSksXG4gICAgICAgIGl0ZW1JbmZvID0gaXRlbS50eXBlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgaXRlbS50eXBlLnNsaWNlKDEpLFxuICAgICAgICBjb2xsSXRlbUluZm8gPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjb2xsZWN0aW9uLWl0ZW1fX2luZm8nKSxcbiAgICAgICAgY29sbEl0ZW1EZXNjcmlwdGlvbiA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NvbGxlY3Rpb24taXRlbV9fZGVzY3JpcHRpb24nKSxcbiAgICAgICAgY29sbEl0ZW1FZGl0QnV0dG9uID0gJCgnPGJ1dHRvbj48L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXkgY29sbGVjdGlvbi1pdGVtX19lZGl0JykudGV4dCgnRWRpdCcpO1xuXG4gICAgLyppZiAoaXRlbS5pbWcpIHtcbiAgICAgICAgY29sbEl0ZW1JbWFnZS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyBpdGVtLmltZyArICcpJykucmVtb3ZlQ2xhc3MoJ2lzLWVtcHR5Jyk7XG4gICAgfSovXG4gICAgLypzd2l0Y2ggKGl0ZW0udHlwZSkge1xuICAgICAgICBjYXNlICd2aWRlbyc6XG4gICAgICAgICAgICBjb2xsSXRlbVR5cGVJY29uID0gJCgnPGRpdj48aSBjbGFzcz1cImZhIGZhLXZpZGVvLWNhbWVyYVwiPjwvaT48L2Rpdj4nKS5hZGRDbGFzcygnY29sbGVjdGlvbi1pdGVtX190eXBlJyk7XG4gICAgICAgICAgICBjb2xsSXRlbUltYWdlLmFwcGVuZChjb2xsSXRlbVR5cGVJY29uKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdnYWxsZXJ5JzpcbiAgICAgICAgICAgIGNvbGxJdGVtVHlwZUljb24gPSAkKCc8ZGl2PjxpIGNsYXNzPVwiZmEgZmEtcGljdHVyZS1vXCI+PC9pPjwvZGl2PicpLmFkZENsYXNzKCdjb2xsZWN0aW9uLWl0ZW1fX3R5cGUnKTtcbiAgICAgICAgICAgIGNvbGxJdGVtSW1hZ2UuYXBwZW5kKGNvbGxJdGVtVHlwZUljb24pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2VwaXNvZGUnOlxuICAgICAgICAgICAgY29sbEl0ZW1UeXBlSWNvbiA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NvbGxlY3Rpb24taXRlbV9fdHlwZSBjb2xsZWN0aW9uLWl0ZW1fX3R5cGUtLWltYWdlIGNvbGxlY3Rpb24taXRlbV9fdHlwZS0tZXBpc29kZScpO1xuICAgICAgICAgICAgY29sbEl0ZW1JbWFnZS5hcHBlbmQoY29sbEl0ZW1UeXBlSWNvbik7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdjYXN0JzpcbiAgICAgICAgICAgIGNvbGxJdGVtVHlwZUljb24gPSAkKCc8ZGl2PjxpIGNsYXNzPVwiZmEgZmEtdXNlcnNcIj48L2k+PC9kaXY+JykuYWRkQ2xhc3MoJ2NvbGxlY3Rpb24taXRlbV9fdHlwZScpO1xuICAgICAgICAgICAgY29sbEl0ZW1JbWFnZS5hcHBlbmQoY29sbEl0ZW1UeXBlSWNvbik7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdjb2xsZWN0aW9uJzpcbiAgICAgICAgICAgIGNvbGxJdGVtSW1hZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoaXRlbS5hc3NldHMpIHtpdGVtSW5mbyA9IGl0ZW1JbmZvICsgJyB8ICcgKyBpdGVtLmFzc2V0cy50b1N0cmluZygpICsgJyBhc3NldHMnO31cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2NvbGxlY3Rpb24gZ3JvdXAnOlxuICAgICAgICAgICAgY29sbEl0ZW1JbWFnZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmIChpdGVtLmFzc2V0cykge2l0ZW1JbmZvID0gaXRlbUluZm8gKyAnIHwgJyArIGl0ZW0uYXNzZXRzLnRvU3RyaW5nKCkgKyAnIGNvbGxlY3Rpb25zJzt9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNvbGxJdGVtLmFwcGVuZChjb2xsSXRlbUltYWdlKTsqL1xuXG4gICAgY29sbEl0ZW1XcmFwcGVyLmFwcGVuZChjb2xsSXRlbVRpdGxlKTtcblxuICAgIC8qaWYgKGl0ZW0uZGVzY3JpcHRpb24pIHtcbiAgICAgICAgY29sbEl0ZW1EZXNjcmlwdGlvbi50ZXh0KGl0ZW0uZGVzY3JpcHRpb24pO1xuICAgICAgICBjb2xsSXRlbVdyYXBwZXIuYXBwZW5kKGNvbGxJdGVtRGVzY3JpcHRpb24pO1xuICAgIH0qL1xuXG4gICAgLyppZiAoaXRlbS5zdWJ0eXBlKSB7XG4gICAgICAgIGl0ZW1JbmZvID0gaXRlbUluZm8gKyAnICgnICsgaXRlbS5zdWJ0eXBlICsgJyknO1xuICAgIH1cbiAgICBpZiAoaXRlbS5zZXJpZXMpIHtcbiAgICAgICAgaXRlbUluZm8gPSBpdGVtSW5mbyArICcgfCAnICsgaXRlbS5zZXJpZXM7XG4gICAgfSovXG4gICAgY29sbEl0ZW1JbmZvLnRleHQoaXRlbUluZm8pO1xuICAgIGNvbGxJdGVtV3JhcHBlci5hcHBlbmQoY29sbEl0ZW1JbmZvKTtcbiAgICBjb2xsSXRlbS5hcHBlbmQoY29sbEl0ZW1XcmFwcGVyKTtcblxuICAgIC8qaWYgKGl0ZW0udGFyZ2V0KSB7XG4gICAgICAgIGNvbGxJdGVtRWRpdEJ1dHRvbi5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB3aW5kb3cub3BlbihpdGVtLnRhcmdldCwnX2JsYW5rJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb2xsSXRlbS5hcHBlbmQoY29sbEl0ZW1FZGl0QnV0dG9uKTtcbiAgICB9Ki9cblxuICAgIHJldHVybiBjb2xsSXRlbTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlzdEl0ZW0oaXRlbSkge1xuICAgIHZhciBsaXN0SXRlbSA9ICQoJzxkaXY+PC9kaXY+JyksXG4gICAgICAgIGl0ZW1TdWJ0aXRsZSA9IGl0ZW0udHlwZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGl0ZW0udHlwZS5zbGljZSgxKSxcbiAgICAgICAgbGlzdEl0ZW1UaXRsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1pdGVtLXRpdGxlJykudGV4dChpdGVtLnRpdGxlKS5hdHRyKCdpZCcsICdjb2xsZWN0aW9uSXRlbS0nICsgaXRlbS5pZCksXG4gICAgICAgIGxpc3RJdGVtU3VidGl0bGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtaXRlbS1zdWJ0aXRsZScpLFxuICAgICAgICBsaXN0SXRlbVR5cGVJY29uO1xuXG4gICAgLypzd2l0Y2ggKGl0ZW0udHlwZSkge1xuICAgICAgICBjYXNlICd2aWRlbyc6XG4gICAgICAgICAgICBsaXN0SXRlbVR5cGVJY29uID0gJCgnPGRpdj48aSBjbGFzcz1cImZhIGZhLXZpZGVvLWNhbWVyYVwiPjwvaT48L2Rpdj4nKS5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWl0ZW0tdHlwZScpO1xuICAgICAgICAgICAgbGlzdEl0ZW0uYXBwZW5kKGxpc3RJdGVtVHlwZUljb24pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnZ2FsbGVyeSc6XG4gICAgICAgICAgICBsaXN0SXRlbVR5cGVJY29uID0gJCgnPGRpdj48aSBjbGFzcz1cImZhIGZhLXBpY3R1cmUtb1wiPjwvaT48L2Rpdj4nKS5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWl0ZW0tdHlwZScpO1xuICAgICAgICAgICAgbGlzdEl0ZW0uYXBwZW5kKGxpc3RJdGVtVHlwZUljb24pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnZXBpc29kZSc6XG4gICAgICAgICAgICBsaXN0SXRlbVR5cGVJY29uID0gJCgnPGRpdj48aSBjbGFzcz1cImZhIGZhLWZpbGUtdmlkZW8tb1wiPjwvaT48L2Rpdj4nKS5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWl0ZW0tdHlwZScpO1xuICAgICAgICAgICAgbGlzdEl0ZW0uYXBwZW5kKGxpc3RJdGVtVHlwZUljb24pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnaW1hZ2UnOlxuICAgICAgICAgICAgbGlzdEl0ZW1UeXBlSWNvbiA9ICQoJzxkaXY+PGkgY2xhc3M9XCJmYSBmYS1jYW1lcmFcIj48L2k+PC9kaXY+JykuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1pdGVtLXR5cGUnKTtcbiAgICAgICAgICAgIGxpc3RJdGVtLmFwcGVuZChsaXN0SXRlbVR5cGVJY29uKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2Nhc3QnOlxuICAgICAgICAgICAgbGlzdEl0ZW1UeXBlSWNvbiA9ICQoJzxkaXY+PGkgY2xhc3M9XCJmYSBmYS11c2Vyc1wiPjwvaT48L2Rpdj4nKS5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWl0ZW0tdHlwZScpO1xuICAgICAgICAgICAgbGlzdEl0ZW0uYXBwZW5kKGxpc3RJdGVtVHlwZUljb24pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH0qL1xuXG4gICAgLyppZiAoaXRlbS5zdWJ0eXBlKSB7XG4gICAgICAgIGl0ZW1TdWJ0aXRsZSA9IGl0ZW1TdWJ0aXRsZSArICcgKCcgKyBpdGVtLnN1YnR5cGUgKyAnKSc7XG4gICAgfSovXG4gICAgLyppZiAoaXRlbS5zZXJpZXMpIHtcbiAgICAgICAgaXRlbVN1YnRpdGxlID0gaXRlbVN1YnRpdGxlICsgJyB8ICcgKyBpdGVtLnNlcmllcztcbiAgICB9XG4gICAgaWYgKGl0ZW0uYXNzZXRzKSB7XG4gICAgICAgIGl0ZW1TdWJ0aXRsZSA9IGl0ZW1TdWJ0aXRsZSArICcgfCAnICsgaXRlbS5hc3NldHMudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2NvbGxlY3Rpb24gZ3JvdXAnKSB7aXRlbVN1YnRpdGxlID0gaXRlbVN1YnRpdGxlICsgJyBjb2xsZWN0aW9ucyc7fVxuICAgICAgICBlbHNlIHtpdGVtU3VidGl0bGUgPSBpdGVtU3VidGl0bGUgKyAnIGFzc2V0cyc7fVxuICAgIH0qL1xuICAgIGxpc3RJdGVtU3VidGl0bGUudGV4dChpdGVtU3VidGl0bGUpO1xuICAgIGxpc3RJdGVtLmFwcGVuZChsaXN0SXRlbVRpdGxlLCBsaXN0SXRlbVN1YnRpdGxlKTtcblxuXG5cbiAgICAvKmlmIChpdGVtLmltZykge1xuICAgICAgICB2YXIgbGlzdEl0ZW1JbWFnZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1pdGVtLWltYWdlJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgaXRlbS5pbWcgKyAnKScpO1xuXG5cblxuICAgICAgICBsaXN0SXRlbS5hcHBlbmQobGlzdEl0ZW1JbWFnZSk7XG4gICAgfSovXG5cbiAgICByZXR1cm4gbGlzdEl0ZW0uZ2V0KDApLmlubmVySFRNTDtcbn1cblxuZnVuY3Rpb24gaW5pdENvbGxTZWN0aW9uKHNlY3Rpb24sIGRhdGEsIGl0ZW1MYWJlbCkge1xuICAgIGZ1bmN0aW9uIGJlZm9yZUFkZENvbGxlY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIGNvbGxlY3Rpb25TZWxlY3RJdGVtID0gaXRlbVNlbGVjdGJveChlbC5maW5kKCcuanMtc2VsZWN0Ym94JykuZ2V0KDApLCBkYXRhLCBudWxsLCBpdGVtTGFiZWwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUVtcHR5Q29sbFJvdyAoKSB7XG4gICAgICAgIHZhciBpdGVtUm93ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2xzIGNnX19jb250cm9sc19zdHlsZV9yb3cnKSxcbiAgICAgICAgICAgIGl0ZW1XcmFwcGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2wgY2dfX2NvbnRyb2xfc3R5bGVfcm93JyksXG4gICAgICAgICAgICBpdGVtU2VsZWN0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtc2VsZWN0Ym94Jyk7XG5cbiAgICAgICAgICAgIGl0ZW1XcmFwcGVyLmFwcGVuZChpdGVtU2VsZWN0KTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtUm93LmFwcGVuZChpdGVtV3JhcHBlcik7XG4gICAgfVxuXG4gICAgdmFyIGNvbGxSb3cgPSBjcmVhdGVFbXB0eUNvbGxSb3coKTtcbiAgICBzZWN0aW9uLmFwcGVuZChjb2xsUm93KTtcbiAgICB2YXIgYWRkYWJsZU9iamVjdCA9IG5ldyBBZGRhYmxlKGNvbGxSb3csIHtiZWZvcmVBZGQ6IGJlZm9yZUFkZENvbGxlY3Rpb24sIHBsYWNlaG9sZGVyOiAnYy1BZGRhYmxlLXJvd1BsYWNlaG9sZGVyLS1jb2xsZWN0aW9uJywgc29ydGFibGU6IHRydWV9KTtcbiAgICBhZGRhYmxlT2JqZWN0LnJlbW92ZUl0ZW0oMCk7XG4gICAgYWRkYWJsZU9iamVjdC5fYWRkSXRlbShjcmVhdGVFbXB0eUNvbGxSb3coKSwgYmVmb3JlQWRkQ29sbGVjdGlvbik7XG5cbiAgICByZXR1cm4gYWRkYWJsZU9iamVjdDtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZVNlbGVjdGJveFdpdGhDb2xsZWN0aW9uUm93KGl0ZW0sIHNlbGVjdGJveCkge1xuICAgIHZhciBpZCA9IHBhcnNlSW50KCQoaXRlbSkuZmluZCgnLnNlbGVjdGJveF9fbGlzdC1pdGVtLXRpdGxlJykuYXR0cignaWQnKS5zcGxpdCgnLScpWzFdKSxcbiAgICAgICAgZGF0YSA9IHNlbGVjdGJveC5vcHRpb25zLmRhdGEgfHwgY29sbGVjdGlvbkl0ZW1zLFxuICAgICAgICBjb2xsZWN0aW9uSXRlbSA9IGNyZWF0ZUNvbGxlY3Rpb25JdGVtKGRhdGEuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLmlkID09PSBpZDtcbiAgICAgICAgfSlbMF0pO1xuXG4gICAgLy9DcmVhdGUgRE9NIGVsZW1lbnRzXG4gICAgdmFyIGNvbGxlY3Rpb25Sb3cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjb2xsZWN0aW9uLXJvdyBqcy1jb2xsZWN0aW9uUm93JyksXG4gICAgICAgIGNvbGxlY3Rpb25JdGVtV3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NvbGxlY3Rpb24tcm93X19pdGVtLXdyYXBwZXInKSxcbiAgICAgICAgY29sbGVjdGlvblJlbW92ZUJ1dHRvbiA9ICQoJzxidXR0b24+PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbi0tcm91bmQgYnV0dG9uX3N0eWxlX291dGxpbmUtZ3JheSBidXR0b24tLXJlbW92ZSBjb2xsZWN0aW9uLXJvd19fYnV0dG9uIGpzLWNvbGxlY3Rpb25SZW1vdmVCdXR0b24nKS5jbGljayhoYW5kbGVSZW1vdmVDb2xsZWN0aW9uUm93KTtcblxuICAgIGNvbGxlY3Rpb25JdGVtV3JhcHBlci5hcHBlbmQoY29sbGVjdGlvbkl0ZW0pO1xuICAgIGNvbGxlY3Rpb25Sb3cuYXBwZW5kKGNvbGxlY3Rpb25JdGVtV3JhcHBlciwgY29sbGVjdGlvblJlbW92ZUJ1dHRvbik7XG5cbiAgICAvL0luc2VydCBuZXcgZWxlbWVudHMgaW4gRE9NIGFuZCByZW1vdmUgbGlzdFxuICAgIGNvbGxlY3Rpb25Sb3cuaW5zZXJ0QmVmb3JlKHNlbGVjdGJveC5zZWxlY3RXcmFwcGVyKTtcbiAgICBzZWxlY3Rib3guc2VsZWN0V3JhcHBlci5yZW1vdmUoKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlUmVtb3ZlQ29sbGVjdGlvblJvdyhlKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25Sb3cgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuanMtY29sbGVjdGlvblJvdycpLFxuICAgICAgICBjb2xsZWN0aW9uU2VsZWN0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtc2VsZWN0Ym94Jyk7XG5cbiAgICBjb2xsZWN0aW9uU2VsZWN0Lmluc2VydEJlZm9yZShjb2xsZWN0aW9uUm93KTtcbiAgICBjb2xsZWN0aW9uUm93LnJlbW92ZSgpO1xuXG4gICAgdmFyIGNvbGxlY3Rpb25TZWxlY3RJdGVtID0gbmV3IFNlbGVjdGJveChjb2xsZWN0aW9uU2VsZWN0LmdldCgwKSwge1xuICAgICAgICBsYWJlbDogJ0NvbGxlY3Rpb24nLFxuICAgICAgICBwbGFjZWhvbGRlcjogJ1NlbGVjdCBDb2xsZWN0aW9uJyxcbiAgICAgICAgaXRlbXM6IHBhZ2VDb2xsZWN0aW9uc1xuICAgICAgICAgICAgLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLnRpdGxlID4gYi50aXRsZSA/IDEgOiBhLnRpdGxlIDwgYi50aXRsZSA/IC0xIDogMDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubWFwKGNyZWF0ZUxpc3RJdGVtKSxcbiAgICAgICAgY29tcGxleEl0ZW1zOiB0cnVlLFxuICAgICAgICBzaWRlTmF2OiB0cnVlLFxuICAgICAgICBpdGVtQ2FsbGJhY2s6IHJlcGxhY2VTZWxlY3Rib3hXaXRoQ29sbGVjdGlvblJvdyxcbiAgICAgICAgZGF0YTogcGFnZUNvbGxlY3Rpb25zLFxuICAgICAgICBzZWFyY2g6IHRydWVcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaW5pdE9uZUNvbGxlY3Rpb25TZWN0aW9uKHNlY3Rpb24sIGRhdGEsIGxhYmVsKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25TZWxlY3QgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdqcy1zZWxlY3Rib3gnKTtcbiAgICB2YXIgaXRlbXMgPSBkYXRhIHx8IHBhZ2VDb2xsZWN0aW9ucztcbiAgICBzZWN0aW9uLmFwcGVuZChjb2xsZWN0aW9uU2VsZWN0KTtcblxuICAgIHZhciBjb2xsZWN0aW9uU2VsZWN0SXRlbSA9IG5ldyBTZWxlY3Rib3goY29sbGVjdGlvblNlbGVjdC5nZXQoMCksIHtcbiAgICAgICAgbGFiZWw6IGxhYmVsIHx8ICdDb2xsZWN0aW9uIEdyb3VwJyxcbiAgICAgICAgaXRlbXM6IGl0ZW1zXG4gICAgICAgICAgICAuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEudGl0bGUgPiBiLnRpdGxlID8gMSA6IGEudGl0bGUgPCBiLnRpdGxlID8gLTEgOiAwO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5tYXAoY3JlYXRlTGlzdEl0ZW0pLFxuICAgICAgICBjb21wbGV4SXRlbXM6IHRydWUsXG4gICAgICAgIHNpZGVOYXY6IHRydWUsXG4gICAgICAgIGl0ZW1DYWxsYmFjazogcmVwbGFjZVNlbGVjdGJveFdpdGhDb2xsZWN0aW9uUm93LFxuICAgICAgICBkYXRhOiBpdGVtcyxcbiAgICAgICAgc2VhcmNoOiB0cnVlLFxuICAgICAgICB1bnNlbGVjdDogLTFcbiAgICB9KTtcbn1cblxuLy9Bc3NvY2lhdGlvbiBpbml0aWFsaXphdGlvblxuLy8gZGF0YVxudmFyIGRhdGFTZXJpZXMgPSBbXG4gICAgLy9TeWZ5XG4gICAgJzEyIE1vbmtleXMnLFxuICAgICdCYXR0bGVzdGFyIEdhbGFjdGljYScsXG4gICAgJ0JpdHRlbicsXG4gICAgJ0NoYW5uZWwgWmVybzogQ2FuZGxlIENvdmUnLFxuICAgICdDaGlsZGhvb2RzIEVuZCcsXG4gICAgJ0Nsb3NlIFVwIEtpbmdzJyxcbiAgICAnRGFyayBNYXR0ZXInLFxuICAgICdEZWZpYW5jZScsXG4gICAgJ0RvbWluaW9uJyxcbiAgICAnRmFjZSBPZmYnLFxuICAgICdHaG9zdCBIdW50ZXJzJyxcbiAgICAnSGF1bnRpbmcnLFxuICAgICdIYXZlbicsXG4gICAgJ0h1bnRlcnMnLFxuICAgICdLaWxsam95cycsXG4gICAgJ0xhdmFsYW50dWxhJyxcbiAgICAnTG9zdCBHaXJsJyxcbiAgICAnT2x5bXB1cycsXG4gICAgJ1BhcmFub3JtYWwgV2l0bmVzcycsXG4gICAgJ1NoYXJrbmFkbycsXG4gICAgJ1NoYXJrbmFkbyAyJyxcbiAgICAnU2hhcmtuYWRvIDMnLFxuICAgICdUaGUgRXhwYW5zZScsXG4gICAgJ1RoZSBJbnRlcm5ldCBSdWluZWQgTXkgTGlmZScsXG4gICAgJ1RoZSBNYWdpY2lhbnMnLFxuICAgICdUcm95OiBTdHJlZXQgTWFnaWMnLFxuICAgICdWYW4gSGVsc2luZycsXG4gICAgJ1d5bm9ubmEgRWFycCcsXG4gICAgJ1ogTmF0aW9uJyxcblxuICAgIC8vQ2hpbGxlclxuICAgICdTbGFzaGVyJyxcblxuICAgIC8vTkJDXG4gICAgJ0JsaW5kc3BvdCcsXG4gICAgJ1RoZSBCbGFja2xpc3QnXG5dO1xuXG52YXIgZGF0YVNlYXNvbnMgPSBbXG4gICAgJzAxJyxcbiAgICAnMDInLFxuICAgICcwMycsXG4gICAgJzA0JyxcbiAgICAnMDUnLFxuICAgICcwNicsXG4gICAgJzA3J1xuXTtcblxudmFyIGRhdGFFcGlzb2RlcyA9IFtcbiAgICAnMS4gQSBOZXcgVmlzaXRvcicsXG4gICAgJzIuIFRoZSBNYW4gaW4gdGhlIFNoYWRvd3MnLFxuICAgICczLiBUaGUgRmlyc3QgU2xpY2UnLFxuICAgICc0LiBUaGUgQmxvb2QgTW9vbicsXG4gICAgJzUuIERvbuKAmXQgR2V0IExvc3QnLFxuICAgICc2LiBBbGwgQWxvbmUnXG5dO1xuXG5mdW5jdGlvbiBpbXBvcnRTZXJpZXMoKSB7XG4gIHZhciBjcmVkaXRTZWN0aW9uID0gJCgnI2NyZWRpdFNlY3Rpb24nKSxcbiAgY2FzdFNlY3Rpb24gPSAkKCcjY2FzdFNlY3Rpb24nKSxcbiAgc2Vhc29uSGFzQ2FzdCA9IGNyZWRpdFNlY3Rpb24uZmluZCgnLmpzLWhhc1ZhbHVlJykubGVuZ3RoID4gMCB8fCBjYXN0U2VjdGlvbi5maW5kKCcuanMtaGFzVmFsdWUnKS5sZW5ndGggPiAwOyAvL0NIZWNrIGlmIGNyZWRpdCBzZWN0aW9uIG9yIGNhc3Qgc2VjdGlvbiBoYXZlIGZpbGxlZCBmaWVsZHMgb3Igc2VsZWN0Ym94ZXMgb3IgdGFnZmllbGRzXG5cbiAgaWYgKHNlYXNvbkhhc0Nhc3QpIHtcbiAgICBuZXcgTW9kYWwoe1xuICAgICAgdGl0bGU6ICdJbXBvcnQgQ2FzdCAmIENyZWRpdD8nLFxuICAgICAgdGV4dDogJ1RoZSBuZXcgQ2FzdCAmIENyZWRpdCB3aWxsIG92ZXJ3cml0ZSBhbmQgcmVwbGFjZSB0aGUgZXhpc3RpbmcgQ2FzdCAmIENyZWRpdCBpbmZvcm1hdGlvbi4gQXJlIHlvdSBzdXJlIHlvdSB3b3VsZCBsaWtlIHRvIGltcG9ydD8nLFxuICAgICAgY29uZmlybVRleHQ6ICdJbXBvcnQnLFxuICAgICAgY29uZmlybUFjdGlvbjogbG9hZENhc3QsXG4gICAgICBkaWFsb2c6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBsb2FkU2VyaWVzKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbG9hZFNlcmllcygpIHtcbiAgdmFyIGNhc3RTZWN0aW9uID0gJCgnI2Nhc3RTZWN0aW9uJyksXG4gIGNhc3RTZWN0aW9uQm9keSA9IGNhc3RTZWN0aW9uLmZpbmQoJy5jb250cm9sc19fZ3JvdXAnKSxcbiAgY3JlZGl0U2VjdGlvbiA9ICQoJyNjcmVkaXRTZWN0aW9uJyksXG4gIGNyZWRpdFNlY3Rpb25Cb2R5ID0gY3JlZGl0U2VjdGlvbi5maW5kKCcuY29udHJvbHNfX2dyb3VwJyksXG4gIGNhc3QgPSBjYXN0QW5kQ3JlZGl0LmNhc3QsXG4gIGNyZWRpdCA9IGNhc3RBbmRDcmVkaXQuY3JlZGl0O1xuXG4gIGNhc3RTZWN0aW9uQm9keS5lbXB0eSgpO1xuICBjcmVkaXRTZWN0aW9uQm9keS5lbXB0eSgpO1xuXG4gIGNyZWF0ZUNhc3RTZWN0aW9uKGNhc3QsIGNhc3RTZWN0aW9uQm9keSk7XG4gIGNyZWF0ZUNyZWRpdFNlY3Rpb24oY3JlZGl0LCBjcmVkaXRTZWN0aW9uQm9keSk7XG5cbiAgaGlkZUNhc3RJbXBvcnQoKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUGFnZVNlY3Rpb24oY3JlZGl0LCBzZWN0aW9uKSB7XG4gIHZhciBhZGRhYmxlUm93ID0gY3JlYXRlUGFnZVJvdyh7TGluazogJyd9KTtcblxuICBzZWN0aW9uLmFwcGVuZChhZGRhYmxlUm93KTtcbiAgYWRkYWJsZU9iamVjdCA9IG5ldyBBZGRhYmxlKGFkZGFibGVSb3cpO1xuICBhZGRhYmxlT2JqZWN0LnJlbW92ZUl0ZW0oMCk7XG5cbiAgY3JlZGl0LmZvckVhY2goZnVuY3Rpb24oYykge1xuICAgIGFkZGFibGVPYmplY3QuX2FkZEl0ZW0oY3JlYXRlUGFnZVJvdyhjKSk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZVBhZ2VSb3coYykge1xuICAgIHZhciBjcmVkaXRSb3cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjZ19fY29udHJvbHMgY2dfX2NvbnRyb2xzX3N0eWxlX3JvdycpLFxuICAgIHJvbGVXcmFwcGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2wgY2dfX2NvbnRyb2xfc3R5bGVfcm93JyksXG4gICAgcm9sZUZpZWxkID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIvPicpLmFkZENsYXNzKCdpbnB1dF9zdHlsZV9saWdodCcpLnZhbChjLnJvbGUpLFxuICAgIG5hbWVzRmllbGQgPSAkKCc8dGV4dGFyZWE+PC90ZXh0YXJlYT4nKS5hZGRDbGFzcygnaW5wdXRfc3R5bGVfbGlnaHQnKS52YWwoYy5uYW1lcyksXG4gICAgbmFtZXNXcmFwcGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2wgY2dfX2NvbnRyb2xfc3R5bGVfcm93Jyk7XG5cbiAgICAvL25hbWVzRmllbGQuZWxhc3RpYygpO1xuICAgIHJvbGVXcmFwcGVyLmFwcGVuZChyb2xlRmllbGQpO1xuICAgIG5hbWVzV3JhcHBlci5hcHBlbmQobmFtZXNGaWVsZCk7XG4gICAgY3JlZGl0Um93LmFwcGVuZChyb2xlV3JhcHBlciwgbmFtZXNXcmFwcGVyKTtcbiAgICBuZXcgVGV4dGZpZWxkKHJvbGVGaWVsZC5nZXQoMCksIHtcbiAgICAgIGxhYmVsOiAnVGl0bGUnLFxuICAgICAgaGVscFRleHQ6ICdlLmcgUHJvZHVjZXIsIENvc3R1bWUnXG4gICAgfSk7XG4gICAgbmV3IFRleHRmaWVsZChuYW1lc0ZpZWxkLmdldCgwKSwge2xhYmVsOiAnTmFtZShzKSd9KTtcbiAgICAkKG5hbWVzV3JhcHBlcikuZmluZCgndGV4dGFyZWEnKS5lbGFzdGljKCk7XG5cbiAgICByZXR1cm4gY3JlZGl0Um93O1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRQYWdlU2VjdGlvbihzZWN0aW9uLCBkYXRhKSB7XG4gIHZhciBhZGRhYmxlUm93ID0gY3JlYXRlUGFnZUxpbmtSb3coJycpO1xuICBzZWN0aW9uLmFwcGVuZChhZGRhYmxlUm93KTtcbiAgYWRkYWJsZU9iamVjdCA9IG5ldyBBZGRhYmxlKGFkZGFibGVSb3cpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQYWdlTGlua1JvdyhsaW5rKSB7XG4gIHZhciBwYWdlUm93ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2xzIGNnX19jb250cm9sc19zdHlsZV9yb3cnKSxcbiAgcGFnZVdyYXBwZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjZ19fY29udHJvbCBjZ19fY29udHJvbF9zdHlsZV9yb3cnKSxcbiAgbGlua0ZpZWxkID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIvPicpLmFkZENsYXNzKCdpbnB1dF9zdHlsZV9saWdodCcpLnZhbChsaW5rKTtcblxuICBwYWdlV3JhcHBlci5hcHBlbmQobGlua0ZpZWxkKTtcbiAgcGFnZVJvdy5hcHBlbmQocGFnZVdyYXBwZXIpO1xuICBuZXcgVGV4dGZpZWxkKGxpbmtGaWVsZC5nZXQoMCksIHtcbiAgICBsYWJlbDogJ0xpbmsnLFxuICAgIGhlbHBUZXh0OiAnRnVzY2Ugc29kYWxlcyBmaW5pYnVzIGF1Y3Rvci4gTnVuYyBpcHN1bSB0dXJwaXMsIHBvcnR0aXRvciBub24gc2VtIGlkLCBsdWN0dXMgdGluY2lkdW50IGRpYW0uJ1xuICB9KTtcblxuICByZXR1cm4gcGFnZVJvdztcbn1cblxuZnVuY3Rpb24gaW5pdFNlcmllc1NlY3Rpb24oc2VjdGlvbikge1xuICBmdW5jdGlvbiBiZWZvcmVBZGRTZXJpZXMoZWwpIHtcbiAgICAvL0NyZWF0ZSBzZWxlY3Rib3hcbiAgICB2YXIgc2VyaWVzU2VsZWN0SXRlbSA9IG5ldyBTZWxlY3Rib3goZWwuZmluZCgnLmpzLXNlbGVjdGJveC5qcy1zZXJpZXNTZWxlY3QnKS5nZXQoMCksIHtcbiAgICAgIGxhYmVsOiAnU2VyaWVzIG9yIEV2ZW50JyxcbiAgICAgIHBsYWNlaG9sZGVyOiAnU2VsZWN0IFNlcmllcyBvciBFdmVudCcsXG4gICAgICBpdGVtczogZGF0YVNlcmllcy5zb3J0KCksXG4gICAgICB1bnNlbGVjdDogJ+KAlCBOb25lIOKAlCdcbiAgICB9KTtcblxuICAgIHZhciBzZWFzb25TZWxlY3RJdGVtID0gbmV3IFNlbGVjdGJveChlbC5maW5kKCcuanMtc2VsZWN0Ym94LmpzLXNlYXNvblNlbGVjdCcpLmdldCgwKSwge1xuICAgICAgbGFiZWw6ICdTZWFzb24nLFxuICAgICAgcGxhY2Vob2xkZXI6ICdTZWxlY3QgU2Vhc29uJyxcbiAgICAgIGl0ZW1zOiBkYXRhU2Vhc29ucy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEgPCBiID8gMSA6IGEgPiBiID8gLTEgOiAwO1xuICAgICAgfSksXG4gICAgICB1bnNlbGVjdDogJ+KAlCBOb25lIOKAlCdcbiAgICB9KTtcblxuICAgIHZhciBlcGlzb2RlU2VsZWN0SXRlbSA9IG5ldyBTZWxlY3Rib3goZWwuZmluZCgnLmpzLXNlbGVjdGJveC5qcy1lcGlzb2RlU2VsZWN0JykuZ2V0KDApLCB7XG4gICAgICBsYWJlbDogJ0VwaXNvZGUnLFxuICAgICAgcGxhY2Vob2xkZXI6ICdTZWxlY3QgRXBpc29kZScsXG4gICAgICBpdGVtczogZGF0YUVwaXNvZGVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gYSA8IGIgPyAxIDogYSA+IGIgPyAtMSA6IDA7XG4gICAgICB9KSxcbiAgICAgIHVuc2VsZWN0OiAn4oCUIE5vbmUg4oCUJ1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRW1wdHlTZXJpZXNSb3cgKCkge1xuICAgIHZhciBzZXJpZXNSb3cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjZ19fY29udHJvbHMgY2dfX2NvbnRyb2xzX3N0eWxlX3JvdycpLFxuXG4gICAgc2VyaWVzV3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NnX19jb250cm9sIGNnX19jb250cm9sX3N0eWxlX3JvdycpLFxuICAgIHNlcmllc1NlbGVjdCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLXNlbGVjdGJveCBqcy1zZXJpZXNTZWxlY3QnKS5jc3MoJ21pbi13aWR0aCcsICcxMDBweCcpLFxuXG4gICAgc2Vhc29uV3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NnX19jb250cm9sIGNnX19jb250cm9sX3N0eWxlX3JvdycpLmNzcygnbWF4LXdpZHRoJywgNjApLFxuICAgIHNlYXNvblNlbGVjdCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLXNlbGVjdGJveCBqcy1zZWFzb25TZWxlY3QnKSxcblxuICAgIGVwaXNvZGVXcmFwcGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2wgY2dfX2NvbnRyb2xfc3R5bGVfcm93JyksXG4gICAgZXBpc29kZVNlbGVjdCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLXNlbGVjdGJveCBqcy1lcGlzb2RlU2VsZWN0JykuY3NzKCdtaW4td2lkdGgnLCAnOTBweCcpO1xuXG4gICAgc2VyaWVzV3JhcHBlci5hcHBlbmQoc2VyaWVzU2VsZWN0KTtcbiAgICBzZWFzb25XcmFwcGVyLmFwcGVuZChzZWFzb25TZWxlY3QpO1xuICAgIGVwaXNvZGVXcmFwcGVyLmFwcGVuZChlcGlzb2RlU2VsZWN0KTtcbiAgICBzZXJpZXNSb3cuYXBwZW5kKHNlcmllc1dyYXBwZXIsIHNlYXNvbldyYXBwZXIsIGVwaXNvZGVXcmFwcGVyKTtcblxuICAgIHJldHVybiBzZXJpZXNSb3c7XG4gIH1cblxuICB2YXIgc2VyaWVzUm93ID0gY3JlYXRlRW1wdHlTZXJpZXNSb3coKTtcbiAgc2VjdGlvbi5hcHBlbmQoc2VyaWVzUm93KTtcbiAgdmFyIGFkZGFibGVPYmplY3QgPSBuZXcgQWRkYWJsZShzZXJpZXNSb3csIHtiZWZvcmVBZGQ6IGJlZm9yZUFkZFNlcmllc30pO1xuICBhZGRhYmxlT2JqZWN0LnJlbW92ZUl0ZW0oMCk7XG4gIGFkZGFibGVPYmplY3QuX2FkZEl0ZW0oY3JlYXRlRW1wdHlTZXJpZXNSb3coKSwgYmVmb3JlQWRkU2VyaWVzKTtcblxuICByZXR1cm4gYWRkYWJsZU9iamVjdDtcbn1cblxuXG4vL1N0aWNrYWJsZVxuZnVuY3Rpb24gU3RpY2thYmxlKGVsLCBvcHRpb25zKSB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLl9pbml0KCk7XG59XG5cblN0aWNrYWJsZS5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5ib3VuZGFyeSA9IHNlbGYub3B0aW9ucy5ib3VuZGFyeSA/IHNlbGYub3B0aW9ucy5ib3VuZGFyeSA9PT0gdHJ1ZSA/IHNlbGYuZWwucGFyZW50Tm9kZSA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZi5vcHRpb25zLmJvdW5kYXJ5KSA6IHVuZGVmaW5lZDtcbiAgICBzZWxmLm9mZnNldCA9IHNlbGYub3B0aW9ucy5vZmZzZXQgfHwgMDtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZVNjcm9sbCgpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRSZWN0ID0gc2VsZi5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgIGVsZW1lbnRCb3R0b21PZmZzZXQgPSBlbGVtZW50UmVjdC50b3AgKyBlbGVtZW50UmVjdC5oZWlnaHQ7XG5cblxuICAgICAgICBpZiAoKHNlbGYub3B0aW9ucy5tYXhXaWR0aCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSBzZWxmLm9wdGlvbnMubWF4V2lkdGgpIHx8ICFzZWxmLm9wdGlvbnMubWF4V2lkdGgpIHtcbiAgICAgICAgICAgIGlmICghc2VsZi5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudFJlY3QudG9wIC0gc2VsZi5vcHRpb25zLm9mZnNldCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbGVtZW50T2Zmc2V0UGFyZW50ID0gc2VsZi5lbC5vZmZzZXRQYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW5pdGlhbE9mZnNldCA9IHNlbGYuZWwub2Zmc2V0VG9wO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoc2VsZi5vcHRpb25zLmNsYXNzIHx8ICdpcy1zdHVjaycpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS50b3AgPSBzZWxmLm9mZnNldC50b1N0cmluZygpICsgJ3B4JztcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRPZmZzZXRQYXJlbnRSZWN0ID0gc2VsZi5lbGVtZW50T2Zmc2V0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmJvdW5kYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBib3VuZGFyeVJlY3QgPSBzZWxmLmJvdW5kYXJ5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRhcnlCb3R0b21PZmZzZXQgPSBib3VuZGFyeVJlY3QudG9wICsgYm91bmRhcnlSZWN0LmhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudEJvdHRvbU9mZnNldCA+IGJvdW5kYXJ5Qm90dG9tT2Zmc2V0IHx8IGVsZW1lbnRSZWN0LnRvcCA8IHNlbGYub3B0aW9ucy5vZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUudG9wID0gTWF0aC5yb3VuZChib3VuZGFyeUJvdHRvbU9mZnNldCAtIGVsZW1lbnRSZWN0LmhlaWdodCkudG9TdHJpbmcoKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudFJlY3QudG9wID4gc2VsZi5vZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUudG9wID0gc2VsZi5vZmZzZXQudG9TdHJpbmcoKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub2Zmc2V0IDwgc2VsZi5pbml0aWFsT2Zmc2V0ICsgZWxlbWVudE9mZnNldFBhcmVudFJlY3QudG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS5wb3NpdGlvbiA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnRvcCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlUmVzaXplKCkge1xuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiBzZWxmLm9wdGlvbnMubWF4V2lkdGgpIHtcbiAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUucG9zaXRpb24gPSAnJztcbiAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUudG9wID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoYW5kbGVTY3JvbGwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib3B0aW1pemVkU2Nyb2xsXCIsIGhhbmRsZVNjcm9sbCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvcHRpbWl6ZWRSZXNpemVcIiwgaGFuZGxlUmVzaXplKTtcbn07XG5cbi8vUmVxdWlyZWQgRmllbGRzXG5mdW5jdGlvbiBub3JtYWxpemVSZXF1aXJlZENvdW50KCkge1xuICAgICQoJy5qcy1yZXF1aXJlZENvdW50JykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgdmFyIGNhcmQgPSAkKGVsKS5wYXJlbnRzKCcuY2FyZCcpLFxuICAgICAgICAgICAgY2FyZElkID0gY2FyZC5hdHRyKCdpZCcpLFxuICAgICAgICAgICAgZW1wdHlSZXF1aXJlZEZpZWxkc0NvdW50ID0gY2FyZC5maW5kKCcuanMtcmVxdWlyZWQnKS5sZW5ndGggLSBjYXJkLmZpbmQoJy5qcy1yZXF1aXJlZC5qcy1oYXNWYWx1ZScpLmxlbmd0aCxcbiAgICAgICAgICAgIG5hdkl0ZW0gPSAkKCcuanMtc2Nyb2xsU3B5TmF2IC5qcy1zY3JvbGxOYXZJdGVtW2RhdGEtaHJlZj1cIicgKyBjYXJkSWQgKyAnXCJdJyk7XG5cbiAgICAgICAgaWYgKGVtcHR5UmVxdWlyZWRGaWVsZHNDb3VudCA+IDApIHtcbiAgICAgICAgICAgIG5hdkl0ZW0uYWRkQ2xhc3MoJ2lzLXJlcXVpcmVkJyk7XG4gICAgICAgICAgICAkKGVsKS50ZXh0KGVtcHR5UmVxdWlyZWRGaWVsZHNDb3VudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuYXZJdGVtLnJlbW92ZUNsYXNzKCdpcy1yZXF1aXJlZCcpO1xuICAgICAgICAgICAgJChlbCkudGV4dCgnJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG4vL1BhZ2luYXRpb25cbmZ1bmN0aW9uIFBhZ2luYXRpb24oZWwsIHN0b3JlLCB1cGRhdGVGdW5jdGlvbikge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgdGhpcy51cGRhdGUgPSB1cGRhdGVGdW5jdGlvbjtcblxuICAgIHRoaXMuX2luaXQoKTtcbn1cblxuUGFnaW5hdGlvbi5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmVuZGVyUGFnaW5hdGlvbigpO1xuXG4gICAgZnVuY3Rpb24gaGFuZGxlUGFnZUNsaWNrKGUpIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0LmRhdGFzZXQudGFyZ2V0IHx8IGUudGFyZ2V0LnBhcmVudE5vZGUuZGF0YXNldC50YXJnZXQ7XG4gICAgICAgIHN3aXRjaCAodGFyZ2V0KSB7XG4gICAgICAgICAgICBjYXNlICdwcmV2JzpcbiAgICAgICAgICAgICAgICBzZWxmLnN0b3JlLnNldFBhZ2Uoc2VsZi5zdG9yZS5wYWdlIC0gMSA8IDAgPyAwIDogc2VsZi5zdG9yZS5wYWdlIC0gMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICduZXh0JzpcbiAgICAgICAgICAgICAgICBzZWxmLnN0b3JlLnNldFBhZ2Uoc2VsZi5zdG9yZS5wYWdlICsgMSA9PT0gc2VsZi5zdG9yZS5wYWdlc051bWJlcigpID8gc2VsZi5zdG9yZS5wYWdlc051bWJlcigpIC0gMSA6IHNlbGYuc3RvcmUucGFnZSArIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi51cGRhdGUoJCgnI2xpYnJhcnlCb2R5JyksIHNlbGYuc3RvcmUsIHJlbmRlckNvbnRlbnRSb3cpO1xuICAgICAgICByZW5kZXJQYWdpbmF0aW9uKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyUGFnaW5hdGlvbigpIHtcbiAgICAgICAgdmFyIGxpbmtzID0gJCgnPHVsPjwvdWw+JykuYWRkQ2xhc3MoJ3BhZ2luYXRpb25fX2xpc3QnKTtcbiAgICAgICAgc2VsZi5lbC5lbXB0eSgpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc3RvcmUucGFnZXNOdW1iZXIoKSk7XG5cbiAgICAgICAgaWYgKHNlbGYuc3RvcmUucGFnZXNOdW1iZXIoKSA+IDEpIHtcbiAgICAgICAgICAgIC8vUHJldlxuICAgICAgICAgICAgdmFyIHByZXZMaW5rID0gJCgnPGxpPjxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtbGVmdFwiPjwvaT48L2xpPicpLmFkZENsYXNzKCdwYWdpbmF0aW9uX19wcmV2JykuYXR0cignZGF0YS10YXJnZXQnLCAncHJldicpLmNsaWNrKGhhbmRsZVBhZ2VDbGljayk7XG4gICAgICAgICAgICBpZiAoc2VsZi5zdG9yZS5wYWdlID09PSAwKSB7cHJldkxpbmsuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7fVxuICAgICAgICAgICAgbGlua3MuYXBwZW5kKHByZXZMaW5rKTtcblxuICAgICAgICAgICAgLy9DdXJyZW50IHBhZ2UgaW5kaWNhdG9yXG4gICAgICAgICAgICAvL3ZhciBjdXJyZW50UGFnZSA9ICQoJzxsaT48L2xpPicpLmFkZENsYXNzKCdwYWdpbmF0aW9uX19jdXJyZW50JykudGV4dChzZWxmLnN0b3JlLnBhZ2UgKyAxKTtcbiAgICAgICAgICAgIC8vbGlua3MuYXBwZW5kKGN1cnJlbnRQYWdlKTtcblxuICAgICAgICAgICAgLy9OZXh0XG4gICAgICAgICAgICB2YXIgbmV4dExpbmsgPSAkKCc8bGk+PGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1yaWdodFwiPjwvaT48L2xpPicpLmFkZENsYXNzKCdwYWdpbmF0aW9uX19uZXh0JykuYXR0cignZGF0YS10YXJnZXQnLCAnbmV4dCcpLmNsaWNrKGhhbmRsZVBhZ2VDbGljayk7XG4gICAgICAgICAgICBpZiAoc2VsZi5zdG9yZS5wYWdlID09PSBzZWxmLnN0b3JlLnBhZ2VzTnVtYmVyKCkgLSAxKSB7bmV4dExpbmsuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7fVxuICAgICAgICAgICAgbGlua3MuYXBwZW5kKG5leHRMaW5rKTtcblxuICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmQobGlua3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuZWw7XG4gICAgfVxuXG59O1xuXG4vL1Bvc3RcbmZ1bmN0aW9uIGluaXRQb3N0TGlzdChlbCkge1xuICBlbC5hcHBlbmQocmVuZGVyUG9zdExpc3QoKSk7XG5cbiAgZWwuZmluZCgndGV4dGFyZWEnKS5lbGFzdGljKCk7XG4gIG5vcm1pbGl6ZVNlY3Rpb24oKTtcbn1cblxuLy9SZW5kZXJcbmZ1bmN0aW9uIHJlbmRlclBvc3RMaXN0KCkge1xuICB2YXIgbGlzdCA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnc2VjdGlvbnMtbGlzdCcpLFxuICAgICAgYWRkSWNvbiA9ICQoJzxpIGNsYXNzPVwiZmEgZmEtcGx1cy1jaXJjbGVcIiAvPicpLFxuICAgICAgYWRkVGV4dCA9ICQoJzxzcGFuPiBBZGQgU2VjdGlvbjwvc3Bhbj4nKSxcbiAgICAgIGFkZFNlY3Rpb24gPSAkKCc8YnV0dG9uIC8+JykuYWRkQ2xhc3MoJ2J1dHRvbiBidXR0b25fc3R5bGVfdHJhbnNwYXJlbnQtZ3JheSBzZWN0aW9ucy1saXN0X19hZGQtc2VjdGlvbicpLmNsaWNrKGhhbmRsZUFkZFNlY3Rpb24pLmFwcGVuZChhZGRJY29uLCBhZGRUZXh0KSxcbiAgICAgIHNlY3Rpb24gPSByZW5kZXJTZWN0aW9uKDEpXG5cbiAgcmV0dXJuIGxpc3QuYXBwZW5kKHNlY3Rpb24sIGFkZFNlY3Rpb24pO1xufVxuXG5mdW5jdGlvbiByZW5kZXJTZWN0aW9uKGluZGV4LCBkYXRhKSB7XG4gIHZhciBzZWN0aW9uID0gJCgnPGRpdiAvPicpLmFkZENsYXNzKCdsaXN0X19zZWN0aW9uJyksXG4gICAgICBzZWN0aW9uSW5kZXggPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3NlY3Rpb25fX2luZGV4JykudGV4dCgnU2VjdGlvbiAnICsgaW5kZXgpLFxuICAgICAgc2VjdGlvblJlbW92ZSA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnc2VjdGlvbl9fcmVtb3ZlIGlzLWhpZGRlbicpLmNsaWNrKGhhbmRsZVJlbW92ZVNlY3Rpb24pLFxuICAgICAgc2VjdGlvbkhhbmRsZXIgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3NlY3Rpb25fX2hhbmRsZXInKTtcblxuICByZXR1cm4gc2VjdGlvbi5hcHBlbmQoc2VjdGlvbkhhbmRsZXIsIHNlY3Rpb25JbmRleCwgc2VjdGlvblJlbW92ZSwgcmVuZGVyU2VjdGlvbkNvbnRlbnQoaW5kZXgsIGRhdGEpKVxufVxuXG5mdW5jdGlvbiByZW5kZXJTZWN0aW9uQ29udGVudChpbmRleCwgZGF0YSkge1xuICB2YXIgY29udGVudCA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnc2VjdGlvbl9fY29udGVudCcpLFxuICAgICAgdGl0bGUgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIiAvPicpLFxuICAgICAgZGVzY3JpcHRpb24gPSAkKCc8dGV4dGFyZWEgLz4nKSxcbiAgICAgIHRvZ2dsZUxhYmVsID0gJCgnPGxhYmVsPk1lZGlhIFR5cGU8L2xhYmVsPicpLmFkZENsYXNzKCdjLWxhYmVsIGMtbGFiZWwtLXRvcCcpLFxuICAgICAgdG9nZ2xlSXRlbTEgPSAkKCc8bGkgZGF0YS10YXJnZXQ9XCJsaW5rXCIgZGF0YS1pbmRleD1cIicrIGluZGV4KyAnXCI+RW1iZWRlZCBMaW5rPC9saT4nKS5hZGRDbGFzcygnYWN0aXZlJykuY2xpY2soaGFuZGxlQXNzZXRUb2dnbGUpLFxuICAgICAgdG9nZ2xlSXRlbTIgPSAkKCc8bGkgZGF0YS10YXJnZXQ9XCJmaWxlXCIgZGF0YS1pbmRleD1cIicrIGluZGV4KyAnXCI+QWRkIC8gVXBsb2FkPC9saT4nKS5jbGljayhoYW5kbGVBc3NldFRvZ2dsZSlcbiAgICAgIHRvZ2dsZUdyb3VwID0gJCgnPHVsIGRhdGEtc2VjdGlvbj0nICsgaW5kZXggKyAnPjwvdWw+JykuYWRkQ2xhc3MoJ3JhZGlvVG9nZ2xlJykuYXBwZW5kKHRvZ2dsZUl0ZW0xLCB0b2dnbGVJdGVtMiksXG4gICAgICBsaW5rID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIvPicpLFxuICAgICAgcGxhY2Vob2xkZXIgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3NlY3Rpb25fX3BsYWNlaG9sZGVyJykuYXR0cignZGF0YS1uYW1lJywgJ0ZpbGUnKTtcblxuICBjb250ZW50LmFwcGVuZCh0aXRsZS53cmFwKCc8ZGl2IGNsYXNzPVwiY29udHJvbHNfX2dyb3VwXCI+PC9kaXY+JykucGFyZW50KCksIGRlc2NyaXB0aW9uLndyYXAoJzxkaXYgY2xhc3M9XCJjb250cm9sc19fZ3JvdXBcIj48L2Rpdj4nKS5wYXJlbnQoKSwgdG9nZ2xlTGFiZWwud3JhcCgnPGRpdiBjbGFzcz1cImNvbnRyb2xzX19ncm91cCBjb250cm9sc19fZ3JvdXAtLWFzc2V0LXRvZ2dsZVwiPjwvZGl2PicpLnBhcmVudCgpLmFwcGVuZCh0b2dnbGVHcm91cCksIGxpbmsud3JhcCgnPGRpdiBjbGFzcz1cImNvbnRyb2xzX19ncm91cFwiICBpZD1cInNlY3Rpb25MaW5rJyArIGluZGV4ICsgJ1wiPjwvZGl2PicpLnBhcmVudCgpLCBwbGFjZWhvbGRlci53cmFwKCc8ZGl2IGNsYXNzPVwiY29udHJvbHNfX2dyb3VwIGNvbnRyb2xzX19ncm91cC0tcGxhY2Vob2xkZXIgaGlkZGVuXCIgaWQ9XCJzZWN0aW9uUGxhY2Vob2xkZXInICsgaW5kZXggKyAnXCI+PC9kaXY+JykucGFyZW50KCkpO1xuXG4gIHZhciBzZXRpb25UaXRsZUlucHV0ID0gbmV3IFRleHRmaWVsZCh0aXRsZS5nZXQoMCksIHtcbiAgICBsYWJlbDogJ1NlY3Rpb24gVGl0bGUnXG4gIH0pO1xuICB2YXIgc2V0aW9uRGVzY3JpcHRpb25JbnB1dCA9IG5ldyBUZXh0ZmllbGQoZGVzY3JpcHRpb24uZ2V0KDApLCB7XG4gICAgbGFiZWw6ICdTZWN0aW9uIFRleHQnXG4gIH0pO1xuICBkZXNjcmlwdGlvbi5lbGFzdGljKCk7XG5cbiAgdmFyIHNldGlvbkxpbmtJbnB1dCA9IG5ldyBUZXh0ZmllbGQobGluay5nZXQoMCksIHtcbiAgICBsYWJlbDogJ0VtYmVkZWQgTGluaycsXG4gICAgcGxhY2Vob2xkZXI6ICdodHRwOi8vJ1xuICB9KTtcblxuICBwbGFjZWhvbGRlckNvbnRyb2wgPSBuZXcgSW1hZ2VQbGFjZWhvbGRlcihwbGFjZWhvbGRlci5nZXQoMCksIG51bGwsIHthbEJ1dHRvbjogJ0FkZCBGaWxlJ30pXG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cblxuLy9IYW5kbGVyXG5mdW5jdGlvbiBoYW5kbGVBZGRTZWN0aW9uKGUpIHtcbiAgdmFyIGluZGV4ID0gJChlLnRhcmdldCkucGFyZW50cygnLnNlY3Rpb25zLWxpc3QnKS5maW5kKCcubGlzdF9fc2VjdGlvbicpLmxlbmd0aCArIDE7XG4gIHZhciBzZWN0aW9uID0gcmVuZGVyU2VjdGlvbihpbmRleCk7XG4gICQoZS50YXJnZXQpLmJlZm9yZShzZWN0aW9uKTtcbiAgc2VjdGlvbi5maW5kKCd0ZXh0YXJlYScpLmVsYXN0aWMoKTtcbiAgbm9ybWlsaXplU2VjdGlvbigpO1xuXG59XG5mdW5jdGlvbiBoYW5kbGVSZW1vdmVTZWN0aW9uKGUpIHtcbiAgJChlLnRhcmdldCkucGFyZW50KCcubGlzdF9fc2VjdGlvbicpLnJlbW92ZSgpO1xuICBub3JtaWxpemVTZWN0aW9uKCk7XG59XG5mdW5jdGlvbiBub3JtaWxpemVTZWN0aW9uKCkge1xuICB2YXIgbGVuZ3RoID0gJCgnLmxpc3RfX3NlY3Rpb24nKS5sZW5ndGg7XG4gIGlmIChsZW5ndGggPj0gMikge1xuICAgICQoJy5zZWN0aW9uX19yZW1vdmUnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJylcbiAgfSBlbHNlIHtcbiAgICAkKCcuc2VjdGlvbl9fcmVtb3ZlJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpXG4gIH1cbiAgJCgnLmxpc3RfX3NlY3Rpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICQoZWwpLmZpbmQoJy5zZWN0aW9uX19pbmRleCcpLnRleHQoJ1NlY3Rpb24gJyArIE1hdGgucm91bmQoaW5kZXggKyAxKSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gaGFuZGxlQXNzZXRUb2dnbGUoZSkge1xuICAkKGUudGFyZ2V0KS5wYXJlbnQoKS5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICBzd2l0Y2ggKGUudGFyZ2V0LmRhdGFzZXQudGFyZ2V0KSB7XG4gICAgY2FzZSAnbGluayc6XG4gICAgICAkKCcjc2VjdGlvbkxpbmsnKyBlLnRhcmdldC5kYXRhc2V0LmluZGV4KS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAkKCcjc2VjdGlvblBsYWNlaG9sZGVyJysgZS50YXJnZXQuZGF0YXNldC5pbmRleCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdmaWxlJzpcbiAgICAgICQoJyNzZWN0aW9uTGluaycrIGUudGFyZ2V0LmRhdGFzZXQuaW5kZXgpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICQoJyNzZWN0aW9uUGxhY2Vob2xkZXInKyBlLnRhcmdldC5kYXRhc2V0LmluZGV4KS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICBicmVhaztcbiAgfVxufVxuLy9QYWdlXG5mdW5jdGlvbiBpbml0UGFnZUxpc3QoZWwpIHtcbiAgZWwuYXBwZW5kKHJlbmRlclBhZ2VMaXN0KCkpO1xuXG4gIGVsLmZpbmQoJ3RleHRhcmVhJykuZWxhc3RpYygpO1xuICBub3JtaWxpemVTZWN0aW9uKCk7XG59XG5cbi8vUmVuZGVyXG5mdW5jdGlvbiByZW5kZXJQYWdlTGlzdCgpIHtcbiAgdmFyIGxpc3QgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3NlY3Rpb25zLWxpc3QnKSxcbiAgICAgIGFkZEljb24gPSAkKCc8aSBjbGFzcz1cImZhIGZhLXBsdXMtY2lyY2xlXCIgLz4nKSxcbiAgICAgIGFkZFRleHQgPSAkKCc8c3Bhbj4gQWRkIFNlY3Rpb248L3NwYW4+JyksXG4gICAgICBhZGRTZWN0aW9uID0gJCgnPGJ1dHRvbiAvPicpLmFkZENsYXNzKCdidXR0b24gYnV0dG9uX3N0eWxlX3RyYW5zcGFyZW50LWdyYXkgc2VjdGlvbnMtbGlzdF9fYWRkLXNlY3Rpb24nKS5jbGljayhoYW5kbGVBZGRQYWdlU2VjdGlvbikuYXBwZW5kKGFkZEljb24sIGFkZFRleHQpLFxuICAgICAgc2VjdGlvbiA9IHJlbmRlclBhZ2VTZWN0aW9uKDEpXG5cbiAgcmV0dXJuIGxpc3QuYXBwZW5kKHNlY3Rpb24sIGFkZFNlY3Rpb24pO1xufVxuXG5mdW5jdGlvbiByZW5kZXJQYWdlU2VjdGlvbihpbmRleCwgZGF0YSkge1xuICB2YXIgc2VjdGlvbiA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnbGlzdF9fc2VjdGlvbicpLFxuICAgICAgc2VjdGlvbkluZGV4ID0gJCgnPGRpdiAvPicpLmFkZENsYXNzKCdzZWN0aW9uX19pbmRleCcpLnRleHQoJ1NlY3Rpb24gJyArIGluZGV4KSxcbiAgICAgIHNlY3Rpb25SZW1vdmUgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3NlY3Rpb25fX3JlbW92ZSBpcy1oaWRkZW4nKS5jbGljayhoYW5kbGVSZW1vdmVQYWdlU2VjdGlvbiksXG4gICAgICBzZWN0aW9uSGFuZGxlciA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnc2VjdGlvbl9faGFuZGxlcicpO1xuXG4gIHJldHVybiBzZWN0aW9uLmFwcGVuZChzZWN0aW9uSGFuZGxlciwgc2VjdGlvbkluZGV4LCBzZWN0aW9uUmVtb3ZlLCByZW5kZXJQYWdlU2VjdGlvbkNvbnRlbnQoaW5kZXgsIGRhdGEpKVxufVxuXG5mdW5jdGlvbiByZW5kZXJQYWdlU2VjdGlvbkNvbnRlbnQoaW5kZXgsIGRhdGEpIHtcbiAgdmFyIGNvbnRlbnQgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3NlY3Rpb25fX2NvbnRlbnQnKSxcbiAgICAgIHRpdGxlID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgLz4nKSxcbiAgICAgIGRlc2NyaXB0aW9uID0gJCgnPHRleHRhcmVhIC8+Jyk7XG5cbiAgY29udGVudC5hcHBlbmQodGl0bGUud3JhcCgnPGRpdiBjbGFzcz1cImNvbnRyb2xzX19ncm91cFwiPjwvZGl2PicpLnBhcmVudCgpLCBkZXNjcmlwdGlvbi53cmFwKCc8ZGl2IGNsYXNzPVwiY29udHJvbHNfX2dyb3VwXCI+PC9kaXY+JykucGFyZW50KCkpO1xuXG4gIHZhciBzZXRpb25UaXRsZUlucHV0ID0gbmV3IFRleHRmaWVsZCh0aXRsZS5nZXQoMCksIHtcbiAgICBsYWJlbDogJ1NlY3Rpb24gVGl0bGUnXG4gIH0pO1xuICB2YXIgc2V0aW9uRGVzY3JpcHRpb25JbnB1dCA9IG5ldyBUZXh0ZmllbGQoZGVzY3JpcHRpb24uZ2V0KDApLCB7XG4gICAgbGFiZWw6ICdTZWN0aW9uIFRleHQnXG4gIH0pO1xuICBkZXNjcmlwdGlvbi5lbGFzdGljKCk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cblxuLy9IYW5kbGVyXG5mdW5jdGlvbiBoYW5kbGVBZGRQYWdlU2VjdGlvbihlKSB7XG4gIHZhciBpbmRleCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5zZWN0aW9ucy1saXN0JykuZmluZCgnLmxpc3RfX3NlY3Rpb24nKS5sZW5ndGggKyAxO1xuICB2YXIgc2VjdGlvbiA9IHJlbmRlclBhZ2VTZWN0aW9uKGluZGV4KTtcbiAgJChlLnRhcmdldCkuYmVmb3JlKHNlY3Rpb24pO1xuICBzZWN0aW9uLmZpbmQoJ3RleHRhcmVhJykuZWxhc3RpYygpO1xuICBub3JtaWxpemVTZWN0aW9uKCk7XG5cbn1cbmZ1bmN0aW9uIGhhbmRsZVJlbW92ZVBhZ2VTZWN0aW9uKGUpIHtcbiAgJChlLnRhcmdldCkucGFyZW50KCcubGlzdF9fc2VjdGlvbicpLnJlbW92ZSgpO1xuICBub3JtaWxpemVTZWN0aW9uKCk7XG59XG5mdW5jdGlvbiBub3JtaWxpemVTZWN0aW9uKCkge1xuICB2YXIgbGVuZ3RoID0gJCgnLmxpc3RfX3NlY3Rpb24nKS5sZW5ndGg7XG4gIGlmIChsZW5ndGggPj0gMikge1xuICAgICQoJy5zZWN0aW9uX19yZW1vdmUnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJylcbiAgfSBlbHNlIHtcbiAgICAkKCcuc2VjdGlvbl9fcmVtb3ZlJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpXG4gIH1cbiAgJCgnLmxpc3RfX3NlY3Rpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICQoZWwpLmZpbmQoJy5zZWN0aW9uX19pbmRleCcpLnRleHQoJ1NlY3Rpb24gJyArIE1hdGgucm91bmQoaW5kZXggKyAxKSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gaGFuZGxlQXNzZXRUb2dnbGUoZSkge1xuICAkKGUudGFyZ2V0KS5wYXJlbnQoKS5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICBzd2l0Y2ggKGUudGFyZ2V0LmRhdGFzZXQudGFyZ2V0KSB7XG4gICAgY2FzZSAnbGluayc6XG4gICAgICAkKCcjc2VjdGlvbkxpbmsnKyBlLnRhcmdldC5kYXRhc2V0LmluZGV4KS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAkKCcjc2VjdGlvblBsYWNlaG9sZGVyJysgZS50YXJnZXQuZGF0YXNldC5pbmRleCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdmaWxlJzpcbiAgICAgICQoJyNzZWN0aW9uTGluaycrIGUudGFyZ2V0LmRhdGFzZXQuaW5kZXgpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICQoJyNzZWN0aW9uUGxhY2Vob2xkZXInKyBlLnRhcmdldC5kYXRhc2V0LmluZGV4KS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICBicmVhaztcbiAgfVxufVxuXG4vL0dsb2JhbCB2YXJpYWJsZXNcbnZhciBlZGl0ZWRGaWxlc0RhdGEgPSBbXSxcbmVkaXRlZEZpbGVEYXRhID0ge30sXG5jbGFzc0xpc3QgPSBbXSxcbmRhdGFDaGFuZ2VkID0gZmFsc2UsIC8vQ2hhbmdlcyB3aGVuIHVzZXIgbWFrZSBhbnkgY2hhbmdlcyBvbiBlZGl0IHNjcmVlbjtcbmxhc3RTZWxlY3RlZCA9IG51bGwsIC8vSW5kZXggb2YgbGFzdCBTZWxlY3RlZCBlbGVtZW50IGZvciBtdWx0aSBzZWxlY3Q7XG5nYWxsZXJ5T2JqZWN0cyA9IFtdLFxuZHJhZnRJc1NhdmVkID0gZmFsc2U7Il0sImZpbGUiOiJjb21tb24uanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
