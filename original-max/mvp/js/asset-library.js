//Common js files
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
			$('#filePreview').addClass('preview--image').removeClass('preview--video');
			//Hide video related elements
			$('#videoPlay').addClass('hidden');
			$('#videoMetadata').addClass('hidden');

			//Show all image related elements
			$('#previewControls').removeClass('hidden');
			$('#imageMetadata').removeClass('hidden');
			//$('#focalPoint').removeClass('hidden');
			//$('#focalRect').removeClass('hidden');

			//If it is not bulk edit set preview image and adjust focal point and rectangle;
			if (!file.bulkEdit) {
				$('#previewImg').attr('src', fileData.url);
				$('.pr .purpose-img').css("background-image", 'url(' + fileData.url + ')');
				adjustFocalPoint(fileData.focalPoint);
				adjustFocalRect(fileData.focalPoint);
			}

			//set Title
			adjustTitle(fileData.title);
			adjustCaption(fileData.caption);
			adjustDescription(fileData.description);
			adjustResolution(fileData.highResolution);
			adjustAltText(fileData.altText);

			break;

		case 'video':
			$('#filePreview').addClass('preview--video').removeClass('preview--image');
			//Hide all image related elements
			$('#previewControls').addClass('hidden');
			$('#imageMetadata').addClass('hidden');
			$('#focalPoint').addClass('hidden');
			$('#focalRect').addClass('hidden');

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
	//document.getElementById('title').dispatchEvent(event);
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
	//document.getElementById('caption').dispatchEvent(event);
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
	//document.getElementById('description').dispatchEvent(event);
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
	//document.getElementById('altText').dispatchEvent(event);
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

//Function to set FocalPoint coordinates or, save focal point if focalpoint argument empty
function adjustFocalPoint(focalPoint) {
	var fp = $('#focalPoint');
	var img = $('#previewImg');
	if (focalPoint) {
		var left = focalPoint.left * img.width() - fp.width()/2,
		top = focalPoint.top * img.height() - fp.height()/2;

		left = left <= 0 ? '50%' : left;
		top = top <= 0 ? '50%' : top;
		fp.css('left', left).css('top', top);
	} else {
		editedFileData.fileData.focalPoint = {
			left: ((fp.position().left + fp.width()/2)/img.width()),
			top: ((fp.position().top + fp.height()/2)/img.height())
		};
	}
	fp.css('position', 'absolute');
}

//Function to set FocalRect coordinates or, save focal rect if focalpoint argument empty
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
					color: '',
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
	$('.preview__image-wrapper').removeClass('is-slidingLeft is-slidingRight');
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

	currentImage.removeClass('is-active');
	image.addClass('is-active');

	if (currentIndex > newIndex) {
		$('.preview__image-wrapper').addClass('is-slidingLeft');
	} else {
		$('.preview__image-wrapper').addClass('is-slidingRight');
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

	//Close all previews if there is open
	hideAllPreviews();
	// Adjust focal rectangle
	adjustRect($('.purposes__container .purpose-img').first());
	$('#purposeWrapper').animate( { scrollLeft: '0' }, 800);
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

	// Use dataChanged to check if any data has changed and show the modal. Currently
	// the value is not being set corrently so we are always showing the dialog.
	//if (dataChanged) {
	if (true) {
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

function hideAllPreviews() {
  $('#purposes').removeClass('is-open');
  $('#purposes').addClass('is-hidden');
  $('#previewImage').removeClass('hidden');
  $('#previewControls').removeClass('hidden');

  //Change button text, icon and click handler
  $('#showPreview').off('click', hideAllPreviews).click(showAllPreviews);
  $('#showPreview span').text('View All');
  $('#showPreview i').removeClass('fa-arrow-down').addClass('fa-arrow-up');
}

function showAllPreviews() {
  $('#purposes').addClass('is-open');
  $('#purposes').removeClass('is-hidden');
  $('#previewImage').addClass('hidden');
  $('#previewControls').addClass('hidden');

  //Change button text, icon and click handler
  $('#showPreview').off('click', showAllPreviews).click(hideAllPreviews);
  $('#showPreview span').text('Collapse');
  $('#showPreview i').removeClass('fa-arrow-up').addClass('fa-arrow-down');

  // Adjust previews click finction
  $('.purposes__container .purpose.is-active').removeClass('is-active');
  $('.purposes__container .purpose-img').unbind().click(function(e) {
    hideAllPreviews();
    adjustRect($(e.target));
		// Scroll previews to the selected one
		var previewIndex = $(e.target).parents('.purpose').index('.purposes__container .purpose');
		$('#purposeWrapper').animate( { scrollLeft: previewIndex * 100 }, 600);
  });

  //Check if it is a mobile screen
  if (window.innerWidth < 650) {
    $("#purposes .purposes__container .purpose").addClass('hidden');
    $("#purposes .purposes__container .purpose.hidden").slice(0, 5).removeClass('hidden');
    $('#loadMore').removeClass('hidden');
  }
  //$('.preview.focal').addClass('full').removeClass('line');
  //$('#purposeToggle').children('span').text('Hide Preview');
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
function handleFiles(files, callback) {
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
		Promise.all(uploadedFiles).then(function(res) {
			if (callback !== undefined) {
				callback(galleryObjects);
			}
			else {
				updateGallery(galleryObjects.length);
			}
		});
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
function handleUploadFilesClick(e, callback) {
	var filesInput = document.getElementById("filesInput");
    if (!filesInput) {
    	filesInput = document.createElement("input");
        filesInput.type = "file";
        filesInput.multiple = "true";
        filesInput.hidden = true;
        filesInput.accept = "image/*, audio/*, video/*";
        filesInput.id = "filesInput";
        filesInput.addEventListener("change", function(e) {
               handleFiles(e.target.files, callback);
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
    title: 'Trailer E03',
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
    type: 'video'
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
    dateCreated: new Date(2016, 1, 14),
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
  },

  {
    url: 'img/real/slasher-e1-3.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'slasher-e6.jpg',
    dateCreated: new Date(2016, 1, 14),
    color: '#BFC9A2',
    title: 'slasher-e6.jpg',
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
  },
  {
    url: 'img/content/listicle-img-3.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'listicle-img-3.jpg',
    dateCreated: new Date(2016, 1, 14),
    color: '#BFC9A2',
    title: 'Mr._Robot_S1_Ep03_Choices_clip',
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
    type: 'video'
  },
  {
    url: 'img/content/listicle-img-2.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'listicle-img-2.jpg',
    dateCreated: new Date(2016, 1, 14),
    color: '#BFC9A2',
    title: 'Mr._Robot_S1_Ep04_Withdrawl_clip',
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
    type: 'video'
  },
  {
    url: 'img/content/listicle-img-1.jpg',
    focalPoint: {
      left: 0.5,
      top: 0.5
    },
    id: 'listicle-img-1.jpg',
    dateCreated: new Date(2016, 1, 14),
    color: '#BFC9A2',
    title: 'Mr._Robot_S1_Ep06_Shaylas_Fate_clip',
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
    type: 'video'
  }    

  /*,
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = assetLibraryObjects;
}
function createAssetLibraryFile(fileData) {
  //Helper
  function fileTypeElement(fileData) {
    switch (fileData.type) {
      case 'image':
      return $('<div><i class="fa fa-camera"></i></div>').addClass('file__type');

      case 'video':
      return $('<div><i class="fa fa-video-camera"></i></div>').addClass('file__type');

      default:
      return $('<div></div>').addClass('file__type');
    }
  }

  //create basic element
  var file = $('<div></div>').addClass('file file--modal file_type_img file_view_grid'),
  fileIndex = $('<div></div>').addClass('hidden file__id').text(fileData.id),

  fileImg = $('<div></div>').addClass('file__img').css('background-image', 'url(' + fileData.url + ')'),
  fileControls = $('<div></div>').addClass('file__controls').click(toggleFileSelect),
  fileCheckmark = $('<div></div>').addClass('file__checkmark').click(toggleFileSelect),
  fileTitle = $('<div></div>').addClass('file__title').text(fileData.title);

  fileControls.append(fileCheckmark, fileTypeElement(fileData));
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
	elBackgroundPosition = el.css('background-position') ? el.css('background-position').split(' ') : ['50%', '50%'];

	rHeight = imgRatio > elRatio ? imgHeight : imgWidth/elRatio;
	rWidth = imgRatio > elRatio ? imgHeight * elRatio : imgWidth;
	rOffset = {left: 0, top: 0};

	if (elBackgroundPosition.length === 2) {
		if (elBackgroundPosition[0].indexOf('%')) {
			var bgLeftPersent = elBackgroundPosition[0].slice(0,-1),
			bgLeftPixel = Math.round(imgWidth * bgLeftPersent/100) - rWidth/2;

			if ((bgLeftPixel) < 0) {bgLeftPixel = 0;}
			if ((bgLeftPixel + rWidth) > imgWidth) {bgLeftPixel = imgWidth - rWidth;}

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

	$('#focalRect').removeAttr('style');

	$('#focalRect').css('width', rWidth.toString() + 'px')
	.css('height', rHeight.toString() + 'px')
	.css('left', rOffset.left.toString() + 'px')
	.css('top', rOffset.top.toString() + 'px')
	.draggable({
		axis: imgRatio > elRatio ? 'x' : 'y',
		containment: "#previewImg",
		start: function(e, ui) {
			el.css('transition', 'none');
		},
		stop: function(e, ui) {
			el.css('transition', '0.3s ease-out');
			adjustPurpose($(e.target), el);
		}
	});

	$('.purposes__container .purpose.is-active').removeClass('is-active');
	el.parent().addClass('is-active');
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

	if (purposeImg) {
		purposeImg.css('background-position', fLeft.toString() + '% ' + fTop.toString() + '%');
	}
	else {
		$('.purposes__container .purpose .purpose-img').css('background-position', fLeft.toString() + '% ' + fTop.toString() + '%');
	}
}

/*$('#focalRectToggle').click(function(e) {
	if ($(e.target).hasClass('active')) {
		$('.pr > .preview').removeClass('focal line rect');
		$(e.target).removeClass('active');
	} else {
		$('.pr > .preview').addClass('focal line rect');
		$('.pr > .preview').removeClass('point');
		$('#focalPointToggle').removeClass('active');
		$(e.target).addClass('active');

		//$('.focalRect').resizable({handles: "all", containment: "#previewImg"});
		adjustRect($('.purposes__container .purpose-img').first());
		$('#focalRect').draggable({ containment: "#previewImg", scroll: false });

		$('.purposes__container .purpose-img').unbind().click(function(e) {
			adjustRect($(e.target));
		});
		//$('.img-wrapper').css('max-width', '90%');
		setPurposePagination();
	}
});*/

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
                    if (item.item) {
                        var elBCR = item.item.getBoundingClientRect();
                        return elBCR.top > self.options.offset && elBCR.top < window.innerHeight / 2;
                    }
                    else {
                        return null;
                    }
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

//-------------------------------------------------------------------//
// Controls
//-------------------------------------------------------------------//
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
    var index, length;
    switch (e.keyCode) {
      case 13:
        e.stopPropagation();
        if (self.list && self.list.find('.is-hightlighted').length > 0) {
          selectItem(self.list.find('.is-hightlighted').get(0));
        }
        else {closeAutocomplete();  }
        break;

      case 27:
        e.stopPropagation();
        closeAutocomplete();
        break;

      case 38:
        e.stopPropagation();
        if (self.list && self.list.find('.is-hightlighted').length > 0) {
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
        e.stopPropagation();
        if (self.list && self.list.find('.is-hightlighted').length > 0) {
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
    list.find('.autocomplete__item').first().addClass('is-hightlighted');
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
    data.forEach(function(item, i) {
      list.append(renderAutocompleteItem(item, callback));
    });
    list.find('.autocomplete__item').first().addClass('is-hightlighted');
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
  return;
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
        this.options.unselect = this.options.unselect !== -1 ? '— None —' : this.options.unselect;

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
                console.log("selecting item");
                console.log(self.el);
                self.activeItem = item.dataset.index;
                self.el.classList.add('selectbox_state_not-empty', 'js-hasValue');
            }
            self._toggleAddable();
            closeList();
            normalizeRequiredCount();
            /*
            if (self.options.onSelect) {
                var text = item.childNodes[0].nodeValue;
                var index = item.dataset.index;
                self.options.onSelect(text, index, self);
            }
            */

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

//Addable Fields
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
            var wrapper = self._addItem(self.originalEl.clone(true, true), self.options? self.options.beforeAdd : null);

            //Initialise React components on the new row, if there are any
            window.mountComponents(wrapper[0]);
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
  if (this.options.name) {
    this.title = document.createElement('div');
    this.title.classList.add('c-ImagePlaceholder-title');
    this.title.innerHTML = this.options.name;
    this.wrapper.appendChild(this.title);
  }

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

var scrollPosition, singleselect;

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
    this.wrapper.classList.add('js-hasValue');
    this.image.style.backgroundImage = 'url(' + this.file.fileData.url + ')';
    this.fileName.innerHTML = this.file.fileData.title;
    this.type = this.file.fileData.type;
  }
  else {
    this.wrapper.classList.add('is-empty');
    this.wrapper.classList.remove('js-hasValue');
    this.image.style.backgroundImage = 'none';
    this.fileName.innerHTML = '';
    this.type = undefined;
  }
  if (this.options.onUpdate) {
    this.options.onUpdate(this);
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImagePlaceholder;
}

//ComplexSelect
//;(function(window) {
    //'use strict';

    function ComplexSelectbox(el, options) {
        this.el = el;
        this.options = options;


        this._init();
        this._initEvents();
    }

    ComplexSelectbox.prototype._init = function() {
        this.customValue = "";
        this.activeItem = this.options.items.indexOf(this.options.selectedItem);
        this.options.unselect = this.options.unselect === true ? '— None —' : this.options.unselect;

        this.selectWrapper = document.createElement('div');
        this.selectWrapper.classList.add('select__wrapper');
        this.el.parentNode.insertBefore(this.selectWrapper, this.el);
        this.selectWrapper.appendChild(this.el);
        this.el.classList.remove('js-selectbox');
        this.el.classList.add('selectbox__field', 'selectbox__field--complex');


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

    ComplexSelectbox.prototype._initEvents = function() {
        var self = this;

        //Close list helper
        function closeList() {
            var inputValue;
            self.el.classList.remove('selectbox_state_open');
            if (self.list) {
                self.selectWrapper.removeChild(self.list);
                self.list = undefined;
            }
            if (self.searchField && self.searchField.parentNode === self.el) {
                inputValue = self.searchField.value;
                self.el.removeChild(self.searchField);
            }
            if (self.inputField && self.inputField.parentNode === self.el) {
                inputValue = self.inputField.value;
                self.el.removeChild(self.inputField);
            }
            if (self.activeItem >= 0) {
                self.el.innerHTML = self.options.items[self.activeItem];
            }
            else if (self.options.allowCustom === true) {
                self.el.innerHTML = self.customValue;
            }
            else {
                self.el.innerHTML = '';
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

            if (self.options.unselect && !searchText) {
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
                            self.searchField.placeholder = '';
                            self.searchField.addEventListener('input', handleSearchFieldInput);
                            self.searchField.addEventListener('keydown', handleKeyDown);
                            self.searchField.addEventListener('keyup', handleKeyUp);
                        } else {
                            self.el.addEventListener('keyup', handleKeyUp);
                            self.el.addEventListener('keyup', handleKeyUp);
                        }
                        self.el.innerHTML = '';
                        self.el.appendChild(self.searchField);2

                        if (self.activeItem >= 0) {
                            console.log("The active item", self.options.items[self.activeItem]);
                            self.searchField.value = self.options.items[self.activeItem].nodeValue;
                        }

                        else if (self.options.allowCustom) {
                            self.searchField.value = self.customValue;
                        }
                        else {
                            self.searchField.value = "";
                        }
                        self.searchField.focus();
                    } else {
                        self.inputField = document.createElement('input');
                        self.inputField.type = 'text';
                        self.inputField.style.opacity = 0;
                        self.inputField.style.position = 'absolute';
                        //self.searchField.addEventListener('input', handleSearchFieldInput);
                        self.inputField.addEventListener('keydown', handleKeyDown);
                        self.inputField.addEventListener('keyup', handleKeyUp);
                        self.el.appendChild(self.inputField);
                        self.inputField.focus();
                    }
                    self.el.classList.add('selectbox_state_open');
                    //createList(self.options.items, self.activeItem);
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

        function handleKeyUp(e) {
            // Records the custom value
            e.stopPropagation();
            self.customValue = self.searchField.value;
            console.log(self.customValue);
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

    ComplexSelectbox.prototype._toggleAddable = function() {
        if ($(this.el).parents('.js-addableWrapper').length > 0) {
            if ($(this.el).hasClass('js-hasValue')) {
                $(this.el).parents('.js-addableWrapper').addClass('js-hasValue');
            } else {
                $(this.el).parents('.js-addableWrapper').removeClass('js-hasValue');
            }
        }
    };

    ComplexSelectbox.prototype.clear = function() {
        this.el.classList.remove('selectbox_state_not-empty', 'js-hasValue');
        this.el.innerHTML = '';
        this.activeItem = -1;
    };

    /*function initComplexSelectboxes() {
        [].slice.call(document.querySelectorAll('.js-complexComplexSelectbox')).forEach(function(el) {
            new ComplexSelectbox(el, {
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

    initComplexSelectboxes();*/


//})(window);

/*
 * Initializations
 */

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



//Global variables
var editedFilesData = [],
editedFileData = {},
classList = [],
dataChanged = false, //Changes when user make any changes on edit screen;
lastSelected = null, //Index of last Selected element for multi select;
galleryObjects = [],
draftIsSaved = false,
disabledItems = [];

//New Gallery files
// Create DOM element for File from data
function createFileElement(f) {
  var fileData = f.fileData;

  //create basic element
  var file = $('<div></div>').addClass(fileClass(fileData)),
  fileIndex = $('<div></div>').addClass('hidden file__id').text(fileData.id),

  fileImg = $('<div></div>')
  .addClass('file__img')
  .css('background-image', 'url(' + fileData.url + ')'),
  fileControls = $('<div></div>').addClass('file__controls').click(toggleFileSelect),
  fileCheckmark = $('<div></div>').addClass('file__checkmark').click(toggleFileSelect),
  fileEdit = $('<button>Edit</button>').addClass('button button_style_outline-white').click(handleFiledEditButtonClick),
  fileProgressbar = $('<div></div>').addClass('c-File-progressBar hidden'),
  fileProgressbarLoaded = $('<div></div>').addClass('c-File-progressBar-loader'),

  fileTitle = $('<div></div>').addClass('file__title file__title_main').text(fileData.title),

  fileEditButton = $('<button>Edit</button>').addClass('button button_style_outline-gray u-visible-xs u-noMargin').click(handleFiledEditButtonClick);


  fileProgressbar.append(fileProgressbarLoaded);
  fileControls.append(fileCheckmark, fileTypeElement(fileData), fileEdit, fileProgressbar);
  fileImg.append(fileControls);

  file.append(fileIndex, fileImg, fileTitle, fileEditButton);

  return file;
}

function addFile(file) {
  var assetsLibrarySection = $('.files #assets'),
  justUploadedSection = $('.files #justUploaded');

  if (justUploadedSection.length === 0 && file.hasClass('justUploaded')) {
    justUploadedSection = $('<div></div>').addClass('section').attr('id', 'justUploaded');
    var sectionTitle = $('<div></div>').addClass('section__title'),
    sectionTitleText = $('<span></span>').addClass('section__title-text').text('Just Uploaded'),
    sectionFiles = $('<div></div>').addClass('section__files section__files_view_grid');

    sectionTitle.append(sectionTitleText);
    justUploadedSection.append(sectionTitle, sectionFiles);

    justUploadedSection.insertBefore(assetsLibrarySection);
  }

  if (file.hasClass('justUploaded')) {
    justUploadedSection.find('.section__files').append(file);
  }
  else {assetsLibrarySection.find('.section__files').append(file);}
  if (file.hasClass('js-loading')) {
    file.find('.c-File-progressBar').removeClass('hidden');
    file.find('.c-File-progressBar .c-File-progressBar-loader').animate({width: "100%"},
    2300,
    'linear',
    function() {this.parentNode.classList.add('hidden');}
  );
}
}

function updateGallery(scrollIndex) {
  var justUploaded = false;
  singleselect = false;

  // Remember position and selection of files
  $('.js-content .files .file').each(function(index, el) {
    var file = galleryObjects.filter(function(f) {
      return f.fileData.id === $(el).find('.file__id').text();
    })[0];
    if (file) {
      file.position = index;
      file.selected = $(el).hasClass('selected');
      file.justUploaded = $(el).hasClass('justUploaded');
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
      //f.justUploaded = false;
      justUploaded = true;
    }
    if (f.loading) {
      file.addClass('js-loading');
      f.loading = false;
    }
    addFile(file);
  }

  normalizeSelecteion();

  if (scrollIndex) {
    var scrollTop = $('.js-content .files #justUploaded').last().offset().top - 200;
    console.log(scrollTop);
    $('body').animate({
      scrollTop: scrollTop
    }, 400);
  }
}

function initGallery() {
  assetLibraryObjects.forEach(function(file) {
    galleryObjects.push({
      fileData: file,
      selected: false,
      position: 1000,
      caption: '',
      galleryCaption: false,
      justUploaded: false
    });
  });
  updateGallery();
}

/*
* Helpers functions
*/
function fileClass(fileData) {
  switch (fileData.type) {
    case 'image':
    return 'file file_view_grid js-imgFileType';

    case 'video':
    return 'file file_view_grid js-videoFileType';

    default:
    return 'file file_view_grid';
  }
}
function fileTypeElement(fileData) {
  switch (fileData.type) {
    case 'image':
    return $('<div><i class="fa fa-camera"></i></div>').addClass('file__type');

    case 'video':
    return $('<div><i class="fa fa-video-camera"></i></div>').addClass('file__type');

    default:
    return $('<div></div>').addClass('file__type');
  }
}


$(document).ready(function() {
  //Common init functions
  var scrollPosition;
  var startDate = new Date();
  
  //Sticky scrollbar
  stickyTopbar = new StickyTopbar();
  
  //Normalizers
  normilizeMenu();
  normalizeRequiredCount();
  normalizeSelecteion();
  
  $('.js-content .files .section__files').disableSelection();
  
  //Check for required fields
  $('label.requiered').parent().children('input').on('blur', function(e) {
    if (checkField(e.target)) {
      markFieldAsNormal(e.target);
    } else {
      markFieldAsRequired(e.target);
    }
  });
  
  
  //Click on logo
  $('.js-logo').click(handleLogoClick);
  function handleLogoClick(e) {
    if (window.location.href.indexOf('create') >= 0 &&
    !draftIsSaved &&
    $('.js-content .file, .js-content .js-hasValue').length > 0) {
      new Modal({
        title: 'Leave Page?',
        text: 'You will lose all unsaved changes. Are you sure you want to leave this page?',
        confirmText: 'Leave Page',
        confirmAction: function() {
          window.location.href = 'dashboard.html';
        }
      });
    } else {
      window.location.href = 'dashboard.html';
    }
  }
  
  //Asset Library
  
  $('#alCloseButton').click(closeAssetLibrary);
  $('#alTopCloseButton').click(closeAssetLibrary);
  $('#assetLibrary').click(function(e) {
    openAssetLibrary(e);
  });
  
  function openAssetLibrary(e, options) {
    scrollPosition = $('body').scrollTop();
    updateAssetLibrary();
    $('#al').removeClass('hidden');
    $('#al').addClass('modal');
    $('#wrapper').addClass('overflow');
    singleselect = false;
    $('#addFromALButton').text('Add Files');
  
    $('#addFromALButton').click(addFilesFromAssetLibrary);
    setModalKeyboardActions(addFilesFromAssetLibrary, closeAssetLibrary);
    $(e.target).blur();
  }
  
  function addFilesFromAssetLibrary(){
    lastSelected = null;
    addSelectedFiles();
    closeAssetLibrary();
    document.removeEventListener('keydown', handleEscKeydown);
    document.removeEventListener('keydown', handleEnterKeydown);
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
  
  window.openAssetLibrary = openAssetLibrary;
  
  $('#al').click(function(e) {
    $('#al .files .file.selected').removeClass('selected');
  });
  $('#al .files .section__files').disableSelection();
  
  //Upload files
  $('#uploadFiles').click(handleUploadFilesClick);
  document.addEventListener('dragenter', handleDragEnter, true);
  document.addEventListener('dragover', handleDragOver, false);
  document.addEventListener('drop', handleDrop, false);
  
  //Draft function: Save, Cancel, Publish
  function saveDraft() {
    showNotification('The draft is saved.');
    draftIsSaved = true;
  }
  function removeDraft() {
    new Modal({
      title: 'Cancel this Draft?',
      text: 'Are you sure you want to cancel and discard this draft?',
      confirmText: 'Cancel',
      confirmAction: function() {
        window.location.href = 'dashboard.html';
      },
      cancelAction: hideModalPrompt
    });
  }
  function publishDraft() {
    var itemName = $('.menu .is-active').text(),
    promptMsg = '';
  
    switch (itemName.toLowerCase()) {
      case 'person':
      promptMsg = 'Published person will become available to be added as part of a cast for a season/event. Are you sure you want to publish it?';
      break;
  
      case 'role':
      promptMsg = 'Published role will become available to be added as part of a cast for a season/event. Are you sure you want to publish it?';
      break;
  
      default:
      promptMsg = 'Published ' + itemName.toLowerCase() + ' will become available on the live site. Are you sure you would like to publish it?';
      break;
  
    }
    new Modal({
      title: 'Publish this ' + itemName + '?',
      text: promptMsg,
      confirmText: 'Publish',
      confirmAction: function() {
        hideModalPrompt();
        showNotification(itemName + ' is published.');
        draftIsSaved = true;
      },
      cancelAction: hideModalPrompt
    });
  }
  
  $('#saveDraft').click(saveDraft);
  $('#removeDraft').click(removeDraft);
  $('#publishDraft').click(publishDraft);
  
  //Top bar actions dropdown for mobile
  if (document.getElementById('actionDropdown')) {
    var pageActionDropdown = new Dropdown(
      document.getElementById('actionDropdown'),
      {
        items: [
          {
            innerHTML: '<i class="fa fa-check"></i><span class="">  Save as draft</span>',
            callback: saveDraft
          },
          {
            innerHTML: '<i class="fa fa-ban"></i><span class="buttonText">  Cancel</span>',
            callback: removeDraft
          }
        ]
      }
    );
  }
  
  //Files more action dropdowns
  if (document.getElementById('moreActions')) {
    var pageActionDropdown = new Dropdown(
      document.getElementById('moreActions'),
      {
        items: [
          {
            innerHTML: 'Send to top',
            callback: handleSendToTopClick
          },
          {
            innerHTML: 'Send to bottom',
            callback: handleSendToBottomClick
          }
        ]
      }
    );
  }
  
  //Media card dropdowns
  //Small
  if (document.getElementById('mediaActionsSmall')) {
    var pageActionDropdown = new Dropdown(
      document.getElementById('mediaActionsSmall'),
      {
        items: [
          {
            innerHTML: '<i class="fa fa-upload"></i><span class="">  Upload files</span>',
            callback: handleUploadFilesClick
          },
          {
            innerHTML: '<i class="fa fa-folder-open"></i><span class="">  Add from library</span>',
            callback: function(e) {
              openAssetLibrary(e);
            }
          }
        ]
      }
    );
  }
  //Full
  if (document.getElementById('mediaActionsFull')) {
    var pageActionDropdown = new Dropdown(
      document.getElementById('mediaActionsFull'),
      {
        items: [
          {
            innerHTML: '<i class="fa fa-pencil-square"></i><span class="">  Multi Edit</span>',
            callback: handleMultiEditButtonClick,
            disabled: function() {return $('#multiEdit').hasClass('disabled');}
          },
          {
            innerHTML: '<i class="fa fa-times-circle"></i><span class="">  Remove</span>',
            callback: handleBulkRemoveClick,
            disabled: function() {return $('#bulkRemove').hasClass('disabled');}
          },
          {
            divider: true
          },
          {
            innerHTML: '<i class="fa fa-upload"></i><span class="">  Upload files</span>',
            callback: handleUploadFilesClick
          },
          {
            innerHTML: '<i class="fa fa-folder-open"></i><span class="">  Add from library</span>',
            callback: function(e) {
              openAssetLibrary(e);
            }
          }
        ]
      }
    );
  }
  
  //Asset library dropdowns
  //Small
  if (document.getElementById('assetActionsSmall')) {
    var pageActionDropdown = new Dropdown(
      document.getElementById('assetActionsSmall'),
      {
        items: [
          {
            innerHTML: '<i class="fa fa-upload"></i><span class="">  Upload files</span>',
            callback: handleUploadFilesClick
          }
        ]
      }
    );
  }
  //Full
  if (document.getElementById('assetActionsFull')) {
    var pageActionDropdown = new Dropdown(
      document.getElementById('assetActionsFull'),
      {
        items: [
          {
            innerHTML: '<i class="fa fa-pencil"></i><span class="">  Bulk Edit</span><span class="dropdown__warning"></span>',
            callback: handleMultiEditButtonClick,
            disabled: function() {return $('#bulkEdit').hasClass('disabled');},
            warning: function() {return !$('#bulkEdit').children('.button__warning').hasClass('is-hidden');}
          },
          {
            innerHTML: '<i class="fa fa-pencil-square"></i><span class="">  Multi Edit</span><span class="dropdown__warning"></span>',
            callback: handleMultiEditButtonClick,
            disabled: function() {return $('#multiEdit').hasClass('disabled');},
            warning: function() {return !$('#multiEdit').children('.button__warning').hasClass('is-hidden');}
          },
          {
            innerHTML: '<i class="fa fa-times-circle"></i><span class="">  Remove</span>',
            callback: handleBulkRemoveClick,
            disabled: function() {return $('#bulkRemove').hasClass('disabled');}
          },
          {
            divider: true
          },
          {
            innerHTML: '<i class="fa fa-upload"></i><span class="">  Upload files</span>',
            callback: handleUploadFilesClick
          }
        ]
      }
    );
  }
  
  
  //Init placeholders for images if any (cover, etc.)
  window.imagePlaceholders = initImagePlaceholders();
  
  //Focal point
  $('#focalPointToggle').click(function(e) {
    //Hide focal rectangle
    $('#focalRectToggle')
      .removeClass('is-active button_style_outline-accent')
      .addClass('button_style_outline-white');
    $('#focalRect').addClass('is-hidden');
    $('.purposes__container .purpose.is-active').removeClass('is-active');
  
    //Check whether focal point is active
    if ($(e.target).hasClass('is-active')) {
      $(e.target)
        .removeClass('is-active button_style_outline-accent')
        .addClass('button_style_outline-white');
      $('#focalPoint').addClass('is-hidden');
      hideUsagePreviews();
    }
    else {
      //Set focal point toggle active
      $(e.target)
        .addClass('is-active button_style_outline-accent')
        .removeClass('button_style_outline-white');
      showUsagePreviews();
      $('#focalPoint').removeClass('is-hidden');
    }
  });
  
  //Focal rectangle
  $('#focalRectToggle').click(function(e) {
    //Hide focal point
    $('#focalPointToggle')
      .removeClass('is-active button_style_outline-accent')
      .addClass('button_style_outline-white');
    $('#focalPoint').addClass('is-hidden');
  
    //Check whether focal point is active
    if ($(e.target).hasClass('is-active')) {
      $(e.target)
        .removeClass('is-active button_style_outline-accent')
        .addClass('button_style_outline-white');
      $('#focalRect').addClass('is-hidden');
      hideUsagePreviews();
    }
    else {
      //Set focal point toggle active
      $(e.target)
        .addClass('is-active button_style_outline-accent')
        .removeClass('button_style_outline-white');
      showUsagePreviews();
      // Adjust placement and size of rectangle according purpose size
      // We need to wait some time, so image preview size could be calculated correct
      window.setTimeout(function() {
        adjustRect($('.purposes__container .purpose-img').first());
        $('.purposes__container .purpose-img').unbind().click(function(e) {
    			adjustRect($(e.target));
    		});
        $('#focalRect').removeClass('is-hidden');
      }, 300);
      $('#purposeWrapper').animate( { scrollLeft: 0 }, 600);
    }
  });
  /* Handle Purposes scroll */
  $('#purposeWrapper').scroll(function() {
    setPurposePagination();
  });
  $('.purposes__left').unbind('click').click(function(e) {
    $('#purposeWrapper').animate( { scrollLeft: '-=480' }, 600);
  });
  $('.purposes__right').unbind('click').click(function(e) {
    $('#purposeWrapper').animate( { scrollLeft: '+=480' }, 600);
  });
  //Helper function to change classes and show usage previews
  function showUsagePreviews() {
    $('#filePreview').addClass('has-previews');
    $('#purposes').removeClass('is-hidden');
  }
  function hideUsagePreviews() {
    $('#filePreview').removeClass('has-previews');
    $('#purposes').addClass('is-hidden');
  }
  
  $('#focalPoint').draggable({
    containment: "#previewImg",
    scroll: false ,
    stop: function(e) {
      adjustFocalPoint();
      adjustPurpose($(e.target));
      dataChanged = true;
    }
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
  
  $('#showPreview').click(showAllPreviews);
  $('#hidePurpose').click(hideAllPreviews);
  $('#loadMore').click(handleShowMore);
  
  
  function handleShowMore(e) {
    $("#purposes .c-Purposes-container .purpose.hidden").slice(0, 5).removeClass('hidden');
    if ($("#purposes .c-Purposes-container .purpose.hidden").length === 0) {
      $(e.target).addClass('hidden');
    }
  }
  
  
  //Selected Files actions
  $('#bulkEdit').click(handleBulkEditButtonClick);
  $('#multiEdit').click(handleMultiEditButtonClick);
  $('#bulkRemove').click(handleBulkRemoveClick);
  
  function handleBulkRemoveClick() {
    var filesToDelete = $('.js-content .files .file.selected'),
    itemName = $('.menu .is-active').text().toLowerCase(),
    assetLibrary = itemName === 'asset library',
    msgTitle = assetLibrary? 'Delete Assets?' : 'Remove Assets?',
    mesgText = assetLibrary? 'Selected asset(s) will be deleted from the asset library. Are you sure you want to delete them?' : 'Selected asset(s) will be removed from this ' + itemName + '. Don’t worry, it won’t be deleted from the Asset Library.',
    btnName = assetLibrary? 'Delete' : 'Remove';
    new Modal({
      title: msgTitle,
      text: mesgText,
      confirmText: btnName,
      confirmAction: function() {
        filesToDelete.each(function(i, el) {
          var id = $(el).find('.file__id').text();
          deleteFileById(id, galleryObjects);
        });
        updateGallery();
      },
      cancelAction: function() {
        $('.js-content .files .file.sbr').removeClass('sbr');
      }
    });
  }
  
  //File Edit Save and Cancel
  $('#saveChanges').click(saveImageEdit);
  $('#cancelChanges').click(cancelImageEdit);
  $('#fpTopCloseButton').click(cancelImageEdit);
  
  //File Edit field changes
  $('#title').on('input', function(e) {saveTitle();});
  $('#caption').on('input', function(e) {saveCaption();});
  $('#description').on('input', function(e) {saveDescription();});
  $('#resolution').on('change', function(e) {saveResolution();});
  $('#altText').on('input', function(e) {saveAltText();});
  
  //Handle selections
  $('#selectAll').click(function(e) {
    if ($(e.target).hasClass('empty')) {
      selectAll();
    } else {
      deselectAll();
    }
  });
  $('#deselectAll').click(function(e) {deselectAll();});
  
  //Init addable fields
  initAddableFields();
  
  
  
  
  
  //autoexpandable textarea
  $( 'textarea' ).elastic();
  
  /*
  * Cards
  */
  
  //Foldable cards
  $('.js-foldable .js-foldedToggle').click(handleFoldedToggleClick);
  function handleFoldedToggleClick(e) {
    var card = $(e.target).parents('.js-foldable');
    if (card.hasClass('is-folded')) {
      card.removeClass('is-folded');
    } else {
      card.addClass('is-folded');
    }
  }
  //Sticky card header
  $('.js-stickyOnMobile').each(function(index, el) {
    var sticky = new Stickable(el, {
      maxWidth: 600,
      boundary: true,
      offset: 50
    });
  });
  $('.js-sectionTitle').each(function(index, el) {
    var sticky = new Stickable(el, {
      maxWidth: 600,
      boundary: '#media-card',
      offset: 104
    });
  });
  
  //Animation end handle
  window.addEventListener('animationend', function(e) {
    switch (e.animationName) {
      case 'collectionItem-pulse-out':
      $(e.target).removeClass('is-appearing');
      return e;
  
      case 'img-wrapper-slide-left':
      $(e.target).removeClass('is-slidingLeft');
      return e;
  
      case 'img-wrapper-slide-right':
      $(e.target).removeClass('is-slidingRight');
      return e;
  
      default:
      return e;
    }
  });
  
  
  
  
  //Recurring toggle
  $('#recurringToggle').on('change', function(e) {
    if (e.target.checked) {
      $('#recuringTime').removeClass('is-disabled');
    } else {
      $('#recuringTime').addClass('is-disabled');
    }
  });
  
  console.log(window.settings);
  
  if (window.settings.IS_MVP) {
    $("body").addClass("is-mvp");
  }
  
  
  /*
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      openAssetLibrary: openAssetLibrary
    }
  }
  */

  //Update files
  initGallery();

  $('.js-content .files .section__files').disableSelection();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhc3NldC1saWJyYXJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vQ29tbW9uIGpzIGZpbGVzXG4vL01lbnVcbmZ1bmN0aW9uIG5vcm1pbGl6ZU1lbnUoKSB7XG4gIHZhciBwYWdlTmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCcvJykucG9wKCksXG4gIG1lbnVJdGVtcyA9ICQoJy5qcy1tZW51IC5qcy1tZW51SXRlbScpO1xuICBhY3RpdmVNZW51SXRlbSA9ICQoJ1tkYXRhLXRhcmdldD1cIicgKyBwYWdlTmFtZSArICdcIl0nKTtcblxuICBtZW51SXRlbXMucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpLmNsaWNrKGhhbmRsZU1lbnVJdGVtQ2xpY2spO1xuICBhY3RpdmVNZW51SXRlbS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gIGFjdGl2ZU1lbnVJdGVtLnBhcmVudHMoJy5tZW51X19pdGVtJykuYWRkQ2xhc3MoJ2lzLW9wZW4nKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZU1lbnVJdGVtQ2xpY2soZSkge1xuICBpZiAoJChlLnRhcmdldCkuYXR0cignZGF0YS10YXJnZXQnKSkge1xuICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCdjcmVhdGUnKSA+PSAwICYmICFkcmFmdElzU2F2ZWQgJiYgJCgnLmpzLWNvbnRlbnQgLmZpbGUsIC5qcy1jb250ZW50IC5qcy1oYXNWYWx1ZScpLmxlbmd0aCA+IDApIHtcbiAgICAgIG5ldyBNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAnTGVhdmUgUGFnZT8nLFxuICAgICAgICB0ZXh0OiAnWW91IHdpbGwgbG9zZSBhbGwgdGhlIHVuc2F2ZWQgY2hhbmdlcy4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGxlYXZlIHRoaXMgcGFnZT8nLFxuICAgICAgICBjb25maXJtVGV4dDogJ0xlYXZlIFBhZ2UnLFxuICAgICAgICBjb25maXJtQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFyZ2V0Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFyZ2V0Jyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICgkKGUudGFyZ2V0KS5wYXJlbnRzKCcubWVudV9faXRlbScpLmhhc0NsYXNzKCdpcy1vcGVuJykpIHtcbiAgICAgICQoZS50YXJnZXQpLnBhcmVudHMoJy5tZW51X19pdGVtJykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnLm1lbnVfX2l0ZW0nKS5yZW1vdmVDbGFzcygnaXMtb3BlbicpO1xuICAgICAgJChlLnRhcmdldCkucGFyZW50cygnLm1lbnVfX2l0ZW0nKS5hZGRDbGFzcygnaXMtb3BlbicpO1xuICAgIH1cbiAgfVxufVxuXG4kKCcjbWVudVRvZ2dsZScpLmNsaWNrKG9wZW5NZW51KTtcbiQoJy5qcy1tZW51ID4gLmpzLWNsb3NlJykuY2xpY2soY2xvc2VNZW51KTtcblxuZnVuY3Rpb24gb3Blbk1lbnUoZSkge1xuICAkKCcuanMtbWVudScpLmFkZENsYXNzKCdpcy1vcGVuJyk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBjbG9zZU1lbnUpO1xufVxuZnVuY3Rpb24gY2xvc2VNZW51KGUpIHtcbiAgaWYgKCQoZS50YXJnZXQpLnBhcmVudHMoJy5tZW51X19saXN0JykubGVuZ3RoID09PSAwKSB7XG4gICAgJCgnLmpzLW1lbnUnKS5yZW1vdmVDbGFzcygnaXMtb3BlbicpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBjbG9zZU1lbnUpO1xuICB9XG59XG5cbi8vc2VsZWN0aW9uXG5cbmZ1bmN0aW9uIHRvZ2dsZUZpbGVTZWxlY3QoZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdHZhciBmaWxlID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKSxcblx0XHRmaWxlc1NlY3Rpb24gPSBmaWxlLnBhcmVudCgpLFxuXHRcdGZpbGVzID0gZmlsZXNTZWN0aW9uLmNoaWxkcmVuKCcuZmlsZScpLFxuXHRcdHNlbGVjdGVkRmlsZXMgPSBmaWxlc1NlY3Rpb24uY2hpbGRyZW4oJy5maWxlLnNlbGVjdGVkJyksXG5cdFx0c2luZ2xlID0gc2luZ2xlc2VsZWN0IHx8IGZhbHNlO1xuXG5cdGlmIChzaW5nbGUpIHtcblx0XHRpZiAoZmlsZS5oYXNDbGFzcygnc2VsZWN0ZWQnKSkge1xuXHRcdFx0ZmlsZS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZmlsZXNTZWN0aW9uLmZpbmQoJy5maWxlJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHRmaWxlLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHQvL0NoZWNrIGlmIHVzZXIgaG9sZCBTaGlmdCBLZXlcblx0XHRpZiAoZS5zaGlmdEtleSkge1xuXHRcdFx0aWYgKGZpbGUuaGFzQ2xhc3MoJ3NlbGVjdGVkJykpIHtcblx0XHRcdFx0ZmlsZS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpZiAoc2VsZWN0ZWRGaWxlcykge1xuXHRcdFx0XHRcdHZhciBmaWxlSW5kZXggPSBmaWxlLmluZGV4KCcuZmlsZScpLFxuXHRcdFx0XHRcdFx0ZmlsZXNUb0JlU2VsZWN0ID0gZmlsZXMuc2xpY2UobGFzdFNlbGVjdGVkLCBmaWxlSW5kZXggKyAxKTtcblxuXHRcdFx0XHRcdGlmIChsYXN0U2VsZWN0ZWQgPiBmaWxlSW5kZXgpIHtcblx0XHRcdFx0XHRcdGZpbGVzVG9CZVNlbGVjdCA9IGZpbGVzLnNsaWNlKGZpbGVJbmRleCwgbGFzdFNlbGVjdGVkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZmlsZXNUb0JlU2VsZWN0LmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0XHRcdGZpbGVzVG9CZVNlbGVjdC5yZW1vdmVDbGFzcygnaXMtcHJlc2VsZWN0ZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRmaWxlLnRvZ2dsZUNsYXNzKCdzZWxlY3RlZCBpcy1wcmVzZWxlY3RlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZmlsZS50b2dnbGVDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHR9XG5cdFx0bGFzdFNlbGVjdGVkID0gZmlsZS5pbmRleCgpO1xuXHRcdG5vcm1hbGl6ZVNlbGVjdGVpb24oKTtcblx0fVxufVxuZnVuY3Rpb24gbm9ybWFsaXplU2VsZWN0ZWlvbigpIHtcblx0dmFyIGJ1bGtEZWxldGVCdXR0b24gPSAkKCcjYnVsa1JlbW92ZScpLFxuXHRcdGJ1bGtFZGl0QnV0dG9uID0gJCgnI2J1bGtFZGl0JyksXG5cdFx0bXVsdGlFZGl0QnV0dG9uID0gJCgnI211bHRpRWRpdCcpLFxuXHRcdG1vcmVBY3Rpb25zQnV0dG9uID0gJCgnI21vcmVBY3Rpb25zJyksXG5cblx0XHRzZWxlY3RBbGxCdXR0b24gPSAkKCcjc2VsZWN0QWxsJyksXG5cdFx0c2VsZWN0QWxsTGFiZWwgPSAkKCcjc2VsZWN0QWxsTGFiZWwnKSxcblxuXHRcdGRlc2VsZWN0QWxsQnV0dG9uID0gJCgnI2Rlc2VsZWN0QWxsJyksXG5cdFx0ZGVzZWxlY3RBbGxMYWJlbCA9ICQoJyNkZXNlbGVjdEFsbExhYmVsJyksXG5cblx0XHRkZWxldGVCdXR0b25zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlIC5maWxlX19kZWxldGUnKSxcblx0XHRlZGl0QnV0dG9ucyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZSAuYnV0dG9uJykubm90KCcuYy1GaWxlLWNvdmVyVG9nbGUnKSxcblx0XHRhcnJhbmdlbWVudHMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUgLmZpbGVfX2FycmFnZW1lbnQnKSxcblx0XHRhcnJhbmdlbWVudElucHV0cyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZSAuZmlsZV9fYXJyYWdlbWVudCcpLmZpbmQoJ2lucHV0JyksXG5cdFx0c2V0Q292ZXJCdXR0b25zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlIGJ1dHRvbi5jLUZpbGUtY292ZXJUb2dsZScpLFxuXG5cdFx0c2VsZWN0ZWREZWxldGVCdXR0b24gPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQgLmZpbGVfX2RlbGV0ZScpLFxuXHRcdHNlbGVjdGVkRWRpdEJ1dHRvbiA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCAuYnV0dG9uJyksXG5cdFx0c2VsZWN0ZWRBcnJhbmdlbWVudCA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCAuZmlsZV9fYXJyYWdlbWVudCcpLFxuXHRcdHNlbGVjdGVkQXJyYW5nZW1lbnRJbnB1dCA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCAuZmlsZV9fYXJyYWdlbWVudCcpLmZpbmQoJ2lucHV0JyksXG5cdFx0c2VsZWN0ZWRTZXRDb3ZlckJ1dHRvbnMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQgYnV0dG9uLmMtRmlsZS1jb3ZlclRvZ2xlJyksXG5cblx0XHRudW1iZXJPZkZpbGVzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlJykubGVuZ3RoLFxuXHRcdG51bWJlck9mU2VsZWN0ZWRGaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpLmxlbmd0aCxcblx0XHRudW1iZXJPZlNlbGVjdGVkSW1hZ2VzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLWltZ0ZpbGVUeXBlLnNlbGVjdGVkJykubGVuZ3RoLFxuXHRcdG51bWJlck9mU2VsZWN0ZWRWaWRlb3MgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuanMtdmlkZW9GaWxlVHlwZS5zZWxlY3RlZCcpLmxlbmd0aDtcblxuXHRcdHVuc2VsZWN0ZWRGaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZScpLm5vdCgnLnNlbGVjdGVkJyk7XG5cblx0Ly9ObyBzZWxlY3RlZCBmaWxlc1xuXHRpZiAobnVtYmVyT2ZTZWxlY3RlZEZpbGVzID09PSAwKSB7XG5cdFx0c2VsZWN0QWxsQnV0dG9uLnJlbW92ZUNsYXNzKCdhbGwgZGlzYWJsZWQnKS5hZGRDbGFzcygnZW1wdHknKTtcblx0XHRzZWxlY3RBbGxMYWJlbC50ZXh0KCdTZWxlY3QgQWxsJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cblx0XHRkZXNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnaXMtYWxsJykuYWRkQ2xhc3MoJ2lzLWVtcHR5IGRpc2FibGVkJyk7XG5cdFx0ZGVzZWxlY3RBbGxMYWJlbC5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblxuXHRcdGJ1bGtEZWxldGVCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRidWxrRWRpdEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdGJ1bGtFZGl0QnV0dG9uLmZpbmQoJy5idXR0b25fX3dhcm5pbmcnKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG5cdFx0bXVsdGlFZGl0QnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0bW9yZUFjdGlvbnNCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblxuXHRcdGVkaXRCdXR0b25zLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRkZWxldGVCdXR0b25zLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRhcnJhbmdlbWVudHMucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0YXJyYW5nZW1lbnRJbnB1dHMucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0c2V0Q292ZXJCdXR0b25zLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuXG5cdFx0dW5zZWxlY3RlZEZpbGVzLnJlbW92ZUNsYXNzKCdpcy1wcmVzZWxlY3RlZCcpO1xuXG5cdFx0aWYgKCQoJyNhc3NldHMtY291bnQnKS5sZW5ndGggPiAwKSB7bm9ybWFsaXplQXNzZXRzQ291bnQoKTt9XG5cblx0XHRpZiAobnVtYmVyT2ZGaWxlcyA9PT0gMCkge1xuXHRcdFx0c2VsZWN0QWxsQnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0c2VsZWN0QWxsTGFiZWwuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cblx0XHRcdGRlc2VsZWN0QWxsQnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ZGVzZWxlY3RBbGxMYWJlbC5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHR9XG5cdH1cblx0Ly9Tb21lIGZpbGVzIGFyZSBzZWxlY3RlZFxuXHRlbHNlIGlmIChudW1iZXJPZlNlbGVjdGVkRmlsZXMgPiAwKSB7XG5cdFx0c2VsZWN0QWxsQnV0dG9uLnJlbW92ZUNsYXNzKCdlbXB0eSBhbGwnKTtcblx0XHRzZWxlY3RBbGxMYWJlbC50ZXh0KCdEZXNlbGVjdCBBbGwnKTtcblxuXHRcdGRlc2VsZWN0QWxsQnV0dG9uLnJlbW92ZUNsYXNzKCdpcy1lbXB0eSBpcy1hbGwgZGlzYWJsZWQnKTtcblx0XHRkZXNlbGVjdEFsbExhYmVsLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXG5cblx0XHRidWxrRGVsZXRlQnV0dG9uLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdGJ1bGtFZGl0QnV0dG9uLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdG11bHRpRWRpdEJ1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRtb3JlQWN0aW9uc0J1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblxuXHRcdGVkaXRCdXR0b25zLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHRkZWxldGVCdXR0b25zLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHRhcnJhbmdlbWVudHMuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0YXJyYW5nZW1lbnRJbnB1dHMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRzZXRDb3ZlckJ1dHRvbnMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcblxuXHRcdHVuc2VsZWN0ZWRGaWxlcy5hZGRDbGFzcygnaXMtcHJlc2VsZWN0ZWQnKTtcblxuXHRcdGlmICgkKCcjYXNzZXRzLWNvdW50JykubGVuZ3RoID4gMCkge1xuXHRcdFx0JCgnI2Fzc2V0cy1jb3VudCcpLnRleHQobnVtYmVyT2ZTZWxlY3RlZEZpbGVzLnRvU3RyaW5nKCkgKyAnIG9mICcgKyBnYWxsZXJ5T2JqZWN0cy5sZW5ndGggKyAnIHNlbGVjdGVkJyk7XG5cdFx0fVxuXG5cdFx0aWYgKG51bWJlck9mU2VsZWN0ZWRWaWRlb3MgJiYgbnVtYmVyT2ZTZWxlY3RlZEltYWdlcykge1xuXHRcdFx0YnVsa0VkaXRCdXR0b24uZmluZCgnLmJ1dHRvbl9fd2FybmluZycpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcblx0XHRcdG11bHRpRWRpdEJ1dHRvbi5maW5kKCcuYnV0dG9uX193YXJuaW5nJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRidWxrRWRpdEJ1dHRvbi5maW5kKCcuYnV0dG9uX193YXJuaW5nJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHRcdFx0bXVsdGlFZGl0QnV0dG9uLmZpbmQoJy5idXR0b25fX3dhcm5pbmcnKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG5cdFx0fVxuXG5cdFx0Ly9Pbmx5IG9uZSBmaWxlIHNlbGVjdGVkXG5cdFx0aWYgKG51bWJlck9mU2VsZWN0ZWRGaWxlcyA9PT0gMSkge1xuXHRcdFx0YnVsa0VkaXRCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRcdG11bHRpRWRpdEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdFx0Ly9tb3JlQWN0aW9uc0J1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXG5cdFx0XHRzZWxlY3RlZEVkaXRCdXR0b24ucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0c2VsZWN0ZWREZWxldGVCdXR0b24ucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0c2VsZWN0ZWRBcnJhbmdlbWVudC5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdHNlbGVjdGVkQXJyYW5nZW1lbnRJbnB1dC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRcdHNlbGVjdGVkU2V0Q292ZXJCdXR0b25zLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuXHRcdH1cblx0XHQvL0FsbCBmaWxlcyBhcmUgc2VsZWN0ZWRcblx0XHRpZiAobnVtYmVyT2ZTZWxlY3RlZEZpbGVzID09PSBudW1iZXJPZkZpbGVzKSB7XG5cdFx0XHRzZWxlY3RBbGxCdXR0b24ucmVtb3ZlQ2xhc3MoJ2VtcHR5JykuYWRkQ2xhc3MoJ2FsbCcpO1xuXHRcdFx0ZGVzZWxlY3RBbGxCdXR0b24ucmVtb3ZlQ2xhc3MoJ2lzLWVtcHR5JykuYWRkQ2xhc3MoJ2lzLWFsbCcpO1xuXHRcdH1cblx0fVxufVxuZnVuY3Rpb24gc2VsZWN0QWxsKCkge1xuXHQkKCcuanMtY29udGVudCAuZmlsZScpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXHRub3JtYWxpemVTZWxlY3RlaW9uKCk7XG59XG5mdW5jdGlvbiBkZXNlbGVjdEFsbCgpIHtcblx0JCgnLmpzLWNvbnRlbnQgLmZpbGUuc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblx0bm9ybWFsaXplU2VsZWN0ZWlvbigpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVBc3NldHNDb3VudCgpIHtcblx0aWYgKGdhbGxlcnlPYmplY3RzLmxlbmd0aCkge1xuXHRcdCQoJyNhc3NldHMtY291bnQnKS50ZXh0KGdhbGxlcnlPYmplY3RzLmxlbmd0aCArICcgYXNzZXRzJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHR9IGVsc2Uge1xuXHRcdCQoJyNhc3NldHMtY291bnQnKS50ZXh0KCcnKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG5cdH1cbn1cblxuLy9Ob3RpZmljYXRpb25zXG5mdW5jdGlvbiBzaG93Tm90aWZpY2F0aW9uKHRleHQsIHRvcCkge1xuICAgIHZhciBub3RpZmljYXRpb24gPSAkKCcubm90aWZpY2F0aW9uJyksXG4gICAgICAgIG5vdGlmaWNhdGlvblRleHQgPSAkKCcubm90aWZpY2F0aW9uX190ZXh0Jyk7XG5cbiAgICBpZiAobm90aWZpY2F0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBub3RpZmljYXRpb24gPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdub3RpZmljYXRpb24nKTtcbiAgICAgICAgbm90aWZpY2F0aW9uVGV4dCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ25vdGlmaWNhdGlvbl9fdGV4dCcpO1xuICAgICAgICBub3RpZmljYXRpb24uYXBwZW5kKG5vdGlmaWNhdGlvblRleHQpO1xuICAgIH1cblxuICAgIGlmICgkKCcubW9kYWwnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICghJCgnLm1vZGFsIC5wcmV2aWV3JykuaGFzQ2xhc3MoJ2hpZGRlbicpKSB7XG4gICAgICAgICAgICAkKCcubW9kYWwgLnByZXZpZXcnKS5hcHBlbmQobm90aWZpY2F0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJy5tb2RhbCcpLmFwcGVuZChub3RpZmljYXRpb24pO1xuICAgICAgICB9XG5cbiAgICB9IGVsc2UgaWYoJCgnLmN0JykubGVuZ3RoID4gMCkge1xuICAgICAgICAkKCcuY3QnKS5hcHBlbmQobm90aWZpY2F0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKCdib2R5JykuYXBwZW5kKG5vdGlmaWNhdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKHRvcCkge25vdGlmaWNhdGlvbi5jc3MoJ3RvcCcsIHRvcCk7fVxuICAgIG5vdGlmaWNhdGlvblRleHQudGV4dCh0ZXh0KTtcbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgbm90aWZpY2F0aW9uLnJlbW92ZSgpO1xuICAgIH0sIDQwMDApO1xufVxuXG4vL0ZpbGUgZnVuY3Rpb25zXG52YXIgZ2FsbGVyeUNhcHRpb25zID0ge307XG5cbmZ1bmN0aW9uIGhhbmRsZUNhcHRpb25FZGl0KGUpIHtcbiAgICB2YXIgZmlsZUVsZW1lbnQgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpLFxuICAgICAgICBmaWxlSWQgPSBmaWxlRWxlbWVudC5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCksXG4gICAgICAgIHRvZ2dsZSA9IGZpbGVFbGVtZW50LmZpbmQoJy5maWxlX19jYXB0aW9uLXRvZ2dsZSAudG9nZ2xlJyksXG4gICAgICAgIGZpbGUgPSBnYWxsZXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuICAgICAgICAgICAgcmV0dXJuIGYuZmlsZURhdGEuaWQgPT09IGZpbGVJZDtcbiAgICAgICAgfSlbMF0sXG5cbiAgICAgICAgdG9nZ2xlQ2hlY2tlZCA9ICQoZS50YXJnZXQpLnZhbCgpID09PSBmaWxlLmZpbGVEYXRhLmNhcHRpb24gJiYgZmlsZS5maWxlRGF0YS5jYXB0aW9uOyAvL0lmIHRleHRmaWVsZCBlcXVhbHMgdGhlIGZpbGUgY2FwdGlvbiBhbmQgZmlsZSBjYXB0aW9uIG5vdCBlbXB0eVxuXG4gICAgLy9TYXZlIGNhcHRpb24gdG8gZ2FsbGVyeUNhcHRpb25zXG4gICAgZmlsZS5jYXB0aW9uID0gJChlLnRhcmdldCkudmFsKCk7XG5cbiAgICB0b2dnbGUucHJvcCgnY2hlY2tlZCcsIHRvZ2dsZUNoZWNrZWQpO1xuICAgIGNsb3NlVG9vbHRpcCgpO1xufVxuZnVuY3Rpb24gaGFuZGxlQ2FwdGlvblRvZ2dsZUNsaWNrKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHZhciBmaWxlID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKSxcbiAgICAgICAgZmlsZUlkID0gZmlsZS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCksXG4gICAgICAgIHRleHRhcmVhID0gZmlsZS5maW5kKCcuZmlsZV9fY2FwdGlvbi10ZXh0YXJlYScpLFxuICAgICAgICBvcmlnaW5hbEZpbGUgPSBmaWxlQnlJZChmaWxlSWQsIGdhbGxlcnlPYmplY3RzKTtcblxuICAgIGlmICgkKGUudGFyZ2V0KS5wcm9wKCdjaGVja2VkJykpIHtcbiAgICAgICAgdGV4dGFyZWEudmFsKG9yaWdpbmFsRmlsZS5maWxlRGF0YS5jYXB0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0YXJlYS5mb2N1cygpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGhhbmRsZUNhcHRpb25TdGFydEVkaXRpbmcoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdmFyIHRvb2x0aXBUZXh0ID0gJ1RoaXMgY2FwdGlvbiB3aWxsIG9ubHkgYXBwbHkgdG8geW91ciBnYWxsZXJ5IGFuZCBub3QgdG8gdGhlIGltYWdlIGFzc2V0Lic7XG4gICAgaWYgKCF3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rvb2x0aXAnKSkge1xuICAgICAgICBjcmVhdGVUb29sdGlwKCQoZS50YXJnZXQpLCB0b29sdGlwVGV4dCk7XG4gICAgfVxufVxuLy8gQ2hhbmdlIGVsZW1lbnQgaW5kZXhlcyB0byBhbiBhY3R1YWwgb25lc1xuZnVuY3Rpb24gbm9ybWFsaXplSW5kZXgoKSB7XG4gICAgdmFyIGZpbGVzID0gJCgnLmpzLWZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZScpO1xuXG4gICAgZmlsZXMuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgJChlbCkuZmluZCgnLmZpbGVfX2FyYWdlbWVudC1pbnB1dCcpLnRleHQoaW5kZXggKyAxKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlSW5kZXhGaWVsZENoYW5nZShlKSB7XG4gICAgdmFyIGxlbmd0aCA9ICQoJy5qcy1maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKS5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gcGFyc2VJbnQoJChlLnRhcmdldCkudmFsKCkpIC0gMSxcbiAgICAgICAgZmlsZSA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJyk7XG5cbiAgICBpZiAoaW5kZXggKyAxID49IGxlbmd0aCkge1xuICAgICAgICBwdXRCb3R0b20oZmlsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsZS5kZXRhY2goKS5pbnNlcnRCZWZvcmUoJCgnLmpzLWZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZScpLnNsaWNlKGluZGV4LCBpbmRleCsxKSk7XG5cbiAgICB9XG4gICAgbm9ybWFsaXplSW5kZXgoKTtcbiAgICAvL3VwZGF0ZUdhbGxlcnkoaW5kZXgpO1xufVxuXG5mdW5jdGlvbiBwdXRCb3R0b20oZmlsZSkge1xuICAgIGZpbGUuZGV0YWNoKCkuaW5zZXJ0QWZ0ZXIoJCgnLmpzLWZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZScpLmxhc3QoKSk7XG4gICAgbm9ybWFsaXplSW5kZXgoKTtcbiAgICAvL3VwZGF0ZUdhbGxlcnkoZ2FsbGVyeU9iamVjdHMubGVuZ3RoKTtcbn1cbmZ1bmN0aW9uIHB1dFRvcChmaWxlKSB7XG4gICAgZmlsZS5kZXRhY2goKS5pbnNlcnRCZWZvcmUoJCgnLmpzLWZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZScpLmZpcnN0KCkpO1xuICAgIG5vcm1hbGl6ZUluZGV4KCk7XG4gICAgLy91cGRhdGVHYWxsZXJ5KDApO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVTZW5kVG9Ub3BDbGljayhlKSB7XG4gICAgdmFyIGZpbGVzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkJyk7XG4gICAgaWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcHV0VG9wKGZpbGVzKTtcbiAgICB9XG4gICAgcHV0VG9wKCQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJykpO1xuICAgIGNsb3NlTWVudSgkKGUudGFyZ2V0KS5wYXJlbnRzKCdzZWxlY3RfX21lbnUnKSk7XG59XG5mdW5jdGlvbiBoYW5kbGVTZW5kVG9Cb3R0b21DbGljayhlKSB7XG4gICAgdmFyIGZpbGVzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkJyk7XG4gICAgaWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcHV0Qm90dG9tKGZpbGVzKTtcbiAgICB9XG4gICAgcHV0Qm90dG9tKCQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJykpO1xuICAgIGNsb3NlTWVudSgkKGUudGFyZ2V0KS5wYXJlbnRzKCdzZWxlY3RfX21lbnUnKSk7XG59XG5mdW5jdGlvbiBsb2FkRmlsZShmaWxlKSB7XG5cdHZhciBmaWxlRGF0YSA9IGZpbGUuZmlsZURhdGE7XG5cblx0c3dpdGNoIChmaWxlRGF0YS50eXBlKSB7XG5cdFx0Y2FzZSAnaW1hZ2UnOlxuXHRcdFx0JCgnI2ZpbGVQcmV2aWV3JykuYWRkQ2xhc3MoJ3ByZXZpZXctLWltYWdlJykucmVtb3ZlQ2xhc3MoJ3ByZXZpZXctLXZpZGVvJyk7XG5cdFx0XHQvL0hpZGUgdmlkZW8gcmVsYXRlZCBlbGVtZW50c1xuXHRcdFx0JCgnI3ZpZGVvUGxheScpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHRcdCQoJyN2aWRlb01ldGFkYXRhJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0XHQvL1Nob3cgYWxsIGltYWdlIHJlbGF0ZWQgZWxlbWVudHNcblx0XHRcdCQoJyNwcmV2aWV3Q29udHJvbHMnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHQkKCcjaW1hZ2VNZXRhZGF0YScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRcdC8vJCgnI2ZvY2FsUG9pbnQnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHQvLyQoJyNmb2NhbFJlY3QnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cblx0XHRcdC8vSWYgaXQgaXMgbm90IGJ1bGsgZWRpdCBzZXQgcHJldmlldyBpbWFnZSBhbmQgYWRqdXN0IGZvY2FsIHBvaW50IGFuZCByZWN0YW5nbGU7XG5cdFx0XHRpZiAoIWZpbGUuYnVsa0VkaXQpIHtcblx0XHRcdFx0JCgnI3ByZXZpZXdJbWcnKS5hdHRyKCdzcmMnLCBmaWxlRGF0YS51cmwpO1xuXHRcdFx0XHQkKCcucHIgLnB1cnBvc2UtaW1nJykuY3NzKFwiYmFja2dyb3VuZC1pbWFnZVwiLCAndXJsKCcgKyBmaWxlRGF0YS51cmwgKyAnKScpO1xuXHRcdFx0XHRhZGp1c3RGb2NhbFBvaW50KGZpbGVEYXRhLmZvY2FsUG9pbnQpO1xuXHRcdFx0XHRhZGp1c3RGb2NhbFJlY3QoZmlsZURhdGEuZm9jYWxQb2ludCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vc2V0IFRpdGxlXG5cdFx0XHRhZGp1c3RUaXRsZShmaWxlRGF0YS50aXRsZSk7XG5cdFx0XHRhZGp1c3RDYXB0aW9uKGZpbGVEYXRhLmNhcHRpb24pO1xuXHRcdFx0YWRqdXN0RGVzY3JpcHRpb24oZmlsZURhdGEuZGVzY3JpcHRpb24pO1xuXHRcdFx0YWRqdXN0UmVzb2x1dGlvbihmaWxlRGF0YS5oaWdoUmVzb2x1dGlvbik7XG5cdFx0XHRhZGp1c3RBbHRUZXh0KGZpbGVEYXRhLmFsdFRleHQpO1xuXG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgJ3ZpZGVvJzpcblx0XHRcdCQoJyNmaWxlUHJldmlldycpLmFkZENsYXNzKCdwcmV2aWV3LS12aWRlbycpLnJlbW92ZUNsYXNzKCdwcmV2aWV3LS1pbWFnZScpO1xuXHRcdFx0Ly9IaWRlIGFsbCBpbWFnZSByZWxhdGVkIGVsZW1lbnRzXG5cdFx0XHQkKCcjcHJldmlld0NvbnRyb2xzJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0JCgnI2ltYWdlTWV0YWRhdGEnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHQkKCcjZm9jYWxQb2ludCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHRcdCQoJyNmb2NhbFJlY3QnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cblx0XHRcdC8vU2hvdyB2aWRlbyByZWxhdGVkIGVsZW1lbnRzXG5cdFx0XHQkKCcjdmlkZW9QbGF5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0JCgnI3ZpZGVvTWV0YWRhdGEnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cblx0XHRcdGlmIChmaWxlLmJ1bGtFZGl0KSB7XG5cdFx0XHRcdCQoJyNmaWVsRWRpdC12aWRlb01ldGFkYXRhJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI2ZpZWxFZGl0LXZpZGVvTWV0YWRhdGEnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cblx0XHRcdFx0JCgnI3ByZXZpZXdJbWcnKS5hdHRyKCdzcmMnLCBmaWxlRGF0YS51cmwpO1xuXHRcdFx0XHQkKCcjdmlkZW9UaXRsZScpLnRleHQoZmlsZURhdGEudGl0bGUpO1xuXHRcdFx0XHQkKCcjdmlkZW9EZXNjcmlwdGlvbicpLnRleHQoZmlsZURhdGEuZGVzY3JpcHRpb24pO1xuXHRcdFx0XHQkKCcjdmlkZW9BdXRob3InKS50ZXh0KGZpbGVEYXRhLmF1dGhvcik7XG5cdFx0XHRcdCQoJyN2aWRlb0d1aWQnKS50ZXh0KGZpbGVEYXRhLmd1aWQpO1xuXHRcdFx0XHQkKCcjdmlkZW9LZXl3b3JkcycpLnRleHQoZmlsZURhdGEua2V5d29yZHMpO1xuXHRcdFx0fVxuXG5cdFx0YnJlYWs7XG5cdH1cbn1cblxuLy9GdW5jdGlvbiB0byBzZXQgVGl0bGUgdG8gdGhlIHRpdGxlIGZpZWxkIG9yLCBzYXZlIHRpdGxlIGlmIHRpdGxlIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBhZGp1c3RUaXRsZSh0aXRsZSkge1xuXHQkKCcjdGl0bGUnKS52YWwodGl0bGUpLmNoYW5nZSgpO1xuXHR2YXIgZXZlbnQgPSBuZXcgVUlFdmVudCgnY2hhbmdlJyk7XG5cdC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlJykuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBUaXRsZSB0byB0aGUgdGl0bGUgZmllbGQgb3IsIHNhdmUgdGl0bGUgaWYgdGl0bGUgYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIHNhdmVUaXRsZShlKSB7XG5cdHZhciBjdXJyZW50SW1hZ2UgPSAkKCcuaW1hZ2UuaW1hZ2Vfc3R5bGVfbXVsdGkgLmZpbGVfX2lkW2RhdGEtaWQ9XCInICsgZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuaWQgKyAnXCJdJykucGFyZW50cygnLmltYWdlJyk7XG5cblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEudGl0bGUgPSAkKCcjdGl0bGUnKS52YWwoKTtcblxuXHRpZiAoJCgnI3RpdGxlJykudmFsKCkgPT09ICcnKSB7XG5cdFx0Y3VycmVudEltYWdlLmFkZENsYXNzKCdoYXMtZW1wdHlSZXF1aXJlZEZpZWxkJyk7XG5cdH0gZWxzZSB7XG5cdFx0Y3VycmVudEltYWdlLnJlbW92ZUNsYXNzKCdoYXMtZW1wdHlSZXF1aXJlZEZpZWxkJyk7XG5cdH1cblxuXHRkYXRhQ2hhbmdlZCA9IHRydWU7XG5cdGlmIChlZGl0ZWRGaWxlRGF0YS5idWxrRWRpdCkge1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdGYuZmlsZURhdGEudGl0bGUgPSAkKCcjdGl0bGUnKS52YWwoKTtcblx0XHR9KTtcblx0fVxufVxuLy9GdW5jdGlvbiB0byBzZXQgQ2FwdGlvbiB0byB0aGUgY2FwdGlvbiBmaWVsZCBvciwgc2F2ZSBjYXB0aW9uIGlmIGNhcHRpb24gYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIGFkanVzdENhcHRpb24oY2FwdGlvbikge1xuXHQkKCcjY2FwdGlvbicpLnZhbChjYXB0aW9uKS5jaGFuZ2UoKTtcblx0dmFyIGV2ZW50ID0gbmV3IFVJRXZlbnQoJ2NoYW5nZScpO1xuXHQvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXB0aW9uJykuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBEZXNjcmlwdGlvbiB0byB0aGUgY2FwdGlvbiBmaWVsZCBvciwgc2F2ZSBjYXB0aW9uIGlmIGNhcHRpb24gYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIHNhdmVDYXB0aW9uKCkge1xuXHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5jYXB0aW9uID0gJCgnI2NhcHRpb24nKS52YWwoKTtcblx0ZGF0YUNoYW5nZWQgPSB0cnVlO1xuXHRpZiAoZWRpdGVkRmlsZURhdGEuYnVsa0VkaXQpIHtcblx0XHRlZGl0ZWRGaWxlc0RhdGEuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0XHRmLmZpbGVEYXRhLmNhcHRpb24gPSAkKCcjY2FwdGlvbicpLnZhbCgpO1xuXHRcdH0pO1xuXHR9XG59XG5mdW5jdGlvbiBhZGp1c3REZXNjcmlwdGlvbihkZXNjcmlwdGlvbikge1xuXHQkKCcjZGVzY3JpcHRpb24nKS52YWwoZGVzY3JpcHRpb24pLmNoYW5nZSgpO1xuXHR2YXIgZXZlbnQgPSBuZXcgVUlFdmVudCgnY2hhbmdlJyk7XG5cdC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2NyaXB0aW9uJykuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBEZXNjcmlwdGlvbiB0byB0aGUgY2FwdGlvbiBmaWVsZCBvciwgc2F2ZSBjYXB0aW9uIGlmIGNhcHRpb24gYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIHNhdmVEZXNjcmlwdGlvbigpIHtcblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuZGVzY3JpcHRpb24gPSAkKCcjZGVzY3JpcHRpb24nKS52YWwoKTtcblx0ZGF0YUNoYW5nZWQgPSB0cnVlO1xuXHRpZiAoZWRpdGVkRmlsZURhdGEuYnVsa0VkaXQpIHtcblx0XHRlZGl0ZWRGaWxlc0RhdGEuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0XHRmLmZpbGVEYXRhLmRlc2NyaXB0aW9uID0gJCgnI2Rlc2NyaXB0aW9uJykudmFsKCk7XG5cdFx0fSk7XG5cdH1cbn1cbmZ1bmN0aW9uIGFkanVzdFJlc29sdXRpb24ocmVzb2x1dGlvbikge1xuXHQkKCcjcmVzb2x1dGlvbicpLnByb3AoJ2NoZWNrZWQnLCByZXNvbHV0aW9uKTtcbn1cbi8vRnVuY3Rpb24gdG8gc2V0IERlc2NyaXB0aW9uIHRvIHRoZSBjYXB0aW9uIGZpZWxkIG9yLCBzYXZlIGNhcHRpb24gaWYgY2FwdGlvbiBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gc2F2ZVJlc29sdXRpb24oKSB7XG5cdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmhpZ2hSZXNvbHV0aW9uID0gJCgnI3Jlc29sdXRpb24nKS5wcm9wKCdjaGVja2VkJyk7XG5cdGRhdGFDaGFuZ2VkID0gdHJ1ZTtcblx0aWYgKGVkaXRlZEZpbGVEYXRhLmJ1bGtFZGl0KSB7XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdFx0Zi5maWxlRGF0YS5oaWdoUmVzb2x1dGlvbiA9ICQoJyNyZXNvbHV0aW9uJykucHJvcCgnY2hlY2tlZCcpO1xuXHRcdH0pO1xuXHR9XG59XG5mdW5jdGlvbiBhZGp1c3RBbHRUZXh0KGFsdFRleHQpIHtcblx0JCgnI2FsdFRleHQnKS52YWwoYWx0VGV4dCkuY2hhbmdlKCk7XG5cdHZhciBldmVudCA9IG5ldyBVSUV2ZW50KCdjaGFuZ2UnKTtcblx0Ly9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWx0VGV4dCcpLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgRGVzY3JpcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlQWx0VGV4dCgpIHtcblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuYWx0VGV4dCA9ICQoJyNhbHRUZXh0JykudmFsKCk7XG5cdGRhdGFDaGFuZ2VkID0gdHJ1ZTtcblx0aWYgKGVkaXRlZEZpbGVEYXRhLmJ1bGtFZGl0KSB7XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdFx0Zi5maWxlRGF0YS5hbHRUZXh0ID0gJCgnI2FsdFRleHQnKS52YWwoKTtcblx0XHR9KTtcblx0fVxufVxuXG4vL0Z1bmN0aW9uIHRvIHNldCBGb2NhbFBvaW50IGNvb3JkaW5hdGVzIG9yLCBzYXZlIGZvY2FsIHBvaW50IGlmIGZvY2FscG9pbnQgYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIGFkanVzdEZvY2FsUG9pbnQoZm9jYWxQb2ludCkge1xuXHR2YXIgZnAgPSAkKCcjZm9jYWxQb2ludCcpO1xuXHR2YXIgaW1nID0gJCgnI3ByZXZpZXdJbWcnKTtcblx0aWYgKGZvY2FsUG9pbnQpIHtcblx0XHR2YXIgbGVmdCA9IGZvY2FsUG9pbnQubGVmdCAqIGltZy53aWR0aCgpIC0gZnAud2lkdGgoKS8yLFxuXHRcdHRvcCA9IGZvY2FsUG9pbnQudG9wICogaW1nLmhlaWdodCgpIC0gZnAuaGVpZ2h0KCkvMjtcblxuXHRcdGxlZnQgPSBsZWZ0IDw9IDAgPyAnNTAlJyA6IGxlZnQ7XG5cdFx0dG9wID0gdG9wIDw9IDAgPyAnNTAlJyA6IHRvcDtcblx0XHRmcC5jc3MoJ2xlZnQnLCBsZWZ0KS5jc3MoJ3RvcCcsIHRvcCk7XG5cdH0gZWxzZSB7XG5cdFx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuZm9jYWxQb2ludCA9IHtcblx0XHRcdGxlZnQ6ICgoZnAucG9zaXRpb24oKS5sZWZ0ICsgZnAud2lkdGgoKS8yKS9pbWcud2lkdGgoKSksXG5cdFx0XHR0b3A6ICgoZnAucG9zaXRpb24oKS50b3AgKyBmcC5oZWlnaHQoKS8yKS9pbWcuaGVpZ2h0KCkpXG5cdFx0fTtcblx0fVxuXHRmcC5jc3MoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG59XG5cbi8vRnVuY3Rpb24gdG8gc2V0IEZvY2FsUmVjdCBjb29yZGluYXRlcyBvciwgc2F2ZSBmb2NhbCByZWN0IGlmIGZvY2FscG9pbnQgYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIGFkanVzdEZvY2FsUmVjdChmb2NhbFBvaW50KSB7XG5cdHZhciBmciA9ICQoJyNmb2NhbFJlY3QnKTtcblx0dmFyIGltZyA9ICQoJ3ByZXZpZXdJbWcnKTtcblx0aWYgKGZvY2FsUG9pbnQpIHtcblx0XHR2YXIgbGVmdCA9IGZvY2FsUG9pbnQubGVmdCAqIGltZy53aWR0aCgpIC0gZnIud2lkdGgoKS8yLFxuXHRcdHRvcCA9IGZvY2FsUG9pbnQudG9wICogaW1nLmhlaWdodCgpIC0gZnIuaGVpZ2h0KCkvMjtcblxuXHRcdGxlZnQgPSBsZWZ0IDwgMCA/IDAgOiBsZWZ0ID4gaW1nLndpZHRoKCkgPyBpbWcud2lkdGgoKSAtIGZyLndpZHRoKCkvMiA6IGxlZnQ7XG5cdFx0dG9wID0gdG9wIDwgMCA/IDAgOiB0b3AgPiBpbWcuaGVpZ2h0KCkgPyBpbWcuaGVpZ2h0KCkgLSBmci5oZWlnaHQoKS8yIDogdG9wO1xuXG5cdFx0ZnIuY3NzKCdsZWZ0JywgbGVmdClcblx0XHQuY3NzKCd0b3AnLCB0b3ApO1xuXHR9IGVsc2Uge1xuXHRcdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmZvY2FsUG9pbnQgPSB7XG5cdFx0XHRsZWZ0OiAoKGZwLnBvc2l0aW9uKCkubGVmdCArIGZwLndpZHRoKCkvMikvaW1nLndpZHRoKCkpLFxuXHRcdFx0dG9wOiAoKGZwLnBvc2l0aW9uKCkudG9wICsgZnAuaGVpZ2h0KCkvMikvaW1nLmhlaWdodCgpKVxuXHRcdH07XG5cdH1cbn1cblxuXG5mdW5jdGlvbiBzaG93RmlsZXMoZmlsZXMpIHtcblx0ZGF0YUNoYW5nZWQgPSBmYWxzZTtcblx0c2Nyb2xsUG9zaXRpb24gPSAkKCdib2R5Jykuc2Nyb2xsVG9wKCk7XG5cdC8vU2hvdyBpbml0aWFsIGVkaXQgc2NyZWVuIGZvciBzaW5nbGUgaW1hZ2UuXG5cdCQoJy5wcicpLnJlbW92ZUNsYXNzKCdoaWRkZW4gdmlkZW8gYnVsaycpXG5cdC5hZGRDbGFzcygnbW9kYWwnKTtcblx0JCgnI3dyYXBwZXInKS5hZGRDbGFzcygnb3ZlcmZsb3cnKTtcblxuXHQvL1JlbW92ZSBhbGwgbXVsdGlwbGUgaW1hZ2VzIHN0eWxlIGF0dHJpYnV0ZXNcblx0JCgnLnByIC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ3ByZXZpZXdfc3R5bGVfbXVsdGkgaGlkZGVuJyk7XG5cdCQoJy5wciAuaXAnKS5yZW1vdmVDbGFzcygnaXBfc3R5bGVfbXVsdGknKTtcblx0JCgnI3NhdmVDaGFuZ2VzJykudGV4dCgnU2F2ZScpO1xuXHQvLyQoJyNpcF9fdGl0bGUnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdCQoJy5wciAuaW1hZ2VzJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHQkKCcjdGl0bGUnKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdCQoJyN0aXRsZScpLnBhcmVudCgpLmNoaWxkcmVuKCdsYWJlbCcpLmFkZENsYXNzKCdyZXF1aWVyZWQnKTtcblx0JCgnI3RpdGxlJykucHJvcCgncmVxdWlyZWQnLCB0cnVlKTtcblxuXHRmdW5jdGlvbiByZXNpemVJbWFnZVdyYXBwZXIoKSB7XG5cdFx0dmFyIGltYWdlc1dyYXBwZXJXaWR0aCA9ICQoJy5pbWFnZXNfX3dyYXBwZXInKS53aWR0aCgpO1xuXHRcdGltYWdlc1dpZHRoID0gd2luZG93LmlubmVyV2lkdGggPCA2MDAgPyAkKCcuaW1hZ2VzX19jb250YWluZXIgLmltYWdlJykubGVuZ3RoICogMTAwIDogJCgnLmltYWdlc19fY29udGFpbmVyIC5pbWFnZScpLmxlbmd0aCAqIDEyMDtcblx0XHRpZiAoaW1hZ2VzV3JhcHBlcldpZHRoID4gaW1hZ2VzV2lkdGgpIHtcblx0XHRcdCQoJy5pbWFnZXNfX3Njcm9sbC1sZWZ0LCAuaW1hZ2VzX19zY3JvbGwtcmlnaHQnKS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoJy5pbWFnZXNfX2NvbnRhaW5lcicpLmNzcygnd2lkdGgnLCBpbWFnZXNXaWR0aC50b1N0cmluZygpICsgJ3B4Jyk7XG5cdFx0XHQkKCcuaW1hZ2VzX19zY3JvbGwtbGVmdCwgLmltYWdlc19fc2Nyb2xsLXJpZ2h0JykuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoZmlsZXMubGVuZ3RoID4gMSkge1xuXHRcdHZhciBpbWdDb250YWluZXIgPSAkKCcucHIgLmltYWdlc19fY29udGFpbmVyJyk7XG5cdFx0aW1nQ29udGFpbmVyLmVtcHR5KCk7XG5cblx0XHQvL0FkZCBpbWFnZXMgcHJldmllcyB0byB0aGUgY29udGFpbmVyXG5cdFx0ZmlsZXMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0XHR2YXJcdGltYWdlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UgaW1hZ2Vfc3R5bGVfbXVsdGknKS5jbGljayhoYW5kbGVJbWFnZVN3aXRjaCksXG5cdFx0XHRyZXF1aXJlZE1hcmsgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZV9fcmVxdWlyZWQtbWFyaycpLFxuXHRcdFx0ZmlsZUluZGV4ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaGlkZGVuIGZpbGVfX2lkJykudGV4dChmLmZpbGVEYXRhLmlkKS5hdHRyKCdkYXRhLWlkJywgZi5maWxlRGF0YS5pZCk7XG5cdFx0XHRpbWFnZS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyBmLmZpbGVEYXRhLnVybCArICcpJykuYXBwZW5kKHJlcXVpcmVkTWFyaywgZmlsZUluZGV4KTtcblx0XHRcdGltZ0NvbnRhaW5lci5hcHBlbmQoaW1hZ2UpO1xuXHRcdH0pO1xuXG5cdFx0Ly9BZGQgYWN0aXZlIHN0YXRlIHRvIHRoZSBwcmV2aWV3IG9mIHRoZSBmaXJzdCBpbWFnZVxuXHRcdHZhciBmaXJzdEltYWdlID0gJCgnLmltYWdlc19fY29udGFpbmVyIC5pbWFnZScpLmZpcnN0KCk7XG5cdFx0Zmlyc3RJbWFnZS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cblx0XHQkKCcucHIgLmltYWdlcycpLmFkZENsYXNzKCdpbWFnZXNfc3R5bGVfbXVsdGknKS5yZW1vdmVDbGFzcygnaGlkZGVuIGltYWdlc19zdHlsZV9idWxrJyk7XG5cblx0XHQkKCcucHIgLnByZXZpZXcnKS5yZW1vdmVDbGFzcygnaGlkZGVuJykuYWRkQ2xhc3MoJ3ByZXZpZXdfc3R5bGVfbXVsdGknKTtcblx0XHQkKCcucHIgLmlwJykuYWRkQ2xhc3MoJ2lwX3N0eWxlX211bHRpJyk7XG5cblx0XHQvL0FkanVzdCBpbWFnZSBwcmV2aWV3cyBjb250YWluZXJcblx0XHQkKCcjaW1hZ2VzX193cmFwcGVyJykuc2Nyb2xsTGVmdCgwKTtcblx0XHQkKHdpbmRvdykucmVzaXplKHJlc2l6ZUltYWdlV3JhcHBlcik7XG5cdFx0cmVzaXplSW1hZ2VXcmFwcGVyKCk7XG5cblx0XHQvL0FkZCBhY3Rpb25zIHRvIHNjcm9sbCBidXR0b25zXG5cdFx0JCgnLmltYWdlc19fc2Nyb2xsLWxlZnQnKS51bmJpbmQoJ2NsaWNrJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdCQoJyNpbWFnZXNfX3dyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6ICctPTQ4MCcgfSwgNjAwKTtcblx0XHR9KTtcblx0XHQkKCcuaW1hZ2VzX19zY3JvbGwtcmlnaHQnKS51bmJpbmQoJ2NsaWNrJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdCQoJyNpbWFnZXNfX3dyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6ICcrPTQ4MCcgfSwgNjAwKTtcblx0XHR9KTtcblx0fVxuXHRoaWRlTG9hZGVyKCk7XG5cdHNldE1vZGFsS2V5Ym9hcmRBY3Rpb25zKHNhdmVJbWFnZUVkaXQsIGNhbmNlbEltYWdlRWRpdCk7XG5cbn1cbmZ1bmN0aW9uIGVkaXRGaWxlcyhmaWxlcykge1xuXHRlZGl0ZWRGaWxlc0RhdGEgPSBbXS5jb25jYXQoZmlsZXMpO1xuXG5cdGlmIChlZGl0ZWRGaWxlc0RhdGEubGVuZ3RoID4gMCkge1xuXHRcdGVkaXRlZEZpbGVEYXRhID0gZWRpdGVkRmlsZXNEYXRhWzBdO1xuXHRcdGxvYWRGaWxlKGVkaXRlZEZpbGVEYXRhKTtcblx0XHRzaG93RmlsZXMoZWRpdGVkRmlsZXNEYXRhKTtcblx0fVxufVxuXG5cbi8vQnVsayBFZGl0XG5mdW5jdGlvbiBidWxrRWRpdEZpbGVzKGZpbGVzLCB0eXBlKSB7XG5cdHZhciBjbG9uZWRHYWxsZXJ5T2JqZWN0cyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZ2FsbGVyeU9iamVjdHMpKTtcblx0dmFyIGZpbGVzVHlwZTtcblx0ZWRpdGVkRmlsZXNEYXRhID0gW107IC8vQ2xlYXIgZmlsZXMgZGF0YSB0aGF0IHBvc3NpYmx5IGNvdWxkIGJlIGhlcmVcblxuXHQvL09idGFpbiBmaWxlcyBkYXRhIGZvciBmaWxlcyB0aGF0IHNob3VsZCBiZSBlZGl0ZWRcblx0ZmlsZXMuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuXHRcdHZhciBmaWxlID0gY2xvbmVkR2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcblx0XHRcdHJldHVybiBmLmZpbGVEYXRhLmlkID09PSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG5cdFx0fSlbMF07XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLnB1c2goZmlsZSk7XG5cdH0pO1xuXG5cdGlmIChlZGl0ZWRGaWxlc0RhdGEubGVuZ3RoID4gMCkge1xuXHRcdHN3aXRjaCAoZWRpdGVkRmlsZXNEYXRhWzBdLmZpbGVEYXRhLnR5cGUpIHtcblx0XHRcdGNhc2UgJ2ltYWdlJzpcblx0XHRcdGVkaXRlZEZpbGVEYXRhID0ge1xuXHRcdFx0XHRmaWxlRGF0YToge1xuXHRcdFx0XHRcdHVybDogJycsXG5cdFx0XHRcdFx0Zm9jYWxQb2ludDoge1xuXHRcdFx0XHRcdFx0bGVmdDogMC41LFxuXHRcdFx0XHRcdFx0dG9wOiAwLjVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGlkOiAnJyxcblx0XHRcdFx0XHRjb2xvcjogJycsXG5cdFx0XHRcdFx0dGl0bGU6ICcnLFxuXHRcdFx0XHRcdGNhcHRpb246ICcnLFxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiAnJyxcblx0XHRcdFx0XHRoaWdoUmVzb2x1dGlvbjogZmFsc2UsXG5cdFx0XHRcdFx0Y2F0ZWdvcmllczogJycsXG5cdFx0XHRcdFx0dGFnczogJycsXG5cdFx0XHRcdFx0YWx0VGV4dDogJycsXG5cdFx0XHRcdFx0Y3JlZGl0OiAnJyxcblx0XHRcdFx0XHRjb3B5cmlnaHQ6ICcnLFxuXHRcdFx0XHRcdHJlZmVyZW5jZToge1xuXHRcdFx0XHRcdFx0c2VyaWVzOiAnJyxcblx0XHRcdFx0XHRcdHNlYXNvbjogJycsXG5cdFx0XHRcdFx0XHRlcGlzb2RlOiAnJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dHlwZTogJ2ltYWdlJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRidWxrRWRpdDogdHJ1ZVxuXHRcdFx0fTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlICd2aWRlbyc6XG5cdFx0XHRlZGl0ZWRGaWxlRGF0YSA9IHtcblx0XHRcdFx0ZmlsZURhdGE6IHtcblx0XHRcdFx0XHR1cmw6ICcnLFxuXHRcdFx0XHRcdHBsYXllcjogJycsXG5cdFx0XHRcdFx0dHlwZTogJ3ZpZGVvJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRidWxrRWRpdDogdHJ1ZVxuXHRcdFx0fTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdFx0bG9hZEZpbGUoZWRpdGVkRmlsZURhdGEpO1xuXHRcdHNob3dCdWxrRmlsZXMoZWRpdGVkRmlsZXNEYXRhKTtcblxuXHR9XG59XG5mdW5jdGlvbiBzaG93QnVsa0ZpbGVzKGZpbGVzKSB7XG5cdGRhdGFDaGFuZ2VkID0gZmFsc2U7XG5cdHNjcm9sbFBvc2l0aW9uID0gJCgnYm9keScpLnNjcm9sbFRvcCgpO1xuXHQvL1Nob3cgaW5pdGlhbCBlZGl0IHNjcmVlbiBmb3Igc2luZ2xlIGltYWdlLlxuXHQkKCcucHInKS5yZW1vdmVDbGFzcygnaGlkZGVuIHZpZGVvJylcblx0LmFkZENsYXNzKCdtb2RhbCBidWxrJyk7XG5cdCQoJyN3cmFwcGVyJykuYWRkQ2xhc3MoJ292ZXJmbG93Jyk7XG5cblx0Ly9SZW1vdmUgYWxsIG11bHRpcGxlIGltYWdlcyBzdHlsZSBhdHRyaWJ1dGVzXG5cdCQoJy5wciAucHJldmlldycpLnJlbW92ZUNsYXNzKCdwcmV2aWV3X3N0eWxlX211bHRpIGhpZGRlbicpO1xuXHQkKCcucHIgLmlwJykucmVtb3ZlQ2xhc3MoJ2lwX3N0eWxlX211bHRpJyk7XG5cdCQoJyNzYXZlQ2hhbmdlcycpLnRleHQoJ1NhdmUnKTtcblx0JCgnI3RpdGxlJykucGFyZW50KCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHQkKCcjdGl0bGUnKS5yZW1vdmVQcm9wKCdyZXF1aXJlZCcpO1xuXHQkKCcjdGl0bGUnKS5wYXJlbnQoKS5jaGlsZHJlbignbGFiZWwnKS5yZW1vdmVDbGFzcygncmVxdWllcmVkJyk7XG5cblx0dmFyIGltZ0NvbnRhaW5lciA9ICQoJy5wciAuaW1hZ2VzX19jb250YWluZXInKTtcblx0aW1nQ29udGFpbmVyLmVtcHR5KCk7XG5cblx0Ly9BZGQgaW1hZ2VzIHByZXZpZXMgdG8gdGhlIGNvbnRhaW5lclxuXHRmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHR2YXJcdGltYWdlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UgaW1hZ2Vfc3R5bGVfYnVsaycpLFxuXHRcdGZpbGVJbmRleCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2hpZGRlbiBmaWxlX19pZCcpLnRleHQoZi5maWxlRGF0YS5pZCk7XG5cdFx0aW1hZ2UuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgZi5maWxlRGF0YS51cmwgKyAnKScpLmFwcGVuZChmaWxlSW5kZXgpO1xuXHRcdGltZ0NvbnRhaW5lci5hcHBlbmQoaW1hZ2UpO1xuXHR9KTtcblxuXHQkKCcucHIgLmltYWdlcycpLmFkZENsYXNzKCdpbWFnZXNfc3R5bGVfYnVsaycpLnJlbW92ZUNsYXNzKCdoaWRkZW4gaW1hZ2VzX3N0eWxlX211bHRpJyk7XG5cdCQoJy5wciAucHJldmlldycpLmFkZENsYXNzKCdoaWRkZW4nKTtcblxuXHRoaWRlTG9hZGVyKCk7XG5cdHNldE1vZGFsS2V5Ym9hcmRBY3Rpb25zKHNhdmVJbWFnZUVkaXQsIGNhbmNlbEltYWdlRWRpdCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUJ1bGtFZGl0QnV0dG9uQ2xpY2soZSkge1xuXHQkKGUudGFyZ2V0KS5ibHVyKCk7XG5cdHZhciBmaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpLFxuXHRudW1iZXJPZlNlbGVjdGVkSW1hZ2VzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLWltZ0ZpbGVUeXBlLnNlbGVjdGVkJykubGVuZ3RoLFxuXHRudW1iZXJPZlNlbGVjdGVkVmlkZW9zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLXZpZGVvRmlsZVR5cGUuc2VsZWN0ZWQnKS5sZW5ndGg7XG5cblx0aWYgKG51bWJlck9mU2VsZWN0ZWRJbWFnZXMgJiYgbnVtYmVyT2ZTZWxlY3RlZFZpZGVvcykge1xuXHRcdG5ldyBNb2RhbCh7XG5cdFx0XHR0aXRsZTogJ1lvdSBjYW5cXCd0IGJ1bGsgZWRpdCBpbWFnZXMgYW5kIHZpZGVvcycsXG5cdFx0XHR0ZXh0OiAnWW91IGNhblxcJ3QgYnVsayBlZGl0IGltYWdlcyBhbmQgdmlkZW9zIGF0IG9uY2UuIFBsZWFzZSBzZWxlY3QgZmlsZXMgb2YgdGhlIHNhbWUgdHlwZSBhbmQgdHJ5IGFnYWluLicsXG5cdFx0XHRjb25maXJtVGV4dDogJ09rJyxcblx0XHRcdG9ubHlDb25maXJtOiB0cnVlXG5cdFx0fSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0aWYgKG51bWJlck9mU2VsZWN0ZWRWaWRlb3MpIHtcblx0XHRcdGJ1bGtFZGl0RmlsZXMoZmlsZXMsICd2aWRlb3MnKTtcblx0XHR9IGVsc2UgaWYobnVtYmVyT2ZTZWxlY3RlZEltYWdlcykge1xuXHRcdFx0YnVsa0VkaXRGaWxlcyhmaWxlcywgJ2ltYWdlcycpO1xuXHRcdH1cblx0fVxufVxuXG4vL0hlbHAgZnVuY3Rpb25cbmZ1bmN0aW9uIGZpbGVCeUlkKGlkLCBmaWxlcykge1xuXHRmaWxlc0ZpbHRlcmVkID0gZmlsZXMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcblx0XHRyZXR1cm4gZi5maWxlRGF0YS5pZCA9PT0gaWQ7XG5cdH0pO1xuXHRyZXR1cm4gZmlsZXNGaWx0ZXJlZFswXTtcbn1cblxuLy9TYXZlIGZpbGVcbmZ1bmN0aW9uIHNhdmVGaWxlKGZpbGVzLCBmaWxlKSB7XG5cdGZpbGVzLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdGlmIChmLmZpbGVEYXRhLmlkID09PSBmaWxlLmZpbGVEYXRhLmlkKSB7XG5cdFx0XHRmID0gZmlsZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzd2l0Y2hJbWFnZShpbWFnZSkge1xuXHQkKCcucHJldmlld19faW1hZ2Utd3JhcHBlcicpLnJlbW92ZUNsYXNzKCdpcy1zbGlkaW5nTGVmdCBpcy1zbGlkaW5nUmlnaHQnKTtcblx0dmFyIG5ld0ZpbGVJZCA9IGltYWdlLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKSxcblx0bmV3RmlsZSA9IGZpbGVCeUlkKG5ld0ZpbGVJZCwgZWRpdGVkRmlsZXNEYXRhKSxcblx0bmV3SW5kZXggPSBpbWFnZS5pbmRleCgpLFxuXHRjdXJyZW50SW1hZ2UgPSAkKCcuaW1hZ2UuaXMtYWN0aXZlJyksXG5cdGN1cnJlbnRJbmRleCA9IGN1cnJlbnRJbWFnZS5pbmRleCgpLFxuXHRjdXJyZW50RmlsZSA9IGZpbGVCeUlkKGN1cnJlbnRJbWFnZS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCksIGVkaXRlZEZpbGVzRGF0YSksXG5cdGJhY2tJbWFnZSA9ICQoJyNwcmV2aWV3SW1nQmFjaycpLFxuXHRwcmV2aWV3SW1hZ2UgPSAkKCcjcHJldmlld0ltZycpO1xuXG5cdHNhdmVGaWxlKGVkaXRlZEZpbGVzRGF0YSwgZWRpdGVkRmlsZURhdGEpO1xuXHRlZGl0ZWRGaWxlRGF0YSA9IG5ld0ZpbGU7XG5cdGxvYWRGaWxlKGVkaXRlZEZpbGVEYXRhKTtcblxuXHRjdXJyZW50SW1hZ2UucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRpbWFnZS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cblx0aWYgKGN1cnJlbnRJbmRleCA+IG5ld0luZGV4KSB7XG5cdFx0JCgnLnByZXZpZXdfX2ltYWdlLXdyYXBwZXInKS5hZGRDbGFzcygnaXMtc2xpZGluZ0xlZnQnKTtcblx0fSBlbHNlIHtcblx0XHQkKCcucHJldmlld19faW1hZ2Utd3JhcHBlcicpLmFkZENsYXNzKCdpcy1zbGlkaW5nUmlnaHQnKTtcblx0fVxuXG5cdHZhciBpbWFnZUNvbnRhaW5lciA9IGltYWdlLnBhcmVudHMoJy5pbWFnZXNfX2NvbnRhaW5lcicpLFxuXHRpbWFnZVdyYXBwZXIgPSBpbWFnZS5wYXJlbnRzKCcuaW1hZ2VzX193cmFwcGVyJyksXG5cdGltYWdlTGVmdEVuZCA9IGltYWdlQ29udGFpbmVyLnBvc2l0aW9uKCkubGVmdCArIGltYWdlLnBvc2l0aW9uKCkubGVmdCxcblx0aW1hZ2VSaWdodEVuZCA9IGltYWdlQ29udGFpbmVyLnBvc2l0aW9uKCkubGVmdCArIGltYWdlLnBvc2l0aW9uKCkubGVmdCArIGltYWdlLndpZHRoKCk7XG5cblx0aWYgKGltYWdlTGVmdEVuZCA8IDApIHtcblx0XHQkKCcjaW1hZ2VzX193cmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiBpbWFnZS5wb3NpdGlvbigpLmxlZnQgLSAzMH0sIDQwMCk7XG5cdH0gZWxzZSBpZiAoaW1hZ2VSaWdodEVuZCA+IGltYWdlV3JhcHBlci53aWR0aCgpKSB7XG5cdFx0JCgnI2ltYWdlc19fd3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogaW1hZ2UucG9zaXRpb24oKS5sZWZ0ICsgaW1hZ2Uud2lkdGgoKSAtIGltYWdlV3JhcHBlci53aWR0aCgpICsgNTB9LCA0MDApO1xuXHR9XG5cblx0Ly9DbG9zZSBhbGwgcHJldmlld3MgaWYgdGhlcmUgaXMgb3BlblxuXHRoaWRlQWxsUHJldmlld3MoKTtcblx0Ly8gQWRqdXN0IGZvY2FsIHJlY3RhbmdsZVxuXHRhZGp1c3RSZWN0KCQoJy5wdXJwb3Nlc19fY29udGFpbmVyIC5wdXJwb3NlLWltZycpLmZpcnN0KCkpO1xuXHQkKCcjcHVycG9zZVdyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6ICcwJyB9LCA4MDApO1xufVxuZnVuY3Rpb24gaGFuZGxlSW1hZ2VTd2l0Y2goZSkge1xuXHRzd2l0Y2hJbWFnZSgkKGUudGFyZ2V0KSk7XG59XG5cbi8vRnVuY3Rpb24gZm9yIGhhbmRsZSBFZGl0IEJ1dHRvbiBjbGlja3NcbmZ1bmN0aW9uIGhhbmRsZUZpbGVkRWRpdEJ1dHRvbkNsaWNrKGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0dmFyIGZpbGVFbGVtZW50ID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKTtcblxuXHR2YXIgZmlsZSA9IGdhbGxlcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG5cdFx0cmV0dXJuIGYuZmlsZURhdGEuaWQgPT09ICQoZmlsZUVsZW1lbnQpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcblx0fSk7XG5cblx0ZWRpdEZpbGVzKGZpbGUpO1xufVxuZnVuY3Rpb24gaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2soZSkge1xuXHQkKGUudGFyZ2V0KS5ibHVyKCk7XG5cdHZhciBmaWxlc0VsZW1lbnRzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkJyksXG5cdGNsb25lZEdhbGxlcnlPYmplY3RzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShnYWxsZXJ5T2JqZWN0cykpLFxuXHRmaWxlcyA9IFtdLFxuXHRudW1iZXJPZlNlbGVjdGVkSW1hZ2VzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLWltZ0ZpbGVUeXBlLnNlbGVjdGVkJykubGVuZ3RoLFxuXHRudW1iZXJPZlNlbGVjdGVkVmlkZW9zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLXZpZGVvRmlsZVR5cGUuc2VsZWN0ZWQnKS5sZW5ndGg7XG5cblx0aWYgKG51bWJlck9mU2VsZWN0ZWRJbWFnZXMgJiYgbnVtYmVyT2ZTZWxlY3RlZFZpZGVvcykge1xuXHRcdG5ldyBNb2RhbCh7XG5cdFx0XHR0aXRsZTogJ1lvdSBjYW5cXCd0IG11bHRpIGVkaXQgaW1hZ2VzIGFuZCB2aWRlb3MnLFxuXHRcdFx0dGV4dDogJ1lvdSBjYW5cXCd0IG11bHRpIGVkaXQgaW1hZ2VzIGFuZCB2aWRlb3MgYXQgb25jZS4gUGxlYXNlIHNlbGVjdCBmaWxlcyBvZiB0aGUgc2FtZSB0eXBlIGFuZCB0cnkgYWdhaW4uJyxcblx0XHRcdGNvbmZpcm1UZXh0OiAnT2snLFxuXHRcdFx0b25seUNvbmZpcm06IHRydWVcblx0XHR9KTtcblx0fVxuXHRlbHNlIHtcblx0XHQvL09idGFpbiBmaWxlcyBkYXRhIGZvciBmaWxlcyB0aGF0IHNob3VsZCBiZSBlZGl0ZWRcblx0XHRmaWxlc0VsZW1lbnRzLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcblx0XHRcdHZhciBmaWxlID0gW10uY29uY2F0KGNsb25lZEdhbGxlcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG5cdFx0XHRcdHJldHVybiBmLmZpbGVEYXRhLmlkID09PSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG5cdFx0XHR9KSlbMF07XG5cdFx0XHRmaWxlcy5wdXNoKGZpbGUpO1xuXHRcdH0pO1xuXG5cdFx0ZWRpdEZpbGVzKGZpbGVzKTtcblx0fVxufVxuXG5cbmZ1bmN0aW9uIGNhbmNlbEltYWdlRWRpdCgpIHtcblxuXHQvLyBVc2UgZGF0YUNoYW5nZWQgdG8gY2hlY2sgaWYgYW55IGRhdGEgaGFzIGNoYW5nZWQgYW5kIHNob3cgdGhlIG1vZGFsLiBDdXJyZW50bHlcblx0Ly8gdGhlIHZhbHVlIGlzIG5vdCBiZWluZyBzZXQgY29ycmVudGx5IHNvIHdlIGFyZSBhbHdheXMgc2hvd2luZyB0aGUgZGlhbG9nLlxuXHQvL2lmIChkYXRhQ2hhbmdlZCkge1xuXHRpZiAodHJ1ZSkge1xuXHRcdG5ldyBNb2RhbCh7XG5cdFx0XHRkaWFsb2c6IHRydWUsXG5cdFx0XHR0aXRsZTogJ0NhbmNlbCBDaGFuZ2VzPycsXG5cdFx0XHR0ZXh0OiAnQW55IHVuc2F2ZWQgY2hhbmdlcyB5b3UgbWFkZSB3aWxsIGJlIGxvc3QuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBjYW5jZWw/Jyxcblx0XHRcdGNvbmZpcm1UZXh0OiAnQ2FuY2VsJyxcblx0XHRcdGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjbG9zZUVkaXRTY3JlZW4oKTtcblx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVzY0tleWRvd24pO1xuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcblx0XHRcdH0sXG5cdFx0XHRjYW5jZWxBY3Rpb246IHNldE1vZGFsS2V5Ym9hcmRBY3Rpb25zKHNhdmVJbWFnZUVkaXQsIGNhbmNlbEltYWdlRWRpdClcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRjbG9zZUVkaXRTY3JlZW4oKTtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG5cdH1cbn1cbmZ1bmN0aW9uIHNhdmVJbWFnZUVkaXQoKSB7XG5cdHZhciBlbXB0eVJlcXVpcmVkRmllbGQgPSBmYWxzZSxcblx0ZW1wdHlJbWFnZTtcblx0dmFyIGVtcHR5RmllbGRzID0gY2hlY2tGaWVsZHMoJy5wciBsYWJlbC5yZXF1aWVyZWQnKTtcblx0aWYgKGVtcHR5RmllbGRzIHx8IGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLnR5cGUgPT09ICd2aWRlbycpIHtcblx0XHRlZGl0ZWRGaWxlc0RhdGEuZm9yRWFjaChmdW5jdGlvbihmZCkge1xuXHRcdFx0aWYgKGZkLmZpbGVEYXRhLnRpdGxlID09PSAnJyAmJiAhZW1wdHlSZXF1aXJlZEZpZWxkKSB7XG5cdFx0XHRcdGVtcHR5UmVxdWlyZWRGaWVsZCA9IHRydWU7XG5cdFx0XHRcdGVtcHR5SW1hZ2UgPSAkKCcuaW1hZ2UuaW1hZ2Vfc3R5bGVfbXVsdGkgLmZpbGVfX2lkW2RhdGEtaWQ9XCInICsgZmQuZmlsZURhdGEuaWQgKyAnXCJdJykucGFyZW50cygnLmltYWdlJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoZW1wdHlSZXF1aXJlZEZpZWxkKSB7XG5cdFx0XHRzd2l0Y2hJbWFnZShlbXB0eUltYWdlKTtcblx0XHRcdCQoJy5qcy1yZXF1aXJlZCcpLm5vdCgnLmpzLWhhc1ZhbHVlJykuZmlyc3QoKS5hZGRDbGFzcygnaW5wdXRfc3RhdGVfZXJyIGlzLWJsaW5raW5nJykuZm9jdXMoKTtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGlmIChlLmFuaW1hdGlvbk5hbWUgPT09ICd0ZXh0ZmllbGQtZm9jdXMtYmxpbmsnKSB7JChlLnRhcmdldCkucGFyZW50KCkuZmluZCgnLmlzLWJsaW5raW5nJykucmVtb3ZlQ2xhc3MoJ2lzLWJsaW5raW5nJyk7fVxuXHRcdFx0fSk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGNsb25lZEVkaXRlZEZpbGVzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShlZGl0ZWRGaWxlc0RhdGEpKTtcblx0XHRcdGNsb25lZEVkaXRlZEZpbGVzLmZvckVhY2goZnVuY3Rpb24oZmQpIHtcblx0XHRcdFx0dmFyIGZpbGUgPSBnYWxsZXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuXHRcdFx0XHRcdHJldHVybiBmLmZpbGVEYXRhLmlkID09PSBmZC5maWxlRGF0YS5pZDtcblx0XHRcdFx0fSlbMF07XG5cdFx0XHRcdHZhciBmaWxlSW5kZXggPSBnYWxsZXJ5T2JqZWN0cy5pbmRleE9mKGZpbGUpO1xuXG5cdFx0XHRcdGdhbGxlcnlPYmplY3RzID0gZ2FsbGVyeU9iamVjdHMuc2xpY2UoMCwgZmlsZUluZGV4KS5jb25jYXQoW2ZkXSkuY29uY2F0KGdhbGxlcnlPYmplY3RzLnNsaWNlKGZpbGVJbmRleCArIDEpKTtcblxuXHRcdFx0fSk7XG5cdFx0XHRzaG93Tm90aWZpY2F0aW9uKCdUaGUgY2hhbmdlIGluIHRoZSBtZXRhZGF0YSBpcyBzYXZlZCB0byB0aGUgYXNzZXQuJyk7XG5cdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG5cdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcblx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge2Nsb3NlRWRpdFNjcmVlbigpO30sIDIwMDApO1xuXHRcdFx0Y29uc29sZS5sb2coZ2FsbGVyeU9iamVjdHMpO1xuXHRcdFx0ZGVzZWxlY3RBbGwoKTtcblx0XHRcdHVwZGF0ZUdhbGxlcnkoKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gaGlkZUFsbFByZXZpZXdzKCkge1xuICAkKCcjcHVycG9zZXMnKS5yZW1vdmVDbGFzcygnaXMtb3BlbicpO1xuICAkKCcjcHVycG9zZXMnKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG4gICQoJyNwcmV2aWV3SW1hZ2UnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICQoJyNwcmV2aWV3Q29udHJvbHMnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cbiAgLy9DaGFuZ2UgYnV0dG9uIHRleHQsIGljb24gYW5kIGNsaWNrIGhhbmRsZXJcbiAgJCgnI3Nob3dQcmV2aWV3Jykub2ZmKCdjbGljaycsIGhpZGVBbGxQcmV2aWV3cykuY2xpY2soc2hvd0FsbFByZXZpZXdzKTtcbiAgJCgnI3Nob3dQcmV2aWV3IHNwYW4nKS50ZXh0KCdWaWV3IEFsbCcpO1xuICAkKCcjc2hvd1ByZXZpZXcgaScpLnJlbW92ZUNsYXNzKCdmYS1hcnJvdy1kb3duJykuYWRkQ2xhc3MoJ2ZhLWFycm93LXVwJyk7XG59XG5cbmZ1bmN0aW9uIHNob3dBbGxQcmV2aWV3cygpIHtcbiAgJCgnI3B1cnBvc2VzJykuYWRkQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgJCgnI3B1cnBvc2VzJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAkKCcjcHJldmlld0ltYWdlJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAkKCcjcHJldmlld0NvbnRyb2xzJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG4gIC8vQ2hhbmdlIGJ1dHRvbiB0ZXh0LCBpY29uIGFuZCBjbGljayBoYW5kbGVyXG4gICQoJyNzaG93UHJldmlldycpLm9mZignY2xpY2snLCBzaG93QWxsUHJldmlld3MpLmNsaWNrKGhpZGVBbGxQcmV2aWV3cyk7XG4gICQoJyNzaG93UHJldmlldyBzcGFuJykudGV4dCgnQ29sbGFwc2UnKTtcbiAgJCgnI3Nob3dQcmV2aWV3IGknKS5yZW1vdmVDbGFzcygnZmEtYXJyb3ctdXAnKS5hZGRDbGFzcygnZmEtYXJyb3ctZG93bicpO1xuXG4gIC8vIEFkanVzdCBwcmV2aWV3cyBjbGljayBmaW5jdGlvblxuICAkKCcucHVycG9zZXNfX2NvbnRhaW5lciAucHVycG9zZS5pcy1hY3RpdmUnKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICQoJy5wdXJwb3Nlc19fY29udGFpbmVyIC5wdXJwb3NlLWltZycpLnVuYmluZCgpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICBoaWRlQWxsUHJldmlld3MoKTtcbiAgICBhZGp1c3RSZWN0KCQoZS50YXJnZXQpKTtcblx0XHQvLyBTY3JvbGwgcHJldmlld3MgdG8gdGhlIHNlbGVjdGVkIG9uZVxuXHRcdHZhciBwcmV2aWV3SW5kZXggPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcucHVycG9zZScpLmluZGV4KCcucHVycG9zZXNfX2NvbnRhaW5lciAucHVycG9zZScpO1xuXHRcdCQoJyNwdXJwb3NlV3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogcHJldmlld0luZGV4ICogMTAwIH0sIDYwMCk7XG4gIH0pO1xuXG4gIC8vQ2hlY2sgaWYgaXQgaXMgYSBtb2JpbGUgc2NyZWVuXG4gIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDY1MCkge1xuICAgICQoXCIjcHVycG9zZXMgLnB1cnBvc2VzX19jb250YWluZXIgLnB1cnBvc2VcIikuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICQoXCIjcHVycG9zZXMgLnB1cnBvc2VzX19jb250YWluZXIgLnB1cnBvc2UuaGlkZGVuXCIpLnNsaWNlKDAsIDUpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAkKCcjbG9hZE1vcmUnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gIH1cbiAgLy8kKCcucHJldmlldy5mb2NhbCcpLmFkZENsYXNzKCdmdWxsJykucmVtb3ZlQ2xhc3MoJ2xpbmUnKTtcbiAgLy8kKCcjcHVycG9zZVRvZ2dsZScpLmNoaWxkcmVuKCdzcGFuJykudGV4dCgnSGlkZSBQcmV2aWV3Jyk7XG59XG4vKlF1aWNrIEVkaXQgRmlsZSBUaXRsZSBhbmQgSW5mbyAqL1xuZnVuY3Rpb24gZWRpdEZpbGVUaXRsZShlKSB7XG5cdGlmICghJCgnLmFsJykuaGFzQ2xhc3MoJ21vZGFsJykpIHtcblx0XHR2YXIgZmlsZUluZm8gPSBlLnRhcmdldDtcblx0XHR2YXIgZmlsZUluZm9UZXh0ID0gZmlsZUluZm8uaW5uZXJIVE1MO1xuXHRcdHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cdFx0aW5wdXQudHlwZSA9ICd0ZXh0Jztcblx0XHRpbnB1dC52YWx1ZSA9IGZpbGVJbmZvVGV4dDtcblxuXHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgaW5wdXQgPSBlLnRhcmdldDtcblx0XHRcdGZpbGVJbmZvID0gaW5wdXQucGFyZW50Tm9kZTtcblx0XHRcdGZpbGVJbmZvLnJlbW92ZUNoaWxkKGlucHV0KTtcblx0XHRcdGZpbGVJbmZvLmNsYXNzTGlzdC5yZW1vdmUoJ2VkaXQnKTtcblx0XHRcdGZpbGVJbmZvLmlubmVySFRNTCA9IGlucHV0LnZhbHVlO1xuXHRcdH0pO1xuXHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAxMyB8fCBlLndoaWNoID09IDEzKSB7XG5cdFx0XHRcdHZhciBpbnB1dCA9IGUudGFyZ2V0O1xuXHRcdFx0XHRmaWxlSW5mbyA9IGlucHV0LnBhcmVudE5vZGU7XG5cdFx0XHRcdGZpbGVJbmZvLnJlbW92ZUNoaWxkKGlucHV0KTtcblx0XHRcdFx0ZmlsZUluZm8uY2xhc3NMaXN0LnJlbW92ZSgnZWRpdCcpO1xuXHRcdFx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSBpbnB1dC52YWx1ZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGZpbGVJbmZvLmlubmVySFRNTCA9ICcnO1xuXHRcdGZpbGVJbmZvLmFwcGVuZENoaWxkKGlucHV0KTtcblx0XHRmaWxlSW5mby5jbGFzc0xpc3QuYWRkKCdlZGl0Jyk7XG5cdFx0aW5wdXQuZm9jdXMoKTtcblx0fVxufVxuZnVuY3Rpb24gZWRpdEZpbGVDYXB0aW9uKGUpIHtcblx0aWYgKCEkKCcuYWwnKS5oYXNDbGFzcygnbW9kYWwnKSkge1xuXHRcdHZhciBmaWxlSW5mbyA9IGUudGFyZ2V0O1xuXHRcdHZhciBmaWxlSW5mb1RleHQgPSBmaWxlSW5mby5pbm5lckhUTUw7XG5cdFx0dmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcblx0XHQvL2lucHV0LnR5cGUgPSAndGV4dCdcblx0XHRpbnB1dC52YWx1ZSA9IGZpbGVJbmZvVGV4dDtcblxuXHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgaW5wdXQgPSBlLnRhcmdldDtcblx0XHRcdGZpbGVJbmZvID0gaW5wdXQucGFyZW50Tm9kZTtcblx0XHRcdGZpbGVJbmZvLnJlbW92ZUNoaWxkKGlucHV0KTtcblx0XHRcdGZpbGVJbmZvLmNsYXNzTGlzdC5yZW1vdmUoJ2VkaXQnKTtcblx0XHRcdGZpbGVJbmZvLmlubmVySFRNTCA9IGlucHV0LnZhbHVlO1xuXHRcdH0pO1xuXHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAxMyB8fCBlLndoaWNoID09IDEzKSB7XG5cdFx0XHRcdHZhciBpbnB1dCA9IGUudGFyZ2V0O1xuXHRcdFx0XHRmaWxlSW5mbyA9IGlucHV0LnBhcmVudE5vZGU7XG5cdFx0XHRcdGZpbGVJbmZvLnJlbW92ZUNoaWxkKGlucHV0KTtcblx0XHRcdFx0ZmlsZUluZm8uY2xhc3NMaXN0LnJlbW92ZSgnZWRpdCcpO1xuXHRcdFx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSBpbnB1dC52YWx1ZTtcblx0XHRcdH1cblxuXHRcdH0pO1xuXG5cdFx0ZmlsZUluZm8uaW5uZXJIVE1MID0gJyc7XG5cdFx0ZmlsZUluZm8uYXBwZW5kQ2hpbGQoaW5wdXQpO1xuXHRcdGZpbGVJbmZvLmNsYXNzTGlzdC5hZGQoJ2VkaXQnKTtcblx0XHRpbnB1dC5mb2N1cygpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUZpbGUoZmlsZSwgZmlsZXMpIHtcblx0ZmlsZXMgPSBmaWxlcy5zcGxpY2UoZmlsZXMuaW5kZXhPZihmaWxlKSwgMSk7XG59XG5mdW5jdGlvbiBkZWxldGVGaWxlQnlJZChpZCwgZmlsZXMpIHtcblx0dmFyIGZpbGUgPSBmaWxlQnlJZChpZCwgZmlsZXMpO1xuXHRkZWxldGVGaWxlKGZpbGUsIGZpbGVzKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlRGVsZXRlQ2xpY2soZSkge1xuXHR2YXIgaXRlbU5hbWUgPSAkKCcubWVudSAuaXMtYWN0aXZlJykudGV4dCgpLnRvTG93ZXJDYXNlKCk7XG5cdG5ldyBNb2RhbCh7XG5cdFx0dGl0bGU6ICdSZW1vdmUgQXNzZXQ/Jyxcblx0XHR0ZXh0OiAnU2VsZWN0ZWQgYXNzZXQgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhpcyAnICsgaXRlbU5hbWUgKyAnLiBEb27igJl0IHdvcnJ5LCBpdCB3b27igJl0IGJlIHJlbW92ZWQgZnJvbSB0aGUgQXNzZXQgTGlicmFyeS4nLFxuXHRcdGNvbmZpcm1UZXh0OiAnUmVtb3ZlJyxcblx0XHRjb25maXJtQWN0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBmaWxlSWQgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcblx0XHRcdGRlbGV0ZUZpbGVCeUlkKGZpbGVJZCwgZ2FsbGVyeU9iamVjdHMpO1xuXHRcdFx0dXBkYXRlR2FsbGVyeSgpO1xuXHRcdH1cblx0fSk7XG59XG5cbiQoJy5maWxlLXRpdGxlJykuY2xpY2soZWRpdEZpbGVUaXRsZSk7XG4kKCcuZmlsZS1jYXB0aW9uJykuY2xpY2soZWRpdEZpbGVDYXB0aW9uKTtcblxuLy9GaWxlIHVwbG9hZFxuZnVuY3Rpb24gaGFuZGxlRmlsZXMoZmlsZXMsIGNhbGxiYWNrKSB7XG5cdHZhciBmaWxlc091dHB1dCA9IFtdO1xuXHRpZiAoZmlsZXMgJiYgZmlsZXMubGVuZ3RoID4wKSB7XG5cdFx0Zm9yICh2YXIgaT0wOyBpPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0ZmlsZXNPdXRwdXQucHVzaChmaWxlc1tpXSk7XG5cdFx0fVxuXHRcdC8vc2hvd0xvYWRlcigpO1xuXHRcdHZhciB1cGxvYWRlZEZpbGVzID0gZmlsZXNPdXRwdXQubWFwKGZ1bmN0aW9uKGYpIHtcblx0XHRcdHJldHVybiBmaWxlVG9PYmplY3QoZikudGhlbihmdW5jdGlvbihyZXMpIHtcblx0XHRcdFx0Z2FsbGVyeU9iamVjdHMucHVzaCh7XG5cdFx0XHRcdFx0ZmlsZURhdGE6IHJlcyxcblx0XHRcdFx0XHRzZWxlY3RlZDogZmFsc2UsXG5cdFx0XHRcdFx0cG9zaXRpb246IDEwMDAsXG5cdFx0XHRcdFx0Y2FwdGlvbjogJycsXG5cdFx0XHRcdFx0Z2FsbGVyeUNhcHRpb246IGZhbHNlLFxuXHRcdFx0XHRcdGp1c3RVcGxvYWRlZDogdHJ1ZSxcblx0XHRcdFx0XHRsb2FkaW5nOiB0cnVlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0UHJvbWlzZS5hbGwodXBsb2FkZWRGaWxlcykudGhlbihmdW5jdGlvbihyZXMpIHtcblx0XHRcdGlmIChjYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGdhbGxlcnlPYmplY3RzKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR1cGRhdGVHYWxsZXJ5KGdhbGxlcnlPYmplY3RzLmxlbmd0aCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuLy9Db252ZXJ0IHVwbG9hZGVkIGZpbGVzIHRvIGVsZW1lbnRzXG5mdW5jdGlvbiBmaWxlVG9NYXJrdXAoZmlsZSkge1xuXHRyZXR1cm4gcmVhZEZpbGUoZmlsZSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcblx0XHR2YXIgZmlsZU5vZGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlJyksXG5cblx0XHRcdGZpbGVJbWcgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlLWltZycpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIHJlc3VsdC5zcmMgKyAnKScpLFxuXG5cdFx0XHRmaWxlQ29udHJvbHMgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlLWNvbnRyb2xzJykuY2xpY2sodG9nZ2xlRmlsZVNlbGVjdCksXG5cdFx0XHRjaGVja21hcmsgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjaGVja21hcmsnKS5jbGljayh0b2dnbGVGaWxlU2VsZWN0KSxcblx0XHRcdGNsb3NlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2xvc2UnKS5jbGljayhkZWxldGVGaWxlKSxcblx0XHRcdGVkaXQgPSAkKCc8YnV0dG9uPkVkaXQ8L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uIHdoaXRlT3V0bGluZScpLmNsaWNrKGVkaXRGaWxlKSxcblxuXHRcdFx0ZmlsZVRpdGxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdGl0bGUnKSxcblx0XHRcdGZpbGVUeXBlSWNvbiA9ICQoJzxpIGNsYXNzPVwiZmEgZmEtY2FtZXJhXCI+PC9pPicpLmNzcygnbWFyZ2luLXJpZ2h0JywgJzJweCcpLFxuXHRcdFx0ZmlsZVRpdGxlSW5wdXQgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIiAvPicpLnZhbChyZXN1bHQubmFtZSksXG5cblx0XHRcdGZpbGVDYXB0aW9uID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZS1jYXB0aW9uJykudGV4dChyZXN1bHQubmFtZSkuY2xpY2soZWRpdEZpbGVDYXB0aW9uKSxcblx0XHRcdGZpbGVJbmZvID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZS1pbmZvJykudGV4dChyZXN1bHQuaW5mbyksXG5cblx0XHRcdGZpbGVQdXJwb3NlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZS1wdXJwb3NlJyksXG5cdFx0XHRmaWxlUHVycG9zZVNlbGVjdCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3NlbGVjdCcpLmNsaWNrKG9wZW5TZWxlY3QpLFxuXHRcdFx0c2VsZWN0U3BhbiA9ICQoJzxzcGFuPlNlbGVjdCB1c2U8L3NwYW4+JyksXG5cdFx0XHRzZWxlY3RVbCA9ICQoJzx1bD48L3VsPicpLFxuXHRcdFx0c2VsZWN0TGkxID0gJCgnPGxpPkNvdmVyPC9saT4nKS5jbGljayhzZXRTZWxlY3QpLFxuXHRcdFx0c2VsZWN0TGkyID0gJCgnPGxpPlByaW1hcnk8L2xpPicpLmNsaWNrKHNldFNlbGVjdCksXG5cdFx0XHRzZWxlY3RMaTMgPSAkKCc8bGk+U2Vjb25kYXJ5PC9saT4nKS5jbGljayhzZXRTZWxlY3QpO1xuXG5cdFx0ZmlsZVRpdGxlLmFwcGVuZChmaWxlVHlwZUljb24sIGZpbGVUaXRsZUlucHV0KTtcblx0XHRzZWxlY3RVbC5hcHBlbmQoc2VsZWN0TGkxLCBzZWxlY3RMaTIsIHNlbGVjdExpMyk7XG5cdFx0ZmlsZVB1cnBvc2VTZWxlY3QuYXBwZW5kKHNlbGVjdFNwYW4sIHNlbGVjdFVsKTtcblxuXHRcdGZpbGVQdXJwb3NlLmFwcGVuZChmaWxlUHVycG9zZVNlbGVjdCk7XG5cdFx0ZmlsZUNvbnRyb2xzLmFwcGVuZChjaGVja21hcmssIGNsb3NlLCBlZGl0KTtcblx0XHRmaWxlSW1nLmFwcGVuZChmaWxlQ29udHJvbHMpO1xuXG5cdFx0ZmlsZU5vZGUuYXBwZW5kKGZpbGVJbWcsIGZpbGVUaXRsZSwgZmlsZUNhcHRpb24sIGZpbGVJbmZvLCBmaWxlUHVycG9zZSk7XG5cblx0XHRyZXR1cm4gZmlsZU5vZGU7XG5cdH0pO1xufVxuXG4vL0NvbnZlcnQgdXBsb2FkZWQgZmlsZSB0byBvYmplY3RcbmZ1bmN0aW9uIGZpbGVUb09iamVjdChmaWxlKSB7XG5cdHJldHVybiByZWFkRmlsZShmaWxlKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuXHRcdHJldHVybiB7XG5cdCAgICAgICAgdXJsOiByZXN1bHQuc3JjLFxuXHQgICAgICAgIGZvY2FsUG9pbnQ6IHtcblx0ICAgICAgICAgICAgbGVmdDogMC41LFxuXHQgICAgICAgICAgICB0b3A6IDAuNVxuXHQgICAgICAgIH0sXG5cdFx0XHRpZDogcmVzdWx0Lm5hbWUgKyAnICcgKyBuZXcgRGF0ZSgpLFxuXHRcdFx0ZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKCksXG5cdCAgICAgICAgY29sb3I6ICcnLC8vZmlsZUltZ0NvbG9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqZmlsZUltZ0NvbG9ycy5sZW5ndGgpXSxcblx0ICAgICAgICB0aXRsZTogcmVzdWx0Lm5hbWUsXG5cdCAgICAgICAgY2FwdGlvbjogJycsXG5cdCAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuXHQgICAgICAgIGhpZ2hSZXNvbHV0aW9uOiBmYWxzZSxcblx0ICAgICAgICBjYXRlZ29yaWVzOiAnJyxcblx0ICAgICAgICB0YWdzOiAnJyxcblx0ICAgICAgICBhbHRUZXh0OiAnJyxcblx0ICAgICAgICBjcmVkaXQ6ICcnLFxuXHQgICAgICAgIGNvcHlyaWdodDogJycsXG5cdCAgICAgICAgcmVmZXJlbmNlOiB7XG5cdCAgICAgICAgICAgIHNlcmllczogJycsXG5cdCAgICAgICAgICAgIHNlYXNvbjogJycsXG5cdCAgICAgICAgICAgIGVwaXNvZGU6ICcnXG5cdCAgICAgICAgfSxcblx0XHRcdHR5cGU6ICdpbWFnZSdcblx0ICAgIH07XG5cdH0pO1xufVxuXG4vL1JlYWQgZmlsZSBhbmQgcmV0dXJuIHByb21pc2VcbmZ1bmN0aW9uIHJlYWRGaWxlKGZpbGUpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKFxuXHRcdGZ1bmN0aW9uKHJlcywgcmVqKSB7XG5cdFx0XHR2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0XHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdHJlcyh7c3JjOiBlLnRhcmdldC5yZXN1bHQsXG5cdFx0XHRcdFx0bmFtZTogZmlsZS5uYW1lLFxuXHRcdFx0XHRcdGluZm86IGZpbGUudHlwZSArICcsICcgKyBNYXRoLnJvdW5kKGZpbGUuc2l6ZS8xMDI0KS50b1N0cmluZygpICsgJyBLYid9KTtcblx0XHRcdH07XG5cdFx0XHRyZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZWoodGhpcyk7XG5cdFx0XHR9O1xuXHRcdFx0cmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG5cdFx0fVxuXHQpO1xufVxuXG4vL0xvYWRlcnNcbmZ1bmN0aW9uIHNob3dMb2FkZXIoKSB7XG5cdHZhciBtb2RhbCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsJykuYXR0cignaWQnLCAnbG9hZGVyTW9kYWwnKSxcblx0XHRsb2FkZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdsb2FkZXInKTtcblxuXHRtb2RhbC5hcHBlbmQobG9hZGVyKTtcblx0JCgnYm9keScpLmFwcGVuZChtb2RhbCk7XG59XG5mdW5jdGlvbiBoaWRlTG9hZGVyKCkge1xuXHQkKCcjbG9hZGVyTW9kYWwnKS5yZW1vdmUoKTtcbn1cblxuLy9EcmFnIGFuZCBkcm9wIGZpbGVzXG5mdW5jdGlvbiBoYW5kbGVEcmFnRW50ZXIoZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0ZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwiY29weVwiO1xuXHQkKCcjZHJvcFpvbmUnKS5hZGRDbGFzcygnbW9kYWwnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZHJvcFpvbmVcIikuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgaGFuZGxlRHJhZ0xlYXZlLCB0cnVlKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZURyYWdMZWF2ZShlKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0JChcIiNkcm9wWm9uZVwiKS5yZW1vdmVDbGFzcygnbW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid3JhcHBlclwiKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2NrZWQnKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZURyb3AoZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0JChcIiNkcm9wWm9uZVwiKS5yZW1vdmVDbGFzcygnbW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdHZhciBmaWxlcyA9IGUuZGF0YVRyYW5zZmVyLmZpbGVzO1xuXHRpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuXHRcdGhhbmRsZUZpbGVzKGZpbGVzKTtcblx0fVxufVxuZnVuY3Rpb24gaGFuZGxlRHJhZ092ZXIoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufVxuXG4vL1VwbG9hZCBmaWxlIGZyb20gXCJVcGxvYWQgRmlsZVwiIEJ1dHRvblxuZnVuY3Rpb24gaGFuZGxlVXBsb2FkRmlsZXNDbGljayhlLCBjYWxsYmFjaykge1xuXHR2YXIgZmlsZXNJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZXNJbnB1dFwiKTtcbiAgICBpZiAoIWZpbGVzSW5wdXQpIHtcbiAgICBcdGZpbGVzSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIGZpbGVzSW5wdXQudHlwZSA9IFwiZmlsZVwiO1xuICAgICAgICBmaWxlc0lucHV0Lm11bHRpcGxlID0gXCJ0cnVlXCI7XG4gICAgICAgIGZpbGVzSW5wdXQuaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgZmlsZXNJbnB1dC5hY2NlcHQgPSBcImltYWdlLyosIGF1ZGlvLyosIHZpZGVvLypcIjtcbiAgICAgICAgZmlsZXNJbnB1dC5pZCA9IFwiZmlsZXNJbnB1dFwiO1xuICAgICAgICBmaWxlc0lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgaGFuZGxlRmlsZXMoZS50YXJnZXQuZmlsZXMsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZpbGVzSW5wdXQpO1xuICAgIH1cbiAgICBmaWxlc0lucHV0LmNsaWNrKCk7XG59XG5cbi8vVG9vbHRpcFxuZnVuY3Rpb24gY3JlYXRlVG9vbHRpcCh0YXJnZXQsIHRleHQpIHtcbiAgICB2YXIgdG9vbHRpcCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3Rvb2x0aXAnKSxcbiAgICAgICAgdG9vbHRpcFRleHQgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCd0b29sdGlwX190ZXh0JykudGV4dCh0ZXh0KSxcbiAgICAgICAgdG9vbHRpcFRvZ2dsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3Rvb2x0aXBfX3RvZ2dsZScpLFxuICAgICAgICB0b29sdGlwVG9nZ2xlX1RvZ2dsZSA9ICQoJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cIm5ldmVyU2hvd1Rvb2x0aXBcIiAvPicpLC8vLm9uKCdjaGFuZ2UnLCBuZXZlclNob3dUb29sdGlwKSxcbiAgICAgICAgdG9vbHRpcFRvZ2dsZV9MYWJlbCA9ICQoJzxsYWJlbCBmb3I9XCJuZXZlclNob3dUb29sdGlwXCI+R290IGl0LCBkb25cXCd0IHNob3cgbWUgdGhpcyBhZ2FpbjwvbGFiZWw+Jyk7XG5cbiAgICB0b29sdGlwVG9nZ2xlLmFwcGVuZCh0b29sdGlwVG9nZ2xlX1RvZ2dsZSwgdG9vbHRpcFRvZ2dsZV9MYWJlbCk7XG4gICAgdG9vbHRpcFRvZ2dsZS5iaW5kKCdmb2N1cyBjbGljayBjaGFuZ2UnLCBuZXZlclNob3dUb29sdGlwKTtcbiAgICB0b29sdGlwLmFwcGVuZCh0b29sdGlwVGV4dCwgdG9vbHRpcFRvZ2dsZSk7XG4gICAgJCgnLmZpbGVfX2NhcHRpb24tdGV4dGFyZWEnKS5yZW1vdmVBdHRyKCdpZCcpO1xuICAgICQodGFyZ2V0KS5wYXJlbnQoKS5hcHBlbmQodG9vbHRpcCk7XG4gICAgdGFyZ2V0LmF0dHIoJ2lkJywgJ2FjdGl2ZS1jYXB0aW9uLXRleHRhcmVhJyk7XG5cbiAgICB0b29sdGlwLndpZHRoKHRhcmdldC53aWR0aCgpKTtcbiAgICBpZiAoJCgnYm9keScpLndpZHRoKCkgLSB0YXJnZXQub2Zmc2V0KCkubGVmdCAtIHRhcmdldC53aWR0aCgpIC0gdGFyZ2V0LndpZHRoKCkgLSAyMCA+IDAgKSB7XG4gICAgICAgIHRvb2x0aXAuY3NzKCdsZWZ0JywgdGFyZ2V0LnBvc2l0aW9uKCkubGVmdCArIHRhcmdldC53aWR0aCgpICsgMTApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRvb2x0aXAuY3NzKCdsZWZ0JywgdGFyZ2V0LnBvc2l0aW9uKCkubGVmdCAtIHRhcmdldC53aWR0aCgpIC0gMTApO1xuICAgIH1cbiAgICAvL3ZhciBub3RJbmNsdWRlID0gdG9vbHRpcC5hZGQodG9vbHRpcFRleHQpLmFkZCh0b29sdGlwVG9nZ2xlKS5hZGQodG9vbHRpcFRvZ2dsZV9MYWJlbCkuYWRkKHRvb2x0aXBUb2dnbGVfVG9nZ2xlKS5hZGQodGFyZ2V0KTtcbiAgICBjb25zb2xlLmxvZygkKCcjYWN0aXZlLWNhcHRpb24tdGV4dGFyZWEnKSk7XG4gICAgJCgnLmN0LCAubWVudScpLm9uKGNsb3NlVG9vbHRpcCkuZmluZCgnI2FjdGl2ZS1jYXB0aW9uLXRleHRhcmVhLCAudG9vbHRpcCwgLnRvb2x0aXAgaW5wdXQsIC50b29sdGlwIGxhYmVsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge2Uuc3RvcFByb3BhZ2F0aW9uKCk7fSk7XG59XG5cbmZ1bmN0aW9uIG5ldmVyU2hvd1Rvb2x0aXAoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b29sdGlwJywgdHJ1ZSk7XG4gICAgY2xvc2VUb29sdGlwKCk7XG59XG5cbmZ1bmN0aW9uIGNsb3NlVG9vbHRpcChlKSB7XG4gICAgaWYgKGUpIHtlLnN0b3BQcm9wYWdhdGlvbigpO31cblxuICAgIGNvbnNvbGUubG9nKCdjbG9zZXRvb2x0aXAnLCBlKTtcbiAgICAkKCcuY3QsIC5tZW51JykudW5iaW5kKCdjbGljaycsIGNsb3NlVG9vbHRpcCk7XG4gICAgdmFyIHRvb2x0aXBzID0gJCgnLnRvb2x0aXAnKTtcbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdG9vbHRpcHMucmVtb3ZlKCk7XG4gICAgfSwgMzAwKTtcbn1cblxuLy9Nb2RhbCBQcm9tcHRzIGFuZCBXaW5kb3dzXG5mdW5jdGlvbiBjbG9zZUVkaXRTY3JlZW4oKSB7XG4gICQoJy5wcicpLnJlbW92ZUNsYXNzKCdtb2RhbCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgJCgnLnByIC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ2ZvY2FsIGxpbmUgZnVsbCByZWN0IHBvaW50Jyk7XG4gICQoJy5mb2NhbFBvaW50JykucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgJCgnLmZvY2FsUmVjdCcpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICQoJyNmb2NhbFBvaW50VG9nZ2xlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAkKCcjZm9jYWxSZWN0VG9nZ2xlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAkKCcucHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlIC5wdXJwb3NlLWltZycpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICQoJy5jdCAuZmlsZScpLmZpbmQoJ2J1dHRvbicpLmNzcygnZGlzcGxheScsICcnKTtcbiAgZGVzZWxlY3RBbGwoKTtcbiAgJCgnI3dyYXBwZXInKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3cnKTtcbiAgJCgnYm9keScpLnNjcm9sbFRvcChzY3JvbGxQb3NpdGlvbik7XG59XG5cbmZ1bmN0aW9uIHNob3dNb2RhbFByb21wdChvcHRpb25zKSB7XG4gIHZhciBtb2RhbENsYXNzID0gb3B0aW9ucy5kaWFsb2cgPyAnbW9kYWwgbW9kYWwtLXByb21wdCBtb2RhbC0tZGlhbG9nJyA6ICdtb2RhbCBtb2RhbC0tcHJvbXB0JyxcbiAgc2VjQnV0dG9uQ2xhc3MgPSBvcHRpb25zLmRpYWxvZyA/ICdidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtZ3JheScgOiAnYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLXdoaXRlJyxcbiAgY2xvc2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fY2xvc2UnKS5jbGljayhvcHRpb25zLmNhbmNlbEFjdGlvbiksXG4gIG1vZGFsID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcyhtb2RhbENsYXNzKSxcbiAgdGl0bGUgPSBvcHRpb25zLnRpdGxlID8gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX3RpdGxlJykudGV4dChvcHRpb25zLnRpdGxlKSA6IG51bGwsXG4gIHRleHQgPSBvcHRpb25zLnRleHQgPyAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fdGV4dCcpLnRleHQob3B0aW9ucy50ZXh0KSA6IG51bGwsXG4gIGNvbnRyb2xzID0gb3B0aW9ucy5jb25maXJtQWN0aW9uIHx8IG9wdGlvbnMuY2FuY2VsQWN0aW9uID8gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX2NvbnRyb2xzJykgOiBudWxsLFxuICBjb25maXJtQnV0dG9uID0gb3B0aW9ucy5jb25maXJtQWN0aW9uID8gJCgnPGJ1dHRvbj48L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uICBidXR0b25fc3R5bGVfb3V0bGluZS1hY2NlbnQnKS50ZXh0KG9wdGlvbnMuY29uZmlybVRleHQgfHwgJ09rJykuY2xpY2sob3B0aW9ucy5jb25maXJtQWN0aW9uKSA6IG51bGwsXG4gIGNhbmNlbEJ1dHRvbiA9IG9wdGlvbnMuY2FuY2VsQWN0aW9uID8gJCgnPGJ1dHRvbj48L2J1dHRvbj4nKS5hZGRDbGFzcyhzZWNCdXR0b25DbGFzcykudGV4dChvcHRpb25zLmNhbmNlbFRleHQgfHwgJ05ldmVybWluZCcpLmNsaWNrKG9wdGlvbnMuY2FuY2VsQWN0aW9uKSA6IG51bGw7XG5cbiAgY29udHJvbHMuYXBwZW5kKGNvbmZpcm1CdXR0b24sIGNhbmNlbEJ1dHRvbik7XG4gIG1vZGFsLmFwcGVuZChjbG9zZSwgdGl0bGUsIHRleHQsIGNvbnRyb2xzKTtcbiAgJCgnYm9keScpLmFwcGVuZChtb2RhbCk7XG4gIHNldE1vZGFsS2V5Ym9hcmRBY3Rpb25zKG9wdGlvbnMuY29uZmlybUFjdGlvbiwgb3B0aW9ucy5jYW5jZWxBY3Rpb24pO1xufVxuXG5mdW5jdGlvbiBoaWRlTW9kYWxQcm9tcHQoKSB7XG4gICQoJy5vcC5tb2RhbCwgLm9wLmRpYWxvZywgLm1vZGFsLm1vZGFsLS1wcm9tcHQnKS5yZW1vdmUoKTtcbiAgJChkb2N1bWVudCkudW5iaW5kKCdrZXlkb3duJyk7XG59XG5mdW5jdGlvbiBzZXRNb2RhbEtleWJvYXJkQWN0aW9ucyhlbnRlciwgY2xvc2UpIHtcbiAgaGFuZGxlRXNjS2V5ZG93biA9IGZ1bmN0aW9uKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmIChlLnRhcmdldCA9PT0gZG9jdW1lbnQuYm9keSAmJiBlLmtleUNvZGUgPT09IDI3KSB7Y2xvc2UoKTt9XG4gIH07XG4gIGhhbmRsZUVudGVyS2V5ZG93biA9IGZ1bmN0aW9uKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmIChlLnRhcmdldCA9PT0gZG9jdW1lbnQuYm9keSAmJiBlLmtleUNvZGUgPT09IDEzKSB7ZW50ZXIoKTt9XG4gIH07XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVzY0tleWRvd24pO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZUVzY0tleWRvd24oZSkge1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAvL2lmIChlLnRhcmdldCA9PT0gZG9jdW1lbnQuYm9keSAmJiBlLmtleUNvZGUgPT09IDI3KSB7Y2xvc2UoKTt9XG59XG5mdW5jdGlvbiBoYW5kbGVFbnRlcktleWRvd24oZSkge1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAvL2lmIChlLnRhcmdldCA9PT0gZG9jdW1lbnQuYm9keSAmJiBlLmtleUNvZGUgPT09IDEzKSB7ZW50ZXIoKTt9XG59XG5cbmZ1bmN0aW9uIE1vZGFsKG9wdGlvbnMpIHtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICB0aGlzLl9pbml0KCk7XG4gIHRoaXMuX2luaXRFdmVudHMoKTtcbn1cblxuTW9kYWwucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubW9kYWwgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5kaWFsb2cgPyAnbW9kYWwgbW9kYWwtLXByb21wdCBtb2RhbC0tZGlhbG9nJyA6ICdtb2RhbCBtb2RhbC0tcHJvbXB0IG1vZGFsLS1mdWxsJyk7XG5cbiAgdGhpcy5jbG9zZUJ1dHRvbiA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX19jbG9zZScpO1xuICB0aGlzLnRpdGxlID0gdGhpcy5vcHRpb25zLnRpdGxlID8gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX3RpdGxlJykudGV4dCh0aGlzLm9wdGlvbnMudGl0bGUpIDogbnVsbDtcbiAgdGhpcy50ZXh0ID0gdGhpcy5vcHRpb25zLnRleHQgPyAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fdGV4dCcpLnRleHQodGhpcy5vcHRpb25zLnRleHQpIDogbnVsbDtcblxuICB0aGlzLmNvbnRyb2xzID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX2NvbnRyb2xzJyk7XG4gIGlmICghdGhpcy5vcHRpb25zLm9ubHlDYW5jZWwpIHtcbiAgICB0aGlzLmNvbmZpcm1CdXR0b24gPSAkKCc8YnV0dG9uIC8+JykuYWRkQ2xhc3MoJ2J1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS1hY2NlbnQnKS50ZXh0KHRoaXMub3B0aW9ucy5jb25maXJtVGV4dCB8fCAnT2snKTtcbiAgICB0aGlzLmNvbnRyb2xzLmFwcGVuZCh0aGlzLmNvbmZpcm1CdXR0b24pO1xuICB9XG4gIGlmICghdGhpcy5vcHRpb25zLm9ubHlDb25maXJtKSB7XG4gICAgdGhpcy5jYW5jZWxCdXR0b24gPSAkKCc8YnV0dG9uIC8+JykuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmRpYWxvZyA/ICdidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtZ3JheScgOiAnYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLXdoaXRlJykudGV4dCh0aGlzLm9wdGlvbnMuY2FuY2VsVGV4dCB8fCAnTmV2ZXJtaW5kJyk7XG4gICAgdGhpcy5jb250cm9scy5hcHBlbmQodGhpcy5jYW5jZWxCdXR0b24pO1xuICB9XG5cbiAgdGhpcy5tb2RhbC5hcHBlbmQodGhpcy5jbG9zZUJ1dHRvbiwgdGhpcy50aXRsZSwgdGhpcy50ZXh0LCB0aGlzLmNvbnRyb2xzKTtcbiAgJCgnYm9keScpLmFwcGVuZCh0aGlzLm1vZGFsKTtcbn07XG5cbk1vZGFsLnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcbiAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ29uZmlybWF0aW9uKCkge1xuICAgIGlmIChzZWxmLm9wdGlvbnMuY29uZmlybUFjdGlvbikge3NlbGYub3B0aW9ucy5jb25maXJtQWN0aW9uKCk7fVxuICAgIHNlbGYubW9kYWwucmVtb3ZlKCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHNlbGYuaGFuZGxlS2V5RG93biwgdHJ1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlQ2FuY2VsYXRpb24oKSB7XG4gICAgaWYgKHNlbGYub3B0aW9ucy5jYW5jZWxBY3Rpb24pIHtzZWxmLm9wdGlvbnMuY2FuY2VsQWN0aW9uKCk7fVxuICAgIHNlbGYubW9kYWwucmVtb3ZlKCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHNlbGYuaGFuZGxlS2V5RG93biwgdHJ1ZSk7XG4gIH1cblxuICBzZWxmLmhhbmRsZUtleURvd24gPSBmdW5jdGlvbihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIXNlbGYub3B0aW9ucy5vbmx5Q2FuY2VsKSB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge2hhbmRsZUNhbmNlbGF0aW9uKCk7fVxuICAgIH1cbiAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge2hhbmRsZUNvbmZpcm1hdGlvbigpO31cbiAgICBpZiAoZS5rZXlDb2RlID09PSAyNykge2hhbmRsZUNhbmNlbGF0aW9uKCk7fVxuICB9O1xuXG4gIGlmIChzZWxmLmNhbmNlbEJ1dHRvbikge3NlbGYuY2FuY2VsQnV0dG9uLmNsaWNrKGhhbmRsZUNhbmNlbGF0aW9uKTt9XG4gIGlmIChzZWxmLmNvbmZpcm1CdXR0b24pIHtzZWxmLmNvbmZpcm1CdXR0b24uY2xpY2soaGFuZGxlQ29uZmlybWF0aW9uKTt9XG4gIHNlbGYuY2xvc2VCdXR0b24uY2xpY2soaGFuZGxlQ2FuY2VsYXRpb24pO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc2VsZi5oYW5kbGVLZXlEb3duLCB0cnVlKTtcbn07XG5cbi8vQXNzZXQgbGlicmFyeVxudmFyIGFzc2V0TGlicmFyeU9iamVjdHMgPSBbXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTIuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTIuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS0yLmpwZycsXG4gICAgY2FwdGlvbjogJzA1LiBEb25cXCd0IEdldCBMb3N0JyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTMuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTMuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS0zLmpwZycsXG4gICAgY2FwdGlvbjogJzAyLiBUaGUgTWFuIGluIHRoZSBTaGFkb3dzJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTQuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTQuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS00LmpwZycsXG4gICAgY2FwdGlvbjogJzAzLiBUaGUgRmlyc3QgU2xpY2UnLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItZXBpc29kZS01LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1lcGlzb2RlLTUuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1lcGlzb2RlLTUuanBnJyxcbiAgICBjYXB0aW9uOiAnMDEuIEEgTmV3IFZpc2l0b3InLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtNS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtNS5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTUuanBnJyxcbiAgICBjYXB0aW9uOiAnMDQuIFRoZSBCbG9vZCBNb29uJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTEwLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0xMC5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTEwLmpwZycsXG4gICAgY2FwdGlvbjogJzAzLiBUaGUgRmlyc3QgU2xpY2UnLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtMTMuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTEzLmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtMTMuanBnJyxcbiAgICBjYXB0aW9uOiAnMDEuIEEgTmV3IFZpc2l0b3InLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtMTUuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTE1LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtMTUuanBnJyxcbiAgICBjYXB0aW9uOiAnMDEuIEEgTmV3IFZpc2l0b3InLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtMTEuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTExLmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ1RyYWlsZXIgRTAzJyxcbiAgICBjYXB0aW9uOiAnMDYuIEFsbCBBbG9uZScsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ3ZpZGVvJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS05LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS05LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtOS5qcGcnLFxuICAgIGNhcHRpb246ICcwNC4gVGhlIEJsb29kIE1vb24nLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtOC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtOC5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTguanBnJyxcbiAgICBjYXB0aW9uOiAnMDQuIFRoZSBCbG9vZCBNb29uJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTYuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTYuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS02LmpwZycsXG4gICAgY2FwdGlvbjogJzA2LiBBbGwgQWxvbmUnLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDEuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdhenRlY190ZW1wbGUucG5nIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMS5qcGcnLFxuICAgIGNhcHRpb246ICdXcml0ZXIsIEJyaWFuIE1pbGxpa2luLCBhIG1hbiBhYm91dCBIYXZlbiwgdGFrZXMgdXMgYmVoaW5kIHRoZSBzY2VuZXMgb2YgdGhpcyBlcGlzb2RlIGFuZCBnaXZlcyB1cyBhIGZldyB0ZWFzZXMgYWJvdXQgdGhlIFNlYXNvbiB0aGF0IHdlIGNhblxcJ3Qgd2FpdCB0byBzZWUgcGxheSBvdXQhIFRoaXMgaXMgdGhlIGZpcnN0IGVwaXNvZGUgb2YgSGF2ZW4gbm90IGZpbG1lZCBpbiBvciBhcm91bmQgQ2hlc3RlciwgTm92YSBTY290aWEuIEJlZ2lubmluZyBoZXJlLCB0aGUgc2hvdyBhbmQgaXRzIHN0YWdlcyByZWxvY2F0ZWQgdG8gSGFsaWZheC4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ2JpZ19iZW4ucG5nIDQzZGVmcXdlJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0ZEQkQwMCcsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAyLmpwZycsXG4gICAgY2FwdGlvbjogJ0NoYXJsb3R0ZSBsYXlzIG91dCBoZXIgcGxhbiBmb3IgdGhlIGZpcnN0IHRpbWUgaW4gdGhpcyBlcGlzb2RlOiB0byBidWlsZCBhIG5ldyBCYXJuLCBvbmUgdGhhdCB3aWxsIGN1cmUgVHJvdWJsZXMgd2l0aG91dCBraWxsaW5nIFRyb3VibGVkIHBlb3BsZSBpbiB0aGUgcHJvY2Vzcy4gSGVyIHBsYW4sIGFuZCB3aGF0IHBhcnRzIGl0IHJlcXVpcmVzLCB3aWxsIGNvbnRpbnVlIHRvIHBsYXkgYSBtb3JlIGFuZCBtb3JlIGltcG9ydGFudCByb2xlIGFzIHRoZSBzZWFzb24gZ29lcyBhbG9uZy4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDMuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdjaHJpc3RfdGhlX3JlZGVlbWVyLnBuZyAwOTJubHhuYycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNFRDQxMkQnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMy5qcGcnLFxuICAgIGNhcHRpb246ICdMb3N0IHRpbWUgcGxheXMgYW4gZXZlbiBtb3JlIGltcG9ydGFudCByb2xlIGluIHRoaXMgZXBpc29kZSB0aGFuIGV2ZXIgYmVmb3Jl4oCUIGFzIGl04oCZcyByZXZlYWxlZCB0aGF0IGl04oCZcyBhIHdlYXBvbiB0aGUgZ3JlYXQgZXZpbCBmcm9tIFRoZSBWb2lkIGhhcyBiZWVuIHVzaW5nIGFnYWluc3QgdXMsIGFsbCBzZWFzb24gbG9uZy4gV2hpY2ggZ29lcyBiYWNrIHRvIHRoZSBjYXZlIHVuZGVyIHRoZSBsaWdodGhvdXNlIGluIGJlZ2lubmluZyBvZiB0aGUgU2Vhc29uIDUgcHJlbWllcmUuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0xvc3QgdGltZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzA0LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnY29sb3NzZXVtLnBuZyAtNHJqeG5zaycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyMzMkE0QjcnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wNC5qcGcnLFxuICAgIGNhcHRpb246ICdUaGUg4oCcYWV0aGVyIGNvcmXigJ0gdGhhdCBDaGFybG90dGUgYW5kIEF1ZHJleSBtYWtlIHByZXNlbnRlZCBhbiBpbXBvcnRhbnQgZGVzaWduIGNob2ljZS4gVGhlIHdyaXRlcnMgd2FudGVkIGl0IHRvIGxvb2sgb3JnYW5pYyBidXQgYWxzbyBkZXNpZ25lZOKAlCBsaWtlIHRoZSB0ZWNobm9sb2d5IG9mIGFuIGFkdmFuY2VkIGN1bHR1cmUgZnJvbSBhIGRpZmZlcmVudCBkaW1lbnNpb24sIGNhcGFibGUgb2YgZG9pbmcgdGhpbmdzIHRoYXQgd2UgbWlnaHQgcGVyY2VpdmUgYXMgbWFnaWMgYnV0IHdoaWNoIGlzIGp1c3Qgc2NpZW5jZSB0byB0aGVtLiBUaGUgdmFyaW91cyBkZXBpY3Rpb25zIG9mIEtyeXB0b25pYW4gc2NpZW5jZSBpbiB2YXJpb3VzIFN1cGVybWFuIHN0b3JpZXMgd2FzIG9uZSBpbnNwaXJhdGlvbi4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlIGFuZCBBdWRyZXknLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wNS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ2Vhc3Rlcl9pc2xhbmQucG5nIG5sbjRua2EwJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTAsIDI1KSxcbiAgICBjb2xvcjogJyNEM0VDRUMnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wNS5qcGcnLFxuICAgIGNhcHRpb246ICdUaGlzIGlzIHRoZSBmaXJzdCBlcGlzb2RlIGluIFNlYXNvbiA1IGluIHdoaWNoIHdl4oCZdmUgbG9zdCBvbmUgb2Ygb3VyIGhlcm9lcy4gSXQgd2FzIGltcG9ydGFudCB0byBoYXBwZW4gYXMgd2UgaGVhZCBpbnRvIHRoZSBob21lIHN0cmV0Y2ggb2YgdGhlIHNob3cgYW5kIGFzIHRoZSBzdGFrZXMgaW4gSGF2ZW4gaGF2ZSBuZXZlciBiZWVuIG1vcmUgZGlyZS4gQXMgYSByZXN1bHQsIGl0IHdvbuKAmXQgYmUgdGhlIGxhc3QgbG9zcyB3ZVxcJ2xsIHN1ZmZlciB0aGlzIHNlYXNvbuKApicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdXaWxkIENhcmQnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wNi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3B5cmFtaWRzLnBuZyBmZGJ5NjQnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMCwgMjUpLFxuICAgIGNvbG9yOiAnIzJBN0M5MScsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzA2LmpwZycsXG4gICAgY2FwdGlvbjogJ1RoZSBjaGFsbGVuZ2UgaW4gQ2hhcmxvdHRlXFwncyBmaW5hbCBjb25mcm9udGF0aW9uIHdhcyB0aGF0IHRoZSBzaG93IGNvdWxkbuKAmXQgcmV2ZWFsIGhlciBhdHRhY2tlcuKAmXMgYXBwZWFyYW5jZSB0byB0aGUgYXVkaWVuY2UsIHNvIHRoZSBkYXJrbmVzcyB3YXMgbmVjZXNzaXRhdGVkLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAxLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2FuX2ZyYW5jaXNvX2JyaWRnZS5wbmcgNDIzNGZmNTInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMCwgMjUpLFxuICAgIGNvbG9yOiAnIzk2Nzg0MCcsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAxLmpwZycsXG4gICAgY2FwdGlvbjogJ1dhcm5pbmc6IElmIHlvdSBkb25cXCd0IHdhbnQgdG8ga25vdyB3aGF0IGhhcHBlbmVkIGluIHRoaXMgZXBpc29kZSwgZG9uXFwndCByZWFkIHRoaXMgcGhvdG8gcmVjYXAhIERhdmUganVzdCBoYWQgYW5vdGhlciB2aXNpb24gYW5kIHRoaXMgdGltZSwgaGVcXCdzIGJlaW5nIHByb2FjdGl2ZSBhYm91dCBpdC4gSGUgYW5kIFZpbmNlIGRhc2ggb3V0IG9mIHRoZSBob3VzZSB0byBzYXZlIHRoZSBsYXRlc3QgdmljdGltcyBvZiBDcm9hdG9hbiwgYS5rLmEgdGhlIE5vIE1hcmtzIEtpbGxlci4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDIuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzdG9uZV9oZW5nZS5wbmcgNDkwbW5tYWJkJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTAsIDI1KSxcbiAgICBjb2xvcjogJyM1NjZGNzgnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wMi5qcGcnLFxuICAgIGNhcHRpb246ICdNZWFud2hpbGUsIER3aWdodCBhbmQgTmF0aGFuIGdvIGRvd250b3duIHRvIGludmVzdGlnYXRlIHdoYXQgdGhleSB0aGluayBpcyBhIGRydW5rZW4gbWFuIGNhdXNpbmcgYSBkaXN0dXJiYW5jZSBidXQgaXQgdHVybnMgb3V0IHRoYXQgdGhlIGd1eSBpcyBjdXJzZWQuIFRoZXJlIGlzIGEgcm9tYW4gbnVtZXJhbCBvbiBoaXMgd3Jpc3QgYW5kLCBhcyB0aGV5IHdhdGNoLCBpbnZpc2libGUgaG9yc2VzIHRyYW1wbGUgaGltLiBMYXRlciwgTmF0aGFuIGFuZCBEd2lnaHQgZmluZCBhbm90aGVyIG1hbiB3aG8gYXBwZWFycyB0byBoYXZlIGJlZW4gc3RydWNrIGJ5IGxpZ2h0ZW5pbmcg4oCTIGJ1dCB0aGVyZSBoYWQgYmVlbiBubyByZWNlbnQgc3Rvcm0gaW4gdG93biDigJMgYW5kIGRyb3BwZWQgZnJvbSBhIHNreXNjcmFwZXIuIFNreXNjcmFwZXJzIGluIEhhdmVuPyBBYnN1cmQuIEFuZCB0aGUgZ3V5IGFsc28gaGFzIGEgbXlzdGVyaW91cyBSb21hbiBudW1lcmFsIHRhdHRvbyBvbiBoaXMgd3Jpc3QuIE5hdGhhbiBhbmQgRHdpZ2h0IGZpbmQgYSBsaXN0IG9mIG5hbWVzIGluIHRoZSBndXlcXCdzIHBvY2tldCB0aGF0IGxlYWRzIHRoZW0gdG8gYSBsb2NhbCBmb3J0dW5lIHRlbGxlciwgTGFpbmV5LicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wMy5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3N5ZG5leV9vcGVyYV9ob3VzZS5wbmcgMHNlZDY3aCcsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDEwLCAyNSksXG4gICAgY29sb3I6ICcjMkUxRDA3JyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDMuanBnJyxcbiAgICBjYXB0aW9uOiAnQnkgZm9sbG93aW5nIHRoZSBjbHVlcyBmcm9tIERhdmVcXCdzIHZpc2lvbiwgaGUgYW5kIFZpbmNlIGZpbmQgdGhlIHNjZW5lIG9mIHRoZSBObyBNYXJrIEtpbGxlclxcJ3MgbW9zdCByZWNlbnQgY3JpbWUuIFRoZXkgYWxzbyBmaW5kIGEgc3Vydml2b3IuIFVuZm9ydHVuYXRlbHksIHNoZSBjYW5cXCd0IHJlbWVtYmVyIGFueXRoaW5nLiBIZXIgbWVtb3J5IGhhcyBiZWVuIHdpcGVkLCB3aGljaCBnZXRzIHRoZW0gdG8gdGhpbmtpbmcgYWJvdXQgd2hvIG1heSBiZSBuZXh0IG9uIENyb2F0b2FuXFwncyBsaXN0LicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3Rhal9tYWhhbC5wbmcgOTQzbmJrYScsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDEwLCAyNSksXG4gICAgY29sb3I6ICcjMDA0NDVGJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDQuanBnJyxcbiAgICBjYXB0aW9uOiAnT24gdGhlaXIgd2F5IHRvIG1lZXQgd2l0aCBMYWluZXksIE5hdGhhbiBicmVha3MgaGlzIHRpcmUgaXJvbiB3aGlsZSB0cnlpbmcgdG8gZml4IGEgZmxhdCB0aXJlLiBUb3VnaCBicmVhay4gQW5kIHRoZW4gRHdpZ2h0IGdldHMgYSBzaG9vdGluZyBwYWluIGluIGhpcyBzaWRlIHdpdGggYSBnbmFybHkgYnJ1aXNlIHRvIG1hdGNoLCBldmVuIHRvdWdoZXIgYnJlYWsuIEFuZCB0aGVuIGJvdGggZ3V5cyBub3RpY2UgdGhhdCB0aGV5IG5vdyBoYXZlIFJvbWFuIG51bWVyYWwgdGF0dG9vcyBvbiB0aGVpciB3cmlzdHMuIFRoZSBudW1iZXIgWCBmb3IgTmF0aGFuIGFuZCBYSUkgZm9yIER3aWdodC4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDUuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd3aW5kbWlsbC5wbmcgamVybDM0JyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDExKSxcbiAgICBjb2xvcjogJyMyRjM4MzcnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNS5qcGcnLFxuICAgIGNhcHRpb246ICdJbiB0aGUgbWluZXNoYWZ0LCBDaGFybG90dGUgYW5kIEF1ZHJleSBoYXZlIHRha2VuIG9uIHRoZSB0YXNrIG9mIGNvbGxlY3RpbmcgYWxsIG9mIHRoZSBhZXRoZXIgdG8gY3JlYXRlIGFuIGFldGhlciBjb3JlLiBUaGlzIGlzIHRoZSBmaXJzdCBzdGVwIHRoZXkgbmVlZCB0byBjcmVhdGUgYSBuZXcgQmFybiB3aGVyZSBUcm91YmxlIHBlb3BsZSBjYW4gc3RlcCBpbnNpZGUgYW5kIHRoZW4gYmUgXCJjdXJlZFwiIG9mIHRoZWlyIFRyb3VibGVzIHdoZW4gdGhleSBzdGVwIG91dC4gU291bmRzIGVhc3kgZW5vdWdoIGJ1dCB0aGV5XFwncmUgaGF2aW5nIHRyb3VibGUgY29ycmFsbGluZyBhbGwgdGhlIGFldGhlciBpbnRvIGEgZ2lhbnQgYmFsbC4gVW5zdXJwcmlzaW5nbHksIHRoZSBzd2lybGluZyBibGFjayBnb28gaXNuXFwndCB3aWxsZnVsbHkgY29vcGVyYXRpbmcuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA2LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAndHJlZV8xLnBuZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxNCksXG4gICAgY29sb3I6ICcjNjM2MjRDJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDYuanBnJyxcbiAgICBjYXB0aW9uOiAnQXMgaWYgdGhlIGFldGhlciB3YXNuXFwndCBlbm91Z2ggb2YgYSBwcm9ibGVtIHRvIHRhY2tsZSwgQ2hhcmxvdHRlIGZlZWxzIGhlcnNlbGYgZ2V0dGluZyB3ZWFrZXIgYnkgdGhlIG1pbnV0ZSBhbmQgdGhlbiBBdWRyZXkgc3RhcnRzIHRvIGxvc2UgaGVyIGV5ZXNpZ2h0LiBUaGV5IGxvb2sgYXQgdGhlaXIgd3Jpc3RzIGFuZCBub3RpY2UgdGhhdCB0aGUgUm9tYW4gbnVtYmVyIHByb2JsZW0gaGFzIG5vdyBhZmZlY3RlZCB0aGVtIHRvbywgdGhlIG51bWJlcnMgSUkgZm9yIEF1ZHJleSBhbmQgVklJSSBmb3IgQ2hhcmxvdHRlLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNy5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3RyZWVfMi5wbmcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTQpLFxuICAgIGNvbG9yOiAnIzRBNTA0RScsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA3LmpwZycsXG4gICAgY2FwdGlvbjogJ0luIE5vcnRoIENhcm9saW5hLCBEdWtlIGFuZCBTZXRoIHNpdCB3aXRoIGEgbG9jYWwgbWFuIHdobyBjbGFpbXMgdG8gYmUgYWJsZSB0byByZW1vdmUgdGhlIFwiYmxhY2sgdGFyXCIgZnJvbSBEdWtlXFwncyBzb3VsLiBBZnRlciBhbiBlbGFib3JhdGUgcGVyZm9ybWFuY2UsIER1a2UgcmVhbGl6ZXMgdGhhdCB0aGUgZ3V5IGlzIGEgZmFrZS4gVGhlIHJhdHRsZWQgZ3V5IHdobyBkb2VzblxcJ3Qgd2FudCBhbnkgdHJvdWJsZSBmcm9tIER1a2UgdGVsbHMgdGhlbSB0aGF0IFdhbHRlciBGYXJhZHkgd2lsbCBoYXZlIHRoZSByZWFsIGFuc3dlcnMgdG8gRHVrZVxcJ3MgcXVlc3Rpb25zLiBXaGVuIHRoZXkgZ28gbG9va2luZyBmb3IgV2FsdGVyLCB0aGV5IGZpbmQgaGltIOKApiBhbmQgaGlzIGhlYWRzdG9uZSB0aGF0IGhhcyBhIGZhbWlsaWFyIG1hcmtpbmcgb24gaXQsIHRoZSBzeW1ib2wgZm9yIFRoZSBHdWFyZC4gV2hhdCBnaXZlcz8gSnVzdCBhcyBEdWtlIGlzIGFib3V0IHRvIGdpdmUgdXAgaGUgZ2V0cyBhIHZpc2l0IGZyb20gV2FsdGVyXFwncyBnaG9zdCB3aG8gcHJvbWlzZXMgdG8gZ2l2ZSBoaW0gYW5zd2VycyB0byBhbGwgb2YgdGhlIHF1ZXN0aW9ucyDigKZ2aWEgdGhlIG5leHQgZXBpc29kZSBvZiBjb3Vyc2UuIENsaWZmaGFuZ2VyIScsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wOC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3RyZWVfMy5wbmcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTQpLFxuICAgIGNvbG9yOiAnI0REOUYwMCcsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA4LmpwZycsXG4gICAgY2FwdGlvbjogJ0FmdGVyIHNvbWUgcHJvZGRpbmcsIER3aWdodCBhbmQgTmF0aGFuIGZpbmQgdGhhdCBMYWluZXkgZ290IGEgdmlzaXQgZnJvbSBDcm9hdG9hbiBhbmQgXCJsb3N0IHRpbWVcIi4gU2hlIGRvZXNuXFwndCByZW1lbWJlcmluZyBkcmF3aW5nIGNhcmRzIGZvciBhbnkgb2YgdGhlbS4gTmF0aGFuIGhhcyBoZXIgZHJhdyBuZXcgY2FyZHMgYW5kIGEgaGVzaXRhbnQgTGFpbmV5IGRvZXMuIER3aWdodCBpcyBnaXZlbiBhIGJvbmRhZ2UgZmF0ZSBhbmQgaXMgbGF0ZXIgc2hhY2tsZWQgYnkgY2hhaW5zIHRvIGEgZ2F0ZSwgQ2hhcmxvdHRlIHdpbGwgYmUgcmV1bml0ZWQgd2l0aCBoZXIgdHJ1ZSBsb3ZlIChobW3igKYpIGFuZCBBdWRyZXkgaXMgYWxpZ25lZCB3aXRoIHRoZSBtb29uLiBOb3QgcGVyZmVjdCBmYXRlcywgYnV0IGl0XFwncyBlbm91Z2ggdG8gZ2V0IGV2ZXJ5b25lIG91dCBvZiB0aGUgcGlja2xlcyB0aGVpciBjdXJyZW50bHkgaW4uJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA5LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAndHJlZV80LnBuZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxNCksXG4gICAgY29sb3I6ICcjOEZDOTlCJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDkuanBnJyxcbiAgICBjYXB0aW9uOiAnV2l0aCB0aGVpciBzdHJlbmd0aCByZWdhaW5lZCwgQXVkcmV5IGFuZCBDaGFybG90dGUgYXJlIGFibGUgdG8gY3JlYXRlIHRoZSBhZXRoZXIgY29yZSB0aGV5IG5lZWQuIENoYXJsb3R0ZSBpbnN0cnVjdHMgQXVkcmV5IHRvIGdvIGFuZCBoaWRlIGl0IHNvbWUgcGxhY2Ugc2FmZS4gSW4gdGhlIGludGVyaW0sIENoYXJsb3R0ZSBraXNzZXMgRHdpZ2h0IGdvb2RieWUgYW5kIGdpdmVzIGhpbSB0aGUgcmluZyBzaGUgb25jZSB1c2VkIHRvIHNsaXAgaW50byBUaGUgVm9pZC4gTGF0ZXIsIHdpdGggaGVyIG1vb24gYWxpZ25tZW50IGNhdXNpbmcgQXVkcmV5IHRvIGRpc2FwcGVhciBhbmQgRHdpZ2h0IHN0aWxsIHNoYWNrbGVkLCBMYWluZXkgcHVsbHMgYW5vdGhlciBjYXJkIGZvciB0aGUgZW50aXJlIGdyb3VwLCBhIGp1ZGdtZW50IGNhcmQsIHdoaWNoIHNoZSByZWFkcyB0byBtZWFuIHRoYXQgYXMgYWxvbmcgYXMgdGhlaXIgaW50ZW50aW9ucyBhcmUgcHVyZSB0aGV5IGNhbiBhbGwgb3ZlcmNvbWUgYW55IG9ic3RhY2xlcy4gVGhpcyBpcyBncmVhdCBuZXdzIGZvciBldmVyeW9uZSBleGNlcHQuLi4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMTAuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd0cmVlXzUucG5nJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDE0KSxcbiAgICBjb2xvcjogJyNCRkM5QTInLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8xMC5qcGcnLFxuICAgIGNhcHRpb246ICdDaGFybG90dGUuIENyb2F0b2FuIHBheXMgaGVyIGEgdmlzaXQgaW4gaGVyIGFwYXJ0bWVudCB0byB0ZWxsIGhlciB0aGF0IGhlXFwncyBwaXNzZWQgdGhhdCBzaGVcXCdzIFwib25lIG9mIHRoZW0gbm93XCIgYW5kIHRoYXQgc2hlIGNob3NlIEF1ZHJleSBvdmVyIE1hcmEuIENyb2F0b2FuIHdhc3RlcyBubyB0aW1lIGluIGtpbGxpbmcgQ2hhcmxvdHRlIGFuZCBzaGUgY2xpbmdzIHRvIGxpZmUgZm9yIGp1c3QgZW5vdWdoIHRpbWUgdG8gYmUgZm91bmQgYnkgQXVkcmV5IHNvIHNoZSBjYW4gZ2l2ZSBoZXIgdGhlIG1vc3Qgc2hvY2tpbmcgbmV3cyBvZiB0aGUgc2Vhc29uOiBDcm9hdG9hbiBpcyBBdWRyZXlcXCdzIGZhdGhlciBhbmQgaGVcXCdzIGdvdCBcInBsYW5zXCIgZm9yIGhlciEnLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3MwNV9lMDUxM18wMV9DQ18xOTIweDEwODAuanBnJyxcbiAgICBpZDogJ3ZpZGVvX18xMjMnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTQpLFxuICAgIGNvbG9yOiAnI0JGQzlBMicsXG4gICAgdGl0bGU6ICdzMDVfZTA1MTNfMDFfQ0NfMTkyMHgxMDgwJyxcbiAgICBkZXNjcmlwdGlvbjogJ05vdyB0aGF0IERyLiBDcm9zcyBoYXMgcmV2ZWFsZWQgaGVyIHRydWUgaWRlbnRpdHksIGV2ZXJ5b25lIGhhcyBsb3RzIG9mIGZlZWxpbmdzLiBEd2lnaHQgY2FuXFwndCBnZXQgb3ZlciBmZWVsaW5nIGxpa2Ugc2hlIGR1cGVkIGhpbSwgQXVkcmV5IHRoaW5rcyBEci4gQ3Jvc3MgbXVzdCBjYXJlIG1vcmUgYWJvdXQgTWFyYSB0aGFuIHNoZSBkb2VzIGFib3V0IGhlciBhbmQgTmF0aGFuIGlzIGhhcHB5IHRoYXQgdGhlcmUgaXMgc29tZW9uZSBlbHNlIGluIHRvd24gd2hvIGhlIGNhbiBmZWVsLicsXG4gICAgdHlwZTogJ3ZpZGVvJyxcbiAgICBwbGF5ZXI6ICdCcmFuZCBWT0QgUGxheWVyJyxcbiAgICBlcGlzb2RlTnVtYmVyOiAnMTAnLFxuICAgIGtleXdvcmRzOiAnVGhlIEV4cGFuY2UsIFNhbHZhZ2UsIE1pbGxlciwgSnVsaWUgTWFvLCBIb2xkZW4sIFRyYWlsZXInLFxuXG4gICAgYWRkZWRCeVVzZXJJZDogMzQ0ODcyMyxcbiAgICBhdXRob3I6ICdKYXNvbiBMb25nJyxcbiAgICBleHBpcmF0aW9uRGF0ZTogJzIwMTUtMDMtMjMgMTA6NTc6MDQnLFxuICAgIGd1aWQ6ICcwRDY2MEJENi0wOTY4LTRGNzItN0FCQy00NzIxNTdERkFDQUInLFxuICAgIGxpbms6ICdjYW5vbmljYWx1cmw3MGZhNjJmYzZiJyxcbiAgICBsaW5rVXJsOiAnaHR0cDovL3Byb2QucHVibGlzaGVyNy5jb20vZmlsZS83ODA2J1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDYuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8wNi5wbmcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAxLCAxNCksXG4gICAgY29sb3I6ICcjQkZDOUEyJyxcbiAgICB0aXRsZTogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzA2LmpwZycsXG4gICAgY2FwdGlvbjogJ0FsZWlzdGVyIGNvbnRpbnVlcyBoaXMgY2hhcm1pbmcgY29ycnVwdGlvbiBvZiBTYXZhbm5haCwgdGVsbGluZyBoZXIgc2hlXFwncyBrZXB0IGxvY2tlZCBpbiBoZXIgcm9vbSB0byBrZWVwIGhlciBzYWZlIGZyb20gaGVyIG5ldyB3ZXJld29sZiBuZWlnaGJvciBhbmQgZW5jb3VyYWdpbmcgaGVyIHRvIHVzZSBoZXIgbGVmdCBoYW5kIHdoZW4gd2llbGRpbmcgaGVyIGFiaWxpdGllcy4gU2F2YW5uYWhcXCdzIGdldHRpbmcgbW9yZSBwb3dlcmZ1bCBldmVyeSBkYXkuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJycsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnQml0dGVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG5cbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItZTEtMy5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItZTYuanBnJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMSwgMTQpLFxuICAgIGNvbG9yOiAnI0JGQzlBMicsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWU2LmpwZycsXG4gICAgY2FwdGlvbjogJ0FsZWlzdGVyIGNvbnRpbnVlcyBoaXMgY2hhcm1pbmcgY29ycnVwdGlvbiBvZiBTYXZhbm5haCwgdGVsbGluZyBoZXIgc2hlXFwncyBrZXB0IGxvY2tlZCBpbiBoZXIgcm9vbSB0byBrZWVwIGhlciBzYWZlIGZyb20gaGVyIG5ldyB3ZXJld29sZiBuZWlnaGJvciBhbmQgZW5jb3VyYWdpbmcgaGVyIHRvIHVzZSBoZXIgbGVmdCBoYW5kIHdoZW4gd2llbGRpbmcgaGVyIGFiaWxpdGllcy4gU2F2YW5uYWhcXCdzIGdldHRpbmcgbW9yZSBwb3dlcmZ1bCBldmVyeSBkYXkuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJycsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnQml0dGVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvY29udGVudC9saXN0aWNsZS1pbWctMy5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ2xpc3RpY2xlLWltZy0zLmpwZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDEsIDE0KSxcbiAgICBjb2xvcjogJyNCRkM5QTInLFxuICAgIHRpdGxlOiAnTXIuX1JvYm90X1MxX0VwMDNfQ2hvaWNlc19jbGlwJyxcbiAgICBjYXB0aW9uOiAnQWxlaXN0ZXIgY29udGludWVzIGhpcyBjaGFybWluZyBjb3JydXB0aW9uIG9mIFNhdmFubmFoLCB0ZWxsaW5nIGhlciBzaGVcXCdzIGtlcHQgbG9ja2VkIGluIGhlciByb29tIHRvIGtlZXAgaGVyIHNhZmUgZnJvbSBoZXIgbmV3IHdlcmV3b2xmIG5laWdoYm9yIGFuZCBlbmNvdXJhZ2luZyBoZXIgdG8gdXNlIGhlciBsZWZ0IGhhbmQgd2hlbiB3aWVsZGluZyBoZXIgYWJpbGl0aWVzLiBTYXZhbm5haFxcJ3MgZ2V0dGluZyBtb3JlIHBvd2VyZnVsIGV2ZXJ5IGRheS4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdCaXR0ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICd2aWRlbydcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9jb250ZW50L2xpc3RpY2xlLWltZy0yLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnbGlzdGljbGUtaW1nLTIuanBnJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMSwgMTQpLFxuICAgIGNvbG9yOiAnI0JGQzlBMicsXG4gICAgdGl0bGU6ICdNci5fUm9ib3RfUzFfRXAwNF9XaXRoZHJhd2xfY2xpcCcsXG4gICAgY2FwdGlvbjogJ0FsZWlzdGVyIGNvbnRpbnVlcyBoaXMgY2hhcm1pbmcgY29ycnVwdGlvbiBvZiBTYXZhbm5haCwgdGVsbGluZyBoZXIgc2hlXFwncyBrZXB0IGxvY2tlZCBpbiBoZXIgcm9vbSB0byBrZWVwIGhlciBzYWZlIGZyb20gaGVyIG5ldyB3ZXJld29sZiBuZWlnaGJvciBhbmQgZW5jb3VyYWdpbmcgaGVyIHRvIHVzZSBoZXIgbGVmdCBoYW5kIHdoZW4gd2llbGRpbmcgaGVyIGFiaWxpdGllcy4gU2F2YW5uYWhcXCdzIGdldHRpbmcgbW9yZSBwb3dlcmZ1bCBldmVyeSBkYXkuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJycsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnQml0dGVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAndmlkZW8nXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvY29udGVudC9saXN0aWNsZS1pbWctMS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ2xpc3RpY2xlLWltZy0xLmpwZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDEsIDE0KSxcbiAgICBjb2xvcjogJyNCRkM5QTInLFxuICAgIHRpdGxlOiAnTXIuX1JvYm90X1MxX0VwMDZfU2hheWxhc19GYXRlX2NsaXAnLFxuICAgIGNhcHRpb246ICdBbGVpc3RlciBjb250aW51ZXMgaGlzIGNoYXJtaW5nIGNvcnJ1cHRpb24gb2YgU2F2YW5uYWgsIHRlbGxpbmcgaGVyIHNoZVxcJ3Mga2VwdCBsb2NrZWQgaW4gaGVyIHJvb20gdG8ga2VlcCBoZXIgc2FmZSBmcm9tIGhlciBuZXcgd2VyZXdvbGYgbmVpZ2hib3IgYW5kIGVuY291cmFnaW5nIGhlciB0byB1c2UgaGVyIGxlZnQgaGFuZCB3aGVuIHdpZWxkaW5nIGhlciBhYmlsaXRpZXMuIFNhdmFubmFoXFwncyBnZXR0aW5nIG1vcmUgcG93ZXJmdWwgZXZlcnkgZGF5LicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICcnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ0JpdHRlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ3ZpZGVvJ1xuICB9ICAgIFxuXG4gIC8qLFxuICB7XG4gIHVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzA3LmpwZycsXG4gIGZvY2FsUG9pbnQ6IHtcbiAgbGVmdDogMC41LFxuICB0b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDcucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDcuanBnJyxcbmNhcHRpb246ICdNZWFud2hpbGUsIExvZ2FuIGhhcyBpbmZpbHRyYXRlZCB0aGUgY29tcG91bmQgYW5kIGZpbmRzIGhpcyBiZWxvdmVkIFJhY2hlbC4gSGUgbWFuYWdlcyB0byBmcmVlIGhlciAuLi4gYnV0IGhvdyBmYXIgd2lsbCB0aGV5IGdldD8nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzE3LmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTcucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTcuanBnJyxcbmNhcHRpb246ICdFbGVuYSB3YWtlcyB1cCB0byBmaW5kIGhlcnNlbGYgaW4gYSBuZXcgY2VsbCAuLi4nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzE4LmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTgucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTguanBnJyxcbmNhcHRpb246ICcuLi4gYW5kIFJpY2hhcmQsIHRoZSBtdXR0IHNoZSBpbnRlcnJvZ2F0ZWQgaW4gRXBpc29kZSAxLCBpbiBhbm90aGVyLiBSaWNoYXJkIGlzIGVucmFnZWQgdGhhdCBFbGVuYSBnYXZlIGhpbSB1cCB0byB0aGVzZSBcInNhZGlzdGljIGJhc3RhcmRzXCIgYW5kIGFsbCB0b28gd2lsbGluZyB0byBlbmdhZ2UgaW4gU29uZHJhXFwncyBleHBlcmltZW50IHRvIFwib2JzZXJ2ZSBjb21iYXRcIjogaW4gdGhlb3J5LCBFbGVuYSB3aWxsIGhhdmUgdG8gdHVybiBpbnRvIGEgd29sZiB0byBkZWZlbmQgaGVyc2VsZiBhZ2FpbnN0IFJpY2hhcmRcXCdzIGF0dGFjay4nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzIxLmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjEucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjEuanBnJyxcbmNhcHRpb246ICdPbiBoaWdoZXIgZ3JvdW5kLCBSYWNoZWwgYW5kIExvZ2FuIGFyZSBtYWtpbmcgYSBydW4gZm9yIGl0LCB0aG91Z2ggdGhlIHN5bWJvbCBvbiBSYWNoZWxcXCdzIG5lY2sgc3RhcnRzIHRvIHNtb2tlIC4uLicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCaXR0ZW4nLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjIuanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yMi5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNCksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yMi5qcGcnLFxuY2FwdGlvbjogJy4uLiB3aGljaCBhbHNvIHNsb3dzIGRvd24gRWxlbmEsIGFmdGVyIFJpY2hhcmQtd29sZiBzdWZmZXJzIHRoZSBzYW1lIGJsb29keSBmYXRlIGFzIE5hdGUgUGFya2VyIGRpZCBpbiBFcGlzb2RlIDEuIFJhY2hlbCwgRWxlbmEgYW5kIExvZ2FuIGFyZSByZS1jYXB0dXJlZC4nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzI1LmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjUucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjUuanBnJyxcbmNhcHRpb246ICdFbGVuYSBnaXZlcyBpbiwgYW5kIGEgc2hvY2tlZCBSYWNoZWwgbGVhcm5zIGEgbGl0dGxlIHNvbWV0aGluZyBuZXcgYWJvdXQgaGVyIG9sZCBmcmllbmQuJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JpdHRlbicsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CbGluZHNwb3RfMDdfTlVQXzE3MDMxN18wMzA4LmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQmxpbmRzcG90XzA3X05VUF8xNzAzMTdfMDMwOC5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNiksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCbGluZHNwb3RfMDdfTlVQXzE3MDMxN18wMzA4LmpwZycsXG5jYXB0aW9uOiAnQkxJTkRTUE9UIC0tIFwiQm9uZSBNYXkgUm90XCIgRXBpc29kZSAxMDQgLS0gUGljdHVyZWQ6IChsLXIpIEphaW1pZSBBbGV4YW5kZXIgYXMgSmFuZSBEb2UsIFN1bGxpdmFuIFN0YXBsZXRvbiBhcyBLdXJ0IFdlbGxlciAtLSAoUGhvdG8gYnk6IENocmlzdG9waGVyIFNhdW5kZXJzL05CQyknLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQmxpbmRzcG90JyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JsaW5kc3BvdF8wOF9OVVBfMTcwNTAzXzAyODMuanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCbGluZHNwb3RfMDhfTlVQXzE3MDUwM18wMjgzLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE2KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JsaW5kc3BvdF8wOF9OVVBfMTcwNTAzXzAyODMuanBnJyxcbmNhcHRpb246ICdCTElORFNQT1QgLS0gXCJCb25lIE1heSBSb3RcIiBFcGlzb2RlIDEwNCAtLSBQaWN0dXJlZDogSmFpbWllIEFsZXhhbmRlciBhcyBKYW5lIERvZSAtLSAoUGhvdG8gYnk6IEdpb3Zhbm5pIFJ1Zmluby9OQkMpJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JsaW5kc3BvdCcsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CbGluZHNwb3RfMTVfTlVQXzE3MDUwM18wMjAzLmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQmxpbmRzcG90XzE1X05VUF8xNzA1MDNfMDIwMy5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNiksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCbGluZHNwb3RfMTVfTlVQXzE3MDUwM18wMjAzLmpwZycsXG5jYXB0aW9uOiAnQkxJTkRTUE9UIC0tIFwiQm9uZSBNYXkgUm90XCIgRXBpc29kZSAxMDQgLS0gUGljdHVyZWQ6IEphaW1pZSBBbGV4YW5kZXIgYXMgSmFuZSBEb2UgLS0gKFBob3RvIGJ5OiBHaW92YW5uaSBSdWZpbm8vTkJDKScsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCbGluZHNwb3QnLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjIwLjE0X3BtLnBuZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjIwLjE0X3BtLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE2KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4yMC4xNF9wbS5wbmcnLFxuY2FwdGlvbjogJ+KAnE1vbmRheXMgZ290IG1lIGxpa2XigKbigJ0gLSBAamltbXlmYWxsb24nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnVGhlIFRvbmlnaHQgU2hvdycsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9zY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMTkuMTlfcG0ucG5nJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdzY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMTkuMTlfcG0ucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTYpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjE5LjE5X3BtLnBuZycsXG5jYXB0aW9uOiAn4oCcVG9uaWdodCBJIHdhcyB0aGUgbXVzaWNhbCBndWVzdCBvbiBUaGUgVG9uaWdodCBTaG93IFdpdGggSmltbXkgRmFsbG9uLiBNeSBmaXJzdCB0aW1lIG9uIHRoZSBzaG93IEkgd2FzIDE0IHllYXJzIG9sZCBhbmQgbmV2ZXIgdGhvdWdodCBJXFwnZCBiZSBiYWNrIHRvIHBlcmZvcm0gbXkgZmlyc3Qgc2luZ2xlLiBMb3ZlIHlvdSBsb25nIHRpbWUgSmltbXkhIFRoYW5rcyBmb3IgaGF2aW5nIG1lLiA6KSBQUyBJIG1ldCB0aGUgbGVnZW5kYXJ5IExhZHkgR2FnYSBhbmQgYW0gc28gaW5zcGlyZWQgYnkgaGVyIHdvcmRzIG9mIHdpc2RvbS4gI0hBSVpvbkZBTExPTiAjTG92ZU15c2VsZuKAnSAtIEBoYWlsZWVzdGVpbmZlbGQnLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnVGhlIFRvbmlnaHQgU2hvdycsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9zY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMjAuMTVfcG0ucG5nJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdzY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMjAuMTVfcG0ucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTYpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjIwLjE1X3BtLnBuZycsXG5jYXB0aW9uOiAn4oCcTW9uZGF5cyBnb3QgbWUgbGlrZeKApuKAnSAtIEBqaW1teWZhbGxvbicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdUaGUgVG9uaWdodCBTaG93JyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSovXG5dO1xuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBhc3NldExpYnJhcnlPYmplY3RzO1xufVxuZnVuY3Rpb24gY3JlYXRlQXNzZXRMaWJyYXJ5RmlsZShmaWxlRGF0YSkge1xuICAvL0hlbHBlclxuICBmdW5jdGlvbiBmaWxlVHlwZUVsZW1lbnQoZmlsZURhdGEpIHtcbiAgICBzd2l0Y2ggKGZpbGVEYXRhLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2ltYWdlJzpcbiAgICAgIHJldHVybiAkKCc8ZGl2PjxpIGNsYXNzPVwiZmEgZmEtY2FtZXJhXCI+PC9pPjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190eXBlJyk7XG5cbiAgICAgIGNhc2UgJ3ZpZGVvJzpcbiAgICAgIHJldHVybiAkKCc8ZGl2PjxpIGNsYXNzPVwiZmEgZmEtdmlkZW8tY2FtZXJhXCI+PC9pPjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190eXBlJyk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdHlwZScpO1xuICAgIH1cbiAgfVxuXG4gIC8vY3JlYXRlIGJhc2ljIGVsZW1lbnRcbiAgdmFyIGZpbGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlIGZpbGUtLW1vZGFsIGZpbGVfdHlwZV9pbWcgZmlsZV92aWV3X2dyaWQnKSxcbiAgZmlsZUluZGV4ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaGlkZGVuIGZpbGVfX2lkJykudGV4dChmaWxlRGF0YS5pZCksXG5cbiAgZmlsZUltZyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2ltZycpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIGZpbGVEYXRhLnVybCArICcpJyksXG4gIGZpbGVDb250cm9scyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2NvbnRyb2xzJykuY2xpY2sodG9nZ2xlRmlsZVNlbGVjdCksXG4gIGZpbGVDaGVja21hcmsgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19jaGVja21hcmsnKS5jbGljayh0b2dnbGVGaWxlU2VsZWN0KSxcbiAgZmlsZVRpdGxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdGl0bGUnKS50ZXh0KGZpbGVEYXRhLnRpdGxlKTtcblxuICBmaWxlQ29udHJvbHMuYXBwZW5kKGZpbGVDaGVja21hcmssIGZpbGVUeXBlRWxlbWVudChmaWxlRGF0YSkpO1xuICBmaWxlSW1nLmFwcGVuZChmaWxlQ29udHJvbHMpO1xuXG4gIGZpbGUuYXBwZW5kKGZpbGVJbmRleCwgZmlsZUltZywgZmlsZVRpdGxlKTtcbiAgcmV0dXJuIGZpbGU7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUFzc2V0TGlicmFyeSgpIHtcbiAgdmFyIGFzc2V0TGlicmFyeSA9ICQoJy5hbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzJyk7XG4gIGFzc2V0TGlicmFyeS5lbXB0eSgpO1xuICBhc3NldExpYnJhcnlPYmplY3RzLmZvckVhY2goZnVuY3Rpb24oZikge1xuICAgIGFzc2V0TGlicmFyeS5wcmVwZW5kKGNyZWF0ZUFzc2V0TGlicmFyeUZpbGUoZikpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkU2VsZWN0ZWRGaWxlcygpIHtcbiAgdmFyIHNlbGVjdGVkRmlsZXMgPSAkKCcuYWwgLmZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZS5zZWxlY3RlZCcpO1xuXG4gIGlmIChzZWxlY3RlZEZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICBzZWxlY3RlZEZpbGVzLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgIHZhciBmaWxlSWQgPSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG4gICAgICBmaWxlID0gYXNzZXRMaWJyYXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuICAgICAgICByZXR1cm4gZi5pZCA9PT0gZmlsZUlkO1xuICAgICAgfSlbMF07XG4gICAgICAvL2lmICghZmlsZUJ5SWQoZmlsZUlkLCBnYWxsZXJ5T2JqZWN0cykpIHtcbiAgICAgIGdhbGxlcnlPYmplY3RzLnB1c2goe1xuICAgICAgICBmaWxlRGF0YTogZmlsZSxcbiAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICBwb3NpdGlvbjogMTAwMCxcbiAgICAgICAgY2FwdGlvbjogJycsXG4gICAgICAgIGdhbGxlcnlDYXB0aW9uOiBmYWxzZSxcbiAgICAgICAganVzdFVwbG9hZGVkOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICAvL31cblxuICAgIH0pO1xuICAgIHVwZGF0ZUdhbGxlcnkoZ2FsbGVyeU9iamVjdHMubGVuZ3RoKTtcbiAgfVxufVxuXG4vL1JlcXVpcmVkIGZpZWxkcyBjaGVja1xuZnVuY3Rpb24gY2hlY2tGaWVsZChmaWVsZCkge1xuICAgIGlmICgkKGZpZWxkKS52YWwoKSA9PT0gJycgJiYgJChmaWVsZCkuYXR0cignZGlzcGxheScpICE9PSAnbm9uZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO31cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uIG1hcmtGaWVsZEFzUmVxdWlyZWQoZmllbGQpIHtcbiAgICAkKGZpZWxkKS5hZGRDbGFzcygnZW1wdHlGaWVsZCcpO1xuICAgIGlmICgkKGZpZWxkKS5wYXJlbnQoKS5jaGlsZHJlbignLmVyck1zZycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB2YXIgbXNnID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZXJyTXNnJykudGV4dChcIlRoaXMgZmllbGQgY291bGRuJ3QgYmUgZW1wdHlcIik7XG4gICAgICAgICQoZmllbGQpLnBhcmVudCgpLmFwcGVuZChtc2cpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1hcmtGaWVsZEFzTm9ybWFsKGZpZWxkKSB7XG4gICAgJChmaWVsZCkucmVtb3ZlQ2xhc3MoJ2VtcHR5RmllbGQnKTtcbiAgICAkKGZpZWxkKS5wYXJlbnQoKS5jaGlsZHJlbignLmVyck1zZycpLnJlbW92ZSgpO1xufVxuXG5mdW5jdGlvbiBjaGVja0ZpZWxkcyhzZWxlY3Rvcikge1xuICAgIHZhciBmaWVsZHMgPSAkKHNlbGVjdG9yKS5wYXJlbnQoKS5jaGlsZHJlbignaW5wdXQnKTtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICB2YXIgZmlyc3RJbmRleCA9IC0xO1xuICAgIGZpZWxkcy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICBpZiAoY2hlY2tGaWVsZChlbCkpIHtcbiAgICAgICAgICAgIC8vbWFya0ZpZWxkQXNOb3JtYWwoZWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9tYXJrRmllbGRBc1JlcXVpcmVkKGVsKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGZpcnN0SW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgZmlyc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIGVsLmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbiQoJ2xhYmVsLnJlcXVpZXJlZCcpLnBhcmVudCgpLmNoaWxkcmVuKCdpbnB1dCcpLm9uKCdibHVyJywgZnVuY3Rpb24oZSkge1xuICAgIGlmIChjaGVja0ZpZWxkKGUudGFyZ2V0KSkge1xuICAgICAgICAvL21hcmtGaWVsZEFzTm9ybWFsKGUudGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvL21hcmtGaWVsZEFzUmVxdWlyZWQoZS50YXJnZXQpO1xuICAgIH1cbn0pO1xuXG4vL0ZvY2FsIHJlY3RhbmdsZSBhbmQgcG9pbnRcbmZ1bmN0aW9uIGFkanVzdFJlY3QoZWwpIHtcblx0dmFyIGltZ1dpZHRoID0gJCgnI3ByZXZpZXdJbWcnKS53aWR0aCgpLFxuXHRpbWdIZWlnaHQgPSAkKCcjcHJldmlld0ltZycpLmhlaWdodCgpLFxuXHRpbWdPZmZzZXQgPSAkKCcjcHJldmlld0ltZycpLm9mZnNldCgpLFxuXHRpbWdSYXRpbyA9IGltZ1dpZHRoL2ltZ0hlaWdodCxcblxuXHRlbEggPSBlbC5vdXRlckhlaWdodCgpLFxuXHRlbFcgPSBlbC5vdXRlcldpZHRoKCksXG5cdGVsTyA9IGVsLm9mZnNldCgpLFxuXHRlbFJhdGlvID0gZWxXL2VsSCxcblx0ZWxCYWNrZ3JvdW5kUG9zaXRpb24gPSBlbC5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24nKSA/IGVsLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbicpLnNwbGl0KCcgJykgOiBbJzUwJScsICc1MCUnXTtcblxuXHRySGVpZ2h0ID0gaW1nUmF0aW8gPiBlbFJhdGlvID8gaW1nSGVpZ2h0IDogaW1nV2lkdGgvZWxSYXRpbztcblx0cldpZHRoID0gaW1nUmF0aW8gPiBlbFJhdGlvID8gaW1nSGVpZ2h0ICogZWxSYXRpbyA6IGltZ1dpZHRoO1xuXHRyT2Zmc2V0ID0ge2xlZnQ6IDAsIHRvcDogMH07XG5cblx0aWYgKGVsQmFja2dyb3VuZFBvc2l0aW9uLmxlbmd0aCA9PT0gMikge1xuXHRcdGlmIChlbEJhY2tncm91bmRQb3NpdGlvblswXS5pbmRleE9mKCclJykpIHtcblx0XHRcdHZhciBiZ0xlZnRQZXJzZW50ID0gZWxCYWNrZ3JvdW5kUG9zaXRpb25bMF0uc2xpY2UoMCwtMSksXG5cdFx0XHRiZ0xlZnRQaXhlbCA9IE1hdGgucm91bmQoaW1nV2lkdGggKiBiZ0xlZnRQZXJzZW50LzEwMCkgLSByV2lkdGgvMjtcblxuXHRcdFx0aWYgKChiZ0xlZnRQaXhlbCkgPCAwKSB7YmdMZWZ0UGl4ZWwgPSAwO31cblx0XHRcdGlmICgoYmdMZWZ0UGl4ZWwgKyByV2lkdGgpID4gaW1nV2lkdGgpIHtiZ0xlZnRQaXhlbCA9IGltZ1dpZHRoIC0gcldpZHRoO31cblxuXHRcdFx0ck9mZnNldC5sZWZ0ID0gaW1nUmF0aW8gPiBlbFJhdGlvID8gYmdMZWZ0UGl4ZWwgOiAwO1xuXHRcdH1cblx0XHRpZiAoZWxCYWNrZ3JvdW5kUG9zaXRpb25bMV0uaW5kZXhPZignJScpKSB7XG5cdFx0XHR2YXIgYmdUb3BQZXJzZW50ID0gZWxCYWNrZ3JvdW5kUG9zaXRpb25bMV0uc2xpY2UoMCwtMSksXG5cdFx0XHRiZ1RvcFBpeGVsID0gTWF0aC5yb3VuZChpbWdIZWlnaHQqYmdUb3BQZXJzZW50LzEwMCkgLSBySGVpZ2h0LzI7XG5cblx0XHRcdGlmICgoYmdUb3BQaXhlbCkgPCAwKSB7YmdUb3BQaXhlbCA9IDA7fVxuXHRcdFx0aWYgKChiZ1RvcFBpeGVsICsgckhlaWdodCkgPiBpbWdIZWlnaHQpIHtiZ1RvcFBpeGVsID0gaW1nSGVpZ2h0IC0gckhlaWdodDt9XG5cblx0XHRcdHJPZmZzZXQudG9wID0gaW1nUmF0aW8gPiBlbFJhdGlvID8gMCA6IGJnVG9wUGl4ZWw7XG5cdFx0fVxuXHR9XG5cblx0JCgnI2ZvY2FsUmVjdCcpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG5cblx0JCgnI2ZvY2FsUmVjdCcpLmNzcygnd2lkdGgnLCByV2lkdGgudG9TdHJpbmcoKSArICdweCcpXG5cdC5jc3MoJ2hlaWdodCcsIHJIZWlnaHQudG9TdHJpbmcoKSArICdweCcpXG5cdC5jc3MoJ2xlZnQnLCByT2Zmc2V0LmxlZnQudG9TdHJpbmcoKSArICdweCcpXG5cdC5jc3MoJ3RvcCcsIHJPZmZzZXQudG9wLnRvU3RyaW5nKCkgKyAncHgnKVxuXHQuZHJhZ2dhYmxlKHtcblx0XHRheGlzOiBpbWdSYXRpbyA+IGVsUmF0aW8gPyAneCcgOiAneScsXG5cdFx0Y29udGFpbm1lbnQ6IFwiI3ByZXZpZXdJbWdcIixcblx0XHRzdGFydDogZnVuY3Rpb24oZSwgdWkpIHtcblx0XHRcdGVsLmNzcygndHJhbnNpdGlvbicsICdub25lJyk7XG5cdFx0fSxcblx0XHRzdG9wOiBmdW5jdGlvbihlLCB1aSkge1xuXHRcdFx0ZWwuY3NzKCd0cmFuc2l0aW9uJywgJzAuM3MgZWFzZS1vdXQnKTtcblx0XHRcdGFkanVzdFB1cnBvc2UoJChlLnRhcmdldCksIGVsKTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoJy5wdXJwb3Nlc19fY29udGFpbmVyIC5wdXJwb3NlLmlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0ZWwucGFyZW50KCkuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xufVxuXG5mdW5jdGlvbiBhZGp1c3RQdXJwb3NlKGZvY2FsSXRlbSwgcHVycG9zZUltZykge1xuXHR2YXIgaW1nID0gJCgnI3ByZXZpZXdJbWcnKSxcblx0aVdpZHRoID0gaW1nLndpZHRoKCksXG5cdGlIZWlnaHQgPSBpbWcuaGVpZ2h0KCksXG5cdGlPZmZzZXQgPSBpbWcub2Zmc2V0KCksXG5cblx0cFdpZHRoID0gZm9jYWxJdGVtLm91dGVyV2lkdGgoKSxcblx0cEhlaWdodCA9IGZvY2FsSXRlbS5vdXRlckhlaWdodCgpLFxuXHRwT2Zmc2V0ID0gZm9jYWxJdGVtLm9mZnNldCgpLFxuXG5cdGZUb3AgPSBNYXRoLnJvdW5kKChwT2Zmc2V0LnRvcCAtIGlPZmZzZXQudG9wICsgcEhlaWdodC8yKSoxMDAgLyBpSGVpZ2h0KTtcblx0ZkxlZnQgPSBNYXRoLnJvdW5kKChwT2Zmc2V0LmxlZnQgLSBpT2Zmc2V0LmxlZnQgKyBwV2lkdGgvMikgKiAxMDAgLyBpV2lkdGgpO1xuXG5cdGlmIChwdXJwb3NlSW1nKSB7XG5cdFx0cHVycG9zZUltZy5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24nLCBmTGVmdC50b1N0cmluZygpICsgJyUgJyArIGZUb3AudG9TdHJpbmcoKSArICclJyk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0JCgnLnB1cnBvc2VzX19jb250YWluZXIgLnB1cnBvc2UgLnB1cnBvc2UtaW1nJykuY3NzKCdiYWNrZ3JvdW5kLXBvc2l0aW9uJywgZkxlZnQudG9TdHJpbmcoKSArICclICcgKyBmVG9wLnRvU3RyaW5nKCkgKyAnJScpO1xuXHR9XG59XG5cbi8qJCgnI2ZvY2FsUmVjdFRvZ2dsZScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0aWYgKCQoZS50YXJnZXQpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xuXHRcdCQoJy5wciA+IC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ2ZvY2FsIGxpbmUgcmVjdCcpO1xuXHRcdCQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0fSBlbHNlIHtcblx0XHQkKCcucHIgPiAucHJldmlldycpLmFkZENsYXNzKCdmb2NhbCBsaW5lIHJlY3QnKTtcblx0XHQkKCcucHIgPiAucHJldmlldycpLnJlbW92ZUNsYXNzKCdwb2ludCcpO1xuXHRcdCQoJyNmb2NhbFBvaW50VG9nZ2xlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdCQoZS50YXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuXHRcdC8vJCgnLmZvY2FsUmVjdCcpLnJlc2l6YWJsZSh7aGFuZGxlczogXCJhbGxcIiwgY29udGFpbm1lbnQ6IFwiI3ByZXZpZXdJbWdcIn0pO1xuXHRcdGFkanVzdFJlY3QoJCgnLnB1cnBvc2VzX19jb250YWluZXIgLnB1cnBvc2UtaW1nJykuZmlyc3QoKSk7XG5cdFx0JCgnI2ZvY2FsUmVjdCcpLmRyYWdnYWJsZSh7IGNvbnRhaW5tZW50OiBcIiNwcmV2aWV3SW1nXCIsIHNjcm9sbDogZmFsc2UgfSk7XG5cblx0XHQkKCcucHVycG9zZXNfX2NvbnRhaW5lciAucHVycG9zZS1pbWcnKS51bmJpbmQoKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRhZGp1c3RSZWN0KCQoZS50YXJnZXQpKTtcblx0XHR9KTtcblx0XHQvLyQoJy5pbWctd3JhcHBlcicpLmNzcygnbWF4LXdpZHRoJywgJzkwJScpO1xuXHRcdHNldFB1cnBvc2VQYWdpbmF0aW9uKCk7XG5cdH1cbn0pOyovXG5cbi8vVXRpbGl0aWVzXG5cbi8vVGhyb3R0bGUgU2Nyb2xsIGV2ZW50c1xuOyhmdW5jdGlvbigpIHtcbiAgICB2YXIgdGhyb3R0bGUgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBvYmopIHtcbiAgICAgICAgb2JqID0gb2JqIHx8IHdpbmRvdztcbiAgICAgICAgdmFyIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdmFyIGZ1bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChydW5uaW5nKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgb2JqLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KG5hbWUpKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgb2JqLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZnVuYyk7XG4gICAgfTtcblxuICAgIC8qIGluaXQgLSB5b3UgY2FuIGluaXQgYW55IGV2ZW50ICovXG4gICAgdGhyb3R0bGUgKFwic2Nyb2xsXCIsIFwib3B0aW1pemVkU2Nyb2xsXCIpO1xuICAgIHRocm90dGxlIChcInJlc2l6ZVwiLCBcIm9wdGltaXplZFJlc2l6ZVwiKTtcbn0pKCk7XG5cbi8vU3RpY2t5IHRvcGJhclxuZnVuY3Rpb24gU3RpY2t5VG9wYmFyKCkge1xuICAgIHRoaXMuX2luaXQoKTtcbn1cblxuU3RpY2t5VG9wYmFyLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLmxhc3RTY3JvbGxQb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgc2VsZi50b3BiYXJUcmFuc2l0aW9uID0gZmFsc2U7XG5cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib3B0aW1pemVkU2Nyb2xsXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIHNjcm9sbFBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDU1ICYmICEkKCcuYy1IZWFkZXItdGl0bGUnKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgJCgnLmMtSGVhZGVyLXRpdGxlJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgNTUgJiYgJCgnLmMtSGVhZGVyLXRpdGxlJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICQoJy5jLUhlYWRlci10aXRsZScpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoJy5jLUhlYWRlci1jb250cm9scycpLmhhc0NsYXNzKCdjLUhlYWRlci1jb250cm9scy0tY2VudGVyJykpIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gNTUgJiYgISQoJy5jLUhlYWRlci1jb250cm9scycpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyLWNvbnRyb2xzLS1jZW50ZXInKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgNTUgJiYgJCgnLmMtSGVhZGVyLWNvbnRyb2xzJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXItY29udHJvbHMtLWNlbnRlcicpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoJy5jLUhlYWRlci1jb250cm9scycpLmhhc0NsYXNzKCdoZWFkZXJfX2NvbnRyb2xzLS1maWx0ZXInKSkge1xuICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA1NSAmJiAhJCgnLmMtSGVhZGVyLWNvbnRyb2xzJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuaGVhZGVyX19jb250cm9scy0tZmlsdGVyJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDU1ICYmICQoJy5jLUhlYWRlci1jb250cm9scycpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmhlYWRlcl9fY29udHJvbHMtLWZpbHRlcicpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdjLUhlYWRlci0tY29udHJvbHMnKSkge1xuICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSAxNDUgJiYgISQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDE0NSAmJiAkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlcicpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdoZWFkZXItLWZpbHRlcicpKSB7XG4gICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDcwICYmICEkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlcicpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCA3MCAmJiAkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlcicpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA4NSAmJiAhJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXInKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgODUgJiYgJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCcubGlicmFyeV9faGVhZGVyJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA3MCAmJiAhJCgnLmxpYnJhcnlfX2hlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmxpYnJhcnlfX2hlYWRlcicpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCA3MCAmJiAkKCcubGlicmFyeV9faGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcubGlicmFyeV9faGVhZGVyJykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IDkzMCkge1xuICAgICAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gNTUgJiYgISQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgNTUgJiYgJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDEwICYmICEkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDEwICYmICQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSk7XG59O1xuXG4vL1Njcm9sbFNweU5hdlxuOyhmdW5jdGlvbih3aW5kb3cpIHtcbiAgICAvLyd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIFNjcm9sbFNweU5hdihlbCkge1xuICAgICAgICB0aGlzLmVsID0gZWw7XG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgICAgICB0aGlzLl9pbml0RXZlbnRzKCk7XG4gICAgfVxuXG4gICAgU2Nyb2xsU3B5TmF2LnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICBvZmZzZXQ6IHRoaXMuZWwuZGF0YXNldC50b3BPZmZzZXRcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLml0ZW1zID0gW10uc2xpY2UuY2FsbCh0aGlzLmVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaScpKS5tYXAoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIHZhciBpdGVtSWQgPSBlbC5kYXRhc2V0LmhyZWY7XG4gICAgICAgICAgICByZXR1cm4ge25hdkl0ZW06IGVsLFxuICAgICAgICAgICAgICAgICAgICBpdGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpdGVtSWQpfTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFNjcm9sbFNweU5hdi5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib3B0aW1pemVkU2Nyb2xsXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmICghc2VsZi5zY3JvbGxpbmdUb0l0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFpbkl0ZW1zID0gc2VsZi5pdGVtcy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxCQ1IgPSBpdGVtLml0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxCQ1IudG9wID4gc2VsZi5vcHRpb25zLm9mZnNldCAmJiBlbEJDUi50b3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmIChtYWluSXRlbXMubGVuZ3RoID4gMCAmJiAoIXNlbGYubWFpbkl0ZW0gfHwgc2VsZi5tYWluSXRlbSAhPT0gbWFpbkl0ZW1zWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm1haW5JdGVtID0gbWFpbkl0ZW1zWzBdO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaS5uYXZJdGVtLmNsYXNzTGlzdC5yZW1vdmUoc2VsZi5vcHRpb25zLmFjdGl2ZUNsYXNzIHx8ICdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubWFpbkl0ZW0ubmF2SXRlbS5jbGFzc0xpc3QuYWRkKHNlbGYub3B0aW9ucy5hY3RpdmVDbGFzcyB8fCAnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzZWxmLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgaXRlbS5uYXZJdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHZhciBocmVmID0gJyMnICsgZS50YXJnZXQuZGF0YXNldC5ocmVmO1xuICAgICAgICAgICAgICAgIHZhciBvZmZzZXRUb3AgPSBocmVmID09PSBcIiNcIiA/IDAgOiAkKGhyZWYpLm9mZnNldCgpLnRvcCAtIHNlbGYub3B0aW9ucy5vZmZzZXQgLSAzMDtcbiAgICAgICAgICAgICAgICBzZWxmLnNjcm9sbGluZ1RvSXRlbSA9IHRydWU7XG4gICAgICAgICAgICAgICAgc2VsZi5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgaS5pdGVtLmNsYXNzTGlzdC5yZW1vdmUoc2VsZi5vcHRpb25zLmFjdGl2ZUNsYXNzIHx8ICdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgaS5uYXZJdGVtLmNsYXNzTGlzdC5yZW1vdmUoc2VsZi5vcHRpb25zLmFjdGl2ZUNsYXNzIHx8ICdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcyhzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuXG5cbiAgICAgICAgICAgICAgICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IG9mZnNldFRvcFxuICAgICAgICAgICAgICAgIH0sIDMwMCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2Nyb2xsaW5nVG9JdGVtID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICQoaHJlZikuYWRkQ2xhc3Moc2VsZi5vcHRpb25zLmFjdGl2ZUNsYXNzIHx8ICdpcy1hY3RpdmUnKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBpbml0U2Nyb2xsU3B5TmF2KCkge1xuICAgICAgICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1zY3JvbGxTcHlOYXYnKSkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbmV3IFNjcm9sbFNweU5hdihlbCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpbml0U2Nyb2xsU3B5TmF2KCk7XG5cbn0pKHdpbmRvdyk7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4vLyBDb250cm9sc1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbi8vdGV4dGZpZWxkc1xuLy87KGZ1bmN0aW9uKHdpbmRvdykge1xuLy8gICAgJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBUZXh0ZmllbGQoZWwsIG9wdGlvbnMpIHtcbiAgdGhpcy5lbCA9IGVsO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gIHRoaXMuX2luaXQoKTtcbiAgdGhpcy5faW5pdEV2ZW50cygpO1xufVxuXG5UZXh0ZmllbGQucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5lbC5wbGFjZWhvbGRlciA9ICcnO1xuXG4gIHRoaXMuZmllbGRXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRoaXMuZmllbGRXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2lucHV0X193cmFwcGVyJyk7XG4gIHRoaXMuZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5maWVsZFdyYXBwZXIsIHRoaXMuZWwpO1xuICB0aGlzLmZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcbiAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdqcy1pbnB1dCcpO1xuICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2lucHV0X19maWVsZCcpO1xuXG4gIGlmICh0aGlzLmVsLnZhbHVlICE9PSAnJykge1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuICAgIHRoaXMuX3RvZ2dsZUFkZGFibGUoKTtcbiAgfVxuXG4gIGlmICh0aGlzLmVsLnR5cGUgPT09ICd0ZXh0YXJlYScpIHt0aGlzLl9hdXRvc2l6ZSgpO31cbiAgaWYgKHRoaXMub3B0aW9ucy5hdXRvY29tcGxldGUpIHt0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2hhcy1hdXRvY29tcGxldGUnKTt9XG4gIGlmICh0aGlzLmVsLmNsYXNzTGlzdC5jb250YWlucygnanMtZGF0ZXBpY2tlcicpKSB7XG4gICAgdmFyIGlkID0gJ2RhdGVQaWNrZXInICsgTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKjEwMDAwKTtcbiAgICB0aGlzLmVsLmlkID0gaWQ7XG4gICAgJCh0aGlzLmVsKS5kYXRlcGlja2VyKHtcbiAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnIycgKyBpZCkuYWRkQ2xhc3MoJ2lucHV0X3N0YXRlX25vdC1lbXB0eSBqcy1oYXNWYWx1ZScpO1xuICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICB9LFxuICAgICAgY2hhbmdlTW9udGg6IHRydWUsXG4gICAgICBjaGFuZ2VZZWFyOiB0cnVlXG4gICAgICAvKm1vbnRoTmFtZXNTaG9ydDogWyBcIkphbnVhclwiLCBcIkZlYnJ1YXJcIiwgXCJNYXJ0c1wiLCBcIkFwcmlsXCIsIFwiTWFqXCIsIFwiSnVuaVwiLCBcIkp1bGlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPa3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiIF0qL1xuICAgIH0pO1xuICB9XG4gIGlmICh0aGlzLmVsLmlkID09PSAnc3RhcnREYXRlJykge1xuICAgICQodGhpcy5lbCkuZGF0ZXBpY2tlcih7XG4gICAgICBvblNlbGVjdDogZnVuY3Rpb24oZGF0ZVN0cmluZywgZGF0ZXBpY2tlcikge1xuICAgICAgICAkKCcjc3RhcnREYXRlJykuYWRkQ2xhc3MoJ2lucHV0X3N0YXRlX25vdC1lbXB0eSBqcy1oYXNWYWx1ZScpO1xuICAgICAgICBzdGFydERhdGUgPSBkYXRlU3RyaW5nO1xuICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICB9LFxuICAgICAgY2hhbmdlTW9udGg6IHRydWUsXG4gICAgICBjaGFuZ2VZZWFyOiB0cnVlXG4gICAgICAvKm1vbnRoTmFtZXNTaG9ydDogWyBcIkphbnVhclwiLCBcIkZlYnJ1YXJcIiwgXCJNYXJ0c1wiLCBcIkFwcmlsXCIsIFwiTWFqXCIsIFwiSnVuaVwiLCBcIkp1bGlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPa3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiIF0qL1xuICAgIH0pO1xuICB9XG4gIGlmICh0aGlzLmVsLmlkID09PSAnZW5kRGF0ZScpIHtcbiAgICAkKHRoaXMuZWwpLmRhdGVwaWNrZXIoe1xuICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKGRhdGVTdHJpbmcsIGRhdGVwaWNrZXIpIHtcbiAgICAgICAgJCgnI2VuZERhdGUnKS5hZGRDbGFzcygnaW5wdXRfc3RhdGVfbm90LWVtcHR5IGpzLWhhc1ZhbHVlJyk7XG4gICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgIH0sXG4gICAgICBiZWZvcmVTaG93OiBmdW5jdGlvbihlbGVtZW50LCBkYXRlcGlja2VyKSB7XG4gICAgICAgICQoJyNlbmREYXRlJykuZGF0ZXBpY2tlcignb3B0aW9uJywgJ2RlZmF1bHREYXRlJywgc3RhcnREYXRlKTtcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VNb250aDogdHJ1ZSxcbiAgICAgIGNoYW5nZVllYXI6IHRydWVcbiAgICAgIC8qbW9udGhOYW1lc1Nob3J0OiBbIFwiSmFudWFyXCIsIFwiRmVicnVhclwiLCBcIk1hcnRzXCIsIFwiQXByaWxcIiwgXCJNYWpcIiwgXCJKdW5pXCIsIFwiSnVsaVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9rdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCIgXSovXG4gICAgfSk7XG4gIH1cblxuICBpZiAodGhpcy5vcHRpb25zLmxhYmVsKSB7XG4gICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgdGhpcy5sYWJlbC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMubGFiZWw7XG4gICAgdGhpcy5sYWJlbC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9fbGFiZWwnKTtcbiAgICB0aGlzLmxhYmVsLmZvciA9IHRoaXMuZWwuaWQ7XG4gICAgdGhpcy5maWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5sYWJlbCk7XG4gIH1cblxuICB0aGlzLmJsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7IC8vVXNlIGFzIGEgaGVscGVyIHRvIG1ha2UgYmxpbmsgYW5pbWF0aW9uIG9uIGZvY3VzIGZpZWxkXG4gIHRoaXMuYmxpbmsuY2xhc3NMaXN0LmFkZCgnaW5wdXRfX2JsaW5rJyk7XG4gIHRoaXMuZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuYmxpbmspO1xuXG4gIGlmICh0aGlzLm9wdGlvbnMuaGVscFRleHQpIHtcbiAgICB0aGlzLmhlbHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5oZWxwVGV4dC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuaGVscFRleHQ7XG4gICAgdGhpcy5oZWxwVGV4dC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9faGVscC10ZXh0Jyk7XG4gICAgdGhpcy5maWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5oZWxwVGV4dCk7XG4gIH1cbiAgaWYgKHRoaXMub3B0aW9ucy5lcnJNc2cpIHtcbiAgICB0aGlzLmVyck1zZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZXJyTXNnLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5lcnJNc2c7XG4gICAgdGhpcy5lcnJNc2cuY2xhc3NMaXN0LmFkZCgnaW5wdXRfX2Vyci1tc2cnKTtcbiAgICB0aGlzLmZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVyck1zZyk7XG4gIH1cbn07XG5cblRleHRmaWVsZC5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAvL0NoZWNrIGlmIGZpZWxkIGlzIGVtcHR5IG9yIG5vdCBhbmQgY2hhbmdlIGNsYXNzIGFjY29yZGluZ2x5XG4gICQodGhpcy5lbCkub24oJ2JsdXInLCBmdW5jdGlvbihlKSB7XG4gICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5wdXRfc3RhdGVfZXJyJyk7XG4gICAgaWYgKGUudGFyZ2V0LnZhbHVlICE9PSAnJykge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIH1cbiAgICBlLnRhcmdldC5wbGFjZWhvbGRlciA9ICcnO1xuICAgIGlmIChlLnRhcmdldC5yZXF1aXJlZCAmJiAhZS50YXJnZXQudmFsdWUpIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2lucHV0X3N0YXRlX2VycicpO1xuICAgIH1cbiAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtzZWxmLmxpc3QucmVtb3ZlKCk7fSwgMTUwKTtcbiAgICB9XG4gICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgfSk7XG5cbiAgLy9PbiBmb2N1cyBldmVudFxuICAkKHRoaXMuZWwpLm9uKCdmb2N1cycsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoc2VsZi5vcHRpb25zLnBsYWNlaG9sZGVyKSB7XG4gICAgICBlLnRhcmdldC5wbGFjZWhvbGRlciA9IHNlbGYub3B0aW9ucy5wbGFjZWhvbGRlcjtcbiAgICB9XG4gICAgaWYgKHNlbGYub3B0aW9ucy5hdXRvY29tcGxldGUpIHtcbiAgICAgIHNlbGYubGlzdCA9IHJlbmRlckF1dG9jb21wbGV0ZUxpc3Qoc2VsZi5vcHRpb25zLmF1dG9jb21wbGV0ZSwgaGFuZGxlQXV0b2NvbXBsZXRlSXRlbUNsaWNrKTtcbiAgICAgIHBsYWNlQXV0b2NvbXBsZXRlTGlzdChzZWxmLmxpc3QsICQoc2VsZi5maWVsZFdyYXBwZXIpKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vT24gY2hhbmdlIGV2ZW50XG4gICQodGhpcy5lbCkub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dF9zdGF0ZV9lcnInKTtcbiAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfVxuICAgIGUudGFyZ2V0LnBsYWNlaG9sZGVyID0gJyc7XG4gICAgaWYgKHNlbGYub3B0aW9ucy5vbkNoYW5nZSkge1xuICAgICAgc2VsZi5vcHRpb25zLm9uQ2hhbmdlKGUpO1xuICAgIH1cbiAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuICB9KTtcblxuICAvL09uIGlucHV0IGV2ZW50XG4gICQoc2VsZi5lbCkub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge1xuICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0X3N0YXRlX2VycicpO1xuICAgIGlmIChlLnRhcmdldC52YWx1ZSAhPT0gJycpIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICB9XG4gICAgZS50YXJnZXQucGxhY2Vob2xkZXIgPSAnJztcbiAgICBpZiAoc2VsZi5vcHRpb25zLm9uSW5wdXQpIHtcbiAgICAgIHNlbGYub3B0aW9ucy5vbklucHV0KGUpO1xuICAgIH1cbiAgICBpZiAoc2VsZi5vcHRpb25zLmF1dG9jb21wbGV0ZSkge1xuICAgICAgdmFyIGRhdGEgPSBzZWxmLm9wdGlvbnMuYXV0b2NvbXBsZXRlLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VsZi5lbC52YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIH0pXG4gICAgICB1cGRhdGVBdXRvY29tcGxldGVMaXN0KHNlbGYubGlzdCwgZGF0YSwgaGFuZGxlQXV0b2NvbXBsZXRlSXRlbUNsaWNrKTtcbiAgICB9XG4gICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgfSk7XG4gICQoc2VsZi5lbCkub24oJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcblxuICBmdW5jdGlvbiBoYW5kbGVLZXlEb3duKGUpIHtcbiAgICB2YXIgaW5kZXgsIGxlbmd0aDtcbiAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgY2FzZSAxMzpcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBzZWxlY3RJdGVtKHNlbGYubGlzdC5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuZ2V0KDApKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtjbG9zZUF1dG9jb21wbGV0ZSgpOyAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAyNzpcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgY2xvc2VBdXRvY29tcGxldGUoKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMzg6XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggLSAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgPCA1MCkge1xuICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpIC0gJChzZWxmLmxpc3QpLmhlaWdodCgpID4gMCA/ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA6IDBcbiAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogMFxuICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA0MDpcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgICBsZW5ndGggPSAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5sZW5ndGg7XG5cbiAgICAgICAgICBpZiAoaW5kZXggPCBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcblxuICAgICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5oZWlnaHQoKSA8ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLm91dGVySGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLm91dGVySGVpZ2h0KClcbiAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGluZGV4ID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCkucG9zaXRpb24oKS50b3AgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCkuaGVpZ2h0KClcbiAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlckF1dG9jb21wbGV0ZUxpc3QoZGF0YSwgY2FsbGJhY2spIHtcbiAgICB2YXIgbGlzdCA9ICQoJzx1bCAvPicpLmFkZENsYXNzKCdhdXRvY29tcGxldGUnKVxuXG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIGxpc3QuYXBwZW5kKHJlbmRlckF1dG9jb21wbGV0ZUl0ZW0oaXRlbSwgY2FsbGJhY2spKTtcbiAgICB9KTtcbiAgICBsaXN0LmZpbmQoJy5hdXRvY29tcGxldGVfX2l0ZW0nKS5maXJzdCgpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuICBmdW5jdGlvbiBwbGFjZUF1dG9jb21wbGV0ZUxpc3QobGlzdCwgcGFyZW50KSB7XG4gICAgcGFyZW50LmFwcGVuZChsaXN0KTtcblxuICAgIHZhciBwYXJlbnRCQ1IgPSBwYXJlbnQuZ2V0KDApLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgIHBhcmVudE9mZnNldFRvcCA9IHBhcmVudC5nZXQoMCkub2Zmc2V0VG9wLFxuICAgIGxpc3RCQ1IgPSBsaXN0LmdldCgwKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcblxuICAgIGhlaWdodENoZWNrID0gd2luZG93LmlubmVySGVpZ2h0IC0gcGFyZW50QkNSLnRvcCAtIHBhcmVudEJDUi5oZWlnaHQgLSBsaXN0QkNSLmhlaWdodDtcblxuICAgIGxpc3QuZ2V0KDApLnN0eWxlLnRvcCA9IGhlaWdodENoZWNrID4gMCA/IHBhcmVudE9mZnNldFRvcCArIHBhcmVudEJDUi5oZWlnaHQgKyA1ICsgJ3B4JyA6IHBhcmVudE9mZnNldFRvcCAtIGxpc3RCQ1IuaGVpZ2h0IC0gMTAgKyAncHgnO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZUF1dG9jb21wbGV0ZUxpc3QgKGxpc3QsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgbGlzdC5lbXB0eSgpO1xuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICBsaXN0LmFwcGVuZChyZW5kZXJBdXRvY29tcGxldGVJdGVtKGl0ZW0sIGNhbGxiYWNrKSk7XG4gICAgfSk7XG4gICAgbGlzdC5maW5kKCcuYXV0b2NvbXBsZXRlX19pdGVtJykuZmlyc3QoKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gIH1cbiAgZnVuY3Rpb24gcmVuZGVyQXV0b2NvbXBsZXRlSXRlbShpdGVtLCBjYWxsYmFjaykge1xuICAgIHJldHVybiAkKCc8bGkgLz4nKS5hZGRDbGFzcygnYXV0b2NvbXBsZXRlX19pdGVtJykuY2xpY2soY2FsbGJhY2spLm9uKCdtb3VzZW92ZXInLCBoYW5kbGVJdGVtTW91c2VPdmVyKS50ZXh0KGl0ZW0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQXV0b2NvbXBsZXRlSXRlbUNsaWNrKGUpIHtcbiAgICBzZWxlY3RJdGVtKGUudGFyZ2V0KTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVJdGVtTW91c2VPdmVyKGUpIHtcbiAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgfVxuICBmdW5jdGlvbiBzZWxlY3RJdGVtKGl0ZW0pIHtcbiAgICBzZWxmLmVsLnZhbHVlID0gaXRlbS5pbm5lckhUTUw7XG4gICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICBjbG9zZUF1dG9jb21wbGV0ZSgpO1xuICB9XG4gIGZ1bmN0aW9uIGNsb3NlQXV0b2NvbXBsZXRlKCkge1xuICAgIHNlbGYubGlzdC5yZW1vdmUoKTtcbiAgfVxufTtcblxuLy9BdXRvcmVzaXplIHRleHRhcmVhXG5UZXh0ZmllbGQucHJvdG90eXBlLl9hdXRvc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5lbC52YWx1ZSA9PT0gJycpIHt0aGlzLmVsLnJvd3MgPSAxO31cbiAgZWxzZSB7XG4gICAgdmFyIHdpZHRoID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCxcbiAgICBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpLFxuICAgIHRleHRXaWR0aCA9IHRoaXMuZWwudmFsdWUubGVuZ3RoICogNyxcbiAgICByZSA9IC9bXFxuXFxyXS9pZztcbiAgICBsaW5lQnJha2VzID0gdGhpcy5lbC52YWx1ZS5tYXRjaChyZSk7XG4gICAgcm93ID0gTWF0aC5jZWlsKHRleHRXaWR0aCAvIHdpZHRoKTtcblxuICAgIHJvdyA9IHJvdyA8PSAwID8gMSA6IHJvdztcbiAgICByb3cgPSB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0ICYmIHJvdyA+IHRoaXMub3B0aW9ucy5tYXhIZWlnaHQgPyB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0IDogcm93O1xuXG4gICAgaWYgKGxpbmVCcmFrZXMpIHtcbiAgICAgIHJvdyArPSBsaW5lQnJha2VzLmxlbmd0aDtcbiAgICB9XG5cbiAgICB0aGlzLmVsLnJvd3MgPSByb3c7XG4gIH1cbn07XG5cblRleHRmaWVsZC5wcm90b3R5cGUuX3RvZ2dsZUFkZGFibGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykubGVuZ3RoID4gMCkge1xuICAgIGNvbnNvbGUubG9nKCQodGhpcy5lbCkuaGFzQ2xhc3MoJ2pzLWhhc1ZhbHVlJykpO1xuICAgIGlmICgkKHRoaXMuZWwpLmhhc0NsYXNzKCdqcy1oYXNWYWx1ZScpKSB7XG4gICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmFkZENsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLnJlbW92ZUNsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gaW5pdFRleHRmaWVsZHMoKSB7XG4gIHJldHVybjtcbiAgW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtaW5wdXQnKSkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgIG5ldyBUZXh0ZmllbGQoZWwsIHtcbiAgICAgIGxhYmVsOiBlbC5kYXRhc2V0LmxhYmVsLFxuICAgICAgaGVscFRleHQ6IGVsLmRhdGFzZXQuaGVscFRleHQsXG4gICAgICBlcnJNc2c6IGVsLmRhdGFzZXQuZXJyTXNnLFxuICAgICAgcGxhY2Vob2xkZXI6IGVsLnBsYWNlaG9sZGVyLFxuICAgICAgbWFzazogZWwuZGF0YXNldC5tYXNrLFxuICAgICAgbWF4SGVpZ2h0OiBlbC5kYXRhc2V0Lm1heEhlaWdodFxuICAgIH0pO1xuICB9KTtcbiAgXG59XG5cbmluaXRUZXh0ZmllbGRzKCk7XG5cbi8vc2VsZWN0Ym94XG4vLzsoZnVuY3Rpb24od2luZG93KSB7XG4gICAgLy8ndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBTZWxlY3Rib3goZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgICAgICB0aGlzLl9pbml0RXZlbnRzKCk7XG4gICAgfVxuXG4gICAgU2VsZWN0Ym94LnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSB0aGlzLm9wdGlvbnMuaXRlbXMuaW5kZXhPZih0aGlzLm9wdGlvbnMuc2VsZWN0ZWRJdGVtKTtcbiAgICAgICAgdGhpcy5vcHRpb25zLnVuc2VsZWN0ID0gdGhpcy5vcHRpb25zLnVuc2VsZWN0ICE9PSAtMSA/ICfigJQgTm9uZSDigJQnIDogdGhpcy5vcHRpb25zLnVuc2VsZWN0O1xuXG4gICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnc2VsZWN0X193cmFwcGVyJyk7XG4gICAgICAgIHRoaXMuZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5zZWxlY3RXcmFwcGVyLCB0aGlzLmVsKTtcbiAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2pzLXNlbGVjdGJveCcpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fZmllbGQnKTtcblxuICAgICAgICBpZiAodGhpcy5hY3RpdmVJdGVtID49IDApIHtcbiAgICAgICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuaXRlbXNbdGhpcy5hY3RpdmVJdGVtXTtcbiAgICAgICAgICAgIHRoaXMuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubGFiZWwpIHtcbiAgICAgICAgICAgIHRoaXMubGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMubGFiZWw7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuZm9yID0gdGhpcy5lbC5pZDtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmhlbHBUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0LmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5oZWxwVGV4dDtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19oZWxwLXRleHQnKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmhlbHBUZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVyck1zZykge1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5lcnJNc2c7XG4gICAgICAgICAgICB0aGlzLmVyck1zZy5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2Vyci1tc2cnKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVyck1zZyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgU2VsZWN0Ym94LnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy9DbG9zZSBsaXN0IGhlbHBlclxuICAgICAgICBmdW5jdGlvbiBjbG9zZUxpc3QoKSB7XG4gICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGJveF9zdGF0ZV9vcGVuJyk7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RXcmFwcGVyLnJlbW92ZUNoaWxkKHNlbGYubGlzdCk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuc2VhcmNoRmllbGQgJiYgc2VsZi5zZWFyY2hGaWVsZC5wYXJlbnROb2RlID09PSBzZWxmLmVsKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5yZW1vdmVDaGlsZChzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLmlucHV0RmllbGQgJiYgc2VsZi5pbnB1dEZpZWxkLnBhcmVudE5vZGUgPT09IHNlbGYuZWwpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLnJlbW92ZUNoaWxkKHNlbGYuaW5wdXRGaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5hY3RpdmVJdGVtIDwgMCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gc2VsZi5vcHRpb25zLml0ZW1zW3NlbGYuYWN0aXZlSXRlbV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVTZWxlY3REb2NDbGljayk7XG4gICAgICAgIH1cblxuICAgICAgICAvL0NyZWF0ZSBsaXN0IGhlbHBlclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVMaXN0KGl0ZW1zLCBhY3RpdmVJdGVtLCBzZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2VsZi5saXN0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICAgIHNlbGYubGlzdC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2xpc3QnKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdEl0ZW0oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbUNsYXNzID0gc2VsZi5vcHRpb25zLmNvbXBsZXhJdGVtcyA/ICdzZWxlY3Rib3hfX2xpc3QtaXRlbSBzZWxlY3Rib3hfX2xpc3QtaXRlbS0tY29tcGxleCcgOiAnc2VsZWN0Ym94X19saXN0LWl0ZW0gc2VsZWN0Ym94X19saXN0LWl0ZW0tLXRleHQnLFxuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudCA9ICQoJzxsaT48L2xpPicpLmFkZENsYXNzKGl0ZW1DbGFzcykudGV4dChpdGVtKSxcbiAgICAgICAgICAgICAgICAgICAgbGlzdEhlbHBlciA9ICQoJzxkaXY+PC9kaXY+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWl0ZW0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygncG9zaXRpb24nLCAnYWJzb2x1dGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnei1pbmRleCcsICctMScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnb3ZlcmZsb3cnLCAndmlzaWJsZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCd3aGl0ZS1zcGFjZScsICdub3dyYXAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQoaXRlbSk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQobGlzdEhlbHBlci5nZXQoMCkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuYXR0cignZGF0YS1pbmRleCcsIGluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmNvbXBsZXhJdGVtcykge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5nZXQoMCkuaW5uZXJIVE1MID0gaXRlbTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VhcmNoVGV4dCAmJiAhc2VsZi5vcHRpb25zLmNvbXBsZXhJdGVtcykge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5nZXQoMCkuaW5uZXJIVE1MID0gbGlzdEl0ZW1UZXh0KGl0ZW0sIHNlYXJjaFRleHQsICQoc2VsZi5saXN0KS53aWR0aCgpIDwgbGlzdEhlbHBlci53aWR0aCgpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5vbignbW91c2Vkb3duJywgaGFuZGxlSXRlbUNsaWNrKTtcbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5vbignbW91c2VvdmVyJywgaGFuZGxlSXRlbU1vdXNlT3Zlcik7XG5cbiAgICAgICAgICAgICAgICBsaXN0SGVscGVyLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtRWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RJdGVtVGV4dChpdGVtU3RyaW5nLCB0ZXh0LCBsb25nKSB7XG4gICAgICAgICAgICAgICAgdmFyIG91dHB1dFN0cmluZyA9IGl0ZW1TdHJpbmc7XG4gICAgICAgICAgICAgICAgaWYgKGxvbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdvcmRzID0gaXRlbVN0cmluZy5zcGxpdCgnICcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoSW5kZXggPSB3b3Jkcy5yZWR1Y2UoZnVuY3Rpb24oY3VycmVudEluZGV4LCB3b3JkLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN0cmluZyA9IHdvcmQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQpID4gLTEgJiYgY3VycmVudEluZGV4ID09PSAtMSA/IGluZGV4IDogY3VycmVudEluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgLTEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWFyY2hJbmRleCA+PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RyaW5nRW5kID0gd29yZHMuc2xpY2Uoc2VhcmNoSW5kZXgpLnJlZHVjZShmdW5jdGlvbihzdHIsIHdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyICsgJyAnICsgd29yZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlZyA9IC9cXC4kLztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3Jkc1swXS5tYXRjaChyZWcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3RyaW5nID0gd29yZHNbMF0gKyAnICcgKyB3b3Jkc1sxXSArICcgLi4uICcgKyBzdHJpbmdFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN0cmluZyA9IHdvcmRzWzBdICsgJyAuLi4gJyArIHN0cmluZ0VuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBzdGFydFRleHRJbmRleCA9IG91dHB1dFN0cmluZy50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGV4dC50b0xvd2VyQ2FzZSgpKSxcbiAgICAgICAgICAgICAgICAgICAgZW5kVGV4dEluZGV4ID0gc3RhcnRUZXh0SW5kZXggKyB0ZXh0Lmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBvdXRwdXRTdHJpbmcuc2xpY2UoMCwgc3RhcnRUZXh0SW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICBtaWRkbGUgPSBvdXRwdXRTdHJpbmcuc2xpY2Uoc3RhcnRUZXh0SW5kZXgsIGVuZFRleHRJbmRleCksXG4gICAgICAgICAgICAgICAgICAgIGVuZCA9IG91dHB1dFN0cmluZy5zbGljZShlbmRUZXh0SW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHN0YXJ0KSk7XG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZCgkKCc8c3Bhbj48L3NwYW4+JykuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1oaWdobGlnaHQnKS50ZXh0KG1pZGRsZSkuZ2V0KDApKTtcbiAgICAgICAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGVuZCkpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaW5uZXJIVE1MO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBkaXZpZGVyKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkKCc8bGk+PC9saT4nKS5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWRpdmlkZXInKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKHNlbGYubGlzdCk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMudW5zZWxlY3QgIT09IC0xICYmICFzZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0l0ZW0gPSBsaXN0SXRlbShzZWxmLm9wdGlvbnMudW5zZWxlY3QpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQgc2VsZWN0Ym94X19saXN0LXVuc2VsZWN0Jyk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LmFwcGVuZENoaWxkKG5ld0l0ZW0uZ2V0KDApKTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QuYXBwZW5kQ2hpbGQoZGl2aWRlcigpLmdldCgwKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdJdGVtID0gbGlzdEl0ZW0oaXRlbSwgc2VsZi5vcHRpb25zLml0ZW1zLmluZGV4T2YoaXRlbSkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDAgJiYgc2VsZi5saXN0LmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdJdGVtLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUl0ZW0gPT09IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3SXRlbS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LmFwcGVuZENoaWxkKG5ld0l0ZW0uZ2V0KDApKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgZmllbGRSZWN0ID0gc2VsZi5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgICAgICBmaWVsZE9mZnNldFRvcCA9IHNlbGYuZWwub2Zmc2V0VG9wLFxuICAgICAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgICAgICAgICBtZW51UmVjdCA9IHNlbGYubGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcblxuICAgICAgICAgICAgICAgIGhlaWdodENoZWNrID0gd2luZG93SGVpZ2h0IC0gZmllbGRSZWN0LnRvcCAtIGZpZWxkUmVjdC5oZWlnaHQgLSBtZW51UmVjdC5oZWlnaHQ7XG5cbiAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS50b3AgPSBoZWlnaHRDaGVjayA+IDAgPyBmaWVsZE9mZnNldFRvcCArIGZpZWxkUmVjdC5oZWlnaHQgKyA1ICsgJ3B4JyA6IGZpZWxkT2Zmc2V0VG9wIC0gbWVudVJlY3QuaGVpZ2h0IC0gMTAgKyAncHgnO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0SXRlbShpdGVtKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnVuc2VsZWN0ICYmIGl0ZW0uaW5uZXJIVE1MID09PSBzZWxmLm9wdGlvbnMudW5zZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFjdGl2ZUl0ZW0gPSAtMTtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGJveF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VsZWN0aW5nIGl0ZW1cIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5lbCk7XG4gICAgICAgICAgICAgICAgc2VsZi5hY3RpdmVJdGVtID0gaXRlbS5kYXRhc2V0LmluZGV4O1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5vblNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gaXRlbS5jaGlsZE5vZGVzWzBdLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBpdGVtLmRhdGFzZXQuaW5kZXg7XG4gICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLm9uU2VsZWN0KHRleHQsIGluZGV4LCBzZWxmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuaXRlbUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLml0ZW1DYWxsYmFjayhpdGVtLCBzZWxmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vU2VsZWN0IGNsaWNrXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNlbGVjdENsaWNrKGUpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuYWN0aXZlSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgdGhlcmUgaXMgYW55IHNlbGVjdGVkIGl0ZW0uIElmIG5vdCBzZXQgdGhlIHBsYWNlaG9sZGVyIHRleHRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuYWN0aXZlSXRlbSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gc2VsZi5wbGFjZWhvbGRlciB8fCAnU2VsZWN0JztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgc2VhcmNoIG9wdGlvbiBpcyBvbiBvciB0aGVyZSBpcyBtb3JlIHRoYW4gMTAgaXRlbXMuIElmIHllcywgYWRkIHNlYXJjZmllbGRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5zZWFyY2ggfHwgc2VsZi5vcHRpb25zLml0ZW1zLmxlbmd0aCA+IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2VsZi5zZWFyY2hGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fc2VhcmNoZmllbGQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnBsYWNlaG9sZGVyID0gc2VsZi5vcHRpb25zLnNlYXJjaFBsYWNlaG9sZGVyIHx8ICdTZWFyY2guLi4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBoYW5kbGVTZWFyY2hGaWVsZElucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBoYW5kbGVTZWFyY2hGaWVsZElucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuaW5wdXRGaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9zdGF0ZV9vcGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zLCBzZWxmLmFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZVNlbGVjdERvY0NsaWNrKTt9LCAxMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL1NlbGVjdCBpdGVtIGhhbmRsZXJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlSXRlbUNsaWNrKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBzZWxlY3RJdGVtKGUudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVJdGVtTW91c2VPdmVyKGUpIHtcbiAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTZWxlY3REb2NDbGljaygpIHtcbiAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9GdWx0ZXIgZnVuY3Rpb24gZm9yIHNlYXJjZmllbGRcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2VhcmNoRmllbGRJbnB1dChlKSB7XG4gICAgICAgICAgICB2YXIgZkl0ZW1zID0gc2VsZi5vcHRpb25zLml0ZW1zLmZpbHRlcihmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhlLnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY3JlYXRlTGlzdChmSXRlbXMsIHNlbGYuYWN0aXZlSXRlbSwgZS50YXJnZXQudmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVLZXlEb3duKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB2YXIgaW5kZXgsIGxlbmd0aDtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0SXRlbShzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJylbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDI3OlxuICAgICAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4IC0gMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCA8IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPiAwID8gJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpIC0gJChzZWxmLmxpc3QpLmhlaWdodCgpIDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmhlaWdodCgpIDwgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXgpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXgpLmhlaWdodCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL0NoZWNrIGlmIGZpZWxkIGlzIGVtcHR5IG9yIG5vdCBhbmQgY2hhbmdlIGNsYXNzIGFjY29yZGluZ2x5XG4gICAgICAgICQoc2VsZi5lbCkub24oJ2NsaWNrJywgaGFuZGxlU2VsZWN0Q2xpY2spO1xuICAgIH07XG5cbiAgICBTZWxlY3Rib3gucHJvdG90eXBlLl90b2dnbGVBZGRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMuZWwpLmhhc0NsYXNzKCdqcy1oYXNWYWx1ZScpKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5hZGRDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5yZW1vdmVDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBTZWxlY3Rib3gucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0Ym94X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSAtMTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaW5pdFNlbGVjdGJveGVzKCkge1xuICAgICAgICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1zZWxlY3Rib3gnKSkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbmV3IFNlbGVjdGJveChlbCwge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBlbC5kYXRhc2V0LmxhYmVsLFxuICAgICAgICAgICAgICAgIGhlbHBUZXh0OiBlbC5kYXRhc2V0LmhlbHBUZXh0LFxuICAgICAgICAgICAgICAgIGVyck1zZzogZWwuZGF0YXNldC5lcnJNc2csXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IGVsLmRhdGFzZXQucGxhY2Vob2xkZXIsXG4gICAgICAgICAgICAgICAgaXRlbXM6IEpTT04ucGFyc2UoZWwuZGF0YXNldC5pdGVtcyksXG4gICAgICAgICAgICAgICAgc2VhcmNoOiBlbC5kYXRhc2V0LnNlYXJjaCxcbiAgICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcjplbC5kYXRhc2V0LnNlYXJjaFBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBlbC5kYXRhc2V0LnJlcXVpcmVkLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkSXRlbTogZWwuZGF0YXNldC5zZWxlY3RlZEl0ZW0sXG4gICAgICAgICAgICAgICAgdW5zZWxlY3Q6IGVsLmRhdGFzZXQudW5zZWxlY3RcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0U2VsZWN0Ym94ZXMoKTtcblxuXG4vL30pKHdpbmRvdyk7XG5cbi8vVGFnZmllbGRzXG4vLzsoZnVuY3Rpb24od2luZG93KSB7XG4gICAgLy8ndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBUYWdmaWVsZChlbCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgICAgICB0aGlzLl9pbml0RXZlbnRzKCk7XG4gICAgfVxuXG4gICAgVGFnZmllbGQucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB0aGlzLml0ZW1zID0gdGhpcy5vcHRpb25zLmluaXRpYWxJdGVtcyB8fCBbXTtcblxuICAgICAgICB0aGlzLnRhZ2ZpZWxkV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLnRhZ2ZpZWxkV3JhcHBlci5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fd3JhcHBlcicpO1xuICAgICAgICB0aGlzLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMudGFnZmllbGRXcmFwcGVyLCB0aGlzLmVsKTtcbiAgICAgICAgdGhpcy50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnanMtdGFnZmllbGQnKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fZmllbGQnKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxhYmVsKSB7XG4gICAgICAgICAgICB0aGlzLmxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmxhYmVsO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuZm9yID0gdGhpcy5lbC5pZDtcbiAgICAgICAgICAgIHRoaXMudGFnZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGVscFRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmhlbHBUZXh0O1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9faGVscC10ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLnRhZ2ZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmhlbHBUZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVyck1zZykge1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5lcnJNc2c7XG4gICAgICAgICAgICB0aGlzLmVyck1zZy5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fZXJyLW1zZycpO1xuICAgICAgICAgICAgdGhpcy50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lcnJNc2cpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIHNlbGYuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLl9jcmVhdGVUYWcoaXRlbSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgVGFnZmllbGQucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAvL0Nsb3NlIGxpc3QgaGVscGVyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlTGlzdCgpIHtcbiAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgndGFnZmllbGRfc3RhdGVfb3BlbicpO1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYubGlzdCk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuc2VhcmNoRmllbGQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLnJlbW92ZUNoaWxkKHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuaGVscGVyRmllbGQgJiYgc2VsZi5oZWxwZXJGaWVsZC5wYXJlbnROb2RlID09PSBzZWxmLmVsKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5yZW1vdmVDaGlsZChzZWxmLmhlbHBlckZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZ2ZpZWxkX190YWcnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVUYWdmaWVsZERvY0NsaWNrKTtcbiAgICAgICAgICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgICAgICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vQ3JlYXRlIGxpc3QgaGVscGVyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUxpc3QoaXRlbXMsIGFjdGl2ZUl0ZW0sIHNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzZWxmLmxpc3QpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgc2VsZi5saXN0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fbGlzdCcpO1xuXG4gICAgICAgICAgICBzZWxmLmxpc3RIZWxwZXIgPSAkKCc8ZGl2PjwvZGl2PicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWl0ZW0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdwb3NpdGlvbicsICdhYnNvbHV0ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3otaW5kZXgnLCAnLTEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ292ZXJmbG93JywgJ3Zpc2libGUnKTtcblxuICAgICAgICAgICAgc2VsZi50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VsZi5saXN0SGVscGVyLmdldCgwKSk7XG5cbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19saXN0LWl0ZW0nKTtcbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5pbm5lckhUTUwgPSBpdGVtO1xuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmlkID0gJ2xpc3RJdGVtLScgKyBpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdEhlbHBlci50ZXh0KGl0ZW0pO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gbGlzdEl0ZW1UZXh0KGl0ZW1TdHJpbmcsIHRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdvcmRzID0gaXRlbVN0cmluZy5zcGxpdCgnICcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoSW5kZXggPSB3b3Jkcy5yZWR1Y2UoZnVuY3Rpb24oY3VycmVudEluZGV4LCB3b3JkLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3b3JkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0KSA+IC0xICYmIGN1cnJlbnRJbmRleCA9PT0gLTEgPyBpbmRleCA6IGN1cnJlbnRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIC0xKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VhcmNoSW5kZXggPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdHJpbmdFbmQgPSB3b3Jkcy5zbGljZShzZWFyY2hJbmRleCkucmVkdWNlKGZ1bmN0aW9uKHN0ciwgd29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHIgKyAnICcgKyB3b3JkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gL1xcLiQvO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRzWzBdLm1hdGNoKHJlZykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd29yZHNbMF0gKyAnICcgKyB3b3Jkc1sxXSArICcgLi4uICcgKyBzdHJpbmdFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3b3Jkc1swXSArICcgLi4uICcgKyBzdHJpbmdFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VhcmNoVGV4dCAmJiAkKHNlbGYuc2VsZWN0V3JhcHBlcikud2lkdGgoKSA8IHNlbGYubGlzdEhlbHBlci53aWR0aCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmlubmVySFRNTCA9IGxpc3RJdGVtVGV4dChpdGVtLCBzZWFyY2hUZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtID09PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVJdGVtQ2xpY2spO1xuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGhhbmRsZUl0ZW1Nb3VzZU92ZXIpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChpdGVtRWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2VsZi50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VsZi5saXN0KTtcblxuXG4gICAgICAgICAgICB2YXIgZmllbGRSZWN0ID0gc2VsZi5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgICAgICBmaWVsZE9mZnNldFRvcCA9IHNlbGYuZWwub2Zmc2V0VG9wLFxuICAgICAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgICAgICAgICBtZW51UmVjdCA9IHNlbGYubGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcblxuICAgICAgICAgICAgICAgIGhlaWdodENoZWNrID0gd2luZG93SGVpZ2h0IC0gZmllbGRSZWN0LnRvcCAtIGZpZWxkUmVjdC5oZWlnaHQgLSBtZW51UmVjdC5oZWlnaHQ7XG5cbiAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS50b3AgPSBoZWlnaHRDaGVjayA+IDAgPyBmaWVsZE9mZnNldFRvcCArIGZpZWxkUmVjdC5oZWlnaHQgKyA1ICsgJ3B4JyA6IGZpZWxkT2Zmc2V0VG9wIC0gbWVudVJlY3QuaGVpZ2h0IC0gMTAgKyAncHgnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9TZWxlY3QgY2xpY2tcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGFnZmllbGRDbGljayhlKSB7XG4gICAgICAgICAgICAvL2Uuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgLy9jbG9zZUxpc3QoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICAvL0NyZWF0ZSBTZWFyY2hmaWVsZFxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnNlYXJjaCB8fCBzZWxmLm9wdGlvbnMuaXRlbXMubGVuZ3RoID4gNyB8fCBzZWxmLm9wdGlvbnMuY3JlYXRlVGFncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmLnNlYXJjaEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC50eXBlID0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX3NlYXJjaGZpZWxkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5wbGFjZWhvbGRlciA9IHNlbGYub3B0aW9ucy5zZWFyY2hQbGFjZWhvbGRlciB8fCAnU2VhcmNoLi4uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaGFuZGxlU2VhcmNoRmllbGRJbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC52YWx1ZSA9ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWdmaWVsZF9fdGFnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBzZWxmLm9wdGlvbnMucGxhY2Vmb2xkZXIgfHwgJ1NlbGVjdCBmcm9tIHRoZSBsaXN0JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC50eXBlID0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5jbGFzc0xpc3QuYWRkKCdqcy1oZWxwZXJJbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuc3R5bGUuekluZGV4ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuaGVscGVyRmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9zdGF0ZV9vcGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zLCBzZWxmLmFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZVRhZ2ZpZWxkRG9jQ2xpY2spO30sIDEwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgLy9TZWxlY3QgaXRlbSBoYW5kbGVyXG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdFRhZyhlbCkge1xuICAgICAgICAgICAgaWYgKHNlbGYuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFnZmllbGRfX3RhZycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZ2ZpZWxkX19zZWFyY2hmaWVsZCcpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1oZWxwZXJJbnB1dCcpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuaGVscGVyRmllbGQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmIChzZWxmLnNlYXJjaEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5pbnNlcnRCZWZvcmUoc2VsZi5fY3JlYXRlVGFnKGVsLmlubmVySFRNTCksIHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuX2NyZWF0ZVRhZyhlbC5pbm5lckhUTUwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuaXRlbXMucHVzaChlbC5pbm5lckhUTUwpO1xuXG4gICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5zZWFyY2hGaWVsZCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgY3JlYXRlTGlzdChzZWxmLm9wdGlvbnMuaXRlbXMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLmhlbHBlckZpZWxkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBjcmVhdGVMaXN0KHNlbGYub3B0aW9ucy5pdGVtcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgICAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuaXRlbUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLml0ZW1DYWxsYmFjayhlbCwgc2VsZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlSXRlbUNsaWNrKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBzZWxlY3RUYWcoZS50YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUl0ZW1Nb3VzZU92ZXIoZSkge1xuICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVRhZ2ZpZWxkRG9jQ2xpY2soZSkge1xuICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL0Z1bHRlciBmdW5jdGlvbiBmb3Igc2VhcmNmaWVsZFxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTZWFyY2hGaWVsZElucHV0KGUpIHtcbiAgICAgICAgICAgIHZhciBmSXRlbXMgPSBzZWxmLm9wdGlvbnMuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjcmVhdGVMaXN0KGZJdGVtcywgc2VsZi5hY3RpdmVJdGVtLCBlLnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpKTtcblxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlLnNsaWNlKC0xKSA9PT0gJywnICYmIHNlbGYub3B0aW9ucy5jcmVhdGVUYWdzKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5pbnNlcnRCZWZvcmUoc2VsZi5fY3JlYXRlVGFnKGUudGFyZ2V0LnZhbHVlLnNsaWNlKDAsIC0xKSksIHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgZS50YXJnZXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICBlLnRhcmdldC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGNyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zKTtcbiAgICAgICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVLZXlEb3duKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB2YXIgaW5kZXgsIGxlbmd0aDtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0VGFnKHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnICYmIHNlbGYub3B0aW9ucy5jcmVhdGVUYWdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmluc2VydEJlZm9yZShzZWxmLl9jcmVhdGVUYWcoZS50YXJnZXQudmFsdWUpLCBzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUudGFyZ2V0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnRhcmdldC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTGlzdChzZWxmLm9wdGlvbnMuaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDI3OlxuICAgICAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4IC0gMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgPCA1MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA+IDAgPyAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPCAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vRGVsZXRlIHRhZyBoYW5kbGVcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlRGVsZXRlVGFnKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB2YXIgdGFnID0gZS50YXJnZXQucGFyZW50Tm9kZTtcblxuICAgICAgICAgICAgdGFnLnJlbW92ZUNoaWxkKGUudGFyZ2V0KTtcbiAgICAgICAgICAgIHZhciB0YWdUaXRsZSA9IHRhZy5pbm5lckhUTUwsXG4gICAgICAgICAgICAgICAgdGFnSW5kZXggPSBzZWxmLml0ZW1zLmluZGV4T2YodGFnVGl0bGUpO1xuICAgICAgICAgICAgaWYgKHRhZ0luZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gW10uY29uY2F0KHNlbGYuaXRlbXMuc2xpY2UoMCwgdGFnSW5kZXgpLCBzZWxmLml0ZW1zLnNsaWNlKHRhZ0luZGV4ICsgMSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmVsLnJlbW92ZUNoaWxkKHRhZyk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZ2ZpZWxkX190YWcnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmVsLmNsYXNzTGlzdC5jb250YWlucygndGFnZmllbGRfc3RhdGVfb3BlbicpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gc2VsZi5vcHRpb25zLnBsYWNlZm9sZGVyIHx8ICdTZWxlY3QgZnJvbSB0aGUgbGlzdCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuXG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vQ2hlY2sgaWYgZmllbGQgaXMgZW1wdHkgb3Igbm90IGFuZCBjaGFuZ2UgY2xhc3MgYWNjb3JkaW5nbHlcbiAgICAgICAgJCh0aGlzLnRhZ2ZpZWxkV3JhcHBlcikub24oJ2NsaWNrJywgJy50YWdmaWVsZF9fZmllbGQnLCBoYW5kbGVUYWdmaWVsZENsaWNrKTtcbiAgICAgICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuXG4gICAgfTtcblxuICAgIC8vQXV0b3Jlc2l6ZSB0ZXh0YXJlYVxuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5fYXV0b3NpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuZWwudmFsdWUgPT09ICcnKSB7dGhpcy5lbC5yb3dzID0gMTt9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCxcbiAgICAgICAgICAgICAgICBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpLFxuICAgICAgICAgICAgICAgIHRleHRXaWR0aCA9IHRoaXMuZWwudmFsdWUubGVuZ3RoICogNyxcbiAgICAgICAgICAgICAgICByb3cgPSBNYXRoLmNlaWwodGV4dFdpZHRoIC8gd2lkdGgpO1xuXG4gICAgICAgICAgICByb3cgPSByb3cgPD0gMCA/IDEgOiByb3c7XG4gICAgICAgICAgICByb3cgPSB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0ICYmIHJvdyA+IHRoaXMub3B0aW9ucy5tYXhIZWlnaHQgPyB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0IDogcm93O1xuXG4gICAgICAgICAgICB0aGlzLmVsLnJvd3MgPSByb3c7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy9DcmVhdGUgVGFnIEhlbHBlclxuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5fY3JlYXRlVGFnID0gZnVuY3Rpb24odGFnTmFtZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIGRlbFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgIHRhZy5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fdGFnJyk7XG4gICAgICAgIHRhZy5pbm5lckhUTUwgPSB0YWdOYW1lO1xuXG4gICAgICAgIGRlbFRhZy5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fdGFnLWRlbGV0ZScpO1xuICAgICAgICBkZWxUYWcuaW5uZXJIVE1MID0gJ+KclSc7XG4gICAgICAgIGRlbFRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBzZWxmLl9kZWxldGVUYWcoZS50YXJnZXQucGFyZW50Tm9kZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRhZy5hcHBlbmRDaGlsZChkZWxUYWcpO1xuXG4gICAgICAgIHJldHVybiB0YWc7XG4gICAgfTtcblxuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5fZGVsZXRlVGFnID0gZnVuY3Rpb24odGFnKSB7XG4gICAgICAgIHRoaXMuZWwucmVtb3ZlQ2hpbGQodGFnKTtcblxuICAgICAgICAkKHRhZykuZmluZCgnLnRhZ2ZpZWxkX190YWctZGVsZXRlJykucmVtb3ZlKCk7XG4gICAgICAgIHZhciB0YWdUaXRsZSA9IHRhZy5pbm5lckhUTUwsXG4gICAgICAgICAgICB0YWdJbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZih0YWdUaXRsZSk7XG4gICAgICAgIGlmICh0YWdJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zID0gW10uY29uY2F0KHRoaXMuaXRlbXMuc2xpY2UoMCwgdGFnSW5kZXgpLCB0aGlzLml0ZW1zLnNsaWNlKHRhZ0luZGV4ICsgMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFnZmllbGRfX3RhZycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmVsLmNsYXNzTGlzdC5jb250YWlucygndGFnZmllbGRfc3RhdGVfb3BlbicpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSBzZWxmLm9wdGlvbnMucGxhY2Vmb2xkZXIgfHwgJ1NlbGVjdCBmcm9tIHRoZSBsaXN0JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90b2dnbGVBZGRhYmxlKCk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWxldGVUYWdDYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRlbGV0ZVRhZ0NhbGxiYWNrKHRhZywgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5fdG9nZ2xlQWRkYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzLmVsKS5oYXNDbGFzcygnanMtaGFzVmFsdWUnKSkge1xuICAgICAgICAgICAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykuYWRkQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgVGFnZmllbGQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICAgICAgJCh0aGlzLmVsKS5maW5kKCcudGFnZmllbGRfX3RhZycpLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICB0aGlzLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRUYWdmaWVsZHMoKSB7XG4gICAgICAgIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXRhZ2ZpZWxkJykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIG5ldyBUYWdmaWVsZChlbCwge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBlbC5kYXRhc2V0LmxhYmVsLFxuICAgICAgICAgICAgICAgIGhlbHBUZXh0OiBlbC5kYXRhc2V0LmhlbHBUZXh0LFxuICAgICAgICAgICAgICAgIGVyck1zZzogZWwuZGF0YXNldC5lcnJNc2csXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IGVsLmRhdGFzZXQucGxhY2Vob2xkZXIsXG4gICAgICAgICAgICAgICAgaXRlbXM6IEpTT04ucGFyc2UoZWwuZGF0YXNldC5pdGVtcyksXG4gICAgICAgICAgICAgICAgc2VhcmNoOiBlbC5kYXRhc2V0LnNlYXJjaCxcbiAgICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcjogZWwuZGF0YXNldC5zZWFyY2hQbGFjZWhvbGRlcixcbiAgICAgICAgICAgICAgICBjcmVhdGVUYWdzOiBlbC5kYXRhc2V0LmNyZWF0ZU5ld1RhZyxcbiAgICAgICAgICAgICAgICBpbml0aWFsSXRlbXM6IGVsLmRhdGFzZXQuc2VsZWN0ZWRJdGVtcyA/IEpTT04ucGFyc2UoZWwuZGF0YXNldC5zZWxlY3RlZEl0ZW1zKSA6ICcnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdFRhZ2ZpZWxkcygpO1xuXG5cbi8vfSkod2luZG93KTtcblxuLy9Ecm9wZG93blxuZnVuY3Rpb24gRHJvcGRvd24oZWwsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMuX2luaXQoKTtcbiAgICB0aGlzLl9pbml0RXZlbnRzKCk7XG59XG5cbkRyb3Bkb3duLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZHJvcGRvd25XcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5kcm9wZG93bldyYXBwZXIuY2xhc3NMaXN0LmFkZCgnanMtZHJvcGRvd25XcmFwcGVyJyk7XG4gICAgdGhpcy5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmRyb3Bkb3duV3JhcHBlciwgdGhpcy5lbCk7XG4gICAgdGhpcy5kcm9wZG93bldyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdqcy1kcm9wZG93bicpO1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnanMtZHJvcGRvd25JdGVtJyk7XG59O1xuXG5Ecm9wZG93bi5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvL0Nsb3NlIGxpc3QgaGVscGVyXG4gICAgZnVuY3Rpb24gY2xvc2VMaXN0KCkge1xuICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLW9wZW4nKTtcbiAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgc2VsZi5kcm9wZG93bldyYXBwZXIucmVtb3ZlQ2hpbGQoc2VsZi5saXN0KTtcbiAgICAgICAgICAgIHNlbGYubGlzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVPdXRzaWRlQ2xpY2spO1xuICAgIH1cbiAgICAvL0hhbmRsZSBvdXRzaWRlIGRyb3Bkb3duIGNsaWNrXG4gICAgZnVuY3Rpb24gaGFuZGxlT3V0c2lkZUNsaWNrKGUpIHtcbiAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgfVxuXG4gICAgLy9IYW5kbGUgZHJvcGRvd24gY2xpY2tcbiAgICBmdW5jdGlvbiBoYW5kbGVEcm9wZG93bkNsaWNrKGUpIHtcblxuICAgICAgICAvL2Uuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChzZWxmLmVsLmNsYXNzTGlzdC5jb250YWlucygnaXMtb3BlbicpKSB7Y2xvc2VMaXN0KCk7fVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuaXRlbXMpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ2lzLW9wZW4nKTtcblxuICAgICAgICAgICAgICAgIHNlbGYubGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LmNsYXNzTGlzdC5hZGQoJ2MtRHJvcGRvd24tbGlzdCcpO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5kaXZpZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkcm9wZG93bl9fZGl2aWRlcicpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZHJvcGRvd25fX2xpc3QtaXRlbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuaW5uZXJIVE1MID0gaXRlbS5pbm5lckhUTUwgfHwgaXRlbS50ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jYWxsYmFjayhlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ud2FybmluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLndhcm5pbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoYXMtd2FybmluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3QuYXBwZW5kQ2hpbGQoaXRlbUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5kcm9wZG93bldyYXBwZXIuYXBwZW5kQ2hpbGQoc2VsZi5saXN0KTtcblxuICAgICAgICAgICAgICAgIHZhciBsaXN0UmVjdCA9IHNlbGYubGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgIGlmIChsaXN0UmVjdC5sZWZ0ICsgbGlzdFJlY3Qud2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUucmlnaHQgPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS5sZWZ0ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RSZWN0LnRvcCArIGxpc3RSZWN0LmhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUuYm90dG9tID0gJzEwMCUnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS50b3AgPSAnMTAwJSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlT3V0c2lkZUNsaWNrKTt9LCAxMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VsZi5lbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZURyb3Bkb3duQ2xpY2spO1xufTtcblxuLy9BZGRhYmxlIEZpZWxkc1xuLy87KGZ1bmN0aW9uKHdpbmRvdykge1xuICAgIC8vJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gQWRkYWJsZShlbCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge3NvcnRhYmxlOiB0cnVlfTtcblxuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgfVxuXG4gICAgQWRkYWJsZS5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdqcy1hZGRhYmxlV3JhcHBlcicpO1xuICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLmluc2VydEJlZm9yZShzZWxmLmVsKTtcblxuICAgICAgICBzZWxmLmVsLnJlbW92ZUNsYXNzKCdqcy1hZGRhYmxlJyk7XG4gICAgICAgIHNlbGYuZWwuYWRkQ2xhc3MoJ2pzLWFkZGFibGVJdGVtIGMtQWRkYWJsZS1pdGVtJyk7XG5cbiAgICAgICAgc2VsZi5hZGRhYmxlUm93ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtYWRkYWJsZVJvdyBjLUFkZGFibGUtcm93Jyk7XG5cbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5zb3J0YWJsZSkge1xuICAgICAgICAgICAgc2VsZi5hZGRhYmxlUm93RHJhZ0hhbmRsZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjLUFkZGFibGUtcm93LWRyYWdIYW5kbGVyJyk7XG4gICAgICAgICAgICBzZWxmLmFkZGFibGVSb3cuYXBwZW5kKHNlbGYuYWRkYWJsZVJvd0RyYWdIYW5kbGVyKTtcblxuICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5zb3J0YWJsZSh7XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHNlbGYub3B0aW9ucyA/IHNlbGYub3B0aW9ucy5wbGFjZWhvbGRlciB8fCAnYy1BZGRhYmxlLXJvd1BsYWNlaG9sZGVyJyA6ICdjLUFkZGFibGUtcm93UGxhY2Vob2xkZXInLFxuICAgICAgICAgICAgICAgIHN0YXJ0OiBmdW5jdGlvbihlLCB1aSkge1xuICAgICAgICAgICAgICAgICAgICB1aS5pdGVtLmFkZENsYXNzKCdpcy1kcmFnZ2luZycpO1xuICAgICAgICAgICAgICAgICAgICAkKGUudGFyZ2V0KS5jc3MoJ2hlaWdodCcsICQoZS50YXJnZXQpLmhlaWdodCgpKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmNzcygnaGVpZ2h0JywgJCgnYm9keScpLmhlaWdodCgpKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uKGUsIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVpLml0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLWRyYWdnaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICQoZS50YXJnZXQpLmNzcygnaGVpZ2h0JywgJycpO1xuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuY3NzKCdoZWlnaHQnLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmFkZEJ1dHRvbiA9ICQoJzxidXR0b24+PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbi0tcm91bmQgYnV0dG9uX3N0eWxlX291dGxpbmUtZ3JheSBidXR0b24tLWFkZCBjLUFkZGFibGUtcm93LWFkZEJ1dHRvbicpLmNsaWNrKGhhbmRsZUFkZFJvdyk7XG5cbiAgICAgICAgc2VsZi5yZW1vdmVCdXR0b24gPSAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24tLXJvdW5kIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXkgYnV0dG9uLS1yZW1vdmUganMtYWRkYWJsZVJlbW92ZUJ1dHRvbicpLmNsaWNrKGhhbmRsZVJlbW92ZVJvdyk7XG5cbiAgICAgICAgc2VsZi5hZGRhYmxlUm93LmFwcGVuZChzZWxmLmVsLmNsb25lKHRydWUsIHRydWUpLCB0aGlzLnJlbW92ZUJ1dHRvbiwgdGhpcy5hZGRCdXR0b24pO1xuICAgICAgICBzZWxmLm9yaWdpbmFsRWwgPSBzZWxmLmVsLmNsb25lKHRydWUsIHRydWUpO1xuICAgICAgICBzZWxmLmVsLmRldGFjaCgpO1xuXG4gICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuYXBwZW5kKHRoaXMuYWRkYWJsZVJvdy5jbG9uZSh0cnVlLCB0cnVlKSk7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlQWRkUm93KGUpIHtcbiAgICAgICAgICAgIC8vQ2hlY2sgaWYgdGhlcmUgYXJlIG1vcmUgdGhhbiAxIGNoaWxkIGFuZCBjaGFuZ2UgY2xhc3NcbiAgICAgICAgICAgIGlmIChzZWxmLmFkZGFibGVXcmFwcGVyLmNoaWxkcmVuKCkubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuYWRkQ2xhc3MoJ2hhcy1tdWx0aXBsZVJvd3MnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5yZW1vdmVDbGFzcygnaGFzLW11bHRpcGxlUm93cycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9zZWxmLmFkZGFibGVXcmFwcGVyLmFwcGVuZChzZWxmLmFkZGFibGVSb3cuY2xvbmUodHJ1ZSwgdHJ1ZSkpO1xuICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSBzZWxmLl9hZGRJdGVtKHNlbGYub3JpZ2luYWxFbC5jbG9uZSh0cnVlLCB0cnVlKSwgc2VsZi5vcHRpb25zPyBzZWxmLm9wdGlvbnMuYmVmb3JlQWRkIDogbnVsbCk7XG5cbiAgICAgICAgICAgIC8vSW5pdGlhbGlzZSBSZWFjdCBjb21wb25lbnRzIG9uIHRoZSBuZXcgcm93LCBpZiB0aGVyZSBhcmUgYW55XG4gICAgICAgICAgICB3aW5kb3cubW91bnRDb21wb25lbnRzKHdyYXBwZXJbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVJlbW92ZVJvdyhlKSB7XG4gICAgICAgIFx0JChlLnRhcmdldCkucGFyZW50cygnLmpzLWFkZGFibGVSb3cnKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgc3dpdGNoIChzZWxmLmFkZGFibGVXcmFwcGVyLmNoaWxkcmVuKCcuanMtYWRkYWJsZVJvdycpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fYWRkSXRlbShzZWxmLm9yaWdpbmFsRWwuY2xvbmUodHJ1ZSwgdHJ1ZSksIHNlbGYub3B0aW9ucz8gc2VsZi5vcHRpb25zLmJlZm9yZUFkZCA6IG51bGwpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLnJlbW92ZUNsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5yZW1vdmVDbGFzcygnaGFzLW11bHRpcGxlUm93cycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5fYWRkSXRlbSA9IGZ1bmN0aW9uKGVsLCBiZWZvcmVBZGQpIHtcbiAgICAgICAgICAgIGlmIChiZWZvcmVBZGQpIHtcbiAgICAgICAgICAgICAgICBiZWZvcmVBZGQoZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGFkZGFibGVSb3cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdqcy1hZGRhYmxlUm93IGMtQWRkYWJsZS1yb3cnKSxcbiAgICAgICAgICAgICAgICBhZGRCdXR0b24gPSAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24tLXJvdW5kIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXkgYnV0dG9uLS1hZGQgYy1BZGRhYmxlLXJvdy1hZGRCdXR0b24nKS5jbGljayhoYW5kbGVBZGRSb3cpLFxuICAgICAgICAgICAgICAgIHJlbW92ZUJ1dHRvbiA9ICQoJzxidXR0b24+PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbi0tcm91bmQgYnV0dG9uX3N0eWxlX291dGxpbmUtZ3JheSBidXR0b24tLXJlbW92ZSBqcy1hZGRhYmxlUmVtb3ZlQnV0dG9uJykuY2xpY2soaGFuZGxlUmVtb3ZlUm93KTtcblxuICAgICAgICAgICAgZWwuYWRkQ2xhc3MoJ2pzLWFkZGFibGVJdGVtIGMtQWRkYWJsZS1pdGVtJyk7XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnNvcnRhYmxlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFkZGFibGVSb3dEcmFnSGFuZGxlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2MtQWRkYWJsZS1yb3ctZHJhZ0hhbmRsZXInKTtcbiAgICAgICAgICAgICAgICBhZGRhYmxlUm93LmFwcGVuZChhZGRhYmxlUm93RHJhZ0hhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkYWJsZVJvdy5hcHBlbmQoZWwsIHJlbW92ZUJ1dHRvbiwgYWRkQnV0dG9uKTtcbiAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuYXBwZW5kKGFkZGFibGVSb3cpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5hZGRhYmxlV3JhcHBlci5jaGlsZHJlbigpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLmFkZENsYXNzKCdoYXMtbXVsdGlwbGVSb3dzJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ2hhcy1tdWx0aXBsZVJvd3MnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuYWZ0ZXJBZGQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLm9wdGlvbnMuYWZ0ZXJBZGQoZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0F1dG8gc2Nyb2xsIHBhZ2Ugd2hlbiBhZGRpbmcgcm93IGJlbG93IHNjcmVlbiBib3R0b20gZWRnZVxuICAgICAgICAgICAgdmFyIHJvd0JvdHRvbUVuZCA9IGFkZGFibGVSb3cuZ2V0KDApLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGFkZGFibGVSb3cuaGVpZ2h0KCk7XG4gICAgICAgICAgICBpZiAocm93Qm90dG9tRW5kICsgNjAgPiAkKHdpbmRvdykuaGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICAgICAkKCdib2R5JykuYW5pbWF0ZSggeyBzY3JvbGxUb3A6ICcrPScgKyBNYXRoLnJvdW5kKHJvd0JvdHRvbUVuZCArIDYwIC0gJCh3aW5kb3cpLmhlaWdodCgpKS50b1N0cmluZygpIH0sIDQwMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzZWxmLmFkZGFibGVXcmFwcGVyO1xuICAgICAgICB9O1xuICAgICAgICBzZWxmLnJlbW92ZUl0ZW0gPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5jaGlsZHJlbigpLnNsaWNlKGluZGV4LCBpbmRleCsxKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIGlmIChzZWxmLmFkZGFibGVXcmFwcGVyLmNoaWxkcmVuKCcuanMtYWRkYWJsZVJvdycpLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgIFx0XHRzZWxmLmFkZGFibGVXcmFwcGVyLnJlbW92ZUNsYXNzKCdoYXMtbXVsdGlwbGVSb3dzJyk7XG4gICAgICAgIFx0fVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBpbml0QWRkYWJsZUZpZWxkcygpIHtcbiAgICAgICAgW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtYWRkYWJsZScpKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBuZXcgQWRkYWJsZSgkKGVsKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4vL30pKHdpbmRvdyk7XG5cbi8vSW1hZ2UgUGxhY2Vob2xkZXJzXG4vL1RoaXMgY2xhc3MgY3JlYXRlcyBhIHBhbGNlaG9sZGVyIGZvciBpbWFnZSBmaWxlcy4gSXQgaGFuZGxlIGJvdGggY2xpY2sgdG8gbG9hZCBhbmQgYWxzbyBzZWxlY3QgZnJvbSBhc3NldCBsaWJyYXJ5IGFjdGlvbi5cblxuZnVuY3Rpb24gSW1hZ2VQbGFjZWhvbGRlcihlbCwgZmlsZSwgb3B0aW9ucykge1xuICB0aGlzLmVsID0gZWw7XG4gIHRoaXMuZmlsZSA9IGZpbGU7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdGhpcy5faW5pdCgpO1xuICB0aGlzLl9pbml0RXZlbnRzKCk7XG59XG5cbkltYWdlUGxhY2Vob2xkZXIucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMub3B0aW9ucy5uYW1lID0gdGhpcy5vcHRpb25zLm5hbWUgfHwgdGhpcy5lbC5kYXRhc2V0Lm5hbWU7XG4gIHRoaXMub3B0aW9ucy5pZCA9IHRoaXMuZWwuaWQgKyAnLXBsYWNlaG9sZGVyJztcblxuICAvL1dyYXBwIHBsYWNlaG9sZGVyXG4gIHRoaXMud3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYy1JbWFnZVBsYWNlaG9sZGVyJyk7XG4gIGlmICghdGhpcy5maWxlKSB7dGhpcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2lzLWVtcHR5Jyk7fVxuICB0aGlzLndyYXBwZXIuaWQgPSB0aGlzLm9wdGlvbnMuaWQ7XG5cbiAgLy9QbGFjZWhvbGRlciBJbWFnZVxuICB0aGlzLmltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRoaXMuaW1hZ2UuY2xhc3NMaXN0LmFkZCgnYy1JbWFnZVBsYWNlaG9sZGVyLWltZycpO1xuICBpZiAodGhpcy5maWxlKSB7dGhpcy5pbWFnZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSB0aGlzLmZpbGUuZmlsZURhdGEudXJsO31cbiAgdGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuaW1hZ2UpO1xuXG4gIC8vUGxhY2Vob2xkZXIgY29udHJvbHNcbiAgdGhpcy5jb250cm9scyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scycpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc1VwbG9hZCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1idXR0b24nKS5nZXQoMCk7XG4gIHRoaXMuY29udHJvbHNVcGxvYWRJY29uID0gJCgnPGkgY2xhc3M9XCJmYSBmYS11cGxvYWRcIj48L2k+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1idXR0b24taWNvbicpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc1VwbG9hZFRleHQgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMtYnV0dG9uLXRleHQnKS50ZXh0KCdVcGxvYWQgZnJvbSB5b3VyIGNvbXB1dGVyJykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzVXBsb2FkLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNVcGxvYWRJY29uKTtcbiAgdGhpcy5jb250cm9sc1VwbG9hZC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzVXBsb2FkVGV4dCk7XG5cbiAgdGhpcy5jb250cm9sc0RpdmlkZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMtZGl2aWRlcicpLmdldCgwKTtcblxuICB0aGlzLmNvbnRyb2xzTGlicmFyeSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1idXR0b24nKS5nZXQoMCk7XG4gIHRoaXMuY29udHJvbHNMaWJyYXJ5SWNvbiA9ICQoJzxpIGNsYXNzPVwiZmEgZmEtZm9sZGVyLW9wZW5cIj48L2k+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1idXR0b24taWNvbicpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc0xpYnJhcnlUZXh0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbi10ZXh0JykudGV4dCgnQWRkIGZyb20gYXNzZXQgbGlicmFyeScpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc0xpYnJhcnkuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc0xpYnJhcnlJY29uKTtcbiAgdGhpcy5jb250cm9sc0xpYnJhcnkuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc0xpYnJhcnlUZXh0KTtcblxuICB0aGlzLmNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNVcGxvYWQpO1xuICB0aGlzLmNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNEaXZpZGVyKTtcbiAgdGhpcy5jb250cm9scy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzTGlicmFyeSk7XG4gIHRoaXMuaW1hZ2UuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9scyk7XG5cbiAgLy9DbGVhciBidXR0b25cbiAgdGhpcy5kZWxldGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy5kZWxldGUuY2xhc3NMaXN0LmFkZCgnYy1JbWFnZVBsYWNlaG9sZGVyLWRlbGV0ZScpO1xuICB0aGlzLmltYWdlLmFwcGVuZENoaWxkKHRoaXMuZGVsZXRlKTtcblxuICAvL0VkaXQgYnV0dG9uXG4gIHRoaXMuZWRpdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICB0aGlzLmVkaXQuY2xhc3NMaXN0LmFkZCgnYnV0dG9uJywgJ2J1dHRvbl9zdHlsZV9vdXRsaW5lLXdoaXRlJywgJ2MtSW1hZ2VQbGFjZWhvbGRlci1lZGl0Jyk7XG4gIHRoaXMuZWRpdC5pbm5lckhUTUwgPSAnRWRpdCc7XG4gIHRoaXMuaW1hZ2UuYXBwZW5kQ2hpbGQodGhpcy5lZGl0KTtcblxuICAvL0ZpbGUgbmFtZVxuICB0aGlzLmZpbGVOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRoaXMuZmlsZU5hbWUuY2xhc3NMaXN0LmFkZCgnYy1JbWFnZVBsYWNlaG9sZGVyLWZpbGVOYW1lJyk7XG4gIHRoaXMuZmlsZU5hbWUuaW5uZXJIVE1MID0gdGhpcy5maWxlID8gdGhpcy5maWxlLmZpbGVEYXRhLnRpdGxlIDogJyc7XG4gIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmZpbGVOYW1lKTtcblxuICAvL1BsYWNlaG9sZGVyIFRpdGxlXG4gIGlmICh0aGlzLm9wdGlvbnMubmFtZSkge1xuICAgIHRoaXMudGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLnRpdGxlLmNsYXNzTGlzdC5hZGQoJ2MtSW1hZ2VQbGFjZWhvbGRlci10aXRsZScpO1xuICAgIHRoaXMudGl0bGUuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLm5hbWU7XG4gICAgdGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMudGl0bGUpO1xuICB9XG5cbiAgLy9GaWxlaW5wdXQgdG8gaGFuZGxlIGNsaWNrIHRvIHVwbG9hZCBpbWFnZVxuICB0aGlzLmZpbGVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgdGhpcy5maWxlSW5wdXQudHlwZSA9IFwiZmlsZVwiO1xuICB0aGlzLmZpbGVJbnB1dC5tdWx0aXBsZSA9IGZhbHNlO1xuICB0aGlzLmZpbGVJbnB1dC5oaWRkZW4gPSB0cnVlO1xuICB0aGlzLmZpbGVJbnB1dC5hY2NlcHQgPSBcImltYWdlLyosIHZpZGVvLypcIjtcblxuICB0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5maWxlSW5wdXQpO1xuXG4gIHRoaXMuZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy53cmFwcGVyLCB0aGlzLmVsKTtcbiAgdGhpcy5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZWwpO1xuXG59O1xuXG52YXIgc2Nyb2xsUG9zaXRpb24sIHNpbmdsZXNlbGVjdDtcblxuSW1hZ2VQbGFjZWhvbGRlci5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGZ1bmN0aW9uIGNsZWFyKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHNlbGYuZmlsZSA9IHVuZGVmaW5lZDtcbiAgICBzZWxmLl91cGRhdGUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW5MaWJyYXJ5KCkge1xuICAgIHNjcm9sbFBvc2l0aW9uID0gJCgnYm9keScpLnNjcm9sbFRvcCgpO1xuICAgIHVwZGF0ZUFzc2V0TGlicmFyeSgpO1xuICAgICQoJyNhbCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAkKCcjYWwnKS5hZGRDbGFzcygnbW9kYWwnKTtcbiAgICAkKCcjd3JhcHBlcicpLmFkZENsYXNzKCdvdmVyZmxvdycpO1xuICAgIHNpbmdsZXNlbGVjdCA9IHRydWU7XG5cbiAgICAkKCcjYWRkRnJvbUFMQnV0dG9uJykudGV4dChzZWxmLm9wdGlvbnMuYWxCdXR0b24gfHwgJ1NldCBDb3ZlcicpO1xuXG4gICAgJCgnI2FkZEZyb21BTEJ1dHRvbicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICBsYXN0U2VsZWN0ZWQgPSBudWxsO1xuICAgICAgc2V0U2VsZWN0ZWRGaWxlKCk7XG4gICAgICBjbG9zZUFzc2V0TGlicmFyeSgpO1xuICAgICAgc2luZ2xlc2VsZWN0ID0gZmFsc2U7XG4gICAgICAkKCdib2R5Jykuc2Nyb2xsVG9wKHNjcm9sbFBvc2l0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlQXNzZXRMaWJyYXJ5KCkge1xuICAgIGxhc3RTZWxlY3RlZCA9IG51bGw7XG4gICAgJCgnLmFsIC5maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICBkZXNlbGVjdEFsbCgpO1xuICAgICQoJy5tb2RhbCcpLmFkZENsYXNzKCdoaWRkZW4nKS5yZW1vdmVDbGFzcygnbW9kYWwnKTtcbiAgICAkKCcjd3JhcHBlcicpLnJlbW92ZUNsYXNzKCdvdmVyZmxvdycpO1xuICAgICQoJyNhZGRGcm9tQUxCdXR0b24nKS51bmJpbmQoJ2NsaWNrJyk7XG4gICAgJCgnYm9keScpLnNjcm9sbFRvcChzY3JvbGxQb3NpdGlvbik7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVzY0tleWRvd24pO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFbnRlcktleWRvd24pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U2VsZWN0ZWRGaWxlKCkge1xuICAgIHZhciBzZWxlY3RlZEZpbGUgPSAkKCcuYWwgLmZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZS5zZWxlY3RlZCcpLFxuICAgIGZpbGVJZCA9ICQoc2VsZWN0ZWRGaWxlKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCksXG4gICAgZmlsZSA9IGFzc2V0TGlicmFyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcbiAgICAgIHJldHVybiBmLmlkID09PSBmaWxlSWQ7XG4gICAgfSlbMF07XG5cbiAgICBzZWxmLmZpbGUgPSB7XG4gICAgICBmaWxlRGF0YTogZmlsZVxuICAgIH07XG4gICAgc2VsZi5fdXBkYXRlKCk7XG4gIH1cblxuXG4gIHNlbGYuZmlsZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcbiAgICBmaWxlVG9PYmplY3QoZS50YXJnZXQuZmlsZXNbMF0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICBzZWxmLmZpbGUgPSB7XG4gICAgICAgIGZpbGVEYXRhOiByZXMsXG4gICAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgcG9zaXRpb246IDEwMDAsXG4gICAgICAgIGNhcHRpb246ICcnLFxuICAgICAgICBnYWxsZXJ5Q2FwdGlvbjogZmFsc2UsXG4gICAgICAgIGp1c3RVcGxvYWRlZDogdHJ1ZVxuICAgICAgfTtcbiAgICAgIHNlbGYuX3VwZGF0ZSgpO1xuICAgIH0pO1xuICB9KTtcblxuICBzZWxmLmNvbnRyb2xzVXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGlmICghc2VsZi5maWxlKSB7XG4gICAgICBzZWxmLmZpbGVJbnB1dC5jbGljaygpO1xuICAgIH1cbiAgfSk7XG4gIHNlbGYuZGVsZXRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xlYXIpO1xuICBzZWxmLmVkaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgZWRpdEZpbGVzKFtzZWxmLmZpbGVdKTtcbiAgfSk7XG5cbiAgc2VsZi5jb250cm9sc0xpYnJhcnkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuTGlicmFyeSk7XG59O1xuSW1hZ2VQbGFjZWhvbGRlci5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5maWxlKSB7XG4gICAgdGhpcy53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWVtcHR5Jyk7XG4gICAgdGhpcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgdGhpcy5pbWFnZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKCcgKyB0aGlzLmZpbGUuZmlsZURhdGEudXJsICsgJyknO1xuICAgIHRoaXMuZmlsZU5hbWUuaW5uZXJIVE1MID0gdGhpcy5maWxlLmZpbGVEYXRhLnRpdGxlO1xuICAgIHRoaXMudHlwZSA9IHRoaXMuZmlsZS5maWxlRGF0YS50eXBlO1xuICB9XG4gIGVsc2Uge1xuICAgIHRoaXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpcy1lbXB0eScpO1xuICAgIHRoaXMud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdqcy1oYXNWYWx1ZScpO1xuICAgIHRoaXMuaW1hZ2Uuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ25vbmUnO1xuICAgIHRoaXMuZmlsZU5hbWUuaW5uZXJIVE1MID0gJyc7XG4gICAgdGhpcy50eXBlID0gdW5kZWZpbmVkO1xuICB9XG4gIGlmICh0aGlzLm9wdGlvbnMub25VcGRhdGUpIHtcbiAgICB0aGlzLm9wdGlvbnMub25VcGRhdGUodGhpcyk7XG4gIH1cbn07XG5cbkltYWdlUGxhY2Vob2xkZXIucHJvdG90eXBlLnNldEltYWdlID0gZnVuY3Rpb24oZmlsZSkge1xuICB0aGlzLmZpbGUgPSBmaWxlO1xuICB0aGlzLl91cGRhdGUoKTtcbn07XG5cbmZ1bmN0aW9uIGluaXRJbWFnZVBsYWNlaG9sZGVycygpIHtcbiAgdmFyIGltYWdlUGxhY2Vob2xkZXJzID0gW107XG4gIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWltYWdlUGxhY2Vob2xkZXInKSkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgIGltYWdlUGxhY2Vob2xkZXJzLnB1c2gobmV3IEltYWdlUGxhY2Vob2xkZXIoZWwpKTtcbiAgfSk7XG4gIHJldHVybiBpbWFnZVBsYWNlaG9sZGVycztcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gSW1hZ2VQbGFjZWhvbGRlcjtcbn1cblxuLy9Db21wbGV4U2VsZWN0XG4vLzsoZnVuY3Rpb24od2luZG93KSB7XG4gICAgLy8ndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBDb21wbGV4U2VsZWN0Ym94KGVsLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuXG4gICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICAgICAgdGhpcy5faW5pdEV2ZW50cygpO1xuICAgIH1cblxuICAgIENvbXBsZXhTZWxlY3Rib3gucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuY3VzdG9tVmFsdWUgPSBcIlwiO1xuICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSB0aGlzLm9wdGlvbnMuaXRlbXMuaW5kZXhPZih0aGlzLm9wdGlvbnMuc2VsZWN0ZWRJdGVtKTtcbiAgICAgICAgdGhpcy5vcHRpb25zLnVuc2VsZWN0ID0gdGhpcy5vcHRpb25zLnVuc2VsZWN0ID09PSB0cnVlID8gJ+KAlCBOb25lIOKAlCcgOiB0aGlzLm9wdGlvbnMudW5zZWxlY3Q7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5jbGFzc0xpc3QuYWRkKCdzZWxlY3RfX3dyYXBwZXInKTtcbiAgICAgICAgdGhpcy5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLnNlbGVjdFdyYXBwZXIsIHRoaXMuZWwpO1xuICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnanMtc2VsZWN0Ym94Jyk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19maWVsZCcsICdzZWxlY3Rib3hfX2ZpZWxkLS1jb21wbGV4Jyk7XG5cblxuICAgICAgICBpZiAodGhpcy5hY3RpdmVJdGVtID49IDApIHtcbiAgICAgICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuaXRlbXNbdGhpcy5hY3RpdmVJdGVtXTtcbiAgICAgICAgICAgIHRoaXMuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubGFiZWwpIHtcbiAgICAgICAgICAgIHRoaXMubGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMubGFiZWw7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuZm9yID0gdGhpcy5lbC5pZDtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmhlbHBUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0LmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5oZWxwVGV4dDtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19oZWxwLXRleHQnKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmhlbHBUZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVyck1zZykge1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5lcnJNc2c7XG4gICAgICAgICAgICB0aGlzLmVyck1zZy5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2Vyci1tc2cnKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVyck1zZyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQ29tcGxleFNlbGVjdGJveC5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8vQ2xvc2UgbGlzdCBoZWxwZXJcbiAgICAgICAgZnVuY3Rpb24gY2xvc2VMaXN0KCkge1xuICAgICAgICAgICAgdmFyIGlucHV0VmFsdWU7XG4gICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGJveF9zdGF0ZV9vcGVuJyk7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RXcmFwcGVyLnJlbW92ZUNoaWxkKHNlbGYubGlzdCk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuc2VhcmNoRmllbGQgJiYgc2VsZi5zZWFyY2hGaWVsZC5wYXJlbnROb2RlID09PSBzZWxmLmVsKSB7XG4gICAgICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IHNlbGYuc2VhcmNoRmllbGQudmFsdWU7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5yZW1vdmVDaGlsZChzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLmlucHV0RmllbGQgJiYgc2VsZi5pbnB1dEZpZWxkLnBhcmVudE5vZGUgPT09IHNlbGYuZWwpIHtcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlID0gc2VsZi5pbnB1dEZpZWxkLnZhbHVlO1xuICAgICAgICAgICAgICAgIHNlbGYuZWwucmVtb3ZlQ2hpbGQoc2VsZi5pbnB1dEZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW0gPj0gMCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gc2VsZi5vcHRpb25zLml0ZW1zW3NlbGYuYWN0aXZlSXRlbV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzZWxmLm9wdGlvbnMuYWxsb3dDdXN0b20gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IHNlbGYuY3VzdG9tVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlU2VsZWN0RG9jQ2xpY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9DcmVhdGUgbGlzdCBoZWxwZXJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlTGlzdChpdGVtcywgYWN0aXZlSXRlbSwgc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYubGlzdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYubGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgICAgICBzZWxmLmxpc3QuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19saXN0Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RJdGVtKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1DbGFzcyA9IHNlbGYub3B0aW9ucy5jb21wbGV4SXRlbXMgPyAnc2VsZWN0Ym94X19saXN0LWl0ZW0gc2VsZWN0Ym94X19saXN0LWl0ZW0tLWNvbXBsZXgnIDogJ3NlbGVjdGJveF9fbGlzdC1pdGVtIHNlbGVjdGJveF9fbGlzdC1pdGVtLS10ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQgPSAkKCc8bGk+PC9saT4nKS5hZGRDbGFzcyhpdGVtQ2xhc3MpLnRleHQoaXRlbSksXG4gICAgICAgICAgICAgICAgICAgIGxpc3RIZWxwZXIgPSAkKCc8ZGl2PjwvZGl2PicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1pdGVtJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3otaW5kZXgnLCAnLTEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnb3BhY2l0eScsIDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ292ZXJmbG93JywgJ3Zpc2libGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnd2hpdGUtc3BhY2UnLCAnbm93cmFwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KGl0ZW0pO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKGxpc3RIZWxwZXIuZ2V0KDApKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmF0dHIoJ2RhdGEtaW5kZXgnLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5jb21wbGV4SXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuZ2V0KDApLmlubmVySFRNTCA9IGl0ZW07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaFRleHQgJiYgIXNlbGYub3B0aW9ucy5jb21wbGV4SXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuZ2V0KDApLmlubmVySFRNTCA9IGxpc3RJdGVtVGV4dChpdGVtLCBzZWFyY2hUZXh0LCAkKHNlbGYubGlzdCkud2lkdGgoKSA8IGxpc3RIZWxwZXIud2lkdGgoKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQub24oJ21vdXNlZG93bicsIGhhbmRsZUl0ZW1DbGljayk7XG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQub24oJ21vdXNlb3ZlcicsIGhhbmRsZUl0ZW1Nb3VzZU92ZXIpO1xuXG4gICAgICAgICAgICAgICAgbGlzdEhlbHBlci5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbUVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0SXRlbVRleHQoaXRlbVN0cmluZywgdGV4dCwgbG9uZykge1xuICAgICAgICAgICAgICAgIHZhciBvdXRwdXRTdHJpbmcgPSBpdGVtU3RyaW5nO1xuICAgICAgICAgICAgICAgIGlmIChsb25nKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3b3JkcyA9IGl0ZW1TdHJpbmcuc3BsaXQoJyAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaEluZGV4ID0gd29yZHMucmVkdWNlKGZ1bmN0aW9uKGN1cnJlbnRJbmRleCwgd29yZCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTdHJpbmcgPSB3b3JkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0KSA+IC0xICYmIGN1cnJlbnRJbmRleCA9PT0gLTEgPyBpbmRleCA6IGN1cnJlbnRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIC0xKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VhcmNoSW5kZXggPj0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0cmluZ0VuZCA9IHdvcmRzLnNsaWNlKHNlYXJjaEluZGV4KS5yZWR1Y2UoZnVuY3Rpb24oc3RyLCB3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0ciArICcgJyArIHdvcmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWcgPSAvXFwuJC87XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZHNbMF0ubWF0Y2gocmVnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN0cmluZyA9IHdvcmRzWzBdICsgJyAnICsgd29yZHNbMV0gKyAnIC4uLiAnICsgc3RyaW5nRW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTdHJpbmcgPSB3b3Jkc1swXSArICcgLi4uICcgKyBzdHJpbmdFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRUZXh0SW5kZXggPSBvdXRwdXRTdHJpbmcudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQudG9Mb3dlckNhc2UoKSksXG4gICAgICAgICAgICAgICAgICAgIGVuZFRleHRJbmRleCA9IHN0YXJ0VGV4dEluZGV4ICsgdGV4dC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gb3V0cHV0U3RyaW5nLnNsaWNlKDAsIHN0YXJ0VGV4dEluZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgbWlkZGxlID0gb3V0cHV0U3RyaW5nLnNsaWNlKHN0YXJ0VGV4dEluZGV4LCBlbmRUZXh0SW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICBlbmQgPSBvdXRwdXRTdHJpbmcuc2xpY2UoZW5kVGV4dEluZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdGFydCkpO1xuICAgICAgICAgICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQoJCgnPHNwYW4+PC9zcGFuPicpLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtaGlnaGxpZ2h0JykudGV4dChtaWRkbGUpLmdldCgwKSk7XG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShlbmQpKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlubmVySFRNTDtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gZGl2aWRlcigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJCgnPGxpPjwvbGk+JykuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1kaXZpZGVyJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZChzZWxmLmxpc3QpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnVuc2VsZWN0ICYmICFzZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0l0ZW0gPSBsaXN0SXRlbShzZWxmLm9wdGlvbnMudW5zZWxlY3QpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQgc2VsZWN0Ym94X19saXN0LXVuc2VsZWN0Jyk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LmFwcGVuZENoaWxkKG5ld0l0ZW0uZ2V0KDApKTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QuYXBwZW5kQ2hpbGQoZGl2aWRlcigpLmdldCgwKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdJdGVtID0gbGlzdEl0ZW0oaXRlbSwgc2VsZi5vcHRpb25zLml0ZW1zLmluZGV4T2YoaXRlbSkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDAgJiYgc2VsZi5saXN0LmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdJdGVtLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUl0ZW0gPT09IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3SXRlbS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LmFwcGVuZENoaWxkKG5ld0l0ZW0uZ2V0KDApKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgZmllbGRSZWN0ID0gc2VsZi5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgICAgICBmaWVsZE9mZnNldFRvcCA9IHNlbGYuZWwub2Zmc2V0VG9wLFxuICAgICAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgICAgICAgICBtZW51UmVjdCA9IHNlbGYubGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcblxuICAgICAgICAgICAgICAgIGhlaWdodENoZWNrID0gd2luZG93SGVpZ2h0IC0gZmllbGRSZWN0LnRvcCAtIGZpZWxkUmVjdC5oZWlnaHQgLSBtZW51UmVjdC5oZWlnaHQ7XG5cbiAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS50b3AgPSBoZWlnaHRDaGVjayA+IDAgPyBmaWVsZE9mZnNldFRvcCArIGZpZWxkUmVjdC5oZWlnaHQgKyA1ICsgJ3B4JyA6IGZpZWxkT2Zmc2V0VG9wIC0gbWVudVJlY3QuaGVpZ2h0IC0gMTAgKyAncHgnO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0SXRlbShpdGVtKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnVuc2VsZWN0ICYmIGl0ZW0uaW5uZXJIVE1MID09PSBzZWxmLm9wdGlvbnMudW5zZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFjdGl2ZUl0ZW0gPSAtMTtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGJveF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuYWN0aXZlSXRlbSA9IGl0ZW0uZGF0YXNldC5pbmRleDtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5pdGVtQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBzZWxmLm9wdGlvbnMuaXRlbUNhbGxiYWNrKGl0ZW0sIHNlbGYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9TZWxlY3QgY2xpY2tcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2VsZWN0Q2xpY2soZSkge1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgICAgIGlmICghc2VsZi5hY3RpdmVJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9DaGVjayBpZiB0aGVyZSBpcyBhbnkgc2VsZWN0ZWQgaXRlbS4gSWYgbm90IHNldCB0aGUgcGxhY2Vob2xkZXIgdGV4dFxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5hY3RpdmVJdGVtIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBzZWxmLnBsYWNlaG9sZGVyIHx8ICdTZWxlY3QnO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy9DaGVjayBpZiBzZWFyY2ggb3B0aW9uIGlzIG9uIG9yIHRoZXJlIGlzIG1vcmUgdGhhbiAxMCBpdGVtcy4gSWYgeWVzLCBhZGQgc2VhcmNmaWVsZFxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnNlYXJjaCB8fCBzZWxmLm9wdGlvbnMuaXRlbXMubGVuZ3RoID4gNykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmLnNlYXJjaEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC50eXBlID0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19zZWFyY2hmaWVsZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQucGxhY2Vob2xkZXIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaGFuZGxlU2VhcmNoRmllbGRJbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5zZWFyY2hGaWVsZCk7MlxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5hY3RpdmVJdGVtID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBhY3RpdmUgaXRlbVwiLCBzZWxmLm9wdGlvbnMuaXRlbXNbc2VsZi5hY3RpdmVJdGVtXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC52YWx1ZSA9IHNlbGYub3B0aW9ucy5pdGVtc1tzZWxmLmFjdGl2ZUl0ZW1dLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc2VsZi5vcHRpb25zLmFsbG93Q3VzdG9tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC52YWx1ZSA9IHNlbGYuY3VzdG9tVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBoYW5kbGVTZWFyY2hGaWVsZElucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuaW5wdXRGaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9zdGF0ZV9vcGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vY3JlYXRlTGlzdChzZWxmLm9wdGlvbnMuaXRlbXMsIHNlbGYuYWN0aXZlSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlU2VsZWN0RG9jQ2xpY2spO30sIDEwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vU2VsZWN0IGl0ZW0gaGFuZGxlclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVJdGVtQ2xpY2soZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHNlbGVjdEl0ZW0oZS50YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUl0ZW1Nb3VzZU92ZXIoZSkge1xuICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNlbGVjdERvY0NsaWNrKCkge1xuICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL0Z1bHRlciBmdW5jdGlvbiBmb3Igc2VhcmNmaWVsZFxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTZWFyY2hGaWVsZElucHV0KGUpIHtcbiAgICAgICAgICAgIHZhciBmSXRlbXMgPSBzZWxmLm9wdGlvbnMuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjcmVhdGVMaXN0KGZJdGVtcywgc2VsZi5hY3RpdmVJdGVtLCBlLnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUtleVVwKGUpIHtcbiAgICAgICAgICAgIC8vIFJlY29yZHMgdGhlIGN1c3RvbSB2YWx1ZVxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHNlbGYuY3VzdG9tVmFsdWUgPSBzZWxmLnNlYXJjaEZpZWxkLnZhbHVlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5jdXN0b21WYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVLZXlEb3duKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB2YXIgaW5kZXgsIGxlbmd0aDtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0SXRlbShzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJylbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDI3OlxuICAgICAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4IC0gMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCA8IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPiAwID8gJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpIC0gJChzZWxmLmxpc3QpLmhlaWdodCgpIDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmhlaWdodCgpIDwgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXgpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXgpLmhlaWdodCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL0NoZWNrIGlmIGZpZWxkIGlzIGVtcHR5IG9yIG5vdCBhbmQgY2hhbmdlIGNsYXNzIGFjY29yZGluZ2x5XG4gICAgICAgICQoc2VsZi5lbCkub24oJ2NsaWNrJywgaGFuZGxlU2VsZWN0Q2xpY2spO1xuICAgIH07XG5cbiAgICBDb21wbGV4U2VsZWN0Ym94LnByb3RvdHlwZS5fdG9nZ2xlQWRkYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzLmVsKS5oYXNDbGFzcygnanMtaGFzVmFsdWUnKSkge1xuICAgICAgICAgICAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykuYWRkQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQ29tcGxleFNlbGVjdGJveC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3Rib3hfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIHRoaXMuYWN0aXZlSXRlbSA9IC0xO1xuICAgIH07XG5cbiAgICAvKmZ1bmN0aW9uIGluaXRDb21wbGV4U2VsZWN0Ym94ZXMoKSB7XG4gICAgICAgIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWNvbXBsZXhDb21wbGV4U2VsZWN0Ym94JykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIG5ldyBDb21wbGV4U2VsZWN0Ym94KGVsLCB7XG4gICAgICAgICAgICAgICAgbGFiZWw6IGVsLmRhdGFzZXQubGFiZWwsXG4gICAgICAgICAgICAgICAgaGVscFRleHQ6IGVsLmRhdGFzZXQuaGVscFRleHQsXG4gICAgICAgICAgICAgICAgZXJyTXNnOiBlbC5kYXRhc2V0LmVyck1zZyxcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogZWwuZGF0YXNldC5wbGFjZWhvbGRlcixcbiAgICAgICAgICAgICAgICBpdGVtczogSlNPTi5wYXJzZShlbC5kYXRhc2V0Lml0ZW1zKSxcbiAgICAgICAgICAgICAgICBzZWFyY2g6IGVsLmRhdGFzZXQuc2VhcmNoLFxuICAgICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyOmVsLmRhdGFzZXQuc2VhcmNoUGxhY2Vob2xkZXIsXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IGVsLmRhdGFzZXQucmVxdWlyZWQsXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtOiBlbC5kYXRhc2V0LnNlbGVjdGVkSXRlbSxcbiAgICAgICAgICAgICAgICB1bnNlbGVjdDogZWwuZGF0YXNldC51bnNlbGVjdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGluaXRDb21wbGV4U2VsZWN0Ym94ZXMoKTsqL1xuXG5cbi8vfSkod2luZG93KTtcblxuLypcbiAqIEluaXRpYWxpemF0aW9uc1xuICovXG5cbi8vU3RpY2thYmxlXG5mdW5jdGlvbiBTdGlja2FibGUoZWwsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMuX2luaXQoKTtcbn1cblxuU3RpY2thYmxlLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLmJvdW5kYXJ5ID0gc2VsZi5vcHRpb25zLmJvdW5kYXJ5ID8gc2VsZi5vcHRpb25zLmJvdW5kYXJ5ID09PSB0cnVlID8gc2VsZi5lbC5wYXJlbnROb2RlIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxmLm9wdGlvbnMuYm91bmRhcnkpIDogdW5kZWZpbmVkO1xuICAgIHNlbGYub2Zmc2V0ID0gc2VsZi5vcHRpb25zLm9mZnNldCB8fCAwO1xuXG4gICAgZnVuY3Rpb24gaGFuZGxlU2Nyb2xsKCkge1xuICAgICAgICB2YXIgZWxlbWVudFJlY3QgPSBzZWxmLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgZWxlbWVudEJvdHRvbU9mZnNldCA9IGVsZW1lbnRSZWN0LnRvcCArIGVsZW1lbnRSZWN0LmhlaWdodDtcblxuXG4gICAgICAgIGlmICgoc2VsZi5vcHRpb25zLm1heFdpZHRoICYmIHdpbmRvdy5pbm5lcldpZHRoIDw9IHNlbGYub3B0aW9ucy5tYXhXaWR0aCkgfHwgIXNlbGYub3B0aW9ucy5tYXhXaWR0aCkge1xuICAgICAgICAgICAgaWYgKCFzZWxmLmVsLmNsYXNzTGlzdC5jb250YWlucygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50UmVjdC50b3AgLSBzZWxmLm9wdGlvbnMub2Zmc2V0IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsZW1lbnRPZmZzZXRQYXJlbnQgPSBzZWxmLmVsLm9mZnNldFBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbml0aWFsT2Zmc2V0ID0gc2VsZi5lbC5vZmZzZXRUb3A7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZChzZWxmLm9wdGlvbnMuY2xhc3MgfHwgJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnRvcCA9IHNlbGYub2Zmc2V0LnRvU3RyaW5nKCkgKyAncHgnO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudE9mZnNldFBhcmVudFJlY3QgPSBzZWxmLmVsZW1lbnRPZmZzZXRQYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuYm91bmRhcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJvdW5kYXJ5UmVjdCA9IHNlbGYuYm91bmRhcnkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZGFyeUJvdHRvbU9mZnNldCA9IGJvdW5kYXJ5UmVjdC50b3AgKyBib3VuZGFyeVJlY3QuaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Qm90dG9tT2Zmc2V0ID4gYm91bmRhcnlCb3R0b21PZmZzZXQgfHwgZWxlbWVudFJlY3QudG9wIDwgc2VsZi5vcHRpb25zLm9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS50b3AgPSBNYXRoLnJvdW5kKGJvdW5kYXJ5Qm90dG9tT2Zmc2V0IC0gZWxlbWVudFJlY3QuaGVpZ2h0KS50b1N0cmluZygpICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50UmVjdC50b3AgPiBzZWxmLm9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS50b3AgPSBzZWxmLm9mZnNldC50b1N0cmluZygpICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vZmZzZXQgPCBzZWxmLmluaXRpYWxPZmZzZXQgKyBlbGVtZW50T2Zmc2V0UGFyZW50UmVjdC50b3ApIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnBvc2l0aW9uID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUudG9wID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVSZXNpemUoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IHNlbGYub3B0aW9ucy5tYXhXaWR0aCkge1xuICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS5wb3NpdGlvbiA9ICcnO1xuICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS50b3AgPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhhbmRsZVNjcm9sbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvcHRpbWl6ZWRTY3JvbGxcIiwgaGFuZGxlU2Nyb2xsKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9wdGltaXplZFJlc2l6ZVwiLCBoYW5kbGVSZXNpemUpO1xufTtcblxuLy9SZXF1aXJlZCBGaWVsZHNcbmZ1bmN0aW9uIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKSB7XG4gICAgJCgnLmpzLXJlcXVpcmVkQ291bnQnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICB2YXIgY2FyZCA9ICQoZWwpLnBhcmVudHMoJy5jYXJkJyksXG4gICAgICAgICAgICBjYXJkSWQgPSBjYXJkLmF0dHIoJ2lkJyksXG4gICAgICAgICAgICBlbXB0eVJlcXVpcmVkRmllbGRzQ291bnQgPSBjYXJkLmZpbmQoJy5qcy1yZXF1aXJlZCcpLmxlbmd0aCAtIGNhcmQuZmluZCgnLmpzLXJlcXVpcmVkLmpzLWhhc1ZhbHVlJykubGVuZ3RoLFxuICAgICAgICAgICAgbmF2SXRlbSA9ICQoJy5qcy1zY3JvbGxTcHlOYXYgLmpzLXNjcm9sbE5hdkl0ZW1bZGF0YS1ocmVmPVwiJyArIGNhcmRJZCArICdcIl0nKTtcblxuICAgICAgICBpZiAoZW1wdHlSZXF1aXJlZEZpZWxkc0NvdW50ID4gMCkge1xuICAgICAgICAgICAgbmF2SXRlbS5hZGRDbGFzcygnaXMtcmVxdWlyZWQnKTtcbiAgICAgICAgICAgICQoZWwpLnRleHQoZW1wdHlSZXF1aXJlZEZpZWxkc0NvdW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hdkl0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLXJlcXVpcmVkJyk7XG4gICAgICAgICAgICAkKGVsKS50ZXh0KCcnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbi8vUGFnaW5hdGlvblxuZnVuY3Rpb24gUGFnaW5hdGlvbihlbCwgc3RvcmUsIHVwZGF0ZUZ1bmN0aW9uKSB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICB0aGlzLnVwZGF0ZSA9IHVwZGF0ZUZ1bmN0aW9uO1xuXG4gICAgdGhpcy5faW5pdCgpO1xufVxuXG5QYWdpbmF0aW9uLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZW5kZXJQYWdpbmF0aW9uKCk7XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVQYWdlQ2xpY2soZSkge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQuZGF0YXNldC50YXJnZXQgfHwgZS50YXJnZXQucGFyZW50Tm9kZS5kYXRhc2V0LnRhcmdldDtcbiAgICAgICAgc3dpdGNoICh0YXJnZXQpIHtcbiAgICAgICAgICAgIGNhc2UgJ3ByZXYnOlxuICAgICAgICAgICAgICAgIHNlbGYuc3RvcmUuc2V0UGFnZShzZWxmLnN0b3JlLnBhZ2UgLSAxIDwgMCA/IDAgOiBzZWxmLnN0b3JlLnBhZ2UgLSAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ25leHQnOlxuICAgICAgICAgICAgICAgIHNlbGYuc3RvcmUuc2V0UGFnZShzZWxmLnN0b3JlLnBhZ2UgKyAxID09PSBzZWxmLnN0b3JlLnBhZ2VzTnVtYmVyKCkgPyBzZWxmLnN0b3JlLnBhZ2VzTnVtYmVyKCkgLSAxIDogc2VsZi5zdG9yZS5wYWdlICsgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLnVwZGF0ZSgkKCcjbGlicmFyeUJvZHknKSwgc2VsZi5zdG9yZSwgcmVuZGVyQ29udGVudFJvdyk7XG4gICAgICAgIHJlbmRlclBhZ2luYXRpb24oKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJQYWdpbmF0aW9uKCkge1xuICAgICAgICB2YXIgbGlua3MgPSAkKCc8dWw+PC91bD4nKS5hZGRDbGFzcygncGFnaW5hdGlvbl9fbGlzdCcpO1xuICAgICAgICBzZWxmLmVsLmVtcHR5KCk7XG5cbiAgICAgICAgY29uc29sZS5sb2coc2VsZi5zdG9yZS5wYWdlc051bWJlcigpKTtcblxuICAgICAgICBpZiAoc2VsZi5zdG9yZS5wYWdlc051bWJlcigpID4gMSkge1xuICAgICAgICAgICAgLy9QcmV2XG4gICAgICAgICAgICB2YXIgcHJldkxpbmsgPSAkKCc8bGk+PGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1sZWZ0XCI+PC9pPjwvbGk+JykuYWRkQ2xhc3MoJ3BhZ2luYXRpb25fX3ByZXYnKS5hdHRyKCdkYXRhLXRhcmdldCcsICdwcmV2JykuY2xpY2soaGFuZGxlUGFnZUNsaWNrKTtcbiAgICAgICAgICAgIGlmIChzZWxmLnN0b3JlLnBhZ2UgPT09IDApIHtwcmV2TGluay5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTt9XG4gICAgICAgICAgICBsaW5rcy5hcHBlbmQocHJldkxpbmspO1xuXG4gICAgICAgICAgICAvL0N1cnJlbnQgcGFnZSBpbmRpY2F0b3JcbiAgICAgICAgICAgIC8vdmFyIGN1cnJlbnRQYWdlID0gJCgnPGxpPjwvbGk+JykuYWRkQ2xhc3MoJ3BhZ2luYXRpb25fX2N1cnJlbnQnKS50ZXh0KHNlbGYuc3RvcmUucGFnZSArIDEpO1xuICAgICAgICAgICAgLy9saW5rcy5hcHBlbmQoY3VycmVudFBhZ2UpO1xuXG4gICAgICAgICAgICAvL05leHRcbiAgICAgICAgICAgIHZhciBuZXh0TGluayA9ICQoJzxsaT48aSBjbGFzcz1cImZhIGZhLWFuZ2xlLXJpZ2h0XCI+PC9pPjwvbGk+JykuYWRkQ2xhc3MoJ3BhZ2luYXRpb25fX25leHQnKS5hdHRyKCdkYXRhLXRhcmdldCcsICduZXh0JykuY2xpY2soaGFuZGxlUGFnZUNsaWNrKTtcbiAgICAgICAgICAgIGlmIChzZWxmLnN0b3JlLnBhZ2UgPT09IHNlbGYuc3RvcmUucGFnZXNOdW1iZXIoKSAtIDEpIHtuZXh0TGluay5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTt9XG4gICAgICAgICAgICBsaW5rcy5hcHBlbmQobmV4dExpbmspO1xuXG4gICAgICAgICAgICBzZWxmLmVsLmFwcGVuZChsaW5rcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5lbDtcbiAgICB9XG5cbn07XG5cblxuXG4vL0dsb2JhbCB2YXJpYWJsZXNcbnZhciBlZGl0ZWRGaWxlc0RhdGEgPSBbXSxcbmVkaXRlZEZpbGVEYXRhID0ge30sXG5jbGFzc0xpc3QgPSBbXSxcbmRhdGFDaGFuZ2VkID0gZmFsc2UsIC8vQ2hhbmdlcyB3aGVuIHVzZXIgbWFrZSBhbnkgY2hhbmdlcyBvbiBlZGl0IHNjcmVlbjtcbmxhc3RTZWxlY3RlZCA9IG51bGwsIC8vSW5kZXggb2YgbGFzdCBTZWxlY3RlZCBlbGVtZW50IGZvciBtdWx0aSBzZWxlY3Q7XG5nYWxsZXJ5T2JqZWN0cyA9IFtdLFxuZHJhZnRJc1NhdmVkID0gZmFsc2UsXG5kaXNhYmxlZEl0ZW1zID0gW107XG5cbi8vTmV3IEdhbGxlcnkgZmlsZXNcbi8vIENyZWF0ZSBET00gZWxlbWVudCBmb3IgRmlsZSBmcm9tIGRhdGFcbmZ1bmN0aW9uIGNyZWF0ZUZpbGVFbGVtZW50KGYpIHtcbiAgdmFyIGZpbGVEYXRhID0gZi5maWxlRGF0YTtcblxuICAvL2NyZWF0ZSBiYXNpYyBlbGVtZW50XG4gIHZhciBmaWxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcyhmaWxlQ2xhc3MoZmlsZURhdGEpKSxcbiAgZmlsZUluZGV4ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaGlkZGVuIGZpbGVfX2lkJykudGV4dChmaWxlRGF0YS5pZCksXG5cbiAgZmlsZUltZyA9ICQoJzxkaXY+PC9kaXY+JylcbiAgLmFkZENsYXNzKCdmaWxlX19pbWcnKVxuICAuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgZmlsZURhdGEudXJsICsgJyknKSxcbiAgZmlsZUNvbnRyb2xzID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fY29udHJvbHMnKS5jbGljayh0b2dnbGVGaWxlU2VsZWN0KSxcbiAgZmlsZUNoZWNrbWFyayA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2NoZWNrbWFyaycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuICBmaWxlRWRpdCA9ICQoJzxidXR0b24+RWRpdDwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKS5jbGljayhoYW5kbGVGaWxlZEVkaXRCdXR0b25DbGljayksXG4gIGZpbGVQcm9ncmVzc2JhciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2MtRmlsZS1wcm9ncmVzc0JhciBoaWRkZW4nKSxcbiAgZmlsZVByb2dyZXNzYmFyTG9hZGVkID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnYy1GaWxlLXByb2dyZXNzQmFyLWxvYWRlcicpLFxuXG4gIGZpbGVUaXRsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3RpdGxlIGZpbGVfX3RpdGxlX21haW4nKS50ZXh0KGZpbGVEYXRhLnRpdGxlKSxcblxuICBmaWxlRWRpdEJ1dHRvbiA9ICQoJzxidXR0b24+RWRpdDwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtZ3JheSB1LXZpc2libGUteHMgdS1ub01hcmdpbicpLmNsaWNrKGhhbmRsZUZpbGVkRWRpdEJ1dHRvbkNsaWNrKTtcblxuXG4gIGZpbGVQcm9ncmVzc2Jhci5hcHBlbmQoZmlsZVByb2dyZXNzYmFyTG9hZGVkKTtcbiAgZmlsZUNvbnRyb2xzLmFwcGVuZChmaWxlQ2hlY2ttYXJrLCBmaWxlVHlwZUVsZW1lbnQoZmlsZURhdGEpLCBmaWxlRWRpdCwgZmlsZVByb2dyZXNzYmFyKTtcbiAgZmlsZUltZy5hcHBlbmQoZmlsZUNvbnRyb2xzKTtcblxuICBmaWxlLmFwcGVuZChmaWxlSW5kZXgsIGZpbGVJbWcsIGZpbGVUaXRsZSwgZmlsZUVkaXRCdXR0b24pO1xuXG4gIHJldHVybiBmaWxlO1xufVxuXG5mdW5jdGlvbiBhZGRGaWxlKGZpbGUpIHtcbiAgdmFyIGFzc2V0c0xpYnJhcnlTZWN0aW9uID0gJCgnLmZpbGVzICNhc3NldHMnKSxcbiAganVzdFVwbG9hZGVkU2VjdGlvbiA9ICQoJy5maWxlcyAjanVzdFVwbG9hZGVkJyk7XG5cbiAgaWYgKGp1c3RVcGxvYWRlZFNlY3Rpb24ubGVuZ3RoID09PSAwICYmIGZpbGUuaGFzQ2xhc3MoJ2p1c3RVcGxvYWRlZCcpKSB7XG4gICAganVzdFVwbG9hZGVkU2VjdGlvbiA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3NlY3Rpb24nKS5hdHRyKCdpZCcsICdqdXN0VXBsb2FkZWQnKTtcbiAgICB2YXIgc2VjdGlvblRpdGxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnc2VjdGlvbl9fdGl0bGUnKSxcbiAgICBzZWN0aW9uVGl0bGVUZXh0ID0gJCgnPHNwYW4+PC9zcGFuPicpLmFkZENsYXNzKCdzZWN0aW9uX190aXRsZS10ZXh0JykudGV4dCgnSnVzdCBVcGxvYWRlZCcpLFxuICAgIHNlY3Rpb25GaWxlcyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3NlY3Rpb25fX2ZpbGVzIHNlY3Rpb25fX2ZpbGVzX3ZpZXdfZ3JpZCcpO1xuXG4gICAgc2VjdGlvblRpdGxlLmFwcGVuZChzZWN0aW9uVGl0bGVUZXh0KTtcbiAgICBqdXN0VXBsb2FkZWRTZWN0aW9uLmFwcGVuZChzZWN0aW9uVGl0bGUsIHNlY3Rpb25GaWxlcyk7XG5cbiAgICBqdXN0VXBsb2FkZWRTZWN0aW9uLmluc2VydEJlZm9yZShhc3NldHNMaWJyYXJ5U2VjdGlvbik7XG4gIH1cblxuICBpZiAoZmlsZS5oYXNDbGFzcygnanVzdFVwbG9hZGVkJykpIHtcbiAgICBqdXN0VXBsb2FkZWRTZWN0aW9uLmZpbmQoJy5zZWN0aW9uX19maWxlcycpLmFwcGVuZChmaWxlKTtcbiAgfVxuICBlbHNlIHthc3NldHNMaWJyYXJ5U2VjdGlvbi5maW5kKCcuc2VjdGlvbl9fZmlsZXMnKS5hcHBlbmQoZmlsZSk7fVxuICBpZiAoZmlsZS5oYXNDbGFzcygnanMtbG9hZGluZycpKSB7XG4gICAgZmlsZS5maW5kKCcuYy1GaWxlLXByb2dyZXNzQmFyJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgIGZpbGUuZmluZCgnLmMtRmlsZS1wcm9ncmVzc0JhciAuYy1GaWxlLXByb2dyZXNzQmFyLWxvYWRlcicpLmFuaW1hdGUoe3dpZHRoOiBcIjEwMCVcIn0sXG4gICAgMjMwMCxcbiAgICAnbGluZWFyJyxcbiAgICBmdW5jdGlvbigpIHt0aGlzLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7fVxuICApO1xufVxufVxuXG5mdW5jdGlvbiB1cGRhdGVHYWxsZXJ5KHNjcm9sbEluZGV4KSB7XG4gIHZhciBqdXN0VXBsb2FkZWQgPSBmYWxzZTtcbiAgc2luZ2xlc2VsZWN0ID0gZmFsc2U7XG5cbiAgLy8gUmVtZW1iZXIgcG9zaXRpb24gYW5kIHNlbGVjdGlvbiBvZiBmaWxlc1xuICAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgIHZhciBmaWxlID0gZ2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcbiAgICAgIHJldHVybiBmLmZpbGVEYXRhLmlkID09PSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG4gICAgfSlbMF07XG4gICAgaWYgKGZpbGUpIHtcbiAgICAgIGZpbGUucG9zaXRpb24gPSBpbmRleDtcbiAgICAgIGZpbGUuc2VsZWN0ZWQgPSAkKGVsKS5oYXNDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgIGZpbGUuanVzdFVwbG9hZGVkID0gJChlbCkuaGFzQ2xhc3MoJ2p1c3RVcGxvYWRlZCcpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy9DbGVhciBmaWxlcyBzZWN0aW9uXG4gICQoJy5maWxlcyAuc2VjdGlvbl9fZmlsZXMnKS5lbXB0eSgpO1xuXG4gIC8vU29ydCBhcnJheSBhY29yZGluZyBmaWxlcyBwb3NpdGlvblxuICBnYWxsZXJ5T2JqZWN0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYS5wb3NpdGlvbiAtIGIucG9zaXRpb247XG4gIH0pO1xuXG4gIC8vQ3JlYXRlIGZpbGVzIGZyb20gZGF0YSBhbmQgYWRkIHRoZW0gdG8gdGhlIHBhZ2VcbiAgZm9yICh2YXIgaSA9IDA7IGk8Z2FsbGVyeU9iamVjdHMubGVuZ3RoOyBpKysgKSB7XG4gICAgdmFyIGYgPSBnYWxsZXJ5T2JqZWN0c1tpXSxcbiAgICBmaWxlID0gY3JlYXRlRmlsZUVsZW1lbnQoZik7XG5cbiAgICBpZiAoZi5zZWxlY3RlZCkge2ZpbGUuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7fVxuICAgIGlmIChmLmp1c3RVcGxvYWRlZCkge1xuICAgICAgZmlsZS5hZGRDbGFzcygnanVzdFVwbG9hZGVkJyk7XG4gICAgICAvL2YuanVzdFVwbG9hZGVkID0gZmFsc2U7XG4gICAgICBqdXN0VXBsb2FkZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZi5sb2FkaW5nKSB7XG4gICAgICBmaWxlLmFkZENsYXNzKCdqcy1sb2FkaW5nJyk7XG4gICAgICBmLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB9XG4gICAgYWRkRmlsZShmaWxlKTtcbiAgfVxuXG4gIG5vcm1hbGl6ZVNlbGVjdGVpb24oKTtcblxuICBpZiAoc2Nyb2xsSW5kZXgpIHtcbiAgICB2YXIgc2Nyb2xsVG9wID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzICNqdXN0VXBsb2FkZWQnKS5sYXN0KCkub2Zmc2V0KCkudG9wIC0gMjAwO1xuICAgIGNvbnNvbGUubG9nKHNjcm9sbFRvcCk7XG4gICAgJCgnYm9keScpLmFuaW1hdGUoe1xuICAgICAgc2Nyb2xsVG9wOiBzY3JvbGxUb3BcbiAgICB9LCA0MDApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRHYWxsZXJ5KCkge1xuICBhc3NldExpYnJhcnlPYmplY3RzLmZvckVhY2goZnVuY3Rpb24oZmlsZSkge1xuICAgIGdhbGxlcnlPYmplY3RzLnB1c2goe1xuICAgICAgZmlsZURhdGE6IGZpbGUsXG4gICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICBwb3NpdGlvbjogMTAwMCxcbiAgICAgIGNhcHRpb246ICcnLFxuICAgICAgZ2FsbGVyeUNhcHRpb246IGZhbHNlLFxuICAgICAganVzdFVwbG9hZGVkOiBmYWxzZVxuICAgIH0pO1xuICB9KTtcbiAgdXBkYXRlR2FsbGVyeSgpO1xufVxuXG4vKlxuKiBIZWxwZXJzIGZ1bmN0aW9uc1xuKi9cbmZ1bmN0aW9uIGZpbGVDbGFzcyhmaWxlRGF0YSkge1xuICBzd2l0Y2ggKGZpbGVEYXRhLnR5cGUpIHtcbiAgICBjYXNlICdpbWFnZSc6XG4gICAgcmV0dXJuICdmaWxlIGZpbGVfdmlld19ncmlkIGpzLWltZ0ZpbGVUeXBlJztcblxuICAgIGNhc2UgJ3ZpZGVvJzpcbiAgICByZXR1cm4gJ2ZpbGUgZmlsZV92aWV3X2dyaWQganMtdmlkZW9GaWxlVHlwZSc7XG5cbiAgICBkZWZhdWx0OlxuICAgIHJldHVybiAnZmlsZSBmaWxlX3ZpZXdfZ3JpZCc7XG4gIH1cbn1cbmZ1bmN0aW9uIGZpbGVUeXBlRWxlbWVudChmaWxlRGF0YSkge1xuICBzd2l0Y2ggKGZpbGVEYXRhLnR5cGUpIHtcbiAgICBjYXNlICdpbWFnZSc6XG4gICAgcmV0dXJuICQoJzxkaXY+PGkgY2xhc3M9XCJmYSBmYS1jYW1lcmFcIj48L2k+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3R5cGUnKTtcblxuICAgIGNhc2UgJ3ZpZGVvJzpcbiAgICByZXR1cm4gJCgnPGRpdj48aSBjbGFzcz1cImZhIGZhLXZpZGVvLWNhbWVyYVwiPjwvaT48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdHlwZScpO1xuXG4gICAgZGVmYXVsdDpcbiAgICByZXR1cm4gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdHlwZScpO1xuICB9XG59XG5cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gIC8vQ29tbW9uIGluaXQgZnVuY3Rpb25zXG4gIHZhciBzY3JvbGxQb3NpdGlvbjtcbiAgdmFyIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gIFxuICAvL1N0aWNreSBzY3JvbGxiYXJcbiAgc3RpY2t5VG9wYmFyID0gbmV3IFN0aWNreVRvcGJhcigpO1xuICBcbiAgLy9Ob3JtYWxpemVyc1xuICBub3JtaWxpemVNZW51KCk7XG4gIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgbm9ybWFsaXplU2VsZWN0ZWlvbigpO1xuICBcbiAgJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5zZWN0aW9uX19maWxlcycpLmRpc2FibGVTZWxlY3Rpb24oKTtcbiAgXG4gIC8vQ2hlY2sgZm9yIHJlcXVpcmVkIGZpZWxkc1xuICAkKCdsYWJlbC5yZXF1aWVyZWQnKS5wYXJlbnQoKS5jaGlsZHJlbignaW5wdXQnKS5vbignYmx1cicsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoY2hlY2tGaWVsZChlLnRhcmdldCkpIHtcbiAgICAgIG1hcmtGaWVsZEFzTm9ybWFsKGUudGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWFya0ZpZWxkQXNSZXF1aXJlZChlLnRhcmdldCk7XG4gICAgfVxuICB9KTtcbiAgXG4gIFxuICAvL0NsaWNrIG9uIGxvZ29cbiAgJCgnLmpzLWxvZ28nKS5jbGljayhoYW5kbGVMb2dvQ2xpY2spO1xuICBmdW5jdGlvbiBoYW5kbGVMb2dvQ2xpY2soZSkge1xuICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCdjcmVhdGUnKSA+PSAwICYmXG4gICAgIWRyYWZ0SXNTYXZlZCAmJlxuICAgICQoJy5qcy1jb250ZW50IC5maWxlLCAuanMtY29udGVudCAuanMtaGFzVmFsdWUnKS5sZW5ndGggPiAwKSB7XG4gICAgICBuZXcgTW9kYWwoe1xuICAgICAgICB0aXRsZTogJ0xlYXZlIFBhZ2U/JyxcbiAgICAgICAgdGV4dDogJ1lvdSB3aWxsIGxvc2UgYWxsIHVuc2F2ZWQgY2hhbmdlcy4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGxlYXZlIHRoaXMgcGFnZT8nLFxuICAgICAgICBjb25maXJtVGV4dDogJ0xlYXZlIFBhZ2UnLFxuICAgICAgICBjb25maXJtQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdkYXNoYm9hcmQuaHRtbCc7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdkYXNoYm9hcmQuaHRtbCc7XG4gICAgfVxuICB9XG4gIFxuICAvL0Fzc2V0IExpYnJhcnlcbiAgXG4gICQoJyNhbENsb3NlQnV0dG9uJykuY2xpY2soY2xvc2VBc3NldExpYnJhcnkpO1xuICAkKCcjYWxUb3BDbG9zZUJ1dHRvbicpLmNsaWNrKGNsb3NlQXNzZXRMaWJyYXJ5KTtcbiAgJCgnI2Fzc2V0TGlicmFyeScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICBvcGVuQXNzZXRMaWJyYXJ5KGUpO1xuICB9KTtcbiAgXG4gIGZ1bmN0aW9uIG9wZW5Bc3NldExpYnJhcnkoZSwgb3B0aW9ucykge1xuICAgIHNjcm9sbFBvc2l0aW9uID0gJCgnYm9keScpLnNjcm9sbFRvcCgpO1xuICAgIHVwZGF0ZUFzc2V0TGlicmFyeSgpO1xuICAgICQoJyNhbCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAkKCcjYWwnKS5hZGRDbGFzcygnbW9kYWwnKTtcbiAgICAkKCcjd3JhcHBlcicpLmFkZENsYXNzKCdvdmVyZmxvdycpO1xuICAgIHNpbmdsZXNlbGVjdCA9IGZhbHNlO1xuICAgICQoJyNhZGRGcm9tQUxCdXR0b24nKS50ZXh0KCdBZGQgRmlsZXMnKTtcbiAgXG4gICAgJCgnI2FkZEZyb21BTEJ1dHRvbicpLmNsaWNrKGFkZEZpbGVzRnJvbUFzc2V0TGlicmFyeSk7XG4gICAgc2V0TW9kYWxLZXlib2FyZEFjdGlvbnMoYWRkRmlsZXNGcm9tQXNzZXRMaWJyYXJ5LCBjbG9zZUFzc2V0TGlicmFyeSk7XG4gICAgJChlLnRhcmdldCkuYmx1cigpO1xuICB9XG4gIFxuICBmdW5jdGlvbiBhZGRGaWxlc0Zyb21Bc3NldExpYnJhcnkoKXtcbiAgICBsYXN0U2VsZWN0ZWQgPSBudWxsO1xuICAgIGFkZFNlbGVjdGVkRmlsZXMoKTtcbiAgICBjbG9zZUFzc2V0TGlicmFyeSgpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcbiAgfVxuICBmdW5jdGlvbiBjbG9zZUFzc2V0TGlicmFyeSgpIHtcbiAgICBsYXN0U2VsZWN0ZWQgPSBudWxsO1xuICAgICQoJy5hbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgZGVzZWxlY3RBbGwoKTtcbiAgICAkKCcubW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJykucmVtb3ZlQ2xhc3MoJ21vZGFsJyk7XG4gICAgJCgnI3dyYXBwZXInKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3cnKTtcbiAgICAkKCcjYWRkRnJvbUFMQnV0dG9uJykudW5iaW5kKCdjbGljaycpO1xuICAgICQoJ2JvZHknKS5zY3JvbGxUb3Aoc2Nyb2xsUG9zaXRpb24pO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcbiAgfVxuICBcbiAgd2luZG93Lm9wZW5Bc3NldExpYnJhcnkgPSBvcGVuQXNzZXRMaWJyYXJ5O1xuICBcbiAgJCgnI2FsJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICQoJyNhbCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgfSk7XG4gICQoJyNhbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzJykuZGlzYWJsZVNlbGVjdGlvbigpO1xuICBcbiAgLy9VcGxvYWQgZmlsZXNcbiAgJCgnI3VwbG9hZEZpbGVzJykuY2xpY2soaGFuZGxlVXBsb2FkRmlsZXNDbGljayk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGhhbmRsZURyYWdFbnRlciwgdHJ1ZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgaGFuZGxlRHJhZ092ZXIsIGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGhhbmRsZURyb3AsIGZhbHNlKTtcbiAgXG4gIC8vRHJhZnQgZnVuY3Rpb246IFNhdmUsIENhbmNlbCwgUHVibGlzaFxuICBmdW5jdGlvbiBzYXZlRHJhZnQoKSB7XG4gICAgc2hvd05vdGlmaWNhdGlvbignVGhlIGRyYWZ0IGlzIHNhdmVkLicpO1xuICAgIGRyYWZ0SXNTYXZlZCA9IHRydWU7XG4gIH1cbiAgZnVuY3Rpb24gcmVtb3ZlRHJhZnQoKSB7XG4gICAgbmV3IE1vZGFsKHtcbiAgICAgIHRpdGxlOiAnQ2FuY2VsIHRoaXMgRHJhZnQ/JyxcbiAgICAgIHRleHQ6ICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gY2FuY2VsIGFuZCBkaXNjYXJkIHRoaXMgZHJhZnQ/JyxcbiAgICAgIGNvbmZpcm1UZXh0OiAnQ2FuY2VsJyxcbiAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdkYXNoYm9hcmQuaHRtbCc7XG4gICAgICB9LFxuICAgICAgY2FuY2VsQWN0aW9uOiBoaWRlTW9kYWxQcm9tcHRcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBwdWJsaXNoRHJhZnQoKSB7XG4gICAgdmFyIGl0ZW1OYW1lID0gJCgnLm1lbnUgLmlzLWFjdGl2ZScpLnRleHQoKSxcbiAgICBwcm9tcHRNc2cgPSAnJztcbiAgXG4gICAgc3dpdGNoIChpdGVtTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICBjYXNlICdwZXJzb24nOlxuICAgICAgcHJvbXB0TXNnID0gJ1B1Ymxpc2hlZCBwZXJzb24gd2lsbCBiZWNvbWUgYXZhaWxhYmxlIHRvIGJlIGFkZGVkIGFzIHBhcnQgb2YgYSBjYXN0IGZvciBhIHNlYXNvbi9ldmVudC4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHB1Ymxpc2ggaXQ/JztcbiAgICAgIGJyZWFrO1xuICBcbiAgICAgIGNhc2UgJ3JvbGUnOlxuICAgICAgcHJvbXB0TXNnID0gJ1B1Ymxpc2hlZCByb2xlIHdpbGwgYmVjb21lIGF2YWlsYWJsZSB0byBiZSBhZGRlZCBhcyBwYXJ0IG9mIGEgY2FzdCBmb3IgYSBzZWFzb24vZXZlbnQuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwdWJsaXNoIGl0Pyc7XG4gICAgICBicmVhaztcbiAgXG4gICAgICBkZWZhdWx0OlxuICAgICAgcHJvbXB0TXNnID0gJ1B1Ymxpc2hlZCAnICsgaXRlbU5hbWUudG9Mb3dlckNhc2UoKSArICcgd2lsbCBiZWNvbWUgYXZhaWxhYmxlIG9uIHRoZSBsaXZlIHNpdGUuIEFyZSB5b3Ugc3VyZSB5b3Ugd291bGQgbGlrZSB0byBwdWJsaXNoIGl0Pyc7XG4gICAgICBicmVhaztcbiAgXG4gICAgfVxuICAgIG5ldyBNb2RhbCh7XG4gICAgICB0aXRsZTogJ1B1Ymxpc2ggdGhpcyAnICsgaXRlbU5hbWUgKyAnPycsXG4gICAgICB0ZXh0OiBwcm9tcHRNc2csXG4gICAgICBjb25maXJtVGV4dDogJ1B1Ymxpc2gnLFxuICAgICAgY29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGhpZGVNb2RhbFByb21wdCgpO1xuICAgICAgICBzaG93Tm90aWZpY2F0aW9uKGl0ZW1OYW1lICsgJyBpcyBwdWJsaXNoZWQuJyk7XG4gICAgICAgIGRyYWZ0SXNTYXZlZCA9IHRydWU7XG4gICAgICB9LFxuICAgICAgY2FuY2VsQWN0aW9uOiBoaWRlTW9kYWxQcm9tcHRcbiAgICB9KTtcbiAgfVxuICBcbiAgJCgnI3NhdmVEcmFmdCcpLmNsaWNrKHNhdmVEcmFmdCk7XG4gICQoJyNyZW1vdmVEcmFmdCcpLmNsaWNrKHJlbW92ZURyYWZ0KTtcbiAgJCgnI3B1Ymxpc2hEcmFmdCcpLmNsaWNrKHB1Ymxpc2hEcmFmdCk7XG4gIFxuICAvL1RvcCBiYXIgYWN0aW9ucyBkcm9wZG93biBmb3IgbW9iaWxlXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aW9uRHJvcGRvd24nKSkge1xuICAgIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aW9uRHJvcGRvd24nKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBTYXZlIGFzIGRyYWZ0PC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogc2F2ZURyYWZ0XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLWJhblwiPjwvaT48c3BhbiBjbGFzcz1cImJ1dHRvblRleHRcIj4gIENhbmNlbDwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IHJlbW92ZURyYWZ0XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBcbiAgLy9GaWxlcyBtb3JlIGFjdGlvbiBkcm9wZG93bnNcbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3JlQWN0aW9ucycpKSB7XG4gICAgdmFyIHBhZ2VBY3Rpb25Ecm9wZG93biA9IG5ldyBEcm9wZG93bihcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3JlQWN0aW9ucycpLFxuICAgICAge1xuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJ1NlbmQgdG8gdG9wJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVTZW5kVG9Ub3BDbGlja1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnU2VuZCB0byBib3R0b20nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZVNlbmRUb0JvdHRvbUNsaWNrXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBcbiAgLy9NZWRpYSBjYXJkIGRyb3Bkb3duc1xuICAvL1NtYWxsXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVkaWFBY3Rpb25zU21hbGwnKSkge1xuICAgIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVkaWFBY3Rpb25zU21hbGwnKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgVXBsb2FkIGZpbGVzPC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlVXBsb2FkRmlsZXNDbGlja1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1mb2xkZXItb3BlblwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgQWRkIGZyb20gbGlicmFyeTwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgb3BlbkFzc2V0TGlicmFyeShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICApO1xuICB9XG4gIC8vRnVsbFxuICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lZGlhQWN0aW9uc0Z1bGwnKSkge1xuICAgIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVkaWFBY3Rpb25zRnVsbCcpLFxuICAgICAge1xuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtcGVuY2lsLXNxdWFyZVwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgTXVsdGkgRWRpdDwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZU11bHRpRWRpdEJ1dHRvbkNsaWNrLFxuICAgICAgICAgICAgZGlzYWJsZWQ6IGZ1bmN0aW9uKCkge3JldHVybiAkKCcjbXVsdGlFZGl0JykuaGFzQ2xhc3MoJ2Rpc2FibGVkJyk7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS10aW1lcy1jaXJjbGVcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIFJlbW92ZTwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZUJ1bGtSZW1vdmVDbGljayxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI2J1bGtSZW1vdmUnKS5oYXNDbGFzcygnZGlzYWJsZWQnKTt9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkaXZpZGVyOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgVXBsb2FkIGZpbGVzPC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlVXBsb2FkRmlsZXNDbGlja1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1mb2xkZXItb3BlblwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgQWRkIGZyb20gbGlicmFyeTwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgb3BlbkFzc2V0TGlicmFyeShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICApO1xuICB9XG4gIFxuICAvL0Fzc2V0IGxpYnJhcnkgZHJvcGRvd25zXG4gIC8vU21hbGxcbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc3NldEFjdGlvbnNTbWFsbCcpKSB7XG4gICAgdmFyIHBhZ2VBY3Rpb25Ecm9wZG93biA9IG5ldyBEcm9wZG93bihcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc3NldEFjdGlvbnNTbWFsbCcpLFxuICAgICAge1xuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtdXBsb2FkXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBVcGxvYWQgZmlsZXM8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVVcGxvYWRGaWxlc0NsaWNrXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICAvL0Z1bGxcbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc3NldEFjdGlvbnNGdWxsJykpIHtcbiAgICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fzc2V0QWN0aW9uc0Z1bGwnKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXBlbmNpbFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgQnVsayBFZGl0PC9zcGFuPjxzcGFuIGNsYXNzPVwiZHJvcGRvd25fX3dhcm5pbmdcIj48L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVNdWx0aUVkaXRCdXR0b25DbGljayxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI2J1bGtFZGl0JykuaGFzQ2xhc3MoJ2Rpc2FibGVkJyk7fSxcbiAgICAgICAgICAgIHdhcm5pbmc6IGZ1bmN0aW9uKCkge3JldHVybiAhJCgnI2J1bGtFZGl0JykuY2hpbGRyZW4oJy5idXR0b25fX3dhcm5pbmcnKS5oYXNDbGFzcygnaXMtaGlkZGVuJyk7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1wZW5jaWwtc3F1YXJlXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBNdWx0aSBFZGl0PC9zcGFuPjxzcGFuIGNsYXNzPVwiZHJvcGRvd25fX3dhcm5pbmdcIj48L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVNdWx0aUVkaXRCdXR0b25DbGljayxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI211bHRpRWRpdCcpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO30sXG4gICAgICAgICAgICB3YXJuaW5nOiBmdW5jdGlvbigpIHtyZXR1cm4gISQoJyNtdWx0aUVkaXQnKS5jaGlsZHJlbignLmJ1dHRvbl9fd2FybmluZycpLmhhc0NsYXNzKCdpcy1oaWRkZW4nKTt9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXRpbWVzLWNpcmNsZVwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgUmVtb3ZlPC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlQnVsa1JlbW92ZUNsaWNrLFxuICAgICAgICAgICAgZGlzYWJsZWQ6IGZ1bmN0aW9uKCkge3JldHVybiAkKCcjYnVsa1JlbW92ZScpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRpdmlkZXI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtdXBsb2FkXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBVcGxvYWQgZmlsZXM8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVVcGxvYWRGaWxlc0NsaWNrXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBcbiAgXG4gIC8vSW5pdCBwbGFjZWhvbGRlcnMgZm9yIGltYWdlcyBpZiBhbnkgKGNvdmVyLCBldGMuKVxuICB3aW5kb3cuaW1hZ2VQbGFjZWhvbGRlcnMgPSBpbml0SW1hZ2VQbGFjZWhvbGRlcnMoKTtcbiAgXG4gIC8vRm9jYWwgcG9pbnRcbiAgJCgnI2ZvY2FsUG9pbnRUb2dnbGUnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgLy9IaWRlIGZvY2FsIHJlY3RhbmdsZVxuICAgICQoJyNmb2NhbFJlY3RUb2dnbGUnKVxuICAgICAgLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUgYnV0dG9uX3N0eWxlX291dGxpbmUtYWNjZW50JylcbiAgICAgIC5hZGRDbGFzcygnYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKTtcbiAgICAkKCcjZm9jYWxSZWN0JykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICQoJy5wdXJwb3Nlc19fY29udGFpbmVyIC5wdXJwb3NlLmlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgXG4gICAgLy9DaGVjayB3aGV0aGVyIGZvY2FsIHBvaW50IGlzIGFjdGl2ZVxuICAgIGlmICgkKGUudGFyZ2V0KS5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHtcbiAgICAgICQoZS50YXJnZXQpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnaXMtYWN0aXZlIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWFjY2VudCcpXG4gICAgICAgIC5hZGRDbGFzcygnYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKTtcbiAgICAgICQoJyNmb2NhbFBvaW50JykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgaGlkZVVzYWdlUHJldmlld3MoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvL1NldCBmb2NhbCBwb2ludCB0b2dnbGUgYWN0aXZlXG4gICAgICAkKGUudGFyZ2V0KVxuICAgICAgICAuYWRkQ2xhc3MoJ2lzLWFjdGl2ZSBidXR0b25fc3R5bGVfb3V0bGluZS1hY2NlbnQnKVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2J1dHRvbl9zdHlsZV9vdXRsaW5lLXdoaXRlJyk7XG4gICAgICBzaG93VXNhZ2VQcmV2aWV3cygpO1xuICAgICAgJCgnI2ZvY2FsUG9pbnQnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG4gICAgfVxuICB9KTtcbiAgXG4gIC8vRm9jYWwgcmVjdGFuZ2xlXG4gICQoJyNmb2NhbFJlY3RUb2dnbGUnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgLy9IaWRlIGZvY2FsIHBvaW50XG4gICAgJCgnI2ZvY2FsUG9pbnRUb2dnbGUnKVxuICAgICAgLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUgYnV0dG9uX3N0eWxlX291dGxpbmUtYWNjZW50JylcbiAgICAgIC5hZGRDbGFzcygnYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKTtcbiAgICAkKCcjZm9jYWxQb2ludCcpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcbiAgXG4gICAgLy9DaGVjayB3aGV0aGVyIGZvY2FsIHBvaW50IGlzIGFjdGl2ZVxuICAgIGlmICgkKGUudGFyZ2V0KS5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHtcbiAgICAgICQoZS50YXJnZXQpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnaXMtYWN0aXZlIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWFjY2VudCcpXG4gICAgICAgIC5hZGRDbGFzcygnYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKTtcbiAgICAgICQoJyNmb2NhbFJlY3QnKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG4gICAgICBoaWRlVXNhZ2VQcmV2aWV3cygpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vU2V0IGZvY2FsIHBvaW50IHRvZ2dsZSBhY3RpdmVcbiAgICAgICQoZS50YXJnZXQpXG4gICAgICAgIC5hZGRDbGFzcygnaXMtYWN0aXZlIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWFjY2VudCcpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKTtcbiAgICAgIHNob3dVc2FnZVByZXZpZXdzKCk7XG4gICAgICAvLyBBZGp1c3QgcGxhY2VtZW50IGFuZCBzaXplIG9mIHJlY3RhbmdsZSBhY2NvcmRpbmcgcHVycG9zZSBzaXplXG4gICAgICAvLyBXZSBuZWVkIHRvIHdhaXQgc29tZSB0aW1lLCBzbyBpbWFnZSBwcmV2aWV3IHNpemUgY291bGQgYmUgY2FsY3VsYXRlZCBjb3JyZWN0XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgYWRqdXN0UmVjdCgkKCcucHVycG9zZXNfX2NvbnRhaW5lciAucHVycG9zZS1pbWcnKS5maXJzdCgpKTtcbiAgICAgICAgJCgnLnB1cnBvc2VzX19jb250YWluZXIgLnB1cnBvc2UtaW1nJykudW5iaW5kKCkuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIFx0XHRcdGFkanVzdFJlY3QoJChlLnRhcmdldCkpO1xuICAgIFx0XHR9KTtcbiAgICAgICAgJCgnI2ZvY2FsUmVjdCcpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcbiAgICAgIH0sIDMwMCk7XG4gICAgICAkKCcjcHVycG9zZVdyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6IDAgfSwgNjAwKTtcbiAgICB9XG4gIH0pO1xuICAvKiBIYW5kbGUgUHVycG9zZXMgc2Nyb2xsICovXG4gICQoJyNwdXJwb3NlV3JhcHBlcicpLnNjcm9sbChmdW5jdGlvbigpIHtcbiAgICBzZXRQdXJwb3NlUGFnaW5hdGlvbigpO1xuICB9KTtcbiAgJCgnLnB1cnBvc2VzX19sZWZ0JykudW5iaW5kKCdjbGljaycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAkKCcjcHVycG9zZVdyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6ICctPTQ4MCcgfSwgNjAwKTtcbiAgfSk7XG4gICQoJy5wdXJwb3Nlc19fcmlnaHQnKS51bmJpbmQoJ2NsaWNrJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICQoJyNwdXJwb3NlV3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogJys9NDgwJyB9LCA2MDApO1xuICB9KTtcbiAgLy9IZWxwZXIgZnVuY3Rpb24gdG8gY2hhbmdlIGNsYXNzZXMgYW5kIHNob3cgdXNhZ2UgcHJldmlld3NcbiAgZnVuY3Rpb24gc2hvd1VzYWdlUHJldmlld3MoKSB7XG4gICAgJCgnI2ZpbGVQcmV2aWV3JykuYWRkQ2xhc3MoJ2hhcy1wcmV2aWV3cycpO1xuICAgICQoJyNwdXJwb3NlcycpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcbiAgfVxuICBmdW5jdGlvbiBoaWRlVXNhZ2VQcmV2aWV3cygpIHtcbiAgICAkKCcjZmlsZVByZXZpZXcnKS5yZW1vdmVDbGFzcygnaGFzLXByZXZpZXdzJyk7XG4gICAgJCgnI3B1cnBvc2VzJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICB9XG4gIFxuICAkKCcjZm9jYWxQb2ludCcpLmRyYWdnYWJsZSh7XG4gICAgY29udGFpbm1lbnQ6IFwiI3ByZXZpZXdJbWdcIixcbiAgICBzY3JvbGw6IGZhbHNlICxcbiAgICBzdG9wOiBmdW5jdGlvbihlKSB7XG4gICAgICBhZGp1c3RGb2NhbFBvaW50KCk7XG4gICAgICBhZGp1c3RQdXJwb3NlKCQoZS50YXJnZXQpKTtcbiAgICAgIGRhdGFDaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICAvKiBJbml0IFB1cnBvc2UgUGFnaW5hdG9yICovXG4gIFxuICBmdW5jdGlvbiBzZXRQdXJwb3NlUGFnaW5hdGlvbigpIHtcbiAgICB2YXIgc2Nyb2xsT2Zmc2V0ID0gJCgnI3B1cnBvc2VXcmFwcGVyJykuc2Nyb2xsTGVmdCgpO1xuICAgIHZhciB3aWR0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwdXJwb3NlV3JhcHBlcicpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgIHZhciBmaXJzdEluZGV4ID0gTWF0aC5mbG9vcihzY3JvbGxPZmZzZXQvMTQwKSArIDE7XG4gICAgdmFyIGxhc3RJbmRleCA9IGZpcnN0SW5kZXggKyBNYXRoLnJvdW5kKHdpZHRoLzE0MCkgLSAxO1xuICAgIHZhciBjb3VudCA9ICQoJyNwdXJwb3NlV3JhcHBlciAucHVycG9zZScpLmxlbmd0aDtcbiAgXG4gICAgbGFzdEluZGV4ID0gbGFzdEluZGV4IDwgY291bnQgPyBsYXN0SW5kZXggOiBjb3VudDtcbiAgXG4gICAgJCgnI3AtcGFnaW5hdG9yJykudGV4dChmaXJzdEluZGV4ICsgJyDigJQgJyArIGxhc3RJbmRleCArICcgb2YgJyArIGNvdW50KTtcbiAgfVxuICBcbiAgJCgnI3Nob3dQcmV2aWV3JykuY2xpY2soc2hvd0FsbFByZXZpZXdzKTtcbiAgJCgnI2hpZGVQdXJwb3NlJykuY2xpY2soaGlkZUFsbFByZXZpZXdzKTtcbiAgJCgnI2xvYWRNb3JlJykuY2xpY2soaGFuZGxlU2hvd01vcmUpO1xuICBcbiAgXG4gIGZ1bmN0aW9uIGhhbmRsZVNob3dNb3JlKGUpIHtcbiAgICAkKFwiI3B1cnBvc2VzIC5jLVB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZS5oaWRkZW5cIikuc2xpY2UoMCwgNSkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgIGlmICgkKFwiI3B1cnBvc2VzIC5jLVB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZS5oaWRkZW5cIikubGVuZ3RoID09PSAwKSB7XG4gICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgfVxuICB9XG4gIFxuICBcbiAgLy9TZWxlY3RlZCBGaWxlcyBhY3Rpb25zXG4gICQoJyNidWxrRWRpdCcpLmNsaWNrKGhhbmRsZUJ1bGtFZGl0QnV0dG9uQ2xpY2spO1xuICAkKCcjbXVsdGlFZGl0JykuY2xpY2soaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2spO1xuICAkKCcjYnVsa1JlbW92ZScpLmNsaWNrKGhhbmRsZUJ1bGtSZW1vdmVDbGljayk7XG4gIFxuICBmdW5jdGlvbiBoYW5kbGVCdWxrUmVtb3ZlQ2xpY2soKSB7XG4gICAgdmFyIGZpbGVzVG9EZWxldGUgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKSxcbiAgICBpdGVtTmFtZSA9ICQoJy5tZW51IC5pcy1hY3RpdmUnKS50ZXh0KCkudG9Mb3dlckNhc2UoKSxcbiAgICBhc3NldExpYnJhcnkgPSBpdGVtTmFtZSA9PT0gJ2Fzc2V0IGxpYnJhcnknLFxuICAgIG1zZ1RpdGxlID0gYXNzZXRMaWJyYXJ5PyAnRGVsZXRlIEFzc2V0cz8nIDogJ1JlbW92ZSBBc3NldHM/JyxcbiAgICBtZXNnVGV4dCA9IGFzc2V0TGlicmFyeT8gJ1NlbGVjdGVkIGFzc2V0KHMpIHdpbGwgYmUgZGVsZXRlZCBmcm9tIHRoZSBhc3NldCBsaWJyYXJ5LiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoZW0/JyA6ICdTZWxlY3RlZCBhc3NldChzKSB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGlzICcgKyBpdGVtTmFtZSArICcuIERvbuKAmXQgd29ycnksIGl0IHdvbuKAmXQgYmUgZGVsZXRlZCBmcm9tIHRoZSBBc3NldCBMaWJyYXJ5LicsXG4gICAgYnRuTmFtZSA9IGFzc2V0TGlicmFyeT8gJ0RlbGV0ZScgOiAnUmVtb3ZlJztcbiAgICBuZXcgTW9kYWwoe1xuICAgICAgdGl0bGU6IG1zZ1RpdGxlLFxuICAgICAgdGV4dDogbWVzZ1RleHQsXG4gICAgICBjb25maXJtVGV4dDogYnRuTmFtZSxcbiAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICBmaWxlc1RvRGVsZXRlLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICAgICB2YXIgaWQgPSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG4gICAgICAgICAgZGVsZXRlRmlsZUJ5SWQoaWQsIGdhbGxlcnlPYmplY3RzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHVwZGF0ZUdhbGxlcnkoKTtcbiAgICAgIH0sXG4gICAgICBjYW5jZWxBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2JyJykucmVtb3ZlQ2xhc3MoJ3NicicpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIFxuICAvL0ZpbGUgRWRpdCBTYXZlIGFuZCBDYW5jZWxcbiAgJCgnI3NhdmVDaGFuZ2VzJykuY2xpY2soc2F2ZUltYWdlRWRpdCk7XG4gICQoJyNjYW5jZWxDaGFuZ2VzJykuY2xpY2soY2FuY2VsSW1hZ2VFZGl0KTtcbiAgJCgnI2ZwVG9wQ2xvc2VCdXR0b24nKS5jbGljayhjYW5jZWxJbWFnZUVkaXQpO1xuICBcbiAgLy9GaWxlIEVkaXQgZmllbGQgY2hhbmdlc1xuICAkKCcjdGl0bGUnKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKSB7c2F2ZVRpdGxlKCk7fSk7XG4gICQoJyNjYXB0aW9uJykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVDYXB0aW9uKCk7fSk7XG4gICQoJyNkZXNjcmlwdGlvbicpLm9uKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtzYXZlRGVzY3JpcHRpb24oKTt9KTtcbiAgJCgnI3Jlc29sdXRpb24nKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge3NhdmVSZXNvbHV0aW9uKCk7fSk7XG4gICQoJyNhbHRUZXh0Jykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVBbHRUZXh0KCk7fSk7XG4gIFxuICAvL0hhbmRsZSBzZWxlY3Rpb25zXG4gICQoJyNzZWxlY3RBbGwnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgaWYgKCQoZS50YXJnZXQpLmhhc0NsYXNzKCdlbXB0eScpKSB7XG4gICAgICBzZWxlY3RBbGwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVzZWxlY3RBbGwoKTtcbiAgICB9XG4gIH0pO1xuICAkKCcjZGVzZWxlY3RBbGwnKS5jbGljayhmdW5jdGlvbihlKSB7ZGVzZWxlY3RBbGwoKTt9KTtcbiAgXG4gIC8vSW5pdCBhZGRhYmxlIGZpZWxkc1xuICBpbml0QWRkYWJsZUZpZWxkcygpO1xuICBcbiAgXG4gIFxuICBcbiAgXG4gIC8vYXV0b2V4cGFuZGFibGUgdGV4dGFyZWFcbiAgJCggJ3RleHRhcmVhJyApLmVsYXN0aWMoKTtcbiAgXG4gIC8qXG4gICogQ2FyZHNcbiAgKi9cbiAgXG4gIC8vRm9sZGFibGUgY2FyZHNcbiAgJCgnLmpzLWZvbGRhYmxlIC5qcy1mb2xkZWRUb2dnbGUnKS5jbGljayhoYW5kbGVGb2xkZWRUb2dnbGVDbGljayk7XG4gIGZ1bmN0aW9uIGhhbmRsZUZvbGRlZFRvZ2dsZUNsaWNrKGUpIHtcbiAgICB2YXIgY2FyZCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5qcy1mb2xkYWJsZScpO1xuICAgIGlmIChjYXJkLmhhc0NsYXNzKCdpcy1mb2xkZWQnKSkge1xuICAgICAgY2FyZC5yZW1vdmVDbGFzcygnaXMtZm9sZGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhcmQuYWRkQ2xhc3MoJ2lzLWZvbGRlZCcpO1xuICAgIH1cbiAgfVxuICAvL1N0aWNreSBjYXJkIGhlYWRlclxuICAkKCcuanMtc3RpY2t5T25Nb2JpbGUnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgIHZhciBzdGlja3kgPSBuZXcgU3RpY2thYmxlKGVsLCB7XG4gICAgICBtYXhXaWR0aDogNjAwLFxuICAgICAgYm91bmRhcnk6IHRydWUsXG4gICAgICBvZmZzZXQ6IDUwXG4gICAgfSk7XG4gIH0pO1xuICAkKCcuanMtc2VjdGlvblRpdGxlJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICB2YXIgc3RpY2t5ID0gbmV3IFN0aWNrYWJsZShlbCwge1xuICAgICAgbWF4V2lkdGg6IDYwMCxcbiAgICAgIGJvdW5kYXJ5OiAnI21lZGlhLWNhcmQnLFxuICAgICAgb2Zmc2V0OiAxMDRcbiAgICB9KTtcbiAgfSk7XG4gIFxuICAvL0FuaW1hdGlvbiBlbmQgaGFuZGxlXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCBmdW5jdGlvbihlKSB7XG4gICAgc3dpdGNoIChlLmFuaW1hdGlvbk5hbWUpIHtcbiAgICAgIGNhc2UgJ2NvbGxlY3Rpb25JdGVtLXB1bHNlLW91dCc6XG4gICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnaXMtYXBwZWFyaW5nJyk7XG4gICAgICByZXR1cm4gZTtcbiAgXG4gICAgICBjYXNlICdpbWctd3JhcHBlci1zbGlkZS1sZWZ0JzpcbiAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdpcy1zbGlkaW5nTGVmdCcpO1xuICAgICAgcmV0dXJuIGU7XG4gIFxuICAgICAgY2FzZSAnaW1nLXdyYXBwZXItc2xpZGUtcmlnaHQnOlxuICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2lzLXNsaWRpbmdSaWdodCcpO1xuICAgICAgcmV0dXJuIGU7XG4gIFxuICAgICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBlO1xuICAgIH1cbiAgfSk7XG4gIFxuICBcbiAgXG4gIFxuICAvL1JlY3VycmluZyB0b2dnbGVcbiAgJCgnI3JlY3VycmluZ1RvZ2dsZScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGUudGFyZ2V0LmNoZWNrZWQpIHtcbiAgICAgICQoJyNyZWN1cmluZ1RpbWUnKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnI3JlY3VyaW5nVGltZScpLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgIH1cbiAgfSk7XG4gIFxuICBjb25zb2xlLmxvZyh3aW5kb3cuc2V0dGluZ3MpO1xuICBcbiAgaWYgKHdpbmRvdy5zZXR0aW5ncy5JU19NVlApIHtcbiAgICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcImlzLW12cFwiKTtcbiAgfVxuICBcbiAgXG4gIC8qXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgb3BlbkFzc2V0TGlicmFyeTogb3BlbkFzc2V0TGlicmFyeVxuICAgIH1cbiAgfVxuICAqL1xuXG4gIC8vVXBkYXRlIGZpbGVzXG4gIGluaXRHYWxsZXJ5KCk7XG5cbiAgJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5zZWN0aW9uX19maWxlcycpLmRpc2FibGVTZWxlY3Rpb24oKTtcbn0pOyJdLCJmaWxlIjoiYXNzZXQtbGlicmFyeS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
