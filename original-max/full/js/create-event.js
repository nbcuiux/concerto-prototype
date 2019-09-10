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
draftIsSaved = false;

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

  filePurpose = $('<div></div>').addClass('file__purpose'),
  filePurposeSelect = $('<div></div>');

  fileEditButton = $('<button>Edit</button>').addClass('button button button_style_outline-gray u-visible-xs u-noMargin').click(handleFiledEditButtonClick);

  fileControls.append(fileCheckmark, fileDelete, fileType, fileEdit);
  fileImg.append(fileControls);

  filePurpose.append(filePurposeSelect, fileEditButton);
  purposeSelect = new Selectbox(filePurposeSelect.get(0), {
    label: 'Usage',
    placeholder: 'Select Usage',
    items: ['All cast', 'Cast Detail', 'Headshot','Full body', 'Promo'].sort()
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

  if (scrollIndex) {
    var scrollTop = $('.js-content .files .file').last().offset().top;
    $('body').animate({
      scrollTop: scrollTop
    }, 400);
  }
}

//Cast & Credit initialization
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

function initCreditSection(section) {
  //After we add a new cast row, we need to make initialization to make textfields and selectboxes work properly
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

  var castRow = createEmptyCastRow();
  section.append(castRow);
  var addableObject = new Addable(castRow, {beforeAdd: beforeAddCast, sortable: true});
  addableObject.removeItem(0);
  addableObject._addItem(createEmptyCastRow(), beforeAddCast);

  return addableObject;
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

$(document).ready(function() {
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
    $(e.target).toggleClass('is-active button_style_outline-white button_style_outline-accent');
    $('.pr > .preview').toggleClass('focal line point');
  
  });
  /* Handle Purposes scroll */
  $('#purposeWrapper').scroll(function() {
    setPurposePagination();
  });
  
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
  
  function showAllPreviews() {
    $('#purposes').addClass('is-open');
    $('#previewImage').addClass('hidden');
    $('#previewControls').addClass('hidden');
  
    //Check if it is a mobile screen
    if (window.innerWidth < 650) {
      $("#purposes .c-Purposes-container .purpose").addClass('hidden');
      $("#purposes .c-Purposes-container .purpose.hidden").slice(0, 5).removeClass('hidden');
      $('#loadMore').removeClass('hidden');
    }
    //$('.preview.focal').addClass('full').removeClass('line');
    //$('#purposeToggle').children('span').text('Hide Preview');
  }
  function hideAllPreviews() {
    $('#purposes').removeClass('is-open');
    $('#previewImage').removeClass('hidden');
    $('#previewControls').removeClass('hidden');
  }
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

  //Event title and title input
  if ($('#eventTitleInput').get(0)) {
    var eventTitleInput = new Textfield($('#eventTitleInput').get(0), {
      label: 'Title',
      helpText: 'Mauris malesuada nibh nec leo porta maximus.',
      errMsg: 'Please fill the title',
      onInput: function(e) {
        $('#eventTitleText').text(e.target.value || 'New Event');
        if (e.target.value !== '') {
          $('.header__subhead').removeClass('is-hidden');
        } else {
          $('.header__subhead').addClass('is-hidden');
        }
      }
    });
  }

  //Event Type Selectbox
  if ($('#eventTypeSelectbox').get(0)) {
    new Selectbox($('#eventTypeSelectbox').get(0), {
      label: 'Event Type',
      items: ['Movie', 'Live Event', 'Web Event', 'Special', 'Holiday Special', 'Prequel'].sort(),
      placeholder: 'Select Series',
      itemCallback: function(target, selectbox) {
        if (target.innerHTML === 'Movie') {
          $('#eventReleaseYear, #eventChannelOriginal, #eventAirTimes').removeClass('is-disabled');
        } else {
          $('#eventReleaseYear, #eventChannelOriginal, #eventAirTimes').addClass('is-disabled');
        }
      }
    });
  }

  //Init Cast collection
  initCastSection($('#castSection').find('.controls__group'));
  initCreditSection($('#creditSection').find('.controls__group'));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcmVhdGUtZXZlbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy9Db21tb24ganMgZmlsZXNcbi8vTWVudVxuZnVuY3Rpb24gbm9ybWlsaXplTWVudSgpIHtcbiAgdmFyIHBhZ2VOYW1lID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJy8nKS5wb3AoKSxcbiAgbWVudUl0ZW1zID0gJCgnLmpzLW1lbnUgLmpzLW1lbnVJdGVtJyk7XG4gIGFjdGl2ZU1lbnVJdGVtID0gJCgnW2RhdGEtdGFyZ2V0PVwiJyArIHBhZ2VOYW1lICsgJ1wiXScpO1xuXG4gIG1lbnVJdGVtcy5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJykuY2xpY2soaGFuZGxlTWVudUl0ZW1DbGljayk7XG4gIGFjdGl2ZU1lbnVJdGVtLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgYWN0aXZlTWVudUl0ZW0ucGFyZW50cygnLm1lbnVfX2l0ZW0nKS5hZGRDbGFzcygnaXMtb3BlbicpO1xufVxuZnVuY3Rpb24gaGFuZGxlTWVudUl0ZW1DbGljayhlKSB7XG4gIGlmICgkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhcmdldCcpKSB7XG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJ2NyZWF0ZScpID49IDAgJiYgIWRyYWZ0SXNTYXZlZCAmJiAkKCcuanMtY29udGVudCAuZmlsZSwgLmpzLWNvbnRlbnQgLmpzLWhhc1ZhbHVlJykubGVuZ3RoID4gMCkge1xuICAgICAgbmV3IE1vZGFsKHtcbiAgICAgICAgdGl0bGU6ICdMZWF2ZSBQYWdlPycsXG4gICAgICAgIHRleHQ6ICdZb3Ugd2lsbCBsb3NlIGFsbCB0aGUgdW5zYXZlZCBjaGFuZ2VzLiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gbGVhdmUgdGhpcyBwYWdlPycsXG4gICAgICAgIGNvbmZpcm1UZXh0OiAnTGVhdmUgUGFnZScsXG4gICAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YXJnZXQnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YXJnZXQnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKCQoZS50YXJnZXQpLnBhcmVudHMoJy5tZW51X19pdGVtJykuaGFzQ2xhc3MoJ2lzLW9wZW4nKSkge1xuICAgICAgJChlLnRhcmdldCkucGFyZW50cygnLm1lbnVfX2l0ZW0nKS5yZW1vdmVDbGFzcygnaXMtb3BlbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcubWVudV9faXRlbScpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XG4gICAgICAkKGUudGFyZ2V0KS5wYXJlbnRzKCcubWVudV9faXRlbScpLmFkZENsYXNzKCdpcy1vcGVuJyk7XG4gICAgfVxuICB9XG59XG5cbiQoJyNtZW51VG9nZ2xlJykuY2xpY2sob3Blbk1lbnUpO1xuJCgnLmpzLW1lbnUgPiAuanMtY2xvc2UnKS5jbGljayhjbG9zZU1lbnUpO1xuXG5mdW5jdGlvbiBvcGVuTWVudShlKSB7XG4gICQoJy5qcy1tZW51JykuYWRkQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNsb3NlTWVudSk7XG59XG5mdW5jdGlvbiBjbG9zZU1lbnUoZSkge1xuICBpZiAoJChlLnRhcmdldCkucGFyZW50cygnLm1lbnVfX2xpc3QnKS5sZW5ndGggPT09IDApIHtcbiAgICAkKCcuanMtbWVudScpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNsb3NlTWVudSk7XG4gIH1cbn1cblxuLy9zZWxlY3Rpb25cblxuZnVuY3Rpb24gdG9nZ2xlRmlsZVNlbGVjdChlKSB7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0dmFyIGZpbGUgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpLFxuXHRcdGZpbGVzU2VjdGlvbiA9IGZpbGUucGFyZW50KCksXG5cdFx0ZmlsZXMgPSBmaWxlc1NlY3Rpb24uY2hpbGRyZW4oJy5maWxlJyksXG5cdFx0c2VsZWN0ZWRGaWxlcyA9IGZpbGVzU2VjdGlvbi5jaGlsZHJlbignLmZpbGUuc2VsZWN0ZWQnKSxcblx0XHRzaW5nbGUgPSBzaW5nbGVzZWxlY3QgfHwgZmFsc2U7XG5cblx0aWYgKHNpbmdsZSkge1xuXHRcdGlmIChmaWxlLmhhc0NsYXNzKCdzZWxlY3RlZCcpKSB7XG5cdFx0XHRmaWxlLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRmaWxlc1NlY3Rpb24uZmluZCgnLmZpbGUnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHRcdGZpbGUuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdC8vQ2hlY2sgaWYgdXNlciBob2xkIFNoaWZ0IEtleVxuXHRcdGlmIChlLnNoaWZ0S2V5KSB7XG5cdFx0XHRpZiAoZmlsZS5oYXNDbGFzcygnc2VsZWN0ZWQnKSkge1xuXHRcdFx0XHRmaWxlLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmIChzZWxlY3RlZEZpbGVzKSB7XG5cdFx0XHRcdFx0dmFyIGZpbGVJbmRleCA9IGZpbGUuaW5kZXgoJy5maWxlJyksXG5cdFx0XHRcdFx0XHRmaWxlc1RvQmVTZWxlY3QgPSBmaWxlcy5zbGljZShsYXN0U2VsZWN0ZWQsIGZpbGVJbmRleCArIDEpO1xuXG5cdFx0XHRcdFx0aWYgKGxhc3RTZWxlY3RlZCA+IGZpbGVJbmRleCkge1xuXHRcdFx0XHRcdFx0ZmlsZXNUb0JlU2VsZWN0ID0gZmlsZXMuc2xpY2UoZmlsZUluZGV4LCBsYXN0U2VsZWN0ZWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmaWxlc1RvQmVTZWxlY3QuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHRcdFx0ZmlsZXNUb0JlU2VsZWN0LnJlbW92ZUNsYXNzKCdpcy1wcmVzZWxlY3RlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGZpbGUudG9nZ2xlQ2xhc3MoJ3NlbGVjdGVkIGlzLXByZXNlbGVjdGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRmaWxlLnRvZ2dsZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdH1cblx0XHRsYXN0U2VsZWN0ZWQgPSBmaWxlLmluZGV4KCk7XG5cdFx0bm9ybWFsaXplU2VsZWN0ZWlvbigpO1xuXHR9XG59XG5mdW5jdGlvbiBub3JtYWxpemVTZWxlY3RlaW9uKCkge1xuXHR2YXIgYnVsa0RlbGV0ZUJ1dHRvbiA9ICQoJyNidWxrUmVtb3ZlJyksXG5cdFx0YnVsa0VkaXRCdXR0b24gPSAkKCcjYnVsa0VkaXQnKSxcblx0XHRtdWx0aUVkaXRCdXR0b24gPSAkKCcjbXVsdGlFZGl0JyksXG5cdFx0bW9yZUFjdGlvbnNCdXR0b24gPSAkKCcjbW9yZUFjdGlvbnMnKSxcblxuXHRcdHNlbGVjdEFsbEJ1dHRvbiA9ICQoJyNzZWxlY3RBbGwnKSxcblx0XHRzZWxlY3RBbGxMYWJlbCA9ICQoJyNzZWxlY3RBbGxMYWJlbCcpLFxuXG5cdFx0ZGVzZWxlY3RBbGxCdXR0b24gPSAkKCcjZGVzZWxlY3RBbGwnKSxcblx0XHRkZXNlbGVjdEFsbExhYmVsID0gJCgnI2Rlc2VsZWN0QWxsTGFiZWwnKSxcblxuXHRcdGRlbGV0ZUJ1dHRvbnMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUgLmZpbGVfX2RlbGV0ZScpLFxuXHRcdGVkaXRCdXR0b25zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlIC5idXR0b24nKS5ub3QoJy5jLUZpbGUtY292ZXJUb2dsZScpLFxuXHRcdGFycmFuZ2VtZW50cyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZSAuZmlsZV9fYXJyYWdlbWVudCcpLFxuXHRcdGFycmFuZ2VtZW50SW5wdXRzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlIC5maWxlX19hcnJhZ2VtZW50JykuZmluZCgnaW5wdXQnKSxcblx0XHRzZXRDb3ZlckJ1dHRvbnMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUgYnV0dG9uLmMtRmlsZS1jb3ZlclRvZ2xlJyksXG5cblx0XHRzZWxlY3RlZERlbGV0ZUJ1dHRvbiA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCAuZmlsZV9fZGVsZXRlJyksXG5cdFx0c2VsZWN0ZWRFZGl0QnV0dG9uID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkIC5idXR0b24nKSxcblx0XHRzZWxlY3RlZEFycmFuZ2VtZW50ID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkIC5maWxlX19hcnJhZ2VtZW50JyksXG5cdFx0c2VsZWN0ZWRBcnJhbmdlbWVudElucHV0ID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkIC5maWxlX19hcnJhZ2VtZW50JykuZmluZCgnaW5wdXQnKSxcblx0XHRzZWxlY3RlZFNldENvdmVyQnV0dG9ucyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCBidXR0b24uYy1GaWxlLWNvdmVyVG9nbGUnKSxcblxuXHRcdG51bWJlck9mRmlsZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUnKS5sZW5ndGgsXG5cdFx0bnVtYmVyT2ZTZWxlY3RlZEZpbGVzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkJykubGVuZ3RoLFxuXHRcdG51bWJlck9mU2VsZWN0ZWRJbWFnZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuanMtaW1nRmlsZVR5cGUuc2VsZWN0ZWQnKS5sZW5ndGgsXG5cdFx0bnVtYmVyT2ZTZWxlY3RlZFZpZGVvcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5qcy12aWRlb0ZpbGVUeXBlLnNlbGVjdGVkJykubGVuZ3RoO1xuXG5cdFx0dW5zZWxlY3RlZEZpbGVzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlJykubm90KCcuc2VsZWN0ZWQnKTtcblxuXHQvL05vIHNlbGVjdGVkIGZpbGVzXG5cdGlmIChudW1iZXJPZlNlbGVjdGVkRmlsZXMgPT09IDApIHtcblx0XHRzZWxlY3RBbGxCdXR0b24ucmVtb3ZlQ2xhc3MoJ2FsbCBkaXNhYmxlZCcpLmFkZENsYXNzKCdlbXB0eScpO1xuXHRcdHNlbGVjdEFsbExhYmVsLnRleHQoJ1NlbGVjdCBBbGwnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblxuXHRcdGRlc2VsZWN0QWxsQnV0dG9uLnJlbW92ZUNsYXNzKCdpcy1hbGwnKS5hZGRDbGFzcygnaXMtZW1wdHkgZGlzYWJsZWQnKTtcblx0XHRkZXNlbGVjdEFsbExhYmVsLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXG5cdFx0YnVsa0RlbGV0ZUJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdGJ1bGtFZGl0QnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0YnVsa0VkaXRCdXR0b24uZmluZCgnLmJ1dHRvbl9fd2FybmluZycpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcblx0XHRtdWx0aUVkaXRCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRtb3JlQWN0aW9uc0J1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXG5cdFx0ZWRpdEJ1dHRvbnMucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdGRlbGV0ZUJ1dHRvbnMucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdGFycmFuZ2VtZW50cy5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRhcnJhbmdlbWVudElucHV0cy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRzZXRDb3ZlckJ1dHRvbnMucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSkucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG5cblx0XHR1bnNlbGVjdGVkRmlsZXMucmVtb3ZlQ2xhc3MoJ2lzLXByZXNlbGVjdGVkJyk7XG5cblx0XHRpZiAoJCgnI2Fzc2V0cy1jb3VudCcpLmxlbmd0aCA+IDApIHtub3JtYWxpemVBc3NldHNDb3VudCgpO31cblxuXHRcdGlmIChudW1iZXJPZkZpbGVzID09PSAwKSB7XG5cdFx0XHRzZWxlY3RBbGxCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHRzZWxlY3RBbGxMYWJlbC5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblxuXHRcdFx0ZGVzZWxlY3RBbGxCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHRkZXNlbGVjdEFsbExhYmVsLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdH1cblx0fVxuXHQvL1NvbWUgZmlsZXMgYXJlIHNlbGVjdGVkXG5cdGVsc2UgaWYgKG51bWJlck9mU2VsZWN0ZWRGaWxlcyA+IDApIHtcblx0XHRzZWxlY3RBbGxCdXR0b24ucmVtb3ZlQ2xhc3MoJ2VtcHR5IGFsbCcpO1xuXHRcdHNlbGVjdEFsbExhYmVsLnRleHQoJ0Rlc2VsZWN0IEFsbCcpO1xuXG5cdFx0ZGVzZWxlY3RBbGxCdXR0b24ucmVtb3ZlQ2xhc3MoJ2lzLWVtcHR5IGlzLWFsbCBkaXNhYmxlZCcpO1xuXHRcdGRlc2VsZWN0QWxsTGFiZWwucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cblxuXHRcdGJ1bGtEZWxldGVCdXR0b24ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0YnVsa0VkaXRCdXR0b24ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0bXVsdGlFZGl0QnV0dG9uLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdG1vcmVBY3Rpb25zQnV0dG9uLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXG5cdFx0ZWRpdEJ1dHRvbnMuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdGRlbGV0ZUJ1dHRvbnMuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdGFycmFuZ2VtZW50cy5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRhcnJhbmdlbWVudElucHV0cy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdHNldENvdmVyQnV0dG9ucy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuXG5cdFx0dW5zZWxlY3RlZEZpbGVzLmFkZENsYXNzKCdpcy1wcmVzZWxlY3RlZCcpO1xuXG5cdFx0aWYgKCQoJyNhc3NldHMtY291bnQnKS5sZW5ndGggPiAwKSB7XG5cdFx0XHQkKCcjYXNzZXRzLWNvdW50JykudGV4dChudW1iZXJPZlNlbGVjdGVkRmlsZXMudG9TdHJpbmcoKSArICcgb2YgJyArIGdhbGxlcnlPYmplY3RzLmxlbmd0aCArICcgc2VsZWN0ZWQnKTtcblx0XHR9XG5cblx0XHRpZiAobnVtYmVyT2ZTZWxlY3RlZFZpZGVvcyAmJiBudW1iZXJPZlNlbGVjdGVkSW1hZ2VzKSB7XG5cdFx0XHRidWxrRWRpdEJ1dHRvbi5maW5kKCcuYnV0dG9uX193YXJuaW5nJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHRcdFx0bXVsdGlFZGl0QnV0dG9uLmZpbmQoJy5idXR0b25fX3dhcm5pbmcnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJ1bGtFZGl0QnV0dG9uLmZpbmQoJy5idXR0b25fX3dhcm5pbmcnKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG5cdFx0XHRtdWx0aUVkaXRCdXR0b24uZmluZCgnLmJ1dHRvbl9fd2FybmluZycpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcblx0XHR9XG5cblx0XHQvL09ubHkgb25lIGZpbGUgc2VsZWN0ZWRcblx0XHRpZiAobnVtYmVyT2ZTZWxlY3RlZEZpbGVzID09PSAxKSB7XG5cdFx0XHRidWxrRWRpdEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdFx0bXVsdGlFZGl0QnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0XHQvL21vcmVBY3Rpb25zQnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cblx0XHRcdHNlbGVjdGVkRWRpdEJ1dHRvbi5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHRzZWxlY3RlZERlbGV0ZUJ1dHRvbi5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHRzZWxlY3RlZEFycmFuZ2VtZW50LnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0c2VsZWN0ZWRBcnJhbmdlbWVudElucHV0LnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdFx0c2VsZWN0ZWRTZXRDb3ZlckJ1dHRvbnMucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSkucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG5cdFx0fVxuXHRcdC8vQWxsIGZpbGVzIGFyZSBzZWxlY3RlZFxuXHRcdGlmIChudW1iZXJPZlNlbGVjdGVkRmlsZXMgPT09IG51bWJlck9mRmlsZXMpIHtcblx0XHRcdHNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnZW1wdHknKS5hZGRDbGFzcygnYWxsJyk7XG5cdFx0XHRkZXNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnaXMtZW1wdHknKS5hZGRDbGFzcygnaXMtYWxsJyk7XG5cdFx0fVxuXHR9XG59XG5mdW5jdGlvbiBzZWxlY3RBbGwoKSB7XG5cdCQoJy5qcy1jb250ZW50IC5maWxlJykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdG5vcm1hbGl6ZVNlbGVjdGVpb24oKTtcbn1cbmZ1bmN0aW9uIGRlc2VsZWN0QWxsKCkge1xuXHQkKCcuanMtY29udGVudCAuZmlsZS5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRub3JtYWxpemVTZWxlY3RlaW9uKCk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUFzc2V0c0NvdW50KCkge1xuXHRpZiAoZ2FsbGVyeU9iamVjdHMubGVuZ3RoKSB7XG5cdFx0JCgnI2Fzc2V0cy1jb3VudCcpLnRleHQoZ2FsbGVyeU9iamVjdHMubGVuZ3RoICsgJyBhc3NldHMnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG5cdH0gZWxzZSB7XG5cdFx0JCgnI2Fzc2V0cy1jb3VudCcpLnRleHQoJycpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcblx0fVxufVxuXG4vL05vdGlmaWNhdGlvbnNcbmZ1bmN0aW9uIHNob3dOb3RpZmljYXRpb24odGV4dCwgdG9wKSB7XG4gICAgdmFyIG5vdGlmaWNhdGlvbiA9ICQoJy5ub3RpZmljYXRpb24nKSxcbiAgICAgICAgbm90aWZpY2F0aW9uVGV4dCA9ICQoJy5ub3RpZmljYXRpb25fX3RleHQnKTtcblxuICAgIGlmIChub3RpZmljYXRpb24ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG5vdGlmaWNhdGlvbiA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ25vdGlmaWNhdGlvbicpO1xuICAgICAgICBub3RpZmljYXRpb25UZXh0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbm90aWZpY2F0aW9uX190ZXh0Jyk7XG4gICAgICAgIG5vdGlmaWNhdGlvbi5hcHBlbmQobm90aWZpY2F0aW9uVGV4dCk7XG4gICAgfVxuXG4gICAgaWYgKCQoJy5tb2RhbCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKCEkKCcubW9kYWwgLnByZXZpZXcnKS5oYXNDbGFzcygnaGlkZGVuJykpIHtcbiAgICAgICAgICAgICQoJy5tb2RhbCAucHJldmlldycpLmFwcGVuZChub3RpZmljYXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnLm1vZGFsJykuYXBwZW5kKG5vdGlmaWNhdGlvbik7XG4gICAgICAgIH1cblxuICAgIH0gZWxzZSBpZigkKCcuY3QnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICQoJy5jdCcpLmFwcGVuZChub3RpZmljYXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQobm90aWZpY2F0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAodG9wKSB7bm90aWZpY2F0aW9uLmNzcygndG9wJywgdG9wKTt9XG4gICAgbm90aWZpY2F0aW9uVGV4dC50ZXh0KHRleHQpO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBub3RpZmljYXRpb24ucmVtb3ZlKCk7XG4gICAgfSwgNDAwMCk7XG59XG5cbi8vRmlsZSBmdW5jdGlvbnNcbnZhciBnYWxsZXJ5Q2FwdGlvbnMgPSB7fTtcblxuZnVuY3Rpb24gaGFuZGxlQ2FwdGlvbkVkaXQoZSkge1xuICAgIHZhciBmaWxlRWxlbWVudCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJyksXG4gICAgICAgIGZpbGVJZCA9IGZpbGVFbGVtZW50LmZpbmQoJy5maWxlX19pZCcpLnRleHQoKSxcbiAgICAgICAgdG9nZ2xlID0gZmlsZUVsZW1lbnQuZmluZCgnLmZpbGVfX2NhcHRpb24tdG9nZ2xlIC50b2dnbGUnKSxcbiAgICAgICAgZmlsZSA9IGdhbGxlcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG4gICAgICAgICAgICByZXR1cm4gZi5maWxlRGF0YS5pZCA9PT0gZmlsZUlkO1xuICAgICAgICB9KVswXSxcblxuICAgICAgICB0b2dnbGVDaGVja2VkID0gJChlLnRhcmdldCkudmFsKCkgPT09IGZpbGUuZmlsZURhdGEuY2FwdGlvbiAmJiBmaWxlLmZpbGVEYXRhLmNhcHRpb247IC8vSWYgdGV4dGZpZWxkIGVxdWFscyB0aGUgZmlsZSBjYXB0aW9uIGFuZCBmaWxlIGNhcHRpb24gbm90IGVtcHR5XG5cbiAgICAvL1NhdmUgY2FwdGlvbiB0byBnYWxsZXJ5Q2FwdGlvbnNcbiAgICBmaWxlLmNhcHRpb24gPSAkKGUudGFyZ2V0KS52YWwoKTtcblxuICAgIHRvZ2dsZS5wcm9wKCdjaGVja2VkJywgdG9nZ2xlQ2hlY2tlZCk7XG4gICAgY2xvc2VUb29sdGlwKCk7XG59XG5mdW5jdGlvbiBoYW5kbGVDYXB0aW9uVG9nZ2xlQ2xpY2soZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdmFyIGZpbGUgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpLFxuICAgICAgICBmaWxlSWQgPSBmaWxlLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKSxcbiAgICAgICAgdGV4dGFyZWEgPSBmaWxlLmZpbmQoJy5maWxlX19jYXB0aW9uLXRleHRhcmVhJyksXG4gICAgICAgIG9yaWdpbmFsRmlsZSA9IGZpbGVCeUlkKGZpbGVJZCwgZ2FsbGVyeU9iamVjdHMpO1xuXG4gICAgaWYgKCQoZS50YXJnZXQpLnByb3AoJ2NoZWNrZWQnKSkge1xuICAgICAgICB0ZXh0YXJlYS52YWwob3JpZ2luYWxGaWxlLmZpbGVEYXRhLmNhcHRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHRhcmVhLmZvY3VzKCk7XG4gICAgfVxufVxuZnVuY3Rpb24gaGFuZGxlQ2FwdGlvblN0YXJ0RWRpdGluZyhlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB2YXIgdG9vbHRpcFRleHQgPSAnVGhpcyBjYXB0aW9uIHdpbGwgb25seSBhcHBseSB0byB5b3VyIGdhbGxlcnkgYW5kIG5vdCB0byB0aGUgaW1hZ2UgYXNzZXQuJztcbiAgICBpZiAoIXdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9vbHRpcCcpKSB7XG4gICAgICAgIGNyZWF0ZVRvb2x0aXAoJChlLnRhcmdldCksIHRvb2x0aXBUZXh0KTtcbiAgICB9XG59XG4vLyBDaGFuZ2UgZWxlbWVudCBpbmRleGVzIHRvIGFuIGFjdHVhbCBvbmVzXG5mdW5jdGlvbiBub3JtYWxpemVJbmRleCgpIHtcbiAgICB2YXIgZmlsZXMgPSAkKCcuanMtZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlJyk7XG5cbiAgICBmaWxlcy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAkKGVsKS5maW5kKCcuZmlsZV9fYXJhZ2VtZW50LWlucHV0JykudGV4dChpbmRleCArIDEpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVJbmRleEZpZWxkQ2hhbmdlKGUpIHtcbiAgICB2YXIgbGVuZ3RoID0gJCgnLmpzLWZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZScpLmxlbmd0aCxcbiAgICAgICAgaW5kZXggPSBwYXJzZUludCgkKGUudGFyZ2V0KS52YWwoKSkgLSAxLFxuICAgICAgICBmaWxlID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKTtcblxuICAgIGlmIChpbmRleCArIDEgPj0gbGVuZ3RoKSB7XG4gICAgICAgIHB1dEJvdHRvbShmaWxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmaWxlLmRldGFjaCgpLmluc2VydEJlZm9yZSgkKCcuanMtZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlJykuc2xpY2UoaW5kZXgsIGluZGV4KzEpKTtcblxuICAgIH1cbiAgICBub3JtYWxpemVJbmRleCgpO1xuICAgIC8vdXBkYXRlR2FsbGVyeShpbmRleCk7XG59XG5cbmZ1bmN0aW9uIHB1dEJvdHRvbShmaWxlKSB7XG4gICAgZmlsZS5kZXRhY2goKS5pbnNlcnRBZnRlcigkKCcuanMtZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlJykubGFzdCgpKTtcbiAgICBub3JtYWxpemVJbmRleCgpO1xuICAgIC8vdXBkYXRlR2FsbGVyeShnYWxsZXJ5T2JqZWN0cy5sZW5ndGgpO1xufVxuZnVuY3Rpb24gcHV0VG9wKGZpbGUpIHtcbiAgICBmaWxlLmRldGFjaCgpLmluc2VydEJlZm9yZSgkKCcuanMtZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlJykuZmlyc3QoKSk7XG4gICAgbm9ybWFsaXplSW5kZXgoKTtcbiAgICAvL3VwZGF0ZUdhbGxlcnkoMCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNlbmRUb1RvcENsaWNrKGUpIHtcbiAgICB2YXIgZmlsZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKTtcbiAgICBpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBwdXRUb3AoZmlsZXMpO1xuICAgIH1cbiAgICBwdXRUb3AoJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKSk7XG4gICAgY2xvc2VNZW51KCQoZS50YXJnZXQpLnBhcmVudHMoJ3NlbGVjdF9fbWVudScpKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZVNlbmRUb0JvdHRvbUNsaWNrKGUpIHtcbiAgICB2YXIgZmlsZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKTtcbiAgICBpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBwdXRCb3R0b20oZmlsZXMpO1xuICAgIH1cbiAgICBwdXRCb3R0b20oJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKSk7XG4gICAgY2xvc2VNZW51KCQoZS50YXJnZXQpLnBhcmVudHMoJ3NlbGVjdF9fbWVudScpKTtcbn1cbmZ1bmN0aW9uIGxvYWRGaWxlKGZpbGUpIHtcblx0dmFyIGZpbGVEYXRhID0gZmlsZS5maWxlRGF0YTtcblxuXHRzd2l0Y2ggKGZpbGVEYXRhLnR5cGUpIHtcblx0XHRjYXNlICdpbWFnZSc6XG5cblx0XHQvL0hpZGUgdmlkZW8gcmVsYXRlZCBlbGVtZW50c1xuXHRcdCQoJyN2aWRlb1BsYXknKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0JCgnI3ZpZGVvTWV0YWRhdGEnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cblx0XHQvL1Nob3cgYWxsIGltYWdlIHJlbGF0ZWQgZWxlbWVudHNcblx0XHQkKCcjcHJldmlld0NvbnRyb2xzJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdCQoJyNpbWFnZU1ldGFkYXRhJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdCQoJyNmb2NhbFBvaW50JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0aWYgKCFmaWxlLmJ1bGtFZGl0KSB7XG5cdFx0XHQkKCcjcHJldmlld0ltZycpLmF0dHIoJ3NyYycsIGZpbGVEYXRhLnVybCk7XG5cdFx0XHQkKCcucHIgLnB1cnBvc2UtaW1nJykuY3NzKFwiYmFja2dyb3VuZC1pbWFnZVwiLCAndXJsKCcgKyBmaWxlRGF0YS51cmwgKyAnKScpO1xuXHRcdFx0YWRqdXN0Rm9jYWxQb2ludChmaWxlRGF0YS5mb2NhbFBvaW50KTtcblx0XHR9XG5cblx0XHQvL3NldCBUaXRsZVxuXHRcdGFkanVzdFRpdGxlKGZpbGVEYXRhLnRpdGxlKTtcblx0XHRhZGp1c3RDYXB0aW9uKGZpbGVEYXRhLmNhcHRpb24pO1xuXHRcdGFkanVzdERlc2NyaXB0aW9uKGZpbGVEYXRhLmRlc2NyaXB0aW9uKTtcblx0XHRhZGp1c3RSZXNvbHV0aW9uKGZpbGVEYXRhLmhpZ2hSZXNvbHV0aW9uKTtcblx0XHRhZGp1c3RBbHRUZXh0KGZpbGVEYXRhLmFsdFRleHQpO1xuXG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlICd2aWRlbyc6XG5cblx0XHQvL0hpZGUgYWxsIGltYWdlIHJlbGF0ZWQgZWxlbWVudHNcblx0XHQkKCcjcHJldmlld0NvbnRyb2xzJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdCQoJyNpbWFnZU1ldGFkYXRhJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdCQoJyNmb2NhbFBvaW50JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0Ly9TaG93IHZpZGVvIHJlbGF0ZWQgZWxlbWVudHNcblx0XHQkKCcjdmlkZW9QbGF5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdCQoJyN2aWRlb01ldGFkYXRhJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0aWYgKGZpbGUuYnVsa0VkaXQpIHtcblx0XHRcdCQoJyNmaWVsRWRpdC12aWRlb01ldGFkYXRhJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKCcjZmllbEVkaXQtdmlkZW9NZXRhZGF0YScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblxuXHRcdFx0JCgnI3ByZXZpZXdJbWcnKS5hdHRyKCdzcmMnLCBmaWxlRGF0YS51cmwpO1xuXHRcdFx0JCgnI3ZpZGVvVGl0bGUnKS50ZXh0KGZpbGVEYXRhLnRpdGxlKTtcblx0XHRcdCQoJyN2aWRlb0Rlc2NyaXB0aW9uJykudGV4dChmaWxlRGF0YS5kZXNjcmlwdGlvbik7XG5cdFx0XHQkKCcjdmlkZW9BdXRob3InKS50ZXh0KGZpbGVEYXRhLmF1dGhvcik7XG5cdFx0XHQkKCcjdmlkZW9HdWlkJykudGV4dChmaWxlRGF0YS5ndWlkKTtcblx0XHRcdCQoJyN2aWRlb0tleXdvcmRzJykudGV4dChmaWxlRGF0YS5rZXl3b3Jkcyk7XG5cdFx0fVxuXG5cdFx0YnJlYWs7XG5cdH1cbn1cblxuLy9GdW5jdGlvbiB0byBzZXQgVGl0bGUgdG8gdGhlIHRpdGxlIGZpZWxkIG9yLCBzYXZlIHRpdGxlIGlmIHRpdGxlIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBhZGp1c3RUaXRsZSh0aXRsZSkge1xuXHQkKCcjdGl0bGUnKS52YWwodGl0bGUpLmNoYW5nZSgpO1xuXHR2YXIgZXZlbnQgPSBuZXcgVUlFdmVudCgnY2hhbmdlJyk7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZScpLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgVGl0bGUgdG8gdGhlIHRpdGxlIGZpZWxkIG9yLCBzYXZlIHRpdGxlIGlmIHRpdGxlIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlVGl0bGUoZSkge1xuXHR2YXIgY3VycmVudEltYWdlID0gJCgnLmltYWdlLmltYWdlX3N0eWxlX211bHRpIC5maWxlX19pZFtkYXRhLWlkPVwiJyArIGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmlkICsgJ1wiXScpLnBhcmVudHMoJy5pbWFnZScpO1xuXG5cdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLnRpdGxlID0gJCgnI3RpdGxlJykudmFsKCk7XG5cblx0aWYgKCQoJyN0aXRsZScpLnZhbCgpID09PSAnJykge1xuXHRcdGN1cnJlbnRJbWFnZS5hZGRDbGFzcygnaGFzLWVtcHR5UmVxdWlyZWRGaWVsZCcpO1xuXHR9IGVsc2Uge1xuXHRcdGN1cnJlbnRJbWFnZS5yZW1vdmVDbGFzcygnaGFzLWVtcHR5UmVxdWlyZWRGaWVsZCcpO1xuXHR9XG5cblx0ZGF0YUNoYW5nZWQgPSB0cnVlO1xuXHRpZiAoZWRpdGVkRmlsZURhdGEuYnVsa0VkaXQpIHtcblx0XHRlZGl0ZWRGaWxlc0RhdGEuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0XHRmLmZpbGVEYXRhLnRpdGxlID0gJCgnI3RpdGxlJykudmFsKCk7XG5cdFx0fSk7XG5cdH1cbn1cbi8vRnVuY3Rpb24gdG8gc2V0IENhcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBhZGp1c3RDYXB0aW9uKGNhcHRpb24pIHtcblx0JCgnI2NhcHRpb24nKS52YWwoY2FwdGlvbikuY2hhbmdlKCk7XG5cdHZhciBldmVudCA9IG5ldyBVSUV2ZW50KCdjaGFuZ2UnKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcHRpb24nKS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cbi8vRnVuY3Rpb24gdG8gc2V0IERlc2NyaXB0aW9uIHRvIHRoZSBjYXB0aW9uIGZpZWxkIG9yLCBzYXZlIGNhcHRpb24gaWYgY2FwdGlvbiBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gc2F2ZUNhcHRpb24oKSB7XG5cdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmNhcHRpb24gPSAkKCcjY2FwdGlvbicpLnZhbCgpO1xuXHRkYXRhQ2hhbmdlZCA9IHRydWU7XG5cdGlmIChlZGl0ZWRGaWxlRGF0YS5idWxrRWRpdCkge1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdGYuZmlsZURhdGEuY2FwdGlvbiA9ICQoJyNjYXB0aW9uJykudmFsKCk7XG5cdFx0fSk7XG5cdH1cbn1cbmZ1bmN0aW9uIGFkanVzdERlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKSB7XG5cdCQoJyNkZXNjcmlwdGlvbicpLnZhbChkZXNjcmlwdGlvbikuY2hhbmdlKCk7XG5cdHZhciBldmVudCA9IG5ldyBVSUV2ZW50KCdjaGFuZ2UnKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2NyaXB0aW9uJykuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBEZXNjcmlwdGlvbiB0byB0aGUgY2FwdGlvbiBmaWVsZCBvciwgc2F2ZSBjYXB0aW9uIGlmIGNhcHRpb24gYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIHNhdmVEZXNjcmlwdGlvbigpIHtcblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuZGVzY3JpcHRpb24gPSAkKCcjZGVzY3JpcHRpb24nKS52YWwoKTtcblx0ZGF0YUNoYW5nZWQgPSB0cnVlO1xuXHRpZiAoZWRpdGVkRmlsZURhdGEuYnVsa0VkaXQpIHtcblx0XHRlZGl0ZWRGaWxlc0RhdGEuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0XHRmLmZpbGVEYXRhLmRlc2NyaXB0aW9uID0gJCgnI2Rlc2NyaXB0aW9uJykudmFsKCk7XG5cdFx0fSk7XG5cdH1cbn1cbmZ1bmN0aW9uIGFkanVzdFJlc29sdXRpb24ocmVzb2x1dGlvbikge1xuXHQkKCcjcmVzb2x1dGlvbicpLnByb3AoJ2NoZWNrZWQnLCByZXNvbHV0aW9uKTtcbn1cbi8vRnVuY3Rpb24gdG8gc2V0IERlc2NyaXB0aW9uIHRvIHRoZSBjYXB0aW9uIGZpZWxkIG9yLCBzYXZlIGNhcHRpb24gaWYgY2FwdGlvbiBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gc2F2ZVJlc29sdXRpb24oKSB7XG5cdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmhpZ2hSZXNvbHV0aW9uID0gJCgnI3Jlc29sdXRpb24nKS5wcm9wKCdjaGVja2VkJyk7XG5cdGRhdGFDaGFuZ2VkID0gdHJ1ZTtcblx0aWYgKGVkaXRlZEZpbGVEYXRhLmJ1bGtFZGl0KSB7XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdFx0Zi5maWxlRGF0YS5oaWdoUmVzb2x1dGlvbiA9ICQoJyNyZXNvbHV0aW9uJykucHJvcCgnY2hlY2tlZCcpO1xuXHRcdH0pO1xuXHR9XG59XG5mdW5jdGlvbiBhZGp1c3RBbHRUZXh0KGFsdFRleHQpIHtcblx0JCgnI2FsdFRleHQnKS52YWwoYWx0VGV4dCkuY2hhbmdlKCk7XG5cdHZhciBldmVudCA9IG5ldyBVSUV2ZW50KCdjaGFuZ2UnKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FsdFRleHQnKS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cbi8vRnVuY3Rpb24gdG8gc2V0IERlc2NyaXB0aW9uIHRvIHRoZSBjYXB0aW9uIGZpZWxkIG9yLCBzYXZlIGNhcHRpb24gaWYgY2FwdGlvbiBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gc2F2ZUFsdFRleHQoKSB7XG5cdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmFsdFRleHQgPSAkKCcjYWx0VGV4dCcpLnZhbCgpO1xuXHRkYXRhQ2hhbmdlZCA9IHRydWU7XG5cdGlmIChlZGl0ZWRGaWxlRGF0YS5idWxrRWRpdCkge1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdGYuZmlsZURhdGEuYWx0VGV4dCA9ICQoJyNhbHRUZXh0JykudmFsKCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuLy9GdW5jdGlvbiB0byBzZXQgRm9jYWxQb2ludCBjb29yZGluYXRlcyBvciwgc2F2ZSBmb2NhbCBwaW50IGlmIGZvY2FscG9pbnQgYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIGFkanVzdEZvY2FsUG9pbnQoZm9jYWxQb2ludCkge1xuXHR2YXIgZnAgPSAkKCcjZm9jYWxQb2ludCcpO1xuXHR2YXIgaW1nID0gJCgnI3ByZXZpZXdJbWcnKTtcblx0aWYgKGZvY2FsUG9pbnQpIHtcblx0XHR2YXIgbGVmdCA9IGZvY2FsUG9pbnQubGVmdCAqIGltZy53aWR0aCgpIC0gZnAud2lkdGgoKS8yLFxuXHRcdHRvcCA9IGZvY2FsUG9pbnQudG9wICogaW1nLmhlaWdodCgpIC0gZnAuaGVpZ2h0KCkvMjtcblxuXHRcdGxlZnQgPSBsZWZ0ID09PSAwID8gJzUwJScgOiBsZWZ0O1xuXHRcdHRvcCA9IHRvcCA9PT0gMCA/ICc1MCUnIDogdG9wO1xuXHRcdGZwLmNzcygnbGVmdCcsIGxlZnQpLmNzcygndG9wJywgdG9wKTtcblxuXHR9IGVsc2Uge1xuXHRcdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmZvY2FsUG9pbnQgPSB7XG5cdFx0XHRsZWZ0OiAoKGZwLnBvc2l0aW9uKCkubGVmdCArIGZwLndpZHRoKCkvMikvaW1nLndpZHRoKCkpLFxuXHRcdFx0dG9wOiAoKGZwLnBvc2l0aW9uKCkudG9wICsgZnAuaGVpZ2h0KCkvMikvaW1nLmhlaWdodCgpKVxuXHRcdH07XG5cdH1cblx0ZnAuY3NzKCdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xuXG59XG5cbi8vRnVuY3Rpb24gdG8gc2V0IEZvY2FsUmVjdCBjb29yZGluYXRlcyBvciwgc2F2ZSBmb2NhbCBwaW50IGlmIGZvY2FscG9pbnQgYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIGFkanVzdEZvY2FsUmVjdChmb2NhbFBvaW50KSB7XG5cdHZhciBmciA9ICQoJyNmb2NhbFJlY3QnKTtcblx0dmFyIGltZyA9ICQoJ3ByZXZpZXdJbWcnKTtcblx0aWYgKGZvY2FsUG9pbnQpIHtcblx0XHR2YXIgbGVmdCA9IGZvY2FsUG9pbnQubGVmdCAqIGltZy53aWR0aCgpIC0gZnIud2lkdGgoKS8yLFxuXHRcdHRvcCA9IGZvY2FsUG9pbnQudG9wICogaW1nLmhlaWdodCgpIC0gZnIuaGVpZ2h0KCkvMjtcblxuXHRcdGxlZnQgPSBsZWZ0IDwgMCA/IDAgOiBsZWZ0ID4gaW1nLndpZHRoKCkgPyBpbWcud2lkdGgoKSAtIGZyLndpZHRoKCkvMiA6IGxlZnQ7XG5cdFx0dG9wID0gdG9wIDwgMCA/IDAgOiB0b3AgPiBpbWcuaGVpZ2h0KCkgPyBpbWcuaGVpZ2h0KCkgLSBmci5oZWlnaHQoKS8yIDogdG9wO1xuXG5cdFx0ZnIuY3NzKCdsZWZ0JywgbGVmdClcblx0XHQuY3NzKCd0b3AnLCB0b3ApO1xuXHR9IGVsc2Uge1xuXHRcdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmZvY2FsUG9pbnQgPSB7XG5cdFx0XHRsZWZ0OiAoKGZwLnBvc2l0aW9uKCkubGVmdCArIGZwLndpZHRoKCkvMikvaW1nLndpZHRoKCkpLFxuXHRcdFx0dG9wOiAoKGZwLnBvc2l0aW9uKCkudG9wICsgZnAuaGVpZ2h0KCkvMikvaW1nLmhlaWdodCgpKVxuXHRcdH07XG5cdH1cbn1cblxuXG5mdW5jdGlvbiBzaG93RmlsZXMoZmlsZXMpIHtcblx0ZGF0YUNoYW5nZWQgPSBmYWxzZTtcblx0c2Nyb2xsUG9zaXRpb24gPSAkKCdib2R5Jykuc2Nyb2xsVG9wKCk7XG5cdC8vU2hvdyBpbml0aWFsIGVkaXQgc2NyZWVuIGZvciBzaW5nbGUgaW1hZ2UuXG5cdCQoJy5wcicpLnJlbW92ZUNsYXNzKCdoaWRkZW4gdmlkZW8gYnVsaycpXG5cdC5hZGRDbGFzcygnbW9kYWwnKTtcblx0JCgnI3dyYXBwZXInKS5hZGRDbGFzcygnb3ZlcmZsb3cnKTtcblxuXHQvL1JlbW92ZSBhbGwgbXVsdGlwbGUgaW1hZ2VzIHN0eWxlIGF0dHJpYnV0ZXNcblx0JCgnLnByIC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ3ByZXZpZXdfc3R5bGVfbXVsdGkgaGlkZGVuJyk7XG5cdCQoJy5wciAuaXAnKS5yZW1vdmVDbGFzcygnaXBfc3R5bGVfbXVsdGknKTtcblx0JCgnI3NhdmVDaGFuZ2VzJykudGV4dCgnU2F2ZScpO1xuXHQvLyQoJyNpcF9fdGl0bGUnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdCQoJy5wciAuaW1hZ2VzJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHQkKCcjdGl0bGUnKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdCQoJyN0aXRsZScpLnBhcmVudCgpLmNoaWxkcmVuKCdsYWJlbCcpLmFkZENsYXNzKCdyZXF1aWVyZWQnKTtcblx0JCgnI3RpdGxlJykucHJvcCgncmVxdWlyZWQnLCB0cnVlKTtcblxuXHRmdW5jdGlvbiByZXNpemVJbWFnZVdyYXBwZXIoKSB7XG5cdFx0dmFyIGltYWdlc1dyYXBwZXJXaWR0aCA9ICQoJy5pbWFnZXNfX3dyYXBwZXInKS53aWR0aCgpO1xuXHRcdGltYWdlc1dpZHRoID0gd2luZG93LmlubmVyV2lkdGggPCA2MDAgPyAkKCcuaW1hZ2VzX19jb250YWluZXIgLmltYWdlJykubGVuZ3RoICogMTAwIDogJCgnLmltYWdlc19fY29udGFpbmVyIC5pbWFnZScpLmxlbmd0aCAqIDEyMDtcblx0XHRpZiAoaW1hZ2VzV3JhcHBlcldpZHRoID4gaW1hZ2VzV2lkdGgpIHtcblx0XHRcdCQoJy5pbWFnZXNfX3Njcm9sbC1sZWZ0LCAuaW1hZ2VzX19zY3JvbGwtcmlnaHQnKS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoJy5pbWFnZXNfX2NvbnRhaW5lcicpLmNzcygnd2lkdGgnLCBpbWFnZXNXaWR0aC50b1N0cmluZygpICsgJ3B4Jyk7XG5cdFx0XHQkKCcuaW1hZ2VzX19zY3JvbGwtbGVmdCwgLmltYWdlc19fc2Nyb2xsLXJpZ2h0JykuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoZmlsZXMubGVuZ3RoID4gMSkge1xuXHRcdHZhciBpbWdDb250YWluZXIgPSAkKCcucHIgLmltYWdlc19fY29udGFpbmVyJyk7XG5cdFx0aW1nQ29udGFpbmVyLmVtcHR5KCk7XG5cblx0XHQvL0FkZCBpbWFnZXMgcHJldmllcyB0byB0aGUgY29udGFpbmVyXG5cdFx0ZmlsZXMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0XHR2YXJcdGltYWdlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UgaW1hZ2Vfc3R5bGVfbXVsdGknKS5jbGljayhoYW5kbGVJbWFnZVN3aXRjaCksXG5cdFx0XHRyZXF1aXJlZE1hcmsgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZV9fcmVxdWlyZWQtbWFyaycpLFxuXHRcdFx0ZmlsZUluZGV4ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaGlkZGVuIGZpbGVfX2lkJykudGV4dChmLmZpbGVEYXRhLmlkKS5hdHRyKCdkYXRhLWlkJywgZi5maWxlRGF0YS5pZCk7XG5cdFx0XHRpbWFnZS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyBmLmZpbGVEYXRhLnVybCArICcpJykuYXBwZW5kKHJlcXVpcmVkTWFyaywgZmlsZUluZGV4KTtcblx0XHRcdGltZ0NvbnRhaW5lci5hcHBlbmQoaW1hZ2UpO1xuXHRcdH0pO1xuXG5cdFx0Ly9BZGQgYWN0aXZlIHN0YXRlIHRvIHRoZSBwcmV2aWV3IG9mIHRoZSBmaXJzdCBpbWFnZVxuXHRcdHZhciBmaXJzdEltYWdlID0gJCgnLmltYWdlc19fY29udGFpbmVyIC5pbWFnZScpLmZpcnN0KCk7XG5cdFx0Zmlyc3RJbWFnZS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cblx0XHQkKCcucHIgLmltYWdlcycpLmFkZENsYXNzKCdpbWFnZXNfc3R5bGVfbXVsdGknKS5yZW1vdmVDbGFzcygnaGlkZGVuIGltYWdlc19zdHlsZV9idWxrJyk7XG5cblx0XHQkKCcucHIgLnByZXZpZXcnKS5yZW1vdmVDbGFzcygnaGlkZGVuJykuYWRkQ2xhc3MoJ3ByZXZpZXdfc3R5bGVfbXVsdGknKTtcblx0XHQkKCcucHIgLmlwJykuYWRkQ2xhc3MoJ2lwX3N0eWxlX211bHRpJyk7XG5cblx0XHQvL0FkanVzdCBpbWFnZSBwcmV2aWV3cyBjb250YWluZXJcblx0XHQkKCcjaW1hZ2VzX193cmFwcGVyJykuc2Nyb2xsTGVmdCgwKTtcblx0XHQkKHdpbmRvdykucmVzaXplKHJlc2l6ZUltYWdlV3JhcHBlcik7XG5cdFx0cmVzaXplSW1hZ2VXcmFwcGVyKCk7XG5cblx0XHQvL0FkZCBhY3Rpb25zIHRvIHNjcm9sbCBidXR0b25zXG5cdFx0JCgnLmltYWdlc19fc2Nyb2xsLWxlZnQnKS51bmJpbmQoJ2NsaWNrJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdCQoJyNpbWFnZXNfX3dyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6ICctPTQ4MCcgfSwgNjAwKTtcblx0XHR9KTtcblx0XHQkKCcuaW1hZ2VzX19zY3JvbGwtcmlnaHQnKS51bmJpbmQoJ2NsaWNrJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdCQoJyNpbWFnZXNfX3dyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6ICcrPTQ4MCcgfSwgNjAwKTtcblx0XHR9KTtcblx0fVxuXHRoaWRlTG9hZGVyKCk7XG5cdHNldE1vZGFsS2V5Ym9hcmRBY3Rpb25zKHNhdmVJbWFnZUVkaXQsIGNhbmNlbEltYWdlRWRpdCk7XG5cbn1cbmZ1bmN0aW9uIGVkaXRGaWxlcyhmaWxlcykge1xuXHRlZGl0ZWRGaWxlc0RhdGEgPSBbXS5jb25jYXQoZmlsZXMpO1xuXG5cdGlmIChlZGl0ZWRGaWxlc0RhdGEubGVuZ3RoID4gMCkge1xuXHRcdGVkaXRlZEZpbGVEYXRhID0gZWRpdGVkRmlsZXNEYXRhWzBdO1xuXHRcdGxvYWRGaWxlKGVkaXRlZEZpbGVEYXRhKTtcblx0XHRzaG93RmlsZXMoZWRpdGVkRmlsZXNEYXRhKTtcblx0fVxufVxuXG5cbi8vQnVsayBFZGl0XG5mdW5jdGlvbiBidWxrRWRpdEZpbGVzKGZpbGVzLCB0eXBlKSB7XG5cdHZhciBjbG9uZWRHYWxsZXJ5T2JqZWN0cyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZ2FsbGVyeU9iamVjdHMpKTtcblx0dmFyIGZpbGVzVHlwZTtcblx0ZWRpdGVkRmlsZXNEYXRhID0gW107IC8vQ2xlYXIgZmlsZXMgZGF0YSB0aGF0IHBvc3NpYmx5IGNvdWxkIGJlIGhlcmVcblxuXHQvL09idGFpbiBmaWxlcyBkYXRhIGZvciBmaWxlcyB0aGF0IHNob3VsZCBiZSBlZGl0ZWRcblx0ZmlsZXMuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuXHRcdHZhciBmaWxlID0gY2xvbmVkR2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcblx0XHRcdHJldHVybiBmLmZpbGVEYXRhLmlkID09PSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG5cdFx0fSlbMF07XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLnB1c2goZmlsZSk7XG5cdH0pO1xuXG5cdGlmIChlZGl0ZWRGaWxlc0RhdGEubGVuZ3RoID4gMCkge1xuXHRcdHN3aXRjaCAoZWRpdGVkRmlsZXNEYXRhWzBdLmZpbGVEYXRhLnR5cGUpIHtcblx0XHRcdGNhc2UgJ2ltYWdlJzpcblx0XHRcdGVkaXRlZEZpbGVEYXRhID0ge1xuXHRcdFx0XHRmaWxlRGF0YToge1xuXHRcdFx0XHRcdHVybDogJycsXG5cdFx0XHRcdFx0Zm9jYWxQb2ludDoge1xuXHRcdFx0XHRcdFx0bGVmdDogMC41LFxuXHRcdFx0XHRcdFx0dG9wOiAwLjVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGlkOiAnJyxcblx0XHRcdFx0XHRjb2xvcjogJycsLy9maWxlSW1nQ29sb3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpmaWxlSW1nQ29sb3JzLmxlbmd0aCldLFxuXHRcdFx0XHRcdHRpdGxlOiAnJyxcblx0XHRcdFx0XHRjYXB0aW9uOiAnJyxcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjogJycsXG5cdFx0XHRcdFx0aGlnaFJlc29sdXRpb246IGZhbHNlLFxuXHRcdFx0XHRcdGNhdGVnb3JpZXM6ICcnLFxuXHRcdFx0XHRcdHRhZ3M6ICcnLFxuXHRcdFx0XHRcdGFsdFRleHQ6ICcnLFxuXHRcdFx0XHRcdGNyZWRpdDogJycsXG5cdFx0XHRcdFx0Y29weXJpZ2h0OiAnJyxcblx0XHRcdFx0XHRyZWZlcmVuY2U6IHtcblx0XHRcdFx0XHRcdHNlcmllczogJycsXG5cdFx0XHRcdFx0XHRzZWFzb246ICcnLFxuXHRcdFx0XHRcdFx0ZXBpc29kZTogJydcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHR5cGU6ICdpbWFnZSdcblx0XHRcdFx0fSxcblx0XHRcdFx0YnVsa0VkaXQ6IHRydWVcblx0XHRcdH07XG5cdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAndmlkZW8nOlxuXHRcdFx0ZWRpdGVkRmlsZURhdGEgPSB7XG5cdFx0XHRcdGZpbGVEYXRhOiB7XG5cdFx0XHRcdFx0dXJsOiAnJyxcblx0XHRcdFx0XHRwbGF5ZXI6ICcnLFxuXHRcdFx0XHRcdHR5cGU6ICd2aWRlbydcblx0XHRcdFx0fSxcblx0XHRcdFx0YnVsa0VkaXQ6IHRydWVcblx0XHRcdH07XG5cdFx0XHRicmVhaztcblxuXHRcdH1cblxuXHRcdGxvYWRGaWxlKGVkaXRlZEZpbGVEYXRhKTtcblx0XHRzaG93QnVsa0ZpbGVzKGVkaXRlZEZpbGVzRGF0YSk7XG5cblx0fVxufVxuZnVuY3Rpb24gc2hvd0J1bGtGaWxlcyhmaWxlcykge1xuXHRkYXRhQ2hhbmdlZCA9IGZhbHNlO1xuXHRzY3JvbGxQb3NpdGlvbiA9ICQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcblx0Ly9TaG93IGluaXRpYWwgZWRpdCBzY3JlZW4gZm9yIHNpbmdsZSBpbWFnZS5cblx0JCgnLnByJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbiB2aWRlbycpXG5cdC5hZGRDbGFzcygnbW9kYWwgYnVsaycpO1xuXHQkKCcjd3JhcHBlcicpLmFkZENsYXNzKCdvdmVyZmxvdycpO1xuXG5cdC8vUmVtb3ZlIGFsbCBtdWx0aXBsZSBpbWFnZXMgc3R5bGUgYXR0cmlidXRlc1xuXHQkKCcucHIgLnByZXZpZXcnKS5yZW1vdmVDbGFzcygncHJldmlld19zdHlsZV9tdWx0aSBoaWRkZW4nKTtcblx0JCgnLnByIC5pcCcpLnJlbW92ZUNsYXNzKCdpcF9zdHlsZV9tdWx0aScpO1xuXHQkKCcjc2F2ZUNoYW5nZXMnKS50ZXh0KCdTYXZlJyk7XG5cdCQoJyN0aXRsZScpLnBhcmVudCgpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0JCgnI3RpdGxlJykucmVtb3ZlUHJvcCgncmVxdWlyZWQnKTtcblx0JCgnI3RpdGxlJykucGFyZW50KCkuY2hpbGRyZW4oJ2xhYmVsJykucmVtb3ZlQ2xhc3MoJ3JlcXVpZXJlZCcpO1xuXG5cdHZhciBpbWdDb250YWluZXIgPSAkKCcucHIgLmltYWdlc19fY29udGFpbmVyJyk7XG5cdGltZ0NvbnRhaW5lci5lbXB0eSgpO1xuXG5cdC8vQWRkIGltYWdlcyBwcmV2aWVzIHRvIHRoZSBjb250YWluZXJcblx0ZmlsZXMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0dmFyXHRpbWFnZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlIGltYWdlX3N0eWxlX2J1bGsnKSxcblx0XHRmaWxlSW5kZXggPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdoaWRkZW4gZmlsZV9faWQnKS50ZXh0KGYuZmlsZURhdGEuaWQpO1xuXHRcdGltYWdlLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIGYuZmlsZURhdGEudXJsICsgJyknKS5hcHBlbmQoZmlsZUluZGV4KTtcblx0XHRpbWdDb250YWluZXIuYXBwZW5kKGltYWdlKTtcblx0fSk7XG5cblx0JCgnLnByIC5pbWFnZXMnKS5hZGRDbGFzcygnaW1hZ2VzX3N0eWxlX2J1bGsnKS5yZW1vdmVDbGFzcygnaGlkZGVuIGltYWdlc19zdHlsZV9tdWx0aScpO1xuXHQkKCcucHIgLnByZXZpZXcnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cblx0aGlkZUxvYWRlcigpO1xuXHRzZXRNb2RhbEtleWJvYXJkQWN0aW9ucyhzYXZlSW1hZ2VFZGl0LCBjYW5jZWxJbWFnZUVkaXQpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVCdWxrRWRpdEJ1dHRvbkNsaWNrKGUpIHtcblx0JChlLnRhcmdldCkuYmx1cigpO1xuXHR2YXIgZmlsZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKSxcblx0bnVtYmVyT2ZTZWxlY3RlZEltYWdlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5qcy1pbWdGaWxlVHlwZS5zZWxlY3RlZCcpLmxlbmd0aCxcblx0bnVtYmVyT2ZTZWxlY3RlZFZpZGVvcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5qcy12aWRlb0ZpbGVUeXBlLnNlbGVjdGVkJykubGVuZ3RoO1xuXG5cdGlmIChudW1iZXJPZlNlbGVjdGVkSW1hZ2VzICYmIG51bWJlck9mU2VsZWN0ZWRWaWRlb3MpIHtcblx0XHRuZXcgTW9kYWwoe1xuXHRcdFx0dGl0bGU6ICdZb3UgY2FuXFwndCBidWxrIGVkaXQgaW1hZ2VzIGFuZCB2aWRlb3MnLFxuXHRcdFx0dGV4dDogJ1lvdSBjYW5cXCd0IGJ1bGsgZWRpdCBpbWFnZXMgYW5kIHZpZGVvcyBhdCBvbmNlLiBQbGVhc2Ugc2VsZWN0IGZpbGVzIG9mIHRoZSBzYW1lIHR5cGUgYW5kIHRyeSBhZ2Fpbi4nLFxuXHRcdFx0Y29uZmlybVRleHQ6ICdPaycsXG5cdFx0XHRvbmx5Q29uZmlybTogdHJ1ZVxuXHRcdH0pO1xuXHR9XG5cdGVsc2Uge1xuXHRcdGlmIChudW1iZXJPZlNlbGVjdGVkVmlkZW9zKSB7XG5cdFx0XHRidWxrRWRpdEZpbGVzKGZpbGVzLCAndmlkZW9zJyk7XG5cdFx0fSBlbHNlIGlmKG51bWJlck9mU2VsZWN0ZWRJbWFnZXMpIHtcblx0XHRcdGJ1bGtFZGl0RmlsZXMoZmlsZXMsICdpbWFnZXMnKTtcblx0XHR9XG5cdH1cbn1cblxuLy9IZWxwIGZ1bmN0aW9uXG5mdW5jdGlvbiBmaWxlQnlJZChpZCwgZmlsZXMpIHtcblx0ZmlsZXNGaWx0ZXJlZCA9IGZpbGVzLmZpbHRlcihmdW5jdGlvbihmKSB7XG5cdFx0cmV0dXJuIGYuZmlsZURhdGEuaWQgPT09IGlkO1xuXHR9KTtcblx0cmV0dXJuIGZpbGVzRmlsdGVyZWRbMF07XG59XG5cbi8vU2F2ZSBmaWxlXG5mdW5jdGlvbiBzYXZlRmlsZShmaWxlcywgZmlsZSkge1xuXHRmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRpZiAoZi5maWxlRGF0YS5pZCA9PT0gZmlsZS5maWxlRGF0YS5pZCkge1xuXHRcdFx0ZiA9IGZpbGU7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gc3dpdGNoSW1hZ2UoaW1hZ2UpIHtcblx0JCgnLmltZy13cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2lzLXNsaWRpbmdMZWZ0IGlzLXNsaWRpbmdSaWdodCcpO1xuXHR2YXIgbmV3RmlsZUlkID0gaW1hZ2UuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpLFxuXHRuZXdGaWxlID0gZmlsZUJ5SWQobmV3RmlsZUlkLCBlZGl0ZWRGaWxlc0RhdGEpLFxuXHRuZXdJbmRleCA9IGltYWdlLmluZGV4KCksXG5cdGN1cnJlbnRJbWFnZSA9ICQoJy5pbWFnZS5pcy1hY3RpdmUnKSxcblx0Y3VycmVudEluZGV4ID0gY3VycmVudEltYWdlLmluZGV4KCksXG5cdGN1cnJlbnRGaWxlID0gZmlsZUJ5SWQoY3VycmVudEltYWdlLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKSwgZWRpdGVkRmlsZXNEYXRhKSxcblx0YmFja0ltYWdlID0gJCgnI3ByZXZpZXdJbWdCYWNrJyksXG5cdHByZXZpZXdJbWFnZSA9ICQoJyNwcmV2aWV3SW1nJyk7XG5cblx0c2F2ZUZpbGUoZWRpdGVkRmlsZXNEYXRhLCBlZGl0ZWRGaWxlRGF0YSk7XG5cdGVkaXRlZEZpbGVEYXRhID0gbmV3RmlsZTtcblx0bG9hZEZpbGUoZWRpdGVkRmlsZURhdGEpO1xuXG5cdC8qYmFja0ltYWdlLmFkZENsYXNzKCdpcy12aXNpYmxlJylcblx0LmF0dHIoJ3NyYycsIGN1cnJlbnRGaWxlLmZpbGVEYXRhLnVybClcblx0LmNzcygnd2lkdGgnLCBwcmV2aWV3SW1hZ2Uud2lkdGgoKSlcblx0LmNzcygnaGVpZ2h0JywgcHJldmlld0ltYWdlLmhlaWdodCgpKVxuXHQuY3NzKCdsZWZ0JywgcHJldmlld0ltYWdlLm9mZnNldCgpLmxlZnQpXG5cdC5jc3MoJ3RvcCcsIHByZXZpZXdJbWFnZS5vZmZzZXQoKS50b3ApO1xuXG5cdCovXG5cblx0Y3VycmVudEltYWdlLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0aW1hZ2UuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXG5cdGlmIChjdXJyZW50SW5kZXggPiBuZXdJbmRleCkge1xuXHRcdCQoJy5pbWctd3JhcHBlcicpLmFkZENsYXNzKCdpcy1zbGlkaW5nTGVmdCcpO1xuXHR9IGVsc2Uge1xuXHRcdCQoJy5pbWctd3JhcHBlcicpLmFkZENsYXNzKCdpcy1zbGlkaW5nUmlnaHQnKTtcblx0fVxuXG5cdHZhciBpbWFnZUNvbnRhaW5lciA9IGltYWdlLnBhcmVudHMoJy5pbWFnZXNfX2NvbnRhaW5lcicpLFxuXHRpbWFnZVdyYXBwZXIgPSBpbWFnZS5wYXJlbnRzKCcuaW1hZ2VzX193cmFwcGVyJyksXG5cdGltYWdlTGVmdEVuZCA9IGltYWdlQ29udGFpbmVyLnBvc2l0aW9uKCkubGVmdCArIGltYWdlLnBvc2l0aW9uKCkubGVmdCxcblx0aW1hZ2VSaWdodEVuZCA9IGltYWdlQ29udGFpbmVyLnBvc2l0aW9uKCkubGVmdCArIGltYWdlLnBvc2l0aW9uKCkubGVmdCArIGltYWdlLndpZHRoKCk7XG5cblx0aWYgKGltYWdlTGVmdEVuZCA8IDApIHtcblx0XHQkKCcjaW1hZ2VzX193cmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiBpbWFnZS5wb3NpdGlvbigpLmxlZnQgLSAzMH0sIDQwMCk7XG5cdH0gZWxzZSBpZiAoaW1hZ2VSaWdodEVuZCA+IGltYWdlV3JhcHBlci53aWR0aCgpKSB7XG5cdFx0JCgnI2ltYWdlc19fd3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogaW1hZ2UucG9zaXRpb24oKS5sZWZ0ICsgaW1hZ2Uud2lkdGgoKSAtIGltYWdlV3JhcHBlci53aWR0aCgpICsgNTB9LCA0MDApO1xuXHR9XG5cblx0Ly9hZGp1c3RSZWN0KCQoJy5wdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UtaW1nJykuZmlyc3QoKSk7XG5cdC8vJCgnI3B1cnBvc2VXcmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiAnMCcgfSwgODAwKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZUltYWdlU3dpdGNoKGUpIHtcblx0c3dpdGNoSW1hZ2UoJChlLnRhcmdldCkpO1xufVxuXG4vL0Z1bmN0aW9uIGZvciBoYW5kbGUgRWRpdCBCdXR0b24gY2xpY2tzXG5mdW5jdGlvbiBoYW5kbGVGaWxlZEVkaXRCdXR0b25DbGljayhlKSB7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdHZhciBmaWxlRWxlbWVudCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJyk7XG5cblx0dmFyIGZpbGUgPSBnYWxsZXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuXHRcdHJldHVybiBmLmZpbGVEYXRhLmlkID09PSAkKGZpbGVFbGVtZW50KS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG5cdH0pO1xuXG5cdGVkaXRGaWxlcyhmaWxlKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZU11bHRpRWRpdEJ1dHRvbkNsaWNrKGUpIHtcblx0JChlLnRhcmdldCkuYmx1cigpO1xuXHR2YXIgZmlsZXNFbGVtZW50cyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpLFxuXHRjbG9uZWRHYWxsZXJ5T2JqZWN0cyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZ2FsbGVyeU9iamVjdHMpKSxcblx0ZmlsZXMgPSBbXSxcblx0bnVtYmVyT2ZTZWxlY3RlZEltYWdlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5qcy1pbWdGaWxlVHlwZS5zZWxlY3RlZCcpLmxlbmd0aCxcblx0bnVtYmVyT2ZTZWxlY3RlZFZpZGVvcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5qcy12aWRlb0ZpbGVUeXBlLnNlbGVjdGVkJykubGVuZ3RoO1xuXG5cdGlmIChudW1iZXJPZlNlbGVjdGVkSW1hZ2VzICYmIG51bWJlck9mU2VsZWN0ZWRWaWRlb3MpIHtcblx0XHRuZXcgTW9kYWwoe1xuXHRcdFx0dGl0bGU6ICdZb3UgY2FuXFwndCBtdWx0aSBlZGl0IGltYWdlcyBhbmQgdmlkZW9zJyxcblx0XHRcdHRleHQ6ICdZb3UgY2FuXFwndCBtdWx0aSBlZGl0IGltYWdlcyBhbmQgdmlkZW9zIGF0IG9uY2UuIFBsZWFzZSBzZWxlY3QgZmlsZXMgb2YgdGhlIHNhbWUgdHlwZSBhbmQgdHJ5IGFnYWluLicsXG5cdFx0XHRjb25maXJtVGV4dDogJ09rJyxcblx0XHRcdG9ubHlDb25maXJtOiB0cnVlXG5cdFx0fSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly9PYnRhaW4gZmlsZXMgZGF0YSBmb3IgZmlsZXMgdGhhdCBzaG91bGQgYmUgZWRpdGVkXG5cdFx0ZmlsZXNFbGVtZW50cy5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG5cdFx0XHR2YXIgZmlsZSA9IFtdLmNvbmNhdChjbG9uZWRHYWxsZXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuXHRcdFx0XHRyZXR1cm4gZi5maWxlRGF0YS5pZCA9PT0gJChlbCkuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpO1xuXHRcdFx0fSkpWzBdO1xuXHRcdFx0ZmlsZXMucHVzaChmaWxlKTtcblx0XHR9KTtcblxuXHRcdGVkaXRGaWxlcyhmaWxlcyk7XG5cdH1cbn1cblxuXG5mdW5jdGlvbiBjYW5jZWxJbWFnZUVkaXQoKSB7XG5cdGlmIChkYXRhQ2hhbmdlZCkge1xuXHRcdG5ldyBNb2RhbCh7XG5cdFx0XHRkaWFsb2c6IHRydWUsXG5cdFx0XHR0aXRsZTogJ0NhbmNlbCBDaGFuZ2VzPycsXG5cdFx0XHR0ZXh0OiAnQW55IHVuc2F2ZWQgY2hhbmdlcyB5b3UgbWFkZSB3aWxsIGJlIGxvc3QuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBjYW5jZWw/Jyxcblx0XHRcdGNvbmZpcm1UZXh0OiAnQ2FuY2VsJyxcblx0XHRcdGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjbG9zZUVkaXRTY3JlZW4oKTtcblx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVzY0tleWRvd24pO1xuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcblx0XHRcdH0sXG5cdFx0XHRjYW5jZWxBY3Rpb246IHNldE1vZGFsS2V5Ym9hcmRBY3Rpb25zKHNhdmVJbWFnZUVkaXQsIGNhbmNlbEltYWdlRWRpdClcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRjbG9zZUVkaXRTY3JlZW4oKTtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG5cdH1cbn1cbmZ1bmN0aW9uIHNhdmVJbWFnZUVkaXQoKSB7XG5cdHZhciBlbXB0eVJlcXVpcmVkRmllbGQgPSBmYWxzZSxcblx0ZW1wdHlJbWFnZTtcblx0dmFyIGVtcHR5RmllbGRzID0gY2hlY2tGaWVsZHMoJy5wciBsYWJlbC5yZXF1aWVyZWQnKTtcblx0aWYgKGVtcHR5RmllbGRzIHx8IGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLnR5cGUgPT09ICd2aWRlbycpIHtcblx0XHRlZGl0ZWRGaWxlc0RhdGEuZm9yRWFjaChmdW5jdGlvbihmZCkge1xuXHRcdFx0aWYgKGZkLmZpbGVEYXRhLnRpdGxlID09PSAnJyAmJiAhZW1wdHlSZXF1aXJlZEZpZWxkKSB7XG5cdFx0XHRcdGVtcHR5UmVxdWlyZWRGaWVsZCA9IHRydWU7XG5cdFx0XHRcdGVtcHR5SW1hZ2UgPSAkKCcuaW1hZ2UuaW1hZ2Vfc3R5bGVfbXVsdGkgLmZpbGVfX2lkW2RhdGEtaWQ9XCInICsgZmQuZmlsZURhdGEuaWQgKyAnXCJdJykucGFyZW50cygnLmltYWdlJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoZW1wdHlSZXF1aXJlZEZpZWxkKSB7XG5cdFx0XHRzd2l0Y2hJbWFnZShlbXB0eUltYWdlKTtcblx0XHRcdCQoJy5qcy1yZXF1aXJlZCcpLm5vdCgnLmpzLWhhc1ZhbHVlJykuZmlyc3QoKS5hZGRDbGFzcygnaW5wdXRfc3RhdGVfZXJyIGlzLWJsaW5raW5nJykuZm9jdXMoKTtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGlmIChlLmFuaW1hdGlvbk5hbWUgPT09ICd0ZXh0ZmllbGQtZm9jdXMtYmxpbmsnKSB7JChlLnRhcmdldCkucGFyZW50KCkuZmluZCgnLmlzLWJsaW5raW5nJykucmVtb3ZlQ2xhc3MoJ2lzLWJsaW5raW5nJyk7fVxuXHRcdFx0fSk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGNsb25lZEVkaXRlZEZpbGVzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShlZGl0ZWRGaWxlc0RhdGEpKTtcblx0XHRcdGNsb25lZEVkaXRlZEZpbGVzLmZvckVhY2goZnVuY3Rpb24oZmQpIHtcblx0XHRcdFx0dmFyIGZpbGUgPSBnYWxsZXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuXHRcdFx0XHRcdHJldHVybiBmLmZpbGVEYXRhLmlkID09PSBmZC5maWxlRGF0YS5pZDtcblx0XHRcdFx0fSlbMF07XG5cdFx0XHRcdHZhciBmaWxlSW5kZXggPSBnYWxsZXJ5T2JqZWN0cy5pbmRleE9mKGZpbGUpO1xuXG5cdFx0XHRcdGdhbGxlcnlPYmplY3RzID0gZ2FsbGVyeU9iamVjdHMuc2xpY2UoMCwgZmlsZUluZGV4KS5jb25jYXQoW2ZkXSkuY29uY2F0KGdhbGxlcnlPYmplY3RzLnNsaWNlKGZpbGVJbmRleCArIDEpKTtcblxuXHRcdFx0XHQvKmdhbGxlcnlPYmplY3RzLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdFx0XHRpZiAoZi5maWxlRGF0YS5pZCA9PT0gZmQuZmlsZURhdGEuaWQpIHtcblx0XHRcdFx0ZiA9IGZkO1xuXHRcdFx0XHRmLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSk7Ki9cblx0fSk7XG5cdHNob3dOb3RpZmljYXRpb24oJ1RoZSBjaGFuZ2UgaW4gdGhlIG1ldGFkYXRhIGlzIHNhdmVkIHRvIHRoZSBhc3NldC4nKTtcblx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVzY0tleWRvd24pO1xuXHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcblx0d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7Y2xvc2VFZGl0U2NyZWVuKCk7fSwgMjAwMCk7XG5cdGNvbnNvbGUubG9nKGdhbGxlcnlPYmplY3RzKTtcblx0ZGVzZWxlY3RBbGwoKTtcblx0dXBkYXRlR2FsbGVyeSgpO1xufVxuXG59XG59XG4vKlF1aWNrIEVkaXQgRmlsZSBUaXRsZSBhbmQgSW5mbyAqL1xuZnVuY3Rpb24gZWRpdEZpbGVUaXRsZShlKSB7XG5cdGlmICghJCgnLmFsJykuaGFzQ2xhc3MoJ21vZGFsJykpIHtcblx0XHR2YXIgZmlsZUluZm8gPSBlLnRhcmdldDtcblx0XHR2YXIgZmlsZUluZm9UZXh0ID0gZmlsZUluZm8uaW5uZXJIVE1MO1xuXHRcdHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cdFx0aW5wdXQudHlwZSA9ICd0ZXh0Jztcblx0XHRpbnB1dC52YWx1ZSA9IGZpbGVJbmZvVGV4dDtcblxuXHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgaW5wdXQgPSBlLnRhcmdldDtcblx0XHRcdGZpbGVJbmZvID0gaW5wdXQucGFyZW50Tm9kZTtcblx0XHRcdGZpbGVJbmZvLnJlbW92ZUNoaWxkKGlucHV0KTtcblx0XHRcdGZpbGVJbmZvLmNsYXNzTGlzdC5yZW1vdmUoJ2VkaXQnKTtcblx0XHRcdGZpbGVJbmZvLmlubmVySFRNTCA9IGlucHV0LnZhbHVlO1xuXHRcdH0pO1xuXHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAxMyB8fCBlLndoaWNoID09IDEzKSB7XG5cdFx0XHRcdHZhciBpbnB1dCA9IGUudGFyZ2V0O1xuXHRcdFx0XHRmaWxlSW5mbyA9IGlucHV0LnBhcmVudE5vZGU7XG5cdFx0XHRcdGZpbGVJbmZvLnJlbW92ZUNoaWxkKGlucHV0KTtcblx0XHRcdFx0ZmlsZUluZm8uY2xhc3NMaXN0LnJlbW92ZSgnZWRpdCcpO1xuXHRcdFx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSBpbnB1dC52YWx1ZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGZpbGVJbmZvLmlubmVySFRNTCA9ICcnO1xuXHRcdGZpbGVJbmZvLmFwcGVuZENoaWxkKGlucHV0KTtcblx0XHRmaWxlSW5mby5jbGFzc0xpc3QuYWRkKCdlZGl0Jyk7XG5cdFx0aW5wdXQuZm9jdXMoKTtcblx0fVxufVxuZnVuY3Rpb24gZWRpdEZpbGVDYXB0aW9uKGUpIHtcblx0aWYgKCEkKCcuYWwnKS5oYXNDbGFzcygnbW9kYWwnKSkge1xuXHRcdHZhciBmaWxlSW5mbyA9IGUudGFyZ2V0O1xuXHRcdHZhciBmaWxlSW5mb1RleHQgPSBmaWxlSW5mby5pbm5lckhUTUw7XG5cdFx0dmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcblx0XHQvL2lucHV0LnR5cGUgPSAndGV4dCdcblx0XHRpbnB1dC52YWx1ZSA9IGZpbGVJbmZvVGV4dDtcblxuXHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgaW5wdXQgPSBlLnRhcmdldDtcblx0XHRcdGZpbGVJbmZvID0gaW5wdXQucGFyZW50Tm9kZTtcblx0XHRcdGZpbGVJbmZvLnJlbW92ZUNoaWxkKGlucHV0KTtcblx0XHRcdGZpbGVJbmZvLmNsYXNzTGlzdC5yZW1vdmUoJ2VkaXQnKTtcblx0XHRcdGZpbGVJbmZvLmlubmVySFRNTCA9IGlucHV0LnZhbHVlO1xuXHRcdH0pO1xuXHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAxMyB8fCBlLndoaWNoID09IDEzKSB7XG5cdFx0XHRcdHZhciBpbnB1dCA9IGUudGFyZ2V0O1xuXHRcdFx0XHRmaWxlSW5mbyA9IGlucHV0LnBhcmVudE5vZGU7XG5cdFx0XHRcdGZpbGVJbmZvLnJlbW92ZUNoaWxkKGlucHV0KTtcblx0XHRcdFx0ZmlsZUluZm8uY2xhc3NMaXN0LnJlbW92ZSgnZWRpdCcpO1xuXHRcdFx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSBpbnB1dC52YWx1ZTtcblx0XHRcdH1cblxuXHRcdH0pO1xuXG5cdFx0ZmlsZUluZm8uaW5uZXJIVE1MID0gJyc7XG5cdFx0ZmlsZUluZm8uYXBwZW5kQ2hpbGQoaW5wdXQpO1xuXHRcdGZpbGVJbmZvLmNsYXNzTGlzdC5hZGQoJ2VkaXQnKTtcblx0XHRpbnB1dC5mb2N1cygpO1xuXHR9XG59XG5cblxuZnVuY3Rpb24gZGVsZXRlRmlsZShmaWxlLCBmaWxlcykge1xuXHRmaWxlcyA9IGZpbGVzLnNwbGljZShmaWxlcy5pbmRleE9mKGZpbGUpLCAxKTtcbn1cbmZ1bmN0aW9uIGRlbGV0ZUZpbGVCeUlkKGlkLCBmaWxlcykge1xuXHR2YXIgZmlsZSA9IGZpbGVCeUlkKGlkLCBmaWxlcyk7XG5cdGRlbGV0ZUZpbGUoZmlsZSwgZmlsZXMpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVEZWxldGVDbGljayhlKSB7XG5cdHZhciBpdGVtTmFtZSA9ICQoJy5tZW51IC5pcy1hY3RpdmUnKS50ZXh0KCkudG9Mb3dlckNhc2UoKTtcblx0bmV3IE1vZGFsKHtcblx0XHR0aXRsZTogJ1JlbW92ZSBBc3NldD8nLFxuXHRcdHRleHQ6ICdTZWxlY3RlZCBhc3NldCB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGlzICcgKyBpdGVtTmFtZSArICcuIERvbuKAmXQgd29ycnksIGl0IHdvbuKAmXQgYmUgcmVtb3ZlZCBmcm9tIHRoZSBBc3NldCBMaWJyYXJ5LicsXG5cdFx0Y29uZmlybVRleHQ6ICdSZW1vdmUnLFxuXHRcdGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGZpbGVJZCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJykuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpO1xuXHRcdFx0ZGVsZXRlRmlsZUJ5SWQoZmlsZUlkLCBnYWxsZXJ5T2JqZWN0cyk7XG5cdFx0XHR1cGRhdGVHYWxsZXJ5KCk7XG5cdFx0fVxuXHR9KTtcbn1cblxuJCgnLmZpbGUtdGl0bGUnKS5jbGljayhlZGl0RmlsZVRpdGxlKTtcbiQoJy5maWxlLWNhcHRpb24nKS5jbGljayhlZGl0RmlsZUNhcHRpb24pO1xuXG4vL0ZpbGUgdXBsb2FkXG5mdW5jdGlvbiBoYW5kbGVGaWxlcyhmaWxlcykge1xuXHR2YXIgZmlsZXNPdXRwdXQgPSBbXTtcblx0aWYgKGZpbGVzICYmIGZpbGVzLmxlbmd0aCA+MCkge1xuXHRcdGZvciAodmFyIGk9MDsgaTwgZmlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGZpbGVzT3V0cHV0LnB1c2goZmlsZXNbaV0pO1xuXHRcdH1cblx0XHQvL3Nob3dMb2FkZXIoKTtcblx0XHR2YXIgdXBsb2FkZWRGaWxlcyA9IGZpbGVzT3V0cHV0Lm1hcChmdW5jdGlvbihmKSB7XG5cdFx0XHRyZXR1cm4gZmlsZVRvT2JqZWN0KGYpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRcdGdhbGxlcnlPYmplY3RzLnB1c2goe1xuXHRcdFx0XHRcdGZpbGVEYXRhOiByZXMsXG5cdFx0XHRcdFx0c2VsZWN0ZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdHBvc2l0aW9uOiAxMDAwLFxuXHRcdFx0XHRcdGNhcHRpb246ICcnLFxuXHRcdFx0XHRcdGdhbGxlcnlDYXB0aW9uOiBmYWxzZSxcblx0XHRcdFx0XHRqdXN0VXBsb2FkZWQ6IHRydWUsXG5cdFx0XHRcdFx0bG9hZGluZzogdHJ1ZVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdFByb21pc2UuYWxsKHVwbG9hZGVkRmlsZXMpLnRoZW4oZnVuY3Rpb24ocmVzKSB7dXBkYXRlR2FsbGVyeShnYWxsZXJ5T2JqZWN0cy5sZW5ndGgpO30pO1xuXHR9XG59XG5cbi8vQ29udmVydCB1cGxvYWRlZCBmaWxlcyB0byBlbGVtZW50c1xuZnVuY3Rpb24gZmlsZVRvTWFya3VwKGZpbGUpIHtcblx0cmV0dXJuIHJlYWRGaWxlKGZpbGUpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG5cdFx0dmFyIGZpbGVOb2RlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZScpLFxuXG5cdFx0XHRmaWxlSW1nID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZS1pbWcnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyByZXN1bHQuc3JjICsgJyknKSxcblxuXHRcdFx0ZmlsZUNvbnRyb2xzID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZS1jb250cm9scycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuXHRcdFx0Y2hlY2ttYXJrID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2hlY2ttYXJrJykuY2xpY2sodG9nZ2xlRmlsZVNlbGVjdCksXG5cdFx0XHRjbG9zZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2Nsb3NlJykuY2xpY2soZGVsZXRlRmlsZSksXG5cdFx0XHRlZGl0ID0gJCgnPGJ1dHRvbj5FZGl0PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbiB3aGl0ZU91dGxpbmUnKS5jbGljayhlZGl0RmlsZSksXG5cblx0XHRcdGZpbGVUaXRsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3RpdGxlJyksXG5cdFx0XHRmaWxlVHlwZUljb24gPSAkKCc8aSBjbGFzcz1cImZhIGZhLWNhbWVyYVwiPjwvaT4nKS5jc3MoJ21hcmdpbi1yaWdodCcsICcycHgnKSxcblx0XHRcdGZpbGVUaXRsZUlucHV0ID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgLz4nKS52YWwocmVzdWx0Lm5hbWUpLFxuXG5cdFx0XHRmaWxlQ2FwdGlvbiA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUtY2FwdGlvbicpLnRleHQocmVzdWx0Lm5hbWUpLmNsaWNrKGVkaXRGaWxlQ2FwdGlvbiksXG5cdFx0XHRmaWxlSW5mbyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUtaW5mbycpLnRleHQocmVzdWx0LmluZm8pLFxuXG5cdFx0XHRmaWxlUHVycG9zZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUtcHVycG9zZScpLFxuXHRcdFx0ZmlsZVB1cnBvc2VTZWxlY3QgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdzZWxlY3QnKS5jbGljayhvcGVuU2VsZWN0KSxcblx0XHRcdHNlbGVjdFNwYW4gPSAkKCc8c3Bhbj5TZWxlY3QgdXNlPC9zcGFuPicpLFxuXHRcdFx0c2VsZWN0VWwgPSAkKCc8dWw+PC91bD4nKSxcblx0XHRcdHNlbGVjdExpMSA9ICQoJzxsaT5Db3ZlcjwvbGk+JykuY2xpY2soc2V0U2VsZWN0KSxcblx0XHRcdHNlbGVjdExpMiA9ICQoJzxsaT5QcmltYXJ5PC9saT4nKS5jbGljayhzZXRTZWxlY3QpLFxuXHRcdFx0c2VsZWN0TGkzID0gJCgnPGxpPlNlY29uZGFyeTwvbGk+JykuY2xpY2soc2V0U2VsZWN0KTtcblxuXHRcdGZpbGVUaXRsZS5hcHBlbmQoZmlsZVR5cGVJY29uLCBmaWxlVGl0bGVJbnB1dCk7XG5cdFx0c2VsZWN0VWwuYXBwZW5kKHNlbGVjdExpMSwgc2VsZWN0TGkyLCBzZWxlY3RMaTMpO1xuXHRcdGZpbGVQdXJwb3NlU2VsZWN0LmFwcGVuZChzZWxlY3RTcGFuLCBzZWxlY3RVbCk7XG5cblx0XHRmaWxlUHVycG9zZS5hcHBlbmQoZmlsZVB1cnBvc2VTZWxlY3QpO1xuXHRcdGZpbGVDb250cm9scy5hcHBlbmQoY2hlY2ttYXJrLCBjbG9zZSwgZWRpdCk7XG5cdFx0ZmlsZUltZy5hcHBlbmQoZmlsZUNvbnRyb2xzKTtcblxuXHRcdGZpbGVOb2RlLmFwcGVuZChmaWxlSW1nLCBmaWxlVGl0bGUsIGZpbGVDYXB0aW9uLCBmaWxlSW5mbywgZmlsZVB1cnBvc2UpO1xuXG5cdFx0cmV0dXJuIGZpbGVOb2RlO1xuXHR9KTtcbn1cblxuLy9Db252ZXJ0IHVwbG9hZGVkIGZpbGUgdG8gb2JqZWN0XG5mdW5jdGlvbiBmaWxlVG9PYmplY3QoZmlsZSkge1xuXHRyZXR1cm4gcmVhZEZpbGUoZmlsZSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcblx0XHRyZXR1cm4ge1xuXHQgICAgICAgIHVybDogcmVzdWx0LnNyYyxcblx0ICAgICAgICBmb2NhbFBvaW50OiB7XG5cdCAgICAgICAgICAgIGxlZnQ6IDAuNSxcblx0ICAgICAgICAgICAgdG9wOiAwLjVcblx0ICAgICAgICB9LFxuXHRcdFx0aWQ6IHJlc3VsdC5uYW1lICsgJyAnICsgbmV3IERhdGUoKSxcblx0XHRcdGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgpLFxuXHQgICAgICAgIGNvbG9yOiAnJywvL2ZpbGVJbWdDb2xvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmZpbGVJbWdDb2xvcnMubGVuZ3RoKV0sXG5cdCAgICAgICAgdGl0bGU6IHJlc3VsdC5uYW1lLFxuXHQgICAgICAgIGNhcHRpb246ICcnLFxuXHQgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcblx0ICAgICAgICBoaWdoUmVzb2x1dGlvbjogZmFsc2UsXG5cdCAgICAgICAgY2F0ZWdvcmllczogJycsXG5cdCAgICAgICAgdGFnczogJycsXG5cdCAgICAgICAgYWx0VGV4dDogJycsXG5cdCAgICAgICAgY3JlZGl0OiAnJyxcblx0ICAgICAgICBjb3B5cmlnaHQ6ICcnLFxuXHQgICAgICAgIHJlZmVyZW5jZToge1xuXHQgICAgICAgICAgICBzZXJpZXM6ICcnLFxuXHQgICAgICAgICAgICBzZWFzb246ICcnLFxuXHQgICAgICAgICAgICBlcGlzb2RlOiAnJ1xuXHQgICAgICAgIH0sXG5cdFx0XHR0eXBlOiAnaW1hZ2UnXG5cdCAgICB9O1xuXHR9KTtcbn1cblxuLy9SZWFkIGZpbGUgYW5kIHJldHVybiBwcm9taXNlXG5mdW5jdGlvbiByZWFkRmlsZShmaWxlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShcblx0XHRmdW5jdGlvbihyZXMsIHJlaikge1xuXHRcdFx0dmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cdFx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRyZXMoe3NyYzogZS50YXJnZXQucmVzdWx0LFxuXHRcdFx0XHRcdG5hbWU6IGZpbGUubmFtZSxcblx0XHRcdFx0XHRpbmZvOiBmaWxlLnR5cGUgKyAnLCAnICsgTWF0aC5yb3VuZChmaWxlLnNpemUvMTAyNCkudG9TdHJpbmcoKSArICcgS2InfSk7XG5cdFx0XHR9O1xuXHRcdFx0cmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmVqKHRoaXMpO1xuXHRcdFx0fTtcblx0XHRcdHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuXHRcdH1cblx0KTtcbn1cblxuLy9Mb2FkZXJzXG5mdW5jdGlvbiBzaG93TG9hZGVyKCkge1xuXHR2YXIgbW9kYWwgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbCcpLmF0dHIoJ2lkJywgJ2xvYWRlck1vZGFsJyksXG5cdFx0bG9hZGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbG9hZGVyJyk7XG5cblx0bW9kYWwuYXBwZW5kKGxvYWRlcik7XG5cdCQoJ2JvZHknKS5hcHBlbmQobW9kYWwpO1xufVxuZnVuY3Rpb24gaGlkZUxvYWRlcigpIHtcblx0JCgnI2xvYWRlck1vZGFsJykucmVtb3ZlKCk7XG59XG5cbi8vRHJhZyBhbmQgZHJvcCBmaWxlc1xuZnVuY3Rpb24gaGFuZGxlRHJhZ0VudGVyKGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImNvcHlcIjtcblx0JCgnI2Ryb3Bab25lJykuYWRkQ2xhc3MoJ21vZGFsJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRyb3Bab25lXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGhhbmRsZURyYWdMZWF2ZSwgdHJ1ZSk7XG59XG5mdW5jdGlvbiBoYW5kbGVEcmFnTGVhdmUoZSkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCQoXCIjZHJvcFpvbmVcIikucmVtb3ZlQ2xhc3MoJ21vZGFsJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndyYXBwZXJcIikuY2xhc3NMaXN0LnJlbW92ZSgnbG9ja2VkJyk7XG59XG5mdW5jdGlvbiBoYW5kbGVEcm9wKGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdCQoXCIjZHJvcFpvbmVcIikucmVtb3ZlQ2xhc3MoJ21vZGFsJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHR2YXIgZmlsZXMgPSBlLmRhdGFUcmFuc2Zlci5maWxlcztcblx0aWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRoYW5kbGVGaWxlcyhmaWxlcyk7XG5cdH1cbn1cbmZ1bmN0aW9uIGhhbmRsZURyYWdPdmVyKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbn1cblxuLy9VcGxvYWQgZmlsZSBmcm9tIFwiVXBsb2FkIEZpbGVcIiBCdXR0b25cbmZ1bmN0aW9uIGhhbmRsZVVwbG9hZEZpbGVzQ2xpY2soZSkge1xuXHR2YXIgZmlsZXNJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZXNJbnB1dFwiKTtcbiAgICBpZiAoIWZpbGVzSW5wdXQpIHtcbiAgICBcdGZpbGVzSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIGZpbGVzSW5wdXQudHlwZSA9IFwiZmlsZVwiO1xuICAgICAgICBmaWxlc0lucHV0Lm11bHRpcGxlID0gXCJ0cnVlXCI7XG4gICAgICAgIGZpbGVzSW5wdXQuaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgZmlsZXNJbnB1dC5hY2NlcHQgPSBcImltYWdlLyosIGF1ZGlvLyosIHZpZGVvLypcIjtcbiAgICAgICAgZmlsZXNJbnB1dC5pZCA9IFwiZmlsZXNJbnB1dFwiO1xuICAgICAgICBmaWxlc0lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgaGFuZGxlRmlsZXMoZS50YXJnZXQuZmlsZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZmlsZXNJbnB1dCk7XG4gICAgfVxuICAgIGZpbGVzSW5wdXQuY2xpY2soKTtcbn1cblxuLy9Ub29sdGlwXG5mdW5jdGlvbiBjcmVhdGVUb29sdGlwKHRhcmdldCwgdGV4dCkge1xuICAgIHZhciB0b29sdGlwID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygndG9vbHRpcCcpLFxuICAgICAgICB0b29sdGlwVGV4dCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3Rvb2x0aXBfX3RleHQnKS50ZXh0KHRleHQpLFxuICAgICAgICB0b29sdGlwVG9nZ2xlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygndG9vbHRpcF9fdG9nZ2xlJyksXG4gICAgICAgIHRvb2x0aXBUb2dnbGVfVG9nZ2xlID0gJCgnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwibmV2ZXJTaG93VG9vbHRpcFwiIC8+JyksLy8ub24oJ2NoYW5nZScsIG5ldmVyU2hvd1Rvb2x0aXApLFxuICAgICAgICB0b29sdGlwVG9nZ2xlX0xhYmVsID0gJCgnPGxhYmVsIGZvcj1cIm5ldmVyU2hvd1Rvb2x0aXBcIj5Hb3QgaXQsIGRvblxcJ3Qgc2hvdyBtZSB0aGlzIGFnYWluPC9sYWJlbD4nKTtcblxuICAgIHRvb2x0aXBUb2dnbGUuYXBwZW5kKHRvb2x0aXBUb2dnbGVfVG9nZ2xlLCB0b29sdGlwVG9nZ2xlX0xhYmVsKTtcbiAgICB0b29sdGlwVG9nZ2xlLmJpbmQoJ2ZvY3VzIGNsaWNrIGNoYW5nZScsIG5ldmVyU2hvd1Rvb2x0aXApO1xuICAgIHRvb2x0aXAuYXBwZW5kKHRvb2x0aXBUZXh0LCB0b29sdGlwVG9nZ2xlKTtcbiAgICAkKCcuZmlsZV9fY2FwdGlvbi10ZXh0YXJlYScpLnJlbW92ZUF0dHIoJ2lkJyk7XG4gICAgJCh0YXJnZXQpLnBhcmVudCgpLmFwcGVuZCh0b29sdGlwKTtcbiAgICB0YXJnZXQuYXR0cignaWQnLCAnYWN0aXZlLWNhcHRpb24tdGV4dGFyZWEnKTtcblxuICAgIHRvb2x0aXAud2lkdGgodGFyZ2V0LndpZHRoKCkpO1xuICAgIGlmICgkKCdib2R5Jykud2lkdGgoKSAtIHRhcmdldC5vZmZzZXQoKS5sZWZ0IC0gdGFyZ2V0LndpZHRoKCkgLSB0YXJnZXQud2lkdGgoKSAtIDIwID4gMCApIHtcbiAgICAgICAgdG9vbHRpcC5jc3MoJ2xlZnQnLCB0YXJnZXQucG9zaXRpb24oKS5sZWZ0ICsgdGFyZ2V0LndpZHRoKCkgKyAxMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdG9vbHRpcC5jc3MoJ2xlZnQnLCB0YXJnZXQucG9zaXRpb24oKS5sZWZ0IC0gdGFyZ2V0LndpZHRoKCkgLSAxMCk7XG4gICAgfVxuICAgIC8vdmFyIG5vdEluY2x1ZGUgPSB0b29sdGlwLmFkZCh0b29sdGlwVGV4dCkuYWRkKHRvb2x0aXBUb2dnbGUpLmFkZCh0b29sdGlwVG9nZ2xlX0xhYmVsKS5hZGQodG9vbHRpcFRvZ2dsZV9Ub2dnbGUpLmFkZCh0YXJnZXQpO1xuICAgIGNvbnNvbGUubG9nKCQoJyNhY3RpdmUtY2FwdGlvbi10ZXh0YXJlYScpKTtcbiAgICAkKCcuY3QsIC5tZW51Jykub24oY2xvc2VUb29sdGlwKS5maW5kKCcjYWN0aXZlLWNhcHRpb24tdGV4dGFyZWEsIC50b29sdGlwLCAudG9vbHRpcCBpbnB1dCwgLnRvb2x0aXAgbGFiZWwnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7ZS5zdG9wUHJvcGFnYXRpb24oKTt9KTtcbn1cblxuZnVuY3Rpb24gbmV2ZXJTaG93VG9vbHRpcChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Rvb2x0aXAnLCB0cnVlKTtcbiAgICBjbG9zZVRvb2x0aXAoKTtcbn1cblxuZnVuY3Rpb24gY2xvc2VUb29sdGlwKGUpIHtcbiAgICBpZiAoZSkge2Uuc3RvcFByb3BhZ2F0aW9uKCk7fVxuXG4gICAgY29uc29sZS5sb2coJ2Nsb3NldG9vbHRpcCcsIGUpO1xuICAgICQoJy5jdCwgLm1lbnUnKS51bmJpbmQoJ2NsaWNrJywgY2xvc2VUb29sdGlwKTtcbiAgICB2YXIgdG9vbHRpcHMgPSAkKCcudG9vbHRpcCcpO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0b29sdGlwcy5yZW1vdmUoKTtcbiAgICB9LCAzMDApO1xufVxuXG4vL01vZGFsIFByb21wdHMgYW5kIFdpbmRvd3NcbmZ1bmN0aW9uIGNsb3NlRWRpdFNjcmVlbigpIHtcbiAgJCgnLnByJykucmVtb3ZlQ2xhc3MoJ21vZGFsJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAkKCcucHIgLnByZXZpZXcnKS5yZW1vdmVDbGFzcygnZm9jYWwgbGluZSBmdWxsIHJlY3QgcG9pbnQnKTtcbiAgJCgnLmZvY2FsUG9pbnQnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAkKCcuZm9jYWxSZWN0JykucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgJCgnI2ZvY2FsUG9pbnRUb2dnbGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICQoJyNmb2NhbFJlY3RUb2dnbGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICQoJy5wdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UgLnB1cnBvc2UtaW1nJykucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgJCgnLmN0IC5maWxlJykuZmluZCgnYnV0dG9uJykuY3NzKCdkaXNwbGF5JywgJycpO1xuICBkZXNlbGVjdEFsbCgpO1xuICAkKCcjd3JhcHBlcicpLnJlbW92ZUNsYXNzKCdvdmVyZmxvdycpO1xuICAkKCdib2R5Jykuc2Nyb2xsVG9wKHNjcm9sbFBvc2l0aW9uKTtcbn1cblxuZnVuY3Rpb24gc2hvd01vZGFsUHJvbXB0KG9wdGlvbnMpIHtcbiAgdmFyIG1vZGFsQ2xhc3MgPSBvcHRpb25zLmRpYWxvZyA/ICdtb2RhbCBtb2RhbC0tcHJvbXB0IG1vZGFsLS1kaWFsb2cnIDogJ21vZGFsIG1vZGFsLS1wcm9tcHQnLFxuICBzZWNCdXR0b25DbGFzcyA9IG9wdGlvbnMuZGlhbG9nID8gJ2J1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5JyA6ICdidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnLFxuICBjbG9zZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX19jbG9zZScpLmNsaWNrKG9wdGlvbnMuY2FuY2VsQWN0aW9uKSxcbiAgbW9kYWwgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKG1vZGFsQ2xhc3MpLFxuICB0aXRsZSA9IG9wdGlvbnMudGl0bGUgPyAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fdGl0bGUnKS50ZXh0KG9wdGlvbnMudGl0bGUpIDogbnVsbCxcbiAgdGV4dCA9IG9wdGlvbnMudGV4dCA/ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX190ZXh0JykudGV4dChvcHRpb25zLnRleHQpIDogbnVsbCxcbiAgY29udHJvbHMgPSBvcHRpb25zLmNvbmZpcm1BY3Rpb24gfHwgb3B0aW9ucy5jYW5jZWxBY3Rpb24gPyAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fY29udHJvbHMnKSA6IG51bGwsXG4gIGNvbmZpcm1CdXR0b24gPSBvcHRpb25zLmNvbmZpcm1BY3Rpb24gPyAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24gIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWFjY2VudCcpLnRleHQob3B0aW9ucy5jb25maXJtVGV4dCB8fCAnT2snKS5jbGljayhvcHRpb25zLmNvbmZpcm1BY3Rpb24pIDogbnVsbCxcbiAgY2FuY2VsQnV0dG9uID0gb3B0aW9ucy5jYW5jZWxBY3Rpb24gPyAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKHNlY0J1dHRvbkNsYXNzKS50ZXh0KG9wdGlvbnMuY2FuY2VsVGV4dCB8fCAnTmV2ZXJtaW5kJykuY2xpY2sob3B0aW9ucy5jYW5jZWxBY3Rpb24pIDogbnVsbDtcblxuICBjb250cm9scy5hcHBlbmQoY29uZmlybUJ1dHRvbiwgY2FuY2VsQnV0dG9uKTtcbiAgbW9kYWwuYXBwZW5kKGNsb3NlLCB0aXRsZSwgdGV4dCwgY29udHJvbHMpO1xuICAkKCdib2R5JykuYXBwZW5kKG1vZGFsKTtcbiAgc2V0TW9kYWxLZXlib2FyZEFjdGlvbnMob3B0aW9ucy5jb25maXJtQWN0aW9uLCBvcHRpb25zLmNhbmNlbEFjdGlvbik7XG59XG5cbmZ1bmN0aW9uIGhpZGVNb2RhbFByb21wdCgpIHtcbiAgJCgnLm9wLm1vZGFsLCAub3AuZGlhbG9nLCAubW9kYWwubW9kYWwtLXByb21wdCcpLnJlbW92ZSgpO1xuICAkKGRvY3VtZW50KS51bmJpbmQoJ2tleWRvd24nKTtcbn1cbmZ1bmN0aW9uIHNldE1vZGFsS2V5Ym9hcmRBY3Rpb25zKGVudGVyLCBjbG9zZSkge1xuICBoYW5kbGVFc2NLZXlkb3duID0gZnVuY3Rpb24oZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKGUudGFyZ2V0ID09PSBkb2N1bWVudC5ib2R5ICYmIGUua2V5Q29kZSA9PT0gMjcpIHtjbG9zZSgpO31cbiAgfTtcbiAgaGFuZGxlRW50ZXJLZXlkb3duID0gZnVuY3Rpb24oZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKGUudGFyZ2V0ID09PSBkb2N1bWVudC5ib2R5ICYmIGUua2V5Q29kZSA9PT0gMTMpIHtlbnRlcigpO31cbiAgfTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFbnRlcktleWRvd24pO1xufVxuZnVuY3Rpb24gaGFuZGxlRXNjS2V5ZG93bihlKSB7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIC8vaWYgKGUudGFyZ2V0ID09PSBkb2N1bWVudC5ib2R5ICYmIGUua2V5Q29kZSA9PT0gMjcpIHtjbG9zZSgpO31cbn1cbmZ1bmN0aW9uIGhhbmRsZUVudGVyS2V5ZG93bihlKSB7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIC8vaWYgKGUudGFyZ2V0ID09PSBkb2N1bWVudC5ib2R5ICYmIGUua2V5Q29kZSA9PT0gMTMpIHtlbnRlcigpO31cbn1cblxuZnVuY3Rpb24gTW9kYWwob3B0aW9ucykge1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gIHRoaXMuX2luaXQoKTtcbiAgdGhpcy5faW5pdEV2ZW50cygpO1xufVxuXG5Nb2RhbC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5tb2RhbCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmRpYWxvZyA/ICdtb2RhbCBtb2RhbC0tcHJvbXB0IG1vZGFsLS1kaWFsb2cnIDogJ21vZGFsIG1vZGFsLS1wcm9tcHQgbW9kYWwtLWZ1bGwnKTtcblxuICB0aGlzLmNsb3NlQnV0dG9uID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX2Nsb3NlJyk7XG4gIHRoaXMudGl0bGUgPSB0aGlzLm9wdGlvbnMudGl0bGUgPyAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fdGl0bGUnKS50ZXh0KHRoaXMub3B0aW9ucy50aXRsZSkgOiBudWxsO1xuICB0aGlzLnRleHQgPSB0aGlzLm9wdGlvbnMudGV4dCA/ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX190ZXh0JykudGV4dCh0aGlzLm9wdGlvbnMudGV4dCkgOiBudWxsO1xuXG4gIHRoaXMuY29udHJvbHMgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fY29udHJvbHMnKTtcbiAgaWYgKCF0aGlzLm9wdGlvbnMub25seUNhbmNlbCkge1xuICAgIHRoaXMuY29uZmlybUJ1dHRvbiA9ICQoJzxidXR0b24gLz4nKS5hZGRDbGFzcygnYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWFjY2VudCcpLnRleHQodGhpcy5vcHRpb25zLmNvbmZpcm1UZXh0IHx8ICdPaycpO1xuICAgIHRoaXMuY29udHJvbHMuYXBwZW5kKHRoaXMuY29uZmlybUJ1dHRvbik7XG4gIH1cbiAgaWYgKCF0aGlzLm9wdGlvbnMub25seUNvbmZpcm0pIHtcbiAgICB0aGlzLmNhbmNlbEJ1dHRvbiA9ICQoJzxidXR0b24gLz4nKS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuZGlhbG9nID8gJ2J1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5JyA6ICdidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKS50ZXh0KHRoaXMub3B0aW9ucy5jYW5jZWxUZXh0IHx8ICdOZXZlcm1pbmQnKTtcbiAgICB0aGlzLmNvbnRyb2xzLmFwcGVuZCh0aGlzLmNhbmNlbEJ1dHRvbik7XG4gIH1cblxuICB0aGlzLm1vZGFsLmFwcGVuZCh0aGlzLmNsb3NlQnV0dG9uLCB0aGlzLnRpdGxlLCB0aGlzLnRleHQsIHRoaXMuY29udHJvbHMpO1xuICAkKCdib2R5JykuYXBwZW5kKHRoaXMubW9kYWwpO1xufTtcblxuTW9kYWwucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVzY0tleWRvd24pO1xuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcblxuICBmdW5jdGlvbiBoYW5kbGVDb25maXJtYXRpb24oKSB7XG4gICAgaWYgKHNlbGYub3B0aW9ucy5jb25maXJtQWN0aW9uKSB7c2VsZi5vcHRpb25zLmNvbmZpcm1BY3Rpb24oKTt9XG4gICAgc2VsZi5tb2RhbC5yZW1vdmUoKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc2VsZi5oYW5kbGVLZXlEb3duLCB0cnVlKTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVDYW5jZWxhdGlvbigpIHtcbiAgICBpZiAoc2VsZi5vcHRpb25zLmNhbmNlbEFjdGlvbikge3NlbGYub3B0aW9ucy5jYW5jZWxBY3Rpb24oKTt9XG4gICAgc2VsZi5tb2RhbC5yZW1vdmUoKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc2VsZi5oYW5kbGVLZXlEb3duLCB0cnVlKTtcbiAgfVxuXG4gIHNlbGYuaGFuZGxlS2V5RG93biA9IGZ1bmN0aW9uKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmICghc2VsZi5vcHRpb25zLm9ubHlDYW5jZWwpIHtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7aGFuZGxlQ2FuY2VsYXRpb24oKTt9XG4gICAgfVxuICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7aGFuZGxlQ29uZmlybWF0aW9uKCk7fVxuICAgIGlmIChlLmtleUNvZGUgPT09IDI3KSB7aGFuZGxlQ2FuY2VsYXRpb24oKTt9XG4gIH07XG5cbiAgaWYgKHNlbGYuY2FuY2VsQnV0dG9uKSB7c2VsZi5jYW5jZWxCdXR0b24uY2xpY2soaGFuZGxlQ2FuY2VsYXRpb24pO31cbiAgaWYgKHNlbGYuY29uZmlybUJ1dHRvbikge3NlbGYuY29uZmlybUJ1dHRvbi5jbGljayhoYW5kbGVDb25maXJtYXRpb24pO31cbiAgc2VsZi5jbG9zZUJ1dHRvbi5jbGljayhoYW5kbGVDYW5jZWxhdGlvbik7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBzZWxmLmhhbmRsZUtleURvd24sIHRydWUpO1xufTtcblxuLy9Bc3NldCBsaWJyYXJ5XG52YXIgYXNzZXRMaWJyYXJ5T2JqZWN0cyA9IFtcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtMi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtMi5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTIuanBnJyxcbiAgICBjYXB0aW9uOiAnMDUuIERvblxcJ3QgR2V0IExvc3QnLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtMy5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtMy5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTMuanBnJyxcbiAgICBjYXB0aW9uOiAnMDIuIFRoZSBNYW4gaW4gdGhlIFNoYWRvd3MnLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtNC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtNC5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTQuanBnJyxcbiAgICBjYXB0aW9uOiAnMDMuIFRoZSBGaXJzdCBTbGljZScsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1lcGlzb2RlLTUuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWVwaXNvZGUtNS5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWVwaXNvZGUtNS5qcGcnLFxuICAgIGNhcHRpb246ICcwMS4gQSBOZXcgVmlzaXRvcicsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS01LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS01LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtNS5qcGcnLFxuICAgIGNhcHRpb246ICcwNC4gVGhlIEJsb29kIE1vb24nLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtMTAuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTEwLmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtMTAuanBnJyxcbiAgICBjYXB0aW9uOiAnMDMuIFRoZSBGaXJzdCBTbGljZScsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS0xMy5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtMTMuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS0xMy5qcGcnLFxuICAgIGNhcHRpb246ICcwMS4gQSBOZXcgVmlzaXRvcicsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS0xNS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtMTUuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS0xNS5qcGcnLFxuICAgIGNhcHRpb246ICcwMS4gQSBOZXcgVmlzaXRvcicsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS0xMS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtMTEuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnVHJhaWxlciBFMDMnLFxuICAgIGNhcHRpb246ICcwNi4gQWxsIEFsb25lJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAndmlkZW8nXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTkuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTkuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS05LmpwZycsXG4gICAgY2FwdGlvbjogJzA0LiBUaGUgQmxvb2QgTW9vbicsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS04LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS04LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtOC5qcGcnLFxuICAgIGNhcHRpb246ICcwNC4gVGhlIEJsb29kIE1vb24nLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtNi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtNi5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTYuanBnJyxcbiAgICBjYXB0aW9uOiAnMDYuIEFsbCBBbG9uZScsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ2F6dGVjX3RlbXBsZS5wbmcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAxLmpwZycsXG4gICAgY2FwdGlvbjogJ1dyaXRlciwgQnJpYW4gTWlsbGlraW4sIGEgbWFuIGFib3V0IEhhdmVuLCB0YWtlcyB1cyBiZWhpbmQgdGhlIHNjZW5lcyBvZiB0aGlzIGVwaXNvZGUgYW5kIGdpdmVzIHVzIGEgZmV3IHRlYXNlcyBhYm91dCB0aGUgU2Vhc29uIHRoYXQgd2UgY2FuXFwndCB3YWl0IHRvIHNlZSBwbGF5IG91dCEgVGhpcyBpcyB0aGUgZmlyc3QgZXBpc29kZSBvZiBIYXZlbiBub3QgZmlsbWVkIGluIG9yIGFyb3VuZCBDaGVzdGVyLCBOb3ZhIFNjb3RpYS4gQmVnaW5uaW5nIGhlcmUsIHRoZSBzaG93IGFuZCBpdHMgc3RhZ2VzIHJlbG9jYXRlZCB0byBIYWxpZmF4LicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAyLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnYmlnX2Jlbi5wbmcgNDNkZWZxd2UnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjRkRCRDAwJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDIuanBnJyxcbiAgICBjYXB0aW9uOiAnQ2hhcmxvdHRlIGxheXMgb3V0IGhlciBwbGFuIGZvciB0aGUgZmlyc3QgdGltZSBpbiB0aGlzIGVwaXNvZGU6IHRvIGJ1aWxkIGEgbmV3IEJhcm4sIG9uZSB0aGF0IHdpbGwgY3VyZSBUcm91YmxlcyB3aXRob3V0IGtpbGxpbmcgVHJvdWJsZWQgcGVvcGxlIGluIHRoZSBwcm9jZXNzLiBIZXIgcGxhbiwgYW5kIHdoYXQgcGFydHMgaXQgcmVxdWlyZXMsIHdpbGwgY29udGludWUgdG8gcGxheSBhIG1vcmUgYW5kIG1vcmUgaW1wb3J0YW50IHJvbGUgYXMgdGhlIHNlYXNvbiBnb2VzIGFsb25nLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMy5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ2NocmlzdF90aGVfcmVkZWVtZXIucG5nIDA5Mm5seG5jJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0VENDEyRCcsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAzLmpwZycsXG4gICAgY2FwdGlvbjogJ0xvc3QgdGltZSBwbGF5cyBhbiBldmVuIG1vcmUgaW1wb3J0YW50IHJvbGUgaW4gdGhpcyBlcGlzb2RlIHRoYW4gZXZlciBiZWZvcmXigJQgYXMgaXTigJlzIHJldmVhbGVkIHRoYXQgaXTigJlzIGEgd2VhcG9uIHRoZSBncmVhdCBldmlsIGZyb20gVGhlIFZvaWQgaGFzIGJlZW4gdXNpbmcgYWdhaW5zdCB1cywgYWxsIHNlYXNvbiBsb25nLiBXaGljaCBnb2VzIGJhY2sgdG8gdGhlIGNhdmUgdW5kZXIgdGhlIGxpZ2h0aG91c2UgaW4gYmVnaW5uaW5nIG9mIHRoZSBTZWFzb24gNSBwcmVtaWVyZS4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnTG9zdCB0aW1lJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDQuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdjb2xvc3NldW0ucG5nIC00cmp4bnNrJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnIzMyQTRCNycsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzA0LmpwZycsXG4gICAgY2FwdGlvbjogJ1RoZSDigJxhZXRoZXIgY29yZeKAnSB0aGF0IENoYXJsb3R0ZSBhbmQgQXVkcmV5IG1ha2UgcHJlc2VudGVkIGFuIGltcG9ydGFudCBkZXNpZ24gY2hvaWNlLiBUaGUgd3JpdGVycyB3YW50ZWQgaXQgdG8gbG9vayBvcmdhbmljIGJ1dCBhbHNvIGRlc2lnbmVk4oCUIGxpa2UgdGhlIHRlY2hub2xvZ3kgb2YgYW4gYWR2YW5jZWQgY3VsdHVyZSBmcm9tIGEgZGlmZmVyZW50IGRpbWVuc2lvbiwgY2FwYWJsZSBvZiBkb2luZyB0aGluZ3MgdGhhdCB3ZSBtaWdodCBwZXJjZWl2ZSBhcyBtYWdpYyBidXQgd2hpY2ggaXMganVzdCBzY2llbmNlIHRvIHRoZW0uIFRoZSB2YXJpb3VzIGRlcGljdGlvbnMgb2YgS3J5cHRvbmlhbiBzY2llbmNlIGluIHZhcmlvdXMgU3VwZXJtYW4gc3RvcmllcyB3YXMgb25lIGluc3BpcmF0aW9uLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUgYW5kIEF1ZHJleScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzA1LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnZWFzdGVyX2lzbGFuZC5wbmcgbmxuNG5rYTAnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMCwgMjUpLFxuICAgIGNvbG9yOiAnI0QzRUNFQycsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzA1LmpwZycsXG4gICAgY2FwdGlvbjogJ1RoaXMgaXMgdGhlIGZpcnN0IGVwaXNvZGUgaW4gU2Vhc29uIDUgaW4gd2hpY2ggd2XigJl2ZSBsb3N0IG9uZSBvZiBvdXIgaGVyb2VzLiBJdCB3YXMgaW1wb3J0YW50IHRvIGhhcHBlbiBhcyB3ZSBoZWFkIGludG8gdGhlIGhvbWUgc3RyZXRjaCBvZiB0aGUgc2hvdyBhbmQgYXMgdGhlIHN0YWtlcyBpbiBIYXZlbiBoYXZlIG5ldmVyIGJlZW4gbW9yZSBkaXJlLiBBcyBhIHJlc3VsdCwgaXQgd29u4oCZdCBiZSB0aGUgbGFzdCBsb3NzIHdlXFwnbGwgc3VmZmVyIHRoaXMgc2Vhc29u4oCmJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ1dpbGQgQ2FyZCcsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzA2LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAncHlyYW1pZHMucG5nIGZkYnk2NCcsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDEwLCAyNSksXG4gICAgY29sb3I6ICcjMkE3QzkxJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDYuanBnJyxcbiAgICBjYXB0aW9uOiAnVGhlIGNoYWxsZW5nZSBpbiBDaGFybG90dGVcXCdzIGZpbmFsIGNvbmZyb250YXRpb24gd2FzIHRoYXQgdGhlIHNob3cgY291bGRu4oCZdCByZXZlYWwgaGVyIGF0dGFja2Vy4oCZcyBhcHBlYXJhbmNlIHRvIHRoZSBhdWRpZW5jZSwgc28gdGhlIGRhcmtuZXNzIHdhcyBuZWNlc3NpdGF0ZWQuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG5cbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDEuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzYW5fZnJhbmNpc29fYnJpZGdlLnBuZyA0MjM0ZmY1MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDEwLCAyNSksXG4gICAgY29sb3I6ICcjOTY3ODQwJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDEuanBnJyxcbiAgICBjYXB0aW9uOiAnV2FybmluZzogSWYgeW91IGRvblxcJ3Qgd2FudCB0byBrbm93IHdoYXQgaGFwcGVuZWQgaW4gdGhpcyBlcGlzb2RlLCBkb25cXCd0IHJlYWQgdGhpcyBwaG90byByZWNhcCEgRGF2ZSBqdXN0IGhhZCBhbm90aGVyIHZpc2lvbiBhbmQgdGhpcyB0aW1lLCBoZVxcJ3MgYmVpbmcgcHJvYWN0aXZlIGFib3V0IGl0LiBIZSBhbmQgVmluY2UgZGFzaCBvdXQgb2YgdGhlIGhvdXNlIHRvIHNhdmUgdGhlIGxhdGVzdCB2aWN0aW1zIG9mIENyb2F0b2FuLCBhLmsuYSB0aGUgTm8gTWFya3MgS2lsbGVyLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wMi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3N0b25lX2hlbmdlLnBuZyA0OTBtbm1hYmQnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMCwgMjUpLFxuICAgIGNvbG9yOiAnIzU2NkY3OCcsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAyLmpwZycsXG4gICAgY2FwdGlvbjogJ01lYW53aGlsZSwgRHdpZ2h0IGFuZCBOYXRoYW4gZ28gZG93bnRvd24gdG8gaW52ZXN0aWdhdGUgd2hhdCB0aGV5IHRoaW5rIGlzIGEgZHJ1bmtlbiBtYW4gY2F1c2luZyBhIGRpc3R1cmJhbmNlIGJ1dCBpdCB0dXJucyBvdXQgdGhhdCB0aGUgZ3V5IGlzIGN1cnNlZC4gVGhlcmUgaXMgYSByb21hbiBudW1lcmFsIG9uIGhpcyB3cmlzdCBhbmQsIGFzIHRoZXkgd2F0Y2gsIGludmlzaWJsZSBob3JzZXMgdHJhbXBsZSBoaW0uIExhdGVyLCBOYXRoYW4gYW5kIER3aWdodCBmaW5kIGFub3RoZXIgbWFuIHdobyBhcHBlYXJzIHRvIGhhdmUgYmVlbiBzdHJ1Y2sgYnkgbGlnaHRlbmluZyDigJMgYnV0IHRoZXJlIGhhZCBiZWVuIG5vIHJlY2VudCBzdG9ybSBpbiB0b3duIOKAkyBhbmQgZHJvcHBlZCBmcm9tIGEgc2t5c2NyYXBlci4gU2t5c2NyYXBlcnMgaW4gSGF2ZW4/IEFic3VyZC4gQW5kIHRoZSBndXkgYWxzbyBoYXMgYSBteXN0ZXJpb3VzIFJvbWFuIG51bWVyYWwgdGF0dG9vIG9uIGhpcyB3cmlzdC4gTmF0aGFuIGFuZCBEd2lnaHQgZmluZCBhIGxpc3Qgb2YgbmFtZXMgaW4gdGhlIGd1eVxcJ3MgcG9ja2V0IHRoYXQgbGVhZHMgdGhlbSB0byBhIGxvY2FsIGZvcnR1bmUgdGVsbGVyLCBMYWluZXkuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAzLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc3lkbmV5X29wZXJhX2hvdXNlLnBuZyAwc2VkNjdoJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTAsIDI1KSxcbiAgICBjb2xvcjogJyMyRTFEMDcnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wMy5qcGcnLFxuICAgIGNhcHRpb246ICdCeSBmb2xsb3dpbmcgdGhlIGNsdWVzIGZyb20gRGF2ZVxcJ3MgdmlzaW9uLCBoZSBhbmQgVmluY2UgZmluZCB0aGUgc2NlbmUgb2YgdGhlIE5vIE1hcmsgS2lsbGVyXFwncyBtb3N0IHJlY2VudCBjcmltZS4gVGhleSBhbHNvIGZpbmQgYSBzdXJ2aXZvci4gVW5mb3J0dW5hdGVseSwgc2hlIGNhblxcJ3QgcmVtZW1iZXIgYW55dGhpbmcuIEhlciBtZW1vcnkgaGFzIGJlZW4gd2lwZWQsIHdoaWNoIGdldHMgdGhlbSB0byB0aGlua2luZyBhYm91dCB3aG8gbWF5IGJlIG5leHQgb24gQ3JvYXRvYW5cXCdzIGxpc3QuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA0LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAndGFqX21haGFsLnBuZyA5NDNuYmthJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTAsIDI1KSxcbiAgICBjb2xvcjogJyMwMDQ0NUYnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNC5qcGcnLFxuICAgIGNhcHRpb246ICdPbiB0aGVpciB3YXkgdG8gbWVldCB3aXRoIExhaW5leSwgTmF0aGFuIGJyZWFrcyBoaXMgdGlyZSBpcm9uIHdoaWxlIHRyeWluZyB0byBmaXggYSBmbGF0IHRpcmUuIFRvdWdoIGJyZWFrLiBBbmQgdGhlbiBEd2lnaHQgZ2V0cyBhIHNob290aW5nIHBhaW4gaW4gaGlzIHNpZGUgd2l0aCBhIGduYXJseSBicnVpc2UgdG8gbWF0Y2gsIGV2ZW4gdG91Z2hlciBicmVhay4gQW5kIHRoZW4gYm90aCBndXlzIG5vdGljZSB0aGF0IHRoZXkgbm93IGhhdmUgUm9tYW4gbnVtZXJhbCB0YXR0b29zIG9uIHRoZWlyIHdyaXN0cy4gVGhlIG51bWJlciBYIGZvciBOYXRoYW4gYW5kIFhJSSBmb3IgRHdpZ2h0LicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3dpbmRtaWxsLnBuZyBqZXJsMzQnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTEpLFxuICAgIGNvbG9yOiAnIzJGMzgzNycsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA1LmpwZycsXG4gICAgY2FwdGlvbjogJ0luIHRoZSBtaW5lc2hhZnQsIENoYXJsb3R0ZSBhbmQgQXVkcmV5IGhhdmUgdGFrZW4gb24gdGhlIHRhc2sgb2YgY29sbGVjdGluZyBhbGwgb2YgdGhlIGFldGhlciB0byBjcmVhdGUgYW4gYWV0aGVyIGNvcmUuIFRoaXMgaXMgdGhlIGZpcnN0IHN0ZXAgdGhleSBuZWVkIHRvIGNyZWF0ZSBhIG5ldyBCYXJuIHdoZXJlIFRyb3VibGUgcGVvcGxlIGNhbiBzdGVwIGluc2lkZSBhbmQgdGhlbiBiZSBcImN1cmVkXCIgb2YgdGhlaXIgVHJvdWJsZXMgd2hlbiB0aGV5IHN0ZXAgb3V0LiBTb3VuZHMgZWFzeSBlbm91Z2ggYnV0IHRoZXlcXCdyZSBoYXZpbmcgdHJvdWJsZSBjb3JyYWxsaW5nIGFsbCB0aGUgYWV0aGVyIGludG8gYSBnaWFudCBiYWxsLiBVbnN1cnByaXNpbmdseSwgdGhlIHN3aXJsaW5nIGJsYWNrIGdvbyBpc25cXCd0IHdpbGxmdWxseSBjb29wZXJhdGluZy4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDYuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd0cmVlXzEucG5nJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDE0KSxcbiAgICBjb2xvcjogJyM2MzYyNEMnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNi5qcGcnLFxuICAgIGNhcHRpb246ICdBcyBpZiB0aGUgYWV0aGVyIHdhc25cXCd0IGVub3VnaCBvZiBhIHByb2JsZW0gdG8gdGFja2xlLCBDaGFybG90dGUgZmVlbHMgaGVyc2VsZiBnZXR0aW5nIHdlYWtlciBieSB0aGUgbWludXRlIGFuZCB0aGVuIEF1ZHJleSBzdGFydHMgdG8gbG9zZSBoZXIgZXllc2lnaHQuIFRoZXkgbG9vayBhdCB0aGVpciB3cmlzdHMgYW5kIG5vdGljZSB0aGF0IHRoZSBSb21hbiBudW1iZXIgcHJvYmxlbSBoYXMgbm93IGFmZmVjdGVkIHRoZW0gdG9vLCB0aGUgbnVtYmVycyBJSSBmb3IgQXVkcmV5IGFuZCBWSUlJIGZvciBDaGFybG90dGUuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA3LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAndHJlZV8yLnBuZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxNCksXG4gICAgY29sb3I6ICcjNEE1MDRFJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDcuanBnJyxcbiAgICBjYXB0aW9uOiAnSW4gTm9ydGggQ2Fyb2xpbmEsIER1a2UgYW5kIFNldGggc2l0IHdpdGggYSBsb2NhbCBtYW4gd2hvIGNsYWltcyB0byBiZSBhYmxlIHRvIHJlbW92ZSB0aGUgXCJibGFjayB0YXJcIiBmcm9tIER1a2VcXCdzIHNvdWwuIEFmdGVyIGFuIGVsYWJvcmF0ZSBwZXJmb3JtYW5jZSwgRHVrZSByZWFsaXplcyB0aGF0IHRoZSBndXkgaXMgYSBmYWtlLiBUaGUgcmF0dGxlZCBndXkgd2hvIGRvZXNuXFwndCB3YW50IGFueSB0cm91YmxlIGZyb20gRHVrZSB0ZWxscyB0aGVtIHRoYXQgV2FsdGVyIEZhcmFkeSB3aWxsIGhhdmUgdGhlIHJlYWwgYW5zd2VycyB0byBEdWtlXFwncyBxdWVzdGlvbnMuIFdoZW4gdGhleSBnbyBsb29raW5nIGZvciBXYWx0ZXIsIHRoZXkgZmluZCBoaW0g4oCmIGFuZCBoaXMgaGVhZHN0b25lIHRoYXQgaGFzIGEgZmFtaWxpYXIgbWFya2luZyBvbiBpdCwgdGhlIHN5bWJvbCBmb3IgVGhlIEd1YXJkLiBXaGF0IGdpdmVzPyBKdXN0IGFzIER1a2UgaXMgYWJvdXQgdG8gZ2l2ZSB1cCBoZSBnZXRzIGEgdmlzaXQgZnJvbSBXYWx0ZXJcXCdzIGdob3N0IHdobyBwcm9taXNlcyB0byBnaXZlIGhpbSBhbnN3ZXJzIHRvIGFsbCBvZiB0aGUgcXVlc3Rpb25zIOKApnZpYSB0aGUgbmV4dCBlcGlzb2RlIG9mIGNvdXJzZS4gQ2xpZmZoYW5nZXIhJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA4LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAndHJlZV8zLnBuZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxNCksXG4gICAgY29sb3I6ICcjREQ5RjAwJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDguanBnJyxcbiAgICBjYXB0aW9uOiAnQWZ0ZXIgc29tZSBwcm9kZGluZywgRHdpZ2h0IGFuZCBOYXRoYW4gZmluZCB0aGF0IExhaW5leSBnb3QgYSB2aXNpdCBmcm9tIENyb2F0b2FuIGFuZCBcImxvc3QgdGltZVwiLiBTaGUgZG9lc25cXCd0IHJlbWVtYmVyaW5nIGRyYXdpbmcgY2FyZHMgZm9yIGFueSBvZiB0aGVtLiBOYXRoYW4gaGFzIGhlciBkcmF3IG5ldyBjYXJkcyBhbmQgYSBoZXNpdGFudCBMYWluZXkgZG9lcy4gRHdpZ2h0IGlzIGdpdmVuIGEgYm9uZGFnZSBmYXRlIGFuZCBpcyBsYXRlciBzaGFja2xlZCBieSBjaGFpbnMgdG8gYSBnYXRlLCBDaGFybG90dGUgd2lsbCBiZSByZXVuaXRlZCB3aXRoIGhlciB0cnVlIGxvdmUgKGhtbeKApikgYW5kIEF1ZHJleSBpcyBhbGlnbmVkIHdpdGggdGhlIG1vb24uIE5vdCBwZXJmZWN0IGZhdGVzLCBidXQgaXRcXCdzIGVub3VnaCB0byBnZXQgZXZlcnlvbmUgb3V0IG9mIHRoZSBwaWNrbGVzIHRoZWlyIGN1cnJlbnRseSBpbi4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDkuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd0cmVlXzQucG5nJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDE0KSxcbiAgICBjb2xvcjogJyM4RkM5OUInLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wOS5qcGcnLFxuICAgIGNhcHRpb246ICdXaXRoIHRoZWlyIHN0cmVuZ3RoIHJlZ2FpbmVkLCBBdWRyZXkgYW5kIENoYXJsb3R0ZSBhcmUgYWJsZSB0byBjcmVhdGUgdGhlIGFldGhlciBjb3JlIHRoZXkgbmVlZC4gQ2hhcmxvdHRlIGluc3RydWN0cyBBdWRyZXkgdG8gZ28gYW5kIGhpZGUgaXQgc29tZSBwbGFjZSBzYWZlLiBJbiB0aGUgaW50ZXJpbSwgQ2hhcmxvdHRlIGtpc3NlcyBEd2lnaHQgZ29vZGJ5ZSBhbmQgZ2l2ZXMgaGltIHRoZSByaW5nIHNoZSBvbmNlIHVzZWQgdG8gc2xpcCBpbnRvIFRoZSBWb2lkLiBMYXRlciwgd2l0aCBoZXIgbW9vbiBhbGlnbm1lbnQgY2F1c2luZyBBdWRyZXkgdG8gZGlzYXBwZWFyIGFuZCBEd2lnaHQgc3RpbGwgc2hhY2tsZWQsIExhaW5leSBwdWxscyBhbm90aGVyIGNhcmQgZm9yIHRoZSBlbnRpcmUgZ3JvdXAsIGEganVkZ21lbnQgY2FyZCwgd2hpY2ggc2hlIHJlYWRzIHRvIG1lYW4gdGhhdCBhcyBhbG9uZyBhcyB0aGVpciBpbnRlbnRpb25zIGFyZSBwdXJlIHRoZXkgY2FuIGFsbCBvdmVyY29tZSBhbnkgb2JzdGFjbGVzLiBUaGlzIGlzIGdyZWF0IG5ld3MgZm9yIGV2ZXJ5b25lIGV4Y2VwdC4uLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8xMC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3RyZWVfNS5wbmcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTQpLFxuICAgIGNvbG9yOiAnI0JGQzlBMicsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzEwLmpwZycsXG4gICAgY2FwdGlvbjogJ0NoYXJsb3R0ZS4gQ3JvYXRvYW4gcGF5cyBoZXIgYSB2aXNpdCBpbiBoZXIgYXBhcnRtZW50IHRvIHRlbGwgaGVyIHRoYXQgaGVcXCdzIHBpc3NlZCB0aGF0IHNoZVxcJ3MgXCJvbmUgb2YgdGhlbSBub3dcIiBhbmQgdGhhdCBzaGUgY2hvc2UgQXVkcmV5IG92ZXIgTWFyYS4gQ3JvYXRvYW4gd2FzdGVzIG5vIHRpbWUgaW4ga2lsbGluZyBDaGFybG90dGUgYW5kIHNoZSBjbGluZ3MgdG8gbGlmZSBmb3IganVzdCBlbm91Z2ggdGltZSB0byBiZSBmb3VuZCBieSBBdWRyZXkgc28gc2hlIGNhbiBnaXZlIGhlciB0aGUgbW9zdCBzaG9ja2luZyBuZXdzIG9mIHRoZSBzZWFzb246IENyb2F0b2FuIGlzIEF1ZHJleVxcJ3MgZmF0aGVyIGFuZCBoZVxcJ3MgZ290IFwicGxhbnNcIiBmb3IgaGVyIScsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvczA1X2UwNTEzXzAxX0NDXzE5MjB4MTA4MC5qcGcnLFxuICAgIGlkOiAndmlkZW9fXzEyMycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxNCksXG4gICAgY29sb3I6ICcjQkZDOUEyJyxcbiAgICB0aXRsZTogJ3MwNV9lMDUxM18wMV9DQ18xOTIweDEwODAnLFxuICAgIGRlc2NyaXB0aW9uOiAnTm93IHRoYXQgRHIuIENyb3NzIGhhcyByZXZlYWxlZCBoZXIgdHJ1ZSBpZGVudGl0eSwgZXZlcnlvbmUgaGFzIGxvdHMgb2YgZmVlbGluZ3MuIER3aWdodCBjYW5cXCd0IGdldCBvdmVyIGZlZWxpbmcgbGlrZSBzaGUgZHVwZWQgaGltLCBBdWRyZXkgdGhpbmtzIERyLiBDcm9zcyBtdXN0IGNhcmUgbW9yZSBhYm91dCBNYXJhIHRoYW4gc2hlIGRvZXMgYWJvdXQgaGVyIGFuZCBOYXRoYW4gaXMgaGFwcHkgdGhhdCB0aGVyZSBpcyBzb21lb25lIGVsc2UgaW4gdG93biB3aG8gaGUgY2FuIGZlZWwuJyxcbiAgICB0eXBlOiAndmlkZW8nLFxuICAgIHBsYXllcjogJ0JyYW5kIFZPRCBQbGF5ZXInLFxuICAgIGVwaXNvZGVOdW1iZXI6ICcxMCcsXG4gICAga2V5d29yZHM6ICdUaGUgRXhwYW5jZSwgU2FsdmFnZSwgTWlsbGVyLCBKdWxpZSBNYW8sIEhvbGRlbiwgVHJhaWxlcicsXG5cbiAgICBhZGRlZEJ5VXNlcklkOiAzNDQ4NzIzLFxuICAgIGF1dGhvcjogJ0phc29uIExvbmcnLFxuICAgIGV4cGlyYXRpb25EYXRlOiAnMjAxNS0wMy0yMyAxMDo1NzowNCcsXG4gICAgZ3VpZDogJzBENjYwQkQ2LTA5NjgtNEY3Mi03QUJDLTQ3MjE1N0RGQUNBQicsXG4gICAgbGluazogJ2Nhbm9uaWNhbHVybDcwZmE2MmZjNmInLFxuICAgIGxpbmtVcmw6ICdodHRwOi8vcHJvZC5wdWJsaXNoZXI3LmNvbS9maWxlLzc4MDYnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9CaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8wNi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzA2LnBuZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNCksXG4gICAgY29sb3I6ICcjQkZDOUEyJyxcbiAgICB0aXRsZTogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzA2LmpwZycsXG4gICAgY2FwdGlvbjogJ0FsZWlzdGVyIGNvbnRpbnVlcyBoaXMgY2hhcm1pbmcgY29ycnVwdGlvbiBvZiBTYXZhbm5haCwgdGVsbGluZyBoZXIgc2hlXFwncyBrZXB0IGxvY2tlZCBpbiBoZXIgcm9vbSB0byBrZWVwIGhlciBzYWZlIGZyb20gaGVyIG5ldyB3ZXJld29sZiBuZWlnaGJvciBhbmQgZW5jb3VyYWdpbmcgaGVyIHRvIHVzZSBoZXIgbGVmdCBoYW5kIHdoZW4gd2llbGRpbmcgaGVyIGFiaWxpdGllcy4gU2F2YW5uYWhcXCdzIGdldHRpbmcgbW9yZSBwb3dlcmZ1bCBldmVyeSBkYXkuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJycsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnQml0dGVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0vKixcbiAge1xuICB1cmw6ICdpbWcvcmVhbC9CaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8wNy5qcGcnLFxuICBmb2NhbFBvaW50OiB7XG4gIGxlZnQ6IDAuNSxcbiAgdG9wOiAwLjVcbn0sXG5pZDogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzA3LnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE0KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzA3LmpwZycsXG5jYXB0aW9uOiAnTWVhbndoaWxlLCBMb2dhbiBoYXMgaW5maWx0cmF0ZWQgdGhlIGNvbXBvdW5kIGFuZCBmaW5kcyBoaXMgYmVsb3ZlZCBSYWNoZWwuIEhlIG1hbmFnZXMgdG8gZnJlZSBoZXIgLi4uIGJ1dCBob3cgZmFyIHdpbGwgdGhleSBnZXQ/JyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JpdHRlbicsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8xNy5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzE3LnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE0KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzE3LmpwZycsXG5jYXB0aW9uOiAnRWxlbmEgd2FrZXMgdXAgdG8gZmluZCBoZXJzZWxmIGluIGEgbmV3IGNlbGwgLi4uJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JpdHRlbicsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8xOC5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzE4LnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE0KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzE4LmpwZycsXG5jYXB0aW9uOiAnLi4uIGFuZCBSaWNoYXJkLCB0aGUgbXV0dCBzaGUgaW50ZXJyb2dhdGVkIGluIEVwaXNvZGUgMSwgaW4gYW5vdGhlci4gUmljaGFyZCBpcyBlbnJhZ2VkIHRoYXQgRWxlbmEgZ2F2ZSBoaW0gdXAgdG8gdGhlc2UgXCJzYWRpc3RpYyBiYXN0YXJkc1wiIGFuZCBhbGwgdG9vIHdpbGxpbmcgdG8gZW5nYWdlIGluIFNvbmRyYVxcJ3MgZXhwZXJpbWVudCB0byBcIm9ic2VydmUgY29tYmF0XCI6IGluIHRoZW9yeSwgRWxlbmEgd2lsbCBoYXZlIHRvIHR1cm4gaW50byBhIHdvbGYgdG8gZGVmZW5kIGhlcnNlbGYgYWdhaW5zdCBSaWNoYXJkXFwncyBhdHRhY2suJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JpdHRlbicsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yMS5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzIxLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE0KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzIxLmpwZycsXG5jYXB0aW9uOiAnT24gaGlnaGVyIGdyb3VuZCwgUmFjaGVsIGFuZCBMb2dhbiBhcmUgbWFraW5nIGEgcnVuIGZvciBpdCwgdGhvdWdoIHRoZSBzeW1ib2wgb24gUmFjaGVsXFwncyBuZWNrIHN0YXJ0cyB0byBzbW9rZSAuLi4nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzIyLmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjIucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjIuanBnJyxcbmNhcHRpb246ICcuLi4gd2hpY2ggYWxzbyBzbG93cyBkb3duIEVsZW5hLCBhZnRlciBSaWNoYXJkLXdvbGYgc3VmZmVycyB0aGUgc2FtZSBibG9vZHkgZmF0ZSBhcyBOYXRlIFBhcmtlciBkaWQgaW4gRXBpc29kZSAxLiBSYWNoZWwsIEVsZW5hIGFuZCBMb2dhbiBhcmUgcmUtY2FwdHVyZWQuJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JpdHRlbicsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yNS5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzI1LnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE0KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzI1LmpwZycsXG5jYXB0aW9uOiAnRWxlbmEgZ2l2ZXMgaW4sIGFuZCBhIHNob2NrZWQgUmFjaGVsIGxlYXJucyBhIGxpdHRsZSBzb21ldGhpbmcgbmV3IGFib3V0IGhlciBvbGQgZnJpZW5kLicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCaXR0ZW4nLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQmxpbmRzcG90XzA3X05VUF8xNzAzMTdfMDMwOC5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JsaW5kc3BvdF8wN19OVVBfMTcwMzE3XzAzMDgucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTYpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQmxpbmRzcG90XzA3X05VUF8xNzAzMTdfMDMwOC5qcGcnLFxuY2FwdGlvbjogJ0JMSU5EU1BPVCAtLSBcIkJvbmUgTWF5IFJvdFwiIEVwaXNvZGUgMTA0IC0tIFBpY3R1cmVkOiAobC1yKSBKYWltaWUgQWxleGFuZGVyIGFzIEphbmUgRG9lLCBTdWxsaXZhbiBTdGFwbGV0b24gYXMgS3VydCBXZWxsZXIgLS0gKFBob3RvIGJ5OiBDaHJpc3RvcGhlciBTYXVuZGVycy9OQkMpJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JsaW5kc3BvdCcsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CbGluZHNwb3RfMDhfTlVQXzE3MDUwM18wMjgzLmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQmxpbmRzcG90XzA4X05VUF8xNzA1MDNfMDI4My5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNiksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCbGluZHNwb3RfMDhfTlVQXzE3MDUwM18wMjgzLmpwZycsXG5jYXB0aW9uOiAnQkxJTkRTUE9UIC0tIFwiQm9uZSBNYXkgUm90XCIgRXBpc29kZSAxMDQgLS0gUGljdHVyZWQ6IEphaW1pZSBBbGV4YW5kZXIgYXMgSmFuZSBEb2UgLS0gKFBob3RvIGJ5OiBHaW92YW5uaSBSdWZpbm8vTkJDKScsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCbGluZHNwb3QnLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQmxpbmRzcG90XzE1X05VUF8xNzA1MDNfMDIwMy5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JsaW5kc3BvdF8xNV9OVVBfMTcwNTAzXzAyMDMucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTYpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQmxpbmRzcG90XzE1X05VUF8xNzA1MDNfMDIwMy5qcGcnLFxuY2FwdGlvbjogJ0JMSU5EU1BPVCAtLSBcIkJvbmUgTWF5IFJvdFwiIEVwaXNvZGUgMTA0IC0tIFBpY3R1cmVkOiBKYWltaWUgQWxleGFuZGVyIGFzIEphbmUgRG9lIC0tIChQaG90byBieTogR2lvdmFubmkgUnVmaW5vL05CQyknLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQmxpbmRzcG90JyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4yMC4xNF9wbS5wbmcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4yMC4xNF9wbS5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNiksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdzY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMjAuMTRfcG0ucG5nJyxcbmNhcHRpb246ICfigJxNb25kYXlzIGdvdCBtZSBsaWtl4oCm4oCdIC0gQGppbW15ZmFsbG9uJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ1RoZSBUb25pZ2h0IFNob3cnLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjE5LjE5X3BtLnBuZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjE5LjE5X3BtLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE2KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4xOS4xOV9wbS5wbmcnLFxuY2FwdGlvbjogJ+KAnFRvbmlnaHQgSSB3YXMgdGhlIG11c2ljYWwgZ3Vlc3Qgb24gVGhlIFRvbmlnaHQgU2hvdyBXaXRoIEppbW15IEZhbGxvbi4gTXkgZmlyc3QgdGltZSBvbiB0aGUgc2hvdyBJIHdhcyAxNCB5ZWFycyBvbGQgYW5kIG5ldmVyIHRob3VnaHQgSVxcJ2QgYmUgYmFjayB0byBwZXJmb3JtIG15IGZpcnN0IHNpbmdsZS4gTG92ZSB5b3UgbG9uZyB0aW1lIEppbW15ISBUaGFua3MgZm9yIGhhdmluZyBtZS4gOikgUFMgSSBtZXQgdGhlIGxlZ2VuZGFyeSBMYWR5IEdhZ2EgYW5kIGFtIHNvIGluc3BpcmVkIGJ5IGhlciB3b3JkcyBvZiB3aXNkb20uICNIQUlab25GQUxMT04gI0xvdmVNeXNlbGbigJ0gLSBAaGFpbGVlc3RlaW5mZWxkJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ1RoZSBUb25pZ2h0IFNob3cnLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjIwLjE1X3BtLnBuZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjIwLjE1X3BtLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE2KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4yMC4xNV9wbS5wbmcnLFxuY2FwdGlvbjogJ+KAnE1vbmRheXMgZ290IG1lIGxpa2XigKbigJ0gLSBAamltbXlmYWxsb24nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnVGhlIFRvbmlnaHQgU2hvdycsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0qL1xuXTtcbmZ1bmN0aW9uIGNyZWF0ZUFzc2V0TGlicmFyeUZpbGUoZmlsZURhdGEpIHtcbiAgLy9IZWxwZXJcbiAgZnVuY3Rpb24gZmlsZVR5cGVFbGVtZW50KGZpbGVEYXRhKSB7XG4gICAgc3dpdGNoIChmaWxlRGF0YS50eXBlKSB7XG4gICAgICBjYXNlICdpbWFnZSc6XG4gICAgICByZXR1cm4gJCgnPGRpdj48aSBjbGFzcz1cImZhIGZhLWNhbWVyYVwiPjwvaT48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdHlwZScpO1xuXG4gICAgICBjYXNlICd2aWRlbyc6XG4gICAgICByZXR1cm4gJCgnPGRpdj48aSBjbGFzcz1cImZhIGZhLXZpZGVvLWNhbWVyYVwiPjwvaT48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdHlwZScpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3R5cGUnKTtcbiAgICB9XG4gIH1cblxuICAvL2NyZWF0ZSBiYXNpYyBlbGVtZW50XG4gIHZhciBmaWxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZSBmaWxlLS1tb2RhbCBmaWxlX3R5cGVfaW1nIGZpbGVfdmlld19ncmlkJyksXG4gIGZpbGVJbmRleCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2hpZGRlbiBmaWxlX19pZCcpLnRleHQoZmlsZURhdGEuaWQpLFxuXG4gIGZpbGVJbWcgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19pbWcnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyBmaWxlRGF0YS51cmwgKyAnKScpLFxuICBmaWxlQ29udHJvbHMgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19jb250cm9scycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuICBmaWxlQ2hlY2ttYXJrID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fY2hlY2ttYXJrJykuY2xpY2sodG9nZ2xlRmlsZVNlbGVjdCksXG4gIGZpbGVUaXRsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3RpdGxlJykudGV4dChmaWxlRGF0YS50aXRsZSk7XG5cbiAgZmlsZUNvbnRyb2xzLmFwcGVuZChmaWxlQ2hlY2ttYXJrLCBmaWxlVHlwZUVsZW1lbnQoZmlsZURhdGEpKTtcbiAgZmlsZUltZy5hcHBlbmQoZmlsZUNvbnRyb2xzKTtcblxuICBmaWxlLmFwcGVuZChmaWxlSW5kZXgsIGZpbGVJbWcsIGZpbGVUaXRsZSk7XG4gIHJldHVybiBmaWxlO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVBc3NldExpYnJhcnkoKSB7XG4gIHZhciBhc3NldExpYnJhcnkgPSAkKCcuYWwgLmZpbGVzIC5zZWN0aW9uX19maWxlcycpO1xuICBhc3NldExpYnJhcnkuZW1wdHkoKTtcbiAgYXNzZXRMaWJyYXJ5T2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcbiAgICBhc3NldExpYnJhcnkucHJlcGVuZChjcmVhdGVBc3NldExpYnJhcnlGaWxlKGYpKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFNlbGVjdGVkRmlsZXMoKSB7XG4gIHZhciBzZWxlY3RlZEZpbGVzID0gJCgnLmFsIC5maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKTtcblxuICBpZiAoc2VsZWN0ZWRGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgc2VsZWN0ZWRGaWxlcy5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICB2YXIgZmlsZUlkID0gJChlbCkuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpO1xuICAgICAgZmlsZSA9IGFzc2V0TGlicmFyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgcmV0dXJuIGYuaWQgPT09IGZpbGVJZDtcbiAgICAgIH0pWzBdO1xuICAgICAgLy9pZiAoIWZpbGVCeUlkKGZpbGVJZCwgZ2FsbGVyeU9iamVjdHMpKSB7XG4gICAgICBnYWxsZXJ5T2JqZWN0cy5wdXNoKHtcbiAgICAgICAgZmlsZURhdGE6IGZpbGUsXG4gICAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgcG9zaXRpb246IDEwMDAsXG4gICAgICAgIGNhcHRpb246ICcnLFxuICAgICAgICBnYWxsZXJ5Q2FwdGlvbjogZmFsc2UsXG4gICAgICAgIGp1c3RVcGxvYWRlZDogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgLy99XG5cbiAgICB9KTtcbiAgICB1cGRhdGVHYWxsZXJ5KGdhbGxlcnlPYmplY3RzLmxlbmd0aCk7XG4gIH1cbn1cblxuLy9SZXF1aXJlZCBmaWVsZHMgY2hlY2tcbmZ1bmN0aW9uIGNoZWNrRmllbGQoZmllbGQpIHtcbiAgICBpZiAoJChmaWVsZCkudmFsKCkgPT09ICcnICYmICQoZmllbGQpLmF0dHIoJ2Rpc3BsYXknKSAhPT0gJ25vbmUnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTt9XG4gICAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBtYXJrRmllbGRBc1JlcXVpcmVkKGZpZWxkKSB7XG4gICAgJChmaWVsZCkuYWRkQ2xhc3MoJ2VtcHR5RmllbGQnKTtcbiAgICBpZiAoJChmaWVsZCkucGFyZW50KCkuY2hpbGRyZW4oJy5lcnJNc2cnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdmFyIG1zZyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2Vyck1zZycpLnRleHQoXCJUaGlzIGZpZWxkIGNvdWxkbid0IGJlIGVtcHR5XCIpO1xuICAgICAgICAkKGZpZWxkKS5wYXJlbnQoKS5hcHBlbmQobXNnKTtcbiAgICB9XG59XG5mdW5jdGlvbiBtYXJrRmllbGRBc05vcm1hbChmaWVsZCkge1xuICAgICQoZmllbGQpLnJlbW92ZUNsYXNzKCdlbXB0eUZpZWxkJyk7XG4gICAgJChmaWVsZCkucGFyZW50KCkuY2hpbGRyZW4oJy5lcnJNc2cnKS5yZW1vdmUoKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tGaWVsZHMoc2VsZWN0b3IpIHtcbiAgICB2YXIgZmllbGRzID0gJChzZWxlY3RvcikucGFyZW50KCkuY2hpbGRyZW4oJ2lucHV0Jyk7XG4gICAgdmFyIHJlc3VsdCA9IHRydWU7XG4gICAgdmFyIGZpcnN0SW5kZXggPSAtMTtcbiAgICBmaWVsZHMuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgaWYgKGNoZWNrRmllbGQoZWwpKSB7XG4gICAgICAgICAgICAvL21hcmtGaWVsZEFzTm9ybWFsKGVsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vbWFya0ZpZWxkQXNSZXF1aXJlZChlbCk7XG4gICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChmaXJzdEluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIGZpcnN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICBlbC5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4kKCdsYWJlbC5yZXF1aWVyZWQnKS5wYXJlbnQoKS5jaGlsZHJlbignaW5wdXQnKS5vbignYmx1cicsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoY2hlY2tGaWVsZChlLnRhcmdldCkpIHtcbiAgICAgICAgLy9tYXJrRmllbGRBc05vcm1hbChlLnRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy9tYXJrRmllbGRBc1JlcXVpcmVkKGUudGFyZ2V0KTtcbiAgICB9XG59KTtcblxuXG4vL0ZvY2FsIHJlY3RhbmdsZSBhbmQgcG9pbnRcbmZ1bmN0aW9uIGFkanVzdFJlY3QoZWwpIHtcblx0dmFyIGltZ1dpZHRoID0gJCgnI3ByZXZpZXdJbWcnKS53aWR0aCgpLFxuXHRcdGltZ0hlaWdodCA9ICQoJyNwcmV2aWV3SW1nJykuaGVpZ2h0KCksXG5cdFx0aW1nT2Zmc2V0ID0gJCgnI3ByZXZpZXdJbWcnKS5vZmZzZXQoKSxcblx0XHRpbWdSYXRpbyA9IGltZ1dpZHRoL2ltZ0hlaWdodCxcblxuXHRcdGVsSCA9IGVsLm91dGVySGVpZ2h0KCksXG5cdFx0ZWxXID0gZWwub3V0ZXJXaWR0aCgpLFxuXHRcdGVsTyA9IGVsLm9mZnNldCgpLFxuXHRcdGVsUmF0aW8gPSBlbFcvZWxILFxuXHRcdGVsQmFja2dyb3VuZFBvc2l0aW9uID0gZWwuY3NzKCdiYWNrZ3JvdW5kLXBvc2l0aW9uJykuc3BsaXQoJyAnKTtcblxuXHRjb25zb2xlLmxvZyhlbEgsIGVsVywgZWxCYWNrZ3JvdW5kUG9zaXRpb24pO1xuXG5cdHJIZWlnaHQgPSBpbWdSYXRpbyA+IGVsUmF0aW8gPyBpbWdIZWlnaHQgOiBpbWdXaWR0aC9lbFJhdGlvO1xuXHRyV2lkdGggPSBpbWdSYXRpbyA+IGVsUmF0aW8gPyBpbWdIZWlnaHQgKiBlbFJhdGlvIDogaW1nV2lkdGg7XG5cdHJPZmZzZXQgPSB7bGVmdDogMCwgdG9wOiAwfTtcblxuXHRpZiAoZWxCYWNrZ3JvdW5kUG9zaXRpb24ubGVuZ3RoID09PSAyKSB7XG5cdFx0aWYgKGVsQmFja2dyb3VuZFBvc2l0aW9uWzBdLmluZGV4T2YoJyUnKSkge1xuXHRcdFx0dmFyIGJnTGVmdFBlcnNlbnQgPSBlbEJhY2tncm91bmRQb3NpdGlvblswXS5zbGljZSgwLC0xKSxcblx0XHRcdFx0YmdMZWZ0UGl4ZWwgPSBNYXRoLnJvdW5kKGltZ1dpZHRoICogYmdMZWZ0UGVyc2VudC8xMDApIC0gcldpZHRoLzI7XG5cblx0XHRcdGNvbnNvbGUubG9nKGVsQmFja2dyb3VuZFBvc2l0aW9uWzBdLCBiZ0xlZnRQZXJzZW50LCBiZ0xlZnRQaXhlbCwgaW1nV2lkdGgsIChiZ0xlZnRQaXhlbCArIHJXaWR0aCkpO1xuXG5cdFx0XHRpZiAoKGJnTGVmdFBpeGVsKSA8IDApIHtiZ0xlZnRQaXhlbCA9IDA7fVxuXHRcdFx0aWYgKChiZ0xlZnRQaXhlbCArIHJXaWR0aCkgPiBpbWdXaWR0aCkge2JnTGVmdFBpeGVsID0gaW1nV2lkdGggLSByV2lkdGg7fVxuXG5cdFx0XHRjb25zb2xlLmxvZyhiZ0xlZnRQaXhlbCwgaW1nV2lkdGgsIChiZ0xlZnRQaXhlbCArIHJXaWR0aC8yKSk7XG5cblx0XHRcdHJPZmZzZXQubGVmdCA9IGltZ1JhdGlvID4gZWxSYXRpbyA/IGJnTGVmdFBpeGVsIDogMDtcblx0XHR9XG5cdFx0aWYgKGVsQmFja2dyb3VuZFBvc2l0aW9uWzFdLmluZGV4T2YoJyUnKSkge1xuXHRcdFx0dmFyIGJnVG9wUGVyc2VudCA9IGVsQmFja2dyb3VuZFBvc2l0aW9uWzFdLnNsaWNlKDAsLTEpLFxuXHRcdFx0XHRiZ1RvcFBpeGVsID0gTWF0aC5yb3VuZChpbWdIZWlnaHQqYmdUb3BQZXJzZW50LzEwMCkgLSBySGVpZ2h0LzI7XG5cblx0XHRcdGlmICgoYmdUb3BQaXhlbCkgPCAwKSB7YmdUb3BQaXhlbCA9IDA7fVxuXHRcdFx0aWYgKChiZ1RvcFBpeGVsICsgckhlaWdodCkgPiBpbWdIZWlnaHQpIHtiZ1RvcFBpeGVsID0gaW1nSGVpZ2h0IC0gckhlaWdodDt9XG5cblx0XHRcdHJPZmZzZXQudG9wID0gaW1nUmF0aW8gPiBlbFJhdGlvID8gMCA6IGJnVG9wUGl4ZWw7XG5cdFx0fVxuXHR9XG5cblx0JCgnLmZvY2FsUmVjdCcpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG5cblx0JCgnLmZvY2FsUmVjdCcpLmNzcygnd2lkdGgnLCByV2lkdGgudG9TdHJpbmcoKSArICdweCcpXG5cdFx0XHRcdFx0XHRcdCAgIC5jc3MoJ2hlaWdodCcsIHJIZWlnaHQudG9TdHJpbmcoKSArICdweCcpXG5cdFx0XHRcdFx0XHRcdCAgIC5jc3MoJ2xlZnQnLCByT2Zmc2V0LmxlZnQudG9TdHJpbmcoKSArICdweCcpXG5cdFx0XHRcdFx0XHRcdCAgIC5jc3MoJ3RvcCcsIHJPZmZzZXQudG9wLnRvU3RyaW5nKCkgKyAncHgnKVxuXHRcdFx0XHRcdFx0XHQgICAuZHJhZ2dhYmxlKHtcblx0XHRcdFx0XHRcdFx0ICAgXHRcdGF4aXM6IGltZ1JhdGlvID4gZWxSYXRpbyA/ICd4JyA6ICd5Jyxcblx0XHRcdFx0XHRcdFx0ICAgXHRcdHN0YXJ0OiBmdW5jdGlvbihlLCB1aSkge1xuXHRcdFx0XHRcdFx0XHRcdCAgICBcdGVsLmNzcygndHJhbnNpdGlvbicsICdub25lJyk7XG5cdFx0XHRcdFx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XHRcdCAgIFx0XHRzdG9wOiBmdW5jdGlvbihlLCB1aSkge1xuXHRcdFx0XHRcdFx0XHQgICBcdFx0XHRlbC5jc3MoJ3RyYW5zaXRpb24nLCAnMC4zcyBlYXNlLW91dCcpO1xuXHRcdFx0XHRcdFx0XHRcdCAgICAgICAgYWRqdXN0UHVycG9zZSgkKGUudGFyZ2V0KSwgZWwpO1xuXHRcdFx0XHRcdFx0XHRcdCAgICB9XG5cdFx0XHRcdFx0XHRcdCAgIFx0fSk7XG5cblx0JCgnLnB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0ZWwucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cbn1cbmZ1bmN0aW9uIGFkanVzdFB1cnBvc2UoZm9jYWxJdGVtLCBwdXJwb3NlSW1nKSB7XG5cblx0XHR2YXIgaW1nID0gJCgnI3ByZXZpZXdJbWcnKSxcblx0XHRpV2lkdGggPSBpbWcud2lkdGgoKSxcblx0XHRpSGVpZ2h0ID0gaW1nLmhlaWdodCgpLFxuXHRcdGlPZmZzZXQgPSBpbWcub2Zmc2V0KCksXG5cblx0XHRwV2lkdGggPSBmb2NhbEl0ZW0ub3V0ZXJXaWR0aCgpLFxuXHRcdHBIZWlnaHQgPSBmb2NhbEl0ZW0ub3V0ZXJIZWlnaHQoKSxcblx0XHRwT2Zmc2V0ID0gZm9jYWxJdGVtLm9mZnNldCgpLFxuXG5cdFx0ZlRvcCA9IE1hdGgucm91bmQoKHBPZmZzZXQudG9wIC0gaU9mZnNldC50b3AgKyBwSGVpZ2h0LzIpKjEwMCAvIGlIZWlnaHQpO1xuXHRcdGZMZWZ0ID0gTWF0aC5yb3VuZCgocE9mZnNldC5sZWZ0IC0gaU9mZnNldC5sZWZ0ICsgcFdpZHRoLzIpICogMTAwIC8gaVdpZHRoKTtcblxuXHQvL2NvbnNvbGUubG9nKGZUb3AsIGZMZWZ0KTtcblx0aWYgKHB1cnBvc2VJbWcpIHtcblx0XHRwdXJwb3NlSW1nLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbicsIGZMZWZ0LnRvU3RyaW5nKCkgKyAnJSAnICsgZlRvcC50b1N0cmluZygpICsgJyUnKTtcblx0fVxuXHRlbHNlIHtcblx0XHQkKCcucHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlIC5wdXJwb3NlLWltZycpLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbicsIGZMZWZ0LnRvU3RyaW5nKCkgKyAnJSAnICsgZlRvcC50b1N0cmluZygpICsgJyUnKTtcblx0fVxuXG59XG5cbiQoJyNmb2NhbFJlY3RUb2dnbGUnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdGlmICgkKGUudGFyZ2V0KS5oYXNDbGFzcygnYWN0aXZlJykpIHtcblx0XHQkKCcucHIgPiAucHJldmlldycpLnJlbW92ZUNsYXNzKCdmb2NhbCBsaW5lIHJlY3QnKTtcblx0XHQkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdH0gZWxzZSB7XG5cdFx0JCgnLnByID4gLnByZXZpZXcnKS5hZGRDbGFzcygnZm9jYWwgbGluZSByZWN0Jyk7XG5cdFx0JCgnLnByID4gLnByZXZpZXcnKS5yZW1vdmVDbGFzcygncG9pbnQnKTtcblx0XHQkKCcjZm9jYWxQb2ludFRvZ2dsZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHQkKGUudGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cblxuXHRcdC8vJCgnLmZvY2FsUmVjdCcpLnJlc2l6YWJsZSh7aGFuZGxlczogXCJhbGxcIiwgY29udGFpbm1lbnQ6IFwiI3ByZXZpZXdJbWdcIn0pO1xuXHRcdGFkanVzdFJlY3QoJCgnLnB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZS1pbWcnKS5maXJzdCgpKTtcblx0XHQkKCcuZm9jYWxSZWN0JykuZHJhZ2dhYmxlKHsgY29udGFpbm1lbnQ6IFwiI3ByZXZpZXdJbWdcIiwgc2Nyb2xsOiBmYWxzZSB9KTtcblxuXHRcdCQoJy5wdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UtaW1nJykudW5iaW5kKCkuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0YWRqdXN0UmVjdCgkKGUudGFyZ2V0KSk7XG5cdFx0fSk7XG5cdFx0Ly8kKCcuaW1nLXdyYXBwZXInKS5jc3MoJ21heC13aWR0aCcsICc5MCUnKTtcblx0XHRzZXRQdXJwb3NlUGFnaW5hdGlvbigpO1xuXHR9XG59KTtcblxuLy9VdGlsaXRpZXNcblxuLy9UaHJvdHRsZSBTY3JvbGwgZXZlbnRzXG47KGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aHJvdHRsZSA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIG9iaikge1xuICAgICAgICBvYmogPSBvYmogfHwgd2luZG93O1xuICAgICAgICB2YXIgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICB2YXIgZnVuYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBvYmouZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQobmFtZSkpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBvYmouYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmdW5jKTtcbiAgICB9O1xuXG4gICAgLyogaW5pdCAtIHlvdSBjYW4gaW5pdCBhbnkgZXZlbnQgKi9cbiAgICB0aHJvdHRsZSAoXCJzY3JvbGxcIiwgXCJvcHRpbWl6ZWRTY3JvbGxcIik7XG4gICAgdGhyb3R0bGUgKFwicmVzaXplXCIsIFwib3B0aW1pemVkUmVzaXplXCIpO1xufSkoKTtcblxuLy9TdGlja3kgdG9wYmFyXG5mdW5jdGlvbiBTdGlja3lUb3BiYXIoKSB7XG4gICAgdGhpcy5faW5pdCgpO1xufVxuXG5TdGlja3lUb3BiYXIucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYubGFzdFNjcm9sbFBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICBzZWxmLnRvcGJhclRyYW5zaXRpb24gPSBmYWxzZTtcblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvcHRpbWl6ZWRTY3JvbGxcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgc2Nyb2xsUG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgICAgIGlmIChzY3JvbGxQb3MgPj0gNTUgJiYgISQoJy5jLUhlYWRlci10aXRsZScpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAkKCcuYy1IZWFkZXItdGl0bGUnKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCA1NSAmJiAkKCcuYy1IZWFkZXItdGl0bGUnKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgJCgnLmMtSGVhZGVyLXRpdGxlJykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJCgnLmMtSGVhZGVyLWNvbnRyb2xzJykuaGFzQ2xhc3MoJ2MtSGVhZGVyLWNvbnRyb2xzLS1jZW50ZXInKSkge1xuICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA1NSAmJiAhJCgnLmMtSGVhZGVyLWNvbnRyb2xzJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXItY29udHJvbHMtLWNlbnRlcicpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCA1NSAmJiAkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlci1jb250cm9scy0tY2VudGVyJykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJCgnLmMtSGVhZGVyLWNvbnRyb2xzJykuaGFzQ2xhc3MoJ2hlYWRlcl9fY29udHJvbHMtLWZpbHRlcicpKSB7XG4gICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDU1ICYmICEkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5oZWFkZXJfX2NvbnRyb2xzLS1maWx0ZXInKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgNTUgJiYgJCgnLmMtSGVhZGVyLWNvbnRyb2xzJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuaGVhZGVyX19jb250cm9scy0tZmlsdGVyJykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2MtSGVhZGVyLS1jb250cm9scycpKSB7XG4gICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDE0NSAmJiAhJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXInKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgMTQ1ICYmICQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyJykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2hlYWRlci0tZmlsdGVyJykpIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gNzAgJiYgISQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDcwICYmICQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyJykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDg1ICYmICEkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlcicpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCA4NSAmJiAkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlcicpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoJy5saWJyYXJ5X19oZWFkZXInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDcwICYmICEkKCcubGlicmFyeV9faGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcubGlicmFyeV9faGVhZGVyJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDcwICYmICQoJy5saWJyYXJ5X19oZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5saWJyYXJ5X19oZWFkZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gOTMwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA1NSAmJiAhJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCA1NSAmJiAkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gMTAgJiYgISQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgMTAgJiYgJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9KTtcbn07XG5cbi8vU2Nyb2xsU3B5TmF2XG47KGZ1bmN0aW9uKHdpbmRvdykge1xuICAgIC8vJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gU2Nyb2xsU3B5TmF2KGVsKSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcblxuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgICAgIHRoaXMuX2luaXRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBTY3JvbGxTcHlOYXYucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG9mZnNldDogdGhpcy5lbC5kYXRhc2V0LnRvcE9mZnNldFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXS5zbGljZS5jYWxsKHRoaXMuZWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJykpLm1hcChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgdmFyIGl0ZW1JZCA9IGVsLmRhdGFzZXQuaHJlZjtcbiAgICAgICAgICAgIHJldHVybiB7bmF2SXRlbTogZWwsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGl0ZW1JZCl9O1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgU2Nyb2xsU3B5TmF2LnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvcHRpbWl6ZWRTY3JvbGxcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgaWYgKCFzZWxmLnNjcm9sbGluZ1RvSXRlbSkge1xuICAgICAgICAgICAgICAgIHZhciBtYWluSXRlbXMgPSBzZWxmLml0ZW1zLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbEJDUiA9IGl0ZW0uaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsQkNSLnRvcCA+IHNlbGYub3B0aW9ucy5vZmZzZXQgJiYgZWxCQ1IudG9wIDwgd2luZG93LmlubmVySGVpZ2h0IC8gMjtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmIChtYWluSXRlbXMubGVuZ3RoID4gMCAmJiAoIXNlbGYubWFpbkl0ZW0gfHwgc2VsZi5tYWluSXRlbSAhPT0gbWFpbkl0ZW1zWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm1haW5JdGVtID0gbWFpbkl0ZW1zWzBdO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaS5uYXZJdGVtLmNsYXNzTGlzdC5yZW1vdmUoc2VsZi5vcHRpb25zLmFjdGl2ZUNsYXNzIHx8ICdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubWFpbkl0ZW0ubmF2SXRlbS5jbGFzc0xpc3QuYWRkKHNlbGYub3B0aW9ucy5hY3RpdmVDbGFzcyB8fCAnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzZWxmLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgaXRlbS5uYXZJdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHZhciBocmVmID0gJyMnICsgZS50YXJnZXQuZGF0YXNldC5ocmVmO1xuICAgICAgICAgICAgICAgIHZhciBvZmZzZXRUb3AgPSBocmVmID09PSBcIiNcIiA/IDAgOiAkKGhyZWYpLm9mZnNldCgpLnRvcCAtIHNlbGYub3B0aW9ucy5vZmZzZXQgLSAzMDtcbiAgICAgICAgICAgICAgICBzZWxmLnNjcm9sbGluZ1RvSXRlbSA9IHRydWU7XG4gICAgICAgICAgICAgICAgc2VsZi5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgaS5pdGVtLmNsYXNzTGlzdC5yZW1vdmUoc2VsZi5vcHRpb25zLmFjdGl2ZUNsYXNzIHx8ICdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgaS5uYXZJdGVtLmNsYXNzTGlzdC5yZW1vdmUoc2VsZi5vcHRpb25zLmFjdGl2ZUNsYXNzIHx8ICdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcyhzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuXG5cbiAgICAgICAgICAgICAgICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IG9mZnNldFRvcFxuICAgICAgICAgICAgICAgIH0sIDMwMCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2Nyb2xsaW5nVG9JdGVtID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICQoaHJlZikuYWRkQ2xhc3Moc2VsZi5vcHRpb25zLmFjdGl2ZUNsYXNzIHx8ICdpcy1hY3RpdmUnKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBpbml0U2Nyb2xsU3B5TmF2KCkge1xuICAgICAgICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1zY3JvbGxTcHlOYXYnKSkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbmV3IFNjcm9sbFNweU5hdihlbCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpbml0U2Nyb2xsU3B5TmF2KCk7XG5cbn0pKHdpbmRvdyk7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4vLyBDb250cm9sc1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbi8vdGV4dGZpZWxkc1xuLy87KGZ1bmN0aW9uKHdpbmRvdykge1xuLy8gICAgJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBUZXh0ZmllbGQoZWwsIG9wdGlvbnMpIHtcbiAgdGhpcy5lbCA9IGVsO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gIHRoaXMuX2luaXQoKTtcbiAgdGhpcy5faW5pdEV2ZW50cygpO1xufVxuXG5UZXh0ZmllbGQucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5lbC5wbGFjZWhvbGRlciA9ICcnO1xuXG4gIHRoaXMuZmllbGRXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRoaXMuZmllbGRXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2lucHV0X193cmFwcGVyJyk7XG4gIHRoaXMuZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5maWVsZFdyYXBwZXIsIHRoaXMuZWwpO1xuICB0aGlzLmZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcbiAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdqcy1pbnB1dCcpO1xuICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2lucHV0X19maWVsZCcpO1xuXG4gIGlmICh0aGlzLmVsLnZhbHVlICE9PSAnJykge1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuICAgIHRoaXMuX3RvZ2dsZUFkZGFibGUoKTtcbiAgfVxuXG4gIGlmICh0aGlzLmVsLnR5cGUgPT09ICd0ZXh0YXJlYScpIHt0aGlzLl9hdXRvc2l6ZSgpO31cbiAgaWYgKHRoaXMub3B0aW9ucy5hdXRvY29tcGxldGUpIHt0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2hhcy1hdXRvY29tcGxldGUnKTt9XG4gIGlmICh0aGlzLmVsLmNsYXNzTGlzdC5jb250YWlucygnanMtZGF0ZXBpY2tlcicpKSB7XG4gICAgdmFyIGlkID0gJ2RhdGVQaWNrZXInICsgTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKjEwMDAwKTtcbiAgICB0aGlzLmVsLmlkID0gaWQ7XG4gICAgJCh0aGlzLmVsKS5kYXRlcGlja2VyKHtcbiAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnIycgKyBpZCkuYWRkQ2xhc3MoJ2lucHV0X3N0YXRlX25vdC1lbXB0eSBqcy1oYXNWYWx1ZScpO1xuICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICB9LFxuICAgICAgY2hhbmdlTW9udGg6IHRydWUsXG4gICAgICBjaGFuZ2VZZWFyOiB0cnVlXG4gICAgICAvKm1vbnRoTmFtZXNTaG9ydDogWyBcIkphbnVhclwiLCBcIkZlYnJ1YXJcIiwgXCJNYXJ0c1wiLCBcIkFwcmlsXCIsIFwiTWFqXCIsIFwiSnVuaVwiLCBcIkp1bGlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPa3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiIF0qL1xuICAgIH0pO1xuICB9XG4gIGlmICh0aGlzLmVsLmlkID09PSAnc3RhcnREYXRlJykge1xuICAgICQodGhpcy5lbCkuZGF0ZXBpY2tlcih7XG4gICAgICBvblNlbGVjdDogZnVuY3Rpb24oZGF0ZVN0cmluZywgZGF0ZXBpY2tlcikge1xuICAgICAgICAkKCcjc3RhcnREYXRlJykuYWRkQ2xhc3MoJ2lucHV0X3N0YXRlX25vdC1lbXB0eSBqcy1oYXNWYWx1ZScpO1xuICAgICAgICBzdGFydERhdGUgPSBkYXRlU3RyaW5nO1xuICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICB9LFxuICAgICAgY2hhbmdlTW9udGg6IHRydWUsXG4gICAgICBjaGFuZ2VZZWFyOiB0cnVlXG4gICAgICAvKm1vbnRoTmFtZXNTaG9ydDogWyBcIkphbnVhclwiLCBcIkZlYnJ1YXJcIiwgXCJNYXJ0c1wiLCBcIkFwcmlsXCIsIFwiTWFqXCIsIFwiSnVuaVwiLCBcIkp1bGlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPa3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiIF0qL1xuICAgIH0pO1xuICB9XG4gIGlmICh0aGlzLmVsLmlkID09PSAnZW5kRGF0ZScpIHtcbiAgICAkKHRoaXMuZWwpLmRhdGVwaWNrZXIoe1xuICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKGRhdGVTdHJpbmcsIGRhdGVwaWNrZXIpIHtcbiAgICAgICAgJCgnI2VuZERhdGUnKS5hZGRDbGFzcygnaW5wdXRfc3RhdGVfbm90LWVtcHR5IGpzLWhhc1ZhbHVlJyk7XG4gICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgIH0sXG4gICAgICBiZWZvcmVTaG93OiBmdW5jdGlvbihlbGVtZW50LCBkYXRlcGlja2VyKSB7XG4gICAgICAgICQoJyNlbmREYXRlJykuZGF0ZXBpY2tlcignb3B0aW9uJywgJ2RlZmF1bHREYXRlJywgc3RhcnREYXRlKTtcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VNb250aDogdHJ1ZSxcbiAgICAgIGNoYW5nZVllYXI6IHRydWVcbiAgICAgIC8qbW9udGhOYW1lc1Nob3J0OiBbIFwiSmFudWFyXCIsIFwiRmVicnVhclwiLCBcIk1hcnRzXCIsIFwiQXByaWxcIiwgXCJNYWpcIiwgXCJKdW5pXCIsIFwiSnVsaVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9rdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCIgXSovXG4gICAgfSk7XG4gIH1cblxuICBpZiAodGhpcy5vcHRpb25zLmxhYmVsKSB7XG4gICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgdGhpcy5sYWJlbC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMubGFiZWw7XG4gICAgdGhpcy5sYWJlbC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9fbGFiZWwnKTtcbiAgICB0aGlzLmxhYmVsLmZvciA9IHRoaXMuZWwuaWQ7XG4gICAgdGhpcy5maWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5sYWJlbCk7XG4gIH1cblxuICB0aGlzLmJsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7IC8vVXNlIGFzIGEgaGVscGVyIHRvIG1ha2UgYmxpbmsgYW5pbWF0aW9uIG9uIGZvY3VzIGZpZWxkXG4gIHRoaXMuYmxpbmsuY2xhc3NMaXN0LmFkZCgnaW5wdXRfX2JsaW5rJyk7XG4gIHRoaXMuZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuYmxpbmspO1xuXG4gIGlmICh0aGlzLm9wdGlvbnMuaGVscFRleHQpIHtcbiAgICB0aGlzLmhlbHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5oZWxwVGV4dC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuaGVscFRleHQ7XG4gICAgdGhpcy5oZWxwVGV4dC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9faGVscC10ZXh0Jyk7XG4gICAgdGhpcy5maWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5oZWxwVGV4dCk7XG4gIH1cbiAgaWYgKHRoaXMub3B0aW9ucy5lcnJNc2cpIHtcbiAgICB0aGlzLmVyck1zZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZXJyTXNnLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5lcnJNc2c7XG4gICAgdGhpcy5lcnJNc2cuY2xhc3NMaXN0LmFkZCgnaW5wdXRfX2Vyci1tc2cnKTtcbiAgICB0aGlzLmZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVyck1zZyk7XG4gIH1cbn07XG5cblRleHRmaWVsZC5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAvL0NoZWNrIGlmIGZpZWxkIGlzIGVtcHR5IG9yIG5vdCBhbmQgY2hhbmdlIGNsYXNzIGFjY29yZGluZ2x5XG4gICQodGhpcy5lbCkub24oJ2JsdXInLCBmdW5jdGlvbihlKSB7XG4gICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5wdXRfc3RhdGVfZXJyJyk7XG4gICAgaWYgKGUudGFyZ2V0LnZhbHVlICE9PSAnJykge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIH1cbiAgICBlLnRhcmdldC5wbGFjZWhvbGRlciA9ICcnO1xuICAgIGlmIChlLnRhcmdldC5yZXF1aXJlZCAmJiAhZS50YXJnZXQudmFsdWUpIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2lucHV0X3N0YXRlX2VycicpO1xuICAgIH1cbiAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtzZWxmLmxpc3QucmVtb3ZlKCk7fSwgMTUwKTtcbiAgICB9XG4gICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgfSk7XG5cbiAgLy9PbiBmb2N1cyBldmVudFxuICAkKHRoaXMuZWwpLm9uKCdmb2N1cycsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoc2VsZi5vcHRpb25zLnBsYWNlaG9sZGVyKSB7XG4gICAgICBlLnRhcmdldC5wbGFjZWhvbGRlciA9IHNlbGYub3B0aW9ucy5wbGFjZWhvbGRlcjtcbiAgICB9XG4gICAgaWYgKHNlbGYub3B0aW9ucy5hdXRvY29tcGxldGUpIHtcbiAgICAgIHNlbGYubGlzdCA9IHJlbmRlckF1dG9jb21wbGV0ZUxpc3Qoc2VsZi5vcHRpb25zLmF1dG9jb21wbGV0ZSwgaGFuZGxlQXV0b2NvbXBsZXRlSXRlbUNsaWNrKTtcbiAgICAgIHBsYWNlQXV0b2NvbXBsZXRlTGlzdChzZWxmLmxpc3QsICQoc2VsZi5maWVsZFdyYXBwZXIpKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vT24gY2hhbmdlIGV2ZW50XG4gICQodGhpcy5lbCkub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dF9zdGF0ZV9lcnInKTtcbiAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfVxuICAgIGUudGFyZ2V0LnBsYWNlaG9sZGVyID0gJyc7XG4gICAgaWYgKHNlbGYub3B0aW9ucy5vbkNoYW5nZSkge1xuICAgICAgc2VsZi5vcHRpb25zLm9uQ2hhbmdlKGUpO1xuICAgIH1cbiAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuICB9KTtcblxuICAvL09uIGlucHV0IGV2ZW50XG4gICQoc2VsZi5lbCkub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge1xuICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0X3N0YXRlX2VycicpO1xuICAgIGlmIChlLnRhcmdldC52YWx1ZSAhPT0gJycpIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICB9XG4gICAgZS50YXJnZXQucGxhY2Vob2xkZXIgPSAnJztcbiAgICBpZiAoc2VsZi5vcHRpb25zLm9uSW5wdXQpIHtcbiAgICAgIHNlbGYub3B0aW9ucy5vbklucHV0KGUpO1xuICAgIH1cbiAgICBpZiAoc2VsZi5vcHRpb25zLmF1dG9jb21wbGV0ZSkge1xuICAgICAgdmFyIGRhdGEgPSBzZWxmLm9wdGlvbnMuYXV0b2NvbXBsZXRlLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VsZi5lbC52YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIH0pXG4gICAgICB1cGRhdGVBdXRvY29tcGxldGVMaXN0KHNlbGYubGlzdCwgZGF0YSwgaGFuZGxlQXV0b2NvbXBsZXRlSXRlbUNsaWNrKTtcbiAgICB9XG4gICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgfSk7XG4gICQoc2VsZi5lbCkub24oJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcblxuICBmdW5jdGlvbiBoYW5kbGVLZXlEb3duKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHZhciBpbmRleCwgbGVuZ3RoO1xuICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICBjYXNlIDEzOlxuICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZmluZCgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICBzZWxlY3RJdGVtKHNlbGYubGlzdC5maW5kKCdpcy1oaWdodGxpZ2h0ZWQnKS5nZXQoMCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgICAgY2FzZSAyNzpcbiAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMzg6XG4gICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5maW5kKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4IC0gMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgPCA1MCkge1xuICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPiAwID8gJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpIC0gJChzZWxmLmxpc3QpLmhlaWdodCgpIDogMFxuICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXG4gICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgNDA6XG4gICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5maW5kKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICBsZW5ndGggPSAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcblxuICAgICAgICAgIGlmICgkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPCAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpKSB7XG4gICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLm91dGVySGVpZ2h0KClcbiAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRleCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCkucG9zaXRpb24oKS50b3AgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCkuaGVpZ2h0KClcbiAgICAgICAgICB9LCA0MDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJBdXRvY29tcGxldGVMaXN0KGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGxpc3QgPSAkKCc8dWwgLz4nKS5hZGRDbGFzcygnYXV0b2NvbXBsZXRlJylcblxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICBsaXN0LmFwcGVuZChyZW5kZXJBdXRvY29tcGxldGVJdGVtKGl0ZW0sIGNhbGxiYWNrKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cbiAgZnVuY3Rpb24gcGxhY2VBdXRvY29tcGxldGVMaXN0KGxpc3QsIHBhcmVudCkge1xuICAgIHBhcmVudC5hcHBlbmQobGlzdCk7XG5cbiAgICB2YXIgcGFyZW50QkNSID0gcGFyZW50LmdldCgwKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICBwYXJlbnRPZmZzZXRUb3AgPSBwYXJlbnQuZ2V0KDApLm9mZnNldFRvcCxcbiAgICBsaXN0QkNSID0gbGlzdC5nZXQoMCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG5cbiAgICBoZWlnaHRDaGVjayA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHBhcmVudEJDUi50b3AgLSBwYXJlbnRCQ1IuaGVpZ2h0IC0gbGlzdEJDUi5oZWlnaHQ7XG5cbiAgICBsaXN0LmdldCgwKS5zdHlsZS50b3AgPSBoZWlnaHRDaGVjayA+IDAgPyBwYXJlbnRPZmZzZXRUb3AgKyBwYXJlbnRCQ1IuaGVpZ2h0ICsgNSArICdweCcgOiBwYXJlbnRPZmZzZXRUb3AgLSBsaXN0QkNSLmhlaWdodCAtIDEwICsgJ3B4JztcbiAgfVxuICBmdW5jdGlvbiB1cGRhdGVBdXRvY29tcGxldGVMaXN0IChsaXN0LCBkYXRhLCBjYWxsYmFjaykge1xuICAgIGxpc3QuZW1wdHkoKTtcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgbGlzdC5hcHBlbmQocmVuZGVyQXV0b2NvbXBsZXRlSXRlbShpdGVtLCBjYWxsYmFjaykpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIHJlbmRlckF1dG9jb21wbGV0ZUl0ZW0oaXRlbSwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gJCgnPGxpIC8+JykuYWRkQ2xhc3MoJ2F1dG9jb21wbGV0ZV9faXRlbScpLmNsaWNrKGNhbGxiYWNrKS5vbignbW91c2VvdmVyJywgaGFuZGxlSXRlbU1vdXNlT3ZlcikudGV4dChpdGVtKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUF1dG9jb21wbGV0ZUl0ZW1DbGljayhlKSB7XG4gICAgc2VsZWN0SXRlbShlLnRhcmdldCk7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlSXRlbU1vdXNlT3ZlcihlKSB7XG4gICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gIH1cbiAgZnVuY3Rpb24gc2VsZWN0SXRlbShpdGVtKSB7XG4gICAgc2VsZi5lbC52YWx1ZSA9IGl0ZW0uaW5uZXJIVE1MO1xuICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgY2xvc2VBdXRvY29tcGxldGUoKTtcbiAgfVxuICBmdW5jdGlvbiBjbG9zZUF1dG9jb21wbGV0ZSgpIHtcbiAgICBzZWxmLmxpc3QucmVtb3ZlKCk7XG4gIH1cbn07XG5cbi8vQXV0b3Jlc2l6ZSB0ZXh0YXJlYVxuVGV4dGZpZWxkLnByb3RvdHlwZS5fYXV0b3NpemUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuZWwudmFsdWUgPT09ICcnKSB7dGhpcy5lbC5yb3dzID0gMTt9XG4gIGVsc2Uge1xuICAgIHZhciB3aWR0aCA9IHRoaXMuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgsXG4gICAgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSxcbiAgICB0ZXh0V2lkdGggPSB0aGlzLmVsLnZhbHVlLmxlbmd0aCAqIDcsXG4gICAgcmUgPSAvW1xcblxccl0vaWc7XG4gICAgbGluZUJyYWtlcyA9IHRoaXMuZWwudmFsdWUubWF0Y2gocmUpO1xuICAgIHJvdyA9IE1hdGguY2VpbCh0ZXh0V2lkdGggLyB3aWR0aCk7XG5cbiAgICByb3cgPSByb3cgPD0gMCA/IDEgOiByb3c7XG4gICAgcm93ID0gdGhpcy5vcHRpb25zLm1heEhlaWdodCAmJiByb3cgPiB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0ID8gdGhpcy5vcHRpb25zLm1heEhlaWdodCA6IHJvdztcblxuICAgIGlmIChsaW5lQnJha2VzKSB7XG4gICAgICByb3cgKz0gbGluZUJyYWtlcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgdGhpcy5lbC5yb3dzID0gcm93O1xuICB9XG59O1xuXG5UZXh0ZmllbGQucHJvdG90eXBlLl90b2dnbGVBZGRhYmxlID0gZnVuY3Rpb24oKSB7XG4gIGlmICgkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmxlbmd0aCA+IDApIHtcbiAgICBjb25zb2xlLmxvZygkKHRoaXMuZWwpLmhhc0NsYXNzKCdqcy1oYXNWYWx1ZScpKTtcbiAgICBpZiAoJCh0aGlzLmVsKS5oYXNDbGFzcygnanMtaGFzVmFsdWUnKSkge1xuICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5hZGRDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5yZW1vdmVDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGluaXRUZXh0ZmllbGRzKCkge1xuICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1pbnB1dCcpKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgbmV3IFRleHRmaWVsZChlbCwge1xuICAgICAgbGFiZWw6IGVsLmRhdGFzZXQubGFiZWwsXG4gICAgICBoZWxwVGV4dDogZWwuZGF0YXNldC5oZWxwVGV4dCxcbiAgICAgIGVyck1zZzogZWwuZGF0YXNldC5lcnJNc2csXG4gICAgICBwbGFjZWhvbGRlcjogZWwucGxhY2Vob2xkZXIsXG4gICAgICBtYXNrOiBlbC5kYXRhc2V0Lm1hc2ssXG4gICAgICBtYXhIZWlnaHQ6IGVsLmRhdGFzZXQubWF4SGVpZ2h0XG4gICAgfSk7XG4gIH0pO1xufVxuXG5pbml0VGV4dGZpZWxkcygpO1xuXG4vL3NlbGVjdGJveFxuLy87KGZ1bmN0aW9uKHdpbmRvdykge1xuICAgIC8vJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gU2VsZWN0Ym94KGVsLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuXG4gICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICAgICAgdGhpcy5faW5pdEV2ZW50cygpO1xuICAgIH1cblxuICAgIFNlbGVjdGJveC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gdGhpcy5vcHRpb25zLml0ZW1zLmluZGV4T2YodGhpcy5vcHRpb25zLnNlbGVjdGVkSXRlbSk7XG4gICAgICAgIHRoaXMub3B0aW9ucy51bnNlbGVjdCA9IHRoaXMub3B0aW9ucy51bnNlbGVjdCAhPT0gLTEgPyAn4oCUwqBOb25lIOKAlCcgOiB0aGlzLm9wdGlvbnMudW5zZWxlY3Q7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5jbGFzc0xpc3QuYWRkKCdzZWxlY3RfX3dyYXBwZXInKTtcbiAgICAgICAgdGhpcy5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLnNlbGVjdFdyYXBwZXIsIHRoaXMuZWwpO1xuICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnanMtc2VsZWN0Ym94Jyk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19maWVsZCcpO1xuXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUl0ZW0gPj0gMCkge1xuICAgICAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5pdGVtc1t0aGlzLmFjdGl2ZUl0ZW1dO1xuICAgICAgICAgICAgdGhpcy5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYWJlbCkge1xuICAgICAgICAgICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5sYWJlbDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19sYWJlbCcpO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5mb3IgPSB0aGlzLmVsLmlkO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGVscFRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmhlbHBUZXh0O1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2hlbHAtdGV4dCcpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuaGVscFRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXJyTXNnKSB7XG4gICAgICAgICAgICB0aGlzLmVyck1zZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmVyck1zZztcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fZXJyLW1zZycpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZXJyTXNnKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBTZWxlY3Rib3gucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAvL0Nsb3NlIGxpc3QgaGVscGVyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlTGlzdCgpIHtcbiAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0Ym94X3N0YXRlX29wZW4nKTtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdFdyYXBwZXIucmVtb3ZlQ2hpbGQoc2VsZi5saXN0KTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWFyY2hGaWVsZCAmJiBzZWxmLnNlYXJjaEZpZWxkLnBhcmVudE5vZGUgPT09IHNlbGYuZWwpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLnJlbW92ZUNoaWxkKHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuaW5wdXRGaWVsZCAmJiBzZWxmLmlucHV0RmllbGQucGFyZW50Tm9kZSA9PT0gc2VsZi5lbCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwucmVtb3ZlQ2hpbGQoc2VsZi5pbnB1dEZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW0gPCAwKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBzZWxmLm9wdGlvbnMuaXRlbXNbc2VsZi5hY3RpdmVJdGVtXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZVNlbGVjdERvY0NsaWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vQ3JlYXRlIGxpc3QgaGVscGVyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUxpc3QoaXRlbXMsIGFjdGl2ZUl0ZW0sIHNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzZWxmLmxpc3QpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgc2VsZi5saXN0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fbGlzdCcpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0SXRlbShpdGVtLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtQ2xhc3MgPSBzZWxmLm9wdGlvbnMuY29tcGxleEl0ZW1zID8gJ3NlbGVjdGJveF9fbGlzdC1pdGVtIHNlbGVjdGJveF9fbGlzdC1pdGVtLS1jb21wbGV4JyA6ICdzZWxlY3Rib3hfX2xpc3QtaXRlbSBzZWxlY3Rib3hfX2xpc3QtaXRlbS0tdGV4dCcsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50ID0gJCgnPGxpPjwvbGk+JykuYWRkQ2xhc3MoaXRlbUNsYXNzKS50ZXh0KGl0ZW0pLFxuICAgICAgICAgICAgICAgICAgICBsaXN0SGVscGVyID0gJCgnPGRpdj48L2Rpdj4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtaXRlbScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdwb3NpdGlvbicsICdhYnNvbHV0ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCd6LWluZGV4JywgJy0xJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdvdmVyZmxvdycsICd2aXNpYmxlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3doaXRlLXNwYWNlJywgJ25vd3JhcCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dChpdGVtKTtcblxuICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZChsaXN0SGVscGVyLmdldCgwKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5hdHRyKCdkYXRhLWluZGV4JywgaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuY29tcGxleEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmdldCgwKS5pbm5lckhUTUwgPSBpdGVtO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzZWFyY2hUZXh0ICYmICFzZWxmLm9wdGlvbnMuY29tcGxleEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmdldCgwKS5pbm5lckhUTUwgPSBsaXN0SXRlbVRleHQoaXRlbSwgc2VhcmNoVGV4dCwgJChzZWxmLmxpc3QpLndpZHRoKCkgPCBsaXN0SGVscGVyLndpZHRoKCkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50Lm9uKCdtb3VzZWRvd24nLCBoYW5kbGVJdGVtQ2xpY2spO1xuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50Lm9uKCdtb3VzZW92ZXInLCBoYW5kbGVJdGVtTW91c2VPdmVyKTtcblxuICAgICAgICAgICAgICAgIGxpc3RIZWxwZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1FbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdEl0ZW1UZXh0KGl0ZW1TdHJpbmcsIHRleHQsIGxvbmcpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0U3RyaW5nID0gaXRlbVN0cmluZztcbiAgICAgICAgICAgICAgICBpZiAobG9uZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgd29yZHMgPSBpdGVtU3RyaW5nLnNwbGl0KCcgJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hJbmRleCA9IHdvcmRzLnJlZHVjZShmdW5jdGlvbihjdXJyZW50SW5kZXgsIHdvcmQsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3RyaW5nID0gd29yZC50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGV4dCkgPiAtMSAmJiBjdXJyZW50SW5kZXggPT09IC0xID8gaW5kZXggOiBjdXJyZW50SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAtMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlYXJjaEluZGV4ID49IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdHJpbmdFbmQgPSB3b3Jkcy5zbGljZShzZWFyY2hJbmRleCkucmVkdWNlKGZ1bmN0aW9uKHN0ciwgd29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHIgKyAnICcgKyB3b3JkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gL1xcLiQvO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRzWzBdLm1hdGNoKHJlZykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTdHJpbmcgPSB3b3Jkc1swXSArICcgJyArIHdvcmRzWzFdICsgJyAuLi4gJyArIHN0cmluZ0VuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3RyaW5nID0gd29yZHNbMF0gKyAnIC4uLiAnICsgc3RyaW5nRW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHN0YXJ0VGV4dEluZGV4ID0gb3V0cHV0U3RyaW5nLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0LnRvTG93ZXJDYXNlKCkpLFxuICAgICAgICAgICAgICAgICAgICBlbmRUZXh0SW5kZXggPSBzdGFydFRleHRJbmRleCArIHRleHQubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IG91dHB1dFN0cmluZy5zbGljZSgwLCBzdGFydFRleHRJbmRleCksXG4gICAgICAgICAgICAgICAgICAgIG1pZGRsZSA9IG91dHB1dFN0cmluZy5zbGljZShzdGFydFRleHRJbmRleCwgZW5kVGV4dEluZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgZW5kID0gb3V0cHV0U3RyaW5nLnNsaWNlKGVuZFRleHRJbmRleCksXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICAgICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3RhcnQpKTtcbiAgICAgICAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKCQoJzxzcGFuPjwvc3Bhbj4nKS5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWhpZ2hsaWdodCcpLnRleHQobWlkZGxlKS5nZXQoMCkpO1xuICAgICAgICAgICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZW5kKSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5pbm5lckhUTUw7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRpdmlkZXIoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICQoJzxsaT48L2xpPicpLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtZGl2aWRlcicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VsZi5saXN0KTtcblxuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy51bnNlbGVjdCAhPT0gLTEgJiYgIXNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3SXRlbSA9IGxpc3RJdGVtKHNlbGYub3B0aW9ucy51bnNlbGVjdCkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCBzZWxlY3Rib3hfX2xpc3QtdW5zZWxlY3QnKTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QuYXBwZW5kQ2hpbGQobmV3SXRlbS5nZXQoMCkpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChkaXZpZGVyKCkuZ2V0KDApKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0l0ZW0gPSBsaXN0SXRlbShpdGVtLCBzZWxmLm9wdGlvbnMuaXRlbXMuaW5kZXhPZihpdGVtKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCAmJiBzZWxmLmxpc3QuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0l0ZW0uYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlSXRlbSA9PT0gaSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdJdGVtLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QuYXBwZW5kQ2hpbGQobmV3SXRlbS5nZXQoMCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBmaWVsZFJlY3QgPSBzZWxmLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgICAgIGZpZWxkT2Zmc2V0VG9wID0gc2VsZi5lbC5vZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIG1lbnVSZWN0ID0gc2VsZi5saXN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuXG4gICAgICAgICAgICAgICAgaGVpZ2h0Q2hlY2sgPSB3aW5kb3dIZWlnaHQgLSBmaWVsZFJlY3QudG9wIC0gZmllbGRSZWN0LmhlaWdodCAtIG1lbnVSZWN0LmhlaWdodDtcblxuICAgICAgICAgICAgc2VsZi5saXN0LnN0eWxlLnRvcCA9IGhlaWdodENoZWNrID4gMCA/IGZpZWxkT2Zmc2V0VG9wICsgZmllbGRSZWN0LmhlaWdodCArIDUgKyAncHgnIDogZmllbGRPZmZzZXRUb3AgLSBtZW51UmVjdC5oZWlnaHQgLSAxMCArICdweCc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RJdGVtKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMudW5zZWxlY3QgJiYgaXRlbS5pbm5lckhUTUwgPT09IHNlbGYub3B0aW9ucy51bnNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHNlbGYuYWN0aXZlSXRlbSA9IC0xO1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0Ym94X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hY3RpdmVJdGVtID0gaXRlbS5kYXRhc2V0LmluZGV4O1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLml0ZW1DYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pdGVtQ2FsbGJhY2soaXRlbSwgc2VsZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1NlbGVjdCBjbGlja1xuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTZWxlY3RDbGljayhlKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLmFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIHRoZXJlIGlzIGFueSBzZWxlY3RlZCBpdGVtLiBJZiBub3Qgc2V0IHRoZSBwbGFjZWhvbGRlciB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW0gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IHNlbGYucGxhY2Vob2xkZXIgfHwgJ1NlbGVjdCc7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIHNlYXJjaCBvcHRpb24gaXMgb24gb3IgdGhlcmUgaXMgbW9yZSB0aGFuIDEwIGl0ZW1zLiBJZiB5ZXMsIGFkZCBzZWFyY2ZpZWxkXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuc2VhcmNoIHx8IHNlbGYub3B0aW9ucy5pdGVtcy5sZW5ndGggPiA3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbGYuc2VhcmNoRmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX3NlYXJjaGZpZWxkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5wbGFjZWhvbGRlciA9IHNlbGYub3B0aW9ucy5zZWFyY2hQbGFjZWhvbGRlciB8fCAnU2VhcmNoLi4uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaGFuZGxlU2VhcmNoRmllbGRJbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaGFuZGxlU2VhcmNoRmllbGRJbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLmlucHV0RmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfc3RhdGVfb3BlbicpO1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVMaXN0KHNlbGYub3B0aW9ucy5pdGVtcywgc2VsZi5hY3RpdmVJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVTZWxlY3REb2NDbGljayk7fSwgMTAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9TZWxlY3QgaXRlbSBoYW5kbGVyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUl0ZW1DbGljayhlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgc2VsZWN0SXRlbShlLnRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlSXRlbU1vdXNlT3ZlcihlKSB7XG4gICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2VsZWN0RG9jQ2xpY2soKSB7XG4gICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vRnVsdGVyIGZ1bmN0aW9uIGZvciBzZWFyY2ZpZWxkXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQoZSkge1xuICAgICAgICAgICAgdmFyIGZJdGVtcyA9IHNlbGYub3B0aW9ucy5pdGVtcy5maWx0ZXIoZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZS50YXJnZXQudmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNyZWF0ZUxpc3QoZkl0ZW1zLCBzZWxmLmFjdGl2ZUl0ZW0sIGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlS2V5RG93bihlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdmFyIGluZGV4LCBsZW5ndGg7XG4gICAgICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdEl0ZW0oc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAyNzpcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCAtIDEpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgPCA1MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpIC0gJChzZWxmLmxpc3QpLmhlaWdodCgpID4gMCA/ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5oZWlnaHQoKSA8ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLm91dGVySGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4KS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4KS5oZWlnaHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9DaGVjayBpZiBmaWVsZCBpcyBlbXB0eSBvciBub3QgYW5kIGNoYW5nZSBjbGFzcyBhY2NvcmRpbmdseVxuICAgICAgICAkKHNlbGYuZWwpLm9uKCdjbGljaycsIGhhbmRsZVNlbGVjdENsaWNrKTtcbiAgICB9O1xuXG4gICAgU2VsZWN0Ym94LnByb3RvdHlwZS5fdG9nZ2xlQWRkYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzLmVsKS5oYXNDbGFzcygnanMtaGFzVmFsdWUnKSkge1xuICAgICAgICAgICAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykuYWRkQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgU2VsZWN0Ym94LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGJveF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gLTE7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRTZWxlY3Rib3hlcygpIHtcbiAgICAgICAgW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtc2VsZWN0Ym94JykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIG5ldyBTZWxlY3Rib3goZWwsIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogZWwuZGF0YXNldC5sYWJlbCxcbiAgICAgICAgICAgICAgICBoZWxwVGV4dDogZWwuZGF0YXNldC5oZWxwVGV4dCxcbiAgICAgICAgICAgICAgICBlcnJNc2c6IGVsLmRhdGFzZXQuZXJyTXNnLFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBlbC5kYXRhc2V0LnBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBKU09OLnBhcnNlKGVsLmRhdGFzZXQuaXRlbXMpLFxuICAgICAgICAgICAgICAgIHNlYXJjaDogZWwuZGF0YXNldC5zZWFyY2gsXG4gICAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI6ZWwuZGF0YXNldC5zZWFyY2hQbGFjZWhvbGRlcixcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogZWwuZGF0YXNldC5yZXF1aXJlZCxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW06IGVsLmRhdGFzZXQuc2VsZWN0ZWRJdGVtLFxuICAgICAgICAgICAgICAgIHVuc2VsZWN0OiBlbC5kYXRhc2V0LnVuc2VsZWN0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdFNlbGVjdGJveGVzKCk7XG5cblxuLy99KSh3aW5kb3cpO1xuXG4vL1RhZ2ZpZWxkc1xuLy87KGZ1bmN0aW9uKHdpbmRvdykge1xuICAgIC8vJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gVGFnZmllbGQoZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICAgICAgdGhpcy5faW5pdEV2ZW50cygpO1xuICAgIH1cblxuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMub3B0aW9ucy5pbml0aWFsSXRlbXMgfHwgW107XG5cbiAgICAgICAgdGhpcy50YWdmaWVsZFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy50YWdmaWVsZFdyYXBwZXIuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX3dyYXBwZXInKTtcbiAgICAgICAgdGhpcy5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLnRhZ2ZpZWxkV3JhcHBlciwgdGhpcy5lbCk7XG4gICAgICAgIHRoaXMudGFnZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2pzLXRhZ2ZpZWxkJyk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX2ZpZWxkJyk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYWJlbCkge1xuICAgICAgICAgICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5sYWJlbDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX2xhYmVsJyk7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmZvciA9IHRoaXMuZWwuaWQ7XG4gICAgICAgICAgICB0aGlzLnRhZ2ZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmhlbHBUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0LmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5oZWxwVGV4dDtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX2hlbHAtdGV4dCcpO1xuICAgICAgICAgICAgdGhpcy50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5oZWxwVGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lcnJNc2cpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0aGlzLmVyck1zZy5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuZXJyTXNnO1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX2Vyci1tc2cnKTtcbiAgICAgICAgICAgIHRoaXMudGFnZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZXJyTXNnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICBzZWxmLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5fY3JlYXRlVGFnKGl0ZW0pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy9DbG9zZSBsaXN0IGhlbHBlclxuICAgICAgICBmdW5jdGlvbiBjbG9zZUxpc3QoKSB7XG4gICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RhZ2ZpZWxkX3N0YXRlX29wZW4nKTtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzZWxmLmxpc3QpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLnNlYXJjaEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5yZW1vdmVDaGlsZChzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLmhlbHBlckZpZWxkICYmIHNlbGYuaGVscGVyRmllbGQucGFyZW50Tm9kZSA9PT0gc2VsZi5lbCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwucmVtb3ZlQ2hpbGQoc2VsZi5oZWxwZXJGaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWdmaWVsZF9fdGFnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlVGFnZmllbGREb2NDbGljayk7XG4gICAgICAgICAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL0NyZWF0ZSBsaXN0IGhlbHBlclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVMaXN0KGl0ZW1zLCBhY3RpdmVJdGVtLCBzZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2VsZi5saXN0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICAgIHNlbGYubGlzdC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2xpc3QnKTtcblxuICAgICAgICAgICAgc2VsZi5saXN0SGVscGVyID0gJCgnPGRpdj48L2Rpdj4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1pdGVtJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygncG9zaXRpb24nLCAnYWJzb2x1dGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCd6LWluZGV4JywgJy0xJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnb3BhY2l0eScsIDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdvdmVyZmxvdycsICd2aXNpYmxlJyk7XG5cbiAgICAgICAgICAgIHNlbGYudGFnZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHNlbGYubGlzdEhlbHBlci5nZXQoMCkpO1xuXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fbGlzdC1pdGVtJyk7XG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuaW5uZXJIVE1MID0gaXRlbTtcbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5pZCA9ICdsaXN0SXRlbS0nICsgaTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3RIZWxwZXIudGV4dChpdGVtKTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RJdGVtVGV4dChpdGVtU3RyaW5nLCB0ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3b3JkcyA9IGl0ZW1TdHJpbmcuc3BsaXQoJyAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaEluZGV4ID0gd29yZHMucmVkdWNlKGZ1bmN0aW9uKGN1cnJlbnRJbmRleCwgd29yZCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd29yZC50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGV4dCkgPiAtMSAmJiBjdXJyZW50SW5kZXggPT09IC0xID8gaW5kZXggOiBjdXJyZW50SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAtMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlYXJjaEluZGV4IDwgMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1TdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RyaW5nRW5kID0gd29yZHMuc2xpY2Uoc2VhcmNoSW5kZXgpLnJlZHVjZShmdW5jdGlvbihzdHIsIHdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyICsgJyAnICsgd29yZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlZyA9IC9cXC4kLztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3Jkc1swXS5tYXRjaChyZWcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdvcmRzWzBdICsgJyAnICsgd29yZHNbMV0gKyAnIC4uLiAnICsgc3RyaW5nRW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd29yZHNbMF0gKyAnIC4uLiAnICsgc3RyaW5nRW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaFRleHQgJiYgJChzZWxmLnNlbGVjdFdyYXBwZXIpLndpZHRoKCkgPCBzZWxmLmxpc3RIZWxwZXIud2lkdGgoKSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5pbm5lckhUTUwgPSBsaXN0SXRlbVRleHQoaXRlbSwgc2VhcmNoVGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlSXRlbSA9PT0gaSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlSXRlbUNsaWNrKTtcbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBoYW5kbGVJdGVtTW91c2VPdmVyKTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QuYXBwZW5kQ2hpbGQoaXRlbUVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNlbGYudGFnZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHNlbGYubGlzdCk7XG5cblxuICAgICAgICAgICAgdmFyIGZpZWxkUmVjdCA9IHNlbGYuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICAgICAgZmllbGRPZmZzZXRUb3AgPSBzZWxmLmVsLm9mZnNldFRvcCxcbiAgICAgICAgICAgICAgICB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgbWVudVJlY3QgPSBzZWxmLmxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG5cbiAgICAgICAgICAgICAgICBoZWlnaHRDaGVjayA9IHdpbmRvd0hlaWdodCAtIGZpZWxkUmVjdC50b3AgLSBmaWVsZFJlY3QuaGVpZ2h0IC0gbWVudVJlY3QuaGVpZ2h0O1xuXG4gICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUudG9wID0gaGVpZ2h0Q2hlY2sgPiAwID8gZmllbGRPZmZzZXRUb3AgKyBmaWVsZFJlY3QuaGVpZ2h0ICsgNSArICdweCcgOiBmaWVsZE9mZnNldFRvcCAtIG1lbnVSZWN0LmhlaWdodCAtIDEwICsgJ3B4JztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vU2VsZWN0IGNsaWNrXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVRhZ2ZpZWxkQ2xpY2soZSkge1xuICAgICAgICAgICAgLy9lLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIC8vY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9DcmVhdGUgU2VhcmNoZmllbGRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5zZWFyY2ggfHwgc2VsZi5vcHRpb25zLml0ZW1zLmxlbmd0aCA+IDcgfHwgc2VsZi5vcHRpb25zLmNyZWF0ZVRhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2VsZi5zZWFyY2hGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX19zZWFyY2hmaWVsZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQucGxhY2Vob2xkZXIgPSBzZWxmLm9wdGlvbnMuc2VhcmNoUGxhY2Vob2xkZXIgfHwgJ1NlYXJjaC4uLic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudmFsdWUgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFnZmllbGRfX3RhZycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gc2VsZi5vcHRpb25zLnBsYWNlZm9sZGVyIHx8ICdTZWxlY3QgZnJvbSB0aGUgbGlzdCc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuY2xhc3NMaXN0LmFkZCgnanMtaGVscGVySW5wdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLnN0eWxlLnpJbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBoYW5kbGVTZWFyY2hGaWVsZElucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLmhlbHBlckZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfc3RhdGVfb3BlbicpO1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVMaXN0KHNlbGYub3B0aW9ucy5pdGVtcywgc2VsZi5hY3RpdmVJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVUYWdmaWVsZERvY0NsaWNrKTt9LCAxMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIC8vU2VsZWN0IGl0ZW0gaGFuZGxlclxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RUYWcoZWwpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZ2ZpZWxkX190YWcnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWdmaWVsZF9fc2VhcmNoZmllbGQnKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtaGVscGVySW5wdXQnKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLmhlbHBlckZpZWxkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAoc2VsZi5zZWFyY2hGaWVsZCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5zZXJ0QmVmb3JlKHNlbGYuX2NyZWF0ZVRhZyhlbC5pbm5lckhUTUwpLCBzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLl9jcmVhdGVUYWcoZWwuaW5uZXJIVE1MKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLml0ZW1zLnB1c2goZWwuaW5uZXJIVE1MKTtcblxuICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcblxuICAgICAgICAgICAgaWYgKHNlbGYuc2VhcmNoRmllbGQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGNyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5oZWxwZXJGaWVsZCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgY3JlYXRlTGlzdChzZWxmLm9wdGlvbnMuaXRlbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgICAgICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLml0ZW1DYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pdGVtQ2FsbGJhY2soZWwsIHNlbGYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUl0ZW1DbGljayhlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgc2VsZWN0VGFnKGUudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVJdGVtTW91c2VPdmVyKGUpIHtcbiAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVUYWdmaWVsZERvY0NsaWNrKGUpIHtcbiAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9GdWx0ZXIgZnVuY3Rpb24gZm9yIHNlYXJjZmllbGRcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2VhcmNoRmllbGRJbnB1dChlKSB7XG4gICAgICAgICAgICB2YXIgZkl0ZW1zID0gc2VsZi5vcHRpb25zLml0ZW1zLmZpbHRlcihmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhlLnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY3JlYXRlTGlzdChmSXRlbXMsIHNlbGYuYWN0aXZlSXRlbSwgZS50YXJnZXQudmFsdWUudG9Mb3dlckNhc2UoKSk7XG5cbiAgICAgICAgICAgIGlmIChlLnRhcmdldC52YWx1ZS5zbGljZSgtMSkgPT09ICcsJyAmJiBzZWxmLm9wdGlvbnMuY3JlYXRlVGFncykge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5zZXJ0QmVmb3JlKHNlbGYuX2NyZWF0ZVRhZyhlLnRhcmdldC52YWx1ZS5zbGljZSgwLCAtMSkpLCBzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgICAgIGUudGFyZ2V0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgZS50YXJnZXQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBjcmVhdGVMaXN0KHNlbGYub3B0aW9ucy5pdGVtcyk7XG4gICAgICAgICAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlS2V5RG93bihlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdmFyIGluZGV4LCBsZW5ndGg7XG4gICAgICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdFRhZyhzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJylbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUudGFyZ2V0LnZhbHVlICE9PSAnJyAmJiBzZWxmLm9wdGlvbnMuY3JlYXRlVGFncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbnNlcnRCZWZvcmUoc2VsZi5fY3JlYXRlVGFnKGUudGFyZ2V0LnZhbHVlKSwgc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnRhcmdldC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZS50YXJnZXQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAyNzpcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCAtIDEpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wIDwgNTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPiAwID8gJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpIC0gJChzZWxmLmxpc3QpLmhlaWdodCgpIDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmhlaWdodCgpIDwgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLm91dGVySGVpZ2h0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL0RlbGV0ZSB0YWcgaGFuZGxlXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZURlbGV0ZVRhZyhlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdmFyIHRhZyA9IGUudGFyZ2V0LnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgIHRhZy5yZW1vdmVDaGlsZChlLnRhcmdldCk7XG4gICAgICAgICAgICB2YXIgdGFnVGl0bGUgPSB0YWcuaW5uZXJIVE1MLFxuICAgICAgICAgICAgICAgIHRhZ0luZGV4ID0gc2VsZi5pdGVtcy5pbmRleE9mKHRhZ1RpdGxlKTtcbiAgICAgICAgICAgIGlmICh0YWdJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5pdGVtcyA9IFtdLmNvbmNhdChzZWxmLml0ZW1zLnNsaWNlKDAsIHRhZ0luZGV4KSwgc2VsZi5pdGVtcy5zbGljZSh0YWdJbmRleCArIDEpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5lbC5yZW1vdmVDaGlsZCh0YWcpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWdmaWVsZF9fdGFnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ3RhZ2ZpZWxkX3N0YXRlX29wZW4nKSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IHNlbGYub3B0aW9ucy5wbGFjZWZvbGRlciB8fCAnU2VsZWN0IGZyb20gdGhlIGxpc3QnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcblxuXG4gICAgICAgIH1cblxuICAgICAgICAvL0NoZWNrIGlmIGZpZWxkIGlzIGVtcHR5IG9yIG5vdCBhbmQgY2hhbmdlIGNsYXNzIGFjY29yZGluZ2x5XG4gICAgICAgICQodGhpcy50YWdmaWVsZFdyYXBwZXIpLm9uKCdjbGljaycsICcudGFnZmllbGRfX2ZpZWxkJywgaGFuZGxlVGFnZmllbGRDbGljayk7XG4gICAgICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcblxuICAgIH07XG5cbiAgICAvL0F1dG9yZXNpemUgdGV4dGFyZWFcbiAgICBUYWdmaWVsZC5wcm90b3R5cGUuX2F1dG9zaXplID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmVsLnZhbHVlID09PSAnJykge3RoaXMuZWwucm93cyA9IDE7fVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IHRoaXMuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgsXG4gICAgICAgICAgICAgICAgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSxcbiAgICAgICAgICAgICAgICB0ZXh0V2lkdGggPSB0aGlzLmVsLnZhbHVlLmxlbmd0aCAqIDcsXG4gICAgICAgICAgICAgICAgcm93ID0gTWF0aC5jZWlsKHRleHRXaWR0aCAvIHdpZHRoKTtcblxuICAgICAgICAgICAgcm93ID0gcm93IDw9IDAgPyAxIDogcm93O1xuICAgICAgICAgICAgcm93ID0gdGhpcy5vcHRpb25zLm1heEhlaWdodCAmJiByb3cgPiB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0ID8gdGhpcy5vcHRpb25zLm1heEhlaWdodCA6IHJvdztcblxuICAgICAgICAgICAgdGhpcy5lbC5yb3dzID0gcm93O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vQ3JlYXRlIFRhZyBIZWxwZXJcbiAgICBUYWdmaWVsZC5wcm90b3R5cGUuX2NyZWF0ZVRhZyA9IGZ1bmN0aW9uKHRhZ05hbWUpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICBkZWxUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICB0YWcuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX3RhZycpO1xuICAgICAgICB0YWcuaW5uZXJIVE1MID0gdGFnTmFtZTtcblxuICAgICAgICBkZWxUYWcuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX3RhZy1kZWxldGUnKTtcbiAgICAgICAgZGVsVGFnLmlubmVySFRNTCA9ICfinJUnO1xuICAgICAgICBkZWxUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgc2VsZi5fZGVsZXRlVGFnKGUudGFyZ2V0LnBhcmVudE5vZGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0YWcuYXBwZW5kQ2hpbGQoZGVsVGFnKTtcblxuICAgICAgICByZXR1cm4gdGFnO1xuICAgIH07XG5cbiAgICBUYWdmaWVsZC5wcm90b3R5cGUuX2RlbGV0ZVRhZyA9IGZ1bmN0aW9uKHRhZykge1xuICAgICAgICB0aGlzLmVsLnJlbW92ZUNoaWxkKHRhZyk7XG5cbiAgICAgICAgJCh0YWcpLmZpbmQoJy50YWdmaWVsZF9fdGFnLWRlbGV0ZScpLnJlbW92ZSgpO1xuICAgICAgICB2YXIgdGFnVGl0bGUgPSB0YWcuaW5uZXJIVE1MLFxuICAgICAgICAgICAgdGFnSW5kZXggPSB0aGlzLml0ZW1zLmluZGV4T2YodGFnVGl0bGUpO1xuICAgICAgICBpZiAodGFnSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5pdGVtcyA9IFtdLmNvbmNhdCh0aGlzLml0ZW1zLnNsaWNlKDAsIHRhZ0luZGV4KSwgdGhpcy5pdGVtcy5zbGljZSh0YWdJbmRleCArIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZ2ZpZWxkX190YWcnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgndGFnZmllbGRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICBpZiAodGhpcy5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ3RhZ2ZpZWxkX3N0YXRlX29wZW4nKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gc2VsZi5vcHRpb25zLnBsYWNlZm9sZGVyIHx8ICdTZWxlY3QgZnJvbSB0aGUgbGlzdCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdG9nZ2xlQWRkYWJsZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVsZXRlVGFnQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kZWxldGVUYWdDYWxsYmFjayh0YWcsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBUYWdmaWVsZC5wcm90b3R5cGUuX3RvZ2dsZUFkZGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKCQodGhpcy5lbCkuaGFzQ2xhc3MoJ2pzLWhhc1ZhbHVlJykpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmFkZENsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLnJlbW92ZUNsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLml0ZW1zID0gW107XG4gICAgICAgICQodGhpcy5lbCkuZmluZCgnLnRhZ2ZpZWxkX190YWcnKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgdGhpcy5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBpbml0VGFnZmllbGRzKCkge1xuICAgICAgICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy10YWdmaWVsZCcpKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBuZXcgVGFnZmllbGQoZWwsIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogZWwuZGF0YXNldC5sYWJlbCxcbiAgICAgICAgICAgICAgICBoZWxwVGV4dDogZWwuZGF0YXNldC5oZWxwVGV4dCxcbiAgICAgICAgICAgICAgICBlcnJNc2c6IGVsLmRhdGFzZXQuZXJyTXNnLFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBlbC5kYXRhc2V0LnBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBKU09OLnBhcnNlKGVsLmRhdGFzZXQuaXRlbXMpLFxuICAgICAgICAgICAgICAgIHNlYXJjaDogZWwuZGF0YXNldC5zZWFyY2gsXG4gICAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI6IGVsLmRhdGFzZXQuc2VhcmNoUGxhY2Vob2xkZXIsXG4gICAgICAgICAgICAgICAgY3JlYXRlVGFnczogZWwuZGF0YXNldC5jcmVhdGVOZXdUYWcsXG4gICAgICAgICAgICAgICAgaW5pdGlhbEl0ZW1zOiBlbC5kYXRhc2V0LnNlbGVjdGVkSXRlbXMgPyBKU09OLnBhcnNlKGVsLmRhdGFzZXQuc2VsZWN0ZWRJdGVtcykgOiAnJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGluaXRUYWdmaWVsZHMoKTtcblxuXG4vL30pKHdpbmRvdyk7XG5cbi8vRHJvcGRvd25cbmZ1bmN0aW9uIERyb3Bkb3duKGVsLCBvcHRpb25zKSB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLl9pbml0KCk7XG4gICAgdGhpcy5faW5pdEV2ZW50cygpO1xufVxuXG5Ecm9wZG93bi5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmRyb3Bkb3duV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZHJvcGRvd25XcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2pzLWRyb3Bkb3duV3JhcHBlcicpO1xuICAgIHRoaXMuZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5kcm9wZG93bldyYXBwZXIsIHRoaXMuZWwpO1xuICAgIHRoaXMuZHJvcGRvd25XcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnanMtZHJvcGRvd24nKTtcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2pzLWRyb3Bkb3duSXRlbScpO1xufTtcblxuRHJvcGRvd24ucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy9DbG9zZSBsaXN0IGhlbHBlclxuICAgIGZ1bmN0aW9uIGNsb3NlTGlzdCgpIHtcbiAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJyk7XG4gICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgIHNlbGYuZHJvcGRvd25XcmFwcGVyLnJlbW92ZUNoaWxkKHNlbGYubGlzdCk7XG4gICAgICAgICAgICBzZWxmLmxpc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlT3V0c2lkZUNsaWNrKTtcbiAgICB9XG4gICAgLy9IYW5kbGUgb3V0c2lkZSBkcm9wZG93biBjbGlja1xuICAgIGZ1bmN0aW9uIGhhbmRsZU91dHNpZGVDbGljayhlKSB7XG4gICAgICAgIGNsb3NlTGlzdCgpO1xuICAgIH1cblxuICAgIC8vSGFuZGxlIGRyb3Bkb3duIGNsaWNrXG4gICAgZnVuY3Rpb24gaGFuZGxlRHJvcGRvd25DbGljayhlKSB7XG5cbiAgICAgICAgLy9lLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAoc2VsZi5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLW9wZW4nKSkge2Nsb3NlTGlzdCgpO31cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCdpcy1vcGVuJyk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5jbGFzc0xpc3QuYWRkKCdjLURyb3Bkb3duLWxpc3QnKTtcblxuICAgICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uZGl2aWRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZHJvcGRvd25fX2RpdmlkZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Ryb3Bkb3duX19saXN0LWl0ZW0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmlubmVySFRNTCA9IGl0ZW0uaW5uZXJIVE1MIHx8IGl0ZW0udGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY2FsbGJhY2soZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLndhcm5pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS53YXJuaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGFzLXdhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5saXN0LmFwcGVuZENoaWxkKGl0ZW1FbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNlbGYuZHJvcGRvd25XcmFwcGVyLmFwcGVuZENoaWxkKHNlbGYubGlzdCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbGlzdFJlY3QgPSBzZWxmLmxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAobGlzdFJlY3QubGVmdCArIGxpc3RSZWN0LndpZHRoID4gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5saXN0LnN0eWxlLnJpZ2h0ID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUubGVmdCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChsaXN0UmVjdC50b3AgKyBsaXN0UmVjdC5oZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5saXN0LnN0eWxlLmJvdHRvbSA9ICcxMDAlJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUudG9wID0gJzEwMCUnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZU91dHNpZGVDbGljayk7fSwgMTAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGYuZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVEcm9wZG93bkNsaWNrKTtcbn07XG5cbi8vQWRkYWJsZSBGaWVsZHNcbi8vOyhmdW5jdGlvbih3aW5kb3cpIHtcbiAgICAvLyd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIEFkZGFibGUoZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHtzb3J0YWJsZTogdHJ1ZX07XG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgIH1cblxuICAgIEFkZGFibGUucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtYWRkYWJsZVdyYXBwZXInKTtcbiAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5pbnNlcnRCZWZvcmUoc2VsZi5lbCk7XG5cbiAgICAgICAgc2VsZi5lbC5yZW1vdmVDbGFzcygnanMtYWRkYWJsZScpO1xuICAgICAgICBzZWxmLmVsLmFkZENsYXNzKCdqcy1hZGRhYmxlSXRlbSBjLUFkZGFibGUtaXRlbScpO1xuXG4gICAgICAgIHNlbGYuYWRkYWJsZVJvdyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLWFkZGFibGVSb3cgYy1BZGRhYmxlLXJvdycpO1xuXG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMuc29ydGFibGUpIHtcbiAgICAgICAgICAgIHNlbGYuYWRkYWJsZVJvd0RyYWdIYW5kbGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnYy1BZGRhYmxlLXJvdy1kcmFnSGFuZGxlcicpO1xuICAgICAgICAgICAgc2VsZi5hZGRhYmxlUm93LmFwcGVuZChzZWxmLmFkZGFibGVSb3dEcmFnSGFuZGxlcik7XG5cbiAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuc29ydGFibGUoe1xuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBzZWxmLm9wdGlvbnMgPyBzZWxmLm9wdGlvbnMucGxhY2Vob2xkZXIgfHwgJ2MtQWRkYWJsZS1yb3dQbGFjZWhvbGRlcicgOiAnYy1BZGRhYmxlLXJvd1BsYWNlaG9sZGVyJyxcbiAgICAgICAgICAgICAgICBzdGFydDogZnVuY3Rpb24oZSwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgdWkuaXRlbS5hZGRDbGFzcygnaXMtZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgJChlLnRhcmdldCkuY3NzKCdoZWlnaHQnLCAkKGUudGFyZ2V0KS5oZWlnaHQoKSk7XG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5jc3MoJ2hlaWdodCcsICQoJ2JvZHknKS5oZWlnaHQoKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdG9wOiBmdW5jdGlvbihlLCB1aSkge1xuICAgICAgICAgICAgICAgICAgICB1aS5pdGVtLnJlbW92ZUNsYXNzKCdpcy1kcmFnZ2luZycpO1xuICAgICAgICAgICAgICAgICAgICAkKGUudGFyZ2V0KS5jc3MoJ2hlaWdodCcsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmNzcygnaGVpZ2h0JywgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5hZGRCdXR0b24gPSAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24tLXJvdW5kIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXkgYnV0dG9uLS1hZGQgYy1BZGRhYmxlLXJvdy1hZGRCdXR0b24nKS5jbGljayhoYW5kbGVBZGRSb3cpO1xuXG4gICAgICAgIHNlbGYucmVtb3ZlQnV0dG9uID0gJCgnPGJ1dHRvbj48L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uLS1yb3VuZCBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5IGJ1dHRvbi0tcmVtb3ZlIGpzLWFkZGFibGVSZW1vdmVCdXR0b24nKS5jbGljayhoYW5kbGVSZW1vdmVSb3cpO1xuXG4gICAgICAgIHNlbGYuYWRkYWJsZVJvdy5hcHBlbmQoc2VsZi5lbC5jbG9uZSh0cnVlLCB0cnVlKSwgdGhpcy5yZW1vdmVCdXR0b24sIHRoaXMuYWRkQnV0dG9uKTtcbiAgICAgICAgc2VsZi5vcmlnaW5hbEVsID0gc2VsZi5lbC5jbG9uZSh0cnVlLCB0cnVlKTtcbiAgICAgICAgc2VsZi5lbC5kZXRhY2goKTtcblxuICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLmFwcGVuZCh0aGlzLmFkZGFibGVSb3cuY2xvbmUodHJ1ZSwgdHJ1ZSkpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUFkZFJvdyhlKSB7XG4gICAgICAgICAgICAvL0NoZWNrIGlmIHRoZXJlIGFyZSBtb3JlIHRoYW4gMSBjaGlsZCBhbmQgY2hhbmdlIGNsYXNzXG4gICAgICAgICAgICBpZiAoc2VsZi5hZGRhYmxlV3JhcHBlci5jaGlsZHJlbigpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLmFkZENsYXNzKCdoYXMtbXVsdGlwbGVSb3dzJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ2hhcy1tdWx0aXBsZVJvd3MnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vc2VsZi5hZGRhYmxlV3JhcHBlci5hcHBlbmQoc2VsZi5hZGRhYmxlUm93LmNsb25lKHRydWUsIHRydWUpKTtcbiAgICAgICAgICAgIHNlbGYuX2FkZEl0ZW0oc2VsZi5vcmlnaW5hbEVsLmNsb25lKHRydWUsIHRydWUpLCBzZWxmLm9wdGlvbnM/IHNlbGYub3B0aW9ucy5iZWZvcmVBZGQgOiBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVSZW1vdmVSb3coZSkge1xuICAgICAgICBcdCQoZS50YXJnZXQpLnBhcmVudHMoJy5qcy1hZGRhYmxlUm93JykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoc2VsZi5hZGRhYmxlV3JhcHBlci5jaGlsZHJlbignLmpzLWFkZGFibGVSb3cnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2FkZEl0ZW0oc2VsZi5vcmlnaW5hbEVsLmNsb25lKHRydWUsIHRydWUpLCBzZWxmLm9wdGlvbnM/IHNlbGYub3B0aW9ucy5iZWZvcmVBZGQgOiBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5yZW1vdmVDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ2hhcy1tdWx0aXBsZVJvd3MnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuX2FkZEl0ZW0gPSBmdW5jdGlvbihlbCwgYmVmb3JlQWRkKSB7XG4gICAgICAgICAgICBpZiAoYmVmb3JlQWRkKSB7XG4gICAgICAgICAgICAgICAgYmVmb3JlQWRkKGVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhZGRhYmxlUm93ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtYWRkYWJsZVJvdyBjLUFkZGFibGUtcm93JyksXG4gICAgICAgICAgICAgICAgYWRkQnV0dG9uID0gJCgnPGJ1dHRvbj48L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uLS1yb3VuZCBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5IGJ1dHRvbi0tYWRkIGMtQWRkYWJsZS1yb3ctYWRkQnV0dG9uJykuY2xpY2soaGFuZGxlQWRkUm93KSxcbiAgICAgICAgICAgICAgICByZW1vdmVCdXR0b24gPSAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24tLXJvdW5kIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXkgYnV0dG9uLS1yZW1vdmUganMtYWRkYWJsZVJlbW92ZUJ1dHRvbicpLmNsaWNrKGhhbmRsZVJlbW92ZVJvdyk7XG5cbiAgICAgICAgICAgIGVsLmFkZENsYXNzKCdqcy1hZGRhYmxlSXRlbSBjLUFkZGFibGUtaXRlbScpO1xuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5zb3J0YWJsZSkge1xuICAgICAgICAgICAgICAgIHZhciBhZGRhYmxlUm93RHJhZ0hhbmRsZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjLUFkZGFibGUtcm93LWRyYWdIYW5kbGVyJyk7XG4gICAgICAgICAgICAgICAgYWRkYWJsZVJvdy5hcHBlbmQoYWRkYWJsZVJvd0RyYWdIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZGFibGVSb3cuYXBwZW5kKGVsLCByZW1vdmVCdXR0b24sIGFkZEJ1dHRvbik7XG4gICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLmFwcGVuZChhZGRhYmxlUm93KTtcblxuICAgICAgICAgICAgaWYgKHNlbGYuYWRkYWJsZVdyYXBwZXIuY2hpbGRyZW4oKS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5hZGRDbGFzcygnaGFzLW11bHRpcGxlUm93cycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLnJlbW92ZUNsYXNzKCdoYXMtbXVsdGlwbGVSb3dzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmFmdGVyQWRkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLmFmdGVyQWRkKGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9BdXRvIHNjcm9sbCBwYWdlIHdoZW4gYWRkaW5nIHJvdyBiZWxvdyBzY3JlZW4gYm90dG9tIGVkZ2VcbiAgICAgICAgICAgIHZhciByb3dCb3R0b21FbmQgPSBhZGRhYmxlUm93LmdldCgwKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBhZGRhYmxlUm93LmhlaWdodCgpO1xuICAgICAgICAgICAgaWYgKHJvd0JvdHRvbUVuZCArIDYwID4gJCh3aW5kb3cpLmhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoIHsgc2Nyb2xsVG9wOiAnKz0nICsgTWF0aC5yb3VuZChyb3dCb3R0b21FbmQgKyA2MCAtICQod2luZG93KS5oZWlnaHQoKSkudG9TdHJpbmcoKSB9LCA0MDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5hZGRhYmxlV3JhcHBlcjtcbiAgICAgICAgfTtcbiAgICAgICAgc2VsZi5yZW1vdmVJdGVtID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuY2hpbGRyZW4oKS5zbGljZShpbmRleCwgaW5kZXgrMSkucmVtb3ZlKCk7XG4gICAgICAgICAgICBpZiAoc2VsZi5hZGRhYmxlV3JhcHBlci5jaGlsZHJlbignLmpzLWFkZGFibGVSb3cnKS5sZW5ndGggPD0gMSkge1xuICAgICAgICBcdFx0c2VsZi5hZGRhYmxlV3JhcHBlci5yZW1vdmVDbGFzcygnaGFzLW11bHRpcGxlUm93cycpO1xuICAgICAgICBcdH1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaW5pdEFkZGFibGVGaWVsZHMoKSB7XG4gICAgICAgIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWFkZGFibGUnKSkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbmV3IEFkZGFibGUoJChlbCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuLy99KSh3aW5kb3cpO1xuXG4vL0ltYWdlIFBsYWNlaG9sZGVyc1xuLy9UaGlzIGNsYXNzIGNyZWF0ZXMgYSBwYWxjZWhvbGRlciBmb3IgaW1hZ2UgZmlsZXMuIEl0IGhhbmRsZSBib3RoIGNsaWNrIHRvIGxvYWQgYW5kIGFsc28gc2VsZWN0IGZyb20gYXNzZXQgbGlicmFyeSBhY3Rpb24uXG5cbmZ1bmN0aW9uIEltYWdlUGxhY2Vob2xkZXIoZWwsIGZpbGUsIG9wdGlvbnMpIHtcbiAgdGhpcy5lbCA9IGVsO1xuICB0aGlzLmZpbGUgPSBmaWxlO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHRoaXMuX2luaXQoKTtcbiAgdGhpcy5faW5pdEV2ZW50cygpO1xufVxuXG5JbWFnZVBsYWNlaG9sZGVyLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm9wdGlvbnMubmFtZSA9IHRoaXMub3B0aW9ucy5uYW1lIHx8IHRoaXMuZWwuZGF0YXNldC5uYW1lO1xuICB0aGlzLm9wdGlvbnMuaWQgPSB0aGlzLmVsLmlkICsgJy1wbGFjZWhvbGRlcic7XG5cbiAgLy9XcmFwcCBwbGFjZWhvbGRlclxuICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2MtSW1hZ2VQbGFjZWhvbGRlcicpO1xuICBpZiAoIXRoaXMuZmlsZSkge3RoaXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpcy1lbXB0eScpO31cbiAgdGhpcy53cmFwcGVyLmlkID0gdGhpcy5vcHRpb25zLmlkO1xuXG4gIC8vUGxhY2Vob2xkZXIgSW1hZ2VcbiAgdGhpcy5pbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLmltYWdlLmNsYXNzTGlzdC5hZGQoJ2MtSW1hZ2VQbGFjZWhvbGRlci1pbWcnKTtcbiAgaWYgKHRoaXMuZmlsZSkge3RoaXMuaW1hZ2Uuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gdGhpcy5maWxlLmZpbGVEYXRhLnVybDt9XG4gIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmltYWdlKTtcblxuICAvL1BsYWNlaG9sZGVyIGNvbnRyb2xzXG4gIHRoaXMuY29udHJvbHMgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMnKS5nZXQoMCk7XG4gIHRoaXMuY29udHJvbHNVcGxvYWQgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMtYnV0dG9uJykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzVXBsb2FkSWNvbiA9ICQoJzxpIGNsYXNzPVwiZmEgZmEtdXBsb2FkXCI+PC9pPicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMtYnV0dG9uLWljb24nKS5nZXQoMCk7XG4gIHRoaXMuY29udHJvbHNVcGxvYWRUZXh0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbi10ZXh0JykudGV4dCgnVXBsb2FkIGZyb20geW91ciBjb21wdXRlcicpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc1VwbG9hZC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzVXBsb2FkSWNvbik7XG4gIHRoaXMuY29udHJvbHNVcGxvYWQuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc1VwbG9hZFRleHQpO1xuXG4gIHRoaXMuY29udHJvbHNEaXZpZGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWRpdmlkZXInKS5nZXQoMCk7XG5cbiAgdGhpcy5jb250cm9sc0xpYnJhcnkgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMtYnV0dG9uJykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzTGlicmFyeUljb24gPSAkKCc8aSBjbGFzcz1cImZhIGZhLWZvbGRlci1vcGVuXCI+PC9pPicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMtYnV0dG9uLWljb24nKS5nZXQoMCk7XG4gIHRoaXMuY29udHJvbHNMaWJyYXJ5VGV4dCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1idXR0b24tdGV4dCcpLnRleHQoJ0FkZCBmcm9tIGFzc2V0IGxpYnJhcnknKS5nZXQoMCk7XG4gIHRoaXMuY29udHJvbHNMaWJyYXJ5LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNMaWJyYXJ5SWNvbik7XG4gIHRoaXMuY29udHJvbHNMaWJyYXJ5LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNMaWJyYXJ5VGV4dCk7XG5cbiAgdGhpcy5jb250cm9scy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzVXBsb2FkKTtcbiAgdGhpcy5jb250cm9scy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzRGl2aWRlcik7XG4gIHRoaXMuY29udHJvbHMuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc0xpYnJhcnkpO1xuICB0aGlzLmltYWdlLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHMpO1xuXG4gIC8vQ2xlYXIgYnV0dG9uXG4gIHRoaXMuZGVsZXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRoaXMuZGVsZXRlLmNsYXNzTGlzdC5hZGQoJ2MtSW1hZ2VQbGFjZWhvbGRlci1kZWxldGUnKTtcbiAgdGhpcy5pbWFnZS5hcHBlbmRDaGlsZCh0aGlzLmRlbGV0ZSk7XG5cbiAgLy9FZGl0IGJ1dHRvblxuICB0aGlzLmVkaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgdGhpcy5lZGl0LmNsYXNzTGlzdC5hZGQoJ2J1dHRvbicsICdidXR0b25fc3R5bGVfb3V0bGluZS13aGl0ZScsICdjLUltYWdlUGxhY2Vob2xkZXItZWRpdCcpO1xuICB0aGlzLmVkaXQuaW5uZXJIVE1MID0gJ0VkaXQnO1xuICB0aGlzLmltYWdlLmFwcGVuZENoaWxkKHRoaXMuZWRpdCk7XG5cbiAgLy9GaWxlIG5hbWVcbiAgdGhpcy5maWxlTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLmZpbGVOYW1lLmNsYXNzTGlzdC5hZGQoJ2MtSW1hZ2VQbGFjZWhvbGRlci1maWxlTmFtZScpO1xuICB0aGlzLmZpbGVOYW1lLmlubmVySFRNTCA9IHRoaXMuZmlsZSA/IHRoaXMuZmlsZS5maWxlRGF0YS50aXRsZSA6ICcnO1xuICB0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5maWxlTmFtZSk7XG5cbiAgLy9QbGFjZWhvbGRlciBUaXRsZVxuICB0aGlzLnRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRoaXMudGl0bGUuY2xhc3NMaXN0LmFkZCgnYy1JbWFnZVBsYWNlaG9sZGVyLXRpdGxlJyk7XG4gIHRoaXMudGl0bGUuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLm5hbWUgfHwgJ0NvdmVyJztcbiAgdGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMudGl0bGUpO1xuXG4gIC8vRmlsZWlucHV0IHRvIGhhbmRsZSBjbGljayB0byB1cGxvYWQgaW1hZ2VcbiAgdGhpcy5maWxlSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gIHRoaXMuZmlsZUlucHV0LnR5cGUgPSBcImZpbGVcIjtcbiAgdGhpcy5maWxlSW5wdXQubXVsdGlwbGUgPSBmYWxzZTtcbiAgdGhpcy5maWxlSW5wdXQuaGlkZGVuID0gdHJ1ZTtcbiAgdGhpcy5maWxlSW5wdXQuYWNjZXB0ID0gXCJpbWFnZS8qLCB2aWRlby8qXCI7XG5cbiAgdGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZmlsZUlucHV0KTtcblxuICB0aGlzLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMud3JhcHBlciwgdGhpcy5lbCk7XG4gIHRoaXMuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmVsKTtcblxufTtcblxuSW1hZ2VQbGFjZWhvbGRlci5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGZ1bmN0aW9uIGNsZWFyKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHNlbGYuZmlsZSA9IHVuZGVmaW5lZDtcbiAgICBzZWxmLl91cGRhdGUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW5MaWJyYXJ5KCkge1xuICAgIHNjcm9sbFBvc2l0aW9uID0gJCgnYm9keScpLnNjcm9sbFRvcCgpO1xuICAgIHVwZGF0ZUFzc2V0TGlicmFyeSgpO1xuICAgICQoJyNhbCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAkKCcjYWwnKS5hZGRDbGFzcygnbW9kYWwnKTtcbiAgICAkKCcjd3JhcHBlcicpLmFkZENsYXNzKCdvdmVyZmxvdycpO1xuICAgIHNpbmdsZXNlbGVjdCA9IHRydWU7XG5cbiAgICAkKCcjYWRkRnJvbUFMQnV0dG9uJykudGV4dChzZWxmLm9wdGlvbnMuYWxCdXR0b24gfHwgJ1NldCBDb3ZlcicpO1xuXG4gICAgJCgnI2FkZEZyb21BTEJ1dHRvbicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICBsYXN0U2VsZWN0ZWQgPSBudWxsO1xuICAgICAgc2V0U2VsZWN0ZWRGaWxlKCk7XG4gICAgICBjbG9zZUFzc2V0TGlicmFyeSgpO1xuICAgICAgc2luZ2xlc2VsZWN0ID0gZmFsc2U7XG4gICAgICAkKCdib2R5Jykuc2Nyb2xsVG9wKHNjcm9sbFBvc2l0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlQXNzZXRMaWJyYXJ5KCkge1xuICAgIGxhc3RTZWxlY3RlZCA9IG51bGw7XG4gICAgJCgnLmFsIC5maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICBkZXNlbGVjdEFsbCgpO1xuICAgICQoJy5tb2RhbCcpLmFkZENsYXNzKCdoaWRkZW4nKS5yZW1vdmVDbGFzcygnbW9kYWwnKTtcbiAgICAkKCcjd3JhcHBlcicpLnJlbW92ZUNsYXNzKCdvdmVyZmxvdycpO1xuICAgICQoJyNhZGRGcm9tQUxCdXR0b24nKS51bmJpbmQoJ2NsaWNrJyk7XG4gICAgJCgnYm9keScpLnNjcm9sbFRvcChzY3JvbGxQb3NpdGlvbik7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVzY0tleWRvd24pO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFbnRlcktleWRvd24pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U2VsZWN0ZWRGaWxlKCkge1xuICAgIHZhciBzZWxlY3RlZEZpbGUgPSAkKCcuYWwgLmZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZS5zZWxlY3RlZCcpLFxuICAgIGZpbGVJZCA9ICQoc2VsZWN0ZWRGaWxlKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCksXG4gICAgZmlsZSA9IGFzc2V0TGlicmFyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcbiAgICAgIHJldHVybiBmLmlkID09PSBmaWxlSWQ7XG4gICAgfSlbMF07XG5cbiAgICBzZWxmLmZpbGUgPSB7XG4gICAgICBmaWxlRGF0YTogZmlsZVxuICAgIH07XG4gICAgc2VsZi5fdXBkYXRlKCk7XG4gIH1cblxuXG4gIHNlbGYuZmlsZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcbiAgICBmaWxlVG9PYmplY3QoZS50YXJnZXQuZmlsZXNbMF0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICBzZWxmLmZpbGUgPSB7XG4gICAgICAgIGZpbGVEYXRhOiByZXMsXG4gICAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgcG9zaXRpb246IDEwMDAsXG4gICAgICAgIGNhcHRpb246ICcnLFxuICAgICAgICBnYWxsZXJ5Q2FwdGlvbjogZmFsc2UsXG4gICAgICAgIGp1c3RVcGxvYWRlZDogdHJ1ZVxuICAgICAgfTtcbiAgICAgIHNlbGYuX3VwZGF0ZSgpO1xuICAgIH0pO1xuICB9KTtcblxuICBzZWxmLmNvbnRyb2xzVXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGlmICghc2VsZi5maWxlKSB7XG4gICAgICBzZWxmLmZpbGVJbnB1dC5jbGljaygpO1xuICAgIH1cbiAgfSk7XG4gIHNlbGYuZGVsZXRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xlYXIpO1xuICBzZWxmLmVkaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgZWRpdEZpbGVzKFtzZWxmLmZpbGVdKTtcbiAgfSk7XG5cbiAgc2VsZi5jb250cm9sc0xpYnJhcnkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuTGlicmFyeSk7XG59O1xuSW1hZ2VQbGFjZWhvbGRlci5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5maWxlKSB7XG4gICAgdGhpcy53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWVtcHR5Jyk7XG4gICAgdGhpcy5pbWFnZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKCcgKyB0aGlzLmZpbGUuZmlsZURhdGEudXJsICsgJyknO1xuICAgIHRoaXMuZmlsZU5hbWUuaW5uZXJIVE1MID0gdGhpcy5maWxlLmZpbGVEYXRhLnRpdGxlO1xuICB9XG4gIGVsc2Uge1xuICAgIHRoaXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpcy1lbXB0eScpO1xuICAgIHRoaXMuaW1hZ2Uuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ25vbmUnO1xuICAgIHRoaXMuZmlsZU5hbWUuaW5uZXJIVE1MID0gJyc7XG4gIH1cbn07XG5cbkltYWdlUGxhY2Vob2xkZXIucHJvdG90eXBlLnNldEltYWdlID0gZnVuY3Rpb24oZmlsZSkge1xuICB0aGlzLmZpbGUgPSBmaWxlO1xuICB0aGlzLl91cGRhdGUoKTtcbn07XG5cbmZ1bmN0aW9uIGluaXRJbWFnZVBsYWNlaG9sZGVycygpIHtcbiAgdmFyIGltYWdlUGxhY2Vob2xkZXJzID0gW107XG4gIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWltYWdlUGxhY2Vob2xkZXInKSkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgIGltYWdlUGxhY2Vob2xkZXJzLnB1c2gobmV3IEltYWdlUGxhY2Vob2xkZXIoZWwpKTtcbiAgfSk7XG4gIHJldHVybiBpbWFnZVBsYWNlaG9sZGVycztcbn1cblxuXG5cbi8qXG4gKiBJbml0aWFsaXphdGlvbnNcbiAqL1xuXG5cblxuXG5cblxuLy9TdGlja2FibGVcbmZ1bmN0aW9uIFN0aWNrYWJsZShlbCwgb3B0aW9ucykge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgdGhpcy5faW5pdCgpO1xufVxuXG5TdGlja2FibGUucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuYm91bmRhcnkgPSBzZWxmLm9wdGlvbnMuYm91bmRhcnkgPyBzZWxmLm9wdGlvbnMuYm91bmRhcnkgPT09IHRydWUgPyBzZWxmLmVsLnBhcmVudE5vZGUgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGYub3B0aW9ucy5ib3VuZGFyeSkgOiB1bmRlZmluZWQ7XG4gICAgc2VsZi5vZmZzZXQgPSBzZWxmLm9wdGlvbnMub2Zmc2V0IHx8IDA7XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVTY3JvbGwoKSB7XG4gICAgICAgIHZhciBlbGVtZW50UmVjdCA9IHNlbGYuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICBlbGVtZW50Qm90dG9tT2Zmc2V0ID0gZWxlbWVudFJlY3QudG9wICsgZWxlbWVudFJlY3QuaGVpZ2h0O1xuXG5cbiAgICAgICAgaWYgKChzZWxmLm9wdGlvbnMubWF4V2lkdGggJiYgd2luZG93LmlubmVyV2lkdGggPD0gc2VsZi5vcHRpb25zLm1heFdpZHRoKSB8fCAhc2VsZi5vcHRpb25zLm1heFdpZHRoKSB7XG4gICAgICAgICAgICBpZiAoIXNlbGYuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRSZWN0LnRvcCAtIHNlbGYub3B0aW9ucy5vZmZzZXQgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWxlbWVudE9mZnNldFBhcmVudCA9IHNlbGYuZWwub2Zmc2V0UGFyZW50O1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmluaXRpYWxPZmZzZXQgPSBzZWxmLmVsLm9mZnNldFRvcDtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKHNlbGYub3B0aW9ucy5jbGFzcyB8fCAnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUudG9wID0gc2VsZi5vZmZzZXQudG9TdHJpbmcoKSArICdweCc7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50T2Zmc2V0UGFyZW50UmVjdCA9IHNlbGYuZWxlbWVudE9mZnNldFBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5ib3VuZGFyeSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYm91bmRhcnlSZWN0ID0gc2VsZi5ib3VuZGFyeS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kYXJ5Qm90dG9tT2Zmc2V0ID0gYm91bmRhcnlSZWN0LnRvcCArIGJvdW5kYXJ5UmVjdC5oZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRCb3R0b21PZmZzZXQgPiBib3VuZGFyeUJvdHRvbU9mZnNldCB8fCBlbGVtZW50UmVjdC50b3AgPCBzZWxmLm9wdGlvbnMub2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnRvcCA9IE1hdGgucm91bmQoYm91bmRhcnlCb3R0b21PZmZzZXQgLSBlbGVtZW50UmVjdC5oZWlnaHQpLnRvU3RyaW5nKCkgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnRSZWN0LnRvcCA+IHNlbGYub2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnRvcCA9IHNlbGYub2Zmc2V0LnRvU3RyaW5nKCkgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9mZnNldCA8IHNlbGYuaW5pdGlhbE9mZnNldCArIGVsZW1lbnRPZmZzZXRQYXJlbnRSZWN0LnRvcCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUucG9zaXRpb24gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS50b3AgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVJlc2l6ZSgpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gc2VsZi5vcHRpb25zLm1heFdpZHRoKSB7XG4gICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnBvc2l0aW9uID0gJyc7XG4gICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnRvcCA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlU2Nyb2xsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9wdGltaXplZFNjcm9sbFwiLCBoYW5kbGVTY3JvbGwpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib3B0aW1pemVkUmVzaXplXCIsIGhhbmRsZVJlc2l6ZSk7XG59O1xuXG4vL1JlcXVpcmVkIEZpZWxkc1xuZnVuY3Rpb24gbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpIHtcbiAgICAkKCcuanMtcmVxdWlyZWRDb3VudCcpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgIHZhciBjYXJkID0gJChlbCkucGFyZW50cygnLmNhcmQnKSxcbiAgICAgICAgICAgIGNhcmRJZCA9IGNhcmQuYXR0cignaWQnKSxcbiAgICAgICAgICAgIGVtcHR5UmVxdWlyZWRGaWVsZHNDb3VudCA9IGNhcmQuZmluZCgnLmpzLXJlcXVpcmVkJykubGVuZ3RoIC0gY2FyZC5maW5kKCcuanMtcmVxdWlyZWQuanMtaGFzVmFsdWUnKS5sZW5ndGgsXG4gICAgICAgICAgICBuYXZJdGVtID0gJCgnLmpzLXNjcm9sbFNweU5hdiAuanMtc2Nyb2xsTmF2SXRlbVtkYXRhLWhyZWY9XCInICsgY2FyZElkICsgJ1wiXScpO1xuXG4gICAgICAgIGlmIChlbXB0eVJlcXVpcmVkRmllbGRzQ291bnQgPiAwKSB7XG4gICAgICAgICAgICBuYXZJdGVtLmFkZENsYXNzKCdpcy1yZXF1aXJlZCcpO1xuICAgICAgICAgICAgJChlbCkudGV4dChlbXB0eVJlcXVpcmVkRmllbGRzQ291bnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmF2SXRlbS5yZW1vdmVDbGFzcygnaXMtcmVxdWlyZWQnKTtcbiAgICAgICAgICAgICQoZWwpLnRleHQoJycpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuLy9QYWdpbmF0aW9uXG5mdW5jdGlvbiBQYWdpbmF0aW9uKGVsLCBzdG9yZSwgdXBkYXRlRnVuY3Rpb24pIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgIHRoaXMudXBkYXRlID0gdXBkYXRlRnVuY3Rpb247XG5cbiAgICB0aGlzLl9pbml0KCk7XG59XG5cblBhZ2luYXRpb24ucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJlbmRlclBhZ2luYXRpb24oKTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZVBhZ2VDbGljayhlKSB7XG4gICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldC5kYXRhc2V0LnRhcmdldCB8fCBlLnRhcmdldC5wYXJlbnROb2RlLmRhdGFzZXQudGFyZ2V0O1xuICAgICAgICBzd2l0Y2ggKHRhcmdldCkge1xuICAgICAgICAgICAgY2FzZSAncHJldic6XG4gICAgICAgICAgICAgICAgc2VsZi5zdG9yZS5zZXRQYWdlKHNlbGYuc3RvcmUucGFnZSAtIDEgPCAwID8gMCA6IHNlbGYuc3RvcmUucGFnZSAtIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbmV4dCc6XG4gICAgICAgICAgICAgICAgc2VsZi5zdG9yZS5zZXRQYWdlKHNlbGYuc3RvcmUucGFnZSArIDEgPT09IHNlbGYuc3RvcmUucGFnZXNOdW1iZXIoKSA/IHNlbGYuc3RvcmUucGFnZXNOdW1iZXIoKSAtIDEgOiBzZWxmLnN0b3JlLnBhZ2UgKyAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYudXBkYXRlKCQoJyNsaWJyYXJ5Qm9keScpLCBzZWxmLnN0b3JlLCByZW5kZXJDb250ZW50Um93KTtcbiAgICAgICAgcmVuZGVyUGFnaW5hdGlvbigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlclBhZ2luYXRpb24oKSB7XG4gICAgICAgIHZhciBsaW5rcyA9ICQoJzx1bD48L3VsPicpLmFkZENsYXNzKCdwYWdpbmF0aW9uX19saXN0Jyk7XG4gICAgICAgIHNlbGYuZWwuZW1wdHkoKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnN0b3JlLnBhZ2VzTnVtYmVyKCkpO1xuXG4gICAgICAgIGlmIChzZWxmLnN0b3JlLnBhZ2VzTnVtYmVyKCkgPiAxKSB7XG4gICAgICAgICAgICAvL1ByZXZcbiAgICAgICAgICAgIHZhciBwcmV2TGluayA9ICQoJzxsaT48aSBjbGFzcz1cImZhIGZhLWFuZ2xlLWxlZnRcIj48L2k+PC9saT4nKS5hZGRDbGFzcygncGFnaW5hdGlvbl9fcHJldicpLmF0dHIoJ2RhdGEtdGFyZ2V0JywgJ3ByZXYnKS5jbGljayhoYW5kbGVQYWdlQ2xpY2spO1xuICAgICAgICAgICAgaWYgKHNlbGYuc3RvcmUucGFnZSA9PT0gMCkge3ByZXZMaW5rLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO31cbiAgICAgICAgICAgIGxpbmtzLmFwcGVuZChwcmV2TGluayk7XG5cbiAgICAgICAgICAgIC8vQ3VycmVudCBwYWdlIGluZGljYXRvclxuICAgICAgICAgICAgLy92YXIgY3VycmVudFBhZ2UgPSAkKCc8bGk+PC9saT4nKS5hZGRDbGFzcygncGFnaW5hdGlvbl9fY3VycmVudCcpLnRleHQoc2VsZi5zdG9yZS5wYWdlICsgMSk7XG4gICAgICAgICAgICAvL2xpbmtzLmFwcGVuZChjdXJyZW50UGFnZSk7XG5cbiAgICAgICAgICAgIC8vTmV4dFxuICAgICAgICAgICAgdmFyIG5leHRMaW5rID0gJCgnPGxpPjxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtcmlnaHRcIj48L2k+PC9saT4nKS5hZGRDbGFzcygncGFnaW5hdGlvbl9fbmV4dCcpLmF0dHIoJ2RhdGEtdGFyZ2V0JywgJ25leHQnKS5jbGljayhoYW5kbGVQYWdlQ2xpY2spO1xuICAgICAgICAgICAgaWYgKHNlbGYuc3RvcmUucGFnZSA9PT0gc2VsZi5zdG9yZS5wYWdlc051bWJlcigpIC0gMSkge25leHRMaW5rLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO31cbiAgICAgICAgICAgIGxpbmtzLmFwcGVuZChuZXh0TGluayk7XG5cbiAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kKGxpbmtzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLmVsO1xuICAgIH1cblxufTtcblxuXG5cbi8vR2xvYmFsIHZhcmlhYmxlc1xudmFyIGVkaXRlZEZpbGVzRGF0YSA9IFtdLFxuZWRpdGVkRmlsZURhdGEgPSB7fSxcbmNsYXNzTGlzdCA9IFtdLFxuZGF0YUNoYW5nZWQgPSBmYWxzZSwgLy9DaGFuZ2VzIHdoZW4gdXNlciBtYWtlIGFueSBjaGFuZ2VzIG9uIGVkaXQgc2NyZWVuO1xubGFzdFNlbGVjdGVkID0gbnVsbCwgLy9JbmRleCBvZiBsYXN0IFNlbGVjdGVkIGVsZW1lbnQgZm9yIG11bHRpIHNlbGVjdDtcbmdhbGxlcnlPYmplY3RzID0gW10sXG5kcmFmdElzU2F2ZWQgPSBmYWxzZTtcblxuLy9OZXcgR2FsbGVyeSBNZWRpYSB0YWJcbi8vIENyZWF0ZSBET00gZWxlbWVudCBmb3IgRmlsZSBmcm9tIGRhdGFcbmZ1bmN0aW9uIGNyZWF0ZUZpbGVFbGVtZW50KGYpIHtcbiAgdmFyIGZpbGVEYXRhID0gZi5maWxlRGF0YTtcbiAgLy9jcmVhdGUgYmFzaWMgZWxlbWVudFxuICB2YXIgZmlsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUgZmlsZV90eXBlX2ltZyBmaWxlX3ZpZXdfZ3JpZCcpLFxuICBmaWxlSW5kZXggPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdoaWRkZW4gZmlsZV9faWQnKS50ZXh0KGZpbGVEYXRhLmlkKSxcblxuICBmaWxlSW1nID0gJCgnPGRpdj48L2Rpdj4nKVxuICAuYWRkQ2xhc3MoJ2ZpbGVfX2ltZycpXG4gIC5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyBmaWxlRGF0YS51cmwgKyAnKScpLFxuICBmaWxlQ29udHJvbHMgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19jb250cm9scycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuICBmaWxlQ2hlY2ttYXJrID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fY2hlY2ttYXJrJykuY2xpY2sodG9nZ2xlRmlsZVNlbGVjdCksXG4gIGZpbGVEZWxldGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19kZWxldGUnKS5jbGljayhoYW5kbGVEZWxldGVDbGljayksXG4gIGZpbGVUeXBlID0gJCgnPGRpdj48aSBjbGFzcz1cImZhIGZhLWNhbWVyYVwiPjwvaT48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdHlwZScpLFxuICBmaWxlRWRpdCA9ICQoJzxidXR0b24+RWRpdDwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24gYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLXdoaXRlJykuY2xpY2soaGFuZGxlRmlsZWRFZGl0QnV0dG9uQ2xpY2spLFxuXG4gIGZpbGVUaXRsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3RpdGxlIGZpbGVfX3RpdGxlLS1tZWRpYS1jYXJkJykudGV4dChmaWxlRGF0YS50aXRsZSksXG5cbiAgZmlsZVB1cnBvc2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19wdXJwb3NlJyksXG4gIGZpbGVQdXJwb3NlU2VsZWN0ID0gJCgnPGRpdj48L2Rpdj4nKTtcblxuICBmaWxlRWRpdEJ1dHRvbiA9ICQoJzxidXR0b24+RWRpdDwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24gYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXkgdS12aXNpYmxlLXhzIHUtbm9NYXJnaW4nKS5jbGljayhoYW5kbGVGaWxlZEVkaXRCdXR0b25DbGljayk7XG5cbiAgZmlsZUNvbnRyb2xzLmFwcGVuZChmaWxlQ2hlY2ttYXJrLCBmaWxlRGVsZXRlLCBmaWxlVHlwZSwgZmlsZUVkaXQpO1xuICBmaWxlSW1nLmFwcGVuZChmaWxlQ29udHJvbHMpO1xuXG4gIGZpbGVQdXJwb3NlLmFwcGVuZChmaWxlUHVycG9zZVNlbGVjdCwgZmlsZUVkaXRCdXR0b24pO1xuICBwdXJwb3NlU2VsZWN0ID0gbmV3IFNlbGVjdGJveChmaWxlUHVycG9zZVNlbGVjdC5nZXQoMCksIHtcbiAgICBsYWJlbDogJ1VzYWdlJyxcbiAgICBwbGFjZWhvbGRlcjogJ1NlbGVjdCBVc2FnZScsXG4gICAgaXRlbXM6IFsnQWxsIGNhc3QnLCAnQ2FzdCBEZXRhaWwnLCAnSGVhZHNob3QnLCdGdWxsIGJvZHknLCAnUHJvbW8nXS5zb3J0KClcbiAgfSk7XG5cbiAgZmlsZS5hcHBlbmQoZmlsZUluZGV4LCBmaWxlSW1nLCBmaWxlVGl0bGUsIGZpbGVQdXJwb3NlLCBmaWxlRWRpdEJ1dHRvbik7XG5cbiAgcmV0dXJuIGZpbGU7XG59XG5cbmZ1bmN0aW9uIGFkZEZpbGUoZmlsZSkge1xuICB2YXIgZmlsZVNlY3Rpb24gPSAkKCcuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzJykuZ2V0KDApO1xuXG4gICQoZmlsZVNlY3Rpb24pLmFwcGVuZChmaWxlKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlR2FsbGVyeShzY3JvbGxJbmRleCkge1xuICBzaW5nbGVzZWxlY3QgPSBmYWxzZTtcbiAgdmFyIGp1c3RVcGxvYWRlZCA9IGZhbHNlO1xuXG4gIC8vIFJlbWVtYmVyIHBvc2l0aW9uIGFuZCBzZWxlY3Rpb24gb2YgZmlsZXNcbiAgJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICB2YXIgZmlsZSA9IGdhbGxlcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG4gICAgICByZXR1cm4gZi5maWxlRGF0YS5pZCA9PT0gJChlbCkuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpO1xuICAgIH0pWzBdO1xuICAgIGlmIChmaWxlKSB7XG4gICAgICBmaWxlLnBvc2l0aW9uID0gaW5kZXg7XG4gICAgICBmaWxlLnNlbGVjdGVkID0gJChlbCkuaGFzQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgfVxuICB9KTtcblxuICAvL0NsZWFyIGZpbGVzIHNlY3Rpb25cbiAgJCgnLmZpbGVzIC5zZWN0aW9uX19maWxlcycpLmVtcHR5KCk7XG5cbiAgLy9Tb3J0IGFycmF5IGFjb3JkaW5nIGZpbGVzIHBvc2l0aW9uXG4gIGdhbGxlcnlPYmplY3RzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBhLnBvc2l0aW9uIC0gYi5wb3NpdGlvbjtcbiAgfSk7XG5cbiAgLy9DcmVhdGUgZmlsZXMgZnJvbSBkYXRhIGFuZCBhZGQgdGhlbSB0byB0aGUgcGFnZVxuICBmb3IgKHZhciBpID0gMDsgaTxnYWxsZXJ5T2JqZWN0cy5sZW5ndGg7IGkrKyApIHtcbiAgICB2YXIgZiA9IGdhbGxlcnlPYmplY3RzW2ldLFxuICAgIGZpbGUgPSBjcmVhdGVGaWxlRWxlbWVudChmKTtcblxuICAgIGlmIChmLnNlbGVjdGVkKSB7ZmlsZS5hZGRDbGFzcygnc2VsZWN0ZWQnKTt9XG4gICAgaWYgKGYuanVzdFVwbG9hZGVkKSB7XG4gICAgICBmaWxlLmFkZENsYXNzKCdqdXN0VXBsb2FkZWQnKTtcbiAgICAgIGYuanVzdFVwbG9hZGVkID0gZmFsc2U7XG4gICAgICBqdXN0VXBsb2FkZWQgPSB0cnVlO1xuICAgIH1cbiAgICBhZGRGaWxlKGZpbGUpO1xuICB9XG4gIG5vcm1hbGl6ZVNlbGVjdGVpb24oKTtcblxuICBpZiAoc2Nyb2xsSW5kZXgpIHtcbiAgICB2YXIgc2Nyb2xsVG9wID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlJykubGFzdCgpLm9mZnNldCgpLnRvcDtcbiAgICAkKCdib2R5JykuYW5pbWF0ZSh7XG4gICAgICBzY3JvbGxUb3A6IHNjcm9sbFRvcFxuICAgIH0sIDQwMCk7XG4gIH1cbn1cblxuLy9DYXN0ICYgQ3JlZGl0IGluaXRpYWxpemF0aW9uXG4vLyBkYXRhXG52YXIgY2FzdEFuZENyZWRpdCA9IHtcbiAgICBjYXN0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBlcnNvbjogJ1N1bGxpdmFuIFN0YXBsZXRvbicsXG4gICAgICAgICAgICByb2xlOiBbJ0t1cnQgV2VsbGVyJ11cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcGVyc29uOiAnSmFpbWllIEFsZXhhbmRlcicsXG4gICAgICAgICAgICByb2xlOiBbJ0phbmUgRG9lJ11cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcGVyc29uOiAnTWFyaWFubmUgSmVhbi1CYXB0aXN0ZScsXG4gICAgICAgICAgICByb2xlOiBbJ0JldGhhbnkgTWF5ZmFpciddXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBlcnNvbjogJ1JvYiBCcm93bicsXG4gICAgICAgICAgICByb2xlOiBbJ0VkZ2FyIFJlYWRlJ11cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcGVyc29uOiAnQXVkcmV5IEVzcGFyemEnLFxuICAgICAgICAgICAgcm9sZTogWydUYXNoYSBaYXBhdGEnXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwZXJzb246ICdBc2hsZXkgSm9obnNvbicsXG4gICAgICAgICAgICByb2xlOiBbJ1BhdHRlcnNvbiddXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBlcnNvbjogJ1Vrd2VsaSBSb2FjaCcsXG4gICAgICAgICAgICByb2xlOiBbJ0RyLiBCb3JkZW4nXVxuICAgICAgICB9XG4gICAgXSxcbiAgICBjcmVkaXQ6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgcm9sZTogJ1NlcmllcyBQcmVtaWVyZScsXG4gICAgICAgICAgICBuYW1lczogJ1NlcHRlbWJlciAyMSwgMjAxNSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcm9sZTogJ1N0YXJyaW5nJyxcbiAgICAgICAgICAgIG5hbWVzOiAnU3VsbGl2YW4gU3RhcGxldG9uLCBKYWltaWUgQWxleGFuZGVyLCBNYXJpYW5uZSBKZWFuLUJhcHRpc3RlLCBSb2IgQnJvd24sIEF1ZHJleSBFc3BhcnphLCBBc2hsZXkgSm9obnNvbiwgVWt3ZWxpIFJvYWNoJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICByb2xlOiAnQ3JlYXRlZCBCeScsXG4gICAgICAgICAgICBuYW1lczogJ01hcnRpbiBHZXJvJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICByb2xlOiAnV3JpdHRlbiBCeSAoUGlsb3QpJyxcbiAgICAgICAgICAgIG5hbWVzOiAnTWFydGluIEdlcm8nXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJvbGU6ICdFeGVjdXRpdmUgUHJvZHVjZXJzJyxcbiAgICAgICAgICAgIG5hbWVzOiAnR3JlZyBCZXJsYW50aSwgTWFydGluIEdlcm8sIFNhcmFoIFNjaGVjaHRlciwgTWFyayBQZWxsaW5ndG9uLCBNYXJjb3MgU2llZ2EnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJvbGU6ICdDby1FeGVjdXRpdmUgUHJvZHVjZXInLFxuICAgICAgICAgICAgbmFtZXM6ICdDaHJpc3RpbmEgS2ltJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICByb2xlOiAnU3VwZXJ2aXNpbmcgUHJvZHVjZXInLFxuICAgICAgICAgICAgbmFtZXM6ICdBbGV4IEJlcmdlcidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcm9sZTogJ1Byb2R1Y2VyJyxcbiAgICAgICAgICAgIG5hbWVzOiAnQnJlbmRhbiBHYWxsJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICByb2xlOiAnTGluZSBQcm9kdWNlcicsXG4gICAgICAgICAgICBuYW1lczogJ0hhcnZleSBXYWxkbWFuJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICByb2xlOiAnQ28tUHJvZHVjZXJzJyxcbiAgICAgICAgICAgIG5hbWVzOiAnUnlhbiBKb2huc29uLCBQZXRlciBMYWxheWFuaXMsIEplbm5pZmVyIExlbmNlLCBDYXJsIE9nYXdhJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICByb2xlOiAnRGlyZWN0b3IgKFBpbG90KScsXG4gICAgICAgICAgICBuYW1lczogJ01hcmsgUGVsbGluZ3RvbidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcm9sZTogJ0RpcmVjdG9ycyBvZiBQaG90b2dyYXBoeScsXG4gICAgICAgICAgICBuYW1lczogJ0RhdmlkIFR1dHRtYW4sIERhdmlkIEpvaG5zb24nXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJvbGU6ICdFZGl0b3JzJyxcbiAgICAgICAgICAgIG5hbWVzOiAnRmlubmlhbiBNdXJyYXksIEpvZWwgUGFzaGJ5LCBLcmlzdGluIFdpbmRlbGwnXG4gICAgICAgIH1cbiAgICBdXG59O1xudmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgJ0FuZ2VsYSBNb3NzJyxcbiAgICAnQXJhbSBNb2p0YWJhaScsXG4gICAgJ0FybGVuZScsXG4gICAgJ0JldGhhbnkgTWF5ZmFpcicsXG4gICAgJ0NhcmxvcyBFc3BhZGEnLFxuICAgICdDcmlzdGluYSBTYW50b3MnLFxuICAgICdEYXJsZW5lJyxcbiAgICAnRGVtYmUgWnVtYScsXG4gICAgJ0RvbmFsZCBSZXNzbGVyJyxcbiAgICAnRHIuIEJvcmRlbicsXG4gICAgJ0VkZ2FyIFJlYWRlJyxcbiAgICAnRWxsaW90IEFsZGVyc29uJyxcbiAgICAnRWxpemFiZXRoIFwiTGl6XCIgS2VlbicsXG4gICAgJ0hhcmxlZSBTYW50b3MnLFxuICAgICdIYXJvbGQgQ29vcGVyJyxcbiAgICAnSmFuZSBEb2UnLFxuICAgICdLdXJ0IFdlbGxlcicsXG4gICAgJ01hcmN1cyBUdWZvJyxcbiAgICAnTWF0dCBXb3puaWFrJyxcbiAgICAnTWljaGFlbCBMb21hbicsXG4gICAgJ01yLiBSb2JvdCcsXG4gICAgJ1BhdHRlcnNvbicsXG4gICAgJ1JheW1vbmQgXCJSZWRcIiBSZWRkaW5ndG9uJyxcbiAgICAnUm9iZXJ0IFN0YWhsJyxcbiAgICAnU2FtYXIgTmF2YWJpJyxcbiAgICAnU3R1YXJ0IFNhcGVyc3RlaW4nLFxuICAgICdUYXNoYSBaYXBhdGEnLFxuICAgICdUZXNzIE5hemFyaW8nLFxuICAgICdUb20gS2VlbicsXG4gICAgJ1R5cmVsbCBXZWxsaWNrJyxcbiAgICAnVGltb3RoeSBDbGFyaycsXG4gICAgJ0plc3NpY2EgUGFya2VyJyxcbiAgICAnRmF0aGVyIEFuZHJld3MnLFxuICAgICdMaXNhIEpvbmVzJyxcbiAgICAnSWFpbiBWYXVnaG4nLFxuICAgICdDYW0gSGVucnknLFxuICAgICdEeWxhbiBCZW5uZXR0JyxcbiAgICAnU2FyYWggQmVubmV0dCdcbl07XG52YXIgcGVyc29ucyA9IFtcbiAgICAnQWRhbSBMZXZpbmUnLFxuICAgICdBbWlyIEFyaXNvbicsXG4gICAgJ0FzaGxleSBKb2huc29uJyxcbiAgICAnQXVkcmV5IEVzcGFyemEnLFxuICAgICdCbGFrZSBTaGVsdG9uJyxcbiAgICAnQ2FybHkgQ2hhaWtpbicsXG4gICAgJ0NhcnNvbiBEYWx5JyxcbiAgICAnQ2hyaXN0aWFuIFNsYXRlcicsXG4gICAgJ0NocmlzdGluYSBBZ3VpbGVyYScsXG4gICAgJ0RheW8gT2tlbml5aScsXG4gICAgJ0RpZWdvIEtsYXR0ZW5ob2ZmJyxcbiAgICAnRHJlYSBkZSBNYXR0ZW8nLFxuICAgICdIYW1wdG9uIEZsdWtlcicsXG4gICAgJ0hhcnJ5IExlbm5peCcsXG4gICAgJ0hpc2hhbSBUYXdmaXEnLFxuICAgICdKYWltaWUgQWxleGFuZGVyJyxcbiAgICAnSmFtZXMgU3BhZGVyJyxcbiAgICAnSmVubmlmZXIgTG9wZXonLFxuICAgICdNYXJpYW5uZSBKZWFuLUJhcHRpc3RlJyxcbiAgICAnTWFydGluIFdhbGxzdHLDtm0nLFxuICAgICdNZWdhbiBCb29uZScsXG4gICAgJ01vemhhbiBNYXJuw7InLFxuICAgICdQaGFycmVsbCBXaWxsaWFtcycsXG4gICAgJ1BvcnRpYSBEb3VibGVkYXknLFxuICAgICdSYW1pIE1hbGVrJyxcbiAgICAnUmF5IExpb3R0YScsXG4gICAgJ1JvYiBCcm93bicsXG4gICAgJ1J5YW4gRWdnb2xkJyxcbiAgICAnU2FyYWggSmVmZmVyeScsXG4gICAgJ1N1bGxpdmFuIFN0YXBsZXRvbicsXG4gICAgJ1Vrd2VsaSBSb2FjaCcsXG4gICAgJ1ZpbmNlbnQgTGFyZXNjYScsXG4gICAgJ1dhcnJlbiBLb2xlJyxcbiAgICAnS2F0aWUgTWNHcmF0aCcsXG4gICAgJ0JyYW5kb24gSmF5IE1jTGFyZW4nLFxuICAgICdTdGV2ZSBCeWVycycsXG4gICAgJ0RlYW4gTWNEZXJtb3R0JyxcbiAgICAnRW51a2EgT2t1bWEnLFxuICAgICdSb2IgU3Rld2FydCcsXG4gICAgJ0VyaW4gS2FycGx1aycsXG4gICAgJ0NocmlzdG9waGVyIEphY290JyAgICBcbl07XG5cbmZ1bmN0aW9uIGluaXRDcmVkaXRTZWN0aW9uKHNlY3Rpb24pIHtcbiAgLy9BZnRlciB3ZSBhZGQgYSBuZXcgY2FzdCByb3csIHdlIG5lZWQgdG8gbWFrZSBpbml0aWFsaXphdGlvbiB0byBtYWtlIHRleHRmaWVsZHMgYW5kIHNlbGVjdGJveGVzIHdvcmsgcHJvcGVybHlcbiAgZnVuY3Rpb24gYmVmb3JlQWRkQ3JlZGl0KGVsKSB7XG4gICAgaWYgKGVsLmZpbmQoJ2lucHV0LmpzLWlucHV0JykuZ2V0KDApKSB7XG4gICAgICBuZXcgVGV4dGZpZWxkKGVsLmZpbmQoJ2lucHV0LmpzLWlucHV0JykuZ2V0KDApLCB7XG4gICAgICAgIGxhYmVsOiAnVGl0bGUnLFxuICAgICAgICBoZWxwVGV4dDogJ2UuZyBQcm9kdWNlciwgQ29zdHVtZSdcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZWwuZmluZCgndGV4dGFyZWEuanMtaW5wdXQnKS5nZXQoMCkpIHtcbiAgICAgIG5ldyBUZXh0ZmllbGQoZWwuZmluZCgndGV4dGFyZWEuanMtaW5wdXQnKS5nZXQoMCksIHtsYWJlbDogJ05hbWUocyknfSk7XG4gICAgfVxuICAgIGVsLmZpbmQoJ3RleHRhcmVhJykuZWxhc3RpYygpO1xuICB9XG4gIHZhciBhZGRhYmxlUm93ID0gY3JlYXRlQ3JlZGl0Um93KCk7XG5cbiAgc2VjdGlvbi5hcHBlbmQoYWRkYWJsZVJvdyk7XG4gIGFkZGFibGVPYmplY3QgPSBuZXcgQWRkYWJsZShhZGRhYmxlUm93LCB7YWZ0ZXJBZGQ6IGJlZm9yZUFkZENyZWRpdCwgc29ydGFibGU6IHRydWV9KTtcbiAgYWRkYWJsZU9iamVjdC5yZW1vdmVJdGVtKDApO1xuICBhZGRhYmxlT2JqZWN0Ll9hZGRJdGVtKGNyZWF0ZUNyZWRpdFJvdygpLCBiZWZvcmVBZGRDcmVkaXQpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDcmVkaXRSb3coY3JlZGl0KSB7XG4gIHZhciBjcmVkaXRSb3cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjZ19fY29udHJvbHMgY2dfX2NvbnRyb2xzX3N0eWxlX3JvdycpLFxuICByb2xlV3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NnX19jb250cm9sIGNnX19jb250cm9sX3N0eWxlX3JvdycpLFxuICByb2xlRmllbGQgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIi8+JykuYWRkQ2xhc3MoJ2pzLWlucHV0IGlucHV0X3N0eWxlX2xpZ2h0JykudmFsKGNyZWRpdCA/IGNyZWRpdC5yb2xlIDogJycpLFxuICBuYW1lc0ZpZWxkID0gJCgnPHRleHRhcmVhPjwvdGV4dGFyZWE+JykuYWRkQ2xhc3MoJ2pzLWlucHV0IGlucHV0X3N0eWxlX2xpZ2h0JykudmFsKGNyZWRpdCA/IGNyZWRpdC5uYW1lcyA6ICcnKSxcbiAgbmFtZXNXcmFwcGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2wgY2dfX2NvbnRyb2xfc3R5bGVfcm93Jyk7XG5cbiAgcm9sZVdyYXBwZXIuYXBwZW5kKHJvbGVGaWVsZCk7XG4gIG5hbWVzV3JhcHBlci5hcHBlbmQobmFtZXNGaWVsZCk7XG4gIGNyZWRpdFJvdy5hcHBlbmQocm9sZVdyYXBwZXIsIG5hbWVzV3JhcHBlcik7XG5cbiAgcmV0dXJuIGNyZWRpdFJvdztcbn1cblxuZnVuY3Rpb24gaW5pdENhc3RTZWN0aW9uKHNlY3Rpb24pIHtcbiAgZnVuY3Rpb24gYmVmb3JlQWRkQ2FzdChlbCkge1xuICAgIC8vQ3JlYXRlIHNlbGVjdGJveFxuICAgIHZhciBwZXJzb25TZWxlY3RJdGVtID0gbmV3IFNlbGVjdGJveChlbC5maW5kKCcuanMtc2VsZWN0Ym94JykuZ2V0KDApLCB7XG4gICAgICBsYWJlbDogJ1BlcnNvbicsXG4gICAgICBwbGFjZWhvbGRlcjogJ1NlbGVjdCBwZXJzb24nLFxuICAgICAgaXRlbXM6IHBlcnNvbnMuc29ydCgpLFxuICAgICAgdW5zZWxlY3Q6ICfigJQgTm9uZSDigJQnXG4gICAgfSk7XG4gICAgLy9DcmVhdGUgVGFnZmllbGRcbiAgICB2YXIgY2hhcmFjdGVyVGFnZmllbGRJdGVtID0gbmV3IFRhZ2ZpZWxkKGVsLmZpbmQoJy5qcy10YWdmaWVsZCcpLmdldCgwKSwge1xuICAgICAgbGFiZWw6ICdSb2xlKHMpJyxcbiAgICAgIHBsYWNlaG9sZGVyOiAnUm9sZShzKScsXG4gICAgICBpdGVtczogcGVyc29ucy5jb25jYXQoY2hhcmFjdGVycykuc29ydCgpLFxuICAgICAgY3JlYXRlVGFnczogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBjYXN0Um93ID0gY3JlYXRlRW1wdHlDYXN0Um93KCk7XG4gIHNlY3Rpb24uYXBwZW5kKGNhc3RSb3cpO1xuICB2YXIgYWRkYWJsZU9iamVjdCA9IG5ldyBBZGRhYmxlKGNhc3RSb3csIHtiZWZvcmVBZGQ6IGJlZm9yZUFkZENhc3QsIHNvcnRhYmxlOiB0cnVlfSk7XG4gIGFkZGFibGVPYmplY3QucmVtb3ZlSXRlbSgwKTtcbiAgYWRkYWJsZU9iamVjdC5fYWRkSXRlbShjcmVhdGVFbXB0eUNhc3RSb3coKSwgYmVmb3JlQWRkQ2FzdCk7XG5cbiAgcmV0dXJuIGFkZGFibGVPYmplY3Q7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVtcHR5Q2FzdFJvdyAoKSB7XG4gIHZhciBjYXN0Um93ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2dfX2NvbnRyb2xzIGNnX19jb250cm9sc19zdHlsZV9yb3cnKSxcbiAgcGVyc29uV3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NnX19jb250cm9sIGNnX19jb250cm9sX3N0eWxlX3JvdycpLFxuICBwZXJzb25TZWxlY3QgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdqcy1zZWxlY3Rib3gnKSxcbiAgY2hhcmFjdGVyV3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NnX19jb250cm9sIGNnX19jb250cm9sX3N0eWxlX3JvdycpLFxuICBjaGFyYWN0ZXJUYWdmaWVsZCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLXRhZ2ZpZWxkJyksXG4gIGFzVGV4dCA9ICQoJzxzcGFuPjwvc3Bhbj4nKS5hZGRDbGFzcygnY2FzdF9fdGV4dERpdmlkZXInKS50ZXh0KCdhcycpO1xuXG4gIHBlcnNvbldyYXBwZXIuYXBwZW5kKHBlcnNvblNlbGVjdCk7XG4gIGNoYXJhY3RlcldyYXBwZXIuYXBwZW5kKGNoYXJhY3RlclRhZ2ZpZWxkKTtcbiAgY2FzdFJvdy5hcHBlbmQocGVyc29uV3JhcHBlciwgYXNUZXh0LCBjaGFyYWN0ZXJXcmFwcGVyKTtcblxuICByZXR1cm4gY2FzdFJvdztcbn1cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gIHZhciBzY3JvbGxQb3NpdGlvbjtcbiAgdmFyIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gIFxuICAvL1N0aWNreSBzY3JvbGxiYXJcbiAgc3RpY2t5VG9wYmFyID0gbmV3IFN0aWNreVRvcGJhcigpO1xuICBcbiAgLy9Ob3JtYWxpemVyc1xuICBub3JtaWxpemVNZW51KCk7XG4gIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgbm9ybWFsaXplU2VsZWN0ZWlvbigpO1xuICBcbiAgJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5zZWN0aW9uX19maWxlcycpLmRpc2FibGVTZWxlY3Rpb24oKTtcbiAgXG4gIC8vQ2hlY2sgZm9yIHJlcXVpcmVkIGZpZWxkc1xuICAkKCdsYWJlbC5yZXF1aWVyZWQnKS5wYXJlbnQoKS5jaGlsZHJlbignaW5wdXQnKS5vbignYmx1cicsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoY2hlY2tGaWVsZChlLnRhcmdldCkpIHtcbiAgICAgIG1hcmtGaWVsZEFzTm9ybWFsKGUudGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWFya0ZpZWxkQXNSZXF1aXJlZChlLnRhcmdldCk7XG4gICAgfVxuICB9KTtcbiAgXG4gIFxuICBcbiAgLy9DbGljayBvbiBsb2dvXG4gICQoJy5qcy1sb2dvJykuY2xpY2soaGFuZGxlTG9nb0NsaWNrKTtcbiAgZnVuY3Rpb24gaGFuZGxlTG9nb0NsaWNrKGUpIHtcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignY3JlYXRlJykgPj0gMCAmJlxuICAgICFkcmFmdElzU2F2ZWQgJiZcbiAgICAkKCcuanMtY29udGVudCAuZmlsZSwgLmpzLWNvbnRlbnQgLmpzLWhhc1ZhbHVlJykubGVuZ3RoID4gMCkge1xuICAgICAgbmV3IE1vZGFsKHtcbiAgICAgICAgdGl0bGU6ICdMZWF2ZSBQYWdlPycsXG4gICAgICAgIHRleHQ6ICdZb3Ugd2lsbCBsb3NlIGFsbCB1bnNhdmVkIGNoYW5nZXMuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBsZWF2ZSB0aGlzIHBhZ2U/JyxcbiAgICAgICAgY29uZmlybVRleHQ6ICdMZWF2ZSBQYWdlJyxcbiAgICAgICAgY29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnZGFzaGJvYXJkLmh0bWwnO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnZGFzaGJvYXJkLmh0bWwnO1xuICAgIH1cbiAgfVxuICBcbiAgLy9Bc3NldCBMaWJyYXJ5XG4gIFxuICAkKCcjYWxDbG9zZUJ1dHRvbicpLmNsaWNrKGNsb3NlQXNzZXRMaWJyYXJ5KTtcbiAgJCgnI2FsVG9wQ2xvc2VCdXR0b24nKS5jbGljayhjbG9zZUFzc2V0TGlicmFyeSk7XG4gICQoJyNhc3NldExpYnJhcnknKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgb3BlbkFzc2V0TGlicmFyeShlKTtcbiAgfSk7XG4gIGZ1bmN0aW9uIG9wZW5Bc3NldExpYnJhcnkoZSwgb3B0aW9ucykge1xuICAgIHNjcm9sbFBvc2l0aW9uID0gJCgnYm9keScpLnNjcm9sbFRvcCgpO1xuICAgIHVwZGF0ZUFzc2V0TGlicmFyeSgpO1xuICAgICQoJyNhbCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAkKCcjYWwnKS5hZGRDbGFzcygnbW9kYWwnKTtcbiAgICAkKCcjd3JhcHBlcicpLmFkZENsYXNzKCdvdmVyZmxvdycpO1xuICAgIHNpbmdsZXNlbGVjdCA9IGZhbHNlO1xuICAgICQoJyNhZGRGcm9tQUxCdXR0b24nKS50ZXh0KCdBZGQgRmlsZXMnKTtcbiAgXG4gICAgJCgnI2FkZEZyb21BTEJ1dHRvbicpLmNsaWNrKGFkZEZpbGVzRnJvbUFzc2V0TGlicmFyeSk7XG4gICAgc2V0TW9kYWxLZXlib2FyZEFjdGlvbnMoYWRkRmlsZXNGcm9tQXNzZXRMaWJyYXJ5LCBjbG9zZUFzc2V0TGlicmFyeSk7XG4gICAgJChlLnRhcmdldCkuYmx1cigpO1xuICB9XG4gIFxuICBmdW5jdGlvbiBhZGRGaWxlc0Zyb21Bc3NldExpYnJhcnkoKXtcbiAgICBsYXN0U2VsZWN0ZWQgPSBudWxsO1xuICAgIGFkZFNlbGVjdGVkRmlsZXMoKTtcbiAgICBjbG9zZUFzc2V0TGlicmFyeSgpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcbiAgfVxuICBmdW5jdGlvbiBjbG9zZUFzc2V0TGlicmFyeSgpIHtcbiAgICBsYXN0U2VsZWN0ZWQgPSBudWxsO1xuICAgICQoJy5hbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgZGVzZWxlY3RBbGwoKTtcbiAgICAkKCcubW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJykucmVtb3ZlQ2xhc3MoJ21vZGFsJyk7XG4gICAgJCgnI3dyYXBwZXInKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3cnKTtcbiAgICAkKCcjYWRkRnJvbUFMQnV0dG9uJykudW5iaW5kKCdjbGljaycpO1xuICAgICQoJ2JvZHknKS5zY3JvbGxUb3Aoc2Nyb2xsUG9zaXRpb24pO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcbiAgfVxuICBcbiAgJCgnI2FsJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICQoJyNhbCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgfSk7XG4gICQoJyNhbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzJykuZGlzYWJsZVNlbGVjdGlvbigpO1xuICBcbiAgLy9VcGxvYWQgZmlsZXNcbiAgJCgnI3VwbG9hZEZpbGVzJykuY2xpY2soaGFuZGxlVXBsb2FkRmlsZXNDbGljayk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGhhbmRsZURyYWdFbnRlciwgdHJ1ZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgaGFuZGxlRHJhZ092ZXIsIGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGhhbmRsZURyb3AsIGZhbHNlKTtcbiAgXG4gIC8vRHJhZnQgZnVuY3Rpb246IFNhdmUsIENhbmNlbCwgUHVibGlzaFxuICBmdW5jdGlvbiBzYXZlRHJhZnQoKSB7XG4gICAgc2hvd05vdGlmaWNhdGlvbignVGhlIGRyYWZ0IGlzIHNhdmVkLicpO1xuICAgIGRyYWZ0SXNTYXZlZCA9IHRydWU7XG4gIH1cbiAgZnVuY3Rpb24gcmVtb3ZlRHJhZnQoKSB7XG4gICAgbmV3IE1vZGFsKHtcbiAgICAgIHRpdGxlOiAnQ2FuY2VsIHRoaXMgRHJhZnQ/JyxcbiAgICAgIHRleHQ6ICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gY2FuY2VsIGFuZCBkaXNjYXJkIHRoaXMgZHJhZnQ/JyxcbiAgICAgIGNvbmZpcm1UZXh0OiAnQ2FuY2VsJyxcbiAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdkYXNoYm9hcmQuaHRtbCc7XG4gICAgICB9LFxuICAgICAgY2FuY2VsQWN0aW9uOiBoaWRlTW9kYWxQcm9tcHRcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBwdWJsaXNoRHJhZnQoKSB7XG4gICAgdmFyIGl0ZW1OYW1lID0gJCgnLm1lbnUgLmlzLWFjdGl2ZScpLnRleHQoKSxcbiAgICBwcm9tcHRNc2cgPSAnJztcbiAgXG4gICAgc3dpdGNoIChpdGVtTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICBjYXNlICdwZXJzb24nOlxuICAgICAgcHJvbXB0TXNnID0gJ1B1Ymxpc2hlZCBwZXJzb24gd2lsbCBiZWNvbWUgYXZhaWxhYmxlIHRvIGJlIGFkZGVkIGFzIHBhcnQgb2YgYSBjYXN0IGZvciBhIHNlYXNvbi9ldmVudC4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHB1Ymxpc2ggaXQ/JztcbiAgICAgIGJyZWFrO1xuICBcbiAgICAgIGNhc2UgJ3JvbGUnOlxuICAgICAgcHJvbXB0TXNnID0gJ1B1Ymxpc2hlZCByb2xlIHdpbGwgYmVjb21lIGF2YWlsYWJsZSB0byBiZSBhZGRlZCBhcyBwYXJ0IG9mIGEgY2FzdCBmb3IgYSBzZWFzb24vZXZlbnQuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwdWJsaXNoIGl0Pyc7XG4gICAgICBicmVhaztcbiAgXG4gICAgICBkZWZhdWx0OlxuICAgICAgcHJvbXB0TXNnID0gJ1B1Ymxpc2hlZCAnICsgaXRlbU5hbWUudG9Mb3dlckNhc2UoKSArICcgd2lsbCBiZWNvbWUgYXZhaWxhYmxlIG9uIHRoZSBsaXZlIHNpdGUuIEFyZSB5b3Ugc3VyZSB5b3Ugd291bGQgbGlrZSB0byBwdWJsaXNoIGl0Pyc7XG4gICAgICBicmVhaztcbiAgXG4gICAgfVxuICAgIG5ldyBNb2RhbCh7XG4gICAgICB0aXRsZTogJ1B1Ymxpc2ggdGhpcyAnICsgaXRlbU5hbWUgKyAnPycsXG4gICAgICB0ZXh0OiBwcm9tcHRNc2csXG4gICAgICBjb25maXJtVGV4dDogJ1B1Ymxpc2gnLFxuICAgICAgY29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGhpZGVNb2RhbFByb21wdCgpO1xuICAgICAgICBzaG93Tm90aWZpY2F0aW9uKGl0ZW1OYW1lICsgJyBpcyBwdWJsaXNoZWQuJyk7XG4gICAgICAgIGRyYWZ0SXNTYXZlZCA9IHRydWU7XG4gICAgICB9LFxuICAgICAgY2FuY2VsQWN0aW9uOiBoaWRlTW9kYWxQcm9tcHRcbiAgICB9KTtcbiAgfVxuICBcbiAgJCgnI3NhdmVEcmFmdCcpLmNsaWNrKHNhdmVEcmFmdCk7XG4gICQoJyNyZW1vdmVEcmFmdCcpLmNsaWNrKHJlbW92ZURyYWZ0KTtcbiAgJCgnI3B1Ymxpc2hEcmFmdCcpLmNsaWNrKHB1Ymxpc2hEcmFmdCk7XG4gIFxuICAvL1RvcCBiYXIgYWN0aW9ucyBkcm9wZG93biBmb3IgbW9iaWxlXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aW9uRHJvcGRvd24nKSkge1xuICAgIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aW9uRHJvcGRvd24nKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBTYXZlIGFzIGRyYWZ0PC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogc2F2ZURyYWZ0XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLWJhblwiPjwvaT48c3BhbiBjbGFzcz1cImJ1dHRvblRleHRcIj4gIENhbmNlbDwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IHJlbW92ZURyYWZ0XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBcbiAgLy9GaWxlcyBtb3JlIGFjdGlvbiBkcm9wZG93bnNcbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3JlQWN0aW9ucycpKSB7XG4gICAgdmFyIHBhZ2VBY3Rpb25Ecm9wZG93biA9IG5ldyBEcm9wZG93bihcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3JlQWN0aW9ucycpLFxuICAgICAge1xuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJ1NlbmQgdG8gdG9wJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVTZW5kVG9Ub3BDbGlja1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnU2VuZCB0byBib3R0b20nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZVNlbmRUb0JvdHRvbUNsaWNrXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBcbiAgLy9NZWRpYSBjYXJkIGRyb3Bkb3duc1xuICAvL1NtYWxsXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVkaWFBY3Rpb25zU21hbGwnKSkge1xuICAgIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVkaWFBY3Rpb25zU21hbGwnKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgVXBsb2FkIGZpbGVzPC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlVXBsb2FkRmlsZXNDbGlja1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1mb2xkZXItb3BlblwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgQWRkIGZyb20gbGlicmFyeTwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgb3BlbkFzc2V0TGlicmFyeShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICApO1xuICB9XG4gIC8vRnVsbFxuICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lZGlhQWN0aW9uc0Z1bGwnKSkge1xuICAgIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVkaWFBY3Rpb25zRnVsbCcpLFxuICAgICAge1xuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtcGVuY2lsLXNxdWFyZVwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgTXVsdGkgRWRpdDwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZU11bHRpRWRpdEJ1dHRvbkNsaWNrLFxuICAgICAgICAgICAgZGlzYWJsZWQ6IGZ1bmN0aW9uKCkge3JldHVybiAkKCcjbXVsdGlFZGl0JykuaGFzQ2xhc3MoJ2Rpc2FibGVkJyk7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS10aW1lcy1jaXJjbGVcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIFJlbW92ZTwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZUJ1bGtSZW1vdmVDbGljayxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI2J1bGtSZW1vdmUnKS5oYXNDbGFzcygnZGlzYWJsZWQnKTt9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkaXZpZGVyOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgVXBsb2FkIGZpbGVzPC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlVXBsb2FkRmlsZXNDbGlja1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1mb2xkZXItb3BlblwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgQWRkIGZyb20gbGlicmFyeTwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgb3BlbkFzc2V0TGlicmFyeShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICApO1xuICB9XG4gIFxuICAvL0Fzc2V0IGxpYnJhcnkgZHJvcGRvd25zXG4gIC8vU21hbGxcbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc3NldEFjdGlvbnNTbWFsbCcpKSB7XG4gICAgdmFyIHBhZ2VBY3Rpb25Ecm9wZG93biA9IG5ldyBEcm9wZG93bihcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc3NldEFjdGlvbnNTbWFsbCcpLFxuICAgICAge1xuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtdXBsb2FkXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBVcGxvYWQgZmlsZXM8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVVcGxvYWRGaWxlc0NsaWNrXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICAvL0Z1bGxcbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc3NldEFjdGlvbnNGdWxsJykpIHtcbiAgICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fzc2V0QWN0aW9uc0Z1bGwnKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXBlbmNpbFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgQnVsayBFZGl0PC9zcGFuPjxzcGFuIGNsYXNzPVwiZHJvcGRvd25fX3dhcm5pbmdcIj48L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVNdWx0aUVkaXRCdXR0b25DbGljayxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI2J1bGtFZGl0JykuaGFzQ2xhc3MoJ2Rpc2FibGVkJyk7fSxcbiAgICAgICAgICAgIHdhcm5pbmc6IGZ1bmN0aW9uKCkge3JldHVybiAhJCgnI2J1bGtFZGl0JykuY2hpbGRyZW4oJy5idXR0b25fX3dhcm5pbmcnKS5oYXNDbGFzcygnaXMtaGlkZGVuJyk7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1wZW5jaWwtc3F1YXJlXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBNdWx0aSBFZGl0PC9zcGFuPjxzcGFuIGNsYXNzPVwiZHJvcGRvd25fX3dhcm5pbmdcIj48L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVNdWx0aUVkaXRCdXR0b25DbGljayxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI211bHRpRWRpdCcpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO30sXG4gICAgICAgICAgICB3YXJuaW5nOiBmdW5jdGlvbigpIHtyZXR1cm4gISQoJyNtdWx0aUVkaXQnKS5jaGlsZHJlbignLmJ1dHRvbl9fd2FybmluZycpLmhhc0NsYXNzKCdpcy1oaWRkZW4nKTt9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXRpbWVzLWNpcmNsZVwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgUmVtb3ZlPC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlQnVsa1JlbW92ZUNsaWNrLFxuICAgICAgICAgICAgZGlzYWJsZWQ6IGZ1bmN0aW9uKCkge3JldHVybiAkKCcjYnVsa1JlbW92ZScpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRpdmlkZXI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtdXBsb2FkXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBVcGxvYWQgZmlsZXM8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVVcGxvYWRGaWxlc0NsaWNrXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBcbiAgXG4gIC8vSW5pdCBwbGFjZWhvbGRlcnMgZm9yIGltYWdlcyBpZiBhbnkgKGNvdmVyLCBldGMuKVxuICB3aW5kb3cuaW1hZ2VQbGFjZWhvbGRlcnMgPSBpbml0SW1hZ2VQbGFjZWhvbGRlcnMoKTtcbiAgXG4gIC8vRm9jYWwgcG9pbnRcbiAgJCgnI2ZvY2FsUG9pbnRUb2dnbGUnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgJChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZSBidXR0b25fc3R5bGVfb3V0bGluZS13aGl0ZSBidXR0b25fc3R5bGVfb3V0bGluZS1hY2NlbnQnKTtcbiAgICAkKCcucHIgPiAucHJldmlldycpLnRvZ2dsZUNsYXNzKCdmb2NhbCBsaW5lIHBvaW50Jyk7XG4gIFxuICB9KTtcbiAgLyogSGFuZGxlIFB1cnBvc2VzIHNjcm9sbCAqL1xuICAkKCcjcHVycG9zZVdyYXBwZXInKS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4gICAgc2V0UHVycG9zZVBhZ2luYXRpb24oKTtcbiAgfSk7XG4gIFxuICAkKCcjZm9jYWxQb2ludCcpLmRyYWdnYWJsZSh7XG4gICAgY29udGFpbm1lbnQ6IFwiI3ByZXZpZXdJbWdcIixcbiAgICBzY3JvbGw6IGZhbHNlICxcbiAgICBzdG9wOiBmdW5jdGlvbihlKSB7XG4gICAgICBhZGp1c3RGb2NhbFBvaW50KCk7XG4gICAgICBhZGp1c3RQdXJwb3NlKCQoZS50YXJnZXQpKTtcbiAgICAgIGRhdGFDaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICAvKiBJbml0IFB1cnBvc2UgUGFnaW5hdG9yICovXG4gIFxuICBmdW5jdGlvbiBzZXRQdXJwb3NlUGFnaW5hdGlvbigpIHtcbiAgICB2YXIgc2Nyb2xsT2Zmc2V0ID0gJCgnI3B1cnBvc2VXcmFwcGVyJykuc2Nyb2xsTGVmdCgpO1xuICAgIHZhciB3aWR0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwdXJwb3NlV3JhcHBlcicpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgIHZhciBmaXJzdEluZGV4ID0gTWF0aC5mbG9vcihzY3JvbGxPZmZzZXQvMTQwKSArIDE7XG4gICAgdmFyIGxhc3RJbmRleCA9IGZpcnN0SW5kZXggKyBNYXRoLnJvdW5kKHdpZHRoLzE0MCkgLSAxO1xuICAgIHZhciBjb3VudCA9ICQoJyNwdXJwb3NlV3JhcHBlciAucHVycG9zZScpLmxlbmd0aDtcbiAgXG4gICAgbGFzdEluZGV4ID0gbGFzdEluZGV4IDwgY291bnQgPyBsYXN0SW5kZXggOiBjb3VudDtcbiAgXG4gICAgJCgnI3AtcGFnaW5hdG9yJykudGV4dChmaXJzdEluZGV4ICsgJyDigJQgJyArIGxhc3RJbmRleCArICcgb2YgJyArIGNvdW50KTtcbiAgfVxuICBcbiAgJCgnI3Nob3dQcmV2aWV3JykuY2xpY2soc2hvd0FsbFByZXZpZXdzKTtcbiAgJCgnI2hpZGVQdXJwb3NlJykuY2xpY2soaGlkZUFsbFByZXZpZXdzKTtcbiAgJCgnI2xvYWRNb3JlJykuY2xpY2soaGFuZGxlU2hvd01vcmUpO1xuICBcbiAgZnVuY3Rpb24gc2hvd0FsbFByZXZpZXdzKCkge1xuICAgICQoJyNwdXJwb3NlcycpLmFkZENsYXNzKCdpcy1vcGVuJyk7XG4gICAgJCgnI3ByZXZpZXdJbWFnZScpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAkKCcjcHJldmlld0NvbnRyb2xzJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICBcbiAgICAvL0NoZWNrIGlmIGl0IGlzIGEgbW9iaWxlIHNjcmVlblxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDY1MCkge1xuICAgICAgJChcIiNwdXJwb3NlcyAuYy1QdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2VcIikuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgJChcIiNwdXJwb3NlcyAuYy1QdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UuaGlkZGVuXCIpLnNsaWNlKDAsIDUpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICQoJyNsb2FkTW9yZScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICB9XG4gICAgLy8kKCcucHJldmlldy5mb2NhbCcpLmFkZENsYXNzKCdmdWxsJykucmVtb3ZlQ2xhc3MoJ2xpbmUnKTtcbiAgICAvLyQoJyNwdXJwb3NlVG9nZ2xlJykuY2hpbGRyZW4oJ3NwYW4nKS50ZXh0KCdIaWRlIFByZXZpZXcnKTtcbiAgfVxuICBmdW5jdGlvbiBoaWRlQWxsUHJldmlld3MoKSB7XG4gICAgJCgnI3B1cnBvc2VzJykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICAkKCcjcHJldmlld0ltYWdlJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICQoJyNwcmV2aWV3Q29udHJvbHMnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlU2hvd01vcmUoZSkge1xuICAgICQoXCIjcHVycG9zZXMgLmMtUHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlLmhpZGRlblwiKS5zbGljZSgwLCA1KS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgaWYgKCQoXCIjcHVycG9zZXMgLmMtUHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlLmhpZGRlblwiKS5sZW5ndGggPT09IDApIHtcbiAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICB9XG4gIH1cbiAgXG4gIFxuICAvL1NlbGVjdGVkIEZpbGVzIGFjdGlvbnNcbiAgJCgnI2J1bGtFZGl0JykuY2xpY2soaGFuZGxlQnVsa0VkaXRCdXR0b25DbGljayk7XG4gICQoJyNtdWx0aUVkaXQnKS5jbGljayhoYW5kbGVNdWx0aUVkaXRCdXR0b25DbGljayk7XG4gICQoJyNidWxrUmVtb3ZlJykuY2xpY2soaGFuZGxlQnVsa1JlbW92ZUNsaWNrKTtcbiAgXG4gIGZ1bmN0aW9uIGhhbmRsZUJ1bGtSZW1vdmVDbGljaygpIHtcbiAgICB2YXIgZmlsZXNUb0RlbGV0ZSA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpLFxuICAgIGl0ZW1OYW1lID0gJCgnLm1lbnUgLmlzLWFjdGl2ZScpLnRleHQoKS50b0xvd2VyQ2FzZSgpLFxuICAgIGFzc2V0TGlicmFyeSA9IGl0ZW1OYW1lID09PSAnYXNzZXQgbGlicmFyeScsXG4gICAgbXNnVGl0bGUgPSBhc3NldExpYnJhcnk/ICdEZWxldGUgQXNzZXRzPycgOiAnUmVtb3ZlIEFzc2V0cz8nLFxuICAgIG1lc2dUZXh0ID0gYXNzZXRMaWJyYXJ5PyAnU2VsZWN0ZWQgYXNzZXQocykgd2lsbCBiZSBkZWxldGVkIGZyb20gdGhlIGFzc2V0IGxpYnJhcnkuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhlbT8nIDogJ1NlbGVjdGVkIGFzc2V0KHMpIHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoaXMgJyArIGl0ZW1OYW1lICsgJy4gRG9u4oCZdCB3b3JyeSwgaXQgd29u4oCZdCBiZSBkZWxldGVkIGZyb20gdGhlIEFzc2V0IExpYnJhcnkuJyxcbiAgICBidG5OYW1lID0gYXNzZXRMaWJyYXJ5PyAnRGVsZXRlJyA6ICdSZW1vdmUnO1xuICAgIG5ldyBNb2RhbCh7XG4gICAgICB0aXRsZTogbXNnVGl0bGUsXG4gICAgICB0ZXh0OiBtZXNnVGV4dCxcbiAgICAgIGNvbmZpcm1UZXh0OiBidG5OYW1lLFxuICAgICAgY29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGZpbGVzVG9EZWxldGUuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgICAgIHZhciBpZCA9ICQoZWwpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcbiAgICAgICAgICBkZWxldGVGaWxlQnlJZChpZCwgZ2FsbGVyeU9iamVjdHMpO1xuICAgICAgICB9KTtcbiAgICAgICAgdXBkYXRlR2FsbGVyeSgpO1xuICAgICAgfSxcbiAgICAgIGNhbmNlbEFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zYnInKS5yZW1vdmVDbGFzcygnc2JyJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgXG4gIC8vRmlsZSBFZGl0IFNhdmUgYW5kIENhbmNlbFxuICAkKCcjc2F2ZUNoYW5nZXMnKS5jbGljayhzYXZlSW1hZ2VFZGl0KTtcbiAgJCgnI2NhbmNlbENoYW5nZXMnKS5jbGljayhjYW5jZWxJbWFnZUVkaXQpO1xuICAkKCcjZnBUb3BDbG9zZUJ1dHRvbicpLmNsaWNrKGNhbmNlbEltYWdlRWRpdCk7XG4gIFxuICAvL0ZpbGUgRWRpdCBmaWVsZCBjaGFuZ2VzXG4gICQoJyN0aXRsZScpLm9uKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtzYXZlVGl0bGUoKTt9KTtcbiAgJCgnI2NhcHRpb24nKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKSB7c2F2ZUNhcHRpb24oKTt9KTtcbiAgJCgnI2Rlc2NyaXB0aW9uJykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVEZXNjcmlwdGlvbigpO30pO1xuICAkKCcjcmVzb2x1dGlvbicpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7c2F2ZVJlc29sdXRpb24oKTt9KTtcbiAgJCgnI2FsdFRleHQnKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKSB7c2F2ZUFsdFRleHQoKTt9KTtcbiAgXG4gIC8vSGFuZGxlIHNlbGVjdGlvbnNcbiAgJCgnI3NlbGVjdEFsbCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VtcHR5JykpIHtcbiAgICAgIHNlbGVjdEFsbCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZXNlbGVjdEFsbCgpO1xuICAgIH1cbiAgfSk7XG4gICQoJyNkZXNlbGVjdEFsbCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtkZXNlbGVjdEFsbCgpO30pO1xuICBcbiAgLy9Jbml0IGFkZGFibGUgZmllbGRzXG4gIGluaXRBZGRhYmxlRmllbGRzKCk7XG4gIFxuICBcbiAgXG4gIFxuICBcbiAgLy9hdXRvZXhwYW5kYWJsZSB0ZXh0YXJlYVxuICAkKCAndGV4dGFyZWEnICkuZWxhc3RpYygpO1xuICBcbiAgXG4gIFxuICAvKlxuICAqIENhcmRzXG4gICovXG4gIFxuICAvL0ZvbGRhYmxlIGNhcmRzXG4gICQoJy5qcy1mb2xkYWJsZSAuanMtZm9sZGVkVG9nZ2xlJykuY2xpY2soaGFuZGxlRm9sZGVkVG9nZ2xlQ2xpY2spO1xuICBmdW5jdGlvbiBoYW5kbGVGb2xkZWRUb2dnbGVDbGljayhlKSB7XG4gICAgdmFyIGNhcmQgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuanMtZm9sZGFibGUnKTtcbiAgICBpZiAoY2FyZC5oYXNDbGFzcygnaXMtZm9sZGVkJykpIHtcbiAgICAgIGNhcmQucmVtb3ZlQ2xhc3MoJ2lzLWZvbGRlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYXJkLmFkZENsYXNzKCdpcy1mb2xkZWQnKTtcbiAgICB9XG4gIH1cbiAgLy9TdGlja3kgY2FyZCBoZWFkZXJcbiAgJCgnLmpzLXN0aWNreU9uTW9iaWxlJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICB2YXIgc3RpY2t5ID0gbmV3IFN0aWNrYWJsZShlbCwge1xuICAgICAgbWF4V2lkdGg6IDYwMCxcbiAgICAgIGJvdW5kYXJ5OiB0cnVlLFxuICAgICAgb2Zmc2V0OiA1MFxuICAgIH0pO1xuICB9KTtcbiAgJCgnLmpzLXNlY3Rpb25UaXRsZScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgdmFyIHN0aWNreSA9IG5ldyBTdGlja2FibGUoZWwsIHtcbiAgICAgIG1heFdpZHRoOiA2MDAsXG4gICAgICBib3VuZGFyeTogJyNtZWRpYS1jYXJkJyxcbiAgICAgIG9mZnNldDogMTA0XG4gICAgfSk7XG4gIH0pO1xuICBcbiAgLy9BbmltYXRpb24gZW5kIGhhbmRsZVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgZnVuY3Rpb24oZSkge1xuICAgIHN3aXRjaCAoZS5hbmltYXRpb25OYW1lKSB7XG4gICAgICBjYXNlICdjb2xsZWN0aW9uSXRlbS1wdWxzZS1vdXQnOlxuICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2lzLWFwcGVhcmluZycpO1xuICAgICAgcmV0dXJuIGU7XG4gIFxuICAgICAgY2FzZSAnaW1nLXdyYXBwZXItc2xpZGUtbGVmdCc6XG4gICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnaXMtc2xpZGluZ0xlZnQnKTtcbiAgICAgIHJldHVybiBlO1xuICBcbiAgICAgIGNhc2UgJ2ltZy13cmFwcGVyLXNsaWRlLXJpZ2h0JzpcbiAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdpcy1zbGlkaW5nUmlnaHQnKTtcbiAgICAgIHJldHVybiBlO1xuICBcbiAgICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZTtcbiAgICB9XG4gIH0pO1xuICBcbiAgXG4gIFxuICBcbiAgLy9SZWN1cnJpbmcgdG9nZ2xlXG4gICQoJyNyZWN1cnJpbmdUb2dnbGUnKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuICAgIGlmIChlLnRhcmdldC5jaGVja2VkKSB7XG4gICAgICAkKCcjcmVjdXJpbmdUaW1lJykucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJyNyZWN1cmluZ1RpbWUnKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vRXZlbnQgdGl0bGUgYW5kIHRpdGxlIGlucHV0XG4gIGlmICgkKCcjZXZlbnRUaXRsZUlucHV0JykuZ2V0KDApKSB7XG4gICAgdmFyIGV2ZW50VGl0bGVJbnB1dCA9IG5ldyBUZXh0ZmllbGQoJCgnI2V2ZW50VGl0bGVJbnB1dCcpLmdldCgwKSwge1xuICAgICAgbGFiZWw6ICdUaXRsZScsXG4gICAgICBoZWxwVGV4dDogJ01hdXJpcyBtYWxlc3VhZGEgbmliaCBuZWMgbGVvIHBvcnRhIG1heGltdXMuJyxcbiAgICAgIGVyck1zZzogJ1BsZWFzZSBmaWxsIHRoZSB0aXRsZScsXG4gICAgICBvbklucHV0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICQoJyNldmVudFRpdGxlVGV4dCcpLnRleHQoZS50YXJnZXQudmFsdWUgfHwgJ05ldyBFdmVudCcpO1xuICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgJCgnLmhlYWRlcl9fc3ViaGVhZCcpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvL0V2ZW50IFR5cGUgU2VsZWN0Ym94XG4gIGlmICgkKCcjZXZlbnRUeXBlU2VsZWN0Ym94JykuZ2V0KDApKSB7XG4gICAgbmV3IFNlbGVjdGJveCgkKCcjZXZlbnRUeXBlU2VsZWN0Ym94JykuZ2V0KDApLCB7XG4gICAgICBsYWJlbDogJ0V2ZW50IFR5cGUnLFxuICAgICAgaXRlbXM6IFsnTW92aWUnLCAnTGl2ZSBFdmVudCcsICdXZWIgRXZlbnQnLCAnU3BlY2lhbCcsICdIb2xpZGF5IFNwZWNpYWwnLCAnUHJlcXVlbCddLnNvcnQoKSxcbiAgICAgIHBsYWNlaG9sZGVyOiAnU2VsZWN0IFNlcmllcycsXG4gICAgICBpdGVtQ2FsbGJhY2s6IGZ1bmN0aW9uKHRhcmdldCwgc2VsZWN0Ym94KSB7XG4gICAgICAgIGlmICh0YXJnZXQuaW5uZXJIVE1MID09PSAnTW92aWUnKSB7XG4gICAgICAgICAgJCgnI2V2ZW50UmVsZWFzZVllYXIsICNldmVudENoYW5uZWxPcmlnaW5hbCwgI2V2ZW50QWlyVGltZXMnKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKCcjZXZlbnRSZWxlYXNlWWVhciwgI2V2ZW50Q2hhbm5lbE9yaWdpbmFsLCAjZXZlbnRBaXJUaW1lcycpLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvL0luaXQgQ2FzdCBjb2xsZWN0aW9uXG4gIGluaXRDYXN0U2VjdGlvbigkKCcjY2FzdFNlY3Rpb24nKS5maW5kKCcuY29udHJvbHNfX2dyb3VwJykpO1xuICBpbml0Q3JlZGl0U2VjdGlvbigkKCcjY3JlZGl0U2VjdGlvbicpLmZpbmQoJy5jb250cm9sc19fZ3JvdXAnKSk7XG59KTsiXSwiZmlsZSI6ImNyZWF0ZS1ldmVudC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
