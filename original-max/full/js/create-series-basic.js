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


/*
//Global variables
var editedFilesData = [],
editedFileData = {},
classList = [],
dataChanged = false, //Changes when user make any changes on edit screen;
lastSelected = null, //Index of last Selected element for multi select;
galleryObjects = [],
draftIsSaved = false;*/


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


  //Update Media Tab files
  updateAssetLibrary();
  normalizeSelecteion();

/*
  //Files section
  $('.js-content .files .section__files').disableSelection();
  $('.js-content .section__files').sortable({
    placeholder: 'file--placeholder',
    cursor: '-webkit-grabbing',
    start: function(e, ui) {
      var selectedImages = $('.js-content .files .file.selected');
      if (selectedImages.length > 0 ) {
        draggableImages = $('.js-content .files .file.selected').not(ui.item).clone(true);
        selectedImages = $('.js-content .files .file.selected').not(ui.item).clone(true);

        //Create files copies to Drag
        var targetFile_1 = ui.item.clone(true);
        var targetFile_2 = ui.item.clone(true);
        draggableImages = targetFile_1.add(draggableImages);//will past on a page after dragging stop
        selectedImages = selectedImages.add(targetFile_2);//this elements will dragging by user
        selectedImages.find('.file__arragement, .file__controls, .file__title, .file__caption').remove();

        selectedImages
        .removeClass('file_view_grid')
        .css('width', 250)
        .css('height', 170);

        selectedImages.each(function(i, el) {
          $(el).css('transform', 'rotate(' + Math.floor(Math.random()*60 - 60)/10 + 'deg) translate(' + Math.floor(Math.random()*200 - 200)/10 + 'px, ' + Math.floor(Math.random()*200 - 200)/10 + 'px)' );
        });

        $('.js-content .files .file.selected').not(ui.item).remove();
        draggableImages.addClass('file_dragging');
        ui.item.removeClass('file').addClass('dragFilesWrapper');
        ui.item.empty();
        ui.item.append(selectedImages);

        $('.js-content .section__files').sortable( "refresh" );
      } else {
        ui.item.addClass('is-dragging');
      }
    },
    stop: function(e, ui) {
      if (ui.item.hasClass('dragFilesWrapper')) {
        ui.item.after(draggableImages.removeAttr('style'));
        ui.item.remove();
        $(".selected").removeClass("file_dragging");
      } else {
        ui.item.removeClass('is-dragging');
      }
      $('.files .section__files .file').removeAttr('style');
      normalizeIndex();
    }
  });

  //Selected Files actions
  $('#multiEdit').click(handleMultiEditButtonClick);
  $('#bulkEdit').click(handleBulkEditButtonClick);
  $('#bulkRemove').click(function() {
    var filesToDelete = $('.ct .files .file.selected');
    showModalPrompt({
      title: 'Remove Asset?',
      text: 'Selected asset(s) will be removed from this series. Don’t worry, it won’t be removed from the Asset Library.',
      confirmText: 'Remove',
      confirmAction: function() {
        hideModalPrompt();
        filesToDelete.each(function(i, el) {
          var id = $(el).find('.file__id').text();
          deleteFileById(id ,galleryObjects);
        });
        updateGallery();
      },
      cancelAction: function() {
        hideModalPrompt();
        $('.ct .files .file.sbr').removeClass('sbr');
      }
    });
  });

  //File Edit Save and Cancel
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
      deselectAll();
      updateGallery();
    }
  });
  $('#cancelChanges').click(function() {
    if (dataChanged) {
      showModalPrompt({
        dialog: true,
        title: 'Cancel Changes?',
        text: 'All changes that you made will be lost. Are you sure you want to cancel changes?',
        confirmText: 'Cancel',
        confirmAction: function() {
          hideModalPrompt();
          closeEditScreen();
        },
        cancelAction: hideModalPrompt
      });
    } else {
      closeEditScreen();
    }
  });*/


  //Check for required fields
  $('label.requiered').parent().children('input').on('blur', function(e) {
    if (checkField(e.target)) {
      markFieldAsNormal(e.target);
    } else {
      markFieldAsRequired(e.target);
    }
  });




  //Init Datepickers
  /*$('.js-datepicker').datepicker({
  //changeMonth: true,
  //changeYear: true
});*/

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

/*
//Import Cast
$('#importCastBtn').click(toggleCastImport);
$('#importCastCancelBtn').click(hideCastImport);
$('#importCastConfirmBtn').click(importCast);

function toggleCastImport(e) {
  $('#importCastSection').toggleClass('hidden');
  $('#importCastBtn').toggleClass('is-selected');
}
function hideCastImport() {
  $('#importCastSection').addClass('hidden');
  $('#importCastBtn').removeClass('is-selected');
}*/
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcmVhdGUtc2VyaWVzLWJhc2ljLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vQ29tbW9uIGpzIGZpbGVzXG4vL01lbnVcbmZ1bmN0aW9uIG5vcm1pbGl6ZU1lbnUoKSB7XG4gIHZhciBwYWdlTmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCcvJykucG9wKCksXG4gIG1lbnVJdGVtcyA9ICQoJy5qcy1tZW51IC5qcy1tZW51SXRlbScpO1xuICBhY3RpdmVNZW51SXRlbSA9ICQoJ1tkYXRhLXRhcmdldD1cIicgKyBwYWdlTmFtZSArICdcIl0nKTtcblxuICBtZW51SXRlbXMucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpLmNsaWNrKGhhbmRsZU1lbnVJdGVtQ2xpY2spO1xuICBhY3RpdmVNZW51SXRlbS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gIGFjdGl2ZU1lbnVJdGVtLnBhcmVudHMoJy5tZW51X19pdGVtJykuYWRkQ2xhc3MoJ2lzLW9wZW4nKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZU1lbnVJdGVtQ2xpY2soZSkge1xuICBpZiAoJChlLnRhcmdldCkuYXR0cignZGF0YS10YXJnZXQnKSkge1xuICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCdjcmVhdGUnKSA+PSAwICYmICFkcmFmdElzU2F2ZWQgJiYgJCgnLmpzLWNvbnRlbnQgLmZpbGUsIC5qcy1jb250ZW50IC5qcy1oYXNWYWx1ZScpLmxlbmd0aCA+IDApIHtcbiAgICAgIG5ldyBNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAnTGVhdmUgUGFnZT8nLFxuICAgICAgICB0ZXh0OiAnWW91IHdpbGwgbG9zZSBhbGwgdGhlIHVuc2F2ZWQgY2hhbmdlcy4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGxlYXZlIHRoaXMgcGFnZT8nLFxuICAgICAgICBjb25maXJtVGV4dDogJ0xlYXZlIFBhZ2UnLFxuICAgICAgICBjb25maXJtQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFyZ2V0Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFyZ2V0Jyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICgkKGUudGFyZ2V0KS5wYXJlbnRzKCcubWVudV9faXRlbScpLmhhc0NsYXNzKCdpcy1vcGVuJykpIHtcbiAgICAgICQoZS50YXJnZXQpLnBhcmVudHMoJy5tZW51X19pdGVtJykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnLm1lbnVfX2l0ZW0nKS5yZW1vdmVDbGFzcygnaXMtb3BlbicpO1xuICAgICAgJChlLnRhcmdldCkucGFyZW50cygnLm1lbnVfX2l0ZW0nKS5hZGRDbGFzcygnaXMtb3BlbicpO1xuICAgIH1cbiAgfVxufVxuXG4kKCcjbWVudVRvZ2dsZScpLmNsaWNrKG9wZW5NZW51KTtcbiQoJy5qcy1tZW51ID4gLmpzLWNsb3NlJykuY2xpY2soY2xvc2VNZW51KTtcblxuZnVuY3Rpb24gb3Blbk1lbnUoZSkge1xuICAkKCcuanMtbWVudScpLmFkZENsYXNzKCdpcy1vcGVuJyk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBjbG9zZU1lbnUpO1xufVxuZnVuY3Rpb24gY2xvc2VNZW51KGUpIHtcbiAgaWYgKCQoZS50YXJnZXQpLnBhcmVudHMoJy5tZW51X19saXN0JykubGVuZ3RoID09PSAwKSB7XG4gICAgJCgnLmpzLW1lbnUnKS5yZW1vdmVDbGFzcygnaXMtb3BlbicpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBjbG9zZU1lbnUpO1xuICB9XG59XG5cbi8vc2VsZWN0aW9uXG5cbmZ1bmN0aW9uIHRvZ2dsZUZpbGVTZWxlY3QoZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdHZhciBmaWxlID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKSxcblx0XHRmaWxlc1NlY3Rpb24gPSBmaWxlLnBhcmVudCgpLFxuXHRcdGZpbGVzID0gZmlsZXNTZWN0aW9uLmNoaWxkcmVuKCcuZmlsZScpLFxuXHRcdHNlbGVjdGVkRmlsZXMgPSBmaWxlc1NlY3Rpb24uY2hpbGRyZW4oJy5maWxlLnNlbGVjdGVkJyksXG5cdFx0c2luZ2xlID0gc2luZ2xlc2VsZWN0IHx8IGZhbHNlO1xuXG5cdGlmIChzaW5nbGUpIHtcblx0XHRpZiAoZmlsZS5oYXNDbGFzcygnc2VsZWN0ZWQnKSkge1xuXHRcdFx0ZmlsZS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZmlsZXNTZWN0aW9uLmZpbmQoJy5maWxlJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHRmaWxlLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHQvL0NoZWNrIGlmIHVzZXIgaG9sZCBTaGlmdCBLZXlcblx0XHRpZiAoZS5zaGlmdEtleSkge1xuXHRcdFx0aWYgKGZpbGUuaGFzQ2xhc3MoJ3NlbGVjdGVkJykpIHtcblx0XHRcdFx0ZmlsZS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpZiAoc2VsZWN0ZWRGaWxlcykge1xuXHRcdFx0XHRcdHZhciBmaWxlSW5kZXggPSBmaWxlLmluZGV4KCcuZmlsZScpLFxuXHRcdFx0XHRcdFx0ZmlsZXNUb0JlU2VsZWN0ID0gZmlsZXMuc2xpY2UobGFzdFNlbGVjdGVkLCBmaWxlSW5kZXggKyAxKTtcblxuXHRcdFx0XHRcdGlmIChsYXN0U2VsZWN0ZWQgPiBmaWxlSW5kZXgpIHtcblx0XHRcdFx0XHRcdGZpbGVzVG9CZVNlbGVjdCA9IGZpbGVzLnNsaWNlKGZpbGVJbmRleCwgbGFzdFNlbGVjdGVkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZmlsZXNUb0JlU2VsZWN0LmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0XHRcdGZpbGVzVG9CZVNlbGVjdC5yZW1vdmVDbGFzcygnaXMtcHJlc2VsZWN0ZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRmaWxlLnRvZ2dsZUNsYXNzKCdzZWxlY3RlZCBpcy1wcmVzZWxlY3RlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZmlsZS50b2dnbGVDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHR9XG5cdFx0bGFzdFNlbGVjdGVkID0gZmlsZS5pbmRleCgpO1xuXHRcdG5vcm1hbGl6ZVNlbGVjdGVpb24oKTtcblx0fVxufVxuZnVuY3Rpb24gbm9ybWFsaXplU2VsZWN0ZWlvbigpIHtcblx0dmFyIGJ1bGtEZWxldGVCdXR0b24gPSAkKCcjYnVsa1JlbW92ZScpLFxuXHRcdGJ1bGtFZGl0QnV0dG9uID0gJCgnI2J1bGtFZGl0JyksXG5cdFx0bXVsdGlFZGl0QnV0dG9uID0gJCgnI211bHRpRWRpdCcpLFxuXHRcdG1vcmVBY3Rpb25zQnV0dG9uID0gJCgnI21vcmVBY3Rpb25zJyksXG5cblx0XHRzZWxlY3RBbGxCdXR0b24gPSAkKCcjc2VsZWN0QWxsJyksXG5cdFx0c2VsZWN0QWxsTGFiZWwgPSAkKCcjc2VsZWN0QWxsTGFiZWwnKSxcblxuXHRcdGRlc2VsZWN0QWxsQnV0dG9uID0gJCgnI2Rlc2VsZWN0QWxsJyksXG5cdFx0ZGVzZWxlY3RBbGxMYWJlbCA9ICQoJyNkZXNlbGVjdEFsbExhYmVsJyksXG5cblx0XHRkZWxldGVCdXR0b25zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlIC5maWxlX19kZWxldGUnKSxcblx0XHRlZGl0QnV0dG9ucyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZSAuYnV0dG9uJykubm90KCcuYy1GaWxlLWNvdmVyVG9nbGUnKSxcblx0XHRhcnJhbmdlbWVudHMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUgLmZpbGVfX2FycmFnZW1lbnQnKSxcblx0XHRhcnJhbmdlbWVudElucHV0cyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZSAuZmlsZV9fYXJyYWdlbWVudCcpLmZpbmQoJ2lucHV0JyksXG5cdFx0c2V0Q292ZXJCdXR0b25zID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlIGJ1dHRvbi5jLUZpbGUtY292ZXJUb2dsZScpLFxuXG5cdFx0c2VsZWN0ZWREZWxldGVCdXR0b24gPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQgLmZpbGVfX2RlbGV0ZScpLFxuXHRcdHNlbGVjdGVkRWRpdEJ1dHRvbiA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCAuYnV0dG9uJyksXG5cdFx0c2VsZWN0ZWRBcnJhbmdlbWVudCA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCAuZmlsZV9fYXJyYWdlbWVudCcpLFxuXHRcdHNlbGVjdGVkQXJyYW5nZW1lbnRJbnB1dCA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCAuZmlsZV9fYXJyYWdlbWVudCcpLmZpbmQoJ2lucHV0JyksXG5cdFx0c2VsZWN0ZWRTZXRDb3ZlckJ1dHRvbnMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQgYnV0dG9uLmMtRmlsZS1jb3ZlclRvZ2xlJyksXG5cblx0XHRudW1iZXJPZkZpbGVzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlJykubGVuZ3RoLFxuXHRcdG51bWJlck9mU2VsZWN0ZWRGaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpLmxlbmd0aCxcblx0XHRudW1iZXJPZlNlbGVjdGVkSW1hZ2VzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLmpzLWltZ0ZpbGVUeXBlLnNlbGVjdGVkJykubGVuZ3RoLFxuXHRcdG51bWJlck9mU2VsZWN0ZWRWaWRlb3MgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuanMtdmlkZW9GaWxlVHlwZS5zZWxlY3RlZCcpLmxlbmd0aDtcblxuXHRcdHVuc2VsZWN0ZWRGaWxlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZScpLm5vdCgnLnNlbGVjdGVkJyk7XG5cblx0Ly9ObyBzZWxlY3RlZCBmaWxlc1xuXHRpZiAobnVtYmVyT2ZTZWxlY3RlZEZpbGVzID09PSAwKSB7XG5cdFx0c2VsZWN0QWxsQnV0dG9uLnJlbW92ZUNsYXNzKCdhbGwgZGlzYWJsZWQnKS5hZGRDbGFzcygnZW1wdHknKTtcblx0XHRzZWxlY3RBbGxMYWJlbC50ZXh0KCdTZWxlY3QgQWxsJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cblx0XHRkZXNlbGVjdEFsbEJ1dHRvbi5yZW1vdmVDbGFzcygnaXMtYWxsJykuYWRkQ2xhc3MoJ2lzLWVtcHR5IGRpc2FibGVkJyk7XG5cdFx0ZGVzZWxlY3RBbGxMYWJlbC5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblxuXHRcdGJ1bGtEZWxldGVCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRidWxrRWRpdEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdGJ1bGtFZGl0QnV0dG9uLmZpbmQoJy5idXR0b25fX3dhcm5pbmcnKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG5cdFx0bXVsdGlFZGl0QnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0bW9yZUFjdGlvbnNCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblxuXHRcdGVkaXRCdXR0b25zLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRkZWxldGVCdXR0b25zLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHRhcnJhbmdlbWVudHMucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0YXJyYW5nZW1lbnRJbnB1dHMucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0c2V0Q292ZXJCdXR0b25zLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuXG5cdFx0dW5zZWxlY3RlZEZpbGVzLnJlbW92ZUNsYXNzKCdpcy1wcmVzZWxlY3RlZCcpO1xuXG5cdFx0aWYgKCQoJyNhc3NldHMtY291bnQnKS5sZW5ndGggPiAwKSB7bm9ybWFsaXplQXNzZXRzQ291bnQoKTt9XG5cblx0XHRpZiAobnVtYmVyT2ZGaWxlcyA9PT0gMCkge1xuXHRcdFx0c2VsZWN0QWxsQnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0c2VsZWN0QWxsTGFiZWwuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cblx0XHRcdGRlc2VsZWN0QWxsQnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ZGVzZWxlY3RBbGxMYWJlbC5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHR9XG5cdH1cblx0Ly9Tb21lIGZpbGVzIGFyZSBzZWxlY3RlZFxuXHRlbHNlIGlmIChudW1iZXJPZlNlbGVjdGVkRmlsZXMgPiAwKSB7XG5cdFx0c2VsZWN0QWxsQnV0dG9uLnJlbW92ZUNsYXNzKCdlbXB0eSBhbGwnKTtcblx0XHRzZWxlY3RBbGxMYWJlbC50ZXh0KCdEZXNlbGVjdCBBbGwnKTtcblxuXHRcdGRlc2VsZWN0QWxsQnV0dG9uLnJlbW92ZUNsYXNzKCdpcy1lbXB0eSBpcy1hbGwgZGlzYWJsZWQnKTtcblx0XHRkZXNlbGVjdEFsbExhYmVsLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXG5cblx0XHRidWxrRGVsZXRlQnV0dG9uLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdGJ1bGtFZGl0QnV0dG9uLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdG11bHRpRWRpdEJ1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRtb3JlQWN0aW9uc0J1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblxuXHRcdGVkaXRCdXR0b25zLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHRkZWxldGVCdXR0b25zLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHRhcnJhbmdlbWVudHMuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0YXJyYW5nZW1lbnRJbnB1dHMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRzZXRDb3ZlckJ1dHRvbnMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcblxuXHRcdHVuc2VsZWN0ZWRGaWxlcy5hZGRDbGFzcygnaXMtcHJlc2VsZWN0ZWQnKTtcblxuXHRcdGlmICgkKCcjYXNzZXRzLWNvdW50JykubGVuZ3RoID4gMCkge1xuXHRcdFx0JCgnI2Fzc2V0cy1jb3VudCcpLnRleHQobnVtYmVyT2ZTZWxlY3RlZEZpbGVzLnRvU3RyaW5nKCkgKyAnIG9mICcgKyBnYWxsZXJ5T2JqZWN0cy5sZW5ndGggKyAnIHNlbGVjdGVkJyk7XG5cdFx0fVxuXG5cdFx0aWYgKG51bWJlck9mU2VsZWN0ZWRWaWRlb3MgJiYgbnVtYmVyT2ZTZWxlY3RlZEltYWdlcykge1xuXHRcdFx0YnVsa0VkaXRCdXR0b24uZmluZCgnLmJ1dHRvbl9fd2FybmluZycpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcblx0XHRcdG11bHRpRWRpdEJ1dHRvbi5maW5kKCcuYnV0dG9uX193YXJuaW5nJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRidWxrRWRpdEJ1dHRvbi5maW5kKCcuYnV0dG9uX193YXJuaW5nJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHRcdFx0bXVsdGlFZGl0QnV0dG9uLmZpbmQoJy5idXR0b25fX3dhcm5pbmcnKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG5cdFx0fVxuXG5cdFx0Ly9Pbmx5IG9uZSBmaWxlIHNlbGVjdGVkXG5cdFx0aWYgKG51bWJlck9mU2VsZWN0ZWRGaWxlcyA9PT0gMSkge1xuXHRcdFx0YnVsa0VkaXRCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRcdG11bHRpRWRpdEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdFx0Ly9tb3JlQWN0aW9uc0J1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXG5cdFx0XHRzZWxlY3RlZEVkaXRCdXR0b24ucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0c2VsZWN0ZWREZWxldGVCdXR0b24ucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0c2VsZWN0ZWRBcnJhbmdlbWVudC5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdHNlbGVjdGVkQXJyYW5nZW1lbnRJbnB1dC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRcdHNlbGVjdGVkU2V0Q292ZXJCdXR0b25zLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuXHRcdH1cblx0XHQvL0FsbCBmaWxlcyBhcmUgc2VsZWN0ZWRcblx0XHRpZiAobnVtYmVyT2ZTZWxlY3RlZEZpbGVzID09PSBudW1iZXJPZkZpbGVzKSB7XG5cdFx0XHRzZWxlY3RBbGxCdXR0b24ucmVtb3ZlQ2xhc3MoJ2VtcHR5JykuYWRkQ2xhc3MoJ2FsbCcpO1xuXHRcdFx0ZGVzZWxlY3RBbGxCdXR0b24ucmVtb3ZlQ2xhc3MoJ2lzLWVtcHR5JykuYWRkQ2xhc3MoJ2lzLWFsbCcpO1xuXHRcdH1cblx0fVxufVxuZnVuY3Rpb24gc2VsZWN0QWxsKCkge1xuXHQkKCcuanMtY29udGVudCAuZmlsZScpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXHRub3JtYWxpemVTZWxlY3RlaW9uKCk7XG59XG5mdW5jdGlvbiBkZXNlbGVjdEFsbCgpIHtcblx0JCgnLmpzLWNvbnRlbnQgLmZpbGUuc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblx0bm9ybWFsaXplU2VsZWN0ZWlvbigpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVBc3NldHNDb3VudCgpIHtcblx0aWYgKGdhbGxlcnlPYmplY3RzLmxlbmd0aCkge1xuXHRcdCQoJyNhc3NldHMtY291bnQnKS50ZXh0KGdhbGxlcnlPYmplY3RzLmxlbmd0aCArICcgYXNzZXRzJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXHR9IGVsc2Uge1xuXHRcdCQoJyNhc3NldHMtY291bnQnKS50ZXh0KCcnKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG5cdH1cbn1cblxuLy9Ob3RpZmljYXRpb25zXG5mdW5jdGlvbiBzaG93Tm90aWZpY2F0aW9uKHRleHQsIHRvcCkge1xuICAgIHZhciBub3RpZmljYXRpb24gPSAkKCcubm90aWZpY2F0aW9uJyksXG4gICAgICAgIG5vdGlmaWNhdGlvblRleHQgPSAkKCcubm90aWZpY2F0aW9uX190ZXh0Jyk7XG5cbiAgICBpZiAobm90aWZpY2F0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBub3RpZmljYXRpb24gPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdub3RpZmljYXRpb24nKTtcbiAgICAgICAgbm90aWZpY2F0aW9uVGV4dCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ25vdGlmaWNhdGlvbl9fdGV4dCcpO1xuICAgICAgICBub3RpZmljYXRpb24uYXBwZW5kKG5vdGlmaWNhdGlvblRleHQpO1xuICAgIH1cblxuICAgIGlmICgkKCcubW9kYWwnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICghJCgnLm1vZGFsIC5wcmV2aWV3JykuaGFzQ2xhc3MoJ2hpZGRlbicpKSB7XG4gICAgICAgICAgICAkKCcubW9kYWwgLnByZXZpZXcnKS5hcHBlbmQobm90aWZpY2F0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJy5tb2RhbCcpLmFwcGVuZChub3RpZmljYXRpb24pO1xuICAgICAgICB9XG5cbiAgICB9IGVsc2UgaWYoJCgnLmN0JykubGVuZ3RoID4gMCkge1xuICAgICAgICAkKCcuY3QnKS5hcHBlbmQobm90aWZpY2F0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKCdib2R5JykuYXBwZW5kKG5vdGlmaWNhdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKHRvcCkge25vdGlmaWNhdGlvbi5jc3MoJ3RvcCcsIHRvcCk7fVxuICAgIG5vdGlmaWNhdGlvblRleHQudGV4dCh0ZXh0KTtcbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgbm90aWZpY2F0aW9uLnJlbW92ZSgpO1xuICAgIH0sIDQwMDApO1xufVxuXG4vL0ZpbGUgZnVuY3Rpb25zXG52YXIgZ2FsbGVyeUNhcHRpb25zID0ge307XG5cbmZ1bmN0aW9uIGhhbmRsZUNhcHRpb25FZGl0KGUpIHtcbiAgICB2YXIgZmlsZUVsZW1lbnQgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpLFxuICAgICAgICBmaWxlSWQgPSBmaWxlRWxlbWVudC5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCksXG4gICAgICAgIHRvZ2dsZSA9IGZpbGVFbGVtZW50LmZpbmQoJy5maWxlX19jYXB0aW9uLXRvZ2dsZSAudG9nZ2xlJyksXG4gICAgICAgIGZpbGUgPSBnYWxsZXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuICAgICAgICAgICAgcmV0dXJuIGYuZmlsZURhdGEuaWQgPT09IGZpbGVJZDtcbiAgICAgICAgfSlbMF0sXG5cbiAgICAgICAgdG9nZ2xlQ2hlY2tlZCA9ICQoZS50YXJnZXQpLnZhbCgpID09PSBmaWxlLmZpbGVEYXRhLmNhcHRpb24gJiYgZmlsZS5maWxlRGF0YS5jYXB0aW9uOyAvL0lmIHRleHRmaWVsZCBlcXVhbHMgdGhlIGZpbGUgY2FwdGlvbiBhbmQgZmlsZSBjYXB0aW9uIG5vdCBlbXB0eVxuXG4gICAgLy9TYXZlIGNhcHRpb24gdG8gZ2FsbGVyeUNhcHRpb25zXG4gICAgZmlsZS5jYXB0aW9uID0gJChlLnRhcmdldCkudmFsKCk7XG5cbiAgICB0b2dnbGUucHJvcCgnY2hlY2tlZCcsIHRvZ2dsZUNoZWNrZWQpO1xuICAgIGNsb3NlVG9vbHRpcCgpO1xufVxuZnVuY3Rpb24gaGFuZGxlQ2FwdGlvblRvZ2dsZUNsaWNrKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHZhciBmaWxlID0gJChlLnRhcmdldCkucGFyZW50cygnLmZpbGUnKSxcbiAgICAgICAgZmlsZUlkID0gZmlsZS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCksXG4gICAgICAgIHRleHRhcmVhID0gZmlsZS5maW5kKCcuZmlsZV9fY2FwdGlvbi10ZXh0YXJlYScpLFxuICAgICAgICBvcmlnaW5hbEZpbGUgPSBmaWxlQnlJZChmaWxlSWQsIGdhbGxlcnlPYmplY3RzKTtcblxuICAgIGlmICgkKGUudGFyZ2V0KS5wcm9wKCdjaGVja2VkJykpIHtcbiAgICAgICAgdGV4dGFyZWEudmFsKG9yaWdpbmFsRmlsZS5maWxlRGF0YS5jYXB0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0YXJlYS5mb2N1cygpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGhhbmRsZUNhcHRpb25TdGFydEVkaXRpbmcoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdmFyIHRvb2x0aXBUZXh0ID0gJ1RoaXMgY2FwdGlvbiB3aWxsIG9ubHkgYXBwbHkgdG8geW91ciBnYWxsZXJ5IGFuZCBub3QgdG8gdGhlIGltYWdlIGFzc2V0Lic7XG4gICAgaWYgKCF3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rvb2x0aXAnKSkge1xuICAgICAgICBjcmVhdGVUb29sdGlwKCQoZS50YXJnZXQpLCB0b29sdGlwVGV4dCk7XG4gICAgfVxufVxuLy8gQ2hhbmdlIGVsZW1lbnQgaW5kZXhlcyB0byBhbiBhY3R1YWwgb25lc1xuZnVuY3Rpb24gbm9ybWFsaXplSW5kZXgoKSB7XG4gICAgdmFyIGZpbGVzID0gJCgnLmpzLWZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZScpO1xuXG4gICAgZmlsZXMuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgJChlbCkuZmluZCgnLmZpbGVfX2FyYWdlbWVudC1pbnB1dCcpLnRleHQoaW5kZXggKyAxKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlSW5kZXhGaWVsZENoYW5nZShlKSB7XG4gICAgdmFyIGxlbmd0aCA9ICQoJy5qcy1maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKS5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gcGFyc2VJbnQoJChlLnRhcmdldCkudmFsKCkpIC0gMSxcbiAgICAgICAgZmlsZSA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJyk7XG5cbiAgICBpZiAoaW5kZXggKyAxID49IGxlbmd0aCkge1xuICAgICAgICBwdXRCb3R0b20oZmlsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsZS5kZXRhY2goKS5pbnNlcnRCZWZvcmUoJCgnLmpzLWZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZScpLnNsaWNlKGluZGV4LCBpbmRleCsxKSk7XG5cbiAgICB9XG4gICAgbm9ybWFsaXplSW5kZXgoKTtcbiAgICAvL3VwZGF0ZUdhbGxlcnkoaW5kZXgpO1xufVxuXG5mdW5jdGlvbiBwdXRCb3R0b20oZmlsZSkge1xuICAgIGZpbGUuZGV0YWNoKCkuaW5zZXJ0QWZ0ZXIoJCgnLmpzLWZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZScpLmxhc3QoKSk7XG4gICAgbm9ybWFsaXplSW5kZXgoKTtcbiAgICAvL3VwZGF0ZUdhbGxlcnkoZ2FsbGVyeU9iamVjdHMubGVuZ3RoKTtcbn1cbmZ1bmN0aW9uIHB1dFRvcChmaWxlKSB7XG4gICAgZmlsZS5kZXRhY2goKS5pbnNlcnRCZWZvcmUoJCgnLmpzLWZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZScpLmZpcnN0KCkpO1xuICAgIG5vcm1hbGl6ZUluZGV4KCk7XG4gICAgLy91cGRhdGVHYWxsZXJ5KDApO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVTZW5kVG9Ub3BDbGljayhlKSB7XG4gICAgdmFyIGZpbGVzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkJyk7XG4gICAgaWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcHV0VG9wKGZpbGVzKTtcbiAgICB9XG4gICAgcHV0VG9wKCQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJykpO1xuICAgIGNsb3NlTWVudSgkKGUudGFyZ2V0KS5wYXJlbnRzKCdzZWxlY3RfX21lbnUnKSk7XG59XG5mdW5jdGlvbiBoYW5kbGVTZW5kVG9Cb3R0b21DbGljayhlKSB7XG4gICAgdmFyIGZpbGVzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkJyk7XG4gICAgaWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcHV0Qm90dG9tKGZpbGVzKTtcbiAgICB9XG4gICAgcHV0Qm90dG9tKCQoZS50YXJnZXQpLnBhcmVudHMoJy5maWxlJykpO1xuICAgIGNsb3NlTWVudSgkKGUudGFyZ2V0KS5wYXJlbnRzKCdzZWxlY3RfX21lbnUnKSk7XG59XG5mdW5jdGlvbiBsb2FkRmlsZShmaWxlKSB7XG5cdHZhciBmaWxlRGF0YSA9IGZpbGUuZmlsZURhdGE7XG5cblx0c3dpdGNoIChmaWxlRGF0YS50eXBlKSB7XG5cdFx0Y2FzZSAnaW1hZ2UnOlxuXG5cdFx0Ly9IaWRlIHZpZGVvIHJlbGF0ZWQgZWxlbWVudHNcblx0XHQkKCcjdmlkZW9QbGF5JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdCQoJyN2aWRlb01ldGFkYXRhJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0Ly9TaG93IGFsbCBpbWFnZSByZWxhdGVkIGVsZW1lbnRzXG5cdFx0JCgnI3ByZXZpZXdDb250cm9scycpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHQkKCcjaW1hZ2VNZXRhZGF0YScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHQkKCcjZm9jYWxQb2ludCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblxuXHRcdGlmICghZmlsZS5idWxrRWRpdCkge1xuXHRcdFx0JCgnI3ByZXZpZXdJbWcnKS5hdHRyKCdzcmMnLCBmaWxlRGF0YS51cmwpO1xuXHRcdFx0JCgnLnByIC5wdXJwb3NlLWltZycpLmNzcyhcImJhY2tncm91bmQtaW1hZ2VcIiwgJ3VybCgnICsgZmlsZURhdGEudXJsICsgJyknKTtcblx0XHRcdGFkanVzdEZvY2FsUG9pbnQoZmlsZURhdGEuZm9jYWxQb2ludCk7XG5cdFx0fVxuXG5cdFx0Ly9zZXQgVGl0bGVcblx0XHRhZGp1c3RUaXRsZShmaWxlRGF0YS50aXRsZSk7XG5cdFx0YWRqdXN0Q2FwdGlvbihmaWxlRGF0YS5jYXB0aW9uKTtcblx0XHRhZGp1c3REZXNjcmlwdGlvbihmaWxlRGF0YS5kZXNjcmlwdGlvbik7XG5cdFx0YWRqdXN0UmVzb2x1dGlvbihmaWxlRGF0YS5oaWdoUmVzb2x1dGlvbik7XG5cdFx0YWRqdXN0QWx0VGV4dChmaWxlRGF0YS5hbHRUZXh0KTtcblxuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSAndmlkZW8nOlxuXG5cdFx0Ly9IaWRlIGFsbCBpbWFnZSByZWxhdGVkIGVsZW1lbnRzXG5cdFx0JCgnI3ByZXZpZXdDb250cm9scycpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHQkKCcjaW1hZ2VNZXRhZGF0YScpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHQkKCcjZm9jYWxQb2ludCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcblxuXHRcdC8vU2hvdyB2aWRlbyByZWxhdGVkIGVsZW1lbnRzXG5cdFx0JCgnI3ZpZGVvUGxheScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0XHQkKCcjdmlkZW9NZXRhZGF0YScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblxuXHRcdGlmIChmaWxlLmJ1bGtFZGl0KSB7XG5cdFx0XHQkKCcjZmllbEVkaXQtdmlkZW9NZXRhZGF0YScpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCgnI2ZpZWxFZGl0LXZpZGVvTWV0YWRhdGEnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cblx0XHRcdCQoJyNwcmV2aWV3SW1nJykuYXR0cignc3JjJywgZmlsZURhdGEudXJsKTtcblx0XHRcdCQoJyN2aWRlb1RpdGxlJykudGV4dChmaWxlRGF0YS50aXRsZSk7XG5cdFx0XHQkKCcjdmlkZW9EZXNjcmlwdGlvbicpLnRleHQoZmlsZURhdGEuZGVzY3JpcHRpb24pO1xuXHRcdFx0JCgnI3ZpZGVvQXV0aG9yJykudGV4dChmaWxlRGF0YS5hdXRob3IpO1xuXHRcdFx0JCgnI3ZpZGVvR3VpZCcpLnRleHQoZmlsZURhdGEuZ3VpZCk7XG5cdFx0XHQkKCcjdmlkZW9LZXl3b3JkcycpLnRleHQoZmlsZURhdGEua2V5d29yZHMpO1xuXHRcdH1cblxuXHRcdGJyZWFrO1xuXHR9XG59XG5cbi8vRnVuY3Rpb24gdG8gc2V0IFRpdGxlIHRvIHRoZSB0aXRsZSBmaWVsZCBvciwgc2F2ZSB0aXRsZSBpZiB0aXRsZSBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gYWRqdXN0VGl0bGUodGl0bGUpIHtcblx0JCgnI3RpdGxlJykudmFsKHRpdGxlKS5jaGFuZ2UoKTtcblx0dmFyIGV2ZW50ID0gbmV3IFVJRXZlbnQoJ2NoYW5nZScpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUnKS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cbi8vRnVuY3Rpb24gdG8gc2V0IFRpdGxlIHRvIHRoZSB0aXRsZSBmaWVsZCBvciwgc2F2ZSB0aXRsZSBpZiB0aXRsZSBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gc2F2ZVRpdGxlKGUpIHtcblx0dmFyIGN1cnJlbnRJbWFnZSA9ICQoJy5pbWFnZS5pbWFnZV9zdHlsZV9tdWx0aSAuZmlsZV9faWRbZGF0YS1pZD1cIicgKyBlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5pZCArICdcIl0nKS5wYXJlbnRzKCcuaW1hZ2UnKTtcblxuXHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS50aXRsZSA9ICQoJyN0aXRsZScpLnZhbCgpO1xuXG5cdGlmICgkKCcjdGl0bGUnKS52YWwoKSA9PT0gJycpIHtcblx0XHRjdXJyZW50SW1hZ2UuYWRkQ2xhc3MoJ2hhcy1lbXB0eVJlcXVpcmVkRmllbGQnKTtcblx0fSBlbHNlIHtcblx0XHRjdXJyZW50SW1hZ2UucmVtb3ZlQ2xhc3MoJ2hhcy1lbXB0eVJlcXVpcmVkRmllbGQnKTtcblx0fVxuXG5cdGRhdGFDaGFuZ2VkID0gdHJ1ZTtcblx0aWYgKGVkaXRlZEZpbGVEYXRhLmJ1bGtFZGl0KSB7XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdFx0Zi5maWxlRGF0YS50aXRsZSA9ICQoJyN0aXRsZScpLnZhbCgpO1xuXHRcdH0pO1xuXHR9XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBDYXB0aW9uIHRvIHRoZSBjYXB0aW9uIGZpZWxkIG9yLCBzYXZlIGNhcHRpb24gaWYgY2FwdGlvbiBhcmd1bWVudCBlbXB0eVxuZnVuY3Rpb24gYWRqdXN0Q2FwdGlvbihjYXB0aW9uKSB7XG5cdCQoJyNjYXB0aW9uJykudmFsKGNhcHRpb24pLmNoYW5nZSgpO1xuXHR2YXIgZXZlbnQgPSBuZXcgVUlFdmVudCgnY2hhbmdlJyk7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXB0aW9uJykuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBEZXNjcmlwdGlvbiB0byB0aGUgY2FwdGlvbiBmaWVsZCBvciwgc2F2ZSBjYXB0aW9uIGlmIGNhcHRpb24gYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIHNhdmVDYXB0aW9uKCkge1xuXHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5jYXB0aW9uID0gJCgnI2NhcHRpb24nKS52YWwoKTtcblx0ZGF0YUNoYW5nZWQgPSB0cnVlO1xuXHRpZiAoZWRpdGVkRmlsZURhdGEuYnVsa0VkaXQpIHtcblx0XHRlZGl0ZWRGaWxlc0RhdGEuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0XHRmLmZpbGVEYXRhLmNhcHRpb24gPSAkKCcjY2FwdGlvbicpLnZhbCgpO1xuXHRcdH0pO1xuXHR9XG59XG5mdW5jdGlvbiBhZGp1c3REZXNjcmlwdGlvbihkZXNjcmlwdGlvbikge1xuXHQkKCcjZGVzY3JpcHRpb24nKS52YWwoZGVzY3JpcHRpb24pLmNoYW5nZSgpO1xuXHR2YXIgZXZlbnQgPSBuZXcgVUlFdmVudCgnY2hhbmdlJyk7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNjcmlwdGlvbicpLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuLy9GdW5jdGlvbiB0byBzZXQgRGVzY3JpcHRpb24gdG8gdGhlIGNhcHRpb24gZmllbGQgb3IsIHNhdmUgY2FwdGlvbiBpZiBjYXB0aW9uIGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBzYXZlRGVzY3JpcHRpb24oKSB7XG5cdGVkaXRlZEZpbGVEYXRhLmZpbGVEYXRhLmRlc2NyaXB0aW9uID0gJCgnI2Rlc2NyaXB0aW9uJykudmFsKCk7XG5cdGRhdGFDaGFuZ2VkID0gdHJ1ZTtcblx0aWYgKGVkaXRlZEZpbGVEYXRhLmJ1bGtFZGl0KSB7XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdFx0Zi5maWxlRGF0YS5kZXNjcmlwdGlvbiA9ICQoJyNkZXNjcmlwdGlvbicpLnZhbCgpO1xuXHRcdH0pO1xuXHR9XG59XG5mdW5jdGlvbiBhZGp1c3RSZXNvbHV0aW9uKHJlc29sdXRpb24pIHtcblx0JCgnI3Jlc29sdXRpb24nKS5wcm9wKCdjaGVja2VkJywgcmVzb2x1dGlvbik7XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBEZXNjcmlwdGlvbiB0byB0aGUgY2FwdGlvbiBmaWVsZCBvciwgc2F2ZSBjYXB0aW9uIGlmIGNhcHRpb24gYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIHNhdmVSZXNvbHV0aW9uKCkge1xuXHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5oaWdoUmVzb2x1dGlvbiA9ICQoJyNyZXNvbHV0aW9uJykucHJvcCgnY2hlY2tlZCcpO1xuXHRkYXRhQ2hhbmdlZCA9IHRydWU7XG5cdGlmIChlZGl0ZWRGaWxlRGF0YS5idWxrRWRpdCkge1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdGYuZmlsZURhdGEuaGlnaFJlc29sdXRpb24gPSAkKCcjcmVzb2x1dGlvbicpLnByb3AoJ2NoZWNrZWQnKTtcblx0XHR9KTtcblx0fVxufVxuZnVuY3Rpb24gYWRqdXN0QWx0VGV4dChhbHRUZXh0KSB7XG5cdCQoJyNhbHRUZXh0JykudmFsKGFsdFRleHQpLmNoYW5nZSgpO1xuXHR2YXIgZXZlbnQgPSBuZXcgVUlFdmVudCgnY2hhbmdlJyk7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbHRUZXh0JykuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG4vL0Z1bmN0aW9uIHRvIHNldCBEZXNjcmlwdGlvbiB0byB0aGUgY2FwdGlvbiBmaWVsZCBvciwgc2F2ZSBjYXB0aW9uIGlmIGNhcHRpb24gYXJndW1lbnQgZW1wdHlcbmZ1bmN0aW9uIHNhdmVBbHRUZXh0KCkge1xuXHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5hbHRUZXh0ID0gJCgnI2FsdFRleHQnKS52YWwoKTtcblx0ZGF0YUNoYW5nZWQgPSB0cnVlO1xuXHRpZiAoZWRpdGVkRmlsZURhdGEuYnVsa0VkaXQpIHtcblx0XHRlZGl0ZWRGaWxlc0RhdGEuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0XHRmLmZpbGVEYXRhLmFsdFRleHQgPSAkKCcjYWx0VGV4dCcpLnZhbCgpO1xuXHRcdH0pO1xuXHR9XG59XG5cbi8vRnVuY3Rpb24gdG8gc2V0IEZvY2FsUG9pbnQgY29vcmRpbmF0ZXMgb3IsIHNhdmUgZm9jYWwgcGludCBpZiBmb2NhbHBvaW50IGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBhZGp1c3RGb2NhbFBvaW50KGZvY2FsUG9pbnQpIHtcblx0dmFyIGZwID0gJCgnI2ZvY2FsUG9pbnQnKTtcblx0dmFyIGltZyA9ICQoJyNwcmV2aWV3SW1nJyk7XG5cdGlmIChmb2NhbFBvaW50KSB7XG5cdFx0dmFyIGxlZnQgPSBmb2NhbFBvaW50LmxlZnQgKiBpbWcud2lkdGgoKSAtIGZwLndpZHRoKCkvMixcblx0XHR0b3AgPSBmb2NhbFBvaW50LnRvcCAqIGltZy5oZWlnaHQoKSAtIGZwLmhlaWdodCgpLzI7XG5cblx0XHRsZWZ0ID0gbGVmdCA9PT0gMCA/ICc1MCUnIDogbGVmdDtcblx0XHR0b3AgPSB0b3AgPT09IDAgPyAnNTAlJyA6IHRvcDtcblx0XHRmcC5jc3MoJ2xlZnQnLCBsZWZ0KS5jc3MoJ3RvcCcsIHRvcCk7XG5cblx0fSBlbHNlIHtcblx0XHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5mb2NhbFBvaW50ID0ge1xuXHRcdFx0bGVmdDogKChmcC5wb3NpdGlvbigpLmxlZnQgKyBmcC53aWR0aCgpLzIpL2ltZy53aWR0aCgpKSxcblx0XHRcdHRvcDogKChmcC5wb3NpdGlvbigpLnRvcCArIGZwLmhlaWdodCgpLzIpL2ltZy5oZWlnaHQoKSlcblx0XHR9O1xuXHR9XG5cdGZwLmNzcygncG9zaXRpb24nLCAnYWJzb2x1dGUnKTtcblxufVxuXG4vL0Z1bmN0aW9uIHRvIHNldCBGb2NhbFJlY3QgY29vcmRpbmF0ZXMgb3IsIHNhdmUgZm9jYWwgcGludCBpZiBmb2NhbHBvaW50IGFyZ3VtZW50IGVtcHR5XG5mdW5jdGlvbiBhZGp1c3RGb2NhbFJlY3QoZm9jYWxQb2ludCkge1xuXHR2YXIgZnIgPSAkKCcjZm9jYWxSZWN0Jyk7XG5cdHZhciBpbWcgPSAkKCdwcmV2aWV3SW1nJyk7XG5cdGlmIChmb2NhbFBvaW50KSB7XG5cdFx0dmFyIGxlZnQgPSBmb2NhbFBvaW50LmxlZnQgKiBpbWcud2lkdGgoKSAtIGZyLndpZHRoKCkvMixcblx0XHR0b3AgPSBmb2NhbFBvaW50LnRvcCAqIGltZy5oZWlnaHQoKSAtIGZyLmhlaWdodCgpLzI7XG5cblx0XHRsZWZ0ID0gbGVmdCA8IDAgPyAwIDogbGVmdCA+IGltZy53aWR0aCgpID8gaW1nLndpZHRoKCkgLSBmci53aWR0aCgpLzIgOiBsZWZ0O1xuXHRcdHRvcCA9IHRvcCA8IDAgPyAwIDogdG9wID4gaW1nLmhlaWdodCgpID8gaW1nLmhlaWdodCgpIC0gZnIuaGVpZ2h0KCkvMiA6IHRvcDtcblxuXHRcdGZyLmNzcygnbGVmdCcsIGxlZnQpXG5cdFx0LmNzcygndG9wJywgdG9wKTtcblx0fSBlbHNlIHtcblx0XHRlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS5mb2NhbFBvaW50ID0ge1xuXHRcdFx0bGVmdDogKChmcC5wb3NpdGlvbigpLmxlZnQgKyBmcC53aWR0aCgpLzIpL2ltZy53aWR0aCgpKSxcblx0XHRcdHRvcDogKChmcC5wb3NpdGlvbigpLnRvcCArIGZwLmhlaWdodCgpLzIpL2ltZy5oZWlnaHQoKSlcblx0XHR9O1xuXHR9XG59XG5cblxuZnVuY3Rpb24gc2hvd0ZpbGVzKGZpbGVzKSB7XG5cdGRhdGFDaGFuZ2VkID0gZmFsc2U7XG5cdHNjcm9sbFBvc2l0aW9uID0gJCgnYm9keScpLnNjcm9sbFRvcCgpO1xuXHQvL1Nob3cgaW5pdGlhbCBlZGl0IHNjcmVlbiBmb3Igc2luZ2xlIGltYWdlLlxuXHQkKCcucHInKS5yZW1vdmVDbGFzcygnaGlkZGVuIHZpZGVvIGJ1bGsnKVxuXHQuYWRkQ2xhc3MoJ21vZGFsJyk7XG5cdCQoJyN3cmFwcGVyJykuYWRkQ2xhc3MoJ292ZXJmbG93Jyk7XG5cblx0Ly9SZW1vdmUgYWxsIG11bHRpcGxlIGltYWdlcyBzdHlsZSBhdHRyaWJ1dGVzXG5cdCQoJy5wciAucHJldmlldycpLnJlbW92ZUNsYXNzKCdwcmV2aWV3X3N0eWxlX211bHRpIGhpZGRlbicpO1xuXHQkKCcucHIgLmlwJykucmVtb3ZlQ2xhc3MoJ2lwX3N0eWxlX211bHRpJyk7XG5cdCQoJyNzYXZlQ2hhbmdlcycpLnRleHQoJ1NhdmUnKTtcblx0Ly8kKCcjaXBfX3RpdGxlJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHQkKCcucHIgLmltYWdlcycpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0JCgnI3RpdGxlJykucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHQkKCcjdGl0bGUnKS5wYXJlbnQoKS5jaGlsZHJlbignbGFiZWwnKS5hZGRDbGFzcygncmVxdWllcmVkJyk7XG5cdCQoJyN0aXRsZScpLnByb3AoJ3JlcXVpcmVkJywgdHJ1ZSk7XG5cblx0ZnVuY3Rpb24gcmVzaXplSW1hZ2VXcmFwcGVyKCkge1xuXHRcdHZhciBpbWFnZXNXcmFwcGVyV2lkdGggPSAkKCcuaW1hZ2VzX193cmFwcGVyJykud2lkdGgoKTtcblx0XHRpbWFnZXNXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIDwgNjAwID8gJCgnLmltYWdlc19fY29udGFpbmVyIC5pbWFnZScpLmxlbmd0aCAqIDEwMCA6ICQoJy5pbWFnZXNfX2NvbnRhaW5lciAuaW1hZ2UnKS5sZW5ndGggKiAxMjA7XG5cdFx0aWYgKGltYWdlc1dyYXBwZXJXaWR0aCA+IGltYWdlc1dpZHRoKSB7XG5cdFx0XHQkKCcuaW1hZ2VzX19zY3JvbGwtbGVmdCwgLmltYWdlc19fc2Nyb2xsLXJpZ2h0JykuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKCcuaW1hZ2VzX19jb250YWluZXInKS5jc3MoJ3dpZHRoJywgaW1hZ2VzV2lkdGgudG9TdHJpbmcoKSArICdweCcpO1xuXHRcdFx0JCgnLmltYWdlc19fc2Nyb2xsLWxlZnQsIC5pbWFnZXNfX3Njcm9sbC1yaWdodCcpLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKGZpbGVzLmxlbmd0aCA+IDEpIHtcblx0XHR2YXIgaW1nQ29udGFpbmVyID0gJCgnLnByIC5pbWFnZXNfX2NvbnRhaW5lcicpO1xuXHRcdGltZ0NvbnRhaW5lci5lbXB0eSgpO1xuXG5cdFx0Ly9BZGQgaW1hZ2VzIHByZXZpZXMgdG8gdGhlIGNvbnRhaW5lclxuXHRcdGZpbGVzLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdFx0dmFyXHRpbWFnZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlIGltYWdlX3N0eWxlX211bHRpJykuY2xpY2soaGFuZGxlSW1hZ2VTd2l0Y2gpLFxuXHRcdFx0cmVxdWlyZWRNYXJrID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2VfX3JlcXVpcmVkLW1hcmsnKSxcblx0XHRcdGZpbGVJbmRleCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2hpZGRlbiBmaWxlX19pZCcpLnRleHQoZi5maWxlRGF0YS5pZCkuYXR0cignZGF0YS1pZCcsIGYuZmlsZURhdGEuaWQpO1xuXHRcdFx0aW1hZ2UuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgZi5maWxlRGF0YS51cmwgKyAnKScpLmFwcGVuZChyZXF1aXJlZE1hcmssIGZpbGVJbmRleCk7XG5cdFx0XHRpbWdDb250YWluZXIuYXBwZW5kKGltYWdlKTtcblx0XHR9KTtcblxuXHRcdC8vQWRkIGFjdGl2ZSBzdGF0ZSB0byB0aGUgcHJldmlldyBvZiB0aGUgZmlyc3QgaW1hZ2Vcblx0XHR2YXIgZmlyc3RJbWFnZSA9ICQoJy5pbWFnZXNfX2NvbnRhaW5lciAuaW1hZ2UnKS5maXJzdCgpO1xuXHRcdGZpcnN0SW1hZ2UuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXG5cdFx0JCgnLnByIC5pbWFnZXMnKS5hZGRDbGFzcygnaW1hZ2VzX3N0eWxlX211bHRpJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbiBpbWFnZXNfc3R5bGVfYnVsaycpO1xuXG5cdFx0JCgnLnByIC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpLmFkZENsYXNzKCdwcmV2aWV3X3N0eWxlX211bHRpJyk7XG5cdFx0JCgnLnByIC5pcCcpLmFkZENsYXNzKCdpcF9zdHlsZV9tdWx0aScpO1xuXG5cdFx0Ly9BZGp1c3QgaW1hZ2UgcHJldmlld3MgY29udGFpbmVyXG5cdFx0JCgnI2ltYWdlc19fd3JhcHBlcicpLnNjcm9sbExlZnQoMCk7XG5cdFx0JCh3aW5kb3cpLnJlc2l6ZShyZXNpemVJbWFnZVdyYXBwZXIpO1xuXHRcdHJlc2l6ZUltYWdlV3JhcHBlcigpO1xuXG5cdFx0Ly9BZGQgYWN0aW9ucyB0byBzY3JvbGwgYnV0dG9uc1xuXHRcdCQoJy5pbWFnZXNfX3Njcm9sbC1sZWZ0JykudW5iaW5kKCdjbGljaycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHQkKCcjaW1hZ2VzX193cmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiAnLT00ODAnIH0sIDYwMCk7XG5cdFx0fSk7XG5cdFx0JCgnLmltYWdlc19fc2Nyb2xsLXJpZ2h0JykudW5iaW5kKCdjbGljaycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHQkKCcjaW1hZ2VzX193cmFwcGVyJykuYW5pbWF0ZSggeyBzY3JvbGxMZWZ0OiAnKz00ODAnIH0sIDYwMCk7XG5cdFx0fSk7XG5cdH1cblx0aGlkZUxvYWRlcigpO1xuXHRzZXRNb2RhbEtleWJvYXJkQWN0aW9ucyhzYXZlSW1hZ2VFZGl0LCBjYW5jZWxJbWFnZUVkaXQpO1xuXG59XG5mdW5jdGlvbiBlZGl0RmlsZXMoZmlsZXMpIHtcblx0ZWRpdGVkRmlsZXNEYXRhID0gW10uY29uY2F0KGZpbGVzKTtcblxuXHRpZiAoZWRpdGVkRmlsZXNEYXRhLmxlbmd0aCA+IDApIHtcblx0XHRlZGl0ZWRGaWxlRGF0YSA9IGVkaXRlZEZpbGVzRGF0YVswXTtcblx0XHRsb2FkRmlsZShlZGl0ZWRGaWxlRGF0YSk7XG5cdFx0c2hvd0ZpbGVzKGVkaXRlZEZpbGVzRGF0YSk7XG5cdH1cbn1cblxuXG4vL0J1bGsgRWRpdFxuZnVuY3Rpb24gYnVsa0VkaXRGaWxlcyhmaWxlcywgdHlwZSkge1xuXHR2YXIgY2xvbmVkR2FsbGVyeU9iamVjdHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGdhbGxlcnlPYmplY3RzKSk7XG5cdHZhciBmaWxlc1R5cGU7XG5cdGVkaXRlZEZpbGVzRGF0YSA9IFtdOyAvL0NsZWFyIGZpbGVzIGRhdGEgdGhhdCBwb3NzaWJseSBjb3VsZCBiZSBoZXJlXG5cblx0Ly9PYnRhaW4gZmlsZXMgZGF0YSBmb3IgZmlsZXMgdGhhdCBzaG91bGQgYmUgZWRpdGVkXG5cdGZpbGVzLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcblx0XHR2YXIgZmlsZSA9IGNsb25lZEdhbGxlcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG5cdFx0XHRyZXR1cm4gZi5maWxlRGF0YS5pZCA9PT0gJChlbCkuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpO1xuXHRcdH0pWzBdO1xuXHRcdGVkaXRlZEZpbGVzRGF0YS5wdXNoKGZpbGUpO1xuXHR9KTtcblxuXHRpZiAoZWRpdGVkRmlsZXNEYXRhLmxlbmd0aCA+IDApIHtcblx0XHRzd2l0Y2ggKGVkaXRlZEZpbGVzRGF0YVswXS5maWxlRGF0YS50eXBlKSB7XG5cdFx0XHRjYXNlICdpbWFnZSc6XG5cdFx0XHRlZGl0ZWRGaWxlRGF0YSA9IHtcblx0XHRcdFx0ZmlsZURhdGE6IHtcblx0XHRcdFx0XHR1cmw6ICcnLFxuXHRcdFx0XHRcdGZvY2FsUG9pbnQ6IHtcblx0XHRcdFx0XHRcdGxlZnQ6IDAuNSxcblx0XHRcdFx0XHRcdHRvcDogMC41XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRpZDogJycsXG5cdFx0XHRcdFx0Y29sb3I6ICcnLC8vZmlsZUltZ0NvbG9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqZmlsZUltZ0NvbG9ycy5sZW5ndGgpXSxcblx0XHRcdFx0XHR0aXRsZTogJycsXG5cdFx0XHRcdFx0Y2FwdGlvbjogJycsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246ICcnLFxuXHRcdFx0XHRcdGhpZ2hSZXNvbHV0aW9uOiBmYWxzZSxcblx0XHRcdFx0XHRjYXRlZ29yaWVzOiAnJyxcblx0XHRcdFx0XHR0YWdzOiAnJyxcblx0XHRcdFx0XHRhbHRUZXh0OiAnJyxcblx0XHRcdFx0XHRjcmVkaXQ6ICcnLFxuXHRcdFx0XHRcdGNvcHlyaWdodDogJycsXG5cdFx0XHRcdFx0cmVmZXJlbmNlOiB7XG5cdFx0XHRcdFx0XHRzZXJpZXM6ICcnLFxuXHRcdFx0XHRcdFx0c2Vhc29uOiAnJyxcblx0XHRcdFx0XHRcdGVwaXNvZGU6ICcnXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0eXBlOiAnaW1hZ2UnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJ1bGtFZGl0OiB0cnVlXG5cdFx0XHR9O1xuXHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgJ3ZpZGVvJzpcblx0XHRcdGVkaXRlZEZpbGVEYXRhID0ge1xuXHRcdFx0XHRmaWxlRGF0YToge1xuXHRcdFx0XHRcdHVybDogJycsXG5cdFx0XHRcdFx0cGxheWVyOiAnJyxcblx0XHRcdFx0XHR0eXBlOiAndmlkZW8nXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJ1bGtFZGl0OiB0cnVlXG5cdFx0XHR9O1xuXHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cblx0XHRsb2FkRmlsZShlZGl0ZWRGaWxlRGF0YSk7XG5cdFx0c2hvd0J1bGtGaWxlcyhlZGl0ZWRGaWxlc0RhdGEpO1xuXG5cdH1cbn1cbmZ1bmN0aW9uIHNob3dCdWxrRmlsZXMoZmlsZXMpIHtcblx0ZGF0YUNoYW5nZWQgPSBmYWxzZTtcblx0c2Nyb2xsUG9zaXRpb24gPSAkKCdib2R5Jykuc2Nyb2xsVG9wKCk7XG5cdC8vU2hvdyBpbml0aWFsIGVkaXQgc2NyZWVuIGZvciBzaW5nbGUgaW1hZ2UuXG5cdCQoJy5wcicpLnJlbW92ZUNsYXNzKCdoaWRkZW4gdmlkZW8nKVxuXHQuYWRkQ2xhc3MoJ21vZGFsIGJ1bGsnKTtcblx0JCgnI3dyYXBwZXInKS5hZGRDbGFzcygnb3ZlcmZsb3cnKTtcblxuXHQvL1JlbW92ZSBhbGwgbXVsdGlwbGUgaW1hZ2VzIHN0eWxlIGF0dHJpYnV0ZXNcblx0JCgnLnByIC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ3ByZXZpZXdfc3R5bGVfbXVsdGkgaGlkZGVuJyk7XG5cdCQoJy5wciAuaXAnKS5yZW1vdmVDbGFzcygnaXBfc3R5bGVfbXVsdGknKTtcblx0JCgnI3NhdmVDaGFuZ2VzJykudGV4dCgnU2F2ZScpO1xuXHQkKCcjdGl0bGUnKS5wYXJlbnQoKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdCQoJyN0aXRsZScpLnJlbW92ZVByb3AoJ3JlcXVpcmVkJyk7XG5cdCQoJyN0aXRsZScpLnBhcmVudCgpLmNoaWxkcmVuKCdsYWJlbCcpLnJlbW92ZUNsYXNzKCdyZXF1aWVyZWQnKTtcblxuXHR2YXIgaW1nQ29udGFpbmVyID0gJCgnLnByIC5pbWFnZXNfX2NvbnRhaW5lcicpO1xuXHRpbWdDb250YWluZXIuZW1wdHkoKTtcblxuXHQvL0FkZCBpbWFnZXMgcHJldmllcyB0byB0aGUgY29udGFpbmVyXG5cdGZpbGVzLmZvckVhY2goZnVuY3Rpb24oZikge1xuXHRcdHZhclx0aW1hZ2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZSBpbWFnZV9zdHlsZV9idWxrJyksXG5cdFx0ZmlsZUluZGV4ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaGlkZGVuIGZpbGVfX2lkJykudGV4dChmLmZpbGVEYXRhLmlkKTtcblx0XHRpbWFnZS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKCcgKyBmLmZpbGVEYXRhLnVybCArICcpJykuYXBwZW5kKGZpbGVJbmRleCk7XG5cdFx0aW1nQ29udGFpbmVyLmFwcGVuZChpbWFnZSk7XG5cdH0pO1xuXG5cdCQoJy5wciAuaW1hZ2VzJykuYWRkQ2xhc3MoJ2ltYWdlc19zdHlsZV9idWxrJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbiBpbWFnZXNfc3R5bGVfbXVsdGknKTtcblx0JCgnLnByIC5wcmV2aWV3JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdGhpZGVMb2FkZXIoKTtcblx0c2V0TW9kYWxLZXlib2FyZEFjdGlvbnMoc2F2ZUltYWdlRWRpdCwgY2FuY2VsSW1hZ2VFZGl0KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQnVsa0VkaXRCdXR0b25DbGljayhlKSB7XG5cdCQoZS50YXJnZXQpLmJsdXIoKTtcblx0dmFyIGZpbGVzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkJyksXG5cdG51bWJlck9mU2VsZWN0ZWRJbWFnZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuanMtaW1nRmlsZVR5cGUuc2VsZWN0ZWQnKS5sZW5ndGgsXG5cdG51bWJlck9mU2VsZWN0ZWRWaWRlb3MgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuanMtdmlkZW9GaWxlVHlwZS5zZWxlY3RlZCcpLmxlbmd0aDtcblxuXHRpZiAobnVtYmVyT2ZTZWxlY3RlZEltYWdlcyAmJiBudW1iZXJPZlNlbGVjdGVkVmlkZW9zKSB7XG5cdFx0bmV3IE1vZGFsKHtcblx0XHRcdHRpdGxlOiAnWW91IGNhblxcJ3QgYnVsayBlZGl0IGltYWdlcyBhbmQgdmlkZW9zJyxcblx0XHRcdHRleHQ6ICdZb3UgY2FuXFwndCBidWxrIGVkaXQgaW1hZ2VzIGFuZCB2aWRlb3MgYXQgb25jZS4gUGxlYXNlIHNlbGVjdCBmaWxlcyBvZiB0aGUgc2FtZSB0eXBlIGFuZCB0cnkgYWdhaW4uJyxcblx0XHRcdGNvbmZpcm1UZXh0OiAnT2snLFxuXHRcdFx0b25seUNvbmZpcm06IHRydWVcblx0XHR9KTtcblx0fVxuXHRlbHNlIHtcblx0XHRpZiAobnVtYmVyT2ZTZWxlY3RlZFZpZGVvcykge1xuXHRcdFx0YnVsa0VkaXRGaWxlcyhmaWxlcywgJ3ZpZGVvcycpO1xuXHRcdH0gZWxzZSBpZihudW1iZXJPZlNlbGVjdGVkSW1hZ2VzKSB7XG5cdFx0XHRidWxrRWRpdEZpbGVzKGZpbGVzLCAnaW1hZ2VzJyk7XG5cdFx0fVxuXHR9XG59XG5cbi8vSGVscCBmdW5jdGlvblxuZnVuY3Rpb24gZmlsZUJ5SWQoaWQsIGZpbGVzKSB7XG5cdGZpbGVzRmlsdGVyZWQgPSBmaWxlcy5maWx0ZXIoZnVuY3Rpb24oZikge1xuXHRcdHJldHVybiBmLmZpbGVEYXRhLmlkID09PSBpZDtcblx0fSk7XG5cdHJldHVybiBmaWxlc0ZpbHRlcmVkWzBdO1xufVxuXG4vL1NhdmUgZmlsZVxuZnVuY3Rpb24gc2F2ZUZpbGUoZmlsZXMsIGZpbGUpIHtcblx0ZmlsZXMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG5cdFx0aWYgKGYuZmlsZURhdGEuaWQgPT09IGZpbGUuZmlsZURhdGEuaWQpIHtcblx0XHRcdGYgPSBmaWxlO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHN3aXRjaEltYWdlKGltYWdlKSB7XG5cdCQoJy5pbWctd3JhcHBlcicpLnJlbW92ZUNsYXNzKCdpcy1zbGlkaW5nTGVmdCBpcy1zbGlkaW5nUmlnaHQnKTtcblx0dmFyIG5ld0ZpbGVJZCA9IGltYWdlLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKSxcblx0bmV3RmlsZSA9IGZpbGVCeUlkKG5ld0ZpbGVJZCwgZWRpdGVkRmlsZXNEYXRhKSxcblx0bmV3SW5kZXggPSBpbWFnZS5pbmRleCgpLFxuXHRjdXJyZW50SW1hZ2UgPSAkKCcuaW1hZ2UuaXMtYWN0aXZlJyksXG5cdGN1cnJlbnRJbmRleCA9IGN1cnJlbnRJbWFnZS5pbmRleCgpLFxuXHRjdXJyZW50RmlsZSA9IGZpbGVCeUlkKGN1cnJlbnRJbWFnZS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCksIGVkaXRlZEZpbGVzRGF0YSksXG5cdGJhY2tJbWFnZSA9ICQoJyNwcmV2aWV3SW1nQmFjaycpLFxuXHRwcmV2aWV3SW1hZ2UgPSAkKCcjcHJldmlld0ltZycpO1xuXG5cdHNhdmVGaWxlKGVkaXRlZEZpbGVzRGF0YSwgZWRpdGVkRmlsZURhdGEpO1xuXHRlZGl0ZWRGaWxlRGF0YSA9IG5ld0ZpbGU7XG5cdGxvYWRGaWxlKGVkaXRlZEZpbGVEYXRhKTtcblxuXHQvKmJhY2tJbWFnZS5hZGRDbGFzcygnaXMtdmlzaWJsZScpXG5cdC5hdHRyKCdzcmMnLCBjdXJyZW50RmlsZS5maWxlRGF0YS51cmwpXG5cdC5jc3MoJ3dpZHRoJywgcHJldmlld0ltYWdlLndpZHRoKCkpXG5cdC5jc3MoJ2hlaWdodCcsIHByZXZpZXdJbWFnZS5oZWlnaHQoKSlcblx0LmNzcygnbGVmdCcsIHByZXZpZXdJbWFnZS5vZmZzZXQoKS5sZWZ0KVxuXHQuY3NzKCd0b3AnLCBwcmV2aWV3SW1hZ2Uub2Zmc2V0KCkudG9wKTtcblxuXHQqL1xuXG5cdGN1cnJlbnRJbWFnZS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdGltYWdlLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblxuXHRpZiAoY3VycmVudEluZGV4ID4gbmV3SW5kZXgpIHtcblx0XHQkKCcuaW1nLXdyYXBwZXInKS5hZGRDbGFzcygnaXMtc2xpZGluZ0xlZnQnKTtcblx0fSBlbHNlIHtcblx0XHQkKCcuaW1nLXdyYXBwZXInKS5hZGRDbGFzcygnaXMtc2xpZGluZ1JpZ2h0Jyk7XG5cdH1cblxuXHR2YXIgaW1hZ2VDb250YWluZXIgPSBpbWFnZS5wYXJlbnRzKCcuaW1hZ2VzX19jb250YWluZXInKSxcblx0aW1hZ2VXcmFwcGVyID0gaW1hZ2UucGFyZW50cygnLmltYWdlc19fd3JhcHBlcicpLFxuXHRpbWFnZUxlZnRFbmQgPSBpbWFnZUNvbnRhaW5lci5wb3NpdGlvbigpLmxlZnQgKyBpbWFnZS5wb3NpdGlvbigpLmxlZnQsXG5cdGltYWdlUmlnaHRFbmQgPSBpbWFnZUNvbnRhaW5lci5wb3NpdGlvbigpLmxlZnQgKyBpbWFnZS5wb3NpdGlvbigpLmxlZnQgKyBpbWFnZS53aWR0aCgpO1xuXG5cdGlmIChpbWFnZUxlZnRFbmQgPCAwKSB7XG5cdFx0JCgnI2ltYWdlc19fd3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogaW1hZ2UucG9zaXRpb24oKS5sZWZ0IC0gMzB9LCA0MDApO1xuXHR9IGVsc2UgaWYgKGltYWdlUmlnaHRFbmQgPiBpbWFnZVdyYXBwZXIud2lkdGgoKSkge1xuXHRcdCQoJyNpbWFnZXNfX3dyYXBwZXInKS5hbmltYXRlKCB7IHNjcm9sbExlZnQ6IGltYWdlLnBvc2l0aW9uKCkubGVmdCArIGltYWdlLndpZHRoKCkgLSBpbWFnZVdyYXBwZXIud2lkdGgoKSArIDUwfSwgNDAwKTtcblx0fVxuXG5cdC8vYWRqdXN0UmVjdCgkKCcucHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlLWltZycpLmZpcnN0KCkpO1xuXHQvLyQoJyNwdXJwb3NlV3JhcHBlcicpLmFuaW1hdGUoIHsgc2Nyb2xsTGVmdDogJzAnIH0sIDgwMCk7XG59XG5mdW5jdGlvbiBoYW5kbGVJbWFnZVN3aXRjaChlKSB7XG5cdHN3aXRjaEltYWdlKCQoZS50YXJnZXQpKTtcbn1cblxuLy9GdW5jdGlvbiBmb3IgaGFuZGxlIEVkaXQgQnV0dG9uIGNsaWNrc1xuZnVuY3Rpb24gaGFuZGxlRmlsZWRFZGl0QnV0dG9uQ2xpY2soZSkge1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR2YXIgZmlsZUVsZW1lbnQgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpO1xuXG5cdHZhciBmaWxlID0gZ2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcblx0XHRyZXR1cm4gZi5maWxlRGF0YS5pZCA9PT0gJChmaWxlRWxlbWVudCkuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpO1xuXHR9KTtcblxuXHRlZGl0RmlsZXMoZmlsZSk7XG59XG5mdW5jdGlvbiBoYW5kbGVNdWx0aUVkaXRCdXR0b25DbGljayhlKSB7XG5cdCQoZS50YXJnZXQpLmJsdXIoKTtcblx0dmFyIGZpbGVzRWxlbWVudHMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKSxcblx0Y2xvbmVkR2FsbGVyeU9iamVjdHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGdhbGxlcnlPYmplY3RzKSksXG5cdGZpbGVzID0gW10sXG5cdG51bWJlck9mU2VsZWN0ZWRJbWFnZXMgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuanMtaW1nRmlsZVR5cGUuc2VsZWN0ZWQnKS5sZW5ndGgsXG5cdG51bWJlck9mU2VsZWN0ZWRWaWRlb3MgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuanMtdmlkZW9GaWxlVHlwZS5zZWxlY3RlZCcpLmxlbmd0aDtcblxuXHRpZiAobnVtYmVyT2ZTZWxlY3RlZEltYWdlcyAmJiBudW1iZXJPZlNlbGVjdGVkVmlkZW9zKSB7XG5cdFx0bmV3IE1vZGFsKHtcblx0XHRcdHRpdGxlOiAnWW91IGNhblxcJ3QgbXVsdGkgZWRpdCBpbWFnZXMgYW5kIHZpZGVvcycsXG5cdFx0XHR0ZXh0OiAnWW91IGNhblxcJ3QgbXVsdGkgZWRpdCBpbWFnZXMgYW5kIHZpZGVvcyBhdCBvbmNlLiBQbGVhc2Ugc2VsZWN0IGZpbGVzIG9mIHRoZSBzYW1lIHR5cGUgYW5kIHRyeSBhZ2Fpbi4nLFxuXHRcdFx0Y29uZmlybVRleHQ6ICdPaycsXG5cdFx0XHRvbmx5Q29uZmlybTogdHJ1ZVxuXHRcdH0pO1xuXHR9XG5cdGVsc2Uge1xuXHRcdC8vT2J0YWluIGZpbGVzIGRhdGEgZm9yIGZpbGVzIHRoYXQgc2hvdWxkIGJlIGVkaXRlZFxuXHRcdGZpbGVzRWxlbWVudHMuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuXHRcdFx0dmFyIGZpbGUgPSBbXS5jb25jYXQoY2xvbmVkR2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcblx0XHRcdFx0cmV0dXJuIGYuZmlsZURhdGEuaWQgPT09ICQoZWwpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcblx0XHRcdH0pKVswXTtcblx0XHRcdGZpbGVzLnB1c2goZmlsZSk7XG5cdFx0fSk7XG5cblx0XHRlZGl0RmlsZXMoZmlsZXMpO1xuXHR9XG59XG5cblxuZnVuY3Rpb24gY2FuY2VsSW1hZ2VFZGl0KCkge1xuXHRpZiAoZGF0YUNoYW5nZWQpIHtcblx0XHRuZXcgTW9kYWwoe1xuXHRcdFx0ZGlhbG9nOiB0cnVlLFxuXHRcdFx0dGl0bGU6ICdDYW5jZWwgQ2hhbmdlcz8nLFxuXHRcdFx0dGV4dDogJ0FueSB1bnNhdmVkIGNoYW5nZXMgeW91IG1hZGUgd2lsbCBiZSBsb3N0LiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gY2FuY2VsPycsXG5cdFx0XHRjb25maXJtVGV4dDogJ0NhbmNlbCcsXG5cdFx0XHRjb25maXJtQWN0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y2xvc2VFZGl0U2NyZWVuKCk7XG5cdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcblx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG5cdFx0XHR9LFxuXHRcdFx0Y2FuY2VsQWN0aW9uOiBzZXRNb2RhbEtleWJvYXJkQWN0aW9ucyhzYXZlSW1hZ2VFZGl0LCBjYW5jZWxJbWFnZUVkaXQpXG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0Y2xvc2VFZGl0U2NyZWVuKCk7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVzY0tleWRvd24pO1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFbnRlcktleWRvd24pO1xuXHR9XG59XG5mdW5jdGlvbiBzYXZlSW1hZ2VFZGl0KCkge1xuXHR2YXIgZW1wdHlSZXF1aXJlZEZpZWxkID0gZmFsc2UsXG5cdGVtcHR5SW1hZ2U7XG5cdHZhciBlbXB0eUZpZWxkcyA9IGNoZWNrRmllbGRzKCcucHIgbGFiZWwucmVxdWllcmVkJyk7XG5cdGlmIChlbXB0eUZpZWxkcyB8fCBlZGl0ZWRGaWxlRGF0YS5maWxlRGF0YS50eXBlID09PSAndmlkZW8nKSB7XG5cdFx0ZWRpdGVkRmlsZXNEYXRhLmZvckVhY2goZnVuY3Rpb24oZmQpIHtcblx0XHRcdGlmIChmZC5maWxlRGF0YS50aXRsZSA9PT0gJycgJiYgIWVtcHR5UmVxdWlyZWRGaWVsZCkge1xuXHRcdFx0XHRlbXB0eVJlcXVpcmVkRmllbGQgPSB0cnVlO1xuXHRcdFx0XHRlbXB0eUltYWdlID0gJCgnLmltYWdlLmltYWdlX3N0eWxlX211bHRpIC5maWxlX19pZFtkYXRhLWlkPVwiJyArIGZkLmZpbGVEYXRhLmlkICsgJ1wiXScpLnBhcmVudHMoJy5pbWFnZScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKGVtcHR5UmVxdWlyZWRGaWVsZCkge1xuXHRcdFx0c3dpdGNoSW1hZ2UoZW1wdHlJbWFnZSk7XG5cdFx0XHQkKCcuanMtcmVxdWlyZWQnKS5ub3QoJy5qcy1oYXNWYWx1ZScpLmZpcnN0KCkuYWRkQ2xhc3MoJ2lucHV0X3N0YXRlX2VyciBpcy1ibGlua2luZycpLmZvY3VzKCk7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAoZS5hbmltYXRpb25OYW1lID09PSAndGV4dGZpZWxkLWZvY3VzLWJsaW5rJykgeyQoZS50YXJnZXQpLnBhcmVudCgpLmZpbmQoJy5pcy1ibGlua2luZycpLnJlbW92ZUNsYXNzKCdpcy1ibGlua2luZycpO31cblx0XHRcdH0pO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBjbG9uZWRFZGl0ZWRGaWxlcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZWRpdGVkRmlsZXNEYXRhKSk7XG5cdFx0XHRjbG9uZWRFZGl0ZWRGaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGZkKSB7XG5cdFx0XHRcdHZhciBmaWxlID0gZ2FsbGVyeU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcblx0XHRcdFx0XHRyZXR1cm4gZi5maWxlRGF0YS5pZCA9PT0gZmQuZmlsZURhdGEuaWQ7XG5cdFx0XHRcdH0pWzBdO1xuXHRcdFx0XHR2YXIgZmlsZUluZGV4ID0gZ2FsbGVyeU9iamVjdHMuaW5kZXhPZihmaWxlKTtcblxuXHRcdFx0XHRnYWxsZXJ5T2JqZWN0cyA9IGdhbGxlcnlPYmplY3RzLnNsaWNlKDAsIGZpbGVJbmRleCkuY29uY2F0KFtmZF0pLmNvbmNhdChnYWxsZXJ5T2JqZWN0cy5zbGljZShmaWxlSW5kZXggKyAxKSk7XG5cblx0XHRcdFx0LypnYWxsZXJ5T2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcblx0XHRcdFx0aWYgKGYuZmlsZURhdGEuaWQgPT09IGZkLmZpbGVEYXRhLmlkKSB7XG5cdFx0XHRcdGYgPSBmZDtcblx0XHRcdFx0Zi5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pOyovXG5cdH0pO1xuXHRzaG93Tm90aWZpY2F0aW9uKCdUaGUgY2hhbmdlIGluIHRoZSBtZXRhZGF0YSBpcyBzYXZlZCB0byB0aGUgYXNzZXQuJyk7XG5cdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcblx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG5cdHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge2Nsb3NlRWRpdFNjcmVlbigpO30sIDIwMDApO1xuXHRjb25zb2xlLmxvZyhnYWxsZXJ5T2JqZWN0cyk7XG5cdGRlc2VsZWN0QWxsKCk7XG5cdHVwZGF0ZUdhbGxlcnkoKTtcbn1cblxufVxufVxuLypRdWljayBFZGl0IEZpbGUgVGl0bGUgYW5kIEluZm8gKi9cbmZ1bmN0aW9uIGVkaXRGaWxlVGl0bGUoZSkge1xuXHRpZiAoISQoJy5hbCcpLmhhc0NsYXNzKCdtb2RhbCcpKSB7XG5cdFx0dmFyIGZpbGVJbmZvID0gZS50YXJnZXQ7XG5cdFx0dmFyIGZpbGVJbmZvVGV4dCA9IGZpbGVJbmZvLmlubmVySFRNTDtcblx0XHR2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXHRcdGlucHV0LnR5cGUgPSAndGV4dCc7XG5cdFx0aW5wdXQudmFsdWUgPSBmaWxlSW5mb1RleHQ7XG5cblx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIGlucHV0ID0gZS50YXJnZXQ7XG5cdFx0XHRmaWxlSW5mbyA9IGlucHV0LnBhcmVudE5vZGU7XG5cdFx0XHRmaWxlSW5mby5yZW1vdmVDaGlsZChpbnB1dCk7XG5cdFx0XHRmaWxlSW5mby5jbGFzc0xpc3QucmVtb3ZlKCdlZGl0Jyk7XG5cdFx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSBpbnB1dC52YWx1ZTtcblx0XHR9KTtcblx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMTMgfHwgZS53aGljaCA9PSAxMykge1xuXHRcdFx0XHR2YXIgaW5wdXQgPSBlLnRhcmdldDtcblx0XHRcdFx0ZmlsZUluZm8gPSBpbnB1dC5wYXJlbnROb2RlO1xuXHRcdFx0XHRmaWxlSW5mby5yZW1vdmVDaGlsZChpbnB1dCk7XG5cdFx0XHRcdGZpbGVJbmZvLmNsYXNzTGlzdC5yZW1vdmUoJ2VkaXQnKTtcblx0XHRcdFx0ZmlsZUluZm8uaW5uZXJIVE1MID0gaW5wdXQudmFsdWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSAnJztcblx0XHRmaWxlSW5mby5hcHBlbmRDaGlsZChpbnB1dCk7XG5cdFx0ZmlsZUluZm8uY2xhc3NMaXN0LmFkZCgnZWRpdCcpO1xuXHRcdGlucHV0LmZvY3VzKCk7XG5cdH1cbn1cbmZ1bmN0aW9uIGVkaXRGaWxlQ2FwdGlvbihlKSB7XG5cdGlmICghJCgnLmFsJykuaGFzQ2xhc3MoJ21vZGFsJykpIHtcblx0XHR2YXIgZmlsZUluZm8gPSBlLnRhcmdldDtcblx0XHR2YXIgZmlsZUluZm9UZXh0ID0gZmlsZUluZm8uaW5uZXJIVE1MO1xuXHRcdHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG5cdFx0Ly9pbnB1dC50eXBlID0gJ3RleHQnXG5cdFx0aW5wdXQudmFsdWUgPSBmaWxlSW5mb1RleHQ7XG5cblx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIGlucHV0ID0gZS50YXJnZXQ7XG5cdFx0XHRmaWxlSW5mbyA9IGlucHV0LnBhcmVudE5vZGU7XG5cdFx0XHRmaWxlSW5mby5yZW1vdmVDaGlsZChpbnB1dCk7XG5cdFx0XHRmaWxlSW5mby5jbGFzc0xpc3QucmVtb3ZlKCdlZGl0Jyk7XG5cdFx0XHRmaWxlSW5mby5pbm5lckhUTUwgPSBpbnB1dC52YWx1ZTtcblx0XHR9KTtcblx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMTMgfHwgZS53aGljaCA9PSAxMykge1xuXHRcdFx0XHR2YXIgaW5wdXQgPSBlLnRhcmdldDtcblx0XHRcdFx0ZmlsZUluZm8gPSBpbnB1dC5wYXJlbnROb2RlO1xuXHRcdFx0XHRmaWxlSW5mby5yZW1vdmVDaGlsZChpbnB1dCk7XG5cdFx0XHRcdGZpbGVJbmZvLmNsYXNzTGlzdC5yZW1vdmUoJ2VkaXQnKTtcblx0XHRcdFx0ZmlsZUluZm8uaW5uZXJIVE1MID0gaW5wdXQudmFsdWU7XG5cdFx0XHR9XG5cblx0XHR9KTtcblxuXHRcdGZpbGVJbmZvLmlubmVySFRNTCA9ICcnO1xuXHRcdGZpbGVJbmZvLmFwcGVuZENoaWxkKGlucHV0KTtcblx0XHRmaWxlSW5mby5jbGFzc0xpc3QuYWRkKCdlZGl0Jyk7XG5cdFx0aW5wdXQuZm9jdXMoKTtcblx0fVxufVxuXG5cbmZ1bmN0aW9uIGRlbGV0ZUZpbGUoZmlsZSwgZmlsZXMpIHtcblx0ZmlsZXMgPSBmaWxlcy5zcGxpY2UoZmlsZXMuaW5kZXhPZihmaWxlKSwgMSk7XG59XG5mdW5jdGlvbiBkZWxldGVGaWxlQnlJZChpZCwgZmlsZXMpIHtcblx0dmFyIGZpbGUgPSBmaWxlQnlJZChpZCwgZmlsZXMpO1xuXHRkZWxldGVGaWxlKGZpbGUsIGZpbGVzKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlRGVsZXRlQ2xpY2soZSkge1xuXHR2YXIgaXRlbU5hbWUgPSAkKCcubWVudSAuaXMtYWN0aXZlJykudGV4dCgpLnRvTG93ZXJDYXNlKCk7XG5cdG5ldyBNb2RhbCh7XG5cdFx0dGl0bGU6ICdSZW1vdmUgQXNzZXQ/Jyxcblx0XHR0ZXh0OiAnU2VsZWN0ZWQgYXNzZXQgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhpcyAnICsgaXRlbU5hbWUgKyAnLiBEb27igJl0IHdvcnJ5LCBpdCB3b27igJl0IGJlIHJlbW92ZWQgZnJvbSB0aGUgQXNzZXQgTGlicmFyeS4nLFxuXHRcdGNvbmZpcm1UZXh0OiAnUmVtb3ZlJyxcblx0XHRjb25maXJtQWN0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBmaWxlSWQgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmlsZScpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcblx0XHRcdGRlbGV0ZUZpbGVCeUlkKGZpbGVJZCwgZ2FsbGVyeU9iamVjdHMpO1xuXHRcdFx0dXBkYXRlR2FsbGVyeSgpO1xuXHRcdH1cblx0fSk7XG59XG5cbiQoJy5maWxlLXRpdGxlJykuY2xpY2soZWRpdEZpbGVUaXRsZSk7XG4kKCcuZmlsZS1jYXB0aW9uJykuY2xpY2soZWRpdEZpbGVDYXB0aW9uKTtcblxuLy9GaWxlIHVwbG9hZFxuZnVuY3Rpb24gaGFuZGxlRmlsZXMoZmlsZXMpIHtcblx0dmFyIGZpbGVzT3V0cHV0ID0gW107XG5cdGlmIChmaWxlcyAmJiBmaWxlcy5sZW5ndGggPjApIHtcblx0XHRmb3IgKHZhciBpPTA7IGk8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRmaWxlc091dHB1dC5wdXNoKGZpbGVzW2ldKTtcblx0XHR9XG5cdFx0Ly9zaG93TG9hZGVyKCk7XG5cdFx0dmFyIHVwbG9hZGVkRmlsZXMgPSBmaWxlc091dHB1dC5tYXAoZnVuY3Rpb24oZikge1xuXHRcdFx0cmV0dXJuIGZpbGVUb09iamVjdChmKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0XHRnYWxsZXJ5T2JqZWN0cy5wdXNoKHtcblx0XHRcdFx0XHRmaWxlRGF0YTogcmVzLFxuXHRcdFx0XHRcdHNlbGVjdGVkOiBmYWxzZSxcblx0XHRcdFx0XHRwb3NpdGlvbjogMTAwMCxcblx0XHRcdFx0XHRjYXB0aW9uOiAnJyxcblx0XHRcdFx0XHRnYWxsZXJ5Q2FwdGlvbjogZmFsc2UsXG5cdFx0XHRcdFx0anVzdFVwbG9hZGVkOiB0cnVlLFxuXHRcdFx0XHRcdGxvYWRpbmc6IHRydWVcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHRQcm9taXNlLmFsbCh1cGxvYWRlZEZpbGVzKS50aGVuKGZ1bmN0aW9uKHJlcykge3VwZGF0ZUdhbGxlcnkoZ2FsbGVyeU9iamVjdHMubGVuZ3RoKTt9KTtcblx0fVxufVxuXG4vL0NvbnZlcnQgdXBsb2FkZWQgZmlsZXMgdG8gZWxlbWVudHNcbmZ1bmN0aW9uIGZpbGVUb01hcmt1cChmaWxlKSB7XG5cdHJldHVybiByZWFkRmlsZShmaWxlKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuXHRcdHZhciBmaWxlTm9kZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUnKSxcblxuXHRcdFx0ZmlsZUltZyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUtaW1nJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgcmVzdWx0LnNyYyArICcpJyksXG5cblx0XHRcdGZpbGVDb250cm9scyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUtY29udHJvbHMnKS5jbGljayh0b2dnbGVGaWxlU2VsZWN0KSxcblx0XHRcdGNoZWNrbWFyayA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2NoZWNrbWFyaycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuXHRcdFx0Y2xvc2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdjbG9zZScpLmNsaWNrKGRlbGV0ZUZpbGUpLFxuXHRcdFx0ZWRpdCA9ICQoJzxidXR0b24+RWRpdDwvYnV0dG9uPicpLmFkZENsYXNzKCdidXR0b24gd2hpdGVPdXRsaW5lJykuY2xpY2soZWRpdEZpbGUpLFxuXG5cdFx0XHRmaWxlVGl0bGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190aXRsZScpLFxuXHRcdFx0ZmlsZVR5cGVJY29uID0gJCgnPGkgY2xhc3M9XCJmYSBmYS1jYW1lcmFcIj48L2k+JykuY3NzKCdtYXJnaW4tcmlnaHQnLCAnMnB4JyksXG5cdFx0XHRmaWxlVGl0bGVJbnB1dCA9ICQoJzxpbnB1dCB0eXBlPVwidGV4dFwiIC8+JykudmFsKHJlc3VsdC5uYW1lKSxcblxuXHRcdFx0ZmlsZUNhcHRpb24gPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlLWNhcHRpb24nKS50ZXh0KHJlc3VsdC5uYW1lKS5jbGljayhlZGl0RmlsZUNhcHRpb24pLFxuXHRcdFx0ZmlsZUluZm8gPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlLWluZm8nKS50ZXh0KHJlc3VsdC5pbmZvKSxcblxuXHRcdFx0ZmlsZVB1cnBvc2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlLXB1cnBvc2UnKSxcblx0XHRcdGZpbGVQdXJwb3NlU2VsZWN0ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnc2VsZWN0JykuY2xpY2sob3BlblNlbGVjdCksXG5cdFx0XHRzZWxlY3RTcGFuID0gJCgnPHNwYW4+U2VsZWN0IHVzZTwvc3Bhbj4nKSxcblx0XHRcdHNlbGVjdFVsID0gJCgnPHVsPjwvdWw+JyksXG5cdFx0XHRzZWxlY3RMaTEgPSAkKCc8bGk+Q292ZXI8L2xpPicpLmNsaWNrKHNldFNlbGVjdCksXG5cdFx0XHRzZWxlY3RMaTIgPSAkKCc8bGk+UHJpbWFyeTwvbGk+JykuY2xpY2soc2V0U2VsZWN0KSxcblx0XHRcdHNlbGVjdExpMyA9ICQoJzxsaT5TZWNvbmRhcnk8L2xpPicpLmNsaWNrKHNldFNlbGVjdCk7XG5cblx0XHRmaWxlVGl0bGUuYXBwZW5kKGZpbGVUeXBlSWNvbiwgZmlsZVRpdGxlSW5wdXQpO1xuXHRcdHNlbGVjdFVsLmFwcGVuZChzZWxlY3RMaTEsIHNlbGVjdExpMiwgc2VsZWN0TGkzKTtcblx0XHRmaWxlUHVycG9zZVNlbGVjdC5hcHBlbmQoc2VsZWN0U3Bhbiwgc2VsZWN0VWwpO1xuXG5cdFx0ZmlsZVB1cnBvc2UuYXBwZW5kKGZpbGVQdXJwb3NlU2VsZWN0KTtcblx0XHRmaWxlQ29udHJvbHMuYXBwZW5kKGNoZWNrbWFyaywgY2xvc2UsIGVkaXQpO1xuXHRcdGZpbGVJbWcuYXBwZW5kKGZpbGVDb250cm9scyk7XG5cblx0XHRmaWxlTm9kZS5hcHBlbmQoZmlsZUltZywgZmlsZVRpdGxlLCBmaWxlQ2FwdGlvbiwgZmlsZUluZm8sIGZpbGVQdXJwb3NlKTtcblxuXHRcdHJldHVybiBmaWxlTm9kZTtcblx0fSk7XG59XG5cbi8vQ29udmVydCB1cGxvYWRlZCBmaWxlIHRvIG9iamVjdFxuZnVuY3Rpb24gZmlsZVRvT2JqZWN0KGZpbGUpIHtcblx0cmV0dXJuIHJlYWRGaWxlKGZpbGUpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG5cdFx0cmV0dXJuIHtcblx0ICAgICAgICB1cmw6IHJlc3VsdC5zcmMsXG5cdCAgICAgICAgZm9jYWxQb2ludDoge1xuXHQgICAgICAgICAgICBsZWZ0OiAwLjUsXG5cdCAgICAgICAgICAgIHRvcDogMC41XG5cdCAgICAgICAgfSxcblx0XHRcdGlkOiByZXN1bHQubmFtZSArICcgJyArIG5ldyBEYXRlKCksXG5cdFx0XHRkYXRlQ3JlYXRlZDogbmV3IERhdGUoKSxcblx0ICAgICAgICBjb2xvcjogJycsLy9maWxlSW1nQ29sb3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpmaWxlSW1nQ29sb3JzLmxlbmd0aCldLFxuXHQgICAgICAgIHRpdGxlOiByZXN1bHQubmFtZSxcblx0ICAgICAgICBjYXB0aW9uOiAnJyxcblx0ICAgICAgICBkZXNjcmlwdGlvbjogJycsXG5cdCAgICAgICAgaGlnaFJlc29sdXRpb246IGZhbHNlLFxuXHQgICAgICAgIGNhdGVnb3JpZXM6ICcnLFxuXHQgICAgICAgIHRhZ3M6ICcnLFxuXHQgICAgICAgIGFsdFRleHQ6ICcnLFxuXHQgICAgICAgIGNyZWRpdDogJycsXG5cdCAgICAgICAgY29weXJpZ2h0OiAnJyxcblx0ICAgICAgICByZWZlcmVuY2U6IHtcblx0ICAgICAgICAgICAgc2VyaWVzOiAnJyxcblx0ICAgICAgICAgICAgc2Vhc29uOiAnJyxcblx0ICAgICAgICAgICAgZXBpc29kZTogJydcblx0ICAgICAgICB9LFxuXHRcdFx0dHlwZTogJ2ltYWdlJ1xuXHQgICAgfTtcblx0fSk7XG59XG5cbi8vUmVhZCBmaWxlIGFuZCByZXR1cm4gcHJvbWlzZVxuZnVuY3Rpb24gcmVhZEZpbGUoZmlsZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoXG5cdFx0ZnVuY3Rpb24ocmVzLCByZWopIHtcblx0XHRcdHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0cmVzKHtzcmM6IGUudGFyZ2V0LnJlc3VsdCxcblx0XHRcdFx0XHRuYW1lOiBmaWxlLm5hbWUsXG5cdFx0XHRcdFx0aW5mbzogZmlsZS50eXBlICsgJywgJyArIE1hdGgucm91bmQoZmlsZS5zaXplLzEwMjQpLnRvU3RyaW5nKCkgKyAnIEtiJ30pO1xuXHRcdFx0fTtcblx0XHRcdHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJlaih0aGlzKTtcblx0XHRcdH07XG5cdFx0XHRyZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcblx0XHR9XG5cdCk7XG59XG5cbi8vTG9hZGVyc1xuZnVuY3Rpb24gc2hvd0xvYWRlcigpIHtcblx0dmFyIG1vZGFsID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWwnKS5hdHRyKCdpZCcsICdsb2FkZXJNb2RhbCcpLFxuXHRcdGxvYWRlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2xvYWRlcicpO1xuXG5cdG1vZGFsLmFwcGVuZChsb2FkZXIpO1xuXHQkKCdib2R5JykuYXBwZW5kKG1vZGFsKTtcbn1cbmZ1bmN0aW9uIGhpZGVMb2FkZXIoKSB7XG5cdCQoJyNsb2FkZXJNb2RhbCcpLnJlbW92ZSgpO1xufVxuXG4vL0RyYWcgYW5kIGRyb3AgZmlsZXNcbmZ1bmN0aW9uIGhhbmRsZURyYWdFbnRlcihlKSB7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJjb3B5XCI7XG5cdCQoJyNkcm9wWm9uZScpLmFkZENsYXNzKCdtb2RhbCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkcm9wWm9uZVwiKS5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBoYW5kbGVEcmFnTGVhdmUsIHRydWUpO1xufVxuZnVuY3Rpb24gaGFuZGxlRHJhZ0xlYXZlKGUpIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHQkKFwiI2Ryb3Bab25lXCIpLnJlbW92ZUNsYXNzKCdtb2RhbCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3cmFwcGVyXCIpLmNsYXNzTGlzdC5yZW1vdmUoJ2xvY2tlZCcpO1xufVxuZnVuY3Rpb24gaGFuZGxlRHJvcChlKSB7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQkKFwiI2Ryb3Bab25lXCIpLnJlbW92ZUNsYXNzKCdtb2RhbCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0dmFyIGZpbGVzID0gZS5kYXRhVHJhbnNmZXIuZmlsZXM7XG5cdGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0aGFuZGxlRmlsZXMoZmlsZXMpO1xuXHR9XG59XG5mdW5jdGlvbiBoYW5kbGVEcmFnT3ZlcihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG59XG5cbi8vVXBsb2FkIGZpbGUgZnJvbSBcIlVwbG9hZCBGaWxlXCIgQnV0dG9uXG5mdW5jdGlvbiBoYW5kbGVVcGxvYWRGaWxlc0NsaWNrKGUpIHtcblx0dmFyIGZpbGVzSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVzSW5wdXRcIik7XG4gICAgaWYgKCFmaWxlc0lucHV0KSB7XG4gICAgXHRmaWxlc0lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICBmaWxlc0lucHV0LnR5cGUgPSBcImZpbGVcIjtcbiAgICAgICAgZmlsZXNJbnB1dC5tdWx0aXBsZSA9IFwidHJ1ZVwiO1xuICAgICAgICBmaWxlc0lucHV0LmhpZGRlbiA9IHRydWU7XG4gICAgICAgIGZpbGVzSW5wdXQuYWNjZXB0ID0gXCJpbWFnZS8qLCBhdWRpby8qLCB2aWRlby8qXCI7XG4gICAgICAgIGZpbGVzSW5wdXQuaWQgPSBcImZpbGVzSW5wdXRcIjtcbiAgICAgICAgZmlsZXNJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgIGhhbmRsZUZpbGVzKGUudGFyZ2V0LmZpbGVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZpbGVzSW5wdXQpO1xuICAgIH1cbiAgICBmaWxlc0lucHV0LmNsaWNrKCk7XG59XG5cbi8vVG9vbHRpcFxuZnVuY3Rpb24gY3JlYXRlVG9vbHRpcCh0YXJnZXQsIHRleHQpIHtcbiAgICB2YXIgdG9vbHRpcCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3Rvb2x0aXAnKSxcbiAgICAgICAgdG9vbHRpcFRleHQgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCd0b29sdGlwX190ZXh0JykudGV4dCh0ZXh0KSxcbiAgICAgICAgdG9vbHRpcFRvZ2dsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ3Rvb2x0aXBfX3RvZ2dsZScpLFxuICAgICAgICB0b29sdGlwVG9nZ2xlX1RvZ2dsZSA9ICQoJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cIm5ldmVyU2hvd1Rvb2x0aXBcIiAvPicpLC8vLm9uKCdjaGFuZ2UnLCBuZXZlclNob3dUb29sdGlwKSxcbiAgICAgICAgdG9vbHRpcFRvZ2dsZV9MYWJlbCA9ICQoJzxsYWJlbCBmb3I9XCJuZXZlclNob3dUb29sdGlwXCI+R290IGl0LCBkb25cXCd0IHNob3cgbWUgdGhpcyBhZ2FpbjwvbGFiZWw+Jyk7XG5cbiAgICB0b29sdGlwVG9nZ2xlLmFwcGVuZCh0b29sdGlwVG9nZ2xlX1RvZ2dsZSwgdG9vbHRpcFRvZ2dsZV9MYWJlbCk7XG4gICAgdG9vbHRpcFRvZ2dsZS5iaW5kKCdmb2N1cyBjbGljayBjaGFuZ2UnLCBuZXZlclNob3dUb29sdGlwKTtcbiAgICB0b29sdGlwLmFwcGVuZCh0b29sdGlwVGV4dCwgdG9vbHRpcFRvZ2dsZSk7XG4gICAgJCgnLmZpbGVfX2NhcHRpb24tdGV4dGFyZWEnKS5yZW1vdmVBdHRyKCdpZCcpO1xuICAgICQodGFyZ2V0KS5wYXJlbnQoKS5hcHBlbmQodG9vbHRpcCk7XG4gICAgdGFyZ2V0LmF0dHIoJ2lkJywgJ2FjdGl2ZS1jYXB0aW9uLXRleHRhcmVhJyk7XG5cbiAgICB0b29sdGlwLndpZHRoKHRhcmdldC53aWR0aCgpKTtcbiAgICBpZiAoJCgnYm9keScpLndpZHRoKCkgLSB0YXJnZXQub2Zmc2V0KCkubGVmdCAtIHRhcmdldC53aWR0aCgpIC0gdGFyZ2V0LndpZHRoKCkgLSAyMCA+IDAgKSB7XG4gICAgICAgIHRvb2x0aXAuY3NzKCdsZWZ0JywgdGFyZ2V0LnBvc2l0aW9uKCkubGVmdCArIHRhcmdldC53aWR0aCgpICsgMTApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRvb2x0aXAuY3NzKCdsZWZ0JywgdGFyZ2V0LnBvc2l0aW9uKCkubGVmdCAtIHRhcmdldC53aWR0aCgpIC0gMTApO1xuICAgIH1cbiAgICAvL3ZhciBub3RJbmNsdWRlID0gdG9vbHRpcC5hZGQodG9vbHRpcFRleHQpLmFkZCh0b29sdGlwVG9nZ2xlKS5hZGQodG9vbHRpcFRvZ2dsZV9MYWJlbCkuYWRkKHRvb2x0aXBUb2dnbGVfVG9nZ2xlKS5hZGQodGFyZ2V0KTtcbiAgICBjb25zb2xlLmxvZygkKCcjYWN0aXZlLWNhcHRpb24tdGV4dGFyZWEnKSk7XG4gICAgJCgnLmN0LCAubWVudScpLm9uKGNsb3NlVG9vbHRpcCkuZmluZCgnI2FjdGl2ZS1jYXB0aW9uLXRleHRhcmVhLCAudG9vbHRpcCwgLnRvb2x0aXAgaW5wdXQsIC50b29sdGlwIGxhYmVsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge2Uuc3RvcFByb3BhZ2F0aW9uKCk7fSk7XG59XG5cbmZ1bmN0aW9uIG5ldmVyU2hvd1Rvb2x0aXAoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b29sdGlwJywgdHJ1ZSk7XG4gICAgY2xvc2VUb29sdGlwKCk7XG59XG5cbmZ1bmN0aW9uIGNsb3NlVG9vbHRpcChlKSB7XG4gICAgaWYgKGUpIHtlLnN0b3BQcm9wYWdhdGlvbigpO31cblxuICAgIGNvbnNvbGUubG9nKCdjbG9zZXRvb2x0aXAnLCBlKTtcbiAgICAkKCcuY3QsIC5tZW51JykudW5iaW5kKCdjbGljaycsIGNsb3NlVG9vbHRpcCk7XG4gICAgdmFyIHRvb2x0aXBzID0gJCgnLnRvb2x0aXAnKTtcbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdG9vbHRpcHMucmVtb3ZlKCk7XG4gICAgfSwgMzAwKTtcbn1cblxuLy9Nb2RhbCBQcm9tcHRzIGFuZCBXaW5kb3dzXG5mdW5jdGlvbiBjbG9zZUVkaXRTY3JlZW4oKSB7XG4gICQoJy5wcicpLnJlbW92ZUNsYXNzKCdtb2RhbCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgJCgnLnByIC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ2ZvY2FsIGxpbmUgZnVsbCByZWN0IHBvaW50Jyk7XG4gICQoJy5mb2NhbFBvaW50JykucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgJCgnLmZvY2FsUmVjdCcpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICQoJyNmb2NhbFBvaW50VG9nZ2xlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAkKCcjZm9jYWxSZWN0VG9nZ2xlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAkKCcucHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlIC5wdXJwb3NlLWltZycpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICQoJy5jdCAuZmlsZScpLmZpbmQoJ2J1dHRvbicpLmNzcygnZGlzcGxheScsICcnKTtcbiAgZGVzZWxlY3RBbGwoKTtcbiAgJCgnI3dyYXBwZXInKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3cnKTtcbiAgJCgnYm9keScpLnNjcm9sbFRvcChzY3JvbGxQb3NpdGlvbik7XG59XG5cbmZ1bmN0aW9uIHNob3dNb2RhbFByb21wdChvcHRpb25zKSB7XG4gIHZhciBtb2RhbENsYXNzID0gb3B0aW9ucy5kaWFsb2cgPyAnbW9kYWwgbW9kYWwtLXByb21wdCBtb2RhbC0tZGlhbG9nJyA6ICdtb2RhbCBtb2RhbC0tcHJvbXB0JyxcbiAgc2VjQnV0dG9uQ2xhc3MgPSBvcHRpb25zLmRpYWxvZyA/ICdidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtZ3JheScgOiAnYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLXdoaXRlJyxcbiAgY2xvc2UgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fY2xvc2UnKS5jbGljayhvcHRpb25zLmNhbmNlbEFjdGlvbiksXG4gIG1vZGFsID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcyhtb2RhbENsYXNzKSxcbiAgdGl0bGUgPSBvcHRpb25zLnRpdGxlID8gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX3RpdGxlJykudGV4dChvcHRpb25zLnRpdGxlKSA6IG51bGwsXG4gIHRleHQgPSBvcHRpb25zLnRleHQgPyAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fdGV4dCcpLnRleHQob3B0aW9ucy50ZXh0KSA6IG51bGwsXG4gIGNvbnRyb2xzID0gb3B0aW9ucy5jb25maXJtQWN0aW9uIHx8IG9wdGlvbnMuY2FuY2VsQWN0aW9uID8gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX2NvbnRyb2xzJykgOiBudWxsLFxuICBjb25maXJtQnV0dG9uID0gb3B0aW9ucy5jb25maXJtQWN0aW9uID8gJCgnPGJ1dHRvbj48L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uICBidXR0b25fc3R5bGVfb3V0bGluZS1hY2NlbnQnKS50ZXh0KG9wdGlvbnMuY29uZmlybVRleHQgfHwgJ09rJykuY2xpY2sob3B0aW9ucy5jb25maXJtQWN0aW9uKSA6IG51bGwsXG4gIGNhbmNlbEJ1dHRvbiA9IG9wdGlvbnMuY2FuY2VsQWN0aW9uID8gJCgnPGJ1dHRvbj48L2J1dHRvbj4nKS5hZGRDbGFzcyhzZWNCdXR0b25DbGFzcykudGV4dChvcHRpb25zLmNhbmNlbFRleHQgfHwgJ05ldmVybWluZCcpLmNsaWNrKG9wdGlvbnMuY2FuY2VsQWN0aW9uKSA6IG51bGw7XG5cbiAgY29udHJvbHMuYXBwZW5kKGNvbmZpcm1CdXR0b24sIGNhbmNlbEJ1dHRvbik7XG4gIG1vZGFsLmFwcGVuZChjbG9zZSwgdGl0bGUsIHRleHQsIGNvbnRyb2xzKTtcbiAgJCgnYm9keScpLmFwcGVuZChtb2RhbCk7XG4gIHNldE1vZGFsS2V5Ym9hcmRBY3Rpb25zKG9wdGlvbnMuY29uZmlybUFjdGlvbiwgb3B0aW9ucy5jYW5jZWxBY3Rpb24pO1xufVxuXG5mdW5jdGlvbiBoaWRlTW9kYWxQcm9tcHQoKSB7XG4gICQoJy5vcC5tb2RhbCwgLm9wLmRpYWxvZywgLm1vZGFsLm1vZGFsLS1wcm9tcHQnKS5yZW1vdmUoKTtcbiAgJChkb2N1bWVudCkudW5iaW5kKCdrZXlkb3duJyk7XG59XG5mdW5jdGlvbiBzZXRNb2RhbEtleWJvYXJkQWN0aW9ucyhlbnRlciwgY2xvc2UpIHtcbiAgaGFuZGxlRXNjS2V5ZG93biA9IGZ1bmN0aW9uKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmIChlLnRhcmdldCA9PT0gZG9jdW1lbnQuYm9keSAmJiBlLmtleUNvZGUgPT09IDI3KSB7Y2xvc2UoKTt9XG4gIH07XG4gIGhhbmRsZUVudGVyS2V5ZG93biA9IGZ1bmN0aW9uKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmIChlLnRhcmdldCA9PT0gZG9jdW1lbnQuYm9keSAmJiBlLmtleUNvZGUgPT09IDEzKSB7ZW50ZXIoKTt9XG4gIH07XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVzY0tleWRvd24pO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZUVzY0tleWRvd24oZSkge1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAvL2lmIChlLnRhcmdldCA9PT0gZG9jdW1lbnQuYm9keSAmJiBlLmtleUNvZGUgPT09IDI3KSB7Y2xvc2UoKTt9XG59XG5mdW5jdGlvbiBoYW5kbGVFbnRlcktleWRvd24oZSkge1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAvL2lmIChlLnRhcmdldCA9PT0gZG9jdW1lbnQuYm9keSAmJiBlLmtleUNvZGUgPT09IDEzKSB7ZW50ZXIoKTt9XG59XG5cbmZ1bmN0aW9uIE1vZGFsKG9wdGlvbnMpIHtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICB0aGlzLl9pbml0KCk7XG4gIHRoaXMuX2luaXRFdmVudHMoKTtcbn1cblxuTW9kYWwucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubW9kYWwgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5kaWFsb2cgPyAnbW9kYWwgbW9kYWwtLXByb21wdCBtb2RhbC0tZGlhbG9nJyA6ICdtb2RhbCBtb2RhbC0tcHJvbXB0IG1vZGFsLS1mdWxsJyk7XG5cbiAgdGhpcy5jbG9zZUJ1dHRvbiA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsX19jbG9zZScpO1xuICB0aGlzLnRpdGxlID0gdGhpcy5vcHRpb25zLnRpdGxlID8gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX3RpdGxlJykudGV4dCh0aGlzLm9wdGlvbnMudGl0bGUpIDogbnVsbDtcbiAgdGhpcy50ZXh0ID0gdGhpcy5vcHRpb25zLnRleHQgPyAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbF9fdGV4dCcpLnRleHQodGhpcy5vcHRpb25zLnRleHQpIDogbnVsbDtcblxuICB0aGlzLmNvbnRyb2xzID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWxfX2NvbnRyb2xzJyk7XG4gIGlmICghdGhpcy5vcHRpb25zLm9ubHlDYW5jZWwpIHtcbiAgICB0aGlzLmNvbmZpcm1CdXR0b24gPSAkKCc8YnV0dG9uIC8+JykuYWRkQ2xhc3MoJ2J1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS1hY2NlbnQnKS50ZXh0KHRoaXMub3B0aW9ucy5jb25maXJtVGV4dCB8fCAnT2snKTtcbiAgICB0aGlzLmNvbnRyb2xzLmFwcGVuZCh0aGlzLmNvbmZpcm1CdXR0b24pO1xuICB9XG4gIGlmICghdGhpcy5vcHRpb25zLm9ubHlDb25maXJtKSB7XG4gICAgdGhpcy5jYW5jZWxCdXR0b24gPSAkKCc8YnV0dG9uIC8+JykuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmRpYWxvZyA/ICdidXR0b24gYnV0dG9uX3N0eWxlX291dGxpbmUtZ3JheScgOiAnYnV0dG9uIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLXdoaXRlJykudGV4dCh0aGlzLm9wdGlvbnMuY2FuY2VsVGV4dCB8fCAnTmV2ZXJtaW5kJyk7XG4gICAgdGhpcy5jb250cm9scy5hcHBlbmQodGhpcy5jYW5jZWxCdXR0b24pO1xuICB9XG5cbiAgdGhpcy5tb2RhbC5hcHBlbmQodGhpcy5jbG9zZUJ1dHRvbiwgdGhpcy50aXRsZSwgdGhpcy50ZXh0LCB0aGlzLmNvbnRyb2xzKTtcbiAgJCgnYm9keScpLmFwcGVuZCh0aGlzLm1vZGFsKTtcbn07XG5cbk1vZGFsLnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcbiAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ29uZmlybWF0aW9uKCkge1xuICAgIGlmIChzZWxmLm9wdGlvbnMuY29uZmlybUFjdGlvbikge3NlbGYub3B0aW9ucy5jb25maXJtQWN0aW9uKCk7fVxuICAgIHNlbGYubW9kYWwucmVtb3ZlKCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHNlbGYuaGFuZGxlS2V5RG93biwgdHJ1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlQ2FuY2VsYXRpb24oKSB7XG4gICAgaWYgKHNlbGYub3B0aW9ucy5jYW5jZWxBY3Rpb24pIHtzZWxmLm9wdGlvbnMuY2FuY2VsQWN0aW9uKCk7fVxuICAgIHNlbGYubW9kYWwucmVtb3ZlKCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHNlbGYuaGFuZGxlS2V5RG93biwgdHJ1ZSk7XG4gIH1cblxuICBzZWxmLmhhbmRsZUtleURvd24gPSBmdW5jdGlvbihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIXNlbGYub3B0aW9ucy5vbmx5Q2FuY2VsKSB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge2hhbmRsZUNhbmNlbGF0aW9uKCk7fVxuICAgIH1cbiAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge2hhbmRsZUNvbmZpcm1hdGlvbigpO31cbiAgICBpZiAoZS5rZXlDb2RlID09PSAyNykge2hhbmRsZUNhbmNlbGF0aW9uKCk7fVxuICB9O1xuXG4gIGlmIChzZWxmLmNhbmNlbEJ1dHRvbikge3NlbGYuY2FuY2VsQnV0dG9uLmNsaWNrKGhhbmRsZUNhbmNlbGF0aW9uKTt9XG4gIGlmIChzZWxmLmNvbmZpcm1CdXR0b24pIHtzZWxmLmNvbmZpcm1CdXR0b24uY2xpY2soaGFuZGxlQ29uZmlybWF0aW9uKTt9XG4gIHNlbGYuY2xvc2VCdXR0b24uY2xpY2soaGFuZGxlQ2FuY2VsYXRpb24pO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc2VsZi5oYW5kbGVLZXlEb3duLCB0cnVlKTtcbn07XG5cbi8vQXNzZXQgbGlicmFyeVxudmFyIGFzc2V0TGlicmFyeU9iamVjdHMgPSBbXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTIuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTIuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS0yLmpwZycsXG4gICAgY2FwdGlvbjogJzA1LiBEb25cXCd0IEdldCBMb3N0JyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTMuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTMuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS0zLmpwZycsXG4gICAgY2FwdGlvbjogJzAyLiBUaGUgTWFuIGluIHRoZSBTaGFkb3dzJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTQuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTQuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS00LmpwZycsXG4gICAgY2FwdGlvbjogJzAzLiBUaGUgRmlyc3QgU2xpY2UnLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItZXBpc29kZS01LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1lcGlzb2RlLTUuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1lcGlzb2RlLTUuanBnJyxcbiAgICBjYXB0aW9uOiAnMDEuIEEgTmV3IFZpc2l0b3InLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtNS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtNS5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTUuanBnJyxcbiAgICBjYXB0aW9uOiAnMDQuIFRoZSBCbG9vZCBNb29uJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTEwLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS0xMC5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTEwLmpwZycsXG4gICAgY2FwdGlvbjogJzAzLiBUaGUgRmlyc3QgU2xpY2UnLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtMTMuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTEzLmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtMTMuanBnJyxcbiAgICBjYXB0aW9uOiAnMDEuIEEgTmV3IFZpc2l0b3InLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtMTUuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTE1LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtMTUuanBnJyxcbiAgICBjYXB0aW9uOiAnMDEuIEEgTmV3IFZpc2l0b3InLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtMTEuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTExLmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ1RyYWlsZXIgRTAzJyxcbiAgICBjYXB0aW9uOiAnMDYuIEFsbCBBbG9uZScsXG4gICAgZGVzY3JpcHRpb246ICdLYXRpZSBNY0dyYXRoIChKdXJhc3NpYyBXb3JsZCkgc3RhcnMgYXMgU2FyYWggQmVubmV0dCwgYSB5b3VuZyB3b21hbiB3aG8gcmV0dXJucyB0byB0aGUgc21hbGwgdG93biB3aGVyZSBzaGUgd2FzIGJvcm4sIG9ubHkgdG8gZmluZCBoZXJzZWxmIHRoZSBjZW50ZXJwaWVjZSBpbiBhIHNlcmllcyBvZiBob3JyaWZ5aW5nIGNvcHljYXQgbXVyZGVycyBiYXNlZCBvbiB0aGUgd2lkZWx5IGtub3duLCBncmlzbHkga2lsbGluZ3Mgb2YgaGVyIHBhcmVudHMuJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ3ZpZGVvJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvc2xhc2hlci1pbWFnZS05LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2xhc2hlci1pbWFnZS05LmpwZyA0ODM5MiAzNDInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCA5LCAxOCksXG4gICAgY29sb3I6ICcjQjBERURBJyxcbiAgICB0aXRsZTogJ3NsYXNoZXItaW1hZ2UtOS5qcGcnLFxuICAgIGNhcHRpb246ICcwNC4gVGhlIEJsb29kIE1vb24nLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3NsYXNoZXItaW1hZ2UtOC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3NsYXNoZXItaW1hZ2UtOC5qcGcgNDgzOTIgMzQyJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0IwREVEQScsXG4gICAgdGl0bGU6ICdzbGFzaGVyLWltYWdlLTguanBnJyxcbiAgICBjYXB0aW9uOiAnMDQuIFRoZSBCbG9vZCBNb29uJyxcbiAgICBkZXNjcmlwdGlvbjogJ0thdGllIE1jR3JhdGggKEp1cmFzc2ljIFdvcmxkKSBzdGFycyBhcyBTYXJhaCBCZW5uZXR0LCBhIHlvdW5nIHdvbWFuIHdobyByZXR1cm5zIHRvIHRoZSBzbWFsbCB0b3duIHdoZXJlIHNoZSB3YXMgYm9ybiwgb25seSB0byBmaW5kIGhlcnNlbGYgdGhlIGNlbnRlcnBpZWNlIGluIGEgc2VyaWVzIG9mIGhvcnJpZnlpbmcgY29weWNhdCBtdXJkZXJzIGJhc2VkIG9uIHRoZSB3aWRlbHkga25vd24sIGdyaXNseSBraWxsaW5ncyBvZiBoZXIgcGFyZW50cy4nLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdCcmlhbiBNaWxsaWtpbicsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9zbGFzaGVyLWltYWdlLTYuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzbGFzaGVyLWltYWdlLTYuanBnIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnc2xhc2hlci1pbWFnZS02LmpwZycsXG4gICAgY2FwdGlvbjogJzA2LiBBbGwgQWxvbmUnLFxuICAgIGRlc2NyaXB0aW9uOiAnS2F0aWUgTWNHcmF0aCAoSnVyYXNzaWMgV29ybGQpIHN0YXJzIGFzIFNhcmFoIEJlbm5ldHQsIGEgeW91bmcgd29tYW4gd2hvIHJldHVybnMgdG8gdGhlIHNtYWxsIHRvd24gd2hlcmUgc2hlIHdhcyBib3JuLCBvbmx5IHRvIGZpbmQgaGVyc2VsZiB0aGUgY2VudGVycGllY2UgaW4gYSBzZXJpZXMgb2YgaG9ycmlmeWluZyBjb3B5Y2F0IG11cmRlcnMgYmFzZWQgb24gdGhlIHdpZGVseSBrbm93biwgZ3Jpc2x5IGtpbGxpbmdzIG9mIGhlciBwYXJlbnRzLicsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0JyaWFuIE1pbGxpa2luJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDEuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdhenRlY190ZW1wbGUucG5nIDQ4MzkyIDM0MicsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNCMERFREEnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMS5qcGcnLFxuICAgIGNhcHRpb246ICdXcml0ZXIsIEJyaWFuIE1pbGxpa2luLCBhIG1hbiBhYm91dCBIYXZlbiwgdGFrZXMgdXMgYmVoaW5kIHRoZSBzY2VuZXMgb2YgdGhpcyBlcGlzb2RlIGFuZCBnaXZlcyB1cyBhIGZldyB0ZWFzZXMgYWJvdXQgdGhlIFNlYXNvbiB0aGF0IHdlIGNhblxcJ3Qgd2FpdCB0byBzZWUgcGxheSBvdXQhIFRoaXMgaXMgdGhlIGZpcnN0IGVwaXNvZGUgb2YgSGF2ZW4gbm90IGZpbG1lZCBpbiBvciBhcm91bmQgQ2hlc3RlciwgTm92YSBTY290aWEuIEJlZ2lubmluZyBoZXJlLCB0aGUgc2hvdyBhbmQgaXRzIHN0YWdlcyByZWxvY2F0ZWQgdG8gSGFsaWZheC4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQnJpYW4gTWlsbGlraW4nLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ2JpZ19iZW4ucG5nIDQzZGVmcXdlJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgOSwgMTgpLFxuICAgIGNvbG9yOiAnI0ZEQkQwMCcsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzAyLmpwZycsXG4gICAgY2FwdGlvbjogJ0NoYXJsb3R0ZSBsYXlzIG91dCBoZXIgcGxhbiBmb3IgdGhlIGZpcnN0IHRpbWUgaW4gdGhpcyBlcGlzb2RlOiB0byBidWlsZCBhIG5ldyBCYXJuLCBvbmUgdGhhdCB3aWxsIGN1cmUgVHJvdWJsZXMgd2l0aG91dCBraWxsaW5nIFRyb3VibGVkIHBlb3BsZSBpbiB0aGUgcHJvY2Vzcy4gSGVyIHBsYW4sIGFuZCB3aGF0IHBhcnRzIGl0IHJlcXVpcmVzLCB3aWxsIGNvbnRpbnVlIHRvIHBsYXkgYSBtb3JlIGFuZCBtb3JlIGltcG9ydGFudCByb2xlIGFzIHRoZSBzZWFzb24gZ29lcyBhbG9uZy4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4RnVuRmFjdHNfMDMuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdjaHJpc3RfdGhlX3JlZGVlbWVyLnBuZyAwOTJubHhuYycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyNFRDQxMkQnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wMy5qcGcnLFxuICAgIGNhcHRpb246ICdMb3N0IHRpbWUgcGxheXMgYW4gZXZlbiBtb3JlIGltcG9ydGFudCByb2xlIGluIHRoaXMgZXBpc29kZSB0aGFuIGV2ZXIgYmVmb3Jl4oCUIGFzIGl04oCZcyByZXZlYWxlZCB0aGF0IGl04oCZcyBhIHdlYXBvbiB0aGUgZ3JlYXQgZXZpbCBmcm9tIFRoZSBWb2lkIGhhcyBiZWVuIHVzaW5nIGFnYWluc3QgdXMsIGFsbCBzZWFzb24gbG9uZy4gV2hpY2ggZ29lcyBiYWNrIHRvIHRoZSBjYXZlIHVuZGVyIHRoZSBsaWdodGhvdXNlIGluIGJlZ2lubmluZyBvZiB0aGUgU2Vhc29uIDUgcHJlbWllcmUuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0xvc3QgdGltZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzA0LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnY29sb3NzZXVtLnBuZyAtNHJqeG5zaycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDksIDE4KSxcbiAgICBjb2xvcjogJyMzMkE0QjcnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wNC5qcGcnLFxuICAgIGNhcHRpb246ICdUaGUg4oCcYWV0aGVyIGNvcmXigJ0gdGhhdCBDaGFybG90dGUgYW5kIEF1ZHJleSBtYWtlIHByZXNlbnRlZCBhbiBpbXBvcnRhbnQgZGVzaWduIGNob2ljZS4gVGhlIHdyaXRlcnMgd2FudGVkIGl0IHRvIGxvb2sgb3JnYW5pYyBidXQgYWxzbyBkZXNpZ25lZOKAlCBsaWtlIHRoZSB0ZWNobm9sb2d5IG9mIGFuIGFkdmFuY2VkIGN1bHR1cmUgZnJvbSBhIGRpZmZlcmVudCBkaW1lbnNpb24sIGNhcGFibGUgb2YgZG9pbmcgdGhpbmdzIHRoYXQgd2UgbWlnaHQgcGVyY2VpdmUgYXMgbWFnaWMgYnV0IHdoaWNoIGlzIGp1c3Qgc2NpZW5jZSB0byB0aGVtLiBUaGUgdmFyaW91cyBkZXBpY3Rpb25zIG9mIEtyeXB0b25pYW4gc2NpZW5jZSBpbiB2YXJpb3VzIFN1cGVybWFuIHN0b3JpZXMgd2FzIG9uZSBpbnNwaXJhdGlvbi4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlIGFuZCBBdWRyZXknLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wNS5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ2Vhc3Rlcl9pc2xhbmQucG5nIG5sbjRua2EwJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTAsIDI1KSxcbiAgICBjb2xvcjogJyNEM0VDRUMnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wNS5qcGcnLFxuICAgIGNhcHRpb246ICdUaGlzIGlzIHRoZSBmaXJzdCBlcGlzb2RlIGluIFNlYXNvbiA1IGluIHdoaWNoIHdl4oCZdmUgbG9zdCBvbmUgb2Ygb3VyIGhlcm9lcy4gSXQgd2FzIGltcG9ydGFudCB0byBoYXBwZW4gYXMgd2UgaGVhZCBpbnRvIHRoZSBob21lIHN0cmV0Y2ggb2YgdGhlIHNob3cgYW5kIGFzIHRoZSBzdGFrZXMgaW4gSGF2ZW4gaGF2ZSBuZXZlciBiZWVuIG1vcmUgZGlyZS4gQXMgYSByZXN1bHQsIGl0IHdvbuKAmXQgYmUgdGhlIGxhc3QgbG9zcyB3ZVxcJ2xsIHN1ZmZlciB0aGlzIHNlYXNvbuKApicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdXaWxkIENhcmQnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThGdW5GYWN0c18wNi5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3B5cmFtaWRzLnBuZyBmZGJ5NjQnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMCwgMjUpLFxuICAgIGNvbG9yOiAnIzJBN0M5MScsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOEZ1bkZhY3RzXzA2LmpwZycsXG4gICAgY2FwdGlvbjogJ1RoZSBjaGFsbGVuZ2UgaW4gQ2hhcmxvdHRlXFwncyBmaW5hbCBjb25mcm9udGF0aW9uIHdhcyB0aGF0IHRoZSBzaG93IGNvdWxkbuKAmXQgcmV2ZWFsIGhlciBhdHRhY2tlcuKAmXMgYXBwZWFyYW5jZSB0byB0aGUgYXVkaWVuY2UsIHNvIHRoZSBkYXJrbmVzcyB3YXMgbmVjZXNzaXRhdGVkLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAxLmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAnc2FuX2ZyYW5jaXNvX2JyaWRnZS5wbmcgNDIzNGZmNTInLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMCwgMjUpLFxuICAgIGNvbG9yOiAnIzk2Nzg0MCcsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzAxLmpwZycsXG4gICAgY2FwdGlvbjogJ1dhcm5pbmc6IElmIHlvdSBkb25cXCd0IHdhbnQgdG8ga25vdyB3aGF0IGhhcHBlbmVkIGluIHRoaXMgZXBpc29kZSwgZG9uXFwndCByZWFkIHRoaXMgcGhvdG8gcmVjYXAhIERhdmUganVzdCBoYWQgYW5vdGhlciB2aXNpb24gYW5kIHRoaXMgdGltZSwgaGVcXCdzIGJlaW5nIHByb2FjdGl2ZSBhYm91dCBpdC4gSGUgYW5kIFZpbmNlIGRhc2ggb3V0IG9mIHRoZSBob3VzZSB0byBzYXZlIHRoZSBsYXRlc3QgdmljdGltcyBvZiBDcm9hdG9hbiwgYS5rLmEgdGhlIE5vIE1hcmtzIEtpbGxlci4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDIuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdzdG9uZV9oZW5nZS5wbmcgNDkwbW5tYWJkJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTAsIDI1KSxcbiAgICBjb2xvcjogJyM1NjZGNzgnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wMi5qcGcnLFxuICAgIGNhcHRpb246ICdNZWFud2hpbGUsIER3aWdodCBhbmQgTmF0aGFuIGdvIGRvd250b3duIHRvIGludmVzdGlnYXRlIHdoYXQgdGhleSB0aGluayBpcyBhIGRydW5rZW4gbWFuIGNhdXNpbmcgYSBkaXN0dXJiYW5jZSBidXQgaXQgdHVybnMgb3V0IHRoYXQgdGhlIGd1eSBpcyBjdXJzZWQuIFRoZXJlIGlzIGEgcm9tYW4gbnVtZXJhbCBvbiBoaXMgd3Jpc3QgYW5kLCBhcyB0aGV5IHdhdGNoLCBpbnZpc2libGUgaG9yc2VzIHRyYW1wbGUgaGltLiBMYXRlciwgTmF0aGFuIGFuZCBEd2lnaHQgZmluZCBhbm90aGVyIG1hbiB3aG8gYXBwZWFycyB0byBoYXZlIGJlZW4gc3RydWNrIGJ5IGxpZ2h0ZW5pbmcg4oCTIGJ1dCB0aGVyZSBoYWQgYmVlbiBubyByZWNlbnQgc3Rvcm0gaW4gdG93biDigJMgYW5kIGRyb3BwZWQgZnJvbSBhIHNreXNjcmFwZXIuIFNreXNjcmFwZXJzIGluIEhhdmVuPyBBYnN1cmQuIEFuZCB0aGUgZ3V5IGFsc28gaGFzIGEgbXlzdGVyaW91cyBSb21hbiBudW1lcmFsIHRhdHRvbyBvbiBoaXMgd3Jpc3QuIE5hdGhhbiBhbmQgRHdpZ2h0IGZpbmQgYSBsaXN0IG9mIG5hbWVzIGluIHRoZSBndXlcXCdzIHBvY2tldCB0aGF0IGxlYWRzIHRoZW0gdG8gYSBsb2NhbCBmb3J0dW5lIHRlbGxlciwgTGFpbmV5LicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wMy5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3N5ZG5leV9vcGVyYV9ob3VzZS5wbmcgMHNlZDY3aCcsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDEwLCAyNSksXG4gICAgY29sb3I6ICcjMkUxRDA3JyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDMuanBnJyxcbiAgICBjYXB0aW9uOiAnQnkgZm9sbG93aW5nIHRoZSBjbHVlcyBmcm9tIERhdmVcXCdzIHZpc2lvbiwgaGUgYW5kIFZpbmNlIGZpbmQgdGhlIHNjZW5lIG9mIHRoZSBObyBNYXJrIEtpbGxlclxcJ3MgbW9zdCByZWNlbnQgY3JpbWUuIFRoZXkgYWxzbyBmaW5kIGEgc3Vydml2b3IuIFVuZm9ydHVuYXRlbHksIHNoZSBjYW5cXCd0IHJlbWVtYmVyIGFueXRoaW5nLiBIZXIgbWVtb3J5IGhhcyBiZWVuIHdpcGVkLCB3aGljaCBnZXRzIHRoZW0gdG8gdGhpbmtpbmcgYWJvdXQgd2hvIG1heSBiZSBuZXh0IG9uIENyb2F0b2FuXFwncyBsaXN0LicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3Rhal9tYWhhbC5wbmcgOTQzbmJrYScsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDEwLCAyNSksXG4gICAgY29sb3I6ICcjMDA0NDVGJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDQuanBnJyxcbiAgICBjYXB0aW9uOiAnT24gdGhlaXIgd2F5IHRvIG1lZXQgd2l0aCBMYWluZXksIE5hdGhhbiBicmVha3MgaGlzIHRpcmUgaXJvbiB3aGlsZSB0cnlpbmcgdG8gZml4IGEgZmxhdCB0aXJlLiBUb3VnaCBicmVhay4gQW5kIHRoZW4gRHdpZ2h0IGdldHMgYSBzaG9vdGluZyBwYWluIGluIGhpcyBzaWRlIHdpdGggYSBnbmFybHkgYnJ1aXNlIHRvIG1hdGNoLCBldmVuIHRvdWdoZXIgYnJlYWsuIEFuZCB0aGVuIGJvdGggZ3V5cyBub3RpY2UgdGhhdCB0aGV5IG5vdyBoYXZlIFJvbWFuIG51bWVyYWwgdGF0dG9vcyBvbiB0aGVpciB3cmlzdHMuIFRoZSBudW1iZXIgWCBmb3IgTmF0aGFuIGFuZCBYSUkgZm9yIER3aWdodC4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDUuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd3aW5kbWlsbC5wbmcgamVybDM0JyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDExKSxcbiAgICBjb2xvcjogJyMyRjM4MzcnLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNS5qcGcnLFxuICAgIGNhcHRpb246ICdJbiB0aGUgbWluZXNoYWZ0LCBDaGFybG90dGUgYW5kIEF1ZHJleSBoYXZlIHRha2VuIG9uIHRoZSB0YXNrIG9mIGNvbGxlY3RpbmcgYWxsIG9mIHRoZSBhZXRoZXIgdG8gY3JlYXRlIGFuIGFldGhlciBjb3JlLiBUaGlzIGlzIHRoZSBmaXJzdCBzdGVwIHRoZXkgbmVlZCB0byBjcmVhdGUgYSBuZXcgQmFybiB3aGVyZSBUcm91YmxlIHBlb3BsZSBjYW4gc3RlcCBpbnNpZGUgYW5kIHRoZW4gYmUgXCJjdXJlZFwiIG9mIHRoZWlyIFRyb3VibGVzIHdoZW4gdGhleSBzdGVwIG91dC4gU291bmRzIGVhc3kgZW5vdWdoIGJ1dCB0aGV5XFwncmUgaGF2aW5nIHRyb3VibGUgY29ycmFsbGluZyBhbGwgdGhlIGFldGhlciBpbnRvIGEgZ2lhbnQgYmFsbC4gVW5zdXJwcmlzaW5nbHksIHRoZSBzd2lybGluZyBibGFjayBnb28gaXNuXFwndCB3aWxsZnVsbHkgY29vcGVyYXRpbmcuJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA2LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAndHJlZV8xLnBuZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxNCksXG4gICAgY29sb3I6ICcjNjM2MjRDJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDYuanBnJyxcbiAgICBjYXB0aW9uOiAnQXMgaWYgdGhlIGFldGhlciB3YXNuXFwndCBlbm91Z2ggb2YgYSBwcm9ibGVtIHRvIHRhY2tsZSwgQ2hhcmxvdHRlIGZlZWxzIGhlcnNlbGYgZ2V0dGluZyB3ZWFrZXIgYnkgdGhlIG1pbnV0ZSBhbmQgdGhlbiBBdWRyZXkgc3RhcnRzIHRvIGxvc2UgaGVyIGV5ZXNpZ2h0LiBUaGV5IGxvb2sgYXQgdGhlaXIgd3Jpc3RzIGFuZCBub3RpY2UgdGhhdCB0aGUgUm9tYW4gbnVtYmVyIHByb2JsZW0gaGFzIG5vdyBhZmZlY3RlZCB0aGVtIHRvbywgdGhlIG51bWJlcnMgSUkgZm9yIEF1ZHJleSBhbmQgVklJSSBmb3IgQ2hhcmxvdHRlLicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wNy5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3RyZWVfMi5wbmcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTQpLFxuICAgIGNvbG9yOiAnIzRBNTA0RScsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA3LmpwZycsXG4gICAgY2FwdGlvbjogJ0luIE5vcnRoIENhcm9saW5hLCBEdWtlIGFuZCBTZXRoIHNpdCB3aXRoIGEgbG9jYWwgbWFuIHdobyBjbGFpbXMgdG8gYmUgYWJsZSB0byByZW1vdmUgdGhlIFwiYmxhY2sgdGFyXCIgZnJvbSBEdWtlXFwncyBzb3VsLiBBZnRlciBhbiBlbGFib3JhdGUgcGVyZm9ybWFuY2UsIER1a2UgcmVhbGl6ZXMgdGhhdCB0aGUgZ3V5IGlzIGEgZmFrZS4gVGhlIHJhdHRsZWQgZ3V5IHdobyBkb2VzblxcJ3Qgd2FudCBhbnkgdHJvdWJsZSBmcm9tIER1a2UgdGVsbHMgdGhlbSB0aGF0IFdhbHRlciBGYXJhZHkgd2lsbCBoYXZlIHRoZSByZWFsIGFuc3dlcnMgdG8gRHVrZVxcJ3MgcXVlc3Rpb25zLiBXaGVuIHRoZXkgZ28gbG9va2luZyBmb3IgV2FsdGVyLCB0aGV5IGZpbmQgaGltIOKApiBhbmQgaGlzIGhlYWRzdG9uZSB0aGF0IGhhcyBhIGZhbWlsaWFyIG1hcmtpbmcgb24gaXQsIHRoZSBzeW1ib2wgZm9yIFRoZSBHdWFyZC4gV2hhdCBnaXZlcz8gSnVzdCBhcyBEdWtlIGlzIGFib3V0IHRvIGdpdmUgdXAgaGUgZ2V0cyBhIHZpc2l0IGZyb20gV2FsdGVyXFwncyBnaG9zdCB3aG8gcHJvbWlzZXMgdG8gZ2l2ZSBoaW0gYW5zd2VycyB0byBhbGwgb2YgdGhlIHF1ZXN0aW9ucyDigKZ2aWEgdGhlIG5leHQgZXBpc29kZSBvZiBjb3Vyc2UuIENsaWZmaGFuZ2VyIScsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICdDaGFybG90dGUnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ1RoZSBIYXZlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8wOC5qcGcnLFxuICAgIGZvY2FsUG9pbnQ6IHtcbiAgICAgIGxlZnQ6IDAuNSxcbiAgICAgIHRvcDogMC41XG4gICAgfSxcbiAgICBpZDogJ3RyZWVfMy5wbmcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTQpLFxuICAgIGNvbG9yOiAnI0REOUYwMCcsXG4gICAgdGl0bGU6ICdIYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA4LmpwZycsXG4gICAgY2FwdGlvbjogJ0FmdGVyIHNvbWUgcHJvZGRpbmcsIER3aWdodCBhbmQgTmF0aGFuIGZpbmQgdGhhdCBMYWluZXkgZ290IGEgdmlzaXQgZnJvbSBDcm9hdG9hbiBhbmQgXCJsb3N0IHRpbWVcIi4gU2hlIGRvZXNuXFwndCByZW1lbWJlcmluZyBkcmF3aW5nIGNhcmRzIGZvciBhbnkgb2YgdGhlbS4gTmF0aGFuIGhhcyBoZXIgZHJhdyBuZXcgY2FyZHMgYW5kIGEgaGVzaXRhbnQgTGFpbmV5IGRvZXMuIER3aWdodCBpcyBnaXZlbiBhIGJvbmRhZ2UgZmF0ZSBhbmQgaXMgbGF0ZXIgc2hhY2tsZWQgYnkgY2hhaW5zIHRvIGEgZ2F0ZSwgQ2hhcmxvdHRlIHdpbGwgYmUgcmV1bml0ZWQgd2l0aCBoZXIgdHJ1ZSBsb3ZlIChobW3igKYpIGFuZCBBdWRyZXkgaXMgYWxpZ25lZCB3aXRoIHRoZSBtb29uLiBOb3QgcGVyZmVjdCBmYXRlcywgYnV0IGl0XFwncyBlbm91Z2ggdG8gZ2V0IGV2ZXJ5b25lIG91dCBvZiB0aGUgcGlja2xlcyB0aGVpciBjdXJyZW50bHkgaW4uJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaGlnaFJlc29sdXRpb246IHRydWUsXG4gICAgY2F0ZWdvcmllczogJycsXG4gICAgdGFnczogJycsXG4gICAgYWx0VGV4dDogJ0NoYXJsb3R0ZScsXG4gICAgY3JlZGl0OiAnJyxcbiAgICBjb3B5cmlnaHQ6ICcnLFxuICAgIHJlZmVyZW5jZToge1xuICAgICAgc2VyaWVzOiAnVGhlIEhhdmVuJyxcbiAgICAgIHNlYXNvbjogNSxcbiAgICAgIGVwaXNvZGU6IDE4XG4gICAgfSxcbiAgICB0eXBlOiAnaW1hZ2UnXG4gIH0sXG4gIHtcbiAgICB1cmw6ICdpbWcvcmVhbC9IYXZlbl9nYWxsZXJ5XzUxOFJlY2FwXzA5LmpwZycsXG4gICAgZm9jYWxQb2ludDoge1xuICAgICAgbGVmdDogMC41LFxuICAgICAgdG9wOiAwLjVcbiAgICB9LFxuICAgIGlkOiAndHJlZV80LnBuZycsXG4gICAgZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTUsIDExLCAxNCksXG4gICAgY29sb3I6ICcjOEZDOTlCJyxcbiAgICB0aXRsZTogJ0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMDkuanBnJyxcbiAgICBjYXB0aW9uOiAnV2l0aCB0aGVpciBzdHJlbmd0aCByZWdhaW5lZCwgQXVkcmV5IGFuZCBDaGFybG90dGUgYXJlIGFibGUgdG8gY3JlYXRlIHRoZSBhZXRoZXIgY29yZSB0aGV5IG5lZWQuIENoYXJsb3R0ZSBpbnN0cnVjdHMgQXVkcmV5IHRvIGdvIGFuZCBoaWRlIGl0IHNvbWUgcGxhY2Ugc2FmZS4gSW4gdGhlIGludGVyaW0sIENoYXJsb3R0ZSBraXNzZXMgRHdpZ2h0IGdvb2RieWUgYW5kIGdpdmVzIGhpbSB0aGUgcmluZyBzaGUgb25jZSB1c2VkIHRvIHNsaXAgaW50byBUaGUgVm9pZC4gTGF0ZXIsIHdpdGggaGVyIG1vb24gYWxpZ25tZW50IGNhdXNpbmcgQXVkcmV5IHRvIGRpc2FwcGVhciBhbmQgRHdpZ2h0IHN0aWxsIHNoYWNrbGVkLCBMYWluZXkgcHVsbHMgYW5vdGhlciBjYXJkIGZvciB0aGUgZW50aXJlIGdyb3VwLCBhIGp1ZGdtZW50IGNhcmQsIHdoaWNoIHNoZSByZWFkcyB0byBtZWFuIHRoYXQgYXMgYWxvbmcgYXMgdGhlaXIgaW50ZW50aW9ucyBhcmUgcHVyZSB0aGV5IGNhbiBhbGwgb3ZlcmNvbWUgYW55IG9ic3RhY2xlcy4gVGhpcyBpcyBncmVhdCBuZXdzIGZvciBldmVyeW9uZSBleGNlcHQuLi4nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL0hhdmVuX2dhbGxlcnlfNTE4UmVjYXBfMTAuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICd0cmVlXzUucG5nJyxcbiAgICBkYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNSwgMTEsIDE0KSxcbiAgICBjb2xvcjogJyNCRkM5QTInLFxuICAgIHRpdGxlOiAnSGF2ZW5fZ2FsbGVyeV81MThSZWNhcF8xMC5qcGcnLFxuICAgIGNhcHRpb246ICdDaGFybG90dGUuIENyb2F0b2FuIHBheXMgaGVyIGEgdmlzaXQgaW4gaGVyIGFwYXJ0bWVudCB0byB0ZWxsIGhlciB0aGF0IGhlXFwncyBwaXNzZWQgdGhhdCBzaGVcXCdzIFwib25lIG9mIHRoZW0gbm93XCIgYW5kIHRoYXQgc2hlIGNob3NlIEF1ZHJleSBvdmVyIE1hcmEuIENyb2F0b2FuIHdhc3RlcyBubyB0aW1lIGluIGtpbGxpbmcgQ2hhcmxvdHRlIGFuZCBzaGUgY2xpbmdzIHRvIGxpZmUgZm9yIGp1c3QgZW5vdWdoIHRpbWUgdG8gYmUgZm91bmQgYnkgQXVkcmV5IHNvIHNoZSBjYW4gZ2l2ZSBoZXIgdGhlIG1vc3Qgc2hvY2tpbmcgbmV3cyBvZiB0aGUgc2Vhc29uOiBDcm9hdG9hbiBpcyBBdWRyZXlcXCdzIGZhdGhlciBhbmQgaGVcXCdzIGdvdCBcInBsYW5zXCIgZm9yIGhlciEnLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBoaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiAnJyxcbiAgICB0YWdzOiAnJyxcbiAgICBhbHRUZXh0OiAnQ2hhcmxvdHRlJyxcbiAgICBjcmVkaXQ6ICcnLFxuICAgIGNvcHlyaWdodDogJycsXG4gICAgcmVmZXJlbmNlOiB7XG4gICAgICBzZXJpZXM6ICdUaGUgSGF2ZW4nLFxuICAgICAgc2Vhc29uOiA1LFxuICAgICAgZXBpc29kZTogMThcbiAgICB9LFxuICAgIHR5cGU6ICdpbWFnZSdcbiAgfSxcbiAge1xuICAgIHVybDogJ2ltZy9yZWFsL3MwNV9lMDUxM18wMV9DQ18xOTIweDEwODAuanBnJyxcbiAgICBpZDogJ3ZpZGVvX18xMjMnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE1LCAxMSwgMTQpLFxuICAgIGNvbG9yOiAnI0JGQzlBMicsXG4gICAgdGl0bGU6ICdzMDVfZTA1MTNfMDFfQ0NfMTkyMHgxMDgwJyxcbiAgICBkZXNjcmlwdGlvbjogJ05vdyB0aGF0IERyLiBDcm9zcyBoYXMgcmV2ZWFsZWQgaGVyIHRydWUgaWRlbnRpdHksIGV2ZXJ5b25lIGhhcyBsb3RzIG9mIGZlZWxpbmdzLiBEd2lnaHQgY2FuXFwndCBnZXQgb3ZlciBmZWVsaW5nIGxpa2Ugc2hlIGR1cGVkIGhpbSwgQXVkcmV5IHRoaW5rcyBEci4gQ3Jvc3MgbXVzdCBjYXJlIG1vcmUgYWJvdXQgTWFyYSB0aGFuIHNoZSBkb2VzIGFib3V0IGhlciBhbmQgTmF0aGFuIGlzIGhhcHB5IHRoYXQgdGhlcmUgaXMgc29tZW9uZSBlbHNlIGluIHRvd24gd2hvIGhlIGNhbiBmZWVsLicsXG4gICAgdHlwZTogJ3ZpZGVvJyxcbiAgICBwbGF5ZXI6ICdCcmFuZCBWT0QgUGxheWVyJyxcbiAgICBlcGlzb2RlTnVtYmVyOiAnMTAnLFxuICAgIGtleXdvcmRzOiAnVGhlIEV4cGFuY2UsIFNhbHZhZ2UsIE1pbGxlciwgSnVsaWUgTWFvLCBIb2xkZW4sIFRyYWlsZXInLFxuXG4gICAgYWRkZWRCeVVzZXJJZDogMzQ0ODcyMyxcbiAgICBhdXRob3I6ICdKYXNvbiBMb25nJyxcbiAgICBleHBpcmF0aW9uRGF0ZTogJzIwMTUtMDMtMjMgMTA6NTc6MDQnLFxuICAgIGd1aWQ6ICcwRDY2MEJENi0wOTY4LTRGNzItN0FCQy00NzIxNTdERkFDQUInLFxuICAgIGxpbms6ICdjYW5vbmljYWx1cmw3MGZhNjJmYzZiJyxcbiAgICBsaW5rVXJsOiAnaHR0cDovL3Byb2QucHVibGlzaGVyNy5jb20vZmlsZS83ODA2J1xuICB9LFxuICB7XG4gICAgdXJsOiAnaW1nL3JlYWwvQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDYuanBnJyxcbiAgICBmb2NhbFBvaW50OiB7XG4gICAgICBsZWZ0OiAwLjUsXG4gICAgICB0b3A6IDAuNVxuICAgIH0sXG4gICAgaWQ6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8wNi5wbmcnLFxuICAgIGRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTQpLFxuICAgIGNvbG9yOiAnI0JGQzlBMicsXG4gICAgdGl0bGU6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8wNi5qcGcnLFxuICAgIGNhcHRpb246ICdBbGVpc3RlciBjb250aW51ZXMgaGlzIGNoYXJtaW5nIGNvcnJ1cHRpb24gb2YgU2F2YW5uYWgsIHRlbGxpbmcgaGVyIHNoZVxcJ3Mga2VwdCBsb2NrZWQgaW4gaGVyIHJvb20gdG8ga2VlcCBoZXIgc2FmZSBmcm9tIGhlciBuZXcgd2VyZXdvbGYgbmVpZ2hib3IgYW5kIGVuY291cmFnaW5nIGhlciB0byB1c2UgaGVyIGxlZnQgaGFuZCB3aGVuIHdpZWxkaW5nIGhlciBhYmlsaXRpZXMuIFNhdmFubmFoXFwncyBnZXR0aW5nIG1vcmUgcG93ZXJmdWwgZXZlcnkgZGF5LicsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuICAgIGNhdGVnb3JpZXM6ICcnLFxuICAgIHRhZ3M6ICcnLFxuICAgIGFsdFRleHQ6ICcnLFxuICAgIGNyZWRpdDogJycsXG4gICAgY29weXJpZ2h0OiAnJyxcbiAgICByZWZlcmVuY2U6IHtcbiAgICAgIHNlcmllczogJ0JpdHRlbicsXG4gICAgICBzZWFzb246IDUsXG4gICAgICBlcGlzb2RlOiAxOFxuICAgIH0sXG4gICAgdHlwZTogJ2ltYWdlJ1xuICB9LyosXG4gIHtcbiAgdXJsOiAnaW1nL3JlYWwvQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMDcuanBnJyxcbiAgZm9jYWxQb2ludDoge1xuICBsZWZ0OiAwLjUsXG4gIHRvcDogMC41XG59LFxuaWQ6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8wNy5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNCksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8wNy5qcGcnLFxuY2FwdGlvbjogJ01lYW53aGlsZSwgTG9nYW4gaGFzIGluZmlsdHJhdGVkIHRoZSBjb21wb3VuZCBhbmQgZmluZHMgaGlzIGJlbG92ZWQgUmFjaGVsLiBIZSBtYW5hZ2VzIHRvIGZyZWUgaGVyIC4uLiBidXQgaG93IGZhciB3aWxsIHRoZXkgZ2V0PycsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCaXR0ZW4nLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTcuanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8xNy5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNCksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8xNy5qcGcnLFxuY2FwdGlvbjogJ0VsZW5hIHdha2VzIHVwIHRvIGZpbmQgaGVyc2VsZiBpbiBhIG5ldyBjZWxsIC4uLicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCaXR0ZW4nLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMTguanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8xOC5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNCksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8xOC5qcGcnLFxuY2FwdGlvbjogJy4uLiBhbmQgUmljaGFyZCwgdGhlIG11dHQgc2hlIGludGVycm9nYXRlZCBpbiBFcGlzb2RlIDEsIGluIGFub3RoZXIuIFJpY2hhcmQgaXMgZW5yYWdlZCB0aGF0IEVsZW5hIGdhdmUgaGltIHVwIHRvIHRoZXNlIFwic2FkaXN0aWMgYmFzdGFyZHNcIiBhbmQgYWxsIHRvbyB3aWxsaW5nIHRvIGVuZ2FnZSBpbiBTb25kcmFcXCdzIGV4cGVyaW1lbnQgdG8gXCJvYnNlcnZlIGNvbWJhdFwiOiBpbiB0aGVvcnksIEVsZW5hIHdpbGwgaGF2ZSB0byB0dXJuIGludG8gYSB3b2xmIHRvIGRlZmVuZCBoZXJzZWxmIGFnYWluc3QgUmljaGFyZFxcJ3MgYXR0YWNrLicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCaXR0ZW4nLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjEuanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yMS5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNCksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yMS5qcGcnLFxuY2FwdGlvbjogJ09uIGhpZ2hlciBncm91bmQsIFJhY2hlbCBhbmQgTG9nYW4gYXJlIG1ha2luZyBhIHJ1biBmb3IgaXQsIHRob3VnaCB0aGUgc3ltYm9sIG9uIFJhY2hlbFxcJ3MgbmVjayBzdGFydHMgdG8gc21va2UgLi4uJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JpdHRlbicsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9CaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yMi5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzIyLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE0KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JpdHRlbl9nYWxsZXJ5XzIwNFJlY2FwXzIyLmpwZycsXG5jYXB0aW9uOiAnLi4uIHdoaWNoIGFsc28gc2xvd3MgZG93biBFbGVuYSwgYWZ0ZXIgUmljaGFyZC13b2xmIHN1ZmZlcnMgdGhlIHNhbWUgYmxvb2R5IGZhdGUgYXMgTmF0ZSBQYXJrZXIgZGlkIGluIEVwaXNvZGUgMS4gUmFjaGVsLCBFbGVuYSBhbmQgTG9nYW4gYXJlIHJlLWNhcHR1cmVkLicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCaXR0ZW4nLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQml0dGVuX2dhbGxlcnlfMjA0UmVjYXBfMjUuanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yNS5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNCksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdCaXR0ZW5fZ2FsbGVyeV8yMDRSZWNhcF8yNS5qcGcnLFxuY2FwdGlvbjogJ0VsZW5hIGdpdmVzIGluLCBhbmQgYSBzaG9ja2VkIFJhY2hlbCBsZWFybnMgYSBsaXR0bGUgc29tZXRoaW5nIG5ldyBhYm91dCBoZXIgb2xkIGZyaWVuZC4nLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQml0dGVuJyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JsaW5kc3BvdF8wN19OVVBfMTcwMzE3XzAzMDguanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCbGluZHNwb3RfMDdfTlVQXzE3MDMxN18wMzA4LnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE2KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JsaW5kc3BvdF8wN19OVVBfMTcwMzE3XzAzMDguanBnJyxcbmNhcHRpb246ICdCTElORFNQT1QgLS0gXCJCb25lIE1heSBSb3RcIiBFcGlzb2RlIDEwNCAtLSBQaWN0dXJlZDogKGwtcikgSmFpbWllIEFsZXhhbmRlciBhcyBKYW5lIERvZSwgU3VsbGl2YW4gU3RhcGxldG9uIGFzIEt1cnQgV2VsbGVyIC0tIChQaG90byBieTogQ2hyaXN0b3BoZXIgU2F1bmRlcnMvTkJDKScsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdCbGluZHNwb3QnLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59LFxue1xudXJsOiAnaW1nL3JlYWwvQmxpbmRzcG90XzA4X05VUF8xNzA1MDNfMDI4My5qcGcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ0JsaW5kc3BvdF8wOF9OVVBfMTcwNTAzXzAyODMucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTYpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnQmxpbmRzcG90XzA4X05VUF8xNzA1MDNfMDI4My5qcGcnLFxuY2FwdGlvbjogJ0JMSU5EU1BPVCAtLSBcIkJvbmUgTWF5IFJvdFwiIEVwaXNvZGUgMTA0IC0tIFBpY3R1cmVkOiBKYWltaWUgQWxleGFuZGVyIGFzIEphbmUgRG9lIC0tIChQaG90byBieTogR2lvdmFubmkgUnVmaW5vL05CQyknLFxuZGVzY3JpcHRpb246ICcnLFxuaGlnaFJlc29sdXRpb246IHRydWUsXG5jYXRlZ29yaWVzOiAnJyxcbnRhZ3M6ICcnLFxuYWx0VGV4dDogJycsXG5jcmVkaXQ6ICcnLFxuY29weXJpZ2h0OiAnJyxcbnJlZmVyZW5jZToge1xuc2VyaWVzOiAnQmxpbmRzcG90JyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL0JsaW5kc3BvdF8xNV9OVVBfMTcwNTAzXzAyMDMuanBnJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdCbGluZHNwb3RfMTVfTlVQXzE3MDUwM18wMjAzLnBuZycsXG5kYXRlQ3JlYXRlZDogbmV3IERhdGUoMjAxNiwgMDEsIDE2KSxcbmNvbG9yOiAnI0JGQzlBMicsXG50aXRsZTogJ0JsaW5kc3BvdF8xNV9OVVBfMTcwNTAzXzAyMDMuanBnJyxcbmNhcHRpb246ICdCTElORFNQT1QgLS0gXCJCb25lIE1heSBSb3RcIiBFcGlzb2RlIDEwNCAtLSBQaWN0dXJlZDogSmFpbWllIEFsZXhhbmRlciBhcyBKYW5lIERvZSAtLSAoUGhvdG8gYnk6IEdpb3Zhbm5pIFJ1Zmluby9OQkMpJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ0JsaW5kc3BvdCcsXG5zZWFzb246IDUsXG5lcGlzb2RlOiAxOFxufSxcbnR5cGU6ICdpbWFnZSdcbn0sXG57XG51cmw6ICdpbWcvcmVhbC9zY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMjAuMTRfcG0ucG5nJyxcbmZvY2FsUG9pbnQ6IHtcbmxlZnQ6IDAuNSxcbnRvcDogMC41XG59LFxuaWQ6ICdzY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMjAuMTRfcG0ucG5nJyxcbmRhdGVDcmVhdGVkOiBuZXcgRGF0ZSgyMDE2LCAwMSwgMTYpLFxuY29sb3I6ICcjQkZDOUEyJyxcbnRpdGxlOiAnc2NyZWVuX3Nob3RfMjAxNS0xMC0wOV9hdF81LjIwLjE0X3BtLnBuZycsXG5jYXB0aW9uOiAn4oCcTW9uZGF5cyBnb3QgbWUgbGlrZeKApuKAnSAtIEBqaW1teWZhbGxvbicsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdUaGUgVG9uaWdodCBTaG93JyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4xOS4xOV9wbS5wbmcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4xOS4xOV9wbS5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNiksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdzY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMTkuMTlfcG0ucG5nJyxcbmNhcHRpb246ICfigJxUb25pZ2h0IEkgd2FzIHRoZSBtdXNpY2FsIGd1ZXN0IG9uIFRoZSBUb25pZ2h0IFNob3cgV2l0aCBKaW1teSBGYWxsb24uIE15IGZpcnN0IHRpbWUgb24gdGhlIHNob3cgSSB3YXMgMTQgeWVhcnMgb2xkIGFuZCBuZXZlciB0aG91Z2h0IElcXCdkIGJlIGJhY2sgdG8gcGVyZm9ybSBteSBmaXJzdCBzaW5nbGUuIExvdmUgeW91IGxvbmcgdGltZSBKaW1teSEgVGhhbmtzIGZvciBoYXZpbmcgbWUuIDopIFBTIEkgbWV0IHRoZSBsZWdlbmRhcnkgTGFkeSBHYWdhIGFuZCBhbSBzbyBpbnNwaXJlZCBieSBoZXIgd29yZHMgb2Ygd2lzZG9tLiAjSEFJWm9uRkFMTE9OICNMb3ZlTXlzZWxm4oCdIC0gQGhhaWxlZXN0ZWluZmVsZCcsXG5kZXNjcmlwdGlvbjogJycsXG5oaWdoUmVzb2x1dGlvbjogdHJ1ZSxcbmNhdGVnb3JpZXM6ICcnLFxudGFnczogJycsXG5hbHRUZXh0OiAnJyxcbmNyZWRpdDogJycsXG5jb3B5cmlnaHQ6ICcnLFxucmVmZXJlbmNlOiB7XG5zZXJpZXM6ICdUaGUgVG9uaWdodCBTaG93JyxcbnNlYXNvbjogNSxcbmVwaXNvZGU6IDE4XG59LFxudHlwZTogJ2ltYWdlJ1xufSxcbntcbnVybDogJ2ltZy9yZWFsL3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4yMC4xNV9wbS5wbmcnLFxuZm9jYWxQb2ludDoge1xubGVmdDogMC41LFxudG9wOiAwLjVcbn0sXG5pZDogJ3NjcmVlbl9zaG90XzIwMTUtMTAtMDlfYXRfNS4yMC4xNV9wbS5wbmcnLFxuZGF0ZUNyZWF0ZWQ6IG5ldyBEYXRlKDIwMTYsIDAxLCAxNiksXG5jb2xvcjogJyNCRkM5QTInLFxudGl0bGU6ICdzY3JlZW5fc2hvdF8yMDE1LTEwLTA5X2F0XzUuMjAuMTVfcG0ucG5nJyxcbmNhcHRpb246ICfigJxNb25kYXlzIGdvdCBtZSBsaWtl4oCm4oCdIC0gQGppbW15ZmFsbG9uJyxcbmRlc2NyaXB0aW9uOiAnJyxcbmhpZ2hSZXNvbHV0aW9uOiB0cnVlLFxuY2F0ZWdvcmllczogJycsXG50YWdzOiAnJyxcbmFsdFRleHQ6ICcnLFxuY3JlZGl0OiAnJyxcbmNvcHlyaWdodDogJycsXG5yZWZlcmVuY2U6IHtcbnNlcmllczogJ1RoZSBUb25pZ2h0IFNob3cnLFxuc2Vhc29uOiA1LFxuZXBpc29kZTogMThcbn0sXG50eXBlOiAnaW1hZ2UnXG59Ki9cbl07XG5mdW5jdGlvbiBjcmVhdGVBc3NldExpYnJhcnlGaWxlKGZpbGVEYXRhKSB7XG4gIC8vSGVscGVyXG4gIGZ1bmN0aW9uIGZpbGVUeXBlRWxlbWVudChmaWxlRGF0YSkge1xuICAgIHN3aXRjaCAoZmlsZURhdGEudHlwZSkge1xuICAgICAgY2FzZSAnaW1hZ2UnOlxuICAgICAgcmV0dXJuICQoJzxkaXY+PGkgY2xhc3M9XCJmYSBmYS1jYW1lcmFcIj48L2k+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3R5cGUnKTtcblxuICAgICAgY2FzZSAndmlkZW8nOlxuICAgICAgcmV0dXJuICQoJzxkaXY+PGkgY2xhc3M9XCJmYSBmYS12aWRlby1jYW1lcmFcIj48L2k+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3R5cGUnKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190eXBlJyk7XG4gICAgfVxuICB9XG5cbiAgLy9jcmVhdGUgYmFzaWMgZWxlbWVudFxuICB2YXIgZmlsZSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGUgZmlsZS0tbW9kYWwgZmlsZV90eXBlX2ltZyBmaWxlX3ZpZXdfZ3JpZCcpLFxuICBmaWxlSW5kZXggPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdoaWRkZW4gZmlsZV9faWQnKS50ZXh0KGZpbGVEYXRhLmlkKSxcblxuICBmaWxlSW1nID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9faW1nJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgZmlsZURhdGEudXJsICsgJyknKSxcbiAgZmlsZUNvbnRyb2xzID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fY29udHJvbHMnKS5jbGljayh0b2dnbGVGaWxlU2VsZWN0KSxcbiAgZmlsZUNoZWNrbWFyayA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2NoZWNrbWFyaycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuICBmaWxlVGl0bGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190aXRsZScpLnRleHQoZmlsZURhdGEudGl0bGUpO1xuXG4gIGZpbGVDb250cm9scy5hcHBlbmQoZmlsZUNoZWNrbWFyaywgZmlsZVR5cGVFbGVtZW50KGZpbGVEYXRhKSk7XG4gIGZpbGVJbWcuYXBwZW5kKGZpbGVDb250cm9scyk7XG5cbiAgZmlsZS5hcHBlbmQoZmlsZUluZGV4LCBmaWxlSW1nLCBmaWxlVGl0bGUpO1xuICByZXR1cm4gZmlsZTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQXNzZXRMaWJyYXJ5KCkge1xuICB2YXIgYXNzZXRMaWJyYXJ5ID0gJCgnLmFsIC5maWxlcyAuc2VjdGlvbl9fZmlsZXMnKTtcbiAgYXNzZXRMaWJyYXJ5LmVtcHR5KCk7XG4gIGFzc2V0TGlicmFyeU9iamVjdHMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG4gICAgYXNzZXRMaWJyYXJ5LnByZXBlbmQoY3JlYXRlQXNzZXRMaWJyYXJ5RmlsZShmKSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTZWxlY3RlZEZpbGVzKCkge1xuICB2YXIgc2VsZWN0ZWRGaWxlcyA9ICQoJy5hbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlLnNlbGVjdGVkJyk7XG5cbiAgaWYgKHNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMCkge1xuICAgIHNlbGVjdGVkRmlsZXMuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgdmFyIGZpbGVJZCA9ICQoZWwpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcbiAgICAgIGZpbGUgPSBhc3NldExpYnJhcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmLmlkID09PSBmaWxlSWQ7XG4gICAgICB9KVswXTtcbiAgICAgIC8vaWYgKCFmaWxlQnlJZChmaWxlSWQsIGdhbGxlcnlPYmplY3RzKSkge1xuICAgICAgZ2FsbGVyeU9iamVjdHMucHVzaCh7XG4gICAgICAgIGZpbGVEYXRhOiBmaWxlLFxuICAgICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgIHBvc2l0aW9uOiAxMDAwLFxuICAgICAgICBjYXB0aW9uOiAnJyxcbiAgICAgICAgZ2FsbGVyeUNhcHRpb246IGZhbHNlLFxuICAgICAgICBqdXN0VXBsb2FkZWQ6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIC8vfVxuXG4gICAgfSk7XG4gICAgdXBkYXRlR2FsbGVyeShnYWxsZXJ5T2JqZWN0cy5sZW5ndGgpO1xuICB9XG59XG5cbi8vUmVxdWlyZWQgZmllbGRzIGNoZWNrXG5mdW5jdGlvbiBjaGVja0ZpZWxkKGZpZWxkKSB7XG4gICAgaWYgKCQoZmllbGQpLnZhbCgpID09PSAnJyAmJiAkKGZpZWxkKS5hdHRyKCdkaXNwbGF5JykgIT09ICdub25lJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7fVxuICAgIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gbWFya0ZpZWxkQXNSZXF1aXJlZChmaWVsZCkge1xuICAgICQoZmllbGQpLmFkZENsYXNzKCdlbXB0eUZpZWxkJyk7XG4gICAgaWYgKCQoZmllbGQpLnBhcmVudCgpLmNoaWxkcmVuKCcuZXJyTXNnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHZhciBtc2cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdlcnJNc2cnKS50ZXh0KFwiVGhpcyBmaWVsZCBjb3VsZG4ndCBiZSBlbXB0eVwiKTtcbiAgICAgICAgJChmaWVsZCkucGFyZW50KCkuYXBwZW5kKG1zZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gbWFya0ZpZWxkQXNOb3JtYWwoZmllbGQpIHtcbiAgICAkKGZpZWxkKS5yZW1vdmVDbGFzcygnZW1wdHlGaWVsZCcpO1xuICAgICQoZmllbGQpLnBhcmVudCgpLmNoaWxkcmVuKCcuZXJyTXNnJykucmVtb3ZlKCk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRmllbGRzKHNlbGVjdG9yKSB7XG4gICAgdmFyIGZpZWxkcyA9ICQoc2VsZWN0b3IpLnBhcmVudCgpLmNoaWxkcmVuKCdpbnB1dCcpO1xuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgIHZhciBmaXJzdEluZGV4ID0gLTE7XG4gICAgZmllbGRzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgIGlmIChjaGVja0ZpZWxkKGVsKSkge1xuICAgICAgICAgICAgLy9tYXJrRmllbGRBc05vcm1hbChlbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL21hcmtGaWVsZEFzUmVxdWlyZWQoZWwpO1xuICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoZmlyc3RJbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICBmaXJzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgZWwuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuJCgnbGFiZWwucmVxdWllcmVkJykucGFyZW50KCkuY2hpbGRyZW4oJ2lucHV0Jykub24oJ2JsdXInLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGNoZWNrRmllbGQoZS50YXJnZXQpKSB7XG4gICAgICAgIC8vbWFya0ZpZWxkQXNOb3JtYWwoZS50YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vbWFya0ZpZWxkQXNSZXF1aXJlZChlLnRhcmdldCk7XG4gICAgfVxufSk7XG5cblxuLy9Gb2NhbCByZWN0YW5nbGUgYW5kIHBvaW50XG5mdW5jdGlvbiBhZGp1c3RSZWN0KGVsKSB7XG5cdHZhciBpbWdXaWR0aCA9ICQoJyNwcmV2aWV3SW1nJykud2lkdGgoKSxcblx0XHRpbWdIZWlnaHQgPSAkKCcjcHJldmlld0ltZycpLmhlaWdodCgpLFxuXHRcdGltZ09mZnNldCA9ICQoJyNwcmV2aWV3SW1nJykub2Zmc2V0KCksXG5cdFx0aW1nUmF0aW8gPSBpbWdXaWR0aC9pbWdIZWlnaHQsXG5cblx0XHRlbEggPSBlbC5vdXRlckhlaWdodCgpLFxuXHRcdGVsVyA9IGVsLm91dGVyV2lkdGgoKSxcblx0XHRlbE8gPSBlbC5vZmZzZXQoKSxcblx0XHRlbFJhdGlvID0gZWxXL2VsSCxcblx0XHRlbEJhY2tncm91bmRQb3NpdGlvbiA9IGVsLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbicpLnNwbGl0KCcgJyk7XG5cblx0Y29uc29sZS5sb2coZWxILCBlbFcsIGVsQmFja2dyb3VuZFBvc2l0aW9uKTtcblxuXHRySGVpZ2h0ID0gaW1nUmF0aW8gPiBlbFJhdGlvID8gaW1nSGVpZ2h0IDogaW1nV2lkdGgvZWxSYXRpbztcblx0cldpZHRoID0gaW1nUmF0aW8gPiBlbFJhdGlvID8gaW1nSGVpZ2h0ICogZWxSYXRpbyA6IGltZ1dpZHRoO1xuXHRyT2Zmc2V0ID0ge2xlZnQ6IDAsIHRvcDogMH07XG5cblx0aWYgKGVsQmFja2dyb3VuZFBvc2l0aW9uLmxlbmd0aCA9PT0gMikge1xuXHRcdGlmIChlbEJhY2tncm91bmRQb3NpdGlvblswXS5pbmRleE9mKCclJykpIHtcblx0XHRcdHZhciBiZ0xlZnRQZXJzZW50ID0gZWxCYWNrZ3JvdW5kUG9zaXRpb25bMF0uc2xpY2UoMCwtMSksXG5cdFx0XHRcdGJnTGVmdFBpeGVsID0gTWF0aC5yb3VuZChpbWdXaWR0aCAqIGJnTGVmdFBlcnNlbnQvMTAwKSAtIHJXaWR0aC8yO1xuXG5cdFx0XHRjb25zb2xlLmxvZyhlbEJhY2tncm91bmRQb3NpdGlvblswXSwgYmdMZWZ0UGVyc2VudCwgYmdMZWZ0UGl4ZWwsIGltZ1dpZHRoLCAoYmdMZWZ0UGl4ZWwgKyByV2lkdGgpKTtcblxuXHRcdFx0aWYgKChiZ0xlZnRQaXhlbCkgPCAwKSB7YmdMZWZ0UGl4ZWwgPSAwO31cblx0XHRcdGlmICgoYmdMZWZ0UGl4ZWwgKyByV2lkdGgpID4gaW1nV2lkdGgpIHtiZ0xlZnRQaXhlbCA9IGltZ1dpZHRoIC0gcldpZHRoO31cblxuXHRcdFx0Y29uc29sZS5sb2coYmdMZWZ0UGl4ZWwsIGltZ1dpZHRoLCAoYmdMZWZ0UGl4ZWwgKyByV2lkdGgvMikpO1xuXG5cdFx0XHRyT2Zmc2V0LmxlZnQgPSBpbWdSYXRpbyA+IGVsUmF0aW8gPyBiZ0xlZnRQaXhlbCA6IDA7XG5cdFx0fVxuXHRcdGlmIChlbEJhY2tncm91bmRQb3NpdGlvblsxXS5pbmRleE9mKCclJykpIHtcblx0XHRcdHZhciBiZ1RvcFBlcnNlbnQgPSBlbEJhY2tncm91bmRQb3NpdGlvblsxXS5zbGljZSgwLC0xKSxcblx0XHRcdFx0YmdUb3BQaXhlbCA9IE1hdGgucm91bmQoaW1nSGVpZ2h0KmJnVG9wUGVyc2VudC8xMDApIC0gckhlaWdodC8yO1xuXG5cdFx0XHRpZiAoKGJnVG9wUGl4ZWwpIDwgMCkge2JnVG9wUGl4ZWwgPSAwO31cblx0XHRcdGlmICgoYmdUb3BQaXhlbCArIHJIZWlnaHQpID4gaW1nSGVpZ2h0KSB7YmdUb3BQaXhlbCA9IGltZ0hlaWdodCAtIHJIZWlnaHQ7fVxuXG5cdFx0XHRyT2Zmc2V0LnRvcCA9IGltZ1JhdGlvID4gZWxSYXRpbyA/IDAgOiBiZ1RvcFBpeGVsO1xuXHRcdH1cblx0fVxuXG5cdCQoJy5mb2NhbFJlY3QnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuXG5cdCQoJy5mb2NhbFJlY3QnKS5jc3MoJ3dpZHRoJywgcldpZHRoLnRvU3RyaW5nKCkgKyAncHgnKVxuXHRcdFx0XHRcdFx0XHQgICAuY3NzKCdoZWlnaHQnLCBySGVpZ2h0LnRvU3RyaW5nKCkgKyAncHgnKVxuXHRcdFx0XHRcdFx0XHQgICAuY3NzKCdsZWZ0Jywgck9mZnNldC5sZWZ0LnRvU3RyaW5nKCkgKyAncHgnKVxuXHRcdFx0XHRcdFx0XHQgICAuY3NzKCd0b3AnLCByT2Zmc2V0LnRvcC50b1N0cmluZygpICsgJ3B4Jylcblx0XHRcdFx0XHRcdFx0ICAgLmRyYWdnYWJsZSh7XG5cdFx0XHRcdFx0XHRcdCAgIFx0XHRheGlzOiBpbWdSYXRpbyA+IGVsUmF0aW8gPyAneCcgOiAneScsXG5cdFx0XHRcdFx0XHRcdCAgIFx0XHRzdGFydDogZnVuY3Rpb24oZSwgdWkpIHtcblx0XHRcdFx0XHRcdFx0XHQgICAgXHRlbC5jc3MoJ3RyYW5zaXRpb24nLCAnbm9uZScpO1xuXHRcdFx0XHRcdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdFx0XHQgICBcdFx0c3RvcDogZnVuY3Rpb24oZSwgdWkpIHtcblx0XHRcdFx0XHRcdFx0ICAgXHRcdFx0ZWwuY3NzKCd0cmFuc2l0aW9uJywgJzAuM3MgZWFzZS1vdXQnKTtcblx0XHRcdFx0XHRcdFx0XHQgICAgICAgIGFkanVzdFB1cnBvc2UoJChlLnRhcmdldCksIGVsKTtcblx0XHRcdFx0XHRcdFx0XHQgICAgfVxuXHRcdFx0XHRcdFx0XHQgICBcdH0pO1xuXG5cdCQoJy5wdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdGVsLnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuXG59XG5mdW5jdGlvbiBhZGp1c3RQdXJwb3NlKGZvY2FsSXRlbSwgcHVycG9zZUltZykge1xuXG5cdFx0dmFyIGltZyA9ICQoJyNwcmV2aWV3SW1nJyksXG5cdFx0aVdpZHRoID0gaW1nLndpZHRoKCksXG5cdFx0aUhlaWdodCA9IGltZy5oZWlnaHQoKSxcblx0XHRpT2Zmc2V0ID0gaW1nLm9mZnNldCgpLFxuXG5cdFx0cFdpZHRoID0gZm9jYWxJdGVtLm91dGVyV2lkdGgoKSxcblx0XHRwSGVpZ2h0ID0gZm9jYWxJdGVtLm91dGVySGVpZ2h0KCksXG5cdFx0cE9mZnNldCA9IGZvY2FsSXRlbS5vZmZzZXQoKSxcblxuXHRcdGZUb3AgPSBNYXRoLnJvdW5kKChwT2Zmc2V0LnRvcCAtIGlPZmZzZXQudG9wICsgcEhlaWdodC8yKSoxMDAgLyBpSGVpZ2h0KTtcblx0XHRmTGVmdCA9IE1hdGgucm91bmQoKHBPZmZzZXQubGVmdCAtIGlPZmZzZXQubGVmdCArIHBXaWR0aC8yKSAqIDEwMCAvIGlXaWR0aCk7XG5cblx0Ly9jb25zb2xlLmxvZyhmVG9wLCBmTGVmdCk7XG5cdGlmIChwdXJwb3NlSW1nKSB7XG5cdFx0cHVycG9zZUltZy5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24nLCBmTGVmdC50b1N0cmluZygpICsgJyUgJyArIGZUb3AudG9TdHJpbmcoKSArICclJyk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0JCgnLnB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZSAucHVycG9zZS1pbWcnKS5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24nLCBmTGVmdC50b1N0cmluZygpICsgJyUgJyArIGZUb3AudG9TdHJpbmcoKSArICclJyk7XG5cdH1cblxufVxuXG4kKCcjZm9jYWxSZWN0VG9nZ2xlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG5cdFx0JCgnLnByID4gLnByZXZpZXcnKS5yZW1vdmVDbGFzcygnZm9jYWwgbGluZSByZWN0Jyk7XG5cdFx0JChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHR9IGVsc2Uge1xuXHRcdCQoJy5wciA+IC5wcmV2aWV3JykuYWRkQ2xhc3MoJ2ZvY2FsIGxpbmUgcmVjdCcpO1xuXHRcdCQoJy5wciA+IC5wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ3BvaW50Jyk7XG5cdFx0JCgnI2ZvY2FsUG9pbnRUb2dnbGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0JChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cblx0XHQvLyQoJy5mb2NhbFJlY3QnKS5yZXNpemFibGUoe2hhbmRsZXM6IFwiYWxsXCIsIGNvbnRhaW5tZW50OiBcIiNwcmV2aWV3SW1nXCJ9KTtcblx0XHRhZGp1c3RSZWN0KCQoJy5wdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UtaW1nJykuZmlyc3QoKSk7XG5cdFx0JCgnLmZvY2FsUmVjdCcpLmRyYWdnYWJsZSh7IGNvbnRhaW5tZW50OiBcIiNwcmV2aWV3SW1nXCIsIHNjcm9sbDogZmFsc2UgfSk7XG5cblx0XHQkKCcucHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlLWltZycpLnVuYmluZCgpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRcdGFkanVzdFJlY3QoJChlLnRhcmdldCkpO1xuXHRcdH0pO1xuXHRcdC8vJCgnLmltZy13cmFwcGVyJykuY3NzKCdtYXgtd2lkdGgnLCAnOTAlJyk7XG5cdFx0c2V0UHVycG9zZVBhZ2luYXRpb24oKTtcblx0fVxufSk7XG5cbi8vVXRpbGl0aWVzXG5cbi8vVGhyb3R0bGUgU2Nyb2xsIGV2ZW50c1xuOyhmdW5jdGlvbigpIHtcbiAgICB2YXIgdGhyb3R0bGUgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBvYmopIHtcbiAgICAgICAgb2JqID0gb2JqIHx8IHdpbmRvdztcbiAgICAgICAgdmFyIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdmFyIGZ1bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChydW5uaW5nKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgb2JqLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KG5hbWUpKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgb2JqLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZnVuYyk7XG4gICAgfTtcblxuICAgIC8qIGluaXQgLSB5b3UgY2FuIGluaXQgYW55IGV2ZW50ICovXG4gICAgdGhyb3R0bGUgKFwic2Nyb2xsXCIsIFwib3B0aW1pemVkU2Nyb2xsXCIpO1xuICAgIHRocm90dGxlIChcInJlc2l6ZVwiLCBcIm9wdGltaXplZFJlc2l6ZVwiKTtcbn0pKCk7XG5cbi8vU3RpY2t5IHRvcGJhclxuZnVuY3Rpb24gU3RpY2t5VG9wYmFyKCkge1xuICAgIHRoaXMuX2luaXQoKTtcbn1cblxuU3RpY2t5VG9wYmFyLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLmxhc3RTY3JvbGxQb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgc2VsZi50b3BiYXJUcmFuc2l0aW9uID0gZmFsc2U7XG5cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib3B0aW1pemVkU2Nyb2xsXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIHNjcm9sbFBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDU1ICYmICEkKCcuYy1IZWFkZXItdGl0bGUnKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgJCgnLmMtSGVhZGVyLXRpdGxlJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgNTUgJiYgJCgnLmMtSGVhZGVyLXRpdGxlJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICQoJy5jLUhlYWRlci10aXRsZScpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoJy5jLUhlYWRlci1jb250cm9scycpLmhhc0NsYXNzKCdjLUhlYWRlci1jb250cm9scy0tY2VudGVyJykpIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gNTUgJiYgISQoJy5jLUhlYWRlci1jb250cm9scycpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyLWNvbnRyb2xzLS1jZW50ZXInKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgNTUgJiYgJCgnLmMtSGVhZGVyLWNvbnRyb2xzJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXItY29udHJvbHMtLWNlbnRlcicpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoJy5jLUhlYWRlci1jb250cm9scycpLmhhc0NsYXNzKCdoZWFkZXJfX2NvbnRyb2xzLS1maWx0ZXInKSkge1xuICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA1NSAmJiAhJCgnLmMtSGVhZGVyLWNvbnRyb2xzJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuaGVhZGVyX19jb250cm9scy0tZmlsdGVyJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDU1ICYmICQoJy5jLUhlYWRlci1jb250cm9scycpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmhlYWRlcl9fY29udHJvbHMtLWZpbHRlcicpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdjLUhlYWRlci0tY29udHJvbHMnKSkge1xuICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSAxNDUgJiYgISQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmMtSGVhZGVyJykuYWRkQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDE0NSAmJiAkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlcicpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCQoJy5jLUhlYWRlcicpLmhhc0NsYXNzKCdoZWFkZXItLWZpbHRlcicpKSB7XG4gICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDcwICYmICEkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlcicpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCA3MCAmJiAkKCcuYy1IZWFkZXInKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICQoJy5jLUhlYWRlcicpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA4NSAmJiAhJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXInKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgODUgJiYgJCgnLmMtSGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuYy1IZWFkZXInKS5yZW1vdmVDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCcubGlicmFyeV9faGVhZGVyJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKHNjcm9sbFBvcyA+PSA3MCAmJiAhJCgnLmxpYnJhcnlfX2hlYWRlcicpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmxpYnJhcnlfX2hlYWRlcicpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxQb3MgPCA3MCAmJiAkKCcubGlicmFyeV9faGVhZGVyJykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAkKCcubGlicmFyeV9faGVhZGVyJykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IDkzMCkge1xuICAgICAgICAgICAgICAgIGlmIChzY3JvbGxQb3MgPj0gNTUgJiYgISQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmFkZENsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsUG9zIDwgNTUgJiYgJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykuaGFzQ2xhc3MoJ2lzLXN0dWNrJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmNvbnRlbnRfX2NvbnRyb2xzLS1saWJyYXJ5JykucmVtb3ZlQ2xhc3MoJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsUG9zID49IDEwICYmICEkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5oYXNDbGFzcygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuY29udGVudF9fY29udHJvbHMtLWxpYnJhcnknKS5hZGRDbGFzcygnaXMtc3R1Y2snKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFBvcyA8IDEwICYmICQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLmhhc0NsYXNzKCdpcy1zdHVjaycpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5jb250ZW50X19jb250cm9scy0tbGlicmFyeScpLnJlbW92ZUNsYXNzKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSk7XG59O1xuXG4vL1Njcm9sbFNweU5hdlxuOyhmdW5jdGlvbih3aW5kb3cpIHtcbiAgICAvLyd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIFNjcm9sbFNweU5hdihlbCkge1xuICAgICAgICB0aGlzLmVsID0gZWw7XG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgICAgICB0aGlzLl9pbml0RXZlbnRzKCk7XG4gICAgfVxuXG4gICAgU2Nyb2xsU3B5TmF2LnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICBvZmZzZXQ6IHRoaXMuZWwuZGF0YXNldC50b3BPZmZzZXRcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLml0ZW1zID0gW10uc2xpY2UuY2FsbCh0aGlzLmVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaScpKS5tYXAoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIHZhciBpdGVtSWQgPSBlbC5kYXRhc2V0LmhyZWY7XG4gICAgICAgICAgICByZXR1cm4ge25hdkl0ZW06IGVsLFxuICAgICAgICAgICAgICAgICAgICBpdGVtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpdGVtSWQpfTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFNjcm9sbFNweU5hdi5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib3B0aW1pemVkU2Nyb2xsXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmICghc2VsZi5zY3JvbGxpbmdUb0l0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFpbkl0ZW1zID0gc2VsZi5pdGVtcy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWxCQ1IgPSBpdGVtLml0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbEJDUi50b3AgPiBzZWxmLm9wdGlvbnMub2Zmc2V0ICYmIGVsQkNSLnRvcCA8IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAobWFpbkl0ZW1zLmxlbmd0aCA+IDAgJiYgKCFzZWxmLm1haW5JdGVtIHx8IHNlbGYubWFpbkl0ZW0gIT09IG1haW5JdGVtc1swXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tYWluSXRlbSA9IG1haW5JdGVtc1swXTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkubmF2SXRlbS5jbGFzc0xpc3QucmVtb3ZlKHNlbGYub3B0aW9ucy5hY3RpdmVDbGFzcyB8fCAnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm1haW5JdGVtLm5hdkl0ZW0uY2xhc3NMaXN0LmFkZChzZWxmLm9wdGlvbnMuYWN0aXZlQ2xhc3MgfHwgJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VsZi5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGl0ZW0ubmF2SXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgaHJlZiA9ICcjJyArIGUudGFyZ2V0LmRhdGFzZXQuaHJlZjtcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0VG9wID0gaHJlZiA9PT0gXCIjXCIgPyAwIDogJChocmVmKS5vZmZzZXQoKS50b3AgLSBzZWxmLm9wdGlvbnMub2Zmc2V0IC0gMzA7XG4gICAgICAgICAgICAgICAgc2VsZi5zY3JvbGxpbmdUb0l0ZW0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgICAgIGkuaXRlbS5jbGFzc0xpc3QucmVtb3ZlKHNlbGYub3B0aW9ucy5hY3RpdmVDbGFzcyB8fCAnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIGkubmF2SXRlbS5jbGFzc0xpc3QucmVtb3ZlKHNlbGYub3B0aW9ucy5hY3RpdmVDbGFzcyB8fCAnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3Moc2VsZi5vcHRpb25zLmFjdGl2ZUNsYXNzIHx8ICdpcy1hY3RpdmUnKTtcblxuXG4gICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLnN0b3AoKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBvZmZzZXRUb3BcbiAgICAgICAgICAgICAgICB9LCAzMDAsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNjcm9sbGluZ1RvSXRlbSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAkKGhyZWYpLmFkZENsYXNzKHNlbGYub3B0aW9ucy5hY3RpdmVDbGFzcyB8fCAnaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaW5pdFNjcm9sbFNweU5hdigpIHtcbiAgICAgICAgW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtc2Nyb2xsU3B5TmF2JykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIG5ldyBTY3JvbGxTcHlOYXYoZWwpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaW5pdFNjcm9sbFNweU5hdigpO1xuXG59KSh3aW5kb3cpO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuLy8gQ29udHJvbHNcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4vL3RleHRmaWVsZHNcbi8vOyhmdW5jdGlvbih3aW5kb3cpIHtcbi8vICAgICd1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gVGV4dGZpZWxkKGVsLCBvcHRpb25zKSB7XG4gIHRoaXMuZWwgPSBlbDtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICB0aGlzLl9pbml0KCk7XG4gIHRoaXMuX2luaXRFdmVudHMoKTtcbn1cblxuVGV4dGZpZWxkLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuZWwucGxhY2Vob2xkZXIgPSAnJztcblxuICB0aGlzLmZpZWxkV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLmZpZWxkV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpbnB1dF9fd3JhcHBlcicpO1xuICB0aGlzLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuZmllbGRXcmFwcGVyLCB0aGlzLmVsKTtcbiAgdGhpcy5maWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG4gIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnanMtaW5wdXQnKTtcbiAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9fZmllbGQnKTtcblxuICBpZiAodGhpcy5lbC52YWx1ZSAhPT0gJycpIHtcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgICB0aGlzLl90b2dnbGVBZGRhYmxlKCk7XG4gIH1cblxuICBpZiAodGhpcy5lbC50eXBlID09PSAndGV4dGFyZWEnKSB7dGhpcy5fYXV0b3NpemUoKTt9XG4gIGlmICh0aGlzLm9wdGlvbnMuYXV0b2NvbXBsZXRlKSB7dGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdoYXMtYXV0b2NvbXBsZXRlJyk7fVxuICBpZiAodGhpcy5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLWRhdGVwaWNrZXInKSkge1xuICAgIHZhciBpZCA9ICdkYXRlUGlja2VyJyArIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoxMDAwMCk7XG4gICAgdGhpcy5lbC5pZCA9IGlkO1xuICAgICQodGhpcy5lbCkuZGF0ZXBpY2tlcih7XG4gICAgICBvblNlbGVjdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJyMnICsgaWQpLmFkZENsYXNzKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHkganMtaGFzVmFsdWUnKTtcbiAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZU1vbnRoOiB0cnVlLFxuICAgICAgY2hhbmdlWWVhcjogdHJ1ZVxuICAgICAgLyptb250aE5hbWVzU2hvcnQ6IFsgXCJKYW51YXJcIiwgXCJGZWJydWFyXCIsIFwiTWFydHNcIiwgXCJBcHJpbFwiLCBcIk1halwiLCBcIkp1bmlcIiwgXCJKdWxpXCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2t0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIiBdKi9cbiAgICB9KTtcbiAgfVxuICBpZiAodGhpcy5lbC5pZCA9PT0gJ3N0YXJ0RGF0ZScpIHtcbiAgICAkKHRoaXMuZWwpLmRhdGVwaWNrZXIoe1xuICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKGRhdGVTdHJpbmcsIGRhdGVwaWNrZXIpIHtcbiAgICAgICAgJCgnI3N0YXJ0RGF0ZScpLmFkZENsYXNzKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHkganMtaGFzVmFsdWUnKTtcbiAgICAgICAgc3RhcnREYXRlID0gZGF0ZVN0cmluZztcbiAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZU1vbnRoOiB0cnVlLFxuICAgICAgY2hhbmdlWWVhcjogdHJ1ZVxuICAgICAgLyptb250aE5hbWVzU2hvcnQ6IFsgXCJKYW51YXJcIiwgXCJGZWJydWFyXCIsIFwiTWFydHNcIiwgXCJBcHJpbFwiLCBcIk1halwiLCBcIkp1bmlcIiwgXCJKdWxpXCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2t0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIiBdKi9cbiAgICB9KTtcbiAgfVxuICBpZiAodGhpcy5lbC5pZCA9PT0gJ2VuZERhdGUnKSB7XG4gICAgJCh0aGlzLmVsKS5kYXRlcGlja2VyKHtcbiAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbihkYXRlU3RyaW5nLCBkYXRlcGlja2VyKSB7XG4gICAgICAgICQoJyNlbmREYXRlJykuYWRkQ2xhc3MoJ2lucHV0X3N0YXRlX25vdC1lbXB0eSBqcy1oYXNWYWx1ZScpO1xuICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG4gICAgICB9LFxuICAgICAgYmVmb3JlU2hvdzogZnVuY3Rpb24oZWxlbWVudCwgZGF0ZXBpY2tlcikge1xuICAgICAgICAkKCcjZW5kRGF0ZScpLmRhdGVwaWNrZXIoJ29wdGlvbicsICdkZWZhdWx0RGF0ZScsIHN0YXJ0RGF0ZSk7XG4gICAgICB9LFxuICAgICAgY2hhbmdlTW9udGg6IHRydWUsXG4gICAgICBjaGFuZ2VZZWFyOiB0cnVlXG4gICAgICAvKm1vbnRoTmFtZXNTaG9ydDogWyBcIkphbnVhclwiLCBcIkZlYnJ1YXJcIiwgXCJNYXJ0c1wiLCBcIkFwcmlsXCIsIFwiTWFqXCIsIFwiSnVuaVwiLCBcIkp1bGlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPa3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiIF0qL1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHRoaXMub3B0aW9ucy5sYWJlbCkge1xuICAgIHRoaXMubGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIHRoaXMubGFiZWwuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmxhYmVsO1xuICAgIHRoaXMubGFiZWwuY2xhc3NMaXN0LmFkZCgnaW5wdXRfX2xhYmVsJyk7XG4gICAgdGhpcy5sYWJlbC5mb3IgPSB0aGlzLmVsLmlkO1xuICAgIHRoaXMuZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xuICB9XG5cbiAgdGhpcy5ibGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOyAvL1VzZSBhcyBhIGhlbHBlciB0byBtYWtlIGJsaW5rIGFuaW1hdGlvbiBvbiBmb2N1cyBmaWVsZFxuICB0aGlzLmJsaW5rLmNsYXNzTGlzdC5hZGQoJ2lucHV0X19ibGluaycpO1xuICB0aGlzLmZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmJsaW5rKTtcblxuICBpZiAodGhpcy5vcHRpb25zLmhlbHBUZXh0KSB7XG4gICAgdGhpcy5oZWxwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuaGVscFRleHQuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmhlbHBUZXh0O1xuICAgIHRoaXMuaGVscFRleHQuY2xhc3NMaXN0LmFkZCgnaW5wdXRfX2hlbHAtdGV4dCcpO1xuICAgIHRoaXMuZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuaGVscFRleHQpO1xuICB9XG4gIGlmICh0aGlzLm9wdGlvbnMuZXJyTXNnKSB7XG4gICAgdGhpcy5lcnJNc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmVyck1zZy5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuZXJyTXNnO1xuICAgIHRoaXMuZXJyTXNnLmNsYXNzTGlzdC5hZGQoJ2lucHV0X19lcnItbXNnJyk7XG4gICAgdGhpcy5maWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5lcnJNc2cpO1xuICB9XG59O1xuXG5UZXh0ZmllbGQucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgLy9DaGVjayBpZiBmaWVsZCBpcyBlbXB0eSBvciBub3QgYW5kIGNoYW5nZSBjbGFzcyBhY2NvcmRpbmdseVxuICAkKHRoaXMuZWwpLm9uKCdibHVyJywgZnVuY3Rpb24oZSkge1xuICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0X3N0YXRlX2VycicpO1xuICAgIGlmIChlLnRhcmdldC52YWx1ZSAhPT0gJycpIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICB9XG4gICAgZS50YXJnZXQucGxhY2Vob2xkZXIgPSAnJztcbiAgICBpZiAoZS50YXJnZXQucmVxdWlyZWQgJiYgIWUudGFyZ2V0LnZhbHVlKSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9zdGF0ZV9lcnInKTtcbiAgICB9XG4gICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7c2VsZi5saXN0LnJlbW92ZSgpO30sIDE1MCk7XG4gICAgfVxuICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gIH0pO1xuXG4gIC8vT24gZm9jdXMgZXZlbnRcbiAgJCh0aGlzLmVsKS5vbignZm9jdXMnLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKHNlbGYub3B0aW9ucy5wbGFjZWhvbGRlcikge1xuICAgICAgZS50YXJnZXQucGxhY2Vob2xkZXIgPSBzZWxmLm9wdGlvbnMucGxhY2Vob2xkZXI7XG4gICAgfVxuICAgIGlmIChzZWxmLm9wdGlvbnMuYXV0b2NvbXBsZXRlKSB7XG4gICAgICBzZWxmLmxpc3QgPSByZW5kZXJBdXRvY29tcGxldGVMaXN0KHNlbGYub3B0aW9ucy5hdXRvY29tcGxldGUsIGhhbmRsZUF1dG9jb21wbGV0ZUl0ZW1DbGljayk7XG4gICAgICBwbGFjZUF1dG9jb21wbGV0ZUxpc3Qoc2VsZi5saXN0LCAkKHNlbGYuZmllbGRXcmFwcGVyKSk7XG4gICAgfVxuICB9KTtcblxuICAvL09uIGNoYW5nZSBldmVudFxuICAkKHRoaXMuZWwpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5wdXRfc3RhdGVfZXJyJyk7XG4gICAgaWYgKGUudGFyZ2V0LnZhbHVlICE9PSAnJykge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIH1cbiAgICBlLnRhcmdldC5wbGFjZWhvbGRlciA9ICcnO1xuICAgIGlmIChzZWxmLm9wdGlvbnMub25DaGFuZ2UpIHtcbiAgICAgIHNlbGYub3B0aW9ucy5vbkNoYW5nZShlKTtcbiAgICB9XG4gICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcbiAgfSk7XG5cbiAgLy9PbiBpbnB1dCBldmVudFxuICAkKHNlbGYuZWwpLm9uKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dF9zdGF0ZV9lcnInKTtcbiAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdpbnB1dF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5wdXRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfVxuICAgIGUudGFyZ2V0LnBsYWNlaG9sZGVyID0gJyc7XG4gICAgaWYgKHNlbGYub3B0aW9ucy5vbklucHV0KSB7XG4gICAgICBzZWxmLm9wdGlvbnMub25JbnB1dChlKTtcbiAgICB9XG4gICAgaWYgKHNlbGYub3B0aW9ucy5hdXRvY29tcGxldGUpIHtcbiAgICAgIHZhciBkYXRhID0gc2VsZi5vcHRpb25zLmF1dG9jb21wbGV0ZS5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlbGYuZWwudmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICB9KVxuICAgICAgdXBkYXRlQXV0b2NvbXBsZXRlTGlzdChzZWxmLmxpc3QsIGRhdGEsIGhhbmRsZUF1dG9jb21wbGV0ZUl0ZW1DbGljayk7XG4gICAgfVxuICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gIH0pO1xuICAkKHNlbGYuZWwpLm9uKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG5cbiAgZnVuY3Rpb24gaGFuZGxlS2V5RG93bihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB2YXIgaW5kZXgsIGxlbmd0aDtcbiAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgY2FzZSAxMzpcbiAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmZpbmQoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2VsZWN0SXRlbShzZWxmLmxpc3QuZmluZCgnaXMtaGlnaHRsaWdodGVkJykuZ2V0KDApKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMjc6XG4gICAgICBjbG9zZUxpc3QoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDM4OlxuICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZmluZCgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICBsZW5ndGggPSAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCAtIDEpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcblxuICAgICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGlmICgkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wIDwgNTApIHtcbiAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpIC0gJChzZWxmLmxpc3QpLmhlaWdodCgpID4gMCA/ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA6IDBcbiAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgIHNjcm9sbFRvcDogMFxuICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDQwOlxuICAgICAgaWYgKHNlbGYubGlzdCAmJiBzZWxmLmxpc3QuZmluZCgnaXMtaGlnaHRsaWdodGVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmhlaWdodCgpIDwgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkub3V0ZXJIZWlnaHQoKSkge1xuICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSArICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpXG4gICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZXggPT09IGxlbmd0aCkge1xuICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXgpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXgpLmhlaWdodCgpXG4gICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyQXV0b2NvbXBsZXRlTGlzdChkYXRhLCBjYWxsYmFjaykge1xuICAgIHZhciBsaXN0ID0gJCgnPHVsIC8+JykuYWRkQ2xhc3MoJ2F1dG9jb21wbGV0ZScpXG5cbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgbGlzdC5hcHBlbmQocmVuZGVyQXV0b2NvbXBsZXRlSXRlbShpdGVtLCBjYWxsYmFjaykpO1xuICAgIH0pO1xuICAgIHJldHVybiBsaXN0O1xuICB9XG4gIGZ1bmN0aW9uIHBsYWNlQXV0b2NvbXBsZXRlTGlzdChsaXN0LCBwYXJlbnQpIHtcbiAgICBwYXJlbnQuYXBwZW5kKGxpc3QpO1xuXG4gICAgdmFyIHBhcmVudEJDUiA9IHBhcmVudC5nZXQoMCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgcGFyZW50T2Zmc2V0VG9wID0gcGFyZW50LmdldCgwKS5vZmZzZXRUb3AsXG4gICAgbGlzdEJDUiA9IGxpc3QuZ2V0KDApLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuXG4gICAgaGVpZ2h0Q2hlY2sgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBwYXJlbnRCQ1IudG9wIC0gcGFyZW50QkNSLmhlaWdodCAtIGxpc3RCQ1IuaGVpZ2h0O1xuXG4gICAgbGlzdC5nZXQoMCkuc3R5bGUudG9wID0gaGVpZ2h0Q2hlY2sgPiAwID8gcGFyZW50T2Zmc2V0VG9wICsgcGFyZW50QkNSLmhlaWdodCArIDUgKyAncHgnIDogcGFyZW50T2Zmc2V0VG9wIC0gbGlzdEJDUi5oZWlnaHQgLSAxMCArICdweCc7XG4gIH1cbiAgZnVuY3Rpb24gdXBkYXRlQXV0b2NvbXBsZXRlTGlzdCAobGlzdCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICBsaXN0LmVtcHR5KCk7XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIGxpc3QuYXBwZW5kKHJlbmRlckF1dG9jb21wbGV0ZUl0ZW0oaXRlbSwgY2FsbGJhY2spKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiByZW5kZXJBdXRvY29tcGxldGVJdGVtKGl0ZW0sIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuICQoJzxsaSAvPicpLmFkZENsYXNzKCdhdXRvY29tcGxldGVfX2l0ZW0nKS5jbGljayhjYWxsYmFjaykub24oJ21vdXNlb3ZlcicsIGhhbmRsZUl0ZW1Nb3VzZU92ZXIpLnRleHQoaXRlbSk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVBdXRvY29tcGxldGVJdGVtQ2xpY2soZSkge1xuICAgIHNlbGVjdEl0ZW0oZS50YXJnZXQpO1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZUl0ZW1Nb3VzZU92ZXIoZSkge1xuICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICB9XG4gIGZ1bmN0aW9uIHNlbGVjdEl0ZW0oaXRlbSkge1xuICAgIHNlbGYuZWwudmFsdWUgPSBpdGVtLmlubmVySFRNTDtcbiAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ2lucHV0X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgIGNsb3NlQXV0b2NvbXBsZXRlKCk7XG4gIH1cbiAgZnVuY3Rpb24gY2xvc2VBdXRvY29tcGxldGUoKSB7XG4gICAgc2VsZi5saXN0LnJlbW92ZSgpO1xuICB9XG59O1xuXG4vL0F1dG9yZXNpemUgdGV4dGFyZWFcblRleHRmaWVsZC5wcm90b3R5cGUuX2F1dG9zaXplID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmVsLnZhbHVlID09PSAnJykge3RoaXMuZWwucm93cyA9IDE7fVxuICBlbHNlIHtcbiAgICB2YXIgd2lkdGggPSB0aGlzLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLFxuICAgIHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyksXG4gICAgdGV4dFdpZHRoID0gdGhpcy5lbC52YWx1ZS5sZW5ndGggKiA3LFxuICAgIHJlID0gL1tcXG5cXHJdL2lnO1xuICAgIGxpbmVCcmFrZXMgPSB0aGlzLmVsLnZhbHVlLm1hdGNoKHJlKTtcbiAgICByb3cgPSBNYXRoLmNlaWwodGV4dFdpZHRoIC8gd2lkdGgpO1xuXG4gICAgcm93ID0gcm93IDw9IDAgPyAxIDogcm93O1xuICAgIHJvdyA9IHRoaXMub3B0aW9ucy5tYXhIZWlnaHQgJiYgcm93ID4gdGhpcy5vcHRpb25zLm1heEhlaWdodCA/IHRoaXMub3B0aW9ucy5tYXhIZWlnaHQgOiByb3c7XG5cbiAgICBpZiAobGluZUJyYWtlcykge1xuICAgICAgcm93ICs9IGxpbmVCcmFrZXMubGVuZ3RoO1xuICAgIH1cblxuICAgIHRoaXMuZWwucm93cyA9IHJvdztcbiAgfVxufTtcblxuVGV4dGZpZWxkLnByb3RvdHlwZS5fdG9nZ2xlQWRkYWJsZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5sZW5ndGggPiAwKSB7XG4gICAgY29uc29sZS5sb2coJCh0aGlzLmVsKS5oYXNDbGFzcygnanMtaGFzVmFsdWUnKSk7XG4gICAgaWYgKCQodGhpcy5lbCkuaGFzQ2xhc3MoJ2pzLWhhc1ZhbHVlJykpIHtcbiAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykuYWRkQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBpbml0VGV4dGZpZWxkcygpIHtcbiAgW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtaW5wdXQnKSkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgIG5ldyBUZXh0ZmllbGQoZWwsIHtcbiAgICAgIGxhYmVsOiBlbC5kYXRhc2V0LmxhYmVsLFxuICAgICAgaGVscFRleHQ6IGVsLmRhdGFzZXQuaGVscFRleHQsXG4gICAgICBlcnJNc2c6IGVsLmRhdGFzZXQuZXJyTXNnLFxuICAgICAgcGxhY2Vob2xkZXI6IGVsLnBsYWNlaG9sZGVyLFxuICAgICAgbWFzazogZWwuZGF0YXNldC5tYXNrLFxuICAgICAgbWF4SGVpZ2h0OiBlbC5kYXRhc2V0Lm1heEhlaWdodFxuICAgIH0pO1xuICB9KTtcbn1cblxuaW5pdFRleHRmaWVsZHMoKTtcblxuLy9zZWxlY3Rib3hcbi8vOyhmdW5jdGlvbih3aW5kb3cpIHtcbiAgICAvLyd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIFNlbGVjdGJveChlbCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cblxuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgICAgIHRoaXMuX2luaXRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBTZWxlY3Rib3gucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlSXRlbSA9IHRoaXMub3B0aW9ucy5pdGVtcy5pbmRleE9mKHRoaXMub3B0aW9ucy5zZWxlY3RlZEl0ZW0pO1xuICAgICAgICB0aGlzLm9wdGlvbnMudW5zZWxlY3QgPSB0aGlzLm9wdGlvbnMudW5zZWxlY3QgIT09IC0xID8gJ+KAlMKgTm9uZSDigJQnIDogdGhpcy5vcHRpb25zLnVuc2VsZWN0O1xuXG4gICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLnNlbGVjdFdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnc2VsZWN0X193cmFwcGVyJyk7XG4gICAgICAgIHRoaXMuZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5zZWxlY3RXcmFwcGVyLCB0aGlzLmVsKTtcbiAgICAgICAgdGhpcy5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2pzLXNlbGVjdGJveCcpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fZmllbGQnKTtcblxuICAgICAgICBpZiAodGhpcy5hY3RpdmVJdGVtID49IDApIHtcbiAgICAgICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuaXRlbXNbdGhpcy5hY3RpdmVJdGVtXTtcbiAgICAgICAgICAgIHRoaXMuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubGFiZWwpIHtcbiAgICAgICAgICAgIHRoaXMubGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMubGFiZWw7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9fbGFiZWwnKTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuZm9yID0gdGhpcy5lbC5pZDtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmhlbHBUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0LmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5oZWxwVGV4dDtcbiAgICAgICAgICAgIHRoaXMuaGVscFRleHQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19oZWxwLXRleHQnKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmhlbHBUZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVyck1zZykge1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5lcnJNc2c7XG4gICAgICAgICAgICB0aGlzLmVyck1zZy5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2Vyci1tc2cnKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVyck1zZyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgU2VsZWN0Ym94LnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy9DbG9zZSBsaXN0IGhlbHBlclxuICAgICAgICBmdW5jdGlvbiBjbG9zZUxpc3QoKSB7XG4gICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGJveF9zdGF0ZV9vcGVuJyk7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RXcmFwcGVyLnJlbW92ZUNoaWxkKHNlbGYubGlzdCk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuc2VhcmNoRmllbGQgJiYgc2VsZi5zZWFyY2hGaWVsZC5wYXJlbnROb2RlID09PSBzZWxmLmVsKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5yZW1vdmVDaGlsZChzZWxmLnNlYXJjaEZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLmlucHV0RmllbGQgJiYgc2VsZi5pbnB1dEZpZWxkLnBhcmVudE5vZGUgPT09IHNlbGYuZWwpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLnJlbW92ZUNoaWxkKHNlbGYuaW5wdXRGaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5hY3RpdmVJdGVtIDwgMCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gc2VsZi5vcHRpb25zLml0ZW1zW3NlbGYuYWN0aXZlSXRlbV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVTZWxlY3REb2NDbGljayk7XG4gICAgICAgIH1cblxuICAgICAgICAvL0NyZWF0ZSBsaXN0IGhlbHBlclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVMaXN0KGl0ZW1zLCBhY3RpdmVJdGVtLCBzZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2VsZi5saXN0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICAgIHNlbGYubGlzdC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2xpc3QnKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdEl0ZW0oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbUNsYXNzID0gc2VsZi5vcHRpb25zLmNvbXBsZXhJdGVtcyA/ICdzZWxlY3Rib3hfX2xpc3QtaXRlbSBzZWxlY3Rib3hfX2xpc3QtaXRlbS0tY29tcGxleCcgOiAnc2VsZWN0Ym94X19saXN0LWl0ZW0gc2VsZWN0Ym94X19saXN0LWl0ZW0tLXRleHQnLFxuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudCA9ICQoJzxsaT48L2xpPicpLmFkZENsYXNzKGl0ZW1DbGFzcykudGV4dChpdGVtKSxcbiAgICAgICAgICAgICAgICAgICAgbGlzdEhlbHBlciA9ICQoJzxkaXY+PC9kaXY+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWl0ZW0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygncG9zaXRpb24nLCAnYWJzb2x1dGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnei1pbmRleCcsICctMScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnb3ZlcmZsb3cnLCAndmlzaWJsZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCd3aGl0ZS1zcGFjZScsICdub3dyYXAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQoaXRlbSk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQobGlzdEhlbHBlci5nZXQoMCkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuYXR0cignZGF0YS1pbmRleCcsIGluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmNvbXBsZXhJdGVtcykge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5nZXQoMCkuaW5uZXJIVE1MID0gaXRlbTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VhcmNoVGV4dCAmJiAhc2VsZi5vcHRpb25zLmNvbXBsZXhJdGVtcykge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5nZXQoMCkuaW5uZXJIVE1MID0gbGlzdEl0ZW1UZXh0KGl0ZW0sIHNlYXJjaFRleHQsICQoc2VsZi5saXN0KS53aWR0aCgpIDwgbGlzdEhlbHBlci53aWR0aCgpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5vbignbW91c2Vkb3duJywgaGFuZGxlSXRlbUNsaWNrKTtcbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5vbignbW91c2VvdmVyJywgaGFuZGxlSXRlbU1vdXNlT3Zlcik7XG5cbiAgICAgICAgICAgICAgICBsaXN0SGVscGVyLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtRWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RJdGVtVGV4dChpdGVtU3RyaW5nLCB0ZXh0LCBsb25nKSB7XG4gICAgICAgICAgICAgICAgdmFyIG91dHB1dFN0cmluZyA9IGl0ZW1TdHJpbmc7XG4gICAgICAgICAgICAgICAgaWYgKGxvbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdvcmRzID0gaXRlbVN0cmluZy5zcGxpdCgnICcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoSW5kZXggPSB3b3Jkcy5yZWR1Y2UoZnVuY3Rpb24oY3VycmVudEluZGV4LCB3b3JkLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN0cmluZyA9IHdvcmQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQpID4gLTEgJiYgY3VycmVudEluZGV4ID09PSAtMSA/IGluZGV4IDogY3VycmVudEluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgLTEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWFyY2hJbmRleCA+PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RyaW5nRW5kID0gd29yZHMuc2xpY2Uoc2VhcmNoSW5kZXgpLnJlZHVjZShmdW5jdGlvbihzdHIsIHdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyICsgJyAnICsgd29yZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlZyA9IC9cXC4kLztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3Jkc1swXS5tYXRjaChyZWcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3RyaW5nID0gd29yZHNbMF0gKyAnICcgKyB3b3Jkc1sxXSArICcgLi4uICcgKyBzdHJpbmdFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN0cmluZyA9IHdvcmRzWzBdICsgJyAuLi4gJyArIHN0cmluZ0VuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBzdGFydFRleHRJbmRleCA9IG91dHB1dFN0cmluZy50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGV4dC50b0xvd2VyQ2FzZSgpKSxcbiAgICAgICAgICAgICAgICAgICAgZW5kVGV4dEluZGV4ID0gc3RhcnRUZXh0SW5kZXggKyB0ZXh0Lmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBvdXRwdXRTdHJpbmcuc2xpY2UoMCwgc3RhcnRUZXh0SW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICBtaWRkbGUgPSBvdXRwdXRTdHJpbmcuc2xpY2Uoc3RhcnRUZXh0SW5kZXgsIGVuZFRleHRJbmRleCksXG4gICAgICAgICAgICAgICAgICAgIGVuZCA9IG91dHB1dFN0cmluZy5zbGljZShlbmRUZXh0SW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHN0YXJ0KSk7XG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZCgkKCc8c3Bhbj48L3NwYW4+JykuYWRkQ2xhc3MoJ3NlbGVjdGJveF9fbGlzdC1oaWdobGlnaHQnKS50ZXh0KG1pZGRsZSkuZ2V0KDApKTtcbiAgICAgICAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGVuZCkpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaW5uZXJIVE1MO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBkaXZpZGVyKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkKCc8bGk+PC9saT4nKS5hZGRDbGFzcygnc2VsZWN0Ym94X19saXN0LWRpdmlkZXInKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5zZWxlY3RXcmFwcGVyLmFwcGVuZENoaWxkKHNlbGYubGlzdCk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMudW5zZWxlY3QgIT09IC0xICYmICFzZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0l0ZW0gPSBsaXN0SXRlbShzZWxmLm9wdGlvbnMudW5zZWxlY3QpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQgc2VsZWN0Ym94X19saXN0LXVuc2VsZWN0Jyk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LmFwcGVuZENoaWxkKG5ld0l0ZW0uZ2V0KDApKTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QuYXBwZW5kQ2hpbGQoZGl2aWRlcigpLmdldCgwKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdJdGVtID0gbGlzdEl0ZW0oaXRlbSwgc2VsZi5vcHRpb25zLml0ZW1zLmluZGV4T2YoaXRlbSkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDAgJiYgc2VsZi5saXN0LmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdJdGVtLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUl0ZW0gPT09IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3SXRlbS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LmFwcGVuZENoaWxkKG5ld0l0ZW0uZ2V0KDApKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgZmllbGRSZWN0ID0gc2VsZi5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgICAgICBmaWVsZE9mZnNldFRvcCA9IHNlbGYuZWwub2Zmc2V0VG9wLFxuICAgICAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgICAgICAgICBtZW51UmVjdCA9IHNlbGYubGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcblxuICAgICAgICAgICAgICAgIGhlaWdodENoZWNrID0gd2luZG93SGVpZ2h0IC0gZmllbGRSZWN0LnRvcCAtIGZpZWxkUmVjdC5oZWlnaHQgLSBtZW51UmVjdC5oZWlnaHQ7XG5cbiAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS50b3AgPSBoZWlnaHRDaGVjayA+IDAgPyBmaWVsZE9mZnNldFRvcCArIGZpZWxkUmVjdC5oZWlnaHQgKyA1ICsgJ3B4JyA6IGZpZWxkT2Zmc2V0VG9wIC0gbWVudVJlY3QuaGVpZ2h0IC0gMTAgKyAncHgnO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0SXRlbShpdGVtKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnVuc2VsZWN0ICYmIGl0ZW0uaW5uZXJIVE1MID09PSBzZWxmLm9wdGlvbnMudW5zZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFjdGl2ZUl0ZW0gPSAtMTtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGJveF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuYWN0aXZlSXRlbSA9IGl0ZW0uZGF0YXNldC5pbmRleDtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGJveF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5pdGVtQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBzZWxmLm9wdGlvbnMuaXRlbUNhbGxiYWNrKGl0ZW0sIHNlbGYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9TZWxlY3QgY2xpY2tcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2VsZWN0Q2xpY2soZSkge1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgICAgIGlmICghc2VsZi5hY3RpdmVJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9DaGVjayBpZiB0aGVyZSBpcyBhbnkgc2VsZWN0ZWQgaXRlbS4gSWYgbm90IHNldCB0aGUgcGxhY2Vob2xkZXIgdGV4dFxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5hY3RpdmVJdGVtIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBzZWxmLnBsYWNlaG9sZGVyIHx8ICdTZWxlY3QnO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy9DaGVjayBpZiBzZWFyY2ggb3B0aW9uIGlzIG9uIG9yIHRoZXJlIGlzIG1vcmUgdGhhbiAxMCBpdGVtcy4gSWYgeWVzLCBhZGQgc2VhcmNmaWVsZFxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnNlYXJjaCB8fCBzZWxmLm9wdGlvbnMuaXRlbXMubGVuZ3RoID4gNykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmLnNlYXJjaEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC50eXBlID0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19zZWFyY2hmaWVsZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQucGxhY2Vob2xkZXIgPSBzZWxmLm9wdGlvbnMuc2VhcmNoUGxhY2Vob2xkZXIgfHwgJ1NlYXJjaC4uLic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC50eXBlID0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2VsZi5zZWFyY2hGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5pbnB1dEZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXRGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X3N0YXRlX29wZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlTGlzdChzZWxmLm9wdGlvbnMuaXRlbXMsIHNlbGYuYWN0aXZlSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlU2VsZWN0RG9jQ2xpY2spO30sIDEwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vU2VsZWN0IGl0ZW0gaGFuZGxlclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVJdGVtQ2xpY2soZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHNlbGVjdEl0ZW0oZS50YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUl0ZW1Nb3VzZU92ZXIoZSkge1xuICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNlbGVjdERvY0NsaWNrKCkge1xuICAgICAgICAgICAgY2xvc2VMaXN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL0Z1bHRlciBmdW5jdGlvbiBmb3Igc2VhcmNmaWVsZFxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTZWFyY2hGaWVsZElucHV0KGUpIHtcbiAgICAgICAgICAgIHZhciBmSXRlbXMgPSBzZWxmLm9wdGlvbnMuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjcmVhdGVMaXN0KGZJdGVtcywgc2VsZi5hY3RpdmVJdGVtLCBlLnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUtleURvd24oZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHZhciBpbmRleCwgbGVuZ3RoO1xuICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RJdGVtKHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMjc6XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggLSAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wIDwgNTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA+IDAgPyAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgLSAkKHNlbGYubGlzdCkuaGVpZ2h0KCkgOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9ICQoc2VsZi5saXN0KS5maW5kKCcuaXMtaGlnaHRsaWdodGVkJykuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLmFkZENsYXNzKCdpcy1oaWdodGxpZ2h0ZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHNlbGYubGlzdCkuaGVpZ2h0KCkgPCAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCArICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLm91dGVySGVpZ2h0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCkucG9zaXRpb24oKS50b3AgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCkuaGVpZ2h0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vQ2hlY2sgaWYgZmllbGQgaXMgZW1wdHkgb3Igbm90IGFuZCBjaGFuZ2UgY2xhc3MgYWNjb3JkaW5nbHlcbiAgICAgICAgJChzZWxmLmVsKS5vbignY2xpY2snLCBoYW5kbGVTZWxlY3RDbGljayk7XG4gICAgfTtcblxuICAgIFNlbGVjdGJveC5wcm90b3R5cGUuX3RvZ2dsZUFkZGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQodGhpcy5lbCkucGFyZW50cygnLmpzLWFkZGFibGVXcmFwcGVyJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKCQodGhpcy5lbCkuaGFzQ2xhc3MoJ2pzLWhhc1ZhbHVlJykpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmFkZENsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLnJlbW92ZUNsYXNzKCdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIFNlbGVjdGJveC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3Rib3hfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIHRoaXMuYWN0aXZlSXRlbSA9IC0xO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBpbml0U2VsZWN0Ym94ZXMoKSB7XG4gICAgICAgIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXNlbGVjdGJveCcpKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBuZXcgU2VsZWN0Ym94KGVsLCB7XG4gICAgICAgICAgICAgICAgbGFiZWw6IGVsLmRhdGFzZXQubGFiZWwsXG4gICAgICAgICAgICAgICAgaGVscFRleHQ6IGVsLmRhdGFzZXQuaGVscFRleHQsXG4gICAgICAgICAgICAgICAgZXJyTXNnOiBlbC5kYXRhc2V0LmVyck1zZyxcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogZWwuZGF0YXNldC5wbGFjZWhvbGRlcixcbiAgICAgICAgICAgICAgICBpdGVtczogSlNPTi5wYXJzZShlbC5kYXRhc2V0Lml0ZW1zKSxcbiAgICAgICAgICAgICAgICBzZWFyY2g6IGVsLmRhdGFzZXQuc2VhcmNoLFxuICAgICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyOmVsLmRhdGFzZXQuc2VhcmNoUGxhY2Vob2xkZXIsXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IGVsLmRhdGFzZXQucmVxdWlyZWQsXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtOiBlbC5kYXRhc2V0LnNlbGVjdGVkSXRlbSxcbiAgICAgICAgICAgICAgICB1bnNlbGVjdDogZWwuZGF0YXNldC51bnNlbGVjdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGluaXRTZWxlY3Rib3hlcygpO1xuXG5cbi8vfSkod2luZG93KTtcblxuLy9UYWdmaWVsZHNcbi8vOyhmdW5jdGlvbih3aW5kb3cpIHtcbiAgICAvLyd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIFRhZ2ZpZWxkKGVsLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgICAgIHRoaXMuX2luaXRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBUYWdmaWVsZC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLm9wdGlvbnMuaW5pdGlhbEl0ZW1zIHx8IFtdO1xuXG4gICAgICAgIHRoaXMudGFnZmllbGRXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMudGFnZmllbGRXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX193cmFwcGVyJyk7XG4gICAgICAgIHRoaXMuZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy50YWdmaWVsZFdyYXBwZXIsIHRoaXMuZWwpO1xuICAgICAgICB0aGlzLnRhZ2ZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdqcy10YWdmaWVsZCcpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX19maWVsZCcpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubGFiZWwpIHtcbiAgICAgICAgICAgIHRoaXMubGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMubGFiZWw7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX19sYWJlbCcpO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5mb3IgPSB0aGlzLmVsLmlkO1xuICAgICAgICAgICAgdGhpcy50YWdmaWVsZFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5sYWJlbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWxwVGV4dCkge1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdGhpcy5oZWxwVGV4dC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuaGVscFRleHQ7XG4gICAgICAgICAgICB0aGlzLmhlbHBUZXh0LmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX19oZWxwLXRleHQnKTtcbiAgICAgICAgICAgIHRoaXMudGFnZmllbGRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuaGVscFRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXJyTXNnKSB7XG4gICAgICAgICAgICB0aGlzLmVyck1zZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdGhpcy5lcnJNc2cuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmVyck1zZztcbiAgICAgICAgICAgIHRoaXMuZXJyTXNnLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX19lcnItbXNnJyk7XG4gICAgICAgICAgICB0aGlzLnRhZ2ZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVyck1zZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgc2VsZi5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKHNlbGYuX2NyZWF0ZVRhZyhpdGVtKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBUYWdmaWVsZC5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8vQ2xvc2UgbGlzdCBoZWxwZXJcbiAgICAgICAgZnVuY3Rpb24gY2xvc2VMaXN0KCkge1xuICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCd0YWdmaWVsZF9zdGF0ZV9vcGVuJyk7XG4gICAgICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2VsZi5saXN0KTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWFyY2hGaWVsZCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwucmVtb3ZlQ2hpbGQoc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5oZWxwZXJGaWVsZCAmJiBzZWxmLmhlbHBlckZpZWxkLnBhcmVudE5vZGUgPT09IHNlbGYuZWwpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLnJlbW92ZUNoaWxkKHNlbGYuaGVscGVyRmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFnZmllbGRfX3RhZycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgndGFnZmllbGRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZVRhZ2ZpZWxkRG9jQ2xpY2spO1xuICAgICAgICAgICAgbm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuICAgICAgICAgICAgc2VsZi5fdG9nZ2xlQWRkYWJsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9DcmVhdGUgbGlzdCBoZWxwZXJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlTGlzdChpdGVtcywgYWN0aXZlSXRlbSwgc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgaWYgKHNlbGYubGlzdCkge1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYubGlzdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYubGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgICAgICBzZWxmLmxpc3QuY2xhc3NMaXN0LmFkZCgnc2VsZWN0Ym94X19saXN0Jyk7XG5cbiAgICAgICAgICAgIHNlbGYubGlzdEhlbHBlciA9ICQoJzxkaXY+PC9kaXY+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzZWxlY3Rib3hfX2xpc3QtaXRlbScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnei1pbmRleCcsICctMScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnb3ZlcmZsb3cnLCAndmlzaWJsZScpO1xuXG4gICAgICAgICAgICBzZWxmLnRhZ2ZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZChzZWxmLmxpc3RIZWxwZXIuZ2V0KDApKTtcblxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rib3hfX2xpc3QtaXRlbScpO1xuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmlubmVySFRNTCA9IGl0ZW07XG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuaWQgPSAnbGlzdEl0ZW0tJyArIGk7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0SGVscGVyLnRleHQoaXRlbSk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBsaXN0SXRlbVRleHQoaXRlbVN0cmluZywgdGV4dCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgd29yZHMgPSBpdGVtU3RyaW5nLnNwbGl0KCcgJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hJbmRleCA9IHdvcmRzLnJlZHVjZShmdW5jdGlvbihjdXJyZW50SW5kZXgsIHdvcmQsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdvcmQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQpID4gLTEgJiYgY3VycmVudEluZGV4ID09PSAtMSA/IGluZGV4IDogY3VycmVudEluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgLTEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWFyY2hJbmRleCA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtU3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0cmluZ0VuZCA9IHdvcmRzLnNsaWNlKHNlYXJjaEluZGV4KS5yZWR1Y2UoZnVuY3Rpb24oc3RyLCB3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0ciArICcgJyArIHdvcmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWcgPSAvXFwuJC87XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZHNbMF0ubWF0Y2gocmVnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3b3Jkc1swXSArICcgJyArIHdvcmRzWzFdICsgJyAuLi4gJyArIHN0cmluZ0VuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdvcmRzWzBdICsgJyAuLi4gJyArIHN0cmluZ0VuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzZWFyY2hUZXh0ICYmICQoc2VsZi5zZWxlY3RXcmFwcGVyKS53aWR0aCgpIDwgc2VsZi5saXN0SGVscGVyLndpZHRoKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuaW5uZXJIVE1MID0gbGlzdEl0ZW1UZXh0KGl0ZW0sIHNlYXJjaFRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpcy1oaWdodGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUl0ZW0gPT09IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZUl0ZW1DbGljayk7XG4gICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgaGFuZGxlSXRlbU1vdXNlT3Zlcik7XG4gICAgICAgICAgICAgICAgc2VsZi5saXN0LmFwcGVuZENoaWxkKGl0ZW1FbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzZWxmLnRhZ2ZpZWxkV3JhcHBlci5hcHBlbmRDaGlsZChzZWxmLmxpc3QpO1xuXG5cbiAgICAgICAgICAgIHZhciBmaWVsZFJlY3QgPSBzZWxmLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgICAgIGZpZWxkT2Zmc2V0VG9wID0gc2VsZi5lbC5vZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIG1lbnVSZWN0ID0gc2VsZi5saXN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuXG4gICAgICAgICAgICAgICAgaGVpZ2h0Q2hlY2sgPSB3aW5kb3dIZWlnaHQgLSBmaWVsZFJlY3QudG9wIC0gZmllbGRSZWN0LmhlaWdodCAtIG1lbnVSZWN0LmhlaWdodDtcblxuICAgICAgICAgICAgc2VsZi5saXN0LnN0eWxlLnRvcCA9IGhlaWdodENoZWNrID4gMCA/IGZpZWxkT2Zmc2V0VG9wICsgZmllbGRSZWN0LmhlaWdodCArIDUgKyAncHgnIDogZmllbGRPZmZzZXRUb3AgLSBtZW51UmVjdC5oZWlnaHQgLSAxMCArICdweCc7XG4gICAgICAgIH1cblxuICAgICAgICAvL1NlbGVjdCBjbGlja1xuICAgICAgICBmdW5jdGlvbiBoYW5kbGVUYWdmaWVsZENsaWNrKGUpIHtcbiAgICAgICAgICAgIC8vZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGlmIChzZWxmLmxpc3QpIHtcbiAgICAgICAgICAgICAgICAvL2Nsb3NlTGlzdCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vQ3JlYXRlIFNlYXJjaGZpZWxkXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuc2VhcmNoIHx8IHNlbGYub3B0aW9ucy5pdGVtcy5sZW5ndGggPiA3IHx8IHNlbGYub3B0aW9ucy5jcmVhdGVUYWdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbGYuc2VhcmNoRmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9fc2VhcmNoZmllbGQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnBsYWNlaG9sZGVyID0gc2VsZi5vcHRpb25zLnNlYXJjaFBsYWNlaG9sZGVyIHx8ICdTZWFyY2guLi4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBoYW5kbGVTZWFyY2hGaWVsZElucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZpZWxkLnZhbHVlID0gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZ2ZpZWxkX190YWcnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmlubmVySFRNTCA9IHNlbGYub3B0aW9ucy5wbGFjZWZvbGRlciB8fCAnU2VsZWN0IGZyb20gdGhlIGxpc3QnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLmNsYXNzTGlzdC5hZGQoJ2pzLWhlbHBlcklucHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5zdHlsZS56SW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGVscGVyRmllbGQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zZWxmLnNlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaGFuZGxlU2VhcmNoRmllbGRJbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5oZWxwZXJGaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX3N0YXRlX29wZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlTGlzdChzZWxmLm9wdGlvbnMuaXRlbXMsIHNlbGYuYWN0aXZlSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlVGFnZmllbGREb2NDbGljayk7fSwgMTAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICAvL1NlbGVjdCBpdGVtIGhhbmRsZXJcbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0VGFnKGVsKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWdmaWVsZF9fdGFnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFnZmllbGRfX3NlYXJjaGZpZWxkJykubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWhlbHBlcklucHV0JykubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5oZWxwZXJGaWVsZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKHNlbGYuc2VhcmNoRmllbGQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmluc2VydEJlZm9yZShzZWxmLl9jcmVhdGVUYWcoZWwuaW5uZXJIVE1MKSwgc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQoc2VsZi5fY3JlYXRlVGFnKGVsLmlubmVySFRNTCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5pdGVtcy5wdXNoKGVsLmlubmVySFRNTCk7XG5cbiAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgndGFnZmllbGRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLnNlYXJjaEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hGaWVsZC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoRmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBjcmVhdGVMaXN0KHNlbGYub3B0aW9ucy5pdGVtcyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYuaGVscGVyRmllbGQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhlbHBlckZpZWxkLnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgc2VsZi5oZWxwZXJGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGNyZWF0ZUxpc3Qoc2VsZi5vcHRpb25zLml0ZW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgICAgICAgIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKTtcblxuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5pdGVtQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBzZWxmLm9wdGlvbnMuaXRlbUNhbGxiYWNrKGVsLCBzZWxmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVJdGVtQ2xpY2soZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHNlbGVjdFRhZyhlLnRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlSXRlbU1vdXNlT3ZlcihlKSB7XG4gICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGFnZmllbGREb2NDbGljayhlKSB7XG4gICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vRnVsdGVyIGZ1bmN0aW9uIGZvciBzZWFyY2ZpZWxkXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNlYXJjaEZpZWxkSW5wdXQoZSkge1xuICAgICAgICAgICAgdmFyIGZJdGVtcyA9IHNlbGYub3B0aW9ucy5pdGVtcy5maWx0ZXIoZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZS50YXJnZXQudmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNyZWF0ZUxpc3QoZkl0ZW1zLCBzZWxmLmFjdGl2ZUl0ZW0sIGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUuc2xpY2UoLTEpID09PSAnLCcgJiYgc2VsZi5vcHRpb25zLmNyZWF0ZVRhZ3MpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmluc2VydEJlZm9yZShzZWxmLl9jcmVhdGVUYWcoZS50YXJnZXQudmFsdWUuc2xpY2UoMCwgLTEpKSwgc2VsZi5zZWFyY2hGaWVsZCk7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QuYWRkKCd0YWdmaWVsZF9zdGF0ZV9ub3QtZW1wdHknLCAnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgICAgICBlLnRhcmdldC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIGUudGFyZ2V0LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgY3JlYXRlTGlzdChzZWxmLm9wdGlvbnMuaXRlbXMpO1xuICAgICAgICAgICAgICAgIHNlbGYuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUtleURvd24oZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHZhciBpbmRleCwgbGVuZ3RoO1xuICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5saXN0ICYmIHNlbGYubGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpcy1oaWdodGxpZ2h0ZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RUYWcoc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLnRhcmdldC52YWx1ZSAhPT0gJycgJiYgc2VsZi5vcHRpb25zLmNyZWF0ZVRhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaW5zZXJ0QmVmb3JlKHNlbGYuX2NyZWF0ZVRhZyhlLnRhcmdldC52YWx1ZSksIHNlbGYuc2VhcmNoRmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZS50YXJnZXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGUudGFyZ2V0LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVMaXN0KHNlbGYub3B0aW9ucy5pdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMjc6XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkKHNlbGYubGlzdCkuZmluZCgnLmlzLWhpZ2h0bGlnaHRlZCcpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggLSAxKS5hZGRDbGFzcygnaXMtaGlnaHRsaWdodGVkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5wb3NpdGlvbigpLnRvcCA8IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChzZWxmLmxpc3QpLnNjcm9sbFRvcCgpIC0gJChzZWxmLmxpc3QpLmhlaWdodCgpID4gMCA/ICQoc2VsZi5saXN0KS5zY3JvbGxUb3AoKSAtICQoc2VsZi5saXN0KS5oZWlnaHQoKSA6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA0MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3QgJiYgc2VsZi5saXN0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLWhpZ2h0bGlnaHRlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gJChzZWxmLmxpc3QpLmZpbmQoJy5pcy1oaWdodGxpZ2h0ZWQnKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkuYWRkQ2xhc3MoJ2lzLWhpZ2h0bGlnaHRlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoc2VsZi5saXN0KS5oZWlnaHQoKSA8ICQoc2VsZi5saXN0KS5maW5kKCdsaScpLmVxKGluZGV4ICsgMSkucG9zaXRpb24oKS50b3AgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLm91dGVySGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxmLmxpc3QpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGYubGlzdCkuc2Nyb2xsVG9wKCkgKyAkKHNlbGYubGlzdCkuZmluZCgnbGknKS5lcShpbmRleCArIDEpLnBvc2l0aW9uKCkudG9wICsgJChzZWxmLmxpc3QpLmZpbmQoJ2xpJykuZXEoaW5kZXggKyAxKS5vdXRlckhlaWdodCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9EZWxldGUgdGFnIGhhbmRsZVxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVEZWxldGVUYWcoZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHZhciB0YWcgPSBlLnRhcmdldC5wYXJlbnROb2RlO1xuXG4gICAgICAgICAgICB0YWcucmVtb3ZlQ2hpbGQoZS50YXJnZXQpO1xuICAgICAgICAgICAgdmFyIHRhZ1RpdGxlID0gdGFnLmlubmVySFRNTCxcbiAgICAgICAgICAgICAgICB0YWdJbmRleCA9IHNlbGYuaXRlbXMuaW5kZXhPZih0YWdUaXRsZSk7XG4gICAgICAgICAgICBpZiAodGFnSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBbXS5jb25jYXQoc2VsZi5pdGVtcy5zbGljZSgwLCB0YWdJbmRleCksIHNlbGYuaXRlbXMuc2xpY2UodGFnSW5kZXggKyAxKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuZWwucmVtb3ZlQ2hpbGQodGFnKTtcblxuICAgICAgICAgICAgaWYgKHNlbGYuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFnZmllbGRfX3RhZycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgndGFnZmllbGRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWdmaWVsZF9zdGF0ZV9vcGVuJykpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSBzZWxmLm9wdGlvbnMucGxhY2Vmb2xkZXIgfHwgJ1NlbGVjdCBmcm9tIHRoZSBsaXN0JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLl90b2dnbGVBZGRhYmxlKCk7XG5cblxuICAgICAgICB9XG5cbiAgICAgICAgLy9DaGVjayBpZiBmaWVsZCBpcyBlbXB0eSBvciBub3QgYW5kIGNoYW5nZSBjbGFzcyBhY2NvcmRpbmdseVxuICAgICAgICAkKHRoaXMudGFnZmllbGRXcmFwcGVyKS5vbignY2xpY2snLCAnLnRhZ2ZpZWxkX19maWVsZCcsIGhhbmRsZVRhZ2ZpZWxkQ2xpY2spO1xuICAgICAgICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG5cbiAgICB9O1xuXG4gICAgLy9BdXRvcmVzaXplIHRleHRhcmVhXG4gICAgVGFnZmllbGQucHJvdG90eXBlLl9hdXRvc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5lbC52YWx1ZSA9PT0gJycpIHt0aGlzLmVsLnJvd3MgPSAxO31cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgd2lkdGggPSB0aGlzLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLFxuICAgICAgICAgICAgICAgIHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyksXG4gICAgICAgICAgICAgICAgdGV4dFdpZHRoID0gdGhpcy5lbC52YWx1ZS5sZW5ndGggKiA3LFxuICAgICAgICAgICAgICAgIHJvdyA9IE1hdGguY2VpbCh0ZXh0V2lkdGggLyB3aWR0aCk7XG5cbiAgICAgICAgICAgIHJvdyA9IHJvdyA8PSAwID8gMSA6IHJvdztcbiAgICAgICAgICAgIHJvdyA9IHRoaXMub3B0aW9ucy5tYXhIZWlnaHQgJiYgcm93ID4gdGhpcy5vcHRpb25zLm1heEhlaWdodCA/IHRoaXMub3B0aW9ucy5tYXhIZWlnaHQgOiByb3c7XG5cbiAgICAgICAgICAgIHRoaXMuZWwucm93cyA9IHJvdztcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvL0NyZWF0ZSBUYWcgSGVscGVyXG4gICAgVGFnZmllbGQucHJvdG90eXBlLl9jcmVhdGVUYWcgPSBmdW5jdGlvbih0YWdOYW1lKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgZGVsVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgdGFnLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX190YWcnKTtcbiAgICAgICAgdGFnLmlubmVySFRNTCA9IHRhZ05hbWU7XG5cbiAgICAgICAgZGVsVGFnLmNsYXNzTGlzdC5hZGQoJ3RhZ2ZpZWxkX190YWctZGVsZXRlJyk7XG4gICAgICAgIGRlbFRhZy5pbm5lckhUTUwgPSAn4pyVJztcbiAgICAgICAgZGVsVGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHNlbGYuX2RlbGV0ZVRhZyhlLnRhcmdldC5wYXJlbnROb2RlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGFnLmFwcGVuZENoaWxkKGRlbFRhZyk7XG5cbiAgICAgICAgcmV0dXJuIHRhZztcbiAgICB9O1xuXG4gICAgVGFnZmllbGQucHJvdG90eXBlLl9kZWxldGVUYWcgPSBmdW5jdGlvbih0YWcpIHtcbiAgICAgICAgdGhpcy5lbC5yZW1vdmVDaGlsZCh0YWcpO1xuXG4gICAgICAgICQodGFnKS5maW5kKCcudGFnZmllbGRfX3RhZy1kZWxldGUnKS5yZW1vdmUoKTtcbiAgICAgICAgdmFyIHRhZ1RpdGxlID0gdGFnLmlubmVySFRNTCxcbiAgICAgICAgICAgIHRhZ0luZGV4ID0gdGhpcy5pdGVtcy5pbmRleE9mKHRhZ1RpdGxlKTtcbiAgICAgICAgaWYgKHRhZ0luZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBbXS5jb25jYXQodGhpcy5pdGVtcy5zbGljZSgwLCB0YWdJbmRleCksIHRoaXMuaXRlbXMuc2xpY2UodGFnSW5kZXggKyAxKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWdmaWVsZF9fdGFnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RhZ2ZpZWxkX3N0YXRlX25vdC1lbXB0eScsICdqcy1oYXNWYWx1ZScpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWdmaWVsZF9zdGF0ZV9vcGVuJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHNlbGYub3B0aW9ucy5wbGFjZWZvbGRlciB8fCAnU2VsZWN0IGZyb20gdGhlIGxpc3QnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3RvZ2dsZUFkZGFibGUoKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlbGV0ZVRhZ0NhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGVsZXRlVGFnQ2FsbGJhY2sodGFnLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVGFnZmllbGQucHJvdG90eXBlLl90b2dnbGVBZGRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkKHRoaXMuZWwpLnBhcmVudHMoJy5qcy1hZGRhYmxlV3JhcHBlcicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMuZWwpLmhhc0NsYXNzKCdqcy1oYXNWYWx1ZScpKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5hZGRDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsKS5wYXJlbnRzKCcuanMtYWRkYWJsZVdyYXBwZXInKS5yZW1vdmVDbGFzcygnanMtaGFzVmFsdWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBUYWdmaWVsZC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgICAgICAkKHRoaXMuZWwpLmZpbmQoJy50YWdmaWVsZF9fdGFnJykucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgndGFnZmllbGRfc3RhdGVfbm90LWVtcHR5JywgJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgIHRoaXMuX3RvZ2dsZUFkZGFibGUoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaW5pdFRhZ2ZpZWxkcygpIHtcbiAgICAgICAgW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdGFnZmllbGQnKSkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbmV3IFRhZ2ZpZWxkKGVsLCB7XG4gICAgICAgICAgICAgICAgbGFiZWw6IGVsLmRhdGFzZXQubGFiZWwsXG4gICAgICAgICAgICAgICAgaGVscFRleHQ6IGVsLmRhdGFzZXQuaGVscFRleHQsXG4gICAgICAgICAgICAgICAgZXJyTXNnOiBlbC5kYXRhc2V0LmVyck1zZyxcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogZWwuZGF0YXNldC5wbGFjZWhvbGRlcixcbiAgICAgICAgICAgICAgICBpdGVtczogSlNPTi5wYXJzZShlbC5kYXRhc2V0Lml0ZW1zKSxcbiAgICAgICAgICAgICAgICBzZWFyY2g6IGVsLmRhdGFzZXQuc2VhcmNoLFxuICAgICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyOiBlbC5kYXRhc2V0LnNlYXJjaFBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgICAgIGNyZWF0ZVRhZ3M6IGVsLmRhdGFzZXQuY3JlYXRlTmV3VGFnLFxuICAgICAgICAgICAgICAgIGluaXRpYWxJdGVtczogZWwuZGF0YXNldC5zZWxlY3RlZEl0ZW1zID8gSlNPTi5wYXJzZShlbC5kYXRhc2V0LnNlbGVjdGVkSXRlbXMpIDogJydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0VGFnZmllbGRzKCk7XG5cblxuLy99KSh3aW5kb3cpO1xuXG4vL0Ryb3Bkb3duXG5mdW5jdGlvbiBEcm9wZG93bihlbCwgb3B0aW9ucykge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgdGhpcy5faW5pdCgpO1xuICAgIHRoaXMuX2luaXRFdmVudHMoKTtcbn1cblxuRHJvcGRvd24ucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5kcm9wZG93bldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmRyb3Bkb3duV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdqcy1kcm9wZG93bldyYXBwZXInKTtcbiAgICB0aGlzLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuZHJvcGRvd25XcmFwcGVyLCB0aGlzLmVsKTtcbiAgICB0aGlzLmRyb3Bkb3duV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2pzLWRyb3Bkb3duJyk7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdqcy1kcm9wZG93bkl0ZW0nKTtcbn07XG5cbkRyb3Bkb3duLnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vQ2xvc2UgbGlzdCBoZWxwZXJcbiAgICBmdW5jdGlvbiBjbG9zZUxpc3QoKSB7XG4gICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtb3BlbicpO1xuICAgICAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICAgICAgICBzZWxmLmRyb3Bkb3duV3JhcHBlci5yZW1vdmVDaGlsZChzZWxmLmxpc3QpO1xuICAgICAgICAgICAgc2VsZi5saXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZU91dHNpZGVDbGljayk7XG4gICAgfVxuICAgIC8vSGFuZGxlIG91dHNpZGUgZHJvcGRvd24gY2xpY2tcbiAgICBmdW5jdGlvbiBoYW5kbGVPdXRzaWRlQ2xpY2soZSkge1xuICAgICAgICBjbG9zZUxpc3QoKTtcbiAgICB9XG5cbiAgICAvL0hhbmRsZSBkcm9wZG93biBjbGlja1xuICAgIGZ1bmN0aW9uIGhhbmRsZURyb3Bkb3duQ2xpY2soZSkge1xuXG4gICAgICAgIC8vZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKHNlbGYuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1vcGVuJykpIHtjbG9zZUxpc3QoKTt9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5pdGVtcykge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgnaXMtb3BlbicpO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICAgICAgICBzZWxmLmxpc3QuY2xhc3NMaXN0LmFkZCgnYy1Ecm9wZG93bi1saXN0Jyk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLm9wdGlvbnMuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmRpdmlkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Ryb3Bkb3duX19kaXZpZGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkcm9wZG93bl9fbGlzdC1pdGVtJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5pbm5lckhUTUwgPSBpdGVtLmlubmVySFRNTCB8fCBpdGVtLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmNhbGxiYWNrKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlTGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmRpc2FibGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS53YXJuaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ud2FybmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hhcy13YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGlzdC5hcHBlbmRDaGlsZChpdGVtRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLmRyb3Bkb3duV3JhcHBlci5hcHBlbmRDaGlsZChzZWxmLmxpc3QpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGxpc3RSZWN0ID0gc2VsZi5saXN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RSZWN0LmxlZnQgKyBsaXN0UmVjdC53aWR0aCA+IHdpbmRvdy5pbm5lcldpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS5yaWdodCA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5saXN0LnN0eWxlLmxlZnQgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobGlzdFJlY3QudG9wICsgbGlzdFJlY3QuaGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGlzdC5zdHlsZS5ib3R0b20gPSAnMTAwJSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5saXN0LnN0eWxlLnRvcCA9ICcxMDAlJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVPdXRzaWRlQ2xpY2spO30sIDEwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxmLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlRHJvcGRvd25DbGljayk7XG59O1xuXG4vL0FkZGFibGUgRmllbGRzXG4vLzsoZnVuY3Rpb24od2luZG93KSB7XG4gICAgLy8ndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBBZGRhYmxlKGVsLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7c29ydGFibGU6IHRydWV9O1xuXG4gICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICB9XG5cbiAgICBBZGRhYmxlLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLWFkZGFibGVXcmFwcGVyJyk7XG4gICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuaW5zZXJ0QmVmb3JlKHNlbGYuZWwpO1xuXG4gICAgICAgIHNlbGYuZWwucmVtb3ZlQ2xhc3MoJ2pzLWFkZGFibGUnKTtcbiAgICAgICAgc2VsZi5lbC5hZGRDbGFzcygnanMtYWRkYWJsZUl0ZW0gYy1BZGRhYmxlLWl0ZW0nKTtcblxuICAgICAgICBzZWxmLmFkZGFibGVSb3cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdqcy1hZGRhYmxlUm93IGMtQWRkYWJsZS1yb3cnKTtcblxuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnNvcnRhYmxlKSB7XG4gICAgICAgICAgICBzZWxmLmFkZGFibGVSb3dEcmFnSGFuZGxlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2MtQWRkYWJsZS1yb3ctZHJhZ0hhbmRsZXInKTtcbiAgICAgICAgICAgIHNlbGYuYWRkYWJsZVJvdy5hcHBlbmQoc2VsZi5hZGRhYmxlUm93RHJhZ0hhbmRsZXIpO1xuXG4gICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLnNvcnRhYmxlKHtcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogc2VsZi5vcHRpb25zID8gc2VsZi5vcHRpb25zLnBsYWNlaG9sZGVyIHx8ICdjLUFkZGFibGUtcm93UGxhY2Vob2xkZXInIDogJ2MtQWRkYWJsZS1yb3dQbGFjZWhvbGRlcicsXG4gICAgICAgICAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGUsIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVpLml0ZW0uYWRkQ2xhc3MoJ2lzLWRyYWdnaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICQoZS50YXJnZXQpLmNzcygnaGVpZ2h0JywgJChlLnRhcmdldCkuaGVpZ2h0KCkpO1xuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuY3NzKCdoZWlnaHQnLCAkKCdib2R5JykuaGVpZ2h0KCkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RvcDogZnVuY3Rpb24oZSwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgdWkuaXRlbS5yZW1vdmVDbGFzcygnaXMtZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgJChlLnRhcmdldCkuY3NzKCdoZWlnaHQnLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5jc3MoJ2hlaWdodCcsICcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuYWRkQnV0dG9uID0gJCgnPGJ1dHRvbj48L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uLS1yb3VuZCBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5IGJ1dHRvbi0tYWRkIGMtQWRkYWJsZS1yb3ctYWRkQnV0dG9uJykuY2xpY2soaGFuZGxlQWRkUm93KTtcblxuICAgICAgICBzZWxmLnJlbW92ZUJ1dHRvbiA9ICQoJzxidXR0b24+PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbi0tcm91bmQgYnV0dG9uX3N0eWxlX291dGxpbmUtZ3JheSBidXR0b24tLXJlbW92ZSBqcy1hZGRhYmxlUmVtb3ZlQnV0dG9uJykuY2xpY2soaGFuZGxlUmVtb3ZlUm93KTtcblxuICAgICAgICBzZWxmLmFkZGFibGVSb3cuYXBwZW5kKHNlbGYuZWwuY2xvbmUodHJ1ZSwgdHJ1ZSksIHRoaXMucmVtb3ZlQnV0dG9uLCB0aGlzLmFkZEJ1dHRvbik7XG4gICAgICAgIHNlbGYub3JpZ2luYWxFbCA9IHNlbGYuZWwuY2xvbmUodHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIHNlbGYuZWwuZGV0YWNoKCk7XG5cbiAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5hcHBlbmQodGhpcy5hZGRhYmxlUm93LmNsb25lKHRydWUsIHRydWUpKTtcblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVBZGRSb3coZSkge1xuICAgICAgICAgICAgLy9DaGVjayBpZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDEgY2hpbGQgYW5kIGNoYW5nZSBjbGFzc1xuICAgICAgICAgICAgaWYgKHNlbGYuYWRkYWJsZVdyYXBwZXIuY2hpbGRyZW4oKS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5hZGRDbGFzcygnaGFzLW11bHRpcGxlUm93cycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLnJlbW92ZUNsYXNzKCdoYXMtbXVsdGlwbGVSb3dzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL3NlbGYuYWRkYWJsZVdyYXBwZXIuYXBwZW5kKHNlbGYuYWRkYWJsZVJvdy5jbG9uZSh0cnVlLCB0cnVlKSk7XG4gICAgICAgICAgICBzZWxmLl9hZGRJdGVtKHNlbGYub3JpZ2luYWxFbC5jbG9uZSh0cnVlLCB0cnVlKSwgc2VsZi5vcHRpb25zPyBzZWxmLm9wdGlvbnMuYmVmb3JlQWRkIDogbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlUmVtb3ZlUm93KGUpIHtcbiAgICAgICAgXHQkKGUudGFyZ2V0KS5wYXJlbnRzKCcuanMtYWRkYWJsZVJvdycpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHNlbGYuYWRkYWJsZVdyYXBwZXIuY2hpbGRyZW4oJy5qcy1hZGRhYmxlUm93JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBzZWxmLl9hZGRJdGVtKHNlbGYub3JpZ2luYWxFbC5jbG9uZSh0cnVlLCB0cnVlKSwgc2VsZi5vcHRpb25zPyBzZWxmLm9wdGlvbnMuYmVmb3JlQWRkIDogbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ2pzLWhhc1ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLnJlbW92ZUNsYXNzKCdoYXMtbXVsdGlwbGVSb3dzJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLl9hZGRJdGVtID0gZnVuY3Rpb24oZWwsIGJlZm9yZUFkZCkge1xuICAgICAgICAgICAgaWYgKGJlZm9yZUFkZCkge1xuICAgICAgICAgICAgICAgIGJlZm9yZUFkZChlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYWRkYWJsZVJvdyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2pzLWFkZGFibGVSb3cgYy1BZGRhYmxlLXJvdycpLFxuICAgICAgICAgICAgICAgIGFkZEJ1dHRvbiA9ICQoJzxidXR0b24+PC9idXR0b24+JykuYWRkQ2xhc3MoJ2J1dHRvbi0tcm91bmQgYnV0dG9uX3N0eWxlX291dGxpbmUtZ3JheSBidXR0b24tLWFkZCBjLUFkZGFibGUtcm93LWFkZEJ1dHRvbicpLmNsaWNrKGhhbmRsZUFkZFJvdyksXG4gICAgICAgICAgICAgICAgcmVtb3ZlQnV0dG9uID0gJCgnPGJ1dHRvbj48L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uLS1yb3VuZCBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5IGJ1dHRvbi0tcmVtb3ZlIGpzLWFkZGFibGVSZW1vdmVCdXR0b24nKS5jbGljayhoYW5kbGVSZW1vdmVSb3cpO1xuXG4gICAgICAgICAgICBlbC5hZGRDbGFzcygnanMtYWRkYWJsZUl0ZW0gYy1BZGRhYmxlLWl0ZW0nKTtcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuc29ydGFibGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgYWRkYWJsZVJvd0RyYWdIYW5kbGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnYy1BZGRhYmxlLXJvdy1kcmFnSGFuZGxlcicpO1xuICAgICAgICAgICAgICAgIGFkZGFibGVSb3cuYXBwZW5kKGFkZGFibGVSb3dEcmFnSGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRhYmxlUm93LmFwcGVuZChlbCwgcmVtb3ZlQnV0dG9uLCBhZGRCdXR0b24pO1xuICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5hcHBlbmQoYWRkYWJsZVJvdyk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLmFkZGFibGVXcmFwcGVyLmNoaWxkcmVuKCkubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIHNlbGYuYWRkYWJsZVdyYXBwZXIuYWRkQ2xhc3MoJ2hhcy1tdWx0aXBsZVJvd3MnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hZGRhYmxlV3JhcHBlci5yZW1vdmVDbGFzcygnaGFzLW11bHRpcGxlUm93cycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5hZnRlckFkZCkge1xuICAgICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5hZnRlckFkZChlbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vQXV0byBzY3JvbGwgcGFnZSB3aGVuIGFkZGluZyByb3cgYmVsb3cgc2NyZWVuIGJvdHRvbSBlZGdlXG4gICAgICAgICAgICB2YXIgcm93Qm90dG9tRW5kID0gYWRkYWJsZVJvdy5nZXQoMCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgYWRkYWJsZVJvdy5oZWlnaHQoKTtcbiAgICAgICAgICAgIGlmIChyb3dCb3R0b21FbmQgKyA2MCA+ICQod2luZG93KS5oZWlnaHQoKSkge1xuICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hbmltYXRlKCB7IHNjcm9sbFRvcDogJys9JyArIE1hdGgucm91bmQocm93Qm90dG9tRW5kICsgNjAgLSAkKHdpbmRvdykuaGVpZ2h0KCkpLnRvU3RyaW5nKCkgfSwgNDAwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuYWRkYWJsZVdyYXBwZXI7XG4gICAgICAgIH07XG4gICAgICAgIHNlbGYucmVtb3ZlSXRlbSA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICBzZWxmLmFkZGFibGVXcmFwcGVyLmNoaWxkcmVuKCkuc2xpY2UoaW5kZXgsIGluZGV4KzEpLnJlbW92ZSgpO1xuICAgICAgICAgICAgaWYgKHNlbGYuYWRkYWJsZVdyYXBwZXIuY2hpbGRyZW4oJy5qcy1hZGRhYmxlUm93JykubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgXHRcdHNlbGYuYWRkYWJsZVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ2hhcy1tdWx0aXBsZVJvd3MnKTtcbiAgICAgICAgXHR9XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRBZGRhYmxlRmllbGRzKCkge1xuICAgICAgICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1hZGRhYmxlJykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIG5ldyBBZGRhYmxlKCQoZWwpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbi8vfSkod2luZG93KTtcblxuLy9JbWFnZSBQbGFjZWhvbGRlcnNcbi8vVGhpcyBjbGFzcyBjcmVhdGVzIGEgcGFsY2Vob2xkZXIgZm9yIGltYWdlIGZpbGVzLiBJdCBoYW5kbGUgYm90aCBjbGljayB0byBsb2FkIGFuZCBhbHNvIHNlbGVjdCBmcm9tIGFzc2V0IGxpYnJhcnkgYWN0aW9uLlxuXG5mdW5jdGlvbiBJbWFnZVBsYWNlaG9sZGVyKGVsLCBmaWxlLCBvcHRpb25zKSB7XG4gIHRoaXMuZWwgPSBlbDtcbiAgdGhpcy5maWxlID0gZmlsZTtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB0aGlzLl9pbml0KCk7XG4gIHRoaXMuX2luaXRFdmVudHMoKTtcbn1cblxuSW1hZ2VQbGFjZWhvbGRlci5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5vcHRpb25zLm5hbWUgPSB0aGlzLm9wdGlvbnMubmFtZSB8fCB0aGlzLmVsLmRhdGFzZXQubmFtZTtcbiAgdGhpcy5vcHRpb25zLmlkID0gdGhpcy5lbC5pZCArICctcGxhY2Vob2xkZXInO1xuXG4gIC8vV3JhcHAgcGxhY2Vob2xkZXJcbiAgdGhpcy53cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRoaXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjLUltYWdlUGxhY2Vob2xkZXInKTtcbiAgaWYgKCF0aGlzLmZpbGUpIHt0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaXMtZW1wdHknKTt9XG4gIHRoaXMud3JhcHBlci5pZCA9IHRoaXMub3B0aW9ucy5pZDtcblxuICAvL1BsYWNlaG9sZGVyIEltYWdlXG4gIHRoaXMuaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy5pbWFnZS5jbGFzc0xpc3QuYWRkKCdjLUltYWdlUGxhY2Vob2xkZXItaW1nJyk7XG4gIGlmICh0aGlzLmZpbGUpIHt0aGlzLmltYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IHRoaXMuZmlsZS5maWxlRGF0YS51cmw7fVxuICB0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5pbWFnZSk7XG5cbiAgLy9QbGFjZWhvbGRlciBjb250cm9sc1xuICB0aGlzLmNvbnRyb2xzID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzJykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzVXBsb2FkID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbicpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc1VwbG9hZEljb24gPSAkKCc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbi1pY29uJykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzVXBsb2FkVGV4dCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1idXR0b24tdGV4dCcpLnRleHQoJ1VwbG9hZCBmcm9tIHlvdXIgY29tcHV0ZXInKS5nZXQoMCk7XG4gIHRoaXMuY29udHJvbHNVcGxvYWQuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc1VwbG9hZEljb24pO1xuICB0aGlzLmNvbnRyb2xzVXBsb2FkLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNVcGxvYWRUZXh0KTtcblxuICB0aGlzLmNvbnRyb2xzRGl2aWRlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ltYWdlLXBsYWNlaG9sZGVyX19jb250cm9scy1kaXZpZGVyJykuZ2V0KDApO1xuXG4gIHRoaXMuY29udHJvbHNMaWJyYXJ5ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbicpLmdldCgwKTtcbiAgdGhpcy5jb250cm9sc0xpYnJhcnlJY29uID0gJCgnPGkgY2xhc3M9XCJmYSBmYS1mb2xkZXItb3BlblwiPjwvaT4nKS5hZGRDbGFzcygnaW1hZ2UtcGxhY2Vob2xkZXJfX2NvbnRyb2xzLWJ1dHRvbi1pY29uJykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzTGlicmFyeVRleHQgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdpbWFnZS1wbGFjZWhvbGRlcl9fY29udHJvbHMtYnV0dG9uLXRleHQnKS50ZXh0KCdBZGQgZnJvbSBhc3NldCBsaWJyYXJ5JykuZ2V0KDApO1xuICB0aGlzLmNvbnRyb2xzTGlicmFyeS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzTGlicmFyeUljb24pO1xuICB0aGlzLmNvbnRyb2xzTGlicmFyeS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzTGlicmFyeVRleHQpO1xuXG4gIHRoaXMuY29udHJvbHMuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc1VwbG9hZCk7XG4gIHRoaXMuY29udHJvbHMuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc0RpdmlkZXIpO1xuICB0aGlzLmNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHNMaWJyYXJ5KTtcbiAgdGhpcy5pbWFnZS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzKTtcblxuICAvL0NsZWFyIGJ1dHRvblxuICB0aGlzLmRlbGV0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLmRlbGV0ZS5jbGFzc0xpc3QuYWRkKCdjLUltYWdlUGxhY2Vob2xkZXItZGVsZXRlJyk7XG4gIHRoaXMuaW1hZ2UuYXBwZW5kQ2hpbGQodGhpcy5kZWxldGUpO1xuXG4gIC8vRWRpdCBidXR0b25cbiAgdGhpcy5lZGl0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIHRoaXMuZWRpdC5jbGFzc0xpc3QuYWRkKCdidXR0b24nLCAnYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUnLCAnYy1JbWFnZVBsYWNlaG9sZGVyLWVkaXQnKTtcbiAgdGhpcy5lZGl0LmlubmVySFRNTCA9ICdFZGl0JztcbiAgdGhpcy5pbWFnZS5hcHBlbmRDaGlsZCh0aGlzLmVkaXQpO1xuXG4gIC8vRmlsZSBuYW1lXG4gIHRoaXMuZmlsZU5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy5maWxlTmFtZS5jbGFzc0xpc3QuYWRkKCdjLUltYWdlUGxhY2Vob2xkZXItZmlsZU5hbWUnKTtcbiAgdGhpcy5maWxlTmFtZS5pbm5lckhUTUwgPSB0aGlzLmZpbGUgPyB0aGlzLmZpbGUuZmlsZURhdGEudGl0bGUgOiAnJztcbiAgdGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZmlsZU5hbWUpO1xuXG4gIC8vUGxhY2Vob2xkZXIgVGl0bGVcbiAgdGhpcy50aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLnRpdGxlLmNsYXNzTGlzdC5hZGQoJ2MtSW1hZ2VQbGFjZWhvbGRlci10aXRsZScpO1xuICB0aGlzLnRpdGxlLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5uYW1lIHx8ICdDb3Zlcic7XG4gIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLnRpdGxlKTtcblxuICAvL0ZpbGVpbnB1dCB0byBoYW5kbGUgY2xpY2sgdG8gdXBsb2FkIGltYWdlXG4gIHRoaXMuZmlsZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICB0aGlzLmZpbGVJbnB1dC50eXBlID0gXCJmaWxlXCI7XG4gIHRoaXMuZmlsZUlucHV0Lm11bHRpcGxlID0gZmFsc2U7XG4gIHRoaXMuZmlsZUlucHV0LmhpZGRlbiA9IHRydWU7XG4gIHRoaXMuZmlsZUlucHV0LmFjY2VwdCA9IFwiaW1hZ2UvKiwgdmlkZW8vKlwiO1xuXG4gIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmZpbGVJbnB1dCk7XG5cbiAgdGhpcy5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLndyYXBwZXIsIHRoaXMuZWwpO1xuICB0aGlzLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5lbCk7XG5cbn07XG5cbkltYWdlUGxhY2Vob2xkZXIucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBmdW5jdGlvbiBjbGVhcihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBzZWxmLmZpbGUgPSB1bmRlZmluZWQ7XG4gICAgc2VsZi5fdXBkYXRlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBvcGVuTGlicmFyeSgpIHtcbiAgICBzY3JvbGxQb3NpdGlvbiA9ICQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcbiAgICB1cGRhdGVBc3NldExpYnJhcnkoKTtcbiAgICAkKCcjYWwnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgJCgnI2FsJykuYWRkQ2xhc3MoJ21vZGFsJyk7XG4gICAgJCgnI3dyYXBwZXInKS5hZGRDbGFzcygnb3ZlcmZsb3cnKTtcbiAgICBzaW5nbGVzZWxlY3QgPSB0cnVlO1xuXG4gICAgJCgnI2FkZEZyb21BTEJ1dHRvbicpLnRleHQoc2VsZi5vcHRpb25zLmFsQnV0dG9uIHx8ICdTZXQgQ292ZXInKTtcblxuICAgICQoJyNhZGRGcm9tQUxCdXR0b24nKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgbGFzdFNlbGVjdGVkID0gbnVsbDtcbiAgICAgIHNldFNlbGVjdGVkRmlsZSgpO1xuICAgICAgY2xvc2VBc3NldExpYnJhcnkoKTtcbiAgICAgIHNpbmdsZXNlbGVjdCA9IGZhbHNlO1xuICAgICAgJCgnYm9keScpLnNjcm9sbFRvcChzY3JvbGxQb3NpdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZUFzc2V0TGlicmFyeSgpIHtcbiAgICBsYXN0U2VsZWN0ZWQgPSBudWxsO1xuICAgICQoJy5hbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzIC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgZGVzZWxlY3RBbGwoKTtcbiAgICAkKCcubW9kYWwnKS5hZGRDbGFzcygnaGlkZGVuJykucmVtb3ZlQ2xhc3MoJ21vZGFsJyk7XG4gICAgJCgnI3dyYXBwZXInKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3cnKTtcbiAgICAkKCcjYWRkRnJvbUFMQnV0dG9uJykudW5iaW5kKCdjbGljaycpO1xuICAgICQoJ2JvZHknKS5zY3JvbGxUb3Aoc2Nyb2xsUG9zaXRpb24pO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFNlbGVjdGVkRmlsZSgpIHtcbiAgICB2YXIgc2VsZWN0ZWRGaWxlID0gJCgnLmFsIC5maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKSxcbiAgICBmaWxlSWQgPSAkKHNlbGVjdGVkRmlsZSkuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpLFxuICAgIGZpbGUgPSBhc3NldExpYnJhcnlPYmplY3RzLmZpbHRlcihmdW5jdGlvbihmKSB7XG4gICAgICByZXR1cm4gZi5pZCA9PT0gZmlsZUlkO1xuICAgIH0pWzBdO1xuXG4gICAgc2VsZi5maWxlID0ge1xuICAgICAgZmlsZURhdGE6IGZpbGVcbiAgICB9O1xuICAgIHNlbGYuX3VwZGF0ZSgpO1xuICB9XG5cblxuICBzZWxmLmZpbGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgZmlsZVRvT2JqZWN0KGUudGFyZ2V0LmZpbGVzWzBdKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgc2VsZi5maWxlID0ge1xuICAgICAgICBmaWxlRGF0YTogcmVzLFxuICAgICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgIHBvc2l0aW9uOiAxMDAwLFxuICAgICAgICBjYXB0aW9uOiAnJyxcbiAgICAgICAgZ2FsbGVyeUNhcHRpb246IGZhbHNlLFxuICAgICAgICBqdXN0VXBsb2FkZWQ6IHRydWVcbiAgICAgIH07XG4gICAgICBzZWxmLl91cGRhdGUoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgc2VsZi5jb250cm9sc1VwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoIXNlbGYuZmlsZSkge1xuICAgICAgc2VsZi5maWxlSW5wdXQuY2xpY2soKTtcbiAgICB9XG4gIH0pO1xuICBzZWxmLmRlbGV0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsZWFyKTtcbiAgc2VsZi5lZGl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGVkaXRGaWxlcyhbc2VsZi5maWxlXSk7XG4gIH0pO1xuXG4gIHNlbGYuY29udHJvbHNMaWJyYXJ5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlbkxpYnJhcnkpO1xufTtcbkltYWdlUGxhY2Vob2xkZXIucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuZmlsZSkge1xuICAgIHRoaXMud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdpcy1lbXB0eScpO1xuICAgIHRoaXMuaW1hZ2Uuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybCgnICsgdGhpcy5maWxlLmZpbGVEYXRhLnVybCArICcpJztcbiAgICB0aGlzLmZpbGVOYW1lLmlubmVySFRNTCA9IHRoaXMuZmlsZS5maWxlRGF0YS50aXRsZTtcbiAgfVxuICBlbHNlIHtcbiAgICB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaXMtZW1wdHknKTtcbiAgICB0aGlzLmltYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICdub25lJztcbiAgICB0aGlzLmZpbGVOYW1lLmlubmVySFRNTCA9ICcnO1xuICB9XG59O1xuXG5JbWFnZVBsYWNlaG9sZGVyLnByb3RvdHlwZS5zZXRJbWFnZSA9IGZ1bmN0aW9uKGZpbGUpIHtcbiAgdGhpcy5maWxlID0gZmlsZTtcbiAgdGhpcy5fdXBkYXRlKCk7XG59O1xuXG5mdW5jdGlvbiBpbml0SW1hZ2VQbGFjZWhvbGRlcnMoKSB7XG4gIHZhciBpbWFnZVBsYWNlaG9sZGVycyA9IFtdO1xuICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1pbWFnZVBsYWNlaG9sZGVyJykpLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICBpbWFnZVBsYWNlaG9sZGVycy5wdXNoKG5ldyBJbWFnZVBsYWNlaG9sZGVyKGVsKSk7XG4gIH0pO1xuICByZXR1cm4gaW1hZ2VQbGFjZWhvbGRlcnM7XG59XG5cblxuXG4vKlxuICogSW5pdGlhbGl6YXRpb25zXG4gKi9cblxuXG5cblxuXG5cbi8vU3RpY2thYmxlXG5mdW5jdGlvbiBTdGlja2FibGUoZWwsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMuX2luaXQoKTtcbn1cblxuU3RpY2thYmxlLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLmJvdW5kYXJ5ID0gc2VsZi5vcHRpb25zLmJvdW5kYXJ5ID8gc2VsZi5vcHRpb25zLmJvdW5kYXJ5ID09PSB0cnVlID8gc2VsZi5lbC5wYXJlbnROb2RlIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxmLm9wdGlvbnMuYm91bmRhcnkpIDogdW5kZWZpbmVkO1xuICAgIHNlbGYub2Zmc2V0ID0gc2VsZi5vcHRpb25zLm9mZnNldCB8fCAwO1xuXG4gICAgZnVuY3Rpb24gaGFuZGxlU2Nyb2xsKCkge1xuICAgICAgICB2YXIgZWxlbWVudFJlY3QgPSBzZWxmLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgZWxlbWVudEJvdHRvbU9mZnNldCA9IGVsZW1lbnRSZWN0LnRvcCArIGVsZW1lbnRSZWN0LmhlaWdodDtcblxuXG4gICAgICAgIGlmICgoc2VsZi5vcHRpb25zLm1heFdpZHRoICYmIHdpbmRvdy5pbm5lcldpZHRoIDw9IHNlbGYub3B0aW9ucy5tYXhXaWR0aCkgfHwgIXNlbGYub3B0aW9ucy5tYXhXaWR0aCkge1xuICAgICAgICAgICAgaWYgKCFzZWxmLmVsLmNsYXNzTGlzdC5jb250YWlucygnaXMtc3R1Y2snKSkge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50UmVjdC50b3AgLSBzZWxmLm9wdGlvbnMub2Zmc2V0IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsZW1lbnRPZmZzZXRQYXJlbnQgPSBzZWxmLmVsLm9mZnNldFBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbml0aWFsT2Zmc2V0ID0gc2VsZi5lbC5vZmZzZXRUb3A7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NMaXN0LmFkZChzZWxmLm9wdGlvbnMuY2xhc3MgfHwgJ2lzLXN0dWNrJyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnRvcCA9IHNlbGYub2Zmc2V0LnRvU3RyaW5nKCkgKyAncHgnO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudE9mZnNldFBhcmVudFJlY3QgPSBzZWxmLmVsZW1lbnRPZmZzZXRQYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuYm91bmRhcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJvdW5kYXJ5UmVjdCA9IHNlbGYuYm91bmRhcnkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZGFyeUJvdHRvbU9mZnNldCA9IGJvdW5kYXJ5UmVjdC50b3AgKyBib3VuZGFyeVJlY3QuaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Qm90dG9tT2Zmc2V0ID4gYm91bmRhcnlCb3R0b21PZmZzZXQgfHwgZWxlbWVudFJlY3QudG9wIDwgc2VsZi5vcHRpb25zLm9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS50b3AgPSBNYXRoLnJvdW5kKGJvdW5kYXJ5Qm90dG9tT2Zmc2V0IC0gZWxlbWVudFJlY3QuaGVpZ2h0KS50b1N0cmluZygpICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50UmVjdC50b3AgPiBzZWxmLm9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS50b3AgPSBzZWxmLm9mZnNldC50b1N0cmluZygpICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vZmZzZXQgPCBzZWxmLmluaXRpYWxPZmZzZXQgKyBlbGVtZW50T2Zmc2V0UGFyZW50UmVjdC50b3ApIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnN0eWxlLnBvc2l0aW9uID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuc3R5bGUudG9wID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVSZXNpemUoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IHNlbGYub3B0aW9ucy5tYXhXaWR0aCkge1xuICAgICAgICAgICAgc2VsZi5lbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zdHVjaycpO1xuICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS5wb3NpdGlvbiA9ICcnO1xuICAgICAgICAgICAgc2VsZi5lbC5zdHlsZS50b3AgPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhhbmRsZVNjcm9sbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvcHRpbWl6ZWRTY3JvbGxcIiwgaGFuZGxlU2Nyb2xsKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9wdGltaXplZFJlc2l6ZVwiLCBoYW5kbGVSZXNpemUpO1xufTtcblxuLy9SZXF1aXJlZCBGaWVsZHNcbmZ1bmN0aW9uIG5vcm1hbGl6ZVJlcXVpcmVkQ291bnQoKSB7XG4gICAgJCgnLmpzLXJlcXVpcmVkQ291bnQnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICB2YXIgY2FyZCA9ICQoZWwpLnBhcmVudHMoJy5jYXJkJyksXG4gICAgICAgICAgICBjYXJkSWQgPSBjYXJkLmF0dHIoJ2lkJyksXG4gICAgICAgICAgICBlbXB0eVJlcXVpcmVkRmllbGRzQ291bnQgPSBjYXJkLmZpbmQoJy5qcy1yZXF1aXJlZCcpLmxlbmd0aCAtIGNhcmQuZmluZCgnLmpzLXJlcXVpcmVkLmpzLWhhc1ZhbHVlJykubGVuZ3RoLFxuICAgICAgICAgICAgbmF2SXRlbSA9ICQoJy5qcy1zY3JvbGxTcHlOYXYgLmpzLXNjcm9sbE5hdkl0ZW1bZGF0YS1ocmVmPVwiJyArIGNhcmRJZCArICdcIl0nKTtcblxuICAgICAgICBpZiAoZW1wdHlSZXF1aXJlZEZpZWxkc0NvdW50ID4gMCkge1xuICAgICAgICAgICAgbmF2SXRlbS5hZGRDbGFzcygnaXMtcmVxdWlyZWQnKTtcbiAgICAgICAgICAgICQoZWwpLnRleHQoZW1wdHlSZXF1aXJlZEZpZWxkc0NvdW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hdkl0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLXJlcXVpcmVkJyk7XG4gICAgICAgICAgICAkKGVsKS50ZXh0KCcnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbi8vUGFnaW5hdGlvblxuZnVuY3Rpb24gUGFnaW5hdGlvbihlbCwgc3RvcmUsIHVwZGF0ZUZ1bmN0aW9uKSB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICB0aGlzLnVwZGF0ZSA9IHVwZGF0ZUZ1bmN0aW9uO1xuXG4gICAgdGhpcy5faW5pdCgpO1xufVxuXG5QYWdpbmF0aW9uLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZW5kZXJQYWdpbmF0aW9uKCk7XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVQYWdlQ2xpY2soZSkge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQuZGF0YXNldC50YXJnZXQgfHwgZS50YXJnZXQucGFyZW50Tm9kZS5kYXRhc2V0LnRhcmdldDtcbiAgICAgICAgc3dpdGNoICh0YXJnZXQpIHtcbiAgICAgICAgICAgIGNhc2UgJ3ByZXYnOlxuICAgICAgICAgICAgICAgIHNlbGYuc3RvcmUuc2V0UGFnZShzZWxmLnN0b3JlLnBhZ2UgLSAxIDwgMCA/IDAgOiBzZWxmLnN0b3JlLnBhZ2UgLSAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ25leHQnOlxuICAgICAgICAgICAgICAgIHNlbGYuc3RvcmUuc2V0UGFnZShzZWxmLnN0b3JlLnBhZ2UgKyAxID09PSBzZWxmLnN0b3JlLnBhZ2VzTnVtYmVyKCkgPyBzZWxmLnN0b3JlLnBhZ2VzTnVtYmVyKCkgLSAxIDogc2VsZi5zdG9yZS5wYWdlICsgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLnVwZGF0ZSgkKCcjbGlicmFyeUJvZHknKSwgc2VsZi5zdG9yZSwgcmVuZGVyQ29udGVudFJvdyk7XG4gICAgICAgIHJlbmRlclBhZ2luYXRpb24oKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJQYWdpbmF0aW9uKCkge1xuICAgICAgICB2YXIgbGlua3MgPSAkKCc8dWw+PC91bD4nKS5hZGRDbGFzcygncGFnaW5hdGlvbl9fbGlzdCcpO1xuICAgICAgICBzZWxmLmVsLmVtcHR5KCk7XG5cbiAgICAgICAgY29uc29sZS5sb2coc2VsZi5zdG9yZS5wYWdlc051bWJlcigpKTtcblxuICAgICAgICBpZiAoc2VsZi5zdG9yZS5wYWdlc051bWJlcigpID4gMSkge1xuICAgICAgICAgICAgLy9QcmV2XG4gICAgICAgICAgICB2YXIgcHJldkxpbmsgPSAkKCc8bGk+PGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1sZWZ0XCI+PC9pPjwvbGk+JykuYWRkQ2xhc3MoJ3BhZ2luYXRpb25fX3ByZXYnKS5hdHRyKCdkYXRhLXRhcmdldCcsICdwcmV2JykuY2xpY2soaGFuZGxlUGFnZUNsaWNrKTtcbiAgICAgICAgICAgIGlmIChzZWxmLnN0b3JlLnBhZ2UgPT09IDApIHtwcmV2TGluay5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTt9XG4gICAgICAgICAgICBsaW5rcy5hcHBlbmQocHJldkxpbmspO1xuXG4gICAgICAgICAgICAvL0N1cnJlbnQgcGFnZSBpbmRpY2F0b3JcbiAgICAgICAgICAgIC8vdmFyIGN1cnJlbnRQYWdlID0gJCgnPGxpPjwvbGk+JykuYWRkQ2xhc3MoJ3BhZ2luYXRpb25fX2N1cnJlbnQnKS50ZXh0KHNlbGYuc3RvcmUucGFnZSArIDEpO1xuICAgICAgICAgICAgLy9saW5rcy5hcHBlbmQoY3VycmVudFBhZ2UpO1xuXG4gICAgICAgICAgICAvL05leHRcbiAgICAgICAgICAgIHZhciBuZXh0TGluayA9ICQoJzxsaT48aSBjbGFzcz1cImZhIGZhLWFuZ2xlLXJpZ2h0XCI+PC9pPjwvbGk+JykuYWRkQ2xhc3MoJ3BhZ2luYXRpb25fX25leHQnKS5hdHRyKCdkYXRhLXRhcmdldCcsICduZXh0JykuY2xpY2soaGFuZGxlUGFnZUNsaWNrKTtcbiAgICAgICAgICAgIGlmIChzZWxmLnN0b3JlLnBhZ2UgPT09IHNlbGYuc3RvcmUucGFnZXNOdW1iZXIoKSAtIDEpIHtuZXh0TGluay5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTt9XG4gICAgICAgICAgICBsaW5rcy5hcHBlbmQobmV4dExpbmspO1xuXG4gICAgICAgICAgICBzZWxmLmVsLmFwcGVuZChsaW5rcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5lbDtcbiAgICB9XG5cbn07XG5cblxuXG4vL0dsb2JhbCB2YXJpYWJsZXNcbnZhciBlZGl0ZWRGaWxlc0RhdGEgPSBbXSxcbmVkaXRlZEZpbGVEYXRhID0ge30sXG5jbGFzc0xpc3QgPSBbXSxcbmRhdGFDaGFuZ2VkID0gZmFsc2UsIC8vQ2hhbmdlcyB3aGVuIHVzZXIgbWFrZSBhbnkgY2hhbmdlcyBvbiBlZGl0IHNjcmVlbjtcbmxhc3RTZWxlY3RlZCA9IG51bGwsIC8vSW5kZXggb2YgbGFzdCBTZWxlY3RlZCBlbGVtZW50IGZvciBtdWx0aSBzZWxlY3Q7XG5nYWxsZXJ5T2JqZWN0cyA9IFtdLFxuZHJhZnRJc1NhdmVkID0gZmFsc2U7XG5cbi8vTmV3IEdhbGxlcnkgTWVkaWEgdGFiXG4vLyBDcmVhdGUgRE9NIGVsZW1lbnQgZm9yIEZpbGUgZnJvbSBkYXRhXG5mdW5jdGlvbiBjcmVhdGVGaWxlRWxlbWVudChmKSB7XG4gIHZhciBmaWxlRGF0YSA9IGYuZmlsZURhdGE7XG4gIC8vY3JlYXRlIGJhc2ljIGVsZW1lbnRcbiAgdmFyIGZpbGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlIGZpbGVfdHlwZV9pbWcgZmlsZV92aWV3X2dyaWQnKSxcbiAgZmlsZUluZGV4ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnaGlkZGVuIGZpbGVfX2lkJykudGV4dChmaWxlRGF0YS5pZCksXG5cbiAgZmlsZUltZyA9ICQoJzxkaXY+PC9kaXY+JylcbiAgLmFkZENsYXNzKCdmaWxlX19pbWcnKVxuICAuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgZmlsZURhdGEudXJsICsgJyknKSxcbiAgZmlsZUNvbnRyb2xzID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fY29udHJvbHMnKS5jbGljayh0b2dnbGVGaWxlU2VsZWN0KSxcbiAgZmlsZUNoZWNrbWFyayA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX2NoZWNrbWFyaycpLmNsaWNrKHRvZ2dsZUZpbGVTZWxlY3QpLFxuICBmaWxlRGVsZXRlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fZGVsZXRlJykuY2xpY2soaGFuZGxlRGVsZXRlQ2xpY2spLFxuICBmaWxlVHlwZSA9ICQoJzxkaXY+PGkgY2xhc3M9XCJmYSBmYS1jYW1lcmFcIj48L2k+PC9kaXY+JykuYWRkQ2xhc3MoJ2ZpbGVfX3R5cGUnKSxcbiAgZmlsZUVkaXQgPSAkKCc8YnV0dG9uPkVkaXQ8L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uIGJ1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS13aGl0ZScpLmNsaWNrKGhhbmRsZUZpbGVkRWRpdEJ1dHRvbkNsaWNrKSxcblxuICBmaWxlVGl0bGUgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmaWxlX190aXRsZSBmaWxlX190aXRsZS0tbWVkaWEtY2FyZCcpLnRleHQoZmlsZURhdGEudGl0bGUpLFxuXG4gIGZpbGVQdXJwb3NlID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZmlsZV9fcHVycG9zZScpLFxuICBmaWxlUHVycG9zZVNlbGVjdCA9ICQoJzxkaXY+PC9kaXY+Jyk7XG5cbiAgZmlsZUVkaXRCdXR0b24gPSAkKCc8YnV0dG9uPkVkaXQ8L2J1dHRvbj4nKS5hZGRDbGFzcygnYnV0dG9uIGJ1dHRvbiBidXR0b25fc3R5bGVfb3V0bGluZS1ncmF5IHUtdmlzaWJsZS14cyB1LW5vTWFyZ2luJykuY2xpY2soaGFuZGxlRmlsZWRFZGl0QnV0dG9uQ2xpY2spO1xuXG4gIGZpbGVDb250cm9scy5hcHBlbmQoZmlsZUNoZWNrbWFyaywgZmlsZURlbGV0ZSwgZmlsZVR5cGUsIGZpbGVFZGl0KTtcbiAgZmlsZUltZy5hcHBlbmQoZmlsZUNvbnRyb2xzKTtcblxuICBmaWxlUHVycG9zZS5hcHBlbmQoZmlsZVB1cnBvc2VTZWxlY3QsIGZpbGVFZGl0QnV0dG9uKTtcbiAgcHVycG9zZVNlbGVjdCA9IG5ldyBTZWxlY3Rib3goZmlsZVB1cnBvc2VTZWxlY3QuZ2V0KDApLCB7XG4gICAgbGFiZWw6ICdVc2FnZScsXG4gICAgcGxhY2Vob2xkZXI6ICdTZWxlY3QgVXNhZ2UnLFxuICAgIGl0ZW1zOiBbJ0FsbCBjYXN0JywgJ0Nhc3QgRGV0YWlsJywgJ0hlYWRzaG90JywnRnVsbCBib2R5JywgJ1Byb21vJ10uc29ydCgpXG4gIH0pO1xuXG4gIGZpbGUuYXBwZW5kKGZpbGVJbmRleCwgZmlsZUltZywgZmlsZVRpdGxlLCBmaWxlUHVycG9zZSwgZmlsZUVkaXRCdXR0b24pO1xuXG4gIHJldHVybiBmaWxlO1xufVxuXG5mdW5jdGlvbiBhZGRGaWxlKGZpbGUpIHtcbiAgdmFyIGZpbGVTZWN0aW9uID0gJCgnLmZpbGVzIC5zZWN0aW9uX19maWxlcycpLmdldCgwKTtcblxuICAkKGZpbGVTZWN0aW9uKS5hcHBlbmQoZmlsZSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUdhbGxlcnkoc2Nyb2xsSW5kZXgpIHtcbiAgc2luZ2xlc2VsZWN0ID0gZmFsc2U7XG4gIHZhciBqdXN0VXBsb2FkZWQgPSBmYWxzZTtcblxuICAvLyBSZW1lbWJlciBwb3NpdGlvbiBhbmQgc2VsZWN0aW9uIG9mIGZpbGVzXG4gICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgdmFyIGZpbGUgPSBnYWxsZXJ5T2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZikge1xuICAgICAgcmV0dXJuIGYuZmlsZURhdGEuaWQgPT09ICQoZWwpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcbiAgICB9KVswXTtcbiAgICBpZiAoZmlsZSkge1xuICAgICAgZmlsZS5wb3NpdGlvbiA9IGluZGV4O1xuICAgICAgZmlsZS5zZWxlY3RlZCA9ICQoZWwpLmhhc0NsYXNzKCdzZWxlY3RlZCcpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy9DbGVhciBmaWxlcyBzZWN0aW9uXG4gICQoJy5maWxlcyAuc2VjdGlvbl9fZmlsZXMnKS5lbXB0eSgpO1xuXG4gIC8vU29ydCBhcnJheSBhY29yZGluZyBmaWxlcyBwb3NpdGlvblxuICBnYWxsZXJ5T2JqZWN0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYS5wb3NpdGlvbiAtIGIucG9zaXRpb247XG4gIH0pO1xuXG4gIC8vQ3JlYXRlIGZpbGVzIGZyb20gZGF0YSBhbmQgYWRkIHRoZW0gdG8gdGhlIHBhZ2VcbiAgZm9yICh2YXIgaSA9IDA7IGk8Z2FsbGVyeU9iamVjdHMubGVuZ3RoOyBpKysgKSB7XG4gICAgdmFyIGYgPSBnYWxsZXJ5T2JqZWN0c1tpXSxcbiAgICBmaWxlID0gY3JlYXRlRmlsZUVsZW1lbnQoZik7XG5cbiAgICBpZiAoZi5zZWxlY3RlZCkge2ZpbGUuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7fVxuICAgIGlmIChmLmp1c3RVcGxvYWRlZCkge1xuICAgICAgZmlsZS5hZGRDbGFzcygnanVzdFVwbG9hZGVkJyk7XG4gICAgICBmLmp1c3RVcGxvYWRlZCA9IGZhbHNlO1xuICAgICAganVzdFVwbG9hZGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgYWRkRmlsZShmaWxlKTtcbiAgfVxuICBub3JtYWxpemVTZWxlY3RlaW9uKCk7XG5cbiAgaWYgKHNjcm9sbEluZGV4KSB7XG4gICAgdmFyIHNjcm9sbFRvcCA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZScpLmxhc3QoKS5vZmZzZXQoKS50b3A7XG4gICAgJCgnYm9keScpLmFuaW1hdGUoe1xuICAgICAgc2Nyb2xsVG9wOiBzY3JvbGxUb3BcbiAgICB9LCA0MDApO1xuICB9XG59XG5cblxuLypcbi8vR2xvYmFsIHZhcmlhYmxlc1xudmFyIGVkaXRlZEZpbGVzRGF0YSA9IFtdLFxuZWRpdGVkRmlsZURhdGEgPSB7fSxcbmNsYXNzTGlzdCA9IFtdLFxuZGF0YUNoYW5nZWQgPSBmYWxzZSwgLy9DaGFuZ2VzIHdoZW4gdXNlciBtYWtlIGFueSBjaGFuZ2VzIG9uIGVkaXQgc2NyZWVuO1xubGFzdFNlbGVjdGVkID0gbnVsbCwgLy9JbmRleCBvZiBsYXN0IFNlbGVjdGVkIGVsZW1lbnQgZm9yIG11bHRpIHNlbGVjdDtcbmdhbGxlcnlPYmplY3RzID0gW10sXG5kcmFmdElzU2F2ZWQgPSBmYWxzZTsqL1xuXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICB2YXIgc2Nyb2xsUG9zaXRpb247XG4gIHZhciBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICBcbiAgLy9TdGlja3kgc2Nyb2xsYmFyXG4gIHN0aWNreVRvcGJhciA9IG5ldyBTdGlja3lUb3BiYXIoKTtcbiAgXG4gIC8vTm9ybWFsaXplcnNcbiAgbm9ybWlsaXplTWVudSgpO1xuICBub3JtYWxpemVSZXF1aXJlZENvdW50KCk7XG4gIG5vcm1hbGl6ZVNlbGVjdGVpb24oKTtcbiAgXG4gICQoJy5qcy1jb250ZW50IC5maWxlcyAuc2VjdGlvbl9fZmlsZXMnKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG4gIFxuICAvL0NoZWNrIGZvciByZXF1aXJlZCBmaWVsZHNcbiAgJCgnbGFiZWwucmVxdWllcmVkJykucGFyZW50KCkuY2hpbGRyZW4oJ2lucHV0Jykub24oJ2JsdXInLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGNoZWNrRmllbGQoZS50YXJnZXQpKSB7XG4gICAgICBtYXJrRmllbGRBc05vcm1hbChlLnRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hcmtGaWVsZEFzUmVxdWlyZWQoZS50YXJnZXQpO1xuICAgIH1cbiAgfSk7XG4gIFxuICBcbiAgXG4gIC8vQ2xpY2sgb24gbG9nb1xuICAkKCcuanMtbG9nbycpLmNsaWNrKGhhbmRsZUxvZ29DbGljayk7XG4gIGZ1bmN0aW9uIGhhbmRsZUxvZ29DbGljayhlKSB7XG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJ2NyZWF0ZScpID49IDAgJiZcbiAgICAhZHJhZnRJc1NhdmVkICYmXG4gICAgJCgnLmpzLWNvbnRlbnQgLmZpbGUsIC5qcy1jb250ZW50IC5qcy1oYXNWYWx1ZScpLmxlbmd0aCA+IDApIHtcbiAgICAgIG5ldyBNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAnTGVhdmUgUGFnZT8nLFxuICAgICAgICB0ZXh0OiAnWW91IHdpbGwgbG9zZSBhbGwgdW5zYXZlZCBjaGFuZ2VzLiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gbGVhdmUgdGhpcyBwYWdlPycsXG4gICAgICAgIGNvbmZpcm1UZXh0OiAnTGVhdmUgUGFnZScsXG4gICAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ2Rhc2hib2FyZC5odG1sJztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ2Rhc2hib2FyZC5odG1sJztcbiAgICB9XG4gIH1cbiAgXG4gIC8vQXNzZXQgTGlicmFyeVxuICBcbiAgJCgnI2FsQ2xvc2VCdXR0b24nKS5jbGljayhjbG9zZUFzc2V0TGlicmFyeSk7XG4gICQoJyNhbFRvcENsb3NlQnV0dG9uJykuY2xpY2soY2xvc2VBc3NldExpYnJhcnkpO1xuICAkKCcjYXNzZXRMaWJyYXJ5JykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIG9wZW5Bc3NldExpYnJhcnkoZSk7XG4gIH0pO1xuICBmdW5jdGlvbiBvcGVuQXNzZXRMaWJyYXJ5KGUsIG9wdGlvbnMpIHtcbiAgICBzY3JvbGxQb3NpdGlvbiA9ICQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcbiAgICB1cGRhdGVBc3NldExpYnJhcnkoKTtcbiAgICAkKCcjYWwnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgJCgnI2FsJykuYWRkQ2xhc3MoJ21vZGFsJyk7XG4gICAgJCgnI3dyYXBwZXInKS5hZGRDbGFzcygnb3ZlcmZsb3cnKTtcbiAgICBzaW5nbGVzZWxlY3QgPSBmYWxzZTtcbiAgICAkKCcjYWRkRnJvbUFMQnV0dG9uJykudGV4dCgnQWRkIEZpbGVzJyk7XG4gIFxuICAgICQoJyNhZGRGcm9tQUxCdXR0b24nKS5jbGljayhhZGRGaWxlc0Zyb21Bc3NldExpYnJhcnkpO1xuICAgIHNldE1vZGFsS2V5Ym9hcmRBY3Rpb25zKGFkZEZpbGVzRnJvbUFzc2V0TGlicmFyeSwgY2xvc2VBc3NldExpYnJhcnkpO1xuICAgICQoZS50YXJnZXQpLmJsdXIoKTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gYWRkRmlsZXNGcm9tQXNzZXRMaWJyYXJ5KCl7XG4gICAgbGFzdFNlbGVjdGVkID0gbnVsbDtcbiAgICBhZGRTZWxlY3RlZEZpbGVzKCk7XG4gICAgY2xvc2VBc3NldExpYnJhcnkoKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG4gIH1cbiAgZnVuY3Rpb24gY2xvc2VBc3NldExpYnJhcnkoKSB7XG4gICAgbGFzdFNlbGVjdGVkID0gbnVsbDtcbiAgICAkKCcuYWwgLmZpbGVzIC5zZWN0aW9uX19maWxlcyAuZmlsZS5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgIGRlc2VsZWN0QWxsKCk7XG4gICAgJCgnLm1vZGFsJykuYWRkQ2xhc3MoJ2hpZGRlbicpLnJlbW92ZUNsYXNzKCdtb2RhbCcpO1xuICAgICQoJyN3cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ292ZXJmbG93Jyk7XG4gICAgJCgnI2FkZEZyb21BTEJ1dHRvbicpLnVuYmluZCgnY2xpY2snKTtcbiAgICAkKCdib2R5Jykuc2Nyb2xsVG9wKHNjcm9sbFBvc2l0aW9uKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRXNjS2V5ZG93bik7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG4gIH1cbiAgXG4gICQoJyNhbCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAkKCcjYWwgLmZpbGVzIC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gIH0pO1xuICAkKCcjYWwgLmZpbGVzIC5zZWN0aW9uX19maWxlcycpLmRpc2FibGVTZWxlY3Rpb24oKTtcbiAgXG4gIC8vVXBsb2FkIGZpbGVzXG4gICQoJyN1cGxvYWRGaWxlcycpLmNsaWNrKGhhbmRsZVVwbG9hZEZpbGVzQ2xpY2spO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBoYW5kbGVEcmFnRW50ZXIsIHRydWUpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGhhbmRsZURyYWdPdmVyLCBmYWxzZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBoYW5kbGVEcm9wLCBmYWxzZSk7XG4gIFxuICAvL0RyYWZ0IGZ1bmN0aW9uOiBTYXZlLCBDYW5jZWwsIFB1Ymxpc2hcbiAgZnVuY3Rpb24gc2F2ZURyYWZ0KCkge1xuICAgIHNob3dOb3RpZmljYXRpb24oJ1RoZSBkcmFmdCBpcyBzYXZlZC4nKTtcbiAgICBkcmFmdElzU2F2ZWQgPSB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIHJlbW92ZURyYWZ0KCkge1xuICAgIG5ldyBNb2RhbCh7XG4gICAgICB0aXRsZTogJ0NhbmNlbCB0aGlzIERyYWZ0PycsXG4gICAgICB0ZXh0OiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGNhbmNlbCBhbmQgZGlzY2FyZCB0aGlzIGRyYWZ0PycsXG4gICAgICBjb25maXJtVGV4dDogJ0NhbmNlbCcsXG4gICAgICBjb25maXJtQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnZGFzaGJvYXJkLmh0bWwnO1xuICAgICAgfSxcbiAgICAgIGNhbmNlbEFjdGlvbjogaGlkZU1vZGFsUHJvbXB0XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gcHVibGlzaERyYWZ0KCkge1xuICAgIHZhciBpdGVtTmFtZSA9ICQoJy5tZW51IC5pcy1hY3RpdmUnKS50ZXh0KCksXG4gICAgcHJvbXB0TXNnID0gJyc7XG4gIFxuICAgIHN3aXRjaCAoaXRlbU5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgY2FzZSAncGVyc29uJzpcbiAgICAgIHByb21wdE1zZyA9ICdQdWJsaXNoZWQgcGVyc29uIHdpbGwgYmVjb21lIGF2YWlsYWJsZSB0byBiZSBhZGRlZCBhcyBwYXJ0IG9mIGEgY2FzdCBmb3IgYSBzZWFzb24vZXZlbnQuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwdWJsaXNoIGl0Pyc7XG4gICAgICBicmVhaztcbiAgXG4gICAgICBjYXNlICdyb2xlJzpcbiAgICAgIHByb21wdE1zZyA9ICdQdWJsaXNoZWQgcm9sZSB3aWxsIGJlY29tZSBhdmFpbGFibGUgdG8gYmUgYWRkZWQgYXMgcGFydCBvZiBhIGNhc3QgZm9yIGEgc2Vhc29uL2V2ZW50LiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHVibGlzaCBpdD8nO1xuICAgICAgYnJlYWs7XG4gIFxuICAgICAgZGVmYXVsdDpcbiAgICAgIHByb21wdE1zZyA9ICdQdWJsaXNoZWQgJyArIGl0ZW1OYW1lLnRvTG93ZXJDYXNlKCkgKyAnIHdpbGwgYmVjb21lIGF2YWlsYWJsZSBvbiB0aGUgbGl2ZSBzaXRlLiBBcmUgeW91IHN1cmUgeW91IHdvdWxkIGxpa2UgdG8gcHVibGlzaCBpdD8nO1xuICAgICAgYnJlYWs7XG4gIFxuICAgIH1cbiAgICBuZXcgTW9kYWwoe1xuICAgICAgdGl0bGU6ICdQdWJsaXNoIHRoaXMgJyArIGl0ZW1OYW1lICsgJz8nLFxuICAgICAgdGV4dDogcHJvbXB0TXNnLFxuICAgICAgY29uZmlybVRleHQ6ICdQdWJsaXNoJyxcbiAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICBoaWRlTW9kYWxQcm9tcHQoKTtcbiAgICAgICAgc2hvd05vdGlmaWNhdGlvbihpdGVtTmFtZSArICcgaXMgcHVibGlzaGVkLicpO1xuICAgICAgICBkcmFmdElzU2F2ZWQgPSB0cnVlO1xuICAgICAgfSxcbiAgICAgIGNhbmNlbEFjdGlvbjogaGlkZU1vZGFsUHJvbXB0XG4gICAgfSk7XG4gIH1cbiAgXG4gICQoJyNzYXZlRHJhZnQnKS5jbGljayhzYXZlRHJhZnQpO1xuICAkKCcjcmVtb3ZlRHJhZnQnKS5jbGljayhyZW1vdmVEcmFmdCk7XG4gICQoJyNwdWJsaXNoRHJhZnQnKS5jbGljayhwdWJsaXNoRHJhZnQpO1xuICBcbiAgLy9Ub3AgYmFyIGFjdGlvbnMgZHJvcGRvd24gZm9yIG1vYmlsZVxuICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGlvbkRyb3Bkb3duJykpIHtcbiAgICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGlvbkRyb3Bkb3duJyksXG4gICAgICB7XG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1jaGVja1wiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgU2F2ZSBhcyBkcmFmdDwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IHNhdmVEcmFmdFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1iYW5cIj48L2k+PHNwYW4gY2xhc3M9XCJidXR0b25UZXh0XCI+ICBDYW5jZWw8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiByZW1vdmVEcmFmdFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgICk7XG4gIH1cbiAgXG4gIC8vRmlsZXMgbW9yZSBhY3Rpb24gZHJvcGRvd25zXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9yZUFjdGlvbnMnKSkge1xuICAgIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9yZUFjdGlvbnMnKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICdTZW5kIHRvIHRvcCcsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlU2VuZFRvVG9wQ2xpY2tcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJ1NlbmQgdG8gYm90dG9tJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVTZW5kVG9Cb3R0b21DbGlja1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgICk7XG4gIH1cbiAgXG4gIC8vTWVkaWEgY2FyZCBkcm9wZG93bnNcbiAgLy9TbWFsbFxuICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lZGlhQWN0aW9uc1NtYWxsJykpIHtcbiAgICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lZGlhQWN0aW9uc1NtYWxsJyksXG4gICAgICB7XG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS11cGxvYWRcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIFVwbG9hZCBmaWxlczwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZVVwbG9hZEZpbGVzQ2xpY2tcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtZm9sZGVyLW9wZW5cIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIEFkZCBmcm9tIGxpYnJhcnk8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIG9wZW5Bc3NldExpYnJhcnkoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICAvL0Z1bGxcbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZWRpYUFjdGlvbnNGdWxsJykpIHtcbiAgICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lZGlhQWN0aW9uc0Z1bGwnKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXBlbmNpbC1zcXVhcmVcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIE11bHRpIEVkaXQ8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVNdWx0aUVkaXRCdXR0b25DbGljayxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI211bHRpRWRpdCcpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtdGltZXMtY2lyY2xlXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBSZW1vdmU8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVCdWxrUmVtb3ZlQ2xpY2ssXG4gICAgICAgICAgICBkaXNhYmxlZDogZnVuY3Rpb24oKSB7cmV0dXJuICQoJyNidWxrUmVtb3ZlJykuaGFzQ2xhc3MoJ2Rpc2FibGVkJyk7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGl2aWRlcjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS11cGxvYWRcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIFVwbG9hZCBmaWxlczwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZVVwbG9hZEZpbGVzQ2xpY2tcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtZm9sZGVyLW9wZW5cIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIEFkZCBmcm9tIGxpYnJhcnk8L3NwYW4+JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIG9wZW5Bc3NldExpYnJhcnkoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBcbiAgLy9Bc3NldCBsaWJyYXJ5IGRyb3Bkb3duc1xuICAvL1NtYWxsXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNzZXRBY3Rpb25zU21hbGwnKSkge1xuICAgIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNzZXRBY3Rpb25zU21hbGwnKSxcbiAgICAgIHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgVXBsb2FkIGZpbGVzPC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlVXBsb2FkRmlsZXNDbGlja1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgICk7XG4gIH1cbiAgLy9GdWxsXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNzZXRBY3Rpb25zRnVsbCcpKSB7XG4gICAgdmFyIHBhZ2VBY3Rpb25Ecm9wZG93biA9IG5ldyBEcm9wZG93bihcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc3NldEFjdGlvbnNGdWxsJyksXG4gICAgICB7XG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1wZW5jaWxcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIEJ1bGsgRWRpdDwvc3Bhbj48c3BhbiBjbGFzcz1cImRyb3Bkb3duX193YXJuaW5nXCI+PC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2ssXG4gICAgICAgICAgICBkaXNhYmxlZDogZnVuY3Rpb24oKSB7cmV0dXJuICQoJyNidWxrRWRpdCcpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO30sXG4gICAgICAgICAgICB3YXJuaW5nOiBmdW5jdGlvbigpIHtyZXR1cm4gISQoJyNidWxrRWRpdCcpLmNoaWxkcmVuKCcuYnV0dG9uX193YXJuaW5nJykuaGFzQ2xhc3MoJ2lzLWhpZGRlbicpO31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtcGVuY2lsLXNxdWFyZVwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgTXVsdGkgRWRpdDwvc3Bhbj48c3BhbiBjbGFzcz1cImRyb3Bkb3duX193YXJuaW5nXCI+PC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2ssXG4gICAgICAgICAgICBkaXNhYmxlZDogZnVuY3Rpb24oKSB7cmV0dXJuICQoJyNtdWx0aUVkaXQnKS5oYXNDbGFzcygnZGlzYWJsZWQnKTt9LFxuICAgICAgICAgICAgd2FybmluZzogZnVuY3Rpb24oKSB7cmV0dXJuICEkKCcjbXVsdGlFZGl0JykuY2hpbGRyZW4oJy5idXR0b25fX3dhcm5pbmcnKS5oYXNDbGFzcygnaXMtaGlkZGVuJyk7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS10aW1lcy1jaXJjbGVcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIFJlbW92ZTwvc3Bhbj4nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZUJ1bGtSZW1vdmVDbGljayxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI2J1bGtSZW1vdmUnKS5oYXNDbGFzcygnZGlzYWJsZWQnKTt9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkaXZpZGVyOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgVXBsb2FkIGZpbGVzPC9zcGFuPicsXG4gICAgICAgICAgICBjYWxsYmFjazogaGFuZGxlVXBsb2FkRmlsZXNDbGlja1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgICk7XG4gIH1cbiAgXG4gIFxuICAvL0luaXQgcGxhY2Vob2xkZXJzIGZvciBpbWFnZXMgaWYgYW55IChjb3ZlciwgZXRjLilcbiAgd2luZG93LmltYWdlUGxhY2Vob2xkZXJzID0gaW5pdEltYWdlUGxhY2Vob2xkZXJzKCk7XG4gIFxuICAvL0ZvY2FsIHBvaW50XG4gICQoJyNmb2NhbFBvaW50VG9nZ2xlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICQoZS50YXJnZXQpLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUgYnV0dG9uX3N0eWxlX291dGxpbmUtd2hpdGUgYnV0dG9uX3N0eWxlX291dGxpbmUtYWNjZW50Jyk7XG4gICAgJCgnLnByID4gLnByZXZpZXcnKS50b2dnbGVDbGFzcygnZm9jYWwgbGluZSBwb2ludCcpO1xuICBcbiAgfSk7XG4gIC8qIEhhbmRsZSBQdXJwb3NlcyBzY3JvbGwgKi9cbiAgJCgnI3B1cnBvc2VXcmFwcGVyJykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuICAgIHNldFB1cnBvc2VQYWdpbmF0aW9uKCk7XG4gIH0pO1xuICBcbiAgJCgnI2ZvY2FsUG9pbnQnKS5kcmFnZ2FibGUoe1xuICAgIGNvbnRhaW5tZW50OiBcIiNwcmV2aWV3SW1nXCIsXG4gICAgc2Nyb2xsOiBmYWxzZSAsXG4gICAgc3RvcDogZnVuY3Rpb24oZSkge1xuICAgICAgYWRqdXN0Rm9jYWxQb2ludCgpO1xuICAgICAgYWRqdXN0UHVycG9zZSgkKGUudGFyZ2V0KSk7XG4gICAgICBkYXRhQ2hhbmdlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcbiAgLyogSW5pdCBQdXJwb3NlIFBhZ2luYXRvciAqL1xuICBcbiAgZnVuY3Rpb24gc2V0UHVycG9zZVBhZ2luYXRpb24oKSB7XG4gICAgdmFyIHNjcm9sbE9mZnNldCA9ICQoJyNwdXJwb3NlV3JhcHBlcicpLnNjcm9sbExlZnQoKTtcbiAgICB2YXIgd2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHVycG9zZVdyYXBwZXInKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICB2YXIgZmlyc3RJbmRleCA9IE1hdGguZmxvb3Ioc2Nyb2xsT2Zmc2V0LzE0MCkgKyAxO1xuICAgIHZhciBsYXN0SW5kZXggPSBmaXJzdEluZGV4ICsgTWF0aC5yb3VuZCh3aWR0aC8xNDApIC0gMTtcbiAgICB2YXIgY291bnQgPSAkKCcjcHVycG9zZVdyYXBwZXIgLnB1cnBvc2UnKS5sZW5ndGg7XG4gIFxuICAgIGxhc3RJbmRleCA9IGxhc3RJbmRleCA8IGNvdW50ID8gbGFzdEluZGV4IDogY291bnQ7XG4gIFxuICAgICQoJyNwLXBhZ2luYXRvcicpLnRleHQoZmlyc3RJbmRleCArICcg4oCUICcgKyBsYXN0SW5kZXggKyAnIG9mICcgKyBjb3VudCk7XG4gIH1cbiAgXG4gICQoJyNzaG93UHJldmlldycpLmNsaWNrKHNob3dBbGxQcmV2aWV3cyk7XG4gICQoJyNoaWRlUHVycG9zZScpLmNsaWNrKGhpZGVBbGxQcmV2aWV3cyk7XG4gICQoJyNsb2FkTW9yZScpLmNsaWNrKGhhbmRsZVNob3dNb3JlKTtcbiAgXG4gIGZ1bmN0aW9uIHNob3dBbGxQcmV2aWV3cygpIHtcbiAgICAkKCcjcHVycG9zZXMnKS5hZGRDbGFzcygnaXMtb3BlbicpO1xuICAgICQoJyNwcmV2aWV3SW1hZ2UnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgJCgnI3ByZXZpZXdDb250cm9scycpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgXG4gICAgLy9DaGVjayBpZiBpdCBpcyBhIG1vYmlsZSBzY3JlZW5cbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCA2NTApIHtcbiAgICAgICQoXCIjcHVycG9zZXMgLmMtUHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlXCIpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICQoXCIjcHVycG9zZXMgLmMtUHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlLmhpZGRlblwiKS5zbGljZSgwLCA1KS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAkKCcjbG9hZE1vcmUnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgfVxuICAgIC8vJCgnLnByZXZpZXcuZm9jYWwnKS5hZGRDbGFzcygnZnVsbCcpLnJlbW92ZUNsYXNzKCdsaW5lJyk7XG4gICAgLy8kKCcjcHVycG9zZVRvZ2dsZScpLmNoaWxkcmVuKCdzcGFuJykudGV4dCgnSGlkZSBQcmV2aWV3Jyk7XG4gIH1cbiAgZnVuY3Rpb24gaGlkZUFsbFByZXZpZXdzKCkge1xuICAgICQoJyNwdXJwb3NlcycpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XG4gICAgJCgnI3ByZXZpZXdJbWFnZScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAkKCcjcHJldmlld0NvbnRyb2xzJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZVNob3dNb3JlKGUpIHtcbiAgICAkKFwiI3B1cnBvc2VzIC5jLVB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZS5oaWRkZW5cIikuc2xpY2UoMCwgNSkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgIGlmICgkKFwiI3B1cnBvc2VzIC5jLVB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZS5oaWRkZW5cIikubGVuZ3RoID09PSAwKSB7XG4gICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgfVxuICB9XG4gIFxuICBcbiAgLy9TZWxlY3RlZCBGaWxlcyBhY3Rpb25zXG4gICQoJyNidWxrRWRpdCcpLmNsaWNrKGhhbmRsZUJ1bGtFZGl0QnV0dG9uQ2xpY2spO1xuICAkKCcjbXVsdGlFZGl0JykuY2xpY2soaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2spO1xuICAkKCcjYnVsa1JlbW92ZScpLmNsaWNrKGhhbmRsZUJ1bGtSZW1vdmVDbGljayk7XG4gIFxuICBmdW5jdGlvbiBoYW5kbGVCdWxrUmVtb3ZlQ2xpY2soKSB7XG4gICAgdmFyIGZpbGVzVG9EZWxldGUgPSAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKSxcbiAgICBpdGVtTmFtZSA9ICQoJy5tZW51IC5pcy1hY3RpdmUnKS50ZXh0KCkudG9Mb3dlckNhc2UoKSxcbiAgICBhc3NldExpYnJhcnkgPSBpdGVtTmFtZSA9PT0gJ2Fzc2V0IGxpYnJhcnknLFxuICAgIG1zZ1RpdGxlID0gYXNzZXRMaWJyYXJ5PyAnRGVsZXRlIEFzc2V0cz8nIDogJ1JlbW92ZSBBc3NldHM/JyxcbiAgICBtZXNnVGV4dCA9IGFzc2V0TGlicmFyeT8gJ1NlbGVjdGVkIGFzc2V0KHMpIHdpbGwgYmUgZGVsZXRlZCBmcm9tIHRoZSBhc3NldCBsaWJyYXJ5LiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoZW0/JyA6ICdTZWxlY3RlZCBhc3NldChzKSB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGlzICcgKyBpdGVtTmFtZSArICcuIERvbuKAmXQgd29ycnksIGl0IHdvbuKAmXQgYmUgZGVsZXRlZCBmcm9tIHRoZSBBc3NldCBMaWJyYXJ5LicsXG4gICAgYnRuTmFtZSA9IGFzc2V0TGlicmFyeT8gJ0RlbGV0ZScgOiAnUmVtb3ZlJztcbiAgICBuZXcgTW9kYWwoe1xuICAgICAgdGl0bGU6IG1zZ1RpdGxlLFxuICAgICAgdGV4dDogbWVzZ1RleHQsXG4gICAgICBjb25maXJtVGV4dDogYnRuTmFtZSxcbiAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICBmaWxlc1RvRGVsZXRlLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICAgICB2YXIgaWQgPSAkKGVsKS5maW5kKCcuZmlsZV9faWQnKS50ZXh0KCk7XG4gICAgICAgICAgZGVsZXRlRmlsZUJ5SWQoaWQsIGdhbGxlcnlPYmplY3RzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHVwZGF0ZUdhbGxlcnkoKTtcbiAgICAgIH0sXG4gICAgICBjYW5jZWxBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2JyJykucmVtb3ZlQ2xhc3MoJ3NicicpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIFxuICAvL0ZpbGUgRWRpdCBTYXZlIGFuZCBDYW5jZWxcbiAgJCgnI3NhdmVDaGFuZ2VzJykuY2xpY2soc2F2ZUltYWdlRWRpdCk7XG4gICQoJyNjYW5jZWxDaGFuZ2VzJykuY2xpY2soY2FuY2VsSW1hZ2VFZGl0KTtcbiAgJCgnI2ZwVG9wQ2xvc2VCdXR0b24nKS5jbGljayhjYW5jZWxJbWFnZUVkaXQpO1xuICBcbiAgLy9GaWxlIEVkaXQgZmllbGQgY2hhbmdlc1xuICAkKCcjdGl0bGUnKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKSB7c2F2ZVRpdGxlKCk7fSk7XG4gICQoJyNjYXB0aW9uJykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVDYXB0aW9uKCk7fSk7XG4gICQoJyNkZXNjcmlwdGlvbicpLm9uKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtzYXZlRGVzY3JpcHRpb24oKTt9KTtcbiAgJCgnI3Jlc29sdXRpb24nKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge3NhdmVSZXNvbHV0aW9uKCk7fSk7XG4gICQoJyNhbHRUZXh0Jykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVBbHRUZXh0KCk7fSk7XG4gIFxuICAvL0hhbmRsZSBzZWxlY3Rpb25zXG4gICQoJyNzZWxlY3RBbGwnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgaWYgKCQoZS50YXJnZXQpLmhhc0NsYXNzKCdlbXB0eScpKSB7XG4gICAgICBzZWxlY3RBbGwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVzZWxlY3RBbGwoKTtcbiAgICB9XG4gIH0pO1xuICAkKCcjZGVzZWxlY3RBbGwnKS5jbGljayhmdW5jdGlvbihlKSB7ZGVzZWxlY3RBbGwoKTt9KTtcbiAgXG4gIC8vSW5pdCBhZGRhYmxlIGZpZWxkc1xuICBpbml0QWRkYWJsZUZpZWxkcygpO1xuICBcbiAgXG4gIFxuICBcbiAgXG4gIC8vYXV0b2V4cGFuZGFibGUgdGV4dGFyZWFcbiAgJCggJ3RleHRhcmVhJyApLmVsYXN0aWMoKTtcbiAgXG4gIFxuICBcbiAgLypcbiAgKiBDYXJkc1xuICAqL1xuICBcbiAgLy9Gb2xkYWJsZSBjYXJkc1xuICAkKCcuanMtZm9sZGFibGUgLmpzLWZvbGRlZFRvZ2dsZScpLmNsaWNrKGhhbmRsZUZvbGRlZFRvZ2dsZUNsaWNrKTtcbiAgZnVuY3Rpb24gaGFuZGxlRm9sZGVkVG9nZ2xlQ2xpY2soZSkge1xuICAgIHZhciBjYXJkID0gJChlLnRhcmdldCkucGFyZW50cygnLmpzLWZvbGRhYmxlJyk7XG4gICAgaWYgKGNhcmQuaGFzQ2xhc3MoJ2lzLWZvbGRlZCcpKSB7XG4gICAgICBjYXJkLnJlbW92ZUNsYXNzKCdpcy1mb2xkZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FyZC5hZGRDbGFzcygnaXMtZm9sZGVkJyk7XG4gICAgfVxuICB9XG4gIC8vU3RpY2t5IGNhcmQgaGVhZGVyXG4gICQoJy5qcy1zdGlja3lPbk1vYmlsZScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgdmFyIHN0aWNreSA9IG5ldyBTdGlja2FibGUoZWwsIHtcbiAgICAgIG1heFdpZHRoOiA2MDAsXG4gICAgICBib3VuZGFyeTogdHJ1ZSxcbiAgICAgIG9mZnNldDogNTBcbiAgICB9KTtcbiAgfSk7XG4gICQoJy5qcy1zZWN0aW9uVGl0bGUnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgIHZhciBzdGlja3kgPSBuZXcgU3RpY2thYmxlKGVsLCB7XG4gICAgICBtYXhXaWR0aDogNjAwLFxuICAgICAgYm91bmRhcnk6ICcjbWVkaWEtY2FyZCcsXG4gICAgICBvZmZzZXQ6IDEwNFxuICAgIH0pO1xuICB9KTtcbiAgXG4gIC8vQW5pbWF0aW9uIGVuZCBoYW5kbGVcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBzd2l0Y2ggKGUuYW5pbWF0aW9uTmFtZSkge1xuICAgICAgY2FzZSAnY29sbGVjdGlvbkl0ZW0tcHVsc2Utb3V0JzpcbiAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdpcy1hcHBlYXJpbmcnKTtcbiAgICAgIHJldHVybiBlO1xuICBcbiAgICAgIGNhc2UgJ2ltZy13cmFwcGVyLXNsaWRlLWxlZnQnOlxuICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2lzLXNsaWRpbmdMZWZ0Jyk7XG4gICAgICByZXR1cm4gZTtcbiAgXG4gICAgICBjYXNlICdpbWctd3JhcHBlci1zbGlkZS1yaWdodCc6XG4gICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnaXMtc2xpZGluZ1JpZ2h0Jyk7XG4gICAgICByZXR1cm4gZTtcbiAgXG4gICAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGU7XG4gICAgfVxuICB9KTtcbiAgXG4gIFxuICBcbiAgXG4gIC8vUmVjdXJyaW5nIHRvZ2dsZVxuICAkKCcjcmVjdXJyaW5nVG9nZ2xlJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoZS50YXJnZXQuY2hlY2tlZCkge1xuICAgICAgJCgnI3JlY3VyaW5nVGltZScpLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcjcmVjdXJpbmdUaW1lJykuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgfVxuICB9KTtcblxuXG4gIC8vVXBkYXRlIE1lZGlhIFRhYiBmaWxlc1xuICB1cGRhdGVBc3NldExpYnJhcnkoKTtcbiAgbm9ybWFsaXplU2VsZWN0ZWlvbigpO1xuXG4vKlxuICAvL0ZpbGVzIHNlY3Rpb25cbiAgJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5zZWN0aW9uX19maWxlcycpLmRpc2FibGVTZWxlY3Rpb24oKTtcbiAgJCgnLmpzLWNvbnRlbnQgLnNlY3Rpb25fX2ZpbGVzJykuc29ydGFibGUoe1xuICAgIHBsYWNlaG9sZGVyOiAnZmlsZS0tcGxhY2Vob2xkZXInLFxuICAgIGN1cnNvcjogJy13ZWJraXQtZ3JhYmJpbmcnLFxuICAgIHN0YXJ0OiBmdW5jdGlvbihlLCB1aSkge1xuICAgICAgdmFyIHNlbGVjdGVkSW1hZ2VzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkJyk7XG4gICAgICBpZiAoc2VsZWN0ZWRJbWFnZXMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgZHJhZ2dhYmxlSW1hZ2VzID0gJCgnLmpzLWNvbnRlbnQgLmZpbGVzIC5maWxlLnNlbGVjdGVkJykubm90KHVpLml0ZW0pLmNsb25lKHRydWUpO1xuICAgICAgICBzZWxlY3RlZEltYWdlcyA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpLm5vdCh1aS5pdGVtKS5jbG9uZSh0cnVlKTtcblxuICAgICAgICAvL0NyZWF0ZSBmaWxlcyBjb3BpZXMgdG8gRHJhZ1xuICAgICAgICB2YXIgdGFyZ2V0RmlsZV8xID0gdWkuaXRlbS5jbG9uZSh0cnVlKTtcbiAgICAgICAgdmFyIHRhcmdldEZpbGVfMiA9IHVpLml0ZW0uY2xvbmUodHJ1ZSk7XG4gICAgICAgIGRyYWdnYWJsZUltYWdlcyA9IHRhcmdldEZpbGVfMS5hZGQoZHJhZ2dhYmxlSW1hZ2VzKTsvL3dpbGwgcGFzdCBvbiBhIHBhZ2UgYWZ0ZXIgZHJhZ2dpbmcgc3RvcFxuICAgICAgICBzZWxlY3RlZEltYWdlcyA9IHNlbGVjdGVkSW1hZ2VzLmFkZCh0YXJnZXRGaWxlXzIpOy8vdGhpcyBlbGVtZW50cyB3aWxsIGRyYWdnaW5nIGJ5IHVzZXJcbiAgICAgICAgc2VsZWN0ZWRJbWFnZXMuZmluZCgnLmZpbGVfX2FycmFnZW1lbnQsIC5maWxlX19jb250cm9scywgLmZpbGVfX3RpdGxlLCAuZmlsZV9fY2FwdGlvbicpLnJlbW92ZSgpO1xuXG4gICAgICAgIHNlbGVjdGVkSW1hZ2VzXG4gICAgICAgIC5yZW1vdmVDbGFzcygnZmlsZV92aWV3X2dyaWQnKVxuICAgICAgICAuY3NzKCd3aWR0aCcsIDI1MClcbiAgICAgICAgLmNzcygnaGVpZ2h0JywgMTcwKTtcblxuICAgICAgICBzZWxlY3RlZEltYWdlcy5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgICAgJChlbCkuY3NzKCd0cmFuc2Zvcm0nLCAncm90YXRlKCcgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqNjAgLSA2MCkvMTAgKyAnZGVnKSB0cmFuc2xhdGUoJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoyMDAgLSAyMDApLzEwICsgJ3B4LCAnICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjIwMCAtIDIwMCkvMTAgKyAncHgpJyApO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcuanMtY29udGVudCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKS5ub3QodWkuaXRlbSkucmVtb3ZlKCk7XG4gICAgICAgIGRyYWdnYWJsZUltYWdlcy5hZGRDbGFzcygnZmlsZV9kcmFnZ2luZycpO1xuICAgICAgICB1aS5pdGVtLnJlbW92ZUNsYXNzKCdmaWxlJykuYWRkQ2xhc3MoJ2RyYWdGaWxlc1dyYXBwZXInKTtcbiAgICAgICAgdWkuaXRlbS5lbXB0eSgpO1xuICAgICAgICB1aS5pdGVtLmFwcGVuZChzZWxlY3RlZEltYWdlcyk7XG5cbiAgICAgICAgJCgnLmpzLWNvbnRlbnQgLnNlY3Rpb25fX2ZpbGVzJykuc29ydGFibGUoIFwicmVmcmVzaFwiICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1aS5pdGVtLmFkZENsYXNzKCdpcy1kcmFnZ2luZycpO1xuICAgICAgfVxuICAgIH0sXG4gICAgc3RvcDogZnVuY3Rpb24oZSwgdWkpIHtcbiAgICAgIGlmICh1aS5pdGVtLmhhc0NsYXNzKCdkcmFnRmlsZXNXcmFwcGVyJykpIHtcbiAgICAgICAgdWkuaXRlbS5hZnRlcihkcmFnZ2FibGVJbWFnZXMucmVtb3ZlQXR0cignc3R5bGUnKSk7XG4gICAgICAgIHVpLml0ZW0ucmVtb3ZlKCk7XG4gICAgICAgICQoXCIuc2VsZWN0ZWRcIikucmVtb3ZlQ2xhc3MoXCJmaWxlX2RyYWdnaW5nXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdWkuaXRlbS5yZW1vdmVDbGFzcygnaXMtZHJhZ2dpbmcnKTtcbiAgICAgIH1cbiAgICAgICQoJy5maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAgICAgbm9ybWFsaXplSW5kZXgoKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vU2VsZWN0ZWQgRmlsZXMgYWN0aW9uc1xuICAkKCcjbXVsdGlFZGl0JykuY2xpY2soaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2spO1xuICAkKCcjYnVsa0VkaXQnKS5jbGljayhoYW5kbGVCdWxrRWRpdEJ1dHRvbkNsaWNrKTtcbiAgJCgnI2J1bGtSZW1vdmUnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICB2YXIgZmlsZXNUb0RlbGV0ZSA9ICQoJy5jdCAuZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKTtcbiAgICBzaG93TW9kYWxQcm9tcHQoe1xuICAgICAgdGl0bGU6ICdSZW1vdmUgQXNzZXQ/JyxcbiAgICAgIHRleHQ6ICdTZWxlY3RlZCBhc3NldChzKSB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGlzIHNlcmllcy4gRG9u4oCZdCB3b3JyeSwgaXQgd29u4oCZdCBiZSByZW1vdmVkIGZyb20gdGhlIEFzc2V0IExpYnJhcnkuJyxcbiAgICAgIGNvbmZpcm1UZXh0OiAnUmVtb3ZlJyxcbiAgICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICBoaWRlTW9kYWxQcm9tcHQoKTtcbiAgICAgICAgZmlsZXNUb0RlbGV0ZS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgICAgdmFyIGlkID0gJChlbCkuZmluZCgnLmZpbGVfX2lkJykudGV4dCgpO1xuICAgICAgICAgIGRlbGV0ZUZpbGVCeUlkKGlkICxnYWxsZXJ5T2JqZWN0cyk7XG4gICAgICAgIH0pO1xuICAgICAgICB1cGRhdGVHYWxsZXJ5KCk7XG4gICAgICB9LFxuICAgICAgY2FuY2VsQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaGlkZU1vZGFsUHJvbXB0KCk7XG4gICAgICAgICQoJy5jdCAuZmlsZXMgLmZpbGUuc2JyJykucmVtb3ZlQ2xhc3MoJ3NicicpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICAvL0ZpbGUgRWRpdCBTYXZlIGFuZCBDYW5jZWxcbiAgJCgnI3NhdmVDaGFuZ2VzJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVtcHR5RmllbGRzID0gY2hlY2tGaWVsZHMoJy5wciBsYWJlbC5yZXF1aWVyZWQnKTtcbiAgICBpZiAoZW1wdHlGaWVsZHMpIHtcbiAgICAgIHNob3dOb3RpZmljYXRpb24oJ1RoZSBjaGFuZ2UgaW4gdGhlIG1ldGFkYXRhIGlzIHNhdmVkIGluIHRoZSBBc3NldCBMaWJyYXJ5LicpO1xuICAgICAgZWRpdGVkRmlsZXNEYXRhLmZvckVhY2goZnVuY3Rpb24oZmQpIHtcbiAgICAgICAgZ2FsbGVyeU9iamVjdHMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG4gICAgICAgICAgaWYgKGYuZmlsZURhdGEuaWQgPT09IGZkLmZpbGVEYXRhLmlkKSB7XG4gICAgICAgICAgICBmID0gZmQ7XG4gICAgICAgICAgICBmLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7Y2xvc2VFZGl0U2NyZWVuKCk7fSwgMjAwMCk7XG4gICAgICBkZXNlbGVjdEFsbCgpO1xuICAgICAgdXBkYXRlR2FsbGVyeSgpO1xuICAgIH1cbiAgfSk7XG4gICQoJyNjYW5jZWxDaGFuZ2VzJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgaWYgKGRhdGFDaGFuZ2VkKSB7XG4gICAgICBzaG93TW9kYWxQcm9tcHQoe1xuICAgICAgICBkaWFsb2c6IHRydWUsXG4gICAgICAgIHRpdGxlOiAnQ2FuY2VsIENoYW5nZXM/JyxcbiAgICAgICAgdGV4dDogJ0FsbCBjaGFuZ2VzIHRoYXQgeW91IG1hZGUgd2lsbCBiZSBsb3N0LiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gY2FuY2VsIGNoYW5nZXM/JyxcbiAgICAgICAgY29uZmlybVRleHQ6ICdDYW5jZWwnLFxuICAgICAgICBjb25maXJtQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBoaWRlTW9kYWxQcm9tcHQoKTtcbiAgICAgICAgICBjbG9zZUVkaXRTY3JlZW4oKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FuY2VsQWN0aW9uOiBoaWRlTW9kYWxQcm9tcHRcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbG9zZUVkaXRTY3JlZW4oKTtcbiAgICB9XG4gIH0pOyovXG5cblxuICAvL0NoZWNrIGZvciByZXF1aXJlZCBmaWVsZHNcbiAgJCgnbGFiZWwucmVxdWllcmVkJykucGFyZW50KCkuY2hpbGRyZW4oJ2lucHV0Jykub24oJ2JsdXInLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGNoZWNrRmllbGQoZS50YXJnZXQpKSB7XG4gICAgICBtYXJrRmllbGRBc05vcm1hbChlLnRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hcmtGaWVsZEFzUmVxdWlyZWQoZS50YXJnZXQpO1xuICAgIH1cbiAgfSk7XG5cblxuXG5cbiAgLy9Jbml0IERhdGVwaWNrZXJzXG4gIC8qJCgnLmpzLWRhdGVwaWNrZXInKS5kYXRlcGlja2VyKHtcbiAgLy9jaGFuZ2VNb250aDogdHJ1ZSxcbiAgLy9jaGFuZ2VZZWFyOiB0cnVlXG59KTsqL1xuXG4vKiBSYWRpbyBUb2dnbGUgKi9cbiQoJy5yYWRpb1RvZ2dsZSBsaScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgJChlLnRhcmdldCkucGFyZW50KCkuY2hpbGRyZW4oJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICQoZS50YXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgaWYgKGUudGFyZ2V0LmlubmVySFRNTCA9PT0gXCJXZWIgU2VyaWVzXCIpIHtcbiAgICAkKCcjcmVnLXNjLWR1cmF0aW9uLCAjcHJvZy10aW1lZnJhbWUnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gIH0gZWxzZSBpZiAoZS50YXJnZXQuaW5uZXJIVE1MID09PSBcIlRWIFNlcmllc1wiKSB7XG4gICAgJCgnI3JlZy1zYy1kdXJhdGlvbiwgI3Byb2ctdGltZWZyYW1lJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICB9XG59KTtcblxuLypcbi8vSW1wb3J0IENhc3RcbiQoJyNpbXBvcnRDYXN0QnRuJykuY2xpY2sodG9nZ2xlQ2FzdEltcG9ydCk7XG4kKCcjaW1wb3J0Q2FzdENhbmNlbEJ0bicpLmNsaWNrKGhpZGVDYXN0SW1wb3J0KTtcbiQoJyNpbXBvcnRDYXN0Q29uZmlybUJ0bicpLmNsaWNrKGltcG9ydENhc3QpO1xuXG5mdW5jdGlvbiB0b2dnbGVDYXN0SW1wb3J0KGUpIHtcbiAgJCgnI2ltcG9ydENhc3RTZWN0aW9uJykudG9nZ2xlQ2xhc3MoJ2hpZGRlbicpO1xuICAkKCcjaW1wb3J0Q2FzdEJ0bicpLnRvZ2dsZUNsYXNzKCdpcy1zZWxlY3RlZCcpO1xufVxuZnVuY3Rpb24gaGlkZUNhc3RJbXBvcnQoKSB7XG4gICQoJyNpbXBvcnRDYXN0U2VjdGlvbicpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgJCgnI2ltcG9ydENhc3RCdG4nKS5yZW1vdmVDbGFzcygnaXMtc2VsZWN0ZWQnKTtcbn0qL1xufSk7Il0sImZpbGUiOiJjcmVhdGUtc2VyaWVzLWJhc2ljLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
