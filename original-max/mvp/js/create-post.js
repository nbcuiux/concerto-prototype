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

//New Gallery Media tab
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

//Blurb section initializer
// Data
var postItems = [
  {
    type: 'title',
    title: 'Heading',
    iconClass: 'fa fa-header'
  },
  {
    type: 'text',
    title: 'Paragraph',
    iconClass: 'fa fa-paragraph'
  },
  {
    type: 'link',
    title: 'Embeded Link',
    iconClass: 'fa fa-code'
  },
  {
    type: 'file',
    title: 'Media File',
    iconClass: 'fa fa-picture-o'
  },
  {
    type: 'blurb',
    title: 'Blurb',
    iconClass: 'fa fa-list-alt'
  },
  {
    type: 'source',
    title: 'Source',
    iconClass: 'fa fa-copyright'
  },
  {
    type: 'user',
    title: 'Person',
    iconClass: 'fa fa-user'
  },
  {
    type: 'quote',
    title: 'Quote',
    iconClass: 'fa fa-quote-right'
  },
  {
    type: 'table',
    title: 'Table',
    iconClass: 'fa fa-table'
  },
  {
    type: 'map',
    title: 'Map',
    iconClass: 'fa fa-map-marker'
  },
  {
    type: 'gallery',
    title: 'Gallery',
    iconClass: 'fa fa-clone'
  },
  {
    type: 'list',
    title: 'List',
    iconClass: 'fa fa-list'
  },
  {
    type: 'news',
    title: 'Newsfeed',
    iconClass: 'fa fa-newspaper-o'
  },
  {
    type: 'graph',
    title: 'Chart',
    iconClass: 'fa fa-pie-chart'
  }
]

//For render blurb
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

  list.sortable({
    items: '.list__section',
    placeholder: 'list__placeholder',
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

  return list.append(section, addSection);
}

function renderSection(index, data) {
  var section = $('<div />').addClass('list__section'),
  sectionIndex = $('<div />').addClass('section__index').text('Blurb ' + index),
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
    label: 'Blurb Title'
  });
  var setionDescriptionInput = new Textfield(description.get(0), {
    label: 'Blurb Text'
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
    $(el).find('.section__index').text('Blurb ' + Math.round(index + 1))
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

function initBlogSection(section) {
  var thumbnails = $('<div />').addClass('post-item-thumbnails'),
      moreThumbnail = $('<div />').addClass('post-item-thumb post-item-thumb--post-card').click(function() {createNewItemOverlay(thumbnails);}),
      moreIcon = $('<i />').addClass('post-item-thumb__icon fa fa-ellipsis-h'),
      moreTitle = $('<div />').addClass('post-item-thumb__title').text('more'),
      items = $('<div />').addClass('post-items').attr('id', 'postItems');
  for (var i = 0; i < 4; i++) {
    thumbnails.append(renderPostItemThumbnail(postItems[i], thumbnails).addClass('post-item-thumb--post-card').removeClass('post-item-thumb--overlay'));
  }

  thumbnails.append(moreThumbnail.append(moreIcon, moreTitle));
  section.append(items, thumbnails);
  items.sortable({
    items: '.post-item__wrapper',
    placeholder: 'post-item__placeholder',
    forcePlaceholderSize: true,
    handle: '.post-item__title',
    start: function(e, ui) {
      ui.item.addClass('is-dragging').removeClass('is-dropped');
      $(e.target).css('height', $(e.target).height());
      $('body').css('height', $('body').height());
      $('.post-item__wrapper').addClass('in-dragging-mode');
    },
    stop: function(e, ui) {
      ui.item.removeClass('is-dragging').addClass('is-dropped');
      $(e.target).css('height', '');
      $('body').css('height', '');
      $('.post-item__wrapper').removeClass('in-dragging-mode');
    }
  })
  $('#createNewTemplate').click(createNewTemplateOverlay);
}

//
// Renders
//
function renderPostItem(item) {
  var itemWrapper = $('<div />').addClass('post-item__wrapper').attr('data-type', item.type),
      title = $('<div />').addClass('post-item__title').append($('<i />').addClass(item.iconClass), $('<span />').text(' ' + item.title)),
      remove = $('<div />').addClass('post-item__remove').click(handleRemoveItem),
      addNew = $('<div />').addClass('post-item__add-new').append($('<i />').addClass('fa fa-ellipsis-h')).click(handleAddNewClick),
      itemEl = $('<div />').addClass('post-item');

  return itemWrapper.append(itemEl.append(title, remove, renderPostItemContent(item.type)), addNew);
}
function renderPostItemContent(type) {
  var content = $('<div />').addClass('post-item__content');

  switch (type) {
    case 'source':
      var group = $('<div />').addClass('cg__controls cg__controls_style_row'),
          label = $('<input type="text" />').val('Source'),
          link = $('<input type="text" />');
      content.append(group.append(label.wrap('<div class="cg__control cg__control_style_row"></div>').parent(), link.wrap('<div class="cg__control cg__control_style_row"></div>').parent()));
      new Textfield(label.get(0), {label: 'Label'});
      new Textfield(link.get(0), {label: 'Link', placeholder: 'example.com/source-path'});
      break;

    case 'blurb':
      content.addClass('post-item__content--blurb').append(renderSectionContent(Date.now()).children());
      break;

    case 'title':
      var heading = $('<div />').addClass('post-content__heading');
      content.addClass('post-item__content--link').append(heading);
      headingEditor = new MediumEditor(heading.get(0), {
        toolbar: false,
        disableReturn: true,
        placeholder: {
          text: 'Type heading here'
        }
      });
      headingEditor.subscribe('editableInput', function(event, element) {
        if (element.innerHTML !== '') {heading.addClass('js-hasValue');}
        else {heading.removeClass('js-hasValue');}
      });
      break;

    case 'link':
      var linkField = $('<div />').addClass('post-content__textarea post-content__link'),
          linkPreview = $('<div />').addClass('post-content__preview');
      content.addClass('post-item__content--link').append(linkField, linkPreview);
      editor = new MediumEditor(linkField.get(0), {
        toolbar: false,
        placeholder: {
          text: 'Type your embeded link here'
        },
        paste: {
          forcePlainText: false
        }
      });
      //Embeded link preview
      editor.subscribe('editableInput', function(event, element) {
        if (element.innerHTML.includes('iframe') || element.innerHTML.includes('blockquote')) {
          regExp1 = /\&lt;/g;
          regExp2 = /\&gt;/g;
          innerHTML = element.innerHTML.replace(regExp1, '<').replace(regExp2, '>');
          if (!innerHTML.includes('iframe')) {innerHTML = '<iframe>' + innerHTML + '</iframe>';}

          linkPreview.html(innerHTML);
          linkPreview.addClass('has-preview js-hasValue');
          linkField.addClass('has-preview');
        } else {
          linkPreview.html('').removeClass('has-preview  js-hasValue');
          linkField.removeClass('has-preview');
        }
      })
      break;

    case 'file':
      var placeholder = $('<div />'),
          checkboxGroup = $('<div />').addClass('controls__group controls__group--toggle is-disabled').css('width', 'auto'),
          checkboxId = 'checkbox-' + Date.now(),
          checkbox = $('<input type="checkbox" />').addClass('toggle').attr('id', checkboxId),
          checkboxLabel = $('<label for="' + checkboxId + '" />').text('Autoplay');
      content.addClass('post-item__content--file').append(placeholder, checkboxGroup.append(checkbox, checkboxLabel));
      new ImagePlaceholder(placeholder.get(0), null, {
        alButton: 'Add File',
        onUpdate: function(p) {
          if (p.type === 'video') {checkboxGroup.removeClass('is-disabled');}
          else {checkboxGroup.addClass('is-disabled');}
        }
      });
      break;

    case 'text':
      var text = $('<div />').addClass('post-content__textarea');
      content.addClass('post-item__content--text').append(text);
      textEditor = new MediumEditor(text.get(0), {
        disableReturn: true,
        buttonLabels: 'fontawesome',
        toolbar: {
          buttons: ['bold', 'italic', 'anchor']
        }
      });
      textEditor.subscribe('editableInput', function(event, element) {
        if (element.innerHTML !== '') {heading.addClass('js-hasValue');}
        else {heading.removeClass('js-hasValue');}
      });
      break;
  }
  return content;
}
function renderTemplate(template, target) {
  var templateWrapper = $('<div />');
  template.items.forEach(function(item) {
    templateWrapper.append(renderPostItem(item));
  })
  return templateWrapper.children();
}
//
// Handlers
//
function handleAddNewClick(e) {
  var target = $(e.target).parents('.post-item__wrapper, .post-item-thumbnails');
  createNewItemOverlay(target);
}
function handleRemoveItem(e) {
  var item = $(e.target).parents('.post-item__wrapper');
  if (item.find('.js-hasValue').length > 0) {
    new Modal({
      dialog: true,
      title: 'Remove Item?',
      text: 'All item data will be lost. Are you sure you want to remove this item?',
      confirmText: 'Remove',
      confirmAction: function() {
        item.remove();
        checkItems();
      }
    })
  }
  else {
    item.remove();
    checkItems();
  }
}

//
// Helpers
//
//Check if there are a items on a blog page and change ui accordingly
function checkItems() {
  if ($('#postItems .post-item__wrapper').length > 0) {
    $('#createNewTemplate').removeClass('disabled').prop('disabled', false);
  } else {
    $('#createNewTemplate').addClass('disabled').prop('disabled', true);
  }
}

/*------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------- ADD ITEMS OVERLAY --------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------*/

function createNewItemOverlay(target) {
  var scrollPosition = $('body').scrollTop();
      overlay = $('<div />').addClass('modal modal--full').attr('id', 'newItemOverlay'),
      close = $('<div></div>').addClass('modal__close').click(function() {newOverlayClose(overlay, scrollPosition)}),
      thumbnails = $('<div />').addClass('post-item-thumbs'),

      sectionData = [
        {
          type: 'items',
          items: postItems
        }
      ];
  if (getTemplates()) {
    sectionData.push({
      type: 'templates',
      title: 'Templates',
      items: getTemplates()
    })
  }

  sectionData.forEach(function(section) {
    thumbnails.append(renderPostItemThumbnailSection(section, target))
  });

  $(document).on('keydown', function(e) {postDocumentKeydown(e, overlay, scrollPosition);});
  $('body').append(overlay.append(close, thumbnails));
  $('#wrapper').addClass('overflow');
}
function updateNewItemOverlay() {
  var thumbnails = $('.post-item-thumbs');
  thumbnails.empty();
  var sectionData = [
    {
      type: 'items',
      items: postItems
    }
  ];
  if (getTemplates()) {
    sectionData.push({
      type: 'templates',
      title: 'Templates',
      items: getTemplates()
    })
  }
  sectionData.forEach(function(section) {
    thumbnails.append(renderPostItemThumbnailSection(section, target))
  });
}
//
// Renders
//
function renderPostItemThumbnailSection(data, target) {
  var section = $('<div />').addClass('post-item-section post-item-section--' + data.type),
      title = $('<div />').addClass('post-item-section__title').text(data.title),
      items = $('<div />').addClass('post-item-section__items');

  data.items.forEach(function(item) {
    items.append(renderPostItemThumbnail(item, target));
  });

  return section.append(title, items);
}
function renderPostItemThumbnail(item, target) {
  var thumb = $('<div />').addClass('post-item-thumb post-item-thumb--overlay').attr('data-type', item.type).click(function(e) {itemThumbClick(e, item, target);});

  switch (item.type) {
    case 'template':
      var descriptionString = item.items.reduce(function(acc, itemData, i) {
        return i === 0 ? acc + itemData.title : acc + ', ' + itemData.title;
      }, ''),
          title = $('<div />').addClass('post-item-thumb__title').text(item.title),
          description = $('<div />').addClass('post-item-thumb__description').text(descriptionString),
          remove = $('<div />').addClass('post-item-thumb__remove').click(handleRemoveTemplateClick);
      return thumb.addClass('post-item-thumb--template').attr('data-id', item.id).append(title, description, remove);

    default:
      var icon = $('<i />').addClass('post-item-thumb__icon ' + item.iconClass),
          title = $('<div />').addClass('post-item-thumb__title').text(item.title);
      return thumb.addClass('post-item-thumb--item').append(icon, title);
  }
}

//
// Handlers
//
function handleRemoveTemplateClick(e) {
  new Modal({
    dialog: true,
    title: 'Remove Template?',
    text: 'All item data will be lost. Are you sure you want to remove this template?',
    confirmText: 'Remove',
    confirmAction: function() {
      var section = $(e.target).parents('.post-item-section');
      $(e.target).parents('.post-item-thumb').remove();
      removeTemplate(parseInt($(e.target).parents('.post-item-thumb').attr('data-id')));
      if (section.find('.post-item-thumb').length === 0) {
        section.remove();
      }
    },
    cancelAction: function() {} // Should be updated
  })
}

function itemThumbClick(e, item, target) {
  if (!$(e.target).hasClass('post-item-thumb__remove')) {
    var itemsToInsert;
    switch (item.type) {
      case 'template':
        itemsToInsert = renderTemplate(item);
        break;

      default:
        itemsToInsert = renderPostItem(item);
    }
    if (target.hasClass('post-item-thumbnails')) {
      $('#postItems').append(itemsToInsert);
    } else {
      target.after(itemsToInsert);
    }
    $('#newItemOverlay .modal__close').click();
    var itemBottomEnd = itemsToInsert.last().get(0).getBoundingClientRect().top + itemsToInsert.last().height();
    if (itemBottomEnd + 60 > $(window).height()) {
      $('body').animate( { scrollTop: '+=' + Math.round(itemBottomEnd + 60 - $(window).height()).toString() }, 400);
    }
    checkItems();
  }
}


/*------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------- TEMPLATES ----------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------*/

function createNewTemplateOverlay() {
  var scrollPosition = $('body').scrollTop();
      overlay = $('<div />').addClass('modal modal--full').attr('id', 'newTemplateOverlay'),
      close = $('<div></div>').addClass('modal__close').click(function() {newOverlayClose(overlay, scrollPosition)}),
      template = $('<div />').addClass('new-template'),
      titleField = $('<input type="text" required />').addClass('js-required is-required input__field_style_dark').attr('id', 'templateNameField'),
      itemElements = $('#postItems .post-item__wrapper'), //get items that user past into blog page
      items = itemElements.map(function(index, el) {
        return postItems.filter(function(item) {return item.type === $(el).attr('data-type')})[0]
      }).get(),
      controls = $('<div />').addClass('modal__controls modal__controls--bottom'),
      saveButton = $('<button disabled />').addClass('button button_style_fill-accent disabled').attr('id', 'saveTemplate').text('Create Template').click(function() {saveTemplateClick(overlay, scrollPosition);}),
      cancelButton = $('<button />').addClass('button button_style_outline-white').text('Cancel').click(function() {newOverlayClose(overlay, scrollPosition)});

  template.append(titleField, renderTemplateItemList(items));
  new Textfield(titleField.get(0), {
    label: 'Template Name',
    onInput: handleTemplateNameFieldInput,
    errMsg: 'Please fill the template name'
  });

  $(document).on('keydown', function(e) {postDocumentKeydown(e, overlay, scrollPosition);});
  $('body').append(overlay.append(close, template, controls.append(saveButton, cancelButton)));
  $('#wrapper').addClass('overflow');
}

//
// Store functions
//
function getTemplates() {
  if (window.localStorage.getItem('templates')) {
    return JSON.parse(window.localStorage.getItem('templates'));
  }
  return false;
}
function addTemplate(template) {
  var templates = getTemplates() || [];
  templates.push(template);
  window.localStorage.setItem('templates', JSON.stringify(templates));
}
function getTemplate(id) {
  return getTemplates() ? getTemplates().filter(function(t) {return t.id === id})[0] : false;
}
function removeTemplate(id) {
  var newTemplates = getTemplates().filter(function(t) {return t.id !== id});
  if (newTemplates.length > 0) {
    window.localStorage.setItem('templates', JSON.stringify(newTemplates));
    return true;
  } else {
    window.localStorage.removeItem('templates');
    return true;
  }
  return false;
}
function checkTemplateName(name) {
  return getTemplates() ? getTemplates().filter(function(t) {return t.title === name;}).lenght > 0 : false;
}

//
// Renders
//
function renderTemplateItemList(items) {
  var list = $('<div />').addClass('nt__list').attr('id', 'newTemplateItems');
  items.forEach(function(item) {
    list.append(renderTemplateItem(item));
  });
  return list;
}
function renderTemplateItem(item) {
  var itemEl = $('<div />').addClass('nt-item is-selected').attr('data-type', item.type).click(handleTemplateItemClick),
      checkmark = $('<div />').addClass('nt-item__checkmark'),
      title = $('<div />').addClass('nt-item__title').append($('<i />').addClass('nt-item__icon ' + item.iconClass), $('<span />').text(' ' + item.title));

  return itemEl.append(checkmark, title);
}

//
// Handlers
//
function handleTemplateItemClick(e) {
  var target = $(e.target).hasClass('nt-item') ? $(e.target) : $(e.target).parents('.nt-item');
  target.toggleClass('is-selected');
  checkTemplateItems();
}
function saveTemplateClick(overflow, scrollPosition) {
  var name = $('#templateNameField').val(),
      selectedItems = $('#newTemplateItems .nt-item.is-selected'),
      templateItems = selectedItems.map(function(index, el) {
        return postItems.filter(function(item) {return item.type === $(el).attr('data-type')})[0]
      }).get()

  addTemplate({
    title: name,
    type: 'template',
    items: templateItems,
    id: Date.now()
  });
  newOverlayClose(overlay, scrollPosition);
  showNotification('New template "' + name + '" was saved.')
}

function handleTemplateNameFieldInput(e) {
  if ($(e.target).val() !== '') {
    $('#saveTemplate').removeClass('disabled').prop('disabled', false);
  } else {
    $('#saveTemplate').addClass('disabled').prop('disabled', true);
  }
}

//
// Helpers
//
//Check if there are selected templates items on a overlay and change ui accordingly
function checkTemplateItems() {
  if ($('#newTemplateItems .nt-item.is-selected').length > 0 && $('#templateNameField').val() !== '') {
    $('#saveTemplate').removeClass('disabled').prop('disabled', false);
  } else {
    $('#saveTemplate').addClass('disabled').prop('disabled', true);
  }
}

/*------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------- COMMON -------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------*/


function newOverlayClose(overlay, scrollPosition) {
  overlay.remove();
  $(document).off('keydown');
  $('#wrapper').removeClass('overflow');
  if (scrollPosition) {
    $('body').scrollTop(scrollPosition);
  }
}
function postDocumentKeydown(e, overlay, scrollPosition) {
  if (e.keyCode === 27) {newOverlayClose(overlay, scrollPosition);}
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

//Collection initialization
// data
var collectionItems = [
    {
        title: 'Evil Handmade Instrument',
        id: 1,
        description: 'Photo from the episode "Evil Handmade Instrument"',
        type: 'gallery',
        series: 'Blindspot',
        season: '1',
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
        season: '1',
        episode: '5',
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
        season: '1',
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
        season: '1',
        episode: '5',
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
        season: '1',
        episode: '3',
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
        season: '1',
        episode: '5',
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
        season:'1',
        episode:'7',
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
        season: '1',
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
        season: '1',
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
        season: '1',
        episode: '5',
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
        season: '2',
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
        season: '2',
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
        season: '2',
        episode: '5',
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
        episode: '2',
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
        season: '2',
        episode: '1',
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
        season: '2',
        episode: '6',
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
        season: '1',
        episode: '3',
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
        season: '1',
        episode: '4',
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
        season: '1',
        episode: '5',
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
        season: '1',
        episode: '6',
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
        season: '1',
        episode: '7',
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
        season: '1',
        episode: '8',
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
        season: '1',
        episode: '9',
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
        season: '1',
        episode: '10',
        subtitle: 'Episode | Blindspot',
        img: '',
        target: 'create-episode.html'
    },

    // Slasher content

    {
        title: 'Slasher',
        id: 28,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Series',
        series: 'Slasher',
        season: '1',
        episode: '1',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher - Pilot',
        id: 40,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Episode',
        series: 'Slasher',
        season: '1',
        episode: '2',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher - Digging Your Grave with Your Teeth',
        id: 40,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Episode',
        series: 'Slasher',
        season: '1',
        episode: '3',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher - Like as Fire Eateth Up and Burneth Wood',
        id: 41,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Episode',
        series: 'Slasher',
        season: '1',
        episode: '4',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher - As Water Is Corrupted Unless It Moves',
        id: 42,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Episode',
        series: 'Slasher',
        season: '1',
        episode: '5',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher - Ill-Gotten Gains',
        id: 43,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Episode',
        series: 'Slasher',
        season: '1',
        episode: '7',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher - The One Who Sows His Own Flesh',
        id: 45,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Episode',
        series: 'Slasher',
        season: '1',
        episode: '6',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    }, 
    {
        title: 'Slasher - In the Pride of His Face',
        id: 46,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Episode',
        series: 'Slasher',
        season: '1',
        episode: '8',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    }, 
    {
        title: 'Slasher S1 E01',
        id: 47,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Video',
        series: 'Slasher',
        season: '1',
        episode: '1',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher S1 E02',
        id: 48,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Video',
        series: 'Slasher',
        season: '1',
        episode: '2',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    }, 
    {
        title: 'Slasher S1 E03',
        id: 49,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Video',
        series: 'Slasher',
        season: '1',
        episode: '3',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    }, 
    {
        title: 'Slasher S1 E04',
        id: 50,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Video',
        series: 'Slasher',
        season: '1',
        episode: '4',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },
{
        title: 'Slasher S1 E05',
        id: 51,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Video',
        series: 'Slasher',
        season: '1',
        episode: '5',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher S1 E06',
        id: 52,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Video',
        series: 'Slasher',
        season: '1',
        episode: '6',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    }, 
    {
        title: 'Slasher S1 E07',
        id: 53,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Video',
        series: 'Slasher',
        season: '1',
        episode: '7',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    }, 
    {
        title: 'Slasher S1 E08',
        id: 54,
        description: 'Katie McGrath (Jurassic World) stars as Sarah Bennett.',
        type: 'Video',
        series: 'Slasher',
        season: '1',
        episode: '8',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },     
    {
        title: 'Slasher_hero_2.png',
        id: 29,
        description: 'Brandon Jay McLaren (Graceland) stars as Dylan.',
        type: 'image',
        series: 'Slasher',
        season: '1',
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
        season: '1',
        episode: '1',
        img: 'img/doodle/Garry.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher-cast',
        id: 32,
        description: 'Cast collection for Slasher season 1.',
        type: 'cast',
        series: 'Slasher',
        season: '1',
        img: '',
        target: 'create-gallery.html'
    },
    {
        title: 'Slasher-preview-gallery',
        id: 33,
        description: 'Photo from the episode series premiere.',
        type: 'gallery',
        series: 'Slasher',
        season: '1',
        episode: '1',
        img: 'img/doodle/pyramids.png',
        target: 'create-gallery.html'
    },
    {
        title: 'Slasher-trailer',
        id: 34,
        description: 'Slasher: New Series Coming Soon',
        type: 'video',
        series: 'Slasher',
        season: '1',
        img: 'img/doodle/easter_island_2.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher - Episode 2',
        id: 35,
        description: 'See a sneak preview of next weeks episode',
        type: 'image',
        series: 'Slasher',
        season: '1',
        episode: '2',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher - Meet The Cast',
        id: 36,
        description: 'See brand new videos of the full Slasher cast behind the scenes!',
        type: 'image',
        series: 'Slasher',
        season: '1',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    },
    {
        title: 'Slasher - Episode 4',
        id: 37,
        description: 'Watch the latest episode of Slasher on your computer and mobile devices.',
        type: 'image',
        series: 'Slasher',
        season: '1',
        episode: '4',
        img: 'img/doodle/Teresa.png',
        target: 'create-episode.html'
    }
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
    var collectionSelectItem = itemComplexSelectbox(itemSelect.get(0));
    return itemRow;
}

function itemComplexSelectbox(el, data, callback, itemLabel) {
    var itemsData = data || collectionItems,
        itemCallback = callback || handleItemmClick;

    return new ComplexSelectbox(el, {
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
        var collectionSelectItem = itemComplexSelectbox(el.find('.js-selectbox').get(0), data, null, itemLabel);
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

function replaceComplexSelectboxWithCollectionRow(item, selectbox) {
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

    var collectionSelectItem = new ComplexSelectbox(collectionSelect.get(0), {
        label: 'Collection',
        placeholder: 'Select Collection',
        items: pageCollections
            .sort(function(a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
            })
            .map(createListItem),
        complexItems: true,
        sideNav: true,
        itemCallback: replaceComplexSelectboxWithCollectionRow,
        data: pageCollections,
        search: true
    });
}

function initOneCollectionSection(section, data) {
    var collectionSelect = $('<div></div>').addClass('js-selectbox');
    section.append(collectionSelect);

    var collectionSelectItem = new ComplexSelectbox(collectionSelect.get(0), {
        label: 'Collection Group',
        placeholder: 'Select Collection',
        items: pageCollections
            .sort(function(a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
            })
            .map(createListItem),
        complexItems: true,
        sideNav: true,
        itemCallback: replaceComplexSelectboxWithCollectionRow,
        data: pageCollections,
        search: true
    });
}

function initWebsiteCollectionSection(section, data) {
    var collectionSelect = $('<div></div>').addClass('js-selectbox');
    section.append(collectionSelect);

    var collectionSelectItem = new ComplexSelectbox(collectionSelect.get(0), {
        label: 'Website Collection',
        placeholder: 'Select Collection',
        items: pageCollections
            .sort(function(a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
            })
            .map(createListItem),
        complexItems: true,
        sideNav: true,
        itemCallback: replaceComplexSelectboxWithCollectionRow,
        data: pageCollections,
        search: true
    });
}

function initRokuCollectionSection(section, data) {
    var collectionSelect = $('<div></div>').addClass('js-selectbox');
    section.append(collectionSelect);

    var collectionSelectItem = new ComplexSelectbox(collectionSelect.get(0), {
        label: 'Roku Collection',
        placeholder: 'Select Collection',
        items: pageCollections
            .sort(function(a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
            })
            .map(createListItem),
        complexItems: true,
        sideNav: true,
        itemCallback: replaceComplexSelectboxWithCollectionRow,
        data: pageCollections,
        search: true
    });
}

function initAndroidCollectionSection(section, data) {
    var collectionSelect = $('<div></div>').addClass('js-selectbox');
    section.append(collectionSelect);

    var collectionSelectItem = new ComplexSelectbox(collectionSelect.get(0), {
        label: 'Android Collection',
        placeholder: 'Select Collection',
        items: pageCollections
            .sort(function(a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
            })
            .map(createListItem),
        complexItems: true,
        sideNav: true,
        itemCallback: replaceComplexSelectboxWithCollectionRow,
        data: pageCollections,
        search: true
    });
}

//Persons data
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

//New Gallery Media tab

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
  fileDelete = $('<div></div>').addClass('file__delete');
  fileType = fileTypeElement(fileData), 
  fileEdit = $('<button>Edit</button>').addClass('button button button_style_outline-white').click(handleFiledEditButtonClick),

  fileTitle = $('<div></div>').addClass('file__title file__title--media-card').text(fileData.title),

  //fileCaption = $('<textarea></textarea>').addClass('file__caption file__caption_main').val(fileData.caption),

  filePurpose = $('<div></div>').addClass('file__purpose'),
  filePurposeSelect = $('<div></div>');

  fileEditButton = $('<button>Edit</button>').addClass('button button button_style_outline-gray u-visible-xs u-noMargin').click(handleFiledEditButtonClick);

  fileControls.append(fileCheckmark, fileDelete, fileType, fileEdit);
  fileImg.append(fileControls);

  filePurpose.append(filePurposeSelect, fileEditButton);

  fileDelete.click(function() {
    deleteFileById(fileData.id, galleryObjects);
    updateGallery();
  });
  
  //console.log(fileData.usage, disabledItems, disabledItems.filter(function(item) {return item !== fileData.usage}))
  var purposeSelect = new Selectbox(filePurposeSelect.get(0), {
    label: 'Usage',
    placeholder: 'Select Usage',
    items: ['Logo', 'Primary', 'Secondary','Cover', 'Header', 'Background', 'Roku - Small', 'Roku - Large', 'Trailer', 'Episode'],
    selectedItem: fileData.usage,
    disabledItems: fileData.usage && fileData.usage !== '' ? disabledItems.filter(function(item) {return item !== fileData.usage}) : disabledItems,
    itemCallback: function(item, selectbox) {
      handleUsageSelect(item, selectbox, fileData.id);
    }
  });

  file.append(fileIndex, fileImg, fileTitle, filePurpose, fileEditButton);

  return file;
}

function addFile(file) {
  var fileSection = $('.files .section__files').get(0);
  $(fileSection).append(file);
}

function handleUsageSelect(item, selectbox, id) {
  console.log("Entered handle usage select");
  var usage = '';
  var prevUsage = '';
  if (selectbox.activeItem > -1) {
    usage = selectbox.options.items[selectbox.activeItem];
    galleryObjects.forEach(function(f) {
      console.log("Gallery item:", f);
      if (f.fileData.id === id) {
        prevUsage = f.fileData.usage;
        f.fileData.usage = usage;
      }
    });
    disabledItems.push(usage);
    if (prevUsage) {
      disabledItems.splice(disabledItems.indexOf(prevUsage), 1);
    }
  } else {
    galleryObjects.forEach(function(f) {
      if (f.fileData.id === id) {
        usage = f.fileData.usage;
        f.fileData.usage = undefined;
      }
    });
    if (usage !== '') {
      disabledItems.splice(disabledItems.indexOf(usage), 1);
    }
  }
  updateGallery();
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



  if (window.addedMediaItemsCallback) {
    window.addedMediaItemsCallback();
  }

}


$(document).ready(function() {
  //Common init functions for all pages
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

  console.log(window.commonInit);


  //Post title and title input
  if ($('#postTitleInput').get(0)) {
    var postTitleInput = new Textfield($('#postTitleInput').get(0), {
      label: 'Title',
      helpText: 'Mauris malesuada nibh nec leo porta maximus.',
      errMsg: 'Please fill the title',
      onInput: function(e) {
        $('#postTitleText').text(e.target.value || 'New Post');
        if (e.target.value !== '') {
          $('.header__subhead').removeClass('is-hidden');
        } else {
          $('.header__subhead').addClass('is-hidden');
        }
      }
    });
  }

  //Init blurb section
  if ($('#postList').length > 0) {
    initBlogSection($('#postList'));
  }

  //Init Association section
  if ($('#collectionSeriesSection').find('.controls__group').length > 0) {
    initSeriesSection($('#collectionSeriesSection').find('.controls__group'));
  }

  //Init Related posts collection
  if ($('#pageCollectionSection').find('.controls__group').length > 0) {
    initOneCollectionSection($('#pageCollectionSection').find('.controls__group'));
  }
  
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcmVhdGUtcG9zdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvL0NvbW1vbiBqcyBmaWxlc1xuLy9NZW51XG5mdW5jdGlvbiBub3JtaWxpemVNZW51KCkge1xuICB2YXIgcGFnZU5hbWUgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnLycpLnBvcCgpLFxuICBtZW51SXRlbXMgPSAkKCcuanMtbWVudSAuanMtbWVudUl0ZW0nKTtcbiAgYWN0aXZlTWVudUl0ZW0gPSAkKCdbZGF0YS10YXJnZXQ9XCInICsgcGFnZU5hbWUgKyAnXCJdJyk7XG5cbiAgbWVudUl0ZW1zLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKS5jbGljayhoYW5kbGVNZW51SXRlbUNsaWNrKTtcbiAgYWN0aXZlTWVudUl0ZW0uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICBhY3RpdmVNZW51SXRlbS5wYXJlbnRzKCcubWVudV9faXRlbScpLmFkZENsYXNzKCdpcy1vcGVuJyk7XG59XG5mdW5jdGlvbiBoYW5kbGVNZW51SXRlbUNsaWNrKGUpIHtcbiAgaWYgKCQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFyZ2V0JykpIHtcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignY3JlYXRlJykgPj0gMCAmJiAhZHJhZnRJc1NhdmVkICYmICQoJy5qcy1jb250ZW50IC5maWxlLCAuanMtY29udGVudCAuanMtaGFzVmFsdWUnKS5sZW5ndGggPiAwKSB7XG4gICAgICBuZXcgTW9kYWwoe1xuICAgICAgICB0aXRsZTogJ0xlYXZlIFBhZ2U/JyxcbiAgICAgICAgdGV4dDogJ1lvdSB3aWxsIGxvc2UgYWxsIHRoZSB1bnNhdmVkIGNoYW5nZXMuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBsZWF2ZSB0aGlzIHBhZ2U/JyxcbiAgICAgICAgY29uZmlybVRleHQ6ICdMZWF2ZSBQYWdlJyxcbiAgICAgICAgY29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhcmdldCcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhcmdldCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoJChlLnRhcmdldCkucGFyZW50cygnLm1lbnVfX2l0ZW0nKS5oYXNDbGFzcygnaXMtb3BlbicpKSB7XG4gICAgICAkKGUudGFyZ2V0KS5wYXJlbnRzKCcubWVudV9faXRlbScpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJy5tZW51X19pdGVtJykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICAgICQoZS50YXJnZXQpLnBhcmVudHMoJy5tZW51X19pdGVtJykuYWRkQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICB9XG4gIH1cbn1cblxuJCgnI21lbnVUb2dnbGUnKS5jbGljayhvcGVuTWVudSk7XG4kKCcuanMtbWVudSA+IC5qcy1jbG9zZScpLmNsaWNrKGNsb3NlTWVudSk7XG5cbmZ1bmN0aW9uIG9wZW5NZW51KGUpIHtcbiAgJCgnLmpzLW1lbnUnKS5hZGRDbGFzcygnaXMtb3BlbicpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2xvc2VNZW51KTtcbn1cbmZ1bmN0aW9uIGNsb3NlTWVudShlKSB7XG4gIGlmICgkKGUudGFyZ2V0KS5wYXJlbnRzKCcubWVudV9fbGlzdCcpLmxlbmd0aCA9PT0gMCkge1xuICAgICQoJy5qcy1tZW51JykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2xvc2VNZW51KTtcbiAgfVxufVxuXG4vL3NlbGVjdGlvblxuXG5mdW5jdGlvbiB0b2dnbGVGaWxlU2VsZWN0KGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR2YXIgZmlsZSA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJyksXG5cdFx0ZmlsZXNTZWN0aW9uID0gZmlsZS5wYXJlbnQoKSxcblx0XHRmaWxlcyA9IGZpbGVzU2VjdGlvbi5jaGlsZHJlbignLmZpbGUnKSxcblx0XHRzZWxlY3RlZEZpbGVzID0gZmlsZXNTZWN0aW9uLmNoaWxkcmVuKCcuZmlsZS5zZWxlY3RlZCcpLFxuXHRcdHNpbmdsZSA9IHNpbmdsZXNlbGVjdCB8fCBmYWxzZTtcblxuXHRpZiAoc2luZ2xlKSB7XG5cdFx0aWYgKGZpbGUuaGFzQ2xhc3MoJ3NlbGVjdGVkJykpIHtcblx0XHRcdGZpbGUucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZpbGVzU2VjdGlvbi5maW5kKCcuZmlsZScpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0ZmlsZS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Ly9DaGVjayBpZiB1c2VyIGhvbGQgU2hpZnQgS2V5XG5cdFx0aWYgKGUuc2hpZnRLZXkpIHtcblx0XHRcdGlmIChmaWxlLmhhc0NsYXNzKCdzZWxlY3RlZCcpKSB7XG5cdFx0XHRcdGZpbGUucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKHNlbGVjdGVkRmlsZXMpIHtcblx0XHRcdFx0XHR2YXIgZmlsZUluZGV4ID0gZmlsZS5pbmRleCgnLmZpbGUnKSxcblx0XHRcdFx0XHRcdGZpbGVzVG9CZVNlbGVjdCA9IGZpbGVzLnNsaWNlKGxhc3RTZWxlY3RlZCwgZmlsZUluZGV4ICsgMSk7XG5cblx0XHRcdFx0XHRpZiAobGFzdFNlbGVjdGVkID4gZmlsZUluZGV4KSB7XG5cdFx0XHRcdFx0XHRmaWxlc1RvQmVTZWxlY3QgPSBmaWxlcy5zbGljZShmaWxlSW5kZXgsIGxhc3RTZWxlY3RlZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZpbGVzVG9CZVNlbGVjdC5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHRcdFx0XHRmaWxlc1RvQmVTZWxlY3QucmVtb3ZlQ2xhc3MoJ2lzLXByZXNlbGVjdGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ZmlsZS50b2dnbGVDbGFzcygnc2VsZWN0ZWQgaXMtcHJlc2VsZWN0ZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGZpbGUudG9nZ2xlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0fVxuXHRcdGxhc3RTZWxlY3RlZCA9IGZpbGUuaW5kZXgoKTtcblx0XHRub3JtYWxpemVTZWxlY3RlaW9uKCk7XG5cdH1cbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZVNlbGVjdGVpb24oKSB7XG5cdHZhciBidWxrRGVsZXRlQnV0dG9uID0gJCgnI2J1bGtSZW1vdmUnKSxcblx0XHRidWxrRWRpdEJ1dHRvbiA9ICQoJyNidWxrRWRpdCcpLFxuXHRcdG11bHRpRWRpdEJ1dHRvbiA9ICQoJyNtdWx0aUVkaXQnKSxcblx0XHRtb3JlQWN0aW9uc0J1dHRvbiA9ICQoJyNtb3JlQWN0aW9ucycpLFxuXG5cdFx0c2VsZWN0QWxsQnV0dG9uID0gJCgnI3NlbGVjdEFsbCcpLFxuXHRcdHNlbGVjdEFsbExhYmVsID0gJCgnI3NlbGVjdEFsbExhYmVsJyksXG5cblx0XHRkZXNlbGVjdEFsbEJ1dHRvbiA9ICQoJyNkZXNlbGVjdEFsbCcpLFxuXHRcdGRlc2VsZWN0QWxsTGFiZWwgPSAkKCcjZGVzZWxlY3RBbGxMYWJlbCcpLFxuXG5cdFx0ZGVsZXRlQnV0dG9ucyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZSAuZmlsZV9fZGVsZXRlJyksXG5cdFx0ZWRpdEJ1dHRvbnMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUgLmJ1dHRvbicpLm5vdCgnLmMtRmlsZS1jb3ZlclRvZ2xlJyksXG5cdFx0YXJyYW5nZW1lbnRzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlIC5maWxlX19hcnJhZ2VtZW50JyksXG5cdFx0YXJyYW5nZW1lbnRJbnB1dHMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUgLmZpbGVfX2FycmFnZW1lbnQnKS5maW5kKCdpbnB1dCcpLFxuXHRcdHNldENvdmVyQnV0dG9ucyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZSBidXR0b24uYy1GaWxlLWNvdmVyVG9nbGUnKSxcblxuXHRcdHNlbGVjdGVkRGVsZXRlQnV0dG9uID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkIC5maWxlX19kZWxldGUnKSxcblx0XHRzZWxlY3RlZEVkaXRCdXR0b24gPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQgLmJ1dHRvbicpLFxuXHRcdHNlbGVjdGVkQXJyYW5nZW1lbnQgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQgLmZpbGVfX2FycmFnZW1lbnQnKSxcblx0XHRzZWxlY3RlZEFycmFuZ2VtZW50SW5wdXQgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQgLmZpbGVfX2FycmFnZW1lbnQnKS5maW5kKCdpbnB1dCcpLFxuXHRcdHNlbGVjdGVkU2V0Q292ZXJCdXR0b25zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkIGJ1dHRvbi5jLUZpbGUtY292ZXJUb2dsZScpLFxuXG5cdFx0bnVtYmVyT2ZGaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZScpLmxlbmd0aCxcblx0XHRudW1iZXJPZlNlbGVjdGVkRmlsZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKS5sZW5ndGgsXG5cdFx0bnVtYmVyT2ZTZWxlY3RlZEltYWdlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5qcy1pbWdGaWxlVHlwZS5zZWxlY3RlZCcpLmxlbmd0aCxcblx0XHRudW1iZXJPZlNlbGVjdGVkVmlkZW9zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLXZpZGVvRmlsZVR5cGUuc2VsZWN0ZWQnKS5sZW5ndGg7XG5cblx0XHR1bnNlbGVjdGVkRmlsZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUnKS5ub3QoJy5zZWxlY3RlZCcpO1xuXG5cdC8vTm8gc2VsZWN0ZWQgZmlsZXNcblx0aWYgKG51bWJlck9mU2VsZWN0ZWRGaWxlcyA9PT0gMCkge1xuXHRcdHNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnYWxsIGRpc2FibGVkJykuYWRkQ2xhc3MoJ2VtcHR5Jyk7XG5cdFx0c2VsZWN0QWxsTGFiZWwudGV4dCgnU2VsZWN0IEFsbCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXG5cdFx0ZGVzZWxlY3RBbGxCdXR0b24ucmVtb3ZlQ2xhc3MoJ2lzLWFsbCcpLmFkZENsYXNzKCdpcy1lbXB0eSBkaXNhYmxlZCcpO1xuXHRcdGRlc2VsZWN0QWxsTGFiZWwuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cblx0XHRidWxrRGVsZXRlQnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0YnVsa0VkaXRCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRidWxrRWRpdEJ1dHRvbi5maW5kKCcuYnV0dG9uX193YXJuaW5nJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHRcdG11bHRpRWRpdEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdG1vcmVBY3Rpb25zQnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cblx0XHRlZGl0QnV0dG9ucy5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0ZGVsZXRlQnV0dG9ucy5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0YXJyYW5nZW1lbnRzLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdGFycmFuZ2VtZW50SW5wdXRzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdHNldENvdmVyQnV0dG9ucy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcblxuXHRcdHVuc2VsZWN0ZWRGaWxlcy5yZW1vdmVDbGFzcygnaXMtcHJlc2VsZWN0ZWQnKTtcblxuXHRcdGlmICgkKCcjYXNzZXRzLWNvdW50JykubGVuZ3RoID4gMCkge25vcm1hbGl6ZUFzc2V0c0NvdW50KCk7fVxuXG5cdFx0aWYgKG51bWJlck9mRmlsZXMgPT09IDApIHtcblx0XHRcdHNlbGVjdEFsbEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdHNlbGVjdEFsbExhYmVsLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXG5cdFx0XHRkZXNlbGVjdEFsbEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdGRlc2VsZWN0QWxsTGFiZWwuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0fVxuXHR9XG5cdC8vU29tZSBmaWxlcyBhcmUgc2VsZWN0ZWRcblx0ZWxzZSBpZiAobnVtYmVyT2ZTZWxlY3RlZEZpbGVzID4gMCkge1xuXHRcdHNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnZW1wdHkgYWxsJyk7XG5cdFx0c2VsZWN0QWxsTGFiZWwudGV4dCgnRGVzZWxlY3QgQWxsJyk7XG5cblx0XHRkZXNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnaXMtZW1wdHkgaXMtYWxsIGRpc2FibGVkJyk7XG5cdFx0ZGVzZWxlY3RBbGxMYWJlbC5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblxuXG5cdFx0YnVsa0RlbGV0ZUJ1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRidWxrRWRpdEJ1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRtdWx0aUVkaXRCdXR0b24ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0bW9yZUFjdGlvbnNCdXR0b24ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cblx0XHRlZGl0QnV0dG9ucy5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0ZGVsZXRlQnV0dG9ucy5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0YXJyYW5nZW1lbnRzLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdGFycmFuZ2VtZW50SW5wdXRzLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0c2V0Q292ZXJCdXR0b25zLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSkuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG5cblx0XHR1bnNlbGVjdGVkRmlsZXMuYWRkQ2xhc3MoJ2lzLXByZXNlbGVjdGVkJyk7XG5cblx0XHRpZiAoJCgnI2Fzc2V0cy1jb3VudCcpLmxlbmd0aCA+IDApIHtcblx0XHRcdCQoJyNhc3NldHMtY291bnQnKS50ZXh0KG51bWJlck9mU2VsZWN0ZWRGaWxlcy50b1N0cmluZygpICsgJyBvZiAnICsgZ2FsbGVyeU9iamVjdHMubGVuZ3RoICsgJyBzZWxlY3RlZCcpO1xuXHRcdH1cblxuXHRcdGlmIChudW1iZXJPZlNlbGVjdGVkVmlkZW9zICYmIG51bWJlck9mU2VsZWN0ZWRJbWFnZXMpIHtcblx0XHRcdGJ1bGtFZGl0QnV0dG9uLmZpbmQoJy5idXR0b25fX3dhcm5pbmcnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG5cdFx0XHRtdWx0aUVkaXRCdXR0b24uZmluZCgnLmJ1dHRvbl9fd2FybmluZycpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YnVsa0VkaXRCdXR0b24uZmluZCgnLmJ1dHRvbl9fd2FybmluZycpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcblx0XHRcdG11bHRpRWRpdEJ1dHRvbi5maW5kKCcuYnV0dG9uX193YXJuaW5nJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHRcdH1cblxuXHRcdC8vT25seSBvbmUgZmlsZSBzZWxlY3RlZFxuXHRcdGlmIChudW1iZXJPZlNlbGVjdGVkRmlsZXMgPT09IDEpIHtcblx0XHRcdGJ1bGtFZGl0QnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0XHRtdWx0aUVkaXRCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRcdC8vbW9yZUFjdGlvbnNCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblxuXHRcdFx0c2VsZWN0ZWRFZGl0QnV0dG9uLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRcdHNlbGVjdGVkRGVsZXRlQnV0dG9uLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRcdHNlbGVjdGVkQXJyYW5nZW1lbnQucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHRzZWxlY3RlZEFycmFuZ2VtZW50SW5wdXQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0XHRzZWxlY3RlZFNldENvdmVyQnV0dG9ucy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcblx0XHR9XG5cdFx0Ly9BbGwgZmlsZXMgYXJlIHNlbGVjdGVkXG5cdFx0aWYgKG51bWJlck9mU2VsZWN0ZWRGaWxlcyA9PT0gbnVtYmVyT2ZGaWxlcykge1xuXHRcdFx0c2VsZWN0QWxsQnV0dG9uLnJlbW92ZUNsYXNzKCdlbXB0eScpLmFkZENsYXNzKCdhbGwnKTtcblx0XHRcdGRlc2VsZWN0QWxsQnV0dG9uLnJlbW92ZUNsYXNzKCdpcy1lbXB0eScpLmFkZENsYXNzKCdpcy1hbGwnKTtcblx0XHR9XG5cdH1cbn1cbmZ1bmN0aW9uIHNlbGVjdEFsbCgpIHtcblx0JCgnLmpzLWNvbnRlbnQgLmZpbGUnKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcblx0bm9ybWFsaXplU2VsZWN0ZWlvbigpO1xufVxuZnVuY3Rpb24gZGVzZWxlY3RBbGwoKSB7XG5cdCQoJy5qcy1jb250ZW50IC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdG5vcm1hbGl6ZVNlbGVjdGVpb24oKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQXNzZXRzQ291bnQoKSB7XG5cdGlmIChnYWxsZXJ5T2JqZWN0cy5sZW5ndGgpIHtcblx0XHQkKCcjYXNzZXRzLWNvdW50JykudGV4dChnYWxsZXJ5T2JqZWN0cy5sZW5ndGggKyAnIGFzc2V0cycpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcblx0fSBlbHNlIHtcblx0XHQkKCcjYXNzZXRzLWNvdW50JykudGV4dCgnJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHR9XG59XG5cbi8vTm90aWZpY2F0aW9uc1xuZnVuY3Rpb24gc2hvd05vdGlmaWNhdGlvbih0ZXh0LCB0b3ApIHtcbiAgICB2YXIgbm90aWZpY2F0aW9uID0gJCgnLm5vdGlmaWNhdGlvbicpLFxuICAgICAgICBub3RpZmljYXRpb25UZXh0ID0gJCgnLm5vdGlmaWNhdGlvbl9fdGV4dCcpO1xuXG4gICAgaWYgKG5vdGlmaWNhdGlvbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbm90aWZpY2F0aW9uID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbm90aWZpY2F0aW9uJyk7XG4gICAgICAgIG5vdGlmaWNhdGlvblRleHQgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdub3RpZmljYXRpb25fX3RleHQnKTtcbiAgICAgICAgbm90aWZpY2F0aW9uLmFwcGVuZChub3RpZmljYXRpb25UZXh0KTtcbiAgICB9XG5cbiAgICBpZiAoJCgnLm1vZGFsJykubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoISQoJy5tb2RhbCAucHJldmlldycpLmhhc0NsYXNzKCdoaWRkZW4nKSkge1xuICAgICAgICAgICAgJCgnLm1vZGFsIC5wcmV2aWV3JykuYXBwZW5kKG5vdGlmaWNhdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcubW9kYWwnKS5hcHBlbmQobm90aWZpY2F0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgfSBlbHNlIGlmKCQoJy5jdCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJCgnLmN0JykuYXBwZW5kKG5vdGlmaWNhdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnYm9keScpLmFwcGVuZChub3RpZmljYXRpb24pO1xuICAgIH1cblxuICAgIGlmICh0b3ApIHtub3RpZmljYXRpb24uY3NzKCd0b3AnLCB0b3ApO31cbiAgICBub3RpZmljYXRpb25UZXh0LnRleHQodGV4dCk7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIG5vdGlmaWNhdGlvbi5yZW1vdmUoKTtcbiAgICB9LCA0MDAwKTtcbn1cblxuLy9GaWxlIGZ1bmN0aW9uc1xudmFyIGdhbGxlcnlDYXB0aW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBoYW5kbGVDYXB0aW9uRWRpdChlKSB7XG4gICAgdmFyIGZpbGVFbGVtZW50ID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKSxcbiAgICAgICAgZmlsZUlkID0gZmlsZUVsZW1lbnQuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpLFxuICAgICAgICB0b2dnbGUgPSBmaWxlRWxlbWVudC5maW5kKCcuZmlsZV9fY2FwdGlvbi10b2dnbGUgLnRvZ2dsZScpLFxuICAgICAgICBmaWxlID0gZ2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgIHJldHVybiBmLmZpbGVEYXRhLmlkID09PSBmaWxlSWQ7XG4gICAgICAgIH0pWzBdLFxuXG4gICAgICAgIHRvZ2dsZUNoZWNrZWQgPSAkKGUudGFyZ2V0KS52YWwoKSA9PT0gZmlsZS5maWxlRGF0YS5jYXB0aW9uICYmIGZpbGUuZmlsZURhdGEuY2FwdGlvbjsgLy9JZiB0ZXh0ZmllbGQgZXF1YWxzIHRoZSBmaWxlIGNhcHRpb24gYW5kIGZpbGUgY2FwdGlvbiBub3QgZW1wdHlcblxuICAgIC8vU2F2ZSBjYXB0aW9uIHRvIGdhbGxlcnlDYXB0aW9uc1xuICAgIGZpbGUuY2FwdGlvbiA9ICQoZS50YXJnZXQpLnZhbCgpO1xuXG4gICAgdG9nZ2xlLnByb3AoJ2NoZWNrZWQnLCB0b2dnbGVDaGVja2VkKTtcbiAgICBjbG9zZVRvb2x0aXAoKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZUNhcHRpb25Ub2dnbGVDbGljayhlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB2YXIgZmlsZSA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJyksXG4gICAgICAgIGZpbGVJZCA9IGZpbGUuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpLFxuICAgICAgICB0ZXh0YXJlYSA9IGZpbGUuZmluZCgnLmZpbGVfX2NhcHRpb24tdGV4dGFyZWEnKSxcbiAgICAgICAgb3JpZ2luYWxGaWxlID0gZmlsZUJ5SWQoZmlsZUlkLCBnYWxsZXJ5T2JqZWN0cyk7XG5cbiAgICBpZiAoJChlLnRhcmdldCkucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgIHRleHRhcmVhLnZhbChvcmlnaW5hbEZpbGUuZmlsZURhdGEuY2FwdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dGFyZWEuZm9jdXMoKTtcbiAgICB9XG59XG5mdW5jdGlvbiBoYW5kbGVDYXB0aW9uU3RhcnRFZGl0aW5nKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHZhciB0b29sdGlwVGV4dCA9ICdUaGlzIGNhcHRpb24gd2lsbCBvbmx5IGFwcGx5IHRvIHlvdXIgZ2FsbGVyeSBhbmQgbm90IHRvIHRoZSBpbWFnZSBhc3NldC4nO1xuICAgIGlmICghd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b29sdGlwJykpIHtcbiAgICAgICAgY3JlYXRlVG9vbHRpcCgkKGUudGFyZ2V0KSwgdG9vbHRpcFRleHQpO1xuICAgIH1cbn1cbi8vIENoYW5nZSBlbGVtZW50IGluZGV4ZXMgdG8gYW4gYWN0dWFsIG9uZXNcbmZ1bmN0aW9uIG5vcm1hbGl6ZUluZGV4KCkge1xuICAgIHZhciBmaWxlcyA9ICQoJy5qcy1maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKTtcblxuICAgIGZpbGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICQoZWwpLmZpbmQoJy5maWxlX19hcmFnZW1lbnQtaW5wdXQnKS50ZXh0KGluZGV4ICsgMSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUluZGV4RmllbGRDaGFuZ2UoZSkge1xuICAgIHZhciBsZW5ndGggPSAkKCcuanMtZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlJykubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IHBhcnNlSW50KCQoZS50YXJnZXQpLnZhbCgpKSAtIDEsXG4gICAgICAgIGZpbGUgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpO1xuXG4gICAgaWYgKGluZGV4ICsgMSA+PSBsZW5ndGgpIHtcbiAgICAgICAgcHV0Qm90dG9tKGZpbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGUuZGV0YWNoKCkuaW5zZXJ0QmVmb3JlKCQoJy5qcy1maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKS5zbGljZShpbmRleCwgaW5kZXgrMSkpO1xuXG4gICAgfVxuICAgIG5vcm1hbGl6ZUluZGV4KCk7XG4gICAgLy91cGRhdGVHYWxsZXJ5KGluZGV4KTtcbn1cblxuZnVuY3Rpb24gcHV0Qm90dG9tKGZpbGUpIHtcbiAgICBmaWxlLmRldGFjaCgpLmluc2VydEFmdGVyKCQoJy5qcy1maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKS5sYXN0KCkpO1xuICAgIG5vcm1hbGl6ZUluZGV4KCk7XG4gICAgLy91cGRhdGVHYWxsZXJ5KGdhbGxlcnlPYmplY3RzLmxlbmd0aCk7XG59XG5mdW5jdGlvbiBwdXRUb3AoZmlsZSkge1xuICAgIGZpbGUuZGV0YWNoKCkuaW5zZXJ0QmVmb3JlKCQoJy5qcy1maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKS5maXJzdCgpKTtcbiAgICBub3JtYWxpemVJbmRleCgpO1xuICAgIC8vdXBkYXRlR2FsbGVyeSgwKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlU2VuZFRvVG9wQ2xpY2soZSkge1xuICAgIHZhciBmaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpO1xuICAgIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHB1dFRvcChmaWxlcyk7XG4gICAgfVxuICAgIHB1dFRvcCgkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpKTtcbiAgICBjbG9zZU1lbnUoJChlLnRhcmdldCkucGFyZW50cygnc2VsZWN0X19tZW51JykpO1xufVxuZnVuY3Rpb24gaGFuZGxlU2VuZFRvQm90dG9tQ2xpY2soZSkge1xuICAgIHZhciBmaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpO1xuICAgIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHB1dEJvdHRvbShmaWxlcyk7XG4gICAgfVxuICAgIHB1dEJvdHRvbSgkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpKTtcbiAgICBjbG9zZU1lbnUoJChlLnRhcmdldCkucGFyZW50cygnc2VsZWN0X19tZW51JykpO1xufVxuZnVuY3Rpb24gbG9hZEZpbGUoZmlsZSkge1xuXHR2YXIgZmlsZURhdGEgPSBmaWxlLmZpbGVEYXRhO1xuXG5cdHN3aXRjaCAoZmlsZURhdGEudHlwZSkge1xuXHRcdGNhc2UgJ2ltYWdlJzpcblx0XHRcdCQoJyNmaWxlUHJldmlldycpLmFkZENsYXNzKCdwcmV2aWV3LS1pbWFnZScpLnJlbW92ZUNsYXNzKCdwcmV2aWV3LS12aWRlbycpO1xuXHRcdFx0Ly9IaWRlIHZpZGVvIHJlbGF0ZWQgZWxlbWVudHNcblx0XHRcdCQoJyN2aWRlb1BsYXknKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHQkKCcjdmlkZW9NZXRhZGF0YScpLmFkZENsYXNzKCdoaWRkZW4nKTtcblxuXHRcdFx0Ly9TaG93IGFsbCBpbWFnZSByZWxhdGVkIGVsZW1lbnRzXG5cdFx0XHQkKCcjcHJldmlld0NvbnRyb2xzJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0JCgnI2ltYWdlTWV0YWRhdGEnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHQvLyQoJyNmb2NhbFBvaW50JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0Ly8kKCcjZm9jYWxSZWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0XHQvL0lmIGl0IGlzIG5vdCBidWxrIGVkaXQgc2V0IHByZXZpZXcgaW1hZ2UgYW5kIGFkanVzdCBmb2NhbCBwb2ludCBhbmQgcmVjdGFuZ2xlO1xuXHRcdFx0aWYgKCFmaWxlLmJ1bGtFZGl0KSB7XG5cdFx0XHRcdCQoJyNwcmV2aWV3SW1nJykuYXR0cignc3JjJywgZmlsZURhdGEudXJsKTtcblx0XHRcdFx0JCgnLnByIC5wdXJwb3NlLWltZycpLmNzcyhcImJhY2tncm91bmQtaW1hZ2VcIiwgJ3VybCgnICsgZmlsZURhdGEudXJsICsgJyknKTtcblx0XHRcdFx0YWRqdXN0Rm9jYWxQb2ludChmaWxlRGF0YS5mb2NhbFBvaW50KTtcblx0XHRcdFx0YWRqdXN0Rm9jYWxSZWN0KGZpbGVEYXRhLmZvY2FsUG9pbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvL3NldCBUaXRsZVxuXHRcdFx0YWRqdXN0VGl0bGUoZmlsZURhdGEudGl0bGUpO1xuXHRcdFx0YWRqdXN0Q2FwdGlvbihmaWxlRGF0YS5jYXB0aW9uKTtcblx0XHRcdGFkanVzdERlc2NyaXB0aW9uKGZpbGVEYXRhLmRlc2NyaXB0aW9uKTtcblx0XHRcdGFkanVzdFJlc29sdXRpb24oZmlsZURhdGEuaGlnaFJlc29sdXRpb24pO1xuXHRcdFx0YWRqdXN0QWx0VGV4dChmaWxlRGF0YS5hbHRUZXh0KTtcblxuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlICd2aWRlbyc6XG5cdFx0XHQkKCcjZmlsZVByZXZpZXcnKS5hZGRDbGFzcygncHJldmlldy0tdmlkZW8nKS5yZW1vdmVDbGFzcygncHJldmlldy0taW1hZ2UnKTtcblx0XHRcdC8vSGlkZSBhbGwgaW1hZ2UgcmVsYXRlZCBlbGVtZW50c1xuXHRcdFx0JCgnI3ByZXZpZXdDb250cm9scycpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHRcdCQoJyNpbWFnZU1ldGFkYXRhJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0JCgnI2ZvY2FsUG9pbnQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHQkKCcjZm9jYWxSZWN0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0XHQvL1Nob3cgdmlkZW8gcmVsYXRlZCBlbGVtZW50c1xuXHRcdFx0JCgnI3ZpZGVvUGxheScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRcdCQoJyN2aWRlb01ldGFkYXRhJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0XHRpZiAoZmlsZS5idWxrRWRpdCkge1xuXHRcdFx0XHQkKCcjZmllbEVkaXQtdmlkZW9NZXRhZGF0YScpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNmaWVsRWRpdC12aWRlb01ldGFkYXRhJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0XHRcdCQoJyNwcmV2aWV3SW1nJykuYXR0cignc3JjJywgZmlsZURhdGEudXJsKTtcblx0XHRcdFx0JCgnI3ZpZGVvVGl0bGUnKS50ZXh0KGZpbGVEYXRhLnRpdGxlKTtcblx0XHRcdFx0JCgnI3ZpZGVvRGVzY3JpcHRpb24nKS50ZXh0KGZpbGVEYXRhLmRlc2NyaXB0aW9uKTtcblx0XHRcdFx0JCgnI3ZpZGVvQXV0aG9yJykudGV4dChmaWxlRGF0YS5hdXRob3IpO1xuXHRcdFx0XHQkKCcjdmlkZW9HdWlkJykudGV4dChmaWxlRGF0YS5ndWlkKTtcblx0XHRcdFx0JCgnI3ZpZGVvS2V5d29yZHMnKS50ZXh0KGZpbGVEYXRhLmtleXdvcmRzKTtcblx0XHRcdH1cblxuXHRcdGJyZWFrO1xuXHR9XG59XG5cbi8vRnVuY3Rpb24gdG8gc2V0IFRpdGxlIHRvIHRoZSB0aXRsZSBmaWVsZCBvciwgc2F2ZSB0aXRsZSBpZiB0aXRsZSBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gYWRqdXN0VGl0bGUodGl0bGUpIHtcblx0JCgnI3RpdGxlJykudmFsKHRpdGxlKS5jaGFuZ2UoKTtcblx0dmFyIGV2ZW50ID0gbmV3IFVJRXZlbnQoJ2NoYW5nZScpO1xuXHQvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZScpLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgVGl0bGUgdG8gdGhlIHRpdGxlIGZpZWxkIG9yLCBzYXZlIHRpdGxlIGlmIHRpdGxlIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlVGl0bGUoZSkge1xuXHR2YXIgY3VycmVudEltYWdlID0gJCgnLmltYWdlLmltYWdlX3N0eWxlX211bHRpIC5maWxlX19pZFtkYXRhLWlkPVwiJyArIGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmlkICsgJ1wiXScpLnBhcmVudHMoJy5pbWFnZScpO1xuXG5cdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLnRpdGxlID0gJCgnI3RpdGxlJykudmFsKCk7XG5cblx0aWYgKCQoJyN0aXRsZScpLnZhbCgpID09PSAnJykge1xuXHRcdGN1cnJlbnRJbWFnZS5hZGRDbGFzcygnaGFzLWVtcHR5UmVxdWlyZWRGaWVsZCcpO1xuXHR9IGVsc2Uge1xuXHRcdGN1cnJlbnRJbWFnZS5yZW1vdmVDbGFzcygnaGFzLWVtcHR5UmVxdWlyZWRGaWVsZCcpO1xuXHR9XG5cblx0ZGF0YUNoYW5nZWQgPSB0cnVlO1xuXHRpZiAoZWRpdGVkRmlsZURhdGEuYnVsa0VkaXQpIHtcblx0XHRlZGl0ZWRGaWxlc0RhdGEuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0XHRmLmZpbGVEYXRhLnRpdGxlID0gJCgnI3RpdGxlJykudmFsKCk7XG5cdFx0fSk7XG5cdH1cbn1cbi8vRnVuY3Rpb24gdG8gc2V0IENhcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBhZGp1c3RDYXB0aW9uKGNhcHRpb24pIHtcblx0JCgnI2NhcHRpb24nKS52YWwoY2FwdGlvbikuY2hhbmdlKCk7XG5cdHZhciBldmVudCA9IG5ldyBVSUV2ZW50KCdjaGFuZ2UnKTtcblx0Ly9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FwdGlvbicpLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgRGVzY3JpcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlQ2FwdGlvbigpIHtcblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuY2FwdGlvbiA9ICQoJyNjYXB0aW9uJykudmFsKCk7XG5cdGRhdGFDaGFuZ2VkID0gdHJ1ZTtcblx0aWYgKGVkaXRlZEZpbGVEYXRhLmJ1bGtFZGl0KSB7XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdFx0Zi5maWxlRGF0YS5jYXB0aW9uID0gJCgnI2NhcHRpb24nKS52YWwoKTtcblx0XHR9KTtcblx0fVxufVxuZnVuY3Rpb24gYWRqdXN0RGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcblx0JCgnI2Rlc2NyaXB0aW9uJykudmFsKGRlc2NyaXB0aW9uKS5jaGFuZ2UoKTtcblx0dmFyIGV2ZW50ID0gbmV3IFVJRXZlbnQoJ2NoYW5nZScpO1xuXHQvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNjcmlwdGlvbicpLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgRGVzY3JpcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlRGVzY3JpcHRpb24oKSB7XG5cdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmRlc2NyaXB0aW9uID0gJCgnI2Rlc2NyaXB0aW9uJykudmFsKCk7XG5cdGRhdGFDaGFuZ2VkID0gdHJ1ZTtcblx0aWYgKGVkaXRlZEZpbGVEYXRhLmJ1bGtFZGl0KSB7XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdFx0Zi5maWxlRGF0YS5kZXNjcmlwdGlvbiA9ICQoJyNkZXNjcmlwdGlvbicpLnZhbCgpO1xuXHRcdH0pO1xuXHR9XG59XG5mdW5jdGlvbiBhZGp1c3RSZXNvbHV0aW9uKHJlc29sdXRpb24pIHtcblx0JCgnI3Jlc29sdXRpb24nKS5wcm9wKCdjaGVja2VkJywgcmVzb2x1dGlvbik7XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBEZXNjcmlwdGlvbiB0byB0aGUgY2FwdGlvbiBmaWVsZCBvciwgc2F2ZSBjYXB0aW9uIGlmIGNhcHRpb24gYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIHNhdmVSZXNvbHV0aW9uKCkge1xuXHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5oaWdoUmVzb2x1dGlvbiA9ICQoJyNyZXNvbHV0aW9uJykucHJvcCgnY2hlY2tlZCcpO1xuXHRkYXRhQ2hhbmdlZCA9IHRydWU7XG5cdGlmIChlZGl0ZWRGaWxlRGF0YS5idWxrRWRpdCkge1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdGYuZmlsZURhdGEuaGlnaFJlc29sdXRpb24gPSAkKCcjcmVzb2x1dGlvbicpLnByb3AoJ2NoZWNrZWQnKTtcblx0XHR9KTtcblx0fVxufVxuZnVuY3Rpb24gYWRqdXN0QWx0VGV4dChhbHRUZXh0KSB7XG5cdCQoJyNhbHRUZXh0JykudmFsKGFsdFRleHQpLmNoYW5nZSgpO1xuXHR2YXIgZXZlbnQgPSBuZXcgVUlFdmVudCgnY2hhbmdlJyk7XG5cdC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FsdFRleHQnKS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cbi8vRnVuY3Rpb24gdG8gc2V0IERlc2NyaXB0aW9uIHRvIHRoZSBjYXB0aW9uIGZpZWxkIG9yLCBzYXZlIGNhcHRpb24gaWYgY2FwdGlvbiBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gc2F2ZUFsdFRleHQoKSB7XG5cdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmFsdFRleHQgPSAkKCcjYWx0VGV4dCcpLnZhbCgpO1xuXHRkYXRhQ2hhbmdlZCA9IHRydWU7XG5cdGlmIChlZGl0ZWRGaWxlRGF0YS5idWxrRWRpdCkge1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdGYuZmlsZURhdGEuYWx0VGV4dCA9ICQoJyNhbHRUZXh0JykudmFsKCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuLy9GdW5jdGlvbiB0byBzZXQgRm9jYWxQb2ludCBjb29yZGluYXRlcyBvciwgc2F2ZSBmb2NhbCBwb2ludCBpZiBmb2NhbHBvaW50IGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBhZGp1c3RGb2NhbFBvaW50KGZvY2FsUG9pbnQpIHtcblx0dmFyIGZwID0gJCgnI2ZvY2FsUG9pbnQnKTtcblx0dmFyIGltZyA9ICQoJyNwcmV2aWV3SW1nJyk7XG5cdGlmIChmb2NhbFBvaW50KSB7XG5cdFx0dmFyIGxlZnQgPSBmb2NhbFBvaW50LmxlZnQgKiBpbWcud2lkdGgoKSAtIGZwLndpZHRoKCkvMixcblx0XHR0b3AgPSBmb2NhbFBvaW50LnRvcCAqIGltZy5oZWlnaHQoKSAtIGZwLmhlaWdodCgpLzI7XG5cblx0XHRsZWZ0ID0gbGVmdCA8PSAwID8gJzUwJScgOiBsZWZ0O1xuXHRcdHRvcCA9IHRvcCA8PSAwID8gJzUwJScgOiB0b3A7XG5cdFx0ZnAuY3NzKCdsZWZ0JywgbGVmdCkuY3NzKCd0b3AnLCB0b3ApO1xuXHR9IGVsc2Uge1xuXHRcdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmZvY2FsUG9pbnQgPSB7XG5cdFx0XHRsZWZ0OiAoKGZwLnBvc2l0aW9uKCkubGVmdCArIGZwLndpZHRoKCkvMikvaW1nLndpZHRoKCkpLFxuXHRcdFx0dG9wOiAoKGZwLnBvc2l0aW9uKCkudG9wICsgZnAuaGVpZ2h0KCkvMikvaW1nLmhlaWdodCgpKVxuXHRcdH07XG5cdH1cblx0ZnAuY3NzKCdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xufVxuXG4vL0Z1bmN0aW9uIHRvIHNldCBGb2NhbFJlY3QgY29vcmRpbmF0ZXMgb3IsIHNhdmUgZm9jYWwgcmVjdCBpZiBmb2NhbHBvaW50IGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBhZGp1c3RGb2NhbFJlY3QoZm9jYWxQb2ludCkge1xuXHR2YXIgZnIgPSAkKCcjZm9jYWxSZWN0Jyk7XG5cdHZhciBpbWcgPSAkKCdwcmV2aWV3SW1nJyk7XG5cdGlmIChmb2NhbFBvaW50KSB7XG5cdFx0dmFyIGxlZnQgPSBmb2NhbFBvaW50LmxlZnQgKiBpbWcud2lkdGgoKSAtIGZyLndpZHRoKCkvMixcblx0XHR0b3AgPSBmb2NhbFBvaW50LnRvcCAqIGltZy5oZWlnaHQoKSAtIGZyLmhlaWdodCgpLzI7XG5cblx0XHRsZWZ0ID0gbGVmdCA8IDAgPyAwIDogbGVmdCA+IGltZy53aWR0aCgpID8gaW1nLndpZHRoKCkgLSBmci53aWR0aCgpLzIgOiBsZWZ0O1xuXHRcdHRvcCA9IHRvcCA8IDAgPyAwIDogdG9wID4gaW1nLmhlaWdodCgpID8gaW1nLmhlaWdodCgpIC0gZnIuaGVpZ2h0KCkvMiA6IHRvcDtcblxuXHRcdGZyLmNzcygnbGVmdCcsIGxlZnQpXG5cdFx0LmNzcygndG9wJywgdG9wKTtcblx0fSBlbHNlIHtcblx0XHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5mb2NhbFBvaW50ID0ge1xuXHRcdFx0bGVmdDogKChmcC5wb3NpdGlvbigpLmxlZnQgKyBmcC53aWR0aCgpLzIpL2ltZy53aWR0aCgpKSxcblx0XHRcdHRvcDogKChmcC5wb3NpdGlvbigpLnRvcCArIGZwLmhlaWdodCgpLzIpL2ltZy5oZWlnaHQoKSlcblx0XHR9O1xuXHR9XG59XG5cblxuZnVuY3Rpb24gc2hvd0ZpbGVzKGZpbGVzKSB7XG5cdGRhdGFDaGFuZ2VkID0gZmFsc2U7XG5cdHNjcm9sbFBvc2l0aW9uID0gJCgnYm9keScpLnNjcm9sbFRvcCgpO1xuXHQvL1Nob3cgaW5pdGlhbCBlZGl0IHNjcmVlbiBmb3Igc2luZ2xlIGltYWdlLlxuXHQkKCcucHInKS5yZW1vdmVDbGFzcygnaGlkZGVuIHZpZGVvIGJ1bGsnKVxuXHQuYWRkQ2xhc3MoJ21vZGFsJyk7XG5cdCQoJyN3cmFwcGVyJykuYWRkQ2xhc3MoJ292ZXJmbG93Jyk7XG5cblx0Ly9SZW1vdmUgYWxsIG11bHRpcGxlIGltYWdlcyBzdHlsZSBhdHRyaWJ1dGVzXG5cdCQoJy5wciAucHJldmlldycpLnJlbW92ZUNsYXNzKCdwcmV2aWV3X3N0eWxlX211bHRpIGhpZGRlbicpO1xuXHQkKCcucHIgLmlwJykucmVtb3ZlQ2xhc3MoJ2lwX3N0eWxlX211bHRpJyk7XG5cdCQoJyNzYXZlQ2hhbmdlcycpLnRleHQoJ1NhdmUnKTtcblx0Ly8kKCcjaXBfX3RpdGxlJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHQkKCcucHIgLmltYWdlcycpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0JCgnI3RpdGxlJykucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHQkKCcjdGl0bGUnKS5wYXJlbnQoKS5jaGlsZHJlbignbGFiZWwnKS5hZGRDbGFzcygncmVxdWllcmVkJyk7XG5cdCQoJyN0aXRsZScpLnByb3AoJ3JlcXVpcmVkJywgdHJ1ZSk7XG5cblx0ZnVuY3Rpb24gcmVzaXplSW1hZ2VXcmFwcGVyKCkge1xuXHRcdHZhciBpbWFnZXNXcmFwcGVyV2lkdGggPSAkKCcuaW1hZ2VzX193cmFwcGVyJykud2lkdGgoKTtcblx0XHRpbWFnZXNXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIDwgNjAwID8gJCgnLmltYWdlc19fY29udGFpbmVyIC5pbWFnZScpLmxlbmd0aCAqIDEwMCA6ICQoJy5pbWFnZXNfX2NvbnRhaW5lciAuaW1hZ2UnKS5sZW5ndGggKiAxMjA7XG5cdFx0aWYgKGltYWdlc1dyYXBwZXJXaWR0aCA+IGltYWdlc1dpZHRoKSB7XG5cdFx0XHQkKCcuaW1hZ2VzX19zY3JvbGwtbGVmdCwgLmltYWdlc19fc2Nyb2xsLXJpZ2h0JykuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKCcuaW1hZ2VzX19jb250YWluZXInKS5jc3MoJ3dpZHRoJywgaW1hZ2VzV2lkdGgudG9TdHJpbmcoKSArICdweCcpO1xuXHRcdFx0JCgnLmltYWdlc19fc2Nyb2xsLWxlZnQsIC5pbWFnZXNfX3Njcm9sbC1yaWdodCcpLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKGZpbGVzLmxlbmd0aCA+IDEpIHtcblx0XHR2YXIgaW1nQ29udGFpbmVyID0gJCgnLnByIC5pbWFnZXNfX2NvbnRhaW5lcicpO1xuXHRcdGltZ0NvbnRhaW5lci5lbXB0eSgpO1xuXG5cdFx0Ly9BZGQgaW1hZ2VzIHByZXZpZXMgdG8gdGhlIGNvbnRhaW5lclxuXHRcdGZpbGVzLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdFx0dmFyXHRpbWFnZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlIGltYWdlX3N0eWxlX211bHRpJykuY2xpY2soaGFuZGxlSW1hZ2VTd2l0Y2gpLFxuXHRcdFx0cmVxdWlyZWRNYXJrID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2VfX3JlcXVpcmVkLW1hcmsnKSxcblx0XHRcdGZpbGVJbmRleCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2hpZGRlbiBmaWxlX19pZCcpLnRleHQoZi5maWxlRGF0YS5pZCkuYXR0cignZGF0YS1pZCcsIGYuZmlsZURhdGEuaWQpO1xuXHRcdFx0aW1hZ2UuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgZi5maWxlRGF0YS51cmwgKyAnKScpLmFwcGVuZChyZXF1aXJlZE1hcmssIGZpbGVJbmRleCk7XG5cdFx0XHRpbWdDb250YWluZXIuYXBwZW5kKGltYWdlKTtcblx0XHR9KTtcblxuXHRcdC8vQWRkIGFjdGl2ZSBzdGF0ZSB0byB0aGUgcHJldmlldyBvZiB0aGUgZmlyc3QgaW1hZ2Vcblx0XHR2YXIgZmlyc3RJbWFnZSA9ICQoJy5pbWFnZXNfX2NvbnRhaW5lciAuaW1hZ2UnKS5maXJzdCgpO1xuXHRcdGZpcnN0SW1hZ2UuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXG5cdFx0JCgnLnByIC5pbWFnZXMnKS5hZGRDbGFzcygnaW1hZ2VzX3N0eWxlX211bHRpJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbiBpbWFnZXNfc3R5bGVfYnVsaycpO1xuXG5cdFx0JCgnLnByIC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpLmFkZENsYXNzKCdwcmV2aWV3X3N0eWxlX211bHRpJyk7XG5cdFx0JCgnLnByIC5pcCcpLmFkZENsYXNzKCdpcF9zdHlsZV9tdWx0aScpO1xuXG5cdFx0Ly9BZGp1c3QgaW1hZ2UgcHJldmlld3MgY29udGFpbmVyXG5cdFx0JCgnI2ltYWdlc19fd3JhcHBlcicpLnNjcm9sbExlZnQoMCk7XG5cdFx0JCh3aW5kb3cpLnJlc2l6ZShyZXNpemVJbWFnZVdyYXBwZXIpO1xuXHRcdHJlc2l6ZUltYWdlV3JhcHBlcigpO1xuXG5cdFx0Ly9BZGQgYWN0aW9ucyB0byBzY3JvbGwgYnV0dG9uc1xuXHRcdCQoJy5pbWFnZXNfX3Njcm9sbC1sZWZ0JykudW5iaW5kKCdjbGljaycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHQkKCcjaW1hZ2VzX193cmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiAnLT00ODAnIH0sIDYwMCk7XG5cdFx0fSk7XG5cdFx0JCgnLmltYWdlc19fc2Nyb2xsLXJpZ2h0JykudW5iaW5kKCdjbGljaycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHQkKCcjaW1hZ2VzX193cmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiAnKz00ODAnIH0sIDYwMCk7XG5cdFx0fSk7XG5cdH1cblx0aGlkZUxvYWRlcigpO1xuXHRzZXRNb2RhbEtleWJvYXJkQWN0aW9ucyhzYXZlSW1hZ2VFZGl0LCBjYW5jZWxJbWFnZUVkaXQpO1xuXG59XG5mdW5jdGlvbiBlZGl0RmlsZXMoZmlsZXMpIHtcblx0ZWRpdGVkRmlsZXNEYXRhID0gW10uY29uY2F0KGZpbGVzKTtcblxuXHRpZiAoZWRpdGVkRmlsZXNEYXRhLmxlbmd0aCA+IDApIHtcblx0XHRlZGl0ZWRGaWxlRGF0YSA9IGVkaXRlZEZpbGVzRGF0YVswXTtcblx0XHRsb2FkRmlsZShlZGl0ZWRGaWxlRGF0YSk7XG5cdFx0c2hvd0ZpbGVzKGVkaXRlZEZpbGVzRGF0YSk7XG5cdH1cbn1cblxuXG4vL0J1bGsgRWRpdFxuZnVuY3Rpb24gYnVsa0VkaXRGaWxlcyhmaWxlcywgdHlwZSkge1xuXHR2YXIgY2xvbmVkR2FsbGVyeU9iamVjdHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGdhbGxlcnlPYmplY3RzKSk7XG5cdHZhciBmaWxlc1R5cGU7XG5cdGVkaXRlZEZpbGVzRGF0YSA9IFtdOyAvL0NsZWFyIGZpbGVzIGRhdGEgdGhhdCBwb3NzaWJseSBjb3VsZCBiZSBoZXJlXG5cblx0Ly9PYnRhaW4gZmlsZXMgZGF0YSBmb3IgZmlsZXMgdGhhdCBzaG91bGQgYmUgZWRpdGVkXG5cdGZpbGVzLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcblx0XHR2YXIgZmlsZSA9IGNsb25lZEdhbGxlcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG5cdFx0XHRyZXR1cm4gZi5maWxlRGF0YS5pZCA9PT0gJChlbCkuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpO1xuXHRcdH0pWzBdO1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5wdXNoKGZpbGUpO1xuXHR9KTtcblxuXHRpZiAoZWRpdGVkRmlsZXNEYXRhLmxlbmd0aCA+IDApIHtcblx0XHRzd2l0Y2ggKGVkaXRlZEZpbGVzRGF0YVswXS5maWxlRGF0YS50eXBlKSB7XG5cdFx0XHRjYXNlICdpbWFnZSc6XG5cdFx0XHRlZGl0ZWRGaWxlRGF0YSA9IHtcblx0XHRcdFx0ZmlsZURhdGE6IHtcblx0XHRcdFx0XHR1cmw6ICcnLFxuXHRcdFx0XHRcdGZvY2FsUG9pbnQ6IHtcblx0XHRcdFx0XHRcdGxlZnQ6IDAuNSxcblx0XHRcdFx0XHRcdHRvcDogMC41XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRpZDogJycsXG5cdFx0XHRcdFx0Y29sb3I6ICcnLFxuXHRcdFx0XHRcdHRpdGxlOiAnJyxcblx0XHRcdFx0XHRjYXB0aW9uOiAnJyxcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjogJycsXG5cdFx0XHRcdFx0aGlnaFJlc29sdXRpb246IGZhbHNlLFxuXHRcdFx0XHRcdGNhdGVnb3JpZXM6ICcnLFxuXHRcdFx0XHRcdHRhZ3M6ICcnLFxuXHRcdFx0XHRcdGFsdFRleHQ6ICcnLFxuXHRcdFx0XHRcdGNyZWRpdDogJycsXG5cdFx0XHRcdFx0Y29weXJpZ2h0OiAnJyxcblx0XHRcdFx0XHRyZWZlcmVuY2U6IHtcblx0XHRcdFx0XHRcdHNlcmllczogJycsXG5cdFx0XHRcdFx0XHRzZWFzb246ICcnLFxuXHRcdFx0XHRcdFx0ZXBpc29kZTogJydcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHR5cGU6ICdpbWFnZSdcblx0XHRcdFx0fSxcblx0XHRcdFx0YnVsa0VkaXQ6IHRydWVcblx0XHRcdH07XG5cdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAndmlkZW8nOlxuXHRcdFx0ZWRpdGVkRmlsZURhdGEgPSB7XG5cdFx0XHRcdGZpbGVEYXRhOiB7XG5cdFx0XHRcdFx0dXJsOiAnJyxcblx0XHRcdFx0XHRwbGF5ZXI6ICcnLFxuXHRcdFx0XHRcdHR5cGU6ICd2aWRlbydcblx0XHRcdFx0fSxcblx0XHRcdFx0YnVsa0VkaXQ6IHRydWVcblx0XHRcdH07XG5cdFx0XHRicmVhaztcblxuXHRcdH1cblxuXHRcdGxvYWRGaWxlKGVkaXRlZEZpbGVEYXRhKTtcblx0XHRzaG93QnVsa0ZpbGVzKGVkaXRlZEZpbGVzRGF0YSk7XG5cblx0fVxufVxuZnVuY3Rpb24gc2hvd0J1bGtGaWxlcyhmaWxlcykge1xuXHRkYXRhQ2hhbmdlZCA9IGZhbHNlO1xuXHRzY3JvbGxQb3NpdGlvbiA9ICQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcblx0Ly9TaG93IGluaXRpYWwgZWRpdCBzY3JlZW4gZm9yIHNpbmdsZSBpbWFnZS5cblx0JCgnLnByJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbiB2aWRlbycpXG5cdC5hZGRDbGFzcygnbW9kYWwgYnVsaycpO1xuXHQkKCcjd3JhcHBlcicpLmFkZENsYXNzKCdvdmVyZmxvdycpO1xuXG5cdC8vUmVtb3ZlIGFsbCBtdWx0aXBsZSBpbWFnZXMgc3R5bGUgYXR0cmlidXRlc1xuXHQkKCcucHIgLnByZXZpZXcnKS5yZW1vdmVDbGFzcygncHJldmlld19zdHlsZV9tdWx0aSBoaWRkZW4nKTtcblx0JCgnLnByIC5pcCcpLnJlbW92ZUNsYXNzKCdpcF9zdHlsZV9tdWx0aScpO1xuXHQkKCcjc2F2ZUNoYW5nZXMnKS50ZXh0KCdTYXZlJyk7XG5cdCQoJyN0aXRsZScpLnBhcmVudCgpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0JCgnI3RpdGxlJykucmVtb3ZlUHJvcCgncmVxdWlyZWQnKTtcblx0JCgnI3RpdGxlJykucGFyZW50KCkuY2hpbGRyZW4oJ2xhYmVsJykucmVtb3ZlQ2xhc3MoJ3JlcXVpZXJlZCcpO1xuXG5cdHZhciBpbWdDb250YWluZXIgPSAkKCcucHIgLmltYWdlc19fY29udGFpbmVyJyk7XG5cdGltZ0NvbnRhaW5lci5lbXB0eSgpO1xuXG5cdC8vQWRkIGltYWdlcyBwcmV2aWVzIHRvIHRoZSBjb250YWluZXJcblx0ZmlsZXMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0dmFyXHRpbWFnZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlIGltYWdlX3N0eWxlX2J1bGsnKSxcblx0XHRmaWxlSW5kZXggPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdoaWRkZW4gZmlsZV9faWQnKS50ZXh0KGYuZmlsZURhdGEuaWQpO1xuXHRcdGltYWdlLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIGYuZmlsZURhdGEudXJsICsgJyknKS5hcHBlbmQoZmlsZUluZGV4KTtcblx0XHRpbWdDb250YWluZXIuYXBwZW5kKGltYWdlKTtcblx0fSk7XG5cblx0JCgnLnByIC5pbWFnZXMnKS5hZGRDbGFzcygnaW1hZ2VzX3N0eWxlX2J1bGsnKS5yZW1vdmVDbGFzcygnaGlkZGVuIGltYWdlc19zdHlsZV9tdWx0aScpO1xuXHQkKCcucHIgLnByZXZpZXcnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cblx0aGlkZUxvYWRlcigpO1xuXHRzZXRNb2RhbEtleWJvYXJkQWN0aW9ucyhzYXZlSW1hZ2VFZGl0LCBjYW5jZWxJbWFnZUVkaXQpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVCdWxrRWRpdEJ1dHRvbkNsaWNrKGUpIHtcblx0JChlLnRhcmdldCkuYmx1cigpO1xuXHR2YXIgZmlsZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKSxcblx0bnVtYmVyT2ZTZWxlY3RlZEltYWdlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5qcy1pbWdGaWxlVHlwZS5zZWxlY3RlZCcpLmxlbmd0aCxcblx0bnVtYmVyT2ZTZWxlY3RlZFZpZGVvcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5qcy12aWRlb0ZpbGVUeXBlLnNlbGVjdGVkJykubGVuZ3RoO1xuXG5cdGlmIChudW1iZXJPZlNlbGVjdGVkSW1hZ2VzICYmIG51bWJlck9mU2VsZWN0ZWRWaWRlb3MpIHtcblx0XHRuZXcgTW9kYWwoe1xuXHRcdFx0dGl0bGU6ICdZb3UgY2FuXFwndCBidWxrIGVkaXQgaW1hZ2VzIGFuZCB2aWRlb3MnLFxuXHRcdFx0dGV4dDogJ1lvdSBjYW5cXCd0IGJ1bGsgZWRpdCBpbWFnZXMgYW5kIHZpZGVvcyBhdCBvbmNlLiBQbGVhc2Ugc2VsZWN0IGZpbGVzIG9mIHRoZSBzYW1lIHR5cGUgYW5kIHRyeSBhZ2Fpbi4nLFxuXHRcdFx0Y29uZmlybVRleHQ6ICdPaycsXG5cdFx0XHRvbmx5Q29uZmlybTogdHJ1ZVxuXHRcdH0pO1xuXHR9XG5cdGVsc2Uge1xuXHRcdGlmIChudW1iZXJPZlNlbGVjdGVkVmlkZW9zKSB7XG5cdFx0XHRidWxrRWRpdEZpbGVzKGZpbGVzLCAndmlkZW9zJyk7XG5cdFx0fSBlbHNlIGlmKG51bWJlck9mU2VsZWN0ZWRJbWFnZXMpIHtcblx0XHRcdGJ1bGtFZGl0RmlsZXMoZmlsZXMsICdpbWFnZXMnKTtcblx0XHR9XG5cdH1cbn1cblxuLy9IZWxwIGZ1bmN0aW9uXG5mdW5jdGlvbiBmaWxlQnlJZChpZCwgZmlsZXMpIHtcblx0ZmlsZXNGaWx0ZXJlZCA9IGZpbGVzLmZpbHRlcihmdW5jdGlvbihmKSB7XG5cdFx0cmV0dXJuIGYuZmlsZURhdGEuaWQgPT09IGlkO1xuXHR9KTtcblx0cmV0dXJuIGZpbGVzRmlsdGVyZWRbMF07XG59XG5cbi8vU2F2ZSBmaWxlXG5mdW5jdGlvbiBzYXZlRmlsZShmaWxlcywgZmlsZSkge1xuXHRmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRpZiAoZi5maWxlRGF0YS5pZCA9PT0gZmlsZS5maWxlRGF0YS5pZCkge1xuXHRcdFx0ZiA9IGZpbGU7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gc3dpdGNoSW1hZ2UoaW1hZ2UpIHtcblx0JCgnLnByZXZpZXdfX2ltYWdlLXdyYXBwZXInKS5yZW1vdmVDbGFzcygnaXMtc2xpZGluZ0xlZnQgaXMtc2xpZGluZ1JpZ2h0Jyk7XG5cdHZhciBuZXdGaWxlSWQgPSBpbWFnZS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCksXG5cdG5ld0ZpbGUgPSBmaWxlQnlJZChuZXdGaWxlSWQsIGVkaXRlZEZpbGVzRGF0YSksXG5cdG5ld0luZGV4ID0gaW1hZ2UuaW5kZXgoKSxcblx0Y3VycmVudEltYWdlID0gJCgnLmltYWdlLmlzLWFjdGl2ZScpLFxuXHRjdXJyZW50SW5kZXggPSBjdXJyZW50SW1hZ2UuaW5kZXgoKSxcblx0Y3VycmVudEZpbGUgPSBmaWxlQnlJZChjdXJyZW50SW1hZ2UuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpLCBlZGl0ZWRGaWxlc0RhdGEpLFxuXHRiYWNrSW1hZ2UgPSAkKCcjcHJldmlld0ltZ0JhY2snKSxcblx0cHJldmlld0ltYWdlID0gJCgnI3ByZXZpZXdJbWcnKTtcblxuXHRzYXZlRmlsZShlZGl0ZWRGaWxlc0RhdGEsIGVkaXRlZEZpbGVEYXRhKTtcblx0ZWRpdGVkRmlsZURhdGEgPSBuZXdGaWxlO1xuXHRsb2FkRmlsZShlZGl0ZWRGaWxlRGF0YSk7XG5cblx0Y3VycmVudEltYWdlLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0aW1hZ2UuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXG5cdGlmIChjdXJyZW50SW5kZXggPiBuZXdJbmRleCkge1xuXHRcdCQoJy5wcmV2aWV3X19pbWFnZS13cmFwcGVyJykuYWRkQ2xhc3MoJ2lzLXNsaWRpbmdMZWZ0Jyk7XG5cdH0gZWxzZSB7XG5cdFx0JCgnLnByZXZpZXdfX2ltYWdlLXdyYXBwZXInKS5hZGRDbGFzcygnaXMtc2xpZGluZ1JpZ2h0Jyk7XG5cdH1cblxuXHR2YXIgaW1hZ2VDb250YWluZXIgPSBpbWFnZS5wYXJlbnRzKCcuaW1hZ2VzX19jb250YWluZXInKSxcblx0aW1hZ2VXcmFwcGVyID0gaW1hZ2UucGFyZW50cygnLmltYWdlc19fd3JhcHBlcicpLFxuXHRpbWFnZUxlZnRFbmQgPSBpbWFnZUNvbnRhaW5lci5wb3NpdGlvbigpLmxlZnQgKyBpbWFnZS5wb3NpdGlvbigpLmxlZnQsXG5cdGltYWdlUmlnaHRFbmQgPSBpbWFnZUNvbnRhaW5lci5wb3NpdGlvbigpLmxlZnQgKyBpbWFnZS5wb3NpdGlvbigpLmxlZnQgKyBpbWFnZS53aWR0aCgpO1xuXG5cdGlmIChpbWFnZUxlZnRFbmQgPCAwKSB7XG5cdFx0JCgnI2ltYWdlc19fd3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogaW1hZ2UucG9zaXRpb24oKS5sZWZ0IC0gMzB9LCA0MDApO1xuXHR9IGVsc2UgaWYgKGltYWdlUmlnaHRFbmQgPiBpbWFnZVdyYXBwZXIud2lkdGgoKSkge1xuXHRcdCQoJyNpbWFnZXNfX3dyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6IGltYWdlLnBvc2l0aW9uKCkubGVmdCArIGltYWdlLndpZHRoKCkgLSBpbWFnZVdyYXBwZXIud2lkdGgoKSArIDUwfSwgNDAwKTtcblx0fVxuXG5cdC8vQ2xvc2UgYWxsIHByZXZpZXdzIGlmIHRoZXJlIGlzIG9wZW5cblx0aGlkZUFsbFByZXZpZXdzKCk7XG5cdC8vIEFkanVzdCBmb2NhbCByZWN0YW5nbGVcblx0YWRqdXN0UmVjdCgkKCcucHVycG9zZXNfX2NvbnRhaW5lciAucHVycG9zZS1pbWcnKS5maXJzdCgpKTtcblx0JCgnI3B1cnBvc2VXcmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiAnMCcgfSwgODAwKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZUltYWdlU3dpdGNoKGUpIHtcblx0c3dpdGNoSW1hZ2UoJChlLnRhcmdldCkpO1xufVxuXG4vL0Z1bmN0aW9uIGZvciBoYW5kbGUgRWRpdCBCdXR0b24gY2xpY2tzXG5mdW5jdGlvbiBoYW5kbGVGaWxlZEVkaXRCdXR0b25DbGljayhlKSB7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdHZhciBmaWxlRWxlbWVudCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJyk7XG5cblx0dmFyIGZpbGUgPSBnYWxsZXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuXHRcdHJldHVybiBmLmZpbGVEYXRhLmlkID09PSAkKGZpbGVFbGVtZW50KS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG5cdH0pO1xuXG5cdGVkaXRGaWxlcyhmaWxlKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZU11bHRpRWRpdEJ1dHRvbkNsaWNrKGUpIHtcblx0JChlLnRhcmdldCkuYmx1cigpO1xuXHR2YXIgZmlsZXNFbGVtZW50cyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpLFxuXHRjbG9uZWRHYWxsZXJ5T2JqZWN0cyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZ2FsbGVyeU9iamVjdHMpKSxcblx0ZmlsZXMgPSBbXSxcblx0bnVtYmVyT2ZTZWxlY3RlZEltYWdlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5qcy1pbWdGaWxlVHlwZS5zZWxlY3RlZCcpLmxlbmd0aCxcblx0bnVtYmVyT2ZTZWxlY3RlZFZpZGVvcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5qcy12aWRlb0ZpbGVUeXBlLnNlbGVjdGVkJykubGVuZ3RoO1xuXG5cdGlmIChudW1iZXJPZlNlbGVjdGVkSW1hZ2VzICYmIG51bWJlck9mU2VsZWN0ZWRWaWRlb3MpIHtcblx0XHRuZXcgTW9kYWwoe1xuXHRcdFx0dGl0bGU6ICdZb3UgY2FuXFwndCBtdWx0aSBlZGl0IGltYWdlcyBhbmQgdmlkZW9zJyxcblx0XHRcdHRleHQ6ICdZb3UgY2FuXFwndCBtdWx0aSBlZGl0IGltYWdlcyBhbmQgdmlkZW9zIGF0IG9uY2UuIFBsZWFzZSBzZWxlY3QgZmlsZXMgb2YgdGhlIHNhbWUgdHlwZSBhbmQgdHJ5IGFnYWluLicsXG5cdFx0XHRjb25maXJtVGV4dDogJ09rJyxcblx0XHRcdG9ubHlDb25maXJtOiB0cnVlXG5cdFx0fSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly9PYnRhaW4gZmlsZXMgZGF0YSBmb3IgZmlsZXMgdGhhdCBzaG91bGQgYmUgZWRpdGVkXG5cdFx0ZmlsZXNFbGVtZW50cy5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG5cdFx0XHR2YXIgZmlsZSA9IFtdLmNvbmNhdChjbG9uZWRHYWxsZXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuXHRcdFx0XHRyZXR1cm4gZi5maWxlRGF0YS5pZCA9PT0gJChlbCkuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpO1xuXHRcdFx0fSkpWzBdO1xuXHRcdFx0ZmlsZXMucHVzaChmaWxlKTtcblx0XHR9KTtcblxuXHRcdGVkaXRGaWxlcyhmaWxlcyk7XG5cdH1cbn1cblxuXG5mdW5jdGlvbiBjYW5jZWxJbWFnZUVkaXQoKSB7XG5cblx0Ly8gVXNlIGRhdGFDaGFuZ2VkIHRvIGNoZWNrIGlmIGFueSBkYXRhIGhhcyBjaGFuZ2VkIGFuZCBzaG93IHRoZSBtb2RhbC4gQ3VycmVudGx5XG5cdC8vIHRoZSB2YWx1ZSBpcyBub3QgYmVpbmcgc2V0IGNvcnJlbnRseSBzbyB3ZSBhcmUgYWx3YXlzIHNob3dpbmcgdGhlIGRpYWxvZy5cblx0Ly9pZiAoZGF0YUNoYW5nZWQpIHtcblx0aWYgKHRydWUpIHtcblx0XHRuZXcgTW9kYWwoe1xuXHRcdFx0ZGlhbG9nOiB0cnVlLFxuXHRcdFx0dGl0bGU6ICdDYW5jZWwgQ2hhbmdlcz8nLFxuXHRcdFx0dGV4dDogJ0FueSB1bnNhdmVkIGNoYW5nZXMgeW91IG1hZGUgd2lsbCBiZSBsb3N0LiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gY2FuY2VsPycsXG5cdFx0XHRjb25maXJtVGV4dDogJ0NhbmNlbCcsXG5cdFx0XHRjb25maXJtQWN0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y2xvc2VFZGl0U2NyZWVuKCk7XG5cdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcblx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG5cdFx0XHR9LFxuXHRcdFx0Y2FuY2VsQWN0aW9uOiBzZXRNb2RhbEtleWJvYXJkQWN0aW9ucyhzYXZlSW1hZ2VFZGl0LCBjYW5jZWxJbWFnZUVkaXQpXG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0Y2xvc2VFZGl0U2NyZWVuKCk7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVzY0tleWRvd24pO1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFbnRlcktleWRvd24pO1xuXHR9XG59XG5mdW5jdGlvbiBzYXZlSW1hZ2VFZGl0KCkge1xuXHR2YXIgZW1wdHlSZXF1aXJlZEZpZWxkID0gZmFsc2UsXG5cdGVtcHR5SW1hZ2U7XG5cdHZhciBlbXB0eUZpZWxkcyA9IGNoZWNrRmllbGRzKCcucHIgbGFiZWwucmVxdWllcmVkJyk7XG5cdGlmIChlbXB0eUZpZWxkcyB8fCBlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS50eXBlID09PSAndmlkZW8nKSB7XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLmZvckVhY2goZnVuY3Rpb24oZmQpIHtcblx0XHRcdGlmIChmZC5maWxlRGF0YS50aXRsZSA9PT0gJycgJiYgIWVtcHR5UmVxdWlyZWRGaWVsZCkge1xuXHRcdFx0XHRlbXB0eVJlcXVpcmVkRmllbGQgPSB0cnVlO1xuXHRcdFx0XHRlbXB0eUltYWdlID0gJCgnLmltYWdlLmltYWdlX3N0eWxlX211bHRpIC5maWxlX19pZFtkYXRhLWlkPVwiJyArIGZkLmZpbGVEYXRhLmlkICsgJ1wiXScpLnBhcmVudHMoJy5pbWFnZScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKGVtcHR5UmVxdWlyZWRGaWVsZCkge1xuXHRcdFx0c3dpdGNoSW1hZ2UoZW1wdHlJbWFnZSk7XG5cdFx0XHQkKCcuanMtcmVxdWlyZWQnKS5ub3QoJy5qcy1oYXNWYWx1ZScpLmZpcnN0KCkuYWRkQ2xhc3MoJ2lucHV0X3N0YXRlX2VyciBpcy1ibGlua2luZycpLmZvY3VzKCk7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAoZS5hbmltYXRpb25OYW1lID09PSAndGV4dGZpZWxkLWZvY3VzLWJsaW5rJykgeyQoZS50YXJnZXQpLnBhcmVudCgpLmZpbmQoJy5pcy1ibGlua2luZycpLnJlbW92ZUNsYXNzKCdpcy1ibGlua2luZycpO31cblx0XHRcdH0pO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBjbG9uZWRFZGl0ZWRGaWxlcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZWRpdGVkRmlsZXNEYXRhKSk7XG5cdFx0XHRjbG9uZWRFZGl0ZWRGaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGZkKSB7XG5cdFx0XHRcdHZhciBmaWxlID0gZ2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcblx0XHRcdFx0XHRyZXR1cm4gZi5maWxlRGF0YS5pZCA9PT0gZmQuZmlsZURhdGEuaWQ7XG5cdFx0XHRcdH0pWzBdO1xuXHRcdFx0XHR2YXIgZmlsZUluZGV4ID0gZ2FsbGVyeU9iamVjdHMuaW5kZXhPZihmaWxlKTtcblxuXHRcdFx0XHRnYWxsZXJ5T2JqZWN0cyA9IGdhbGxlcnlPYmplY3RzLnNsaWNlKDAsIGZpbGVJbmRleCkuY29uY2F0KFtmZF0pLmNvbmNhdChnYWxsZXJ5T2JqZWN0cy5zbGljZShmaWxlSW5kZXggKyAxKSk7XG5cblx0XHRcdH0pO1xuXHRcdFx0c2hvd05vdGlmaWNhdGlvbignVGhlIGNoYW5nZSBpbiB0aGUgbWV0YWRhdGEgaXMgc2F2ZWQgdG8gdGhlIGFzc2V0LicpO1xuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVzY0tleWRvd24pO1xuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG5cdFx0XHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtjbG9zZUVkaXRTY3JlZW4oKTt9LCAyMDAwKTtcblx0XHRcdGNvbnNvbGUubG9nKGdhbGxlcnlPYmplY3RzKTtcblx0XHRcdGRlc2VsZWN0QWxsKCk7XG5cdFx0XHR1cGRhdGVHYWxsZXJ5KCk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGhpZGVBbGxQcmV2aWV3cygpIHtcbiAgJCgnI3B1cnBvc2VzJykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgJCgnI3B1cnBvc2VzJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAkKCcjcHJldmlld0ltYWdlJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAkKCcjcHJldmlld0NvbnRyb2xzJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXG4gIC8vQ2hhbmdlIGJ1dHRvbiB0ZXh0LCBpY29uIGFuZCBjbGljayBoYW5kbGVyXG4gICQoJyNzaG93UHJldmlldycpLm9mZignY2xpY2snLCBoaWRlQWxsUHJldmlld3MpLmNsaWNrKHNob3dBbGxQcmV2aWV3cyk7XG4gICQoJyNzaG93UHJldmlldyBzcGFuJykudGV4dCgnVmlldyBBbGwnKTtcbiAgJCgnI3Nob3dQcmV2aWV3IGknKS5yZW1vdmVDbGFzcygnZmEtYXJyb3ctZG93bicpLmFkZENsYXNzKCdmYS1hcnJvdy11cCcpO1xufVxuXG5mdW5jdGlvbiBzaG93QWxsUHJldmlld3MoKSB7XG4gICQoJyNwdXJwb3NlcycpLmFkZENsYXNzKCdpcy1vcGVuJyk7XG4gICQoJyNwdXJwb3NlcycpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcbiAgJCgnI3ByZXZpZXdJbWFnZScpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgJCgnI3ByZXZpZXdDb250cm9scycpLmFkZENsYXNzKCdoaWRkZW4nKTtcblxuICAvL0NoYW5nZSBidXR0b24gdGV4dCwgaWNvbiBhbmQgY2xpY2sgaGFuZGxlclxuICAkKCcjc2hvd1ByZXZpZXcnKS5vZmYoJ2NsaWNrJywgc2hvd0FsbFByZXZpZXdzKS5jbGljayhoaWRlQWxsUHJldmlld3MpO1xuICAkKCcjc2hvd1ByZXZpZXcgc3BhbicpLnRleHQoJ0NvbGxhcHNlJyk7XG4gICQoJyNzaG93UHJldmlldyBpJykucmVtb3ZlQ2xhc3MoJ2ZhLWFycm93LXVwJykuYWRkQ2xhc3MoJ2ZhLWFycm93LWRvd24nKTtcblxuICAvLyBBZGp1c3QgcHJldmlld3MgY2xpY2sgZmluY3Rpb25cbiAgJCgnLnB1cnBvc2VzX19jb250YWluZXIgLnB1cnBvc2UuaXMtYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAkKCcucHVycG9zZXNfX2NvbnRhaW5lciAucHVycG9zZS1pbWcnKS51bmJpbmQoKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgaGlkZUFsbFByZXZpZXdzKCk7XG4gICAgYWRqdXN0UmVjdCgkKGUudGFyZ2V0KSk7XG5cdFx0Ly8gU2Nyb2xsIHByZXZpZXdzIHRvIHRoZSBzZWxlY3RlZCBvbmVcblx0XHR2YXIgcHJldmlld0luZGV4ID0gJChlLnRhcmdldCkucGFyZW50cygnLnB1cnBvc2UnKS5pbmRleCgnLnB1cnBvc2VzX19jb250YWluZXIgLnB1cnBvc2UnKTtcblx0XHQkKCcjcHVycG9zZVdyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6IHByZXZpZXdJbmRleCAqIDEwMCB9LCA2MDApO1xuICB9KTtcblxuICAvL0NoZWNrIGlmIGl0IGlzIGEgbW9iaWxlIHNjcmVlblxuICBpZiAod2luZG93LmlubmVyV2lkdGggPCA2NTApIHtcbiAgICAkKFwiI3B1cnBvc2VzIC5wdXJwb3Nlc19fY29udGFpbmVyIC5wdXJwb3NlXCIpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAkKFwiI3B1cnBvc2VzIC5wdXJwb3Nlc19fY29udGFpbmVyIC5wdXJwb3NlLmhpZGRlblwiKS5zbGljZSgwLCA1KS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgJCgnI2xvYWRNb3JlJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICB9XG4gIC8vJCgnLnByZXZpZXcuZm9jYWwnKS5hZGRDbGFzcygnZnVsbCcpLnJlbW92ZUNsYXNzKCdsaW5lJyk7XG4gIC8vJCgnI3B1cnBvc2VUb2dnbGUnKS5jaGlsZHJlbignc3BhbicpLnRleHQoJ0hpZGUgUHJldmlldycpO1xufVxuLypRdWljayBFZGl0IEZpbGUgVGl0bGUgYW5kIEluZm8gKi9cbmZ1bmN0aW9uIGVkaXRGaWxlVGl0bGUoZSkge1xuXHRpZiAoISQoJy5hbCcpLmhhc0NsYXNzKCdtb2RhbCcpKSB7XG5cdFx0dmFyIGZpbGVJbmZvID0gZS50YXJnZXQ7XG5cdFx0dmFyIGZpbGVJbmZvVGV4dCA9IGZpbGVJbmZvLmlubmVySFRNTDtcblx0XHR2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXHRcdGlucHV0LnR5cGUgPSAndGV4dCc7XG5cdFx0aW5wdXQudmFsdWUgPSBmaWxlSW5mb1RleHQ7XG5cblx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIGlucHV0ID0gZS50YXJnZXQ7XG5cdFx0XHRmaWxlSW5mbyA9IGlucHV0LnBhcmVudE5vZGU7XG5cdFx0XHRmaWxlSW5mby5yZW1vdmVDaGlsZChpbnB1dCk7XG5cdFx0XHRmaWxlSW5mby5jbGFzc0xpc3QucmVtb3ZlKCdlZGl0Jyk7XG5cdFx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSBpbnB1dC52YWx1ZTtcblx0XHR9KTtcblx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMTMgfHwgZS53aGljaCA9PSAxMykge1xuXHRcdFx0XHR2YXIgaW5wdXQgPSBlLnRhcmdldDtcblx0XHRcdFx0ZmlsZUluZm8gPSBpbnB1dC5wYXJlbnROb2RlO1xuXHRcdFx0XHRmaWxlSW5mby5yZW1vdmVDaGlsZChpbnB1dCk7XG5cdFx0XHRcdGZpbGVJbmZvLmNsYXNzTGlzdC5yZW1vdmUoJ2VkaXQnKTtcblx0XHRcdFx0ZmlsZUluZm8uaW5uZXJIVE1MID0gaW5wdXQudmFsdWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSAnJztcblx0XHRmaWxlSW5mby5hcHBlbmRDaGlsZChpbnB1dCk7XG5cdFx0ZmlsZUluZm8uY2xhc3NMaXN0LmFkZCgnZWRpdCcpO1xuXHRcdGlucHV0LmZvY3VzKCk7XG5cdH1cbn1cbmZ1bmN0aW9uIGVkaXRGaWxlQ2FwdGlvbihlKSB7XG5cdGlmICghJCgnLmFsJykuaGFzQ2xhc3MoJ21vZGFsJykpIHtcblx0XHR2YXIgZmlsZUluZm8gPSBlLnRhcmdldDtcblx0XHR2YXIgZmlsZUluZm9UZXh0ID0gZmlsZUluZm8uaW5uZXJIVE1MO1xuXHRcdHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG5cdFx0Ly9pbnB1dC50eXBlID0gJ3RleHQnXG5cdFx0aW5wdXQudmFsdWUgPSBmaWxlSW5mb1RleHQ7XG5cblx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIGlucHV0ID0gZS50YXJnZXQ7XG5cdFx0XHRmaWxlSW5mbyA9IGlucHV0LnBhcmVudE5vZGU7XG5cdFx0XHRmaWxlSW5mby5yZW1vdmVDaGlsZChpbnB1dCk7XG5cdFx0XHRmaWxlSW5mby5jbGFzc0xpc3QucmVtb3ZlKCdlZGl0Jyk7XG5cdFx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSBpbnB1dC52YWx1ZTtcblx0XHR9KTtcblx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMTMgfHwgZS53aGljaCA9PSAxMykge1xuXHRcdFx0XHR2YXIgaW5wdXQgPSBlLnRhcmdldDtcblx0XHRcdFx0ZmlsZUluZm8gPSBpbnB1dC5wYXJlbnROb2RlO1xuXHRcdFx0XHRmaWxlSW5mby5yZW1vdmVDaGlsZChpbnB1dCk7XG5cdFx0XHRcdGZpbGVJbmZvLmNsYXNzTGlzdC5yZW1vdmUoJ2VkaXQnKTtcblx0XHRcdFx0ZmlsZUluZm8uaW5uZXJIVE1MID0gaW5wdXQudmFsdWU7XG5cdFx0XHR9XG5cblx0XHR9KTtcblxuXHRcdGZpbGVJbmZvLmlubmVySFRNTCA9ICcnO1xuXHRcdGZpbGVJbmZvLmFwcGVuZENoaWxkKGlucHV0KTtcblx0XHRmaWxlSW5mby5jbGFzc0xpc3QuYWRkKCdlZGl0Jyk7XG5cdFx0aW5wdXQuZm9jdXMoKTtcblx0fVxufVxuXG5mdW5jdGlvbiBkZWxldGVGaWxlKGZpbGUsIGZpbGVzKSB7XG5cdGZpbGVzID0gZmlsZXMuc3BsaWNlKGZpbGVzLmluZGV4T2YoZmlsZSksIDEpO1xufVxuZnVuY3Rpb24gZGVsZXRlRmlsZUJ5SWQoaWQsIGZpbGVzKSB7XG5cdHZhciBmaWxlID0gZmlsZUJ5SWQoaWQsIGZpbGVzKTtcblx0ZGVsZXRlRmlsZShmaWxlLCBmaWxlcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZURlbGV0ZUNsaWNrKGUpIHtcblx0dmFyIGl0ZW1OYW1lID0gJCgnLm1lbnUgLmlzLWFjdGl2ZScpLnRleHQoKS50b0xvd2VyQ2FzZSgpO1xuXHRuZXcgTW9kYWwoe1xuXHRcdHRpdGxlOiAnUmVtb3ZlIEFzc2V0PycsXG5cdFx0dGV4dDogJ1NlbGVjdGVkIGFzc2V0IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoaXMgJyArIGl0ZW1OYW1lICsgJy4gRG9u4oCZdCB3b3JyeSwgaXQgd29u4oCZdCBiZSByZW1vdmVkIGZyb20gdGhlIEFzc2V0IExpYnJhcnkuJyxcblx0XHRjb25maXJtVGV4dDogJ1JlbW92ZScsXG5cdFx0Y29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZmlsZUlkID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG5cdFx0XHRkZWxldGVGaWxlQnlJZChmaWxlSWQsIGdhbGxlcnlPYmplY3RzKTtcblx0XHRcdHVwZGF0ZUdhbGxlcnkoKTtcblx0XHR9XG5cdH0pO1xufVxuXG4kKCcuZmlsZS10aXRsZScpLmNsaWNrKGVkaXRGaWxlVGl0bGUpO1xuJCgnLmZpbGUtY2FwdGlvbicpLmNsaWNrKGVkaXRGaWxlQ2FwdGlvbik7XG5cbi8vRmlsZSB1cGxvYWRcbmZ1bmN0aW9uIGhhbmRsZUZpbGVzKGZpbGVzLCBjYWxsYmFjaykge1xuXHR2YXIgZmlsZXNPdXRwdXQgPSBbXTtcblx0aWYgKGZpbGVzICYmIGZpbGVzLmxlbmd0aCA+MCkge1xuXHRcdGZvciAodmFyIGk9MDsgaTwgZmlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGZpbGVzT3V0cHV0LnB1c2goZmlsZXNbaV0pO1xuXHRcdH1cblx0XHQvL3Nob3dMb2FkZXIoKTtcblx0XHR2YXIgdXBsb2FkZWRGaWxlcyA9IGZpbGVzT3V0cHV0Lm1hcChmdW5jdGlvbihmKSB7XG5cdFx0XHRyZXR1cm4gZmlsZVRvT2JqZWN0KGYpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRcdGdhbGxlcnlPYmplY3RzLnB1c2goe1xuXHRcdFx0XHRcdGZpbGVEYXRhOiByZXMsXG5cdFx0XHRcdFx0c2VsZWN0ZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdHBvc2l0aW9uOiAxMDAwLFxuXHRcdFx0XHRcdGNhcHRpb246ICcnLFxuXHRcdFx0XHRcdGdhbGxlcnlDYXB0aW9uOiBmYWxzZSxcblx0XHRcdFx0XHRqdXN0VXBsb2FkZWQ6IHRydWUsXG5cdFx0XHRcdFx0bG9hZGluZzogdHJ1ZVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdFByb21pc2UuYWxsKHVwbG9hZGVkRmlsZXMpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRpZiAoY2FsbGJhY2sgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRjYWxsYmFjayhnYWxsZXJ5T2JqZWN0cyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dXBkYXRlR2FsbGVyeShnYWxsZXJ5T2JqZWN0cy5sZW5ndGgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG5cbi8vQ29udmVydCB1cGxvYWRlZCBmaWxlcyB0byBlbGVtZW50c1xuZnVuY3Rpb24gZmlsZVRvTWFya3VwKGZpbGUpIHtcblx0cmV0dXJuIHJlYWRGaWxlKGZpbGUpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG5cdFx0dmFyIGZpbGVOb2RlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZScpLFxuXG5cdFx0XHRmaWxlSW1nID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZS1pbWcnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyByZXN1bHQuc3JjICsgJyknKSxcblxuXHRcdFx0ZmlsZUNvbnRyb2xzID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZS1jb250cm9scycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuXHRcdFx0Y2hlY2ttYXJrID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2hlY2ttYXJrJykuY2xpY2sodG9nZ2xlRmlsZVNlbGVjdCksXG5cdFx0XHRjbG9zZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2Nsb3NlJykuY2xpY2soZGVsZXRlRmlsZSksXG5cdFx0XHRlZGl0ID0gJCgnPGJ1dHRvbj5FZGl0PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbiB3aGl0ZU91dGxpbmUnKS5jbGljayhlZGl0RmlsZSksXG5cblx0XHRcdGZpbGVUaXRsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3RpdGxlJyksXG5cdFx0XHRmaWxlVHlwZUljb24gPSAkKCc8aSBjbGFzcz1cImZhIGZhLWNhbWVyYVwiPjwvaT4nKS5jc3MoJ21hcmdpbi1yaWdodCcsICcycHgnKSxcblx0XHRcdGZpbGVUaXRsZUlucHV0ID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgLz4nKS52YWwocmVzdWx0Lm5hbWUpLFxuXG5cdFx0XHRmaWxlQ2FwdGlvbiA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUtY2FwdGlvbicpLnRleHQocmVzdWx0Lm5hbWUpLmNsaWNrKGVkaXRGaWxlQ2FwdGlvbiksXG5cdFx0XHRmaWxlSW5mbyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUtaW5mbycpLnRleHQocmVzdWx0LmluZm8pLFxuXG5cdFx0XHRmaWxlUHVycG9zZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUtcHVycG9zZScpLFxuXHRcdFx0ZmlsZVB1cnBvc2VTZWxlY3QgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdzZWxlY3QnKS5jbGljayhvcGVuU2VsZWN0KSxcblx0XHRcdHNlbGVjdFNwYW4gPSAkKCc8c3Bhbj5TZWxlY3QgdXNlPC9zcGFuPicpLFxuXHRcdFx0c2VsZWN0VWwgPSAkKCc8dWw+PC91bD4nKSxcblx0XHRcdHNlbGVjdExpMSA9ICQoJzxsaT5Db3ZlcjwvbGk+JykuY2xpY2soc2V0U2VsZWN0KSxcblx0XHRcdHNlbGVjdExpMiA9ICQoJzxsaT5QcmltYXJ5PC9saT4nKS5jbGljayhzZXRTZWxlY3QpLFxuXHRcdFx0c2VsZWN0TGkzID0gJCgnPGxpPlNlY29uZGFyeTwvbGk+JykuY2xpY2soc2V0U2VsZWN0KTtcblxuXHRcdGZpbGVUaXRsZS5hcHBlbmQoZmlsZVR5cGVJY29uLCBmaWxlVGl0bGVJbnB1dCk7XG5cdFx0c2VsZWN0VWwuYXBwZW5kKHNlbGVjdExpMSwgc2VsZWN0TGkyLCBzZWxlY3RMaTMpO1xuXHRcdGZpbGVQdXJwb3NlU2VsZWN0LmFwcGVuZChzZWxlY3RTcGFuLCBzZWxlY3RVbCk7XG5cblx0XHRmaWxlUHVycG9zZS5hcHBlbmQoZmlsZVB1cnBvc2VTZWxlY3QpO1xuXHRcdGZpbGVDb250cm9scy5hcHBlbmQoY2hlY2ttYXJrLCBjbG9zZSwgZWRpdCk7XG5cdFx0ZmlsZUltZy5hcHBlbmQoZmlsZUNvbnRyb2xzKTtcblxuXHRcdGZpbGVOb2RlLmFwcGVuZChmaWxlSW1nLCBmaWxlVGl0bGUsIGZpbGVDYXB0aW9uLCBmaWxlSW5mbywgZmlsZVB1cnBvc2UpO1xuXG5cdFx0cmV0dXJuIGZpbGVOb2RlO1xuXHR9KTtcbn1cblxuLy9Db252ZXJ0IHVwbG9hZGVkIGZpbGUgdG8gb2JqZWN0XG5mdW5jdGlvbiBmaWxlVG9PYmplY3QoZmlsZSkge1xuXHRyZXR1cm4gcmVhZEZpbGUoZmlsZSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcblx0XHRyZXR1cm4ge1xuXHQgICAgICAgIHVybDogcmVzdWx0LnNyYyxcblx0ICAgICAgICBmb2NhbFBvaW50OiB7XG5cdCAgICAgICAgICAgIGxlZnQ6IDAuNSxcblx0ICAgICAgICAgICAgdG9wOiAwLjVcblx0ICAgICAgICB9LFxuXHRcdFx0aWQ6IHJlc3VsdC5uYW1lICsgJyAnICsgbmV3IERhdGUoKSxcblx0XHRcdGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgpLFxuXHQgICAgICAgIGNvbG9yOiAnJywvL2ZpbGVJbWdDb2xvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmZpbGVJbWdDb2xvcnMubGVuZ3RoKV0sXG5cdCAgICAgICAgdGl0bGU6IHJlc3VsdC5uYW1lLFxuXHQgICAgICAgIGNhcHRpb246ICcnLFxuXHQgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcblx0ICAgICAgICBoaWdoUmVzb2x1dGlvbjogZmFsc2UsXG5cdCAgICAgICAgY2F0ZWdvcmllczogJycsXG5cdCAgICAgICAgdGFnczogJycsXG5cdCAgICAgICAgYWx0VGV4dDogJycsXG5cdCAgICAgICAgY3JlZGl0OiAnJyxcblx0ICAgICAgICBjb3B5cmlnaHQ6ICcnLFxuXHQgICAgICAgIHJlZmVyZW5jZToge1xuXHQgICAgICAgICAgICBzZXJpZXM6ICcnLFxuXHQgICAgICAgICAgICBzZWFzb246ICcnLFxuXHQgICAgICAgICAgICBlcGlzb2RlOiAnJ1xuXHQgICAgICAgIH0sXG5cdFx0XHR0eXBlOiAnaW1hZ2UnXG5cdCAgICB9O1xuXHR9KTtcbn1cblxuLy9SZWFkIGZpbGUgYW5kIHJldHVybiBwcm9taXNlXG5mdW5jdGlvbiByZWFkRmlsZShmaWxlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShcblx0XHRmdW5jdGlvbihyZXMsIHJlaikge1xuXHRcdFx0dmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cdFx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRyZXMoe3NyYzogZS50YXJnZXQucmVzdWx0LFxuXHRcdFx0XHRcdG5hbWU6IGZpbGUubmFtZSxcblx0XHRcdFx0XHRpbmZvOiBmaWxlLnR5cGUgKyAnLCAnICsgTWF0aC5yb3VuZChmaWxlLnNpemUvMTAyNCkudG9TdHJpbmcoKSArICcgS2InfSk7XG5cdFx0XHR9O1xuXHRcdFx0cmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmVqKHRoaXMpO1xuXHRcdFx0fTtcblx0XHRcdHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuXHRcdH1cblx0KTtcbn1cblxuLy9Mb2FkZXJzXG5mdW5jdGlvbiBzaG93TG9hZGVyKCkge1xuXHR2YXIgbW9kYWwgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbCcpLmF0dHIoJ2lkJywgJ2xvYWRlck1vZGFsJyksXG5cdFx0bG9hZGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbG9hZGVyJyk7XG5cblx0bW9kYWwuYXBwZW5kKGxvYWRlcik7XG5cdCQoJ2JvZHknKS5hcHBlbmQobW9kYWwpO1xufVxuZnVuY3Rpb24gaGlkZUxvYWRlcigpIHtcblx0JCgnI2xvYWRlck1vZGFsJykucmVtb3ZlKCk7XG59XG5cbi8vRHJhZyBhbmQgZHJvcCBmaWxlc1xuZnVuY3Rpb24gaGFuZGxlRHJhZ0VudGVyKGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImNvcHlcIjtcblx0JCgnI2Ryb3Bab25lJykuYWRkQ2xhc3MoJ21vZGFsJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRyb3Bab25lXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGhhbmRsZURyYWdMZWF2ZSwgdHJ1ZSk7XG59XG5mdW5jdGlvbiBoYW5kbGVEcmFnTGVhdmUoZSkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCQoXCIjZHJvcFpvbmVcIikucmVtb3ZlQ2xhc3MoJ21vZGFsJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndyYXBwZXJcIikuY2xhc3NMaXN0LnJlbW92ZSgnbG9ja2VkJyk7XG59XG5mdW5jdGlvbiBoYW5kbGVEcm9wKGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdCQoXCIjZHJvcFpvbmVcIikucmVtb3ZlQ2xhc3MoJ21vZGFsJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHR2YXIgZmlsZXMgPSBlLmRhdGFUcmFuc2Zlci5maWxlcztcblx0aWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRoYW5kbGVGaWxlcyhmaWxlcyk7XG5cdH1cbn1cbmZ1bmN0aW9uIGhhbmRsZURyYWdPdmVyKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbn1cblxuLy9VcGxvYWQgZmlsZSBmcm9tIFwiVXBsb2FkIEZpbGVcIiBCdXR0b25cbmZ1bmN0aW9uIGhhbmRsZVVwbG9hZEZpbGVzQ2xpY2soZSwgY2FsbGJhY2spIHtcblx0dmFyIGZpbGVzSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVzSW5wdXRcIik7XG4gICAgaWYgKCFmaWxlc0lucHV0KSB7XG4gICAgXHRmaWxlc0lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICBmaWxlc0lucHV0LnR5cGUgPSBcImZpbGVcIjtcbiAgICAgICAgZmlsZXNJbnB1dC5tdWx0aXBsZSA9IFwidHJ1ZVwiO1xuICAgICAgICBmaWxlc0lucHV0LmhpZGRlbiA9IHRydWU7XG4gICAgICAgIGZpbGVzSW5wdXQuYWNjZXB0ID0gXCJpbWFnZS8qLCBhdWRpby8qLCB2aWRlby8qXCI7XG4gICAgICAgIGZpbGVzSW5wdXQuaWQgPSBcImZpbGVzSW5wdXRcIjtcbiAgICAgICAgZmlsZXNJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgIGhhbmRsZUZpbGVzKGUudGFyZ2V0LmZpbGVzLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmaWxlc0lucHV0KTtcbiAgICB9XG4gICAgZmlsZXNJbnB1dC5jbGljaygpO1xufVxuXG4vL1Rvb2x0aXBcbmZ1bmN0aW9uIGNyZWF0ZVRvb2x0aXAodGFyZ2V0LCB0ZXh0KSB7XG4gICAgdmFyIHRvb2x0aXAgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCd0b29sdGlwJyksXG4gICAgICAgIHRvb2x0aXBUZXh0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygndG9vbHRpcF9fdGV4dCcpLnRleHQodGV4dCksXG4gICAgICAgIHRvb2x0aXBUb2dnbGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCd0b29sdGlwX190b2dnbGUnKSxcbiAgICAgICAgdG9vbHRpcFRvZ2dsZV9Ub2dnbGUgPSAkKCc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJuZXZlclNob3dUb29sdGlwXCIgLz4nKSwvLy5vbignY2hhbmdlJywgbmV2ZXJTaG93VG9vbHRpcCksXG4gICAgICAgIHRvb2x0aXBUb2dnbGVfTGFiZWwgPSAkKCc8bGFiZWwgZm9yPVwibmV2ZXJTaG93VG9vbHRpcFwiPkdvdCBpdCwgZG9uXFwndCBzaG93IG1lIHRoaXMgYWdhaW48L2xhYmVsPicpO1xuXG4gICAgdG9vbHRpcFRvZ2dsZS5hcHBlbmQodG9vbHRpcFRvZ2dsZV9Ub2dnbGUsIHRvb2x0aXBUb2dnbGVfTGFiZWwpO1xuICAgIHRvb2x0aXBUb2dnbGUuYmluZCgnZm9jdXMgY2xpY2sgY2hhbmdlJywgbmV2ZXJTaG93VG9vbHRpcCk7XG4gICAgdG9vbHRpcC5hcHBlbmQodG9vbHRpcFRleHQsIHRvb2x0aXBUb2dnbGUpO1xuICAgICQoJy5maWxlX19jYXB0aW9uLXRleHRhcmVhJykucmVtb3ZlQXR0cignaWQnKTtcbiAgICAkKHRhcmdldCkucGFyZW50KCkuYXBwZW5kKHRvb2x0aXApO1xuICAgIHRhcmdldC5hdHRyKCdpZCcsICdhY3RpdmUtY2FwdGlvbi10ZXh0YXJlYScpO1xuXG4gICAgdG9vbHRpcC53aWR0aCh0YXJnZXQud2lkdGgoKSk7XG4gICAgaWYgKCQoJ2JvZHknKS53aWR0aCgpIC0gdGFyZ2V0Lm9mZnNldCgpLmxlZnQgLSB0YXJnZXQud2lkdGgoKSAtIHRhcmdldC53aWR0aCgpIC0gMjAgPiAwICkge1xuICAgICAgICB0b29sdGlwLmNzcygnbGVmdCcsIHRhcmdldC5wb3NpdGlvbigpLmxlZnQgKyB0YXJnZXQud2lkdGgoKSArIDEwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0b29sdGlwLmNzcygnbGVmdCcsIHRhcmdldC5wb3NpdGlvbigpLmxlZnQgLSB0YXJnZXQud2lkdGgoKSAtIDEwKTtcbiAgICB9XG4gICAgLy92YXIgbm90SW5jbHVkZSA9IHRvb2x0aXAuYWRkKHRvb2x0aXBUZXh0KS5hZGQodG9vbHRpcFRvZ2dsZSkuYWRkKHRvb2x0aXBUb2dnbGVfTGFiZWwpLmFkZCh0b29sdGlwVG9nZ2xlX1RvZ2dsZSkuYWRkKHRhcmdldCk7XG4gICAgY29uc29sZS5sb2coJCgnI2FjdGl2ZS1jYXB0aW9uLXRleHRhcmVhJykpO1xuICAgICQoJy5jdCwgLm1lbnUnKS5vbihjbG9zZVRvb2x0aXApLmZpbmQoJyNhY3RpdmUtY2FwdGlvbi10ZXh0YXJlYSwgLnRvb2x0aXAsIC50b29sdGlwIGlucHV0LCAudG9vbHRpcCBsYWJlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtlLnN0b3BQcm9wYWdhdGlvbigpO30pO1xufVxuXG5mdW5jdGlvbiBuZXZlclNob3dUb29sdGlwKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9vbHRpcCcsIHRydWUpO1xuICAgIGNsb3NlVG9vbHRpcCgpO1xufVxuXG5mdW5jdGlvbiBjbG9zZVRvb2x0aXAoZSkge1xuICAgIGlmIChlKSB7ZS5zdG9wUHJvcGFnYXRpb24oKTt9XG5cbiAgICBjb25zb2xlLmxvZygnY2xvc2V0b29sdGlwJywgZSk7XG4gICAgJCgnLmN0LCAubWVudScpLnVuYmluZCgnY2xpY2snLCBjbG9zZVRvb2x0aXApO1xuICAgIHZhciB0b29sdGlwcyA9ICQoJy50b29sdGlwJyk7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRvb2x0aXBzLnJlbW92ZSgpO1xuICAgIH0sIDMwMCk7XG59XG5cbi8vTW9kYWwgUHJvbXB0cyBhbmQgV2luZG93c1xuZnVuY3Rpb24gY2xvc2VFZGl0U2NyZWVuKCkge1xuICAkKCcucHInKS5yZW1vdmVDbGFzcygnbW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICQoJy5wciAucHJldmlldycpLnJlbW92ZUNsYXNzKCdmb2NhbCBsaW5lIGZ1bGwgcmVjdCBwb2ludCcpO1xuICAkKCcuZm9jYWxQb2ludCcpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICQoJy5mb2NhbFJlY3QnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAkKCcjZm9jYWxQb2ludFRvZ2dsZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJCgnI2ZvY2FsUmVjdFRvZ2dsZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJCgnLnB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZSAucHVycG9zZS1pbWcnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAkKCcuY3QgLmZpbGUnKS5maW5kKCdidXR0b24nKS5jc3MoJ2Rpc3BsYXknLCAnJyk7XG4gIGRlc2VsZWN0QWxsKCk7XG4gICQoJyN3cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ292ZXJmbG93Jyk7XG4gICQoJ2JvZHknKS5zY3JvbGxUb3Aoc2Nyb2xsUG9zaXRpb24pO1xufVxuXG5mdW5jdGlvbiBzaG93TW9kYWxQcm9tcHQob3B0aW9ucykge1xuICB2YXIgbW9kYWxDbGFzcyA9IG9wdGlvbnMuZGlhbG9nID8gJ21vZGFsIG1vZGFsLS1wcm9tcHQgbW9kYWwtLWRpYWxvZycgOiAnbW9kYWwgbW9kYWwtLXByb21wdCcsXG4gIHNlY0J1dHRvbkNsYXNzID0gb3B0aW9ucy5kaWFsb2cgPyAnYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXknIDogJ2J1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS13aGl0ZScsXG4gIGNsb3NlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX2Nsb3NlJykuY2xpY2sob3B0aW9ucy5jYW5jZWxBY3Rpb24pLFxuICBtb2RhbCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MobW9kYWxDbGFzcyksXG4gIHRpdGxlID0gb3B0aW9ucy50aXRsZSA/ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX190aXRsZScpLnRleHQob3B0aW9ucy50aXRsZSkgOiBudWxsLFxuICB0ZXh0ID0gb3B0aW9ucy50ZXh0ID8gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX3RleHQnKS50ZXh0KG9wdGlvbnMudGV4dCkgOiBudWxsLFxuICBjb250cm9scyA9IG9wdGlvbnMuY29uZmlybUFjdGlvbiB8fCBvcHRpb25zLmNhbmNlbEFjdGlvbiA/ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX19jb250cm9scycpIDogbnVsbCxcbiAgY29uZmlybUJ1dHRvbiA9IG9wdGlvbnMuY29uZmlybUFjdGlvbiA/ICQoJzxidXR0b24+PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbiAgYnV0dG9uX3N0eWxlX291dGxpbmUtYWNjZW50JykudGV4dChvcHRpb25zLmNvbmZpcm1UZXh0IHx8ICdPaycpLmNsaWNrKG9wdGlvbnMuY29uZmlybUFjdGlvbikgOiBudWxsLFxuICBjYW5jZWxCdXR0b24gPSBvcHRpb25zLmNhbmNlbEFjdGlvbiA/ICQoJzxidXR0b24+PC9idXR0b24+JykuYWRkQ2xhc3Moc2VjQnV0dG9uQ2xhc3MpLnRleHQob3B0aW9ucy5jYW5jZWxUZXh0IHx8ICdOZXZlcm1pbmQnKS5jbGljayhvcHRpb25zLmNhbmNlbEFjdGlvbikgOiBudWxsO1xuXG4gIGNvbnRyb2xzLmFwcGVuZChjb25maXJtQnV0dG9uLCBjYW5jZWxCdXR0b24pO1xuICBtb2RhbC5hcHBlbmQoY2xvc2UsIHRpdGxlLCB0ZXh0LCBjb250cm9scyk7XG4gICQoJ2JvZHknKS5hcHBlbmQobW9kYWwpO1xuICBzZXRNb2RhbEtleWJvYXJkQWN0aW9ucyhvcHRpb25zLmNvbmZpcm1BY3Rpb24sIG9wdGlvbnMuY2FuY2VsQWN0aW9uKTtcbn1cblxuZnVuY3Rpb24gaGlkZU1vZGFsUHJvbXB0KCkge1xuICAkKCcub3AubW9kYWwsIC5vcC5kaWFsb2csIC5tb2RhbC5tb2RhbC0tcHJvbXB0JykucmVtb3ZlKCk7XG4gICQoZG9jdW1lbnQpLnVuYmluZCgna2V5ZG93bicpO1xufVxuZnVuY3Rpb24gc2V0TW9kYWxLZXlib2FyZEFjdGlvbnMoZW50ZXIsIGNsb3NlKSB7XG4gIGhhbmRsZUVzY0tleWRvd24gPSBmdW5jdGlvbihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmJvZHkgJiYgZS5rZXlDb2RlID09PSAyNykge2Nsb3NlKCk7fVxuICB9O1xuICBoYW5kbGVFbnRlcktleWRvd24gPSBmdW5jdGlvbihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmJvZHkgJiYgZS5rZXlDb2RlID09PSAxMykge2VudGVyKCk7fVxuICB9O1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG59XG5mdW5jdGlvbiBoYW5kbGVFc2NLZXlkb3duKGUpIHtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgLy9pZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmJvZHkgJiYgZS5rZXlDb2RlID09PSAyNykge2Nsb3NlKCk7fVxufVxuZnVuY3Rpb24gaGFuZGxlRW50ZXJLZXlkb3duKGUpIHtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgLy9pZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmJvZHkgJiYgZS5rZXlDb2RlID09PSAxMykge2VudGVyKCk7fVxufVxuXG5mdW5jdGlvbiBNb2RhbChvcHRpb25zKSB7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgdGhpcy5faW5pdCgpO1xuICB0aGlzLl9pbml0RXZlbnRzKCk7XG59XG5cbk1vZGFsLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm1vZGFsID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuZGlhbG9nID8gJ21vZGFsIG1vZGFsLS1wcm9tcHQgbW9kYWwtLWRpYWxvZycgOiAnbW9kYWwgbW9kYWwtLXByb21wdCBtb2RhbC0tZnVsbCcpO1xuXG4gIHRoaXMuY2xvc2VCdXR0b24gPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fY2xvc2UnKTtcbiAgdGhpcy50aXRsZSA9IHRoaXMub3B0aW9ucy50aXRsZSA/ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX190aXRsZScpLnRleHQodGhpcy5vcHRpb25zLnRpdGxlKSA6IG51bGw7XG4gIHRoaXMudGV4dCA9IHRoaXMub3B0aW9ucy50ZXh0ID8gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX3RleHQnKS50ZXh0KHRoaXMub3B0aW9ucy50ZXh0KSA6IG51bGw7XG5cbiAgdGhpcy5jb250cm9scyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX19jb250cm9scycpO1xuICBpZiAoIXRoaXMub3B0aW9ucy5vbmx5Q2FuY2VsKSB7XG4gICAgdGhpcy5jb25maXJtQnV0dG9uID0gJCgnPGJ1dHRvbiAvPicpLmFkZENsYXNzKCdidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtYWNjZW50JykudGV4dCh0aGlzLm9wdGlvbnMuY29uZmlybVRleHQgfHwgJ09rJyk7XG4gICAgdGhpcy5jb250cm9scy5hcHBlbmQodGhpcy5jb25maXJtQnV0dG9uKTtcbiAgfVxuICBpZiAoIXRoaXMub3B0aW9ucy5vbmx5Q29uZmlybSkge1xuICAgIHRoaXMuY2FuY2VsQnV0dG9uID0gJCgnPGJ1dHRvbiAvPicpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5kaWFsb2cgPyAnYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXknIDogJ2J1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS13aGl0ZScpLnRleHQodGhpcy5vcHRpb25zLmNhbmNlbFRleHQgfHwgJ05ldmVybWluZCcpO1xuICAgIHRoaXMuY29udHJvbHMuYXBwZW5kKHRoaXMuY2FuY2VsQnV0dG9uKTtcbiAgfVxuXG4gIHRoaXMubW9kYWwuYXBwZW5kKHRoaXMuY2xvc2VCdXR0b24sIHRoaXMudGl0bGUsIHRoaXMudGV4dCwgdGhpcy5jb250cm9scyk7XG4gICQoJ2JvZHknKS5hcHBlbmQodGhpcy5tb2RhbCk7XG59O1xuXG5Nb2RhbC5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG4gIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFbnRlcktleWRvd24pO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNvbmZpcm1hdGlvbigpIHtcbiAgICBpZiAoc2VsZi5vcHRpb25zLmNvbmZpcm1BY3Rpb24pIHtzZWxmLm9wdGlvbnMuY29uZmlybUFjdGlvbigpO31cbiAgICBzZWxmLm1vZGFsLnJlbW92ZSgpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBzZWxmLmhhbmRsZUtleURvd24sIHRydWUpO1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZUNhbmNlbGF0aW9uKCkge1xuICAgIGlmIChzZWxmLm9wdGlvbnMuY2FuY2VsQWN0aW9uKSB7c2VsZi5vcHRpb25zLmNhbmNlbEFjdGlvbigpO31cbiAgICBzZWxmLm1vZGFsLnJlbW92ZSgpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBzZWxmLmhhbmRsZUtleURvd24sIHRydWUpO1xuICB9XG5cbiAgc2VsZi5oYW5kbGVLZXlEb3duID0gZnVuY3Rpb24oZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKCFzZWxmLm9wdGlvbnMub25seUNhbmNlbCkge1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtoYW5kbGVDYW5jZWxhdGlvbigpO31cbiAgICB9XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtoYW5kbGVDb25maXJtYXRpb24oKTt9XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gMjcpIHtoYW5kbGVDYW5jZWxhdGlvbigpO31cbiAgfTtcblxuICBpZiAoc2VsZi5jYW5jZWxCdXR0b24pIHtzZWxmLmNhbmNlbEJ1dHRvbi5jbGljayhoYW5kbGVDYW5jZWxhdGlvbik7fVxuICBpZiAoc2VsZi5jb25maXJtQnV0dG9uKSB7c2VsZi5jb25maXJtQnV0dG9uLmNsaWNrKGhhbmRsZUNvbmZpcm1hdGlvbik7fVxuICBzZWxmLmNsb3NlQnV0dG9uLmNsaWNrKGhhbmRsZUNhbmNlbGF0aW9uKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHNlbGYuaGFuZGxlS2V5RG93biwgdHJ1ZSk7XG59O1xuXG4vL0Fzc2V0IGxpYnJhcnlcbnZhciBhc3NldExpYnJhcnlPYmplY3RzID0gW1xuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS0yLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0yLmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtMi5qcGcnLFxuICAgIGNhcHRpb246ICcwNS4gRG9uXFwndCBHZXQgTG9zdCcsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS0zLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0zLmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtMy5qcGcnLFxuICAgIGNhcHRpb246ICcwMi4gVGhlIE1hbiBpbiB0aGUgU2hhZG93cycsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS00LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS00LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtNC5qcGcnLFxuICAgIGNhcHRpb246ICcwMy4gVGhlIEZpcnN0IFNsaWNlJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWVwaXNvZGUtNS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItZXBpc29kZS01LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItZXBpc29kZS01LmpwZycsXG4gICAgY2FwdGlvbjogJzAxLiBBIE5ldyBWaXNpdG9yJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTUuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTUuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS01LmpwZycsXG4gICAgY2FwdGlvbjogJzA0LiBUaGUgQmxvb2QgTW9vbicsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS0xMC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtMTAuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS0xMC5qcGcnLFxuICAgIGNhcHRpb246ICcwMy4gVGhlIEZpcnN0IFNsaWNlJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTEzLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0xMy5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTEzLmpwZycsXG4gICAgY2FwdGlvbjogJzAxLiBBIE5ldyBWaXNpdG9yJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTE1LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0xNS5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTE1LmpwZycsXG4gICAgY2FwdGlvbjogJzAxLiBBIE5ldyBWaXNpdG9yJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTExLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0xMS5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdUcmFpbGVyIEUwMycsXG4gICAgY2FwdGlvbjogJzA2LiBBbGwgQWxvbmUnLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICd2aWRlbydcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtOS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtOS5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTkuanBnJyxcbiAgICBjYXB0aW9uOiAnMDQuIFRoZSBCbG9vZCBNb29uJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTguanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTguanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS04LmpwZycsXG4gICAgY2FwdGlvbjogJzA0LiBUaGUgQmxvb2QgTW9vbicsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS02LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS02LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtNi5qcGcnLFxuICAgIGNhcHRpb246ICcwNi4gQWxsIEFsb25lJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAxLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnYXp0ZWNfdGVtcGxlLnBuZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDEuanBnJyxcbiAgICBjYXB0aW9uOiAnV3JpdGVyLCBCcmlhbiBNaWxsaWtpbiwgYSBtYW4gYWJvdXQgSGF2ZW4sIHRha2VzIHVzIGJlaGluZCB0aGUgc2NlbmVzIG9mIHRoaXMgZXBpc29kZSBhbmQgZ2l2ZXMgdXMgYSBmZXcgdGVhc2VzIGFib3V0IHRoZSBTZWFzb24gdGhhdCB3ZSBjYW5cXCd0IHdhaXQgdG8gc2VlIHBsYXkgb3V0ISBUaGlzIGlzIHRoZSBmaXJzdCBlcGlzb2RlIG9mIEhhdmVuIG5vdCBmaWxtZWQgaW4gb3IgYXJvdW5kIENoZXN0ZXIsIE5vdmEgU2NvdGlhLiBCZWdpbm5pbmcgaGVyZSwgdGhlIHNob3cgYW5kIGl0cyBzdGFnZXMgcmVsb2NhdGVkIHRvIEhhbGlmYXguJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDIuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdiaWdfYmVuLnBuZyA0M2RlZnF3ZScsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNGREJEMDAnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMi5qcGcnLFxuICAgIGNhcHRpb246ICdDaGFybG90dGUgbGF5cyBvdXQgaGVyIHBsYW4gZm9yIHRoZSBmaXJzdCB0aW1lIGluIHRoaXMgZXBpc29kZTogdG8gYnVpbGQgYSBuZXcgQmFybiwgb25lIHRoYXQgd2lsbCBjdXJlIFRyb3VibGVzIHdpdGhvdXQga2lsbGluZyBUcm91YmxlZCBwZW9wbGUgaW4gdGhlIHByb2Nlc3MuIEhlciBwbGFuLCBhbmQgd2hhdCBwYXJ0cyBpdCByZXF1aXJlcywgd2lsbCBjb250aW51ZSB0byBwbGF5IGEgbW9yZSBhbmQgbW9yZSBpbXBvcnRhbnQgcm9sZSBhcyB0aGUgc2Vhc29uIGdvZXMgYWxvbmcuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAzLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnY2hyaXN0X3RoZV9yZWRlZW1lci5wbmcgMDkybmx4bmMnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjRUQ0MTJEJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDMuanBnJyxcbiAgICBjYXB0aW9uOiAnTG9zdCB0aW1lIHBsYXlzIGFuIGV2ZW4gbW9yZSBpbXBvcnRhbnQgcm9sZSBpbiB0aGlzIGVwaXNvZGUgdGhhbiBldmVyIGJlZm9yZeKAlCBhcyBpdOKAmXMgcmV2ZWFsZWQgdGhhdCBpdOKAmXMgYSB3ZWFwb24gdGhlIGdyZWF0IGV2aWwgZnJvbSBUaGUgVm9pZCBoYXMgYmVlbiB1c2luZyBhZ2FpbnN0IHVzLCBhbGwgc2Vhc29uIGxvbmcuIFdoaWNoIGdvZXMgYmFjayB0byB0aGUgY2F2ZSB1bmRlciB0aGUgbGlnaHRob3VzZSBpbiBiZWdpbm5pbmcgb2YgdGhlIFNlYXNvbiA1IHByZW1pZXJlLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdMb3N0IHRpbWUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wNC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ2NvbG9zc2V1bS5wbmcgLTRyanhuc2snLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjMzJBNEI3JyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDQuanBnJyxcbiAgICBjYXB0aW9uOiAnVGhlIOKAnGFldGhlciBjb3Jl4oCdIHRoYXQgQ2hhcmxvdHRlIGFuZCBBdWRyZXkgbWFrZSBwcmVzZW50ZWQgYW4gaW1wb3J0YW50IGRlc2lnbiBjaG9pY2UuIFRoZSB3cml0ZXJzIHdhbnRlZCBpdCB0byBsb29rIG9yZ2FuaWMgYnV0IGFsc28gZGVzaWduZWTigJQgbGlrZSB0aGUgdGVjaG5vbG9neSBvZiBhbiBhZHZhbmNlZCBjdWx0dXJlIGZyb20gYSBkaWZmZXJlbnQgZGltZW5zaW9uLCBjYXBhYmxlIG9mIGRvaW5nIHRoaW5ncyB0aGF0IHdlIG1pZ2h0IHBlcmNlaXZlIGFzIG1hZ2ljIGJ1dCB3aGljaCBpcyBqdXN0IHNjaWVuY2UgdG8gdGhlbS4gVGhlIHZhcmlvdXMgZGVwaWN0aW9ucyBvZiBLcnlwdG9uaWFuIHNjaWVuY2UgaW4gdmFyaW91cyBTdXBlcm1hbiBzdG9yaWVzIHdhcyBvbmUgaW5zcGlyYXRpb24uJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZSBhbmQgQXVkcmV5JyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDUuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdlYXN0ZXJfaXNsYW5kLnBuZyBubG40bmthMCcsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDEwLCAyNSksXG4gICAgY29sb3I6ICcjRDNFQ0VDJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDUuanBnJyxcbiAgICBjYXB0aW9uOiAnVGhpcyBpcyB0aGUgZmlyc3QgZXBpc29kZSBpbiBTZWFzb24gNSBpbiB3aGljaCB3ZeKAmXZlIGxvc3Qgb25lIG9mIG91ciBoZXJvZXMuIEl0IHdhcyBpbXBvcnRhbnQgdG8gaGFwcGVuIGFzIHdlIGhlYWQgaW50byB0aGUgaG9tZSBzdHJldGNoIG9mIHRoZSBzaG93IGFuZCBhcyB0aGUgc3Rha2VzIGluIEhhdmVuIGhhdmUgbmV2ZXIgYmVlbiBtb3JlIGRpcmUuIEFzIGEgcmVzdWx0LCBpdCB3b27igJl0IGJlIHRoZSBsYXN0IGxvc3Mgd2VcXCdsbCBzdWZmZXIgdGhpcyBzZWFzb27igKYnLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnV2lsZCBDYXJkJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDYuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdweXJhbWlkcy5wbmcgZmRieTY0JyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTAsIDI1KSxcbiAgICBjb2xvcjogJyMyQTdDOTEnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wNi5qcGcnLFxuICAgIGNhcHRpb246ICdUaGUgY2hhbGxlbmdlIGluIENoYXJsb3R0ZVxcJ3MgZmluYWwgY29uZnJvbnRhdGlvbiB3YXMgdGhhdCB0aGUgc2hvdyBjb3VsZG7igJl0IHJldmVhbCBoZXIgYXR0YWNrZXLigJlzIGFwcGVhcmFuY2UgdG8gdGhlIGF1ZGllbmNlLCBzbyB0aGUgZGFya25lc3Mgd2FzIG5lY2Vzc2l0YXRlZC4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcblxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wMS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3Nhbl9mcmFuY2lzb19icmlkZ2UucG5nIDQyMzRmZjUyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTAsIDI1KSxcbiAgICBjb2xvcjogJyM5Njc4NDAnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wMS5qcGcnLFxuICAgIGNhcHRpb246ICdXYXJuaW5nOiBJZiB5b3UgZG9uXFwndCB3YW50IHRvIGtub3cgd2hhdCBoYXBwZW5lZCBpbiB0aGlzIGVwaXNvZGUsIGRvblxcJ3QgcmVhZCB0aGlzIHBob3RvIHJlY2FwISBEYXZlIGp1c3QgaGFkIGFub3RoZXIgdmlzaW9uIGFuZCB0aGlzIHRpbWUsIGhlXFwncyBiZWluZyBwcm9hY3RpdmUgYWJvdXQgaXQuIEhlIGFuZCBWaW5jZSBkYXNoIG91dCBvZiB0aGUgaG91c2UgdG8gc2F2ZSB0aGUgbGF0ZXN0IHZpY3RpbXMgb2YgQ3JvYXRvYW4sIGEuay5hIHRoZSBObyBNYXJrcyBLaWxsZXIuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAyLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc3RvbmVfaGVuZ2UucG5nIDQ5MG1ubWFiZCcsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDEwLCAyNSksXG4gICAgY29sb3I6ICcjNTY2Rjc4JyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDIuanBnJyxcbiAgICBjYXB0aW9uOiAnTWVhbndoaWxlLCBEd2lnaHQgYW5kIE5hdGhhbiBnbyBkb3dudG93biB0byBpbnZlc3RpZ2F0ZSB3aGF0IHRoZXkgdGhpbmsgaXMgYSBkcnVua2VuIG1hbiBjYXVzaW5nIGEgZGlzdHVyYmFuY2UgYnV0IGl0IHR1cm5zIG91dCB0aGF0IHRoZSBndXkgaXMgY3Vyc2VkLiBUaGVyZSBpcyBhIHJvbWFuIG51bWVyYWwgb24gaGlzIHdyaXN0IGFuZCwgYXMgdGhleSB3YXRjaCwgaW52aXNpYmxlIGhvcnNlcyB0cmFtcGxlIGhpbS4gTGF0ZXIsIE5hdGhhbiBhbmQgRHdpZ2h0IGZpbmQgYW5vdGhlciBtYW4gd2hvIGFwcGVhcnMgdG8gaGF2ZSBiZWVuIHN0cnVjayBieSBsaWdodGVuaW5nIOKAkyBidXQgdGhlcmUgaGFkIGJlZW4gbm8gcmVjZW50IHN0b3JtIGluIHRvd24g4oCTIGFuZCBkcm9wcGVkIGZyb20gYSBza3lzY3JhcGVyLiBTa3lzY3JhcGVycyBpbiBIYXZlbj8gQWJzdXJkLiBBbmQgdGhlIGd1eSBhbHNvIGhhcyBhIG15c3RlcmlvdXMgUm9tYW4gbnVtZXJhbCB0YXR0b28gb24gaGlzIHdyaXN0LiBOYXRoYW4gYW5kIER3aWdodCBmaW5kIGEgbGlzdCBvZiBuYW1lcyBpbiB0aGUgZ3V5XFwncyBwb2NrZXQgdGhhdCBsZWFkcyB0aGVtIHRvIGEgbG9jYWwgZm9ydHVuZSB0ZWxsZXIsIExhaW5leS4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDMuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzeWRuZXlfb3BlcmFfaG91c2UucG5nIDBzZWQ2N2gnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMCwgMjUpLFxuICAgIGNvbG9yOiAnIzJFMUQwNycsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAzLmpwZycsXG4gICAgY2FwdGlvbjogJ0J5IGZvbGxvd2luZyB0aGUgY2x1ZXMgZnJvbSBEYXZlXFwncyB2aXNpb24sIGhlIGFuZCBWaW5jZSBmaW5kIHRoZSBzY2VuZSBvZiB0aGUgTm8gTWFyayBLaWxsZXJcXCdzIG1vc3QgcmVjZW50IGNyaW1lLiBUaGV5IGFsc28gZmluZCBhIHN1cnZpdm9yLiBVbmZvcnR1bmF0ZWx5LCBzaGUgY2FuXFwndCByZW1lbWJlciBhbnl0aGluZy4gSGVyIG1lbW9yeSBoYXMgYmVlbiB3aXBlZCwgd2hpY2ggZ2V0cyB0aGVtIHRvIHRoaW5raW5nIGFib3V0IHdobyBtYXkgYmUgbmV4dCBvbiBDcm9hdG9hblxcJ3MgbGlzdC4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDQuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd0YWpfbWFoYWwucG5nIDk0M25ia2EnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMCwgMjUpLFxuICAgIGNvbG9yOiAnIzAwNDQ1RicsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA0LmpwZycsXG4gICAgY2FwdGlvbjogJ09uIHRoZWlyIHdheSB0byBtZWV0IHdpdGggTGFpbmV5LCBOYXRoYW4gYnJlYWtzIGhpcyB0aXJlIGlyb24gd2hpbGUgdHJ5aW5nIHRvIGZpeCBhIGZsYXQgdGlyZS4gVG91Z2ggYnJlYWsuIEFuZCB0aGVuIER3aWdodCBnZXRzIGEgc2hvb3RpbmcgcGFpbiBpbiBoaXMgc2lkZSB3aXRoIGEgZ25hcmx5IGJydWlzZSB0byBtYXRjaCwgZXZlbiB0b3VnaGVyIGJyZWFrLiBBbmQgdGhlbiBib3RoIGd1eXMgbm90aWNlIHRoYXQgdGhleSBub3cgaGF2ZSBSb21hbiBudW1lcmFsIHRhdHRvb3Mgb24gdGhlaXIgd3Jpc3RzLiBUaGUgbnVtYmVyIFggZm9yIE5hdGhhbiBhbmQgWElJIGZvciBEd2lnaHQuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA1LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnd2luZG1pbGwucG5nIGplcmwzNCcsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxMSksXG4gICAgY29sb3I6ICcjMkYzODM3JyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDUuanBnJyxcbiAgICBjYXB0aW9uOiAnSW4gdGhlIG1pbmVzaGFmdCwgQ2hhcmxvdHRlIGFuZCBBdWRyZXkgaGF2ZSB0YWtlbiBvbiB0aGUgdGFzayBvZiBjb2xsZWN0aW5nIGFsbCBvZiB0aGUgYWV0aGVyIHRvIGNyZWF0ZSBhbiBhZXRoZXIgY29yZS4gVGhpcyBpcyB0aGUgZmlyc3Qgc3RlcCB0aGV5IG5lZWQgdG8gY3JlYXRlIGEgbmV3IEJhcm4gd2hlcmUgVHJvdWJsZSBwZW9wbGUgY2FuIHN0ZXAgaW5zaWRlIGFuZCB0aGVuIGJlIFwiY3VyZWRcIiBvZiB0aGVpciBUcm91YmxlcyB3aGVuIHRoZXkgc3RlcCBvdXQuIFNvdW5kcyBlYXN5IGVub3VnaCBidXQgdGhleVxcJ3JlIGhhdmluZyB0cm91YmxlIGNvcnJhbGxpbmcgYWxsIHRoZSBhZXRoZXIgaW50byBhIGdpYW50IGJhbGwuIFVuc3VycHJpc2luZ2x5LCB0aGUgc3dpcmxpbmcgYmxhY2sgZ29vIGlzblxcJ3Qgd2lsbGZ1bGx5IGNvb3BlcmF0aW5nLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3RyZWVfMS5wbmcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTQpLFxuICAgIGNvbG9yOiAnIzYzNjI0QycsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA2LmpwZycsXG4gICAgY2FwdGlvbjogJ0FzIGlmIHRoZSBhZXRoZXIgd2FzblxcJ3QgZW5vdWdoIG9mIGEgcHJvYmxlbSB0byB0YWNrbGUsIENoYXJsb3R0ZSBmZWVscyBoZXJzZWxmIGdldHRpbmcgd2Vha2VyIGJ5IHRoZSBtaW51dGUgYW5kIHRoZW4gQXVkcmV5IHN0YXJ0cyB0byBsb3NlIGhlciBleWVzaWdodC4gVGhleSBsb29rIGF0IHRoZWlyIHdyaXN0cyBhbmQgbm90aWNlIHRoYXQgdGhlIFJvbWFuIG51bWJlciBwcm9ibGVtIGhhcyBub3cgYWZmZWN0ZWQgdGhlbSB0b28sIHRoZSBudW1iZXJzIElJIGZvciBBdWRyZXkgYW5kIFZJSUkgZm9yIENoYXJsb3R0ZS4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDcuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd0cmVlXzIucG5nJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDE0KSxcbiAgICBjb2xvcjogJyM0QTUwNEUnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNy5qcGcnLFxuICAgIGNhcHRpb246ICdJbiBOb3J0aCBDYXJvbGluYSwgRHVrZSBhbmQgU2V0aCBzaXQgd2l0aCBhIGxvY2FsIG1hbiB3aG8gY2xhaW1zIHRvIGJlIGFibGUgdG8gcmVtb3ZlIHRoZSBcImJsYWNrIHRhclwiIGZyb20gRHVrZVxcJ3Mgc291bC4gQWZ0ZXIgYW4gZWxhYm9yYXRlIHBlcmZvcm1hbmNlLCBEdWtlIHJlYWxpemVzIHRoYXQgdGhlIGd1eSBpcyBhIGZha2UuIFRoZSByYXR0bGVkIGd1eSB3aG8gZG9lc25cXCd0IHdhbnQgYW55IHRyb3VibGUgZnJvbSBEdWtlIHRlbGxzIHRoZW0gdGhhdCBXYWx0ZXIgRmFyYWR5IHdpbGwgaGF2ZSB0aGUgcmVhbCBhbnN3ZXJzIHRvIER1a2VcXCdzIHF1ZXN0aW9ucy4gV2hlbiB0aGV5IGdvIGxvb2tpbmcgZm9yIFdhbHRlciwgdGhleSBmaW5kIGhpbSDigKYgYW5kIGhpcyBoZWFkc3RvbmUgdGhhdCBoYXMgYSBmYW1pbGlhciBtYXJraW5nIG9uIGl0LCB0aGUgc3ltYm9sIGZvciBUaGUgR3VhcmQuIFdoYXQgZ2l2ZXM/IEp1c3QgYXMgRHVrZSBpcyBhYm91dCB0byBnaXZlIHVwIGhlIGdldHMgYSB2aXNpdCBmcm9tIFdhbHRlclxcJ3MgZ2hvc3Qgd2hvIHByb21pc2VzIHRvIGdpdmUgaGltIGFuc3dlcnMgdG8gYWxsIG9mIHRoZSBxdWVzdGlvbnMg4oCmdmlhIHRoZSBuZXh0IGVwaXNvZGUgb2YgY291cnNlLiBDbGlmZmhhbmdlciEnLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDguanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd0cmVlXzMucG5nJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDE0KSxcbiAgICBjb2xvcjogJyNERDlGMDAnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wOC5qcGcnLFxuICAgIGNhcHRpb246ICdBZnRlciBzb21lIHByb2RkaW5nLCBEd2lnaHQgYW5kIE5hdGhhbiBmaW5kIHRoYXQgTGFpbmV5IGdvdCBhIHZpc2l0IGZyb20gQ3JvYXRvYW4gYW5kIFwibG9zdCB0aW1lXCIuIFNoZSBkb2VzblxcJ3QgcmVtZW1iZXJpbmcgZHJhd2luZyBjYXJkcyBmb3IgYW55IG9mIHRoZW0uIE5hdGhhbiBoYXMgaGVyIGRyYXcgbmV3IGNhcmRzIGFuZCBhIGhlc2l0YW50IExhaW5leSBkb2VzLiBEd2lnaHQgaXMgZ2l2ZW4gYSBib25kYWdlIGZhdGUgYW5kIGlzIGxhdGVyIHNoYWNrbGVkIGJ5IGNoYWlucyB0byBhIGdhdGUsIENoYXJsb3R0ZSB3aWxsIGJlIHJldW5pdGVkIHdpdGggaGVyIHRydWUgbG92ZSAoaG1t4oCmKSBhbmQgQXVkcmV5IGlzIGFsaWduZWQgd2l0aCB0aGUgbW9vbi4gTm90IHBlcmZlY3QgZmF0ZXMsIGJ1dCBpdFxcJ3MgZW5vdWdoIHRvIGdldCBldmVyeW9uZSBvdXQgb2YgdGhlIHBpY2tsZXMgdGhlaXIgY3VycmVudGx5IGluLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wOS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3RyZWVfNC5wbmcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTQpLFxuICAgIGNvbG9yOiAnIzhGQzk5QicsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA5LmpwZycsXG4gICAgY2FwdGlvbjogJ1dpdGggdGhlaXIgc3RyZW5ndGggcmVnYWluZWQsIEF1ZHJleSBhbmQgQ2hhcmxvdHRlIGFyZSBhYmxlIHRvIGNyZWF0ZSB0aGUgYWV0aGVyIGNvcmUgdGhleSBuZWVkLiBDaGFybG90dGUgaW5zdHJ1Y3RzIEF1ZHJleSB0byBnbyBhbmQgaGlkZSBpdCBzb21lIHBsYWNlIHNhZmUuIEluIHRoZSBpbnRlcmltLCBDaGFybG90dGUga2lzc2VzIER3aWdodCBnb29kYnllIGFuZCBnaXZlcyBoaW0gdGhlIHJpbmcgc2hlIG9uY2UgdXNlZCB0byBzbGlwIGludG8gVGhlIFZvaWQuIExhdGVyLCB3aXRoIGhlciBtb29uIGFsaWdubWVudCBjYXVzaW5nIEF1ZHJleSB0byBkaXNhcHBlYXIgYW5kIER3aWdodCBzdGlsbCBzaGFja2xlZCwgTGFpbmV5IHB1bGxzIGFub3RoZXIgY2FyZCBmb3IgdGhlIGVudGlyZSBncm91cCwgYSBqdWRnbWVudCBjYXJkLCB3aGljaCBzaGUgcmVhZHMgdG8gbWVhbiB0aGF0IGFzIGFsb25nIGFzIHRoZWlyIGludGVudGlvbnMgYXJlIHB1cmUgdGhleSBjYW4gYWxsIG92ZXJjb21lIGFueSBvYnN0YWNsZXMuIFRoaXMgaXMgZ3JlYXQgbmV3cyBmb3IgZXZlcnlvbmUgZXhjZXB0Li4uJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzEwLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAndHJlZV81LnBuZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxNCksXG4gICAgY29sb3I6ICcjQkZDOUEyJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMTAuanBnJyxcbiAgICBjYXB0aW9uOiAnQ2hhcmxvdHRlLiBDcm9hdG9hbiBwYXlzIGhlciBhIHZpc2l0IGluIGhlciBhcGFydG1lbnQgdG8gdGVsbCBoZXIgdGhhdCBoZVxcJ3MgcGlzc2VkIHRoYXQgc2hlXFwncyBcIm9uZSBvZiB0aGVtIG5vd1wiIGFuZCB0aGF0IHNoZSBjaG9zZSBBdWRyZXkgb3ZlciBNYXJhLiBDcm9hdG9hbiB3YXN0ZXMgbm8gdGltZSBpbiBraWxsaW5nIENoYXJsb3R0ZSBhbmQgc2hlIGNsaW5ncyB0byBsaWZlIGZvciBqdXN0IGVub3VnaCB0aW1lIHRvIGJlIGZvdW5kIGJ5IEF1ZHJleSBzbyBzaGUgY2FuIGdpdmUgaGVyIHRoZSBtb3N0IHNob2NraW5nIG5ld3Mgb2YgdGhlIHNlYXNvbjogQ3JvYXRvYW4gaXMgQXVkcmV5XFwncyBmYXRoZXIgYW5kIGhlXFwncyBnb3QgXCJwbGFuc1wiIGZvciBoZXIhJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zMDVfZTA1MTNfMDFfQ0NfMTkyMHgxMDgwLmpwZycsXG4gICAgaWQ6ICd2aWRlb19fMTIzJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDE0KSxcbiAgICBjb2xvcjogJyNCRkM5QTInLFxuICAgIHRpdGxlOiAnczA1X2UwNTEzXzAxX0NDXzE5MjB4MTA4MCcsXG4gICAgZGVzY3JpcHRpb246ICdOb3cgdGhhdCBEci4gQ3Jvc3MgaGFzIHJldmVhbGVkIGhlciB0cnVlIGlkZW50aXR5LCBldmVyeW9uZSBoYXMgbG90cyBvZiBmZWVsaW5ncy4gRHdpZ2h0IGNhblxcJ3QgZ2V0IG92ZXIgZmVlbGluZyBsaWtlIHNoZSBkdXBlZCBoaW0sIEF1ZHJleSB0aGlua3MgRHIuIENyb3NzIG11c3QgY2FyZSBtb3JlIGFib3V0IE1hcmEgdGhhbiBzaGUgZG9lcyBhYm91dCBoZXIgYW5kIE5hdGhhbiBpcyBoYXBweSB0aGF0IHRoZXJlIGlzIHNvbWVvbmUgZWxzZSBpbiB0b3duIHdobyBoZSBjYW4gZmVlbC4nLFxuICAgIHR5cGU6ICd2aWRlbycsXG4gICAgcGxheWVyOiAnQnJhbmQgVk9EIFBsYXllcicsXG4gICAgZXBpc29kZU51bWJlcjogJzEwJyxcbiAgICBrZXl3b3JkczogJ1RoZSBFeHBhbmNlLCBTYWx2YWdlLCBNaWxsZXIsIEp1bGllIE1hbywgSG9sZGVuLCBUcmFpbGVyJyxcblxuICAgIGFkZGVkQnlVc2VySWQ6IDM0NDg3MjMsXG4gICAgYXV0aG9yOiAnSmFzb24gTG9uZycsXG4gICAgZXhwaXJhdGlvbkRhdGU6ICcyMDE1LTAzLTIzIDEwOjU3OjA0JyxcbiAgICBndWlkOiAnMEQ2NjBCRDYtMDk2OC00RjcyLTdBQkMtNDcyMTU3REZBQ0FCJyxcbiAgICBsaW5rOiAnY2Fub25pY2FsdXJsNzBmYTYyZmM2YicsXG4gICAgbGlua1VybDogJ2h0dHA6Ly9wcm9kLnB1Ymxpc2hlcjcuY29tL2ZpbGUvNzgwNidcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzA2LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDYucG5nJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMSwgMTQpLFxuICAgIGNvbG9yOiAnI0JGQzlBMicsXG4gICAgdGl0bGU6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8wNi5qcGcnLFxuICAgIGNhcHRpb246ICdBbGVpc3RlciBjb250aW51ZXMgaGlzIGNoYXJtaW5nIGNvcnJ1cHRpb24gb2YgU2F2YW5uYWgsIHRlbGxpbmcgaGVyIHNoZVxcJ3Mga2VwdCBsb2NrZWQgaW4gaGVyIHJvb20gdG8ga2VlcCBoZXIgc2FmZSBmcm9tIGhlciBuZXcgd2VyZXdvbGYgbmVpZ2hib3IgYW5kIGVuY291cmFnaW5nIGhlciB0byB1c2UgaGVyIGxlZnQgaGFuZCB3aGVuIHdpZWxkaW5nIGhlciBhYmlsaXRpZXMuIFNhdmFubmFoXFwncyBnZXR0aW5nIG1vcmUgcG93ZXJmdWwgZXZlcnkgZGF5LicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICcnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ0JpdHRlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWUxLTMuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWU2LmpwZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDEsIDE0KSxcbiAgICBjb2xvcjogJyNCRkM5QTInLFxuICAgIHRpdGxlOiAnc2xhc2hlci1lNi5qcGcnLFxuICAgIGNhcHRpb246ICdBbGVpc3RlciBjb250aW51ZXMgaGlzIGNoYXJtaW5nIGNvcnJ1cHRpb24gb2YgU2F2YW5uYWgsIHRlbGxpbmcgaGVyIHNoZVxcJ3Mga2VwdCBsb2NrZWQgaW4gaGVyIHJvb20gdG8ga2VlcCBoZXIgc2FmZSBmcm9tIGhlciBuZXcgd2VyZXdvbGYgbmVpZ2hib3IgYW5kIGVuY291cmFnaW5nIGhlciB0byB1c2UgaGVyIGxlZnQgaGFuZCB3aGVuIHdpZWxkaW5nIGhlciBhYmlsaXRpZXMuIFNhdmFubmFoXFwncyBnZXR0aW5nIG1vcmUgcG93ZXJmdWwgZXZlcnkgZGF5LicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICcnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ0JpdHRlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL2NvbnRlbnQvbGlzdGljbGUtaW1nLTMuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdsaXN0aWNsZS1pbWctMy5qcGcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAxLCAxNCksXG4gICAgY29sb3I6ICcjQkZDOUEyJyxcbiAgICB0aXRsZTogJ01yLl9Sb2JvdF9TMV9FcDAzX0Nob2ljZXNfY2xpcCcsXG4gICAgY2FwdGlvbjogJ0FsZWlzdGVyIGNvbnRpbnVlcyBoaXMgY2hhcm1pbmcgY29ycnVwdGlvbiBvZiBTYXZhbm5haCwgdGVsbGluZyBoZXIgc2hlXFwncyBrZXB0IGxvY2tlZCBpbiBoZXIgcm9vbSB0byBrZWVwIGhlciBzYWZlIGZyb20gaGVyIG5ldyB3ZXJld29sZiBuZWlnaGJvciBhbmQgZW5jb3VyYWdpbmcgaGVyIHRvIHVzZSBoZXIgbGVmdCBoYW5kIHdoZW4gd2llbGRpbmcgaGVyIGFiaWxpdGllcy4gU2F2YW5uYWhcXCdzIGdldHRpbmcgbW9yZSBwb3dlcmZ1bCBldmVyeSBkYXkuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJycsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnQml0dGVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAndmlkZW8nXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvY29udGVudC9saXN0aWNsZS1pbWctMi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ2xpc3RpY2xlLWltZy0yLmpwZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDEsIDE0KSxcbiAgICBjb2xvcjogJyNCRkM5QTInLFxuICAgIHRpdGxlOiAnTXIuX1JvYm90X1MxX0VwMDRfV2l0aGRyYXdsX2NsaXAnLFxuICAgIGNhcHRpb246ICdBbGVpc3RlciBjb250aW51ZXMgaGlzIGNoYXJtaW5nIGNvcnJ1cHRpb24gb2YgU2F2YW5uYWgsIHRlbGxpbmcgaGVyIHNoZVxcJ3Mga2VwdCBsb2NrZWQgaW4gaGVyIHJvb20gdG8ga2VlcCBoZXIgc2FmZSBmcm9tIGhlciBuZXcgd2VyZXdvbGYgbmVpZ2hib3IgYW5kIGVuY291cmFnaW5nIGhlciB0byB1c2UgaGVyIGxlZnQgaGFuZCB3aGVuIHdpZWxkaW5nIGhlciBhYmlsaXRpZXMuIFNhdmFubmFoXFwncyBnZXR0aW5nIG1vcmUgcG93ZXJmdWwgZXZlcnkgZGF5LicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICcnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ0JpdHRlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ3ZpZGVvJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL2NvbnRlbnQvbGlzdGljbGUtaW1nLTEuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdsaXN0aWNsZS1pbWctMS5qcGcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAxLCAxNCksXG4gICAgY29sb3I6ICcjQkZDOUEyJyxcbiAgICB0aXRsZTogJ01yLl9Sb2JvdF9TMV9FcDA2X1NoYXlsYXNfRmF0ZV9jbGlwJyxcbiAgICBjYXB0aW9uOiAnQWxlaXN0ZXIgY29udGludWVzIGhpcyBjaGFybWluZyBjb3JydXB0aW9uIG9mIFNhdmFubmFoLCB0ZWxsaW5nIGhlciBzaGVcXCdzIGtlcHQgbG9ja2VkIGluIGhlciByb29tIHRvIGtlZXAgaGVyIHNhZmUgZnJvbSBoZXIgbmV3IHdlcmV3b2xmIG5laWdoYm9yIGFuZCBlbmNvdXJhZ2luZyBoZXIgdG8gdXNlIGhlciBsZWZ0IGhhbmQgd2hlbiB3aWVsZGluZyBoZXIgYWJpbGl0aWVzLiBTYXZhbm5haFxcJ3MgZ2V0dGluZyBtb3JlIHBvd2VyZnVsIGV2ZXJ5IGRheS4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdCaXR0ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICd2aWRlbydcbiAgfSAgICBcblxuICAvKixcbiAge1xuICB1cmw6ICdpbWcvcmVhbC9CaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8wNy5qcGcnLFxuICBmb2NhbFBvaW50OiB7XG4gIGxlZnQ6IDAuNSxcbiAgdG9wOiAwLjVcbn0sXG5pZDogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzA3LnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE0KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzA3LmpwZycsXG5jYXB0aW9uOiAnTWVhbndoaWxlLCBMb2dhbiBoYXMgaW5maWx0cmF0ZWQgdGhlIGNvbXBvdW5kIGFuZCBmaW5kcyBoaXMgYmVsb3ZlZCBSYWNoZWwuIEhlIG1hbmFnZXMgdG8gZnJlZSBoZXIgLi4uIGJ1dCBob3cgZmFyIHdpbGwgdGhleSBnZXQ/JyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JpdHRlbicsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8xNy5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzE3LnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE0KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzE3LmpwZycsXG5jYXB0aW9uOiAnRWxlbmEgd2FrZXMgdXAgdG8gZmluZCBoZXJzZWxmIGluIGEgbmV3IGNlbGwgLi4uJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JpdHRlbicsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8xOC5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzE4LnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE0KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzE4LmpwZycsXG5jYXB0aW9uOiAnLi4uIGFuZCBSaWNoYXJkLCB0aGUgbXV0dCBzaGUgaW50ZXJyb2dhdGVkIGluIEVwaXNvZGUgMSwgaW4gYW5vdGhlci4gUmljaGFyZCBpcyBlbnJhZ2VkIHRoYXQgRWxlbmEgZ2F2ZSBoaW0gdXAgdG8gdGhlc2UgXCJzYWRpc3RpYyBiYXN0YXJkc1wiIGFuZCBhbGwgdG9vIHdpbGxpbmcgdG8gZW5nYWdlIGluIFNvbmRyYVxcJ3MgZXhwZXJpbWVudCB0byBcIm9ic2VydmUgY29tYmF0XCI6IGluIHRoZW9yeSwgRWxlbmEgd2lsbCBoYXZlIHRvIHR1cm4gaW50byBhIHdvbGYgdG8gZGVmZW5kIGhlcnNlbGYgYWdhaW5zdCBSaWNoYXJkXFwncyBhdHRhY2suJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JpdHRlbicsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yMS5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzIxLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE0KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzIxLmpwZycsXG5jYXB0aW9uOiAnT24gaGlnaGVyIGdyb3VuZCwgUmFjaGVsIGFuZCBMb2dhbiBhcmUgbWFraW5nIGEgcnVuIGZvciBpdCwgdGhvdWdoIHRoZSBzeW1ib2wgb24gUmFjaGVsXFwncyBuZWNrIHN0YXJ0cyB0byBzbW9rZSAuLi4nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzIyLmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjIucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjIuanBnJyxcbmNhcHRpb246ICcuLi4gd2hpY2ggYWxzbyBzbG93cyBkb3duIEVsZW5hLCBhZnRlciBSaWNoYXJkLXdvbGYgc3VmZmVycyB0aGUgc2FtZSBibG9vZHkgZmF0ZSBhcyBOYXRlIFBhcmtlciBkaWQgaW4gRXBpc29kZSAxLiBSYWNoZWwsIEVsZW5hIGFuZCBMb2dhbiBhcmUgcmUtY2FwdHVyZWQuJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JpdHRlbicsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yNS5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzI1LnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE0KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzI1LmpwZycsXG5jYXB0aW9uOiAnRWxlbmEgZ2l2ZXMgaW4sIGFuZCBhIHNob2NrZWQgUmFjaGVsIGxlYXJucyBhIGxpdHRsZSBzb21ldGhpbmcgbmV3IGFib3V0IGhlciBvbGQgZnJpZW5kLicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCaXR0ZW4nLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQmxpbmRzcG90XzA3X05VUF8xNzAzMTdfMDMwOC5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JsaW5kc3BvdF8wN19OVVBfMTcwMzE3XzAzMDgucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTYpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQmxpbmRzcG90XzA3X05VUF8xNzAzMTdfMDMwOC5qcGcnLFxuY2FwdGlvbjogJ0JMSU5EU1BPVCAtLSBcIkJvbmUgTWF5IFJvdFwiIEVwaXNvZGUgMTA0IC0tIFBpY3R1cmVkOiAobC1yKSBKYWltaWUgQWxleGFuZGVyIGFzIEphbmUgRG9lLCBTdWxsaXZhbiBTdGFwbGV0b24gYXMgS3VydCBXZWxsZXIgLS0gKFBob3RvIGJ5OiBDaHJpc3RvcGhlciBTYXVuZGVycy9OQkMpJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JsaW5kc3BvdCcsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CbGluZHNwb3RfMDhfTlVQXzE3MDUwM18wMjgzLmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQmxpbmRzcG90XzA4X05VUF8xNzA1MDNfMDI4My5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNiksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCbGluZHNwb3RfMDhfTlVQXzE3MDUwM18wMjgzLmpwZycsXG5jYXB0aW9uOiAnQkxJTkRTUE9UIC0tIFwiQm9uZSBNYXkgUm90XCIgRXBpc29kZSAxMDQgLS0gUGljdHVyZWQ6IEphaW1pZSBBbGV4YW5kZXIgYXMgSmFuZSBEb2UgLS0gKFBob3RvIGJ5OiBHaW92YW5uaSBSdWZpbm8vTkJDKScsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCbGluZHNwb3QnLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQmxpbmRzcG90XzE1X05VUF8xNzA1MDNfMDIwMy5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JsaW5kc3BvdF8xNV9OVVBfMTcwNTAzXzAyMDMucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTYpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQmxpbmRzcG90XzE1X05VUF8xNzA1MDNfMDIwMy5qcGcnLFxuY2FwdGlvbjogJ0JMSU5EU1BPVCAtLSBcIkJvbmUgTWF5IFJvdFwiIEVwaXNvZGUgMTA0IC0tIFBpY3R1cmVkOiBKYWltaWUgQWxleGFuZGVyIGFzIEphbmUgRG9lIC0tIChQaG90byBieTogR2lvdmFubmkgUnVmaW5vL05CQyknLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQmxpbmRzcG90JyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4yMC4xNF9wbS5wbmcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4yMC4xNF9wbS5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNiksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdzY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMjAuMTRfcG0ucG5nJyxcbmNhcHRpb246ICfigJxNb25kYXlzIGdvdCBtZSBsaWtl4oCm4oCdIC0gQGppbW15ZmFsbG9uJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ1RoZSBUb25pZ2h0IFNob3cnLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjE5LjE5X3BtLnBuZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjE5LjE5X3BtLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE2KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4xOS4xOV9wbS5wbmcnLFxuY2FwdGlvbjogJ+KAnFRvbmlnaHQgSSB3YXMgdGhlIG11c2ljYWwgZ3Vlc3Qgb24gVGhlIFRvbmlnaHQgU2hvdyBXaXRoIEppbW15IEZhbGxvbi4gTXkgZmlyc3QgdGltZSBvbiB0aGUgc2hvdyBJIHdhcyAxNCB5ZWFycyBvbGQgYW5kIG5ldmVyIHRob3VnaHQgSVxcJ2QgYmUgYmFjayB0byBwZXJmb3JtIG15IGZpcnN0IHNpbmdsZS4gTG92ZSB5b3UgbG9uZyB0aW1lIEppbW15ISBUaGFua3MgZm9yIGhhdmluZyBtZS4gOikgUFMgSSBtZXQgdGhlIGxlZ2VuZGFyeSBMYWR5IEdhZ2EgYW5kIGFtIHNvIGluc3BpcmVkIGJ5IGhlciB3b3JkcyBvZiB3aXNkb20uICNIQUlab25GQUxMT04gI0xvdmVNeXNlbGbigJ0gLSBAaGFpbGVlc3RlaW5mZWxkJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ1RoZSBUb25pZ2h0IFNob3cnLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjIwLjE1X3BtLnBuZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjIwLjE1X3BtLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE2KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4yMC4xNV9wbS5wbmcnLFxuY2FwdGlvbjogJ+KAnE1vbmRheXMgZ290IG1lIGxpa2XigKbigJ0gLSBAamltbXlmYWxsb24nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnVGhlIFRvbmlnaHQgU2hvdycsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0qL1xuXTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gYXNzZXRMaWJyYXJ5T2JqZWN0cztcbn1cbmZ1bmN0aW9uIGNyZWF0ZUFzc2V0TGlicmFyeUZpbGUoZmlsZURhdGEpIHtcbiAgLy9IZWxwZXJcbiAgZnVuY3Rpb24gZmlsZVR5cGVFbGVtZW50KGZpbGVEYXRhKSB7XG4gICAgc3dpdGNoIChmaWxlRGF0YS50eXBlKSB7XG4gICAgICBjYXNlICdpbWFnZSc6XG4gICAgICByZXR1cm4gJCgnPGRpdj48aSBjbGFzcz1cImZhIGZhLWNhbWVyYVwiPjwvaT48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdHlwZScpO1xuXG4gICAgICBjYXNlICd2aWRlbyc6XG4gICAgICByZXR1cm4gJCgnPGRpdj48aSBjbGFzcz1cImZhIGZhLXZpZGVvLWNhbWVyYVwiPjwvaT48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdHlwZScpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3R5cGUnKTtcbiAgICB9XG4gIH1cblxuICAvL2NyZWF0ZSBiYXNpYyBlbGVtZW50XG4gIHZhciBmaWxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZSBmaWxlLS1tb2RhbCBmaWxlX3R5cGVfaW1nIGZpbGVfdmlld19ncmlkJyksXG4gIGZpbGVJbmRleCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2hpZGRlbiBmaWxlX19pZCcpLnRleHQoZmlsZURhdGEuaWQpLFxuXG4gIGZpbGVJbWcgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19pbWcnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyBmaWxlRGF0YS51cmwgKyAnKScpLFxuICBmaWxlQ29udHJvbHMgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19jb250cm9scycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuICBmaWxlQ2hlY2ttYXJrID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fY2hlY2ttYXJrJykuY2xpY2sodG9nZ2xlRmlsZVNlbGVjdCksXG4gIGZpbGVUaXRsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3RpdGxlJykudGV4dChmaWxlRGF0YS50aXRsZSk7XG5cbiAgZmlsZUNvbnRyb2xzLmFwcGVuZChmaWxlQ2hlY2ttYXJrLCBmaWxlVHlwZUVsZW1lbnQoZmlsZURhdGEpKTtcbiAgZmlsZUltZy5hcHBlbmQoZmlsZUNvbnRyb2xzKTtcblxuICBmaWxlLmFwcGVuZChmaWxlSW5kZXgsIGZpbGVJbWcsIGZpbGVUaXRsZSk7XG4gIHJldHVybiBmaWxlO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVBc3NldExpYnJhcnkoKSB7XG4gIHZhciBhc3NldExpYnJhcnkgPSAkKCcuYWwgLmZpbGVzIC5zZWN0aW9uX19maWxlcycpO1xuICBhc3NldExpYnJhcnkuZW1wdHkoKTtcbiAgYXNzZXRMaWJyYXJ5T2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcbiAgICBhc3NldExpYnJhcnkucHJlcGVuZChjcmVhdGVBc3NldExpYnJhcnlGaWxlKGYpKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFNlbGVjdGVkRmlsZXMoKSB7XG4gIHZhciBzZWxlY3RlZEZpbGVzID0gJCgnLmFsIC5maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKTtcblxuICBpZiAoc2VsZWN0ZWRGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgc2VsZWN0ZWRGaWxlcy5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICB2YXIgZmlsZUlkID0gJChlbCkuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpO1xuICAgICAgZmlsZSA9IGFzc2V0TGlicmFyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgcmV0dXJuIGYuaWQgPT09IGZpbGVJZDtcbiAgICAgIH0pWzBdO1xuICAgICAgLy9pZiAoIWZpbGVCeUlkKGZpbGVJZCwgZ2FsbGVyeU9iamVjdHMpKSB7XG4gICAgICBnYWxsZXJ5T2JqZWN0cy5wdXNoKHtcbiAgICAgICAgZmlsZURhdGE6IGZpbGUsXG4gICAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgcG9zaXRpb246IDEwMDAsXG4gICAgICAgIGNhcHRpb246ICcnLFxuICAgICAgICBnYWxsZXJ5Q2FwdGlvbjogZmFsc2UsXG4gICAgICAgIGp1c3RVcGxvYWRlZDogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgLy99XG5cbiAgICB9KTtcbiAgICB1cGRhdGVHYWxsZXJ5KGdhbGxlcnlPYmplY3RzLmxlbmd0aCk7XG4gIH1cbn1cblxuLy9SZXF1aXJlZCBmaWVsZHMgY2hlY2tcbmZ1bmN0aW9uIGNoZWNrRmllbGQoZmllbGQpIHtcbiAgICBpZiAoJChmaWVsZCkudmFsKCkgPT09ICcnICYmICQoZmllbGQpLmF0dHIoJ2Rpc3BsYXknKSAhPT0gJ25vbmUnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTt9XG4gICAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBtYXJrRmllbGRBc1JlcXVpcmVkKGZpZWxkKSB7XG4gICAgJChmaWVsZCkuYWRkQ2xhc3MoJ2VtcHR5RmllbGQnKTtcbiAgICBpZiAoJChmaWVsZCkucGFyZW50KCkuY2hpbGRyZW4oJy5lcnJNc2cnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdmFyIG1zZyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2Vyck1zZycpLnRleHQoXCJUaGlzIGZpZWxkIGNvdWxkbid0IGJlIGVtcHR5XCIpO1xuICAgICAgICAkKGZpZWxkKS5wYXJlbnQoKS5hcHBlbmQobXNnKTtcbiAgICB9XG59XG5mdW5jdGlvbiBtYXJrRmllbGRBc05vcm1hbChmaWVsZCkge1xuICAgICQoZmllbGQpLnJlbW92ZUNsYXNzKCdlbXB0eUZpZWxkJyk7XG4gICAgJChmaWVsZCkucGFyZW50KCkuY2hpbGRyZW4oJy5lcnJNc2cnKS5yZW1vdmUoKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tGaWVsZHMoc2VsZWN0b3IpIHtcbiAgICB2YXIgZmllbGRzID0gJChzZWxlY3RvcikucGFyZW50KCkuY2hpbGRyZW4oJ2lucHV0Jyk7XG4gICAgdmFyIHJlc3VsdCA9IHRydWU7XG4gICAgdmFyIGZpcnN0SW5kZXggPSAtMTtcbiAgICBmaWVsZHMuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgaWYgKGNoZWNrRmllbGQoZWwpKSB7XG4gICAgICAgICAgICAvL21hcmtGaWVsZEFzTm9ybWFsKGVsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vbWFya0ZpZWxkQXNSZXF1aXJlZChlbCk7XG4gICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChmaXJzdEluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIGZpcnN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICBlbC5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4kKCdsYWJlbC5yZXF1aWVyZWQnKS5wYXJlbnQoKS5jaGlsZHJlbignaW5wdXQnKS5vbignYmx1cicsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoY2hlY2tGaWVsZChlLnRhcmdldCkpIHtcbiAgICAgICAgLy9tYXJrRmllbGRBc05vcm1hbChlLnRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy9tYXJrRmllbGRBc1JlcXVpcmVkKGUudGFyZ2V0KTtcbiAgICB9XG59KTtcblxuLy9Gb2NhbCByZWN0YW5nbGUgYW5kIHBvaW50XG5mdW5jdGlvbiBhZGp1c3RSZWN0KGVsKSB7XG5cdHZhciBpbWdXaWR0aCA9ICQoJyNwcmV2aWV3SW1nJykud2lkdGgoKSxcblx0aW1nSGVpZ2h0ID0gJCgnI3ByZXZpZXdJbWcnKS5oZWlnaHQoKSxcblx0aW1nT2Zmc2V0ID0gJCgnI3ByZXZpZXdJbWcnKS5vZmZzZXQoKSxcblx0aW1nUmF0aW8gPSBpbWdXaWR0aC9pbWdIZWlnaHQsXG5cblx0ZWxIID0gZWwub3V0ZXJIZWlnaHQoKSxcblx0ZWxXID0gZWwub3V0ZXJXaWR0aCgpLFxuXHRlbE8gPSBlbC5vZmZzZXQoKSxcblx0ZWxSYXRpbyA9IGVsVy9lbEgsXG5cdGVsQmFja2dyb3VuZFBvc2l0aW9uID0gZWwuY3NzKCdiYWNrZ3JvdW5kLXBvc2l0aW9uJykgPyBlbC5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24nKS5zcGxpdCgnICcpIDogWyc1MCUnLCAnNTAlJ107XG5cblx0ckhlaWdodCA9IGltZ1JhdGlvID4gZWxSYXRpbyA/IGltZ0hlaWdodCA6IGltZ1dpZHRoL2VsUmF0aW87XG5cdHJXaWR0aCA9IGltZ1JhdGlvID4gZWxSYXRpbyA/IGltZ0hlaWdodCAqIGVsUmF0aW8gOiBpbWdXaWR0aDtcblx0ck9mZnNldCA9IHtsZWZ0OiAwLCB0b3A6IDB9O1xuXG5cdGlmIChlbEJhY2tncm91bmRQb3NpdGlvbi5sZW5ndGggPT09IDIpIHtcblx0XHRpZiAoZWxCYWNrZ3JvdW5kUG9zaXRpb25bMF0uaW5kZXhPZignJScpKSB7XG5cdFx0XHR2YXIgYmdMZWZ0UGVyc2VudCA9IGVsQmFja2dyb3VuZFBvc2l0aW9uWzBdLnNsaWNlKDAsLTEpLFxuXHRcdFx0YmdMZWZ0UGl4ZWwgPSBNYXRoLnJvdW5kKGltZ1dpZHRoICogYmdMZWZ0UGVyc2VudC8xMDApIC0gcldpZHRoLzI7XG5cblx0XHRcdGlmICgoYmdMZWZ0UGl4ZWwpIDwgMCkge2JnTGVmdFBpeGVsID0gMDt9XG5cdFx0XHRpZiAoKGJnTGVmdFBpeGVsICsgcldpZHRoKSA+IGltZ1dpZHRoKSB7YmdMZWZ0UGl4ZWwgPSBpbWdXaWR0aCAtIHJXaWR0aDt9XG5cblx0XHRcdHJPZmZzZXQubGVmdCA9IGltZ1JhdGlvID4gZWxSYXRpbyA/IGJnTGVmdFBpeGVsIDogMDtcblx0XHR9XG5cdFx0aWYgKGVsQmFja2dyb3VuZFBvc2l0aW9uWzFdLmluZGV4T2YoJyUnKSkge1xuXHRcdFx0dmFyIGJnVG9wUGVyc2VudCA9IGVsQmFja2dyb3VuZFBvc2l0aW9uWzFdLnNsaWNlKDAsLTEpLFxuXHRcdFx0YmdUb3BQaXhlbCA9IE1hdGgucm91bmQoaW1nSGVpZ2h0KmJnVG9wUGVyc2VudC8xMDApIC0gckhlaWdodC8yO1xuXG5cdFx0XHRpZiAoKGJnVG9wUGl4ZWwpIDwgMCkge2JnVG9wUGl4ZWwgPSAwO31cblx0XHRcdGlmICgoYmdUb3BQaXhlbCArIHJIZWlnaHQpID4gaW1nSGVpZ2h0KSB7YmdUb3BQaXhlbCA9IGltZ0hlaWdodCAtIHJIZWlnaHQ7fVxuXG5cdFx0XHRyT2Zmc2V0LnRvcCA9IGltZ1JhdGlvID4gZWxSYXRpbyA/IDAgOiBiZ1RvcFBpeGVsO1xuXHRcdH1cblx0fVxuXG5cdCQoJyNmb2NhbFJlY3QnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuXG5cdCQoJyNmb2NhbFJlY3QnKS5jc3MoJ3dpZHRoJywgcldpZHRoLnRvU3RyaW5nKCkgKyAncHgnKVxuXHQuY3NzKCdoZWlnaHQnLCBySGVpZ2h0LnRvU3RyaW5nKCkgKyAncHgnKVxuXHQuY3NzKCdsZWZ0Jywgck9mZnNldC5sZWZ0LnRvU3RyaW5nKCkgKyAncHgnKVxuXHQuY3NzKCd0b3AnLCByT2Zmc2V0LnRvcC50b1N0cmluZygpICsgJ3B4Jylcblx0LmRyYWdnYWJsZSh7XG5cdFx0YXhpczogaW1nUmF0aW8gPiBlbFJhdGlvID8gJ3gnIDogJ3knLFxuXHRcdGNvbnRhaW5tZW50OiBcIiNwcmV2aWV3SW1nXCIsXG5cdFx0c3RhcnQ6IGZ1bmN0aW9uKGUsIHVpKSB7XG5cdFx0XHRlbC5jc3MoJ3RyYW5zaXRpb24nLCAnbm9uZScpO1xuXHRcdH0sXG5cdFx0c3RvcDogZnVuY3Rpb24oZSwgdWkpIHtcblx0XHRcdGVsLmNzcygndHJhbnNpdGlvbicsICcwLjNzIGVhc2Utb3V0Jyk7XG5cdFx0XHRhZGp1c3RQdXJwb3NlKCQoZS50YXJnZXQpLCBlbCk7XG5cdFx0fVxuXHR9KTtcblxuXHQkKCcucHVycG9zZXNfX2NvbnRhaW5lciAucHVycG9zZS5pcy1hY3RpdmUnKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdGVsLnBhcmVudCgpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbn1cblxuZnVuY3Rpb24gYWRqdXN0UHVycG9zZShmb2NhbEl0ZW0sIHB1cnBvc2VJbWcpIHtcblx0dmFyIGltZyA9ICQoJyNwcmV2aWV3SW1nJyksXG5cdGlXaWR0aCA9IGltZy53aWR0aCgpLFxuXHRpSGVpZ2h0ID0gaW1nLmhlaWdodCgpLFxuXHRpT2Zmc2V0ID0gaW1nLm9mZnNldCgpLFxuXG5cdHBXaWR0aCA9IGZvY2FsSXRlbS5vdXRlcldpZHRoKCksXG5cdHBIZWlnaHQgPSBmb2NhbEl0ZW0ub3V0ZXJIZWlnaHQoKSxcblx0cE9mZnNldCA9IGZvY2FsSXRlbS5vZmZzZXQoKSxcblxuXHRmVG9wID0gTWF0aC5yb3VuZCgocE9mZnNldC50b3AgLSBpT2Zmc2V0LnRvcCArIHBIZWlnaHQvMikqMTAwIC8gaUhlaWdodCk7XG5cdGZMZWZ0ID0gTWF0aC5yb3VuZCgocE9mZnNldC5sZWZ0IC0gaU9mZnNldC5sZWZ0ICsgcFdpZHRoLzIpICogMTAwIC8gaVdpZHRoKTtcblxuXHRpZiAocHVycG9zZUltZykge1xuXHRcdHB1cnBvc2VJbWcuY3NzKCdiYWNrZ3JvdW5kLXBvc2l0aW9uJywgZkxlZnQudG9TdHJpbmcoKSArICclICcgKyBmVG9wLnRvU3RyaW5nKCkgKyAnJScpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdCQoJy5wdXJwb3Nlc19fY29udGFpbmVyIC5wdXJwb3NlIC5wdXJwb3NlLWltZycpLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbicsIGZMZWZ0LnRvU3RyaW5nKCkgKyAnJSAnICsgZlRvcC50b1N0cmluZygpICsgJyUnKTtcblx0fVxufVxuXG4vKiQoJyNmb2NhbFJlY3RUb2dnbGUnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdGlmICgkKGUudGFyZ2V0KS5oYXNDbGFzcygnYWN0aXZlJykpIHtcblx0XHQkKCcucHIgPiAucHJldmlldycpLnJlbW92ZUNsYXNzKCdmb2NhbCBsaW5lIHJlY3QnKTtcblx0XHQkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdH0gZWxzZSB7XG5cdFx0JCgnLnByID4gLnByZXZpZXcnKS5hZGRDbGFzcygnZm9jYWwgbGluZSByZWN0Jyk7XG5cdFx0JCgnLnByID4gLnByZXZpZXcnKS5yZW1vdmVDbGFzcygncG9pbnQnKTtcblx0XHQkKCcjZm9jYWxQb2ludFRvZ2dsZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHQkKGUudGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cblx0XHQvLyQoJy5mb2NhbFJlY3QnKS5yZXNpemFibGUoe2hhbmRsZXM6IFwiYWxsXCIsIGNvbnRhaW5tZW50OiBcIiNwcmV2aWV3SW1nXCJ9KTtcblx0XHRhZGp1c3RSZWN0KCQoJy5wdXJwb3Nlc19fY29udGFpbmVyIC5wdXJwb3NlLWltZycpLmZpcnN0KCkpO1xuXHRcdCQoJyNmb2NhbFJlY3QnKS5kcmFnZ2FibGUoeyBjb250YWlubWVudDogXCIjcHJldmlld0ltZ1wiLCBzY3JvbGw6IGZhbHNlIH0pO1xuXG5cdFx0JCgnLnB1cnBvc2VzX19jb250YWluZXIgLnB1cnBvc2UtaW1nJykudW5iaW5kKCkuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0YWRqdXN0UmVjdCgkKGUudGFyZ2V0KSk7XG5cdFx0fSk7XG5cdFx0Ly8kKCcuaW1nLXdyYXBwZXInKS5jc3MoJ21heC13aWR0aCcsICc5MCUnKTtcblx0XHRzZXRQdXJwb3NlUGFnaW5hdGlvbigpO1xuXHR9XG59KTsqL1xuXG4vL1V0aWxpdGllc1xuXG4vL1Rocm90dGxlIFNjcm9sbCBldmVudHNcbjsoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRocm90dGxlID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgb2JqKSB7XG4gICAgICAgIG9iaiA9IG9iaiB8fCB3aW5kb3c7XG4gICAgICAgIHZhciBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHZhciBmdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAocnVubmluZykgeyByZXR1cm47IH1cbiAgICAgICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG9iai5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChuYW1lKSk7XG4gICAgICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIG9iai5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGZ1bmMpO1xuICAgIH07XG5cbiAgICAvKiBpbml0IC0geW91IGNhbiBpbml0IGFueSBldmVudCAqL1xuICAgIHRocm90dGxlIChcInNjcm9sbFwiLCBcIm9wdGltaXplZFNjcm9sbFwiKTtcbiAgICB0aHJvdHRsZSAoXCJyZXNpemVcIiwgXCJvcHRpbWl6ZWRSZXNpemVcIik7XG59KSgpO1xuXG4vL1N0aWNreSB0b3BiYXJcbmZ1bmN0aW9uIFN0aWNreVRvcGJhcigpIHtcbiAgICB0aGlzLl9pbml0KCk7XG59XG5cblN0aWNreVRvcGJhci5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5sYXN0U2Nyb2xsUG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgIHNlbGYudG9wYmFyVHJhbnNpdGlvbiA9IGZhbHNlO1xuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9wdGltaXplZFNjcm9sbFwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBzY3JvbGxQb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA1NSAmJiAhJCgnLmMtSGVhZGVyLXRpdGxlJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICQoJy5jLUhlYWRlci10aXRsZScpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDU1ICYmICQoJy5jLUhlYWRlci10aXRsZScpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAkKCcuYy1IZWFkZXItdGl0bGUnKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnYy1IZWFkZXItY29udHJvbHMtLWNlbnRlcicpKSB7XG4gICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDU1ICYmICEkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlci1jb250cm9scy0tY2VudGVyJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDU1ICYmICQoJy5jLUhlYWRlci1jb250cm9scycpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyLWNvbnRyb2xzLS1jZW50ZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnaGVhZGVyX19jb250cm9scy0tZmlsdGVyJykpIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gNTUgJiYgISQoJy5jLUhlYWRlci1jb250cm9scycpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmhlYWRlcl9fY29udHJvbHMtLWZpbHRlcicpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCA1NSAmJiAkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5oZWFkZXJfX2NvbnRyb2xzLS1maWx0ZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnYy1IZWFkZXItLWNvbnRyb2xzJykpIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gMTQ1ICYmICEkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlcicpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCAxNDUgJiYgJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaGVhZGVyLS1maWx0ZXInKSkge1xuICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA3MCAmJiAhJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXInKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgNzAgJiYgJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gODUgJiYgISQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDg1ICYmICQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyJykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJCgnLmxpYnJhcnlfX2hlYWRlcicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gNzAgJiYgISQoJy5saWJyYXJ5X19oZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5saWJyYXJ5X19oZWFkZXInKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgNzAgJiYgJCgnLmxpYnJhcnlfX2hlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmxpYnJhcnlfX2hlYWRlcicpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSA5MzApIHtcbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDU1ICYmICEkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDU1ICYmICQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSAxMCAmJiAhJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCAxMCAmJiAkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0pO1xufTtcblxuLy9TY3JvbGxTcHlOYXZcbjsoZnVuY3Rpb24od2luZG93KSB7XG4gICAgLy8ndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBTY3JvbGxTcHlOYXYoZWwpIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuXG4gICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICAgICAgdGhpcy5faW5pdEV2ZW50cygpO1xuICAgIH1cblxuICAgIFNjcm9sbFNweU5hdi5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLmVsLmRhdGFzZXQudG9wT2Zmc2V0XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdLnNsaWNlLmNhbGwodGhpcy5lbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKSkubWFwKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICB2YXIgaXRlbUlkID0gZWwuZGF0YXNldC5ocmVmO1xuICAgICAgICAgICAgcmV0dXJuIHtuYXZJdGVtOiBlbCxcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaXRlbUlkKX07XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBTY3JvbGxTcHlOYXYucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9wdGltaXplZFNjcm9sbFwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoIXNlbGYuc2Nyb2xsaW5nVG9JdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1haW5JdGVtcyA9IHNlbGYuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsQkNSID0gaXRlbS5pdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsQkNSLnRvcCA+IHNlbGYub3B0aW9ucy5vZmZzZXQgJiYgZWxCQ1IudG9wIDwgd2luZG93LmlubmVySGVpZ2h0IC8gMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAobWFpbkl0ZW1zLmxlbmd0aCA+IDAgJiYgKCFzZWxmLm1haW5JdGVtIHx8IHNlbGYubWFpbkl0ZW0gIT09IG1haW5JdGVtc1swXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tYWluSXRlbSA9IG1haW5JdGVtc1swXTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkubmF2SXRlbS5jbGFzc0xpc3QucmVtb3ZlKHNlbGYub3B0aW9ucy5hY3RpdmVDbGFzcyB8fCAnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm1haW5JdGVtLm5hdkl0ZW0uY2xhc3NMaXN0LmFkZChzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VsZi5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGl0ZW0ubmF2SXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgaHJlZiA9ICcjJyArIGUudGFyZ2V0LmRhdGFzZXQuaHJlZjtcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0VG9wID0gaHJlZiA9PT0gXCIjXCIgPyAwIDogJChocmVmKS5vZmZzZXQoKS50b3AgLSBzZWxmLm9wdGlvbnMub2Zmc2V0IC0gMzA7XG4gICAgICAgICAgICAgICAgc2VsZi5zY3JvbGxpbmdUb0l0ZW0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgICAgIGkuaXRlbS5jbGFzc0xpc3QucmVtb3ZlKHNlbGYub3B0aW9ucy5hY3RpdmVDbGFzcyB8fCAnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIGkubmF2SXRlbS5jbGFzc0xpc3QucmVtb3ZlKHNlbGYub3B0aW9ucy5hY3RpdmVDbGFzcyB8fCAnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3Moc2VsZi5vcHRpb25zLmFjdGl2ZUNsYXNzIHx8ICdpcy1hY3RpdmUnKTtcblxuXG4gICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLnN0b3AoKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBvZmZzZXRUb3BcbiAgICAgICAgICAgICAgICB9LCAzMDAsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNjcm9sbGluZ1RvSXRlbSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAkKGhyZWYpLmFkZENsYXNzKHNlbGYub3B0aW9ucy5hY3RpdmVDbGFzcyB8fCAnaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaW5pdFNjcm9sbFNweU5hdigpIHtcbiAgICAgICAgW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtc2Nyb2xsU3B5TmF2JykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIG5ldyBTY3JvbGxTcHlOYXYoZWwpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaW5pdFNjcm9sbFNweU5hdigpO1xuXG59KSh3aW5kb3cpO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuLy8gQ29udHJvbHNcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4vL3RleHRmaWVsZHNcbi8vOyhmdW5jdGlvbih3aW5kb3cpIHtcbi8vICAgICd1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gVGV4dGZpZWxkKGVsLCBvcHRpb25zKSB7XG4gIHRoaXMuZWwgPSBlbDtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICB0aGlzLl9pbml0KCk7XG4gIHRoaXMuX2luaXRFdmVudHMoKTtcbn1cblxuVGV4dGZpZWxkLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuZWwucGxhY2Vob2xkZXIgPSAnJztcblxuICB0aGlzLmZpZWxkV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLmZpZWxkV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpbnB1dF9fd3JhcHBlcicpO1xuICB0aGlzLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuZmllbGRXcmFwcGVyLCB0aGlzLmVsKTtcbiAgdGhpcy5maWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG4gIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnanMtaW5wdXQnKTtcbiAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9fZmllbGQnKTtcblxuICBpZiAodGhpcy5lbC52YWx1ZSAhPT0gJycpIHtcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgICB0aGlzLl90b2dnbGVBZGRhYmxlKCk7XG4gIH1cblxuICBpZiAodGhpcy5lbC50eXBlID09PSAndGV4dGFyZWEnKSB7dGhpcy5fYXV0b3NpemUoKTt9XG4gIGlmICh0aGlzLm9wdGlvbnMuYXV0b2NvbXBsZXRlKSB7dGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdoYXMtYXV0b2NvbXBsZXRlJyk7fVxuICBpZiAodGhpcy5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLWRhdGVwaWNrZXInKSkge1xuICAgIHZhciBpZCA9ICdkYXRlUGlja2VyJyArIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoxMDAwMCk7XG4gICAgdGhpcy5lbC5pZCA9IGlkO1xuICAgICQodGhpcy5lbCkuZGF0ZXBpY2tlcih7XG4gICAgICBvblNlbGVjdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJyMnICsgaWQpLmFkZENsYXNzKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHkganMtaGFzVmFsdWUnKTtcbiAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZU1vbnRoOiB0cnVlLFxuICAgICAgY2hhbmdlWWVhcjogdHJ1ZVxuICAgICAgLyptb250aE5hbWVzU2hvcnQ6IFsgXCJKYW51YXJcIiwgXCJGZWJydWFyXCIsIFwiTWFydHNcIiwgXCJBcHJpbFwiLCBcIk1halwiLCBcIkp1bmlcIiwgXCJKdWxpXCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2t0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIiBdKi9cbiAgICB9KTtcbiAgfVxuICBpZiAodGhpcy5lbC5pZCA9PT0gJ3N0YXJ0RGF0ZScpIHtcbiAgICAkKHRoaXMuZWwpLmRhdGVwaWNrZXIoe1xuICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKGRhdGVTdHJpbmcsIGRhdGVwaWNrZXIpIHtcbiAgICAgICAgJCgnI3N0YXJ0RGF0ZScpLmFkZENsYXNzKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHkganMtaGFzVmFsdWUnKTtcbiAgICAgICAgc3RhcnREYXRlID0gZGF0ZVN0cmluZztcbiAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZU1vbnRoOiB0cnVlLFxuICAgICAgY2hhbmdlWWVhcjogdHJ1ZVxuICAgICAgLyptb250aE5hbWVzU2hvcnQ6IFsgXCJKYW51YXJcIiwgXCJGZWJydWFyXCIsIFwiTWFydHNcIiwgXCJBcHJpbFwiLCBcIk1halwiLCBcIkp1bmlcIiwgXCJKdWxpXCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2t0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIiBdKi9cbiAgICB9KTtcbiAgfVxuICBpZiAodGhpcy5lbC5pZCA9PT0gJ2VuZERhdGUnKSB7XG4gICAgJCh0aGlzLmVsKS5kYXRlcGlja2VyKHtcbiAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbihkYXRlU3RyaW5nLCBkYXRlcGlja2VyKSB7XG4gICAgICAgICQoJyNlbmREYXRlJykuYWRkQ2xhc3MoJ2lucHV0X3N0YXRlX25vdC1lbXB0eSBqcy1oYXNWYWx1ZScpO1xuICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICB9LFxuICAgICAgYmVmb3JlU2hvdzogZnVuY3Rpb24oZWxlbWVudCwgZGF0ZXBpY2tlcikge1xuICAgICAgICAkKCcjZW5kRGF0ZScpLmRhdGVwaWNrZXIoJ29wdGlvbicsICdkZWZhdWx0RGF0ZScsIHN0YXJ0RGF0ZSk7XG4gICAgICB9LFxuICAgICAgY2hhbmdlTW9udGg6IHRydWUsXG4gICAgICBjaGFuZ2VZZWFyOiB0cnVlXG4gICAgICAvKm1vbnRoTmFtZXNTaG9ydDogWyBcIkphbnVhclwiLCBcIkZlYnJ1YXJcIiwgXCJNYXJ0c1wiLCBcIkFwcmlsXCIsIFwiTWFqXCIsIFwiSnVuaVwiLCBcIkp1bGlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPa3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiIF0qL1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHRoaXMub3B0aW9ucy5sYWJlbCkge1xuICAgIHRoaXMubGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIHRoaXMubGFiZWwuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmxhYmVsO1xuICAgIHRoaXMubGFiZWwuY2xhc3NMaXN0LmFkZCgnaW5wdXRfX2xhYmVsJyk7XG4gICAgdGhpcy5sYWJlbC5mb3IgPSB0aGlzLmVsLmlkO1xuICAgIHRoaXMuZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xuICB9XG5cbiAgdGhpcy5ibGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOyAvL1VzZSBhcyBhIGhlbHBlciB0byBtYWtlIGJsaW5rIGFuaW1hdGlvbiBvbiBmb2N1cyBmaWVsZFxuICB0aGlzLmJsaW5rLmNsYXNzTGlzdC5hZGQoJ2lucHV0X19ibGluaycpO1xuICB0aGlzLmZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmJsaW5rKTtcblxuICBpZiAodGhpcy5vcHRpb25zLmhlbHBUZXh0KSB7XG4gICAgdGhpcy5oZWxwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuaGVscFRleHQuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmhlbHBUZXh0O1xuICAgIHRoaXMuaGVscFRleHQuY2xhc3NMaXN0LmFkZCgnaW5wdXRfX2hlbHAtdGV4dCcpO1xuICAgIHRoaXMuZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuaGVscFRleHQpO1xuICB9XG4gIGlmICh0aGlzLm9wdGlvbnMuZXJyTXNnKSB7XG4gICAgdGhpcy5lcnJNc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmVyck1zZy5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuZXJyTXNnO1xuICAgIHRoaXMuZXJyTXNnLmNsYXNzTGlzdC5hZGQoJ2lucHV0X19lcnItbXNnJyk7XG4gICAgdGhpcy5maWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lcnJNc2cpO1xuICB9XG59O1xuXG5UZXh0ZmllbGQucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgLy9DaGVjayBpZiBmaWVsZCBpcyBlbXB0eSBvciBub3QgYW5kIGNoYW5nZSBjbGFzcyBhY2NvcmRpbmdseVxuICAkKHRoaXMuZWwpLm9uKCdibHVyJywgZnVuY3Rpb24oZSkge1xuICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0X3N0YXRlX2VycicpO1xuICAgIGlmIChlLnRhcmdldC52YWx1ZSAhPT0gJycpIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICB9XG4gICAgZS50YXJnZXQucGxhY2Vob2xkZXIgPSAnJztcbiAgICBpZiAoZS50YXJnZXQucmVxdWlyZWQgJiYgIWUudGFyZ2V0LnZhbHVlKSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9zdGF0ZV9lcnInKTtcbiAgICB9XG4gICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7c2VsZi5saXN0LnJlbW92ZSgpO30sIDE1MCk7XG4gICAgfVxuICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gIH0pO1xuXG4gIC8vT24gZm9jdXMgZXZlbnRcbiAgJCh0aGlzLmVsKS5vbignZm9jdXMnLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKHNlbGYub3B0aW9ucy5wbGFjZWhvbGRlcikge1xuICAgICAgZS50YXJnZXQucGxhY2Vob2xkZXIgPSBzZWxmLm9wdGlvbnMucGxhY2Vob2xkZXI7XG4gICAgfVxuICAgIGlmIChzZWxmLm9wdGlvbnMuYXV0b2NvbXBsZXRlKSB7XG4gICAgICBzZWxmLmxpc3QgPSByZW5kZXJBdXRvY29tcGxldGVMaXN0KHNlbGYub3B0aW9ucy5hdXRvY29tcGxldGUsIGhhbmRsZUF1dG9jb21wbGV0ZUl0ZW1DbGljayk7XG4gICAgICBwbGFjZUF1dG9jb21wbGV0ZUxpc3Qoc2VsZi5saXN0LCAkKHNlbGYuZmllbGRXcmFwcGVyKSk7XG4gICAgfVxuICB9KTtcblxuICAvL09uIGNoYW5nZSBldmVudFxuICAkKHRoaXMuZWwpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5wdXRfc3RhdGVfZXJyJyk7XG4gICAgaWYgKGUudGFyZ2V0LnZhbHVlICE9PSAnJykge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIH1cbiAgICBlLnRhcmdldC5wbGFjZWhvbGRlciA9ICcnO1xuICAgIGlmIChzZWxmLm9wdGlvbnMub25DaGFuZ2UpIHtcbiAgICAgIHNlbGYub3B0aW9ucy5vbkNoYW5nZShlKTtcbiAgICB9XG4gICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgfSk7XG5cbiAgLy9PbiBpbnB1dCBldmVudFxuICAkKHNlbGYuZWwpLm9uKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dF9zdGF0ZV9lcnInKTtcbiAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfVxuICAgIGUudGFyZ2V0LnBsYWNlaG9sZGVyID0gJyc7XG4gICAgaWYgKHNlbGYub3B0aW9ucy5vbklucHV0KSB7XG4gICAgICBzZWxmLm9wdGlvbnMub25JbnB1dChlKTtcbiAgICB9XG4gICAgaWYgKHNlbGYub3B0aW9ucy5hdXRvY29tcGxldGUpIHtcbiAgICAgIHZhciBkYXRhID0gc2VsZi5vcHRpb25zLmF1dG9jb21wbGV0ZS5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlbGYuZWwudmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICB9KVxuICAgICAgdXBkYXRlQXV0b2NvbXBsZXRlTGlzdChzZWxmLmxpc3QsIGRhdGEsIGhhbmRsZUF1dG9jb21wbGV0ZUl0ZW1DbGljayk7XG4gICAgfVxuICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gIH0pO1xuICAkKHNlbGYuZWwpLm9uKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG5cbiAgZnVuY3Rpb24gaGFuZGxlS2V5RG93bihlKSB7XG4gICAgdmFyIGluZGV4LCBsZW5ndGg7XG4gICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgIGNhc2UgMTM6XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgc2VsZWN0SXRlbShzZWxmLmxpc3QuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmdldCgwKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7Y2xvc2VBdXRvY29tcGxldGUoKTsgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMjc6XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGNsb3NlQXV0b2NvbXBsZXRlKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDM4OlxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4IC0gMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggPCBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIGlmICgkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wIDwgNTApIHtcbiAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA+IDAgPyAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgOiAwXG4gICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IDBcbiAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgNDA6XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICAgIGlmICgkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPCAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpXG4gICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpbmRleCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXgpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXgpLmhlaWdodCgpXG4gICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJBdXRvY29tcGxldGVMaXN0KGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGxpc3QgPSAkKCc8dWwgLz4nKS5hZGRDbGFzcygnYXV0b2NvbXBsZXRlJylcblxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICBsaXN0LmFwcGVuZChyZW5kZXJBdXRvY29tcGxldGVJdGVtKGl0ZW0sIGNhbGxiYWNrKSk7XG4gICAgfSk7XG4gICAgbGlzdC5maW5kKCcuYXV0b2NvbXBsZXRlX19pdGVtJykuZmlyc3QoKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cbiAgZnVuY3Rpb24gcGxhY2VBdXRvY29tcGxldGVMaXN0KGxpc3QsIHBhcmVudCkge1xuICAgIHBhcmVudC5hcHBlbmQobGlzdCk7XG5cbiAgICB2YXIgcGFyZW50QkNSID0gcGFyZW50LmdldCgwKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICBwYXJlbnRPZmZzZXRUb3AgPSBwYXJlbnQuZ2V0KDApLm9mZnNldFRvcCxcbiAgICBsaXN0QkNSID0gbGlzdC5nZXQoMCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG5cbiAgICBoZWlnaHRDaGVjayA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHBhcmVudEJDUi50b3AgLSBwYXJlbnRCQ1IuaGVpZ2h0IC0gbGlzdEJDUi5oZWlnaHQ7XG5cbiAgICBsaXN0LmdldCgwKS5zdHlsZS50b3AgPSBoZWlnaHRDaGVjayA+IDAgPyBwYXJlbnRPZmZzZXRUb3AgKyBwYXJlbnRCQ1IuaGVpZ2h0ICsgNSArICdweCcgOiBwYXJlbnRPZmZzZXRUb3AgLSBsaXN0QkNSLmhlaWdodCAtIDEwICsgJ3B4JztcbiAgfVxuICBmdW5jdGlvbiB1cGRhdGVBdXRvY29tcGxldGVMaXN0IChsaXN0LCBkYXRhLCBjYWxsYmFjaykge1xuICAgIGxpc3QuZW1wdHkoKTtcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgbGlzdC5hcHBlbmQocmVuZGVyQXV0b2NvbXBsZXRlSXRlbShpdGVtLCBjYWxsYmFjaykpO1xuICAgIH0pO1xuICAgIGxpc3QuZmluZCgnLmF1dG9jb21wbGV0ZV9faXRlbScpLmZpcnN0KCkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICB9XG4gIGZ1bmN0aW9uIHJlbmRlckF1dG9jb21wbGV0ZUl0ZW0oaXRlbSwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gJCgnPGxpIC8+JykuYWRkQ2xhc3MoJ2F1dG9jb21wbGV0ZV9faXRlbScpLmNsaWNrKGNhbGxiYWNrKS5vbignbW91c2VvdmVyJywgaGFuZGxlSXRlbU1vdXNlT3ZlcikudGV4dChpdGVtKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUF1dG9jb21wbGV0ZUl0ZW1DbGljayhlKSB7XG4gICAgc2VsZWN0SXRlbShlLnRhcmdldCk7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlSXRlbU1vdXNlT3ZlcihlKSB7XG4gICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gIH1cbiAgZnVuY3Rpb24gc2VsZWN0SXRlbShpdGVtKSB7XG4gICAgc2VsZi5lbC52YWx1ZSA9IGl0ZW0uaW5uZXJIVE1MO1xuICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgY2xvc2VBdXRvY29tcGxldGUoKTtcbiAgfVxuICBmdW5jdGlvbiBjbG9zZUF1dG9jb21wbGV0ZSgpIHtcbiAgICBzZWxmLmxpc3QucmVtb3ZlKCk7XG4gIH1cbn07XG5cbi8vQXV0b3Jlc2l6ZSB0ZXh0YXJlYVxuVGV4dGZpZWxkLnByb3RvdHlwZS5fYXV0b3NpemUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuZWwudmFsdWUgPT09ICcnKSB7dGhpcy5lbC5yb3dzID0gMTt9XG4gIGVsc2Uge1xuICAgIHZhciB3aWR0aCA9IHRoaXMuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgsXG4gICAgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSxcbiAgICB0ZXh0V2lkdGggPSB0aGlzLmVsLnZhbHVlLmxlbmd0aCAqIDcsXG4gICAgcmUgPSAvW1xcblxccl0vaWc7XG4gICAgbGluZUJyYWtlcyA9IHRoaXMuZWwudmFsdWUubWF0Y2gocmUpO1xuICAgIHJvdyA9IE1hdGguY2VpbCh0ZXh0V2lkdGggLyB3aWR0aCk7XG5cbiAgICByb3cgPSByb3cgPD0gMCA/IDEgOiByb3c7XG4gICAgcm93ID0gdGhpcy5vcHRpb25zLm1heEhlaWdodCAmJiByb3cgPiB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0ID8gdGhpcy5vcHRpb25zLm1heEhlaWdodCA6IHJvdztcblxuICAgIGlmIChsaW5lQnJha2VzKSB7XG4gICAgICByb3cgKz0gbGluZUJyYWtlcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgdGhpcy5lbC5yb3dzID0gcm93O1xuICB9XG59O1xuXG5UZXh0ZmllbGQucHJvdG90eXBlLl90b2dnbGVBZGRhYmxlID0gZnVuY3Rpb24oKSB7XG4gIGlmICgkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmxlbmd0aCA+IDApIHtcbiAgICBjb25zb2xlLmxvZygkKHRoaXMuZWwpLmhhc0NsYXNzKCdqcy1oYXNWYWx1ZScpKTtcbiAgICBpZiAoJCh0aGlzLmVsKS5oYXNDbGFzcygnanMtaGFzVmFsdWUnKSkge1xuICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5hZGRDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5yZW1vdmVDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGluaXRUZXh0ZmllbGRzKCkge1xuICByZXR1cm47XG4gIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWlucHV0JykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICBuZXcgVGV4dGZpZWxkKGVsLCB7XG4gICAgICBsYWJlbDogZWwuZGF0YXNldC5sYWJlbCxcbiAgICAgIGhlbHBUZXh0OiBlbC5kYXRhc2V0LmhlbHBUZXh0LFxuICAgICAgZXJyTXNnOiBlbC5kYXRhc2V0LmVyck1zZyxcbiAgICAgIHBsYWNlaG9sZGVyOiBlbC5wbGFjZWhvbGRlcixcbiAgICAgIG1hc2s6IGVsLmRhdGFzZXQubWFzayxcbiAgICAgIG1heEhlaWdodDogZWwuZGF0YXNldC5tYXhIZWlnaHRcbiAgICB9KTtcbiAgfSk7XG4gIFxufVxuXG5pbml0VGV4dGZpZWxkcygpO1xuXG4vL3NlbGVjdGJveFxuLy87KGZ1bmN0aW9uKHdpbmRvdykge1xuICAgIC8vJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gU2VsZWN0Ym94KGVsLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuXG4gICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICAgICAgdGhpcy5faW5pdEV2ZW50cygpO1xuICAgIH1cblxuICAgIFNlbGVjdGJveC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gdGhpcy5vcHRpb25zLml0ZW1zLmluZGV4T2YodGhpcy5vcHRpb25zLnNlbGVjdGVkSXRlbSk7XG4gICAgICAgIHRoaXMub3B0aW9ucy51bnNlbGVjdCA9IHRoaXMub3B0aW9ucy51bnNlbGVjdCAhPT0gLTEgPyAn4oCUIE5vbmUg4oCUJyA6IHRoaXMub3B0aW9ucy51bnNlbGVjdDtcblxuICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdF9fd3JhcHBlcicpO1xuICAgICAgICB0aGlzLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuc2VsZWN0V3JhcHBlciwgdGhpcy5lbCk7XG4gICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdqcy1zZWxlY3Rib3gnKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2ZpZWxkJyk7XG5cbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlSXRlbSA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLml0ZW1zW3RoaXMuYWN0aXZlSXRlbV07XG4gICAgICAgICAgICB0aGlzLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxhYmVsKSB7XG4gICAgICAgICAgICB0aGlzLmxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmxhYmVsO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2xhYmVsJyk7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmZvciA9IHRoaXMuZWwuaWQ7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5sYWJlbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWxwVGV4dCkge1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuaGVscFRleHQ7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9faGVscC10ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5oZWxwVGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lcnJNc2cpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0aGlzLmVyck1zZy5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuZXJyTXNnO1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19lcnItbXNnJyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lcnJNc2cpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFNlbGVjdGJveC5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8vQ2xvc2UgbGlzdCBoZWxwZXJcbiAgICAgICAgZnVuY3Rpb24gY2xvc2VMaXN0KCkge1xuICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3Rib3hfc3RhdGVfb3BlbicpO1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0V3JhcHBlci5yZW1vdmVDaGlsZChzZWxmLmxpc3QpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLnNlYXJjaEZpZWxkICYmIHNlbGYuc2VhcmNoRmllbGQucGFyZW50Tm9kZSA9PT0gc2VsZi5lbCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwucmVtb3ZlQ2hpbGQoc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5pbnB1dEZpZWxkICYmIHNlbGYuaW5wdXRGaWVsZC5wYXJlbnROb2RlID09PSBzZWxmLmVsKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5yZW1vdmVDaGlsZChzZWxmLmlucHV0RmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuYWN0aXZlSXRlbSA8IDApIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IHNlbGYub3B0aW9ucy5pdGVtc1tzZWxmLmFjdGl2ZUl0ZW1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlU2VsZWN0RG9jQ2xpY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9DcmVhdGUgbGlzdCBoZWxwZXJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlTGlzdChpdGVtcywgYWN0aXZlSXRlbSwgc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYubGlzdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYubGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgICAgICBzZWxmLmxpc3QuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19saXN0Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RJdGVtKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1DbGFzcyA9IHNlbGYub3B0aW9ucy5jb21wbGV4SXRlbXMgPyAnc2VsZWN0Ym94X19saXN0LWl0ZW0gc2VsZWN0Ym94X19saXN0LWl0ZW0tLWNvbXBsZXgnIDogJ3NlbGVjdGJveF9fbGlzdC1pdGVtIHNlbGVjdGJveF9fbGlzdC1pdGVtLS10ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQgPSAkKCc8bGk+PC9saT4nKS5hZGRDbGFzcyhpdGVtQ2xhc3MpLnRleHQoaXRlbSksXG4gICAgICAgICAgICAgICAgICAgIGxpc3RIZWxwZXIgPSAkKCc8ZGl2PjwvZGl2PicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1pdGVtJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3otaW5kZXgnLCAnLTEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnb3BhY2l0eScsIDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ292ZXJmbG93JywgJ3Zpc2libGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnd2hpdGUtc3BhY2UnLCAnbm93cmFwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KGl0ZW0pO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKGxpc3RIZWxwZXIuZ2V0KDApKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmF0dHIoJ2RhdGEtaW5kZXgnLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5jb21wbGV4SXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuZ2V0KDApLmlubmVySFRNTCA9IGl0ZW07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaFRleHQgJiYgIXNlbGYub3B0aW9ucy5jb21wbGV4SXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuZ2V0KDApLmlubmVySFRNTCA9IGxpc3RJdGVtVGV4dChpdGVtLCBzZWFyY2hUZXh0LCAkKHNlbGYubGlzdCkud2lkdGgoKSA8IGxpc3RIZWxwZXIud2lkdGgoKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQub24oJ21vdXNlZG93bicsIGhhbmRsZUl0ZW1DbGljayk7XG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQub24oJ21vdXNlb3ZlcicsIGhhbmRsZUl0ZW1Nb3VzZU92ZXIpO1xuXG4gICAgICAgICAgICAgICAgbGlzdEhlbHBlci5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbUVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0SXRlbVRleHQoaXRlbVN0cmluZywgdGV4dCwgbG9uZykge1xuICAgICAgICAgICAgICAgIHZhciBvdXRwdXRTdHJpbmcgPSBpdGVtU3RyaW5nO1xuICAgICAgICAgICAgICAgIGlmIChsb25nKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3b3JkcyA9IGl0ZW1TdHJpbmcuc3BsaXQoJyAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaEluZGV4ID0gd29yZHMucmVkdWNlKGZ1bmN0aW9uKGN1cnJlbnRJbmRleCwgd29yZCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTdHJpbmcgPSB3b3JkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0KSA+IC0xICYmIGN1cnJlbnRJbmRleCA9PT0gLTEgPyBpbmRleCA6IGN1cnJlbnRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIC0xKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VhcmNoSW5kZXggPj0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0cmluZ0VuZCA9IHdvcmRzLnNsaWNlKHNlYXJjaEluZGV4KS5yZWR1Y2UoZnVuY3Rpb24oc3RyLCB3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0ciArICcgJyArIHdvcmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWcgPSAvXFwuJC87XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZHNbMF0ubWF0Y2gocmVnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN0cmluZyA9IHdvcmRzWzBdICsgJyAnICsgd29yZHNbMV0gKyAnIC4uLiAnICsgc3RyaW5nRW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTdHJpbmcgPSB3b3Jkc1swXSArICcgLi4uICcgKyBzdHJpbmdFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRUZXh0SW5kZXggPSBvdXRwdXRTdHJpbmcudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQudG9Mb3dlckNhc2UoKSksXG4gICAgICAgICAgICAgICAgICAgIGVuZFRleHRJbmRleCA9IHN0YXJ0VGV4dEluZGV4ICsgdGV4dC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gb3V0cHV0U3RyaW5nLnNsaWNlKDAsIHN0YXJ0VGV4dEluZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgbWlkZGxlID0gb3V0cHV0U3RyaW5nLnNsaWNlKHN0YXJ0VGV4dEluZGV4LCBlbmRUZXh0SW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICBlbmQgPSBvdXRwdXRTdHJpbmcuc2xpY2UoZW5kVGV4dEluZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdGFydCkpO1xuICAgICAgICAgICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQoJCgnPHNwYW4+PC9zcGFuPicpLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtaGlnaGxpZ2h0JykudGV4dChtaWRkbGUpLmdldCgwKSk7XG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShlbmQpKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlubmVySFRNTDtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gZGl2aWRlcigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJCgnPGxpPjwvbGk+JykuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1kaXZpZGVyJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZChzZWxmLmxpc3QpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnVuc2VsZWN0ICE9PSAtMSAmJiAhc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdJdGVtID0gbGlzdEl0ZW0oc2VsZi5vcHRpb25zLnVuc2VsZWN0KS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkIHNlbGVjdGJveF9fbGlzdC11bnNlbGVjdCcpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChuZXdJdGVtLmdldCgwKSk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LmFwcGVuZENoaWxkKGRpdmlkZXIoKS5nZXQoMCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3SXRlbSA9IGxpc3RJdGVtKGl0ZW0sIHNlbGYub3B0aW9ucy5pdGVtcy5pbmRleE9mKGl0ZW0pKTtcblxuICAgICAgICAgICAgICAgIGlmIChpID09PSAwICYmIHNlbGYubGlzdC5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3SXRlbS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtID09PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0l0ZW0uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChuZXdJdGVtLmdldCgwKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGZpZWxkUmVjdCA9IHNlbGYuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICAgICAgZmllbGRPZmZzZXRUb3AgPSBzZWxmLmVsLm9mZnNldFRvcCxcbiAgICAgICAgICAgICAgICB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgbWVudVJlY3QgPSBzZWxmLmxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG5cbiAgICAgICAgICAgICAgICBoZWlnaHRDaGVjayA9IHdpbmRvd0hlaWdodCAtIGZpZWxkUmVjdC50b3AgLSBmaWVsZFJlY3QuaGVpZ2h0IC0gbWVudVJlY3QuaGVpZ2h0O1xuXG4gICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUudG9wID0gaGVpZ2h0Q2hlY2sgPiAwID8gZmllbGRPZmZzZXRUb3AgKyBmaWVsZFJlY3QuaGVpZ2h0ICsgNSArICdweCcgOiBmaWVsZE9mZnNldFRvcCAtIG1lbnVSZWN0LmhlaWdodCAtIDEwICsgJ3B4JztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdEl0ZW0oaXRlbSkge1xuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy51bnNlbGVjdCAmJiBpdGVtLmlubmVySFRNTCA9PT0gc2VsZi5vcHRpb25zLnVuc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hY3RpdmVJdGVtID0gLTE7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3Rib3hfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbGVjdGluZyBpdGVtXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuZWwpO1xuICAgICAgICAgICAgICAgIHNlbGYuYWN0aXZlSXRlbSA9IGl0ZW0uZGF0YXNldC5pbmRleDtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMub25TZWxlY3QpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IGl0ZW0uY2hpbGROb2Rlc1swXS5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gaXRlbS5kYXRhc2V0LmluZGV4O1xuICAgICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5vblNlbGVjdCh0ZXh0LCBpbmRleCwgc2VsZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLml0ZW1DYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pdGVtQ2FsbGJhY2soaXRlbSwgc2VsZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1NlbGVjdCBjbGlja1xuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTZWxlY3RDbGljayhlKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLmFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIHRoZXJlIGlzIGFueSBzZWxlY3RlZCBpdGVtLiBJZiBub3Qgc2V0IHRoZSBwbGFjZWhvbGRlciB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW0gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IHNlbGYucGxhY2Vob2xkZXIgfHwgJ1NlbGVjdCc7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIHNlYXJjaCBvcHRpb24gaXMgb24gb3IgdGhlcmUgaXMgbW9yZSB0aGFuIDEwIGl0ZW1zLiBJZiB5ZXMsIGFkZCBzZWFyY2ZpZWxkXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuc2VhcmNoIHx8IHNlbGYub3B0aW9ucy5pdGVtcy5sZW5ndGggPiA3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbGYuc2VhcmNoRmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX3NlYXJjaGZpZWxkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5wbGFjZWhvbGRlciA9IHNlbGYub3B0aW9ucy5zZWFyY2hQbGFjZWhvbGRlciB8fCAnU2VhcmNoLi4uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaGFuZGxlU2VhcmNoRmllbGRJbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaGFuZGxlU2VhcmNoRmllbGRJbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLmlucHV0RmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfc3RhdGVfb3BlbicpO1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVMaXN0KHNlbGYub3B0aW9ucy5pdGVtcywgc2VsZi5hY3RpdmVJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVTZWxlY3REb2NDbGljayk7fSwgMTAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9TZWxlY3QgaXRlbSBoYW5kbGVyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUl0ZW1DbGljayhlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgc2VsZWN0SXRlbShlLnRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlSXRlbU1vdXNlT3ZlcihlKSB7XG4gICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2VsZWN0RG9jQ2xpY2soKSB7XG4gICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vRnVsdGVyIGZ1bmN0aW9uIGZvciBzZWFyY2ZpZWxkXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQoZSkge1xuICAgICAgICAgICAgdmFyIGZJdGVtcyA9IHNlbGYub3B0aW9ucy5pdGVtcy5maWx0ZXIoZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZS50YXJnZXQudmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNyZWF0ZUxpc3QoZkl0ZW1zLCBzZWxmLmFjdGl2ZUl0ZW0sIGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlS2V5RG93bihlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdmFyIGluZGV4LCBsZW5ndGg7XG4gICAgICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdEl0ZW0oc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAyNzpcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCAtIDEpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgPCA1MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpIC0gJChzZWxmLmxpc3QpLmhlaWdodCgpID4gMCA/ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5oZWlnaHQoKSA8ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLm91dGVySGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4KS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4KS5oZWlnaHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9DaGVjayBpZiBmaWVsZCBpcyBlbXB0eSBvciBub3QgYW5kIGNoYW5nZSBjbGFzcyBhY2NvcmRpbmdseVxuICAgICAgICAkKHNlbGYuZWwpLm9uKCdjbGljaycsIGhhbmRsZVNlbGVjdENsaWNrKTtcbiAgICB9O1xuXG4gICAgU2VsZWN0Ym94LnByb3RvdHlwZS5fdG9nZ2xlQWRkYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzLmVsKS5oYXNDbGFzcygnanMtaGFzVmFsdWUnKSkge1xuICAgICAgICAgICAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykuYWRkQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgU2VsZWN0Ym94LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGJveF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gLTE7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRTZWxlY3Rib3hlcygpIHtcbiAgICAgICAgW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtc2VsZWN0Ym94JykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIG5ldyBTZWxlY3Rib3goZWwsIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogZWwuZGF0YXNldC5sYWJlbCxcbiAgICAgICAgICAgICAgICBoZWxwVGV4dDogZWwuZGF0YXNldC5oZWxwVGV4dCxcbiAgICAgICAgICAgICAgICBlcnJNc2c6IGVsLmRhdGFzZXQuZXJyTXNnLFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBlbC5kYXRhc2V0LnBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBKU09OLnBhcnNlKGVsLmRhdGFzZXQuaXRlbXMpLFxuICAgICAgICAgICAgICAgIHNlYXJjaDogZWwuZGF0YXNldC5zZWFyY2gsXG4gICAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI6ZWwuZGF0YXNldC5zZWFyY2hQbGFjZWhvbGRlcixcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogZWwuZGF0YXNldC5yZXF1aXJlZCxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW06IGVsLmRhdGFzZXQuc2VsZWN0ZWRJdGVtLFxuICAgICAgICAgICAgICAgIHVuc2VsZWN0OiBlbC5kYXRhc2V0LnVuc2VsZWN0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdFNlbGVjdGJveGVzKCk7XG5cblxuLy99KSh3aW5kb3cpO1xuXG4vL1RhZ2ZpZWxkc1xuLy87KGZ1bmN0aW9uKHdpbmRvdykge1xuICAgIC8vJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gVGFnZmllbGQoZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICAgICAgdGhpcy5faW5pdEV2ZW50cygpO1xuICAgIH1cblxuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMub3B0aW9ucy5pbml0aWFsSXRlbXMgfHwgW107XG5cbiAgICAgICAgdGhpcy50YWdmaWVsZFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy50YWdmaWVsZFdyYXBwZXIuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX3dyYXBwZXInKTtcbiAgICAgICAgdGhpcy5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLnRhZ2ZpZWxkV3JhcHBlciwgdGhpcy5lbCk7XG4gICAgICAgIHRoaXMudGFnZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2pzLXRhZ2ZpZWxkJyk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX2ZpZWxkJyk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYWJlbCkge1xuICAgICAgICAgICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5sYWJlbDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX2xhYmVsJyk7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmZvciA9IHRoaXMuZWwuaWQ7XG4gICAgICAgICAgICB0aGlzLnRhZ2ZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmhlbHBUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0LmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5oZWxwVGV4dDtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX2hlbHAtdGV4dCcpO1xuICAgICAgICAgICAgdGhpcy50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5oZWxwVGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lcnJNc2cpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0aGlzLmVyck1zZy5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuZXJyTXNnO1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX2Vyci1tc2cnKTtcbiAgICAgICAgICAgIHRoaXMudGFnZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZXJyTXNnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICBzZWxmLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5fY3JlYXRlVGFnKGl0ZW0pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy9DbG9zZSBsaXN0IGhlbHBlclxuICAgICAgICBmdW5jdGlvbiBjbG9zZUxpc3QoKSB7XG4gICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RhZ2ZpZWxkX3N0YXRlX29wZW4nKTtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzZWxmLmxpc3QpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLnNlYXJjaEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5yZW1vdmVDaGlsZChzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLmhlbHBlckZpZWxkICYmIHNlbGYuaGVscGVyRmllbGQucGFyZW50Tm9kZSA9PT0gc2VsZi5lbCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwucmVtb3ZlQ2hpbGQoc2VsZi5oZWxwZXJGaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWdmaWVsZF9fdGFnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlVGFnZmllbGREb2NDbGljayk7XG4gICAgICAgICAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL0NyZWF0ZSBsaXN0IGhlbHBlclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVMaXN0KGl0ZW1zLCBhY3RpdmVJdGVtLCBzZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2VsZi5saXN0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICAgIHNlbGYubGlzdC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2xpc3QnKTtcblxuICAgICAgICAgICAgc2VsZi5saXN0SGVscGVyID0gJCgnPGRpdj48L2Rpdj4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1pdGVtJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygncG9zaXRpb24nLCAnYWJzb2x1dGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCd6LWluZGV4JywgJy0xJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnb3BhY2l0eScsIDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdvdmVyZmxvdycsICd2aXNpYmxlJyk7XG5cbiAgICAgICAgICAgIHNlbGYudGFnZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHNlbGYubGlzdEhlbHBlci5nZXQoMCkpO1xuXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fbGlzdC1pdGVtJyk7XG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuaW5uZXJIVE1MID0gaXRlbTtcbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5pZCA9ICdsaXN0SXRlbS0nICsgaTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3RIZWxwZXIudGV4dChpdGVtKTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RJdGVtVGV4dChpdGVtU3RyaW5nLCB0ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3b3JkcyA9IGl0ZW1TdHJpbmcuc3BsaXQoJyAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaEluZGV4ID0gd29yZHMucmVkdWNlKGZ1bmN0aW9uKGN1cnJlbnRJbmRleCwgd29yZCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd29yZC50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGV4dCkgPiAtMSAmJiBjdXJyZW50SW5kZXggPT09IC0xID8gaW5kZXggOiBjdXJyZW50SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAtMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlYXJjaEluZGV4IDwgMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1TdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RyaW5nRW5kID0gd29yZHMuc2xpY2Uoc2VhcmNoSW5kZXgpLnJlZHVjZShmdW5jdGlvbihzdHIsIHdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyICsgJyAnICsgd29yZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlZyA9IC9cXC4kLztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3Jkc1swXS5tYXRjaChyZWcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdvcmRzWzBdICsgJyAnICsgd29yZHNbMV0gKyAnIC4uLiAnICsgc3RyaW5nRW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd29yZHNbMF0gKyAnIC4uLiAnICsgc3RyaW5nRW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaFRleHQgJiYgJChzZWxmLnNlbGVjdFdyYXBwZXIpLndpZHRoKCkgPCBzZWxmLmxpc3RIZWxwZXIud2lkdGgoKSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5pbm5lckhUTUwgPSBsaXN0SXRlbVRleHQoaXRlbSwgc2VhcmNoVGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlSXRlbSA9PT0gaSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlSXRlbUNsaWNrKTtcbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBoYW5kbGVJdGVtTW91c2VPdmVyKTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QuYXBwZW5kQ2hpbGQoaXRlbUVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNlbGYudGFnZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHNlbGYubGlzdCk7XG5cblxuICAgICAgICAgICAgdmFyIGZpZWxkUmVjdCA9IHNlbGYuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICAgICAgZmllbGRPZmZzZXRUb3AgPSBzZWxmLmVsLm9mZnNldFRvcCxcbiAgICAgICAgICAgICAgICB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgbWVudVJlY3QgPSBzZWxmLmxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG5cbiAgICAgICAgICAgICAgICBoZWlnaHRDaGVjayA9IHdpbmRvd0hlaWdodCAtIGZpZWxkUmVjdC50b3AgLSBmaWVsZFJlY3QuaGVpZ2h0IC0gbWVudVJlY3QuaGVpZ2h0O1xuXG4gICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUudG9wID0gaGVpZ2h0Q2hlY2sgPiAwID8gZmllbGRPZmZzZXRUb3AgKyBmaWVsZFJlY3QuaGVpZ2h0ICsgNSArICdweCcgOiBmaWVsZE9mZnNldFRvcCAtIG1lbnVSZWN0LmhlaWdodCAtIDEwICsgJ3B4JztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vU2VsZWN0IGNsaWNrXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVRhZ2ZpZWxkQ2xpY2soZSkge1xuICAgICAgICAgICAgLy9lLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIC8vY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9DcmVhdGUgU2VhcmNoZmllbGRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5zZWFyY2ggfHwgc2VsZi5vcHRpb25zLml0ZW1zLmxlbmd0aCA+IDcgfHwgc2VsZi5vcHRpb25zLmNyZWF0ZVRhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2VsZi5zZWFyY2hGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX19zZWFyY2hmaWVsZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQucGxhY2Vob2xkZXIgPSBzZWxmLm9wdGlvbnMuc2VhcmNoUGxhY2Vob2xkZXIgfHwgJ1NlYXJjaC4uLic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudmFsdWUgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFnZmllbGRfX3RhZycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gc2VsZi5vcHRpb25zLnBsYWNlZm9sZGVyIHx8ICdTZWxlY3QgZnJvbSB0aGUgbGlzdCc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuY2xhc3NMaXN0LmFkZCgnanMtaGVscGVySW5wdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLnN0eWxlLnpJbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBoYW5kbGVTZWFyY2hGaWVsZElucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLmhlbHBlckZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfc3RhdGVfb3BlbicpO1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVMaXN0KHNlbGYub3B0aW9ucy5pdGVtcywgc2VsZi5hY3RpdmVJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVUYWdmaWVsZERvY0NsaWNrKTt9LCAxMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIC8vU2VsZWN0IGl0ZW0gaGFuZGxlclxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RUYWcoZWwpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZ2ZpZWxkX190YWcnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWdmaWVsZF9fc2VhcmNoZmllbGQnKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtaGVscGVySW5wdXQnKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLmhlbHBlckZpZWxkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAoc2VsZi5zZWFyY2hGaWVsZCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5zZXJ0QmVmb3JlKHNlbGYuX2NyZWF0ZVRhZyhlbC5pbm5lckhUTUwpLCBzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLl9jcmVhdGVUYWcoZWwuaW5uZXJIVE1MKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLml0ZW1zLnB1c2goZWwuaW5uZXJIVE1MKTtcblxuICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcblxuICAgICAgICAgICAgaWYgKHNlbGYuc2VhcmNoRmllbGQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGNyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5oZWxwZXJGaWVsZCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgY3JlYXRlTGlzdChzZWxmLm9wdGlvbnMuaXRlbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgICAgICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLml0ZW1DYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pdGVtQ2FsbGJhY2soZWwsIHNlbGYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUl0ZW1DbGljayhlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgc2VsZWN0VGFnKGUudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVJdGVtTW91c2VPdmVyKGUpIHtcbiAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVUYWdmaWVsZERvY0NsaWNrKGUpIHtcbiAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9GdWx0ZXIgZnVuY3Rpb24gZm9yIHNlYXJjZmllbGRcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2VhcmNoRmllbGRJbnB1dChlKSB7XG4gICAgICAgICAgICB2YXIgZkl0ZW1zID0gc2VsZi5vcHRpb25zLml0ZW1zLmZpbHRlcihmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhlLnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY3JlYXRlTGlzdChmSXRlbXMsIHNlbGYuYWN0aXZlSXRlbSwgZS50YXJnZXQudmFsdWUudG9Mb3dlckNhc2UoKSk7XG5cbiAgICAgICAgICAgIGlmIChlLnRhcmdldC52YWx1ZS5zbGljZSgtMSkgPT09ICcsJyAmJiBzZWxmLm9wdGlvbnMuY3JlYXRlVGFncykge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5zZXJ0QmVmb3JlKHNlbGYuX2NyZWF0ZVRhZyhlLnRhcmdldC52YWx1ZS5zbGljZSgwLCAtMSkpLCBzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgICAgIGUudGFyZ2V0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgZS50YXJnZXQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBjcmVhdGVMaXN0KHNlbGYub3B0aW9ucy5pdGVtcyk7XG4gICAgICAgICAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlS2V5RG93bihlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdmFyIGluZGV4LCBsZW5ndGg7XG4gICAgICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdFRhZyhzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJylbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUudGFyZ2V0LnZhbHVlICE9PSAnJyAmJiBzZWxmLm9wdGlvbnMuY3JlYXRlVGFncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbnNlcnRCZWZvcmUoc2VsZi5fY3JlYXRlVGFnKGUudGFyZ2V0LnZhbHVlKSwgc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnRhcmdldC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZS50YXJnZXQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAyNzpcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCAtIDEpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wIDwgNTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPiAwID8gJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpIC0gJChzZWxmLmxpc3QpLmhlaWdodCgpIDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmhlaWdodCgpIDwgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLm91dGVySGVpZ2h0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL0RlbGV0ZSB0YWcgaGFuZGxlXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZURlbGV0ZVRhZyhlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdmFyIHRhZyA9IGUudGFyZ2V0LnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgIHRhZy5yZW1vdmVDaGlsZChlLnRhcmdldCk7XG4gICAgICAgICAgICB2YXIgdGFnVGl0bGUgPSB0YWcuaW5uZXJIVE1MLFxuICAgICAgICAgICAgICAgIHRhZ0luZGV4ID0gc2VsZi5pdGVtcy5pbmRleE9mKHRhZ1RpdGxlKTtcbiAgICAgICAgICAgIGlmICh0YWdJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5pdGVtcyA9IFtdLmNvbmNhdChzZWxmLml0ZW1zLnNsaWNlKDAsIHRhZ0luZGV4KSwgc2VsZi5pdGVtcy5zbGljZSh0YWdJbmRleCArIDEpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5lbC5yZW1vdmVDaGlsZCh0YWcpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWdmaWVsZF9fdGFnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ3RhZ2ZpZWxkX3N0YXRlX29wZW4nKSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IHNlbGYub3B0aW9ucy5wbGFjZWZvbGRlciB8fCAnU2VsZWN0IGZyb20gdGhlIGxpc3QnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcblxuXG4gICAgICAgIH1cblxuICAgICAgICAvL0NoZWNrIGlmIGZpZWxkIGlzIGVtcHR5IG9yIG5vdCBhbmQgY2hhbmdlIGNsYXNzIGFjY29yZGluZ2x5XG4gICAgICAgICQodGhpcy50YWdmaWVsZFdyYXBwZXIpLm9uKCdjbGljaycsICcudGFnZmllbGRfX2ZpZWxkJywgaGFuZGxlVGFnZmllbGRDbGljayk7XG4gICAgICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcblxuICAgIH07XG5cbiAgICAvL0F1dG9yZXNpemUgdGV4dGFyZWFcbiAgICBUYWdmaWVsZC5wcm90b3R5cGUuX2F1dG9zaXplID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmVsLnZhbHVlID09PSAnJykge3RoaXMuZWwucm93cyA9IDE7fVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IHRoaXMuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgsXG4gICAgICAgICAgICAgICAgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSxcbiAgICAgICAgICAgICAgICB0ZXh0V2lkdGggPSB0aGlzLmVsLnZhbHVlLmxlbmd0aCAqIDcsXG4gICAgICAgICAgICAgICAgcm93ID0gTWF0aC5jZWlsKHRleHRXaWR0aCAvIHdpZHRoKTtcblxuICAgICAgICAgICAgcm93ID0gcm93IDw9IDAgPyAxIDogcm93O1xuICAgICAgICAgICAgcm93ID0gdGhpcy5vcHRpb25zLm1heEhlaWdodCAmJiByb3cgPiB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0ID8gdGhpcy5vcHRpb25zLm1heEhlaWdodCA6IHJvdztcblxuICAgICAgICAgICAgdGhpcy5lbC5yb3dzID0gcm93O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vQ3JlYXRlIFRhZyBIZWxwZXJcbiAgICBUYWdmaWVsZC5wcm90b3R5cGUuX2NyZWF0ZVRhZyA9IGZ1bmN0aW9uKHRhZ05hbWUpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICBkZWxUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICB0YWcuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX3RhZycpO1xuICAgICAgICB0YWcuaW5uZXJIVE1MID0gdGFnTmFtZTtcblxuICAgICAgICBkZWxUYWcuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX3RhZy1kZWxldGUnKTtcbiAgICAgICAgZGVsVGFnLmlubmVySFRNTCA9ICfinJUnO1xuICAgICAgICBkZWxUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgc2VsZi5fZGVsZXRlVGFnKGUudGFyZ2V0LnBhcmVudE5vZGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0YWcuYXBwZW5kQ2hpbGQoZGVsVGFnKTtcblxuICAgICAgICByZXR1cm4gdGFnO1xuICAgIH07XG5cbiAgICBUYWdmaWVsZC5wcm90b3R5cGUuX2RlbGV0ZVRhZyA9IGZ1bmN0aW9uKHRhZykge1xuICAgICAgICB0aGlzLmVsLnJlbW92ZUNoaWxkKHRhZyk7XG5cbiAgICAgICAgJCh0YWcpLmZpbmQoJy50YWdmaWVsZF9fdGFnLWRlbGV0ZScpLnJlbW92ZSgpO1xuICAgICAgICB2YXIgdGFnVGl0bGUgPSB0YWcuaW5uZXJIVE1MLFxuICAgICAgICAgICAgdGFnSW5kZXggPSB0aGlzLml0ZW1zLmluZGV4T2YodGFnVGl0bGUpO1xuICAgICAgICBpZiAodGFnSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5pdGVtcyA9IFtdLmNvbmNhdCh0aGlzLml0ZW1zLnNsaWNlKDAsIHRhZ0luZGV4KSwgdGhpcy5pdGVtcy5zbGljZSh0YWdJbmRleCArIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZ2ZpZWxkX190YWcnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgndGFnZmllbGRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICBpZiAodGhpcy5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ3RhZ2ZpZWxkX3N0YXRlX29wZW4nKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gc2VsZi5vcHRpb25zLnBsYWNlZm9sZGVyIHx8ICdTZWxlY3QgZnJvbSB0aGUgbGlzdCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdG9nZ2xlQWRkYWJsZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVsZXRlVGFnQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kZWxldGVUYWdDYWxsYmFjayh0YWcsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBUYWdmaWVsZC5wcm90b3R5cGUuX3RvZ2dsZUFkZGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKCQodGhpcy5lbCkuaGFzQ2xhc3MoJ2pzLWhhc1ZhbHVlJykpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmFkZENsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLnJlbW92ZUNsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLml0ZW1zID0gW107XG4gICAgICAgICQodGhpcy5lbCkuZmluZCgnLnRhZ2ZpZWxkX190YWcnKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgdGhpcy5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBpbml0VGFnZmllbGRzKCkge1xuICAgICAgICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy10YWdmaWVsZCcpKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBuZXcgVGFnZmllbGQoZWwsIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogZWwuZGF0YXNldC5sYWJlbCxcbiAgICAgICAgICAgICAgICBoZWxwVGV4dDogZWwuZGF0YXNldC5oZWxwVGV4dCxcbiAgICAgICAgICAgICAgICBlcnJNc2c6IGVsLmRhdGFzZXQuZXJyTXNnLFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBlbC5kYXRhc2V0LnBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBKU09OLnBhcnNlKGVsLmRhdGFzZXQuaXRlbXMpLFxuICAgICAgICAgICAgICAgIHNlYXJjaDogZWwuZGF0YXNldC5zZWFyY2gsXG4gICAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI6IGVsLmRhdGFzZXQuc2VhcmNoUGxhY2Vob2xkZXIsXG4gICAgICAgICAgICAgICAgY3JlYXRlVGFnczogZWwuZGF0YXNldC5jcmVhdGVOZXdUYWcsXG4gICAgICAgICAgICAgICAgaW5pdGlhbEl0ZW1zOiBlbC5kYXRhc2V0LnNlbGVjdGVkSXRlbXMgPyBKU09OLnBhcnNlKGVsLmRhdGFzZXQuc2VsZWN0ZWRJdGVtcykgOiAnJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGluaXRUYWdmaWVsZHMoKTtcblxuXG4vL30pKHdpbmRvdyk7XG5cbi8vRHJvcGRvd25cbmZ1bmN0aW9uIERyb3Bkb3duKGVsLCBvcHRpb25zKSB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLl9pbml0KCk7XG4gICAgdGhpcy5faW5pdEV2ZW50cygpO1xufVxuXG5Ecm9wZG93bi5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmRyb3Bkb3duV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZHJvcGRvd25XcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2pzLWRyb3Bkb3duV3JhcHBlcicpO1xuICAgIHRoaXMuZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5kcm9wZG93bldyYXBwZXIsIHRoaXMuZWwpO1xuICAgIHRoaXMuZHJvcGRvd25XcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnanMtZHJvcGRvd24nKTtcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2pzLWRyb3Bkb3duSXRlbScpO1xufTtcblxuRHJvcGRvd24ucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy9DbG9zZSBsaXN0IGhlbHBlclxuICAgIGZ1bmN0aW9uIGNsb3NlTGlzdCgpIHtcbiAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJyk7XG4gICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgIHNlbGYuZHJvcGRvd25XcmFwcGVyLnJlbW92ZUNoaWxkKHNlbGYubGlzdCk7XG4gICAgICAgICAgICBzZWxmLmxpc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlT3V0c2lkZUNsaWNrKTtcbiAgICB9XG4gICAgLy9IYW5kbGUgb3V0c2lkZSBkcm9wZG93biBjbGlja1xuICAgIGZ1bmN0aW9uIGhhbmRsZU91dHNpZGVDbGljayhlKSB7XG4gICAgICAgIGNsb3NlTGlzdCgpO1xuICAgIH1cblxuICAgIC8vSGFuZGxlIGRyb3Bkb3duIGNsaWNrXG4gICAgZnVuY3Rpb24gaGFuZGxlRHJvcGRvd25DbGljayhlKSB7XG5cbiAgICAgICAgLy9lLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAoc2VsZi5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLW9wZW4nKSkge2Nsb3NlTGlzdCgpO31cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCdpcy1vcGVuJyk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5jbGFzc0xpc3QuYWRkKCdjLURyb3Bkb3duLWxpc3QnKTtcblxuICAgICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uZGl2aWRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZHJvcGRvd25fX2RpdmlkZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Ryb3Bkb3duX19saXN0LWl0ZW0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmlubmVySFRNTCA9IGl0ZW0uaW5uZXJIVE1MIHx8IGl0ZW0udGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY2FsbGJhY2soZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLndhcm5pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS53YXJuaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGFzLXdhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5saXN0LmFwcGVuZENoaWxkKGl0ZW1FbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNlbGYuZHJvcGRvd25XcmFwcGVyLmFwcGVuZENoaWxkKHNlbGYubGlzdCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbGlzdFJlY3QgPSBzZWxmLmxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAobGlzdFJlY3QubGVmdCArIGxpc3RSZWN0LndpZHRoID4gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5saXN0LnN0eWxlLnJpZ2h0ID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUubGVmdCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChsaXN0UmVjdC50b3AgKyBsaXN0UmVjdC5oZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5saXN0LnN0eWxlLmJvdHRvbSA9ICcxMDAlJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUudG9wID0gJzEwMCUnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZU91dHNpZGVDbGljayk7fSwgMTAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGYuZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVEcm9wZG93bkNsaWNrKTtcbn07XG5cbi8vQWRkYWJsZSBGaWVsZHNcbi8vOyhmdW5jdGlvbih3aW5kb3cpIHtcbiAgICAvLyd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIEFkZGFibGUoZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHtzb3J0YWJsZTogdHJ1ZX07XG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgIH1cblxuICAgIEFkZGFibGUucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtYWRkYWJsZVdyYXBwZXInKTtcbiAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5pbnNlcnRCZWZvcmUoc2VsZi5lbCk7XG5cbiAgICAgICAgc2VsZi5lbC5yZW1vdmVDbGFzcygnanMtYWRkYWJsZScpO1xuICAgICAgICBzZWxmLmVsLmFkZENsYXNzKCdqcy1hZGRhYmxlSXRlbSBjLUFkZGFibGUtaXRlbScpO1xuXG4gICAgICAgIHNlbGYuYWRkYWJsZVJvdyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLWFkZGFibGVSb3cgYy1BZGRhYmxlLXJvdycpO1xuXG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMuc29ydGFibGUpIHtcbiAgICAgICAgICAgIHNlbGYuYWRkYWJsZVJvd0RyYWdIYW5kbGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnYy1BZGRhYmxlLXJvdy1kcmFnSGFuZGxlcicpO1xuICAgICAgICAgICAgc2VsZi5hZGRhYmxlUm93LmFwcGVuZChzZWxmLmFkZGFibGVSb3dEcmFnSGFuZGxlcik7XG5cbiAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuc29ydGFibGUoe1xuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBzZWxmLm9wdGlvbnMgPyBzZWxmLm9wdGlvbnMucGxhY2Vob2xkZXIgfHwgJ2MtQWRkYWJsZS1yb3dQbGFjZWhvbGRlcicgOiAnYy1BZGRhYmxlLXJvd1BsYWNlaG9sZGVyJyxcbiAgICAgICAgICAgICAgICBzdGFydDogZnVuY3Rpb24oZSwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgdWkuaXRlbS5hZGRDbGFzcygnaXMtZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgJChlLnRhcmdldCkuY3NzKCdoZWlnaHQnLCAkKGUudGFyZ2V0KS5oZWlnaHQoKSk7XG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5jc3MoJ2hlaWdodCcsICQoJ2JvZHknKS5oZWlnaHQoKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdG9wOiBmdW5jdGlvbihlLCB1aSkge1xuICAgICAgICAgICAgICAgICAgICB1aS5pdGVtLnJlbW92ZUNsYXNzKCdpcy1kcmFnZ2luZycpO1xuICAgICAgICAgICAgICAgICAgICAkKGUudGFyZ2V0KS5jc3MoJ2hlaWdodCcsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmNzcygnaGVpZ2h0JywgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5hZGRCdXR0b24gPSAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24tLXJvdW5kIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXkgYnV0dG9uLS1hZGQgYy1BZGRhYmxlLXJvdy1hZGRCdXR0b24nKS5jbGljayhoYW5kbGVBZGRSb3cpO1xuXG4gICAgICAgIHNlbGYucmVtb3ZlQnV0dG9uID0gJCgnPGJ1dHRvbj48L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uLS1yb3VuZCBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5IGJ1dHRvbi0tcmVtb3ZlIGpzLWFkZGFibGVSZW1vdmVCdXR0b24nKS5jbGljayhoYW5kbGVSZW1vdmVSb3cpO1xuXG4gICAgICAgIHNlbGYuYWRkYWJsZVJvdy5hcHBlbmQoc2VsZi5lbC5jbG9uZSh0cnVlLCB0cnVlKSwgdGhpcy5yZW1vdmVCdXR0b24sIHRoaXMuYWRkQnV0dG9uKTtcbiAgICAgICAgc2VsZi5vcmlnaW5hbEVsID0gc2VsZi5lbC5jbG9uZSh0cnVlLCB0cnVlKTtcbiAgICAgICAgc2VsZi5lbC5kZXRhY2goKTtcblxuICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLmFwcGVuZCh0aGlzLmFkZGFibGVSb3cuY2xvbmUodHJ1ZSwgdHJ1ZSkpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUFkZFJvdyhlKSB7XG4gICAgICAgICAgICAvL0NoZWNrIGlmIHRoZXJlIGFyZSBtb3JlIHRoYW4gMSBjaGlsZCBhbmQgY2hhbmdlIGNsYXNzXG4gICAgICAgICAgICBpZiAoc2VsZi5hZGRhYmxlV3JhcHBlci5jaGlsZHJlbigpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLmFkZENsYXNzKCdoYXMtbXVsdGlwbGVSb3dzJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ2hhcy1tdWx0aXBsZVJvd3MnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vc2VsZi5hZGRhYmxlV3JhcHBlci5hcHBlbmQoc2VsZi5hZGRhYmxlUm93LmNsb25lKHRydWUsIHRydWUpKTtcbiAgICAgICAgICAgIHZhciB3cmFwcGVyID0gc2VsZi5fYWRkSXRlbShzZWxmLm9yaWdpbmFsRWwuY2xvbmUodHJ1ZSwgdHJ1ZSksIHNlbGYub3B0aW9ucz8gc2VsZi5vcHRpb25zLmJlZm9yZUFkZCA6IG51bGwpO1xuXG4gICAgICAgICAgICAvL0luaXRpYWxpc2UgUmVhY3QgY29tcG9uZW50cyBvbiB0aGUgbmV3IHJvdywgaWYgdGhlcmUgYXJlIGFueVxuICAgICAgICAgICAgd2luZG93Lm1vdW50Q29tcG9uZW50cyh3cmFwcGVyWzBdKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVSZW1vdmVSb3coZSkge1xuICAgICAgICBcdCQoZS50YXJnZXQpLnBhcmVudHMoJy5qcy1hZGRhYmxlUm93JykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoc2VsZi5hZGRhYmxlV3JhcHBlci5jaGlsZHJlbignLmpzLWFkZGFibGVSb3cnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2FkZEl0ZW0oc2VsZi5vcmlnaW5hbEVsLmNsb25lKHRydWUsIHRydWUpLCBzZWxmLm9wdGlvbnM/IHNlbGYub3B0aW9ucy5iZWZvcmVBZGQgOiBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5yZW1vdmVDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ2hhcy1tdWx0aXBsZVJvd3MnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuX2FkZEl0ZW0gPSBmdW5jdGlvbihlbCwgYmVmb3JlQWRkKSB7XG4gICAgICAgICAgICBpZiAoYmVmb3JlQWRkKSB7XG4gICAgICAgICAgICAgICAgYmVmb3JlQWRkKGVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhZGRhYmxlUm93ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtYWRkYWJsZVJvdyBjLUFkZGFibGUtcm93JyksXG4gICAgICAgICAgICAgICAgYWRkQnV0dG9uID0gJCgnPGJ1dHRvbj48L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uLS1yb3VuZCBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5IGJ1dHRvbi0tYWRkIGMtQWRkYWJsZS1yb3ctYWRkQnV0dG9uJykuY2xpY2soaGFuZGxlQWRkUm93KSxcbiAgICAgICAgICAgICAgICByZW1vdmVCdXR0b24gPSAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24tLXJvdW5kIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXkgYnV0dG9uLS1yZW1vdmUganMtYWRkYWJsZVJlbW92ZUJ1dHRvbicpLmNsaWNrKGhhbmRsZVJlbW92ZVJvdyk7XG5cbiAgICAgICAgICAgIGVsLmFkZENsYXNzKCdqcy1hZGRhYmxlSXRlbSBjLUFkZGFibGUtaXRlbScpO1xuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5zb3J0YWJsZSkge1xuICAgICAgICAgICAgICAgIHZhciBhZGRhYmxlUm93RHJhZ0hhbmRsZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjLUFkZGFibGUtcm93LWRyYWdIYW5kbGVyJyk7XG4gICAgICAgICAgICAgICAgYWRkYWJsZVJvdy5hcHBlbmQoYWRkYWJsZVJvd0RyYWdIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZGFibGVSb3cuYXBwZW5kKGVsLCByZW1vdmVCdXR0b24sIGFkZEJ1dHRvbik7XG4gICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLmFwcGVuZChhZGRhYmxlUm93KTtcblxuICAgICAgICAgICAgaWYgKHNlbGYuYWRkYWJsZVdyYXBwZXIuY2hpbGRyZW4oKS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5hZGRDbGFzcygnaGFzLW11bHRpcGxlUm93cycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLnJlbW92ZUNsYXNzKCdoYXMtbXVsdGlwbGVSb3dzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmFmdGVyQWRkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLmFmdGVyQWRkKGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9BdXRvIHNjcm9sbCBwYWdlIHdoZW4gYWRkaW5nIHJvdyBiZWxvdyBzY3JlZW4gYm90dG9tIGVkZ2VcbiAgICAgICAgICAgIHZhciByb3dCb3R0b21FbmQgPSBhZGRhYmxlUm93LmdldCgwKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBhZGRhYmxlUm93LmhlaWdodCgpO1xuICAgICAgICAgICAgaWYgKHJvd0JvdHRvbUVuZCArIDYwID4gJCh3aW5kb3cpLmhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoIHsgc2Nyb2xsVG9wOiAnKz0nICsgTWF0aC5yb3VuZChyb3dCb3R0b21FbmQgKyA2MCAtICQod2luZG93KS5oZWlnaHQoKSkudG9TdHJpbmcoKSB9LCA0MDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5hZGRhYmxlV3JhcHBlcjtcbiAgICAgICAgfTtcbiAgICAgICAgc2VsZi5yZW1vdmVJdGVtID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuY2hpbGRyZW4oKS5zbGljZShpbmRleCwgaW5kZXgrMSkucmVtb3ZlKCk7XG4gICAgICAgICAgICBpZiAoc2VsZi5hZGRhYmxlV3JhcHBlci5jaGlsZHJlbignLmpzLWFkZGFibGVSb3cnKS5sZW5ndGggPD0gMSkge1xuICAgICAgICBcdFx0c2VsZi5hZGRhYmxlV3JhcHBlci5yZW1vdmVDbGFzcygnaGFzLW11bHRpcGxlUm93cycpO1xuICAgICAgICBcdH1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaW5pdEFkZGFibGVGaWVsZHMoKSB7XG4gICAgICAgIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWFkZGFibGUnKSkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbmV3IEFkZGFibGUoJChlbCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuLy99KSh3aW5kb3cpO1xuXG4vL0ltYWdlIFBsYWNlaG9sZGVyc1xuLy9UaGlzIGNsYXNzIGNyZWF0ZXMgYSBwYWxjZWhvbGRlciBmb3IgaW1hZ2UgZmlsZXMuIEl0IGhhbmRsZSBib3RoIGNsaWNrIHRvIGxvYWQgYW5kIGFsc28gc2VsZWN0IGZyb20gYXNzZXQgbGlicmFyeSBhY3Rpb24uXG5cbmZ1bmN0aW9uIEltYWdlUGxhY2Vob2xkZXIoZWwsIGZpbGUsIG9wdGlvbnMpIHtcbiAgdGhpcy5lbCA9IGVsO1xuICB0aGlzLmZpbGUgPSBmaWxlO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHRoaXMuX2luaXQoKTtcbiAgdGhpcy5faW5pdEV2ZW50cygpO1xufVxuXG5JbWFnZVBsYWNlaG9sZGVyLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm9wdGlvbnMubmFtZSA9IHRoaXMub3B0aW9ucy5uYW1lIHx8IHRoaXMuZWwuZGF0YXNldC5uYW1lO1xuICB0aGlzLm9wdGlvbnMuaWQgPSB0aGlzLmVsLmlkICsgJy1wbGFjZWhvbGRlcic7XG5cbiAgLy9XcmFwcCBwbGFjZWhvbGRlclxuICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2MtSW1hZ2VQbGFjZWhvbGRlcicpO1xuICBpZiAoIXRoaXMuZmlsZSkge3RoaXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpcy1lbXB0eScpO31cbiAgdGhpcy53cmFwcGVyLmlkID0gdGhpcy5vcHRpb25zLmlkO1xuXG4gIC8vUGxhY2Vob2xkZXIgSW1hZ2VcbiAgdGhpcy5pbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLmltYWdlLmNsYXNzTGlzdC5hZGQoJ2MtSW1hZ2VQbGFjZWhvbGRlci1pbWcnKTtcbiAgaWYgKHRoaXMuZmlsZSkge3RoaXMuaW1hZ2Uuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gdGhpcy5maWxlLmZpbGVEYXRhLnVybDt9XG4gIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmltYWdlKTtcblxuICAvL1BsYWNlaG9sZGVyIGNvbnRyb2xzXG4gIHRoaXMuY29udHJvbHMgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMnKS5nZXQoMCk7XG4gIHRoaXMuY29udHJvbHNVcGxvYWQgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMtYnV0dG9uJykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzVXBsb2FkSWNvbiA9ICQoJzxpIGNsYXNzPVwiZmEgZmEtdXBsb2FkXCI+PC9pPicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMtYnV0dG9uLWljb24nKS5nZXQoMCk7XG4gIHRoaXMuY29udHJvbHNVcGxvYWRUZXh0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbi10ZXh0JykudGV4dCgnVXBsb2FkIGZyb20geW91ciBjb21wdXRlcicpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc1VwbG9hZC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzVXBsb2FkSWNvbik7XG4gIHRoaXMuY29udHJvbHNVcGxvYWQuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc1VwbG9hZFRleHQpO1xuXG4gIHRoaXMuY29udHJvbHNEaXZpZGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWRpdmlkZXInKS5nZXQoMCk7XG5cbiAgdGhpcy5jb250cm9sc0xpYnJhcnkgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMtYnV0dG9uJykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzTGlicmFyeUljb24gPSAkKCc8aSBjbGFzcz1cImZhIGZhLWZvbGRlci1vcGVuXCI+PC9pPicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMtYnV0dG9uLWljb24nKS5nZXQoMCk7XG4gIHRoaXMuY29udHJvbHNMaWJyYXJ5VGV4dCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1idXR0b24tdGV4dCcpLnRleHQoJ0FkZCBmcm9tIGFzc2V0IGxpYnJhcnknKS5nZXQoMCk7XG4gIHRoaXMuY29udHJvbHNMaWJyYXJ5LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNMaWJyYXJ5SWNvbik7XG4gIHRoaXMuY29udHJvbHNMaWJyYXJ5LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNMaWJyYXJ5VGV4dCk7XG5cbiAgdGhpcy5jb250cm9scy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzVXBsb2FkKTtcbiAgdGhpcy5jb250cm9scy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzRGl2aWRlcik7XG4gIHRoaXMuY29udHJvbHMuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc0xpYnJhcnkpO1xuICB0aGlzLmltYWdlLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHMpO1xuXG4gIC8vQ2xlYXIgYnV0dG9uXG4gIHRoaXMuZGVsZXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRoaXMuZGVsZXRlLmNsYXNzTGlzdC5hZGQoJ2MtSW1hZ2VQbGFjZWhvbGRlci1kZWxldGUnKTtcbiAgdGhpcy5pbWFnZS5hcHBlbmRDaGlsZCh0aGlzLmRlbGV0ZSk7XG5cbiAgLy9FZGl0IGJ1dHRvblxuICB0aGlzLmVkaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgdGhpcy5lZGl0LmNsYXNzTGlzdC5hZGQoJ2J1dHRvbicsICdidXR0b25fc3R5bGVfb3V0bGluZS13aGl0ZScsICdjLUltYWdlUGxhY2Vob2xkZXItZWRpdCcpO1xuICB0aGlzLmVkaXQuaW5uZXJIVE1MID0gJ0VkaXQnO1xuICB0aGlzLmltYWdlLmFwcGVuZENoaWxkKHRoaXMuZWRpdCk7XG5cbiAgLy9GaWxlIG5hbWVcbiAgdGhpcy5maWxlTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLmZpbGVOYW1lLmNsYXNzTGlzdC5hZGQoJ2MtSW1hZ2VQbGFjZWhvbGRlci1maWxlTmFtZScpO1xuICB0aGlzLmZpbGVOYW1lLmlubmVySFRNTCA9IHRoaXMuZmlsZSA/IHRoaXMuZmlsZS5maWxlRGF0YS50aXRsZSA6ICcnO1xuICB0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5maWxlTmFtZSk7XG5cbiAgLy9QbGFjZWhvbGRlciBUaXRsZVxuICBpZiAodGhpcy5vcHRpb25zLm5hbWUpIHtcbiAgICB0aGlzLnRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy50aXRsZS5jbGFzc0xpc3QuYWRkKCdjLUltYWdlUGxhY2Vob2xkZXItdGl0bGUnKTtcbiAgICB0aGlzLnRpdGxlLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5uYW1lO1xuICAgIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLnRpdGxlKTtcbiAgfVxuXG4gIC8vRmlsZWlucHV0IHRvIGhhbmRsZSBjbGljayB0byB1cGxvYWQgaW1hZ2VcbiAgdGhpcy5maWxlSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gIHRoaXMuZmlsZUlucHV0LnR5cGUgPSBcImZpbGVcIjtcbiAgdGhpcy5maWxlSW5wdXQubXVsdGlwbGUgPSBmYWxzZTtcbiAgdGhpcy5maWxlSW5wdXQuaGlkZGVuID0gdHJ1ZTtcbiAgdGhpcy5maWxlSW5wdXQuYWNjZXB0ID0gXCJpbWFnZS8qLCB2aWRlby8qXCI7XG5cbiAgdGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZmlsZUlucHV0KTtcblxuICB0aGlzLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMud3JhcHBlciwgdGhpcy5lbCk7XG4gIHRoaXMuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmVsKTtcblxufTtcblxudmFyIHNjcm9sbFBvc2l0aW9uLCBzaW5nbGVzZWxlY3Q7XG5cbkltYWdlUGxhY2Vob2xkZXIucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBmdW5jdGlvbiBjbGVhcihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBzZWxmLmZpbGUgPSB1bmRlZmluZWQ7XG4gICAgc2VsZi5fdXBkYXRlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBvcGVuTGlicmFyeSgpIHtcbiAgICBzY3JvbGxQb3NpdGlvbiA9ICQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcbiAgICB1cGRhdGVBc3NldExpYnJhcnkoKTtcbiAgICAkKCcjYWwnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgJCgnI2FsJykuYWRkQ2xhc3MoJ21vZGFsJyk7XG4gICAgJCgnI3dyYXBwZXInKS5hZGRDbGFzcygnb3ZlcmZsb3cnKTtcbiAgICBzaW5nbGVzZWxlY3QgPSB0cnVlO1xuXG4gICAgJCgnI2FkZEZyb21BTEJ1dHRvbicpLnRleHQoc2VsZi5vcHRpb25zLmFsQnV0dG9uIHx8ICdTZXQgQ292ZXInKTtcblxuICAgICQoJyNhZGRGcm9tQUxCdXR0b24nKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgbGFzdFNlbGVjdGVkID0gbnVsbDtcbiAgICAgIHNldFNlbGVjdGVkRmlsZSgpO1xuICAgICAgY2xvc2VBc3NldExpYnJhcnkoKTtcbiAgICAgIHNpbmdsZXNlbGVjdCA9IGZhbHNlO1xuICAgICAgJCgnYm9keScpLnNjcm9sbFRvcChzY3JvbGxQb3NpdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZUFzc2V0TGlicmFyeSgpIHtcbiAgICBsYXN0U2VsZWN0ZWQgPSBudWxsO1xuICAgICQoJy5hbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgZGVzZWxlY3RBbGwoKTtcbiAgICAkKCcubW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJykucmVtb3ZlQ2xhc3MoJ21vZGFsJyk7XG4gICAgJCgnI3dyYXBwZXInKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3cnKTtcbiAgICAkKCcjYWRkRnJvbUFMQnV0dG9uJykudW5iaW5kKCdjbGljaycpO1xuICAgICQoJ2JvZHknKS5zY3JvbGxUb3Aoc2Nyb2xsUG9zaXRpb24pO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFNlbGVjdGVkRmlsZSgpIHtcbiAgICB2YXIgc2VsZWN0ZWRGaWxlID0gJCgnLmFsIC5maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKSxcbiAgICBmaWxlSWQgPSAkKHNlbGVjdGVkRmlsZSkuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpLFxuICAgIGZpbGUgPSBhc3NldExpYnJhcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG4gICAgICByZXR1cm4gZi5pZCA9PT0gZmlsZUlkO1xuICAgIH0pWzBdO1xuXG4gICAgc2VsZi5maWxlID0ge1xuICAgICAgZmlsZURhdGE6IGZpbGVcbiAgICB9O1xuICAgIHNlbGYuX3VwZGF0ZSgpO1xuICB9XG5cblxuICBzZWxmLmZpbGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgZmlsZVRvT2JqZWN0KGUudGFyZ2V0LmZpbGVzWzBdKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgc2VsZi5maWxlID0ge1xuICAgICAgICBmaWxlRGF0YTogcmVzLFxuICAgICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgIHBvc2l0aW9uOiAxMDAwLFxuICAgICAgICBjYXB0aW9uOiAnJyxcbiAgICAgICAgZ2FsbGVyeUNhcHRpb246IGZhbHNlLFxuICAgICAgICBqdXN0VXBsb2FkZWQ6IHRydWVcbiAgICAgIH07XG4gICAgICBzZWxmLl91cGRhdGUoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgc2VsZi5jb250cm9sc1VwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoIXNlbGYuZmlsZSkge1xuICAgICAgc2VsZi5maWxlSW5wdXQuY2xpY2soKTtcbiAgICB9XG4gIH0pO1xuICBzZWxmLmRlbGV0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsZWFyKTtcbiAgc2VsZi5lZGl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGVkaXRGaWxlcyhbc2VsZi5maWxlXSk7XG4gIH0pO1xuXG4gIHNlbGYuY29udHJvbHNMaWJyYXJ5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlbkxpYnJhcnkpO1xufTtcbkltYWdlUGxhY2Vob2xkZXIucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuZmlsZSkge1xuICAgIHRoaXMud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdpcy1lbXB0eScpO1xuICAgIHRoaXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKCdqcy1oYXNWYWx1ZScpO1xuICAgIHRoaXMuaW1hZ2Uuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybCgnICsgdGhpcy5maWxlLmZpbGVEYXRhLnVybCArICcpJztcbiAgICB0aGlzLmZpbGVOYW1lLmlubmVySFRNTCA9IHRoaXMuZmlsZS5maWxlRGF0YS50aXRsZTtcbiAgICB0aGlzLnR5cGUgPSB0aGlzLmZpbGUuZmlsZURhdGEudHlwZTtcbiAgfVxuICBlbHNlIHtcbiAgICB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaXMtZW1wdHknKTtcbiAgICB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnanMtaGFzVmFsdWUnKTtcbiAgICB0aGlzLmltYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICdub25lJztcbiAgICB0aGlzLmZpbGVOYW1lLmlubmVySFRNTCA9ICcnO1xuICAgIHRoaXMudHlwZSA9IHVuZGVmaW5lZDtcbiAgfVxuICBpZiAodGhpcy5vcHRpb25zLm9uVXBkYXRlKSB7XG4gICAgdGhpcy5vcHRpb25zLm9uVXBkYXRlKHRoaXMpO1xuICB9XG59O1xuXG5JbWFnZVBsYWNlaG9sZGVyLnByb3RvdHlwZS5zZXRJbWFnZSA9IGZ1bmN0aW9uKGZpbGUpIHtcbiAgdGhpcy5maWxlID0gZmlsZTtcbiAgdGhpcy5fdXBkYXRlKCk7XG59O1xuXG5mdW5jdGlvbiBpbml0SW1hZ2VQbGFjZWhvbGRlcnMoKSB7XG4gIHZhciBpbWFnZVBsYWNlaG9sZGVycyA9IFtdO1xuICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1pbWFnZVBsYWNlaG9sZGVyJykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICBpbWFnZVBsYWNlaG9sZGVycy5wdXNoKG5ldyBJbWFnZVBsYWNlaG9sZGVyKGVsKSk7XG4gIH0pO1xuICByZXR1cm4gaW1hZ2VQbGFjZWhvbGRlcnM7XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICBtb2R1bGUuZXhwb3J0cyA9IEltYWdlUGxhY2Vob2xkZXI7XG59XG5cbi8vQ29tcGxleFNlbGVjdFxuLy87KGZ1bmN0aW9uKHdpbmRvdykge1xuICAgIC8vJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gQ29tcGxleFNlbGVjdGJveChlbCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cblxuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgICAgIHRoaXMuX2luaXRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBDb21wbGV4U2VsZWN0Ym94LnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmN1c3RvbVZhbHVlID0gXCJcIjtcbiAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gdGhpcy5vcHRpb25zLml0ZW1zLmluZGV4T2YodGhpcy5vcHRpb25zLnNlbGVjdGVkSXRlbSk7XG4gICAgICAgIHRoaXMub3B0aW9ucy51bnNlbGVjdCA9IHRoaXMub3B0aW9ucy51bnNlbGVjdCA9PT0gdHJ1ZSA/ICfigJQgTm9uZSDigJQnIDogdGhpcy5vcHRpb25zLnVuc2VsZWN0O1xuXG4gICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnc2VsZWN0X193cmFwcGVyJyk7XG4gICAgICAgIHRoaXMuZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5zZWxlY3RXcmFwcGVyLCB0aGlzLmVsKTtcbiAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2pzLXNlbGVjdGJveCcpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fZmllbGQnLCAnc2VsZWN0Ym94X19maWVsZC0tY29tcGxleCcpO1xuXG5cbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlSXRlbSA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLml0ZW1zW3RoaXMuYWN0aXZlSXRlbV07XG4gICAgICAgICAgICB0aGlzLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxhYmVsKSB7XG4gICAgICAgICAgICB0aGlzLmxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmxhYmVsO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2xhYmVsJyk7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmZvciA9IHRoaXMuZWwuaWQ7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5sYWJlbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWxwVGV4dCkge1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuaGVscFRleHQ7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9faGVscC10ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5oZWxwVGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lcnJNc2cpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0aGlzLmVyck1zZy5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuZXJyTXNnO1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19lcnItbXNnJyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lcnJNc2cpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIENvbXBsZXhTZWxlY3Rib3gucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAvL0Nsb3NlIGxpc3QgaGVscGVyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlTGlzdCgpIHtcbiAgICAgICAgICAgIHZhciBpbnB1dFZhbHVlO1xuICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3Rib3hfc3RhdGVfb3BlbicpO1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0V3JhcHBlci5yZW1vdmVDaGlsZChzZWxmLmxpc3QpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLnNlYXJjaEZpZWxkICYmIHNlbGYuc2VhcmNoRmllbGQucGFyZW50Tm9kZSA9PT0gc2VsZi5lbCkge1xuICAgICAgICAgICAgICAgIGlucHV0VmFsdWUgPSBzZWxmLnNlYXJjaEZpZWxkLnZhbHVlO1xuICAgICAgICAgICAgICAgIHNlbGYuZWwucmVtb3ZlQ2hpbGQoc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5pbnB1dEZpZWxkICYmIHNlbGYuaW5wdXRGaWVsZC5wYXJlbnROb2RlID09PSBzZWxmLmVsKSB7XG4gICAgICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IHNlbGYuaW5wdXRGaWVsZC52YWx1ZTtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLnJlbW92ZUNoaWxkKHNlbGYuaW5wdXRGaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5hY3RpdmVJdGVtID49IDApIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IHNlbGYub3B0aW9ucy5pdGVtc1tzZWxmLmFjdGl2ZUl0ZW1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc2VsZi5vcHRpb25zLmFsbG93Q3VzdG9tID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBzZWxmLmN1c3RvbVZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZVNlbGVjdERvY0NsaWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vQ3JlYXRlIGxpc3QgaGVscGVyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUxpc3QoaXRlbXMsIGFjdGl2ZUl0ZW0sIHNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzZWxmLmxpc3QpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgc2VsZi5saXN0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fbGlzdCcpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0SXRlbShpdGVtLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtQ2xhc3MgPSBzZWxmLm9wdGlvbnMuY29tcGxleEl0ZW1zID8gJ3NlbGVjdGJveF9fbGlzdC1pdGVtIHNlbGVjdGJveF9fbGlzdC1pdGVtLS1jb21wbGV4JyA6ICdzZWxlY3Rib3hfX2xpc3QtaXRlbSBzZWxlY3Rib3hfX2xpc3QtaXRlbS0tdGV4dCcsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50ID0gJCgnPGxpPjwvbGk+JykuYWRkQ2xhc3MoaXRlbUNsYXNzKS50ZXh0KGl0ZW0pLFxuICAgICAgICAgICAgICAgICAgICBsaXN0SGVscGVyID0gJCgnPGRpdj48L2Rpdj4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtaXRlbScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdwb3NpdGlvbicsICdhYnNvbHV0ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCd6LWluZGV4JywgJy0xJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdvdmVyZmxvdycsICd2aXNpYmxlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3doaXRlLXNwYWNlJywgJ25vd3JhcCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dChpdGVtKTtcblxuICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZChsaXN0SGVscGVyLmdldCgwKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5hdHRyKCdkYXRhLWluZGV4JywgaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuY29tcGxleEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmdldCgwKS5pbm5lckhUTUwgPSBpdGVtO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzZWFyY2hUZXh0ICYmICFzZWxmLm9wdGlvbnMuY29tcGxleEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmdldCgwKS5pbm5lckhUTUwgPSBsaXN0SXRlbVRleHQoaXRlbSwgc2VhcmNoVGV4dCwgJChzZWxmLmxpc3QpLndpZHRoKCkgPCBsaXN0SGVscGVyLndpZHRoKCkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50Lm9uKCdtb3VzZWRvd24nLCBoYW5kbGVJdGVtQ2xpY2spO1xuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50Lm9uKCdtb3VzZW92ZXInLCBoYW5kbGVJdGVtTW91c2VPdmVyKTtcblxuICAgICAgICAgICAgICAgIGxpc3RIZWxwZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1FbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdEl0ZW1UZXh0KGl0ZW1TdHJpbmcsIHRleHQsIGxvbmcpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0U3RyaW5nID0gaXRlbVN0cmluZztcbiAgICAgICAgICAgICAgICBpZiAobG9uZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgd29yZHMgPSBpdGVtU3RyaW5nLnNwbGl0KCcgJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hJbmRleCA9IHdvcmRzLnJlZHVjZShmdW5jdGlvbihjdXJyZW50SW5kZXgsIHdvcmQsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3RyaW5nID0gd29yZC50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGV4dCkgPiAtMSAmJiBjdXJyZW50SW5kZXggPT09IC0xID8gaW5kZXggOiBjdXJyZW50SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAtMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlYXJjaEluZGV4ID49IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdHJpbmdFbmQgPSB3b3Jkcy5zbGljZShzZWFyY2hJbmRleCkucmVkdWNlKGZ1bmN0aW9uKHN0ciwgd29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHIgKyAnICcgKyB3b3JkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gL1xcLiQvO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRzWzBdLm1hdGNoKHJlZykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTdHJpbmcgPSB3b3Jkc1swXSArICcgJyArIHdvcmRzWzFdICsgJyAuLi4gJyArIHN0cmluZ0VuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3RyaW5nID0gd29yZHNbMF0gKyAnIC4uLiAnICsgc3RyaW5nRW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHN0YXJ0VGV4dEluZGV4ID0gb3V0cHV0U3RyaW5nLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0LnRvTG93ZXJDYXNlKCkpLFxuICAgICAgICAgICAgICAgICAgICBlbmRUZXh0SW5kZXggPSBzdGFydFRleHRJbmRleCArIHRleHQubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IG91dHB1dFN0cmluZy5zbGljZSgwLCBzdGFydFRleHRJbmRleCksXG4gICAgICAgICAgICAgICAgICAgIG1pZGRsZSA9IG91dHB1dFN0cmluZy5zbGljZShzdGFydFRleHRJbmRleCwgZW5kVGV4dEluZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgZW5kID0gb3V0cHV0U3RyaW5nLnNsaWNlKGVuZFRleHRJbmRleCksXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICAgICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3RhcnQpKTtcbiAgICAgICAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKCQoJzxzcGFuPjwvc3Bhbj4nKS5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWhpZ2hsaWdodCcpLnRleHQobWlkZGxlKS5nZXQoMCkpO1xuICAgICAgICAgICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZW5kKSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5pbm5lckhUTUw7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRpdmlkZXIoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICQoJzxsaT48L2xpPicpLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtZGl2aWRlcicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VsZi5saXN0KTtcblxuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy51bnNlbGVjdCAmJiAhc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdJdGVtID0gbGlzdEl0ZW0oc2VsZi5vcHRpb25zLnVuc2VsZWN0KS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkIHNlbGVjdGJveF9fbGlzdC11bnNlbGVjdCcpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChuZXdJdGVtLmdldCgwKSk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LmFwcGVuZENoaWxkKGRpdmlkZXIoKS5nZXQoMCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3SXRlbSA9IGxpc3RJdGVtKGl0ZW0sIHNlbGYub3B0aW9ucy5pdGVtcy5pbmRleE9mKGl0ZW0pKTtcblxuICAgICAgICAgICAgICAgIGlmIChpID09PSAwICYmIHNlbGYubGlzdC5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3SXRlbS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtID09PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0l0ZW0uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChuZXdJdGVtLmdldCgwKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGZpZWxkUmVjdCA9IHNlbGYuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICAgICAgZmllbGRPZmZzZXRUb3AgPSBzZWxmLmVsLm9mZnNldFRvcCxcbiAgICAgICAgICAgICAgICB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgbWVudVJlY3QgPSBzZWxmLmxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG5cbiAgICAgICAgICAgICAgICBoZWlnaHRDaGVjayA9IHdpbmRvd0hlaWdodCAtIGZpZWxkUmVjdC50b3AgLSBmaWVsZFJlY3QuaGVpZ2h0IC0gbWVudVJlY3QuaGVpZ2h0O1xuXG4gICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUudG9wID0gaGVpZ2h0Q2hlY2sgPiAwID8gZmllbGRPZmZzZXRUb3AgKyBmaWVsZFJlY3QuaGVpZ2h0ICsgNSArICdweCcgOiBmaWVsZE9mZnNldFRvcCAtIG1lbnVSZWN0LmhlaWdodCAtIDEwICsgJ3B4JztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdEl0ZW0oaXRlbSkge1xuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy51bnNlbGVjdCAmJiBpdGVtLmlubmVySFRNTCA9PT0gc2VsZi5vcHRpb25zLnVuc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hY3RpdmVJdGVtID0gLTE7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3Rib3hfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFjdGl2ZUl0ZW0gPSBpdGVtLmRhdGFzZXQuaW5kZXg7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuaXRlbUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLml0ZW1DYWxsYmFjayhpdGVtLCBzZWxmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vU2VsZWN0IGNsaWNrXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNlbGVjdENsaWNrKGUpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuYWN0aXZlSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgdGhlcmUgaXMgYW55IHNlbGVjdGVkIGl0ZW0uIElmIG5vdCBzZXQgdGhlIHBsYWNlaG9sZGVyIHRleHRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuYWN0aXZlSXRlbSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gc2VsZi5wbGFjZWhvbGRlciB8fCAnU2VsZWN0JztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgc2VhcmNoIG9wdGlvbiBpcyBvbiBvciB0aGVyZSBpcyBtb3JlIHRoYW4gMTAgaXRlbXMuIElmIHllcywgYWRkIHNlYXJjZmllbGRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5zZWFyY2ggfHwgc2VsZi5vcHRpb25zLml0ZW1zLmxlbmd0aCA+IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2VsZi5zZWFyY2hGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fc2VhcmNoZmllbGQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnBsYWNlaG9sZGVyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuc2VhcmNoRmllbGQpOzJcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuYWN0aXZlSXRlbSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgYWN0aXZlIGl0ZW1cIiwgc2VsZi5vcHRpb25zLml0ZW1zW3NlbGYuYWN0aXZlSXRlbV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudmFsdWUgPSBzZWxmLm9wdGlvbnMuaXRlbXNbc2VsZi5hY3RpdmVJdGVtXS5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNlbGYub3B0aW9ucy5hbGxvd0N1c3RvbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudmFsdWUgPSBzZWxmLmN1c3RvbVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaGFuZGxlU2VhcmNoRmllbGRJbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLmlucHV0RmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfc3RhdGVfb3BlbicpO1xuICAgICAgICAgICAgICAgICAgICAvL2NyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zLCBzZWxmLmFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZVNlbGVjdERvY0NsaWNrKTt9LCAxMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL1NlbGVjdCBpdGVtIGhhbmRsZXJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlSXRlbUNsaWNrKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBzZWxlY3RJdGVtKGUudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVJdGVtTW91c2VPdmVyKGUpIHtcbiAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTZWxlY3REb2NDbGljaygpIHtcbiAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9GdWx0ZXIgZnVuY3Rpb24gZm9yIHNlYXJjZmllbGRcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2VhcmNoRmllbGRJbnB1dChlKSB7XG4gICAgICAgICAgICB2YXIgZkl0ZW1zID0gc2VsZi5vcHRpb25zLml0ZW1zLmZpbHRlcihmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhlLnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY3JlYXRlTGlzdChmSXRlbXMsIHNlbGYuYWN0aXZlSXRlbSwgZS50YXJnZXQudmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVLZXlVcChlKSB7XG4gICAgICAgICAgICAvLyBSZWNvcmRzIHRoZSBjdXN0b20gdmFsdWVcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBzZWxmLmN1c3RvbVZhbHVlID0gc2VsZi5zZWFyY2hGaWVsZC52YWx1ZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuY3VzdG9tVmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlS2V5RG93bihlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdmFyIGluZGV4LCBsZW5ndGg7XG4gICAgICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdEl0ZW0oc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAyNzpcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCAtIDEpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgPCA1MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpIC0gJChzZWxmLmxpc3QpLmhlaWdodCgpID4gMCA/ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5oZWlnaHQoKSA8ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLm91dGVySGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4KS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4KS5oZWlnaHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9DaGVjayBpZiBmaWVsZCBpcyBlbXB0eSBvciBub3QgYW5kIGNoYW5nZSBjbGFzcyBhY2NvcmRpbmdseVxuICAgICAgICAkKHNlbGYuZWwpLm9uKCdjbGljaycsIGhhbmRsZVNlbGVjdENsaWNrKTtcbiAgICB9O1xuXG4gICAgQ29tcGxleFNlbGVjdGJveC5wcm90b3R5cGUuX3RvZ2dsZUFkZGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKCQodGhpcy5lbCkuaGFzQ2xhc3MoJ2pzLWhhc1ZhbHVlJykpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmFkZENsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLnJlbW92ZUNsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIENvbXBsZXhTZWxlY3Rib3gucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0Ym94X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSAtMTtcbiAgICB9O1xuXG4gICAgLypmdW5jdGlvbiBpbml0Q29tcGxleFNlbGVjdGJveGVzKCkge1xuICAgICAgICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1jb21wbGV4Q29tcGxleFNlbGVjdGJveCcpKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBuZXcgQ29tcGxleFNlbGVjdGJveChlbCwge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBlbC5kYXRhc2V0LmxhYmVsLFxuICAgICAgICAgICAgICAgIGhlbHBUZXh0OiBlbC5kYXRhc2V0LmhlbHBUZXh0LFxuICAgICAgICAgICAgICAgIGVyck1zZzogZWwuZGF0YXNldC5lcnJNc2csXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IGVsLmRhdGFzZXQucGxhY2Vob2xkZXIsXG4gICAgICAgICAgICAgICAgaXRlbXM6IEpTT04ucGFyc2UoZWwuZGF0YXNldC5pdGVtcyksXG4gICAgICAgICAgICAgICAgc2VhcmNoOiBlbC5kYXRhc2V0LnNlYXJjaCxcbiAgICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcjplbC5kYXRhc2V0LnNlYXJjaFBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBlbC5kYXRhc2V0LnJlcXVpcmVkLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkSXRlbTogZWwuZGF0YXNldC5zZWxlY3RlZEl0ZW0sXG4gICAgICAgICAgICAgICAgdW5zZWxlY3Q6IGVsLmRhdGFzZXQudW5zZWxlY3RcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0Q29tcGxleFNlbGVjdGJveGVzKCk7Ki9cblxuXG4vL30pKHdpbmRvdyk7XG5cbi8qXG4gKiBJbml0aWFsaXphdGlvbnNcbiAqL1xuXG4vL1N0aWNrYWJsZVxuZnVuY3Rpb24gU3RpY2thYmxlKGVsLCBvcHRpb25zKSB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLl9pbml0KCk7XG59XG5cblN0aWNrYWJsZS5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5ib3VuZGFyeSA9IHNlbGYub3B0aW9ucy5ib3VuZGFyeSA/IHNlbGYub3B0aW9ucy5ib3VuZGFyeSA9PT0gdHJ1ZSA/IHNlbGYuZWwucGFyZW50Tm9kZSA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZi5vcHRpb25zLmJvdW5kYXJ5KSA6IHVuZGVmaW5lZDtcbiAgICBzZWxmLm9mZnNldCA9IHNlbGYub3B0aW9ucy5vZmZzZXQgfHwgMDtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZVNjcm9sbCgpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRSZWN0ID0gc2VsZi5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgIGVsZW1lbnRCb3R0b21PZmZzZXQgPSBlbGVtZW50UmVjdC50b3AgKyBlbGVtZW50UmVjdC5oZWlnaHQ7XG5cblxuICAgICAgICBpZiAoKHNlbGYub3B0aW9ucy5tYXhXaWR0aCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSBzZWxmLm9wdGlvbnMubWF4V2lkdGgpIHx8ICFzZWxmLm9wdGlvbnMubWF4V2lkdGgpIHtcbiAgICAgICAgICAgIGlmICghc2VsZi5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudFJlY3QudG9wIC0gc2VsZi5vcHRpb25zLm9mZnNldCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbGVtZW50T2Zmc2V0UGFyZW50ID0gc2VsZi5lbC5vZmZzZXRQYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW5pdGlhbE9mZnNldCA9IHNlbGYuZWwub2Zmc2V0VG9wO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoc2VsZi5vcHRpb25zLmNsYXNzIHx8ICdpcy1zdHVjaycpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS50b3AgPSBzZWxmLm9mZnNldC50b1N0cmluZygpICsgJ3B4JztcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRPZmZzZXRQYXJlbnRSZWN0ID0gc2VsZi5lbGVtZW50T2Zmc2V0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmJvdW5kYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBib3VuZGFyeVJlY3QgPSBzZWxmLmJvdW5kYXJ5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRhcnlCb3R0b21PZmZzZXQgPSBib3VuZGFyeVJlY3QudG9wICsgYm91bmRhcnlSZWN0LmhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudEJvdHRvbU9mZnNldCA+IGJvdW5kYXJ5Qm90dG9tT2Zmc2V0IHx8IGVsZW1lbnRSZWN0LnRvcCA8IHNlbGYub3B0aW9ucy5vZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUudG9wID0gTWF0aC5yb3VuZChib3VuZGFyeUJvdHRvbU9mZnNldCAtIGVsZW1lbnRSZWN0LmhlaWdodCkudG9TdHJpbmcoKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudFJlY3QudG9wID4gc2VsZi5vZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUudG9wID0gc2VsZi5vZmZzZXQudG9TdHJpbmcoKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub2Zmc2V0IDwgc2VsZi5pbml0aWFsT2Zmc2V0ICsgZWxlbWVudE9mZnNldFBhcmVudFJlY3QudG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS5wb3NpdGlvbiA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnRvcCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlUmVzaXplKCkge1xuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiBzZWxmLm9wdGlvbnMubWF4V2lkdGgpIHtcbiAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUucG9zaXRpb24gPSAnJztcbiAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUudG9wID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoYW5kbGVTY3JvbGwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib3B0aW1pemVkU2Nyb2xsXCIsIGhhbmRsZVNjcm9sbCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvcHRpbWl6ZWRSZXNpemVcIiwgaGFuZGxlUmVzaXplKTtcbn07XG5cbi8vUmVxdWlyZWQgRmllbGRzXG5mdW5jdGlvbiBub3JtYWxpemVSZXF1aXJlZENvdW50KCkge1xuICAgICQoJy5qcy1yZXF1aXJlZENvdW50JykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgdmFyIGNhcmQgPSAkKGVsKS5wYXJlbnRzKCcuY2FyZCcpLFxuICAgICAgICAgICAgY2FyZElkID0gY2FyZC5hdHRyKCdpZCcpLFxuICAgICAgICAgICAgZW1wdHlSZXF1aXJlZEZpZWxkc0NvdW50ID0gY2FyZC5maW5kKCcuanMtcmVxdWlyZWQnKS5sZW5ndGggLSBjYXJkLmZpbmQoJy5qcy1yZXF1aXJlZC5qcy1oYXNWYWx1ZScpLmxlbmd0aCxcbiAgICAgICAgICAgIG5hdkl0ZW0gPSAkKCcuanMtc2Nyb2xsU3B5TmF2IC5qcy1zY3JvbGxOYXZJdGVtW2RhdGEtaHJlZj1cIicgKyBjYXJkSWQgKyAnXCJdJyk7XG5cbiAgICAgICAgaWYgKGVtcHR5UmVxdWlyZWRGaWVsZHNDb3VudCA+IDApIHtcbiAgICAgICAgICAgIG5hdkl0ZW0uYWRkQ2xhc3MoJ2lzLXJlcXVpcmVkJyk7XG4gICAgICAgICAgICAkKGVsKS50ZXh0KGVtcHR5UmVxdWlyZWRGaWVsZHNDb3VudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuYXZJdGVtLnJlbW92ZUNsYXNzKCdpcy1yZXF1aXJlZCcpO1xuICAgICAgICAgICAgJChlbCkudGV4dCgnJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG4vL1BhZ2luYXRpb25cbmZ1bmN0aW9uIFBhZ2luYXRpb24oZWwsIHN0b3JlLCB1cGRhdGVGdW5jdGlvbikge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgdGhpcy51cGRhdGUgPSB1cGRhdGVGdW5jdGlvbjtcblxuICAgIHRoaXMuX2luaXQoKTtcbn1cblxuUGFnaW5hdGlvbi5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmVuZGVyUGFnaW5hdGlvbigpO1xuXG4gICAgZnVuY3Rpb24gaGFuZGxlUGFnZUNsaWNrKGUpIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0LmRhdGFzZXQudGFyZ2V0IHx8IGUudGFyZ2V0LnBhcmVudE5vZGUuZGF0YXNldC50YXJnZXQ7XG4gICAgICAgIHN3aXRjaCAodGFyZ2V0KSB7XG4gICAgICAgICAgICBjYXNlICdwcmV2JzpcbiAgICAgICAgICAgICAgICBzZWxmLnN0b3JlLnNldFBhZ2Uoc2VsZi5zdG9yZS5wYWdlIC0gMSA8IDAgPyAwIDogc2VsZi5zdG9yZS5wYWdlIC0gMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICduZXh0JzpcbiAgICAgICAgICAgICAgICBzZWxmLnN0b3JlLnNldFBhZ2Uoc2VsZi5zdG9yZS5wYWdlICsgMSA9PT0gc2VsZi5zdG9yZS5wYWdlc051bWJlcigpID8gc2VsZi5zdG9yZS5wYWdlc051bWJlcigpIC0gMSA6IHNlbGYuc3RvcmUucGFnZSArIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi51cGRhdGUoJCgnI2xpYnJhcnlCb2R5JyksIHNlbGYuc3RvcmUsIHJlbmRlckNvbnRlbnRSb3cpO1xuICAgICAgICByZW5kZXJQYWdpbmF0aW9uKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyUGFnaW5hdGlvbigpIHtcbiAgICAgICAgdmFyIGxpbmtzID0gJCgnPHVsPjwvdWw+JykuYWRkQ2xhc3MoJ3BhZ2luYXRpb25fX2xpc3QnKTtcbiAgICAgICAgc2VsZi5lbC5lbXB0eSgpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc3RvcmUucGFnZXNOdW1iZXIoKSk7XG5cbiAgICAgICAgaWYgKHNlbGYuc3RvcmUucGFnZXNOdW1iZXIoKSA+IDEpIHtcbiAgICAgICAgICAgIC8vUHJldlxuICAgICAgICAgICAgdmFyIHByZXZMaW5rID0gJCgnPGxpPjxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtbGVmdFwiPjwvaT48L2xpPicpLmFkZENsYXNzKCdwYWdpbmF0aW9uX19wcmV2JykuYXR0cignZGF0YS10YXJnZXQnLCAncHJldicpLmNsaWNrKGhhbmRsZVBhZ2VDbGljayk7XG4gICAgICAgICAgICBpZiAoc2VsZi5zdG9yZS5wYWdlID09PSAwKSB7cHJldkxpbmsuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7fVxuICAgICAgICAgICAgbGlua3MuYXBwZW5kKHByZXZMaW5rKTtcblxuICAgICAgICAgICAgLy9DdXJyZW50IHBhZ2UgaW5kaWNhdG9yXG4gICAgICAgICAgICAvL3ZhciBjdXJyZW50UGFnZSA9ICQoJzxsaT48L2xpPicpLmFkZENsYXNzKCdwYWdpbmF0aW9uX19jdXJyZW50JykudGV4dChzZWxmLnN0b3JlLnBhZ2UgKyAxKTtcbiAgICAgICAgICAgIC8vbGlua3MuYXBwZW5kKGN1cnJlbnRQYWdlKTtcblxuICAgICAgICAgICAgLy9OZXh0XG4gICAgICAgICAgICB2YXIgbmV4dExpbmsgPSAkKCc8bGk+PGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1yaWdodFwiPjwvaT48L2xpPicpLmFkZENsYXNzKCdwYWdpbmF0aW9uX19uZXh0JykuYXR0cignZGF0YS10YXJnZXQnLCAnbmV4dCcpLmNsaWNrKGhhbmRsZVBhZ2VDbGljayk7XG4gICAgICAgICAgICBpZiAoc2VsZi5zdG9yZS5wYWdlID09PSBzZWxmLnN0b3JlLnBhZ2VzTnVtYmVyKCkgLSAxKSB7bmV4dExpbmsuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7fVxuICAgICAgICAgICAgbGlua3MuYXBwZW5kKG5leHRMaW5rKTtcblxuICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmQobGlua3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuZWw7XG4gICAgfVxuXG59O1xuXG5cblxuLy9HbG9iYWwgdmFyaWFibGVzXG52YXIgZWRpdGVkRmlsZXNEYXRhID0gW10sXG5lZGl0ZWRGaWxlRGF0YSA9IHt9LFxuY2xhc3NMaXN0ID0gW10sXG5kYXRhQ2hhbmdlZCA9IGZhbHNlLCAvL0NoYW5nZXMgd2hlbiB1c2VyIG1ha2UgYW55IGNoYW5nZXMgb24gZWRpdCBzY3JlZW47XG5sYXN0U2VsZWN0ZWQgPSBudWxsLCAvL0luZGV4IG9mIGxhc3QgU2VsZWN0ZWQgZWxlbWVudCBmb3IgbXVsdGkgc2VsZWN0O1xuZ2FsbGVyeU9iamVjdHMgPSBbXSxcbmRyYWZ0SXNTYXZlZCA9IGZhbHNlLFxuZGlzYWJsZWRJdGVtcyA9IFtdO1xuXG4vL05ldyBHYWxsZXJ5IE1lZGlhIHRhYlxuLy8gQ3JlYXRlIERPTSBlbGVtZW50IGZvciBGaWxlIGZyb20gZGF0YVxuZnVuY3Rpb24gY3JlYXRlRmlsZUVsZW1lbnQoZikge1xuICAgIHZhciBmaWxlRGF0YSA9IGYuZmlsZURhdGE7XG4gICAgLy9jcmVhdGUgYmFzaWMgZWxlbWVudFxuICAgIHZhciBmaWxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZSBmaWxlX3R5cGVfaW1nIGZpbGVfdmlld19ncmlkJyksXG4gICAgICAgIGZpbGVJbmRleCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2hpZGRlbiBmaWxlX19pZCcpLnRleHQoZmlsZURhdGEuaWQpLFxuXG4gICAgICAgIGZpbGVJbWcgPSAkKCc8ZGl2PjwvZGl2PicpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnZmlsZV9faW1nJylcbiAgICAgICAgICAgICAgICAgICAgLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIGZpbGVEYXRhLnVybCArICcpJyksXG4gICAgICAgIGZpbGVDb250cm9scyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2NvbnRyb2xzJykuY2xpY2sodG9nZ2xlRmlsZVNlbGVjdCksXG4gICAgICAgIGZpbGVDaGVja21hcmsgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19jaGVja21hcmsnKS5jbGljayh0b2dnbGVGaWxlU2VsZWN0KSxcbiAgICAgICAgZmlsZURlbGV0ZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2RlbGV0ZScpLmNsaWNrKGhhbmRsZURlbGV0ZUNsaWNrKSxcbiAgICAgICAgZmlsZVR5cGUgPSAkKCc8ZGl2PjxpIGNsYXNzPVwiZmEgZmEtY2FtZXJhXCI+PC9pPjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190eXBlJyksXG4gICAgICAgIGZpbGVFZGl0ID0gJCgnPGJ1dHRvbj5FZGl0PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbiBidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKS5jbGljayhoYW5kbGVGaWxlZEVkaXRCdXR0b25DbGljayksXG5cbiAgICAgICAgZmlsZVRpdGxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdGl0bGUgZmlsZV9fdGl0bGUtLW1lZGlhLWNhcmQnKS50ZXh0KGZpbGVEYXRhLnRpdGxlKSxcblxuICAgICAgICAvL2ZpbGVDYXB0aW9uID0gJCgnPHRleHRhcmVhPjwvdGV4dGFyZWE+JykuYWRkQ2xhc3MoJ2ZpbGVfX2NhcHRpb24gZmlsZV9fY2FwdGlvbl9tYWluJykudmFsKGZpbGVEYXRhLmNhcHRpb24pLFxuXG4gICAgICAgIGZpbGVQdXJwb3NlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fcHVycG9zZScpLFxuICAgICAgICBmaWxlUHVycG9zZVNlbGVjdCA9ICQoJzxkaXY+PC9kaXY+Jyk7XG5cbiAgICAgICAgZmlsZUVkaXRCdXR0b24gPSAkKCc8YnV0dG9uPkVkaXQ8L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uIGJ1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5IHUtdmlzaWJsZS14cyB1LW5vTWFyZ2luJykuY2xpY2soaGFuZGxlRmlsZWRFZGl0QnV0dG9uQ2xpY2spO1xuXG4gICAgZmlsZUNvbnRyb2xzLmFwcGVuZChmaWxlQ2hlY2ttYXJrLCBmaWxlRGVsZXRlLCBmaWxlVHlwZSwgZmlsZUVkaXQpO1xuICAgIGZpbGVJbWcuYXBwZW5kKGZpbGVDb250cm9scyk7XG5cbiAgICBmaWxlUHVycG9zZS5hcHBlbmQoZmlsZVB1cnBvc2VTZWxlY3QsIGZpbGVFZGl0QnV0dG9uKTtcbiAgICBwdXJwb3NlU2VsZWN0ID0gbmV3IFNlbGVjdGJveChmaWxlUHVycG9zZVNlbGVjdC5nZXQoMCksIHtcbiAgICAgICAgbGFiZWw6ICdVc2FnZScsXG4gICAgICAgIHBsYWNlaG9sZGVyOiAnU2VsZWN0IFVzYWdlJyxcbiAgICAgICAgaXRlbXM6IFsnUHJpbWFyeSBLZXkgYXJ0JywgJ1NlY29uZGFyeSBLZXkgYXJ0JywgJ0xvZ28nLCdCYWNrZ3JvdW5kJywgJ1RyYWlsZXInLCAnRnVsbCBFcGlzb2RlJywgJ1Byb21vJ10uc29ydCgpXG4gICAgfSk7XG5cbiAgICBmaWxlLmFwcGVuZChmaWxlSW5kZXgsIGZpbGVJbWcsIGZpbGVUaXRsZSwgZmlsZVB1cnBvc2UsIGZpbGVFZGl0QnV0dG9uKTtcblxuICAgIHJldHVybiBmaWxlO1xufVxuXG5mdW5jdGlvbiBhZGRGaWxlKGZpbGUpIHtcbiAgICB2YXIgZmlsZVNlY3Rpb24gPSAkKCcuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzJykuZ2V0KDApO1xuXG4gICAgJChmaWxlU2VjdGlvbikuYXBwZW5kKGZpbGUpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVHYWxsZXJ5KHNjcm9sbEluZGV4KSB7XG4gICAgc2luZ2xlc2VsZWN0ID0gZmFsc2U7XG4gICAgdmFyIGp1c3RVcGxvYWRlZCA9IGZhbHNlO1xuXG4gICAgLy8gUmVtZW1iZXIgcG9zaXRpb24gYW5kIHNlbGVjdGlvbiBvZiBmaWxlc1xuICAgICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgIHZhciBmaWxlID0gZ2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgIHJldHVybiBmLmZpbGVEYXRhLmlkID09PSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG4gICAgICAgIH0pWzBdO1xuICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgZmlsZS5wb3NpdGlvbiA9IGluZGV4O1xuICAgICAgICAgICAgZmlsZS5zZWxlY3RlZCA9ICQoZWwpLmhhc0NsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvL0NsZWFyIGZpbGVzIHNlY3Rpb25cbiAgICAkKCcuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzJykuZW1wdHkoKTtcblxuICAgIC8vU29ydCBhcnJheSBhY29yZGluZyBmaWxlcyBwb3NpdGlvblxuICAgIGdhbGxlcnlPYmplY3RzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gYS5wb3NpdGlvbiAtIGIucG9zaXRpb247XG4gICAgfSk7XG5cbiAgICAvL0NyZWF0ZSBmaWxlcyBmcm9tIGRhdGEgYW5kIGFkZCB0aGVtIHRvIHRoZSBwYWdlXG4gICAgZm9yICh2YXIgaSA9IDA7IGk8Z2FsbGVyeU9iamVjdHMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgIHZhciBmID0gZ2FsbGVyeU9iamVjdHNbaV0sXG4gICAgICAgICAgICBmaWxlID0gY3JlYXRlRmlsZUVsZW1lbnQoZik7XG5cbiAgICAgICAgaWYgKGYuc2VsZWN0ZWQpIHtmaWxlLmFkZENsYXNzKCdzZWxlY3RlZCcpO31cbiAgICAgICAgaWYgKGYuanVzdFVwbG9hZGVkKSB7XG4gICAgICAgICAgICBmaWxlLmFkZENsYXNzKCdqdXN0VXBsb2FkZWQnKTtcbiAgICAgICAgICAgIGYuanVzdFVwbG9hZGVkID0gZmFsc2U7XG4gICAgICAgICAgICBqdXN0VXBsb2FkZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGFkZEZpbGUoZmlsZSk7XG4gICAgfVxuXG4gICAgbm9ybWFsaXplU2VsZWN0ZWlvbigpO1xuICAgIG5vcm1hbGl6ZUluZGV4KCk7XG5cbiAgICAvKmlmIChqdXN0VXBsb2FkZWQpIHtcbiAgICAgICAgZWRpdEZpbGVzKCQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5qdXN0VXBsb2FkZWQnKSk7XG4gICAgfSovXG4gICAgaWYgKHNjcm9sbEluZGV4KSB7XG4gICAgICAgIHZhciBzY3JvbGxUb3AgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUnKS5sYXN0KCkub2Zmc2V0KCkudG9wO1xuICAgICAgICAkKCdib2R5JykuYW5pbWF0ZSh7XG4gICAgICAgICAgICBzY3JvbGxUb3A6IHNjcm9sbFRvcFxuICAgICAgICB9LCA0MDApO1xuICAgIH1cbn1cblxuLy9CbHVyYiBzZWN0aW9uIGluaXRpYWxpemVyXG4vLyBEYXRhXG52YXIgcG9zdEl0ZW1zID0gW1xuICB7XG4gICAgdHlwZTogJ3RpdGxlJyxcbiAgICB0aXRsZTogJ0hlYWRpbmcnLFxuICAgIGljb25DbGFzczogJ2ZhIGZhLWhlYWRlcidcbiAgfSxcbiAge1xuICAgIHR5cGU6ICd0ZXh0JyxcbiAgICB0aXRsZTogJ1BhcmFncmFwaCcsXG4gICAgaWNvbkNsYXNzOiAnZmEgZmEtcGFyYWdyYXBoJ1xuICB9LFxuICB7XG4gICAgdHlwZTogJ2xpbmsnLFxuICAgIHRpdGxlOiAnRW1iZWRlZCBMaW5rJyxcbiAgICBpY29uQ2xhc3M6ICdmYSBmYS1jb2RlJ1xuICB9LFxuICB7XG4gICAgdHlwZTogJ2ZpbGUnLFxuICAgIHRpdGxlOiAnTWVkaWEgRmlsZScsXG4gICAgaWNvbkNsYXNzOiAnZmEgZmEtcGljdHVyZS1vJ1xuICB9LFxuICB7XG4gICAgdHlwZTogJ2JsdXJiJyxcbiAgICB0aXRsZTogJ0JsdXJiJyxcbiAgICBpY29uQ2xhc3M6ICdmYSBmYS1saXN0LWFsdCdcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdzb3VyY2UnLFxuICAgIHRpdGxlOiAnU291cmNlJyxcbiAgICBpY29uQ2xhc3M6ICdmYSBmYS1jb3B5cmlnaHQnXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAndXNlcicsXG4gICAgdGl0bGU6ICdQZXJzb24nLFxuICAgIGljb25DbGFzczogJ2ZhIGZhLXVzZXInXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAncXVvdGUnLFxuICAgIHRpdGxlOiAnUXVvdGUnLFxuICAgIGljb25DbGFzczogJ2ZhIGZhLXF1b3RlLXJpZ2h0J1xuICB9LFxuICB7XG4gICAgdHlwZTogJ3RhYmxlJyxcbiAgICB0aXRsZTogJ1RhYmxlJyxcbiAgICBpY29uQ2xhc3M6ICdmYSBmYS10YWJsZSdcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdtYXAnLFxuICAgIHRpdGxlOiAnTWFwJyxcbiAgICBpY29uQ2xhc3M6ICdmYSBmYS1tYXAtbWFya2VyJ1xuICB9LFxuICB7XG4gICAgdHlwZTogJ2dhbGxlcnknLFxuICAgIHRpdGxlOiAnR2FsbGVyeScsXG4gICAgaWNvbkNsYXNzOiAnZmEgZmEtY2xvbmUnXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnbGlzdCcsXG4gICAgdGl0bGU6ICdMaXN0JyxcbiAgICBpY29uQ2xhc3M6ICdmYSBmYS1saXN0J1xuICB9LFxuICB7XG4gICAgdHlwZTogJ25ld3MnLFxuICAgIHRpdGxlOiAnTmV3c2ZlZWQnLFxuICAgIGljb25DbGFzczogJ2ZhIGZhLW5ld3NwYXBlci1vJ1xuICB9LFxuICB7XG4gICAgdHlwZTogJ2dyYXBoJyxcbiAgICB0aXRsZTogJ0NoYXJ0JyxcbiAgICBpY29uQ2xhc3M6ICdmYSBmYS1waWUtY2hhcnQnXG4gIH1cbl1cblxuLy9Gb3IgcmVuZGVyIGJsdXJiXG5mdW5jdGlvbiBpbml0UG9zdExpc3QoZWwpIHtcbiAgZWwuYXBwZW5kKHJlbmRlclBvc3RMaXN0KCkpO1xuXG4gIGVsLmZpbmQoJ3RleHRhcmVhJykuZWxhc3RpYygpO1xuICBub3JtaWxpemVTZWN0aW9uKCk7XG59XG5cbi8vUmVuZGVyXG5mdW5jdGlvbiByZW5kZXJQb3N0TGlzdCgpIHtcbiAgdmFyIGxpc3QgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3NlY3Rpb25zLWxpc3QnKSxcbiAgYWRkSWNvbiA9ICQoJzxpIGNsYXNzPVwiZmEgZmEtcGx1cy1jaXJjbGVcIiAvPicpLFxuICBhZGRUZXh0ID0gJCgnPHNwYW4+IEFkZCBTZWN0aW9uPC9zcGFuPicpLFxuICBhZGRTZWN0aW9uID0gJCgnPGJ1dHRvbiAvPicpLmFkZENsYXNzKCdidXR0b24gYnV0dG9uX3N0eWxlX3RyYW5zcGFyZW50LWdyYXkgc2VjdGlvbnMtbGlzdF9fYWRkLXNlY3Rpb24nKS5jbGljayhoYW5kbGVBZGRTZWN0aW9uKS5hcHBlbmQoYWRkSWNvbiwgYWRkVGV4dCksXG4gIHNlY3Rpb24gPSByZW5kZXJTZWN0aW9uKDEpXG5cbiAgbGlzdC5zb3J0YWJsZSh7XG4gICAgaXRlbXM6ICcubGlzdF9fc2VjdGlvbicsXG4gICAgcGxhY2Vob2xkZXI6ICdsaXN0X19wbGFjZWhvbGRlcicsXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKGUsIHVpKSB7XG4gICAgICB1aS5pdGVtLmFkZENsYXNzKCdpcy1kcmFnZ2luZycpO1xuICAgICAgJChlLnRhcmdldCkuY3NzKCdoZWlnaHQnLCAkKGUudGFyZ2V0KS5oZWlnaHQoKSk7XG4gICAgICAkKCdib2R5JykuY3NzKCdoZWlnaHQnLCAkKCdib2R5JykuaGVpZ2h0KCkpO1xuICAgIH0sXG4gICAgc3RvcDogZnVuY3Rpb24oZSwgdWkpIHtcbiAgICAgIHVpLml0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLWRyYWdnaW5nJyk7XG4gICAgICAkKGUudGFyZ2V0KS5jc3MoJ2hlaWdodCcsICcnKTtcbiAgICAgICQoJ2JvZHknKS5jc3MoJ2hlaWdodCcsICcnKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBsaXN0LmFwcGVuZChzZWN0aW9uLCBhZGRTZWN0aW9uKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyU2VjdGlvbihpbmRleCwgZGF0YSkge1xuICB2YXIgc2VjdGlvbiA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnbGlzdF9fc2VjdGlvbicpLFxuICBzZWN0aW9uSW5kZXggPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3NlY3Rpb25fX2luZGV4JykudGV4dCgnQmx1cmIgJyArIGluZGV4KSxcbiAgc2VjdGlvblJlbW92ZSA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnc2VjdGlvbl9fcmVtb3ZlIGlzLWhpZGRlbicpLmNsaWNrKGhhbmRsZVJlbW92ZVNlY3Rpb24pLFxuICBzZWN0aW9uSGFuZGxlciA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnc2VjdGlvbl9faGFuZGxlcicpO1xuXG4gIHJldHVybiBzZWN0aW9uLmFwcGVuZChzZWN0aW9uSGFuZGxlciwgc2VjdGlvbkluZGV4LCBzZWN0aW9uUmVtb3ZlLCByZW5kZXJTZWN0aW9uQ29udGVudChpbmRleCwgZGF0YSkpXG59XG5cbmZ1bmN0aW9uIHJlbmRlclNlY3Rpb25Db250ZW50KGluZGV4LCBkYXRhKSB7XG4gIHZhciBjb250ZW50ID0gJCgnPGRpdiAvPicpLmFkZENsYXNzKCdzZWN0aW9uX19jb250ZW50JyksXG4gIHRpdGxlID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgLz4nKSxcbiAgZGVzY3JpcHRpb24gPSAkKCc8dGV4dGFyZWEgLz4nKSxcbiAgdG9nZ2xlTGFiZWwgPSAkKCc8bGFiZWw+TWVkaWEgVHlwZTwvbGFiZWw+JykuYWRkQ2xhc3MoJ2MtbGFiZWwgYy1sYWJlbC0tdG9wJyksXG4gIHRvZ2dsZUl0ZW0xID0gJCgnPGxpIGRhdGEtdGFyZ2V0PVwibGlua1wiIGRhdGEtaW5kZXg9XCInKyBpbmRleCsgJ1wiPkVtYmVkZWQgTGluazwvbGk+JykuYWRkQ2xhc3MoJ2FjdGl2ZScpLmNsaWNrKGhhbmRsZUFzc2V0VG9nZ2xlKSxcbiAgdG9nZ2xlSXRlbTIgPSAkKCc8bGkgZGF0YS10YXJnZXQ9XCJmaWxlXCIgZGF0YS1pbmRleD1cIicrIGluZGV4KyAnXCI+QWRkIC8gVXBsb2FkPC9saT4nKS5jbGljayhoYW5kbGVBc3NldFRvZ2dsZSlcbiAgdG9nZ2xlR3JvdXAgPSAkKCc8dWwgZGF0YS1zZWN0aW9uPScgKyBpbmRleCArICc+PC91bD4nKS5hZGRDbGFzcygncmFkaW9Ub2dnbGUnKS5hcHBlbmQodG9nZ2xlSXRlbTEsIHRvZ2dsZUl0ZW0yKSxcbiAgbGluayA9ICQoJzxpbnB1dCB0eXBlPVwidGV4dFwiLz4nKSxcbiAgcGxhY2Vob2xkZXIgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3NlY3Rpb25fX3BsYWNlaG9sZGVyJykuYXR0cignZGF0YS1uYW1lJywgJ0ZpbGUnKTtcblxuICBjb250ZW50LmFwcGVuZCh0aXRsZS53cmFwKCc8ZGl2IGNsYXNzPVwiY29udHJvbHNfX2dyb3VwXCI+PC9kaXY+JykucGFyZW50KCksIGRlc2NyaXB0aW9uLndyYXAoJzxkaXYgY2xhc3M9XCJjb250cm9sc19fZ3JvdXBcIj48L2Rpdj4nKS5wYXJlbnQoKSwgdG9nZ2xlTGFiZWwud3JhcCgnPGRpdiBjbGFzcz1cImNvbnRyb2xzX19ncm91cCBjb250cm9sc19fZ3JvdXAtLWFzc2V0LXRvZ2dsZVwiPjwvZGl2PicpLnBhcmVudCgpLmFwcGVuZCh0b2dnbGVHcm91cCksIGxpbmsud3JhcCgnPGRpdiBjbGFzcz1cImNvbnRyb2xzX19ncm91cFwiICBpZD1cInNlY3Rpb25MaW5rJyArIGluZGV4ICsgJ1wiPjwvZGl2PicpLnBhcmVudCgpLCBwbGFjZWhvbGRlci53cmFwKCc8ZGl2IGNsYXNzPVwiY29udHJvbHNfX2dyb3VwIGNvbnRyb2xzX19ncm91cC0tcGxhY2Vob2xkZXIgaGlkZGVuXCIgaWQ9XCJzZWN0aW9uUGxhY2Vob2xkZXInICsgaW5kZXggKyAnXCI+PC9kaXY+JykucGFyZW50KCkpO1xuXG4gIHZhciBzZXRpb25UaXRsZUlucHV0ID0gbmV3IFRleHRmaWVsZCh0aXRsZS5nZXQoMCksIHtcbiAgICBsYWJlbDogJ0JsdXJiIFRpdGxlJ1xuICB9KTtcbiAgdmFyIHNldGlvbkRlc2NyaXB0aW9uSW5wdXQgPSBuZXcgVGV4dGZpZWxkKGRlc2NyaXB0aW9uLmdldCgwKSwge1xuICAgIGxhYmVsOiAnQmx1cmIgVGV4dCdcbiAgfSk7XG4gIGRlc2NyaXB0aW9uLmVsYXN0aWMoKTtcblxuICB2YXIgc2V0aW9uTGlua0lucHV0ID0gbmV3IFRleHRmaWVsZChsaW5rLmdldCgwKSwge1xuICAgIGxhYmVsOiAnRW1iZWRlZCBMaW5rJyxcbiAgICBwbGFjZWhvbGRlcjogJ2h0dHA6Ly8nXG4gIH0pO1xuXG4gIHBsYWNlaG9sZGVyQ29udHJvbCA9IG5ldyBJbWFnZVBsYWNlaG9sZGVyKHBsYWNlaG9sZGVyLmdldCgwKSwgbnVsbCwge2FsQnV0dG9uOiAnQWRkIEZpbGUnfSlcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuXG4vL0hhbmRsZXJcbmZ1bmN0aW9uIGhhbmRsZUFkZFNlY3Rpb24oZSkge1xuICB2YXIgaW5kZXggPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuc2VjdGlvbnMtbGlzdCcpLmZpbmQoJy5saXN0X19zZWN0aW9uJykubGVuZ3RoICsgMTtcbiAgdmFyIHNlY3Rpb24gPSByZW5kZXJTZWN0aW9uKGluZGV4KTtcbiAgJChlLnRhcmdldCkuYmVmb3JlKHNlY3Rpb24pO1xuICBzZWN0aW9uLmZpbmQoJ3RleHRhcmVhJykuZWxhc3RpYygpO1xuICBub3JtaWxpemVTZWN0aW9uKCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJlbW92ZVNlY3Rpb24oZSkge1xuICAkKGUudGFyZ2V0KS5wYXJlbnQoJy5saXN0X19zZWN0aW9uJykucmVtb3ZlKCk7XG4gIG5vcm1pbGl6ZVNlY3Rpb24oKTtcbn1cbmZ1bmN0aW9uIG5vcm1pbGl6ZVNlY3Rpb24oKSB7XG4gIHZhciBsZW5ndGggPSAkKCcubGlzdF9fc2VjdGlvbicpLmxlbmd0aDtcbiAgaWYgKGxlbmd0aCA+PSAyKSB7XG4gICAgJCgnLnNlY3Rpb25fX3JlbW92ZScpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKVxuICB9IGVsc2Uge1xuICAgICQoJy5zZWN0aW9uX19yZW1vdmUnKS5hZGRDbGFzcygnaXMtaGlkZGVuJylcbiAgfVxuICAkKCcubGlzdF9fc2VjdGlvbicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgJChlbCkuZmluZCgnLnNlY3Rpb25fX2luZGV4JykudGV4dCgnQmx1cmIgJyArIE1hdGgucm91bmQoaW5kZXggKyAxKSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gaGFuZGxlQXNzZXRUb2dnbGUoZSkge1xuICAkKGUudGFyZ2V0KS5wYXJlbnQoKS5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICBzd2l0Y2ggKGUudGFyZ2V0LmRhdGFzZXQudGFyZ2V0KSB7XG4gICAgY2FzZSAnbGluayc6XG4gICAgJCgnI3NlY3Rpb25MaW5rJysgZS50YXJnZXQuZGF0YXNldC5pbmRleCkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICQoJyNzZWN0aW9uUGxhY2Vob2xkZXInKyBlLnRhcmdldC5kYXRhc2V0LmluZGV4KS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgYnJlYWs7XG5cbiAgICBjYXNlICdmaWxlJzpcbiAgICAkKCcjc2VjdGlvbkxpbmsnKyBlLnRhcmdldC5kYXRhc2V0LmluZGV4KS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgJCgnI3NlY3Rpb25QbGFjZWhvbGRlcicrIGUudGFyZ2V0LmRhdGFzZXQuaW5kZXgpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICBicmVhaztcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0QmxvZ1NlY3Rpb24oc2VjdGlvbikge1xuICB2YXIgdGh1bWJuYWlscyA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygncG9zdC1pdGVtLXRodW1ibmFpbHMnKSxcbiAgICAgIG1vcmVUaHVtYm5haWwgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3Bvc3QtaXRlbS10aHVtYiBwb3N0LWl0ZW0tdGh1bWItLXBvc3QtY2FyZCcpLmNsaWNrKGZ1bmN0aW9uKCkge2NyZWF0ZU5ld0l0ZW1PdmVybGF5KHRodW1ibmFpbHMpO30pLFxuICAgICAgbW9yZUljb24gPSAkKCc8aSAvPicpLmFkZENsYXNzKCdwb3N0LWl0ZW0tdGh1bWJfX2ljb24gZmEgZmEtZWxsaXBzaXMtaCcpLFxuICAgICAgbW9yZVRpdGxlID0gJCgnPGRpdiAvPicpLmFkZENsYXNzKCdwb3N0LWl0ZW0tdGh1bWJfX3RpdGxlJykudGV4dCgnbW9yZScpLFxuICAgICAgaXRlbXMgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3Bvc3QtaXRlbXMnKS5hdHRyKCdpZCcsICdwb3N0SXRlbXMnKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICB0aHVtYm5haWxzLmFwcGVuZChyZW5kZXJQb3N0SXRlbVRodW1ibmFpbChwb3N0SXRlbXNbaV0sIHRodW1ibmFpbHMpLmFkZENsYXNzKCdwb3N0LWl0ZW0tdGh1bWItLXBvc3QtY2FyZCcpLnJlbW92ZUNsYXNzKCdwb3N0LWl0ZW0tdGh1bWItLW92ZXJsYXknKSk7XG4gIH1cblxuICB0aHVtYm5haWxzLmFwcGVuZChtb3JlVGh1bWJuYWlsLmFwcGVuZChtb3JlSWNvbiwgbW9yZVRpdGxlKSk7XG4gIHNlY3Rpb24uYXBwZW5kKGl0ZW1zLCB0aHVtYm5haWxzKTtcbiAgaXRlbXMuc29ydGFibGUoe1xuICAgIGl0ZW1zOiAnLnBvc3QtaXRlbV9fd3JhcHBlcicsXG4gICAgcGxhY2Vob2xkZXI6ICdwb3N0LWl0ZW1fX3BsYWNlaG9sZGVyJyxcbiAgICBmb3JjZVBsYWNlaG9sZGVyU2l6ZTogdHJ1ZSxcbiAgICBoYW5kbGU6ICcucG9zdC1pdGVtX190aXRsZScsXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKGUsIHVpKSB7XG4gICAgICB1aS5pdGVtLmFkZENsYXNzKCdpcy1kcmFnZ2luZycpLnJlbW92ZUNsYXNzKCdpcy1kcm9wcGVkJyk7XG4gICAgICAkKGUudGFyZ2V0KS5jc3MoJ2hlaWdodCcsICQoZS50YXJnZXQpLmhlaWdodCgpKTtcbiAgICAgICQoJ2JvZHknKS5jc3MoJ2hlaWdodCcsICQoJ2JvZHknKS5oZWlnaHQoKSk7XG4gICAgICAkKCcucG9zdC1pdGVtX193cmFwcGVyJykuYWRkQ2xhc3MoJ2luLWRyYWdnaW5nLW1vZGUnKTtcbiAgICB9LFxuICAgIHN0b3A6IGZ1bmN0aW9uKGUsIHVpKSB7XG4gICAgICB1aS5pdGVtLnJlbW92ZUNsYXNzKCdpcy1kcmFnZ2luZycpLmFkZENsYXNzKCdpcy1kcm9wcGVkJyk7XG4gICAgICAkKGUudGFyZ2V0KS5jc3MoJ2hlaWdodCcsICcnKTtcbiAgICAgICQoJ2JvZHknKS5jc3MoJ2hlaWdodCcsICcnKTtcbiAgICAgICQoJy5wb3N0LWl0ZW1fX3dyYXBwZXInKS5yZW1vdmVDbGFzcygnaW4tZHJhZ2dpbmctbW9kZScpO1xuICAgIH1cbiAgfSlcbiAgJCgnI2NyZWF0ZU5ld1RlbXBsYXRlJykuY2xpY2soY3JlYXRlTmV3VGVtcGxhdGVPdmVybGF5KTtcbn1cblxuLy9cbi8vIFJlbmRlcnNcbi8vXG5mdW5jdGlvbiByZW5kZXJQb3N0SXRlbShpdGVtKSB7XG4gIHZhciBpdGVtV3JhcHBlciA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygncG9zdC1pdGVtX193cmFwcGVyJykuYXR0cignZGF0YS10eXBlJywgaXRlbS50eXBlKSxcbiAgICAgIHRpdGxlID0gJCgnPGRpdiAvPicpLmFkZENsYXNzKCdwb3N0LWl0ZW1fX3RpdGxlJykuYXBwZW5kKCQoJzxpIC8+JykuYWRkQ2xhc3MoaXRlbS5pY29uQ2xhc3MpLCAkKCc8c3BhbiAvPicpLnRleHQoJyAnICsgaXRlbS50aXRsZSkpLFxuICAgICAgcmVtb3ZlID0gJCgnPGRpdiAvPicpLmFkZENsYXNzKCdwb3N0LWl0ZW1fX3JlbW92ZScpLmNsaWNrKGhhbmRsZVJlbW92ZUl0ZW0pLFxuICAgICAgYWRkTmV3ID0gJCgnPGRpdiAvPicpLmFkZENsYXNzKCdwb3N0LWl0ZW1fX2FkZC1uZXcnKS5hcHBlbmQoJCgnPGkgLz4nKS5hZGRDbGFzcygnZmEgZmEtZWxsaXBzaXMtaCcpKS5jbGljayhoYW5kbGVBZGROZXdDbGljayksXG4gICAgICBpdGVtRWwgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3Bvc3QtaXRlbScpO1xuXG4gIHJldHVybiBpdGVtV3JhcHBlci5hcHBlbmQoaXRlbUVsLmFwcGVuZCh0aXRsZSwgcmVtb3ZlLCByZW5kZXJQb3N0SXRlbUNvbnRlbnQoaXRlbS50eXBlKSksIGFkZE5ldyk7XG59XG5mdW5jdGlvbiByZW5kZXJQb3N0SXRlbUNvbnRlbnQodHlwZSkge1xuICB2YXIgY29udGVudCA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygncG9zdC1pdGVtX19jb250ZW50Jyk7XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc291cmNlJzpcbiAgICAgIHZhciBncm91cCA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2xzIGNnX19jb250cm9sc19zdHlsZV9yb3cnKSxcbiAgICAgICAgICBsYWJlbCA9ICQoJzxpbnB1dCB0eXBlPVwidGV4dFwiIC8+JykudmFsKCdTb3VyY2UnKSxcbiAgICAgICAgICBsaW5rID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgLz4nKTtcbiAgICAgIGNvbnRlbnQuYXBwZW5kKGdyb3VwLmFwcGVuZChsYWJlbC53cmFwKCc8ZGl2IGNsYXNzPVwiY2dfX2NvbnRyb2wgY2dfX2NvbnRyb2xfc3R5bGVfcm93XCI+PC9kaXY+JykucGFyZW50KCksIGxpbmsud3JhcCgnPGRpdiBjbGFzcz1cImNnX19jb250cm9sIGNnX19jb250cm9sX3N0eWxlX3Jvd1wiPjwvZGl2PicpLnBhcmVudCgpKSk7XG4gICAgICBuZXcgVGV4dGZpZWxkKGxhYmVsLmdldCgwKSwge2xhYmVsOiAnTGFiZWwnfSk7XG4gICAgICBuZXcgVGV4dGZpZWxkKGxpbmsuZ2V0KDApLCB7bGFiZWw6ICdMaW5rJywgcGxhY2Vob2xkZXI6ICdleGFtcGxlLmNvbS9zb3VyY2UtcGF0aCd9KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnYmx1cmInOlxuICAgICAgY29udGVudC5hZGRDbGFzcygncG9zdC1pdGVtX19jb250ZW50LS1ibHVyYicpLmFwcGVuZChyZW5kZXJTZWN0aW9uQ29udGVudChEYXRlLm5vdygpKS5jaGlsZHJlbigpKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAndGl0bGUnOlxuICAgICAgdmFyIGhlYWRpbmcgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3Bvc3QtY29udGVudF9faGVhZGluZycpO1xuICAgICAgY29udGVudC5hZGRDbGFzcygncG9zdC1pdGVtX19jb250ZW50LS1saW5rJykuYXBwZW5kKGhlYWRpbmcpO1xuICAgICAgaGVhZGluZ0VkaXRvciA9IG5ldyBNZWRpdW1FZGl0b3IoaGVhZGluZy5nZXQoMCksIHtcbiAgICAgICAgdG9vbGJhcjogZmFsc2UsXG4gICAgICAgIGRpc2FibGVSZXR1cm46IHRydWUsXG4gICAgICAgIHBsYWNlaG9sZGVyOiB7XG4gICAgICAgICAgdGV4dDogJ1R5cGUgaGVhZGluZyBoZXJlJ1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGhlYWRpbmdFZGl0b3Iuc3Vic2NyaWJlKCdlZGl0YWJsZUlucHV0JywgZnVuY3Rpb24oZXZlbnQsIGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuaW5uZXJIVE1MICE9PSAnJykge2hlYWRpbmcuYWRkQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7fVxuICAgICAgICBlbHNlIHtoZWFkaW5nLnJlbW92ZUNsYXNzKCdqcy1oYXNWYWx1ZScpO31cbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdsaW5rJzpcbiAgICAgIHZhciBsaW5rRmllbGQgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3Bvc3QtY29udGVudF9fdGV4dGFyZWEgcG9zdC1jb250ZW50X19saW5rJyksXG4gICAgICAgICAgbGlua1ByZXZpZXcgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3Bvc3QtY29udGVudF9fcHJldmlldycpO1xuICAgICAgY29udGVudC5hZGRDbGFzcygncG9zdC1pdGVtX19jb250ZW50LS1saW5rJykuYXBwZW5kKGxpbmtGaWVsZCwgbGlua1ByZXZpZXcpO1xuICAgICAgZWRpdG9yID0gbmV3IE1lZGl1bUVkaXRvcihsaW5rRmllbGQuZ2V0KDApLCB7XG4gICAgICAgIHRvb2xiYXI6IGZhbHNlLFxuICAgICAgICBwbGFjZWhvbGRlcjoge1xuICAgICAgICAgIHRleHQ6ICdUeXBlIHlvdXIgZW1iZWRlZCBsaW5rIGhlcmUnXG4gICAgICAgIH0sXG4gICAgICAgIHBhc3RlOiB7XG4gICAgICAgICAgZm9yY2VQbGFpblRleHQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy9FbWJlZGVkIGxpbmsgcHJldmlld1xuICAgICAgZWRpdG9yLnN1YnNjcmliZSgnZWRpdGFibGVJbnB1dCcsIGZ1bmN0aW9uKGV2ZW50LCBlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50LmlubmVySFRNTC5pbmNsdWRlcygnaWZyYW1lJykgfHwgZWxlbWVudC5pbm5lckhUTUwuaW5jbHVkZXMoJ2Jsb2NrcXVvdGUnKSkge1xuICAgICAgICAgIHJlZ0V4cDEgPSAvXFwmbHQ7L2c7XG4gICAgICAgICAgcmVnRXhwMiA9IC9cXCZndDsvZztcbiAgICAgICAgICBpbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTC5yZXBsYWNlKHJlZ0V4cDEsICc8JykucmVwbGFjZShyZWdFeHAyLCAnPicpO1xuICAgICAgICAgIGlmICghaW5uZXJIVE1MLmluY2x1ZGVzKCdpZnJhbWUnKSkge2lubmVySFRNTCA9ICc8aWZyYW1lPicgKyBpbm5lckhUTUwgKyAnPC9pZnJhbWU+Jzt9XG5cbiAgICAgICAgICBsaW5rUHJldmlldy5odG1sKGlubmVySFRNTCk7XG4gICAgICAgICAgbGlua1ByZXZpZXcuYWRkQ2xhc3MoJ2hhcy1wcmV2aWV3IGpzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgbGlua0ZpZWxkLmFkZENsYXNzKCdoYXMtcHJldmlldycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpbmtQcmV2aWV3Lmh0bWwoJycpLnJlbW92ZUNsYXNzKCdoYXMtcHJldmlldyAganMtaGFzVmFsdWUnKTtcbiAgICAgICAgICBsaW5rRmllbGQucmVtb3ZlQ2xhc3MoJ2hhcy1wcmV2aWV3Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgdmFyIHBsYWNlaG9sZGVyID0gJCgnPGRpdiAvPicpLFxuICAgICAgICAgIGNoZWNrYm94R3JvdXAgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ2NvbnRyb2xzX19ncm91cCBjb250cm9sc19fZ3JvdXAtLXRvZ2dsZSBpcy1kaXNhYmxlZCcpLmNzcygnd2lkdGgnLCAnYXV0bycpLFxuICAgICAgICAgIGNoZWNrYm94SWQgPSAnY2hlY2tib3gtJyArIERhdGUubm93KCksXG4gICAgICAgICAgY2hlY2tib3ggPSAkKCc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgLz4nKS5hZGRDbGFzcygndG9nZ2xlJykuYXR0cignaWQnLCBjaGVja2JveElkKSxcbiAgICAgICAgICBjaGVja2JveExhYmVsID0gJCgnPGxhYmVsIGZvcj1cIicgKyBjaGVja2JveElkICsgJ1wiIC8+JykudGV4dCgnQXV0b3BsYXknKTtcbiAgICAgIGNvbnRlbnQuYWRkQ2xhc3MoJ3Bvc3QtaXRlbV9fY29udGVudC0tZmlsZScpLmFwcGVuZChwbGFjZWhvbGRlciwgY2hlY2tib3hHcm91cC5hcHBlbmQoY2hlY2tib3gsIGNoZWNrYm94TGFiZWwpKTtcbiAgICAgIG5ldyBJbWFnZVBsYWNlaG9sZGVyKHBsYWNlaG9sZGVyLmdldCgwKSwgbnVsbCwge1xuICAgICAgICBhbEJ1dHRvbjogJ0FkZCBGaWxlJyxcbiAgICAgICAgb25VcGRhdGU6IGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICBpZiAocC50eXBlID09PSAndmlkZW8nKSB7Y2hlY2tib3hHcm91cC5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTt9XG4gICAgICAgICAgZWxzZSB7Y2hlY2tib3hHcm91cC5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTt9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICd0ZXh0JzpcbiAgICAgIHZhciB0ZXh0ID0gJCgnPGRpdiAvPicpLmFkZENsYXNzKCdwb3N0LWNvbnRlbnRfX3RleHRhcmVhJyk7XG4gICAgICBjb250ZW50LmFkZENsYXNzKCdwb3N0LWl0ZW1fX2NvbnRlbnQtLXRleHQnKS5hcHBlbmQodGV4dCk7XG4gICAgICB0ZXh0RWRpdG9yID0gbmV3IE1lZGl1bUVkaXRvcih0ZXh0LmdldCgwKSwge1xuICAgICAgICBkaXNhYmxlUmV0dXJuOiB0cnVlLFxuICAgICAgICBidXR0b25MYWJlbHM6ICdmb250YXdlc29tZScsXG4gICAgICAgIHRvb2xiYXI6IHtcbiAgICAgICAgICBidXR0b25zOiBbJ2JvbGQnLCAnaXRhbGljJywgJ2FuY2hvciddXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGV4dEVkaXRvci5zdWJzY3JpYmUoJ2VkaXRhYmxlSW5wdXQnLCBmdW5jdGlvbihldmVudCwgZWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudC5pbm5lckhUTUwgIT09ICcnKSB7aGVhZGluZy5hZGRDbGFzcygnanMtaGFzVmFsdWUnKTt9XG4gICAgICAgIGVsc2Uge2hlYWRpbmcucmVtb3ZlQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7fVxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cbmZ1bmN0aW9uIHJlbmRlclRlbXBsYXRlKHRlbXBsYXRlLCB0YXJnZXQpIHtcbiAgdmFyIHRlbXBsYXRlV3JhcHBlciA9ICQoJzxkaXYgLz4nKTtcbiAgdGVtcGxhdGUuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgdGVtcGxhdGVXcmFwcGVyLmFwcGVuZChyZW5kZXJQb3N0SXRlbShpdGVtKSk7XG4gIH0pXG4gIHJldHVybiB0ZW1wbGF0ZVdyYXBwZXIuY2hpbGRyZW4oKTtcbn1cbi8vXG4vLyBIYW5kbGVyc1xuLy9cbmZ1bmN0aW9uIGhhbmRsZUFkZE5ld0NsaWNrKGUpIHtcbiAgdmFyIHRhcmdldCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5wb3N0LWl0ZW1fX3dyYXBwZXIsIC5wb3N0LWl0ZW0tdGh1bWJuYWlscycpO1xuICBjcmVhdGVOZXdJdGVtT3ZlcmxheSh0YXJnZXQpO1xufVxuZnVuY3Rpb24gaGFuZGxlUmVtb3ZlSXRlbShlKSB7XG4gIHZhciBpdGVtID0gJChlLnRhcmdldCkucGFyZW50cygnLnBvc3QtaXRlbV9fd3JhcHBlcicpO1xuICBpZiAoaXRlbS5maW5kKCcuanMtaGFzVmFsdWUnKS5sZW5ndGggPiAwKSB7XG4gICAgbmV3IE1vZGFsKHtcbiAgICAgIGRpYWxvZzogdHJ1ZSxcbiAgICAgIHRpdGxlOiAnUmVtb3ZlIEl0ZW0/JyxcbiAgICAgIHRleHQ6ICdBbGwgaXRlbSBkYXRhIHdpbGwgYmUgbG9zdC4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbW92ZSB0aGlzIGl0ZW0/JyxcbiAgICAgIGNvbmZpcm1UZXh0OiAnUmVtb3ZlJyxcbiAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICBpdGVtLnJlbW92ZSgpO1xuICAgICAgICBjaGVja0l0ZW1zKCk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBlbHNlIHtcbiAgICBpdGVtLnJlbW92ZSgpO1xuICAgIGNoZWNrSXRlbXMoKTtcbiAgfVxufVxuXG4vL1xuLy8gSGVscGVyc1xuLy9cbi8vQ2hlY2sgaWYgdGhlcmUgYXJlIGEgaXRlbXMgb24gYSBibG9nIHBhZ2UgYW5kIGNoYW5nZSB1aSBhY2NvcmRpbmdseVxuZnVuY3Rpb24gY2hlY2tJdGVtcygpIHtcbiAgaWYgKCQoJyNwb3N0SXRlbXMgLnBvc3QtaXRlbV9fd3JhcHBlcicpLmxlbmd0aCA+IDApIHtcbiAgICAkKCcjY3JlYXRlTmV3VGVtcGxhdGUnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgfSBlbHNlIHtcbiAgICAkKCcjY3JlYXRlTmV3VGVtcGxhdGUnKS5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICB9XG59XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEFERCBJVEVNUyBPVkVSTEFZIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuZnVuY3Rpb24gY3JlYXRlTmV3SXRlbU92ZXJsYXkodGFyZ2V0KSB7XG4gIHZhciBzY3JvbGxQb3NpdGlvbiA9ICQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcbiAgICAgIG92ZXJsYXkgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ21vZGFsIG1vZGFsLS1mdWxsJykuYXR0cignaWQnLCAnbmV3SXRlbU92ZXJsYXknKSxcbiAgICAgIGNsb3NlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX2Nsb3NlJykuY2xpY2soZnVuY3Rpb24oKSB7bmV3T3ZlcmxheUNsb3NlKG92ZXJsYXksIHNjcm9sbFBvc2l0aW9uKX0pLFxuICAgICAgdGh1bWJuYWlscyA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygncG9zdC1pdGVtLXRodW1icycpLFxuXG4gICAgICBzZWN0aW9uRGF0YSA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdpdGVtcycsXG4gICAgICAgICAgaXRlbXM6IHBvc3RJdGVtc1xuICAgICAgICB9XG4gICAgICBdO1xuICBpZiAoZ2V0VGVtcGxhdGVzKCkpIHtcbiAgICBzZWN0aW9uRGF0YS5wdXNoKHtcbiAgICAgIHR5cGU6ICd0ZW1wbGF0ZXMnLFxuICAgICAgdGl0bGU6ICdUZW1wbGF0ZXMnLFxuICAgICAgaXRlbXM6IGdldFRlbXBsYXRlcygpXG4gICAgfSlcbiAgfVxuXG4gIHNlY3Rpb25EYXRhLmZvckVhY2goZnVuY3Rpb24oc2VjdGlvbikge1xuICAgIHRodW1ibmFpbHMuYXBwZW5kKHJlbmRlclBvc3RJdGVtVGh1bWJuYWlsU2VjdGlvbihzZWN0aW9uLCB0YXJnZXQpKVxuICB9KTtcblxuICAkKGRvY3VtZW50KS5vbigna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtwb3N0RG9jdW1lbnRLZXlkb3duKGUsIG92ZXJsYXksIHNjcm9sbFBvc2l0aW9uKTt9KTtcbiAgJCgnYm9keScpLmFwcGVuZChvdmVybGF5LmFwcGVuZChjbG9zZSwgdGh1bWJuYWlscykpO1xuICAkKCcjd3JhcHBlcicpLmFkZENsYXNzKCdvdmVyZmxvdycpO1xufVxuZnVuY3Rpb24gdXBkYXRlTmV3SXRlbU92ZXJsYXkoKSB7XG4gIHZhciB0aHVtYm5haWxzID0gJCgnLnBvc3QtaXRlbS10aHVtYnMnKTtcbiAgdGh1bWJuYWlscy5lbXB0eSgpO1xuICB2YXIgc2VjdGlvbkRhdGEgPSBbXG4gICAge1xuICAgICAgdHlwZTogJ2l0ZW1zJyxcbiAgICAgIGl0ZW1zOiBwb3N0SXRlbXNcbiAgICB9XG4gIF07XG4gIGlmIChnZXRUZW1wbGF0ZXMoKSkge1xuICAgIHNlY3Rpb25EYXRhLnB1c2goe1xuICAgICAgdHlwZTogJ3RlbXBsYXRlcycsXG4gICAgICB0aXRsZTogJ1RlbXBsYXRlcycsXG4gICAgICBpdGVtczogZ2V0VGVtcGxhdGVzKClcbiAgICB9KVxuICB9XG4gIHNlY3Rpb25EYXRhLmZvckVhY2goZnVuY3Rpb24oc2VjdGlvbikge1xuICAgIHRodW1ibmFpbHMuYXBwZW5kKHJlbmRlclBvc3RJdGVtVGh1bWJuYWlsU2VjdGlvbihzZWN0aW9uLCB0YXJnZXQpKVxuICB9KTtcbn1cbi8vXG4vLyBSZW5kZXJzXG4vL1xuZnVuY3Rpb24gcmVuZGVyUG9zdEl0ZW1UaHVtYm5haWxTZWN0aW9uKGRhdGEsIHRhcmdldCkge1xuICB2YXIgc2VjdGlvbiA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygncG9zdC1pdGVtLXNlY3Rpb24gcG9zdC1pdGVtLXNlY3Rpb24tLScgKyBkYXRhLnR5cGUpLFxuICAgICAgdGl0bGUgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3Bvc3QtaXRlbS1zZWN0aW9uX190aXRsZScpLnRleHQoZGF0YS50aXRsZSksXG4gICAgICBpdGVtcyA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygncG9zdC1pdGVtLXNlY3Rpb25fX2l0ZW1zJyk7XG5cbiAgZGF0YS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpdGVtcy5hcHBlbmQocmVuZGVyUG9zdEl0ZW1UaHVtYm5haWwoaXRlbSwgdGFyZ2V0KSk7XG4gIH0pO1xuXG4gIHJldHVybiBzZWN0aW9uLmFwcGVuZCh0aXRsZSwgaXRlbXMpO1xufVxuZnVuY3Rpb24gcmVuZGVyUG9zdEl0ZW1UaHVtYm5haWwoaXRlbSwgdGFyZ2V0KSB7XG4gIHZhciB0aHVtYiA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygncG9zdC1pdGVtLXRodW1iIHBvc3QtaXRlbS10aHVtYi0tb3ZlcmxheScpLmF0dHIoJ2RhdGEtdHlwZScsIGl0ZW0udHlwZSkuY2xpY2soZnVuY3Rpb24oZSkge2l0ZW1UaHVtYkNsaWNrKGUsIGl0ZW0sIHRhcmdldCk7fSk7XG5cbiAgc3dpdGNoIChpdGVtLnR5cGUpIHtcbiAgICBjYXNlICd0ZW1wbGF0ZSc6XG4gICAgICB2YXIgZGVzY3JpcHRpb25TdHJpbmcgPSBpdGVtLml0ZW1zLnJlZHVjZShmdW5jdGlvbihhY2MsIGl0ZW1EYXRhLCBpKSB7XG4gICAgICAgIHJldHVybiBpID09PSAwID8gYWNjICsgaXRlbURhdGEudGl0bGUgOiBhY2MgKyAnLCAnICsgaXRlbURhdGEudGl0bGU7XG4gICAgICB9LCAnJyksXG4gICAgICAgICAgdGl0bGUgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3Bvc3QtaXRlbS10aHVtYl9fdGl0bGUnKS50ZXh0KGl0ZW0udGl0bGUpLFxuICAgICAgICAgIGRlc2NyaXB0aW9uID0gJCgnPGRpdiAvPicpLmFkZENsYXNzKCdwb3N0LWl0ZW0tdGh1bWJfX2Rlc2NyaXB0aW9uJykudGV4dChkZXNjcmlwdGlvblN0cmluZyksXG4gICAgICAgICAgcmVtb3ZlID0gJCgnPGRpdiAvPicpLmFkZENsYXNzKCdwb3N0LWl0ZW0tdGh1bWJfX3JlbW92ZScpLmNsaWNrKGhhbmRsZVJlbW92ZVRlbXBsYXRlQ2xpY2spO1xuICAgICAgcmV0dXJuIHRodW1iLmFkZENsYXNzKCdwb3N0LWl0ZW0tdGh1bWItLXRlbXBsYXRlJykuYXR0cignZGF0YS1pZCcsIGl0ZW0uaWQpLmFwcGVuZCh0aXRsZSwgZGVzY3JpcHRpb24sIHJlbW92ZSk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIGljb24gPSAkKCc8aSAvPicpLmFkZENsYXNzKCdwb3N0LWl0ZW0tdGh1bWJfX2ljb24gJyArIGl0ZW0uaWNvbkNsYXNzKSxcbiAgICAgICAgICB0aXRsZSA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygncG9zdC1pdGVtLXRodW1iX190aXRsZScpLnRleHQoaXRlbS50aXRsZSk7XG4gICAgICByZXR1cm4gdGh1bWIuYWRkQ2xhc3MoJ3Bvc3QtaXRlbS10aHVtYi0taXRlbScpLmFwcGVuZChpY29uLCB0aXRsZSk7XG4gIH1cbn1cblxuLy9cbi8vIEhhbmRsZXJzXG4vL1xuZnVuY3Rpb24gaGFuZGxlUmVtb3ZlVGVtcGxhdGVDbGljayhlKSB7XG4gIG5ldyBNb2RhbCh7XG4gICAgZGlhbG9nOiB0cnVlLFxuICAgIHRpdGxlOiAnUmVtb3ZlIFRlbXBsYXRlPycsXG4gICAgdGV4dDogJ0FsbCBpdGVtIGRhdGEgd2lsbCBiZSBsb3N0LiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVtb3ZlIHRoaXMgdGVtcGxhdGU/JyxcbiAgICBjb25maXJtVGV4dDogJ1JlbW92ZScsXG4gICAgY29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VjdGlvbiA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5wb3N0LWl0ZW0tc2VjdGlvbicpO1xuICAgICAgJChlLnRhcmdldCkucGFyZW50cygnLnBvc3QtaXRlbS10aHVtYicpLnJlbW92ZSgpO1xuICAgICAgcmVtb3ZlVGVtcGxhdGUocGFyc2VJbnQoJChlLnRhcmdldCkucGFyZW50cygnLnBvc3QtaXRlbS10aHVtYicpLmF0dHIoJ2RhdGEtaWQnKSkpO1xuICAgICAgaWYgKHNlY3Rpb24uZmluZCgnLnBvc3QtaXRlbS10aHVtYicpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBzZWN0aW9uLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2FuY2VsQWN0aW9uOiBmdW5jdGlvbigpIHt9IC8vIFNob3VsZCBiZSB1cGRhdGVkXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGl0ZW1UaHVtYkNsaWNrKGUsIGl0ZW0sIHRhcmdldCkge1xuICBpZiAoISQoZS50YXJnZXQpLmhhc0NsYXNzKCdwb3N0LWl0ZW0tdGh1bWJfX3JlbW92ZScpKSB7XG4gICAgdmFyIGl0ZW1zVG9JbnNlcnQ7XG4gICAgc3dpdGNoIChpdGVtLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3RlbXBsYXRlJzpcbiAgICAgICAgaXRlbXNUb0luc2VydCA9IHJlbmRlclRlbXBsYXRlKGl0ZW0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaXRlbXNUb0luc2VydCA9IHJlbmRlclBvc3RJdGVtKGl0ZW0pO1xuICAgIH1cbiAgICBpZiAodGFyZ2V0Lmhhc0NsYXNzKCdwb3N0LWl0ZW0tdGh1bWJuYWlscycpKSB7XG4gICAgICAkKCcjcG9zdEl0ZW1zJykuYXBwZW5kKGl0ZW1zVG9JbnNlcnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQuYWZ0ZXIoaXRlbXNUb0luc2VydCk7XG4gICAgfVxuICAgICQoJyNuZXdJdGVtT3ZlcmxheSAubW9kYWxfX2Nsb3NlJykuY2xpY2soKTtcbiAgICB2YXIgaXRlbUJvdHRvbUVuZCA9IGl0ZW1zVG9JbnNlcnQubGFzdCgpLmdldCgwKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBpdGVtc1RvSW5zZXJ0Lmxhc3QoKS5oZWlnaHQoKTtcbiAgICBpZiAoaXRlbUJvdHRvbUVuZCArIDYwID4gJCh3aW5kb3cpLmhlaWdodCgpKSB7XG4gICAgICAkKCdib2R5JykuYW5pbWF0ZSggeyBzY3JvbGxUb3A6ICcrPScgKyBNYXRoLnJvdW5kKGl0ZW1Cb3R0b21FbmQgKyA2MCAtICQod2luZG93KS5oZWlnaHQoKSkudG9TdHJpbmcoKSB9LCA0MDApO1xuICAgIH1cbiAgICBjaGVja0l0ZW1zKCk7XG4gIH1cbn1cblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBURU1QTEFURVMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmZ1bmN0aW9uIGNyZWF0ZU5ld1RlbXBsYXRlT3ZlcmxheSgpIHtcbiAgdmFyIHNjcm9sbFBvc2l0aW9uID0gJCgnYm9keScpLnNjcm9sbFRvcCgpO1xuICAgICAgb3ZlcmxheSA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnbW9kYWwgbW9kYWwtLWZ1bGwnKS5hdHRyKCdpZCcsICduZXdUZW1wbGF0ZU92ZXJsYXknKSxcbiAgICAgIGNsb3NlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX2Nsb3NlJykuY2xpY2soZnVuY3Rpb24oKSB7bmV3T3ZlcmxheUNsb3NlKG92ZXJsYXksIHNjcm9sbFBvc2l0aW9uKX0pLFxuICAgICAgdGVtcGxhdGUgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ25ldy10ZW1wbGF0ZScpLFxuICAgICAgdGl0bGVGaWVsZCA9ICQoJzxpbnB1dCB0eXBlPVwidGV4dFwiIHJlcXVpcmVkIC8+JykuYWRkQ2xhc3MoJ2pzLXJlcXVpcmVkIGlzLXJlcXVpcmVkIGlucHV0X19maWVsZF9zdHlsZV9kYXJrJykuYXR0cignaWQnLCAndGVtcGxhdGVOYW1lRmllbGQnKSxcbiAgICAgIGl0ZW1FbGVtZW50cyA9ICQoJyNwb3N0SXRlbXMgLnBvc3QtaXRlbV9fd3JhcHBlcicpLCAvL2dldCBpdGVtcyB0aGF0IHVzZXIgcGFzdCBpbnRvIGJsb2cgcGFnZVxuICAgICAgaXRlbXMgPSBpdGVtRWxlbWVudHMubWFwKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICByZXR1cm4gcG9zdEl0ZW1zLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7cmV0dXJuIGl0ZW0udHlwZSA9PT0gJChlbCkuYXR0cignZGF0YS10eXBlJyl9KVswXVxuICAgICAgfSkuZ2V0KCksXG4gICAgICBjb250cm9scyA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnbW9kYWxfX2NvbnRyb2xzIG1vZGFsX19jb250cm9scy0tYm90dG9tJyksXG4gICAgICBzYXZlQnV0dG9uID0gJCgnPGJ1dHRvbiBkaXNhYmxlZCAvPicpLmFkZENsYXNzKCdidXR0b24gYnV0dG9uX3N0eWxlX2ZpbGwtYWNjZW50IGRpc2FibGVkJykuYXR0cignaWQnLCAnc2F2ZVRlbXBsYXRlJykudGV4dCgnQ3JlYXRlIFRlbXBsYXRlJykuY2xpY2soZnVuY3Rpb24oKSB7c2F2ZVRlbXBsYXRlQ2xpY2sob3ZlcmxheSwgc2Nyb2xsUG9zaXRpb24pO30pLFxuICAgICAgY2FuY2VsQnV0dG9uID0gJCgnPGJ1dHRvbiAvPicpLmFkZENsYXNzKCdidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKS50ZXh0KCdDYW5jZWwnKS5jbGljayhmdW5jdGlvbigpIHtuZXdPdmVybGF5Q2xvc2Uob3ZlcmxheSwgc2Nyb2xsUG9zaXRpb24pfSk7XG5cbiAgdGVtcGxhdGUuYXBwZW5kKHRpdGxlRmllbGQsIHJlbmRlclRlbXBsYXRlSXRlbUxpc3QoaXRlbXMpKTtcbiAgbmV3IFRleHRmaWVsZCh0aXRsZUZpZWxkLmdldCgwKSwge1xuICAgIGxhYmVsOiAnVGVtcGxhdGUgTmFtZScsXG4gICAgb25JbnB1dDogaGFuZGxlVGVtcGxhdGVOYW1lRmllbGRJbnB1dCxcbiAgICBlcnJNc2c6ICdQbGVhc2UgZmlsbCB0aGUgdGVtcGxhdGUgbmFtZSdcbiAgfSk7XG5cbiAgJChkb2N1bWVudCkub24oJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7cG9zdERvY3VtZW50S2V5ZG93bihlLCBvdmVybGF5LCBzY3JvbGxQb3NpdGlvbik7fSk7XG4gICQoJ2JvZHknKS5hcHBlbmQob3ZlcmxheS5hcHBlbmQoY2xvc2UsIHRlbXBsYXRlLCBjb250cm9scy5hcHBlbmQoc2F2ZUJ1dHRvbiwgY2FuY2VsQnV0dG9uKSkpO1xuICAkKCcjd3JhcHBlcicpLmFkZENsYXNzKCdvdmVyZmxvdycpO1xufVxuXG4vL1xuLy8gU3RvcmUgZnVuY3Rpb25zXG4vL1xuZnVuY3Rpb24gZ2V0VGVtcGxhdGVzKCkge1xuICBpZiAod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0ZW1wbGF0ZXMnKSkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGVtcGxhdGVzJykpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGFkZFRlbXBsYXRlKHRlbXBsYXRlKSB7XG4gIHZhciB0ZW1wbGF0ZXMgPSBnZXRUZW1wbGF0ZXMoKSB8fCBbXTtcbiAgdGVtcGxhdGVzLnB1c2godGVtcGxhdGUpO1xuICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RlbXBsYXRlcycsIEpTT04uc3RyaW5naWZ5KHRlbXBsYXRlcykpO1xufVxuZnVuY3Rpb24gZ2V0VGVtcGxhdGUoaWQpIHtcbiAgcmV0dXJuIGdldFRlbXBsYXRlcygpID8gZ2V0VGVtcGxhdGVzKCkuZmlsdGVyKGZ1bmN0aW9uKHQpIHtyZXR1cm4gdC5pZCA9PT0gaWR9KVswXSA6IGZhbHNlO1xufVxuZnVuY3Rpb24gcmVtb3ZlVGVtcGxhdGUoaWQpIHtcbiAgdmFyIG5ld1RlbXBsYXRlcyA9IGdldFRlbXBsYXRlcygpLmZpbHRlcihmdW5jdGlvbih0KSB7cmV0dXJuIHQuaWQgIT09IGlkfSk7XG4gIGlmIChuZXdUZW1wbGF0ZXMubGVuZ3RoID4gMCkge1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndGVtcGxhdGVzJywgSlNPTi5zdHJpbmdpZnkobmV3VGVtcGxhdGVzKSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0ZW1wbGF0ZXMnKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBjaGVja1RlbXBsYXRlTmFtZShuYW1lKSB7XG4gIHJldHVybiBnZXRUZW1wbGF0ZXMoKSA/IGdldFRlbXBsYXRlcygpLmZpbHRlcihmdW5jdGlvbih0KSB7cmV0dXJuIHQudGl0bGUgPT09IG5hbWU7fSkubGVuZ2h0ID4gMCA6IGZhbHNlO1xufVxuXG4vL1xuLy8gUmVuZGVyc1xuLy9cbmZ1bmN0aW9uIHJlbmRlclRlbXBsYXRlSXRlbUxpc3QoaXRlbXMpIHtcbiAgdmFyIGxpc3QgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ250X19saXN0JykuYXR0cignaWQnLCAnbmV3VGVtcGxhdGVJdGVtcycpO1xuICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBsaXN0LmFwcGVuZChyZW5kZXJUZW1wbGF0ZUl0ZW0oaXRlbSkpO1xuICB9KTtcbiAgcmV0dXJuIGxpc3Q7XG59XG5mdW5jdGlvbiByZW5kZXJUZW1wbGF0ZUl0ZW0oaXRlbSkge1xuICB2YXIgaXRlbUVsID0gJCgnPGRpdiAvPicpLmFkZENsYXNzKCdudC1pdGVtIGlzLXNlbGVjdGVkJykuYXR0cignZGF0YS10eXBlJywgaXRlbS50eXBlKS5jbGljayhoYW5kbGVUZW1wbGF0ZUl0ZW1DbGljayksXG4gICAgICBjaGVja21hcmsgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ250LWl0ZW1fX2NoZWNrbWFyaycpLFxuICAgICAgdGl0bGUgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ250LWl0ZW1fX3RpdGxlJykuYXBwZW5kKCQoJzxpIC8+JykuYWRkQ2xhc3MoJ250LWl0ZW1fX2ljb24gJyArIGl0ZW0uaWNvbkNsYXNzKSwgJCgnPHNwYW4gLz4nKS50ZXh0KCcgJyArIGl0ZW0udGl0bGUpKTtcblxuICByZXR1cm4gaXRlbUVsLmFwcGVuZChjaGVja21hcmssIHRpdGxlKTtcbn1cblxuLy9cbi8vIEhhbmRsZXJzXG4vL1xuZnVuY3Rpb24gaGFuZGxlVGVtcGxhdGVJdGVtQ2xpY2soZSkge1xuICB2YXIgdGFyZ2V0ID0gJChlLnRhcmdldCkuaGFzQ2xhc3MoJ250LWl0ZW0nKSA/ICQoZS50YXJnZXQpIDogJChlLnRhcmdldCkucGFyZW50cygnLm50LWl0ZW0nKTtcbiAgdGFyZ2V0LnRvZ2dsZUNsYXNzKCdpcy1zZWxlY3RlZCcpO1xuICBjaGVja1RlbXBsYXRlSXRlbXMoKTtcbn1cbmZ1bmN0aW9uIHNhdmVUZW1wbGF0ZUNsaWNrKG92ZXJmbG93LCBzY3JvbGxQb3NpdGlvbikge1xuICB2YXIgbmFtZSA9ICQoJyN0ZW1wbGF0ZU5hbWVGaWVsZCcpLnZhbCgpLFxuICAgICAgc2VsZWN0ZWRJdGVtcyA9ICQoJyNuZXdUZW1wbGF0ZUl0ZW1zIC5udC1pdGVtLmlzLXNlbGVjdGVkJyksXG4gICAgICB0ZW1wbGF0ZUl0ZW1zID0gc2VsZWN0ZWRJdGVtcy5tYXAoZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgIHJldHVybiBwb3N0SXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtyZXR1cm4gaXRlbS50eXBlID09PSAkKGVsKS5hdHRyKCdkYXRhLXR5cGUnKX0pWzBdXG4gICAgICB9KS5nZXQoKVxuXG4gIGFkZFRlbXBsYXRlKHtcbiAgICB0aXRsZTogbmFtZSxcbiAgICB0eXBlOiAndGVtcGxhdGUnLFxuICAgIGl0ZW1zOiB0ZW1wbGF0ZUl0ZW1zLFxuICAgIGlkOiBEYXRlLm5vdygpXG4gIH0pO1xuICBuZXdPdmVybGF5Q2xvc2Uob3ZlcmxheSwgc2Nyb2xsUG9zaXRpb24pO1xuICBzaG93Tm90aWZpY2F0aW9uKCdOZXcgdGVtcGxhdGUgXCInICsgbmFtZSArICdcIiB3YXMgc2F2ZWQuJylcbn1cblxuZnVuY3Rpb24gaGFuZGxlVGVtcGxhdGVOYW1lRmllbGRJbnB1dChlKSB7XG4gIGlmICgkKGUudGFyZ2V0KS52YWwoKSAhPT0gJycpIHtcbiAgICAkKCcjc2F2ZVRlbXBsYXRlJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gIH0gZWxzZSB7XG4gICAgJCgnI3NhdmVUZW1wbGF0ZScpLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gIH1cbn1cblxuLy9cbi8vIEhlbHBlcnNcbi8vXG4vL0NoZWNrIGlmIHRoZXJlIGFyZSBzZWxlY3RlZCB0ZW1wbGF0ZXMgaXRlbXMgb24gYSBvdmVybGF5IGFuZCBjaGFuZ2UgdWkgYWNjb3JkaW5nbHlcbmZ1bmN0aW9uIGNoZWNrVGVtcGxhdGVJdGVtcygpIHtcbiAgaWYgKCQoJyNuZXdUZW1wbGF0ZUl0ZW1zIC5udC1pdGVtLmlzLXNlbGVjdGVkJykubGVuZ3RoID4gMCAmJiAkKCcjdGVtcGxhdGVOYW1lRmllbGQnKS52YWwoKSAhPT0gJycpIHtcbiAgICAkKCcjc2F2ZVRlbXBsYXRlJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gIH0gZWxzZSB7XG4gICAgJCgnI3NhdmVUZW1wbGF0ZScpLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gIH1cbn1cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gQ09NTU9OIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbmZ1bmN0aW9uIG5ld092ZXJsYXlDbG9zZShvdmVybGF5LCBzY3JvbGxQb3NpdGlvbikge1xuICBvdmVybGF5LnJlbW92ZSgpO1xuICAkKGRvY3VtZW50KS5vZmYoJ2tleWRvd24nKTtcbiAgJCgnI3dyYXBwZXInKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3cnKTtcbiAgaWYgKHNjcm9sbFBvc2l0aW9uKSB7XG4gICAgJCgnYm9keScpLnNjcm9sbFRvcChzY3JvbGxQb3NpdGlvbik7XG4gIH1cbn1cbmZ1bmN0aW9uIHBvc3REb2N1bWVudEtleWRvd24oZSwgb3ZlcmxheSwgc2Nyb2xsUG9zaXRpb24pIHtcbiAgaWYgKGUua2V5Q29kZSA9PT0gMjcpIHtuZXdPdmVybGF5Q2xvc2Uob3ZlcmxheSwgc2Nyb2xsUG9zaXRpb24pO31cbn1cblxuLy9Bc3NvY2lhdGlvbiBpbml0aWFsaXphdGlvblxuLy8gZGF0YVxudmFyIGRhdGFTZXJpZXMgPSBbXG4gICAgLy9TeWZ5XG4gICAgJzEyIE1vbmtleXMnLFxuICAgICdCYXR0bGVzdGFyIEdhbGFjdGljYScsXG4gICAgJ0JpdHRlbicsXG4gICAgJ0NoYW5uZWwgWmVybzogQ2FuZGxlIENvdmUnLFxuICAgICdDaGlsZGhvb2RzIEVuZCcsXG4gICAgJ0Nsb3NlIFVwIEtpbmdzJyxcbiAgICAnRGFyayBNYXR0ZXInLFxuICAgICdEZWZpYW5jZScsXG4gICAgJ0RvbWluaW9uJyxcbiAgICAnRmFjZSBPZmYnLFxuICAgICdHaG9zdCBIdW50ZXJzJyxcbiAgICAnSGF1bnRpbmcnLFxuICAgICdIYXZlbicsXG4gICAgJ0h1bnRlcnMnLFxuICAgICdLaWxsam95cycsXG4gICAgJ0xhdmFsYW50dWxhJyxcbiAgICAnTG9zdCBHaXJsJyxcbiAgICAnT2x5bXB1cycsXG4gICAgJ1BhcmFub3JtYWwgV2l0bmVzcycsXG4gICAgJ1NoYXJrbmFkbycsXG4gICAgJ1NoYXJrbmFkbyAyJyxcbiAgICAnU2hhcmtuYWRvIDMnLFxuICAgICdUaGUgRXhwYW5zZScsXG4gICAgJ1RoZSBJbnRlcm5ldCBSdWluZWQgTXkgTGlmZScsXG4gICAgJ1RoZSBNYWdpY2lhbnMnLFxuICAgICdUcm95OiBTdHJlZXQgTWFnaWMnLFxuICAgICdWYW4gSGVsc2luZycsXG4gICAgJ1d5bm9ubmEgRWFycCcsXG4gICAgJ1ogTmF0aW9uJyxcblxuICAgIC8vQ2hpbGxlclxuICAgICdTbGFzaGVyJyxcblxuICAgIC8vTkJDXG4gICAgJ0JsaW5kc3BvdCcsXG4gICAgJ1RoZSBCbGFja2xpc3QnXG5dO1xuXG52YXIgZGF0YVNlYXNvbnMgPSBbXG4gICAgJzAxJyxcbiAgICAnMDInLFxuICAgICcwMycsXG4gICAgJzA0JyxcbiAgICAnMDUnLFxuICAgICcwNicsXG4gICAgJzA3J1xuXTtcblxudmFyIGRhdGFFcGlzb2RlcyA9IFtcbiAgICAnMS4gQSBOZXcgVmlzaXRvcicsXG4gICAgJzIuIFRoZSBNYW4gaW4gdGhlIFNoYWRvd3MnLFxuICAgICczLiBUaGUgRmlyc3QgU2xpY2UnLFxuICAgICc0LiBUaGUgQmxvb2QgTW9vbicsXG4gICAgJzUuIERvbuKAmXQgR2V0IExvc3QnLFxuICAgICc2LiBBbGwgQWxvbmUnXG5dO1xuXG5mdW5jdGlvbiBjcmVhdGVQYWdlU2VjdGlvbihjcmVkaXQsIHNlY3Rpb24pIHtcbiAgdmFyIGFkZGFibGVSb3cgPSBjcmVhdGVQYWdlUm93KHtMaW5rOiAnJ30pO1xuXG4gIHNlY3Rpb24uYXBwZW5kKGFkZGFibGVSb3cpO1xuICBhZGRhYmxlT2JqZWN0ID0gbmV3IEFkZGFibGUoYWRkYWJsZVJvdyk7XG4gIGFkZGFibGVPYmplY3QucmVtb3ZlSXRlbSgwKTtcblxuICBjcmVkaXQuZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgYWRkYWJsZU9iamVjdC5fYWRkSXRlbShjcmVhdGVQYWdlUm93KGMpKTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gY3JlYXRlUGFnZVJvdyhjKSB7XG4gICAgdmFyIGNyZWRpdFJvdyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NnX19jb250cm9scyBjZ19fY29udHJvbHNfc3R5bGVfcm93JyksXG4gICAgcm9sZVdyYXBwZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjZ19fY29udHJvbCBjZ19fY29udHJvbF9zdHlsZV9yb3cnKSxcbiAgICByb2xlRmllbGQgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIi8+JykuYWRkQ2xhc3MoJ2lucHV0X3N0eWxlX2xpZ2h0JykudmFsKGMucm9sZSksXG4gICAgbmFtZXNGaWVsZCA9ICQoJzx0ZXh0YXJlYT48L3RleHRhcmVhPicpLmFkZENsYXNzKCdpbnB1dF9zdHlsZV9saWdodCcpLnZhbChjLm5hbWVzKSxcbiAgICBuYW1lc1dyYXBwZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjZ19fY29udHJvbCBjZ19fY29udHJvbF9zdHlsZV9yb3cnKTtcblxuICAgIC8vbmFtZXNGaWVsZC5lbGFzdGljKCk7XG4gICAgcm9sZVdyYXBwZXIuYXBwZW5kKHJvbGVGaWVsZCk7XG4gICAgbmFtZXNXcmFwcGVyLmFwcGVuZChuYW1lc0ZpZWxkKTtcbiAgICBjcmVkaXRSb3cuYXBwZW5kKHJvbGVXcmFwcGVyLCBuYW1lc1dyYXBwZXIpO1xuICAgIG5ldyBUZXh0ZmllbGQocm9sZUZpZWxkLmdldCgwKSwge1xuICAgICAgbGFiZWw6ICdUaXRsZScsXG4gICAgICBoZWxwVGV4dDogJ2UuZyBQcm9kdWNlciwgQ29zdHVtZSdcbiAgICB9KTtcbiAgICBuZXcgVGV4dGZpZWxkKG5hbWVzRmllbGQuZ2V0KDApLCB7bGFiZWw6ICdOYW1lKHMpJ30pO1xuICAgICQobmFtZXNXcmFwcGVyKS5maW5kKCd0ZXh0YXJlYScpLmVsYXN0aWMoKTtcblxuICAgIHJldHVybiBjcmVkaXRSb3c7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdFBhZ2VTZWN0aW9uKHNlY3Rpb24sIGRhdGEpIHtcbiAgdmFyIGFkZGFibGVSb3cgPSBjcmVhdGVQYWdlTGlua1JvdygnJyk7XG4gIHNlY3Rpb24uYXBwZW5kKGFkZGFibGVSb3cpO1xuICBhZGRhYmxlT2JqZWN0ID0gbmV3IEFkZGFibGUoYWRkYWJsZVJvdyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBhZ2VMaW5rUm93KGxpbmspIHtcbiAgdmFyIHBhZ2VSb3cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjZ19fY29udHJvbHMgY2dfX2NvbnRyb2xzX3N0eWxlX3JvdycpLFxuICBwYWdlV3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NnX19jb250cm9sIGNnX19jb250cm9sX3N0eWxlX3JvdycpLFxuICBsaW5rRmllbGQgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIi8+JykuYWRkQ2xhc3MoJ2lucHV0X3N0eWxlX2xpZ2h0JykudmFsKGxpbmspO1xuXG4gIHBhZ2VXcmFwcGVyLmFwcGVuZChsaW5rRmllbGQpO1xuICBwYWdlUm93LmFwcGVuZChwYWdlV3JhcHBlcik7XG4gIG5ldyBUZXh0ZmllbGQobGlua0ZpZWxkLmdldCgwKSwge1xuICAgIGxhYmVsOiAnTGluaycsXG4gICAgaGVscFRleHQ6ICdGdXNjZSBzb2RhbGVzIGZpbmlidXMgYXVjdG9yLiBOdW5jIGlwc3VtIHR1cnBpcywgcG9ydHRpdG9yIG5vbiBzZW0gaWQsIGx1Y3R1cyB0aW5jaWR1bnQgZGlhbS4nXG4gIH0pO1xuXG4gIHJldHVybiBwYWdlUm93O1xufVxuXG5mdW5jdGlvbiBpbml0U2VyaWVzU2VjdGlvbihzZWN0aW9uKSB7XG4gIGZ1bmN0aW9uIGJlZm9yZUFkZFNlcmllcyhlbCkge1xuICAgIC8vQ3JlYXRlIHNlbGVjdGJveFxuICAgIHZhciBzZXJpZXNTZWxlY3RJdGVtID0gbmV3IFNlbGVjdGJveChlbC5maW5kKCcuanMtc2VsZWN0Ym94LmpzLXNlcmllc1NlbGVjdCcpLmdldCgwKSwge1xuICAgICAgbGFiZWw6ICdTZXJpZXMgb3IgRXZlbnQnLFxuICAgICAgcGxhY2Vob2xkZXI6ICdTZWxlY3QgU2VyaWVzIG9yIEV2ZW50JyxcbiAgICAgIGl0ZW1zOiBkYXRhU2VyaWVzLnNvcnQoKSxcbiAgICAgIHVuc2VsZWN0OiAn4oCUIE5vbmUg4oCUJ1xuICAgIH0pO1xuXG4gICAgdmFyIHNlYXNvblNlbGVjdEl0ZW0gPSBuZXcgU2VsZWN0Ym94KGVsLmZpbmQoJy5qcy1zZWxlY3Rib3guanMtc2Vhc29uU2VsZWN0JykuZ2V0KDApLCB7XG4gICAgICBsYWJlbDogJ1NlYXNvbicsXG4gICAgICBwbGFjZWhvbGRlcjogJ1NlbGVjdCBTZWFzb24nLFxuICAgICAgaXRlbXM6IGRhdGFTZWFzb25zLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gYSA8IGIgPyAxIDogYSA+IGIgPyAtMSA6IDA7XG4gICAgICB9KSxcbiAgICAgIHVuc2VsZWN0OiAn4oCUIE5vbmUg4oCUJ1xuICAgIH0pO1xuXG4gICAgdmFyIGVwaXNvZGVTZWxlY3RJdGVtID0gbmV3IFNlbGVjdGJveChlbC5maW5kKCcuanMtc2VsZWN0Ym94LmpzLWVwaXNvZGVTZWxlY3QnKS5nZXQoMCksIHtcbiAgICAgIGxhYmVsOiAnRXBpc29kZScsXG4gICAgICBwbGFjZWhvbGRlcjogJ1NlbGVjdCBFcGlzb2RlJyxcbiAgICAgIGl0ZW1zOiBkYXRhRXBpc29kZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhIDwgYiA/IDEgOiBhID4gYiA/IC0xIDogMDtcbiAgICAgIH0pLFxuICAgICAgdW5zZWxlY3Q6ICfigJQgTm9uZSDigJQnXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbXB0eVNlcmllc1JvdyAoKSB7XG4gICAgdmFyIHNlcmllc1JvdyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NnX19jb250cm9scyBjZ19fY29udHJvbHNfc3R5bGVfcm93JyksXG5cbiAgICBzZXJpZXNXcmFwcGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2wgY2dfX2NvbnRyb2xfc3R5bGVfcm93JyksXG4gICAgc2VyaWVzU2VsZWN0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtc2VsZWN0Ym94IGpzLXNlcmllc1NlbGVjdCcpLmNzcygnbWluLXdpZHRoJywgJzEwMHB4JyksXG5cbiAgICBzZWFzb25XcmFwcGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2wgY2dfX2NvbnRyb2xfc3R5bGVfcm93JykuY3NzKCdtYXgtd2lkdGgnLCA2MCksXG4gICAgc2Vhc29uU2VsZWN0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtc2VsZWN0Ym94IGpzLXNlYXNvblNlbGVjdCcpLFxuXG4gICAgZXBpc29kZVdyYXBwZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjZ19fY29udHJvbCBjZ19fY29udHJvbF9zdHlsZV9yb3cnKSxcbiAgICBlcGlzb2RlU2VsZWN0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtc2VsZWN0Ym94IGpzLWVwaXNvZGVTZWxlY3QnKS5jc3MoJ21pbi13aWR0aCcsICc5MHB4Jyk7XG5cbiAgICBzZXJpZXNXcmFwcGVyLmFwcGVuZChzZXJpZXNTZWxlY3QpO1xuICAgIHNlYXNvbldyYXBwZXIuYXBwZW5kKHNlYXNvblNlbGVjdCk7XG4gICAgZXBpc29kZVdyYXBwZXIuYXBwZW5kKGVwaXNvZGVTZWxlY3QpO1xuICAgIHNlcmllc1Jvdy5hcHBlbmQoc2VyaWVzV3JhcHBlciwgc2Vhc29uV3JhcHBlciwgZXBpc29kZVdyYXBwZXIpO1xuXG4gICAgcmV0dXJuIHNlcmllc1JvdztcbiAgfVxuXG4gIHZhciBzZXJpZXNSb3cgPSBjcmVhdGVFbXB0eVNlcmllc1JvdygpO1xuICBzZWN0aW9uLmFwcGVuZChzZXJpZXNSb3cpO1xuICB2YXIgYWRkYWJsZU9iamVjdCA9IG5ldyBBZGRhYmxlKHNlcmllc1Jvdywge2JlZm9yZUFkZDogYmVmb3JlQWRkU2VyaWVzfSk7XG4gIGFkZGFibGVPYmplY3QucmVtb3ZlSXRlbSgwKTtcbiAgYWRkYWJsZU9iamVjdC5fYWRkSXRlbShjcmVhdGVFbXB0eVNlcmllc1JvdygpLCBiZWZvcmVBZGRTZXJpZXMpO1xuXG4gIHJldHVybiBhZGRhYmxlT2JqZWN0O1xufVxuXG4vL0NvbGxlY3Rpb24gaW5pdGlhbGl6YXRpb25cbi8vIGRhdGFcbnZhciBjb2xsZWN0aW9uSXRlbXMgPSBbXG4gICAge1xuICAgICAgICB0aXRsZTogJ0V2aWwgSGFuZG1hZGUgSW5zdHJ1bWVudCcsXG4gICAgICAgIGlkOiAxLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1Bob3RvIGZyb20gdGhlIGVwaXNvZGUgXCJFdmlsIEhhbmRtYWRlIEluc3RydW1lbnRcIicsXG4gICAgICAgIHR5cGU6ICdnYWxsZXJ5JyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIHN1YnRpdGxlOiAnR2FsbGVyeSB8IEJsaW5kc3BvdCcsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvYXp0ZWNfdGVtcGxlLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1nYWxsZXJ5Lmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnQXV0aGVudGljIEZsaXJ0JyxcbiAgICAgICAgaWQ6IDIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnUGhvdG8gZnJvbSB0aGUgZXBpc29kZSBcIkF1dGhlbnRpYyBGbGlydFwiJyxcbiAgICAgICAgdHlwZTogJ2dhbGxlcnknLFxuICAgICAgICBzZXJpZXM6ICdCbGluZHNwb3QnLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgZXBpc29kZTogJzUnLFxuICAgICAgICBzdWJ0aXRsZTogJ0dhbGxlcnkgfCBCbGluZHNwb3QnLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL2JpZ19iZW4ucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWdhbGxlcnkuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdQZXJzZWN1dGUgRW52b3lzJyxcbiAgICAgICAgaWQ6IDMsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnUGhvdG8gZnJvbSB0aGUgZXBpc29kZSBcIlBlcnNlY3V0ZSBFbnZveXNcIicsXG4gICAgICAgIHR5cGU6ICdnYWxsZXJ5JyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIHN1YnRpdGxlOiAnR2FsbGVyeSB8IEJsaW5kc3BvdCcsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvY2hyaXN0X3RoZV9yZWRlZW1lci5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZ2FsbGVyeS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NlbnQgb24gVG91cicsXG4gICAgICAgIGlkOiA0LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1Bob3RvIGZyb20gdGhlIGVwaXNvZGUgXCJTZW50IG9uIFRvdXJcIicsXG4gICAgICAgIHR5cGU6ICdnYWxsZXJ5JyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGVwaXNvZGU6ICc1JyxcbiAgICAgICAgc3VidGl0bGU6ICdHYWxsZXJ5IHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9jb2xvc3NldW0ucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWdhbGxlcnkuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdDZWRlIFlvdXIgU291bCcsXG4gICAgICAgIGlkOiA1LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1Bob3RvIGZyb20gdGhlIGVwaXNvZGUgXCJDZWRlIFlvdXIgU291bFwiJyxcbiAgICAgICAgdHlwZTogJ2dhbGxlcnknLFxuICAgICAgICBzZXJpZXM6ICdCbGluZHNwb3QnLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgZXBpc29kZTogJzMnLFxuICAgICAgICBzdWJ0aXRsZTogJ0dhbGxlcnkgfCBCbGluZHNwb3QnLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL2Vhc3Rlcl9pc2xhbmQucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWdhbGxlcnkuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdTcGxpdCBUaGUgTGF3JyxcbiAgICAgICAgaWQ6IDYsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnUGhvdG8gZnJvbSB0aGUgZXBpc29kZSBcIlNwbGl0IFRoZSBMYXdcIicsXG4gICAgICAgIHR5cGU6ICdnYWxsZXJ5JyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGVwaXNvZGU6ICc1JyxcbiAgICAgICAgc3VidGl0bGU6ICdHYWxsZXJ5JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9weXJhbWlkcy5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZ2FsbGVyeS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0JvbmUgTWF5IFJvdCcsXG4gICAgICAgIGlkOiA3LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1Bob3RvIGZyb20gdGhlIGVwaXNvZGUgXCJCb25lIE1heSBSb3RcIicsXG4gICAgICAgIHR5cGU6ICdnYWxsZXJ5JyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc2Vhc29uOicxJyxcbiAgICAgICAgZXBpc29kZTonNycsXG4gICAgICAgIHN1YnRpdGxlOiAnR2FsbGVyeSB8IEJsaW5kc3BvdCcsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvc2FuX2ZyYW5jaXNvX2JyaWRnZS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZ2FsbGVyeS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0VpZ2h0IFNsaW0gR3JpbnMnLFxuICAgICAgICBpZDogOCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdQaG90byBmcm9tIHRoZSBlcGlzb2RlIFwiRWlnaHQgU2xpbSBHcmluc1wiJyxcbiAgICAgICAgdHlwZTogJ2dhbGxlcnknLFxuICAgICAgICBzZXJpZXM6ICdCbGluZHNwb3QnLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgc3VidGl0bGU6ICdHYWxsZXJ5IHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9zdG9uZV9oZW5nZS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZ2FsbGVyeS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0EgU3RyYXkgSG93bCcsXG4gICAgICAgIGlkOiA5LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1Bob3RvIGZyb20gdGhlIGVwaXNvZGUgXCJBIFN0cmF5IEhvd2xcIicsXG4gICAgICAgIHR5cGU6ICdnYWxsZXJ5JyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdHYWxsZXJ5IHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9zeWRuZXlfb3BlcmFfaG91c2UucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWdhbGxlcnkuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdBIFN0cmF5IEhvd2wnLFxuICAgICAgICBpZDogMTAsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc3VidHlwZTogJ2VwaXNvZGUnLFxuICAgICAgICBzZXJpZXM6ICdCbGluZHNwb3QnLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS90YWpfbWFoYWwucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdFaWdodCBTbGltIEdyaW5zJyxcbiAgICAgICAgaWQ6IDExLFxuICAgICAgICB0eXBlOiAnZXBpc29kZScsXG4gICAgICAgIHN1YnR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGVwaXNvZGU6ICc1JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS93aW5kbWlsbC5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0JvbmUgTWF5IFJvdCcsXG4gICAgICAgIGlkOiAxMixcbiAgICAgICAgdHlwZTogJ2VwaXNvZGUnLFxuICAgICAgICBzdWJ0eXBlOiAnZXBpc29kZScsXG4gICAgICAgIHNlcmllczogJ0JsaW5kc3BvdCcsXG4gICAgICAgIHNlYXNvbjogJzInLFxuICAgICAgICBzdWJ0aXRsZTogJ0VwaXNvZGUgfCBCbGluZHNwb3QnLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL3RyZWVfMS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NwbGl0IFRoZSBMYXcnLFxuICAgICAgICBpZDogMTMsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc3VidHlwZTogJ2VwaXNvZGUnLFxuICAgICAgICBzZXJpZXM6ICdCbGluZHNwb3QnLFxuICAgICAgICBzZWFzb246ICcyJyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS90cmVlXzIucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdKYW5lXFwncyBUYXR0b28gQmFja3N0b3J5OiBFcGlzb2RlIDEwJyxcbiAgICAgICAgaWQ6IDE0LFxuICAgICAgICB0eXBlOiAndmlkZW8nLFxuICAgICAgICBzdWJ0eXBlOiAnd2ViIGV4Y2x1c2l2ZScsXG4gICAgICAgIHNlcmllczogJ0JsaW5kc3BvdCcsXG4gICAgICAgIHNlYXNvbjogJzInLFxuICAgICAgICBlcGlzb2RlOiAnNScsXG4gICAgICAgIHN1YnRpdGxlOiAnRXBpc29kZSB8IEJsaW5kc3BvdCcsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvdHJlZV8zLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1lcGlzb2RlLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnSmFuZVxcJ3MgVGF0dG9vIEJhY2tzdG9yeTogRXBpc29kZSA5JyxcbiAgICAgICAgaWQ6IDE1LFxuICAgICAgICB0eXBlOiAndmlkZW8nLFxuICAgICAgICBzdWJ0eXBlOiAnd2ViIGV4Y2x1c2l2ZScsXG4gICAgICAgIHNlcmllczogJ0JsaW5kc3BvdCcsXG4gICAgICAgIGVwaXNvZGU6ICcyJyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS90cmVlXzQucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdKYW5lXFwncyBUYXR0b28gQmFja3N0b3J5OiBFcGlzb2RlIDgnLFxuICAgICAgICBpZDogMTYsXG4gICAgICAgIHR5cGU6ICd2aWRlbycsXG4gICAgICAgIHN1YnR5cGU6ICd3ZWIgZXhjbHVzaXZlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS90cmVlXzUucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdKYW5lXFwncyBUYXR0b28gQmFja3N0b3J5OiBFcGlzb2RlIDcnLFxuICAgICAgICBpZDogMTcsXG4gICAgICAgIHR5cGU6ICd2aWRlbycsXG4gICAgICAgIHN1YnR5cGU6ICd3ZWIgZXhjbHVzaXZlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS90cmVlXzYucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuXG4gICAgLy9FcGlzb2Rlc1xuICAgIHtcbiAgICAgICAgdGl0bGU6ICcxLiBTZXJpZXMgUHJlbWllcmUnLFxuICAgICAgICBpZDogMTgsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQSBiZWF1dGlmdWwsIG5ha2VkIGFtbmVzaWFjIGlzIGZvdW5kIGluIGEgYmFnIGluIFRpbWVzIFNxdWFyZSwgY292ZXJlZCBpbiBmcmVzaCB0YXR0b29zIC0gb25lIG9mIHdoaWNoIGlzIHRoZSBuYW1lIG9mIEZCSSBTcGVjaWFsIEFnZW50IEt1cnQgV2VsbGVyLicsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc2Vhc29uOiAnMicsXG4gICAgICAgIGVwaXNvZGU6ICcxJyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICcyLiBBIFN0cmF5IEhvd2wnLFxuICAgICAgICBpZDogMTksXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnV2hpbGUgYSB0YXR0b28gc2VuZHMgdGhlIHRlYW0gYWZ0ZXIgYSBkcm9uZSBwaWxvdCBnb25lIGNyYXp5LCBXZWxsZXIgc2Vla3MgdG8gY29uZmlybSB0aGF0IEphbmUgRG9lIGlzIGEgbWlzc2luZyBwZXJzb24gZnJvbSBoaXMgY2hpbGRob29kLicsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc2Vhc29uOiAnMicsXG4gICAgICAgIGVwaXNvZGU6ICc2JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICczLiBFaWdodCBTbGltIEdyaW5zJyxcbiAgICAgICAgaWQ6IDIwLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0FmdGVyIGEgcnVuLWluIHdpdGggdGhlIG15c3RlcmlvdXMgYmVhcmRlZCBtYW4sIEphbmVcXCdzIFNFQUwgdGF0dG9vIGxlYWRzIHRvIGEgdmlvbGVudCBnYW5nIG9mIHRoaWV2ZXMgLSBjYW4gdGhleSB0ZWxsIGhlciB3aG8gc2hlIGlzPycsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGVwaXNvZGU6ICczJyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICc0LiBCb25lIE1heSBSb3QnLFxuICAgICAgICBpZDogMjEsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnTWF0dGVycyBvZiB0cnVzdCBjb21lIHRvIGEgaGVhZCB3aGlsZSB3aGlsZSB0aGUgdGVhbSB0cmllcyB0byBwcmV2ZW50IGEgZ2xvYmFsIHBhbmRlbWljIGF0IHRoZSBDREM7IHRlc3QgcmVzdWx0cyBwdXQgSmFuZVxcJ3MgaWRlbnRpdHkgaW4gcXVlc3Rpb24uJyxcbiAgICAgICAgdHlwZTogJ2VwaXNvZGUnLFxuICAgICAgICBzZXJpZXM6ICdCbGluZHNwb3QnLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgZXBpc29kZTogJzQnLFxuICAgICAgICBzdWJ0aXRsZTogJ0VwaXNvZGUgfCBCbGluZHNwb3QnLFxuICAgICAgICBpbWc6ICcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJzUuIFNwbGl0IFRoZSBMYXcnLFxuICAgICAgICBpZDogMjIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIEZCSSBmYWNlcyBvZmYgd2l0aCB0aGUgQ0lBIHdoaWxlIGh1bnRpbmcgYSBkaXJ0eSBib21iZXI7IEphbmUgcmVtZW1iZXJzIGEgZGlzdHVyYmluZyBjaGlsZGhvb2QgbWVtb3J5LicsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGVwaXNvZGU6ICc1JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICc2LiBDZWRlIFlvdXIgU291bCcsXG4gICAgICAgIGlkOiAyMyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdKYW5lIGFuZCBXZWxsZXIgc3RydWdnbGUgdG8ga2VlcCB0aGVpciByZWxhdGlvbnNoaXAgcHJvZmVzc2lvbmFsIHdoaWxlIGNoYXNpbmcgYSB0ZWVuIGhhY2tlciB3aG9cXCdzIGNyZWF0ZWQgYSBraWxsZXIgYXBwLicsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGVwaXNvZGU6ICc2JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICc3LiBTZW50IG9uIFRvdXInLFxuICAgICAgICBpZDogMjQsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnTWF5ZmFpclxcJ3Mgc2VjcmV0cyBiZWdpbiB0byB1bnJhdmVsIGFzIHRoZSB0ZWFtIHRha2VzIG9uIGEgc2VjZXNzaW9uaXN0IG1pbGl0aWEgZ3VhcmRpbmcgU2HDumwgR3VlcnJlcm8uIExvdSBEaWFtb25kIFBoaWxsaXBzIGd1ZXN0IHN0YXJzLicsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGVwaXNvZGU6ICc3JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICc4LiBQZXJzZWN1dGUgRW52b3lzJyxcbiAgICAgICAgaWQ6IDI1LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ01heWZhaXIgY29tZXMgY2xlYW4gYWJvdXQgRGF5bGlnaHQ7IG9uZSBvZiBKYW5lXFwncyB0YXR0b29zIHNldHMgdGhlIHRlYW0gYWZ0ZXIgYSBCcm9va2x5biBjb3Aga2lsbGVyLicsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGVwaXNvZGU6ICc4JyxcbiAgICAgICAgc3VidGl0bGU6ICdFcGlzb2RlIHwgQmxpbmRzcG90JyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICc5LiBBdXRoZW50aWMgRmxpcnQnLFxuICAgICAgICBpZDogMjYsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnTWF5ZmFpciBzdHJ1Z2dsZXMgdG8ga2VlcCBEYXlsaWdodCB1bmRlciB3cmFwcyBhcyBKYW5lIGFuZCBXZWxsZXIgZ28gdW5kZXJjb3ZlciBhcyBtYW4gYW5kIHdpZmUuJyxcbiAgICAgICAgdHlwZTogJ2VwaXNvZGUnLFxuICAgICAgICBzZXJpZXM6ICdCbGluZHNwb3QnLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgZXBpc29kZTogJzknLFxuICAgICAgICBzdWJ0aXRsZTogJ0VwaXNvZGUgfCBCbGluZHNwb3QnLFxuICAgICAgICBpbWc6ICcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJzEwLiBFdmlsIEhhbmRtYWRlIEluc3RydW1lbnQnLFxuICAgICAgICBpZDogMjcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGh1bnQgZm9yIERhdmlkXFwncyBtdXJkZXJlciB3YWtlbnMgYSBob3JkZSBvZiBSdXNzaWFuIHNsZWVwZXIgYWdlbnRzLicsXG4gICAgICAgIHR5cGU6ICdlcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnQmxpbmRzcG90JyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGVwaXNvZGU6ICcxMCcsXG4gICAgICAgIHN1YnRpdGxlOiAnRXBpc29kZSB8IEJsaW5kc3BvdCcsXG4gICAgICAgIGltZzogJycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1lcGlzb2RlLmh0bWwnXG4gICAgfSxcblxuICAgIC8vIFNsYXNoZXIgY29udGVudFxuXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXInLFxuICAgICAgICBpZDogMjgsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQuJyxcbiAgICAgICAgdHlwZTogJ1NlcmllcycsXG4gICAgICAgIHNlcmllczogJ1NsYXNoZXInLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgZXBpc29kZTogJzEnLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL1RlcmVzYS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXIgLSBQaWxvdCcsXG4gICAgICAgIGlkOiA0MCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dC4nLFxuICAgICAgICB0eXBlOiAnRXBpc29kZScsXG4gICAgICAgIHNlcmllczogJ1NsYXNoZXInLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgZXBpc29kZTogJzInLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL1RlcmVzYS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXIgLSBEaWdnaW5nIFlvdXIgR3JhdmUgd2l0aCBZb3VyIFRlZXRoJyxcbiAgICAgICAgaWQ6IDQwLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LicsXG4gICAgICAgIHR5cGU6ICdFcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnU2xhc2hlcicsXG4gICAgICAgIHNlYXNvbjogJzEnLFxuICAgICAgICBlcGlzb2RlOiAnMycsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvVGVyZXNhLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1lcGlzb2RlLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU2xhc2hlciAtIExpa2UgYXMgRmlyZSBFYXRldGggVXAgYW5kIEJ1cm5ldGggV29vZCcsXG4gICAgICAgIGlkOiA0MSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dC4nLFxuICAgICAgICB0eXBlOiAnRXBpc29kZScsXG4gICAgICAgIHNlcmllczogJ1NsYXNoZXInLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgZXBpc29kZTogJzQnLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL1RlcmVzYS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXIgLSBBcyBXYXRlciBJcyBDb3JydXB0ZWQgVW5sZXNzIEl0IE1vdmVzJyxcbiAgICAgICAgaWQ6IDQyLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LicsXG4gICAgICAgIHR5cGU6ICdFcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnU2xhc2hlcicsXG4gICAgICAgIHNlYXNvbjogJzEnLFxuICAgICAgICBlcGlzb2RlOiAnNScsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvVGVyZXNhLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1lcGlzb2RlLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU2xhc2hlciAtIElsbC1Hb3R0ZW4gR2FpbnMnLFxuICAgICAgICBpZDogNDMsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQuJyxcbiAgICAgICAgdHlwZTogJ0VwaXNvZGUnLFxuICAgICAgICBzZXJpZXM6ICdTbGFzaGVyJyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGVwaXNvZGU6ICc3JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9UZXJlc2EucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdTbGFzaGVyIC0gVGhlIE9uZSBXaG8gU293cyBIaXMgT3duIEZsZXNoJyxcbiAgICAgICAgaWQ6IDQ1LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LicsXG4gICAgICAgIHR5cGU6ICdFcGlzb2RlJyxcbiAgICAgICAgc2VyaWVzOiAnU2xhc2hlcicsXG4gICAgICAgIHNlYXNvbjogJzEnLFxuICAgICAgICBlcGlzb2RlOiAnNicsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvVGVyZXNhLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1lcGlzb2RlLmh0bWwnXG4gICAgfSwgXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXIgLSBJbiB0aGUgUHJpZGUgb2YgSGlzIEZhY2UnLFxuICAgICAgICBpZDogNDYsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQuJyxcbiAgICAgICAgdHlwZTogJ0VwaXNvZGUnLFxuICAgICAgICBzZXJpZXM6ICdTbGFzaGVyJyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGVwaXNvZGU6ICc4JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9UZXJlc2EucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LCBcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU2xhc2hlciBTMSBFMDEnLFxuICAgICAgICBpZDogNDcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQuJyxcbiAgICAgICAgdHlwZTogJ1ZpZGVvJyxcbiAgICAgICAgc2VyaWVzOiAnU2xhc2hlcicsXG4gICAgICAgIHNlYXNvbjogJzEnLFxuICAgICAgICBlcGlzb2RlOiAnMScsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvVGVyZXNhLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1lcGlzb2RlLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU2xhc2hlciBTMSBFMDInLFxuICAgICAgICBpZDogNDgsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQuJyxcbiAgICAgICAgdHlwZTogJ1ZpZGVvJyxcbiAgICAgICAgc2VyaWVzOiAnU2xhc2hlcicsXG4gICAgICAgIHNlYXNvbjogJzEnLFxuICAgICAgICBlcGlzb2RlOiAnMicsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvVGVyZXNhLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1lcGlzb2RlLmh0bWwnXG4gICAgfSwgXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXIgUzEgRTAzJyxcbiAgICAgICAgaWQ6IDQ5LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LicsXG4gICAgICAgIHR5cGU6ICdWaWRlbycsXG4gICAgICAgIHNlcmllczogJ1NsYXNoZXInLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgZXBpc29kZTogJzMnLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL1RlcmVzYS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sIFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdTbGFzaGVyIFMxIEUwNCcsXG4gICAgICAgIGlkOiA1MCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dC4nLFxuICAgICAgICB0eXBlOiAnVmlkZW8nLFxuICAgICAgICBzZXJpZXM6ICdTbGFzaGVyJyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGVwaXNvZGU6ICc0JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9UZXJlc2EucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxue1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXIgUzEgRTA1JyxcbiAgICAgICAgaWQ6IDUxLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LicsXG4gICAgICAgIHR5cGU6ICdWaWRlbycsXG4gICAgICAgIHNlcmllczogJ1NsYXNoZXInLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgZXBpc29kZTogJzUnLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL1RlcmVzYS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXIgUzEgRTA2JyxcbiAgICAgICAgaWQ6IDUyLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LicsXG4gICAgICAgIHR5cGU6ICdWaWRlbycsXG4gICAgICAgIHNlcmllczogJ1NsYXNoZXInLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgZXBpc29kZTogJzYnLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL1RlcmVzYS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sIFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdTbGFzaGVyIFMxIEUwNycsXG4gICAgICAgIGlkOiA1MyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dC4nLFxuICAgICAgICB0eXBlOiAnVmlkZW8nLFxuICAgICAgICBzZXJpZXM6ICdTbGFzaGVyJyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGVwaXNvZGU6ICc3JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9UZXJlc2EucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LCBcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU2xhc2hlciBTMSBFMDgnLFxuICAgICAgICBpZDogNTQsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQuJyxcbiAgICAgICAgdHlwZTogJ1ZpZGVvJyxcbiAgICAgICAgc2VyaWVzOiAnU2xhc2hlcicsXG4gICAgICAgIHNlYXNvbjogJzEnLFxuICAgICAgICBlcGlzb2RlOiAnOCcsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvVGVyZXNhLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1lcGlzb2RlLmh0bWwnXG4gICAgfSwgICAgIFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdTbGFzaGVyX2hlcm9fMi5wbmcnLFxuICAgICAgICBpZDogMjksXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQnJhbmRvbiBKYXkgTWNMYXJlbiAoR3JhY2VsYW5kKSBzdGFycyBhcyBEeWxhbi4nLFxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICBzZXJpZXM6ICdTbGFzaGVyJyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvQWxleC5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXJfaGVyb18zLnBuZycsXG4gICAgICAgIGlkOiAzMCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdXZW5keSBDcmV3c29uIChSZXZlbmdlKSBzdGFycyBhcyBCcmVuZGEgTWVycml0dC4nLFxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICBzZXJpZXM6ICdTbGFzaGVyJyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9henRlY190ZW1wbGUucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdTbGFzaGVyLXNuZWFrcGVlaycsXG4gICAgICAgIGlkOiAzMSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdTbGFzaGVyLXNuZWFrcGVlayB2aWRlbyBmb3Igc2VyaWVzIHByZW1pZXJlLicsXG4gICAgICAgIHR5cGU6ICd2aWRlbycsXG4gICAgICAgIHNlcmllczogJ1NsYXNoZXInLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgZXBpc29kZTogJzEnLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL0dhcnJ5LnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1lcGlzb2RlLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU2xhc2hlci1jYXN0JyxcbiAgICAgICAgaWQ6IDMyLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0Nhc3QgY29sbGVjdGlvbiBmb3IgU2xhc2hlciBzZWFzb24gMS4nLFxuICAgICAgICB0eXBlOiAnY2FzdCcsXG4gICAgICAgIHNlcmllczogJ1NsYXNoZXInLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgaW1nOiAnJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWdhbGxlcnkuaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdTbGFzaGVyLXByZXZpZXctZ2FsbGVyeScsXG4gICAgICAgIGlkOiAzMyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdQaG90byBmcm9tIHRoZSBlcGlzb2RlIHNlcmllcyBwcmVtaWVyZS4nLFxuICAgICAgICB0eXBlOiAnZ2FsbGVyeScsXG4gICAgICAgIHNlcmllczogJ1NsYXNoZXInLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgZXBpc29kZTogJzEnLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL3B5cmFtaWRzLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1nYWxsZXJ5Lmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU2xhc2hlci10cmFpbGVyJyxcbiAgICAgICAgaWQ6IDM0LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1NsYXNoZXI6IE5ldyBTZXJpZXMgQ29taW5nIFNvb24nLFxuICAgICAgICB0eXBlOiAndmlkZW8nLFxuICAgICAgICBzZXJpZXM6ICdTbGFzaGVyJyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvZWFzdGVyX2lzbGFuZF8yLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1lcGlzb2RlLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU2xhc2hlciAtIEVwaXNvZGUgMicsXG4gICAgICAgIGlkOiAzNSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdTZWUgYSBzbmVhayBwcmV2aWV3IG9mIG5leHQgd2Vla3MgZXBpc29kZScsXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXG4gICAgICAgIHNlcmllczogJ1NsYXNoZXInLFxuICAgICAgICBzZWFzb246ICcxJyxcbiAgICAgICAgZXBpc29kZTogJzInLFxuICAgICAgICBpbWc6ICdpbWcvZG9vZGxlL1RlcmVzYS5wbmcnLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtZXBpc29kZS5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXIgLSBNZWV0IFRoZSBDYXN0JyxcbiAgICAgICAgaWQ6IDM2LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1NlZSBicmFuZCBuZXcgdmlkZW9zIG9mIHRoZSBmdWxsIFNsYXNoZXIgY2FzdCBiZWhpbmQgdGhlIHNjZW5lcyEnLFxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICBzZXJpZXM6ICdTbGFzaGVyJyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGltZzogJ2ltZy9kb29kbGUvVGVyZXNhLnBuZycsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1lcGlzb2RlLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU2xhc2hlciAtIEVwaXNvZGUgNCcsXG4gICAgICAgIGlkOiAzNyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdXYXRjaCB0aGUgbGF0ZXN0IGVwaXNvZGUgb2YgU2xhc2hlciBvbiB5b3VyIGNvbXB1dGVyIGFuZCBtb2JpbGUgZGV2aWNlcy4nLFxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICBzZXJpZXM6ICdTbGFzaGVyJyxcbiAgICAgICAgc2Vhc29uOiAnMScsXG4gICAgICAgIGVwaXNvZGU6ICc0JyxcbiAgICAgICAgaW1nOiAnaW1nL2Rvb2RsZS9UZXJlc2EucG5nJyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWVwaXNvZGUuaHRtbCdcbiAgICB9XG5dO1xuXG5cbnZhciBjb2xsZWN0aW9ucyA9IFtcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnQmxpbmRzcG90IOKAlCBoZWFkZXIgMScsXG4gICAgICAgIGlkOiAxMDEsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSGVhZGVyIGltYWdlcyBmb3IgQmxpbmRzcG90JyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDMsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnQmxpbmRzcG90IOKAlCBtaWRkbGUgcGFnZScsXG4gICAgICAgIGlkOiAxMDIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnTWlkZGxlIHBhcnQgY29sbGVjdGlvbiBmb3IgQmxpbmRzcG90IHNlcmllcycsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiA4LFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0JsaW5kc3BvdCDigJQgaGVybyBjb2xsZWN0aW9uJyxcbiAgICAgICAgaWQ6IDEwMyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdUaGlzIGlzIHRoZSBjb2xsZWN0aW9uIGZvciBoZXJvIGNhcm91c2VsIGZvciBCbGluZHNwb3QnLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogNCxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdCbGluZHNwb3Qg4oCUIGhlcm8gY29sbGVjdGlvbiAtIDInLFxuICAgICAgICBpZDogMTA0LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgdGhlIGNvbGxlY3Rpb24gZm9yIGhlcm8gY2Fyb3VzZWwgZm9yIEJsaW5kc3BvdCAjMicsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiAyLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0JsaW5kc3BvdCDigJQgaGVybyBjb2xsZWN0aW9uIC0gMycsXG4gICAgICAgIGlkOiAxMDUsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyB0aGUgY29sbGVjdGlvbiBmb3IgaGVybyBjYXJvdXNlbCBmb3IgQmxpbmRzcG90ICMzJyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDgsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU2xhc2hlciBIZXJvIENhcm91c2VsJyxcbiAgICAgICAgaWQ6IDEwNixcbiAgICAgICAgZGVzY3JpcHRpb246ICcgQSBjYXJvdXNlbCBvZiAzIGltYWdlcyBmb3IgU2xhc2hlcuKAmXMgaGVybyBzcG90LicsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1NsYXNoZXIgQm9keSBjb250ZW50JyxcbiAgICAgICAgaWQ6IDEwNyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdBIGN1cmF0ZWQgY29sbGVjdGlvbiBmb3IgcHJvbW90ZWQgY29udGVudHMgb24gdGhlIG1haW4gcGFnZSBvZiBTbGFzaGVyLicsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiA0LFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0phbmVcXCdzIHRhdHRvbyBiYWNrc3RvcnknLFxuICAgICAgICBpZDogMTA4LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbGxlY3Rpb24gb2YgdmlkZW9zIHdpdGggSmFuZVxcJ3MgdGF0dG9vcy4nLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogNCxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdJbnNpZGUgVGhlIEV4cGFuc2U6IEVwaXNvZGUgOCcsXG4gICAgICAgIGlkOiAxMDksXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGNhc3QgYW5kIHNob3dydW5uZXJzIHRhbGsgU2Vhc29uIDEsIEVwaXNvZGUgOC4nLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogNixcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdJbnNpZGUgdGhlIEV4cGFuc2U6IEVwaXNvZGUgNycsXG4gICAgICAgIGlkOiAxMTAsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGNhc3QgYW5kIHNob3dydW5uZXJzIHRhbGsgU2Vhc29uIDEsIEVwaXNvZGUgNy4nLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogNixcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdJbnNpZGUgdGhlIEV4cGFuc2U6IEVwaXNvZGUgNicsXG4gICAgICAgIGlkOiAxMTEsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGNhc3QgYW5kIHNob3dydW5uZXJzIHRhbGsgU2Vhc29uIDEsIEVwaXNvZGUgNi4nLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogNixcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdNYWdpY2lhbnMgSGVybycsXG4gICAgICAgIGlkOiAxMTIsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ01hZ2ljaWFucyBiYWNrc3RhZ2UnLFxuICAgICAgICBpZDogMTEzLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ01hZ2ljaWFucyBiYWNrc3RhZ2UgcGhvdG9zLCBjYXN0IHRhbGtzIGFuZCB2aWRlb3MuJyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDEwLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0JpdHRlbiBTZXJpZXMgSGVybycsXG4gICAgICAgIGlkOiAxMTQsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0JpdHRlbiBTZWFzb24gMyBIZXJvJyxcbiAgICAgICAgaWQ6IDExNSxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDMsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnQml0dGVuIFNlYXNvbiAzIGZvb3RlcicsXG4gICAgICAgIGlkOiAxMTYsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiA4LFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0JpdHRlbiBTZWFzb24gMiBIZXJvJyxcbiAgICAgICAgaWQ6IDExNyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDMsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnQml0dGVuIFNlYXNvbiAyIGZvb3RlcicsXG4gICAgICAgIGlkOiAxMTgsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiA4LFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0JpdHRlbiBTZWFzb24gMSBIZXJvJyxcbiAgICAgICAgaWQ6IDExOSxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDMsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnQml0dGVuIFNlYXNvbiAxIGZvb3RlcicsXG4gICAgICAgIGlkOiAxMTksXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiA4LFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG5cbiAgICAvLyBIYXZlblxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdIYXZlbiBTZXJpZXMgSGVybycsXG4gICAgICAgIGlkOiAxMjAsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0hhdmVuIFNlYXNvbiA1IEhlcm8nLFxuICAgICAgICBpZDogMTIxLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogMyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdIYXZlbiBTZWFzb24gNSBsZWZ0IHNpZGUnLFxuICAgICAgICBpZDogMTIyLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogNSxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdIYXZlbiBTZWFzb24gNCBIZXJvJyxcbiAgICAgICAgaWQ6IDEyMyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDMsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnSGF2ZW4gU2Vhc29uIDQgbGVmdCBzaWRlJyxcbiAgICAgICAgaWQ6IDEyNCxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDYsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnSGF2ZW4gU2Vhc29uIDMgSGVybycsXG4gICAgICAgIGlkOiAxMjUsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0hhdmVuIFNlYXNvbiAzIGxlZnQgc2lkZScsXG4gICAgICAgIGlkOiAxMjYsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uJyxcbiAgICAgICAgYXNzZXRzOiA0LFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtY29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0hhdmVuIFNlYXNvbiAyIEhlcm8nLFxuICAgICAgICBpZDogMTI3LFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogMyxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdIYXZlbiBTZWFzb24gMiBsZWZ0IHNpZGUnLFxuICAgICAgICBpZDogMTI4LFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbicsXG4gICAgICAgIGFzc2V0czogNSxcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLWNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdIYXZlbiBTZWFzb24gMSBIZXJvJyxcbiAgICAgICAgaWQ6IDEyOSxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDMsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnSGF2ZW4gU2Vhc29uIDEgbGVmdCBzaWRlJyxcbiAgICAgICAgaWQ6IDEzMCxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24nLFxuICAgICAgICBhc3NldHM6IDQsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1jb2xsZWN0aW9uLmh0bWwnXG4gICAgfVxuXTtcblxudmFyIHBhZ2VDb2xsZWN0aW9ucyA9IFtcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnQmxpbmRzcG90IFNlcmllcyBQYWdlJyxcbiAgICAgICAgaWQ6IDEwMDEsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQ29sbGVjdGlvbiBmb3IgQmxpbmRzcG90XFwnIHNlcmllcyBwYWdlOiBoZXJvLCBsZWZ0LXNpZGUgYW5kIGZvb3RlcicsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uIGdyb3VwJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtbWFzdGVyQ29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0JsaW5kc3BvdCBTZWFzb24gUGFnZScsXG4gICAgICAgIGlkOiAxMDAyLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbGxlY3Rpb24gZm9yIEJsaW5kc3BvdFxcJyBzZWFzb24gcGFnZTogaGVybyBhbmQgZm9vdGVyLicsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uIGdyb3VwJyxcbiAgICAgICAgYXNzZXRzOiAyLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtbWFzdGVyQ29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ1RoZSBCbGFja2xpc3QgU2VyaWVzIFBhZ2UnLFxuICAgICAgICBpZDogMTAwMyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdDb2xsZWN0aW9uIGZvciBUaGUgQmxhY2tsaXN0XFwnIHNlcmllcyBwYWdlOiBoZXJvIGFuZCBsZWZ0LXNpZGUuJyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24gZ3JvdXAnLFxuICAgICAgICBhc3NldHM6IDIsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1tYXN0ZXJDb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnVGhlIEJsYWNrbGlzdCBFcGlzb2RlIFBhZ2UnLFxuICAgICAgICBpZDogMTAwNCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdDb2xsZWN0aW9uIGZvciBUaGUgQmxhY2tsaXN0XFwnIGVwaXNvZGUgcGFnZTogaGVybywgbGVmdC1zaWRlIGFuZCBmb290ZXIuJyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24gZ3JvdXAnLFxuICAgICAgICBhc3NldHM6IDMsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1tYXN0ZXJDb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU2xhc2hlciBQYWdlJyxcbiAgICAgICAgaWQ6IDEwMDUsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQ29sbGVjdGlvbiBmb3IgU2xhc2hlcuKAmXMgc2VyaWVzIG1haW4gcGFnZS4nLFxuICAgICAgICB0eXBlOiAnY29sbGVjdGlvbiBncm91cCcsXG4gICAgICAgIGFzc2V0czogMixcbiAgICAgICAgdGFyZ2V0OiAnY3JlYXRlLW1hc3RlckNvbGxlY3Rpb24uaHRtbCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICdIYXZlbiBQYWdlJyxcbiAgICAgICAgaWQ6IDEwMDYsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQ29sbGVjdGlvbiBmb3IgSGF2ZW5cXCdzIHNlcmllcyBtYWluIHBhZ2UuJyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24gZ3JvdXAnLFxuICAgICAgICBhc3NldHM6IDMsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1tYXN0ZXJDb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnSGF2ZW4gRXBpc29kZSBQYWdlJyxcbiAgICAgICAgaWQ6IDEwMDcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQ29sbGVjdGlvbiBmb3IgSGF2ZW5cXCcgZXBpc29kZSBwYWdlJyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24gZ3JvdXAnLFxuICAgICAgICBhc3NldHM6IDQsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1tYXN0ZXJDb2xsZWN0aW9uLmh0bWwnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAnU3VpdHMgUGFnZScsXG4gICAgICAgIGlkOiAxMDA4LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbGxlY3Rpb24gZm9yIFN1aXRzXFwncyBzZXJpZXMgbWFpbiBwYWdlLicsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uIGdyb3VwJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtbWFzdGVyQ29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0NvbG9ueSBQYWdlJyxcbiAgICAgICAgaWQ6IDEwMDksXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQ29sbGVjdGlvbiBmb3IgQ29sb255XFwncyBzZXJpZXMgbWFpbiBwYWdlLicsXG4gICAgICAgIHR5cGU6ICdjb2xsZWN0aW9uIGdyb3VwJyxcbiAgICAgICAgYXNzZXRzOiAzLFxuICAgICAgICB0YXJnZXQ6ICdjcmVhdGUtbWFzdGVyQ29sbGVjdGlvbi5odG1sJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ0dpcmxmcmllbmRzIEd1aWRlIHRvIERpdm9yY2UgUGFnZScsXG4gICAgICAgIGlkOiAxMDEwLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbGxlY3Rpb24gZm9yIEdpcmxmcmllbmRzIEd1aWRlIHRvIERpdm9yY2VcXCdzIHNlcmllcyBtYWluIHBhZ2UuJyxcbiAgICAgICAgdHlwZTogJ2NvbGxlY3Rpb24gZ3JvdXAnLFxuICAgICAgICBhc3NldHM6IDMsXG4gICAgICAgIHRhcmdldDogJ2NyZWF0ZS1tYXN0ZXJDb2xsZWN0aW9uLmh0bWwnXG4gICAgfVxuXTtcblxuZnVuY3Rpb24gY3JlYXRlSXRlbVJvdyhjKSB7XG4gICAgdmFyIGl0ZW1Sb3cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjZ19fY29udHJvbHMgY2dfX2NvbnRyb2xzX3N0eWxlX3JvdycpLFxuICAgICAgICBpdGVtV3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NnX19jb250cm9sIGNnX19jb250cm9sX3N0eWxlX3JvdycpLFxuICAgICAgICBpdGVtU2VsZWN0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtc2VsZWN0Ym94Jyk7XG5cbiAgICBpdGVtV3JhcHBlci5hcHBlbmQoaXRlbVNlbGVjdCk7XG4gICAgaXRlbVJvdy5hcHBlbmQoaXRlbVdyYXBwZXIpO1xuICAgIHZhciBjb2xsZWN0aW9uU2VsZWN0SXRlbSA9IGl0ZW1Db21wbGV4U2VsZWN0Ym94KGl0ZW1TZWxlY3QuZ2V0KDApKTtcbiAgICByZXR1cm4gaXRlbVJvdztcbn1cblxuZnVuY3Rpb24gaXRlbUNvbXBsZXhTZWxlY3Rib3goZWwsIGRhdGEsIGNhbGxiYWNrLCBpdGVtTGFiZWwpIHtcbiAgICB2YXIgaXRlbXNEYXRhID0gZGF0YSB8fCBjb2xsZWN0aW9uSXRlbXMsXG4gICAgICAgIGl0ZW1DYWxsYmFjayA9IGNhbGxiYWNrIHx8IGhhbmRsZUl0ZW1tQ2xpY2s7XG5cbiAgICByZXR1cm4gbmV3IENvbXBsZXhTZWxlY3Rib3goZWwsIHtcbiAgICAgICAgbGFiZWw6IGl0ZW1MYWJlbCB8fCAnSXRlbScsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBpdGVtTGFiZWwgPyAnU2VsZWN0ICcgKyBpdGVtTGFiZWwgOiAnU2VsZWN0IEl0ZW0nLFxuICAgICAgICBpdGVtczogaXRlbXNEYXRhXG4gICAgICAgICAgICAuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEudGl0bGUgPiBiLnRpdGxlID8gMSA6IGEudGl0bGUgPCBiLnRpdGxlID8gLTEgOiAwO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5tYXAoY3JlYXRlTGlzdEl0ZW0pLFxuICAgICAgICBjb21wbGV4SXRlbXM6IHRydWUsXG4gICAgICAgIHNpZGVOYXY6IHRydWUsXG4gICAgICAgIGl0ZW1DYWxsYmFjazogaXRlbUNhbGxiYWNrLFxuICAgICAgICBkYXRhOiBpdGVtc0RhdGEsXG4gICAgICAgIHNlYXJjaDogdHJ1ZVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVJdGVtbUNsaWNrKGl0ZW0sIHNlbGVjdGJveCkge1xuICAgIHZhciBpZCA9IHBhcnNlSW50KCQoaXRlbSkuZmluZCgnLnNlbGVjdGJveF9fbGlzdC1pdGVtLXRpdGxlJykuYXR0cignaWQnKS5zcGxpdCgnLScpWzFdKSxcbiAgICAgICAgZGF0YSA9IHNlbGVjdGJveC5vcHRpb25zLmRhdGEgfHwgY29sbGVjdGlvbkl0ZW1zO1xuICAgIHZhciBjb2xsZWN0aW9uSXRlbSA9IGNyZWF0ZUNvbGxlY3Rpb25JdGVtKGRhdGEuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLmlkID09PSBpZDtcbiAgICAgICAgfSlbMF0pO1xuICAgIHZhciBhZGRhYmxlSXRlbSA9ICQoc2VsZWN0Ym94LnNlbGVjdFdyYXBwZXIpLnBhcmVudHMoJy5jLUFkZGFibGUtaXRlbScpO1xuICAgIGFkZGFibGVJdGVtLmVtcHR5KCkuYXBwZW5kKGNvbGxlY3Rpb25JdGVtKTtcbiAgICBjb2xsZWN0aW9uSXRlbS5wYXJlbnRzKCcuYy1BZGRhYmxlLXJvdycpLmFkZENsYXNzKCdjLUFkZGFibGUtcm93LS1jb2xsZWN0aW9uJyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbGxlY3Rpb25JdGVtKGl0ZW0pIHtcbiAgICB2YXIgY29sbEl0ZW0gPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjb2xsZWN0aW9uLWl0ZW0gaXMtYXBwZWFyaW5nIGpzLWhhc1ZhbHVlJyksXG4gICAgICAgIGNvbGxJdGVtV3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NvbGxlY3Rpb24taXRlbV9fd3JhcHBlcicpLFxuICAgICAgICAvL2NvbGxJdGVtSW1hZ2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjb2xsZWN0aW9uLWl0ZW1fX2ltYWdlIGlzLWVtcHR5JyksXG4gICAgICAgIGNvbGxJdGVtVGl0bGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjb2xsZWN0aW9uLWl0ZW1fX3RpdGxlJykudGV4dChpdGVtLnRpdGxlKSxcbiAgICAgICAgaXRlbUluZm8gPSBpdGVtLnR5cGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBpdGVtLnR5cGUuc2xpY2UoMSksXG4gICAgICAgIGNvbGxJdGVtSW5mbyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NvbGxlY3Rpb24taXRlbV9faW5mbycpLFxuICAgICAgICBjb2xsSXRlbURlc2NyaXB0aW9uID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY29sbGVjdGlvbi1pdGVtX19kZXNjcmlwdGlvbicpLFxuICAgICAgICBjb2xsSXRlbUVkaXRCdXR0b24gPSAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtZ3JheSBjb2xsZWN0aW9uLWl0ZW1fX2VkaXQnKS50ZXh0KCdFZGl0Jyk7XG5cbiAgICAvKmlmIChpdGVtLmltZykge1xuICAgICAgICBjb2xsSXRlbUltYWdlLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIGl0ZW0uaW1nICsgJyknKS5yZW1vdmVDbGFzcygnaXMtZW1wdHknKTtcbiAgICB9Ki9cbiAgICAvKnN3aXRjaCAoaXRlbS50eXBlKSB7XG4gICAgICAgIGNhc2UgJ3ZpZGVvJzpcbiAgICAgICAgICAgIGNvbGxJdGVtVHlwZUljb24gPSAkKCc8ZGl2PjxpIGNsYXNzPVwiZmEgZmEtdmlkZW8tY2FtZXJhXCI+PC9pPjwvZGl2PicpLmFkZENsYXNzKCdjb2xsZWN0aW9uLWl0ZW1fX3R5cGUnKTtcbiAgICAgICAgICAgIGNvbGxJdGVtSW1hZ2UuYXBwZW5kKGNvbGxJdGVtVHlwZUljb24pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2dhbGxlcnknOlxuICAgICAgICAgICAgY29sbEl0ZW1UeXBlSWNvbiA9ICQoJzxkaXY+PGkgY2xhc3M9XCJmYSBmYS1waWN0dXJlLW9cIj48L2k+PC9kaXY+JykuYWRkQ2xhc3MoJ2NvbGxlY3Rpb24taXRlbV9fdHlwZScpO1xuICAgICAgICAgICAgY29sbEl0ZW1JbWFnZS5hcHBlbmQoY29sbEl0ZW1UeXBlSWNvbik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZXBpc29kZSc6XG4gICAgICAgICAgICBjb2xsSXRlbVR5cGVJY29uID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY29sbGVjdGlvbi1pdGVtX190eXBlIGNvbGxlY3Rpb24taXRlbV9fdHlwZS0taW1hZ2UgY29sbGVjdGlvbi1pdGVtX190eXBlLS1lcGlzb2RlJyk7XG4gICAgICAgICAgICBjb2xsSXRlbUltYWdlLmFwcGVuZChjb2xsSXRlbVR5cGVJY29uKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2Nhc3QnOlxuICAgICAgICAgICAgY29sbEl0ZW1UeXBlSWNvbiA9ICQoJzxkaXY+PGkgY2xhc3M9XCJmYSBmYS11c2Vyc1wiPjwvaT48L2Rpdj4nKS5hZGRDbGFzcygnY29sbGVjdGlvbi1pdGVtX190eXBlJyk7XG4gICAgICAgICAgICBjb2xsSXRlbUltYWdlLmFwcGVuZChjb2xsSXRlbVR5cGVJY29uKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2NvbGxlY3Rpb24nOlxuICAgICAgICAgICAgY29sbEl0ZW1JbWFnZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmIChpdGVtLmFzc2V0cykge2l0ZW1JbmZvID0gaXRlbUluZm8gKyAnIHwgJyArIGl0ZW0uYXNzZXRzLnRvU3RyaW5nKCkgKyAnIGFzc2V0cyc7fVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnY29sbGVjdGlvbiBncm91cCc6XG4gICAgICAgICAgICBjb2xsSXRlbUltYWdlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKGl0ZW0uYXNzZXRzKSB7aXRlbUluZm8gPSBpdGVtSW5mbyArICcgfCAnICsgaXRlbS5hc3NldHMudG9TdHJpbmcoKSArICcgY29sbGVjdGlvbnMnO31cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgY29sbEl0ZW0uYXBwZW5kKGNvbGxJdGVtSW1hZ2UpOyovXG5cbiAgICBjb2xsSXRlbVdyYXBwZXIuYXBwZW5kKGNvbGxJdGVtVGl0bGUpO1xuXG4gICAgLyppZiAoaXRlbS5kZXNjcmlwdGlvbikge1xuICAgICAgICBjb2xsSXRlbURlc2NyaXB0aW9uLnRleHQoaXRlbS5kZXNjcmlwdGlvbik7XG4gICAgICAgIGNvbGxJdGVtV3JhcHBlci5hcHBlbmQoY29sbEl0ZW1EZXNjcmlwdGlvbik7XG4gICAgfSovXG5cbiAgICAvKmlmIChpdGVtLnN1YnR5cGUpIHtcbiAgICAgICAgaXRlbUluZm8gPSBpdGVtSW5mbyArICcgKCcgKyBpdGVtLnN1YnR5cGUgKyAnKSc7XG4gICAgfVxuICAgIGlmIChpdGVtLnNlcmllcykge1xuICAgICAgICBpdGVtSW5mbyA9IGl0ZW1JbmZvICsgJyB8ICcgKyBpdGVtLnNlcmllcztcbiAgICB9Ki9cbiAgICBjb2xsSXRlbUluZm8udGV4dChpdGVtSW5mbyk7XG4gICAgY29sbEl0ZW1XcmFwcGVyLmFwcGVuZChjb2xsSXRlbUluZm8pO1xuICAgIGNvbGxJdGVtLmFwcGVuZChjb2xsSXRlbVdyYXBwZXIpO1xuXG4gICAgLyppZiAoaXRlbS50YXJnZXQpIHtcbiAgICAgICAgY29sbEl0ZW1FZGl0QnV0dG9uLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKGl0ZW0udGFyZ2V0LCdfYmxhbmsnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbGxJdGVtLmFwcGVuZChjb2xsSXRlbUVkaXRCdXR0b24pO1xuICAgIH0qL1xuXG4gICAgcmV0dXJuIGNvbGxJdGVtO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaXN0SXRlbShpdGVtKSB7XG4gICAgdmFyIGxpc3RJdGVtID0gJCgnPGRpdj48L2Rpdj4nKSxcbiAgICAgICAgaXRlbVN1YnRpdGxlID0gaXRlbS50eXBlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgaXRlbS50eXBlLnNsaWNlKDEpLFxuICAgICAgICBsaXN0SXRlbVRpdGxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWl0ZW0tdGl0bGUnKS50ZXh0KGl0ZW0udGl0bGUpLmF0dHIoJ2lkJywgJ2NvbGxlY3Rpb25JdGVtLScgKyBpdGVtLmlkKSxcbiAgICAgICAgbGlzdEl0ZW1TdWJ0aXRsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1pdGVtLXN1YnRpdGxlJyksXG4gICAgICAgIGxpc3RJdGVtVHlwZUljb247XG5cbiAgICAvKnN3aXRjaCAoaXRlbS50eXBlKSB7XG4gICAgICAgIGNhc2UgJ3ZpZGVvJzpcbiAgICAgICAgICAgIGxpc3RJdGVtVHlwZUljb24gPSAkKCc8ZGl2PjxpIGNsYXNzPVwiZmEgZmEtdmlkZW8tY2FtZXJhXCI+PC9pPjwvZGl2PicpLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtaXRlbS10eXBlJyk7XG4gICAgICAgICAgICBsaXN0SXRlbS5hcHBlbmQobGlzdEl0ZW1UeXBlSWNvbik7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdnYWxsZXJ5JzpcbiAgICAgICAgICAgIGxpc3RJdGVtVHlwZUljb24gPSAkKCc8ZGl2PjxpIGNsYXNzPVwiZmEgZmEtcGljdHVyZS1vXCI+PC9pPjwvZGl2PicpLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtaXRlbS10eXBlJyk7XG4gICAgICAgICAgICBsaXN0SXRlbS5hcHBlbmQobGlzdEl0ZW1UeXBlSWNvbik7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdlcGlzb2RlJzpcbiAgICAgICAgICAgIGxpc3RJdGVtVHlwZUljb24gPSAkKCc8ZGl2PjxpIGNsYXNzPVwiZmEgZmEtZmlsZS12aWRlby1vXCI+PC9pPjwvZGl2PicpLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtaXRlbS10eXBlJyk7XG4gICAgICAgICAgICBsaXN0SXRlbS5hcHBlbmQobGlzdEl0ZW1UeXBlSWNvbik7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdpbWFnZSc6XG4gICAgICAgICAgICBsaXN0SXRlbVR5cGVJY29uID0gJCgnPGRpdj48aSBjbGFzcz1cImZhIGZhLWNhbWVyYVwiPjwvaT48L2Rpdj4nKS5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWl0ZW0tdHlwZScpO1xuICAgICAgICAgICAgbGlzdEl0ZW0uYXBwZW5kKGxpc3RJdGVtVHlwZUljb24pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnY2FzdCc6XG4gICAgICAgICAgICBsaXN0SXRlbVR5cGVJY29uID0gJCgnPGRpdj48aSBjbGFzcz1cImZhIGZhLXVzZXJzXCI+PC9pPjwvZGl2PicpLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtaXRlbS10eXBlJyk7XG4gICAgICAgICAgICBsaXN0SXRlbS5hcHBlbmQobGlzdEl0ZW1UeXBlSWNvbik7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfSovXG5cbiAgICAvKmlmIChpdGVtLnN1YnR5cGUpIHtcbiAgICAgICAgaXRlbVN1YnRpdGxlID0gaXRlbVN1YnRpdGxlICsgJyAoJyArIGl0ZW0uc3VidHlwZSArICcpJztcbiAgICB9Ki9cbiAgICAvKmlmIChpdGVtLnNlcmllcykge1xuICAgICAgICBpdGVtU3VidGl0bGUgPSBpdGVtU3VidGl0bGUgKyAnIHwgJyArIGl0ZW0uc2VyaWVzO1xuICAgIH1cbiAgICBpZiAoaXRlbS5hc3NldHMpIHtcbiAgICAgICAgaXRlbVN1YnRpdGxlID0gaXRlbVN1YnRpdGxlICsgJyB8ICcgKyBpdGVtLmFzc2V0cy50b1N0cmluZygpO1xuICAgICAgICBpZiAoaXRlbS50eXBlID09PSAnY29sbGVjdGlvbiBncm91cCcpIHtpdGVtU3VidGl0bGUgPSBpdGVtU3VidGl0bGUgKyAnIGNvbGxlY3Rpb25zJzt9XG4gICAgICAgIGVsc2Uge2l0ZW1TdWJ0aXRsZSA9IGl0ZW1TdWJ0aXRsZSArICcgYXNzZXRzJzt9XG4gICAgfSovXG4gICAgbGlzdEl0ZW1TdWJ0aXRsZS50ZXh0KGl0ZW1TdWJ0aXRsZSk7XG4gICAgbGlzdEl0ZW0uYXBwZW5kKGxpc3RJdGVtVGl0bGUsIGxpc3RJdGVtU3VidGl0bGUpO1xuXG5cblxuICAgIC8qaWYgKGl0ZW0uaW1nKSB7XG4gICAgICAgIHZhciBsaXN0SXRlbUltYWdlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWl0ZW0taW1hZ2UnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyBpdGVtLmltZyArICcpJyk7XG5cblxuXG4gICAgICAgIGxpc3RJdGVtLmFwcGVuZChsaXN0SXRlbUltYWdlKTtcbiAgICB9Ki9cblxuICAgIHJldHVybiBsaXN0SXRlbS5nZXQoMCkuaW5uZXJIVE1MO1xufVxuXG5mdW5jdGlvbiBpbml0Q29sbFNlY3Rpb24oc2VjdGlvbiwgZGF0YSwgaXRlbUxhYmVsKSB7XG4gICAgZnVuY3Rpb24gYmVmb3JlQWRkQ29sbGVjdGlvbihlbCkge1xuICAgICAgICB2YXIgY29sbGVjdGlvblNlbGVjdEl0ZW0gPSBpdGVtQ29tcGxleFNlbGVjdGJveChlbC5maW5kKCcuanMtc2VsZWN0Ym94JykuZ2V0KDApLCBkYXRhLCBudWxsLCBpdGVtTGFiZWwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUVtcHR5Q29sbFJvdyAoKSB7XG4gICAgICAgIHZhciBpdGVtUm93ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2xzIGNnX19jb250cm9sc19zdHlsZV9yb3cnKSxcbiAgICAgICAgICAgIGl0ZW1XcmFwcGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2wgY2dfX2NvbnRyb2xfc3R5bGVfcm93JyksXG4gICAgICAgICAgICBpdGVtU2VsZWN0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtc2VsZWN0Ym94Jyk7XG5cbiAgICAgICAgICAgIGl0ZW1XcmFwcGVyLmFwcGVuZChpdGVtU2VsZWN0KTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtUm93LmFwcGVuZChpdGVtV3JhcHBlcik7XG4gICAgfVxuXG4gICAgdmFyIGNvbGxSb3cgPSBjcmVhdGVFbXB0eUNvbGxSb3coKTtcbiAgICBzZWN0aW9uLmFwcGVuZChjb2xsUm93KTtcbiAgICB2YXIgYWRkYWJsZU9iamVjdCA9IG5ldyBBZGRhYmxlKGNvbGxSb3csIHtiZWZvcmVBZGQ6IGJlZm9yZUFkZENvbGxlY3Rpb24sIHBsYWNlaG9sZGVyOiAnYy1BZGRhYmxlLXJvd1BsYWNlaG9sZGVyLS1jb2xsZWN0aW9uJywgc29ydGFibGU6IHRydWV9KTtcbiAgICBhZGRhYmxlT2JqZWN0LnJlbW92ZUl0ZW0oMCk7XG4gICAgYWRkYWJsZU9iamVjdC5fYWRkSXRlbShjcmVhdGVFbXB0eUNvbGxSb3coKSwgYmVmb3JlQWRkQ29sbGVjdGlvbik7XG5cbiAgICByZXR1cm4gYWRkYWJsZU9iamVjdDtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZUNvbXBsZXhTZWxlY3Rib3hXaXRoQ29sbGVjdGlvblJvdyhpdGVtLCBzZWxlY3Rib3gpIHtcbiAgICB2YXIgaWQgPSBwYXJzZUludCgkKGl0ZW0pLmZpbmQoJy5zZWxlY3Rib3hfX2xpc3QtaXRlbS10aXRsZScpLmF0dHIoJ2lkJykuc3BsaXQoJy0nKVsxXSksXG4gICAgICAgIGRhdGEgPSBzZWxlY3Rib3gub3B0aW9ucy5kYXRhIHx8IGNvbGxlY3Rpb25JdGVtcyxcbiAgICAgICAgY29sbGVjdGlvbkl0ZW0gPSBjcmVhdGVDb2xsZWN0aW9uSXRlbShkYXRhLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5pZCA9PT0gaWQ7XG4gICAgICAgIH0pWzBdKTtcblxuICAgIC8vQ3JlYXRlIERPTSBlbGVtZW50c1xuICAgIHZhciBjb2xsZWN0aW9uUm93ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY29sbGVjdGlvbi1yb3cganMtY29sbGVjdGlvblJvdycpLFxuICAgICAgICBjb2xsZWN0aW9uSXRlbVdyYXBwZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjb2xsZWN0aW9uLXJvd19faXRlbS13cmFwcGVyJyksXG4gICAgICAgIGNvbGxlY3Rpb25SZW1vdmVCdXR0b24gPSAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24tLXJvdW5kIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXkgYnV0dG9uLS1yZW1vdmUgY29sbGVjdGlvbi1yb3dfX2J1dHRvbiBqcy1jb2xsZWN0aW9uUmVtb3ZlQnV0dG9uJykuY2xpY2soaGFuZGxlUmVtb3ZlQ29sbGVjdGlvblJvdyk7XG5cbiAgICBjb2xsZWN0aW9uSXRlbVdyYXBwZXIuYXBwZW5kKGNvbGxlY3Rpb25JdGVtKTtcbiAgICBjb2xsZWN0aW9uUm93LmFwcGVuZChjb2xsZWN0aW9uSXRlbVdyYXBwZXIsIGNvbGxlY3Rpb25SZW1vdmVCdXR0b24pO1xuXG4gICAgLy9JbnNlcnQgbmV3IGVsZW1lbnRzIGluIERPTSBhbmQgcmVtb3ZlIGxpc3RcbiAgICBjb2xsZWN0aW9uUm93Lmluc2VydEJlZm9yZShzZWxlY3Rib3guc2VsZWN0V3JhcHBlcik7XG4gICAgc2VsZWN0Ym94LnNlbGVjdFdyYXBwZXIucmVtb3ZlKCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJlbW92ZUNvbGxlY3Rpb25Sb3coZSkge1xuICAgIHZhciBjb2xsZWN0aW9uUm93ID0gJChlLnRhcmdldCkucGFyZW50cygnLmpzLWNvbGxlY3Rpb25Sb3cnKSxcbiAgICAgICAgY29sbGVjdGlvblNlbGVjdCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLXNlbGVjdGJveCcpO1xuXG4gICAgY29sbGVjdGlvblNlbGVjdC5pbnNlcnRCZWZvcmUoY29sbGVjdGlvblJvdyk7XG4gICAgY29sbGVjdGlvblJvdy5yZW1vdmUoKTtcblxuICAgIHZhciBjb2xsZWN0aW9uU2VsZWN0SXRlbSA9IG5ldyBDb21wbGV4U2VsZWN0Ym94KGNvbGxlY3Rpb25TZWxlY3QuZ2V0KDApLCB7XG4gICAgICAgIGxhYmVsOiAnQ29sbGVjdGlvbicsXG4gICAgICAgIHBsYWNlaG9sZGVyOiAnU2VsZWN0IENvbGxlY3Rpb24nLFxuICAgICAgICBpdGVtczogcGFnZUNvbGxlY3Rpb25zXG4gICAgICAgICAgICAuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEudGl0bGUgPiBiLnRpdGxlID8gMSA6IGEudGl0bGUgPCBiLnRpdGxlID8gLTEgOiAwO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5tYXAoY3JlYXRlTGlzdEl0ZW0pLFxuICAgICAgICBjb21wbGV4SXRlbXM6IHRydWUsXG4gICAgICAgIHNpZGVOYXY6IHRydWUsXG4gICAgICAgIGl0ZW1DYWxsYmFjazogcmVwbGFjZUNvbXBsZXhTZWxlY3Rib3hXaXRoQ29sbGVjdGlvblJvdyxcbiAgICAgICAgZGF0YTogcGFnZUNvbGxlY3Rpb25zLFxuICAgICAgICBzZWFyY2g6IHRydWVcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaW5pdE9uZUNvbGxlY3Rpb25TZWN0aW9uKHNlY3Rpb24sIGRhdGEpIHtcbiAgICB2YXIgY29sbGVjdGlvblNlbGVjdCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLXNlbGVjdGJveCcpO1xuICAgIHNlY3Rpb24uYXBwZW5kKGNvbGxlY3Rpb25TZWxlY3QpO1xuXG4gICAgdmFyIGNvbGxlY3Rpb25TZWxlY3RJdGVtID0gbmV3IENvbXBsZXhTZWxlY3Rib3goY29sbGVjdGlvblNlbGVjdC5nZXQoMCksIHtcbiAgICAgICAgbGFiZWw6ICdDb2xsZWN0aW9uIEdyb3VwJyxcbiAgICAgICAgcGxhY2Vob2xkZXI6ICdTZWxlY3QgQ29sbGVjdGlvbicsXG4gICAgICAgIGl0ZW1zOiBwYWdlQ29sbGVjdGlvbnNcbiAgICAgICAgICAgIC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS50aXRsZSA+IGIudGl0bGUgPyAxIDogYS50aXRsZSA8IGIudGl0bGUgPyAtMSA6IDA7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm1hcChjcmVhdGVMaXN0SXRlbSksXG4gICAgICAgIGNvbXBsZXhJdGVtczogdHJ1ZSxcbiAgICAgICAgc2lkZU5hdjogdHJ1ZSxcbiAgICAgICAgaXRlbUNhbGxiYWNrOiByZXBsYWNlQ29tcGxleFNlbGVjdGJveFdpdGhDb2xsZWN0aW9uUm93LFxuICAgICAgICBkYXRhOiBwYWdlQ29sbGVjdGlvbnMsXG4gICAgICAgIHNlYXJjaDogdHJ1ZVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpbml0V2Vic2l0ZUNvbGxlY3Rpb25TZWN0aW9uKHNlY3Rpb24sIGRhdGEpIHtcbiAgICB2YXIgY29sbGVjdGlvblNlbGVjdCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLXNlbGVjdGJveCcpO1xuICAgIHNlY3Rpb24uYXBwZW5kKGNvbGxlY3Rpb25TZWxlY3QpO1xuXG4gICAgdmFyIGNvbGxlY3Rpb25TZWxlY3RJdGVtID0gbmV3IENvbXBsZXhTZWxlY3Rib3goY29sbGVjdGlvblNlbGVjdC5nZXQoMCksIHtcbiAgICAgICAgbGFiZWw6ICdXZWJzaXRlIENvbGxlY3Rpb24nLFxuICAgICAgICBwbGFjZWhvbGRlcjogJ1NlbGVjdCBDb2xsZWN0aW9uJyxcbiAgICAgICAgaXRlbXM6IHBhZ2VDb2xsZWN0aW9uc1xuICAgICAgICAgICAgLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLnRpdGxlID4gYi50aXRsZSA/IDEgOiBhLnRpdGxlIDwgYi50aXRsZSA/IC0xIDogMDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubWFwKGNyZWF0ZUxpc3RJdGVtKSxcbiAgICAgICAgY29tcGxleEl0ZW1zOiB0cnVlLFxuICAgICAgICBzaWRlTmF2OiB0cnVlLFxuICAgICAgICBpdGVtQ2FsbGJhY2s6IHJlcGxhY2VDb21wbGV4U2VsZWN0Ym94V2l0aENvbGxlY3Rpb25Sb3csXG4gICAgICAgIGRhdGE6IHBhZ2VDb2xsZWN0aW9ucyxcbiAgICAgICAgc2VhcmNoOiB0cnVlXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXRSb2t1Q29sbGVjdGlvblNlY3Rpb24oc2VjdGlvbiwgZGF0YSkge1xuICAgIHZhciBjb2xsZWN0aW9uU2VsZWN0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtc2VsZWN0Ym94Jyk7XG4gICAgc2VjdGlvbi5hcHBlbmQoY29sbGVjdGlvblNlbGVjdCk7XG5cbiAgICB2YXIgY29sbGVjdGlvblNlbGVjdEl0ZW0gPSBuZXcgQ29tcGxleFNlbGVjdGJveChjb2xsZWN0aW9uU2VsZWN0LmdldCgwKSwge1xuICAgICAgICBsYWJlbDogJ1Jva3UgQ29sbGVjdGlvbicsXG4gICAgICAgIHBsYWNlaG9sZGVyOiAnU2VsZWN0IENvbGxlY3Rpb24nLFxuICAgICAgICBpdGVtczogcGFnZUNvbGxlY3Rpb25zXG4gICAgICAgICAgICAuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEudGl0bGUgPiBiLnRpdGxlID8gMSA6IGEudGl0bGUgPCBiLnRpdGxlID8gLTEgOiAwO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5tYXAoY3JlYXRlTGlzdEl0ZW0pLFxuICAgICAgICBjb21wbGV4SXRlbXM6IHRydWUsXG4gICAgICAgIHNpZGVOYXY6IHRydWUsXG4gICAgICAgIGl0ZW1DYWxsYmFjazogcmVwbGFjZUNvbXBsZXhTZWxlY3Rib3hXaXRoQ29sbGVjdGlvblJvdyxcbiAgICAgICAgZGF0YTogcGFnZUNvbGxlY3Rpb25zLFxuICAgICAgICBzZWFyY2g6IHRydWVcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaW5pdEFuZHJvaWRDb2xsZWN0aW9uU2VjdGlvbihzZWN0aW9uLCBkYXRhKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25TZWxlY3QgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdqcy1zZWxlY3Rib3gnKTtcbiAgICBzZWN0aW9uLmFwcGVuZChjb2xsZWN0aW9uU2VsZWN0KTtcblxuICAgIHZhciBjb2xsZWN0aW9uU2VsZWN0SXRlbSA9IG5ldyBDb21wbGV4U2VsZWN0Ym94KGNvbGxlY3Rpb25TZWxlY3QuZ2V0KDApLCB7XG4gICAgICAgIGxhYmVsOiAnQW5kcm9pZCBDb2xsZWN0aW9uJyxcbiAgICAgICAgcGxhY2Vob2xkZXI6ICdTZWxlY3QgQ29sbGVjdGlvbicsXG4gICAgICAgIGl0ZW1zOiBwYWdlQ29sbGVjdGlvbnNcbiAgICAgICAgICAgIC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS50aXRsZSA+IGIudGl0bGUgPyAxIDogYS50aXRsZSA8IGIudGl0bGUgPyAtMSA6IDA7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm1hcChjcmVhdGVMaXN0SXRlbSksXG4gICAgICAgIGNvbXBsZXhJdGVtczogdHJ1ZSxcbiAgICAgICAgc2lkZU5hdjogdHJ1ZSxcbiAgICAgICAgaXRlbUNhbGxiYWNrOiByZXBsYWNlQ29tcGxleFNlbGVjdGJveFdpdGhDb2xsZWN0aW9uUm93LFxuICAgICAgICBkYXRhOiBwYWdlQ29sbGVjdGlvbnMsXG4gICAgICAgIHNlYXJjaDogdHJ1ZVxuICAgIH0pO1xufVxuXG4vL1BlcnNvbnMgZGF0YVxudmFyIHBlcnNvbnMgPSBbXG4gICAgJ0FkYW0gTGV2aW5lJyxcbiAgICAnQW1pciBBcmlzb24nLFxuICAgICdBc2hsZXkgSm9obnNvbicsXG4gICAgJ0F1ZHJleSBFc3BhcnphJyxcbiAgICAnQmxha2UgU2hlbHRvbicsXG4gICAgJ0Nhcmx5IENoYWlraW4nLFxuICAgICdDYXJzb24gRGFseScsXG4gICAgJ0NocmlzdGlhbiBTbGF0ZXInLFxuICAgICdDaHJpc3RpbmEgQWd1aWxlcmEnLFxuICAgICdEYXlvIE9rZW5peWknLFxuICAgICdEaWVnbyBLbGF0dGVuaG9mZicsXG4gICAgJ0RyZWEgZGUgTWF0dGVvJyxcbiAgICAnSGFtcHRvbiBGbHVrZXInLFxuICAgICdIYXJyeSBMZW5uaXgnLFxuICAgICdIaXNoYW0gVGF3ZmlxJyxcbiAgICAnSmFpbWllIEFsZXhhbmRlcicsXG4gICAgJ0phbWVzIFNwYWRlcicsXG4gICAgJ0plbm5pZmVyIExvcGV6JyxcbiAgICAnTWFyaWFubmUgSmVhbi1CYXB0aXN0ZScsXG4gICAgJ01hcnRpbiBXYWxsc3Ryw7ZtJyxcbiAgICAnTWVnYW4gQm9vbmUnLFxuICAgICdNb3poYW4gTWFybsOyJyxcbiAgICAnUGhhcnJlbGwgV2lsbGlhbXMnLFxuICAgICdQb3J0aWEgRG91YmxlZGF5JyxcbiAgICAnUmFtaSBNYWxlaycsXG4gICAgJ1JheSBMaW90dGEnLFxuICAgICdSb2IgQnJvd24nLFxuICAgICdSeWFuIEVnZ29sZCcsXG4gICAgJ1NhcmFoIEplZmZlcnknLFxuICAgICdTdWxsaXZhbiBTdGFwbGV0b24nLFxuICAgICdVa3dlbGkgUm9hY2gnLFxuICAgICdWaW5jZW50IExhcmVzY2EnLFxuICAgICdXYXJyZW4gS29sZScsXG4gICAgJ0thdGllIE1jR3JhdGgnLFxuICAgICdCcmFuZG9uIEpheSBNY0xhcmVuJyxcbiAgICAnU3RldmUgQnllcnMnLFxuICAgICdEZWFuIE1jRGVybW90dCcsXG4gICAgJ0VudWthIE9rdW1hJyxcbiAgICAnUm9iIFN0ZXdhcnQnLFxuICAgICdFcmluIEthcnBsdWsnLFxuICAgICdDaHJpc3RvcGhlciBKYWNvdCcgICAgXG5dO1xuXG4vL05ldyBHYWxsZXJ5IE1lZGlhIHRhYlxuXG5mdW5jdGlvbiBmaWxlVHlwZUVsZW1lbnQoZmlsZURhdGEpIHtcbiAgc3dpdGNoIChmaWxlRGF0YS50eXBlKSB7XG4gICAgY2FzZSAnaW1hZ2UnOlxuICAgIHJldHVybiAkKCc8ZGl2PjxpIGNsYXNzPVwiZmEgZmEtY2FtZXJhXCI+PC9pPjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190eXBlJyk7XG5cbiAgICBjYXNlICd2aWRlbyc6XG4gICAgcmV0dXJuICQoJzxkaXY+PGkgY2xhc3M9XCJmYSBmYS12aWRlby1jYW1lcmFcIj48L2k+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3R5cGUnKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgcmV0dXJuICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3R5cGUnKTtcbiAgfVxufVxuXG5cbi8vIENyZWF0ZSBET00gZWxlbWVudCBmb3IgRmlsZSBmcm9tIGRhdGFcbmZ1bmN0aW9uIGNyZWF0ZUZpbGVFbGVtZW50KGYpIHtcbiAgdmFyIGZpbGVEYXRhID0gZi5maWxlRGF0YTtcbiAgLy9jcmVhdGUgYmFzaWMgZWxlbWVudFxuICB2YXIgZmlsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUgZmlsZV90eXBlX2ltZyBmaWxlX3ZpZXdfZ3JpZCcpLFxuICBmaWxlSW5kZXggPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdoaWRkZW4gZmlsZV9faWQnKS50ZXh0KGZpbGVEYXRhLmlkKSxcblxuICBmaWxlSW1nID0gJCgnPGRpdj48L2Rpdj4nKVxuICAuYWRkQ2xhc3MoJ2ZpbGVfX2ltZycpXG4gIC5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyBmaWxlRGF0YS51cmwgKyAnKScpLFxuICBmaWxlQ29udHJvbHMgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19jb250cm9scycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuICBmaWxlQ2hlY2ttYXJrID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fY2hlY2ttYXJrJykuY2xpY2sodG9nZ2xlRmlsZVNlbGVjdCksXG4gIGZpbGVEZWxldGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19kZWxldGUnKTtcbiAgZmlsZVR5cGUgPSBmaWxlVHlwZUVsZW1lbnQoZmlsZURhdGEpLCBcbiAgZmlsZUVkaXQgPSAkKCc8YnV0dG9uPkVkaXQ8L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uIGJ1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS13aGl0ZScpLmNsaWNrKGhhbmRsZUZpbGVkRWRpdEJ1dHRvbkNsaWNrKSxcblxuICBmaWxlVGl0bGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190aXRsZSBmaWxlX190aXRsZS0tbWVkaWEtY2FyZCcpLnRleHQoZmlsZURhdGEudGl0bGUpLFxuXG4gIC8vZmlsZUNhcHRpb24gPSAkKCc8dGV4dGFyZWE+PC90ZXh0YXJlYT4nKS5hZGRDbGFzcygnZmlsZV9fY2FwdGlvbiBmaWxlX19jYXB0aW9uX21haW4nKS52YWwoZmlsZURhdGEuY2FwdGlvbiksXG5cbiAgZmlsZVB1cnBvc2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19wdXJwb3NlJyksXG4gIGZpbGVQdXJwb3NlU2VsZWN0ID0gJCgnPGRpdj48L2Rpdj4nKTtcblxuICBmaWxlRWRpdEJ1dHRvbiA9ICQoJzxidXR0b24+RWRpdDwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24gYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXkgdS12aXNpYmxlLXhzIHUtbm9NYXJnaW4nKS5jbGljayhoYW5kbGVGaWxlZEVkaXRCdXR0b25DbGljayk7XG5cbiAgZmlsZUNvbnRyb2xzLmFwcGVuZChmaWxlQ2hlY2ttYXJrLCBmaWxlRGVsZXRlLCBmaWxlVHlwZSwgZmlsZUVkaXQpO1xuICBmaWxlSW1nLmFwcGVuZChmaWxlQ29udHJvbHMpO1xuXG4gIGZpbGVQdXJwb3NlLmFwcGVuZChmaWxlUHVycG9zZVNlbGVjdCwgZmlsZUVkaXRCdXR0b24pO1xuXG4gIGZpbGVEZWxldGUuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgZGVsZXRlRmlsZUJ5SWQoZmlsZURhdGEuaWQsIGdhbGxlcnlPYmplY3RzKTtcbiAgICB1cGRhdGVHYWxsZXJ5KCk7XG4gIH0pO1xuICBcbiAgLy9jb25zb2xlLmxvZyhmaWxlRGF0YS51c2FnZSwgZGlzYWJsZWRJdGVtcywgZGlzYWJsZWRJdGVtcy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge3JldHVybiBpdGVtICE9PSBmaWxlRGF0YS51c2FnZX0pKVxuICB2YXIgcHVycG9zZVNlbGVjdCA9IG5ldyBTZWxlY3Rib3goZmlsZVB1cnBvc2VTZWxlY3QuZ2V0KDApLCB7XG4gICAgbGFiZWw6ICdVc2FnZScsXG4gICAgcGxhY2Vob2xkZXI6ICdTZWxlY3QgVXNhZ2UnLFxuICAgIGl0ZW1zOiBbJ0xvZ28nLCAnUHJpbWFyeScsICdTZWNvbmRhcnknLCdDb3ZlcicsICdIZWFkZXInLCAnQmFja2dyb3VuZCcsICdSb2t1IC0gU21hbGwnLCAnUm9rdSAtIExhcmdlJywgJ1RyYWlsZXInLCAnRXBpc29kZSddLFxuICAgIHNlbGVjdGVkSXRlbTogZmlsZURhdGEudXNhZ2UsXG4gICAgZGlzYWJsZWRJdGVtczogZmlsZURhdGEudXNhZ2UgJiYgZmlsZURhdGEudXNhZ2UgIT09ICcnID8gZGlzYWJsZWRJdGVtcy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge3JldHVybiBpdGVtICE9PSBmaWxlRGF0YS51c2FnZX0pIDogZGlzYWJsZWRJdGVtcyxcbiAgICBpdGVtQ2FsbGJhY2s6IGZ1bmN0aW9uKGl0ZW0sIHNlbGVjdGJveCkge1xuICAgICAgaGFuZGxlVXNhZ2VTZWxlY3QoaXRlbSwgc2VsZWN0Ym94LCBmaWxlRGF0YS5pZCk7XG4gICAgfVxuICB9KTtcblxuICBmaWxlLmFwcGVuZChmaWxlSW5kZXgsIGZpbGVJbWcsIGZpbGVUaXRsZSwgZmlsZVB1cnBvc2UsIGZpbGVFZGl0QnV0dG9uKTtcblxuICByZXR1cm4gZmlsZTtcbn1cblxuZnVuY3Rpb24gYWRkRmlsZShmaWxlKSB7XG4gIHZhciBmaWxlU2VjdGlvbiA9ICQoJy5maWxlcyAuc2VjdGlvbl9fZmlsZXMnKS5nZXQoMCk7XG4gICQoZmlsZVNlY3Rpb24pLmFwcGVuZChmaWxlKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlVXNhZ2VTZWxlY3QoaXRlbSwgc2VsZWN0Ym94LCBpZCkge1xuICBjb25zb2xlLmxvZyhcIkVudGVyZWQgaGFuZGxlIHVzYWdlIHNlbGVjdFwiKTtcbiAgdmFyIHVzYWdlID0gJyc7XG4gIHZhciBwcmV2VXNhZ2UgPSAnJztcbiAgaWYgKHNlbGVjdGJveC5hY3RpdmVJdGVtID4gLTEpIHtcbiAgICB1c2FnZSA9IHNlbGVjdGJveC5vcHRpb25zLml0ZW1zW3NlbGVjdGJveC5hY3RpdmVJdGVtXTtcbiAgICBnYWxsZXJ5T2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiR2FsbGVyeSBpdGVtOlwiLCBmKTtcbiAgICAgIGlmIChmLmZpbGVEYXRhLmlkID09PSBpZCkge1xuICAgICAgICBwcmV2VXNhZ2UgPSBmLmZpbGVEYXRhLnVzYWdlO1xuICAgICAgICBmLmZpbGVEYXRhLnVzYWdlID0gdXNhZ2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZGlzYWJsZWRJdGVtcy5wdXNoKHVzYWdlKTtcbiAgICBpZiAocHJldlVzYWdlKSB7XG4gICAgICBkaXNhYmxlZEl0ZW1zLnNwbGljZShkaXNhYmxlZEl0ZW1zLmluZGV4T2YocHJldlVzYWdlKSwgMSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGdhbGxlcnlPYmplY3RzLmZvckVhY2goZnVuY3Rpb24oZikge1xuICAgICAgaWYgKGYuZmlsZURhdGEuaWQgPT09IGlkKSB7XG4gICAgICAgIHVzYWdlID0gZi5maWxlRGF0YS51c2FnZTtcbiAgICAgICAgZi5maWxlRGF0YS51c2FnZSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodXNhZ2UgIT09ICcnKSB7XG4gICAgICBkaXNhYmxlZEl0ZW1zLnNwbGljZShkaXNhYmxlZEl0ZW1zLmluZGV4T2YodXNhZ2UpLCAxKTtcbiAgICB9XG4gIH1cbiAgdXBkYXRlR2FsbGVyeSgpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVHYWxsZXJ5KHNjcm9sbEluZGV4KSB7XG4gIHNpbmdsZXNlbGVjdCA9IGZhbHNlO1xuICB2YXIganVzdFVwbG9hZGVkID0gZmFsc2U7XG5cbiAgLy8gUmVtZW1iZXIgcG9zaXRpb24gYW5kIHNlbGVjdGlvbiBvZiBmaWxlc1xuICAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgIHZhciBmaWxlID0gZ2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcbiAgICAgIHJldHVybiBmLmZpbGVEYXRhLmlkID09PSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG4gICAgfSlbMF07XG4gICAgaWYgKGZpbGUpIHtcbiAgICAgIGZpbGUucG9zaXRpb24gPSBpbmRleDtcbiAgICAgIGZpbGUuc2VsZWN0ZWQgPSAkKGVsKS5oYXNDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vQ2xlYXIgZmlsZXMgc2VjdGlvblxuICAkKCcuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzJykuZW1wdHkoKTtcblxuICAvL1NvcnQgYXJyYXkgYWNvcmRpbmcgZmlsZXMgcG9zaXRpb25cbiAgZ2FsbGVyeU9iamVjdHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEucG9zaXRpb24gLSBiLnBvc2l0aW9uO1xuICB9KTtcblxuICAvL0NyZWF0ZSBmaWxlcyBmcm9tIGRhdGEgYW5kIGFkZCB0aGVtIHRvIHRoZSBwYWdlXG4gIGZvciAodmFyIGkgPSAwOyBpPGdhbGxlcnlPYmplY3RzLmxlbmd0aDsgaSsrICkge1xuICAgIHZhciBmID0gZ2FsbGVyeU9iamVjdHNbaV0sXG4gICAgZmlsZSA9IGNyZWF0ZUZpbGVFbGVtZW50KGYpO1xuXG4gICAgaWYgKGYuc2VsZWN0ZWQpIHtmaWxlLmFkZENsYXNzKCdzZWxlY3RlZCcpO31cbiAgICBpZiAoZi5qdXN0VXBsb2FkZWQpIHtcbiAgICAgIGZpbGUuYWRkQ2xhc3MoJ2p1c3RVcGxvYWRlZCcpO1xuICAgICAgZi5qdXN0VXBsb2FkZWQgPSBmYWxzZTtcbiAgICAgIGp1c3RVcGxvYWRlZCA9IHRydWU7XG4gICAgfVxuICAgIGFkZEZpbGUoZmlsZSk7XG4gIH1cblxuICBub3JtYWxpemVTZWxlY3RlaW9uKCk7XG4gIG5vcm1hbGl6ZUluZGV4KCk7XG5cbiAgLyppZiAoanVzdFVwbG9hZGVkKSB7XG4gIGVkaXRGaWxlcygkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuanVzdFVwbG9hZGVkJykpO1xufSovXG4gIGlmIChzY3JvbGxJbmRleCkge1xuICAgIHZhciBzY3JvbGxUb3AgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUnKS5sYXN0KCkub2Zmc2V0KCkudG9wO1xuICAgICQoJ2JvZHknKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbFRvcDogc2Nyb2xsVG9wXG4gICAgfSwgNDAwKTtcbiAgfVxuXG5cblxuICBpZiAod2luZG93LmFkZGVkTWVkaWFJdGVtc0NhbGxiYWNrKSB7XG4gICAgd2luZG93LmFkZGVkTWVkaWFJdGVtc0NhbGxiYWNrKCk7XG4gIH1cblxufVxuXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAvL0NvbW1vbiBpbml0IGZ1bmN0aW9ucyBmb3IgYWxsIHBhZ2VzXG4gIHZhciBzY3JvbGxQb3NpdGlvbjtcbiAgdmFyIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gIFxuICAvL1N0aWNreSBzY3JvbGxiYXJcbiAgc3RpY2t5VG9wYmFyID0gbmV3IFN0aWNreVRvcGJhcigpO1xuICBcbiAgLy9Ob3JtYWxpemVyc1xuICBub3JtaWxpemVNZW51KCk7XG4gIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgbm9ybWFsaXplU2VsZWN0ZWlvbigpO1xuICBcbiAgJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5zZWN0aW9uX19maWxlcycpLmRpc2FibGVTZWxlY3Rpb24oKTtcbiAgXG4gIC8vQ2hlY2sgZm9yIHJlcXVpcmVkIGZpZWxkc1xuICAkKCdsYWJlbC5yZXF1aWVyZWQnKS5wYXJlbnQoKS5jaGlsZHJlbignaW5wdXQnKS5vbignYmx1cicsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoY2hlY2tGaWVsZChlLnRhcmdldCkpIHtcbiAgICAgIG1hcmtGaWVsZEFzTm9ybWFsKGUudGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWFya0ZpZWxkQXNSZXF1aXJlZChlLnRhcmdldCk7XG4gICAgfVxuICB9KTtcbiAgXG4gIFxuICAvL0NsaWNrIG9uIGxvZ29cbiAgJCgnLmpzLWxvZ28nKS5jbGljayhoYW5kbGVMb2dvQ2xpY2spO1xuICBmdW5jdGlvbiBoYW5kbGVMb2dvQ2xpY2soZSkge1xuICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCdjcmVhdGUnKSA+PSAwICYmXG4gICAgIWRyYWZ0SXNTYXZlZCAmJlxuICAgICQoJy5qcy1jb250ZW50IC5maWxlLCAuanMtY29udGVudCAuanMtaGFzVmFsdWUnKS5sZW5ndGggPiAwKSB7XG4gICAgICBuZXcgTW9kYWwoe1xuICAgICAgICB0aXRsZTogJ0xlYXZlIFBhZ2U/JyxcbiAgICAgICAgdGV4dDogJ1lvdSB3aWxsIGxvc2UgYWxsIHVuc2F2ZWQgY2hhbmdlcy4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGxlYXZlIHRoaXMgcGFnZT8nLFxuICAgICAgICBjb25maXJtVGV4dDogJ0xlYXZlIFBhZ2UnLFxuICAgICAgICBjb25maXJtQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdkYXNoYm9hcmQuaHRtbCc7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdkYXNoYm9hcmQuaHRtbCc7XG4gICAgfVxuICB9XG4gIFxuICAvL0Fzc2V0IExpYnJhcnlcbiAgXG4gICQoJyNhbENsb3NlQnV0dG9uJykuY2xpY2soY2xvc2VBc3NldExpYnJhcnkpO1xuICAkKCcjYWxUb3BDbG9zZUJ1dHRvbicpLmNsaWNrKGNsb3NlQXNzZXRMaWJyYXJ5KTtcbiAgJCgnI2Fzc2V0TGlicmFyeScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICBvcGVuQXNzZXRMaWJyYXJ5KGUpO1xuICB9KTtcbiAgXG4gIGZ1bmN0aW9uIG9wZW5Bc3NldExpYnJhcnkoZSwgb3B0aW9ucykge1xuICAgIHNjcm9sbFBvc2l0aW9uID0gJCgnYm9keScpLnNjcm9sbFRvcCgpO1xuICAgIHVwZGF0ZUFzc2V0TGlicmFyeSgpO1xuICAgICQoJyNhbCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAkKCcjYWwnKS5hZGRDbGFzcygnbW9kYWwnKTtcbiAgICAkKCcjd3JhcHBlcicpLmFkZENsYXNzKCdvdmVyZmxvdycpO1xuICAgIHNpbmdsZXNlbGVjdCA9IGZhbHNlO1xuICAgICQoJyNhZGRGcm9tQUxCdXR0b24nKS50ZXh0KCdBZGQgRmlsZXMnKTtcbiAgXG4gICAgJCgnI2FkZEZyb21BTEJ1dHRvbicpLmNsaWNrKGFkZEZpbGVzRnJvbUFzc2V0TGlicmFyeSk7XG4gICAgc2V0TW9kYWxLZXlib2FyZEFjdGlvbnMoYWRkRmlsZXNGcm9tQXNzZXRMaWJyYXJ5LCBjbG9zZUFzc2V0TGlicmFyeSk7XG4gICAgJChlLnRhcmdldCkuYmx1cigpO1xuICB9XG4gIFxuICBmdW5jdGlvbiBhZGRGaWxlc0Zyb21Bc3NldExpYnJhcnkoKXtcbiAgICBsYXN0U2VsZWN0ZWQgPSBudWxsO1xuICAgIGFkZFNlbGVjdGVkRmlsZXMoKTtcbiAgICBjbG9zZUFzc2V0TGlicmFyeSgpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcbiAgfVxuICBmdW5jdGlvbiBjbG9zZUFzc2V0TGlicmFyeSgpIHtcbiAgICBsYXN0U2VsZWN0ZWQgPSBudWxsO1xuICAgICQoJy5hbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgZGVzZWxlY3RBbGwoKTtcbiAgICAkKCcubW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJykucmVtb3ZlQ2xhc3MoJ21vZGFsJyk7XG4gICAgJCgnI3dyYXBwZXInKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3cnKTtcbiAgICAkKCcjYWRkRnJvbUFMQnV0dG9uJykudW5iaW5kKCdjbGljaycpO1xuICAgICQoJ2JvZHknKS5zY3JvbGxUb3Aoc2Nyb2xsUG9zaXRpb24pO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcbiAgfVxuICBcbiAgd2luZG93Lm9wZW5Bc3NldExpYnJhcnkgPSBvcGVuQXNzZXRMaWJyYXJ5O1xuICBcbiAgJCgnI2FsJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICQoJyNhbCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgfSk7XG4gICQoJyNhbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzJykuZGlzYWJsZVNlbGVjdGlvbigpO1xuICBcbiAgLy9VcGxvYWQgZmlsZXNcbiAgJCgnI3VwbG9hZEZpbGVzJykuY2xpY2soaGFuZGxlVXBsb2FkRmlsZXNDbGljayk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGhhbmRsZURyYWdFbnRlciwgdHJ1ZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgaGFuZGxlRHJhZ092ZXIsIGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGhhbmRsZURyb3AsIGZhbHNlKTtcbiAgXG4gIC8vRHJhZnQgZnVuY3Rpb246IFNhdmUsIENhbmNlbCwgUHVibGlzaFxuICBmdW5jdGlvbiBzYXZlRHJhZnQoKSB7XG4gICAgc2hvd05vdGlmaWNhdGlvbignVGhlIGRyYWZ0IGlzIHNhdmVkLicpO1xuICAgIGRyYWZ0SXNTYXZlZCA9IHRydWU7XG4gIH1cbiAgZnVuY3Rpb24gcmVtb3ZlRHJhZnQoKSB7XG4gICAgbmV3IE1vZGFsKHtcbiAgICAgIHRpdGxlOiAnQ2FuY2VsIHRoaXMgRHJhZnQ/JyxcbiAgICAgIHRleHQ6ICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gY2FuY2VsIGFuZCBkaXNjYXJkIHRoaXMgZHJhZnQ/JyxcbiAgICAgIGNvbmZpcm1UZXh0OiAnQ2FuY2VsJyxcbiAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdkYXNoYm9hcmQuaHRtbCc7XG4gICAgICB9LFxuICAgICAgY2FuY2VsQWN0aW9uOiBoaWRlTW9kYWxQcm9tcHRcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBwdWJsaXNoRHJhZnQoKSB7XG4gICAgdmFyIGl0ZW1OYW1lID0gJCgnLm1lbnUgLmlzLWFjdGl2ZScpLnRleHQoKSxcbiAgICBwcm9tcHRNc2cgPSAnJztcbiAgXG4gICAgc3dpdGNoIChpdGVtTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICBjYXNlICdwZXJzb24nOlxuICAgICAgcHJvbXB0TXNnID0gJ1B1Ymxpc2hlZCBwZXJzb24gd2lsbCBiZWNvbWUgYXZhaWxhYmxlIHRvIGJlIGFkZGVkIGFzIHBhcnQgb2YgYSBjYXN0IGZvciBhIHNlYXNvbi9ldmVudC4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHB1Ymxpc2ggaXQ/JztcbiAgICAgIGJyZWFrO1xuICBcbiAgICAgIGNhc2UgJ3JvbGUnOlxuICAgICAgcHJvbXB0TXNnID0gJ1B1Ymxpc2hlZCByb2xlIHdpbGwgYmVjb21lIGF2YWlsYWJsZSB0byBiZSBhZGRlZCBhcyBwYXJ0IG9mIGEgY2FzdCBmb3IgYSBzZWFzb24vZXZlbnQuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwdWJsaXNoIGl0Pyc7XG4gICAgICBicmVhaztcbiAgXG4gICAgICBkZWZhdWx0OlxuICAgICAgcHJvbXB0TXNnID0gJ1B1Ymxpc2hlZCAnICsgaXRlbU5hbWUudG9Mb3dlckNhc2UoKSArICcgd2lsbCBiZWNvbWUgYXZhaWxhYmxlIG9uIHRoZSBsaXZlIHNpdGUuIEFyZSB5b3Ugc3VyZSB5b3Ugd291bGQgbGlrZSB0byBwdWJsaXNoIGl0Pyc7XG4gICAgICBicmVhaztcbiAgXG4gICAgfVxuICAgIG5ldyBNb2RhbCh7XG4gICAgICB0aXRsZTogJ1B1Ymxpc2ggdGhpcyAnICsgaXRlbU5hbWUgKyAnPycsXG4gICAgICB0ZXh0OiBwcm9tcHRNc2csXG4gICAgICBjb25maXJtVGV4dDogJ1B1Ymxpc2gnLFxuICAgICAgY29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGhpZGVNb2RhbFByb21wdCgpO1xuICAgICAgICBzaG93Tm90aWZpY2F0aW9uKGl0ZW1OYW1lICsgJyBpcyBwdWJsaXNoZWQuJyk7XG4gICAgICAgIGRyYWZ0SXNTYXZlZCA9IHRydWU7XG4gICAgICB9LFxuICAgICAgY2FuY2VsQWN0aW9uOiBoaWRlTW9kYWxQcm9tcHRcbiAgICB9KTtcbiAgfVxuICBcbiAgJCgnI3NhdmVEcmFmdCcpLmNsaWNrKHNhdmVEcmFmdCk7XG4gICQoJyNyZW1vdmVEcmFmdCcpLmNsaWNrKHJlbW92ZURyYWZ0KTtcbiAgJCgnI3B1Ymxpc2hEcmFmdCcpLmNsaWNrKHB1Ymxpc2hEcmFmdCk7XG4gIFxuICAvL1RvcCBiYXIgYWN0aW9ucyBkcm9wZG93biBmb3IgbW9iaWxlXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aW9uRHJvcGRvd24nKSkge1xuICAgIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aW9uRHJvcGRvd24nKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBTYXZlIGFzIGRyYWZ0PC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogc2F2ZURyYWZ0XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLWJhblwiPjwvaT48c3BhbiBjbGFzcz1cImJ1dHRvblRleHRcIj4gIENhbmNlbDwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IHJlbW92ZURyYWZ0XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBcbiAgLy9GaWxlcyBtb3JlIGFjdGlvbiBkcm9wZG93bnNcbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3JlQWN0aW9ucycpKSB7XG4gICAgdmFyIHBhZ2VBY3Rpb25Ecm9wZG93biA9IG5ldyBEcm9wZG93bihcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3JlQWN0aW9ucycpLFxuICAgICAge1xuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJ1NlbmQgdG8gdG9wJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVTZW5kVG9Ub3BDbGlja1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnU2VuZCB0byBib3R0b20nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZVNlbmRUb0JvdHRvbUNsaWNrXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBcbiAgLy9NZWRpYSBjYXJkIGRyb3Bkb3duc1xuICAvL1NtYWxsXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVkaWFBY3Rpb25zU21hbGwnKSkge1xuICAgIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVkaWFBY3Rpb25zU21hbGwnKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgVXBsb2FkIGZpbGVzPC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlVXBsb2FkRmlsZXNDbGlja1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1mb2xkZXItb3BlblwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgQWRkIGZyb20gbGlicmFyeTwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgb3BlbkFzc2V0TGlicmFyeShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICApO1xuICB9XG4gIC8vRnVsbFxuICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lZGlhQWN0aW9uc0Z1bGwnKSkge1xuICAgIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVkaWFBY3Rpb25zRnVsbCcpLFxuICAgICAge1xuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtcGVuY2lsLXNxdWFyZVwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgTXVsdGkgRWRpdDwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZU11bHRpRWRpdEJ1dHRvbkNsaWNrLFxuICAgICAgICAgICAgZGlzYWJsZWQ6IGZ1bmN0aW9uKCkge3JldHVybiAkKCcjbXVsdGlFZGl0JykuaGFzQ2xhc3MoJ2Rpc2FibGVkJyk7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS10aW1lcy1jaXJjbGVcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIFJlbW92ZTwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZUJ1bGtSZW1vdmVDbGljayxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI2J1bGtSZW1vdmUnKS5oYXNDbGFzcygnZGlzYWJsZWQnKTt9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkaXZpZGVyOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgVXBsb2FkIGZpbGVzPC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlVXBsb2FkRmlsZXNDbGlja1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1mb2xkZXItb3BlblwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgQWRkIGZyb20gbGlicmFyeTwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgb3BlbkFzc2V0TGlicmFyeShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICApO1xuICB9XG4gIFxuICAvL0Fzc2V0IGxpYnJhcnkgZHJvcGRvd25zXG4gIC8vU21hbGxcbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc3NldEFjdGlvbnNTbWFsbCcpKSB7XG4gICAgdmFyIHBhZ2VBY3Rpb25Ecm9wZG93biA9IG5ldyBEcm9wZG93bihcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc3NldEFjdGlvbnNTbWFsbCcpLFxuICAgICAge1xuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtdXBsb2FkXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBVcGxvYWQgZmlsZXM8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVVcGxvYWRGaWxlc0NsaWNrXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICAvL0Z1bGxcbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc3NldEFjdGlvbnNGdWxsJykpIHtcbiAgICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fzc2V0QWN0aW9uc0Z1bGwnKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXBlbmNpbFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgQnVsayBFZGl0PC9zcGFuPjxzcGFuIGNsYXNzPVwiZHJvcGRvd25fX3dhcm5pbmdcIj48L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVNdWx0aUVkaXRCdXR0b25DbGljayxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI2J1bGtFZGl0JykuaGFzQ2xhc3MoJ2Rpc2FibGVkJyk7fSxcbiAgICAgICAgICAgIHdhcm5pbmc6IGZ1bmN0aW9uKCkge3JldHVybiAhJCgnI2J1bGtFZGl0JykuY2hpbGRyZW4oJy5idXR0b25fX3dhcm5pbmcnKS5oYXNDbGFzcygnaXMtaGlkZGVuJyk7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1wZW5jaWwtc3F1YXJlXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBNdWx0aSBFZGl0PC9zcGFuPjxzcGFuIGNsYXNzPVwiZHJvcGRvd25fX3dhcm5pbmdcIj48L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVNdWx0aUVkaXRCdXR0b25DbGljayxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI211bHRpRWRpdCcpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO30sXG4gICAgICAgICAgICB3YXJuaW5nOiBmdW5jdGlvbigpIHtyZXR1cm4gISQoJyNtdWx0aUVkaXQnKS5jaGlsZHJlbignLmJ1dHRvbl9fd2FybmluZycpLmhhc0NsYXNzKCdpcy1oaWRkZW4nKTt9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXRpbWVzLWNpcmNsZVwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgUmVtb3ZlPC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlQnVsa1JlbW92ZUNsaWNrLFxuICAgICAgICAgICAgZGlzYWJsZWQ6IGZ1bmN0aW9uKCkge3JldHVybiAkKCcjYnVsa1JlbW92ZScpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRpdmlkZXI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtdXBsb2FkXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBVcGxvYWQgZmlsZXM8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVVcGxvYWRGaWxlc0NsaWNrXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBcbiAgXG4gIC8vSW5pdCBwbGFjZWhvbGRlcnMgZm9yIGltYWdlcyBpZiBhbnkgKGNvdmVyLCBldGMuKVxuICB3aW5kb3cuaW1hZ2VQbGFjZWhvbGRlcnMgPSBpbml0SW1hZ2VQbGFjZWhvbGRlcnMoKTtcbiAgXG4gIC8vRm9jYWwgcG9pbnRcbiAgJCgnI2ZvY2FsUG9pbnRUb2dnbGUnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgLy9IaWRlIGZvY2FsIHJlY3RhbmdsZVxuICAgICQoJyNmb2NhbFJlY3RUb2dnbGUnKVxuICAgICAgLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUgYnV0dG9uX3N0eWxlX291dGxpbmUtYWNjZW50JylcbiAgICAgIC5hZGRDbGFzcygnYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKTtcbiAgICAkKCcjZm9jYWxSZWN0JykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICQoJy5wdXJwb3Nlc19fY29udGFpbmVyIC5wdXJwb3NlLmlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgXG4gICAgLy9DaGVjayB3aGV0aGVyIGZvY2FsIHBvaW50IGlzIGFjdGl2ZVxuICAgIGlmICgkKGUudGFyZ2V0KS5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHtcbiAgICAgICQoZS50YXJnZXQpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnaXMtYWN0aXZlIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWFjY2VudCcpXG4gICAgICAgIC5hZGRDbGFzcygnYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKTtcbiAgICAgICQoJyNmb2NhbFBvaW50JykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgaGlkZVVzYWdlUHJldmlld3MoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvL1NldCBmb2NhbCBwb2ludCB0b2dnbGUgYWN0aXZlXG4gICAgICAkKGUudGFyZ2V0KVxuICAgICAgICAuYWRkQ2xhc3MoJ2lzLWFjdGl2ZSBidXR0b25fc3R5bGVfb3V0bGluZS1hY2NlbnQnKVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2J1dHRvbl9zdHlsZV9vdXRsaW5lLXdoaXRlJyk7XG4gICAgICBzaG93VXNhZ2VQcmV2aWV3cygpO1xuICAgICAgJCgnI2ZvY2FsUG9pbnQnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG4gICAgfVxuICB9KTtcbiAgXG4gIC8vRm9jYWwgcmVjdGFuZ2xlXG4gICQoJyNmb2NhbFJlY3RUb2dnbGUnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgLy9IaWRlIGZvY2FsIHBvaW50XG4gICAgJCgnI2ZvY2FsUG9pbnRUb2dnbGUnKVxuICAgICAgLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUgYnV0dG9uX3N0eWxlX291dGxpbmUtYWNjZW50JylcbiAgICAgIC5hZGRDbGFzcygnYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKTtcbiAgICAkKCcjZm9jYWxQb2ludCcpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcbiAgXG4gICAgLy9DaGVjayB3aGV0aGVyIGZvY2FsIHBvaW50IGlzIGFjdGl2ZVxuICAgIGlmICgkKGUudGFyZ2V0KS5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHtcbiAgICAgICQoZS50YXJnZXQpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnaXMtYWN0aXZlIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWFjY2VudCcpXG4gICAgICAgIC5hZGRDbGFzcygnYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKTtcbiAgICAgICQoJyNmb2NhbFJlY3QnKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG4gICAgICBoaWRlVXNhZ2VQcmV2aWV3cygpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vU2V0IGZvY2FsIHBvaW50IHRvZ2dsZSBhY3RpdmVcbiAgICAgICQoZS50YXJnZXQpXG4gICAgICAgIC5hZGRDbGFzcygnaXMtYWN0aXZlIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWFjY2VudCcpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKTtcbiAgICAgIHNob3dVc2FnZVByZXZpZXdzKCk7XG4gICAgICAvLyBBZGp1c3QgcGxhY2VtZW50IGFuZCBzaXplIG9mIHJlY3RhbmdsZSBhY2NvcmRpbmcgcHVycG9zZSBzaXplXG4gICAgICAvLyBXZSBuZWVkIHRvIHdhaXQgc29tZSB0aW1lLCBzbyBpbWFnZSBwcmV2aWV3IHNpemUgY291bGQgYmUgY2FsY3VsYXRlZCBjb3JyZWN0XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgYWRqdXN0UmVjdCgkKCcucHVycG9zZXNfX2NvbnRhaW5lciAucHVycG9zZS1pbWcnKS5maXJzdCgpKTtcbiAgICAgICAgJCgnLnB1cnBvc2VzX19jb250YWluZXIgLnB1cnBvc2UtaW1nJykudW5iaW5kKCkuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIFx0XHRcdGFkanVzdFJlY3QoJChlLnRhcmdldCkpO1xuICAgIFx0XHR9KTtcbiAgICAgICAgJCgnI2ZvY2FsUmVjdCcpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcbiAgICAgIH0sIDMwMCk7XG4gICAgICAkKCcjcHVycG9zZVdyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6IDAgfSwgNjAwKTtcbiAgICB9XG4gIH0pO1xuICAvKiBIYW5kbGUgUHVycG9zZXMgc2Nyb2xsICovXG4gICQoJyNwdXJwb3NlV3JhcHBlcicpLnNjcm9sbChmdW5jdGlvbigpIHtcbiAgICBzZXRQdXJwb3NlUGFnaW5hdGlvbigpO1xuICB9KTtcbiAgJCgnLnB1cnBvc2VzX19sZWZ0JykudW5iaW5kKCdjbGljaycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAkKCcjcHVycG9zZVdyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6ICctPTQ4MCcgfSwgNjAwKTtcbiAgfSk7XG4gICQoJy5wdXJwb3Nlc19fcmlnaHQnKS51bmJpbmQoJ2NsaWNrJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICQoJyNwdXJwb3NlV3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogJys9NDgwJyB9LCA2MDApO1xuICB9KTtcbiAgLy9IZWxwZXIgZnVuY3Rpb24gdG8gY2hhbmdlIGNsYXNzZXMgYW5kIHNob3cgdXNhZ2UgcHJldmlld3NcbiAgZnVuY3Rpb24gc2hvd1VzYWdlUHJldmlld3MoKSB7XG4gICAgJCgnI2ZpbGVQcmV2aWV3JykuYWRkQ2xhc3MoJ2hhcy1wcmV2aWV3cycpO1xuICAgICQoJyNwdXJwb3NlcycpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcbiAgfVxuICBmdW5jdGlvbiBoaWRlVXNhZ2VQcmV2aWV3cygpIHtcbiAgICAkKCcjZmlsZVByZXZpZXcnKS5yZW1vdmVDbGFzcygnaGFzLXByZXZpZXdzJyk7XG4gICAgJCgnI3B1cnBvc2VzJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICB9XG4gIFxuICAkKCcjZm9jYWxQb2ludCcpLmRyYWdnYWJsZSh7XG4gICAgY29udGFpbm1lbnQ6IFwiI3ByZXZpZXdJbWdcIixcbiAgICBzY3JvbGw6IGZhbHNlICxcbiAgICBzdG9wOiBmdW5jdGlvbihlKSB7XG4gICAgICBhZGp1c3RGb2NhbFBvaW50KCk7XG4gICAgICBhZGp1c3RQdXJwb3NlKCQoZS50YXJnZXQpKTtcbiAgICAgIGRhdGFDaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICAvKiBJbml0IFB1cnBvc2UgUGFnaW5hdG9yICovXG4gIFxuICBmdW5jdGlvbiBzZXRQdXJwb3NlUGFnaW5hdGlvbigpIHtcbiAgICB2YXIgc2Nyb2xsT2Zmc2V0ID0gJCgnI3B1cnBvc2VXcmFwcGVyJykuc2Nyb2xsTGVmdCgpO1xuICAgIHZhciB3aWR0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwdXJwb3NlV3JhcHBlcicpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgIHZhciBmaXJzdEluZGV4ID0gTWF0aC5mbG9vcihzY3JvbGxPZmZzZXQvMTQwKSArIDE7XG4gICAgdmFyIGxhc3RJbmRleCA9IGZpcnN0SW5kZXggKyBNYXRoLnJvdW5kKHdpZHRoLzE0MCkgLSAxO1xuICAgIHZhciBjb3VudCA9ICQoJyNwdXJwb3NlV3JhcHBlciAucHVycG9zZScpLmxlbmd0aDtcbiAgXG4gICAgbGFzdEluZGV4ID0gbGFzdEluZGV4IDwgY291bnQgPyBsYXN0SW5kZXggOiBjb3VudDtcbiAgXG4gICAgJCgnI3AtcGFnaW5hdG9yJykudGV4dChmaXJzdEluZGV4ICsgJyDigJQgJyArIGxhc3RJbmRleCArICcgb2YgJyArIGNvdW50KTtcbiAgfVxuICBcbiAgJCgnI3Nob3dQcmV2aWV3JykuY2xpY2soc2hvd0FsbFByZXZpZXdzKTtcbiAgJCgnI2hpZGVQdXJwb3NlJykuY2xpY2soaGlkZUFsbFByZXZpZXdzKTtcbiAgJCgnI2xvYWRNb3JlJykuY2xpY2soaGFuZGxlU2hvd01vcmUpO1xuICBcbiAgXG4gIGZ1bmN0aW9uIGhhbmRsZVNob3dNb3JlKGUpIHtcbiAgICAkKFwiI3B1cnBvc2VzIC5jLVB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZS5oaWRkZW5cIikuc2xpY2UoMCwgNSkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgIGlmICgkKFwiI3B1cnBvc2VzIC5jLVB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZS5oaWRkZW5cIikubGVuZ3RoID09PSAwKSB7XG4gICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgfVxuICB9XG4gIFxuICBcbiAgLy9TZWxlY3RlZCBGaWxlcyBhY3Rpb25zXG4gICQoJyNidWxrRWRpdCcpLmNsaWNrKGhhbmRsZUJ1bGtFZGl0QnV0dG9uQ2xpY2spO1xuICAkKCcjbXVsdGlFZGl0JykuY2xpY2soaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2spO1xuICAkKCcjYnVsa1JlbW92ZScpLmNsaWNrKGhhbmRsZUJ1bGtSZW1vdmVDbGljayk7XG4gIFxuICBmdW5jdGlvbiBoYW5kbGVCdWxrUmVtb3ZlQ2xpY2soKSB7XG4gICAgdmFyIGZpbGVzVG9EZWxldGUgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKSxcbiAgICBpdGVtTmFtZSA9ICQoJy5tZW51IC5pcy1hY3RpdmUnKS50ZXh0KCkudG9Mb3dlckNhc2UoKSxcbiAgICBhc3NldExpYnJhcnkgPSBpdGVtTmFtZSA9PT0gJ2Fzc2V0IGxpYnJhcnknLFxuICAgIG1zZ1RpdGxlID0gYXNzZXRMaWJyYXJ5PyAnRGVsZXRlIEFzc2V0cz8nIDogJ1JlbW92ZSBBc3NldHM/JyxcbiAgICBtZXNnVGV4dCA9IGFzc2V0TGlicmFyeT8gJ1NlbGVjdGVkIGFzc2V0KHMpIHdpbGwgYmUgZGVsZXRlZCBmcm9tIHRoZSBhc3NldCBsaWJyYXJ5LiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoZW0/JyA6ICdTZWxlY3RlZCBhc3NldChzKSB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGlzICcgKyBpdGVtTmFtZSArICcuIERvbuKAmXQgd29ycnksIGl0IHdvbuKAmXQgYmUgZGVsZXRlZCBmcm9tIHRoZSBBc3NldCBMaWJyYXJ5LicsXG4gICAgYnRuTmFtZSA9IGFzc2V0TGlicmFyeT8gJ0RlbGV0ZScgOiAnUmVtb3ZlJztcbiAgICBuZXcgTW9kYWwoe1xuICAgICAgdGl0bGU6IG1zZ1RpdGxlLFxuICAgICAgdGV4dDogbWVzZ1RleHQsXG4gICAgICBjb25maXJtVGV4dDogYnRuTmFtZSxcbiAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICBmaWxlc1RvRGVsZXRlLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICAgICB2YXIgaWQgPSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG4gICAgICAgICAgZGVsZXRlRmlsZUJ5SWQoaWQsIGdhbGxlcnlPYmplY3RzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHVwZGF0ZUdhbGxlcnkoKTtcbiAgICAgIH0sXG4gICAgICBjYW5jZWxBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2JyJykucmVtb3ZlQ2xhc3MoJ3NicicpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIFxuICAvL0ZpbGUgRWRpdCBTYXZlIGFuZCBDYW5jZWxcbiAgJCgnI3NhdmVDaGFuZ2VzJykuY2xpY2soc2F2ZUltYWdlRWRpdCk7XG4gICQoJyNjYW5jZWxDaGFuZ2VzJykuY2xpY2soY2FuY2VsSW1hZ2VFZGl0KTtcbiAgJCgnI2ZwVG9wQ2xvc2VCdXR0b24nKS5jbGljayhjYW5jZWxJbWFnZUVkaXQpO1xuICBcbiAgLy9GaWxlIEVkaXQgZmllbGQgY2hhbmdlc1xuICAkKCcjdGl0bGUnKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKSB7c2F2ZVRpdGxlKCk7fSk7XG4gICQoJyNjYXB0aW9uJykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVDYXB0aW9uKCk7fSk7XG4gICQoJyNkZXNjcmlwdGlvbicpLm9uKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtzYXZlRGVzY3JpcHRpb24oKTt9KTtcbiAgJCgnI3Jlc29sdXRpb24nKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge3NhdmVSZXNvbHV0aW9uKCk7fSk7XG4gICQoJyNhbHRUZXh0Jykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVBbHRUZXh0KCk7fSk7XG4gIFxuICAvL0hhbmRsZSBzZWxlY3Rpb25zXG4gICQoJyNzZWxlY3RBbGwnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgaWYgKCQoZS50YXJnZXQpLmhhc0NsYXNzKCdlbXB0eScpKSB7XG4gICAgICBzZWxlY3RBbGwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVzZWxlY3RBbGwoKTtcbiAgICB9XG4gIH0pO1xuICAkKCcjZGVzZWxlY3RBbGwnKS5jbGljayhmdW5jdGlvbihlKSB7ZGVzZWxlY3RBbGwoKTt9KTtcbiAgXG4gIC8vSW5pdCBhZGRhYmxlIGZpZWxkc1xuICBpbml0QWRkYWJsZUZpZWxkcygpO1xuICBcbiAgXG4gIFxuICBcbiAgXG4gIC8vYXV0b2V4cGFuZGFibGUgdGV4dGFyZWFcbiAgJCggJ3RleHRhcmVhJyApLmVsYXN0aWMoKTtcbiAgXG4gIC8qXG4gICogQ2FyZHNcbiAgKi9cbiAgXG4gIC8vRm9sZGFibGUgY2FyZHNcbiAgJCgnLmpzLWZvbGRhYmxlIC5qcy1mb2xkZWRUb2dnbGUnKS5jbGljayhoYW5kbGVGb2xkZWRUb2dnbGVDbGljayk7XG4gIGZ1bmN0aW9uIGhhbmRsZUZvbGRlZFRvZ2dsZUNsaWNrKGUpIHtcbiAgICB2YXIgY2FyZCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5qcy1mb2xkYWJsZScpO1xuICAgIGlmIChjYXJkLmhhc0NsYXNzKCdpcy1mb2xkZWQnKSkge1xuICAgICAgY2FyZC5yZW1vdmVDbGFzcygnaXMtZm9sZGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhcmQuYWRkQ2xhc3MoJ2lzLWZvbGRlZCcpO1xuICAgIH1cbiAgfVxuICAvL1N0aWNreSBjYXJkIGhlYWRlclxuICAkKCcuanMtc3RpY2t5T25Nb2JpbGUnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgIHZhciBzdGlja3kgPSBuZXcgU3RpY2thYmxlKGVsLCB7XG4gICAgICBtYXhXaWR0aDogNjAwLFxuICAgICAgYm91bmRhcnk6IHRydWUsXG4gICAgICBvZmZzZXQ6IDUwXG4gICAgfSk7XG4gIH0pO1xuICAkKCcuanMtc2VjdGlvblRpdGxlJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICB2YXIgc3RpY2t5ID0gbmV3IFN0aWNrYWJsZShlbCwge1xuICAgICAgbWF4V2lkdGg6IDYwMCxcbiAgICAgIGJvdW5kYXJ5OiAnI21lZGlhLWNhcmQnLFxuICAgICAgb2Zmc2V0OiAxMDRcbiAgICB9KTtcbiAgfSk7XG4gIFxuICAvL0FuaW1hdGlvbiBlbmQgaGFuZGxlXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCBmdW5jdGlvbihlKSB7XG4gICAgc3dpdGNoIChlLmFuaW1hdGlvbk5hbWUpIHtcbiAgICAgIGNhc2UgJ2NvbGxlY3Rpb25JdGVtLXB1bHNlLW91dCc6XG4gICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnaXMtYXBwZWFyaW5nJyk7XG4gICAgICByZXR1cm4gZTtcbiAgXG4gICAgICBjYXNlICdpbWctd3JhcHBlci1zbGlkZS1sZWZ0JzpcbiAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdpcy1zbGlkaW5nTGVmdCcpO1xuICAgICAgcmV0dXJuIGU7XG4gIFxuICAgICAgY2FzZSAnaW1nLXdyYXBwZXItc2xpZGUtcmlnaHQnOlxuICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2lzLXNsaWRpbmdSaWdodCcpO1xuICAgICAgcmV0dXJuIGU7XG4gIFxuICAgICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBlO1xuICAgIH1cbiAgfSk7XG4gIFxuICBcbiAgXG4gIFxuICAvL1JlY3VycmluZyB0b2dnbGVcbiAgJCgnI3JlY3VycmluZ1RvZ2dsZScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGUudGFyZ2V0LmNoZWNrZWQpIHtcbiAgICAgICQoJyNyZWN1cmluZ1RpbWUnKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnI3JlY3VyaW5nVGltZScpLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgIH1cbiAgfSk7XG4gIFxuICBjb25zb2xlLmxvZyh3aW5kb3cuc2V0dGluZ3MpO1xuICBcbiAgaWYgKHdpbmRvdy5zZXR0aW5ncy5JU19NVlApIHtcbiAgICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcImlzLW12cFwiKTtcbiAgfVxuICBcbiAgXG4gIC8qXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgb3BlbkFzc2V0TGlicmFyeTogb3BlbkFzc2V0TGlicmFyeVxuICAgIH1cbiAgfVxuICAqL1xuXG4gIGNvbnNvbGUubG9nKHdpbmRvdy5jb21tb25Jbml0KTtcblxuXG4gIC8vUG9zdCB0aXRsZSBhbmQgdGl0bGUgaW5wdXRcbiAgaWYgKCQoJyNwb3N0VGl0bGVJbnB1dCcpLmdldCgwKSkge1xuICAgIHZhciBwb3N0VGl0bGVJbnB1dCA9IG5ldyBUZXh0ZmllbGQoJCgnI3Bvc3RUaXRsZUlucHV0JykuZ2V0KDApLCB7XG4gICAgICBsYWJlbDogJ1RpdGxlJyxcbiAgICAgIGhlbHBUZXh0OiAnTWF1cmlzIG1hbGVzdWFkYSBuaWJoIG5lYyBsZW8gcG9ydGEgbWF4aW11cy4nLFxuICAgICAgZXJyTXNnOiAnUGxlYXNlIGZpbGwgdGhlIHRpdGxlJyxcbiAgICAgIG9uSW5wdXQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgJCgnI3Bvc3RUaXRsZVRleHQnKS50ZXh0KGUudGFyZ2V0LnZhbHVlIHx8ICdOZXcgUG9zdCcpO1xuICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgJCgnLmhlYWRlcl9fc3ViaGVhZCcpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvL0luaXQgYmx1cmIgc2VjdGlvblxuICBpZiAoJCgnI3Bvc3RMaXN0JykubGVuZ3RoID4gMCkge1xuICAgIGluaXRCbG9nU2VjdGlvbigkKCcjcG9zdExpc3QnKSk7XG4gIH1cblxuICAvL0luaXQgQXNzb2NpYXRpb24gc2VjdGlvblxuICBpZiAoJCgnI2NvbGxlY3Rpb25TZXJpZXNTZWN0aW9uJykuZmluZCgnLmNvbnRyb2xzX19ncm91cCcpLmxlbmd0aCA+IDApIHtcbiAgICBpbml0U2VyaWVzU2VjdGlvbigkKCcjY29sbGVjdGlvblNlcmllc1NlY3Rpb24nKS5maW5kKCcuY29udHJvbHNfX2dyb3VwJykpO1xuICB9XG5cbiAgLy9Jbml0IFJlbGF0ZWQgcG9zdHMgY29sbGVjdGlvblxuICBpZiAoJCgnI3BhZ2VDb2xsZWN0aW9uU2VjdGlvbicpLmZpbmQoJy5jb250cm9sc19fZ3JvdXAnKS5sZW5ndGggPiAwKSB7XG4gICAgaW5pdE9uZUNvbGxlY3Rpb25TZWN0aW9uKCQoJyNwYWdlQ29sbGVjdGlvblNlY3Rpb24nKS5maW5kKCcuY29udHJvbHNfX2dyb3VwJykpO1xuICB9XG4gIFxufSk7Il0sImZpbGUiOiJjcmVhdGUtcG9zdC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
