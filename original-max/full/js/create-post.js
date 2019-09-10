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
    initPostList($('#postList'));
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcmVhdGUtcG9zdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvL0NvbW1vbiBqcyBmaWxlc1xuLy9NZW51XG5mdW5jdGlvbiBub3JtaWxpemVNZW51KCkge1xuICB2YXIgcGFnZU5hbWUgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnLycpLnBvcCgpLFxuICBtZW51SXRlbXMgPSAkKCcuanMtbWVudSAuanMtbWVudUl0ZW0nKTtcbiAgYWN0aXZlTWVudUl0ZW0gPSAkKCdbZGF0YS10YXJnZXQ9XCInICsgcGFnZU5hbWUgKyAnXCJdJyk7XG5cbiAgbWVudUl0ZW1zLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKS5jbGljayhoYW5kbGVNZW51SXRlbUNsaWNrKTtcbiAgYWN0aXZlTWVudUl0ZW0uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICBhY3RpdmVNZW51SXRlbS5wYXJlbnRzKCcubWVudV9faXRlbScpLmFkZENsYXNzKCdpcy1vcGVuJyk7XG59XG5mdW5jdGlvbiBoYW5kbGVNZW51SXRlbUNsaWNrKGUpIHtcbiAgaWYgKCQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFyZ2V0JykpIHtcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignY3JlYXRlJykgPj0gMCAmJiAhZHJhZnRJc1NhdmVkICYmICQoJy5qcy1jb250ZW50IC5maWxlLCAuanMtY29udGVudCAuanMtaGFzVmFsdWUnKS5sZW5ndGggPiAwKSB7XG4gICAgICBuZXcgTW9kYWwoe1xuICAgICAgICB0aXRsZTogJ0xlYXZlIFBhZ2U/JyxcbiAgICAgICAgdGV4dDogJ1lvdSB3aWxsIGxvc2UgYWxsIHRoZSB1bnNhdmVkIGNoYW5nZXMuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBsZWF2ZSB0aGlzIHBhZ2U/JyxcbiAgICAgICAgY29uZmlybVRleHQ6ICdMZWF2ZSBQYWdlJyxcbiAgICAgICAgY29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhcmdldCcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhcmdldCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoJChlLnRhcmdldCkucGFyZW50cygnLm1lbnVfX2l0ZW0nKS5oYXNDbGFzcygnaXMtb3BlbicpKSB7XG4gICAgICAkKGUudGFyZ2V0KS5wYXJlbnRzKCcubWVudV9faXRlbScpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJy5tZW51X19pdGVtJykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICAgICQoZS50YXJnZXQpLnBhcmVudHMoJy5tZW51X19pdGVtJykuYWRkQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICB9XG4gIH1cbn1cblxuJCgnI21lbnVUb2dnbGUnKS5jbGljayhvcGVuTWVudSk7XG4kKCcuanMtbWVudSA+IC5qcy1jbG9zZScpLmNsaWNrKGNsb3NlTWVudSk7XG5cbmZ1bmN0aW9uIG9wZW5NZW51KGUpIHtcbiAgJCgnLmpzLW1lbnUnKS5hZGRDbGFzcygnaXMtb3BlbicpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2xvc2VNZW51KTtcbn1cbmZ1bmN0aW9uIGNsb3NlTWVudShlKSB7XG4gIGlmICgkKGUudGFyZ2V0KS5wYXJlbnRzKCcubWVudV9fbGlzdCcpLmxlbmd0aCA9PT0gMCkge1xuICAgICQoJy5qcy1tZW51JykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2xvc2VNZW51KTtcbiAgfVxufVxuXG4vL3NlbGVjdGlvblxuXG5mdW5jdGlvbiB0b2dnbGVGaWxlU2VsZWN0KGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR2YXIgZmlsZSA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJyksXG5cdFx0ZmlsZXNTZWN0aW9uID0gZmlsZS5wYXJlbnQoKSxcblx0XHRmaWxlcyA9IGZpbGVzU2VjdGlvbi5jaGlsZHJlbignLmZpbGUnKSxcblx0XHRzZWxlY3RlZEZpbGVzID0gZmlsZXNTZWN0aW9uLmNoaWxkcmVuKCcuZmlsZS5zZWxlY3RlZCcpLFxuXHRcdHNpbmdsZSA9IHNpbmdsZXNlbGVjdCB8fCBmYWxzZTtcblxuXHRpZiAoc2luZ2xlKSB7XG5cdFx0aWYgKGZpbGUuaGFzQ2xhc3MoJ3NlbGVjdGVkJykpIHtcblx0XHRcdGZpbGUucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZpbGVzU2VjdGlvbi5maW5kKCcuZmlsZScpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0ZmlsZS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Ly9DaGVjayBpZiB1c2VyIGhvbGQgU2hpZnQgS2V5XG5cdFx0aWYgKGUuc2hpZnRLZXkpIHtcblx0XHRcdGlmIChmaWxlLmhhc0NsYXNzKCdzZWxlY3RlZCcpKSB7XG5cdFx0XHRcdGZpbGUucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKHNlbGVjdGVkRmlsZXMpIHtcblx0XHRcdFx0XHR2YXIgZmlsZUluZGV4ID0gZmlsZS5pbmRleCgnLmZpbGUnKSxcblx0XHRcdFx0XHRcdGZpbGVzVG9CZVNlbGVjdCA9IGZpbGVzLnNsaWNlKGxhc3RTZWxlY3RlZCwgZmlsZUluZGV4ICsgMSk7XG5cblx0XHRcdFx0XHRpZiAobGFzdFNlbGVjdGVkID4gZmlsZUluZGV4KSB7XG5cdFx0XHRcdFx0XHRmaWxlc1RvQmVTZWxlY3QgPSBmaWxlcy5zbGljZShmaWxlSW5kZXgsIGxhc3RTZWxlY3RlZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZpbGVzVG9CZVNlbGVjdC5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHRcdFx0XHRmaWxlc1RvQmVTZWxlY3QucmVtb3ZlQ2xhc3MoJ2lzLXByZXNlbGVjdGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ZmlsZS50b2dnbGVDbGFzcygnc2VsZWN0ZWQgaXMtcHJlc2VsZWN0ZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGZpbGUudG9nZ2xlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0fVxuXHRcdGxhc3RTZWxlY3RlZCA9IGZpbGUuaW5kZXgoKTtcblx0XHRub3JtYWxpemVTZWxlY3RlaW9uKCk7XG5cdH1cbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZVNlbGVjdGVpb24oKSB7XG5cdHZhciBidWxrRGVsZXRlQnV0dG9uID0gJCgnI2J1bGtSZW1vdmUnKSxcblx0XHRidWxrRWRpdEJ1dHRvbiA9ICQoJyNidWxrRWRpdCcpLFxuXHRcdG11bHRpRWRpdEJ1dHRvbiA9ICQoJyNtdWx0aUVkaXQnKSxcblx0XHRtb3JlQWN0aW9uc0J1dHRvbiA9ICQoJyNtb3JlQWN0aW9ucycpLFxuXG5cdFx0c2VsZWN0QWxsQnV0dG9uID0gJCgnI3NlbGVjdEFsbCcpLFxuXHRcdHNlbGVjdEFsbExhYmVsID0gJCgnI3NlbGVjdEFsbExhYmVsJyksXG5cblx0XHRkZXNlbGVjdEFsbEJ1dHRvbiA9ICQoJyNkZXNlbGVjdEFsbCcpLFxuXHRcdGRlc2VsZWN0QWxsTGFiZWwgPSAkKCcjZGVzZWxlY3RBbGxMYWJlbCcpLFxuXG5cdFx0ZGVsZXRlQnV0dG9ucyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZSAuZmlsZV9fZGVsZXRlJyksXG5cdFx0ZWRpdEJ1dHRvbnMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUgLmJ1dHRvbicpLm5vdCgnLmMtRmlsZS1jb3ZlclRvZ2xlJyksXG5cdFx0YXJyYW5nZW1lbnRzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlIC5maWxlX19hcnJhZ2VtZW50JyksXG5cdFx0YXJyYW5nZW1lbnRJbnB1dHMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUgLmZpbGVfX2FycmFnZW1lbnQnKS5maW5kKCdpbnB1dCcpLFxuXHRcdHNldENvdmVyQnV0dG9ucyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZSBidXR0b24uYy1GaWxlLWNvdmVyVG9nbGUnKSxcblxuXHRcdHNlbGVjdGVkRGVsZXRlQnV0dG9uID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkIC5maWxlX19kZWxldGUnKSxcblx0XHRzZWxlY3RlZEVkaXRCdXR0b24gPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQgLmJ1dHRvbicpLFxuXHRcdHNlbGVjdGVkQXJyYW5nZW1lbnQgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQgLmZpbGVfX2FycmFnZW1lbnQnKSxcblx0XHRzZWxlY3RlZEFycmFuZ2VtZW50SW5wdXQgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQgLmZpbGVfX2FycmFnZW1lbnQnKS5maW5kKCdpbnB1dCcpLFxuXHRcdHNlbGVjdGVkU2V0Q292ZXJCdXR0b25zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkIGJ1dHRvbi5jLUZpbGUtY292ZXJUb2dsZScpLFxuXG5cdFx0bnVtYmVyT2ZGaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZScpLmxlbmd0aCxcblx0XHRudW1iZXJPZlNlbGVjdGVkRmlsZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKS5sZW5ndGgsXG5cdFx0bnVtYmVyT2ZTZWxlY3RlZEltYWdlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5qcy1pbWdGaWxlVHlwZS5zZWxlY3RlZCcpLmxlbmd0aCxcblx0XHRudW1iZXJPZlNlbGVjdGVkVmlkZW9zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLXZpZGVvRmlsZVR5cGUuc2VsZWN0ZWQnKS5sZW5ndGg7XG5cblx0XHR1bnNlbGVjdGVkRmlsZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUnKS5ub3QoJy5zZWxlY3RlZCcpO1xuXG5cdC8vTm8gc2VsZWN0ZWQgZmlsZXNcblx0aWYgKG51bWJlck9mU2VsZWN0ZWRGaWxlcyA9PT0gMCkge1xuXHRcdHNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnYWxsIGRpc2FibGVkJykuYWRkQ2xhc3MoJ2VtcHR5Jyk7XG5cdFx0c2VsZWN0QWxsTGFiZWwudGV4dCgnU2VsZWN0IEFsbCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXG5cdFx0ZGVzZWxlY3RBbGxCdXR0b24ucmVtb3ZlQ2xhc3MoJ2lzLWFsbCcpLmFkZENsYXNzKCdpcy1lbXB0eSBkaXNhYmxlZCcpO1xuXHRcdGRlc2VsZWN0QWxsTGFiZWwuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cblx0XHRidWxrRGVsZXRlQnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0YnVsa0VkaXRCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRidWxrRWRpdEJ1dHRvbi5maW5kKCcuYnV0dG9uX193YXJuaW5nJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHRcdG11bHRpRWRpdEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdG1vcmVBY3Rpb25zQnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cblx0XHRlZGl0QnV0dG9ucy5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0ZGVsZXRlQnV0dG9ucy5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0YXJyYW5nZW1lbnRzLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdGFycmFuZ2VtZW50SW5wdXRzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdHNldENvdmVyQnV0dG9ucy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcblxuXHRcdHVuc2VsZWN0ZWRGaWxlcy5yZW1vdmVDbGFzcygnaXMtcHJlc2VsZWN0ZWQnKTtcblxuXHRcdGlmICgkKCcjYXNzZXRzLWNvdW50JykubGVuZ3RoID4gMCkge25vcm1hbGl6ZUFzc2V0c0NvdW50KCk7fVxuXG5cdFx0aWYgKG51bWJlck9mRmlsZXMgPT09IDApIHtcblx0XHRcdHNlbGVjdEFsbEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdHNlbGVjdEFsbExhYmVsLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXG5cdFx0XHRkZXNlbGVjdEFsbEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdGRlc2VsZWN0QWxsTGFiZWwuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0fVxuXHR9XG5cdC8vU29tZSBmaWxlcyBhcmUgc2VsZWN0ZWRcblx0ZWxzZSBpZiAobnVtYmVyT2ZTZWxlY3RlZEZpbGVzID4gMCkge1xuXHRcdHNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnZW1wdHkgYWxsJyk7XG5cdFx0c2VsZWN0QWxsTGFiZWwudGV4dCgnRGVzZWxlY3QgQWxsJyk7XG5cblx0XHRkZXNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnaXMtZW1wdHkgaXMtYWxsIGRpc2FibGVkJyk7XG5cdFx0ZGVzZWxlY3RBbGxMYWJlbC5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblxuXG5cdFx0YnVsa0RlbGV0ZUJ1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRidWxrRWRpdEJ1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRtdWx0aUVkaXRCdXR0b24ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0bW9yZUFjdGlvbnNCdXR0b24ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cblx0XHRlZGl0QnV0dG9ucy5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0ZGVsZXRlQnV0dG9ucy5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0YXJyYW5nZW1lbnRzLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdGFycmFuZ2VtZW50SW5wdXRzLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0c2V0Q292ZXJCdXR0b25zLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSkuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG5cblx0XHR1bnNlbGVjdGVkRmlsZXMuYWRkQ2xhc3MoJ2lzLXByZXNlbGVjdGVkJyk7XG5cblx0XHRpZiAoJCgnI2Fzc2V0cy1jb3VudCcpLmxlbmd0aCA+IDApIHtcblx0XHRcdCQoJyNhc3NldHMtY291bnQnKS50ZXh0KG51bWJlck9mU2VsZWN0ZWRGaWxlcy50b1N0cmluZygpICsgJyBvZiAnICsgZ2FsbGVyeU9iamVjdHMubGVuZ3RoICsgJyBzZWxlY3RlZCcpO1xuXHRcdH1cblxuXHRcdGlmIChudW1iZXJPZlNlbGVjdGVkVmlkZW9zICYmIG51bWJlck9mU2VsZWN0ZWRJbWFnZXMpIHtcblx0XHRcdGJ1bGtFZGl0QnV0dG9uLmZpbmQoJy5idXR0b25fX3dhcm5pbmcnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG5cdFx0XHRtdWx0aUVkaXRCdXR0b24uZmluZCgnLmJ1dHRvbl9fd2FybmluZycpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YnVsa0VkaXRCdXR0b24uZmluZCgnLmJ1dHRvbl9fd2FybmluZycpLmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcblx0XHRcdG11bHRpRWRpdEJ1dHRvbi5maW5kKCcuYnV0dG9uX193YXJuaW5nJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHRcdH1cblxuXHRcdC8vT25seSBvbmUgZmlsZSBzZWxlY3RlZFxuXHRcdGlmIChudW1iZXJPZlNlbGVjdGVkRmlsZXMgPT09IDEpIHtcblx0XHRcdGJ1bGtFZGl0QnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0XHRtdWx0aUVkaXRCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRcdC8vbW9yZUFjdGlvbnNCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblxuXHRcdFx0c2VsZWN0ZWRFZGl0QnV0dG9uLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRcdHNlbGVjdGVkRGVsZXRlQnV0dG9uLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRcdHNlbGVjdGVkQXJyYW5nZW1lbnQucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHRzZWxlY3RlZEFycmFuZ2VtZW50SW5wdXQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0XHRzZWxlY3RlZFNldENvdmVyQnV0dG9ucy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcblx0XHR9XG5cdFx0Ly9BbGwgZmlsZXMgYXJlIHNlbGVjdGVkXG5cdFx0aWYgKG51bWJlck9mU2VsZWN0ZWRGaWxlcyA9PT0gbnVtYmVyT2ZGaWxlcykge1xuXHRcdFx0c2VsZWN0QWxsQnV0dG9uLnJlbW92ZUNsYXNzKCdlbXB0eScpLmFkZENsYXNzKCdhbGwnKTtcblx0XHRcdGRlc2VsZWN0QWxsQnV0dG9uLnJlbW92ZUNsYXNzKCdpcy1lbXB0eScpLmFkZENsYXNzKCdpcy1hbGwnKTtcblx0XHR9XG5cdH1cbn1cbmZ1bmN0aW9uIHNlbGVjdEFsbCgpIHtcblx0JCgnLmpzLWNvbnRlbnQgLmZpbGUnKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcblx0bm9ybWFsaXplU2VsZWN0ZWlvbigpO1xufVxuZnVuY3Rpb24gZGVzZWxlY3RBbGwoKSB7XG5cdCQoJy5qcy1jb250ZW50IC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdG5vcm1hbGl6ZVNlbGVjdGVpb24oKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQXNzZXRzQ291bnQoKSB7XG5cdGlmIChnYWxsZXJ5T2JqZWN0cy5sZW5ndGgpIHtcblx0XHQkKCcjYXNzZXRzLWNvdW50JykudGV4dChnYWxsZXJ5T2JqZWN0cy5sZW5ndGggKyAnIGFzc2V0cycpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcblx0fSBlbHNlIHtcblx0XHQkKCcjYXNzZXRzLWNvdW50JykudGV4dCgnJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHR9XG59XG5cbi8vTm90aWZpY2F0aW9uc1xuZnVuY3Rpb24gc2hvd05vdGlmaWNhdGlvbih0ZXh0LCB0b3ApIHtcbiAgICB2YXIgbm90aWZpY2F0aW9uID0gJCgnLm5vdGlmaWNhdGlvbicpLFxuICAgICAgICBub3RpZmljYXRpb25UZXh0ID0gJCgnLm5vdGlmaWNhdGlvbl9fdGV4dCcpO1xuXG4gICAgaWYgKG5vdGlmaWNhdGlvbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbm90aWZpY2F0aW9uID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbm90aWZpY2F0aW9uJyk7XG4gICAgICAgIG5vdGlmaWNhdGlvblRleHQgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdub3RpZmljYXRpb25fX3RleHQnKTtcbiAgICAgICAgbm90aWZpY2F0aW9uLmFwcGVuZChub3RpZmljYXRpb25UZXh0KTtcbiAgICB9XG5cbiAgICBpZiAoJCgnLm1vZGFsJykubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoISQoJy5tb2RhbCAucHJldmlldycpLmhhc0NsYXNzKCdoaWRkZW4nKSkge1xuICAgICAgICAgICAgJCgnLm1vZGFsIC5wcmV2aWV3JykuYXBwZW5kKG5vdGlmaWNhdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcubW9kYWwnKS5hcHBlbmQobm90aWZpY2F0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgfSBlbHNlIGlmKCQoJy5jdCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJCgnLmN0JykuYXBwZW5kKG5vdGlmaWNhdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnYm9keScpLmFwcGVuZChub3RpZmljYXRpb24pO1xuICAgIH1cblxuICAgIGlmICh0b3ApIHtub3RpZmljYXRpb24uY3NzKCd0b3AnLCB0b3ApO31cbiAgICBub3RpZmljYXRpb25UZXh0LnRleHQodGV4dCk7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIG5vdGlmaWNhdGlvbi5yZW1vdmUoKTtcbiAgICB9LCA0MDAwKTtcbn1cblxuLy9GaWxlIGZ1bmN0aW9uc1xudmFyIGdhbGxlcnlDYXB0aW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBoYW5kbGVDYXB0aW9uRWRpdChlKSB7XG4gICAgdmFyIGZpbGVFbGVtZW50ID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKSxcbiAgICAgICAgZmlsZUlkID0gZmlsZUVsZW1lbnQuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpLFxuICAgICAgICB0b2dnbGUgPSBmaWxlRWxlbWVudC5maW5kKCcuZmlsZV9fY2FwdGlvbi10b2dnbGUgLnRvZ2dsZScpLFxuICAgICAgICBmaWxlID0gZ2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgIHJldHVybiBmLmZpbGVEYXRhLmlkID09PSBmaWxlSWQ7XG4gICAgICAgIH0pWzBdLFxuXG4gICAgICAgIHRvZ2dsZUNoZWNrZWQgPSAkKGUudGFyZ2V0KS52YWwoKSA9PT0gZmlsZS5maWxlRGF0YS5jYXB0aW9uICYmIGZpbGUuZmlsZURhdGEuY2FwdGlvbjsgLy9JZiB0ZXh0ZmllbGQgZXF1YWxzIHRoZSBmaWxlIGNhcHRpb24gYW5kIGZpbGUgY2FwdGlvbiBub3QgZW1wdHlcblxuICAgIC8vU2F2ZSBjYXB0aW9uIHRvIGdhbGxlcnlDYXB0aW9uc1xuICAgIGZpbGUuY2FwdGlvbiA9ICQoZS50YXJnZXQpLnZhbCgpO1xuXG4gICAgdG9nZ2xlLnByb3AoJ2NoZWNrZWQnLCB0b2dnbGVDaGVja2VkKTtcbiAgICBjbG9zZVRvb2x0aXAoKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZUNhcHRpb25Ub2dnbGVDbGljayhlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB2YXIgZmlsZSA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJyksXG4gICAgICAgIGZpbGVJZCA9IGZpbGUuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpLFxuICAgICAgICB0ZXh0YXJlYSA9IGZpbGUuZmluZCgnLmZpbGVfX2NhcHRpb24tdGV4dGFyZWEnKSxcbiAgICAgICAgb3JpZ2luYWxGaWxlID0gZmlsZUJ5SWQoZmlsZUlkLCBnYWxsZXJ5T2JqZWN0cyk7XG5cbiAgICBpZiAoJChlLnRhcmdldCkucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgIHRleHRhcmVhLnZhbChvcmlnaW5hbEZpbGUuZmlsZURhdGEuY2FwdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dGFyZWEuZm9jdXMoKTtcbiAgICB9XG59XG5mdW5jdGlvbiBoYW5kbGVDYXB0aW9uU3RhcnRFZGl0aW5nKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHZhciB0b29sdGlwVGV4dCA9ICdUaGlzIGNhcHRpb24gd2lsbCBvbmx5IGFwcGx5IHRvIHlvdXIgZ2FsbGVyeSBhbmQgbm90IHRvIHRoZSBpbWFnZSBhc3NldC4nO1xuICAgIGlmICghd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b29sdGlwJykpIHtcbiAgICAgICAgY3JlYXRlVG9vbHRpcCgkKGUudGFyZ2V0KSwgdG9vbHRpcFRleHQpO1xuICAgIH1cbn1cbi8vIENoYW5nZSBlbGVtZW50IGluZGV4ZXMgdG8gYW4gYWN0dWFsIG9uZXNcbmZ1bmN0aW9uIG5vcm1hbGl6ZUluZGV4KCkge1xuICAgIHZhciBmaWxlcyA9ICQoJy5qcy1maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKTtcblxuICAgIGZpbGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICQoZWwpLmZpbmQoJy5maWxlX19hcmFnZW1lbnQtaW5wdXQnKS50ZXh0KGluZGV4ICsgMSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUluZGV4RmllbGRDaGFuZ2UoZSkge1xuICAgIHZhciBsZW5ndGggPSAkKCcuanMtZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlJykubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IHBhcnNlSW50KCQoZS50YXJnZXQpLnZhbCgpKSAtIDEsXG4gICAgICAgIGZpbGUgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpO1xuXG4gICAgaWYgKGluZGV4ICsgMSA+PSBsZW5ndGgpIHtcbiAgICAgICAgcHV0Qm90dG9tKGZpbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGUuZGV0YWNoKCkuaW5zZXJ0QmVmb3JlKCQoJy5qcy1maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKS5zbGljZShpbmRleCwgaW5kZXgrMSkpO1xuXG4gICAgfVxuICAgIG5vcm1hbGl6ZUluZGV4KCk7XG4gICAgLy91cGRhdGVHYWxsZXJ5KGluZGV4KTtcbn1cblxuZnVuY3Rpb24gcHV0Qm90dG9tKGZpbGUpIHtcbiAgICBmaWxlLmRldGFjaCgpLmluc2VydEFmdGVyKCQoJy5qcy1maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKS5sYXN0KCkpO1xuICAgIG5vcm1hbGl6ZUluZGV4KCk7XG4gICAgLy91cGRhdGVHYWxsZXJ5KGdhbGxlcnlPYmplY3RzLmxlbmd0aCk7XG59XG5mdW5jdGlvbiBwdXRUb3AoZmlsZSkge1xuICAgIGZpbGUuZGV0YWNoKCkuaW5zZXJ0QmVmb3JlKCQoJy5qcy1maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKS5maXJzdCgpKTtcbiAgICBub3JtYWxpemVJbmRleCgpO1xuICAgIC8vdXBkYXRlR2FsbGVyeSgwKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlU2VuZFRvVG9wQ2xpY2soZSkge1xuICAgIHZhciBmaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpO1xuICAgIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHB1dFRvcChmaWxlcyk7XG4gICAgfVxuICAgIHB1dFRvcCgkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpKTtcbiAgICBjbG9zZU1lbnUoJChlLnRhcmdldCkucGFyZW50cygnc2VsZWN0X19tZW51JykpO1xufVxuZnVuY3Rpb24gaGFuZGxlU2VuZFRvQm90dG9tQ2xpY2soZSkge1xuICAgIHZhciBmaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpO1xuICAgIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHB1dEJvdHRvbShmaWxlcyk7XG4gICAgfVxuICAgIHB1dEJvdHRvbSgkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpKTtcbiAgICBjbG9zZU1lbnUoJChlLnRhcmdldCkucGFyZW50cygnc2VsZWN0X19tZW51JykpO1xufVxuZnVuY3Rpb24gbG9hZEZpbGUoZmlsZSkge1xuXHR2YXIgZmlsZURhdGEgPSBmaWxlLmZpbGVEYXRhO1xuXG5cdHN3aXRjaCAoZmlsZURhdGEudHlwZSkge1xuXHRcdGNhc2UgJ2ltYWdlJzpcblxuXHRcdC8vSGlkZSB2aWRlbyByZWxhdGVkIGVsZW1lbnRzXG5cdFx0JCgnI3ZpZGVvUGxheScpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHQkKCcjdmlkZW9NZXRhZGF0YScpLmFkZENsYXNzKCdoaWRkZW4nKTtcblxuXHRcdC8vU2hvdyBhbGwgaW1hZ2UgcmVsYXRlZCBlbGVtZW50c1xuXHRcdCQoJyNwcmV2aWV3Q29udHJvbHMnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0JCgnI2ltYWdlTWV0YWRhdGEnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0JCgnI2ZvY2FsUG9pbnQnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cblx0XHRpZiAoIWZpbGUuYnVsa0VkaXQpIHtcblx0XHRcdCQoJyNwcmV2aWV3SW1nJykuYXR0cignc3JjJywgZmlsZURhdGEudXJsKTtcblx0XHRcdCQoJy5wciAucHVycG9zZS1pbWcnKS5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsICd1cmwoJyArIGZpbGVEYXRhLnVybCArICcpJyk7XG5cdFx0XHRhZGp1c3RGb2NhbFBvaW50KGZpbGVEYXRhLmZvY2FsUG9pbnQpO1xuXHRcdH1cblxuXHRcdC8vc2V0IFRpdGxlXG5cdFx0YWRqdXN0VGl0bGUoZmlsZURhdGEudGl0bGUpO1xuXHRcdGFkanVzdENhcHRpb24oZmlsZURhdGEuY2FwdGlvbik7XG5cdFx0YWRqdXN0RGVzY3JpcHRpb24oZmlsZURhdGEuZGVzY3JpcHRpb24pO1xuXHRcdGFkanVzdFJlc29sdXRpb24oZmlsZURhdGEuaGlnaFJlc29sdXRpb24pO1xuXHRcdGFkanVzdEFsdFRleHQoZmlsZURhdGEuYWx0VGV4dCk7XG5cblx0XHRicmVhaztcblxuXHRcdGNhc2UgJ3ZpZGVvJzpcblxuXHRcdC8vSGlkZSBhbGwgaW1hZ2UgcmVsYXRlZCBlbGVtZW50c1xuXHRcdCQoJyNwcmV2aWV3Q29udHJvbHMnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0JCgnI2ltYWdlTWV0YWRhdGEnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0JCgnI2ZvY2FsUG9pbnQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cblx0XHQvL1Nob3cgdmlkZW8gcmVsYXRlZCBlbGVtZW50c1xuXHRcdCQoJyN2aWRlb1BsYXknKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0JCgnI3ZpZGVvTWV0YWRhdGEnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cblx0XHRpZiAoZmlsZS5idWxrRWRpdCkge1xuXHRcdFx0JCgnI2ZpZWxFZGl0LXZpZGVvTWV0YWRhdGEnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoJyNmaWVsRWRpdC12aWRlb01ldGFkYXRhJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0XHQkKCcjcHJldmlld0ltZycpLmF0dHIoJ3NyYycsIGZpbGVEYXRhLnVybCk7XG5cdFx0XHQkKCcjdmlkZW9UaXRsZScpLnRleHQoZmlsZURhdGEudGl0bGUpO1xuXHRcdFx0JCgnI3ZpZGVvRGVzY3JpcHRpb24nKS50ZXh0KGZpbGVEYXRhLmRlc2NyaXB0aW9uKTtcblx0XHRcdCQoJyN2aWRlb0F1dGhvcicpLnRleHQoZmlsZURhdGEuYXV0aG9yKTtcblx0XHRcdCQoJyN2aWRlb0d1aWQnKS50ZXh0KGZpbGVEYXRhLmd1aWQpO1xuXHRcdFx0JCgnI3ZpZGVvS2V5d29yZHMnKS50ZXh0KGZpbGVEYXRhLmtleXdvcmRzKTtcblx0XHR9XG5cblx0XHRicmVhaztcblx0fVxufVxuXG4vL0Z1bmN0aW9uIHRvIHNldCBUaXRsZSB0byB0aGUgdGl0bGUgZmllbGQgb3IsIHNhdmUgdGl0bGUgaWYgdGl0bGUgYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIGFkanVzdFRpdGxlKHRpdGxlKSB7XG5cdCQoJyN0aXRsZScpLnZhbCh0aXRsZSkuY2hhbmdlKCk7XG5cdHZhciBldmVudCA9IG5ldyBVSUV2ZW50KCdjaGFuZ2UnKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlJykuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBUaXRsZSB0byB0aGUgdGl0bGUgZmllbGQgb3IsIHNhdmUgdGl0bGUgaWYgdGl0bGUgYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIHNhdmVUaXRsZShlKSB7XG5cdHZhciBjdXJyZW50SW1hZ2UgPSAkKCcuaW1hZ2UuaW1hZ2Vfc3R5bGVfbXVsdGkgLmZpbGVfX2lkW2RhdGEtaWQ9XCInICsgZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuaWQgKyAnXCJdJykucGFyZW50cygnLmltYWdlJyk7XG5cblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEudGl0bGUgPSAkKCcjdGl0bGUnKS52YWwoKTtcblxuXHRpZiAoJCgnI3RpdGxlJykudmFsKCkgPT09ICcnKSB7XG5cdFx0Y3VycmVudEltYWdlLmFkZENsYXNzKCdoYXMtZW1wdHlSZXF1aXJlZEZpZWxkJyk7XG5cdH0gZWxzZSB7XG5cdFx0Y3VycmVudEltYWdlLnJlbW92ZUNsYXNzKCdoYXMtZW1wdHlSZXF1aXJlZEZpZWxkJyk7XG5cdH1cblxuXHRkYXRhQ2hhbmdlZCA9IHRydWU7XG5cdGlmIChlZGl0ZWRGaWxlRGF0YS5idWxrRWRpdCkge1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdGYuZmlsZURhdGEudGl0bGUgPSAkKCcjdGl0bGUnKS52YWwoKTtcblx0XHR9KTtcblx0fVxufVxuLy9GdW5jdGlvbiB0byBzZXQgQ2FwdGlvbiB0byB0aGUgY2FwdGlvbiBmaWVsZCBvciwgc2F2ZSBjYXB0aW9uIGlmIGNhcHRpb24gYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIGFkanVzdENhcHRpb24oY2FwdGlvbikge1xuXHQkKCcjY2FwdGlvbicpLnZhbChjYXB0aW9uKS5jaGFuZ2UoKTtcblx0dmFyIGV2ZW50ID0gbmV3IFVJRXZlbnQoJ2NoYW5nZScpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FwdGlvbicpLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgRGVzY3JpcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlQ2FwdGlvbigpIHtcblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuY2FwdGlvbiA9ICQoJyNjYXB0aW9uJykudmFsKCk7XG5cdGRhdGFDaGFuZ2VkID0gdHJ1ZTtcblx0aWYgKGVkaXRlZEZpbGVEYXRhLmJ1bGtFZGl0KSB7XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdFx0Zi5maWxlRGF0YS5jYXB0aW9uID0gJCgnI2NhcHRpb24nKS52YWwoKTtcblx0XHR9KTtcblx0fVxufVxuZnVuY3Rpb24gYWRqdXN0RGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcblx0JCgnI2Rlc2NyaXB0aW9uJykudmFsKGRlc2NyaXB0aW9uKS5jaGFuZ2UoKTtcblx0dmFyIGV2ZW50ID0gbmV3IFVJRXZlbnQoJ2NoYW5nZScpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzY3JpcHRpb24nKS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cbi8vRnVuY3Rpb24gdG8gc2V0IERlc2NyaXB0aW9uIHRvIHRoZSBjYXB0aW9uIGZpZWxkIG9yLCBzYXZlIGNhcHRpb24gaWYgY2FwdGlvbiBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gc2F2ZURlc2NyaXB0aW9uKCkge1xuXHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5kZXNjcmlwdGlvbiA9ICQoJyNkZXNjcmlwdGlvbicpLnZhbCgpO1xuXHRkYXRhQ2hhbmdlZCA9IHRydWU7XG5cdGlmIChlZGl0ZWRGaWxlRGF0YS5idWxrRWRpdCkge1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdGYuZmlsZURhdGEuZGVzY3JpcHRpb24gPSAkKCcjZGVzY3JpcHRpb24nKS52YWwoKTtcblx0XHR9KTtcblx0fVxufVxuZnVuY3Rpb24gYWRqdXN0UmVzb2x1dGlvbihyZXNvbHV0aW9uKSB7XG5cdCQoJyNyZXNvbHV0aW9uJykucHJvcCgnY2hlY2tlZCcsIHJlc29sdXRpb24pO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgRGVzY3JpcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlUmVzb2x1dGlvbigpIHtcblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuaGlnaFJlc29sdXRpb24gPSAkKCcjcmVzb2x1dGlvbicpLnByb3AoJ2NoZWNrZWQnKTtcblx0ZGF0YUNoYW5nZWQgPSB0cnVlO1xuXHRpZiAoZWRpdGVkRmlsZURhdGEuYnVsa0VkaXQpIHtcblx0XHRlZGl0ZWRGaWxlc0RhdGEuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0XHRmLmZpbGVEYXRhLmhpZ2hSZXNvbHV0aW9uID0gJCgnI3Jlc29sdXRpb24nKS5wcm9wKCdjaGVja2VkJyk7XG5cdFx0fSk7XG5cdH1cbn1cbmZ1bmN0aW9uIGFkanVzdEFsdFRleHQoYWx0VGV4dCkge1xuXHQkKCcjYWx0VGV4dCcpLnZhbChhbHRUZXh0KS5jaGFuZ2UoKTtcblx0dmFyIGV2ZW50ID0gbmV3IFVJRXZlbnQoJ2NoYW5nZScpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWx0VGV4dCcpLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgRGVzY3JpcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlQWx0VGV4dCgpIHtcblx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuYWx0VGV4dCA9ICQoJyNhbHRUZXh0JykudmFsKCk7XG5cdGRhdGFDaGFuZ2VkID0gdHJ1ZTtcblx0aWYgKGVkaXRlZEZpbGVEYXRhLmJ1bGtFZGl0KSB7XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdFx0Zi5maWxlRGF0YS5hbHRUZXh0ID0gJCgnI2FsdFRleHQnKS52YWwoKTtcblx0XHR9KTtcblx0fVxufVxuXG4vL0Z1bmN0aW9uIHRvIHNldCBGb2NhbFBvaW50IGNvb3JkaW5hdGVzIG9yLCBzYXZlIGZvY2FsIHBpbnQgaWYgZm9jYWxwb2ludCBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gYWRqdXN0Rm9jYWxQb2ludChmb2NhbFBvaW50KSB7XG5cdHZhciBmcCA9ICQoJyNmb2NhbFBvaW50Jyk7XG5cdHZhciBpbWcgPSAkKCcjcHJldmlld0ltZycpO1xuXHRpZiAoZm9jYWxQb2ludCkge1xuXHRcdHZhciBsZWZ0ID0gZm9jYWxQb2ludC5sZWZ0ICogaW1nLndpZHRoKCkgLSBmcC53aWR0aCgpLzIsXG5cdFx0dG9wID0gZm9jYWxQb2ludC50b3AgKiBpbWcuaGVpZ2h0KCkgLSBmcC5oZWlnaHQoKS8yO1xuXG5cdFx0bGVmdCA9IGxlZnQgPT09IDAgPyAnNTAlJyA6IGxlZnQ7XG5cdFx0dG9wID0gdG9wID09PSAwID8gJzUwJScgOiB0b3A7XG5cdFx0ZnAuY3NzKCdsZWZ0JywgbGVmdCkuY3NzKCd0b3AnLCB0b3ApO1xuXG5cdH0gZWxzZSB7XG5cdFx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuZm9jYWxQb2ludCA9IHtcblx0XHRcdGxlZnQ6ICgoZnAucG9zaXRpb24oKS5sZWZ0ICsgZnAud2lkdGgoKS8yKS9pbWcud2lkdGgoKSksXG5cdFx0XHR0b3A6ICgoZnAucG9zaXRpb24oKS50b3AgKyBmcC5oZWlnaHQoKS8yKS9pbWcuaGVpZ2h0KCkpXG5cdFx0fTtcblx0fVxuXHRmcC5jc3MoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG5cbn1cblxuLy9GdW5jdGlvbiB0byBzZXQgRm9jYWxSZWN0IGNvb3JkaW5hdGVzIG9yLCBzYXZlIGZvY2FsIHBpbnQgaWYgZm9jYWxwb2ludCBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gYWRqdXN0Rm9jYWxSZWN0KGZvY2FsUG9pbnQpIHtcblx0dmFyIGZyID0gJCgnI2ZvY2FsUmVjdCcpO1xuXHR2YXIgaW1nID0gJCgncHJldmlld0ltZycpO1xuXHRpZiAoZm9jYWxQb2ludCkge1xuXHRcdHZhciBsZWZ0ID0gZm9jYWxQb2ludC5sZWZ0ICogaW1nLndpZHRoKCkgLSBmci53aWR0aCgpLzIsXG5cdFx0dG9wID0gZm9jYWxQb2ludC50b3AgKiBpbWcuaGVpZ2h0KCkgLSBmci5oZWlnaHQoKS8yO1xuXG5cdFx0bGVmdCA9IGxlZnQgPCAwID8gMCA6IGxlZnQgPiBpbWcud2lkdGgoKSA/IGltZy53aWR0aCgpIC0gZnIud2lkdGgoKS8yIDogbGVmdDtcblx0XHR0b3AgPSB0b3AgPCAwID8gMCA6IHRvcCA+IGltZy5oZWlnaHQoKSA/IGltZy5oZWlnaHQoKSAtIGZyLmhlaWdodCgpLzIgOiB0b3A7XG5cblx0XHRmci5jc3MoJ2xlZnQnLCBsZWZ0KVxuXHRcdC5jc3MoJ3RvcCcsIHRvcCk7XG5cdH0gZWxzZSB7XG5cdFx0ZWRpdGVkRmlsZURhdGEuZmlsZURhdGEuZm9jYWxQb2ludCA9IHtcblx0XHRcdGxlZnQ6ICgoZnAucG9zaXRpb24oKS5sZWZ0ICsgZnAud2lkdGgoKS8yKS9pbWcud2lkdGgoKSksXG5cdFx0XHR0b3A6ICgoZnAucG9zaXRpb24oKS50b3AgKyBmcC5oZWlnaHQoKS8yKS9pbWcuaGVpZ2h0KCkpXG5cdFx0fTtcblx0fVxufVxuXG5cbmZ1bmN0aW9uIHNob3dGaWxlcyhmaWxlcykge1xuXHRkYXRhQ2hhbmdlZCA9IGZhbHNlO1xuXHRzY3JvbGxQb3NpdGlvbiA9ICQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcblx0Ly9TaG93IGluaXRpYWwgZWRpdCBzY3JlZW4gZm9yIHNpbmdsZSBpbWFnZS5cblx0JCgnLnByJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbiB2aWRlbyBidWxrJylcblx0LmFkZENsYXNzKCdtb2RhbCcpO1xuXHQkKCcjd3JhcHBlcicpLmFkZENsYXNzKCdvdmVyZmxvdycpO1xuXG5cdC8vUmVtb3ZlIGFsbCBtdWx0aXBsZSBpbWFnZXMgc3R5bGUgYXR0cmlidXRlc1xuXHQkKCcucHIgLnByZXZpZXcnKS5yZW1vdmVDbGFzcygncHJldmlld19zdHlsZV9tdWx0aSBoaWRkZW4nKTtcblx0JCgnLnByIC5pcCcpLnJlbW92ZUNsYXNzKCdpcF9zdHlsZV9tdWx0aScpO1xuXHQkKCcjc2F2ZUNoYW5nZXMnKS50ZXh0KCdTYXZlJyk7XG5cdC8vJCgnI2lwX190aXRsZScpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0JCgnLnByIC5pbWFnZXMnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdCQoJyN0aXRsZScpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0JCgnI3RpdGxlJykucGFyZW50KCkuY2hpbGRyZW4oJ2xhYmVsJykuYWRkQ2xhc3MoJ3JlcXVpZXJlZCcpO1xuXHQkKCcjdGl0bGUnKS5wcm9wKCdyZXF1aXJlZCcsIHRydWUpO1xuXG5cdGZ1bmN0aW9uIHJlc2l6ZUltYWdlV3JhcHBlcigpIHtcblx0XHR2YXIgaW1hZ2VzV3JhcHBlcldpZHRoID0gJCgnLmltYWdlc19fd3JhcHBlcicpLndpZHRoKCk7XG5cdFx0aW1hZ2VzV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCA8IDYwMCA/ICQoJy5pbWFnZXNfX2NvbnRhaW5lciAuaW1hZ2UnKS5sZW5ndGggKiAxMDAgOiAkKCcuaW1hZ2VzX19jb250YWluZXIgLmltYWdlJykubGVuZ3RoICogMTIwO1xuXHRcdGlmIChpbWFnZXNXcmFwcGVyV2lkdGggPiBpbWFnZXNXaWR0aCkge1xuXHRcdFx0JCgnLmltYWdlc19fc2Nyb2xsLWxlZnQsIC5pbWFnZXNfX3Njcm9sbC1yaWdodCcpLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCgnLmltYWdlc19fY29udGFpbmVyJykuY3NzKCd3aWR0aCcsIGltYWdlc1dpZHRoLnRvU3RyaW5nKCkgKyAncHgnKTtcblx0XHRcdCQoJy5pbWFnZXNfX3Njcm9sbC1sZWZ0LCAuaW1hZ2VzX19zY3JvbGwtcmlnaHQnKS5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuXHRcdH1cblx0fVxuXG5cdGlmIChmaWxlcy5sZW5ndGggPiAxKSB7XG5cdFx0dmFyIGltZ0NvbnRhaW5lciA9ICQoJy5wciAuaW1hZ2VzX19jb250YWluZXInKTtcblx0XHRpbWdDb250YWluZXIuZW1wdHkoKTtcblxuXHRcdC8vQWRkIGltYWdlcyBwcmV2aWVzIHRvIHRoZSBjb250YWluZXJcblx0XHRmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdHZhclx0aW1hZ2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZSBpbWFnZV9zdHlsZV9tdWx0aScpLmNsaWNrKGhhbmRsZUltYWdlU3dpdGNoKSxcblx0XHRcdHJlcXVpcmVkTWFyayA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlX19yZXF1aXJlZC1tYXJrJyksXG5cdFx0XHRmaWxlSW5kZXggPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdoaWRkZW4gZmlsZV9faWQnKS50ZXh0KGYuZmlsZURhdGEuaWQpLmF0dHIoJ2RhdGEtaWQnLCBmLmZpbGVEYXRhLmlkKTtcblx0XHRcdGltYWdlLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIGYuZmlsZURhdGEudXJsICsgJyknKS5hcHBlbmQocmVxdWlyZWRNYXJrLCBmaWxlSW5kZXgpO1xuXHRcdFx0aW1nQ29udGFpbmVyLmFwcGVuZChpbWFnZSk7XG5cdFx0fSk7XG5cblx0XHQvL0FkZCBhY3RpdmUgc3RhdGUgdG8gdGhlIHByZXZpZXcgb2YgdGhlIGZpcnN0IGltYWdlXG5cdFx0dmFyIGZpcnN0SW1hZ2UgPSAkKCcuaW1hZ2VzX19jb250YWluZXIgLmltYWdlJykuZmlyc3QoKTtcblx0XHRmaXJzdEltYWdlLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblxuXHRcdCQoJy5wciAuaW1hZ2VzJykuYWRkQ2xhc3MoJ2ltYWdlc19zdHlsZV9tdWx0aScpLnJlbW92ZUNsYXNzKCdoaWRkZW4gaW1hZ2VzX3N0eWxlX2J1bGsnKTtcblxuXHRcdCQoJy5wciAucHJldmlldycpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKS5hZGRDbGFzcygncHJldmlld19zdHlsZV9tdWx0aScpO1xuXHRcdCQoJy5wciAuaXAnKS5hZGRDbGFzcygnaXBfc3R5bGVfbXVsdGknKTtcblxuXHRcdC8vQWRqdXN0IGltYWdlIHByZXZpZXdzIGNvbnRhaW5lclxuXHRcdCQoJyNpbWFnZXNfX3dyYXBwZXInKS5zY3JvbGxMZWZ0KDApO1xuXHRcdCQod2luZG93KS5yZXNpemUocmVzaXplSW1hZ2VXcmFwcGVyKTtcblx0XHRyZXNpemVJbWFnZVdyYXBwZXIoKTtcblxuXHRcdC8vQWRkIGFjdGlvbnMgdG8gc2Nyb2xsIGJ1dHRvbnNcblx0XHQkKCcuaW1hZ2VzX19zY3JvbGwtbGVmdCcpLnVuYmluZCgnY2xpY2snKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0JCgnI2ltYWdlc19fd3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogJy09NDgwJyB9LCA2MDApO1xuXHRcdH0pO1xuXHRcdCQoJy5pbWFnZXNfX3Njcm9sbC1yaWdodCcpLnVuYmluZCgnY2xpY2snKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0JCgnI2ltYWdlc19fd3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogJys9NDgwJyB9LCA2MDApO1xuXHRcdH0pO1xuXHR9XG5cdGhpZGVMb2FkZXIoKTtcblx0c2V0TW9kYWxLZXlib2FyZEFjdGlvbnMoc2F2ZUltYWdlRWRpdCwgY2FuY2VsSW1hZ2VFZGl0KTtcblxufVxuZnVuY3Rpb24gZWRpdEZpbGVzKGZpbGVzKSB7XG5cdGVkaXRlZEZpbGVzRGF0YSA9IFtdLmNvbmNhdChmaWxlcyk7XG5cblx0aWYgKGVkaXRlZEZpbGVzRGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0ZWRpdGVkRmlsZURhdGEgPSBlZGl0ZWRGaWxlc0RhdGFbMF07XG5cdFx0bG9hZEZpbGUoZWRpdGVkRmlsZURhdGEpO1xuXHRcdHNob3dGaWxlcyhlZGl0ZWRGaWxlc0RhdGEpO1xuXHR9XG59XG5cblxuLy9CdWxrIEVkaXRcbmZ1bmN0aW9uIGJ1bGtFZGl0RmlsZXMoZmlsZXMsIHR5cGUpIHtcblx0dmFyIGNsb25lZEdhbGxlcnlPYmplY3RzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShnYWxsZXJ5T2JqZWN0cykpO1xuXHR2YXIgZmlsZXNUeXBlO1xuXHRlZGl0ZWRGaWxlc0RhdGEgPSBbXTsgLy9DbGVhciBmaWxlcyBkYXRhIHRoYXQgcG9zc2libHkgY291bGQgYmUgaGVyZVxuXG5cdC8vT2J0YWluIGZpbGVzIGRhdGEgZm9yIGZpbGVzIHRoYXQgc2hvdWxkIGJlIGVkaXRlZFxuXHRmaWxlcy5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG5cdFx0dmFyIGZpbGUgPSBjbG9uZWRHYWxsZXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuXHRcdFx0cmV0dXJuIGYuZmlsZURhdGEuaWQgPT09ICQoZWwpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcblx0XHR9KVswXTtcblx0XHRlZGl0ZWRGaWxlc0RhdGEucHVzaChmaWxlKTtcblx0fSk7XG5cblx0aWYgKGVkaXRlZEZpbGVzRGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0c3dpdGNoIChlZGl0ZWRGaWxlc0RhdGFbMF0uZmlsZURhdGEudHlwZSkge1xuXHRcdFx0Y2FzZSAnaW1hZ2UnOlxuXHRcdFx0ZWRpdGVkRmlsZURhdGEgPSB7XG5cdFx0XHRcdGZpbGVEYXRhOiB7XG5cdFx0XHRcdFx0dXJsOiAnJyxcblx0XHRcdFx0XHRmb2NhbFBvaW50OiB7XG5cdFx0XHRcdFx0XHRsZWZ0OiAwLjUsXG5cdFx0XHRcdFx0XHR0b3A6IDAuNVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aWQ6ICcnLFxuXHRcdFx0XHRcdGNvbG9yOiAnJywvL2ZpbGVJbWdDb2xvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmZpbGVJbWdDb2xvcnMubGVuZ3RoKV0sXG5cdFx0XHRcdFx0dGl0bGU6ICcnLFxuXHRcdFx0XHRcdGNhcHRpb246ICcnLFxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiAnJyxcblx0XHRcdFx0XHRoaWdoUmVzb2x1dGlvbjogZmFsc2UsXG5cdFx0XHRcdFx0Y2F0ZWdvcmllczogJycsXG5cdFx0XHRcdFx0dGFnczogJycsXG5cdFx0XHRcdFx0YWx0VGV4dDogJycsXG5cdFx0XHRcdFx0Y3JlZGl0OiAnJyxcblx0XHRcdFx0XHRjb3B5cmlnaHQ6ICcnLFxuXHRcdFx0XHRcdHJlZmVyZW5jZToge1xuXHRcdFx0XHRcdFx0c2VyaWVzOiAnJyxcblx0XHRcdFx0XHRcdHNlYXNvbjogJycsXG5cdFx0XHRcdFx0XHRlcGlzb2RlOiAnJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dHlwZTogJ2ltYWdlJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRidWxrRWRpdDogdHJ1ZVxuXHRcdFx0fTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlICd2aWRlbyc6XG5cdFx0XHRlZGl0ZWRGaWxlRGF0YSA9IHtcblx0XHRcdFx0ZmlsZURhdGE6IHtcblx0XHRcdFx0XHR1cmw6ICcnLFxuXHRcdFx0XHRcdHBsYXllcjogJycsXG5cdFx0XHRcdFx0dHlwZTogJ3ZpZGVvJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRidWxrRWRpdDogdHJ1ZVxuXHRcdFx0fTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdFx0bG9hZEZpbGUoZWRpdGVkRmlsZURhdGEpO1xuXHRcdHNob3dCdWxrRmlsZXMoZWRpdGVkRmlsZXNEYXRhKTtcblxuXHR9XG59XG5mdW5jdGlvbiBzaG93QnVsa0ZpbGVzKGZpbGVzKSB7XG5cdGRhdGFDaGFuZ2VkID0gZmFsc2U7XG5cdHNjcm9sbFBvc2l0aW9uID0gJCgnYm9keScpLnNjcm9sbFRvcCgpO1xuXHQvL1Nob3cgaW5pdGlhbCBlZGl0IHNjcmVlbiBmb3Igc2luZ2xlIGltYWdlLlxuXHQkKCcucHInKS5yZW1vdmVDbGFzcygnaGlkZGVuIHZpZGVvJylcblx0LmFkZENsYXNzKCdtb2RhbCBidWxrJyk7XG5cdCQoJyN3cmFwcGVyJykuYWRkQ2xhc3MoJ292ZXJmbG93Jyk7XG5cblx0Ly9SZW1vdmUgYWxsIG11bHRpcGxlIGltYWdlcyBzdHlsZSBhdHRyaWJ1dGVzXG5cdCQoJy5wciAucHJldmlldycpLnJlbW92ZUNsYXNzKCdwcmV2aWV3X3N0eWxlX211bHRpIGhpZGRlbicpO1xuXHQkKCcucHIgLmlwJykucmVtb3ZlQ2xhc3MoJ2lwX3N0eWxlX211bHRpJyk7XG5cdCQoJyNzYXZlQ2hhbmdlcycpLnRleHQoJ1NhdmUnKTtcblx0JCgnI3RpdGxlJykucGFyZW50KCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHQkKCcjdGl0bGUnKS5yZW1vdmVQcm9wKCdyZXF1aXJlZCcpO1xuXHQkKCcjdGl0bGUnKS5wYXJlbnQoKS5jaGlsZHJlbignbGFiZWwnKS5yZW1vdmVDbGFzcygncmVxdWllcmVkJyk7XG5cblx0dmFyIGltZ0NvbnRhaW5lciA9ICQoJy5wciAuaW1hZ2VzX19jb250YWluZXInKTtcblx0aW1nQ29udGFpbmVyLmVtcHR5KCk7XG5cblx0Ly9BZGQgaW1hZ2VzIHByZXZpZXMgdG8gdGhlIGNvbnRhaW5lclxuXHRmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHR2YXJcdGltYWdlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UgaW1hZ2Vfc3R5bGVfYnVsaycpLFxuXHRcdGZpbGVJbmRleCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2hpZGRlbiBmaWxlX19pZCcpLnRleHQoZi5maWxlRGF0YS5pZCk7XG5cdFx0aW1hZ2UuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgZi5maWxlRGF0YS51cmwgKyAnKScpLmFwcGVuZChmaWxlSW5kZXgpO1xuXHRcdGltZ0NvbnRhaW5lci5hcHBlbmQoaW1hZ2UpO1xuXHR9KTtcblxuXHQkKCcucHIgLmltYWdlcycpLmFkZENsYXNzKCdpbWFnZXNfc3R5bGVfYnVsaycpLnJlbW92ZUNsYXNzKCdoaWRkZW4gaW1hZ2VzX3N0eWxlX211bHRpJyk7XG5cdCQoJy5wciAucHJldmlldycpLmFkZENsYXNzKCdoaWRkZW4nKTtcblxuXHRoaWRlTG9hZGVyKCk7XG5cdHNldE1vZGFsS2V5Ym9hcmRBY3Rpb25zKHNhdmVJbWFnZUVkaXQsIGNhbmNlbEltYWdlRWRpdCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUJ1bGtFZGl0QnV0dG9uQ2xpY2soZSkge1xuXHQkKGUudGFyZ2V0KS5ibHVyKCk7XG5cdHZhciBmaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpLFxuXHRudW1iZXJPZlNlbGVjdGVkSW1hZ2VzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLWltZ0ZpbGVUeXBlLnNlbGVjdGVkJykubGVuZ3RoLFxuXHRudW1iZXJPZlNlbGVjdGVkVmlkZW9zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLXZpZGVvRmlsZVR5cGUuc2VsZWN0ZWQnKS5sZW5ndGg7XG5cblx0aWYgKG51bWJlck9mU2VsZWN0ZWRJbWFnZXMgJiYgbnVtYmVyT2ZTZWxlY3RlZFZpZGVvcykge1xuXHRcdG5ldyBNb2RhbCh7XG5cdFx0XHR0aXRsZTogJ1lvdSBjYW5cXCd0IGJ1bGsgZWRpdCBpbWFnZXMgYW5kIHZpZGVvcycsXG5cdFx0XHR0ZXh0OiAnWW91IGNhblxcJ3QgYnVsayBlZGl0IGltYWdlcyBhbmQgdmlkZW9zIGF0IG9uY2UuIFBsZWFzZSBzZWxlY3QgZmlsZXMgb2YgdGhlIHNhbWUgdHlwZSBhbmQgdHJ5IGFnYWluLicsXG5cdFx0XHRjb25maXJtVGV4dDogJ09rJyxcblx0XHRcdG9ubHlDb25maXJtOiB0cnVlXG5cdFx0fSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0aWYgKG51bWJlck9mU2VsZWN0ZWRWaWRlb3MpIHtcblx0XHRcdGJ1bGtFZGl0RmlsZXMoZmlsZXMsICd2aWRlb3MnKTtcblx0XHR9IGVsc2UgaWYobnVtYmVyT2ZTZWxlY3RlZEltYWdlcykge1xuXHRcdFx0YnVsa0VkaXRGaWxlcyhmaWxlcywgJ2ltYWdlcycpO1xuXHRcdH1cblx0fVxufVxuXG4vL0hlbHAgZnVuY3Rpb25cbmZ1bmN0aW9uIGZpbGVCeUlkKGlkLCBmaWxlcykge1xuXHRmaWxlc0ZpbHRlcmVkID0gZmlsZXMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcblx0XHRyZXR1cm4gZi5maWxlRGF0YS5pZCA9PT0gaWQ7XG5cdH0pO1xuXHRyZXR1cm4gZmlsZXNGaWx0ZXJlZFswXTtcbn1cblxuLy9TYXZlIGZpbGVcbmZ1bmN0aW9uIHNhdmVGaWxlKGZpbGVzLCBmaWxlKSB7XG5cdGZpbGVzLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdGlmIChmLmZpbGVEYXRhLmlkID09PSBmaWxlLmZpbGVEYXRhLmlkKSB7XG5cdFx0XHRmID0gZmlsZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzd2l0Y2hJbWFnZShpbWFnZSkge1xuXHQkKCcuaW1nLXdyYXBwZXInKS5yZW1vdmVDbGFzcygnaXMtc2xpZGluZ0xlZnQgaXMtc2xpZGluZ1JpZ2h0Jyk7XG5cdHZhciBuZXdGaWxlSWQgPSBpbWFnZS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCksXG5cdG5ld0ZpbGUgPSBmaWxlQnlJZChuZXdGaWxlSWQsIGVkaXRlZEZpbGVzRGF0YSksXG5cdG5ld0luZGV4ID0gaW1hZ2UuaW5kZXgoKSxcblx0Y3VycmVudEltYWdlID0gJCgnLmltYWdlLmlzLWFjdGl2ZScpLFxuXHRjdXJyZW50SW5kZXggPSBjdXJyZW50SW1hZ2UuaW5kZXgoKSxcblx0Y3VycmVudEZpbGUgPSBmaWxlQnlJZChjdXJyZW50SW1hZ2UuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpLCBlZGl0ZWRGaWxlc0RhdGEpLFxuXHRiYWNrSW1hZ2UgPSAkKCcjcHJldmlld0ltZ0JhY2snKSxcblx0cHJldmlld0ltYWdlID0gJCgnI3ByZXZpZXdJbWcnKTtcblxuXHRzYXZlRmlsZShlZGl0ZWRGaWxlc0RhdGEsIGVkaXRlZEZpbGVEYXRhKTtcblx0ZWRpdGVkRmlsZURhdGEgPSBuZXdGaWxlO1xuXHRsb2FkRmlsZShlZGl0ZWRGaWxlRGF0YSk7XG5cblx0LypiYWNrSW1hZ2UuYWRkQ2xhc3MoJ2lzLXZpc2libGUnKVxuXHQuYXR0cignc3JjJywgY3VycmVudEZpbGUuZmlsZURhdGEudXJsKVxuXHQuY3NzKCd3aWR0aCcsIHByZXZpZXdJbWFnZS53aWR0aCgpKVxuXHQuY3NzKCdoZWlnaHQnLCBwcmV2aWV3SW1hZ2UuaGVpZ2h0KCkpXG5cdC5jc3MoJ2xlZnQnLCBwcmV2aWV3SW1hZ2Uub2Zmc2V0KCkubGVmdClcblx0LmNzcygndG9wJywgcHJldmlld0ltYWdlLm9mZnNldCgpLnRvcCk7XG5cblx0Ki9cblxuXHRjdXJyZW50SW1hZ2UucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRpbWFnZS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cblx0aWYgKGN1cnJlbnRJbmRleCA+IG5ld0luZGV4KSB7XG5cdFx0JCgnLmltZy13cmFwcGVyJykuYWRkQ2xhc3MoJ2lzLXNsaWRpbmdMZWZ0Jyk7XG5cdH0gZWxzZSB7XG5cdFx0JCgnLmltZy13cmFwcGVyJykuYWRkQ2xhc3MoJ2lzLXNsaWRpbmdSaWdodCcpO1xuXHR9XG5cblx0dmFyIGltYWdlQ29udGFpbmVyID0gaW1hZ2UucGFyZW50cygnLmltYWdlc19fY29udGFpbmVyJyksXG5cdGltYWdlV3JhcHBlciA9IGltYWdlLnBhcmVudHMoJy5pbWFnZXNfX3dyYXBwZXInKSxcblx0aW1hZ2VMZWZ0RW5kID0gaW1hZ2VDb250YWluZXIucG9zaXRpb24oKS5sZWZ0ICsgaW1hZ2UucG9zaXRpb24oKS5sZWZ0LFxuXHRpbWFnZVJpZ2h0RW5kID0gaW1hZ2VDb250YWluZXIucG9zaXRpb24oKS5sZWZ0ICsgaW1hZ2UucG9zaXRpb24oKS5sZWZ0ICsgaW1hZ2Uud2lkdGgoKTtcblxuXHRpZiAoaW1hZ2VMZWZ0RW5kIDwgMCkge1xuXHRcdCQoJyNpbWFnZXNfX3dyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6IGltYWdlLnBvc2l0aW9uKCkubGVmdCAtIDMwfSwgNDAwKTtcblx0fSBlbHNlIGlmIChpbWFnZVJpZ2h0RW5kID4gaW1hZ2VXcmFwcGVyLndpZHRoKCkpIHtcblx0XHQkKCcjaW1hZ2VzX193cmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiBpbWFnZS5wb3NpdGlvbigpLmxlZnQgKyBpbWFnZS53aWR0aCgpIC0gaW1hZ2VXcmFwcGVyLndpZHRoKCkgKyA1MH0sIDQwMCk7XG5cdH1cblxuXHQvL2FkanVzdFJlY3QoJCgnLnB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZS1pbWcnKS5maXJzdCgpKTtcblx0Ly8kKCcjcHVycG9zZVdyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6ICcwJyB9LCA4MDApO1xufVxuZnVuY3Rpb24gaGFuZGxlSW1hZ2VTd2l0Y2goZSkge1xuXHRzd2l0Y2hJbWFnZSgkKGUudGFyZ2V0KSk7XG59XG5cbi8vRnVuY3Rpb24gZm9yIGhhbmRsZSBFZGl0IEJ1dHRvbiBjbGlja3NcbmZ1bmN0aW9uIGhhbmRsZUZpbGVkRWRpdEJ1dHRvbkNsaWNrKGUpIHtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0dmFyIGZpbGVFbGVtZW50ID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKTtcblxuXHR2YXIgZmlsZSA9IGdhbGxlcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG5cdFx0cmV0dXJuIGYuZmlsZURhdGEuaWQgPT09ICQoZmlsZUVsZW1lbnQpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcblx0fSk7XG5cblx0ZWRpdEZpbGVzKGZpbGUpO1xufVxuZnVuY3Rpb24gaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2soZSkge1xuXHQkKGUudGFyZ2V0KS5ibHVyKCk7XG5cdHZhciBmaWxlc0VsZW1lbnRzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkJyksXG5cdGNsb25lZEdhbGxlcnlPYmplY3RzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShnYWxsZXJ5T2JqZWN0cykpLFxuXHRmaWxlcyA9IFtdLFxuXHRudW1iZXJPZlNlbGVjdGVkSW1hZ2VzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLWltZ0ZpbGVUeXBlLnNlbGVjdGVkJykubGVuZ3RoLFxuXHRudW1iZXJPZlNlbGVjdGVkVmlkZW9zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLXZpZGVvRmlsZVR5cGUuc2VsZWN0ZWQnKS5sZW5ndGg7XG5cblx0aWYgKG51bWJlck9mU2VsZWN0ZWRJbWFnZXMgJiYgbnVtYmVyT2ZTZWxlY3RlZFZpZGVvcykge1xuXHRcdG5ldyBNb2RhbCh7XG5cdFx0XHR0aXRsZTogJ1lvdSBjYW5cXCd0IG11bHRpIGVkaXQgaW1hZ2VzIGFuZCB2aWRlb3MnLFxuXHRcdFx0dGV4dDogJ1lvdSBjYW5cXCd0IG11bHRpIGVkaXQgaW1hZ2VzIGFuZCB2aWRlb3MgYXQgb25jZS4gUGxlYXNlIHNlbGVjdCBmaWxlcyBvZiB0aGUgc2FtZSB0eXBlIGFuZCB0cnkgYWdhaW4uJyxcblx0XHRcdGNvbmZpcm1UZXh0OiAnT2snLFxuXHRcdFx0b25seUNvbmZpcm06IHRydWVcblx0XHR9KTtcblx0fVxuXHRlbHNlIHtcblx0XHQvL09idGFpbiBmaWxlcyBkYXRhIGZvciBmaWxlcyB0aGF0IHNob3VsZCBiZSBlZGl0ZWRcblx0XHRmaWxlc0VsZW1lbnRzLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcblx0XHRcdHZhciBmaWxlID0gW10uY29uY2F0KGNsb25lZEdhbGxlcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG5cdFx0XHRcdHJldHVybiBmLmZpbGVEYXRhLmlkID09PSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG5cdFx0XHR9KSlbMF07XG5cdFx0XHRmaWxlcy5wdXNoKGZpbGUpO1xuXHRcdH0pO1xuXG5cdFx0ZWRpdEZpbGVzKGZpbGVzKTtcblx0fVxufVxuXG5cbmZ1bmN0aW9uIGNhbmNlbEltYWdlRWRpdCgpIHtcblx0aWYgKGRhdGFDaGFuZ2VkKSB7XG5cdFx0bmV3IE1vZGFsKHtcblx0XHRcdGRpYWxvZzogdHJ1ZSxcblx0XHRcdHRpdGxlOiAnQ2FuY2VsIENoYW5nZXM/Jyxcblx0XHRcdHRleHQ6ICdBbnkgdW5zYXZlZCBjaGFuZ2VzIHlvdSBtYWRlIHdpbGwgYmUgbG9zdC4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGNhbmNlbD8nLFxuXHRcdFx0Y29uZmlybVRleHQ6ICdDYW5jZWwnLFxuXHRcdFx0Y29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNsb3NlRWRpdFNjcmVlbigpO1xuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG5cdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFbnRlcktleWRvd24pO1xuXHRcdFx0fSxcblx0XHRcdGNhbmNlbEFjdGlvbjogc2V0TW9kYWxLZXlib2FyZEFjdGlvbnMoc2F2ZUltYWdlRWRpdCwgY2FuY2VsSW1hZ2VFZGl0KVxuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdGNsb3NlRWRpdFNjcmVlbigpO1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcblx0fVxufVxuZnVuY3Rpb24gc2F2ZUltYWdlRWRpdCgpIHtcblx0dmFyIGVtcHR5UmVxdWlyZWRGaWVsZCA9IGZhbHNlLFxuXHRlbXB0eUltYWdlO1xuXHR2YXIgZW1wdHlGaWVsZHMgPSBjaGVja0ZpZWxkcygnLnByIGxhYmVsLnJlcXVpZXJlZCcpO1xuXHRpZiAoZW1wdHlGaWVsZHMgfHwgZWRpdGVkRmlsZURhdGEuZmlsZURhdGEudHlwZSA9PT0gJ3ZpZGVvJykge1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGZkKSB7XG5cdFx0XHRpZiAoZmQuZmlsZURhdGEudGl0bGUgPT09ICcnICYmICFlbXB0eVJlcXVpcmVkRmllbGQpIHtcblx0XHRcdFx0ZW1wdHlSZXF1aXJlZEZpZWxkID0gdHJ1ZTtcblx0XHRcdFx0ZW1wdHlJbWFnZSA9ICQoJy5pbWFnZS5pbWFnZV9zdHlsZV9tdWx0aSAuZmlsZV9faWRbZGF0YS1pZD1cIicgKyBmZC5maWxlRGF0YS5pZCArICdcIl0nKS5wYXJlbnRzKCcuaW1hZ2UnKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChlbXB0eVJlcXVpcmVkRmllbGQpIHtcblx0XHRcdHN3aXRjaEltYWdlKGVtcHR5SW1hZ2UpO1xuXHRcdFx0JCgnLmpzLXJlcXVpcmVkJykubm90KCcuanMtaGFzVmFsdWUnKS5maXJzdCgpLmFkZENsYXNzKCdpbnB1dF9zdGF0ZV9lcnIgaXMtYmxpbmtpbmcnKS5mb2N1cygpO1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0aWYgKGUuYW5pbWF0aW9uTmFtZSA9PT0gJ3RleHRmaWVsZC1mb2N1cy1ibGluaycpIHskKGUudGFyZ2V0KS5wYXJlbnQoKS5maW5kKCcuaXMtYmxpbmtpbmcnKS5yZW1vdmVDbGFzcygnaXMtYmxpbmtpbmcnKTt9XG5cdFx0XHR9KTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgY2xvbmVkRWRpdGVkRmlsZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGVkaXRlZEZpbGVzRGF0YSkpO1xuXHRcdFx0Y2xvbmVkRWRpdGVkRmlsZXMuZm9yRWFjaChmdW5jdGlvbihmZCkge1xuXHRcdFx0XHR2YXIgZmlsZSA9IGdhbGxlcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGYuZmlsZURhdGEuaWQgPT09IGZkLmZpbGVEYXRhLmlkO1xuXHRcdFx0XHR9KVswXTtcblx0XHRcdFx0dmFyIGZpbGVJbmRleCA9IGdhbGxlcnlPYmplY3RzLmluZGV4T2YoZmlsZSk7XG5cblx0XHRcdFx0Z2FsbGVyeU9iamVjdHMgPSBnYWxsZXJ5T2JqZWN0cy5zbGljZSgwLCBmaWxlSW5kZXgpLmNvbmNhdChbZmRdKS5jb25jYXQoZ2FsbGVyeU9iamVjdHMuc2xpY2UoZmlsZUluZGV4ICsgMSkpO1xuXG5cdFx0XHRcdC8qZ2FsbGVyeU9iamVjdHMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0XHRcdGlmIChmLmZpbGVEYXRhLmlkID09PSBmZC5maWxlRGF0YS5pZCkge1xuXHRcdFx0XHRmID0gZmQ7XG5cdFx0XHRcdGYuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9KTsqL1xuXHR9KTtcblx0c2hvd05vdGlmaWNhdGlvbignVGhlIGNoYW5nZSBpbiB0aGUgbWV0YWRhdGEgaXMgc2F2ZWQgdG8gdGhlIGFzc2V0LicpO1xuXHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG5cdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFbnRlcktleWRvd24pO1xuXHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtjbG9zZUVkaXRTY3JlZW4oKTt9LCAyMDAwKTtcblx0Y29uc29sZS5sb2coZ2FsbGVyeU9iamVjdHMpO1xuXHRkZXNlbGVjdEFsbCgpO1xuXHR1cGRhdGVHYWxsZXJ5KCk7XG59XG5cbn1cbn1cbi8qUXVpY2sgRWRpdCBGaWxlIFRpdGxlIGFuZCBJbmZvICovXG5mdW5jdGlvbiBlZGl0RmlsZVRpdGxlKGUpIHtcblx0aWYgKCEkKCcuYWwnKS5oYXNDbGFzcygnbW9kYWwnKSkge1xuXHRcdHZhciBmaWxlSW5mbyA9IGUudGFyZ2V0O1xuXHRcdHZhciBmaWxlSW5mb1RleHQgPSBmaWxlSW5mby5pbm5lckhUTUw7XG5cdFx0dmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblx0XHRpbnB1dC50eXBlID0gJ3RleHQnO1xuXHRcdGlucHV0LnZhbHVlID0gZmlsZUluZm9UZXh0O1xuXG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciBpbnB1dCA9IGUudGFyZ2V0O1xuXHRcdFx0ZmlsZUluZm8gPSBpbnB1dC5wYXJlbnROb2RlO1xuXHRcdFx0ZmlsZUluZm8ucmVtb3ZlQ2hpbGQoaW5wdXQpO1xuXHRcdFx0ZmlsZUluZm8uY2xhc3NMaXN0LnJlbW92ZSgnZWRpdCcpO1xuXHRcdFx0ZmlsZUluZm8uaW5uZXJIVE1MID0gaW5wdXQudmFsdWU7XG5cdFx0fSk7XG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDEzIHx8IGUud2hpY2ggPT0gMTMpIHtcblx0XHRcdFx0dmFyIGlucHV0ID0gZS50YXJnZXQ7XG5cdFx0XHRcdGZpbGVJbmZvID0gaW5wdXQucGFyZW50Tm9kZTtcblx0XHRcdFx0ZmlsZUluZm8ucmVtb3ZlQ2hpbGQoaW5wdXQpO1xuXHRcdFx0XHRmaWxlSW5mby5jbGFzc0xpc3QucmVtb3ZlKCdlZGl0Jyk7XG5cdFx0XHRcdGZpbGVJbmZvLmlubmVySFRNTCA9IGlucHV0LnZhbHVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZmlsZUluZm8uaW5uZXJIVE1MID0gJyc7XG5cdFx0ZmlsZUluZm8uYXBwZW5kQ2hpbGQoaW5wdXQpO1xuXHRcdGZpbGVJbmZvLmNsYXNzTGlzdC5hZGQoJ2VkaXQnKTtcblx0XHRpbnB1dC5mb2N1cygpO1xuXHR9XG59XG5mdW5jdGlvbiBlZGl0RmlsZUNhcHRpb24oZSkge1xuXHRpZiAoISQoJy5hbCcpLmhhc0NsYXNzKCdtb2RhbCcpKSB7XG5cdFx0dmFyIGZpbGVJbmZvID0gZS50YXJnZXQ7XG5cdFx0dmFyIGZpbGVJbmZvVGV4dCA9IGZpbGVJbmZvLmlubmVySFRNTDtcblx0XHR2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuXHRcdC8vaW5wdXQudHlwZSA9ICd0ZXh0J1xuXHRcdGlucHV0LnZhbHVlID0gZmlsZUluZm9UZXh0O1xuXG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciBpbnB1dCA9IGUudGFyZ2V0O1xuXHRcdFx0ZmlsZUluZm8gPSBpbnB1dC5wYXJlbnROb2RlO1xuXHRcdFx0ZmlsZUluZm8ucmVtb3ZlQ2hpbGQoaW5wdXQpO1xuXHRcdFx0ZmlsZUluZm8uY2xhc3NMaXN0LnJlbW92ZSgnZWRpdCcpO1xuXHRcdFx0ZmlsZUluZm8uaW5uZXJIVE1MID0gaW5wdXQudmFsdWU7XG5cdFx0fSk7XG5cdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDEzIHx8IGUud2hpY2ggPT0gMTMpIHtcblx0XHRcdFx0dmFyIGlucHV0ID0gZS50YXJnZXQ7XG5cdFx0XHRcdGZpbGVJbmZvID0gaW5wdXQucGFyZW50Tm9kZTtcblx0XHRcdFx0ZmlsZUluZm8ucmVtb3ZlQ2hpbGQoaW5wdXQpO1xuXHRcdFx0XHRmaWxlSW5mby5jbGFzc0xpc3QucmVtb3ZlKCdlZGl0Jyk7XG5cdFx0XHRcdGZpbGVJbmZvLmlubmVySFRNTCA9IGlucHV0LnZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0fSk7XG5cblx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSAnJztcblx0XHRmaWxlSW5mby5hcHBlbmRDaGlsZChpbnB1dCk7XG5cdFx0ZmlsZUluZm8uY2xhc3NMaXN0LmFkZCgnZWRpdCcpO1xuXHRcdGlucHV0LmZvY3VzKCk7XG5cdH1cbn1cblxuXG5mdW5jdGlvbiBkZWxldGVGaWxlKGZpbGUsIGZpbGVzKSB7XG5cdGZpbGVzID0gZmlsZXMuc3BsaWNlKGZpbGVzLmluZGV4T2YoZmlsZSksIDEpO1xufVxuZnVuY3Rpb24gZGVsZXRlRmlsZUJ5SWQoaWQsIGZpbGVzKSB7XG5cdHZhciBmaWxlID0gZmlsZUJ5SWQoaWQsIGZpbGVzKTtcblx0ZGVsZXRlRmlsZShmaWxlLCBmaWxlcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZURlbGV0ZUNsaWNrKGUpIHtcblx0dmFyIGl0ZW1OYW1lID0gJCgnLm1lbnUgLmlzLWFjdGl2ZScpLnRleHQoKS50b0xvd2VyQ2FzZSgpO1xuXHRuZXcgTW9kYWwoe1xuXHRcdHRpdGxlOiAnUmVtb3ZlIEFzc2V0PycsXG5cdFx0dGV4dDogJ1NlbGVjdGVkIGFzc2V0IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoaXMgJyArIGl0ZW1OYW1lICsgJy4gRG9u4oCZdCB3b3JyeSwgaXQgd29u4oCZdCBiZSByZW1vdmVkIGZyb20gdGhlIEFzc2V0IExpYnJhcnkuJyxcblx0XHRjb25maXJtVGV4dDogJ1JlbW92ZScsXG5cdFx0Y29uZmlybUFjdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZmlsZUlkID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG5cdFx0XHRkZWxldGVGaWxlQnlJZChmaWxlSWQsIGdhbGxlcnlPYmplY3RzKTtcblx0XHRcdHVwZGF0ZUdhbGxlcnkoKTtcblx0XHR9XG5cdH0pO1xufVxuXG4kKCcuZmlsZS10aXRsZScpLmNsaWNrKGVkaXRGaWxlVGl0bGUpO1xuJCgnLmZpbGUtY2FwdGlvbicpLmNsaWNrKGVkaXRGaWxlQ2FwdGlvbik7XG5cbi8vRmlsZSB1cGxvYWRcbmZ1bmN0aW9uIGhhbmRsZUZpbGVzKGZpbGVzKSB7XG5cdHZhciBmaWxlc091dHB1dCA9IFtdO1xuXHRpZiAoZmlsZXMgJiYgZmlsZXMubGVuZ3RoID4wKSB7XG5cdFx0Zm9yICh2YXIgaT0wOyBpPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0ZmlsZXNPdXRwdXQucHVzaChmaWxlc1tpXSk7XG5cdFx0fVxuXHRcdC8vc2hvd0xvYWRlcigpO1xuXHRcdHZhciB1cGxvYWRlZEZpbGVzID0gZmlsZXNPdXRwdXQubWFwKGZ1bmN0aW9uKGYpIHtcblx0XHRcdHJldHVybiBmaWxlVG9PYmplY3QoZikudGhlbihmdW5jdGlvbihyZXMpIHtcblx0XHRcdFx0Z2FsbGVyeU9iamVjdHMucHVzaCh7XG5cdFx0XHRcdFx0ZmlsZURhdGE6IHJlcyxcblx0XHRcdFx0XHRzZWxlY3RlZDogZmFsc2UsXG5cdFx0XHRcdFx0cG9zaXRpb246IDEwMDAsXG5cdFx0XHRcdFx0Y2FwdGlvbjogJycsXG5cdFx0XHRcdFx0Z2FsbGVyeUNhcHRpb246IGZhbHNlLFxuXHRcdFx0XHRcdGp1c3RVcGxvYWRlZDogdHJ1ZSxcblx0XHRcdFx0XHRsb2FkaW5nOiB0cnVlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0UHJvbWlzZS5hbGwodXBsb2FkZWRGaWxlcykudGhlbihmdW5jdGlvbihyZXMpIHt1cGRhdGVHYWxsZXJ5KGdhbGxlcnlPYmplY3RzLmxlbmd0aCk7fSk7XG5cdH1cbn1cblxuLy9Db252ZXJ0IHVwbG9hZGVkIGZpbGVzIHRvIGVsZW1lbnRzXG5mdW5jdGlvbiBmaWxlVG9NYXJrdXAoZmlsZSkge1xuXHRyZXR1cm4gcmVhZEZpbGUoZmlsZSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcblx0XHR2YXIgZmlsZU5vZGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlJyksXG5cblx0XHRcdGZpbGVJbWcgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlLWltZycpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIHJlc3VsdC5zcmMgKyAnKScpLFxuXG5cdFx0XHRmaWxlQ29udHJvbHMgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlLWNvbnRyb2xzJykuY2xpY2sodG9nZ2xlRmlsZVNlbGVjdCksXG5cdFx0XHRjaGVja21hcmsgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjaGVja21hcmsnKS5jbGljayh0b2dnbGVGaWxlU2VsZWN0KSxcblx0XHRcdGNsb3NlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnY2xvc2UnKS5jbGljayhkZWxldGVGaWxlKSxcblx0XHRcdGVkaXQgPSAkKCc8YnV0dG9uPkVkaXQ8L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uIHdoaXRlT3V0bGluZScpLmNsaWNrKGVkaXRGaWxlKSxcblxuXHRcdFx0ZmlsZVRpdGxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdGl0bGUnKSxcblx0XHRcdGZpbGVUeXBlSWNvbiA9ICQoJzxpIGNsYXNzPVwiZmEgZmEtY2FtZXJhXCI+PC9pPicpLmNzcygnbWFyZ2luLXJpZ2h0JywgJzJweCcpLFxuXHRcdFx0ZmlsZVRpdGxlSW5wdXQgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIiAvPicpLnZhbChyZXN1bHQubmFtZSksXG5cblx0XHRcdGZpbGVDYXB0aW9uID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZS1jYXB0aW9uJykudGV4dChyZXN1bHQubmFtZSkuY2xpY2soZWRpdEZpbGVDYXB0aW9uKSxcblx0XHRcdGZpbGVJbmZvID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZS1pbmZvJykudGV4dChyZXN1bHQuaW5mbyksXG5cblx0XHRcdGZpbGVQdXJwb3NlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZS1wdXJwb3NlJyksXG5cdFx0XHRmaWxlUHVycG9zZVNlbGVjdCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3NlbGVjdCcpLmNsaWNrKG9wZW5TZWxlY3QpLFxuXHRcdFx0c2VsZWN0U3BhbiA9ICQoJzxzcGFuPlNlbGVjdCB1c2U8L3NwYW4+JyksXG5cdFx0XHRzZWxlY3RVbCA9ICQoJzx1bD48L3VsPicpLFxuXHRcdFx0c2VsZWN0TGkxID0gJCgnPGxpPkNvdmVyPC9saT4nKS5jbGljayhzZXRTZWxlY3QpLFxuXHRcdFx0c2VsZWN0TGkyID0gJCgnPGxpPlByaW1hcnk8L2xpPicpLmNsaWNrKHNldFNlbGVjdCksXG5cdFx0XHRzZWxlY3RMaTMgPSAkKCc8bGk+U2Vjb25kYXJ5PC9saT4nKS5jbGljayhzZXRTZWxlY3QpO1xuXG5cdFx0ZmlsZVRpdGxlLmFwcGVuZChmaWxlVHlwZUljb24sIGZpbGVUaXRsZUlucHV0KTtcblx0XHRzZWxlY3RVbC5hcHBlbmQoc2VsZWN0TGkxLCBzZWxlY3RMaTIsIHNlbGVjdExpMyk7XG5cdFx0ZmlsZVB1cnBvc2VTZWxlY3QuYXBwZW5kKHNlbGVjdFNwYW4sIHNlbGVjdFVsKTtcblxuXHRcdGZpbGVQdXJwb3NlLmFwcGVuZChmaWxlUHVycG9zZVNlbGVjdCk7XG5cdFx0ZmlsZUNvbnRyb2xzLmFwcGVuZChjaGVja21hcmssIGNsb3NlLCBlZGl0KTtcblx0XHRmaWxlSW1nLmFwcGVuZChmaWxlQ29udHJvbHMpO1xuXG5cdFx0ZmlsZU5vZGUuYXBwZW5kKGZpbGVJbWcsIGZpbGVUaXRsZSwgZmlsZUNhcHRpb24sIGZpbGVJbmZvLCBmaWxlUHVycG9zZSk7XG5cblx0XHRyZXR1cm4gZmlsZU5vZGU7XG5cdH0pO1xufVxuXG4vL0NvbnZlcnQgdXBsb2FkZWQgZmlsZSB0byBvYmplY3RcbmZ1bmN0aW9uIGZpbGVUb09iamVjdChmaWxlKSB7XG5cdHJldHVybiByZWFkRmlsZShmaWxlKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuXHRcdHJldHVybiB7XG5cdCAgICAgICAgdXJsOiByZXN1bHQuc3JjLFxuXHQgICAgICAgIGZvY2FsUG9pbnQ6IHtcblx0ICAgICAgICAgICAgbGVmdDogMC41LFxuXHQgICAgICAgICAgICB0b3A6IDAuNVxuXHQgICAgICAgIH0sXG5cdFx0XHRpZDogcmVzdWx0Lm5hbWUgKyAnICcgKyBuZXcgRGF0ZSgpLFxuXHRcdFx0ZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKCksXG5cdCAgICAgICAgY29sb3I6ICcnLC8vZmlsZUltZ0NvbG9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqZmlsZUltZ0NvbG9ycy5sZW5ndGgpXSxcblx0ICAgICAgICB0aXRsZTogcmVzdWx0Lm5hbWUsXG5cdCAgICAgICAgY2FwdGlvbjogJycsXG5cdCAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuXHQgICAgICAgIGhpZ2hSZXNvbHV0aW9uOiBmYWxzZSxcblx0ICAgICAgICBjYXRlZ29yaWVzOiAnJyxcblx0ICAgICAgICB0YWdzOiAnJyxcblx0ICAgICAgICBhbHRUZXh0OiAnJyxcblx0ICAgICAgICBjcmVkaXQ6ICcnLFxuXHQgICAgICAgIGNvcHlyaWdodDogJycsXG5cdCAgICAgICAgcmVmZXJlbmNlOiB7XG5cdCAgICAgICAgICAgIHNlcmllczogJycsXG5cdCAgICAgICAgICAgIHNlYXNvbjogJycsXG5cdCAgICAgICAgICAgIGVwaXNvZGU6ICcnXG5cdCAgICAgICAgfSxcblx0XHRcdHR5cGU6ICdpbWFnZSdcblx0ICAgIH07XG5cdH0pO1xufVxuXG4vL1JlYWQgZmlsZSBhbmQgcmV0dXJuIHByb21pc2VcbmZ1bmN0aW9uIHJlYWRGaWxlKGZpbGUpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKFxuXHRcdGZ1bmN0aW9uKHJlcywgcmVqKSB7XG5cdFx0XHR2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0XHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdHJlcyh7c3JjOiBlLnRhcmdldC5yZXN1bHQsXG5cdFx0XHRcdFx0bmFtZTogZmlsZS5uYW1lLFxuXHRcdFx0XHRcdGluZm86IGZpbGUudHlwZSArICcsICcgKyBNYXRoLnJvdW5kKGZpbGUuc2l6ZS8xMDI0KS50b1N0cmluZygpICsgJyBLYid9KTtcblx0XHRcdH07XG5cdFx0XHRyZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZWoodGhpcyk7XG5cdFx0XHR9O1xuXHRcdFx0cmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG5cdFx0fVxuXHQpO1xufVxuXG4vL0xvYWRlcnNcbmZ1bmN0aW9uIHNob3dMb2FkZXIoKSB7XG5cdHZhciBtb2RhbCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsJykuYXR0cignaWQnLCAnbG9hZGVyTW9kYWwnKSxcblx0XHRsb2FkZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdsb2FkZXInKTtcblxuXHRtb2RhbC5hcHBlbmQobG9hZGVyKTtcblx0JCgnYm9keScpLmFwcGVuZChtb2RhbCk7XG59XG5mdW5jdGlvbiBoaWRlTG9hZGVyKCkge1xuXHQkKCcjbG9hZGVyTW9kYWwnKS5yZW1vdmUoKTtcbn1cblxuLy9EcmFnIGFuZCBkcm9wIGZpbGVzXG5mdW5jdGlvbiBoYW5kbGVEcmFnRW50ZXIoZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0ZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwiY29weVwiO1xuXHQkKCcjZHJvcFpvbmUnKS5hZGRDbGFzcygnbW9kYWwnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZHJvcFpvbmVcIikuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgaGFuZGxlRHJhZ0xlYXZlLCB0cnVlKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZURyYWdMZWF2ZShlKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0JChcIiNkcm9wWm9uZVwiKS5yZW1vdmVDbGFzcygnbW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid3JhcHBlclwiKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2NrZWQnKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZURyb3AoZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0JChcIiNkcm9wWm9uZVwiKS5yZW1vdmVDbGFzcygnbW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdHZhciBmaWxlcyA9IGUuZGF0YVRyYW5zZmVyLmZpbGVzO1xuXHRpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuXHRcdGhhbmRsZUZpbGVzKGZpbGVzKTtcblx0fVxufVxuZnVuY3Rpb24gaGFuZGxlRHJhZ092ZXIoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufVxuXG4vL1VwbG9hZCBmaWxlIGZyb20gXCJVcGxvYWQgRmlsZVwiIEJ1dHRvblxuZnVuY3Rpb24gaGFuZGxlVXBsb2FkRmlsZXNDbGljayhlKSB7XG5cdHZhciBmaWxlc0lucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlc0lucHV0XCIpO1xuICAgIGlmICghZmlsZXNJbnB1dCkge1xuICAgIFx0ZmlsZXNJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgZmlsZXNJbnB1dC50eXBlID0gXCJmaWxlXCI7XG4gICAgICAgIGZpbGVzSW5wdXQubXVsdGlwbGUgPSBcInRydWVcIjtcbiAgICAgICAgZmlsZXNJbnB1dC5oaWRkZW4gPSB0cnVlO1xuICAgICAgICBmaWxlc0lucHV0LmFjY2VwdCA9IFwiaW1hZ2UvKiwgYXVkaW8vKiwgdmlkZW8vKlwiO1xuICAgICAgICBmaWxlc0lucHV0LmlkID0gXCJmaWxlc0lucHV0XCI7XG4gICAgICAgIGZpbGVzSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICBoYW5kbGVGaWxlcyhlLnRhcmdldC5maWxlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmaWxlc0lucHV0KTtcbiAgICB9XG4gICAgZmlsZXNJbnB1dC5jbGljaygpO1xufVxuXG4vL1Rvb2x0aXBcbmZ1bmN0aW9uIGNyZWF0ZVRvb2x0aXAodGFyZ2V0LCB0ZXh0KSB7XG4gICAgdmFyIHRvb2x0aXAgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCd0b29sdGlwJyksXG4gICAgICAgIHRvb2x0aXBUZXh0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygndG9vbHRpcF9fdGV4dCcpLnRleHQodGV4dCksXG4gICAgICAgIHRvb2x0aXBUb2dnbGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCd0b29sdGlwX190b2dnbGUnKSxcbiAgICAgICAgdG9vbHRpcFRvZ2dsZV9Ub2dnbGUgPSAkKCc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJuZXZlclNob3dUb29sdGlwXCIgLz4nKSwvLy5vbignY2hhbmdlJywgbmV2ZXJTaG93VG9vbHRpcCksXG4gICAgICAgIHRvb2x0aXBUb2dnbGVfTGFiZWwgPSAkKCc8bGFiZWwgZm9yPVwibmV2ZXJTaG93VG9vbHRpcFwiPkdvdCBpdCwgZG9uXFwndCBzaG93IG1lIHRoaXMgYWdhaW48L2xhYmVsPicpO1xuXG4gICAgdG9vbHRpcFRvZ2dsZS5hcHBlbmQodG9vbHRpcFRvZ2dsZV9Ub2dnbGUsIHRvb2x0aXBUb2dnbGVfTGFiZWwpO1xuICAgIHRvb2x0aXBUb2dnbGUuYmluZCgnZm9jdXMgY2xpY2sgY2hhbmdlJywgbmV2ZXJTaG93VG9vbHRpcCk7XG4gICAgdG9vbHRpcC5hcHBlbmQodG9vbHRpcFRleHQsIHRvb2x0aXBUb2dnbGUpO1xuICAgICQoJy5maWxlX19jYXB0aW9uLXRleHRhcmVhJykucmVtb3ZlQXR0cignaWQnKTtcbiAgICAkKHRhcmdldCkucGFyZW50KCkuYXBwZW5kKHRvb2x0aXApO1xuICAgIHRhcmdldC5hdHRyKCdpZCcsICdhY3RpdmUtY2FwdGlvbi10ZXh0YXJlYScpO1xuXG4gICAgdG9vbHRpcC53aWR0aCh0YXJnZXQud2lkdGgoKSk7XG4gICAgaWYgKCQoJ2JvZHknKS53aWR0aCgpIC0gdGFyZ2V0Lm9mZnNldCgpLmxlZnQgLSB0YXJnZXQud2lkdGgoKSAtIHRhcmdldC53aWR0aCgpIC0gMjAgPiAwICkge1xuICAgICAgICB0b29sdGlwLmNzcygnbGVmdCcsIHRhcmdldC5wb3NpdGlvbigpLmxlZnQgKyB0YXJnZXQud2lkdGgoKSArIDEwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0b29sdGlwLmNzcygnbGVmdCcsIHRhcmdldC5wb3NpdGlvbigpLmxlZnQgLSB0YXJnZXQud2lkdGgoKSAtIDEwKTtcbiAgICB9XG4gICAgLy92YXIgbm90SW5jbHVkZSA9IHRvb2x0aXAuYWRkKHRvb2x0aXBUZXh0KS5hZGQodG9vbHRpcFRvZ2dsZSkuYWRkKHRvb2x0aXBUb2dnbGVfTGFiZWwpLmFkZCh0b29sdGlwVG9nZ2xlX1RvZ2dsZSkuYWRkKHRhcmdldCk7XG4gICAgY29uc29sZS5sb2coJCgnI2FjdGl2ZS1jYXB0aW9uLXRleHRhcmVhJykpO1xuICAgICQoJy5jdCwgLm1lbnUnKS5vbihjbG9zZVRvb2x0aXApLmZpbmQoJyNhY3RpdmUtY2FwdGlvbi10ZXh0YXJlYSwgLnRvb2x0aXAsIC50b29sdGlwIGlucHV0LCAudG9vbHRpcCBsYWJlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtlLnN0b3BQcm9wYWdhdGlvbigpO30pO1xufVxuXG5mdW5jdGlvbiBuZXZlclNob3dUb29sdGlwKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9vbHRpcCcsIHRydWUpO1xuICAgIGNsb3NlVG9vbHRpcCgpO1xufVxuXG5mdW5jdGlvbiBjbG9zZVRvb2x0aXAoZSkge1xuICAgIGlmIChlKSB7ZS5zdG9wUHJvcGFnYXRpb24oKTt9XG5cbiAgICBjb25zb2xlLmxvZygnY2xvc2V0b29sdGlwJywgZSk7XG4gICAgJCgnLmN0LCAubWVudScpLnVuYmluZCgnY2xpY2snLCBjbG9zZVRvb2x0aXApO1xuICAgIHZhciB0b29sdGlwcyA9ICQoJy50b29sdGlwJyk7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRvb2x0aXBzLnJlbW92ZSgpO1xuICAgIH0sIDMwMCk7XG59XG5cbi8vTW9kYWwgUHJvbXB0cyBhbmQgV2luZG93c1xuZnVuY3Rpb24gY2xvc2VFZGl0U2NyZWVuKCkge1xuICAkKCcucHInKS5yZW1vdmVDbGFzcygnbW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICQoJy5wciAucHJldmlldycpLnJlbW92ZUNsYXNzKCdmb2NhbCBsaW5lIGZ1bGwgcmVjdCBwb2ludCcpO1xuICAkKCcuZm9jYWxQb2ludCcpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICQoJy5mb2NhbFJlY3QnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAkKCcjZm9jYWxQb2ludFRvZ2dsZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJCgnI2ZvY2FsUmVjdFRvZ2dsZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJCgnLnB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZSAucHVycG9zZS1pbWcnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAkKCcuY3QgLmZpbGUnKS5maW5kKCdidXR0b24nKS5jc3MoJ2Rpc3BsYXknLCAnJyk7XG4gIGRlc2VsZWN0QWxsKCk7XG4gICQoJyN3cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ292ZXJmbG93Jyk7XG4gICQoJ2JvZHknKS5zY3JvbGxUb3Aoc2Nyb2xsUG9zaXRpb24pO1xufVxuXG5mdW5jdGlvbiBzaG93TW9kYWxQcm9tcHQob3B0aW9ucykge1xuICB2YXIgbW9kYWxDbGFzcyA9IG9wdGlvbnMuZGlhbG9nID8gJ21vZGFsIG1vZGFsLS1wcm9tcHQgbW9kYWwtLWRpYWxvZycgOiAnbW9kYWwgbW9kYWwtLXByb21wdCcsXG4gIHNlY0J1dHRvbkNsYXNzID0gb3B0aW9ucy5kaWFsb2cgPyAnYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXknIDogJ2J1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS13aGl0ZScsXG4gIGNsb3NlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX2Nsb3NlJykuY2xpY2sob3B0aW9ucy5jYW5jZWxBY3Rpb24pLFxuICBtb2RhbCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MobW9kYWxDbGFzcyksXG4gIHRpdGxlID0gb3B0aW9ucy50aXRsZSA/ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX190aXRsZScpLnRleHQob3B0aW9ucy50aXRsZSkgOiBudWxsLFxuICB0ZXh0ID0gb3B0aW9ucy50ZXh0ID8gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX3RleHQnKS50ZXh0KG9wdGlvbnMudGV4dCkgOiBudWxsLFxuICBjb250cm9scyA9IG9wdGlvbnMuY29uZmlybUFjdGlvbiB8fCBvcHRpb25zLmNhbmNlbEFjdGlvbiA/ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX19jb250cm9scycpIDogbnVsbCxcbiAgY29uZmlybUJ1dHRvbiA9IG9wdGlvbnMuY29uZmlybUFjdGlvbiA/ICQoJzxidXR0b24+PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbiAgYnV0dG9uX3N0eWxlX291dGxpbmUtYWNjZW50JykudGV4dChvcHRpb25zLmNvbmZpcm1UZXh0IHx8ICdPaycpLmNsaWNrKG9wdGlvbnMuY29uZmlybUFjdGlvbikgOiBudWxsLFxuICBjYW5jZWxCdXR0b24gPSBvcHRpb25zLmNhbmNlbEFjdGlvbiA/ICQoJzxidXR0b24+PC9idXR0b24+JykuYWRkQ2xhc3Moc2VjQnV0dG9uQ2xhc3MpLnRleHQob3B0aW9ucy5jYW5jZWxUZXh0IHx8ICdOZXZlcm1pbmQnKS5jbGljayhvcHRpb25zLmNhbmNlbEFjdGlvbikgOiBudWxsO1xuXG4gIGNvbnRyb2xzLmFwcGVuZChjb25maXJtQnV0dG9uLCBjYW5jZWxCdXR0b24pO1xuICBtb2RhbC5hcHBlbmQoY2xvc2UsIHRpdGxlLCB0ZXh0LCBjb250cm9scyk7XG4gICQoJ2JvZHknKS5hcHBlbmQobW9kYWwpO1xuICBzZXRNb2RhbEtleWJvYXJkQWN0aW9ucyhvcHRpb25zLmNvbmZpcm1BY3Rpb24sIG9wdGlvbnMuY2FuY2VsQWN0aW9uKTtcbn1cblxuZnVuY3Rpb24gaGlkZU1vZGFsUHJvbXB0KCkge1xuICAkKCcub3AubW9kYWwsIC5vcC5kaWFsb2csIC5tb2RhbC5tb2RhbC0tcHJvbXB0JykucmVtb3ZlKCk7XG4gICQoZG9jdW1lbnQpLnVuYmluZCgna2V5ZG93bicpO1xufVxuZnVuY3Rpb24gc2V0TW9kYWxLZXlib2FyZEFjdGlvbnMoZW50ZXIsIGNsb3NlKSB7XG4gIGhhbmRsZUVzY0tleWRvd24gPSBmdW5jdGlvbihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmJvZHkgJiYgZS5rZXlDb2RlID09PSAyNykge2Nsb3NlKCk7fVxuICB9O1xuICBoYW5kbGVFbnRlcktleWRvd24gPSBmdW5jdGlvbihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmJvZHkgJiYgZS5rZXlDb2RlID09PSAxMykge2VudGVyKCk7fVxuICB9O1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG59XG5mdW5jdGlvbiBoYW5kbGVFc2NLZXlkb3duKGUpIHtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgLy9pZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmJvZHkgJiYgZS5rZXlDb2RlID09PSAyNykge2Nsb3NlKCk7fVxufVxuZnVuY3Rpb24gaGFuZGxlRW50ZXJLZXlkb3duKGUpIHtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgLy9pZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmJvZHkgJiYgZS5rZXlDb2RlID09PSAxMykge2VudGVyKCk7fVxufVxuXG5mdW5jdGlvbiBNb2RhbChvcHRpb25zKSB7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgdGhpcy5faW5pdCgpO1xuICB0aGlzLl9pbml0RXZlbnRzKCk7XG59XG5cbk1vZGFsLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm1vZGFsID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuZGlhbG9nID8gJ21vZGFsIG1vZGFsLS1wcm9tcHQgbW9kYWwtLWRpYWxvZycgOiAnbW9kYWwgbW9kYWwtLXByb21wdCBtb2RhbC0tZnVsbCcpO1xuXG4gIHRoaXMuY2xvc2VCdXR0b24gPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fY2xvc2UnKTtcbiAgdGhpcy50aXRsZSA9IHRoaXMub3B0aW9ucy50aXRsZSA/ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX190aXRsZScpLnRleHQodGhpcy5vcHRpb25zLnRpdGxlKSA6IG51bGw7XG4gIHRoaXMudGV4dCA9IHRoaXMub3B0aW9ucy50ZXh0ID8gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX3RleHQnKS50ZXh0KHRoaXMub3B0aW9ucy50ZXh0KSA6IG51bGw7XG5cbiAgdGhpcy5jb250cm9scyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX19jb250cm9scycpO1xuICBpZiAoIXRoaXMub3B0aW9ucy5vbmx5Q2FuY2VsKSB7XG4gICAgdGhpcy5jb25maXJtQnV0dG9uID0gJCgnPGJ1dHRvbiAvPicpLmFkZENsYXNzKCdidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtYWNjZW50JykudGV4dCh0aGlzLm9wdGlvbnMuY29uZmlybVRleHQgfHwgJ09rJyk7XG4gICAgdGhpcy5jb250cm9scy5hcHBlbmQodGhpcy5jb25maXJtQnV0dG9uKTtcbiAgfVxuICBpZiAoIXRoaXMub3B0aW9ucy5vbmx5Q29uZmlybSkge1xuICAgIHRoaXMuY2FuY2VsQnV0dG9uID0gJCgnPGJ1dHRvbiAvPicpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5kaWFsb2cgPyAnYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXknIDogJ2J1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS13aGl0ZScpLnRleHQodGhpcy5vcHRpb25zLmNhbmNlbFRleHQgfHwgJ05ldmVybWluZCcpO1xuICAgIHRoaXMuY29udHJvbHMuYXBwZW5kKHRoaXMuY2FuY2VsQnV0dG9uKTtcbiAgfVxuXG4gIHRoaXMubW9kYWwuYXBwZW5kKHRoaXMuY2xvc2VCdXR0b24sIHRoaXMudGl0bGUsIHRoaXMudGV4dCwgdGhpcy5jb250cm9scyk7XG4gICQoJ2JvZHknKS5hcHBlbmQodGhpcy5tb2RhbCk7XG59O1xuXG5Nb2RhbC5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG4gIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFbnRlcktleWRvd24pO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNvbmZpcm1hdGlvbigpIHtcbiAgICBpZiAoc2VsZi5vcHRpb25zLmNvbmZpcm1BY3Rpb24pIHtzZWxmLm9wdGlvbnMuY29uZmlybUFjdGlvbigpO31cbiAgICBzZWxmLm1vZGFsLnJlbW92ZSgpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBzZWxmLmhhbmRsZUtleURvd24sIHRydWUpO1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZUNhbmNlbGF0aW9uKCkge1xuICAgIGlmIChzZWxmLm9wdGlvbnMuY2FuY2VsQWN0aW9uKSB7c2VsZi5vcHRpb25zLmNhbmNlbEFjdGlvbigpO31cbiAgICBzZWxmLm1vZGFsLnJlbW92ZSgpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBzZWxmLmhhbmRsZUtleURvd24sIHRydWUpO1xuICB9XG5cbiAgc2VsZi5oYW5kbGVLZXlEb3duID0gZnVuY3Rpb24oZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKCFzZWxmLm9wdGlvbnMub25seUNhbmNlbCkge1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtoYW5kbGVDYW5jZWxhdGlvbigpO31cbiAgICB9XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtoYW5kbGVDb25maXJtYXRpb24oKTt9XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gMjcpIHtoYW5kbGVDYW5jZWxhdGlvbigpO31cbiAgfTtcblxuICBpZiAoc2VsZi5jYW5jZWxCdXR0b24pIHtzZWxmLmNhbmNlbEJ1dHRvbi5jbGljayhoYW5kbGVDYW5jZWxhdGlvbik7fVxuICBpZiAoc2VsZi5jb25maXJtQnV0dG9uKSB7c2VsZi5jb25maXJtQnV0dG9uLmNsaWNrKGhhbmRsZUNvbmZpcm1hdGlvbik7fVxuICBzZWxmLmNsb3NlQnV0dG9uLmNsaWNrKGhhbmRsZUNhbmNlbGF0aW9uKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHNlbGYuaGFuZGxlS2V5RG93biwgdHJ1ZSk7XG59O1xuXG4vL0Fzc2V0IGxpYnJhcnlcbnZhciBhc3NldExpYnJhcnlPYmplY3RzID0gW1xuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS0yLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0yLmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtMi5qcGcnLFxuICAgIGNhcHRpb246ICcwNS4gRG9uXFwndCBHZXQgTG9zdCcsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS0zLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0zLmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtMy5qcGcnLFxuICAgIGNhcHRpb246ICcwMi4gVGhlIE1hbiBpbiB0aGUgU2hhZG93cycsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS00LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS00LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtNC5qcGcnLFxuICAgIGNhcHRpb246ICcwMy4gVGhlIEZpcnN0IFNsaWNlJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWVwaXNvZGUtNS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItZXBpc29kZS01LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItZXBpc29kZS01LmpwZycsXG4gICAgY2FwdGlvbjogJzAxLiBBIE5ldyBWaXNpdG9yJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTUuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTUuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS01LmpwZycsXG4gICAgY2FwdGlvbjogJzA0LiBUaGUgQmxvb2QgTW9vbicsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS0xMC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtMTAuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS0xMC5qcGcnLFxuICAgIGNhcHRpb246ICcwMy4gVGhlIEZpcnN0IFNsaWNlJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTEzLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0xMy5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTEzLmpwZycsXG4gICAgY2FwdGlvbjogJzAxLiBBIE5ldyBWaXNpdG9yJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTE1LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0xNS5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTE1LmpwZycsXG4gICAgY2FwdGlvbjogJzAxLiBBIE5ldyBWaXNpdG9yJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTExLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0xMS5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdUcmFpbGVyIEUwMycsXG4gICAgY2FwdGlvbjogJzA2LiBBbGwgQWxvbmUnLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICd2aWRlbydcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtOS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtOS5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTkuanBnJyxcbiAgICBjYXB0aW9uOiAnMDQuIFRoZSBCbG9vZCBNb29uJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTguanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTguanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS04LmpwZycsXG4gICAgY2FwdGlvbjogJzA0LiBUaGUgQmxvb2QgTW9vbicsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS02LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS02LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtNi5qcGcnLFxuICAgIGNhcHRpb246ICcwNi4gQWxsIEFsb25lJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAxLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnYXp0ZWNfdGVtcGxlLnBuZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDEuanBnJyxcbiAgICBjYXB0aW9uOiAnV3JpdGVyLCBCcmlhbiBNaWxsaWtpbiwgYSBtYW4gYWJvdXQgSGF2ZW4sIHRha2VzIHVzIGJlaGluZCB0aGUgc2NlbmVzIG9mIHRoaXMgZXBpc29kZSBhbmQgZ2l2ZXMgdXMgYSBmZXcgdGVhc2VzIGFib3V0IHRoZSBTZWFzb24gdGhhdCB3ZSBjYW5cXCd0IHdhaXQgdG8gc2VlIHBsYXkgb3V0ISBUaGlzIGlzIHRoZSBmaXJzdCBlcGlzb2RlIG9mIEhhdmVuIG5vdCBmaWxtZWQgaW4gb3IgYXJvdW5kIENoZXN0ZXIsIE5vdmEgU2NvdGlhLiBCZWdpbm5pbmcgaGVyZSwgdGhlIHNob3cgYW5kIGl0cyBzdGFnZXMgcmVsb2NhdGVkIHRvIEhhbGlmYXguJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDIuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdiaWdfYmVuLnBuZyA0M2RlZnF3ZScsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNGREJEMDAnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMi5qcGcnLFxuICAgIGNhcHRpb246ICdDaGFybG90dGUgbGF5cyBvdXQgaGVyIHBsYW4gZm9yIHRoZSBmaXJzdCB0aW1lIGluIHRoaXMgZXBpc29kZTogdG8gYnVpbGQgYSBuZXcgQmFybiwgb25lIHRoYXQgd2lsbCBjdXJlIFRyb3VibGVzIHdpdGhvdXQga2lsbGluZyBUcm91YmxlZCBwZW9wbGUgaW4gdGhlIHByb2Nlc3MuIEhlciBwbGFuLCBhbmQgd2hhdCBwYXJ0cyBpdCByZXF1aXJlcywgd2lsbCBjb250aW51ZSB0byBwbGF5IGEgbW9yZSBhbmQgbW9yZSBpbXBvcnRhbnQgcm9sZSBhcyB0aGUgc2Vhc29uIGdvZXMgYWxvbmcuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAzLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnY2hyaXN0X3RoZV9yZWRlZW1lci5wbmcgMDkybmx4bmMnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjRUQ0MTJEJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDMuanBnJyxcbiAgICBjYXB0aW9uOiAnTG9zdCB0aW1lIHBsYXlzIGFuIGV2ZW4gbW9yZSBpbXBvcnRhbnQgcm9sZSBpbiB0aGlzIGVwaXNvZGUgdGhhbiBldmVyIGJlZm9yZeKAlCBhcyBpdOKAmXMgcmV2ZWFsZWQgdGhhdCBpdOKAmXMgYSB3ZWFwb24gdGhlIGdyZWF0IGV2aWwgZnJvbSBUaGUgVm9pZCBoYXMgYmVlbiB1c2luZyBhZ2FpbnN0IHVzLCBhbGwgc2Vhc29uIGxvbmcuIFdoaWNoIGdvZXMgYmFjayB0byB0aGUgY2F2ZSB1bmRlciB0aGUgbGlnaHRob3VzZSBpbiBiZWdpbm5pbmcgb2YgdGhlIFNlYXNvbiA1IHByZW1pZXJlLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdMb3N0IHRpbWUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wNC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ2NvbG9zc2V1bS5wbmcgLTRyanhuc2snLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjMzJBNEI3JyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDQuanBnJyxcbiAgICBjYXB0aW9uOiAnVGhlIOKAnGFldGhlciBjb3Jl4oCdIHRoYXQgQ2hhcmxvdHRlIGFuZCBBdWRyZXkgbWFrZSBwcmVzZW50ZWQgYW4gaW1wb3J0YW50IGRlc2lnbiBjaG9pY2UuIFRoZSB3cml0ZXJzIHdhbnRlZCBpdCB0byBsb29rIG9yZ2FuaWMgYnV0IGFsc28gZGVzaWduZWTigJQgbGlrZSB0aGUgdGVjaG5vbG9neSBvZiBhbiBhZHZhbmNlZCBjdWx0dXJlIGZyb20gYSBkaWZmZXJlbnQgZGltZW5zaW9uLCBjYXBhYmxlIG9mIGRvaW5nIHRoaW5ncyB0aGF0IHdlIG1pZ2h0IHBlcmNlaXZlIGFzIG1hZ2ljIGJ1dCB3aGljaCBpcyBqdXN0IHNjaWVuY2UgdG8gdGhlbS4gVGhlIHZhcmlvdXMgZGVwaWN0aW9ucyBvZiBLcnlwdG9uaWFuIHNjaWVuY2UgaW4gdmFyaW91cyBTdXBlcm1hbiBzdG9yaWVzIHdhcyBvbmUgaW5zcGlyYXRpb24uJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZSBhbmQgQXVkcmV5JyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDUuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdlYXN0ZXJfaXNsYW5kLnBuZyBubG40bmthMCcsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDEwLCAyNSksXG4gICAgY29sb3I6ICcjRDNFQ0VDJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDUuanBnJyxcbiAgICBjYXB0aW9uOiAnVGhpcyBpcyB0aGUgZmlyc3QgZXBpc29kZSBpbiBTZWFzb24gNSBpbiB3aGljaCB3ZeKAmXZlIGxvc3Qgb25lIG9mIG91ciBoZXJvZXMuIEl0IHdhcyBpbXBvcnRhbnQgdG8gaGFwcGVuIGFzIHdlIGhlYWQgaW50byB0aGUgaG9tZSBzdHJldGNoIG9mIHRoZSBzaG93IGFuZCBhcyB0aGUgc3Rha2VzIGluIEhhdmVuIGhhdmUgbmV2ZXIgYmVlbiBtb3JlIGRpcmUuIEFzIGEgcmVzdWx0LCBpdCB3b27igJl0IGJlIHRoZSBsYXN0IGxvc3Mgd2VcXCdsbCBzdWZmZXIgdGhpcyBzZWFzb27igKYnLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnV2lsZCBDYXJkJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDYuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdweXJhbWlkcy5wbmcgZmRieTY0JyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTAsIDI1KSxcbiAgICBjb2xvcjogJyMyQTdDOTEnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wNi5qcGcnLFxuICAgIGNhcHRpb246ICdUaGUgY2hhbGxlbmdlIGluIENoYXJsb3R0ZVxcJ3MgZmluYWwgY29uZnJvbnRhdGlvbiB3YXMgdGhhdCB0aGUgc2hvdyBjb3VsZG7igJl0IHJldmVhbCBoZXIgYXR0YWNrZXLigJlzIGFwcGVhcmFuY2UgdG8gdGhlIGF1ZGllbmNlLCBzbyB0aGUgZGFya25lc3Mgd2FzIG5lY2Vzc2l0YXRlZC4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcblxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wMS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3Nhbl9mcmFuY2lzb19icmlkZ2UucG5nIDQyMzRmZjUyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTAsIDI1KSxcbiAgICBjb2xvcjogJyM5Njc4NDAnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wMS5qcGcnLFxuICAgIGNhcHRpb246ICdXYXJuaW5nOiBJZiB5b3UgZG9uXFwndCB3YW50IHRvIGtub3cgd2hhdCBoYXBwZW5lZCBpbiB0aGlzIGVwaXNvZGUsIGRvblxcJ3QgcmVhZCB0aGlzIHBob3RvIHJlY2FwISBEYXZlIGp1c3QgaGFkIGFub3RoZXIgdmlzaW9uIGFuZCB0aGlzIHRpbWUsIGhlXFwncyBiZWluZyBwcm9hY3RpdmUgYWJvdXQgaXQuIEhlIGFuZCBWaW5jZSBkYXNoIG91dCBvZiB0aGUgaG91c2UgdG8gc2F2ZSB0aGUgbGF0ZXN0IHZpY3RpbXMgb2YgQ3JvYXRvYW4sIGEuay5hIHRoZSBObyBNYXJrcyBLaWxsZXIuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAyLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc3RvbmVfaGVuZ2UucG5nIDQ5MG1ubWFiZCcsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDEwLCAyNSksXG4gICAgY29sb3I6ICcjNTY2Rjc4JyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDIuanBnJyxcbiAgICBjYXB0aW9uOiAnTWVhbndoaWxlLCBEd2lnaHQgYW5kIE5hdGhhbiBnbyBkb3dudG93biB0byBpbnZlc3RpZ2F0ZSB3aGF0IHRoZXkgdGhpbmsgaXMgYSBkcnVua2VuIG1hbiBjYXVzaW5nIGEgZGlzdHVyYmFuY2UgYnV0IGl0IHR1cm5zIG91dCB0aGF0IHRoZSBndXkgaXMgY3Vyc2VkLiBUaGVyZSBpcyBhIHJvbWFuIG51bWVyYWwgb24gaGlzIHdyaXN0IGFuZCwgYXMgdGhleSB3YXRjaCwgaW52aXNpYmxlIGhvcnNlcyB0cmFtcGxlIGhpbS4gTGF0ZXIsIE5hdGhhbiBhbmQgRHdpZ2h0IGZpbmQgYW5vdGhlciBtYW4gd2hvIGFwcGVhcnMgdG8gaGF2ZSBiZWVuIHN0cnVjayBieSBsaWdodGVuaW5nIOKAkyBidXQgdGhlcmUgaGFkIGJlZW4gbm8gcmVjZW50IHN0b3JtIGluIHRvd24g4oCTIGFuZCBkcm9wcGVkIGZyb20gYSBza3lzY3JhcGVyLiBTa3lzY3JhcGVycyBpbiBIYXZlbj8gQWJzdXJkLiBBbmQgdGhlIGd1eSBhbHNvIGhhcyBhIG15c3RlcmlvdXMgUm9tYW4gbnVtZXJhbCB0YXR0b28gb24gaGlzIHdyaXN0LiBOYXRoYW4gYW5kIER3aWdodCBmaW5kIGEgbGlzdCBvZiBuYW1lcyBpbiB0aGUgZ3V5XFwncyBwb2NrZXQgdGhhdCBsZWFkcyB0aGVtIHRvIGEgbG9jYWwgZm9ydHVuZSB0ZWxsZXIsIExhaW5leS4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDMuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzeWRuZXlfb3BlcmFfaG91c2UucG5nIDBzZWQ2N2gnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMCwgMjUpLFxuICAgIGNvbG9yOiAnIzJFMUQwNycsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAzLmpwZycsXG4gICAgY2FwdGlvbjogJ0J5IGZvbGxvd2luZyB0aGUgY2x1ZXMgZnJvbSBEYXZlXFwncyB2aXNpb24sIGhlIGFuZCBWaW5jZSBmaW5kIHRoZSBzY2VuZSBvZiB0aGUgTm8gTWFyayBLaWxsZXJcXCdzIG1vc3QgcmVjZW50IGNyaW1lLiBUaGV5IGFsc28gZmluZCBhIHN1cnZpdm9yLiBVbmZvcnR1bmF0ZWx5LCBzaGUgY2FuXFwndCByZW1lbWJlciBhbnl0aGluZy4gSGVyIG1lbW9yeSBoYXMgYmVlbiB3aXBlZCwgd2hpY2ggZ2V0cyB0aGVtIHRvIHRoaW5raW5nIGFib3V0IHdobyBtYXkgYmUgbmV4dCBvbiBDcm9hdG9hblxcJ3MgbGlzdC4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDQuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd0YWpfbWFoYWwucG5nIDk0M25ia2EnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMCwgMjUpLFxuICAgIGNvbG9yOiAnIzAwNDQ1RicsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA0LmpwZycsXG4gICAgY2FwdGlvbjogJ09uIHRoZWlyIHdheSB0byBtZWV0IHdpdGggTGFpbmV5LCBOYXRoYW4gYnJlYWtzIGhpcyB0aXJlIGlyb24gd2hpbGUgdHJ5aW5nIHRvIGZpeCBhIGZsYXQgdGlyZS4gVG91Z2ggYnJlYWsuIEFuZCB0aGVuIER3aWdodCBnZXRzIGEgc2hvb3RpbmcgcGFpbiBpbiBoaXMgc2lkZSB3aXRoIGEgZ25hcmx5IGJydWlzZSB0byBtYXRjaCwgZXZlbiB0b3VnaGVyIGJyZWFrLiBBbmQgdGhlbiBib3RoIGd1eXMgbm90aWNlIHRoYXQgdGhleSBub3cgaGF2ZSBSb21hbiBudW1lcmFsIHRhdHRvb3Mgb24gdGhlaXIgd3Jpc3RzLiBUaGUgbnVtYmVyIFggZm9yIE5hdGhhbiBhbmQgWElJIGZvciBEd2lnaHQuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA1LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnd2luZG1pbGwucG5nIGplcmwzNCcsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxMSksXG4gICAgY29sb3I6ICcjMkYzODM3JyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDUuanBnJyxcbiAgICBjYXB0aW9uOiAnSW4gdGhlIG1pbmVzaGFmdCwgQ2hhcmxvdHRlIGFuZCBBdWRyZXkgaGF2ZSB0YWtlbiBvbiB0aGUgdGFzayBvZiBjb2xsZWN0aW5nIGFsbCBvZiB0aGUgYWV0aGVyIHRvIGNyZWF0ZSBhbiBhZXRoZXIgY29yZS4gVGhpcyBpcyB0aGUgZmlyc3Qgc3RlcCB0aGV5IG5lZWQgdG8gY3JlYXRlIGEgbmV3IEJhcm4gd2hlcmUgVHJvdWJsZSBwZW9wbGUgY2FuIHN0ZXAgaW5zaWRlIGFuZCB0aGVuIGJlIFwiY3VyZWRcIiBvZiB0aGVpciBUcm91YmxlcyB3aGVuIHRoZXkgc3RlcCBvdXQuIFNvdW5kcyBlYXN5IGVub3VnaCBidXQgdGhleVxcJ3JlIGhhdmluZyB0cm91YmxlIGNvcnJhbGxpbmcgYWxsIHRoZSBhZXRoZXIgaW50byBhIGdpYW50IGJhbGwuIFVuc3VycHJpc2luZ2x5LCB0aGUgc3dpcmxpbmcgYmxhY2sgZ29vIGlzblxcJ3Qgd2lsbGZ1bGx5IGNvb3BlcmF0aW5nLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3RyZWVfMS5wbmcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTQpLFxuICAgIGNvbG9yOiAnIzYzNjI0QycsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA2LmpwZycsXG4gICAgY2FwdGlvbjogJ0FzIGlmIHRoZSBhZXRoZXIgd2FzblxcJ3QgZW5vdWdoIG9mIGEgcHJvYmxlbSB0byB0YWNrbGUsIENoYXJsb3R0ZSBmZWVscyBoZXJzZWxmIGdldHRpbmcgd2Vha2VyIGJ5IHRoZSBtaW51dGUgYW5kIHRoZW4gQXVkcmV5IHN0YXJ0cyB0byBsb3NlIGhlciBleWVzaWdodC4gVGhleSBsb29rIGF0IHRoZWlyIHdyaXN0cyBhbmQgbm90aWNlIHRoYXQgdGhlIFJvbWFuIG51bWJlciBwcm9ibGVtIGhhcyBub3cgYWZmZWN0ZWQgdGhlbSB0b28sIHRoZSBudW1iZXJzIElJIGZvciBBdWRyZXkgYW5kIFZJSUkgZm9yIENoYXJsb3R0ZS4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDcuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd0cmVlXzIucG5nJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDE0KSxcbiAgICBjb2xvcjogJyM0QTUwNEUnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNy5qcGcnLFxuICAgIGNhcHRpb246ICdJbiBOb3J0aCBDYXJvbGluYSwgRHVrZSBhbmQgU2V0aCBzaXQgd2l0aCBhIGxvY2FsIG1hbiB3aG8gY2xhaW1zIHRvIGJlIGFibGUgdG8gcmVtb3ZlIHRoZSBcImJsYWNrIHRhclwiIGZyb20gRHVrZVxcJ3Mgc291bC4gQWZ0ZXIgYW4gZWxhYm9yYXRlIHBlcmZvcm1hbmNlLCBEdWtlIHJlYWxpemVzIHRoYXQgdGhlIGd1eSBpcyBhIGZha2UuIFRoZSByYXR0bGVkIGd1eSB3aG8gZG9lc25cXCd0IHdhbnQgYW55IHRyb3VibGUgZnJvbSBEdWtlIHRlbGxzIHRoZW0gdGhhdCBXYWx0ZXIgRmFyYWR5IHdpbGwgaGF2ZSB0aGUgcmVhbCBhbnN3ZXJzIHRvIER1a2VcXCdzIHF1ZXN0aW9ucy4gV2hlbiB0aGV5IGdvIGxvb2tpbmcgZm9yIFdhbHRlciwgdGhleSBmaW5kIGhpbSDigKYgYW5kIGhpcyBoZWFkc3RvbmUgdGhhdCBoYXMgYSBmYW1pbGlhciBtYXJraW5nIG9uIGl0LCB0aGUgc3ltYm9sIGZvciBUaGUgR3VhcmQuIFdoYXQgZ2l2ZXM/IEp1c3QgYXMgRHVrZSBpcyBhYm91dCB0byBnaXZlIHVwIGhlIGdldHMgYSB2aXNpdCBmcm9tIFdhbHRlclxcJ3MgZ2hvc3Qgd2hvIHByb21pc2VzIHRvIGdpdmUgaGltIGFuc3dlcnMgdG8gYWxsIG9mIHRoZSBxdWVzdGlvbnMg4oCmdmlhIHRoZSBuZXh0IGVwaXNvZGUgb2YgY291cnNlLiBDbGlmZmhhbmdlciEnLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDguanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd0cmVlXzMucG5nJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDE0KSxcbiAgICBjb2xvcjogJyNERDlGMDAnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wOC5qcGcnLFxuICAgIGNhcHRpb246ICdBZnRlciBzb21lIHByb2RkaW5nLCBEd2lnaHQgYW5kIE5hdGhhbiBmaW5kIHRoYXQgTGFpbmV5IGdvdCBhIHZpc2l0IGZyb20gQ3JvYXRvYW4gYW5kIFwibG9zdCB0aW1lXCIuIFNoZSBkb2VzblxcJ3QgcmVtZW1iZXJpbmcgZHJhd2luZyBjYXJkcyBmb3IgYW55IG9mIHRoZW0uIE5hdGhhbiBoYXMgaGVyIGRyYXcgbmV3IGNhcmRzIGFuZCBhIGhlc2l0YW50IExhaW5leSBkb2VzLiBEd2lnaHQgaXMgZ2l2ZW4gYSBib25kYWdlIGZhdGUgYW5kIGlzIGxhdGVyIHNoYWNrbGVkIGJ5IGNoYWlucyB0byBhIGdhdGUsIENoYXJsb3R0ZSB3aWxsIGJlIHJldW5pdGVkIHdpdGggaGVyIHRydWUgbG92ZSAoaG1t4oCmKSBhbmQgQXVkcmV5IGlzIGFsaWduZWQgd2l0aCB0aGUgbW9vbi4gTm90IHBlcmZlY3QgZmF0ZXMsIGJ1dCBpdFxcJ3MgZW5vdWdoIHRvIGdldCBldmVyeW9uZSBvdXQgb2YgdGhlIHBpY2tsZXMgdGhlaXIgY3VycmVudGx5IGluLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wOS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3RyZWVfNC5wbmcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTQpLFxuICAgIGNvbG9yOiAnIzhGQzk5QicsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA5LmpwZycsXG4gICAgY2FwdGlvbjogJ1dpdGggdGhlaXIgc3RyZW5ndGggcmVnYWluZWQsIEF1ZHJleSBhbmQgQ2hhcmxvdHRlIGFyZSBhYmxlIHRvIGNyZWF0ZSB0aGUgYWV0aGVyIGNvcmUgdGhleSBuZWVkLiBDaGFybG90dGUgaW5zdHJ1Y3RzIEF1ZHJleSB0byBnbyBhbmQgaGlkZSBpdCBzb21lIHBsYWNlIHNhZmUuIEluIHRoZSBpbnRlcmltLCBDaGFybG90dGUga2lzc2VzIER3aWdodCBnb29kYnllIGFuZCBnaXZlcyBoaW0gdGhlIHJpbmcgc2hlIG9uY2UgdXNlZCB0byBzbGlwIGludG8gVGhlIFZvaWQuIExhdGVyLCB3aXRoIGhlciBtb29uIGFsaWdubWVudCBjYXVzaW5nIEF1ZHJleSB0byBkaXNhcHBlYXIgYW5kIER3aWdodCBzdGlsbCBzaGFja2xlZCwgTGFpbmV5IHB1bGxzIGFub3RoZXIgY2FyZCBmb3IgdGhlIGVudGlyZSBncm91cCwgYSBqdWRnbWVudCBjYXJkLCB3aGljaCBzaGUgcmVhZHMgdG8gbWVhbiB0aGF0IGFzIGFsb25nIGFzIHRoZWlyIGludGVudGlvbnMgYXJlIHB1cmUgdGhleSBjYW4gYWxsIG92ZXJjb21lIGFueSBvYnN0YWNsZXMuIFRoaXMgaXMgZ3JlYXQgbmV3cyBmb3IgZXZlcnlvbmUgZXhjZXB0Li4uJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzEwLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAndHJlZV81LnBuZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxNCksXG4gICAgY29sb3I6ICcjQkZDOUEyJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMTAuanBnJyxcbiAgICBjYXB0aW9uOiAnQ2hhcmxvdHRlLiBDcm9hdG9hbiBwYXlzIGhlciBhIHZpc2l0IGluIGhlciBhcGFydG1lbnQgdG8gdGVsbCBoZXIgdGhhdCBoZVxcJ3MgcGlzc2VkIHRoYXQgc2hlXFwncyBcIm9uZSBvZiB0aGVtIG5vd1wiIGFuZCB0aGF0IHNoZSBjaG9zZSBBdWRyZXkgb3ZlciBNYXJhLiBDcm9hdG9hbiB3YXN0ZXMgbm8gdGltZSBpbiBraWxsaW5nIENoYXJsb3R0ZSBhbmQgc2hlIGNsaW5ncyB0byBsaWZlIGZvciBqdXN0IGVub3VnaCB0aW1lIHRvIGJlIGZvdW5kIGJ5IEF1ZHJleSBzbyBzaGUgY2FuIGdpdmUgaGVyIHRoZSBtb3N0IHNob2NraW5nIG5ld3Mgb2YgdGhlIHNlYXNvbjogQ3JvYXRvYW4gaXMgQXVkcmV5XFwncyBmYXRoZXIgYW5kIGhlXFwncyBnb3QgXCJwbGFuc1wiIGZvciBoZXIhJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zMDVfZTA1MTNfMDFfQ0NfMTkyMHgxMDgwLmpwZycsXG4gICAgaWQ6ICd2aWRlb19fMTIzJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDE0KSxcbiAgICBjb2xvcjogJyNCRkM5QTInLFxuICAgIHRpdGxlOiAnczA1X2UwNTEzXzAxX0NDXzE5MjB4MTA4MCcsXG4gICAgZGVzY3JpcHRpb246ICdOb3cgdGhhdCBEci4gQ3Jvc3MgaGFzIHJldmVhbGVkIGhlciB0cnVlIGlkZW50aXR5LCBldmVyeW9uZSBoYXMgbG90cyBvZiBmZWVsaW5ncy4gRHdpZ2h0IGNhblxcJ3QgZ2V0IG92ZXIgZmVlbGluZyBsaWtlIHNoZSBkdXBlZCBoaW0sIEF1ZHJleSB0aGlua3MgRHIuIENyb3NzIG11c3QgY2FyZSBtb3JlIGFib3V0IE1hcmEgdGhhbiBzaGUgZG9lcyBhYm91dCBoZXIgYW5kIE5hdGhhbiBpcyBoYXBweSB0aGF0IHRoZXJlIGlzIHNvbWVvbmUgZWxzZSBpbiB0b3duIHdobyBoZSBjYW4gZmVlbC4nLFxuICAgIHR5cGU6ICd2aWRlbycsXG4gICAgcGxheWVyOiAnQnJhbmQgVk9EIFBsYXllcicsXG4gICAgZXBpc29kZU51bWJlcjogJzEwJyxcbiAgICBrZXl3b3JkczogJ1RoZSBFeHBhbmNlLCBTYWx2YWdlLCBNaWxsZXIsIEp1bGllIE1hbywgSG9sZGVuLCBUcmFpbGVyJyxcblxuICAgIGFkZGVkQnlVc2VySWQ6IDM0NDg3MjMsXG4gICAgYXV0aG9yOiAnSmFzb24gTG9uZycsXG4gICAgZXhwaXJhdGlvbkRhdGU6ICcyMDE1LTAzLTIzIDEwOjU3OjA0JyxcbiAgICBndWlkOiAnMEQ2NjBCRDYtMDk2OC00RjcyLTdBQkMtNDcyMTU3REZBQ0FCJyxcbiAgICBsaW5rOiAnY2Fub25pY2FsdXJsNzBmYTYyZmM2YicsXG4gICAgbGlua1VybDogJ2h0dHA6Ly9wcm9kLnB1Ymxpc2hlcjcuY29tL2ZpbGUvNzgwNidcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzA2LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDYucG5nJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE0KSxcbiAgICBjb2xvcjogJyNCRkM5QTInLFxuICAgIHRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDYuanBnJyxcbiAgICBjYXB0aW9uOiAnQWxlaXN0ZXIgY29udGludWVzIGhpcyBjaGFybWluZyBjb3JydXB0aW9uIG9mIFNhdmFubmFoLCB0ZWxsaW5nIGhlciBzaGVcXCdzIGtlcHQgbG9ja2VkIGluIGhlciByb29tIHRvIGtlZXAgaGVyIHNhZmUgZnJvbSBoZXIgbmV3IHdlcmV3b2xmIG5laWdoYm9yIGFuZCBlbmNvdXJhZ2luZyBoZXIgdG8gdXNlIGhlciBsZWZ0IGhhbmQgd2hlbiB3aWVsZGluZyBoZXIgYWJpbGl0aWVzLiBTYXZhbm5haFxcJ3MgZ2V0dGluZyBtb3JlIHBvd2VyZnVsIGV2ZXJ5IGRheS4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdCaXR0ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfS8qLFxuICB7XG4gIHVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzA3LmpwZycsXG4gIGZvY2FsUG9pbnQ6IHtcbiAgbGVmdDogMC41LFxuICB0b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDcucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDcuanBnJyxcbmNhcHRpb246ICdNZWFud2hpbGUsIExvZ2FuIGhhcyBpbmZpbHRyYXRlZCB0aGUgY29tcG91bmQgYW5kIGZpbmRzIGhpcyBiZWxvdmVkIFJhY2hlbC4gSGUgbWFuYWdlcyB0byBmcmVlIGhlciAuLi4gYnV0IGhvdyBmYXIgd2lsbCB0aGV5IGdldD8nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzE3LmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTcucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTcuanBnJyxcbmNhcHRpb246ICdFbGVuYSB3YWtlcyB1cCB0byBmaW5kIGhlcnNlbGYgaW4gYSBuZXcgY2VsbCAuLi4nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzE4LmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTgucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTguanBnJyxcbmNhcHRpb246ICcuLi4gYW5kIFJpY2hhcmQsIHRoZSBtdXR0IHNoZSBpbnRlcnJvZ2F0ZWQgaW4gRXBpc29kZSAxLCBpbiBhbm90aGVyLiBSaWNoYXJkIGlzIGVucmFnZWQgdGhhdCBFbGVuYSBnYXZlIGhpbSB1cCB0byB0aGVzZSBcInNhZGlzdGljIGJhc3RhcmRzXCIgYW5kIGFsbCB0b28gd2lsbGluZyB0byBlbmdhZ2UgaW4gU29uZHJhXFwncyBleHBlcmltZW50IHRvIFwib2JzZXJ2ZSBjb21iYXRcIjogaW4gdGhlb3J5LCBFbGVuYSB3aWxsIGhhdmUgdG8gdHVybiBpbnRvIGEgd29sZiB0byBkZWZlbmQgaGVyc2VsZiBhZ2FpbnN0IFJpY2hhcmRcXCdzIGF0dGFjay4nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzIxLmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjEucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjEuanBnJyxcbmNhcHRpb246ICdPbiBoaWdoZXIgZ3JvdW5kLCBSYWNoZWwgYW5kIExvZ2FuIGFyZSBtYWtpbmcgYSBydW4gZm9yIGl0LCB0aG91Z2ggdGhlIHN5bWJvbCBvbiBSYWNoZWxcXCdzIG5lY2sgc3RhcnRzIHRvIHNtb2tlIC4uLicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCaXR0ZW4nLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjIuanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yMi5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNCksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yMi5qcGcnLFxuY2FwdGlvbjogJy4uLiB3aGljaCBhbHNvIHNsb3dzIGRvd24gRWxlbmEsIGFmdGVyIFJpY2hhcmQtd29sZiBzdWZmZXJzIHRoZSBzYW1lIGJsb29keSBmYXRlIGFzIE5hdGUgUGFya2VyIGRpZCBpbiBFcGlzb2RlIDEuIFJhY2hlbCwgRWxlbmEgYW5kIExvZ2FuIGFyZSByZS1jYXB0dXJlZC4nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzI1LmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjUucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjUuanBnJyxcbmNhcHRpb246ICdFbGVuYSBnaXZlcyBpbiwgYW5kIGEgc2hvY2tlZCBSYWNoZWwgbGVhcm5zIGEgbGl0dGxlIHNvbWV0aGluZyBuZXcgYWJvdXQgaGVyIG9sZCBmcmllbmQuJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JpdHRlbicsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CbGluZHNwb3RfMDdfTlVQXzE3MDMxN18wMzA4LmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQmxpbmRzcG90XzA3X05VUF8xNzAzMTdfMDMwOC5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNiksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCbGluZHNwb3RfMDdfTlVQXzE3MDMxN18wMzA4LmpwZycsXG5jYXB0aW9uOiAnQkxJTkRTUE9UIC0tIFwiQm9uZSBNYXkgUm90XCIgRXBpc29kZSAxMDQgLS0gUGljdHVyZWQ6IChsLXIpIEphaW1pZSBBbGV4YW5kZXIgYXMgSmFuZSBEb2UsIFN1bGxpdmFuIFN0YXBsZXRvbiBhcyBLdXJ0IFdlbGxlciAtLSAoUGhvdG8gYnk6IENocmlzdG9waGVyIFNhdW5kZXJzL05CQyknLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQmxpbmRzcG90JyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JsaW5kc3BvdF8wOF9OVVBfMTcwNTAzXzAyODMuanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCbGluZHNwb3RfMDhfTlVQXzE3MDUwM18wMjgzLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE2KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JsaW5kc3BvdF8wOF9OVVBfMTcwNTAzXzAyODMuanBnJyxcbmNhcHRpb246ICdCTElORFNQT1QgLS0gXCJCb25lIE1heSBSb3RcIiBFcGlzb2RlIDEwNCAtLSBQaWN0dXJlZDogSmFpbWllIEFsZXhhbmRlciBhcyBKYW5lIERvZSAtLSAoUGhvdG8gYnk6IEdpb3Zhbm5pIFJ1Zmluby9OQkMpJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JsaW5kc3BvdCcsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CbGluZHNwb3RfMTVfTlVQXzE3MDUwM18wMjAzLmpwZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnQmxpbmRzcG90XzE1X05VUF8xNzA1MDNfMDIwMy5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNiksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCbGluZHNwb3RfMTVfTlVQXzE3MDUwM18wMjAzLmpwZycsXG5jYXB0aW9uOiAnQkxJTkRTUE9UIC0tIFwiQm9uZSBNYXkgUm90XCIgRXBpc29kZSAxMDQgLS0gUGljdHVyZWQ6IEphaW1pZSBBbGV4YW5kZXIgYXMgSmFuZSBEb2UgLS0gKFBob3RvIGJ5OiBHaW92YW5uaSBSdWZpbm8vTkJDKScsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCbGluZHNwb3QnLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjIwLjE0X3BtLnBuZycsXG5mb2NhbFBvaW50OiB7XG5sZWZ0OiAwLjUsXG50b3A6IDAuNVxufSxcbmlkOiAnc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjIwLjE0X3BtLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE2KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4yMC4xNF9wbS5wbmcnLFxuY2FwdGlvbjogJ+KAnE1vbmRheXMgZ290IG1lIGxpa2XigKbigJ0gLSBAamltbXlmYWxsb24nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnVGhlIFRvbmlnaHQgU2hvdycsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9zY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMTkuMTlfcG0ucG5nJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdzY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMTkuMTlfcG0ucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTYpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjE5LjE5X3BtLnBuZycsXG5jYXB0aW9uOiAn4oCcVG9uaWdodCBJIHdhcyB0aGUgbXVzaWNhbCBndWVzdCBvbiBUaGUgVG9uaWdodCBTaG93IFdpdGggSmltbXkgRmFsbG9uLiBNeSBmaXJzdCB0aW1lIG9uIHRoZSBzaG93IEkgd2FzIDE0IHllYXJzIG9sZCBhbmQgbmV2ZXIgdGhvdWdodCBJXFwnZCBiZSBiYWNrIHRvIHBlcmZvcm0gbXkgZmlyc3Qgc2luZ2xlLiBMb3ZlIHlvdSBsb25nIHRpbWUgSmltbXkhIFRoYW5rcyBmb3IgaGF2aW5nIG1lLiA6KSBQUyBJIG1ldCB0aGUgbGVnZW5kYXJ5IExhZHkgR2FnYSBhbmQgYW0gc28gaW5zcGlyZWQgYnkgaGVyIHdvcmRzIG9mIHdpc2RvbS4gI0hBSVpvbkZBTExPTiAjTG92ZU15c2VsZuKAnSAtIEBoYWlsZWVzdGVpbmZlbGQnLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnVGhlIFRvbmlnaHQgU2hvdycsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9zY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMjAuMTVfcG0ucG5nJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdzY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMjAuMTVfcG0ucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTYpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjIwLjE1X3BtLnBuZycsXG5jYXB0aW9uOiAn4oCcTW9uZGF5cyBnb3QgbWUgbGlrZeKApuKAnSAtIEBqaW1teWZhbGxvbicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdUaGUgVG9uaWdodCBTaG93JyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSovXG5dO1xuZnVuY3Rpb24gY3JlYXRlQXNzZXRMaWJyYXJ5RmlsZShmaWxlRGF0YSkge1xuICAvL0hlbHBlclxuICBmdW5jdGlvbiBmaWxlVHlwZUVsZW1lbnQoZmlsZURhdGEpIHtcbiAgICBzd2l0Y2ggKGZpbGVEYXRhLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2ltYWdlJzpcbiAgICAgIHJldHVybiAkKCc8ZGl2PjxpIGNsYXNzPVwiZmEgZmEtY2FtZXJhXCI+PC9pPjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190eXBlJyk7XG5cbiAgICAgIGNhc2UgJ3ZpZGVvJzpcbiAgICAgIHJldHVybiAkKCc8ZGl2PjxpIGNsYXNzPVwiZmEgZmEtdmlkZW8tY2FtZXJhXCI+PC9pPjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190eXBlJyk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdHlwZScpO1xuICAgIH1cbiAgfVxuXG4gIC8vY3JlYXRlIGJhc2ljIGVsZW1lbnRcbiAgdmFyIGZpbGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlIGZpbGUtLW1vZGFsIGZpbGVfdHlwZV9pbWcgZmlsZV92aWV3X2dyaWQnKSxcbiAgZmlsZUluZGV4ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaGlkZGVuIGZpbGVfX2lkJykudGV4dChmaWxlRGF0YS5pZCksXG5cbiAgZmlsZUltZyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2ltZycpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIGZpbGVEYXRhLnVybCArICcpJyksXG4gIGZpbGVDb250cm9scyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2NvbnRyb2xzJykuY2xpY2sodG9nZ2xlRmlsZVNlbGVjdCksXG4gIGZpbGVDaGVja21hcmsgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19jaGVja21hcmsnKS5jbGljayh0b2dnbGVGaWxlU2VsZWN0KSxcbiAgZmlsZVRpdGxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdGl0bGUnKS50ZXh0KGZpbGVEYXRhLnRpdGxlKTtcblxuICBmaWxlQ29udHJvbHMuYXBwZW5kKGZpbGVDaGVja21hcmssIGZpbGVUeXBlRWxlbWVudChmaWxlRGF0YSkpO1xuICBmaWxlSW1nLmFwcGVuZChmaWxlQ29udHJvbHMpO1xuXG4gIGZpbGUuYXBwZW5kKGZpbGVJbmRleCwgZmlsZUltZywgZmlsZVRpdGxlKTtcbiAgcmV0dXJuIGZpbGU7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUFzc2V0TGlicmFyeSgpIHtcbiAgdmFyIGFzc2V0TGlicmFyeSA9ICQoJy5hbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzJyk7XG4gIGFzc2V0TGlicmFyeS5lbXB0eSgpO1xuICBhc3NldExpYnJhcnlPYmplY3RzLmZvckVhY2goZnVuY3Rpb24oZikge1xuICAgIGFzc2V0TGlicmFyeS5wcmVwZW5kKGNyZWF0ZUFzc2V0TGlicmFyeUZpbGUoZikpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkU2VsZWN0ZWRGaWxlcygpIHtcbiAgdmFyIHNlbGVjdGVkRmlsZXMgPSAkKCcuYWwgLmZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZS5zZWxlY3RlZCcpO1xuXG4gIGlmIChzZWxlY3RlZEZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICBzZWxlY3RlZEZpbGVzLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgIHZhciBmaWxlSWQgPSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG4gICAgICBmaWxlID0gYXNzZXRMaWJyYXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuICAgICAgICByZXR1cm4gZi5pZCA9PT0gZmlsZUlkO1xuICAgICAgfSlbMF07XG4gICAgICAvL2lmICghZmlsZUJ5SWQoZmlsZUlkLCBnYWxsZXJ5T2JqZWN0cykpIHtcbiAgICAgIGdhbGxlcnlPYmplY3RzLnB1c2goe1xuICAgICAgICBmaWxlRGF0YTogZmlsZSxcbiAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICBwb3NpdGlvbjogMTAwMCxcbiAgICAgICAgY2FwdGlvbjogJycsXG4gICAgICAgIGdhbGxlcnlDYXB0aW9uOiBmYWxzZSxcbiAgICAgICAganVzdFVwbG9hZGVkOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICAvL31cblxuICAgIH0pO1xuICAgIHVwZGF0ZUdhbGxlcnkoZ2FsbGVyeU9iamVjdHMubGVuZ3RoKTtcbiAgfVxufVxuXG4vL1JlcXVpcmVkIGZpZWxkcyBjaGVja1xuZnVuY3Rpb24gY2hlY2tGaWVsZChmaWVsZCkge1xuICAgIGlmICgkKGZpZWxkKS52YWwoKSA9PT0gJycgJiYgJChmaWVsZCkuYXR0cignZGlzcGxheScpICE9PSAnbm9uZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO31cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uIG1hcmtGaWVsZEFzUmVxdWlyZWQoZmllbGQpIHtcbiAgICAkKGZpZWxkKS5hZGRDbGFzcygnZW1wdHlGaWVsZCcpO1xuICAgIGlmICgkKGZpZWxkKS5wYXJlbnQoKS5jaGlsZHJlbignLmVyck1zZycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB2YXIgbXNnID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZXJyTXNnJykudGV4dChcIlRoaXMgZmllbGQgY291bGRuJ3QgYmUgZW1wdHlcIik7XG4gICAgICAgICQoZmllbGQpLnBhcmVudCgpLmFwcGVuZChtc2cpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1hcmtGaWVsZEFzTm9ybWFsKGZpZWxkKSB7XG4gICAgJChmaWVsZCkucmVtb3ZlQ2xhc3MoJ2VtcHR5RmllbGQnKTtcbiAgICAkKGZpZWxkKS5wYXJlbnQoKS5jaGlsZHJlbignLmVyck1zZycpLnJlbW92ZSgpO1xufVxuXG5mdW5jdGlvbiBjaGVja0ZpZWxkcyhzZWxlY3Rvcikge1xuICAgIHZhciBmaWVsZHMgPSAkKHNlbGVjdG9yKS5wYXJlbnQoKS5jaGlsZHJlbignaW5wdXQnKTtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICB2YXIgZmlyc3RJbmRleCA9IC0xO1xuICAgIGZpZWxkcy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICBpZiAoY2hlY2tGaWVsZChlbCkpIHtcbiAgICAgICAgICAgIC8vbWFya0ZpZWxkQXNOb3JtYWwoZWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9tYXJrRmllbGRBc1JlcXVpcmVkKGVsKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGZpcnN0SW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgZmlyc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIGVsLmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbiQoJ2xhYmVsLnJlcXVpZXJlZCcpLnBhcmVudCgpLmNoaWxkcmVuKCdpbnB1dCcpLm9uKCdibHVyJywgZnVuY3Rpb24oZSkge1xuICAgIGlmIChjaGVja0ZpZWxkKGUudGFyZ2V0KSkge1xuICAgICAgICAvL21hcmtGaWVsZEFzTm9ybWFsKGUudGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvL21hcmtGaWVsZEFzUmVxdWlyZWQoZS50YXJnZXQpO1xuICAgIH1cbn0pO1xuXG5cbi8vRm9jYWwgcmVjdGFuZ2xlIGFuZCBwb2ludFxuZnVuY3Rpb24gYWRqdXN0UmVjdChlbCkge1xuXHR2YXIgaW1nV2lkdGggPSAkKCcjcHJldmlld0ltZycpLndpZHRoKCksXG5cdFx0aW1nSGVpZ2h0ID0gJCgnI3ByZXZpZXdJbWcnKS5oZWlnaHQoKSxcblx0XHRpbWdPZmZzZXQgPSAkKCcjcHJldmlld0ltZycpLm9mZnNldCgpLFxuXHRcdGltZ1JhdGlvID0gaW1nV2lkdGgvaW1nSGVpZ2h0LFxuXG5cdFx0ZWxIID0gZWwub3V0ZXJIZWlnaHQoKSxcblx0XHRlbFcgPSBlbC5vdXRlcldpZHRoKCksXG5cdFx0ZWxPID0gZWwub2Zmc2V0KCksXG5cdFx0ZWxSYXRpbyA9IGVsVy9lbEgsXG5cdFx0ZWxCYWNrZ3JvdW5kUG9zaXRpb24gPSBlbC5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24nKS5zcGxpdCgnICcpO1xuXG5cdGNvbnNvbGUubG9nKGVsSCwgZWxXLCBlbEJhY2tncm91bmRQb3NpdGlvbik7XG5cblx0ckhlaWdodCA9IGltZ1JhdGlvID4gZWxSYXRpbyA/IGltZ0hlaWdodCA6IGltZ1dpZHRoL2VsUmF0aW87XG5cdHJXaWR0aCA9IGltZ1JhdGlvID4gZWxSYXRpbyA/IGltZ0hlaWdodCAqIGVsUmF0aW8gOiBpbWdXaWR0aDtcblx0ck9mZnNldCA9IHtsZWZ0OiAwLCB0b3A6IDB9O1xuXG5cdGlmIChlbEJhY2tncm91bmRQb3NpdGlvbi5sZW5ndGggPT09IDIpIHtcblx0XHRpZiAoZWxCYWNrZ3JvdW5kUG9zaXRpb25bMF0uaW5kZXhPZignJScpKSB7XG5cdFx0XHR2YXIgYmdMZWZ0UGVyc2VudCA9IGVsQmFja2dyb3VuZFBvc2l0aW9uWzBdLnNsaWNlKDAsLTEpLFxuXHRcdFx0XHRiZ0xlZnRQaXhlbCA9IE1hdGgucm91bmQoaW1nV2lkdGggKiBiZ0xlZnRQZXJzZW50LzEwMCkgLSByV2lkdGgvMjtcblxuXHRcdFx0Y29uc29sZS5sb2coZWxCYWNrZ3JvdW5kUG9zaXRpb25bMF0sIGJnTGVmdFBlcnNlbnQsIGJnTGVmdFBpeGVsLCBpbWdXaWR0aCwgKGJnTGVmdFBpeGVsICsgcldpZHRoKSk7XG5cblx0XHRcdGlmICgoYmdMZWZ0UGl4ZWwpIDwgMCkge2JnTGVmdFBpeGVsID0gMDt9XG5cdFx0XHRpZiAoKGJnTGVmdFBpeGVsICsgcldpZHRoKSA+IGltZ1dpZHRoKSB7YmdMZWZ0UGl4ZWwgPSBpbWdXaWR0aCAtIHJXaWR0aDt9XG5cblx0XHRcdGNvbnNvbGUubG9nKGJnTGVmdFBpeGVsLCBpbWdXaWR0aCwgKGJnTGVmdFBpeGVsICsgcldpZHRoLzIpKTtcblxuXHRcdFx0ck9mZnNldC5sZWZ0ID0gaW1nUmF0aW8gPiBlbFJhdGlvID8gYmdMZWZ0UGl4ZWwgOiAwO1xuXHRcdH1cblx0XHRpZiAoZWxCYWNrZ3JvdW5kUG9zaXRpb25bMV0uaW5kZXhPZignJScpKSB7XG5cdFx0XHR2YXIgYmdUb3BQZXJzZW50ID0gZWxCYWNrZ3JvdW5kUG9zaXRpb25bMV0uc2xpY2UoMCwtMSksXG5cdFx0XHRcdGJnVG9wUGl4ZWwgPSBNYXRoLnJvdW5kKGltZ0hlaWdodCpiZ1RvcFBlcnNlbnQvMTAwKSAtIHJIZWlnaHQvMjtcblxuXHRcdFx0aWYgKChiZ1RvcFBpeGVsKSA8IDApIHtiZ1RvcFBpeGVsID0gMDt9XG5cdFx0XHRpZiAoKGJnVG9wUGl4ZWwgKyBySGVpZ2h0KSA+IGltZ0hlaWdodCkge2JnVG9wUGl4ZWwgPSBpbWdIZWlnaHQgLSBySGVpZ2h0O31cblxuXHRcdFx0ck9mZnNldC50b3AgPSBpbWdSYXRpbyA+IGVsUmF0aW8gPyAwIDogYmdUb3BQaXhlbDtcblx0XHR9XG5cdH1cblxuXHQkKCcuZm9jYWxSZWN0JykucmVtb3ZlQXR0cignc3R5bGUnKTtcblxuXHQkKCcuZm9jYWxSZWN0JykuY3NzKCd3aWR0aCcsIHJXaWR0aC50b1N0cmluZygpICsgJ3B4Jylcblx0XHRcdFx0XHRcdFx0ICAgLmNzcygnaGVpZ2h0JywgckhlaWdodC50b1N0cmluZygpICsgJ3B4Jylcblx0XHRcdFx0XHRcdFx0ICAgLmNzcygnbGVmdCcsIHJPZmZzZXQubGVmdC50b1N0cmluZygpICsgJ3B4Jylcblx0XHRcdFx0XHRcdFx0ICAgLmNzcygndG9wJywgck9mZnNldC50b3AudG9TdHJpbmcoKSArICdweCcpXG5cdFx0XHRcdFx0XHRcdCAgIC5kcmFnZ2FibGUoe1xuXHRcdFx0XHRcdFx0XHQgICBcdFx0YXhpczogaW1nUmF0aW8gPiBlbFJhdGlvID8gJ3gnIDogJ3knLFxuXHRcdFx0XHRcdFx0XHQgICBcdFx0c3RhcnQ6IGZ1bmN0aW9uKGUsIHVpKSB7XG5cdFx0XHRcdFx0XHRcdFx0ICAgIFx0ZWwuY3NzKCd0cmFuc2l0aW9uJywgJ25vbmUnKTtcblx0XHRcdFx0XHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRcdFx0ICAgXHRcdHN0b3A6IGZ1bmN0aW9uKGUsIHVpKSB7XG5cdFx0XHRcdFx0XHRcdCAgIFx0XHRcdGVsLmNzcygndHJhbnNpdGlvbicsICcwLjNzIGVhc2Utb3V0Jyk7XG5cdFx0XHRcdFx0XHRcdFx0ICAgICAgICBhZGp1c3RQdXJwb3NlKCQoZS50YXJnZXQpLCBlbCk7XG5cdFx0XHRcdFx0XHRcdFx0ICAgIH1cblx0XHRcdFx0XHRcdFx0ICAgXHR9KTtcblxuXHQkKCcucHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRlbC5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cblxufVxuZnVuY3Rpb24gYWRqdXN0UHVycG9zZShmb2NhbEl0ZW0sIHB1cnBvc2VJbWcpIHtcblxuXHRcdHZhciBpbWcgPSAkKCcjcHJldmlld0ltZycpLFxuXHRcdGlXaWR0aCA9IGltZy53aWR0aCgpLFxuXHRcdGlIZWlnaHQgPSBpbWcuaGVpZ2h0KCksXG5cdFx0aU9mZnNldCA9IGltZy5vZmZzZXQoKSxcblxuXHRcdHBXaWR0aCA9IGZvY2FsSXRlbS5vdXRlcldpZHRoKCksXG5cdFx0cEhlaWdodCA9IGZvY2FsSXRlbS5vdXRlckhlaWdodCgpLFxuXHRcdHBPZmZzZXQgPSBmb2NhbEl0ZW0ub2Zmc2V0KCksXG5cblx0XHRmVG9wID0gTWF0aC5yb3VuZCgocE9mZnNldC50b3AgLSBpT2Zmc2V0LnRvcCArIHBIZWlnaHQvMikqMTAwIC8gaUhlaWdodCk7XG5cdFx0ZkxlZnQgPSBNYXRoLnJvdW5kKChwT2Zmc2V0LmxlZnQgLSBpT2Zmc2V0LmxlZnQgKyBwV2lkdGgvMikgKiAxMDAgLyBpV2lkdGgpO1xuXG5cdC8vY29uc29sZS5sb2coZlRvcCwgZkxlZnQpO1xuXHRpZiAocHVycG9zZUltZykge1xuXHRcdHB1cnBvc2VJbWcuY3NzKCdiYWNrZ3JvdW5kLXBvc2l0aW9uJywgZkxlZnQudG9TdHJpbmcoKSArICclICcgKyBmVG9wLnRvU3RyaW5nKCkgKyAnJScpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdCQoJy5wdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UgLnB1cnBvc2UtaW1nJykuY3NzKCdiYWNrZ3JvdW5kLXBvc2l0aW9uJywgZkxlZnQudG9TdHJpbmcoKSArICclICcgKyBmVG9wLnRvU3RyaW5nKCkgKyAnJScpO1xuXHR9XG5cbn1cblxuJCgnI2ZvY2FsUmVjdFRvZ2dsZScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0aWYgKCQoZS50YXJnZXQpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xuXHRcdCQoJy5wciA+IC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ2ZvY2FsIGxpbmUgcmVjdCcpO1xuXHRcdCQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0fSBlbHNlIHtcblx0XHQkKCcucHIgPiAucHJldmlldycpLmFkZENsYXNzKCdmb2NhbCBsaW5lIHJlY3QnKTtcblx0XHQkKCcucHIgPiAucHJldmlldycpLnJlbW92ZUNsYXNzKCdwb2ludCcpO1xuXHRcdCQoJyNmb2NhbFBvaW50VG9nZ2xlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdCQoZS50YXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuXG5cdFx0Ly8kKCcuZm9jYWxSZWN0JykucmVzaXphYmxlKHtoYW5kbGVzOiBcImFsbFwiLCBjb250YWlubWVudDogXCIjcHJldmlld0ltZ1wifSk7XG5cdFx0YWRqdXN0UmVjdCgkKCcucHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlLWltZycpLmZpcnN0KCkpO1xuXHRcdCQoJy5mb2NhbFJlY3QnKS5kcmFnZ2FibGUoeyBjb250YWlubWVudDogXCIjcHJldmlld0ltZ1wiLCBzY3JvbGw6IGZhbHNlIH0pO1xuXG5cdFx0JCgnLnB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZS1pbWcnKS51bmJpbmQoKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRhZGp1c3RSZWN0KCQoZS50YXJnZXQpKTtcblx0XHR9KTtcblx0XHQvLyQoJy5pbWctd3JhcHBlcicpLmNzcygnbWF4LXdpZHRoJywgJzkwJScpO1xuXHRcdHNldFB1cnBvc2VQYWdpbmF0aW9uKCk7XG5cdH1cbn0pO1xuXG4vL1V0aWxpdGllc1xuXG4vL1Rocm90dGxlIFNjcm9sbCBldmVudHNcbjsoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRocm90dGxlID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgb2JqKSB7XG4gICAgICAgIG9iaiA9IG9iaiB8fCB3aW5kb3c7XG4gICAgICAgIHZhciBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHZhciBmdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAocnVubmluZykgeyByZXR1cm47IH1cbiAgICAgICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG9iai5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChuYW1lKSk7XG4gICAgICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIG9iai5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGZ1bmMpO1xuICAgIH07XG5cbiAgICAvKiBpbml0IC0geW91IGNhbiBpbml0IGFueSBldmVudCAqL1xuICAgIHRocm90dGxlIChcInNjcm9sbFwiLCBcIm9wdGltaXplZFNjcm9sbFwiKTtcbiAgICB0aHJvdHRsZSAoXCJyZXNpemVcIiwgXCJvcHRpbWl6ZWRSZXNpemVcIik7XG59KSgpO1xuXG4vL1N0aWNreSB0b3BiYXJcbmZ1bmN0aW9uIFN0aWNreVRvcGJhcigpIHtcbiAgICB0aGlzLl9pbml0KCk7XG59XG5cblN0aWNreVRvcGJhci5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5sYXN0U2Nyb2xsUG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgIHNlbGYudG9wYmFyVHJhbnNpdGlvbiA9IGZhbHNlO1xuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9wdGltaXplZFNjcm9sbFwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBzY3JvbGxQb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA1NSAmJiAhJCgnLmMtSGVhZGVyLXRpdGxlJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICQoJy5jLUhlYWRlci10aXRsZScpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDU1ICYmICQoJy5jLUhlYWRlci10aXRsZScpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAkKCcuYy1IZWFkZXItdGl0bGUnKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnYy1IZWFkZXItY29udHJvbHMtLWNlbnRlcicpKSB7XG4gICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDU1ICYmICEkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlci1jb250cm9scy0tY2VudGVyJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDU1ICYmICQoJy5jLUhlYWRlci1jb250cm9scycpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyLWNvbnRyb2xzLS1jZW50ZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnaGVhZGVyX19jb250cm9scy0tZmlsdGVyJykpIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gNTUgJiYgISQoJy5jLUhlYWRlci1jb250cm9scycpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmhlYWRlcl9fY29udHJvbHMtLWZpbHRlcicpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCA1NSAmJiAkKCcuYy1IZWFkZXItY29udHJvbHMnKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5oZWFkZXJfX2NvbnRyb2xzLS1maWx0ZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnYy1IZWFkZXItLWNvbnRyb2xzJykpIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gMTQ1ICYmICEkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlcicpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCAxNDUgJiYgJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaGVhZGVyLS1maWx0ZXInKSkge1xuICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA3MCAmJiAhJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXInKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgNzAgJiYgJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gODUgJiYgISQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDg1ICYmICQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyJykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJCgnLmxpYnJhcnlfX2hlYWRlcicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gNzAgJiYgISQoJy5saWJyYXJ5X19oZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5saWJyYXJ5X19oZWFkZXInKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgNzAgJiYgJCgnLmxpYnJhcnlfX2hlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmxpYnJhcnlfX2hlYWRlcicpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSA5MzApIHtcbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDU1ICYmICEkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDU1ICYmICQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSAxMCAmJiAhJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCAxMCAmJiAkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0pO1xufTtcblxuLy9TY3JvbGxTcHlOYXZcbjsoZnVuY3Rpb24od2luZG93KSB7XG4gICAgLy8ndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBTY3JvbGxTcHlOYXYoZWwpIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuXG4gICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICAgICAgdGhpcy5faW5pdEV2ZW50cygpO1xuICAgIH1cblxuICAgIFNjcm9sbFNweU5hdi5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLmVsLmRhdGFzZXQudG9wT2Zmc2V0XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdLnNsaWNlLmNhbGwodGhpcy5lbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKSkubWFwKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICB2YXIgaXRlbUlkID0gZWwuZGF0YXNldC5ocmVmO1xuICAgICAgICAgICAgcmV0dXJuIHtuYXZJdGVtOiBlbCxcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaXRlbUlkKX07XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBTY3JvbGxTcHlOYXYucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9wdGltaXplZFNjcm9sbFwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoIXNlbGYuc2Nyb2xsaW5nVG9JdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1haW5JdGVtcyA9IHNlbGYuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsQkNSID0gaXRlbS5pdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxCQ1IudG9wID4gc2VsZi5vcHRpb25zLm9mZnNldCAmJiBlbEJDUi50b3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1haW5JdGVtcy5sZW5ndGggPiAwICYmICghc2VsZi5tYWluSXRlbSB8fCBzZWxmLm1haW5JdGVtICE9PSBtYWluSXRlbXNbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubWFpbkl0ZW0gPSBtYWluSXRlbXNbMF07XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpLm5hdkl0ZW0uY2xhc3NMaXN0LnJlbW92ZShzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tYWluSXRlbS5uYXZJdGVtLmNsYXNzTGlzdC5hZGQoc2VsZi5vcHRpb25zLmFjdGl2ZUNsYXNzIHx8ICdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBpdGVtLm5hdkl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhyZWYgPSAnIycgKyBlLnRhcmdldC5kYXRhc2V0LmhyZWY7XG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldFRvcCA9IGhyZWYgPT09IFwiI1wiID8gMCA6ICQoaHJlZikub2Zmc2V0KCkudG9wIC0gc2VsZi5vcHRpb25zLm9mZnNldCAtIDMwO1xuICAgICAgICAgICAgICAgIHNlbGYuc2Nyb2xsaW5nVG9JdGVtID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZWxmLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICAgICAgICBpLml0ZW0uY2xhc3NMaXN0LnJlbW92ZShzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICBpLm5hdkl0ZW0uY2xhc3NMaXN0LnJlbW92ZShzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKHNlbGYub3B0aW9ucy5hY3RpdmVDbGFzcyB8fCAnaXMtYWN0aXZlJyk7XG5cblxuICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogb2Zmc2V0VG9wXG4gICAgICAgICAgICAgICAgfSwgMzAwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zY3JvbGxpbmdUb0l0ZW0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgJChocmVmKS5hZGRDbGFzcyhzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRTY3JvbGxTcHlOYXYoKSB7XG4gICAgICAgIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXNjcm9sbFNweU5hdicpKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBuZXcgU2Nyb2xsU3B5TmF2KGVsKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGluaXRTY3JvbGxTcHlOYXYoKTtcblxufSkod2luZG93KTtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbi8vIENvbnRyb2xzXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuLy90ZXh0ZmllbGRzXG4vLzsoZnVuY3Rpb24od2luZG93KSB7XG4vLyAgICAndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFRleHRmaWVsZChlbCwgb3B0aW9ucykge1xuICB0aGlzLmVsID0gZWw7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgdGhpcy5faW5pdCgpO1xuICB0aGlzLl9pbml0RXZlbnRzKCk7XG59XG5cblRleHRmaWVsZC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLmVsLnBsYWNlaG9sZGVyID0gJyc7XG5cbiAgdGhpcy5maWVsZFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy5maWVsZFdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaW5wdXRfX3dyYXBwZXInKTtcbiAgdGhpcy5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmZpZWxkV3JhcHBlciwgdGhpcy5lbCk7XG4gIHRoaXMuZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2pzLWlucHV0Jyk7XG4gIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnaW5wdXRfX2ZpZWxkJyk7XG5cbiAgaWYgKHRoaXMuZWwudmFsdWUgIT09ICcnKSB7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gICAgdGhpcy5fdG9nZ2xlQWRkYWJsZSgpO1xuICB9XG5cbiAgaWYgKHRoaXMuZWwudHlwZSA9PT0gJ3RleHRhcmVhJykge3RoaXMuX2F1dG9zaXplKCk7fVxuICBpZiAodGhpcy5vcHRpb25zLmF1dG9jb21wbGV0ZSkge3RoaXMuZWwuY2xhc3NMaXN0LmFkZCgnaGFzLWF1dG9jb21wbGV0ZScpO31cbiAgaWYgKHRoaXMuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1kYXRlcGlja2VyJykpIHtcbiAgICB2YXIgaWQgPSAnZGF0ZVBpY2tlcicgKyBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqMTAwMDApO1xuICAgIHRoaXMuZWwuaWQgPSBpZDtcbiAgICAkKHRoaXMuZWwpLmRhdGVwaWNrZXIoe1xuICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcjJyArIGlkKS5hZGRDbGFzcygnaW5wdXRfc3RhdGVfbm90LWVtcHR5IGpzLWhhc1ZhbHVlJyk7XG4gICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VNb250aDogdHJ1ZSxcbiAgICAgIGNoYW5nZVllYXI6IHRydWVcbiAgICAgIC8qbW9udGhOYW1lc1Nob3J0OiBbIFwiSmFudWFyXCIsIFwiRmVicnVhclwiLCBcIk1hcnRzXCIsIFwiQXByaWxcIiwgXCJNYWpcIiwgXCJKdW5pXCIsIFwiSnVsaVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9rdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCIgXSovXG4gICAgfSk7XG4gIH1cbiAgaWYgKHRoaXMuZWwuaWQgPT09ICdzdGFydERhdGUnKSB7XG4gICAgJCh0aGlzLmVsKS5kYXRlcGlja2VyKHtcbiAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbihkYXRlU3RyaW5nLCBkYXRlcGlja2VyKSB7XG4gICAgICAgICQoJyNzdGFydERhdGUnKS5hZGRDbGFzcygnaW5wdXRfc3RhdGVfbm90LWVtcHR5IGpzLWhhc1ZhbHVlJyk7XG4gICAgICAgIHN0YXJ0RGF0ZSA9IGRhdGVTdHJpbmc7XG4gICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VNb250aDogdHJ1ZSxcbiAgICAgIGNoYW5nZVllYXI6IHRydWVcbiAgICAgIC8qbW9udGhOYW1lc1Nob3J0OiBbIFwiSmFudWFyXCIsIFwiRmVicnVhclwiLCBcIk1hcnRzXCIsIFwiQXByaWxcIiwgXCJNYWpcIiwgXCJKdW5pXCIsIFwiSnVsaVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9rdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCIgXSovXG4gICAgfSk7XG4gIH1cbiAgaWYgKHRoaXMuZWwuaWQgPT09ICdlbmREYXRlJykge1xuICAgICQodGhpcy5lbCkuZGF0ZXBpY2tlcih7XG4gICAgICBvblNlbGVjdDogZnVuY3Rpb24oZGF0ZVN0cmluZywgZGF0ZXBpY2tlcikge1xuICAgICAgICAkKCcjZW5kRGF0ZScpLmFkZENsYXNzKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHkganMtaGFzVmFsdWUnKTtcbiAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgfSxcbiAgICAgIGJlZm9yZVNob3c6IGZ1bmN0aW9uKGVsZW1lbnQsIGRhdGVwaWNrZXIpIHtcbiAgICAgICAgJCgnI2VuZERhdGUnKS5kYXRlcGlja2VyKCdvcHRpb24nLCAnZGVmYXVsdERhdGUnLCBzdGFydERhdGUpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZU1vbnRoOiB0cnVlLFxuICAgICAgY2hhbmdlWWVhcjogdHJ1ZVxuICAgICAgLyptb250aE5hbWVzU2hvcnQ6IFsgXCJKYW51YXJcIiwgXCJGZWJydWFyXCIsIFwiTWFydHNcIiwgXCJBcHJpbFwiLCBcIk1halwiLCBcIkp1bmlcIiwgXCJKdWxpXCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2t0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIiBdKi9cbiAgICB9KTtcbiAgfVxuXG4gIGlmICh0aGlzLm9wdGlvbnMubGFiZWwpIHtcbiAgICB0aGlzLmxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICB0aGlzLmxhYmVsLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5sYWJlbDtcbiAgICB0aGlzLmxhYmVsLmNsYXNzTGlzdC5hZGQoJ2lucHV0X19sYWJlbCcpO1xuICAgIHRoaXMubGFiZWwuZm9yID0gdGhpcy5lbC5pZDtcbiAgICB0aGlzLmZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcbiAgfVxuXG4gIHRoaXMuYmxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsgLy9Vc2UgYXMgYSBoZWxwZXIgdG8gbWFrZSBibGluayBhbmltYXRpb24gb24gZm9jdXMgZmllbGRcbiAgdGhpcy5ibGluay5jbGFzc0xpc3QuYWRkKCdpbnB1dF9fYmxpbmsnKTtcbiAgdGhpcy5maWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5ibGluayk7XG5cbiAgaWYgKHRoaXMub3B0aW9ucy5oZWxwVGV4dCkge1xuICAgIHRoaXMuaGVscFRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmhlbHBUZXh0LmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5oZWxwVGV4dDtcbiAgICB0aGlzLmhlbHBUZXh0LmNsYXNzTGlzdC5hZGQoJ2lucHV0X19oZWxwLXRleHQnKTtcbiAgICB0aGlzLmZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmhlbHBUZXh0KTtcbiAgfVxuICBpZiAodGhpcy5vcHRpb25zLmVyck1zZykge1xuICAgIHRoaXMuZXJyTXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5lcnJNc2cuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmVyck1zZztcbiAgICB0aGlzLmVyck1zZy5jbGFzc0xpc3QuYWRkKCdpbnB1dF9fZXJyLW1zZycpO1xuICAgIHRoaXMuZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZXJyTXNnKTtcbiAgfVxufTtcblxuVGV4dGZpZWxkLnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIC8vQ2hlY2sgaWYgZmllbGQgaXMgZW1wdHkgb3Igbm90IGFuZCBjaGFuZ2UgY2xhc3MgYWNjb3JkaW5nbHlcbiAgJCh0aGlzLmVsKS5vbignYmx1cicsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dF9zdGF0ZV9lcnInKTtcbiAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfVxuICAgIGUudGFyZ2V0LnBsYWNlaG9sZGVyID0gJyc7XG4gICAgaWYgKGUudGFyZ2V0LnJlcXVpcmVkICYmICFlLnRhcmdldC52YWx1ZSkge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnaW5wdXRfc3RhdGVfZXJyJyk7XG4gICAgfVxuICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge3NlbGYubGlzdC5yZW1vdmUoKTt9LCAxNTApO1xuICAgIH1cbiAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuICB9KTtcblxuICAvL09uIGZvY3VzIGV2ZW50XG4gICQodGhpcy5lbCkub24oJ2ZvY3VzJywgZnVuY3Rpb24oZSkge1xuICAgIGlmIChzZWxmLm9wdGlvbnMucGxhY2Vob2xkZXIpIHtcbiAgICAgIGUudGFyZ2V0LnBsYWNlaG9sZGVyID0gc2VsZi5vcHRpb25zLnBsYWNlaG9sZGVyO1xuICAgIH1cbiAgICBpZiAoc2VsZi5vcHRpb25zLmF1dG9jb21wbGV0ZSkge1xuICAgICAgc2VsZi5saXN0ID0gcmVuZGVyQXV0b2NvbXBsZXRlTGlzdChzZWxmLm9wdGlvbnMuYXV0b2NvbXBsZXRlLCBoYW5kbGVBdXRvY29tcGxldGVJdGVtQ2xpY2spO1xuICAgICAgcGxhY2VBdXRvY29tcGxldGVMaXN0KHNlbGYubGlzdCwgJChzZWxmLmZpZWxkV3JhcHBlcikpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy9PbiBjaGFuZ2UgZXZlbnRcbiAgJCh0aGlzLmVsKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0X3N0YXRlX2VycicpO1xuICAgIGlmIChlLnRhcmdldC52YWx1ZSAhPT0gJycpIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICB9XG4gICAgZS50YXJnZXQucGxhY2Vob2xkZXIgPSAnJztcbiAgICBpZiAoc2VsZi5vcHRpb25zLm9uQ2hhbmdlKSB7XG4gICAgICBzZWxmLm9wdGlvbnMub25DaGFuZ2UoZSk7XG4gICAgfVxuICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gIH0pO1xuXG4gIC8vT24gaW5wdXQgZXZlbnRcbiAgJChzZWxmLmVsKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKSB7XG4gICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5wdXRfc3RhdGVfZXJyJyk7XG4gICAgaWYgKGUudGFyZ2V0LnZhbHVlICE9PSAnJykge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIH1cbiAgICBlLnRhcmdldC5wbGFjZWhvbGRlciA9ICcnO1xuICAgIGlmIChzZWxmLm9wdGlvbnMub25JbnB1dCkge1xuICAgICAgc2VsZi5vcHRpb25zLm9uSW5wdXQoZSk7XG4gICAgfVxuICAgIGlmIChzZWxmLm9wdGlvbnMuYXV0b2NvbXBsZXRlKSB7XG4gICAgICB2YXIgZGF0YSA9IHNlbGYub3B0aW9ucy5hdXRvY29tcGxldGUuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWxmLmVsLnZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgfSlcbiAgICAgIHVwZGF0ZUF1dG9jb21wbGV0ZUxpc3Qoc2VsZi5saXN0LCBkYXRhLCBoYW5kbGVBdXRvY29tcGxldGVJdGVtQ2xpY2spO1xuICAgIH1cbiAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuICB9KTtcbiAgJChzZWxmLmVsKS5vbigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUtleURvd24oZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdmFyIGluZGV4LCBsZW5ndGg7XG4gICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgIGNhc2UgMTM6XG4gICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5maW5kKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGVjdEl0ZW0oc2VsZi5saXN0LmZpbmQoJ2lzLWhpZ2h0bGlnaHRlZCcpLmdldCgwKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDI3OlxuICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICBicmVhaztcblxuICAgICAgY2FzZSAzODpcbiAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmZpbmQoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcblxuICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggLSAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICBpZiAoaW5kZXggPCBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCA8IDUwKSB7XG4gICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA+IDAgPyAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgOiAwXG4gICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxUb3A6IDBcbiAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgICAgY2FzZSA0MDpcbiAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmZpbmQoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICBpZiAoaW5kZXggPCBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5oZWlnaHQoKSA8ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLm91dGVySGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKVxuICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4ID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4KS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4KS5oZWlnaHQoKVxuICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlckF1dG9jb21wbGV0ZUxpc3QoZGF0YSwgY2FsbGJhY2spIHtcbiAgICB2YXIgbGlzdCA9ICQoJzx1bCAvPicpLmFkZENsYXNzKCdhdXRvY29tcGxldGUnKVxuXG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIGxpc3QuYXBwZW5kKHJlbmRlckF1dG9jb21wbGV0ZUl0ZW0oaXRlbSwgY2FsbGJhY2spKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuICBmdW5jdGlvbiBwbGFjZUF1dG9jb21wbGV0ZUxpc3QobGlzdCwgcGFyZW50KSB7XG4gICAgcGFyZW50LmFwcGVuZChsaXN0KTtcblxuICAgIHZhciBwYXJlbnRCQ1IgPSBwYXJlbnQuZ2V0KDApLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgIHBhcmVudE9mZnNldFRvcCA9IHBhcmVudC5nZXQoMCkub2Zmc2V0VG9wLFxuICAgIGxpc3RCQ1IgPSBsaXN0LmdldCgwKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcblxuICAgIGhlaWdodENoZWNrID0gd2luZG93LmlubmVySGVpZ2h0IC0gcGFyZW50QkNSLnRvcCAtIHBhcmVudEJDUi5oZWlnaHQgLSBsaXN0QkNSLmhlaWdodDtcblxuICAgIGxpc3QuZ2V0KDApLnN0eWxlLnRvcCA9IGhlaWdodENoZWNrID4gMCA/IHBhcmVudE9mZnNldFRvcCArIHBhcmVudEJDUi5oZWlnaHQgKyA1ICsgJ3B4JyA6IHBhcmVudE9mZnNldFRvcCAtIGxpc3RCQ1IuaGVpZ2h0IC0gMTAgKyAncHgnO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZUF1dG9jb21wbGV0ZUxpc3QgKGxpc3QsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgbGlzdC5lbXB0eSgpO1xuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICBsaXN0LmFwcGVuZChyZW5kZXJBdXRvY29tcGxldGVJdGVtKGl0ZW0sIGNhbGxiYWNrKSk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gcmVuZGVyQXV0b2NvbXBsZXRlSXRlbShpdGVtLCBjYWxsYmFjaykge1xuICAgIHJldHVybiAkKCc8bGkgLz4nKS5hZGRDbGFzcygnYXV0b2NvbXBsZXRlX19pdGVtJykuY2xpY2soY2FsbGJhY2spLm9uKCdtb3VzZW92ZXInLCBoYW5kbGVJdGVtTW91c2VPdmVyKS50ZXh0KGl0ZW0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQXV0b2NvbXBsZXRlSXRlbUNsaWNrKGUpIHtcbiAgICBzZWxlY3RJdGVtKGUudGFyZ2V0KTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVJdGVtTW91c2VPdmVyKGUpIHtcbiAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgfVxuICBmdW5jdGlvbiBzZWxlY3RJdGVtKGl0ZW0pIHtcbiAgICBzZWxmLmVsLnZhbHVlID0gaXRlbS5pbm5lckhUTUw7XG4gICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICBjbG9zZUF1dG9jb21wbGV0ZSgpO1xuICB9XG4gIGZ1bmN0aW9uIGNsb3NlQXV0b2NvbXBsZXRlKCkge1xuICAgIHNlbGYubGlzdC5yZW1vdmUoKTtcbiAgfVxufTtcblxuLy9BdXRvcmVzaXplIHRleHRhcmVhXG5UZXh0ZmllbGQucHJvdG90eXBlLl9hdXRvc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5lbC52YWx1ZSA9PT0gJycpIHt0aGlzLmVsLnJvd3MgPSAxO31cbiAgZWxzZSB7XG4gICAgdmFyIHdpZHRoID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCxcbiAgICBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpLFxuICAgIHRleHRXaWR0aCA9IHRoaXMuZWwudmFsdWUubGVuZ3RoICogNyxcbiAgICByZSA9IC9bXFxuXFxyXS9pZztcbiAgICBsaW5lQnJha2VzID0gdGhpcy5lbC52YWx1ZS5tYXRjaChyZSk7XG4gICAgcm93ID0gTWF0aC5jZWlsKHRleHRXaWR0aCAvIHdpZHRoKTtcblxuICAgIHJvdyA9IHJvdyA8PSAwID8gMSA6IHJvdztcbiAgICByb3cgPSB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0ICYmIHJvdyA+IHRoaXMub3B0aW9ucy5tYXhIZWlnaHQgPyB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0IDogcm93O1xuXG4gICAgaWYgKGxpbmVCcmFrZXMpIHtcbiAgICAgIHJvdyArPSBsaW5lQnJha2VzLmxlbmd0aDtcbiAgICB9XG5cbiAgICB0aGlzLmVsLnJvd3MgPSByb3c7XG4gIH1cbn07XG5cblRleHRmaWVsZC5wcm90b3R5cGUuX3RvZ2dsZUFkZGFibGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykubGVuZ3RoID4gMCkge1xuICAgIGNvbnNvbGUubG9nKCQodGhpcy5lbCkuaGFzQ2xhc3MoJ2pzLWhhc1ZhbHVlJykpO1xuICAgIGlmICgkKHRoaXMuZWwpLmhhc0NsYXNzKCdqcy1oYXNWYWx1ZScpKSB7XG4gICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmFkZENsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLnJlbW92ZUNsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gaW5pdFRleHRmaWVsZHMoKSB7XG4gIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWlucHV0JykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICBuZXcgVGV4dGZpZWxkKGVsLCB7XG4gICAgICBsYWJlbDogZWwuZGF0YXNldC5sYWJlbCxcbiAgICAgIGhlbHBUZXh0OiBlbC5kYXRhc2V0LmhlbHBUZXh0LFxuICAgICAgZXJyTXNnOiBlbC5kYXRhc2V0LmVyck1zZyxcbiAgICAgIHBsYWNlaG9sZGVyOiBlbC5wbGFjZWhvbGRlcixcbiAgICAgIG1hc2s6IGVsLmRhdGFzZXQubWFzayxcbiAgICAgIG1heEhlaWdodDogZWwuZGF0YXNldC5tYXhIZWlnaHRcbiAgICB9KTtcbiAgfSk7XG59XG5cbmluaXRUZXh0ZmllbGRzKCk7XG5cbi8vc2VsZWN0Ym94XG4vLzsoZnVuY3Rpb24od2luZG93KSB7XG4gICAgLy8ndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBTZWxlY3Rib3goZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgICAgICB0aGlzLl9pbml0RXZlbnRzKCk7XG4gICAgfVxuXG4gICAgU2VsZWN0Ym94LnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSB0aGlzLm9wdGlvbnMuaXRlbXMuaW5kZXhPZih0aGlzLm9wdGlvbnMuc2VsZWN0ZWRJdGVtKTtcbiAgICAgICAgdGhpcy5vcHRpb25zLnVuc2VsZWN0ID0gdGhpcy5vcHRpb25zLnVuc2VsZWN0ICE9PSAtMSA/ICfigJTCoE5vbmUg4oCUJyA6IHRoaXMub3B0aW9ucy51bnNlbGVjdDtcblxuICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdF9fd3JhcHBlcicpO1xuICAgICAgICB0aGlzLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuc2VsZWN0V3JhcHBlciwgdGhpcy5lbCk7XG4gICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdqcy1zZWxlY3Rib3gnKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2ZpZWxkJyk7XG5cbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlSXRlbSA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLml0ZW1zW3RoaXMuYWN0aXZlSXRlbV07XG4gICAgICAgICAgICB0aGlzLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxhYmVsKSB7XG4gICAgICAgICAgICB0aGlzLmxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmxhYmVsO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2xhYmVsJyk7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmZvciA9IHRoaXMuZWwuaWQ7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5sYWJlbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWxwVGV4dCkge1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuaGVscFRleHQ7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9faGVscC10ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5oZWxwVGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lcnJNc2cpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0aGlzLmVyck1zZy5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuZXJyTXNnO1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19lcnItbXNnJyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lcnJNc2cpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFNlbGVjdGJveC5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8vQ2xvc2UgbGlzdCBoZWxwZXJcbiAgICAgICAgZnVuY3Rpb24gY2xvc2VMaXN0KCkge1xuICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3Rib3hfc3RhdGVfb3BlbicpO1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0V3JhcHBlci5yZW1vdmVDaGlsZChzZWxmLmxpc3QpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLnNlYXJjaEZpZWxkICYmIHNlbGYuc2VhcmNoRmllbGQucGFyZW50Tm9kZSA9PT0gc2VsZi5lbCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwucmVtb3ZlQ2hpbGQoc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5pbnB1dEZpZWxkICYmIHNlbGYuaW5wdXRGaWVsZC5wYXJlbnROb2RlID09PSBzZWxmLmVsKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5yZW1vdmVDaGlsZChzZWxmLmlucHV0RmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuYWN0aXZlSXRlbSA8IDApIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IHNlbGYub3B0aW9ucy5pdGVtc1tzZWxmLmFjdGl2ZUl0ZW1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlU2VsZWN0RG9jQ2xpY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9DcmVhdGUgbGlzdCBoZWxwZXJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlTGlzdChpdGVtcywgYWN0aXZlSXRlbSwgc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYubGlzdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYubGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgICAgICBzZWxmLmxpc3QuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19saXN0Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RJdGVtKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1DbGFzcyA9IHNlbGYub3B0aW9ucy5jb21wbGV4SXRlbXMgPyAnc2VsZWN0Ym94X19saXN0LWl0ZW0gc2VsZWN0Ym94X19saXN0LWl0ZW0tLWNvbXBsZXgnIDogJ3NlbGVjdGJveF9fbGlzdC1pdGVtIHNlbGVjdGJveF9fbGlzdC1pdGVtLS10ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQgPSAkKCc8bGk+PC9saT4nKS5hZGRDbGFzcyhpdGVtQ2xhc3MpLnRleHQoaXRlbSksXG4gICAgICAgICAgICAgICAgICAgIGxpc3RIZWxwZXIgPSAkKCc8ZGl2PjwvZGl2PicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1pdGVtJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3otaW5kZXgnLCAnLTEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnb3BhY2l0eScsIDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ292ZXJmbG93JywgJ3Zpc2libGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnd2hpdGUtc3BhY2UnLCAnbm93cmFwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KGl0ZW0pO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKGxpc3RIZWxwZXIuZ2V0KDApKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmF0dHIoJ2RhdGEtaW5kZXgnLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5jb21wbGV4SXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuZ2V0KDApLmlubmVySFRNTCA9IGl0ZW07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaFRleHQgJiYgIXNlbGYub3B0aW9ucy5jb21wbGV4SXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuZ2V0KDApLmlubmVySFRNTCA9IGxpc3RJdGVtVGV4dChpdGVtLCBzZWFyY2hUZXh0LCAkKHNlbGYubGlzdCkud2lkdGgoKSA8IGxpc3RIZWxwZXIud2lkdGgoKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQub24oJ21vdXNlZG93bicsIGhhbmRsZUl0ZW1DbGljayk7XG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQub24oJ21vdXNlb3ZlcicsIGhhbmRsZUl0ZW1Nb3VzZU92ZXIpO1xuXG4gICAgICAgICAgICAgICAgbGlzdEhlbHBlci5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbUVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0SXRlbVRleHQoaXRlbVN0cmluZywgdGV4dCwgbG9uZykge1xuICAgICAgICAgICAgICAgIHZhciBvdXRwdXRTdHJpbmcgPSBpdGVtU3RyaW5nO1xuICAgICAgICAgICAgICAgIGlmIChsb25nKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3b3JkcyA9IGl0ZW1TdHJpbmcuc3BsaXQoJyAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaEluZGV4ID0gd29yZHMucmVkdWNlKGZ1bmN0aW9uKGN1cnJlbnRJbmRleCwgd29yZCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTdHJpbmcgPSB3b3JkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0KSA+IC0xICYmIGN1cnJlbnRJbmRleCA9PT0gLTEgPyBpbmRleCA6IGN1cnJlbnRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIC0xKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VhcmNoSW5kZXggPj0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0cmluZ0VuZCA9IHdvcmRzLnNsaWNlKHNlYXJjaEluZGV4KS5yZWR1Y2UoZnVuY3Rpb24oc3RyLCB3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0ciArICcgJyArIHdvcmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWcgPSAvXFwuJC87XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZHNbMF0ubWF0Y2gocmVnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN0cmluZyA9IHdvcmRzWzBdICsgJyAnICsgd29yZHNbMV0gKyAnIC4uLiAnICsgc3RyaW5nRW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTdHJpbmcgPSB3b3Jkc1swXSArICcgLi4uICcgKyBzdHJpbmdFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRUZXh0SW5kZXggPSBvdXRwdXRTdHJpbmcudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQudG9Mb3dlckNhc2UoKSksXG4gICAgICAgICAgICAgICAgICAgIGVuZFRleHRJbmRleCA9IHN0YXJ0VGV4dEluZGV4ICsgdGV4dC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gb3V0cHV0U3RyaW5nLnNsaWNlKDAsIHN0YXJ0VGV4dEluZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgbWlkZGxlID0gb3V0cHV0U3RyaW5nLnNsaWNlKHN0YXJ0VGV4dEluZGV4LCBlbmRUZXh0SW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICBlbmQgPSBvdXRwdXRTdHJpbmcuc2xpY2UoZW5kVGV4dEluZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdGFydCkpO1xuICAgICAgICAgICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQoJCgnPHNwYW4+PC9zcGFuPicpLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtaGlnaGxpZ2h0JykudGV4dChtaWRkbGUpLmdldCgwKSk7XG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShlbmQpKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlubmVySFRNTDtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gZGl2aWRlcigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJCgnPGxpPjwvbGk+JykuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1kaXZpZGVyJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZChzZWxmLmxpc3QpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnVuc2VsZWN0ICE9PSAtMSAmJiAhc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdJdGVtID0gbGlzdEl0ZW0oc2VsZi5vcHRpb25zLnVuc2VsZWN0KS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkIHNlbGVjdGJveF9fbGlzdC11bnNlbGVjdCcpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChuZXdJdGVtLmdldCgwKSk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LmFwcGVuZENoaWxkKGRpdmlkZXIoKS5nZXQoMCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3SXRlbSA9IGxpc3RJdGVtKGl0ZW0sIHNlbGYub3B0aW9ucy5pdGVtcy5pbmRleE9mKGl0ZW0pKTtcblxuICAgICAgICAgICAgICAgIGlmIChpID09PSAwICYmIHNlbGYubGlzdC5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3SXRlbS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtID09PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0l0ZW0uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChuZXdJdGVtLmdldCgwKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGZpZWxkUmVjdCA9IHNlbGYuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICAgICAgZmllbGRPZmZzZXRUb3AgPSBzZWxmLmVsLm9mZnNldFRvcCxcbiAgICAgICAgICAgICAgICB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgbWVudVJlY3QgPSBzZWxmLmxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG5cbiAgICAgICAgICAgICAgICBoZWlnaHRDaGVjayA9IHdpbmRvd0hlaWdodCAtIGZpZWxkUmVjdC50b3AgLSBmaWVsZFJlY3QuaGVpZ2h0IC0gbWVudVJlY3QuaGVpZ2h0O1xuXG4gICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUudG9wID0gaGVpZ2h0Q2hlY2sgPiAwID8gZmllbGRPZmZzZXRUb3AgKyBmaWVsZFJlY3QuaGVpZ2h0ICsgNSArICdweCcgOiBmaWVsZE9mZnNldFRvcCAtIG1lbnVSZWN0LmhlaWdodCAtIDEwICsgJ3B4JztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdEl0ZW0oaXRlbSkge1xuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy51bnNlbGVjdCAmJiBpdGVtLmlubmVySFRNTCA9PT0gc2VsZi5vcHRpb25zLnVuc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hY3RpdmVJdGVtID0gLTE7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3Rib3hfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFjdGl2ZUl0ZW0gPSBpdGVtLmRhdGFzZXQuaW5kZXg7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuaXRlbUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLml0ZW1DYWxsYmFjayhpdGVtLCBzZWxmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vU2VsZWN0IGNsaWNrXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNlbGVjdENsaWNrKGUpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuYWN0aXZlSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgdGhlcmUgaXMgYW55IHNlbGVjdGVkIGl0ZW0uIElmIG5vdCBzZXQgdGhlIHBsYWNlaG9sZGVyIHRleHRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuYWN0aXZlSXRlbSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gc2VsZi5wbGFjZWhvbGRlciB8fCAnU2VsZWN0JztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgc2VhcmNoIG9wdGlvbiBpcyBvbiBvciB0aGVyZSBpcyBtb3JlIHRoYW4gMTAgaXRlbXMuIElmIHllcywgYWRkIHNlYXJjZmllbGRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5zZWFyY2ggfHwgc2VsZi5vcHRpb25zLml0ZW1zLmxlbmd0aCA+IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2VsZi5zZWFyY2hGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fc2VhcmNoZmllbGQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnBsYWNlaG9sZGVyID0gc2VsZi5vcHRpb25zLnNlYXJjaFBsYWNlaG9sZGVyIHx8ICdTZWFyY2guLi4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBoYW5kbGVTZWFyY2hGaWVsZElucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBoYW5kbGVTZWFyY2hGaWVsZElucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuaW5wdXRGaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0RmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9zdGF0ZV9vcGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zLCBzZWxmLmFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZVNlbGVjdERvY0NsaWNrKTt9LCAxMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL1NlbGVjdCBpdGVtIGhhbmRsZXJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlSXRlbUNsaWNrKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBzZWxlY3RJdGVtKGUudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVJdGVtTW91c2VPdmVyKGUpIHtcbiAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTZWxlY3REb2NDbGljaygpIHtcbiAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9GdWx0ZXIgZnVuY3Rpb24gZm9yIHNlYXJjZmllbGRcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2VhcmNoRmllbGRJbnB1dChlKSB7XG4gICAgICAgICAgICB2YXIgZkl0ZW1zID0gc2VsZi5vcHRpb25zLml0ZW1zLmZpbHRlcihmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhlLnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY3JlYXRlTGlzdChmSXRlbXMsIHNlbGYuYWN0aXZlSXRlbSwgZS50YXJnZXQudmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVLZXlEb3duKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB2YXIgaW5kZXgsIGxlbmd0aDtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0SXRlbShzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJylbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDI3OlxuICAgICAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4IC0gMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCA8IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPiAwID8gJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpIC0gJChzZWxmLmxpc3QpLmhlaWdodCgpIDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmhlaWdodCgpIDwgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXgpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXgpLmhlaWdodCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL0NoZWNrIGlmIGZpZWxkIGlzIGVtcHR5IG9yIG5vdCBhbmQgY2hhbmdlIGNsYXNzIGFjY29yZGluZ2x5XG4gICAgICAgICQoc2VsZi5lbCkub24oJ2NsaWNrJywgaGFuZGxlU2VsZWN0Q2xpY2spO1xuICAgIH07XG5cbiAgICBTZWxlY3Rib3gucHJvdG90eXBlLl90b2dnbGVBZGRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMuZWwpLmhhc0NsYXNzKCdqcy1oYXNWYWx1ZScpKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5hZGRDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5yZW1vdmVDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBTZWxlY3Rib3gucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0Ym94X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSAtMTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaW5pdFNlbGVjdGJveGVzKCkge1xuICAgICAgICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1zZWxlY3Rib3gnKSkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbmV3IFNlbGVjdGJveChlbCwge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBlbC5kYXRhc2V0LmxhYmVsLFxuICAgICAgICAgICAgICAgIGhlbHBUZXh0OiBlbC5kYXRhc2V0LmhlbHBUZXh0LFxuICAgICAgICAgICAgICAgIGVyck1zZzogZWwuZGF0YXNldC5lcnJNc2csXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IGVsLmRhdGFzZXQucGxhY2Vob2xkZXIsXG4gICAgICAgICAgICAgICAgaXRlbXM6IEpTT04ucGFyc2UoZWwuZGF0YXNldC5pdGVtcyksXG4gICAgICAgICAgICAgICAgc2VhcmNoOiBlbC5kYXRhc2V0LnNlYXJjaCxcbiAgICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcjplbC5kYXRhc2V0LnNlYXJjaFBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBlbC5kYXRhc2V0LnJlcXVpcmVkLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkSXRlbTogZWwuZGF0YXNldC5zZWxlY3RlZEl0ZW0sXG4gICAgICAgICAgICAgICAgdW5zZWxlY3Q6IGVsLmRhdGFzZXQudW5zZWxlY3RcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0U2VsZWN0Ym94ZXMoKTtcblxuXG4vL30pKHdpbmRvdyk7XG5cbi8vVGFnZmllbGRzXG4vLzsoZnVuY3Rpb24od2luZG93KSB7XG4gICAgLy8ndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBUYWdmaWVsZChlbCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgICAgICB0aGlzLl9pbml0RXZlbnRzKCk7XG4gICAgfVxuXG4gICAgVGFnZmllbGQucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB0aGlzLml0ZW1zID0gdGhpcy5vcHRpb25zLmluaXRpYWxJdGVtcyB8fCBbXTtcblxuICAgICAgICB0aGlzLnRhZ2ZpZWxkV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLnRhZ2ZpZWxkV3JhcHBlci5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fd3JhcHBlcicpO1xuICAgICAgICB0aGlzLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMudGFnZmllbGRXcmFwcGVyLCB0aGlzLmVsKTtcbiAgICAgICAgdGhpcy50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnanMtdGFnZmllbGQnKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fZmllbGQnKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxhYmVsKSB7XG4gICAgICAgICAgICB0aGlzLmxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmxhYmVsO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuZm9yID0gdGhpcy5lbC5pZDtcbiAgICAgICAgICAgIHRoaXMudGFnZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGVscFRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmhlbHBUZXh0O1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9faGVscC10ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLnRhZ2ZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmhlbHBUZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVyck1zZykge1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5lcnJNc2c7XG4gICAgICAgICAgICB0aGlzLmVyck1zZy5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fZXJyLW1zZycpO1xuICAgICAgICAgICAgdGhpcy50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lcnJNc2cpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIHNlbGYuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLl9jcmVhdGVUYWcoaXRlbSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgVGFnZmllbGQucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAvL0Nsb3NlIGxpc3QgaGVscGVyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlTGlzdCgpIHtcbiAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgndGFnZmllbGRfc3RhdGVfb3BlbicpO1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYubGlzdCk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuc2VhcmNoRmllbGQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLnJlbW92ZUNoaWxkKHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuaGVscGVyRmllbGQgJiYgc2VsZi5oZWxwZXJGaWVsZC5wYXJlbnROb2RlID09PSBzZWxmLmVsKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5yZW1vdmVDaGlsZChzZWxmLmhlbHBlckZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZ2ZpZWxkX190YWcnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVUYWdmaWVsZERvY0NsaWNrKTtcbiAgICAgICAgICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgICAgICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vQ3JlYXRlIGxpc3QgaGVscGVyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUxpc3QoaXRlbXMsIGFjdGl2ZUl0ZW0sIHNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzZWxmLmxpc3QpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgc2VsZi5saXN0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fbGlzdCcpO1xuXG4gICAgICAgICAgICBzZWxmLmxpc3RIZWxwZXIgPSAkKCc8ZGl2PjwvZGl2PicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWl0ZW0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdwb3NpdGlvbicsICdhYnNvbHV0ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3otaW5kZXgnLCAnLTEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ292ZXJmbG93JywgJ3Zpc2libGUnKTtcblxuICAgICAgICAgICAgc2VsZi50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VsZi5saXN0SGVscGVyLmdldCgwKSk7XG5cbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19saXN0LWl0ZW0nKTtcbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5pbm5lckhUTUwgPSBpdGVtO1xuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmlkID0gJ2xpc3RJdGVtLScgKyBpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdEhlbHBlci50ZXh0KGl0ZW0pO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gbGlzdEl0ZW1UZXh0KGl0ZW1TdHJpbmcsIHRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdvcmRzID0gaXRlbVN0cmluZy5zcGxpdCgnICcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoSW5kZXggPSB3b3Jkcy5yZWR1Y2UoZnVuY3Rpb24oY3VycmVudEluZGV4LCB3b3JkLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3b3JkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0KSA+IC0xICYmIGN1cnJlbnRJbmRleCA9PT0gLTEgPyBpbmRleCA6IGN1cnJlbnRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIC0xKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VhcmNoSW5kZXggPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdHJpbmdFbmQgPSB3b3Jkcy5zbGljZShzZWFyY2hJbmRleCkucmVkdWNlKGZ1bmN0aW9uKHN0ciwgd29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHIgKyAnICcgKyB3b3JkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gL1xcLiQvO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRzWzBdLm1hdGNoKHJlZykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd29yZHNbMF0gKyAnICcgKyB3b3Jkc1sxXSArICcgLi4uICcgKyBzdHJpbmdFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3b3Jkc1swXSArICcgLi4uICcgKyBzdHJpbmdFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VhcmNoVGV4dCAmJiAkKHNlbGYuc2VsZWN0V3JhcHBlcikud2lkdGgoKSA8IHNlbGYubGlzdEhlbHBlci53aWR0aCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmlubmVySFRNTCA9IGxpc3RJdGVtVGV4dChpdGVtLCBzZWFyY2hUZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtID09PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVJdGVtQ2xpY2spO1xuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGhhbmRsZUl0ZW1Nb3VzZU92ZXIpO1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChpdGVtRWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2VsZi50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VsZi5saXN0KTtcblxuXG4gICAgICAgICAgICB2YXIgZmllbGRSZWN0ID0gc2VsZi5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgICAgICBmaWVsZE9mZnNldFRvcCA9IHNlbGYuZWwub2Zmc2V0VG9wLFxuICAgICAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgICAgICAgICBtZW51UmVjdCA9IHNlbGYubGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcblxuICAgICAgICAgICAgICAgIGhlaWdodENoZWNrID0gd2luZG93SGVpZ2h0IC0gZmllbGRSZWN0LnRvcCAtIGZpZWxkUmVjdC5oZWlnaHQgLSBtZW51UmVjdC5oZWlnaHQ7XG5cbiAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS50b3AgPSBoZWlnaHRDaGVjayA+IDAgPyBmaWVsZE9mZnNldFRvcCArIGZpZWxkUmVjdC5oZWlnaHQgKyA1ICsgJ3B4JyA6IGZpZWxkT2Zmc2V0VG9wIC0gbWVudVJlY3QuaGVpZ2h0IC0gMTAgKyAncHgnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9TZWxlY3QgY2xpY2tcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGFnZmllbGRDbGljayhlKSB7XG4gICAgICAgICAgICAvL2Uuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgLy9jbG9zZUxpc3QoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICAvL0NyZWF0ZSBTZWFyY2hmaWVsZFxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnNlYXJjaCB8fCBzZWxmLm9wdGlvbnMuaXRlbXMubGVuZ3RoID4gNyB8fCBzZWxmLm9wdGlvbnMuY3JlYXRlVGFncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmLnNlYXJjaEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC50eXBlID0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfX3NlYXJjaGZpZWxkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5wbGFjZWhvbGRlciA9IHNlbGYub3B0aW9ucy5zZWFyY2hQbGFjZWhvbGRlciB8fCAnU2VhcmNoLi4uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaGFuZGxlU2VhcmNoRmllbGRJbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC52YWx1ZSA9ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWdmaWVsZF9fdGFnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBzZWxmLm9wdGlvbnMucGxhY2Vmb2xkZXIgfHwgJ1NlbGVjdCBmcm9tIHRoZSBsaXN0JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC50eXBlID0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5jbGFzc0xpc3QuYWRkKCdqcy1oZWxwZXJJbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuc3R5bGUuekluZGV4ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuaGVscGVyRmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9zdGF0ZV9vcGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zLCBzZWxmLmFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZVRhZ2ZpZWxkRG9jQ2xpY2spO30sIDEwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgLy9TZWxlY3QgaXRlbSBoYW5kbGVyXG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdFRhZyhlbCkge1xuICAgICAgICAgICAgaWYgKHNlbGYuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFnZmllbGRfX3RhZycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZ2ZpZWxkX19zZWFyY2hmaWVsZCcpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1oZWxwZXJJbnB1dCcpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuaGVscGVyRmllbGQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmIChzZWxmLnNlYXJjaEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5pbnNlcnRCZWZvcmUoc2VsZi5fY3JlYXRlVGFnKGVsLmlubmVySFRNTCksIHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuX2NyZWF0ZVRhZyhlbC5pbm5lckhUTUwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuaXRlbXMucHVzaChlbC5pbm5lckhUTUwpO1xuXG4gICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5zZWFyY2hGaWVsZCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgY3JlYXRlTGlzdChzZWxmLm9wdGlvbnMuaXRlbXMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLmhlbHBlckZpZWxkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBjcmVhdGVMaXN0KHNlbGYub3B0aW9ucy5pdGVtcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgICAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuaXRlbUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLml0ZW1DYWxsYmFjayhlbCwgc2VsZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlSXRlbUNsaWNrKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBzZWxlY3RUYWcoZS50YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUl0ZW1Nb3VzZU92ZXIoZSkge1xuICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVRhZ2ZpZWxkRG9jQ2xpY2soZSkge1xuICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL0Z1bHRlciBmdW5jdGlvbiBmb3Igc2VhcmNmaWVsZFxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTZWFyY2hGaWVsZElucHV0KGUpIHtcbiAgICAgICAgICAgIHZhciBmSXRlbXMgPSBzZWxmLm9wdGlvbnMuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjcmVhdGVMaXN0KGZJdGVtcywgc2VsZi5hY3RpdmVJdGVtLCBlLnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpKTtcblxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlLnNsaWNlKC0xKSA9PT0gJywnICYmIHNlbGYub3B0aW9ucy5jcmVhdGVUYWdzKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5pbnNlcnRCZWZvcmUoc2VsZi5fY3JlYXRlVGFnKGUudGFyZ2V0LnZhbHVlLnNsaWNlKDAsIC0xKSksIHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgZS50YXJnZXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICBlLnRhcmdldC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGNyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zKTtcbiAgICAgICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVLZXlEb3duKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB2YXIgaW5kZXgsIGxlbmd0aDtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0VGFnKHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnICYmIHNlbGYub3B0aW9ucy5jcmVhdGVUYWdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmluc2VydEJlZm9yZShzZWxmLl9jcmVhdGVUYWcoZS50YXJnZXQudmFsdWUpLCBzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUudGFyZ2V0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnRhcmdldC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTGlzdChzZWxmLm9wdGlvbnMuaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDI3OlxuICAgICAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4IC0gMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgPCA1MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA+IDAgPyAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPCAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vRGVsZXRlIHRhZyBoYW5kbGVcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlRGVsZXRlVGFnKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB2YXIgdGFnID0gZS50YXJnZXQucGFyZW50Tm9kZTtcblxuICAgICAgICAgICAgdGFnLnJlbW92ZUNoaWxkKGUudGFyZ2V0KTtcbiAgICAgICAgICAgIHZhciB0YWdUaXRsZSA9IHRhZy5pbm5lckhUTUwsXG4gICAgICAgICAgICAgICAgdGFnSW5kZXggPSBzZWxmLml0ZW1zLmluZGV4T2YodGFnVGl0bGUpO1xuICAgICAgICAgICAgaWYgKHRhZ0luZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gW10uY29uY2F0KHNlbGYuaXRlbXMuc2xpY2UoMCwgdGFnSW5kZXgpLCBzZWxmLml0ZW1zLnNsaWNlKHRhZ0luZGV4ICsgMSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmVsLnJlbW92ZUNoaWxkKHRhZyk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZ2ZpZWxkX190YWcnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmVsLmNsYXNzTGlzdC5jb250YWlucygndGFnZmllbGRfc3RhdGVfb3BlbicpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gc2VsZi5vcHRpb25zLnBsYWNlZm9sZGVyIHx8ICdTZWxlY3QgZnJvbSB0aGUgbGlzdCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuXG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vQ2hlY2sgaWYgZmllbGQgaXMgZW1wdHkgb3Igbm90IGFuZCBjaGFuZ2UgY2xhc3MgYWNjb3JkaW5nbHlcbiAgICAgICAgJCh0aGlzLnRhZ2ZpZWxkV3JhcHBlcikub24oJ2NsaWNrJywgJy50YWdmaWVsZF9fZmllbGQnLCBoYW5kbGVUYWdmaWVsZENsaWNrKTtcbiAgICAgICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuXG4gICAgfTtcblxuICAgIC8vQXV0b3Jlc2l6ZSB0ZXh0YXJlYVxuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5fYXV0b3NpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuZWwudmFsdWUgPT09ICcnKSB7dGhpcy5lbC5yb3dzID0gMTt9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCxcbiAgICAgICAgICAgICAgICBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpLFxuICAgICAgICAgICAgICAgIHRleHRXaWR0aCA9IHRoaXMuZWwudmFsdWUubGVuZ3RoICogNyxcbiAgICAgICAgICAgICAgICByb3cgPSBNYXRoLmNlaWwodGV4dFdpZHRoIC8gd2lkdGgpO1xuXG4gICAgICAgICAgICByb3cgPSByb3cgPD0gMCA/IDEgOiByb3c7XG4gICAgICAgICAgICByb3cgPSB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0ICYmIHJvdyA+IHRoaXMub3B0aW9ucy5tYXhIZWlnaHQgPyB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0IDogcm93O1xuXG4gICAgICAgICAgICB0aGlzLmVsLnJvd3MgPSByb3c7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy9DcmVhdGUgVGFnIEhlbHBlclxuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5fY3JlYXRlVGFnID0gZnVuY3Rpb24odGFnTmFtZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIGRlbFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgIHRhZy5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fdGFnJyk7XG4gICAgICAgIHRhZy5pbm5lckhUTUwgPSB0YWdOYW1lO1xuXG4gICAgICAgIGRlbFRhZy5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fdGFnLWRlbGV0ZScpO1xuICAgICAgICBkZWxUYWcuaW5uZXJIVE1MID0gJ+KclSc7XG4gICAgICAgIGRlbFRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBzZWxmLl9kZWxldGVUYWcoZS50YXJnZXQucGFyZW50Tm9kZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRhZy5hcHBlbmRDaGlsZChkZWxUYWcpO1xuXG4gICAgICAgIHJldHVybiB0YWc7XG4gICAgfTtcblxuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5fZGVsZXRlVGFnID0gZnVuY3Rpb24odGFnKSB7XG4gICAgICAgIHRoaXMuZWwucmVtb3ZlQ2hpbGQodGFnKTtcblxuICAgICAgICAkKHRhZykuZmluZCgnLnRhZ2ZpZWxkX190YWctZGVsZXRlJykucmVtb3ZlKCk7XG4gICAgICAgIHZhciB0YWdUaXRsZSA9IHRhZy5pbm5lckhUTUwsXG4gICAgICAgICAgICB0YWdJbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZih0YWdUaXRsZSk7XG4gICAgICAgIGlmICh0YWdJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zID0gW10uY29uY2F0KHRoaXMuaXRlbXMuc2xpY2UoMCwgdGFnSW5kZXgpLCB0aGlzLml0ZW1zLnNsaWNlKHRhZ0luZGV4ICsgMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFnZmllbGRfX3RhZycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmVsLmNsYXNzTGlzdC5jb250YWlucygndGFnZmllbGRfc3RhdGVfb3BlbicpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSBzZWxmLm9wdGlvbnMucGxhY2Vmb2xkZXIgfHwgJ1NlbGVjdCBmcm9tIHRoZSBsaXN0JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90b2dnbGVBZGRhYmxlKCk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWxldGVUYWdDYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRlbGV0ZVRhZ0NhbGxiYWNrKHRhZywgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRhZ2ZpZWxkLnByb3RvdHlwZS5fdG9nZ2xlQWRkYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzLmVsKS5oYXNDbGFzcygnanMtaGFzVmFsdWUnKSkge1xuICAgICAgICAgICAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykuYWRkQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgVGFnZmllbGQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICAgICAgJCh0aGlzLmVsKS5maW5kKCcudGFnZmllbGRfX3RhZycpLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICB0aGlzLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRUYWdmaWVsZHMoKSB7XG4gICAgICAgIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXRhZ2ZpZWxkJykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIG5ldyBUYWdmaWVsZChlbCwge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBlbC5kYXRhc2V0LmxhYmVsLFxuICAgICAgICAgICAgICAgIGhlbHBUZXh0OiBlbC5kYXRhc2V0LmhlbHBUZXh0LFxuICAgICAgICAgICAgICAgIGVyck1zZzogZWwuZGF0YXNldC5lcnJNc2csXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IGVsLmRhdGFzZXQucGxhY2Vob2xkZXIsXG4gICAgICAgICAgICAgICAgaXRlbXM6IEpTT04ucGFyc2UoZWwuZGF0YXNldC5pdGVtcyksXG4gICAgICAgICAgICAgICAgc2VhcmNoOiBlbC5kYXRhc2V0LnNlYXJjaCxcbiAgICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcjogZWwuZGF0YXNldC5zZWFyY2hQbGFjZWhvbGRlcixcbiAgICAgICAgICAgICAgICBjcmVhdGVUYWdzOiBlbC5kYXRhc2V0LmNyZWF0ZU5ld1RhZyxcbiAgICAgICAgICAgICAgICBpbml0aWFsSXRlbXM6IGVsLmRhdGFzZXQuc2VsZWN0ZWRJdGVtcyA/IEpTT04ucGFyc2UoZWwuZGF0YXNldC5zZWxlY3RlZEl0ZW1zKSA6ICcnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdFRhZ2ZpZWxkcygpO1xuXG5cbi8vfSkod2luZG93KTtcblxuLy9Ecm9wZG93blxuZnVuY3Rpb24gRHJvcGRvd24oZWwsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMuX2luaXQoKTtcbiAgICB0aGlzLl9pbml0RXZlbnRzKCk7XG59XG5cbkRyb3Bkb3duLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZHJvcGRvd25XcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5kcm9wZG93bldyYXBwZXIuY2xhc3NMaXN0LmFkZCgnanMtZHJvcGRvd25XcmFwcGVyJyk7XG4gICAgdGhpcy5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmRyb3Bkb3duV3JhcHBlciwgdGhpcy5lbCk7XG4gICAgdGhpcy5kcm9wZG93bldyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdqcy1kcm9wZG93bicpO1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnanMtZHJvcGRvd25JdGVtJyk7XG59O1xuXG5Ecm9wZG93bi5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvL0Nsb3NlIGxpc3QgaGVscGVyXG4gICAgZnVuY3Rpb24gY2xvc2VMaXN0KCkge1xuICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLW9wZW4nKTtcbiAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgc2VsZi5kcm9wZG93bldyYXBwZXIucmVtb3ZlQ2hpbGQoc2VsZi5saXN0KTtcbiAgICAgICAgICAgIHNlbGYubGlzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVPdXRzaWRlQ2xpY2spO1xuICAgIH1cbiAgICAvL0hhbmRsZSBvdXRzaWRlIGRyb3Bkb3duIGNsaWNrXG4gICAgZnVuY3Rpb24gaGFuZGxlT3V0c2lkZUNsaWNrKGUpIHtcbiAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgfVxuXG4gICAgLy9IYW5kbGUgZHJvcGRvd24gY2xpY2tcbiAgICBmdW5jdGlvbiBoYW5kbGVEcm9wZG93bkNsaWNrKGUpIHtcblxuICAgICAgICAvL2Uuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChzZWxmLmVsLmNsYXNzTGlzdC5jb250YWlucygnaXMtb3BlbicpKSB7Y2xvc2VMaXN0KCk7fVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuaXRlbXMpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ2lzLW9wZW4nKTtcblxuICAgICAgICAgICAgICAgIHNlbGYubGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LmNsYXNzTGlzdC5hZGQoJ2MtRHJvcGRvd24tbGlzdCcpO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5kaXZpZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkcm9wZG93bl9fZGl2aWRlcicpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZHJvcGRvd25fX2xpc3QtaXRlbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuaW5uZXJIVE1MID0gaXRlbS5pbm5lckhUTUwgfHwgaXRlbS50ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jYWxsYmFjayhlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ud2FybmluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLndhcm5pbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoYXMtd2FybmluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3QuYXBwZW5kQ2hpbGQoaXRlbUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5kcm9wZG93bldyYXBwZXIuYXBwZW5kQ2hpbGQoc2VsZi5saXN0KTtcblxuICAgICAgICAgICAgICAgIHZhciBsaXN0UmVjdCA9IHNlbGYubGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgIGlmIChsaXN0UmVjdC5sZWZ0ICsgbGlzdFJlY3Qud2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUucmlnaHQgPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS5sZWZ0ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RSZWN0LnRvcCArIGxpc3RSZWN0LmhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3Quc3R5bGUuYm90dG9tID0gJzEwMCUnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS50b3AgPSAnMTAwJSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlT3V0c2lkZUNsaWNrKTt9LCAxMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VsZi5lbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZURyb3Bkb3duQ2xpY2spO1xufTtcblxuLy9BZGRhYmxlIEZpZWxkc1xuLy87KGZ1bmN0aW9uKHdpbmRvdykge1xuICAgIC8vJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gQWRkYWJsZShlbCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge3NvcnRhYmxlOiB0cnVlfTtcblxuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgfVxuXG4gICAgQWRkYWJsZS5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdqcy1hZGRhYmxlV3JhcHBlcicpO1xuICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLmluc2VydEJlZm9yZShzZWxmLmVsKTtcblxuICAgICAgICBzZWxmLmVsLnJlbW92ZUNsYXNzKCdqcy1hZGRhYmxlJyk7XG4gICAgICAgIHNlbGYuZWwuYWRkQ2xhc3MoJ2pzLWFkZGFibGVJdGVtIGMtQWRkYWJsZS1pdGVtJyk7XG5cbiAgICAgICAgc2VsZi5hZGRhYmxlUm93ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnanMtYWRkYWJsZVJvdyBjLUFkZGFibGUtcm93Jyk7XG5cbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5zb3J0YWJsZSkge1xuICAgICAgICAgICAgc2VsZi5hZGRhYmxlUm93RHJhZ0hhbmRsZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjLUFkZGFibGUtcm93LWRyYWdIYW5kbGVyJyk7XG4gICAgICAgICAgICBzZWxmLmFkZGFibGVSb3cuYXBwZW5kKHNlbGYuYWRkYWJsZVJvd0RyYWdIYW5kbGVyKTtcblxuICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5zb3J0YWJsZSh7XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHNlbGYub3B0aW9ucyA/IHNlbGYub3B0aW9ucy5wbGFjZWhvbGRlciB8fCAnYy1BZGRhYmxlLXJvd1BsYWNlaG9sZGVyJyA6ICdjLUFkZGFibGUtcm93UGxhY2Vob2xkZXInLFxuICAgICAgICAgICAgICAgIHN0YXJ0OiBmdW5jdGlvbihlLCB1aSkge1xuICAgICAgICAgICAgICAgICAgICB1aS5pdGVtLmFkZENsYXNzKCdpcy1kcmFnZ2luZycpO1xuICAgICAgICAgICAgICAgICAgICAkKGUudGFyZ2V0KS5jc3MoJ2hlaWdodCcsICQoZS50YXJnZXQpLmhlaWdodCgpKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmNzcygnaGVpZ2h0JywgJCgnYm9keScpLmhlaWdodCgpKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uKGUsIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVpLml0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLWRyYWdnaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICQoZS50YXJnZXQpLmNzcygnaGVpZ2h0JywgJycpO1xuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuY3NzKCdoZWlnaHQnLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmFkZEJ1dHRvbiA9ICQoJzxidXR0b24+PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbi0tcm91bmQgYnV0dG9uX3N0eWxlX291dGxpbmUtZ3JheSBidXR0b24tLWFkZCBjLUFkZGFibGUtcm93LWFkZEJ1dHRvbicpLmNsaWNrKGhhbmRsZUFkZFJvdyk7XG5cbiAgICAgICAgc2VsZi5yZW1vdmVCdXR0b24gPSAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24tLXJvdW5kIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXkgYnV0dG9uLS1yZW1vdmUganMtYWRkYWJsZVJlbW92ZUJ1dHRvbicpLmNsaWNrKGhhbmRsZVJlbW92ZVJvdyk7XG5cbiAgICAgICAgc2VsZi5hZGRhYmxlUm93LmFwcGVuZChzZWxmLmVsLmNsb25lKHRydWUsIHRydWUpLCB0aGlzLnJlbW92ZUJ1dHRvbiwgdGhpcy5hZGRCdXR0b24pO1xuICAgICAgICBzZWxmLm9yaWdpbmFsRWwgPSBzZWxmLmVsLmNsb25lKHRydWUsIHRydWUpO1xuICAgICAgICBzZWxmLmVsLmRldGFjaCgpO1xuXG4gICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuYXBwZW5kKHRoaXMuYWRkYWJsZVJvdy5jbG9uZSh0cnVlLCB0cnVlKSk7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlQWRkUm93KGUpIHtcbiAgICAgICAgICAgIC8vQ2hlY2sgaWYgdGhlcmUgYXJlIG1vcmUgdGhhbiAxIGNoaWxkIGFuZCBjaGFuZ2UgY2xhc3NcbiAgICAgICAgICAgIGlmIChzZWxmLmFkZGFibGVXcmFwcGVyLmNoaWxkcmVuKCkubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuYWRkQ2xhc3MoJ2hhcy1tdWx0aXBsZVJvd3MnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5yZW1vdmVDbGFzcygnaGFzLW11bHRpcGxlUm93cycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9zZWxmLmFkZGFibGVXcmFwcGVyLmFwcGVuZChzZWxmLmFkZGFibGVSb3cuY2xvbmUodHJ1ZSwgdHJ1ZSkpO1xuICAgICAgICAgICAgc2VsZi5fYWRkSXRlbShzZWxmLm9yaWdpbmFsRWwuY2xvbmUodHJ1ZSwgdHJ1ZSksIHNlbGYub3B0aW9ucz8gc2VsZi5vcHRpb25zLmJlZm9yZUFkZCA6IG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVJlbW92ZVJvdyhlKSB7XG4gICAgICAgIFx0JChlLnRhcmdldCkucGFyZW50cygnLmpzLWFkZGFibGVSb3cnKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgc3dpdGNoIChzZWxmLmFkZGFibGVXcmFwcGVyLmNoaWxkcmVuKCcuanMtYWRkYWJsZVJvdycpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fYWRkSXRlbShzZWxmLm9yaWdpbmFsRWwuY2xvbmUodHJ1ZSwgdHJ1ZSksIHNlbGYub3B0aW9ucz8gc2VsZi5vcHRpb25zLmJlZm9yZUFkZCA6IG51bGwpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLnJlbW92ZUNsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5yZW1vdmVDbGFzcygnaGFzLW11bHRpcGxlUm93cycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5fYWRkSXRlbSA9IGZ1bmN0aW9uKGVsLCBiZWZvcmVBZGQpIHtcbiAgICAgICAgICAgIGlmIChiZWZvcmVBZGQpIHtcbiAgICAgICAgICAgICAgICBiZWZvcmVBZGQoZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGFkZGFibGVSb3cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdqcy1hZGRhYmxlUm93IGMtQWRkYWJsZS1yb3cnKSxcbiAgICAgICAgICAgICAgICBhZGRCdXR0b24gPSAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24tLXJvdW5kIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWdyYXkgYnV0dG9uLS1hZGQgYy1BZGRhYmxlLXJvdy1hZGRCdXR0b24nKS5jbGljayhoYW5kbGVBZGRSb3cpLFxuICAgICAgICAgICAgICAgIHJlbW92ZUJ1dHRvbiA9ICQoJzxidXR0b24+PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbi0tcm91bmQgYnV0dG9uX3N0eWxlX291dGxpbmUtZ3JheSBidXR0b24tLXJlbW92ZSBqcy1hZGRhYmxlUmVtb3ZlQnV0dG9uJykuY2xpY2soaGFuZGxlUmVtb3ZlUm93KTtcblxuICAgICAgICAgICAgZWwuYWRkQ2xhc3MoJ2pzLWFkZGFibGVJdGVtIGMtQWRkYWJsZS1pdGVtJyk7XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnNvcnRhYmxlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFkZGFibGVSb3dEcmFnSGFuZGxlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2MtQWRkYWJsZS1yb3ctZHJhZ0hhbmRsZXInKTtcbiAgICAgICAgICAgICAgICBhZGRhYmxlUm93LmFwcGVuZChhZGRhYmxlUm93RHJhZ0hhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkYWJsZVJvdy5hcHBlbmQoZWwsIHJlbW92ZUJ1dHRvbiwgYWRkQnV0dG9uKTtcbiAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuYXBwZW5kKGFkZGFibGVSb3cpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5hZGRhYmxlV3JhcHBlci5jaGlsZHJlbigpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLmFkZENsYXNzKCdoYXMtbXVsdGlwbGVSb3dzJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ2hhcy1tdWx0aXBsZVJvd3MnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuYWZ0ZXJBZGQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLm9wdGlvbnMuYWZ0ZXJBZGQoZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0F1dG8gc2Nyb2xsIHBhZ2Ugd2hlbiBhZGRpbmcgcm93IGJlbG93IHNjcmVlbiBib3R0b20gZWRnZVxuICAgICAgICAgICAgdmFyIHJvd0JvdHRvbUVuZCA9IGFkZGFibGVSb3cuZ2V0KDApLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGFkZGFibGVSb3cuaGVpZ2h0KCk7XG4gICAgICAgICAgICBpZiAocm93Qm90dG9tRW5kICsgNjAgPiAkKHdpbmRvdykuaGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICAgICAkKCdib2R5JykuYW5pbWF0ZSggeyBzY3JvbGxUb3A6ICcrPScgKyBNYXRoLnJvdW5kKHJvd0JvdHRvbUVuZCArIDYwIC0gJCh3aW5kb3cpLmhlaWdodCgpKS50b1N0cmluZygpIH0sIDQwMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzZWxmLmFkZGFibGVXcmFwcGVyO1xuICAgICAgICB9O1xuICAgICAgICBzZWxmLnJlbW92ZUl0ZW0gPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5jaGlsZHJlbigpLnNsaWNlKGluZGV4LCBpbmRleCsxKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIGlmIChzZWxmLmFkZGFibGVXcmFwcGVyLmNoaWxkcmVuKCcuanMtYWRkYWJsZVJvdycpLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgIFx0XHRzZWxmLmFkZGFibGVXcmFwcGVyLnJlbW92ZUNsYXNzKCdoYXMtbXVsdGlwbGVSb3dzJyk7XG4gICAgICAgIFx0fVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBpbml0QWRkYWJsZUZpZWxkcygpIHtcbiAgICAgICAgW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtYWRkYWJsZScpKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBuZXcgQWRkYWJsZSgkKGVsKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4vL30pKHdpbmRvdyk7XG5cbi8vSW1hZ2UgUGxhY2Vob2xkZXJzXG4vL1RoaXMgY2xhc3MgY3JlYXRlcyBhIHBhbGNlaG9sZGVyIGZvciBpbWFnZSBmaWxlcy4gSXQgaGFuZGxlIGJvdGggY2xpY2sgdG8gbG9hZCBhbmQgYWxzbyBzZWxlY3QgZnJvbSBhc3NldCBsaWJyYXJ5IGFjdGlvbi5cblxuZnVuY3Rpb24gSW1hZ2VQbGFjZWhvbGRlcihlbCwgZmlsZSwgb3B0aW9ucykge1xuICB0aGlzLmVsID0gZWw7XG4gIHRoaXMuZmlsZSA9IGZpbGU7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdGhpcy5faW5pdCgpO1xuICB0aGlzLl9pbml0RXZlbnRzKCk7XG59XG5cbkltYWdlUGxhY2Vob2xkZXIucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMub3B0aW9ucy5uYW1lID0gdGhpcy5vcHRpb25zLm5hbWUgfHwgdGhpcy5lbC5kYXRhc2V0Lm5hbWU7XG4gIHRoaXMub3B0aW9ucy5pZCA9IHRoaXMuZWwuaWQgKyAnLXBsYWNlaG9sZGVyJztcblxuICAvL1dyYXBwIHBsYWNlaG9sZGVyXG4gIHRoaXMud3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYy1JbWFnZVBsYWNlaG9sZGVyJyk7XG4gIGlmICghdGhpcy5maWxlKSB7dGhpcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2lzLWVtcHR5Jyk7fVxuICB0aGlzLndyYXBwZXIuaWQgPSB0aGlzLm9wdGlvbnMuaWQ7XG5cbiAgLy9QbGFjZWhvbGRlciBJbWFnZVxuICB0aGlzLmltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRoaXMuaW1hZ2UuY2xhc3NMaXN0LmFkZCgnYy1JbWFnZVBsYWNlaG9sZGVyLWltZycpO1xuICBpZiAodGhpcy5maWxlKSB7dGhpcy5pbWFnZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSB0aGlzLmZpbGUuZmlsZURhdGEudXJsO31cbiAgdGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuaW1hZ2UpO1xuXG4gIC8vUGxhY2Vob2xkZXIgY29udHJvbHNcbiAgdGhpcy5jb250cm9scyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scycpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc1VwbG9hZCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1idXR0b24nKS5nZXQoMCk7XG4gIHRoaXMuY29udHJvbHNVcGxvYWRJY29uID0gJCgnPGkgY2xhc3M9XCJmYSBmYS11cGxvYWRcIj48L2k+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1idXR0b24taWNvbicpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc1VwbG9hZFRleHQgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMtYnV0dG9uLXRleHQnKS50ZXh0KCdVcGxvYWQgZnJvbSB5b3VyIGNvbXB1dGVyJykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzVXBsb2FkLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNVcGxvYWRJY29uKTtcbiAgdGhpcy5jb250cm9sc1VwbG9hZC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzVXBsb2FkVGV4dCk7XG5cbiAgdGhpcy5jb250cm9sc0RpdmlkZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMtZGl2aWRlcicpLmdldCgwKTtcblxuICB0aGlzLmNvbnRyb2xzTGlicmFyeSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1idXR0b24nKS5nZXQoMCk7XG4gIHRoaXMuY29udHJvbHNMaWJyYXJ5SWNvbiA9ICQoJzxpIGNsYXNzPVwiZmEgZmEtZm9sZGVyLW9wZW5cIj48L2k+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1idXR0b24taWNvbicpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc0xpYnJhcnlUZXh0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbi10ZXh0JykudGV4dCgnQWRkIGZyb20gYXNzZXQgbGlicmFyeScpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc0xpYnJhcnkuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc0xpYnJhcnlJY29uKTtcbiAgdGhpcy5jb250cm9sc0xpYnJhcnkuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc0xpYnJhcnlUZXh0KTtcblxuICB0aGlzLmNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNVcGxvYWQpO1xuICB0aGlzLmNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNEaXZpZGVyKTtcbiAgdGhpcy5jb250cm9scy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzTGlicmFyeSk7XG4gIHRoaXMuaW1hZ2UuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9scyk7XG5cbiAgLy9DbGVhciBidXR0b25cbiAgdGhpcy5kZWxldGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy5kZWxldGUuY2xhc3NMaXN0LmFkZCgnYy1JbWFnZVBsYWNlaG9sZGVyLWRlbGV0ZScpO1xuICB0aGlzLmltYWdlLmFwcGVuZENoaWxkKHRoaXMuZGVsZXRlKTtcblxuICAvL0VkaXQgYnV0dG9uXG4gIHRoaXMuZWRpdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICB0aGlzLmVkaXQuY2xhc3NMaXN0LmFkZCgnYnV0dG9uJywgJ2J1dHRvbl9zdHlsZV9vdXRsaW5lLXdoaXRlJywgJ2MtSW1hZ2VQbGFjZWhvbGRlci1lZGl0Jyk7XG4gIHRoaXMuZWRpdC5pbm5lckhUTUwgPSAnRWRpdCc7XG4gIHRoaXMuaW1hZ2UuYXBwZW5kQ2hpbGQodGhpcy5lZGl0KTtcblxuICAvL0ZpbGUgbmFtZVxuICB0aGlzLmZpbGVOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRoaXMuZmlsZU5hbWUuY2xhc3NMaXN0LmFkZCgnYy1JbWFnZVBsYWNlaG9sZGVyLWZpbGVOYW1lJyk7XG4gIHRoaXMuZmlsZU5hbWUuaW5uZXJIVE1MID0gdGhpcy5maWxlID8gdGhpcy5maWxlLmZpbGVEYXRhLnRpdGxlIDogJyc7XG4gIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmZpbGVOYW1lKTtcblxuICAvL1BsYWNlaG9sZGVyIFRpdGxlXG4gIHRoaXMudGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy50aXRsZS5jbGFzc0xpc3QuYWRkKCdjLUltYWdlUGxhY2Vob2xkZXItdGl0bGUnKTtcbiAgdGhpcy50aXRsZS5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMubmFtZSB8fCAnQ292ZXInO1xuICB0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy50aXRsZSk7XG5cbiAgLy9GaWxlaW5wdXQgdG8gaGFuZGxlIGNsaWNrIHRvIHVwbG9hZCBpbWFnZVxuICB0aGlzLmZpbGVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgdGhpcy5maWxlSW5wdXQudHlwZSA9IFwiZmlsZVwiO1xuICB0aGlzLmZpbGVJbnB1dC5tdWx0aXBsZSA9IGZhbHNlO1xuICB0aGlzLmZpbGVJbnB1dC5oaWRkZW4gPSB0cnVlO1xuICB0aGlzLmZpbGVJbnB1dC5hY2NlcHQgPSBcImltYWdlLyosIHZpZGVvLypcIjtcblxuICB0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5maWxlSW5wdXQpO1xuXG4gIHRoaXMuZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy53cmFwcGVyLCB0aGlzLmVsKTtcbiAgdGhpcy5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZWwpO1xuXG59O1xuXG5JbWFnZVBsYWNlaG9sZGVyLnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgZnVuY3Rpb24gY2xlYXIoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgc2VsZi5maWxlID0gdW5kZWZpbmVkO1xuICAgIHNlbGYuX3VwZGF0ZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gb3BlbkxpYnJhcnkoKSB7XG4gICAgc2Nyb2xsUG9zaXRpb24gPSAkKCdib2R5Jykuc2Nyb2xsVG9wKCk7XG4gICAgdXBkYXRlQXNzZXRMaWJyYXJ5KCk7XG4gICAgJCgnI2FsJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICQoJyNhbCcpLmFkZENsYXNzKCdtb2RhbCcpO1xuICAgICQoJyN3cmFwcGVyJykuYWRkQ2xhc3MoJ292ZXJmbG93Jyk7XG4gICAgc2luZ2xlc2VsZWN0ID0gdHJ1ZTtcblxuICAgICQoJyNhZGRGcm9tQUxCdXR0b24nKS50ZXh0KHNlbGYub3B0aW9ucy5hbEJ1dHRvbiB8fCAnU2V0IENvdmVyJyk7XG5cbiAgICAkKCcjYWRkRnJvbUFMQnV0dG9uJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgIGxhc3RTZWxlY3RlZCA9IG51bGw7XG4gICAgICBzZXRTZWxlY3RlZEZpbGUoKTtcbiAgICAgIGNsb3NlQXNzZXRMaWJyYXJ5KCk7XG4gICAgICBzaW5nbGVzZWxlY3QgPSBmYWxzZTtcbiAgICAgICQoJ2JvZHknKS5zY3JvbGxUb3Aoc2Nyb2xsUG9zaXRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2VBc3NldExpYnJhcnkoKSB7XG4gICAgbGFzdFNlbGVjdGVkID0gbnVsbDtcbiAgICAkKCcuYWwgLmZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZS5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgIGRlc2VsZWN0QWxsKCk7XG4gICAgJCgnLm1vZGFsJykuYWRkQ2xhc3MoJ2hpZGRlbicpLnJlbW92ZUNsYXNzKCdtb2RhbCcpO1xuICAgICQoJyN3cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ292ZXJmbG93Jyk7XG4gICAgJCgnI2FkZEZyb21BTEJ1dHRvbicpLnVuYmluZCgnY2xpY2snKTtcbiAgICAkKCdib2R5Jykuc2Nyb2xsVG9wKHNjcm9sbFBvc2l0aW9uKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRTZWxlY3RlZEZpbGUoKSB7XG4gICAgdmFyIHNlbGVjdGVkRmlsZSA9ICQoJy5hbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlLnNlbGVjdGVkJyksXG4gICAgZmlsZUlkID0gJChzZWxlY3RlZEZpbGUpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKSxcbiAgICBmaWxlID0gYXNzZXRMaWJyYXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuICAgICAgcmV0dXJuIGYuaWQgPT09IGZpbGVJZDtcbiAgICB9KVswXTtcblxuICAgIHNlbGYuZmlsZSA9IHtcbiAgICAgIGZpbGVEYXRhOiBmaWxlXG4gICAgfTtcbiAgICBzZWxmLl91cGRhdGUoKTtcbiAgfVxuXG5cbiAgc2VsZi5maWxlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuICAgIGZpbGVUb09iamVjdChlLnRhcmdldC5maWxlc1swXSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgIHNlbGYuZmlsZSA9IHtcbiAgICAgICAgZmlsZURhdGE6IHJlcyxcbiAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICBwb3NpdGlvbjogMTAwMCxcbiAgICAgICAgY2FwdGlvbjogJycsXG4gICAgICAgIGdhbGxlcnlDYXB0aW9uOiBmYWxzZSxcbiAgICAgICAganVzdFVwbG9hZGVkOiB0cnVlXG4gICAgICB9O1xuICAgICAgc2VsZi5fdXBkYXRlKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHNlbGYuY29udHJvbHNVcGxvYWQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKCFzZWxmLmZpbGUpIHtcbiAgICAgIHNlbGYuZmlsZUlucHV0LmNsaWNrKCk7XG4gICAgfVxuICB9KTtcbiAgc2VsZi5kZWxldGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGVhcik7XG4gIHNlbGYuZWRpdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBlZGl0RmlsZXMoW3NlbGYuZmlsZV0pO1xuICB9KTtcblxuICBzZWxmLmNvbnRyb2xzTGlicmFyeS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9wZW5MaWJyYXJ5KTtcbn07XG5JbWFnZVBsYWNlaG9sZGVyLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmZpbGUpIHtcbiAgICB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnaXMtZW1wdHknKTtcbiAgICB0aGlzLmltYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoJyArIHRoaXMuZmlsZS5maWxlRGF0YS51cmwgKyAnKSc7XG4gICAgdGhpcy5maWxlTmFtZS5pbm5lckhUTUwgPSB0aGlzLmZpbGUuZmlsZURhdGEudGl0bGU7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhpcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2lzLWVtcHR5Jyk7XG4gICAgdGhpcy5pbWFnZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAnbm9uZSc7XG4gICAgdGhpcy5maWxlTmFtZS5pbm5lckhUTUwgPSAnJztcbiAgfVxufTtcblxuSW1hZ2VQbGFjZWhvbGRlci5wcm90b3R5cGUuc2V0SW1hZ2UgPSBmdW5jdGlvbihmaWxlKSB7XG4gIHRoaXMuZmlsZSA9IGZpbGU7XG4gIHRoaXMuX3VwZGF0ZSgpO1xufTtcblxuZnVuY3Rpb24gaW5pdEltYWdlUGxhY2Vob2xkZXJzKCkge1xuICB2YXIgaW1hZ2VQbGFjZWhvbGRlcnMgPSBbXTtcbiAgW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtaW1hZ2VQbGFjZWhvbGRlcicpKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgaW1hZ2VQbGFjZWhvbGRlcnMucHVzaChuZXcgSW1hZ2VQbGFjZWhvbGRlcihlbCkpO1xuICB9KTtcbiAgcmV0dXJuIGltYWdlUGxhY2Vob2xkZXJzO1xufVxuXG5cblxuLypcbiAqIEluaXRpYWxpemF0aW9uc1xuICovXG5cblxuXG5cblxuXG4vL1N0aWNrYWJsZVxuZnVuY3Rpb24gU3RpY2thYmxlKGVsLCBvcHRpb25zKSB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLl9pbml0KCk7XG59XG5cblN0aWNrYWJsZS5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5ib3VuZGFyeSA9IHNlbGYub3B0aW9ucy5ib3VuZGFyeSA/IHNlbGYub3B0aW9ucy5ib3VuZGFyeSA9PT0gdHJ1ZSA/IHNlbGYuZWwucGFyZW50Tm9kZSA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZi5vcHRpb25zLmJvdW5kYXJ5KSA6IHVuZGVmaW5lZDtcbiAgICBzZWxmLm9mZnNldCA9IHNlbGYub3B0aW9ucy5vZmZzZXQgfHwgMDtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZVNjcm9sbCgpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRSZWN0ID0gc2VsZi5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgIGVsZW1lbnRCb3R0b21PZmZzZXQgPSBlbGVtZW50UmVjdC50b3AgKyBlbGVtZW50UmVjdC5oZWlnaHQ7XG5cblxuICAgICAgICBpZiAoKHNlbGYub3B0aW9ucy5tYXhXaWR0aCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSBzZWxmLm9wdGlvbnMubWF4V2lkdGgpIHx8ICFzZWxmLm9wdGlvbnMubWF4V2lkdGgpIHtcbiAgICAgICAgICAgIGlmICghc2VsZi5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudFJlY3QudG9wIC0gc2VsZi5vcHRpb25zLm9mZnNldCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbGVtZW50T2Zmc2V0UGFyZW50ID0gc2VsZi5lbC5vZmZzZXRQYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW5pdGlhbE9mZnNldCA9IHNlbGYuZWwub2Zmc2V0VG9wO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoc2VsZi5vcHRpb25zLmNsYXNzIHx8ICdpcy1zdHVjaycpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS50b3AgPSBzZWxmLm9mZnNldC50b1N0cmluZygpICsgJ3B4JztcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRPZmZzZXRQYXJlbnRSZWN0ID0gc2VsZi5lbGVtZW50T2Zmc2V0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmJvdW5kYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBib3VuZGFyeVJlY3QgPSBzZWxmLmJvdW5kYXJ5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRhcnlCb3R0b21PZmZzZXQgPSBib3VuZGFyeVJlY3QudG9wICsgYm91bmRhcnlSZWN0LmhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudEJvdHRvbU9mZnNldCA+IGJvdW5kYXJ5Qm90dG9tT2Zmc2V0IHx8IGVsZW1lbnRSZWN0LnRvcCA8IHNlbGYub3B0aW9ucy5vZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUudG9wID0gTWF0aC5yb3VuZChib3VuZGFyeUJvdHRvbU9mZnNldCAtIGVsZW1lbnRSZWN0LmhlaWdodCkudG9TdHJpbmcoKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudFJlY3QudG9wID4gc2VsZi5vZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUudG9wID0gc2VsZi5vZmZzZXQudG9TdHJpbmcoKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub2Zmc2V0IDwgc2VsZi5pbml0aWFsT2Zmc2V0ICsgZWxlbWVudE9mZnNldFBhcmVudFJlY3QudG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS5wb3NpdGlvbiA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnRvcCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlUmVzaXplKCkge1xuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiBzZWxmLm9wdGlvbnMubWF4V2lkdGgpIHtcbiAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUucG9zaXRpb24gPSAnJztcbiAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUudG9wID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoYW5kbGVTY3JvbGwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib3B0aW1pemVkU2Nyb2xsXCIsIGhhbmRsZVNjcm9sbCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvcHRpbWl6ZWRSZXNpemVcIiwgaGFuZGxlUmVzaXplKTtcbn07XG5cbi8vUmVxdWlyZWQgRmllbGRzXG5mdW5jdGlvbiBub3JtYWxpemVSZXF1aXJlZENvdW50KCkge1xuICAgICQoJy5qcy1yZXF1aXJlZENvdW50JykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgdmFyIGNhcmQgPSAkKGVsKS5wYXJlbnRzKCcuY2FyZCcpLFxuICAgICAgICAgICAgY2FyZElkID0gY2FyZC5hdHRyKCdpZCcpLFxuICAgICAgICAgICAgZW1wdHlSZXF1aXJlZEZpZWxkc0NvdW50ID0gY2FyZC5maW5kKCcuanMtcmVxdWlyZWQnKS5sZW5ndGggLSBjYXJkLmZpbmQoJy5qcy1yZXF1aXJlZC5qcy1oYXNWYWx1ZScpLmxlbmd0aCxcbiAgICAgICAgICAgIG5hdkl0ZW0gPSAkKCcuanMtc2Nyb2xsU3B5TmF2IC5qcy1zY3JvbGxOYXZJdGVtW2RhdGEtaHJlZj1cIicgKyBjYXJkSWQgKyAnXCJdJyk7XG5cbiAgICAgICAgaWYgKGVtcHR5UmVxdWlyZWRGaWVsZHNDb3VudCA+IDApIHtcbiAgICAgICAgICAgIG5hdkl0ZW0uYWRkQ2xhc3MoJ2lzLXJlcXVpcmVkJyk7XG4gICAgICAgICAgICAkKGVsKS50ZXh0KGVtcHR5UmVxdWlyZWRGaWVsZHNDb3VudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuYXZJdGVtLnJlbW92ZUNsYXNzKCdpcy1yZXF1aXJlZCcpO1xuICAgICAgICAgICAgJChlbCkudGV4dCgnJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG4vL1BhZ2luYXRpb25cbmZ1bmN0aW9uIFBhZ2luYXRpb24oZWwsIHN0b3JlLCB1cGRhdGVGdW5jdGlvbikge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgdGhpcy51cGRhdGUgPSB1cGRhdGVGdW5jdGlvbjtcblxuICAgIHRoaXMuX2luaXQoKTtcbn1cblxuUGFnaW5hdGlvbi5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmVuZGVyUGFnaW5hdGlvbigpO1xuXG4gICAgZnVuY3Rpb24gaGFuZGxlUGFnZUNsaWNrKGUpIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0LmRhdGFzZXQudGFyZ2V0IHx8IGUudGFyZ2V0LnBhcmVudE5vZGUuZGF0YXNldC50YXJnZXQ7XG4gICAgICAgIHN3aXRjaCAodGFyZ2V0KSB7XG4gICAgICAgICAgICBjYXNlICdwcmV2JzpcbiAgICAgICAgICAgICAgICBzZWxmLnN0b3JlLnNldFBhZ2Uoc2VsZi5zdG9yZS5wYWdlIC0gMSA8IDAgPyAwIDogc2VsZi5zdG9yZS5wYWdlIC0gMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICduZXh0JzpcbiAgICAgICAgICAgICAgICBzZWxmLnN0b3JlLnNldFBhZ2Uoc2VsZi5zdG9yZS5wYWdlICsgMSA9PT0gc2VsZi5zdG9yZS5wYWdlc051bWJlcigpID8gc2VsZi5zdG9yZS5wYWdlc051bWJlcigpIC0gMSA6IHNlbGYuc3RvcmUucGFnZSArIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi51cGRhdGUoJCgnI2xpYnJhcnlCb2R5JyksIHNlbGYuc3RvcmUsIHJlbmRlckNvbnRlbnRSb3cpO1xuICAgICAgICByZW5kZXJQYWdpbmF0aW9uKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyUGFnaW5hdGlvbigpIHtcbiAgICAgICAgdmFyIGxpbmtzID0gJCgnPHVsPjwvdWw+JykuYWRkQ2xhc3MoJ3BhZ2luYXRpb25fX2xpc3QnKTtcbiAgICAgICAgc2VsZi5lbC5lbXB0eSgpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc3RvcmUucGFnZXNOdW1iZXIoKSk7XG5cbiAgICAgICAgaWYgKHNlbGYuc3RvcmUucGFnZXNOdW1iZXIoKSA+IDEpIHtcbiAgICAgICAgICAgIC8vUHJldlxuICAgICAgICAgICAgdmFyIHByZXZMaW5rID0gJCgnPGxpPjxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtbGVmdFwiPjwvaT48L2xpPicpLmFkZENsYXNzKCdwYWdpbmF0aW9uX19wcmV2JykuYXR0cignZGF0YS10YXJnZXQnLCAncHJldicpLmNsaWNrKGhhbmRsZVBhZ2VDbGljayk7XG4gICAgICAgICAgICBpZiAoc2VsZi5zdG9yZS5wYWdlID09PSAwKSB7cHJldkxpbmsuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7fVxuICAgICAgICAgICAgbGlua3MuYXBwZW5kKHByZXZMaW5rKTtcblxuICAgICAgICAgICAgLy9DdXJyZW50IHBhZ2UgaW5kaWNhdG9yXG4gICAgICAgICAgICAvL3ZhciBjdXJyZW50UGFnZSA9ICQoJzxsaT48L2xpPicpLmFkZENsYXNzKCdwYWdpbmF0aW9uX19jdXJyZW50JykudGV4dChzZWxmLnN0b3JlLnBhZ2UgKyAxKTtcbiAgICAgICAgICAgIC8vbGlua3MuYXBwZW5kKGN1cnJlbnRQYWdlKTtcblxuICAgICAgICAgICAgLy9OZXh0XG4gICAgICAgICAgICB2YXIgbmV4dExpbmsgPSAkKCc8bGk+PGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1yaWdodFwiPjwvaT48L2xpPicpLmFkZENsYXNzKCdwYWdpbmF0aW9uX19uZXh0JykuYXR0cignZGF0YS10YXJnZXQnLCAnbmV4dCcpLmNsaWNrKGhhbmRsZVBhZ2VDbGljayk7XG4gICAgICAgICAgICBpZiAoc2VsZi5zdG9yZS5wYWdlID09PSBzZWxmLnN0b3JlLnBhZ2VzTnVtYmVyKCkgLSAxKSB7bmV4dExpbmsuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7fVxuICAgICAgICAgICAgbGlua3MuYXBwZW5kKG5leHRMaW5rKTtcblxuICAgICAgICAgICAgc2VsZi5lbC5hcHBlbmQobGlua3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuZWw7XG4gICAgfVxuXG59O1xuXG5cblxuLy9HbG9iYWwgdmFyaWFibGVzXG52YXIgZWRpdGVkRmlsZXNEYXRhID0gW10sXG5lZGl0ZWRGaWxlRGF0YSA9IHt9LFxuY2xhc3NMaXN0ID0gW10sXG5kYXRhQ2hhbmdlZCA9IGZhbHNlLCAvL0NoYW5nZXMgd2hlbiB1c2VyIG1ha2UgYW55IGNoYW5nZXMgb24gZWRpdCBzY3JlZW47XG5sYXN0U2VsZWN0ZWQgPSBudWxsLCAvL0luZGV4IG9mIGxhc3QgU2VsZWN0ZWQgZWxlbWVudCBmb3IgbXVsdGkgc2VsZWN0O1xuZ2FsbGVyeU9iamVjdHMgPSBbXSxcbmRyYWZ0SXNTYXZlZCA9IGZhbHNlO1xuXG4vL05ldyBHYWxsZXJ5IE1lZGlhIHRhYlxuLy8gQ3JlYXRlIERPTSBlbGVtZW50IGZvciBGaWxlIGZyb20gZGF0YVxuZnVuY3Rpb24gY3JlYXRlRmlsZUVsZW1lbnQoZikge1xuICAgIHZhciBmaWxlRGF0YSA9IGYuZmlsZURhdGE7XG4gICAgLy9jcmVhdGUgYmFzaWMgZWxlbWVudFxuICAgIHZhciBmaWxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZSBmaWxlX3R5cGVfaW1nIGZpbGVfdmlld19ncmlkJyksXG4gICAgICAgIGZpbGVJbmRleCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2hpZGRlbiBmaWxlX19pZCcpLnRleHQoZmlsZURhdGEuaWQpLFxuXG4gICAgICAgIGZpbGVJbWcgPSAkKCc8ZGl2PjwvZGl2PicpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnZmlsZV9faW1nJylcbiAgICAgICAgICAgICAgICAgICAgLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIGZpbGVEYXRhLnVybCArICcpJyksXG4gICAgICAgIGZpbGVDb250cm9scyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2NvbnRyb2xzJykuY2xpY2sodG9nZ2xlRmlsZVNlbGVjdCksXG4gICAgICAgIGZpbGVDaGVja21hcmsgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX19jaGVja21hcmsnKS5jbGljayh0b2dnbGVGaWxlU2VsZWN0KSxcbiAgICAgICAgZmlsZURlbGV0ZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2RlbGV0ZScpLmNsaWNrKGhhbmRsZURlbGV0ZUNsaWNrKSxcbiAgICAgICAgZmlsZVR5cGUgPSAkKCc8ZGl2PjxpIGNsYXNzPVwiZmEgZmEtY2FtZXJhXCI+PC9pPjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190eXBlJyksXG4gICAgICAgIGZpbGVFZGl0ID0gJCgnPGJ1dHRvbj5FZGl0PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbiBidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnKS5jbGljayhoYW5kbGVGaWxlZEVkaXRCdXR0b25DbGljayksXG5cbiAgICAgICAgZmlsZVRpdGxlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fdGl0bGUgZmlsZV9fdGl0bGUtLW1lZGlhLWNhcmQnKS50ZXh0KGZpbGVEYXRhLnRpdGxlKSxcblxuICAgICAgICAvL2ZpbGVDYXB0aW9uID0gJCgnPHRleHRhcmVhPjwvdGV4dGFyZWE+JykuYWRkQ2xhc3MoJ2ZpbGVfX2NhcHRpb24gZmlsZV9fY2FwdGlvbl9tYWluJykudmFsKGZpbGVEYXRhLmNhcHRpb24pLFxuXG4gICAgICAgIGZpbGVQdXJwb3NlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fcHVycG9zZScpLFxuICAgICAgICBmaWxlUHVycG9zZVNlbGVjdCA9ICQoJzxkaXY+PC9kaXY+Jyk7XG5cbiAgICAgICAgZmlsZUVkaXRCdXR0b24gPSAkKCc8YnV0dG9uPkVkaXQ8L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uIGJ1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5IHUtdmlzaWJsZS14cyB1LW5vTWFyZ2luJykuY2xpY2soaGFuZGxlRmlsZWRFZGl0QnV0dG9uQ2xpY2spO1xuXG4gICAgZmlsZUNvbnRyb2xzLmFwcGVuZChmaWxlQ2hlY2ttYXJrLCBmaWxlRGVsZXRlLCBmaWxlVHlwZSwgZmlsZUVkaXQpO1xuICAgIGZpbGVJbWcuYXBwZW5kKGZpbGVDb250cm9scyk7XG5cbiAgICBmaWxlUHVycG9zZS5hcHBlbmQoZmlsZVB1cnBvc2VTZWxlY3QsIGZpbGVFZGl0QnV0dG9uKTtcbiAgICBwdXJwb3NlU2VsZWN0ID0gbmV3IFNlbGVjdGJveChmaWxlUHVycG9zZVNlbGVjdC5nZXQoMCksIHtcbiAgICAgICAgbGFiZWw6ICdVc2FnZScsXG4gICAgICAgIHBsYWNlaG9sZGVyOiAnU2VsZWN0IFVzYWdlJyxcbiAgICAgICAgaXRlbXM6IFsnUHJpbWFyeSBLZXkgYXJ0JywgJ1NlY29uZGFyeSBLZXkgYXJ0JywgJ0xvZ28nLCdCYWNrZ3JvdW5kJywgJ1RyYWlsZXInLCAnRnVsbCBFcGlzb2RlJywgJ1Byb21vJ10uc29ydCgpXG4gICAgfSk7XG5cbiAgICBmaWxlLmFwcGVuZChmaWxlSW5kZXgsIGZpbGVJbWcsIGZpbGVUaXRsZSwgZmlsZVB1cnBvc2UsIGZpbGVFZGl0QnV0dG9uKTtcblxuICAgIHJldHVybiBmaWxlO1xufVxuXG5mdW5jdGlvbiBhZGRGaWxlKGZpbGUpIHtcbiAgICB2YXIgZmlsZVNlY3Rpb24gPSAkKCcuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzJykuZ2V0KDApO1xuXG4gICAgJChmaWxlU2VjdGlvbikuYXBwZW5kKGZpbGUpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVHYWxsZXJ5KHNjcm9sbEluZGV4KSB7XG4gICAgc2luZ2xlc2VsZWN0ID0gZmFsc2U7XG4gICAgdmFyIGp1c3RVcGxvYWRlZCA9IGZhbHNlO1xuXG4gICAgLy8gUmVtZW1iZXIgcG9zaXRpb24gYW5kIHNlbGVjdGlvbiBvZiBmaWxlc1xuICAgICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgIHZhciBmaWxlID0gZ2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgIHJldHVybiBmLmZpbGVEYXRhLmlkID09PSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG4gICAgICAgIH0pWzBdO1xuICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgZmlsZS5wb3NpdGlvbiA9IGluZGV4O1xuICAgICAgICAgICAgZmlsZS5zZWxlY3RlZCA9ICQoZWwpLmhhc0NsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvL0NsZWFyIGZpbGVzIHNlY3Rpb25cbiAgICAkKCcuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzJykuZW1wdHkoKTtcblxuICAgIC8vU29ydCBhcnJheSBhY29yZGluZyBmaWxlcyBwb3NpdGlvblxuICAgIGdhbGxlcnlPYmplY3RzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gYS5wb3NpdGlvbiAtIGIucG9zaXRpb247XG4gICAgfSk7XG5cbiAgICAvL0NyZWF0ZSBmaWxlcyBmcm9tIGRhdGEgYW5kIGFkZCB0aGVtIHRvIHRoZSBwYWdlXG4gICAgZm9yICh2YXIgaSA9IDA7IGk8Z2FsbGVyeU9iamVjdHMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgIHZhciBmID0gZ2FsbGVyeU9iamVjdHNbaV0sXG4gICAgICAgICAgICBmaWxlID0gY3JlYXRlRmlsZUVsZW1lbnQoZik7XG5cbiAgICAgICAgaWYgKGYuc2VsZWN0ZWQpIHtmaWxlLmFkZENsYXNzKCdzZWxlY3RlZCcpO31cbiAgICAgICAgaWYgKGYuanVzdFVwbG9hZGVkKSB7XG4gICAgICAgICAgICBmaWxlLmFkZENsYXNzKCdqdXN0VXBsb2FkZWQnKTtcbiAgICAgICAgICAgIGYuanVzdFVwbG9hZGVkID0gZmFsc2U7XG4gICAgICAgICAgICBqdXN0VXBsb2FkZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGFkZEZpbGUoZmlsZSk7XG4gICAgfVxuXG4gICAgbm9ybWFsaXplU2VsZWN0ZWlvbigpO1xuICAgIG5vcm1hbGl6ZUluZGV4KCk7XG5cbiAgICAvKmlmIChqdXN0VXBsb2FkZWQpIHtcbiAgICAgICAgZWRpdEZpbGVzKCQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5qdXN0VXBsb2FkZWQnKSk7XG4gICAgfSovXG4gICAgaWYgKHNjcm9sbEluZGV4KSB7XG4gICAgICAgIHZhciBzY3JvbGxUb3AgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUnKS5sYXN0KCkub2Zmc2V0KCkudG9wO1xuICAgICAgICAkKCdib2R5JykuYW5pbWF0ZSh7XG4gICAgICAgICAgICBzY3JvbGxUb3A6IHNjcm9sbFRvcFxuICAgICAgICB9LCA0MDApO1xuICAgIH1cbn1cblxuLy9CbHVyYiBzZWN0aW9uIGluaXRpYWxpemVyXG5mdW5jdGlvbiBpbml0UG9zdExpc3QoZWwpIHtcbiAgZWwuYXBwZW5kKHJlbmRlclBvc3RMaXN0KCkpO1xuXG4gIGVsLmZpbmQoJ3RleHRhcmVhJykuZWxhc3RpYygpO1xuICBub3JtaWxpemVTZWN0aW9uKCk7XG59XG5cbi8vUmVuZGVyXG5mdW5jdGlvbiByZW5kZXJQb3N0TGlzdCgpIHtcbiAgdmFyIGxpc3QgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3NlY3Rpb25zLWxpc3QnKSxcbiAgYWRkSWNvbiA9ICQoJzxpIGNsYXNzPVwiZmEgZmEtcGx1cy1jaXJjbGVcIiAvPicpLFxuICBhZGRUZXh0ID0gJCgnPHNwYW4+IEFkZCBTZWN0aW9uPC9zcGFuPicpLFxuICBhZGRTZWN0aW9uID0gJCgnPGJ1dHRvbiAvPicpLmFkZENsYXNzKCdidXR0b24gYnV0dG9uX3N0eWxlX3RyYW5zcGFyZW50LWdyYXkgc2VjdGlvbnMtbGlzdF9fYWRkLXNlY3Rpb24nKS5jbGljayhoYW5kbGVBZGRTZWN0aW9uKS5hcHBlbmQoYWRkSWNvbiwgYWRkVGV4dCksXG4gIHNlY3Rpb24gPSByZW5kZXJTZWN0aW9uKDEpXG5cbiAgbGlzdC5zb3J0YWJsZSh7XG4gICAgaXRlbXM6ICcubGlzdF9fc2VjdGlvbicsXG4gICAgcGxhY2Vob2xkZXI6ICdsaXN0X19wbGFjZWhvbGRlcicsXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKGUsIHVpKSB7XG4gICAgICB1aS5pdGVtLmFkZENsYXNzKCdpcy1kcmFnZ2luZycpO1xuICAgICAgJChlLnRhcmdldCkuY3NzKCdoZWlnaHQnLCAkKGUudGFyZ2V0KS5oZWlnaHQoKSk7XG4gICAgICAkKCdib2R5JykuY3NzKCdoZWlnaHQnLCAkKCdib2R5JykuaGVpZ2h0KCkpO1xuICAgIH0sXG4gICAgc3RvcDogZnVuY3Rpb24oZSwgdWkpIHtcbiAgICAgIHVpLml0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLWRyYWdnaW5nJyk7XG4gICAgICAkKGUudGFyZ2V0KS5jc3MoJ2hlaWdodCcsICcnKTtcbiAgICAgICQoJ2JvZHknKS5jc3MoJ2hlaWdodCcsICcnKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBsaXN0LmFwcGVuZChzZWN0aW9uLCBhZGRTZWN0aW9uKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyU2VjdGlvbihpbmRleCwgZGF0YSkge1xuICB2YXIgc2VjdGlvbiA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnbGlzdF9fc2VjdGlvbicpLFxuICBzZWN0aW9uSW5kZXggPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3NlY3Rpb25fX2luZGV4JykudGV4dCgnQmx1cmIgJyArIGluZGV4KSxcbiAgc2VjdGlvblJlbW92ZSA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnc2VjdGlvbl9fcmVtb3ZlIGlzLWhpZGRlbicpLmNsaWNrKGhhbmRsZVJlbW92ZVNlY3Rpb24pLFxuICBzZWN0aW9uSGFuZGxlciA9ICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnc2VjdGlvbl9faGFuZGxlcicpO1xuXG4gIHJldHVybiBzZWN0aW9uLmFwcGVuZChzZWN0aW9uSGFuZGxlciwgc2VjdGlvbkluZGV4LCBzZWN0aW9uUmVtb3ZlLCByZW5kZXJTZWN0aW9uQ29udGVudChpbmRleCwgZGF0YSkpXG59XG5cbmZ1bmN0aW9uIHJlbmRlclNlY3Rpb25Db250ZW50KGluZGV4LCBkYXRhKSB7XG4gIHZhciBjb250ZW50ID0gJCgnPGRpdiAvPicpLmFkZENsYXNzKCdzZWN0aW9uX19jb250ZW50JyksXG4gIHRpdGxlID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgLz4nKSxcbiAgZGVzY3JpcHRpb24gPSAkKCc8dGV4dGFyZWEgLz4nKSxcbiAgdG9nZ2xlTGFiZWwgPSAkKCc8bGFiZWw+TWVkaWEgVHlwZTwvbGFiZWw+JykuYWRkQ2xhc3MoJ2MtbGFiZWwgYy1sYWJlbC0tdG9wJyksXG4gIHRvZ2dsZUl0ZW0xID0gJCgnPGxpIGRhdGEtdGFyZ2V0PVwibGlua1wiIGRhdGEtaW5kZXg9XCInKyBpbmRleCsgJ1wiPkVtYmVkZWQgTGluazwvbGk+JykuYWRkQ2xhc3MoJ2FjdGl2ZScpLmNsaWNrKGhhbmRsZUFzc2V0VG9nZ2xlKSxcbiAgdG9nZ2xlSXRlbTIgPSAkKCc8bGkgZGF0YS10YXJnZXQ9XCJmaWxlXCIgZGF0YS1pbmRleD1cIicrIGluZGV4KyAnXCI+QWRkIC8gVXBsb2FkPC9saT4nKS5jbGljayhoYW5kbGVBc3NldFRvZ2dsZSlcbiAgdG9nZ2xlR3JvdXAgPSAkKCc8dWwgZGF0YS1zZWN0aW9uPScgKyBpbmRleCArICc+PC91bD4nKS5hZGRDbGFzcygncmFkaW9Ub2dnbGUnKS5hcHBlbmQodG9nZ2xlSXRlbTEsIHRvZ2dsZUl0ZW0yKSxcbiAgbGluayA9ICQoJzxpbnB1dCB0eXBlPVwidGV4dFwiLz4nKSxcbiAgcGxhY2Vob2xkZXIgPSAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ3NlY3Rpb25fX3BsYWNlaG9sZGVyJykuYXR0cignZGF0YS1uYW1lJywgJ0ZpbGUnKTtcblxuICBjb250ZW50LmFwcGVuZCh0aXRsZS53cmFwKCc8ZGl2IGNsYXNzPVwiY29udHJvbHNfX2dyb3VwXCI+PC9kaXY+JykucGFyZW50KCksIGRlc2NyaXB0aW9uLndyYXAoJzxkaXYgY2xhc3M9XCJjb250cm9sc19fZ3JvdXBcIj48L2Rpdj4nKS5wYXJlbnQoKSwgdG9nZ2xlTGFiZWwud3JhcCgnPGRpdiBjbGFzcz1cImNvbnRyb2xzX19ncm91cCBjb250cm9sc19fZ3JvdXAtLWFzc2V0LXRvZ2dsZVwiPjwvZGl2PicpLnBhcmVudCgpLmFwcGVuZCh0b2dnbGVHcm91cCksIGxpbmsud3JhcCgnPGRpdiBjbGFzcz1cImNvbnRyb2xzX19ncm91cFwiICBpZD1cInNlY3Rpb25MaW5rJyArIGluZGV4ICsgJ1wiPjwvZGl2PicpLnBhcmVudCgpLCBwbGFjZWhvbGRlci53cmFwKCc8ZGl2IGNsYXNzPVwiY29udHJvbHNfX2dyb3VwIGNvbnRyb2xzX19ncm91cC0tcGxhY2Vob2xkZXIgaGlkZGVuXCIgaWQ9XCJzZWN0aW9uUGxhY2Vob2xkZXInICsgaW5kZXggKyAnXCI+PC9kaXY+JykucGFyZW50KCkpO1xuXG4gIHZhciBzZXRpb25UaXRsZUlucHV0ID0gbmV3IFRleHRmaWVsZCh0aXRsZS5nZXQoMCksIHtcbiAgICBsYWJlbDogJ0JsdXJiIFRpdGxlJ1xuICB9KTtcbiAgdmFyIHNldGlvbkRlc2NyaXB0aW9uSW5wdXQgPSBuZXcgVGV4dGZpZWxkKGRlc2NyaXB0aW9uLmdldCgwKSwge1xuICAgIGxhYmVsOiAnQmx1cmIgVGV4dCdcbiAgfSk7XG4gIGRlc2NyaXB0aW9uLmVsYXN0aWMoKTtcblxuICB2YXIgc2V0aW9uTGlua0lucHV0ID0gbmV3IFRleHRmaWVsZChsaW5rLmdldCgwKSwge1xuICAgIGxhYmVsOiAnRW1iZWRlZCBMaW5rJyxcbiAgICBwbGFjZWhvbGRlcjogJ2h0dHA6Ly8nXG4gIH0pO1xuXG4gIHBsYWNlaG9sZGVyQ29udHJvbCA9IG5ldyBJbWFnZVBsYWNlaG9sZGVyKHBsYWNlaG9sZGVyLmdldCgwKSwgbnVsbCwge2FsQnV0dG9uOiAnQWRkIEZpbGUnfSlcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuXG4vL0hhbmRsZXJcbmZ1bmN0aW9uIGhhbmRsZUFkZFNlY3Rpb24oZSkge1xuICB2YXIgaW5kZXggPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuc2VjdGlvbnMtbGlzdCcpLmZpbmQoJy5saXN0X19zZWN0aW9uJykubGVuZ3RoICsgMTtcbiAgdmFyIHNlY3Rpb24gPSByZW5kZXJTZWN0aW9uKGluZGV4KTtcbiAgJChlLnRhcmdldCkuYmVmb3JlKHNlY3Rpb24pO1xuICBzZWN0aW9uLmZpbmQoJ3RleHRhcmVhJykuZWxhc3RpYygpO1xuICBub3JtaWxpemVTZWN0aW9uKCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJlbW92ZVNlY3Rpb24oZSkge1xuICAkKGUudGFyZ2V0KS5wYXJlbnQoJy5saXN0X19zZWN0aW9uJykucmVtb3ZlKCk7XG4gIG5vcm1pbGl6ZVNlY3Rpb24oKTtcbn1cbmZ1bmN0aW9uIG5vcm1pbGl6ZVNlY3Rpb24oKSB7XG4gIHZhciBsZW5ndGggPSAkKCcubGlzdF9fc2VjdGlvbicpLmxlbmd0aDtcbiAgaWYgKGxlbmd0aCA+PSAyKSB7XG4gICAgJCgnLnNlY3Rpb25fX3JlbW92ZScpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKVxuICB9IGVsc2Uge1xuICAgICQoJy5zZWN0aW9uX19yZW1vdmUnKS5hZGRDbGFzcygnaXMtaGlkZGVuJylcbiAgfVxuICAkKCcubGlzdF9fc2VjdGlvbicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgJChlbCkuZmluZCgnLnNlY3Rpb25fX2luZGV4JykudGV4dCgnQmx1cmIgJyArIE1hdGgucm91bmQoaW5kZXggKyAxKSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gaGFuZGxlQXNzZXRUb2dnbGUoZSkge1xuICAkKGUudGFyZ2V0KS5wYXJlbnQoKS5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICBzd2l0Y2ggKGUudGFyZ2V0LmRhdGFzZXQudGFyZ2V0KSB7XG4gICAgY2FzZSAnbGluayc6XG4gICAgJCgnI3NlY3Rpb25MaW5rJysgZS50YXJnZXQuZGF0YXNldC5pbmRleCkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICQoJyNzZWN0aW9uUGxhY2Vob2xkZXInKyBlLnRhcmdldC5kYXRhc2V0LmluZGV4KS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgYnJlYWs7XG5cbiAgICBjYXNlICdmaWxlJzpcbiAgICAkKCcjc2VjdGlvbkxpbmsnKyBlLnRhcmdldC5kYXRhc2V0LmluZGV4KS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgJCgnI3NlY3Rpb25QbGFjZWhvbGRlcicrIGUudGFyZ2V0LmRhdGFzZXQuaW5kZXgpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICBicmVhaztcbiAgfVxufVxuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgLy9Db21tb24gaW5pdCBmdW5jdGlvbnMgZm9yIGFsbCBwYWdlc1xuICB2YXIgc2Nyb2xsUG9zaXRpb247XG4gIHZhciBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICBcbiAgLy9TdGlja3kgc2Nyb2xsYmFyXG4gIHN0aWNreVRvcGJhciA9IG5ldyBTdGlja3lUb3BiYXIoKTtcbiAgXG4gIC8vTm9ybWFsaXplcnNcbiAgbm9ybWlsaXplTWVudSgpO1xuICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gIG5vcm1hbGl6ZVNlbGVjdGVpb24oKTtcbiAgXG4gICQoJy5qcy1jb250ZW50IC5maWxlcyAuc2VjdGlvbl9fZmlsZXMnKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG4gIFxuICAvL0NoZWNrIGZvciByZXF1aXJlZCBmaWVsZHNcbiAgJCgnbGFiZWwucmVxdWllcmVkJykucGFyZW50KCkuY2hpbGRyZW4oJ2lucHV0Jykub24oJ2JsdXInLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGNoZWNrRmllbGQoZS50YXJnZXQpKSB7XG4gICAgICBtYXJrRmllbGRBc05vcm1hbChlLnRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hcmtGaWVsZEFzUmVxdWlyZWQoZS50YXJnZXQpO1xuICAgIH1cbiAgfSk7XG4gIFxuICBcbiAgXG4gIC8vQ2xpY2sgb24gbG9nb1xuICAkKCcuanMtbG9nbycpLmNsaWNrKGhhbmRsZUxvZ29DbGljayk7XG4gIGZ1bmN0aW9uIGhhbmRsZUxvZ29DbGljayhlKSB7XG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJ2NyZWF0ZScpID49IDAgJiZcbiAgICAhZHJhZnRJc1NhdmVkICYmXG4gICAgJCgnLmpzLWNvbnRlbnQgLmZpbGUsIC5qcy1jb250ZW50IC5qcy1oYXNWYWx1ZScpLmxlbmd0aCA+IDApIHtcbiAgICAgIG5ldyBNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAnTGVhdmUgUGFnZT8nLFxuICAgICAgICB0ZXh0OiAnWW91IHdpbGwgbG9zZSBhbGwgdW5zYXZlZCBjaGFuZ2VzLiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gbGVhdmUgdGhpcyBwYWdlPycsXG4gICAgICAgIGNvbmZpcm1UZXh0OiAnTGVhdmUgUGFnZScsXG4gICAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ2Rhc2hib2FyZC5odG1sJztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ2Rhc2hib2FyZC5odG1sJztcbiAgICB9XG4gIH1cbiAgXG4gIC8vQXNzZXQgTGlicmFyeVxuICBcbiAgJCgnI2FsQ2xvc2VCdXR0b24nKS5jbGljayhjbG9zZUFzc2V0TGlicmFyeSk7XG4gICQoJyNhbFRvcENsb3NlQnV0dG9uJykuY2xpY2soY2xvc2VBc3NldExpYnJhcnkpO1xuICAkKCcjYXNzZXRMaWJyYXJ5JykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIG9wZW5Bc3NldExpYnJhcnkoZSk7XG4gIH0pO1xuICBmdW5jdGlvbiBvcGVuQXNzZXRMaWJyYXJ5KGUsIG9wdGlvbnMpIHtcbiAgICBzY3JvbGxQb3NpdGlvbiA9ICQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcbiAgICB1cGRhdGVBc3NldExpYnJhcnkoKTtcbiAgICAkKCcjYWwnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgJCgnI2FsJykuYWRkQ2xhc3MoJ21vZGFsJyk7XG4gICAgJCgnI3dyYXBwZXInKS5hZGRDbGFzcygnb3ZlcmZsb3cnKTtcbiAgICBzaW5nbGVzZWxlY3QgPSBmYWxzZTtcbiAgICAkKCcjYWRkRnJvbUFMQnV0dG9uJykudGV4dCgnQWRkIEZpbGVzJyk7XG4gIFxuICAgICQoJyNhZGRGcm9tQUxCdXR0b24nKS5jbGljayhhZGRGaWxlc0Zyb21Bc3NldExpYnJhcnkpO1xuICAgIHNldE1vZGFsS2V5Ym9hcmRBY3Rpb25zKGFkZEZpbGVzRnJvbUFzc2V0TGlicmFyeSwgY2xvc2VBc3NldExpYnJhcnkpO1xuICAgICQoZS50YXJnZXQpLmJsdXIoKTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gYWRkRmlsZXNGcm9tQXNzZXRMaWJyYXJ5KCl7XG4gICAgbGFzdFNlbGVjdGVkID0gbnVsbDtcbiAgICBhZGRTZWxlY3RlZEZpbGVzKCk7XG4gICAgY2xvc2VBc3NldExpYnJhcnkoKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG4gIH1cbiAgZnVuY3Rpb24gY2xvc2VBc3NldExpYnJhcnkoKSB7XG4gICAgbGFzdFNlbGVjdGVkID0gbnVsbDtcbiAgICAkKCcuYWwgLmZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZS5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgIGRlc2VsZWN0QWxsKCk7XG4gICAgJCgnLm1vZGFsJykuYWRkQ2xhc3MoJ2hpZGRlbicpLnJlbW92ZUNsYXNzKCdtb2RhbCcpO1xuICAgICQoJyN3cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ292ZXJmbG93Jyk7XG4gICAgJCgnI2FkZEZyb21BTEJ1dHRvbicpLnVuYmluZCgnY2xpY2snKTtcbiAgICAkKCdib2R5Jykuc2Nyb2xsVG9wKHNjcm9sbFBvc2l0aW9uKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG4gIH1cbiAgXG4gICQoJyNhbCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAkKCcjYWwgLmZpbGVzIC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gIH0pO1xuICAkKCcjYWwgLmZpbGVzIC5zZWN0aW9uX19maWxlcycpLmRpc2FibGVTZWxlY3Rpb24oKTtcbiAgXG4gIC8vVXBsb2FkIGZpbGVzXG4gICQoJyN1cGxvYWRGaWxlcycpLmNsaWNrKGhhbmRsZVVwbG9hZEZpbGVzQ2xpY2spO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBoYW5kbGVEcmFnRW50ZXIsIHRydWUpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGhhbmRsZURyYWdPdmVyLCBmYWxzZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBoYW5kbGVEcm9wLCBmYWxzZSk7XG4gIFxuICAvL0RyYWZ0IGZ1bmN0aW9uOiBTYXZlLCBDYW5jZWwsIFB1Ymxpc2hcbiAgZnVuY3Rpb24gc2F2ZURyYWZ0KCkge1xuICAgIHNob3dOb3RpZmljYXRpb24oJ1RoZSBkcmFmdCBpcyBzYXZlZC4nKTtcbiAgICBkcmFmdElzU2F2ZWQgPSB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIHJlbW92ZURyYWZ0KCkge1xuICAgIG5ldyBNb2RhbCh7XG4gICAgICB0aXRsZTogJ0NhbmNlbCB0aGlzIERyYWZ0PycsXG4gICAgICB0ZXh0OiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGNhbmNlbCBhbmQgZGlzY2FyZCB0aGlzIGRyYWZ0PycsXG4gICAgICBjb25maXJtVGV4dDogJ0NhbmNlbCcsXG4gICAgICBjb25maXJtQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnZGFzaGJvYXJkLmh0bWwnO1xuICAgICAgfSxcbiAgICAgIGNhbmNlbEFjdGlvbjogaGlkZU1vZGFsUHJvbXB0XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gcHVibGlzaERyYWZ0KCkge1xuICAgIHZhciBpdGVtTmFtZSA9ICQoJy5tZW51IC5pcy1hY3RpdmUnKS50ZXh0KCksXG4gICAgcHJvbXB0TXNnID0gJyc7XG4gIFxuICAgIHN3aXRjaCAoaXRlbU5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgY2FzZSAncGVyc29uJzpcbiAgICAgIHByb21wdE1zZyA9ICdQdWJsaXNoZWQgcGVyc29uIHdpbGwgYmVjb21lIGF2YWlsYWJsZSB0byBiZSBhZGRlZCBhcyBwYXJ0IG9mIGEgY2FzdCBmb3IgYSBzZWFzb24vZXZlbnQuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwdWJsaXNoIGl0Pyc7XG4gICAgICBicmVhaztcbiAgXG4gICAgICBjYXNlICdyb2xlJzpcbiAgICAgIHByb21wdE1zZyA9ICdQdWJsaXNoZWQgcm9sZSB3aWxsIGJlY29tZSBhdmFpbGFibGUgdG8gYmUgYWRkZWQgYXMgcGFydCBvZiBhIGNhc3QgZm9yIGEgc2Vhc29uL2V2ZW50LiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHVibGlzaCBpdD8nO1xuICAgICAgYnJlYWs7XG4gIFxuICAgICAgZGVmYXVsdDpcbiAgICAgIHByb21wdE1zZyA9ICdQdWJsaXNoZWQgJyArIGl0ZW1OYW1lLnRvTG93ZXJDYXNlKCkgKyAnIHdpbGwgYmVjb21lIGF2YWlsYWJsZSBvbiB0aGUgbGl2ZSBzaXRlLiBBcmUgeW91IHN1cmUgeW91IHdvdWxkIGxpa2UgdG8gcHVibGlzaCBpdD8nO1xuICAgICAgYnJlYWs7XG4gIFxuICAgIH1cbiAgICBuZXcgTW9kYWwoe1xuICAgICAgdGl0bGU6ICdQdWJsaXNoIHRoaXMgJyArIGl0ZW1OYW1lICsgJz8nLFxuICAgICAgdGV4dDogcHJvbXB0TXNnLFxuICAgICAgY29uZmlybVRleHQ6ICdQdWJsaXNoJyxcbiAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICBoaWRlTW9kYWxQcm9tcHQoKTtcbiAgICAgICAgc2hvd05vdGlmaWNhdGlvbihpdGVtTmFtZSArICcgaXMgcHVibGlzaGVkLicpO1xuICAgICAgICBkcmFmdElzU2F2ZWQgPSB0cnVlO1xuICAgICAgfSxcbiAgICAgIGNhbmNlbEFjdGlvbjogaGlkZU1vZGFsUHJvbXB0XG4gICAgfSk7XG4gIH1cbiAgXG4gICQoJyNzYXZlRHJhZnQnKS5jbGljayhzYXZlRHJhZnQpO1xuICAkKCcjcmVtb3ZlRHJhZnQnKS5jbGljayhyZW1vdmVEcmFmdCk7XG4gICQoJyNwdWJsaXNoRHJhZnQnKS5jbGljayhwdWJsaXNoRHJhZnQpO1xuICBcbiAgLy9Ub3AgYmFyIGFjdGlvbnMgZHJvcGRvd24gZm9yIG1vYmlsZVxuICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGlvbkRyb3Bkb3duJykpIHtcbiAgICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGlvbkRyb3Bkb3duJyksXG4gICAgICB7XG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1jaGVja1wiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgU2F2ZSBhcyBkcmFmdDwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IHNhdmVEcmFmdFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1iYW5cIj48L2k+PHNwYW4gY2xhc3M9XCJidXR0b25UZXh0XCI+ICBDYW5jZWw8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiByZW1vdmVEcmFmdFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgICk7XG4gIH1cbiAgXG4gIC8vRmlsZXMgbW9yZSBhY3Rpb24gZHJvcGRvd25zXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9yZUFjdGlvbnMnKSkge1xuICAgIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9yZUFjdGlvbnMnKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICdTZW5kIHRvIHRvcCcsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlU2VuZFRvVG9wQ2xpY2tcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJ1NlbmQgdG8gYm90dG9tJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVTZW5kVG9Cb3R0b21DbGlja1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgICk7XG4gIH1cbiAgXG4gIC8vTWVkaWEgY2FyZCBkcm9wZG93bnNcbiAgLy9TbWFsbFxuICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lZGlhQWN0aW9uc1NtYWxsJykpIHtcbiAgICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lZGlhQWN0aW9uc1NtYWxsJyksXG4gICAgICB7XG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS11cGxvYWRcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIFVwbG9hZCBmaWxlczwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZVVwbG9hZEZpbGVzQ2xpY2tcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtZm9sZGVyLW9wZW5cIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIEFkZCBmcm9tIGxpYnJhcnk8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIG9wZW5Bc3NldExpYnJhcnkoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICAvL0Z1bGxcbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZWRpYUFjdGlvbnNGdWxsJykpIHtcbiAgICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lZGlhQWN0aW9uc0Z1bGwnKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXBlbmNpbC1zcXVhcmVcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIE11bHRpIEVkaXQ8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVNdWx0aUVkaXRCdXR0b25DbGljayxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI211bHRpRWRpdCcpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtdGltZXMtY2lyY2xlXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBSZW1vdmU8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVCdWxrUmVtb3ZlQ2xpY2ssXG4gICAgICAgICAgICBkaXNhYmxlZDogZnVuY3Rpb24oKSB7cmV0dXJuICQoJyNidWxrUmVtb3ZlJykuaGFzQ2xhc3MoJ2Rpc2FibGVkJyk7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGl2aWRlcjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS11cGxvYWRcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIFVwbG9hZCBmaWxlczwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZVVwbG9hZEZpbGVzQ2xpY2tcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtZm9sZGVyLW9wZW5cIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIEFkZCBmcm9tIGxpYnJhcnk8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIG9wZW5Bc3NldExpYnJhcnkoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBcbiAgLy9Bc3NldCBsaWJyYXJ5IGRyb3Bkb3duc1xuICAvL1NtYWxsXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNzZXRBY3Rpb25zU21hbGwnKSkge1xuICAgIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNzZXRBY3Rpb25zU21hbGwnKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgVXBsb2FkIGZpbGVzPC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlVXBsb2FkRmlsZXNDbGlja1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgICk7XG4gIH1cbiAgLy9GdWxsXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNzZXRBY3Rpb25zRnVsbCcpKSB7XG4gICAgdmFyIHBhZ2VBY3Rpb25Ecm9wZG93biA9IG5ldyBEcm9wZG93bihcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc3NldEFjdGlvbnNGdWxsJyksXG4gICAgICB7XG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1wZW5jaWxcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIEJ1bGsgRWRpdDwvc3Bhbj48c3BhbiBjbGFzcz1cImRyb3Bkb3duX193YXJuaW5nXCI+PC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2ssXG4gICAgICAgICAgICBkaXNhYmxlZDogZnVuY3Rpb24oKSB7cmV0dXJuICQoJyNidWxrRWRpdCcpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO30sXG4gICAgICAgICAgICB3YXJuaW5nOiBmdW5jdGlvbigpIHtyZXR1cm4gISQoJyNidWxrRWRpdCcpLmNoaWxkcmVuKCcuYnV0dG9uX193YXJuaW5nJykuaGFzQ2xhc3MoJ2lzLWhpZGRlbicpO31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtcGVuY2lsLXNxdWFyZVwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgTXVsdGkgRWRpdDwvc3Bhbj48c3BhbiBjbGFzcz1cImRyb3Bkb3duX193YXJuaW5nXCI+PC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2ssXG4gICAgICAgICAgICBkaXNhYmxlZDogZnVuY3Rpb24oKSB7cmV0dXJuICQoJyNtdWx0aUVkaXQnKS5oYXNDbGFzcygnZGlzYWJsZWQnKTt9LFxuICAgICAgICAgICAgd2FybmluZzogZnVuY3Rpb24oKSB7cmV0dXJuICEkKCcjbXVsdGlFZGl0JykuY2hpbGRyZW4oJy5idXR0b25fX3dhcm5pbmcnKS5oYXNDbGFzcygnaXMtaGlkZGVuJyk7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS10aW1lcy1jaXJjbGVcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIFJlbW92ZTwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZUJ1bGtSZW1vdmVDbGljayxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI2J1bGtSZW1vdmUnKS5oYXNDbGFzcygnZGlzYWJsZWQnKTt9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkaXZpZGVyOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgVXBsb2FkIGZpbGVzPC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlVXBsb2FkRmlsZXNDbGlja1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgICk7XG4gIH1cbiAgXG4gIFxuICAvL0luaXQgcGxhY2Vob2xkZXJzIGZvciBpbWFnZXMgaWYgYW55IChjb3ZlciwgZXRjLilcbiAgd2luZG93LmltYWdlUGxhY2Vob2xkZXJzID0gaW5pdEltYWdlUGxhY2Vob2xkZXJzKCk7XG4gIFxuICAvL0ZvY2FsIHBvaW50XG4gICQoJyNmb2NhbFBvaW50VG9nZ2xlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICQoZS50YXJnZXQpLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUgYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUgYnV0dG9uX3N0eWxlX291dGxpbmUtYWNjZW50Jyk7XG4gICAgJCgnLnByID4gLnByZXZpZXcnKS50b2dnbGVDbGFzcygnZm9jYWwgbGluZSBwb2ludCcpO1xuICBcbiAgfSk7XG4gIC8qIEhhbmRsZSBQdXJwb3NlcyBzY3JvbGwgKi9cbiAgJCgnI3B1cnBvc2VXcmFwcGVyJykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuICAgIHNldFB1cnBvc2VQYWdpbmF0aW9uKCk7XG4gIH0pO1xuICBcbiAgJCgnI2ZvY2FsUG9pbnQnKS5kcmFnZ2FibGUoe1xuICAgIGNvbnRhaW5tZW50OiBcIiNwcmV2aWV3SW1nXCIsXG4gICAgc2Nyb2xsOiBmYWxzZSAsXG4gICAgc3RvcDogZnVuY3Rpb24oZSkge1xuICAgICAgYWRqdXN0Rm9jYWxQb2ludCgpO1xuICAgICAgYWRqdXN0UHVycG9zZSgkKGUudGFyZ2V0KSk7XG4gICAgICBkYXRhQ2hhbmdlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcbiAgLyogSW5pdCBQdXJwb3NlIFBhZ2luYXRvciAqL1xuICBcbiAgZnVuY3Rpb24gc2V0UHVycG9zZVBhZ2luYXRpb24oKSB7XG4gICAgdmFyIHNjcm9sbE9mZnNldCA9ICQoJyNwdXJwb3NlV3JhcHBlcicpLnNjcm9sbExlZnQoKTtcbiAgICB2YXIgd2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHVycG9zZVdyYXBwZXInKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICB2YXIgZmlyc3RJbmRleCA9IE1hdGguZmxvb3Ioc2Nyb2xsT2Zmc2V0LzE0MCkgKyAxO1xuICAgIHZhciBsYXN0SW5kZXggPSBmaXJzdEluZGV4ICsgTWF0aC5yb3VuZCh3aWR0aC8xNDApIC0gMTtcbiAgICB2YXIgY291bnQgPSAkKCcjcHVycG9zZVdyYXBwZXIgLnB1cnBvc2UnKS5sZW5ndGg7XG4gIFxuICAgIGxhc3RJbmRleCA9IGxhc3RJbmRleCA8IGNvdW50ID8gbGFzdEluZGV4IDogY291bnQ7XG4gIFxuICAgICQoJyNwLXBhZ2luYXRvcicpLnRleHQoZmlyc3RJbmRleCArICcg4oCUICcgKyBsYXN0SW5kZXggKyAnIG9mICcgKyBjb3VudCk7XG4gIH1cbiAgXG4gICQoJyNzaG93UHJldmlldycpLmNsaWNrKHNob3dBbGxQcmV2aWV3cyk7XG4gICQoJyNoaWRlUHVycG9zZScpLmNsaWNrKGhpZGVBbGxQcmV2aWV3cyk7XG4gICQoJyNsb2FkTW9yZScpLmNsaWNrKGhhbmRsZVNob3dNb3JlKTtcbiAgXG4gIGZ1bmN0aW9uIHNob3dBbGxQcmV2aWV3cygpIHtcbiAgICAkKCcjcHVycG9zZXMnKS5hZGRDbGFzcygnaXMtb3BlbicpO1xuICAgICQoJyNwcmV2aWV3SW1hZ2UnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgJCgnI3ByZXZpZXdDb250cm9scycpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgXG4gICAgLy9DaGVjayBpZiBpdCBpcyBhIG1vYmlsZSBzY3JlZW5cbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCA2NTApIHtcbiAgICAgICQoXCIjcHVycG9zZXMgLmMtUHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlXCIpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICQoXCIjcHVycG9zZXMgLmMtUHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlLmhpZGRlblwiKS5zbGljZSgwLCA1KS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAkKCcjbG9hZE1vcmUnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgfVxuICAgIC8vJCgnLnByZXZpZXcuZm9jYWwnKS5hZGRDbGFzcygnZnVsbCcpLnJlbW92ZUNsYXNzKCdsaW5lJyk7XG4gICAgLy8kKCcjcHVycG9zZVRvZ2dsZScpLmNoaWxkcmVuKCdzcGFuJykudGV4dCgnSGlkZSBQcmV2aWV3Jyk7XG4gIH1cbiAgZnVuY3Rpb24gaGlkZUFsbFByZXZpZXdzKCkge1xuICAgICQoJyNwdXJwb3NlcycpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XG4gICAgJCgnI3ByZXZpZXdJbWFnZScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAkKCcjcHJldmlld0NvbnRyb2xzJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZVNob3dNb3JlKGUpIHtcbiAgICAkKFwiI3B1cnBvc2VzIC5jLVB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZS5oaWRkZW5cIikuc2xpY2UoMCwgNSkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgIGlmICgkKFwiI3B1cnBvc2VzIC5jLVB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZS5oaWRkZW5cIikubGVuZ3RoID09PSAwKSB7XG4gICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgfVxuICB9XG4gIFxuICBcbiAgLy9TZWxlY3RlZCBGaWxlcyBhY3Rpb25zXG4gICQoJyNidWxrRWRpdCcpLmNsaWNrKGhhbmRsZUJ1bGtFZGl0QnV0dG9uQ2xpY2spO1xuICAkKCcjbXVsdGlFZGl0JykuY2xpY2soaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2spO1xuICAkKCcjYnVsa1JlbW92ZScpLmNsaWNrKGhhbmRsZUJ1bGtSZW1vdmVDbGljayk7XG4gIFxuICBmdW5jdGlvbiBoYW5kbGVCdWxrUmVtb3ZlQ2xpY2soKSB7XG4gICAgdmFyIGZpbGVzVG9EZWxldGUgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKSxcbiAgICBpdGVtTmFtZSA9ICQoJy5tZW51IC5pcy1hY3RpdmUnKS50ZXh0KCkudG9Mb3dlckNhc2UoKSxcbiAgICBhc3NldExpYnJhcnkgPSBpdGVtTmFtZSA9PT0gJ2Fzc2V0IGxpYnJhcnknLFxuICAgIG1zZ1RpdGxlID0gYXNzZXRMaWJyYXJ5PyAnRGVsZXRlIEFzc2V0cz8nIDogJ1JlbW92ZSBBc3NldHM/JyxcbiAgICBtZXNnVGV4dCA9IGFzc2V0TGlicmFyeT8gJ1NlbGVjdGVkIGFzc2V0KHMpIHdpbGwgYmUgZGVsZXRlZCBmcm9tIHRoZSBhc3NldCBsaWJyYXJ5LiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoZW0/JyA6ICdTZWxlY3RlZCBhc3NldChzKSB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGlzICcgKyBpdGVtTmFtZSArICcuIERvbuKAmXQgd29ycnksIGl0IHdvbuKAmXQgYmUgZGVsZXRlZCBmcm9tIHRoZSBBc3NldCBMaWJyYXJ5LicsXG4gICAgYnRuTmFtZSA9IGFzc2V0TGlicmFyeT8gJ0RlbGV0ZScgOiAnUmVtb3ZlJztcbiAgICBuZXcgTW9kYWwoe1xuICAgICAgdGl0bGU6IG1zZ1RpdGxlLFxuICAgICAgdGV4dDogbWVzZ1RleHQsXG4gICAgICBjb25maXJtVGV4dDogYnRuTmFtZSxcbiAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICBmaWxlc1RvRGVsZXRlLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICAgICB2YXIgaWQgPSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG4gICAgICAgICAgZGVsZXRlRmlsZUJ5SWQoaWQsIGdhbGxlcnlPYmplY3RzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHVwZGF0ZUdhbGxlcnkoKTtcbiAgICAgIH0sXG4gICAgICBjYW5jZWxBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2JyJykucmVtb3ZlQ2xhc3MoJ3NicicpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIFxuICAvL0ZpbGUgRWRpdCBTYXZlIGFuZCBDYW5jZWxcbiAgJCgnI3NhdmVDaGFuZ2VzJykuY2xpY2soc2F2ZUltYWdlRWRpdCk7XG4gICQoJyNjYW5jZWxDaGFuZ2VzJykuY2xpY2soY2FuY2VsSW1hZ2VFZGl0KTtcbiAgJCgnI2ZwVG9wQ2xvc2VCdXR0b24nKS5jbGljayhjYW5jZWxJbWFnZUVkaXQpO1xuICBcbiAgLy9GaWxlIEVkaXQgZmllbGQgY2hhbmdlc1xuICAkKCcjdGl0bGUnKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKSB7c2F2ZVRpdGxlKCk7fSk7XG4gICQoJyNjYXB0aW9uJykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVDYXB0aW9uKCk7fSk7XG4gICQoJyNkZXNjcmlwdGlvbicpLm9uKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtzYXZlRGVzY3JpcHRpb24oKTt9KTtcbiAgJCgnI3Jlc29sdXRpb24nKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge3NhdmVSZXNvbHV0aW9uKCk7fSk7XG4gICQoJyNhbHRUZXh0Jykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVBbHRUZXh0KCk7fSk7XG4gIFxuICAvL0hhbmRsZSBzZWxlY3Rpb25zXG4gICQoJyNzZWxlY3RBbGwnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgaWYgKCQoZS50YXJnZXQpLmhhc0NsYXNzKCdlbXB0eScpKSB7XG4gICAgICBzZWxlY3RBbGwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVzZWxlY3RBbGwoKTtcbiAgICB9XG4gIH0pO1xuICAkKCcjZGVzZWxlY3RBbGwnKS5jbGljayhmdW5jdGlvbihlKSB7ZGVzZWxlY3RBbGwoKTt9KTtcbiAgXG4gIC8vSW5pdCBhZGRhYmxlIGZpZWxkc1xuICBpbml0QWRkYWJsZUZpZWxkcygpO1xuICBcbiAgXG4gIFxuICBcbiAgXG4gIC8vYXV0b2V4cGFuZGFibGUgdGV4dGFyZWFcbiAgJCggJ3RleHRhcmVhJyApLmVsYXN0aWMoKTtcbiAgXG4gIFxuICBcbiAgLypcbiAgKiBDYXJkc1xuICAqL1xuICBcbiAgLy9Gb2xkYWJsZSBjYXJkc1xuICAkKCcuanMtZm9sZGFibGUgLmpzLWZvbGRlZFRvZ2dsZScpLmNsaWNrKGhhbmRsZUZvbGRlZFRvZ2dsZUNsaWNrKTtcbiAgZnVuY3Rpb24gaGFuZGxlRm9sZGVkVG9nZ2xlQ2xpY2soZSkge1xuICAgIHZhciBjYXJkID0gJChlLnRhcmdldCkucGFyZW50cygnLmpzLWZvbGRhYmxlJyk7XG4gICAgaWYgKGNhcmQuaGFzQ2xhc3MoJ2lzLWZvbGRlZCcpKSB7XG4gICAgICBjYXJkLnJlbW92ZUNsYXNzKCdpcy1mb2xkZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FyZC5hZGRDbGFzcygnaXMtZm9sZGVkJyk7XG4gICAgfVxuICB9XG4gIC8vU3RpY2t5IGNhcmQgaGVhZGVyXG4gICQoJy5qcy1zdGlja3lPbk1vYmlsZScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgdmFyIHN0aWNreSA9IG5ldyBTdGlja2FibGUoZWwsIHtcbiAgICAgIG1heFdpZHRoOiA2MDAsXG4gICAgICBib3VuZGFyeTogdHJ1ZSxcbiAgICAgIG9mZnNldDogNTBcbiAgICB9KTtcbiAgfSk7XG4gICQoJy5qcy1zZWN0aW9uVGl0bGUnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgIHZhciBzdGlja3kgPSBuZXcgU3RpY2thYmxlKGVsLCB7XG4gICAgICBtYXhXaWR0aDogNjAwLFxuICAgICAgYm91bmRhcnk6ICcjbWVkaWEtY2FyZCcsXG4gICAgICBvZmZzZXQ6IDEwNFxuICAgIH0pO1xuICB9KTtcbiAgXG4gIC8vQW5pbWF0aW9uIGVuZCBoYW5kbGVcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBzd2l0Y2ggKGUuYW5pbWF0aW9uTmFtZSkge1xuICAgICAgY2FzZSAnY29sbGVjdGlvbkl0ZW0tcHVsc2Utb3V0JzpcbiAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdpcy1hcHBlYXJpbmcnKTtcbiAgICAgIHJldHVybiBlO1xuICBcbiAgICAgIGNhc2UgJ2ltZy13cmFwcGVyLXNsaWRlLWxlZnQnOlxuICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2lzLXNsaWRpbmdMZWZ0Jyk7XG4gICAgICByZXR1cm4gZTtcbiAgXG4gICAgICBjYXNlICdpbWctd3JhcHBlci1zbGlkZS1yaWdodCc6XG4gICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnaXMtc2xpZGluZ1JpZ2h0Jyk7XG4gICAgICByZXR1cm4gZTtcbiAgXG4gICAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGU7XG4gICAgfVxuICB9KTtcbiAgXG4gIFxuICBcbiAgXG4gIC8vUmVjdXJyaW5nIHRvZ2dsZVxuICAkKCcjcmVjdXJyaW5nVG9nZ2xlJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoZS50YXJnZXQuY2hlY2tlZCkge1xuICAgICAgJCgnI3JlY3VyaW5nVGltZScpLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcjcmVjdXJpbmdUaW1lJykuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgfVxuICB9KTtcblxuXG4gIC8vUG9zdCB0aXRsZSBhbmQgdGl0bGUgaW5wdXRcbiAgaWYgKCQoJyNwb3N0VGl0bGVJbnB1dCcpLmdldCgwKSkge1xuICAgIHZhciBwb3N0VGl0bGVJbnB1dCA9IG5ldyBUZXh0ZmllbGQoJCgnI3Bvc3RUaXRsZUlucHV0JykuZ2V0KDApLCB7XG4gICAgICBsYWJlbDogJ1RpdGxlJyxcbiAgICAgIGhlbHBUZXh0OiAnTWF1cmlzIG1hbGVzdWFkYSBuaWJoIG5lYyBsZW8gcG9ydGEgbWF4aW11cy4nLFxuICAgICAgZXJyTXNnOiAnUGxlYXNlIGZpbGwgdGhlIHRpdGxlJyxcbiAgICAgIG9uSW5wdXQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgJCgnI3Bvc3RUaXRsZVRleHQnKS50ZXh0KGUudGFyZ2V0LnZhbHVlIHx8ICdOZXcgUG9zdCcpO1xuICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgJCgnLmhlYWRlcl9fc3ViaGVhZCcpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvL0luaXQgYmx1cmIgc2VjdGlvblxuICBpZiAoJCgnI3Bvc3RMaXN0JykubGVuZ3RoID4gMCkge1xuICAgIGluaXRQb3N0TGlzdCgkKCcjcG9zdExpc3QnKSk7XG4gIH1cbn0pOyJdLCJmaWxlIjoiY3JlYXRlLXBvc3QuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
