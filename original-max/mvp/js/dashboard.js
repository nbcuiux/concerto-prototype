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

$(document).ready(function() {

  //Common init
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

  //Dashboard FAvorites sortable
  $('#dashboardFavorites.js-sortable').sortable({
    placeholder: 'placeholder'
  });
  $('#dashboardFavorites.js-sortable').disableSelection();


  $('.set').click(function(e) {
    $(e.target).toggleClass('open');
  });

  $('.pannel .shortcut').draggable({
    connectToSortable: '.shortcuts',
    stop: function( e, ui ) {e.target.removeAttribute("style");}
  });

  $('*').not('.pannel, .pannel > .shortcut, .set').click(function() {
    $('.set').removeClass('open');
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYXNoYm9hcmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy9Db21tb24ganMgZmlsZXNcbi8vTWVudVxuZnVuY3Rpb24gbm9ybWlsaXplTWVudSgpIHtcbiAgdmFyIHBhZ2VOYW1lID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJy8nKS5wb3AoKSxcbiAgbWVudUl0ZW1zID0gJCgnLmpzLW1lbnUgLmpzLW1lbnVJdGVtJyk7XG4gIGFjdGl2ZU1lbnVJdGVtID0gJCgnW2RhdGEtdGFyZ2V0PVwiJyArIHBhZ2VOYW1lICsgJ1wiXScpO1xuXG4gIG1lbnVJdGVtcy5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJykuY2xpY2soaGFuZGxlTWVudUl0ZW1DbGljayk7XG4gIGFjdGl2ZU1lbnVJdGVtLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgYWN0aXZlTWVudUl0ZW0ucGFyZW50cygnLm1lbnVfX2l0ZW0nKS5hZGRDbGFzcygnaXMtb3BlbicpO1xufVxuZnVuY3Rpb24gaGFuZGxlTWVudUl0ZW1DbGljayhlKSB7XG4gIGlmICgkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhcmdldCcpKSB7XG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJ2NyZWF0ZScpID49IDAgJiYgIWRyYWZ0SXNTYXZlZCAmJiAkKCcuanMtY29udGVudCAuZmlsZSwgLmpzLWNvbnRlbnQgLmpzLWhhc1ZhbHVlJykubGVuZ3RoID4gMCkge1xuICAgICAgbmV3IE1vZGFsKHtcbiAgICAgICAgdGl0bGU6ICdMZWF2ZSBQYWdlPycsXG4gICAgICAgIHRleHQ6ICdZb3Ugd2lsbCBsb3NlIGFsbCB0aGUgdW5zYXZlZCBjaGFuZ2VzLiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gbGVhdmUgdGhpcyBwYWdlPycsXG4gICAgICAgIGNvbmZpcm1UZXh0OiAnTGVhdmUgUGFnZScsXG4gICAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YXJnZXQnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YXJnZXQnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKCQoZS50YXJnZXQpLnBhcmVudHMoJy5tZW51X19pdGVtJykuaGFzQ2xhc3MoJ2lzLW9wZW4nKSkge1xuICAgICAgJChlLnRhcmdldCkucGFyZW50cygnLm1lbnVfX2l0ZW0nKS5yZW1vdmVDbGFzcygnaXMtb3BlbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcubWVudV9faXRlbScpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XG4gICAgICAkKGUudGFyZ2V0KS5wYXJlbnRzKCcubWVudV9faXRlbScpLmFkZENsYXNzKCdpcy1vcGVuJyk7XG4gICAgfVxuICB9XG59XG5cbiQoJyNtZW51VG9nZ2xlJykuY2xpY2sob3Blbk1lbnUpO1xuJCgnLmpzLW1lbnUgPiAuanMtY2xvc2UnKS5jbGljayhjbG9zZU1lbnUpO1xuXG5mdW5jdGlvbiBvcGVuTWVudShlKSB7XG4gICQoJy5qcy1tZW51JykuYWRkQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNsb3NlTWVudSk7XG59XG5mdW5jdGlvbiBjbG9zZU1lbnUoZSkge1xuICBpZiAoJChlLnRhcmdldCkucGFyZW50cygnLm1lbnVfX2xpc3QnKS5sZW5ndGggPT09IDApIHtcbiAgICAkKCcuanMtbWVudScpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNsb3NlTWVudSk7XG4gIH1cbn1cblxuLy9zZWxlY3Rpb25cblxuZnVuY3Rpb24gdG9nZ2xlRmlsZVNlbGVjdChlKSB7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0dmFyIGZpbGUgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpLFxuXHRcdGZpbGVzU2VjdGlvbiA9IGZpbGUucGFyZW50KCksXG5cdFx0ZmlsZXMgPSBmaWxlc1NlY3Rpb24uY2hpbGRyZW4oJy5maWxlJyksXG5cdFx0c2VsZWN0ZWRGaWxlcyA9IGZpbGVzU2VjdGlvbi5jaGlsZHJlbignLmZpbGUuc2VsZWN0ZWQnKSxcblx0XHRzaW5nbGUgPSBzaW5nbGVzZWxlY3QgfHwgZmFsc2U7XG5cblx0aWYgKHNpbmdsZSkge1xuXHRcdGlmIChmaWxlLmhhc0NsYXNzKCdzZWxlY3RlZCcpKSB7XG5cdFx0XHRmaWxlLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRmaWxlc1NlY3Rpb24uZmluZCgnLmZpbGUnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHRcdGZpbGUuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdC8vQ2hlY2sgaWYgdXNlciBob2xkIFNoaWZ0IEtleVxuXHRcdGlmIChlLnNoaWZ0S2V5KSB7XG5cdFx0XHRpZiAoZmlsZS5oYXNDbGFzcygnc2VsZWN0ZWQnKSkge1xuXHRcdFx0XHRmaWxlLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmIChzZWxlY3RlZEZpbGVzKSB7XG5cdFx0XHRcdFx0dmFyIGZpbGVJbmRleCA9IGZpbGUuaW5kZXgoJy5maWxlJyksXG5cdFx0XHRcdFx0XHRmaWxlc1RvQmVTZWxlY3QgPSBmaWxlcy5zbGljZShsYXN0U2VsZWN0ZWQsIGZpbGVJbmRleCArIDEpO1xuXG5cdFx0XHRcdFx0aWYgKGxhc3RTZWxlY3RlZCA+IGZpbGVJbmRleCkge1xuXHRcdFx0XHRcdFx0ZmlsZXNUb0JlU2VsZWN0ID0gZmlsZXMuc2xpY2UoZmlsZUluZGV4LCBsYXN0U2VsZWN0ZWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmaWxlc1RvQmVTZWxlY3QuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHRcdFx0ZmlsZXNUb0JlU2VsZWN0LnJlbW92ZUNsYXNzKCdpcy1wcmVzZWxlY3RlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGZpbGUudG9nZ2xlQ2xhc3MoJ3NlbGVjdGVkIGlzLXByZXNlbGVjdGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRmaWxlLnRvZ2dsZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdH1cblx0XHRsYXN0U2VsZWN0ZWQgPSBmaWxlLmluZGV4KCk7XG5cdFx0bm9ybWFsaXplU2VsZWN0ZWlvbigpO1xuXHR9XG59XG5mdW5jdGlvbiBub3JtYWxpemVTZWxlY3RlaW9uKCkge1xuXHR2YXIgYnVsa0RlbGV0ZUJ1dHRvbiA9ICQoJyNidWxrUmVtb3ZlJyksXG5cdFx0YnVsa0VkaXRCdXR0b24gPSAkKCcjYnVsa0VkaXQnKSxcblx0XHRtdWx0aUVkaXRCdXR0b24gPSAkKCcjbXVsdGlFZGl0JyksXG5cdFx0bW9yZUFjdGlvbnNCdXR0b24gPSAkKCcjbW9yZUFjdGlvbnMnKSxcblxuXHRcdHNlbGVjdEFsbEJ1dHRvbiA9ICQoJyNzZWxlY3RBbGwnKSxcblx0XHRzZWxlY3RBbGxMYWJlbCA9ICQoJyNzZWxlY3RBbGxMYWJlbCcpLFxuXG5cdFx0ZGVzZWxlY3RBbGxCdXR0b24gPSAkKCcjZGVzZWxlY3RBbGwnKSxcblx0XHRkZXNlbGVjdEFsbExhYmVsID0gJCgnI2Rlc2VsZWN0QWxsTGFiZWwnKSxcblxuXHRcdGRlbGV0ZUJ1dHRvbnMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUgLmZpbGVfX2RlbGV0ZScpLFxuXHRcdGVkaXRCdXR0b25zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlIC5idXR0b24nKS5ub3QoJy5jLUZpbGUtY292ZXJUb2dsZScpLFxuXHRcdGFycmFuZ2VtZW50cyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZSAuZmlsZV9fYXJyYWdlbWVudCcpLFxuXHRcdGFycmFuZ2VtZW50SW5wdXRzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlIC5maWxlX19hcnJhZ2VtZW50JykuZmluZCgnaW5wdXQnKSxcblx0XHRzZXRDb3ZlckJ1dHRvbnMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUgYnV0dG9uLmMtRmlsZS1jb3ZlclRvZ2xlJyksXG5cblx0XHRzZWxlY3RlZERlbGV0ZUJ1dHRvbiA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCAuZmlsZV9fZGVsZXRlJyksXG5cdFx0c2VsZWN0ZWRFZGl0QnV0dG9uID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkIC5idXR0b24nKSxcblx0XHRzZWxlY3RlZEFycmFuZ2VtZW50ID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkIC5maWxlX19hcnJhZ2VtZW50JyksXG5cdFx0c2VsZWN0ZWRBcnJhbmdlbWVudElucHV0ID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkIC5maWxlX19hcnJhZ2VtZW50JykuZmluZCgnaW5wdXQnKSxcblx0XHRzZWxlY3RlZFNldENvdmVyQnV0dG9ucyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCBidXR0b24uYy1GaWxlLWNvdmVyVG9nbGUnKSxcblxuXHRcdG51bWJlck9mRmlsZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUnKS5sZW5ndGgsXG5cdFx0bnVtYmVyT2ZTZWxlY3RlZEZpbGVzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkJykubGVuZ3RoLFxuXHRcdG51bWJlck9mU2VsZWN0ZWRJbWFnZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuanMtaW1nRmlsZVR5cGUuc2VsZWN0ZWQnKS5sZW5ndGgsXG5cdFx0bnVtYmVyT2ZTZWxlY3RlZFZpZGVvcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5qcy12aWRlb0ZpbGVUeXBlLnNlbGVjdGVkJykubGVuZ3RoO1xuXG5cdFx0dW5zZWxlY3RlZEZpbGVzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlJykubm90KCcuc2VsZWN0ZWQnKTtcblxuXHQvL05vIHNlbGVjdGVkIGZpbGVzXG5cdGlmIChudW1iZXJPZlNlbGVjdGVkRmlsZXMgPT09IDApIHtcblx0XHRzZWxlY3RBbGxCdXR0b24ucmVtb3ZlQ2xhc3MoJ2FsbCBkaXNhYmxlZCcpLmFkZENsYXNzKCdlbXB0eScpO1xuXHRcdHNlbGVjdEFsbExhYmVsLnRleHQoJ1NlbGVjdCBBbGwnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblxuXHRcdGRlc2VsZWN0QWxsQnV0dG9uLnJlbW92ZUNsYXNzKCdpcy1hbGwnKS5hZGRDbGFzcygnaXMtZW1wdHkgZGlzYWJsZWQnKTtcblx0XHRkZXNlbGVjdEFsbExhYmVsLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXG5cdFx0YnVsa0RlbGV0ZUJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdGJ1bGtFZGl0QnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0YnVsa0VkaXRCdXR0b24uZmluZCgnLmJ1dHRvbl9fd2FybmluZycpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcblx0XHRtdWx0aUVkaXRCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRtb3JlQWN0aW9uc0J1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXG5cdFx0ZWRpdEJ1dHRvbnMucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdGRlbGV0ZUJ1dHRvbnMucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdGFycmFuZ2VtZW50cy5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRhcnJhbmdlbWVudElucHV0cy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRzZXRDb3ZlckJ1dHRvbnMucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSkucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG5cblx0XHR1bnNlbGVjdGVkRmlsZXMucmVtb3ZlQ2xhc3MoJ2lzLXByZXNlbGVjdGVkJyk7XG5cblx0XHRpZiAoJCgnI2Fzc2V0cy1jb3VudCcpLmxlbmd0aCA+IDApIHtub3JtYWxpemVBc3NldHNDb3VudCgpO31cblxuXHRcdGlmIChudW1iZXJPZkZpbGVzID09PSAwKSB7XG5cdFx0XHRzZWxlY3RBbGxCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHRzZWxlY3RBbGxMYWJlbC5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblxuXHRcdFx0ZGVzZWxlY3RBbGxCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHRkZXNlbGVjdEFsbExhYmVsLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdH1cblx0fVxuXHQvL1NvbWUgZmlsZXMgYXJlIHNlbGVjdGVkXG5cdGVsc2UgaWYgKG51bWJlck9mU2VsZWN0ZWRGaWxlcyA+IDApIHtcblx0XHRzZWxlY3RBbGxCdXR0b24ucmVtb3ZlQ2xhc3MoJ2VtcHR5IGFsbCcpO1xuXHRcdHNlbGVjdEFsbExhYmVsLnRleHQoJ0Rlc2VsZWN0IEFsbCcpO1xuXG5cdFx0ZGVzZWxlY3RBbGxCdXR0b24ucmVtb3ZlQ2xhc3MoJ2lzLWVtcHR5IGlzLWFsbCBkaXNhYmxlZCcpO1xuXHRcdGRlc2VsZWN0QWxsTGFiZWwucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cblxuXHRcdGJ1bGtEZWxldGVCdXR0b24ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0YnVsa0VkaXRCdXR0b24ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0bXVsdGlFZGl0QnV0dG9uLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdG1vcmVBY3Rpb25zQnV0dG9uLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXG5cdFx0ZWRpdEJ1dHRvbnMuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdGRlbGV0ZUJ1dHRvbnMuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdGFycmFuZ2VtZW50cy5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRhcnJhbmdlbWVudElucHV0cy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdHNldENvdmVyQnV0dG9ucy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuXG5cdFx0dW5zZWxlY3RlZEZpbGVzLmFkZENsYXNzKCdpcy1wcmVzZWxlY3RlZCcpO1xuXG5cdFx0aWYgKCQoJyNhc3NldHMtY291bnQnKS5sZW5ndGggPiAwKSB7XG5cdFx0XHQkKCcjYXNzZXRzLWNvdW50JykudGV4dChudW1iZXJPZlNlbGVjdGVkRmlsZXMudG9TdHJpbmcoKSArICcgb2YgJyArIGdhbGxlcnlPYmplY3RzLmxlbmd0aCArICcgc2VsZWN0ZWQnKTtcblx0XHR9XG5cblx0XHRpZiAobnVtYmVyT2ZTZWxlY3RlZFZpZGVvcyAmJiBudW1iZXJPZlNlbGVjdGVkSW1hZ2VzKSB7XG5cdFx0XHRidWxrRWRpdEJ1dHRvbi5maW5kKCcuYnV0dG9uX193YXJuaW5nJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHRcdFx0bXVsdGlFZGl0QnV0dG9uLmZpbmQoJy5idXR0b25fX3dhcm5pbmcnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJ1bGtFZGl0QnV0dG9uLmZpbmQoJy5idXR0b25fX3dhcm5pbmcnKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG5cdFx0XHRtdWx0aUVkaXRCdXR0b24uZmluZCgnLmJ1dHRvbl9fd2FybmluZycpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcblx0XHR9XG5cblx0XHQvL09ubHkgb25lIGZpbGUgc2VsZWN0ZWRcblx0XHRpZiAobnVtYmVyT2ZTZWxlY3RlZEZpbGVzID09PSAxKSB7XG5cdFx0XHRidWxrRWRpdEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdFx0bXVsdGlFZGl0QnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0XHQvL21vcmVBY3Rpb25zQnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cblx0XHRcdHNlbGVjdGVkRWRpdEJ1dHRvbi5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHRzZWxlY3RlZERlbGV0ZUJ1dHRvbi5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHRzZWxlY3RlZEFycmFuZ2VtZW50LnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0c2VsZWN0ZWRBcnJhbmdlbWVudElucHV0LnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdFx0c2VsZWN0ZWRTZXRDb3ZlckJ1dHRvbnMucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSkucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG5cdFx0fVxuXHRcdC8vQWxsIGZpbGVzIGFyZSBzZWxlY3RlZFxuXHRcdGlmIChudW1iZXJPZlNlbGVjdGVkRmlsZXMgPT09IG51bWJlck9mRmlsZXMpIHtcblx0XHRcdHNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnZW1wdHknKS5hZGRDbGFzcygnYWxsJyk7XG5cdFx0XHRkZXNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnaXMtZW1wdHknKS5hZGRDbGFzcygnaXMtYWxsJyk7XG5cdFx0fVxuXHR9XG59XG5mdW5jdGlvbiBzZWxlY3RBbGwoKSB7XG5cdCQoJy5qcy1jb250ZW50IC5maWxlJykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdG5vcm1hbGl6ZVNlbGVjdGVpb24oKTtcbn1cbmZ1bmN0aW9uIGRlc2VsZWN0QWxsKCkge1xuXHQkKCcuanMtY29udGVudCAuZmlsZS5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRub3JtYWxpemVTZWxlY3RlaW9uKCk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUFzc2V0c0NvdW50KCkge1xuXHRpZiAoZ2FsbGVyeU9iamVjdHMubGVuZ3RoKSB7XG5cdFx0JCgnI2Fzc2V0cy1jb3VudCcpLnRleHQoZ2FsbGVyeU9iamVjdHMubGVuZ3RoICsgJyBhc3NldHMnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG5cdH0gZWxzZSB7XG5cdFx0JCgnI2Fzc2V0cy1jb3VudCcpLnRleHQoJycpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcblx0fVxufVxuXG4vL05vdGlmaWNhdGlvbnNcbmZ1bmN0aW9uIHNob3dOb3RpZmljYXRpb24odGV4dCwgdG9wKSB7XG4gICAgdmFyIG5vdGlmaWNhdGlvbiA9ICQoJy5ub3RpZmljYXRpb24nKSxcbiAgICAgICAgbm90aWZpY2F0aW9uVGV4dCA9ICQoJy5ub3RpZmljYXRpb25fX3RleHQnKTtcblxuICAgIGlmIChub3RpZmljYXRpb24ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG5vdGlmaWNhdGlvbiA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ25vdGlmaWNhdGlvbicpO1xuICAgICAgICBub3RpZmljYXRpb25UZXh0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbm90aWZpY2F0aW9uX190ZXh0Jyk7XG4gICAgICAgIG5vdGlmaWNhdGlvbi5hcHBlbmQobm90aWZpY2F0aW9uVGV4dCk7XG4gICAgfVxuXG4gICAgaWYgKCQoJy5tb2RhbCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKCEkKCcubW9kYWwgLnByZXZpZXcnKS5oYXNDbGFzcygnaGlkZGVuJykpIHtcbiAgICAgICAgICAgICQoJy5tb2RhbCAucHJldmlldycpLmFwcGVuZChub3RpZmljYXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnLm1vZGFsJykuYXBwZW5kKG5vdGlmaWNhdGlvbik7XG4gICAgICAgIH1cblxuICAgIH0gZWxzZSBpZigkKCcuY3QnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICQoJy5jdCcpLmFwcGVuZChub3RpZmljYXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQobm90aWZpY2F0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAodG9wKSB7bm90aWZpY2F0aW9uLmNzcygndG9wJywgdG9wKTt9XG4gICAgbm90aWZpY2F0aW9uVGV4dC50ZXh0KHRleHQpO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBub3RpZmljYXRpb24ucmVtb3ZlKCk7XG4gICAgfSwgNDAwMCk7XG59XG5cbi8vRmlsZSBmdW5jdGlvbnNcbnZhciBnYWxsZXJ5Q2FwdGlvbnMgPSB7fTtcblxuZnVuY3Rpb24gaGFuZGxlQ2FwdGlvbkVkaXQoZSkge1xuICAgIHZhciBmaWxlRWxlbWVudCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJyksXG4gICAgICAgIGZpbGVJZCA9IGZpbGVFbGVtZW50LmZpbmQoJy5maWxlX19pZCcpLnRleHQoKSxcbiAgICAgICAgdG9nZ2xlID0gZmlsZUVsZW1lbnQuZmluZCgnLmZpbGVfX2NhcHRpb24tdG9nZ2xlIC50b2dnbGUnKSxcbiAgICAgICAgZmlsZSA9IGdhbGxlcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG4gICAgICAgICAgICByZXR1cm4gZi5maWxlRGF0YS5pZCA9PT0gZmlsZUlkO1xuICAgICAgICB9KVswXSxcblxuICAgICAgICB0b2dnbGVDaGVja2VkID0gJChlLnRhcmdldCkudmFsKCkgPT09IGZpbGUuZmlsZURhdGEuY2FwdGlvbiAmJiBmaWxlLmZpbGVEYXRhLmNhcHRpb247IC8vSWYgdGV4dGZpZWxkIGVxdWFscyB0aGUgZmlsZSBjYXB0aW9uIGFuZCBmaWxlIGNhcHRpb24gbm90IGVtcHR5XG5cbiAgICAvL1NhdmUgY2FwdGlvbiB0byBnYWxsZXJ5Q2FwdGlvbnNcbiAgICBmaWxlLmNhcHRpb24gPSAkKGUudGFyZ2V0KS52YWwoKTtcblxuICAgIHRvZ2dsZS5wcm9wKCdjaGVja2VkJywgdG9nZ2xlQ2hlY2tlZCk7XG4gICAgY2xvc2VUb29sdGlwKCk7XG59XG5mdW5jdGlvbiBoYW5kbGVDYXB0aW9uVG9nZ2xlQ2xpY2soZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdmFyIGZpbGUgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpLFxuICAgICAgICBmaWxlSWQgPSBmaWxlLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKSxcbiAgICAgICAgdGV4dGFyZWEgPSBmaWxlLmZpbmQoJy5maWxlX19jYXB0aW9uLXRleHRhcmVhJyksXG4gICAgICAgIG9yaWdpbmFsRmlsZSA9IGZpbGVCeUlkKGZpbGVJZCwgZ2FsbGVyeU9iamVjdHMpO1xuXG4gICAgaWYgKCQoZS50YXJnZXQpLnByb3AoJ2NoZWNrZWQnKSkge1xuICAgICAgICB0ZXh0YXJlYS52YWwob3JpZ2luYWxGaWxlLmZpbGVEYXRhLmNhcHRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHRhcmVhLmZvY3VzKCk7XG4gICAgfVxufVxuZnVuY3Rpb24gaGFuZGxlQ2FwdGlvblN0YXJ0RWRpdGluZyhlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB2YXIgdG9vbHRpcFRleHQgPSAnVGhpcyBjYXB0aW9uIHdpbGwgb25seSBhcHBseSB0byB5b3VyIGdhbGxlcnkgYW5kIG5vdCB0byB0aGUgaW1hZ2UgYXNzZXQuJztcbiAgICBpZiAoIXdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9vbHRpcCcpKSB7XG4gICAgICAgIGNyZWF0ZVRvb2x0aXAoJChlLnRhcmdldCksIHRvb2x0aXBUZXh0KTtcbiAgICB9XG59XG4vLyBDaGFuZ2UgZWxlbWVudCBpbmRleGVzIHRvIGFuIGFjdHVhbCBvbmVzXG5mdW5jdGlvbiBub3JtYWxpemVJbmRleCgpIHtcbiAgICB2YXIgZmlsZXMgPSAkKCcuanMtZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlJyk7XG5cbiAgICBmaWxlcy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAkKGVsKS5maW5kKCcuZmlsZV9fYXJhZ2VtZW50LWlucHV0JykudGV4dChpbmRleCArIDEpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVJbmRleEZpZWxkQ2hhbmdlKGUpIHtcbiAgICB2YXIgbGVuZ3RoID0gJCgnLmpzLWZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZScpLmxlbmd0aCxcbiAgICAgICAgaW5kZXggPSBwYXJzZUludCgkKGUudGFyZ2V0KS52YWwoKSkgLSAxLFxuICAgICAgICBmaWxlID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKTtcblxuICAgIGlmIChpbmRleCArIDEgPj0gbGVuZ3RoKSB7XG4gICAgICAgIHB1dEJvdHRvbShmaWxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmaWxlLmRldGFjaCgpLmluc2VydEJlZm9yZSgkKCcuanMtZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlJykuc2xpY2UoaW5kZXgsIGluZGV4KzEpKTtcblxuICAgIH1cbiAgICBub3JtYWxpemVJbmRleCgpO1xuICAgIC8vdXBkYXRlR2FsbGVyeShpbmRleCk7XG59XG5cbmZ1bmN0aW9uIHB1dEJvdHRvbShmaWxlKSB7XG4gICAgZmlsZS5kZXRhY2goKS5pbnNlcnRBZnRlcigkKCcuanMtZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlJykubGFzdCgpKTtcbiAgICBub3JtYWxpemVJbmRleCgpO1xuICAgIC8vdXBkYXRlR2FsbGVyeShnYWxsZXJ5T2JqZWN0cy5sZW5ndGgpO1xufVxuZnVuY3Rpb24gcHV0VG9wKGZpbGUpIHtcbiAgICBmaWxlLmRldGFjaCgpLmluc2VydEJlZm9yZSgkKCcuanMtZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlJykuZmlyc3QoKSk7XG4gICAgbm9ybWFsaXplSW5kZXgoKTtcbiAgICAvL3VwZGF0ZUdhbGxlcnkoMCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNlbmRUb1RvcENsaWNrKGUpIHtcbiAgICB2YXIgZmlsZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKTtcbiAgICBpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBwdXRUb3AoZmlsZXMpO1xuICAgIH1cbiAgICBwdXRUb3AoJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKSk7XG4gICAgY2xvc2VNZW51KCQoZS50YXJnZXQpLnBhcmVudHMoJ3NlbGVjdF9fbWVudScpKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZVNlbmRUb0JvdHRvbUNsaWNrKGUpIHtcbiAgICB2YXIgZmlsZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKTtcbiAgICBpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBwdXRCb3R0b20oZmlsZXMpO1xuICAgIH1cbiAgICBwdXRCb3R0b20oJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKSk7XG4gICAgY2xvc2VNZW51KCQoZS50YXJnZXQpLnBhcmVudHMoJ3NlbGVjdF9fbWVudScpKTtcbn1cbmZ1bmN0aW9uIGxvYWRGaWxlKGZpbGUpIHtcblx0dmFyIGZpbGVEYXRhID0gZmlsZS5maWxlRGF0YTtcblxuXHRzd2l0Y2ggKGZpbGVEYXRhLnR5cGUpIHtcblx0XHRjYXNlICdpbWFnZSc6XG5cdFx0XHQkKCcjZmlsZVByZXZpZXcnKS5hZGRDbGFzcygncHJldmlldy0taW1hZ2UnKS5yZW1vdmVDbGFzcygncHJldmlldy0tdmlkZW8nKTtcblx0XHRcdC8vSGlkZSB2aWRlbyByZWxhdGVkIGVsZW1lbnRzXG5cdFx0XHQkKCcjdmlkZW9QbGF5JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0JCgnI3ZpZGVvTWV0YWRhdGEnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cblx0XHRcdC8vU2hvdyBhbGwgaW1hZ2UgcmVsYXRlZCBlbGVtZW50c1xuXHRcdFx0JCgnI3ByZXZpZXdDb250cm9scycpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRcdCQoJyNpbWFnZU1ldGFkYXRhJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0Ly8kKCcjZm9jYWxQb2ludCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRcdC8vJCgnI2ZvY2FsUmVjdCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblxuXHRcdFx0Ly9JZiBpdCBpcyBub3QgYnVsayBlZGl0IHNldCBwcmV2aWV3IGltYWdlIGFuZCBhZGp1c3QgZm9jYWwgcG9pbnQgYW5kIHJlY3RhbmdsZTtcblx0XHRcdGlmICghZmlsZS5idWxrRWRpdCkge1xuXHRcdFx0XHQkKCcjcHJldmlld0ltZycpLmF0dHIoJ3NyYycsIGZpbGVEYXRhLnVybCk7XG5cdFx0XHRcdCQoJy5wciAucHVycG9zZS1pbWcnKS5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsICd1cmwoJyArIGZpbGVEYXRhLnVybCArICcpJyk7XG5cdFx0XHRcdGFkanVzdEZvY2FsUG9pbnQoZmlsZURhdGEuZm9jYWxQb2ludCk7XG5cdFx0XHRcdGFkanVzdEZvY2FsUmVjdChmaWxlRGF0YS5mb2NhbFBvaW50KTtcblx0XHRcdH1cblxuXHRcdFx0Ly9zZXQgVGl0bGVcblx0XHRcdGFkanVzdFRpdGxlKGZpbGVEYXRhLnRpdGxlKTtcblx0XHRcdGFkanVzdENhcHRpb24oZmlsZURhdGEuY2FwdGlvbik7XG5cdFx0XHRhZGp1c3REZXNjcmlwdGlvbihmaWxlRGF0YS5kZXNjcmlwdGlvbik7XG5cdFx0XHRhZGp1c3RSZXNvbHV0aW9uKGZpbGVEYXRhLmhpZ2hSZXNvbHV0aW9uKTtcblx0XHRcdGFkanVzdEFsdFRleHQoZmlsZURhdGEuYWx0VGV4dCk7XG5cblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSAndmlkZW8nOlxuXHRcdFx0JCgnI2ZpbGVQcmV2aWV3JykuYWRkQ2xhc3MoJ3ByZXZpZXctLXZpZGVvJykucmVtb3ZlQ2xhc3MoJ3ByZXZpZXctLWltYWdlJyk7XG5cdFx0XHQvL0hpZGUgYWxsIGltYWdlIHJlbGF0ZWQgZWxlbWVudHNcblx0XHRcdCQoJyNwcmV2aWV3Q29udHJvbHMnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHQkKCcjaW1hZ2VNZXRhZGF0YScpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHRcdCQoJyNmb2NhbFBvaW50JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0JCgnI2ZvY2FsUmVjdCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcblxuXHRcdFx0Ly9TaG93IHZpZGVvIHJlbGF0ZWQgZWxlbWVudHNcblx0XHRcdCQoJyN2aWRlb1BsYXknKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHQkKCcjdmlkZW9NZXRhZGF0YScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblxuXHRcdFx0aWYgKGZpbGUuYnVsa0VkaXQpIHtcblx0XHRcdFx0JCgnI2ZpZWxFZGl0LXZpZGVvTWV0YWRhdGEnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjZmllbEVkaXQtdmlkZW9NZXRhZGF0YScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblxuXHRcdFx0XHQkKCcjcHJldmlld0ltZycpLmF0dHIoJ3NyYycsIGZpbGVEYXRhLnVybCk7XG5cdFx0XHRcdCQoJyN2aWRlb1RpdGxlJykudGV4dChmaWxlRGF0YS50aXRsZSk7XG5cdFx0XHRcdCQoJyN2aWRlb0Rlc2NyaXB0aW9uJykudGV4dChmaWxlRGF0YS5kZXNjcmlwdGlvbik7XG5cdFx0XHRcdCQoJyN2aWRlb0F1dGhvcicpLnRleHQoZmlsZURhdGEuYXV0aG9yKTtcblx0XHRcdFx0JCgnI3ZpZGVvR3VpZCcpLnRleHQoZmlsZURhdGEuZ3VpZCk7XG5cdFx0XHRcdCQoJyN2aWRlb0tleXdvcmRzJykudGV4dChmaWxlRGF0YS5rZXl3b3Jkcyk7XG5cdFx0XHR9XG5cblx0XHRicmVhaztcblx0fVxufVxuXG4vL0Z1bmN0aW9uIHRvIHNldCBUaXRsZSB0byB0aGUgdGl0bGUgZmllbGQgb3IsIHNhdmUgdGl0bGUgaWYgdGl0bGUgYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIGFkanVzdFRpdGxlKHRpdGxlKSB7XG5cdCQoJyN0aXRsZScpLnZhbCh0aXRsZSkuY2hhbmdlKCk7XG5cdHZhciBldmVudCA9IG5ldyBVSUV2ZW50KCdjaGFuZ2UnKTtcblx0Ly9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUnKS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cbi8vRnVuY3Rpb24gdG8gc2V0IFRpdGxlIHRvIHRoZSB0aXRsZSBmaWVsZCBvciwgc2F2ZSB0aXRsZSBpZiB0aXRsZSBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gc2F2ZVRpdGxlKGUpIHtcblx0dmFyIGN1cnJlbnRJbWFnZSA9ICQoJy5pbWFnZS5pbWFnZV9zdHlsZV9tdWx0aSAuZmlsZV9faWRbZGF0YS1pZD1cIicgKyBlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5pZCArICdcIl0nKS5wYXJlbnRzKCcuaW1hZ2UnKTtcblxuXHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS50aXRsZSA9ICQoJyN0aXRsZScpLnZhbCgpO1xuXG5cdGlmICgkKCcjdGl0bGUnKS52YWwoKSA9PT0gJycpIHtcblx0XHRjdXJyZW50SW1hZ2UuYWRkQ2xhc3MoJ2hhcy1lbXB0eVJlcXVpcmVkRmllbGQnKTtcblx0fSBlbHNlIHtcblx0XHRjdXJyZW50SW1hZ2UucmVtb3ZlQ2xhc3MoJ2hhcy1lbXB0eVJlcXVpcmVkRmllbGQnKTtcblx0fVxuXG5cdGRhdGFDaGFuZ2VkID0gdHJ1ZTtcblx0aWYgKGVkaXRlZEZpbGVEYXRhLmJ1bGtFZGl0KSB7XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdFx0Zi5maWxlRGF0YS50aXRsZSA9ICQoJyN0aXRsZScpLnZhbCgpO1xuXHRcdH0pO1xuXHR9XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBDYXB0aW9uIHRvIHRoZSBjYXB0aW9uIGZpZWxkIG9yLCBzYXZlIGNhcHRpb24gaWYgY2FwdGlvbiBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gYWRqdXN0Q2FwdGlvbihjYXB0aW9uKSB7XG5cdCQoJyNjYXB0aW9uJykudmFsKGNhcHRpb24pLmNoYW5nZSgpO1xuXHR2YXIgZXZlbnQgPSBuZXcgVUlFdmVudCgnY2hhbmdlJyk7XG5cdC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcHRpb24nKS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cbi8vRnVuY3Rpb24gdG8gc2V0IERlc2NyaXB0aW9uIHRvIHRoZSBjYXB0aW9uIGZpZWxkIG9yLCBzYXZlIGNhcHRpb24gaWYgY2FwdGlvbiBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gc2F2ZUNhcHRpb24oKSB7XG5cdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmNhcHRpb24gPSAkKCcjY2FwdGlvbicpLnZhbCgpO1xuXHRkYXRhQ2hhbmdlZCA9IHRydWU7XG5cdGlmIChlZGl0ZWRGaWxlRGF0YS5idWxrRWRpdCkge1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdGYuZmlsZURhdGEuY2FwdGlvbiA9ICQoJyNjYXB0aW9uJykudmFsKCk7XG5cdFx0fSk7XG5cdH1cbn1cbmZ1bmN0aW9uIGFkanVzdERlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKSB7XG5cdCQoJyNkZXNjcmlwdGlvbicpLnZhbChkZXNjcmlwdGlvbikuY2hhbmdlKCk7XG5cdHZhciBldmVudCA9IG5ldyBVSUV2ZW50KCdjaGFuZ2UnKTtcblx0Ly9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzY3JpcHRpb24nKS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cbi8vRnVuY3Rpb24gdG8gc2V0IERlc2NyaXB0aW9uIHRvIHRoZSBjYXB0aW9uIGZpZWxkIG9yLCBzYXZlIGNhcHRpb24gaWYgY2FwdGlvbiBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gc2F2ZURlc2NyaXB0aW9uKCkge1xuXHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5kZXNjcmlwdGlvbiA9ICQoJyNkZXNjcmlwdGlvbicpLnZhbCgpO1xuXHRkYXRhQ2hhbmdlZCA9IHRydWU7XG5cdGlmIChlZGl0ZWRGaWxlRGF0YS5idWxrRWRpdCkge1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdGYuZmlsZURhdGEuZGVzY3JpcHRpb24gPSAkKCcjZGVzY3JpcHRpb24nKS52YWwoKTtcblx0XHR9KTtcblx0fVxufVxuZnVuY3Rpb24gYWRqdXN0UmVzb2x1dGlvbihyZXNvbHV0aW9uKSB7XG5cdCQoJyNyZXNvbHV0aW9uJykucHJvcCgnY2hlY2tlZCcsIHJlc29sdXRpb24pO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgRGVzY3JpcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlUmVzb2x1dGlvbigpIHtcblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuaGlnaFJlc29sdXRpb24gPSAkKCcjcmVzb2x1dGlvbicpLnByb3AoJ2NoZWNrZWQnKTtcblx0ZGF0YUNoYW5nZWQgPSB0cnVlO1xuXHRpZiAoZWRpdGVkRmlsZURhdGEuYnVsa0VkaXQpIHtcblx0XHRlZGl0ZWRGaWxlc0RhdGEuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0XHRmLmZpbGVEYXRhLmhpZ2hSZXNvbHV0aW9uID0gJCgnI3Jlc29sdXRpb24nKS5wcm9wKCdjaGVja2VkJyk7XG5cdFx0fSk7XG5cdH1cbn1cbmZ1bmN0aW9uIGFkanVzdEFsdFRleHQoYWx0VGV4dCkge1xuXHQkKCcjYWx0VGV4dCcpLnZhbChhbHRUZXh0KS5jaGFuZ2UoKTtcblx0dmFyIGV2ZW50ID0gbmV3IFVJRXZlbnQoJ2NoYW5nZScpO1xuXHQvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbHRUZXh0JykuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBEZXNjcmlwdGlvbiB0byB0aGUgY2FwdGlvbiBmaWVsZCBvciwgc2F2ZSBjYXB0aW9uIGlmIGNhcHRpb24gYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIHNhdmVBbHRUZXh0KCkge1xuXHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5hbHRUZXh0ID0gJCgnI2FsdFRleHQnKS52YWwoKTtcblx0ZGF0YUNoYW5nZWQgPSB0cnVlO1xuXHRpZiAoZWRpdGVkRmlsZURhdGEuYnVsa0VkaXQpIHtcblx0XHRlZGl0ZWRGaWxlc0RhdGEuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0XHRmLmZpbGVEYXRhLmFsdFRleHQgPSAkKCcjYWx0VGV4dCcpLnZhbCgpO1xuXHRcdH0pO1xuXHR9XG59XG5cbi8vRnVuY3Rpb24gdG8gc2V0IEZvY2FsUG9pbnQgY29vcmRpbmF0ZXMgb3IsIHNhdmUgZm9jYWwgcG9pbnQgaWYgZm9jYWxwb2ludCBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gYWRqdXN0Rm9jYWxQb2ludChmb2NhbFBvaW50KSB7XG5cdHZhciBmcCA9ICQoJyNmb2NhbFBvaW50Jyk7XG5cdHZhciBpbWcgPSAkKCcjcHJldmlld0ltZycpO1xuXHRpZiAoZm9jYWxQb2ludCkge1xuXHRcdHZhciBsZWZ0ID0gZm9jYWxQb2ludC5sZWZ0ICogaW1nLndpZHRoKCkgLSBmcC53aWR0aCgpLzIsXG5cdFx0dG9wID0gZm9jYWxQb2ludC50b3AgKiBpbWcuaGVpZ2h0KCkgLSBmcC5oZWlnaHQoKS8yO1xuXG5cdFx0bGVmdCA9IGxlZnQgPD0gMCA/ICc1MCUnIDogbGVmdDtcblx0XHR0b3AgPSB0b3AgPD0gMCA/ICc1MCUnIDogdG9wO1xuXHRcdGZwLmNzcygnbGVmdCcsIGxlZnQpLmNzcygndG9wJywgdG9wKTtcblx0fSBlbHNlIHtcblx0XHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5mb2NhbFBvaW50ID0ge1xuXHRcdFx0bGVmdDogKChmcC5wb3NpdGlvbigpLmxlZnQgKyBmcC53aWR0aCgpLzIpL2ltZy53aWR0aCgpKSxcblx0XHRcdHRvcDogKChmcC5wb3NpdGlvbigpLnRvcCArIGZwLmhlaWdodCgpLzIpL2ltZy5oZWlnaHQoKSlcblx0XHR9O1xuXHR9XG5cdGZwLmNzcygncG9zaXRpb24nLCAnYWJzb2x1dGUnKTtcbn1cblxuLy9GdW5jdGlvbiB0byBzZXQgRm9jYWxSZWN0IGNvb3JkaW5hdGVzIG9yLCBzYXZlIGZvY2FsIHJlY3QgaWYgZm9jYWxwb2ludCBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gYWRqdXN0Rm9jYWxSZWN0KGZvY2FsUG9pbnQpIHtcblx0dmFyIGZyID0gJCgnI2ZvY2FsUmVjdCcpO1xuXHR2YXIgaW1nID0gJCgncHJldmlld0ltZycpO1xuXHRpZiAoZm9jYWxQb2ludCkge1xuXHRcdHZhciBsZWZ0ID0gZm9jYWxQb2ludC5sZWZ0ICogaW1nLndpZHRoKCkgLSBmci53aWR0aCgpLzIsXG5cdFx0dG9wID0gZm9jYWxQb2ludC50b3AgKiBpbWcuaGVpZ2h0KCkgLSBmci5oZWlnaHQoKS8yO1xuXG5cdFx0bGVmdCA9IGxlZnQgPCAwID8gMCA6IGxlZnQgPiBpbWcud2lkdGgoKSA/IGltZy53aWR0aCgpIC0gZnIud2lkdGgoKS8yIDogbGVmdDtcblx0XHR0b3AgPSB0b3AgPCAwID8gMCA6IHRvcCA+IGltZy5oZWlnaHQoKSA/IGltZy5oZWlnaHQoKSAtIGZyLmhlaWdodCgpLzIgOiB0b3A7XG5cblx0XHRmci5jc3MoJ2xlZnQnLCBsZWZ0KVxuXHRcdC5jc3MoJ3RvcCcsIHRvcCk7XG5cdH0gZWxzZSB7XG5cdFx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuZm9jYWxQb2ludCA9IHtcblx0XHRcdGxlZnQ6ICgoZnAucG9zaXRpb24oKS5sZWZ0ICsgZnAud2lkdGgoKS8yKS9pbWcud2lkdGgoKSksXG5cdFx0XHR0b3A6ICgoZnAucG9zaXRpb24oKS50b3AgKyBmcC5oZWlnaHQoKS8yKS9pbWcuaGVpZ2h0KCkpXG5cdFx0fTtcblx0fVxufVxuXG5cbmZ1bmN0aW9uIHNob3dGaWxlcyhmaWxlcykge1xuXHRkYXRhQ2hhbmdlZCA9IGZhbHNlO1xuXHRzY3JvbGxQb3NpdGlvbiA9ICQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcblx0Ly9TaG93IGluaXRpYWwgZWRpdCBzY3JlZW4gZm9yIHNpbmdsZSBpbWFnZS5cblx0JCgnLnByJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbiB2aWRlbyBidWxrJylcblx0LmFkZENsYXNzKCdtb2RhbCcpO1xuXHQkKCcjd3JhcHBlcicpLmFkZENsYXNzKCdvdmVyZmxvdycpO1xuXG5cdC8vUmVtb3ZlIGFsbCBtdWx0aXBsZSBpbWFnZXMgc3R5bGUgYXR0cmlidXRlc1xuXHQkKCcucHIgLnByZXZpZXcnKS5yZW1vdmVDbGFzcygncHJldmlld19zdHlsZV9tdWx0aSBoaWRkZW4nKTtcblx0JCgnLnByIC5pcCcpLnJlbW92ZUNsYXNzKCdpcF9zdHlsZV9tdWx0aScpO1xuXHQkKCcjc2F2ZUNoYW5nZXMnKS50ZXh0KCdTYXZlJyk7XG5cdC8vJCgnI2lwX190aXRsZScpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0JCgnLnByIC5pbWFnZXMnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdCQoJyN0aXRsZScpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0JCgnI3RpdGxlJykucGFyZW50KCkuY2hpbGRyZW4oJ2xhYmVsJykuYWRkQ2xhc3MoJ3JlcXVpZXJlZCcpO1xuXHQkKCcjdGl0bGUnKS5wcm9wKCdyZXF1aXJlZCcsIHRydWUpO1xuXG5cdGZ1bmN0aW9uIHJlc2l6ZUltYWdlV3JhcHBlcigpIHtcblx0XHR2YXIgaW1hZ2VzV3JhcHBlcldpZHRoID0gJCgnLmltYWdlc19fd3JhcHBlcicpLndpZHRoKCk7XG5cdFx0aW1hZ2VzV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCA8IDYwMCA/ICQoJy5pbWFnZXNfX2NvbnRhaW5lciAuaW1hZ2UnKS5sZW5ndGggKiAxMDAgOiAkKCcuaW1hZ2VzX19jb250YWluZXIgLmltYWdlJykubGVuZ3RoICogMTIwO1xuXHRcdGlmIChpbWFnZXNXcmFwcGVyV2lkdGggPiBpbWFnZXNXaWR0aCkge1xuXHRcdFx0JCgnLmltYWdlc19fc2Nyb2xsLWxlZnQsIC5pbWFnZXNfX3Njcm9sbC1yaWdodCcpLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCgnLmltYWdlc19fY29udGFpbmVyJykuY3NzKCd3aWR0aCcsIGltYWdlc1dpZHRoLnRvU3RyaW5nKCkgKyAncHgnKTtcblx0XHRcdCQoJy5pbWFnZXNfX3Njcm9sbC1sZWZ0LCAuaW1hZ2VzX19zY3JvbGwtcmlnaHQnKS5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuXHRcdH1cblx0fVxuXG5cdGlmIChmaWxlcy5sZW5ndGggPiAxKSB7XG5cdFx0dmFyIGltZ0NvbnRhaW5lciA9ICQoJy5wciAuaW1hZ2VzX19jb250YWluZXInKTtcblx0XHRpbWdDb250YWluZXIuZW1wdHkoKTtcblxuXHRcdC8vQWRkIGltYWdlcyBwcmV2aWVzIHRvIHRoZSBjb250YWluZXJcblx0XHRmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdHZhclx0aW1hZ2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZSBpbWFnZV9zdHlsZV9tdWx0aScpLmNsaWNrKGhhbmRsZUltYWdlU3dpdGNoKSxcblx0XHRcdHJlcXVpcmVkTWFyayA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlX19yZXF1aXJlZC1tYXJrJyksXG5cdFx0XHRmaWxlSW5kZXggPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdoaWRkZW4gZmlsZV9faWQnKS50ZXh0KGYuZmlsZURhdGEuaWQpLmF0dHIoJ2RhdGEtaWQnLCBmLmZpbGVEYXRhLmlkKTtcblx0XHRcdGltYWdlLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIGYuZmlsZURhdGEudXJsICsgJyknKS5hcHBlbmQocmVxdWlyZWRNYXJrLCBmaWxlSW5kZXgpO1xuXHRcdFx0aW1nQ29udGFpbmVyLmFwcGVuZChpbWFnZSk7XG5cdFx0fSk7XG5cblx0XHQvL0FkZCBhY3RpdmUgc3RhdGUgdG8gdGhlIHByZXZpZXcgb2YgdGhlIGZpcnN0IGltYWdlXG5cdFx0dmFyIGZpcnN0SW1hZ2UgPSAkKCcuaW1hZ2VzX19jb250YWluZXIgLmltYWdlJykuZmlyc3QoKTtcblx0XHRmaXJzdEltYWdlLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblxuXHRcdCQoJy5wciAuaW1hZ2VzJykuYWRkQ2xhc3MoJ2ltYWdlc19zdHlsZV9tdWx0aScpLnJlbW92ZUNsYXNzKCdoaWRkZW4gaW1hZ2VzX3N0eWxlX2J1bGsnKTtcblxuXHRcdCQoJy5wciAucHJldmlldycpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKS5hZGRDbGFzcygncHJldmlld19zdHlsZV9tdWx0aScpO1xuXHRcdCQoJy5wciAuaXAnKS5hZGRDbGFzcygnaXBfc3R5bGVfbXVsdGknKTtcblxuXHRcdC8vQWRqdXN0IGltYWdlIHByZXZpZXdzIGNvbnRhaW5lclxuXHRcdCQoJyNpbWFnZXNfX3dyYXBwZXInKS5zY3JvbGxMZWZ0KDApO1xuXHRcdCQod2luZG93KS5yZXNpemUocmVzaXplSW1hZ2VXcmFwcGVyKTtcblx0XHRyZXNpemVJbWFnZVdyYXBwZXIoKTtcblxuXHRcdC8vQWRkIGFjdGlvbnMgdG8gc2Nyb2xsIGJ1dHRvbnNcblx0XHQkKCcuaW1hZ2VzX19zY3JvbGwtbGVmdCcpLnVuYmluZCgnY2xpY2snKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0JCgnI2ltYWdlc19fd3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogJy09NDgwJyB9LCA2MDApO1xuXHRcdH0pO1xuXHRcdCQoJy5pbWFnZXNfX3Njcm9sbC1yaWdodCcpLnVuYmluZCgnY2xpY2snKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0JCgnI2ltYWdlc19fd3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogJys9NDgwJyB9LCA2MDApO1xuXHRcdH0pO1xuXHR9XG5cdGhpZGVMb2FkZXIoKTtcblx0c2V0TW9kYWxLZXlib2FyZEFjdGlvbnMoc2F2ZUltYWdlRWRpdCwgY2FuY2VsSW1hZ2VFZGl0KTtcblxufVxuZnVuY3Rpb24gZWRpdEZpbGVzKGZpbGVzKSB7XG5cdGVkaXRlZEZpbGVzRGF0YSA9IFtdLmNvbmNhdChmaWxlcyk7XG5cblx0aWYgKGVkaXRlZEZpbGVzRGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0ZWRpdGVkRmlsZURhdGEgPSBlZGl0ZWRGaWxlc0RhdGFbMF07XG5cdFx0bG9hZEZpbGUoZWRpdGVkRmlsZURhdGEpO1xuXHRcdHNob3dGaWxlcyhlZGl0ZWRGaWxlc0RhdGEpO1xuXHR9XG59XG5cblxuLy9CdWxrIEVkaXRcbmZ1bmN0aW9uIGJ1bGtFZGl0RmlsZXMoZmlsZXMsIHR5cGUpIHtcblx0dmFyIGNsb25lZEdhbGxlcnlPYmplY3RzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShnYWxsZXJ5T2JqZWN0cykpO1xuXHR2YXIgZmlsZXNUeXBlO1xuXHRlZGl0ZWRGaWxlc0RhdGEgPSBbXTsgLy9DbGVhciBmaWxlcyBkYXRhIHRoYXQgcG9zc2libHkgY291bGQgYmUgaGVyZVxuXG5cdC8vT2J0YWluIGZpbGVzIGRhdGEgZm9yIGZpbGVzIHRoYXQgc2hvdWxkIGJlIGVkaXRlZFxuXHRmaWxlcy5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG5cdFx0dmFyIGZpbGUgPSBjbG9uZWRHYWxsZXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuXHRcdFx0cmV0dXJuIGYuZmlsZURhdGEuaWQgPT09ICQoZWwpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcblx0XHR9KVswXTtcblx0XHRlZGl0ZWRGaWxlc0RhdGEucHVzaChmaWxlKTtcblx0fSk7XG5cblx0aWYgKGVkaXRlZEZpbGVzRGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0c3dpdGNoIChlZGl0ZWRGaWxlc0RhdGFbMF0uZmlsZURhdGEudHlwZSkge1xuXHRcdFx0Y2FzZSAnaW1hZ2UnOlxuXHRcdFx0ZWRpdGVkRmlsZURhdGEgPSB7XG5cdFx0XHRcdGZpbGVEYXRhOiB7XG5cdFx0XHRcdFx0dXJsOiAnJyxcblx0XHRcdFx0XHRmb2NhbFBvaW50OiB7XG5cdFx0XHRcdFx0XHRsZWZ0OiAwLjUsXG5cdFx0XHRcdFx0XHR0b3A6IDAuNVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aWQ6ICcnLFxuXHRcdFx0XHRcdGNvbG9yOiAnJyxcblx0XHRcdFx0XHR0aXRsZTogJycsXG5cdFx0XHRcdFx0Y2FwdGlvbjogJycsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246ICcnLFxuXHRcdFx0XHRcdGhpZ2hSZXNvbHV0aW9uOiBmYWxzZSxcblx0XHRcdFx0XHRjYXRlZ29yaWVzOiAnJyxcblx0XHRcdFx0XHR0YWdzOiAnJyxcblx0XHRcdFx0XHRhbHRUZXh0OiAnJyxcblx0XHRcdFx0XHRjcmVkaXQ6ICcnLFxuXHRcdFx0XHRcdGNvcHlyaWdodDogJycsXG5cdFx0XHRcdFx0cmVmZXJlbmNlOiB7XG5cdFx0XHRcdFx0XHRzZXJpZXM6ICcnLFxuXHRcdFx0XHRcdFx0c2Vhc29uOiAnJyxcblx0XHRcdFx0XHRcdGVwaXNvZGU6ICcnXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0eXBlOiAnaW1hZ2UnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJ1bGtFZGl0OiB0cnVlXG5cdFx0XHR9O1xuXHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgJ3ZpZGVvJzpcblx0XHRcdGVkaXRlZEZpbGVEYXRhID0ge1xuXHRcdFx0XHRmaWxlRGF0YToge1xuXHRcdFx0XHRcdHVybDogJycsXG5cdFx0XHRcdFx0cGxheWVyOiAnJyxcblx0XHRcdFx0XHR0eXBlOiAndmlkZW8nXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJ1bGtFZGl0OiB0cnVlXG5cdFx0XHR9O1xuXHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cblx0XHRsb2FkRmlsZShlZGl0ZWRGaWxlRGF0YSk7XG5cdFx0c2hvd0J1bGtGaWxlcyhlZGl0ZWRGaWxlc0RhdGEpO1xuXG5cdH1cbn1cbmZ1bmN0aW9uIHNob3dCdWxrRmlsZXMoZmlsZXMpIHtcblx0ZGF0YUNoYW5nZWQgPSBmYWxzZTtcblx0c2Nyb2xsUG9zaXRpb24gPSAkKCdib2R5Jykuc2Nyb2xsVG9wKCk7XG5cdC8vU2hvdyBpbml0aWFsIGVkaXQgc2NyZWVuIGZvciBzaW5nbGUgaW1hZ2UuXG5cdCQoJy5wcicpLnJlbW92ZUNsYXNzKCdoaWRkZW4gdmlkZW8nKVxuXHQuYWRkQ2xhc3MoJ21vZGFsIGJ1bGsnKTtcblx0JCgnI3dyYXBwZXInKS5hZGRDbGFzcygnb3ZlcmZsb3cnKTtcblxuXHQvL1JlbW92ZSBhbGwgbXVsdGlwbGUgaW1hZ2VzIHN0eWxlIGF0dHJpYnV0ZXNcblx0JCgnLnByIC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ3ByZXZpZXdfc3R5bGVfbXVsdGkgaGlkZGVuJyk7XG5cdCQoJy5wciAuaXAnKS5yZW1vdmVDbGFzcygnaXBfc3R5bGVfbXVsdGknKTtcblx0JCgnI3NhdmVDaGFuZ2VzJykudGV4dCgnU2F2ZScpO1xuXHQkKCcjdGl0bGUnKS5wYXJlbnQoKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdCQoJyN0aXRsZScpLnJlbW92ZVByb3AoJ3JlcXVpcmVkJyk7XG5cdCQoJyN0aXRsZScpLnBhcmVudCgpLmNoaWxkcmVuKCdsYWJlbCcpLnJlbW92ZUNsYXNzKCdyZXF1aWVyZWQnKTtcblxuXHR2YXIgaW1nQ29udGFpbmVyID0gJCgnLnByIC5pbWFnZXNfX2NvbnRhaW5lcicpO1xuXHRpbWdDb250YWluZXIuZW1wdHkoKTtcblxuXHQvL0FkZCBpbWFnZXMgcHJldmllcyB0byB0aGUgY29udGFpbmVyXG5cdGZpbGVzLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdHZhclx0aW1hZ2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZSBpbWFnZV9zdHlsZV9idWxrJyksXG5cdFx0ZmlsZUluZGV4ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaGlkZGVuIGZpbGVfX2lkJykudGV4dChmLmZpbGVEYXRhLmlkKTtcblx0XHRpbWFnZS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyBmLmZpbGVEYXRhLnVybCArICcpJykuYXBwZW5kKGZpbGVJbmRleCk7XG5cdFx0aW1nQ29udGFpbmVyLmFwcGVuZChpbWFnZSk7XG5cdH0pO1xuXG5cdCQoJy5wciAuaW1hZ2VzJykuYWRkQ2xhc3MoJ2ltYWdlc19zdHlsZV9idWxrJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbiBpbWFnZXNfc3R5bGVfbXVsdGknKTtcblx0JCgnLnByIC5wcmV2aWV3JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdGhpZGVMb2FkZXIoKTtcblx0c2V0TW9kYWxLZXlib2FyZEFjdGlvbnMoc2F2ZUltYWdlRWRpdCwgY2FuY2VsSW1hZ2VFZGl0KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQnVsa0VkaXRCdXR0b25DbGljayhlKSB7XG5cdCQoZS50YXJnZXQpLmJsdXIoKTtcblx0dmFyIGZpbGVzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkJyksXG5cdG51bWJlck9mU2VsZWN0ZWRJbWFnZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuanMtaW1nRmlsZVR5cGUuc2VsZWN0ZWQnKS5sZW5ndGgsXG5cdG51bWJlck9mU2VsZWN0ZWRWaWRlb3MgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuanMtdmlkZW9GaWxlVHlwZS5zZWxlY3RlZCcpLmxlbmd0aDtcblxuXHRpZiAobnVtYmVyT2ZTZWxlY3RlZEltYWdlcyAmJiBudW1iZXJPZlNlbGVjdGVkVmlkZW9zKSB7XG5cdFx0bmV3IE1vZGFsKHtcblx0XHRcdHRpdGxlOiAnWW91IGNhblxcJ3QgYnVsayBlZGl0IGltYWdlcyBhbmQgdmlkZW9zJyxcblx0XHRcdHRleHQ6ICdZb3UgY2FuXFwndCBidWxrIGVkaXQgaW1hZ2VzIGFuZCB2aWRlb3MgYXQgb25jZS4gUGxlYXNlIHNlbGVjdCBmaWxlcyBvZiB0aGUgc2FtZSB0eXBlIGFuZCB0cnkgYWdhaW4uJyxcblx0XHRcdGNvbmZpcm1UZXh0OiAnT2snLFxuXHRcdFx0b25seUNvbmZpcm06IHRydWVcblx0XHR9KTtcblx0fVxuXHRlbHNlIHtcblx0XHRpZiAobnVtYmVyT2ZTZWxlY3RlZFZpZGVvcykge1xuXHRcdFx0YnVsa0VkaXRGaWxlcyhmaWxlcywgJ3ZpZGVvcycpO1xuXHRcdH0gZWxzZSBpZihudW1iZXJPZlNlbGVjdGVkSW1hZ2VzKSB7XG5cdFx0XHRidWxrRWRpdEZpbGVzKGZpbGVzLCAnaW1hZ2VzJyk7XG5cdFx0fVxuXHR9XG59XG5cbi8vSGVscCBmdW5jdGlvblxuZnVuY3Rpb24gZmlsZUJ5SWQoaWQsIGZpbGVzKSB7XG5cdGZpbGVzRmlsdGVyZWQgPSBmaWxlcy5maWx0ZXIoZnVuY3Rpb24oZikge1xuXHRcdHJldHVybiBmLmZpbGVEYXRhLmlkID09PSBpZDtcblx0fSk7XG5cdHJldHVybiBmaWxlc0ZpbHRlcmVkWzBdO1xufVxuXG4vL1NhdmUgZmlsZVxuZnVuY3Rpb24gc2F2ZUZpbGUoZmlsZXMsIGZpbGUpIHtcblx0ZmlsZXMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0aWYgKGYuZmlsZURhdGEuaWQgPT09IGZpbGUuZmlsZURhdGEuaWQpIHtcblx0XHRcdGYgPSBmaWxlO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHN3aXRjaEltYWdlKGltYWdlKSB7XG5cdCQoJy5wcmV2aWV3X19pbWFnZS13cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2lzLXNsaWRpbmdMZWZ0IGlzLXNsaWRpbmdSaWdodCcpO1xuXHR2YXIgbmV3RmlsZUlkID0gaW1hZ2UuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpLFxuXHRuZXdGaWxlID0gZmlsZUJ5SWQobmV3RmlsZUlkLCBlZGl0ZWRGaWxlc0RhdGEpLFxuXHRuZXdJbmRleCA9IGltYWdlLmluZGV4KCksXG5cdGN1cnJlbnRJbWFnZSA9ICQoJy5pbWFnZS5pcy1hY3RpdmUnKSxcblx0Y3VycmVudEluZGV4ID0gY3VycmVudEltYWdlLmluZGV4KCksXG5cdGN1cnJlbnRGaWxlID0gZmlsZUJ5SWQoY3VycmVudEltYWdlLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKSwgZWRpdGVkRmlsZXNEYXRhKSxcblx0YmFja0ltYWdlID0gJCgnI3ByZXZpZXdJbWdCYWNrJyksXG5cdHByZXZpZXdJbWFnZSA9ICQoJyNwcmV2aWV3SW1nJyk7XG5cblx0c2F2ZUZpbGUoZWRpdGVkRmlsZXNEYXRhLCBlZGl0ZWRGaWxlRGF0YSk7XG5cdGVkaXRlZEZpbGVEYXRhID0gbmV3RmlsZTtcblx0bG9hZEZpbGUoZWRpdGVkRmlsZURhdGEpO1xuXG5cdGN1cnJlbnRJbWFnZS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdGltYWdlLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblxuXHRpZiAoY3VycmVudEluZGV4ID4gbmV3SW5kZXgpIHtcblx0XHQkKCcucHJldmlld19faW1hZ2Utd3JhcHBlcicpLmFkZENsYXNzKCdpcy1zbGlkaW5nTGVmdCcpO1xuXHR9IGVsc2Uge1xuXHRcdCQoJy5wcmV2aWV3X19pbWFnZS13cmFwcGVyJykuYWRkQ2xhc3MoJ2lzLXNsaWRpbmdSaWdodCcpO1xuXHR9XG5cblx0dmFyIGltYWdlQ29udGFpbmVyID0gaW1hZ2UucGFyZW50cygnLmltYWdlc19fY29udGFpbmVyJyksXG5cdGltYWdlV3JhcHBlciA9IGltYWdlLnBhcmVudHMoJy5pbWFnZXNfX3dyYXBwZXInKSxcblx0aW1hZ2VMZWZ0RW5kID0gaW1hZ2VDb250YWluZXIucG9zaXRpb24oKS5sZWZ0ICsgaW1hZ2UucG9zaXRpb24oKS5sZWZ0LFxuXHRpbWFnZVJpZ2h0RW5kID0gaW1hZ2VDb250YWluZXIucG9zaXRpb24oKS5sZWZ0ICsgaW1hZ2UucG9zaXRpb24oKS5sZWZ0ICsgaW1hZ2Uud2lkdGgoKTtcblxuXHRpZiAoaW1hZ2VMZWZ0RW5kIDwgMCkge1xuXHRcdCQoJyNpbWFnZXNfX3dyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6IGltYWdlLnBvc2l0aW9uKCkubGVmdCAtIDMwfSwgNDAwKTtcblx0fSBlbHNlIGlmIChpbWFnZVJpZ2h0RW5kID4gaW1hZ2VXcmFwcGVyLndpZHRoKCkpIHtcblx0XHQkKCcjaW1hZ2VzX193cmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiBpbWFnZS5wb3NpdGlvbigpLmxlZnQgKyBpbWFnZS53aWR0aCgpIC0gaW1hZ2VXcmFwcGVyLndpZHRoKCkgKyA1MH0sIDQwMCk7XG5cdH1cblxuXHQvL0Nsb3NlIGFsbCBwcmV2aWV3cyBpZiB0aGVyZSBpcyBvcGVuXG5cdGhpZGVBbGxQcmV2aWV3cygpO1xuXHQvLyBBZGp1c3QgZm9jYWwgcmVjdGFuZ2xlXG5cdGFkanVzdFJlY3QoJCgnLnB1cnBvc2VzX19jb250YWluZXIgLnB1cnBvc2UtaW1nJykuZmlyc3QoKSk7XG5cdCQoJyNwdXJwb3NlV3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogJzAnIH0sIDgwMCk7XG59XG5mdW5jdGlvbiBoYW5kbGVJbWFnZVN3aXRjaChlKSB7XG5cdHN3aXRjaEltYWdlKCQoZS50YXJnZXQpKTtcbn1cblxuLy9GdW5jdGlvbiBmb3IgaGFuZGxlIEVkaXQgQnV0dG9uIGNsaWNrc1xuZnVuY3Rpb24gaGFuZGxlRmlsZWRFZGl0QnV0dG9uQ2xpY2soZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR2YXIgZmlsZUVsZW1lbnQgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpO1xuXG5cdHZhciBmaWxlID0gZ2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcblx0XHRyZXR1cm4gZi5maWxlRGF0YS5pZCA9PT0gJChmaWxlRWxlbWVudCkuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpO1xuXHR9KTtcblxuXHRlZGl0RmlsZXMoZmlsZSk7XG59XG5mdW5jdGlvbiBoYW5kbGVNdWx0aUVkaXRCdXR0b25DbGljayhlKSB7XG5cdCQoZS50YXJnZXQpLmJsdXIoKTtcblx0dmFyIGZpbGVzRWxlbWVudHMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKSxcblx0Y2xvbmVkR2FsbGVyeU9iamVjdHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGdhbGxlcnlPYmplY3RzKSksXG5cdGZpbGVzID0gW10sXG5cdG51bWJlck9mU2VsZWN0ZWRJbWFnZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuanMtaW1nRmlsZVR5cGUuc2VsZWN0ZWQnKS5sZW5ndGgsXG5cdG51bWJlck9mU2VsZWN0ZWRWaWRlb3MgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuanMtdmlkZW9GaWxlVHlwZS5zZWxlY3RlZCcpLmxlbmd0aDtcblxuXHRpZiAobnVtYmVyT2ZTZWxlY3RlZEltYWdlcyAmJiBudW1iZXJPZlNlbGVjdGVkVmlkZW9zKSB7XG5cdFx0bmV3IE1vZGFsKHtcblx0XHRcdHRpdGxlOiAnWW91IGNhblxcJ3QgbXVsdGkgZWRpdCBpbWFnZXMgYW5kIHZpZGVvcycsXG5cdFx0XHR0ZXh0OiAnWW91IGNhblxcJ3QgbXVsdGkgZWRpdCBpbWFnZXMgYW5kIHZpZGVvcyBhdCBvbmNlLiBQbGVhc2Ugc2VsZWN0IGZpbGVzIG9mIHRoZSBzYW1lIHR5cGUgYW5kIHRyeSBhZ2Fpbi4nLFxuXHRcdFx0Y29uZmlybVRleHQ6ICdPaycsXG5cdFx0XHRvbmx5Q29uZmlybTogdHJ1ZVxuXHRcdH0pO1xuXHR9XG5cdGVsc2Uge1xuXHRcdC8vT2J0YWluIGZpbGVzIGRhdGEgZm9yIGZpbGVzIHRoYXQgc2hvdWxkIGJlIGVkaXRlZFxuXHRcdGZpbGVzRWxlbWVudHMuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuXHRcdFx0dmFyIGZpbGUgPSBbXS5jb25jYXQoY2xvbmVkR2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcblx0XHRcdFx0cmV0dXJuIGYuZmlsZURhdGEuaWQgPT09ICQoZWwpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcblx0XHRcdH0pKVswXTtcblx0XHRcdGZpbGVzLnB1c2goZmlsZSk7XG5cdFx0fSk7XG5cblx0XHRlZGl0RmlsZXMoZmlsZXMpO1xuXHR9XG59XG5cblxuZnVuY3Rpb24gY2FuY2VsSW1hZ2VFZGl0KCkge1xuXG5cdC8vIFVzZSBkYXRhQ2hhbmdlZCB0byBjaGVjayBpZiBhbnkgZGF0YSBoYXMgY2hhbmdlZCBhbmQgc2hvdyB0aGUgbW9kYWwuIEN1cnJlbnRseVxuXHQvLyB0aGUgdmFsdWUgaXMgbm90IGJlaW5nIHNldCBjb3JyZW50bHkgc28gd2UgYXJlIGFsd2F5cyBzaG93aW5nIHRoZSBkaWFsb2cuXG5cdC8vaWYgKGRhdGFDaGFuZ2VkKSB7XG5cdGlmICh0cnVlKSB7XG5cdFx0bmV3IE1vZGFsKHtcblx0XHRcdGRpYWxvZzogdHJ1ZSxcblx0XHRcdHRpdGxlOiAnQ2FuY2VsIENoYW5nZXM/Jyxcblx0XHRcdHRleHQ6ICdBbnkgdW5zYXZlZCBjaGFuZ2VzIHlvdSBtYWRlIHdpbGwgYmUgbG9zdC4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGNhbmNlbD8nLFxuXHRcdFx0Y29uZmlybVRleHQ6ICdDYW5jZWwnLFxuXHRcdFx0Y29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNsb3NlRWRpdFNjcmVlbigpO1xuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG5cdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFbnRlcktleWRvd24pO1xuXHRcdFx0fSxcblx0XHRcdGNhbmNlbEFjdGlvbjogc2V0TW9kYWxLZXlib2FyZEFjdGlvbnMoc2F2ZUltYWdlRWRpdCwgY2FuY2VsSW1hZ2VFZGl0KVxuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdGNsb3NlRWRpdFNjcmVlbigpO1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcblx0fVxufVxuZnVuY3Rpb24gc2F2ZUltYWdlRWRpdCgpIHtcblx0dmFyIGVtcHR5UmVxdWlyZWRGaWVsZCA9IGZhbHNlLFxuXHRlbXB0eUltYWdlO1xuXHR2YXIgZW1wdHlGaWVsZHMgPSBjaGVja0ZpZWxkcygnLnByIGxhYmVsLnJlcXVpZXJlZCcpO1xuXHRpZiAoZW1wdHlGaWVsZHMgfHwgZWRpdGVkRmlsZURhdGEuZmlsZURhdGEudHlwZSA9PT0gJ3ZpZGVvJykge1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGZkKSB7XG5cdFx0XHRpZiAoZmQuZmlsZURhdGEudGl0bGUgPT09ICcnICYmICFlbXB0eVJlcXVpcmVkRmllbGQpIHtcblx0XHRcdFx0ZW1wdHlSZXF1aXJlZEZpZWxkID0gdHJ1ZTtcblx0XHRcdFx0ZW1wdHlJbWFnZSA9ICQoJy5pbWFnZS5pbWFnZV9zdHlsZV9tdWx0aSAuZmlsZV9faWRbZGF0YS1pZD1cIicgKyBmZC5maWxlRGF0YS5pZCArICdcIl0nKS5wYXJlbnRzKCcuaW1hZ2UnKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChlbXB0eVJlcXVpcmVkRmllbGQpIHtcblx0XHRcdHN3aXRjaEltYWdlKGVtcHR5SW1hZ2UpO1xuXHRcdFx0JCgnLmpzLXJlcXVpcmVkJykubm90KCcuanMtaGFzVmFsdWUnKS5maXJzdCgpLmFkZENsYXNzKCdpbnB1dF9zdGF0ZV9lcnIgaXMtYmxpbmtpbmcnKS5mb2N1cygpO1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0aWYgKGUuYW5pbWF0aW9uTmFtZSA9PT0gJ3RleHRmaWVsZC1mb2N1cy1ibGluaycpIHskKGUudGFyZ2V0KS5wYXJlbnQoKS5maW5kKCcuaXMtYmxpbmtpbmcnKS5yZW1vdmVDbGFzcygnaXMtYmxpbmtpbmcnKTt9XG5cdFx0XHR9KTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgY2xvbmVkRWRpdGVkRmlsZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGVkaXRlZEZpbGVzRGF0YSkpO1xuXHRcdFx0Y2xvbmVkRWRpdGVkRmlsZXMuZm9yRWFjaChmdW5jdGlvbihmZCkge1xuXHRcdFx0XHR2YXIgZmlsZSA9IGdhbGxlcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGYuZmlsZURhdGEuaWQgPT09IGZkLmZpbGVEYXRhLmlkO1xuXHRcdFx0XHR9KVswXTtcblx0XHRcdFx0dmFyIGZpbGVJbmRleCA9IGdhbGxlcnlPYmplY3RzLmluZGV4T2YoZmlsZSk7XG5cblx0XHRcdFx0Z2FsbGVyeU9iamVjdHMgPSBnYWxsZXJ5T2JqZWN0cy5zbGljZSgwLCBmaWxlSW5kZXgpLmNvbmNhdChbZmRdKS5jb25jYXQoZ2FsbGVyeU9iamVjdHMuc2xpY2UoZmlsZUluZGV4ICsgMSkpO1xuXG5cdFx0XHR9KTtcblx0XHRcdHNob3dOb3RpZmljYXRpb24oJ1RoZSBjaGFuZ2UgaW4gdGhlIG1ldGFkYXRhIGlzIHNhdmVkIHRvIHRoZSBhc3NldC4nKTtcblx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcblx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFbnRlcktleWRvd24pO1xuXHRcdFx0d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7Y2xvc2VFZGl0U2NyZWVuKCk7fSwgMjAwMCk7XG5cdFx0XHRjb25zb2xlLmxvZyhnYWxsZXJ5T2JqZWN0cyk7XG5cdFx0XHRkZXNlbGVjdEFsbCgpO1xuXHRcdFx0dXBkYXRlR2FsbGVyeSgpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBoaWRlQWxsUHJldmlld3MoKSB7XG4gICQoJyNwdXJwb3NlcycpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XG4gICQoJyNwdXJwb3NlcycpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcbiAgJCgnI3ByZXZpZXdJbWFnZScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgJCgnI3ByZXZpZXdDb250cm9scycpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblxuICAvL0NoYW5nZSBidXR0b24gdGV4dCwgaWNvbiBhbmQgY2xpY2sgaGFuZGxlclxuICAkKCcjc2hvd1ByZXZpZXcnKS5vZmYoJ2NsaWNrJywgaGlkZUFsbFByZXZpZXdzKS5jbGljayhzaG93QWxsUHJldmlld3MpO1xuICAkKCcjc2hvd1ByZXZpZXcgc3BhbicpLnRleHQoJ1ZpZXcgQWxsJyk7XG4gICQoJyNzaG93UHJldmlldyBpJykucmVtb3ZlQ2xhc3MoJ2ZhLWFycm93LWRvd24nKS5hZGRDbGFzcygnZmEtYXJyb3ctdXAnKTtcbn1cblxuZnVuY3Rpb24gc2hvd0FsbFByZXZpZXdzKCkge1xuICAkKCcjcHVycG9zZXMnKS5hZGRDbGFzcygnaXMtb3BlbicpO1xuICAkKCcjcHVycG9zZXMnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG4gICQoJyNwcmV2aWV3SW1hZ2UnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICQoJyNwcmV2aWV3Q29udHJvbHMnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cbiAgLy9DaGFuZ2UgYnV0dG9uIHRleHQsIGljb24gYW5kIGNsaWNrIGhhbmRsZXJcbiAgJCgnI3Nob3dQcmV2aWV3Jykub2ZmKCdjbGljaycsIHNob3dBbGxQcmV2aWV3cykuY2xpY2soaGlkZUFsbFByZXZpZXdzKTtcbiAgJCgnI3Nob3dQcmV2aWV3IHNwYW4nKS50ZXh0KCdDb2xsYXBzZScpO1xuICAkKCcjc2hvd1ByZXZpZXcgaScpLnJlbW92ZUNsYXNzKCdmYS1hcnJvdy11cCcpLmFkZENsYXNzKCdmYS1hcnJvdy1kb3duJyk7XG5cbiAgLy8gQWRqdXN0IHByZXZpZXdzIGNsaWNrIGZpbmN0aW9uXG4gICQoJy5wdXJwb3Nlc19fY29udGFpbmVyIC5wdXJwb3NlLmlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgJCgnLnB1cnBvc2VzX19jb250YWluZXIgLnB1cnBvc2UtaW1nJykudW5iaW5kKCkuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIGhpZGVBbGxQcmV2aWV3cygpO1xuICAgIGFkanVzdFJlY3QoJChlLnRhcmdldCkpO1xuXHRcdC8vIFNjcm9sbCBwcmV2aWV3cyB0byB0aGUgc2VsZWN0ZWQgb25lXG5cdFx0dmFyIHByZXZpZXdJbmRleCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5wdXJwb3NlJykuaW5kZXgoJy5wdXJwb3Nlc19fY29udGFpbmVyIC5wdXJwb3NlJyk7XG5cdFx0JCgnI3B1cnBvc2VXcmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiBwcmV2aWV3SW5kZXggKiAxMDAgfSwgNjAwKTtcbiAgfSk7XG5cbiAgLy9DaGVjayBpZiBpdCBpcyBhIG1vYmlsZSBzY3JlZW5cbiAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgNjUwKSB7XG4gICAgJChcIiNwdXJwb3NlcyAucHVycG9zZXNfX2NvbnRhaW5lciAucHVycG9zZVwiKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgJChcIiNwdXJwb3NlcyAucHVycG9zZXNfX2NvbnRhaW5lciAucHVycG9zZS5oaWRkZW5cIikuc2xpY2UoMCwgNSkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICQoJyNsb2FkTW9yZScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgfVxuICAvLyQoJy5wcmV2aWV3LmZvY2FsJykuYWRkQ2xhc3MoJ2Z1bGwnKS5yZW1vdmVDbGFzcygnbGluZScpO1xuICAvLyQoJyNwdXJwb3NlVG9nZ2xlJykuY2hpbGRyZW4oJ3NwYW4nKS50ZXh0KCdIaWRlIFByZXZpZXcnKTtcbn1cbi8qUXVpY2sgRWRpdCBGaWxlIFRpdGxlIGFuZCBJbmZvICovXG5mdW5jdGlvbiBlZGl0RmlsZVRpdGxlKGUpIHtcblx0aWYgKCEkKCcuYWwnKS5oYXNDbGFzcygnbW9kYWwnKSkge1xuXHRcdHZhciBmaWxlSW5mbyA9IGUudGFyZ2V0O1xuXHRcdHZhciBmaWxlSW5mb1RleHQgPSBmaWxlSW5mby5pbm5lckhUTUw7XG5cdFx0dmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblx0XHRpbnB1dC50eXBlID0gJ3RleHQnO1xuXHRcdGlucHV0LnZhbHVlID0gZmlsZUluZm9UZXh0O1xuXG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciBpbnB1dCA9IGUudGFyZ2V0O1xuXHRcdFx0ZmlsZUluZm8gPSBpbnB1dC5wYXJlbnROb2RlO1xuXHRcdFx0ZmlsZUluZm8ucmVtb3ZlQ2hpbGQoaW5wdXQpO1xuXHRcdFx0ZmlsZUluZm8uY2xhc3NMaXN0LnJlbW92ZSgnZWRpdCcpO1xuXHRcdFx0ZmlsZUluZm8uaW5uZXJIVE1MID0gaW5wdXQudmFsdWU7XG5cdFx0fSk7XG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDEzIHx8IGUud2hpY2ggPT0gMTMpIHtcblx0XHRcdFx0dmFyIGlucHV0ID0gZS50YXJnZXQ7XG5cdFx0XHRcdGZpbGVJbmZvID0gaW5wdXQucGFyZW50Tm9kZTtcblx0XHRcdFx0ZmlsZUluZm8ucmVtb3ZlQ2hpbGQoaW5wdXQpO1xuXHRcdFx0XHRmaWxlSW5mby5jbGFzc0xpc3QucmVtb3ZlKCdlZGl0Jyk7XG5cdFx0XHRcdGZpbGVJbmZvLmlubmVySFRNTCA9IGlucHV0LnZhbHVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZmlsZUluZm8uaW5uZXJIVE1MID0gJyc7XG5cdFx0ZmlsZUluZm8uYXBwZW5kQ2hpbGQoaW5wdXQpO1xuXHRcdGZpbGVJbmZvLmNsYXNzTGlzdC5hZGQoJ2VkaXQnKTtcblx0XHRpbnB1dC5mb2N1cygpO1xuXHR9XG59XG5mdW5jdGlvbiBlZGl0RmlsZUNhcHRpb24oZSkge1xuXHRpZiAoISQoJy5hbCcpLmhhc0NsYXNzKCdtb2RhbCcpKSB7XG5cdFx0dmFyIGZpbGVJbmZvID0gZS50YXJnZXQ7XG5cdFx0dmFyIGZpbGVJbmZvVGV4dCA9IGZpbGVJbmZvLmlubmVySFRNTDtcblx0XHR2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuXHRcdC8vaW5wdXQudHlwZSA9ICd0ZXh0J1xuXHRcdGlucHV0LnZhbHVlID0gZmlsZUluZm9UZXh0O1xuXG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciBpbnB1dCA9IGUudGFyZ2V0O1xuXHRcdFx0ZmlsZUluZm8gPSBpbnB1dC5wYXJlbnROb2RlO1xuXHRcdFx0ZmlsZUluZm8ucmVtb3ZlQ2hpbGQoaW5wdXQpO1xuXHRcdFx0ZmlsZUluZm8uY2xhc3NMaXN0LnJlbW92ZSgnZWRpdCcpO1xuXHRcdFx0ZmlsZUluZm8uaW5uZXJIVE1MID0gaW5wdXQudmFsdWU7XG5cdFx0fSk7XG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDEzIHx8IGUud2hpY2ggPT0gMTMpIHtcblx0XHRcdFx0dmFyIGlucHV0ID0gZS50YXJnZXQ7XG5cdFx0XHRcdGZpbGVJbmZvID0gaW5wdXQucGFyZW50Tm9kZTtcblx0XHRcdFx0ZmlsZUluZm8ucmVtb3ZlQ2hpbGQoaW5wdXQpO1xuXHRcdFx0XHRmaWxlSW5mby5jbGFzc0xpc3QucmVtb3ZlKCdlZGl0Jyk7XG5cdFx0XHRcdGZpbGVJbmZvLmlubmVySFRNTCA9IGlucHV0LnZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0fSk7XG5cblx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSAnJztcblx0XHRmaWxlSW5mby5hcHBlbmRDaGlsZChpbnB1dCk7XG5cdFx0ZmlsZUluZm8uY2xhc3NMaXN0LmFkZCgnZWRpdCcpO1xuXHRcdGlucHV0LmZvY3VzKCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZGVsZXRlRmlsZShmaWxlLCBmaWxlcykge1xuXHRmaWxlcyA9IGZpbGVzLnNwbGljZShmaWxlcy5pbmRleE9mKGZpbGUpLCAxKTtcbn1cbmZ1bmN0aW9uIGRlbGV0ZUZpbGVCeUlkKGlkLCBmaWxlcykge1xuXHR2YXIgZmlsZSA9IGZpbGVCeUlkKGlkLCBmaWxlcyk7XG5cdGRlbGV0ZUZpbGUoZmlsZSwgZmlsZXMpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVEZWxldGVDbGljayhlKSB7XG5cdHZhciBpdGVtTmFtZSA9ICQoJy5tZW51IC5pcy1hY3RpdmUnKS50ZXh0KCkudG9Mb3dlckNhc2UoKTtcblx0bmV3IE1vZGFsKHtcblx0XHR0aXRsZTogJ1JlbW92ZSBBc3NldD8nLFxuXHRcdHRleHQ6ICdTZWxlY3RlZCBhc3NldCB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGlzICcgKyBpdGVtTmFtZSArICcuIERvbuKAmXQgd29ycnksIGl0IHdvbuKAmXQgYmUgcmVtb3ZlZCBmcm9tIHRoZSBBc3NldCBMaWJyYXJ5LicsXG5cdFx0Y29uZmlybVRleHQ6ICdSZW1vdmUnLFxuXHRcdGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGZpbGVJZCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJykuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpO1xuXHRcdFx0ZGVsZXRlRmlsZUJ5SWQoZmlsZUlkLCBnYWxsZXJ5T2JqZWN0cyk7XG5cdFx0XHR1cGRhdGVHYWxsZXJ5KCk7XG5cdFx0fVxuXHR9KTtcbn1cblxuJCgnLmZpbGUtdGl0bGUnKS5jbGljayhlZGl0RmlsZVRpdGxlKTtcbiQoJy5maWxlLWNhcHRpb24nKS5jbGljayhlZGl0RmlsZUNhcHRpb24pO1xuXG4vL0ZpbGUgdXBsb2FkXG5mdW5jdGlvbiBoYW5kbGVGaWxlcyhmaWxlcywgY2FsbGJhY2spIHtcblx0dmFyIGZpbGVzT3V0cHV0ID0gW107XG5cdGlmIChmaWxlcyAmJiBmaWxlcy5sZW5ndGggPjApIHtcblx0XHRmb3IgKHZhciBpPTA7IGk8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRmaWxlc091dHB1dC5wdXNoKGZpbGVzW2ldKTtcblx0XHR9XG5cdFx0Ly9zaG93TG9hZGVyKCk7XG5cdFx0dmFyIHVwbG9hZGVkRmlsZXMgPSBmaWxlc091dHB1dC5tYXAoZnVuY3Rpb24oZikge1xuXHRcdFx0cmV0dXJuIGZpbGVUb09iamVjdChmKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0XHRnYWxsZXJ5T2JqZWN0cy5wdXNoKHtcblx0XHRcdFx0XHRmaWxlRGF0YTogcmVzLFxuXHRcdFx0XHRcdHNlbGVjdGVkOiBmYWxzZSxcblx0XHRcdFx0XHRwb3NpdGlvbjogMTAwMCxcblx0XHRcdFx0XHRjYXB0aW9uOiAnJyxcblx0XHRcdFx0XHRnYWxsZXJ5Q2FwdGlvbjogZmFsc2UsXG5cdFx0XHRcdFx0anVzdFVwbG9hZGVkOiB0cnVlLFxuXHRcdFx0XHRcdGxvYWRpbmc6IHRydWVcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHRQcm9taXNlLmFsbCh1cGxvYWRlZEZpbGVzKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0aWYgKGNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y2FsbGJhY2soZ2FsbGVyeU9iamVjdHMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHVwZGF0ZUdhbGxlcnkoZ2FsbGVyeU9iamVjdHMubGVuZ3RoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG4vL0NvbnZlcnQgdXBsb2FkZWQgZmlsZXMgdG8gZWxlbWVudHNcbmZ1bmN0aW9uIGZpbGVUb01hcmt1cChmaWxlKSB7XG5cdHJldHVybiByZWFkRmlsZShmaWxlKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuXHRcdHZhciBmaWxlTm9kZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUnKSxcblxuXHRcdFx0ZmlsZUltZyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUtaW1nJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgcmVzdWx0LnNyYyArICcpJyksXG5cblx0XHRcdGZpbGVDb250cm9scyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUtY29udHJvbHMnKS5jbGljayh0b2dnbGVGaWxlU2VsZWN0KSxcblx0XHRcdGNoZWNrbWFyayA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NoZWNrbWFyaycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuXHRcdFx0Y2xvc2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjbG9zZScpLmNsaWNrKGRlbGV0ZUZpbGUpLFxuXHRcdFx0ZWRpdCA9ICQoJzxidXR0b24+RWRpdDwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24gd2hpdGVPdXRsaW5lJykuY2xpY2soZWRpdEZpbGUpLFxuXG5cdFx0XHRmaWxlVGl0bGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190aXRsZScpLFxuXHRcdFx0ZmlsZVR5cGVJY29uID0gJCgnPGkgY2xhc3M9XCJmYSBmYS1jYW1lcmFcIj48L2k+JykuY3NzKCdtYXJnaW4tcmlnaHQnLCAnMnB4JyksXG5cdFx0XHRmaWxlVGl0bGVJbnB1dCA9ICQoJzxpbnB1dCB0eXBlPVwidGV4dFwiIC8+JykudmFsKHJlc3VsdC5uYW1lKSxcblxuXHRcdFx0ZmlsZUNhcHRpb24gPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlLWNhcHRpb24nKS50ZXh0KHJlc3VsdC5uYW1lKS5jbGljayhlZGl0RmlsZUNhcHRpb24pLFxuXHRcdFx0ZmlsZUluZm8gPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlLWluZm8nKS50ZXh0KHJlc3VsdC5pbmZvKSxcblxuXHRcdFx0ZmlsZVB1cnBvc2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlLXB1cnBvc2UnKSxcblx0XHRcdGZpbGVQdXJwb3NlU2VsZWN0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnc2VsZWN0JykuY2xpY2sob3BlblNlbGVjdCksXG5cdFx0XHRzZWxlY3RTcGFuID0gJCgnPHNwYW4+U2VsZWN0IHVzZTwvc3Bhbj4nKSxcblx0XHRcdHNlbGVjdFVsID0gJCgnPHVsPjwvdWw+JyksXG5cdFx0XHRzZWxlY3RMaTEgPSAkKCc8bGk+Q292ZXI8L2xpPicpLmNsaWNrKHNldFNlbGVjdCksXG5cdFx0XHRzZWxlY3RMaTIgPSAkKCc8bGk+UHJpbWFyeTwvbGk+JykuY2xpY2soc2V0U2VsZWN0KSxcblx0XHRcdHNlbGVjdExpMyA9ICQoJzxsaT5TZWNvbmRhcnk8L2xpPicpLmNsaWNrKHNldFNlbGVjdCk7XG5cblx0XHRmaWxlVGl0bGUuYXBwZW5kKGZpbGVUeXBlSWNvbiwgZmlsZVRpdGxlSW5wdXQpO1xuXHRcdHNlbGVjdFVsLmFwcGVuZChzZWxlY3RMaTEsIHNlbGVjdExpMiwgc2VsZWN0TGkzKTtcblx0XHRmaWxlUHVycG9zZVNlbGVjdC5hcHBlbmQoc2VsZWN0U3Bhbiwgc2VsZWN0VWwpO1xuXG5cdFx0ZmlsZVB1cnBvc2UuYXBwZW5kKGZpbGVQdXJwb3NlU2VsZWN0KTtcblx0XHRmaWxlQ29udHJvbHMuYXBwZW5kKGNoZWNrbWFyaywgY2xvc2UsIGVkaXQpO1xuXHRcdGZpbGVJbWcuYXBwZW5kKGZpbGVDb250cm9scyk7XG5cblx0XHRmaWxlTm9kZS5hcHBlbmQoZmlsZUltZywgZmlsZVRpdGxlLCBmaWxlQ2FwdGlvbiwgZmlsZUluZm8sIGZpbGVQdXJwb3NlKTtcblxuXHRcdHJldHVybiBmaWxlTm9kZTtcblx0fSk7XG59XG5cbi8vQ29udmVydCB1cGxvYWRlZCBmaWxlIHRvIG9iamVjdFxuZnVuY3Rpb24gZmlsZVRvT2JqZWN0KGZpbGUpIHtcblx0cmV0dXJuIHJlYWRGaWxlKGZpbGUpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG5cdFx0cmV0dXJuIHtcblx0ICAgICAgICB1cmw6IHJlc3VsdC5zcmMsXG5cdCAgICAgICAgZm9jYWxQb2ludDoge1xuXHQgICAgICAgICAgICBsZWZ0OiAwLjUsXG5cdCAgICAgICAgICAgIHRvcDogMC41XG5cdCAgICAgICAgfSxcblx0XHRcdGlkOiByZXN1bHQubmFtZSArICcgJyArIG5ldyBEYXRlKCksXG5cdFx0XHRkYXRlQ3JlYXRlZDogbmV3IERhdGUoKSxcblx0ICAgICAgICBjb2xvcjogJycsLy9maWxlSW1nQ29sb3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpmaWxlSW1nQ29sb3JzLmxlbmd0aCldLFxuXHQgICAgICAgIHRpdGxlOiByZXN1bHQubmFtZSxcblx0ICAgICAgICBjYXB0aW9uOiAnJyxcblx0ICAgICAgICBkZXNjcmlwdGlvbjogJycsXG5cdCAgICAgICAgaGlnaFJlc29sdXRpb246IGZhbHNlLFxuXHQgICAgICAgIGNhdGVnb3JpZXM6ICcnLFxuXHQgICAgICAgIHRhZ3M6ICcnLFxuXHQgICAgICAgIGFsdFRleHQ6ICcnLFxuXHQgICAgICAgIGNyZWRpdDogJycsXG5cdCAgICAgICAgY29weXJpZ2h0OiAnJyxcblx0ICAgICAgICByZWZlcmVuY2U6IHtcblx0ICAgICAgICAgICAgc2VyaWVzOiAnJyxcblx0ICAgICAgICAgICAgc2Vhc29uOiAnJyxcblx0ICAgICAgICAgICAgZXBpc29kZTogJydcblx0ICAgICAgICB9LFxuXHRcdFx0dHlwZTogJ2ltYWdlJ1xuXHQgICAgfTtcblx0fSk7XG59XG5cbi8vUmVhZCBmaWxlIGFuZCByZXR1cm4gcHJvbWlzZVxuZnVuY3Rpb24gcmVhZEZpbGUoZmlsZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoXG5cdFx0ZnVuY3Rpb24ocmVzLCByZWopIHtcblx0XHRcdHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0cmVzKHtzcmM6IGUudGFyZ2V0LnJlc3VsdCxcblx0XHRcdFx0XHRuYW1lOiBmaWxlLm5hbWUsXG5cdFx0XHRcdFx0aW5mbzogZmlsZS50eXBlICsgJywgJyArIE1hdGgucm91bmQoZmlsZS5zaXplLzEwMjQpLnRvU3RyaW5nKCkgKyAnIEtiJ30pO1xuXHRcdFx0fTtcblx0XHRcdHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJlaih0aGlzKTtcblx0XHRcdH07XG5cdFx0XHRyZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcblx0XHR9XG5cdCk7XG59XG5cbi8vTG9hZGVyc1xuZnVuY3Rpb24gc2hvd0xvYWRlcigpIHtcblx0dmFyIG1vZGFsID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWwnKS5hdHRyKCdpZCcsICdsb2FkZXJNb2RhbCcpLFxuXHRcdGxvYWRlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2xvYWRlcicpO1xuXG5cdG1vZGFsLmFwcGVuZChsb2FkZXIpO1xuXHQkKCdib2R5JykuYXBwZW5kKG1vZGFsKTtcbn1cbmZ1bmN0aW9uIGhpZGVMb2FkZXIoKSB7XG5cdCQoJyNsb2FkZXJNb2RhbCcpLnJlbW92ZSgpO1xufVxuXG4vL0RyYWcgYW5kIGRyb3AgZmlsZXNcbmZ1bmN0aW9uIGhhbmRsZURyYWdFbnRlcihlKSB7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJjb3B5XCI7XG5cdCQoJyNkcm9wWm9uZScpLmFkZENsYXNzKCdtb2RhbCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkcm9wWm9uZVwiKS5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBoYW5kbGVEcmFnTGVhdmUsIHRydWUpO1xufVxuZnVuY3Rpb24gaGFuZGxlRHJhZ0xlYXZlKGUpIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHQkKFwiI2Ryb3Bab25lXCIpLnJlbW92ZUNsYXNzKCdtb2RhbCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3cmFwcGVyXCIpLmNsYXNzTGlzdC5yZW1vdmUoJ2xvY2tlZCcpO1xufVxuZnVuY3Rpb24gaGFuZGxlRHJvcChlKSB7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQkKFwiI2Ryb3Bab25lXCIpLnJlbW92ZUNsYXNzKCdtb2RhbCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0dmFyIGZpbGVzID0gZS5kYXRhVHJhbnNmZXIuZmlsZXM7XG5cdGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0aGFuZGxlRmlsZXMoZmlsZXMpO1xuXHR9XG59XG5mdW5jdGlvbiBoYW5kbGVEcmFnT3ZlcihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG59XG5cbi8vVXBsb2FkIGZpbGUgZnJvbSBcIlVwbG9hZCBGaWxlXCIgQnV0dG9uXG5mdW5jdGlvbiBoYW5kbGVVcGxvYWRGaWxlc0NsaWNrKGUsIGNhbGxiYWNrKSB7XG5cdHZhciBmaWxlc0lucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlc0lucHV0XCIpO1xuICAgIGlmICghZmlsZXNJbnB1dCkge1xuICAgIFx0ZmlsZXNJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgZmlsZXNJbnB1dC50eXBlID0gXCJmaWxlXCI7XG4gICAgICAgIGZpbGVzSW5wdXQubXVsdGlwbGUgPSBcInRydWVcIjtcbiAgICAgICAgZmlsZXNJbnB1dC5oaWRkZW4gPSB0cnVlO1xuICAgICAgICBmaWxlc0lucHV0LmFjY2VwdCA9IFwiaW1hZ2UvKiwgYXVkaW8vKiwgdmlkZW8vKlwiO1xuICAgICAgICBmaWxlc0lucHV0LmlkID0gXCJmaWxlc0lucHV0XCI7XG4gICAgICAgIGZpbGVzSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICBoYW5kbGVGaWxlcyhlLnRhcmdldC5maWxlcywgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZmlsZXNJbnB1dCk7XG4gICAgfVxuICAgIGZpbGVzSW5wdXQuY2xpY2soKTtcbn1cblxuLy9Ub29sdGlwXG5mdW5jdGlvbiBjcmVhdGVUb29sdGlwKHRhcmdldCwgdGV4dCkge1xuICAgIHZhciB0b29sdGlwID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygndG9vbHRpcCcpLFxuICAgICAgICB0b29sdGlwVGV4dCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3Rvb2x0aXBfX3RleHQnKS50ZXh0KHRleHQpLFxuICAgICAgICB0b29sdGlwVG9nZ2xlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygndG9vbHRpcF9fdG9nZ2xlJyksXG4gICAgICAgIHRvb2x0aXBUb2dnbGVfVG9nZ2xlID0gJCgnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwibmV2ZXJTaG93VG9vbHRpcFwiIC8+JyksLy8ub24oJ2NoYW5nZScsIG5ldmVyU2hvd1Rvb2x0aXApLFxuICAgICAgICB0b29sdGlwVG9nZ2xlX0xhYmVsID0gJCgnPGxhYmVsIGZvcj1cIm5ldmVyU2hvd1Rvb2x0aXBcIj5Hb3QgaXQsIGRvblxcJ3Qgc2hvdyBtZSB0aGlzIGFnYWluPC9sYWJlbD4nKTtcblxuICAgIHRvb2x0aXBUb2dnbGUuYXBwZW5kKHRvb2x0aXBUb2dnbGVfVG9nZ2xlLCB0b29sdGlwVG9nZ2xlX0xhYmVsKTtcbiAgICB0b29sdGlwVG9nZ2xlLmJpbmQoJ2ZvY3VzIGNsaWNrIGNoYW5nZScsIG5ldmVyU2hvd1Rvb2x0aXApO1xuICAgIHRvb2x0aXAuYXBwZW5kKHRvb2x0aXBUZXh0LCB0b29sdGlwVG9nZ2xlKTtcbiAgICAkKCcuZmlsZV9fY2FwdGlvbi10ZXh0YXJlYScpLnJlbW92ZUF0dHIoJ2lkJyk7XG4gICAgJCh0YXJnZXQpLnBhcmVudCgpLmFwcGVuZCh0b29sdGlwKTtcbiAgICB0YXJnZXQuYXR0cignaWQnLCAnYWN0aXZlLWNhcHRpb24tdGV4dGFyZWEnKTtcblxuICAgIHRvb2x0aXAud2lkdGgodGFyZ2V0LndpZHRoKCkpO1xuICAgIGlmICgkKCdib2R5Jykud2lkdGgoKSAtIHRhcmdldC5vZmZzZXQoKS5sZWZ0IC0gdGFyZ2V0LndpZHRoKCkgLSB0YXJnZXQud2lkdGgoKSAtIDIwID4gMCApIHtcbiAgICAgICAgdG9vbHRpcC5jc3MoJ2xlZnQnLCB0YXJnZXQucG9zaXRpb24oKS5sZWZ0ICsgdGFyZ2V0LndpZHRoKCkgKyAxMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdG9vbHRpcC5jc3MoJ2xlZnQnLCB0YXJnZXQucG9zaXRpb24oKS5sZWZ0IC0gdGFyZ2V0LndpZHRoKCkgLSAxMCk7XG4gICAgfVxuICAgIC8vdmFyIG5vdEluY2x1ZGUgPSB0b29sdGlwLmFkZCh0b29sdGlwVGV4dCkuYWRkKHRvb2x0aXBUb2dnbGUpLmFkZCh0b29sdGlwVG9nZ2xlX0xhYmVsKS5hZGQodG9vbHRpcFRvZ2dsZV9Ub2dnbGUpLmFkZCh0YXJnZXQpO1xuICAgIGNvbnNvbGUubG9nKCQoJyNhY3RpdmUtY2FwdGlvbi10ZXh0YXJlYScpKTtcbiAgICAkKCcuY3QsIC5tZW51Jykub24oY2xvc2VUb29sdGlwKS5maW5kKCcjYWN0aXZlLWNhcHRpb24tdGV4dGFyZWEsIC50b29sdGlwLCAudG9vbHRpcCBpbnB1dCwgLnRvb2x0aXAgbGFiZWwnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7ZS5zdG9wUHJvcGFnYXRpb24oKTt9KTtcbn1cblxuZnVuY3Rpb24gbmV2ZXJTaG93VG9vbHRpcChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Rvb2x0aXAnLCB0cnVlKTtcbiAgICBjbG9zZVRvb2x0aXAoKTtcbn1cblxuZnVuY3Rpb24gY2xvc2VUb29sdGlwKGUpIHtcbiAgICBpZiAoZSkge2Uuc3RvcFByb3BhZ2F0aW9uKCk7fVxuXG4gICAgY29uc29sZS5sb2coJ2Nsb3NldG9vbHRpcCcsIGUpO1xuICAgICQoJy5jdCwgLm1lbnUnKS51bmJpbmQoJ2NsaWNrJywgY2xvc2VUb29sdGlwKTtcbiAgICB2YXIgdG9vbHRpcHMgPSAkKCcudG9vbHRpcCcpO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0b29sdGlwcy5yZW1vdmUoKTtcbiAgICB9LCAzMDApO1xufVxuXG4vL01vZGFsIFByb21wdHMgYW5kIFdpbmRvd3NcbmZ1bmN0aW9uIGNsb3NlRWRpdFNjcmVlbigpIHtcbiAgJCgnLnByJykucmVtb3ZlQ2xhc3MoJ21vZGFsJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAkKCcucHIgLnByZXZpZXcnKS5yZW1vdmVDbGFzcygnZm9jYWwgbGluZSBmdWxsIHJlY3QgcG9pbnQnKTtcbiAgJCgnLmZvY2FsUG9pbnQnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAkKCcuZm9jYWxSZWN0JykucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgJCgnI2ZvY2FsUG9pbnRUb2dnbGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICQoJyNmb2NhbFJlY3RUb2dnbGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICQoJy5wdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UgLnB1cnBvc2UtaW1nJykucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgJCgnLmN0IC5maWxlJykuZmluZCgnYnV0dG9uJykuY3NzKCdkaXNwbGF5JywgJycpO1xuICBkZXNlbGVjdEFsbCgpO1xuICAkKCcjd3JhcHBlcicpLnJlbW92ZUNsYXNzKCdvdmVyZmxvdycpO1xuICAkKCdib2R5Jykuc2Nyb2xsVG9wKHNjcm9sbFBvc2l0aW9uKTtcbn1cblxuZnVuY3Rpb24gc2hvd01vZGFsUHJvbXB0KG9wdGlvbnMpIHtcbiAgdmFyIG1vZGFsQ2xhc3MgPSBvcHRpb25zLmRpYWxvZyA/ICdtb2RhbCBtb2RhbC0tcHJvbXB0IG1vZGFsLS1kaWFsb2cnIDogJ21vZGFsIG1vZGFsLS1wcm9tcHQnLFxuICBzZWNCdXR0b25DbGFzcyA9IG9wdGlvbnMuZGlhbG9nID8gJ2J1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5JyA6ICdidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnLFxuICBjbG9zZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX19jbG9zZScpLmNsaWNrKG9wdGlvbnMuY2FuY2VsQWN0aW9uKSxcbiAgbW9kYWwgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKG1vZGFsQ2xhc3MpLFxuICB0aXRsZSA9IG9wdGlvbnMudGl0bGUgPyAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fdGl0bGUnKS50ZXh0KG9wdGlvbnMudGl0bGUpIDogbnVsbCxcbiAgdGV4dCA9IG9wdGlvbnMudGV4dCA/ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX190ZXh0JykudGV4dChvcHRpb25zLnRleHQpIDogbnVsbCxcbiAgY29udHJvbHMgPSBvcHRpb25zLmNvbmZpcm1BY3Rpb24gfHwgb3B0aW9ucy5jYW5jZWxBY3Rpb24gPyAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fY29udHJvbHMnKSA6IG51bGwsXG4gIGNvbmZpcm1CdXR0b24gPSBvcHRpb25zLmNvbmZpcm1BY3Rpb24gPyAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24gIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWFjY2VudCcpLnRleHQob3B0aW9ucy5jb25maXJtVGV4dCB8fCAnT2snKS5jbGljayhvcHRpb25zLmNvbmZpcm1BY3Rpb24pIDogbnVsbCxcbiAgY2FuY2VsQnV0dG9uID0gb3B0aW9ucy5jYW5jZWxBY3Rpb24gPyAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKHNlY0J1dHRvbkNsYXNzKS50ZXh0KG9wdGlvbnMuY2FuY2VsVGV4dCB8fCAnTmV2ZXJtaW5kJykuY2xpY2sob3B0aW9ucy5jYW5jZWxBY3Rpb24pIDogbnVsbDtcblxuICBjb250cm9scy5hcHBlbmQoY29uZmlybUJ1dHRvbiwgY2FuY2VsQnV0dG9uKTtcbiAgbW9kYWwuYXBwZW5kKGNsb3NlLCB0aXRsZSwgdGV4dCwgY29udHJvbHMpO1xuICAkKCdib2R5JykuYXBwZW5kKG1vZGFsKTtcbiAgc2V0TW9kYWxLZXlib2FyZEFjdGlvbnMob3B0aW9ucy5jb25maXJtQWN0aW9uLCBvcHRpb25zLmNhbmNlbEFjdGlvbik7XG59XG5cbmZ1bmN0aW9uIGhpZGVNb2RhbFByb21wdCgpIHtcbiAgJCgnLm9wLm1vZGFsLCAub3AuZGlhbG9nLCAubW9kYWwubW9kYWwtLXByb21wdCcpLnJlbW92ZSgpO1xuICAkKGRvY3VtZW50KS51bmJpbmQoJ2tleWRvd24nKTtcbn1cbmZ1bmN0aW9uIHNldE1vZGFsS2V5Ym9hcmRBY3Rpb25zKGVudGVyLCBjbG9zZSkge1xuICBoYW5kbGVFc2NLZXlkb3duID0gZnVuY3Rpb24oZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKGUudGFyZ2V0ID09PSBkb2N1bWVudC5ib2R5ICYmIGUua2V5Q29kZSA9PT0gMjcpIHtjbG9zZSgpO31cbiAgfTtcbiAgaGFuZGxlRW50ZXJLZXlkb3duID0gZnVuY3Rpb24oZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKGUudGFyZ2V0ID09PSBkb2N1bWVudC5ib2R5ICYmIGUua2V5Q29kZSA9PT0gMTMpIHtlbnRlcigpO31cbiAgfTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFbnRlcktleWRvd24pO1xufVxuZnVuY3Rpb24gaGFuZGxlRXNjS2V5ZG93bihlKSB7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIC8vaWYgKGUudGFyZ2V0ID09PSBkb2N1bWVudC5ib2R5ICYmIGUua2V5Q29kZSA9PT0gMjcpIHtjbG9zZSgpO31cbn1cbmZ1bmN0aW9uIGhhbmRsZUVudGVyS2V5ZG93bihlKSB7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIC8vaWYgKGUudGFyZ2V0ID09PSBkb2N1bWVudC5ib2R5ICYmIGUua2V5Q29kZSA9PT0gMTMpIHtlbnRlcigpO31cbn1cblxuZnVuY3Rpb24gTW9kYWwob3B0aW9ucykge1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gIHRoaXMuX2luaXQoKTtcbiAgdGhpcy5faW5pdEV2ZW50cygpO1xufVxuXG5Nb2RhbC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5tb2RhbCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmRpYWxvZyA/ICdtb2RhbCBtb2RhbC0tcHJvbXB0IG1vZGFsLS1kaWFsb2cnIDogJ21vZGFsIG1vZGFsLS1wcm9tcHQgbW9kYWwtLWZ1bGwnKTtcblxuICB0aGlzLmNsb3NlQnV0dG9uID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX2Nsb3NlJyk7XG4gIHRoaXMudGl0bGUgPSB0aGlzLm9wdGlvbnMudGl0bGUgPyAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fdGl0bGUnKS50ZXh0KHRoaXMub3B0aW9ucy50aXRsZSkgOiBudWxsO1xuICB0aGlzLnRleHQgPSB0aGlzLm9wdGlvbnMudGV4dCA/ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX190ZXh0JykudGV4dCh0aGlzLm9wdGlvbnMudGV4dCkgOiBudWxsO1xuXG4gIHRoaXMuY29udHJvbHMgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fY29udHJvbHMnKTtcbiAgaWYgKCF0aGlzLm9wdGlvbnMub25seUNhbmNlbCkge1xuICAgIHRoaXMuY29uZmlybUJ1dHRvbiA9ICQoJzxidXR0b24gLz4nKS5hZGRDbGFzcygnYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWFjY2VudCcpLnRleHQodGhpcy5vcHRpb25zLmNvbmZpcm1UZXh0IHx8ICdPaycpO1xuICAgIHRoaXMuY29udHJvbHMuYXBwZW5kKHRoaXMuY29uZmlybUJ1dHRvbik7XG4gIH1cbiAgaWYgKCF0aGlzLm9wdGlvbnMub25seUNvbmZpcm0pIHtcbiAgICB0aGlzLmNhbmNlbEJ1dHRvbiA9ICQoJzxidXR0b24gLz4nKS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuZGlhbG9nID8gJ2J1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5JyA6ICdidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKS50ZXh0KHRoaXMub3B0aW9ucy5jYW5jZWxUZXh0IHx8ICdOZXZlcm1pbmQnKTtcbiAgICB0aGlzLmNvbnRyb2xzLmFwcGVuZCh0aGlzLmNhbmNlbEJ1dHRvbik7XG4gIH1cblxuICB0aGlzLm1vZGFsLmFwcGVuZCh0aGlzLmNsb3NlQnV0dG9uLCB0aGlzLnRpdGxlLCB0aGlzLnRleHQsIHRoaXMuY29udHJvbHMpO1xuICAkKCdib2R5JykuYXBwZW5kKHRoaXMubW9kYWwpO1xufTtcblxuTW9kYWwucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVzY0tleWRvd24pO1xuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcblxuICBmdW5jdGlvbiBoYW5kbGVDb25maXJtYXRpb24oKSB7XG4gICAgaWYgKHNlbGYub3B0aW9ucy5jb25maXJtQWN0aW9uKSB7c2VsZi5vcHRpb25zLmNvbmZpcm1BY3Rpb24oKTt9XG4gICAgc2VsZi5tb2RhbC5yZW1vdmUoKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc2VsZi5oYW5kbGVLZXlEb3duLCB0cnVlKTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVDYW5jZWxhdGlvbigpIHtcbiAgICBpZiAoc2VsZi5vcHRpb25zLmNhbmNlbEFjdGlvbikge3NlbGYub3B0aW9ucy5jYW5jZWxBY3Rpb24oKTt9XG4gICAgc2VsZi5tb2RhbC5yZW1vdmUoKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc2VsZi5oYW5kbGVLZXlEb3duLCB0cnVlKTtcbiAgfVxuXG4gIHNlbGYuaGFuZGxlS2V5RG93biA9IGZ1bmN0aW9uKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmICghc2VsZi5vcHRpb25zLm9ubHlDYW5jZWwpIHtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7aGFuZGxlQ2FuY2VsYXRpb24oKTt9XG4gICAgfVxuICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7aGFuZGxlQ29uZmlybWF0aW9uKCk7fVxuICAgIGlmIChlLmtleUNvZGUgPT09IDI3KSB7aGFuZGxlQ2FuY2VsYXRpb24oKTt9XG4gIH07XG5cbiAgaWYgKHNlbGYuY2FuY2VsQnV0dG9uKSB7c2VsZi5jYW5jZWxCdXR0b24uY2xpY2soaGFuZGxlQ2FuY2VsYXRpb24pO31cbiAgaWYgKHNlbGYuY29uZmlybUJ1dHRvbikge3NlbGYuY29uZmlybUJ1dHRvbi5jbGljayhoYW5kbGVDb25maXJtYXRpb24pO31cbiAgc2VsZi5jbG9zZUJ1dHRvbi5jbGljayhoYW5kbGVDYW5jZWxhdGlvbik7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBzZWxmLmhhbmRsZUtleURvd24sIHRydWUpO1xufTtcblxuLy9Bc3NldCBsaWJyYXJ5XG52YXIgYXNzZXRMaWJyYXJ5T2JqZWN0cyA9IFtcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtMi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtMi5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTIuanBnJyxcbiAgICBjYXB0aW9uOiAnMDUuIERvblxcJ3QgR2V0IExvc3QnLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtMy5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtMy5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTMuanBnJyxcbiAgICBjYXB0aW9uOiAnMDIuIFRoZSBNYW4gaW4gdGhlIFNoYWRvd3MnLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtNC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtNC5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTQuanBnJyxcbiAgICBjYXB0aW9uOiAnMDMuIFRoZSBGaXJzdCBTbGljZScsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1lcGlzb2RlLTUuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWVwaXNvZGUtNS5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWVwaXNvZGUtNS5qcGcnLFxuICAgIGNhcHRpb246ICcwMS4gQSBOZXcgVmlzaXRvcicsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS01LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS01LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtNS5qcGcnLFxuICAgIGNhcHRpb246ICcwNC4gVGhlIEJsb29kIE1vb24nLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtMTAuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTEwLmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtMTAuanBnJyxcbiAgICBjYXB0aW9uOiAnMDMuIFRoZSBGaXJzdCBTbGljZScsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS0xMy5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtMTMuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS0xMy5qcGcnLFxuICAgIGNhcHRpb246ICcwMS4gQSBOZXcgVmlzaXRvcicsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS0xNS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtMTUuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS0xNS5qcGcnLFxuICAgIGNhcHRpb246ICcwMS4gQSBOZXcgVmlzaXRvcicsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS0xMS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtMTEuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnVHJhaWxlciBFMDMnLFxuICAgIGNhcHRpb246ICcwNi4gQWxsIEFsb25lJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAndmlkZW8nXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTkuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTkuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS05LmpwZycsXG4gICAgY2FwdGlvbjogJzA0LiBUaGUgQmxvb2QgTW9vbicsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS04LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS04LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtOC5qcGcnLFxuICAgIGNhcHRpb246ICcwNC4gVGhlIEJsb29kIE1vb24nLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtNi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtNi5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTYuanBnJyxcbiAgICBjYXB0aW9uOiAnMDYuIEFsbCBBbG9uZScsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ2F6dGVjX3RlbXBsZS5wbmcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAxLmpwZycsXG4gICAgY2FwdGlvbjogJ1dyaXRlciwgQnJpYW4gTWlsbGlraW4sIGEgbWFuIGFib3V0IEhhdmVuLCB0YWtlcyB1cyBiZWhpbmQgdGhlIHNjZW5lcyBvZiB0aGlzIGVwaXNvZGUgYW5kIGdpdmVzIHVzIGEgZmV3IHRlYXNlcyBhYm91dCB0aGUgU2Vhc29uIHRoYXQgd2UgY2FuXFwndCB3YWl0IHRvIHNlZSBwbGF5IG91dCEgVGhpcyBpcyB0aGUgZmlyc3QgZXBpc29kZSBvZiBIYXZlbiBub3QgZmlsbWVkIGluIG9yIGFyb3VuZCBDaGVzdGVyLCBOb3ZhIFNjb3RpYS4gQmVnaW5uaW5nIGhlcmUsIHRoZSBzaG93IGFuZCBpdHMgc3RhZ2VzIHJlbG9jYXRlZCB0byBIYWxpZmF4LicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAyLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnYmlnX2Jlbi5wbmcgNDNkZWZxd2UnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjRkRCRDAwJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDIuanBnJyxcbiAgICBjYXB0aW9uOiAnQ2hhcmxvdHRlIGxheXMgb3V0IGhlciBwbGFuIGZvciB0aGUgZmlyc3QgdGltZSBpbiB0aGlzIGVwaXNvZGU6IHRvIGJ1aWxkIGEgbmV3IEJhcm4sIG9uZSB0aGF0IHdpbGwgY3VyZSBUcm91YmxlcyB3aXRob3V0IGtpbGxpbmcgVHJvdWJsZWQgcGVvcGxlIGluIHRoZSBwcm9jZXNzLiBIZXIgcGxhbiwgYW5kIHdoYXQgcGFydHMgaXQgcmVxdWlyZXMsIHdpbGwgY29udGludWUgdG8gcGxheSBhIG1vcmUgYW5kIG1vcmUgaW1wb3J0YW50IHJvbGUgYXMgdGhlIHNlYXNvbiBnb2VzIGFsb25nLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMy5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ2NocmlzdF90aGVfcmVkZWVtZXIucG5nIDA5Mm5seG5jJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0VENDEyRCcsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAzLmpwZycsXG4gICAgY2FwdGlvbjogJ0xvc3QgdGltZSBwbGF5cyBhbiBldmVuIG1vcmUgaW1wb3J0YW50IHJvbGUgaW4gdGhpcyBlcGlzb2RlIHRoYW4gZXZlciBiZWZvcmXigJQgYXMgaXTigJlzIHJldmVhbGVkIHRoYXQgaXTigJlzIGEgd2VhcG9uIHRoZSBncmVhdCBldmlsIGZyb20gVGhlIFZvaWQgaGFzIGJlZW4gdXNpbmcgYWdhaW5zdCB1cywgYWxsIHNlYXNvbiBsb25nLiBXaGljaCBnb2VzIGJhY2sgdG8gdGhlIGNhdmUgdW5kZXIgdGhlIGxpZ2h0aG91c2UgaW4gYmVnaW5uaW5nIG9mIHRoZSBTZWFzb24gNSBwcmVtaWVyZS4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnTG9zdCB0aW1lJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDQuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdjb2xvc3NldW0ucG5nIC00cmp4bnNrJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnIzMyQTRCNycsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzA0LmpwZycsXG4gICAgY2FwdGlvbjogJ1RoZSDigJxhZXRoZXIgY29yZeKAnSB0aGF0IENoYXJsb3R0ZSBhbmQgQXVkcmV5IG1ha2UgcHJlc2VudGVkIGFuIGltcG9ydGFudCBkZXNpZ24gY2hvaWNlLiBUaGUgd3JpdGVycyB3YW50ZWQgaXQgdG8gbG9vayBvcmdhbmljIGJ1dCBhbHNvIGRlc2lnbmVk4oCUIGxpa2UgdGhlIHRlY2hub2xvZ3kgb2YgYW4gYWR2YW5jZWQgY3VsdHVyZSBmcm9tIGEgZGlmZmVyZW50IGRpbWVuc2lvbiwgY2FwYWJsZSBvZiBkb2luZyB0aGluZ3MgdGhhdCB3ZSBtaWdodCBwZXJjZWl2ZSBhcyBtYWdpYyBidXQgd2hpY2ggaXMganVzdCBzY2llbmNlIHRvIHRoZW0uIFRoZSB2YXJpb3VzIGRlcGljdGlvbnMgb2YgS3J5cHRvbmlhbiBzY2llbmNlIGluIHZhcmlvdXMgU3VwZXJtYW4gc3RvcmllcyB3YXMgb25lIGluc3BpcmF0aW9uLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUgYW5kIEF1ZHJleScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzA1LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnZWFzdGVyX2lzbGFuZC5wbmcgbmxuNG5rYTAnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMCwgMjUpLFxuICAgIGNvbG9yOiAnI0QzRUNFQycsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzA1LmpwZycsXG4gICAgY2FwdGlvbjogJ1RoaXMgaXMgdGhlIGZpcnN0IGVwaXNvZGUgaW4gU2Vhc29uIDUgaW4gd2hpY2ggd2XigJl2ZSBsb3N0IG9uZSBvZiBvdXIgaGVyb2VzLiBJdCB3YXMgaW1wb3J0YW50IHRvIGhhcHBlbiBhcyB3ZSBoZWFkIGludG8gdGhlIGhvbWUgc3RyZXRjaCBvZiB0aGUgc2hvdyBhbmQgYXMgdGhlIHN0YWtlcyBpbiBIYXZlbiBoYXZlIG5ldmVyIGJlZW4gbW9yZSBkaXJlLiBBcyBhIHJlc3VsdCwgaXQgd29u4oCZdCBiZSB0aGUgbGFzdCBsb3NzIHdlXFwnbGwgc3VmZmVyIHRoaXMgc2Vhc29u4oCmJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ1dpbGQgQ2FyZCcsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzA2LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAncHlyYW1pZHMucG5nIGZkYnk2NCcsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDEwLCAyNSksXG4gICAgY29sb3I6ICcjMkE3QzkxJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDYuanBnJyxcbiAgICBjYXB0aW9uOiAnVGhlIGNoYWxsZW5nZSBpbiBDaGFybG90dGVcXCdzIGZpbmFsIGNvbmZyb250YXRpb24gd2FzIHRoYXQgdGhlIHNob3cgY291bGRu4oCZdCByZXZlYWwgaGVyIGF0dGFja2Vy4oCZcyBhcHBlYXJhbmNlIHRvIHRoZSBhdWRpZW5jZSwgc28gdGhlIGRhcmtuZXNzIHdhcyBuZWNlc3NpdGF0ZWQuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG5cbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDEuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzYW5fZnJhbmNpc29fYnJpZGdlLnBuZyA0MjM0ZmY1MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDEwLCAyNSksXG4gICAgY29sb3I6ICcjOTY3ODQwJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDEuanBnJyxcbiAgICBjYXB0aW9uOiAnV2FybmluZzogSWYgeW91IGRvblxcJ3Qgd2FudCB0byBrbm93IHdoYXQgaGFwcGVuZWQgaW4gdGhpcyBlcGlzb2RlLCBkb25cXCd0IHJlYWQgdGhpcyBwaG90byByZWNhcCEgRGF2ZSBqdXN0IGhhZCBhbm90aGVyIHZpc2lvbiBhbmQgdGhpcyB0aW1lLCBoZVxcJ3MgYmVpbmcgcHJvYWN0aXZlIGFib3V0IGl0LiBIZSBhbmQgVmluY2UgZGFzaCBvdXQgb2YgdGhlIGhvdXNlIHRvIHNhdmUgdGhlIGxhdGVzdCB2aWN0aW1zIG9mIENyb2F0b2FuLCBhLmsuYSB0aGUgTm8gTWFya3MgS2lsbGVyLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wMi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3N0b25lX2hlbmdlLnBuZyA0OTBtbm1hYmQnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMCwgMjUpLFxuICAgIGNvbG9yOiAnIzU2NkY3OCcsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAyLmpwZycsXG4gICAgY2FwdGlvbjogJ01lYW53aGlsZSwgRHdpZ2h0IGFuZCBOYXRoYW4gZ28gZG93bnRvd24gdG8gaW52ZXN0aWdhdGUgd2hhdCB0aGV5IHRoaW5rIGlzIGEgZHJ1bmtlbiBtYW4gY2F1c2luZyBhIGRpc3R1cmJhbmNlIGJ1dCBpdCB0dXJucyBvdXQgdGhhdCB0aGUgZ3V5IGlzIGN1cnNlZC4gVGhlcmUgaXMgYSByb21hbiBudW1lcmFsIG9uIGhpcyB3cmlzdCBhbmQsIGFzIHRoZXkgd2F0Y2gsIGludmlzaWJsZSBob3JzZXMgdHJhbXBsZSBoaW0uIExhdGVyLCBOYXRoYW4gYW5kIER3aWdodCBmaW5kIGFub3RoZXIgbWFuIHdobyBhcHBlYXJzIHRvIGhhdmUgYmVlbiBzdHJ1Y2sgYnkgbGlnaHRlbmluZyDigJMgYnV0IHRoZXJlIGhhZCBiZWVuIG5vIHJlY2VudCBzdG9ybSBpbiB0b3duIOKAkyBhbmQgZHJvcHBlZCBmcm9tIGEgc2t5c2NyYXBlci4gU2t5c2NyYXBlcnMgaW4gSGF2ZW4/IEFic3VyZC4gQW5kIHRoZSBndXkgYWxzbyBoYXMgYSBteXN0ZXJpb3VzIFJvbWFuIG51bWVyYWwgdGF0dG9vIG9uIGhpcyB3cmlzdC4gTmF0aGFuIGFuZCBEd2lnaHQgZmluZCBhIGxpc3Qgb2YgbmFtZXMgaW4gdGhlIGd1eVxcJ3MgcG9ja2V0IHRoYXQgbGVhZHMgdGhlbSB0byBhIGxvY2FsIGZvcnR1bmUgdGVsbGVyLCBMYWluZXkuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAzLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc3lkbmV5X29wZXJhX2hvdXNlLnBuZyAwc2VkNjdoJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTAsIDI1KSxcbiAgICBjb2xvcjogJyMyRTFEMDcnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wMy5qcGcnLFxuICAgIGNhcHRpb246ICdCeSBmb2xsb3dpbmcgdGhlIGNsdWVzIGZyb20gRGF2ZVxcJ3MgdmlzaW9uLCBoZSBhbmQgVmluY2UgZmluZCB0aGUgc2NlbmUgb2YgdGhlIE5vIE1hcmsgS2lsbGVyXFwncyBtb3N0IHJlY2VudCBjcmltZS4gVGhleSBhbHNvIGZpbmQgYSBzdXJ2aXZvci4gVW5mb3J0dW5hdGVseSwgc2hlIGNhblxcJ3QgcmVtZW1iZXIgYW55dGhpbmcuIEhlciBtZW1vcnkgaGFzIGJlZW4gd2lwZWQsIHdoaWNoIGdldHMgdGhlbSB0byB0aGlua2luZyBhYm91dCB3aG8gbWF5IGJlIG5leHQgb24gQ3JvYXRvYW5cXCdzIGxpc3QuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA0LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAndGFqX21haGFsLnBuZyA5NDNuYmthJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTAsIDI1KSxcbiAgICBjb2xvcjogJyMwMDQ0NUYnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNC5qcGcnLFxuICAgIGNhcHRpb246ICdPbiB0aGVpciB3YXkgdG8gbWVldCB3aXRoIExhaW5leSwgTmF0aGFuIGJyZWFrcyBoaXMgdGlyZSBpcm9uIHdoaWxlIHRyeWluZyB0byBmaXggYSBmbGF0IHRpcmUuIFRvdWdoIGJyZWFrLiBBbmQgdGhlbiBEd2lnaHQgZ2V0cyBhIHNob290aW5nIHBhaW4gaW4gaGlzIHNpZGUgd2l0aCBhIGduYXJseSBicnVpc2UgdG8gbWF0Y2gsIGV2ZW4gdG91Z2hlciBicmVhay4gQW5kIHRoZW4gYm90aCBndXlzIG5vdGljZSB0aGF0IHRoZXkgbm93IGhhdmUgUm9tYW4gbnVtZXJhbCB0YXR0b29zIG9uIHRoZWlyIHdyaXN0cy4gVGhlIG51bWJlciBYIGZvciBOYXRoYW4gYW5kIFhJSSBmb3IgRHdpZ2h0LicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3dpbmRtaWxsLnBuZyBqZXJsMzQnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTEpLFxuICAgIGNvbG9yOiAnIzJGMzgzNycsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA1LmpwZycsXG4gICAgY2FwdGlvbjogJ0luIHRoZSBtaW5lc2hhZnQsIENoYXJsb3R0ZSBhbmQgQXVkcmV5IGhhdmUgdGFrZW4gb24gdGhlIHRhc2sgb2YgY29sbGVjdGluZyBhbGwgb2YgdGhlIGFldGhlciB0byBjcmVhdGUgYW4gYWV0aGVyIGNvcmUuIFRoaXMgaXMgdGhlIGZpcnN0IHN0ZXAgdGhleSBuZWVkIHRvIGNyZWF0ZSBhIG5ldyBCYXJuIHdoZXJlIFRyb3VibGUgcGVvcGxlIGNhbiBzdGVwIGluc2lkZSBhbmQgdGhlbiBiZSBcImN1cmVkXCIgb2YgdGhlaXIgVHJvdWJsZXMgd2hlbiB0aGV5IHN0ZXAgb3V0LiBTb3VuZHMgZWFzeSBlbm91Z2ggYnV0IHRoZXlcXCdyZSBoYXZpbmcgdHJvdWJsZSBjb3JyYWxsaW5nIGFsbCB0aGUgYWV0aGVyIGludG8gYSBnaWFudCBiYWxsLiBVbnN1cnByaXNpbmdseSwgdGhlIHN3aXJsaW5nIGJsYWNrIGdvbyBpc25cXCd0IHdpbGxmdWxseSBjb29wZXJhdGluZy4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDYuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd0cmVlXzEucG5nJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDE0KSxcbiAgICBjb2xvcjogJyM2MzYyNEMnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNi5qcGcnLFxuICAgIGNhcHRpb246ICdBcyBpZiB0aGUgYWV0aGVyIHdhc25cXCd0IGVub3VnaCBvZiBhIHByb2JsZW0gdG8gdGFja2xlLCBDaGFybG90dGUgZmVlbHMgaGVyc2VsZiBnZXR0aW5nIHdlYWtlciBieSB0aGUgbWludXRlIGFuZCB0aGVuIEF1ZHJleSBzdGFydHMgdG8gbG9zZSBoZXIgZXllc2lnaHQuIFRoZXkgbG9vayBhdCB0aGVpciB3cmlzdHMgYW5kIG5vdGljZSB0aGF0IHRoZSBSb21hbiBudW1iZXIgcHJvYmxlbSBoYXMgbm93IGFmZmVjdGVkIHRoZW0gdG9vLCB0aGUgbnVtYmVycyBJSSBmb3IgQXVkcmV5IGFuZCBWSUlJIGZvciBDaGFybG90dGUuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA3LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAndHJlZV8yLnBuZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxNCksXG4gICAgY29sb3I6ICcjNEE1MDRFJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDcuanBnJyxcbiAgICBjYXB0aW9uOiAnSW4gTm9ydGggQ2Fyb2xpbmEsIER1a2UgYW5kIFNldGggc2l0IHdpdGggYSBsb2NhbCBtYW4gd2hvIGNsYWltcyB0byBiZSBhYmxlIHRvIHJlbW92ZSB0aGUgXCJibGFjayB0YXJcIiBmcm9tIER1a2VcXCdzIHNvdWwuIEFmdGVyIGFuIGVsYWJvcmF0ZSBwZXJmb3JtYW5jZSwgRHVrZSByZWFsaXplcyB0aGF0IHRoZSBndXkgaXMgYSBmYWtlLiBUaGUgcmF0dGxlZCBndXkgd2hvIGRvZXNuXFwndCB3YW50IGFueSB0cm91YmxlIGZyb20gRHVrZSB0ZWxscyB0aGVtIHRoYXQgV2FsdGVyIEZhcmFkeSB3aWxsIGhhdmUgdGhlIHJlYWwgYW5zd2VycyB0byBEdWtlXFwncyBxdWVzdGlvbnMuIFdoZW4gdGhleSBnbyBsb29raW5nIGZvciBXYWx0ZXIsIHRoZXkgZmluZCBoaW0g4oCmIGFuZCBoaXMgaGVhZHN0b25lIHRoYXQgaGFzIGEgZmFtaWxpYXIgbWFya2luZyBvbiBpdCwgdGhlIHN5bWJvbCBmb3IgVGhlIEd1YXJkLiBXaGF0IGdpdmVzPyBKdXN0IGFzIER1a2UgaXMgYWJvdXQgdG8gZ2l2ZSB1cCBoZSBnZXRzIGEgdmlzaXQgZnJvbSBXYWx0ZXJcXCdzIGdob3N0IHdobyBwcm9taXNlcyB0byBnaXZlIGhpbSBhbnN3ZXJzIHRvIGFsbCBvZiB0aGUgcXVlc3Rpb25zIOKApnZpYSB0aGUgbmV4dCBlcGlzb2RlIG9mIGNvdXJzZS4gQ2xpZmZoYW5nZXIhJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA4LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAndHJlZV8zLnBuZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxNCksXG4gICAgY29sb3I6ICcjREQ5RjAwJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDguanBnJyxcbiAgICBjYXB0aW9uOiAnQWZ0ZXIgc29tZSBwcm9kZGluZywgRHdpZ2h0IGFuZCBOYXRoYW4gZmluZCB0aGF0IExhaW5leSBnb3QgYSB2aXNpdCBmcm9tIENyb2F0b2FuIGFuZCBcImxvc3QgdGltZVwiLiBTaGUgZG9lc25cXCd0IHJlbWVtYmVyaW5nIGRyYXdpbmcgY2FyZHMgZm9yIGFueSBvZiB0aGVtLiBOYXRoYW4gaGFzIGhlciBkcmF3IG5ldyBjYXJkcyBhbmQgYSBoZXNpdGFudCBMYWluZXkgZG9lcy4gRHdpZ2h0IGlzIGdpdmVuIGEgYm9uZGFnZSBmYXRlIGFuZCBpcyBsYXRlciBzaGFja2xlZCBieSBjaGFpbnMgdG8gYSBnYXRlLCBDaGFybG90dGUgd2lsbCBiZSByZXVuaXRlZCB3aXRoIGhlciB0cnVlIGxvdmUgKGhtbeKApikgYW5kIEF1ZHJleSBpcyBhbGlnbmVkIHdpdGggdGhlIG1vb24uIE5vdCBwZXJmZWN0IGZhdGVzLCBidXQgaXRcXCdzIGVub3VnaCB0byBnZXQgZXZlcnlvbmUgb3V0IG9mIHRoZSBwaWNrbGVzIHRoZWlyIGN1cnJlbnRseSBpbi4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDkuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd0cmVlXzQucG5nJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDE0KSxcbiAgICBjb2xvcjogJyM4RkM5OUInLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wOS5qcGcnLFxuICAgIGNhcHRpb246ICdXaXRoIHRoZWlyIHN0cmVuZ3RoIHJlZ2FpbmVkLCBBdWRyZXkgYW5kIENoYXJsb3R0ZSBhcmUgYWJsZSB0byBjcmVhdGUgdGhlIGFldGhlciBjb3JlIHRoZXkgbmVlZC4gQ2hhcmxvdHRlIGluc3RydWN0cyBBdWRyZXkgdG8gZ28gYW5kIGhpZGUgaXQgc29tZSBwbGFjZSBzYWZlLiBJbiB0aGUgaW50ZXJpbSwgQ2hhcmxvdHRlIGtpc3NlcyBEd2lnaHQgZ29vZGJ5ZSBhbmQgZ2l2ZXMgaGltIHRoZSByaW5nIHNoZSBvbmNlIHVzZWQgdG8gc2xpcCBpbnRvIFRoZSBWb2lkLiBMYXRlciwgd2l0aCBoZXIgbW9vbiBhbGlnbm1lbnQgY2F1c2luZyBBdWRyZXkgdG8gZGlzYXBwZWFyIGFuZCBEd2lnaHQgc3RpbGwgc2hhY2tsZWQsIExhaW5leSBwdWxscyBhbm90aGVyIGNhcmQgZm9yIHRoZSBlbnRpcmUgZ3JvdXAsIGEganVkZ21lbnQgY2FyZCwgd2hpY2ggc2hlIHJlYWRzIHRvIG1lYW4gdGhhdCBhcyBhbG9uZyBhcyB0aGVpciBpbnRlbnRpb25zIGFyZSBwdXJlIHRoZXkgY2FuIGFsbCBvdmVyY29tZSBhbnkgb2JzdGFjbGVzLiBUaGlzIGlzIGdyZWF0IG5ld3MgZm9yIGV2ZXJ5b25lIGV4Y2VwdC4uLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8xMC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3RyZWVfNS5wbmcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTQpLFxuICAgIGNvbG9yOiAnI0JGQzlBMicsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzEwLmpwZycsXG4gICAgY2FwdGlvbjogJ0NoYXJsb3R0ZS4gQ3JvYXRvYW4gcGF5cyBoZXIgYSB2aXNpdCBpbiBoZXIgYXBhcnRtZW50IHRvIHRlbGwgaGVyIHRoYXQgaGVcXCdzIHBpc3NlZCB0aGF0IHNoZVxcJ3MgXCJvbmUgb2YgdGhlbSBub3dcIiBhbmQgdGhhdCBzaGUgY2hvc2UgQXVkcmV5IG92ZXIgTWFyYS4gQ3JvYXRvYW4gd2FzdGVzIG5vIHRpbWUgaW4ga2lsbGluZyBDaGFybG90dGUgYW5kIHNoZSBjbGluZ3MgdG8gbGlmZSBmb3IganVzdCBlbm91Z2ggdGltZSB0byBiZSBmb3VuZCBieSBBdWRyZXkgc28gc2hlIGNhbiBnaXZlIGhlciB0aGUgbW9zdCBzaG9ja2luZyBuZXdzIG9mIHRoZSBzZWFzb246IENyb2F0b2FuIGlzIEF1ZHJleVxcJ3MgZmF0aGVyIGFuZCBoZVxcJ3MgZ290IFwicGxhbnNcIiBmb3IgaGVyIScsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvczA1X2UwNTEzXzAxX0NDXzE5MjB4MTA4MC5qcGcnLFxuICAgIGlkOiAndmlkZW9fXzEyMycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxNCksXG4gICAgY29sb3I6ICcjQkZDOUEyJyxcbiAgICB0aXRsZTogJ3MwNV9lMDUxM18wMV9DQ18xOTIweDEwODAnLFxuICAgIGRlc2NyaXB0aW9uOiAnTm93IHRoYXQgRHIuIENyb3NzIGhhcyByZXZlYWxlZCBoZXIgdHJ1ZSBpZGVudGl0eSwgZXZlcnlvbmUgaGFzIGxvdHMgb2YgZmVlbGluZ3MuIER3aWdodCBjYW5cXCd0IGdldCBvdmVyIGZlZWxpbmcgbGlrZSBzaGUgZHVwZWQgaGltLCBBdWRyZXkgdGhpbmtzIERyLiBDcm9zcyBtdXN0IGNhcmUgbW9yZSBhYm91dCBNYXJhIHRoYW4gc2hlIGRvZXMgYWJvdXQgaGVyIGFuZCBOYXRoYW4gaXMgaGFwcHkgdGhhdCB0aGVyZSBpcyBzb21lb25lIGVsc2UgaW4gdG93biB3aG8gaGUgY2FuIGZlZWwuJyxcbiAgICB0eXBlOiAndmlkZW8nLFxuICAgIHBsYXllcjogJ0JyYW5kIFZPRCBQbGF5ZXInLFxuICAgIGVwaXNvZGVOdW1iZXI6ICcxMCcsXG4gICAga2V5d29yZHM6ICdUaGUgRXhwYW5jZSwgU2FsdmFnZSwgTWlsbGVyLCBKdWxpZSBNYW8sIEhvbGRlbiwgVHJhaWxlcicsXG5cbiAgICBhZGRlZEJ5VXNlcklkOiAzNDQ4NzIzLFxuICAgIGF1dGhvcjogJ0phc29uIExvbmcnLFxuICAgIGV4cGlyYXRpb25EYXRlOiAnMjAxNS0wMy0yMyAxMDo1NzowNCcsXG4gICAgZ3VpZDogJzBENjYwQkQ2LTA5NjgtNEY3Mi03QUJDLTQ3MjE1N0RGQUNBQicsXG4gICAgbGluazogJ2Nhbm9uaWNhbHVybDcwZmE2MmZjNmInLFxuICAgIGxpbmtVcmw6ICdodHRwOi8vcHJvZC5wdWJsaXNoZXI3LmNvbS9maWxlLzc4MDYnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9CaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8wNi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzA2LnBuZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDEsIDE0KSxcbiAgICBjb2xvcjogJyNCRkM5QTInLFxuICAgIHRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDYuanBnJyxcbiAgICBjYXB0aW9uOiAnQWxlaXN0ZXIgY29udGludWVzIGhpcyBjaGFybWluZyBjb3JydXB0aW9uIG9mIFNhdmFubmFoLCB0ZWxsaW5nIGhlciBzaGVcXCdzIGtlcHQgbG9ja2VkIGluIGhlciByb29tIHRvIGtlZXAgaGVyIHNhZmUgZnJvbSBoZXIgbmV3IHdlcmV3b2xmIG5laWdoYm9yIGFuZCBlbmNvdXJhZ2luZyBoZXIgdG8gdXNlIGhlciBsZWZ0IGhhbmQgd2hlbiB3aWVsZGluZyBoZXIgYWJpbGl0aWVzLiBTYXZhbm5haFxcJ3MgZ2V0dGluZyBtb3JlIHBvd2VyZnVsIGV2ZXJ5IGRheS4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdCaXR0ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcblxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1lMS0zLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1lNi5qcGcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAxLCAxNCksXG4gICAgY29sb3I6ICcjQkZDOUEyJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItZTYuanBnJyxcbiAgICBjYXB0aW9uOiAnQWxlaXN0ZXIgY29udGludWVzIGhpcyBjaGFybWluZyBjb3JydXB0aW9uIG9mIFNhdmFubmFoLCB0ZWxsaW5nIGhlciBzaGVcXCdzIGtlcHQgbG9ja2VkIGluIGhlciByb29tIHRvIGtlZXAgaGVyIHNhZmUgZnJvbSBoZXIgbmV3IHdlcmV3b2xmIG5laWdoYm9yIGFuZCBlbmNvdXJhZ2luZyBoZXIgdG8gdXNlIGhlciBsZWZ0IGhhbmQgd2hlbiB3aWVsZGluZyBoZXIgYWJpbGl0aWVzLiBTYXZhbm5haFxcJ3MgZ2V0dGluZyBtb3JlIHBvd2VyZnVsIGV2ZXJ5IGRheS4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdCaXR0ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9jb250ZW50L2xpc3RpY2xlLWltZy0zLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnbGlzdGljbGUtaW1nLTMuanBnJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMSwgMTQpLFxuICAgIGNvbG9yOiAnI0JGQzlBMicsXG4gICAgdGl0bGU6ICdNci5fUm9ib3RfUzFfRXAwM19DaG9pY2VzX2NsaXAnLFxuICAgIGNhcHRpb246ICdBbGVpc3RlciBjb250aW51ZXMgaGlzIGNoYXJtaW5nIGNvcnJ1cHRpb24gb2YgU2F2YW5uYWgsIHRlbGxpbmcgaGVyIHNoZVxcJ3Mga2VwdCBsb2NrZWQgaW4gaGVyIHJvb20gdG8ga2VlcCBoZXIgc2FmZSBmcm9tIGhlciBuZXcgd2VyZXdvbGYgbmVpZ2hib3IgYW5kIGVuY291cmFnaW5nIGhlciB0byB1c2UgaGVyIGxlZnQgaGFuZCB3aGVuIHdpZWxkaW5nIGhlciBhYmlsaXRpZXMuIFNhdmFubmFoXFwncyBnZXR0aW5nIG1vcmUgcG93ZXJmdWwgZXZlcnkgZGF5LicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICcnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ0JpdHRlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ3ZpZGVvJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL2NvbnRlbnQvbGlzdGljbGUtaW1nLTIuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdsaXN0aWNsZS1pbWctMi5qcGcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAxLCAxNCksXG4gICAgY29sb3I6ICcjQkZDOUEyJyxcbiAgICB0aXRsZTogJ01yLl9Sb2JvdF9TMV9FcDA0X1dpdGhkcmF3bF9jbGlwJyxcbiAgICBjYXB0aW9uOiAnQWxlaXN0ZXIgY29udGludWVzIGhpcyBjaGFybWluZyBjb3JydXB0aW9uIG9mIFNhdmFubmFoLCB0ZWxsaW5nIGhlciBzaGVcXCdzIGtlcHQgbG9ja2VkIGluIGhlciByb29tIHRvIGtlZXAgaGVyIHNhZmUgZnJvbSBoZXIgbmV3IHdlcmV3b2xmIG5laWdoYm9yIGFuZCBlbmNvdXJhZ2luZyBoZXIgdG8gdXNlIGhlciBsZWZ0IGhhbmQgd2hlbiB3aWVsZGluZyBoZXIgYWJpbGl0aWVzLiBTYXZhbm5haFxcJ3MgZ2V0dGluZyBtb3JlIHBvd2VyZnVsIGV2ZXJ5IGRheS4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdCaXR0ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICd2aWRlbydcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9jb250ZW50L2xpc3RpY2xlLWltZy0xLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnbGlzdGljbGUtaW1nLTEuanBnJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMSwgMTQpLFxuICAgIGNvbG9yOiAnI0JGQzlBMicsXG4gICAgdGl0bGU6ICdNci5fUm9ib3RfUzFfRXAwNl9TaGF5bGFzX0ZhdGVfY2xpcCcsXG4gICAgY2FwdGlvbjogJ0FsZWlzdGVyIGNvbnRpbnVlcyBoaXMgY2hhcm1pbmcgY29ycnVwdGlvbiBvZiBTYXZhbm5haCwgdGVsbGluZyBoZXIgc2hlXFwncyBrZXB0IGxvY2tlZCBpbiBoZXIgcm9vbSB0byBrZWVwIGhlciBzYWZlIGZyb20gaGVyIG5ldyB3ZXJld29sZiBuZWlnaGJvciBhbmQgZW5jb3VyYWdpbmcgaGVyIHRvIHVzZSBoZXIgbGVmdCBoYW5kIHdoZW4gd2llbGRpbmcgaGVyIGFiaWxpdGllcy4gU2F2YW5uYWhcXCdzIGdldHRpbmcgbW9yZSBwb3dlcmZ1bCBldmVyeSBkYXkuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJycsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnQml0dGVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAndmlkZW8nXG4gIH0gICAgXG5cbiAgLyosXG4gIHtcbiAgdXJsOiAnaW1nL3JlYWwvQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDcuanBnJyxcbiAgZm9jYWxQb2ludDoge1xuICBsZWZ0OiAwLjUsXG4gIHRvcDogMC41XG59LFxuaWQ6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8wNy5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNCksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8wNy5qcGcnLFxuY2FwdGlvbjogJ01lYW53aGlsZSwgTG9nYW4gaGFzIGluZmlsdHJhdGVkIHRoZSBjb21wb3VuZCBhbmQgZmluZHMgaGlzIGJlbG92ZWQgUmFjaGVsLiBIZSBtYW5hZ2VzIHRvIGZyZWUgaGVyIC4uLiBidXQgaG93IGZhciB3aWxsIHRoZXkgZ2V0PycsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCaXR0ZW4nLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTcuanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8xNy5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNCksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8xNy5qcGcnLFxuY2FwdGlvbjogJ0VsZW5hIHdha2VzIHVwIHRvIGZpbmQgaGVyc2VsZiBpbiBhIG5ldyBjZWxsIC4uLicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCaXR0ZW4nLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTguanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8xOC5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNCksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8xOC5qcGcnLFxuY2FwdGlvbjogJy4uLiBhbmQgUmljaGFyZCwgdGhlIG11dHQgc2hlIGludGVycm9nYXRlZCBpbiBFcGlzb2RlIDEsIGluIGFub3RoZXIuIFJpY2hhcmQgaXMgZW5yYWdlZCB0aGF0IEVsZW5hIGdhdmUgaGltIHVwIHRvIHRoZXNlIFwic2FkaXN0aWMgYmFzdGFyZHNcIiBhbmQgYWxsIHRvbyB3aWxsaW5nIHRvIGVuZ2FnZSBpbiBTb25kcmFcXCdzIGV4cGVyaW1lbnQgdG8gXCJvYnNlcnZlIGNvbWJhdFwiOiBpbiB0aGVvcnksIEVsZW5hIHdpbGwgaGF2ZSB0byB0dXJuIGludG8gYSB3b2xmIHRvIGRlZmVuZCBoZXJzZWxmIGFnYWluc3QgUmljaGFyZFxcJ3MgYXR0YWNrLicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCaXR0ZW4nLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjEuanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yMS5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNCksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yMS5qcGcnLFxuY2FwdGlvbjogJ09uIGhpZ2hlciBncm91bmQsIFJhY2hlbCBhbmQgTG9nYW4gYXJlIG1ha2luZyBhIHJ1biBmb3IgaXQsIHRob3VnaCB0aGUgc3ltYm9sIG9uIFJhY2hlbFxcJ3MgbmVjayBzdGFydHMgdG8gc21va2UgLi4uJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JpdHRlbicsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yMi5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzIyLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE0KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzIyLmpwZycsXG5jYXB0aW9uOiAnLi4uIHdoaWNoIGFsc28gc2xvd3MgZG93biBFbGVuYSwgYWZ0ZXIgUmljaGFyZC13b2xmIHN1ZmZlcnMgdGhlIHNhbWUgYmxvb2R5IGZhdGUgYXMgTmF0ZSBQYXJrZXIgZGlkIGluIEVwaXNvZGUgMS4gUmFjaGVsLCBFbGVuYSBhbmQgTG9nYW4gYXJlIHJlLWNhcHR1cmVkLicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCaXR0ZW4nLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjUuanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yNS5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNCksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yNS5qcGcnLFxuY2FwdGlvbjogJ0VsZW5hIGdpdmVzIGluLCBhbmQgYSBzaG9ja2VkIFJhY2hlbCBsZWFybnMgYSBsaXR0bGUgc29tZXRoaW5nIG5ldyBhYm91dCBoZXIgb2xkIGZyaWVuZC4nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JsaW5kc3BvdF8wN19OVVBfMTcwMzE3XzAzMDguanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCbGluZHNwb3RfMDdfTlVQXzE3MDMxN18wMzA4LnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE2KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JsaW5kc3BvdF8wN19OVVBfMTcwMzE3XzAzMDguanBnJyxcbmNhcHRpb246ICdCTElORFNQT1QgLS0gXCJCb25lIE1heSBSb3RcIiBFcGlzb2RlIDEwNCAtLSBQaWN0dXJlZDogKGwtcikgSmFpbWllIEFsZXhhbmRlciBhcyBKYW5lIERvZSwgU3VsbGl2YW4gU3RhcGxldG9uIGFzIEt1cnQgV2VsbGVyIC0tIChQaG90byBieTogQ2hyaXN0b3BoZXIgU2F1bmRlcnMvTkJDKScsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCbGluZHNwb3QnLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQmxpbmRzcG90XzA4X05VUF8xNzA1MDNfMDI4My5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JsaW5kc3BvdF8wOF9OVVBfMTcwNTAzXzAyODMucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTYpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQmxpbmRzcG90XzA4X05VUF8xNzA1MDNfMDI4My5qcGcnLFxuY2FwdGlvbjogJ0JMSU5EU1BPVCAtLSBcIkJvbmUgTWF5IFJvdFwiIEVwaXNvZGUgMTA0IC0tIFBpY3R1cmVkOiBKYWltaWUgQWxleGFuZGVyIGFzIEphbmUgRG9lIC0tIChQaG90byBieTogR2lvdmFubmkgUnVmaW5vL05CQyknLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQmxpbmRzcG90JyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JsaW5kc3BvdF8xNV9OVVBfMTcwNTAzXzAyMDMuanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCbGluZHNwb3RfMTVfTlVQXzE3MDUwM18wMjAzLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE2KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JsaW5kc3BvdF8xNV9OVVBfMTcwNTAzXzAyMDMuanBnJyxcbmNhcHRpb246ICdCTElORFNQT1QgLS0gXCJCb25lIE1heSBSb3RcIiBFcGlzb2RlIDEwNCAtLSBQaWN0dXJlZDogSmFpbWllIEFsZXhhbmRlciBhcyBKYW5lIERvZSAtLSAoUGhvdG8gYnk6IEdpb3Zhbm5pIFJ1Zmluby9OQkMpJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JsaW5kc3BvdCcsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9zY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMjAuMTRfcG0ucG5nJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdzY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMjAuMTRfcG0ucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTYpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjIwLjE0X3BtLnBuZycsXG5jYXB0aW9uOiAn4oCcTW9uZGF5cyBnb3QgbWUgbGlrZeKApuKAnSAtIEBqaW1teWZhbGxvbicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdUaGUgVG9uaWdodCBTaG93JyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4xOS4xOV9wbS5wbmcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4xOS4xOV9wbS5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNiksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdzY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMTkuMTlfcG0ucG5nJyxcbmNhcHRpb246ICfigJxUb25pZ2h0IEkgd2FzIHRoZSBtdXNpY2FsIGd1ZXN0IG9uIFRoZSBUb25pZ2h0IFNob3cgV2l0aCBKaW1teSBGYWxsb24uIE15IGZpcnN0IHRpbWUgb24gdGhlIHNob3cgSSB3YXMgMTQgeWVhcnMgb2xkIGFuZCBuZXZlciB0aG91Z2h0IElcXCdkIGJlIGJhY2sgdG8gcGVyZm9ybSBteSBmaXJzdCBzaW5nbGUuIExvdmUgeW91IGxvbmcgdGltZSBKaW1teSEgVGhhbmtzIGZvciBoYXZpbmcgbWUuIDopIFBTIEkgbWV0IHRoZSBsZWdlbmRhcnkgTGFkeSBHYWdhIGFuZCBhbSBzbyBpbnNwaXJlZCBieSBoZXIgd29yZHMgb2Ygd2lzZG9tLiAjSEFJWm9uRkFMTE9OICNMb3ZlTXlzZWxm4oCdIC0gQGhhaWxlZXN0ZWluZmVsZCcsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdUaGUgVG9uaWdodCBTaG93JyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4yMC4xNV9wbS5wbmcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4yMC4xNV9wbS5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNiksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdzY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMjAuMTVfcG0ucG5nJyxcbmNhcHRpb246ICfigJxNb25kYXlzIGdvdCBtZSBsaWtl4oCm4oCdIC0gQGppbW15ZmFsbG9uJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ1RoZSBUb25pZ2h0IFNob3cnLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59Ki9cbl07XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGFzc2V0TGlicmFyeU9iamVjdHM7XG59XG5mdW5jdGlvbiBjcmVhdGVBc3NldExpYnJhcnlGaWxlKGZpbGVEYXRhKSB7XG4gIC8vSGVscGVyXG4gIGZ1bmN0aW9uIGZpbGVUeXBlRWxlbWVudChmaWxlRGF0YSkge1xuICAgIHN3aXRjaCAoZmlsZURhdGEudHlwZSkge1xuICAgICAgY2FzZSAnaW1hZ2UnOlxuICAgICAgcmV0dXJuICQoJzxkaXY+PGkgY2xhc3M9XCJmYSBmYS1jYW1lcmFcIj48L2k+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3R5cGUnKTtcblxuICAgICAgY2FzZSAndmlkZW8nOlxuICAgICAgcmV0dXJuICQoJzxkaXY+PGkgY2xhc3M9XCJmYSBmYS12aWRlby1jYW1lcmFcIj48L2k+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3R5cGUnKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190eXBlJyk7XG4gICAgfVxuICB9XG5cbiAgLy9jcmVhdGUgYmFzaWMgZWxlbWVudFxuICB2YXIgZmlsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUgZmlsZS0tbW9kYWwgZmlsZV90eXBlX2ltZyBmaWxlX3ZpZXdfZ3JpZCcpLFxuICBmaWxlSW5kZXggPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdoaWRkZW4gZmlsZV9faWQnKS50ZXh0KGZpbGVEYXRhLmlkKSxcblxuICBmaWxlSW1nID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9faW1nJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgZmlsZURhdGEudXJsICsgJyknKSxcbiAgZmlsZUNvbnRyb2xzID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fY29udHJvbHMnKS5jbGljayh0b2dnbGVGaWxlU2VsZWN0KSxcbiAgZmlsZUNoZWNrbWFyayA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2NoZWNrbWFyaycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuICBmaWxlVGl0bGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190aXRsZScpLnRleHQoZmlsZURhdGEudGl0bGUpO1xuXG4gIGZpbGVDb250cm9scy5hcHBlbmQoZmlsZUNoZWNrbWFyaywgZmlsZVR5cGVFbGVtZW50KGZpbGVEYXRhKSk7XG4gIGZpbGVJbWcuYXBwZW5kKGZpbGVDb250cm9scyk7XG5cbiAgZmlsZS5hcHBlbmQoZmlsZUluZGV4LCBmaWxlSW1nLCBmaWxlVGl0bGUpO1xuICByZXR1cm4gZmlsZTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQXNzZXRMaWJyYXJ5KCkge1xuICB2YXIgYXNzZXRMaWJyYXJ5ID0gJCgnLmFsIC5maWxlcyAuc2VjdGlvbl9fZmlsZXMnKTtcbiAgYXNzZXRMaWJyYXJ5LmVtcHR5KCk7XG4gIGFzc2V0TGlicmFyeU9iamVjdHMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG4gICAgYXNzZXRMaWJyYXJ5LnByZXBlbmQoY3JlYXRlQXNzZXRMaWJyYXJ5RmlsZShmKSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTZWxlY3RlZEZpbGVzKCkge1xuICB2YXIgc2VsZWN0ZWRGaWxlcyA9ICQoJy5hbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlLnNlbGVjdGVkJyk7XG5cbiAgaWYgKHNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMCkge1xuICAgIHNlbGVjdGVkRmlsZXMuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgdmFyIGZpbGVJZCA9ICQoZWwpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcbiAgICAgIGZpbGUgPSBhc3NldExpYnJhcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmLmlkID09PSBmaWxlSWQ7XG4gICAgICB9KVswXTtcbiAgICAgIC8vaWYgKCFmaWxlQnlJZChmaWxlSWQsIGdhbGxlcnlPYmplY3RzKSkge1xuICAgICAgZ2FsbGVyeU9iamVjdHMucHVzaCh7XG4gICAgICAgIGZpbGVEYXRhOiBmaWxlLFxuICAgICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgIHBvc2l0aW9uOiAxMDAwLFxuICAgICAgICBjYXB0aW9uOiAnJyxcbiAgICAgICAgZ2FsbGVyeUNhcHRpb246IGZhbHNlLFxuICAgICAgICBqdXN0VXBsb2FkZWQ6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIC8vfVxuXG4gICAgfSk7XG4gICAgdXBkYXRlR2FsbGVyeShnYWxsZXJ5T2JqZWN0cy5sZW5ndGgpO1xuICB9XG59XG5cbi8vUmVxdWlyZWQgZmllbGRzIGNoZWNrXG5mdW5jdGlvbiBjaGVja0ZpZWxkKGZpZWxkKSB7XG4gICAgaWYgKCQoZmllbGQpLnZhbCgpID09PSAnJyAmJiAkKGZpZWxkKS5hdHRyKCdkaXNwbGF5JykgIT09ICdub25lJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7fVxuICAgIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gbWFya0ZpZWxkQXNSZXF1aXJlZChmaWVsZCkge1xuICAgICQoZmllbGQpLmFkZENsYXNzKCdlbXB0eUZpZWxkJyk7XG4gICAgaWYgKCQoZmllbGQpLnBhcmVudCgpLmNoaWxkcmVuKCcuZXJyTXNnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHZhciBtc2cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdlcnJNc2cnKS50ZXh0KFwiVGhpcyBmaWVsZCBjb3VsZG4ndCBiZSBlbXB0eVwiKTtcbiAgICAgICAgJChmaWVsZCkucGFyZW50KCkuYXBwZW5kKG1zZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gbWFya0ZpZWxkQXNOb3JtYWwoZmllbGQpIHtcbiAgICAkKGZpZWxkKS5yZW1vdmVDbGFzcygnZW1wdHlGaWVsZCcpO1xuICAgICQoZmllbGQpLnBhcmVudCgpLmNoaWxkcmVuKCcuZXJyTXNnJykucmVtb3ZlKCk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRmllbGRzKHNlbGVjdG9yKSB7XG4gICAgdmFyIGZpZWxkcyA9ICQoc2VsZWN0b3IpLnBhcmVudCgpLmNoaWxkcmVuKCdpbnB1dCcpO1xuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgIHZhciBmaXJzdEluZGV4ID0gLTE7XG4gICAgZmllbGRzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgIGlmIChjaGVja0ZpZWxkKGVsKSkge1xuICAgICAgICAgICAgLy9tYXJrRmllbGRBc05vcm1hbChlbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL21hcmtGaWVsZEFzUmVxdWlyZWQoZWwpO1xuICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoZmlyc3RJbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICBmaXJzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgZWwuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuJCgnbGFiZWwucmVxdWllcmVkJykucGFyZW50KCkuY2hpbGRyZW4oJ2lucHV0Jykub24oJ2JsdXInLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGNoZWNrRmllbGQoZS50YXJnZXQpKSB7XG4gICAgICAgIC8vbWFya0ZpZWxkQXNOb3JtYWwoZS50YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vbWFya0ZpZWxkQXNSZXF1aXJlZChlLnRhcmdldCk7XG4gICAgfVxufSk7XG5cbi8vRm9jYWwgcmVjdGFuZ2xlIGFuZCBwb2ludFxuZnVuY3Rpb24gYWRqdXN0UmVjdChlbCkge1xuXHR2YXIgaW1nV2lkdGggPSAkKCcjcHJldmlld0ltZycpLndpZHRoKCksXG5cdGltZ0hlaWdodCA9ICQoJyNwcmV2aWV3SW1nJykuaGVpZ2h0KCksXG5cdGltZ09mZnNldCA9ICQoJyNwcmV2aWV3SW1nJykub2Zmc2V0KCksXG5cdGltZ1JhdGlvID0gaW1nV2lkdGgvaW1nSGVpZ2h0LFxuXG5cdGVsSCA9IGVsLm91dGVySGVpZ2h0KCksXG5cdGVsVyA9IGVsLm91dGVyV2lkdGgoKSxcblx0ZWxPID0gZWwub2Zmc2V0KCksXG5cdGVsUmF0aW8gPSBlbFcvZWxILFxuXHRlbEJhY2tncm91bmRQb3NpdGlvbiA9IGVsLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbicpID8gZWwuY3NzKCdiYWNrZ3JvdW5kLXBvc2l0aW9uJykuc3BsaXQoJyAnKSA6IFsnNTAlJywgJzUwJSddO1xuXG5cdHJIZWlnaHQgPSBpbWdSYXRpbyA+IGVsUmF0aW8gPyBpbWdIZWlnaHQgOiBpbWdXaWR0aC9lbFJhdGlvO1xuXHRyV2lkdGggPSBpbWdSYXRpbyA+IGVsUmF0aW8gPyBpbWdIZWlnaHQgKiBlbFJhdGlvIDogaW1nV2lkdGg7XG5cdHJPZmZzZXQgPSB7bGVmdDogMCwgdG9wOiAwfTtcblxuXHRpZiAoZWxCYWNrZ3JvdW5kUG9zaXRpb24ubGVuZ3RoID09PSAyKSB7XG5cdFx0aWYgKGVsQmFja2dyb3VuZFBvc2l0aW9uWzBdLmluZGV4T2YoJyUnKSkge1xuXHRcdFx0dmFyIGJnTGVmdFBlcnNlbnQgPSBlbEJhY2tncm91bmRQb3NpdGlvblswXS5zbGljZSgwLC0xKSxcblx0XHRcdGJnTGVmdFBpeGVsID0gTWF0aC5yb3VuZChpbWdXaWR0aCAqIGJnTGVmdFBlcnNlbnQvMTAwKSAtIHJXaWR0aC8yO1xuXG5cdFx0XHRpZiAoKGJnTGVmdFBpeGVsKSA8IDApIHtiZ0xlZnRQaXhlbCA9IDA7fVxuXHRcdFx0aWYgKChiZ0xlZnRQaXhlbCArIHJXaWR0aCkgPiBpbWdXaWR0aCkge2JnTGVmdFBpeGVsID0gaW1nV2lkdGggLSByV2lkdGg7fVxuXG5cdFx0XHRyT2Zmc2V0LmxlZnQgPSBpbWdSYXRpbyA+IGVsUmF0aW8gPyBiZ0xlZnRQaXhlbCA6IDA7XG5cdFx0fVxuXHRcdGlmIChlbEJhY2tncm91bmRQb3NpdGlvblsxXS5pbmRleE9mKCclJykpIHtcblx0XHRcdHZhciBiZ1RvcFBlcnNlbnQgPSBlbEJhY2tncm91bmRQb3NpdGlvblsxXS5zbGljZSgwLC0xKSxcblx0XHRcdGJnVG9wUGl4ZWwgPSBNYXRoLnJvdW5kKGltZ0hlaWdodCpiZ1RvcFBlcnNlbnQvMTAwKSAtIHJIZWlnaHQvMjtcblxuXHRcdFx0aWYgKChiZ1RvcFBpeGVsKSA8IDApIHtiZ1RvcFBpeGVsID0gMDt9XG5cdFx0XHRpZiAoKGJnVG9wUGl4ZWwgKyBySGVpZ2h0KSA+IGltZ0hlaWdodCkge2JnVG9wUGl4ZWwgPSBpbWdIZWlnaHQgLSBySGVpZ2h0O31cblxuXHRcdFx0ck9mZnNldC50b3AgPSBpbWdSYXRpbyA+IGVsUmF0aW8gPyAwIDogYmdUb3BQaXhlbDtcblx0XHR9XG5cdH1cblxuXHQkKCcjZm9jYWxSZWN0JykucmVtb3ZlQXR0cignc3R5bGUnKTtcblxuXHQkKCcjZm9jYWxSZWN0JykuY3NzKCd3aWR0aCcsIHJXaWR0aC50b1N0cmluZygpICsgJ3B4Jylcblx0LmNzcygnaGVpZ2h0JywgckhlaWdodC50b1N0cmluZygpICsgJ3B4Jylcblx0LmNzcygnbGVmdCcsIHJPZmZzZXQubGVmdC50b1N0cmluZygpICsgJ3B4Jylcblx0LmNzcygndG9wJywgck9mZnNldC50b3AudG9TdHJpbmcoKSArICdweCcpXG5cdC5kcmFnZ2FibGUoe1xuXHRcdGF4aXM6IGltZ1JhdGlvID4gZWxSYXRpbyA/ICd4JyA6ICd5Jyxcblx0XHRjb250YWlubWVudDogXCIjcHJldmlld0ltZ1wiLFxuXHRcdHN0YXJ0OiBmdW5jdGlvbihlLCB1aSkge1xuXHRcdFx0ZWwuY3NzKCd0cmFuc2l0aW9uJywgJ25vbmUnKTtcblx0XHR9LFxuXHRcdHN0b3A6IGZ1bmN0aW9uKGUsIHVpKSB7XG5cdFx0XHRlbC5jc3MoJ3RyYW5zaXRpb24nLCAnMC4zcyBlYXNlLW91dCcpO1xuXHRcdFx0YWRqdXN0UHVycG9zZSgkKGUudGFyZ2V0KSwgZWwpO1xuXHRcdH1cblx0fSk7XG5cblx0JCgnLnB1cnBvc2VzX19jb250YWluZXIgLnB1cnBvc2UuaXMtYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRlbC5wYXJlbnQoKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG59XG5cbmZ1bmN0aW9uIGFkanVzdFB1cnBvc2UoZm9jYWxJdGVtLCBwdXJwb3NlSW1nKSB7XG5cdHZhciBpbWcgPSAkKCcjcHJldmlld0ltZycpLFxuXHRpV2lkdGggPSBpbWcud2lkdGgoKSxcblx0aUhlaWdodCA9IGltZy5oZWlnaHQoKSxcblx0aU9mZnNldCA9IGltZy5vZmZzZXQoKSxcblxuXHRwV2lkdGggPSBmb2NhbEl0ZW0ub3V0ZXJXaWR0aCgpLFxuXHRwSGVpZ2h0ID0gZm9jYWxJdGVtLm91dGVySGVpZ2h0KCksXG5cdHBPZmZzZXQgPSBmb2NhbEl0ZW0ub2Zmc2V0KCksXG5cblx0ZlRvcCA9IE1hdGgucm91bmQoKHBPZmZzZXQudG9wIC0gaU9mZnNldC50b3AgKyBwSGVpZ2h0LzIpKjEwMCAvIGlIZWlnaHQpO1xuXHRmTGVmdCA9IE1hdGgucm91bmQoKHBPZmZzZXQubGVmdCAtIGlPZmZzZXQubGVmdCArIHBXaWR0aC8yKSAqIDEwMCAvIGlXaWR0aCk7XG5cblx0aWYgKHB1cnBvc2VJbWcpIHtcblx0XHRwdXJwb3NlSW1nLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbicsIGZMZWZ0LnRvU3RyaW5nKCkgKyAnJSAnICsgZlRvcC50b1N0cmluZygpICsgJyUnKTtcblx0fVxuXHRlbHNlIHtcblx0XHQkKCcucHVycG9zZXNfX2NvbnRhaW5lciAucHVycG9zZSAucHVycG9zZS1pbWcnKS5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24nLCBmTGVmdC50b1N0cmluZygpICsgJyUgJyArIGZUb3AudG9TdHJpbmcoKSArICclJyk7XG5cdH1cbn1cblxuLyokKCcjZm9jYWxSZWN0VG9nZ2xlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG5cdFx0JCgnLnByID4gLnByZXZpZXcnKS5yZW1vdmVDbGFzcygnZm9jYWwgbGluZSByZWN0Jyk7XG5cdFx0JChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHR9IGVsc2Uge1xuXHRcdCQoJy5wciA+IC5wcmV2aWV3JykuYWRkQ2xhc3MoJ2ZvY2FsIGxpbmUgcmVjdCcpO1xuXHRcdCQoJy5wciA+IC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ3BvaW50Jyk7XG5cdFx0JCgnI2ZvY2FsUG9pbnRUb2dnbGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0JChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cdFx0Ly8kKCcuZm9jYWxSZWN0JykucmVzaXphYmxlKHtoYW5kbGVzOiBcImFsbFwiLCBjb250YWlubWVudDogXCIjcHJldmlld0ltZ1wifSk7XG5cdFx0YWRqdXN0UmVjdCgkKCcucHVycG9zZXNfX2NvbnRhaW5lciAucHVycG9zZS1pbWcnKS5maXJzdCgpKTtcblx0XHQkKCcjZm9jYWxSZWN0JykuZHJhZ2dhYmxlKHsgY29udGFpbm1lbnQ6IFwiI3ByZXZpZXdJbWdcIiwgc2Nyb2xsOiBmYWxzZSB9KTtcblxuXHRcdCQoJy5wdXJwb3Nlc19fY29udGFpbmVyIC5wdXJwb3NlLWltZycpLnVuYmluZCgpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRcdGFkanVzdFJlY3QoJChlLnRhcmdldCkpO1xuXHRcdH0pO1xuXHRcdC8vJCgnLmltZy13cmFwcGVyJykuY3NzKCdtYXgtd2lkdGgnLCAnOTAlJyk7XG5cdFx0c2V0UHVycG9zZVBhZ2luYXRpb24oKTtcblx0fVxufSk7Ki9cblxuLy9VdGlsaXRpZXNcblxuLy9UaHJvdHRsZSBTY3JvbGwgZXZlbnRzXG47KGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aHJvdHRsZSA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIG9iaikge1xuICAgICAgICBvYmogPSBvYmogfHwgd2luZG93O1xuICAgICAgICB2YXIgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICB2YXIgZnVuYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBvYmouZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQobmFtZSkpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBvYmouYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmdW5jKTtcbiAgICB9O1xuXG4gICAgLyogaW5pdCAtIHlvdSBjYW4gaW5pdCBhbnkgZXZlbnQgKi9cbiAgICB0aHJvdHRsZSAoXCJzY3JvbGxcIiwgXCJvcHRpbWl6ZWRTY3JvbGxcIik7XG4gICAgdGhyb3R0bGUgKFwicmVzaXplXCIsIFwib3B0aW1pemVkUmVzaXplXCIpO1xufSkoKTtcblxuLy9TdGlja3kgdG9wYmFyXG5mdW5jdGlvbiBTdGlja3lUb3BiYXIoKSB7XG4gICAgdGhpcy5faW5pdCgpO1xufVxuXG5TdGlja3lUb3BiYXIucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYubGFzdFNjcm9sbFBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICBzZWxmLnRvcGJhclRyYW5zaXRpb24gPSBmYWxzZTtcblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvcHRpbWl6ZWRTY3JvbGxcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgc2Nyb2xsUG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgICAgIGlmIChzY3JvbGxQb3MgPj0gNTUgJiYgISQoJy5jLUhlYWRlci10aXRsZScpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAkKCcuYy1IZWFkZXItdGl0bGUnKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCA1NSAmJiAkKCcuYy1IZWFkZXItdGl0bGUnKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgJCgnLmMtSGVhZGVyLXRpdGxlJykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJCgnLmMtSGVhZGVyLWNvbnRyb2xzJykuaGFzQ2xhc3MoJ2MtSGVhZGVyLWNvbnRyb2xzLS1jZW50ZXInKSkge1xuICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA1NSAmJiAhJCgnLmMtSGVhZGVyLWNvbnRyb2xzJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXItY29udHJvbHMtLWNlbnRlcicpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCA1NSAmJiAkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlci1jb250cm9scy0tY2VudGVyJykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJCgnLmMtSGVhZGVyLWNvbnRyb2xzJykuaGFzQ2xhc3MoJ2hlYWRlcl9fY29udHJvbHMtLWZpbHRlcicpKSB7XG4gICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDU1ICYmICEkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5oZWFkZXJfX2NvbnRyb2xzLS1maWx0ZXInKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgNTUgJiYgJCgnLmMtSGVhZGVyLWNvbnRyb2xzJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuaGVhZGVyX19jb250cm9scy0tZmlsdGVyJykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2MtSGVhZGVyLS1jb250cm9scycpKSB7XG4gICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDE0NSAmJiAhJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXInKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgMTQ1ICYmICQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyJykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2hlYWRlci0tZmlsdGVyJykpIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gNzAgJiYgISQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDcwICYmICQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyJykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDg1ICYmICEkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlcicpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCA4NSAmJiAkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlcicpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoJy5saWJyYXJ5X19oZWFkZXInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDcwICYmICEkKCcubGlicmFyeV9faGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcubGlicmFyeV9faGVhZGVyJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDcwICYmICQoJy5saWJyYXJ5X19oZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5saWJyYXJ5X19oZWFkZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gOTMwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA1NSAmJiAhJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCA1NSAmJiAkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gMTAgJiYgISQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgMTAgJiYgJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9KTtcbn07XG5cbi8vU2Nyb2xsU3B5TmF2XG47KGZ1bmN0aW9uKHdpbmRvdykge1xuICAgIC8vJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gU2Nyb2xsU3B5TmF2KGVsKSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcblxuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgICAgIHRoaXMuX2luaXRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBTY3JvbGxTcHlOYXYucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG9mZnNldDogdGhpcy5lbC5kYXRhc2V0LnRvcE9mZnNldFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXS5zbGljZS5jYWxsKHRoaXMuZWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJykpLm1hcChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgdmFyIGl0ZW1JZCA9IGVsLmRhdGFzZXQuaHJlZjtcbiAgICAgICAgICAgIHJldHVybiB7bmF2SXRlbTogZWwsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGl0ZW1JZCl9O1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgU2Nyb2xsU3B5TmF2LnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvcHRpbWl6ZWRTY3JvbGxcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgaWYgKCFzZWxmLnNjcm9sbGluZ1RvSXRlbSkge1xuICAgICAgICAgICAgICAgIHZhciBtYWluSXRlbXMgPSBzZWxmLml0ZW1zLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLml0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbEJDUiA9IGl0ZW0uaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbEJDUi50b3AgPiBzZWxmLm9wdGlvbnMub2Zmc2V0ICYmIGVsQkNSLnRvcCA8IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1haW5JdGVtcy5sZW5ndGggPiAwICYmICghc2VsZi5tYWluSXRlbSB8fCBzZWxmLm1haW5JdGVtICE9PSBtYWluSXRlbXNbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubWFpbkl0ZW0gPSBtYWluSXRlbXNbMF07XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpLm5hdkl0ZW0uY2xhc3NMaXN0LnJlbW92ZShzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tYWluSXRlbS5uYXZJdGVtLmNsYXNzTGlzdC5hZGQoc2VsZi5vcHRpb25zLmFjdGl2ZUNsYXNzIHx8ICdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBpdGVtLm5hdkl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhyZWYgPSAnIycgKyBlLnRhcmdldC5kYXRhc2V0LmhyZWY7XG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldFRvcCA9IGhyZWYgPT09IFwiI1wiID8gMCA6ICQoaHJlZikub2Zmc2V0KCkudG9wIC0gc2VsZi5vcHRpb25zLm9mZnNldCAtIDMwO1xuICAgICAgICAgICAgICAgIHNlbGYuc2Nyb2xsaW5nVG9JdGVtID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZWxmLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICAgICAgICBpLml0ZW0uY2xhc3NMaXN0LnJlbW92ZShzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICBpLm5hdkl0ZW0uY2xhc3NMaXN0LnJlbW92ZShzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKHNlbGYub3B0aW9ucy5hY3RpdmVDbGFzcyB8fCAnaXMtYWN0aXZlJyk7XG5cblxuICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogb2Zmc2V0VG9wXG4gICAgICAgICAgICAgICAgfSwgMzAwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zY3JvbGxpbmdUb0l0ZW0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgJChocmVmKS5hZGRDbGFzcyhzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRTY3JvbGxTcHlOYXYoKSB7XG4gICAgICAgIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXNjcm9sbFNweU5hdicpKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBuZXcgU2Nyb2xsU3B5TmF2KGVsKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGluaXRTY3JvbGxTcHlOYXYoKTtcblxufSkod2luZG93KTtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbi8vIENvbnRyb2xzXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuLy90ZXh0ZmllbGRzXG4vLzsoZnVuY3Rpb24od2luZG93KSB7XG4vLyAgICAndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFRleHRmaWVsZChlbCwgb3B0aW9ucykge1xuICB0aGlzLmVsID0gZWw7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgdGhpcy5faW5pdCgpO1xuICB0aGlzLl9pbml0RXZlbnRzKCk7XG59XG5cblRleHRmaWVsZC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLmVsLnBsYWNlaG9sZGVyID0gJyc7XG5cbiAgdGhpcy5maWVsZFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy5maWVsZFdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaW5wdXRfX3dyYXBwZXInKTtcbiAgdGhpcy5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmZpZWxkV3JhcHBlciwgdGhpcy5lbCk7XG4gIHRoaXMuZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2pzLWlucHV0Jyk7XG4gIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnaW5wdXRfX2ZpZWxkJyk7XG5cbiAgaWYgKHRoaXMuZWwudmFsdWUgIT09ICcnKSB7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gICAgdGhpcy5fdG9nZ2xlQWRkYWJsZSgpO1xuICB9XG5cbiAgaWYgKHRoaXMuZWwudHlwZSA9PT0gJ3RleHRhcmVhJykge3RoaXMuX2F1dG9zaXplKCk7fVxuICBpZiAodGhpcy5vcHRpb25zLmF1dG9jb21wbGV0ZSkge3RoaXMuZWwuY2xhc3NMaXN0LmFkZCgnaGFzLWF1dG9jb21wbGV0ZScpO31cbiAgaWYgKHRoaXMuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1kYXRlcGlja2VyJykpIHtcbiAgICB2YXIgaWQgPSAnZGF0ZVBpY2tlcicgKyBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqMTAwMDApO1xuICAgIHRoaXMuZWwuaWQgPSBpZDtcbiAgICAkKHRoaXMuZWwpLmRhdGVwaWNrZXIoe1xuICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcjJyArIGlkKS5hZGRDbGFzcygnaW5wdXRfc3RhdGVfbm90LWVtcHR5IGpzLWhhc1ZhbHVlJyk7XG4gICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VNb250aDogdHJ1ZSxcbiAgICAgIGNoYW5nZVllYXI6IHRydWVcbiAgICAgIC8qbW9udGhOYW1lc1Nob3J0OiBbIFwiSmFudWFyXCIsIFwiRmVicnVhclwiLCBcIk1hcnRzXCIsIFwiQXByaWxcIiwgXCJNYWpcIiwgXCJKdW5pXCIsIFwiSnVsaVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9rdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCIgXSovXG4gICAgfSk7XG4gIH1cbiAgaWYgKHRoaXMuZWwuaWQgPT09ICdzdGFydERhdGUnKSB7XG4gICAgJCh0aGlzLmVsKS5kYXRlcGlja2VyKHtcbiAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbihkYXRlU3RyaW5nLCBkYXRlcGlja2VyKSB7XG4gICAgICAgICQoJyNzdGFydERhdGUnKS5hZGRDbGFzcygnaW5wdXRfc3RhdGVfbm90LWVtcHR5IGpzLWhhc1ZhbHVlJyk7XG4gICAgICAgIHN0YXJ0RGF0ZSA9IGRhdGVTdHJpbmc7XG4gICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VNb250aDogdHJ1ZSxcbiAgICAgIGNoYW5nZVllYXI6IHRydWVcbiAgICAgIC8qbW9udGhOYW1lc1Nob3J0OiBbIFwiSmFudWFyXCIsIFwiRmVicnVhclwiLCBcIk1hcnRzXCIsIFwiQXByaWxcIiwgXCJNYWpcIiwgXCJKdW5pXCIsIFwiSnVsaVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9rdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCIgXSovXG4gICAgfSk7XG4gIH1cbiAgaWYgKHRoaXMuZWwuaWQgPT09ICdlbmREYXRlJykge1xuICAgICQodGhpcy5lbCkuZGF0ZXBpY2tlcih7XG4gICAgICBvblNlbGVjdDogZnVuY3Rpb24oZGF0ZVN0cmluZywgZGF0ZXBpY2tlcikge1xuICAgICAgICAkKCcjZW5kRGF0ZScpLmFkZENsYXNzKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHkganMtaGFzVmFsdWUnKTtcbiAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgfSxcbiAgICAgIGJlZm9yZVNob3c6IGZ1bmN0aW9uKGVsZW1lbnQsIGRhdGVwaWNrZXIpIHtcbiAgICAgICAgJCgnI2VuZERhdGUnKS5kYXRlcGlja2VyKCdvcHRpb24nLCAnZGVmYXVsdERhdGUnLCBzdGFydERhdGUpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZU1vbnRoOiB0cnVlLFxuICAgICAgY2hhbmdlWWVhcjogdHJ1ZVxuICAgICAgLyptb250aE5hbWVzU2hvcnQ6IFsgXCJKYW51YXJcIiwgXCJGZWJydWFyXCIsIFwiTWFydHNcIiwgXCJBcHJpbFwiLCBcIk1halwiLCBcIkp1bmlcIiwgXCJKdWxpXCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2t0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIiBdKi9cbiAgICB9KTtcbiAgfVxuXG4gIGlmICh0aGlzLm9wdGlvbnMubGFiZWwpIHtcbiAgICB0aGlzLmxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICB0aGlzLmxhYmVsLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5sYWJlbDtcbiAgICB0aGlzLmxhYmVsLmNsYXNzTGlzdC5hZGQoJ2lucHV0X19sYWJlbCcpO1xuICAgIHRoaXMubGFiZWwuZm9yID0gdGhpcy5lbC5pZDtcbiAgICB0aGlzLmZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcbiAgfVxuXG4gIHRoaXMuYmxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsgLy9Vc2UgYXMgYSBoZWxwZXIgdG8gbWFrZSBibGluayBhbmltYXRpb24gb24gZm9jdXMgZmllbGRcbiAgdGhpcy5ibGluay5jbGFzc0xpc3QuYWRkKCdpbnB1dF9fYmxpbmsnKTtcbiAgdGhpcy5maWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5ibGluayk7XG5cbiAgaWYgKHRoaXMub3B0aW9ucy5oZWxwVGV4dCkge1xuICAgIHRoaXMuaGVscFRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmhlbHBUZXh0LmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5oZWxwVGV4dDtcbiAgICB0aGlzLmhlbHBUZXh0LmNsYXNzTGlzdC5hZGQoJ2lucHV0X19oZWxwLXRleHQnKTtcbiAgICB0aGlzLmZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmhlbHBUZXh0KTtcbiAgfVxuICBpZiAodGhpcy5vcHRpb25zLmVyck1zZykge1xuICAgIHRoaXMuZXJyTXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5lcnJNc2cuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmVyck1zZztcbiAgICB0aGlzLmVyck1zZy5jbGFzc0xpc3QuYWRkKCdpbnB1dF9fZXJyLW1zZycpO1xuICAgIHRoaXMuZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZXJyTXNnKTtcbiAgfVxufTtcblxuVGV4dGZpZWxkLnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIC8vQ2hlY2sgaWYgZmllbGQgaXMgZW1wdHkgb3Igbm90IGFuZCBjaGFuZ2UgY2xhc3MgYWNjb3JkaW5nbHlcbiAgJCh0aGlzLmVsKS5vbignYmx1cicsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dF9zdGF0ZV9lcnInKTtcbiAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfVxuICAgIGUudGFyZ2V0LnBsYWNlaG9sZGVyID0gJyc7XG4gICAgaWYgKGUudGFyZ2V0LnJlcXVpcmVkICYmICFlLnRhcmdldC52YWx1ZSkge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnaW5wdXRfc3RhdGVfZXJyJyk7XG4gICAgfVxuICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge3NlbGYubGlzdC5yZW1vdmUoKTt9LCAxNTApO1xuICAgIH1cbiAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuICB9KTtcblxuICAvL09uIGZvY3VzIGV2ZW50XG4gICQodGhpcy5lbCkub24oJ2ZvY3VzJywgZnVuY3Rpb24oZSkge1xuICAgIGlmIChzZWxmLm9wdGlvbnMucGxhY2Vob2xkZXIpIHtcbiAgICAgIGUudGFyZ2V0LnBsYWNlaG9sZGVyID0gc2VsZi5vcHRpb25zLnBsYWNlaG9sZGVyO1xuICAgIH1cbiAgICBpZiAoc2VsZi5vcHRpb25zLmF1dG9jb21wbGV0ZSkge1xuICAgICAgc2VsZi5saXN0ID0gcmVuZGVyQXV0b2NvbXBsZXRlTGlzdChzZWxmLm9wdGlvbnMuYXV0b2NvbXBsZXRlLCBoYW5kbGVBdXRvY29tcGxldGVJdGVtQ2xpY2spO1xuICAgICAgcGxhY2VBdXRvY29tcGxldGVMaXN0KHNlbGYubGlzdCwgJChzZWxmLmZpZWxkV3JhcHBlcikpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy9PbiBjaGFuZ2UgZXZlbnRcbiAgJCh0aGlzLmVsKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0X3N0YXRlX2VycicpO1xuICAgIGlmIChlLnRhcmdldC52YWx1ZSAhPT0gJycpIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICB9XG4gICAgZS50YXJnZXQucGxhY2Vob2xkZXIgPSAnJztcbiAgICBpZiAoc2VsZi5vcHRpb25zLm9uQ2hhbmdlKSB7XG4gICAgICBzZWxmLm9wdGlvbnMub25DaGFuZ2UoZSk7XG4gICAgfVxuICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gIH0pO1xuXG4gIC8vT24gaW5wdXQgZXZlbnRcbiAgJChzZWxmLmVsKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKSB7XG4gICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5wdXRfc3RhdGVfZXJyJyk7XG4gICAgaWYgKGUudGFyZ2V0LnZhbHVlICE9PSAnJykge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIH1cbiAgICBlLnRhcmdldC5wbGFjZWhvbGRlciA9ICcnO1xuICAgIGlmIChzZWxmLm9wdGlvbnMub25JbnB1dCkge1xuICAgICAgc2VsZi5vcHRpb25zLm9uSW5wdXQoZSk7XG4gICAgfVxuICAgIGlmIChzZWxmLm9wdGlvbnMuYXV0b2NvbXBsZXRlKSB7XG4gICAgICB2YXIgZGF0YSA9IHNlbGYub3B0aW9ucy5hdXRvY29tcGxldGUuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWxmLmVsLnZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgfSlcbiAgICAgIHVwZGF0ZUF1dG9jb21wbGV0ZUxpc3Qoc2VsZi5saXN0LCBkYXRhLCBoYW5kbGVBdXRvY29tcGxldGVJdGVtQ2xpY2spO1xuICAgIH1cbiAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuICB9KTtcbiAgJChzZWxmLmVsKS5vbigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUtleURvd24oZSkge1xuICAgIHZhciBpbmRleCwgbGVuZ3RoO1xuICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICBjYXNlIDEzOlxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNlbGVjdEl0ZW0oc2VsZi5saXN0LmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5nZXQoMCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge2Nsb3NlQXV0b2NvbXBsZXRlKCk7ICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDI3OlxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBjbG9zZUF1dG9jb21wbGV0ZSgpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAzODpcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgICBsZW5ndGggPSAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5sZW5ndGg7XG5cbiAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCAtIDEpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcblxuICAgICAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCA8IDUwKSB7XG4gICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPiAwID8gJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpIC0gJChzZWxmLmxpc3QpLmhlaWdodCgpIDogMFxuICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXG4gICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDQwOlxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmhlaWdodCgpIDwgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKSkge1xuICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKVxuICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaW5kZXggPT09IGxlbmd0aCkge1xuICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4KS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4KS5oZWlnaHQoKVxuICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyQXV0b2NvbXBsZXRlTGlzdChkYXRhLCBjYWxsYmFjaykge1xuICAgIHZhciBsaXN0ID0gJCgnPHVsIC8+JykuYWRkQ2xhc3MoJ2F1dG9jb21wbGV0ZScpXG5cbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgbGlzdC5hcHBlbmQocmVuZGVyQXV0b2NvbXBsZXRlSXRlbShpdGVtLCBjYWxsYmFjaykpO1xuICAgIH0pO1xuICAgIGxpc3QuZmluZCgnLmF1dG9jb21wbGV0ZV9faXRlbScpLmZpcnN0KCkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgIHJldHVybiBsaXN0O1xuICB9XG4gIGZ1bmN0aW9uIHBsYWNlQXV0b2NvbXBsZXRlTGlzdChsaXN0LCBwYXJlbnQpIHtcbiAgICBwYXJlbnQuYXBwZW5kKGxpc3QpO1xuXG4gICAgdmFyIHBhcmVudEJDUiA9IHBhcmVudC5nZXQoMCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgcGFyZW50T2Zmc2V0VG9wID0gcGFyZW50LmdldCgwKS5vZmZzZXRUb3AsXG4gICAgbGlzdEJDUiA9IGxpc3QuZ2V0KDApLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuXG4gICAgaGVpZ2h0Q2hlY2sgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBwYXJlbnRCQ1IudG9wIC0gcGFyZW50QkNSLmhlaWdodCAtIGxpc3RCQ1IuaGVpZ2h0O1xuXG4gICAgbGlzdC5nZXQoMCkuc3R5bGUudG9wID0gaGVpZ2h0Q2hlY2sgPiAwID8gcGFyZW50T2Zmc2V0VG9wICsgcGFyZW50QkNSLmhlaWdodCArIDUgKyAncHgnIDogcGFyZW50T2Zmc2V0VG9wIC0gbGlzdEJDUi5oZWlnaHQgLSAxMCArICdweCc7XG4gIH1cbiAgZnVuY3Rpb24gdXBkYXRlQXV0b2NvbXBsZXRlTGlzdCAobGlzdCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICBsaXN0LmVtcHR5KCk7XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIGxpc3QuYXBwZW5kKHJlbmRlckF1dG9jb21wbGV0ZUl0ZW0oaXRlbSwgY2FsbGJhY2spKTtcbiAgICB9KTtcbiAgICBsaXN0LmZpbmQoJy5hdXRvY29tcGxldGVfX2l0ZW0nKS5maXJzdCgpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgfVxuICBmdW5jdGlvbiByZW5kZXJBdXRvY29tcGxldGVJdGVtKGl0ZW0sIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuICQoJzxsaSAvPicpLmFkZENsYXNzKCdhdXRvY29tcGxldGVfX2l0ZW0nKS5jbGljayhjYWxsYmFjaykub24oJ21vdXNlb3ZlcicsIGhhbmRsZUl0ZW1Nb3VzZU92ZXIpLnRleHQoaXRlbSk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVBdXRvY29tcGxldGVJdGVtQ2xpY2soZSkge1xuICAgIHNlbGVjdEl0ZW0oZS50YXJnZXQpO1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZUl0ZW1Nb3VzZU92ZXIoZSkge1xuICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICB9XG4gIGZ1bmN0aW9uIHNlbGVjdEl0ZW0oaXRlbSkge1xuICAgIHNlbGYuZWwudmFsdWUgPSBpdGVtLmlubmVySFRNTDtcbiAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIGNsb3NlQXV0b2NvbXBsZXRlKCk7XG4gIH1cbiAgZnVuY3Rpb24gY2xvc2VBdXRvY29tcGxldGUoKSB7XG4gICAgc2VsZi5saXN0LnJlbW92ZSgpO1xuICB9XG59O1xuXG4vL0F1dG9yZXNpemUgdGV4dGFyZWFcblRleHRmaWVsZC5wcm90b3R5cGUuX2F1dG9zaXplID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmVsLnZhbHVlID09PSAnJykge3RoaXMuZWwucm93cyA9IDE7fVxuICBlbHNlIHtcbiAgICB2YXIgd2lkdGggPSB0aGlzLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLFxuICAgIHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyksXG4gICAgdGV4dFdpZHRoID0gdGhpcy5lbC52YWx1ZS5sZW5ndGggKiA3LFxuICAgIHJlID0gL1tcXG5cXHJdL2lnO1xuICAgIGxpbmVCcmFrZXMgPSB0aGlzLmVsLnZhbHVlLm1hdGNoKHJlKTtcbiAgICByb3cgPSBNYXRoLmNlaWwodGV4dFdpZHRoIC8gd2lkdGgpO1xuXG4gICAgcm93ID0gcm93IDw9IDAgPyAxIDogcm93O1xuICAgIHJvdyA9IHRoaXMub3B0aW9ucy5tYXhIZWlnaHQgJiYgcm93ID4gdGhpcy5vcHRpb25zLm1heEhlaWdodCA/IHRoaXMub3B0aW9ucy5tYXhIZWlnaHQgOiByb3c7XG5cbiAgICBpZiAobGluZUJyYWtlcykge1xuICAgICAgcm93ICs9IGxpbmVCcmFrZXMubGVuZ3RoO1xuICAgIH1cblxuICAgIHRoaXMuZWwucm93cyA9IHJvdztcbiAgfVxufTtcblxuVGV4dGZpZWxkLnByb3RvdHlwZS5fdG9nZ2xlQWRkYWJsZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5sZW5ndGggPiAwKSB7XG4gICAgY29uc29sZS5sb2coJCh0aGlzLmVsKS5oYXNDbGFzcygnanMtaGFzVmFsdWUnKSk7XG4gICAgaWYgKCQodGhpcy5lbCkuaGFzQ2xhc3MoJ2pzLWhhc1ZhbHVlJykpIHtcbiAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykuYWRkQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBpbml0VGV4dGZpZWxkcygpIHtcbiAgcmV0dXJuO1xuICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1pbnB1dCcpKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgbmV3IFRleHRmaWVsZChlbCwge1xuICAgICAgbGFiZWw6IGVsLmRhdGFzZXQubGFiZWwsXG4gICAgICBoZWxwVGV4dDogZWwuZGF0YXNldC5oZWxwVGV4dCxcbiAgICAgIGVyck1zZzogZWwuZGF0YXNldC5lcnJNc2csXG4gICAgICBwbGFjZWhvbGRlcjogZWwucGxhY2Vob2xkZXIsXG4gICAgICBtYXNrOiBlbC5kYXRhc2V0Lm1hc2ssXG4gICAgICBtYXhIZWlnaHQ6IGVsLmRhdGFzZXQubWF4SGVpZ2h0XG4gICAgfSk7XG4gIH0pO1xuICBcbn1cblxuaW5pdFRleHRmaWVsZHMoKTtcblxuLy9zZWxlY3Rib3hcbi8vOyhmdW5jdGlvbih3aW5kb3cpIHtcbiAgICAvLyd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIFNlbGVjdGJveChlbCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cblxuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgICAgIHRoaXMuX2luaXRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBTZWxlY3Rib3gucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlSXRlbSA9IHRoaXMub3B0aW9ucy5pdGVtcy5pbmRleE9mKHRoaXMub3B0aW9ucy5zZWxlY3RlZEl0ZW0pO1xuICAgICAgICB0aGlzLm9wdGlvbnMudW5zZWxlY3QgPSB0aGlzLm9wdGlvbnMudW5zZWxlY3QgIT09IC0xID8gJ+KAlCBOb25lIOKAlCcgOiB0aGlzLm9wdGlvbnMudW5zZWxlY3Q7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5jbGFzc0xpc3QuYWRkKCdzZWxlY3RfX3dyYXBwZXInKTtcbiAgICAgICAgdGhpcy5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLnNlbGVjdFdyYXBwZXIsIHRoaXMuZWwpO1xuICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnanMtc2VsZWN0Ym94Jyk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19maWVsZCcpO1xuXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUl0ZW0gPj0gMCkge1xuICAgICAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5pdGVtc1t0aGlzLmFjdGl2ZUl0ZW1dO1xuICAgICAgICAgICAgdGhpcy5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYWJlbCkge1xuICAgICAgICAgICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5sYWJlbDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19sYWJlbCcpO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5mb3IgPSB0aGlzLmVsLmlkO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGVscFRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmhlbHBUZXh0O1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2hlbHAtdGV4dCcpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuaGVscFRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXJyTXNnKSB7XG4gICAgICAgICAgICB0aGlzLmVyck1zZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmVyck1zZztcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fZXJyLW1zZycpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZXJyTXNnKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBTZWxlY3Rib3gucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAvL0Nsb3NlIGxpc3QgaGVscGVyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlTGlzdCgpIHtcbiAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0Ym94X3N0YXRlX29wZW4nKTtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdFdyYXBwZXIucmVtb3ZlQ2hpbGQoc2VsZi5saXN0KTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWFyY2hGaWVsZCAmJiBzZWxmLnNlYXJjaEZpZWxkLnBhcmVudE5vZGUgPT09IHNlbGYuZWwpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLnJlbW92ZUNoaWxkKHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuaW5wdXRGaWVsZCAmJiBzZWxmLmlucHV0RmllbGQucGFyZW50Tm9kZSA9PT0gc2VsZi5lbCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwucmVtb3ZlQ2hpbGQoc2VsZi5pbnB1dEZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW0gPCAwKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBzZWxmLm9wdGlvbnMuaXRlbXNbc2VsZi5hY3RpdmVJdGVtXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZVNlbGVjdERvY0NsaWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vQ3JlYXRlIGxpc3QgaGVscGVyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUxpc3QoaXRlbXMsIGFjdGl2ZUl0ZW0sIHNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzZWxmLmxpc3QpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgc2VsZi5saXN0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fbGlzdCcpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0SXRlbShpdGVtLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtQ2xhc3MgPSBzZWxmLm9wdGlvbnMuY29tcGxleEl0ZW1zID8gJ3NlbGVjdGJveF9fbGlzdC1pdGVtIHNlbGVjdGJveF9fbGlzdC1pdGVtLS1jb21wbGV4JyA6ICdzZWxlY3Rib3hfX2xpc3QtaXRlbSBzZWxlY3Rib3hfX2xpc3QtaXRlbS0tdGV4dCcsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50ID0gJCgnPGxpPjwvbGk+JykuYWRkQ2xhc3MoaXRlbUNsYXNzKS50ZXh0KGl0ZW0pLFxuICAgICAgICAgICAgICAgICAgICBsaXN0SGVscGVyID0gJCgnPGRpdj48L2Rpdj4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtaXRlbScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdwb3NpdGlvbicsICdhYnNvbHV0ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCd6LWluZGV4JywgJy0xJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdvdmVyZmxvdycsICd2aXNpYmxlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3doaXRlLXNwYWNlJywgJ25vd3JhcCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dChpdGVtKTtcblxuICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZChsaXN0SGVscGVyLmdldCgwKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5hdHRyKCdkYXRhLWluZGV4JywgaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuY29tcGxleEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmdldCgwKS5pbm5lckhUTUwgPSBpdGVtO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzZWFyY2hUZXh0ICYmICFzZWxmLm9wdGlvbnMuY29tcGxleEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmdldCgwKS5pbm5lckhUTUwgPSBsaXN0SXRlbVRleHQoaXRlbSwgc2VhcmNoVGV4dCwgJChzZWxmLmxpc3QpLndpZHRoKCkgPCBsaXN0SGVscGVyLndpZHRoKCkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50Lm9uKCdtb3VzZWRvd24nLCBoYW5kbGVJdGVtQ2xpY2spO1xuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50Lm9uKCdtb3VzZW92ZXInLCBoYW5kbGVJdGVtTW91c2VPdmVyKTtcblxuICAgICAgICAgICAgICAgIGxpc3RIZWxwZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1FbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdEl0ZW1UZXh0KGl0ZW1TdHJpbmcsIHRleHQsIGxvbmcpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0U3RyaW5nID0gaXRlbVN0cmluZztcbiAgICAgICAgICAgICAgICBpZiAobG9uZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgd29yZHMgPSBpdGVtU3RyaW5nLnNwbGl0KCcgJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hJbmRleCA9IHdvcmRzLnJlZHVjZShmdW5jdGlvbihjdXJyZW50SW5kZXgsIHdvcmQsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3RyaW5nID0gd29yZC50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGV4dCkgPiAtMSAmJiBjdXJyZW50SW5kZXggPT09IC0xID8gaW5kZXggOiBjdXJyZW50SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAtMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlYXJjaEluZGV4ID49IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdHJpbmdFbmQgPSB3b3Jkcy5zbGljZShzZWFyY2hJbmRleCkucmVkdWNlKGZ1bmN0aW9uKHN0ciwgd29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHIgKyAnICcgKyB3b3JkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gL1xcLiQvO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRzWzBdLm1hdGNoKHJlZykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTdHJpbmcgPSB3b3Jkc1swXSArICcgJyArIHdvcmRzWzFdICsgJyAuLi4gJyArIHN0cmluZ0VuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3RyaW5nID0gd29yZHNbMF0gKyAnIC4uLiAnICsgc3RyaW5nRW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHN0YXJ0VGV4dEluZGV4ID0gb3V0cHV0U3RyaW5nLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0LnRvTG93ZXJDYXNlKCkpLFxuICAgICAgICAgICAgICAgICAgICBlbmRUZXh0SW5kZXggPSBzdGFydFRleHRJbmRleCArIHRleHQubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IG91dHB1dFN0cmluZy5zbGljZSgwLCBzdGFydFRleHRJbmRleCksXG4gICAgICAgICAgICAgICAgICAgIG1pZGRsZSA9IG91dHB1dFN0cmluZy5zbGljZShzdGFydFRleHRJbmRleCwgZW5kVGV4dEluZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgZW5kID0gb3V0cHV0U3RyaW5nLnNsaWNlKGVuZFRleHRJbmRleCksXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICAgICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3RhcnQpKTtcbiAgICAgICAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKCQoJzxzcGFuPjwvc3Bhbj4nKS5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWhpZ2hsaWdodCcpLnRleHQobWlkZGxlKS5nZXQoMCkpO1xuICAgICAgICAgICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZW5kKSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5pbm5lckhUTUw7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRpdmlkZXIoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICQoJzxsaT48L2xpPicpLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtZGl2aWRlcicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VsZi5saXN0KTtcblxuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy51bnNlbGVjdCAhPT0gLTEgJiYgIXNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3SXRlbSA9IGxpc3RJdGVtKHNlbGYub3B0aW9ucy51bnNlbGVjdCkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCBzZWxlY3Rib3hfX2xpc3QtdW5zZWxlY3QnKTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QuYXBwZW5kQ2hpbGQobmV3SXRlbS5nZXQoMCkpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChkaXZpZGVyKCkuZ2V0KDApKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0l0ZW0gPSBsaXN0SXRlbShpdGVtLCBzZWxmLm9wdGlvbnMuaXRlbXMuaW5kZXhPZihpdGVtKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCAmJiBzZWxmLmxpc3QuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0l0ZW0uYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlSXRlbSA9PT0gaSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdJdGVtLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QuYXBwZW5kQ2hpbGQobmV3SXRlbS5nZXQoMCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBmaWVsZFJlY3QgPSBzZWxmLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgICAgIGZpZWxkT2Zmc2V0VG9wID0gc2VsZi5lbC5vZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIG1lbnVSZWN0ID0gc2VsZi5saXN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuXG4gICAgICAgICAgICAgICAgaGVpZ2h0Q2hlY2sgPSB3aW5kb3dIZWlnaHQgLSBmaWVsZFJlY3QudG9wIC0gZmllbGRSZWN0LmhlaWdodCAtIG1lbnVSZWN0LmhlaWdodDtcblxuICAgICAgICAgICAgc2VsZi5saXN0LnN0eWxlLnRvcCA9IGhlaWdodENoZWNrID4gMCA/IGZpZWxkT2Zmc2V0VG9wICsgZmllbGRSZWN0LmhlaWdodCArIDUgKyAncHgnIDogZmllbGRPZmZzZXRUb3AgLSBtZW51UmVjdC5oZWlnaHQgLSAxMCArICdweCc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RJdGVtKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMudW5zZWxlY3QgJiYgaXRlbS5pbm5lckhUTUwgPT09IHNlbGYub3B0aW9ucy51bnNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGYuYWN0aXZlSXRlbSA9IC0xO1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0Ym94X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZWxlY3RpbmcgaXRlbVwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLmVsKTtcbiAgICAgICAgICAgICAgICBzZWxmLmFjdGl2ZUl0ZW0gPSBpdGVtLmRhdGFzZXQuaW5kZXg7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLm9uU2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSBpdGVtLmNoaWxkTm9kZXNbMF0ubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGl0ZW0uZGF0YXNldC5pbmRleDtcbiAgICAgICAgICAgICAgICBzZWxmLm9wdGlvbnMub25TZWxlY3QodGV4dCwgaW5kZXgsIHNlbGYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5pdGVtQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBzZWxmLm9wdGlvbnMuaXRlbUNhbGxiYWNrKGl0ZW0sIHNlbGYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9TZWxlY3QgY2xpY2tcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2VsZWN0Q2xpY2soZSkge1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgICAgIGlmICghc2VsZi5hY3RpdmVJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9DaGVjayBpZiB0aGVyZSBpcyBhbnkgc2VsZWN0ZWQgaXRlbS4gSWYgbm90IHNldCB0aGUgcGxhY2Vob2xkZXIgdGV4dFxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5hY3RpdmVJdGVtIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBzZWxmLnBsYWNlaG9sZGVyIHx8ICdTZWxlY3QnO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy9DaGVjayBpZiBzZWFyY2ggb3B0aW9uIGlzIG9uIG9yIHRoZXJlIGlzIG1vcmUgdGhhbiAxMCBpdGVtcy4gSWYgeWVzLCBhZGQgc2VhcmNmaWVsZFxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnNlYXJjaCB8fCBzZWxmLm9wdGlvbnMuaXRlbXMubGVuZ3RoID4gNykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmLnNlYXJjaEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC50eXBlID0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19zZWFyY2hmaWVsZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQucGxhY2Vob2xkZXIgPSBzZWxmLm9wdGlvbnMuc2VhcmNoUGxhY2Vob2xkZXIgfHwgJ1NlYXJjaC4uLic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC50eXBlID0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5pbnB1dEZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X3N0YXRlX29wZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlTGlzdChzZWxmLm9wdGlvbnMuaXRlbXMsIHNlbGYuYWN0aXZlSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlU2VsZWN0RG9jQ2xpY2spO30sIDEwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vU2VsZWN0IGl0ZW0gaGFuZGxlclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVJdGVtQ2xpY2soZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHNlbGVjdEl0ZW0oZS50YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUl0ZW1Nb3VzZU92ZXIoZSkge1xuICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNlbGVjdERvY0NsaWNrKCkge1xuICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL0Z1bHRlciBmdW5jdGlvbiBmb3Igc2VhcmNmaWVsZFxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTZWFyY2hGaWVsZElucHV0KGUpIHtcbiAgICAgICAgICAgIHZhciBmSXRlbXMgPSBzZWxmLm9wdGlvbnMuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjcmVhdGVMaXN0KGZJdGVtcywgc2VsZi5hY3RpdmVJdGVtLCBlLnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUtleURvd24oZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHZhciBpbmRleCwgbGVuZ3RoO1xuICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RJdGVtKHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMjc6XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggLSAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wIDwgNTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA+IDAgPyAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPCAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLm91dGVySGVpZ2h0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCkucG9zaXRpb24oKS50b3AgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCkuaGVpZ2h0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vQ2hlY2sgaWYgZmllbGQgaXMgZW1wdHkgb3Igbm90IGFuZCBjaGFuZ2UgY2xhc3MgYWNjb3JkaW5nbHlcbiAgICAgICAgJChzZWxmLmVsKS5vbignY2xpY2snLCBoYW5kbGVTZWxlY3RDbGljayk7XG4gICAgfTtcblxuICAgIFNlbGVjdGJveC5wcm90b3R5cGUuX3RvZ2dsZUFkZGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKCQodGhpcy5lbCkuaGFzQ2xhc3MoJ2pzLWhhc1ZhbHVlJykpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmFkZENsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLnJlbW92ZUNsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIFNlbGVjdGJveC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3Rib3hfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIHRoaXMuYWN0aXZlSXRlbSA9IC0xO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBpbml0U2VsZWN0Ym94ZXMoKSB7XG4gICAgICAgIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXNlbGVjdGJveCcpKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBuZXcgU2VsZWN0Ym94KGVsLCB7XG4gICAgICAgICAgICAgICAgbGFiZWw6IGVsLmRhdGFzZXQubGFiZWwsXG4gICAgICAgICAgICAgICAgaGVscFRleHQ6IGVsLmRhdGFzZXQuaGVscFRleHQsXG4gICAgICAgICAgICAgICAgZXJyTXNnOiBlbC5kYXRhc2V0LmVyck1zZyxcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogZWwuZGF0YXNldC5wbGFjZWhvbGRlcixcbiAgICAgICAgICAgICAgICBpdGVtczogSlNPTi5wYXJzZShlbC5kYXRhc2V0Lml0ZW1zKSxcbiAgICAgICAgICAgICAgICBzZWFyY2g6IGVsLmRhdGFzZXQuc2VhcmNoLFxuICAgICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyOmVsLmRhdGFzZXQuc2VhcmNoUGxhY2Vob2xkZXIsXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IGVsLmRhdGFzZXQucmVxdWlyZWQsXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtOiBlbC5kYXRhc2V0LnNlbGVjdGVkSXRlbSxcbiAgICAgICAgICAgICAgICB1bnNlbGVjdDogZWwuZGF0YXNldC51bnNlbGVjdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGluaXRTZWxlY3Rib3hlcygpO1xuXG5cbi8vfSkod2luZG93KTtcblxuLy9UYWdmaWVsZHNcbi8vOyhmdW5jdGlvbih3aW5kb3cpIHtcbiAgICAvLyd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIFRhZ2ZpZWxkKGVsLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgICAgIHRoaXMuX2luaXRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBUYWdmaWVsZC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLm9wdGlvbnMuaW5pdGlhbEl0ZW1zIHx8IFtdO1xuXG4gICAgICAgIHRoaXMudGFnZmllbGRXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMudGFnZmllbGRXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX193cmFwcGVyJyk7XG4gICAgICAgIHRoaXMuZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy50YWdmaWVsZFdyYXBwZXIsIHRoaXMuZWwpO1xuICAgICAgICB0aGlzLnRhZ2ZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdqcy10YWdmaWVsZCcpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX19maWVsZCcpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubGFiZWwpIHtcbiAgICAgICAgICAgIHRoaXMubGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMubGFiZWw7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX19sYWJlbCcpO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5mb3IgPSB0aGlzLmVsLmlkO1xuICAgICAgICAgICAgdGhpcy50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5sYWJlbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWxwVGV4dCkge1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuaGVscFRleHQ7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0LmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX19oZWxwLXRleHQnKTtcbiAgICAgICAgICAgIHRoaXMudGFnZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuaGVscFRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXJyTXNnKSB7XG4gICAgICAgICAgICB0aGlzLmVyck1zZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmVyck1zZztcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX19lcnItbXNnJyk7XG4gICAgICAgICAgICB0aGlzLnRhZ2ZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVyck1zZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgc2VsZi5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuX2NyZWF0ZVRhZyhpdGVtKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBUYWdmaWVsZC5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8vQ2xvc2UgbGlzdCBoZWxwZXJcbiAgICAgICAgZnVuY3Rpb24gY2xvc2VMaXN0KCkge1xuICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCd0YWdmaWVsZF9zdGF0ZV9vcGVuJyk7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2VsZi5saXN0KTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWFyY2hGaWVsZCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwucmVtb3ZlQ2hpbGQoc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5oZWxwZXJGaWVsZCAmJiBzZWxmLmhlbHBlckZpZWxkLnBhcmVudE5vZGUgPT09IHNlbGYuZWwpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLnJlbW92ZUNoaWxkKHNlbGYuaGVscGVyRmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFnZmllbGRfX3RhZycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgndGFnZmllbGRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZVRhZ2ZpZWxkRG9jQ2xpY2spO1xuICAgICAgICAgICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuICAgICAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9DcmVhdGUgbGlzdCBoZWxwZXJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlTGlzdChpdGVtcywgYWN0aXZlSXRlbSwgc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYubGlzdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYubGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgICAgICBzZWxmLmxpc3QuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19saXN0Jyk7XG5cbiAgICAgICAgICAgIHNlbGYubGlzdEhlbHBlciA9ICQoJzxkaXY+PC9kaXY+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtaXRlbScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnei1pbmRleCcsICctMScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnb3ZlcmZsb3cnLCAndmlzaWJsZScpO1xuXG4gICAgICAgICAgICBzZWxmLnRhZ2ZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZChzZWxmLmxpc3RIZWxwZXIuZ2V0KDApKTtcblxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2xpc3QtaXRlbScpO1xuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmlubmVySFRNTCA9IGl0ZW07XG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuaWQgPSAnbGlzdEl0ZW0tJyArIGk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0SGVscGVyLnRleHQoaXRlbSk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBsaXN0SXRlbVRleHQoaXRlbVN0cmluZywgdGV4dCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgd29yZHMgPSBpdGVtU3RyaW5nLnNwbGl0KCcgJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hJbmRleCA9IHdvcmRzLnJlZHVjZShmdW5jdGlvbihjdXJyZW50SW5kZXgsIHdvcmQsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdvcmQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQpID4gLTEgJiYgY3VycmVudEluZGV4ID09PSAtMSA/IGluZGV4IDogY3VycmVudEluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgLTEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWFyY2hJbmRleCA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtU3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0cmluZ0VuZCA9IHdvcmRzLnNsaWNlKHNlYXJjaEluZGV4KS5yZWR1Y2UoZnVuY3Rpb24oc3RyLCB3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0ciArICcgJyArIHdvcmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWcgPSAvXFwuJC87XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZHNbMF0ubWF0Y2gocmVnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3b3Jkc1swXSArICcgJyArIHdvcmRzWzFdICsgJyAuLi4gJyArIHN0cmluZ0VuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdvcmRzWzBdICsgJyAuLi4gJyArIHN0cmluZ0VuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzZWFyY2hUZXh0ICYmICQoc2VsZi5zZWxlY3RXcmFwcGVyKS53aWR0aCgpIDwgc2VsZi5saXN0SGVscGVyLndpZHRoKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuaW5uZXJIVE1MID0gbGlzdEl0ZW1UZXh0KGl0ZW0sIHNlYXJjaFRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUl0ZW0gPT09IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZUl0ZW1DbGljayk7XG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgaGFuZGxlSXRlbU1vdXNlT3Zlcik7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LmFwcGVuZENoaWxkKGl0ZW1FbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzZWxmLnRhZ2ZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZChzZWxmLmxpc3QpO1xuXG5cbiAgICAgICAgICAgIHZhciBmaWVsZFJlY3QgPSBzZWxmLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgICAgIGZpZWxkT2Zmc2V0VG9wID0gc2VsZi5lbC5vZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIG1lbnVSZWN0ID0gc2VsZi5saXN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuXG4gICAgICAgICAgICAgICAgaGVpZ2h0Q2hlY2sgPSB3aW5kb3dIZWlnaHQgLSBmaWVsZFJlY3QudG9wIC0gZmllbGRSZWN0LmhlaWdodCAtIG1lbnVSZWN0LmhlaWdodDtcblxuICAgICAgICAgICAgc2VsZi5saXN0LnN0eWxlLnRvcCA9IGhlaWdodENoZWNrID4gMCA/IGZpZWxkT2Zmc2V0VG9wICsgZmllbGRSZWN0LmhlaWdodCArIDUgKyAncHgnIDogZmllbGRPZmZzZXRUb3AgLSBtZW51UmVjdC5oZWlnaHQgLSAxMCArICdweCc7XG4gICAgICAgIH1cblxuICAgICAgICAvL1NlbGVjdCBjbGlja1xuICAgICAgICBmdW5jdGlvbiBoYW5kbGVUYWdmaWVsZENsaWNrKGUpIHtcbiAgICAgICAgICAgIC8vZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICAvL2Nsb3NlTGlzdCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vQ3JlYXRlIFNlYXJjaGZpZWxkXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuc2VhcmNoIHx8IHNlbGYub3B0aW9ucy5pdGVtcy5sZW5ndGggPiA3IHx8IHNlbGYub3B0aW9ucy5jcmVhdGVUYWdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbGYuc2VhcmNoRmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fc2VhcmNoZmllbGQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnBsYWNlaG9sZGVyID0gc2VsZi5vcHRpb25zLnNlYXJjaFBsYWNlaG9sZGVyIHx8ICdTZWFyY2guLi4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBoYW5kbGVTZWFyY2hGaWVsZElucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnZhbHVlID0gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZ2ZpZWxkX190YWcnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IHNlbGYub3B0aW9ucy5wbGFjZWZvbGRlciB8fCAnU2VsZWN0IGZyb20gdGhlIGxpc3QnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLmNsYXNzTGlzdC5hZGQoJ2pzLWhlbHBlcklucHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5zdHlsZS56SW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaGFuZGxlU2VhcmNoRmllbGRJbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5oZWxwZXJGaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX3N0YXRlX29wZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlTGlzdChzZWxmLm9wdGlvbnMuaXRlbXMsIHNlbGYuYWN0aXZlSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlVGFnZmllbGREb2NDbGljayk7fSwgMTAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICAvL1NlbGVjdCBpdGVtIGhhbmRsZXJcbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0VGFnKGVsKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWdmaWVsZF9fdGFnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFnZmllbGRfX3NlYXJjaGZpZWxkJykubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWhlbHBlcklucHV0JykubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5oZWxwZXJGaWVsZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKHNlbGYuc2VhcmNoRmllbGQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmluc2VydEJlZm9yZShzZWxmLl9jcmVhdGVUYWcoZWwuaW5uZXJIVE1MKSwgc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5fY3JlYXRlVGFnKGVsLmlubmVySFRNTCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5pdGVtcy5wdXNoKGVsLmlubmVySFRNTCk7XG5cbiAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLnNlYXJjaEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBjcmVhdGVMaXN0KHNlbGYub3B0aW9ucy5pdGVtcyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYuaGVscGVyRmllbGQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGNyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgICAgICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcblxuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5pdGVtQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBzZWxmLm9wdGlvbnMuaXRlbUNhbGxiYWNrKGVsLCBzZWxmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVJdGVtQ2xpY2soZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHNlbGVjdFRhZyhlLnRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlSXRlbU1vdXNlT3ZlcihlKSB7XG4gICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGFnZmllbGREb2NDbGljayhlKSB7XG4gICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vRnVsdGVyIGZ1bmN0aW9uIGZvciBzZWFyY2ZpZWxkXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQoZSkge1xuICAgICAgICAgICAgdmFyIGZJdGVtcyA9IHNlbGYub3B0aW9ucy5pdGVtcy5maWx0ZXIoZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZS50YXJnZXQudmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNyZWF0ZUxpc3QoZkl0ZW1zLCBzZWxmLmFjdGl2ZUl0ZW0sIGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUuc2xpY2UoLTEpID09PSAnLCcgJiYgc2VsZi5vcHRpb25zLmNyZWF0ZVRhZ3MpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmluc2VydEJlZm9yZShzZWxmLl9jcmVhdGVUYWcoZS50YXJnZXQudmFsdWUuc2xpY2UoMCwgLTEpKSwgc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgICAgICBlLnRhcmdldC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIGUudGFyZ2V0LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgY3JlYXRlTGlzdChzZWxmLm9wdGlvbnMuaXRlbXMpO1xuICAgICAgICAgICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUtleURvd24oZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHZhciBpbmRleCwgbGVuZ3RoO1xuICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RUYWcoc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLnRhcmdldC52YWx1ZSAhPT0gJycgJiYgc2VsZi5vcHRpb25zLmNyZWF0ZVRhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5zZXJ0QmVmb3JlKHNlbGYuX2NyZWF0ZVRhZyhlLnRhcmdldC52YWx1ZSksIHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZS50YXJnZXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGUudGFyZ2V0LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVMaXN0KHNlbGYub3B0aW9ucy5pdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMjc6XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggLSAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCA8IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpIC0gJChzZWxmLmxpc3QpLmhlaWdodCgpID4gMCA/ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5oZWlnaHQoKSA8ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLm91dGVySGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9EZWxldGUgdGFnIGhhbmRsZVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVEZWxldGVUYWcoZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHZhciB0YWcgPSBlLnRhcmdldC5wYXJlbnROb2RlO1xuXG4gICAgICAgICAgICB0YWcucmVtb3ZlQ2hpbGQoZS50YXJnZXQpO1xuICAgICAgICAgICAgdmFyIHRhZ1RpdGxlID0gdGFnLmlubmVySFRNTCxcbiAgICAgICAgICAgICAgICB0YWdJbmRleCA9IHNlbGYuaXRlbXMuaW5kZXhPZih0YWdUaXRsZSk7XG4gICAgICAgICAgICBpZiAodGFnSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBbXS5jb25jYXQoc2VsZi5pdGVtcy5zbGljZSgwLCB0YWdJbmRleCksIHNlbGYuaXRlbXMuc2xpY2UodGFnSW5kZXggKyAxKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuZWwucmVtb3ZlQ2hpbGQodGFnKTtcblxuICAgICAgICAgICAgaWYgKHNlbGYuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFnZmllbGRfX3RhZycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgndGFnZmllbGRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWdmaWVsZF9zdGF0ZV9vcGVuJykpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBzZWxmLm9wdGlvbnMucGxhY2Vmb2xkZXIgfHwgJ1NlbGVjdCBmcm9tIHRoZSBsaXN0JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG5cblxuICAgICAgICB9XG5cbiAgICAgICAgLy9DaGVjayBpZiBmaWVsZCBpcyBlbXB0eSBvciBub3QgYW5kIGNoYW5nZSBjbGFzcyBhY2NvcmRpbmdseVxuICAgICAgICAkKHRoaXMudGFnZmllbGRXcmFwcGVyKS5vbignY2xpY2snLCAnLnRhZ2ZpZWxkX19maWVsZCcsIGhhbmRsZVRhZ2ZpZWxkQ2xpY2spO1xuICAgICAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG5cbiAgICB9O1xuXG4gICAgLy9BdXRvcmVzaXplIHRleHRhcmVhXG4gICAgVGFnZmllbGQucHJvdG90eXBlLl9hdXRvc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5lbC52YWx1ZSA9PT0gJycpIHt0aGlzLmVsLnJvd3MgPSAxO31cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgd2lkdGggPSB0aGlzLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLFxuICAgICAgICAgICAgICAgIHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyksXG4gICAgICAgICAgICAgICAgdGV4dFdpZHRoID0gdGhpcy5lbC52YWx1ZS5sZW5ndGggKiA3LFxuICAgICAgICAgICAgICAgIHJvdyA9IE1hdGguY2VpbCh0ZXh0V2lkdGggLyB3aWR0aCk7XG5cbiAgICAgICAgICAgIHJvdyA9IHJvdyA8PSAwID8gMSA6IHJvdztcbiAgICAgICAgICAgIHJvdyA9IHRoaXMub3B0aW9ucy5tYXhIZWlnaHQgJiYgcm93ID4gdGhpcy5vcHRpb25zLm1heEhlaWdodCA/IHRoaXMub3B0aW9ucy5tYXhIZWlnaHQgOiByb3c7XG5cbiAgICAgICAgICAgIHRoaXMuZWwucm93cyA9IHJvdztcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvL0NyZWF0ZSBUYWcgSGVscGVyXG4gICAgVGFnZmllbGQucHJvdG90eXBlLl9jcmVhdGVUYWcgPSBmdW5jdGlvbih0YWdOYW1lKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgZGVsVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgdGFnLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX190YWcnKTtcbiAgICAgICAgdGFnLmlubmVySFRNTCA9IHRhZ05hbWU7XG5cbiAgICAgICAgZGVsVGFnLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX190YWctZGVsZXRlJyk7XG4gICAgICAgIGRlbFRhZy5pbm5lckhUTUwgPSAn4pyVJztcbiAgICAgICAgZGVsVGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHNlbGYuX2RlbGV0ZVRhZyhlLnRhcmdldC5wYXJlbnROb2RlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGFnLmFwcGVuZENoaWxkKGRlbFRhZyk7XG5cbiAgICAgICAgcmV0dXJuIHRhZztcbiAgICB9O1xuXG4gICAgVGFnZmllbGQucHJvdG90eXBlLl9kZWxldGVUYWcgPSBmdW5jdGlvbih0YWcpIHtcbiAgICAgICAgdGhpcy5lbC5yZW1vdmVDaGlsZCh0YWcpO1xuXG4gICAgICAgICQodGFnKS5maW5kKCcudGFnZmllbGRfX3RhZy1kZWxldGUnKS5yZW1vdmUoKTtcbiAgICAgICAgdmFyIHRhZ1RpdGxlID0gdGFnLmlubmVySFRNTCxcbiAgICAgICAgICAgIHRhZ0luZGV4ID0gdGhpcy5pdGVtcy5pbmRleE9mKHRhZ1RpdGxlKTtcbiAgICAgICAgaWYgKHRhZ0luZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBbXS5jb25jYXQodGhpcy5pdGVtcy5zbGljZSgwLCB0YWdJbmRleCksIHRoaXMuaXRlbXMuc2xpY2UodGFnSW5kZXggKyAxKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWdmaWVsZF9fdGFnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWdmaWVsZF9zdGF0ZV9vcGVuJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHNlbGYub3B0aW9ucy5wbGFjZWZvbGRlciB8fCAnU2VsZWN0IGZyb20gdGhlIGxpc3QnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3RvZ2dsZUFkZGFibGUoKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlbGV0ZVRhZ0NhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGVsZXRlVGFnQ2FsbGJhY2sodGFnLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVGFnZmllbGQucHJvdG90eXBlLl90b2dnbGVBZGRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMuZWwpLmhhc0NsYXNzKCdqcy1oYXNWYWx1ZScpKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5hZGRDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5yZW1vdmVDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBUYWdmaWVsZC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgICAgICAkKHRoaXMuZWwpLmZpbmQoJy50YWdmaWVsZF9fdGFnJykucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgndGFnZmllbGRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgIHRoaXMuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaW5pdFRhZ2ZpZWxkcygpIHtcbiAgICAgICAgW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdGFnZmllbGQnKSkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbmV3IFRhZ2ZpZWxkKGVsLCB7XG4gICAgICAgICAgICAgICAgbGFiZWw6IGVsLmRhdGFzZXQubGFiZWwsXG4gICAgICAgICAgICAgICAgaGVscFRleHQ6IGVsLmRhdGFzZXQuaGVscFRleHQsXG4gICAgICAgICAgICAgICAgZXJyTXNnOiBlbC5kYXRhc2V0LmVyck1zZyxcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogZWwuZGF0YXNldC5wbGFjZWhvbGRlcixcbiAgICAgICAgICAgICAgICBpdGVtczogSlNPTi5wYXJzZShlbC5kYXRhc2V0Lml0ZW1zKSxcbiAgICAgICAgICAgICAgICBzZWFyY2g6IGVsLmRhdGFzZXQuc2VhcmNoLFxuICAgICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyOiBlbC5kYXRhc2V0LnNlYXJjaFBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgICAgIGNyZWF0ZVRhZ3M6IGVsLmRhdGFzZXQuY3JlYXRlTmV3VGFnLFxuICAgICAgICAgICAgICAgIGluaXRpYWxJdGVtczogZWwuZGF0YXNldC5zZWxlY3RlZEl0ZW1zID8gSlNPTi5wYXJzZShlbC5kYXRhc2V0LnNlbGVjdGVkSXRlbXMpIDogJydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0VGFnZmllbGRzKCk7XG5cblxuLy99KSh3aW5kb3cpO1xuXG4vL0Ryb3Bkb3duXG5mdW5jdGlvbiBEcm9wZG93bihlbCwgb3B0aW9ucykge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgdGhpcy5faW5pdCgpO1xuICAgIHRoaXMuX2luaXRFdmVudHMoKTtcbn1cblxuRHJvcGRvd24ucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5kcm9wZG93bldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmRyb3Bkb3duV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdqcy1kcm9wZG93bldyYXBwZXInKTtcbiAgICB0aGlzLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuZHJvcGRvd25XcmFwcGVyLCB0aGlzLmVsKTtcbiAgICB0aGlzLmRyb3Bkb3duV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2pzLWRyb3Bkb3duJyk7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdqcy1kcm9wZG93bkl0ZW0nKTtcbn07XG5cbkRyb3Bkb3duLnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vQ2xvc2UgbGlzdCBoZWxwZXJcbiAgICBmdW5jdGlvbiBjbG9zZUxpc3QoKSB7XG4gICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtb3BlbicpO1xuICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICBzZWxmLmRyb3Bkb3duV3JhcHBlci5yZW1vdmVDaGlsZChzZWxmLmxpc3QpO1xuICAgICAgICAgICAgc2VsZi5saXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZU91dHNpZGVDbGljayk7XG4gICAgfVxuICAgIC8vSGFuZGxlIG91dHNpZGUgZHJvcGRvd24gY2xpY2tcbiAgICBmdW5jdGlvbiBoYW5kbGVPdXRzaWRlQ2xpY2soZSkge1xuICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICB9XG5cbiAgICAvL0hhbmRsZSBkcm9wZG93biBjbGlja1xuICAgIGZ1bmN0aW9uIGhhbmRsZURyb3Bkb3duQ2xpY2soZSkge1xuXG4gICAgICAgIC8vZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKHNlbGYuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1vcGVuJykpIHtjbG9zZUxpc3QoKTt9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5pdGVtcykge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgnaXMtb3BlbicpO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QuY2xhc3NMaXN0LmFkZCgnYy1Ecm9wZG93bi1saXN0Jyk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLm9wdGlvbnMuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmRpdmlkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Ryb3Bkb3duX19kaXZpZGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkcm9wZG93bl9fbGlzdC1pdGVtJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5pbm5lckhUTUwgPSBpdGVtLmlubmVySFRNTCB8fCBpdGVtLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmNhbGxiYWNrKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmRpc2FibGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS53YXJuaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ud2FybmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hhcy13YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChpdGVtRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLmRyb3Bkb3duV3JhcHBlci5hcHBlbmRDaGlsZChzZWxmLmxpc3QpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGxpc3RSZWN0ID0gc2VsZi5saXN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RSZWN0LmxlZnQgKyBsaXN0UmVjdC53aWR0aCA+IHdpbmRvdy5pbm5lcldpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS5yaWdodCA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5saXN0LnN0eWxlLmxlZnQgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobGlzdFJlY3QudG9wICsgbGlzdFJlY3QuaGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS5ib3R0b20gPSAnMTAwJSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5saXN0LnN0eWxlLnRvcCA9ICcxMDAlJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVPdXRzaWRlQ2xpY2spO30sIDEwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxmLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlRHJvcGRvd25DbGljayk7XG59O1xuXG4vL0FkZGFibGUgRmllbGRzXG4vLzsoZnVuY3Rpb24od2luZG93KSB7XG4gICAgLy8ndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBBZGRhYmxlKGVsLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7c29ydGFibGU6IHRydWV9O1xuXG4gICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICB9XG5cbiAgICBBZGRhYmxlLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLWFkZGFibGVXcmFwcGVyJyk7XG4gICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuaW5zZXJ0QmVmb3JlKHNlbGYuZWwpO1xuXG4gICAgICAgIHNlbGYuZWwucmVtb3ZlQ2xhc3MoJ2pzLWFkZGFibGUnKTtcbiAgICAgICAgc2VsZi5lbC5hZGRDbGFzcygnanMtYWRkYWJsZUl0ZW0gYy1BZGRhYmxlLWl0ZW0nKTtcblxuICAgICAgICBzZWxmLmFkZGFibGVSb3cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdqcy1hZGRhYmxlUm93IGMtQWRkYWJsZS1yb3cnKTtcblxuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnNvcnRhYmxlKSB7XG4gICAgICAgICAgICBzZWxmLmFkZGFibGVSb3dEcmFnSGFuZGxlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2MtQWRkYWJsZS1yb3ctZHJhZ0hhbmRsZXInKTtcbiAgICAgICAgICAgIHNlbGYuYWRkYWJsZVJvdy5hcHBlbmQoc2VsZi5hZGRhYmxlUm93RHJhZ0hhbmRsZXIpO1xuXG4gICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLnNvcnRhYmxlKHtcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogc2VsZi5vcHRpb25zID8gc2VsZi5vcHRpb25zLnBsYWNlaG9sZGVyIHx8ICdjLUFkZGFibGUtcm93UGxhY2Vob2xkZXInIDogJ2MtQWRkYWJsZS1yb3dQbGFjZWhvbGRlcicsXG4gICAgICAgICAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGUsIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVpLml0ZW0uYWRkQ2xhc3MoJ2lzLWRyYWdnaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICQoZS50YXJnZXQpLmNzcygnaGVpZ2h0JywgJChlLnRhcmdldCkuaGVpZ2h0KCkpO1xuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuY3NzKCdoZWlnaHQnLCAkKCdib2R5JykuaGVpZ2h0KCkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RvcDogZnVuY3Rpb24oZSwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgdWkuaXRlbS5yZW1vdmVDbGFzcygnaXMtZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgJChlLnRhcmdldCkuY3NzKCdoZWlnaHQnLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5jc3MoJ2hlaWdodCcsICcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuYWRkQnV0dG9uID0gJCgnPGJ1dHRvbj48L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uLS1yb3VuZCBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5IGJ1dHRvbi0tYWRkIGMtQWRkYWJsZS1yb3ctYWRkQnV0dG9uJykuY2xpY2soaGFuZGxlQWRkUm93KTtcblxuICAgICAgICBzZWxmLnJlbW92ZUJ1dHRvbiA9ICQoJzxidXR0b24+PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbi0tcm91bmQgYnV0dG9uX3N0eWxlX291dGxpbmUtZ3JheSBidXR0b24tLXJlbW92ZSBqcy1hZGRhYmxlUmVtb3ZlQnV0dG9uJykuY2xpY2soaGFuZGxlUmVtb3ZlUm93KTtcblxuICAgICAgICBzZWxmLmFkZGFibGVSb3cuYXBwZW5kKHNlbGYuZWwuY2xvbmUodHJ1ZSwgdHJ1ZSksIHRoaXMucmVtb3ZlQnV0dG9uLCB0aGlzLmFkZEJ1dHRvbik7XG4gICAgICAgIHNlbGYub3JpZ2luYWxFbCA9IHNlbGYuZWwuY2xvbmUodHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIHNlbGYuZWwuZGV0YWNoKCk7XG5cbiAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5hcHBlbmQodGhpcy5hZGRhYmxlUm93LmNsb25lKHRydWUsIHRydWUpKTtcblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVBZGRSb3coZSkge1xuICAgICAgICAgICAgLy9DaGVjayBpZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDEgY2hpbGQgYW5kIGNoYW5nZSBjbGFzc1xuICAgICAgICAgICAgaWYgKHNlbGYuYWRkYWJsZVdyYXBwZXIuY2hpbGRyZW4oKS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5hZGRDbGFzcygnaGFzLW11bHRpcGxlUm93cycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLnJlbW92ZUNsYXNzKCdoYXMtbXVsdGlwbGVSb3dzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL3NlbGYuYWRkYWJsZVdyYXBwZXIuYXBwZW5kKHNlbGYuYWRkYWJsZVJvdy5jbG9uZSh0cnVlLCB0cnVlKSk7XG4gICAgICAgICAgICB2YXIgd3JhcHBlciA9IHNlbGYuX2FkZEl0ZW0oc2VsZi5vcmlnaW5hbEVsLmNsb25lKHRydWUsIHRydWUpLCBzZWxmLm9wdGlvbnM/IHNlbGYub3B0aW9ucy5iZWZvcmVBZGQgOiBudWxsKTtcblxuICAgICAgICAgICAgLy9Jbml0aWFsaXNlIFJlYWN0IGNvbXBvbmVudHMgb24gdGhlIG5ldyByb3csIGlmIHRoZXJlIGFyZSBhbnlcbiAgICAgICAgICAgIHdpbmRvdy5tb3VudENvbXBvbmVudHMod3JhcHBlclswXSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlUmVtb3ZlUm93KGUpIHtcbiAgICAgICAgXHQkKGUudGFyZ2V0KS5wYXJlbnRzKCcuanMtYWRkYWJsZVJvdycpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHNlbGYuYWRkYWJsZVdyYXBwZXIuY2hpbGRyZW4oJy5qcy1hZGRhYmxlUm93JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBzZWxmLl9hZGRJdGVtKHNlbGYub3JpZ2luYWxFbC5jbG9uZSh0cnVlLCB0cnVlKSwgc2VsZi5vcHRpb25zPyBzZWxmLm9wdGlvbnMuYmVmb3JlQWRkIDogbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLnJlbW92ZUNsYXNzKCdoYXMtbXVsdGlwbGVSb3dzJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLl9hZGRJdGVtID0gZnVuY3Rpb24oZWwsIGJlZm9yZUFkZCkge1xuICAgICAgICAgICAgaWYgKGJlZm9yZUFkZCkge1xuICAgICAgICAgICAgICAgIGJlZm9yZUFkZChlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYWRkYWJsZVJvdyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLWFkZGFibGVSb3cgYy1BZGRhYmxlLXJvdycpLFxuICAgICAgICAgICAgICAgIGFkZEJ1dHRvbiA9ICQoJzxidXR0b24+PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbi0tcm91bmQgYnV0dG9uX3N0eWxlX291dGxpbmUtZ3JheSBidXR0b24tLWFkZCBjLUFkZGFibGUtcm93LWFkZEJ1dHRvbicpLmNsaWNrKGhhbmRsZUFkZFJvdyksXG4gICAgICAgICAgICAgICAgcmVtb3ZlQnV0dG9uID0gJCgnPGJ1dHRvbj48L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uLS1yb3VuZCBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5IGJ1dHRvbi0tcmVtb3ZlIGpzLWFkZGFibGVSZW1vdmVCdXR0b24nKS5jbGljayhoYW5kbGVSZW1vdmVSb3cpO1xuXG4gICAgICAgICAgICBlbC5hZGRDbGFzcygnanMtYWRkYWJsZUl0ZW0gYy1BZGRhYmxlLWl0ZW0nKTtcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuc29ydGFibGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgYWRkYWJsZVJvd0RyYWdIYW5kbGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnYy1BZGRhYmxlLXJvdy1kcmFnSGFuZGxlcicpO1xuICAgICAgICAgICAgICAgIGFkZGFibGVSb3cuYXBwZW5kKGFkZGFibGVSb3dEcmFnSGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRhYmxlUm93LmFwcGVuZChlbCwgcmVtb3ZlQnV0dG9uLCBhZGRCdXR0b24pO1xuICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5hcHBlbmQoYWRkYWJsZVJvdyk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLmFkZGFibGVXcmFwcGVyLmNoaWxkcmVuKCkubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuYWRkQ2xhc3MoJ2hhcy1tdWx0aXBsZVJvd3MnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5yZW1vdmVDbGFzcygnaGFzLW11bHRpcGxlUm93cycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5hZnRlckFkZCkge1xuICAgICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5hZnRlckFkZChlbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vQXV0byBzY3JvbGwgcGFnZSB3aGVuIGFkZGluZyByb3cgYmVsb3cgc2NyZWVuIGJvdHRvbSBlZGdlXG4gICAgICAgICAgICB2YXIgcm93Qm90dG9tRW5kID0gYWRkYWJsZVJvdy5nZXQoMCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgYWRkYWJsZVJvdy5oZWlnaHQoKTtcbiAgICAgICAgICAgIGlmIChyb3dCb3R0b21FbmQgKyA2MCA+ICQod2luZG93KS5oZWlnaHQoKSkge1xuICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hbmltYXRlKCB7IHNjcm9sbFRvcDogJys9JyArIE1hdGgucm91bmQocm93Qm90dG9tRW5kICsgNjAgLSAkKHdpbmRvdykuaGVpZ2h0KCkpLnRvU3RyaW5nKCkgfSwgNDAwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuYWRkYWJsZVdyYXBwZXI7XG4gICAgICAgIH07XG4gICAgICAgIHNlbGYucmVtb3ZlSXRlbSA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLmNoaWxkcmVuKCkuc2xpY2UoaW5kZXgsIGluZGV4KzEpLnJlbW92ZSgpO1xuICAgICAgICAgICAgaWYgKHNlbGYuYWRkYWJsZVdyYXBwZXIuY2hpbGRyZW4oJy5qcy1hZGRhYmxlUm93JykubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgXHRcdHNlbGYuYWRkYWJsZVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ2hhcy1tdWx0aXBsZVJvd3MnKTtcbiAgICAgICAgXHR9XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRBZGRhYmxlRmllbGRzKCkge1xuICAgICAgICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1hZGRhYmxlJykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIG5ldyBBZGRhYmxlKCQoZWwpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbi8vfSkod2luZG93KTtcblxuLy9JbWFnZSBQbGFjZWhvbGRlcnNcbi8vVGhpcyBjbGFzcyBjcmVhdGVzIGEgcGFsY2Vob2xkZXIgZm9yIGltYWdlIGZpbGVzLiBJdCBoYW5kbGUgYm90aCBjbGljayB0byBsb2FkIGFuZCBhbHNvIHNlbGVjdCBmcm9tIGFzc2V0IGxpYnJhcnkgYWN0aW9uLlxuXG5mdW5jdGlvbiBJbWFnZVBsYWNlaG9sZGVyKGVsLCBmaWxlLCBvcHRpb25zKSB7XG4gIHRoaXMuZWwgPSBlbDtcbiAgdGhpcy5maWxlID0gZmlsZTtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB0aGlzLl9pbml0KCk7XG4gIHRoaXMuX2luaXRFdmVudHMoKTtcbn1cblxuSW1hZ2VQbGFjZWhvbGRlci5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5vcHRpb25zLm5hbWUgPSB0aGlzLm9wdGlvbnMubmFtZSB8fCB0aGlzLmVsLmRhdGFzZXQubmFtZTtcbiAgdGhpcy5vcHRpb25zLmlkID0gdGhpcy5lbC5pZCArICctcGxhY2Vob2xkZXInO1xuXG4gIC8vV3JhcHAgcGxhY2Vob2xkZXJcbiAgdGhpcy53cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRoaXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjLUltYWdlUGxhY2Vob2xkZXInKTtcbiAgaWYgKCF0aGlzLmZpbGUpIHt0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaXMtZW1wdHknKTt9XG4gIHRoaXMud3JhcHBlci5pZCA9IHRoaXMub3B0aW9ucy5pZDtcblxuICAvL1BsYWNlaG9sZGVyIEltYWdlXG4gIHRoaXMuaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy5pbWFnZS5jbGFzc0xpc3QuYWRkKCdjLUltYWdlUGxhY2Vob2xkZXItaW1nJyk7XG4gIGlmICh0aGlzLmZpbGUpIHt0aGlzLmltYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IHRoaXMuZmlsZS5maWxlRGF0YS51cmw7fVxuICB0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5pbWFnZSk7XG5cbiAgLy9QbGFjZWhvbGRlciBjb250cm9sc1xuICB0aGlzLmNvbnRyb2xzID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzJykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzVXBsb2FkID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbicpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc1VwbG9hZEljb24gPSAkKCc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbi1pY29uJykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzVXBsb2FkVGV4dCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1idXR0b24tdGV4dCcpLnRleHQoJ1VwbG9hZCBmcm9tIHlvdXIgY29tcHV0ZXInKS5nZXQoMCk7XG4gIHRoaXMuY29udHJvbHNVcGxvYWQuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc1VwbG9hZEljb24pO1xuICB0aGlzLmNvbnRyb2xzVXBsb2FkLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNVcGxvYWRUZXh0KTtcblxuICB0aGlzLmNvbnRyb2xzRGl2aWRlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1kaXZpZGVyJykuZ2V0KDApO1xuXG4gIHRoaXMuY29udHJvbHNMaWJyYXJ5ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbicpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc0xpYnJhcnlJY29uID0gJCgnPGkgY2xhc3M9XCJmYSBmYS1mb2xkZXItb3BlblwiPjwvaT4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbi1pY29uJykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzTGlicmFyeVRleHQgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMtYnV0dG9uLXRleHQnKS50ZXh0KCdBZGQgZnJvbSBhc3NldCBsaWJyYXJ5JykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzTGlicmFyeS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzTGlicmFyeUljb24pO1xuICB0aGlzLmNvbnRyb2xzTGlicmFyeS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzTGlicmFyeVRleHQpO1xuXG4gIHRoaXMuY29udHJvbHMuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc1VwbG9hZCk7XG4gIHRoaXMuY29udHJvbHMuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc0RpdmlkZXIpO1xuICB0aGlzLmNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNMaWJyYXJ5KTtcbiAgdGhpcy5pbWFnZS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzKTtcblxuICAvL0NsZWFyIGJ1dHRvblxuICB0aGlzLmRlbGV0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLmRlbGV0ZS5jbGFzc0xpc3QuYWRkKCdjLUltYWdlUGxhY2Vob2xkZXItZGVsZXRlJyk7XG4gIHRoaXMuaW1hZ2UuYXBwZW5kQ2hpbGQodGhpcy5kZWxldGUpO1xuXG4gIC8vRWRpdCBidXR0b25cbiAgdGhpcy5lZGl0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIHRoaXMuZWRpdC5jbGFzc0xpc3QuYWRkKCdidXR0b24nLCAnYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnLCAnYy1JbWFnZVBsYWNlaG9sZGVyLWVkaXQnKTtcbiAgdGhpcy5lZGl0LmlubmVySFRNTCA9ICdFZGl0JztcbiAgdGhpcy5pbWFnZS5hcHBlbmRDaGlsZCh0aGlzLmVkaXQpO1xuXG4gIC8vRmlsZSBuYW1lXG4gIHRoaXMuZmlsZU5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy5maWxlTmFtZS5jbGFzc0xpc3QuYWRkKCdjLUltYWdlUGxhY2Vob2xkZXItZmlsZU5hbWUnKTtcbiAgdGhpcy5maWxlTmFtZS5pbm5lckhUTUwgPSB0aGlzLmZpbGUgPyB0aGlzLmZpbGUuZmlsZURhdGEudGl0bGUgOiAnJztcbiAgdGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZmlsZU5hbWUpO1xuXG4gIC8vUGxhY2Vob2xkZXIgVGl0bGVcbiAgaWYgKHRoaXMub3B0aW9ucy5uYW1lKSB7XG4gICAgdGhpcy50aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMudGl0bGUuY2xhc3NMaXN0LmFkZCgnYy1JbWFnZVBsYWNlaG9sZGVyLXRpdGxlJyk7XG4gICAgdGhpcy50aXRsZS5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMubmFtZTtcbiAgICB0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy50aXRsZSk7XG4gIH1cblxuICAvL0ZpbGVpbnB1dCB0byBoYW5kbGUgY2xpY2sgdG8gdXBsb2FkIGltYWdlXG4gIHRoaXMuZmlsZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICB0aGlzLmZpbGVJbnB1dC50eXBlID0gXCJmaWxlXCI7XG4gIHRoaXMuZmlsZUlucHV0Lm11bHRpcGxlID0gZmFsc2U7XG4gIHRoaXMuZmlsZUlucHV0LmhpZGRlbiA9IHRydWU7XG4gIHRoaXMuZmlsZUlucHV0LmFjY2VwdCA9IFwiaW1hZ2UvKiwgdmlkZW8vKlwiO1xuXG4gIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmZpbGVJbnB1dCk7XG5cbiAgdGhpcy5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLndyYXBwZXIsIHRoaXMuZWwpO1xuICB0aGlzLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5lbCk7XG5cbn07XG5cbnZhciBzY3JvbGxQb3NpdGlvbiwgc2luZ2xlc2VsZWN0O1xuXG5JbWFnZVBsYWNlaG9sZGVyLnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgZnVuY3Rpb24gY2xlYXIoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgc2VsZi5maWxlID0gdW5kZWZpbmVkO1xuICAgIHNlbGYuX3VwZGF0ZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gb3BlbkxpYnJhcnkoKSB7XG4gICAgc2Nyb2xsUG9zaXRpb24gPSAkKCdib2R5Jykuc2Nyb2xsVG9wKCk7XG4gICAgdXBkYXRlQXNzZXRMaWJyYXJ5KCk7XG4gICAgJCgnI2FsJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICQoJyNhbCcpLmFkZENsYXNzKCdtb2RhbCcpO1xuICAgICQoJyN3cmFwcGVyJykuYWRkQ2xhc3MoJ292ZXJmbG93Jyk7XG4gICAgc2luZ2xlc2VsZWN0ID0gdHJ1ZTtcblxuICAgICQoJyNhZGRGcm9tQUxCdXR0b24nKS50ZXh0KHNlbGYub3B0aW9ucy5hbEJ1dHRvbiB8fCAnU2V0IENvdmVyJyk7XG5cbiAgICAkKCcjYWRkRnJvbUFMQnV0dG9uJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgIGxhc3RTZWxlY3RlZCA9IG51bGw7XG4gICAgICBzZXRTZWxlY3RlZEZpbGUoKTtcbiAgICAgIGNsb3NlQXNzZXRMaWJyYXJ5KCk7XG4gICAgICBzaW5nbGVzZWxlY3QgPSBmYWxzZTtcbiAgICAgICQoJ2JvZHknKS5zY3JvbGxUb3Aoc2Nyb2xsUG9zaXRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2VBc3NldExpYnJhcnkoKSB7XG4gICAgbGFzdFNlbGVjdGVkID0gbnVsbDtcbiAgICAkKCcuYWwgLmZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZS5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgIGRlc2VsZWN0QWxsKCk7XG4gICAgJCgnLm1vZGFsJykuYWRkQ2xhc3MoJ2hpZGRlbicpLnJlbW92ZUNsYXNzKCdtb2RhbCcpO1xuICAgICQoJyN3cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ292ZXJmbG93Jyk7XG4gICAgJCgnI2FkZEZyb21BTEJ1dHRvbicpLnVuYmluZCgnY2xpY2snKTtcbiAgICAkKCdib2R5Jykuc2Nyb2xsVG9wKHNjcm9sbFBvc2l0aW9uKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRTZWxlY3RlZEZpbGUoKSB7XG4gICAgdmFyIHNlbGVjdGVkRmlsZSA9ICQoJy5hbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlLnNlbGVjdGVkJyksXG4gICAgZmlsZUlkID0gJChzZWxlY3RlZEZpbGUpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKSxcbiAgICBmaWxlID0gYXNzZXRMaWJyYXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuICAgICAgcmV0dXJuIGYuaWQgPT09IGZpbGVJZDtcbiAgICB9KVswXTtcblxuICAgIHNlbGYuZmlsZSA9IHtcbiAgICAgIGZpbGVEYXRhOiBmaWxlXG4gICAgfTtcbiAgICBzZWxmLl91cGRhdGUoKTtcbiAgfVxuXG5cbiAgc2VsZi5maWxlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuICAgIGZpbGVUb09iamVjdChlLnRhcmdldC5maWxlc1swXSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgIHNlbGYuZmlsZSA9IHtcbiAgICAgICAgZmlsZURhdGE6IHJlcyxcbiAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICBwb3NpdGlvbjogMTAwMCxcbiAgICAgICAgY2FwdGlvbjogJycsXG4gICAgICAgIGdhbGxlcnlDYXB0aW9uOiBmYWxzZSxcbiAgICAgICAganVzdFVwbG9hZGVkOiB0cnVlXG4gICAgICB9O1xuICAgICAgc2VsZi5fdXBkYXRlKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHNlbGYuY29udHJvbHNVcGxvYWQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKCFzZWxmLmZpbGUpIHtcbiAgICAgIHNlbGYuZmlsZUlucHV0LmNsaWNrKCk7XG4gICAgfVxuICB9KTtcbiAgc2VsZi5kZWxldGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGVhcik7XG4gIHNlbGYuZWRpdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBlZGl0RmlsZXMoW3NlbGYuZmlsZV0pO1xuICB9KTtcblxuICBzZWxmLmNvbnRyb2xzTGlicmFyeS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9wZW5MaWJyYXJ5KTtcbn07XG5JbWFnZVBsYWNlaG9sZGVyLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmZpbGUpIHtcbiAgICB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnaXMtZW1wdHknKTtcbiAgICB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZCgnanMtaGFzVmFsdWUnKTtcbiAgICB0aGlzLmltYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoJyArIHRoaXMuZmlsZS5maWxlRGF0YS51cmwgKyAnKSc7XG4gICAgdGhpcy5maWxlTmFtZS5pbm5lckhUTUwgPSB0aGlzLmZpbGUuZmlsZURhdGEudGl0bGU7XG4gICAgdGhpcy50eXBlID0gdGhpcy5maWxlLmZpbGVEYXRhLnR5cGU7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhpcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2lzLWVtcHR5Jyk7XG4gICAgdGhpcy53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgdGhpcy5pbWFnZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAnbm9uZSc7XG4gICAgdGhpcy5maWxlTmFtZS5pbm5lckhUTUwgPSAnJztcbiAgICB0aGlzLnR5cGUgPSB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHRoaXMub3B0aW9ucy5vblVwZGF0ZSkge1xuICAgIHRoaXMub3B0aW9ucy5vblVwZGF0ZSh0aGlzKTtcbiAgfVxufTtcblxuSW1hZ2VQbGFjZWhvbGRlci5wcm90b3R5cGUuc2V0SW1hZ2UgPSBmdW5jdGlvbihmaWxlKSB7XG4gIHRoaXMuZmlsZSA9IGZpbGU7XG4gIHRoaXMuX3VwZGF0ZSgpO1xufTtcblxuZnVuY3Rpb24gaW5pdEltYWdlUGxhY2Vob2xkZXJzKCkge1xuICB2YXIgaW1hZ2VQbGFjZWhvbGRlcnMgPSBbXTtcbiAgW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtaW1hZ2VQbGFjZWhvbGRlcicpKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgaW1hZ2VQbGFjZWhvbGRlcnMucHVzaChuZXcgSW1hZ2VQbGFjZWhvbGRlcihlbCkpO1xuICB9KTtcbiAgcmV0dXJuIGltYWdlUGxhY2Vob2xkZXJzO1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBJbWFnZVBsYWNlaG9sZGVyO1xufVxuXG4vL0NvbXBsZXhTZWxlY3Rcbi8vOyhmdW5jdGlvbih3aW5kb3cpIHtcbiAgICAvLyd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIENvbXBsZXhTZWxlY3Rib3goZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgICAgICB0aGlzLl9pbml0RXZlbnRzKCk7XG4gICAgfVxuXG4gICAgQ29tcGxleFNlbGVjdGJveC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jdXN0b21WYWx1ZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuYWN0aXZlSXRlbSA9IHRoaXMub3B0aW9ucy5pdGVtcy5pbmRleE9mKHRoaXMub3B0aW9ucy5zZWxlY3RlZEl0ZW0pO1xuICAgICAgICB0aGlzLm9wdGlvbnMudW5zZWxlY3QgPSB0aGlzLm9wdGlvbnMudW5zZWxlY3QgPT09IHRydWUgPyAn4oCUIE5vbmUg4oCUJyA6IHRoaXMub3B0aW9ucy51bnNlbGVjdDtcblxuICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdF9fd3JhcHBlcicpO1xuICAgICAgICB0aGlzLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuc2VsZWN0V3JhcHBlciwgdGhpcy5lbCk7XG4gICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdqcy1zZWxlY3Rib3gnKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2ZpZWxkJywgJ3NlbGVjdGJveF9fZmllbGQtLWNvbXBsZXgnKTtcblxuXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUl0ZW0gPj0gMCkge1xuICAgICAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5pdGVtc1t0aGlzLmFjdGl2ZUl0ZW1dO1xuICAgICAgICAgICAgdGhpcy5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYWJlbCkge1xuICAgICAgICAgICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5sYWJlbDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19sYWJlbCcpO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5mb3IgPSB0aGlzLmVsLmlkO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGVscFRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmhlbHBUZXh0O1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2hlbHAtdGV4dCcpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuaGVscFRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXJyTXNnKSB7XG4gICAgICAgICAgICB0aGlzLmVyck1zZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmVyck1zZztcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fZXJyLW1zZycpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZXJyTXNnKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBDb21wbGV4U2VsZWN0Ym94LnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy9DbG9zZSBsaXN0IGhlbHBlclxuICAgICAgICBmdW5jdGlvbiBjbG9zZUxpc3QoKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXRWYWx1ZTtcbiAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0Ym94X3N0YXRlX29wZW4nKTtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdFdyYXBwZXIucmVtb3ZlQ2hpbGQoc2VsZi5saXN0KTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWFyY2hGaWVsZCAmJiBzZWxmLnNlYXJjaEZpZWxkLnBhcmVudE5vZGUgPT09IHNlbGYuZWwpIHtcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlID0gc2VsZi5zZWFyY2hGaWVsZC52YWx1ZTtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLnJlbW92ZUNoaWxkKHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuaW5wdXRGaWVsZCAmJiBzZWxmLmlucHV0RmllbGQucGFyZW50Tm9kZSA9PT0gc2VsZi5lbCkge1xuICAgICAgICAgICAgICAgIGlucHV0VmFsdWUgPSBzZWxmLmlucHV0RmllbGQudmFsdWU7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5yZW1vdmVDaGlsZChzZWxmLmlucHV0RmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuYWN0aXZlSXRlbSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBzZWxmLm9wdGlvbnMuaXRlbXNbc2VsZi5hY3RpdmVJdGVtXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNlbGYub3B0aW9ucy5hbGxvd0N1c3RvbSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gc2VsZi5jdXN0b21WYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVTZWxlY3REb2NDbGljayk7XG4gICAgICAgIH1cblxuICAgICAgICAvL0NyZWF0ZSBsaXN0IGhlbHBlclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVMaXN0KGl0ZW1zLCBhY3RpdmVJdGVtLCBzZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2VsZi5saXN0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICAgIHNlbGYubGlzdC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2xpc3QnKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdEl0ZW0oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbUNsYXNzID0gc2VsZi5vcHRpb25zLmNvbXBsZXhJdGVtcyA/ICdzZWxlY3Rib3hfX2xpc3QtaXRlbSBzZWxlY3Rib3hfX2xpc3QtaXRlbS0tY29tcGxleCcgOiAnc2VsZWN0Ym94X19saXN0LWl0ZW0gc2VsZWN0Ym94X19saXN0LWl0ZW0tLXRleHQnLFxuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudCA9ICQoJzxsaT48L2xpPicpLmFkZENsYXNzKGl0ZW1DbGFzcykudGV4dChpdGVtKSxcbiAgICAgICAgICAgICAgICAgICAgbGlzdEhlbHBlciA9ICQoJzxkaXY+PC9kaXY+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWl0ZW0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygncG9zaXRpb24nLCAnYWJzb2x1dGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnei1pbmRleCcsICctMScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnb3ZlcmZsb3cnLCAndmlzaWJsZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCd3aGl0ZS1zcGFjZScsICdub3dyYXAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQoaXRlbSk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQobGlzdEhlbHBlci5nZXQoMCkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuYXR0cignZGF0YS1pbmRleCcsIGluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmNvbXBsZXhJdGVtcykge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5nZXQoMCkuaW5uZXJIVE1MID0gaXRlbTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VhcmNoVGV4dCAmJiAhc2VsZi5vcHRpb25zLmNvbXBsZXhJdGVtcykge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5nZXQoMCkuaW5uZXJIVE1MID0gbGlzdEl0ZW1UZXh0KGl0ZW0sIHNlYXJjaFRleHQsICQoc2VsZi5saXN0KS53aWR0aCgpIDwgbGlzdEhlbHBlci53aWR0aCgpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5vbignbW91c2Vkb3duJywgaGFuZGxlSXRlbUNsaWNrKTtcbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5vbignbW91c2VvdmVyJywgaGFuZGxlSXRlbU1vdXNlT3Zlcik7XG5cbiAgICAgICAgICAgICAgICBsaXN0SGVscGVyLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtRWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RJdGVtVGV4dChpdGVtU3RyaW5nLCB0ZXh0LCBsb25nKSB7XG4gICAgICAgICAgICAgICAgdmFyIG91dHB1dFN0cmluZyA9IGl0ZW1TdHJpbmc7XG4gICAgICAgICAgICAgICAgaWYgKGxvbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdvcmRzID0gaXRlbVN0cmluZy5zcGxpdCgnICcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoSW5kZXggPSB3b3Jkcy5yZWR1Y2UoZnVuY3Rpb24oY3VycmVudEluZGV4LCB3b3JkLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN0cmluZyA9IHdvcmQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQpID4gLTEgJiYgY3VycmVudEluZGV4ID09PSAtMSA/IGluZGV4IDogY3VycmVudEluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgLTEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWFyY2hJbmRleCA+PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RyaW5nRW5kID0gd29yZHMuc2xpY2Uoc2VhcmNoSW5kZXgpLnJlZHVjZShmdW5jdGlvbihzdHIsIHdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyICsgJyAnICsgd29yZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlZyA9IC9cXC4kLztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3Jkc1swXS5tYXRjaChyZWcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3RyaW5nID0gd29yZHNbMF0gKyAnICcgKyB3b3Jkc1sxXSArICcgLi4uICcgKyBzdHJpbmdFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN0cmluZyA9IHdvcmRzWzBdICsgJyAuLi4gJyArIHN0cmluZ0VuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBzdGFydFRleHRJbmRleCA9IG91dHB1dFN0cmluZy50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGV4dC50b0xvd2VyQ2FzZSgpKSxcbiAgICAgICAgICAgICAgICAgICAgZW5kVGV4dEluZGV4ID0gc3RhcnRUZXh0SW5kZXggKyB0ZXh0Lmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBvdXRwdXRTdHJpbmcuc2xpY2UoMCwgc3RhcnRUZXh0SW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICBtaWRkbGUgPSBvdXRwdXRTdHJpbmcuc2xpY2Uoc3RhcnRUZXh0SW5kZXgsIGVuZFRleHRJbmRleCksXG4gICAgICAgICAgICAgICAgICAgIGVuZCA9IG91dHB1dFN0cmluZy5zbGljZShlbmRUZXh0SW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHN0YXJ0KSk7XG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZCgkKCc8c3Bhbj48L3NwYW4+JykuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1oaWdobGlnaHQnKS50ZXh0KG1pZGRsZSkuZ2V0KDApKTtcbiAgICAgICAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGVuZCkpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaW5uZXJIVE1MO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBkaXZpZGVyKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkKCc8bGk+PC9saT4nKS5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWRpdmlkZXInKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKHNlbGYubGlzdCk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMudW5zZWxlY3QgJiYgIXNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3SXRlbSA9IGxpc3RJdGVtKHNlbGYub3B0aW9ucy51bnNlbGVjdCkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCBzZWxlY3Rib3hfX2xpc3QtdW5zZWxlY3QnKTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QuYXBwZW5kQ2hpbGQobmV3SXRlbS5nZXQoMCkpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChkaXZpZGVyKCkuZ2V0KDApKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0l0ZW0gPSBsaXN0SXRlbShpdGVtLCBzZWxmLm9wdGlvbnMuaXRlbXMuaW5kZXhPZihpdGVtKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCAmJiBzZWxmLmxpc3QuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0l0ZW0uYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlSXRlbSA9PT0gaSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdJdGVtLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QuYXBwZW5kQ2hpbGQobmV3SXRlbS5nZXQoMCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBmaWVsZFJlY3QgPSBzZWxmLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgICAgIGZpZWxkT2Zmc2V0VG9wID0gc2VsZi5lbC5vZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIG1lbnVSZWN0ID0gc2VsZi5saXN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuXG4gICAgICAgICAgICAgICAgaGVpZ2h0Q2hlY2sgPSB3aW5kb3dIZWlnaHQgLSBmaWVsZFJlY3QudG9wIC0gZmllbGRSZWN0LmhlaWdodCAtIG1lbnVSZWN0LmhlaWdodDtcblxuICAgICAgICAgICAgc2VsZi5saXN0LnN0eWxlLnRvcCA9IGhlaWdodENoZWNrID4gMCA/IGZpZWxkT2Zmc2V0VG9wICsgZmllbGRSZWN0LmhlaWdodCArIDUgKyAncHgnIDogZmllbGRPZmZzZXRUb3AgLSBtZW51UmVjdC5oZWlnaHQgLSAxMCArICdweCc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RJdGVtKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMudW5zZWxlY3QgJiYgaXRlbS5pbm5lckhUTUwgPT09IHNlbGYub3B0aW9ucy51bnNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGYuYWN0aXZlSXRlbSA9IC0xO1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0Ym94X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hY3RpdmVJdGVtID0gaXRlbS5kYXRhc2V0LmluZGV4O1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLml0ZW1DYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pdGVtQ2FsbGJhY2soaXRlbSwgc2VsZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1NlbGVjdCBjbGlja1xuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTZWxlY3RDbGljayhlKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLmFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIHRoZXJlIGlzIGFueSBzZWxlY3RlZCBpdGVtLiBJZiBub3Qgc2V0IHRoZSBwbGFjZWhvbGRlciB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW0gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IHNlbGYucGxhY2Vob2xkZXIgfHwgJ1NlbGVjdCc7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIHNlYXJjaCBvcHRpb24gaXMgb24gb3IgdGhlcmUgaXMgbW9yZSB0aGFuIDEwIGl0ZW1zLiBJZiB5ZXMsIGFkZCBzZWFyY2ZpZWxkXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuc2VhcmNoIHx8IHNlbGYub3B0aW9ucy5pdGVtcy5sZW5ndGggPiA3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbGYuc2VhcmNoRmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX3NlYXJjaGZpZWxkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5wbGFjZWhvbGRlciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBoYW5kbGVTZWFyY2hGaWVsZElucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5VXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLnNlYXJjaEZpZWxkKTsyXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW0gPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGFjdGl2ZSBpdGVtXCIsIHNlbGYub3B0aW9ucy5pdGVtc1tzZWxmLmFjdGl2ZUl0ZW1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnZhbHVlID0gc2VsZi5vcHRpb25zLml0ZW1zW3NlbGYuYWN0aXZlSXRlbV0ubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzZWxmLm9wdGlvbnMuYWxsb3dDdXN0b20pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnZhbHVlID0gc2VsZi5jdXN0b21WYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC50eXBlID0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUtleVVwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5pbnB1dEZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X3N0YXRlX29wZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jcmVhdGVMaXN0KHNlbGYub3B0aW9ucy5pdGVtcywgc2VsZi5hY3RpdmVJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVTZWxlY3REb2NDbGljayk7fSwgMTAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9TZWxlY3QgaXRlbSBoYW5kbGVyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUl0ZW1DbGljayhlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgc2VsZWN0SXRlbShlLnRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlSXRlbU1vdXNlT3ZlcihlKSB7XG4gICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2VsZWN0RG9jQ2xpY2soKSB7XG4gICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vRnVsdGVyIGZ1bmN0aW9uIGZvciBzZWFyY2ZpZWxkXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQoZSkge1xuICAgICAgICAgICAgdmFyIGZJdGVtcyA9IHNlbGYub3B0aW9ucy5pdGVtcy5maWx0ZXIoZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZS50YXJnZXQudmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNyZWF0ZUxpc3QoZkl0ZW1zLCBzZWxmLmFjdGl2ZUl0ZW0sIGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlS2V5VXAoZSkge1xuICAgICAgICAgICAgLy8gUmVjb3JkcyB0aGUgY3VzdG9tIHZhbHVlXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgc2VsZi5jdXN0b21WYWx1ZSA9IHNlbGYuc2VhcmNoRmllbGQudmFsdWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLmN1c3RvbVZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUtleURvd24oZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHZhciBpbmRleCwgbGVuZ3RoO1xuICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RJdGVtKHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMjc6XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggLSAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wIDwgNTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA+IDAgPyAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPCAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLm91dGVySGVpZ2h0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCkucG9zaXRpb24oKS50b3AgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCkuaGVpZ2h0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vQ2hlY2sgaWYgZmllbGQgaXMgZW1wdHkgb3Igbm90IGFuZCBjaGFuZ2UgY2xhc3MgYWNjb3JkaW5nbHlcbiAgICAgICAgJChzZWxmLmVsKS5vbignY2xpY2snLCBoYW5kbGVTZWxlY3RDbGljayk7XG4gICAgfTtcblxuICAgIENvbXBsZXhTZWxlY3Rib3gucHJvdG90eXBlLl90b2dnbGVBZGRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMuZWwpLmhhc0NsYXNzKCdqcy1oYXNWYWx1ZScpKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5hZGRDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5yZW1vdmVDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBDb21wbGV4U2VsZWN0Ym94LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGJveF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gLTE7XG4gICAgfTtcblxuICAgIC8qZnVuY3Rpb24gaW5pdENvbXBsZXhTZWxlY3Rib3hlcygpIHtcbiAgICAgICAgW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtY29tcGxleENvbXBsZXhTZWxlY3Rib3gnKSkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbmV3IENvbXBsZXhTZWxlY3Rib3goZWwsIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogZWwuZGF0YXNldC5sYWJlbCxcbiAgICAgICAgICAgICAgICBoZWxwVGV4dDogZWwuZGF0YXNldC5oZWxwVGV4dCxcbiAgICAgICAgICAgICAgICBlcnJNc2c6IGVsLmRhdGFzZXQuZXJyTXNnLFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBlbC5kYXRhc2V0LnBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBKU09OLnBhcnNlKGVsLmRhdGFzZXQuaXRlbXMpLFxuICAgICAgICAgICAgICAgIHNlYXJjaDogZWwuZGF0YXNldC5zZWFyY2gsXG4gICAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI6ZWwuZGF0YXNldC5zZWFyY2hQbGFjZWhvbGRlcixcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogZWwuZGF0YXNldC5yZXF1aXJlZCxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW06IGVsLmRhdGFzZXQuc2VsZWN0ZWRJdGVtLFxuICAgICAgICAgICAgICAgIHVuc2VsZWN0OiBlbC5kYXRhc2V0LnVuc2VsZWN0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdENvbXBsZXhTZWxlY3Rib3hlcygpOyovXG5cblxuLy99KSh3aW5kb3cpO1xuXG4vKlxuICogSW5pdGlhbGl6YXRpb25zXG4gKi9cblxuLy9TdGlja2FibGVcbmZ1bmN0aW9uIFN0aWNrYWJsZShlbCwgb3B0aW9ucykge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgdGhpcy5faW5pdCgpO1xufVxuXG5TdGlja2FibGUucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuYm91bmRhcnkgPSBzZWxmLm9wdGlvbnMuYm91bmRhcnkgPyBzZWxmLm9wdGlvbnMuYm91bmRhcnkgPT09IHRydWUgPyBzZWxmLmVsLnBhcmVudE5vZGUgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGYub3B0aW9ucy5ib3VuZGFyeSkgOiB1bmRlZmluZWQ7XG4gICAgc2VsZi5vZmZzZXQgPSBzZWxmLm9wdGlvbnMub2Zmc2V0IHx8IDA7XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVTY3JvbGwoKSB7XG4gICAgICAgIHZhciBlbGVtZW50UmVjdCA9IHNlbGYuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICBlbGVtZW50Qm90dG9tT2Zmc2V0ID0gZWxlbWVudFJlY3QudG9wICsgZWxlbWVudFJlY3QuaGVpZ2h0O1xuXG5cbiAgICAgICAgaWYgKChzZWxmLm9wdGlvbnMubWF4V2lkdGggJiYgd2luZG93LmlubmVyV2lkdGggPD0gc2VsZi5vcHRpb25zLm1heFdpZHRoKSB8fCAhc2VsZi5vcHRpb25zLm1heFdpZHRoKSB7XG4gICAgICAgICAgICBpZiAoIXNlbGYuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRSZWN0LnRvcCAtIHNlbGYub3B0aW9ucy5vZmZzZXQgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWxlbWVudE9mZnNldFBhcmVudCA9IHNlbGYuZWwub2Zmc2V0UGFyZW50O1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmluaXRpYWxPZmZzZXQgPSBzZWxmLmVsLm9mZnNldFRvcDtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKHNlbGYub3B0aW9ucy5jbGFzcyB8fCAnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUudG9wID0gc2VsZi5vZmZzZXQudG9TdHJpbmcoKSArICdweCc7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50T2Zmc2V0UGFyZW50UmVjdCA9IHNlbGYuZWxlbWVudE9mZnNldFBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5ib3VuZGFyeSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYm91bmRhcnlSZWN0ID0gc2VsZi5ib3VuZGFyeS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kYXJ5Qm90dG9tT2Zmc2V0ID0gYm91bmRhcnlSZWN0LnRvcCArIGJvdW5kYXJ5UmVjdC5oZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRCb3R0b21PZmZzZXQgPiBib3VuZGFyeUJvdHRvbU9mZnNldCB8fCBlbGVtZW50UmVjdC50b3AgPCBzZWxmLm9wdGlvbnMub2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnRvcCA9IE1hdGgucm91bmQoYm91bmRhcnlCb3R0b21PZmZzZXQgLSBlbGVtZW50UmVjdC5oZWlnaHQpLnRvU3RyaW5nKCkgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnRSZWN0LnRvcCA+IHNlbGYub2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnRvcCA9IHNlbGYub2Zmc2V0LnRvU3RyaW5nKCkgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9mZnNldCA8IHNlbGYuaW5pdGlhbE9mZnNldCArIGVsZW1lbnRPZmZzZXRQYXJlbnRSZWN0LnRvcCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUucG9zaXRpb24gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS50b3AgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVJlc2l6ZSgpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gc2VsZi5vcHRpb25zLm1heFdpZHRoKSB7XG4gICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnBvc2l0aW9uID0gJyc7XG4gICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnRvcCA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlU2Nyb2xsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9wdGltaXplZFNjcm9sbFwiLCBoYW5kbGVTY3JvbGwpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib3B0aW1pemVkUmVzaXplXCIsIGhhbmRsZVJlc2l6ZSk7XG59O1xuXG4vL1JlcXVpcmVkIEZpZWxkc1xuZnVuY3Rpb24gbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpIHtcbiAgICAkKCcuanMtcmVxdWlyZWRDb3VudCcpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgIHZhciBjYXJkID0gJChlbCkucGFyZW50cygnLmNhcmQnKSxcbiAgICAgICAgICAgIGNhcmRJZCA9IGNhcmQuYXR0cignaWQnKSxcbiAgICAgICAgICAgIGVtcHR5UmVxdWlyZWRGaWVsZHNDb3VudCA9IGNhcmQuZmluZCgnLmpzLXJlcXVpcmVkJykubGVuZ3RoIC0gY2FyZC5maW5kKCcuanMtcmVxdWlyZWQuanMtaGFzVmFsdWUnKS5sZW5ndGgsXG4gICAgICAgICAgICBuYXZJdGVtID0gJCgnLmpzLXNjcm9sbFNweU5hdiAuanMtc2Nyb2xsTmF2SXRlbVtkYXRhLWhyZWY9XCInICsgY2FyZElkICsgJ1wiXScpO1xuXG4gICAgICAgIGlmIChlbXB0eVJlcXVpcmVkRmllbGRzQ291bnQgPiAwKSB7XG4gICAgICAgICAgICBuYXZJdGVtLmFkZENsYXNzKCdpcy1yZXF1aXJlZCcpO1xuICAgICAgICAgICAgJChlbCkudGV4dChlbXB0eVJlcXVpcmVkRmllbGRzQ291bnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmF2SXRlbS5yZW1vdmVDbGFzcygnaXMtcmVxdWlyZWQnKTtcbiAgICAgICAgICAgICQoZWwpLnRleHQoJycpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuLy9QYWdpbmF0aW9uXG5mdW5jdGlvbiBQYWdpbmF0aW9uKGVsLCBzdG9yZSwgdXBkYXRlRnVuY3Rpb24pIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgIHRoaXMudXBkYXRlID0gdXBkYXRlRnVuY3Rpb247XG5cbiAgICB0aGlzLl9pbml0KCk7XG59XG5cblBhZ2luYXRpb24ucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJlbmRlclBhZ2luYXRpb24oKTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZVBhZ2VDbGljayhlKSB7XG4gICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldC5kYXRhc2V0LnRhcmdldCB8fCBlLnRhcmdldC5wYXJlbnROb2RlLmRhdGFzZXQudGFyZ2V0O1xuICAgICAgICBzd2l0Y2ggKHRhcmdldCkge1xuICAgICAgICAgICAgY2FzZSAncHJldic6XG4gICAgICAgICAgICAgICAgc2VsZi5zdG9yZS5zZXRQYWdlKHNlbGYuc3RvcmUucGFnZSAtIDEgPCAwID8gMCA6IHNlbGYuc3RvcmUucGFnZSAtIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbmV4dCc6XG4gICAgICAgICAgICAgICAgc2VsZi5zdG9yZS5zZXRQYWdlKHNlbGYuc3RvcmUucGFnZSArIDEgPT09IHNlbGYuc3RvcmUucGFnZXNOdW1iZXIoKSA/IHNlbGYuc3RvcmUucGFnZXNOdW1iZXIoKSAtIDEgOiBzZWxmLnN0b3JlLnBhZ2UgKyAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYudXBkYXRlKCQoJyNsaWJyYXJ5Qm9keScpLCBzZWxmLnN0b3JlLCByZW5kZXJDb250ZW50Um93KTtcbiAgICAgICAgcmVuZGVyUGFnaW5hdGlvbigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlclBhZ2luYXRpb24oKSB7XG4gICAgICAgIHZhciBsaW5rcyA9ICQoJzx1bD48L3VsPicpLmFkZENsYXNzKCdwYWdpbmF0aW9uX19saXN0Jyk7XG4gICAgICAgIHNlbGYuZWwuZW1wdHkoKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnN0b3JlLnBhZ2VzTnVtYmVyKCkpO1xuXG4gICAgICAgIGlmIChzZWxmLnN0b3JlLnBhZ2VzTnVtYmVyKCkgPiAxKSB7XG4gICAgICAgICAgICAvL1ByZXZcbiAgICAgICAgICAgIHZhciBwcmV2TGluayA9ICQoJzxsaT48aSBjbGFzcz1cImZhIGZhLWFuZ2xlLWxlZnRcIj48L2k+PC9saT4nKS5hZGRDbGFzcygncGFnaW5hdGlvbl9fcHJldicpLmF0dHIoJ2RhdGEtdGFyZ2V0JywgJ3ByZXYnKS5jbGljayhoYW5kbGVQYWdlQ2xpY2spO1xuICAgICAgICAgICAgaWYgKHNlbGYuc3RvcmUucGFnZSA9PT0gMCkge3ByZXZMaW5rLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO31cbiAgICAgICAgICAgIGxpbmtzLmFwcGVuZChwcmV2TGluayk7XG5cbiAgICAgICAgICAgIC8vQ3VycmVudCBwYWdlIGluZGljYXRvclxuICAgICAgICAgICAgLy92YXIgY3VycmVudFBhZ2UgPSAkKCc8bGk+PC9saT4nKS5hZGRDbGFzcygncGFnaW5hdGlvbl9fY3VycmVudCcpLnRleHQoc2VsZi5zdG9yZS5wYWdlICsgMSk7XG4gICAgICAgICAgICAvL2xpbmtzLmFwcGVuZChjdXJyZW50UGFnZSk7XG5cbiAgICAgICAgICAgIC8vTmV4dFxuICAgICAgICAgICAgdmFyIG5leHRMaW5rID0gJCgnPGxpPjxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtcmlnaHRcIj48L2k+PC9saT4nKS5hZGRDbGFzcygncGFnaW5hdGlvbl9fbmV4dCcpLmF0dHIoJ2RhdGEtdGFyZ2V0JywgJ25leHQnKS5jbGljayhoYW5kbGVQYWdlQ2xpY2spO1xuICAgICAgICAgICAgaWYgKHNlbGYuc3RvcmUucGFnZSA9PT0gc2VsZi5zdG9yZS5wYWdlc051bWJlcigpIC0gMSkge25leHRMaW5rLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO31cbiAgICAgICAgICAgIGxpbmtzLmFwcGVuZChuZXh0TGluayk7XG5cbiAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kKGxpbmtzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLmVsO1xuICAgIH1cblxufTtcblxuXG5cbi8vR2xvYmFsIHZhcmlhYmxlc1xudmFyIGVkaXRlZEZpbGVzRGF0YSA9IFtdLFxuZWRpdGVkRmlsZURhdGEgPSB7fSxcbmNsYXNzTGlzdCA9IFtdLFxuZGF0YUNoYW5nZWQgPSBmYWxzZSwgLy9DaGFuZ2VzIHdoZW4gdXNlciBtYWtlIGFueSBjaGFuZ2VzIG9uIGVkaXQgc2NyZWVuO1xubGFzdFNlbGVjdGVkID0gbnVsbCwgLy9JbmRleCBvZiBsYXN0IFNlbGVjdGVkIGVsZW1lbnQgZm9yIG11bHRpIHNlbGVjdDtcbmdhbGxlcnlPYmplY3RzID0gW10sXG5kcmFmdElzU2F2ZWQgPSBmYWxzZSxcbmRpc2FibGVkSXRlbXMgPSBbXTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cbiAgLy9Db21tb24gaW5pdFxuICB2YXIgc2Nyb2xsUG9zaXRpb247XG4gIHZhciBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICBcbiAgLy9TdGlja3kgc2Nyb2xsYmFyXG4gIHN0aWNreVRvcGJhciA9IG5ldyBTdGlja3lUb3BiYXIoKTtcbiAgXG4gIC8vTm9ybWFsaXplcnNcbiAgbm9ybWlsaXplTWVudSgpO1xuICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gIG5vcm1hbGl6ZVNlbGVjdGVpb24oKTtcbiAgXG4gICQoJy5qcy1jb250ZW50IC5maWxlcyAuc2VjdGlvbl9fZmlsZXMnKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG4gIFxuICAvL0NoZWNrIGZvciByZXF1aXJlZCBmaWVsZHNcbiAgJCgnbGFiZWwucmVxdWllcmVkJykucGFyZW50KCkuY2hpbGRyZW4oJ2lucHV0Jykub24oJ2JsdXInLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGNoZWNrRmllbGQoZS50YXJnZXQpKSB7XG4gICAgICBtYXJrRmllbGRBc05vcm1hbChlLnRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hcmtGaWVsZEFzUmVxdWlyZWQoZS50YXJnZXQpO1xuICAgIH1cbiAgfSk7XG4gIFxuICBcbiAgLy9DbGljayBvbiBsb2dvXG4gICQoJy5qcy1sb2dvJykuY2xpY2soaGFuZGxlTG9nb0NsaWNrKTtcbiAgZnVuY3Rpb24gaGFuZGxlTG9nb0NsaWNrKGUpIHtcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignY3JlYXRlJykgPj0gMCAmJlxuICAgICFkcmFmdElzU2F2ZWQgJiZcbiAgICAkKCcuanMtY29udGVudCAuZmlsZSwgLmpzLWNvbnRlbnQgLmpzLWhhc1ZhbHVlJykubGVuZ3RoID4gMCkge1xuICAgICAgbmV3IE1vZGFsKHtcbiAgICAgICAgdGl0bGU6ICdMZWF2ZSBQYWdlPycsXG4gICAgICAgIHRleHQ6ICdZb3Ugd2lsbCBsb3NlIGFsbCB1bnNhdmVkIGNoYW5nZXMuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBsZWF2ZSB0aGlzIHBhZ2U/JyxcbiAgICAgICAgY29uZmlybVRleHQ6ICdMZWF2ZSBQYWdlJyxcbiAgICAgICAgY29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnZGFzaGJvYXJkLmh0bWwnO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnZGFzaGJvYXJkLmh0bWwnO1xuICAgIH1cbiAgfVxuICBcbiAgLy9Bc3NldCBMaWJyYXJ5XG4gIFxuICAkKCcjYWxDbG9zZUJ1dHRvbicpLmNsaWNrKGNsb3NlQXNzZXRMaWJyYXJ5KTtcbiAgJCgnI2FsVG9wQ2xvc2VCdXR0b24nKS5jbGljayhjbG9zZUFzc2V0TGlicmFyeSk7XG4gICQoJyNhc3NldExpYnJhcnknKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgb3BlbkFzc2V0TGlicmFyeShlKTtcbiAgfSk7XG4gIFxuICBmdW5jdGlvbiBvcGVuQXNzZXRMaWJyYXJ5KGUsIG9wdGlvbnMpIHtcbiAgICBzY3JvbGxQb3NpdGlvbiA9ICQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcbiAgICB1cGRhdGVBc3NldExpYnJhcnkoKTtcbiAgICAkKCcjYWwnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgJCgnI2FsJykuYWRkQ2xhc3MoJ21vZGFsJyk7XG4gICAgJCgnI3dyYXBwZXInKS5hZGRDbGFzcygnb3ZlcmZsb3cnKTtcbiAgICBzaW5nbGVzZWxlY3QgPSBmYWxzZTtcbiAgICAkKCcjYWRkRnJvbUFMQnV0dG9uJykudGV4dCgnQWRkIEZpbGVzJyk7XG4gIFxuICAgICQoJyNhZGRGcm9tQUxCdXR0b24nKS5jbGljayhhZGRGaWxlc0Zyb21Bc3NldExpYnJhcnkpO1xuICAgIHNldE1vZGFsS2V5Ym9hcmRBY3Rpb25zKGFkZEZpbGVzRnJvbUFzc2V0TGlicmFyeSwgY2xvc2VBc3NldExpYnJhcnkpO1xuICAgICQoZS50YXJnZXQpLmJsdXIoKTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gYWRkRmlsZXNGcm9tQXNzZXRMaWJyYXJ5KCl7XG4gICAgbGFzdFNlbGVjdGVkID0gbnVsbDtcbiAgICBhZGRTZWxlY3RlZEZpbGVzKCk7XG4gICAgY2xvc2VBc3NldExpYnJhcnkoKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG4gIH1cbiAgZnVuY3Rpb24gY2xvc2VBc3NldExpYnJhcnkoKSB7XG4gICAgbGFzdFNlbGVjdGVkID0gbnVsbDtcbiAgICAkKCcuYWwgLmZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZS5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgIGRlc2VsZWN0QWxsKCk7XG4gICAgJCgnLm1vZGFsJykuYWRkQ2xhc3MoJ2hpZGRlbicpLnJlbW92ZUNsYXNzKCdtb2RhbCcpO1xuICAgICQoJyN3cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ292ZXJmbG93Jyk7XG4gICAgJCgnI2FkZEZyb21BTEJ1dHRvbicpLnVuYmluZCgnY2xpY2snKTtcbiAgICAkKCdib2R5Jykuc2Nyb2xsVG9wKHNjcm9sbFBvc2l0aW9uKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG4gIH1cbiAgXG4gIHdpbmRvdy5vcGVuQXNzZXRMaWJyYXJ5ID0gb3BlbkFzc2V0TGlicmFyeTtcbiAgXG4gICQoJyNhbCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAkKCcjYWwgLmZpbGVzIC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gIH0pO1xuICAkKCcjYWwgLmZpbGVzIC5zZWN0aW9uX19maWxlcycpLmRpc2FibGVTZWxlY3Rpb24oKTtcbiAgXG4gIC8vVXBsb2FkIGZpbGVzXG4gICQoJyN1cGxvYWRGaWxlcycpLmNsaWNrKGhhbmRsZVVwbG9hZEZpbGVzQ2xpY2spO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBoYW5kbGVEcmFnRW50ZXIsIHRydWUpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGhhbmRsZURyYWdPdmVyLCBmYWxzZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBoYW5kbGVEcm9wLCBmYWxzZSk7XG4gIFxuICAvL0RyYWZ0IGZ1bmN0aW9uOiBTYXZlLCBDYW5jZWwsIFB1Ymxpc2hcbiAgZnVuY3Rpb24gc2F2ZURyYWZ0KCkge1xuICAgIHNob3dOb3RpZmljYXRpb24oJ1RoZSBkcmFmdCBpcyBzYXZlZC4nKTtcbiAgICBkcmFmdElzU2F2ZWQgPSB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIHJlbW92ZURyYWZ0KCkge1xuICAgIG5ldyBNb2RhbCh7XG4gICAgICB0aXRsZTogJ0NhbmNlbCB0aGlzIERyYWZ0PycsXG4gICAgICB0ZXh0OiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGNhbmNlbCBhbmQgZGlzY2FyZCB0aGlzIGRyYWZ0PycsXG4gICAgICBjb25maXJtVGV4dDogJ0NhbmNlbCcsXG4gICAgICBjb25maXJtQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnZGFzaGJvYXJkLmh0bWwnO1xuICAgICAgfSxcbiAgICAgIGNhbmNlbEFjdGlvbjogaGlkZU1vZGFsUHJvbXB0XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gcHVibGlzaERyYWZ0KCkge1xuICAgIHZhciBpdGVtTmFtZSA9ICQoJy5tZW51IC5pcy1hY3RpdmUnKS50ZXh0KCksXG4gICAgcHJvbXB0TXNnID0gJyc7XG4gIFxuICAgIHN3aXRjaCAoaXRlbU5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgY2FzZSAncGVyc29uJzpcbiAgICAgIHByb21wdE1zZyA9ICdQdWJsaXNoZWQgcGVyc29uIHdpbGwgYmVjb21lIGF2YWlsYWJsZSB0byBiZSBhZGRlZCBhcyBwYXJ0IG9mIGEgY2FzdCBmb3IgYSBzZWFzb24vZXZlbnQuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwdWJsaXNoIGl0Pyc7XG4gICAgICBicmVhaztcbiAgXG4gICAgICBjYXNlICdyb2xlJzpcbiAgICAgIHByb21wdE1zZyA9ICdQdWJsaXNoZWQgcm9sZSB3aWxsIGJlY29tZSBhdmFpbGFibGUgdG8gYmUgYWRkZWQgYXMgcGFydCBvZiBhIGNhc3QgZm9yIGEgc2Vhc29uL2V2ZW50LiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHVibGlzaCBpdD8nO1xuICAgICAgYnJlYWs7XG4gIFxuICAgICAgZGVmYXVsdDpcbiAgICAgIHByb21wdE1zZyA9ICdQdWJsaXNoZWQgJyArIGl0ZW1OYW1lLnRvTG93ZXJDYXNlKCkgKyAnIHdpbGwgYmVjb21lIGF2YWlsYWJsZSBvbiB0aGUgbGl2ZSBzaXRlLiBBcmUgeW91IHN1cmUgeW91IHdvdWxkIGxpa2UgdG8gcHVibGlzaCBpdD8nO1xuICAgICAgYnJlYWs7XG4gIFxuICAgIH1cbiAgICBuZXcgTW9kYWwoe1xuICAgICAgdGl0bGU6ICdQdWJsaXNoIHRoaXMgJyArIGl0ZW1OYW1lICsgJz8nLFxuICAgICAgdGV4dDogcHJvbXB0TXNnLFxuICAgICAgY29uZmlybVRleHQ6ICdQdWJsaXNoJyxcbiAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICBoaWRlTW9kYWxQcm9tcHQoKTtcbiAgICAgICAgc2hvd05vdGlmaWNhdGlvbihpdGVtTmFtZSArICcgaXMgcHVibGlzaGVkLicpO1xuICAgICAgICBkcmFmdElzU2F2ZWQgPSB0cnVlO1xuICAgICAgfSxcbiAgICAgIGNhbmNlbEFjdGlvbjogaGlkZU1vZGFsUHJvbXB0XG4gICAgfSk7XG4gIH1cbiAgXG4gICQoJyNzYXZlRHJhZnQnKS5jbGljayhzYXZlRHJhZnQpO1xuICAkKCcjcmVtb3ZlRHJhZnQnKS5jbGljayhyZW1vdmVEcmFmdCk7XG4gICQoJyNwdWJsaXNoRHJhZnQnKS5jbGljayhwdWJsaXNoRHJhZnQpO1xuICBcbiAgLy9Ub3AgYmFyIGFjdGlvbnMgZHJvcGRvd24gZm9yIG1vYmlsZVxuICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGlvbkRyb3Bkb3duJykpIHtcbiAgICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGlvbkRyb3Bkb3duJyksXG4gICAgICB7XG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1jaGVja1wiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgU2F2ZSBhcyBkcmFmdDwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IHNhdmVEcmFmdFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1iYW5cIj48L2k+PHNwYW4gY2xhc3M9XCJidXR0b25UZXh0XCI+ICBDYW5jZWw8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiByZW1vdmVEcmFmdFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgICk7XG4gIH1cbiAgXG4gIC8vRmlsZXMgbW9yZSBhY3Rpb24gZHJvcGRvd25zXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9yZUFjdGlvbnMnKSkge1xuICAgIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9yZUFjdGlvbnMnKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICdTZW5kIHRvIHRvcCcsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlU2VuZFRvVG9wQ2xpY2tcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJ1NlbmQgdG8gYm90dG9tJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVTZW5kVG9Cb3R0b21DbGlja1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgICk7XG4gIH1cbiAgXG4gIC8vTWVkaWEgY2FyZCBkcm9wZG93bnNcbiAgLy9TbWFsbFxuICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lZGlhQWN0aW9uc1NtYWxsJykpIHtcbiAgICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lZGlhQWN0aW9uc1NtYWxsJyksXG4gICAgICB7XG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS11cGxvYWRcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIFVwbG9hZCBmaWxlczwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZVVwbG9hZEZpbGVzQ2xpY2tcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtZm9sZGVyLW9wZW5cIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIEFkZCBmcm9tIGxpYnJhcnk8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIG9wZW5Bc3NldExpYnJhcnkoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICAvL0Z1bGxcbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZWRpYUFjdGlvbnNGdWxsJykpIHtcbiAgICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lZGlhQWN0aW9uc0Z1bGwnKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXBlbmNpbC1zcXVhcmVcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIE11bHRpIEVkaXQ8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVNdWx0aUVkaXRCdXR0b25DbGljayxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI211bHRpRWRpdCcpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtdGltZXMtY2lyY2xlXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBSZW1vdmU8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVCdWxrUmVtb3ZlQ2xpY2ssXG4gICAgICAgICAgICBkaXNhYmxlZDogZnVuY3Rpb24oKSB7cmV0dXJuICQoJyNidWxrUmVtb3ZlJykuaGFzQ2xhc3MoJ2Rpc2FibGVkJyk7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGl2aWRlcjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS11cGxvYWRcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIFVwbG9hZCBmaWxlczwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZVVwbG9hZEZpbGVzQ2xpY2tcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtZm9sZGVyLW9wZW5cIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIEFkZCBmcm9tIGxpYnJhcnk8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIG9wZW5Bc3NldExpYnJhcnkoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBcbiAgLy9Bc3NldCBsaWJyYXJ5IGRyb3Bkb3duc1xuICAvL1NtYWxsXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNzZXRBY3Rpb25zU21hbGwnKSkge1xuICAgIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNzZXRBY3Rpb25zU21hbGwnKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgVXBsb2FkIGZpbGVzPC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlVXBsb2FkRmlsZXNDbGlja1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgICk7XG4gIH1cbiAgLy9GdWxsXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNzZXRBY3Rpb25zRnVsbCcpKSB7XG4gICAgdmFyIHBhZ2VBY3Rpb25Ecm9wZG93biA9IG5ldyBEcm9wZG93bihcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc3NldEFjdGlvbnNGdWxsJyksXG4gICAgICB7XG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1wZW5jaWxcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIEJ1bGsgRWRpdDwvc3Bhbj48c3BhbiBjbGFzcz1cImRyb3Bkb3duX193YXJuaW5nXCI+PC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2ssXG4gICAgICAgICAgICBkaXNhYmxlZDogZnVuY3Rpb24oKSB7cmV0dXJuICQoJyNidWxrRWRpdCcpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO30sXG4gICAgICAgICAgICB3YXJuaW5nOiBmdW5jdGlvbigpIHtyZXR1cm4gISQoJyNidWxrRWRpdCcpLmNoaWxkcmVuKCcuYnV0dG9uX193YXJuaW5nJykuaGFzQ2xhc3MoJ2lzLWhpZGRlbicpO31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtcGVuY2lsLXNxdWFyZVwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgTXVsdGkgRWRpdDwvc3Bhbj48c3BhbiBjbGFzcz1cImRyb3Bkb3duX193YXJuaW5nXCI+PC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2ssXG4gICAgICAgICAgICBkaXNhYmxlZDogZnVuY3Rpb24oKSB7cmV0dXJuICQoJyNtdWx0aUVkaXQnKS5oYXNDbGFzcygnZGlzYWJsZWQnKTt9LFxuICAgICAgICAgICAgd2FybmluZzogZnVuY3Rpb24oKSB7cmV0dXJuICEkKCcjbXVsdGlFZGl0JykuY2hpbGRyZW4oJy5idXR0b25fX3dhcm5pbmcnKS5oYXNDbGFzcygnaXMtaGlkZGVuJyk7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS10aW1lcy1jaXJjbGVcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIFJlbW92ZTwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZUJ1bGtSZW1vdmVDbGljayxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI2J1bGtSZW1vdmUnKS5oYXNDbGFzcygnZGlzYWJsZWQnKTt9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkaXZpZGVyOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgVXBsb2FkIGZpbGVzPC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlVXBsb2FkRmlsZXNDbGlja1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgICk7XG4gIH1cbiAgXG4gIFxuICAvL0luaXQgcGxhY2Vob2xkZXJzIGZvciBpbWFnZXMgaWYgYW55IChjb3ZlciwgZXRjLilcbiAgd2luZG93LmltYWdlUGxhY2Vob2xkZXJzID0gaW5pdEltYWdlUGxhY2Vob2xkZXJzKCk7XG4gIFxuICAvL0ZvY2FsIHBvaW50XG4gICQoJyNmb2NhbFBvaW50VG9nZ2xlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIC8vSGlkZSBmb2NhbCByZWN0YW5nbGVcbiAgICAkKCcjZm9jYWxSZWN0VG9nZ2xlJylcbiAgICAgIC5yZW1vdmVDbGFzcygnaXMtYWN0aXZlIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWFjY2VudCcpXG4gICAgICAuYWRkQ2xhc3MoJ2J1dHRvbl9zdHlsZV9vdXRsaW5lLXdoaXRlJyk7XG4gICAgJCgnI2ZvY2FsUmVjdCcpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcbiAgICAkKCcucHVycG9zZXNfX2NvbnRhaW5lciAucHVycG9zZS5pcy1hY3RpdmUnKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gIFxuICAgIC8vQ2hlY2sgd2hldGhlciBmb2NhbCBwb2ludCBpcyBhY3RpdmVcbiAgICBpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2lzLWFjdGl2ZScpKSB7XG4gICAgICAkKGUudGFyZ2V0KVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZSBidXR0b25fc3R5bGVfb3V0bGluZS1hY2NlbnQnKVxuICAgICAgICAuYWRkQ2xhc3MoJ2J1dHRvbl9zdHlsZV9vdXRsaW5lLXdoaXRlJyk7XG4gICAgICAkKCcjZm9jYWxQb2ludCcpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcbiAgICAgIGhpZGVVc2FnZVByZXZpZXdzKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy9TZXQgZm9jYWwgcG9pbnQgdG9nZ2xlIGFjdGl2ZVxuICAgICAgJChlLnRhcmdldClcbiAgICAgICAgLmFkZENsYXNzKCdpcy1hY3RpdmUgYnV0dG9uX3N0eWxlX291dGxpbmUtYWNjZW50JylcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdidXR0b25fc3R5bGVfb3V0bGluZS13aGl0ZScpO1xuICAgICAgc2hvd1VzYWdlUHJldmlld3MoKTtcbiAgICAgICQoJyNmb2NhbFBvaW50JykucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgIH1cbiAgfSk7XG4gIFxuICAvL0ZvY2FsIHJlY3RhbmdsZVxuICAkKCcjZm9jYWxSZWN0VG9nZ2xlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIC8vSGlkZSBmb2NhbCBwb2ludFxuICAgICQoJyNmb2NhbFBvaW50VG9nZ2xlJylcbiAgICAgIC5yZW1vdmVDbGFzcygnaXMtYWN0aXZlIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWFjY2VudCcpXG4gICAgICAuYWRkQ2xhc3MoJ2J1dHRvbl9zdHlsZV9vdXRsaW5lLXdoaXRlJyk7XG4gICAgJCgnI2ZvY2FsUG9pbnQnKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG4gIFxuICAgIC8vQ2hlY2sgd2hldGhlciBmb2NhbCBwb2ludCBpcyBhY3RpdmVcbiAgICBpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2lzLWFjdGl2ZScpKSB7XG4gICAgICAkKGUudGFyZ2V0KVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZSBidXR0b25fc3R5bGVfb3V0bGluZS1hY2NlbnQnKVxuICAgICAgICAuYWRkQ2xhc3MoJ2J1dHRvbl9zdHlsZV9vdXRsaW5lLXdoaXRlJyk7XG4gICAgICAkKCcjZm9jYWxSZWN0JykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgaGlkZVVzYWdlUHJldmlld3MoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvL1NldCBmb2NhbCBwb2ludCB0b2dnbGUgYWN0aXZlXG4gICAgICAkKGUudGFyZ2V0KVxuICAgICAgICAuYWRkQ2xhc3MoJ2lzLWFjdGl2ZSBidXR0b25fc3R5bGVfb3V0bGluZS1hY2NlbnQnKVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2J1dHRvbl9zdHlsZV9vdXRsaW5lLXdoaXRlJyk7XG4gICAgICBzaG93VXNhZ2VQcmV2aWV3cygpO1xuICAgICAgLy8gQWRqdXN0IHBsYWNlbWVudCBhbmQgc2l6ZSBvZiByZWN0YW5nbGUgYWNjb3JkaW5nIHB1cnBvc2Ugc2l6ZVxuICAgICAgLy8gV2UgbmVlZCB0byB3YWl0IHNvbWUgdGltZSwgc28gaW1hZ2UgcHJldmlldyBzaXplIGNvdWxkIGJlIGNhbGN1bGF0ZWQgY29ycmVjdFxuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGFkanVzdFJlY3QoJCgnLnB1cnBvc2VzX19jb250YWluZXIgLnB1cnBvc2UtaW1nJykuZmlyc3QoKSk7XG4gICAgICAgICQoJy5wdXJwb3Nlc19fY29udGFpbmVyIC5wdXJwb3NlLWltZycpLnVuYmluZCgpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICBcdFx0XHRhZGp1c3RSZWN0KCQoZS50YXJnZXQpKTtcbiAgICBcdFx0fSk7XG4gICAgICAgICQoJyNmb2NhbFJlY3QnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG4gICAgICB9LCAzMDApO1xuICAgICAgJCgnI3B1cnBvc2VXcmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiAwIH0sIDYwMCk7XG4gICAgfVxuICB9KTtcbiAgLyogSGFuZGxlIFB1cnBvc2VzIHNjcm9sbCAqL1xuICAkKCcjcHVycG9zZVdyYXBwZXInKS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4gICAgc2V0UHVycG9zZVBhZ2luYXRpb24oKTtcbiAgfSk7XG4gICQoJy5wdXJwb3Nlc19fbGVmdCcpLnVuYmluZCgnY2xpY2snKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgJCgnI3B1cnBvc2VXcmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiAnLT00ODAnIH0sIDYwMCk7XG4gIH0pO1xuICAkKCcucHVycG9zZXNfX3JpZ2h0JykudW5iaW5kKCdjbGljaycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAkKCcjcHVycG9zZVdyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6ICcrPTQ4MCcgfSwgNjAwKTtcbiAgfSk7XG4gIC8vSGVscGVyIGZ1bmN0aW9uIHRvIGNoYW5nZSBjbGFzc2VzIGFuZCBzaG93IHVzYWdlIHByZXZpZXdzXG4gIGZ1bmN0aW9uIHNob3dVc2FnZVByZXZpZXdzKCkge1xuICAgICQoJyNmaWxlUHJldmlldycpLmFkZENsYXNzKCdoYXMtcHJldmlld3MnKTtcbiAgICAkKCcjcHVycG9zZXMnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG4gIH1cbiAgZnVuY3Rpb24gaGlkZVVzYWdlUHJldmlld3MoKSB7XG4gICAgJCgnI2ZpbGVQcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ2hhcy1wcmV2aWV3cycpO1xuICAgICQoJyNwdXJwb3NlcycpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcbiAgfVxuICBcbiAgJCgnI2ZvY2FsUG9pbnQnKS5kcmFnZ2FibGUoe1xuICAgIGNvbnRhaW5tZW50OiBcIiNwcmV2aWV3SW1nXCIsXG4gICAgc2Nyb2xsOiBmYWxzZSAsXG4gICAgc3RvcDogZnVuY3Rpb24oZSkge1xuICAgICAgYWRqdXN0Rm9jYWxQb2ludCgpO1xuICAgICAgYWRqdXN0UHVycG9zZSgkKGUudGFyZ2V0KSk7XG4gICAgICBkYXRhQ2hhbmdlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcbiAgLyogSW5pdCBQdXJwb3NlIFBhZ2luYXRvciAqL1xuICBcbiAgZnVuY3Rpb24gc2V0UHVycG9zZVBhZ2luYXRpb24oKSB7XG4gICAgdmFyIHNjcm9sbE9mZnNldCA9ICQoJyNwdXJwb3NlV3JhcHBlcicpLnNjcm9sbExlZnQoKTtcbiAgICB2YXIgd2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHVycG9zZVdyYXBwZXInKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICB2YXIgZmlyc3RJbmRleCA9IE1hdGguZmxvb3Ioc2Nyb2xsT2Zmc2V0LzE0MCkgKyAxO1xuICAgIHZhciBsYXN0SW5kZXggPSBmaXJzdEluZGV4ICsgTWF0aC5yb3VuZCh3aWR0aC8xNDApIC0gMTtcbiAgICB2YXIgY291bnQgPSAkKCcjcHVycG9zZVdyYXBwZXIgLnB1cnBvc2UnKS5sZW5ndGg7XG4gIFxuICAgIGxhc3RJbmRleCA9IGxhc3RJbmRleCA8IGNvdW50ID8gbGFzdEluZGV4IDogY291bnQ7XG4gIFxuICAgICQoJyNwLXBhZ2luYXRvcicpLnRleHQoZmlyc3RJbmRleCArICcg4oCUICcgKyBsYXN0SW5kZXggKyAnIG9mICcgKyBjb3VudCk7XG4gIH1cbiAgXG4gICQoJyNzaG93UHJldmlldycpLmNsaWNrKHNob3dBbGxQcmV2aWV3cyk7XG4gICQoJyNoaWRlUHVycG9zZScpLmNsaWNrKGhpZGVBbGxQcmV2aWV3cyk7XG4gICQoJyNsb2FkTW9yZScpLmNsaWNrKGhhbmRsZVNob3dNb3JlKTtcbiAgXG4gIFxuICBmdW5jdGlvbiBoYW5kbGVTaG93TW9yZShlKSB7XG4gICAgJChcIiNwdXJwb3NlcyAuYy1QdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UuaGlkZGVuXCIpLnNsaWNlKDAsIDUpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICBpZiAoJChcIiNwdXJwb3NlcyAuYy1QdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UuaGlkZGVuXCIpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgIH1cbiAgfVxuICBcbiAgXG4gIC8vU2VsZWN0ZWQgRmlsZXMgYWN0aW9uc1xuICAkKCcjYnVsa0VkaXQnKS5jbGljayhoYW5kbGVCdWxrRWRpdEJ1dHRvbkNsaWNrKTtcbiAgJCgnI211bHRpRWRpdCcpLmNsaWNrKGhhbmRsZU11bHRpRWRpdEJ1dHRvbkNsaWNrKTtcbiAgJCgnI2J1bGtSZW1vdmUnKS5jbGljayhoYW5kbGVCdWxrUmVtb3ZlQ2xpY2spO1xuICBcbiAgZnVuY3Rpb24gaGFuZGxlQnVsa1JlbW92ZUNsaWNrKCkge1xuICAgIHZhciBmaWxlc1RvRGVsZXRlID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkJyksXG4gICAgaXRlbU5hbWUgPSAkKCcubWVudSAuaXMtYWN0aXZlJykudGV4dCgpLnRvTG93ZXJDYXNlKCksXG4gICAgYXNzZXRMaWJyYXJ5ID0gaXRlbU5hbWUgPT09ICdhc3NldCBsaWJyYXJ5JyxcbiAgICBtc2dUaXRsZSA9IGFzc2V0TGlicmFyeT8gJ0RlbGV0ZSBBc3NldHM/JyA6ICdSZW1vdmUgQXNzZXRzPycsXG4gICAgbWVzZ1RleHQgPSBhc3NldExpYnJhcnk/ICdTZWxlY3RlZCBhc3NldChzKSB3aWxsIGJlIGRlbGV0ZWQgZnJvbSB0aGUgYXNzZXQgbGlicmFyeS4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGVtPycgOiAnU2VsZWN0ZWQgYXNzZXQocykgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhpcyAnICsgaXRlbU5hbWUgKyAnLiBEb27igJl0IHdvcnJ5LCBpdCB3b27igJl0IGJlIGRlbGV0ZWQgZnJvbSB0aGUgQXNzZXQgTGlicmFyeS4nLFxuICAgIGJ0bk5hbWUgPSBhc3NldExpYnJhcnk/ICdEZWxldGUnIDogJ1JlbW92ZSc7XG4gICAgbmV3IE1vZGFsKHtcbiAgICAgIHRpdGxlOiBtc2dUaXRsZSxcbiAgICAgIHRleHQ6IG1lc2dUZXh0LFxuICAgICAgY29uZmlybVRleHQ6IGJ0bk5hbWUsXG4gICAgICBjb25maXJtQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgZmlsZXNUb0RlbGV0ZS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgICAgdmFyIGlkID0gJChlbCkuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpO1xuICAgICAgICAgIGRlbGV0ZUZpbGVCeUlkKGlkLCBnYWxsZXJ5T2JqZWN0cyk7XG4gICAgICAgIH0pO1xuICAgICAgICB1cGRhdGVHYWxsZXJ5KCk7XG4gICAgICB9LFxuICAgICAgY2FuY2VsQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNicicpLnJlbW92ZUNsYXNzKCdzYnInKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBcbiAgLy9GaWxlIEVkaXQgU2F2ZSBhbmQgQ2FuY2VsXG4gICQoJyNzYXZlQ2hhbmdlcycpLmNsaWNrKHNhdmVJbWFnZUVkaXQpO1xuICAkKCcjY2FuY2VsQ2hhbmdlcycpLmNsaWNrKGNhbmNlbEltYWdlRWRpdCk7XG4gICQoJyNmcFRvcENsb3NlQnV0dG9uJykuY2xpY2soY2FuY2VsSW1hZ2VFZGl0KTtcbiAgXG4gIC8vRmlsZSBFZGl0IGZpZWxkIGNoYW5nZXNcbiAgJCgnI3RpdGxlJykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVUaXRsZSgpO30pO1xuICAkKCcjY2FwdGlvbicpLm9uKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtzYXZlQ2FwdGlvbigpO30pO1xuICAkKCcjZGVzY3JpcHRpb24nKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKSB7c2F2ZURlc2NyaXB0aW9uKCk7fSk7XG4gICQoJyNyZXNvbHV0aW9uJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtzYXZlUmVzb2x1dGlvbigpO30pO1xuICAkKCcjYWx0VGV4dCcpLm9uKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtzYXZlQWx0VGV4dCgpO30pO1xuICBcbiAgLy9IYW5kbGUgc2VsZWN0aW9uc1xuICAkKCcjc2VsZWN0QWxsJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIGlmICgkKGUudGFyZ2V0KS5oYXNDbGFzcygnZW1wdHknKSkge1xuICAgICAgc2VsZWN0QWxsKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlc2VsZWN0QWxsKCk7XG4gICAgfVxuICB9KTtcbiAgJCgnI2Rlc2VsZWN0QWxsJykuY2xpY2soZnVuY3Rpb24oZSkge2Rlc2VsZWN0QWxsKCk7fSk7XG4gIFxuICAvL0luaXQgYWRkYWJsZSBmaWVsZHNcbiAgaW5pdEFkZGFibGVGaWVsZHMoKTtcbiAgXG4gIFxuICBcbiAgXG4gIFxuICAvL2F1dG9leHBhbmRhYmxlIHRleHRhcmVhXG4gICQoICd0ZXh0YXJlYScgKS5lbGFzdGljKCk7XG4gIFxuICAvKlxuICAqIENhcmRzXG4gICovXG4gIFxuICAvL0ZvbGRhYmxlIGNhcmRzXG4gICQoJy5qcy1mb2xkYWJsZSAuanMtZm9sZGVkVG9nZ2xlJykuY2xpY2soaGFuZGxlRm9sZGVkVG9nZ2xlQ2xpY2spO1xuICBmdW5jdGlvbiBoYW5kbGVGb2xkZWRUb2dnbGVDbGljayhlKSB7XG4gICAgdmFyIGNhcmQgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuanMtZm9sZGFibGUnKTtcbiAgICBpZiAoY2FyZC5oYXNDbGFzcygnaXMtZm9sZGVkJykpIHtcbiAgICAgIGNhcmQucmVtb3ZlQ2xhc3MoJ2lzLWZvbGRlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYXJkLmFkZENsYXNzKCdpcy1mb2xkZWQnKTtcbiAgICB9XG4gIH1cbiAgLy9TdGlja3kgY2FyZCBoZWFkZXJcbiAgJCgnLmpzLXN0aWNreU9uTW9iaWxlJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICB2YXIgc3RpY2t5ID0gbmV3IFN0aWNrYWJsZShlbCwge1xuICAgICAgbWF4V2lkdGg6IDYwMCxcbiAgICAgIGJvdW5kYXJ5OiB0cnVlLFxuICAgICAgb2Zmc2V0OiA1MFxuICAgIH0pO1xuICB9KTtcbiAgJCgnLmpzLXNlY3Rpb25UaXRsZScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgdmFyIHN0aWNreSA9IG5ldyBTdGlja2FibGUoZWwsIHtcbiAgICAgIG1heFdpZHRoOiA2MDAsXG4gICAgICBib3VuZGFyeTogJyNtZWRpYS1jYXJkJyxcbiAgICAgIG9mZnNldDogMTA0XG4gICAgfSk7XG4gIH0pO1xuICBcbiAgLy9BbmltYXRpb24gZW5kIGhhbmRsZVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgZnVuY3Rpb24oZSkge1xuICAgIHN3aXRjaCAoZS5hbmltYXRpb25OYW1lKSB7XG4gICAgICBjYXNlICdjb2xsZWN0aW9uSXRlbS1wdWxzZS1vdXQnOlxuICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2lzLWFwcGVhcmluZycpO1xuICAgICAgcmV0dXJuIGU7XG4gIFxuICAgICAgY2FzZSAnaW1nLXdyYXBwZXItc2xpZGUtbGVmdCc6XG4gICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnaXMtc2xpZGluZ0xlZnQnKTtcbiAgICAgIHJldHVybiBlO1xuICBcbiAgICAgIGNhc2UgJ2ltZy13cmFwcGVyLXNsaWRlLXJpZ2h0JzpcbiAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdpcy1zbGlkaW5nUmlnaHQnKTtcbiAgICAgIHJldHVybiBlO1xuICBcbiAgICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZTtcbiAgICB9XG4gIH0pO1xuICBcbiAgXG4gIFxuICBcbiAgLy9SZWN1cnJpbmcgdG9nZ2xlXG4gICQoJyNyZWN1cnJpbmdUb2dnbGUnKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuICAgIGlmIChlLnRhcmdldC5jaGVja2VkKSB7XG4gICAgICAkKCcjcmVjdXJpbmdUaW1lJykucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJyNyZWN1cmluZ1RpbWUnKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICB9XG4gIH0pO1xuICBcbiAgY29uc29sZS5sb2cod2luZG93LnNldHRpbmdzKTtcbiAgXG4gIGlmICh3aW5kb3cuc2V0dGluZ3MuSVNfTVZQKSB7XG4gICAgJChcImJvZHlcIikuYWRkQ2xhc3MoXCJpcy1tdnBcIik7XG4gIH1cbiAgXG4gIFxuICAvKlxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgIG9wZW5Bc3NldExpYnJhcnk6IG9wZW5Bc3NldExpYnJhcnlcbiAgICB9XG4gIH1cbiAgKi9cblxuICAvL0Rhc2hib2FyZCBGQXZvcml0ZXMgc29ydGFibGVcbiAgJCgnI2Rhc2hib2FyZEZhdm9yaXRlcy5qcy1zb3J0YWJsZScpLnNvcnRhYmxlKHtcbiAgICBwbGFjZWhvbGRlcjogJ3BsYWNlaG9sZGVyJ1xuICB9KTtcbiAgJCgnI2Rhc2hib2FyZEZhdm9yaXRlcy5qcy1zb3J0YWJsZScpLmRpc2FibGVTZWxlY3Rpb24oKTtcblxuXG4gICQoJy5zZXQnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgJChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgfSk7XG5cbiAgJCgnLnBhbm5lbCAuc2hvcnRjdXQnKS5kcmFnZ2FibGUoe1xuICAgIGNvbm5lY3RUb1NvcnRhYmxlOiAnLnNob3J0Y3V0cycsXG4gICAgc3RvcDogZnVuY3Rpb24oIGUsIHVpICkge2UudGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO31cbiAgfSk7XG5cbiAgJCgnKicpLm5vdCgnLnBhbm5lbCwgLnBhbm5lbCA+IC5zaG9ydGN1dCwgLnNldCcpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICQoJy5zZXQnKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICB9KTtcbn0pOyJdLCJmaWxlIjoiZGFzaGJvYXJkLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
